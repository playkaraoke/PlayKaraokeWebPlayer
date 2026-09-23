import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, flush } from './helpers/app-harness.mjs';

/** Biblioteca falsa com um único arquivo "no disco". */
function stubLibrary(win) {
  const realCreate = win.createLibrary;
  win.createLibrary = (cbs) => {
    const lib = realCreate(cbs);
    const item = { folderId: 'f1', folderName: 'HD', name: 'A - Um.zip', code: null, artist: 'A', title: 'Um', format: 'MP3+G', type: 'cdg' };
    return {
      ...lib,
      restoreSavedFolders: async () => {},
      findByFolderAndName: (folderId, name) => (folderId === 'f1' && name === item.name ? item : null),
      getFileForItem: async (it) => new win.File(['x'], it.name),
    };
  };
}

test('fila da Biblioteca sobrevive a um F5', async () => {
  const saved = JSON.stringify({ items: [{ code: null, artist: 'A', title: 'Um', format: 'MP3+G', type: 'cdg', librarySource: { folderId: 'f1', fileName: 'A - Um.zip' }, savedSemitones: 2 }] });
  const { t } = await createApp({ localStorage: { 'playkaraoke-playlist-v1': saved }, beforeApp: stubLibrary });
  await t.ready;
  await flush();
  assert.equal(t.playlist.length, 1, 'fila restaurada veio vazia');
  assert.equal(t.playlist[0].savedSemitones, 2);
});
