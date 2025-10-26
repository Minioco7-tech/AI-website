import { categoryColors, getCategoryName } from './utils.js';

export function createModelCard(model) {
  const card = document.createElement('a');
  // Get current path to append as breadcrumb trail
  const currentUrl = new URL(window.location.href);
  const breadcrumbSource = currentUrl.searchParams.get('q') || currentUrl.searchParams.get('category') || 'all';
  const breadcrumbTrail = encodeURIComponent(breadcrumbSource);
  
  // Build model page link with breadcrumb
  card.href = `model.html?model=${encodeURIComponent(model.name)}&breadcrumb=${breadcrumbTrail}`;
  
  card.className = `
    model-tile 
    flex flex-col
    rounded-lg 
    overflow-hidden 
    border border-white/10
    transition transform duration-300 hover:scale-[1.03]
  `;

  const categories = Array.isArray(model.category) ? model.category : [model.category];

  const badges = categories.map(cat => {
    const colorClass = categoryColors[cat.toLowerCase()] || 'bg-black/20';
    return `<span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
              ${getCategoryName(cat)}
            </span>`;
  }).join('');

  card.innerHTML = `
    <div class="thumb-wrapper rounded-lg overflow-hidden p-1">
        <div class="thumb bg-cover bg-center w-full h-full rounded-lg transition-transform duration-300"
              style="background-image: url('${model.image}');">
        </div>
    </div>
    <div class="flex flex-col flex-1 p-4">
      <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
      <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
      <div class="flex flex-wrap gap-2 mt-auto">
        ${badges}
      </div>
    </div>
  `;

  return card;
}

