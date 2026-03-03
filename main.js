const HER_NAME = "Tunaruz";
document.querySelectorAll('.her-name').forEach(el => el.innerText = HER_NAME);

// Audio Synthesis
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
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 1.2);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 1.2);
    });
}

// 🌸 Procedural Petal & Flower Generator (No External Images) 🌸
function createFlowerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.translate(128, 128);

    // Draw 5 petals
    for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-40, -20, -50, -80, 0, -100);
        ctx.bezierCurveTo(50, -80, 40, -20, 0, 0);

        const grad = ctx.createRadialGradient(0, -50, 0, 0, -50, 100);
        grad.addColorStop(0, '#fff0f5');
        grad.addColorStop(0.5, '#ffb7c5');
        grad.addColorStop(1, '#ff69b4');

        ctx.fillStyle = grad;
        ctx.fill();

        // Petal notch
        ctx.beginPath();
        ctx.moveTo(-5, -95);
        ctx.lineTo(0, -85);
        ctx.lineTo(5, -95);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        ctx.restore();
    }

    // Flower center
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdf00';
    ctx.fill();

    // Stamen lines
    for (let i = 0; i < 15; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 15);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -30);
        ctx.strokeStyle = '#fffacd';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -30, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffdf00';
        ctx.fill();
        ctx.restore();
    }

    return new THREE.CanvasTexture(canvas);
}

function createSinglePetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.translate(32, 120);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-25, -20, -30, -80, 0, -110);
    ctx.bezierCurveTo(30, -80, 25, -20, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, 0, -110);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.5, '#ffb7c5');
    grad.addColorStop(1, '#ff69b4');

    ctx.fillStyle = grad;
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

const flowerTex = createFlowerTexture();
const petalTex = createSinglePetalTexture();

// THREE.JS SETUP
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// BRANCH SYSTEM
function createOrganicBranch() {
    const group = new THREE.Group();
    const points = [];
    for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector3(
            i * 2 - 10,
            Math.sin(i * 0.8) * 2 - 2,
            Math.cos(i * 0.5) * 1
        ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 64, 0.25, 8, false);
    const mat = new THREE.MeshBasicMaterial({ color: 0x3d2b1f, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return { group, mat };
}
const branch = createOrganicBranch();
scene.add(branch.group);

// BLOSSOM DRAWING SYSTEM
const flowers = [];
for (let i = 0; i < 12; i++) {
    const geo = new THREE.PlaneGeometry(3, 3);
    const mat = new THREE.MeshBasicMaterial({
        map: flowerTex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const f = new THREE.Mesh(geo, mat);
    f.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5
    );
    f.rotation.z = Math.random() * Math.PI * 2;
    f.scale.set(0, 0, 0);
    scene.add(f);
    flowers.push(f);
}

// FALLING PETALS
const petalParticlesGeo = new THREE.BufferGeometry();
const pCount = 150;
const pPos = new Float32Array(pCount * 3);
const pRot = new Float32Array(pCount * 3);
const pSpeeds = new Float32Array(pCount);

for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 60;
    pPos[i * 3 + 1] = Math.random() * 40 - 20;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    pSpeeds[i] = 0.05 + Math.random() * 0.1;
}
petalParticlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

const particleMat = new THREE.PointsMaterial({
    map: petalTex,
    size: 0.8,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.NormalBlending
});
const fallingPetals = new THREE.Points(petalParticlesGeo, particleMat);
scene.add(fallingPetals);

const starsGeo = new THREE.BufferGeometry();
const sPos = new Float32Array(2000 * 3);
for (let i = 0; i < 6000; i++) sPos[i] = (Math.random() - 0.5) * 200;
starsGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xffe4e1, size: 0.1, transparent: true, opacity: 0 });
const starsMesh = new THREE.Points(starsGeo, starsMat);
scene.add(starsMesh);

let currentPhase = -1;
let time = 0;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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

function startScene1() {
    currentPhase = 1;
    document.getElementById('scene1-text').classList.remove('hidden');
    gsap.timeline()
        .to('.t-line1', { opacity: 1, duration: 1, onStart: playSubtlePulse })
        .to('.t-line2', { opacity: 1, duration: 1, delay: 1, onStart: playSubtlePulse })
        .to('.t-line3', { opacity: 1, duration: 1, delay: 1, onStart: playSubtlePulse })
        .to('.t-line4', { opacity: 1, duration: 1, delay: 1, onStart: playSubtlePulse })
        .to('#scene1-text', { opacity: 0, duration: 1.5, delay: 2.5, onComplete: startScene2 });
}

function startScene2() {
    currentPhase = 2;
    gsap.to(branch.mat, { opacity: 0.6, duration: 4 });
    gsap.to(particleMat, { opacity: 0.8, duration: 3 });

    flowers.forEach((f, i) => {
        gsap.to(f.scale, { x: 1, y: 1, z: 1, duration: 3, delay: i * 0.3, ease: "back.out(1.5)" });
        gsap.to(f.material, { opacity: 1, duration: 2, delay: i * 0.3 });
        gsap.to(f.rotation, { z: "+=1", duration: 10 + Math.random() * 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });

    gsap.to(camera.position, { z: 20, duration: 10, ease: "power2.inOut" });
    setTimeout(triggerReveal, 8000);
}

function triggerReveal() {
    currentPhase = 3;
    playHeartbeatRush();
    document.body.classList.add('heartbeat-pulse');
    setTimeout(() => {
        document.body.classList.remove('heartbeat-pulse');
        flowers.forEach(f => gsap.to(f.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.in" }));
        gsap.to(branch.mat, { opacity: 0, duration: 1.5 });
        startScene3();
    }, 500);
}

function startScene3() {
    document.getElementById('scene3-text').classList.remove('hidden');
    gsap.timeline()
        .to('.elegant-title', { opacity: 1, duration: 2.5, y: -20 })
        .to('.elegant-subtitle', { opacity: 1, duration: 2.5, y: -10 }, "-=1")
        .to('#scene3-text', { opacity: 0, duration: 2, delay: 4.5, onComplete: startScene4 });
}

function startScene4() {
    const q = document.getElementById('scene4-question');
    q.classList.remove('hidden');
    gsap.to(q, { opacity: 1, duration: 2 });

    document.getElementById('btn-no').addEventListener('mouseenter', function () {
        const x = Math.random() * (window.innerWidth - 150);
        const y = Math.random() * (window.innerHeight - 80);
        this.style.position = 'fixed';
        gsap.to(this, { left: x, top: y, duration: 0.3 });
    });

    document.getElementById('btn-yes').addEventListener('click', () => {
        playMagicalChime();
        gsap.to(q, { opacity: 0, duration: 0.8, onComplete: startFinal });
    });
}

function startFinal() {
    currentPhase = 5;
    gsap.to(starsMat, { opacity: 0.8, duration: 3 });
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    document.getElementById('scene5-text').classList.remove('hidden');
    gsap.timeline()
        .to('.good-choice', { opacity: 1, duration: 2.5 })
        .to('.good-choice', { opacity: 0, duration: 1.5, delay: 2.5 })
        .to('#final-universe-text', { opacity: 1, duration: 3, onStart: () => document.getElementById('final-universe-text').classList.remove('hidden') });
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    if (currentPhase >= 2) {
        const pos = fallingPetals.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
            pos[i + 1] -= 0.08;
            pos[i] += Math.sin(time + i) * 0.03;
            if (pos[i + 1] < -25) {
                pos[i + 1] = 25;
                pos[i] = (Math.random() - 0.5) * 50;
            }
        }
        fallingPetals.geometry.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
}
animate();
