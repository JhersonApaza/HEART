// Variables globales
let scene, camera, renderer, heartParticles;
let animationPhase = 0;
let formationProgress = 0;
let progressBar = document.getElementById('progressBar');
let loveMeteorElements = [];
let impactEffects = [];
let lastMeteorTime = 0;
let meteorInterval = 300;
let completionMessage = document.getElementById('completionMessage');
let instructions = document.querySelector('.instructions');
let floatingHearts = document.getElementById('floatingHearts');

// Variables para control de mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
let mouseRotation = { x: 0, y: 0 };
let autoRotationEnabled = false;
let isReturningToOrigin = false;
let returnSpeed = 0.02;

// Variables para confeti
let confettiParticles = [];

// Variables para música
let audio = document.getElementById('backgroundMusic');
let playButton = document.getElementById('playButton');
let isPlaying = false;

// Array con los nombres de tus imágenes (modifica estos nombres según tus archivos)
const imageNames = [
    '1.jpg',
    '2.jpg', 
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg'
    // Agrega más nombres de imágenes según tengas
];

// Función para controlar la música
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playButton.classList.remove('playing');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playButton.classList.add('playing');
            isPlaying = true;
        }).catch((error) => {
            console.log('Error al reproducir:', error);
            alert('No se pudo reproducir la música. Asegúrate de que el archivo music.mp3 esté en la carpeta del proyecto.');
        });
    }
}

// Event listener para el botón de música
playButton.addEventListener('click', toggleMusic);

// Crear estrellas de fondo
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 800;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);
        starsContainer.appendChild(star);
    }
}

// Crear corazones flotantes
function createFloatingHearts() {
    const heartCount = 30;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.bottom = '-50px';
        const hue = 330 + Math.random() * 20;
        heart.style.color = `hsl(${hue}, 100%, 70%)`;
        const size = 0.8 + Math.random() * 1.5;
        heart.style.fontSize = `${size}rem`;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 15;
        heart.style.animation = `floatHeart ${duration}s linear infinite`;
        heart.style.animationDelay = `${delay}s`;
        floatingHearts.appendChild(heart);
    }
}

// Array con frases cariñosas (agrega esto después del array de imageNames)
const loveMessages = [
    "I LOVE YOU",
    "YOU'RE AMAZING",
    "MY HEART",
    "FOREVER YOURS",
    "BEAUTIFUL SOUL",
    "MY SUNSHINE",
    "SWEET DREAMS",
    "TOGETHER ALWAYS",
    "MY EVERYTHING",
    "PRECIOUS LOVE",
    "ANGEL EYES"
];

// Función modificada para crear meteorito con frases aleatorias
function createLoveMeteor() {
    const loveMeteor = document.createElement('div');
    loveMeteor.classList.add('i-love-you-meteor');
    
    // Seleccionar una frase aleatoria del array
    const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    loveMeteor.textContent = randomMessage;
    
    const startX = Math.random() * window.innerWidth;
    loveMeteor.style.left = `${startX}px`;
    loveMeteor.style.top = '-50px';
    const size = 1 + Math.random() * 0.5;
    loveMeteor.style.fontSize = `${size}rem`;
    const hue = 330 + Math.random() * 20;
    loveMeteor.style.color = `hsl(${hue}, 100%, 70%)`;
    const duration = 1 + Math.random() * 2;
    loveMeteor.style.animation = `meteorFall ${duration}s linear forwards`;
    document.body.appendChild(loveMeteor);
    loveMeteorElements.push(loveMeteor);

    setTimeout(() => {
        createImpactEffect(startX);
    }, duration * 800);

    setTimeout(() => {
        loveMeteor.remove();
        loveMeteorElements = loveMeteorElements.filter(el => el !== loveMeteor);
    }, duration * 1000);
}

// Crear efecto de impacto
function createImpactEffect(x) {
    const impact = document.createElement('div');
    impact.classList.add('impact-effect');
    impact.style.left = `${x}px`;
    impact.style.bottom = '20px';
    const size = 50 + Math.random() * 50;
    impact.style.width = `${size}px`;
    impact.style.height = `${size}px`;
    const duration = 0.8 + Math.random() * 0.5;
    impact.style.animation = `impact ${duration}s ease-out forwards`;
    document.body.appendChild(impact);
    impactEffects.push(impact);

    setTimeout(() => {
        impact.remove();
        impactEffects = impactEffects.filter(el => el !== impact);
    }, duration * 1000);
}

