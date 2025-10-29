import { fetchJSON, 
        categoryColors, 
        getCategoryName, 
        sortModels, 
        shuffleArray, 
        getPaginatedModels, 
        renderPagination, 
        MODELS_PER_PAGE, 
        normalizeCategories, 
        filterModelsByCategories 
} from './utils.js';

import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState');
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const filterCategoriesContainer = document.getElementById('filterCategories');


let currentModels = [];
let selectedCategories = new Set();
let currentPage = 1;

// ------------------------------
// Helpers
// ------------------------------

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'all';
}

function displayModels(models) {
  const paginated = getPaginatedModels(models, currentPage, MODELS_PER_PAGE);
  
  modelsGrid.innerHTML = '';
  modelsGrid.className = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';

  paginated.forEach(model => {
    const card = createModelCard(model);
    modelsGrid.appendChild(card);
  });

  renderPagination({
    totalItems: models.length,
    currentPage,
    onPageChange: (page) => {
      currentPage = page;
      displayModels(models);
    }
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
// Category Filter System
// ------------------------------
function updateFilteredModels() {
  const filtered = filterModelsByCategories(currentModels, selectedCategories);
  displayModels(filtered);
}

function renderCategoryFilters(models) {
  filterCategoriesContainer.innerHTML = '';
  const uniqueCategories = getUniqueCategories(models);

  uniqueCategories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'inline-flex items-center gap-2 text-sm text-white';

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
    filterCategoriesContainer.appendChild(label);
  });
}

function filterBySelectedCategories(models) {
  if (selectedCategories.size === 0) return models;

  return models.filter(model => {
    const cats = normalizeCategories(model.category).map(c => c.toLowerCase());
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
    categoryKey === 'all'
      ? modelsData
      : modelsData.filter(m => {
          const cats = normalizeCategories(m.category).map(c => c.toLowerCase());
          return cats.includes(categoryKey.toLowerCase());
        });

  currentModels = filteredModels;
  selectedCategories.clear(); // reset filters on nav
  renderCategoryFilters(modelsData);
  updateFilteredModels();
}

// ------------------------------
// Events
// ------------------------------

sortBySelect.addEventListener('change', () => {
  if (!currentModels.length) return;
  currentPage = 1;
  currentModels = sortModels(currentModels, sortBySelect.value);
  displayModels(currentModels);
});

randomiseBtn.addEventListener('click', () => {
  if (!currentModels.length) return;
  currentPage = 1;
  currentModels = shuffleArray(currentModels);
  displayModels(currentModels);
});

document.addEventListener('DOMContentLoaded', () => {
  loadCategoryModels();
  feather.replace();
});
