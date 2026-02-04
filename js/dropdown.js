// dropdown.js — Filter dropdown UI (category/search) + category pill rendering
// Keeps homepage "guide accordions" in utils.js

import { categoryColors, getCategoryName } from "./utils.js";
import { tagDropdownSections, buildTagCounts, withTagVisibility } from "./filters-config.js";


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

  // Tags (legacy flat list) — still accepted but no longer used for UI
  tagKeys = [],

  // ✅ NEW: pass models so tags can hide when they have 0 matches
  models = [],
  hideZeroTags = true,

  // Tags selection (still a single Set, so your existing filterModelsByFacets works)
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

  selectedCategoriesSet ||= new Set();
  selectedTagsSet ||= new Set();

  const titleCase = (k) =>
    String(k).replace(/(^|\s|-)\S/g, (s) => s.toUpperCase());

  // Build visible config from dataset (hide 0-count tags/groups/sections)
  const tagCounts = buildTagCounts(models);
  const visibleSections = withTagVisibility(tagCounts, { hideZero: hideZeroTags });

  // Build nested Tags HTML: sections -> groups -> pills mount
  const buildTagsHTML = () => {
    return visibleSections.map((section, sIdx) => {
      const groupsHTML = (section.groups || []).map((g) => `
        <div class="filter-group">
          <div class="filter-group-title">${g.label}</div>
          <div class="filter-pills filter-pills--taggroup"
               data-section-id="${section.id}"
               data-group-id="${g.id}"></div>
        </div>
      `).join("");

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
    }).join("");
  };

  // Build menu (Categories unchanged; Tags now nested)
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
  `;

  const countEl = menu.querySelector(".filter-selected-count");
  const resetBtn = menu.querySelector(".filter-reset-btn");

  const catDetails = menu.querySelectorAll(".filter-section")[0];
  const tagDetails = menu.querySelectorAll(".filter-section")[1];

  const catMount = menu.querySelector(".filter-pills--categories");

  const updateCount = () => {
    const c = selectedCategoriesSet.size;
    const t = selectedTagsSet.size;
    if (countEl) countEl.textContent = `${c} categories · ${t} tags`;
  };

  // ✅ Enforce "single" sections as radio-like behavior (without changing UI)
  const enforceSingleSelect = (sectionId, keepKey) => {
    const section = visibleSections.find(s => s.id === sectionId);
    if (!section || section.selection !== "single") return;

    const keep = String(keepKey).toLowerCase();

    // remove any other tags belonging to this section from selectedTagsSet
    const sectionTags = section.groups.flatMap(g => g.tags || []).map(t => String(t).toLowerCase());
    for (const t of sectionTags) {
      if (t !== keep) selectedTagsSet.delete(t);
    }

    // update DOM checkboxes in that section to reflect only one checked
    const root = menu.querySelector(`.filter-subsection[data-section-id="${sectionId}"]`);
    if (!root) return;

    root.querySelectorAll('input[type="checkbox"]').forEach(inp => {
      inp.checked = (String(inp.value).toLowerCase() === keep);
    });
  };

  const renderAll = () => {
    // Categories (same as you had)
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

    // Tags (nested)
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
            updateCount();
            onUpdate?.();
          }
        });
      });
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

    // When opening main dropdown, start both subsections CLOSED
    if (willOpen) {
      if (catDetails) catDetails.open = false;
      if (tagDetails) tagDetails.open = false;
      menu.querySelectorAll(".filter-subsection").forEach(d => (d.open = false));
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
