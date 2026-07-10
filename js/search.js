// search.js — Natural-language search results + APPLY-to-filter + AND logic
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
let baseModels = [];

let appliedCategories = new Set();
let appliedTags = new Set();

let pendingCategories = new Set();
let pendingTags = new Set();

let currentPage = 1;

// ============================================================
// Natural-language search engine
// ============================================================

const STOP_WORDS = new Set([
  "i", "me", "my", "we", "our", "you", "your",
  "a", "an", "the", "that", "this", "these", "those",
  "to", "for", "of", "in", "on", "at", "by", "with", "from",
  "and", "or", "but", "if", "then", "than",
  "need", "want", "would", "could", "should", "help", "helps",
  "tool", "model", "ai", "using", "use", "make", "create",
  "get", "find", "something", "someone", "please"
]);

const INTENT_MAP = {
  image: {
    terms: [
      "image", "images", "picture", "pictures", "photo", "photos",
      "visual", "visuals", "graphic", "graphics", "poster", "posters",
      "thumbnail", "thumbnails", "banner", "banners", "logo", "logos",
      "advertisement", "advertisements", "advert", "ad", "ads",
      "product ad", "product ads", "product advertisement",
      "marketing image", "marketing visuals", "social media creative",
      "design product advertisements", "product photography"
    ],
    categories: ["design", "media"],
    tags: [
      "image", "design", "visual", "graphics", "advertising",
      "marketing", "logo", "poster", "thumbnail", "creative"
    ],
    boost: 46
  },

  website: {
    terms: [
      "website", "web page", "webpage", "landing page", "site",
      "build a website", "make a website", "web design",
      "frontend", "html", "css"
    ],
    categories: ["development", "design"],
    tags: [
      "website", "web design", "landing page", "frontend",
      "html", "css", "no-code"
    ],
    boost: 34
  },

  writing: {
    terms: [
      "write", "writing", "copy", "copywriting", "blog", "article",
      "email", "caption", "rewrite", "grammar", "proofread",
      "summarise", "summarize", "description", "content"
    ],
    categories: ["documents", "office"],
    tags: [
      "writing", "copywriting", "grammar", "summarisation",
      "documents", "email", "content"
    ],
    boost: 38
  },

  code: {
    terms: [
      "code", "coding", "programming", "developer", "debug",
      "bug", "software", "app", "api", "javascript", "python",
      "react", "frontend", "backend"
    ],
    categories: ["development"],
    tags: [
      "code", "coding", "developer", "programming",
      "debugging", "software", "api"
    ],
    boost: 40
  },

  data: {
    terms: [
      "data", "spreadsheet", "excel", "analytics", "analyse",
      "analyze", "dashboard", "chart", "visualisation",
      "visualization", "sql", "database", "forecast"
    ],
    categories: ["data", "finance"],
    tags: [
      "data", "analytics", "spreadsheet", "excel",
      "dashboard", "sql", "visualisation"
    ],
    boost: 40
  },

  research: {
    terms: [
      "research", "paper", "papers", "academic", "study",
      "journal", "literature", "sources", "citation",
      "citations", "summarise paper", "summarize paper"
    ],
    categories: ["research", "learning"],
    tags: [
      "research", "academic", "papers", "citations",
      "literature", "summarisation"
    ],
    boost: 38
  },

  audio: {
    terms: [
      "audio", "voice", "speech", "podcast", "music",
      "sound", "transcribe", "transcription", "text to speech",
      "voiceover", "voice over", "narration"
    ],
    categories: ["audio"],
    tags: [
      "audio", "voice", "speech", "podcast",
      "transcription", "text-to-speech"
    ],
    boost: 40
  },

  video: {
    terms: [
      "video", "videos", "animation", "animate",
      "editing", "edit video", "film", "reel", "shorts",
      "youtube", "tiktok"
    ],
    categories: ["design", "media"],
    tags: [
      "video", "animation", "editing", "media",
      "youtube", "tiktok"
    ],
    boost: 38
  },

  productivity: {
    terms: [
      "meeting", "meetings", "notes", "calendar", "email",
      "inbox", "workflow", "automation", "task", "tasks",
      "productivity", "assistant"
    ],
    categories: ["office", "assistants"],
    tags: [
      "productivity", "meetings", "email", "calendar",
      "automation", "assistant", "workflow"
    ],
    boost: 34
  },

  jobs: {
    terms: [
      "job", "jobs", "cv", "resume", "interview",
      "career", "application", "cover letter", "recruitment"
    ],
    categories: ["jobs"],
    tags: [
      "jobs", "career", "cv", "resume",
      "interview", "application"
    ],
    boost: 38
  }
};

