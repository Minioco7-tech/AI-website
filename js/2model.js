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
      <h1 class="text-3xl font-bold text-white mb-4">${model.name}</h1>
      <img src="${model.image}" alt="${model.name}" class="rounded-lg w-full mb-6 max-h-64 object-cover">
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

  // Related models
  const relatedModels = models.filter(m => m.category === model.category && m.id !== model.id);

  // Carousel setup
  let currentIndex = 0;
  const isMobile = window.innerWidth <= 768;
  const modelsPerView = isMobile ? 1 : 3;

  function renderCarouselItems(items = relatedModels.slice(currentIndex * modelsPerView, currentIndex * modelsPerView + modelsPerView)) {
    track.innerHTML = ''; // Clear carousel
  
    items.forEach(model => {
      const wrapper = document.createElement('div');
      
      // Add Tailwind utility classes for responsive sizing
      wrapper.className = 'flex-shrink-0 w-[85vw] sm:w-[28%]';
  
      // Get the model card from your shared component
      const card = createModelCard(model);
  
      // Append the card inside the wrapper
      wrapper.appendChild(card);
  
      // Add wrapper to carousel track
      track.appendChild(wrapper);
    });
  }

  function renderDots() {
    const totalDots = Math.max(1, Math.ceil(relatedModels.length / modelsPerView));
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.dataset.index = i; // store target index for click

      dot.addEventListener('click', () => {
        currentIndex = i;
        animateSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function animateSlide() {
    const offset = currentIndex * modelsPerView;
    const items = relatedModels.slice(offset, offset + modelsPerView);
  
    // Create sliding animation effect
    track.style.opacity = 0;
    setTimeout(() => {
      renderCarouselItems(items);
      updateDots();
      track.style.opacity = 1;
    }, 200); // short delay to simulate fade
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
