const db = require('../config/database');

// ── Tüm Kitapları Listele ──
exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.isim AS satici_isim 
       FROM books b 
       LEFT JOIN users u ON b.satici_id = u.id 
       ORDER BY b.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Kitap listeleme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kitaplar yüklenirken hata oluştu.' });
  }
};

// ── Tek Kitap Getir ──
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT b.*, u.isim AS satici_isim 
       FROM books b 
       LEFT JOIN users u ON b.satici_id = u.id 
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kitap bulunamadı.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Kitap detay hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kitap bilgisi alınırken hata oluştu.' });
  }
};

// ── Yeni Kitap Ekle ──
exports.createBook = async (req, res) => {
  try {
    const { baslik, yazar, fiyat, resim_url, kategori, aciklama, satici_id } = req.body;

    // Zorunlu alan kontrolü
    if (!baslik || !yazar || !fiyat || !satici_id) {
      return res.status(400).json({
        success: false,
        message: 'Başlık, yazar, fiyat ve satıcı ID zorunludur.'
      });
    }

    const [result] = await db.query(
      `INSERT INTO books (baslik, yazar, fiyat, resim_url, kategori, aciklama, satici_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [baslik, yazar, fiyat, resim_url || null, kategori || 'Edebiyat', aciklama || null, satici_id]
    );

    res.status(201).json({
      success: true,
      message: 'Kitap başarıyla eklendi.',
      data: { id: result.insertId, baslik, yazar, fiyat }
    });
  } catch (error) {
    console.error('Kitap ekleme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kitap eklenirken hata oluştu.' });
  }
};

// ── Kitap Güncelle ──
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { baslik, yazar, fiyat, resim_url, kategori, aciklama } = req.body;

    const [result] = await db.query(
      `UPDATE books SET baslik = ?, yazar = ?, fiyat = ?, resim_url = ?, kategori = ?, aciklama = ? 
       WHERE id = ?`,
      [baslik, yazar, fiyat, resim_url, kategori, aciklama, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kitap bulunamadı.' });
    }

    res.json({ success: true, message: 'Kitap başarıyla güncellendi.' });
  } catch (error) {
    console.error('Kitap güncelleme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kitap güncellenirken hata oluştu.' });
  }
};

// ── Kitap Sil ──
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kitap bulunamadı.' });
    }

    res.json({ success: true, message: 'Kitap başarıyla silindi.' });
  } catch (error) {
    console.error('Kitap silme hatası:', error.message);
    res.status(500).json({ success: false, message: 'Kitap silinirken hata oluştu.' });
  }
};
