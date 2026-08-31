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
const stopBtn = el('stop-btn');
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
const languageSelect = el('language-select');
const autoplayToggleIndicator = el('autoplay-toggle-indicator');
const ambientToggleIndicator = el('ambient-toggle-indicator');
const idleImageToggleIndicator = el('idle-image-toggle-indicator');
const customColorsToggleIndicator = el('custom-colors-toggle-indicator');
const showModeBtn = el('show-mode-btn');
const showModeBtnLabel = el('show-mode-btn-label');
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
const countdownTimerParts = el('countdown-timer-parts');
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
const librarySearchClearBtn = el('library-search-clear-btn');

const cdSingerHighlight = el('cd-singer-highlight');
const cdUpcomingSection = el('cd-upcoming-section');
const cdSingerNameDisplay = el('cd-singer-name-display');
const cdSingerSongDisplay = el('cd-singer-song-display');
const cdSingerToneDisplay = el('cd-singer-tone-display');
const cdUpcomingList = el('cd-upcoming-list');
const cdShowUpcomingToggle = el('cd-show-upcoming-toggle');
const cdShowTitlesToggle = el('cd-show-titles-toggle');
const cdShowCounterToggle = el('cd-show-counter-toggle');

const openManageSingersBtn = el('open-manage-singers-btn');
const manageSingersSidebarBtn = el('manage-singers-sidebar-btn');
const manageSingersBackdrop = el('manage-singers-backdrop');
const manageSingersCloseBtn = el('manage-singers-close-btn');
const manageSingersList = el('manage-singers-list');
const addNewSingerBtn = el('add-new-singer-btn');
const manageSingersEmpty = el('manage-singers-empty');
const manageSingersDetail = el('manage-singers-detail');
const detailSingerName = el('detail-singer-name');
const detailEditNameBtn = el('detail-edit-name-btn');
const detailTabQueueBtn = el('detail-tab-queue-btn');
const detailTabHistoryBtn = el('detail-tab-history-btn');
const detailQueuePanel = el('detail-queue-panel');
const detailHistoryPanel = el('detail-history-panel');
const detailQueueList = el('detail-queue-list');
const detailHistoryList = el('detail-history-list');
const detailAddSongBtn = el('detail-add-song-btn');
const detailUploadFileBtn = el('detail-upload-file-btn');
const detailUploadFileInput = el('detail-upload-file-input');
const detailAddSongSearch = el('detail-add-song-search');
const detailSongSearchInput = el('detail-song-search-input');
const detailSongSearchResults = el('detail-song-search-results');

const endShowBtn = null; // removido: agora é o showModeBtn que assume esse papel
const singerModeToggleIndicator = el('singer-mode-toggle-indicator');
const endShowConfirmBackdrop = el('end-show-confirm-backdrop');
const endShowConfirmCancelBtn = el('end-show-confirm-cancel-btn');
const endShowConfirmOkBtn = el('end-show-confirm-ok-btn');
const showReportBackdrop = el('show-report-backdrop');
const showReportCloseBtn = el('show-report-close-btn');
const reportDuration = el('report-duration');
const reportTotalSongs = el('report-total-songs');
const reportUniqueSingers = el('report-unique-singers');
const reportHighlight = el('report-highlight');
const showReportTbody = el('show-report-tbody');
const exportCsvBtn = el('export-csv-btn');
const newShowBtn = el('new-show-btn');

const singerRoundView = el('singer-round-view');
const currentSingerEmpty = el('current-singer-empty');
const singerListFull = el('singer-list-full');
let singerDragFromIndex = null;

const singerPickerBackdrop = el('singer-picker-backdrop');
const singerPickerFilename = el('singer-picker-filename');
const singerPickerDropdown = el('singer-picker-dropdown');
const singerPickerNewInput = el('singer-picker-new-input');
const singerPickerNewBtn = el('singer-picker-new-btn');
const singerPickerCancelBtn = el('singer-picker-cancel-btn');
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
const tmApplyBtn = el('tm-apply-btn');

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
let singerCountdownActive = false; // true só durante a contagem cronometrada de verdade
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

// ---------- Modais próprios pra substituir prompt()/confirm() nativos ----------
// Motivo: os diálogos nativos do navegador não têm como ser traduzidos
// de forma confiável em todo navegador/SO, e destoam visualmente do
// resto do app. Essas funções têm a MESMA assinatura de uso (via
// await) que prompt()/confirm(), só que via modal próprio.

const genericPromptBackdrop = el('generic-prompt-backdrop');
const genericPromptTitle = el('generic-prompt-title');
const genericPromptInput = el('generic-prompt-input');
const genericPromptOkBtn = el('generic-prompt-ok-btn');
const genericPromptCancelBtn = el('generic-prompt-cancel-btn');

function showPromptModal(message, defaultValue) {
  return new Promise((resolve) => {
    genericPromptTitle.textContent = message;
    genericPromptInput.value = defaultValue || '';
    genericPromptBackdrop.classList.remove('hidden');
    genericPromptInput.focus();
    genericPromptInput.select();

    const cleanup = () => {
      genericPromptBackdrop.classList.add('hidden');
      genericPromptOkBtn.removeEventListener('click', onOk);
      genericPromptCancelBtn.removeEventListener('click', onCancel);
      genericPromptInput.removeEventListener('keydown', onKeydown);
    };
    const onOk = () => { const v = genericPromptInput.value; cleanup(); resolve(v); };
    const onCancel = () => { cleanup(); resolve(null); };
    const onKeydown = (e) => {
      if (e.key === 'Enter') onOk();
      else if (e.key === 'Escape') onCancel();
    };
    genericPromptOkBtn.addEventListener('click', onOk);
    genericPromptCancelBtn.addEventListener('click', onCancel);
    genericPromptInput.addEventListener('keydown', onKeydown);
  });
}

const genericConfirmBackdrop = el('generic-confirm-backdrop');
const genericConfirmMessage = el('generic-confirm-message');
const genericConfirmOkBtn = el('generic-confirm-ok-btn');
const genericConfirmCancelBtn = el('generic-confirm-cancel-btn');

function showConfirmModal(message) {
  return new Promise((resolve) => {
    genericConfirmMessage.textContent = message;
    genericConfirmBackdrop.classList.remove('hidden');

    const cleanup = () => {
      genericConfirmBackdrop.classList.add('hidden');
      genericConfirmOkBtn.removeEventListener('click', onOk);
      genericConfirmCancelBtn.removeEventListener('click', onCancel);
    };
    const onOk = () => { cleanup(); resolve(true); };
    const onCancel = () => { cleanup(); resolve(false); };
    genericConfirmOkBtn.addEventListener('click', onOk);
    genericConfirmCancelBtn.addEventListener('click', onCancel);
  });
}

function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove('hidden');
  setTimeout(() => errorBanner.classList.add('hidden'), 5000);
}

let isTrackLoading = false;

function showLoading(show) {
  isTrackLoading = show;
  loadingBanner.classList.toggle('hidden', !show);
  // Enquanto carrega de verdade, nenhum desses botões pode ficar
  // clicável -- clicar neles durante o carregamento (ex: "Iniciar
  // Agora" numa troca de cantor lenta) disparava um SEGUNDO
  // carregamento por cima do primeiro, ou mexia no motor no meio da
  // troca — deixando tudo travado num "carregando" infinito com
  // play/stop entrando em loop.
  cdSkipBtn.disabled = show;
  if (show) {
    playBtn.disabled = true;
    stopBtn.disabled = true;
  } else if (mode !== null) {
    // Carregamento terminou (com sucesso ou erro) e ainda há uma música
    // válida carregada -- reabilita os botões. Se o erro deixou tudo
    // vazio (mode === null), resetToEmptyState() já cuida de manter
    // desabilitado.
    playBtn.disabled = false;
    stopBtn.disabled = false;
  }
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
    metaSong.textContent = window.i18n.t('no_music_loaded');
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
  // Nota: NÃO exige currentIndex >= 0 — depois que uma música termina e
  // é removida da fila (removeFinishedTrackFromQueue), currentIndex fica
  // temporariamente em -1 (nada carregado ainda), mas ainda pode haver
  // músicas esperando pra tocar. -1 < length-1 continua correto nesse caso.
  return currentIndex < playlist.length - 1;
}

