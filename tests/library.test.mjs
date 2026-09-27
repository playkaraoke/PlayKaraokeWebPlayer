/**
 * Biblioteca (js/library.js + js/library-worker.js). A "worker" roda no
 * próprio processo do teste (mesmo código, mensagens assíncronas).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => readFileSync(path.join(ROOT, f), 'utf8');

function fakeDir(name, children) {
  return {
    kind: 'directory', name, scans: 0,
    async *values() { this.scans++; yield* children; },
    async isSameEntry(other) { return other === this; },
    async queryPermission() { return 'granted'; },
    async getDirectoryHandle(n) { const d = children.find(c => c.kind === 'directory' && c.name === n); if (!d) throw new Error('NotFound'); return d; },
    async getFileHandle(n) { const c = children.find(c => c.kind === 'file' && c.name === n); if (!c) throw new Error('NotFound'); return c; },
  };
}
const f = (name) => ({ kind: 'file', name, async getFile() { return { name }; } });

/** IndexedDB mínimo em memória (put/get/getAll/delete), compartilhável entre "sessões". */
function memoryIndexedDB() {
  const dbs = new Map();
  return {
    open(name) {
      if (!dbs.has(name)) dbs.set(name, new Map());
      const stores = dbs.get(name);
      const db = {
        objectStoreNames: { contains: (n) => stores.has(n) },
        createObjectStore: (n, opts = {}) => { stores.set(n, { keyPath: opts.keyPath, rows: new Map() }); },
        deleteObjectStore: (n) => stores.delete(n),
        transaction() {
          const tx = {
            objectStore(n) {
              const st = stores.get(n);
              const req = (fn) => { const r = {}; setTimeout(() => { r.result = fn(); r.onsuccess && r.onsuccess(); }); return r; };
              return {
                put(v, k) { st.rows.set(st.keyPath ? v[st.keyPath] : k, v); }, // sem clonar: os handles falsos têm funções
                delete(k) { st.rows.delete(k); },
                get(k) { return req(() => st.rows.get(k)); },
                getAll() { return req(() => [...st.rows.values()]); },
              };
            },
          };
          setTimeout(() => tx.oncomplete && tx.oncomplete(), 2);
          return tx;
        },
      };
      const r = { result: db };
      setTimeout(() => { r.onupgradeneeded && r.onupgradeneeded(); r.onsuccess && r.onsuccess(); });
      return r;
    },
  };
}

/** Uma "sessão" do app: módulos carregados do zero, IndexedDB compartilhado. */
function session(pickedDirs, idb) {
  const win = { showDirectoryPicker: async () => pickedDirs.shift() };
  const self = win;
  new Function('window', 'self', src('js/file-loader.js'))(win, self);
  const createCore = new Function('self', src('js/library-worker.js') + '\nreturn createLibraryIndexCore;')(self);
  new Function('window', 'indexedDB', src('js/library.js') + '\nwindow.createLibrary = createLibrary;')(win, idb);
  const createWorker = () => {
    const w = { onmessage: null };
    const core = createCore((m) => setTimeout(() => w.onmessage({ data: m })), idb, win.parseKaraokeFilename);
    w.postMessage = (m) => setTimeout(() => core.handle(m));
    return w;
  };
  const events = { folders: 0 };
  const lib = win.createLibrary({ onFoldersChange() { events.folders++; }, onIndexChange() {}, onError(e) { throw new Error(e); }, createWorker });
  return { lib, events };
}

function acervo() {
  return fakeDir('HD', [
    f('EJBg-0020 - Kansas - Play the Game Tonight.zip'),
    f('Planta e Raiz - Com Certeza.zip'),
    f('leia-me.txt'),
    f('._PLK-1766 - Air Supply - Even The Nights Are Better.zip'), // fantasma do macOS
    fakeDir('Sub', [f('Os Aviões - Voando Alto.mp4'), f('._Os Aviões - Voando Alto.mp4')]),
    fakeDir('.Trashes', [f('Apagada - Musica.zip')]),
    fakeDir('__MACOSX', [f('Lixo - Musica.zip')]),
  ]);
}

