export function renderBreadcrumb(items) {
  const breadcrumbEl = document.getElementById('breadcrumb');
  if (!breadcrumbEl) return;

  breadcrumbEl.innerHTML = ''; // Clear existing content

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;

    // Add separator (except before first item)
    if (index > 0) {
      const separator = document.createElement('span');
      separator.textContent = '>';
      separator.classList.add('mx-1', 'text-gray-500');
      breadcrumbEl.appendChild(separator);
    }

    if (!isLast && item.href) {
      const link = document.createElement('a');
      link.href = item.href;
      link.rel = 'noopener noreferrer';
      link.textContent = item.label;
      link.className = 'text-gray-400 hover:text-white transition';
      breadcrumbEl.appendChild(link);
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.className = 'active';
      breadcrumbEl.appendChild(span);
    }
  });
}
