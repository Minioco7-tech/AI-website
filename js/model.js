import { fetchJSON, categoryColors, getCategoryName } from './utils.js';
console.log("✅ model.js imports:", { fetchJSON, categoryColors, getCategoryName });

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Model JS loaded");

  // Feather icons
  if (window.feather) feather.replace();

  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model");

  const modelDiv = document.getElementById("modelContent");
  if (!modelDiv) {
    console.error("modelContent element not found");
    return;
  }

  if (!modelName) {
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">No model specified.</p>';
    return;
  }
  
  // ------------------------------
  // Shared card builder
  // ------------------------------
  function createModelCard(model) {
    const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';

    return `
      <a href="model.html?model=${encodeURIComponent(model.name)}"
         class="model-tile flex flex-col flex-shrink-0 w-full sm:w-[80%] md:w-[28%] max-w-xs md:max-w-[320px]
                rounded-lg overflow-hidden snap-center group mx-auto pb-6 
                transition transform duration-300 hover:scale-[1.03] border border-white border-opacity-10">

        <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-t-lg"
             style="background-image: url('${model.image}')"></div>

        <div class="flex flex-col flex-1 p-4 text-left">
          <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2 group-hover:text-[#00BFFF] transition">
            ${model.name}
          </h3>
          <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">
            ${model.description}
          </p>
          <div class="flex flex-wrap gap-2 mt-auto">
            <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
              ${getCategoryName(model.category)}
            </span>
          </div>
        </div>
      </a>
    `;
  }

  // ------------------------------
  // Fetch + display model
  // ------------------------------
  try {
    const models = await fetchJSON("models.json");
    if (!models || models.length === 0) throw new Error("No models loaded");

    const model = models.find(m => m.name === modelName);
    if (!model) {
      modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Model not found.</p>';
      return;
    }

    // Main model info
    modelDiv.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex-1">
          <h1 class="text-3xl sm:text-4xl font-bold text-white">${model.name}</h1>
          <p class="text-gray-300 mt-2">${model.description}</p>
          <div class="mt-2 text-sm text-gray-400">
            Category: <span class="text-primary font-semibold">${getCategoryName(model.category)}</span>
          </div>
        </div>
        <button id="tryButton" class="btn-primary px-6 py-3 text-white font-bold rounded-lg whitespace-nowrap">
          Try this Model
        </button>
      </div>
    `;

    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // ------------------------------
// Related Models Carousel
// ------------------------------
const related = models
  .filter(m => m.category === model.category && m.name !== model.name)
  .slice(0, 12); // max 12 related

const carousel = document.getElementById("relatedCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (!carousel) {
    console.error("relatedCarousel element not found");
  } else if (related.length === 0) {
    carousel.innerHTML = '<p class="text-gray-400 text-center w-full">No other models in this category yet.</p>';
  } else {
    // Inject cards
    carousel.innerHTML = related.map(createModelCard).join("");
  
    // Feather icons for arrows
    if (window.feather) feather.replace();
  
    // Center if fewer than 3
    if (related.length < 3) {
      carousel.classList.add("justify-center");
    } else {
      carousel.classList.remove("justify-center");
    }
  
    // ------------------------------
    // Scroll Behavior
    // ------------------------------
  
    // Helper: get total card width including gap
    function getCardWidth() {
      const card = carousel.querySelector(".model-tile");
      if (!card) return 300; // fallback
      const style = window.getComputedStyle(card);
      const marginRight = parseInt(style.marginRight) || 0;
      return card.offsetWidth + marginRight;
    }
  
    // Scroll by 3 cards (desktop)
    function scrollDesktop(direction = "next") {
      const scrollAmount = getCardWidth() * 3;
      carousel.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  
    prevBtn?.addEventListener("click", () => scrollDesktop("prev"));
    nextBtn?.addEventListener("click", () => scrollDesktop("next"));
  
    // Optional: hide arrows at start/end
    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      prevBtn.style.display = carousel.scrollLeft > 0 ? "flex" : "none";
      nextBtn.style.display = carousel.scrollLeft < maxScroll - 5 ? "flex" : "none";
    }
  
    carousel.addEventListener("scroll", updateArrows);
    updateArrows(); // initial
  }


  } catch (err) {
    console.error("Error showing models grid:", err);
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
