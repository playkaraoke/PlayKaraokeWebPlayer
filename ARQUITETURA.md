# Play Karaoke — Documentação Técnica (ARQUITETURA.md)

> Documento voltado pra outra IA/desenvolvedor entender a arquitetura,
> estruturas de dados e APIs internas sem precisar ler o histórico
> conversacional do projeto. Pra contexto de decisões de produto e
> histórico de "por que isso foi feito assim", ver `DOCUMENTACAO.md`.

---

## 1. Visão geral

**O que é**: player de karaokê web (formatos CDG+MP3 e MP4), com fila de
reprodução, sincronização com uma segunda tela (telão), e um modo
opcional de "rodada de cantores" com rotação circular, painel
administrativo e relatório de sessão exportável em CSV.

**Stack**: HTML/CSS/JS puro (sem framework, sem build step, sem bundler).
Nenhuma dependência de runtime além das APIs nativas do navegador —
`AudioContext`/`AudioWorklet`, `Canvas2D`, `BroadcastChannel`, `File
System Access API` (opcional), `Web Worker`.

**Hospedagem**: GitHub Pages — **site 100% estático**, sem servidor, sem
banco de dados, sem backend de nenhum tipo. Isso é uma restrição
arquitetural deliberada (não uma limitação temporária) — toda
persistência é `localStorage`/`sessionStorage` do navegador do usuário,
e nada é compartilhado entre dispositivos/usuários diferentes.

**URL de produção**: `https://playkaraoke.github.io/PlayKaraokeWebPlayer/`

---

## 2. Estrutura de arquivos

```
index.html               → shell da tela principal: todo o CSS inline (<style>),
                            todo o HTML dos componentes, e 2 <script> extras no
                            final (autenticação, e o slider de seek bar)
second-screen.html        → shell da janela do telão (segunda tela)
assets/
  logo.svg
  aplausos.mp3
  ambient/*.mp3            → 5 faixas de música ambiente, 96kbps
js/
  app.js                  → ~2760 linhas. TODO o estado e lógica da tela
                            principal. Não é um módulo ES importável por
                            outros arquivos — roda como <script type="module">
                            solto, mas expõe algumas funções em window
                            (ver seção 9).
  audio-engine.js          → export { AudioEngine }. Motor de áudio (worklet
                            de pitch shift + fallback), importado via
                            `import { AudioEngine } from './audio-engine.js'`
                            dentro de app.js.
  cdg-player.js             → window.CDGPlayer (classe, script solto).
                            Parser + renderizador do formato binário .cdg.
  file-loader.js            → window.loadKaraokeFile, window.parseKaraokeFilename
                            (script solto). Extrai .zip (MP3+G) ou valida .mp4.
  library.js                → window.createLibrary() (script solto). Indexação
                            de pastas locais via File System Access API.
  singers.js                → window.createSingerManager() (script solto).
  i18n.js                   → window.i18n (script solto, carregado antes de
                            todos os outros). Dicionário de traduções
                            EN/PT + t()/setLanguage()/applyTranslations().
                            Toda a lógica de dados da rodada de cantores.
  second-screen.js          → roda dentro de second-screen.html. Recebe
                            mensagens via BroadcastChannel e renderiza.
  pitch-worklet-processor.js → AudioWorkletProcessor customizado (roda numa
                            thread de áudio separada, carregado via
                            audioContext.audioWorklet.addModule()).
  tick-worker.js             → Web Worker com setInterval — cronômetro
                            imune ao throttling de aba em 2º plano do Chrome.
```

**Ordem de carregamento dos `<script>` em `index.html`** (importa — os
scripts "soltos" precisam vir antes de `app.js`, que assume que
`window.CDGPlayer`, `window.loadKaraokeFile`, `window.createLibrary` e
`window.createSingerManager` já existem):

```html
<script src="js/cdg-player.js"></script>
<script src="js/file-loader.js"></script>
<script src="js/library.js"></script>
<script src="js/singers.js"></script>
<script type="module" src="js/app.js"></script>
<!-- depois: script de autenticação, depois: script do seek bar -->
```

