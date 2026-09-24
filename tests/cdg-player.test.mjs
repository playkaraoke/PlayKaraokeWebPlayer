/**
 * O renderizador do CDG foi otimizado (tabela de cores, escrita 32-bit,
 * redesenho só quando algo muda). Este teste garante que a IMAGEM gerada é
 * idêntica pixel a pixel à da versão anterior (tests/helpers/cdg-player.v2.4.js).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadPlayerClass(file) {
  const win = {};
  const document = { createElement: () => fakeCanvas() };
  new Function('window', 'document', readFileSync(file, 'utf8'))(win, document);
  return win.CDGPlayer;
}
function fakeCanvas() {
  const ctx = {
    draws: 0,
    createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
    putImageData() {}, fillRect() {}, drawImage() { ctx.draws++; },
  };
  return { width: 900, height: 648, getContext: () => ctx, ctx };
}

/** CDG sintético e determinístico: paletas, preset, tiles, XOR e scrolls. */
function syntheticCdg(packetCount) {
  let seed = 42;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const bytes = new Uint8Array(packetCount * 24);
  for (let i = 0; i < packetCount; i++) {
    const p = bytes.subarray(i * 24, i * 24 + 24);
    const r = rnd();
    if (r < 0.55) continue; // pacote vazio (como a maioria num CDG real)
    p[0] = 0x09;
    const data = p.subarray(4, 20);
    if (i < 3 || r < 0.57) { p[1] = i % 2 ? 31 : 30; for (let k = 0; k < 16; k++) data[k] = Math.floor(rnd() * 64); }
    else if (r < 0.58) { p[1] = 1; data[0] = Math.floor(rnd() * 16); }
    else if (r < 0.595) { p[1] = rnd() < 0.5 ? 20 : 24; data[0] = Math.floor(rnd() * 16); data[1] = Math.floor(rnd() * 3) << 4; data[2] = Math.floor(rnd() * 3) << 4; }
    else { p[1] = rnd() < 0.7 ? 6 : 38; data[0] = Math.floor(rnd() * 16); data[1] = Math.floor(rnd() * 16);
      data[2] = Math.floor(rnd() * 18); data[3] = Math.floor(rnd() * 50); for (let k = 4; k < 16; k++) data[k] = Math.floor(rnd() * 64); }
  }
  return bytes.buffer;
}

function runBoth(customColors) {
  const Old = loadPlayerClass(path.join(ROOT, 'tests/helpers/cdg-player.v2.4.js'));
  const New = loadPlayerClass(path.join(ROOT, 'js/cdg-player.js'));
  const a = new Old(fakeCanvas()); const b = new New(fakeCanvas());
  const buf = syntheticCdg(300 * 60); // 1 minuto
  a.load(buf); b.load(buf);
  a.setRenderMode('smooth'); b.setRenderMode('smooth');
  a.setCustomColors(customColors); b.setCustomColors(customColors);
  for (let t = 0; t <= 60; t += 1 / 60) {
    a.update(t); b.update(t);
    assert.deepEqual(b.imageData.data, a.imageData.data, `imagem diferente em t=${t.toFixed(2)}s`);
  }
  // seek pra trás
  a.update(10); b.update(10);
  assert.deepEqual(b.imageData.data, a.imageData.data);
  return { oldDraws: a.canvas.ctx.draws, newDraws: b.canvas.ctx.draws };
}

test('imagem idêntica à versão anterior (cores originais)', () => {
  const { oldDraws, newDraws } = runBoth(null);
  console.log(`redesenhos em 1 min: antes ${oldDraws}, agora ${newDraws}`);
  assert.ok(newDraws < oldDraws, `deveria redesenhar menos (antes ${oldDraws}, agora ${newDraws})`);
});

test('imagem idêntica à versão anterior (cores personalizadas)', () => {
  runBoth({ background: '#0e0e0e', text: '#ffffff', highlight: '#4d8eff' });
});

test('sem mudança de pixels, não redesenha', () => {
  const New = loadPlayerClass(path.join(ROOT, 'js/cdg-player.js'));
  const canvas = fakeCanvas();
  const p = new New(canvas);
  p.load(new ArrayBuffer(24 * 300 * 5)); // 5s de pacotes vazios
  p.update(0.1);
  const after = canvas.ctx.draws;
  for (let t = 0.2; t < 5; t += 1 / 60) p.update(t);
  assert.equal(canvas.ctx.draws, after);
});

test('modo leve: canvas na resolução nativa, mesma imagem, e volta ao tamanho original', () => {
  const New = loadPlayerClass(path.join(ROOT, 'js/cdg-player.js'));
  const canvas = fakeCanvas();
  const p = new New(canvas);
  p.load(syntheticCdg(300 * 5));
  p.update(3);
  const before = p.imageData.data.slice();
  p.setLightMode(true);
  assert.equal(canvas.width, 300); assert.equal(canvas.height, 216);
  assert.deepEqual(p.imageData.data, before);
  p.setLightMode(false);
  assert.equal(canvas.width, 900); assert.equal(canvas.height, 648);
});
