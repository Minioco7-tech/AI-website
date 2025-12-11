// background.js — injects the animated ocean background on any page that includes this file

document.addEventListener('DOMContentLoaded', () => {
  // Avoid adding it twice if something re-runs
  if (document.querySelector('[data-global-bg="ocean"]')) return;

  const bg = document.createElement('div');
  bg.setAttribute('data-global-bg', 'ocean');
  bg.className = 'fixed inset-0 -z-50 overflow-hidden pointer-events-none';

  bg.innerHTML = `
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]"></div>

    <!-- Blue glow -->
    <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full 
                bg-cyan-500/15 blur-[180px]"></div>

    <!-- Deeper blue at bottom -->
    <div class="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full 
                bg-blue-900/40 blur-[200px]"></div>

    <!-- Wavy lines layer -->
    <div class="absolute inset-0 opacity-[0.25]">
      <!-- Wave 1 (slow) -->
      <svg class="w-full h-full animate-wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,229.3C840,235,960,213,1080,192C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          stroke-width="1.2"
        />
      </svg>

      <!-- Wave 2 (faster, offset) -->
      <svg class="w-full h-full animate-wave-fast" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,234.7C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          stroke-width="1"
        />
      </svg>
    </div>
  `;

  // Insert at the top of <body> so everything else sits above it
  document.body.prepend(bg);
});
