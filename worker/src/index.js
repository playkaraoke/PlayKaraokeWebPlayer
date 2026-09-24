/**
 * Play Karaoke — busca Online (Cloudflare Worker).
 *
 * Único endpoint: GET /search?q=<termo>
 *   -> { results: [{ videoId, title, channel, thumbnail }], cached: bool }
 *
 * Por que existe: a chave da YouTube Data API não pode ficar no site (que é
 * 100% estático e público). Ela fica guardada aqui como "secret" do Worker
 * (YOUTUBE_API_KEY, YOUTUBE_API_KEY_2, YOUTUBE_API_KEY_3...). Além disso,
 * cada busca no YouTube custa 100 unidades da cota diária (10.000 = ~100
 * buscas/dia por chave), então o resultado de cada termo fica em cache por
 * 24h no KV (SEARCH_CACHE) e é compartilhado entre todos os usuários — num
 * show, as mesmas músicas se repetem muito.
 *
 * Rodízio de chaves (v2.4):
 *   Cada chave tem uma cota diária de 10.000 unidades (≈100 buscas novas).
 *   Quando uma chave esgota (o Google devolve 403 com reason "quotaExceeded"),
 *   o Worker passa para a próxima chave disponível naquele dia. O contador
 *   de uso de cada chave fica no MESMO KV do cache (prefixo "keyusage:"),
 *   com TTL que expira à meia-noite do Pacífico. Assim, no dia seguinte o
 *   contador some sozinho e todas as chaves voltam a ficar disponíveis.
 *
 * Erros (sempre JSON { error }):
 *   400 empty_query · 403 forbidden (origem não permitida) · 404 not_found
 *   429 quota (todas as chaves esgotaram a cota do dia) · 502 upstream
 *   500 not_configured (nenhum secret de chave configurado)
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

// Ordem em que as chaves são tentadas. O nome "YOUTUBE_API_KEY" é a chave
// original (compatibilidade); as demais foram adicionadas na v2.4.
const KEY_NAMES = ['YOUTUBE_API_KEY', 'YOUTUBE_API_KEY_2', 'YOUTUBE_API_KEY_3'];

// Prefixo no KV para o contador diário de uso de cada chave. Fica separado
// do cache de busca ("search:...") para não misturar.
const KEY_USAGE_PREFIX = 'keyusage:';

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname !== '/search' || request.method !== 'GET') return json({ error: 'not_found' }, 404, cors);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'forbidden' }, 403, cors);

    // Filtra os secrets que realmente existem no ambiente. Se nenhum existir,
    // o Worker não tem como chamar o YouTube.
    const availableKeys = KEY_NAMES.filter(name => !!env[name]);
    if (availableKeys.length === 0) return json({ error: 'not_configured' }, 500, cors);

    const query = buildQuery(url.searchParams.get('q'));
    if (!query) return json({ error: 'empty_query' }, 400, cors);

    const cacheKey = 'search:' + query.toLowerCase();
    if (env.SEARCH_CACHE) {
      const cached = await env.SEARCH_CACHE.get(cacheKey, 'json');
      if (cached) return json({ results: cached, cached: true }, 200, cors);
    }

    // Tenta cada chave em ordem, pulando as que já esgotaram a cota do dia.
    // Se o Google devolver "quota" numa chave, marca como esgotada (valor
    // sentinela "-1") e passa para a próxima.
    let lastError = 'upstream';
    for (const keyName of availableKeys) {
      if (env.SEARCH_CACHE) {
        const usage = await readKeyUsage(env.SEARCH_CACHE, keyName);
        if (usage === -1) continue; // já esgotou hoje
      }

      const outcome = await searchYouTube(query, env[keyName]);

      if (!outcome.error) {
        // Sucesso: incrementa o contador de uso da chave (se KV disponível).
        if (env.SEARCH_CACHE) {
          const write = bumpKeyUsage(env.SEARCH_CACHE, keyName);
          if (ctx && ctx.waitUntil) ctx.waitUntil(write); else await write;
        }
        if (env.SEARCH_CACHE) {
          const write = env.SEARCH_CACHE.put(cacheKey, JSON.stringify(outcome.results), { expirationTtl: CACHE_TTL_SEC });
          if (ctx && ctx.waitUntil) ctx.waitUntil(write); else await write;
        }
        return json({ results: outcome.results, cached: false, keyUsed: keyName }, 200, cors);
      }

      if (outcome.error === 'quota') {
        // Marca essa chave como esgotada hoje, e continua para a próxima.
        if (env.SEARCH_CACHE) {
          const write = markKeyExhausted(env.SEARCH_CACHE, keyName);
          if (ctx && ctx.waitUntil) ctx.waitUntil(write); else await write;
        }
        lastError = 'quota';
        continue;
      }

      // Erro que não é de cota (rede, upstream): não culpa a chave, tenta a
      // próxima mesmo assim — pode ser instabilidade pontual do YouTube.
      lastError = outcome.error;
    }

    // Se chegou aqui, todas as chaves falharam (ou esgotaram).
    return json({ error: lastError }, lastError === 'quota' ? 429 : 502, cors);
  },
};

/** Normaliza o termo (espaços, tamanho) e acrescenta "karaoke" se faltar. */
export function buildQuery(raw) {
  const q = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH);
  if (!q) return '';
  return /karaok/i.test(q) ? q : `${q} karaoke`;
}

/** Segundos até a próxima meia-noite no horário do Pacífico (PT). */
function secondsUntilPtMidnight() {
  const now = new Date();
  const ptParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type) => Number(ptParts.find(p => p.type === type).value);
  const h = get('hour'), m = get('minute'), s = get('second');
  const secsToday = h * 3600 + m * 60 + s;
  const secsInDay = 24 * 3600;
  // +60s de folga para não expirar exatamente na virada e perder o reset.
  return Math.max(60, secsInDay - secsToday + 60);
}

async function readKeyUsage(kv, keyName) {
  try {
    const v = await kv.get(KEY_USAGE_PREFIX + keyName);
    if (v === null) return 0;
    return Number(v);
  } catch (err) {
    return 0;
  }
}

async function bumpKeyUsage(kv, keyName) {
  try {
    const current = await readKeyUsage(kv, keyName);
    if (current === -1) return; // já esgotou, não faz sentido incrementar
    const next = current + 1;
    await kv.put(KEY_USAGE_PREFIX + keyName, String(next), {
      expirationTtl: secondsUntilPtMidnight(),
    });
  } catch (err) { /* KV indisponível: degrada para "sem contador", sem quebrar */ }
}

async function markKeyExhausted(kv, keyName) {
  try {
    // Valor sentinela -1 = "esgotada hoje". TTL até a meia-noite PT.
    await kv.put(KEY_USAGE_PREFIX + keyName, '-1', {
      expirationTtl: secondsUntilPtMidnight(),
    });
  } catch (err) { /* idem */ }
}

async function searchYouTube(query, apiKey) {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
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