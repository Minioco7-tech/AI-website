// ------------------------------
// Home Page JS
// ------------------------------

const homeGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');

// Global array for displayed models
let currentModels = [];

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Sort models
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

// Display models
function displayModels(models) {
    homeGrid.innerHTML = '';
    homeGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
    models.forEach(model => {
        const card = document.createElement('a');
        card.className = 'model-tile bg-black bg-opacity-30 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300 border border-white border-opacity-10';
        card.innerHTML = `
            <div class="w-full h-40 bg-cover bg-center" style="background-image: url('${model.image}')"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${model.name}</h3>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">${model.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>${model.category}</span>
                </div>
            </div>
        `;
        homeGrid.appendChild(card);
    });
}

// Fetch and display models
async function loadHomeModels() {
    try {
        const response = await fetch('./models.json');
        if (!response.ok) throw new Error('Failed to load models.json');
        const modelsData = await response.json();
        currentModels = shuffleArray(modelsData).slice(0, 12);
        displayModels(currentModels);
        loadingState.classList.add('hidden');
    } catch(err) {
        console.error(err);
        loadingState.innerHTML = '<p class="text-red-400 text-lg mt-6">Failed to load models. Please refresh.</p>';
    }
}

// Event listeners
sortBySelect.addEventListener('change', () => {
    if (!currentModels.length) return;
    const sortedModels = sortModels(currentModels, sortBySelect.value);
    displayModels(sortedModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
    if (!currentModels.length) return;
    currentModels = shuffleArray(currentModels);
    homeGrid.innerHTML = '';
    requestAnimationFrame(() => {
        displayModels(currentModels);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { document.body.style.transform = 'translateZ(0)'; }, 100);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHomeModels();
    feather.replace();
});
