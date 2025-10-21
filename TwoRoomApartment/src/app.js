import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Lightweight on-page error/debug overlay so runtime errors are visible in the browser
function createDebugOverlay() {
  let d = document.createElement('div');
  d.id = 'debug-overlay';
  d.style.position = 'absolute';
  d.style.right = '12px';
  d.style.bottom = '12px';
  d.style.maxWidth = '40vw';
  d.style.maxHeight = '40vh';
  d.style.overflow = 'auto';
  d.style.background = 'rgba(0,0,0,0.7)';
  d.style.color = '#fff';
  d.style.fontFamily = 'monospace';
  d.style.fontSize = '12px';
  d.style.padding = '8px';
  d.style.borderRadius = '6px';
  d.style.zIndex = 9999;
  d.innerText = 'Debug: app.js loaded\n';
  document.body.appendChild(d);
  return d;
}
const __debugEl = createDebugOverlay();
function dbg(msg) { if (__debugEl) __debugEl.innerText += '\n' + String(msg); console.log(msg); }

window.addEventListener('error', (ev) => {
  dbg('Error: ' + ev.message + ' (line ' + ev.lineno + ')');
  if (ev.error && ev.error.stack) dbg(ev.error.stack);
});
window.addEventListener('unhandledrejection', (ev) => {
  dbg('UnhandledRejection: ' + (ev.reason && ev.reason.message ? ev.reason.message : ev.reason));
  if (ev.reason && ev.reason.stack) dbg(ev.reason.stack);
});
dbg('Starting app...');

// Basic renderer and scene setup
const canvas = document.getElementById('app');
// Renderer - cap pixel ratio to avoid huge GPU work on high-DPI displays
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
let DPR = Math.min(window.devicePixelRatio || 1, 1.5);
renderer.setPixelRatio(DPR);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.width = 1024;
renderer.shadowMap.height = 1024;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;

// keep references for top-down/ceiling toggles
const perspCamera = camera;
const controlsPersp = controls;
let activeCamera = perspCamera;

// top-down orthographic camera (will be positioned above scene)
let topCamera, controlsOrtho;
function createTopCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = Math.max(roomWidth * 3, roomDepth * 3);
  topCamera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    200
  );
  topCamera.position.set(0, 25, 0);
  topCamera.up.set(0, 0, -1); // so +Z points down the page
  topCamera.lookAt(0, 0, 0);
  controlsOrtho = new OrbitControls(topCamera, renderer.domElement);
  controlsOrtho.enableRotate = false;
  controlsOrtho.enablePan = true;
  controlsOrtho.enableZoom = true;
  controlsOrtho.target.set(0, 0, 0);
  controlsOrtho.update();
  controlsOrtho.enabled = false;
}
createTopCamera();

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  // update perspective camera
  perspCamera.aspect = w / h;
  perspCamera.updateProjectionMatrix();
  // update orthographic camera
  if (topCamera) {
    const aspect = w / h;
    const frustumSize = Math.max(roomWidth * 3, roomDepth * 3);
    topCamera.left = -frustumSize * aspect / 2;
    topCamera.right = frustumSize * aspect / 2;
    topCamera.top = frustumSize / 2;
    topCamera.bottom = -frustumSize / 2;
    topCamera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resize);
resize();

// Materials
const matWall = new THREE.MeshStandardMaterial({ color: 0xffffff });
const matFloorWood = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const matMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.25 });
const matGlass = new THREE.MeshPhysicalMaterial({ color: 0x88ccee, metalness: 0, roughness: 0.1, transmission: 0.8, transparent: true });

