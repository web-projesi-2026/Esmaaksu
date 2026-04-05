const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET    /api/books      → Tüm kitapları listele
router.get('/', bookController.getAllBooks);

// GET    /api/books/:id  → Tek kitap getir
router.get('/:id', bookController.getBookById);

// POST   /api/books      → Yeni kitap ekle
router.post('/', bookController.createBook);

// PUT    /api/books/:id  → Kitap güncelle
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id  → Kitap sil
router.delete('/:id', bookController.deleteBook);

module.exports = router;
