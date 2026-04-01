#  Kitap Satış Sitesi

##  Proje Açıklaması
Bu proje, HTML, CSS ve JavaScript kullanılarak geliştirilen basit bir kitap satış web sitesidir. 
Projenin amacı, kullanıcıların kitapları görüntüleyebileceği ve temel etkileşimlerde bulunabileceği bir arayüz oluşturmaktır.


---

##  Proje Amacı
HTML ile temel sayfa yapısını oluşturmak
CSS ile modern ve responsive tasarım yapmak
JavaScript ile dinamik içerik ve etkileşim sağlamak
DOM manipülasyonu ve event kullanımı pratiği yapmak

---

##  Kullanılan Teknolojiler
HTML5
CSS3
JavaScript (Vanilla JS)

---

##  Planlanan Özellikler
Ana sayfada öne çıkan kitaplar
Kitap listeleme bölümü
Kitap detay görüntüleme
Sepete ekleme butonu (ön yüz simülasyonu)
Arama özelliği
Kategoriye göre filtreleme
Responsive tasarım

---

##  Planlanan Dosya Yapısı
```
KitapSitesi
├─ backend
│  ├─ config
│  │  ├─ config.env
│  │  └─ database.js
│  ├─ controllers
│  │  ├─ authController.js
│  │  ├─ bookController.js
│  │  ├─ orderController.js
│  │  └─ userController.js
│  ├─ middleware
│  │  ├─ auth.js
│  │  ├─ roleCheck.js
│  │  └─ upload.js
│  ├─ models
│  │  ├─ Book.js
│  │  ├─ index.js
│  │  ├─ Order.js
│  │  └─ User.js
│  ├─ routes
│  │  ├─ authRoutes.js
│  │  ├─ bookRoutes.js
│  │  ├─ orderRoutes.js
│  │  └─ userRoutes.js
│  ├─ server.js
│  └─ uploads
├─ frontend
│  ├─ admin.html
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ components.css
│  │  │  ├─ global.css
│  │  │  ├─ layout.css
│  │  │  └─ pages
│  │  │     ├─ admin.css
│  │  │     ├─ auth.css
│  │  │     ├─ buyer.css
│  │  │     └─ seller.css
│  │  ├─ images
│  │  └─ js
│  │     ├─ api.js
│  │     ├─ auth.js
│  │     ├─ cart.js
│  │     └─ pages
│  │        ├─ admin.js
│  │        ├─ buyer.js
│  │        ├─ main.js
│  │        └─ seller.js
│  ├─ book-detail.html
│  ├─ buyer.html
│  ├─ cart.html
│  ├─ index.html
│  ├─ login.html
│  ├─ register.html
│  └─ seller.html
├─ package.json
└─ README.md

```
---

##  Tasarım Hedefleri
Sade ve modern arayüz
Kullanıcı dostu navigasyon
Mobil uyumlu tasarım
Hover animasyonları

---

##  Gelecekte Eklenebilecek Özellikler
Veritabanı entegrasyonu
Kullanıcı giriş sistemi
Gerçek sepet ve ödeme sistemi
Admin paneli

---

##  Geliştirici
Bu proje eğitim amaçlı geliştirilmiştir.
