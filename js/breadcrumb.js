/**
 * Injects breadcrumb links dynamically.
 * Last item is bold and white, earlier steps are grey.
 */
export function setBreadcrumb(pathArray) {
  const container = document.getElementById('breadcrumb');
  if (!container) return;

  const html = pathArray.map((item, index) => {
    const isLast = index === pathArray.length - 1;
    return `<span class="${isLast ? 'text-white' : 'text-gray-400'}">${item}</span>`;
  }).join('<span class="mx-1 text-gray-500">/</span>');

  container.innerHTML = html;
}
