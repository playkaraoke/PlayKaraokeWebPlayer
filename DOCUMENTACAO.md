# Play Karaoke — Documentação do Projeto (v1.2 — Biblioteca)

> Este documento existe pra você (ou qualquer IA/desenvolvedor) conseguir
> entender o projeto do zero e continuar de onde paramos, sem precisar
> reconstruir o contexto do zero. Cole isso no início de uma conversa nova
> sempre que quiser seguir trabalhando nesse projeto.

## O que é isso

Um **player de karaokê web** (roda 100% no navegador, sem servidor/backend)
que lê arquivos no formato **CDG** (MP3+G — o padrão clássico de karaokê,
com letras em pixels sincronizadas a um MP3) e também vídeos **MP4** com
letra já embutida. Além do player, tem uma fila de músicas, autoplay,
ajuste de tom, música ambiente, aplausos automáticos, uma "segunda tela"
pra jogar a letra num monitor separado (voltado pro cantor), e uma tela
de senha simples pra restringir o acesso.

É um app **estático** — HTML/CSS/JS puro, sem build step, sem npm/webpack,
sem backend. Isso foi proposital: roda local no Mac/Windows/Linux, e
também já está publicado como site estático no **GitHub Pages**:
`https://playkaraoke.github.io/PlayKaraokeWebPlayer/`

## Como rodar

O app usa ES Modules no JavaScript, então **não abre com duplo clique**
(o navegador bloqueia isso por segurança quando é `file://`). Precisa de
um servidor local bem simples:

**Mac:**
```
cd caminho/para/karaoke-engine
python3 -m http.server 8000
```

**Windows:**
```
cd caminho\para\karaoke-engine
python -m http.server 8000
```
(se não tiver Python, baixa em python.org e marca "Add to PATH" na instalação)

Depois abre **http://localhost:8000** no navegador. Pra parar o servidor,
`Ctrl+C` no terminal.

Testado principalmente em Chrome. Deve funcionar em outros navegadores
modernos, mas o motor de áudio (thread separada) tem um plano de fallback
automático caso algo não seja suportado — ver seção "Motor de áudio" abaixo.

---

## Estrutura de arquivos

```
karaoke-engine/
├── index.html                  → página principal do player
├── second-screen.html          → página da "segunda tela" (janela separada)
├── LEIA-ME.md                  → guia rápido de uso (menos técnico que este arquivo)
├── assets/
│   ├── logo.svg                 → logo "Play Karaoke"
│   ├── aplausos.mp3              → efeito de aplausos
│   └── ambient/                  → 5 faixas de música ambiente (mp3, ~96kbps)
│       ├── blues.mp3, afrobeat.mp3, jazz.mp3, reggae.mp3, pop.mp3
└── js/
    ├── cdg-player.js              → parser + renderizador do formato CDG
    ├── audio-engine.js            → motor de áudio (playback + pitch shift)
    ├── pitch-worklet-processor.js → o processador de pitch em si (AudioWorklet)
    ├── tick-worker.js             → cronômetro em Web Worker (imune a aba em 2º plano)
    ├── file-loader.js             → extrai .cdg/.mp3 do .zip + interpreta nome do arquivo
    ├── library.js                 → Biblioteca: indexa pastas locais, busca em tempo real
    ├── singers.js                 → Rodada de cantores: rotação circular, pausar/pular
    ├── second-screen.js           → lógica da janela da segunda tela
    └── app.js                     → cola tudo junto: UI, fila, autoplay, ambiente, aplausos
```

Não há `package.json`, não há dependências instaladas localmente. As
únicas bibliotecas de terceiros usadas são carregadas via CDN direto no
`<script>` do HTML:
- **JSZip** (`jszip@3.10.1`) — pra ler os arquivos `.zip` dos packs de karaokê
- **soundtouchjs** (`soundtouchjs@0.3.0`) — só como fallback do motor de
  áudio antigo (ver seção "Motor de áudio")

---

## Tela de senha (autenticação simples)

Existe um overlay de senha (`#auth-overlay`) que cobre a tela inteira até
o usuário digitar a senha certa. Fica salvo no `sessionStorage` do
navegador, então não pede de novo enquanto a aba continuar aberta (mas
pede de novo se fechar e abrir uma aba nova).

**Como funciona**: a senha digitada é transformada num hash SHA-256 (via
`crypto.subtle.digest`, nativo do navegador) e comparada com um hash fixo
gravado no próprio HTML. Senha atual: `plkplayer` (hash:
`f29d9bd92cffddbdfd51487bcf98b0f84eba168f86530fcbb40086d7ce7ebe53` —
conferido e validado).

**⚠️ Isso NÃO é segurança de verdade — é só um filtro leve.** Como é tudo
client-side (sem servidor), qualquer pessoa com um mínimo de conhecimento
técnico consegue:
- Ver o hash da senha direto no código-fonte da página
- Abrir o DevTools e simplesmente pular a checagem (ex: rodar
  `document.getElementById('auth-overlay').classList.add('unlocked')`
  no console)

Serve bem pro caso de uso real (não deixar qualquer um que ache o link
público mexer no console do operador), mas **nunca deve proteger nada
sensível de verdade**. Se algum dia precisar de segurança real, precisaria
de autenticação do lado do servidor (o que mudaria a arquitetura — deixaria
de ser um site 100% estático).

Pra trocar a senha: gera um novo hash SHA-256 da senha desejada (dá pra
fazer isso em qualquer terminal com Node:
`node -e "console.log(require('crypto').createHash('sha256').update('SUA_SENHA_AQUI').digest('hex'))"`)
e substitui o valor de `ACCESS_HASH` no script de autenticação, no final
do `index.html`.

---

## Versionamento (número de versão + Releases do GitHub)

O número da versão atual (ex: `v1.2 · Biblioteca`) aparece **visível no
rodapé da sidebar**, ao lado da engrenagem de configurações — assim
sempre dá pra saber o que está rodando sem precisar ir conferir no GitHub.

