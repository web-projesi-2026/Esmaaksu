const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kitap_sitesi',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bağlantıyı test et
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL veritabanına başarıyla bağlanıldı.');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL bağlantı hatası:', err.message);
  });

module.exports = pool;
