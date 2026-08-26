/**
 * CDG Player — parser e renderizador do formato CD+Graphics (.cdg)
 * usado em arquivos de karaokê MP3+G / ZIP+G.
 *
 * Referência do formato: cada arquivo .cdg é uma sequência de pacotes de
 * 24 bytes, reproduzidos a 300 pacotes/segundo (4 pacotes por sector CD,
 * 75 sectors/segundo). Cada pacote pode conter um comando que desenha um
 * "tile" (bloco 6x12 pixels) na tela virtual de 300x216 pixels, define a
 * paleta de 16 cores, rola a tela, etc.
 *
 * Esta implementação é original, escrita a partir da especificação técnica
 * pública do formato CD+G (não reproduz código de terceiros).
 */

const CDG_SCREEN_WIDTH = 300;
const CDG_SCREEN_HEIGHT = 216;
const CDG_TILE_WIDTH = 6;
const CDG_TILE_HEIGHT = 12;
const CDG_TILE_COLS = CDG_SCREEN_WIDTH / CDG_TILE_WIDTH;   // 50
const CDG_TILE_ROWS = CDG_SCREEN_HEIGHT / CDG_TILE_HEIGHT; // 18
const CDG_PACKETS_PER_SECOND = 300;

// Instruction codes (dentro do grupo de comando 0x09 = "CDG_COMMAND")
const CDG_COMMAND_MASK = 0x3F;
const CDG_COMMAND = 0x09;
const INS_MEMORY_PRESET = 1;
const INS_BORDER_PRESET = 2;
const INS_TILE_BLOCK = 6;
const INS_SCROLL_PRESET = 20;
const INS_SCROLL_COPY = 24;
const INS_TRANSPARENT_COLOR = 28;
const INS_LOAD_CLUT_LOW = 30;
const INS_LOAD_CLUT_HIGH = 31;
const INS_TILE_BLOCK_XOR = 38;

class CDGPlayer {
  /**
   * @param {HTMLCanvasElement} canvas - canvas onde o resultado final é desenhado (pode ter qualquer tamanho, será escalado)
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    // Buffer offscreen na resolução nativa do CDG (300x216)
    this.offscreen = document.createElement('canvas');
    this.offscreen.width = CDG_SCREEN_WIDTH;
    this.offscreen.height = CDG_SCREEN_HEIGHT;
    this.offctx = this.offscreen.getContext('2d', { alpha: false });
    this.imageData = this.offctx.createImageData(CDG_SCREEN_WIDTH, CDG_SCREEN_HEIGHT);

    // Buffer de índices de cor (0-15) por pixel
    this.pixels = new Uint8Array(CDG_SCREEN_WIDTH * CDG_SCREEN_HEIGHT);

    // Paleta: 16 cores, cada uma [r,g,b]
    this.palette = new Array(16).fill(0).map(() => [0, 0, 0]);

    this.borderColor = 0;
    this.transparentIndex = -1;

    this.packets = [];       // pacotes parseados
    this.lastProcessedIndex = -1;

    // Rastreamento de "regiões sujas": em vez de redesenhar os 64.800
    // pixels da tela inteira a cada frame, só redesenhamos os tiles
    // (blocos 6x12) que realmente mudaram desde o último frame. Isso é
    // essencial pra fluidez, já que o player roda a ~60fps e a thread
    // principal também está processando áudio.
    this.dirtyTiles = new Set();
    this.fullDirty = true;

    // --- Cores personalizadas ---
    // O CDG separa "forma" (pixels/tiles) de "cor" (paleta de 16 entradas),
    // então dá pra recolorir sem tocar no desenho original. Não sabemos de
    // antemão qual índice da paleta é "fundo", "texto" ou "destaque" — por
    // isso rastreamos isso em tempo real:
    //   - backgroundIndex: exato, vem do último MEMORY_PRESET (comando
    //     que preenche a tela toda de uma cor — sempre é o fundo).
    //   - colorUsageCount: quantos pixels na tela usam cada um dos 16
    //     índices agora. A cor não-fundo mais usada = "texto" (a letra
    //     normal ocupa mais área). Qualquer outra cor em uso = "destaque"
    //     (cor de sincronia, que normalmente cobre só a linha atual).
    this.backgroundIndex = 0;
    this.colorUsageCount = new Array(16).fill(0);
    this.customColors = null; // null = usa as cores originais do arquivo
    this.renderMode = 'sharp'; // 'sharp' (nítido/pixelado) ou 'smooth' (suavizado/borrado)
    this.zoom = 1.0; // 1.0 = tela cheia; > 1.0 corta as bordas e amplia o centro (letras maiores)
  }

  /**
   * Carrega os bytes crus do arquivo .cdg e faz o parsing em pacotes de 24 bytes.
   * @param {ArrayBuffer} arrayBuffer
   */
  load(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const packetCount = Math.floor(bytes.length / 24);
    this.packets = new Array(packetCount);
    for (let i = 0; i < packetCount; i++) {
      const offset = i * 24;
      this.packets[i] = bytes.subarray(offset, offset + 24);
    }
    this.reset();
  }

