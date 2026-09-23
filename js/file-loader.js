/**
 * File Loader — recebe um File (do input ou drag&drop) e identifica o tipo:
 *  - .zip  -> extrai o .cdg e o arquivo de áudio (mp3/wav) de dentro
 *  - .mp4  -> vídeo com letras já embutidas, tocado direto
 *
 * Depende da global JSZip (carregada via CDN no index.html).
 */

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a'];

/**
 * Interpreta o nome do arquivo seguindo a convenção comum de packs de
 * karaokê: "CÓDIGO - Artista - Música". Exemplos reais:
 *   "EJBg-0020 - Kansas - Play the Game Tonight (Acoustic)"
 *   "Queen - Bohemian Rhapsody"          (sem código)
 *   "Some Random File Name"              (sem separador nenhum)
 *
 * Estratégia: separa por " - " (espaço-hífen-espaço, pra não confundir com
 * hífens que fazem parte do próprio código, tipo "EJBg-0020"). O primeiro
 * pedaço só é tratado como "código" se PARECER um código de verdade (letras
 * curtas + números, tipo "EJBg-0020") — senão, um título comprido que por
 * acaso tenha 2+ traços (ex: "Nome da Música - Artista - Extra") acabaria
 * sendo confundido com código.
 *
 * @param {string} filename
 * @returns {{code: string|null, artist: string|null, title: string}}
 */
function parseKaraokeFilename(filename) {
  const clean = filename.replace(/\.(zip|mp4)$/i, '').trim();
  const parts = clean.split(/\s+-\s+/).map(p => p.trim()).filter(Boolean);

  const looksLikeCode = (s) => /^[A-Za-z]{1,8}-?\d{2,8}$/.test(s);

  if (parts.length >= 3 && looksLikeCode(parts[0])) {
    return {
      code: parts[0],
      artist: parts[1],
      title: parts.slice(2).join(' - '),
    };
  }
  if (parts.length >= 2) {
    return {
      code: null,
      artist: parts[0],
      title: parts.slice(1).join(' - '),
    };
  }
  return {
    code: null,
    artist: null,
    title: clean || filename,
  };
}

async function loadKaraokeFile(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.mp4')) {
    return {
      type: 'video',
      title: cleanTitle(file.name),
      videoBlobUrl: URL.createObjectURL(file),
    };
  }

  if (name.endsWith('.zip')) {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const cdgEntries = [];
    const audioEntries = []; // { entry, ext }

    zip.forEach((relPath, entry) => {
      if (entry.dir || isJunkZipEntry(relPath)) return;
      const lower = relPath.toLowerCase();
      if (lower.endsWith('.cdg')) {
        cdgEntries.push(entry);
        return;
      }
      const ext = AUDIO_EXTENSIONS.find(e => lower.endsWith(e));
      if (ext) audioEntries.push({ entry, ext });
    });

    const cdgEntry = cdgEntries[0] || null;
    // Com mais de um áudio no zip, prefere o que tem o mesmo nome do .cdg.
    const cdgBase = cdgEntry ? baseNameNoExt(cdgEntry.name) : null;
    const audioChoice = audioEntries.find(a => baseNameNoExt(a.entry.name) === cdgBase) || audioEntries[0] || null;

    if (!cdgEntry || !audioChoice) {
      throw new Error(tr('err_zip_invalid', 'O ZIP precisa conter um arquivo .cdg e um arquivo de áudio (.mp3/.wav).'));
    }
    const audioEntry = audioChoice.entry;
    const audioExt = audioChoice.ext;

    const [cdgBuffer, audioBuffer] = await Promise.all([
      cdgEntry.async('arraybuffer'),
      audioEntry.async('arraybuffer'),
    ]);

    return {
      type: 'cdg',
      title: cleanTitle(file.name),
      cdgBuffer,
      audioBuffer,
      audioExt,
    };
  }

  throw new Error(tr('err_unsupported_format', 'Formato não suportado. Envie um .zip (MP3+G) ou .mp4.'));
}

/** Traduz via i18n quando disponível (fallback em português). */
function tr(key, fallback) {
  return window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(key) : fallback;
}

/** Lixo que o macOS/Windows colocam dentro de zips: a pasta __MACOSX/ e
 * os arquivos "._nome" (metadados AppleDouble, que também terminam em
 * .cdg/.mp3 e eram escolhidos no lugar do arquivo de verdade). */
function isJunkZipEntry(relPath) {
  if (/(^|\/)__MACOSX\//i.test(relPath)) return true;
  const base = relPath.split('/').pop();
  return base.startsWith('._') || base === '.DS_Store' || base.toLowerCase() === 'thumbs.db';
}

function baseNameNoExt(relPath) {
  return relPath.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase();
}

function cleanTitle(filename) {
  return filename.replace(/\.(zip|mp4)$/i, '').replace(/[_-]+/g, ' ').trim();
}

window.loadKaraokeFile = loadKaraokeFile;
window.parseKaraokeFilename = parseKaraokeFilename;
