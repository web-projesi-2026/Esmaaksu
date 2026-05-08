const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// ==========================================
// ALICI (users tablosu) İşlemleri
// ==========================================

// Alıcı Kayıt
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Rolüne göre hangi tabloya kayıt olacağını belirle
    let table = 'users'; // varsayılan: alıcı
    if (role === 'seller') table = 'sellers';

    // E-posta kontrolü
    const [existing] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'E-posta zaten kullanımda.' });
    }

    // Kayıt
    const [result] = await pool.query(
      `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`,
      [name, email, password]
    );

    res.status(201).json({ id: result.insertId, name, email, role: role || 'buyer' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Giriş Yapma (3 tablodan da kontrol eder)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Önce admins tablosuna bak
    const [admins] = await pool.query('SELECT * FROM admins WHERE email = ? AND password = ?', [email, password]);
    if (admins.length > 0) {
      return res.json({ id: admins[0].id, name: admins[0].name, email: admins[0].email, role: 'admin' });
    }

    // Sonra sellers tablosuna bak
    const [sellers] = await pool.query('SELECT * FROM sellers WHERE email = ? AND password = ?', [email, password]);
    if (sellers.length > 0) {
      return res.json({ id: sellers[0].id, name: sellers[0].name, email: sellers[0].email, role: 'seller' });
    }

    // Son olarak users (alıcılar) tablosuna bak
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length > 0) {
      return res.json({ id: users[0].id, name: users[0].name, email: users[0].email, role: 'buyer' });
    }

    // Hiçbirinde bulunamadı
    res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kart Kaydetme
router.post('/saved-cards', async (req, res) => {
  try {
    const { userId, cardHolder, cardNumber, expiryDate } = req.body;
    
    // Basit bir güvenlik: Kart numarasının son 4 hanesini açık tutup kalanını maskeleyelim (Opsiyonel ama önerilir)
    // Ancak kullanıcı tam tutmamızı istediği için şimdilik tam tutuyoruz.
    
    await pool.query(
      'INSERT INTO saved_cards (user_id, card_holder, card_number, expiry_date) VALUES (?, ?, ?, ?)',
      [userId, cardHolder, cardNumber, expiryDate]
    );

    res.status(201).json({ message: 'Kart başarıyla kaydedildi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kayıtlı Kartları Getirme
router.get('/saved-cards/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [cards] = await pool.query('SELECT * FROM saved_cards WHERE user_id = ?', [userId]);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adresleri Getirme
router.get('/addresses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [addresses] = await pool.query('SELECT * FROM user_addresses WHERE user_id = ?', [userId]);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adres Ekleme
router.post('/addresses', async (req, res) => {
  try {
    const { userId, title, fullName, phone, city, district, fullAddress } = req.body;
    await pool.query(
      'INSERT INTO user_addresses (user_id, title, full_name, phone, city, district, full_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, fullName, phone, city, district, fullAddress]
    );
    res.status(201).json({ message: 'Adres başarıyla eklendi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// SEPET VE FAVORİ Senkronizasyon İşlemleri
// ==========================================

// Kullanıcı verilerini (sepet ve favoriler) getir
router.get('/sync-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Favorileri getir
    const [favorites] = await pool.query('SELECT book_id FROM favorite_items WHERE user_id = ?', [userId]);
    const favList = favorites.map(f => f.book_id);

    // Sepeti getir (Kitap detaylarıyla birlikte)
    const [cart] = await pool.query(`
      SELECT ci.book_id as id, ci.quantity, b.title, b.author, b.price, b.image 
      FROM cart_items ci
      JOIN books b ON ci.book_id = b.id
      WHERE ci.user_id = ?
    `, [userId]);

    res.json({ favorites: favList, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sepeti senkronize et (Toplu güncelleme)
router.post('/sync-cart', async (req, res) => {
  try {
    const { userId, cart } = req.body;
    
    // Önce eski sepeti temizle
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // Yeni sepeti ekle
    if (cart && cart.length > 0) {
      const values = cart.map(item => [userId, item.id, item.quantity]);
      await pool.query('INSERT INTO cart_items (user_id, book_id, quantity) VALUES ?', [values]);
    }

    res.json({ message: 'Sepet senkronize edildi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Favorileri senkronize et (Toplu güncelleme)
router.post('/sync-favorites', async (req, res) => {
  try {
    const { userId, favorites } = req.body;

    // Önce eski favorileri temizle
    await pool.query('DELETE FROM favorite_items WHERE user_id = ?', [userId]);

    // Yeni favorileri ekle
    if (favorites && favorites.length > 0) {
      const values = favorites.map(bookId => [userId, bookId]);
      await pool.query('INSERT INTO favorite_items (user_id, book_id) VALUES ?', [values]);
    }

    res.json({ message: 'Favoriler senkronize edildi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;