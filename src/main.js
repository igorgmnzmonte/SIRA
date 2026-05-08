// [Apresentação] Importação dos estilos globais e componentes de UI
import './style.css';
import './home.css';
import './auth.css';

import { el, render } from './utils/dom.js';
import { createSidebar } from './components/sidebar.js';
import { initModalListeners } from './components/modal.js';

// [Apresentação] Importação modular das páginas (View Layer)
import { renderDashboard } from './modules/dashboard.js';
import { renderCalendar } from './modules/calendar.js';
import { renderReservations } from './modules/reservations.js';
import { renderApprovals } from './modules/approvals.js';
import { renderRooms } from './modules/rooms.js';
import { renderUsers } from './modules/users.js';
import { renderNotifications } from './modules/notifications.js';
import { renderNovaReserva } from './modules/novaReserva.js';

import { tryRestoreSession, login, CURRENT_USER } from './data/store.js';

// [Apresentação] Roteador Funcional (Dispatcher): Mapeamos strings para funções de renderização.
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

// ── Funções de Autenticação ──
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

  // ── Montagem do Shell (Main UI Wrapper) ──
  const shell = el('div', { class: 'sira-shell' });
  const sidebarContainer = document.createElement('div');
  const main = el('div', { class: 'main' });

  // PageContainer: Onde a mágica do SPA acontece
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

  // [Apresentação] Função de Navegação Centralizada com Middleware de Segurança
  function navigate(pageName) {
    if (!CURRENT_USER) return;

    // ── T-07.4: BLOQUEIO DE ACESSO POR PERFIL (RBAC) ──
    const isAdmin = CURRENT_USER.role === 'admin';
    const allowedForUser = ['reservas', 'calendario', 'novaReserva'];

    if (!isAdmin && !allowedForUser.includes(pageName)) {
      console.warn(`Acesso negado à rota: ${pageName}. Redirecionando...`);
      pageName = 'calendario';
    }

    const renderer = PAGE_RENDERERS[pageName];
    if (!renderer) return;

    // ── T-07.2: ATUALIZAÇÃO DA URL (History API) ──
    if (window.location.pathname !== `/${pageName}`) {
      window.history.pushState({}, '', `/${pageName}`);
    }

    // Renderização do novo conteúdo
    pageContainer.innerHTML = '';
    renderer(pageContainer);
  }

  // ── T-08.1: INJETAR BOTÃO HAMBÚRGUER DINÂMICO ──
  // [Apresentação] O MutationObserver monitora o pageContainer. Sempre que o conteúdo mudar,
  // verificamos se a página renderizada possui uma .topbar para injetar o botão de menu mobile.
  const topbarObserver = new MutationObserver(() => {
    const topbar = pageContainer.querySelector('.topbar');
    if (topbar && !topbar.querySelector('.hamburger')) {
      const hbtn = el(
        'button',
        {
          class: 'hamburger',
          onClick: () => {
            sidebarContainer.querySelector('.sidebar')?.classList.add('open');
            document.querySelector('.sidebar-overlay')?.classList.add('open');
          },
        },
        el('span', {}),
      );
      topbar.prepend(hbtn);
    }
  });
  topbarObserver.observe(pageContainer, { childList: true, subtree: true });

  // Inicializa o Sidebar injetando a função de navegação
  createSidebar(sidebarContainer, CURRENT_USER, navigate, () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('sira-theme', isDark ? 'dark' : 'light');
  });

  shell.appendChild(sidebarContainer);
  shell.appendChild(main);
  app.appendChild(shell);

  initModalListeners();

  // ── T-07.3: ESCUTADOR DE HISTÓRICO (Popstate) ──
  window.addEventListener('popstate', () => {
    let path = window.location.pathname.replace(/^\//, '');
    if (!path || !PAGE_RENDERERS[path]) path = 'calendario';
    navigate(path);
  });

  // Deep Linking: Render inicial baseado na URL atual
  let initialPage = window.location.pathname.replace(/^\//, '');
  if (!PAGE_RENDERERS[initialPage]) initialPage = 'calendario';

  navigate(initialPage);
}

bootstrap();
