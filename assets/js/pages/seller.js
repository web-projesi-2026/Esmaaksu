document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000/api/books';
  const sellerId = localStorage.getItem('userId') || 1;

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
    setTimeout(() => toast.remove(), 3500);
  }

  const tableBody = document.getElementById('seller-books-table');
  const modal = document.getElementById('book-modal');
  const form = document.getElementById('seller-book-form');
  const modalTitle = document.getElementById('modal-title');
  const submitBtn = document.getElementById('modal-submit-btn');
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');

  let editingBookId = null;

  // ==============================
  // Kitapları Yükle (GET)
  // ==============================
  async function loadMyBooks() {
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4" style="color:#888;">Yükleniyor...</td></tr>';

    try {
      const res = await fetch(`${API_URL}/seller/${sellerId}`);
      const books = await res.json();

      // İstatistikleri güncelle
      if (statTotal) statTotal.textContent = books.length;
      if (statActive) statActive.textContent = books.length;

      if (books.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5" style="color:#888;">
              <i class="bi bi-inbox" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
              Henüz kitap eklemediniz. "Yeni Kitap Ekle" butonuna tıklayın.
            </td>
          </tr>`;
        return;
      }

      tableBody.innerHTML = '';
      books.forEach(book => {
        const row = document.createElement('tr');
        const img = book.image || 'assets/images/book-placeholder.png';

        row.innerHTML = `
          <td><img src="${img}" class="book-thumb" onerror="this.style.display='none'"></td>
          <td>
            <span class="fw-bold">${book.title}</span><br>
            <small style="color:#888;">${book.author}</small>
          </td>
          <td class="text-warning fw-bold">${Number(book.price).toFixed(2)} TL</td>
          <td><span class="badge bg-secondary" style="font-size:0.75rem;">${book.category || '—'}</span></td>
          <td><span class="badge-status badge-active">AKTİF</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit-action" data-id="${book.id}" title="Düzenle"><i class="bi bi-pencil"></i></button>
              <button class="action-btn delete-action" data-id="${book.id}" title="Sil"><i class="bi bi-trash-fill"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      });

      attachListeners(books);
    } catch (err) {
      console.error('Kitaplar yüklenirken hata:', err);
      // API yoksa books.json'dan dene (fallback)
      try {
        const res2 = await fetch('books.json');
        const fallbackBooks = await res2.json();
        renderFallback(fallbackBooks);
      } catch {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4" style="color:#e74c3c;">Bağlantı hatası.</td></tr>';
      }
    }
  }

  function renderFallback(books) {
    if (statTotal) statTotal.textContent = books.length;
    if (statActive) statActive.textContent = books.length;
    tableBody.innerHTML = '';

    books.forEach(book => {
      const row = document.createElement('tr');
      const img = book.image || 'assets/images/book-placeholder.png';
      row.innerHTML = `
        <td><img src="${img}" class="book-thumb" onerror="this.style.display='none'"></td>
        <td><span class="fw-bold">${book.title}</span><br><small style="color:#888;">${book.author}</small></td>
        <td class="text-warning fw-bold">${Number(book.price).toFixed(2)} TL</td>
        <td><span class="badge bg-secondary" style="font-size:0.75rem;">${book.category || '—'}</span></td>
        <td><span class="badge-status badge-active">AKTİF</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit-action" data-id="${book.id}" title="Düzenle"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete-action" data-id="${book.id}" title="Sil"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    attachListeners(books);
  }

  // ==============================
  // Düzenle ve Sil Butonları
  // ==============================
  function attachListeners(books) {
    // SİL
    document.querySelectorAll('.delete-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!confirm('Bu kitabı silmek istediğinize emin misiniz?')) return;

        try {
          const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('Kitap başarıyla silindi!', 'success');
            loadMyBooks();
          } else {
            showToast('Silme sırasında hata oluştu.', 'error');
          }
        } catch {
          showToast('Sunucu bağlantı hatası.', 'error');
        }
      });
    });

    // DÜZENLE
    document.querySelectorAll('.edit-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const book = books.find(b => b.id === id);
        if (!book) return;

        editingBookId = id;
        modalTitle.textContent = '📝 Kitabı Düzenle';
        submitBtn.textContent = 'GÜNCELLE';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-success');

        form.title.value = book.title;
        form.author.value = book.author;
        form.price.value = book.price;
        form.category.value = book.category || 'Edebiyat';
        form.imageUrl.value = book.image || '';

        openModal();
      });
    });
  }

  // ==============================
  // Modal İşlemleri
  // ==============================
  function openModal() {
    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    form.reset();
    editingBookId = null;
    modalTitle.textContent = '📚 Yeni Kitap Ekle';
    submitBtn.textContent = 'KAYDET';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-primary');
  }

  document.getElementById('btn-add-new').addEventListener('click', () => {
    closeModal(); // reset first
    openModal();
  });
  document.getElementById('open-add-modal').addEventListener('click', (e) => { e.preventDefault(); closeModal(); openModal(); });
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.querySelector('.table-header .btn').addEventListener('click', () => { closeModal(); openModal(); });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ==============================
  // Form Submit (Ekle / Güncelle)
  // ==============================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookData = {
      title: form.title.value.trim(),
      author: form.author.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value,
      imageUrl: form.imageUrl.value.trim(),
      seller: sellerId
    };

    if (!bookData.title || !bookData.author || !bookData.price) {
      showToast('Lütfen tüm zorunlu alanları doldurun.', 'error');
      return;
    }

    try {
      let res;
      if (editingBookId) {
        // GÜNCELLE (PUT)
        res = await fetch(`${API_URL}/${editingBookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
      } else {
        // EKLE (POST)
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
      }

      if (res.ok) {
        showToast(editingBookId ? `"${bookData.title}" güncellendi!` : `"${bookData.title}" eklendi!`, 'success');
        closeModal();
        loadMyBooks();
      } else {
        const data = await res.json();
        showToast('Hata: ' + (data.message || 'Bilinmeyen hata'), 'error');
      }
    } catch {
      showToast('Sunucu bağlantı hatası. Lütfen backend çalıştığından emin olun.', 'error');
    }
  });

  // Başlat
  loadMyBooks();
});
