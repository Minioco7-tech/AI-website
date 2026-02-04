// search.js — Search results + APPLY-to-filter + AND logic
// Page: search.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js

import {
  fetchJSON,
  shuffleArray,
  sortModels,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE,
  getUniqueCategories,
  scoreModelRelevance,
  expandQueryTokens,
  normalizeCategories,
  normalizeTags
} from "./utils.js";

import { setupCategoryPillDropdown } from "./dropdown.js";
import { createModelCard } from "./modelCard.js";
import { renderBreadcrumb } from "./breadcrumb.js";

// ------------------------------
// DOM References
// ------------------------------
const resultsGrid = document.getElementById("resultsGrid");
const noResults = document.getElementById("noResults");
const queryText = document.getElementById("queryText");
const randomiseBtn = document.getElementById("randomiseBtn");
const sortBySelect = document.getElementById("sortBy");

// ------------------------------
// State
// ------------------------------
// Base result set for this search (what should show before any filters)
let baseModels = [];

// Applied filters (used for filtering results)
let appliedCategories = new Set();
let appliedTags = new Set();

// Pending filters (user ticking pills before clicking Apply)
let pendingCategories = new Set();
let pendingTags = new Set();

let currentPage = 1;

// ------------------------------
// ✅ Display search results in grid with pagination
// ------------------------------
function displayModels(models) {
  const paginated = getPaginatedModels(models, currentPage, MODELS_PER_PAGE);

  resultsGrid.innerHTML = "";
  resultsGrid.className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  paginated.forEach((model) => {
    const card = createModelCard(model);
    resultsGrid.appendChild(card);
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
function renderFilters(modelsForOptions) {
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

// ============================================================
// ✅ Fetch models.json, run semantic search, set baseModels, render
// ============================================================
async function fetchAndDisplayResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q")?.trim().toLowerCase() || "";
    if (queryText) queryText.textContent = searchQuery;

    // Save breadcrumb trail for model.html
    sessionStorage.setItem("breadcrumbSource", "search");
    sessionStorage.setItem("breadcrumbSearchQuery", searchQuery);

    renderBreadcrumb([{ label: "Home", href: "index.html" }, { label: "Search Results" }]);

    const models = await fetchJSON("./models.json");
    const tokens = expandQueryTokens(searchQuery);

    // Score each model semantically
    let results = models.map((model) => ({
      ...model,
      _score: scoreModelRelevance(model, tokens, searchQuery)
    }));

    // Drop irrelevant
    results = results.filter((m) => m._score > 0);

    // Sort highest score first
    results.sort((a, b) => b._score - a._score);

    // Fallback: if no semantic hits, basic contains
    if (results.length === 0 && tokens.length > 0) {
      results = models.filter(
        (m) =>
          m.description.toLowerCase().includes(tokens[0]) ||
          m.name.toLowerCase().includes(tokens[0])
      );
    }

    // Apply sort dropdown to BASE set
    baseModels = sortModels(results, sortBySelect?.value);

    // Render dropdown options from base results only
    renderFilters(baseModels);

    // No results UI
    if (!baseModels.length) {
      noResults?.classList.remove("hidden");
    } else {
      noResults?.classList.add("hidden");
      currentPage = 1;
      displayModels(baseModels);
    }

    if (window.feather) window.feather.replace();
  } catch (err) {
    console.error("Search failed:", err);
    noResults?.classList.remove("hidden");
  }
}

// ------------------------------
// Event Listeners
// ------------------------------

// Sorting dropdown
sortBySelect?.addEventListener("change", () => {
  if (!baseModels.length) return;

  baseModels = sortModels(baseModels, sortBySelect.value);

  currentPage = 1;
  if (appliedCategories.size || appliedTags.size) updateFilteredModels();
  else displayModels(baseModels);
});

// Randomise button
randomiseBtn?.addEventListener("click", () => {
  if (!baseModels.length) return;

  baseModels = shuffleArray(baseModels);

  currentPage = 1;
  if (appliedCategories.size || appliedTags.size) updateFilteredModels();
  else displayModels(baseModels);
});

// Init page
document.addEventListener("DOMContentLoaded", fetchAndDisplayResults);
