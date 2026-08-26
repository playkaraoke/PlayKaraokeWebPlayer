# Play Karaoke — Documentação do Projeto (v0.5 — com autenticação e deploy)

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
    ├── file-loader.js             → extrai .cdg/.mp3 do .zip + interpreta nome do arquivo
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

### Detalhe técnico importante: por que `setInterval` e não `requestAnimationFrame`
O loop que atualiza a letra na tela e manda o tempo atual pra segunda tela
usa `setInterval`, **não** `requestAnimationFrame`. Isso foi uma correção
de bug: o navegador pausa (ou reduz muito) o `requestAnimationFrame`
quando a aba não está em primeiro plano (ex: você abre outra aba, ou
interage com a janela da segunda tela) — isso fazia a segunda tela
"congelar" mesmo com o áudio tocando normalmente (Web Audio não depende de
`requestAnimationFrame`, só a parte visual dependia). `setInterval`
continua rodando em segundo plano (o navegador pode desacelerar um pouco,
mas nunca pausa de vez), então a segunda tela nunca mais deveria travar
por causa disso.

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

- **Arquivos não persistem entre sessões** — decisão consciente do
  usuário, não um bug. Fechou a aba, precisa carregar de novo.
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

---

## Ideias discutidas mas não implementadas (pra retomar se quiser)

- Persistência de arquivos entre sessões (IndexedDB) — descartada por
  preferência do usuário, mas tecnicamente viável se mudar de ideia.
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
