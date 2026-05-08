// [Apresentação] Importação dos estilos globais e componentes de UI
import './style.css';
import './home.css';
import './auth.css';

import { el, render } from './utils/dom.js';
import { createSidebar } from './components/sidebar.js';
import { initModalListeners } from './components/modal.js';

// [Apresentação] Importação modular das páginas.
import { renderDashboard } from './modules/dashboard.js';
import { renderCalendar } from './modules/calendar.js';
import { renderReservations } from './modules/reservations.js';
import { renderApprovals } from './modules/approvals.js';
import { renderRooms } from './modules/rooms.js';
import { renderUsers } from './modules/users.js';
import { renderNotifications } from './modules/notifications.js';
import { renderNovaReserva } from './modules/novaReserva.js';

import { tryRestoreSession, login, CURRENT_USER } from './data/store.js';

// [Apresentação] Roteador Funcional: Mapeamos o nome da rota para sua função de render.
const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  calendario: renderCalendar,
  reservas: renderReservations,
  aprovacoes: renderApprovals,
  salas: renderRooms,
  usuarios: renderUsers,
  notificacoes: renderNotifications,
  novaReserva: renderNovaReserva,
};

// ── Telas de Autenticação (Mantidas para o Bootstrap funcionar) ──
function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  const loginBox = el(
    'div',
    {
      class: 'login-container',
      style: { padding: '40px', textAlign: 'center' },
    },
    el('h1', {}, 'SIRA - Login'),
    el('input', { id: 'emailInput', placeholder: 'Email' }),
    el(
      'button',
      {
        onClick: () => {
          const email = document.getElementById('emailInput').value;
          if (login(email)) location.reload();
          else alert('Usuário não encontrado.');
        },
      },
      'Entrar',
    ),
    el('button', { onClick: () => renderSignup() }, 'Cadastrar-se'),
  );
  app.appendChild(loginBox);
}

function renderSignup() {
  const app = document.getElementById('app');
  app.innerHTML =
    '<h1>Tela de Cadastro</h1><button onclick="location.reload()">Voltar</button>';
}

function bootstrap() {
  tryRestoreSession();

  if (!CURRENT_USER) {
    renderLogin();
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = '';

  const shell = el('div', { class: 'sira-shell' });
  const sidebarContainer = document.createElement('div');
  const main = el('div', { class: 'main' });

  const pageContainer = el('div', {
    class: 'page active',
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      overflow: 'hidden',
    },
  });

  main.appendChild(pageContainer);

  function navigate(pageName) {
    const renderer = PAGE_RENDERERS[pageName];
    if (!renderer) return;

    // ── T-07.2: ATUALIZAÇÃO DA URL ──
    // [Apresentação] Usamos pushState para mudar o endereço no navegador sem dar refresh.
    if (window.location.pathname !== `/${pageName}`) {
      window.history.pushState({}, '', `/${pageName}`);
    }

    // Limpa a página atual e renderiza a nova
    pageContainer.innerHTML = '';
    renderer(pageContainer);
  }

  createSidebar(sidebarContainer, CURRENT_USER, navigate, () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('sira-theme', isDark ? 'dark' : 'light');
  });

  shell.appendChild(sidebarContainer);
  shell.appendChild(main);
  app.appendChild(shell);

  initModalListeners();

  navigate('calendario');
}

bootstrap();
