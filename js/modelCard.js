// modelCard.js — Creates the model cards used on grid pages
// Imported by: category.js, search.js, model.js (carousel), home.js (optionally)

import { categoryColors, getCategoryName, normalizeCategories } from './utils.js';
import { createBookmarkButton } from './bookmark.js';

/**
 * Create a model card element for the grid layout.
 * @param {Object} model - A single model object from models.json
 * @returns {HTMLElement} - Fully styled anchor card
 */
export function createModelCard(model) {
  const card = document.createElement('a');

  // Determine breadcrumb context for the back button on model.html
  const currentUrl = new URL(window.location.href);
  const breadcrumbSource = currentUrl.searchParams.get('q') || currentUrl.searchParams.get('category') || 'all';
  const breadcrumbTrail = encodeURIComponent(breadcrumbSource);

  // Link to model detail page with breadcrumb tracking
  card.href = `model.html?model=${encodeURIComponent(model.name)}&breadcrumb=${breadcrumbTrail}`;

  // Card styling
  card.className = `
    model-tile is-hoverable
    flex flex-col
    rounded-lg 
    overflow-hidden 
    transition duration-300 
  `;

  // Normalize category into array for badge generation
  const categories = normalizeCategories(model.category);

  // Create category badges
  const badges = categories.map(cat => {
  const colorClass = categoryColors[cat.toLowerCase()] || 'category-badge-default';
  return `<span class="category-badge inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClass}">
            ${getCategoryName(cat)}
          </span>`;
  }).join('');

  // Set inner card HTML <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
  card.innerHTML = `
    <div class="thumb-wrapper rounded-lg overflow-hidden p-1">
      <div class="sshot-frame">
        <img
          class="sshot-img sshot-img--cover"
          src="${model.image}"
          alt="${model.name} screenshot"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
    
    <div class="flex flex-col flex-1 p-4">
      <div class="flex items-start justify-between gap-3 mb-2 model-card-header"> 
        <h3 class="model-card-title text-lg sm:text-xl font-bold leading-snug">
          ${model.name}
        </h3>
      </div>
      <p class="model-card-description text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">
        ${model.description}
      </p>
      <div class="model-card-badges flex flex-wrap gap-2 mt-auto">
        ${badges}
      </div>
    </div>
  `;
  const header = card.querySelector('.model-card-header');
  header.appendChild(createBookmarkButton(model));

  return card;
}
