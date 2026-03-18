document.addEventListener('DOMContentLoaded', () => {
  // Toast helper
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // User data
  const users = [
    {id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Alıcı', status: 'active'},
    {id: 2, name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'Satıcı', status: 'active'},
    {id: 3, name: 'Elif Kara', email: 'elif@example.com', role: 'Alıcı', status: 'active'},
    {id: 4, name: 'Ayşe Çelik', email: 'ayse@example.com', role: 'Satıcı', status: 'pending'},
    {id: 5, name: 'Can Özkan', email: 'can@example.com', role: 'Alıcı', status: 'active'},
    {id: 6, name: 'Zeynep Akın', email: 'zeynep@example.com', role: 'Alıcı', status: 'inactive'},
  ];

  const tbody = document.getElementById('user-list');
  if (tbody) {
    const renderUsers = (list) => {
      tbody.innerHTML = '';
      list.forEach(u => {
        const statusMap = {
          active: {class: 'tag-mint', label: 'Aktif'},
          pending: {class: 'tag-gold', label: 'Beklemede'},
          inactive: {class: 'tag-primary', label: 'Pasif'}
        };
        const s = statusMap[u.status] || statusMap.active;
        const roleColor = u.role === 'Satıcı' ? 'var(--accent-gold)' : 'var(--primary-light)';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight:600; color: var(--text-muted);">#${u.id}</td>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div style="width:32px; height:32px; border-radius:50%; background: var(--bg-glass-strong); display:flex; align-items:center; justify-content:center; font-size:0.8rem; color: var(--text-muted);">
                <i class="bi bi-person"></i>
              </div>
              ${u.name}
            </div>
          </td>
          <td>${u.email}</td>
          <td><span style="color: ${roleColor}; font-weight: 500;">${u.role}</span></td>
          <td><span class="tag ${s.class}">${s.label}</span></td>
          <td>
            <button class="btn btn-action btn-outline-primary" title="Düzenle" data-id="${u.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-action" style="border:1px solid var(--accent-coral); color: var(--accent-coral);" title="Sil" data-id="${u.id}">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Delete handlers  
      tbody.querySelectorAll('.btn-action[title="Sil"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const row = btn.closest('tr');
          row.style.animation = 'fadeOut 0.3s ease forwards';
          setTimeout(() => row.remove(), 300);
          showToast('Kullanıcı silindi.', 'info');
        });
      });

      // Edit handlers
      tbody.querySelectorAll('.btn-action[title="Düzenle"]').forEach(btn => {
        btn.addEventListener('click', () => {
          showToast('Düzenleme özelliği yakında!', 'info');
        });
      });
    };

    renderUsers(users);

    // Search
    const searchInput = document.querySelector('.dashboard-content input[type="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const filtered = users.filter(u => 
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
        renderUsers(filtered);
      });
    }
  }

  // Sidebar nav
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showToast('Bu bölüm yakında aktif olacak!', 'info');
    });
  });
});
