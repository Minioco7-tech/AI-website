// models.js — Fetch & render models

let modelsData = [];

async function fetchModels() {
    if (modelsData.length) return modelsData;
    const response = await fetch('./models.json');
    if (!response.ok) throw new Error(`Failed to load models.json (status: ${response.status})`);
    modelsData = await response.json();
    return modelsData;
}

function displayModels(models, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-tile bg-black bg-opacity-30 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300 border border-white border-opacity-10';
        card.innerHTML = `
            <div class="w-full h-40 bg-cover bg-center" style="background-image: url('${model.image}')"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${model.name}</h3>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">${model.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>${getCategoryName(model.category)}</span>
                    <a href="model.html?id=${encodeURIComponent(model.id)}" class="text-purple-400 hover:text-purple-300">View →</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function sortModels(models, criteria) {
    const sorted = [...models];
    switch(criteria) {
        case 'az': sorted.sort((a,b)=>a.name.localeCompare(b.name)); break;
        case 'za': sorted.sort((a,b)=>b.name.localeCompare(a.name)); break;
        default: break;
    }
    return sorted;
}
