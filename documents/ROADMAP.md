# AIviary — Development Roadmap

This roadmap outlines the major milestones, current progress, and future plans for **AIviary**, the intelligent AI directory.  
The project is currently in **active development (v0.9)** and will evolve into a feature-rich platform with user personalization and backend services.

---

## 🧱 Phase 1 — Front-End Launch (v1.0)
**Goal:** Complete and deploy the static, public version of AIviary.

### ✅ Tasks
- [x] Create responsive page structure (index, category, search, model)
- [x] Build reusable header/footer components
- [x] Develop JSON-based dataset (`models.json`)
- [x] Implement semantic search (scored relevance)
- [x] Create model cards and carousel layout
- [x] Add responsive and accessible UI design
- [x] Create legal & about pages (Privacy, Terms, DMCA, Disclaimer)
- [x] Connect to custom domain via GitHub Pages

### 🎯 Result
A fully functional static directory site hosted via GitHub Pages — **Version 1.0: "AI Discovery Hub"**

---

## ⚙️ Phase 2 — Backend Integration (v2.0)
**Goal:** Introduce Supabase for authentication, user accounts, and saved data.

### Planned Features
- [ ] **User Authentication**
  - Email/password + OAuth (Google, GitHub)
- [ ] **User Profiles**
  - Personalized dashboards and saved models
- [ ] **Database Connection**
  - Store model data and user preferences in Supabase
- [ ] **Ratings & Reviews**
  - Allow users to rate and bookmark models
- [ ] **Backend Security Rules**
  - Ensure database access is restricted to logged-in users

### Tools
- Supabase (PostgreSQL + Auth)
- Node.js (local environment for API testing)
- JavaScript (ES Modules)
- GitHub Actions for CI/CD

### 🎯 Result
AIviary evolves from a static directory into a **dynamic user-driven platform**.

---

## 💼 Phase 3 — Advanced Features & Monetization (v3.0)
**Goal:** Build community and premium capabilities.

### Planned Additions
- [ ] **Subscription System**
  - Premium members unlock extra features (saved searches, early access, recommendations)
- [ ] **Model Analytics**
  - Track popular tools and engagement
- [ ] **AI Recommendation Engine**
  - Suggest related models based on user behavior
- [ ] **Email Notifications**
  - Updates on new tools or saved categories
- [ ] **Admin Dashboard**
  - Manage models, categories, and reported content

### 🎯 Result
AIviary becomes a sustainable, personalized platform with recurring users.

---

## 🧠 Phase 4 — Expansion & Optimization (v4.0+)
**Goal:** Scale, optimize, and expand reach.

### Potential Improvements
- [ ] Migrate to **Next.js** or **Astro** for SSR and performance
- [ ] Implement API-based data feeds (pull from model directories)
- [ ] Add browser extension or mobile app
- [ ] Integrate advanced analytics dashboard
- [ ] Open community submissions for new tools

### Long-Term Vision
AIviary transitions into the **go-to AI resource directory**, with dynamic content, strong SEO, and community-driven growth.

---

## 📈 Current Development Status
| Component | Status | Notes |
|------------|--------|-------|
| Front-End (HTML/CSS/JS) | ✅ Complete | Fully functional, ready for launch |
| JSON Dataset | ⚙️ Expanding | Continually growing database of models |
| Supabase Backend | 🚧 Planned | To begin after v1 public release |
| User Features | ⏳ Upcoming | Profiles, ratings, bookmarks |
| Subscriptions | 🗓️ Future | Scheduled for Phase 3 |
| Performance Optimization | 🧩 Ongoing | Mobile testing and caching improvements |

---

## 🔮 Future Vision
AIviary aims to evolve into:
- A **searchable AI ecosystem** for every profession.
- A platform where users can **curate and rate** AI tools.
- A resource that **bridges creators, learners, and innovators** with the technology that empowers them.

---

### 🏁 Summary
The next major milestone is the **v1.0 public launch**, establishing AIviary’s foundation.  
Subsequent versions will build upon this base with backend logic, personalization, and premium offerings.

AIviary’s guiding principle:  
> *“Simplify AI discovery — empower every creator, student, and innovator.”*
