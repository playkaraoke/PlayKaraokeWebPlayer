import { AudioEngine } from './audio-engine.js';

const el = (id) => document.getElementById(id);

// ---------- Elementos ----------

const dropZone = el('stage-empty');
const sidebar = el('sidebar');
const sidebarResizeHandle = el('sidebar-resize-handle');
const fileInput = el('file-input');
const stageEmpty = el('stage-empty');
const stageCanvasWrap = el('stage-canvas-wrap');
const stageVideoWrap = el('stage-video-wrap');
const cdgCanvas = el('cdg-canvas');
const videoEl = el('video-el');
const fullscreenBtn = el('fullscreen-btn');

const metaCode = el('meta-code');
const metaArtist = el('meta-artist');
const metaSong = el('meta-song');
const metaFormat = el('meta-format');

const playBtn = el('play-btn');
const playIcon = el('play-icon');
const pauseIcon = el('pause-icon');
const nextBtn = el('next-btn');
const seekBar = el('seek-bar');
const timeCurrent = el('time-current');
const timeDuration = el('time-duration');

const volumeSlider = el('volume-slider');
const volumePct = el('volume-pct');
const pitchDownBtn = el('pitch-down-btn');
const pitchUpBtn = el('pitch-up-btn');
const pitchValue = el('pitch-value');
const pitchResetBtn = el('pitch-reset-btn');

const errorBanner = el('error-banner');
const loadingBanner = el('loading-banner');

const settingsBtn = el('settings-btn');
const settingsModalBackdrop = el('settings-modal-backdrop');
const settingsCloseBtn = el('settings-close-btn');
const customColorsToggle = el('custom-colors-toggle');
const colorBackground = el('color-background');
const colorText = el('color-text');
const colorHighlight = el('color-highlight');
const applauseToggle = el('applause-toggle');
const applauseAudio = el('applause-audio');

const autoplayToggle = el('autoplay-toggle');
const autoplayDelayInput = el('autoplay-delay-input');

const ambientToggle = el('ambient-toggle');
const ambientVolumeSlider = el('ambient-volume-slider');
const ambientVolumePct = el('ambient-volume-pct');
const ambientAudio = el('ambient-audio');

const countdownOverlay = el('countdown-overlay');
const cdNumber = el('cd-number');
const cdNextTitle = el('cd-next-title');
const cdSkipBtn = el('cd-skip-btn');

const addMusicBtn = el('add-music-btn');
const sidebarDropzone = el('sidebar-dropzone');
const playlistEl = el('playlist');
const playlistCount = el('playlist-count');

const tabFilaBtn = el('tab-fila-btn');
const tabBibliotecaBtn = el('tab-biblioteca-btn');
const tabFilaPanel = el('tab-fila-panel');
const tabBibliotecaPanel = el('tab-biblioteca-panel');

const librarySearchInput = el('library-search-input');
const libraryResults = el('library-results');
const libraryFoldersList = el('library-folders-list');
const connectFolderBtn = el('connect-folder-btn');
const libraryUnsupported = el('library-unsupported');

const openSecondBtn = el('open-second-btn');
const secondScreenStatus = el('second-screen-status');

const quickSecondScreenBtn = el('quick-second-screen-btn');
const quickAutoplayBtn = el('quick-autoplay-btn');
const quickApplauseBtn = el('quick-applause-btn');
const quickAmbientBtn = el('quick-ambient-btn');

const idleOverlay = el('idle-overlay');
const idleLogo = el('idle-logo');
const idleCustomImage = el('idle-custom-image');
const idleImageInput = el('idle-image-input');
const idleImageUploadBtn = el('idle-image-upload-btn');
const idleImageRemoveBtn = el('idle-image-remove-btn');
const idleImageFilename = el('idle-image-filename');

const trackModalBackdrop = el('track-modal-backdrop');
const tmCode = el('tm-code');
const tmArtist = el('tm-artist');
const tmFormat = el('tm-format');
const tmTitle = el('tm-title');
const tmPitchDownBtn = el('tm-pitch-down-btn');
const tmPitchUpBtn = el('tm-pitch-up-btn');
const tmPitchValue = el('tm-pitch-value');
const tmCancelBtn = el('tm-cancel-btn');
const tmPlayBtn = el('tm-play-btn');

// ---------- Motores ----------

const engine = new AudioEngine();
const cdgPlayer = new CDGPlayer(cdgCanvas);

// O motor de áudio em thread separada (AudioWorklet) é o padrão — deixa o
// desenho da letra bem mais fluido, já que o processamento de áudio não
// compete mais pela mesma thread. Se não for suportado no navegador, cai
// sozinho pro motor padrão (ScriptProcessorNode) sem quebrar nada.
engine.setPreferredBackend('worklet');
engine.addEventListener('backendchange', (e) => {
  if (e.detail.fallback) {
    console.warn('[App] Motor de thread separada não disponível aqui, usando o padrão. Motivo:', e.detail.reason);
  }
});

// CDG sempre renderiza suavizado — o formato é nativamente 300x216px (TV
// dos anos 90), então "nítido" só deixava tudo visivelmente quadriculado
// sem ganho real de qualidade.
cdgPlayer.setRenderMode('smooth');

// Cores personalizadas ficam DESLIGADAS por padrão — o usuário liga
// explicitamente no painel de configurações se quiser recolorir.
cdgPlayer.setCustomColors(null);

// ---------- Estado ----------

let mode = null; // 'cdg' | 'video'
let seeking = false;
let applauseTriggered = false; // evita disparar os aplausos mais de uma vez por música

let playlist = []; // { id, file, code, artist, title, format, type }
let playlistIdCounter = 0;
let currentIndex = -1;

let countdownTimerId = null;
let countdownRemaining = 0;

let customIdleImageDataUrl = null; // imagem de fundo custom pra tela ociosa (base64), ou null = usa a logo
let modalTrackIndex = -1; // índice da música que o modal de info está mostrando
let modalPitchValue = 0;
let dragFromIndex = -1; // índice sendo arrastado na reordenação por drag&drop
let videoPitchRouted = false; // true se o <video> atual está passando pelo pitch shifter

// ---------- Utilidades ----------

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove('hidden');
  setTimeout(() => errorBanner.classList.add('hidden'), 5000);
}

function showLoading(show) {
  loadingBanner.classList.toggle('hidden', !show);
}

function setStage(newMode) {
  mode = newMode;
  stageEmpty.classList.toggle('hidden', !!mode);
  stageCanvasWrap.classList.toggle('hidden', mode !== 'cdg');
  stageVideoWrap.classList.toggle('hidden', mode !== 'video');
}

