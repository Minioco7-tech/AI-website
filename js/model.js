// models.js — Fetch & render models

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const modelId = parseInt(urlParams.get("id"));

  try {
    const response = await fetch("models.json");
    const models = await response.json();

    const model = models.find(m => m.id === modelId);

    if (!model) {
      document.querySelector("main").innerHTML = `
        <div class="text-center text-white py-20 text-xl">Model not found.</div>
      `;
      return;
    }

    // Populate model data
    document.title = `${model.name} - AI Model Details`;
    document.getElementById("modelName").textContent = model.name;
    document.getElementById("modelDescription").textContent = model.description;
    document.getElementById("modelCategory").textContent = model.category;
    document.getElementById("modelType").textContent = model.type;
    document.getElementById("modelImage").style.backgroundImage = `url('${model.image}')`;
    document.getElementById("modelLink").href = model.link;

    // Load related models
    const related = models
      .filter(m => m.category === model.category && m.id !== model.id)
      .slice(0, 6);

    const relatedGrid = document.getElementById("relatedModels");

    if (related.length === 0) {
      relatedGrid.innerHTML = `<p class="text-gray-400">No related models found in this category.</p>`;
    } else {
      relatedGrid.innerHTML = related
        .map(
          (r) => `
          <a href="model.html?id=${r.id}" 
             class="block bg-[#1a1f25] hover:bg-[#222831] transition-all rounded-xl overflow-hidden group">
            <div class="w-full h-40 sm:h-48 bg-cover bg-center" 
                 style="background-image: url('${r.image}')"></div>
            <div class="flex flex-col flex-1 p-4">
              <h4 class="text-purple-400 text-lg font-bold mb-2 group-hover:text-purple-300">${r.name}</h4>
              <p class="text-gray-300 text-sm mb-3 line-clamp-3">${r.description}</p>
              <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white bg-purple-600/40">
                ${r.category}
              </span>
            </div>
          </a>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading model data:", error);
    document.querySelector("main").innerHTML = `
      <div class="text-center text-white py-20 text-xl">Error loading model data.</div>
    `;
  }
});
