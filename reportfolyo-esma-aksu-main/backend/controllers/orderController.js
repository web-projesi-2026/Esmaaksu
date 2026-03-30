const db = require('../config/database');

// ── Yeni Sipariş Oluştur ──
exports.createOrder = async (req, res) => {
  try {
    const { alici_id, kitap_id, toplam_tutar } = req.body;

    if (!alici_id || !kitap_id || !toplam_tutar) {
      return res.status(400).json({
        success: false,
        message: 'Alıcı ID, kitap ID ve toplam tutar zorunludur.'
      });
    }

    const [result] = await db.query(
      'INSERT INTO orders (alici_id, kitap_id, toplam_tutar, durum) VALUES (?, ?, ?, ?)',
      [alici_id, kitap_id, toplam_tutar, 'beklemede']
    );

    res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu.',
      data: { id: result.insertId, durum: 'beklemede' }
    });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error.message);
    res.status(500).json({ success: false, message: 'Sipariş oluşturulurken hata oluştu.' });
  }
};

// ── Kullanıcının Siparişlerini Getir ──
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `SELECT o.*, b.baslik, b.yazar, b.fiyat, b.resim_url 
       FROM orders o 
       LEFT JOIN books b ON o.kitap_id = b.id 
       WHERE o.alici_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Sipariş listeleme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Siparişler yüklenirken hata oluştu.' });
  }
};

// ── Tüm Siparişleri Getir (Admin) ──
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, b.baslik, b.yazar, u.isim AS alici_isim 
       FROM orders o 
       LEFT JOIN books b ON o.kitap_id = b.id 
       LEFT JOIN users u ON o.alici_id = u.id 
       ORDER BY o.created_at DESC`
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Tüm siparişler hatası:', error.message);
    res.status(500).json({ success: false, message: 'Siparişler yüklenirken hata oluştu.' });
  }
};

// ── Sipariş Durumunu Güncelle ──
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { durum } = req.body;

    const validStatuses = ['beklemede', 'onaylandi', 'kargoda', 'tamamlandi'];
    if (!validStatuses.includes(durum)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz sipariş durumu.'
      });
    }

    const [result] = await db.query(
      'UPDATE orders SET durum = ? WHERE id = ?',
      [durum, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    }

    res.json({ success: true, message: 'Sipariş durumu güncellendi.' });
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Sipariş güncellenirken hata oluştu.' });
  }
};