function updateMetaBar(item) {
  if (!item) {
    metaCode.textContent = '—';
    metaArtist.textContent = '—';
    metaSong.textContent = 'Nenhuma música carregada';
    metaFormat.textContent = '';
    return;
  }
  metaCode.textContent = item.code || '—';
  metaArtist.textContent = item.artist || '—';
  metaSong.textContent = item.title;
  metaFormat.textContent = item.format;
}

// ---------- Playlist ----------

function hasNext() {
  return currentIndex >= 0 && currentIndex < playlist.length - 1;
}

function renderPlaylist() {
  playlistCount.textContent = `Fila (${playlist.length})`;
  playlistEl.innerHTML = '';

  if (playlist.length === 0) {
    const hint = document.createElement('p');
    hint.id = 'playlist-empty-hint';
    hint.textContent = 'Sua fila aparece aqui. Carregue um ou mais arquivos pra começar.';
    playlistEl.appendChild(hint);
    nextBtn.disabled = true;
    persistPlaylist();
    return;
  }

  playlist.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
    row.draggable = true;
    row.dataset.index = String(i);

    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = i === currentIndex ? '▶' : String(i + 1);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const titleEl = document.createElement('div');
    titleEl.className = 'song-title';
    titleEl.textContent = item.title;
    const subEl = document.createElement('div');
    subEl.className = 'song-sub';
    subEl.textContent = [item.artist, item.code].filter(Boolean).join(' · ') || item.format;
    meta.appendChild(titleEl);
    meta.appendChild(subEl);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remover da fila';
    removeBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromPlaylist(i);
    });

    const reorderBtns = document.createElement('div');
    reorderBtns.className = 'reorder-btns';
    const upBtn = document.createElement('button');
    upBtn.className = 'reorder-btn';
    upBtn.title = 'Mover pra cima';
    upBtn.disabled = i === 0;
    upBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/></svg>';
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moveTrack(i, -1);
    });
    const downBtn = document.createElement('button');
    downBtn.className = 'reorder-btn';
    downBtn.title = 'Mover pra baixo';
    downBtn.disabled = i === playlist.length - 1;
    downBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>';
    downBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moveTrack(i, 1);
    });
    reorderBtns.appendChild(upBtn);
    reorderBtns.appendChild(downBtn);

    row.appendChild(num);
    row.appendChild(meta);
    row.appendChild(reorderBtns);
    row.appendChild(removeBtn);
    row.addEventListener('click', () => openTrackModal(i));

    // ---- Drag & drop pra reordenar ----
    row.addEventListener('dragstart', (e) => {
      dragFromIndex = i;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(i)); } catch (err) {}
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      document.querySelectorAll('.playlist-item').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      dragFromIndex = -1;
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dragFromIndex === -1 || dragFromIndex === i) return;
      const rect = row.getBoundingClientRect();
      const isTopHalf = (e.clientY - rect.top) < rect.height / 2;
      row.classList.toggle('drag-over-top', isTopHalf);
      row.classList.toggle('drag-over-bottom', !isTopHalf);
    });
    row.addEventListener('dragleave', () => {
      row.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over-top', 'drag-over-bottom');
      if (dragFromIndex === -1 || dragFromIndex === i) return;
      const rect = row.getBoundingClientRect();
      const isTopHalf = (e.clientY - rect.top) < rect.height / 2;
      const targetIndex = isTopHalf ? i : i + 1;
      reorderTrack(dragFromIndex, targetIndex);
    });

    playlistEl.appendChild(row);
  });

  nextBtn.disabled = !hasNext();
  persistPlaylist();
}

function moveTrack(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= playlist.length) return;
  [playlist[index], playlist[newIndex]] = [playlist[newIndex], playlist[index]];
  if (currentIndex === index) currentIndex = newIndex;
  else if (currentIndex === newIndex) currentIndex = index;
  renderPlaylist();
}

/** Move o item de `fromIndex` pra posição `toIndex` (estilo drag&drop, onde toIndex já considera a inserção). */
function reorderTrack(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex + 1 === toIndex) return; // não muda nada
  const [moved] = playlist.splice(fromIndex, 1);
  let insertAt = toIndex;
  if (fromIndex < toIndex) insertAt -= 1; // compensa o item removido antes do alvo
  playlist.splice(insertAt, 0, moved);

  if (currentIndex === fromIndex) {
    currentIndex = insertAt;
  } else if (fromIndex < currentIndex && insertAt >= currentIndex) {
    currentIndex -= 1;
  } else if (fromIndex > currentIndex && insertAt <= currentIndex) {
    currentIndex += 1;
  }

  renderPlaylist();
}

function removeFromPlaylist(index) {
  if (index < 0 || index >= playlist.length) return;
  playlist.splice(index, 1);

  if (index === currentIndex) {
    // A música removida era a que estava tocando/selecionada agora.
    cancelCountdown();
    if (playlist.length === 0) {
      currentIndex = -1;
      resetToEmptyState();
      return;
    }
    const nextIndex = Math.min(index, playlist.length - 1);
    selectTrack(nextIndex, { autoplay: false });
    return;
  }

  if (index < currentIndex) {
    currentIndex -= 1;
  }
  renderPlaylist();
}

async function addFilesToQueue(files) {
  const list = Array.from(files || []);
  if (!list.length) return;

  const wasEmpty = playlist.length === 0;
  let firstNewIndex = -1;
  let skippedAny = false;

  for (const file of list) {
    const lower = file.name.toLowerCase();
    const isZip = lower.endsWith('.zip');
    const isMp4 = lower.endsWith('.mp4');
    if (!isZip && !isMp4) {
      skippedAny = true;
      continue;
    }
    const parsed = window.parseKaraokeFilename(file.name);
    const item = {
      id: 'track_' + (++playlistIdCounter),
      file,
      code: parsed.code,
      artist: parsed.artist,
      title: parsed.title,
      format: isMp4 ? 'MP4' : 'MP3+G',
      type: isMp4 ? 'video' : 'cdg',
    };
    if (firstNewIndex === -1) firstNewIndex = playlist.length;
    playlist.push(item);
  }

  renderPlaylist();

  if (skippedAny) {
    showError('Alguns arquivos foram ignorados: só .zip (MP3+G) e .mp4 são suportados.');
  }

  if (wasEmpty && firstNewIndex !== -1) {
    await selectTrack(firstNewIndex, { autoplay: false });
  }
}

