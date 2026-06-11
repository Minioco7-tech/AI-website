document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header");

  if (!headerContainer) {
    console.error("Header container (#header) not found.");
    return;
  }

  headerContainer.innerHTML = `
    <header class="bg-black bg-opacity-20 backdrop-blur-lg w-full fixed top-0 left-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-[#00BFFF] to-blue-400 rounded-lg flex items-center justify-center">
              <i data-feather="zap" class="w-4 h-4 text-white"></i>
            </div>
            <span class="text-xl font-bold text-white">AIviary</span>
          </div>

          <!-- Search (desktop) -->
          <form id="searchForm" class="hidden sm:flex relative w-full max-w-md mx-auto">
            <input
              type="text"
              id="searchInput"
              placeholder="Search AI tools... or try 'All'"
              class="w-full px-5 py-2 pr-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                     text-white placeholder-white/60 shadow-md
                     focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-all duration-300"
            >
            <button
              type="submit"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
              aria-label="Search"
            >
              <i data-feather="search" class="w-5 h-5"></i>
            </button>
          </form>

          <!-- Nav (desktop) -->
          <!-- Desktop Nav -->
          <div id="navActions" class="hidden md:flex items-center space-x-5">

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
          
            <a href="about.html"
               class="header-nav-link">
               About
            </a>
          
            <a href="favourites.html"
               class="header-icon-btn"
               aria-label="Favourite models">
              <i data-feather="heart" class="w-5 h-5"></i>
            </a>
          
            <a href="index.html"
               class="btn-primary px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition hover:scale-105">
               Home
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

            <button id="mobileSearchIcon" class="header-icon-btn">
              <i data-feather="search" class="w-5 h-5"></i>
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
        
        <div id="mobileMenu"
             class="hidden md:hidden flex-col gap-2 py-4 border-t border-white/10">
        
          <a href="index.html"
             class="header-nav-link px-2 py-2">
             Home
          </a>
        
          <a href="about.html"
             class="header-nav-link px-2 py-2">
             About
          </a>
        </div>
        <!-- Mobile search bar -->
        <div id="mobileSearchContainer" class="sm:hidden w-full items-center gap-2 mt-3" style="display: none;">
          <button id="closeSearchBtn" class="mobile-search-close">
            <i data-feather="x"></i>
          </button>
          <input
            type="text"
            id="mobileSearchInput"
            placeholder="Search AI tools..."
            class="mobile-search-input flex-grow px-4 py-2 rounded-full"
          />
        </div>

        <div class="border-t border-white border-opacity-10 mt-2"></div>
      </div>
    </header>
  `;

  // Replace feather icons
  if (window.feather) feather.replace();
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  
  mobileMenuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });

  // Desktop search submit
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // Mobile search logic
  const mobileSearchIcon = document.getElementById("mobileSearchIcon");
  const mobileSearchContainer = document.getElementById("mobileSearchContainer");
  const closeSearchBtn = document.getElementById("closeSearchBtn");
  const mobileSearchInput = document.getElementById("mobileSearchInput");

  function showMobileSearch() {
    mobileSearchContainer.style.display = "flex"; // overrides display: none
  
    setTimeout(() => {
      mobileSearchContainer.classList.add("mobile-search-active");
    }, 10);
  
    mobileSearchInput.focus();
  }
  
  function hideMobileSearch() {
    mobileSearchContainer.classList.remove("mobile-search-active");
  
    setTimeout(() => {
      mobileSearchContainer.style.display = "none";
    }, 250);
  }

  mobileSearchIcon?.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent triggering body click
    showMobileSearch();
  });

  closeSearchBtn?.addEventListener("click", hideMobileSearch);

  // Submit from mobile input
  mobileSearchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = mobileSearchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    }
  });

  // Click outside to close
  document.body.addEventListener("click", (e) => {
    const isClickInside = mobileSearchContainer?.contains(e.target) || mobileSearchIcon?.contains(e.target);
    if (!isClickInside) hideMobileSearch();
  });
});

document.addEventListener('click', (e) => {
  if (e.target.closest('a[href="index.html"]')) {
    sessionStorage.removeItem('breadcrumbSource');
    sessionStorage.removeItem('breadcrumbCategory');
    sessionStorage.removeItem('breadcrumbSearchQuery');
  }
});
