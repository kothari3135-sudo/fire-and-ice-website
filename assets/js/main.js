// Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Mobile nav toggle
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-toggle');
  if (btn) {
    const nav = document.getElementById('primary-nav');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  }
});

// Helpers
const getParam = (k) => new URLSearchParams(location.search).get(k);

// CATEGORY RENDER (placeholder; will use products.json later)
(async function renderCategory() {
  const mount = document.getElementById('category-grid');
  if (!mount) return;
  const slug = getParam('slug') || 'rings';
  const title = document.getElementById('cat-title');
  if (title) title.textContent = slug.charAt(0).toUpperCase() + slug.slice(1);

  // placeholder cards; real data comes from assets/data/products.json
  mount.innerHTML = Array.from({ length: 8 })
    .map(
      (_, i) => `
    <article class="card">
      <div class="ph ph-img" role="img" aria-label="Product image placeholder"></div>
      <div class="card-body">
        <h3>Item ${i + 1}</h3>
        <p>Code: FI-XXXX-00${i + 1}</p>
        <button class="btn" data-open-modal>View Details</button>
      </div>
    </article>
  `
    )
    .join('');
})();

// BASIC MODAL (skeleton)
document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-open-modal]');
  const close = e.target.closest('[data-close-modal]');
  const root = document.getElementById('modal-root');

  if (open && root) {
    root.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" data-close-modal aria-label="Close">×</button>
        <div class="modal-body">
          <div class="ph ph-img lg"></div>
          <h2>Product Title</h2>
          <p>Short description. Materials, purity, weight, carat…</p>
          <p><strong>Code:</strong> FI-XXXX-001</p>
        </div>
      </div>
    `;
    document.body.classList.add('no-scroll');
  }
  if (close) {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }
});
