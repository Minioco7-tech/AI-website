import { fetchJSON, categoryColors, getCategoryName } from './utils.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const modelName = params.get("model");
  const modelDiv = document.getElementById("modelContent");

  const desktopCarousel = document.getElementById("relatedCarousel");
  const mobileCarouselTrack = document.getElementById("carouselTrack");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  const mobilePrev = document.getElementById("mobilePrev");
  const mobileNext = document.getElementById("mobileNext");
  const desktopPrev = document.getElementById("prevBtn");
  const desktopNext = document.getElementById("nextBtn");

  let currentMobileIndex = 0;

  function createModelCard(model) {
    const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';
    return `
      <a href="model.html?model=${encodeURIComponent(model.name)}"
         class="model-tile">
        <div class="tile-image" style="background-image: url('${model.image}')"></div>
        <div class="tile-body">
          <h3>${model.name}</h3>
          <p>${model.description}</p>
          <div class="tile-category">
            <span class="${colorClass}">${getCategoryName(model.category)}</span>
          </div>
        </div>
      </a>
    `;
  }

  try {
    const models = await fetchJSON("models.json");
    if (!models || models.length === 0) throw new Error("No models loaded");

    const model = models.find(m => m.name === modelName);
    if (!model) {
      modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Model not found.</p>';
      return;
    }

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

    const related = models
      .filter(m => m.category === model.category && m.name !== model.name)
      .slice(0, 12);

    if (!related.length) {
      desktopCarousel.innerHTML = '<p class="text-gray-400 text-center w-full">No related models found.</p>';
      return;
    }

    // -------------------------
    // Mobile Carousel
    // -------------------------
    function renderMobileCarousel() {
      mobileCarouselTrack.innerHTML = related.map(createModelCard).join("");
      indicatorsContainer.innerHTML = related.map((_, i) =>
        `<div class="dot ${i === 0 ? 'active' : ''}"></div>`
      ).join("");
      updateMobileCarousel();
    }

    function updateMobileCarousel() {
      const width = mobileCarouselTrack.offsetWidth;
      mobileCarouselTrack.style.transform = `translateX(-${currentMobileIndex * width}px)`;
      document.querySelectorAll('#carouselIndicators .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentMobileIndex);
      });

      mobilePrev.style.opacity = currentMobileIndex === 0 ? "0.5" : "1";
      mobileNext.style.opacity = currentMobileIndex === related.length - 1 ? "0.5" : "1";
    }

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

    window.addEventListener("resize", updateMobileCarousel);

    // -------------------------
    // Desktop Carousel
    // -------------------------
    function renderDesktopCarousel() {
      desktopCarousel.innerHTML = related.map(createModelCard).join("");

      function getCardWidth() {
        const card = desktopCarousel.querySelector(".model-tile");
        if (!card) return 300;
        const style = window.getComputedStyle(card);
        const margin = parseInt(style.marginRight) || 16;
        return card.offsetWidth + margin;
      }

      function scrollCarousel(direction = "next") {
        const scrollAmount = getCardWidth() * 3;
        desktopCarousel.scrollBy({
          left: direction === "next" ? scrollAmount : -scrollAmount,
          behavior: "smooth"
        });
      }

      desktopPrev?.addEventListener("click", () => scrollCarousel("prev"));
      desktopNext?.addEventListener("click", () => scrollCarousel("next"));

      function updateArrowVisibility() {
        const maxScroll = desktopCarousel.scrollWidth - desktopCarousel.clientWidth;
        desktopPrev.style.display = desktopCarousel.scrollLeft > 0 ? "flex" : "none";
        desktopNext.style.display = desktopCarousel.scrollLeft < maxScroll - 5 ? "flex" : "none";
      }

      desktopCarousel.addEventListener("scroll", updateArrowVisibility);
      window.addEventListener("resize", updateArrowVisibility);
      updateArrowVisibility();
    }

    // -------------------------
    // Init
    // -------------------------
    function initCarousel() {
      if (window.innerWidth < 768) {
        renderMobileCarousel();
      } else {
        renderDesktopCarousel();
      }
    }

    initCarousel();
    window.addEventListener("resize", () => {
      currentMobileIndex = 0;
      initCarousel();
    });

  } catch (err) {
    console.error("Error:", err);
    modelDiv.innerHTML = '<p class="text-gray-300 text-center mt-8">Error loading model.</p>';
  }
});
