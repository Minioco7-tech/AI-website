// js/model.js
import { fetchJSON, getCategoryName, categoryColors } from './utils.js';
import { createModelCard } from './modelCard.js';

document.addEventListener('DOMContentLoaded', async () => {
  const modelName = new URLSearchParams(window.location.search).get('model');
  const modelDetailsEl = document.getElementById('model-details');
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  const models = await fetchJSON('models.json');
  const model = models.find(m => m.name.toLowerCase() === modelName?.toLowerCase());

  if (!model) {
    modelDetailsEl.innerHTML = `<p class="text-red-400 text-lg">Model not found.</p>`;
    return;
  }

  // Render model detail
  modelDetailsEl.innerHTML = `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-purple-400 mb-4">${model.name}</h1>
      <img src="${model.image}" alt="${model.name}" class="rounded-lg w-full mb-6 max-h-64 object-cover">
      <div class="mb-4">
        <a href="${model.link}" target="_blank" class="btn-primary px-4 py-2 text-sm font-medium">Visit Model ↗</a>
      </div>
      <span class="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-white ${categoryColors[model.category.toLowerCase()] || 'bg-black/20'}">
        ${getCategoryName(model.category)}
      </span>
      <p class="text-gray-200 text-base leading-relaxed whitespace-pre-line">
        ${model.description !== 'N/A' ? model.description : 'No description provided.'}
      </p>
    </div>
  `;

  // Related models
  const relatedModels = models.filter(m => m.category === model.category && m.id !== model.id);

  // Carousel setup
  let currentIndex = 0;
  const isMobile = window.innerWidth <= 768;
  const modelsPerView = isMobile ? 1 : 3;

  function renderCarouselItems() {
    track.innerHTML = '';
    const view = relatedModels.slice(currentIndex, currentIndex + modelsPerView);
    view.forEach(model => {
      const card = createModelCard(model);
      track.appendChild(card);
    });
  }

  function renderDots() {
    const totalDots = Math.max(1, relatedModels.length - modelsPerView + 1);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function slideLeft() {
    if (currentIndex > 0) {
      currentIndex--;
      renderCarouselItems();
      updateDots();
    }
  }

  function slideRight() {
    if (currentIndex < relatedModels.length - modelsPerView) {
      currentIndex++;
      renderCarouselItems();
      updateDots();
    }
  }

  leftArrow.addEventListener('click', slideLeft);
  rightArrow.addEventListener('click', slideRight);

  // Swipe detection
  if (isMobile) {
    let startX = 0;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 30) {
        diff < 0 ? slideRight() : slideLeft();
      }
    });
  }

  renderCarouselItems();
  renderDots();
});
