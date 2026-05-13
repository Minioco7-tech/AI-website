// recommendations.js
// Handles both:
// 1. Homepage recommendation wizard
// 2. recommendations.html results page

import { fetchJSON, normalizeCategories, normalizeTags } from './utils.js';
import { createModelCard } from './modelCard.js';

const STORAGE_KEY = 'aiviaryRecommendationAnswers';
const MODELS_PATH = 'models.json';

// --------------------------------------------------
// Wizard step data
// --------------------------------------------------
const recommendationSteps = [
  {
    id: 'goal',
    question: 'What do you want help with?',
    subtitle: 'Choose the outcome that matters most right now.',
    options: [
      { label: 'Save Time', value: 'save-time', icon: 'clock' },
      { label: 'Create Content', value: 'create-content', icon: 'edit-3' },
      { label: 'Organize Work', value: 'organize-work', icon: 'folder' },
      { label: 'Learn Faster', value: 'learn-faster', icon: 'book-open' },
      { label: 'Automate Tasks', value: 'automate-tasks', icon: 'zap' },
      { label: 'Grow My Business', value: 'grow-business', icon: 'trending-up' }
    ]
  },
  {
    id: 'role',
    question: 'What best describes you?',
    subtitle: 'This helps us match tools to your workflow.',
    options: [
      { label: 'Student', value: 'student', icon: 'book' },
      { label: 'Creator', value: 'creator', icon: 'camera' },
      { label: 'Freelancer', value: 'freelancer', icon: 'briefcase' },
      { label: 'Founder', value: 'founder', icon: 'rocket' },
      { label: 'Developer', value: 'developer', icon: 'code' },
      { label: 'Small Team', value: 'small-team', icon: 'users' }
    ]
  },
  {
    id: 'painPoint',
    question: 'What slows you down most?',
    subtitle: 'Pick the friction point you want AI to reduce.',
    options: [
      { label: 'Emails/Admin', value: 'emails-admin', icon: 'mail' },
      { label: 'Meetings', value: 'meetings', icon: 'calendar' },
      { label: 'Research', value: 'research', icon: 'search' },
      { label: 'Repetitive Tasks', value: 'repetitive-tasks', icon: 'repeat' },
      { label: 'Content Creation', value: 'content-creation', icon: 'pen-tool' },
      { label: 'Organization', value: 'organization', icon: 'layers' }
    ]
  },
  {
    id: 'setup',
    question: 'What’s your budget and skill level?',
    subtitle: 'Keep it simple — we’ll prioritise tools that fit.',
    compound: true,
    groups: [
      {
        id: 'budget',
        label: 'Budget',
        options: [
          { label: 'Free Only', value: 'free-only', icon: 'gift' },
          { label: 'Flexible Budget', value: 'flexible-budget', icon: 'credit-card' }
        ]
      },
      {
        id: 'skill',
        label: 'Skill Level',
        options: [
          { label: 'Beginner', value: 'beginner', icon: 'smile' },
          { label: 'Intermediate', value: 'intermediate', icon: 'sliders' },
          { label: 'Advanced', value: 'advanced', icon: 'cpu' }
        ]
      }
    ]
  }
];

