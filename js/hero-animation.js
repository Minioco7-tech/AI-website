// hero-animation.js
document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("hero-section");
  if (!el) return;

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = 0; // behind hero content
  el.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // Resize canvas
  function resize() {
    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Configuration
  const POINTS = 40;
  const MAX_DISTANCE = 120;
  const SPEED = 0.5;
  const points = [];

  // Initialize points
  for (let i = 0; i < POINTS; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
    });
  }

  // Animation loop
  function animate() {
    ctx.fillStyle = "#020617"; // background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    for (let i = 0; i < POINTS; i++) {
      const p1 = points[i];
      for (let j = i + 1; j < POINTS; j++) {
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(0, 191, 255, ${1 - dist / MAX_DISTANCE})`; // #00BFFF
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw points and update positions
    for (let p of points) {
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Move points
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  animate();
});

