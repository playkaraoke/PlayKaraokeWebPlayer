/** Recursos da 3.0: voltar ao início, limpar fila, atalhos, pads, tema, picker de cantor. */
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, fakeFile, flush, closeAllApps } from './helpers/app-harness.mjs';

afterEach(closeAllApps);

const key = (win, init) => win.dispatchEvent(new win.KeyboardEvent('keydown', { bubbles: true, ...init }));

test('sem tela de senha: o app abre direto', async () => {
  const { $ } = await createApp();
  assert.equal($('auth-overlay'), null);
  assert.equal($('play-btn').disabled, true);
});

test('Voltar ao início: volta pro 0 e toca', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]);
  await flush();
  assert.equal($('restart-btn').disabled, false);
  await t.engine.play();
  t.engine.seekTo(95);
  t.engine.pause();
  $('restart-btn').click();
  await flush();
  assert.equal(t.engine.getCurrentTime(), 0);
  assert.equal(t.engine.isPlaying(), true);
});

test('Limpar fila: pede confirmação e esvazia tudo', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip'), fakeFile(win, 'B - Dois.zip')]);
  await flush();
  $('clear-queue-btn').click();
  await flush();
  assert.equal($('generic-confirm-backdrop').classList.contains('hidden'), false);
  $('generic-confirm-ok-btn').click();
  await flush();
  assert.equal(t.playlist.length, 0);
  assert.equal(t.mode, null);
  assert.equal($('clear-queue-btn').disabled, true);
});

test('música que termina sai da fila e a próxima fica carregada', async () => {
  const { win, t } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip'), fakeFile(win, 'B - Dois.zip')]);
  await flush();
  await t.engine.play();
  t.engine.finish();
  await flush();
  assert.equal(t.playlist.length, 1);
  assert.equal(t.playlist[0].title, 'Dois');
  assert.equal(t.engine.isPlaying(), false);
});

test('atalhos vêm desligados; ligados, Ctrl+↑ sobe o tom e 1–6 disparam os pads', async () => {
  const { win, t, $ } = await createApp();
  await t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]);
  await flush();
  key(win, { code: 'Space' });
  await flush();
  assert.equal(t.engine.isPlaying(), false, 'Espaço funcionou com atalhos desligados');

  $('shortcuts-toggle-indicator').click();
  assert.equal(win.localStorage.getItem('playkaraoke-shortcuts'), 'true');
  key(win, { code: 'ArrowUp', ctrlKey: true });
  assert.equal($('pitch-value').textContent, '+1');
  key(win, { code: 'Digit0', metaKey: true });
  assert.equal($('pitch-value').textContent, '0');

  let played = 0;
  win.HTMLMediaElement.prototype.play = function () { played++; return Promise.resolve(); };
  key(win, { code: 'Digit1' });
  assert.equal(played, 1);
  assert.equal($('pads-grid').children[0].classList.contains('fire'), true);
});

test('atalhos não valem digitando na busca', async () => {
  const { win, $ } = await createApp({ localStorage: { 'playkaraoke-shortcuts': 'true' } });
  $('search-input').focus();
  key(win, { code: 'ArrowUp', ctrlKey: true });
  assert.equal($('pitch-value').textContent, '0');
});

test('pads: 5 sons do app + 1 vazio; nomes traduzidos', async () => {
  const { win, $ } = await createApp();
  const pads = Array.from($('pads-grid').children);
  assert.equal(pads.length, 6);
  assert.match(pads[0].textContent, /Short applause/);
  assert.equal(pads[5].classList.contains('empty'), true);
  win.i18n.setLanguage('pt');
  assert.match($('pads-grid').children[3].textContent, /Rufar de tambores/);
  assert.equal($('pads-settings-list').children.length, 6);
});

test('tema claro fica salvo; ajuda abre no idioma e tema certos', async () => {
  const { win, $ } = await createApp();
  win.document.querySelector('#theme-seg [data-theme="light"]').click();
  assert.equal(win.document.documentElement.dataset.theme, 'light');
  assert.equal(win.localStorage.getItem('playkaraoke-theme'), 'light');
  win.document.querySelector('#language-seg [data-lang="pt"]').click();
  assert.match($('help-link').getAttribute('href'), /help\.html\?lang=pt&theme=light/);
});

