import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush } from './helpers/app-harness.mjs';

test('vídeo principal não mostra os controles nativos', async () => {
  const { $ } = await createApp();
  assert.equal($('video-el').controls, false);
});

test('Espaço dá play/pause, mas não com um modal aberto', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]);
  await flush();
  const space = () => win.dispatchEvent(new win.KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
  space(); await flush();
  assert.equal(t.engine.isPlaying(), true);
  $('generic-confirm-backdrop').classList.remove('hidden');
  space(); await flush();
  assert.equal(t.engine.isPlaying(), true, 'Espaço pausou com modal aberto');
});

test('um erro novo não some pelo timer do erro anterior', async () => {
  const { win, t, $ } = await createApp();
  // Relógio manual só pros timers do app (os do Node seguem normais).
  let now = 0; const timers = new Map(); let seq = 0;
  win.setTimeout = (fn, ms) => { timers.set(++seq, { fn, at: now + ms }); return seq; };
  win.clearTimeout = (id) => timers.delete(id);
  const advance = (ms) => { now += ms; for (const [id, tm] of [...timers]) if (tm.at <= now) { timers.delete(id); tm.fn(); } };
  await t.addFilesToQueue([fakeFile(win, 'x.txt')]); // erro 1
  advance(4000);
  await t.addFilesToQueue([fakeFile(win, 'y.txt')]); // erro 2
  advance(1500); // 5,5s após o 1º, 1,5s após o 2º
  assert.equal($('error-banner').classList.contains('hidden'), false);
});