function renderPlaylist() {
  playlistCount.textContent = `${window.i18n.t('queue_label')} (${playlist.length})`;
  playlistEl.innerHTML = '';

  if (playlist.length === 0) {
    const hint = document.createElement('p');
    hint.id = 'playlist-empty-hint';
    hint.textContent = window.i18n.t('queue_empty_hint');
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

    let nowPlayingBadge = null;
    if (i === currentIndex) {
      const playingNow = mode !== null && (mode === 'video' ? !videoEl.paused : engine.isPlaying());
      nowPlayingBadge = document.createElement('span');
      nowPlayingBadge.className = 'now-playing-badge' + (playingNow ? '' : ' hidden');
      nowPlayingBadge.textContent = window.i18n.t('now_playing_badge');
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.title = window.i18n.t('remove_from_queue_title');
    removeBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromPlaylist(i);
    });

    const reorderBtns = document.createElement('div');
    reorderBtns.className = 'reorder-btns';
    const upBtn = document.createElement('button');
    upBtn.className = 'reorder-btn';
    upBtn.title = window.i18n.t('move_up_title');
    upBtn.disabled = i === 0;
    upBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/></svg>';
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moveTrack(i, -1);
    });
    const downBtn = document.createElement('button');
    downBtn.className = 'reorder-btn';
    downBtn.title = window.i18n.t('move_down_title');
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
    if (nowPlayingBadge) row.appendChild(nowPlayingBadge);
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

  if (singerModeEnabled) {
    await addFilesInSingerMode(list);
    return;
  }

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
    showError(window.i18n.t('err_unsupported_files'));
  }

  if (wasEmpty && firstNewIndex !== -1) {
    await selectTrack(firstNewIndex, { autoplay: false });
  }
}

let selectTrackGeneration = 0;

