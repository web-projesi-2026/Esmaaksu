/* =============================================
   RAFARASI — Scroll to Top Button
   ============================================= */

(function () {
  'use strict';

  const SCROLL_THRESHOLD = 300; // px scrolled before button appears

  document.addEventListener('DOMContentLoaded', () => {
    // Create button element
    const btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Yukarı çık');
    btn.setAttribute('title', 'Sayfanın başına dön');
    btn.type = 'button';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;

    document.body.appendChild(btn);

    // Show / hide based on scroll position
    let ticking = false;

    function updateButton() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateButton);
        ticking = true;
      }
    }, { passive: true });

    // Scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initial check
    updateButton();
  });
})();
