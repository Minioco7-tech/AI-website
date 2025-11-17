// model.js — Displays a single model's details + related model carousel
// Page: model.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  getCategoryName,
  categoryColors,
  normalizeCategories,
  scoreModelRelevance
} from './utils.js';

import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';
import {
  section,
  renderFeatureList,
  renderUseCases,
  renderPricing,
  renderProsCons,
  renderScreenshots
} from './modelSections.js';

let relatedModels = [];
let currentIndex = 0;
let modelsPerView = 3;
let observer;


// ------------------------------
// ✅ DOM References
// ------------------------------
const modelDetailsEl = document.getElementById('model-details');
const grid = document.getElementById('carousel-grid');
const dotsContainer = document.getElementById('carousel-dots');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');


// ------------------------------
// ✅ On Page Load
// ------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const modelName = new URLSearchParams(window.location.search).get('model');

  // Lazy-load backgrounds (for any present elements)
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        observer.unobserve(el);
      }
    });
  });
  lazyBackgrounds.forEach(el => observer.observe(el));

  // ------------------------------
  // ✅ Load models.json and find current model
  // ------------------------------
  const models = await fetchJSON('models.json');
  const model = models.find(m => m.name.toLowerCase() === modelName?.toLowerCase());

  if (!model) {
    modelDetailsEl.innerHTML = `<p class="text-red-400 text-lg">Model not found.</p>`;
    return;
  }

  // Normalize category array
  const modelCategories = normalizeCategories(model.category);
  const firstCategory = modelCategories[0] || 'all';


  // ------------------------------
  // ✅ Breadcrumb Setup
  // Uses sessionStorage to remember navigation path
  // ------------------------------
  let breadcrumbItems = [{ label: 'Home', href: 'index.html' }];
  const source = sessionStorage.getItem('breadcrumbSource');

  if (source === 'category') {
    const catName = sessionStorage.getItem('breadcrumbCategory') || getCategoryName(firstCategory);
    breadcrumbItems.push({ label: catName, href: `category.html?category=${encodeURIComponent(firstCategory)}` });
  } else if (source === 'search') {
    const query = sessionStorage.getItem('breadcrumbSearchQuery') || 'Search Results';
    breadcrumbItems.push({ label: 'Search Results', href: `search.html?q=${encodeURIComponent(query)}` });
  } else {
    // Fallback
    breadcrumbItems.push({ label: getCategoryName(firstCategory), href: `category.html?category=${encodeURIComponent(firstCategory)}` });
  }

  breadcrumbItems.push({ label: model.name });
  renderBreadcrumb(breadcrumbItems);


  // ------------------------------
  // ✅ Build Category Pills
  // ------------------------------
  const categoryPills = modelCategories.map(cat => {
    const colorClass = categoryColors[cat] || 'bg-black/20';
    return `<span class="inline-block px-4 py-1 rounded-full text-sm font-medium text-white ${colorClass}">
              ${getCategoryName(cat)}
            </span>`;
  }).join('');


  // ------------------------------
  // ✅ Render Model Detail Content
  // ------------------------------
  modelDetailsEl.innerHTML = `
    <div class="max-w-3xl mx-auto">

      <!-- Title & Subtitle -->
      <h1 class="text-4xl font-bold text-white mb-2">${model.name}</h1>
      ${model.subtitle ? `<p class="text-gray-400 text-lg mb-6">${model.subtitle}</p>` : ""}

      <!-- Image -->
      <img src="${model.image}" alt="${model.name}"
        class="rounded-lg w-full mb-6 max-h-64 object-cover">

      <!-- Call to Action -->
      <a href="${model.link}" target="_blank" rel="noopener noreferrer"
         class="btn-primary px-4 py-2 text-sm font-medium mb-6 inline-block">
         Visit Website ↗
      </a>

      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-6">
        ${categoryPills}
      </div>

      <!-- Overview -->
      ${section(
        "Overview",
        `<p class="text-gray-300 leading-relaxed whitespace-pre-line">
          ${model.description}
        </p>`
      )}

      <!-- Optional Sections (Only render if the data exists) -->
      ${renderFeatureList(model.features)}
      ${renderUseCases(model.use_cases)}
      ${renderPricing(model.pricing)}
      ${renderProsCons(model.pros, model.cons)}
      ${renderScreenshots(model.screenshots)}

    </div>
  `;


  // ------------------------------
  // ✅ Related Models Carousel
  // Show other models that share ANY category
  // ------------------------------
  relatedModels = models
    .filter(m => m.id !== model.id) // skip current
    .map(m => {
      const mCats = normalizeCategories(m.category);
      const sharesCategory = mCats.some(cat => modelCategories.includes(cat));
      if (!sharesCategory) return null;

      const tokens = [...model.name.toLowerCase().split(/\s+/), ...modelCategories];
      const score = scoreModelRelevance(m, tokens, model.name);
      return { model: m, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(entry => entry.model);


  // ------------------------------
  // ✅ Carousel State & Setup
  // ------------------------------
  modelsPerView = window.innerWidth <= 768 ? 1 : 3;
  currentIndex = 0;

  renderGridPage();
  renderDots();
  window.addEventListener('resize', () => {
    modelsPerView = window.innerWidth <= 768 ? 1 : 3;
    renderDots();
  });

  // Arrows navigation
  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderGridPage();
    }
  });

  rightArrow.addEventListener('click', () => {
    const maxIndex = Math.ceil(relatedModels.length / modelsPerView) - 1;
    if (currentIndex < maxIndex) {
      currentIndex++;
      renderGridPage();
    }
  });

  if (window.innerWidth <= 768) {
    let startX = 0;
    grid.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    grid.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 30) {
        diff < 0 ? rightArrow.click() : leftArrow.click();
      }
    });
  }
});

