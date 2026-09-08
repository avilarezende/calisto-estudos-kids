/**
 * ====================================================================
 * MASCOTE 3D ULTRA REALISTA DO PERIQUITO RING NECK (CALISTO) 🦜✨
 * ====================================================================
 * Novas Funcionalidades:
 * - Rastreamento Ocular Ativo: Olhos e cabeça seguem organicamente o cursor do mouse
 * - Asas Articuladas em Múltiplas Camadas (Ombro + Antebraço + Rêmiges Primárias & Secundárias)
 * - Anatomia Fiel da Espécie Psittacula krameri (Bico rubi-coral com ponta escura, anel clássico)
 * - Texturas procedurais PBR em alta definição e poleiro orgânico de madeira
 * ====================================================================
 */

// Rastreamento global da posição do mouse/touch
window.currentMouseX = window.innerWidth / 2;
window.currentMouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
  window.currentMouseX = e.clientX;
  window.currentMouseY = e.clientY;
});

window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    window.currentMouseX = e.touches[0].clientX;
    window.currentMouseY = e.touches[0].clientY;
  }
}, { passive: true });

// Texturas procedurais em memória via HTML5 Canvas
function createFeatherTexture(baseColor, accentColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, baseColor);
  grad.addColorStop(1, accentColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.2;
  for (let y = 0; y < 256; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(80, y + 4, 180, y - 4, 256, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.09)';
  ctx.lineWidth = 1.0;
  for (let y = 3; y < 256; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(80, y - 3, 180, y + 3, 256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#854D0E';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#713F12';
  for (let i = 0; i < 256; i += 8) {
    ctx.fillRect(i, 0, 4, 128);
  }

  ctx.strokeStyle = '#A16207';
  ctx.lineWidth = 1.5;
  for (let y = 0; y < 128; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + (Math.random() * 4 - 2));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

function createEyeIrisTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Anel periorbital claro
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();

  // Íris amarelo-clara característica do Ringneck
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.fill();

  // Limbo corneo
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(64, 64, 50, 0, Math.PI * 2);
  ctx.stroke();

  // Pupila negra profunda
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(64, 64, 30, 0, Math.PI * 2);
  ctx.fill();

  // Brilho specular primário
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(52, 50, 8, 0, Math.PI * 2);
  ctx.fill();

  // Brilho secundário suave
  ctx.beginPath();
  ctx.arc(72, 74, 4, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

class RingNeckParrot3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      width: 230,
      height: 230,
      interactive: true,
      scale: 1.0,
      isWanderer: false
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.parrotGroup = new THREE.Group();

    // Grupos Articulados
    this.bodyGroup = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.upperBeak = null;
    this.lowerBeak = null;
    this.leftEye = null;
    this.rightEye = null;
    this.leftEyelid = null;
    this.rightEyelid = null;
    this.leftBrow = null;
    this.rightBrow = null;

    // Asas Articuladas em 2 Segmentos (Ombro + Antebraço/Penas)
    this.leftWingGroup = new THREE.Group();
    this.leftForearmGroup = new THREE.Group();
    this.rightWingGroup = new THREE.Group();
    this.rightForearmGroup = new THREE.Group();

    this.tailGroup = new THREE.Group();
    this.leftLegGroup = new THREE.Group();
    this.rightLegGroup = new THREE.Group();
    this.perchMesh = null;

    // Estados e Timers
    this.mood = 'idle';
    this.clock = new THREE.Clock();
    this.isSpeaking = false;
    this.blinkTimer = 2.0;
    this.isBlinking = false;
    this.angryTimer = 0;
    this.happyTimer = 0;
    this.flyingTimer = 0;
    this.headTwitchTimer = 1.0;
    this.targetHeadRotY = 0;
    this.targetHeadRotZ = 0;

    this.init();
  }

  init() {
    const w = this.options.width || this.container.clientWidth || 230;
    const h = this.options.height || this.container.clientHeight || 230;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000);
    this.camera.position.set(0, 0.65, 6.4);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Iluminação Tri-Point Foto-Realista
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.45);
    keyLight.position.set(4, 7, 6);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.65);
    fillLight.position.set(-5, 3, 4);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 0.95);
    rimLight.position.set(0, 6, -5);
    this.scene.add(rimLight);

    this.buildRealisticRingneck();
    this.scene.add(this.parrotGroup);
    this.parrotGroup.scale.set(this.options.scale, this.options.scale, this.options.scale);
    this.parrotGroup.position.y = -0.05;

    if (this.options.interactive) {
      this.container.style.cursor = 'pointer';
      this.container.title = 'Calisto';
      this.container.addEventListener('click', (e) => {
        e.stopPropagation();
        this.provocar();
      });
    }

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  buildRealisticRingneck() {
    // Texturas Procedurais
    const featherTexGreen = createFeatherTexture('#16A34A', '#22C55E');
    const featherTexDark = createFeatherTexture('#14532D', '#15803D');
    const woodTex = createWoodTexture();
    const eyeTex = createEyeIrisTexture();

    // Materiais PBR
    const matGreenBody = new THREE.MeshStandardMaterial({
      color: 0x22C55E,
      roughness: 0.58,
      metalness: 0.04,
      map: featherTexGreen
    });

    const matBelly = new THREE.MeshStandardMaterial({
      color: 0x86EFAC,
      roughness: 0.65,
      metalness: 0.02
    });

    const matNapeTurquoise = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      roughness: 0.45,
      metalness: 0.08
    });

    const matDarkWings = new THREE.MeshStandardMaterial({
      color: 0x15803D,
      roughness: 0.50,
      metalness: 0.05,
      map: featherTexDark
    });

    const matBeakUpper = new THREE.MeshStandardMaterial({
      color: 0xE11D48, // Coral-rubi vivo
      roughness: 0.16,
      metalness: 0.06
    });

    const matBeakLower = new THREE.MeshStandardMaterial({
      color: 0x090D16,
      roughness: 0.22,
      metalness: 0.05
    });

    const matCere = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.8
    });

    const matRingBlack = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.95
    });

    const matRingRose = new THREE.MeshStandardMaterial({
      color: 0xFB7185,
      roughness: 0.55
    });

    const matTailTurquoise = new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      roughness: 0.48,
      metalness: 0.06
    });

    const matLegSkin = new THREE.MeshStandardMaterial({
      color: 0xD97706,
      roughness: 0.75
    });

    const matClaw = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.3
    });

    const matEye = new THREE.MeshBasicMaterial({
      map: eyeTex
    });

    const matWood = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.85
    });

    // ==========================================
    // 1. CORPO ESGUIO & ORGÂNICO (Psittacula)
    // ==========================================
    const bodyGeo = new THREE.SphereGeometry(0.82, 32, 32);
    bodyGeo.scale(0.80, 1.38, 0.78);
    const bodyMesh = new THREE.Mesh(bodyGeo, matGreenBody);
    bodyMesh.position.y = 0.48;
    this.bodyGroup.add(bodyMesh);

    // Ventre suave
    const bellyGeo = new THREE.SphereGeometry(0.70, 24, 24);
    bellyGeo.scale(0.76, 1.15, 0.42);
    const bellyMesh = new THREE.Mesh(bellyGeo, matBelly);
    bellyMesh.position.set(0, 0.46, 0.50);
    this.bodyGroup.add(bellyMesh);

    this.parrotGroup.add(this.bodyGroup);

    // ==========================================
    // 2. CABEÇA & ANEL DO RINGNECK
    // ==========================================
    this.headGroup.position.set(0, 1.58, 0.08);

    const headGeo = new THREE.SphereGeometry(0.66, 32, 32);
    headGeo.scale(0.92, 1.05, 0.94);
    const headMesh = new THREE.Mesh(headGeo, matGreenBody);
    this.headGroup.add(headMesh);

    // Nuca azul-turquesa
    const napeGeo = new THREE.SphereGeometry(0.52, 20, 20);
    napeGeo.scale(0.85, 0.75, 0.38);
    const napeMesh = new THREE.Mesh(napeGeo, matNapeTurquoise);
    napeMesh.position.set(0, 0.18, -0.44);
    this.headGroup.add(napeMesh);

    // Faixa preta da garganta
    const blackCollarGeo = new THREE.TorusGeometry(0.54, 0.045, 12, 36, Math.PI * 1.3);
    blackCollarGeo.rotateX(Math.PI / 2.12);
    blackCollarGeo.rotateZ(-Math.PI * 0.65);
    const blackCollar = new THREE.Mesh(blackCollarGeo, matRingBlack);
    blackCollar.position.set(0, -0.42, 0.05);
    this.headGroup.add(blackCollar);

    // Colar rosa-pastel na nuca
    const roseCollarGeo = new THREE.TorusGeometry(0.54, 0.04, 12, 36, Math.PI * 1.15);
    roseCollarGeo.rotateX(Math.PI / 2.12);
    roseCollarGeo.rotateZ(Math.PI * 0.42);
    const roseCollar = new THREE.Mesh(roseCollarGeo, matRingRose);
    roseCollar.position.set(0, -0.44, 0.05);
    this.headGroup.add(roseCollar);

    // ==========================================
    // 3. BICO EM GANCHO CORAL-RUBI
    // ==========================================
    const upperBeakGeo = new THREE.ConeGeometry(0.25, 0.78, 24);
    upperBeakGeo.rotateX(Math.PI / 2.05);
    upperBeakGeo.scale(0.95, 1.12, 1.48);
    this.upperBeak = new THREE.Mesh(upperBeakGeo, matBeakUpper);
    this.upperBeak.position.set(0, -0.06, 0.74);
    this.upperBeak.rotation.x = 0.40;
    this.headGroup.add(this.upperBeak);

    const beakTipGeo = new THREE.ConeGeometry(0.10, 0.28, 16);
    beakTipGeo.rotateX(Math.PI / 2.05);
    const beakTip = new THREE.Mesh(beakTipGeo, matBeakLower);
    beakTip.position.set(0, -0.22, 1.05);
    beakTip.rotation.x = 0.72;
    this.headGroup.add(beakTip);

    const cereGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.12, 16);
    cereGeo.rotateX(Math.PI / 2.1);
    const cere = new THREE.Mesh(cereGeo, matCere);
    cere.position.set(0, 0.18, 0.60);
    this.headGroup.add(cere);

    const lowerBeakGeo = new THREE.ConeGeometry(0.16, 0.35, 16);
    lowerBeakGeo.rotateX(-Math.PI / 2.3);
    this.lowerBeak = new THREE.Mesh(lowerBeakGeo, matBeakLower);
    this.lowerBeak.position.set(0, -0.24, 0.64);
    this.headGroup.add(this.lowerBeak);

    // ==========================================
    // 4. OLHOS SEGUIDORES COM RASTREAMENTO DO MOUSE
    // ==========================================
    const eyeGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const eyelidGeo = new THREE.SphereGeometry(0.19, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const browGeo = new THREE.BoxGeometry(0.28, 0.05, 0.08);

    // Olho Esquerdo
    this.leftEye = new THREE.Mesh(eyeGeo, matEye);
    this.leftEye.position.set(-0.36, 0.18, 0.45);
    this.leftEye.rotation.y = -0.42;

    this.leftEyelid = new THREE.Mesh(eyelidGeo, matGreenBody);
    this.leftEyelid.position.set(-0.36, 0.18, 0.45);
    this.leftEyelid.rotation.x = -Math.PI / 2;

    this.leftBrow = new THREE.Mesh(browGeo, matDarkWings);
    this.leftBrow.position.set(-0.35, 0.35, 0.46);
    this.leftBrow.rotation.z = -0.15;

    this.headGroup.add(this.leftEye);
    this.headGroup.add(this.leftEyelid);
    this.headGroup.add(this.leftBrow);

    // Olho Direito
    this.rightEye = new THREE.Mesh(eyeGeo, matEye);
    this.rightEye.position.set(0.36, 0.18, 0.45);
    this.rightEye.rotation.y = 0.42;

    this.rightEyelid = new THREE.Mesh(eyelidGeo, matGreenBody);
    this.rightEyelid.position.set(0.36, 0.18, 0.45);
    this.rightEyelid.rotation.x = -Math.PI / 2;

    this.rightBrow = new THREE.Mesh(browGeo, matDarkWings);
    this.rightBrow.position.set(0.35, 0.35, 0.46);
    this.rightBrow.rotation.z = 0.15;

    this.headGroup.add(this.rightEye);
    this.headGroup.add(this.rightEyelid);
    this.headGroup.add(this.rightBrow);

    this.parrotGroup.add(this.headGroup);

    // ==========================================
    // 5. ASAS ARTICULADAS EM MÚLTIPLAS CAMADAS DE PENAS
    // ==========================================
    // Função auxiliar para criar conjunto realista de rêmiges primárias e secundárias
    const buildWingStructure = (isLeft) => {
      const sign = isLeft ? -1 : 1;
      const wingRoot = isLeft ? this.leftWingGroup : this.rightWingGroup;
      const forearm = isLeft ? this.leftForearmGroup : this.rightForearmGroup;

      wingRoot.position.set(sign * 0.72, 1.05, 0.05);

      // Ombro / Coberturas Menores
      const shoulderGeo = new THREE.SphereGeometry(0.32, 16, 16);
      shoulderGeo.scale(0.85, 1.25, 0.65);
      const shoulderMesh = new THREE.Mesh(shoulderGeo, matGreenBody);
      shoulderMesh.position.set(sign * 0.08, -0.15, 0);
      wingRoot.add(shoulderMesh);

      // Articulação do Cotovelo / Antebraço
      forearm.position.set(sign * 0.12, -0.32, 0.02);

      // Coberturas Médias / Rádio-Ulna
      const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.35);
      const armMesh = new THREE.Mesh(armGeo, matGreenBody);
      armMesh.position.set(0, -0.22, 0);
      forearm.add(armMesh);

      // 5 Rêmiges Primárias Esculpidas com Pontas Graduadas (Voo)
      const primaryLengths = [1.35, 1.25, 1.15, 1.00, 0.85];
      primaryLengths.forEach((len, idx) => {
        const featherGeo = new THREE.ConeGeometry(0.09, len, 8);
        featherGeo.scale(0.45, 1.0, 1.4);
        featherGeo.rotateX(0.15);
        featherGeo.rotateZ(sign * (0.08 + idx * 0.04));

        const pMesh = new THREE.Mesh(featherGeo, matDarkWings);
        pMesh.position.set(sign * (idx * 0.035), -len * 0.48, idx * 0.035 - 0.08);
        forearm.add(pMesh);
      });

      wingRoot.add(forearm);
      this.parrotGroup.add(wingRoot);
    };

    buildWingStructure(true);  // Asa Esquerda
    buildWingStructure(false); // Asa Direita

    // ==========================================
    // 6. CAUDA GRADUADA LONGA AZUL-TURQUESA
    // ==========================================
    const tailCentralGeo = new THREE.ConeGeometry(0.19, 2.35, 16);
    tailCentralGeo.rotateX(-0.42);
    const tailCentral = new THREE.Mesh(tailCentralGeo, matTailTurquoise);
    this.tailGroup.add(tailCentral);

    const tailSideGeo = new THREE.ConeGeometry(0.13, 1.5, 12);
    tailSideGeo.rotateX(-0.36);
    const tailLeft = new THREE.Mesh(tailSideGeo, matGreenBody);
    tailLeft.position.set(-0.13, 0.22, 0.05);
    const tailRight = new THREE.Mesh(tailSideGeo, matGreenBody);
    tailRight.position.set(0.13, 0.22, 0.05);
    this.tailGroup.add(tailLeft);
    this.tailGroup.add(tailRight);

    this.tailGroup.position.set(0, -0.36, -0.48);
    this.parrotGroup.add(this.tailGroup);

    // ==========================================
    // 7. PATAS ZIGODÁCTILAS COMPLETAS (2+2)
    // ==========================================
    const legGeo = new THREE.CylinderGeometry(0.048, 0.042, 0.38, 12);
    const toeGeo = new THREE.BoxGeometry(0.042, 0.038, 0.24);
    const clawGeo = new THREE.ConeGeometry(0.022, 0.07, 8);
    clawGeo.rotateX(Math.PI / 2);

    // Perna Esquerda
    this.leftLegGroup.position.set(-0.26, -0.22, 0.18);
    const lLegMesh = new THREE.Mesh(legGeo, matLegSkin);
    lLegMesh.position.y = -0.18;
    this.leftLegGroup.add(lLegMesh);

    const lToeF1 = new THREE.Mesh(toeGeo, matLegSkin);
    lToeF1.position.set(-0.04, -0.35, 0.09);
    const lClaw1 = new THREE.Mesh(clawGeo, matClaw);
    lClaw1.position.set(-0.04, -0.35, 0.21);
    this.leftLegGroup.add(lToeF1);
    this.leftLegGroup.add(lClaw1);

    const lToeF2 = new THREE.Mesh(toeGeo, matLegSkin);
    lToeF2.position.set(0.04, -0.35, 0.09);
    const lClaw2 = new THREE.Mesh(clawGeo, matClaw);
    lClaw2.position.set(0.04, -0.35, 0.21);
    this.leftLegGroup.add(lToeF2);
    this.leftLegGroup.add(lClaw2);

    const lToeB1 = new THREE.Mesh(toeGeo, matLegSkin);
    lToeB1.position.set(0, -0.35, -0.08);
    this.leftLegGroup.add(lToeB1);

    this.parrotGroup.add(this.leftLegGroup);

    // Perna Direita
    this.rightLegGroup.position.set(0.26, -0.22, 0.18);
    const rLegMesh = new THREE.Mesh(legGeo, matLegSkin);
    rLegMesh.position.y = -0.18;
    this.rightLegGroup.add(rLegMesh);

    const rToeF1 = new THREE.Mesh(toeGeo, matLegSkin);
    rToeF1.position.set(-0.04, -0.35, 0.09);
    const rClaw1 = new THREE.Mesh(clawGeo, matClaw);
    rClaw1.position.set(-0.04, -0.35, 0.21);
    this.rightLegGroup.add(rToeF1);
    this.rightLegGroup.add(rClaw1);

    const rToeF2 = new THREE.Mesh(toeGeo, matLegSkin);
    rToeF2.position.set(0.04, -0.35, 0.09);
    const rClaw2 = new THREE.Mesh(clawGeo, matClaw);
    rClaw2.position.set(0.04, -0.35, 0.21);
    this.rightLegGroup.add(rToeF2);
    this.rightLegGroup.add(rClaw2);

    const rToeB1 = new THREE.Mesh(toeGeo, matLegSkin);
    rToeB1.position.set(0, -0.35, -0.08);
    this.rightLegGroup.add(rToeB1);

    this.parrotGroup.add(this.rightLegGroup);

    // ==========================================
    // 8. POLEIRO DE MADEIRA NATURAL
    // ==========================================
    const perchGeo = new THREE.CylinderGeometry(0.10, 0.11, 2.4, 16);
    perchGeo.rotateZ(Math.PI / 2);
    this.perchMesh = new THREE.Mesh(perchGeo, matWood);
    this.perchMesh.position.set(0, -0.62, 0.18);
    this.parrotGroup.add(this.perchMesh);
  }

  setMood(mood) {
    this.mood = mood;
    if (mood === 'angry') {
      this.angryTimer = 3.5;
    } else if (mood === 'happy') {
      this.happyTimer = 3.0;
    } else if (mood === 'flying') {
      this.flyingTimer = 2.0;
    }
  }

  provocar() {
    this.setMood('angry');
    if (window.sounds) window.sounds.playRingneckRealChirp();
    const nome = (window.AppState && window.AppState.childName) ? window.AppState.childName : 'explorador';
    const falasBravas = [
      `Ai minhas peninhas, ${nome}! Não me cutuca!`,
      `Ora vejam só! No meu tempo respeitavam o sábio Calisto, ${nome}!`,
      `Bico calado e foco nos estudos, ${nome}!`
    ];
    const fala = falasBravas[Math.floor(Math.random() * falasBravas.length)];
    if (window.falarTexto) window.falarTexto(fala);

    if (window.calistoWanderer) {
      setTimeout(() => window.calistoWanderer.flyToRandomSpot(), 600);
    }
  }

  onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w && h) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. RASTREAMENTO DO MOUSE PELOS OLHOS & CABEÇA
    let normMouseX = 0;
    let normMouseY = 0;
    if (this.container) {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = window.currentMouseX - centerX;
      const dy = window.currentMouseY - centerY;
      normMouseX = THREE.MathUtils.clamp(dx / (window.innerWidth * 0.45), -1, 1);
      normMouseY = THREE.MathUtils.clamp(dy / (window.innerHeight * 0.45), -1, 1);
    }

    // Olhos acompanham suavemente a posição do cursor
    const eyeLookX = normMouseY * 0.32;
    const eyeLookY_L = -0.42 + normMouseX * 0.42;
    const eyeLookY_R = 0.42 + normMouseX * 0.42;

    if (this.leftEye) {
      this.leftEye.rotation.x = THREE.MathUtils.lerp(this.leftEye.rotation.x, eyeLookX, 0.18);
      this.leftEye.rotation.y = THREE.MathUtils.lerp(this.leftEye.rotation.y, eyeLookY_L, 0.18);
    }
    if (this.rightEye) {
      this.rightEye.rotation.x = THREE.MathUtils.lerp(this.rightEye.rotation.x, eyeLookX, 0.18);
      this.rightEye.rotation.y = THREE.MathUtils.lerp(this.rightEye.rotation.y, eyeLookY_R, 0.18);
    }

    // 2. PISCAR NATURAL DOS OLHOS
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.isBlinking = true;
      if (this.blinkTimer <= -0.14) {
        this.isBlinking = false;
        this.blinkTimer = 2.0 + Math.random() * 3.5;
      }
    }
    const blinkRot = this.isBlinking ? 0 : -Math.PI / 2;
    if (this.leftEyelid) this.leftEyelid.rotation.x = blinkRot;
    if (this.rightEyelid) this.rightEyelid.rotation.x = blinkRot;

    // 3. FALA SINCRONIZADA
    if (this.isSpeaking) {
      const beakMotion = Math.sin(time * 30) * 0.20;
      if (this.lowerBeak) this.lowerBeak.position.y = -0.24 - Math.abs(beakMotion);
      if (this.upperBeak) this.upperBeak.rotation.x = 0.40 - Math.abs(beakMotion) * 0.5;
      this.headGroup.position.y = 1.58 + Math.sin(time * 16) * 0.04;
    } else {
      if (this.lowerBeak) this.lowerBeak.position.y = -0.24;
      if (this.upperBeak) this.upperBeak.rotation.x = 0.40;
    }

    // 4. ANIMAÇÃO DE VOO (Asas abertas com batimento aerodinâmico)
    if (this.flyingTimer > 0 || this.mood === 'flying') {
      if (this.flyingTimer > 0) this.flyingTimer -= delta;
      if (this.perchMesh) this.perchMesh.visible = false;

      const flap = Math.sin(time * 36) * 0.95;
      const forearmFlap = Math.sin(time * 36 - 0.35) * 0.45;

      // Ombro bate para cima e para baixo
      this.leftWingGroup.rotation.z = 0.35 + flap;
      this.rightWingGroup.rotation.z = -0.35 - flap;

      // Antebraço flexiona dinamicamente
      this.leftForearmGroup.rotation.z = 0.25 + forearmFlap;
      this.rightForearmGroup.rotation.z = -0.25 - forearmFlap;

      this.parrotGroup.rotation.x = 0.30;
      this.parrotGroup.position.y = -0.05 + Math.sin(time * 14) * 0.12;
      this.tailGroup.rotation.x = -0.15 + Math.sin(time * 14) * 0.1;

      // Patas recolhidas
      this.leftLegGroup.rotation.x = -1.1;
      this.rightLegGroup.rotation.x = -1.1;
    }
    // 5. HUMOR: ENRAIVADO (Asas abertas em guarda e sobrancelha franzida)
    else if (this.angryTimer > 0) {
      this.angryTimer -= delta;
      if (this.perchMesh) this.perchMesh.visible = true;

      this.leftBrow.rotation.z = 0.52;
      this.rightBrow.rotation.z = -0.52;
      this.leftBrow.position.y = 0.28;
      this.rightBrow.position.y = 0.28;

      // Asas abertas defensivamente
      this.leftWingGroup.rotation.z = 0.38 + Math.sin(time * 28) * 0.18;
      this.rightWingGroup.rotation.z = -0.38 - Math.sin(time * 28) * 0.18;
      this.leftForearmGroup.rotation.z = 0.30;
      this.rightForearmGroup.rotation.z = -0.30;

      this.headGroup.rotation.z = Math.sin(time * 32) * 0.15;
      this.headGroup.rotation.y = Math.cos(time * 26) * 0.2;
      this.parrotGroup.position.y = -0.05 + Math.abs(Math.sin(time * 22)) * 0.08;
    }
    // 6. HUMOR: FELIZ (Asas batendo animadas e pulinhos)
    else if (this.happyTimer > 0) {
      this.happyTimer -= delta;
      if (this.perchMesh) this.perchMesh.visible = true;

      this.leftBrow.rotation.z = -0.25;
      this.rightBrow.rotation.z = 0.25;
      this.leftBrow.position.y = 0.38;
      this.rightBrow.position.y = 0.38;

      this.parrotGroup.position.y = -0.05 + Math.abs(Math.sin(time * 16)) * 0.14;

      const happyFlutter = Math.sin(time * 22) * 0.35;
      this.leftWingGroup.rotation.z = 0.25 + happyFlutter;
      this.rightWingGroup.rotation.z = -0.25 - happyFlutter;
      this.leftForearmGroup.rotation.z = 0.15 + happyFlutter * 0.5;
      this.rightForearmGroup.rotation.z = -0.15 - happyFlutter * 0.5;

      this.headGroup.rotation.z = Math.sin(time * 12) * 0.2;
    }
    // 7. IDLE REALISTA (Asas repousadas no corpo, respiração e cabeça curiosa seguindo o mouse)
    else {
      if (this.perchMesh) this.perchMesh.visible = true;

      this.leftBrow.rotation.z = -0.15;
      this.rightBrow.rotation.z = 0.15;
      this.leftBrow.position.y = 0.35;
      this.rightBrow.position.y = 0.35;

      // Respiração orgânica do peito
      const breath = Math.sin(time * 2.6) * 0.025;
      this.bodyGroup.scale.set(1 + breath, 1 + breath * 0.7, 1 + breath);
      this.parrotGroup.position.y = -0.05 + Math.sin(time * 2.6) * 0.02;

      // Cauda oscilando com equilíbrio
      this.tailGroup.rotation.z = Math.sin(time * 2.2) * 0.06;

      // Asas dobradas perfeitamente ao lado do corpo
      this.leftWingGroup.rotation.set(
        -0.08,
        0.18,
        0.12 + Math.sin(time * 2.6) * 0.02
      );
      this.leftForearmGroup.rotation.set(0, -0.15, 0.28);

      this.rightWingGroup.rotation.set(
        -0.08,
        -0.18,
        -0.12 - Math.sin(time * 2.6) * 0.02
      );
      this.rightForearmGroup.rotation.set(0, 0.15, -0.28);

      this.parrotGroup.rotation.x = 0;

      // Patas firmes no poleiro
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;

      // Cabeça combina curiosidade aleatória com o olhar no mouse
      this.headTwitchTimer -= delta;
      if (this.headTwitchTimer <= 0) {
        this.targetHeadRotY = (Math.random() - 0.5) * 0.45;
        this.targetHeadRotZ = (Math.random() - 0.5) * 0.25;
        this.headTwitchTimer = 1.4 + Math.random() * 2.5;
      }

      const targetHeadY = normMouseX * 0.45 + this.targetHeadRotY * 0.35;
      const targetHeadX = -normMouseY * 0.22;
      const targetHeadZ = normMouseX * 0.12 + this.targetHeadRotZ * 0.35;

      this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetHeadY, 0.08);
      this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetHeadX, 0.08);
      this.headGroup.rotation.z = THREE.MathUtils.lerp(this.headGroup.rotation.z, targetHeadZ, 0.08);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ====================================================================
