// background.js — injects the animated ocean background on any page that includes this file

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-global-bg="ocean"]')) return;

  const bg = document.createElement('div');
  bg.setAttribute('data-global-bg', 'ocean');
  bg.className = 'fixed inset-0 -z-50 overflow-hidden pointer-events-none';

  bg.innerHTML = `
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]"></div>

    <!-- Blue glows -->
    <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full 
                bg-cyan-500/18 blur-[190px]"></div>

    <div class="absolute bottom-[-35%] left-1/2 -translate-x-1/2 w-[1300px] h-[1300px] rounded-full 
                bg-blue-900/45 blur-[220px]"></div>

    <!-- Wavy lines layer -->
    <div class="absolute inset-0 opacity-[0.4]">
      <!-- Wave 1: high, slow -->
      <svg class="w-full h-full animate-wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none" style="transform-origin: center top;">
        <path
          d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,138.7C672,171,768,213,864,229.3C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          fill="none"
          stroke="rgba(255,255,255,0.24)"
          stroke-width="1.2"
        />
      </svg>

      <!-- Wave 2: mid, medium speed -->
      <svg class="w-full h-full animate-wave-medium" viewBox="0 0 1440 320" preserveAspectRatio="none" style="transform-origin: center;">
        <path
          d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,229.3C840,235,960,213,1080,192C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          stroke-width="1.1"
        />
      </svg>

      <!-- Wave 3: lower, faster -->
      <svg class="w-full h-full animate-wave-fast" viewBox="0 0 1440 320" preserveAspectRatio="none" style="transform-origin: center bottom;">
        <path
          d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,234.7C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1"
        />
      </svg>

      <!-- Wave 4: deep, slow roll -->
      <svg class="w-full h-full animate-wave-deep" viewBox="0 0 1440 320" preserveAspectRatio="none" style="transform-origin: center bottom;">
        <path
          d="M0,256L80,250.7C160,245,320,235,480,224C640,213,800,203,960,208C1120,213,1280,235,1360,245.3L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
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
