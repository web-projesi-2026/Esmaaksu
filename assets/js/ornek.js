document.addEventListener("DOMContentLoaded", () => {
  kitaplariGetir();
});

// JSON verisini Fetch API ile asenkron olarak çek
async function kitaplariGetir() {
  const container = document.getElementById("kitaplar-konteyner");
  
  try {
    // JSON dosyasından verileri oku
    const response = await fetch("kitaplar.json");
    
    // Eğer dosya bulunamazsa hata fırlat
    if (!response.ok) {
      throw new Error("Kitap verilerine ulaşılamadı! HTTP Kodu: " + response.status);
    }
    
    // Yanıtı JSON formatına çevir
    const kitaplar = await response.json();
    
    // Yükleniyor yazısını kaldır
    container.innerHTML = "";
    
    // Her bir kitap için kart oluştur ve HTML'e ekle
    kitaplar.forEach(kitap => {
      const kartHTML = `
        <div class="col-sm-6 col-md-4 col-lg-4 mb-3">
          <div class="card h-100 shadow-sm" style="border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
            <img src="${kitap.gorsel}" class="card-img-top" alt="${kitap.ad}" style="height: 280px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title text-dark fw-bold mb-0">${kitap.ad}</h5>
                <span class="badge bg-light text-dark border">${kitap.kategori}</span>
              </div>
              <p class="card-text text-muted mb-3" style="font-size: 0.9rem;">
                <i class="bi bi-pen"></i> ${kitap.yazar}
              </p>
              <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <span class="fw-bold fs-5 text-primary">${kitap.fiyat.toFixed(2)} TL</span>
                <button class="btn btn-outline-primary btn-sm" onclick="sepeteEkle(${kitap.id})">
                  <i class="bi bi-bag-plus"></i> Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      // Oluşturulan kartı konteynere ekle
      container.innerHTML += kartHTML;
    });

  } catch (hata) {
    console.error("Hata oluştu:", hata);
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Kitaplar yüklenirken bir hata oluştu: <strong>${hata.message}</strong>
        </div>
      </div>
    `;
  }
}

// Örnek Sepete Ekleme Fonksiyonu
window.sepeteEkle = function(id) {
  alert(`ID numarası ${id} olan kitap sepete eklendi!`);
};
