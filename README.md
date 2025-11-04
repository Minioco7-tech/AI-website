# AIviary — Intelligent AI Tool Directory

AIviary is a modern, interactive directory of AI-powered tools designed to help students, professionals, and creators discover technology that fits their needs.  
The project is currently in active development (v0.9) with a static front-end built in **HTML, CSS, and JavaScript**, and a **Supabase backend** planned for user features.

---

## 🚀 Overview

AIviary indexes AI models and tools from multiple categories — from creative assistants to research utilities.  
Users can:
- Browse AI tools by **category**
- **Search** by natural language or keyword
- View detailed **model pages** with descriptions and external links
- Explore **related tools** using an intelligent relevance system

The current version is fully front-end driven, reading from a structured `models.json` dataset.  
Future versions will include user authentication, saved model lists, and personalized recommendations.

---

## 🧩 Technologies Used

| Type | Technology |
|------|-------------|
| **Markup & Styling** | HTML5, CSS3, Tailwind CSS (via CDN) |
| **Scripting** | JavaScript (ES6 modules) |
| **Icons & UI** | Feather Icons |
| **Data Source** | `models.json` (local structured dataset) |
| **Backend (planned)** | Supabase (authentication, database, storage) |
| **Deployment** | GitHub Pages (custom domain integration) |

---

## 📁 Folder Structure

AI-website/
│
├── css/
│ └── style.css # Unified custom stylesheet
│
├── js/
│ ├── utils.js # Shared helper functions
│ ├── category.js # Category page filtering & pagination
│ ├── search.js # Natural-language search page
│ ├── model.js # Model detail + related carousel
│ ├── modelCard.js # Generates model cards
│ ├── header.js / footer.js # Dynamic layout components
│ └── home.js # Homepage category grid
│
├── data/
│ └── models.json # Central dataset of AI tools
│
├── docs/ # Documentation files
│ ├── FEATURES.md
│ ├── ROADMAP.md
│ ├── CHANGELOG.md
│ ├── IDEAS.md
│ └── BACKEND_SETUP.md
│
├── index.html # Homepage
├── category.html # Category display page
├── search.html # Search results page
├── model.html # Model detail view
├── about.html # About page
├── disclaimer.html, privacy.html, terms.html, dmca.html
└── README.md

---

## ⚙️ Running the Project Locally

No build step required — it’s a static website.

1. **Clone or download** this repository  
   ```bash
   git clone https://github.com/YOUR-USERNAME/AI-website.git

2. Open index.html in your browser.

    Works locally without a server.

3. (Optional) Use a lightweight local server (e.g. VS Code Live Server) for smoother JSON loading:

    npx serve

---

🌍 Deployment

The live site is hosted using GitHub Pages.

To deploy manually:

Commit your changes to main

Push to GitHub

Enable Pages → Branch: main / (root)

Your site will build automatically

---

🧠 Development Notes

All data is loaded dynamically from models.json

Search and categorization use lightweight client-side logic (no backend yet)

Breadcrumbs are stored via sessionStorage for smooth navigation

The layout is fully responsive and uses a frosted-glass UI aesthetic from style.css

🔮 Planned Backend Integration

Future releases will include:

User profiles and authentication (Supabase Auth)

Saved models, ratings, and personalized dashboards

Subscription or premium tier management

Optional analytics and usage tracking

See docs/BACKEND_SETUP.md
 for backend architecture plans.

---

🤝 Contributing

AIviary is an evolving project.
If you wish to contribute ideas, design improvements, or code, please:

Fork the repo

Create a feature branch

Submit a pull request

Bug reports and enhancement suggestions are also welcome under the Issues tab.

---

🪪 License

© 2025 AIviary.
All third-party AI tools and logos belong to their respective owners.
This project’s source code is released under the MIT License unless otherwise noted.
