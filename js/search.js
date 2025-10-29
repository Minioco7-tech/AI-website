// search.js — Handles logic for the search results page
// Page: search.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  categoryColors,
  getCategoryName,
  shuffleArray,
  sortModels,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE,
  normalizeCategories,
  filterModelsByCategories,
  getUniqueCategories
} from './utils.js';

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

// ------------------------------
// ✅ Search intent category matching via synonyms
// Example: typing "writing" → matches 'documents'
// Used to auto-suggest category from fuzzy input
// ------------------------------
const categorySynonyms = {
  productivity: ['writing', 'writer', 'content', 'copy', 'text', 'document', 'email', 'productivity', 'work', 'tasks', 'organization'],
  design: ['design', 'art', 'image', 'photo', 'logo', 'graphic', 'visual', 'presentation', 'poster'],
  learning: ['learning', 'education', 'research', 'study', 'teach', 'knowledge', 'school', 'student', 'academy'],
  business: ['business', 'marketing', 'sales', 'brand', 'startup', 'work', 'help', 'promotion', 'strategy'],
  chatbots: ['chat', 'bot', 'assistant', 'agent', 'conversation', 'support', 'talk', 'reply', 'ai chat'],
  audio: ['audio', 'music', 'sound', 'song', 'beat', 'voice', 'record', 'podcast', 'edit'],
  coding: ['code', 'coding', 'developer', 'programming', 'software', 'tech', 'script', 'debug', 'build'],
  science: ['science', 'health', 'medicine', 'bio', 'lab', 'research', 'medical', 'data', 'analysis'],
  documents: ['document', 'pdf', 'report', 'summary', 'notes', 'paper', 'doc', 'docs', 'write-up'],
  spreadsheets: ['spreadsheet', 'excel', 'sheet', 'data', 'table', 'formula', 'analytics', 'numbers'],
  all: ['all', 'everything', 'catalogue', 'all tools', 'show all', 'overview']
};

/**
 * Check if a keyword matches a known category based on synonym map.
 * @param {string[]} keywords - words extracted from search query
 * @returns {string|null} - matched category key
 */
function getMatchedCategory(keywords) {
  for (const [key, synonyms] of Object.entries(categorySynonyms)) {
    if (keywords.some(word => synonyms.includes(word))) return key;
  }
  return null;
}


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
  const filtered = filterModelsByCategories(currentModels, selectedCategories);
  displayModels(filtered);
}


// ------------------------------
// ✅ Render checkboxes for category filters
// ------------------------------
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


// ------------------------------
// ✅ Fetch models.json, run fuzzy search, and display results
// ------------------------------
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

    // Break query into keywords, remove stopwords
    const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];
    const keywords = searchQuery
      .split(/\s+/)
      .map(w => w.toLowerCase())
      .filter(Boolean)
      .filter(word => !stopwords.includes(word));

    const matchedCategory = getMatchedCategory(keywords);

    // Show matched category tag (optional UX)
    if (matchedCategory && matchedCategory !== 'all') {
      matchedCategoryTag.classList.remove('hidden');
      matchedCategoryTag.textContent = `Showing results related to “${getCategoryName(matchedCategory)}”`;
    } else {
      matchedCategoryTag.classList.add('hidden');
    }

    let filtered = [];

    // ------------------------------
    // 🔎 Handle different search cases:
    // ------------------------------
    if (['all', 'everything', 'all tools', 'catalogue', 'all models', 'show all models'].includes(searchQuery.toLowerCase())) {
      filtered = models;
    } 
    else if (matchedCategory) {
      filtered = models.filter(m => {
        const cats = normalizeCategories(m.category).map(c => c.toLowerCase());
        return cats.includes(matchedCategory);
      });
    } 
    else {
      // Fuse.js fuzzy search for free-text search
      const fuse = new Fuse(models, {
        keys: ['name', 'description', 'category', 'type'],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true
      });
      filtered = fuse.search(searchQuery).map(result => result.item);
    }

    // Sort + randomise initial load (optional)
    currentModels = sortModels(filtered, sortBySelect.value).sort(() => 0.5 - Math.random());

    // Display UI
    if (currentModels.length === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
      renderCategoryFilters(models); // checkbox filters
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
