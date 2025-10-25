import { fetchJSON, modelHasCategory } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const categoryGrid = document.getElementById('categoryGrid');
  const searchForm = document.getElementById('searchForm');

  // Define categories to display
  const categories = [
    { key: 'all', name: 'All', icon: 'globe', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/all/all.webp' },
    { key: 'productivity', name: 'Productivity', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/writing/writing.webp' },
    { key: 'design', name: 'Design', icon: 'pen-tool', colorFrom: 'from-green-400', colorTo: 'to-blue-500', image: 'Images/design/design.webp' },
    { key: 'learning', name: 'Learning', icon: 'book', colorFrom: 'from-yellow-400', colorTo: 'to-orange-500', image: 'Images/learning/learning.webp' },
    { key: 'business', name: 'Business', icon: 'briefcase', colorFrom: 'from-indigo-400', colorTo: 'to-purple-500', image: 'Images/business/business.webp' },
    { key: 'chatbots', name: 'Chatbots', icon: 'message-circle', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'Images/chatbots/chatbot.webp' },
    { key: 'audio', name: 'Audio', icon: 'volume-2', colorFrom: 'from-teal-400', colorTo: 'to-blue-400', image: 'Images/music/music.webp' },
    { key: 'coding', name: 'Coding', icon: 'code', colorFrom: 'from-blue-400', colorTo: 'to-indigo-500', image: 'Images/coding/coding.webp' },
    { key: 'science', name: 'Science', icon: 'cpu', colorFrom: 'from-red-400', colorTo: 'to-yellow-500', image: 'Images/science/science.webp' },
    { key: 'documents', name: 'Documents', icon: 'file-text', colorFrom: 'from-green-400', colorTo: 'to-teal-500', image: 'Images/finance/finance.webp' },
    { key: 'spreadsheets', name: 'Spreadsheets', icon: 'grid', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'Images/speech/speech.webp' }
  ];

  // Load models and display category tiles
  async function loadModelsAndRenderCategories() {
    try {
      const models = await fetchJSON('./models.json');

      // Filter categories that actually have related models
      const categoriesWithModels = categories.filter(cat => {
        if (cat.key === 'all') return true;
        return models.some(model => modelHasCategory(model, cat.key));
      });

      renderCategoryTiles(categoriesWithModels);
    } catch (err) {
      console.error('Error loading models or rendering categories:', err);
    }
  }

  function renderCategoryTiles(categories) {
    categoryGrid.innerHTML = '';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'model-tile rounded-lg overflow-hidden transition transform duration-300 cursor-pointer border border-white border-opacity-10';

      card.innerHTML = `
        <div class="thumb-wrapper rounded-lg overflow-hidden p-1">
          <div class="thumb bg-cover bg-center w-full h-full rounded-lg transition-transform duration-300"
               style="background-image: url('${cat.image}');"></div>
        </div>
        <div class="p-4">
          <div class="flex flex-col items-center text-center">
            <div class="icon-circle bg-gradient-to-r ${cat.colorFrom} ${cat.colorTo} rounded-full p-3 mb-3 flex items-center justify-center">
              <i data-feather="${cat.icon}" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-semibold">${cat.name}</h3>
            <p>${cat.description || 'Explore tools in this category.'}</p>
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

  // Search form redirect
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  loadModelsAndRenderCategories();
});