Pra atualizar: edita o texto direto no `index.html`, dentro de
`<span id="version-tag">`.

### Por que isso importa: nada nunca se perde

Cada `git commit` já é um "ponto de restauração" permanente — o Git guarda
isso pra sempre. Mas pra ficar mais fácil de achar "a versão boa" sem
precisar caçar entre commits, o GitHub tem os **Releases**:

1. Depois de fechar uma rodada grande de mudanças, cria uma Release no
   site do GitHub (aba "Releases" do repositório → "Draft a new release")
2. Dá um nome/tag (ex: `v1.2`), escreve uma descrição rápida do que mudou
3. O GitHub guarda esse "carimbo" permanentemente, com um zip baixável
   daquele estado exato do projeto
4. Se um dia precisar voltar: só baixar o zip daquela Release antiga e
   usar no lugar da versão atual

**Combinado**: a cada rodada de mudanças fechada (tipo essa da Biblioteca),
além do `git push` normal, também criar uma Release — leva uns 30 segundos
e vale muito a pena pra conseguir voltar no tempo com facilidade depois.

---

## Deploy (GitHub Pages)

O projeto está publicado em:
**https://playkaraoke.github.io/PlayKaraokeWebPlayer/**

Pra atualizar o site publicado depois de mudar algo localmente:

```bash
cd caminho/para/karaoke-engine
git add .
git commit -m "Atualização do player"
git push -u origin main
```

Como é GitHub Pages servindo arquivos estáticos, não tem passo de build —
o que está no repositório é exatamente o que fica no ar (leva alguns
minutos pra propagar depois do push).

### Onde o projeto está localmente (nesta máquina)

```
/Volumes/SSD2TB/Karaokes/Produtoras/PlayKaraoke/WebPlayer PlayKaraoke
```

Repara que o nome da pasta tem **espaço** (`WebPlayer PlayKaraoke`) — no
Terminal, sempre que for referenciar esse caminho, coloca entre aspas
(`"..."`), senão o Terminal interpreta como dois argumentos separados e
dá erro.

### Movendo a pasta do projeto pra outro lugar

O vínculo com o GitHub fica guardado **dentro da própria pasta**, numa
pastinha escondida chamada `.git` — não depende de onde a pasta está no
seu computador. Então dá pra mover ou renomear a pasta à vontade (pelo
Finder ou pelo Terminal) sem quebrar nada.

Pelo Terminal, o comando é `mv` (move/renomeia):

```bash
mkdir -p "/caminho/completo/da/pasta/destino"
mv /caminho/atual/da/pasta "/caminho/completo/da/pasta/destino/Nome Novo"
```

O `mkdir -p` garante que as pastas intermediárias existam antes (senão o
`mv` falha por não achar o destino).

**Se o destino for um SSD/HD externo**: o Terminal só consegue mexer nele
enquanto o disco estiver conectado — isso não é uma limitação do Git, é
só o disco precisar estar plugado mesmo.

### Confirmando que a conexão com o GitHub sobreviveu à mudança

Depois de mover, entra na pasta nova e roda:

```bash
cd "/caminho/completo/da/pasta/destino/Nome Novo"
pwd
ls
git status
git remote -v
```

O que cada linha deve mostrar se estiver tudo certo:
- `pwd` → o caminho novo, confirmando que você está na pasta certa
- `ls` → a lista de arquivos do projeto (`index.html`, `js/`, `assets/`, etc.) — se aparecer tudo, nada ficou pra trás
- `git status` → precisa aparecer `On branch main` (não pode aparecer
  `fatal: not a git repository`)
- `git remote -v` → precisa mostrar o link do GitHub
  (`https://github.com/playkaraoke/PlayKaraokeWebPlayer.git`), tanto pra
  `fetch` quanto pra `push`

Se todas essas saídas baterem, pode seguir usando `git add` / `commit` /
`push` normalmente a partir dessa pasta nova, sem precisar clonar de novo.

### Se der "fatal: not a git repository" (pasta sem vínculo nenhum)

Isso acontece quando os arquivos foram parar numa pasta que **nunca** foi
conectada ao Git pelo terminal (por exemplo, extraindo um zip direto numa
pasta nova, em vez de mover a pasta que já tinha o `.git`). Nesse caso,
não tem como "consertar" a pasta atual — o jeito mais seguro é clonar uma
cópia nova, já conectada, e trazer os arquivos mais recentes pra dentro
dela:

```bash
git clone https://github.com/playkaraoke/PlayKaraokeWebPlayer.git "pasta-nova-conectada"
```

Depois copia (ou arrasta pelo Finder) os arquivos atualizados pra dentro
dessa pasta recém-clonada, e segue com `git add` / `commit` / `push`
normalmente a partir dela.

---

## Formato CDG — o que é e como funciona

CDG (CD+Graphics) é um formato antigo (era usado em CDs físicos de
karaokê) que não guarda **texto** — guarda uma sequência de comandos que
desenham pixels diretamente numa tela virtual de **300×216 pixels**. Cada
"pack" de karaokê CDG normalmente vem como um `.zip` contendo:
- um arquivo `.cdg` (os comandos gráficos)
- um arquivo `.mp3` ou `.wav` (o áudio)

O `cdg-player.js` interpreta esses comandos: definição de paleta de cores
(16 cores), desenho de blocos de 6×12 pixels (é assim que a letra
"aparece"), scroll de tela, cor de borda, etc. Roda a 300 "pacotes" por
segundo (sincronizado com o áudio).

**Implicações importantes:**
- **Não dá pra trocar a fonte** — a letra já vem desenhada como pixels, não
  como texto. Só dá pra recolorir (a cor é separada da forma).
- **Resolução é sempre 300×216** — não tem como aumentar a "qualidade" de
  verdade, só suavizar o redimensionamento (o que já fazemos por padrão).
