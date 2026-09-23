import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildQuery, decodeEntities } from '../worker/src/index.js';

const ORIGIN = 'https://playkaraoke.github.io';
let ytCalls; let ytResponse;
beforeEach(() => {
  ytCalls = [];
  ytResponse = { status: 200, body: { items: [
    { id: { videoId: 'abc123' }, snippet: { title: 'Luan Santana - Escreve Aí &#39;Karaokê&#39; &amp; Letra', channelTitle: 'Viguiba Karaokê', thumbnails: { medium: { url: 'https://i.ytimg.com/vi/abc123/mqdefault.jpg' } } } },
  ] } };
  globalThis.fetch = async (url) => { ytCalls.push(String(url)); return new Response(JSON.stringify(ytResponse.body), { status: ytResponse.status }); };
});
function fakeKV() { const m = new Map(); return { store: m, async get(k) { return m.has(k) ? JSON.parse(m.get(k)) : null; }, async put(k, v) { m.set(k, v); } }; }
const env = (extra = {}) => ({ YOUTUBE_API_KEY: 'KEY', SEARCH_CACHE: fakeKV(), ...extra });
const req = (q, origin = ORIGIN) => new Request(`https://w.example/search?q=${encodeURIComponent(q)}`, { headers: { Origin: origin } });

test('busca devolve resultados normalizados e acrescenta "karaoke"', async () => {
  const res = await worker.fetch(req('luan santana escreve ai'), env());
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  const body = await res.json();
  assert.equal(body.results[0].videoId, 'abc123');
  assert.equal(body.results[0].title, "Luan Santana - Escreve Aí 'Karaokê' & Letra");
  assert.equal(body.results[0].channel, 'Viguiba Karaokê');
  assert.match(ytCalls[0], /q=luan\+santana\+escreve\+ai\+karaoke/);
  assert.match(ytCalls[0], /videoEmbeddable=true/);
});

test('segunda busca igual vem do cache (não gasta cota)', async () => {
  const e = env();
  await worker.fetch(req('Escreve Ai'), e);
  const res = await worker.fetch(req('  escreve   ai '), e);
  assert.equal((await res.json()).cached, true);
  assert.equal(ytCalls.length, 1);
});

test('cota esgotada vira 429 { error: "quota" }', async () => {
  ytResponse = { status: 403, body: { error: { errors: [{ reason: 'quotaExceeded' }] } } };
  const res = await worker.fetch(req('x'), env());
  assert.equal(res.status, 429);
  assert.equal((await res.json()).error, 'quota');
});

test('origem não permitida é recusada sem chamar o YouTube', async () => {
  const res = await worker.fetch(req('x', 'https://outro-site.com'), env());
  assert.equal(res.status, 403);
  assert.equal(ytCalls.length, 0);
});

test('sem chave configurada e termo vazio', async () => {
  assert.equal((await worker.fetch(req('x'), env({ YOUTUBE_API_KEY: '' }))).status, 500);
  assert.equal((await worker.fetch(req('   '), env())).status, 400);
});

test('utilitários', () => {
  assert.equal(buildQuery('Adele Hello Karaokê'), 'Adele Hello Karaokê');
  assert.equal(decodeEntities('Rock &amp; Roll &#39;n&#39; &quot;Blues&quot;'), `Rock & Roll 'n' "Blues"`);
});
