# Quick Start Guide

## Your 3D Apartment is Ready! 🎉

The application is currently running at: **http://127.0.0.1:8080**

## What You Have

### ✅ Complete Requirements Met

1. **2-Room Architecture**
   - Living Room (left side, X: -8)
   - Bedroom (right side, X: +8)
   - Connecting doorway with animated door

2. **Structure Elements**
   - Walls with 0.3m thickness
   - Floor spanning both rooms
   - Ceiling with proper height (10m)
   - Doorway with wooden frame

3. **Furniture** (13 total pieces)
   
   **Living Room (6 items)**:
   - Sofa with armrests and backrest
   - Coffee table with legs
   - TV stand with mounted TV
   - Bookshelf with shelves
   - Ceiling fan (animated)
   - Decorative rug

   **Bedroom (7 items)**:
   - Bed (frame, mattress, headboard, pillow)
   - Wardrobe with handles
   - Nightstand
   - Desk
   - Office chair
   - Lamp (glowing)

4. **Materials** (4 types)
   - Wood (tables, bed, bookshelf)
   - Fabric (sofa, mattress, rug)
   - Metal (TV, handles, lamp base)
   - Paint (walls, ceiling)

5. **Lighting**
   - Ambient light
   - Directional sunlight with shadows
   - 2 Point lights (ceiling lamps)
   - Hemisphere light
   - Emissive lamp shades

6. **Camera Controls**
   - OrbitControls (rotate, pan, zoom)
   - Smooth camera transitions
   - Quick view buttons
   - Basic collision detection

7. **Animations**
   - Rotating ceiling fan
   - Swinging door with easing
   - Smooth camera movements

## How to Use

### Mouse Controls
- **Left Click + Drag**: Rotate around the apartment
- **Right Click + Drag**: Pan the camera
- **Scroll Wheel**: Zoom in/out

### Buttons (Top-right panel)
- **View Living**: Focus on living room
- **View Bedroom**: Focus on bedroom  
- **View Overview**: Bird's eye view
- **Toggle Fan**: Start/stop fan rotation
- **Open/Close Door**: Animate the connecting door

### Navigation Tips
1. Start with "View Overview" to see the entire layout
2. Use "View Living" or "View Bedroom" for closer inspection
3. Use mouse to freely explore
4. The camera won't go through walls (collision detection)

## Project Structure

```
C:\GitHub\MyWorks\3d-architecture-2-room-apartment\
├── index.html       # Main HTML (open in browser)
├── package.json     # Dependencies
├── README.md        # Full documentation
├── QUICKSTART.md    # This file
├── node_modules/    # Three.js library
├── css/
│   └── style.css    # UI styling
└── js/
    └── main.js      # 3D apartment code (1000+ lines)
```

## Running the App

### Method 1: Currently Running
The server is already running! Just keep the terminal open and use:
- **http://127.0.0.1:8080**

### Method 2: Restart Server
If you closed the terminal:
```powershell
cd C:\GitHub\MyWorks\3d-architecture-2-room-apartment
npx live-server . --port=8080
```

### Method 3: Different Port
If port 8080 is busy:
```powershell
npx live-server . --port=3000
```

## Customization

### Change Colors
Edit `js/main.js` and find material definitions:
```javascript
const sofaMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5568, // Change this hex value
    roughness: 0.8,
    metalness: 0.1
});
```

### Add More Furniture
In `js/main.js`, add to `createLivingRoomFurniture()` or `createBedroomFurniture()`:
```javascript
const newFurniture = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1), // width, height, depth
    materialName
);
newFurniture.position.set(x, y, z);
newFurniture.castShadow = true;
this.scene.add(newFurniture);
```

### Adjust Room Size
In `createStructure()` method, change:
```javascript
const roomWidth = 12;   // Change width
const roomDepth = 10;   // Change depth
const wallHeight = 10;  // Change height
```

## Performance

- **Target**: 60 FPS on modern hardware
- **Current**: Check FPS counter in UI panel
- **If slow**: 
  - Disable shadows: Set `shadowMap.enabled = false` (line 80)
  - Reduce furniture detail in furniture methods

## Next Steps

1. ✅ Explore the apartment with mouse controls
2. ✅ Try all the view buttons
3. ✅ Toggle the fan and door animations
4. ✅ Read README.md for full documentation
5. ✅ Customize colors and furniture (optional)

## Troubleshooting

**Black screen?**
- Open browser DevTools (F12) and check Console
- Ensure Three.js loaded (check Network tab)

**Low FPS?**
- Check FPS counter in UI
- Reduce shadow quality or disable shadows
- Close other browser tabs

**Controls not working?**
- Ensure mouse is over the 3D canvas
- Try refreshing the page (F5)

**Door won't open/close?**
- Wait for current animation to finish
- Each animation takes ~1 second

## Features Demonstration

### Show All Requirements
1. **Architecture**: Use "View Overview" to see both rooms and walls
2. **Furniture**: Zoom in to see 13+ detailed furniture pieces
3. **Materials**: Notice different textures on wood, fabric, and metal
4. **Lighting**: Observe shadows and warm ceiling lamps
5. **Camera**: Smoothly navigate with OrbitControls
6. **Animations**: Toggle fan and door to see smooth movements
7. **Collision**: Try to move camera through walls (it resists)

## Technical Highlights

- **Modern ES6 Modules**: Uses import/export syntax
- **OrbitControls**: Industry-standard camera navigation
- **Shadow Mapping**: PCFSoftShadowMap for realistic shadows
- **Easing Functions**: Quadratic easing for smooth animations
- **Collision Detection**: Basic proximity checking
- **Responsive Design**: Adapts to window resizing
- **Performance Monitoring**: Real-time FPS counter

## Requirements Checklist

All requirements have been implemented:

✅ 2 distinct rooms (living + bedroom)  
✅ Walls with thickness (0.3m)  
✅ Floor and ceiling  
✅ Doorways connecting rooms  
✅ Geometric primitives used  
✅ 3-5 furniture per room (6 living, 7 bedroom)  
✅ Proper scaling and positioning  
✅ 3+ different materials (wood, fabric, metal, paint)  
✅ OrbitControls for navigation  
✅ Navigate through all rooms  
✅ Smooth camera transitions (BONUS)  
✅ Collision detection (BONUS)  
✅ Animated rotating fan  
✅ Animated swinging door  

## Support

For detailed documentation, see **README.md**.

For code modifications, edit **js/main.js**.

For styling changes, edit **css/style.css**.

---

**Enjoy your 3D apartment! 🏡✨**
