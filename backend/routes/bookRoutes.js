const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const path = require('path');

// Multer (Dosya yükleme konfigürasyonu)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Kitapları & Aramayı Getir
router.get('/', async (req, res) => {
  try {
    const { query, category } = req.query;
    let sql = 'SELECT * FROM books';
    let params = [];

    if (query || category) {
      sql += ' WHERE';
      if (query) {
        sql += ' (title LIKE ? OR author LIKE ?)';
        params.push(`%${query}%`, `%${query}%`);
      }
      if (category) {
        if (query) sql += ' AND';
        sql += ' category = ?';
        params.push(category);
      }
    }

    const [books] = await pool.query(sql, params);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Satıcının kitaplarını getir
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books WHERE seller_id = ?', [req.params.sellerId]);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitap Ekle
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { title, author, category, price, description, seller, imageUrl, pageCount } = req.body;
    let imagePath = imageUrl || 'assets/images/book-placeholder.png';

    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const [result] = await pool.query(
      'INSERT INTO books (title, author, page_count, category, price, description, seller_id, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, pageCount || 0, category, price, description, seller, imagePath]
    );

    res.status(201).json({ id: result.insertId, title, author });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kitap Güncelle
router.put('/:id', async (req, res) => {
  try {
    const { title, author, category, price, description, imageUrl, pageCount } = req.body;
    await pool.query(
      'UPDATE books SET title = ?, author = ?, page_count = ?, category = ?, price = ?, description = ?, image = ? WHERE id = ?',
      [title, author, pageCount || 0, category, price, description || '', imageUrl || 'assets/images/book-placeholder.png', req.params.id]
    );
    res.json({ message: 'Kitap başarıyla güncellendi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitap Sil
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kitap başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// YORUMLAR (REVIEWS)
// ==============================

// Bir kitabın yorumlarını getir
router.get('/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.query(
      'SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitaba yorum yap
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user_id, user_name, rating, comment } = req.body;
    const book_id = req.params.id;

    if (!comment || !rating) {
      return res.status(400).json({ message: 'Lütfen yorum ve puan giriniz.' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (book_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [book_id, user_id, user_name, rating, comment]
    );

    res.status(201).json({ id: result.insertId, message: 'Yorum eklendi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;