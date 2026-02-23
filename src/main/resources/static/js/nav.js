/**
 * VoltMed – Shared sidebar/nav renderer
 *  Call: renderNav('dashboard' | 'medicos' | 'pacientes' | 'consultas')
 */
function renderNav(activePage) {
  const links = [
    {
      id: 'dashboard', href: APP_BASE + '/dashboard.html', label: 'Dashboard',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
    },
    {
      id: 'medicos', href: APP_BASE + '/medicos.html', label: 'Médicos',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v4m-2-2h4"/></svg>`
    },
    {
      id: 'pacientes', href: APP_BASE + '/pacientes.html', label: 'Pacientes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      id: 'consultas', href: APP_BASE + '/consultas.html', label: 'Consultas',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`
    }
  ];

  const navHTML = links.map(l => `
    <a class="nav-item${l.id === activePage ? ' active' : ''}" href="${l.href}">
      ${l.icon}
      <span class="nav-label">${l.label}</span>
    </a>`).join('');

  return /* html */`
<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    </div>
    <span class="logo-text">VoltMed</span>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-section-label">Menú</div>
    ${navHTML}
  </nav>
  <div class="sidebar-footer">
    <div class="user-info">
      <div class="user-avatar" id="user-avatar">U</div>
      <div class="user-details">
        <div class="user-name" id="user-name-display">Usuario</div>
        <div class="user-role">Administrador</div>
      </div>
      <button class="logout-btn" id="logout-btn" title="Cerrar sesión">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </div>
</aside>
<div class="sidebar-overlay" id="sidebar-overlay"></div>`;
}

function renderHeader(title) {
  return /* html */`
<header class="top-header">
  <button class="toggle-sidebar-btn" id="toggle-sidebar">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>
  <div class="page-title-area"><h1>${title}</h1></div>
  <div class="search-bar" id="header-search">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input type="text" placeholder="Buscar…" id="search-input" />
  </div>
</header>`;
}
