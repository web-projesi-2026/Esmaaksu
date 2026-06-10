# RafArası - E-Ticaret Kitap Platformu

RafArası, okuyucuları, kitap satıcılarını ve yöneticileri tek bir platformda buluşturan tam kapsamlı (full-stack) bir e-ticaret web uygulamasıdır. Kullanıcılar kitap arayabilir, favorilere ekleyebilir, sepetlerine ürün ekleyerek satın alma işlemlerini gerçekleştirebilirler. Satıcılar kendi kitaplarını listeleyebilir, yöneticiler ise tüm platformu yönetebilir.

## Kullanılan Teknolojiler

### Frontend (Ön Yüz)
- **HTML5 & CSS3:** Modern ve responsive (duyarlı) web tasarımı.
- **JavaScript (Vanilla JS):** Dinamik DOM manipülasyonları, Fetch API ile asenkron veri çekme işlemleri.
- **Bootstrap 5:** Hızlı ve esnek grid yapısı, hazır UI bileşenleri (navigasyon, kartlar, formlar).
- **Bootstrap Icons:** Modern ve hafif vektörel ikonlar.
- **Local Storage:** Kullanıcı oturumu, sepet ve favori kitapların tarayıcı tarafında yönetilmesi.

### Backend (Arka Yüz)
- **Node.js & Express.js:** Hızlı, ölçeklenebilir RESTful API ve sunucu yönetimi.
- **MySQL:** İlişkisel veritabanı yönetimi (Kullanıcılar, Kitaplar, Siparişler).
- **Multer:** Kullanıcı ve kitap görsel yükleme işlemleri.
- **CORS & Body-Parser:** Güvenli sunucu iletişimi ve veri işleme.

## Proje Yapısı

- **Kök Dizin (.html dosyaları):** `index.html`, `category.html`, `favorites.html`, `login.html` vb. gibi tüm arayüz sayfaları doğrudan ana dizindedir.
- **assets/**: CSS (`global.css`, `layout.css`), JavaScript (`api.js`, `nav.js`) ve görsellerin bulunduğu klasör.
- **backend/**: Sunucu tarafı kodlarını içerir (Node.js/Express).
  - `controllers/`: İş mantığı (auth, book, order, user).
  - `models/`: Veritabanı modelleri.
  - `routes/`: API uç noktaları.
  - `uploads/`: Yüklenen resimlerin tutulduğu dizin.

## Kurulum ve Çalıştırma

### 1. Gereksinimleri Yükleme
Projenin ana dizininde terminali açıp gerekli paketleri yükleyin:
```bash
npm install
```

### 2. Veritabanı Kurulumu
MySQL üzerinde `esmaaksu_db` adında bir veritabanı oluşturun ve `backend/database.sql` içindeki tabloları bu veritabanına aktarın (import edin). Gerekirse `backend/config/database.js` dosyasındaki şifre bilgilerinizi kendi MySQL ayarlarınıza göre güncelleyin.

### 3. Uygulamayı Başlatma
Projeyi geliştirme modunda çalıştırmak için:
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde ayağa kalkacaktır.

### 4. Canlı Site Linki
Projenin GitHub Pages üzerindeki statik önizlemesi (Backend API hariç):  
👉 https://web-projesi-2026.github.io/Esmaaksu/

---
*Not: Bu proje web programlama dersi kapsamında dinamik veri (AJAX/Fetch) çekme, sepet işlemleri ve modern tasarım gereksinimlerine uygun olarak geliştirilmiştir.*
