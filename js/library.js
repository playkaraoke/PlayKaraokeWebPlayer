/**
 * Library — indexa pastas locais (HD externo, etc.) usando a File System
 * Access API do navegador, permitindo buscar por nome/artista/código sem
 * precisar arrastar cada arquivo manualmente.
 *
 * Só funciona em navegadores baseados em Chromium (Chrome, Edge, Opera) —
 * Safari e Firefox não implementam essa API. Detectamos isso e escondemos
 * a funcionalidade graciosamente nesse caso, sem quebrar o resto do app.
 *
 * Como funciona:
 *   1. Usuário concede acesso a uma pasta (showDirectoryPicker) — uma vez.
 *   2. Guardamos essa "permissão" (o FileSystemDirectoryHandle) no
 *      IndexedDB do navegador, pra não precisar pedir de novo toda vez
 *      que o app abre.
 *   3. Escaneamos a pasta recursivamente, catalogando só os NOMES dos
 *      arquivos .zip/.mp4 (não lemos conteúdo — por isso é rápido mesmo
 *      com uma pasta de 2TB).
 *   4. A busca roda inteiramente em memória sobre esse índice — instantânea.
 *   5. Quando o usuário clica num resultado, aí sim lemos o arquivo de
 *      verdade do disco (handle.getFile()) — sem rede, sem upload.
 */

const LIBRARY_DB_NAME = 'playkaraoke-library';
const LIBRARY_DB_VERSION = 1;
const LIBRARY_STORE = 'folders';
const MAX_SEARCH_RESULTS = 60;

const SUPPORTS_FILE_SYSTEM_ACCESS = 'showDirectoryPicker' in window;

let libraryIndex = [];        // { folderId, folderName, name, code, artist, title, format, type, handle }
let connectedFolders = [];    // { id, name, handle, fileCount, scanning, needsPermission }

// ---------- IndexedDB (persistência das pastas conectadas) ----------

function openLibraryDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LIBRARY_DB_NAME, LIBRARY_DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(LIBRARY_STORE)) {
        req.result.createObjectStore(LIBRARY_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPutFolder(id, name, handle) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, 'readwrite');
    tx.objectStore(LIBRARY_STORE).put({ id, name, handle });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbGetAllFolders() {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, 'readonly');
    const req = tx.objectStore(LIBRARY_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function dbDeleteFolder(id) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, 'readwrite');
    tx.objectStore(LIBRARY_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ---------- Escaneamento de pasta ----------

/** Varre uma pasta recursivamente, catalogando .zip/.mp4 no array `results`. */
async function scanDirectoryRecursive(dirHandle, folderId, folderName, results) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'directory') {
      await scanDirectoryRecursive(entry, folderId, folderName, results);
    } else if (entry.kind === 'file') {
      const lower = entry.name.toLowerCase();
      const isZip = lower.endsWith('.zip');
      const isMp4 = lower.endsWith('.mp4');
      if (!isZip && !isMp4) continue;
      const parsed = window.parseKaraokeFilename(entry.name);
      results.push({
        folderId,
        folderName,
        name: entry.name,
        code: parsed.code,
        artist: parsed.artist,
        title: parsed.title,
        format: isMp4 ? 'MP4' : 'MP3+G',
        type: isMp4 ? 'video' : 'cdg',
        handle: entry,
      });
    }
  }
}

// ---------- API pública do módulo ----------

/**
 * @param {object} callbacks
 * @param {(folders: object[]) => void} callbacks.onFoldersChange
 * @param {() => void} callbacks.onIndexChange
 * @param {(msg: string) => void} callbacks.onError
 */