- Exploramos a ideia de um modo alternativo baseado em **letra + timestamp
  (tipo .lrc)**, que permitiria fonte/cor 100% livres já que seria texto
  de verdade renderizado do zero — decidimos **adiar isso** e focar em
  deixar o modo CDG redondo primeiro. Se um dia quiser retomar essa ideia,
  é um projeto novo/paralelo, não uma evolução do CDG.

### Otimizações de performance feitas no CDG player
- **Dirty-tile rendering**: só redesenha os blocos de pixel que realmente
  mudaram a cada frame, não a tela inteira (era o maior gargalo de
  fluidez no início do projeto).
- **Scroll otimizado**: usa operações nativas de `TypedArray` (memcpy) em
  vez de loop pixel-a-pixel.
- Suporte a **cores personalizadas**: o player rastreia automaticamente
  qual índice de cor é o "fundo" (via comando MEMORY_PRESET) e qual é o
  "texto dominante" (a cor não-fundo que cobre mais área da tela) —
  permite substituir essas cores por outras escolhidas pelo usuário, sem
  precisar entender a semântica exata de cada arquivo.

---

## Motor de áudio (`audio-engine.js`)

Dois "motores" de processamento de áudio, com fallback automático:

### 1. `worklet` (padrão)
Usa a API `AudioWorklet`, que roda o processamento de áudio numa **thread
separada** da que desenha a tela. Isso foi crucial pra fluidez — antes
disso, o processamento de áudio competia com o desenho da letra pela
mesma thread principal, causando engasgos visíveis.

O pitch shift nesse motor é um **processador escrito do zero**
(`pitch-worklet-processor.js`) usando a técnica clássica de "delay-line
com dois grãos cruzados" (também chamada de "Jungle pitch shift"): dois
pontos de leitura de um buffer circular, defasados entre si, com uma
janela triangular de crossfade escondendo os "pulos" que cada um dá ao
reiniciar seu ciclo. A matemática foi validada por testes automatizados
(gerando um seno de teste e conferindo se a frequência de saída bate com
o esperado pra vários semitons).

Optamos por escrever esse processador do zero depois de tentar usar uma
biblioteca de terceiros (`@soundtouchjs/audio-worklet`) que se mostrou
não-confiável (tinha uma dependência não-documentada que quebrava sem
aviso). Ter escrito na mão significa que entendemos exatamente como
funciona, mesmo que a qualidade sonora seja um pouco mais simples que a
de bibliotecas mais sofisticadas (pode soar um pouco mais "robótico" em
tons muito extremos, tipo ±12 semitons).

**Funciona tanto pra CDG quanto pra MP4**: o mesmo `pitchNode` é
reaproveitado — pro CDG, conectamos um `AudioBufferSourceNode` nele; pro
vídeo, conectamos a saída do `<video>` via `createMediaElementSource()`.
Isso significa que ajustar o tom funciona igual nos dois formatos.

### 2. `scriptprocessor` (fallback)
Motor mais antigo (`ScriptProcessorNode`, API deprecada mas ainda
suportada), usando a biblioteca `soundtouchjs`. Roda na thread principal
(por isso é só fallback, não o padrão) — usado automaticamente se o
navegador não suportar AudioWorklet, sem quebrar o app.

**Limitação conhecida**: nesse motor, o ajuste de tom **não funciona pra
vídeo MP4** (a biblioteca não foi feita pra aceitar uma fonte de áudio "ao
vivo" como um elemento `<video>`, só buffers decodificados). Nesse caso o
vídeo toca normalmente, só sem ajuste de tom.

### Detalhe técnico importante: por que o cronômetro roda numa Web Worker
O loop que atualiza a letra na tela e manda o tempo atual pra segunda tela
roda dentro de uma **Web Worker** (`js/tick-worker.js`) — uma thread
totalmente separada da página. Isso passou por duas rodadas de correção:

1. Primeiro trocamos `requestAnimationFrame` por `setInterval`, porque o
   navegador **pausa completamente** o rAF quando a aba não está em
   primeiro plano.
2. Só que mesmo `setInterval` sofre **desaceleração** do navegador nessa
   mesma situação (cai de ~60x/segundo pra ~1x/segundo) — o suficiente pra
   parecer "travado", mesmo sem estar 100% parado. Isso ainda deixava a
   letra do CDG grudada quando a aba principal perdia o foco (trocando de
   aba, ou dando foco na janela da segunda tela — inclusive em tela
   cheia).

A solução definitiva foi mover esse cronômetro pra dentro de uma **Web
Worker**: como ela roda numa thread de execução verdadeiramente separada
da página, a política de desaceleração de aba em segundo plano do
navegador **não se aplica a ela** — o timer de dentro da worker continua
na taxa normal (~60x/segundo) não importa se a aba está em primeiro ou
segundo plano.

Tem um fallback: se por algum motivo a Worker falhar ao carregar (raro),
o motor de áudio cai automaticamente pro `setInterval` normal, sem quebrar
o app — só volta a ter a limitação de antes nesse cenário específico.

---

## Rodada de Cantores (modo alternável)

Um modo completo pra quem opera karaokê com vários cantores numa noite —
liga/desliga nas Configurações ("Rodada de cantores"), sem afetar quem só
usa o modo simples de sempre.

### Conceito

Em vez de uma fila plana de músicas, a fila vira uma **lista circular de
cantores**, cada um com sua própria sub-fila de até 5 músicas:

- Cantor novo entra no **final da rodada atual**.
- Tocou a música #1 do cantor → sai da lista dele (consumida, vai pro
  histórico dele). Na próxima vez dele, a que era #2 vira #1.
- Terminou o último cantor da rodada → volta pro primeiro automaticamente
  (loop infinito).
- Cantor sem música na vez dele → tela mostra "Aguardando seleção de
  música", com botão **"Pular cantor"** — que marca ele como **pausado**
  (não é só pular essa rodada, fica pausado até reativar manualmente).