// Helper: create a room (box-shaped with walls thickness, floor, ceiling) with an opening on one wall
function createRoom(width, depth, height, wallThickness, doorWidth = 1, doorHeight = 2, includeCeiling = true, includeBack = true) {
  const group = new THREE.Group();

  // Floor
  const floorGeo = new THREE.BoxGeometry(width, 0.1, depth);
  const floor = new THREE.Mesh(floorGeo, matFloorWood);
  floor.receiveShadow = true;
  floor.position.y = 0;
  group.add(floor);

  // Ceiling
  if (includeCeiling) {
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, depth), matWall);
    ceil.position.y = height;
    group.add(ceil);
    // track ceilings for toggle
    ceilings.push(ceil);
  }

  // Walls: create left, right, back, front with a doorway in front
  const halfW = width / 2;
  const halfD = depth / 2;

  const wallGeomLR = new THREE.BoxGeometry(wallThickness, height, depth);
  const left = new THREE.Mesh(wallGeomLR, matWall);
  left.position.set(-halfW + wallThickness / 2, height / 2, 0);
  left.castShadow = true;
  left.receiveShadow = true;
  group.add(left);

  const right = left.clone();
  right.position.x = halfW - wallThickness / 2;
  group.add(right);

  // Back wall (optional)
  if (includeBack) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), matWall);
    back.position.set(0, height / 2, -halfD + wallThickness / 2);
    back.castShadow = true;
    back.receiveShadow = true;
    group.add(back);
  }

  // Front wall with doorway (we will build two side pieces and top)
  const doorHalf = (width - doorWidth) / 2;
  // left front piece
  const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(doorHalf, height, wallThickness), matWall);
  frontLeft.position.set(- (width - doorWidth) / 4 - doorWidth / 4, height / 2, halfD - wallThickness / 2);
  group.add(frontLeft);

  const frontRight = frontLeft.clone();
  frontRight.position.x = -frontLeft.position.x;
  group.add(frontRight);

  // top piece
  const topPiece = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, height - doorHeight, wallThickness), matWall);
  topPiece.position.set(0, doorHeight + (height - doorHeight) / 2, halfD - wallThickness / 2);
  group.add(topPiece);

  return group;
}

// Build two rooms side-by-side, connected by a doorway
const roomWidth = 6;
const roomDepth = 6;
const roomHeight = 3;
const wallThickness = 0.15;

const room1 = createRoom(roomWidth, roomDepth, roomHeight, wallThickness, 1.2, 2.1, false, false);
room1.position.set(-roomWidth / 2 - 0.1, 0, 0);
scene.add(room1);

const room2 = createRoom(roomWidth, roomDepth, roomHeight, wallThickness, 1.2, 2.1, false, false);
room2.position.set(roomWidth / 2 + 0.1, 0, 0);
scene.add(room2);

// Add a simple dividing wall with doorway between rooms
const divider = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth - 1.2), matWall);
divider.position.set(0, roomHeight / 2, 0);
divider.castShadow = true;
divider.receiveShadow = true;
scene.add(divider);

// Remove center doorway volume by adding a box of background color (simple trick)
// (Three.js CSG would be ideal but we avoid heavy deps)
// We'll instead create a doorway by placing thinner pieces to simulate opening
const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, 2.1, 1.5), scene.background ? new THREE.MeshBasicMaterial({ color: 0xbfd1e5 }) : matWall);
doorLeft.position.set(0, 1.05, -1.0);
scene.add(doorLeft);

const doorRight = doorLeft.clone();
doorRight.position.z = 1.0;
scene.add(doorRight);

