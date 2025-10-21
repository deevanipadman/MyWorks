# Two Room Apartment — Three.js

Minimal interactive 3D apartment built for COSC3306 final project.

How to run
- Option A: Open `index.html` in a modern browser (Chrome/Edge/Firefox) — using a local server is recommended due to module imports.
- Option B (recommended): Run a simple static server in the project folder, for example with Python 3:

```ps1
# from project root (Windows PowerShell)
python -m http.server 8000
# then open http://localhost:8000 in browser
```

What is included
- `index.html` — entry page
- `src/app.js` — main scene and logic (Two rooms, furniture, lighting, OrbitControls, keyboard movement, rotating fan)
- `REPORT.md` — short report template to edit before submission

Notes
- The project uses CDN imports for Three.js modules so an internet connection is required for running unless you replace the imports with local copies.
