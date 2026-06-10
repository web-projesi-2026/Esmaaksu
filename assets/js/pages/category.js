/**
 * ═══════════════════════════════════════════════════════════
 *  RafArası — Kategori Sayfası (Arama, Filtreleme, Sıralama)
 * ═══════════════════════════════════════════════════════════
 *
 *  Özellikler:
 *  1) Kitap ismine göre anlık arama (live search)
 *  2) Kategori butonlarıyla filtreleme (Roman, Tarih, Bilim Kurgu vb.)
 *  3) Fiyata göre sıralama (artan / azalan)
 *  4) Fiyat aralığı filtreleme
 *  5) Sayfa yenilenmeden DOM üzerinde dinamik güncelleme
 *
 *  Tüm işlemler client-side'da DOM manipülasyonu ile çalışır.
 * ═══════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Element References ───
    const urlParams        = new URLSearchParams(window.location.search);
    const currentCategory  = urlParams.get('category') || '';

    const banner           = document.getElementById('category-banner');
    const bannerTitle      = document.getElementById('banner-title');
    const bannerDesc       = document.getElementById('banner-desc');
    const breadcrumbCurrent= document.getElementById('breadcrumb-current');
    const booksContainer   = document.getElementById('category-books-container');
    const bookCountEl      = document.getElementById('book-count');
    const liveSearchInput  = document.getElementById('live-search-input');
    const clearSearchBtn   = document.getElementById('clear-search-btn');
    const searchResultCount= document.getElementById('search-result-count');
    const categoryFilterBar= document.getElementById('category-filter-bar');
    const sortSelect       = document.getElementById('sort-select');
    const activeFiltersEl  = document.getElementById('active-filters');
    const priceMinInput    = document.getElementById('price-min');
    const priceMaxInput    = document.getElementById('price-max');
    const applyPriceBtn    = document.getElementById('apply-price-filter');

    // ─── State ───
    let allBooks         = [];
    let activeCategory   = '';
    let searchQuery      = '';
    let sortMode         = 'default';
    let priceMin         = null;
    let priceMax         = null;

    // ─── Banner Configuration ───
    const bannerConfig = {
        'Edebiyat': {
            title: 'Edebiyat Kitapları',
            desc: 'Dünya klasiklerinden çağdaş edebiyata, ruhunuza dokunacak binlerce eser.',
            gradient: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200'
        },
        'Kırtasiye': {
            title: 'Kırtasiye & Hobi',
            desc: 'Okuldan ofise, hayal gücünüzü renklendirecek tüm ihtiyaçlarınız burada.',
            gradient: 'linear-gradient(90deg, #e63946 0%, #f1faee 100%)',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=1200'
        },
        'Okula Yardımcı': {
            title: 'Okula Yardımcı Kaynaklar',
            desc: 'Tüm okul seviyeleri için başarıya giden yolda en güçlü destekçiniz.',
            gradient: 'linear-gradient(90deg, #d62828 0%, #003049 100%)',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200'
        },
        'Sınavlara Hazırlık': {
            title: 'Sınav Hazırlık Kitapları',
            desc: 'TYT, AYT, LGS ve diğer tüm sınavlar için uzman hocaların hazırladığı kaynaklar.',
            gradient: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200'
        },
        'Çocuk': {
            title: 'Çocuk Kitapları Dünyası',
            desc: 'Minik okurlarımız için eğlenceli ve öğretici hikayeler, masallar.',
            gradient: 'linear-gradient(90deg, #ff9f1c 0%, #ffbf69 100%)',
            image: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?auto=format&fit=crop&q=80&w=1200'
        },
        'Best Seller': {
            title: 'En Çok Satanlar',
            desc: 'Okurlarımızın favorisi olan, haftanın en popüler eserleri.',
            gradient: 'linear-gradient(90deg, #d4af37 0%, #000 100%)',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200'
        }
    };

    const config = bannerConfig[currentCategory] || {
        title: 'Tüm Kitaplar',
        desc: 'RafArası geniş kataloğu ile aradığınız her şeyi burada bulabilirsiniz.',
        gradient: 'linear-gradient(90deg, #1A1932 0%, #232147 100%)',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200'
    };

    // Apply Banner Config
    if (banner) {
        banner.style.backgroundImage = `url('${config.image}')`;
        bannerTitle.textContent = config.title;
        bannerDesc.textContent = config.desc;
        breadcrumbCurrent.textContent = config.title;
    }


    // ═════════════════════════════════════════
    //  CORE: Filter + Sort + Render Pipeline
    // ═════════════════════════════════════════

    /**
     * Tüm filtreleri ve sıralamayı uygulayıp kitapları gösterir.
     * Sayfa yenilenmeden DOM üzerinde çalışır.
     */
    function applyFiltersAndRender() {
        let result = [...allBooks];

        // 1) Kategori Filtreleme
        if (activeCategory) {
            if (activeCategory === 'Best Seller') {
                result = result.filter(b => b.isBestSeller || b.rating >= 4.5);
            } else {
                result = result.filter(b =>
                    (b.category || '').toLowerCase() === activeCategory.toLowerCase()
                );
            }
        }

        // 2) Arama Filtreleme — kitap ismine göre anlık arama
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(b => {
                const title  = (b.title || '').toLowerCase();
                const author = (b.author || '').toLowerCase();
                return title.includes(q) || author.includes(q);
            });
        }

        // 3) Fiyat Aralığı Filtreleme
        if (priceMin !== null) {
            result = result.filter(b => parseFloat(b.price) >= priceMin);
        }
        if (priceMax !== null) {
            result = result.filter(b => parseFloat(b.price) <= priceMax);
        }

        // 4) Sıralama — fiyata göre sıralama dahil
        result = sortBooks(result, sortMode);

        // 5) DOM Güncelle
        bookCountEl.textContent = result.length;
        renderBooks(result);
        updateSearchResultCount(result.length);
        updateActiveFilters();
    }


    // ═════════════════════════════════════════
    //  SORT: Kitapları sıralama fonksiyonu
    // ═════════════════════════════════════════

    function sortBooks(books, mode) {
        const sorted = [...books];
        switch (mode) {
            case 'price-asc':
                // Fiyata göre artan sıralama
                sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                // Fiyata göre azalan sıralama
                sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name-asc':
                sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'tr'));
                break;
            case 'name-desc':
                sorted.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'tr'));
                break;
            case 'newest':
                sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                // Önerilen — orijinal sıra
                break;
        }
        return sorted;
    }


    // ═════════════════════════════════════════
    //  RENDER: Kitap kartlarını DOM'a yerleştir
    // ═════════════════════════════════════════

    function renderBooks(list) {
        if (!booksContainer) return;
        booksContainer.innerHTML = '';

        if (list.length === 0) {
            booksContainer.innerHTML = `
                <div class="col-12 no-results">
                    <i class="bi bi-search"></i>
                    <h5>Sonuç Bulunamadı</h5>
                    <p>Arama kriterlerinize uygun kitap bulunamadı.<br>Farklı bir arama terimi veya kategori deneyin.</p>
                </div>`;
            return;
        }

        // Favori yardımcı fonksiyonları
        const getFavorites = () => (JSON.parse(localStorage.getItem('favorites')) || []).map(String);

        list.forEach((b, idx) => {
            const col = document.createElement('div');
            col.className = 'col-sm-6 col-md-4 col-lg-4 book-card-animated';
            col.style.animationDelay = `${idx * 0.05}s`;

            // Badge HTML
            let badgeHTML = '';
            if (b.isNew) {
                badgeHTML = '<span class="tag tag-mint" style="position:absolute;top:10px;left:10px;z-index:2;">Yeni</span>';
            } else if (b.isBestSeller) {
                badgeHTML = '<span class="tag tag-gold" style="position:absolute;top:10px;left:10px;z-index:2;">Çok Satan</span>';
            }

            // Favori durumunu kontrol et
            const favs = getFavorites();
            const bookId = String(b.id);
            const isFav = favs.includes(bookId);
            const favIcon = isFav ? 'bi-heart-fill' : 'bi-heart';
            const favColor = isFav ? '#e63946' : 'var(--text-secondary, #6c757d)';

            // Arama sonucunda eşleşen metni vurgula
            const highlightedTitle = highlightText(b.title, searchQuery);
            const highlightedAuthor = highlightText(b.author, searchQuery);

            // Star rating
            let starsHTML = '<div class="star-rating">';
            for (let i = 1; i <= 5; i++) {
                starsHTML += i <= Math.round(b.rating || 0)
                    ? '<i class="bi bi-star-fill"></i>'
                    : '<i class="bi bi-star"></i>';
            }
            starsHTML += '</div>';

            col.innerHTML = `
                <div class="card h-100" style="cursor: pointer;" onclick="window.location.href='book-detail.html?id=${b.id}'">
                    <div style="height:200px; position:relative; overflow:hidden;">
                        <img src="${b.image || 'assets/images/book-placeholder.png'}" 
                             style="width:100%; height:100%; object-fit:cover;" 
                             onerror="this.src='assets/images/book-placeholder.png'"
                             alt="${b.title}">
                        ${badgeHTML}
                        <button class="btn btn-sm btn-light fav-btn" data-id="${b.id}" 
                                style="position:absolute; top:10px; right:10px; z-index:2; border-radius:50%; width:32px; height:32px; padding:0; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 6px rgba(0,0,0,0.15);"
                                onclick="event.stopPropagation();">
                            <i class="bi ${favIcon}" style="color: ${favColor}; font-size: 1rem; transition: all 0.3s ease;"></i>
                        </button>
                        <div class="price-tag">${parseFloat(b.price).toFixed(2)} TL</div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title" style="font-size: 0.95rem;">${highlightedTitle}</h6>
                        <p class="card-text small mb-1">${highlightedAuthor}</p>
                        ${starsHTML}
                        <small style="color: var(--text-muted); font-size: 0.75rem;">${b.reviewCount || 0} değerlendirme</small>
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
                            <span class="badge bg-light text-dark" style="font-size: 0.7rem;">${b.category}</span>
                            <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${b.id}" onclick="event.stopPropagation();">
                                <i class="bi bi-bag-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            booksContainer.appendChild(col);
        });

        // Favori butonları — tıklanınca localStorage'a kaydet
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = String(btn.getAttribute('data-id'));
                let favs = getFavorites();
                const icon = btn.querySelector('i');

                if (favs.includes(id)) {
                    // Favorilerden çıkar
                    favs = favs.filter(fId => fId !== id);
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.style.color = 'var(--text-secondary, #6c757d)';
                    if (window.showToast) window.showToast('Favorilerden çıkarıldı!', 'info');
                } else {
                    // Favorilere ekle
                    favs.push(id);
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.style.color = '#e63946';
                    if (window.showToast) window.showToast('Favorilere eklendi!', 'success');
                }
                localStorage.setItem('favorites', JSON.stringify(favs));
            });
        });

        // Add to cart listeners
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.showToast) window.showToast('Ürün sepete eklendi!', 'success');
                else alert('Sepete eklendi!');
            });
        });
    }


    // ═════════════════════════════════════════
    //  HIGHLIGHT: Arama metnini vurgulama
    // ═════════════════════════════════════════

    function highlightText(text, query) {
        if (!query || !query.trim()) return text;
        const q = query.trim();
        // Regex special chars escape
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }


    // ═════════════════════════════════════════
    //  CATEGORY BUTTONS: Dinamik oluşturma
    // ═════════════════════════════════════════

    function buildCategoryButtons() {
        if (!categoryFilterBar) return;

        // Kitaplardan benzersiz kategorileri çıkar
        const categories = [...new Set(allBooks.map(b => b.category).filter(Boolean))];

        // Kategori ikonları
        const icons = {
            'Roman':       'bi-book',
            'Tarih':       'bi-clock-history',
            'Bilim Kurgu': 'bi-rocket-takeoff',
            'Çocuk':       'bi-emoji-smile',
            'Edebiyat':    'bi-pen',
            'Şiir':        'bi-feather',
            'Psikoloji':   'bi-brain',
        };

        categoryFilterBar.innerHTML = '';

        // "Tümü" butonu
        const allBtn = createCategoryButton('', 'Tümü', 'bi-grid-3x3-gap', allBooks.length);
        if (!activeCategory) allBtn.classList.add('active');
        categoryFilterBar.appendChild(allBtn);

        // Her kategori için buton oluştur
        categories.forEach(cat => {
            const count = allBooks.filter(b => b.category === cat).length;
            const icon = icons[cat] || 'bi-bookmark';
            const btn = createCategoryButton(cat, cat, icon, count);
            if (activeCategory === cat) btn.classList.add('active');
            categoryFilterBar.appendChild(btn);
        });
    }

    function createCategoryButton(value, label, icon, count) {
        const btn = document.createElement('button');
        btn.className = 'category-filter-btn';
        btn.dataset.category = value;
        btn.innerHTML = `
            <i class="bi ${icon}"></i>
            <span>${label}</span>
            <span class="cat-count">${count}</span>
        `;
        btn.addEventListener('click', () => {
            // Aktif kategoriyi güncelle
            activeCategory = value;

            // Tüm butonlardan active sınıfını kaldır
            categoryFilterBar.querySelectorAll('.category-filter-btn').forEach(b =>
                b.classList.remove('active')
            );
            btn.classList.add('active');

            // Filtreyi uygula ve DOM'u güncelle — sayfa yenilenmez
            applyFiltersAndRender();
        });
        return btn;
    }


    // ═════════════════════════════════════════
    //  SEARCH RESULT COUNT & CLEAR BUTTON
    // ═════════════════════════════════════════

    function updateSearchResultCount(count) {
        if (!searchResultCount || !clearSearchBtn) return;

        if (searchQuery.trim()) {
            searchResultCount.textContent = `${count} sonuç`;
            searchResultCount.classList.add('visible');
            clearSearchBtn.classList.add('visible');
        } else {
            searchResultCount.classList.remove('visible');
            clearSearchBtn.classList.remove('visible');
        }
    }


    // ═════════════════════════════════════════
    //  ACTIVE FILTERS: Aktif filtre etiketleri
    // ═════════════════════════════════════════

    function updateActiveFilters() {
        if (!activeFiltersEl) return;
        activeFiltersEl.innerHTML = '';

        // Kategori etiketi
        if (activeCategory) {
            const tag = createFilterTag(
                `Kategori: ${activeCategory}`,
                () => {
                    activeCategory = '';
                    categoryFilterBar.querySelectorAll('.category-filter-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.category === '');
                    });
                    applyFiltersAndRender();
                }
            );
            activeFiltersEl.appendChild(tag);
        }

        // Arama etiketi
        if (searchQuery.trim()) {
            const tag = createFilterTag(
                `Arama: "${searchQuery.trim()}"`,
                () => {
                    searchQuery = '';
                    liveSearchInput.value = '';
                    applyFiltersAndRender();
                }
            );
            activeFiltersEl.appendChild(tag);
        }

        // Fiyat aralığı etiketi
        if (priceMin !== null || priceMax !== null) {
            const label = `Fiyat: ${priceMin || 0} — ${priceMax || '∞'} TL`;
            const tag = createFilterTag(label, () => {
                priceMin = null;
                priceMax = null;
                if (priceMinInput) priceMinInput.value = '';
                if (priceMaxInput) priceMaxInput.value = '';
                applyFiltersAndRender();
            });
            activeFiltersEl.appendChild(tag);
        }

        // Sıralama etiketi
        if (sortMode !== 'default') {
            const labels = {
                'price-asc':  'Fiyat ↑',
                'price-desc': 'Fiyat ↓',
                'rating':     'Puan ↓',
                'name-asc':   'İsim A-Z',
                'name-desc':  'İsim Z-A',
                'newest':     'En Yeniler',
            };
            const tag = createFilterTag(
                `Sıralama: ${labels[sortMode]}`,
                () => {
                    sortMode = 'default';
                    sortSelect.value = 'default';
                    applyFiltersAndRender();
                }
            );
            activeFiltersEl.appendChild(tag);
        }
    }

    function createFilterTag(text, onRemove) {
        const tag = document.createElement('span');
        tag.className = 'active-filter-tag';
        tag.innerHTML = `${text} <i class="bi bi-x-circle remove-filter"></i>`;
        tag.querySelector('.remove-filter').addEventListener('click', onRemove);
        return tag;
    }


    // ═════════════════════════════════════════
    //  EVENT LISTENERS — Sayfa yenilenmeden çalışır
    // ═════════════════════════════════════════

    // 1) Anlık Arama (Live Search) — input olayında DOM güncellenir
    if (liveSearchInput) {
        let debounceTimer;
        liveSearchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                applyFiltersAndRender();
            }, 150); // 150ms debounce — akıcı arama deneyimi
        });

        // Enter tuşuyla form submit'i engelle
        liveSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
    }

    // 2) Arama temizle butonu
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchQuery = '';
            liveSearchInput.value = '';
            liveSearchInput.focus();
            applyFiltersAndRender();
        });
    }

    // 3) Sıralama değişikliği — fiyata göre sıralama dahil
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortMode = e.target.value;
            applyFiltersAndRender();
        });
    }

    // 4) Fiyat aralığı filtreleme
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            const min = priceMinInput ? parseFloat(priceMinInput.value) : NaN;
            const max = priceMaxInput ? parseFloat(priceMaxInput.value) : NaN;
            priceMin = isNaN(min) ? null : min;
            priceMax = isNaN(max) ? null : max;
            applyFiltersAndRender();
        });
    }

    // 5) Navbar arama çubuğu — category sayfasındaki live search'e yönlendir
    const navbarSearch = document.getElementById('search-input');
    if (navbarSearch) {
        navbarSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            if (liveSearchInput) liveSearchInput.value = searchQuery;
            applyFiltersAndRender();
        });
    }


    // ═════════════════════════════════════════
    //  INIT: Verileri yükle ve başlat
    // ═════════════════════════════════════════

    if (typeof getMockBooks === 'function') {
        getMockBooks().then(books => {
            allBooks = books;

            // URL'den gelen kategori parametresini uygula
            if (currentCategory) {
                activeCategory = currentCategory;
            }

            // Kategori butonlarını oluştur
            buildCategoryButtons();

            // İlk render
            applyFiltersAndRender();
        });
    }

});
