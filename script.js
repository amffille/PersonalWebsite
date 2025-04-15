 // --- One-time Refresh Logic ---
        // Use sessionStorage to ensure this runs only once per session visit
        (function() {
            if ( sessionStorage.getItem('refreshed_once') !== 'true' ) {
                console.log('Performing one-time refresh to potentially fix load issues...');
                sessionStorage.setItem('refreshed_once', 'true');
                window.location.reload();
            } else {
                console.log('Already refreshed this session.');
                sessionStorage.removeItem('refreshed_once');
            }
        })();



// --- Basic Setup --- //
const canvas = document.getElementById('c');
const sceneContainerElement = document.getElementById('scene-container');
const mainContainer = document.getElementById('main-container');
const finalMessageDiv = document.getElementById('final-message'); // Get final message div
const finalMessageText = document.getElementById('final-message-text'); // Get span for text
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();

// --- Camera --- //
const initialAspect = sceneContainerElement.clientWidth / sceneContainerElement.clientHeight || 1;
const frustumSize = 35;
const camera = new THREE.OrthographicCamera( frustumSize * initialAspect / -2, frustumSize * initialAspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000 );
camera.position.set(0, 20, 0); camera.lookAt(scene.position); camera.zoom = 1; camera.updateProjectionMatrix();

// --- Lighting --- //
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); directionalLight.position.set(5, 10, 7.5); scene.add(directionalLight);

// --- Plane Model --- //
const planeGroup = new THREE.Group();
const mainMaterial = new THREE.MeshLambertMaterial({ color: 0x737099 });
const accentMaterial = new THREE.MeshLambertMaterial({ color: 0xB6FF00 });
const fuselageGeometry=new THREE.BoxGeometry(3,.4,.8);const fuselageMesh=new THREE.Mesh(fuselageGeometry,mainMaterial);planeGroup.add(fuselageMesh);const wingGeometry=new THREE.BoxGeometry(1.5,.2,2.5);const leftWingMesh=new THREE.Mesh(wingGeometry,mainMaterial);leftWingMesh.position.set(0,0,1.5);leftWingMesh.rotation.x=Math.PI/16;leftWingMesh.rotation.y=-Math.PI/6;planeGroup.add(leftWingMesh);const rightWingMesh=new THREE.Mesh(wingGeometry,mainMaterial);rightWingMesh.position.set(0,0,-1.5);rightWingMesh.rotation.x=Math.PI/16;rightWingMesh.rotation.y=Math.PI/6;planeGroup.add(rightWingMesh);const tailFinGeometry=new THREE.BoxGeometry(.8,1,.2);const tailFinMesh=new THREE.Mesh(tailFinGeometry,accentMaterial);tailFinMesh.position.set(-1.3,.6,0);planeGroup.add(tailFinMesh);const cockpitGeometry=new THREE.BoxGeometry(.7,.3,.5);const cockpitMesh=new THREE.Mesh(cockpitGeometry,accentMaterial);cockpitMesh.position.set(.8,.3,0);planeGroup.add(cockpitMesh);
planeGroup.position.y = 0.5; planeGroup.rotation.y = Math.PI / 2; scene.add(planeGroup);

// --- Sound Effects Setup --- //
let audioStarted = false; const sounds = {};
function setupSounds() { if (typeof Tone === 'undefined') { console.error("Tone.js not loaded!"); return; } const masterVol = new Tone.Volume(-12).toDestination(); sounds.shoot = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 }, volume: -6 }).connect(masterVol); sounds.hit = new Tone.MembraneSynth({ pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }, volume: -3 }).connect(masterVol); sounds.break = new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }, volume: -8 }).connect(masterVol); sounds.breakThud = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 }, volume: -5 }).connect(masterVol); sounds.cardOpen = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }, volume: -10 }).connect(masterVol); sounds.cardOpen.frequency.rampTo("C5", 0.1); sounds.cardClose = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }, volume: -10 }).connect(masterVol); sounds.cardClose.frequency.rampTo("C3", 0.1); sounds.gameEnd = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.5 }, volume: -6 }).connect(masterVol); console.log("Sounds setup complete."); }
setupSounds();
function playSound(soundName, note = "C4", duration = "8n", time = "+0") { if (!audioStarted || !sounds[soundName]) return; try { if (sounds[soundName] instanceof Tone.Synth || sounds[soundName] instanceof Tone.MembraneSynth || sounds[soundName] instanceof Tone.NoiseSynth) { sounds[soundName].triggerAttackRelease(note, duration, time); } } catch (e) { console.error(`Error playing sound ${soundName}:`, e); } }
function playBreakSound() { if (!audioStarted || !sounds.break || !sounds.breakThud) return; try { sounds.break.triggerAttackRelease("0.2"); sounds.breakThud.triggerAttackRelease("C2", "0.3", "+0.01"); } catch (e) { console.error(`Error playing break sound:`, e); } }

