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

const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const filterContainer = document.getElementById('categoryFilters');

const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];
let currentModels = [];
let selectedCategories = new Set();

const categorySynonyms = {
  writing: ['writing','writer','content','copy','text','document','email'],
  design: ['design','art','image','photo','logo','graphic','visual'],
  learning: ['learning','education','research','study','teach','knowledge'],
  business: ['business','marketing','sales','brand','startup','work','help'],
  chatbots: ['chat','bot','assistant','agent','conversation','support'],
  music: ['music','audio','sound','song','beat','voice','sing'],
  coding: ['code','coding','developer','programming','software','tech'],
  science: ['science','health','medicine','bio','lab','research'],
  finance: ['finance','money','analytics','data','economy','bank','invest'],
  health: ['health','fitness','wellbeing','medical','care','wellness']
};

// ------------------------------
// Filter Utilities
// ------------------------------

function updateFilteredModels() {
  const filtered = filterBySelectedCategories(currentModels);
  displayModels(filtered);
}

// ------------------------------
// Core Display Logic
// ------------------------------

function displayModels(models) {
  resultsGrid.innerHTML = '';
  resultsGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  models.forEach(model => {
    const card = createModelCard(model);
    resultsGrid.appendChild(card);
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
// Search Logic
// ------------------------------

function getMatchedCategory(keywords) {
  for (const [key, synonyms] of Object.entries(categorySynonyms)) {
    if (keywords.some(word => synonyms.includes(word))) return key;
  }
  return null;
}

async function fetchAndDisplayResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q')?.trim().toLowerCase() || '';
    queryText.textContent = searchQuery;

    const models = await fetchJSON('./models.json');

    const keywords = searchQuery
      .split(/\s+/)
      .map(w => w.toLowerCase())
      .filter(Boolean)
      .filter(word => !stopwords.includes(word));

    let filtered = [];
    const matchedCategory = getMatchedCategory(keywords);

    if (['all','everything','catalogue','all models','show all models'].includes(searchQuery)) {
      filtered = models;
    } else if (matchedCategory) {
      filtered = models.filter(m =>
        (m.category || []).map(c => c.toLowerCase()).includes(matchedCategory)
      );
    } else {
      const fuse = new Fuse(models, {
        keys: ['name', 'description', 'category', 'type'],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true
      });
      filtered = fuse.search(searchQuery).map(r => r.item);
    }

    currentModels = sortModels(filtered, sortBySelect.value);

    renderCategoryFilters(filterContainer, models, selectedCategories, updateFilteredModels);// Show all filters
    updateFilteredModels();

    noResults.classList.toggle('hidden', currentModels.length > 0);
    feather.replace();
  } catch (err) {
    console.error('Search failed:', err);
    noResults.classList.remove('hidden');
  }
}

// ------------------------------
// Event Listeners
// ------------------------------

sortBySelect.addEventListener('change', () => {
  if (!currentModels.length) return;
  currentModels = sortModels(currentModels, sortBySelect.value);
  updateFilteredModels();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
  if (!currentModels.length) return;
  currentModels = shuffleArray(currentModels);
  updateFilteredModels();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', fetchAndDisplayResults);
