const HER_NAME = "Tunaruz";
document.querySelectorAll('.her-name').forEach(el => el.innerText = HER_NAME);

// Audio Synthesis for precise, cinematic sound without loading external files
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSubtlePulse() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

function playHeartbeatRush() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // A soft, low romantic heartbeat swell instead of harsh glitch
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

function playMagicalChime() {
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine'; // softer than triangle
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 1.2);

        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 1.2);
    });
}

// Generate Heart Texture for Particles
function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 105, 180, 1)';

    ctx.beginPath();
    const x = 64, y = 45;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - 25, x - 35, y - 35, x - 55, y - 10);
    ctx.bezierCurveTo(x - 75, y + 25, x - 35, y + 55, x, y + 85);
    ctx.bezierCurveTo(x + 35, y + 55, x + 75, y + 25, x + 55, y - 10);
    ctx.bezierCurveTo(x + 35, y - 35, x, y - 25, x, y);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}
const heartTex = createHeartTexture();

// THREE.JS SETUP
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// SCENE 1 & 2 OBJECTS
// Central softly pulsing sphere (core of the rose)
const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(coreSphere);

const glowGeo = new THREE.SphereGeometry(0.8, 32, 32);
const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffb6c1, // Softer pink
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
});
const glowSphere = new THREE.Mesh(glowGeo, glowMat);
coreSphere.add(glowSphere);

// Trail Particles (The Rose made of tiny hearts)
const maxTrailParticles = 4000;
const trailGeo = new THREE.BufferGeometry();
const trailPos = new Float32Array(maxTrailParticles * 3);
const trailColor = new Float32Array(maxTrailParticles * 3);
const trailSizes = new Float32Array(maxTrailParticles);

for (let i = 0; i < maxTrailParticles; i++) {
    trailPos[i * 3] = 0; trailPos[i * 3 + 1] = 0; trailPos[i * 3 + 2] = 0;
    // Vary between pink, light pink, and soft white
    const mix = Math.random();
    trailColor[i * 3] = 1;
    trailColor[i * 3 + 1] = 0.5 + mix * 0.4;
    trailColor[i * 3 + 2] = 0.7 + mix * 0.3;
    trailSizes[i] = 0;
}

trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColor, 3));
trailGeo.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

// Shader material that utilizes the Heart Texture
const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        pointTexture: { value: heartTex }
    },
    vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (60.0 / -mvPosition.z) * (1.0 + sin(position.x * 5.0 + position.y * 5.0) * 0.2); // slight pulse variance
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            if (texColor.a < 0.1) discard;
            // Add a soft glow from the texture alpha
            gl_FragColor = vec4(vColor, texColor.a * 0.9);
        }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
});

const trailMesh = new THREE.Points(trailGeo, particleMaterial);
scene.add(trailMesh);

// Stars/Floating Hearts Background (Hidden initially)
const starsGeo = new THREE.BufferGeometry();
const starsCount = 1500;
const starsPos = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    starsPos[i] = (Math.random() - 0.5) * 200;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({
    color: 0xffe4e1,
    size: 0.8,
    transparent: true,
    opacity: 0,
    map: heartTex,
    blending: THREE.AdditiveBlending,
    depthTest: false
});
const starsMesh = new THREE.Points(starsGeo, starsMat);
scene.add(starsMesh);

// VARIABLES
let currentPhase = -1; // -1: Wait for click
let trailIndex = 0;
let time = 0;
let isPulsePhase = false;
let isDrawingPhase = false;
let drawingT = 0;

// RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// START EVENT
document.getElementById('start-screen').addEventListener('click', () => {
    if (currentPhase >= 0) return;
    initAudio();
    gsap.to('#start-screen', {
        opacity: 0, duration: 1, onComplete: () => {
            document.getElementById('start-screen').style.display = 'none';
            startScene1();
        }
    });
});

// SEQUENCES
function startScene1() {
    currentPhase = 1;
    // Show sphere
    gsap.to(sphereMat, { opacity: 1, duration: 2 });
    gsap.to(glowMat, { opacity: 0.6, duration: 2 });
    isPulsePhase = true;

    // Terminal Text
    const tl = gsap.timeline();
    document.getElementById('scene1-text').classList.remove('hidden');
    tl.to('.t-line1', { opacity: 1, duration: 1, onStart: playSubtlePulse })
        .to('.t-line2', { opacity: 1, duration: 1, delay: 1.5, onStart: playSubtlePulse })
        .to('.t-line3', { opacity: 1, duration: 1, delay: 1.5, onStart: playSubtlePulse })
        .to('.t-line4', { opacity: 1, duration: 1, delay: 1.5, onStart: playSubtlePulse })
        .to('#scene1-text', { opacity: 0, duration: 1.5, delay: 2.5, onComplete: startScene2 });
}

