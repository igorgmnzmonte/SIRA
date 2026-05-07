import './style.css';
import './auth.css';

import { el } from './utils/dom.js';
import { login, CURRENT_USER } from './data/store.js';

// ── Tela de login ────────────────────────────────────────────
function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const loginBox = el(
    'div',
    {
      style: {
        padding: '40px',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    el('h1', {}, 'SIRA - Login'),
    el('p', { style: { color: '#666', marginBottom: '20px' } }),
    el('input', {
      id: 'emailInput',
      placeholder: 'Email',
      style: {
        padding: '10px',
        width: '300px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      },
    }),
    el(
      'button',
      {
        style: {
          padding: '10px 20px',
          background: 'var(--brand-primary, #00f)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        },
        onClick: () => {
          const email = document.getElementById('emailInput').value;
          if (login(email)) {
            location.reload();
          } else {
            alert('Usuário não encontrado.');
          }
        },
      },
      'Entrar',
    ),
  );

  app.appendChild(loginBox);
}

// ── Bootstrap ───────────────────────────────────────────────
function bootstrap() {
  if (!CURRENT_USER) {
    renderLogin();
    return;
  }

  // Placeholder — será substituído pela montagem do shell em USes futuras
  const app = document.getElementById('app');
  app.innerHTML = `
    <main style="padding:40px;text-align:center">
      <h1>SIRA</h1>
      <p>Logado como <strong>${CURRENT_USER.name}</strong></p>
    </main>
  `;
}

bootstrap();
