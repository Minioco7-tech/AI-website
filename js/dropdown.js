// dropdown.js — Filter dropdown UI (category/search) + category pill rendering
// Keeps homepage "guide accordions" in utils.js

import { categoryColors, getCategoryName } from "./utils.js";
import { buildTagCounts, withTagVisibility } from "./filters-config.js";

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
// Render pills (Categories helper kept)
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
// Internal pill renderer (used for both categories/tags)
// ============================================================================
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
// Setup dropdown with:
// - Categories (unchanged UI)
// - Tags (nested sections + groups) from filters-config.js
// - Apply/Clear buttons (filtering only on Apply)
// ============================================================================
export function setupCategoryPillDropdown({
  wrapperId = "filterDropdown",
  toggleId = "filterDropdownToggle",
  menuId = "filterCategories",

  // Categories
  categoryKeys = [],
  selectedCategoriesSet,
  defaultSelectedCategoriesSet,

  // Legacy flat tags (ignored for UI now, kept for backwards compatibility)
  tagKeys = [],

  // Tags: config-driven visibility
  models = [],
  hideZeroTags = true,

  // Selected sets (PENDING sets; filtering is triggered via onApply)
  selectedTagsSet,
  defaultSelectedTagsSet,

  // Callbacks
  onApply,
  onClear
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

  const titleCase = (k) => String(k).replace(/(^|\s|-)\S/g, (s) => s.toUpperCase());

  // Build visible tag config based on tag counts in provided models (base result set)
  const tagCounts = buildTagCounts(models);
  const visibleSections = withTagVisibility(tagCounts, { hideZero: hideZeroTags });

  // Nested Tags HTML: 3 subsections -> group headings -> pill mounts
  const buildTagsHTML = () => {
    return visibleSections
      .map((section, sIdx) => {
        const groupsHTML = (section.groups || [])
          .map(
            (g) => `
              <div class="filter-group">
                <div class="filter-group-title">${g.label}</div>
                <div class="filter-pills filter-pills--taggroup"
                     data-section-id="${section.id}"
                     data-group-id="${g.id}"></div>
              </div>
            `
          )
          .join("");

        return `
          <details class="filter-subsection" data-subsection="${sIdx}" data-section-id="${section.id}">
            <summary class="filter-subsection-summary">
              <span class="filter-subsection-title">${section.label}</span>
              <span class="filter-section-chevron" aria-hidden="true"></span>
            </summary>
            <div class="filter-subsection-inner">
              ${groupsHTML}
            </div>
          </details>
        `;
      })
      .join("");
  };

  // Build menu: Categories untouched; Tags nested; footer has Apply/Clear
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

      <div class="filter-tags-groups">
        ${buildTagsHTML()}
      </div>
    </details>

    <div class="filter-dropdown-footer">
      <button type="button" class="filter-btn filter-btn-ghost" data-filter-action="clear">Clear</button>
      <button type="button" class="filter-btn filter-btn-primary" data-filter-action="apply">Apply filters</button>
    </div>
  `;

  const countEl = menu.querySelector(".filter-selected-count");
  const resetBtn = menu.querySelector(".filter-reset-btn");
  const applyBtn = menu.querySelector('[data-filter-action="apply"]');
  const clearBtn = menu.querySelector('[data-filter-action="clear"]');

  const catDetails = menu.querySelectorAll(".filter-section")[0];
  const tagDetails = menu.querySelectorAll(".filter-section")[1];

  const catMount = menu.querySelector(".filter-pills--categories");

  // Count UI only (no filtering here)
  const updateCount = () => {
    const c = selectedCategoriesSet.size;
    const t = selectedTagsSet.size;
    if (countEl) countEl.textContent = `${c} categories · ${t} tags`;
  };

  // Enforce single-select sections as radio-like (without changing pill UI)
  const enforceSingleSelect = (sectionId, keepKey) => {
    const section = visibleSections.find((s) => s.id === sectionId);
    if (!section || section.selection !== "single") return;

    const keep = String(keepKey).toLowerCase();

    // Remove other tags in this section from selectedTagsSet
    const sectionTags = (section.groups || [])
      .flatMap((g) => g.tags || [])
      .map((t) => String(t).toLowerCase());

    for (const t of sectionTags) {
      if (t !== keep) selectedTagsSet.delete(t);
    }

    // Update DOM to reflect only one checked inside the section
    const root = menu.querySelector(`.filter-subsection[data-section-id="${sectionId}"]`);
    if (!root) return;

    root.querySelectorAll('input[type="checkbox"]').forEach((inp) => {
      inp.checked = String(inp.value).toLowerCase() === keep;
    });
  };

  const renderAll = () => {
    // Categories
    renderPills({
      mountEl: catMount,
      keys: categoryKeys,
      selectedSet: selectedCategoriesSet,
      labelForKey: (k) => getCategoryName(k),
      bgForKey: (k) => categoryColors[k] || "bg-white/10",
      onChange: () => {
        updateCount(); // ✅ no auto filtering
      }
    });

    // Tags (nested groups)
    visibleSections.forEach((section) => {
      (section.groups || []).forEach((g) => {
        const mount = menu.querySelector(
          `.filter-pills--taggroup[data-section-id="${section.id}"][data-group-id="${g.id}"]`
        );
        if (!mount) return;

        renderPills({
          mountEl: mount,
          keys: g.tags || [],
          selectedSet: selectedTagsSet,
          labelForKey: (k) => titleCase(k),
          bgForKey: () => "bg-white/10",
          onChange: (key, checked) => {
            if (checked) enforceSingleSelect(section.id, key);
            updateCount(); // ✅ no auto filtering
          }
        });
      });
    });

    updateCount();
    if (window.feather) window.feather.replace({ "stroke-width": 2.6 });
  };

  // Reset button: revert to defaults (does NOT auto-apply)
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
    onClear?.(); // treat reset as clear-from-applied
  });

  // Clear button: clear selections (does NOT auto-apply)
  clearBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    selectedCategoriesSet.clear();
    selectedTagsSet.clear();

    renderAll();
    onClear?.();
  });

  // Apply button: call host page
  applyBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onApply?.();
  });

  // Toggle dropdown open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !wrapper.classList.contains("open");
    wrapper.classList.toggle("open");

    // When opening main dropdown, start both subsections CLOSED
    if (willOpen) {
      if (catDetails) catDetails.open = false;
      if (tagDetails) tagDetails.open = false;
      menu.querySelectorAll(".filter-subsection").forEach((d) => (d.open = false));
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
  return { render: renderAll, sections: visibleSections };
}
