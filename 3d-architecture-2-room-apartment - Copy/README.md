# 3D Two-Room Apartment Visualization

An interactive 3D architecture visualization built with Three.js, featuring a complete two-room apartment with furniture, animations, and smooth camera controls.

## 🏠 Features

### Architecture
- **2 Distinct Rooms**: Living room and bedroom separated by a dividing wall
- **Proper Structure**:
  - Walls with realistic thickness (30cm)
  - Floor and ceiling spanning both rooms
  - Doorway with frame connecting the rooms
  - All elements properly scaled and positioned

### Furniture & Objects

#### Living Room (5+ items)
1. Three-seater sofa with armrests and backrest
2. Coffee table with four legs
3. TV stand with mounted television
4. Wooden bookshelf with multiple shelves
5. Ceiling fan (animated)
6. Decorative rug

#### Bedroom (6+ items)
1. Bed with frame, mattress, headboard, and pillow
2. Large wardrobe with metallic handles
3. Nightstand with decorative lamp
4. Desk with four legs
5. Office chair with backrest
6. Desk lamp with glowing shade

### Materials (3+ types)
1. **Wood Material**: Used for tables, bed frames, bookshelves (brown, medium roughness, low metalness)
2. **Fabric Material**: Used for sofa, mattress, pillows (various colors, high roughness, no metalness)
3. **Metal Material**: Used for TV, wardrobe handles, lamp bases (shiny, low roughness, high metalness)
4. **Paint Material**: Used for walls and ceilings (light colors, high roughness)

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone or navigate to the project directory**:
   ```powershell
   cd C:\GitHub\MyWorks\3d-architecture-2-room-apartment
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   npm start
   ```

4. **Open your browser**:
   - The application will automatically open at `http://localhost:8080`
   - If not, manually navigate to `http://localhost:8080`

### Alternative: Manual Setup

If you prefer not to use npm scripts:

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
Edit the material colors in `js/main.js`:

```javascript
const sofaMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5568, // Change this hex color
    roughness: 0.8,
    metalness: 0.1
});
```

### Adjusting Room Size
Modify the constants in `createStructure()` method:

```javascript
const wallHeight = 10;      // Wall height
const roomWidth = 12;       // Room width
const roomDepth = 10;       // Room depth
const doorwayWidth = 3;     // Doorway width
```

### Adding More Furniture
Follow the pattern in `createLivingRoomFurniture()` or `createBedroomFurniture()`:

```javascript
const furnitureMesh = new THREE.Mesh(geometry, material);
furnitureMesh.position.set(x, y, z);
furnitureMesh.castShadow = true;
this.scene.add(furnitureMesh);
```

## 🐛 Troubleshooting

### Issue: Black screen or blank canvas
- **Solution**: Check browser console for errors. Ensure Three.js loaded correctly.
- Open DevTools (F12) and check the Console tab.

### Issue: Textures not loading
- **Solution**: This project uses procedural materials (no external textures required).
- Ensure the server is running and the page is loaded via HTTP (not file://).

### Issue: Low performance / Low FPS
- **Solution**: 
  - Reduce shadow quality in `setupLights()`
  - Disable shadows: `this.renderer.shadowMap.enabled = false;`
  - Simplify geometry in furniture creation methods

### Issue: Module not found errors
- **Solution**: Run `npm install` to ensure Three.js is installed in `node_modules/`

### Issue: Camera stuck or won't move
- **Solution**: 
  - Check collision detection isn't too aggressive
  - Try disabling collisions: `this.collisionEnabled = false;`
  - Reset view using the "Overview" button

## 📊 Performance

### Target Performance
- **60 FPS** on modern hardware
- **30+ FPS** on older laptops

### Optimization Tips
1. Reduce shadow map size (line 105 in main.js)
2. Decrease geometry complexity
3. Limit number of lights
4. Use simpler materials (fewer properties)

## 🎓 Learning Objectives Met

✅ **3D Modeling**: Custom geometries for walls, floors, furniture  
✅ **Scene Composition**: Proper spatial arrangement of 10+ objects  
✅ **Lighting**: Multiple light types (ambient, directional, point, hemisphere)  
✅ **Materials**: 3+ distinct material types with varying properties  
✅ **Animation**: Rotating fan and swinging door  
✅ **Camera Control**: Smooth OrbitControls with transitions  
✅ **Collision Detection**: Basic wall collision prevention  

## 📝 Requirements Checklist

- [x] 2 distinct rooms (living room + bedroom)
- [x] Walls with proper thickness (0.3m)
- [x] Floor and ceiling
- [x] Doorway connecting rooms
- [x] Geometric primitives and custom geometries
- [x] 3-5 furniture pieces per room (6 in living, 7 in bedroom)
- [x] Proper scaling and positioning
- [x] 3+ different materials (wood, fabric, metal, paint)
- [x] OrbitControls for navigation
- [x] Navigate through all rooms
- [x] Smooth camera transitions (bonus)
- [x] Collision detection (bonus)
- [x] Animated rotating fan
- [x] Animated swinging door

## 🌟 Future Enhancements

- Add window with exterior view
- Implement texture mapping for walls/floors
- Add more interactive objects (clickable lamps, TV)
- Include sound effects for door and fan
- Add day/night lighting cycle
- Implement first-person camera mode
- Add VR support

## 📄 License

MIT License - Feel free to use this project for learning and educational purposes.

## 👤 Author

Created as a demonstration of Three.js capabilities for 3D architecture visualization.

## 🙏 Acknowledgments

- Three.js documentation and examples
- WebGL and computer graphics principles
- Modern web development best practices

---

**Enjoy exploring your 3D apartment!** 🏡✨
