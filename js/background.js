// background.js — injects page-specific backgrounds

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  // Prevent duplicates
  if (document.querySelector('[data-global-bg]')) return;

  // === 1) HOME PAGE — black background only ==========
  if (page === 'home') {
    const bg = document.createElement('div');
    bg.setAttribute('data-global-bg', 'black');
    bg.className = 'fixed inset-0 -z-50 bg-black pointer-events-none';
    document.body.prepend(bg);
    return;
  }

  // === 2) CATEGORY + MODEL PAGES — the blue + waves background =====
  if (page === 'category' || page === 'model') {
    const bg = document.createElement('div');
    bg.setAttribute('data-global-bg', 'ocean');
    bg.className = 'fixed inset-0 -z-50 overflow-hidden pointer-events-none';

    bg.innerHTML = `
      <!-- Blue gradient base -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]"></div>

      <!-- Blue glows -->
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1300px] h-[1300px] rounded-full 
                  bg-cyan-500/18 blur-[190px]"></div>

      <div class="absolute bottom-[-35%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] rounded-full 
                  bg-blue-900/45 blur-[230px]"></div>

      <!-- Wavy lines -->
      <div class="absolute inset-0 opacity-[0.35]">

        <div class="ocean-wave ocean-wave--top">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,138.7C672,171,768,213,864,229.3C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,0..."
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              stroke-width="1.3"
            />
          </svg>
        </div>

        <div class="ocean-wave ocean-wave--mid">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,192L60,186.7C120,181,240,171..."
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              stroke-width="1.1"
            />
          </svg>
        </div>

        <div class="ocean-wave ocean-wave--deep">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,256L80,250.7C160,245,320,235..."
              fill="none"
              stroke="rgba(255,255,255,0.20)"
              stroke-width="1"
            />
          </svg>
        </div>

      </div>
    `;

    document.body.prepend(bg);
  }
});