---

## 3. Modelo de dados

### 3.1 Item de playlist (usado tanto na fila simples quanto dentro da
fila de espera de um cantor)

```js
{
  id: string,              // 'track_' + contador incremental (playlistIdCounter)
  file: File | null,       // objeto File nativo, ou null até resolver (ver 3.4)
  code: string | null,     // ex: "EJBg-0020" — extraído do nome do arquivo
  artist: string | null,
  title: string,
  format: 'MP3+G' | 'MP4',
  type: 'cdg' | 'video',
  savedSemitones: number,  // tom pré-configurado (0 = original)
  librarySource: { folderId, fileName } | undefined, // só se veio da Biblioteca
}
```

### 3.2 Cantor (singers.js)

```js
{
  id: string,               // 'singer_' + contador
  name: string,
  songs: [ ...ItemDePlaylist ],  // fila de espera, MÁX 5 (MAX_SONGS_PER_SINGER)
  history: [
    { code, artist, title, semitone, timestamp }  // músicas já cantadas na sessão
  ],
}
```

Não existe mais campo de "pausado" — removido deliberadamente (ver
`DOCUMENTACAO.md`, decisão explícita do usuário).

### 3.3 Registro de histórico do show (feature "Encerrar Show")

```js
{ horario: number (epoch ms), cantor: string, musica: string, artista: string, codigo: string, tom: number, duracao: number }
```

Array plano `showHistory` em `app.js`, **paralelo** ao histórico
por-cantor em `singers.js` (dados duplicados de propósito — o de
`singers.js` é por cantor pra exibição na aba "Músicas Cantadas"; o
`showHistory` é a fonte pro relatório agregado + CSV).

### 3.4 Item de índice da Biblioteca (library.js)

```js
{
  folderId: string, folderName: string, name: string,       // nome do arquivo
  code, artist, title, format, type,
  handle: FileSystemFileHandle,  // referência viva ao arquivo em disco
}
```

**Importante**: `handle.getFile()` é chamado sob demanda pra obter um
`File` de verdade — o índice em si não guarda o conteúdo do arquivo, só
metadados + a referência. Isso é o que permite a fila sobreviver a um
F5 pra itens vindos da Biblioteca (ver seção 6).

---

## 4. Módulos e suas APIs públicas

### 4.1 `AudioEngine` (audio-engine.js) — `export class AudioEngine extends EventTarget`

Dois backends internos, escolhidos automaticamente (worklet é o padrão,
cai pro script-processor se o worklet falhar ao carregar):

| Backend | Mecanismo | Pitch shift em vídeo? |
|---|---|---|
| `worklet` (padrão) | `AudioWorkletNode` customizado (linha de delay), roda em thread separada | Sim, via `attachVideoElement()` |
| `scriptprocessor` (fallback) | soundtouchjs, thread principal | Não |

**Métodos principais**:
- `async loadArrayBuffer(buffer)` — carrega um novo áudio (chama
  `stop()` internamente primeiro)
- `async play()` / `pause()` / `stop()` / `toggle()`
- `seekTo(sec)`
- `setPitchSemitones(n)` / `getPitchSemitones()`
- `setVolume(0-1)` / `getVolume()`
- `getCurrentTime()` / `getDuration()` / `isPlaying()`
- `onTimeUpdate(callback)` — registra callback chamado a cada tick
  (~60x/s, via `tick-worker.js`)
- `attachVideoElement(videoEl)` — roteia o áudio de um `<video>` pelo
  mesmo pitch shifter (só funciona no backend worklet)
- `async ensureVideoPitchSupport()` — verifica se o pitch em vídeo vai
  funcionar antes de tentar rotear
- `getAnalyser()` — expõe um `AnalyserNode` (usado pra detecção de
  silêncio nos aplausos)

**Eventos disparados** (via `EventTarget`, `addEventListener`):
`'ended'`, `'play'`, `'pause'`.

