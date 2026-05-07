import './style.css';
import './auth.css';

import { el } from './utils/dom.js';
import { tryRestoreSession, login, CURRENT_USER } from './data/store.js';

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
    el(
      'button',
      {
        style: {
          marginTop: '10px',
          padding: '10px 20px',
          background: 'transparent',
          color: 'var(--brand-primary, #00f)',
          border: '1px solid var(--brand-primary, #00f)',
          borderRadius: '4px',
          cursor: 'pointer',
        },
        onClick: () => renderSignup(),
      },
      'Cadastrar-se',
    ),
  );

  app.appendChild(loginBox);
}

// ── Tela de cadastro ─────────────────────────────────────────
function renderSignup() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const signupBox = el(
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
    el('h1', {}, 'SIRA - Cadastro'),
    el('input', {
      id: 'signupName',
      placeholder: 'Nome Completo',
      style: {
        padding: '10px',
        width: '300px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      },
    }),
    el('input', {
      id: 'signupEmail',
      type: 'email',
      placeholder: 'Email Institucional',
      style: {
        padding: '10px',
        width: '300px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      },
    }),
    el(
      'select',
      {
        id: 'signupRole',
        style: {
          padding: '10px',
          width: '320px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        },
      },
      el('option', { value: 'professor' }, 'Professor'),
    ),
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
          width: '320px',
          marginBottom: '10px',
        },
        onClick: () => {
          const name = document.getElementById('signupName').value;
          const email = document.getElementById('signupEmail').value;
          const role = document.getElementById('signupRole').value;

          let signups = [];
          try {
            signups = JSON.parse(localStorage.getItem('sira:signups') || '[]');
          } catch {
            /* fallthrough */
          }

          signups.push({
            id: Date.now(),
            name,
            email,
            role,
            approved: false,
          });

          localStorage.setItem('sira:signups', JSON.stringify(signups));
          alert('Solicitação de cadastro enviada para aprovação do Admin.');
          location.reload();
        },
      },
      'Enviar Solicitação',
    ),
    el(
      'button',
      {
        style: {
          padding: '10px 20px',
          background: 'transparent',
          color: '#666',
          border: 'none',
          cursor: 'pointer',
        },
        onClick: () => location.reload(),
      },
      'Voltar para Login',
    ),
  );

  app.appendChild(signupBox);
}

// ── Bootstrap ───────────────────────────────────────────────
function bootstrap() {
  tryRestoreSession();

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
