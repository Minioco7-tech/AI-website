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
    { key: 'productivity', name: 'Writing & Productivity' }, 
    { key: 'creativity', name: 'Creativity & Design' }, 
    { key: 'learning', name: 'Learning & Research' }, 
    { key: 'business', name: 'Business & Marketing' },
    { key: 'chatbots', name: 'Chatbots & Agents' },
    { key: 'audio', name: 'Audio & Music' }, 
    { key: 'coding', name: 'Coding & Dev Tools' }, 
    { key: 'science', name: 'Science & Health' }, 
    { key: 'documents', name: 'Documents & Reports' }, 
    { key: 'spreadsheets', name: 'Spreadsheets & Data'} 
];

// Category color map
const categoryColors = {
  all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
  productivity: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',       // purple/indigo
  creativity: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',    // pink/orange
  learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',      // cyan/blue
  business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',      // emerald/green
  chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',      // amber
  audio: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',         // red/pink
  coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',        // violet/indigo
  science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',       // teal
  documents: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',       // yellow
  spreadsheets: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'       // light blue
};

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
    modelsGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4';
    
    models.forEach(model => {
        const colorClass = categoryColors[model.category.toLowerCase()] || 'bg-black/20';
        
        const card = document.createElement('a');
        card.href = `model.html?model=${encodeURIComponent(model.name)}`;
        card.className = 'model-tile flex flex-col w-full rounded-lg overflow-hidden snap-center group mx-auto pb-6 transition transform duration-300 hover:scale-[1.03] border border-white border-opacity-10';
        
        card.innerHTML = `
            <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-t-lg" style="background-image: url('${model.image}')"></div>
            <div class="flex flex-col flex-1 p-4">
                <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
                <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
                        ${getCategoryName(model.category)}
                    </span>
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
