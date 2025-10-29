// model.js — Displays a single model's details + related model carousel
// Page: model.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  getCategoryName,
  categoryColors,
  normalizeCategories
} from './utils.js';

import { createModelCard } from './modelCard.js';
import { renderBreadcrumb } from './breadcrumb.js';


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
  // ✅ Build Category Badges
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
      <h1 class="text-3xl font-bold text-white mb-4">${model.name}</h1>
      <img src="${model.image}" alt="${model.name}" class="rounded-lg w-full mb-6 max-h-64 object-cover" loading="lazy">
      <div class="mb-4">
        <a href="${model.link}" target="_blank" class="btn-primary px-4 py-2 text-sm font-medium">Try Model</a>
      </div>
      <div class="flex flex-wrap gap-2 mb-4">
        ${categoryPills}
      </div>
      <p class="text-gray-200 text-base leading-relaxed whitespace-pre-line">
        ${model.description !== 'N/A' ? model.description : 'No description provided.'}
      </p>
    </div>
  `;


  // ------------------------------
  // ✅ Related Models Carousel
  // Show other models that share ANY category
  // ------------------------------
  const relatedModels = models.filter(m => {
    if (m.id === model.id) return false; // skip current model
    const mCats = normalizeCategories(m.category);
    return mCats.some(cat => modelCategories.includes(cat));
  });


  // ------------------------------
  // ✅ Carousel State & Setup
  // ------------------------------
  const isMobile = window.innerWidth <= 768;
  const modelsPerView = isMobile ? 1 : 3;
  let currentIndex = 0;

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
    const totalDots = Math.ceil(relatedModels.length / modelsPerView);
    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.className = `carousel-dot w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'} cursor-pointer`;
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        currentIndex = i;
        renderGridPage();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.className = `carousel-dot w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'} cursor-pointer`;
    });
  }

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

  // Swipe gestures for mobile
  if (isMobile) {
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

  // Init carousel
  renderGridPage();
  renderDots();
});
