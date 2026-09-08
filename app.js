/**
 * ====================================================================
 * AVENTURA DO SABER COM O CALISTO 🦜 - MOTOR PRINCIPAL & ERGONOMIA
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
  quizAnswerLocked: false,
  currentSlideIdx: 0,
  isAutoPlaying: false,
  autoPlayTimer: null,
  educatorAuthenticated: false
};
window.AppState = AppState;

// ====================================================================
// SINTETIZADOR E GERENCIADOR DE ÁUDIO / GRASNIDO DO RINGNECK
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
// VOZ MASCULINA, ENVELHECIDA & EXPRESSIVA DO CALISTO
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

  const ptBrMale = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPtBr = lang.includes('pt-br') || lang === 'pt_br';
    const isMale = maleKeywords.some(k => name.includes(k));
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPtBr && isMale && !isFemale;
  });
  if (ptBrMale) return { voice: ptBrMale, isMale: true };

  const ptMale = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPt = lang.includes('pt');
    const isMale = maleKeywords.some(k => name.includes(k));
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPt && isMale && !isFemale;
  });
  if (ptMale) return { voice: ptMale, isMale: true };

  const ptBrNeutral = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isPtBr = lang.includes('pt-br') || lang === 'pt_br';
    const isFemale = femaleKeywords.some(k => name.includes(k));
    return isPtBr && !isFemale;
  });
  if (ptBrNeutral) return { voice: ptBrNeutral, isMale: true };

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

function falarTexto(textoOriginal, callbackOnEnd = null) {
  if (!AppState.soundEnabled) {
    if (callbackOnEnd) callbackOnEnd();
    return;
  }

  const textoLimpo = limparTextoParaFala(textoOriginal);
  if (!textoLimpo) {
    if (callbackOnEnd) callbackOnEnd();
    return;
  }

  try {
    sounds.playRingneckRealChirp();
  } catch (e) {}

  if (!('speechSynthesis' in window)) {
    if (callbackOnEnd) callbackOnEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(textoLimpo);
    window.activeUtterance = utterance;
    utterance.lang = 'pt-BR';

    const { voice, isMale } = selecionarVozMasculina();
    if (voice) utterance.voice = voice;

    if (isMale) {
      utterance.pitch = 1.46;
      utterance.rate = 1.32;
    } else {
      utterance.pitch = 0.72;
      utterance.rate = 1.32;
    }

    utterance.onstart = () => {
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(true);
    };

    utterance.onend = () => {
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
      window.activeUtterance = null;
      if (callbackOnEnd) callbackOnEnd();
    };

    utterance.onerror = () => {
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
      window.activeUtterance = null;
      if (callbackOnEnd) callbackOnEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Erro de síntese de voz:', err);
    if (callbackOnEnd) callbackOnEnd();
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
  if (modal) modal.classList.add('open');
  const input = document.getElementById('input-child-name');
  if (input) {
    input.value = AppState.childName || '';
    setTimeout(() => {
      input.focus();
      falarTexto('Hehehe! Olá! Eu sou o sábio Calisto! Como você se chama, pequeno explorador?');
    }, 300);
  }
}

function salvarNomeCrianca() {
  const input = document.getElementById('input-child-name');
  const nome = input ? input.value.trim() : '';
  if (!nome) return;

  AppState.childName = nome;
  localStorage.setItem('CALISTO_CHILD_NAME', nome);
  atualizarNomeNaInterface();

  const modal = document.getElementById('name-modal');
  if (modal) modal.classList.remove('open');
  sounds.playCorrect();
  confetti.burst(50);
  if (window.setParrotMoodAll) window.setParrotMoodAll('happy');

  const saudacao = `Hehehe! Muito bem, ${nome}! Eu sou o sábio Calisto. Vamos explorar os mundos do saber juntos!`;
  falarTexto(saudacao);

  if (window.calistoWanderer) {
    window.calistoWanderer.mostrarFala(`Vamos lá, ${nome}!`, 3500);
  }
}
window.salvarNomeCrianca = salvarNomeCrianca;

function atualizarNomeNaInterface() {
  const nome = AppState.childName || 'Explorador';
  const hChild = document.getElementById('header-child-name');
  const heroChild = document.getElementById('hero-child-name');
  const certChild = document.getElementById('cert-child-name');
  if (hChild) hChild.textContent = nome;
  if (heroChild) heroChild.textContent = nome;
  if (certChild) certChild.value = nome;
}

// ====================================================================
// RENDERIZAÇÃO DA GRADE PRINCIPAL INFANTIL (MUNDOS DO CONHECIMENTO)
// 100% LIMPA DE QUALQUER CONTROLE OU TAG TÉCNICA
// ====================================================================
function atualizarEstatisticas() {
  const uStars = document.getElementById('user-stars');
  const uTrophies = document.getElementById('user-trophies');
  if (uStars) uStars.textContent = AppState.stars;
  if (uTrophies) uTrophies.textContent = AppState.trophies;
  localStorage.setItem('CALISTO_STARS', AppState.stars);
  localStorage.setItem('CALISTO_TROPHIES', AppState.trophies);
  localStorage.setItem('CALISTO_COMPLETED', JSON.stringify(AppState.completedWorkspaces));
}

function renderizarGridWorkspaces() {
  const container = document.getElementById('workspaces-grid-container');
  if (!container) return;
  container.innerHTML = '';
  const data = window.WORKSPACES_DATA || [];

  const countTag = document.getElementById('workspace-count-tag');
  if (countTag) countTag.textContent = `${data.length} Mundos Mágicos`;

  data.forEach((ws, index) => {
    const isCompleted = AppState.completedWorkspaces.includes(ws.id);
    const card = document.createElement('article');
    card.className = 'workspace-card';
    card.setAttribute('aria-label', `Mundo ${ws.titulo}`);

    card.innerHTML = `
      <div class="card-header-bar" style="background: ${ws.cor || 'linear-gradient(135deg, #10B981, #059669)'}">
        <div class="card-icon-circle">${ws.icone || '📖'}</div>
        <span class="card-badge">Mundo #${index + 1}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ws.titulo}</h3>
        <p class="card-desc">${ws.subtitulo || ws.resumo}</p>
        <div class="card-footer-meta">
          <span class="card-status ${isCompleted ? 'completed' : ''}">
            ${isCompleted ? '⭐ Concluído!' : '🌱 Novo Mundo'}
          </span>
        </div>
        <div class="workspace-actions-row">
          <button type="button" class="ws-action-btn pres" title="Assistir Apresentação Interativa 3D">
            🎬 Apresentação 3D
          </button>
          <button type="button" class="ws-action-btn study" title="Jogar, ver infográficos e responder quizzes">
            🎮 Jogar & Estudar
          </button>
        </div>
      </div>
    `;

    // Botão Apresentação 3D
    const btnPres = card.querySelector('.ws-action-btn.pres');
    if (btnPres) {
      btnPres.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playPop();
        abrirApresentacao(ws);
      });
    }

    // Botão Jogar e Estudar
    const btnStudy = card.querySelector('.ws-action-btn.study');
    if (btnStudy) {
      btnStudy.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playPop();
        abrirWorkspace(ws);
      });
    }

    // Clique geral no cartão abre a apresentação
    card.addEventListener('click', () => {
      sounds.playPop();
      abrirApresentacao(ws);
    });

    container.appendChild(card);
  });
}

// ====================================================================
// MODO APRESENTAÇÃO DO CALISTO 3D (SLIDESHOW INTERATIVO)
// ====================================================================
function abrirApresentacao(ws) {
  AppState.currentWorkspace = ws;
  AppState.currentSlideIdx = 0;
  AppState.isAutoPlaying = false;
  clearTimeout(AppState.autoPlayTimer);

  if (!ws.slides || ws.slides.length === 0) {
    ws.slides = window.gerarSlidesParaWorkspace(ws);
  }

  const titleEl = document.getElementById('pres-workspace-title');
  if (titleEl) titleEl.textContent = ws.titulo;

  const sourceBadge = document.getElementById('pres-source-badge');
  if (sourceBadge) {
    sourceBadge.innerHTML = '🦜 Apresentação do Calisto';
    sourceBadge.style.background = '#EEF2FF';
    sourceBadge.style.color = '#4338CA';
  }

  const autoBtn = document.getElementById('btn-pres-autoplay');
  if (autoBtn) {
    autoBtn.classList.remove('active-autoplay');
    autoBtn.innerHTML = '▶️ Auto-Play';
  }

  const hub = document.getElementById('hub-view');
  const study = document.getElementById('study-view');
  const pres = document.getElementById('presentation-view');

  if (hub) hub.style.display = 'none';
  if (study) study.classList.remove('active');
  if (pres) pres.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.parrot3DInstances && window.parrot3DInstances.presentation) {
    setTimeout(() => window.parrot3DInstances.presentation.onResize(), 120);
  }

  if (window.setParrotMoodAll) window.setParrotMoodAll('happy');

  carregarSlideAtual();
}

function fecharApresentacao() {
  AppState.isAutoPlaying = false;
  clearTimeout(AppState.autoPlayTimer);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);

  const pres = document.getElementById('presentation-view');
  const hub = document.getElementById('hub-view');

  if (pres) pres.classList.remove('active');
  if (hub) hub.style.display = 'block';

  renderizarGridWorkspaces();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function carregarSlideAtual() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.slides || ws.slides.length === 0) return;

  const total = ws.slides.length;
  const slide = ws.slides[AppState.currentSlideIdx];
  const nome = AppState.childName || 'Pequeno Explorador';

  const slidePill = document.getElementById('pres-slide-pill');
  if (slidePill) slidePill.textContent = `Slide ${AppState.currentSlideIdx + 1} de ${total} ⭐`;
  
  const typeLabels = {
    'intro': '🌟 Abertura',
    'conceito': '📖 Fundamentos',
    'infografico': '📊 Mapa Visual',
    'audio': '🎙️ Áudio Overview',
    'curiosidade': '💡 Curiosidades',
    'desafio': '🃏 Desafio Rápido',
    'conclusao': '🏆 Conclusão'
  };
  const typePill = document.getElementById('pres-slide-type');
  if (typePill) typePill.textContent = typeLabels[slide.tipo] || '✨ Saber';

  const iconEl = document.getElementById('pres-slide-icon');
  const titleEl = document.getElementById('pres-slide-title');
  const subEl = document.getElementById('pres-slide-sub');

  if (iconEl) iconEl.textContent = slide.icone || ws.icone || '🌟';
  if (titleEl) titleEl.textContent = slide.titulo;
  if (subEl) subEl.textContent = slide.subtitulo || '';

  const highlightCard = document.getElementById('pres-slide-highlight-card');
  const highlightText = document.getElementById('pres-slide-highlight-text');
  if (slide.destaque && highlightCard && highlightText) {
    highlightCard.style.display = 'block';
    highlightText.textContent = slide.destaque;
  } else if (highlightCard) {
    highlightCard.style.display = 'none';
  }

  const presInfographicBox = document.getElementById('pres-slide-infographic-box');
  const presInfographicContent = document.getElementById('pres-infographic-content');
  if (slide.tipo === 'infografico' && slide.infografico && presInfographicBox && presInfographicContent) {
    presInfographicBox.style.display = 'block';
    renderizarInfograficoNoSlide(slide.infografico, presInfographicContent);
  } else if (presInfographicBox) {
    presInfographicBox.style.display = 'none';
  }

  const bulletsList = document.getElementById('pres-slide-bullets');
  if (bulletsList) {
    bulletsList.innerHTML = '';
    if (slide.tipo !== 'infografico' && slide.topicos && slide.topicos.length > 0) {
      slide.topicos.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic;
        bulletsList.appendChild(li);
      });
    }
  }

  const interactiveBox = document.getElementById('pres-slide-interactive-box');
  const interactiveQ = document.getElementById('pres-interactive-q');
  const interactiveA = document.getElementById('pres-interactive-a');
  if (slide.tipo === 'desafio' && slide.respostaDestaque && interactiveBox) {
    interactiveBox.style.display = 'block';
    if (interactiveQ) interactiveQ.textContent = slide.destaque || 'Desafio do Calisto';
    if (interactiveA) {
      interactiveA.style.display = 'none';
      interactiveA.textContent = slide.respostaDestaque;
    }
  } else if (interactiveBox) {
    interactiveBox.style.display = 'none';
  }

  const audioBox = document.getElementById('pres-slide-audio-box');
  const audioPlayer = document.getElementById('pres-audio-player');
  if (slide.tipo === 'audio' && slide.audioUrl && audioBox && audioPlayer) {
    audioBox.style.display = 'block';
    audioPlayer.src = slide.audioUrl;
  } else if (audioBox && audioPlayer) {
    audioBox.style.display = 'none';
    audioPlayer.src = '';
  }

  const speakerSpeech = document.getElementById('pres-speaker-speech');
  const textoFala = slide.falaCalisto || `Hehehe! Vamos aprender sobre ${slide.titulo}, ${nome}! Preste atenção aos detalhes!`;
  if (speakerSpeech) speakerSpeech.textContent = textoFala;

  const dotsContainer = document.getElementById('pres-dots-container');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = `pres-dot ${i === AppState.currentSlideIdx ? 'active' : ''}`;
      dot.title = `Ir para Slide ${i + 1}`;
      dot.addEventListener('click', () => irParaSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  narrarSlideAtual();
}

function renderizarInfograficoNoSlide(info, container) {
  if (!info || !container) return;
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'infographics-grid';

  (info.itens || []).forEach(it => {
    const card = document.createElement('div');
    card.className = 'infographic-card';
    card.innerHTML = `
      <div class="infographic-card-header">
        <span class="infographic-step-badge">${it.numero || '★'}</span>
        <span class="infographic-card-icon">${it.icone || '📌'}</span>
        <span class="infographic-card-title">${it.titulo}</span>
      </div>
      <p class="infographic-card-desc">${it.descricao}</p>
    `;
    grid.appendChild(card);
  });

  if (info.estatisticaDestaque) {
    const statCard = document.createElement('div');
    statCard.className = 'infographic-stat-card';
    statCard.innerHTML = `
      <div class="infographic-stat-val">${info.estatisticaDestaque.valor}</div>
      <div class="infographic-stat-label">${info.estatisticaDestaque.rotulo}</div>
    `;
    grid.appendChild(statCard);
  }

  container.appendChild(grid);
}

function narrarSlideAtual() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.slides) return;
  const slide = ws.slides[AppState.currentSlideIdx];
  const textoFala = slide.falaCalisto || slide.destaque || slide.titulo;

  const speakingAnim = document.getElementById('pres-speaking-anim');
  if (speakingAnim) speakingAnim.style.display = 'inline';

  falarTexto(textoFala, () => {
    if (speakingAnim) speakingAnim.style.display = 'none';
    
    if (AppState.isAutoPlaying) {
      clearTimeout(AppState.autoPlayTimer);
      AppState.autoPlayTimer = setTimeout(() => {
        if (AppState.isAutoPlaying) {
          if (AppState.currentSlideIdx < ws.slides.length - 1) {
            proximoSlide();
          } else {
            AppState.isAutoPlaying = false;
            const autoBtn = document.getElementById('btn-pres-autoplay');
            if (autoBtn) {
              autoBtn.classList.remove('active-autoplay');
              autoBtn.innerHTML = '▶️ Auto-Play';
            }
            confetti.burst(100);
            sounds.playFanfare();
          }
        }
      }, 2500);
    }
  });
}

function proximoSlide() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.slides) return;
  sounds.playPop();

  if (AppState.currentSlideIdx < ws.slides.length - 1) {
    AppState.currentSlideIdx++;
    carregarSlideAtual();
  } else {
    confetti.burst(80);
    sounds.playFanfare();
    if (confirm('🎉 Parabéns! Você concluiu todos os slides! Deseja ir para a Sala de Estudos com Infográficos e Quizzes agora?')) {
      abrirWorkspace(ws);
    }
  }
}

function anteriorSlide() {
  sounds.playPop();
  if (AppState.currentSlideIdx > 0) {
    AppState.currentSlideIdx--;
    carregarSlideAtual();
  }
}

function irParaSlide(index) {
  sounds.playPop();
  AppState.currentSlideIdx = index;
  carregarSlideAtual();
}

function toggleAutoPlay() {
  AppState.isAutoPlaying = !AppState.isAutoPlaying;
  sounds.playPop();
  const autoBtn = document.getElementById('btn-pres-autoplay');

  if (AppState.isAutoPlaying) {
    if (autoBtn) {
      autoBtn.classList.add('active-autoplay');
      autoBtn.innerHTML = '⏸️ Pausar Auto-Play';
    }
    narrarSlideAtual();
  } else {
    clearTimeout(AppState.autoPlayTimer);
    if (autoBtn) {
      autoBtn.classList.remove('active-autoplay');
      autoBtn.innerHTML = '▶️ Auto-Play';
    }
  }
}

function revelarRespostaSlide() {
  sounds.playCorrect();
  const answerEl = document.getElementById('pres-interactive-a');
  if (answerEl) {
    answerEl.style.display = 'block';
  }
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

  const iconEl = document.getElementById('current-workspace-icon');
  const titleEl = document.getElementById('current-workspace-title');
  const subEl = document.getElementById('current-workspace-sub');

  if (iconEl) iconEl.textContent = ws.icone || '📖';
  if (titleEl) titleEl.textContent = ws.titulo;
  if (subEl) subEl.textContent = ws.subtitulo || '';

  const videoWrapper = document.getElementById('study-video-wrapper');
  const videoFrame = document.getElementById('study-video-frame');
  const audioOverviewCard = document.getElementById('study-audio-overview-card');
  const audioElement = document.getElementById('study-audio-element');

  if (ws.videoUrl) {
    if (videoWrapper) videoWrapper.style.display = 'block';
    if (videoFrame) videoFrame.src = ws.videoUrl;
    if (audioOverviewCard) audioOverviewCard.style.display = 'none';
  } else {
    if (videoWrapper) videoWrapper.style.display = 'none';
    if (videoFrame) videoFrame.src = '';
    if (audioOverviewCard) {
      audioOverviewCard.style.display = 'block';
      if (audioElement && ws.audioUrl) audioElement.src = ws.audioUrl;
    }
  }

  const sumText = document.getElementById('study-summary-text');
  if (sumText) sumText.textContent = ws.resumo;

  const topicsList = document.getElementById('study-topics-list');
  if (topicsList) {
    topicsList.innerHTML = '';
    (ws.topicos || []).forEach(topico => {
      const li = document.createElement('li');
      li.textContent = topico;
      topicsList.appendChild(li);
    });
  }

  const curList = document.getElementById('study-curiosities-list');
  if (curList) {
    curList.innerHTML = '';
    (ws.curiosidades || []).forEach(cur => {
      const li = document.createElement('li');
      li.textContent = cur;
      curList.appendChild(li);
    });
  }

  renderizarInfograficosDaSala();
  carregarFlashcardAtual();
  carregarQuizAtual();
  ativarAba('tab-video');

  const calistoIntro = `Hehehe! ${nome}, bem-vindo ao mundo ${ws.titulo}! Assista à apresentação, explore os infográficos e acerte o quiz comigo!`;
  const speechEl = document.getElementById('paco-study-speech');
  if (speechEl) speechEl.textContent = calistoIntro;

  const hub = document.getElementById('hub-view');
  const pres = document.getElementById('presentation-view');
  const study = document.getElementById('study-view');

  if (hub) hub.style.display = 'none';
  if (pres) pres.classList.remove('active');
  if (study) study.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.parrot3DInstances && window.parrot3DInstances.study) {
    setTimeout(() => window.parrot3DInstances.study.onResize(), 100);
  }

  if (window.calistoWanderer) {
    window.calistoWanderer.mostrarFala(`Vamos estudar ${ws.titulo}, ${nome}!`, 3000);
  }
}

function renderizarInfograficosDaSala() {
  const ws = AppState.currentWorkspace;
  if (!ws) return;

  const container = document.getElementById('study-infographics-container');
  const introText = document.getElementById('infographic-intro-text');
  if (!container) return;

  container.innerHTML = '';
  if (introText) introText.textContent = `Aprenda os conceitos de "${ws.titulo}" com o mapa visual elaborado pelo Calisto:`;

  const info = (ws.infograficos && ws.infograficos.length > 0) ? ws.infograficos[0] : null;

  if (info) {
    (info.itens || []).forEach(it => {
      const card = document.createElement('div');
      card.className = 'infographic-card';
      card.innerHTML = `
        <div class="infographic-card-header">
          <span class="infographic-step-badge">${it.numero || '★'}</span>
          <span class="infographic-card-icon">${it.icone || '📌'}</span>
          <span class="infographic-card-title">${it.titulo}</span>
        </div>
        <p class="infographic-card-desc">${it.descricao}</p>
      `;
      container.appendChild(card);
    });

    if (info.estatisticaDestaque) {
      const statCard = document.createElement('div');
      statCard.className = 'infographic-stat-card';
      statCard.innerHTML = `
        <div class="infographic-stat-val">${info.estatisticaDestaque.valor}</div>
        <div class="infographic-stat-label">${info.estatisticaDestaque.rotulo}</div>
      `;
      container.appendChild(statCard);
    }
  } else {
    (ws.topicos || []).slice(0, 4).forEach((t, i) => {
      const card = document.createElement('div');
      card.className = 'infographic-card';
      card.innerHTML = `
        <div class="infographic-card-header">
          <span class="infographic-step-badge">${i + 1}</span>
          <span class="infographic-card-icon">🌟</span>
          <span class="infographic-card-title">Ponto Chave #${i + 1}</span>
        </div>
        <p class="infographic-card-desc">${t}</p>
      `;
      container.appendChild(card);
    });
  }
}

function fecharWorkspace() {
  const videoFrame = document.getElementById('study-video-frame');
  if (videoFrame) videoFrame.src = '';
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  const study = document.getElementById('study-view');
  const pres = document.getElementById('presentation-view');
  const hub = document.getElementById('hub-view');

  if (study) study.classList.remove('active');
  if (pres) pres.classList.remove('active');
  if (hub) hub.style.display = 'block';

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

  if (!speech) return;
  if (tabId === 'tab-video') {
    speech.textContent = `Assista ao vídeo explicativo com atenção, ${nome}, para aprender todos os segredos!`;
  } else if (tabId === 'tab-infographics') {
    speech.textContent = `Veja só este infográfico, ${nome}! Cada cartão explica uma ideia mágica passo a passo!`;
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
  if (inner) inner.classList.remove('flipped');

  const qEl = document.getElementById('fc-question');
  const aEl = document.getElementById('fc-answer');
  const counterEl = document.getElementById('fc-counter');

  if (qEl) qEl.textContent = card.pergunta;
  if (aEl) aEl.textContent = card.resposta;
  if (counterEl) counterEl.textContent = `${AppState.currentFlashcardIdx + 1} / ${ws.flashcards.length}`;
}

function virarFlashcard() {
  sounds.playPop();
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.classList.toggle('flipped');
}

function proximoFlashcard() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.flashcards) return;
  sounds.playPop();
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % ws.flashcards.length;
  carregarFlashcardAtual();
}

function anteriorFlashcard() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.flashcards) return;
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

  const indicator = document.getElementById('quiz-status-indicator');
  if (indicator) indicator.textContent = `Pergunta ${AppState.currentQuizIdx + 1} de ${total}`;
  
  let livesStr = '';
  for (let i = 0; i < AppState.quizLives; i++) livesStr += '❤️';
  if (AppState.quizLives === 0) livesStr = '💔 Sem vidas';
  const livesEl = document.getElementById('quiz-lives-icons');
  if (livesEl) livesEl.textContent = livesStr;

  const qText = document.getElementById('quiz-question-text');
  if (qText) qText.textContent = q.pergunta;
  
  const fbBox = document.getElementById('quiz-feedback-box');
  if (fbBox) fbBox.className = 'quiz-feedback-box';
  
  const optsContainer = document.getElementById('quiz-options-container');
  if (optsContainer) {
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
    if (fbBox) fbBox.className = 'quiz-feedback-box show correct-fb';
    if (fbMsg) fbMsg.innerHTML = `🎉 Resposta Certa! O Calisto adorou, ${nome}! ⭐`;
    if (fbExp) fbExp.textContent = q.explicacao || 'Muito bem pensado!';
    if (pacoSpeech) pacoSpeech.textContent = `Hehehe! Ora vejam só, ${nome}! Resposta certíssima! ${q.explicacao || 'Você é um gênio!'}`;
    falarTexto(`Hehehe! Ora vejam só, ${nome}! Resposta certíssima! ${q.explicacao || ''}`);
  } else {
    sounds.playWrong();
    if (window.setParrotMoodAll) window.setParrotMoodAll('angry');

    btnElement.classList.add('wrong');
    AppState.quizLives = Math.max(0, AppState.quizLives - 1);
    
    const allBtns = document.querySelectorAll('.quiz-option-btn');
    if (allBtns[correctIdx]) allBtns[correctIdx].classList.add('correct');

    if (fbBox) fbBox.className = 'quiz-feedback-box show wrong-fb';
    if (fbMsg) fbMsg.innerHTML = `Ai minhas penas, ${nome}! Olha a explicação do Calisto:`;
    if (fbExp) fbExp.textContent = q.explicacao || 'Preste atenção na dica do Calisto!';
    if (pacoSpeech) pacoSpeech.textContent = `Ai minhas peninhas velhas, ${nome}! A resposta certa é a verde. Olha aqui: ${q.explicacao || ''}`;
    falarTexto(`Ai minhas peninhas velhas, ${nome}! A resposta certa era outra! Olha a dica do Calisto!`);
  }

  let livesStr = '';
  for (let i = 0; i < AppState.quizLives; i++) livesStr += '❤️';
  if (AppState.quizLives === 0) livesStr = '💔 Tente novamente!';
  const livesEl = document.getElementById('quiz-lives-icons');
  if (livesEl) livesEl.textContent = livesStr;
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

  const certChild = document.getElementById('cert-child-name');
  if (certChild) certChild.value = nome;
  const victoryModal = document.getElementById('victory-modal');
  if (victoryModal) victoryModal.classList.add('open');
  falarTexto(`Hehehe! Vitória, ${nome}! Pelos meus cem anos de penas, nunca vi aluno tão dedicado! Parabéns!`);
}

// ====================================================================
// CENTRAL DO EDUCADOR: AUTENTICAÇÃO POR PIN, GESTÃO & GEMINI API
// ====================================================================
function getEducatorPin() {
  return localStorage.getItem('CALISTO_EDUCATOR_PIN') || '1234';
}

function salvarNovoPinEducador() {
  sounds.playPop();
  const newPin = (document.getElementById('input-new-pin')?.value || '').trim();
  const confirmPin = (document.getElementById('input-confirm-pin')?.value || '').trim();

  if (!newPin || newPin.length < 4) {
    alert('O PIN deve ter entre 4 e 6 dígitos.');
    return;
  }
  if (newPin !== confirmPin) {
    sounds.playWrong();
    alert('Os PINs digitados não coincidem!');
    return;
  }

  localStorage.setItem('CALISTO_EDUCATOR_PIN', newPin);
  sounds.playCorrect();
  confetti.burst(50);
  alert('✅ Senha PIN alterada com sucesso!');
  document.getElementById('input-new-pin').value = '';
  document.getElementById('input-confirm-pin').value = '';
}
window.salvarNovoPinEducador = salvarNovoPinEducador;

function abrirModalEducador() {
  sounds.playPop();
  if (AppState.educatorAuthenticated) {
    const edModal = document.getElementById('educator-modal');
    if (edModal) edModal.classList.add('open');
    renderizarListaWorkspacesEducador();
    atualizarStatusGeminiKey();
  } else {
    const pinModal = document.getElementById('educator-pin-modal');
    if (pinModal) pinModal.classList.add('open');
    const pinInput = document.getElementById('input-educator-pin');
    const pinErr = document.getElementById('pin-error-msg');
    if (pinInput) pinInput.value = '';
    if (pinErr) pinErr.textContent = '';
    setTimeout(() => {
      if (pinInput) pinInput.focus();
    }, 120);
  }
}
window.abrirModalEducador = abrirModalEducador;

function fecharModalPin() {
  const pinModal = document.getElementById('educator-pin-modal');
  if (pinModal) pinModal.classList.remove('open');
}
window.fecharModalPin = fecharModalPin;

function validarPinEducador() {
  const input = (document.getElementById('input-educator-pin')?.value || '').trim();
  const realPin = getEducatorPin();
  const errorMsg = document.getElementById('pin-error-msg');

  if (input === realPin) {
    AppState.educatorAuthenticated = true;
    sounds.playFanfare();
    fecharModalPin();
    const edModal = document.getElementById('educator-modal');
    if (edModal) edModal.classList.add('open');
    renderizarListaWorkspacesEducador();
    atualizarStatusGeminiKey();
  } else {
    sounds.playWrong();
    if (errorMsg) errorMsg.textContent = '❌ PIN incorreto! Tente novamente.';
    const pinInput = document.getElementById('input-educator-pin');
    if (pinInput) pinInput.value = '';
  }
}
window.validarPinEducador = validarPinEducador;

function bloquearEducador() {
  AppState.educatorAuthenticated = false;
  sounds.playPop();
  const edModal = document.getElementById('educator-modal');
  if (edModal) edModal.classList.remove('open');
}
window.bloquearEducador = bloquearEducador;

function fecharModalEducador() {
  const edModal = document.getElementById('educator-modal');
  if (edModal) edModal.classList.remove('open');
}
window.fecharModalEducador = fecharModalEducador;

// --------------------------------------------------------------------
// GERENCIADOR DE WORKSPACES DO EDUCADOR (LISTAR, EXCLUIR, RESTAURAR)
// --------------------------------------------------------------------
function renderizarListaWorkspacesEducador() {
  const container = document.getElementById('educator-workspaces-list');
  const countHeader = document.getElementById('educator-ws-count-header');
  if (!container) return;

  container.innerHTML = '';
  const data = window.WORKSPACES_DATA || [];
  if (countHeader) countHeader.textContent = `${data.length} Workspaces Cadastrados`;

  data.forEach((ws) => {
    const row = document.createElement('div');
    row.className = 'educator-ws-row';
    const isNlm = ws.isNotebookLM || (typeof ws.id === 'string' && ws.id.startsWith('nlm_'));

    row.innerHTML = `
      <div class="educator-ws-left">
        <span class="educator-ws-icon">${ws.icone || '📖'}</span>
        <div class="educator-ws-info">
          <h4 class="educator-ws-title">${ws.titulo}</h4>
          <div class="educator-ws-meta">
            <span class="ed-ws-badge ${isNlm ? 'nlm' : 'default'}">${isNlm ? '🏷️ NotebookLM / IA' : '🌱 Padrão'}</span>
            <span class="ed-ws-badge stats">${ws.topicos ? ws.topicos.length : 0} Tópicos</span>
            <span class="ed-ws-badge stats">${ws.quiz ? ws.quiz.length : 0} Quizzes</span>
          </div>
        </div>
      </div>
      <div class="educator-ws-actions">
        <button type="button" class="ed-action-btn view btn-ed-view-pres" title="Ver apresentação 3D">
          🎬 Ver
        </button>
        <button type="button" class="ed-action-btn delete btn-ed-delete-ws" title="Excluir este workspace">
          🗑️ Excluir
        </button>
      </div>
    `;

    // Botão Ver
    row.querySelector('.btn-ed-view-pres')?.addEventListener('click', () => {
      fecharModalEducador();
      abrirApresentacao(ws);
    });

    // Botão Excluir
    row.querySelector('.btn-ed-delete-ws')?.addEventListener('click', () => {
      excluirWorkspacePorId(ws.id, ws.titulo);
    });

    container.appendChild(row);
  });
}

function excluirWorkspacePorId(id, titulo) {
  sounds.playPop();
  if (!confirm(`Deseja realmente excluir o workspace "${titulo}"?\nOs alunos não verão mais este módulo na tela principal.`)) {
    return;
  }

  window.WORKSPACES_DATA = (window.WORKSPACES_DATA || []).filter(ws => ws.id !== id);
  window.salvarWorkspaces(window.WORKSPACES_DATA);

  sounds.playCorrect();
  renderizarListaWorkspacesEducador();
  renderizarGridWorkspaces();
}

function restaurarPadroesEducador() {
  if (confirm('Deseja restaurar os 10 temas educativos originais do Calisto?')) {
    window.WORKSPACES_DATA = window.restaurarWorkspacesPadrao();
    sounds.playPop();
    const jsonInput = document.getElementById('json-editor-input');
    if (jsonInput) jsonInput.value = JSON.stringify(window.WORKSPACES_DATA, null, 2);
    renderizarGridWorkspaces();
    renderizarListaWorkspacesEducador();
    alert('↺ 10 Temas padrão restaurados com sucesso!');
  }
}

// --------------------------------------------------------------------
// INTEGRAÇÃO COM A API DO GOOGLE GEMINI & NOTEBOOKLM
// --------------------------------------------------------------------
function getGeminiApiKey() {
  return localStorage.getItem('CALISTO_GEMINI_KEY') || '';
}

function salvarChaveGemini() {
  sounds.playPop();
  const input = document.getElementById('gemini-api-key-input');
  const key = input ? input.value.trim() : '';
  localStorage.setItem('CALISTO_GEMINI_KEY', key);
  atualizarStatusGeminiKey();
  sounds.playCorrect();
  alert(key ? '✅ Chave da API do Gemini salva com sucesso!' : 'Chave removida.');
}

function atualizarStatusGeminiKey() {
  const key = getGeminiApiKey();
  const input = document.getElementById('gemini-api-key-input');
  const badge = document.getElementById('gemini-api-status-badge');
  if (input && key) input.value = key;

  if (badge) {
    if (key && key.length > 10) {
      badge.className = 'api-status-badge connected';
      badge.textContent = '✅ Conectado ao Google Gemini IA';
    } else {
      badge.className = 'api-status-badge disconnected';
      badge.textContent = '⚪ Chave não informada';
    }
  }
}

function carregarPresetEducador(index) {
  sounds.playPop();
  const presets = window.NOTEBOOKLM_PRESETS || [];
  if (presets[index]) {
    const urlInput = document.getElementById('ed-notebooklm-url-input');
    const manualInput = document.getElementById('ed-manual-content-input');
    const topicInput = document.getElementById('ed-topic-name-input');
    if (urlInput) urlInput.value = presets[index].url;
    if (manualInput) manualInput.value = presets[index].rawContent;
    if (topicInput) topicInput.value = presets[index].nome.replace(/^[^\w\s]+/, '').trim();
  }
}

function carregarArquivoEducador(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const manualInput = document.getElementById('ed-manual-content-input');
    if (manualInput) manualInput.value = evt.target.result;
    sounds.playPop();
  };
  reader.readAsText(file);
}

/**
 * Busca de conteúdo via endpoint local ou fallback
 */
