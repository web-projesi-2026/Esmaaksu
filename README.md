# Esmaaksu Projesi

Bu proje, alıcı (buyer), satıcı (seller) ve yönetici (admin) rollerine sahip tam yığın (full-stack) bir web uygulamasıdır..

## Proje Yapısı

- **frontend/**: Kullanıcı arayüzü dosyalarını içerir (HTML, CSS, JavaScript).
  - `admin.html`, `buyer.html`, `seller.html`: Farklı kullanıcı rolleri için arayüzler.
  - `assets/`: Stil ve script dosyaları.

- **backend/**: Sunucu tarafı kodlarını içerir (Node.js/Express).
  - `controllers/`: İş mantığı (auth, book, order, user).
  - `models/`: Veritabanı modelleri.
  - `routes/`: API uç noktaları.
  - `middleware/`: Yetkilendirme ve dosya yükleme gibi ara katman yazılımları.

## Kurulum ve Çalıştırma

### Backend

1. `reportfolyo-esma-aksu-main` dizinindeki paketleri yükleyin:
   ```bash
   npm install
   ```
2. Backend sunucusunu başlatın:
   ```bash
   node backend/server.js
   ```

### Frontend

Frontend dosyalarını çalıştırmak için bir yerel sunucu (örneğin VS Code Live Server eklentisi) kullanabilirsiniz veya `frontend/index.html` dosyasını doğrudan tarayıcınızda açabilirsiniz.

site linki: https://web-projesi-2026.github.io/Esmaaksu/
