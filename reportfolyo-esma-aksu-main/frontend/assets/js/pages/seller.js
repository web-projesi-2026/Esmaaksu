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

  // Check login
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // Demo mode: Create an anonymous seller object for the demo if user is not logged in
    userId = '609b5f5b5f5b5f5b5f5b5f5b'; // Fake admin/seller id as fallback
  }

  // Load seller's books
  const container = document.getElementById('seller-books');
  async function loadMyBooks() {
    if (!container) return;
    try {
      const dbBooks = await getBooks(); // or fetch(`/api/books/seller/${userId}`) depending on auth
      
      container.innerHTML = '';
      if(dbBooks.length === 0) {
         container.innerHTML = '<p>Henüz kitap eklemediniz.</p>';
         return;
      }
      
      dbBooks.forEach((b, idx) => {
        let imageSrc = '/assets/images/book-placeholder.png';
        if (b.image) {
          imageSrc = b.image.startsWith('http') || b.image.startsWith('/uploads') ? b.image : `/${b.image}`;
        }
        
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4';
        col.innerHTML = `
          <div class="card h-100">
            <div style="height:180px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
              <img src="${imageSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/assets/images/book-placeholder.png'" />
              <div class="price-tag" style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.6); color:white; padding:4px 8px; border-radius:4px;">${b.price} TL</div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title" style="font-size:0.9rem;">${b.title}</h5>
              <p class="card-text" style="font-size:0.8rem;">${b.author}</p>
              <div class="d-flex gap-2 mt-auto">
                <button class="btn btn-outline-primary btn-sm flex-fill"><i class="bi bi-pencil me-1"></i>Düzenle</button>
                <button class="btn btn-sm flex-fill delete-book" data-id="${b._id}" style="border:1px solid var(--accent-coral); color: var(--accent-coral);"><i class="bi bi-trash3 me-1"></i>Sil</button>
              </div>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadMyBooks();

  // Add book form
  const form = document.getElementById('add-book-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      formData.append('seller', userId); // For the API

      // But dummy ID is not valid object id if not present in DB.
      // So we will just hit the endpoint directly.
      try {
        const response = await fetch('http://localhost:3000/api/books', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showToast(`"${data.title}" başarıyla eklendi!`, 'success');
          form.reset();
          loadMyBooks();
        } else {
          // Gelen hata 'seller' nesnesi mongo'da bulunamadığı içinse geçici kullanıcı oluşturalım:
          if(data.message && data.message.includes('Cast to ObjectId failed for value')) {
              showToast('Lütfen önce sisteme Giriş Yapın (Kayıtlı Satıcı).', 'error');
          } else {
              showToast('Hata: ' + data.message, 'error');
          }
        }
      } catch (error) {
        showToast('Bağlantı hatası.', 'error');
      }
    });
  }
});
