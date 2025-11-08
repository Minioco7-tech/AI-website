// home.js — Optimized homepage functionality
import { fetchJSON, getCategoryName, getRandomModels, renderAccordion } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons once
  feather.replace({ width: 20, height: 20 });

  const searchInput = document.getElementById('searchInput');
  const allModelsBtn = document.getElementById('allModelsBtn');
  const categoryGrid = document.getElementById('categoryGrid');

  let modelsData = [];
  let fuse;

  // Animate "All Models" button
  if (allModelsBtn) {
    allModelsBtn.addEventListener('click', e => {
      e.preventDefault();
      allModelsBtn.classList.add('scale-110');
      setTimeout(() => {
        allModelsBtn.classList.remove('scale-110');
        window.location.href = allModelsBtn.href;
      }, 150);
    });
  }

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload
    const query = document.getElementById("searchInput").value.trim();

    if (!query) return;

    // Redirect to category or search page (your logic)
    window.location.href = `category.html?search=${encodeURIComponent(query)}`;
  });


  // Categories data
  const categories = [
    { key: 'all', name: 'All', icon: 'globe', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/all/all.webp' },
    { key: 'documents', name: 'Writing & Documents', icon: 'edit-3', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/writing/writing.webp' },
    { key: 'design', name: 'Design & Media', icon: 'pen-tool', colorFrom: 'from-green-400', colorTo: 'to-blue-500', image: 'Images/design/design.webp' },
    { key: 'learning', name: 'Learning', icon: 'book', colorFrom: 'from-yellow-400', colorTo: 'to-orange-500', image: 'Images/learning/learning.webp' },
    { key: 'data', name: 'Data & Analytics', icon: 'briefcase', colorFrom: 'from-indigo-400', colorTo: 'to-purple-500', image: 'Images/business/business.webp' },
    { key: 'assistants', name: 'Assistance', icon: 'message-circle', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'Images/chatbots/chatbot.webp' },
    { key: 'audio', name: 'Audio & Voice', icon: 'volume-2', colorFrom: 'from-teal-400', colorTo: 'to-blue-400', image: 'Images/speech/speech.webp' },
    { key: 'development', name: 'Development & Code', icon: 'code', colorFrom: 'from-blue-400', colorTo: 'to-indigo-500', image: 'Images/coding/coding.webp' },
    { key: 'research', name: 'Research', icon: 'cpu', colorFrom: 'from-red-400', colorTo: 'to-yellow-500', image: 'Images/science/science.webp' },
    { key: 'finance', name: 'Finance & Operations', icon: 'bar-chart-2', colorFrom: 'from-green-400', colorTo: 'to-teal-500', image: 'Images/finance/finance.webp' },
    { key: 'office', name: 'Office Tools', icon: 'smile', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'Images/speech/speech.webp' },
    { key: 'jobs', name: 'Career & Job Tools', icon: 'smile', colorFrom: 'from-gray-400', colorTo: 'to-gray-600', image: 'Images/speech/speech.webp' }
  ];

  // -----------------------
  // Render Categories with Lazy Loading
  // -----------------------
  function renderCategories() {
    if (!categoryGrid) return;
    categoryGrid.innerHTML = '';
    categoryGrid.className = 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'model-tile rounded-lg overflow-hidden transition transform duration-300 cursor-pointer border border-white border-opacity-10';

      // Lazy-load category image via data-bg attribute
      card.innerHTML = `
        <div class="thumb-wrapper rounded-lg overflow-hidden p-1">
          <div class="thumb bg-cover bg-center w-full h-full rounded-lg transition-transform duration-300"
               style="background-image: url('${cat.image}');">
          </div>
        </div>

        <div class="p-4">
          <div class="flex flex-col items-center text-center">
            <div class="icon-circle bg-gradient-to-r ${cat.colorFrom} ${cat.colorTo} rounded-full p-3 mb-3 flex items-center justify-center">
              <i data-feather="${cat.icon}" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-semibold">${cat.name}</h3>
            <p>${cat.description || 'Explore tools in this category.'}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `category.html?category=${encodeURIComponent(cat.key)}`;
      });

      categoryGrid.appendChild(card);
    });

    // Lazy-load images using IntersectionObserver
    const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    lazyBackgrounds.forEach(el => observer.observe(el));

    // Replace Feather icons once after adding all tiles
    feather.replace({ width: 20, height: 20 });
  }

  // -----------------------
  // AI Guide
  // -----------------------
  const aiPromptGuideItems = [
    {
      title: "1) Be specific and clear",
      content: `
        <p class="text-sm">Vague prompts lead to vague results. Add audience, goal, length, tone, and constraints.</p>
        <div class="mt-3 space-y-2">
          <p class="text-sm italic bg-[#1A1C20] p-3 rounded-md">
            <strong>Good:</strong> “Write a 500-word blog post for beginner designers on ‘AI in branding’. 
            Keep a friendly tone, add 3 bullet takeaways, and end with a 1-sentence CTA.”
          </p>
          <p class="text-sm line-through text-gray-400">Bad: “Write about AI.”</p>
        </div>
      `
    },
    {
      title: "2) Provide context (who/what/why/where)",
      content: `
        <p class="text-sm">Tell the model who you are, who it’s for, and what outcome you need.</p>
        <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
          <strong>Example:</strong> “Draft a professional email to <em>Jane Doe</em> (met at a networking event last week). 
          Goal: book a 15-minute follow-up call about our web design services. Keep it concise (under 120 words).”
        </p>
      `
    },
    {
      title: "3) Define structure and format",
      content: `
        <p class="text-sm">Ask for lists, tables, JSON, outlines, or sections—whatever fits your workflow.</p>
        <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
          <strong>Example:</strong> “Give 5 project ideas for a graphic designer <em>as a numbered list</em>, 
          each with a one-sentence description and a suggested tool.”
        </p>
      `
    },
    {
      title: "4) Assign a role or perspective",
      content: `
        <p class="text-sm">Roles set expectations and improve results.</p>
        <ul class="list-disc ml-6 mt-3 space-y-1 text-sm text-gray-300">
          <li>“Act as a hiring manager for a data analyst role.”</li>
          <li>“You are a science tutor explaining in simple terms.”</li>
          <li>“Be a senior UX writer refining microcopy.”</li>
        </ul>
      `
    },
    {
      title: "5) Iterate and refine (treat it like a conversation)",
      content: `
        <p class="text-sm">Use the first draft to steer the next one.</p>
        <ul class="list-disc ml-6 mt-3 space-y-1 text-sm text-gray-300">
          <li>“Shorten to 80–100 words.”</li>
          <li>“Make the tone more formal and remove emojis.”</li>
          <li>“Add an example relevant to teachers.”</li>
        </ul>
      `
    },
    {
      title: "6) Image prompts: describe subject, style, light, lens",
      content: `
        <p class="text-sm">Paint the scene with adjectives and shot details.</p>
        <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
          <strong>Example:</strong> “Photorealistic red fox sitting in a snowy forest at sunrise, 
          cinematic rim light, detailed fur, shallow depth of field, 85mm composition.”
        </p>
      `
    },
    {
      title: "7) Add guardrails and constraints",
      content: `
        <p class="text-sm">Give boundaries: length, do/don’t lists, style guides.</p>
        <ul class="list-disc ml-6 mt-3 space-y-1 text-sm text-gray-300">
          <li>“Max 5 bullets, each under 12 words.”</li>
          <li>“Avoid jargon; write for 12-year-olds.”</li>
          <li>“Cite sources with links at the end.”</li>
        </ul>
      `
    },
    {
      title: "8) Provide examples (few-shot prompting)",
      content: `
        <p class="text-sm">Show the model what “good” looks like and say “match this style.”</p>
        <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
          <strong>Example:</strong> “Here are two example product blurbs I like. Write a third for this product, 
          keeping the same rhythm and structure.”
        </p>
      `
    },
    {
      title: "Prompt checklist (quick scan)",
      content: `
        <ul class="list-disc ml-6 mt-3 space-y-1 text-sm text-gray-300">
          <li>Audience + goal stated</li>
          <li>Length, tone, and format set</li>
          <li>Context and constraints included</li>
          <li>Role assigned (optional)</li>
          <li>Example provided (optional)</li>
        </ul>
      `
    }
  ];
  
  function renderAIGuide() {
    renderAccordion('aiPromptGuide', {
      heading: 'How to Prompt AI Tools Correctly',
      items: aiPromptGuideItems,
      singleOpen: true
    });
  
    // icons are injected by the renderer, but safe to replace again if needed
    if (typeof feather !== 'undefined') feather.replace();
  }

  // -----------------------
  // Fuzzy Search (Fuse.js)
  // -----------------------
  function setupFuse() {
    fuse = new Fuse(modelsData, {
      keys: ['name', 'description', 'category'],
      threshold: 0.4,
      ignoreLocation: true,
      isCaseSensitive: false
    });
  }

  // -----------------------
  // Search input handler
  // -----------------------
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // -----------------------
  // Initialize homepage
  // -----------------------
  renderCategories();
  renderAIGuide();

});
