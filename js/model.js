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
  // ------------------------------
  let breadcrumbItems = [{ label: 'Home', href: 'index.html' }];

  const source = sessionStorage.getItem('breadcrumbSource');
  const storedCategoryKey = sessionStorage.getItem('breadcrumbCategoryKey');
  const storedSearchQuery = sessionStorage.getItem('breadcrumbSearchQuery');

  if (source === 'search' && storedSearchQuery) {
    // Came from search results
    breadcrumbItems.push({
      label: 'Search Results',
      href: `search.html?q=${encodeURIComponent(storedSearchQuery)}`
    });
  } else {
    // Came from category OR direct link
    const categoryKey = storedCategoryKey || firstCategory;

    if (categoryKey) {
      breadcrumbItems.push({
        label: getCategoryName(categoryKey), // ✅ DRY: always use utils
        href: `category.html?category=${encodeURIComponent(categoryKey)}`
      });
    }
  }

  // Active crumb = model name
  breadcrumbItems.push({ label: model.name });

  renderBreadcrumb(breadcrumbItems);


  // ------------------------------
  // ✅ Build Category Pills
  // ------------------------------
  // Accent gradient from primary category (for highlight card glow)
  const accentGradient = categoryColors[firstCategory] || 'bg-gradient-to-br from-[#0F172A] to-[#020617]';
  
  // Category pills
  const categoryPills = modelCategories.map(cat => {
    const colorClass = categoryColors[cat] || 'bg-black/20';
    return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${colorClass}">
              ${getCategoryName(cat)}
            </span>`;
  }).join('');
  
  // Tags
  const tagPills = (model.tags && model.tags.length)
    ? model.tags.map(tag => `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                     bg-white/5 text-gray-200 border border-white/10">
          #${tag}
        </span>
      `).join('')
    : '';
  
  // Short overview text for highlight card (fallback to first paragraph of description)
  const overviewText = model.subtitle 
    || (model.description ? model.description.split('\n\n')[0] : '');
  
  modelDetailsEl.innerHTML = `
    <div class="w-full space-y-10">
  
      <!-- ========================== -->
      <!-- TOP HERO ROW -->
      <!-- ========================== -->
      <section class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
  
        <!-- LEFT: Title / meta / actions -->
        <div class="lg:col-span-3 rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7 flex flex-col gap-6">
          
          <div class="space-y-3">
            <p class="text-[11px] tracking-[0.3em] uppercase text-gray-400">
              AI Tool Overview
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">
              ${model.name}
            </h1>
  
            ${model.subtitle ? `
              <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
                ${model.subtitle}
              </p>
            ` : ''}
  
            <div class="flex flex-wrap items-center gap-3 mt-2">
              ${model.type ? `
                <span class="inline-flex items-center rounded-full bg-white/5 border border-white/10 
                               px-3 py-1 text-xs font-medium text-gray-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                  ${model.type}
                </span>
              ` : ''}
  
              ${categoryPills}
            </div>
  
            ${tagPills ? `
              <div class="flex flex-wrap gap-2 mt-2">
                ${tagPills}
              </div>
            ` : ''}
          </div>
  
          <div class="flex flex-wrap items-center gap-3 mt-auto">
            <a href="${model.link}"
               target="_blank"
               rel="noopener noreferrer"
               class="btn-primary px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
              Try ${model.name}
            </a>
          </div>
        </div>
  
        <!-- RIGHT: Image card -->
        <div class="lg:col-span-2 rounded-3xl border border-white/15 bg-black/30 overflow-hidden">
          <div class="w-full h-full max-h-[320px] md:max-h-[360px] border-4 border-white/10 rounded-3xl overflow-hidden">
            <img src="${model.image}"
                 alt="${model.name}"
                 class="w-full h-full object-cover">
          </div>
        </div>
      </section>
  
      <!-- ========================== -->
      <!-- COLORED OVERVIEW CARD -->
      <!-- ========================== -->
      <section class="relative rounded-3xl border border-white/10 bg-[#020617] overflow-hidden p-6 sm:p-7">
        <div class="absolute inset-0 opacity-40 blur-3xl ${accentGradient}"></div>
  
        <div class="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-3 max-w-2xl">
            <p class="text-[11px] tracking-[0.3em] uppercase text-gray-300/90">
              At a glance
            </p>
            <h2 class="text-xl sm:text-2xl font-semibold text-white">
              What ${model.name} is best at
            </h2>
            ${overviewText ? `
              <p class="text-sm sm:text-base text-gray-100 leading-relaxed">
                ${overviewText}
              </p>
            ` : ''}
          </div>
  
          <div class="grid grid-cols-1 gap-4 text-sm text-gray-100 sm:w-72">
            <div class="rounded-2xl bg-black/30 border border-white/10 px-4 py-3 space-y-1">
              <p class="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                Highlights
              </p>
              ${model.type ? `<p><span class="text-gray-400">Type:</span> ${model.type}</p>` : ''}
              <p><span class="text-gray-400">Category:</span> ${getCategoryName(firstCategory)}</p>
              ${model.tags?.length ? `<p><span class="text-gray-400">Tags:</span> ${model.tags.slice(0, 3).join(', ')}</p>` : ''}
            </div>
  
            ${model.pricing ? `
              <div class="rounded-2xl bg-black/30 border border-white/10 px-4 py-3 space-y-1">
                <p class="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                  Pricing snapshot
                </p>
                <p class="text-gray-100 leading-relaxed">
                  ${model.pricing}
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      </section>
  
      <!-- ========================== -->
      <!-- DESCRIPTION + FEATURES -->
      <!-- ========================== -->
      <section class="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-10">
        <!-- Description -->
        <div class="lg:col-span-4 rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
          <h3 class="text-xl sm:text-2xl font-semibold mb-3">Description</h3>
          <p class="text-gray-200 leading-relaxed whitespace-pre-line">
            ${model.description}
          </p>
        </div>
  
        <!-- Features / quick facts -->
        <div class="lg:col-span-3 space-y-5">
          ${model.features?.length ? `
            <div class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
              <h3 class="text-lg sm:text-xl font-semibold mb-3">Key features</h3>
              <ul class="space-y-3">
                ${model.features.map(f => `
                  <li class="flex gap-3">
                    <span class="mt-[6px] w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
                    <span class="text-sm text-gray-200">${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
  
          ${model.information?.length ? `
            <div class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
              <h3 class="text-lg sm:text-xl font-semibold mb-3">Model information</h3>
              <ul class="space-y-2 text-sm text-gray-200">
                ${model.information.map(item => `
                  <li class="flex gap-2">
                    <span class="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                    <p class="leading-relaxed">
                      <strong class="text-gray-100">${item.label}:</strong>
                      ${
                        typeof item.value === "string" && item.value.startsWith("http")
                          ? `<a href="${item.value}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${item.value}</a>`
                          : item.value
                      }
                    </p>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </section>
  
      <!-- ========================== -->
      <!-- USE CASES -->
      <!-- ========================== -->
      ${model.use_cases?.length ? `
        <section class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
          <h3 class="text-xl sm:text-2xl font-semibold mb-4">Use cases</h3>
          <div class="space-y-5">
            ${model.use_cases.map(u => `
              <article class="flex gap-3">
                <span class="mt-2 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
                <div>
                  <h4 class="text-base sm:text-lg font-semibold text-white">${u.title}</h4>
                  <p class="text-sm text-gray-200 leading-relaxed">${u.description}</p>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      ` : ''}
  
    </div>
  `;

// ------------------------------
// ✅ Related Models Carousel
// ------------------------------
// Run AFTER modelDetailsEl.innerHTML is set
const initCarousel = () => {
  const grid = document.getElementById('carousel-grid');
  const dotsContainer = document.getElementById('carousel-dots');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  if (!grid || !dotsContainer || !leftArrow || !rightArrow) return;

  // Filter related models
  relatedModels = models
    .filter(m => m.id !== model.id)
    .map(m => {
      const mCats = normalizeCategories(m.category);
      const sharesCategory = mCats.some(cat => modelCategories.includes(cat));
      if (!sharesCategory) return null;

      const tokens = [
        ...model.name.toLowerCase().split(/\s+/),
        ...modelCategories
      ];
      const score = scoreModelRelevance(m, tokens, model.name);
      return { model: m, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(entry => entry.model);

  let modelsPerView = window.innerWidth <= 768 ? 1 : 3;
  let currentIndex = 0;

  // ------------------
  // Functions
  // ------------------
  const getMaxIndex = () => Math.max(0, Math.ceil(relatedModels.length / modelsPerView) - 1);

  const clampBadgesForCarousel = (cardEl, maxVisible = 3) => {
    const badgeRow = cardEl.querySelector('.model-card-badges');
    if (!badgeRow) return;
    const pills = Array.from(badgeRow.querySelectorAll('span'));
    if (pills.length <= maxVisible) return;
    const hidden = pills.length - maxVisible;
    pills.slice(maxVisible).forEach(p => p.remove());
    const more = document.createElement('span');
    more.className = 'badge-more';
    more.textContent = `+${hidden}`;
    badgeRow.appendChild(more);
  };

  const renderGridPage = () => {
    grid.classList.add('is-transitioning');
    setTimeout(() => {
      grid.innerHTML = '';
      const start = currentIndex * modelsPerView;
      const pageModels = relatedModels.slice(start, start + modelsPerView);
      pageModels.forEach(m => {
        const card = createModelCard(m);
        const wrap = document.createElement('div');
        wrap.className = 'carousel-item';
        wrap.appendChild(card);
        clampBadgesForCarousel(card, 3);
        grid.appendChild(wrap);
      });
      updateDots();
      updateArrows();
      grid.classList.remove('is-transitioning');
    }, 120);
  };

  const updateArrows = () => {
    leftArrow.classList.toggle('disabled', currentIndex === 0);
    rightArrow.classList.toggle('disabled', currentIndex === getMaxIndex());
  };

  const renderDots = () => {
    dotsContainer.innerHTML = '';
    const totalPages = getMaxIndex() + 1;
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        if (i !== currentIndex) {
          currentIndex = i;
          renderGridPage();
        }
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  // ------------------
  // Event Listeners
  // ------------------
  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderGridPage();
    }
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      renderGridPage();
    }
  });

  let startX = 0;
  grid.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  grid.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) diff < 0 ? rightArrow.click() : leftArrow.click();
  });

  window.addEventListener('resize', () => {
    modelsPerView = window.innerWidth <= 768 ? 1 : 3;
    currentIndex = Math.min(currentIndex, getMaxIndex());
    renderGridPage();
    renderDots();
    updateArrows();
  });

  // Initial render
  renderGridPage();
  renderDots();
  updateArrows();
};

// ------------------------------
// Call carousel init after DOM content is loaded
// ------------------------------
initCarousel();
