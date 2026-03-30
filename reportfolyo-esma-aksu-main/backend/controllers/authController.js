const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── Kayıt Ol ──
exports.register = async (req, res) => {
  try {
    const { isim, email, sifre, rol } = req.body;

    // Zorunlu alan kontrolü
    if (!isim || !email || !sifre) {
      return res.status(400).json({
        success: false,
        message: 'İsim, email ve şifre zorunludur.'
      });
    }

    // Email daha önce kullanılmış mı?
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor.'
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Kullanıcıyı oluştur
    const [result] = await db.query(
      'INSERT INTO users (isim, email, sifre, rol) VALUES (?, ?, ?, ?)',
      [isim, email, hashedPassword, rol || 'alici']
    );

    // JWT token oluştur
    const token = jwt.sign(
      { id: result.insertId, email, rol: rol || 'alici' },
      process.env.JWT_SECRET || 'rafarasi_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı!',
      data: {
        id: result.insertId,
        isim,
        email,
        rol: rol || 'alici',
        token
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kayıt sırasında hata oluştu.' });
  }
};

// ── Giriş Yap ──
exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre zorunludur.'
      });
    }

    // Kullanıcıyı bul
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre.'
      });
    }

    const user = rows[0];

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre.'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'rafarasi_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Giriş başarılı!',
      data: {
        id: user.id,
        isim: user.isim,
        email: user.email,
        rol: user.rol,
        token
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error.message);
    res.status(500).json({ success: false, message: 'Giriş sırasında hata oluştu.' });
  }
};

// ── Profil Bilgisi ──
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, isim, email, rol, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Profil hatası:', error.message);
    res.status(500).json({ success: false, message: 'Profil bilgisi alınırken hata oluştu.' });
  }
};
