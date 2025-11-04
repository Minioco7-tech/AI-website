# AIviary — Current Features & Functionality (In Development)

AIviary is a structured AI directory site designed to help users discover and explore AI tools by category, keyword, or relevance.  
The project is currently in active front-end development (v0.9) with a static JSON-driven dataset and a responsive interface.

---

## 🌐 Overview

Every page on the site serves a specific purpose:
- `index.html` — homepage with category grid
- `category.html` — model listing by category
- `search.html` — results filtered by natural language or keywords
- `model.html` — individual model information and related tools
- Legal pages (Privacy, Terms, Disclaimer, DMCA)
- `about.html` — about and mission statement

All site data (model names, images, descriptions, and categories) is sourced from `models.json` and rendered dynamically using modular JavaScript.

---

## 🧩 Core Features

### 🏠 Homepage (`index.html`)
- Displays a grid of **AI categories** such as Writing, Learning, Coding, and more.
- Each tile uses a gradient overlay, category icon (Feather Icons), and thumbnail image.
- Clicking a tile redirects to the `category.html` page filtered by that category.
- Contains a search bar that accepts natural queries (e.g. *“tools for editing text”*).
- “All Models” button redirects to the full category list.
- Script: [`js/home.js`](../js/home.js)

---

### 🗂 Category Page (`category.html`)
- Dynamically loads **models** from `models.json`.
- Filters results by selected category (based on URL query param).
- Supports:
  - Sorting (A–Z, Z–A)
  - Pagination (via `MODELS_PER_PAGE` constant in `utils.js`)
  - Randomization (reshuffles models)
  - Multi-category filtering through checkboxes
- Breadcrumb navigation shows: *Home → [Category]*
- Script: [`js/category.js`](../js/category.js)

---

### 🔍 Search Page (`search.html`)
- Provides **semantic and fuzzy search** powered by `scoreModelRelevance()` in `utils.js`.
- Matches models not only by keyword, but also through synonyms and contextual relevance (e.g. “resume” matches “career” tools).
- Uses:
  - Query expansion via `expandQueryTokens()`  
  - Category-based filtering  
  - Scoring algorithm to rank results
- Displays “no results” state when no matches found.
- Breadcrumb navigation shows: *Home → Search Results*
- Script: [`js/search.js`](../js/search.js)

---

### 🧠 Model Page (`model.html`)
- Displays a detailed view for a single AI model:
  - Name, image, description, and category badges
  - Direct external link to the model’s website
- Below, a **carousel of related models** appears:
  - Relatedness calculated using shared categories and semantic similarity
  - Fully responsive (swipe gestures on mobile)
  - Animated pagination dots and arrow navigation
- Script: [`js/model.js`](../js/model.js)

---

### 🔗 Header & Footer (`js/header.js` and `js/footer.js`)
- **Header:**
  - Fixed, translucent nav bar with gradient branding.
  - Integrated search bar (desktop + mobile).
  - Mobile search toggles open with animation.
  - Persistent breadcrumb reset when navigating home.
- **Footer:**
  - Dynamic rendering with legal links (Disclaimer, Privacy, Terms, DMCA).
  - “Connect” section for GitHub, Twitter, and Contact.
  - Gradient branding element and copyright.
- Both auto-injected into each page for modular consistency.

---

### ⚙️ Shared Utilities (`js/utils.js`)
Core reusable functions for all scripts:
- `fetchJSON()` — safely fetches the `models.json` data
- `normalizeCategories()` — handles string or array formats
- `getCategoryName()` — resolves category keys to readable names
- `getUniqueCategories()` — builds filter lists dynamically
- `sortModels()` / `shuffleArray()` — controls grid order
- `getPaginatedModels()` / `renderPagination()` — paginates cards
- `scoreModelRelevance()` — multi-factor ranking system for semantic search
- `expandQueryTokens()` — expands queries with synonyms, plurals, and stems

---

### 🪶 Model Cards (`js/modelCard.js`)
- Used across `category.html`, `search.html`, and `model.html`.
- Each card:
  - Links to its respective model detail page
  - Displays thumbnail, description, and category badges
  - Uses responsive hover scaling
- Styled by `.model-tile` class in `style.css`.

---

### 🎨 Styling (`css/style.css`)
- Uses a **frosted-glass aesthetic** with gradients and smooth transitions.
- Integrated Tailwind utility classes via CDN for consistent spacing and typography.
- Custom components:
  - `.model-tile` — unified card design
  - `.btn-primary` — consistent buttons
  - `.filter-dropdown` — category filter styling
  - `.carousel-dot`, `.carousel-wrapper` — model carousel elements
- Includes subtle mobile animations and accessibility-focused focus states.

---

### 📜 Legal Pages
AIviary includes essential compliance pages:
- `privacy.html` — explains minimal data collection
- `terms.html` — defines permitted use
- `disclaimer.html` — states non-affiliation with listed tools
- `dmca.html` — contact process for takedown requests

Each follows a consistent layout and branding.

---

## 🧭 Additional Functional Notes
- **Breadcrumb memory** via `sessionStorage` ensures back-navigation paths remain accurate.
- **Lazy loading** for background images improves performance.
- **Responsive design** across all breakpoints via Tailwind utilities.
- **Semantic scoring** improves search accuracy without requiring a backend.

---

### ✅ Summary
AIviary’s current version (v0.9) provides a polished, data-driven interface for exploring AI tools — built entirely client-side.  
The modular JavaScript structure and consistent CSS make it fully ready for backend expansion in the next version.

---