// Crear explosión de confeti con imágenes
function createConfettiExplosion(x, y) {
    const particleCount = 30;
    const imageCount = 8; // Número de imágenes que aparecerán
    
    // Crear partículas normales (corazones, estrellas, círculos)
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        const particleType = Math.random();
        
        if (particleType < 0.4) {
            particle.classList.add('heart-confetti');
            particle.innerHTML = '❤';
        } else if (particleType < 0.7) {
            particle.classList.add('star-confetti');
        } else {
            particle.classList.add('circle-confetti');
        }
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const distance = 100 + Math.random() * 150;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        
        const duration = 0.8 + Math.random() * 0.7;
        particle.style.animation = `confettiExplode ${duration}s ease-out forwards`;
        
        if (particleType >= 0.4) {
            const hue = 300 + Math.random() * 60;
            particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
        }
        
        document.body.appendChild(particle);
        confettiParticles.push(particle);

        setTimeout(() => {
            particle.remove();
            confettiParticles = confettiParticles.filter(p => p !== particle);
        }, duration * 1000);
    }
    
    // Crear partículas de imágenes
    for (let i = 0; i < imageCount; i++) {
        const imageParticle = document.createElement('div');
        imageParticle.classList.add('confetti-particle', 'image-confetti');
        
        // Seleccionar una imagen aleatoria
        const randomImage = imageNames[Math.floor(Math.random() * imageNames.length)];
        
        // Crear elemento img
        const img = document.createElement('img');
        img.src = randomImage; // Asume que las imágenes están en la carpeta raíz
        img.alt = 'confetti';
        
        imageParticle.appendChild(img);
        imageParticle.style.left = `${x}px`;
        imageParticle.style.top = `${y}px`;
        
        const angle = (Math.PI * 2 * i) / imageCount + Math.random() * 0.5;
        const distance = 80 + Math.random() * 120;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        imageParticle.style.setProperty('--dx', `${dx}px`);
        imageParticle.style.setProperty('--dy', `${dy}px`);
        
        const duration = 1 + Math.random() * 0.8;
        imageParticle.style.animation = `confettiExplode ${duration}s ease-out forwards`;
        
        document.body.appendChild(imageParticle);
        confettiParticles.push(imageParticle);

        setTimeout(() => {
            imageParticle.remove();
            confettiParticles = confettiParticles.filter(p => p !== imageParticle);
        }, duration * 1000);
    }
}

// Configurar eventos del mouse
function setupMouseControls() {
    const container = document.getElementById('container');

    container.addEventListener('mousedown', (event) => {
        isDragging = true;
        autoRotationEnabled = false;
        previousMousePosition = { x: event.clientX, y: event.clientY };
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };
            rotationVelocity.x = deltaMove.y * 0.01;
            rotationVelocity.y = deltaMove.x * 0.01;
            mouseRotation.x += rotationVelocity.x;
            mouseRotation.y += rotationVelocity.y;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    const handleMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            isReturningToOrigin = true;
        }
    };

    container.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('click', (event) => {
        if (!isDragging) {
            createConfettiExplosion(event.clientX, event.clientY);
        }
    });

    container.addEventListener('selectstart', (e) => e.preventDefault());
}

// Inicializar Three.js
function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = null;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    createHeartParticles();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff2a6d, 1.8, 100);
    pointLight.position.set(15, 15, 15);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xffb6c1, 1.2, 100);
    pointLight2.position.set(-15, -15, 15);
    scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(0xd40078, 1.0, 100);
    pointLight3.position.set(0, 0, 20);
    scene.add(pointLight3);

    window.addEventListener('resize', onWindowResize);
    setupMouseControls();
    animate();
}

function heartPosition(t, scale) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.random() - 0.5) * 4;
    return new THREE.Vector3(x * scale, y * scale, z * scale);
}

