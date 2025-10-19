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
          <!-- Left: Logo -->
          <a href="index.html" class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-[#00BFFF] to-blue-400 rounded-lg flex items-center justify-center">
              <i data-feather="zap" class="w-4 h-4"></i>
            </div>
            <span class="text-xl font-bold text-white">AIviary</span>
          </a>
    
          <!-- Right: All Models + Sort + Random -->
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
        <!-- Subtle Separator -->
        <div class="border-t border-white border-opacity-10"></div>
      </div>
    </header>
  `;

  // Activate Feather icons after inserting header
  if (window.feather) feather.replace();
});





    
