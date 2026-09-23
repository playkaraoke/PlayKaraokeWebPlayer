/**
 * Play Karaoke — busca Online (Cloudflare Worker).
 *
 * Único endpoint: GET /search?q=<termo>
 *   -> { results: [{ videoId, title, channel, thumbnail }], cached: bool }
 *
 * Por que existe: a chave da YouTube Data API não pode ficar no site (que é
 * 100% estático e público). Ela fica guardada aqui como "secret" do Worker
 * (YOUTUBE_API_KEY). Além disso, cada busca no YouTube custa 100 unidades
 * da cota diária (10.000 = ~100 buscas/dia), então o resultado de cada
 * termo fica em cache por 24h no KV (SEARCH_CACHE) e é compartilhado entre
 * todos os usuários — num show, as mesmas músicas se repetem muito.
 *
 * Erros (sempre JSON { error }):
 *   400 empty_query · 403 forbidden (origem não permitida) · 404 not_found
 *   429 quota (cota diária do YouTube esgotada) · 502 upstream (outro erro)
 *   500 not_configured (secret YOUTUBE_API_KEY ausente)
 */

const ALLOWED_ORIGINS = [
  'https://playkaraoke.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];
const CACHE_TTL_SEC = 24 * 60 * 60;
const MAX_RESULTS = 20;
const MAX_QUERY_LENGTH = 100;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname !== '/search' || request.method !== 'GET') return json({ error: 'not_found' }, 404, cors);
    // Barreira contra uso da cota por outros sites. (Não impede um script
    // fora do navegador de forjar o Origin — o cache limita o estrago.)
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'forbidden' }, 403, cors);
    if (!env.YOUTUBE_API_KEY) return json({ error: 'not_configured' }, 500, cors);

    const query = buildQuery(url.searchParams.get('q'));
    if (!query) return json({ error: 'empty_query' }, 400, cors);

    const cacheKey = 'search:' + query.toLowerCase();
    if (env.SEARCH_CACHE) {
      const cached = await env.SEARCH_CACHE.get(cacheKey, 'json');
      if (cached) return json({ results: cached, cached: true }, 200, cors);
    }

    const outcome = await searchYouTube(query, env.YOUTUBE_API_KEY);
    if (outcome.error) {
      return json({ error: outcome.error }, outcome.error === 'quota' ? 429 : 502, cors);
    }

    if (env.SEARCH_CACHE) {
      const write = env.SEARCH_CACHE.put(cacheKey, JSON.stringify(outcome.results), { expirationTtl: CACHE_TTL_SEC });
      if (ctx && ctx.waitUntil) ctx.waitUntil(write); else await write;
    }
    return json({ results: outcome.results, cached: false }, 200, cors);
  },
};

/** Normaliza o termo (espaços, tamanho) e acrescenta "karaoke" se faltar. */
export function buildQuery(raw) {
  const q = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH);
  if (!q) return '';
  return /karaok/i.test(q) ? q : `${q} karaoke`;
}

async function searchYouTube(query, apiKey) {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true', // só vídeos que podem tocar dentro do app
    maxResults: String(MAX_RESULTS),
    regionCode: 'BR',
    q: query,
    fields: 'items(id/videoId,snippet(title,channelTitle,thumbnails/medium/url))',
    key: apiKey,
  });
  let res;
  try {
    res = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`);
  } catch (err) {
    return { error: 'upstream' };
  }
  if (!res.ok) {
    let reason = '';
    try {
      const body = await res.json();
      reason = body && body.error && body.error.errors && body.error.errors[0] && body.error.errors[0].reason;
    } catch (err) { /* corpo não-JSON */ }
    const isQuota = res.status === 403 && /quota|rateLimit/i.test(reason || '');
    return { error: isQuota ? 'quota' : 'upstream' };
  }
  const data = await res.json();
  const results = (data.items || [])
    .filter(item => item.id && item.id.videoId)
    .map(item => ({
      videoId: item.id.videoId,
      title: decodeEntities(item.snippet.title),
      channel: decodeEntities(item.snippet.channelTitle),
      thumbnail: item.snippet.thumbnails && item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : '',
    }));
  return { results };
}

/** A API devolve títulos com entidades HTML ("&amp;", "&#39;"). */
export function decodeEntities(s) {
  return String(s || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
