import { fetchJSON, getCategoryName, getRandomModels } from './utils.js';

// home.js — full homepage functionality
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  const searchInput = document.getElementById('searchInput');
  const allModelsBtn = document.getElementById('allModelsBtn');
  const categoryGrid = document.getElementById('categoryGrid');

  let modelsData = [];
  let fuse;

  // Animate "All Models" button
  if (allModelsBtn) {
    allModelsBtn.addEventListener('click', e => {
      e.preventDefault();
      allModelsBtn.classList.add('scale-110');
      setTimeout(() => {
        allModelsBtn.classList.remove('scale-110');
        window.location.href = allModelsBtn.href;
      }, 150);
    });
  }

  // Categories
  const categories = [
    { key: 'all', name: 'All', icon: 'globe', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'image-AI.jpg' },
    { key: 'writing', name: 'Writing', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'image-AI.jpg' },
    { key: 'design', name: 'Design', icon: 'pen-tool', colorFrom: 'from-green-400', colorTo: 'to-blue-500', image: 'image-AI.jpg' },
    { key: 'learning', name: 'Learning', icon: 'book', colorFrom: 'from-yellow-400', colorTo: 'to-orange-500', image: 'image-AI.jpg' },
    { key: 'business', name: 'Business', icon: 'briefcase', colorFrom: 'from-indigo-400', colorTo: 'to-purple-500', image: 'image-AI.jpg' },
    { key: 'chatbots', name: 'Chatbots', icon: 'message-circle', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'image-AI.jpg' },
    { key: 'music', name: 'Music', icon: 'volume-2', colorFrom: 'from-teal-400', colorTo: 'to-blue-400', image: 'image-AI.jpg' },
    { key: 'coding', name: 'Coding', icon: 'code', colorFrom: 'from-blue-400', colorTo: 'to-indigo-500', image: 'image-AI.jpg' },
    { key: 'science', name: 'Science', icon: 'cpu', colorFrom: 'from-red-400', colorTo: 'to-yellow-500', image: 'image-AI.jpg' },
    { key: 'finance', name: 'Finance', icon: 'bar-chart-2', colorFrom: 'from-green-400', colorTo: 'to-teal-500', image: 'image-AI.jpg' },
    { key: 'speech', name: 'Speech', icon: 'smile', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'image-AI.jpg' },
    { key: 'health', name: 'Health', icon: 'heart', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'image-AI.jpg' }
  ];

 // Render homepage categories grid
 function renderCategories() {
    if (!categoryGrid) return;
    categoryGrid.innerHTML = '';
    categoryGrid.className = 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'';
  
    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `
        model-tile bg-black bg-opacity-30 rounded-xl overflow-hidden 
        border border-white border-opacity-10 transition transform duration-300 cursor-pointer
      `;
  
      card.innerHTML = `
        <div class="w-full h-40 bg-cover bg-center" style="background-image: url('${cat.image}')"></div>
          <div class="p-4">
            <div class="flex flex-col items-center justify-center text-center">
              <div class="bg-gradient-to-r ${cat.colorFrom} ${cat.colorTo} rounded-full p-3 mb-3 flex items-center justify-center">
                <i data-feather="${cat.icon}" class="w-5 h-5"></i>
              </div>
              <h3 class="text-lg font-semibold">${cat.name}</h3>
            </div>
          </div>
        `;
  
      card.addEventListener('click', () => {
        window.location.href = `category.html?category=${encodeURIComponent(cat.key)}`;
      });
  
      categoryGrid.appendChild(card);
    });
  
    feather.replace();
  }
  // -----------------------
  // Fuzzy Search (Fuse.js)
  // -----------------------
  function setupFuse() {
    fuse = new Fuse(modelsData, {
      keys: ['name', 'description', 'category'],
      threshold: 0.4,
      ignoreLocation: true,
      isCaseSensitive: false
    });
  }

  // -----------------------
  // Search input
  // -----------------------
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // -----------------------
  // Initialize
  // -----------------------
  renderCategories();
});
