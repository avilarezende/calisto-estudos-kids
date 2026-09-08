# 🦜 Aventura do Saber com o Paco - Portal Infantil Gamificado

Uma plataforma web interativa, responsiva e divertida criada especialmente para revisão infantil de conteúdos guiados por um **Mascote Papagaio 3D (Paco)**, com vídeos explicativos, flashcards 3D, quizzes com pontuação, estrelas, troféus e voz nativa.

---

## 🌟 Principais Recursos

- 🦜 **Mascote Paco Interativo**: Fala em voz alta em português (Web Speech API), tem reações dinâmicas, comemorações e dicas de estudo.
- 🗂️ **10 Workspaces de Conteúdo**: Pré-populados com temas educativos (Sistema Solar, Dinossauros, Plantas, Oceano, Matemática, Corpo Humano, Invenções, Clima, Animais e Histórias).
- 📺 **Vídeos Explicativos**: Player integrado para cada um dos 10 módulos.
- 🃏 **Cartões Mágicos (Flashcards 3D)**: Cartões giratórios com efeito 3D para fixação da memória.
- 🏆 **Missão Desafio (Quiz Gamificado)**: Vidas/corações, estrelas, pontuação e chuva de confetes nas respostas corretas.
- ⚙️ **Modo Educador**: Permite editar os 10 workspaces direto no navegador ou colar conteúdos gerados pelo seu **Gemini Notebook**.
- 🌐 **100% Gratuito**: Sem custos de hospedagem nem de APIs pagas.

---

## 🚀 Como Hospedar Gratuitamente no GitHub Pages (Passo a Passo)

### Passo 1: Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new) e crie um novo repositório (ex: `aventura-do-paco`).
2. Deixe o repositório como **Público** (Public).

### Passo 2: Enviar os Arquivos
Você pode enviar os arquivos desta pasta diretamente pelo GitHub web (arrastando os arquivos) ou pelo terminal:

```bash
git init
git add .
git commit -m "Primeira versão da Aventura do Saber com o Paco"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aventura-do-paco.git
git push -u origin main
```

### Passo 3: Ativar o GitHub Pages (Grátis com 1 Clique)
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Branch**, selecione `main` e clique em **Save**.
4. Em menos de 1 minuto, seu site estará no ar no endereço:  
   `https://SEU_USUARIO.github.io/aventura-do-paco/` 🎉

---

## 📝 Como Personalizar os Temas e Conteúdos

Você pode editar os 10 workspaces de 2 formas:

### Opção A: Editando o arquivo `data/workspaces.js`
Abra o arquivo `data/workspaces.js` no próprio GitHub e altere os títulos, links de vídeo do YouTube, perguntas do quiz e flashcards.

### Opção B: Pelo Botão "Modo Educador" no Site
No canto superior direito da página, clique em **⚙️ Modo Educador**:
1. Copie o prompt gerador para o seu **Gemini Notebook**.
2. Cole a resposta do Gemini na aba **Editar Dados (JSON)** e clique em **Salvar & Aplicar Agora**.

---

## 🎨 Estrutura de Arquivos
- `index.html`: Interface visual principal e modais.
- `style.css`: Estilização moderna, responsiva com tipografia infantil e temas vibrantes.
- `app.js`: Lógica do jogo, sintetizador de som Web Audio, voz Web Speech e confetes.
- `data/workspaces.js`: Configuração dos 10 workspaces com vídeos, cartões e quizzes.
- `assets/mascot.jpg`: Imagem do Mascote Papagaio 3D.
