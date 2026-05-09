const STORAGE_KEY = 'aiviary_saved_models';

// ------------------------------
// Get all saved IDs
// ------------------------------
export function getSavedModelIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ------------------------------
// Check if saved
// ------------------------------
export function isModelSaved(modelId) {
  return getSavedModelIds().includes(Number(modelId));
}

// ------------------------------
// Toggle save/remove
// ------------------------------
export function toggleSavedModel(modelId) {
  const id = Number(modelId);

  let saved = getSavedModelIds();

  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id);
  } else {
    saved.push(id);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  return saved.includes(id);
}

// ------------------------------
// Create bookmark button
// ------------------------------
export function createBookmarkButton(model, options = {}) {
  const btn = document.createElement('button');

  btn.type = 'button';
  btn.className = `
    bookmark-btn
    flex items-center justify-center
    w-9 h-9
    rounded-full
    border border-white/10
    bg-black/40
    backdrop-blur-md
    text-white
    transition-all duration-300
    hover:scale-110
  `;

  function updateState() {
    const saved = isModelSaved(model.id);

    btn.innerHTML = saved
      ? `<i data-feather="heart" class="fill-red-500 text-red-500 w-4 h-4"></i>`
      : `<i data-feather="heart" class="w-4 h-4"></i>`;

    feather.replace();
  }

  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    toggleSavedModel(model.id);

    updateState();

    document.dispatchEvent(
      new CustomEvent('savedModelsChanged')
    );
  });

  updateState();

  return btn;
}