// Furniture and decorative objects (3-5 per room)
function addFurniture() {
  // Room 1: sofa, table, lamp
  const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0x552200 }));
  sofa.position.set(-roomWidth / 2 - 0.1 - 1.0, 0.3, -1.0);
  sofa.castShadow = true;
  scene.add(sofa);

  const coffee = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), matFloorWood);
  coffee.position.set(-roomWidth / 2 - 0.1 - 0.1, 0.22, -0.6);
  coffee.castShadow = true;
  scene.add(coffee);

  const floorLamp = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), matMetal);
  pole.position.set(-roomWidth / 2 - 0.1 + 1.8, 0.6, -2.2);
  pole.castShadow = true;
  floorLamp.add(pole);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.3), new THREE.MeshStandardMaterial({ color: 0xffd99a }));
  shade.position.set(0, 0.65, 0);
  shade.rotation.x = Math.PI;
  pole.add(shade);
  scene.add(floorLamp);

  // Room 2: bed, table, chair, window
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 2.2), new THREE.MeshStandardMaterial({ color: 0x204060 }));
  bed.position.set(roomWidth / 2 + 0.1 + 1.0, 0.2, 0.8);
  bed.castShadow = true;
  scene.add(bed);

  const night = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), matFloorWood);
  night.position.set(roomWidth / 2 + 0.1 + 0.2, 0.25, 1.9);
  night.castShadow = true;
  scene.add(night);

  const chair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), new THREE.MeshStandardMaterial({ color: 0x996633 }));
  chair.position.set(roomWidth / 2 + 0.1 + 1.8, 0.4, -1.8);
  chair.castShadow = true;
  scene.add(chair);

  // Window (glass)
  const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.05), matGlass);
  windowGlass.position.set(roomWidth / 2 + 0.1 + 2.9, 1.4, 0);
  scene.add(windowGlass);
}
addFurniture();

// track ceilings
const ceilings = [];

// UI: ceiling toggle and top view button
function createUI() {
  const wrap = document.createElement('div');
  wrap.style.position = 'absolute';
  wrap.style.right = '12px';
  wrap.style.top = '12px';
  wrap.style.zIndex = 9999;
  document.body.appendChild(wrap);

  const ceilBtn = document.createElement('button');
  ceilBtn.textContent = 'Toggle Ceilings';
  ceilBtn.style.display = 'block';
  ceilBtn.style.marginBottom = '6px';
  ceilBtn.onclick = () => {
    const visible = !(ceilings[0] && ceilings[0].visible);
    ceilings.forEach(c => c.visible = visible);
  };
  wrap.appendChild(ceilBtn);

  const topBtn = document.createElement('button');
  topBtn.textContent = 'Top View';
  topBtn.onclick = () => {
    if (activeCamera === perspCamera) {
      activeCamera = topCamera;
      controlsPersp.enabled = false;
      controlsOrtho.enabled = true;
    } else {
      activeCamera = perspCamera;
      controlsPersp.enabled = true;
      controlsOrtho.enabled = false;
    }
  };
  wrap.appendChild(topBtn);
}
createUI();

// --- Seamless first-person movement mode ---
let seamlessEnabled = false;
const fp = {
  yaw: 0,
  pitch: 0,
  velocity: new THREE.Vector3(0,0,0),
  desired: new THREE.Vector3(0,0,0),
  speed: 4.0, // meters/sec
  accel: 30.0,
  damping: 8.0
};

// Pointer lock and mouse look
function enablePointerLock() {
  const canvas = renderer.domElement;
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
}

function exitPointerLock() {
  if (document.exitPointerLock) document.exitPointerLock();
}

function onPointerLockChange() {
  const canvas = renderer.domElement;
  const locked = document.pointerLockElement === canvas;
  // enable/disable orbit controls when locked
  controlsPersp.enabled = !locked;
}
document.addEventListener('pointerlockchange', onPointerLockChange);

function onMouseMoveWhenLocked(e) {
  if (!seamlessEnabled) return;
  if (document.pointerLockElement !== renderer.domElement) return;
  const movementX = e.movementX || 0;
  const movementY = e.movementY || 0;
  fp.yaw -= movementX * 0.002;
  fp.pitch -= movementY * 0.002;
  fp.pitch = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, fp.pitch));
}
document.addEventListener('mousemove', onMouseMoveWhenLocked);