async function selectTrack(index, { autoplay, initialSemitones } = { autoplay: false, initialSemitones: 0 }) {
  if (index < 0 || index >= playlist.length) return;
  cancelCountdown();

  currentIndex = index;
  renderPlaylist();

  const item = playlist[index];
  showLoading(true);
  try {
    const result = await window.loadKaraokeFile(item.file);
    applauseTriggered = false;
    silenceAccumMs = 0;
    lastSilenceCheckMs = 0;
    updateMetaBar(item);
    setSemitones(initialSemitones || 0); // cada música começa no tom escolhido (ou original, por padrão)

    if (result.type === 'cdg') {
      cdgPlayer.load(result.cdgBuffer);
      await engine.loadArrayBuffer(result.audioBuffer);
      setStage('cdg');
      timeDuration.textContent = formatTime(engine.getDuration());
      seekBar.max = String(Math.floor(engine.getDuration() * 1000));
      seekBar.value = '0';
      broadcastToSecondScreen({
        type: 'init-cdg',
        cdgBuffer: result.cdgBuffer,
        colors: getActiveColors(),
        meta: { title: item.title, artist: item.artist, code: item.code, format: item.format },
      });
    } else if (result.type === 'video') {
      videoEl.src = result.videoBlobUrl;
      setStage('video');
      videoEl.load();

      // Tenta rotear o áudio do vídeo pelo mesmo pitch shifter usado no
      // CDG — só funciona no motor de thread separada (worklet); se caiu
      // pro motor antigo, o vídeo toca normal, sem ajuste de tom.
      const pitchOk = await engine.ensureVideoPitchSupport();
      videoPitchRouted = pitchOk && engine.attachVideoElement(videoEl);
      if (!videoPitchRouted) {
        console.warn('[App] Ajuste de tom não disponível pra esse vídeo neste navegador.');
      }
      pitchDownBtn.title = videoPitchRouted || mode !== 'video'
        ? 'Diminuir um semitom'
        : 'Ajuste de tom indisponível pra vídeo neste navegador';
      pitchUpBtn.title = pitchDownBtn.title;

      broadcastToSecondScreen({
        type: 'init-video',
        videoUrl: result.videoBlobUrl,
        meta: { title: item.title, artist: item.artist, code: item.code, format: item.format },
      });
    }

    playBtn.disabled = false;
    settingsBtn.classList.remove('hidden');

    if (autoplay) {
      if (mode === 'cdg') {
        await engine.play();
      } else if (mode === 'video') {
        await videoEl.play();
        updatePlayIcon();
      }
    }
    refreshIdleState();
  } catch (err) {
    console.error(err);
    showError(err.message || 'Não foi possível carregar essa música.');
  } finally {
    showLoading(false);
  }
}

function playNextInQueue() {
  if (hasNext()) selectTrack(currentIndex + 1, { autoplay: true });
}

nextBtn.addEventListener('click', playNextInQueue);

// ---------- Modal de informações da música (abre ao clicar na fila) ----------

function updateTmPitchLabel() {
  const sign = modalPitchValue > 0 ? '+' : '';
  tmPitchValue.textContent = `${sign}${modalPitchValue}`;
  tmPitchDownBtn.disabled = modalPitchValue <= -12;
  tmPitchUpBtn.disabled = modalPitchValue >= 12;
}

function openTrackModal(index) {
  const item = playlist[index];
  if (!item) return;
  modalTrackIndex = index;

  const isActive = index === currentIndex;
  modalPitchValue = isActive ? currentSemitones : 0;

  tmCode.textContent = item.code || '—';
  tmArtist.textContent = item.artist || '—';
  tmFormat.textContent = item.format;
  tmTitle.textContent = item.title;
  tmPlayBtn.textContent = isActive ? 'Aplicar tom' : 'Tocar';
  updateTmPitchLabel();

  trackModalBackdrop.classList.remove('hidden');
}

function closeTrackModal() {
  trackModalBackdrop.classList.add('hidden');
  modalTrackIndex = -1;
}

tmPitchDownBtn.addEventListener('click', () => {
  modalPitchValue = Math.max(-12, modalPitchValue - 1);
  updateTmPitchLabel();
});
tmPitchUpBtn.addEventListener('click', () => {
  modalPitchValue = Math.min(12, modalPitchValue + 1);
  updateTmPitchLabel();
});
tmCancelBtn.addEventListener('click', closeTrackModal);
trackModalBackdrop.addEventListener('click', (e) => {
  if (e.target === trackModalBackdrop) closeTrackModal();
});
tmPlayBtn.addEventListener('click', () => {
  const index = modalTrackIndex;
  const semitones = modalPitchValue;
  const isActive = index === currentIndex;
  closeTrackModal();
  if (isActive) {
    setSemitones(semitones);
  } else {
    selectTrack(index, { autoplay: true, initialSemitones: semitones });
  }
});

// ---------- Reset (fila vazia) ----------

function resetToEmptyState() {
  engine.stop();
  if (mode === 'video') {
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }
  cdgPlayer.reset();
  cdgPlayer.clearScreen();
  applauseAudio.pause();
  applauseAudio.currentTime = 0;
  applauseTriggered = false;
  silenceAccumMs = 0;
  lastSilenceCheckMs = 0;
  cancelCountdown();

  setStage(null);
  updateMetaBar(null);
  timeCurrent.textContent = '0:00';
  timeDuration.textContent = '0:00';
  seekBar.value = '0';

  playBtn.disabled = true;
  settingsBtn.classList.remove('active');
  settingsModalBackdrop.classList.add('hidden');
  updatePlayIcon();
  renderPlaylist();
  refreshIdleState();

  broadcastToSecondScreen({ type: 'clear' });
}

// ---------- Carregar arquivos (botão / drop / input) ----------

addMusicBtn.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  addFilesToQueue(fileInput.files);
  fileInput.value = '';
});

// IMPORTANTE: o navegador, por padrão, abre/toca qualquer arquivo solto
// sobre a página (fora de um drop-target específico) em vez de deixar o
// nosso JS tratar o evento. Por isso precisamos interceptar 'dragover' e
// 'drop' em TODA a janela (não só na caixa pontilhada), chamando
// preventDefault() sempre — mesmo quando o arquivo é solto fora da caixa —
// para o navegador nunca assumir o controle.

