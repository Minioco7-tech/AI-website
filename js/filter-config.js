/* filters-config.js
   AIviary filter taxonomy (final)

   Structure:
   1) What the tool IS (Primary function)  -> usually single-select
   2) What it DOES (Capabilities)          -> multi-select
   3) Who it’s FOR (Audience)              -> usually single-select

   Notes:
   - Tags are space-separated (no hyphens unless grammatically required).
   - Keep Categories (your 11) as the first/top filter in the UI.
   - Use these tag groups to render the Tags section in sub-sections.
*/

// ===============================
// 1) WHAT THE TOOL IS (PRIMARY)
// ===============================
export const primaryFunctionGroups = [
  {
    id: "assistants_agents",
    label: "Assistants & agents",
    tags: [
      "ai assistant",
      "coding assistant",
      "meeting assistant",
      "voice generator",
      "video avatar"
    ]
  },
  {
    id: "creation_generation",
    label: "Creation & generation",
    tags: [
      "ai image generator",
      "ai writing tool",
      "presentation generator",
      "app builder",
      "no code builder"
    ]
  },
  {
    id: "editing_enhancement",
    label: "Editing & enhancement",
    tags: [
      "audio enhancement tool",
      "audio editing tool",
      "video editing tool",
      "document ai",
      "pdf tool"
    ]
  },
  {
    id: "automation_workflows",
    label: "Automation & workflows",
    tags: [
      "workflow automation tool",
      "spreadsheet ai",
      "developer tooling",
      "data analysis tool",
      "finance analytics tool",
      "legal ai",
      "recruiting tool",
      "seo tool",
      "social media tool",
      "design tool",
      "research assistant",
      "learning platform",
      "email client",
      "email marketing tool",
      "content marketing tool",
      "data visualization tool"
    ]
  }
];

// ===============================
// 2) WHAT IT DOES (CAPABILITIES)
// ===============================
export const textLanguageCapabilities = {
  id: "text_language",
  label: "Text & language",
  tags: [
    "summarization",
    "paraphrasing",
    "rewriting",
    "grammar style",
    "tone control",
    "long form writing",
    "content generation",
    "prompt engineering",
    "translation"
  ]
};

export const audioVoiceCapabilities = {
  id: "audio_voice",
  label: "Audio & voice",
  tags: [
    "voice cloning",
    "text to speech",
    "noise cancellation",
    "transcription",
    "pronunciation",
    "podcast production"
  ]
};

export const imageDesignCapabilities = {
  id: "image_design",
  label: "Image & design",
  tags: [
    "text to image",
    "image editing",
    "image upscaling",
    "vector design",
    "typography",
    "logo design",
    "brand design",
    "style consistency",
    "ui design",
    "motion design",
    "animation",
    "character design"
  ]
};

export const videoCapabilities = {
  id: "video",
  label: "Video",
  tags: [
    "text to video",
    "video clipping",
    "content repurposing",
    "video animation",
    "code based video"
  ]
};

export const codeDevelopmentCapabilities = {
  id: "code_development",
  label: "Code & development",
  tags: [
    "code generation",
    "code completion",
    "code explanation",
    "code search",
    "debugging",
    "code quality",
    "model experimentation",
    "prompt testing",
    "integrations",
    "automation",
    "no code",
    "real time collaboration"
  ]
};

export const dataAnalyticsCapabilities = {
  id: "data_analytics",
  label: "Data & analytics",
  tags: [
    "semantic search",
    "vector search",
    "data visualization",
    "dashboards",
    "performance analytics",
    "market intelligence",
    "forecasting",
    "big data",
    "geospatial analysis",
    "mapping",
    "decision support",
    "risk detection",
    "compliance",
    "security"
  ]
};

export const businessOpsCapabilities = {
  id: "business_ops",
  label: "Business & ops",
  tags: [
    "collaboration",
    "task management",
    "process management",
    "documentation",
    "workflow recording",
    "reporting",
    "utilities",
    "productivity",
    "outreach",
    "content scheduling",
    "influencer analytics"
  ]
};

