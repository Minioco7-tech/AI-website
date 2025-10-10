// ------------------------------
// Category Page JS
// ------------------------------

const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');

// Global array to store currently displayed models
let currentModels = [];

// Categories array
const categories = [
    { key: 'all', name: 'All Models' },
    { key: 'writing', name: 'Writing & Productivity' },
    { key: 'creativity', name: 'Creativity & Design' },
    { key: 'learning', name: 'Learning & Research' },
    { key: 'business', name: 'Business & Marketing' },
    { key: 'chatbots', name: 'Chatbots & Agents' },
    { key: 'audio', name: 'Audio & Music' },
    { key: 'coding', name: 'Coding & Dev Tools' },
    { key: 'science', name: 'Science & Health' },
    { key: 'finance', name: 'Finance & Analytics' },
    { key: 'everyday', name: 'Everyday Life' }
];

// Get category name from key
function getCategoryName(catKey) {
    const map = {};
    categories.forEach(c => map[c.key.toLowerCase()] = c.name);
    return map[catKey.toLowerCase()] || catKey;
}

// Get category from URL
function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
}

// ------------------------------
// Helper Functions
// ------------------------------

// Display models in the grid
function displayModels(models) {
    modelsGrid.innerHTML = '';
    modelsGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
    models.forEach(model => {
        const card = document.createElement('a');
        card.className = 'model-tile bg-black bg-opacity-30 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300 border border-white border-opacity-10';
        card.innerHTML = `
            <div class="w-full h-40 bg-cover bg-center" style="background-image: url('${model.image}')"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${model.name}</h3>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">${model.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>${getCategoryName(model.category)}</span>
                </div>
            </div>
        `;
        modelsGrid.appendChild(card);
    });
}

// Sort models by criteria
function sortModels(models, criteria) {
    const sorted = [...models];
    switch(criteria) {
        case 'az':
            sorted.sort((a,b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            sorted.sort((a,b) => b.name.localeCompare(a.name));
            break;
        case 'relevance':
        default:
            break;
    }
    return sorted;
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ------------------------------
// Fetch Models
// ------------------------------
async function loadCategoryModels() {
    const categoryKey = getCategoryFromUrl();
    categoryTitle.textContent = getCategoryName(categoryKey);

    try {
        const response = await fetch('./models.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const modelsData = await response.json();

        const filteredModels = categoryKey.toLowerCase() === 'all'
            ? modelsData
            : modelsData.filter(m => m.category.toLowerCase() === categoryKey.toLowerCase());

        currentModels = filteredModels;
        displayModels(currentModels);
        loadingState.classList.add('hidden');
    } catch(err) {
        console.error('Failed to load models:', err);
        loadingState.innerHTML = '<p class="text-red-400 text-lg mt-6">Failed to load models. Please refresh.</p>';
    }
}

// ------------------------------
// Event Listeners
// ------------------------------
sortBySelect.addEventListener('change', () => {
    if (!currentModels.length) return;
    const sortedModels = sortModels(currentModels, sortBySelect.value);
    displayModels(sortedModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
    if (!currentModels.length) return;
    currentModels = shuffleArray(currentModels);
    modelsGrid.innerHTML = '';
    requestAnimationFrame(() => {
        displayModels(currentModels);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { document.body.style.transform = 'translateZ(0)'; }, 100);
    });
});

// ------------------------------
// Initialize
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadCategoryModels();
    feather.replace();
});