['dragenter', 'dragover', 'drop'].forEach(evt => {
  window.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

['dragenter', 'dragover'].forEach(evt =>
  window.addEventListener(evt, () => {
    dropZone.classList.add('drag-active');
  })
);
['dragleave', 'drop'].forEach(evt =>
  window.addEventListener(evt, (e) => {
    if (evt === 'drop' || e.relatedTarget === null) {
      dropZone.classList.remove('drag-active');
    }
  })
);

window.addEventListener('drop', (e) => {
  const files = e.dataTransfer && e.dataTransfer.files;
  if (files && files.length) addFilesToQueue(files);
});

// ---------- Transporte (play/pause/seek) ----------

function updatePlayIcon() {
  const playing = mode === 'video' ? !videoEl.paused : engine.isPlaying();
  playIcon.classList.toggle('hidden', playing);
  pauseIcon.classList.toggle('hidden', !playing);
}

playBtn.addEventListener('click', async () => {
  try {
    if (mode === 'cdg') {
      if (engine.isPlaying()) {
        engine.pause();
      } else {
        await engine.play();
      }
    } else if (mode === 'video') {
      if (videoEl.paused) {
        await videoEl.play();
      } else {
        videoEl.pause();
      }
      updatePlayIcon();
    }
  } catch (err) {
    console.error('Erro ao dar play:', err);
    showError('Não foi possível iniciar a reprodução: ' + (err.message || err));
  }
});

seekBar.addEventListener('input', () => {
  seeking = true;
  timeCurrent.textContent = formatTime(Number(seekBar.value) / 1000);
});
seekBar.addEventListener('change', () => {
  const sec = Number(seekBar.value) / 1000;
  if (mode === 'cdg') {
    engine.seekTo(sec);
    cdgPlayer.update(sec);
  } else if (mode === 'video') {
    videoEl.currentTime = sec;
  }
  seeking = false;
});

// ---------- Volume ----------

volumeSlider.addEventListener('input', () => {
  const pct = Number(volumeSlider.value);
  const vol = pct / 100;
  engine.setVolume(vol);
  // Se o vídeo está passando pelo pitch shifter, o volume já é aplicado
  // ali (gainNode) — setar videoEl.volume TAMBÉM multiplicaria o volume
  // duas vezes. Só controlamos videoEl.volume direto quando ele NÃO está
  // roteado (tocando o áudio nativo dele mesmo).
  videoEl.volume = videoPitchRouted ? 1 : vol;
  volumePct.textContent = pct + '%';
});
volumePct.textContent = volumeSlider.value + '%';

// ---------- Pitch (tom) ----------

let currentSemitones = 0;

function updatePitchLabel(semitones) {
  const sign = semitones > 0 ? '+' : '';
  pitchValue.textContent = `${sign}${semitones}`;
  pitchDownBtn.disabled = semitones <= -12;
  pitchUpBtn.disabled = semitones >= 12;
}

function setSemitones(semitones) {
  currentSemitones = Math.max(-12, Math.min(12, semitones));
  engine.setPitchSemitones(currentSemitones);
  updatePitchLabel(currentSemitones);
}

pitchDownBtn.addEventListener('click', () => setSemitones(currentSemitones - 1));
pitchUpBtn.addEventListener('click', () => setSemitones(currentSemitones + 1));
pitchResetBtn.addEventListener('click', () => setSemitones(0));

// ---------- Aplausos automáticos ----------

const APPLAUSE_WINDOW_SEC = 5;       // dispara de qualquer forma nos últimos 5s (regra de segurança)
const SILENCE_ARM_WINDOW_SEC = 20;   // só passa a "escutar" silêncio nos últimos 20s (evita disparo falso no meio da música)
const SILENCE_RMS_THRESHOLD = 0.02;  // abaixo disso é considerado "silêncio" (escala 0-1)
const SILENCE_DURATION_MS = 1200;    // precisa ficar em silêncio por esse tempo seguido pra disparar

let silenceAccumMs = 0;
let lastSilenceCheckMs = 0;

function triggerApplauseNow() {
  if (applauseTriggered) return;
  applauseTriggered = true;
  applauseAudio.currentTime = 0;
  applauseAudio.volume = engine.getVolume();
  applauseAudio.play().catch(err => console.warn('[App] Não foi possível tocar os aplausos:', err));
}

function checkApplause(currentTime, duration) {
  if (!applauseToggle.checked || !duration) return;

  const remaining = duration - currentTime;

  // Regra 1 (sempre ativa): garante que os aplausos disparem o mais tardar
  // nos últimos 5 segundos do arquivo, mesmo que a detecção de silêncio
  // não pegue nada (ex: música termina com um acorde forte, sem fade out).
  if (remaining <= APPLAUSE_WINDOW_SEC && remaining > 0) {
    triggerApplauseNow();
  } else if (remaining > SILENCE_ARM_WINDOW_SEC && applauseTriggered) {
    // Só reseta quando sai de vez da "janela final" (ex: usuário deu seek
    // pra trás) — resetar já em "remaining > 5s" cancelaria, por engano,
    // um disparo legítimo que a Regra 2 (silêncio) já tinha feito mais
    // cedo, ainda dentro da janela de 20s mas fora da de 5s.
    applauseTriggered = false;
  }

  // Regra 2 (silêncio real): se a música já emudeceu antes desse ponto —
  // caso comum quando o arquivo tem alguns segundos de silêncio "morto"
  // no final — dispara mais cedo, assim que detecta o silêncio de verdade,
  // em vez de esperar os 5s fixos (que aí sim seriam silêncio demorado).
  checkSilenceForApplause(currentTime, duration, remaining);
}

/**
 * Só funciona se o motor de áudio conseguir "escutar" o sinal de verdade
 * (CDG sempre; vídeo MP4 só quando o tom estiver roteado pelo pitch
 * shifter — ver videoPitchRouted). Fora disso, essa checagem não faz nada
 * e a Regra 1 acima (tempo fixo) continua sendo a única rede de segurança.
 */
function checkSilenceForApplause(currentTime, duration, remaining) {
  if (applauseTriggered) { silenceAccumMs = 0; return; }
  if (remaining > SILENCE_ARM_WINDOW_SEC || remaining <= 0) { silenceAccumMs = 0; return; }
  if (mode === 'video' && !videoPitchRouted) return; // sem sinal real pra analisar nesse caso

  const analyser = engine.getAnalyser();
  if (!analyser) return;

  const now = performance.now();
  const dt = lastSilenceCheckMs ? Math.min(500, now - lastSilenceCheckMs) : 0;
  lastSilenceCheckMs = now;

  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sumSquares += v * v;
  }
  const rms = Math.sqrt(sumSquares / data.length);

  if (rms < SILENCE_RMS_THRESHOLD) {
    silenceAccumMs += dt;
    if (silenceAccumMs >= SILENCE_DURATION_MS) {
      triggerApplauseNow();
    }
  } else {
    silenceAccumMs = 0;
  }
}

// ---------- Autoplay da fila (com contagem regressiva) ----------

function updateAutoplayIndicator() {
  const on = autoplayToggle.checked;
  quickAutoplayBtn.classList.toggle('on', on);
  if (on) {
    const delay = Math.max(0, parseInt(autoplayDelayInput.value, 10) || 0);
    quickAutoplayBtn.title = `Autoplay ligado — aguarda ${delay}s entre músicas`;
  } else {
    quickAutoplayBtn.title = 'Ligar/desligar autoplay';
  }
}
autoplayToggle.addEventListener('change', updateAutoplayIndicator);
autoplayDelayInput.addEventListener('input', updateAutoplayIndicator);
quickAutoplayBtn.addEventListener('click', () => {
  autoplayToggle.checked = !autoplayToggle.checked;
  autoplayToggle.dispatchEvent(new Event('change'));
});

function cancelCountdown() {
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
  countdownOverlay.classList.add('hidden');
  broadcastToSecondScreen({ type: 'countdown-end' });
  refreshIdleState();
}

function finishCountdown() {
  cancelCountdown();
  playNextInQueue();
}

function startAutoplayCountdownIfNeeded() {
  if (!autoplayToggle.checked || !hasNext()) return;

  const delay = Math.max(0, parseInt(autoplayDelayInput.value, 10) || 0);
  const nextItem = playlist[currentIndex + 1];
  const nextTitleText = [nextItem.artist, nextItem.title].filter(Boolean).join(' — ');
  cdNextTitle.textContent = nextTitleText;
  countdownOverlay.classList.remove('hidden');
  countdownRemaining = delay;
  cdNumber.textContent = String(countdownRemaining);
  refreshIdleState();
  broadcastToSecondScreen({ type: 'countdown-start', delay, remaining: countdownRemaining, nextTitle: nextTitleText });

  if (delay <= 0) {
    finishCountdown();
    return;
  }

  countdownTimerId = setInterval(() => {
    countdownRemaining -= 1;
    cdNumber.textContent = String(Math.max(0, countdownRemaining));
    broadcastToSecondScreen({ type: 'countdown-tick', remaining: Math.max(0, countdownRemaining) });
    if (countdownRemaining <= 0) {
      finishCountdown();
    }
  }, 1000);
}

cdSkipBtn.addEventListener('click', finishCountdown);

// ---------- Aplausos: indicador clicável ----------

function updateApplauseIndicator() {
  const on = applauseToggle.checked;
  quickApplauseBtn.classList.toggle('on', on);
}
applauseToggle.addEventListener('change', updateApplauseIndicator);
quickApplauseBtn.addEventListener('click', () => {
  applauseToggle.checked = !applauseToggle.checked;
  applauseToggle.dispatchEvent(new Event('change'));
});

// ---------- Música ambiente (toca quando nada mais está tocando) ----------

const AMBIENT_TRACKS = [
  'assets/ambient/blues.mp3',
  'assets/ambient/afrobeat.mp3',
  'assets/ambient/jazz.mp3',
  'assets/ambient/reggae.mp3',
  'assets/ambient/pop.mp3',
];

let ambientActive = false; // true = tocando (ou em fade), controlado por updateAmbientState()
let ambientCurrentTrackIndex = -1;
let ambientFadeIntervalId = null;

function getAmbientTargetVolume() {
  return Number(ambientVolumeSlider.value) / 100;
}

function fadeAudioTo(audioEl, targetVolume, durationMs, onComplete) {
  if (ambientFadeIntervalId) {
    clearInterval(ambientFadeIntervalId);
    ambientFadeIntervalId = null;
  }
  const steps = 24;
  const stepMs = Math.max(16, durationMs / steps);
  const startVolume = audioEl.volume;
  let step = 0;
  ambientFadeIntervalId = setInterval(() => {
    step += 1;
    const t = Math.min(1, step / steps);
    audioEl.volume = startVolume + (targetVolume - startVolume) * t;
    if (t >= 1) {
      clearInterval(ambientFadeIntervalId);
      ambientFadeIntervalId = null;
      if (onComplete) onComplete();
    }
  }, stepMs);
}

function pickRandomAmbientTrack(excludeIndex) {
  if (AMBIENT_TRACKS.length <= 1) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * AMBIENT_TRACKS.length);
  } while (idx === excludeIndex);
  return idx;
}

