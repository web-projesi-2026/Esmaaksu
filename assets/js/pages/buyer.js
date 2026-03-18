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

  // Star rating HTML
  function starsHTML(rating) {
    let html = '<div class="star-rating">';
    for (let i = 1; i <= 5; i++) {
      html += i <= Math.round(rating) ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
    }
    html += '</div>';
    return html;
  }

  // Gradient for cards
  function bookGradient(index) {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    ];
    return gradients[index % gradients.length];
  }

  // Load recommended books
  if (typeof getMockBooks === 'function') {
    const container = document.getElementById('buyer-books');
    if (container) {
      getMockBooks().then(books => {
        const recommended = books.slice(0, 8);
        recommended.forEach((b, idx) => {
          const col = document.createElement('div');
          col.className = 'col-sm-6 col-md-4 col-lg-3';
          col.innerHTML = `
            <div class="card h-100">
              <div style="height:180px; ${bookGradient(b.id)}; display:flex; align-items:center; justify-content:center; position:relative;">
                <i class="bi bi-book" style="font-size:3rem; color:rgba(255,255,255,0.3);"></i>
                <div class="price-tag">${b.price}</div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title" style="font-size:0.9rem;">${b.title}</h5>
                <p class="card-text" style="font-size:0.8rem;">${b.author}</p>
                ${starsHTML(b.rating)}
                <a href="book-detail.html?id=${b.id}" class="btn btn-primary btn-sm mt-auto" style="margin-top:0.5rem !important;">
                  <i class="bi bi-eye me-1"></i>Detay
                </a>
              </div>
            </div>
          `;
          container.appendChild(col);
        });
      });
    }
  }

  // Sidebar nav active state
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showToast('Bu bölüm yakında aktif olacak!', 'info');
    });
  });
});
