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
          <!-- Logo (left) -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-[#00BFFF] to-blue-400 rounded-lg flex items-center justify-center">
              <i data-feather="zap" class="w-4 h-4 text-white"></i>
            </div>
            <span class="text-xl font-bold text-white">AIviary</span>
          </div>

          <!-- Search Bar (centered) -->
          <form id="searchForm" class="relative w-full max-w-md mx-auto">
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
    
          <!-- Right section: nav + button -->
          <div class="flex items-center space-x-6">
            <!-- Nav links -->
            <nav class="flex space-x-4 backdrop-blur-lg px-4 py-1 rounded-lg flex-row md:space-x-4 space-y-2 md:space-y-0">
              <a href="about.html" class="text-white hover:text-[#00BFFF] transition-colors">About</a>
            </nav>
    
            <!-- All Models Button -->
            <a href="index.html?" class="btn-primary px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition hover:scale-105">
              Home
            </a>
          </div>

        </div>
        <!-- Subtle Separator -->
        <div class="border-t border-white border-opacity-10"></div>
      </div>
    </header>
  `;
  // Feather icons
  if (window.feather) feather.replace();

  // Search logic: navigate to search page with query
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
});
  
  



    