function startAmbient() {
  if (ambientActive) return;
  ambientActive = true;

  if (ambientCurrentTrackIndex === -1) {
    ambientCurrentTrackIndex = pickRandomAmbientTrack(-1);
    ambientAudio.src = AMBIENT_TRACKS[ambientCurrentTrackIndex];
  }
  ambientAudio.volume = 0;
  ambientAudio.play().catch(err => console.warn('[App] Não foi possível tocar a música ambiente:', err));
  fadeAudioTo(ambientAudio, getAmbientTargetVolume(), 1200);
}

function stopAmbient() {
  if (!ambientActive) return;
  ambientActive = false;
  fadeAudioTo(ambientAudio, 0, 800, () => {
    ambientAudio.pause();
  });
}

ambientAudio.addEventListener('ended', () => {
  if (!ambientActive) return;
  // Troca pra outra faixa aleatória (evitando repetir a mesma) e continua.
  ambientCurrentTrackIndex = pickRandomAmbientTrack(ambientCurrentTrackIndex);
  ambientAudio.src = AMBIENT_TRACKS[ambientCurrentTrackIndex];
  ambientAudio.volume = getAmbientTargetVolume();
  ambientAudio.play().catch(() => {});
});

function isAnythingPlaying() {
  if (mode === 'cdg') return engine.isPlaying();
  if (mode === 'video') return !videoEl.paused;
  return false;
}

function updateAmbientState() {
  if (!ambientToggle.checked) {
    stopAmbient();
    return;
  }
  if (isAnythingPlaying()) {
    stopAmbient();
  } else {
    startAmbient();
  }
}

/** Chamado sempre que o estado de "tocando/parado" muda — atualiza música
 * ambiente e o overlay de tela ociosa juntos, já que os dois dependem
 * exatamente da mesma condição. */
function refreshIdleState() {
  updateAmbientState();
  updateIdleOverlay();
}

