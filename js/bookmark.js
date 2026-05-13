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

  function updateState() {
    const saved = isModelSaved(model.id);

    btn.innerHTML = `<i data-feather="heart"></i>`;

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
