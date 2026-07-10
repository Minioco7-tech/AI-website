// utils.js — Shared helper functions used across multiple pages
// Pages importing from here:
//  - home.js
//  - category.js
//  - search.js
//  - model.js
//  - modelCard.js

console.log("✅ utils.js loaded");


// ============================================================================
// ✅ Fetch JSON safely (used by home, category, search, model pages)
// ============================================================================
export async function fetchJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}:`, err);
    return [];
  }
}


// ============================================================================
// ✅ Get N random models (used on homepage recommendations etc.)
// ============================================================================
export function getRandomModels(models, n) {
  return [...models].sort(() => 0.5 - Math.random()).slice(0, n);
}


// ============================================================================
// ✅ Category gradient background classes (used for badge styling)
// Imported in: modelCard.js & model.js
// ============================================================================
export const categoryColors = {
  all: 'bg-gradient-to-r from-[#00BFFF] to-blue-400',
  learning: 'bg-gradient-to-r from-[#A855F7] to-[#6366F1]',
  research: 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B]',
  data: 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]',
  finance: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
  documents: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
  office: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',
  assistants: 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]',
  design: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',
  audio: 'bg-gradient-to-r from-[#F59E0B] to-[#E11D48]',
  jobs: 'bg-gradient-to-r from-pink-400 to-red-500',
  development: 'bg-gradient-to-r from-[#0F172A] to-[#1E3A8A]'
};


// ============================================================================
// ✅ Category definitions (used everywhere category names are shown)
// ============================================================================
export const categories = [
  { key: 'all', name: 'All Models' },
  { key: 'learning', name: 'Learning' },
  { key: 'research', name: 'Research' },
  { key: 'documents', name: 'Writing & Documents' },
  { key: 'office', name: 'Office Tools' },
  { key: 'data', name: 'Data & Analytics' },
  { key: 'finance', name: 'Finance & Operations' },
  { key: 'assistants', name: 'Assistants' },
  { key: 'design', name: 'Design & Media' },
  { key: 'audio', name: 'Audio & Voice' },
  { key: 'jobs', name: 'Career & Job Tools'},
  { key: 'development', name: 'Development & Code'}
];


// ============================================================================
// ✅ Convert a category key into a readable human–friendly name
// Used on: category, search, model, breadcrumb
// ============================================================================
export function getCategoryName(key) {
  const match = categories.find(c => c.key.toLowerCase() === key?.toLowerCase());
  return match ? match.name : key;
}


// ============================================================================
// ✅ Sort models based on dropdown selection (A→Z / Z→A)
// Used on: category page, search page
// ============================================================================
export function sortModels(models, criteria) {
  const sorted = [...models];
  switch (criteria) {
    case 'az':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'relevance':
    default:
      break;
  }
  return sorted;
}


// ============================================================================
// ✅ Shuffle a model array (used when clicking "Randomise")
// Used on: category page, search page
// ============================================================================
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


// ============================================================================
// ✅ Extract a unique list of categories from all models
// Used to build checkbox filters
// Imported in: category.js, search.js
// ============================================================================
export function getUniqueCategories(models) {
  const all = models.flatMap(m =>
    Array.isArray(m.category) ? m.category : [m.category]
  );
  return [...new Set(all.map(cat => cat.toLowerCase()))];
}


// ============================================================================
// ✅ Pagination configuration (models per page)
// ============================================================================
export const MODELS_PER_PAGE = 21;


// ============================================================================
// ✅ Slice models into pages
// Used on: category page, search page
// ============================================================================
export function getPaginatedModels(models, currentPage, perPage = MODELS_PER_PAGE) {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  return models.slice(start, end);
}

// ============================================================================
// ✅ Render pagination UI (shows only 3 pages around current + final page)
// Pattern examples:
//  - Page 1 of 20:  [1] 2 3 … 20 >
//  - Page 2 of 20:  < 1 [2] 3 … 20 >
//  - Page 3 of 20:  < 1 … [3] 4 5 … 20 >
// ============================================================================

export function renderPagination({
  totalItems,
  currentPage,
  onPageChange,
  containerId = 'pagination',
  perPage = MODELS_PER_PAGE
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalItems / perPage);
  container.innerHTML = '';
  if (totalPages <= 1) return;

  container.className = 'w-full flex flex-col items-center justify-center mt-10';

  const Y = totalPages;
  const p = currentPage;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // -----------------------------
  // "Next" pill (fixed size only)
  // -----------------------------
  const nextPill = document.createElement('button');
  nextPill.type = 'button';
  nextPill.textContent = 'Next';

  // ✅ Fixed size (adjust w-72 if you want wider/narrower)
  nextPill.className =
    'w-72 h-11 rounded-full px-6 text-sm font-semibold ' +
    'pagination-next pagination-next-active';

  if (p === Y) {
    nextPill.disabled = true;
    nextPill.className =
      'w-72 h-11 rounded-full px-6 text-sm font-semibold ' +
      'pagination-next pagination-next-disabled';
  } else {
    nextPill.addEventListener('click', () => {
      onPageChange?.(p + 1);
      scrollToTop();
    });
  }

  // Wrapper just to center the fixed-size button
  const nextWrap = document.createElement('div');
  nextWrap.className = 'w-full flex justify-center';
  nextWrap.appendChild(nextPill);

  // -----------------------------
  // Pagination row (natural width)
  // -----------------------------
  const row = document.createElement('div');
  // ✅ inline-flex means it sizes to its content naturally
  row.className = 'inline-flex items-center justify-center gap-3 flex-wrap mt-4 select-none';

  const makeEllipsis = () => {
    const span = document.createElement('span');
    span.textContent = '...';
    span.className = 'pagination-ellipsis text-sm';
    return span;
  };

  const makeChevron = (direction, page, disabled) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', direction === 'left' ? 'Previous page' : 'Next page');

    btn.className = disabled
      ? 'pagination-chevron pagination-chevron-disabled w-8 h-8 inline-flex items-center justify-center cursor-default'
      : 'pagination-chevron pagination-chevron-active w-8 h-8 inline-flex items-center justify-center transition-colors';

    btn.innerHTML = `<i data-feather="chevron-${direction}" style="width:22px;height:22px;"></i>`;

    if (!disabled) {
      btn.addEventListener('click', () => {
        onPageChange?.(page);
        scrollToTop();
      });
    }
    return btn;
  };

  const makePage = (page) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = String(page);

    const isActive = page === p;

    btn.className = isActive
      ? 'pagination-page pagination-page-active w-8 h-8 inline-flex items-center justify-center rounded-full text-sm font-semibold'
      : 'pagination-page pagination-page-inactive w-8 h-8 inline-flex items-center justify-center rounded-full text-sm transition-colors';

    if (!isActive) {
      btn.addEventListener('click', () => {
        onPageChange?.(page);
        scrollToTop();
      });
    }
    return btn;
  };

  // Build the page list using your rules
  const pages = [];
  const add = (x) => { if (!pages.includes(x)) pages.push(x); };

  if (Y <= 6) {
    for (let i = 1; i <= Y; i++) add(i);
  } else if (p <= 2) {
    add(1); add(2); add(3);
    pages.push('ellipsis-right');
    add(Y);
  } else if (p >= Y - 1) {
    add(1);
    pages.push('ellipsis-left');
    add(Y - 2); add(Y - 1); add(Y);
  } else {
    add(1);
    pages.push('ellipsis-left');
    add(p - 1); add(p); add(p + 1);
    pages.push('ellipsis-right');
    add(Y);
  }

  // Left chevron only from page 2 onwards
  if (p > 1) row.appendChild(makeChevron('left', p - 1, false));

  for (const item of pages) {
    if (item === 'ellipsis-left' || item === 'ellipsis-right') row.appendChild(makeEllipsis());
    else row.appendChild(makePage(item));
  }

  // Right chevron only if not last page
  if (p < Y) row.appendChild(makeChevron('right', p + 1, false));

  // -----------------------------
  // Meta text: Showing models X–Y
  // -----------------------------
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  
  const meta = document.createElement('div');
  meta.className = 'pagination-meta mt-3 text-xs text-center';
  meta.textContent = `Showing models ${start}–${end} of ${totalItems}`;

  // Mount
  container.appendChild(nextWrap);
  container.appendChild(row);
  container.appendChild(meta);

  // Render feather chevrons
  if (window.feather) window.feather.replace({ 'stroke-width': 2.6 });
}


// ============================================================================
// ✅ Normalize category field into an array
// Makes JSON robust if stored as string OR array
// Used everywhere categories are matched
// ============================================================================
export function normalizeCategories(categoryField) {
  if (!categoryField) return [];
  return Array.isArray(categoryField) ? categoryField : [categoryField];
}


// ============================================================================
// ✅ Filtering logic (checkboxes)
// Used in: category.js, search.js
// Note: Uses AND logic — must match ALL selected filters
// ============================================================================
export function filterModelsByCategories(models, selectedCategories) {
  if (!selectedCategories || selectedCategories.size === 0) return models;

  const required = [...selectedCategories].map(cat => cat.toLowerCase());

  return models.filter(model => {
    const modelCats = normalizeCategories(model.category).map(c => c.toLowerCase());
    return required.every(cat => modelCats.includes(cat));
  });
}

// ✅ OR logic — model passes if it matches ANY selected category
// If nothing selected -> return all models
export function filterModelsByAnyCategory(models, selectedCategories) {
  if (!selectedCategories || selectedCategories.size === 0) return models;

  const selected = new Set([...selectedCategories].map(c => c.toLowerCase()));

  return models.filter(model => {
    const modelCats = normalizeCategories(model.category).map(c => c.toLowerCase());
    return modelCats.some(cat => selected.has(cat));
  });
}

// ✅ Normalize tags into an array (robust if string or array)
export function normalizeTags(tagField) {
  if (!tagField) return [];
  return Array.isArray(tagField) ? tagField : [tagField];
}

// ✅ Extract unique tags from models (lowercased)
export function getUniqueTags(models) {
  const all = models.flatMap(m =>
    normalizeTags(m.tags).map(t => String(t).toLowerCase()).filter(Boolean)
  );
  return [...new Set(all)];
}

// ✅ OR logic — match ANY selected tag
export function filterModelsByAnyTag(models, selectedTags) {
  if (!selectedTags || selectedTags.size === 0) return models;

  const selected = new Set([...selectedTags].map(t => t.toLowerCase()));

  return models.filter(model => {
    const modelTags = normalizeTags(model.tags).map(t => String(t).toLowerCase());
    return modelTags.some(t => selected.has(t));
  });
}

/**
 * ✅ Combined faceted filtering:
 * - OR within categories
 * - OR within tags
 * - AND between dimensions
 */
export function filterModelsByFacets(models, selectedCategories, selectedTags) {
  let out = models;

  if (selectedCategories && selectedCategories.size > 0) {
    // Uses your existing normalizeCategories()
    const selected = new Set([...selectedCategories].map(c => c.toLowerCase()));
    out = out.filter(model => {
      const cats = normalizeCategories(model.category).map(c => c.toLowerCase());
      return cats.some(c => selected.has(c));
    });
  }

  if (selectedTags && selectedTags.size > 0) {
    out = filterModelsByAnyTag(out, selectedTags);
  }

  return out;
}


// ============================================================================
// ✅ Natural Language Search Helpers
// Used in: search.js
// ============================================================================

const SEARCH_STOPWORDS = new Set([
  "i", "me", "my", "we", "our", "you", "your",
  "a", "an", "the", "and", "or", "but",
  "to", "for", "of", "in", "on", "at", "by", "with", "from",
  "is", "are", "am", "be", "being", "been",
  "need", "want", "would", "could", "should", "can",
  "help", "helps", "using", "use", "find", "looking",
  "tool", "model", "ai", "something", "someone", "please"
]);

const SEARCH_INTENTS = {
  image: {
    queryTerms: [
      "image", "images", "photo", "photos", "picture", "pictures",
      "visual", "visuals", "graphic", "graphics", "poster", "banner",
      "thumbnail", "logo", "advert", "ad", "ads", "advertisement",
      "advertisements", "marketing visual", "product visual",
      "product image", "social media creative"
    ],
    modelTerms: [
      "image", "image generation", "design", "visual", "graphics",
      "poster", "logo", "advertising", "marketing", "product visuals",
      "brand assets", "creative", "media"
    ],
    categories: ["design"],
    boost: 45
  },

  website: {
    queryTerms: [
      "website", "webpage", "web page", "site", "landing page",
      "build website", "make website", "web design", "frontend"
    ],
    modelTerms: [
      "website", "website builder", "web design", "landing page",
      "frontend", "html", "css", "no-code website"
    ],
    categories: ["development", "design"],
    boost: 35
  },

  writing: {
    queryTerms: [
      "write", "writing", "copy", "copywriting", "caption",
      "blog", "article", "email", "rewrite", "proofread",
      "grammar", "document", "documents", "summarise", "summarize"
    ],
    modelTerms: [
      "writing", "copywriting", "content", "grammar", "documents",
      "summarisation", "summarization", "email", "caption"
    ],
    categories: ["documents", "office"],
    boost: 40
  },

  audio: {
    queryTerms: [
      "audio", "voice", "speech", "podcast", "sound",
      "transcribe", "transcription", "voiceover", "narration",
      "text to speech", "voice cloning"
    ],
    modelTerms: [
      "audio", "voice", "speech", "podcast", "transcription",
      "voice generator", "voice cloning", "text-to-speech", "narration"
    ],
    categories: ["audio"],
    boost: 45
  },

  video: {
    queryTerms: [
      "video", "videos", "animation", "animate", "editing",
      "youtube", "tiktok", "reel", "shorts"
    ],
    modelTerms: [
      "video", "animation", "editing", "youtube", "tiktok",
      "media", "short-form"
    ],
    categories: ["design"],
    boost: 40
  },

  code: {
    queryTerms: [
      "code", "coding", "programming", "developer", "debug",
      "software", "app", "api", "javascript", "python", "react"
    ],
    modelTerms: [
      "code", "coding", "developer", "programming", "debugging",
      "software", "api", "javascript", "python"
    ],
    categories: ["development"],
    boost: 42
  },

  data: {
    queryTerms: [
      "data", "analytics", "analyse", "analyze", "spreadsheet",
      "excel", "dashboard", "chart", "sql", "database", "forecast"
    ],
    modelTerms: [
      "data", "analytics", "spreadsheet", "excel", "dashboard",
      "sql", "database", "visualisation", "visualization"
    ],
    categories: ["data", "finance"],
    boost: 42
  },

  research: {
    queryTerms: [
      "research", "paper", "papers", "academic", "journal",
      "literature", "citation", "citations", "study", "sources"
    ],
    modelTerms: [
      "research", "academic", "papers", "citations",
      "literature", "study", "science"
    ],
    categories: ["research", "learning"],
    boost: 40
  },

  jobs: {
    queryTerms: [
      "job", "jobs", "cv", "resume", "interview",
      "career", "application", "cover letter", "recruitment"
    ],
    modelTerms: [
      "jobs", "career", "cv", "resume", "interview",
      "application", "cover letter"
    ],
    categories: ["jobs"],
    boost: 42
  }
};

function cleanSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getModelTextBundle(model) {
  const categories = normalizeCategories(model.category).join(" ");
  const tags = normalizeTags(model.tags).join(" ");
  const features = Array.isArray(model.features) ? model.features.join(" ") : "";
  const useCases = Array.isArray(model.use_cases)
    ? model.use_cases.map(uc => `${uc.title || ""} ${uc.description || ""}`).join(" ")
    : "";

  return {
    name: cleanSearchText(model.name),
    type: cleanSearchText(model.type),
    subtitle: cleanSearchText(model.subtitle),
    categories: cleanSearchText(categories),
    tags: cleanSearchText(tags),
    description: cleanSearchText(model.description),
    features: cleanSearchText(features),
    useCases: cleanSearchText(useCases),
    all: cleanSearchText([
      model.name,
      model.type,
      model.subtitle,
      categories,
      tags,
      model.description,
      features,
      useCases
    ].join(" "))
  };
}

function searchTokens(rawInput) {
  return cleanSearchText(rawInput)
    .split(" ")
    .filter(Boolean)
    .filter(word => word.length > 1)
    .filter(word => !SEARCH_STOPWORDS.has(word));
}

function containsPhrase(text, phrase) {
  return text.includes(cleanSearchText(phrase));
}

function detectSearchIntents(rawQuery, tokens) {
  const query = cleanSearchText(rawQuery);

  return Object.entries(SEARCH_INTENTS)
    .map(([name, config]) => {
      let confidence = 0;

      config.queryTerms.forEach(term => {
        const cleaned = cleanSearchText(term);

        if (query.includes(cleaned)) {
          confidence += cleaned.includes(" ") ? 4 : 2;
        }

        if (tokens.includes(cleaned)) {
          confidence += 1;
        }
      });

      return { name, confidence };
    })
    .filter(intent => intent.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);
}

function modelMatchesIntent(modelText, intentName) {
  const config = SEARCH_INTENTS[intentName];
  if (!config) return false;

  return (
    config.categories.some(cat => modelText.categories.includes(cat)) ||
    config.modelTerms.some(term => modelText.tags.includes(cleanSearchText(term))) ||
    config.modelTerms.some(term => modelText.type.includes(cleanSearchText(term))) ||
    config.modelTerms.some(term => modelText.subtitle.includes(cleanSearchText(term))) ||
    config.modelTerms.some(term => modelText.features.includes(cleanSearchText(term)))
  );
}

function scoreIntent(modelText, intent, index) {
  const config = SEARCH_INTENTS[intent.name];
  const isPrimary = index === 0;
  let score = 0;

  config.categories.forEach(cat => {
    if (modelText.categories.includes(cat)) score += config.boost * (isPrimary ? 1.2 : 0.55);
  });

  config.modelTerms.forEach(term => {
    const cleanTerm = cleanSearchText(term);

    if (modelText.tags.includes(cleanTerm)) score += config.boost * (isPrimary ? 1.4 : 0.65);
    if (modelText.type.includes(cleanTerm)) score += config.boost * (isPrimary ? 1.1 : 0.5);
    if (modelText.subtitle.includes(cleanTerm)) score += config.boost * (isPrimary ? 0.9 : 0.4);
    if (modelText.features.includes(cleanTerm)) score += config.boost * (isPrimary ? 0.7 : 0.3);
    if (modelText.description.includes(cleanTerm)) score += config.boost * (isPrimary ? 0.45 : 0.2);
    if (modelText.useCases.includes(cleanTerm)) score += config.boost * (isPrimary ? 0.65 : 0.3);
  });

  score += intent.confidence * (isPrimary ? 10 : 4);

  return score;
}

function applyIntentPenalties(modelText, primaryIntent) {
  if (!primaryIntent) return 0;

  let penalty = 0;

  const imageMatch = modelMatchesIntent(modelText, "image");
  const websiteMatch = modelMatchesIntent(modelText, "website");
  const codeMatch = modelMatchesIntent(modelText, "code");
  const writingMatch = modelMatchesIntent(modelText, "writing");
  const dataMatch = modelMatchesIntent(modelText, "data");
  const audioMatch = modelMatchesIntent(modelText, "audio");

  if (primaryIntent === "image" && websiteMatch && !imageMatch) penalty += 55;
  if (primaryIntent === "image" && codeMatch && !imageMatch) penalty += 65;
  if (primaryIntent === "image" && dataMatch && !imageMatch) penalty += 45;

  if (primaryIntent === "website" && imageMatch && !websiteMatch) penalty += 35;
  if (primaryIntent === "code" && !codeMatch && (imageMatch || writingMatch || audioMatch)) penalty += 45;
  if (primaryIntent === "data" && !dataMatch && (imageMatch || writingMatch || audioMatch)) penalty += 45;
  if (primaryIntent === "audio" && !audioMatch && (imageMatch || writingMatch || websiteMatch)) penalty += 45;

  return penalty;
}

// ============================================================================
// ✅ Improved Semantic Relevance Scoring
// Used in: search.js
// ============================================================================
export function scoreModelRelevance(model, tokens, rawQuery = "") {
  const modelText = getModelTextBundle(model);
  const queryTokens = tokens?.length ? tokens : searchTokens(rawQuery);
  const detectedIntents = detectSearchIntents(rawQuery, queryTokens);
  const primaryIntent = detectedIntents[0]?.name || null;

  let score = 0;

  // Direct word scoring
  queryTokens.forEach(token => {
    if (modelText.name.includes(token)) score += 18;
    if (modelText.type.includes(token)) score += 14;
    if (modelText.tags.includes(token)) score += 16;
    if (modelText.categories.includes(token)) score += 14;
    if (modelText.subtitle.includes(token)) score += 10;
    if (modelText.features.includes(token)) score += 8;
    if (modelText.useCases.includes(token)) score += 8;
    if (modelText.description.includes(token)) score += 5;
  });

  // Intent scoring
  detectedIntents.forEach((intent, index) => {
    score += scoreIntent(modelText, intent, index);
  });

  // Exact phrase boost
  const cleanQuery = cleanSearchText(rawQuery);
  if (cleanQuery && cleanQuery.length > 3) {
    if (modelText.name === cleanQuery) score += 80;
    if (modelText.name.includes(cleanQuery)) score += 45;
    if (modelText.tags.includes(cleanQuery)) score += 40;
    if (modelText.subtitle.includes(cleanQuery)) score += 30;
    if (modelText.description.includes(cleanQuery)) score += 20;
  }

  // Useful compound intent boosts
  const query = cleanSearchText(rawQuery);

  if (
    primaryIntent === "image" &&
    (
      query.includes("advert") ||
      query.includes("ad ") ||
      query.includes("ads") ||
      query.includes("marketing") ||
      query.includes("product")
    )
  ) {
    if (containsPhrase(modelText.tags, "advertising")) score += 35;
    if (containsPhrase(modelText.tags, "marketing")) score += 35;
    if (containsPhrase(modelText.tags, "product")) score += 25;
    if (containsPhrase(modelText.useCases, "advert")) score += 25;
    if (containsPhrase(modelText.useCases, "marketing")) score += 25;
    if (containsPhrase(modelText.description, "marketing")) score += 15;
  }

  score -= applyIntentPenalties(modelText, primaryIntent);

  return Math.max(0, Math.round(score));
}

// ============================================================================
// ✅ Smart Query Expansion
// Used in: search.js
// ============================================================================
export function expandQueryTokens(rawInput) {
  const baseTokens = searchTokens(rawInput);
  const expanded = new Set(baseTokens);

  const synonymGroups = [
    ["image", "images", "visual", "visuals", "graphic", "graphics", "picture", "photo"],
    ["advert", "ad", "ads", "advertisement", "advertising", "marketing", "campaign"],
    ["website", "site", "webpage", "landing", "frontend"],
    ["write", "writing", "copy", "copywriting", "content", "caption"],
    ["audio", "voice", "speech", "podcast", "sound"],
    ["video", "animation", "editing", "youtube", "tiktok"],
    ["code", "coding", "programming", "developer", "software"],
    ["data", "analytics", "spreadsheet", "excel", "dashboard"],
    ["research", "paper", "academic", "citation", "literature"],
    ["job", "career", "cv", "resume", "interview", "application"]
  ];

  baseTokens.forEach(token => {
    synonymGroups.forEach(group => {
      if (group.includes(token)) {
        group.forEach(word => expanded.add(word));
      }
    });
  });

  return [...expanded];
}

// =====================================================
// ✅ Reusable Accordion Renderer (Netflix-style) 
// items: [{ title: string, content: string(HTML) }]
// options: { heading?: string, singleOpen?: boolean }
// =====================================================
// --- Single Accordion Renderer (One Dropdown, Netflix Style) ---
export function renderSingleDropdown(containerId, { title = "", content = "", subtitle = "", icon = "book-open" } = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <details class="guide-accordion group rounded-2xl border border-white/10 bg-[#020617]/80 overflow-hidden">
      <summary class="guide-summary flex cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-6 py-4">
        
        <div class="flex items-center gap-4 min-w-0">
        
          <!-- Icon -->
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <i data-feather="${icon}" class="w-5 h-5 text-white"></i>
          </div>

          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-semibold text-white leading-tight">
              ${title}
            </h3>
            ${subtitle ? `<p class="text-sm text-gray-400 mt-1">${subtitle}</p>` : ""}
          </div>
        </div>

        <span class="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white transition-transform duration-300 group-open:rotate-180">
          <i data-feather="chevron-down" class="w-5 h-5"></i>
        </span>
      </summary>

      <div class="border-t border-white/10 px-5 sm:px-6 py-5 text-gray-300 space-y-5">
        ${content}
      </div>
      
    </details>
  `;

  if (typeof feather !== 'undefined') feather.replace();
}

export function renderDropdowns(containerId, items = []) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const frag = document.createDocumentFragment();

  items.forEach((item, idx) => {
    const mount = document.createElement('div');
    mount.id = `${containerId}-${idx}`;
    frag.appendChild(mount);
  });

  container.innerHTML = '';
  container.appendChild(frag);

  items.forEach((item, idx) => {
    renderSingleDropdown(`${containerId}-${idx}`, item);
  });

  if (typeof feather !== 'undefined') feather.replace();
}