function updateIdleOverlay() {
  const idle = mode !== null && !isAnythingPlaying();
  idleOverlay.classList.toggle('hidden', !idle);
  broadcastToSecondScreen({ type: isAnythingPlaying() ? 'playing' : 'idle' });
}

// ---------- Imagem de fundo customizada pra tela ociosa ----------

function applyIdleImage() {
  if (customIdleImageDataUrl) {
    idleLogo.classList.add('hidden');
    idleCustomImage.classList.remove('hidden');
    idleCustomImage.style.backgroundImage = `url(${customIdleImageDataUrl})`;
  } else {
    idleLogo.classList.remove('hidden');
    idleCustomImage.classList.add('hidden');
    idleCustomImage.style.backgroundImage = '';
  }
}

idleImageUploadBtn.addEventListener('click', () => idleImageInput.click());
idleImageInput.addEventListener('change', () => {
  const file = idleImageInput.files && idleImageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    customIdleImageDataUrl = reader.result;
    applyIdleImage();
    idleImageFilename.textContent = file.name;
    idleImageFilename.classList.remove('hidden');
    idleImageRemoveBtn.classList.remove('hidden');
    broadcastToSecondScreen({ type: 'idle-image', dataUrl: customIdleImageDataUrl });
  };
  reader.onerror = () => showError('Não foi possível ler essa imagem.');
  reader.readAsDataURL(file);
  idleImageInput.value = '';
});
idleImageRemoveBtn.addEventListener('click', () => {
  customIdleImageDataUrl = null;
  applyIdleImage();
  idleImageFilename.classList.add('hidden');
  idleImageRemoveBtn.classList.add('hidden');
  broadcastToSecondScreen({ type: 'idle-image', dataUrl: null });
});

function updateAmbientIndicator() {
  const on = ambientToggle.checked;
  quickAmbientBtn.classList.toggle('on', on);
}
ambientToggle.addEventListener('change', () => {
  updateAmbientIndicator();
  refreshIdleState();
});
quickAmbientBtn.addEventListener('click', () => {
  ambientToggle.checked = !ambientToggle.checked;
  ambientToggle.dispatchEvent(new Event('change'));
});
ambientVolumeSlider.addEventListener('input', () => {
  const pct = Number(ambientVolumeSlider.value);
  ambientVolumePct.textContent = pct + '%';
  // Se já estiver tocando (fora de fade), ajusta o volume na hora.
  if (ambientActive && !ambientFadeIntervalId) {
    ambientAudio.volume = pct / 100;
  }
});

// ---------- Loop de renderização do CDG + sync da UI ----------

engine.addEventListener('play', () => { updatePlayIcon(); refreshIdleState(); });
engine.addEventListener('pause', () => { updatePlayIcon(); refreshIdleState(); });
engine.addEventListener('ended', () => {
  updatePlayIcon();
  startAutoplayCountdownIfNeeded();
  refreshIdleState();
});
engine.addEventListener('error', (e) => {
  showError('Erro de áudio: ' + e.detail.message);
});

let lastUiUpdate = 0;
let lastBroadcastTime = 0;
const UI_UPDATE_INTERVAL_MS = 150; // ~6-7x/seg é mais que suficiente pra uma barra de progresso
const BROADCAST_INTERVAL_MS = 33; // ~30x/seg pra segunda tela, fluido sem exagerar em mensagens

engine.onTimeUpdate((currentTime, duration) => {
  // O canvas do CDG atualiza SEMPRE, a taxa cheia (essencial pra fluidez da letra).
  cdgPlayer.update(currentTime);
  checkApplause(currentTime, duration);

  const now = performance.now();
  if (now - lastBroadcastTime >= BROADCAST_INTERVAL_MS) {
    lastBroadcastTime = now;
    broadcastToSecondScreen({ type: 'time', currentTime, duration });
  }

  if (seeking) return;

  if (now - lastUiUpdate < UI_UPDATE_INTERVAL_MS) return;
  lastUiUpdate = now;

  seekBar.value = String(Math.floor(currentTime * 1000));
  timeCurrent.textContent = formatTime(currentTime);
  if (duration) timeDuration.textContent = formatTime(duration);
});

videoEl.addEventListener('play', () => { updatePlayIcon(); refreshIdleState(); });
videoEl.addEventListener('pause', () => { updatePlayIcon(); refreshIdleState(); });
videoEl.addEventListener('ended', () => {
  updatePlayIcon();
  startAutoplayCountdownIfNeeded();
  refreshIdleState();
});
videoEl.addEventListener('timeupdate', () => {
  if (mode !== 'video') return;
  checkApplause(videoEl.currentTime, videoEl.duration || 0);
  broadcastToSecondScreen({ type: 'time', currentTime: videoEl.currentTime, duration: videoEl.duration || 0 });
  if (seeking) return;
  seekBar.max = String(Math.floor((videoEl.duration || 0) * 1000));
  seekBar.value = String(Math.floor(videoEl.currentTime * 1000));
  timeCurrent.textContent = formatTime(videoEl.currentTime);
  timeDuration.textContent = formatTime(videoEl.duration || 0);
});

// ---------- Painel de configurações (esquema de cores) ----------

settingsBtn.addEventListener('click', () => {
  settingsModalBackdrop.classList.remove('hidden');
  settingsBtn.classList.add('active');
});
settingsCloseBtn.addEventListener('click', () => {
  settingsModalBackdrop.classList.add('hidden');
  settingsBtn.classList.remove('active');
});
settingsModalBackdrop.addEventListener('click', (e) => {
  if (e.target === settingsModalBackdrop) {
    settingsModalBackdrop.classList.add('hidden');
    settingsBtn.classList.remove('active');
  }
});

function getActiveColors() {
  if (!customColorsToggle.checked) return null;
  return {
    background: colorBackground.value,
    text: colorText.value,
    highlight: colorHighlight.value,
  };
}

function applyCustomColors() {
  cdgPlayer.setCustomColors(getActiveColors());
  broadcastToSecondScreen({ type: 'colors', colors: getActiveColors() });
}

customColorsToggle.addEventListener('change', applyCustomColors);
[colorBackground, colorText, colorHighlight].forEach(input => {
  input.addEventListener('input', applyCustomColors);
});

// ---------- Tela cheia (CDG) ----------

fullscreenBtn.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await stageCanvasWrap.requestFullscreen();
    }
  } catch (err) {
    console.error('Erro ao entrar/sair de tela cheia:', err);
  }
});

// ---------- Segunda tela (janela separada / segundo monitor) ----------