// CONTROLADOR DO CALISTO ANDARILHO COM LIMITES DE TELA
// ====================================================================
class CalistoWandererController {
  constructor() {
    this.wrapper = document.getElementById('calisto-wanderer-container');
    this.speechBubble = document.getElementById('calisto-wanderer-speech');
    this.mascot3D = null;
    
    this.avatarWidth = 150;
    this.avatarHeight = 150;
    this.padding = 24;

    this.currentX = window.innerWidth - this.avatarWidth - this.padding;
    this.currentY = window.innerHeight - this.avatarHeight - this.padding;
    this.isFlying = false;
    this.wanderInterval = null;

    if (this.wrapper) {
      this.init();
    }
  }

  init() {
    this.mascot3D = new RingNeckParrot3D('calisto-wanderer-3d', {
      width: 150,
      height: 150,
      scale: 0.92,
      interactive: true
    });

    this.clampAndSetPosition(this.currentX, this.currentY);
    this.startWandering();

    window.addEventListener('resize', () => {
      this.clampAndSetPosition(this.currentX, this.currentY);
    });

    document.addEventListener('dblclick', (e) => {
      if (!e.target.closest('button, input, textarea, iframe, a, .workspace-card')) {
        this.flyTo(e.clientX - 75, e.clientY - 75);
      }
    });
  }

