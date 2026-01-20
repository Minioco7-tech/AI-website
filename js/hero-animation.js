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
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  el.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let points = [];
  let lastTime = performance.now();

  /* ===============================
     Density & Speed Config
  =============================== */
  function getConfig() {
    const w = canvas.width;
    const h = canvas.height;
    const isMobile = w < 768;

    let POINTS;
    if (isMobile) {
      POINTS = Math.floor(35 + w / 8); // mobile: enough points but not overcrowded
    } else {
      POINTS = Math.min(160, Math.floor(80 + (w - 768) / 12)); // desktop: capped
    }

    return {
      POINTS,
      MAX_DISTANCE: isMobile ? 110 : 160,
      SPEED: isMobile ? 0.035 : 0.045
    };
  }

  /* ===============================
     Resize & Init Points
  =============================== */
  function resize() {
    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;

    const { POINTS, SPEED } = getConfig();
    points = [];

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
  window.addEventListener("resize", resize);

  /* ===============================
     Animation Loop with Delta Time
  =============================== */
  function animate(now) {
    const deltaTime = (now - lastTime) / 16; // normalize to ~60fps
    lastTime = now;

    const { MAX_DISTANCE } = getConfig();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < MAX_DISTANCE) {
          // brighter baseline alpha
          const alpha = 0.18 + 0.32 * (1 - dist / MAX_DISTANCE);
          ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points and update positions with delta
    for (const p of points) {
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});