- Cantor pausado é ignorado silenciosamente na rotação normal.

### Arquitetura (importante pra quem for mexer no código)

Arquivo: `js/singers.js` — módulo isolado, só cuida dos **dados e da
lógica de rotação** (`createSingerManager()`), sem tocar em áudio/UI.
Testado isoladamente (27 testes) cobrindo especificamente o loop
circular, pausar/pular, reordenar, consumir músicas e histórico.

**Truque de integração**: quando o modo cantores está ligado, a variável
`playlist` (a mesma usada pelo modo simples) é sempre sobrescrita pra ter
**só 1 item** — a música do cantor da vez. Isso significa que TODA a
lógica de tocar/pitch/autoplay/segunda-tela que já existia (e já estava
testada) é reaproveitada sem duplicação — só a **decisão de "qual é a
próxima"** muda entre os dois modos.

### Adicionar música com cantor

Ao carregar um arquivo (upload ou Biblioteca) com o modo ligado, abre um
modal perguntando de qual cantor é aquela música — dropdown dos
existentes (mostra `X/5 músicas`) ou campo pra digitar um nome novo (cria
o cantor automaticamente). Não permite nomes duplicados (comparação
sem diferenciar maiúsculas/minúsculas). Com **vários arquivos de uma
vez**, pergunta o cantor de cada um, um por um, em sequência.

### Tela de espera rica (countdown)

Quando o autoplay avança de cantor, o overlay de contagem mostra:
posição + nome do cantor da vez + música/artista + tom, e os **próximos
2** da rodada. Três toggles nas configurações controlam o que aparece
(lista de próximos / títulos das músicas / contador numérico) — a mesma
informação é replicada na segunda tela via `BroadcastChannel`
(mensagem `countdown-start` ganhou os campos `singerMode`, `singer`,
`upcoming` e `display`).

---

## Gerenciar Cantores (modal administrativo)

Acessível pelo botão dentro das Configurações (só aparece com o modo
cantores ligado). Modal em 2 colunas:

**Esquerda — Lista da Noite**: todos os cantores com posição, status
(bolinha verde = ativo, cinza = pausado), contador `X/5`. Reordenar com
as setinhas ▲▼, pausar/reativar, excluir (com confirmação — remove as
músicas dele junto), e "+ Adicionar Novo Cantor" (cadastro rápido sem
música vinculada).

**Direita — Detalhe do cantor selecionado**, com 2 abas:
- **Fila de Espera**: lista as até-5 músicas dele, com botões +/− pra
  pré-configurar o tom de cada uma (sem precisar abrir o modal de música
  separado), botão de excluir individual, e "+ Adicionar Música" que abre
  uma **busca da Biblioteca embutida ali mesmo** (sem fechar o modal —
  decisão tomada deliberadamente pra não atrapalhar o fluxo do operador
  durante o evento).
- **Músicas Cantadas**: histórico só-leitura da sessão atual, com os
  tons usados em cada uma.

---

## Encerrar Show (relatório + CSV)

Só disponível com o modo cantores ligado (o relatório é centrado neles).

- **Início da sessão** é gravado no `localStorage` no momento do login
  bem-sucedido (script de autenticação no fim do `index.html`) — sobrevive
  a F5 (só reseta com "Iniciar Novo Show" ou um logout de verdade).
- Toda música que termina de tocar em modo cantores é registrada num
  histórico global (`showHistory`, também em localStorage):
  `{ horario, cantor, musica, artista, codigo, tom, duracao }`.
- Botão **"Encerrar Show"** no rodapé da sidebar → confirmação → abre o
  relatório com 4 cards (duração total no formato "Xh YYmin", total de
  músicas, cantores únicos, destaque da noite — quem mais cantou) + tabela
  cronológica completa.
- **Exportar CSV**: gera e baixa um `.csv` com todo o histórico, via
  `Blob` + link temporário — sem depender de nenhuma biblioteca externa.
- **Iniciar Novo Show / Sair**: limpa fila, histórico e cantores do
  `localStorage`, remove a autenticação da sessão, e recarrega a página
  (volta pra tela de senha).

---

## Biblioteca (indexação de pastas locais / HD externo)

Resolve o fluxo de quem tem um HD/SSD cheio de karaokês (na prática: 2TB+
organizados por produtora em várias pastas) e quer buscar rapidamente sem
precisar abrir o Finder/Explorer toda vez.

**Tecnologia**: File System Access API (`showDirectoryPicker()`), nativa
do navegador. **Só funciona em navegadores baseados em Chromium** (Chrome,
Edge, Opera) — Safari e Firefox não implementam essa API. O app detecta
isso automaticamente e mostra um aviso na aba Biblioteca nesse caso, sem
quebrar o resto do funcionamento.

### Como funciona

1. Usuário clica em "Conectar nova pasta" → escolhe a pasta no seletor
   nativo do sistema operacional.
2. O navegador guarda essa permissão (via IndexedDB) — não precisa
   reconceder acesso toda vez que o app abre. Se a permissão expirar por
   algum motivo, a pasta aparece marcada como "Reconexão necessária" com
   um botão pra resolver em um clique.
3. O app varre a pasta **recursivamente**, catalogando só os **nomes**
   dos arquivos `.zip`/`.mp4` (nunca lê conteúdo de áudio) — por isso é
   rápido mesmo em pastas enormes. Cada nome passa pelo mesmo parser de
   `Código - Artista - Música` já usado no resto do app.
