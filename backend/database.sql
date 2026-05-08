-- RafArası Veri Tabanı SQL Dosyası
-- Bu dosyayı phpMyAdmin üzerinden içeri aktarabilirsiniz.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Veri Tabanı Oluşturma
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `esmaaksu_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `esmaaksu_db`;

-- --------------------------------------------------------
-- Tablo: users (Alıcılar)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tablo: sellers (Satıcılar)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sellers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `shop_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tablo: admins (Yöneticiler)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tablo: books (Kitaplar - Satıcılara bağlı)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT 'assets/images/book-placeholder.png',
  `seller_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Örnek Veriler
-- --------------------------------------------------------

-- Alıcılar
INSERT INTO `users` (`name`, `email`, `password`, `phone`) VALUES
('Ali Yılmaz', 'alici@rafarasi.com', '123', '05551234567'),
('Mehmet Demir', 'mehmet@rafarasi.com', '123', '05559876543');

-- Satıcılar
INSERT INTO `sellers` (`name`, `email`, `password`, `shop_name`, `phone`) VALUES
('Esma Aksu', 'satici@rafarasi.com', '123', 'Esma Kitapevi', '05551112233'),
('Ayşe Kara', 'ayse@rafarasi.com', '123', 'Kara Yayınları', '05554445566');

-- Yöneticiler
INSERT INTO `admins` (`name`, `email`, `password`) VALUES
('Admin User', 'admin@rafarasi.com', 'admin');

-- Kitaplar (seller_id=1 -> Esma Aksu)
INSERT INTO `books` (`title`, `author`, `category`, `price`, `description`, `seller_id`) VALUES
('Suç ve Ceza', 'Dostoyevski', 'Edebiyat', 45.90, 'Dünya klasiği başyapıt.', 1),
('Küçük Prens', 'Antoine de Saint-Exupéry', 'Çocuk', 32.50, 'Her yaşa hitap eden bir masal.', 1),
('Sefiller', 'Victor Hugo', 'Edebiyat', 55.00, 'Unutulmaz bir hikaye.', 1);

COMMIT;