function startScene2() {
    currentPhase = 2;
    isPulsePhase = false;
    isDrawingPhase = true;

    // Slow camera rotation
    gsap.to(scene.rotation, { y: Math.PI * 2, duration: 25, ease: "none", repeat: -1 });
}

function triggerPulseAndExplosion() {
    currentPhase = 3;
    isDrawingPhase = false;

    // Pause 1 sec
    setTimeout(() => {
        playHeartbeatRush();
        document.body.classList.add('heartbeat-pulse');

        setTimeout(() => {
            document.body.classList.remove('heartbeat-pulse');
            explodeRose();
        }, 500);
    }, 1000);
}

function explodeRose() {
    // Hide Core Sphere
    gsap.to(sphereMat, { opacity: 0, duration: 0.5 });
    gsap.to(glowMat, { opacity: 0, duration: 0.5 });

    // Soft Particle Explosion
    const positions = trailGeo.attributes.position.array;
    for (let i = 0; i < trailIndex; i++) {
        // Expand outwards organically
        const destX = (Math.random() - 0.5) * 60;
        const destY = (Math.random() - 0.5) * 60;
        const destZ = (Math.random() - 0.5) * 60;

        let pt = { x: positions[i * 3], y: positions[i * 3 + 1], z: positions[i * 3 + 2] };
        gsap.to(pt, {
            x: destX, y: destY, z: destZ,
            duration: 2 + Math.random() * 2,
            ease: "power2.out",
            onUpdate: function () {
                positions[i * 3] = this.targets()[0].x;
                positions[i * 3 + 1] = this.targets()[0].y;
                positions[i * 3 + 2] = this.targets()[0].z;
                trailGeo.attributes.position.needsUpdate = true;
            }
        });
    }

    setTimeout(startScene3, 1000);
}

function startScene3() {
    document.getElementById('scene3-text').classList.remove('hidden');
    const tl = gsap.timeline();
    tl.to('.elegant-title', { opacity: 1, duration: 2.5, y: -20 })
        .to('.elegant-subtitle', { opacity: 1, duration: 2.5, y: -10 }, "-=1")
        .to('#scene3-text', { opacity: 0, duration: 2, delay: 4.5, onComplete: startScene4 });
}

function startScene4() {
    const questionContainer = document.getElementById('scene4-question');
    questionContainer.classList.remove('hidden');
    gsap.to(questionContainer, { opacity: 1, duration: 2 });

    const noBtn = document.getElementById('btn-no');
    const yesBtn = document.getElementById('btn-yes');
    let noBtnScale = 1;

    const playfulTexts = ["Are you sure? 🥺", "Try again! 🙈", "Nope! 🏃‍♀️", "Catch me! 🦋", "Wrong answer 😜", "Still No? 😢", "I'm unstoppable!"];
    let textIndex = 0;

    // NO button running away logic
    noBtn.addEventListener('mouseenter', escapeNoBtn);
    noBtn.addEventListener('touchstart', escapeNoBtn);

    function escapeNoBtn() {
        if (noBtn.style.position !== 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = 'fixed';
            noBtn.style.left = rect.left + 'px';
            noBtn.style.top = rect.top + 'px';
        }

        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 80;

        const randomX = Math.max(20, Math.random() * maxX);
        const randomY = Math.max(20, Math.random() * maxY);

        noBtnScale = Math.max(0.5, noBtnScale - 0.05);

        noBtn.innerText = playfulTexts[textIndex % playfulTexts.length];
        textIndex++;

        gsap.to(noBtn, { left: randomX, top: randomY, scale: noBtnScale, duration: 0.3, ease: "back.out(1.5)" });

        // YES Button glows brighter
        gsap.to(yesBtn, { scale: '+=0.03', boxShadow: '0 0 35px rgba(255, 105, 180, 0.9)', duration: 0.3 });
    }

    yesBtn.addEventListener('click', () => {
        playMagicalChime();
        gsap.to(questionContainer, {
            opacity: 0, duration: 1, onComplete: () => {
                questionContainer.style.display = 'none';
                startFinalScene();
            }
        });
    });
}

