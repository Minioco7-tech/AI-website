// utils.js — shared helper functions for all pages
console.log("✅ utils.js loaded");
// Fetch a JSON file safely
export async function fetchJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}:`, err);
    return [];
  }
}

// Get n random models
export function getRandomModels(models, n) {
  return [...models].sort(() => 0.5 - Math.random()).slice(0, n);
}

// ------------------------------
// Utilities for Model Cards
// ------------------------------

export const categoryColors = {
  all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
  learning: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',       // purple/indigo
  research: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',       // pink/orange
  documents: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',      // cyan/blue
  office: 'bg-gradient-to-r from-[#10B981] to-[#059669]',         // emerald/green
  data: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',           // amber
  finance: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',        // red/pink
  assistants: 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]',     // indigo → violet (new)
  design: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',         // teal
  audio: 'bg-gradient-to-r from-[#F59E0B] to-[#E11D48]',          // yellow → red
  jobs: 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]',           // vibrant blue (new)
  development: 'bg-gradient-to-r from-[#0F172A] to-[#1E3A8A]'     // slate → dark blue (new)
};

export const categories = [
  { key: 'all', name: 'All Models' },
  { key: 'learning', name: 'Learning' }, 
  { key: 'research', name: 'Research' }, 
  { key: 'documents', name: 'Witing & Documents' }, 
  { key: 'office', name: 'Office Tools' },
  { key: 'data', name: 'Data & Analytics' }, 
  { key: 'finance', name: 'Finance & Operations' }, 
  { key: 'assistants', name: 'Assistants' }, 
  { key: 'design', name: 'Design & Media' }, 
  { key: 'audio', name: 'Audio & Voice' }, 
  { key: 'jobs', name: 'Career & Job Tools'},
  { key: 'development', name: 'Development & Code'} 
];

export function getCategoryName(key) {
  const match = categories.find(c => c.key.toLowerCase() === key?.toLowerCase());
  return match ? match.name : key;
}

export function sortModels(models, criteria) {
  const sorted = [...models];
  switch (criteria) {
    case 'az':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'relevance':
    default:
      break;
  }
  return sorted;
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getUniqueCategories(models) {
  const all = models.flatMap(m =>
    Array.isArray(m.category) ? m.category : [m.category]
  );
  return [...new Set(all.map(cat => cat.toLowerCase()))];
}


// ------------------------------
// Pagination Utilities
// ------------------------------

export const MODELS_PER_PAGE = 21;

export function getPaginatedModels(models, currentPage, perPage = MODELS_PER_PAGE) {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  return models.slice(start, end);
}

export function renderPagination({ totalItems, currentPage, onPageChange, containerId = 'pagination', perPage = MODELS_PER_PAGE }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalItems / perPage);
  container.innerHTML = '';

  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement('button');
    button.textContent = page;
    button.className = `px-3 py-1 rounded-md border border-white/10 text-sm ${
      page === currentPage ? 'bg-white text-black' : 'bg-black/20 text-white hover:bg-white/10'
    }`;
    button.addEventListener('click', () => {
      if (typeof onPageChange === 'function') {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    container.appendChild(button);
  }
}

export function normalizeCategories(categoryField) {
  if (!categoryField) return [];
  return Array.isArray(categoryField) ? categoryField : [categoryField];
}