// --- Function to create text labels --- //
function createLabelSprite(text, fontSize = 20, fontFace = "'Press Start 2P', cursive", textColor = 'rgba(0, 0, 0, 1.0)') { const canvas = document.createElement('canvas'); const context = canvas.getContext('2d'); const font = `${fontSize}px ${fontFace}`; context.font = font; const metrics = context.measureText(text); const textWidth = metrics.width; canvas.width = textWidth + fontSize * 0.4; canvas.height = fontSize + fontSize * 0.4; context.font = font; context.fillStyle = textColor; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(text, canvas.width / 2, canvas.height / 2); const texture = new THREE.CanvasTexture(canvas); texture.needsUpdate = true; const spriteMaterial = new THREE.SpriteMaterial({ map: texture }); const sprite = new THREE.Sprite(spriteMaterial); sprite.scale.set(canvas.width / fontSize * 0.6, canvas.height / fontSize * 0.6, 1.0); return sprite; }

// --- Portfolio Sections --- //
const sections = [
    { id: 'summary', position: new THREE.Vector3(0, 0, -12), color: 0xB6FF00, title: "Summary" },    // Green Accent
    { id: 'skills', position: new THREE.Vector3(15, 0, 0), color: 0x737099, title: "Skills" },       // Dark Purple (Body BG)
    { id: 'projects', position: new THREE.Vector3(0, 0, 12), color: 0x9370DB, title: "Projects" },   // Medium Purple
    { id: 'experience', position: new THREE.Vector3(-15, 0, 0), color: 0xF5F5F5, title: "Experience" } // White
];
let sectionMeshes = []; const sectionRadius = 2; const sectionGeometry = new THREE.CylinderGeometry(sectionRadius, sectionRadius, 0.2, 32); const labelYOffset = 1.5; let sectionLabels = {}; const HITS_TO_BREAK = 5; const CRACK_CANVAS_SIZE = 128;

function createSections() {
    
    sectionMeshes.forEach(mesh => {
        scene.remove(mesh);
        if (mesh.userData.labelSprite) scene.remove(mesh.userData.labelSprite);
    });
    sectionMeshes = [];
    sectionLabels = {}; 
    // Recreate sections
    sections.forEach(section => {
        const canvas = document.createElement('canvas'); canvas.width = CRACK_CANVAS_SIZE; canvas.height = CRACK_CANVAS_SIZE / 2; const context = canvas.getContext('2d');
        context.fillStyle = "#" + section.color.toString(16).padStart(6, '0'); context.fillRect(0, 0, canvas.width, canvas.height);
        const texture = new THREE.CanvasTexture(canvas); texture.needsUpdate = true; const material = new THREE.MeshLambertMaterial({ map: texture });
        const mesh = new THREE.Mesh(sectionGeometry, material); mesh.position.copy(section.position); mesh.userData = { id: section.id, title: section.title, isBroken: false, hitCount: 0, crackCanvasContext: context, crackTexture: texture, baseColor: "#" + section.color.toString(16).padStart(6, '0') };
        scene.add(mesh); sectionMeshes.push(mesh); const labelSprite = createLabelSprite(section.title); labelSprite.position.set(section.position.x, section.position.y + labelYOffset, section.position.z);
        mesh.userData.labelSprite = labelSprite; sectionLabels[mesh.uuid] = labelSprite; scene.add(labelSprite);
    });
    console.log("Sections recreated. Count:", sectionMeshes.length); // Debug log
}

