// home.js — Optimized homepage functionality
import { fetchJSON, getCategoryName, getRandomModels, renderDropdowns} from './utils.js';

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
  function renderAIGuides() {
    const guides = [
      {
        title: 'How to Prompt AI Tools Correctly',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Be Specific and Clear</h4>
            <p class="text-sm">Vague prompts lead to vague results. Provide as much detail as possible. Instead of "Write about dogs," try:</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "Write a 500-word blog post about the benefits of adopting a senior dog, focusing on their calm demeanor and lower energy levels."
            </p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">2. Provide Context</h4>
            <p class="text-sm">Give the AI background info: who it’s for, your goal, and the relationship.</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "Draft a professional email to a potential client named Jane Doe. I met her at a networking event last week. The goal is to schedule a 15-minute follow-up call to discuss our web design services."
            </p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">3. Define the Format</h4>
            <p class="text-sm">Tell the AI exactly how you want the output — list, paragraph, table, or JSON.</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "Generate a list of 5 creative project ideas for a graphic designer. Format the output as a numbered list with a one-sentence description for each idea."
            </p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">4. For Image Generation: Use Descriptive Adjectives</h4>
            <p class="text-sm">Be vivid — include subject, style, lighting, and composition.</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "A photorealistic image of a red fox sitting in a snowy forest at sunrise, cinematic lighting, detailed fur, sharp focus."
            </p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">5. Iterate and Refine</h4>
            <p class="text-sm">Use feedback loops — ask the AI to adjust tone, format, or complexity.</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "That’s a good start — can you make it sound more formal and limit it to 100 words?"
            </p>
          </div>
        `
      },
      {
        title: 'Choosing the Right AI Tool for Your Task',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Start With Your Goal</h4>
            <p class="text-sm">Decide what you want to achieve — writing, design, research, or coding — then pick tools built for that.</p>
            <ul class="list-disc ml-6 mt-3 space-y-1 text-sm text-gray-300">
              <li>Writing → Grammarly, Jasper, ChatGPT</li>
              <li>Design → Leonardo AI, Runway, Midjourney</li>
              <li>Data & Analysis → Notion AI, Perplexity, Excel Copilot</li>
            </ul>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">2. Test Before You Commit</h4>
            <p class="text-sm">Most tools offer free plans — test their outputs before subscribing.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">3. Check Integrations</h4>
            <p class="text-sm">Choose tools that work with what you already use — Google Docs, Notion, Figma, or Slack.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">4. Compare Cost vs. Time Saved</h4>
            <p class="text-sm">Focus on the value: if a tool saves 2 hours a week, it often pays for itself.</p>
          </div>
        `
      },
      {
        title: 'Using AI Safely and Ethically',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Protect Your Data</h4>
            <p class="text-sm">Never share private or sensitive data unless the tool explicitly states strong privacy protection.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">2. Check Data Policies</h4>
            <p class="text-sm">Look for lines like “Your data is not used to train our models.” That’s a good sign.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">3. Verify Facts</h4>
            <p class="text-sm">AI can hallucinate — always verify information before publishing or sharing.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">4. Be Transparent</h4>
            <p class="text-sm">If you use AI-generated work, credit it or disclose when appropriate. This builds trust.</p>
          </div>
        `
      },
      {
        title: 'Using AI to Boost Your Career',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Optimize Your Resume</h4>
            <p class="text-sm">AI tools like Teal and Kickresume can reword your CV to match specific job descriptions.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">2. Write Better Cover Letters</h4>
            <p class="text-sm">Use AI for structure and grammar — but always personalize your story and tone.</p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">3. Practice Interviews</h4>
            <p class="text-sm">Ask chatbots to simulate interviews and rate your answers.</p>
            <p class="mt-2 text-sm italic bg-[#1A1C20] p-3 rounded-md">
              <strong>Example:</strong> "Pretend you’re an interviewer for a marketing role. Ask me 5 questions and score my answers."
            </p>
          </div>
  
          <div>
            <h4 class="font-bold text-white mb-2">4. Build an Online Brand</h4>
            <p class="text-sm">Use AI to polish your LinkedIn headline, write portfolio blurbs, or brainstorm post ideas.</p>
          </div>
        `
      }
    ];

    // Render all dropdowns into a single container
    const container = document.getElementById('aiGuidesContainer');
    if (!container) return;
  
    guides.forEach((guide, i) => {
      const section = document.createElement('div');
      section.id = `aiGuide-${i}`;
      container.appendChild(section);
      renderSingleDropdown(section.id, guide);
    });
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
  renderAIGuides();

});
