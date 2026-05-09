# midnight-desert

A small animated CSS/SVG scene: a moonlit desert with palms, dunes, drifting birds, twinkling stars, and an oasis pool.

Live site: https://scx1332.github.io/midnight-desert/

## Project layout

```
.
├── index.html              # Main page
├── styles.css              # Scene CSS
├── scene.js                # Starfield + bird flocks + SVG loader
├── svgs/                   # Static SVG assets
│   ├── dune-far.svg
│   ├── dune-mid.svg
│   ├── dune-near.svg
│   ├── mound.svg
│   ├── grass-left.svg
│   ├── grass-right.svg
│   ├── palm-1.svg
│   ├── palm-2.svg
│   ├── palm-3.svg
│   ├── palm-4.svg
│   └── bird.svg
├── MidnightDesert.html     # Original single-file bundle (kept for reference)
└── .github/workflows/
    └── pages.yml           # Deploys the repo root to GitHub Pages
```

## How the SVGs are wired up

Static SVGs are loaded at runtime: each `<div data-svg="svgs/foo.svg">` gets the SVG file's contents inlined by `loadSVGs()` in `scene.js`. This keeps descendant CSS rules (e.g. `.dune-layer svg`) and animations on inner elements (e.g. the bird's `.wing` flap) working as if the markup were inline.

The starfield is a single empty `<svg id="starfield">` populated procedurally by JS.

## Running locally

Any static file server works, e.g.:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deploy

Pushes to `main` trigger `.github/workflows/pages.yml`, which uploads the repo root and publishes via GitHub Pages. The workflow can also be run manually from the Actions tab.
