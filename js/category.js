document.addEventListener('DOMContentLoaded', async () => {
    feather.replace();

    const modelsGrid = document.getElementById('modelsGrid');
    const loadingState = document.getElementById('loadingState');
    const categoryTitle = document.getElementById('categoryTitle');
    const randomiseBtn = document.getElementById('randomiseBtn');
    const sortBySelect = document.getElementById('sortBy');

    let currentModels = [];

    function getCategoryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('category') || 'all';
    }

    async function loadCategoryModels() {
        try {
            const models = await fetchModels();
            const categoryKey = getCategoryFromUrl();
            categoryTitle.textContent = getCategoryName(categoryKey);

            const filtered = categoryKey.toLowerCase() === 'all'
                ? models
                : models.filter(m => m.category.toLowerCase() === categoryKey.toLowerCase());

            currentModels = getRandomModels(filtered, 12);
            displayModels(currentModels, 'modelsGrid');
            loadingState?.classList.add('hidden');
        } catch (err) {
            console.error('Failed to load category models:', err);
            if (loadingState) loadingState.innerHTML = '<p class="text-red-400 text-lg mt-6">Failed to load models. Please refresh.</p>';
        }
    }

    sortBySelect?.addEventListener('change', () => {
        if (!currentModels.length) return;
        currentModels = sortModels(currentModels, sortBySelect.value);
        displayModels(currentModels, 'modelsGrid');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    randomiseBtn?.addEventListener('click', () => {
        if (!currentModels.length) return;
        currentModels = shuffleArray(currentModels);
        displayModels(currentModels, 'modelsGrid');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    loadCategoryModels();
});

