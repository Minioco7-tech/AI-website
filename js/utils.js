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

// Get human-readable category name
export function getCategoryName(catKey) {
  const categories = [
    { key: 'all', name: 'All' },
    { key: 'writing', name: 'Writing' },
    { key: 'design', name: 'Design' },
    { key: 'learning', name: 'Learning' },
    { key: 'business', name: 'Business' },
    { key: 'chatbots', name: 'Chatbots' },
    { key: 'music', name: 'Music' },
    { key: 'coding', name: 'Coding' },
    { key: 'science', name: 'Science' },
    { key: 'finance', name: 'Finance' },
    { key: 'speech', name: 'Speech' },
    { key: 'health', name: 'Health' }
  ];
  const found = categories.find(c => c.key === catKey.toLowerCase());
  return found ? found.name : catKey;
}

// Get n random models
export function getRandomModels(models, n) {
  return [...models].sort(() => 0.5 - Math.random()).slice(0, n);
}
