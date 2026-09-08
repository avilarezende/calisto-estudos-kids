/**
 * ====================================================================
 * AVENTURA DO SABER COM O CALISTO 🦜 - VOZ MASCULINA, ENVELHECIDA & RACHADA
 * ====================================================================
 */

// ESTADO GLOBAL DA APLICAÇÃO
const AppState = {
  soundEnabled: true,
  childName: localStorage.getItem('CALISTO_CHILD_NAME') || '',
  stars: parseInt(localStorage.getItem('CALISTO_STARS') || '0', 10),
  trophies: parseInt(localStorage.getItem('CALISTO_TROPHIES') || '0', 10),
  completedWorkspaces: JSON.parse(localStorage.getItem('CALISTO_COMPLETED') || '[]'),
  currentWorkspace: null,
  currentFlashcardIdx: 0,
  currentQuizIdx: 0,
  quizLives: 3,
  quizAnswerLocked: false
};
window.AppState = AppState;

// ====================================================================
// SINTETIZADOR E GERENCIADOR DE GRASNIDO CURTO REAL DE RINGNECK
// ====================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.realChirpAudio = new Audio('assets/ringneck_chirp.ogg');
    this.realChirpAudio.volume = 0.7;
    this.audioCutTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // GRASNIDO CURTO E RÁPIDO DO RINGNECK (0.42 segundos!)
  playRingneckRealChirp() {
    if (!AppState.soundEnabled) return;
    try {
      this.realChirpAudio.currentTime = 0;
      clearTimeout(this.audioCutTimer);
      const playPromise = this.realChirpAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.audioCutTimer = setTimeout(() => {
            this.realChirpAudio.pause();
            this.realChirpAudio.currentTime = 0;
          }, 420);
        }).catch(() => this.playSynthBirdChirp());
      }
    } catch (e) {
      this.playSynthBirdChirp();
    }
  }

  playSynthBirdChirp() {
    if (!AppState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2100, time);
    osc.frequency.exponentialRampToValueAtTime(3200, time + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1200, time + 0.12);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  playPop() {
    if (!AppState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playCorrect() {
    if (!AppState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [659.25, 880.00, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.2);
    });
  }

  playWrong() {
    if (!AppState.soundEnabled) return;
    this.playRingneckRealChirp();
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playFanfare() {
    if (!AppState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const fanfare = [
      { f: 659.25, d: 0.09 },
      { f: 880.00, d: 0.09 },
      { f: 1046.5, d: 0.09 },
      { f: 1318.5, d: 0.35 }
    ];
    let time = this.ctx.currentTime;
    fanfare.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.f, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + item.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + item.d);
      time += item.d;
    });
  }
}

const sounds = new SoundFX();
window.sounds = sounds;

// ====================================================================
// VOZ MASCULINA, RACHADA & ENVELHECIDA DE BRUXO/SÁBIO DO CALISTO
// ====================================================================
function selecionarVozMasculina() {
  if (!('speechSynthesis' in window)) return { voice: null, isMale: false };
  const voices = window.speechSynthesis.getVoices() || [];

  const maleKeywords = [
    'daniel', 'antonio', 'antônio', 'yago', 'felipe', 'male', 'homem',
    'bruno', 'brazil male', 'duarte', 'ricardo', 'lucas', 'thiago', 'david', 'jorge'
  ];
  const femaleKeywords = [
    'maria', 'francisca', 'helena', 'leticia', 'letícia', 'luciana',
    'vitória', 'vitoria', 'female', 'mulher', 'zira', 'raquel', 'yasmin', 'camila'
  ];

  // 1. Busca específica por vozes masculinas em pt-BR (Daniel, Antonio, Yago, etc.)
  const ptBrMale = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPtBr = lang.includes('pt-br') || lang === 'pt_br';
    const isMale = maleKeywords.some(k => name.includes(k));
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPtBr && isMale && !isFemale;
  });
  if (ptBrMale) return { voice: ptBrMale, isMale: true };

  // 2. Qualquer voz masculina em português
  const ptMale = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPt = lang.includes('pt');
    const isMale = maleKeywords.some(k => name.includes(k));
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPt && isMale && !isFemale;
  });
  if (ptMale) return { voice: ptMale, isMale: true };

  // 3. Voz em pt-BR não explicitamente feminina
  const ptBrNeutral = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPtBr = lang.includes('pt-br') || lang === 'pt_br';
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPtBr && !isFemale;
  });
  if (ptBrNeutral) return { voice: ptBrNeutral, isMale: true };

  // 4. Qualquer voz em português
  const anyPt = voices.find(v => v.lang.toLowerCase().includes('pt'));
  if (anyPt) {
    const isFemale = femaleKeywords.some(k => anyPt.name.toLowerCase().includes(k));
    return { voice: anyPt, isMale: !isFemale };
  }

  return { voice: voices[0] || null, isMale: true };
}