// --------------------------------------------------
// Matching maps for your existing model format
// --------------------------------------------------
const intentMap = {
  'save-time': [
    'assistant', 'productivity', 'workflow', 'automation', 'summarize',
    'summarise', 'admin', 'browser-based editor', 'real-time'
  ],
  'create-content': [
    'content', 'creator', 'creators', 'writing', 'documents', 'design',
    'video', 'audio', 'voice', 'image', 'narration', 'social', 'media'
  ],
  'organize-work': [
    'office', 'productivity', 'workflow', 'documents', 'notes', 'organize',
    'organise', 'team', 'project', 'workspace'
  ],
  'learn-faster': [
    'learning', 'study', 'student', 'education', 'tutor', 'research',
    'summarize', 'summarise', 'explain', 'course'
  ],
  'automate-tasks': [
    'automation', 'api', 'developer', 'workflow', 'repetitive', 'tasks',
    'integrations', 'real-time', 'operations'
  ],
  'grow-business': [
    'business', 'finance', 'operations', 'marketing', 'sales', 'founder',
    'team', 'analytics', 'growth', 'customers'
  ],

  student: [
    'student', 'learning', 'education', 'study', 'research', 'documents',
    'summarize', 'summarise', 'writing'
  ],
  creator: [
    'creator', 'creators', 'content', 'design', 'media', 'audio',
    'video', 'voice', 'image', 'youtube', 'podcast'
  ],
  freelancer: [
    'freelancer', 'client', 'business', 'writing', 'design', 'productivity',
    'workflow', 'proposal', 'portfolio'
  ],
  founder: [
    'founder', 'business', 'startup', 'growth', 'operations', 'marketing',
    'sales', 'analytics', 'team'
  ],
  developer: [
    'developer', 'development', 'code', 'api', 'software', 'automation',
    'docs', 'technical'
  ],
  'small-team': [
    'team', 'collaboration', 'office', 'workflow', 'business',
    'productivity', 'operations', 'documents'
  ],

  'emails-admin': [
    'email', 'admin', 'office', 'assistant', 'documents', 'workflow',
    'productivity', 'operations'
  ],
  meetings: [
    'meeting', 'transcription', 'summary', 'notes', 'audio', 'office',
    'productivity'
  ],
  research: [
    'research', 'paper', 'papers', 'study', 'analysis', 'science',
    'summarize', 'summarise', 'insight'
  ],
  'repetitive-tasks': [
    'automation', 'workflow', 'api', 'tasks', 'operations', 'repetitive',
    'productivity'
  ],
  'content-creation': [
    'content', 'writing', 'design', 'media', 'audio', 'video', 'voice',
    'image', 'creator', 'narration'
  ],
  organization: [
    'organization', 'organize', 'organise', 'notes', 'office',
    'documents', 'workflow', 'workspace'
  ],

  beginner: [
    'beginner-friendly', 'accessible', 'browser-based', 'easy', 'simple',
    'no-code', 'non-technical'
  ],
  intermediate: [
    'workflow', 'editor', 'integrations', 'custom', 'professional',
    'teams'
  ],
  advanced: [
    'api', 'developers', 'developer', 'advanced', 'technical',
    'custom', 'docs'
  ]
};

const categoryBoostMap = {
  'create-content': ['documents', 'design', 'audio'],
  'learn-faster': ['learning', 'research'],
  'organize-work': ['office', 'assistants', 'documents'],
  'automate-tasks': ['development', 'office', 'assistants'],
  'grow-business': ['finance', 'data', 'office'],
  research: ['research', 'learning'],
  developer: ['development'],
  creator: ['design', 'audio', 'documents'],
  student: ['learning', 'research', 'documents']
};

