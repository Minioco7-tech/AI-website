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

  /* ===============================
     Adaptive Configuration
  =============================== */
  function getConfig() {
    const area = canvas.width * canvas.height;
    const minDimension = Math.min(canvas.width, canvas.height);

    const POINTS = Math.floor(area / 1000);

    return {
      POINTS: Math.min(Math.max(POINTS, 40), 120),
      MAX_DISTANCE: minDimension * 0.18,
      SPEED: minDimension / 1500
    };
  }

  /* ===============================
     Resize + Rebuild
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
     Animation Loop
  =============================== */
  function animate() {
    const { MAX_DISTANCE } = getConfig();

    // Clear background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const alpha = 0.12 + 0.23 * (1 - dist / MAX_DISTANCE);

          ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points + movement
    for (const p of points) {
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // Bounce edges
      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  animate();
});