**Rede de segurança importante**: o loop de tick (`_startTicking`)
verifica a cada frame se `currentTime >= duration - 0.05` e, se sim,
força o disparo de `'ended'` manualmente — o evento nativo `onended` de
`AudioBufferSourceNode` tem relatos conhecidos de não disparar de forma
100% confiável no Chrome em casos raros. Sem essa rede de segurança, a
música "trava" no final sem avançar.

### 4.2 `CDGPlayer` (cdg-player.js) — `window.CDGPlayer` (classe)

Parser + renderizador do formato binário `.cdg` (300 pacotes/segundo,
canvas 300×216, renderização por *dirty tiles* — só redesenha os blocos
6×12 que mudaram por frame).

- `constructor(canvasEl)`
- `load(arrayBuffer)` — parseia todos os pacotes de uma vez, guarda em
  memória
- `update(currentTimeSec)` — chamado a cada tick, avança o estado até o
  tempo dado
- `reset()` / `clearScreen()`
- `setCustomColors({ background, text, highlight })` — sobrescreve a
  paleta padrão do CDG
- `setRenderMode('smooth')` — só existe o modo suave (o modo "nítido"
  foi removido por decisão de produto)

### 4.3 `loadKaraokeFile` / `parseKaraokeFilename` (file-loader.js) —
`window.loadKaraokeFile`, `window.parseKaraokeFilename`

```js
async function loadKaraokeFile(file) → 
  { type: 'cdg', cdgBuffer, audioBuffer, title }
  | { type: 'video', videoBlobUrl, title }
```

- Detecta `.zip` vs `.mp4` pela extensão do nome do arquivo.
- Pra `.zip`: usa JSZip (carregado via CDN, ver `<head>` do
  `index.html`) pra extrair o `.cdg` e o áudio (`.mp3`/`.wav`) de dentro.
  **Lança `Error('O ZIP precisa conter um arquivo .cdg e um arquivo de
  áudio (.mp3/.wav).')`** se não achar os dois.
- `parseKaraokeFilename(name)` — extrai `{ code, artist, title }` do
  padrão `Código - Artista - Título.ext` (código é opcional).

### 4.4 `createLibrary()` (library.js) — `window.createLibrary({ onFoldersChange, onIndexChange, onError })`

Indexação de pastas locais via **File System Access API** (só
Chrome/Edge/Opera — `isSupported()` retorna `false` no Safari/Firefox).

API pública: `connectNewFolder()`, `reconnectFolder(id)`,
`removeFolder(id)`, `restoreSavedFolders()`, `search(query)`,
`getFileForItem(item)`, `getConnectedFolders()`, `getIndexSize()`,
`findByFolderAndName(folderId, name)`.

- Permissões de pasta persistidas em **IndexedDB** (não localStorage —
  `FileSystemDirectoryHandle` não é serializável em JSON, mas IndexedDB
  suporta clonar esses objetos estruturalmente).
- `search(query)`: busca por **múltiplas palavras** (AND, qualquer
  ordem) e **ignora acentos** (`String.normalize('NFD')` + regex pra
  descartar diacríticos, aplicado nos dois lados da comparação).
- Escaneamento é recursivo e só cataloga nomes de arquivo (`.zip`/`.mp4`)
  — nunca lê conteúdo de áudio, por isso é rápido mesmo em pastas de
  2TB+.

### 4.5 `createSingerManager()` (singers.js) — `window.createSingerManager({ onChange })`

Só lógica de dados/rotação — não sabe nada sobre áudio ou UI.

API pública: `addSinger(name)`, `renameSinger(id, newName)`,
`removeSinger(id)`, `reorderSinger(fromIdx, toIdx)`,
`addSongToSinger(singerIdOrNewName, isNew, song)`,
`removeSongFromSinger(singerId, songIdx)`,
`reorderSongInSinger(singerId, fromIdx, toIdx)`, `getCurrentSinger()`,
`consumeCurrentSongAndAdvance(playedInfo)`, `getUpcomingSingers(count)`,
`getNextActiveSingerId(afterId)`, `getAllSingers()`, `nameExists(name,
excludeId?)`, `serialize()`, `restore(snapshot)`, `reset()`,
`MAX_SONGS_PER_SINGER` (constante = 5).