// --- Shooting Mechanics --- //
const bullets = []; const bulletGeometry = new THREE.SphereGeometry(0.15, 8, 8); const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); const bulletSpeed = 0.3; let isShooting = false; let lastShotTime = 0; const shootCooldown = 150;

// --- Plane Controls & Shooting --- //
const keysPressed = {}; const planeSpeed = 0.15; const rotationSpeed = 0.05;
async function startAudioContext() { if (typeof Tone === 'undefined' || !Tone.context) { console.error("Tone.js or Tone.context not available yet."); return; } if (!audioStarted && Tone.context.state !== 'running') { console.log("Attempting to start AudioContext..."); try { await Tone.start(); audioStarted = true; console.log("Audio context started successfully!"); } catch (e) { console.error("Error starting AudioContext:", e); } } }
document.body.addEventListener('click', startAudioContext, { once: true }); document.body.addEventListener('keydown', startAudioContext, { once: true });

// --- Reset Game Function --- //
function resetGame() {
    console.log("Resetting game...");
    if (finalMessageDiv) finalMessageDiv.style.display = 'none';
    finalMessageShown = false;
    bullets.forEach(bullet => scene.remove(bullet)); bullets.length = 0;
    createSections(); 
    planeGroup.position.set(0, 0.5, 0); planeGroup.rotation.y = Math.PI / 2;
    if (activeCardElement) activeCardElement.classList.remove('visible');
    activeSectionMesh = null; activeCardElement = null; isShaking = false;
    
    sceneContainerElement.classList.remove('is-moving', 'is-shooting-shadow', 'shake'); 
    for (const key in keysPressed) { keysPressed[key] = false; } isShooting = false;
}

// --- Event Listeners --- //
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
     if (finalMessageShown && key === 'escape') { event.preventDefault(); resetGame(); return; }
    if (!finalMessageShown) { keysPressed[key] = true; if (key === ' ') { isShooting = true; } }
});
document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (!finalMessageShown) { keysPressed[key] = false; if (key === ' ') { isShooting = false; } }
});

// --- Section Interaction State --- //
let activeSectionMesh = null; let activeCardElement = null; let finalMessageShown = false;
let isShaking = false;

// --- Scene & Bullet Bounds (initialized in onWindowResize) --- //
let sceneBounds = null; let bulletBounds = null;

