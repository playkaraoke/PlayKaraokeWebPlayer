/** "Segunda tela como player principal" (tela principal, com a segunda tela simulada). */
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush, closeAllApps } from './helpers/app-harness.mjs';

afterEach(closeAllApps);

const RESULT = { videoId: 'vid1', title: 'Luan Santana - Escreve Aí', channel: 'Canal', thumbnail: 'https://i.ytimg.com/x.jpg' };

async function withYouTubeSong() {
  const ctx = await createApp({ onlineResults: [RESULT] });
  const { win, $ } = ctx;
  $('tab-biblioteca-btn').click();
  $('library-source-online-btn').click();
  $('library-search-input').value = 'x';
  $('library-search-input').dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter' }));
  await flush();
  $('online-results').querySelector('.online-card').click();
  await flush();
  return ctx;
}
/** Abre a segunda tela e simula ela avisando que está pronta. */
async function openSecondScreen({ win, $ }) {
  $('quick-second-screen-btn').click();
  win.__fromSecondScreen({ type: 'ready' });
  await flush();
}
const lastSent = (win, type) => win.__sentToSecondScreen().filter(m => m.type === type).at(-1);

test('YouTube: abrir a segunda tela transfere o vídeo pra lá (com som), no mesmo ponto', async () => {
  const ctx = await withYouTubeSong();
  const { win, t, $ } = ctx;
  t.ytLocal.play(); t.ytLocal.time = 42;
  await openSecondScreen(ctx);
  assert.equal(t.secondScreenPlayer, true);
  assert.equal(t.ytLocal.playing, false, 'player local continuou tocando');
  const init = lastSent(win, 'init-youtube');
  assert.equal(init.remote, true);
  assert.equal(init.autoplay, true);
  assert.equal(init.startAt, 42);
  assert.equal($('stage-remote-placeholder').classList.contains('hidden'), false);
  assert.equal($('stage-youtube-wrap').classList.contains('hidden'), true);
});

test('YouTube remoto: estado vem da segunda tela; play/pausa viram comandos; fim avança a fila', async () => {
  const ctx = await withYouTubeSong();
  const { win, t, $ } = ctx;
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]); await flush();
  await openSecondScreen(ctx);
  win.__fromSecondScreen({ type: 'yt-loaded', videoId: 'vid1', duration: 200 });
  win.__fromSecondScreen({ type: 'yt-state', videoId: 'vid1', currentTime: 10, duration: 200, playing: true });
  await flush();
  assert.equal($('pause-icon').classList.contains('hidden'), false, 'ícone deveria ser pausa');
  $('play-btn').click(); await flush();
  assert.deepEqual({ ...lastSent(win, 'yt-command') }, { type: 'yt-command', cmd: 'pause', value: undefined });
  win.__fromSecondScreen({ type: 'yt-ended', videoId: 'vid1' });
  await flush();
  assert.equal(t.mode, 'cdg');
  assert.equal(t.playlist[0].title, 'Um');
});

test('YouTube: fechar a segunda tela devolve o vídeo pra cá, no ponto em que estava', async () => {
  const ctx = await withYouTubeSong();
  const { win, t } = ctx;
  await openSecondScreen(ctx);
  win.__fromSecondScreen({ type: 'yt-state', videoId: 'vid1', currentTime: 80, duration: 200, playing: true });
  await flush();
  win.__fromSecondScreen({ type: 'bye' });
  await flush();
  assert.equal(t.secondScreenPlayer, false);
  assert.equal(t.ytLocal.videoId, 'vid1');
  assert.ok(t.ytLocal.time >= 80 && t.ytLocal.time < 81);
  assert.equal(t.ytLocal.playing, true);
});

test('MP4: com a segunda tela aberta, aqui toca só o áudio (<audio>), vídeo só lá; ao fechar volta', async () => {
  const ctx = await createApp();
  const { win, t, $ } = ctx;
  await t.addFilesToQueue([fakeFile(win, 'B - Clipe.mp4')]); await flush();
  await t.videoEl.play();
  t.videoEl.currentTime = 30;
  await openSecondScreen(ctx);
  assert.equal(t.videoEl.paused, true);
  assert.equal(t.videoEl.hasAttribute('src'), false, '<video> daqui continuou com o vídeo carregado');
  assert.equal(t.audioEl.paused, false);
  assert.equal(t.audioEl.currentTime, 30);
  assert.equal($('stage-video-wrap').classList.contains('hidden'), true);
  win.__secondWindow.close();
  win.__fromSecondScreen({ type: 'bye' });
  await flush();
  assert.equal(t.audioEl.paused, true);
  assert.equal(t.videoEl.paused, false);
  assert.equal(t.videoEl.currentTime, 30);
});

test('MP4 carregado com a segunda tela já aberta vai direto pro <audio>', async () => {
  const ctx = await createApp();
  const { win, t } = ctx;
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]); await flush();
  await openSecondScreen(ctx);
  await t.addFilesToQueue([fakeFile(win, 'B - Clipe.mp4')]); await flush();
  await t.selectTrack(1, { autoplay: true });
  assert.equal(t.audioEl.paused, false);
  assert.equal(t.videoEl.paused, true);
});

test('CDG: segunda tela aberta não muda o áudio (continua no motor daqui) e a principal fica leve', async () => {
  const ctx = await createApp();
  const { win, t, $ } = ctx;
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]); await flush();
  await t.engine.play();
  await openSecondScreen(ctx);
  assert.equal(t.engine.isPlaying(), true);
  assert.equal($('cdg-canvas').width, 300);
  assert.equal($('stage-remote-placeholder').classList.contains('hidden'), true);
});
