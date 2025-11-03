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
  office: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
  documents: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
  finance: 'bg-gradient-to-r from-[#E11D48] to-[#DB2777]',
  assistants: 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]',
  design: 'bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]',
  audio: 'bg-gradient-to-r from-[#F59E0B] to-[#E11D48]',
  jobs: 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]',
  development: 'bg-gradient-to-r from-[#0F172A] to-[#1E3A8A]'
};


// ============================================================================
// ✅ Category definitions (used everywhere category names are shown)
// ============================================================================
export const categories = [
  { key: 'all', name: 'All Models' },
  { key: 'learning', name: 'Learning' },
  { key: 'research', name: 'Research' },
  { key: 'documents', name: 'Witing & Documents' },
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
// ✅ Render pagination buttons UI
// Used anywhere paginated results are displayed
// ============================================================================
export function renderPagination({ totalItems, currentPage, onPageChange, containerId = 'pagination', perPage = MODELS_PER_PAGE }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalItems / perPage);
  container.innerHTML = '';

  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement('button');
    button.textContent = page;
    button.className = `px-3 py-1 rounded-md border border-white/10 text-sm ${
      page === currentPage ? 'bg-white text-black' : 'bg-black/20 text-white hover:bg-white/10'
    }`;
    button.addEventListener('click', () => {
      if (typeof onPageChange === 'function') {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    container.appendChild(button);
  }
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

// Detect clicks outside an element to close dropdown
export function closeOnOutsideClick(triggerEl, dropdownEl, callback) {
  function outsideClickHandler(e) {
    if (!triggerEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      callback?.();
      document.removeEventListener('click', outsideClickHandler);
    }
  }
  document.addEventListener('click', outsideClickHandler);
}


// ============================================================================
// ✅ Semantic search logic
// Imported in: search.js
// ============================================================================
// ============================================================================
// ✅ Advanced Semantic Relevance Scoring
// ============================================================================
// ============================================================================
// ✅ Advanced Semantic Relevance Scoring
// ============================================================================
export function scoreModelRelevance(model, tokens, rawQuery = "") {
  let score = 0;

  const name = model.name.toLowerCase();
  const desc = model.description.toLowerCase();
  const categories = normalizeCategories(model.category).map(c => c.toLowerCase());
  rawQuery = rawQuery.toLowerCase();

  // ------------------------------
  // Weight configuration (tweakable)
  // ------------------------------
  const WEIGHTS = {
    exactNameMatch: 12,
    exactPhraseMatch: 10,
    nameWordMatch: 4,
    descriptionWordMatch: 2,
    categoryMatch: 3,
    synonymMatch: 3,
    categorySynonymAffinity: 4,
    multiTokenAffinity: 3,
    partialWordMatch: 1
  };

  // ------------------------------
  // Synonym affinity map (aligned with expandQueryTokens)
  // ------------------------------
  const semanticKeywords = {
    design: ["video", "image", "visual", "brand", "creative", "logo", "animation", "poster", "art", "media"],
    documents: ["writing", "text", "document", "grammar", "paraphrase", "summarise", "pdf", "edit", "content"],
    learning: ["study", "learn", "course", "tutor", "lesson", "training", "education"],
    research: ["paper", "study", "analysis", "experiment", "summary", "insight", "science"],
    development: ["code", "developer", "script", "function", "api", "automation", "software", "build"],
    data: ["spreadsheet", "chart", "analysis", "dataset", "numbers", "data", "visualisation", "analytics"],
    assistants: ["assistant", "chat", "conversation", "helper", "ideation", "task", "prompt"],
    finance: ["budget", "stock", "money", "accounting", "report", "financial", "compliance"],
    office: ["productivity", "spreadsheet", "presentation", "workflow", "document", "team"],
    audio: ["voice", "audio", "sound", "record", "speech", "transcription", "podcast"],
    jobs: ["career", "resume", "interview", "job", "application", "writing", "cover"]
  };

  // ------------------------------
  // ✅ Exact phrase match boost
  // ------------------------------
  if (rawQuery && desc.includes(rawQuery)) {
    score += WEIGHTS.exactPhraseMatch;
  }

  // ------------------------------
  // ✅ Exact model name match
  // ------------------------------
  if (rawQuery && name === rawQuery) {
    score += WEIGHTS.exactNameMatch;
  }

  // ------------------------------
  // ✅ Per-token matching
  // ------------------------------
  tokens.forEach(token => {
    // Name contains token
    if (name.includes(token)) score += WEIGHTS.nameWordMatch;

    // Description contains token
    if (desc.includes(token)) score += WEIGHTS.descriptionWordMatch;

    // Category contains token
    if (categories.includes(token)) score += WEIGHTS.categoryMatch;

    // Partial word affinity
    if (token.length > 3 && (name.includes(token.slice(0,3)) || desc.includes(token.slice(0,3)))) {
      score += WEIGHTS.partialWordMatch;
    }
  });

  // ------------------------------
  // ✅ Semantic category affinity (synonym alignment)
  // ------------------------------
  for (const [cat, keywords] of Object.entries(semanticKeywords)) {
    const catMatch = categories.includes(cat);

    const tokenMatch = tokens.some(t => keywords.includes(t));
    if (catMatch && tokenMatch) score += WEIGHTS.categorySynonymAffinity;
  }

  // ------------------------------
  // ✅ Multiple overlapping categories
  // ------------------------------
  const matches = categories.filter(cat => tokens.includes(cat));
  score += matches.length * 1.5;

  // ------------------------------
  // ✅ Multi-token affinity (compound intent)
  // e.g. "design marketing video" should boost design tools capable of video output
  // ------------------------------
  if (tokens.length > 2) {
    score += WEIGHTS.multiTokenAffinity;
  }

  return score;
}

  // ------------------------------
  // Synonym affinity map (aligned with expandQueryTokens)
  // ------------------------------
  const semanticKeywords = {
    design: ["video", "image", "visual", "brand", "creative", "logo", "animation", "poster", "art", "media"],
    documents: ["writing", "text", "document", "grammar", "paraphrase", "summarise", "pdf", "edit", "content"],
    learning: ["study", "learn", "course", "tutor", "lesson", "training", "education"],
    research: ["paper", "study", "analysis", "experiment", "summary", "insight", "science"],
    development: ["code", "developer", "script", "function", "api", "automation", "software", "build"],
    data: ["spreadsheet", "chart", "analysis", "dataset", "numbers", "data", "visualisation", "analytics"],
    assistants: ["assistant", "chat", "conversation", "helper", "ideation", "task", "prompt"],
    finance: ["budget", "stock", "money", "accounting", "report", "financial", "compliance"],
    office: ["productivity", "spreadsheet", "presentation", "workflow", "document", "team"],
    audio: ["voice", "audio", "sound", "record", "speech", "transcription", "podcast"],
    jobs: ["career", "resume", "interview", "job", "application", "writing", "cover"]
  };

  // ------------------------------
  // ✅ Exact phrase match boost
  // ------------------------------
  if (rawQuery && desc.includes(rawQuery)) {
    score += WEIGHTS.exactPhraseMatch;
  }

  // ------------------------------
  // ✅ Exact model name match
  // ------------------------------
  if (rawQuery && name === rawQuery) {
    score += WEIGHTS.exactNameMatch;
  }

  // ------------------------------
  // ✅ Per-token matching
  // ------------------------------
  tokens.forEach(token => {
    // Name contains token
    if (name.includes(token)) score += WEIGHTS.nameWordMatch;

    // Description contains token
    if (desc.includes(token)) score += WEIGHTS.descriptionWordMatch;

    // Category contains token
    if (categories.includes(token)) score += WEIGHTS.categoryMatch;

    // Partial word affinity
    if (token.length > 3 && (name.includes(token.slice(0,3)) || desc.includes(token.slice(0,3)))) {
      score += WEIGHTS.partialWordMatch;
    }
  });

  // ------------------------------
  // ✅ Semantic category affinity (synonym alignment)
  // ------------------------------
  for (const [cat, keywords] of Object.entries(semanticKeywords)) {
    const catMatch = categories.includes(cat);

    const tokenMatch = tokens.some(t => keywords.includes(t));
    if (catMatch && tokenMatch) score += WEIGHTS.categorySynonymAffinity;
  }

  // ------------------------------
  // ✅ Multiple overlapping categories
  // ------------------------------
  const matches = categories.filter(cat => tokens.includes(cat));
  score += matches.length * 1.5;

  // ------------------------------
  // ✅ Multi-token affinity (compound intent)
  // e.g. "design marketing video" should boost design tools capable of video output
  // ------------------------------
  if (tokens.length > 2) {
    score += WEIGHTS.multiTokenAffinity;
  }

  return score;
}


// ============================================================================
// ✅ Smart Query Expansion: Stemming, Plurals, Synonyms
// Used in: search.js
// ============================================================================
const synonymMap = {
  learn: ["teaching", "education", "study", "tutor"],
  video: ["videos", "media", "movie", "clip"],
  audio: ["sound", "voice", "speech", "podcast"],
  design: ["visual", "logo", "branding", "creative", "poster", "art"],
  document: ["writing", "grammar", "paraphrase", "summarise", "text"],
  job: ["career", "work", "interview", "resume", "application"],
  research: ["paper", "insight", "study", "experiment", "analysis"],
  data: ["spreadsheet", "numbers", "analytics", "visualisation"],
  finance: ["budget", "money", "stock", "report", "accounting"],
  assistant: ["chat", "helper", "bot", "task", "prompt"],
  development: ["code", "developer", "script", "automation", "software"]
};

// Basic stemmer and plural reducer
function stemWord(word) {
  return word.replace(/(ing|ed|es|s)$/, '');
}

// Expand tokens with synonyms and stems
export function expandQueryTokens(rawInput) {
  const stopwords = [
    "i", "want", "to", "a", "the", "and", "for", "of", "in", "on", "is",
    "with", "my", "you", "it", "this", "that", "at", "how", "can"
  ];

  const tokens = rawInput
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
    .filter(word => !stopwords.includes(word))
    .map(stemWord);

  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [base, synonyms] of Object.entries(synonymMap)) {
      if (base === token || synonyms.includes(token)) {
        expanded.add(base);
        synonyms.forEach(syn => expanded.add(syn));
      }
    }
  }

  return Array.from(expanded);
}

