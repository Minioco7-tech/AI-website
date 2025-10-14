document.addEventListener("DOMContentLoaded", async () => {
  // Get model name from URL (name-based routing)
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

    // Populate model details
    document.title = `${model.name} — AIviary`;
    document.getElementById("modelName").textContent = model.name;
    document.getElementById("modelDescription").textContent = model.description;
    document.getElementById("modelCategory").textContent = model.category;
    document.getElementById("modelImage").style.backgroundImage = `url('${model.image}')`;
    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // Show back to category link if last viewed category exists
    const lastCategory = localStorage.getItem("lastCategory");
    const backLink = document.getElementById("backToCategory");
    const categorySpan = document.getElementById("categoryName");
    if (lastCategory) {
      backLink.href = `category.html?category=${lastCategory}`;
      categorySpan.textContent = lastCategory.charAt(0).toUpperCase() + lastCategory.slice(1);
      backLink.classList.remove("hidden");
    }

    // Related models (same category, exclude current)
    const related = models.filter(m => m.category === model.category && m.name !== model.name).slice(0, 6);
    const relatedGrid = document.getElementById("relatedModelsGrid");

    if (related.length === 0) {
      relatedGrid.innerHTML = '<p class="text-gray-400">No other models in this category yet.</p>';
    } else {
      relatedGrid.innerHTML = related.map(r => `
        <a href="model.html?model=${encodeURIComponent(r.name)}" 
           class="block bg-[#1a1f25] hover:bg-[#222831] transition-all rounded-xl overflow-hidden group">
          <div class="w-full h-40 sm:h-48 bg-cover bg-center" style="background-image: url('${r.image}')"></div>
          <div class="flex flex-col flex-1 p-4">
            <h4 class="text-purple-400 text-lg font-bold mb-2 group-hover:text-purple-300">${r.name}</h4>
            <p class="text-gray-300 text-sm mb-3 line-clamp-3">${r.description}</p>
            <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white bg-purple-600/40">
              ${r.category}
            </span>
          </div>
        </a>
      `).join("");
    }

  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<p class="text-gray-300 text-center mt-8">Error loading model data.</p>';
  }
});
