document.addEventListener('DOMContentLoaded', async () => {
  // Toast Helper
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // LocalStorage Helpers
  const getFavorites = () => JSON.parse(localStorage.getItem('favorites')) || [];
  const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
  
  const updateCartCount = () => {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      countEl.textContent = total;
    }
  };
  updateCartCount();

  const toggleFavorite = (id) => {
    let favs = getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(fId => fId !== id);
    } else {
      favs.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    return favs.includes(id);
  };

  const addToCart = (book) => {
    let cart = getCart();
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({...book, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  // Star rating HTML
  function starsHTML(rating) {
    let html = '<div class="star-rating">';
    for (let i = 1; i <= 5; i++) {
      html += i <= Math.round(rating) ? '<i class="bi bi-star-fill" style="color: #ffb400;"></i>' : '<i class="bi bi-star" style="color: #ffb400;"></i>';
    }
    html += '</div>';
    return html;
  }

  // Book Card Renderer
  function createBookCard(book) {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    
    const imageHTML = book.image 
      ? `<img src="${book.image}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/assets/images/book-placeholder.png'" />` 
      : `<div style="width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center;"><i class="bi bi-book" style="font-size:3rem; color:rgba(255,255,255,0.3);"></i></div>`;

    col.innerHTML = `
      <div class="card h-100 position-relative">
        <button class="btn btn-sm btn-light remove-fav-btn" data-id="${book.id}" style="position:absolute; top:10px; right:10px; z-index:10; border-radius:50%; width:30px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <i class="bi bi-x-lg text-danger"></i>
        </button>
        <div style="height:180px; display:flex; align-items:center; justify-content:center; overflow:hidden; cursor:pointer;" onclick="window.location.href='book-detail.html?id=${book.id}'">
          ${imageHTML}
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title" style="font-size:0.95rem; margin-bottom:0.5rem; cursor:pointer;" onclick="window.location.href='book-detail.html?id=${book.id}'">${book.title}</h5>
          <p class="card-text text-muted" style="font-size:0.85rem; margin-bottom:0.5rem;">${book.author}</p>
          ${starsHTML(book.rating)}
          <div class="mt-auto pt-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold text-primary">${book.price} TL</span>
            </div>
            <button class="btn btn-primary btn-sm w-100 add-cart-btn" data-id="${book.id}">
              <i class="bi bi-bag-plus me-1"></i>Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    `;
    return col;
  }

  // Load and Render
  async function loadFavorites() {
    const favIds = getFavorites();
    const grid = document.getElementById('favorites-grid');
    const emptyMsg = document.getElementById('empty-message');
    
    if (favIds.length === 0) {
      grid.style.display = 'none';
      emptyMsg.style.display = 'block';
      return;
    }

    try {
      const response = await fetch('books.json');
      const allBooks = await response.json();
      const favBooks = allBooks.filter(b => favIds.includes(b.id));

      grid.innerHTML = '';
      if (favBooks.length === 0) {
        grid.style.display = 'none';
        emptyMsg.style.display = 'block';
      } else {
        emptyMsg.style.display = 'none';
        grid.style.display = 'flex';
        favBooks.forEach(book => {
          const card = createBookCard(book);
          grid.appendChild(card);
        });

        // Attach listeners
        attachCardListeners(favBooks);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      showToast('Favoriler yüklenirken bir hata oluştu.', 'error');
    }
  }

  function attachCardListeners(books) {
    // Add to cart
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const book = books.find(b => b.id === id);
        if (book) {
          addToCart(book);
          showToast('Ürün sepete eklendi!', 'success');
        }
      });
    });

    // Remove from favs
    document.querySelectorAll('.remove-fav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        toggleFavorite(id);
        showToast('Ürün favorilerden çıkarıldı.', 'info');
        loadFavorites(); // Re-render
      });
    });
  }

  loadFavorites();
});
