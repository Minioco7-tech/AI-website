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

    <div class="w-full space-y-10">
  
      <!-- ============================================= -->
      <!-- TOP HERO ROW (Fixed desktop, mobile image inside title box)-->
      <!-- ============================================= -->
    
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
      
        <!-- LEFT = 2/5 width on desktop, full width on mobile -->
        <div class="lg:col-span-2 rounded-3xl border border-white/20 p-6 bg-transparent flex flex-col space-y-4 lg:space-y-8">
        
          <!-- TITLE + SUBTITLE -->
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-white">${model.name}</h1>
        
            ${model.subtitle ? `
              <p class="text-gray-300 text-lg leading-snug">${model.subtitle}</p>
            ` : ""}
          </div>
        
          <!-- MOBILE IMAGE -->
          <div class="block lg:hidden w-full rounded-xl h-[220px]">
            <div class="w-full h-full rounded-xl border-4 border-white/20 overflow-hidden">
              <img src="${model.image}"
                   alt="${model.name}"
                   class="w-full h-full object-cover">
            </div>
          </div>
        
          <!-- CATEGORY PILLS -->
          <div class="flex flex-wrap gap-2 lg:gap-3">
            ${categoryPills}
          </div>
        
          <!-- TRY MODEL BUTTON -->
          <a href="${model.link}"
             rel="noopener noreferrer"
             class="btn-primary px-4 py-2 text-sm font-medium inline-block self-start lg:mt-2">
             Try Model
          </a>
        
        </div>
      
        <!-- RIGHT = DESKTOP IMAGE ONLY -->
        <div class="hidden lg:block lg:col-span-3 rounded-3xl overflow-hidden bg-transparent h-[300px]">
          <div class="w-full h-full border-4 border-white/20 rounded-3xl overflow-hidden">
            <img src="${model.image}"
                 alt="${model.name}"
                 class="w-full h-full object-cover">
          </div>
        </div>
      
      </div>
        
      <!-- ============ -->
      <!-- DESCRIPTION
      <!-- ============ -->
  
      <div class="rounded-3xl border border-white/20 p-6 bg-transparent h-full">
        <h3 class="text-2xl font-semibold mb-3">Description</h3>
        <p class="text-gray-300 leading-relaxed whitespace-pre-line">
          ${model.description}
        </p>
      </div>

      <!-- ======================== -->
      <!-- FEATURES AND USE CASES
      <!-- ======================== -->

      <div class="rounded-3xl border border-white/20 p-6 bg-transparent h-full">
      
        ${model.features?.length ? `
          <h3 class="text-xl font-semibold mb-3">Features</h3>
          <ul class="space-y-3 mb-6">
            ${model.features.map(f => `
              <li class="flex items-start gap-3">
                <span class="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       class="h-4 w-4 text-white" 
                       viewBox="0 0 20 20" 
                       fill="currentColor">
                    <path fill-rule="evenodd" 
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 
                             12.586 4.707 9.293a1 1 0 00-1.414 
                             1.414l4 4a1 1 0 001.414 0l8-8a1 
                             1 0 000-1.414z" 
                          clip-rule="evenodd" />
                  </svg>
                </span>
                <span class="text-gray-300">${f}</span>
              </li>
            `).join("")}
          </ul>
        ` : ""}
          
        ${model.use_cases?.length ? `
          <h3 class="text-xl font-semibold mb-3">Use Cases</h3>
          <ul class="space-y-2">
            ${model.use_cases.map(u => `
              <li class="flex items-center gap-3">
                <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                <span class="text-gray-300">${u}</span>
              </li>
            `).join("")}
          </ul>
        ` : ""}

      </div>
  
      <!-- ============================ -->
      <!-- BOTTOM FULL-WIDTH CONTAINER -->
      <!-- ============================ -->
      <div class="rounded-3xl border border-white/20 p-6 bg-transparent">
  
        ${model.pricing ? `
          <h3 class="text-2xl font-semibold mb-3">Pricing</h3>
          <p class="text-gray-300 mb-6">${model.pricing}</p>
        ` : ""}
  
        <h3 class="text-2xl font-semibold mb-3">Model Information</h3>
  
        <ul class="text-gray-300 space-y-1">
          ${model.created_by ? `<li><strong>Developer:</strong> ${model.created_by}</li>` : ""}
          ${model.year_founded ? `<li><strong>Founded:</strong> ${model.year_founded}</li>` : ""}
          ${model.rating ? `<li><strong>Rating:</strong> ⭐ ${model.rating}</li>` : ""}
          ${model.learn_more ? `<li><a href="${model.learn_more}" target="_blank" class="text-blue-400 underline">Learn More</a></li>` : ""}
        </ul>
      </div>
  
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
