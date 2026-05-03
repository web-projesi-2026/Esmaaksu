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
      return res.json({ _id: admins[0].id, name: admins[0].name, email: admins[0].email, role: 'admin' });
    }

    // Sonra sellers tablosuna bak
    const [sellers] = await pool.query('SELECT * FROM sellers WHERE email = ? AND password = ?', [email, password]);
    if (sellers.length > 0) {
      return res.json({ _id: sellers[0].id, name: sellers[0].name, email: sellers[0].email, role: 'seller' });
    }

    // Son olarak users (alıcılar) tablosuna bak
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length > 0) {
      return res.json({ _id: users[0].id, name: users[0].name, email: users[0].email, role: 'buyer' });
    }

    // Hiçbirinde bulunamadı
    res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;