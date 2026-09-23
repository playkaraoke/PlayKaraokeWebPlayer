import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const win = {};
new Function('window', 'JSZip', readFileSync(path.join(ROOT, 'js/file-loader.js'), 'utf8'))(win, JSZip);

async function zipFile(entries, name = 'A - B.zip') {
  const zip = new JSZip();
  for (const [p, content] of entries) zip.file(p, content);
  const buf = await zip.generateAsync({ type: 'uint8array' });
  return new File([buf], name);
}
const text = (ab) => Buffer.from(ab).toString();

test('ignora o lixo __MACOSX/._ que o Finder coloca no zip', async () => {
  const file = await zipFile([
    ['Musica.cdg', 'CDG-REAL'], ['Musica.mp3', 'MP3-REAL'],
    ['__MACOSX/._Musica.cdg', 'lixo'], ['__MACOSX/._Musica.mp3', 'lixo'],
  ]);
  const r = await win.loadKaraokeFile(file);
  assert.equal(text(r.cdgBuffer), 'CDG-REAL');
  assert.equal(text(r.audioBuffer), 'MP3-REAL');
});

test('com vários áudios, prefere o de mesmo nome do .cdg', async () => {
  const file = await zipFile([['a/Musica.cdg', 'C'], ['a/Outra.mp3', 'ERRADO'], ['a/musica.mp3', 'CERTO']]);
  const r = await win.loadKaraokeFile(file);
  assert.equal(text(r.audioBuffer), 'CERTO');
});

test('zip sem .cdg dá erro claro', async () => {
  const file = await zipFile([['Musica.mp3', 'x'], ['__MACOSX/._Musica.cdg', 'lixo']]);
  await assert.rejects(win.loadKaraokeFile(file), /\.cdg/);
});

test('parser de nome: Código - Artista - Música', () => {
  assert.deepEqual({ ...win.parseKaraokeFilename('EJBg-0020 - Kansas - Play the Game Tonight (Acoustic).zip') },
    { code: 'EJBg-0020', artist: 'Kansas', title: 'Play the Game Tonight (Acoustic)' });
  assert.deepEqual({ ...win.parseKaraokeFilename('Queen - Bohemian Rhapsody.mp4') },
    { code: null, artist: 'Queen', title: 'Bohemian Rhapsody' });
});
