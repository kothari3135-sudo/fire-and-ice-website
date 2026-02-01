// Simple HTML partial includes (works with Live Server)
(async () => {
  const anchors = document.querySelectorAll('[data-include]');
  for (const el of anchors) {
    const file = el.getAttribute('data-include');
    const res = await fetch(`partials/${file}`);
    el.innerHTML = await res.text();
  }
})();
