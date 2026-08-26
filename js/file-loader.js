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

    let cdgEntry = null;
    let audioEntry = null;
    let audioExt = null;

    zip.forEach((relPath, entry) => {
      const lower = relPath.toLowerCase();
      if (lower.endsWith('.cdg')) {
        cdgEntry = entry;
      } else {
        for (const ext of AUDIO_EXTENSIONS) {
          if (lower.endsWith(ext)) {
            audioEntry = entry;
            audioExt = ext;
          }
        }
      }
    });

    if (!cdgEntry || !audioEntry) {
      throw new Error('O ZIP precisa conter um arquivo .cdg e um arquivo de áudio (.mp3/.wav).');
    }

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

  throw new Error('Formato não suportado. Envie um .zip (MP3+G) ou .mp4.');
}

function cleanTitle(filename) {
  return filename.replace(/\.(zip|mp4)$/i, '').replace(/[_-]+/g, ' ').trim();
}

window.loadKaraokeFile = loadKaraokeFile;
window.parseKaraokeFilename = parseKaraokeFilename;