test('busca multi-palavra, sem acento, em subpastas, ignorando ocultos e outros formatos', async () => {
  const { lib } = session([acervo()], memoryIndexedDB());
  await lib.connectNewFolder();
  assert.equal(lib.getIndexSize(), 3);
  assert.equal((await lib.search('planta certeza'))[0].title, 'Com Certeza');
  const avioes = (await lib.search('avioes'))[0];
  assert.equal(avioes.artist, 'Os Aviões');
  assert.deepEqual(Array.from(avioes.path), ['Sub']);
  assert.equal((await lib.search('ejbg-0020')).length, 1);
  assert.equal((await lib.search('inexistente')).length, 0);
  assert.equal((await lib.search('even nights')).length, 0, 'arquivo fantasma ._ foi indexado');
});

test('arquivo é aberto pelo caminho a partir da pasta conectada', async () => {
  const { lib } = session([acervo()], memoryIndexedDB());
  await lib.connectNewFolder();
  const item = (await lib.search('avioes'))[0];
  const file = await lib.getFileForItem(item);
  assert.equal(file.name, 'Os Aviões - Voando Alto.mp4');
});

test('conectar a mesma pasta duas vezes não duplica os resultados', async () => {
  const hd = acervo();
  const { lib } = session([hd, hd], memoryIndexedDB());
  await lib.connectNewFolder();
  await lib.connectNewFolder();
  assert.equal(lib.getConnectedFolders().length, 1);
  assert.equal(lib.getIndexSize(), 3);
});

test('índice salvo: reabrir o app não reescaneia o HD; "Atualizar" reescaneia', async () => {
  const hd = acervo();
  const idb = memoryIndexedDB();
  const first = session([hd], idb).lib;
  await first.connectNewFolder();
  await new Promise(r => setTimeout(r, 30));
  assert.equal(hd.scans, 1);

  const second = session([], idb).lib; // "reabriu o app"
  await second.restoreSavedFolders();
  assert.equal(hd.scans, 1, 'reescaneou ao abrir');
  assert.equal(second.getIndexSize(), 3);
  assert.equal((await second.search('dois')).length, 0);
  assert.equal((await second.search('kansas'))[0].code, 'EJBg-0020');
  assert.ok(second.getConnectedFolders()[0].scannedAt);
  assert.equal((await second.findByFolderAndName(second.getConnectedFolders()[0].id, 'Planta e Raiz - Com Certeza.zip')).title, 'Com Certeza');

  await second.rescanFolder(second.getConnectedFolders()[0].id);
  assert.equal(hd.scans, 2);
});

test('HD grande: índice salvo em blocos e escaneamento com progresso', async () => {
  const files = [];
  for (let i = 0; i < 45000; i++) files.push(f(`SC${1000 + (i % 9000)}-${String(i % 20).padStart(2, '0')} - Artista ${i} - Musica ${i}.zip`));
  const big = fakeDir('Grande', files);
  const idb = memoryIndexedDB();
  const s1 = session([big], idb);
  await s1.lib.connectNewFolder();
  assert.equal(s1.lib.getIndexSize(), 45000);
  assert.ok(s1.events.folders > 10, 'deveria avisar o progresso durante o escaneamento');
  await new Promise(r => setTimeout(r, 50));
  const s2 = session([], idb);
  await s2.lib.restoreSavedFolders();
  assert.equal(s2.lib.getIndexSize(), 45000);
  assert.equal((await s2.lib.search('artista 44999'))[0].title, 'Musica 44999');
});

test('cancelar o escaneamento mantém o índice anterior', async () => {
  const hd = acervo();
  const { lib } = session([hd], memoryIndexedDB());
  await lib.connectNewFolder();
  const id = lib.getConnectedFolders()[0].id;
  const running = lib.rescanFolder(id);
  await lib.cancelScan(id);
  await running;
  assert.equal(lib.getIndexSize(), 3);
  assert.equal(lib.getConnectedFolders()[0].scanning, false);
});
