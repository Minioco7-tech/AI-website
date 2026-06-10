// home-header.js
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("home-header");

  if (!headerContainer) {
    console.error("Header container (#header) not found.");
    return;
  }

  headerContainer.innerHTML = `
    <header class="bg-black bg-opacity-20 backdrop-blur-lg w-full fixed top-0 left-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">  
          <!-- Logo (left) -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-[#00BFFF] to-blue-400 rounded-lg flex items-center justify-center">
              <i data-feather="zap" class="w-4 h-4 text-white"></i>
            </div>
            <span class="text-xl font-bold text-white">AIviary</span>
          </div>
    
          <!-- Right section: nav + button -->
          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center space-x-5">

            <button
              type="button"
              class="theme-switch"
              data-theme-toggle
              aria-label="Toggle colour theme"
              aria-pressed="false"
            >
              <span class="theme-switch-track">
                <span class="theme-switch-thumb"></span>
              </span>
            </button>
          
            <!-- <nav class="flex items-center space-x-4 bg-transparent"> -->
            <a href="about.html"
               class="text-white hover:text-[#00BFFF] transition-colors">
               About
            </a>
        
            <a href="favourites.html"
               class="header-icon-btn"
               aria-label="Favourite models">
              <i data-feather="heart" class="w-5 h-5"></i>
            </a>
            <!-- </nav> -->
          
            <a href="category.html?category=all"
               class="btn-primary px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition hover:scale-105">
              All Models
            </a>
          
          </div>

          <!-- Mobile Dropdown -->
          <div id="mobileMenu"
               class="hidden md:hidden flex-col gap-2 py-4 border-t border-white/10">
          
            <a href="about.html"
               class="text-white hover:text-[#00BFFF] transition-colors px-2 py-2">
               About
            </a>
          
            <a href="category.html?category=all"
               class="text-white hover:text-[#00BFFF] transition-colors px-2 py-2">
               All Models
            </a>
          
          </div>
          
          <!-- Mobile Actions -->
          <div class="flex md:hidden items-center gap-3">

            <button
              type="button"
              class="theme-switch"
              data-theme-toggle
              aria-label="Toggle colour theme"
              aria-pressed="false"
            >
              <span class="theme-switch-track">
                <span class="theme-switch-thumb"></span>
              </span>
            </button>
          
            <a href="favourites.html"
               class="header-icon-btn"
               aria-label="Favourite models">
              <i data-feather="heart" class="w-5 h-5"></i>
            </a>
          
            <button id="mobileMenuBtn" class="header-icon-btn">
              <i data-feather="menu" class="w-5 h-5"></i>
            </button>
          
          </div>

        </div>
        <!-- Subtle Separator -->
        <div class="border-t border-white border-opacity-10"></div>
      </div>
    </header>
  `;

  // Activate Feather icons after inserting header
  if (window.feather) feather.replace();

  // ------------------------------
  // Mobile Menu
  // ------------------------------
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  
  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });
});
