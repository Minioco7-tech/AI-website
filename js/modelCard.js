// ------------------------------
// Model Card Component
// ------------------------------

import { categoryColors, getCategoryName } from './utils.js';

export function createModelCard(model, { linkPrefix = 'model.html?model=' } = {}) {
  const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';

  return `
    <a href="${linkPrefix}${encodeURIComponent(model.name)}"
       class="model-tile flex flex-col rounded-lg overflow-hidden 
              transition transform duration-300 hover:scale-[1.03] 
              border border-white border-opacity-10 bg-black/30 group">

      <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-t-lg"
           style="background-image: url('${model.image}')"></div>

      <div class="flex flex-col flex-1 p-4 text-left">
        <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2 group-hover:text-[#00BFFF] transition">
          ${model.name}
        </h3>

        <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">
          ${model.description}
        </p>

        <div class="flex flex-wrap gap-2 mt-auto">
          ${
            (Array.isArray(model.categories) ? model.categories : [model.category])
              .map(catKey => `
                <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white 
                              ${categoryColors[catKey?.toLowerCase()] || 'bg-black/20'}">
                  ${getCategoryName(catKey)}
                </span>
              `)
              .join('')
          }
        </div>
      </div>
    </a>
  `;
}