4. A busca roda inteiramente **em memória** sobre esse índice — instantânea,
   sem esperar nada de disco a cada tecla digitada. É uma busca por
   **múltiplas palavras** (não frase exata): digitar "planta certeza" acha
   "Planta e Raiz - Com Certeza" mesmo as palavras não sendo vizinhas —
   basta que todas apareçam em algum lugar (título, artista ou código),
   em qualquer ordem. Também **ignora acentos**: buscar "avioes" (sem
   acento) encontra "Aviões" normalmente — usa `String.normalize('NFD')`
   pra separar letra de acento e descarta o acento antes de comparar, dos
   dois lados (tanto o que foi digitado quanto o que está indexado).
5. Ao clicar num resultado, o app lê o arquivo **de verdade** do disco
   (`handle.getFile()`) — sem rede, sem upload, é leitura local direta —
   e adiciona à fila normalmente (troca automaticamente pra aba Fila).

### Múltiplas pastas

Dá pra conectar várias pastas ao mesmo tempo (ex: uma por produtora) — a
busca já sai unificada entre todas, e cada resultado mostra uma etiqueta
indicando de qual pasta ele veio.

### Arquivo: `js/library.js`

Módulo isolado (não depende do resto do app), expõe `window.createLibrary()`
que retorna uma instância com: `connectNewFolder()`, `reconnectFolder(id)`,
`removeFolder(id)`, `restoreSavedFolders()`, `search(query)`,
`getFileForItem(item)`, `getConnectedFolders()`, `getIndexSize()`,
`findByFolderAndName(folderId, name)`.

---

## Fila sobrevive a um F5 acidental

A fila (lista de músicas + metadados) é salva automaticamente no
`localStorage` do navegador toda vez que muda (adiciona, remove, reordena).

**Importante — nem tudo é restaurado igual:**
- **Músicas que vieram da Biblioteca** são restauradas **automaticamente**
  depois de um F5/crash, porque têm uma referência viva ao arquivo no
  disco (via File System Access API) — o app simplesmente reabre o
  arquivo sozinho.
- **Músicas carregadas manualmente** (arrastadas ou pelo seletor de
  arquivo comum) **não conseguem ser restauradas** — o navegador não
  guarda esse tipo de referência entre recarregamentos de página (é uma
  limitação da própria plataforma, não do nosso código). Nesse caso, o
  app avisa quantas músicas não puderam ser restauradas, e você adiciona
  de novo se precisar.
- A fila restaurada fica **carregada, mas não tocando** — o usuário
  precisa clicar em alguma música pra retomar. Isso evita qualquer
  problema com política de autoplay do navegador (que bloqueia áudio
  tocando sozinho sem interação do usuário).

---

## Fila de músicas / Playlist

Ao carregar arquivos (clicando em "Carregar Música" ou soltando na tela),
cada um vira um item na fila com metadados extraídos do **nome do
arquivo**, seguindo a convenção: `Código - Artista - Música`. Exemplos:

```
EJBg-0020 - Kansas - Play the Game Tonight (Acoustic)
→ Código: EJBg-0020 | Artista: Kansas | Música: Play the Game Tonight (Acoustic)

Queen - Bohemian Rhapsody
→ (sem código) | Artista: Queen | Música: Bohemian Rhapsody
```

O parser (`parseKaraokeFilename` em `file-loader.js`) só reconhece a
primeira parte como "código" se ela **parecer** um código de verdade
(regex tipo letras curtas + números, ex: `EJBg-0020`) — assim, um título
de música que por acaso tenha um traço no meio não é confundido com
código.

**Clicar numa música da fila abre um modal** com as informações e um
seletor de tom, em vez de trocar/interromper a música na hora (evitava
cliques acidentais interrompendo quem está cantando). No modal:
- Se a música clicada **não é** a que está tocando: botão diz "Tocar", e
  ao confirmar, troca de música já no tom escolhido.
- Se a música clicada **é** a que já está tocando: botão diz "Aplicar
  tom", e só ajusta o tom sem reiniciar a reprodução.

**Reordenar a fila**: duas formas — setinhas (▲▼) que aparecem ao passar
o mouse sobre cada item, ou **arrastar e soltar** (drag & drop nativo do
HTML5). A música que está tocando "acompanha" sua nova posição
corretamente em ambos os casos (testado com vários casos de borda:
arrastar o item ativo, arrastar outros itens ao redor do ativo, etc).

---

## Autoplay + contagem regressiva

Configurável nas configurações (engrenagem): liga/desliga + quantos
segundos esperar entre uma música e outra. Quando ligado e uma música
termina (e há uma próxima na fila), aparece um overlay com contagem
regressiva grande, o nome da próxima música, e um botão "Pular espera"
pra quem não quiser esperar.

Também tem um **indicador clicável** na barra lateral (fora do painel de
configurações) que mostra o estado atual e liga/desliga com um clique
direto, sem precisar abrir as configurações.

---

## Aplausos automáticos

Toca um efeito de aplausos perto do fim da música. Tem **duas regras**
que trabalham juntas:

1. **Regra de tempo fixo**: dispara o mais tardar nos últimos 5 segundos
   do arquivo (baseado na duração total), garantindo que sempre dispare
   mesmo se a música terminar abruptamente (sem fade out).

2. **Regra de detecção de silêncio real**: usa um `AnalyserNode` (Web
   Audio) pra "escutar" o volume real do áudio nos últimos 20 segundos da
   música. Se detectar silêncio sustentado (RMS abaixo de um limiar, por
   mais de ~1,2 segundo), dispara os aplausos **imediatamente**, mesmo
   antes dos 5 segundos fixos — isso resolve o problema de músicas que
   têm alguns segundos de silêncio "morto" codificado no final do
   arquivo, o que fazia os aplausos demorarem demais a entrar.

   Essa regra só funciona quando há um sinal de áudio real pra analisar:
   sempre no CDG, e no MP4 só quando o vídeo está roteado pelo pitch
   shifter (motor `worklet` — ver seção acima). Se não estiver disponível,
   cai só na regra de tempo fixo, sem quebrar nada.

Se o usuário der **seek pra trás** (voltar mais de 20s antes do fim), o
sistema "rearma" e os aplausos podem disparar de novo depois.

