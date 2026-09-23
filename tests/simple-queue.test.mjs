import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

async function queueOf3() {
  const ctx = await createApp();
  const { win, t } = ctx;
  await t.addFilesToQueue(['A - Um.zip', 'B - Dois.zip', 'C - Tres.zip'].map(n => fakeFile(win, n)));
  await flush();
  return ctx;
}

test('sem autoplay: ao terminar, a próxima fica carregada e pausada', async () => {
  const { t } = await queueOf3();
  await t.engine.play();
  t.engine.finish();
  await flush();
  assert.equal(t.playlist.length, 2);
  assert.equal(t.currentIndex, 0);
  assert.equal(t.playlist[0].title, 'Dois');
  assert.equal(t.mode, 'cdg');
  assert.equal(t.engine.isPlaying(), false);
  assert.equal(t.engine.loadedBuffers.at(-1).name, 'B - Dois.zip');
});

test('com autoplay: após a contagem toca a próxima (sem pular nenhuma)', async () => {
  const { t, $ } = await queueOf3();
  $('autoplay-delay-input').value = '0';
  $('autoplay-toggle').checked = true;
  await t.engine.play();
  t.engine.finish();
  await flush();
  assert.equal(t.playlist[0].title, 'Dois');
  assert.equal(t.currentIndex, 0);
  assert.equal(t.engine.isPlaying(), true);
});

test('última música terminando deixa o palco vazio (não dá pra tocar de novo a que saiu)', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]);
  await t.engine.play();
  t.engine.finish();
  await flush();
  assert.equal(t.playlist.length, 0);
  assert.equal(t.mode, null);
  assert.equal($('play-btn').disabled, true);
});