// --- Animation Loop --- //
const clock = new THREE.Clock(); const tempVector = new THREE.Vector3(); const planeRightVector = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate); 

    if (finalMessageShown) { renderer.render(scene, camera); return; } // render if game over

    const delta = clock.getDelta(); const elapsedTime = clock.getElapsedTime();

    // --- Plane Movement --- //
    const currentRotation = planeGroup.rotation.y; let isPlaneMoving = false;
    if (keysPressed['w']||keysPressed['arrowup']) { planeGroup.position.x += Math.cos(currentRotation) * planeSpeed; planeGroup.position.z += -Math.sin(currentRotation) * planeSpeed; isPlaneMoving = true; }
    if (keysPressed['s']||keysPressed['arrowdown']) { planeGroup.position.x += -Math.cos(currentRotation) * planeSpeed; planeGroup.position.z += Math.sin(currentRotation) * planeSpeed; isPlaneMoving = true; }
    if (keysPressed['a']||keysPressed['arrowleft']) { planeGroup.rotation.y += rotationSpeed; isPlaneMoving = true; }
    if (keysPressed['d']||keysPressed['arrowright']) { planeGroup.rotation.y -= rotationSpeed; isPlaneMoving = true; }

    // --- Toggle Animation Classes Based on State --- //
     if (isShooting) {
         sceneContainerElement.classList.add('is-shooting-shadow');
         sceneContainerElement.classList.remove('is-moving'); 
     } else {
         sceneContainerElement.classList.remove('is-shooting-shadow'); 
         if (isPlaneMoving) {
             sceneContainerElement.classList.add('is-moving'); 
         } else {
             sceneContainerElement.classList.remove('is-moving'); 
         }
     }
     if (isShaking) { 
         sceneContainerElement.classList.remove('is-moving');
         sceneContainerElement.classList.remove('is-shooting-shadow');
         sceneContainerElement.classList.add('shake');
     } else {
          sceneContainerElement.classList.remove('shake');

     }


    // --- Boundary Collision ---
    if (sceneBounds) { planeGroup.position.x = Math.max(sceneBounds.xMin, Math.min(sceneBounds.xMax, planeGroup.position.x)); planeGroup.position.z = Math.max(sceneBounds.zMin, Math.min(sceneBounds.zMax, planeGroup.position.z)); }

    // --- Handle Shooting ---
    if (isShooting && elapsedTime * 1000 - lastShotTime > shootCooldown) {
        planeRightVector.set(Math.cos(currentRotation), 0, -Math.sin(currentRotation)).normalize();
        const bulletStartPosition = planeGroup.position.clone(); bulletStartPosition.y -= 0.3;
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial); bullet.position.copy(bulletStartPosition); bullet.userData.velocity = planeRightVector.multiplyScalar(bulletSpeed);
        scene.add(bullet); bullets.push(bullet); lastShotTime = elapsedTime * 1000; playSound('shoot', 'G5', '16n');
        
    }

    // --- Update Bullets --- //
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]; bullet.position.add(bullet.userData.velocity); let hit = false;
        // --- Bullet-Section Collision --- //
        for (let j = sectionMeshes.length - 1; j >= 0; j--) {
            const sectionMesh = sectionMeshes[j]; if (sectionMesh.userData.isBroken) continue;
            const distanceToSection = bullet.position.distanceTo(sectionMesh.position);
            if (distanceToSection < sectionRadius) {
                hit = true; sectionMesh.userData.hitCount++;

                // Shake Effect
                if (!isShaking) {
                     isShaking = true;
                     sceneContainerElement.classList.add('shake');
                     sceneContainerElement.classList.remove('is-moving'); // Pause other anims during shake
                     sceneContainerElement.classList.remove('is-shooting-shadow'); // Pause shooting pulse during shake
                     setTimeout(() => {
                         sceneContainerElement.classList.remove('shake');
                         isShaking = false;
                         if (isShooting) { 
                             sceneContainerElement.classList.add('is-shooting-shadow');
                         } else if (keysPressed['arrowup'] || keysPressed['arrowdown'] || keysPressed['arrowleft'] || keysPressed['arrowright']) {
                             sceneContainerElement.classList.add('is-moving');
                         }
                     }, 350);
                }

                if (sectionMesh.userData.hitCount < HITS_TO_BREAK) {
                    playSound('hit', 'C3', '32n');
                    if (sectionMesh.userData.crackCanvasContext) { const ctx = sectionMesh.userData.crackCanvasContext; const texture = sectionMesh.userData.crackTexture; ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'; ctx.lineWidth = Math.random() * 1 + 1; ctx.beginPath(); ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height); ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height); ctx.stroke(); texture.needsUpdate = true; }
                }
                if (sectionMesh.userData.hitCount >= HITS_TO_BREAK) {
                    playBreakSound(); sectionMesh.userData.isBroken = true; scene.remove(sectionMesh);
                    const label = sectionLabels[sectionMesh.uuid]; if (label) { scene.remove(label); delete sectionLabels[sectionMesh.uuid]; }
                    if (activeSectionMesh === sectionMesh && activeCardElement) { activeCardElement.classList.remove('visible'); activeCardElement = null; activeSectionMesh = null; }
                    sectionMeshes.splice(j, 1);
                }
                break;
            }
        }
        // --- Despawn Bullet ---//
         if (bulletBounds && (hit || bullet.position.x < bulletBounds.xMin || bullet.position.x > bulletBounds.xMax || bullet.position.z < bulletBounds.zMin || bullet.position.z > bulletBounds.zMax)) {
             scene.remove(bullet); bullet.geometry.dispose(); bullets.splice(i, 1);
         } else if (hit) { // Fallback if bounds not ready
             scene.remove(bullet); bullet.geometry.dispose(); bullets.splice(i, 1);
         }
    }

    // --- Section Collision Detection & Card Trigger ---//
    let newlyDetectedSection = null;
    sectionMeshes.forEach(sectionMesh => { if (sectionMesh.userData.isBroken) return; const distance = planeGroup.position.distanceTo(sectionMesh.position); if (distance < sectionRadius) { newlyDetectedSection = sectionMesh; } });

    // --- Handle Card Show/Hide ---   //
    if (newlyDetectedSection && newlyDetectedSection !== activeSectionMesh) {
        if (activeCardElement) { activeCardElement.classList.remove('visible'); playSound('cardClose', 'C3', '8n'); }
        activeSectionMesh = newlyDetectedSection; const cardId = 'card-' + activeSectionMesh.userData.id; activeCardElement = document.getElementById(cardId);
        if (activeCardElement) {
            const screenPosition = getScreenPosition(activeSectionMesh, camera, sceneContainerElement);
            activeCardElement.style.left = `${screenPosition.x}px`; activeCardElement.style.top = `${screenPosition.y}px`;
            const cardContent = activeCardElement.querySelector('.card-content'); if (cardContent) cardContent.scrollTop = 0;
            setTimeout(() => { activeCardElement.classList.add('visible'); playSound('cardOpen', 'C4', '8n'); }, 10);
        }
    } else if (!newlyDetectedSection && activeSectionMesh) {
         if (activeCardElement) { activeCardElement.classList.remove('visible'); playSound('cardClose', 'C3', '8n'); }
         activeSectionMesh = null; activeCardElement = null;
    }

    // --- Check for Game End Condition ---  //
    if (sectionMeshes.length === 0 && !finalMessageShown) {
        if (finalMessageDiv && finalMessageText) {
             finalMessageText.innerHTML = '<span style="color: lightcoral;">Yeah these didnt matter anyway!! AI can do a lot of these things.</span><br><br><br>My actual skill is being resourceful and figuring out problems even if i havent faced it before or a tool i havent used before.🫡';
             finalMessageDiv.style.display = 'block'; // Show the container
        }
        finalMessageShown = true; playSound('gameEnd', 'C5', '4n');
    }

    renderer.render(scene, camera);
}