Tem indicador clicável na barra lateral também, igual o autoplay.

## Acesso rápido (pills no rodapé) + Configurações (modal)

Autoplay, aplausos, música ambiente e segunda tela têm **dois pontos de
controle sincronizados** entre si (ligar em qualquer um liga no outro
automaticamente):
1. O checkbox correspondente no **modal de configurações** (abre clicando
   na engrenagem no rodapé da sidebar — antes era um painel que empurrava
   o conteúdo, agora é um modal de verdade, sobrepondo a tela)
2. Um "pill" (botão arredondado compacto) **centralizado no meio da barra
   de controles do rodapé**, entre o play e o volume/tom

Pra segunda tela especificamente, os dois pontos também **abrem e
fecham** a janela (não só mostram estado) — clicar com a janela fechada
abre ela; clicar com ela aberta, fecha de verdade (`window.close()`).

Quando ativos, os pills usam o mesmo gradiente roxo/azul do botão de
play (não mais verde) — mesma cor da engrenagem de configurações também,
pra manter uma identidade visual consistente de "isso é interativo/de
destaque".

*Nota histórica: numa versão anterior existia também um bloco de
indicadores fixo na barra lateral (embaixo da fila) — foi removido por
ficar redundante com os pills do rodapé.*

---

## Música ambiente

Toca uma das 5 faixas em `assets/ambient/` (escolhida aleatoriamente),
**só quando nada mais está tocando** — ou seja: fila vazia, música
pausada, ou durante a espera do autoplay. Assim que uma música começa a
tocar de verdade, a ambiente para (com fade out); quando volta a ficar
ociosa, ela reentra (com fade in). Ao terminar uma faixa ambiente, escolhe
outra aleatória automaticamente (evitando repetir a mesma duas vezes
seguidas) e continua.

Configurável: liga/desliga + volume próprio (independente do volume
principal). Indicador clicável na barra lateral, igual os outros dois.

---

## Tela ociosa (logo/imagem de fundo)

Quando não tem nada tocando (mesma condição da música ambiente), a área
onde ficaria o CDG/vídeo mostra a **logo do Play Karaoke** centralizada
num fundo preto — tanto na tela principal quanto na segunda tela.

Dá pra trocar por uma **imagem customizada** nas configurações (ideal
1920×1080px) — fica salva só na sessão atual (não persiste depois de
fechar a aba, mesma lógica de "os arquivos somem" já adotada pro resto do
app). A imagem é convertida pra base64 e mandada pra segunda tela via
`BroadcastChannel`, então sincroniza automaticamente lá também.

**Nota de escopo**: essa tela ociosa só aparece quando **já tem músicas
na fila** mas nada tocando. A tela **totalmente vazia** (antes de
carregar qualquer arquivo) continua mostrando a caixa de "solte um
arquivo aqui", porque ela cumpre uma função de orientação que a logo
sozinha não cumpriria.

---

## Segunda tela

Ideia: abrir uma janela separada, sem nenhum controle, só com a letra —
pra arrastar pro monitor voltado pro cantor, enquanto você opera a
janela principal no seu.

**Como funciona por baixo dos panos**: usa a API `BroadcastChannel`
(mensagens entre abas/janelas do mesmo navegador, mesma origem). A janela
principal manda:
- `init-cdg` (buffer do CDG + cores) ou `init-video` (URL do vídeo) — uma
  vez, quando a música carrega
- `time` — o tempo atual, continuamente (throttled a ~30x/segundo)
- `playing` / `idle` — pra segunda tela saber se deve mostrar a
  letra/vídeo ou a tela ociosa
- `colors` — se o usuário muda o esquema de cores em tempo real
- `idle-image` — a imagem de fundo customizada, se configurada
- `clear` — quando a fila esvazia

A segunda tela (`second-screen.js`) é "burra" de propósito: só recebe e
renderiza, não tem lógica própria de tocar nada (o áudio só existe na
janela principal, evitando duas fontes de som).

**Detalhe de sincronia**: quando a segunda tela abre (ou recarrega), ela
manda `{type: 'ready'}` e a janela principal responde reenviando todo o
estado atual — assim funciona mesmo se você abrir a segunda tela depois
que a música já estava tocando.

---

## Testes automatizados

Como não há acesso a um navegador de verdade neste ambiente de
desenvolvimento, toda a lógica foi validada com **jsdom** (simulação de
DOM em Node.js) — carregando o HTML real, "clicando" em elementos via
eventos JS, e conferindo o resultado no DOM. Isso cobre toda a lógica
(fila, modal, autoplay, aplausos, detecção de silêncio, reordenar,
segunda tela), mas **não substitui teste manual real**: coisas como
qualidade sonora do pitch shift, aparência visual exata, ou
comportamento específico de cada navegador só são confirmadas testando de
verdade.

Se for continuar o desenvolvimento, vale manter esse hábito: qualquer
lógica nova de JS que não dependa de canvas/áudio real deve ganhar um
teste jsdom antes de considerar pronta.

---

## Decisões e trade-offs importantes (pra não repetir discussões)

- **Bug real encontrado e corrigido: "Carregando arquivo..." travado +
  play/stop em loop.** Causa raiz confirmada com teste reproduzindo o
  cenário exato: o botão "Iniciar Agora" (que fica sempre visível na
  tela de espera desde o redesign) continuava **clicável durante o
  próprio carregamento** de uma música (a troca de cantor, com internet/
  disco mais lento, tem uma janela real de alguns milissegundos-segundos
  onde `isAnythingPlaying()` ainda é falso mas já tem um carregamento em
  andamento). Clicar nele nessa janela disparava um **segundo**
  carregamento por cima do primeiro — o motor ficava competindo consigo
  mesmo, gerando o "trava, mostra carregando, dá play/stop sozinho".
  Corrigido desabilitando `cd-skip-btn` (e também `play-btn`/`stop-btn`,
  pelo mesmo motivo) enquanto `showLoading(true)` está ativo — e
  garantindo que eles voltam a ficar clicáveis tanto no sucesso quanto
  numa falha de carregamento (senão travariam desabilitados pra sempre
  num erro).


