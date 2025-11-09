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
          <div class="space-y-6">
      
            <!-- Rule 1 -->
            <div>
              <h4 class="font-bold text-white mb-2">🛑 1. Never Share Personal Details</h4>
              <p class="text-sm text-gray-300">Treat AI chats like public spaces — avoid entering private information such as:</p>
              <ul class="list-disc list-inside text-sm text-gray-400 mt-2">
                <li>📛 Full name or date of birth</li>
                <li>🏠 Home or work address</li>
                <li>💳 Bank details or passwords</li>
                <li>📧 Personal emails or login info</li>
              </ul>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> “My name is Sarah Blake and I live at 24 Oak Street. Can you write a CV for me?”<br>
                ✅ <strong>Better:</strong> “Write a CV for a recent graduate in marketing with experience in social media.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> AI prompts are often stored or reviewed to improve systems — meaning your data could be visible to others.
              </p>
            </div>
      
            <!-- Rule 2 -->
            <div>
              <h4 class="font-bold text-white mb-2">⚠️ 2. Don’t Upload Confidential Work or Client Data</h4>
              <p class="text-sm text-gray-300">Avoid uploading internal documents, contracts, or client information.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> Copy-pasting a company proposal or customer database into ChatGPT.<br>
                ✅ <strong>Better:</strong> Describe the structure or goal instead — “Write a proposal template for a digital marketing agency.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Uploading real client or business data may break NDAs or privacy laws like GDPR.
              </p>
            </div>
      
            <!-- Rule 3 -->
            <div>
              <h4 class="font-bold text-white mb-2">📚 3. Be Careful With Academic or Workplace Information</h4>
              <p class="text-sm text-gray-300">Never paste unpublished essays, exam questions, or company reports.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> “Here’s my full assignment draft — can you rewrite it?”<br>
                ✅ <strong>Better:</strong> “Can you help me improve the introduction of an essay about renewable energy?”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Sharing proprietary or ungraded work can be flagged as plagiarism or breach confidentiality.
              </p>
            </div>
      
            <!-- Rule 4 -->
            <div>
              <h4 class="font-bold text-white mb-2">🔍 4. Always Verify Information</h4>
              <p class="text-sm text-gray-300">AI can make confident mistakes (called “hallucinations”). Double-check all facts before using them in reports, articles, or research.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> “According to ChatGPT, 80% of workers use AI daily.” (no source)<br>
                ✅ <strong>Better:</strong> Verify using credible sources like official studies or news outlets.
              </div>
            </div>
      
            <!-- Rule 5 -->
            <div>
              <h4 class="font-bold text-white mb-2">🤖 5. Watch for Bias or Harmful Outputs</h4>
              <p class="text-sm text-gray-300">AI tools can unintentionally generate offensive, biased, or inaccurate content.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> “Describe the typical programmer” → returns a stereotypical or gendered answer.<br>
                ✅ <strong>Better:</strong> Rephrase: “Describe key skills and traits of successful programmers.”
              </div>
            </div>
      
            <!-- Rule 6 -->
            <div>
              <h4 class="font-bold text-white mb-2">🛡️ 6. Use Only Reputable and Transparent Tools</h4>
              <p class="text-sm text-gray-300">Stick to well-known platforms that have clear privacy policies and contact details. Be cautious with unknown “free AI” tools.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                ❌ <strong>Example:</strong> Downloading a random “AI Resume Generator” from a sketchy website.<br>
                ✅ <strong>Better:</strong> Use verified tools from trusted developers or directories like AIviary.
              </div>
            </div>
      
            <!-- Pro Tip -->
            <div class="mt-6 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
              💡 <strong>Pro Tip:</strong> If you wouldn’t post it publicly on social media, don’t type it into an AI tool. Treat every prompt as potentially visible.
            </div>
          </div>
        `
      }
    ];
    renderDropdowns('aiGuidesContainer', guides);
  }

  renderCategories();
  renderAIGuides();
});
