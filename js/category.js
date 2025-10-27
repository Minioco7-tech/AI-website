import { fetchJSON, categoryColors, getCategoryName, sortModels, shuffleArray } from './utils.js';
import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');


let currentModels = [];
let selectedCategories = new Set();

// ------------------------------
// Helpers
// ------------------------------

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

function updateFilteredModels() {
  const filtered = filterBySelectedCategories(currentModels);
  displayModels(filtered);
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
// Category Filter System
// ------------------------------

function renderCategoryFilters(models) {
  if (!filterContainer) return;

  filterContainer.innerHTML = '';
  const uniqueCategories = getUniqueCategories(models);

  uniqueCategories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'inline-flex items-center gap-1 text-sm text-white';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = cat;
    checkbox.className = 'accent-blue-400';

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedCategories.add(cat);
      } else {
        selectedCategories.delete(cat);
      }
      updateFilteredModels();
    });

    label.appendChild(checkbox);
    label.append(` ${getCategoryName(cat)}`);
    filterContainer.appendChild(label);
  });
}

function filterBySelectedCategories(models) {
  if (selectedCategories.size === 0) return models;

  return models.filter(model => {
    const cats = Array.isArray(model.category)
      ? model.category.map(c => c.toLowerCase())
      : [model.category.toLowerCase()];
    return [...selectedCategories].some(cat => cats.includes(cat));
  });
}

// ------------------------------
// Load Category Models
// ------------------------------

async function loadCategoryModels() {
  const categoryKey = getCategoryFromUrl();
  const categoryName = getCategoryName(categoryKey);

  // Store breadcrumb source
  sessionStorage.setItem('breadcrumbSource', 'category');
  sessionStorage.setItem('breadcrumbCategory', categoryName);
  
  if (categoryTitle) categoryTitle.textContent = categoryName;

  // Set breadcrumb
  renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: categoryName }
  ]);
  
  const modelsData = await fetchJSON('./models.json');

  const filteredModels =
    categoryKey.toLowerCase() === 'all'
      ? modelsData
      : modelsData.filter(m => {
        const cats = Array.isArray(m.category) ? m.category : [m.category];
        return cats.map(c => c.toLowerCase()).includes(categoryKey.toLowerCase());
      });

  currentModels = filteredModels;

  // renderCategoryFilters(modelsData); // all unique cats
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