const ACTION_SYNONYMS = {
  design: ["design", "create", "make", "generate", "produce", "build", "draft"],
  write: ["write", "rewrite", "draft", "compose", "summarise", "summarize", "proofread"],
  analyse: ["analyse", "analyze", "understand", "compare", "review", "inspect", "extract"],
  automate: ["automate", "connect", "integrate", "sync", "workflow"],
  learn: ["learn", "study", "teach", "explain", "understand"]
};

function normaliseText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function tokeniseQuery(query) {
  return unique(
    normaliseText(query)
      .split(" ")
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
  );
}

function extractPhrases(query) {
  const clean = normaliseText(query);
  const words = clean.split(" ").filter(Boolean);
  const phrases = [];

  for (let size = 2; size <= 4; size++) {
    for (let i = 0; i <= words.length - size; i++) {
      const phrase = words.slice(i, i + size).join(" ");
      if (!phrase.split(" ").every((w) => STOP_WORDS.has(w))) {
        phrases.push(phrase);
      }
    }
  }

  return unique(phrases);
}

function detectIntents(query, tokens, phrases) {
  const text = normaliseText(query);
  const detected = [];

  Object.entries(INTENT_MAP).forEach(([intentName, config]) => {
    let confidence = 0;

    config.terms.forEach((term) => {
      const cleanTerm = normaliseText(term);

      if (text.includes(cleanTerm)) {
        confidence += cleanTerm.includes(" ") ? 3 : 2;
      }

      if (tokens.includes(cleanTerm)) {
        confidence += 1;
      }

      if (phrases.includes(cleanTerm)) {
        confidence += 2;
      }
    });

    if (confidence > 0) {
      detected.push({ name: intentName, confidence });
    }
  });

  return detected.sort((a, b) => b.confidence - a.confidence);
}

function detectActions(query) {
  const text = normaliseText(query);
  const actions = [];

  Object.entries(ACTION_SYNONYMS).forEach(([action, words]) => {
    if (words.some((word) => text.includes(word))) {
      actions.push(action);
    }
  });

  return unique(actions);
}

function buildSearchContext(query) {
  const tokens = tokeniseQuery(query);
  const phrases = extractPhrases(query);
  const intents = detectIntents(query, tokens, phrases);
  const actions = detectActions(query);

  return {
    raw: query,
    text: normaliseText(query),
    tokens,
    phrases,
    intents,
    primaryIntent: intents[0]?.name || null,
    actions
  };
}

function getModelSearchText(model) {
  const categories = normalizeCategories(model.category).join(" ");
  const tags = normalizeTags(model.tags).join(" ");

  return {
    name: normaliseText(model.name),
    category: normaliseText(categories),
    tags: normaliseText(tags),
    description: normaliseText(model.description),
    all: normaliseText([
      model.name,
      categories,
      tags,
      model.description
    ].join(" "))
  };
}

function containsAny(text, items = []) {
  return items.some((item) => text.includes(normaliseText(item)));
}

function scoreDirectMatches(modelText, context) {
  let score = 0;

  context.tokens.forEach((token) => {
    if (modelText.name.includes(token)) score += 14;
    if (modelText.tags.includes(token)) score += 12;
    if (modelText.category.includes(token)) score += 10;
    if (modelText.description.includes(token)) score += 5;
  });

  context.phrases.forEach((phrase) => {
    if (phrase.length < 4) return;

    if (modelText.name.includes(phrase)) score += 28;
    if (modelText.tags.includes(phrase)) score += 24;
    if (modelText.category.includes(phrase)) score += 18;
    if (modelText.description.includes(phrase)) score += 14;
  });

  return score;
}

