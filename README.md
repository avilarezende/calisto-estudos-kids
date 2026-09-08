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
- 🌐 **100% Gratuito & Serverless**: Roda no GitHub Pages sem custos.

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
- `app.js`: Lógica do jogo, sintetizador de som Web Audio, voz do Calisto e confetes.
- `mascot3d.js`: Modelo Three.js 3D do periquito Ringneck com asas articuladas, olhos seguidores e física de voo.
- `data/workspaces.js`: Banco de dados dos 10 workspaces com vídeos, cartões e quizzes.
- `assets/`: Áudios reais de Ringneck e fotos do mascote.