function limparTextoParaFala(texto) {
  if (!texto) return '';
  return texto
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[*_#`~>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

window.activeUtterance = null;

function falarTexto(textoOriginal) {
  if (!AppState.soundEnabled) return;

  const textoLimpo = limparTextoParaFala(textoOriginal);
  if (!textoLimpo) return;

  // Toca o grasnido real do ringneck
  try {
    sounds.playRingneckRealChirp();
  } catch (e) {
    console.warn('Audio play error:', e);
  }

  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(textoLimpo);
    window.activeUtterance = utterance; // Evita que o garbage collector do navegador corte a fala
    utterance.lang = 'pt-BR';

    // VOZ MASCULINA, ENVELHECIDA & RACHADA (Estilo Bruxo / Feiticeiro Sábio Ágil)
    const { voice, isMale } = selecionarVozMasculina();
    if (voice) {
      utterance.voice = voice;
    }

    if (isMale) {
      utterance.pitch = 1.48; // Timbre rachado e envelhecido
      utterance.rate = 1.34;  // Ágil e expressivo
    } else {
      utterance.pitch = 0.70; // Fallback rouco
      utterance.rate = 1.34;
    }

    utterance.onstart = () => {
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(true);
    };
    utterance.onend = () => {
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
      window.activeUtterance = null;
    };
    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
      window.activeUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Erro na síntese de fala:', err);
    if (window.setParrotSpeakingAll) {
      window.setParrotSpeakingAll(true);
      setTimeout(() => window.setParrotSpeakingAll(false), 2000);
    }
  }
}

window.falarTexto = falarTexto;

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// ====================================================================
// MOTOR DE CONFETES
// ====================================================================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 70) {
    if (!this.ctx) return;
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#F43F5E'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        life: 1
      });
    }
    if (!this.animId) this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rotation += p.rotSpeed;
      p.life -= 0.012;
      p.alpha = Math.max(0, p.life);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const confetti = new ConfettiEngine('confetti-canvas');

// ====================================================================
// GESTÃO DO NOME DA CRIANÇA
// ====================================================================
function verificarNomeCrianca() {
  if (!AppState.childName) {
    abrirModalNome();
  } else {
    atualizarNomeNaInterface();
  }
}

function abrirModalNome() {
  const modal = document.getElementById('name-modal');
  modal.classList.add('open');
  const input = document.getElementById('input-child-name');
  input.value = AppState.childName || '';
  setTimeout(() => {
    input.focus();
    falarTexto('Hehehe! Olá! Eu sou o velho Calisto! Como você se chama, pequeno explorador?');
  }, 300);
}

function salvarNomeCrianca() {
  const input = document.getElementById('input-child-name');
  const nome = input.value.trim();
  if (!nome) return;

  AppState.childName = nome;
  localStorage.setItem('CALISTO_CHILD_NAME', nome);
  atualizarNomeNaInterface();

  document.getElementById('name-modal').classList.remove('open');
  sounds.playCorrect();
  confetti.burst(50);
  if (window.setParrotMoodAll) window.setParrotMoodAll('happy');

  const saudacao = `Hehehe! Muito bem, ${nome}! Eu sou o velho Calisto. Vamos explorar os mundos do saber juntos!`;
  falarTexto(saudacao);

  if (window.calistoWanderer) {
    window.calistoWanderer.mostrarFala(`Vamos lá, ${nome}!`, 4000);
  }
}
window.salvarNomeCrianca = salvarNomeCrianca;

function atualizarNomeNaInterface() {
  const nome = AppState.childName || 'Explorador';
  document.getElementById('header-child-name').textContent = nome;
  document.getElementById('hero-child-name').textContent = nome;
  document.getElementById('cert-child-name').value = nome;
}