function createHeartParticles() {
    const particleCount = 6000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const scale = 0.9 + Math.random() * 0.5;
        const heartPos = heartPosition(i / particleCount, scale);
        targetPositions[i3] = heartPos.x;
        targetPositions[i3 + 1] = heartPos.y;
        targetPositions[i3 + 2] = heartPos.z;

        const spread = 140;
        startPositions[i3] = (Math.random() - 0.5) * spread;
        startPositions[i3 + 1] = (Math.random() - 0.5) * spread;
        startPositions[i3 + 2] = (Math.random() - 0.5) * spread;

        positions[i3] = startPositions[i3];
        positions[i3 + 1] = startPositions[i3 + 1];
        positions[i3 + 2] = startPositions[i3 + 2];

        colors[i3] = 0.95 + Math.random() * 0.05;
        colors[i3 + 1] = 0.2 + Math.random() * 0.2;
        colors[i3 + 2] = 0.4 + Math.random() * 0.2;

        sizes[i] = Math.random() * 0.4 + 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.startPositions = startPositions;
    geometry.targetPositions = targetPositions;

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    heartParticles = new THREE.Points(geometry, material);
    scene.add(heartParticles);
    heartParticles.position.y = 0;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if(window.innerWidth < 768) {
        camera.position.z = 50; // más alejado para que se vea todo el corazón
    } else {
        camera.position.z = 40; // valor por defecto
    }
}

function animate() {
    requestAnimationFrame(animate);

    const now = Date.now();
    if (now - lastMeteorTime > meteorInterval) {
        createLoveMeteor();
        lastMeteorTime = now;
        meteorInterval = 150 + Math.random() * 250;
    }

    if (animationPhase === 0) {
        formationProgress = Math.min(1, formationProgress + 0.003);
        progressBar.style.width = `${formationProgress * 100}%`;
        const positions = heartParticles.geometry.attributes.position.array;
        const startPositions = heartParticles.geometry.startPositions;
        const targetPositions = heartParticles.geometry.targetPositions;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = startPositions[i] + (targetPositions[i] - startPositions[i]) * formationProgress;
            positions[i+1] = startPositions[i+1] + (targetPositions[i+1] - startPositions[i+1]) * formationProgress;
            positions[i+2] = startPositions[i+2] + (targetPositions[i+2] - startPositions[i+2]) * formationProgress;
        }
        heartParticles.geometry.attributes.position.needsUpdate = true;

        if (formationProgress >= 1) {
            animationPhase = 1;
            completionMessage.style.opacity = "1";
            completionMessage.style.transform = "translateY(0)";
            completionMessage.textContent = "";
            instructions.textContent = "Drag to rotate the heart • Click anywhere to create confetti explosions";
            setTimeout(() => {
                document.querySelector('.progress-container').style.opacity = "0";
            }, 1500);
        }
    }
    else if (animationPhase === 1) {
        const time = Date.now() * 0.001;
        const positions = heartParticles.geometry.attributes.position.array;
        const targetPositions = heartParticles.geometry.targetPositions;
        for (let i = 0; i < positions.length; i += 3) {
            const originalX = targetPositions[i];
            const originalY = targetPositions[i+1];
            const originalZ = targetPositions[i+2];
            const distance = Math.sqrt(originalX * originalX + originalY * originalY + originalZ * originalZ);
            const pulse = Math.sin(time * 0.5 + distance * 0.1) * 0.18 + 1;
            positions[i] = originalX * pulse;
            positions[i+1] = originalY * pulse;
            positions[i+2] = originalZ * pulse;
        }
        heartParticles.geometry.attributes.position.needsUpdate = true;

        heartParticles.rotation.x = mouseRotation.x;
        heartParticles.rotation.y = mouseRotation.y;

        if (!isDragging) {
            if (isReturningToOrigin) {
                mouseRotation.x += (0 - mouseRotation.x) * returnSpeed;
                mouseRotation.y += (0 - mouseRotation.y) * returnSpeed;
                
                if (Math.abs(mouseRotation.x) < 0.01 && Math.abs(mouseRotation.y) < 0.01) {
                    mouseRotation.x = 0;
                    mouseRotation.y = 0;
                    isReturningToOrigin = false;
                }
            } else {
                rotationVelocity.x *= 0.95;
                rotationVelocity.y *= 0.95;
                mouseRotation.x += rotationVelocity.x;
                mouseRotation.y += rotationVelocity.y;
            }
        }

        if (parseFloat(completionMessage.style.opacity) > 0) {
            completionMessage.style.opacity = parseFloat(completionMessage.style.opacity) - 0.005;
        }
    }

    renderer.render(scene, camera);
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createFloatingHearts();
    initThreeJS();
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createLoveMeteor(), i * 300);
    }
});

