const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config', 'config.env') });

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Statik Dosya Sunumu (Frontend) ──
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Route'ları ──
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// ── Ana Sayfa (Frontend index.html) ──
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Sayfa bulunamadı.' });
});

// ── Hata Handler ──
app.use((err, req, res, next) => {
  console.error('❌ Sunucu hatası:', err.message);
  res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
});

// ── Sunucuyu Başlat ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RafArası sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

module.exports = app;