- **Conceito de "pausar cantor" foi removido por completo** — decisão do
  usuário, achou que gerava confusão (alguém fica pausado sem se dar
  conta, e a rodada passa reto por ele sem aviso claro o suficiente).
  Removido de `singers.js` (campo `paused`, `setPaused`,
  `skipCurrentSinger`), do "Gerenciar Cantores" (botão ⏸/▶), e da fila
  (botão "Pular cantor", tag "PAUSADO"). Agora, cantor sem música na vez
  dele simplesmente **fica esperando** — sem botão de pular, sem pausa
  automática. Rotação voltou a ser um `(idx + 1) % length` simples, sem
  filtro nenhum.
- **Bug de scroll corrigido**: a lista de cantores (`#singer-round-view`)
  nunca tinha ganhado `flex:1; overflow-y:auto;` — igual a lista simples
  (`#playlist`) já tinha desde sempre. Com muitos cantores, a lista
  crescia e cobria o rodapé (engrenagem/Modo Show/versão) em vez de
  rolar internamente.


- **Bug real encontrado e corrigido: travamento + pular cantor na rodada.**
  Causa raiz: `selectTrack()` não tinha proteção contra chamadas
  sobrepostas (cliques rápidos, ou o próprio evento "ended" disparando
  mais de uma vez pra mesma música — o que já sabíamos ser possível,
  vide a rede de segurança adicionada antes). Um disparo duplo de "ended"
  chamava `consumeCurrentSongAndAdvance()` duas vezes seguidas, avançando
  a rodada duas posições de uma vez — exatamente o "cantor pulado" que o
  usuário reportou. Corrigido com dois mecanismos:
  1. `selectTrack()` ganhou um contador de gerações — uma chamada mais
     nova invalida qualquer chamada antiga ainda em andamento (que se
     auto-cancela nos pontos de espera).
  2. `handleTrackEnded()` ganhou um debounce de 800ms — ignora disparos
     repetidos do evento de fim de música dentro dessa janela.
  Teste de regressão confirma: dois disparos seguidos de "ended" agora
  avançam a rodada só uma vez (não mais pulando ninguém).
- **Botão Stop** adicionado no transporte (entre Play e Próxima) —
  invalida qualquer carregamento em andamento e reseta tudo pro estado
  vazio, pra quando travar por qualquer outro motivo não previsto.
- **Triângulo de play nas linhas da fila (modo cantores)** só aparece na
  linha ATIVA agora — nas outras não tinha ação nenhuma associada
  (clique simples não faz nada, só duplo-clique/arrastar), então mostrar
  ele lá só confundia.


