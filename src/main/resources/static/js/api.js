/**
 * VoltMed – API helper
 * Base URL: same origin (Spring Boot serves both FE and API)
 */

const API_BASE = window.location.port === '8080' ? '' : 'http://localhost:8080';
const APP_BASE = 'http://localhost:8080';

/* ─── JWT Storage ─── */
const Auth = {
  getToken  () { return localStorage.getItem('voltmed_token'); },
  setToken  (t){ localStorage.setItem('voltmed_token', t); },
  clearToken(){ localStorage.removeItem('voltmed_token'); localStorage.removeItem('voltmed_user'); },
  getUser   () { try { return JSON.parse(localStorage.getItem('voltmed_user') || 'null'); } catch { return null; } },
  setUser   (u){ localStorage.setItem('voltmed_user', JSON.stringify(u)); },
  isLoggedIn() { return !!this.getToken(); },
  requireAuth(){
    if (!this.isLoggedIn()) {
      window.location.href = APP_BASE + '/index.html';
      return false;
    }
    return true;
  }
};

/* ─── Core fetch wrapper ─── */
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...options, headers });

  if (res.status === 401) {
    Auth.clearToken();
    window.location.href = APP_BASE + '/index.html';
    throw new Error('No autorizado. Por favor inicie sesión.');
  }

  if (res.status === 204) return null;            // No Content

  let data;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    const msg = data?.message || data?.detail || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

/* ─── Auth endpoints ─── */
const AuthAPI = {
  async login(login, contrasena) {
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ login, contrasena })
    });
    Auth.setToken(data.token);
    Auth.setUser({ login });
    return data;
  }
};

/* ─── Médicos endpoints ─── */
const MedicosAPI = {
  async listar(page = 0, size = 10) {
    return apiFetch(`/medicos?page=${page}&size=${size}`);
  },
  async obtener(id) {
    return apiFetch(`/medicos/${id}`);
  },
  async registrar(datos) {
    return apiFetch('/medicos', { method: 'POST', body: JSON.stringify(datos) });
  },
  async actualizar(datos) {
    return apiFetch('/medicos', { method: 'PUT', body: JSON.stringify(datos) });
  },
  async eliminar(id) {
    return apiFetch(`/medicos/${id}`, { method: 'DELETE' });
  }
};

/* ─── Pacientes endpoints ─── */
const PacientesAPI = {
  async listar(page = 0, size = 10) {
    return apiFetch(`/pacientes?page=${page}&size=${size}`);
  },
  async obtener(id) {
    return apiFetch(`/pacientes/${id}`);
  },
  async registrar(datos) {
    return apiFetch('/pacientes', { method: 'POST', body: JSON.stringify(datos) });
  },
  async actualizar(datos) {
    return apiFetch('/pacientes', { method: 'PUT', body: JSON.stringify(datos) });
  },
  async eliminar(id) {
    return apiFetch(`/pacientes/${id}`, { method: 'DELETE' });
  }
};

/* ─── Consultas endpoints ─── */
const ConsultasAPI = {
  async reservar(datos) {
    return apiFetch('/consultas', { method: 'POST', body: JSON.stringify(datos) });
  },
  async cancelar(datos) {
    return apiFetch('/consultas', { method: 'DELETE', body: JSON.stringify(datos) });
  }
};

/* ─── Toast helper ─── */
function showToast(message, type = 'default') {
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    danger:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.default} <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

/* ─── Sidebar toggle ─── */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('toggle-sidebar');

  if (!sidebar) return;

  toggleBtn?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      overlay?.classList.toggle('active');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

/* ─── Modal helpers ─── */
function openModal(id)  { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});

/* ─── Format date ─── */
function formatDateTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

function toLocalInputValue(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─── Render user info ─── */
function renderUserInfo() {
  const user = Auth.getUser();
  const nameEl = document.getElementById('user-name-display');
  const avatarEl = document.getElementById('user-avatar');
  if (user && nameEl) {
    nameEl.textContent = user.login || 'Usuario';
    if (avatarEl) avatarEl.textContent = (user.login || 'U')[0].toUpperCase();
  }
}

/* ─── Logout ─── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    Auth.clearToken();
    window.location.href = APP_BASE + '/index.html';
  });
});