**Regra de rotação**: circular simples, `(idx + 1) % length` a partir do
`currentSingerId` — sem filtro de pausa (removido). Cantor novo sempre
entra no **final** do array (`singers.push`). A "vez" é rastreada por
**id**, não por índice — isso é proposital, pra sobreviver a reordenação
(mover um cantor de posição não deveria mudar de quem é a vez).

---

## 5. `app.js` — arquitetura interna

### 5.1 Dois modos, uma variável (`singerModeEnabled: boolean`)

**Truque central da arquitetura**: em modo cantores, a variável
`playlist` (a mesma usada no modo simples) é sempre sobrescrita pra ter
**só 1 item** — a música do topo da fila do cantor da vez:

```js
playlist = [song];
currentIndex = -1;
await selectTrack(0, { autoplay, initialSemitones: song.savedSemitones || 0 });
```

Isso significa que **toda a lógica de carregar/tocar/pitch** (função
`selectTrack`, ver 5.2) é **idêntica** nos dois modos — só a decisão de
"qual é a próxima música" diverge:

| | Modo simples | Modo cantores |
|---|---|---|
| Fonte da "próxima" | `playlist[currentIndex + 1]` | `singerManager.getCurrentSinger().songs[0]`, após `consumeCurrentSongAndAdvance()` |
| Fila renderizada em | `#playlist` (lista plana) | `#singer-round-view` → `#singer-list-full` (1 linha por cantor) |
| Countdown ao terminar | `startAutoplayCountdownIfNeeded()` | `handleSingerModeSongEnded()` → `startSingerCountdown()` |
| Dispatcher unificado | `handleTrackEnded()` decide qual dos dois acima chamar, baseado em `singerModeEnabled` |

### 5.2 `selectTrack(index, { autoplay, initialSemitones })`

Função central de carregamento — usada pelos dois modos. Pontos
importantes:

- **Proteção contra chamadas sobrepostas**: usa um contador de gerações
  (`selectTrackGeneration`). Cada chamada incrementa o contador e
  verifica, em cada ponto de `await`, se ainda é a "atual"
  (`isCurrent()`) — se uma chamada mais nova já assumiu, a antiga aborta
  silenciosamente (não atualiza UI, não toca nada). **Isso corrige um
  bug real**: cliques rápidos ou o autoplay avançando mais rápido que o
  carregamento anterior causavam carregamentos concorrentes que
  travavam o player.
- **`isTrackLoading`** (setado por `showLoading(show)`): enquanto `true`,
  os botões `play-btn`, `stop-btn` e `cd-skip-btn` ficam
  `disabled = true`. Isso existe porque o botão "Iniciar Agora" (sempre
  visível na tela de espera em modo cantores) podia ser clicado
  **durante o próprio carregamento**, disparando um segundo
  carregamento por cima do primeiro — mesma classe de bug do item
  acima, gatilho diferente.
- Ao terminar (sucesso ou erro), os botões voltam a ficar habilitados —
  importante não deixar travado num erro de carregamento.

### 5.3 `handleTrackEnded()` — dispatcher unificado do fim de música

```js
let handlingTrackEnded = false;
function handleTrackEnded() {
  if (handlingTrackEnded) return;      // debounce de 800ms
  handlingTrackEnded = true;
  setTimeout(() => { handlingTrackEnded = false; }, 800);
  if (singerModeEnabled) handleSingerModeSongEnded();
  else startAutoplayCountdownIfNeeded();
}
```

Chamado pelos listeners de `'ended'` de `engine` E de `videoEl`
(módulo/video têm listeners separados, mas convergem nesse dispatcher).
**O debounce existe porque o evento `'ended'` pode disparar mais de uma
vez pra mesma música** (rede de segurança do `audio-engine.js` + evento
nativo do navegador quase simultâneos) — sem essa proteção, a rodada de
cantores avançava **duas posições de uma vez**, "pulando" um cantor.

