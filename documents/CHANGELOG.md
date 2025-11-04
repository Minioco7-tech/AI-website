# AIviary — Changelog

All notable changes to this project will be documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions, with versioning based on [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
> Current in-development version (v0.9).  
> Preparing for public v1.0 launch.

### Added
- Complete responsive front-end layout using HTML, Tailwind CSS (CDN), and custom CSS.
- `index.html`: Category grid with icons and lazy-loaded images.
- `category.html`: Category-specific tool display with pagination and sorting.
- `search.html`: Semantic + fuzzy search with relevance scoring.
- `model.html`: Model detail page with related model carousel.
- Dynamic header and footer components injected via JavaScript.
- Breadcrumb system using `sessionStorage`.
- JSON dataset integration (`models.json`).
- Legal compliance pages: Privacy, Terms, Disclaimer, DMCA.
- Documentation suite (`/docs` folder) for features, roadmap, backend setup, etc.

### Improved
- Enhanced model search accuracy using token expansion and synonym mapping.
- Added accessibility and focus outlines for keyboard navigation.
- Refined hover states and animations in CSS (`style.css`).
- Optimized card grid for mobile viewports.

### Planned
- Backend integration using Supabase (authentication, data storage).
- User profiles and personalized model lists.
- Admin dashboard and subscription functionality.

---

## [v1.0] — Initial Public Release (Upcoming)
**Target:** Launch version of AIviary’s front-end.

### Highlights
- Fully responsive directory with search and category filtering.
- Public hosting via GitHub Pages with custom domain.
- Open-source documentation and changelog tracking.
- Stable baseline for future backend and user features.

---

## [v2.0] — Backend & User System (Planned)
**Target:** Integration with Supabase backend.

### Features
- User sign-up and login with Supabase Auth.
- Personalized model dashboard (saved/rated models).
- Backend database for model storage and analytics.
- Initial admin management panel for data curation.

---

## [v3.0] — Premium & Analytics (Future)
**Target:** Monetization and advanced personalization.

### Features
- Subscription-based feature unlocks.
- User behavior analytics and recommendations.
- Community features (comments, ratings, lists).
- API endpoints for external AI tool integrations.

---

## [v4.0+] — Expansion & Modernization (Long-Term)
**Target:** Scalable, community-driven AIviary ecosystem.

### Features
- Migration to a full-stack framework (Next.js or Astro).
- Dedicated REST or GraphQL API.
- AI-driven discovery feed.
- Cross-platform expansion (mobile, browser extension).

---

## 📘 Version Legend
| Symbol | Meaning |
|---------|----------|
| ✅ | Implemented |
| ⚙️ | In progress |
| 🧩 | Planned / in design |
| 🚀 | Released milestone |

---

### 📅 Version History
| Version | Date | Status | Summary |
|----------|------|---------|----------|
| v0.9 | Nov 2025 | ⚙️ In Development | Finalizing static front-end and docs |
| v1.0 | TBD | 🚀 Planned | Public GitHub Pages launch |
| v2.0 | TBD | 🧩 Planned | Supabase backend integration |
| v3.0+ | TBD | 🧩 Planned | Premium features & analytics |
