import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
camera.position.set(3, 2, 4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();

// Resize function
function resizeRendererToDisplaySize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const needResize = renderer.domElement.width !== Math.floor(width * window.devicePixelRatio) ||
    renderer.domElement.height !== Math.floor(height * window.devicePixelRatio);
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemi.position.set(0, 50, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
scene.add(dir);

// Ground
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9, metalness: 0.0 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
ground.position.y = 0;
scene.add(ground);

// A cube
const boxGeo = new THREE.BoxGeometry(1,1,1);
const boxMat = new THREE.MeshStandardMaterial({ color: 0x0088ff });
const cube = new THREE.Mesh(boxGeo, boxMat);
cube.position.y = 0.5;
scene.add(cube);

// Simple animation loop
function render(time) {
  time *= 0.001; // seconds
  resizeRendererToDisplaySize();
  cube.rotation.x = time * 0.6;
  cube.rotation.y = time * 0.8;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Handle window resize
window.addEventListener('resize', () => resizeRendererToDisplaySize());

// Helpful: expose scene for console debugging
window.app = { scene, camera, renderer, controls };