  clampAndSetPosition(x, y) {
    const minX = this.padding;
    const maxX = Math.max(minX, window.innerWidth - this.avatarWidth - this.padding);
    const minY = 90;
    const maxY = Math.max(minY, window.innerHeight - this.avatarHeight - this.padding);

    this.currentX = Math.max(minX, Math.min(x, maxX));
    this.currentY = Math.max(minY, Math.min(y, maxY));

    this.wrapper.style.left = `${this.currentX}px`;
    this.wrapper.style.top = `${this.currentY}px`;

    if (this.speechBubble) {
      if (this.currentX > window.innerWidth / 2) {
        this.speechBubble.style.right = '20px';
        this.speechBubble.style.left = 'auto';
      } else {
        this.speechBubble.style.left = '20px';
        this.speechBubble.style.right = 'auto';
      }
    }
  }

  flyTo(targetX, targetY) {
    if (this.isFlying) return;
    this.isFlying = true;

    if (window.sounds) window.sounds.playRingneckRealChirp();
    if (this.mascot3D) this.mascot3D.setMood('flying');

    this.wrapper.classList.add('flying');

    const nome = (window.AppState && window.AppState.childName) ? window.AppState.childName : 'explorador';
    const frasesVoo = [
      `Batendo asas para aí, ${nome}!`,
      `Olha as asas do Calisto voando!`,
      `Pousando agora com o sábio Calisto!`
    ];
    this.mostrarFala(frasesVoo[Math.floor(Math.random() * frasesVoo.length)], 2200);

    const startX = this.currentX;
    const startY = this.currentY;

    const minX = this.padding;
    const maxX = Math.max(minX, window.innerWidth - this.avatarWidth - this.padding);
    const minY = 90;
    const maxY = Math.max(minY, window.innerHeight - this.avatarHeight - this.padding);
    const endX = Math.max(minX, Math.min(targetX, maxX));
    const endY = Math.max(minY, Math.min(targetY, maxY));

    const duration = 1100;
    const startTime = performance.now();

    const animateFlight = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease + Math.sin(progress * Math.PI) * -60;

      this.clampAndSetPosition(curX, curY);

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        this.isFlying = false;
        this.wrapper.classList.remove('flying');
        this.wrapper.classList.add('landed-hop');
        setTimeout(() => this.wrapper.classList.remove('landed-hop'), 400);

        if (this.mascot3D) this.mascot3D.setMood('idle');
      }
    };

    requestAnimationFrame(animateFlight);
  }

  flyToRandomSpot() {
    const pad = this.padding;
    const maxX = window.innerWidth - this.avatarWidth - pad;
    const maxY = window.innerHeight - this.avatarHeight - pad;

    const spots = [
      { x: maxX, y: maxY },
      { x: pad, y: maxY },
      { x: maxX, y: 110 },
      { x: pad, y: 110 },
      { x: window.innerWidth / 2 - 75, y: maxY - 20 }
    ];
    const spot = spots[Math.floor(Math.random() * spots.length)];
    this.flyTo(spot.x, spot.y);
  }

  mostrarFala(texto, tempoMs = 3500) {
    if (!this.speechBubble) return;
    this.speechBubble.textContent = texto;
    this.speechBubble.classList.add('show');
    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => {
      this.speechBubble.classList.remove('show');
    }, tempoMs);
  }

  startWandering() {
    clearInterval(this.wanderInterval);
    this.wanderInterval = setInterval(() => {
      if (Math.random() > 0.45 && !this.isFlying) {
        this.flyToRandomSpot();
      }
    }, 16000);
  }
}

