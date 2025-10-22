// ------------------------------
// Category Page JS (Modular + Shared Card Design)
// ------------------------------

import { createModelCard } from './js/modelCard.js';
import { getCategoryName } from './js/utils.js';

const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const noResults = document.getElementById('noResults');

// Global array to store current models
let currentModels = [];

// Get category key from URL (e.g. ?category=coding)
const urlParams = new URLSearchParams(window.location.search);
const categoryKey = urlParams.get('category')?.toLowerCase() || 'all';

// Set page title
if (categoryTitle) categoryTitle.textContent = getCategoryName(categoryKey);

// ------------------------------
// Load and Filter Models
// ------------------------------

async function loadModels() {
  try {
    if (loadingState) loadingState.classList.remove('hidden');

    const response = await fetch('./models.json');
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const modelsData = await response.json();

    // Filter models by category (if not 'all')
    const filteredModels =
      categoryKey === 'all'
        ? modelsData
        : modelsData.filter(m =>
            Array.isArray(m.categories)
              ? m.categories.some(c => c.toLowerCase() === categoryKey)
              : m.category?.toLowerCase() === categoryKey
          );

    currentModels = filteredModels;
    displayModels(currentModels);

  } catch (error) {
    console.error('Error loading models:', error);
    modelsGrid.innerHTML =
      '<p class="text-red-400 mt-6">Failed to load models. Please refresh.</p>';
  } finally {
    if (loadingState) loadingState.classList.add('hidden');
  }
}

// ------------------------------
// Display Models (Uses Shared Card Design)
// ------------------------------

function displayModels(models) {
  if (!models || models.length === 0) {
    noResults.classList.remove('hidden');
    modelsGrid.innerHTML = '';
    return;
  }

  noResults.classList.add('hidden');

  // Generate all cards via shared component
  const cardsHTML = models.map(model => createModelCard(model)).join('');
  modelsGrid.innerHTML = cardsHTML;
}

// ------------------------------
// Sorting + Randomising
// ------------------------------

function sortModels(models, criteria) {
  const sorted = [...models];
  switch (criteria) {
    case 'az':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'relevance':
    default:
      break;
  }
  return sorted;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ------------------------------
// Event Listeners
// ------------------------------

if (sortBySelect) {
  sortBySelect.addEventListener('change', () => {
    if (!currentModels.length) return;
    const sortedModels = sortModels(currentModels, sortBySelect.value);
    displayModels(sortedModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (randomiseBtn) {
  randomiseBtn.addEventListener('click', () => {
    if (!currentModels.length) return;
    currentModels = shuffleArray(currentModels);
    displayModels(currentModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ------------------------------
// Init
// ------------------------------

document.addEventListener('DOMContentLoaded', () => {
  loadModels();
});
