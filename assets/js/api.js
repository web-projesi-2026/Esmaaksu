// Kitap verilerini books.json dosyasından dinamik olarak çekmek için fetch() kullanımı
async function getBooks() {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    if (!response.ok) throw new Error('API Hatası: ' + response.statusText);
    return await response.json();
  } catch (error) {
    console.error('Kitaplar yüklenemedi:', error);
    return []; // Boş dizi döndür ki mock verilerle karışmasın
  }
}

// Diğer dosyalarda (main.js gibi) kullanılabilmesi için fonksiyonu global objeye ekliyoruz
window.getMockBooks = getBooks;

// Arama ve kategori filtrelemesi için yardımcı fonksiyon
window.filterBooks = (books, {query = '', category = ''} = {}) => {
  return books.filter(b => {
    const matchQuery = query === '' || 
      (b.title || '').toLowerCase().includes(query.toLowerCase()) || 
      (b.author || '').toLowerCase().includes(query.toLowerCase());
    const matchCat = category === '' || b.category === category;
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