async function selectTrack(index, { autoplay, initialSemitones } = { autoplay: false, initialSemitones: 0 }) {
  if (index < 0 || index >= playlist.length) return;
  cancelCountdown();

  // Rede de segurança contra chamadas sobrepostas: se `selectTrack` for
  // chamada de novo antes dessa terminar de carregar (ex: clique duplo,
  // autoplay avançando rápido demais, etc.), a chamada mais velha se
  // auto-cancela nos pontos de espera assim que percebe que não é mais
  // a mais recente — evita carregar a mesma música (ou músicas erradas)
  // múltiplas vezes ao mesmo tempo, que é o que causava o travamento.
  const myGeneration = ++selectTrackGeneration;
  const isCurrent = () => myGeneration === selectTrackGeneration;

  currentIndex = index;
  renderPlaylist();

  const item = playlist[index];
  showLoading(true);
  try {
    const result = await window.loadKaraokeFile(item.file);
    if (!isCurrent()) return; // uma chamada mais nova já assumiu, descarta essa
    applauseTriggered = false;
    silenceAccumMs = 0;
    lastSilenceCheckMs = 0;
    updateMetaBar(item);
    setSemitones(initialSemitones || 0); // cada música começa no tom escolhido (ou original, por padrão)

    if (result.type === 'cdg') {
      cdgPlayer.load(result.cdgBuffer);
      await engine.loadArrayBuffer(result.audioBuffer);
      if (!isCurrent()) return;
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
      if (!isCurrent()) return;
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
    stopBtn.disabled = false;
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
    if (!isCurrent()) return; // erro de uma chamada já obsoleta -- ignora silenciosamente
    console.error(err);
    showError(err.message || window.i18n.t('err_load_generic'));
  } finally {
    if (isCurrent()) showLoading(false);
  }
}

function playNextInQueue() {
  if (!hasNext()) return;
  const nextIndex = currentIndex + 1;
  const nextItem = playlist[nextIndex];
  // Respeita um tom pré-configurado no modal (via "Aplicar tom" numa
  // música ainda em espera), se existir.
  selectTrack(nextIndex, { autoplay: true, initialSemitones: nextItem.savedSemitones || 0 });
}

nextBtn.addEventListener('click', playNextInQueue);

stopBtn.addEventListener('click', () => {
  // Invalida qualquer selectTrack() ainda em andamento (carregamento
  // travado, cliques duplos, etc.) antes de resetar tudo — assim o
  // resultado de uma chamada antiga não "chega atrasado" depois do
  // reset e bagunça o estado de novo.
  selectTrackGeneration++;
  handlingTrackEnded = false;
  resetToEmptyState();
});

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
  // Pra música ativa, mostra o tom que está tocando agora. Pra música em
  // espera, mostra o tom já salvo pra ela (se algum dia "Aplicar tom" já
  // foi usado nela antes) — assim reabrir o modal não perde a escolha.
  modalPitchValue = isActive ? currentSemitones : (item.savedSemitones || 0);

  tmCode.textContent = item.code || '—';
  tmArtist.textContent = item.artist || '—';
  tmFormat.textContent = item.format;
  tmTitle.textContent = item.title;

  // "Aplicar tom" sempre existe. "Tocar" só faz sentido pra uma música
  // que ainda NÃO é a que está tocando agora (senão seria redundante).
  tmPlayBtn.classList.toggle('hidden', isActive);

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

// "Aplicar tom": SEMPRE só salva o valor no item da fila. Se a música
// clicada for a que já está tocando, também aplica na hora (efeito
// audível imediato). Se for uma música em espera, só guarda o valor pra
// quando ela realmente começar a tocar — NUNCA dá play aqui.
tmApplyBtn.addEventListener('click', () => {
  const index = modalTrackIndex;
  const semitones = modalPitchValue;
  const isActive = index === currentIndex;
  if (playlist[index]) playlist[index].savedSemitones = semitones;
  closeTrackModal();
  if (isActive) {
    setSemitones(semitones);
  } else {
    renderPlaylist(); // sem tocar nada — só garante que a escolha fica salva/persistida
  }
});

// "Tocar": troca pra essa música agora, já com o tom escolhido.
tmPlayBtn.addEventListener('click', () => {
  const index = modalTrackIndex;
  const semitones = modalPitchValue;
  if (playlist[index]) playlist[index].savedSemitones = semitones;
  closeTrackModal();
  selectTrack(index, { autoplay: true, initialSemitones: semitones });
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
  stopBtn.disabled = true;
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

  const badge = playlistEl.querySelector('.now-playing-badge');
  if (badge) badge.classList.toggle('hidden', !playing);
  if (singerModeEnabled) updateSingerNowPlayingBadge();
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
    showError(window.i18n.t('err_playback_start_fail', { msg: err.message || err }));
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

// ---------- Indicadores "Ativado/Desativado" do novo design de Configurações ----------

/** Deixa um botão-indicador (texto + bolinha) sincronizado visualmente
 * com um checkbox escondido, e clicável pra alternar o checkbox. */
function syncToggleIndicator(indicatorEl, checkboxEl) {
  const update = () => {
    const on = checkboxEl.checked;
    indicatorEl.classList.toggle('on', on);
    const textEl = indicatorEl.querySelector('.toggle-state-text');
    if (textEl) textEl.textContent = on ? window.i18n.t('enabled') : window.i18n.t('disabled');
  };
  update();
  checkboxEl.addEventListener('change', update);
  indicatorEl.addEventListener('click', () => {
    checkboxEl.checked = !checkboxEl.checked;
    checkboxEl.dispatchEvent(new Event('change'));
  });
}

/** Pro indicador de imagem de fundo, que não tem checkbox próprio (o
 * "ativado" dele é simplesmente "existe uma imagem definida agora"). */
function updateIdleImageToggleIndicatorDisplay(hasImage) {
  idleImageToggleIndicator.classList.toggle('on', hasImage);
  const textEl = idleImageToggleIndicator.querySelector('.toggle-state-text');
  if (textEl) textEl.textContent = hasImage ? window.i18n.t('enabled') : window.i18n.t('disabled');
}

syncToggleIndicator(autoplayToggleIndicator, autoplayToggle);
syncToggleIndicator(ambientToggleIndicator, ambientToggle);
syncToggleIndicator(customColorsToggleIndicator, customColorsToggle);

function updateAutoplayIndicator() {
  const on = autoplayToggle.checked;
  quickAutoplayBtn.classList.toggle('on', on);
  if (on) {
    const delay = Math.max(0, parseInt(autoplayDelayInput.value, 10) || 0);
    quickAutoplayBtn.title = window.i18n.t('pill_autoplay_on_title', { delay });
  } else {
    quickAutoplayBtn.title = window.i18n.t('pill_autoplay_title');
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
  singerCountdownActive = false;
  if (singerModeEnabled) {
    // Em modo cantores, o card do cantor da vez continua visível mesmo
    // sem o timer rodando — updateIdleOverlay() decide isso já já. Só
    // escondemos as partes específicas do cronômetro na hora.
    countdownTimerParts.classList.add('hidden');
    cdSkipBtn.classList.add('hidden');
  } else {
    countdownOverlay.classList.add('hidden');
  }
  broadcastToSecondScreen({ type: 'countdown-end' });
  refreshIdleState();
}

function finishCountdown() {
  cancelCountdown();
  playNextInQueue();
}

/** Chamado quando qualquer música termina, no modo cantores. A música
 * SEMPRE é consumida da fila do cantor (ela realmente aconteceu),
 * independente do autoplay estar ligado — só o "carregar a próxima
 * sozinho" depende do autoplay. */
function handleSingerModeSongEnded() {
  const singer = singerManager.getCurrentSinger();
  if (singer && singer.songs.length > 0) {
    const song = singer.songs[0];
    const duration = mode === 'video' ? (videoEl.duration || 0) : (engine.getDuration ? engine.getDuration() : 0);
    logSongToShowHistory(singer.name, song, currentSemitones, Math.round(duration));
  }
  singerManager.consumeCurrentSongAndAdvance({ semitone: currentSemitones });
  if (!autoplayToggle.checked) {
    renderSingerRoundView();
    return;
  }
  startSingerCountdown();
}

function startSingerCountdown() {
  const singer = singerManager.getCurrentSinger();
  if (!singer) { renderSingerRoundView(); return; }

  const delay = Math.max(0, parseInt(autoplayDelayInput.value, 10) || 0);
  const songText = singer.songs.length > 0
    ? [singer.songs[0].artist, singer.songs[0].title].filter(Boolean).join(' — ')
    : window.i18n.t('no_song_in_queue');
  const nextTitleText = `${singer.name} — ${songText}`;
  singerCountdownActive = true;
  renderRichCountdown(singer);
  countdownTimerParts.classList.remove('hidden');
  cdSkipBtn.classList.remove('hidden');
  countdownOverlay.classList.remove('hidden');
  countdownRemaining = delay;
  cdNumber.textContent = String(countdownRemaining);
  refreshIdleState();
  broadcastToSecondScreen({
    type: 'countdown-start', delay, remaining: countdownRemaining, nextTitle: nextTitleText,
    singerMode: true,
    singer: { name: singer.name, song: singer.songs[0] || null, position: getSingerPosition(singer.id) },
    upcoming: singerManager.getUpcomingSingers(3).map(s => ({ name: s.name, song: s.songs[0] || null, position: getSingerPosition(s.id) })),
    display: { upcoming: cdShowUpcomingToggle.checked, titles: cdShowTitlesToggle.checked, counter: cdShowCounterToggle.checked },
    labels: getCountdownLabels(),
  });

  if (delay <= 0) {
    finishSingerCountdown();
    return;
  }
  countdownTimerId = setInterval(() => {
    countdownRemaining -= 1;
    cdNumber.textContent = String(Math.max(0, countdownRemaining));
    broadcastToSecondScreen({ type: 'countdown-tick', remaining: Math.max(0, countdownRemaining) });
    if (countdownRemaining <= 0) finishSingerCountdown();
  }, 1000);
}

function finishSingerCountdown() {
  cancelCountdown();
  loadCurrentSingerTurn(true);
}

/** Ponto único chamado sempre que uma música termina — decide qual dos
 * dois modos (simples ou rodada de cantores) deve tratar o evento. */
let handlingTrackEnded = false;

function handleTrackEnded() {
  // Rede de segurança: se o evento "ended" disparar mais de uma vez pra
  // mesma música (ex: motor de áudio + rede de segurança do tick.js
  // disparando quase juntos, ou vídeo + engine ambos avisando), sem essa
  // proteção a gente consumiria/avançaria a rodada mais de uma vez —
  // pulando o cantor errado sem querer. Ignora repetições dentro de uma
  // janela curta.
  if (handlingTrackEnded) return;
  handlingTrackEnded = true;
  setTimeout(() => { handlingTrackEnded = false; }, 800);

  if (singerModeEnabled) {
    handleSingerModeSongEnded();
  } else {
    handleSimpleModeSongEnded();
  }
}

/** Remove da fila a música que acabou de tocar (modo simples). Ajusta
 * currentIndex pra continuar apontando corretamente pra próxima música
 * (que "deslizou" uma posição pra trás depois da remoção). */
function removeFinishedTrackFromQueue() {
  if (currentIndex < 0 || currentIndex >= playlist.length) return;
  playlist.splice(currentIndex, 1);
  currentIndex -= 1;
  renderPlaylist(); // já persiste a fila atualizada
  if (playlist.length === 0) resetToEmptyState();
}

function handleSimpleModeSongEnded() {
  removeFinishedTrackFromQueue();
  startAutoplayCountdownIfNeeded();
}

function startAutoplayCountdownIfNeeded() {
  if (!autoplayToggle.checked || !hasNext()) return;
  resetCountdownDisplayToSimple();

  const delay = Math.max(0, parseInt(autoplayDelayInput.value, 10) || 0);
  const nextItem = playlist[currentIndex + 1];
  const nextTitleText = [nextItem.artist, nextItem.title].filter(Boolean).join(' — ');
  cdNextTitle.textContent = nextTitleText;
  countdownOverlay.classList.remove('hidden');
  countdownRemaining = delay;
  cdNumber.textContent = String(countdownRemaining);
  refreshIdleState();
  broadcastToSecondScreen({ type: 'countdown-start', delay, remaining: countdownRemaining, nextTitle: nextTitleText, labels: getCountdownLabels() });

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

cdSkipBtn.addEventListener('click', () => {
  if (singerModeEnabled) finishSingerCountdown(); else finishCountdown();
});

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
  if (singerModeEnabled) {
    idleOverlay.classList.add('hidden'); // em modo cantores, o card substitui a logo ociosa
    const idle = !isAnythingPlaying();
    const singer = singerManager.getCurrentSinger();

    if (idle && singer) {
      renderRichCountdown(singer);
      countdownOverlay.classList.remove('hidden');
      countdownTimerParts.classList.toggle('hidden', !singerCountdownActive);
      cdSkipBtn.classList.remove('hidden'); // botão "Iniciar Agora" sempre visível quando ocioso em modo cantores
      if (!singerCountdownActive) {
        broadcastToSecondScreen({
          type: 'countdown-start', delay: 0, remaining: 0,
          singerMode: true, timerless: true,
          singer: { name: singer.name, song: singer.songs[0] || null, position: getSingerPosition(singer.id) },
          upcoming: singerManager.getUpcomingSingers(3).map(s => ({ name: s.name, song: s.songs[0] || null, position: getSingerPosition(s.id) })),
          display: { upcoming: cdShowUpcomingToggle.checked, titles: cdShowTitlesToggle.checked, counter: cdShowCounterToggle.checked },
          labels: getCountdownLabels(),
        });
      }
    } else if (!singerCountdownActive) {
      countdownOverlay.classList.add('hidden');
      broadcastToSecondScreen({ type: 'countdown-end' });
    }
    broadcastToSecondScreen({ type: isAnythingPlaying() ? 'playing' : 'idle' });
    return;
  }

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
  updateIdleImageToggleIndicatorDisplay(!!customIdleImageDataUrl);
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
  reader.onerror = () => showError(window.i18n.t('err_image_read_fail'));
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
  handleTrackEnded();
  refreshIdleState();
});
engine.addEventListener('error', (e) => {
  showError(window.i18n.t('err_audio_generic', { msg: e.detail.message }));
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
  handleTrackEnded();
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

/** Textos fixos que a segunda tela precisa mostrar, já traduzidos no
 * idioma atual — ela não tem seletor de idioma próprio, então recebe
 * isso via broadcast toda vez que o countdown é montado. */
function getCountdownLabels() {
  return {
    cdLabel: window.i18n.t('cd_label_starts_in'),
    aSeguir: window.i18n.t('cd_label_up_next'),
    proximas: window.i18n.t('cd_label_upcoming'),
  };
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
  openSecondBtn.textContent = open ? window.i18n.t('second_screen_focus') : window.i18n.t('second_screen_open');
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
      countEl.textContent = window.i18n.t('library_reconnect_needed');
    } else if (folder.scanning) {
      countEl.className = 'folder-count';
      countEl.textContent = window.i18n.t('library_scanning');
    } else {
      countEl.className = 'folder-count';
      countEl.textContent = window.i18n.t('library_files_count', { count: folder.fileCount.toLocaleString(window.i18n.getCurrentLang() === 'pt' ? 'pt-BR' : 'en-US') });
    }
    textWrap.appendChild(nameEl);
    textWrap.appendChild(countEl);

    info.appendChild(icon);
    info.appendChild(textWrap);
    row.appendChild(info);

    if (folder.needsPermission) {
      const reconnectBtn = document.createElement('button');
      reconnectBtn.className = 'folder-reconnect-btn';
      reconnectBtn.textContent = window.i18n.t('library_reconnect_btn');
      reconnectBtn.addEventListener('click', () => library.reconnectFolder(folder.id));
      row.appendChild(reconnectBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'folder-remove-btn';
    removeBtn.title = window.i18n.t('remove_folder_title');
    removeBtn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', () => library.removeFolder(folder.id));
    row.appendChild(removeBtn);

    libraryFoldersList.appendChild(row);
  });
}

function renderLibraryResults() {
  const query = librarySearchInput.value;
  libraryResults.innerHTML = '';
  librarySearchClearBtn.classList.toggle('hidden', !query.trim());

  if (!query.trim()) return;

  const results = library.search(query);

  const label = document.createElement('span');
  label.className = 'library-result-count';
  label.textContent = results.length === 0 ? '0 resultados' : `${results.length} resultado${results.length > 1 ? 's' : ''}`;
  libraryResults.appendChild(label);

  if (results.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'library-empty-hint';
    hint.textContent = window.i18n.t('library_no_results');
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
  if (singerModeEnabled) {
    await addLibraryItemInSingerMode(item);
    return;
  }
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
    showError(window.i18n.t('err_library_read_fail'));
  }
}

librarySearchInput.addEventListener('input', renderLibraryResults);
librarySearchClearBtn.addEventListener('click', () => {
  librarySearchInput.value = '';
  renderLibraryResults();
  librarySearchInput.focus();
});
connectFolderBtn.addEventListener('click', () => library.connectNewFolder());

// ---------- Rodada de cantores ----------

let singerModeEnabled = false;
const SINGERS_STORAGE_KEY = 'playkaraoke-singers-v1';

const singerManager = window.createSingerManager({
  onChange: () => { renderSingerRoundView(); persistSingers(); },
});

function applySingerModeVisibility() {
  el('playlist').classList.toggle('hidden', singerModeEnabled);
  singerRoundView.classList.toggle('hidden', !singerModeEnabled);
  el('sidebar-manage-singers-row').classList.toggle('hidden', !singerModeEnabled);
}

function updateShowModeBtnDisplay() {
  showModeBtn.classList.toggle('active', singerModeEnabled);
  showModeBtnLabel.textContent = singerModeEnabled ? window.i18n.t('end_show') : window.i18n.t('start_show_mode');
  const indicatorText = singerModeToggleIndicator.querySelector('.toggle-state-text');
  singerModeToggleIndicator.classList.toggle('on', singerModeEnabled);
  if (indicatorText) indicatorText.textContent = singerModeEnabled ? window.i18n.t('enabled') : window.i18n.t('disabled');
}

const SHOW_WELCOME_HIDE_KEY = 'playkaraoke-hide-show-welcome';
const showModeWelcomeBackdrop = el('show-mode-welcome-backdrop');
const welcomeDontShowAgain = el('welcome-dont-show-again');
const welcomeStartBtn = el('welcome-start-btn');

function actuallyEnableSingerMode() {
  singerModeEnabled = true;
  applySingerModeVisibility();
  updateShowModeBtnDisplay();
  persistSingers();
  loadCurrentSingerTurn(false);
}

showModeBtn.addEventListener('click', () => {
  if (!singerModeEnabled) {
    const alreadyDismissed = localStorage.getItem(SHOW_WELCOME_HIDE_KEY) === 'true';
    if (alreadyDismissed) {
      actuallyEnableSingerMode();
    } else {
      welcomeDontShowAgain.checked = false;
      showModeWelcomeBackdrop.classList.remove('hidden');
    }
  } else {
    // Já está ligado: "encerrar" passa pelo fluxo completo (confirmação
    // + relatório) — não existe mais um jeito de só desligar sem
    // encerrar de verdade.
    endShowConfirmBackdrop.classList.remove('hidden');
  }
});

welcomeStartBtn.addEventListener('click', () => {
  if (welcomeDontShowAgain.checked) {
    try { localStorage.setItem(SHOW_WELCOME_HIDE_KEY, 'true'); } catch (err) {}
  }
  showModeWelcomeBackdrop.classList.add('hidden');
  actuallyEnableSingerMode();
});
showModeWelcomeBackdrop.addEventListener('click', (e) => {
  if (e.target === showModeWelcomeBackdrop) showModeWelcomeBackdrop.classList.add('hidden');
});

/** Posição real (1-based) de um cantor na lista completa da rodada —
 * NÃO é relativo a quem está tocando agora, é a posição de cadastro. */
function getSingerPosition(singerId) {
  const idx = singerManager.getAllSingers().findIndex(s => s.id === singerId);
  return idx >= 0 ? idx + 1 : null;
}

function renderSingerRoundView() {
  const allSingers = singerManager.getAllSingers();
  singerListFull.innerHTML = '';

  if (allSingers.length === 0) {
    currentSingerEmpty.classList.remove('hidden');
    return;
  }
  currentSingerEmpty.classList.add('hidden');

  const currentSinger = singerManager.getCurrentSinger();

  allSingers.forEach((s, i) => {
    const isActive = currentSinger && s.id === currentSinger.id;
    const row = document.createElement('div');
    row.className = 'singer-playlist-item' + (isActive ? ' active' : '');
    row.draggable = true;
    row.dataset.singerId = s.id;

    let tri = null;
    if (isActive) {
      tri = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tri.setAttribute('viewBox', '0 0 24 24');
      tri.setAttribute('fill', 'currentColor');
      tri.setAttribute('class', 'play-tri');
      tri.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }

    const posBadge = document.createElement('span');
    posBadge.className = 'pos-num-badge';
    posBadge.textContent = String(i + 1);

    const meta = document.createElement('div');
    meta.className = 'singer-meta';
    const nameLine = document.createElement('div');
    nameLine.className = 'singer-name-line';
    const nameText = document.createElement('span');
    nameText.textContent = s.name;
    const songCountBadge = document.createElement('span');
    songCountBadge.className = 'singer-song-count-badge';
    songCountBadge.textContent = `${s.songs.length}/${singerManager.MAX_SONGS_PER_SINGER}`;
    if (s.songs.length === 0) songCountBadge.classList.add('empty');
    nameLine.appendChild(nameText);
    nameLine.appendChild(songCountBadge);
    meta.appendChild(nameLine);

    if (s.songs.length > 0) {
      const song = s.songs[0];
      const songLine = document.createElement('div');
      songLine.className = 'singer-song-line';
      songLine.textContent = song.title;
      const subLine = document.createElement('div');
      subLine.className = 'singer-sub-line';
      subLine.textContent = [song.artist, song.code].filter(Boolean).join(' · ') || song.format;
      meta.appendChild(songLine);
      meta.appendChild(subLine);
    } else if (isActive) {
      const waiting = document.createElement('div');
      waiting.className = 'singer-waiting-inline';
      waiting.textContent = window.i18n.t('waiting_for_song');
      meta.appendChild(waiting);
    } else {
      const subLine = document.createElement('div');
      subLine.className = 'singer-sub-line';
      subLine.textContent = window.i18n.t('no_song_in_queue');
      meta.appendChild(subLine);
    }

    if (tri) row.appendChild(tri);
    row.appendChild(posBadge);
    row.appendChild(meta);

    if (isActive) {
      const badge = document.createElement('span');
      badge.className = 'now-playing-badge' + (isAnythingPlaying() ? '' : ' hidden');
      badge.textContent = window.i18n.t('now_playing_badge');
      row.appendChild(badge);
    } else {
      const reorderControls = document.createElement('div');
      reorderControls.className = 'singer-reorder-controls';
      const upBtn = document.createElement('button');
      upBtn.textContent = '▲';
      upBtn.disabled = i === 0;
      upBtn.addEventListener('click', (e) => { e.stopPropagation(); singerManager.reorderSinger(i, i - 1); });
      const downBtn = document.createElement('button');
      downBtn.textContent = '▼';
      downBtn.disabled = i === allSingers.length - 1;
      downBtn.addEventListener('click', (e) => { e.stopPropagation(); singerManager.reorderSinger(i, i + 2); });
      reorderControls.appendChild(upBtn);
      reorderControls.appendChild(downBtn);
      row.appendChild(reorderControls);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'singer-remove-btn';
      removeBtn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
      removeBtn.title = window.i18n.t('remove_singer_title');
      removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (await showConfirmModal(window.i18n.t('confirm_remove_singer', { name: s.name }))) {
          singerManager.removeSinger(s.id);
        }
      });
      row.appendChild(removeBtn);
    }

    // Duplo-clique abre o Gerenciar Cantores já no cantor certo.
    row.addEventListener('dblclick', () => {
      selectedManageSingerId = s.id;
      openManageSingersModal();
    });

    // Arrastar pra reordenar.
    row.addEventListener('dragstart', () => {
      singerDragFromIndex = i;
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));
    row.addEventListener('dragover', (e) => e.preventDefault());
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      if (singerDragFromIndex === null || singerDragFromIndex === i) return;
      const rect = row.getBoundingClientRect();
      const isTopHalf = e.clientY < rect.top + rect.height / 2;
      const targetIndex = isTopHalf ? i : i + 1;
      singerManager.reorderSinger(singerDragFromIndex, targetIndex);
      singerDragFromIndex = null;
    });

    singerListFull.appendChild(row);
  });
}