function scoreIntentMatches(modelText, context) {
  let score = 0;

  context.intents.forEach((intent, index) => {
    const config = INTENT_MAP[intent.name];
    const isPrimary = index === 0;

    const categoryMatch = containsAny(modelText.category, config.categories);
    const tagMatch = containsAny(modelText.tags, config.tags);
    const descriptionMatch = containsAny(modelText.description, config.terms);

    if (categoryMatch) score += config.boost * (isPrimary ? 1.2 : 0.65);
    if (tagMatch) score += config.boost * (isPrimary ? 1.4 : 0.75);
    if (descriptionMatch) score += config.boost * (isPrimary ? 0.75 : 0.4);

    score += intent.confidence * (isPrimary ? 8 : 3);
  });

  return score;
}

function scoreActionMatches(modelText, context) {
  let score = 0;

  const actionHints = {
    design: ["design", "image", "visual", "creative", "graphic", "logo", "media"],
    write: ["writing", "copy", "document", "email", "grammar", "content"],
    analyse: ["data", "analytics", "research", "insight", "analysis", "spreadsheet"],
    automate: ["automation", "workflow", "integration", "agent"],
    learn: ["learning", "education", "study", "explain", "tutor"]
  };

  context.actions.forEach((action) => {
    const hints = actionHints[action] || [];

    if (containsAny(modelText.tags, hints)) score += 18;
    if (containsAny(modelText.category, hints)) score += 14;
    if (containsAny(modelText.description, hints)) score += 8;
  });

  return score;
}

function applyConflictPenalties(modelText, context) {
  let penalty = 0;
  const primary = context.primaryIntent;

  if (!primary) return 0;

  const isWebsiteTool =
    containsAny(modelText.tags, INTENT_MAP.website.tags) ||
    containsAny(modelText.category, INTENT_MAP.website.categories);

  const isImageTool =
    containsAny(modelText.tags, INTENT_MAP.image.tags) ||
    containsAny(modelText.category, INTENT_MAP.image.categories);

  const isCodeTool =
    containsAny(modelText.tags, INTENT_MAP.code.tags) ||
    containsAny(modelText.category, INTENT_MAP.code.categories);

  const isWritingTool =
    containsAny(modelText.tags, INTENT_MAP.writing.tags) ||
    containsAny(modelText.category, INTENT_MAP.writing.categories);

  const isDataTool =
    containsAny(modelText.tags, INTENT_MAP.data.tags) ||
    containsAny(modelText.category, INTENT_MAP.data.categories);

  // Example problem this solves:
  // Query mentions "website", but the actual task is designing product adverts.
  if (primary === "image" && isWebsiteTool && !isImageTool) {
    penalty += 45;
  }

  if (primary === "image" && isCodeTool && !isImageTool) {
    penalty += 55;
  }

  if (primary === "writing" && isImageTool && !isWritingTool) {
    penalty += 28;
  }

  if (primary === "data" && (isImageTool || isWritingTool) && !isDataTool) {
    penalty += 35;
  }

  if (primary === "code" && !isCodeTool && (isImageTool || isWritingTool)) {
    penalty += 35;
  }

  return penalty;
}

function scoreModelNaturalSearch(model, context) {
  const modelText = getModelSearchText(model);

  let score = 0;

  score += scoreDirectMatches(modelText, context);
  score += scoreIntentMatches(modelText, context);
  score += scoreActionMatches(modelText, context);

  score -= applyConflictPenalties(modelText, context);

  // Small quality floor for models with strong descriptions.
  if (modelText.description.length > 160) score += 3;

  return Math.max(0, Math.round(score));
}

function runNaturalSearch(models, searchQuery) {
  const context = buildSearchContext(searchQuery);

  if (!context.text) {
    return [];
  }

  let results = models
    .map((model) => ({
      ...model,
      _score: scoreModelNaturalSearch(model, context)
    }))
    .filter((model) => model._score > 0)
    .sort((a, b) => b._score - a._score);

  // Fallback for unusual queries.
  // This keeps search useful even when intent detection misses something.
  if (results.length === 0 && context.tokens.length > 0) {
    results = models
      .map((model) => {
        const modelText = getModelSearchText(model);
        const fallbackScore = context.tokens.reduce((total, token) => {
          return total + (modelText.all.includes(token) ? 1 : 0);
        }, 0);

        return {
          ...model,
          _score: fallbackScore
        };
      })
      .filter((model) => model._score > 0)
      .sort((a, b) => b._score - a._score);
  }

  return results;
}