// ======================
// ✅ Carousel Functions
// ======================

function renderGridPage() {
  grid.classList.add('opacity-0', 'scale-95');

  setTimeout(() => {
    grid.innerHTML = '';
    const start = currentIndex * modelsPerView;
    const pageModels = relatedModels.slice(start, start + modelsPerView);

    pageModels.forEach(model => {
      const card = createModelCard(model);
      grid.appendChild(card);
    });

    // Re-observe new backgrounds
    const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
    lazyBackgrounds.forEach(el => observer.observe(el));

    updateDots();
    grid.classList.remove('opacity-0', 'scale-95');
  }, 150);
}

function renderDots() {
  if (window.innerWidth <= 768) {
    renderDotsMobile();
  } else {
    renderDotsDesktop();
  }
}

function renderDotsDesktop() {
  const totalPages = Math.ceil(relatedModels.length / modelsPerView);
  dotsContainer.innerHTML = '';

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('span');
    dot.className = `carousel-dot w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'} cursor-pointer`;
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      if (i !== currentIndex) {
        currentIndex = i;
        renderGridPage();
      }
    });
    dotsContainer.appendChild(dot);
  }
}

function renderDotsMobile() {
  const totalPages = Math.ceil(relatedModels.length / modelsPerView);
  const maxDots = 5;
  const middleIndex = Math.floor(maxDots / 2);
  dotsContainer.innerHTML = '';

  for (let i = 0; i < maxDots; i++) {
    const pageIndex = currentIndex - middleIndex + i;

    const dot = document.createElement('span');
    dot.dataset.index = pageIndex;

    dot.className = getDotClass(pageIndex, currentIndex);

    if (pageIndex < 0 || pageIndex >= totalPages) {
      dot.style.opacity = 0;
      dot.style.pointerEvents = 'none';
    } else {
      dot.addEventListener('click', () => {
        if (pageIndex !== currentIndex) {
          dot.classList.add('clicked');
          setTimeout(() => dot.classList.remove('clicked'), 250);
          currentIndex = pageIndex;
          renderGridPage();
        }
      });
    }

    dotsContainer.appendChild(dot);
  }
}

function getDotClass(dotIndex, currentIndex) {
  const distance = Math.abs(dotIndex - currentIndex);

  if (dotIndex === currentIndex) {
    return 'carousel-dot w-3 h-3 rounded-full bg-white cursor-pointer';
  } else if (distance === 1) {
    return 'carousel-dot w-3 h-3 rounded-full bg-white/50 cursor-pointer';
  } else {
    return 'carousel-dot w-3 h-3 rounded-full bg-white/20 cursor-pointer';
  }
}

function updateDots() {
  renderDots();
}
