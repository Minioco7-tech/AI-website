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
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-tile bg-black bg-opacity-30 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300 border border-white border-opacity-10';
        card.innerHTML = `
            <div class="w-full h-40 bg-cover bg-center" style="background-image: url('${model.image}')"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${model.name}</h3>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">${model.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>${model.category}</span>
                    <a href="model.html?id=${encodeURIComponent(model.id)}" class="text-purple-400 hover:text-purple-300">View →</a>
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
