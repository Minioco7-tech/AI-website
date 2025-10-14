document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model"); // e.g. ?model=Grammarly%20AI

  if (!modelName) {
    document.querySelector("main").innerHTML = `<p class="text-center text-gray-400 mt-20">No model specified.</p>`;
    return;
  }

  try {
    const res = await fetch("models.json");
    if (!res.ok) throw new Error("Failed to load models.json");
    const models = await res.json();

    const model = models.find(m => m.name.toLowerCase() === decodeURIComponent(modelName).toLowerCase());
    if (!model) {
      document.querySelector("main").innerHTML = `<p class="text-center text-gray-400 mt-20">Model not found.</p>`;
      return;
    }

    // Populate main model section
    const container = document.getElementById("modelContainer");
    container.innerHTML = `
      <section class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3 text-gradient">${model.name}</h1>
        <p class="text-gray-300 max-w-2xl mx-auto">${model.description}</p>
        <div class="flex justify-center gap-3 mt-6">
          <span class="px-3 py-1 text-sm bg-[#1F1F1F] rounded-full">${model.category}</span>
          <span class="px-3 py-1 text-sm bg-[#1F1F1F] rounded-full">${model.type}</span>
        </div>
        <div class="mt-10">
          <div class="shadow-soft border border-white/10 rounded-xl overflow-hidden mx-auto" style="max-width: 700px;">
            <div style="background-image: url('${model.image}'); background-size: cover; background-position: center; height: 300px;"></div>
          </div>
        </div>
        <div class="mt-8">
          <a href="${model.link}" target="_blank" class="btn btn-primary px-6 py-3 font-semibold">Try ${model.name}</a>
        </div>
      </section>
    `;

    // Populate related models
    const relatedModels = models
      .filter(m => m.category === model.category && m.name !== model.name)
      .slice(0, 6);

    const relatedGrid = document.getElementById("relatedModels");
    if (relatedModels.length === 0) {
      relatedGrid.innerHTML = `<p class="text-gray-400">No related models found in this category.</p>`;
    } else {
      relatedGrid.innerHTML = relatedModels.map(r => `
        <div class="model-tile" onclick="window.location.href='model.html?model=${encodeURIComponent(r.name)}'">
          <div class="thumb" style="background-image: url('${r.image}')"></div>
          <div class="p-4">
            <h3>${r.name}</h3>
            <p>${r.description}</p>
          </div>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("Error loading model data:", err);
    document.querySelector("main").innerHTML = `<p class="text-center text-gray-400 mt-20">Error loading model data.</p>`;
  }
});
