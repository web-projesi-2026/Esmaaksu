// =============================================
// RAFARASI — API Katmanı
// Backend bağlantısı + fallback mock veri
// =============================================

const API_BASE = 'http://localhost:3000/api';

// ── Kitapları Backend'den Çek ──
async function getBooks() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    const result = await response.json();
    
    if (result.success && result.data) {
      // Backend verisini frontend formatına dönüştür
      return result.data.map((book, index) => ({
        id: book.id,
        title: book.baslik,
        author: book.yazar,
        category: book.kategori || 'Edebiyat',
        price: parseFloat(book.fiyat).toFixed(2) + ' TL',
        image: book.resim_url || 'assets/images/book-placeholder.png',
        rating: (3.5 + Math.random() * 1.5),
        reviewCount: Math.floor(Math.random() * 500) + 10,
        isNew: index < 4,
        isBestSeller: index >= 4 && index < 8,
        description: book.aciklama,
        sellerId: book.satici_id,
        sellerName: book.satici_isim
      }));
    }
    
    // Backend veri dönmezse fallback'e düş
    return getMockBooks();
  } catch (error) {
    console.warn('⚠️ Backend bağlantısı kurulamadı, mock veri kullanılıyor:', error.message);
    return getMockBooks();
  }
}

// ── Tek Kitap Getir ──
async function getBookById(id) {
  try {
    const response = await fetch(`${API_BASE}/books/${id}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      const book = result.data;
      return {
        id: book.id,
        title: book.baslik,
        author: book.yazar,
        category: book.kategori || 'Edebiyat',
        price: parseFloat(book.fiyat).toFixed(2) + ' TL',
        image: book.resim_url || 'assets/images/book-placeholder.png',
        rating: (3.5 + Math.random() * 1.5),
        reviewCount: Math.floor(Math.random() * 500) + 10,
        description: book.aciklama,
        sellerId: book.satici_id,
        sellerName: book.satici_isim
      };
    }
    return null;
  } catch (error) {
    console.warn('⚠️ Kitap detayı alınamadı:', error.message);
    return null;
  }
}

// ── Yeni Kitap Ekle ──
async function addBook(bookData) {
  try {
    const response = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    return await response.json();
  } catch (error) {
    console.error('Kitap ekleme hatası:', error.message);
    return { success: false, message: 'Bağlantı hatası.' };
  }
}

// ── Kullanıcı Kaydı ──
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error('Kayıt hatası:', error.message);
    return { success: false, message: 'Bağlantı hatası.' };
  }
}

// ── Kullanıcı Girişi ──
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await response.json();
  } catch (error) {
    console.error('Giriş hatası:', error.message);
    return { success: false, message: 'Bağlantı hatası.' };
  }
}

// ── Sipariş Oluştur ──
async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    console.error('Sipariş hatası:', error.message);
    return { success: false, message: 'Bağlantı hatası.' };
  }
}

// ── Siparişleri Getir ──
async function getOrders(userId) {
  try {
    const response = await fetch(`${API_BASE}/orders/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Sipariş listeleme hatası:', error.message);
    return { success: false, data: [] };
  }
}

// ── Filtre Fonksiyonu ──
function filterBooks(books, {query = '', category = ''} = {}) {
  return books.filter(b => {
    const matchQuery = query === '' || 
      b.title.toLowerCase().includes(query.toLowerCase()) || 
      b.author.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === '' || b.category === category;
    return matchQuery && matchCat;
  });
}

// ── Fallback Mock Veri ──
function getMockBooks() {
  const categories = ['Edebiyat', 'Kırtasiye', 'Okula Yardımcı', 'Sınav', 'Çocuk', 'Tavsiye'];
  const titles = [
    'Suç ve Ceza', 'Küçük Prens', 'Simyacı', 'Sefiller', 'Dönüşüm',
    'Tutunamayanlar', 'İnce Memed', 'Kürk Mantolu Madonna', 'Çalıkuşu', 'Huzur',
    'Beyaz Diş', 'Martin Eden', 'Fareler ve İnsanlar', 'Körlük', 'Yüzüklerin Efendisi',
    'Hobbit', 'Dune', 'Fahrenheit 451', '1984', 'Cesur Yeni Dünya',
    'Savaş ve Barış', 'Anna Karenina', 'Yeraltından Notlar', 'Karamazov Kardeşler'
  ];
  const authors = [
    'Dostoyevski', 'Saint-Exupéry', 'Paulo Coelho', 'Victor Hugo', 'Franz Kafka',
    'Oğuz Atay', 'Yaşar Kemal', 'Sabahattin Ali', 'Reşat Nuri Güntekin', 'Ahmet Hamdi Tanpınar',
    'Jack London', 'Jack London', 'John Steinbeck', 'José Saramago', 'J.R.R. Tolkien',
    'J.R.R. Tolkien', 'Frank Herbert', 'Ray Bradbury', 'George Orwell', 'Aldous Huxley',
    'Tolstoy', 'Tolstoy', 'Dostoyevski', 'Dostoyevski'
  ];
  const books = [];
  for (let i = 0; i < 24; i++) {
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 10;
    books.push({
      id: i + 1,
      title: titles[i],
      author: authors[i],
      category: categories[i % categories.length],
      price: (Math.random() * 80 + 20).toFixed(2) + ' TL',
      image: 'assets/images/book-placeholder.png',
      rating: parseFloat(rating),
      reviewCount: reviewCount,
      isNew: i < 4,
      isBestSeller: i >= 4 && i < 8
    });
  }
  return Promise.resolve(books);
}

// Global erişim
window.getBooks = getBooks;
window.getBookById = getBookById;
window.addBook = addBook;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.createOrder = createOrder;
window.getOrders = getOrders;
window.getMockBooks = getMockBooks;
window.filterBooks = filterBooks;
