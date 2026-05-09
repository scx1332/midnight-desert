(function () {
  // ---------- LOAD EXTERNAL SVGs ----------
  // Each [data-svg] element gets the contents of its svg file inlined,
  // so descendant CSS selectors and animations (e.g. .bird .wing) keep working.
  async function loadSVGs() {
    const svgCache = new Map();
    async function fetchSVG(url) {
      if (!svgCache.has(url)) svgCache.set(url, fetch(url).then((r) => r.text()));
      return svgCache.get(url);
    }
    const els = document.querySelectorAll('[data-svg]');
    await Promise.all(
      Array.from(els).map(async (el) => {
        try {
          el.innerHTML = await fetchSVG(el.dataset.svg);
        } catch (err) {
          console.error('Failed to load', el.dataset.svg, err);
        }
      })
    );
  }

  // ---------- STARFIELD ----------
  function buildStarfield() {
    const sf = document.getElementById('starfield');
    if (!sf) return;
    const W = 1600, H = 900;
    const NS = 'http://www.w3.org/2000/svg';
    const NUM = 180;
    for (let i = 0; i < NUM; i++) {
      const x = Math.random() * W;
      // Stars get sparser near horizon; bias upward
      const yPct = Math.pow(Math.random(), 1.6); // 0 (top) bias
      const y = yPct * H * 0.78; // keep above horizon
      const r = Math.random() < 0.92 ? Math.random() * 1.1 + 0.3 : Math.random() * 1.8 + 1.2;
      const o = Math.random() * 0.6 + 0.35;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x.toFixed(1));
      c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('r', r.toFixed(2));
      c.setAttribute('class', 'star');
      c.setAttribute(
        'style',
        `--o:${o.toFixed(2)};opacity:${o};` +
          `animation: twinkle ${(2 + Math.random() * 5).toFixed(2)}s ease-in-out ${(Math.random() * 4).toFixed(2)}s infinite;`
      );
      sf.appendChild(c);
    }
    // A couple of brighter "diamond" stars
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H * 0.5 + 40;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x.toFixed(1));
      c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('r', 1.6);
      c.setAttribute('fill', '#fff');
      c.setAttribute(
        'style',
        `filter: drop-shadow(0 0 4px rgba(255,255,255,0.9)); animation: twinkle ${(3 + Math.random() * 3).toFixed(2)}s ease-in-out infinite;`
      );
      sf.appendChild(c);
    }
  }

  // ---------- BIRDS ----------
  // Flock parameters: top%, sizePx, durationS, delayS, count, gap, opacity, flapDur
  const FLOCKS = [
    { top: 14, size: 44, dur: 95,  delay:    0, count: 3, gap: 52, opacity: 0.85, flapDur: 1.6 },
    { top: 22, size: 32, dur: 130, delay:  -28, count: 4, gap: 44, opacity: 0.7,  flapDur: 1.9 },
    { top: 30, size: 24, dur: 160, delay:  -65, count: 2, gap: 36, opacity: 0.55, flapDur: 2.2 },
    { top: 18, size: 20, dur: 185, delay: -110, count: 3, gap: 32, opacity: 0.45, flapDur: 2.4 },
    { top: 38, size: 28, dur: 150, delay:  -50, count: 2, gap: 40, opacity: 0.5,  flapDur: 2.0 },
  ];

  async function buildBirds() {
    const birdsRoot = document.getElementById('birds');
    if (!birdsRoot) return;
    const birdSVG = await fetch('svgs/bird.svg').then((r) => r.text());

    FLOCKS.forEach((f) => {
      for (let i = 0; i < f.count; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'bird-flock';
        const jitterY = (Math.random() - 0.5) * 18;
        const offsetX = -i * f.gap;
        wrap.style.top = `calc(${f.top}% + ${jitterY}px)`;
        wrap.style.left = `${offsetX}px`;
        wrap.style.width = f.size + 'px';
        wrap.style.height = f.size * 0.45 + 'px';
        wrap.style.opacity = f.opacity;
        wrap.style.animation = `flyAcross ${f.dur}s linear ${f.delay - i * 0.4}s infinite`;

        const bird = document.createElement('div');
        bird.className = 'bird';
        bird.innerHTML = birdSVG;
        const wing = bird.querySelector('.wing');
        if (wing) {
          wing.style.animationDuration = (f.flapDur + (Math.random() * 0.4 - 0.2)).toFixed(2) + 's';
          wing.style.animationDelay = (-Math.random() * 1.5).toFixed(2) + 's';
        }
        wrap.appendChild(bird);
        birdsRoot.appendChild(wrap);
      }
    });
  }

  // ---------- BOOT ----------
  document.addEventListener('DOMContentLoaded', async () => {
    await loadSVGs();
    buildStarfield();
    await buildBirds();
  });
})();
