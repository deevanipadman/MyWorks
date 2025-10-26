# 3D Two-Room Apartment Visualization

A **single-file, self-contained** interactive 3D architecture visualization built with Three.js. Simply double-click `index.html` to run—no installation, no build process, no local server required!

## 🎯 What We Built

This project demonstrates a complete 3D apartment viewer with:
- **2 fully furnished rooms** (living room + bedroom)
- **11+ furniture pieces** with realistic materials
- **Advanced lighting** system with shadows
- **Interactive animations** (ceiling fan, opening door)
- **Smooth camera controls** with preset views
- **All-in-one HTML file** - CSS and JavaScript inlined, Three.js loaded from CDN

## 🏠 Features

### Architecture
- **2 Distinct Rooms**: Living room and bedroom separated by a dividing wall
- **Proper Structure**:
  - Walls with realistic thickness (30cm)
  - Floor and ceiling spanning both rooms
  - Doorway with frame connecting the rooms
  - All elements properly scaled and positioned

### Furniture & Objects

#### Living Room (6 items)
1. Three-seater sofa with armrests and backrest
2. Coffee table with four legs
3. TV stand with mounted television
4. Wooden bookshelf with multiple shelves
5. Ceiling fan (animated)
6. Decorative rug

#### Bedroom (6 items)
1. Bed with frame, mattress, headboard, and pillow
2. Large wardrobe with metallic handles
3. Nightstand with decorative lamp
4. Desk with four legs
5. Office chair with backrest
6. Desk lamp with glowing shade

### Materials (4 types)
1. **Wood Material**: Tables, bed frames, bookshelves (brown, medium roughness, low metalness)
2. **Fabric Material**: Sofa, mattress, pillows (various colors, high roughness, no metalness)
3. **Metal Material**: TV, wardrobe handles, lamp bases (shiny, low roughness, high metalness)
4. **Paint Material**: Walls and ceilings (light colors, high roughness)

### Lighting System
- **Ambient Light**: Soft overall illumination (0.4 intensity)
- **Directional Light**: Simulates sunlight from window with shadow casting
- **Point Lights**: Two ceiling lamps (one per room) with warm color temperature
- **Hemisphere Light**: Natural sky-ground color gradient
- **Emissive Materials**: Glowing lamp shades and TV screen

### Camera Navigation
- **OrbitControls** with smooth damping
- **Mouse Controls**:
  - Left click + drag: Rotate view
  - Right click + drag: Pan camera
  - Scroll wheel: Zoom in/out
