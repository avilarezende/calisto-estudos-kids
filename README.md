# 🦜 Aventura do Saber com o Calisto - Portal Infantil Gamificado

Uma plataforma web interativa, responsiva e divertida criada especialmente para revisão infantil de conteúdos guiados pelo sábio **Mascote Periquito Ringneck 3D (Calisto)**, com vídeos explicativos, flashcards 3D, quizzes com pontuação, estrelas, troféus, grasnado real e voz masculina envelhecida de bruxo.

---

## 🌟 Principais Recursos

- 🦜 **Mascote Calisto 3D Ultra Realista**:
  - Olhos com **rastreamento ativo do mouse**.
  - **Asas articuladas** em múltiplas camadas de penas de voo.
  - Fala em voz alta em português com tom masculino envelhecido/rachado de bruxo ágil.
  - Grasnadinho curto autêntico de 0.4s gravado de um Ringneck real (*Psittacula krameri*).
  - Voo livre interativo pela tela sem sair do enquadramento.
- 🎬 **Modo Apresentação do Calisto (Slideshow 3D Guiado)**:
  - Apresentador Calisto 3D no palco interagindo com os slides.
  - Narração automática por voz dos slides, modo Auto-Play, destaques e notas do orador.
  - Navegação por teclado (← / → / Espaço) e bolinhas interativas.
- 🔗 **Importador Inteligente do Google NotebookLM**:
  - Aceita URL do projeto do NotebookLM (`https://notebooklm.google.com/notebook/...`).
  - Converte automaticamente Guias de Estudo, Resumos de Briefing, FAQs, Linhas do Tempo e Áudio Overviews em Apresentações completas com Flashcards e Quiz.
  - Presets instantâneos para teste (Robótica & IA, Recifes de Coral).
- 🗂️ **Workspaces de Conteúdo**: Pré-populados com temas educativos ou gerados a partir do seu NotebookLM.
- 📺 **Cinema & Conteúdo**: Vídeos e players de áudio integrados.
- 🃏 **Cartões Mágicos (Flashcards 3D)**: Cartões giratórios com efeito 3D para fixação da memória.
- 🏆 **Missão Desafio (Quiz Gamificado)**: Vidas/corações, estrelas, pontuação e chuva de confetes nas respostas corretas.
- ⚙️ **Modo Educador**: Permite editar os workspaces direto no navegador ou colar conteúdos gerados.
- 🌐 **Gratuito em 2 modos**: roda como página estática no GitHub Pages (custo zero) e, opcionalmente, com um **servidor Node.js local** (`node server.js`) que libera a busca de URL do educador.

---

## 🚀 Como Publicar Gratuitamente no GitHub Pages

