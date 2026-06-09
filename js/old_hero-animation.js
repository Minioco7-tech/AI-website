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

  // Config function: returns number of points, max distance, base speed
  function getConfig() {
    const w = canvas.width;
    const isMobile = w < 768;

    let POINTS;
    if (isMobile) {
      POINTS = Math.floor(35 + w / 8); // mobile dot count
    } else {
      POINTS = Math.min(160, Math.floor(80 + (w - 768) / 12)); // desktop dot count
    }

    return {
      POINTS,
      MAX_DISTANCE: isMobile ? 110 : 160,
      BASE_SPEED: isMobile ? 0.25 : 0.5 // mobile slowed to 1/3, desktop increased 4x
    };
  }

  const { POINTS, MAX_DISTANCE, BASE_SPEED } = getConfig();

  // Initialize points
  const points = [];
  for (let i = 0; i < POINTS; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * BASE_SPEED,
      vy: (Math.random() - 0.5) * BASE_SPEED
    });
  }

  // Track previous timestamp for deltaTime
  let lastTime = performance.now();

  // Reset lastTime when tab becomes visible to prevent huge jumps
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      lastTime = performance.now();
    }
  });

  // Animation loop
  function animate(time) {
    let deltaTime = (time - lastTime) / 16.6667; // normalize to ~60fps
    // Cap deltaTime to prevent jumps after tab inactivity
    if (deltaTime > 5) deltaTime = 5;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    for (let i = 0; i < POINTS; i++) {
      const p1 = points[i];
      for (let j = i + 1; j < POINTS; j++) {
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(0, 191, 255, ${0.5 * (1 - dist / MAX_DISTANCE)})`; // brighter lines
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

      // Move points with deltaTime to prevent scroll fast-forward bug
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
