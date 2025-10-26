import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class ThreeMain {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private cube!: THREE.Mesh;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // Check for WebGL2 support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      const warning = document.createElement('div');
      warning.innerHTML = `
        <div style="padding: 20px; background: #fee; color: #833; text-align: center;">
          Unable to initialize WebGL. Your browser or machine may not support it.<br>
          Try updating your graphics drivers or enabling WebGL in your browser settings.
        </div>
      `;
      this.container.appendChild(warning);
      return;
    }

    this.init();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  init() {
    // create canvas and renderer with more forgiving settings
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // disable if performance is an issue
      powerPreference: 'low-power', // try low-power mode first
      failIfMajorPerformanceCaveat: false, // allow software rendering
    });
    
    // Set to device pixel ratio, but cap at 2x to help performance
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // scene and camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
    this.camera.position.set(3, 2, 4);

    // controls with more forgiving settings
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // smooth movement
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();

    // lights (simplified for performance)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));

    // ground (simple material)
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x808080 }); // simpler material
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    // cube (simple material)
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshLambertMaterial({ color: 0x0088ff }); // simpler material
    this.cube = new THREE.Mesh(boxGeo, boxMat);
    this.cube.position.y = 0.5;
    this.scene.add(this.cube);

    window.addEventListener('resize', () => this.onWindowResize());
    this.onWindowResize();
  }

  onWindowResize() {
    if (!this.renderer) return; // guard against no WebGL
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate(time?: number) {
    if (!this.renderer) return; // guard against no WebGL
    requestAnimationFrame(this.animate);
    const t = (time ?? 0) * 0.001;
    this.cube.rotation.x = t * 0.6;
    this.cube.rotation.y = t * 0.8;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
