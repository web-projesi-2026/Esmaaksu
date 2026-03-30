-- =============================================
-- RAFARASI — Kitap Sitesi Veritabanı Şeması
-- =============================================

CREATE DATABASE IF NOT EXISTS kitap_sitesi
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE kitap_sitesi;

-- ── Kullanıcılar Tablosu ──
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isim VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  sifre VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'satici', 'alici') NOT NULL DEFAULT 'alici',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Kitaplar Tablosu ──
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  baslik VARCHAR(255) NOT NULL,
  yazar VARCHAR(150) NOT NULL,
  fiyat DECIMAL(10, 2) NOT NULL,
  resim_url VARCHAR(500) DEFAULT NULL,
  kategori VARCHAR(100) DEFAULT 'Edebiyat',
  aciklama TEXT DEFAULT NULL,
  satici_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (satici_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Siparişler Tablosu ──
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alici_id INT NOT NULL,
  kitap_id INT NOT NULL,
  toplam_tutar DECIMAL(10, 2) NOT NULL,
  durum ENUM('beklemede', 'onaylandi', 'kargoda', 'tamamlandi') NOT NULL DEFAULT 'beklemede',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alici_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (kitap_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- ÖRNEK VERİLER
-- =============================================

-- Kullanıcılar (şifreler bcrypt ile hashlenecek, burada placeholder)
INSERT INTO users (isim, email, sifre, rol) VALUES
('Admin', 'admin@rafarasi.com', '$2a$10$xJ8Kq2kZ3sG5hF7wR4vXeOQzVnMpLkJhGfDsAqWe3rTyUiOpLmNb', 'admin'),
('Ahmet Satıcı', 'ahmet@rafarasi.com', '$2a$10$xJ8Kq2kZ3sG5hF7wR4vXeOQzVnMpLkJhGfDsAqWe3rTyUiOpLmNb', 'satici'),
('Elif Satıcı', 'elif@rafarasi.com', '$2a$10$xJ8Kq2kZ3sG5hF7wR4vXeOQzVnMpLkJhGfDsAqWe3rTyUiOpLmNb', 'satici'),
('Mehmet Alıcı', 'mehmet@rafarasi.com', '$2a$10$xJ8Kq2kZ3sG5hF7wR4vXeOQzVnMpLkJhGfDsAqWe3rTyUiOpLmNb', 'alici');

-- Kitaplar
INSERT INTO books (baslik, yazar, fiyat, kategori, satici_id) VALUES
('Suç ve Ceza', 'Dostoyevski', 45.00, 'Edebiyat', 2),
('Küçük Prens', 'Saint-Exupéry', 30.00, 'Edebiyat', 2),
('Simyacı', 'Paulo Coelho', 35.50, 'Edebiyat', 2),
('Sefiller', 'Victor Hugo', 55.00, 'Edebiyat', 2),
('Dönüşüm', 'Franz Kafka', 28.00, 'Edebiyat', 3),
('Tutunamayanlar', 'Oğuz Atay', 62.00, 'Edebiyat', 3),
('İnce Memed', 'Yaşar Kemal', 48.50, 'Edebiyat', 2),
('Kürk Mantolu Madonna', 'Sabahattin Ali', 25.00, 'Edebiyat', 2),
('Çalıkuşu', 'Reşat Nuri Güntekin', 38.00, 'Edebiyat', 3),
('Huzur', 'Ahmet Hamdi Tanpınar', 42.00, 'Edebiyat', 3),
('Beyaz Diş', 'Jack London', 33.00, 'Çocuk Kitapları', 2),
('Martin Eden', 'Jack London', 40.00, 'Edebiyat', 2),
('Fareler ve İnsanlar', 'John Steinbeck', 29.50, 'Edebiyat', 3),
('Körlük', 'José Saramago', 47.00, 'Edebiyat', 3),
('Yüzüklerin Efendisi', 'J.R.R. Tolkien', 85.00, 'Edebiyat', 2),
('Hobbit', 'J.R.R. Tolkien', 52.00, 'Çocuk Kitapları', 2),
('Dune', 'Frank Herbert', 58.00, 'Edebiyat', 3),
('Fahrenheit 451', 'Ray Bradbury', 32.00, 'Edebiyat', 3),
('1984', 'George Orwell', 36.00, 'Edebiyat', 2),
('Cesur Yeni Dünya', 'Aldous Huxley', 34.50, 'Edebiyat', 2),
('Savaş ve Barış', 'Tolstoy', 72.00, 'Edebiyat', 3),
('Anna Karenina', 'Tolstoy', 65.00, 'Edebiyat', 3),
('Yeraltından Notlar', 'Dostoyevski', 27.00, 'Edebiyat', 2),
('Karamazov Kardeşler', 'Dostoyevski', 68.00, 'Edebiyat', 2);

-- Örnek Siparişler
INSERT INTO orders (alici_id, kitap_id, toplam_tutar, durum) VALUES
(4, 1, 45.00, 'tamamlandi'),
(4, 3, 35.50, 'kargoda'),
(4, 7, 48.50, 'beklemede');