  reset() {
    this.pixels.fill(0);
    this.palette = new Array(16).fill(0).map(() => [0, 0, 0]);
    this.borderColor = 0;
    this.transparentIndex = -1;
    this.lastProcessedIndex = -1;
    this.dirtyTiles.clear();
    this.fullDirty = true;
    this.backgroundIndex = 0;
    this.colorUsageCount.fill(0);
    this._clearImageData();
  }

  _clearImageData() {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
    }
  }

  /**
   * Avança a interpretação até o tempo (em segundos) informado, processando
   * todos os pacotes ainda não processados até esse ponto, e redesenha o canvas.
   * @param {number} currentTimeSec
   */
  update(currentTimeSec) {
    if (!this.packets.length) return;

    const targetIndex = Math.min(
      Math.floor(currentTimeSec * CDG_PACKETS_PER_SECOND),
      this.packets.length - 1
    );

    // Se o tempo voltou (seek para trás), reprocessa do zero até o novo ponto
    if (targetIndex < this.lastProcessedIndex) {
      this.reset();
    }

    let processed = false;
    for (let i = this.lastProcessedIndex + 1; i <= targetIndex; i++) {
      this._processPacket(this.packets[i]);
      processed = true;
    }
    this.lastProcessedIndex = targetIndex;

    if (processed || this.fullDirty || this.dirtyTiles.size) {
      this._render();
    }
  }

  _processPacket(packet) {
    const command = packet[0] & CDG_COMMAND_MASK;
    if (command !== CDG_COMMAND) return;

    const instruction = packet[1] & CDG_COMMAND_MASK;
    const data = packet.subarray(4, 20);

    switch (instruction) {
      case INS_MEMORY_PRESET:
        this._memoryPreset(data);
        break;
      case INS_BORDER_PRESET:
        this._borderPreset(data);
        break;
      case INS_TILE_BLOCK:
        this._tileBlock(data, false);
        break;
      case INS_TILE_BLOCK_XOR:
        this._tileBlock(data, true);
        break;
      case INS_SCROLL_PRESET:
        this._scroll(data, false);
        break;
      case INS_SCROLL_COPY:
        this._scroll(data, true);
        break;
      case INS_TRANSPARENT_COLOR:
        this.transparentIndex = data[0] & 0x0F;
        break;
      case INS_LOAD_CLUT_LOW:
        this._loadClut(data, 0);
        break;
      case INS_LOAD_CLUT_HIGH:
        this._loadClut(data, 8);
        break;
      default:
        break; // instrução desconhecida/ignorada
    }
  }

  _memoryPreset(data) {
    const color = data[0] & 0x0F;
    this.pixels.fill(color);
    this.fullDirty = true;
    this.backgroundIndex = color;
    this.colorUsageCount.fill(0);
    this.colorUsageCount[color] = CDG_SCREEN_WIDTH * CDG_SCREEN_HEIGHT;
  }

  _borderPreset(data) {
    this.borderColor = data[0] & 0x0F;
  }

  _loadClut(data, startIndex) {
    for (let i = 0; i < 8; i++) {
      const b0 = data[i * 2];
      const b1 = data[i * 2 + 1];
      // Codificação de cor CDG: 4 bits R, 4 bits G, 4 bits B (12-bit RGB)
      const r4 = (b0 >> 2) & 0x0F;
      const g4 = ((b0 & 0x03) << 2) | ((b1 >> 4) & 0x03);
      const b4 = b1 & 0x0F;
      const r = (r4 << 4) | r4;
      const g = (g4 << 4) | g4;
      const b = (b4 << 4) | b4;
      this.palette[startIndex + i] = [r, g, b];
    }
    // Mudança de paleta afeta a cor final de todos os pixels já desenhados
    this.fullDirty = true;
  }

  _tileBlock(data, xor) {
    const color0 = data[0] & 0x0F;
    const color1 = data[1] & 0x0F;
    const row = data[2] & 0x1F; // 0-17
    const col = data[3] & 0x3F; // 0-49
    if (row >= CDG_TILE_ROWS || col >= CDG_TILE_COLS) return;

    const baseX = col * CDG_TILE_WIDTH;
    const baseY = row * CDG_TILE_HEIGHT;

    for (let r = 0; r < CDG_TILE_HEIGHT; r++) {
      const rowByte = data[4 + r];
      for (let c = 0; c < CDG_TILE_WIDTH; c++) {
        const bit = (rowByte >> (5 - c)) & 0x01;
        const px = baseX + c;
        const py = baseY + r;
        const idx = py * CDG_SCREEN_WIDTH + px;
        const oldVal = this.pixels[idx];
        const newVal = xor ? (oldVal ^ (bit ? color1 : color0)) : (bit ? color1 : color0);
        if (newVal !== oldVal) {
          this.colorUsageCount[oldVal]--;
          this.colorUsageCount[newVal]++;
          this.pixels[idx] = newVal;
        }
      }
    }

    if (!this.fullDirty) {
      this.dirtyTiles.add(row * CDG_TILE_COLS + col);
    }
  }

  _scroll(data, copy) {
    const color = data[0] & 0x0F;
    const hCmd = (data[1] >> 4) & 0x03;
    const vCmd = (data[2] >> 4) & 0x03;

    let dx = 0, dy = 0;
    if (hCmd === 1) dx = -CDG_TILE_WIDTH;
    else if (hCmd === 2) dx = CDG_TILE_WIDTH;
    if (vCmd === 1) dy = -CDG_TILE_HEIGHT;
    else if (vCmd === 2) dy = CDG_TILE_HEIGHT;

    if (dx === 0 && dy === 0) return;

    const w = CDG_SCREEN_WIDTH, h = CDG_SCREEN_HEIGHT;
    const src = this.pixels;

    // Buffer de rascunho reutilizável (evita alocar um Uint8Array novo a
    // cada pacote de scroll — menos lixo de memória, menos GC).
    if (!this._scrollScratch) this._scrollScratch = new Uint8Array(w * h);
    const dst = this._scrollScratch;

    for (let y = 0; y < h; y++) {
      const sy = y - dy;
      const destRowStart = y * w;
      if (sy < 0 || sy >= h) {
        if (copy) {
          const wrappedSy = ((sy % h) + h) % h;
          this._copyRowShifted(src, wrappedSy * w, dst, destRowStart, w, dx, color, true);
        } else {
          dst.fill(color, destRowStart, destRowStart + w);
        }
      } else {
        this._copyRowShifted(src, sy * w, dst, destRowStart, w, dx, color, copy);
      }
    }

    src.set(dst);
    this.fullDirty = true;

    // Scroll rearranja os pixels de forma complexa; mais simples e barato
    // (evento raro) recalcular a contagem de uso de cor do zero.
    this.colorUsageCount.fill(0);
    for (let i = 0; i < src.length; i++) {
      this.colorUsageCount[src[i]]++;
    }
  }

  /**
   * Copia uma linha de `src` pra `dst` com deslocamento horizontal `dx`,
   * usando .set()/.fill() nativos (memcpy) em vez de um loop por pixel.
   * dst[x] = src[x - dx], preenchendo a área exposta com `fillColor` ou,
   * se `wrap`, com o conteúdo do lado oposto da mesma linha.
   */
  _copyRowShifted(src, srcRowStart, dst, dstRowStart, w, dx, fillColor, wrap) {
    if (dx === 0) {
      dst.set(src.subarray(srcRowStart, srcRowStart + w), dstRowStart);
      return;
    }
    if (dx > 0) {
      if (wrap) {
        dst.set(src.subarray(srcRowStart + w - dx, srcRowStart + w), dstRowStart);
      } else {
        dst.fill(fillColor, dstRowStart, dstRowStart + dx);
      }
      dst.set(src.subarray(srcRowStart, srcRowStart + w - dx), dstRowStart + dx);
    } else {
      const s = -dx;
      dst.set(src.subarray(srcRowStart + s, srcRowStart + w), dstRowStart);
      if (wrap) {
        dst.set(src.subarray(srcRowStart, srcRowStart + s), dstRowStart + w - s);
      } else {
        dst.fill(fillColor, dstRowStart + w - s, dstRowStart + w);
      }
    }
  }

  /**
   * Define cores personalizadas. Passe null para voltar às cores originais
   * do arquivo.
   * @param {{background: string, text: string, highlight: string} | null} colors - cores em hex, ex: '#131313'
   */
  setCustomColors(colors) {
    if (!colors) {
      this.customColors = null;
    } else {
      this.customColors = {
        background: this._hexToRgb(colors.background),
        text: this._hexToRgb(colors.text),
        highlight: this._hexToRgb(colors.highlight),
      };
    }
    this.fullDirty = true; // precisa repintar tudo com o novo mapeamento
  }

  /** @param {'sharp'|'smooth'} mode */
  setRenderMode(mode) {
    this.renderMode = mode === 'smooth' ? 'smooth' : 'sharp';
    this.fullDirty = true;
  }

  /**
   * @param {number} zoom - 1.0 = tela cheia; até ~2.0 corta as bordas e
   * amplia o centro da tela (onde a letra normalmente fica), deixando o
   * texto visualmente maior. Não redesenha os pixels, só muda a região
   * da fonte usada no upscale — barato, roda todo frame sem custo extra.
   */
  setZoom(zoom) {
    this.zoom = Math.max(1.0, Math.min(2.0, zoom));
  }

  /**
   * Força redesenhar a tela agora, mesmo sem novos pacotes de CDG chegando
   * (ex: usuário mexeu no zoom com o player pausado). Se os dados de pixel
   * já estão corretos (não há fullDirty/dirtyTiles pendente), isso só
   * refaz o "blit" final (recorte + escala), que é barato.
   */
  forceRepaint() {
    this._render();
  }

  _hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 0xFF, (num >> 8) & 0xFF, num & 0xFF];
  }

  /** Índice de cor não-fundo mais usado na tela agora = "texto" dominante. */
  _findDominantTextIndex() {
    let best = -1;
    let bestCount = 0;
    for (let i = 0; i < 16; i++) {
      if (i === this.backgroundIndex) continue;
      if (this.colorUsageCount[i] > bestCount) {
        bestCount = this.colorUsageCount[i];
        best = i;
      }
    }
    return best;
  }

  /** Resolve a cor RGB final de um índice de paleta, aplicando o override de cores customizadas quando ativo. */
  _getRenderColor(colorIndex) {
    if (!this.customColors) {
      return this.palette[colorIndex] || [0, 0, 0];
    }
    if (colorIndex === this.backgroundIndex) {
      return this.customColors.background;
    }
    if (colorIndex === this._dominantTextIndexCache) {
      return this.customColors.text;
    }
    if (this.colorUsageCount[colorIndex] > 0) {
      return this.customColors.highlight;
    }
    return this.palette[colorIndex] || [0, 0, 0];
  }

  _writePixelToImageData(idx) {
    const data = this.imageData.data;
    const color = this._getRenderColor(this.pixels[idx]);
    const o = idx * 4;
    data[o] = color[0];
    data[o + 1] = color[1];
    data[o + 2] = color[2];
    data[o + 3] = 255;
  }

  _writeTilePixels(row, col) {
    const baseX = col * CDG_TILE_WIDTH;
    const baseY = row * CDG_TILE_HEIGHT;
    for (let ty = 0; ty < CDG_TILE_HEIGHT; ty++) {
      const py = baseY + ty;
      const rowOffset = py * CDG_SCREEN_WIDTH;
      for (let tx = 0; tx < CDG_TILE_WIDTH; tx++) {
        this._writePixelToImageData(rowOffset + baseX + tx);
      }
    }
  }

  _render() {
    // Recalcula qual índice é "texto dominante" uma vez por frame (custo
    // desprezível: só 16 posições) e guarda em cache pra _getRenderColor
    // não recalcular por pixel.
    this._dominantTextIndexCache = this.customColors ? this._findDominantTextIndex() : -1;

    if (this.fullDirty) {
      // Repaint completo: só acontece em memory preset / scroll / troca de
      // paleta / troca de cores personalizadas — eventos raros, o custo de
      // varrer os 64.800 pixels aqui é ok.
      const data = this.imageData.data;
      const pixels = this.pixels;
      for (let i = 0; i < pixels.length; i++) {
        const color = this._getRenderColor(pixels[i]);
        const o = i * 4;
        data[o] = color[0];
        data[o + 1] = color[1];
        data[o + 2] = color[2];
        data[o + 3] = 255;
      }
      this.offctx.putImageData(this.imageData, 0, 0);
      this.fullDirty = false;
      this.dirtyTiles.clear();
    } else if (this.dirtyTiles.size) {
      // Caso comum: só alguns tiles (letras destacando) mudaram desde o
      // último frame. Em vez de um putImageData por tile (várias chamadas
      // pequenas), agrupamos tudo numa única chamada cobrindo o retângulo
      // que envolve todos os tiles sujos — bem mais barato.
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const tileKey of this.dirtyTiles) {
        const row = Math.floor(tileKey / CDG_TILE_COLS);
        const col = tileKey % CDG_TILE_COLS;
        this._writeTilePixels(row, col);
        const x0 = col * CDG_TILE_WIDTH, y0 = row * CDG_TILE_HEIGHT;
        if (x0 < minX) minX = x0;
        if (y0 < minY) minY = y0;
        if (x0 + CDG_TILE_WIDTH > maxX) maxX = x0 + CDG_TILE_WIDTH;
        if (y0 + CDG_TILE_HEIGHT > maxY) maxY = y0 + CDG_TILE_HEIGHT;
      }
      if (maxX > minX) {
        this.offctx.putImageData(this.imageData, 0, 0, minX, minY, maxX - minX, maxY - minY);
      }
      this.dirtyTiles.clear();
    }

    // Escala o buffer 300x216 para o tamanho real do canvas visível,
    // preenchendo primeiro com a cor de borda. Esse passo é barato
    // (aceleração de GPU) e roda todo frame em que algo mudou.
    const w = this.canvas.width;
    const h = this.canvas.height;
    const borderRGB = this.customColors ? this.customColors.background : (this.palette[this.borderColor] || [0, 0, 0]);
    this.ctx.fillStyle = `rgb(${borderRGB[0]},${borderRGB[1]},${borderRGB[2]})`;
    this.ctx.fillRect(0, 0, w, h);

    // O CDG nasceu em 300x216 (padrão de TV dos anos 90) — nunca vai ter
    // "alta definição" de verdade. 'sharp' mantém os pixels nítidos (jeito
    // original, meio quadriculado); 'smooth' suaviza o redimensionamento
    // (menos blocado, porém borrado). É uma escolha de estilo, não dá pra
    // ter os dois ao mesmo tempo com upscale simples.
    this.ctx.imageSmoothingEnabled = this.renderMode === 'smooth';
    this.ctx.imageSmoothingQuality = 'high';

    // Zoom: corta uma faixa das bordas (proporcional ao zoom) e amplia só
    // o miolo da tela, onde a letra costuma ficar centralizada. Isso NÃO
    // aumenta a resolução real, só faz o texto ocupar mais espaço visível.
    let srcX = 0, srcY = 0, srcW = CDG_SCREEN_WIDTH, srcH = CDG_SCREEN_HEIGHT;
    if (this.zoom > 1.0) {
      srcW = CDG_SCREEN_WIDTH / this.zoom;
      srcH = CDG_SCREEN_HEIGHT / this.zoom;
      srcX = (CDG_SCREEN_WIDTH - srcW) / 2;
      srcY = (CDG_SCREEN_HEIGHT - srcH) / 2;
    }
    this.ctx.drawImage(this.offscreen, srcX, srcY, srcW, srcH, 0, 0, w, h);
  }

  /** Limpa a tela (usado quando não há CDG carregado). */
  clearScreen() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const bg = this.customColors ? this.customColors.background : [0, 0, 0];
    this.ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
    this.ctx.fillRect(0, 0, w, h);
  }
}

window.CDGPlayer = CDGPlayer;