/** Chamado sempre que o estado de play/pause muda, pra manter a tag
 * TOCANDO da lista de cantores sincronizada (sem precisar re-renderizar
 * a lista inteira, que perderia o estado de drag). */
function updateSingerNowPlayingBadge() {
  const badge = singerListFull.querySelector('.now-playing-badge');
  if (badge) badge.classList.toggle('hidden', !isAnythingPlaying());
}

/** Carrega a música do cantor da vez no player (ou mostra estado de espera/vazio). */
async function loadCurrentSingerTurn(autoplay) {
  renderSingerRoundView();
  const singer = singerManager.getCurrentSinger();
  if (!singer || singer.songs.length === 0) {
    resetToEmptyState();
    renderSingerRoundView();
    return;
  }
  const song = singer.songs[0];
  playlist = [song];
  currentIndex = -1;
  await selectTrack(0, { autoplay, initialSemitones: song.savedSemitones || 0 });
}

// (o "Pular cantor" agora é renderizado dentro da própria linha ativa em renderSingerRoundView, quando ela não tem música)

// ---------- Modal "Escolher cantor" (aparece ao adicionar música em modo cantores) ----------

let singerPickerResolve = null;

function openSingerPickerModal(file) {
  return new Promise((resolve) => {
    singerPickerResolve = resolve;
    singerPickerFilename.textContent = file.name;
    singerPickerNewInput.value = '';
    renderSingerPickerList();
    singerPickerBackdrop.classList.remove('hidden');
  });
}

