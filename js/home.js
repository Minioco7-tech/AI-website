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
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">3. Define the Format</h4>
            <p class="text-sm">Tell the AI exactly how you want the output — list, paragraph, table, or JSON.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">4. For Image Generation: Use Descriptive Adjectives</h4>
            <p class="text-sm">Be vivid — include subject, style, lighting, and composition.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">5. Iterate and Refine</h4>
            <p class="text-sm">Use feedback loops — ask the AI to adjust tone, format, or complexity.</p>
          </div>
        `
      },
      {
        title: 'Choosing the Right AI Tool for Your Task',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Define Your Goal Clearly</h4>
            <p class="text-sm">Start by asking: “What problem am I solving?” Tools built for writing, research, or data analysis all have different strengths.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">2. Evaluate Features and Limitations</h4>
            <p class="text-sm">Check whether the tool offers what you need — real-time collaboration, API access, export formats, or multilingual support.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">3. Test Before You Commit</h4>
            <p class="text-sm">Try free or trial versions first. Evaluate ease of use, accuracy, and how well the outputs match your goals.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">4. Check for Integration and Compatibility</h4>
            <p class="text-sm">Does it connect with your workflow — Google Docs, Figma, or Slack? Choosing tools that fit your ecosystem saves time.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">5. Consider Cost vs. Time Saved</h4>
            <p class="text-sm">Calculate the time a tool saves you weekly. If it saves hours, it often justifies the subscription cost.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">6. Prioritize Trust and Transparency</h4>
            <p class="text-sm">Pick companies that clearly explain how their AI works, how your data is used, and what safety measures they follow.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">7. Check Community Feedback</h4>
            <p class="text-sm">Search for reviews, Reddit threads, or case studies to see how real users rate its reliability and support.</p>
          </div>
        `
      },
      {
        title: 'Using AI Safely and Ethically',
        content: `
          <div>
            <h4 class="font-bold text-white mb-2">1. Protect Your Personal and Client Data</h4>
            <p class="text-sm">Avoid entering personal, financial, or confidential business data into AI tools. Treat AI chats like public forums unless the platform explicitly guarantees encryption and data privacy.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">2. Review Data and Privacy Policies</h4>
            <p class="text-sm">Before signing up, check if the company stores, shares, or uses your prompts for training. Look for terms like <em>“data retention”</em> or <em>“model training”</em> in their policy pages.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">3. Verify and Cross-Check Facts</h4>
            <p class="text-sm">AI-generated information can sound confident but still be incorrect. Always verify facts using reliable sources, especially for academic, medical, or financial content.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">4. Avoid Bias and Harmful Outputs</h4>
            <p class="text-sm">AI models can reflect biases from their training data. Review results for stereotypes, misinformation, or exclusionary language before sharing or publishing.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">5. Be Transparent and Responsible</h4>
            <p class="text-sm">If AI helped you write or design something, be open about it. This maintains trust with audiences, clients, and employers.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-2">6. Use Reputable Tools</h4>
            <p class="text-sm">Stick to trusted platforms with a clear track record of safety and security. Avoid free tools from unknown developers without proper terms or contact info.</p>
          </div>
        `
      }
    ];
    renderDropdowns('aiGuidesContainer', guides);
  }

  renderCategories();
  renderAIGuides();
});
