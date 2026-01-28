// dropdown.js — Filter dropdown UI (category/search) + category pill rendering
// Keeps homepage "guide accordions" in utils.js

import { categoryColors, getCategoryName } from "./utils.js";

console.log("✅ dropdown.js loaded");

// ============================================================================
// Close on outside click
// ============================================================================
export function closeOnOutsideClick(triggerEl, dropdownEl, callback) {
  function outsideClickHandler(e) {
    if (!triggerEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      callback?.();
      document.removeEventListener("click", outsideClickHandler);
    }
  }
  document.addEventListener("click", outsideClickHandler);
}

// ============================================================================
// Render pills
// ============================================================================
export function renderCategoryPills({ mountEl, categories = [], selectedSet, onChange } = {}) {
  if (!mountEl) return;
  if (!selectedSet || typeof selectedSet.has !== "function") {
    console.warn("renderCategoryPills: selectedSet must be a Set");
    return;
  }

  mountEl.innerHTML = "";
  const frag = document.createDocumentFragment();

  categories.forEach((raw) => {
    const key = String(raw).toLowerCase();
    const pillBg = categoryColors[key] || "bg-white/10";

    const label = document.createElement("label");
    label.className = "filter-pill";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = key;
    input.checked = selectedSet.has(key);

    const ui = document.createElement("span");
    ui.className = `pill-ui ${pillBg}`;
    ui.innerHTML = `<span class="pill-text">${getCategoryName(key)}</span>`;

    input.addEventListener("change", () => {
      if (input.checked) selectedSet.add(key);
      else selectedSet.delete(key);
      onChange?.(key, input.checked);
    });

    label.appendChild(input);
    label.appendChild(ui);
    frag.appendChild(label);
  });

  mountEl.appendChild(frag);
}

function renderPills({ mountEl, keys = [], selectedSet, labelForKey, bgForKey, onChange } = {}) {
  if (!mountEl) return;
  mountEl.innerHTML = "";

  const frag = document.createDocumentFragment();

  keys.forEach((raw) => {
    const key = String(raw).toLowerCase();
    const bg = bgForKey?.(key) || "bg-white/10";

    const label = document.createElement("label");
    label.className = "filter-pill";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = key;
    input.checked = selectedSet.has(key);

    const ui = document.createElement("span");
    ui.className = `pill-ui ${bg}`;
    ui.innerHTML = `<span class="pill-text">${labelForKey?.(key) || key}</span>`;

    input.addEventListener("change", () => {
      if (input.checked) selectedSet.add(key);
      else selectedSet.delete(key);
      onChange?.(key, input.checked);
    });

    label.appendChild(input);
    label.appendChild(ui);
    frag.appendChild(label);
  });

  mountEl.appendChild(frag);
}

// ============================================================================
// Setup dropdown with header row + reset button (inside dropdown)
// ============================================================================
export function setupCategoryPillDropdown({
  wrapperId = "filterDropdown",
  toggleId = "filterDropdownToggle",
  menuId = "filterCategories",

  // Categories
  categoryKeys = [],
  selectedCategoriesSet,
  defaultSelectedCategoriesSet,

  // Tags
  tagKeys = [],
  selectedTagsSet,
  defaultSelectedTagsSet,

  onUpdate
} = {}) {
  const wrapper = document.getElementById(wrapperId);
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);

  if (!wrapper || !toggle || !menu) {
    console.warn("setupCategoryPillDropdown: missing dropdown elements");
    return null;
  }

  // Safety
  selectedCategoriesSet ||= new Set();
  selectedTagsSet ||= new Set();

  // Build menu
  menu.innerHTML = `
    <div class="filter-menu-header">
      <div class="filter-selected-count" aria-live="polite"></div>
      <button type="button" class="filter-reset-btn">Reset filters</button>
    </div>

    <details class="filter-section">
      <summary class="filter-section-summary">
        <span class="filter-section-title">Categories</span>
        <span class="filter-section-chevron" aria-hidden="true"></span>
      </summary>
      <div class="filter-pills filter-pills--categories"></div>
    </details>

    <details class="filter-section">
      <summary class="filter-section-summary">
        <span class="filter-section-title">Tags</span>
        <span class="filter-section-chevron" aria-hidden="true"></span>
      </summary>
      <div class="filter-pills filter-pills--tags"></div>
    </details>
  `;

  const countEl = menu.querySelector(".filter-selected-count");
  const resetBtn = menu.querySelector(".filter-reset-btn");

  const catDetails = menu.querySelectorAll(".filter-section")[0];
  const tagDetails = menu.querySelectorAll(".filter-section")[1];

  const catMount = menu.querySelector(".filter-pills--categories");
  const tagMount = menu.querySelector(".filter-pills--tags");

  const updateCount = () => {
    const c = selectedCategoriesSet.size;
    const t = selectedTagsSet.size;
    if (countEl) countEl.textContent = `${c} categories · ${t} tags`;
  };

  const renderAll = () => {
    // Categories use your categoryColors + pretty names from utils
    renderPills({
      mountEl: catMount,
      keys: categoryKeys,
      selectedSet: selectedCategoriesSet,
      labelForKey: (k) => getCategoryName(k),
      bgForKey: (k) => categoryColors[k] || "bg-white/10",
      onChange: () => {
        updateCount();
        onUpdate?.();
      }
    });

    // Tags: keep a clean neutral pill background (matches model tag feel)
    renderPills({
      mountEl: tagMount,
      keys: tagKeys,
      selectedSet: selectedTagsSet,
      labelForKey: (k) => k.replace(/(^|\s|-)\S/g, s => s.toUpperCase()),
      bgForKey: () => "bg-white/10",
      onChange: () => {
        updateCount();
        onUpdate?.();
      }
    });

    updateCount();
    if (window.feather) window.feather.replace({ "stroke-width": 2.6 });
  };

  // Reset button resets BOTH sets to defaults
  resetBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    selectedCategoriesSet.clear();
    if (defaultSelectedCategoriesSet) {
      for (const x of defaultSelectedCategoriesSet) selectedCategoriesSet.add(String(x).toLowerCase());
    }

    selectedTagsSet.clear();
    if (defaultSelectedTagsSet) {
      for (const x of defaultSelectedTagsSet) selectedTagsSet.add(String(x).toLowerCase());
    }

    renderAll();
    onUpdate?.();
  });

  // Toggle dropdown open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !wrapper.classList.contains("open");
    wrapper.classList.toggle("open");

    // ✅ When opening main dropdown, start both subsections CLOSED
    if (willOpen) {
      if (catDetails) catDetails.open = false;
      if (tagDetails) tagDetails.open = false;
    }

    if (wrapper.classList.contains("open")) {
      closeOnOutsideClick(toggle, menu, () => wrapper.classList.remove("open"));
    }
  });

  // Escape closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") wrapper.classList.remove("open");
  });

  renderAll();
  return { render: renderAll };
}
