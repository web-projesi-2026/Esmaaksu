document.addEventListener('DOMContentLoaded', () => {
  // Toast helper
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function createToastContainer() {
    const c = document.createElement('div');
    c.className = 'toast-container';
    c.id = 'toast-container';
    document.body.appendChild(c);
    return c;
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        showToast('Lütfen tüm alanları doldurun.', 'error');
        return;
      }

      // Mock Role Check based on email
      if (email === 'admin@gmail.com' && password === 'admin') {
        showToast('Yönetici girişi başarılı!', 'success');
        setTimeout(() => window.location.href = 'admin.html', 800);
      } else if (email.toLowerCase().includes('satici')) {
        showToast('Satıcı girişi başarılı! Yönlendiriliyorsunuz...', 'success');
        setTimeout(() => window.location.href = 'seller.html', 800);
      } else {
        showToast('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      if (!name || !email || !password) {
        showToast('Lütfen tüm alanları doldurun.', 'error');
        return;
      }

      showToast(`Hoşgeldiniz, ${name}! Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...`, 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    });
  }


});