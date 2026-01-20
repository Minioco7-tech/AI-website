// hero-animation.js
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("hero-section");
  if (!el) return;

  /* ===============================
     Canvas Setup
  =============================== */
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  el.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let points = [];
  let lastWidth = 0;
  let lastHeight = 0;

  /* ===============================
     Responsive Configuration
  =============================== */
  function getConfig() {
    const w = canvas.width;
    const h = canvas.height;
    const isMobile = w < 768;

    return {
      POINTS: isMobile
        ? Math.floor(w / 6)       // mobile: controlled, clean
        : Math.floor(w / 3),      // desktop: much denser

      MAX_DISTANCE: isMobile ? 110 : 160,
      SPEED: isMobile ? 0.35 : 0.45
    };
  }

  /* ===============================
     Resize (NO REBUILD)
  =============================== */
  function resize() {
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    canvas.width = w;
    canvas.height = h;

    if (!lastWidth || !lastHeight) {
      lastWidth = w;
      lastHeight = h;
      buildPoints();
      return;
    }

    // Scale positions instead of recreating points
    const sx = w / lastWidth;
    const sy = h / lastHeight;

    points.forEach(p => {
      p.x *= sx;
      p.y *= sy;
    });

    lastWidth = w;
    lastHeight = h;
  }

  /* ===============================
     Build Points (ONCE)
  =============================== */
  function buildPoints() {
    points = [];
    const { POINTS, SPEED } = getConfig();

    for (let i = 0; i < POINTS; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED
      });
    }
  }

  resize();
  window.addEventListener("resize", () => {
    clearTimeout(window.__heroResize);
    window.__heroResize = setTimeout(resize, 120);
  });

  /* ===============================
     Animation Loop (single RAF)
  =============================== */
  function animate() {
    const { MAX_DISTANCE } = getConfig();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < MAX_DISTANCE) {
          const alpha = 0.18 + 0.32 * (1 - dist / MAX_DISTANCE);
          ctx.strokeStyle = `rgba(0,191,255,${alpha})`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Points
    for (const p of points) {
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  animate();
});
