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
          <div class="space-y-8">

            <!-- Tip 1 -->
            <div>
              <h4 class="font-bold text-white mb-2">🛑 1. Never Share Personal Details</h4>
              <p class="text-sm text-gray-300">Treat every AI chat like a public forum. Avoid entering any personally identifiable information (PII) such as:</p>
              <ul class="list-disc list-inside text-sm text-gray-400 mt-2">
                <li>📛 Full name, home address, phone number</li>
                <li>📧 Personal or work email addresses</li>
                <li>💳 Bank details, passwords, ID numbers</li>
                <li>📅 Dates of birth, national insurance numbers, or medical data</li>
              </ul>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-red-500 p-3 rounded-md text-sm">
                ❌ <strong>Unsafe:</strong> “Hi, my name is Emma Collins. I live in London at 15 Bridge Road. Can you help me write a rental application?”<br>
                ✅ <strong>Safe:</strong> “Help me write a polite rental application for a young professional moving to London.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> AI systems may log your prompts to improve performance. Once shared, your personal information can’t easily be deleted or controlled — even by you.
              </p>
            </div>
      
            <!-- Tip 2 -->
            <div>
              <h4 class="font-bold text-white mb-2">⚠️ 2. Avoid Uploading Confidential or Client Data</h4>
              <p class="text-sm text-gray-300">Never upload or paste information that belongs to others or contains sensitive business content. This includes:</p>
              <ul class="list-disc list-inside text-sm text-gray-400 mt-2">
                <li>📂 Internal company reports or contracts</li>
                <li>🧾 Financial statements or customer lists</li>
                <li>📎 Private project files, prototypes, or source code</li>
                <li>👥 Client names, addresses, or email chains</li>
              </ul>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-yellow-500 p-3 rounded-md text-sm">
                ❌ <strong>Unsafe:</strong> “Here’s our client list and pricing model — can you suggest improvements?”<br>
                ✅ <strong>Safe:</strong> “What’s the best structure for presenting client data in a pricing proposal?”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Even reputable AI tools may temporarily store uploaded content. If it includes private data, that could violate contracts, NDAs, or data protection laws like GDPR.
              </p>
            </div>
      
            <!-- Tip 3 -->
            <div>
              <h4 class="font-bold text-white mb-2">💼 3. Be Careful With Academic or Workplace Material</h4>
              <p class="text-sm text-gray-300">Don’t paste unpublished essays, assessments, or official work documents directly into AI tools. Instead, summarize your request.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-orange-500 p-3 rounded-md text-sm">
                ❌ <strong>Unsafe:</strong> “This is my entire essay draft — can you rewrite it for me?”<br>
                ✅ <strong>Safe:</strong> “Can you suggest improvements for an introduction about the effects of renewable energy on global markets?”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Sharing unsubmitted coursework or work files can break academic integrity rules or internal policies. It’s better to use AI as a *coach* for structure and clarity, not a ghostwriter.
              </p>
            </div>
      
            <!-- Tip 4 -->
            <div>
              <h4 class="font-bold text-white mb-2">🔍 4. Always Verify AI-Generated Information</h4>
              <p class="text-sm text-gray-300">AI tools can produce text that sounds confident but isn’t factually correct. Before sharing or submitting, double-check:</p>
              <ul class="list-disc list-inside text-sm text-gray-400 mt-2">
                <li>📆 Dates and statistics</li>
                <li>📚 Research citations or references</li>
                <li>📰 Quotes, legal facts, and news claims</li>
              </ul>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-purple-500 p-3 rounded-md text-sm">
                ❌ <strong>Unsafe:</strong> “According to ChatGPT, remote work began in 2012.” (Incorrect — remote work has existed for decades.)<br>
                ✅ <strong>Safe:</strong> “ChatGPT mentioned remote work trends — let’s confirm with official sources like Statista or the OECD.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> AI models don’t “know” facts — they predict text patterns. Verifying their output prevents misinformation and protects your credibility.
              </p>
            </div>
      
            <!-- Pro Tip -->
            <div class="mt-6 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
              💡 <strong>Pro Tip:</strong> If you wouldn’t email it to a stranger or post it on social media, don’t share it with an AI tool.
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
