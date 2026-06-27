// ==========================================
// 1. GLOBAL UI ELEMENTS & HELPERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-toggle');
  if (btn) {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('is-open');
  }
});

const getParam = (k) => new URLSearchParams(location.search).get(k);
let globalProducts = [];

// Case-Insensitive Excel Header Parser maps row metrics seamlessly[cite: 6]
const getProp = (obj, key) => {
  if (!obj) return '';
  const target = key.toLowerCase().trim();
  for (let k in obj) {
    if (k.toLowerCase().trim() === target) return obj[k];
  }
  return '';
};

// ==========================================
// 2. DYNAMIC AUTOMATED PRODUCTS GRID (category.html)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid-container');
  const catTitle = document.getElementById('category-title');

  if (productGrid) {
    const urlCat = getParam('cat');
    const urlCol = getParam('c');

    if (catTitle && urlCat) {
      catTitle.innerText = urlCat.replace('-', ' ').toUpperCase();
    }

    const activeFilterCat = urlCat ? urlCat.toLowerCase().trim() : 'rings';

    fetch('assets/data/products.json')
      .then((res) => res.json())
      .then((products) => {
        globalProducts = products;
        productGrid.innerHTML = '';

        let filteredProducts = [];

        if (urlCat) {
          filteredProducts = products.filter((p) => {
            const categoryVal = getProp(p, 'category');
            if (!categoryVal) return false;
            const norm = categoryVal.toLowerCase().replace(' ', '-').trim();
            if (activeFilterCat === 'rings') return norm === 'rings' || norm === 'ring';
            if (activeFilterCat === 'earrings') return norm === 'earrings' || norm === 'earring';
            if (activeFilterCat === 'bracelets') return norm === 'bracelets' || norm === 'bracelet';
            if (activeFilterCat === 'bangles') return norm === 'bangles' || norm === 'bangle';
            if (activeFilterCat === 'pendant-sets')
              return norm === 'pendant-sets' || norm === 'pendant-set' || norm === 'pendant';
            if (activeFilterCat === 'necklace-sets')
              return norm === 'necklace-sets' || norm === 'necklace-set' || norm === 'necklace';
            return norm === activeFilterCat;
          });
        } else if (urlCol) {
          filteredProducts = products.filter((p) => {
            const colVal = getProp(p, 'collection');
            return colVal && colVal.toLowerCase().trim() === urlCol.toLowerCase().trim();
          });
        } else {
          filteredProducts = products.filter((p) => {
            const categoryVal = getProp(p, 'category');
            return categoryVal && categoryVal.toLowerCase().trim() === 'rings';
          });
          if (catTitle) catTitle.innerText = 'OUR JEWELLERY';
        }

        if (filteredProducts.length === 0) {
          productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--muted); padding: 40px 0;">New collection pieces arriving soon.</p>`;
          return;
        }

        filteredProducts.forEach((prod) => {
          const card = document.createElement('a');
          card.className = 'collection-card fade-in';
          card.setAttribute('href', '#');

          const prodCode = getProp(prod, 'code');
          const prodSubfolder = getProp(prod, 'subfolder');
          card.setAttribute('data-id', prodCode);

          const thumbPath = `assets/img/products/${prodSubfolder}/${prodCode}/1.JPG`;

          card.innerHTML = `
              <div class="collection-img">
                  <img src="${thumbPath}" alt="Product ${prodCode}" style="background:var(--parchment)">
              </div>
              <div class="collection-body" style="text-align: center;">
                  <h2 style="font-size: var(--fs-h3); letter-spacing: 0.15em; margin-bottom: 0;">${prodCode}</h2>
              </div>
          `;

          card.addEventListener('click', (e) => {
            e.preventDefault();
            openProductModal(prod);
          });

          productGrid.appendChild(card);
        });
      })
      .catch((err) => console.error('Error connecting to inventory matrix:', err));
  }
});

