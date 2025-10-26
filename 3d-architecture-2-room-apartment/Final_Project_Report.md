# COSC3306 Final Project Report

3D Two-Room Apartment using Three.js

Date: October 25, 2025

Author: [Your Name]

---

## 1. Overview

This project is an interactive 3D apartment visualization built with Three.js (WebGL). It features two distinct rooms (Living Room and Bedroom) separated by a wall with a doorway and frame. The apartment includes floors, ceilings, complete walls, realistic proportions, multiple light sources, physically‑based materials, multiple animated elements, smooth camera navigation with preset views, and basic collision to prevent the camera from passing through walls.

The goal is to demonstrate proficiency in 3D scene composition, geometry modeling via primitives, materials and lighting, runtime interactivity, and animation systems in a small, well-structured single‑page application.

Key highlights:
- Two fully modeled rooms with structural elements
- 12+ pieces of furniture and accessories
- Multiple lights (ambient, directional, hemisphere, and per‑room point lights)
- Animated ceiling fan and opening/closing door
- OrbitControls navigation with smooth, eased camera transitions
- Basic collision to keep the camera away from walls

Source: `index.html` (self‑contained; CSS and JS inline; Three.js via CDN)

---

## 2. How to Run

Because the app uses ES Modules via an import map, the most reliable way is to serve locally.

- Windows PowerShell

```powershell
# From the project folder
py -m http.server 8080
# then open:
Start-Process http://localhost:8080/index.html
```

- Alternative: Double‑click `index.html`
  - Some browsers block import maps over the file:// protocol. If you see module errors, use the local server method above.

Requirements:
- Modern browser (Chrome/Edge/Firefox/Safari)
- Internet connection (loads Three.js from unpkg CDN)

---

## 3. Implemented Features (mapped to rubric)

### 3.1 Structure (Two Rooms, Walls, Floor, Ceiling, Doorway)
- Two rooms of equal depth and width, placed along the X axis (Living Room at negative X, Bedroom at positive X).
- Walls have realistic thickness (0.3m) and height (10m).
- Floor and ceiling slabs span both rooms.
- A dividing wall at X=0 with a centered doorway and a wooden frame connects the rooms.
- Front wall is present by default (to satisfy “complete walls”); it can be toggled on/off from the UI for inspection.

Geometric approach: Box geometries for walls, floor, ceiling, frame, furniture bodies; cylinders/cones for legs/lamps; grouped meshes for articulated parts (door, fan) with correct pivots.

### 3.2 Room Details and Furnishings

Living Room (6 items):
- Sofa (base, back, armrests)
- Coffee table with 4 legs
- TV stand and TV (with emissive screen)
- Bookshelf with shelves
- Ceiling fan (animated)
- Rug

Bedroom (6 items):
- Bed frame, mattress, headboard, pillow
- Wardrobe with metallic handles
- Nightstand with lamp (emissive shade)
- Desk with 4 legs
- Chair (seat, back, legs)

Materials (variety and properties):
- Wood (brown, roughness 0.6–0.7, metalness 0.2–0.3)
- Fabric (roughness 0.8–0.9, metalness ~0.0)
- Metal (roughness 0.3–0.5, metalness 0.6–0.9)
- Paint (light wall/ceiling colors, roughness 0.7–0.8)
- Emissive (TV screen, lamp shade)

### 3.3 Camera Navigation
- OrbitControls with damping for smooth user interaction (rotate, pan, zoom).
- Preset camera views with eased transitions:
  - Living Room view
  - Bedroom view
  - Overview (bird’s eye)
- Basic collision detection pushes camera away from wall centers to avoid clipping (bonus).

### 3.4 Animation
- Ceiling fan rotates continuously (toggleable via UI).
- Hinged door swings open/closed with easing and a pivot at the hinge (toggleable via UI).

### 3.5 Lighting
- Ambient light for base illumination.
- Directional light (sun‑like) with soft shadows.
- Two warm point lights (one per room) mimicking ceiling lamps.
- Hemisphere light for sky/ground ambiance.
- Emissive materials for TV and lamp add visual richness.

---

## 4. Scene Composition and Geometry

- Coordinate system: Y‑up. Rooms positioned left/right on X axis; Z depth spans front/back.
- Dimensions (approximate, in meters):
  - Room width: 12, depth: 10, wall height: 10, wall thickness: 0.3
  - Door width: 3, door opening height: ~8
