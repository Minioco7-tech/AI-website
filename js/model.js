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
let modelsPerView = window.innerWidth <= 768 ? 1 : 3;
let observer;
let cardStep = 0;        
const MAX_MODELS = 10; 

// ------------------------------
// ✅ DOM References
// ------------------------------
const modelDetailsEl = document.getElementById('model-details');


// ------------------------------
// ✅ On Page Load
// ------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const modelName = new URLSearchParams(window.location.search).get('model');

  // ------------------------------
  // ✅ Load models.json and find current model
  // ------------------------------
  const models = await fetchJSON('models.json');
  const model = models.find(m => m.name.toLowerCase() === modelName?.toLowerCase());

  if (!model) {
    modelDetailsEl.innerHTML = `<p class="text-red-400 text-lg">Model not found.</p>`;
    return;
  }

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
    breadcrumbItems.push({
      label: 'Search Results',
      href: `search.html?q=${encodeURIComponent(storedSearchQuery)}`
    });
  } else {
    const categoryKey = storedCategoryKey || firstCategory;
    if (categoryKey) {
      breadcrumbItems.push({
        label: getCategoryName(categoryKey),
        href: `category.html?category=${encodeURIComponent(categoryKey)}`
      });
    }
  }

  breadcrumbItems.push({ label: model.name });
  renderBreadcrumb(breadcrumbItems);

  // ------------------------------
  // ✅ Build Category Pills & Tags
  // ------------------------------
  const accentGradient = categoryColors[firstCategory] || 'bg-gradient-to-br from-[#0F172A] to-[#020617]';

  const categoryPills = modelCategories.map(cat => {
    const colorClass = categoryColors[cat] || 'bg-black/20';
    return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${colorClass}">
              ${getCategoryName(cat)}
            </span>`;
  }).join('');

  const tagPills = (model.tags && model.tags.length)
    ? model.tags.map(tag => `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                     bg-white/5 text-gray-200 border border-white/10">#${tag}</span>`).join('')
    : '';

  const overviewText = model.subtitle || (model.description ? model.description.split('\n\n')[0] : '');

  // ------------------------------
  // ✅ Inject Model HTML
  // ------------------------------
  modelDetailsEl.innerHTML = `
    <div class="w-full space-y-10">
      <!-- TOP HERO ROW -->
      <section class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        <div class="lg:col-span-3 rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7 flex flex-col gap-6">
          <div class="space-y-3">
            <p class="text-[11px] tracking-[0.3em] uppercase text-gray-400">AI Tool Overview</p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">${model.name}</h1>
            ${model.subtitle ? `<p class="text-sm sm:text-base text-gray-300 leading-relaxed">${model.subtitle}</p>` : ''}
            <div class="flex flex-wrap items-center gap-3 mt-2">
              ${model.type ? `<span class="inline-flex items-center rounded-full bg-white/5 border border-white/10 
                               px-3 py-1 text-xs font-medium text-gray-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>${model.type}</span>` : ''}
              ${categoryPills}
            </div>
            ${tagPills ? `<div class="flex flex-wrap gap-2 mt-2">${tagPills}</div>` : ''}
          </div>
          <div class="flex flex-wrap items-center gap-3 mt-auto">
            <a href="${model.link}" target="_blank" rel="noopener noreferrer"
               class="btn-primary px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
               Try ${model.name}
            </a>
          </div>
        </div>
        <div class=" lg:col-span-2 model-tile rounded-3xl overflow-hidden border border-white/10 bg-black/30 transition-transform duration-300 hover:scale-[1.03] ">
          <div class="thumb bg-cover bg-center w-full h-[320px] md:h-[360px]" style="background-image: url('${model.image}');"></div>
        </div>
      </section>
      <!-- COLORED OVERVIEW CARD -->
      <section class="relative rounded-3xl border border-white/10 bg-[#020617] overflow-hidden p-6 sm:p-7">
        <div class="absolute inset-0 opacity-40 blur-3xl ${accentGradient}"></div>
        <div class="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-3 max-w-2xl">
            <p class="text-[11px] tracking-[0.3em] uppercase text-gray-300/90">At a glance</p>
            <h2 class="text-xl sm:text-2xl font-semibold text-white">What ${model.name} is best at</h2>
            ${overviewText ? `<p class="text-sm sm:text-base text-gray-100 leading-relaxed">${overviewText}</p>` : ''}
          </div>
          <div class="grid grid-cols-1 gap-4 text-sm text-gray-100 sm:w-72">
            <div class="rounded-2xl bg-black/30 border border-white/10 px-4 py-3 space-y-1">
              <p class="text-[11px] uppercase tracking-[0.2em] text-gray-400">Highlights</p>
              ${model.type ? `<p><span class="text-gray-400">Type:</span> ${model.type}</p>` : ''}
              <p><span class="text-gray-400">Category:</span> ${getCategoryName(firstCategory)}</p>
              ${model.tags?.length ? `<p><span class="text-gray-400">Tags:</span> ${model.tags.slice(0, 3).join(', ')}</p>` : ''}
            </div>
            ${model.pricing ? `<div class="rounded-2xl bg-black/30 border border-white/10 px-4 py-3 space-y-1">
                <p class="text-[11px] uppercase tracking-[0.2em] text-gray-400">Pricing snapshot</p>
                <p class="text-gray-100 leading-relaxed">${model.pricing}</p>
              </div>` : ''}
          </div>
        </div>
      </section>
      <!-- DESCRIPTION + FEATURES -->
      <section class="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-10">
        <div class="lg:col-span-4 rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
          <h3 class="text-xl sm:text-2xl font-semibold mb-3">Description</h3>
          <p class="text-gray-200 leading-relaxed whitespace-pre-line">${model.description}</p>
        </div>
        <div class="lg:col-span-3 space-y-5">
          ${model.features?.length ? `<div class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
            <h3 class="text-lg sm:text-xl font-semibold mb-3">Key features</h3>
            <ul class="space-y-3">${model.features.map(f => `<li class="flex gap-3"><span class="mt-[6px] w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span><span class="text-sm text-gray-200">${f}</span></li>`).join('')}</ul></div>` : ''}
          ${model.information?.length ? `<div class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
            <h3 class="text-lg sm:text-xl font-semibold mb-3">Model information</h3>
            <ul class="space-y-2 text-sm text-gray-200">${model.information.map(item => `<li class="flex gap-2"><span class="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span><p class="leading-relaxed"><strong class="text-gray-100">${item.label}:</strong>${typeof item.value === "string" && item.value.startsWith("http") ? `<a href="${item.value}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${item.value}</a>` : item.value}</p></li>`).join('')}</ul></div>` : ''}
        </div>
      </section>
      <!-- USE CASES -->
      ${model.use_cases?.length ? `<section class="rounded-3xl border border-white/15 bg-black/20 p-6 sm:p-7">
        <h3 class="text-xl sm:text-2xl font-semibold mb-4">Use cases</h3>
        <div class="space-y-5">${model.use_cases.map(u => `<article class="flex gap-3"><span class="mt-2 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span><div><h4 class="text-base sm:text-lg font-semibold text-white">${u.title}</h4><p class="text-sm text-gray-200 leading-relaxed">${u.description}</p></div></article>`).join('')}</div>
      </section>` : ''}
    </div>
  `;
  // ------------------------------
  // ✅ Related Models Carousel (DRY, page-based, fixed dot window)
  // ------------------------------
  function initCarousel(track, dotsContainer, leftArrow, rightArrow, models) {
    const MAX_MODELS = 12;
  
    let relatedModels = [];
    let modelsPerView = window.innerWidth < 768 ? 1 : 3;
    let visibleDots = window.innerWidth < 768 ? 3 : 4;
  
    let currentPage = 0;
    let cardStep = 0; // card width + gap
  
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  
    function extractTokens(text) {
      return text?.toLowerCase().split(/\W+/).filter(Boolean) || [];
    }
  
    function getGapPx() {
      // Uses actual CSS gap on the track so we stay DRY
      const cs = getComputedStyle(track);
      // Most browsers expose `gap`; some expose columnGap for flex
      const g = parseFloat(cs.gap || cs.columnGap || "16");
      return Number.isFinite(g) ? g : 16;
    }
  
    function computeStep() {
      const firstCard = track.children[0];
      if (!firstCard) return;
  
      const gap = getGapPx();
      const w = firstCard.getBoundingClientRect().width;
      cardStep = w + gap;
    }
  
    function totalPages() {
      return Math.max(1, Math.ceil(relatedModels.length / modelsPerView));
    }
  
    function clampPage() {
      const maxPage = totalPages() - 1;
      currentPage = Math.min(Math.max(0, currentPage), maxPage);
    }
  
    function setArrowState() {
      const maxPage = totalPages() - 1;
  
      const disableLeft = currentPage <= 0;
      const disableRight = currentPage >= maxPage;
  
      leftArrow.classList.toggle("is-disabled", disableLeft);
      rightArrow.classList.toggle("is-disabled", disableRight);
  
      leftArrow.setAttribute("aria-disabled", String(disableLeft));
      rightArrow.setAttribute("aria-disabled", String(disableRight));
  
      // Keep buttons focusable but prevent click action when disabled
      leftArrow.disabled = disableLeft;
      rightArrow.disabled = disableRight;
    }
  
    function updatePosition() {
      clampPage();
  
      // If not enough models to scroll, center them and lock transform
      if (relatedModels.length <= modelsPerView) {
        track.classList.add("is-centered");
        track.style.transform = "translateX(0px)";
        dotsContainer.innerHTML = ""; // no dots if nothing to page
        setArrowState();
        return;
      } else {
        track.classList.remove("is-centered");
      }
  
      const offset = currentPage * cardStep * modelsPerView;
  
      // Respect reduced motion
      if (prefersReducedMotion) {
        track.style.transition = "none";
        requestAnimationFrame(() => {
          track.style.transform = `translateX(-${offset}px)`;
          // Restore transition for normal use if user toggles later
          track.style.transition = "";
        });
      } else {
        track.style.transform = `translateX(-${offset}px)`;
      }
  
      // Update dot active state
      [...dotsContainer.children].forEach((dot) => {
        const page = Number(dot.dataset.page);
        dot.classList.toggle("active", page === currentPage);
      });
  
      setArrowState();
    }
  
    function dotWindowStart() {
      const pages = totalPages();
      if (pages <= visibleDots) return 0;
  
      // Center window around current page
      const half = Math.floor(visibleDots / 2);
      let start = currentPage - half;
  
      // Clamp start so window stays within [0, pages-visibleDots]
      start = Math.max(0, Math.min(start, pages - visibleDots));
      return start;
    }
  
    function renderDots() {
      dotsContainer.innerHTML = "";
  
      const pages = totalPages();
      if (relatedModels.length <= modelsPerView) return;
  
      const start = dotWindowStart();
      const count = Math.min(visibleDots, pages);
  
      for (let i = 0; i < count; i++) {
        const page = start + i;
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.dataset.page = String(page);
        dot.setAttribute("aria-label", `Go to related models page ${page + 1}`);
  
        dot.addEventListener("click", () => {
          currentPage = page;
          renderDots();     // window may shift
          updatePosition();
        });
  
        dotsContainer.appendChild(dot);
      }
    }
  
    function applyResponsiveState() {
      const isMobile = window.innerWidth < 768;
      modelsPerView = isMobile ? 1 : 3;
      visibleDots = isMobile ? 3 : 4;
    }
  
    function updateLayout() {
      applyResponsiveState();
      computeStep();
      renderDots();
      updatePosition();
    }
  
    function go(delta) {
      currentPage += delta;
      renderDots();   // keep dot window in sync
      updatePosition();
    }
  
    // Arrow clicks
    leftArrow.addEventListener("click", () => go(-1));
    rightArrow.addEventListener("click", () => go(1));
  
    // Swipe support (mobile)
    let startX = 0;
    let startY = 0;
  
    track.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });
  
    track.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      const dx = startX - t.clientX;
      const dy = startY - t.clientY;
  
      // Ignore mostly-vertical gestures
      if (Math.abs(dy) > Math.abs(dx)) return;
  
      if (Math.abs(dx) > 50) {
        if (dx > 0) go(1);
        else go(-1);
      }
    }, { passive: true });
  
    // Recompute sizes on resize + when cards/images settle
    window.addEventListener("resize", () => {
      const prevPage = currentPage;
      updateLayout();
      currentPage = Math.min(prevPage, totalPages() - 1);
      renderDots();
      updatePosition();
    });
  
    const ro = new ResizeObserver(() => updateLayout());
    ro.observe(track);
  
    function renderRelated(currentModel) {
      track.innerHTML = "";
  
      const tokens = extractTokens(`${currentModel.name} ${currentModel.description || ""}`);
  
      relatedModels = models
        .filter((m) => m.name !== currentModel.name)
        .map((m) => ({ model: m, score: scoreModelRelevance(m, tokens) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_MODELS)
        .map((x) => x.model);
  
      relatedModels.forEach((m) => {
        const card = createModelCard(m);
        // IMPORTANT: don't force widths in JS; CSS handles exact 3/1 layout DRYly
        track.appendChild(card);
      });
  
      currentPage = 0;
      updateLayout();
    }
  
    return renderRelated;
  }
  
  // Usage (keeps your existing IDs/classes)
  const track = document.getElementById("carousel-grid");
  const dotsContainer = document.getElementById("carousel-dots");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  
  if (track && dotsContainer && leftArrow && rightArrow) {
    const render = initCarousel(track, dotsContainer, leftArrow, rightArrow, models);
    render(model);
  }
}); 

