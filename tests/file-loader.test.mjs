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

test('parser reconhece os códigos das produtoras do acervo', () => {
  const cases = {
    'SC8123-05 - Adele - Hello.zip': 'SC8123-05',
    'SCG1234-07 - Adele - Hello.zip': 'SCG1234-07',
    'PLK-0012 - Artista - Musica.zip': 'PLK-0012',
    'PLKM0450 - Artista - Musica.mp4': 'PLKM0450',
    'EJBg-0020 - Kansas - Play.zip': 'EJBg-0020',
    'EJBv-0101 - Kansas - Play.mp4': 'EJBv-0101',
    'KV12345 - Queen - Bohemian.zip': 'KV12345',
    'KVD-12345 - Queen - Bohemian.mp4': 'KVD-12345',
    'ZOOM 1234 - Artista - Musica.zip': 'ZOOM 1234',
    'ZOOM1234-05 - Artista - Musica.zip': 'ZOOM1234-05',
    'RAF0123 - Artista - Musica.zip': 'RAF0123',
    'SF001-01 - Artista - Musica.zip': 'SF001-01',
    'SFMW830-12 - Artista - Musica.zip': 'SFMW830-12',
    'STG12345 - Artista - Musica.mp4': 'STG12345',
    'SBI-1234 - Artista - Musica.zip': 'SBI-1234',
  };
  for (const [name, code] of Object.entries(cases)) {
    const r = win.parseKaraokeFilename(name);
    assert.equal(r.code, code, name);
    assert.equal(r.title.startsWith('Musica') || ['Hello', 'Play', 'Bohemian'].includes(r.title), true, name);
  }
});

test('parser: código + título sem artista, e sem falsos positivos', () => {
  assert.deepEqual({ ...win.parseKaraokeFilename('SF001-01 - Hello.zip') }, { code: 'SF001-01', artist: null, title: 'Hello' });
  assert.deepEqual({ ...win.parseKaraokeFilename('Blink 182 - All the Small Things.zip') }, { code: null, artist: 'Blink 182', title: 'All the Small Things' });
  assert.deepEqual({ ...win.parseKaraokeFilename('Nome da Musica - Artista - Ao Vivo.zip') }, { code: null, artist: 'Nome da Musica', title: 'Artista - Ao Vivo' });
});
