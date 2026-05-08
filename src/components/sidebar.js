import { el } from '../utils/dom.js';
import { initials } from '../utils/fp.js';

// Importando os dados da store para os badges dinâmicos
import {
  getReservations,
  getApprovals,
  getNotifications,
} from '../data/store.js';

// Array declarativo: centraliza as páginas. Para adicionar/remover rotas no futuro, basta mexer aqui.
const NAV_ITEMS = [
  {
    page: 'dashboard',
    label: 'Dashboard',
    icon: svgDashboard,
    section: 'VISÃO GERAL',
  },
  { page: 'calendario', label: 'Calendário', icon: svgCalendar, section: null },
  {
    page: 'novaReserva',
    label: 'Nova Reserva',
    icon: () => makeSvg('<path d="M8 2v12M2 8h12"/>'),
    section: null,
  },
  {
    page: 'reservas',
    label: 'Minhas Reservas',
    icon: svgReserv,
    section: 'RESERVAS',
    // Conta as reservas não lidas do usuário
    badge: () =>
      getReservations().filter((r) => r.requester === 'Diego Pessoa' && !r.read)
        .length,
  },
  {
    page: 'aprovacoes',
    label: 'Aprovações',
    icon: svgApproval,
    section: null,
    // Conta as aprovações pendentes
    badge: () => getApprovals().filter((a) => !a.read).length,
  },
  {
    page: 'salas',
    label: 'Salas e Espaços',
    icon: svgRoom,
    section: 'ADMINISTRAÇÃO',
  },
  { page: 'usuarios', label: 'Usuários', icon: svgUser, section: null },
  {
    page: 'notificacoes',
    label: 'Notificações',
    icon: svgBell,
    section: null,
    // Conta as notificações gerais não lidas
    badge: () => getNotifications().filter((n) => !n.read).length,
    roles: ['admin'],
  },
];

// Componente de UI puro: recebe dados e callbacks, não gerencia estado próprio.
export function createSidebar(
  container,
  currentUser,
  onNavigate,
  onToggleDark,
) {
  const sidebar = el('aside', { class: 'sidebar' });

  // ── Montagem do Logo ──
  sidebar.appendChild(
    el(
      'div',
      { class: 'sidebar-logo' },
      el('div', { class: 'logo-mark' }, 'SIRA'),
      el('div', { class: 'logo-sub' }, 'Sistema de Reserva de Salas'),
    ),
  );

  // ── Controle de Acesso (RBAC) ──
  // Filtra as rotas visíveis baseadas no cargo (role) do usuário
  const isAdmin = currentUser.role === 'admin';
  const userItems = NAV_ITEMS.filter((item) => {
    if (isAdmin) return true; // Admin vê tudo
    // Professor/Coordenador vê apenas o básico:
    return ['reservas', 'calendario', 'novaReserva'].includes(item.page);
  });

  // ── Renderização dos Botões ──
  let currentSection = null;

  // Itera sobre o array filtrado
  userItems.forEach((item) => {
    // Cria cabeçalho de seção (ex: "ADMINISTRAÇÃO")
    if (item.section !== currentSection) {
      currentSection = item.section;
      if (item.section) {
        sidebar.appendChild(
          el('div', { class: 'sidebar-section' }, item.section),
        );
      }
    }

    // Delega a ação de navegação para quem chamou a sidebar (onNavigate)
    const navItem = el(
      'button',
      {
        class: `nav-item${item.page === 'dashboard' ? ' active' : ''}`,
        'data-page': item.page,
        onClick: (e) => {
          document
            .querySelectorAll('.nav-item')
            .forEach((n) => n.classList.remove('active'));
          e.currentTarget.classList.add('active');
          onNavigate(item.page);
        },
      },
      item.icon(),
      item.label,
    );

    // Renderiza o badge ao lado do label se a função existir
    if (item.badge) {
      const badgeVal =
        typeof item.badge === 'function' ? item.badge() : item.badge;
      const displayVal = badgeVal > 0 ? badgeVal : '';

      // Cria o elemento visual da bolinha vermelha
      const badgeEl = el(
        'span',
        { class: 'notif-badge', id: `badge-${item.page}` },
        displayVal,
      );

      // Esconde o badge se a contagem for zero
      if (!displayVal) badgeEl.style.display = 'none';

      navItem.appendChild(badgeEl);
    }

    sidebar.appendChild(navItem);
  });

  // ── Rodapé fixo ──
  const bottom = el('div', { class: 'sidebar-bottom' });

  // Aciona a troca de tema via callback
  const toggleBtn = el('div', { class: 'dark-toggle', onClick: onToggleDark });
  const toggleRow = el(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 8px',
      },
    },
    el(
      'span',
      { style: { fontSize: '11px', color: 'var(--text-tertiary)' } },
      'Modo escuro',
    ),
    toggleBtn,
  );

  // Exibe dados do usuário logado injetados via prop 'currentUser'
  const userPill = el(
    'div',
    { class: 'user-pill' },
    el('div', { class: 'avatar' }, initials(currentUser.name)),
    el(
      'div',
      { style: { flex: 1 } },
      el('div', { class: 'user-name' }, currentUser.name),
      el('div', { class: 'user-role' }, currentUser.role),
    ),
    el(
      'button',
      {
        style: {
          background: 'transparent',
          border: '1px solid var(--border-color)',
          padding: '2px 6px',
          fontSize: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
        },
        onClick: () => {
          // Lazy Loading: só importa a store e carrega o script de logout se o usuário de fato clicar em sair.
          import('../data/store.js').then((m) => {
            m.logout();
            location.reload();
          });
        },
      },
      'Sair',
    ),
  );

  bottom.appendChild(toggleRow);
  bottom.appendChild(userPill);
  sidebar.appendChild(bottom);

  // Single DOM Append: Injeta tudo de uma vez na tela para melhor performance.
  container.appendChild(sidebar);
}

// ── Factory de SVGs ────────────────────────────────────────
// Gera os ícones direto no DOM. Evita requisições HTTP extras e permite herdar a cor do texto (útil pro Dark Mode).
function svgDashboard() {
  return makeSvg(
    '<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>',
  );
}
function svgCalendar() {
  return makeSvg(
    '<rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 2v2M11 2v2M2 7h12"/>',
  );
}
function svgReserv() {
  return makeSvg(
    '<path d="M4 4h8M4 8h8M4 12h5"/><rect x="1" y="1" width="14" height="14" rx="2"/>',
  );
}
function svgApproval() {
  return makeSvg('<path d="M4 8l3 3 5-5"/><circle cx="8" cy="8" r="7"/>');
}
function svgRoom() {
  return makeSvg(
    '<rect x="2" y="5" width="12" height="8" rx="1"/><path d="M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M8 9v2"/>',
  );
}
function svgUser() {
  return makeSvg(
    '<circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/>',
  );
}
function svgIntegration() {
  return makeSvg(
    '<circle cx="4" cy="8" r="2"/><circle cx="12" cy="8" r="2"/><path d="M6 8h4"/><circle cx="8" cy="3" r="2"/><path d="M8 5v1M8 10v1"/>',
  );
}
function svgBell() {
  return makeSvg(
    '<path d="M8 2a5 5 0 00-5 5v3l-1 2h12l-1-2V7a5 5 0 00-5-5zM6.5 13a1.5 1.5 0 003 0"/>',
  );
}

function makeSvg(inner) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('class', 'nav-icon');
  svg.innerHTML = inner;
  return svg;
}
