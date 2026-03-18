document.addEventListener('DOMContentLoaded', () => {
  // Toast helper
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

  function bookGradient(index) {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    ];
    return gradients[index % gradients.length];
  }

  // Load seller's books
  if (typeof getMockBooks === 'function') {
    const container = document.getElementById('seller-books');
    if (container) {
      getMockBooks().then(books => {
        const myBooks = books.slice(0, 6);
        myBooks.forEach((b, idx) => {
          const col = document.createElement('div');
          col.className = 'col-sm-6 col-md-4';
          col.innerHTML = `
            <div class="card h-100">
              <div style="height:180px; ${bookGradient(idx)}; display:flex; align-items:center; justify-content:center; position:relative;">
                <i class="bi bi-book" style="font-size:3rem; color:rgba(255,255,255,0.3);"></i>
                <div class="price-tag">${b.price}</div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title" style="font-size:0.9rem;">${b.title}</h5>
                <p class="card-text" style="font-size:0.8rem;">${b.author}</p>
                <div class="d-flex gap-2 mt-auto">
                  <button class="btn btn-outline-primary btn-sm flex-fill"><i class="bi bi-pencil me-1"></i>Düzenle</button>
                  <button class="btn btn-sm flex-fill delete-book" style="border:1px solid var(--accent-coral); color: var(--accent-coral);"><i class="bi bi-trash3 me-1"></i>Sil</button>
                </div>
              </div>
            </div>
          `;
          container.appendChild(col);
        });

        // Delete handlers
        container.querySelectorAll('.delete-book').forEach(btn => {
          btn.addEventListener('click', () => {
            const card = btn.closest('.col-sm-6');
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => card.remove(), 300);
            showToast('Kitap silindi.', 'info');
          });
        });
      });
    }
  }

  // Add book form
  const form = document.getElementById('add-book-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = form.querySelector('#title').value.trim();
      if (!title) {
        showToast('Lütfen kitap başlığı girin.', 'error');
        return;
      }
      showToast(`"${title}" başarıyla eklendi!`, 'success');
      form.reset();
    });
  }

  // Sidebar nav
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showToast('Bu bölüm yakında aktif olacak!', 'info');
    });
  });
});
