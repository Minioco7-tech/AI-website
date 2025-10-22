// utils.js — shared helper functions for all pages

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
  writing: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',
  creativity: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',
  learning: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',
  business: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
  chatbots: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
  audio: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',
  coding: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]',
  science: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',
  finance: 'bg-gradient-to-r from-[#FACC15] to-[#EAB308]',
  everyday: 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]'
};

export const categories = [
  { key: 'all', name: 'All Models' },
  { key: 'productivity', name: 'Writing & Productivity' }, 
  { key: 'creativity', name: 'Creativity & Design' }, 
  { key: 'learning', name: 'Learning & Research' }, 
  { key: 'business', name: 'Business & Marketing' },
  { key: 'chatbots', name: 'Chatbots & Agents' },
  { key: 'audio', name: 'Audio & Music' }, 
  { key: 'coding', name: 'Coding & Dev Tools' }, 
  { key: 'science', name: 'Science & Health' }, 
  { key: 'documents', name: 'Documents & Reports' }, 
  { key: 'spreadsheets', name: 'Spreadsheets & Data'} 
];

export function getCategoryName(key) {
  const match = categories.find(c => c.key.toLowerCase() === key?.toLowerCase());
  return match ? match.name : key;
}

