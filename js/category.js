// ------------------------------
// Category Page JS
// ------------------------------

import { createModelCard } from './modelCard.js';
import { fetchJSON, categoryColors, getCategoryName } from './utils.js';

const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');

// Global array to store currently displayed models
let currentModels = [];

// Get category from URL
function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
}

// Display models in the grid
function displayModels(models) {
    modelsGrid.innerHTML = '';
    modelsGrid.className = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';
    
    models.forEach(model => {
        const colorClass = categoryColors[model.category.toLowerCase()] || 'bg-black/20';
        
        const card = createModelCard(model);
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

function initLazyBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        observer.unobserve(el);
      }
    });
  });
  lazyBackgrounds.forEach(el => observer.observe(el));
}

// ------------------------------
// Fetch Models
// ------------------------------
async function loadCategoryModels() {
    const categoryKey = getCategoryFromUrl();
    if(document.getElementById('categoryTitle')) document.getElementById('categoryTitle').textContent = getCategoryName(categoryKey);

    try {
        const modelsData = await fetchJSON('/AI-website/models.json');

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
