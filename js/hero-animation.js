// hero-animation.js
// Theme-aware animated hero canvas.
// Colours are read from CSS variables so the animation follows the active theme.

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
  canvas.style.zIndex = 0;
  el.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // -----------------------------
  // Theme colour helpers
  // -----------------------------

  function getCssVar(name, fallback = "") {
    const value = getComputedStyle(document.body)
      .getPropertyValue(name)
      .trim();

    return value || fallback;
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "").trim();

    if (clean.length !== 6) {
      return { r: 0, g: 191, b: 255 };
    }

    const bigint = parseInt(clean, 16);

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function getThemeColours() {
    const pointColour = getCssVar("--color-hero-particle", getCssVar("--color-accent", "#00BFFF"));
    const lineColour = getCssVar("--color-hero-particle-line", pointColour);

    return {
      point: pointColour,
      lineRgb: hexToRgb(lineColour)
    };
  }

  let themeColours = getThemeColours();

  window.addEventListener("aiviary-theme-change", () => {
    themeColours = getThemeColours();
  });

  // -----------------------------
  // Canvas sizing
  // -----------------------------

  function resize() {
    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // -----------------------------
  // Animation config
  // -----------------------------

  function getConfig() {
    const w = canvas.width;
    const isMobile = w < 768;

    let POINTS;

    if (isMobile) {
      POINTS = Math.floor(35 + w / 8);
    } else {
      POINTS = Math.min(160, Math.floor(80 + (w - 768) / 12));
    }

    return {
      POINTS,
      MAX_DISTANCE: isMobile ? 110 : 160,
      BASE_SPEED: isMobile ? 0.25 : 0.5
    };
  }

  const { POINTS, MAX_DISTANCE, BASE_SPEED } = getConfig();

  // -----------------------------
  // Point generation
  // -----------------------------

  const points = [];

  for (let i = 0; i < POINTS; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * BASE_SPEED,
      vy: (Math.random() - 0.5) * BASE_SPEED
    });
  }

  // -----------------------------
  // Time tracking
  // -----------------------------

  let lastTime = performance.now();

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      lastTime = performance.now();
    }
  });

  // -----------------------------
  // Animation loop
  // -----------------------------

  function animate(time) {
    let deltaTime = (time - lastTime) / 16.6667;

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
          const opacity = 0.5 * (1 - dist / MAX_DISTANCE);

          ctx.strokeStyle = `rgba(${themeColours.lineRgb.r}, ${themeColours.lineRgb.g}, ${themeColours.lineRgb.b}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw points and update positions
    for (const p of points) {
      ctx.fillStyle = themeColours.point;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