// --- Helper Function: 3D to 2D ---//
function getScreenPosition(object, camera, container) {
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) { return { x: 0, y: 0 }; }
    tempVector.copy(object.position); tempVector.project(camera);
    const x = (tempVector.x * 0.5 + 0.5) * container.clientWidth; const y = (-tempVector.y * 0.5 + 0.5) * container.clientHeight; return { x, y };
}

//--- Handle Resize --- //
function onWindowResize() {
    const newWidth = sceneContainerElement.clientWidth; const newHeight = sceneContainerElement.clientHeight;
     if (newWidth === 0 || newHeight === 0) return;

     const newAspect = newWidth / newHeight;
    camera.left = frustumSize * newAspect / -2; camera.right = frustumSize * newAspect / 2; camera.top = frustumSize / 2; camera.bottom = frustumSize / -2; camera.updateProjectionMatrix();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(newWidth, newHeight);

    const boundaryPadding = 2.5;
    window.sceneBounds = { xMin: -frustumSize * newAspect / 2 + boundaryPadding, xMax: frustumSize * newAspect / 2 - boundaryPadding, zMin: -frustumSize / 2 + boundaryPadding, zMax: frustumSize / 2 - boundaryPadding };
    window.bulletBounds = { xMin: window.sceneBounds.xMin - 10, xMax: window.sceneBounds.xMax + 10, zMin: window.sceneBounds.zMin - 10, zMax: window.sceneBounds.zMax + 10 };

    if (activeCardElement && activeSectionMesh) { const screenPosition = getScreenPosition(activeSectionMesh, camera, sceneContainerElement); activeCardElement.style.left = `${screenPosition.x}px`; activeCardElement.style.top = `${screenPosition.y}px`; }
}
window.addEventListener('resize', onWindowResize);

// --- Start --- //
window.onload = function() {
     document.fonts.load('1em "Press Start 2P"') 
         .then(() => {
             console.log("'Press Start 2P' font loaded successfully.");
             createSections();
             onWindowResize();
             requestAnimationFrame(animate);
         })
         .catch((err) => {
             console.error("Font loading error or timeout:", err);
             createSections();
             onWindowResize();
             requestAnimationFrame(animate);
         });
};