async function buscarConteudoDaUrl(url) {
  try {
    const response = await fetch(`/api/fetch-notebooklm?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Busca remota não disponível, processando localmente:', err);
  }
  return { title: '', content: '' };
}

/**
 * Geração de Workspace: via API do Gemini ou Parser inteligente de URL/Texto
 */
async function processarGeracaoEducador() {
  const urlInput = (document.getElementById('ed-notebooklm-url-input')?.value || '').trim();
  const topicInput = (document.getElementById('ed-topic-name-input')?.value || '').trim();
  const manualText = (document.getElementById('ed-manual-content-input')?.value || '').trim();
  const apiKey = getGeminiApiKey();

  if (!urlInput && !topicInput && !manualText) {
    sounds.playWrong();
    alert('Por favor, informe a URL do NotebookLM, o assunto do estudo ou cole o texto do guia.');
    return;
  }

  const progBox = document.getElementById('ed-progress-box');
  const progBar = document.getElementById('ed-progress-bar');
  const progStatus = document.getElementById('ed-progress-status');

  if (progBox) progBox.style.display = 'block';
  if (progBar) progBar.style.width = '20%';
  if (progStatus) progStatus.innerHTML = '📡 Conectando ao material...';
  sounds.playPop();

  try {
    let ws = null;

    if (apiKey && apiKey.length > 10) {
      if (progBar) progBar.style.width = '50%';
      if (progStatus) progStatus.innerHTML = '🤖 Conectando à IA do Google Gemini para estruturar o estudo infantil...';
      
      ws = await gerarComGeminiAPI(apiKey, topicInput, urlInput, manualText);
    } else {
      let rawContent = manualText;
      let fetchedTitle = topicInput;

      if (urlInput) {
        if (progBar) progBar.style.width = '45%';
        if (progStatus) progStatus.innerHTML = `📥 Baixando materiais em <strong>${urlInput.substring(0, 35)}...</strong>`;
        try {
          const fetchedData = await buscarConteudoDaUrl(urlInput);
          if (fetchedData && fetchedData.content) {
            rawContent = (rawContent ? rawContent + '\n\n' : '') + fetchedData.content;
            if (!fetchedTitle) fetchedTitle = fetchedData.title || '';
          }
        } catch (e) {}
      }

      if (progBar) progBar.style.width = '75%';
      if (progStatus) progStatus.innerHTML = '🧠 Estruturando infográficos, quiz, flashcards e apresentação...';
      await new Promise(r => setTimeout(r, 400));

      ws = extrairMaterialCompleto(urlInput, rawContent, fetchedTitle || topicInput);
    }

    if (progBar) progBar.style.width = '100%';
    if (progStatus) progStatus.innerHTML = '✨ Workspace criado com sucesso!';
    await new Promise(r => setTimeout(r, 300));

    window.WORKSPACES_DATA.unshift(ws);
    window.salvarWorkspaces(window.WORKSPACES_DATA);

    renderizarGridWorkspaces();
    renderizarListaWorkspacesEducador();

    fecharModalEducador();
    if (progBox) progBox.style.display = 'none';
    sounds.playFanfare();
    confetti.burst(140);

    abrirApresentacao(ws);

  } catch (err) {
    sounds.playWrong();
    if (progBox) progBox.style.display = 'none';
    alert('Erro ao gerar workspace: ' + err.message);
  }
}

/**
 * Descoberta dinâmica dos modelos Gemini ativos para a chave do usuário
 */
async function listarModelosDisponiveis(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        // Ignora modelos descontinuados conhecidos
        const deprecated = ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.0', 'text-embedding', 'aqa'];
        const valid = data.models
          .filter(m => (!m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent')))
          .map(m => m.name.replace(/^models\//, ''))
          .filter(name => !deprecated.some(d => name.includes(d)));
        
        valid.sort((a, b) => {
          const score = (m) => {
            if (m.includes('3.8-flash')) return 110;
            if (m.includes('3.7-flash')) return 108;
            if (m.includes('3.6-flash')) return 106;
            if (m.includes('3.5-flash')) return 104;
            if (m.includes('3.1-pro-preview')) return 102;
            if (m.includes('3.1-pro')) return 100;
            if (m.includes('2.5-flash')) return 98;
            if (m.includes('1.5-flash')) return 90;
            if (m.includes('3.5-flash-lite')) return 88;
            if (m.includes('flash')) return 80;
            if (m.includes('pro')) return 60;
            return 10;
          };
          return score(b) - score(a);
        });

        if (valid.length > 0) return valid;
      }
    }
  } catch (e) {
    console.warn('Falha na descoberta de modelos, usando lista padrão:', e);
  }
  return [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-pro-preview',
    'gemini-2.5-flash',
    'gemini-1.5-flash'
  ];
}

/**
 * Chamada à API Oficial do Google Gemini com Auto-Descoberta e Fallback Automático
 */
async function gerarComGeminiAPI(apiKey, tema, url, texto) {
  const candidateModels = await listarModelosDisponiveis(apiKey);

  const prompt = `Você é o educador assistente do sábio periquito Calisto para uma plataforma infantil de estudos.
Com base nas seguintes informações de estudo fornecidas:
Tema: "${tema || ''}"
URL / Link: "${url || ''}"
Material / Notas / Guia do NotebookLM:
"${(texto || tema || 'Ciência e Descobertas').substring(0, 5000)}"

Gere um módulo educacional completo para crianças em formato JSON EXATO (sem markdown extra, apenas o objeto JSON puro):
{
  "titulo": "Título cativante para crianças",
  "icone": "Ícone emoji temático (ex: 🚀, 🌊, 🤖, 🦖)",
  "subtitulo": "Subtítulo empolgante",
  "cor": "linear-gradient(135deg, #1E40AF, #7C3AED)",
  "videoUrl": "URL do embed do youtube ou deixe vazio",
  "resumo": "Explicação em 2 frases simples com linguagem infantil acolhedora.",
  "topicos": [
    "Ponto 1 claro e interessante",
    "Ponto 2 com analogia do dia a dia",
    "Ponto 3 surpreendente",
    "Ponto 4 dica do sábio Calisto"
  ],
  "infograficos": [
    {
      "titulo": "Mapa Visual do Tema",
      "subtitulo": "Passo a passo visual",
      "itens": [
        { "numero": "1", "icone": "🔍", "titulo": "Etapa 1", "descricao": "Descrição clara" },
        { "numero": "2", "icone": "💡", "titulo": "Etapa 2", "descricao": "Descrição clara" },
        { "numero": "3", "icone": "🚀", "titulo": "Etapa 3", "descricao": "Descrição clara" }
      ],
      "estatisticaDestaque": {
        "valor": "100%",
        "rotulo": "de curiosidade e aprendizado!"
      }
    }
  ],
  "curiosidades": [
    "Curiosidade 1 fascinante com emoji",
    "Curiosidade 2 que pouca gente sabe"
  ],
  "flashcards": [
    { "pergunta": "Pergunta intrigante para a criança?", "resposta": "Resposta mágica e clara!" },
    { "pergunta": "Pergunta curiosa sobre o tema?", "resposta": "Explicação divertida do Calisto!" }
  ],
  "quiz": [
    {
      "pergunta": "Pergunta clara de fixação?",
      "opcoes": ["Alternativa Correta", "Opção Curiosa B", "Opção C", "Opção D"],
      "respostaCorreta": 0,
      "explicacao": "Explicação calorosa e educativa do sábio Calisto!"
    }
  ]
}`;

  let lastError = null;

  for (const model of candidateModels) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${response.status}`;
        lastError = new Error(msg);
        console.warn(`Tentativa com modelo ${model} retornou: ${msg}. Tentando próximo modelo...`);
        continue;
      }

      const resData = await response.json();
      const textOutput = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        console.warn(`Modelo ${model} retornou texto vazio, tentando próximo modelo...`);
        continue;
      }

      let cleanJson = textOutput.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      parsed.id = 'nlm_' + Date.now();
      parsed.isNotebookLM = true;
      parsed.notebookUrl = url || '';
      if (!parsed.cor) parsed.cor = 'linear-gradient(135deg, #1E40AF, #7C3AED)';
      if (!parsed.icone) parsed.icone = '🌟';
      parsed.slides = window.gerarSlidesParaWorkspace(parsed);

      return parsed;

    } catch (err) {
      lastError = err;
      console.warn(`Erro no modelo ${model}:`, err.message);
      continue;
    }
  }

  throw lastError || new Error('Não foi possível conectar com os modelos da API do Gemini.');
}