function renderSingerPickerList() {
  singerPickerDropdown.innerHTML = `<option value="" disabled selected>${window.i18n.t('singer_picker_dropdown_default')}</option>`;
  singerManager.getAllSingers().forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.songs.length}/${singerManager.MAX_SONGS_PER_SINGER})`;
    singerPickerDropdown.appendChild(opt);
  });
}
singerPickerDropdown.addEventListener('change', () => {
  if (singerPickerDropdown.value) {
    resolveSingerPicker({ singerId: singerPickerDropdown.value, isNew: false });
  }
});

function resolveSingerPicker(result) {
  if (!singerPickerResolve) return;
  const resolve = singerPickerResolve;
  singerPickerResolve = null;
  singerPickerBackdrop.classList.add('hidden');
  resolve(result);
}

singerPickerNewBtn.addEventListener('click', () => {
  const name = singerPickerNewInput.value.trim();
  if (!name) return;
  if (singerManager.nameExists(name)) {
    showError(window.i18n.t('err_singer_name_duplicate'));
    return;
  }
  resolveSingerPicker({ singerId: name, isNew: true });
});
singerPickerNewInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') singerPickerNewBtn.click();
});
singerPickerCancelBtn.addEventListener('click', () => resolveSingerPicker(null));

/** Processa uma leva de arquivos perguntando o cantor de cada um, um por um. */
async function addFilesInSingerMode(list) {
  let skippedAny = false;
  for (const file of list) {
    const lower = file.name.toLowerCase();
    const isZip = lower.endsWith('.zip');
    const isMp4 = lower.endsWith('.mp4');
    if (!isZip && !isMp4) { skippedAny = true; continue; }

    const choice = await openSingerPickerModal(file);
    if (!choice) continue; // usuário optou por pular essa música

    const parsed = window.parseKaraokeFilename(file.name);
    const song = {
      id: 'track_' + (++playlistIdCounter),
      file,
      code: parsed.code, artist: parsed.artist, title: parsed.title,
      format: isMp4 ? 'MP4' : 'MP3+G', type: isMp4 ? 'video' : 'cdg',
      savedSemitones: 0,
    };
    try {
      singerManager.addSongToSinger(choice.singerId, choice.isNew, song);
    } catch (err) {
      showError(err.message);
    }
  }
  if (skippedAny) showError(window.i18n.t('err_unsupported_files'));

  if (mode === null) loadCurrentSingerTurn(false);
}

/** Igual, mas pra um único item vindo da Biblioteca (já tem metadados prontos). */
async function addLibraryItemInSingerMode(item) {
  const choice = await openSingerPickerModal({ name: item.name });
  if (!choice) return;
  try {
    const file = await library.getFileForItem(item);
    const song = {
      id: 'track_' + (++playlistIdCounter),
      file,
      code: item.code, artist: item.artist, title: item.title,
      format: item.format, type: item.type,
      savedSemitones: 0,
      librarySource: { folderId: item.folderId, fileName: item.name },
    };
    singerManager.addSongToSinger(choice.singerId, choice.isNew, song);
    switchSidebarTab('fila');
    if (mode === null) loadCurrentSingerTurn(false);
  } catch (err) {
    console.error('[App] Erro ao ler arquivo da biblioteca:', err);
    showError(window.i18n.t('err_library_read_fail'));
  }
}

// ---------- Persistência da rodada de cantores ----------

function persistSingers() {
  try {
    const raw = singerManager.serialize();
    const safeSingers = raw.singers.map(s => ({
      id: s.id, name: s.name,
      songs: s.songs.map(song => ({
        code: song.code, artist: song.artist, title: song.title,
        format: song.format, type: song.type,
        savedSemitones: song.savedSemitones || 0,
        librarySource: song.librarySource || null,
      })),
      history: s.history,
    }));
    localStorage.setItem(SINGERS_STORAGE_KEY, JSON.stringify({
      enabled: singerModeEnabled,
      idCounter: raw.idCounter,
      currentSingerId: raw.currentSingerId,
      singers: safeSingers,
    }));
  } catch (err) {
    console.warn('[App] Não foi possível salvar a rodada de cantores:', err);
  }
}

async function restoreSingersFromStorage() {
  let saved;
  try {
    const rawStr = localStorage.getItem(SINGERS_STORAGE_KEY);
    if (!rawStr) return;
    saved = JSON.parse(rawStr);
  } catch (err) { return; }
  if (!saved) return;

  singerModeEnabled = !!saved.enabled;
  applySingerModeVisibility();
  updateShowModeBtnDisplay();

  // Restaura músicas que vieram da Biblioteca (têm referência viva);
  // músicas manuais não sobrevivem a um F5 (mesma limitação já conhecida
  // da fila simples) — ficam de fora, silenciosamente, nessa primeira
  // versão.
  let droppedSongs = 0;
  const restoredSingers = (saved.singers || []).map(s => {
    const songs = [];
    for (const song of (s.songs || [])) {
      if (song.librarySource) {
        const found = library.findByFolderAndName(song.librarySource.folderId, song.librarySource.fileName);
        if (found) {
          songs.push({ ...song, id: 'track_' + (++playlistIdCounter), file: null, _libraryItem: found });
          continue;
        }
      }
      droppedSongs++;
    }
    return { ...s, songs };
  });

  const snapshot = { idCounter: saved.idCounter || 0, currentSingerId: saved.currentSingerId, singers: restoredSingers };
  singerManager.restore(snapshot);

  // Resolve o `file` de verdade (async) pras músicas restauradas da Biblioteca.
  for (const s of singerManager.getAllSingers()) {
    for (const song of s.songs) {
      if (song._libraryItem && !song.file) {
        try { song.file = await library.getFileForItem(song._libraryItem); } catch (err) { /* ignora */ }
      }
    }
  }

  if (singerModeEnabled) {
    renderSingerRoundView();
    if (droppedSongs > 0) {
      showError(window.i18n.t('err_singer_songs_dropped', { count: droppedSongs }));
    }
  }
}

// ---------- Histórico do show (feature 3) ----------

let showHistory = []; // { horario, cantor, musica, artista, codigo, tom, duracao }
const SHOW_HISTORY_KEY = 'playkaraoke-show-history-v1';

function persistShowHistory() {
  try { localStorage.setItem(SHOW_HISTORY_KEY, JSON.stringify(showHistory)); } catch (err) {}
}
function restoreShowHistory() {
  try {
    const raw = localStorage.getItem(SHOW_HISTORY_KEY);
    if (raw) showHistory = JSON.parse(raw) || [];
  } catch (err) { showHistory = []; }
}

function logSongToShowHistory(singerName, song, semitone, duracao) {
  showHistory.push({
    horario: Date.now(),
    cantor: singerName,
    musica: song.title,
    artista: song.artist || '',
    codigo: song.code || '',
    tom: semitone || 0,
    duracao: duracao || 0,
  });
  persistShowHistory();
}

// ---------- Tela de espera rica (countdown enriquecido em modo cantores) ----------

const CD_SETTINGS_KEY = 'playkaraoke-countdown-settings-v1';

function persistCountdownSettings() {
  try {
    localStorage.setItem(CD_SETTINGS_KEY, JSON.stringify({
      upcoming: cdShowUpcomingToggle.checked,
      titles: cdShowTitlesToggle.checked,
      counter: cdShowCounterToggle.checked,
    }));
  } catch (err) {}
}
function restoreCountdownSettings() {
  try {
    const raw = localStorage.getItem(CD_SETTINGS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    cdShowUpcomingToggle.checked = s.upcoming !== false;
    cdShowTitlesToggle.checked = s.titles !== false;
    cdShowCounterToggle.checked = s.counter !== false;
  } catch (err) {}
}
[cdShowUpcomingToggle, cdShowTitlesToggle, cdShowCounterToggle].forEach(t => t.addEventListener('change', persistCountdownSettings));

function renderRichCountdown(singer) {
  const showTitles = cdShowTitlesToggle.checked;
  const showUpcoming = cdShowUpcomingToggle.checked;
  const showCounter = cdShowCounterToggle.checked;

  cdNumber.classList.toggle('hidden', !showCounter);
  cdNextTitle.classList.add('hidden'); // a versão simples de texto some, usamos o card rico
  cdSingerHighlight.classList.remove('hidden');

  cdSingerNameDisplay.textContent = singer.name;

  if (singer.songs.length > 0) {
    const song = singer.songs[0];
    cdSingerSongDisplay.classList.toggle('hidden', !showTitles);
    cdSingerSongDisplay.textContent = [song.title, song.artist].filter(Boolean).join(' — ');
    cdSingerToneDisplay.classList.add('hidden');
  } else {
    cdSingerSongDisplay.classList.add('hidden');
    cdSingerToneDisplay.classList.remove('hidden');
    cdSingerToneDisplay.textContent = window.i18n.t('waiting_for_song');
  }

  cdUpcomingList.innerHTML = '';
  cdUpcomingSection.classList.toggle('hidden', !showUpcoming);
  if (showUpcoming) {
    const upcoming = singerManager.getUpcomingSingers(3);
    upcoming.forEach((s) => {
      const row = document.createElement('div');
      row.className = 'cd-upcoming-row';
      const posBadge = document.createElement('span');
      posBadge.className = 'pos-badge';
      posBadge.textContent = String(getSingerPosition(s.id));
      const nameBadge = document.createElement('span');
      nameBadge.className = 'name-badge';
      nameBadge.textContent = s.name;
      row.appendChild(posBadge);
      row.appendChild(nameBadge);
      if (showTitles) {
        const songText = document.createElement('span');
        songText.className = 'song-info';
        songText.textContent = s.songs.length > 0 ? [s.songs[0].title, s.songs[0].artist].filter(Boolean).join(' - ') : window.i18n.t('no_song_in_queue');
        row.appendChild(songText);
      }
      cdUpcomingList.appendChild(row);
    });
  }
}

function resetCountdownDisplayToSimple() {
  cdSingerHighlight.classList.add('hidden');
  cdNextTitle.classList.remove('hidden');
  const numEl = document.getElementById('cd-number');
  if (numEl) numEl.classList.remove('hidden');
}

// ---------- Gerenciar Cantores (feature 2) ----------

let selectedManageSingerId = null;
let manageDetailTab = 'queue';

function openManageSingersModal() {
  manageSingersBackdrop.classList.remove('hidden');
  renderManageSingersList();
  if (selectedManageSingerId && singerManager.getAllSingers().some(s => s.id === selectedManageSingerId)) {
    renderManageSingerDetail(selectedManageSingerId);
  } else {
    manageSingersEmpty.classList.remove('hidden');
    manageSingersDetail.classList.add('hidden');
  }
}
openManageSingersBtn.addEventListener('click', openManageSingersModal);
manageSingersSidebarBtn.addEventListener('click', openManageSingersModal);
manageSingersCloseBtn.addEventListener('click', () => manageSingersBackdrop.classList.add('hidden'));
manageSingersBackdrop.addEventListener('click', (e) => { if (e.target === manageSingersBackdrop) manageSingersBackdrop.classList.add('hidden'); });

function renderManageSingersList() {
  manageSingersList.innerHTML = '';
  const singers = singerManager.getAllSingers();
  singers.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'manage-singer-row' + (s.id === selectedManageSingerId ? ' selected' : '');

    const pos = document.createElement('span');
    pos.className = 'pos';
    pos.textContent = String(i + 1);

    const dot = document.createElement('span');
    dot.className = 'status-dot';

    const info = document.createElement('div');
    info.className = 'info';
    const nameLine = document.createElement('div');
    nameLine.className = 'name-line';
    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = s.name;
    nameLine.appendChild(nameEl);
    const count = document.createElement('div');
    count.className = 'count';
    count.textContent = `${s.songs.length}/${singerManager.MAX_SONGS_PER_SINGER} ${window.i18n.t('manage_singers_songs_count')}`;
    info.appendChild(nameLine);
    info.appendChild(count);

    const reorderMini = document.createElement('div');
    reorderMini.className = 'reorder-mini';
    const upBtn = document.createElement('button');
    upBtn.textContent = '▲';
    upBtn.disabled = i === 0;
    upBtn.addEventListener('click', (e) => { e.stopPropagation(); singerManager.reorderSinger(i, i - 1); renderManageSingersList(); });
    const downBtn = document.createElement('button');
    downBtn.textContent = '▼';
    downBtn.disabled = i === singers.length - 1;
    downBtn.addEventListener('click', (e) => { e.stopPropagation(); singerManager.reorderSinger(i, i + 2); renderManageSingersList(); });
    reorderMini.appendChild(upBtn);
    reorderMini.appendChild(downBtn);

    const actions = document.createElement('div');
    actions.className = 'row-actions';
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.title = window.i18n.t('delete_btn_title');
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (await showConfirmModal(window.i18n.t('confirm_remove_singer', { name: s.name }))) {
        singerManager.removeSinger(s.id);
        if (selectedManageSingerId === s.id) selectedManageSingerId = null;
        renderManageSingersList();
        manageSingersEmpty.classList.remove('hidden');
        manageSingersDetail.classList.add('hidden');
        renderSingerRoundView();
      }
    });
    actions.appendChild(delBtn);

    row.appendChild(pos);
    row.appendChild(dot);
    row.appendChild(info);
    row.appendChild(reorderMini);
    row.appendChild(actions);
    row.addEventListener('click', () => { selectedManageSingerId = s.id; renderManageSingersList(); renderManageSingerDetail(s.id); });

    manageSingersList.appendChild(row);
  });
}

addNewSingerBtn.addEventListener('click', async () => {
  const name = await showPromptModal(window.i18n.t('prompt_new_singer_name'));
  if (!name || !name.trim()) return;
  try {
    singerManager.addSinger(name);
    renderManageSingersList();
    renderSingerRoundView();
  } catch (err) {
    showError(err.message);
  }
});

function renderManageSingerDetail(singerId) {
  const singer = singerManager.getAllSingers().find(s => s.id === singerId);
  if (!singer) return;
  manageSingersEmpty.classList.add('hidden');
  manageSingersDetail.classList.remove('hidden');
  detailSingerName.textContent = singer.name;
  renderDetailQueueList(singer);
  renderDetailHistoryList(singer);
}

detailEditNameBtn.addEventListener('click', async () => {
  const singer = singerManager.getAllSingers().find(s => s.id === selectedManageSingerId);
  if (!singer) return;
  const newName = await showPromptModal(window.i18n.t('prompt_rename_singer'), singer.name);
  if (newName === null) return; // cancelou
  const trimmed = newName.trim();
  if (!trimmed || trimmed === singer.name) return;
  try {
    singerManager.renameSinger(singer.id, trimmed);
    detailSingerName.textContent = singer.name;
    renderManageSingersList();
    renderSingerRoundView();
  } catch (err) {
    showError(err.message);
  }
});

function switchDetailTab(tab) {
  manageDetailTab = tab;
  detailTabQueueBtn.classList.toggle('active', tab === 'queue');
  detailTabHistoryBtn.classList.toggle('active', tab === 'history');
  detailQueuePanel.classList.toggle('hidden', tab !== 'queue');
  detailHistoryPanel.classList.toggle('hidden', tab !== 'history');
}
detailTabQueueBtn.addEventListener('click', () => switchDetailTab('queue'));
detailTabHistoryBtn.addEventListener('click', () => switchDetailTab('history'));

function renderDetailQueueList(singer) {
  detailQueueList.innerHTML = '';
  if (singer.songs.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'empty-hint-small';
    hint.textContent = window.i18n.t('manage_singers_queue_empty');
    detailQueueList.appendChild(hint);
  }
  singer.songs.forEach((song, i) => {
    const row = document.createElement('div');
    row.className = 'detail-song-row';
    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `${i + 1}. ${song.title}`;
    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = song.artist || song.format;
    info.appendChild(title);
    info.appendChild(sub);

    const reorderMini = document.createElement('div');
    reorderMini.className = 'reorder-mini';
    const upBtn = document.createElement('button');
    upBtn.textContent = '▲';
    upBtn.disabled = i === 0;
    upBtn.title = window.i18n.t('move_up_title');
    upBtn.addEventListener('click', () => {
      singerManager.reorderSongInSinger(singer.id, i, i - 1);
      renderDetailQueueList(singer);
      renderSingerRoundView();
    });
    const downBtn = document.createElement('button');
    downBtn.textContent = '▼';
    downBtn.disabled = i === singer.songs.length - 1;
    downBtn.title = window.i18n.t('move_down_title');
    downBtn.addEventListener('click', () => {
      singerManager.reorderSongInSinger(singer.id, i, i + 2);
      renderDetailQueueList(singer);
      renderSingerRoundView();
    });
    reorderMini.appendChild(upBtn);
    reorderMini.appendChild(downBtn);

    const toneControls = document.createElement('div');
    toneControls.className = 'tone-controls';
    const minus = document.createElement('button');
    minus.textContent = '−';
    minus.addEventListener('click', () => {
      song.savedSemitones = Math.max(-12, (song.savedSemitones || 0) - 1);
      persistSingers();
      renderDetailQueueList(singer);
    });
    const toneVal = document.createElement('span');
    toneVal.className = 'tone-val';
    const st = song.savedSemitones || 0;
    toneVal.textContent = `${st > 0 ? '+' : ''}${st}`;
    const plus = document.createElement('button');
    plus.textContent = '+';
    plus.addEventListener('click', () => {
      song.savedSemitones = Math.min(12, (song.savedSemitones || 0) + 1);
      persistSingers();
      renderDetailQueueList(singer);
    });
    toneControls.appendChild(minus);
    toneControls.appendChild(toneVal);
    toneControls.appendChild(plus);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-song-btn';
    removeBtn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', () => {
      singerManager.removeSongFromSinger(singer.id, i);
      renderDetailQueueList(singer);
      renderManageSingersList();
      renderSingerRoundView();
    });

    row.appendChild(info);
    row.appendChild(reorderMini);
    row.appendChild(toneControls);
    row.appendChild(removeBtn);
    detailQueueList.appendChild(row);
  });
}

function renderDetailHistoryList(singer) {
  detailHistoryList.innerHTML = '';
  if (singer.history.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'empty-hint-small';
    hint.textContent = window.i18n.t('manage_singers_history_empty');
    detailHistoryList.appendChild(hint);
    return;
  }
  singer.history.slice().reverse().forEach(h => {
    const row = document.createElement('div');
    row.className = 'detail-song-row';
    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = h.title;
    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = `${h.artist || ''} · tom ${h.semitone > 0 ? '+' : ''}${h.semitone}`;
    info.appendChild(title);
    info.appendChild(sub);
    row.appendChild(info);
    detailHistoryList.appendChild(row);
  });
}

detailAddSongBtn.addEventListener('click', () => {
  detailAddSongSearch.classList.toggle('hidden');
  detailSongSearchInput.value = '';
  detailSongSearchResults.innerHTML = '';
  if (!detailAddSongSearch.classList.contains('hidden')) detailSongSearchInput.focus();
});

detailSongSearchInput.addEventListener('input', () => {
  const q = detailSongSearchInput.value;
  detailSongSearchResults.innerHTML = '';
  if (!q.trim()) return;
  const results = library.search(q);
  results.forEach(item => {
    const row = document.createElement('div');
    row.className = 'search-result';
    const meta = document.createElement('div');
    meta.className = 'sr-meta';
    const t = document.createElement('div');
    t.className = 'sr-title';
    t.textContent = item.title;
    const s = document.createElement('div');
    s.className = 'sr-sub';
    s.textContent = [item.artist, item.code].filter(Boolean).join(' · ');
    meta.appendChild(t);
    meta.appendChild(s);
    const addBtn = document.createElement('div');
    addBtn.className = 'sr-add';
    addBtn.innerHTML = '+';
    row.appendChild(meta);
    row.appendChild(addBtn);
    row.addEventListener('click', async () => {
      try {
        const file = await library.getFileForItem(item);
        const song = {
          id: 'track_' + (++playlistIdCounter),
          file, code: item.code, artist: item.artist, title: item.title,
          format: item.format, type: item.type, savedSemitones: 0,
          librarySource: { folderId: item.folderId, fileName: item.name },
        };
        singerManager.addSongToSinger(selectedManageSingerId, false, song);
        detailAddSongSearch.classList.add('hidden');
        renderManageSingerDetail(selectedManageSingerId);
        renderManageSingersList();
        renderSingerRoundView();
      } catch (err) {
        showError(err.message || window.i18n.t('err_load_generic'));
      }
    });
    detailSongSearchResults.appendChild(row);
  });
});

// Upload direto de arquivo(s) do computador, pra adicionar na fila do
// cantor selecionado sem precisar passar pela Biblioteca.
detailUploadFileBtn.addEventListener('click', () => detailUploadFileInput.click());
detailUploadFileInput.addEventListener('change', async () => {
  const files = Array.from(detailUploadFileInput.files || []);
  detailUploadFileInput.value = ''; // permite selecionar o mesmo arquivo de novo depois, se precisar

  let addedAny = false;
  for (const file of files) {
    const lower = file.name.toLowerCase();
    const isZip = lower.endsWith('.zip');
    const isMp4 = lower.endsWith('.mp4');
    if (!isZip && !isMp4) {
      showError(window.i18n.t('err_unsupported_files'));
      continue;
    }
    const parsed = window.parseKaraokeFilename(file.name);
    const song = {
      id: 'track_' + (++playlistIdCounter),
      file,
      code: parsed.code, artist: parsed.artist, title: parsed.title,
      format: isMp4 ? 'MP4' : 'MP3+G', type: isMp4 ? 'video' : 'cdg',
      savedSemitones: 0,
    };
    try {
      singerManager.addSongToSinger(selectedManageSingerId, false, song);
      addedAny = true;
    } catch (err) {
      showError(err.message);
    }
  }

  if (addedAny) {
    detailAddSongSearch.classList.add('hidden');
    renderManageSingerDetail(selectedManageSingerId);
    renderManageSingersList();
    renderSingerRoundView();
  }
});

// ---------- Encerrar Show (feature 3) ----------

// (o clique que abre a confirmação de encerrar já é tratado no listener do showModeBtn, acima)
endShowConfirmCancelBtn.addEventListener('click', () => endShowConfirmBackdrop.classList.add('hidden'));
endShowConfirmBackdrop.addEventListener('click', (e) => { if (e.target === endShowConfirmBackdrop) endShowConfirmBackdrop.classList.add('hidden'); });

endShowConfirmOkBtn.addEventListener('click', () => {
  endShowConfirmBackdrop.classList.add('hidden');
  openShowReport();
});

function formatShowDuration(ms) {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}min` : `${m}min`;
}

