// models.js — Fetch & render models

async function loadModel() {
  const params = new URLSearchParams(window.location.search);
  const modelId = params.get("id");

  if (!modelId) {
    document.getElementById("modelTitle").textContent = "Model not found";
    return;
  }

  try {
    const response = await fetch("./models.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const models = await response.json();

    const model = models.find(m => m.id === modelId);
    if (!model) {
      document.getElementById("modelTitle").textContent = "Model not found";
      return;
    }

    // Fill model info
    document.getElementById("modelTitle").textContent = model.name;
    document.getElementById("modelDescription").textContent = model.description;
    document.getElementById("tryModelBtn").href = model.url || "#";
    document.getElementById("modelNameText").textContent = model.name;

    // Rating (show stars dynamically)
    const ratingContainer = document.getElementById("modelRating");
    const rating = Math.round(model.rating || 4.5);
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("i");
      star.setAttribute("data-feather", i <= rating ? "star" : "star");
      star.classList.add(i <= rating ? "text-yellow-400" : "text-gray-500");
      ratingContainer.appendChild(star);
    }

    // Related models
    const relatedModels = models
      .filter(m => m.category === model.category && m.id !== model.id)
      .slice(0, 3);

    const grid = document.getElementById("relatedModelsGrid");
    grid.innerHTML = "";

    relatedModels.forEach(rm => {
      const card = document.createElement("a");
      card.href = `model.html?id=${rm.id}`;
      card.className =
        "bg-[#1C1E22] rounded-lg overflow-hidden flex flex-col transition hover:scale-[1.02] border border-white border-opacity-10";
      card.innerHTML = `
        <div class="h-40 bg-cover bg-center" style="background-image: url('${rm.image}')"></div>
        <div class="p-4 flex flex-col flex-grow">
          <h4 class="text-white font-bold text-lg mb-2">${rm.name}</h4>
          <p class="text-gray-400 text-sm flex-grow mb-4">${rm.description}</p>
          <span class="text-[#00BFFF] font-semibold text-sm">View Model →</span>
        </div>
      `;
      grid.appendChild(card);
    });

    feather.replace();

  } catch (err) {
    console.error("Failed to load model:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadModel);