export const learningResearchCapabilities = {
  id: "learning_research",
  label: "Learning & research",
  tags: [
    "paper summarizer",
    "academic writing",
    "exam preparation",
    "lesson plans",
    "question generation",
    "learning paths",
    "skill assessment",
    "mentorship",
    "interview prep",
    "mock interviews",
    "ai detection",
    "plagiarism checking",
    "prior art search"
  ]
};

export const capabilityGroups = [
  textLanguageCapabilities,
  audioVoiceCapabilities,
  imageDesignCapabilities,
  videoCapabilities,
  codeDevelopmentCapabilities,
  dataAnalyticsCapabilities,
  businessOpsCapabilities,
  learningResearchCapabilities
];

// ===============================
// 3) WHO IT’S FOR (AUDIENCE)
// ===============================
export const individualAudience = {
  id: "individuals",
  label: "Individuals",
  tags: [
    "creators",
    "designers",
    "developers",
    "students",
    "teachers",
    "professionals",
    "founders"
  ]
};

export const teamAudience = {
  id: "teams_orgs",
  label: "Teams & organisations",
  tags: [
    "teams",
    "marketers",
    "recruiters",
    "researchers",
    "legal teams",
    "finance teams",
    "enterprise",
    "educators"
  ]
};

export const audienceGroups = [individualAudience, teamAudience];

// ===============================
// 4) MASTER "TAGS" DROPDOWN CONFIG
//    (Use under your existing "Tags" section)
// ===============================
export const tagDropdownSections = [
  {
    id: "what_it_is",
    label: "What the tool is",
    selection: "single", // UI hint: radio-style recommended
    groups: primaryFunctionGroups
  },
  {
    id: "what_it_does",
    label: "What it does",
    selection: "multi", // UI hint: checkbox-style
    groups: capabilityGroups
  },
  {
    id: "who_its_for",
    label: "Who it’s for",
    selection: "single", // UI hint: radio-style recommended
    groups: audienceGroups
  }
];

// ===============================
// 5) OPTIONAL HELPERS (dropdown logic)
//    You can ignore these if you already have your own logic.
// ===============================

/** Build tag -> count map from your models array */
export function buildTagCounts(models = []) {
  const counts = Object.create(null);
  for (const m of models) {
    const raw = m?.tags;
    const tags = Array.isArray(raw) ? raw : (raw ? [raw] : []);
    for (const t of tags) {
      const key = String(t).toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Filter the config to hide tags with 0 matches (based on tagCounts).
 * Also drops empty groups/sections for cleaner UI.
 */
export function withTagVisibility(tagCounts = {}, { hideZero = true } = {}) {
  if (!hideZero) return tagDropdownSections;

  const visibleSections = tagDropdownSections
    .map(section => {
      const groups = section.groups
        .map(g => ({
          ...g,
          tags: (g.tags || []).filter(t => (tagCounts[t] || 0) > 0)
        }))
        .filter(g => (g.tags || []).length > 0);

      return { ...section, groups };
    })
    .filter(section => section.groups.length > 0);

  return visibleSections;
}

/**
 * Apply filter selection to models.
 *
 * Default logic:
 * - OR within each section (if user selects multiple tags in the same section)
 * - AND across sections (must satisfy each section that has selections)
 *
 * selected example:
 * {
 *   primary: new Set(["ai image generator"]),
 *   capabilities: new Set(["text to image","style consistency"]),
 *   audience: new Set(["designers"])
 * }
 */
export function applyTagFilters(models = [], selected = {}) {
  const toSet = v =>
    v instanceof Set ? v : new Set(Array.isArray(v) ? v : (v ? [v] : []));

  const selPrimary = toSet(selected.primary);
  const selCaps = toSet(selected.capabilities);
  const selAudience = toSet(selected.audience);

  const any = selPrimary.size || selCaps.size || selAudience.size;
  if (!any) return models;

  const matchOR = (modelTagsSet, selectedSet) => {
    if (!selectedSet.size) return true;
    for (const t of selectedSet) if (modelTagsSet.has(t)) return true;
    return false;
  };

  return models.filter(m => {
    const modelTags = toSet(m.tags || []);
    if (!matchOR(modelTags, selPrimary)) return false;
    if (!matchOR(modelTags, selCaps)) return false;
    if (!matchOR(modelTags, selAudience)) return false;
    return true;
  });
}