// ====================================================================
// RENDERIZAÇÃO E NAVEGAÇÃO DOS WORKSPACES
// ====================================================================
function atualizarEstatisticas() {
  document.getElementById('user-stars').textContent = AppState.stars;
  document.getElementById('user-trophies').textContent = AppState.trophies;
  localStorage.setItem('CALISTO_STARS', AppState.stars);
  localStorage.setItem('CALISTO_TROPHIES', AppState.trophies);
  localStorage.setItem('CALISTO_COMPLETED', JSON.stringify(AppState.completedWorkspaces));
}

function renderizarGridWorkspaces() {
  const container = document.getElementById('workspaces-grid-container');
  container.innerHTML = '';
  const data = window.WORKSPACES_DATA || [];

  document.getElementById('workspace-count-tag').textContent = `${data.length} Temas Prontos`;

  data.forEach((ws, index) => {
    const isCompleted = AppState.completedWorkspaces.includes(ws.id);
    const card = document.createElement('article');
    card.className = 'workspace-card';
    card.innerHTML = `
      <div class="card-header-bar" style="background: ${ws.cor || 'linear-gradient(135deg, #10B981, #059669)'}">
        <div class="card-icon-circle">${ws.icone || '📖'}</div>
        <span class="card-badge">Módulo #${index + 1}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ws.titulo}</h3>
        <p class="card-desc">${ws.subtitulo || ws.resumo}</p>
        <div class="card-footer">
          <span class="card-status">
            ${isCompleted ? '⭐ Concluído!' : '🌱 Pronto para Explorar'}
          </span>
          <button class="card-start-btn">Entrar ➡️</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      sounds.playPop();
      abrirWorkspace(ws);
    });

    container.appendChild(card);
  });
}

// ====================================================================
// SALA DE ESTUDOS DO WORKSPACE
// ====================================================================
function abrirWorkspace(ws) {
  AppState.currentWorkspace = ws;
  AppState.currentFlashcardIdx = 0;
  AppState.currentQuizIdx = 0;
  AppState.quizLives = 3;
  AppState.quizAnswerLocked = false;

  const nome = AppState.childName || 'Explorador';

  document.getElementById('current-workspace-icon').textContent = ws.icone || '📖';
  document.getElementById('current-workspace-title').textContent = ws.titulo;
  document.getElementById('current-workspace-sub').textContent = ws.subtitulo || '';

  const videoFrame = document.getElementById('study-video-frame');
  videoFrame.src = ws.videoUrl || '';

  document.getElementById('study-summary-text').textContent = ws.resumo;
  const topicsList = document.getElementById('study-topics-list');
  topicsList.innerHTML = '';
  (ws.topicos || []).forEach(topico => {
    const li = document.createElement('li');
    li.textContent = topico;
    topicsList.appendChild(li);
  });

  const curList = document.getElementById('study-curiosities-list');
  curList.innerHTML = '';
  (ws.curiosidades || []).forEach(cur => {
    const li = document.createElement('li');
    li.textContent = cur;
    curList.appendChild(li);
  });

  carregarFlashcardAtual();
  carregarQuizAtual();
  ativarAba('tab-video');

  const calistoIntro = `Hehehe! ${nome}, bem-vindo ao mundo ${ws.titulo}! Assista ao vídeo comigo ou venha para os cartões mágicos e o quiz!`;
  document.getElementById('paco-study-speech').textContent = calistoIntro;

  document.getElementById('hub-view').style.display = 'none';
  document.getElementById('study-view').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.parrot3DInstances && window.parrot3DInstances.study) {
    setTimeout(() => window.parrot3DInstances.study.onResize(), 100);
  }

  if (window.calistoWanderer) {
    window.calistoWanderer.mostrarFala(`Vamos estudar ${ws.titulo}, ${nome}!`, 3000);
  }
}

function fecharWorkspace() {
  document.getElementById('study-video-frame').src = '';
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  document.getElementById('study-view').classList.remove('active');
  document.getElementById('hub-view').style.display = 'block';
  renderizarGridWorkspaces();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================================================================
// CONTROLE DE ABAS DA SALA DE ESTUDOS
// ====================================================================
function ativarAba(tabId) {
  sounds.playPop();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  const speech = document.getElementById('paco-study-speech');
  const nome = AppState.childName || 'explorador';

  if (tabId === 'tab-video') {
    speech.textContent = `Assista ao vídeo explicativo com atenção, ${nome}, para aprender todos os segredos!`;
  } else if (tabId === 'tab-flashcards') {
    speech.textContent = `Toque no cartão para girar e ver a resposta mágica, ${nome}!`;
  } else if (tabId === 'tab-quiz') {
    speech.textContent = `Hora do desafio, ${nome}! Quero ver se sua memória é tão boa quanto o meu bico afiado!`;
  } else if (tabId === 'tab-curiosities') {
    speech.textContent = `Descubra curiosidades incríveis que pouca gente sabe, ${nome}!`;
  }
}

// ====================================================================
// FLASHCARDS 3D
// ====================================================================
function carregarFlashcardAtual() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.flashcards || ws.flashcards.length === 0) return;

  const card = ws.flashcards[AppState.currentFlashcardIdx];
  const inner = document.getElementById('flashcard-inner');
  inner.classList.remove('flipped');

  document.getElementById('fc-question').textContent = card.pergunta;
  document.getElementById('fc-answer').textContent = card.resposta;
  document.getElementById('fc-counter').textContent = `${AppState.currentFlashcardIdx + 1} / ${ws.flashcards.length}`;
}

function virarFlashcard() {
  sounds.playPop();
  document.getElementById('flashcard-inner').classList.toggle('flipped');
}

function proximoFlashcard() {
  const ws = AppState.currentWorkspace;
  if (!ws) return;
  sounds.playPop();
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % ws.flashcards.length;
  carregarFlashcardAtual();
}

function anteriorFlashcard() {
  const ws = AppState.currentWorkspace;
  if (!ws) return;
  sounds.playPop();
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx - 1 + ws.flashcards.length) % ws.flashcards.length;
  carregarFlashcardAtual();
}

// ====================================================================
// QUIZ GAMIFICADO
// ====================================================================
function carregarQuizAtual() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.quiz || ws.quiz.length === 0) return;

  AppState.quizAnswerLocked = false;
  const q = ws.quiz[AppState.currentQuizIdx];
  const total = ws.quiz.length;

  document.getElementById('quiz-status-indicator').textContent = `Pergunta ${AppState.currentQuizIdx + 1} de ${total}`;
  
  let livesStr = '';
  for (let i = 0; i < AppState.quizLives; i++) livesStr += '❤️';
  if (AppState.quizLives === 0) livesStr = '💔 Sem vidas';
  document.getElementById('quiz-lives-icons').textContent = livesStr;

  document.getElementById('quiz-question-text').textContent = q.pergunta;
  
  const fbBox = document.getElementById('quiz-feedback-box');
  fbBox.className = 'quiz-feedback-box';
  
  const optsContainer = document.getElementById('quiz-options-container');
  optsContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.opcoes.forEach((opcao, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `
      <span class="quiz-option-letter">${letters[idx] || (idx + 1)}</span>
      <span>${opcao}</span>
    `;
    btn.addEventListener('click', () => verificarRespostaQuiz(idx, btn));
    optsContainer.appendChild(btn);
  });
}

function verificarRespostaQuiz(selectedIdx, btnElement) {
  if (AppState.quizAnswerLocked) return;
  AppState.quizAnswerLocked = true;

  const ws = AppState.currentWorkspace;
  const q = ws.quiz[AppState.currentQuizIdx];
  const correctIdx = q.respostaCorreta;
  const isCorrect = (selectedIdx === correctIdx);
  const nome = AppState.childName || 'campeão';

  const fbBox = document.getElementById('quiz-feedback-box');
  const fbMsg = document.getElementById('quiz-feedback-msg');
  const fbExp = document.getElementById('quiz-feedback-explanation');
  const pacoSpeech = document.getElementById('paco-study-speech');

  if (isCorrect) {
    sounds.playCorrect();
    confetti.burst(50);
    if (window.setParrotMoodAll) window.setParrotMoodAll('happy');

    btnElement.classList.add('correct');
    fbBox.className = 'quiz-feedback-box show correct-fb';
    fbMsg.innerHTML = `🎉 Resposta Certa! O Calisto adorou, ${nome}! ⭐`;
    fbExp.textContent = q.explicacao || 'Muito bem pensado!';
    pacoSpeech.textContent = `Hehehe! Ora vejam só, ${nome}! Resposta certíssima! ${q.explicacao || 'Você é um gênio!'}`;
    falarTexto(`Hehehe! Ora vejam só, ${nome}! Resposta certíssima! ${q.explicacao || ''}`);
  } else {
    sounds.playWrong();
    if (window.setParrotMoodAll) window.setParrotMoodAll('angry');

    btnElement.classList.add('wrong');
    AppState.quizLives = Math.max(0, AppState.quizLives - 1);
    
    const allBtns = document.querySelectorAll('.quiz-option-btn');
    if (allBtns[correctIdx]) allBtns[correctIdx].classList.add('correct');

    fbBox.className = 'quiz-feedback-box show wrong-fb';
    fbMsg.innerHTML = `Ai minhas penas, ${nome}! Olha a explicação do Calisto:`;
    fbExp.textContent = q.explicacao || 'Preste atenção na dica do Calisto!';
    pacoSpeech.textContent = `Ai minhas peninhas velhas, ${nome}! A resposta certa é a verde. Olha aqui: ${q.explicacao || ''}`;
    falarTexto(`Ai minhas peninhas velhas, ${nome}! A resposta certa era outra! Olha a dica do Calisto!`);
  }

  let livesStr = '';
  for (let i = 0; i < AppState.quizLives; i++) livesStr += '❤️';
  if (AppState.quizLives === 0) livesStr = '💔 Tente novamente!';
  document.getElementById('quiz-lives-icons').textContent = livesStr;
}

function avancarQuiz() {
  sounds.playPop();
  const ws = AppState.currentWorkspace;
  if (!ws) return;

  AppState.currentQuizIdx++;
  if (AppState.currentQuizIdx < ws.quiz.length) {
    carregarQuizAtual();
  } else {
    concluirWorkspace();
  }
}

function concluirWorkspace() {
  const ws = AppState.currentWorkspace;
  const nome = AppState.childName || 'Pequeno Explorador';
  sounds.playFanfare();
  confetti.burst(140);
  if (window.setParrotMoodAll) window.setParrotMoodAll('happy');

  AppState.stars += 3;
  if (!AppState.completedWorkspaces.includes(ws.id)) {
    AppState.completedWorkspaces.push(ws.id);
    AppState.trophies += 1;
  }
  atualizarEstatisticas();

  document.getElementById('cert-child-name').value = nome;
  document.getElementById('victory-modal').classList.add('open');
  falarTexto(`Hehehe! Vitória, ${nome}! Pelos meus cem anos de penas, nunca vi aluno tão dedicado! Parabéns!`);
}

// ====================================================================
// MODAL DO EDUCADOR
// ====================================================================
function abrirModalEducador() {
  sounds.playPop();
  const modal = document.getElementById('educator-modal');
  const textarea = document.getElementById('json-editor-input');
  textarea.value = JSON.stringify(window.WORKSPACES_DATA, null, 2);
  modal.classList.add('open');
}

function fecharModalEducador() {
  document.getElementById('educator-modal').classList.remove('open');
}

function salvarDadosEducador() {
  const textarea = document.getElementById('json-editor-input');
  try {
    const parsed = JSON.parse(textarea.value);
    if (!Array.isArray(parsed)) throw new Error('Os dados precisam ser uma lista de workspaces (Array).');
    
    window.WORKSPACES_DATA = parsed;
    window.salvarWorkspaces(parsed);
    sounds.playCorrect();
    confetti.burst(50);
    alert('✅ Sucesso! Os 10 Workspaces foram atualizados!');
    fecharModalEducador();
    renderizarGridWorkspaces();
  } catch (err) {
    sounds.playWrong();
    alert('❌ Erro no formato JSON: ' + err.message);
  }
}

function restaurarPadroesEducador() {
  if (confirm('Deseja realmente restaurar os 10 temas educativos originais do Calisto?')) {
    window.WORKSPACES_DATA = window.restaurarWorkspacesPadrao();
    sounds.playPop();
    document.getElementById('json-editor-input').value = JSON.stringify(window.WORKSPACES_DATA, null, 2);
    renderizarGridWorkspaces();
    alert('↺ Padrões restaurados com sucesso!');
  }
}

// ====================================================================
// INICIALIZAÇÃO DOS EVENTOS & 3D (COM TRATAMENTO DE ERROS ROBUSTO)
// ====================================================================
function safeBind(idOrElement, eventName, handler) {
  const el = (typeof idOrElement === 'string') ? document.getElementById(idOrElement) : idOrElement;
  if (el) {
    el.addEventListener(eventName, handler);
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarEstatisticas();
  renderizarGridWorkspaces();
  verificarNomeCrianca();

  if (window.initParrot3D) {
    setTimeout(window.initParrot3D, 150);
  }

  // Navegação e Hub
  safeBind('btn-home', 'click', () => {
    sounds.playPop();
    fecharWorkspace();
  });

  safeBind('btn-edit-name', 'click', () => {
    sounds.playPop();
    abrirModalNome();
  });

  safeBind('btn-back-hub', 'click', () => {
    sounds.playPop();
    fecharWorkspace();
  });

  // Botão de Som / Voz
  const toggleSoundHandler = () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    const btns = [document.getElementById('btn-toggle-sound'), document.getElementById('btn-sound-toggle')];
    btns.forEach(b => {
      if (b) b.textContent = AppState.soundEnabled ? '🔊' : '🔇';
    });
    sounds.playPop();
    if (!AppState.soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
    }
  };
  safeBind('btn-toggle-sound', 'click', toggleSoundHandler);
  safeBind('btn-sound-toggle', 'click', toggleSoundHandler);

  // Botões de Fala do Calisto (Hero & Sala de Estudos)
  safeBind('btn-speak-greeting', 'click', () => {
    const el = document.getElementById('hub-greeting-text');
    if (el) falarTexto(el.textContent);
  });

  safeBind('btn-paco-speak', 'click', () => {
    const el = document.getElementById('paco-study-speech');
    if (el) falarTexto(el.textContent);
  });

  // Mexer / Provocar Calisto
  safeBind('btn-tease-paco', 'click', () => {
    if (window.parrot3DInstances && window.parrot3DInstances.hero) {
      window.parrot3DInstances.hero.provocar();
    }
  });

  // Chamar Calisto Voador
  const summonHandler = () => {
    sounds.playRingneckRealChirp();
    if (window.calistoWanderer) {
      window.calistoWanderer.flyTo(window.innerWidth / 2 - 75, 110);
    }
  };
  safeBind('btn-summon-calisto', 'click', summonHandler);
  safeBind('btn-call-calisto', 'click', summonHandler);

  // Abas da Sala de Estudos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => ativarAba(btn.dataset.tab));
  });

  // Flashcards
  safeBind('flashcard-element', 'click', virarFlashcard);
  safeBind('fc-next-btn', 'click', proximoFlashcard);
  safeBind('fc-prev-btn', 'click', anteriorFlashcard);

  // Quiz
  safeBind('btn-next-quiz', 'click', avancarQuiz);

  // Vitória
  safeBind('btn-close-victory', 'click', () => {
    document.getElementById('victory-modal').classList.remove('open');
  });
  safeBind('btn-claim-victory', 'click', () => {
    document.getElementById('victory-modal').classList.remove('open');
    fecharWorkspace();
  });

  // Central do Educador
  safeBind('btn-open-educator', 'click', abrirModalEducador);
  safeBind('btn-close-educator', 'click', fecharModalEducador);
  safeBind('btn-save-json', 'click', salvarDadosEducador);
  safeBind('btn-reset-defaults', 'click', restaurarPadroesEducador);

  document.querySelectorAll('.educator-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.educator-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ed-tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.edTab);
      if (target) target.style.display = 'block';
    });
  });

  safeBind('btn-copy-prompt', 'click', () => {
    const promptEl = document.getElementById('gemini-prompt-text');
    if (promptEl) {
      navigator.clipboard.writeText(promptEl.innerText).then(() => {
        sounds.playPop();
        const btn = document.getElementById('btn-copy-prompt');
        if (btn) {
          btn.textContent = '✅ Copiado com Sucesso!';
          setTimeout(() => { btn.textContent = '📋 Copiar Prompt do Gemini'; }, 2500);
        }
      });
    }
  });
});
