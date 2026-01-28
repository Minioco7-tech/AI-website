// category.js — Handles category page display and filtering
// Page: category.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  getCategoryName,
  sortModels,
  shuffleArray,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE,
  normalizeCategories,
  filterModelsByCategories,
  getUniqueCategories
} from './utils.js';

import { setupCategoryPillDropdown } from './dropdown.js';
import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';

// ------------------------------
// DOM References
// ------------------------------
const modelsGrid = document.getElementById('modelsGrid');
const loadingState = document.getElementById('loadingState'); // optional, not used currently
const categoryTitle = document.getElementById('categoryTitle');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const filterCategoriesContainer = document.getElementById('filterCategories');

// ------------------------------
// State Variables
// ------------------------------
let currentModels = [];            // Full set of models for this category
let selectedCategories = new Set(); // Checkbox filters selected
let currentPage = 1;               // Current pagination page


// ------------------------------
// ✅ Get category from URL (?category=design)
// ------------------------------
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'all';
}


// ------------------------------
// ✅ Display models in paginated card grid
// ------------------------------
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

  // Optional: lazy-load image backgrounds (function can be moved to utils if reused)
  initLazyBackgrounds();
}


// ------------------------------
// ✅ Lazy-load background images
// ------------------------------
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
// ✅ Filter checkbox UI → filtered model list
// ------------------------------
function updateFilteredModels() {
  const filtered = filterModelsByCategories(currentModels, selectedCategories);
  displayModels(filtered);
}


// ------------------------------
// ✅ Render dynamic category filters as checkboxes
// ------------------------------
function renderCategoryFilters(models) {
  const uniqueCategories = getUniqueCategories(models);

  // Reset and set up the pill dropdown
  setupCategoryPillDropdown({
    wrapperId: "filterDropdown",
    toggleId: "filterDropdownToggle",
    menuId: "filterCategories",
    categoryKeys: uniqueCategories,
    selectedSet: selectedCategories,
    onUpdate: () => {
      currentPage = 1;           // ✅ important: reset pagination on filter change
      updateFilteredModels();
    }
  });
}

// ------------------------------
// ✅ Main loader: load all models, filter to category
// ------------------------------
async function loadCategoryModels() {
  const categoryKey = getCategoryFromUrl();
  const categoryName = getCategoryName(categoryKey);

  // Save breadcrumb info for model detail page
  sessionStorage.setItem('breadcrumbSource', 'category');
  sessionStorage.setItem('breadcrumbCategoryKey', categoryKey);

  if (categoryTitle) categoryTitle.textContent = categoryName;

  // Render breadcrumb: Home > [Category]
  renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: categoryName }
  ]);

  // Load models from JSON
  const modelsData = await fetchJSON('./models.json');

  // Filter to selected category (or all if 'all')
  const filteredModels =
    categoryKey === 'all'
      ? modelsData
      : modelsData.filter(m => {
          const cats = normalizeCategories(m.category).map(c => c.toLowerCase());
          return cats.includes(categoryKey.toLowerCase());
        });

  currentModels = filteredModels;
  selectedCategories.clear(); // reset filters when navigating to a new category
  renderCategoryFilters(modelsData);  // Show filter UI based on all categories
  updateFilteredModels();            // Show results
}


// ------------------------------
// ✅ Event Handlers
// ------------------------------

// Sorting dropdown (A→Z / Z→A)
sortBySelect.addEventListener('change', () => {
  if (!currentModels.length) return;
  currentPage = 1;
  currentModels = sortModels(currentModels, sortBySelect.value);
  displayModels(currentModels);
});

// Randomise button
randomiseBtn.addEventListener('click', () => {
  if (!currentModels.length) return;
  currentPage = 1;
  currentModels = shuffleArray(currentModels);
  displayModels(currentModels);
});


// ------------------------------
// ✅ Init page on load
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCategoryModels();
  feather.replace(); // Feather icons
});