### 5.4 Countdown / tela de espera

Dois modos de exibição no mesmo `#countdown-overlay`:

- **Modo simples**: `#countdown-timer-parts` (rótulo + número +
  `#cd-next-title`) — visível só durante a contagem cronometrada.
- **Modo cantores**: adicionalmente mostra `#cd-singer-highlight` (card
  branco com nome + música do cantor da vez) e `#cd-upcoming-section`
  (lista dos próximos 3, com badges de **posição real** — ver nota
  abaixo). **Diferença importante**: em modo cantores, esse card fica
  **sempre visível quando ocioso** (não só durante o timer cronometrado)
  — controlado pela flag `singerCountdownActive`, não por
  `countdownTimerId`. As partes específicas do timer (`#countdown-timer-parts`
  e o botão `#cd-skip-btn`) só aparecem quando `singerCountdownActive === true`.

**Posição real vs posição relativa**: existe uma função `getSingerPosition(singerId)`
que retorna o **índice real** do cantor no array completo
(`singerManager.getAllSingers().findIndex(...) + 1`), usada em toda
exibição de posição (sidebar, countdown, segunda tela). **Nunca** use
`i + 1` de um `.map()`/`.forEach()` sobre uma lista de "próximos" pra
mostrar posição — isso foi um bug real já corrigido (mostrava sempre
"#1" pro cantor da vez, independente da posição real dele na lista).

**Toggles de personalização** (`#cd-show-upcoming-toggle`,
`#cd-show-titles-toggle`, `#cd-show-counter-toggle`, persistidos em
`playkaraoke-countdown-settings-v1`) controlam o que aparece nesse card
— tanto na tela principal quanto replicado pra segunda tela via
broadcast (campo `display: {...}` na mensagem `countdown-start`).

### 5.5 Modal "Gerenciar Cantores"

2 colunas: `#manage-singers-list` (esquerda, lista completa com
reordenar/editar-nome/excluir) e `#manage-singers-detail` (direita,
2 abas — `Fila de Espera` com reordenar/tom/excluir por música + busca
da Biblioteca **embutida** (não fecha o modal), e `Músicas Cantadas`
somente-leitura).

### 5.6 Persistência (localStorage) — visão geral

| Chave | Conteúdo | Sobrevive a F5? |
|---|---|---|
| `playkaraoke-playlist-v1` | Fila simples (metadados, sem File) | Só itens da Biblioteca (via `librarySource` + re-fetch do handle) |
| `playkaraoke-singers-v1` | Cantores + fila de espera + histórico + `enabled` (modo ligado?) | Mesma regra acima, por música |
| `playkaraoke-show-history-v1` | Array `showHistory` completo | Sim (JSON puro, sem File) |
| `playkaraoke-countdown-settings-v1` | 3 toggles de personalização da tela de espera | Sim |
| `playkaraoke-sidebar-width` | Largura da sidebar (arrastável) | Sim |
| `playkaraoke-session-start` (localStorage, setado no script de auth) | Timestamp do login — usado pro cálculo de duração do show | Sim (só reseta com "Iniciar Novo Show" ou logout de verdade) |
| `playkaraoke_auth` (**sessionStorage**, não localStorage) | Flag de sessão autenticada | Não (fecha o navegador, perde) |

**Limitação conhecida e aceita**: `File`/`Blob` não são serializáveis em
JSON. Músicas adicionadas manualmente (upload/drag, sem
`librarySource`) **não sobrevivem a um F5** — só as que vieram da
Biblioteca (que guardam `{folderId, fileName}` e re-resolvem o `File`
via `library.findByFolderAndName()` + `getFileForItem()` na
restauração).

---

## 6. Autenticação

Script solto no final do `index.html` (fora de `app.js`, roda antes
dele carregar visualmente por trás do overlay `#auth-overlay`).