let secondScreenWindow = null;
let secondScreenChannel = null;
let secondScreenPollId = null;

function ensureSecondScreenChannel() {
  if (!secondScreenChannel && 'BroadcastChannel' in window) {
    secondScreenChannel = new BroadcastChannel('playkaraoke-second-screen');
    secondScreenChannel.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'ready') {
        sendCurrentStateToSecondScreen();
      }
    });
  }
  return secondScreenChannel;
}

function broadcastToSecondScreen(message) {
  if (!secondScreenWindow || secondScreenWindow.closed) return;
  const channel = ensureSecondScreenChannel();
  if (channel) channel.postMessage(message);
}

function sendCurrentStateToSecondScreen() {
  broadcastToSecondScreen({ type: 'idle-image', dataUrl: customIdleImageDataUrl });
  broadcastToSecondScreen({ type: isAnythingPlaying() ? 'playing' : 'idle' });

  if (currentIndex < 0 || !playlist[currentIndex]) return;
  broadcastToSecondScreen({ type: 'colors', colors: getActiveColors() });
  if (mode === 'cdg') {
    // Reenvia o estado atual pra popup que acabou de abrir/recarregar.
    // Precisamos re-extrair o arquivo já que não guardamos o buffer em cache.
    window.loadKaraokeFile(playlist[currentIndex].file).then(result => {
      if (result.type === 'cdg') {
        broadcastToSecondScreen({
          type: 'init-cdg',
          cdgBuffer: result.cdgBuffer,
          colors: getActiveColors(),
          meta: playlist[currentIndex],
        });
      }
    }).catch(() => {});
  } else if (mode === 'video' && videoEl.src) {
    broadcastToSecondScreen({ type: 'init-video', videoUrl: videoEl.src, meta: playlist[currentIndex] });
  }
}

openSecondBtn.addEventListener('click', toggleSecondScreen);

function updateSecondScreenIndicator() {
  const open = !!(secondScreenWindow && !secondScreenWindow.closed);
  secondScreenStatus.classList.toggle('hidden', !open);
  openSecondBtn.textContent = open ? 'Focar janela ↗' : 'Abrir janela ↗';
  quickSecondScreenBtn.classList.toggle('on', open);
}

function openSecondScreen() {
  if (secondScreenWindow && !secondScreenWindow.closed) {
    secondScreenWindow.focus();
    return;
  }
  ensureSecondScreenChannel();
  secondScreenWindow = window.open('second-screen.html', 'playkaraoke-second-screen', 'width=960,height=540');
  updateSecondScreenIndicator();

  if (secondScreenPollId) clearInterval(secondScreenPollId);
  secondScreenPollId = setInterval(() => {
    if (secondScreenWindow && secondScreenWindow.closed) {
      secondScreenWindow = null;
      updateSecondScreenIndicator();
      clearInterval(secondScreenPollId);
      secondScreenPollId = null;
    }
  }, 1000);
}

function closeSecondScreen() {
  if (secondScreenWindow && !secondScreenWindow.closed) {
    secondScreenWindow.close();
  }
  secondScreenWindow = null;
  if (secondScreenPollId) {
    clearInterval(secondScreenPollId);
    secondScreenPollId = null;
  }
  updateSecondScreenIndicator();
}

function toggleSecondScreen() {
  if (secondScreenWindow && !secondScreenWindow.closed) {
    closeSecondScreen();
  } else {
    openSecondScreen();
  }
}

quickSecondScreenBtn.addEventListener('click', toggleSecondScreen);

// ---------- Abas da sidebar (Fila / Biblioteca) ----------

function switchSidebarTab(tab) {
  const isFila = tab === 'fila';
  tabFilaBtn.classList.toggle('active', isFila);
  tabBibliotecaBtn.classList.toggle('active', !isFila);
  tabFilaPanel.classList.toggle('hidden', !isFila);
  tabBibliotecaPanel.classList.toggle('hidden', isFila);
}
tabFilaBtn.addEventListener('click', () => switchSidebarTab('fila'));
tabBibliotecaBtn.addEventListener('click', () => switchSidebarTab('biblioteca'));

// ---------- Dropzone dedicado (aba Fila) ----------

sidebarDropzone.addEventListener('click', () => fileInput.click());
sidebarDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  sidebarDropzone.classList.add('drag-active');
});
sidebarDropzone.addEventListener('dragleave', () => {
  sidebarDropzone.classList.remove('drag-active');
});
sidebarDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  sidebarDropzone.classList.remove('drag-active');
  const files = e.dataTransfer && e.dataTransfer.files;
  if (files && files.length) addFilesToQueue(files);
});

// ---------- Biblioteca (indexação de pastas locais) ----------

const library = window.createLibrary({
  onFoldersChange: renderLibraryFolders,
  onIndexChange: () => {
    // Se tiver uma busca ativa, atualiza os resultados com o índice novo.
    if (librarySearchInput.value.trim()) renderLibraryResults();
  },
  onError: (msg) => showError(msg),
});

if (!library.isSupported()) {
  libraryUnsupported.classList.remove('hidden');
  connectFolderBtn.disabled = true;
}