- **Quick View Buttons**:
  - Living Room view
  - Bedroom view
  - Overview (bird's eye)
- **Smooth Camera Transitions**: Animated movement between preset positions with easing

### Animations
1. **Rotating Ceiling Fan**: Continuously rotates in living room (toggle on/off)
2. **Swinging Door**: Opens and closes smoothly between rooms with easing animation
3. **Smooth Transitions**: Camera movements use quadratic easing

### Bonus Features
✅ **Collision Detection**: Camera cannot pass through walls (basic proximity check)
✅ **Smooth Camera Transitions**: Animated movement with easing functions
✅ **FPS Counter**: Real-time performance monitoring
✅ **Shadow Mapping**: All objects cast and receive realistic shadows
✅ **Responsive Design**: Adapts to different screen sizes

## 🚀 How to Run

### Super Simple Method (Recommended)
1. **Right-click on `index.html`**
2. **Select "Open with" → Chrome or Edge**
3. **Done!** The 3D apartment loads instantly.

### Requirements
- ✅ Modern web browser (Chrome, Edge, Firefox, Safari)
- ✅ Internet connection (to load Three.js from CDN)
- ❌ No Node.js needed
- ❌ No npm install needed
- ❌ No local server needed
- ❌ No build process needed

## 📦 Project Structure

```
3d-architecture-2-room-apartment/
├── index.html          # Single self-contained file with everything inlined
└── README.md           # This file
```

## 🔧 Technical Implementation

### Self-Contained Architecture
- **All CSS inlined**: Styles embedded in `<style>` tag
- **All JavaScript inlined**: Complete application code in `<script type="module">` tag
- **CDN imports**: Three.js loaded from unpkg.com via import maps
- **No external dependencies**: Works via `file://` protocol

### Import Map Configuration
```html
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

```powershell
# Install dependencies
npm install

# Start a local server (choose one)
npx live-server . --port=8080
# or
python -m http.server 8080
# or
php -S localhost:8080
```

## 🎮 Controls

### Mouse Controls
- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag
- **Zoom**: Mouse wheel scroll

### UI Buttons
- **View Living**: Focus camera on living room
- **View Bedroom**: Focus camera on bedroom
- **View Overview**: Bird's eye view of entire apartment
- **Toggle Fan**: Start/stop ceiling fan rotation
- **Open/Close Door**: Animate the connecting door

### Keyboard
- The OrbitControls support arrow keys for panning (optional)

## 📁 Project Structure

```
3d-architecture-2-room-apartment/
├── index.html          # Main HTML file
├── package.json        # Project dependencies
├── README.md          # This file
├── css/
│   └── style.css      # Styling and UI
└── js/
    └── main.js        # Main Three.js application
```

## 🛠️ Technologies Used

- **Three.js** (v0.160.0): 3D graphics library
- **OrbitControls**: Camera navigation
- **WebGL**: Hardware-accelerated 3D rendering
- **ES6 Modules**: Modern JavaScript imports

## 📐 Architecture Details

### Room Dimensions
- **Living Room**: 12m × 10m
- **Bedroom**: 12m × 10m
- **Wall Height**: 10m
- **Wall Thickness**: 0.3m
- **Doorway Width**: 3m
- **Doorway Height**: 8m

### Coordinate System
- **Living Room**: Negative X axis (-8 to -18)
- **Bedroom**: Positive X axis (+8 to +18)
- **Dividing Wall**: X = 0
- **Floor**: Y = 0
- **Ceiling**: Y = 10

## 🎨 Material Properties

| Material Type | Roughness | Metalness | Use Cases |
|--------------|-----------|-----------|-----------|
| Wood | 0.6-0.7 | 0.2-0.3 | Furniture, door frame |
| Fabric | 0.8-0.9 | 0.0-0.1 | Sofa, mattress, rug |
| Metal | 0.3-0.5 | 0.6-0.9 | TV, handles, lamp base |
| Paint | 0.7-0.8 | 0.0-0.1 | Walls, ceiling |

## 🔧 Customization

### Changing Colors
Edit the material colors in `index.html`:

```javascript
const sofaMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5568, // Change this hex color
    roughness: 0.8,
    metalness: 0.1
});
```

### Adjusting Room Size
Open `index.html` and find the `createStructure()` method:

```javascript
const wallHeight = 10;      // Wall height
const roomWidth = 12;       // Room width
const roomDepth = 10;       // Room depth
const doorwayWidth = 3;     // Doorway width
```

### Adding More Furniture
Follow the pattern in `createLivingRoomFurniture()` or `createBedroomFurniture()` inside `index.html`:

```javascript
const furnitureMesh = new THREE.Mesh(geometry, material);
furnitureMesh.position.set(x, y, z);
furnitureMesh.castShadow = true;
this.scene.add(furnitureMesh);
```

## 🐛 Troubleshooting

### Blank Screen or Black Canvas
- ✅ **Check internet connection**: Three.js loads from CDN
- ✅ **Open browser console** (F12): Look for import or CORS errors
- ✅ **Try Chrome/Edge**: Best browser support for ES modules

### Module Import Errors
- ✅ **Check CDN availability**: Visit https://unpkg.com/three@0.160.0/
- ✅ **Clear browser cache**: Press Ctrl+Shift+Delete or Cmd+Shift+Delete
- ✅ **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Low Performance / Low FPS
- ✅ **Reduce shadow quality**: Find `renderer.shadowMap` settings in `index.html`
- ✅ **Disable shadows**: Set `this.renderer.shadowMap.enabled = false;`
- ✅ **Simplify geometry**: Reduce furniture detail

### Camera Stuck or Won't Move
- ✅ **Disable collision detection**: Set `this.collisionEnabled = false;`
- ✅ **Reset view**: Click the "Overview" button
- ✅ **Check mouse controls**: Ensure left-click drag works

## 📊 Performance

### Target Performance
- **60 FPS** on modern hardware (2020+)
- **30+ FPS** on older laptops

### Optimization Tips
1. Reduce shadow map resolution
2. Lower geometry complexity
3. Use fewer lights
4. Simplify material properties

## 🎓 What This Project Demonstrates

✅ **Modern ES Modules**: Using import maps for CDN dependencies  
✅ **3D Scene Composition**: Proper spatial arrangement of 12+ objects  
✅ **Advanced Lighting**: Multiple light types with shadow casting  
✅ **Material Systems**: 4 distinct material types with PBR properties  
✅ **Animation Systems**: Rotating fan and smooth door opening  
✅ **Camera Control**: OrbitControls with smooth transitions  
✅ **Collision Detection**: Basic spatial awareness  
✅ **Self-Contained Deployment**: Single-file architecture  

## 📝 Requirements Checklist

- [x] 2 distinct rooms (living room + bedroom)
- [x] Walls with proper thickness (0.3m)
- [x] Floor and ceiling spanning both rooms
- [x] Doorway with frame connecting rooms
- [x] Geometric primitives and custom shapes
- [x] 6+ furniture pieces per room
- [x] Proper scaling and positioning
- [x] 4+ different materials (wood, fabric, metal, paint)
- [x] OrbitControls for camera navigation
- [x] Smooth camera transitions (bonus)
- [x] Collision detection (bonus)
- [x] Animated rotating ceiling fan
- [x] Animated swinging door
- [x] Shadow mapping enabled
- [x] FPS counter display

## 🌟 Future Enhancement Ideas

- Add window with exterior cityscape view
- Implement texture mapping for realistic surfaces
- Add interactive objects (clickable lamps toggle light)
- Include ambient sound effects
- Add day/night lighting cycle
- Implement first-person walking mode
- Add WebXR/VR support for immersive viewing

## 📄 License

MIT License - Free to use for learning and educational purposes.

## � Acknowledgments

- **Three.js Team**: For the incredible 3D graphics library
- **unpkg.com**: For reliable CDN hosting
- **OrbitControls**: For intuitive camera navigation
- **WebGL**: For hardware-accelerated 3D rendering

---

**🏡 Enjoy exploring your virtual apartment! Double-click `index.html` to start!** ✨