// Instâncias Globais
window.parrot3DInstances = {};

function initParrot3D() {
  if (typeof THREE === 'undefined') return;

  const heroContainer = document.getElementById('paco-hero-3d');
  if (heroContainer) {
    window.parrot3DInstances.hero = new RingNeckParrot3D('paco-hero-3d', { width: 230, height: 230, scale: 1.12 });
  }

  const studyContainer = document.getElementById('paco-study-3d');
  if (studyContainer) {
    window.parrot3DInstances.study = new RingNeckParrot3D('paco-study-3d', { width: 200, height: 200, scale: 1.02 });
  }

  window.calistoWanderer = new CalistoWandererController();
}

function setParrotMoodAll(mood) {
  Object.values(window.parrot3DInstances).forEach(p => p.setMood(mood));
  if (window.calistoWanderer && window.calistoWanderer.mascot3D) {
    window.calistoWanderer.mascot3D.setMood(mood);
  }
}

function setParrotSpeakingAll(isSpeaking) {
  Object.values(window.parrot3DInstances).forEach(p => {
    p.isSpeaking = isSpeaking;
  });
  if (window.calistoWanderer && window.calistoWanderer.mascot3D) {
    window.calistoWanderer.mascot3D.isSpeaking = isSpeaking;
  }
}

window.RingNeckParrot3D = RingNeckParrot3D;
window.initParrot3D = initParrot3D;
window.setParrotMoodAll = setParrotMoodAll;
window.setParrotSpeakingAll = setParrotSpeakingAll;
