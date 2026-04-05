const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST   /api/orders           → Yeni sipariş oluştur
router.post('/', orderController.createOrder);

// GET    /api/orders/all       → Tüm siparişler (admin)
router.get('/all', orderController.getAllOrders);

// GET    /api/orders/:userId   → Kullanıcının siparişleri
router.get('/:userId', orderController.getOrdersByUser);

// PUT    /api/orders/:id       → Sipariş durumu güncelle
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
