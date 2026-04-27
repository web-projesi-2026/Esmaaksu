document.addEventListener('DOMContentLoaded', () => {
  // ── Menu toggle removed ──

  // ── Navbar shrink on scroll ──
  const header = document.querySelector('.navbar');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('shrink');
      else header.classList.remove('shrink');
    });
  }

  // ── Toast notification helper ──
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  function createToastContainer() {
    const c = document.createElement('div');
    c.className = 'toast-container';
    c.id = 'toast-container';
    document.body.appendChild(c);
    return c;
  }

  // ── Star rating HTML helper ──
  function starsHTML(rating) {
    let html = '<div class="star-rating">';
    for (let i = 1; i <= 5; i++) {
      html += i <= Math.round(rating) 
        ? '<i class="bi bi-star-fill"></i>' 
        : '<i class="bi bi-star"></i>';
    }
    html += '</div>';
    return html;
  }

  // ── Generate book cover gradient ──
  function bookGradient(index) {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)'
    ];
    return gradients[index % gradients.length];
  }

  // ── Load books ──
  if (typeof getMockBooks === 'function') {
    let allBooks = [];
    const container = document.querySelector('.books');
    
    const render = (list) => {
      if (!container) return;
      container.innerHTML = '';
      list.forEach((b, idx) => {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-3';
        
        const badgeHTML = b.isNew 
          ? '<span class="tag tag-mint" style="position:absolute;top:12px;left:12px;z-index:2;">Yeni</span>'
          : b.isBestSeller 
            ? '<span class="tag tag-gold" style="position:absolute;top:12px;left:12px;z-index:2;">Çok Satan</span>'
            : '';

        const imageHTML = b.image 
          ? `<img src="${b.image}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/assets/images/book-placeholder.png'" />` 
          : `<div style="width:100%; height:100%; ${bookGradient(b.id)} display:flex; align-items:center; justify-content:center;"><i class="bi bi-book" style="font-size:4rem; color:rgba(255,255,255,0.3);"></i></div>`;

        col.innerHTML = `
          <div class="card h-100">
            <div style="height:220px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
              ${imageHTML}
              ${badgeHTML}
              <div class="price-tag">${b.price} TL</div>
            </div>
            <div class="card-overlay">
              <button class="btn btn-sm add-to-cart-btn" data-id="${b.id}">
                <i class="bi bi-bag-plus me-1"></i>Sepete Ekle
              </button>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${b.title}</h5>
              <p class="card-text">${b.author}</p>
              ${starsHTML(b.rating)}
              <small style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.75rem;">${b.reviewCount} değerlendirme</small>
              <a href="book-detail.html?id=${b.id}" class="btn btn-primary mt-auto" style="margin-top: 0.75rem !important;">
                <i class="bi bi-eye me-1"></i>Detay
              </a>
            </div>
          </div>
        `;
        container.appendChild(col);
      });

      // Attach add-to-cart buttons
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const countEl = document.querySelector('.cart-count');
          if (countEl) {
            let n = parseInt(countEl.textContent) || 0;
            countEl.textContent = n + 1;
          }
          showToast('Kitap sepete eklendi!', 'success');
        });
      });
    };

    getMockBooks().then(books => {
      allBooks = books;
      render(allBooks);
    });

    // Search handler
    const searchInput = document.getElementById('search-input');
    let currentCategory = '';
    
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value;
        const filtered = filterBooks(allBooks, {query: q, category: currentCategory});
        render(filtered);
      });
    }

    // Category filter
    const catLinks = document.querySelectorAll('.category-nav a');
    catLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        catLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentCategory = link.textContent.trim();
        const filtered = filterBooks(allBooks, {
          query: searchInput ? searchInput.value : '', 
          category: currentCategory
        });
        render(filtered);
      });
    });
  }

  // ── Favorite link ──
  const favLink = document.querySelector('.bi-heart')?.closest('a');
  if (favLink) {
    favLink.addEventListener('click', e => {
      e.preventDefault();
      showToast('Favorilere eklendi!', 'success');
      const icon = favLink.querySelector('.bi-heart');
      if (icon) {
        icon.classList.toggle('bi-heart');
        icon.classList.toggle('bi-heart-fill');
        icon.style.color = icon.classList.contains('bi-heart-fill') ? 'var(--accent-rose)' : '';
      }
    });
  }

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});