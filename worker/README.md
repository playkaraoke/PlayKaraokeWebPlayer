# Worker da busca Online (Cloudflare)

Servidor mínimo da aba **Biblioteca → Online**. Ele guarda a chave da YouTube Data API (que não pode ficar no site público) e mantém um cache de 24h das buscas, compartilhado entre todos os usuários, para poupar a cota diária.

- **Endpoint:** `GET /search?q=termo`
- **Custo:** grátis (plano free da Cloudflare: 100 mil requisições por dia)

## Configuração (uma vez só)

### 1. Chave da YouTube Data API (Google Cloud)
1. Acesse https://console.cloud.google.com/ e crie um projeto, por exemplo `playkaraoke`.
2. Vá em **APIs e serviços → Biblioteca** e ative a **YouTube Data API v3**.
3. Vá em **APIs e serviços → Credenciais → Criar credenciais → Chave de API**.
4. Clique na chave criada. Em **Restrições de API**, selecione só a **YouTube Data API v3** e salve. Não use restrição por site: quem chama a API é o Worker, não o navegador.
5. Copie a chave.

### 2. Worker (Cloudflare)
Crie uma conta grátis em https://dash.cloudflare.com/sign-up. Depois, no Terminal, dentro da pasta do projeto:

```bash
cd worker
npx wrangler login                              # abre o navegador pra autorizar
npx wrangler kv namespace create SEARCH_CACHE   # mostra um "id" → cole em wrangler.toml
npx wrangler secret put YOUTUBE_API_KEY         # cole a chave do passo 1
npx wrangler deploy                             # mostra a URL: https://playkaraoke-search.<sua-conta>.workers.dev
```

### 3. Ligar no app
Cole a URL do deploy em `ONLINE_SEARCH_ENDPOINT`, no início de `js/online-search.js`, e publique (`git push`).

## Cota
- A cota grátis é de 10.000 unidades por dia. Cada busca **nova** custa 100, o que dá cerca de **100 buscas novas por dia**.
- Buscas repetidas em até 24h vêm do cache e não gastam cota.
- A cota zera à meia-noite, no horário do Pacífico (entre 4h e 5h da manhã no horário de Brasília).
- Para aumentar: **Google Cloud → IAM e administrador → Cotas**, ou pelo formulário de extensão de cota da YouTube API Services. É grátis, mas passa por uma revisão do Google.
- Quando a cota acaba, o app avisa na aba Online e sugere a busca em Dispositivos.

## Atualizar o Worker
Depois de alterar `src/index.js`, rode `npx wrangler deploy` dentro da pasta `worker/`. O `git push` publica só o site, não o Worker.