### Passo 1: Criar o Repositório no seu GitHub
1. Acesse **[github.com/new](https://github.com/new)** logado na sua conta **`avilarezende`**.
2. No campo **Repository name**, digite: `calisto-estudos-kids` (ou o nome que preferir).
3. Deixe o repositório marcado como **Public**.
4. **Não marque** as opções de criar README/license (o repositório já está pronto no seu computador).
5. Clique em **Create repository**.

---

### Passo 2: Enviar os Arquivos pelo Terminal
No terminal do seu projeto, execute os comandos abaixo para enviar o código:

```bash
git remote add origin https://github.com/avilarezende/calisto-estudos-kids.git
git push -u origin main
```

*(Caso o GitHub solicite login, use seu token de acesso pessoal ou autenticação via navegador).*

---

### Passo 3: Ativar o GitHub Pages (Grátis em 1 Clique)
1. No seu repositório no GitHub (`https://github.com/avilarezende/calisto-estudos-kids`), clique na aba **Settings** (Configurações no topo).
2. No menu lateral esquerdo, clique em **Pages**.
3. Na seção **Build and deployment > Branch**, selecione **`main`** e a pasta **`/(root)`**.
4. Clique em **Save**.
5. Pronto! Em 1 minuto o site estará publicado e acessível no endereço:
   👉 **`https://avilarezende.github.io/calisto-estudos-kids/`** 🎉

> 📌 **Importante**: ao publicar no GitHub Pages, o app roda 100% como página estática — apenas o recurso de **"Buscar URL do educador"** precisa do servidor local (veja abaixo).

---

## 🖥️ Como Rodar com o Servidor Local (Modo Educador Completo)

O site funciona do mesmo jeito como **página estática** (basta abrir o `index.html` ou publicar no GitHub Pages), mas o recurso de **"Buscar URL do educador"** depende do pequeno servidor Node.js que acompanha o projeto. Ele serve os arquivos do site **e** a API segura de busca.

1. Instale o **Node.js** (gratuito) em [nodejs.org](https://nodejs.org).
2. Abra o terminal na pasta do projeto e rode:
   ```bash
   node server.js
   ```
3. Acesse **http://127.0.0.1:8085** 🎉

> 🔒 O servidor escuta **apenas** em `127.0.0.1:8085` (seu próprio computador) e nunca fica exposto à internet. Ele serve os arquivos do site com cabeçalhos de segurança e é o único que consegue buscar URLs externas com segurança.

---

## 🌐 Página Estática vs. Servidor Local

| Recurso | 🌐 Página estática (GitHub Pages ou `index.html`) | 🖥️ Servidor local (`node server.js`) |
|---|---|---|
| Mascote Calisto 3D, apresentação, flashcards, quiz, voz e confetes | ✅ | ✅ |
| Modo Educador (PIN, editar, colar JSON/texto) | ✅ | ✅ |
| **Buscar URL do educador** (`/api/fetch-workspace`) | ❌ Indisponível | ✅ |

No modo página estática, o navegador **não consegue buscar sites externos diretamente** (limite de segurança do navegador/CORS), então o app **processa o conteúdo enviado localmente** e avisa que "a busca remota não está disponível". Por isso, para o **NotebookLM** o caminho recomendado continua sendo **copiar o conteúdo e colar no campo de texto** (ou usar o prompt + JSON), em vez de depender apenas da URL.

---

## 🔌 API `/api/fetch-workspace` (busca segura de URL)

O servidor expõe **um único endpoint**, criado para importar materiais didáticos (NotebookLM e vídeos do YouTube) com segurança:

```
GET /api/fetch-workspace?url=https://...
```

**Restrições de segurança (em resumo):**
- 🔒 **Somente HTTPS** e **somente `GET`** (o preflight `OPTIONS` é aceito; qualquer outro método retorna `405`).
- 🟢 **Allowlist de hosts**: a URL precisa apontar para Google/YouTube — sufixos `google.com`, `youtube.com`, `youtube-nocookie.com` e `youtu.be` (cobre `notebooklm.google.com`, `notebook.google.com`, embeds do YouTube etc.). Qualquer outro host é recusado.
- 🛡️ **Proteção SSRF (via DNS)**: antes de conectar, o servidor resolve o endereço real do host e **bloqueia IPs privados, loopback, link-local e metadata de nuvem** — inclusive a cada redirecionamento.
- 📦 **Limite de resposta de 1 MB** por busca e **máx. 3 redirecionamentos** (cada um revalidado pela allowlist + DNS).
- 🔑 **Detecção de login Google (`isGoogleAuth`)**: se o conteúdo exigir Conta Google, a API responde com `isGoogleAuth: true` em vez de seguir o fluxo de login.
- 🌐 **CORS restrito** a `http://127.0.0.1:8085` (nada de `*` — o endpoint não é um proxy aberto).
- ⏱️ Timeout de conexão de 10 segundos.

**Respostas**: `200` com `{ success: true, body, contentType }`; erros retornam `{ success: false, error }` (`400` se faltar o parâmetro `url`, `429` em excesso de requisições, `500` para falhas de busca).

---

## 🛡️ Segurança

- **Cabeçalhos de segurança** aplicados em **todas** as respostas:
  - `Content-Security-Policy` (CSP): scripts restritos ao próprio site e `frame-src` limitado ao `https://www.youtube-nocookie.com`.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` e `Referrer-Policy: no-referrer`.
- **Proteção contra path traversal**: o servidor de arquivos estáticos confina tudo dentro de `PUBLIC_DIR` (a pasta do projeto) — tentativas de escapar dela (ex.: `..`) retornam `403`.
- **Rate limiting (em memória)**: o `/api/fetch-workspace` aceita **no máximo 60 requisições por minuto por IP**; acima disso responde `429 Too Many Requests`.
- **Anti-XSS no frontend**: em `app.js`, toda interpolação de dados de usuário (educador, Gemini, upload/colar e URL) que vai para `innerHTML` passa pela função **`escapeHtml()`**; links do YouTube são convertidos para o embed sem cookies (`youtube-nocookie.com`).

---

## 🚦 CI — Verificação Automática no GitHub (`.github/workflows/ci.yml`)

Toda alteração enviada para a branch `main` (ou em *pull request*) dispara duas verificações:
1. **Secret scanning com Gitleaks**: caça chaves de API e segredos commitados por acidente.
2. **Checagem de sintaxe**: `node --check` nos arquivos `server.js`, `app.js` e `mascot3d.js` (Node.js 20).

Se qualquer verificação falhar, o push/PR é bloqueado — garantindo que o código chegue ao site "limpo" e sem erros de sintaxe.

---

## 📝 Como Personalizar os Temas e Conteúdos do Gemini Notebook

Você pode editar os 10 workspaces de 2 formas:

### Opção A: Pelo Botão "Modo Educador" no Site
No canto superior direito da página, clique em **⚙️ Modo Educador**:
1. Copie o prompt gerador e cole no seu **Gemini Notebook**.
2. Cole o JSON de resposta na aba **Editar Dados (JSON)** e clique em **Salvar & Aplicar Agora**.

### Opção B: Editando o arquivo `data/workspaces.js`
Abra o arquivo `data/workspaces.js` no repositório e altere títulos, IDs de vídeos do YouTube, perguntas do quiz e flashcards.

---

## 🎨 Estrutura de Arquivos
- `index.html`: Interface visual principal, salas de estudos e modais.
- `style.css`: Estilização moderna, responsiva com tipografia infantil e temas vibrantes.
- `app.js`: Lógica do jogo, sintetizador de som Web Audio, voz do Calisto, confetes e proteção XSS (`escapeHtml`).
- `mascot3d.js`: Modelo Three.js 3D do periquito Ringneck com asas articuladas, olhos seguidores e física de voo.
- `server.js`: Servidor Node.js local (`node server.js`) — serve o site em `http://127.0.0.1:8085` com a API `/api/fetch-workspace`, cabeçalhos de segurança, rate limit e proteção contra path traversal.
- `data/workspaces.js`: Banco de dados dos 10 workspaces com vídeos, cartões e quizzes.
- `.github/workflows/ci.yml`: CI com Gitleaks (secret scanning) + `node --check` (sintaxe).
- `assets/`: Áudios reais de Ringneck e fotos do mascote.

## Ambiente na nuvem

Instalação, locks, diagnóstico e separação desenvolvimento/produção estão documentados em
[`antigravity-config/cloud/README.md`](../antigravity-config/cloud/README.md) no workspace com os sete checkouts.
No GitHub: [guia do ambiente](https://github.com/avilarezende/antigravity-config/blob/main/cloud/README.md).
