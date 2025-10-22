// modelCard.js
export function createModelCard(model) {
  // Determine category gradient (same as in category.js)
  const categoryColors = {
    all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
    writing: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',
    creativity: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',
    learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',
    business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
    chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
    music: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',
    coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',
    science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',
    finance: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',
    everyday: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'
  };

  const colorClass = categoryColors[model.category.toLowerCase()] || 'bg-black/20';

  // Create card element
  const card = document.createElement('a');
  card.href = `model.html?model=${encodeURIComponent(model.name)}`;
  card.className = 'model-tile flex flex-col h-full rounded-lg overflow-hidden transition transform duration-300 cursor-pointer border border-white border-opacity-10';

  card.innerHTML = `
    <div class="w-full h-40 sm:h-48 bg-cover bg-center rounded-t-lg thumb-wrapper" style="background-image: url('${model.image}')"></div>
    <div class="flex flex-col flex-1 p-4">
      <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
      <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
      <div class="flex flex-wrap gap-2 mt-auto">
        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
          ${model.category}
        </span>
      </div>
    </div>
  `;

  return card;
}