// Keyboard state for FP movement
const fpKeys = {};
window.addEventListener('keydown', (e) => { fpKeys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { fpKeys[e.key.toLowerCase()] = false; });

// toggle seamless mode button
function createSeamlessToggle() {
  const btn = document.createElement('button');
  btn.textContent = 'Seamless Move: Off';
  btn.style.display = 'block';
  btn.style.marginTop = '6px';
  btn.onclick = () => {
    seamlessEnabled = !seamlessEnabled;
    btn.textContent = 'Seamless Move: ' + (seamlessEnabled ? 'On' : 'Off');
    if (seamlessEnabled) {
      // switch to perspective and pointer lock on click
      activeCamera = perspCamera;
      controlsPersp.enabled = false;
      // center yaw/pitch from current camera rotation
      const dir = new THREE.Vector3();
      perspCamera.getWorldDirection(dir);
      fp.yaw = Math.atan2(-dir.x, -dir.z);
      fp.pitch = Math.asin(dir.y);
      // request pointer lock on click
      renderer.domElement.style.cursor = 'crosshair';
      renderer.domElement.addEventListener('click', enablePointerLock);
    } else {
      renderer.domElement.style.cursor = '';
      renderer.domElement.removeEventListener('click', enablePointerLock);
      exitPointerLock();
      controlsPersp.enabled = true;
    }
  };
  // append to UI wrapper
  const wrap = document.querySelector('body > div') || document.body;
  // try to find existing UI wrapper created earlier
  const uiWrap = document.querySelector('div[style*="right: 12px"][style*="top: 12px"]');
  if (uiWrap) uiWrap.appendChild(btn); else document.body.appendChild(btn);
}
createSeamlessToggle();

// FP movement update (called from main animate loop)
function updateFirstPerson(dt) {
  // compute desired direction from keys
  const forward = (fpKeys['w'] || fpKeys['arrowup']) ? 1 : ((fpKeys['s'] || fpKeys['arrowdown']) ? -1 : 0);
  const right = (fpKeys['d'] || fpKeys['arrowright']) ? 1 : ((fpKeys['a'] || fpKeys['arrowleft']) ? -1 : 0);
  fp.desired.set(0, 0, 0);
  if (forward !== 0) fp.desired.z = -forward;
  if (right !== 0) fp.desired.x = right;
  if (fp.desired.lengthSq() > 0) fp.desired.normalize();

  // rotate desired by yaw
  const sinY = Math.sin(fp.yaw), cosY = Math.cos(fp.yaw);
  const dx = fp.desired.x * cosY - fp.desired.z * sinY;
  const dz = fp.desired.x * sinY + fp.desired.z * cosY;
  const desiredWorld = new THREE.Vector3(dx, 0, dz).multiplyScalar(fp.speed);

  // accelerate velocity towards desiredWorld
  fp.velocity.lerp(desiredWorld, 1 - Math.exp(-fp.accel * dt));

  // apply damping when no input
  if (fp.desired.lengthSq() === 0) fp.velocity.multiplyScalar(Math.max(0, 1 - fp.damping * dt));

  // move camera
  perspCamera.position.addScaledVector(fp.velocity, dt);
  // apply rotation from yaw/pitch
  perspCamera.rotation.set(fp.pitch, fp.yaw, 0, 'YXZ');
  // keep controls target in sync
  controlsPersp.target.copy(perspCamera.position).add(new THREE.Vector3(0, 0, -1).applyEuler(perspCamera.rotation));
}


// Rotating ceiling fan in room1
const fan = new THREE.Group();
const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), matMetal);
fanHub.rotation.x = Math.PI / 2;
fan.add(fanHub);
for (let i = 0; i < 3; i++) {
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 1.2), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  blade.position.set(0, 0, 0.6);
  blade.castShadow = true;
  const bladePivot = new THREE.Group();
  bladePivot.add(blade);
  bladePivot.rotation.y = (i / 3) * Math.PI * 2;
  fan.add(bladePivot);
}
fan.position.set(-roomWidth / 2 - 0.1 - 0.2, 2.8, 0);
scene.add(fan);

