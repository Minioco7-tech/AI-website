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
    'bg-white/10 text-white border border-white/15 ' +
    'hover:bg-white/15 transition-colors';

  if (p === Y) {
    nextPill.disabled = true;
    nextPill.className =
      'w-72 h-11 rounded-full px-6 text-sm font-semibold ' +
      'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed';
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
    span.className = 'text-gray-500 text-sm';
    return span;
  };

  const makeChevron = (direction, page, disabled) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', direction === 'left' ? 'Previous page' : 'Next page');

    btn.className = disabled
      ? 'w-8 h-8 inline-flex items-center justify-center text-gray-700 cursor-default'
      : 'w-8 h-8 inline-flex items-center justify-center text-gray-300 hover:text-white transition-colors';

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
      ? 'w-8 h-8 inline-flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold'
      : 'w-8 h-8 inline-flex items-center justify-center rounded-full text-sm text-gray-300 hover:text-white transition-colors';

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
  meta.className = 'mt-3 text-xs text-gray-500 text-center';
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

// =====================================================
// ✅ Reusable Accordion Renderer (Netflix-style) 
// items: [{ title: string, content: string(HTML) }]
// options: { heading?: string, singleOpen?: boolean }
// =====================================================
// --- Single Accordion Renderer (One Dropdown, Netflix Style) ---
export function renderSingleDropdown(containerId, { title = "", content = "", subtitle = "", accent = "cyan", icon = "book-open" } = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Accent map (keeps it consistent + DRY)
  const accentDotMap = {
    cyan:   "from-cyan-500/25 via-blue-500/10 to-transparent",
    amber:  "from-amber-500/25 via-yellow-500/10 to-transparent",
    pink:   "from-pink-500/25 via-fuchsia-500/10 to-transparent",
    emerald:"from-emerald-500/25 via-teal-500/10 to-transparent",
    violet: "from-violet-500/25 via-indigo-500/10 to-transparent",
  };

  const glow = accentDotMap[accent] || accentDotMap.cyan;

  el.innerHTML = `
    <details class="guide-accordion group rounded-2xl border border-white/10 bg-[#020617]/80 overflow-hidden">
      <summary class="guide-summary flex cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-6 py-4">
        
        <div class="flex items-center gap-4 min-w-0">
        
          <!-- Accent dot + icon -->
          <div class="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <span class="absolute w-1.5 h-1.5 rounded-full ${accentDot}"></span>
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

      <div class="relative">
        <div class="absolute inset-0 opacity-40 blur-3xl bg-gradient-to-br ${glow}"></div>
        <div class="relative border-t border-white/10 px-5 sm:px-6 py-6 text-[#E0E0E0] space-y-8">
          ${content}
        </div>
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
