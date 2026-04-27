const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String, default: 'assets/images/book-placeholder.png' }, // URL veya dosya yolu
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Hangi satıcının eklediğini bulmak için
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isNewBook: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);