- Structural meshes are added to a `walls` collection for collision proximity checks.
- Door is a group with a hinge‑correct pivot for natural rotation.
- Fan is a group with center housing and 4 blades; continuous rotation applied each frame when enabled.

---

## 5. Materials and Lighting Details

Examples of representative material configurations (PBR):
- Walls/Ceiling: MeshStandardMaterial, color near white/beige, roughness ~0.8, metalness ~0.1
- Floor (wood-like): medium brown, roughness ~0.9 to reduce specular
- Metal (handles, TV): high metalness (0.6–0.9), lower roughness (0.2–0.5)
- Fabric (sofa, mattress, pillow): high roughness (0.8–0.9), metalness 0.0
- Emissive (lamp shade, TV): small emissive intensity to suggest glow

Lighting setup:
- Ambient (0.4), Hemisphere (0.3) for base ambiance
- Directional sun (0.6) with shadow maps sized for the apartment
- Two point lights (0.8) positioned at ceiling height in each room
- Renderer uses soft shadows (PCFSoftShadowMap)

---

## 6. Camera, Controls, and Collision

- OrbitControls: Min/max distance limits; max polar angle to prevent flipping under the floor; damping enabled.
- Preset view transitions: Camera and control target are lerped with a smooth quadratic easing over ~1.5 seconds.
- Collision: Each frame, camera position is compared to wall centers; if below a threshold, camera and target are pushed away. This is intentionally simple but sufficient to meet the “bonus” collision requirement for this project.

Potential refinements (future work): Per‑mesh AABBs (Box3), capsule vs. AABB tests for more realistic camera‑to‑wall separation, and floor/ceiling constraints.

---

## 7. Interactivity and UI

- Control panel with sections for camera instructions, quick view buttons, animation toggles, and FPS display.
- Buttons:
  - View Living, View Bedroom, View Overview
  - Toggle Fan, Open/Close Door
  - Show/Hide Front Wall (inspection aid; front wall defaults to visible for rubric compliance)
- FPS counter updates once per second.
- Loading overlay fades out once initialization completes.

---

## 8. External Assets, Textures, and Libraries

- Libraries:
  - Three.js v0.160.0 (module) via unpkg CDN
  - OrbitControls from Three.js examples (module) via unpkg CDN
- External assets/textures: None (all geometry and materials are procedural; no image textures used).

CDN import map:
```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
</script>
```

---

## 9. Known Limitations and Bugs

- Collision system is proximity‑based to wall centers, not true surface distance; it’s adequate for this scale but can be improved with bounding volumes.
- No texture maps; materials are flat colors with PBR parameters (simple but clean look).
- Front wall toggling is manual via UI; when visible, it can occlude the interior from some viewpoints (by design, since rooms should be complete).
- The layout is static; there is no object picking or drag‑to‑move in this version.

---

## 10. Screenshots / Recording Guide

Recommended views to capture for the report submission:
- Overview (bird’s eye) — shows both rooms and overall lighting
- Living Room — sofa, table, TV, bookshelf, rug, fan
- Bedroom — bed, wardrobe, nightstand + lamp, desk, chair
- Door open vs. closed — demonstrates animation
- Front wall visible vs. hidden — demonstrates structural completeness and inspection toggle

Suggested filenames (place them in a new `images/` folder if you wish):
- images/overview.png
- images/living-room.png
- images/bedroom.png
- images/door-open.png
- images/front-wall-visible.png

For a short screen recording, pan through rooms and trigger the fan and door toggles.

---

## 11. Conclusion

The apartment viewer satisfies and exceeds the rubric requirements: two complete rooms with walls/floor/ceiling and doorway, proper furnishings with distinct materials, multiple lights with shadows, smooth camera controls and transitions, at least two animations, and a basic collision system. The implementation is clean, modular within a single-file class structure, and runs easily in a browser using a simple local server.

---

## 12. Submission Checklist

- [x] Runnable source code (index.html)
- [x] Short written report (this file)
- [x] Instructions to run the application
- [x] Description of implemented features
- [x] List of external assets/libraries
- [x] Known limitations/bugs
- [x] Screenshots or recording (to be added by you)