test('Configurações: navegação entre seções', async () => {
  const { win, $ } = await createApp();
  $('settings-btn').click();
  assert.equal($('settings-modal-backdrop').classList.contains('hidden'), false);
  win.document.querySelector('#settings-nav [data-sec="pads"]').click();
  assert.equal(win.document.querySelector('.s-sec[data-sec="pads"]').classList.contains('on'), true);
  assert.equal(win.document.querySelector('.s-sec[data-sec="general"]').classList.contains('on'), false);
  assert.equal($('settings-title').textContent, 'Pads');
});

test('Modo Show: tela de espera com as 3 opções ligadas por padrão', async () => {
  const { $ } = await createApp();
  for (const id of ['cd-show-upcoming', 'cd-show-titles', 'cd-show-counter']) {
    assert.equal($(id + '-toggle').checked, true, id);
    assert.equal($(id + '-indicator').classList.contains('on'), true, id);
  }
});

test('picker de cantor: ordem alfabética, filtra, cantor cheio desativado, "+ novo" no lugar certo', async () => {
  const { win, t, $ } = await createApp({ localStorage: { 'playkaraoke-hide-show-welcome': 'true' } });
  t.actuallyEnableSingerMode(); await flush();
  const sm = t.singerManager;
  sm.addSinger('Zeca'); sm.addSinger('Ana'); sm.addSinger('Bruno');
  const zeca = sm.getAllSingers().find(s => s.name === 'Zeca');
  for (let i = 0; i < sm.MAX_SONGS_PER_SINGER; i++) sm.addSongToSinger(zeca.id, false, { id: 'z' + i, title: 'S' + i, type: 'cdg', format: 'MP3+G', file: fakeFile(win, 'Z - S' + i + '.zip') });

  const addP = t.addFilesToQueue([fakeFile(win, 'A - Um.zip')]);
  await flush();
  const names = () => Array.from($('singer-picker-list').querySelectorAll('.opt .nm')).map(n => n.textContent);
  assert.deepEqual(names(), ['Ana', 'Bruno', 'Zeca']);
  assert.equal($('singer-picker-list').querySelector('.opt.full .nm').textContent, 'Zeca');

  const type = (v) => { $('singer-picker-input').value = v; $('singer-picker-input').dispatchEvent(new win.Event('input')); };
  type('an');
  assert.deepEqual(names(), ['Ana', 'Add “an” as a new singer']);
  assert.equal($('singer-picker-list').querySelector('.opt.hi .nm').textContent, 'Ana');
  type('Carla');
  assert.deepEqual(names(), ['Add “Carla” as a new singer']);
  $('singer-picker-input').dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter' }));
  await addP; await flush();
  const carla = sm.getAllSingers().find(s => s.name === 'Carla');
  assert.ok(carla, 'Carla não foi criada');
  assert.equal(carla.songs[0].title, 'Um');
});

test('Modo Show: lista vira rodízio, rodapé troca pros botões de cantor e o cantor aparece nos dados', async () => {
  const { win, t, $ } = await createApp({ localStorage: { 'playkaraoke-hide-show-welcome': 'true' } });
  t.actuallyEnableSingerMode(); await flush();
  assert.equal($('clear-queue-btn').classList.contains('hidden'), true);
  assert.equal($('add-singer-btn').classList.contains('hidden'), false);
  t.singerManager.addSinger('Ana');
  t.singerManager.addSongToSinger(t.singerManager.getAllSingers()[0].id, false, { id: 'x1', title: 'Um', artist: 'A', type: 'cdg', format: 'MP3+G', file: fakeFile(win, 'A - Um.zip') });
  await flush();
  assert.match($('playlist-count').textContent, /Singer rotation/);
  assert.equal($('meta-singer').textContent, 'Ana');
  assert.equal($('meta-singer-field').classList.contains('hidden'), false);
  assert.match($('next-btn').title, /^Skip/, 'antes de começar: pular a vez');
  assert.equal($('next-btn').disabled, true, 'só 1 cantor: nada pra pular');
  await t.engine.play();
  assert.equal($('next-btn').title, 'End performance (next singer)');
});

test('sem desfoque de vidro (backdrop-filter) nas telas do player — travava computadores antigos', async () => {
  const { readFileSync } = await import('node:fs');
  for (const f of ['index.html', 'second-screen.html']) {
    const css = readFileSync(new URL('../' + f, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.equal(/backdrop-filter\s*:/.test(css), false, f + ' voltou a usar backdrop-filter');
  }
});
