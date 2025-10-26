threejs-app — Vite + TypeScript three.js starter

What this is
- A minimal Vite + TypeScript project scaffolded to begin porting the existing `BP3D` three integration into a modern build setup.

Files of interest
- `index.html` — Vite entry that loads `/src/main.ts`.
- `src/main.ts` — app entry that instantiates `ThreeMain`.
- `src/three/Main.ts` — a small TypeScript class that mirrors the original `BP3D.Three.Main` responsibilities (camera, renderer, controls, lights, floor, animation loop).
- `package.json` — scripts: `dev`, `build`, `preview`.

How to run (Windows PowerShell)

1) Install dependencies (from `threejs-app`):

```powershell
cd .\threejs-app
npm install
```

2) Start the dev server:

```powershell
npm run dev
```

This will open the app in the browser (default port 3000). The dev server supports hot module replacement.

Next steps I can take
- Continue porting `src/three/main.ts` into `src/three/Main.ts` (I started a minimal port). I can iterate to bring in event handling, HUD, controller, and model wiring.
- Add TS path aliases and move other `BP3D` modules into the new project, with tests.

If you'd like me to continue porting `BP3D.Three.Main` and wire the existing `BP3D.Model.Scene`, say “please port main.ts and wire model.scene” and I’ll proceed.