function createLibrary({ onFoldersChange, onIndexChange, onError }) {
  function notifyFolders() { onFoldersChange(connectedFolders); }
  function notifyIndex() { onIndexChange(); }

  async function scanAndRegister(id, name, handle) {
    const existing = connectedFolders.find(f => f.id === id);
    if (existing) {
      existing.scanning = true;
      existing.needsPermission = false;
    } else {
      connectedFolders.push({ id, name, handle, fileCount: 0, scanning: true, needsPermission: false });
    }
    notifyFolders();

    const results = [];
    try {
      await scanDirectoryRecursive(handle, id, name, results);
    } catch (err) {
      console.error('[Library] Erro ao escanear pasta:', err);
      onError(`Não foi possível escanear a pasta "${name}".`);
    }

    libraryIndex = libraryIndex.filter(item => item.folderId !== id).concat(results);
    const folderEntry = connectedFolders.find(f => f.id === id);
    if (folderEntry) {
      folderEntry.fileCount = results.length;
      folderEntry.scanning = false;
    }
    notifyFolders();
    notifyIndex();
  }

  async function connectNewFolder() {
    if (!SUPPORTS_FILE_SYSTEM_ACCESS) {
      onError('Seu navegador não suporta essa funcionalidade (funciona no Chrome, Edge e Opera).');
      return;
    }
    let handle;
    try {
      handle = await window.showDirectoryPicker();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[Library] Erro ao abrir seletor de pasta:', err);
        onError('Não foi possível abrir o seletor de pasta.');
      }
      return; // usuário cancelou, ou erro — não faz nada
    }
    const id = 'folder_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    try {
      await dbPutFolder(id, handle.name, handle);
    } catch (err) {
      console.warn('[Library] Não foi possível salvar a pasta pra próxima sessão:', err);
    }
    await scanAndRegister(id, handle.name, handle);
  }

  async function reconnectFolder(id) {
    const folder = connectedFolders.find(f => f.id === id);
    if (!folder) return;
    try {
      const perm = await folder.handle.requestPermission({ mode: 'read' });
      if (perm === 'granted') {
        await scanAndRegister(id, folder.name, folder.handle);
      } else {
        onError('Permissão não concedida — a pasta continua desconectada.');
      }
    } catch (err) {
      console.error('[Library] Erro ao reconectar pasta:', err);
      onError('Não foi possível reconectar essa pasta.');
    }
  }

  async function removeFolder(id) {
    connectedFolders = connectedFolders.filter(f => f.id !== id);
    libraryIndex = libraryIndex.filter(item => item.folderId !== id);
    try {
      await dbDeleteFolder(id);
    } catch (err) {
      console.warn('[Library] Erro ao remover pasta do armazenamento:', err);
    }
    notifyFolders();
    notifyIndex();
  }

  async function restoreSavedFolders() {
    if (!SUPPORTS_FILE_SYSTEM_ACCESS) return;
    let saved;
    try {
      saved = await dbGetAllFolders();
    } catch (err) {
      console.warn('[Library] Erro ao carregar pastas salvas:', err);
      return;
    }
    for (const { id, name, handle } of saved) {
      try {
        const perm = await handle.queryPermission({ mode: 'read' });
        if (perm === 'granted') {
          await scanAndRegister(id, name, handle);
        } else {
          connectedFolders.push({ id, name, handle, fileCount: 0, scanning: false, needsPermission: true });
          notifyFolders();
        }
      } catch (err) {
        console.warn('[Library] Não foi possível restaurar a pasta', name, err);
      }
    }
  }

  /** Busca no índice em memória. Retorna até MAX_SEARCH_RESULTS itens. */
  /**
   * Busca por múltiplas palavras: cada palavra digitada precisa aparecer
   * em algum lugar (título, artista ou código), em qualquer ordem — não
   * precisa ser uma frase exata. Assim "planta certeza" acha "Planta e
   * Raiz - Com Certeza", mesmo as palavras não sendo vizinhas no nome.
   */
  function search(query) {
    const words = (query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    const results = [];
    for (const item of libraryIndex) {
      const haystack = [item.title, item.artist, item.code].filter(Boolean).join(' ').toLowerCase();
      if (words.every(word => haystack.includes(word))) {
        results.push(item);
        if (results.length >= MAX_SEARCH_RESULTS) break;
      }
    }
    return results;
  }

  async function getFileForItem(item) {
    return item.handle.getFile();
  }

  return {
    isSupported: () => SUPPORTS_FILE_SYSTEM_ACCESS,
    connectNewFolder,
    reconnectFolder,
    removeFolder,
    restoreSavedFolders,
    search,
    getFileForItem,
    getConnectedFolders: () => connectedFolders,
    getIndexSize: () => libraryIndex.length,
    findByFolderAndName: (folderId, name) => libraryIndex.find(item => item.folderId === folderId && item.name === name) || null,
  };
}

window.createLibrary = createLibrary;
