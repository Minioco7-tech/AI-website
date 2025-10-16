document.addEventListener("DOMContentLoaded", async () => {
  // Feather icons
  if (window.feather) feather.replace();

  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model");

  const modelDiv = document.getElementById("modelContent");
  const relatedGrid = document.getElementById("relatedModelsGrid");

  if (!modelName) {
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">No model specified.</p>';
    return;
  }

  try {
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("Failed to fetch models.json");
    const models = await response.json();

    const model = models.find(m => m.name === modelName);
    if (!model) {
      modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Model not found.</p>';
      return;
    }

    // Populate main model section
    modelDiv.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex-1">
          <h1 class="text-3xl sm:text-4xl font-bold text-white">${model.name}</h1>
          <p class="text-gray-300 mt-2">${model.description}</p>
          <div class="mt-2 text-sm text-gray-400">
            Category: <span class="text-primary font-semibold">${model.category}</span>
          </div>
        </div>
        <button id="tryButton" class="btn-primary px-6 py-3 text-white font-bold rounded-lg whitespace-nowrap">
          Try this Model
        </button>
      </div>
    `;

    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // Related models (reuse same tile as category.html)
    const related = models.filter(m => m.category === model.category && m.name !== model.name).slice(0, 6);

    if (related.length === 0) {
      relatedGrid.innerHTML = '<p class="text-gray-400">No other models in this category yet.</p>';
    } else {
      relatedGrid.innerHTML = related.map(r => `
        <a href="model.html?model=${encodeURIComponent(r.name)}"
           class="model-tile block overflow-hidden group">
          
          <div class="p-4 flex flex-col text-left">
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-[#00BFFF] transition">
              ${r.name}
            </h3>
            <p class="text-gray-300 text-sm mb-3 line-clamp-3">
              ${r.description}
            </p>
            <span class="inline-block bg-[#00BFFF]/30 text-white text-xs font-medium px-3 py-1 rounded-full self-start backdrop-blur-sm">
              ${r.category}
            </span>
          </div>
        </a>
      `).join("");
    }

  } catch (err) {
    console.error("Error showing models grid:", err);
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
