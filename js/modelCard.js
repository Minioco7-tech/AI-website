// modelCard.js
export function createModelCard(model) {
  const categoryColors = {
    all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
    productivity: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',       // purple/indigo
    design: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',    // pink/orange
    learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',      // cyan/blue
    business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',      // emerald/green
    chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',      // amber
    audio: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',         // red/pink
    coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',        // violet/indigo
    science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',       // teal
    documents: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',       // yellow
    spreadsheets: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'       // light blue
  };

  const colorClass = categoryColors[model.category?.toLowerCase()] || 'bg-black/20';

  // Categories array
  const categories = [
      { key: 'all', name: 'All Models' },
      { key: 'productivity', name: 'Writing & Productivity' }, 
      { key: 'design', name: 'Creativity & Design' }, 
      { key: 'learning', name: 'Learning & Research' }, 
      { key: 'business', name: 'Business & Marketing' },
      { key: 'chatbots', name: 'Chatbots & Agents' },
      { key: 'audio', name: 'Audio & Music' }, 
      { key: 'coding', name: 'Coding & Dev Tools' }, 
      { key: 'science', name: 'Science & Health' }, 
      { key: 'documents', name: 'Documents & Reports' }, 
      { key: 'spreadsheets', name: 'Spreadsheets & Data'} 
  ];

  // Get category name from key
  function getCategoryName(catKey) {
      const map = {};
      categories.forEach(c => map[c.key.toLowerCase()] = c.name);
      return map[catKey.toLowerCase()] || catKey;
  }

  const card = document.createElement('a');
  card.href = `model.html?model=${encodeURIComponent(model.name)}`;

  card.className = `
    model-tile 
    flex flex-col
    rounded-lg 
    overflow-hidden 
    border border-white/10
    transition transform duration-300 hover:scale-[1.03]
  `;

  card.innerHTML = `
    <div class="w-full aspect-video bg-cover bg-center rounded-t-lg lazy-bg" data-bg="${model.image}" style="background-image: none;"></div>
    <div class="flex flex-col flex-1 p-4">
      <h3 class="text-purple-400 text-lg sm:text-xl font-bold leading-snug mb-2">${model.name}</h3>
      <p class="text-gray-200 text-sm sm:text-base font-normal leading-normal mb-3 line-clamp-2">${model.description}</p>
      <div class="flex flex-wrap gap-2 mt-auto">
        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${colorClass}">
          ${getCategoryName(model.category)}
        </span>
      </div>
    </div>
  `;

  return card;
}
