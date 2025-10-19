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

  // ------------------------------
  // Category colors + name map
  // ------------------------------
  const categoryColors = {
    all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
    writing: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',
    creativity: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',
    learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',
    business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
    chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
    music: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',
    coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',
    science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',
    finance: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',
    everyday: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'
  };

  function getCategoryName(catKey) {
    const categories = {
      all: 'All Models',
      writing: 'Writing & Productivity',
      creativity: 'Creativity & Design',
      learning: 'Learning & Research',
      business: 'Business & Marketing',
      chatbots: 'Chatbots & Agents',
      audio: 'Audio & Music',
      coding: 'Coding & Dev Tools',
      science: 'Science & Health',
      finance: 'Finance & Analytics',
      everyday: 'Everyday Life'
    };
    return categories[catKey?.toLowerCase()] || catKey;
  }

  // ------------------------------
  // Shared card builder (from category.js)
  // ------------------------------
  function createModelCard(model) {
    const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';

    return `
      <a href="model.html?model=${encodeURIComponent(model.name)}"
         class="model-tile flex flex-col flex-shrink-0 w-[90%] sm:w-[60%] md:w-[28%] 
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
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("Failed to fetch models.json");
    const models = await response.json();

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
            Category: <span class="text-primary font-semibold">${model.category}</span>
          </div>
        </div>
        <button id="tryButton" class="btn-primary px-6 py-3 text-white font-bold rounded-lg whitespace-nowrap">
          Try this Model
        </button>
      </div>
    `;

    document.getElementById("tryButton").onclick = () => window.open(model.link, "_blank");

    // ------------------------------
    // Related models carousel
    // ------------------------------
    const related = models.filter(m => m.category === model.category && m.name !== model.name).slice(0, 6);
    const carousel = document.getElementById("relatedCarousel");
    if (!carousel) throw new Error("relatedCarousel element not found");

    if (related.length === 0) {
      carousel.innerHTML = '<p class="text-gray-400">No other models in this category yet.</p>';
    } else {
      carousel.innerHTML = related.map(createModelCard).join("");
    }

    // Scroll arrows
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const scrollAmount = 320;

    prevBtn?.addEventListener("click", () => carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
    nextBtn?.addEventListener("click", () => carousel.scrollBy({ left: scrollAmount, behavior: "smooth" }));

  } catch (err) {
    console.error("Error showing models grid:", err);
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
