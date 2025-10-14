document.addEventListener("DOMContentLoaded", async () => {
  // Feather icons
  if (window.feather) feather.replace();

  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model");

  if (!modelName) {
    document.getElementById("modelContent").innerHTML = '<p class="text-gray-300 text-center mt-8">No model specified.</p>';
    return;
  }

  try {
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("Failed to fetch models.json");
    const models = await response.json();

    const model = models.find(m => m.name === modelName);
    if (!model) {
      document.getElementById("modelContent").innerHTML = '<p class="text-gray-300 text-center mt-8">Model not found.</p>';
      return;
    }

    // Populate model main content
    const modelDiv = document.getElementById("modelContent");
    modelDiv.innerHTML = `
      <div class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-4xl font-bold text-white">${model.name}</h1>
            <p class="text-[#9dafb8] mt-2">${model.description}</p>
          </div>
          <button id="tryButton" class="btn-primary px-6 py-3 text-white font-bold rounded-lg">
            Try this Model
          </button>
        </div>
        <div class="mt-4 text-sm text-gray-400">Category: <span class="text-primary font-semibold">${model.category}</span></div>
      </div>
    `;

    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // Related models
    const related = models.filter(m => m.category === model.category && m.name !== model.name).slice(0, 6);
    const relatedGrid = document.getElementById("relatedModelsGrid");

    if (related.length === 0) {
      relatedGrid.innerHTML = '<p class="text-gray-400">No other models in this category yet.</p>';
    } else {
      relatedGrid.innerHTML = related.map(r => `
        <a href="model.html?model=${encodeURIComponent(r.name)}" 
           class="bg-[#293338] rounded-xl overflow-hidden flex flex-col group">
          <div class="h-40 bg-cover bg-center" style="background-image: url('${r.image}')"></div>
          <div class="p-4 flex flex-col flex-grow">
            <h4 class="text-white font-bold text-lg mb-2">${r.name}</h4>
            <p class="text-[#9dafb8] text-sm flex-grow mb-4">${r.description}</p>
            <span class="text-primary font-semibold text-sm self-start group-hover:underline">View Model →</span>
          </div>
        </a>
      `).join("");
    }

  } catch (err) {
    console.error("Error showing models grid:", err);
    document.getElementById("modelContent").innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
