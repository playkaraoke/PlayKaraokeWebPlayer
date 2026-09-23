import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

const RESULTS = [
  { videoId: 'vid1', title: 'Karaokê Luan Santana - Escreve Aí', channel: 'Viguiba Karaokê', thumbnail: 'https://i.ytimg.com/vi/vid1/mqdefault.jpg' },
  { videoId: 'vid2', title: 'Escreve Aí (Karaoke Version)', channel: 'Muramatsu Karaoke', thumbnail: '' },
];

async function onlineApp(extra = {}) {
  const ctx = await createApp({ onlineResults: RESULTS, ...extra });
  ctx.$('tab-biblioteca-btn').click();
  ctx.$('library-source-online-btn').click();
  return ctx;
}
function searchOnline({ win, $ }, text) {
  $('library-search-input').value = text;
  $('library-search-input').dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter' }));
}

test('Online: digitar não busca; Enter busca e mostra os cards', async () => {
  const ctx = await onlineApp();
  const { win, $ } = ctx;
  $('library-search-input').value = 'escreve ai';
  $('library-search-input').dispatchEvent(new win.Event('input'));
  await flush();
  assert.equal(win.__onlineSearches, undefined, 'buscou a cada tecla (gasta cota)');
  searchOnline(ctx, 'escreve ai');
  await flush();
  assert.deepEqual(Array.from(win.__onlineSearches), ['escreve ai']);
  assert.equal($('online-results').querySelectorAll('.online-card').length, 2);
  assert.equal($('library-content').classList.contains('hidden'), true, 'pastas continuam visíveis no Online');
});

test('Online: + adiciona na fila como YouTube, separa artista/título e fica carregada pausada', async () => {
  const ctx = await onlineApp();
  searchOnline(ctx, 'escreve ai'); await flush();
  ctx.$('online-results').querySelector('.online-card').click();
  await flush();
  const { t } = ctx;
  assert.equal(t.playlist.length, 1);
  assert.equal(t.playlist[0].type, 'youtube');
  assert.equal(t.playlist[0].artist, 'Luan Santana');
  assert.equal(t.playlist[0].title, 'Escreve Aí');
  assert.equal(t.mode, 'youtube');
  assert.equal(t.ytPlayer.videoId, 'vid1');
  assert.equal(t.ytPlayer.playing, false);
  assert.equal(ctx.$('pitch-up-btn').disabled, true, 'tom deveria estar desativado');
});

test('Online: fim do vídeo avança a fila; troca YouTube → CDG para o YouTube', async () => {
  const ctx = await onlineApp();
  const { win, t } = ctx;
  searchOnline(ctx, 'x'); await flush();
  ctx.$('online-results').querySelector('.online-card').click(); await flush();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip'), fakeFile(win, 'B - Dois.zip')]); await flush();
  t.ytPlayer.play();
  t.ytPlayer.finish(); await flush();
  assert.equal(t.mode, 'cdg');
  assert.equal(t.playlist[0].title, 'Um');
  await t.selectTrack(0, { autoplay: true });
  assert.equal(t.ytPlayer.playing, false);
});

test('Online: música do YouTube sobrevive ao F5', async () => {
  const ctx = await onlineApp();
  searchOnline(ctx, 'x'); await flush();
  ctx.$('online-results').querySelector('.online-card').click(); await flush();
  const saved = ctx.win.localStorage.getItem('playkaraoke-playlist-v1');
  const again = await createApp({ localStorage: { 'playkaraoke-playlist-v1': saved } });
  assert.equal(again.t.playlist.length, 1);
  assert.equal(again.t.playlist[0].videoId, 'vid1');
  assert.equal(again.t.mode, 'youtube');
});

test('Online: no Modo Show pergunta o cantor e entra na rodada', async () => {
  const ctx = await onlineApp({ localStorage: { 'playkaraoke-hide-show-welcome': 'true' } });
  const { t, $ } = ctx;
  t.actuallyEnableSingerMode(); await flush();
  searchOnline(ctx, 'x'); await flush();
  $('online-results').querySelector('.online-card').click(); await flush();
  $('singer-picker-new-input').value = 'Ana';
  $('singer-picker-new-btn').click(); await flush();
  assert.equal(t.singerManager.getAllSingers()[0].songs[0].videoId, 'vid1');
  assert.equal(t.mode, 'youtube');
});

test('Online: cota esgotada mostra aviso', async () => {
  const ctx = await onlineApp({ onlineError: 'quota' });
  searchOnline(ctx, 'x'); await flush();
  assert.match(ctx.$('online-results').textContent, /limit/i);
});

test('sem Worker configurado, a opção Online fica escondida', async () => {
  const { $ } = await createApp({
    beforeApp: (win) => { win.createOnlineSearch = () => ({ isConfigured: () => false, search: async () => [] }); },
  });
  assert.equal($('library-source-toggle').classList.contains('hidden'), true);
});
