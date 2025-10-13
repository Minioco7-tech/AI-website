// home.js — main homepage logic
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏠 Home.js loaded');

  // Initialize Feather icons after everything loads
  if (window.feather) feather.replace();

  // ==============================
  // CATEGORY GRID SETUP
  // ==============================
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (!categoriesGrid) {
    console.error('⚠️ No element with id="categoriesGrid" found.');
    return;
  }

  // Define categories (same as in your previous HTML setup)
  const categories = [
    { key: 'writing', name: 'Writing & Productivity', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500' },
    { key: 'design', name: 'Design & Creativity', icon: 'image', colorFrom: 'from-blue-500', colorTo: 'to-cyan-400' },
    { key: 'learning', name: 'Learning & Research', icon: 'book-open', colorFrom: 'from-green-500', colorTo: 'to-lime-400' },
    { key: 'business', name: 'Business & Marketing', icon: 'briefcase', colorFrom: 'from-yellow-500', colorTo: 'to-orange-400' },
    { key: 'chatbots', name: 'Chatbots & Assistance', icon: 'message-circle', colorFrom: 'from-pink-500', colorTo: 'to-rose-400' },
    { key: 'music', name: 'Music & Audio', icon: 'music', colorFrom: 'from-indigo-500', colorTo: 'to-blue-400' },
    { key: 'coding', name: 'Coding & Development', icon: 'code', colorFrom: 'from-emerald-500', colorTo: 'to-teal-400' },
    { key: 'science', name: 'Science & Data', icon: 'activity', colorFrom: 'from-cyan-500', colorTo: 'to-blue-400' },
    { key: 'finance', name: 'Finance & Analytics', icon: 'bar-chart-2', colorFrom: 'from-amber-500', colorTo: 'to-yellow-400' },
    { key: 'health', name: 'Health & Wellness', icon: 'heart', colorFrom: 'from-red-500', colorTo: 'to-pink-500' },
    { key: 'all', name: 'All Catalogues', icon: 'grid', colorFrom: 'from-gray-400', colorTo: 'to-gray-600' }
  ];

  // Optional: Fetch models.json if you want to show counts per category
  let models = [];
  try {
    const res = await fetch('./models.json');
    if (res.ok) {
      models = await res.json();
      console.log(`📦 Loaded ${models.length} models.`);
    } else {
      console.warn('⚠️ models.json not found or failed to load.');
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch models.json:', err);
  }

  // Helper: count models in each category
  function getModelCount(catKey) {
    if (!models.length) return '';
    if (catKey === 'all') return `${models.length} models`;
    const count = models.filter(m => m.category.toLowerCase() === catKey.toLowerCase()).length;
    return `${count} model${count !== 1 ? 's' : ''}`;
  }

  // Render each category as a tile
  categoriesGrid.innerHTML = '';
  categories.forEach(cat => {
    const tile = document.createElement('a');
    tile.href = cat.key === 'all'
      ? 'search.html?q=all'
      : `category.html?cat=${encodeURIComponent(cat.key)}`;
    tile.className =
      `block rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 
       bg-gradient-to-br ${cat.colorFrom} ${cat.colorTo} p-[2px]`;

    tile.innerHTML = `
      <div class="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col h-full justify-between backdrop-blur-sm border border-white border-opacity-10">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
            <i data-feather="${cat.icon}" class="w-6 h-6 text-white"></i>
          </div>
          <h3 class="text-lg font-semibold">${cat.name}</h3>
        </div>
        <p class="text-sm text-gray-300 mt-3">${getModelCount(cat.key)}</p>
      </div>
    `;
    categoriesGrid.appendChild(tile);
  });

  // Refresh icons now that tiles are added
  if (window.feather) feather.replace();

  console.log('✅ Categories rendered successfully.');
});
