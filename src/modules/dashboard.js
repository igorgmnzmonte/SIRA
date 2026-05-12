// src/modules/dashboard.js
// ─────────────────────────────────────────────────────────────
// Dashboard do Administrador: Estatísticas e Resumo do Sistema
// ─────────────────────────────────────────────────────────────

import { getRooms, getReservations } from '../data/store.js';
import { computeStats } from '../utils/fp.js';
import { el } from '../utils/dom.js';

/**
 * Renderiza o dashboard do administrador.
 * @returns {HTMLElement}
 */
export function renderDashboard() {
  // Passo 2: Resgatar os dados
  const rooms = getRooms();
  const reservations = getReservations();

  // Passo 3: Calcular os indicadores
  const stats = computeStats(rooms, reservations, []); // approvals não usado aqui, passar []

  // Passo 4: Renderizar os Cards
  const cardsData = [
    { title: 'Total de Salas', value: stats.total },
    { title: 'Salas Disponíveis', value: stats.free },
    { title: 'Reservas Pendentes', value: stats.pending },
    { title: 'Taxa de Ocupação', value: `${stats.occupancyPct}%` },
  ];

  const cards = cardsData.map(({ title, value }) =>
    el(
      'div',
      { class: 'stat-card' },
      el('div', { class: 'stat-label' }, title),
      el('div', { class: 'stat-value' }, String(value)),
    ),
  );

  // Passo 5: Listar reservas aprovadas recentes
  const recentApproved = reservations
    .filter((r) => r.status === 'approved')
    .slice(0, 3)
    .map((reservation) =>
      el(
        'li',
        {},
        el('strong', {}, reservation.roomName || 'Sala'),
        ' - ',
        reservation.date || 'Data',
        ' (',
        reservation.time || 'Horário',
        ')',
      ),
    );

  // Passo 6: Placeholder do Gráfico
  const chartPlaceholder = el(
    'div',
    { class: 'chart-placeholder' },
    'Gráfico de Ocupação (Integração Futura HIFPB)',
  );

  // Agrupar tudo
  return el(
    'div',
    { class: 'dashboard' },
    el('h2', {}, 'Dashboard do Administrador'),
    el('div', { class: 'stats-row' }, ...cards),
    el(
      'div',
      { class: 'dashboard-grid' },
      el(
        'div',
        {},
        el('h3', { class: 'section-title' }, 'Reservas Aprovadas Recentes'),
        el('ul', {}, ...recentApproved),
      ),
      el(
        'div',
        {},
        el('h3', { class: 'section-title' }, 'Ocupação Diária'),
        chartPlaceholder,
      ),
    ),
  );
}
