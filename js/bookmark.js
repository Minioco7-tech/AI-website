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
  btn.className = `bookmark-btn ${options.large ? 'bookmark-btn--large' : ''}`;
  btn.setAttribute('aria-label', `Save ${model.name}`);

  function updateState() {
    const saved = isModelSaved(model.id);
    btn.classList.toggle('is-saved', saved);

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
  }

  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    toggleSavedModel(model.id);
    updateState();

    document.dispatchEvent(new CustomEvent('savedModelsChanged'));
  });

  updateState();
  return btn;
}
