const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Kullanıcı Kaydı (Kayıt ol - Buyer/Seller için vs)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Parola hashlenebilir, ama basit örnek için düz tutalım:
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'E-posta zaten kullanımda, lütfen giriş yapın veya farklı bir e-posta deneyin.' });

    const user = await User.create({ name, email, password, role: role || 'buyer' });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Giriş Yapma (Basit Login mantığı)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;