function openShowReport() {
  const startRaw = localStorage.getItem('playkaraoke-session-start');
  const start = startRaw ? Number(startRaw) : Date.now();
  const duration = Date.now() - start;

  reportDuration.textContent = formatShowDuration(duration);
  reportTotalSongs.textContent = String(showHistory.length);

  const uniqueSingers = new Set(showHistory.map(h => h.cantor));
  reportUniqueSingers.textContent = String(uniqueSingers.size);

  const countBySinger = {};
  showHistory.forEach(h => { countBySinger[h.cantor] = (countBySinger[h.cantor] || 0) + 1; });
  let topSinger = '—', topCount = 0;
  Object.entries(countBySinger).forEach(([name, count]) => {
    if (count > topCount) { topSinger = name; topCount = count; }
  });
  reportHighlight.textContent = topCount > 0 ? `${topSinger} (${topCount})` : '—';

  showReportTbody.innerHTML = '';
  showHistory.slice().reverse().forEach(h => {
    const tr = document.createElement('tr');
    const time = new Date(h.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    [time, h.cantor, h.musica, h.artista, `${h.tom > 0 ? '+' : ''}${h.tom}`].forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });
    showReportTbody.appendChild(tr);
  });

  showReportBackdrop.classList.remove('hidden');
}

showReportCloseBtn.addEventListener('click', () => showReportBackdrop.classList.add('hidden'));

