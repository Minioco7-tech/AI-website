// favourites.js — Handles favourites page display
// Page: favourites.html
// Uses shared logic from: utils.js, modelCard.js, breadcrumb.js, bookmarks.js

import {
  fetchJSON,
  sortModels,
  shuffleArray,
  getPaginatedModels,
  renderPagination,
  MODELS_PER_PAGE
} from "./utils.js";

import { createModelCard } from "./modelCard.js";
import { renderBreadcrumb } from "./breadcrumb.js";
import { getSavedModelIds } from "./bookmarks.js";

// ------------------------------
// DOM References
// ------------------------------
const modelsGrid = document.getElementById("modelsGrid");
const noResults = document.getElementById("noResults");
const randomiseBtn = document.getElementById("randomiseBtn");
const sortBySelect = document.getElementById("sortBy");

// ------------------------------
// State
// ------------------------------
let baseModels = [];
let currentPage = 1;

// ------------------------------
// Display favourited models
// ------------------------------
function displayModels(models) {
  const paginated = getPaginatedModels(models, currentPage, MODELS_PER_PAGE);

  modelsGrid.innerHTML = "";
  modelsGrid.className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  if (!models.length) {
    noResults?.classList.remove("hidden");
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  noResults?.classList.add("hidden");

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

  if (window.feather) window.feather.replace();
}

// ------------------------------
// Load favourites from localStorage
// ------------------------------
async function loadFavouriteModels() {
  renderBreadcrumb([
    { label: "Home", href: "index.html" },
    { label: "Favourite Models" }
  ]);

  const savedIds = getSavedModelIds();

  const allModels = await fetchJSON("./models.json");

  // Preserve localStorage order, so newest saved models can appear first
  baseModels = savedIds
    .map(id => allModels.find(model => Number(model.id) === Number(id)))
    .filter(Boolean)
    .reverse();

  currentPage = 1;
  displayModels(baseModels);

  if (window.feather) window.feather.replace();
}

// ------------------------------
// Sorting dropdown
// ------------------------------
sortBySelect?.addEventListener("change", () => {
  if (!baseModels.length) return;

  const selectedSort = sortBySelect.value;

  if (selectedSort === "relevance") {
    loadFavouriteModels();
    return;
  }

  baseModels = sortModels(baseModels, selectedSort);

  currentPage = 1;
  displayModels(baseModels);
});

// ------------------------------
// Randomise button
// ------------------------------
randomiseBtn?.addEventListener("click", () => {
  if (!baseModels.length) return;

  baseModels = shuffleArray(baseModels);

  currentPage = 1;
  displayModels(baseModels);
});

// ------------------------------
// Re-render if a user un-favourites from this page
// ------------------------------
document.addEventListener("savedModelsChanged", () => {
  loadFavouriteModels();
});

// ------------------------------
// Init page
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadFavouriteModels();
});
