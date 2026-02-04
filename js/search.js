// search.js — Handles logic for the search results page
// Page: search.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  shuffleArray,
  sortModels,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE,
  filterModelsByFacets,
  getUniqueCategories,
  scoreModelRelevance,
  expandQueryTokens,
  getUniqueTags
} from './utils.js';

import { setupCategoryPillDropdown } from './dropdown.js';
import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';


// ------------------------------
// DOM References
// ------------------------------
const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const matchedCategoryTag = document.getElementById('matchedCategoryTag');
const filterCategoriesContainer = document.getElementById('filterCategories');

// ------------------------------
// State
// ------------------------------
let currentModels = [];
let selectedCategories = new Set();
let currentPage = 1;
let selectedTags = new Set();
let defaultSelectedTags = new Set();
let defaultSelectedCategories = new Set();

// ------------------------------
// ✅ Display search results in grid with pagination
// ------------------------------
function displayModels(models) {
  const paginated = getPaginatedModels(models, currentPage, MODELS_PER_PAGE);

  resultsGrid.innerHTML = '';
  resultsGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  paginated.forEach(model => {
    const card = createModelCard(model);
    resultsGrid.appendChild(card);
  });

  renderPagination({
    totalItems: models.length,
    currentPage,
    onPageChange: (page) => {
      currentPage = page;
      displayModels(models);
    }
  });

  initLazyBackgrounds?.();
}


// ------------------------------
// ✅ Lazy-load image backgrounds (optional util)
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
// ✅ Filtering logic (checkbox UI interaction)
// ------------------------------
function updateFilteredModels() {
  const filtered = filterModelsByFacets(currentModels, selectedCategories, selectedTags);
  displayModels(filtered);
}


// ------------------------------
// ✅ Render category filters as PILLS (dropdown.js)
// ------------------------------
function renderCategoryFilters(allModelsForPills, currentModelsForDefaults) {
  const allCategoryKeys = getUniqueCategories(allModelsForPills);
  const allTagKeys = getUniqueTags(allModelsForPills);

  const defaultSelectedCategories = new Set(getUniqueCategories(currentModelsForDefaults));
  const defaultSelectedTags = new Set(getUniqueTags(currentModelsForDefaults));

  selectedCategories = new Set(defaultSelectedCategories);
  selectedTags = new Set(defaultSelectedTags);

  setupCategoryPillDropdown({
    wrapperId: "filterDropdown",
    toggleId: "filterDropdownToggle",
    menuId: "filterCategories",

    // categories
    categoryKeys: allCategoryKeys,
    selectedCategoriesSet: selectedCategories,
    defaultSelectedCategoriesSet: defaultSelectedCategories,

    // tags
    tagKeys: allTagKeys,
    selectedTagsSet: selectedTags,
    defaultSelectedTagsSet: defaultSelectedTags,

    models: allModelsForPills,
    hideZeroTags: true,

    onUpdate: () => {
      currentPage = 1;
      updateFilteredModels();
    }
  });
}

// ============================================================
// ✅ Fetch models.json, run fuzzy search, and display results
// ============================================================
async function fetchAndDisplayResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q')?.trim().toLowerCase() || '';
    queryText.textContent = searchQuery;

    // Save breadcrumb trail for model.html
    sessionStorage.setItem('breadcrumbSource', 'search');
    sessionStorage.setItem('breadcrumbSearchQuery', searchQuery);

    renderBreadcrumb([
      { label: 'Home', href: 'index.html' },
      { label: 'Search Results' }
    ]);

    const models = await fetchJSON('./models.json');

    const tokens = expandQueryTokens(searchQuery);

    // Score each model semantically (utils.js)
    let results = models.map(model => ({
      ...model,
      _score: scoreModelRelevance(model, tokens, searchQuery)  
    }));

    // Drop irrelevant models
    results = results.filter(m => m._score > 0);

    // Sort highest score first
    results.sort((a, b) => b._score - a._score);

    // Fallback: if no semantic hits, show models that contain tokens anywhere
    if (results.length === 0 && tokens.length > 0) {
      results = models.filter(m =>
        m.description.toLowerCase().includes(tokens[0]) ||
        m.name.toLowerCase().includes(tokens[0])
      );
    }

    // Store state for sorting + filtering
    currentModels = sortModels(results, sortBySelect.value);

    // Render category filter checkboxes
    renderCategoryFilters(models, currentModels);

    // No results UI
    if (currentModels.length === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
      displayModels(currentModels);
    }

    feather.replace();

  } catch (err) {
    console.error('Search failed:', err);
    noResults.classList.remove('hidden');
  }
}

// ------------------------------
// 🔁 Event Listeners
// ------------------------------

// Sorting dropdown
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

// Init page
document.addEventListener('DOMContentLoaded', fetchAndDisplayResults);
