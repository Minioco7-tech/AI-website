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

// Display models in the grid
function displayModels(models) {
    modelsGrid.innerHTML = '';
    modelsGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
    
    models.forEach(model => {
        const card = document.createElement('a');
        card.className = 'odel-tile flex flex-col h-full bg-[#2A2A2A] rounded-lg overflow-hidden transition transform duration-300 cursor-pointer border border-white border-opacity-10';
        
        card.innerHTML = `
            <a href="model.html?id=${encodeURIComponent(model.name)}" class="block bg-[#1a1f25] hover:bg-[#222831] transition-all rounded-xl overflow-hidden group"> 
                <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-lg" style="background-image: url('${model.image}')"></div>
                <div class="flex flex-col flex-1 p-4">
                    <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
                    <p class="textgray-200 dark:text-gray-300 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
                    <div class="flex flex-wrap gap-2 mt-auto">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-black/20 text-white">${getCategoryName(model.category)}</span>
                    </div>
                </div>
            </a>
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
    if(document.getElementById('categoryTitle')) document.getElementById('categoryTitle').textContent = getCategoryName(categoryKey);

    try {
        const response = await fetch('./models.json');
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const modelsData = await response.json();

        const filteredModels = categoryKey.toLowerCase() === 'all'
            ? modelsData
            : modelsData.filter(m => m.category.toLowerCase() === categoryKey.toLowerCase());

        currentModels = filteredModels;
        displayModels(currentModels);
    } catch(err) {
        console.error('Failed to load models:', err);
        modelsGrid.innerHTML = '<p class="text-red-400 text-lg mt-6">Failed to load models. Please refresh.</p>';
    }
}

sortBySelect.addEventListener('change', () => {
    if (!currentModels.length) return;
    const sortedModels = sortModels(currentModels, sortBySelect.value);
    displayModels(sortedModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
    if (!currentModels.length) return;
    currentModels = shuffleArray(currentModels);
    displayModels(currentModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
    loadCategoryModels();
    feather.replace();
});
