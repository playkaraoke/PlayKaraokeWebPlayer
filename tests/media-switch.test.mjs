import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

test('trocar de CDG tocando pra MP4 para o áudio do CDG', async () => {
  const { win, t } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip'), fakeFile(win, 'B - Dois.mp4')]);
  await t.engine.play();
  assert.equal(t.engine.isPlaying(), true);
  await t.selectTrack(1, { autoplay: true });
  assert.equal(t.mode, 'video');
  assert.equal(t.engine.isPlaying(), false, 'CDG continuou tocando por baixo do vídeo');
});

test('trocar de MP4 tocando pra CDG pausa o vídeo', async () => {
  const { win, t } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'B - Dois.mp4'), fakeFile(win, 'A - Um.zip')]);
  await t.videoEl.play();
  await t.selectTrack(1, { autoplay: true });
  assert.equal(t.mode, 'cdg');
  assert.equal(t.videoEl.paused, true, 'vídeo continuou tocando por baixo do CDG');
});

test('"ended" de mídia que não é a atual não avança a fila', async () => {
  const { win, t } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'B - Dois.mp4'), fakeFile(win, 'A - Um.zip'), fakeFile(win, 'C - Tres.zip')]);
  await t.selectTrack(1, { autoplay: true }); // agora é CDG
  t.videoEl.dispatchEvent(new win.Event('ended')); // "ended" atrasado do vídeo antigo
  await flush();
  assert.equal(t.playlist.length, 3);
});
