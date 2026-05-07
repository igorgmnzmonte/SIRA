// src/data/store.js
// ─────────────────────────────────────────────────────────────
// Camada de dados: persistência via LocalStorage usando JSON
// ESM: este módulo exporta funções puras (programação funcional)
// ─────────────────────────────────────────────────────────────

import loginsData from './logins.json';

// ── Auth / Permissões ──────────────────────────────────────────
export let CURRENT_USER = null;

export function login(email) {
  // Sempre procuramos primeiro na fonte da verdade nativa (loginsData),
  // do contrário, o navegador bloqueia pelo cache antigo do localStorage da sessão anterior.
  let users = loginsData;
  let user = users.find((u) => u.email === email);

  if (!user) {
    // Fallback para caso usuários dinâmicos tenham sido criados futuramente e cacheados
    users = getUsersGlobal();
    user = users.find((u) => u.email === email);
  }

  if (user) {
    CURRENT_USER = user;
    localStorage.setItem('sira-auth', email);
    return true;
  }
  return false;
}

export function logout() {
  CURRENT_USER = null;
  localStorage.removeItem('sira-auth');
}

export function tryRestoreSession() {
  const email = localStorage.getItem('sira-auth');
  if (email) login(email);
}

// Global para seeds iniciais sem login
export const getUsersGlobal = () => {
  const raw = localStorage.getItem('sira:users');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* fallthrough */
    }
  }
  localStorage.setItem('sira:users', JSON.stringify(loginsData));
  return loginsData;
};
