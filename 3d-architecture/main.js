import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/RGBELoader.js';

// === Scene setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe1f5fe);

// === Camera ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(14, 12, 14);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

// === Environment (HDR) ===
new RGBELoader()
  .setPath('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r155/examples/textures/equirectangular/')
  .load('royal_esplanade_1k.hdr', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  });

// === Lights ===
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 15, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const fill = new THREE.DirectionalLight(0xffffff, 0.6);
fill.position.set(-8, 10, -6);
scene.add(fill);

// Warm interior light
const warmLight = new THREE.PointLight(0xfff0cc, 1.4, 25);
warmLight.position.set(0, 4, 0);
scene.add(warmLight);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.2;
controls.update();

// === Textures ===
const tex = new THREE.TextureLoader();
const floorTex = tex.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r155/examples/textures/hardwood2_diffuse.jpg');
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(4, 3);
floorTex.colorSpace = THREE.SRGBColorSpace;

const brick = tex.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r155/examples/textures/brick_diffuse.jpg');
brick.colorSpace = THREE.SRGBColorSpace;

// === Custom Living Room floor texture ===
const woodFloor = tex.load('https://i.postimg.cc/xyz/hardwood.png'); // your uploaded texture
woodFloor.wrapS = woodFloor.wrapT = THREE.RepeatWrapping;
woodFloor.repeat.set(3, 3); // adjust pattern tiling
woodFloor.colorSpace = THREE.SRGBColorSpace;

const matWoodFloor = new THREE.MeshStandardMaterial({
  map: woodFloor,
  roughness: 0.45,
  metalness: 0.1
});

// === Materials ===
const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.4, metalness: 0.0 });
const matWhite = new THREE.MeshStandardMaterial({ color: 0xfaf8f2, roughness: 0.7 });
const matBrick = new THREE.MeshStandardMaterial({ map: brick, roughness: 0.8 });
const matCream = new THREE.MeshStandardMaterial({ color: 0xfff4e0, roughness: 0.8 });

// === Floor ===
// === Separate floors for living room and bedroom ===

// Living room floor (wood)
const livingFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), matWoodFloor);
livingFloor.rotation.x = -Math.PI / 2;
livingFloor.position.x = -4; // left half of house
livingFloor.receiveShadow = true;
scene.add(livingFloor);

// Bedroom floor (original tile/brick)
const bedroomFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), matFloor);
bedroomFloor.rotation.x = -Math.PI / 2;
bedroomFloor.position.x = 4; // right half of house
bedroomFloor.receiveShadow = true;
scene.add(bedroomFloor);

// Optional floor trim
const baseTrim = new THREE.Mesh(
  new THREE.BoxGeometry(16.2, 0.1, 10.2),
  new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 0.8 })
);
baseTrim.position.y = 0.05;
scene.add(baseTrim);

// === DOOR SETUP (Right-side exterior wall, opens outward) ===
const doorWidth = 1.2;
const doorHeight = 2.2;
const doorThickness = 0.08;

const doorPivot = new THREE.Group();
doorPivot.position.set(8 + doorThickness / 2, doorHeight / 2, 0.6); // outside wall
scene.add(doorPivot);

// === Exterior door color same as divider door ===
const doorMat = new THREE.MeshStandardMaterial({
  color: 0x8b5a2b,  // same brown tone as interior door
  roughness: 0.5,
  metalness: 0.1
});

const door = new THREE.Mesh(
  new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness),
  doorMat
);
door.position.x = -doorWidth / 2; // offset to hinge outward
door.castShadow = true;
door.receiveShadow = true;
doorPivot.add(door);

// Click to toggle open/close
window.addEventListener('click', () => {
  doorPivot.userData.opening = !doorPivot.userData.opening;
});

// === EXTERIOR DOOR ANIMATION ===
if (doorPivot.userData.opening) {
  if (doorPivot.rotation.y > -Math.PI / 2) doorPivot.rotation.y -= 0.04; // opens faster
} else {
  if (doorPivot.rotation.y < 0) doorPivot.rotation.y += 0.04; // closes faster
}

// === Wall builder ===
function wall(mat, x, y, z, w, h, d) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// === Room Layout ===
// Living room outer walls
wall(matBrick, -3, 1.5, -5, 10, 3, 0.2);  // back wall
wall(matBrick, -8, 1.5, 0, 0.2, 3, 10);   // left wall
wall(matBrick, -3, 1.5, 5, 10, 3, 0.2);   // front wall

