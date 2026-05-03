const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors'); // Need to install cors implicitly, but usually frontend code doesn't need it if same host
const fs = require('fs');

// Environment variables
dotenv.config();

// MySQL bağlantı kontrolü (zaten database.js içinde yapılıyor ama burada da log basabiliriz)
console.log('Sunucu başlatılıyor, MySQL veri tabanı hazırlanıyor...');

const app = express();
const port = process.env.PORT || 3000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sadece form istekleri değil aynı zamanda frontend ile iletişimi açık tutmak için varsayılan CORS'u aktif edelim.
app.use(cors());

// Frontend static files
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Fotoğraf yüklemeleri için

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Yönlendiricileri Dahil Et
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

// API Rotaları
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nHata: ${port} portu şu anda başka bir uygulama tarafından kullanılıyor.`);
    console.error("Lütfen terminaldeki eski 'npm run dev' veya 'node' işlemlerini durdurun.\n");
  } else {
    console.error("Sunucu başlatma hatası:", err);
  }
});