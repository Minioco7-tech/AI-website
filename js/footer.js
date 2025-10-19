// footer.js
document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer");

  if (!footerContainer) {
    console.error("Footer container (#footer) not found.");
    return;
  }

  footerContainer.innerHTML = `
    <footer class="bg-black bg-opacity-40 backdrop-blur-xl border-t border-white border-opacity-10 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-[#00BFFF] to-blue-400 rounded-lg flex items-center justify-center">
                <i data-feather="zap" class="w-4 h-4"></i>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AIviary
              </span>
            </div>
            <p class="text-[#E0E0E0] leading-relaxed">
              Discover and explore the world's most innovative AI tools. From creative writing assistants to advanced analytics platforms, find the perfect AI companion for your needs.
            </p>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Legal</h4>
            <div class="space-y-2">
              <a href="disclaimer.html" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">Disclaimer</a>
              <a href="privacy.html" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="terms.html" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">Terms of Use</a>
              <a href="dmca.html" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">DMCA</a>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Connect</h4>
            <div class="space-y-2">
              <a href="#" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">GitHub</a>
              <a href="#" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">Twitter</a>
              <a href="#" class="block text-[#E0E0E0] hover:text-white transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>

        <div class="border-t border-white border-opacity-10 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            &copy; 2025 AIviary. All AI tools belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  `;

  // Activate Feather icons
  if (window.feather) feather.replace();
});