// Bedroom outer walls
wall(matBrick, 3, 1.5, -5, 10, 3, 0.2);   // back wall

// === Right-side wall with a door hole ===
const rightWall = wallWithDoor(matBrick, 10, 3, 0.2, 1.2, 2.2, 0);
rightWall.position.set(8, 1.5, 0);
rightWall.rotation.y = Math.PI / 2; // ✅ rotate so depth goes correctly along Z
scene.add(rightWall);

wall(matBrick, 3, 1.5, 5, 10, 3, 0.2);    // front wall

// === Divider wall with a door hole ===
function wallWithDoor(mat, width, height, thickness, doorWidth, doorHeight, doorX) {
  // 1. Create a rectangle (the wall shape)
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);

  // 2. Cut a rectangular hole in the shape (the door opening)
  const hole = new THREE.Path();
  hole.moveTo(doorX - doorWidth / 2, -height / 2);
  hole.lineTo(doorX + doorWidth / 2, -height / 2);
  hole.lineTo(doorX + doorWidth / 2, -height / 2 + doorHeight);
  hole.lineTo(doorX - doorWidth / 2, -height / 2 + doorHeight);
  hole.lineTo(doorX - doorWidth / 2, -height / 2);
  shape.holes.push(hole);

  // 3. Extrude it into 3D (add depth)
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// === Add the divider wall with door hole ===
const dividerWall = wallWithDoor(matWhite, 10, 3, 0.2, 1.2, 2.2, 0);
dividerWall.position.set(0, 1.5, 0); // same location as old wall
dividerWall.rotation.y = Math.PI / 2; // ✅ rotate so it faces the same way
scene.add(dividerWall);

// === Interior swinging door ===
const interiorDoorPivot = new THREE.Group();
interiorDoorPivot.position.set(0.1, 1.1, 0.6); // hinge slightly outside wall
scene.add(interiorDoorPivot);

const interiorDoor = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 2.2, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5, metalness: 0.1 })
);
interiorDoor.position.x = -0.6; // offset for hinge
interiorDoor.castShadow = true;
interiorDoor.receiveShadow = true;
interiorDoorPivot.add(interiorDoor);

// Toggle door on click
window.addEventListener('click', () => {
  interiorDoorPivot.userData.opening = !interiorDoorPivot.userData.opening;
});

// === Furniture loader ===
const loader = new GLTFLoader();

// Use online models for demo if local ones missing
function loadModel(url, scale, pos, rotY = 0) {
  loader.load(
    url,
    (gltf) => {
      const obj = gltf.scene;
      obj.scale.set(scale, scale, scale);
      obj.position.copy(pos);
      obj.rotation.y = rotY;
      obj.traverse((n) => {
        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
        }
      });
      scene.add(obj);
    },
    undefined,
    (err) => console.warn('Model failed:', url, err)
  );
}

// === Furniture placement ===




// === Animation loop ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // === EXTERIOR DOOR ANIMATION ===
  if (doorPivot.userData.opening) {
    if (doorPivot.rotation.y > -Math.PI / 2) {
      doorPivot.rotation.y -= 0.02; // open
    }
  } else {
    if (doorPivot.rotation.y < 0) {
      doorPivot.rotation.y += 0.02; // close
    }
  }

  // === INTERIOR DOOR ANIMATION ===
  if (interiorDoorPivot.userData.opening) {
    if (interiorDoorPivot.rotation.y > -Math.PI / 2) {
      interiorDoorPivot.rotation.y -= 0.03; // open
    }
  } else {
    if (interiorDoorPivot.rotation.y < 0) {
      interiorDoorPivot.rotation.y += 0.03; // close
    }
  }
  renderer.render(scene, camera);
}
animate();

// Reset
document.getElementById('reset')?.addEventListener('click', () => {
  camera.position.set(14, 10, 14);
  controls.target.set(0, 1.5, 0);
  controls.update();
});

// Manual control buttons
document.getElementById('zoomIn')?.addEventListener('click', () => camera.position.multiplyScalar(0.9));
document.getElementById('zoomOut')?.addEventListener('click', () => camera.position.multiplyScalar(1.1));
document.getElementById('moveUp')?.addEventListener('click', () => (camera.position.y -= 0.5));
document.getElementById('moveDown')?.addEventListener('click', () => (camera.position.y += 0.5));
document.getElementById('moveLeft')?.addEventListener('click', () => (camera.position.x -= 0.5));
document.getElementById('moveRight')?.addEventListener('click', () => (camera.position.x += 0.5));

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
