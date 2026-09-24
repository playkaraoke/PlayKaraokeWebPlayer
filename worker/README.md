# Worker da busca Online (Cloudflare)

Servidor mínimo da aba **Biblioteca → Online**. Ele guarda as chaves da YouTube Data API (que não podem ficar no site público) e mantém um cache de 24h das buscas, compartilhado entre todos os usuários, para poupar a cota diária.

- **Endpoint:** `GET /search?q=termo`
- **Custo:** grátis (plano free da Cloudflare: 100 mil requisições por dia)

## Configuração (uma vez só)

### 1. Chave da YouTube Data API (Google Cloud)
1. Acesse https://console.cloud.google.com/ e crie um projeto, por exemplo `playkaraoke`.
2. Vá em **APIs e serviços → Biblioteca** e ative a **YouTube Data API v3**.
3. Vá em **APIs e serviços → Credenciais → Criar credenciais → Chave de API**.
4. Clique na chave criada. Em **Restrições de API**, selecione só a **YouTube Data API v3** e salve. Não use restrição por site: quem chama a API é o Worker, não o navegador.
5. Copie a chave.
6. **Repita os passos 3–5 duas vezes** para gerar `YOUTUBE_API_KEY_2` e `YOUTUBE_API_KEY_3` (rodízio de cota, ver seção abaixo).

### 2. Worker (Cloudflare)
Crie uma conta grátis em https://dash.cloudflare.com/sign-up. Depois, no Terminal, dentro da pasta do projeto:

```bash
cd worker
npx wrangler login                              # abre o navegador pra autorizar
npx wrangler kv namespace create SEARCH_CACHE   # mostra um "id" → cole em wrangler.toml
npx wrangler secret put YOUTUBE_API_KEY         # cole a 1ª chave
npx wrangler secret put YOUTUBE_API_KEY_2       # cole a 2ª chave
npx wrangler secret put YOUTUBE_API_KEY_3       # cole a 3ª chave
npx wrangler deploy                             # mostra a URL: https://playkaraoke-search.<sua-conta>.workers.dev
```

### 3. Ligar no app
Cole a URL do deploy em `ONLINE_SEARCH_ENDPOINT`, no início de `js/online-search.js`, e publique (`git push`).

## Cota e rodízio de chaves

A cota grátis do YouTube é de **10.000 unidades por dia por projeto**, e cada busca **nova** custa 100 unidades. Ou seja, ~100 buscas novas por dia **por chave**.

O Worker usa **3 chaves em rodízio** (v2.4):
- Antes de cada busca, ele olha no KV `SEARCH_CACHE` (prefixo `keyusage:`) quais chaves já esgotaram **hoje**.
- Usa a primeira que ainda não esgotou.
- Quando o Google devolve `quotaExceeded` numa chave, ela é marcada como esgotada até a **meia-noite do Pacífico** (horário em que a cota do YouTube reseta).
- Se todas esgotarem, o app mostra a mesma mensagem amigável de antes (`online_err_quota`) e sugere usar **Dispositivos**.

**Importante:** o reset é automático via TTL do KV — não precisa de cron nem job. O contador some sozinho à meia-noite PT e todas as chaves voltam a ficar disponíveis.

### Adicionar uma 4ª chave no futuro
1. Gere a chave no Google Cloud (mesmo projeto).
2. `npx wrangler secret put YOUTUBE_API_KEY_4`
3. Adicione `'YOUTUBE_API_KEY_4'` no array `KEY_NAMES`, em `src/index.js`.
4. `npx wrangler deploy`

### Por que não usar mais projetos do Google Cloud?
A cota é **por projeto**, não por chave. Criar 3 projetos exigiria 3 contas Google diferentes — o Google pode interpretar como abuso e suspender todas. As 3 chaves aqui são do **mesmo projeto**: elas compartilham a cota, mas servem como plano B se uma for comprometida.

## Atualizar o Worker
Depois de alterar `src/index.js`, rode `npx wrangler deploy` dentro da pasta `worker/`. O `git push` publica só o site, não o Worker.