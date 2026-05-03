// Kitap verilerini books.json dosyasından dinamik olarak çekmek için fetch() kullanımı
async function getBooks() {
  try {
    // books.json dosyasına istek atıyoruz
    const response = await fetch('books.json');
    
    // Yanıt başarılı değilse hata fırlat
    if (!response.ok) throw new Error('Veri çekilemedi!');
    
    // Yanıtı JSON'a çevir ve döndür
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Kitapları getirirken hata:', error);
    return [];
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