- **v2.0 — redesign completo da interface do modo cantores.** Vale saber:
  - Correção real de bug: motor de áudio ganhou uma rede de segurança
    pro caso do evento `ended` nativo do navegador não disparar (relatos
    conhecidos de instabilidade no Chrome nesse evento) — o loop de tick
    já existente detecta quando o tempo passou da duração e força o fim
    manualmente.
  - "Modo Show" agora é **um único botão** no rodapé (não mais um toggle
    de configurações + botão separado de encerrar). Ligado → mostra
    "Encerrar Show"; clicar nesse estado abre a confirmação de encerrar
    de verdade (relatório + CSV + reset). **Não existe mais um jeito de
    só "pausar" o modo sem encerrar** — decisão explícita do usuário.
  - Configurações: Aplausos e Segunda Tela saíram do modal (viraram só
    os pills do rodapé, que já bastam — sem configuração extra que
    justificasse um card). Modal virou grid de 2 colunas, sem scroll.
  - Fila em modo cantores agora é uma **lista completa** (1 linha por
    cantor, mostrando a música atual dele), não mais um card resumido —
    com drag-and-drop, setas, remover, e duplo-clique abrindo Gerenciar
    Cantores direto no cantor certo.
  - Tela de espera: card branco pro "a seguir", 3 próximos (era 2),
    botão "Iniciar Agora" sempre visível fora do timer também (pula se
    tiver contando, ou já inicia a vez do cantor se estiver parado).
  - Tudo desenhado pra caber sem scroll numa tela de ~1280×800 (MacBook
    13") — logo com tamanho máximo fixo em pixels, espaçamentos
    reduzidos.


- **Persistência de músicas em modo cantores tem a mesma limitação já
  conhecida do modo simples**: só músicas vindas da Biblioteca sobrevivem
  a um F5 (referência viva ao arquivo); músicas manuais (arrastadas) não
  — ficam de fora silenciosamente na restauração. Isso foi uma escolha
  consciente pra não estourar o escopo dessa rodada; dá pra melhorar
  depois se precisar.
- **"Pular cantor" pausa de verdade** (não é "pular só essa rodada") —
  confirmado explicitamente com o usuário, é intencional.
- **Modo cantores é sempre opcional/alternável**, nunca substitui o modo
  simples — decisão do usuário, pensando em quem só quer testar música
  sem gerenciar uma lista de cantores.
- **Busca "+ Adicionar Música" dentro do modal Gerenciar Cantores é
  embutida** (não fecha o modal nem troca de aba) — decisão deliberada
  pensando em fluidez durante um evento ao vivo, onde reabrir menus toda
  hora atrapalha o operador.
- **Relatório do "Encerrar Show" só aparece com modo cantores ligado** —
  o conceito de "cantor" não existe no modo simples, então o relatório
  não faria sentido lá.

- **Mistério não resolvido: engrenagem de configurações não aparece
  colorida** (deveria ter o gradiente roxo/rosa, aparece branca/cinza pro
  usuário). Investigação extensa já feita: confirmado que o CSS no
  arquivo está correto (`#settings-btn{ background:linear-gradient(...) }`),
  confirmado que não é cache local (testado em aba anônima), confirmado
  que a URL acessada é a certa, confirmado que o código-fonte publicado
  no GitHub tem o CSS certo (visto direto pelo visualizador de arquivo do
  GitHub, não just o Pages). Não foi possível ainda testar em janela
  "Convidado" do Chrome (zero extensões) — hipótese mais provável agora é
  alguma extensão do navegador do usuário sobrescrevendo estilos
  (modo escuro forçado, ferramenta de contraste/acessibilidade, etc.),
  já que sua barra de extensões é bem carregada. **Não mexer de novo no
  CSS desse botão até esse teste ser feito** — o código já está correto.

- **Bug do modal "Aplicar tom" — esclarecido e corrigido**: o problema
  reportado inicialmente ("clicar Aplicar tom dá play sem querer") na
  verdade era sobre um cenário diferente do que eu tinha testado: com uma
  música tocando, o usuário clicava numa **outra** música (ainda em
  espera na fila) só pra pré-configurar o tom dela — mas como só existia
  o botão "Tocar" pra músicas não-ativas, a única opção trocava a música
  na hora, interrompendo a que estava tocando. Corrigido separando em
  **dois botões**: "Aplicar tom" (sempre visível — pra música ativa,
  aplica na hora; pra música em espera, só salva o valor pro futuro, sem
  tocar nada) e "Tocar" (só aparece pra música não-ativa, troca e toca na
  hora). O tom salvo numa música em espera é aplicado automaticamente
  quando ela realmente começa a tocar (via autoplay ou botão Próxima).
- **Sidebar é redimensionável** (arrastando a borda direita) desde essa
  rodada — a largura escolhida fica salva no `localStorage`
  (`playkaraoke-sidebar-width`).
- **`.card-btn`/`.card-btn.secondary` eram acidentalmente escopados**
  só dentro de `.settings-card-row` — o botão "Cancelar" do modal de
  música nunca teve estilo de verdade por causa disso (aparecia com o
  visual padrão do navegador). Generalizado pra funcionar em qualquer
  contexto.

- **Persistência da fila é parcial, por decisão técnica** (não escolha
  arbitrária): músicas da Biblioteca sobrevivem a um F5, músicas manuais
  não — é limitação real da plataforma (o navegador não permite "lembrar"
  um arquivo escolhido via seletor comum entre recarregamentos). Ver seção
  "Fila sobrevive a um F5 acidental" acima antes de prometer mais do que
  isso pra um cliente.
- **Cores personalizadas ficam desligadas por padrão** — só afetam CDG,
  não MP4 (já avisado na interface).
- **Zoom/tamanho de letra foi removido** — tentamos, mas cortava partes
  da letra que ficavam perto da borda; o usuário preferiu tirar.
- **Estilo "nítido vs suave" do CDG foi removido** — ficou sempre
  suavizado, por decisão do usuário (achou o nítido pouco necessário).
- **AudioWorklet de terceiros foi abandonado** em favor de um processador
  próprio, depois de encontrar uma dependência não-documentada que
  quebrava silenciosamente.
- **Modo texto+timestamp (tipo .lrc)** foi cogitado como alternativa pro
  CDG (permitiria fonte/cor livres de verdade), mas foi **adiado**
  deliberadamente — é um projeto separado, não uma evolução do atual.
- **A senha de acesso é só um filtro leve, não segurança real** — decisão
  consciente, dado que o projeto é 100% estático (sem servidor). Ver seção
  "Tela de senha" acima antes de assumir que algo sensível está protegido.
- **Bug de distorção do CDG/vídeo corrigido**: o CSS tinha `width:100%` e
  `height:100%` ao mesmo tempo no canvas/vídeo, o que ignora a
  `aspect-ratio` e estica a imagem pra preencher qualquer formato de
  janela. A correção foi deixar `height:auto`, assim só a largura
  determina o tamanho e a altura segue a proporção 300:216 (CDG) ou 16:9
  (vídeo) automaticamente.
- **Busca no YouTube foi descartada como funcionalidade do produto** —
  discutimos, e embutir player do YouTube tecnicamente **bloquearia o
  ajuste de tom** (restrição de segurança do navegador, sem contorno
  possível via JS; confirmado por pesquisa). Também foi recusado
  implementar qualquer forma de baixar vídeo do YouTube pro app (questão
  de termos de uso/direitos autorais — fora do escopo do que esse projeto
  vai fazer, independente de enquadramento do pedido).
- **Biblioteca (Cenário 1) foi escolhida sobre YouTube (Cenário 2)** como
  prioridade de desenvolvimento — resolve o fluxo real do usuário sem
  dependência de terceiros nem risco de conteúdo sumir.

---

## Ideias discutidas mas não implementadas (pra retomar se quiser)

- **Nome do cantor na fila** — usuário quer, mas vai detalhar como quer
  antes de implementar. Não fazer sem alinhar de novo.
- **Log/registro da noite** (o que tocou, quando, quem cantou) — junto
  com o item do cantor, mesma ressalva.
- **Configurações em JSON exportável/importável** (presets que o cliente
  baixa e recarrega depois) — ideia aprovada pro futuro, não pra agora.
- Modo alternativo de renderização baseado em letra+timestamp (texto
  vetorial de verdade, fonte/cor 100% livres) — adiado, ver acima.
- Hospedar num domínio próprio — já é possível hoje (é só HTML/JS
  estático), só não foi feito ainda.

---

## Se for pedir ajuda de outra IA

Cole este arquivo inteiro no início da conversa, e já vale mandar
também os arquivos do projeto (ou pelo menos `index.html` e `js/app.js`,
que são os que mais mudam). Isso deve dar contexto suficiente pra
continuar sem precisar redescobrir tudo isso nas custas de novas
tentativas e erros.
