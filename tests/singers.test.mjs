import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

function song(win, name) {
  const [artist, title] = name.replace('.zip', '').split(' - ');
  return { id: 'track_' + name, file: fakeFile(win, name), code: null, artist, title, format: 'MP3+G', type: 'cdg', savedSemitones: 0 };
}

/** Liga o Modo Show com 3 cantores (Ana, Bia, Caio), 2 músicas cada. */
async function showWith3Singers() {
  const ctx = await createApp({ localStorage: { 'playkaraoke-hide-show-welcome': 'true' } });
  const { win, t } = ctx;
  for (const name of ['Ana', 'Bia', 'Caio']) {
    t.singerManager.addSinger(name);
    const id = t.singerManager.getAllSingers().find(s => s.name === name).id;
    t.singerManager.addSongToSinger(id, false, song(win, `${name} - Musica1.zip`));
    t.singerManager.addSongToSinger(id, false, song(win, `${name} - Musica2.zip`));
  }
  t.actuallyEnableSingerMode();
  await flush();
  return ctx;
}
const names = (t) => Array.from(t.singerManager.getAllSingers(), s => s.name);
const titles = (singer) => Array.from(singer.songs, s => s.title);
const current = (t) => t.singerManager.getCurrentSinger().name;

test('remover a música que está tocando (Gerenciar Cantores) não consome a próxima', async () => {
  const { t } = await showWith3Singers();
  await t.engine.play();
  const ana = t.singerManager.getAllSingers()[0];
  t.singerManager.removeSongFromSinger(ana.id, 0); // operador remove a que está tocando
  t.engine.finish();
  await flush();
  assert.deepEqual(titles(ana), ['Musica2'], 'Musica2 da Ana foi consumida sem ser cantada');
  assert.equal(t.showHistory.at(-1).musica, 'Musica1');
  assert.equal(current(t), 'Bia');
});

test('reordenar as músicas do cantor durante a apresentação registra a música certa', async () => {
  const { t } = await showWith3Singers();
  await t.engine.play();
  const ana = t.singerManager.getAllSingers()[0];
  t.singerManager.reorderSongInSinger(ana.id, 1, 0); // Musica2 sobe pro topo enquanto Musica1 toca
  t.engine.finish();
  await flush();
  assert.equal(t.showHistory.at(-1).musica, 'Musica1');
  assert.deepEqual(titles(ana), ['Musica2']);
});

test('remover o cantor da vez passa a vez pro PRÓXIMO, não pro primeiro', async () => {
  const { t } = await showWith3Singers();
  t.engine.finish(); await flush(); // Ana cantou -> vez da Bia
  assert.equal(current(t), 'Bia');
  const bia = t.singerManager.getAllSingers()[1];
  t.singerManager.removeSinger(bia.id);
  assert.equal(current(t), 'Caio');
  assert.deepEqual(names(t), ['Ana', 'Caio']);
});

test('remover o cantor da vez no meio da apresentação não pula ninguém', async () => {
  const { t } = await showWith3Singers();
  await t.engine.play();
  const ana = t.singerManager.getAllSingers()[0];
  t.singerManager.removeSinger(ana.id); // vez já passa pra Bia
  t.engine.finish(); // música da Ana termina
  await flush();
  assert.equal(current(t), 'Bia', 'avançou duas posições');
  assert.equal(t.showHistory.at(-1).cantor, 'Ana');
});

test('fim de música sem autoplay deixa a do próximo cantor carregada e pausada', async () => {
  const { t } = await showWith3Singers();
  await t.engine.play();
  t.engine.finish();
  await flush();
  assert.equal(t.playlist[0].title, 'Musica1');
  assert.equal(t.playlist[0].artist, 'Bia');
  assert.equal(t.engine.isPlaying(), false);
  assert.equal(t.mode, 'cdg');
});

test('botão Próxima no Modo Show encerra a apresentação (conta como cantada) e passa a vez', async () => {
  const { win, t, $ } = await showWith3Singers();
  await t.engine.play();
  const next = $('next-btn');
  assert.equal(next.disabled, false);
  next.click();
  await flush();
  $('generic-confirm-ok-btn').click();
  await flush();
  assert.equal(t.engine.isPlaying(), false);
  assert.equal(t.showHistory.at(-1).cantor, 'Ana');
  assert.equal(current(t), 'Bia');
  assert.equal(t.playlist[0].artist, 'Bia');
});

test('duração do show conta a partir do início do Modo Show, não do login', async () => {
  const loginTime = String(Date.now() - 3 * 3600 * 1000); // logou há 3h
  const { t, $ } = await createApp({ localStorage: { 'playkaraoke-session-start': loginTime, 'playkaraoke-hide-show-welcome': 'true' } });
  t.actuallyEnableSingerMode();
  t.openShowReport();
  assert.equal($('report-duration').textContent, '0min');
});
