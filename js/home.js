// home.js — Optimized homepage functionality
import { fetchJSON, getCategoryName, getRandomModels } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons once
  feather.replace({ width: 20, height: 20 });

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

  // Categories data
  const categories = [
    { key: 'all', name: 'All', icon: 'globe', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/all/all.webp' },
    { key: 'writing', name: 'Writing', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/writing/writing.webp' },
    { key: 'design', name: 'Design', icon: 'pen-tool', colorFrom: 'from-green-400', colorTo: 'to-blue-500', image: 'Images/design/design.webp' },
    { key: 'learning', name: 'Learning', icon: 'book', colorFrom: 'from-yellow-400', colorTo: 'to-orange-500', image: 'Images/learning/learning.webp' },
    { key: 'business', name: 'Business', icon: 'briefcase', colorFrom: 'from-indigo-400', colorTo: 'to-purple-500', image: 'Images/business/business.webp' },
    { key: 'chatbots', name: 'Chatbots', icon: 'message-circle', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'Images/chatbots/chatbot.webp' },
    { key: 'music', name: 'Music', icon: 'volume-2', colorFrom: 'from-teal-400', colorTo: 'to-blue-400', image: 'Images/music/music.webp' },
    { key: 'coding', name: 'Coding', icon: 'code', colorFrom: 'from-blue-400', colorTo: 'to-indigo-500', image: 'Images/coding/coding.webp' },
    { key: 'science', name: 'Science', icon: 'cpu', colorFrom: 'from-red-400', colorTo: 'to-yellow-500', image: 'Images/science/science.webp' },
    { key: 'finance', name: 'Finance', icon: 'bar-chart-2', colorFrom: 'from-green-400', colorTo: 'to-teal-500', image: 'Images/finance/finance.webp' },
    { key: 'speech', name: 'Speech', icon: 'smile', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'Images/speech/speech.webp' },
    { key: 'health', name: 'Health', icon: 'heart', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'Images/health/health.webp' }
  ];

  // -----------------------
  // Render Categories with Lazy Loading
  // -----------------------
  function renderCategories() {
    if (!categoryGrid) return;
    categoryGrid.innerHTML = '';
    categoryGrid.className = 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'model-tile bg-[#2A2A2A] rounded-lg overflow-hidden transition transform duration-300 cursor-pointer border border-white border-opacity-10';

      // Lazy-load category image via data-bg attribute
      card.innerHTML = `
        <div class="thumb-wrapper rounded-lg overflow-hidden p-4 bg-[#2A2A2A]">
          <div class="thumb bg-cover bg-center w-full h-full rounded-lg transition-transform duration-300"
               style="background-image: url('${cat.image}');">
          </div>
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

    // Lazy-load images using IntersectionObserver
    const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    lazyBackgrounds.forEach(el => observer.observe(el));

    // Replace Feather icons once after adding all tiles
    feather.replace({ width: 20, height: 20 });
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
  // Search input handler
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
  // Initialize homepage
  // -----------------------
  renderCategories();
});