// ==========================================
// 3. MASTER AUTOMATED HUB GENERATOR (categories.html)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const hubInjector = document.getElementById('categories-hub-injector');
  if (hubInjector) {
    const categoryMap = [
      { id: 'rings', display: 'Rings' },
      { id: 'earrings', display: 'Earrings' },
      { id: 'bracelets', display: 'Bracelets' },
      { id: 'bangles', display: 'Bangles' },
      { id: 'pendant-sets', display: 'Pendant Sets' },
      { id: 'necklace-sets', display: 'Necklace Sets' },
    ];

    fetch('assets/data/products.json')
      .then((res) => res.json())
      .then((products) => {
        hubInjector.innerHTML = '';

        categoryMap.forEach((cat) => {
          const matchPool = products.filter((p) => {
            const categoryVal = getProp(p, 'category');
            if (!categoryVal) return false;
            const normalized = categoryVal.toLowerCase().replace(' ', '-').trim();

            if (cat.id === 'rings') return normalized === 'rings' || normalized === 'ring';
            if (cat.id === 'earrings') return normalized === 'earrings' || normalized === 'earring';
            if (cat.id === 'bracelets')
              return normalized === 'bracelets' || normalized === 'bracelet';
            if (cat.id === 'bangles') return normalized === 'bangles' || normalized === 'bangle';
            if (cat.id === 'pendant-sets')
              return (
                normalized === 'pendant-sets' ||
                normalized === 'pendant-set' ||
                normalized === 'pendant'
              );
            if (cat.id === 'necklace-sets')
              return (
                normalized === 'necklace-sets' ||
                normalized === 'necklace-set' ||
                normalized === 'necklace'
              );
            return normalized === cat.id;
          });

          if (matchPool.length > 0) {
            const sectionBlock = document.createElement('div');
            sectionBlock.className = 'hub-category-wrapper';

            let cardsHtml = '';
            const displayLimit = Math.min(matchPool.length, 3);

            for (let i = 0; i < displayLimit; i++) {
              let prod = matchPool[i];
              const prodCode = getProp(prod, 'code');
              const prodSubfolder = getProp(prod, 'subfolder');
              let thumbPath = `assets/img/products/${prodSubfolder}/${prodCode}/1.JPG`;

              cardsHtml += `
                  <a class="collection-card" href="category.html?cat=${cat.id}">
                      <div class="collection-img">
                          <img src="${thumbPath}" alt="Teaser ${prodCode}" style="background:var(--parchment)">
                      </div>
                      <div class="collection-body" style="text-align: center;">
                          <p style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase; font-weight:600; color:var(--muted); margin-bottom:4px;">Product Code</p>
                          <h2 style="font-size: var(--fs-h3); letter-spacing: 0.1em; margin-bottom: 0;">${prodCode}</h2>
                      </div>
                  </a>
              `;
            }

            sectionBlock.innerHTML = `
                <div class="hub-category-header">
                    <h2>${cat.display}</h2>
                    <a href="category.html?cat=${cat.id}" class="view-all-link">View Entire Range &rarr;</a>
                </div>
                <div class="hub-teaser-grid">
                    ${cardsHtml}
                </div>
            `;
            hubInjector.appendChild(sectionBlock);
          }
        });

        if (hubInjector.innerHTML === '') {
          hubInjector.innerHTML = `<p style="text-align:center; color: var(--muted); padding:40px 0;">Our designer catalog matrix is expanding. New items arriving shortly.</p>`;
        }
      })
      .catch((err) => console.error('Error auto-compiling master categories hub:', err));
  }
});

// ==========================================
// 4. PRODUCT DETAIL MODAL SYSTEM
// ==========================================

