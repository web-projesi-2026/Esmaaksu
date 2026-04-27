// Veritabanı (MongoDB) Bağlantılı API ve Yedek Mock Veriler

// Arka uç sunucu URL'si (3000 portunda çalışıyor)
const API_URL = 'http://localhost:3000/api';

// Veritabanı çalışmadığında kullanılacak yedek 8 adet mock kitap
const MOCK_BOOKS = [
  {
    id: 1,
    title: 'Milk and Honey',
    author: 'Rupi Kaur',
    category: 'Edebiyat',
    price: '120.00',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewCount: 124,
    isBestSeller: true
  },
  {
    id: 2,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    category: 'İş Dünyası',
    price: '95.00',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewCount: 312,
    isBestSeller: false
  },
  {
    id: 3,
    title: 'Kürk Mantolu Madonna',
    author: 'Sabahattin Ali',
    category: 'Edebiyat',
    price: '110.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:11461947/wh:true/wi:400',
    rating: 4.7,
    reviewCount: 89,
    isNew: true
  },
  {
    id: 4,
    title: 'Şeker Portakalı',
    author: 'José Mauro de Vasconcelos',
    category: 'Edebiyat',
    price: '240.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:2828620/wh:true/wi:400',
    rating: 4.5,
    reviewCount: 45
  },
  {
    id: 5,
    title: '1984',
    author: 'George Orwell',
    category: 'Edebiyat',
    price: '175.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:11202570/wh:true/wi:400',
    rating: 5.0,
    reviewCount: 421,
    isBestSeller: true
  },
  {
    id: 6,
    title: 'İçimizdeki Şeytan',
    author: 'Sabahattin Ali',
    category: 'Edebiyat',
    price: '90.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:11342207/wh:true/wi:400',
    rating: 4.6,
    reviewCount: 220
  },
  {
    id: 7,
    title: 'Simyacı',
    author: 'Paulo Coelho',
    category: 'Edebiyat',
    price: '185.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:11598462/wh:true/wi:400',
    rating: 4.7,
    reviewCount: 165
  },
  {
    id: 8,
    title: 'Küçük Prens',
    author: 'Antoine de Saint-Exupéry',
    category: 'Çocuk',
    price: '160.00',
    image: 'https://img.kitapyurdu.com/v1/getImage/fn:11494793/wh:true/wi:400',
    rating: 4.3,
    reviewCount: 32,
    isNew: true
  }
];

// MOCK_BOOKS filtreleme yardımcısı
function getFilteredMockBooks(query, category) {
  let filtered = MOCK_BOOKS;
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  if (category) {
    filtered = filtered.filter(b => b.category === category);
  }
  return filtered;
}

// Sunucudan Kitapları Çek (Arama İşlevi İçerir)
async function getBooks(query = '', category = '') {
  try {
    let url = `${API_URL}/books`;
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Ağ hatası oluştu');
    const data = await response.json();
    return data && data.length > 0 ? data : getFilteredMockBooks(query, category); // API çalışıyorsa ve boş değilse veriyi döndür, yoksa mock verileri ver
  } catch (error) {
    console.warn('Kitapları getirirken hata oluştu (Veritabanı kapalı olabilir), mock data kullanılıyor:', error);
    return getFilteredMockBooks(query, category);
  }
}

// İstenilen Arama Filtelemesi Zaten "getBooks" Tarafından API İçerisinde Yapılacak,
// Sadece uyumluluk açısından arayüz (api.js) kodlarını sadeleştirdik:
window.getMockBooks = getBooks;
window.filterBooks = (books, {query = '', category = ''} = {}) => {
  return books.filter(b => {
    const matchQuery = query === '' || (b.title || '').toLowerCase().includes(query.toLowerCase()) || (b.author || '').toLowerCase().includes(query.toLowerCase());
    const matchCat = category === '' || b.category === category;
    return matchQuery && matchCat;
  });
};
