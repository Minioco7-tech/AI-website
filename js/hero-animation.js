// js/hero-animation.js

window.addEventListener("load", () => {
  const hero = document.getElementById("hero-section");
  if (!hero) {
    console.warn("Hero section not found");
    return;
  }

  // Ensure hero is positioning context
  hero.style.position = "relative";

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "1"; // below overlay (10) and content (20)
  canvas.style.pointerEvents = "none";

  hero.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // Resize handling
  function resize() {
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resize();
  window.addEventListener("resize", resize);

  // Network configuration
  const POINT_COUNT = 48;
  const MAX_DISTANCE = 130;
  const SPEED = 0.35;
  const points = [];

  // Create points
  for (let i = 0; i < POINT_COUNT; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < MAX_DISTANCE) {
          const alpha = 0.25 * (1 - dist / MAX_DISTANCE);
          ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points
    for (const p of points) {
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  animate();
});
