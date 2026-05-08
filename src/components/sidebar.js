import { el } from '../utils/dom.js';
import { initials } from '../utils/fp.js';

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
  },
  { page: 'aprovacoes', label: 'Aprovações', icon: svgApproval, section: null },
  {
    page: 'salas',
    label: 'Salas e Espaços',
    icon: svgRoom,
    section: 'ADMINISTRAÇÃO',
  },
  { page: 'usuarios', label: 'Usuários', icon: svgUser, section: null },
  { page: 'notificacoes', label: 'Notificações', icon: svgBell, section: null },
];

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