function startFinalScene() {
    currentPhase = 5;

    // Background to Heart Galaxy
    gsap.to(starsMat, { opacity: 0.6, duration: 3 });
    gsap.to(scene.rotation, { y: "+=1.5", duration: 15, ease: "power1.inOut" });

    // Romantic Confetti
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#ffb6c1', '#ff69b4', '#ffe4e1', '#ffffff']
    });

    // Final Texts
    document.getElementById('scene5-text').classList.remove('hidden');
    const tl = gsap.timeline();

    tl.to('.good-choice', { opacity: 1, y: -20, duration: 2.5 })
        .to('.good-choice', { opacity: 0, y: -40, duration: 2, delay: 2.5 })
        .to('#final-universe-text', {
            opacity: 1, y: -20, duration: 3, onStart: () => {
                document.getElementById('final-universe-text').classList.remove('hidden');
            }
        })
        .to('#final-universe-text', {
            opacity: 0, duration: 3, delay: 5.5, onComplete: () => {
                // Soft fade
                gsap.to('#canvas-container', { filter: 'brightness(0)', duration: 4 });
            }
        });

    // Reorganize hearts to spell HER_NAME
    formNameInStars(HER_NAME);
}

function formNameInStars(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.font = 'bold 110px "Dancing Script", cursive'; // Use the prettier font for stars
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 512, 128);

    const imgData = ctx.getImageData(0, 0, 1024, 256).data;
    const targetPoints = [];

    for (let y = 0; y < 256; y += 4) {
        for (let x = 0; x < 1024; x += 4) {
            const i = (y * 1024 + x) * 4;
            if (imgData[i + 3] > 128) {
                targetPoints.push({
                    x: (x - 512) * 0.03,
                    y: -(y - 128) * 0.03,
                    z: (Math.random() - 0.5) * 2 - 5
                });
            }
        }
    }

    const positions = trailGeo.attributes.position.array;
    for (let i = 0; i < trailIndex; i++) {
        const target = targetPoints[i % targetPoints.length];
        let pt = { x: positions[i * 3], y: positions[i * 3 + 1], z: positions[i * 3 + 2] };
        gsap.to(pt, {
            x: target.x, y: target.y, z: target.z,
            duration: 3.5 + Math.random() * 2.5, // Even gentler reorganization
            ease: "power2.inOut",
            onUpdate: function () {
                positions[i * 3] = this.targets()[0].x;
                positions[i * 3 + 1] = this.targets()[0].y;
                positions[i * 3 + 2] = this.targets()[0].z;
                trailGeo.attributes.position.needsUpdate = true;
            }
        });
    }
}

// RENDER LOOP
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    time += delta;

    if (isPulsePhase) {
        // Softer heartbeat visual pulse
        const scale = 1 + Math.sin(time * 4) * 0.05;
        coreSphere.scale.set(scale, scale, scale);
    }

    if (isDrawingPhase) {
        // Intricate 3D Blooming Lotus/Peony style
        // 7 Petals overlapping with ruffled edges
        const k = 7 / 2;
        const scaleDecay = 1 - (drawingT / 1000) * 0.15;
        const R = 7 * scaleDecay;

        drawingT += delta * 80;
        const t = drawingT * 0.1;

        // Base rose curve + ruffled edge modulation
        const baseR = R * Math.cos(k * t);
        const r = baseR * (1.0 + 0.2 * Math.sin(14 * t));

        const x = r * Math.cos(t);
        const y = r * Math.sin(t);

        // Volume: Z curls forward into a delicate 3D layered bowl
        const z = -2 + Math.abs(r) * 0.5 + Math.sin(t * k * 2) * 1.2;

        coreSphere.position.set(x, y, z);
        coreSphere.rotation.x = time;
        coreSphere.rotation.y = time * 2; // Spin the core subtly

        // To make the drawing speed match the new complex shape
        if (trailIndex < maxTrailParticles && drawingT % 1 < 0.6) {
            const posAttr = trailGeo.attributes.position;
            const sizeAttr = trailGeo.attributes.size;
            posAttr.array[trailIndex * 3] = x;
            posAttr.array[trailIndex * 3 + 1] = y;
            posAttr.array[trailIndex * 3 + 2] = z;
            sizeAttr.array[trailIndex] = 2.5;

            posAttr.needsUpdate = true;
            sizeAttr.needsUpdate = true;
            trailIndex++;
        }

        if (drawingT > 1000) {
            triggerPulseAndExplosion();
        }
    }

    // Slow magical drift for stars
    if (currentPhase >= 5) {
        starsMesh.rotation.y += 0.0003;
        starsMesh.rotation.x += 0.0001;
    }

    particleMaterial.uniforms.time.value = time;
    renderer.render(scene, camera);
}

animate();
