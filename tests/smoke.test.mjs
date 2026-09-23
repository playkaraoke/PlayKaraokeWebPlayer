import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

test('app carrega e adiciona músicas na fila', async () => {
  const { win, t } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'EJBg-0020 - Kansas - Play the Game.zip'), fakeFile(win, 'Queen - Bohemian.mp4')]);
  await flush();
  assert.equal(t.playlist.length, 2);
  assert.equal(t.currentIndex, 0);
  assert.equal(t.mode, 'cdg');
});

test('arquivos-fantasma ._ do macOS são ignorados ao arrastar/carregar', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, '._A - Um.zip'), fakeFile(win, 'A - Um.zip')]);
  await flush();
  assert.equal(t.playlist.length, 1);
  assert.equal($('error-banner').classList.contains('hidden'), true);
});
