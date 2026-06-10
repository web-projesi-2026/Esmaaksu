// Kitap verilerini önce API'den, hata olursa books.json'dan çek
async function getBooks() {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    if (!response.ok) throw new Error('API Hatası: ' + response.statusText);
    const books = await response.json();
    if (books && books.length > 0) return books;
    throw new Error('API boş dizi döndürdü');
  } catch (error) {
    console.warn('API\'den kitaplar yüklenemedi, books.json\'a geçiliyor:', error.message);
    // Fallback: books.json'dan oku
    try {
      const res = await fetch('books.json');
      if (!res.ok) throw new Error('books.json okunamadı');
      return await res.json();
    } catch (e) {
      console.error('books.json de okunamadı:', e);
      return [];
    }
  }
}

// Diğer dosyalarda (main.js gibi) kullanılabilmesi için fonksiyonu global objeye ekliyoruz
window.getMockBooks = getBooks;

// Arama ve kategori filtrelemesi için yardımcı fonksiyon
window.filterBooks = (books, {query = '', category = ''} = {}) => {
  return books.filter(b => {
    const q = query.toLowerCase();
    const matchQuery = q === '' || 
      (b.title || '').toLowerCase().includes(q) || 
      (b.author || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q);

    let matchCat = true;
    if (category === 'Best Seller') {
      matchCat = b.isBestSeller || b.rating >= 4.5; // Basit bir mantık
    } else if (category !== '') {
      matchCat = (b.category || '').toLowerCase() === category.toLowerCase();
    }
    
    return matchQuery && matchCat;
  });
};


// Profil sayfasına yönlendirme için yardımcı fonksiyon
window.navigateToProfile = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'seller') {
    window.location.href = 'seller.html';
  } else if (role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    // Alıcılar için panel istenmiyor, ana sayfaya yönlendir
    window.location.href = 'index.html';
  }
};