function openProductModal(product) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  let imagesHtml = '';
  let thumbsHtml = '';

  const prodCode = getProp(product, 'code');
  const prodSubfolder = getProp(product, 'subfolder');
  const prodDescription = getProp(product, 'description');
  const prodWeight = getProp(product, 'weight');
  const prodCollection = getProp(product, 'collection');
  const totalPhotos = parseInt(getProp(product, 'image_count')) || 1;

  for (let i = 1; i <= totalPhotos; i++) {
    let photoUrl = `assets/img/products/${prodSubfolder}/${prodCode}/${i}.JPG`;
    imagesHtml += `<img src="${photoUrl}" alt="${prodCode} slide ${i}">`;
    let activeClass = i === 1 ? 'is-active' : '';
    thumbsHtml += `<img src="${photoUrl}" class="modal-thumb ${activeClass}" data-slide-index="${i - 1}" alt="Thumb click ${i}">`;
  }

  let collectionTagHtml = '';
  if (prodCollection && prodCollection.toLowerCase() !== 'none') {
    let displayColName = prodCollection.replace('-', ' ');
    collectionTagHtml = `<p style="font-size: 11px; letter-spacing: 0.15em; color: var(--antique-gold); text-transform: uppercase; margin-bottom: 8px;">Collection: ${displayColName}</p>`;
  }

  root.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-wrapper">
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal-close" data-close-modal aria-label="Close">×</button>

          <div class="modal-layout">
              <div class="modal-image-container">
                  <div class="modal-gallery-wrapper">
                      <button class="modal-nav-arrow prev" aria-label="Previous image">‹</button>
                      <button class="modal-nav-arrow next" aria-label="Next image">›</button>

                      <div class="modal-gallery">
                          ${imagesHtml}
                      </div>
                  </div>
                  <div class="modal-thumbnails">
                      ${thumbsHtml}
                  </div>
              </div>
              <div class="modal-info">
                  ${collectionTagHtml}
                  <h1>${prodCode}</h1>
                  <p>${prodDescription}</p>
                  ${prodWeight ? `<p style="font-size: var(--fs-small); color: var(--muted); margin-top: 12px; font-family: var(--ff-ui);"><strong>Weight:</strong> ${prodWeight}</p>` : ''}
              </div>
          </div>
        </div>
      </div>
    `;

  document.body.classList.add('no-scroll');

  const gallery = root.querySelector('.modal-gallery');
  const thumbs = root.querySelectorAll('.modal-thumb');
  const btnPrev = root.querySelector('.modal-nav-arrow.prev');
  const btnNext = root.querySelector('.modal-nav-arrow.next');

  const scrollToSlide = (index) => {
    if (index < 0 || index >= gallery.children.length) return;
    const targetSlide = gallery.children[index];
    gallery.scrollTo({ left: targetSlide.offsetLeft - gallery.offsetLeft, behavior: 'smooth' });
  };

  btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    scrollToSlide(currentIndex - 1);
  });

  btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    scrollToSlide(currentIndex + 1);
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-slide-index'));
      scrollToSlide(slideIndex);
    });
  });

  if (gallery) {
    gallery.addEventListener('scroll', () => {
      const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
      thumbs.forEach((thumb, i) => {
        if (i === currentIndex) {
          thumb.classList.add('is-active');
        } else {
          thumb.classList.remove('is-active');
        }
      });
    });
  }
}

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }
});

// ==========================================
// 5. COLLECTION EDITORIAL CAROUSEL SYSTEM (HIGH-PERFORMANCE SWEEPS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('collection.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('c') || 'heirloom-modules';

    fetch('assets/data/collections.json')
      .then((res) => res.json())
      .then((data) => {
        const collection = data[collectionId];
        if (collection) {
          document.getElementById('lookbook-title').innerText = collection.title;
          document.getElementById('lookbook-subtitle').innerText = collection.subtitle;
          document.querySelector('.story-intro').innerText = collection.intro;

          const heroImg = document.getElementById('main-hero-img');
          if (heroImg) {
            heroImg.src = `assets/img/collections/${collectionId}/hero.jpg`;
            heroImg.alt = `${collection.title} Campaign Hero`;
          }

          const storyTexts = document.querySelectorAll('.story-text');
          if (storyTexts.length >= 3) {
            storyTexts[0].querySelector('h2').innerText = collection.section1_title;
            storyTexts[0].querySelector('p').innerText = collection.section1_text;
            storyTexts[1].querySelector('h2').innerText = collection.section2_title;
            storyTexts[1].querySelector('p').innerText = collection.section2_text;
            storyTexts[2].querySelector('h2').innerText = collection.section3_title;
            storyTexts[2].querySelector('p').innerText = collection.section3_text;
          }

          const moodImages = document.querySelectorAll('.story-image img');
          if (moodImages.length >= 3) {
            moodImages[0].src = `assets/img/collections/${collectionId}/mood1.jpg`;
            moodImages[1].src = `assets/img/collections/${collectionId}/mood2.jpg`;
            moodImages[2].src = `assets/img/collections/${collectionId}/mood3.jpg`;
          }

          const carouselContainer = document.getElementById('carousel-container');
          if (carouselContainer) {
            carouselContainer.innerHTML = '';
            const totalImages = collection.image_count || 4;
            for (let i = 4; i <= totalImages; i++) {
              let img = document.createElement('img');
              img.src = `assets/img/collections/${collectionId}/mood${i}.jpg`;
              img.style.background = 'var(--parchment)';
              carouselContainer.appendChild(img);
            }
          }

          const lookbookPrev = document.querySelector('.lookbook-nav-arrow.prev');
          const lookbookNext = document.querySelector('.lookbook-nav-arrow.next');

          if (lookbookPrev && lookbookNext && carouselContainer) {
            lookbookPrev.addEventListener('click', () => {
              const stepWidth = carouselContainer.clientWidth * 0.45;
              carouselContainer.scrollLeft -= stepWidth;
            });
            lookbookNext.addEventListener('click', () => {
              const stepWidth = carouselContainer.clientWidth * 0.45;
              carouselContainer.scrollLeft += stepWidth;
            });
          }

          const navInjector = document.getElementById('lookbook-nav-injector');
          if (navInjector) {
            navInjector.innerHTML = '';
            Object.keys(data).forEach((key) => {
              if (key !== collectionId) {
                const targetCol = data[key];
                const navCard = document.createElement('a');
                navCard.className = 'collection-card';
                navCard.setAttribute('href', `collection.html?c=${key}`);

                navCard.innerHTML = `
                    <div class="collection-img">
                        <img src="assets/img/collections/${key}/hero.jpg" alt="${targetCol.title} Overview Link">
                    </div>
                    <div class="collection-body" style="text-align: center;">
                        <h2>${targetCol.title}</h2>
                        <p style="font-size: 12px; max-width: 320px; margin: 0 auto;">${targetCol.subtitle}</p>
                    </div>
                `;
                navInjector.appendChild(navCard);
              }
            });
          }
        }
      })
      .catch((err) => console.error('Error parsing lookbook matrices:', err));
  }
});
