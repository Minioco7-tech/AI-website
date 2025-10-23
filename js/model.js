import { fetchJSON, categoryColors, getCategoryName } from './utils.js';
console.log("✅ model.js imports:", { fetchJSON, categoryColors, getCategoryName });

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Model JS loaded");

  // Feather icons
  if (window.feather) feather.replace();

  const carouselTrack = document.getElementById("carouselTrack");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  const mobilePrev = document.getElementById("mobilePrev");
  const mobileNext = document.getElementById("mobileNext");
  let currentMobileIndex = 0;

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
  
  if (!carousel || !related || related.length === 0) {
    if (carousel) {
      carousel.innerHTML = '<p class="text-gray-400 text-center w-full">No other models in this category yet.</p>';
    }
  } else {
    // ---------------------
    // MOBILE CAROUSEL LOGIC
    // ---------------------
    function renderMobileCarousel() {
      if (!carouselTrack || !indicatorsContainer) return;
    
      carouselTrack.innerHTML = related.map(createModelCard).join("");
    
      indicatorsContainer.innerHTML = related.map((_, idx) => `
        <div class="dot ${idx === 0 ? 'active' : ''}"></div>
      `).join("");
    
      updateMobileCarousel();
    }
  
    function updateMobileCarousel() {
      const trackWidth = carousel.offsetWidth;
      if (!carouselTrack) return;
  
      carouselTrack.style.transform = `translateX(-${currentMobileIndex * trackWidth}px)`;
  
      // Update indicators
      const dots = document.querySelectorAll('#carouselIndicators .dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentMobileIndex);
      });
  
      mobilePrev.style.opacity = currentMobileIndex === 0 ? '0.5' : '1';
      mobileNext.style.opacity = currentMobileIndex === related.length - 1 ? '0.5' : '1';
    }
  
    function initMobileCarouselEvents() {
      mobilePrev?.addEventListener("click", () => {
        if (currentMobileIndex > 0) {
          currentMobileIndex--;
          updateMobileCarousel();
        }
      });
  
      mobileNext?.addEventListener("click", () => {
        if (currentMobileIndex < related.length - 1) {
          currentMobileIndex++;
          updateMobileCarousel();
        }
      });
  
      window.addEventListener("resize", () => {
        updateMobileCarousel();
      });
    }
  
    // ---------------------
    // DESKTOP SCROLL LOGIC
    // ---------------------
    function renderDesktopCarousel() {
      const desktopCarousel = document.getElementById("relatedCarousel");
      if (!desktopCarousel) return;
    
      desktopCarousel.innerHTML = related.map(createModelCard).join("");
    
      if (window.feather) feather.replace();
    
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
    
      function getVisibleCards() {
        return 3;
      }
    
      function getCardWidth() {
        const card = desktopCarousel.querySelector(".model-tile");
        if (!card) return 300;
        const style = window.getComputedStyle(card);
        const marginRight = parseInt(style.marginRight) || 0;
        return card.offsetWidth + marginRight;
      }
    
      function scrollCarousel(direction = "next") {
        const scrollAmount = getCardWidth() * getVisibleCards();
        desktopCarousel.scrollBy({
          left: direction === "next" ? scrollAmount : -scrollAmount,
          behavior: "smooth"
        });
      }
    
      prevBtn?.addEventListener("click", () => scrollCarousel("prev"));
      nextBtn?.addEventListener("click", () => scrollCarousel("next"));
    
      function updateArrowVisibility() {
        const maxScroll = desktopCarousel.scrollWidth - desktopCarousel.clientWidth;
        prevBtn.style.display = desktopCarousel.scrollLeft > 0 ? "flex" : "none";
        nextBtn.style.display = desktopCarousel.scrollLeft < maxScroll - 5 ? "flex" : "none";
      }
    
      desktopCarousel.addEventListener("scroll", updateArrowVisibility);
      window.addEventListener("resize", updateArrowVisibility);
      updateArrowVisibility();
    }
  
    // ---------------------
    // INIT: Decide Viewport
    // ---------------------
    function initCarousel() {
      if (window.innerWidth < 768) {
        renderMobileCarousel();
        initMobileCarouselEvents();
      } else {
        renderDesktopCarousel();
      }
    }
  
    // Initial run
    initCarousel();
  
    // Re-init on resize
    window.addEventListener("resize", () => {
      // Recalculate everything if screen changes
      setTimeout(() => {
        currentMobileIndex = 0;
        initCarousel();
      }, 300);
    });
  }

  } catch (err) {
    console.error("Error showing models grid:", err);
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Error showing models grid.</p>';
  }
});
