/**
 * RafArası — Global Navigation & Auth Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const updateAuthUI = () => {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        
        // Login ve Register bağlantılarını seçelim
        const authElements = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
        const personLink = document.querySelector('a[href="javascript:navigateToProfile()"]');
        const personIconLi = personLink?.parentElement;
        
        if (userId) {
            // Giriş yapılmış: Tüm auth elementlerini gizle (Hero butonları dahil)
            authElements.forEach(el => {
                const li = el.closest('.nav-item');
                if (li) {
                    li.classList.add('d-none');
                    li.classList.remove('d-lg-block', 'd-block');
                } else {
                    // Navbar dışında ise (Hero butonu gibi)
                    el.classList.add('d-none');
                }
            });

            if (personIconLi) {
                personIconLi.classList.remove('d-none');
                personIconLi.style.display = 'block';
                
                // İsim ekleyelim
                if (!document.getElementById('user-display-name')) {
                    const span = document.createElement('span');
                    span.id = 'user-display-name';
                    span.className = 'ms-2 small fw-bold d-none d-xl-inline-block text-white';
                    span.textContent = userName || 'Profilim';
                    personLink.appendChild(span);
                }
            }
            
            // Çıkış butonu ekleme
            if (!document.querySelector('.logout-btn')) {
                const logoutLi = document.createElement('li');
                logoutLi.className = 'nav-item ms-lg-3';
                logoutLi.innerHTML = `<a class="btn btn-outline-danger btn-sm logout-btn px-3" style="border-radius:20px;" href="#"><i class="bi bi-box-arrow-right me-1"></i>Çıkış</a>`;
                const nav = document.querySelector('.navbar-nav');
                if (nav) nav.appendChild(logoutLi);
                
                logoutLi.querySelector('.logout-btn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.clear();
                    window.location.href = 'index.html';
                });
            }
        } else {
            // Giriş yapılmamış: Butonları göster
            authElements.forEach(el => {
                const li = el.closest('.nav-item');
                if (li) {
                    li.classList.remove('d-none');
                    // Orijinal sınıfları geri getirelim (index.html'deki yapıya göre)
                    if (el.href.includes('login.html')) li.classList.add('d-none', 'd-lg-block');
                }
            });
            if (personIconLi) personIconLi.classList.add('d-none');
            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) logoutBtn.closest('.nav-item').remove();
        }
    };

    window.navigateToProfile = () => {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('userRole');
        if (!userId) {
            window.location.href = 'login.html';
        } else if (role === 'seller') {
            window.location.href = 'seller.html';
        } else {
            window.location.href = 'profile.html';
        }
    };

    updateAuthUI();

    // Update Cart Count
    const updateCartCount = () => {
        const countEl = document.querySelector('.cart-count');
        if (countEl) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            countEl.textContent = total;
        }
    };
    window.updateCartCount = updateCartCount;
    updateCartCount();

    // Sync Helpers
    window.syncCartWithDB = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId || userId === 'admin') return;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        try {
            await fetch('http://localhost:3000/api/users/sync-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, cart })
            });
        } catch (err) {
            console.error('Cart sync failed:', err);
        }
    };

    window.syncFavoritesWithDB = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId || userId === 'admin') return;

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        try {
            await fetch('http://localhost:3000/api/users/sync-favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, favorites })
            });
        } catch (err) {
            console.error('Favorites sync failed:', err);
        }
    };
});
