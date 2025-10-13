import { fetchJSON, getCategoryName, getRandomModels } from './utils.js';

// home.js — full homepage functionality
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  const modelsGrid = document.getElementById('modelsGrid');
  const loadingState = document.getElementById('loadingState');
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

  // -----------------------
  // Render category grid
  // -----------------------
  function renderCategories() {
    if (!categoryGrid) return;
    categoryGrid.innerHTML = '';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `cursor-pointer rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 shadow-lg`;
      card.innerHTML = `
        <div class="w-full h-32 bg-cover bg-center relative overflow-hidden ${cat.colorFrom} ${cat.colorTo}" 
             style="background-image: url('${cat.image}');">
          <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4">   
            <i data-feather="${cat.icon}" class="w-8 h-8 mb-2"></i>
            <span class="text-white font-semibold text-center text-sm sm:text-base md:text-sm lg:text-base break-words truncate">${cat.name}</span>
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
  // Fetch and show models
  // -----------------------
  async function fetchModels() {
    modelsData = await fetchJSON('./models.json');
    if (!modelsData.length) return;
    setupFuse();
    displayModels(getRandomModels(modelsData, 12));
    if (loadingState) loadingState.classList.add('hidden');
  }

  function displayModels(models) {
    if (!modelsGrid) return;
    modelsGrid.innerHTML = '';

    models.forEach(model => {
      const tile = document.createElement('div');
      tile.className = 'model-tile group cursor-pointer bg-black bg-opacity-20 rounded-xl overflow-hidden border border-white border-opacity-10 hover:border-opacity-30 transition-all duration-300';
      tile.innerHTML = `
        <div class="w-full h-32 bg-cover bg-center" style="background-image: url('${model.image}')"></div>
        <div class="p-3">
          <h3 class="text-white font-semibold text-sm mb-1">${model.name}</h3>
          <p class="text-gray-300 text-xs line-clamp-2">${model.description.substring(0,80)}...</p>
          <span class="text-xs px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full">${getCategoryName(model.category)}</span>
        </div>
      `;
      tile.addEventListener('click', () => {
        window.location.href = `model.html?id=${encodeURIComponent(model.id)}`;
      });
      modelsGrid.appendChild(tile);
    });
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
  fetchModels();
});
3️⃣ Update your index.html bottom scripts
Replace your old inline <script> block with these:

html
Copy code
<script src="https://unpkg.com/feather-icons"></script>
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js"></script>
<script type="module" src="js/home.js"></script>
(Notice we use type="module" because home.js imports from utils.js.)

✅ Summary of Required Edits
File	Edit	Purpose
home.js	Replace contents with the code above	Recreates old homepage logic exactly
utils.js	Add helper functions	Shared functions for categories, fetching, and randomizing
index.html	Update <script> block	Load home.js as a module

Would you like me to include the updated index.html snippet (just the bottom <script> section) or the entire file rewritten for you to copy/paste directly into GitHub Pages?





You said:
yes, does the snippet for utils.js go underneath the current code or is tat the replacemnt code for utils.js


ChatGPT said:
Perfect question — that utils.js snippet I gave you is a full replacement ✅

Here’s the reasoning:
Your utils.js file should contain only general-purpose helper functions — not page-specific logic. The snippet I gave you already includes:

JSON fetching (fetchJSON)

Category name lookup (getCategoryName)

Random model selector (getRandomModels)

Those are the core helpers that every page (home, category, search, etc.) can safely import and use.

🔧 So yes:
➡️ Replace the entire contents of your current utils.js with this:

js
Copy code
// utils.js — shared helper functions for all pages

// Fetch a JSON file safely
export async function fetchJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}:`, err);
    return [];
  }
}

// Get human-readable category name
export function getCategoryName(catKey) {
  const categories = [
    { key: 'all', name: 'All' },
    { key: 'writing', name: 'Writing' },
    { key: 'design', name: 'Design' },
    { key: 'learning', name: 'Learning' },
    { key: 'business', name: 'Business' },
    { key: 'chatbots', name: 'Chatbots' },
    { key: 'music', name: 'Music' },
    { key: 'coding', name: 'Coding' },
    { key: 'science', name: 'Science' },
    { key: 'finance', name: 'Finance' },
    { key: 'speech', name: 'Speech' },
    { key: 'health', name: 'Health' }
  ];
  const found = categories.find(c => c.key === catKey.toLowerCase());
  return found ? found.name : catKey;
}

// Get n random models
export function getRandomModels(models, n) {
  return [...models].sort(() => 0.5 - Math.random()).slice(0, n);
}