function buildShowCsv() {
  const lines = [];
  lines.push('Horário,Cantor,Música,Artista,Código,Tom,Duração(s)');
  showHistory.forEach(h => {
    const time = new Date(h.horario).toLocaleTimeString('pt-BR');
    const row = [time, h.cantor, h.musica, h.artista, h.codigo, h.tom, h.duracao]
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    lines.push(row);
  });
  return lines.join('\n');
}

exportCsvBtn.addEventListener('click', () => {
  const csv = buildShowCsv();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `play-karaoke-show-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

newShowBtn.addEventListener('click', () => {
  try {
    localStorage.removeItem(SHOW_HISTORY_KEY);
    localStorage.removeItem(SINGERS_STORAGE_KEY);
    localStorage.removeItem(PLAYLIST_STORAGE_KEY);
    localStorage.removeItem('playkaraoke-session-start');
    sessionStorage.removeItem('playkaraoke_auth');
  } catch (err) {}
  window.location.reload();
});

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
        savedSemitones: item.savedSemitones || 0,
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
            savedSemitones: savedItem.savedSemitones || 0,
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
    showError(window.i18n.t('err_playlist_songs_dropped', { count: droppedCount }));
  }
}

// Tenta restaurar pastas já conectadas em sessões anteriores (silencioso).
library.restoreSavedFolders().then(async () => {
  await restoreSingersFromStorage();
  if (singerModeEnabled) {
    await loadCurrentSingerTurn(false);
  } else {
    await restorePlaylistFromStorage();
  }
});

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
  // Ctrl/Cmd + Seta Direita = próxima música. Clicar no botão (em vez
  // de chamar playNextInQueue direto) reaproveita o estado de
  // habilitado/desabilitado que já existe — em modo cantores o botão
  // fica sempre desabilitado (não existe "próxima" manual lá), então o
  // atalho vira um no-op seguro nesse modo, sem precisar checar nada.
  if ((e.ctrlKey || e.metaKey) && e.code === 'ArrowRight' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    nextBtn.click();
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
restoreShowHistory();
updateShowModeBtnDisplay();
restoreCountdownSettings();

// ---------- Idioma (i18n) ----------
languageSelect.value = window.i18n.getCurrentLang();
window.i18n.applyTranslations();
languageSelect.addEventListener('change', () => {
  window.i18n.setLanguage(languageSelect.value);
});
window.i18n.onLanguageChange(() => {
  // Alguns textos são gerados dinamicamente (não têm data-i18n no HTML
  // estático) — precisam ser re-renderizados manualmente quando o
  // idioma muda, senão ficam "presos" no idioma anterior até a próxima
  // ação do usuário atualizar aquele pedaço da tela.
  renderPlaylist();
  updateAutoplayIndicator();
  updateApplauseIndicator();
  updateAmbientIndicator();
  if (singerModeEnabled) renderSingerRoundView();
  if (mode === null) updateMetaBar(null);
});
