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
  quizAnswerLocked: false,
  currentSlideIdx: 0,
  isAutoPlaying: false,
  autoPlayTimer: null
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

  document.getElementById('workspace-count-tag').textContent = `${data.length} Temas Disponíveis`;

  data.forEach((ws, index) => {
    const isCompleted = AppState.completedWorkspaces.includes(ws.id);
    const card = document.createElement('article');
    card.className = 'workspace-card';
    card.innerHTML = `
      <div class="card-header-bar" style="background: ${ws.cor || 'linear-gradient(135deg, #10B981, #059669)'}">
        <div class="card-icon-circle">${ws.icone || '📖'}</div>
        <div style="display: flex; gap: 0.35rem; align-items: center;">
          ${ws.isNotebookLM ? '<span class="notebooklm-tag">🏷️ NotebookLM</span>' : ''}
          <span class="card-badge">#${index + 1}</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ws.titulo}</h3>
        <p class="card-desc">${ws.subtitulo || ws.resumo}</p>
        <div class="card-footer">
          <span class="card-status">
            ${isCompleted ? '⭐ Concluído!' : '🌱 Pronto para Explorar'}
          </span>
        </div>
        <div class="workspace-actions-row">
          <button class="ws-action-btn pres" title="Assistir como Apresentação 3D Guiada pelo Calisto">
            🎬 Apresentação 3D
          </button>
          <button class="ws-action-btn study" title="Abrir Sala de Estudos, Flashcards e Quiz">
            📚 Sala & Quiz
          </button>
        </div>
      </div>
    `;

    // Botão de Apresentação 3D
    const btnPres = card.querySelector('.ws-action-btn.pres');
    if (btnPres) {
      btnPres.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playPop();
        abrirApresentacao(ws);
      });
    }

    // Botão de Sala de Estudos
    const btnStudy = card.querySelector('.ws-action-btn.study');
    if (btnStudy) {
      btnStudy.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playPop();
        abrirWorkspace(ws);
      });
    }

    // Clique no corpo do cartão abre a Apresentação
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

  // Garante que o workspace tenha slides prontos
  if (!ws.slides || ws.slides.length === 0) {
    ws.slides = window.gerarSlidesParaWorkspace(ws);
  }

  document.getElementById('pres-workspace-title').textContent = ws.titulo;
  const sourceBadge = document.getElementById('pres-source-badge');
  if (ws.isNotebookLM) {
    sourceBadge.innerHTML = '🏷️ Projeto do NotebookLM';
    sourceBadge.style.background = '#EDE9FE';
    sourceBadge.style.color = '#6D28D9';
  } else {
    sourceBadge.innerHTML = '🦜 Apresentação do Calisto';
    sourceBadge.style.background = '#EEF2FF';
    sourceBadge.style.color = '#4338CA';
  }

  const autoBtn = document.getElementById('btn-pres-autoplay');
  if (autoBtn) {
    autoBtn.classList.remove('active-autoplay');
    autoBtn.innerHTML = '▶️ Auto-Play';
  }

  document.getElementById('hub-view').style.display = 'none';
  document.getElementById('study-view').classList.remove('active');
  document.getElementById('presentation-view').classList.add('active');
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

  document.getElementById('presentation-view').classList.remove('active');
  document.getElementById('hub-view').style.display = 'block';
  renderizarGridWorkspaces();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function carregarSlideAtual() {
  const ws = AppState.currentWorkspace;
  if (!ws || !ws.slides || ws.slides.length === 0) return;

  const total = ws.slides.length;
  const slide = ws.slides[AppState.currentSlideIdx];
  const nome = AppState.childName || 'Pequeno Explorador';

  // Atualiza Metadados do Slide
  document.getElementById('pres-slide-pill').textContent = `Slide ${AppState.currentSlideIdx + 1} de ${total} ⭐`;
  
  const typeLabels = {
    'intro': '🌟 Abertura',
    'conceito': '📖 Fundamentos',
    'audio': '🎙️ Áudio Overview',
    'curiosidade': '💡 Curiosidades',
    'desafio': '🃏 Desafio Rápido',
    'conclusao': '🏆 Conclusão'
  };
  document.getElementById('pres-slide-type').textContent = typeLabels[slide.tipo] || '✨ Saber';

  // Ícone, Título e Subtítulo
  document.getElementById('pres-slide-icon').textContent = slide.icone || ws.icone || '🌟';
  document.getElementById('pres-slide-title').textContent = slide.titulo;
  document.getElementById('pres-slide-sub').textContent = slide.subtitulo || '';

  // Destaque
  const highlightCard = document.getElementById('pres-slide-highlight-card');
  const highlightText = document.getElementById('pres-slide-highlight-text');
  if (slide.destaque) {
    highlightCard.style.display = 'block';
    highlightText.textContent = slide.destaque;
  } else {
    highlightCard.style.display = 'none';
  }

  // Infográfico Visual no Slide
  const presInfographicBox = document.getElementById('pres-slide-infographic-box');
  const presInfographicContent = document.getElementById('pres-infographic-content');
  if (slide.tipo === 'infografico' && slide.infografico) {
    presInfographicBox.style.display = 'block';
    renderizarInfograficoNoSlide(slide.infografico, presInfographicContent);
  } else {
    presInfographicBox.style.display = 'none';
  }

  // Tópicos
  const bulletsList = document.getElementById('pres-slide-bullets');
  bulletsList.innerHTML = '';
  if (slide.tipo !== 'infografico' && slide.topicos && slide.topicos.length > 0) {
    slide.topicos.forEach(topic => {
      const li = document.createElement('li');
      li.textContent = topic;
      bulletsList.appendChild(li);
    });
  }

  // Desafio Interativo / Flashcard no Slide
  const interactiveBox = document.getElementById('pres-slide-interactive-box');
  const interactiveQ = document.getElementById('pres-interactive-q');
  const interactiveA = document.getElementById('pres-interactive-a');
  if (slide.tipo === 'desafio' && slide.respostaDestaque) {
    interactiveBox.style.display = 'block';
    interactiveQ.textContent = slide.destaque || 'Desafio do Calisto';
    interactiveA.style.display = 'none';
    interactiveA.textContent = slide.respostaDestaque;
  } else {
    interactiveBox.style.display = 'none';
  }

  // Áudio Overview do NotebookLM
  const audioBox = document.getElementById('pres-slide-audio-box');
  const audioPlayer = document.getElementById('pres-audio-player');
  if (slide.tipo === 'audio' && slide.audioUrl) {
    audioBox.style.display = 'block';
    audioPlayer.src = slide.audioUrl;
  } else {
    audioBox.style.display = 'none';
    audioPlayer.src = '';
  }

  // Fala do Apresentador Calisto
  const speakerSpeech = document.getElementById('pres-speaker-speech');
  const textoFala = slide.falaCalisto || `Hehehe! Vamos aprender sobre ${slide.titulo}, ${nome}! Preste atenção aos detalhes!`;
  speakerSpeech.textContent = textoFala;

  // Atualizar Indicador de Bolinhas
  const dotsContainer = document.getElementById('pres-dots-container');
  dotsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = `pres-dot ${i === AppState.currentSlideIdx ? 'active' : ''}`;
    dot.title = `Ir para Slide ${i + 1}`;
    dot.addEventListener('click', () => irParaSlide(i));
    dotsContainer.appendChild(dot);
  }

  // Falar o conteúdo com voz masculina do Calisto
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
    
    // Se o Auto-Play estiver ativo, passa para o próximo slide após 2.5s
    if (AppState.isAutoPlaying) {
      clearTimeout(AppState.autoPlayTimer);
      AppState.autoPlayTimer = setTimeout(() => {
        if (AppState.isAutoPlaying) {
          if (AppState.currentSlideIdx < ws.slides.length - 1) {
            proximoSlide();
          } else {
            // Fim da apresentação
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
    // Último slide atingido: celebração e convite para a sala de estudos
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

  document.getElementById('current-workspace-icon').textContent = ws.icone || '📖';
  document.getElementById('current-workspace-title').textContent = ws.titulo;
  document.getElementById('current-workspace-sub').textContent = ws.subtitulo || '';

  // Configura Vídeo ou Áudio
  const videoWrapper = document.getElementById('study-video-wrapper');
  const videoFrame = document.getElementById('study-video-frame');
  const audioOverviewCard = document.getElementById('study-audio-overview-card');
  const audioElement = document.getElementById('study-audio-element');

  if (ws.videoUrl) {
    videoWrapper.style.display = 'block';
    videoFrame.src = ws.videoUrl;
    if (audioOverviewCard) audioOverviewCard.style.display = 'none';
  } else {
    videoWrapper.style.display = 'none';
    videoFrame.src = '';
    if (audioOverviewCard) {
      audioOverviewCard.style.display = 'block';
      if (audioElement && ws.audioUrl) audioElement.src = ws.audioUrl;
    }
  }

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

  renderizarInfograficosDaSala();
  carregarFlashcardAtual();
  carregarQuizAtual();
  ativarAba('tab-video');

  const calistoIntro = `Hehehe! ${nome}, bem-vindo ao mundo ${ws.titulo}! Assista à apresentação, explore os infográficos e acerte o quiz comigo!`;
  document.getElementById('paco-study-speech').textContent = calistoIntro;

  document.getElementById('hub-view').style.display = 'none';
  document.getElementById('presentation-view').classList.remove('active');
  document.getElementById('study-view').classList.add('active');
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
  introText.textContent = `Aprenda os conceitos de "${ws.titulo}" com o mapa visual elaborado pelo Calisto:`;

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
    // Gera infográfico baseado nos tópicos
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

  document.getElementById('study-view').classList.remove('active');
  document.getElementById('presentation-view').classList.remove('active');
  document.getElementById('hub-view').style.display = 'block';
  renderizarGridWorkspaces();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================================================================
// MOTOR DE BUSCA & CONSUMO DIRETO DA URL DO WORKSPACE
// ====================================================================
function abrirModalNotebookLM() {
  sounds.playPop();
  document.getElementById('notebooklm-modal').classList.add('open');
  const progBox = document.getElementById('notebooklm-progress-box');
  if (progBox) progBox.style.display = 'none';
}

function fecharModalNotebookLM() {
  document.getElementById('notebooklm-modal').classList.remove('open');
}

function carregarPresetNotebookLM(index) {
  sounds.playPop();
  const presets = window.NOTEBOOKLM_PRESETS || [];
  if (presets[index]) {
    document.getElementById('notebooklm-url-input').value = presets[index].url;
    document.getElementById('notebooklm-content-input').value = presets[index].rawContent;
  }
}

function carregarArquivoNotebookLM(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    document.getElementById('notebooklm-content-input').value = evt.target.result;
    sounds.playPop();
  };
  reader.readAsText(file);
}

/**
 * Função principal que consome a URL diretamente, busca todos os dados
 * e cria o workspace com apresentação, vídeos, quizzes, infográficos e testes!
 */
async function processarImportacaoNotebookLM() {
  const urlInput = document.getElementById('notebooklm-url-input').value.trim();
  const manualText = document.getElementById('notebooklm-content-input').value.trim();

  if (!urlInput && !manualText) {
    sounds.playWrong();
    alert('Por favor, insira a URL do seu workspace ou cole os materiais gerados.');
    return;
  }

  const progBox = document.getElementById('notebooklm-progress-box');
  const progBar = document.getElementById('notebooklm-progress-bar');
  const progStatus = document.getElementById('notebooklm-progress-status');

  progBox.style.display = 'block';
  progBar.style.width = '20%';
  progStatus.innerHTML = '📡 Conectando ao Workspace e buscando dados...';
  sounds.playPop();

  try {
    let rawContent = manualText;
    let fetchedTitle = '';

    // Se houver uma URL fornecida, busca o conteúdo real via backend ou proxy
    if (urlInput) {
      progBar.style.width = '45%';
      progStatus.innerHTML = `📥 Baixando materiais gerados em <strong>${urlInput.substring(0, 35)}...</strong>`;

      try {
        const fetchedData = await buscarConteudoDaUrl(urlInput);
        if (fetchedData && fetchedData.content) {
          rawContent = (rawContent ? rawContent + '\n\n' : '') + fetchedData.content;
          fetchedTitle = fetchedData.title || '';
        }
      } catch (fetchErr) {
        console.warn('Aviso: busca remota da URL retornou aviso, utilizando parser inteligente.', fetchErr);
      }
    }

    progBar.style.width = '75%';
    progStatus.innerHTML = '🧠 Extraindo vídeos, infográficos, testes, quizzes e curiosidades...';

    await new Promise(r => setTimeout(r, 400));

    // Extrai todo o material gerado e sintetiza a estrutura rica do Calisto
    const ws = extrairMaterialCompleto(urlInput, rawContent, fetchedTitle);

    progBar.style.width = '100%';
    progStatus.innerHTML = '✨ Apresentação e Sala de Estudos criadas com sucesso!';

    await new Promise(r => setTimeout(r, 300));

    // Insere o novo workspace no início da lista
    window.WORKSPACES_DATA.unshift(ws);
    window.salvarWorkspaces(window.WORKSPACES_DATA);

    fecharModalNotebookLM();
    sounds.playFanfare();
    confetti.burst(140);

    // Abre imediatamente a nova Apresentação 3D do Calisto!
    abrirApresentacao(ws);

  } catch (err) {
    sounds.playWrong();
    progBox.style.display = 'none';
    alert('Erro ao processar e consumir materiais do workspace: ' + err.message);
  }
}

/**
 * Busca conteúdo via backend local (/api/fetch-workspace) ou proxies públicos
 */
async function buscarConteudoDaUrl(url) {
  // 1. Tenta endpoint do servidor local
  try {
    const res = await fetch(`/api/fetch-workspace?url=${encodeURIComponent(url)}`, { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.body) {
        return parseHtmlOrTextResponse(json.body, url);
      }
    }
  } catch (e) {
    // Continua para o fallback de proxy público
  }

  // 2. Fallback via AllOrigins CORS proxy
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      return parseHtmlOrTextResponse(text, url);
    }
  } catch (e) {
    // Continua para o fallback
  }

  // 3. Fallback via Corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      return parseHtmlOrTextResponse(text, url);
    }
  } catch (e) {}

  // Se for preset cadastrado, busca do preset
  const preset = (window.NOTEBOOKLM_PRESETS || []).find(p => p.url.toLowerCase() === url.toLowerCase() || url.includes('robotica') || url.includes('coral'));
  if (preset) {
    return { title: preset.nome, content: preset.rawContent };
  }

  return { title: '', content: '' };
}

