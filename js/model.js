document.addEventListener("DOMContentLoaded", async () => {
  // Replace Feather icons
  if (window.feather) feather.replace();

  // Get model name from URL
  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model");

  if (!modelName) {
    document.body.innerHTML = '<p class="text-gray-300 text-center mt-8">No model specified.</p>';
    return;
  }

  try {
    // Load models dataset
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("Failed to fetch models.json");
    const models = await response.json();

    // Find model by name
    const model = models.find(m => m.name === modelName);
    if (!model) {
      document.body.innerHTML = '<p class="text-gray-300 text-center mt-8">Model not found.</p>';
      return;
    }

    // Populate main content (hero section)
    const mainDiv = document.getElementById("modelContent");
    mainDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row flex-wrap justify-between gap-4 p-4">
        <div class="flex min-w-72 flex-col gap-3">
          <p class="text-white text-4xl font-black leading-tight tracking-[-0.033em]">${model.name}</p>
          <p class="text-[#9dafb8] text-base font-normal leading-normal">${model.description}</p>
          <div class="flex items-center gap-2 mt-2">
            <div class="flex text-primary">
              <span class="material-symbols-outlined">star</span>
              <span class="material-symbols-outlined">star</span>
              <span class="material-symbols-outlined">star</span>
              <span class="material-symbols-outlined">star</span>
              <span class="material-symbols-outlined">star_half</span>
            </div>
            <span class="text-[#9dafb8] text-sm">(123 reviews)</span>
          </div>
        </div>
        <button id="tryButton" class="flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] self-start sm:self-center">
          <span class="truncate">Try this Model</span>
        </button>
      </div>
      <div class="pb-3">
        <div class="flex border-b border-[#3c4b53] px-4 gap-8">
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-white pb-[13px] pt-4" href="#">
            <p class="text-white text-sm font-bold leading-normal tracking-[0.015em]">Description</p>
          </a>
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9dafb8] pb-[13px] pt-4 hover:text-white transition-colors" href="#">
            <p class="text-sm font-bold leading-normal tracking-[0.015em]">Use Cases</p>
          </a>
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9dafb8] pb-[13px] pt-4 hover:text-white transition-colors" href="#">
            <p class="text-sm font-bold leading-normal tracking-[0.015em]">Technical Specs</p>
          </a>
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9dafb8] pb-[13px] pt-4 hover:text-white transition-colors" href="#">
            <p class="text-sm font-bold leading-normal tracking-[0.015em]">Reviews</p>
          </a>
        </div>
      </div>
    `;

    // Set Try button functionality
    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // Related models (same category, exclude current)
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
    document.body.innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
