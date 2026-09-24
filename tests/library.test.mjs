import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fakeDir(name, children) {
  return {
    kind: 'directory', name,
    async *values() { yield* children; },
    async isSameEntry(other) { return other === this; },
  };
}
const f = (name) => ({ kind: 'file', name });

function loadLibraryModule(pickedDirs) {
  const win = { showDirectoryPicker: async () => pickedDirs.shift() };
  const indexedDB = { open() { const req = {}; setTimeout(() => req.onerror && req.onerror()); return req; } };
  new Function('window', 'indexedDB', readFileSync(path.join(ROOT, 'js/file-loader.js'), 'utf8'))(win, indexedDB);
  new Function('window', 'indexedDB', readFileSync(path.join(ROOT, 'js/library.js'), 'utf8') + '\nwindow.createLibrary = createLibrary;')(win, indexedDB);
  return win;
}

const acervo = fakeDir('HD', [
  f('EJBg-0020 - Kansas - Play the Game Tonight.zip'),
  f('Planta e Raiz - Com Certeza.zip'),
  f('leia-me.txt'),
  f('._PLK-1766 - Air Supply - Even The Nights Are Better.zip'), // fantasma do macOS
  fakeDir('Sub', [f('Os Aviões - Voando Alto.mp4'), f('._Os Aviões - Voando Alto.mp4')]),
  fakeDir('.Trashes', [f('Apagada - Musica.zip')]),
  fakeDir('__MACOSX', [f('Lixo - Musica.zip')]),
]);

test('busca multi-palavra, sem acento, em subpastas, ignorando outros formatos', async () => {
  const win = loadLibraryModule([acervo]);
  const lib = win.createLibrary({ onFoldersChange() {}, onIndexChange() {}, onError() {} });
  await lib.connectNewFolder();
  assert.equal(lib.getIndexSize(), 3);
  assert.equal(lib.search('planta certeza')[0].title, 'Com Certeza');
  assert.equal(lib.search('avioes')[0].artist, 'Os Aviões');
  assert.equal(lib.search('ejbg-0020').length, 1);
  assert.equal(lib.search('inexistente').length, 0);
  assert.equal(lib.search('even nights').length, 0, 'arquivo fantasma ._ foi indexado');
});

test('conectar a mesma pasta duas vezes não duplica os resultados', async () => {
  const win = loadLibraryModule([acervo, acervo]);
  const lib = win.createLibrary({ onFoldersChange() {}, onIndexChange() {}, onError() {} });
  await lib.connectNewFolder();
  await lib.connectNewFolder();
  assert.equal(lib.getConnectedFolders().length, 1);
  assert.equal(lib.getIndexSize(), 3);
});

/** IndexedDB mínimo em memória (put/get/getAll/delete), suficiente pro library.js. */
function memoryIndexedDB() {
  const stores = new Map();
  const db = {
    objectStoreNames: { contains: (n) => stores.has(n) },
    createObjectStore: (n, { keyPath }) => { stores.set(n, { keyPath, rows: new Map() }); },
    transaction(names) {
      const tx = {
        objectStore(n) {
          const st = stores.get(n);
          const req = (fn) => { const r = {}; setTimeout(() => { r.result = fn(); r.onsuccess && r.onsuccess(); }); return r; };
          return {
            put(v) { st.rows.set(v[st.keyPath], v); },
            delete(k) { st.rows.delete(k); },
            get(k) { return req(() => st.rows.get(k)); },
            getAll() { return req(() => [...st.rows.values()]); },
          };
        },
      };
      setTimeout(() => tx.oncomplete && tx.oncomplete(), 5);
      return tx;
    },
  };
  return { open() { const r = { result: db }; setTimeout(() => { r.onupgradeneeded && r.onupgradeneeded(); r.onsuccess && r.onsuccess(); }); return r; } };
}

test('índice fica salvo: reabrir o app não reescaneia o HD; "Atualizar" reescaneia', async () => {
  let scans = 0;
  const hd = fakeDir('HD', [f('A - Um.zip'), f('B - Dois.zip')]);
  const realValues = hd.values;
  hd.values = function () { scans++; return realValues.call(this); };
  hd.queryPermission = async () => 'granted';
  const idb = memoryIndexedDB();

  const load = () => {
    const win = { showDirectoryPicker: async () => hd };
    new Function('window', 'indexedDB', readFileSync(path.join(ROOT, 'js/file-loader.js'), 'utf8'))(win, idb);
    new Function('window', 'indexedDB', readFileSync(path.join(ROOT, 'js/library.js'), 'utf8') + '\nwindow.createLibrary = createLibrary;')(win, idb);
    return win.createLibrary({ onFoldersChange() {}, onIndexChange() {}, onError() {} });
  };

  const first = load();
  await first.connectNewFolder();
  await new Promise(r => setTimeout(r, 20));
  assert.equal(scans, 1);

  const second = load(); // "reabriu o app"
  await second.restoreSavedFolders();
  assert.equal(scans, 1, 'reescaneou ao abrir');
  assert.equal(second.getIndexSize(), 2);
  assert.equal(second.search('dois')[0].title, 'Dois');
  assert.ok(second.getConnectedFolders()[0].scannedAt);

  await second.rescanFolder(second.getConnectedFolders()[0].id);
  assert.equal(scans, 2);
});
