export function renderBreadcrumb(items) {
  const breadcrumbEl = document.getElementById('breadcrumb');
  if (!breadcrumbEl) return;

  breadcrumbEl.innerHTML = ''; // Clear existing content

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;

    // Separator
    if (index > 0) {
      const separator = document.createElement('span');
      separator.textContent = '/';
      separator.className = 'separator';
      breadcrumbEl.appendChild(separator);
    }

    if (!isLast && item.href) {
      // Link items
      const link = document.createElement('a');
      link.href = item.href;
      link.rel = 'noopener noreferrer';
      link.textContent = item.label;

      // Consistent typography
      link.className =
        'text-sm text-gray-400 hover:text-white transition-colors flex items-center';

      breadcrumbEl.appendChild(link);
    } else {
      // Active item
      const span = document.createElement('span');
      span.textContent = item.label;

      // Same typography
      span.className =
        'text-sm text-white font-semibold flex items-center';

      breadcrumbEl.appendChild(span);
    }
  });
}
