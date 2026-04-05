const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register → Kayıt ol
router.post('/register', authController.register);

// POST /api/auth/login → Giriş yap
router.post('/login', authController.login);

// GET  /api/auth/profile → Profil bilgisi (JWT gerekli)
router.get('/profile', auth, authController.getProfile);

module.exports = router;
