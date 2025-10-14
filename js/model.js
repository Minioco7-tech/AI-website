// models.js — Fetch & render models

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const modelId = parseInt(urlParams.get("id"));

  // Element references
  const main = document.querySelector("main");
  const titleEl = document.getElementById("modelName");
  const descEl = document.getElementById("modelDescription");
  const categoryEl = document.getElementById("modelCategory");
  const typeEl = document.getElementById("modelType");
  const imageEl = document.getElementById("modelImage");
  const linkEl = document.getElementById("modelLink");
  const relatedGrid = document.getElementById("relatedModels");

  if (!modelId) {
    main.innerHTML = `
      <div class="text-center text-white py-20 text-xl">Model not found.</div>
    `;
    return;
  }

  try {
    const response = await fetch("models.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const models = await response.json();
    const model = models.find(m => m.id === modelId);

    if (!model) {
      main.innerHTML = `
        <div class="text-center text-white py-20 text-xl">Model not found.</div>
      `;
      return;
    }

    // ------------------------------
    // Populate Model Data
    // ------------------------------
    document.title = `${model.name} - AI Model Details`;

    titleEl.textContent = model.name;
    descEl.textContent = model.description;
    categoryEl.textContent = model.category;
    typeEl.textContent = model.type;
    imageEl.style.backgroundImage = `url('${model.image}')`;
    linkEl.href = model.link;

    // Category tag coloring (optional enhancement)
    const categoryColors = {
      writing: "bg-purple-600/40 text-purple-300 border border-purple-500/40",
      coding: "bg-blue-600/40 text-blue-300 border border-blue-500/40",
      design: "bg-pink-600/40 text-pink-300 border border-pink-500/40",
      productivity: "bg-green-600/40 text-green-300 border border-green-500/40",
      research: "bg-yellow-600/40 text-yellow-300 border border-yellow-500/40",
      default: "bg-gray-700/40 text-gray-300 border border-gray-500/40"
    };
    categoryEl.className = `
      inline-block px-3 py-1 text-xs font-medium rounded-full 
      ${categoryColors[model.category.toLowerCase()] || categoryColors.default}
    `;

    // ------------------------------
    // Load Related Models
    // ------------------------------
    const related = models
      .filter(m => m.category === model.category && m.id !== model.id)
      .slice(0, 6);

    if (related.length === 0) {
      relatedGrid.innerHTML = `
        <p class="text-gray-400">No related models found in this category.</p>
      `;
    } else {
      relatedGrid.innerHTML = related
        .map(r => `
          <a href="model.html?id=${r.id}" 
             class="block bg-[#1a1f25] hover:bg-[#222831] transition-all rounded-xl overflow-hidden group shadow-md hover:shadow-lg hover:scale-[1.02] duration-300">
            <div class="w-full h-40 sm:h-48 bg-cover bg-center" 
                 style="background-image: url('${r.image}')"></div>
            <div class="flex flex-col flex-1 p-4">
              <h4 class="text-purple-400 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">
                ${r.name}
              </h4>
              <p class="text-gray-300 text-sm mb-3 line-clamp-3">${r.description}</p>
              <span class="inline-block px-3 py-1 text-xs font-medium rounded-full 
                ${categoryColors[r.category.toLowerCase()] || categoryColors.default}">
                ${r.category}
              </span>
            </div>
          </a>
        `)
        .join("");
    }

  } catch (error) {
    console.error("Error loading model data:", error);
    main.innerHTML = `
      <div class="text-center text-white py-20 text-xl">Error loading model data.</div>
    `;
  }
});
