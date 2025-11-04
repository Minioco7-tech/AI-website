# AIviary — Future Ideas & Feature Backlog

This file collects ideas, potential improvements, and experimental concepts for **AIviary**.  
Not all entries will be implemented immediately — this list serves as a creative and technical reference as the platform grows.

---

## 💡 User Experience (UX) Improvements
- [ ] **Dark/Light Mode Toggle**  
  Allow users to switch between themes, with preferences stored in localStorage.
- [ ] **Smooth Page Transitions**  
  Add fade or slide animations between pages for an app-like experience.
- [ ] **Keyboard Shortcuts**  
  Quick navigation (e.g. `/` to focus search, `←`/`→` for carousel control).
- [ ] **Accessibility Enhancements**  
  Improve ARIA labels, focus states, and contrast for screen readers.
- [ ] **Progressive Web App (PWA)**  
  Allow AIviary to install as a lightweight app on desktop/mobile.

---

## 🧠 Search & Discovery
- [ ] **AI-Powered Search Recommendations**  
  Suggest tools based on user behavior or popular trends.
- [ ] **Synonym & Context Expansion**  
  Train a lightweight model to improve semantic matching accuracy.
- [ ] **Search History / Recent Queries**  
  Store recent searches for logged-in users.
- [ ] **Featured Tools Section**  
  Highlight trending or editor-picked AI tools on the homepage.

---

## 🧩 Data & Content
- [ ] **Expanded Categories**  
  Add fields like “Marketing,” “Productivity,” “Gaming,” or “AI Development.”
- [ ] **Model Metadata**  
  Include tags for pricing (free/premium), platform support, and accessibility.
- [ ] **Automated Model Feeds**  
  Fetch AI tool data from APIs or RSS feeds to keep content current.
- [ ] **Verified Badges**  
  Mark tools with verified information or official sources.
- [ ] **Versioned Model Dataset**  
  Use Supabase to store versioned `models.json` entries with timestamps.

---

## 👤 User Accounts & Profiles (Supabase Phase)
- [ ] **Custom User Dashboards**  
  Show saved tools, ratings, and recommendations.
- [ ] **Social Login Integration**  
  Google, GitHub, and Discord login via Supabase Auth.
- [ ] **User Ratings & Reviews**  
  Allow short feedback or rating for each model.
- [ ] **Bookmarks / Favorites**  
  Save models to a personal collection visible in a profile tab.
- [ ] **Activity Feed**  
  Track model views, search activity, and saved tools.

---

## 💼 Monetization & Community
- [ ] **Premium Subscriptions**  
  Offer optional paid tiers (saved lists, analytics access, advanced filters).
- [ ] **Affiliate Program Integration**  
  Generate passive revenue through partner model links.
- [ ] **Community Submissions**  
  Let verified users suggest new AI tools or edits.
- [ ] **Public API**  
  Provide developers with access to AIviary’s model database.

---

## 🧰 Technical / Development
- [ ] **Switch to Node-based Tailwind Build**  
  Use a local Tailwind + PostCSS build for optimization.
- [ ] **Supabase Database Migration**  
  Replace local `models.json` with real-time database queries.
- [ ] **Backend API Endpoints**  
  Create REST endpoints for user data, analytics, and moderation.
- [ ] **Continuous Deployment (CI/CD)**  
  Use GitHub Actions to auto-deploy after pushes to `main`.
- [ ] **Unit & Integration Tests**  
  Add basic tests for JS modules (utils, search scoring, filters).
- [ ] **Analytics Dashboard**  
  Visualize user activity, search frequency, and category popularity.

---

## 🌍 Marketing & SEO
- [ ] **Open Graph Metadata**  
  Generate dynamic preview images for social sharing.
- [ ] **Sitemap & Robots.txt**  
  Improve discoverability by search engines.
- [ ] **Newsletter Signup (Supabase)**  
  Build an email list for updates and new feature announcements.
- [ ] **Blog / Insights Section**  
  Publish tutorials or AI news articles to boost organic traffic.
- [ ] **Press Kit**  
  Create a branded page for potential partnerships.

---

## 🧩 Long-Term Expansion
- [ ] **Mobile App (React Native or Flutter)**  
  Extend AIviary’s reach to Android and iOS.
- [ ] **Browser Extension**  
  Allow users to access their saved tools while browsing other sites.
- [ ] **Desktop Client (Electron)**  
  For advanced analytics and offline browsing.
- [ ] **AI-Driven Model Descriptions**  
  Use an LLM to auto-summarize tool features and categories.
- [ ] **Internationalization (i18n)**  
  Translate content and metadata for global reach.

---

### 🧭 Note
These ideas represent a mix of technical goals, UX concepts, and potential growth paths.  
AIviary will prioritize improvements that enhance **usability**, **discoverability**, and **community engagement** while maintaining simplicity and speed.

---

> *“Innovation isn’t about doing everything — it’s about doing the right things beautifully.”*