function renderLibraryFolders() {
  const folders = library.getConnectedFolders();
  libraryFoldersList.innerHTML = '';

  folders.forEach((folder) => {
    const row = document.createElement('div');
    row.className = 'folder-row';

    const info = document.createElement('div');
    info.className = 'folder-info';
    const icon = document.createElement('span');
    icon.className = 'folder-icon';
    icon.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0v6a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25v-6m-19.5 0a2.25 2.25 0 0 1 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25M4.5 9.75V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M19.5 9.75V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15 8.25l-1.5-1.5m0 0-1.5 1.5m1.5-1.5v9"/></svg>';

    const textWrap = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'folder-name';
    nameEl.textContent = folder.name;
    const countEl = document.createElement('div');
    if (folder.needsPermission) {
      countEl.className = 'folder-count warn';
      countEl.textContent = 'Reconexão necessária';
    } else if (folder.scanning) {
      countEl.className = 'folder-count';
      countEl.textContent = 'Escaneando...';
    } else {
      countEl.className = 'folder-count';
      countEl.textContent = `${folder.fileCount.toLocaleString('pt-BR')} arquivos`;
    }
    textWrap.appendChild(nameEl);
    textWrap.appendChild(countEl);

    info.appendChild(icon);
    info.appendChild(textWrap);
    row.appendChild(info);

    if (folder.needsPermission) {
      const reconnectBtn = document.createElement('button');
      reconnectBtn.className = 'folder-reconnect-btn';
      reconnectBtn.textContent = 'Reconectar';
      reconnectBtn.addEventListener('click', () => library.reconnectFolder(folder.id));
      row.appendChild(reconnectBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'folder-remove-btn';
    removeBtn.title = 'Remover pasta';
    removeBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', () => library.removeFolder(folder.id));
    row.appendChild(removeBtn);

    libraryFoldersList.appendChild(row);
  });
}

function renderLibraryResults() {
  const query = librarySearchInput.value;
  libraryResults.innerHTML = '';

  if (!query.trim()) return;

  const results = library.search(query);

  const label = document.createElement('span');
  label.className = 'library-result-count';
  label.textContent = results.length === 0 ? '0 resultados' : `${results.length} resultado${results.length > 1 ? 's' : ''}`;
  libraryResults.appendChild(label);

  if (results.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'library-empty-hint';
    hint.textContent = 'Nada encontrado. Confira se a pasta certa está conectada.';
    libraryResults.appendChild(hint);
    return;
  }

  results.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'search-result';

    const meta = document.createElement('div');
    meta.className = 'sr-meta';
    const titleEl = document.createElement('div');
    titleEl.className = 'sr-title';
    titleEl.textContent = item.title;
    const subEl = document.createElement('div');
    subEl.className = 'sr-sub';
    const subText = document.createElement('span');
    subText.textContent = [item.artist, item.code].filter(Boolean).join(' · ') || item.format;
    const tag = document.createElement('span');
    tag.className = 'source-tag';
    tag.textContent = item.folderName;
    subEl.appendChild(subText);
    subEl.appendChild(tag);
    meta.appendChild(titleEl);
    meta.appendChild(subEl);

    const addBtn = document.createElement('div');
    addBtn.className = 'sr-add';
    addBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>';

    row.appendChild(meta);
    row.appendChild(addBtn);
    row.addEventListener('click', () => addLibraryItemToQueue(item));

    libraryResults.appendChild(row);
  });
}

async function addLibraryItemToQueue(item) {
  try {
    const file = await library.getFileForItem(item);
    const beforeLength = playlist.length;
    await addFilesToQueue([file]);
    if (playlist.length > beforeLength) {
      const newItem = playlist[playlist.length - 1];
      newItem.librarySource = { folderId: item.folderId, fileName: item.name };
      persistPlaylist();
    }
    switchSidebarTab('fila');
  } catch (err) {
    console.error('[App] Erro ao ler arquivo da biblioteca:', err);
    showError('Não foi possível ler esse arquivo — confira se a pasta/HD ainda está conectado.');
  }
}

librarySearchInput.addEventListener('input', renderLibraryResults);
connectFolderBtn.addEventListener('click', () => library.connectNewFolder());

// ---------- Persistência da fila (sobrevive a um F5 acidental) ----------
//
// Só restauramos automaticamente músicas que vieram da Biblioteca — elas
// têm uma referência viva ao arquivo no disco (via File System Access
// API), então dá pra "reabrir" sem pedir nada ao usuário. Músicas
// carregadas manualmente (arrastadas ou pelo seletor de arquivo comum)
// usam um tipo de referência que o navegador não deixa reabrir sozinho
// depois de recarregar a página — nesse caso, avisamos que precisam ser
// adicionadas de novo, em vez de fingir que "restauramos" algo quebrado.

const PLAYLIST_STORAGE_KEY = 'playkaraoke-playlist-v1';

function persistPlaylist() {
  try {
    const data = {
      items: playlist.map(item => ({
        code: item.code,
        artist: item.artist,
        title: item.title,
        format: item.format,
        type: item.type,
        librarySource: item.librarySource || null,
      })),
    };
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[App] Não foi possível salvar a fila:', err);
  }
}

async function restorePlaylistFromStorage() {
  let saved;
  try {
    const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (!raw) return;
    saved = JSON.parse(raw);
  } catch (err) {
    return;
  }
  if (!saved || !Array.isArray(saved.items) || saved.items.length === 0) return;

  let restoredCount = 0;
  let droppedCount = 0;

  for (const savedItem of saved.items) {
    let restored = false;
    if (savedItem.librarySource) {
      const found = library.findByFolderAndName(savedItem.librarySource.folderId, savedItem.librarySource.fileName);
      if (found) {
        try {
          const file = await library.getFileForItem(found);
          playlist.push({
            id: 'track_' + (++playlistIdCounter),
            file,
            code: found.code,
            artist: found.artist,
            title: found.title,
            format: found.format,
            type: found.type,
            librarySource: savedItem.librarySource,
          });
          restoredCount++;
          restored = true;
        } catch (err) {
          console.warn('[App] Não foi possível reabrir arquivo restaurado:', err);
        }
      }
    }
    if (!restored) droppedCount++;
  }

  if (restoredCount > 0) {
    renderPlaylist();
  }
  if (droppedCount > 0) {
    showError(`${droppedCount} música(s) da fila anterior não foram restauradas automaticamente (eram arquivos avulsos, ou a pasta da Biblioteca ainda não foi reconectada). Adicione-as de novo se precisar.`);
  }
}

// Tenta restaurar pastas já conectadas em sessões anteriores (silencioso).
library.restoreSavedFolders().then(restorePlaylistFromStorage);

// ---------- Redimensionar a sidebar (arrastando a borda) ----------

const SIDEBAR_WIDTH_KEY = 'playkaraoke-sidebar-width';

(function setupSidebarResize() {
  const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
  if (savedWidth) {
    sidebar.style.width = savedWidth + 'px';
  }

  let dragging = false;

  sidebarResizeHandle.addEventListener('mousedown', (e) => {
    dragging = true;
    sidebarResizeHandle.classList.add('resizing');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const min = 220, max = 600;
    const newWidth = Math.max(min, Math.min(max, e.clientX));
    sidebar.style.width = newWidth + 'px';
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    sidebarResizeHandle.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, parseInt(sidebar.style.width, 10));
    } catch (err) { /* não é crítico se não salvar */ }
  });
})();

// ---------- Atalhos de teclado ----------

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    playBtn.click();
  }
});

// Estado inicial
setStage(null);
updateMetaBar(null);
updatePitchLabel(0);
updateAutoplayIndicator();
updateApplauseIndicator();
updateAmbientIndicator();
updateSecondScreenIndicator();
ambientVolumePct.textContent = ambientVolumeSlider.value + '%';
applyIdleImage();
updateIdleOverlay();
renderPlaylist();
