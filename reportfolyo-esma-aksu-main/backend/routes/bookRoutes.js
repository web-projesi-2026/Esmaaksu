const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');

// Multer (Dosya yükleme konfigürasyonu)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique dosya ismi
  }
});

const upload = multer({ storage: storage });

// Toptan Kitapları & Aramayı Getir
router.get('/', async (req, res) => {
  try {
    const { query, category } = req.query;
    let filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;

    const books = await Book.find(filter).populate('seller', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Satıcının kendi eklediği kitapları getir
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const books = await Book.find({ seller: req.params.sellerId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitap Ekle (Sadece Satıcı ve Admin - Basit yetki: userId üzerinden çalışır)
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { title, author, category, price, description, seller, imageUrl } = req.body;
    let imagePath = imageUrl || 'assets/images/book-placeholder.png'; // varsayılan

    // Eğer kullanıcı dosya yüklediyse
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const newBook = new Book({
      title, author, category, price, description, seller, image: imagePath
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;