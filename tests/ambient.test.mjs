import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, flush, closeAllApps } from './helpers/app-harness.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
afterEach(closeAllApps);

function loadModule(win) {
  const localStorage = { m: {}, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = String(v); } };
  win.localStorage = win.localStorage || localStorage;
  new Function('window', 'localStorage', 'URL', 'indexedDB', readFileSync(path.join(ROOT, 'js/ambient-playlist.js'), 'utf8'))(
    win, win.localStorage, { createObjectURL: (f) => 'blob:' + f.name, revokeObjectURL() {} }, undefined);
  return win.createAmbientPlaylist;
}

test('ordem aleatória sem repetir dentro da rodada, e sem repetir na virada', async () => {
  const create = loadModule({});
  const tracks = ['a', 'b', 'c', 'd', 'e'];
  const pl = create({ builtinTracks: tracks });
  let last = null;
  for (let round = 0; round < 30; round++) {
    const seen = new Set();
    for (let i = 0; i < tracks.length; i++) {
      const t = await pl.next();
      assert.ok(!seen.has(t), `repetiu "${t}" na mesma rodada`);
      if (i === 0 && last) assert.notEqual(t, last, 'repetiu na virada da rodada');
      seen.add(t);
      last = t;
    }
    assert.equal(seen.size, tracks.length);
  }
});

test('pasta própria (Safari/Firefox via input de pasta): só áudio, sem arquivos ocultos', async () => {
  const input = { files: [], value: '', click() { this.onchange(); } };
  const create = loadModule({}); // sem showDirectoryPicker
  const pl = create({ builtinTracks: ['builtin.mp3'] });
  input.files = [
    { name: 'Um.mp3', webkitRelativePath: 'Ambiente/Um.mp3' },
    { name: 'Dois.m4a', webkitRelativePath: 'Ambiente/Dois.m4a' },
    { name: '._Um.mp3', webkitRelativePath: 'Ambiente/._Um.mp3' },
    { name: 'capa.jpg', webkitRelativePath: 'Ambiente/capa.jpg' },
  ];
  pl.setSource('custom');
  assert.equal(await pl.chooseFolder(input), true);
  assert.deepEqual({ ...pl.getFolder() }, { name: 'Ambiente', count: 2, needsPermission: false });
  const got = new Set([await pl.next(), await pl.next()]);
  assert.deepEqual([...got].sort(), ['blob:Dois.m4a', 'blob:Um.mp3']);
  pl.setSource('builtin');
  assert.equal(await pl.next(), 'builtin.mp3');
});

test('"Minhas músicas" sem pasta escolhida continua tocando as do app', async () => {
  const create = loadModule({});
  const pl = create({ builtinTracks: ['builtin.mp3'] });
  pl.setSource('custom');
  assert.equal(await pl.next(), 'builtin.mp3');
});

test('Configurações: botões de fonte da música ambiente', async () => {
  const { $ } = await createApp();
  assert.equal($('ambient-custom-row').classList.contains('hidden'), true);
  $('ambient-source-custom-btn').click();
  await flush();
  assert.equal($('ambient-custom-row').classList.contains('hidden'), false);
  assert.equal($('ambient-source-custom-btn').classList.contains('active'), true);
  $('ambient-source-builtin-btn').click();
  assert.equal($('ambient-custom-row').classList.contains('hidden'), true);
});
