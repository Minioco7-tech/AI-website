import {
  fetchJSON,
  getCategoryName,
  getUniqueCategories,
  filterBySelectedCategories,
  renderCategoryFilters,
  sortModels,
  shuffleArray
} from './utils.js';
import { createModelCard } from './modelCard.js';

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const filterContainer = document.getElementById('categoryFilters');

let currentModels = [];
let selectedCategories = new Set();

// ------------------------------
// Helpers
// ------------------------------
function updateFilteredModels() {
  const filtered = filterBySelectedCategories(currentModels, selectedCategories);
  displayModels(filtered);
}

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'all';
}

function displayModels(models) {
  modelsGrid.innerHTML = '';
  modelsGrid.className = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';

  models.forEach(model => {
    const card = createModelCard(model);
    modelsGrid.appendChild(card);
  });

  initLazyBackgrounds();
}

function initLazyBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
  const observer = new IntersectionObserver(entries => {
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
// Load Category Models
// ------------------------------

async function loadCategoryModels() {
  const categoryKey = getCategoryFromUrl();
  if (categoryTitle) categoryTitle.textContent = getCategoryName(categoryKey);

  const modelsData = await fetchJSON('/AI-website/models.json');

  const filteredModels =
    categoryKey.toLowerCase() === 'all'
      ? modelsData
      : modelsData.filter(m =>
          (m.category || []).map(c => c.toLowerCase()).includes(categoryKey.toLowerCase())
        );

  currentModels = filteredModels;

  renderCategoryFilters(filterContainer, modelsData, selectedCategories, updateFilteredModels); // all unique cats
  updateFilteredModels();
}

// ------------------------------
// Events
// ------------------------------

sortBySelect.addEventListener('change', () => {
  if (!currentModels.length) return;
  const sorted = sortModels(currentModels, sortBySelect.value);
  currentModels = sorted;
  updateFilteredModels();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
  if (!currentModels.length) return;
  currentModels = shuffleArray(currentModels);
  updateFilteredModels();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
  loadCategoryModels();
  feather.replace();
});
