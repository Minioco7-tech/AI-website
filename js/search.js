import { fetchJSON, categoryColors, getCategoryName, shuffleArray, sortModels } from './utils.js';
import { createModelCard } from './modelCard.js';

const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');

const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];
let currentModels = [];
let selectedCategories = new Set();

const categorySynonyms = {
  writing: ['writing', 'writer', 'content', 'copy', 'text', 'document', 'email'],
  design: ['design', 'art', 'image', 'photo', 'logo', 'graphic', 'visual'],
  learning: ['learning', 'education', 'research', 'study', 'teach', 'knowledge'],
  business: ['business', 'marketing', 'sales', 'brand', 'startup', 'work', 'help'],
  chatbots: ['chat', 'bot', 'assistant', 'agent', 'conversation', 'support'],
  music: ['music', 'audio', 'sound', 'song', 'beat', 'voice', 'sing'],
  coding: ['code', 'coding', 'developer', 'programming', 'software', 'tech'],
  science: ['science', 'health', 'medicine', 'bio', 'lab', 'research'],
  finance: ['finance', 'money', 'analytics', 'data', 'economy', 'bank', 'invest'],
  health: ['health', 'fitness', 'wellbeing', 'medical', 'care', 'wellness']
};

// Check if any keyword matches a category
function getMatchedCategory(keywords) {
  for (const [key, synonyms] of Object.entries(categorySynonyms)) {
    if (keywords.some(word => synonyms.includes(word))) return key;
  }
  return null;

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

      const response = await fetch('./models.json');
      if (!response.ok) throw new Error('Failed to load models.json');
      const models = await response.json();

      const keywords = searchQuery
          .split(/\s+/)
          .map(w => w.toLowerCase())
          .filter(Boolean)
          .filter(word => !stopwords.includes(word));

      let filtered = [];
      const matchedCategory = getMatchedCategory(keywords);

      // Show all models for general queries
      if (['all', 'everything', 'all tools', 'catalogue', 'all models', 'show all models'].includes(searchQuery)) {
          filtered = models;
      } 
      // Match category
      else if (matchedCategory) {
          filtered = models.filter(m => m.category.toLowerCase() === matchedCategory);
      } 
      // Fuzzy search with Fuse.js
      else {
          const fuse = new Fuse(models, {
              keys: ['name', 'description', 'category', 'type'],
              threshold: 0.4,
              ignoreLocation: true,
              includeScore: true
          });
          filtered = fuse.search(searchQuery).map(result => result.item);
      }

      currentModels = filtered;

      // Apply sorting and minor shuffle
      currentModels = sortModels(currentModels, sortBySelect.value).sort(() => 0.5 - Math.random());

      // Display results
      if (currentModels.length === 0) {
          noResults.classList.remove('hidden');
      } else {
          noResults.classList.add('hidden');
          displayModels(currentModels);
      }

      // Replace Feather icons
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
  const sortedModels = sortModels(currentModels, sortBySelect.value);
  displayModels(sortedModels);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

randomiseBtn.addEventListener('click', () => {
  if (!currentModels.length) return;
  currentModels = shuffleArray(currentModels);
  resultsGrid.innerHTML = '';
  requestAnimationFrame(() => {
      displayModels(currentModels);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { document.body.style.transform = 'translateZ(0)'; }, 100);
});

document.addEventListener('DOMContentLoaded', fetchAndDisplayResults);