// ------------------------------
// Display search results
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

  if (window.feather) window.feather.replace();
}

// ------------------------------
// Lazy-load background images
// ------------------------------
function initLazyBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll(".lazy-bg");

  if (!lazyBackgrounds.length) return;

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
// AND filter logic
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

function updateFilteredModels() {
  const filtered = filterModelsAND(baseModels, appliedCategories, appliedTags);

  if (!filtered.length) {
    resultsGrid.innerHTML = "";
    noResults?.classList.remove("hidden");
    renderPagination({
      totalItems: 0,
      currentPage: 1,
      onPageChange: () => {}
    });
    return;
  }

  noResults?.classList.add("hidden");
  displayModels(filtered);
}

// ------------------------------
// Render filter dropdown
// ------------------------------
function renderFilters(modelsForOptions) {
  const categoryKeys = getUniqueCategories(modelsForOptions);

  pendingCategories = new Set();
  pendingTags = new Set();
  appliedCategories = new Set();
  appliedTags = new Set();

  setupCategoryPillDropdown({
    wrapperId: "filterDropdown",
    toggleId: "filterDropdownToggle",
    menuId: "filterCategories",

    categoryKeys,
    selectedCategoriesSet: pendingCategories,
    defaultSelectedCategoriesSet: new Set(),

    models: modelsForOptions,
    hideZeroTags: true,
    selectedTagsSet: pendingTags,
    defaultSelectedTagsSet: new Set(),

    onApply: () => {
      appliedCategories = new Set(pendingCategories);
      appliedTags = new Set(pendingTags);

      currentPage = 1;
      updateFilteredModels();
    },

    onClear: () => {
      appliedCategories.clear();
      appliedTags.clear();
      currentPage = 1;

      noResults?.classList.toggle("hidden", baseModels.length > 0);
      displayModels(baseModels);
    }
  });
}

// ============================================================
// Fetch models.json, run natural-language search, render
// ============================================================
async function fetchAndDisplayResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q")?.trim() || "";

    if (queryText) queryText.textContent = searchQuery;

    sessionStorage.setItem("breadcrumbSource", "search");
    sessionStorage.setItem("breadcrumbSearchQuery", searchQuery);

    renderBreadcrumb([
      { label: "Home", href: "index.html" },
      { label: "Search Results" }
    ]);

    const models = await fetchJSON("./models.json");

    let results = runNaturalSearch(models, searchQuery);

    baseModels = sortModels(results, sortBySelect?.value);

    renderFilters(baseModels);

    if (!baseModels.length) {
      resultsGrid.innerHTML = "";
      noResults?.classList.remove("hidden");
    } else {
      noResults?.classList.add("hidden");
      currentPage = 1;
      displayModels(baseModels);
    }

    if (window.feather) window.feather.replace();
  } catch (err) {
    console.error("Search failed:", err);
    resultsGrid.innerHTML = "";
    noResults?.classList.remove("hidden");
  }
}

// ------------------------------
// Event Listeners
// ------------------------------
sortBySelect?.addEventListener("change", () => {
  if (!baseModels.length) return;

  baseModels = sortModels(baseModels, sortBySelect.value);

  currentPage = 1;

  if (appliedCategories.size || appliedTags.size) {
    updateFilteredModels();
  } else {
    displayModels(baseModels);
  }
});

randomiseBtn?.addEventListener("click", () => {
  if (!baseModels.length) return;

  baseModels = shuffleArray(baseModels);

  currentPage = 1;

  if (appliedCategories.size || appliedTags.size) {
    updateFilteredModels();
  } else {
    displayModels(baseModels);
  }
});

document.addEventListener("DOMContentLoaded", fetchAndDisplayResults);