function parseHtmlOrTextResponse(rawHtml, url) {
  if (!rawHtml.includes('<html') && !rawHtml.includes('<body')) {
    return { title: '', content: rawHtml };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Remove scripts e estilos
  doc.querySelectorAll('script, style, noscript, nav, footer, header').forEach(el => el.remove());

  const title = doc.querySelector('title')?.innerText || doc.querySelector('h1')?.innerText || '';
  const mainContent = doc.querySelector('main, article, #content, .content, body')?.innerText || doc.body.innerText || '';

  return {
    title: title.replace(/ - NotebookLM| - Google/gi, '').trim(),
    content: mainContent.substring(0, 8000)
  };
}

/**
 * Extrator Profundo: Mapeia todo o material gerado em um workspace completo do Calisto
 */
function extrairMaterialCompleto(url, rawText, fetchedTitle = '') {
  let text = rawText || '';

  // Se o texto estiver vazio mas temos URL, busca se é um dos presets conhecidos
  if (!text && url) {
    const preset = (window.NOTEBOOKLM_PRESETS || []).find(p => url.toLowerCase().includes(p.url.toLowerCase()) || url.includes('robotica') || url.includes('coral'));
    if (preset) text = preset.rawContent;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 1. EXTRAÇÃO DO TÍTULO DO WORKSPACE
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
  if (!titulo) titulo = 'Estudo do NotebookLM';

  // 2. EXTRAÇÃO DO RESUMO & CONCEITOS
  let resumo = '';
  for (let l of lines) {
    if (!l.startsWith('#') && !l.startsWith('-') && !l.startsWith('*') && l.length > 30) {
      resumo = l;
      break;
    }
  }
  if (!resumo) {
    resumo = `Apresentação interativa e sala de estudos geradas a partir do material do seu workspace de ${titulo}!`;
  }

  // 3. EXTRAÇÃO DOS TÓPICOS PRINCIPAIS
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

  // 4. VÍDEO EDUCATIVO MAPEADO AUTOMATICAMENTE
  let videoUrl = '';
  // Se houver link de youtube no texto/HTML
  const ytMatch = text.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    videoUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  } else {
    // Mapeamento inteligente de vídeos infantis educativos conforme o tema
    const lowerTitle = (titulo + ' ' + text).toLowerCase();
    if (lowerTitle.includes('robô') || lowerTitle.includes('robótica') || lowerTitle.includes('ia') || lowerTitle.includes('inteligência')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/up_wOqKj7c4'; // Robótica / Ciência
    } else if (lowerTitle.includes('coral') || lowerTitle.includes('oceano') || lowerTitle.includes('mar') || lowerTitle.includes('peixe')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/n3_v08lP69Q'; // Oceanos
    } else if (lowerTitle.includes('espaço') || lowerTitle.includes('sistema solar') || lowerTitle.includes('planeta') || lowerTitle.includes('estrela')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/fD3BqA3k1tY'; // Espaço
    } else if (lowerTitle.includes('dinossauro') || lowerTitle.includes('fóssil') || lowerTitle.includes('t-rex')) {
      videoUrl = 'https://www.youtube-nocookie.com/embed/9w_Yh8jW3n8'; // Dinossauros
    } else {
      videoUrl = 'https://www.youtube-nocookie.com/embed/up_wOqKj7c4';
    }
  }

  // 5. INFOGRÁFICOS VISUAIS E ESTATÍSTICAS
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

  // 6. CURIOSIDADES DO TEMA
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

  // 7. FLASHCARDS (GLOSSÁRIO & PERGUNTAS)
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

  // 8. TESTES & QUIZZES DE FIXAÇÃO
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
      },
      {
        pergunta: `Por que é divertido estudar ${titulo} com o Calisto?`,
        opcoes: [
          'Porque ele é sábio, falante e adora ensinar os mistérios da ciência!',
          'Porque ele fica dormindo',
          'Porque não tem quizzes',
          'Nenhuma das anteriores'
        ],
        respostaCorreta: 0,
        explicacao: `Hehehe! Acertou em cheio! O Calisto tem mais de cem anos de penas de pura sabedoria!`
      }
    ];
  }

  // Objeto Workspace Completo
  const novoWorkspace = {
    id: 'nlm_' + Date.now(),
    isNotebookLM: true,
    notebookUrl: url || '',
    titulo: titulo,
    icone: '🌟',
    subtitulo: `Material importado do workspace: ${url ? url.substring(0, 40) : 'NotebookLM'}`,
    cor: 'linear-gradient(135deg, #1E40AF, #7C3AED)',
    videoUrl: videoUrl,
    resumo: resumo,
    topicos: topicos,
    infograficos: infograficos,
    curiosidades: curiosidades,
    flashcards: flashcards,
    quiz: quiz
  };

  // Gera os slides de apresentação ricos
  novoWorkspace.slides = window.gerarSlidesParaWorkspace(novoWorkspace);

  return novoWorkspace;
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

  // Importador do Google NotebookLM
  safeBind('btn-open-notebooklm', 'click', abrirModalNotebookLM);
  safeBind('btn-hero-import-notebooklm', 'click', abrirModalNotebookLM);
  safeBind('btn-quick-notebooklm', 'click', abrirModalNotebookLM);
  safeBind('btn-close-notebooklm', 'click', fecharModalNotebookLM);
  safeBind('btn-cancel-notebooklm', 'click', fecharModalNotebookLM);
  safeBind('btn-preset-robotics', 'click', () => carregarPresetNotebookLM(0));
  safeBind('btn-preset-coral', 'click', () => carregarPresetNotebookLM(1));
  safeBind('btn-preset-astronomy', 'click', () => carregarPresetNotebookLM(2));
  safeBind('notebooklm-file-input', 'change', carregarArquivoNotebookLM);
  safeBind('btn-generate-notebooklm', 'click', processarImportacaoNotebookLM);

  // Abas do Modal NotebookLM
  safeBind('btn-nlm-tab-url', 'click', () => {
    sounds.playPop();
    const tabUrl = document.getElementById('btn-nlm-tab-url');
    const tabManual = document.getElementById('btn-nlm-tab-manual');
    const viewUrl = document.getElementById('nlm-view-url');
    const viewManual = document.getElementById('nlm-view-manual');
    if (tabUrl) tabUrl.classList.add('active');
    if (tabManual) tabManual.classList.remove('active');
    if (viewUrl) viewUrl.style.display = 'block';
    if (viewManual) viewManual.style.display = 'none';
  });

  safeBind('btn-nlm-tab-manual', 'click', () => {
    sounds.playPop();
    const tabUrl = document.getElementById('btn-nlm-tab-url');
    const tabManual = document.getElementById('btn-nlm-tab-manual');
    const viewUrl = document.getElementById('nlm-view-url');
    const viewManual = document.getElementById('nlm-view-manual');
    if (tabManual) tabManual.classList.add('active');
    if (tabUrl) tabUrl.classList.remove('active');
    if (viewManual) viewManual.style.display = 'block';
    if (viewUrl) viewUrl.style.display = 'none';
  });

  // Modo Apresentação do Calisto
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

  // Controle por teclado (Setas e Barra de Espaço) na Apresentação
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
