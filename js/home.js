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
    { key: 'office', name: 'Office Tools', icon: 'smile', colorFrom: 'from-[#E11D48]', colorTo: 'to-[#DB2777]', image: 'Images/office/office.webp' },
    { key: 'jobs', name: 'Career & Job Tools', icon: 'smile', colorFrom: 'from-pink-400', colorTo: 'to-red-500', image: 'Images/jobs/jobs.webp' }
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
        title: 'Choosing the Right AI Tool for Your Task',
        subtitle: 'Pick faster, avoid wasting time.',
        icon: 'sliders',
        content: `
          <div class="space-y-8">
      
            <!-- Intro -->
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm text-gray-200 leading-relaxed">
                The best tool isn’t the fanciest — it’s the one that fits your <strong>task</strong>,
                <strong>workflow</strong>, and <strong>budget</strong>. Use this quick framework to choose in minutes.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Goal</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Inputs</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Outputs</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Workflow</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Privacy</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Cost</span>
              </div>
            </div>
      
            <!-- Rule 01 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">01</span> Start with your goal
              </h4>
              <p class="text-sm text-gray-300">
                Define the job in one sentence. Your goal determines the category (writing, design, coding, research, ops).
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> I want to try AI.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> I want an AI tool that summarizes research papers and produces an outline I can paste into a report.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> A clear goal prevents “feature shopping” and narrows the shortlist fast.
              </p>
            </div>
      
            <!-- Rule 02 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">02</span> Check inputs and outputs
              </h4>
              <p class="text-sm text-gray-300">
                Make sure the tool supports what you work with (PDF, audio, URLs, docs) and what you need back (Doc, slides, CSV, export).
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Choose a tool that looks good, then discover it can’t export anything.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> Confirm it can import your format (PDF/Docs/etc.) and export your output (DOCX/CSV/links) before committing.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> A “great” tool is useless if it doesn’t fit your real inputs/outputs.
              </p>
            </div>
      
            <!-- Rule 03 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">03</span> Evaluate workflow fit (integrations)
              </h4>
              <p class="text-sm text-gray-300">
                Look for integrations with what you already use: Google Docs, Notion, Chrome, Slack, API access, or team features.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Pick a tool that forces you to copy/paste everything all day.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> Choose a tool that plugs into your existing workflow (Docs/Notion/Browser) or has a solid API.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Workflow fit beats raw “AI quality” for day-to-day productivity.
              </p>
            </div>
      
            <!-- Rule 04 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">04</span> Compare cost vs. time saved
              </h4>
              <p class="text-sm text-gray-300">
                Think in outcomes: does it save time weekly? Does it reduce errors? Does it replace multiple tools?
              </p>
      
              <div class="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Simple rule of thumb</p>
                <p class="text-sm text-gray-200">
                  If a tool saves you <strong>1 hour/week</strong>, even a small subscription can be worth it.
                  If it costs money but adds friction, it’s “expensive” even if it’s cheap.
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Time saved</span>
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Quality improved</span>
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Fewer tools</span>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> “Free” tools often cost you time; value is measured in outcomes.
              </p>
            </div>
      
            <!-- Rule 05 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">05</span> Verify trust: privacy + reliability
              </h4>
              <p class="text-sm text-gray-300">
                Before signing up, check how data is handled, whether there’s a clear policy, and whether reviews mention stability.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Use a “free AI” site with no company info, no policy, and unclear data handling.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> Look for transparent policies, reputable company details, and consistent user feedback on reliability.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> If you wouldn’t paste it into email, don’t paste it into a random AI tool.
              </p>
            </div>
      
            <!-- Quick checklist -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-3">5-minute selection checklist</p>
              <ul class="space-y-3 text-sm text-gray-200">
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"></span>
                  <span><strong>Goal:</strong> one sentence describing the job.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"></span>
                  <span><strong>Inputs/outputs:</strong> supports your formats + exports what you need.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"></span>
                  <span><strong>Workflow:</strong> integrations or API reduce copy/paste.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"></span>
                  <span><strong>Trust:</strong> clear privacy policy + reliable reviews.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"></span>
                  <span><strong>Value:</strong> worth it if it saves meaningful time each week.</span>
                </li>
              </ul>
            </div>
      
          </div>
        `
      },
      {
        title: 'How to Prompt AI Tools Correctly',
        subtitle: 'Get better outputs in fewer tries.',
        icon: 'edit-3',
        content: `
          <div class="space-y-8">
      
            <!-- Intro -->
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm text-gray-200 leading-relaxed">
                Good prompting is just good communication: <strong>goal</strong>, <strong>context</strong>, and
                <strong>constraints</strong>. Use the patterns below and you’ll instantly get more useful results.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Goal</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Audience</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Tone</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Format</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Constraints</span>
              </div>
            </div>
      
            <!-- Rule 01 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">01</span> Be specific and clear
              </h4>
              <p class="text-sm text-gray-300">
                Include purpose, audience, and constraints. Vague prompts create vague results.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Write about dogs.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> Write a 500-word blog post about adopting senior dogs for first-time owners. Calm, friendly tone. Include 3 benefits + a short CTA.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Better constraints reduce rework and increase output quality.
              </p>
            </div>
      
            <!-- Rule 02 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">02</span> Provide context (role + situation)
              </h4>
              <p class="text-sm text-gray-300">
                Tell the AI who you are and what’s happening. Context changes tone, depth, and relevance.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Write an email about a meeting.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> Write a short, friendly follow-up email from a team lead to a design team reminding them about tomorrow’s sprint review. Include agenda + time.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Without context the model guesses your intent — that’s where “meh” results come from.
              </p>
            </div>
      
            <!-- Rule 03 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">03</span> Define the output format
              </h4>
              <p class="text-sm text-gray-300">
                Ask for the structure you want: bullets, table, short summary, email draft, checklist, etc.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Give me marketing ideas.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> List 5 social campaign ideas in bullet points. For each: goal, audience, hook, and a one-line example post.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Structure saves editing time and makes outputs easier to reuse.
              </p>
            </div>
      
            <!-- Rule 04 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">04</span> Use descriptive language for visuals
              </h4>
              <p class="text-sm text-gray-300">
                For creative outputs, specify style, mood, lighting, camera angle, and key objects.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200"><span class="text-red-300 font-semibold">❌</span> Generate a picture of a cat.</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200"><span class="text-green-300 font-semibold">✅</span> A cozy watercolor of a ginger cat sleeping by a window, soft morning light, warm tones, shallow depth of field.</p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Descriptive prompts reduce randomness and get you closer to the look you want.
              </p>
            </div>
      
            <!-- Rule 05 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">05</span> Iterate with small, specific edits
              </h4>
              <p class="text-sm text-gray-300">
                Treat it like a conversation: request precise changes instead of restarting from scratch.
              </p>
      
              <div class="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Good follow-ups</p>
                <div class="flex flex-wrap gap-2">
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Make it more confident</span>
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Shorten by 30%</span>
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Add a bullet summary</span>
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">Rewrite for beginners</span>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span> Small edits converge faster than re-prompting from zero.
              </p>
            </div>
      
            <!-- Quick prompt template -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Prompt template</p>
              <p class="text-sm text-gray-200 leading-relaxed">
                <strong>Role:</strong> You are a [role].<br>
                <strong>Goal:</strong> Help me [goal].<br>
                <strong>Context:</strong> [who/what/where].<br>
                <strong>Constraints:</strong> [tone, length, rules].<br>
                <strong>Output:</strong> Return as [format].
              </p>
            </div>
      
          </div>
        `
      },
      {
        title: 'Using AI Safely and Ethically',
        subtitle: 'Avoid common privacy and compliance mistakes.',
        icon: 'shield',
        content: `
          <div class="space-y-8">
      
            <!-- Intro -->
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm text-gray-200 leading-relaxed">
                AI tools are powerful, but they don’t understand confidentiality.
                Treat every prompt as <strong>potentially logged</strong> and design your usage around
                privacy, trust, and verification.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Privacy</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Confidentiality</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Verification</span>
                <span class="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">Compliance</span>
              </div>
            </div>
      
            <!-- Rule 01 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">01</span> Never share personal details
              </h4>
              <p class="text-sm text-gray-300">
                Avoid entering any personally identifiable information (PII) into AI tools.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-red-300 font-semibold">❌</span>
                    Hi, my name is Emma Collins. I live at 15 Bridge Road in London. Can you help me write a rental application?
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-green-300 font-semibold">✅</span>
                    Help me write a polite rental application for a young professional moving to London.
                  </p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span>
                Prompts may be logged or reviewed. Once shared, personal data is difficult to retract.
              </p>
            </div>
      
            <!-- Rule 02 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">02</span> Avoid uploading confidential or client data
              </h4>
              <p class="text-sm text-gray-300">
                Never paste private business, financial, or client-owned information into AI tools.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-red-300 font-semibold">❌</span>
                    Here’s our client list and pricing model — suggest improvements.
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-green-300 font-semibold">✅</span>
                    What’s a good structure for presenting client data in a pricing proposal?
                  </p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span>
                Uploading sensitive data may violate NDAs, contracts, or regulations like GDPR.
              </p>
            </div>
      
            <!-- Rule 03 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">03</span> Use AI as a coach, not a ghostwriter
              </h4>
              <p class="text-sm text-gray-300">
                Don’t paste unpublished essays, assessments, or internal documents. Summarize instead.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-red-300 font-semibold">❌</span>
                    This is my entire essay draft. Rewrite it for me.
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Do</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-green-300 font-semibold">✅</span>
                    Suggest ways to improve the introduction of an essay about renewable energy markets.
                  </p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span>
                Using AI as a drafting assistant preserves integrity and avoids policy violations.
              </p>
            </div>
      
            <!-- Rule 04 -->
            <div class="space-y-2">
              <h4 class="text-white font-semibold text-base">
                <span class="text-gray-400 mr-2">04</span> Always verify AI-generated information
              </h4>
              <p class="text-sm text-gray-300">
                AI outputs can sound confident while being wrong. Always fact-check critical details.
              </p>
      
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Don’t</p>
                  <p class="text-sm text-gray-200">
                    <span class="text-red-300 font-semibold">❌</span>
                    According to this AI, remote work started in 2012.
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-sm text-gray-200">
                    <span class="text-green-300 font-semibold">✅</span>
                    Ask for sources, then independently verify dates, statistics, and claims.
                  </p>
                </div>
              </div>
      
              <p class="mt-3 text-xs text-gray-400">
                <span class="font-semibold text-gray-300">Why it matters:</span>
                AI predicts language patterns — it doesn’t validate truth.
              </p>
            </div>
      
            <!-- Quick safety checklist -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p class="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-3">Safe usage checklist</p>
              <ul class="space-y-3 text-sm text-gray-200">
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span>No personal or identifying information.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span>No confidential business or client data.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span>Summarize sensitive material instead of pasting it.</span>
                </li>
                <li class="flex gap-3">
                  <span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span>Verify important facts with trusted sources.</span>
                </li>
              </ul>
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
