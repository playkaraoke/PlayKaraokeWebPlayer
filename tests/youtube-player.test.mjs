/** Testa js/youtube-player.js real contra uma IFrame API do YouTube falsa. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function setup() {
  const dom = new JSDOM('<div id="host"></div>', { runScripts: 'outside-only' });
  const win = dom.window;
  const players = [];
  win.YT = {
    Player: class {
      constructor(el, cfg) { this.cfg = cfg; this.calls = []; this.t = 0; players.push(this); setTimeout(() => cfg.events.onReady()); }
      emit(state) { this.cfg.events.onStateChange({ data: state }); }
      cueVideoById(a) { this.calls.push(['cue', a.videoId, a.startSeconds]); setTimeout(() => this.emit(5)); }
      loadVideoById(a) { this.calls.push(['load', a.videoId, a.startSeconds]); setTimeout(() => this.emit(1)); }
      unMute() { this.muted = false; }
      playVideo() { this.calls.push(['play']); this.emit(1); }
      pauseVideo() { this.calls.push(['pause']); this.emit(2); }
      stopVideo() { this.calls.push(['stop']); this.emit(5); }
      seekTo(t) { this.t = t; } setVolume(v) { this.vol = v; } mute() { this.muted = true; }
      getCurrentTime() { return this.t; } getDuration() { return 180; }
    },
  };
  win.eval(readFileSync(path.join(ROOT, 'js/youtube-player.js'), 'utf8'));
  return { win, players };
}

test('carrega engatilhado (pausado), toca, pausa e termina uma vez só', async () => {
  const { win, players } = setup();
  const ev = { play: 0, pause: 0, ended: 0 };
  const p = win.createYouTubePlayer(win.document.getElementById('host'), {
    onPlay: () => ev.play++, onPause: () => ev.pause++, onEnded: () => ev.ended++,
  });
  await p.load('abc');
  const yt = players[0];
  assert.deepEqual(yt.calls[0], ['cue', 'abc', 0]);
  assert.equal(p.isPlaying(), false);
  p.play(); assert.equal(p.isPlaying(), true);
  p.pause(); assert.equal(ev.pause, 1);
  p.play(); yt.emit(0); yt.emit(0); // "ended" repetido
  assert.equal(ev.ended, 1);
  assert.equal(ev.play, 2);
});

test('stop (troca de música) nunca dispara onEnded', async () => {
  const { win, players } = setup();
  let ended = 0;
  const p = win.createYouTubePlayer(win.document.getElementById('host'), { onEnded: () => ended++ });
  await p.load('abc');
  p.play(); p.stop(); players[0].emit(0);
  assert.equal(ended, 0);
  assert.equal(p.isPlaying(), false);
});

test('segunda tela: player mudo', async () => {
  const { win, players } = setup();
  const p = win.createYouTubePlayer(win.document.getElementById('host'), { muted: true });
  await p.load('abc');
  assert.equal(players[0].muted, true);
});
