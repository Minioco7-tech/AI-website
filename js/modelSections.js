// modelSections.js — DRY reusable renderers for model.html sections
// These functions allow you to add new dataset fields without rewriting HTML.

// ------------------------------
// Shared Section Wrapper
// ------------------------------
export function section(title, content) {
  return `
    <div class="mb-12">
      <h3 class="text-2xl font-semibold mb-3 text-white">${title}</h3>
      ${content}
    </div>
  `;
}

// ------------------------------
// Features List
// ------------------------------
export function renderFeatureList(features) {
  if (!features?.length) return "";
  return section("Key Features", `
    <ul class="list-disc list-inside text-gray-300 space-y-1">
      ${features.map(f => `<li>${f}</li>`).join('')}
    </ul>
  `);
}

// ------------------------------
// Use Cases
// ------------------------------
export function renderUseCases(use_cases) {
  if (!use_cases?.length) return "";
  return section("Best For", `
    <ul class="list-disc list-inside text-gray-300 space-y-1">
      ${use_cases.map(u => `<li>${u}</li>`).join('')}
    </ul>
  `);
}

// ------------------------------
// Pricing
// ------------------------------
export function renderPricing(pricing) {
  if (!pricing) return "";
  return section("Pricing", `
    <p class="text-gray-300 leading-relaxed">${pricing}</p>
  `);
}

// ------------------------------
// Pros & Cons
// ------------------------------
export function renderProsCons(pros, cons) {
  if (!pros?.length && !cons?.length) return "";

  return section("Pros & Cons", `
    <div class="grid sm:grid-cols-2 gap-8">

      ${pros?.length ? `
        <div>
          <h4 class="text-green-400 font-semibold mb-2">Pros</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-1">
            ${pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      ` : ""}

      ${cons?.length ? `
        <div>
          <h4 class="text-red-400 font-semibold mb-2">Cons</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-1">
            ${cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ""}

    </div>
  `);
}

// ------------------------------
// Screenshots Gallery
// ------------------------------
export function renderScreenshots(screenshots) {
  if (!screenshots?.length) return "";
  return section("Screenshots", `
    <div class="grid sm:grid-cols-2 gap-4">
      ${screenshots.map(src => `
        <img src="${src}" alt="Screenshot" class="rounded-lg border border-white/10 shadow-lg" loading="lazy">
      `).join('')}
    </div>
  `);
}