// Lighting
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemi.position.set(0, 50, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
dir.castShadow = true;
// tighten shadow camera extents to improve performance
dir.shadow.mapSize.width = 1024;
dir.shadow.mapSize.height = 1024;
dir.shadow.camera.top = 6;
dir.shadow.camera.bottom = -6;
dir.shadow.camera.left = -6;
dir.shadow.camera.right = 6;
dir.shadow.camera.near = 0.5;
dir.shadow.camera.far = 50;
scene.add(dir);

const point = new THREE.PointLight(0xfff4cc, 0.6, 10);
point.position.set(-roomWidth / 2 - 0.1 - 1.8, 2.0, -2.2);
point.castShadow = true;
scene.add(point);

// Simple keyboard movement (WASD)
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function updateCameraMovement(delta) {
  const speed = 3;
  const move = new THREE.Vector3();
  if (keys['w'] || keys['arrowup']) move.z -= 1;
  if (keys['s'] || keys['arrowdown']) move.z += 1;
  if (keys['a'] || keys['arrowleft']) move.x -= 1;
  if (keys['d'] || keys['arrowright']) move.x += 1;
  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(speed * delta);
    // move relative to camera orientation on the XZ plane
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), forward).normalize();
    const deltaPos = new THREE.Vector3();
    deltaPos.addScaledVector(forward, -move.z);
    deltaPos.addScaledVector(right, move.x);
    camera.position.add(deltaPos);
    controls.target.add(deltaPos);
  }
}

// Animation loop
// Quality settings (can toggle between 'high' and 'low')
const quality = {
  mode: 'high', // or 'low'
  apply(mode) {
    this.mode = mode;
    if (mode === 'low') {
      DPR = Math.min(window.devicePixelRatio || 1, 1);
      renderer.setPixelRatio(DPR);
      renderer.shadowMap.width = renderer.shadowMap.height = 512;
      dir.shadow.mapSize.width = dir.shadow.mapSize.height = 512;
      targetFPS = 30;
    } else {
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(DPR);
      renderer.shadowMap.width = renderer.shadowMap.height = 1024;
      dir.shadow.mapSize.width = dir.shadow.mapSize.height = 1024;
      targetFPS = 60;
    }
  }
};

// add a small UI toggle
function createQualityToggle() {
  const btn = document.createElement('button');
  btn.style.position = 'absolute';
  btn.style.left = '12px';
  btn.style.bottom = '12px';
  btn.style.zIndex = 9999;
  btn.style.padding = '6px 10px';
  btn.style.background = 'rgba(0,0,0,0.6)';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.textContent = 'Quality: High';
  btn.onclick = () => {
    const next = quality.mode === 'high' ? 'low' : 'high';
    quality.apply(next);
    btn.textContent = 'Quality: ' + (next.charAt(0).toUpperCase() + next.slice(1));
  };
  document.body.appendChild(btn);
}
createQualityToggle();

// Animation loop with frame-skipping to cap render rate (helps on low-end machines)
const clock = new THREE.Clock();
let lastTime = 0;
let targetFPS = 60; // will be overridden by quality.apply
let frameInterval = 1000 / targetFPS;
function animate(time) {
  requestAnimationFrame(animate);
  if (!lastTime) lastTime = time;
  const elapsed = time - lastTime;
  if (elapsed < frameInterval) return; // skip frame
  lastTime = time;
  const dt = clock.getDelta();
  // update the currently active controls
  if (activeCamera === perspCamera) controlsPersp.update(); else controlsOrtho.update();
  // update movement; prefer seamless first-person if enabled
  if (seamlessEnabled) {
    updateFirstPerson(dt);
  } else {
    updateCameraMovement(dt);
  }
  // rotate fan
  fan.rotation.y += dt * 6.0; // radians per second
  renderer.render(scene, activeCamera);
}
quality.apply('high');
frameInterval = 1000 / targetFPS;
requestAnimationFrame(animate);

// Expose scene for dev console
window.scene = scene;
