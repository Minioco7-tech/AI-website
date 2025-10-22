// ------------------------------
// Search Page JS
// ------------------------------

const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const randomiseBtn = document.getElementById('randomiseBtn');
const sortBySelect = document.getElementById('sortBy');

// Stopwords to ignore in search
const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];

// Global array to store currently displayed models
let currentModels = [];

// Category synonyms for natural matching
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

const categoryColors = {
  all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
  productivity: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',       // purple/indigo
  design: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',    // pink/orange
  learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',      // cyan/blue
  business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',      // emerald/green
  chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',      // amber
  audio: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',         // red/pink
  coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',        // violet/indigo
  science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',       // teal
  documents: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',       // yellow
  spreadsheets: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'       // light blue
};

// Format category names neatly
function getCategoryName(category) {
  if (!category) return 'Uncategorised';
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// ------------------------------
// Helper Functions
// ------------------------------

// Check if any keyword matches a category
function getMatchedCategory(keywords) {
    for (const [key, synonyms] of Object.entries(categorySynonyms)) {
        if (keywords.some(word => synonyms.includes(word))) return key;
    }
    return null;
}

// Display models in the grid
function displayModels(models) {
    resultsGrid.innerHTML = '';
    resultsGrid.classname = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
    
    models.forEach(model => {
        const modelSlug = encodeURIComponent(model.name.trim());
        const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';
        
        const card = document.createElement('a');
        card.href = `model.html?model=${modelSlug}`;
        card.className = 'model-tile flex flex-col w-full rounded-lg overflow-hidden snap-center group mx-auto pb-6 transition transform duration-300 hover:scale-[1.03] border border-white border-opacity-10';
        
        card.innerHTML = `
            <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-t-lg" style="background-image: url('${model.image}')"></div>
            <div class="p-4 flex flex-col flex-1">
                <h3 class="text-lg sm-text-xl font-bold leading-snug mb-2 text-white">${model.name}</h3>
                <p class="text-sm text-gray-200 sm-text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
                        ${getCategoryName(model.category)}
                    </span>
                    <span class="text-xs text-gray-400">${model.type || ''}</span>
                </div>
            </div>
        `;
        resultsGrid.appendChild(card);
    });
}

// Sort models by criteria
function sortModels(models, criteria) {
    const sorted = [...models];
    switch(criteria) {
        case 'az':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'relevance':
        default:
            break; // already sorted by Fuse.js relevance
    }
    return sorted;
}

// Fisher-Yates shuffle
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

// Sorting dropdown
sortBySelect.addEventListener('change', () => {
    if (!currentModels.length) return;
    const sortedModels = sortModels(currentModels, sortBySelect.value);
    displayModels(sortedModels);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Randomise button
randomiseBtn.addEventListener('click', () => {
    if (!currentModels.length) return;
    currentModels = shuffleArray(currentModels);
    resultsGrid.innerHTML = '';
    requestAnimationFrame(() => {
        displayModels(currentModels);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { document.body.style.transform = 'translateZ(0)'; }, 100);
    });
});

// ------------------------------
// Main Search Logic
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

// Initialize search on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayResults);
