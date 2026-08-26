# Play Karaoke — Player Funcional (v0.4)

Player de karaokê com fila de músicas (drag&drop pra reordenar), autoplay
entre faixas, ajuste de tom em tempo real (CDG **e** MP4), aplausos
automáticos, música ambiente, tela ociosa personalizável, e segunda tela
pro monitor voltado pro cantor.

## Como rodar no Mac

```
cd ~/Downloads/karaoke-engine
python3 -m http.server 8000
```
Abra **http://localhost:8000** no navegador.

## Como rodar no Windows

```
cd caminho\para\karaoke-engine
python -m http.server 8000
```
(se não tiver Python instalado, baixe em python.org — marque "Add to PATH"
na instalação). Abra **http://localhost:8000** no navegador.

## O que já funciona

- ✅ Fila de músicas — carregue vários de uma vez, **arraste pra reordenar**
  (ou use as setinhas), remova, tudo sem interromper a música tocando
- ✅ Clicar numa música da fila abre um modal com as infos + escolha de tom
  antes de tocar — não troca de música sem querer
- ✅ Autoplay entre músicas com contagem regressiva configurável
- ✅ Interpretação automática do nome: "Código - Artista - Música"
- ✅ Parser completo do CDG + player de MP4
- ✅ **Pitch shift funciona em CDG e em MP4** (roteado pelo mesmo motor)
- ✅ Esquema de cores personalizável (só afeta CDG — MP4 já é vídeo pronto)
- ✅ Aplausos automáticos nos últimos 5s
- ✅ Música ambiente opcional — toca sozinha (com fade) quando nada está
  tocando, escolhendo aleatoriamente entre as faixas de `assets/ambient/`
- ✅ Tela ociosa — mostra a logo (ou uma imagem sua, se configurar) quando
  nada está tocando, tanto na tela principal quanto na segunda tela
- ✅ Tela cheia proporcional
- ✅ Segunda tela sincronizada (janela separada pro segundo monitor)
- ✅ Volume com indicador de porcentagem
- ✅ Indicadores clicáveis (autoplay / aplausos / música ambiente) na
  barra lateral — ligam/desligam direto, sem abrir configurações

## Segunda tela — como usar

1. Nas configurações (engrenagem no rodapé da barra lateral), clique em
   "Abrir janela ↗"
2. Arraste a janela nova pro seu segundo monitor
3. Coloque em tela cheia nela mesma (botão que aparece ao passar o mouse,
   ou F11/Ctrl+Cmd+F)
4. Fica sincronizada automaticamente — inclusive mostra a tela ociosa
   (logo/imagem) junto com a principal quando nada está tocando

## Estrutura de arquivos

```
karaoke-engine/
├── index.html            → player principal
├── second-screen.html    → janela da segunda tela
├── assets/
│   ├── logo.svg
│   ├── aplausos.mp3
│   └── ambient/           → 5 faixas de música ambiente (comprimidas ~96kbps)
└── js/
    ├── cdg-player.js              → parser + renderizador do formato CDG
    ├── audio-engine.js            → engine de áudio (pitch shift em CDG e vídeo)
    ├── pitch-worklet-processor.js → processador de pitch (thread separada)
    ├── file-loader.js             → extrai .cdg/.mp3 do .zip + interpreta nome do arquivo
    ├── second-screen.js           → lógica da janela da segunda tela
    └── app.js                     → interface principal, fila, autoplay, ambiente
```
