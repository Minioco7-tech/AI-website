import { fetchJSON, getCategoryName, categoryColors } from './utils.js';
import { createModelCard } from './modelCard.js';

document.addEventListener('DOMContentLoaded', async () => {
  const modelName = new URLSearchParams(window.location.search).get('model');
  const modelDetailsEl = document.getElementById('model-details');
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  // Fetch models
  const models = await fetchJSON('models.json');
  const model = models.find(m => m.name.toLowerCase() === modelName?.toLowerCase());

  if (!model) {
    modelDetailsEl.innerHTML = `<p class="text-red-400 text-lg">Model not found.</p>`;
    return;
  }

  // Display model details
  modelDetailsEl.innerHTML = `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-purple-400 mb-4">${model.name}</h1>
      <img src="${model.image}" alt="${model.name}" class="rounded-lg w-full mb-6 max-h-64 object-cover" loading="lazy">
      <div class="mb-4">
        <a href="${model.link}" target="_blank" class="btn-primary px-4 py-2 text-sm font-medium">Try Model ↗</a>
      </div>
      <span class="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-white ${categoryColors[model.category.toLowerCase()] || 'bg-black/20'}">
        ${getCategoryName(model.category)}
      </span>
      <p class="text-gray-200 text-base leading-relaxed whitespace-pre-line">
        ${model.description !== 'N/A' ? model.description : 'No description provided.'}
      </p>
    </div>
  `;

  // Filter related models
  const relatedModels = models.filter(m => m.category === model.category && m.id !== model.id);

  // Responsive settings
  const isMobile = window.innerWidth <= 768;
  const modelsPerView = isMobile ? 1 : 3;
  let currentIndex = 0;

  // Render carousel items
  function renderCarouselItems() {
    track.innerHTML = '';
    const visibleModels = relatedModels.slice(currentIndex * modelsPerView, currentIndex * modelsPerView + modelsPerView);

    visibleModels.forEach(model => {
      const card = createModelCard(model);

      // Ensure width fits within carousel without stretching
      // card.classList.add('flex-shrink-0', 'w-[85vw]', 'sm:w-[calc(33.333%-0.75rem)]', 'max-w-full');
      card.classList.add(
        'flex-shrink-0',
        'w-[60vw]',         // Mobile: 1 card fills most of screen
        'sm:w-[47vw]',      // Small screens: 2 cards side-by-side
        'md:w-[31vw]',      // Medium: ~3 cards fit nicely
        'lg:w-[30vw]',      // Desktop: ~3 full cards
        'max-w-full',
        'mx-auto'
      );

      card.querySelector('div[style]').loading = 'lazy';

      track.appendChild(card);
    });
  }

  // Animate transition between slides
  function animateSlide() {
    track.style.opacity = 0;
    setTimeout(() => {
      renderCarouselItems();
      updateDots();
      track.style.opacity = 1;
    }, 200);
  }

  // Render navigation dots
  function renderDots() {
    const totalDots = Math.max(1, Math.ceil(relatedModels.length / modelsPerView));
    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.dataset.index = i;

      dot.addEventListener('click', () => {
        currentIndex = i;
        animateSlide();
      });

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
      animateSlide();
    }
  }

  function slideRight() {
    const maxIndex = Math.ceil(relatedModels.length / modelsPerView) - 1;
    if (currentIndex < maxIndex) {
      currentIndex++;
      animateSlide();
    }
  }

  // Swipe support for mobile
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

  // Arrow event listeners
  leftArrow.addEventListener('click', slideLeft);
  rightArrow.addEventListener('click', slideRight);

  // Initialize carousel
  renderCarouselItems();
  renderDots();
});
