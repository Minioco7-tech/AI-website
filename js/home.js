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
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  });


  // Categories data
  const categories = [
    { key: 'all', name: 'All', icon: 'globe', colorFrom: 'from-purple-500', colorTo: 'to-pink-500', image: 'Images/all/all.webp' },
    { key: 'documents', name: 'Writing & Documents', icon: 'edit-3', colorFrom: 'from-[#F59E0B]', colorTo: 'to-[#D97706]', image: 'Images/writing/writing.webp' },
    { key: 'design', name: 'Design & Media', icon: 'pen-tool', colorFrom: 'from-[#14B8A6]', colorTo: 'to-[#06B6D4]', image: 'Images/design/design.webp' },
    { key: 'learning', name: 'Learning', icon: 'book', colorFrom: 'from-[#A855F7]', colorTo: 'to-[#6366F1]', image: 'Images/learning/learning.webp' },
    { key: 'data', name: 'Data & Analytics', icon: 'briefcase', colorFrom: 'from-[#22D3EE]', colorTo: 'to-[#3B82F6]', image: 'Images/business/business.webp' },
    { key: 'assistants', name: 'Assistants', icon: 'message-circle', colorFrom: 'from-[#6366F1]', colorTo: 'to-[#8B5CF6]', image: 'Images/chatbots/chatbot.webp' },
    { key: 'audio', name: 'Audio & Voice', icon: 'volume-2', colorFrom: 'from-[#F59E0B]', colorTo: 'to-[#E11D48]', image: 'Images/speech/speech.webp' },
    { key: 'development', name: 'Development & Code', icon: 'code', colorFrom: 'from-[#0F172A]', colorTo: 'to-[#1E3A8A]', image: 'Images/coding/coding.webp' },
    { key: 'research', name: 'Research', icon: 'cpu', colorFrom: 'from-[#EC4899]', colorTo: 'to-[#F59E0B]', image: 'Images/science/science.webp' },
    { key: 'finance', name: 'Finance & Operations', icon: 'bar-chart-2', colorFrom: 'from-[#10B981]', colorTo: 'to-[#059669]', image: 'Images/finance/finance.webp' },
    { key: 'office', name: 'Office Tools', icon: 'smile', colorFrom: 'from-[#E11D48]', colorTo: 'to-[#DB2777]', image: 'Images/speech/speech.webp' },
    { key: 'jobs', name: 'Career & Job Tools', icon: 'smile', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'Images/speech/speech.webp' }
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
          <div class="space-y-8">
      
            <!-- Tip 1 -->
            <div>
              <h4 class="font-bold text-white mb-2">🎯 1. Be Specific and Clear</h4>
              <p class="text-sm text-gray-300">AI tools perform best when you give them context and direction. Vague prompts lead to vague results. ALWAYS include purpose, tone and details.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-yellow-500 p-3 rounded-md text-sm">
                ❌ <strong>Weak:</strong> “Write about dogs.”<br>
                ✅ <strong>Better:</strong> “Write a 500-word blog post about the benefits of adopting senior dogs, focusing on their calm temperament and loyalty.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> The more detail you give, the more tailored and useful your results will be.
              </p>
            </div>
      
            <!-- Tip 2 -->
            <div>
              <h4 class="font-bold text-white mb-2">🧠 2. Provide Context and Perspective</h4>
              <p class="text-sm text-gray-300">Explain who you are, what you need and who the content is for. Context changes how AI frames its tone and depth.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-orange-500 p-3 rounded-md text-sm">
                ❌ <strong>Generic:</strong> “Write an email about a meeting.”<br>
                ✅ <strong>Better:</strong> “Write a short, friendly follow-up email from a team lead reminding their design team about tomorrow’s sprint review.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Without context, AI guesses your intent. Giving it a role or audience ensures more natural, human-like output.
              </p>
            </div>
      
            <!-- Tip 3 -->
            <div>
              <h4 class="font-bold text-white mb-2">🧾 3. Define the Format and Style You Want</h4>
              <p class="text-sm text-gray-300">Tell the AI exactly how to present the result, the more specific the better! This could be a list, table, summary or email format.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-green-500 p-3 rounded-md text-sm">
                ❌ <strong>Unclear:</strong> “Give me ideas for marketing.”<br>
                ✅ <strong>Better:</strong> “List five creative social media campaign ideas in bullet points, each with a short description and target audience.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> AI responds to structure — defining output format saves editing time later.
              </p>
            </div>
      
            <!-- Tip 4 -->
            <div>
              <h4 class="font-bold text-white mb-2">🎨 4. Use Descriptive Language for Images and Creative Work</h4>
              <p class="text-sm text-gray-300">When generating visuals or creative text, include sensory and stylistic details: mood, color, lighting and perspective.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-pink-500 p-3 rounded-md text-sm">
                ❌ <strong>Weak:</strong> “Generate a picture of a cat.”<br>
                ✅ <strong>Better:</strong> “A cozy watercolor of a ginger cat sleeping by a window with morning light streaming in.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Descriptive prompts help AI visualize your intent and match your creative vision.
              </p>
            </div>
      
            <!-- Tip 5 -->
            <div>
              <h4 class="font-bold text-white mb-2">🔁 5. Iterate and Refine</h4>
              <p class="text-sm text-gray-300">Treat prompting as a conversation — adjust tone, complexity, or format until it fits your needs.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                💬 <strong>Example:</strong> “Make it sound more confident.” / “Add a closing summary.” / “Reformat as a bullet list.” 
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Refining outputs helps you learn how the AI interprets your intent — improving your skills over time.
              </p>
            </div>
          </div>

          <!-- Pro Tip -->
          <div class="mt-6 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
            💡 <strong>Pro Tip:</strong> BE SPECIFIC!!! The more detailed the input, the more detailed the output.
          </div>
        `
      },
      {
        title: 'Choosing the Right AI Tool for Your Task',
        content: `
          <div class="space-y-8">
      
            <!-- Tip 1 -->
            <div>
              <h4 class="font-bold text-white mb-2">🎯 1. Start With Your Goal</h4>
              <p class="text-sm text-gray-300">Begin by defining what you need: writing, image generation, coding help, research or organization. Your goal determines which category of tool fits best.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-yellow-500 p-3 rounded-md text-sm">
                ❌ <strong>Unclear:</strong> “I want to try AI.”<br>
                ✅ <strong>Better:</strong> “I want to use AI to summarize research papers and help outline reports.”
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Specific goals narrow your search and help you find tools designed for that function. Saving time and frustration.
              </p>
            </div>
      
            <!-- Tip 2 -->
            <div>
              <h4 class="font-bold text-white mb-2">🧩 2. Evaluate Features and Integrations</h4>
              <p class="text-sm text-gray-300">Check what the tool actually offers... does it support collaboration, API use, data exports or browser extensions?</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-orange-500 p-3 rounded-md text-sm">
                ❌ <strong>Limited:</strong> A note app that can’t export data or integrate with your workflow.<br>
                ✅ <strong>Better:</strong> A writing AI that syncs with Google Docs, Notion or your browser for smoother use.
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Choosing tools that fit your existing workflow saves setup time and keeps you productive.
              </p>
            </div>
      
            <!-- Tip 3 -->
            <div>
              <h4 class="font-bold text-white mb-2">⚖️ 3. Compare Cost vs. Value</h4>
              <p class="text-sm text-gray-300">Look beyond monthly prices. Consider how much time or effort the tool actually saves you.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-green-500 p-3 rounded-md text-sm">
                💡 <strong>Example:</strong> A $15/month AI that saves you 3 hours a week is often more valuable than a free one that wastes your time.
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> AI tools are productivity multipliers. Not all free ones are truly “cheap,” and not all paid ones are worth it.
              </p>
            </div>
      
            <!-- Tip 4 -->
            <div>
              <h4 class="font-bold text-white mb-2">🔍 4. Check Reviews and Data Practices</h4>
              <p class="text-sm text-gray-300">Before signing up, read privacy policies and community feedback. Check how the company handles your data and what users say about reliability.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-purple-500 p-3 rounded-md text-sm">
                ❌ <strong>Risky:</strong> A “free AI” site with no company info or privacy policy.<br>
                ✅ <strong>Better:</strong> Look for tools that clearly outline how they use your data and safetry precautions they take.
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <strong>Why:</strong> Transparency and user trust are key signs of a reputable AI product.
              </p>
            </div>
      
            <!-- Tip 5 -->
            <div>
              <h4 class="font-bold text-white mb-2">⚙️ 5. Test Before You Commit</h4>
              <p class="text-sm text-gray-300">Use free tiers or trials to test the AI’s accuracy and ease of use before subscribing.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-blue-500 p-3 rounded-md text-sm">
                💬 <strong>Tip:</strong> Run a small project first, like summarizing one article or generating one logo, to see how it performs under real use.
              </div>
            </div>
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
                <strong>Why:</strong> AI systems may log your prompts to improve performance. Once shared, your personal information can’t easily be deleted or controlled. Even by you.
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
                <strong>Why:</strong> Even reputable AI tools may temporarily store uploaded content. If it includes private data, that could violate contracts, NDAs or data protection laws like GDPR.
              </p>
            </div>
      
            <!-- Tip 3 -->
            <div>
              <h4 class="font-bold text-white mb-2">💼 3. Be Careful With Academic or Workplace Material</h4>
              <p class="text-sm text-gray-300">Don’t paste unpublished essays, assessments or official work documents directly into AI tools. Instead, summarize your request.</p>
              <div class="mt-3 bg-[#1A1C20] border-l-4 border-orange-500 p-3 rounded-md text-sm">
                ❌ <strong>Unsafe:</strong> “This is my entire essay draft. Can you rewrite it for me?”<br>
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
                ❌ <strong>Unsafe:</strong> “According to "model", remote work began in 2012.” (Incorrect — remote work has existed for decades.)<br>
                ✅ <strong>Safe:</strong> “Run a quick "Fact check" on information produced by models or ask for its sources and verify”
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
