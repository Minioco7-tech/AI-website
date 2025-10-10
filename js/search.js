document.addEventListener('DOMContentLoaded', async () => {
    feather.replace();

    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const queryText = document.getElementById('queryText');
    const randomiseBtn = document.getElementById('randomiseBtn');
    const sortBySelect = document.getElementById('sortBy');

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q')?.trim().toLowerCase() || '';
    queryText.textContent = searchQuery;

    let currentModels = [];

    async function fetchAndDisplayResults() {
        try {
            const models = await fetchModels();
            const keywords = searchQuery.split(/\s+/).filter(Boolean).filter(w => !stopwords.includes(w));

            let filtered = [];
            const matchedCategory = getMatchedCategory(keywords);

            if (['all','everything','all tools','catalogue','all models','show all models'].includes(searchQuery)) {
                filtered = models;
            } else if (matchedCategory) {
                filtered = models.filter(m => m.category.toLowerCase() === matchedCategory);
            } else {
                const fuse = new Fuse(models, { keys:['name','description','category','type'], threshold:0.4, ignoreLocation:true, includeScore:true });
                filtered = fuse.search(searchQuery).map(r=>r.item);
            }

            currentModels = sortModels(filtered, sortBySelect.value);
            currentModels = shuffleArray(currentModels);

            if (!currentModels.length) noResults.classList.remove('hidden');
            else {
                noResults.classList.add('hidden');
                displayModels(currentModels, 'resultsGrid');
            }
        } catch (e) {
            console.error('Search error:', e);
            noResults.classList.remove('hidden');
        }
    }

    sortBySelect?.addEventListener('change', () => {
        if (!currentModels.length) return;
        currentModels = sortModels(currentModels, sortBySelect.value);
        displayModels(currentModels, 'resultsGrid');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    randomiseBtn?.addEventListener('click', () => {
        if (!currentModels.length) return;
        currentModels = shuffleArray(currentModels);
        displayModels(currentModels, 'resultsGrid');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    fetchAndDisplayResults();
});

