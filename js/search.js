import { fetchJSON, categoryColors, getCategoryName, shuffleArray, sortModels, getPaginatedModels, renderPagination, MODELS_PER_PAGE } from './utils.js';
import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';

const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');
const matchedCategoryTag = document.getElementById('matchedCategoryTag');


const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];
let currentModels = [];
let selectedCategories = new Set();
let currentPage = 1;

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


// Check if any keyword matches a category
function getMatchedCategory(keywords) {
  for (const [key, synonyms] of Object.entries(categorySynonyms)) {
    if (keywords.some(word => synonyms.includes(word))) return key;
  }
  return null;
}

// ------------------------------
// Core Display Logic
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
async function fetchAndDisplayResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q')?.trim().toLowerCase() || '';
    queryText.textContent = searchQuery;

    // ✅ Store search info in session
    sessionStorage.setItem('breadcrumbSource', 'search');
    sessionStorage.setItem('breadcrumbSearchQuery', searchQuery);

    // ✅ Breadcrumb
    renderBreadcrumb([
      { label: 'Home', href: 'index.html' },
      { label: 'Search Results' }
    ]);

    const models = await fetchJSON('./models.json');

    const keywords = searchQuery
      .split(/\s+/)
      .map(w => w.toLowerCase())
      .filter(Boolean)
      .filter(word => !stopwords.includes(word));

    const matchedCategory = getMatchedCategory(keywords);
    // DOM refs
    // const matchedCategoryTag = document.getElementById('matchedCategoryTag');
    
    // After getting matchedCategory:
    if (matchedCategory && matchedCategory !== 'all') {
      matchedCategoryTag.classList.remove('hidden');
      matchedCategoryTag.textContent = `Showing results related to “${getCategoryName(matchedCategory)}”`;
    } else {
      matchedCategoryTag.classList.add('hidden');
    }

    let filtered = [];
    
    if (['all', 'everything', 'all tools', 'catalogue', 'all models', 'show all models'].includes(searchQuery.toLowerCase())) {
      filtered = models;
    } 
    else if (matchedCategory) {
      filtered = models.filter(m => {
        const cats = Array.isArray(m.category) ? m.category : [m.category];
        return cats.map(c => c.toLowerCase()).includes(matchedCategory);
      });
    }
    else {
      const fuse = new Fuse(models, {
        keys: ['name', 'description', 'category', 'type'],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true
      });
      filtered = fuse.search(searchQuery).map(result => result.item);
    }

    currentModels = sortModels(filtered, sortBySelect.value).sort(() => 0.5 - Math.random());

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
// Event Listeners
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

document.addEventListener('DOMContentLoaded', fetchAndDisplayResults);