- Senhas válidas: array `ACCESS_HASHES` de hashes **SHA-256** (nunca
  senha em texto puro no código). Múltiplas senhas são suportadas — o
  login aceita qualquer uma que bater.
- `sessionStorage.playkaraoke_auth = 'true'` — dura só a sessão do
  navegador (fecha tudo, perde).
- `localStorage.playkaraoke-session-start` — timestamp setado no
  login bem-sucedido, usado pra calcular a duração do show no relatório
  final. Só é resetado se ainda não existir (proteção contra F5 resetar
  o timer no meio de um show).
- **Isso não é segurança real** — é só um filtro casual client-side.
  Qualquer pessoa com acesso ao DevTools consegue contornar. Documentado
  e aceito como trade-off consciente (site 100% estático, sem servidor
  pra validar de verdade).

---

## 7. Sincronização com a segunda tela

`BroadcastChannel('playkaraoke-second-screen')` — comunicação
unidirecional (principal → segunda tela), same-origin apenas (não
funciona entre domínios/dispositivos diferentes).

**Mensagens** (campo `type`): `'init-cdg'` (cdgBuffer + cores + meta),
`'init-video'` (videoUrl + meta), `'time'` (sincronização de posição,
throttled), `'colors'`, `'idle-image'`, `'countdown-start'` (com campos
extras `singerMode`, `singer`, `upcoming`, `display`, `timerless` quando
aplicável), `'countdown-tick'`, `'countdown-end'`, `'playing'` / `'idle'`,
`'clear'`.

A segunda tela também manda `'ready'` de volta ao abrir, sinalizando pra
`app.js` reenviar o estado completo atual (útil se a janela foi
reaberta/recarregada no meio de uma música).

---

## 8. Testes

**Não existe suíte de testes persistida no repositório** — os testes
são escritos ad-hoc durante o desenvolvimento (jsdom + Node, simulando
DOM e stubando `AudioEngine`/`fetch`/APIs do navegador), rodados, e
**deletados depois de confirmar que passam**. Se for adicionar uma
feature nova, vale recriar esse padrão: montar um `JSDOM` a partir do
`index.html` real, stubar `window.CDGPlayer`, `BroadcastChannel`,
`HTMLMediaElement`, carregar `app.js` via `import()` (com o import de
`audio-engine.js` trocado por um stub), e simular eventos de UI via
`dispatchEvent`.

---

## 9. O que fica exposto em `window` (superfície de integração)

Como `app.js` não é importado por nenhum outro módulo (é o script
principal), praticamente todo o seu estado é **privado ao módulo**
(closures de nível de arquivo). Isso inclui `playlist`, `singerManager`,
`showHistory`, `selectTrack`, etc. — **não acessíveis de fora, nem via
console do navegador**, exceto o que os módulos auxiliares
deliberadamente expõem em `window`:

- `window.CDGPlayer`, `window.loadKaraokeFile`,
  `window.parseKaraokeFilename`, `window.createLibrary`,
  `window.createSingerManager` — usados por `app.js` na inicialização.

Pra debug/teste, normalmente é necessário expor manualmente o que
precisar (ex: `window.__debugSingerManager = singerManager` temporário)
ou testar via simulação de eventos de DOM, não acesso direto de estado.

---

## 10. Limitações arquiteturais conhecidas (não são bugs, são a natureza do projeto)

1. **Sem sincronização entre dispositivos/usuários** — tudo é
   `localStorage` local ao navegador. Um show rodando no laptop do
   operador não é visível de nenhum outro dispositivo.
2. **Sem autenticação real** — ver seção 6.
3. **Sem persistência de arquivos manuais entre sessões** — ver seção
   5.6.
4. **File System Access API só funciona em navegadores Chromium** — a
   Biblioteca fica indisponível (com aviso) no Safari/Firefox.
5. **`AudioBufferSourceNode.onended` não é 100% confiável no Chrome** —
   mitigado com rede de segurança, mas é uma característica da
   plataforma, não algo que dá pra "consertar" de vez.
