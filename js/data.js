// data.js — Shared categories, synonyms, stopwords, and helpers

// ----------------------
// Categories
// ----------------------
const categories = [
    { key: 'all', name: 'All Models' },
    { key: 'writing', name: 'Writing & Productivity' },
    { key: 'creativity', name: 'Creativity & Design' },
    { key: 'learning', name: 'Learning & Research' },
    { key: 'business', name: 'Business & Marketing' },
    { key: 'chatbots', name: 'Chatbots & Agents' },
    { key: 'audio', name: 'Audio & Music' },
    { key: 'coding', name: 'Coding & Dev Tools' },
    { key: 'science', name: 'Science & Health' },
    { key: 'finance', name: 'Finance & Analytics' },
    { key: 'everyday', name: 'Everyday Life' }
];

// ----------------------
// Category synonyms (for search)
// ----------------------
const categorySynonyms = {
    writing: ['writing', 'writer', 'content', 'copy', 'text', 'document', 'email'],
    design: ['design', 'art', 'image', 'photo', 'logo', 'graphic', 'visual'],
    learning: ['learning', 'education', 'research', 'study', 'teach', 'knowledge'],
    business: ['business', 'marketing', 'sales', 'brand', 'startup', 'work', 'help'],
    chatbots: ['chat', 'bot', 'assistant', 'agent', 'conversation', 'support'],
    music: ['music', 'audio', 'sound', 'song', 'beat', 'voice', 'sing'],
    coding: ['code', 'coding', 'developer', 'programming', 'software', 'tech'],
    science: ['science', 'health', 'medicine', 'bio', 'lab', 'research'],
    finance: ['finance', 'money', 'analytics', 'data', 'economy', 'bank', 'invest'],
    health: ['health', 'fitness', 'wellbeing', 'medical', 'care', 'wellness']
};

// ----------------------
// Stopwords for search filtering
// ----------------------
const stopwords = ['i','want','to','a','the','and','for','of','in','on','is','with','my','you','it','this','that','at'];

// ----------------------
// Helpers
// ----------------------
function getCategoryName(key) {
    const map = {};
    categories.forEach(c => map[c.key.toLowerCase()] = c.name);
    return map[key.toLowerCase()] || key;
}

function getRandomModels(models, n) {
    const shuffled = [...models].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getMatchedCategory(keywords) {
    for (const [key, synonyms] of Object.entries(categorySynonyms)) {
        if (keywords.some(word => synonyms.includes(word))) return key;
    }
    return null;
}
