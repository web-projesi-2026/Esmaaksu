// Mock API utilities — no ES modules for direct script loading

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

function filterBooks(books, {query = '', category = ''} = {}) {
  return books.filter(b => {
    const matchQuery = query === '' || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === '' || b.category === category;
    return matchQuery && matchCat;
  });
}

// Make globally accessible
window.getMockBooks = getMockBooks;
window.filterBooks = filterBooks;
