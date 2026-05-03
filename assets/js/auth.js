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

  // Role selection
  const roleButtons = document.querySelectorAll('.role-select button');
  let role = 'buyer';

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      role = btn.dataset.role;
    });
  });

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        showToast('Lütfen tüm alanları doldurun.', 'error');
        return;
      }

      // Hardcoded Admin panel
      if (email === 'admin@rafarasi.com' && password === 'admin') {
        showToast('Yönetici girişi başarılı!', 'success');
        localStorage.setItem('userId', 'admin');
        setTimeout(() => window.location.href = 'admin.html', 800);
        return;
      } 
      
      try {
        const response = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          showToast(`${data.name} olarak giriş yapıldı. Yönlendiriliyorsunuz...`, 'success');
          // Giriş yapan kullanıcının ID ve rol bilgisini localStorage'a kaydediyoruz
          localStorage.setItem('userId', data._id);
          localStorage.setItem('userRole', data.role);
          
          if (data.role === 'admin') {
             setTimeout(() => window.location.href = 'admin.html', 1500);
          } else if (data.role === 'seller') {
             setTimeout(() => window.location.href = 'seller.html', 1500);
          } else {
             // Alıcılar direkt ana sayfaya yönlendirilir
             setTimeout(() => window.location.href = 'index.html', 1500);
          }
        } else {
          showToast(data.message || 'Giriş başarısız.', 'error');
        }
      } catch(error) {
        console.error(error);
        showToast('Sunucu ile iletişim kurulamadı.', 'error');
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const passwordConfirm = document.getElementById('password-confirm').value.trim();

      if (password !== passwordConfirm) {
         showToast('Şifreler eşleşmiyor.', 'error');
         return;
      }

      if (!name || !email || !password) {
        showToast('Lütfen tüm alanları doldurun.', 'error');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        if (response.ok) {
          showToast(`Hoşgeldiniz, ${data.name}! Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...`, 'success');
          setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
          showToast(data.message || 'Kayıt başarısız.', 'error');
        }
      } catch(error) {
         console.error(error);
         showToast('Sunucu ile iletişim kurulamadı.', 'error');
      }
    });
  }

  // Social button handlers (visual only)
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Sosyal giriş yakında aktif olacak!', 'info');
    });
  });
});