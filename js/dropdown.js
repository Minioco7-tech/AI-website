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

// ============================================================================
// Setup dropdown with header row + reset button (inside dropdown)
// ============================================================================
export function setupCategoryPillDropdown({
  wrapperId = "filterDropdown",
  toggleId = "filterDropdownToggle",
  menuId = "filterCategories",
  categoryKeys = [],
  selectedSet,
  defaultSelectedSet,
  onUpdate,
  onReset
} = {}) {
  const wrapper = document.getElementById(wrapperId);
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);

  if (!wrapper || !toggle || !menu) {
    console.warn("setupCategoryPillDropdown: missing dropdown elements");
    return null;
  }
  if (!selectedSet || typeof selectedSet.has !== "function") {
    console.warn("setupCategoryPillDropdown: selectedSet must be a Set");
    return null;
  }

  // Build menu structure
  menu.innerHTML = `
    <div class="filter-menu-header">
      <div class="filter-selected-count" aria-live="polite"></div>
      <button type="button" class="filter-reset-btn">Reset filters</button>
    </div>
    <div class="filter-pills"></div>
  `;

  const pillsMount = menu.querySelector(".filter-pills");
  const countEl = menu.querySelector(".filter-selected-count");
  const resetBtn = menu.querySelector(".filter-reset-btn");

  const updateCount = () => {
    if (!countEl) return;
    countEl.textContent = selectedSet.size ? `${selectedSet.size} selected` : `None selected`;
  };

  const render = () => {
    renderCategoryPills({
      mountEl: pillsMount,
      categories: categoryKeys,
      selectedSet,
      onChange: () => {
        updateCount();
        onUpdate?.();
      }
    });

    updateCount();
    if (window.feather) window.feather.replace({ "stroke-width": 2.6 });
  };

  // Reset
  resetBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    selectedSet.clear();
    if (defaultSelectedSet && typeof defaultSelectedSet.has === "function") {
      for (const x of defaultSelectedSet) selectedSet.add(String(x).toLowerCase());
    }

    render();
    onReset?.();
    onUpdate?.();
  });

  // Toggle open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.toggle("open");

    if (wrapper.classList.contains("open")) {
      closeOnOutsideClick(toggle, menu, () => wrapper.classList.remove("open"));
    }
  });

  // Escape closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") wrapper.classList.remove("open");
  });

  render();
  return { render, updateCount };
}
