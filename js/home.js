// home.js
// Handles homepage logic: category loading, search, icons, navigation

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Feather icons
    feather.replace();

    // Initialize search + categories
    initSearchBar();
    await initCategories();
});

/* -------------------------------
   🧠  SEARCH BAR FUNCTIONALITY
--------------------------------*/
function initSearchBar() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to search page with query param
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
}

/* -------------------------------
   🗂️  CATEGORY LOADING / DISPLAY
--------------------------------*/
async function initCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categories = [
        { key: 'writing', name: 'Writing & Productivity', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500' },
        { key: 'design', name: 'Design & Creativity', icon: 'image', colorFrom: 'from-indigo-500', colorTo: 'to-blue-500' },
        { key: 'learning', name: 'Learning & Research', icon: 'book', colorFrom: 'from-green-500', colorTo: 'to-emerald-500' },
        { key: 'business', name: 'Business & Marketing', icon: 'briefcase', colorFrom: 'from-yellow-500', colorTo: 'to-orange-500' },
        { key: 'chatbots', name: 'Chatbots & Agents', icon: 'message-circle', colorFrom: 'from-pink-500', colorTo: 'to-rose-500' },
        { key: 'music', name: 'Music & Audio', icon: 'music', colorFrom: 'from-red-500', colorTo: 'to-pink-500' },
        { key: 'coding', name: 'Coding & Development', icon: 'code', colorFrom: 'from-cyan-500', colorTo: 'to-blue-500' },
        { key: 'science', name: 'Science & Research', icon: 'activity', colorFrom: 'from-teal-500', colorTo: 'to-green-500' },
        { key: 'finance', name: 'Finance & Data', icon: 'bar-chart-2', colorFrom: 'from-amber-500', colorTo: 'to-yellow-500' },
        { key: 'health', name: 'Health & Wellness', icon: 'heart', colorFrom: 'from-lime-500', colorTo: 'to-green-500' }
    ];

    // Display category tiles dynamically
    categoriesGrid.innerHTML = categories.map(cat => `
        <a href="category.html?category=${encodeURIComponent(cat.key)}" 
           class="group block bg-black bg-opacity-30 border border-white border-opacity-10 rounded-2xl p-6 
                  transition transform hover:scale-105 hover:bg-opacity-40 duration-300">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${cat.colorFrom} ${cat.colorTo} mb-4">
                <i data-feather="${cat.icon}" class="w-6 h-6 text-white"></i>
            </div>
            <h3 class="text-lg font-semibold mb-2">${cat.name}</h3>
            <p class="text-sm text-gray-300">Explore AI tools in ${cat.name.toLowerCase()}.</p>
        </a>
    `).join('');

    // Replace icons after injecting new elements
    feather.replace();
}
