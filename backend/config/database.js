const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

// MySQL Bağlantı Havuzu (Pool) Oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'esmaaksu_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise desteği ekleyelim
const promisePool = pool.promise();

// Bağlantı Testi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL Bağlantı Hatası:', err.message);
    console.log('Lütfen XAMPP/WAMP üzerinden MySQL servisinin açık olduğundan emin olun.');
  } else {
    console.log('MySQL (phpMyAdmin) Bağlantısı Başarılı!');
    connection.release();
  }
});

module.exports = promisePool;