// --------------------------------------------------
// Homepage wizard
// --------------------------------------------------
function initRecommendationWizard() {
  const mount = document.getElementById('recommendation-wizard');
  if (!mount) return;

  let currentStep = 0;
  const answers = {
    goal: '',
    role: '',
    painPoint: '',
    budget: '',
    skill: ''
  };

  function renderStep() {
    const step = recommendationSteps[currentStep];
    const progress = ((currentStep + 1) / recommendationSteps.length) * 100;

    mount.innerHTML = `
      <div class="recommendation-shell recommendation-tone-${currentStep + 1}">
        <div class="recommendation-inner">
          <div class="recommendation-heading">
            <p class="recommendation-eyebrow">Guided discovery</p>
            <h2>Find Your Perfect AI Stack</h2>
            <p>Find your perfect solution in 4 simple steps.</p>
            <span>Answer a few quick questions and discover AI tools tailored to your workflow.</span>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-card-top">
              <div>
                <p class="recommendation-step-label">Finding your ideal tools</p>
                <h3>${step.question}</h3>
                <p>${step.subtitle}</p>
              </div>

              <div class="recommendation-step-count">
                ${currentStep + 1}/4
              </div>
            </div>

            <div class="recommendation-options">
              ${step.compound ? renderCompoundStep(step) : renderSingleChoiceStep(step)}
            </div>

            <div class="recommendation-footer">
              <button class="recommendation-back" ${currentStep === 0 ? 'disabled' : ''}>
                Back
              </button>

              <div class="recommendation-progress-wrap">
                <div class="recommendation-progress-bar">
                  <div style="width: ${progress}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindStepEvents(step);
    if (window.feather) feather.replace({ width: 20, height: 20 });
  }

  function renderSingleChoiceStep(step) {
    return step.options.map(option => `
      <button
        type="button"
        class="recommendation-option"
        data-step-id="${step.id}"
        data-value="${option.value}"
      >
        <span class="recommendation-option-icon">
          <i data-feather="${option.icon}"></i>
        </span>
        <span>${option.label}</span>
      </button>
    `).join('');
  }

  function renderCompoundStep(step) {
    return `
      <div class="recommendation-compound">
        ${step.groups.map(group => `
          <div class="recommendation-group">
            <p>${group.label}</p>
            <div class="recommendation-group-options">
              ${group.options.map(option => `
                <button
                  type="button"
                  class="recommendation-option recommendation-option-small"
                  data-step-id="${group.id}"
                  data-value="${option.value}"
                >
                  <span class="recommendation-option-icon">
                    <i data-feather="${option.icon}"></i>
                  </span>
                  <span>${option.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <button type="button" class="recommendation-final-cta" disabled>
          Find My AI Stack
          <i data-feather="arrow-right"></i>
        </button>
      </div>
    `;
  }

  function bindStepEvents(step) {
    const backBtn = mount.querySelector('.recommendation-back');

    backBtn?.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    });

    const optionButtons = mount.querySelectorAll('.recommendation-option');

    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const stepId = button.dataset.stepId;
        const value = button.dataset.value;

        answers[stepId] = value;

        const group = button.closest('.recommendation-group-options') || button.parentElement;
        group.querySelectorAll('.recommendation-option').forEach(btn => {
          btn.classList.remove('is-selected');
        });

        button.classList.add('is-selected');

        if (!step.compound) {
          setTimeout(() => {
            currentStep++;
            renderStep();
          }, 280);
        } else {
          updateFinalCTA();
        }
      });
    });

    const finalCTA = mount.querySelector('.recommendation-final-cta');

    finalCTA?.addEventListener('click', () => {
      if (!answers.budget || !answers.skill) return;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

      finalCTA.classList.add('is-loading');
      finalCTA.innerHTML = `
        Building your recommendations...
        <i data-feather="loader"></i>
      `;

      if (window.feather) feather.replace({ width: 20, height: 20 });

      setTimeout(() => {
        window.location.href = 'recommendations.html';
      }, 800);
    });
  }

  function updateFinalCTA() {
    const finalCTA = mount.querySelector('.recommendation-final-cta');
    if (!finalCTA) return;

    finalCTA.disabled = !(answers.budget && answers.skill);
  }

  renderStep();
}

// --------------------------------------------------
// Results page
// --------------------------------------------------
async function initRecommendationResults() {
  const resultsMount = document.getElementById('recommendation-results');
  if (!resultsMount) return;

  const summaryMount = document.getElementById('recommendation-summary');
  const answers = getStoredAnswers();

  if (!answers) {
    resultsMount.innerHTML = `
      <div class="recommendation-empty">
        <h2>No recommendation profile found</h2>
        <p>Complete the quick recommendation flow to get personalised AI tool suggestions.</p>
        <a href="index.html#recommendation-wizard" class="recommendation-final-cta">
          Start Recommendation Flow
        </a>
      </div>
    `;
    return;
  }

  summaryMount.innerHTML = renderAnswerSummary(answers);

  const models = await fetchJSON(MODELS_PATH);
  const scoredModels = models
    .map(model => ({
      model,
      score: scoreModel(model, answers),
      reason: generateReason(model, answers)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const sections = buildRecommendationSections(scoredModels, answers);

  resultsMount.innerHTML = '';
  renderResultsSection(resultsMount, 'Best Overall Match', sections.bestOverall);
  renderResultsSection(resultsMount, 'Best Free Option', sections.bestFree);
  renderResultsSection(resultsMount, 'Best for Ease of Use', sections.bestEase);
  renderResultsSection(resultsMount, 'Worth Exploring', sections.worthExploring, true);

  if (window.feather) feather.replace({ width: 20, height: 20 });
}

function getStoredAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function scoreModel(model, answers) {
  let score = 0;

  const searchableText = buildSearchableText(model);
  const categories = normalizeCategories(model.category).map(c => c.toLowerCase());
  const tags = normalizeTags(model.tags).map(t => String(t).toLowerCase());

  const answerValues = [
    answers.goal,
    answers.role,
    answers.painPoint,
    answers.budget,
    answers.skill
  ].filter(Boolean);

  answerValues.forEach(answer => {
    const keywords = intentMap[answer] || [];

    keywords.forEach(keyword => {
      if (searchableText.includes(keyword.toLowerCase())) score += 2;
    });

    if (tags.some(tag => keywords.some(keyword => tag.includes(keyword)))) {
      score += 4;
    }

    const boostedCategories = categoryBoostMap[answer] || [];
    if (categories.some(category => boostedCategories.includes(category))) {
      score += 5;
    }
  });

  if (answers.budget === 'free-only' && isFreeModel(model)) {
    score += 6;
  }

  if (answers.budget === 'free-only' && !isFreeModel(model)) {
    score -= 3;
  }

  if (answers.skill === 'beginner' && isBeginnerFriendly(model)) {
    score += 5;
  }

  if (answers.skill === 'advanced' && hasAdvancedCapability(model)) {
    score += 4;
  }

  return score;
}

function buildSearchableText(model) {
  const parts = [
    model.name,
    model.type,
    model.description,
    model.subtitle,
    model.pricing,
    ...(model.tags || []),
    ...(model.features || []),
    ...(model.category || []),
    ...(model.use_cases || []).flatMap(useCase => [
      useCase.title,
      useCase.description
    ]),
    ...(model.information || []).flatMap(info => [
      info.label,
      info.value
    ])
  ];

  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isFreeModel(model) {
  return String(model.pricing || '').toLowerCase().includes('free');
}

function isBeginnerFriendly(model) {
  const text = buildSearchableText(model);
  return [
    'beginner-friendly',
    'accessible',
    'browser-based',
    'easy',
    'simple',
    'no-code',
    'non-technical'
  ].some(term => text.includes(term));
}

function hasAdvancedCapability(model) {
  const text = buildSearchableText(model);
  return [
    'api',
    'developers',
    'developer',
    'advanced',
    'custom',
    'docs',
    'automation'
  ].some(term => text.includes(term));
}

function buildRecommendationSections(scoredModels, answers) {
  const used = new Set();

  const takeFirst = predicate => {
    const item = scoredModels.find(entry => {
      const id = entry.model.id || entry.model.name;
      return !used.has(id) && predicate(entry);
    });

    if (item) used.add(item.model.id || item.model.name);
    return item ? [item] : [];
  };

  const bestOverall = takeFirst(() => true);

  const bestFree = takeFirst(entry => isFreeModel(entry.model));

  const bestEase = takeFirst(entry => {
    return isBeginnerFriendly(entry.model) || answers.skill === 'beginner';
  });

  const worthExploring = scoredModels
    .filter(entry => !used.has(entry.model.id || entry.model.name))
    .slice(0, 6);

  return {
    bestOverall,
    bestFree,
    bestEase,
    worthExploring
  };
}

function renderResultsSection(container, title, items, grid = false) {
  if (!items || items.length === 0) return;

  const section = document.createElement('section');
  section.className = 'recommendation-result-section';

  section.innerHTML = `
    <div class="recommendation-result-heading">
      <h2>${title}</h2>
    </div>
    <div class="${grid ? 'recommendation-grid' : 'recommendation-featured'}"></div>
  `;

  const gridMount = section.querySelector(grid ? '.recommendation-grid' : '.recommendation-featured');

  items.forEach(item => {
    gridMount.appendChild(createRecommendedCard(item));
  });

  container.appendChild(section);
}

function createRecommendedCard(item) {
  const wrapper = document.createElement('div');
  wrapper.className = 'recommended-card-wrap';

  const card = createModelCard(item.model);

  const reason = document.createElement('div');
  reason.className = 'recommendation-reason';
  reason.innerHTML = `
    <div>
      <span>Why this was chosen</span>
      <p>${item.reason}</p>
    </div>
  `;

  wrapper.appendChild(card);
  wrapper.appendChild(reason);

  return wrapper;
}

function generateReason(model, answers) {
  const role = readableAnswer(answers.role);
  const goal = goalPhrase(answers.goal);
  const painPoint = painPhrase(answers.painPoint);
  const budget = answers.budget === 'free-only'
    ? 'It also has a free option, making it easier to try without commitment.'
    : 'It offers enough flexibility for users who are open to paid or upgraded tools.';

  if (isBeginnerFriendly(model) && answers.skill === 'beginner') {
    return `A strong match for ${role} looking to ${goal}. It helps with ${painPoint} and feels approachable for beginners. ${budget}`;
  }

  return `A strong match for ${role} looking to ${goal}. It is especially useful for ${painPoint}. ${budget}`;
}

function readableAnswer(value) {
  const map = {
    student: 'students',
    creator: 'creators',
    freelancer: 'freelancers',
    founder: 'founders',
    developer: 'developers',
    'small-team': 'small teams'
  };

  return map[value] || 'users';
}

function goalPhrase(value) {
  const map = {
    'save-time': 'save time',
    'create-content': 'create better content',
    'organize-work': 'organise their work',
    'learn-faster': 'learn faster',
    'automate-tasks': 'automate repetitive tasks',
    'grow-business': 'grow their business'
  };

  return map[value] || 'improve their workflow';
}

function painPhrase(value) {
  const map = {
    'emails-admin': 'reducing admin and email friction',
    meetings: 'turning meetings into clearer next steps',
    research: 'speeding up research and understanding information faster',
    'repetitive-tasks': 'removing repetitive manual work',
    'content-creation': 'making content creation faster and easier',
    organization: 'bringing more structure to scattered work'
  };

  return map[value] || 'improving day-to-day productivity';
}

function renderAnswerSummary(answers) {
  const labels = [
    readableLabel(answers.goal),
    readableLabel(answers.role),
    readableLabel(answers.painPoint),
    readableLabel(answers.budget),
    readableLabel(answers.skill)
  ].filter(Boolean);

  return labels.map(label => `
    <span>${label}</span>
  `).join('');
}

function readableLabel(value) {
  const map = {
    'save-time': 'Save Time',
    'create-content': 'Create Content',
    'organize-work': 'Organize Work',
    'learn-faster': 'Learn Faster',
    'automate-tasks': 'Automate Tasks',
    'grow-business': 'Grow My Business',
    student: 'Student',
    creator: 'Creator',
    freelancer: 'Freelancer',
    founder: 'Founder',
    developer: 'Developer',
    'small-team': 'Small Team',
    'emails-admin': 'Emails/Admin',
    meetings: 'Meetings',
    research: 'Research',
    'repetitive-tasks': 'Repetitive Tasks',
    'content-creation': 'Content Creation',
    organization: 'Organization',
    'free-only': 'Free Only',
    'flexible-budget': 'Flexible Budget',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  return map[value] || value;
}

// --------------------------------------------------
// Init
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initRecommendationWizard();
  initRecommendationResults();

  if (window.feather) {
    feather.replace({ width: 20, height: 20 });
  }
});
