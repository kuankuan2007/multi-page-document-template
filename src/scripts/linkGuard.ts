document.addEventListener('click', (e) => {
  if (e.defaultPrevented) return;
  if (e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as HTMLElement).closest('a');
  if (!a) return;

  if (a.target && a.target !== '_self') return;

  const href= a.getAttribute('href');
  if (!href) return;

  const fullUrl = new URL(href, window.location.origin);
  if (fullUrl.origin !== window.location.origin) return;

  e.preventDefault();
  window.history.pushState(null, '', fullUrl.pathname + fullUrl.search);
});
