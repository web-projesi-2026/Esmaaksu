/* =============================================
   RAFARASI — Theme Toggle (Dark / Light)
   ============================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'rafarasi-theme';

  // Determine initial theme
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    // Default to dark (site's original theme)
    return 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    const sunIcon = btn.querySelector('.theme-icon-sun');
    const moonIcon = btn.querySelector('.theme-icon-moon');
    const bookIcon = btn.querySelector('.theme-icon-book');

    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'none';
    if (bookIcon) bookIcon.style.display = 'none';

    if (theme === 'light') {
      // Current: light -> Next: reader
      if (bookIcon) bookIcon.style.display = 'block';
      btn.setAttribute('title', 'Okuma Moduna Geç');
    } else if (theme === 'reader') {
      // Current: reader -> Next: dark
      if (moonIcon) moonIcon.style.display = 'block';
      btn.setAttribute('title', 'Gece Moduna Geç');
    } else {
      // Current: dark -> Next: light
      if (sunIcon) sunIcon.style.display = 'block';
      btn.setAttribute('title', 'Gündüz Moduna Geç');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    let next;
    if (current === 'dark') next = 'light';
    else if (current === 'light') next = 'reader';
    else next = 'dark';
    setTheme(next);
  }

  // Apply theme immediately (before DOM ready) to prevent flash
  setTheme(getPreferredTheme());

  // Inject the toggle button into the navbar once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Find the navbar container
    const navbar = document.querySelector('.navbar .container');
    if (!navbar) return;

    // Create toggle button
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Tema değiştir');
    btn.setAttribute('title', 'Açık / Koyu Tema');
    btn.type = 'button';
    btn.innerHTML = `
      <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg class="theme-icon-book" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    `;

    // Insert after the navbar-brand, before other elements
    const toggler = navbar.querySelector('.navbar-toggler');
    const brandLink = navbar.querySelector('.navbar-brand');
    
    if (toggler) {
      // Main pages: insert before the toggler
      navbar.insertBefore(btn, toggler);
    } else if (brandLink && brandLink.nextElementSibling) {
      // Auth/simple pages: insert after brand, before next element
      navbar.insertBefore(btn, brandLink.nextElementSibling);
    } else {
      navbar.appendChild(btn);
    }

    btn.addEventListener('click', toggleTheme);

    // Update icon state
    updateToggleIcon(getPreferredTheme());
  });
})();
