// category.js — Handles category page display and filtering (APPLY-to-filter + AND logic)
// Page: category.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  getCategoryName,
  sortModels,
  shuffleArray,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE,
  normalizeCategories,
  normalizeTags,
  getUniqueCategories
} from "./utils.js";

import { setupCategoryPillDropdown } from "./dropdown.js";
import { createModelCard } from "./modelCard.js";
import { renderBreadcrumb } from "./breadcrumb.js";

// ------------------------------
// DOM References
// ------------------------------
const modelsGrid = document.getElementById("modelsGrid");
const loadingState = document.getElementById("loadingState"); // optional, not used currently
const categoryTitle = document.getElementById("categoryTitle");
const randomiseBtn = document.getElementById("randomiseBtn");
const sortBySelect = document.getElementById("sortBy");

// ------------------------------
// State
// ------------------------------
// Base result set for this page (models that should show before filters)
let baseModels = [];

// Applied filters (used for filtering results)
let appliedCategories = new Set();
let appliedTags = new Set();

// Pending filters (user ticking pills before clicking Apply)
let pendingCategories = new Set();
let pendingTags = new Set();

let currentPage = 1;

// ------------------------------
// ✅ Get category from URL (?category=design)
// ------------------------------
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "all";
}

// ------------------------------
// ✅ Display models in paginated card grid
// ------------------------------
function displayModels(models) {
  const paginated = getPaginatedModels(models, currentPage, MODELS_PER_PAGE);

  modelsGrid.innerHTML = "";
  modelsGrid.className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  paginated.forEach((model) => {
    const card = createModelCard(model);
    modelsGrid.appendChild(card);
  });

  renderPagination({
    totalItems: models.length,
    currentPage,
    onPageChange: (page) => {
      currentPage = page;
      displayModels(models);
    }
  });

  initLazyBackgrounds();
}

// ------------------------------
// ✅ Lazy-load background images
// ------------------------------
function initLazyBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll(".lazy-bg");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        observer.unobserve(el);
      }
    });
  });
  lazyBackgrounds.forEach((el) => observer.observe(el));
}

// ------------------------------
// ✅ AND filter logic:
// - Categories: must match ALL selected categories
// - Tags: must match ALL selected tags
// If none selected -> return input models unchanged
// ------------------------------
function filterModelsAND(models, categoriesSet, tagsSet) {
  let out = models;

  if (categoriesSet && categoriesSet.size > 0) {
    const requiredCats = [...categoriesSet].map((x) => String(x).toLowerCase());
    out = out.filter((m) => {
      const cats = normalizeCategories(m.category).map((c) => String(c).toLowerCase());
      return requiredCats.every((rc) => cats.includes(rc));
    });
  }

  if (tagsSet && tagsSet.size > 0) {
    const requiredTags = [...tagsSet].map((x) => String(x).toLowerCase());
    out = out.filter((m) => {
      const tags = normalizeTags(m.tags).map((t) => String(t).toLowerCase());
      return requiredTags.every((rt) => tags.includes(rt));
    });
  }

  return out;
}

// ------------------------------
// ✅ Apply current applied filters to baseModels and display
// ------------------------------
function updateFilteredModels() {
  const filtered = filterModelsAND(baseModels, appliedCategories, appliedTags);
  displayModels(filtered);
}

// ------------------------------
// ✅ Render dropdown using ONLY the models that will appear (baseModels)
// Nothing selected by default. Filtering only happens on Apply.
// ------------------------------
function renderCategoryFilters(modelsForOptions) {
  const categoryKeys = getUniqueCategories(modelsForOptions);

  // Start with NOTHING selected
  pendingCategories = new Set();
  pendingTags = new Set();
  appliedCategories = new Set();
  appliedTags = new Set();

  setupCategoryPillDropdown({
    wrapperId: "filterDropdown",
    toggleId: "filterDropdownToggle",
    menuId: "filterCategories",

    // Categories options from base set, none selected
    categoryKeys,
    selectedCategoriesSet: pendingCategories,
    defaultSelectedCategoriesSet: new Set(),

    // Tags options from base set via filters-config.js visibility (none selected)
    models: modelsForOptions,
    hideZeroTags: true,
    selectedTagsSet: pendingTags,
    defaultSelectedTagsSet: new Set(),

    // Only filter when user clicks Apply
    onApply: () => {
      appliedCategories = new Set(pendingCategories);
      appliedTags = new Set(pendingTags);

      currentPage = 1;
      updateFilteredModels();
    },

    // Clear/reset: show all base models again
    onClear: () => {
      appliedCategories.clear();
      appliedTags.clear();
      currentPage = 1;
      displayModels(baseModels);
    }
  });
}

// ------------------------------
// ✅ Main loader: load all models, filter to category, then show base set
// ------------------------------
async function loadCategoryModels() {
  const categoryKey = getCategoryFromUrl();
  const categoryName = getCategoryName(categoryKey);

  // Save breadcrumb info for model detail page
  sessionStorage.setItem("breadcrumbSource", "category");
  sessionStorage.setItem("breadcrumbCategoryKey", categoryKey);

  if (categoryTitle) categoryTitle.textContent = categoryName;

  // Render breadcrumb: Home > [Category]
  renderBreadcrumb([{ label: "Home", href: "index.html" }, { label: categoryName }]);

  // Load models from JSON
  const modelsData = await fetchJSON("./models.json");

  // Filter to selected category (or all if 'all')
  const filteredModels =
    categoryKey === "all"
      ? modelsData
      : modelsData.filter((m) => {
          const cats = normalizeCategories(m.category).map((c) => String(c).toLowerCase());
          return cats.includes(categoryKey.toLowerCase());
        });

  // Base set = what should appear before any filters
  baseModels = filteredModels;

  // Render dropdown options from base set (NOT from all models)
  renderCategoryFilters(baseModels);

  // Show all base models initially (nothing selected)
  currentPage = 1;
  displayModels(baseModels);

  if (window.feather) window.feather.replace();
}

// ------------------------------
// ✅ Event Handlers
// ------------------------------

// Sorting dropdown (A→Z / Z→A)
sortBySelect?.addEventListener("change", () => {
  if (!baseModels.length) return;

  // Sort the BASE set
  baseModels = sortModels(baseModels, sortBySelect.value);

  // Re-apply currently applied filters (if any), else show base
  currentPage = 1;
  if (appliedCategories.size || appliedTags.size) updateFilteredModels();
  else displayModels(baseModels);
});

// Randomise button
randomiseBtn?.addEventListener("click", () => {
  if (!baseModels.length) return;

  // Shuffle the BASE set
  baseModels = shuffleArray(baseModels);

  // Re-apply currently applied filters (if any), else show base
  currentPage = 1;
  if (appliedCategories.size || appliedTags.size) updateFilteredModels();
  else displayModels(baseModels);
});

// ------------------------------
// ✅ Init page on load
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadCategoryModels();
});
