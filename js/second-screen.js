/**
 * Second Screen — script da janela separada usada como "segunda tela"
 * (pra arrastar pro monitor voltado pro cantor). Não tem áudio nem
 * controles: só recebe, via BroadcastChannel, o mesmo CDG/vídeo e o tempo
 * atual que a janela principal está tocando, e mantém isso sincronizado
 * aqui — a janela principal continua sendo a única fonte de áudio.
 *
 * Quando nada está tocando na janela principal (parado, pausado, ou na
 * espera do autoplay), mostra a logo (ou uma imagem customizada, se
 * configurada) centralizada em vez de deixar o último frame congelado.
 */

(function () {
  const canvasWrap = document.getElementById('canvas-wrap');
  const videoWrap = document.getElementById('video-wrap');
  const canvas = document.getElementById('cdg-canvas');
  const videoEl = document.getElementById('video-el');
  const fsBtn = document.getElementById('fs-btn');
  const idleOverlay = document.getElementById('idle-overlay');
  const idleLogo = document.getElementById('idle-logo');
  const idleCustomImage = document.getElementById('idle-custom-image');
  const countdownOverlay = document.getElementById('countdown-overlay');
  const cdNumber = document.getElementById('cd-number');
  const cdNextTitle = document.getElementById('cd-next-title');

  fsBtn.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Erro ao entrar/sair de tela cheia:', err);
    }
  });

  const cdgPlayer = new CDGPlayer(canvas);
  cdgPlayer.setRenderMode('smooth');

  let mode = null; // 'cdg' | 'video' | null (nada carregado ainda)
  let isPlayingState = false;
  let countdownActive = false;
  let lastVideoUrl = null;

  function applyIdleImage(dataUrl) {
    if (dataUrl) {
      idleLogo.classList.add('hidden');
      idleCustomImage.classList.remove('hidden');
      idleCustomImage.style.backgroundImage = `url(${dataUrl})`;
    } else {
      idleLogo.classList.remove('hidden');
      idleCustomImage.classList.add('hidden');
      idleCustomImage.style.backgroundImage = '';
    }
  }

  /** Decide o que mostrar: countdown (prioridade), canvas/vídeo (se tocando), ou a tela ociosa. */
  function updateVisibility() {
    countdownOverlay.classList.toggle('hidden', !countdownActive);
    if (countdownActive) {
      idleOverlay.classList.add('hidden');
      canvasWrap.classList.add('hidden');
      videoWrap.classList.add('hidden');
      return;
    }
    const showingMedia = isPlayingState && mode !== null;
    idleOverlay.classList.toggle('hidden', showingMedia);
    canvasWrap.classList.toggle('hidden', !showingMedia || mode !== 'cdg');
    videoWrap.classList.toggle('hidden', !showingMedia || mode !== 'video');
  }

  if (!('BroadcastChannel' in window)) {
    idleLogo.style.opacity = '0.15'; // sinal visual discreto de que algo não está certo
    return;
  }

  const channel = new BroadcastChannel('playkaraoke-second-screen');

  channel.addEventListener('message', (e) => {
    const msg = e.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'init-cdg': {
        cdgPlayer.load(msg.cdgBuffer);
        if (msg.colors) cdgPlayer.setCustomColors(msg.colors);
        mode = 'cdg';
        updateVisibility();
        break;
      }
      case 'init-video': {
        if (msg.videoUrl !== lastVideoUrl) {
          videoEl.src = msg.videoUrl;
          lastVideoUrl = msg.videoUrl;
        }
        mode = 'video';
        updateVisibility();
        break;
      }
      case 'time': {
        if (mode === 'cdg') {
          cdgPlayer.update(msg.currentTime);
        } else if (mode === 'video') {
          // Corrige deriva sem forçar o tempo a cada mensagem (evita
          // engasgo por ficar resetando o currentTime toda hora).
          if (Math.abs(videoEl.currentTime - msg.currentTime) > 0.4) {
            videoEl.currentTime = msg.currentTime;
          }
        }
        break;
      }
      case 'playing': {
        isPlayingState = true;
        updateVisibility();
        break;
      }
      case 'idle': {
        isPlayingState = false;
        updateVisibility();
        break;
      }
      case 'colors': {
        cdgPlayer.setCustomColors(msg.colors || null);
        break;
      }
      case 'idle-image': {
        applyIdleImage(msg.dataUrl || null);
        break;
      }
      case 'countdown-start': {
        countdownActive = true;
        cdNumber.textContent = String(msg.remaining);
        cdNextTitle.textContent = msg.nextTitle || '';
        updateVisibility();
        break;
      }
      case 'countdown-tick': {
        cdNumber.textContent = String(msg.remaining);
        break;
      }
      case 'countdown-end': {
        countdownActive = false;
        updateVisibility();
        break;
      }
      case 'clear': {
        mode = null;
        isPlayingState = false;
        countdownActive = false;
        updateVisibility();
        break;
      }
    }
  });

  // Avisa a janela principal que já está pronta pra receber o estado atual
  // (ela responde reenviando o CDG/vídeo + tempo em andamento + a imagem
  // de fundo customizada, se houver).
  channel.postMessage({ type: 'ready' });

  // Mantém o vídeo mudo sempre — o áudio já toca na janela principal, não
  // queremos duas fontes de som ao mesmo tempo.
  videoEl.muted = true;
  videoEl.addEventListener('canplay', () => {
    videoEl.play().catch(() => {});
  });

  updateVisibility(); // estado inicial: tela ociosa (nada tocando ainda)
})();