/**
 * Extrator Profundo: Mapeia o material em um workspace completo do Calisto
 */
function extrairMaterialCompleto(url, rawText, fetchedTitle = '') {
  let text = rawText || '';

  if (!text && url) {
    const preset = (window.NOTEBOOKLM_PRESETS || []).find(p => url.toLowerCase().includes(p.url.toLowerCase()) || url.includes('robotica') || url.includes('coral'));
    if (preset) text = preset.rawContent;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let titulo = fetchedTitle;
  if (!titulo) {
    for (let l of lines) {
      if (l.startsWith('# ')) {
        titulo = l.replace(/^#\s+/, '').replace(/^(Guia de Estudo|Documento de Briefing|NotebookLM:?)\s*/i, '');
        break;
      }
    }
  }
  if (!titulo && url) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const parts = cleanUrl.split('/').filter(p => p.length > 0);
    const lastPart = parts[parts.length - 1] || 'NotebookLM';
    titulo = lastPart.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  if (!titulo) titulo = 'Estudo do Saber';

  let resumo = '';
  for (let l of lines) {
    if (!l.startsWith('#') && !l.startsWith('-') && !l.startsWith('*') && l.length > 30) {
      resumo = l;
      break;
    }
  }
  if (!resumo) {
    resumo = `Apresentação interativa e sala de estudos geradas a partir do material de ${titulo}!`;
  }

  let topicos = [];
  for (let l of lines) {
    if (l.startsWith('- ') || l.startsWith('* ') || /^\d+\.\s/.test(l)) {
      const clean = l.replace(/^[-*]\s+|\d+\.\s+/, '');
      if (clean.length > 15 && !clean.includes('Correta:') && !clean.startsWith('A)') && !clean.startsWith('B)')) {
        topicos.push(clean);
      }
    }
  }
  if (topicos.length === 0) {
    topicos = [
      `Fundamentos e estrutura essencial de ${titulo}.`,
      `Aplicações práticas e descobertas científicas no dia a dia.`,
      `Conexões importantes explicadas pelo sábio Calisto.`
    ];
  }

  let videoUrl = '';
  const ytMatch = text.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    videoUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  } else {
    const lowerTitle = (titulo + ' ' + text).toLowerCase();
    if (lowerTitle.includes('robô') || lowerTitle.includes('robótica') || lowerTitle.includes('ia') || lowerTitle.includes('inteligência')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/up_wOqKj7c4';
    } else if (lowerTitle.includes('coral') || lowerTitle.includes('oceano') || lowerTitle.includes('mar') || lowerTitle.includes('peixe')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/n3_v08lP69Q';
    } else if (lowerTitle.includes('espaço') || lowerTitle.includes('sistema solar') || lowerTitle.includes('planeta') || lowerTitle.includes('estrela')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/fD3BqA3k1tY';
    } else if (lowerTitle.includes('dinossauro') || lowerTitle.includes('fóssil') || lowerTitle.includes('t-rex')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/9w_Yh8jW3n8';
    } else {
      videoUrl = 'https://www.youtube-nocookie.com/embed/up_wOqKj7c4';
    }
  }

  const infograficos = [
    {
      titulo: `Mapa Visual: ${titulo}`,
      subtitulo: 'Esquema em etapas para aprender de forma prática',
      itens: topicos.slice(0, 3).map((t, i) => ({
        numero: (i + 1).toString(),
        icone: ['🔍', '💡', '🚀', '🌟'][i] || '📌',
        titulo: `Etapa ${i + 1}`,
        descricao: t
      })),
      estatisticaDestaque: {
        valor: '100%',
        rotulo: `dos conceitos de ${titulo} sintetizados para estudo infantil!`
      }
    }
  ];

  let curiosidades = [];
  for (let l of lines) {
    if (/curiosidade|você sabia|sabia que|fato|segredo/i.test(l)) {
      curiosidades.push(l.replace(/^[-*#]\s*/, ''));
    }
  }
  if (curiosidades.length === 0) {
    curiosidades = [
      `Sabia que o estudo de ${titulo} ajuda cientistas a desenvolverem grandes inovações para o mundo? 🌟`,
      `O Calisto adora este tema porque ele conecta natureza, tecnologia e raciocínio lógico! 🦜`
    ];
  }

  let flashcards = [];
  for (let l of lines) {
    if (l.includes('|')) {
      const parts = l.split('|');
      if (parts.length >= 2) {
        flashcards.push({
          pergunta: parts[0].replace(/^[-*#]\s*/, '').trim(),
          resposta: parts[1].trim()
        });
      }
    }
  }
  if (flashcards.length === 0) {
    flashcards = [
      {
        pergunta: `O que é mais importante saber sobre ${titulo}?`,
        resposta: `${topicos[0] || resumo} 🌟`
      },
      {
        pergunta: `Como podemos aplicar o que aprendemos em ${titulo}?`,
        resposta: `Observando o mundo com curiosidade científica e espírito explorador! 🚀`
      }
    ];
  }

  let quiz = [];
  let currentQ = null;
  for (let l of lines) {
    if (/^\d+\.\s/.test(l) && l.includes('?')) {
      if (currentQ && currentQ.opcoes.length >= 2) quiz.push(currentQ);
      currentQ = {
        pergunta: l.replace(/^\d+\.\s+/, ''),
        opcoes: [],
        respostaCorreta: 0,
        explicacao: 'Excelente raciocínio! Resposta certíssima!'
      };
    } else if (currentQ && /^[A-D]\)/i.test(l)) {
      currentQ.opcoes.push(l.replace(/^[A-D]\)\s*/i, ''));
    } else if (currentQ && /^Correta:\s*([A-D])/i.test(l)) {
      const letter = l.match(/^Correta:\s*([A-D])/i)[1].toUpperCase();
      const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      currentQ.respostaCorreta = map[letter] !== undefined ? map[letter] : 0;
    }
  }
  if (currentQ && currentQ.opcoes.length >= 2) quiz.push(currentQ);

  if (quiz.length === 0) {
    quiz = [
      {
        pergunta: `Qual é o ponto central do nosso estudo sobre ${titulo}?`,
        opcoes: [
          topicos[0] || 'Compreender os conceitos fundamentais',
          'Apenas esquecer tudo no dia seguinte',
          'Nenhuma explicação relevante',
          'Deixar de fazer perguntas'
        ],
        respostaCorreta: 0,
        explicacao: `Isso mesmo! O sábio Calisto explicou tudo com perfeição!`
      }
    ];
  }

  const novoWorkspace = {
    id: 'nlm_' + Date.now(),
    isNotebookLM: true,
    notebookUrl: url || '',
    titulo: titulo,
    icone: '🌟',
    subtitulo: `Material de estudo: ${url ? url.substring(0, 40) : 'Especial'}`,
    cor: 'linear-gradient(135deg, #1E40AF, #7C3AED)',
    videoUrl: videoUrl,
    resumo: resumo,
    topicos: topicos,
    infograficos: infograficos,
    curiosidades: curiosidades,
    flashcards: flashcards,
    quiz: quiz
  };

  novoWorkspace.slides = window.gerarSlidesParaWorkspace(novoWorkspace);
  return novoWorkspace;
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
    alert('✅ Sucesso! Os Workspaces foram atualizados!');
    renderizarGridWorkspaces();
    renderizarListaWorkspacesEducador();
  } catch (err) {
    sounds.playWrong();
    alert('❌ Erro no formato JSON: ' + err.message);
  }
}

// ====================================================================
// INICIALIZAÇÃO DE EVENTOS & TECLADO DO PIN
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
  atualizarStatusGeminiKey();

  if (window.initParrot3D) {
    setTimeout(window.initParrot3D, 150);
  }

  // Navegação
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

  // Som / Voz
  safeBind('btn-toggle-sound', 'click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) btn.textContent = AppState.soundEnabled ? '🔊' : '🔇';
    sounds.playPop();
    if (!AppState.soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.setParrotSpeakingAll) window.setParrotSpeakingAll(false);
    }
  });

  // Fala do Calisto
  safeBind('btn-speak-greeting', 'click', () => {
    const el = document.getElementById('hub-greeting-text');
    if (el) falarTexto(el.textContent);
  });

  safeBind('btn-paco-speak', 'click', () => {
    const el = document.getElementById('paco-study-speech');
    if (el) falarTexto(el.textContent);
  });

  // Cócegas no Calisto
  safeBind('btn-tease-paco', 'click', () => {
    sounds.playRingneckRealChirp();
    if (window.parrot3DInstances && window.parrot3DInstances.hero) {
      window.parrot3DInstances.hero.provocar();
    }
  });

  // Chamar Calisto Voador
  safeBind('btn-summon-calisto', 'click', () => {
    sounds.playRingneckRealChirp();
    if (window.calistoWanderer) {
      window.calistoWanderer.flyTo(window.innerWidth / 2 - 70, 110);
    }
  });

  // Abas de Estudo
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
    document.getElementById('victory-modal')?.classList.remove('open');
  });
  safeBind('btn-claim-victory', 'click', () => {
    document.getElementById('victory-modal')?.classList.remove('open');
    fecharWorkspace();
  });

  // Central do Educador & PIN
  safeBind('btn-open-educator', 'click', abrirModalEducador);
  safeBind('btn-close-pin-modal', 'click', fecharModalPin);
  safeBind('btn-cancel-pin', 'click', fecharModalPin);
  safeBind('btn-close-educator', 'click', fecharModalEducador);
  safeBind('btn-educator-lock', 'click', bloquearEducador);
  safeBind('btn-reset-defaults-ed', 'click', restaurarPadroesEducador);
  safeBind('btn-save-json', 'click', salvarDadosEducador);

  // Teclado Numérico Visual para o PIN (Touch/Tablets)
  document.querySelectorAll('.pin-key[data-num]').forEach(k => {
    k.addEventListener('click', () => {
      sounds.playPop();
      const pinInput = document.getElementById('input-educator-pin');
      if (pinInput && pinInput.value.length < 6) {
        pinInput.value += k.dataset.num;
        if (pinInput.value.length === 4) {
          validarPinEducador();
        }
      }
    });
  });

  safeBind('btn-pin-clear', 'click', () => {
    sounds.playPop();
    const pinInput = document.getElementById('input-educator-pin');
    if (pinInput) pinInput.value = '';
  });

  safeBind('btn-pin-backspace', 'click', () => {
    sounds.playPop();
    const pinInput = document.getElementById('input-educator-pin');
    if (pinInput && pinInput.value.length > 0) {
      pinInput.value = pinInput.value.slice(0, -1);
    }
  });

  // Botão "➕ Incluir Novo Workspace"
  safeBind('btn-ed-goto-import', 'click', () => {
    document.querySelectorAll('.educator-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ed-tab-content').forEach(c => c.style.display = 'none');
    const importBtn = document.querySelector('.educator-tab-btn[data-ed-tab="ed-tab-import"]');
    if (importBtn) importBtn.classList.add('active');
    const importView = document.getElementById('ed-tab-import');
    if (importView) importView.style.display = 'block';
  });

  // Chave Gemini
  safeBind('btn-save-gemini-key', 'click', salvarChaveGemini);

  // Colar / Presets
  safeBind('btn-ed-paste-url', 'click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) document.getElementById('ed-notebooklm-url-input').value = text.trim();
    } catch (e) {}
  });

  safeBind('btn-ed-paste-guide', 'click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) document.getElementById('ed-manual-content-input').value = text;
    } catch (e) {}
  });

  safeBind('btn-ed-preset-robotics', 'click', () => carregarPresetEducador(0));
  safeBind('btn-ed-preset-coral', 'click', () => carregarPresetEducador(1));
  safeBind('btn-ed-preset-astronomy', 'click', () => carregarPresetEducador(2));
  safeBind('ed-notebooklm-file-input', 'change', carregarArquivoEducador);
  safeBind('btn-ed-generate-workspace', 'click', processarGeracaoEducador);

  // Apresentação 3D
  safeBind('btn-pres-back', 'click', fecharApresentacao);
  safeBind('btn-pres-prev', 'click', anteriorSlide);
  safeBind('btn-pres-next', 'click', proximoSlide);
  safeBind('btn-pres-autoplay', 'click', toggleAutoPlay);
  safeBind('btn-pres-speak', 'click', narrarSlideAtual);
  safeBind('btn-pres-reveal-answer', 'click', revelarRespostaSlide);
  safeBind('btn-pres-to-study', 'click', () => {
    if (AppState.currentWorkspace) abrirWorkspace(AppState.currentWorkspace);
  });
  safeBind('btn-switch-to-presentation', 'click', () => {
    if (AppState.currentWorkspace) abrirApresentacao(AppState.currentWorkspace);
  });

  // Teclado na Apresentação
  window.addEventListener('keydown', (e) => {
    const presView = document.getElementById('presentation-view');
    if (presView && presView.classList.contains('active')) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        proximoSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        anteriorSlide();
      } else if (e.key === 'Escape') {
        fecharApresentacao();
      }
    }
  });

  // Abas do Educador
  document.querySelectorAll('.educator-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.educator-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ed-tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.edTab);
      if (target) {
        target.style.display = 'block';
        if (btn.dataset.edTab === 'ed-tab-json') {
          const textarea = document.getElementById('json-editor-input');
          if (textarea) textarea.value = JSON.stringify(window.WORKSPACES_DATA, null, 2);
        } else if (btn.dataset.edTab === 'ed-tab-workspaces') {
          renderizarListaWorkspacesEducador();
        }
      }
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
