// src/modules/calendar.js
// ─────────────────────────────────────────────────────────────
// Módulo: Home — Painel de Reservas estilo calendário
// Layout baseado no wireframe: header com ações rápidas +
// info do usuário + calendário semanal como painel principal
// ─────────────────────────────────────────────────────────────

import { el, render, btn } from '../utils/dom.js';
import {
  getReservations,
  getRooms,
  saveReservations,
  genId,
} from '../data/store.js';
import { openModal, closeModal, createModal } from '../components/modal.js';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function reservationsToEvents(reservations, weekDates) {
  const COLOR_MAP = { approved: 'green', pending: 'amber', rejected: 'pink' };
  return reservations.flatMap((r) => {
    const [dd, mm] = (r.date ?? '').split('/').map(Number);
    const dayIdx = weekDates.findIndex(
      (d) => d.getDate() === dd && d.getMonth() + 1 === mm,
    );
    if (dayIdx === -1) return [];
    const match = (r.time ?? '').match(/(\d{1,2})[h:]/);
    if (!match) return [];
    const startHour = parseInt(match[1]);
    const hourIdx = HOURS.findIndex((h) => parseInt(h) === startHour);
    if (hourIdx === -1) return [];

    // LINHA CORRIGIDA AQUI ABAIXO:
    const endMatch = (r.time ?? '').match(/[-–](\d{1,2})[h:]/);

    const endHour = endMatch ? parseInt(endMatch[1]) : startHour + 1;
    const blocks = Math.max(1, endHour - startHour);
    return Array.from({ length: blocks }, (_, b) => ({
      day: dayIdx + 1,
      hour: hourIdx + b,
      label: r.room,
      sub: r.purpose,
      color: COLOR_MAP[r.status] ?? 'blue',
      id: r.id,
    }));
  });
}

let weekOffset = 0;

export function renderCalendar(page) {
  rebuildCalendar(page);
}

function buildFragment(page) {
  const weekDates = getWeekDates(weekOffset);
  const reservations = getReservations();
  const events = reservationsToEvents(reservations, weekDates);
  const monthYear = weekDates[0].toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  // ── TOPBAR ──
  const topbar = el(
    'div',
    { class: 'topbar home-topbar' },
    el('span', { class: 'topbar-title home-brand' }, 'SIRA — IFPB'),
    el(
      'div',
      { class: 'home-actions' },
      btn('+ Nova Reserva', 'btn-primary', () => {
        window.navigatePage('novaReserva');
      }),
      btn('✕ Cancelar reserva', 'btn home-btn-cancel', () =>
        openCancelModal(page),
      ),
    ),
  );

  // ── USER STRIP ──
  const userStrip = el(
    'div',
    { class: 'home-user-strip' },
    el(
      'div',
      { class: 'home-user-info' },
      el('span', { class: 'home-user-name' }, 'Diego Pessoa'),
      el(
        'span',
        { class: 'home-user-role' },
        'Coordenador · Engenharia de Software',
      ),
    ),
    el(
      'div',
      { class: 'home-week-nav' },
      btn('‹', 'btn btn-icon btn-sm', () => {
        weekOffset--;
        rebuildCalendar(page);
      }),
      el(
        'span',
        { class: 'home-month-label' },
        monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
      ),
      btn('›', 'btn btn-icon btn-sm', () => {
        weekOffset++;
        rebuildCalendar(page);
      }),
      btn('Hoje', 'btn btn-sm', () => {
        weekOffset = 0;
        rebuildCalendar(page);
      }),
    ),
  );

  // ── SUAS RESERVAS (sidebar) ──
  const myRes = reservations
    .filter((r) => r.requester === 'Diego Pessoa')
    .slice(0, 6);
  const DOT = {
    approved: 'res-dot-green',
    pending: 'res-dot-amber',
    rejected: 'res-dot-red',
  };

  const resItems = myRes.length
    ? myRes.map((r) =>
        el(
          'div',
          { class: 'home-res-item' },
          el('span', { class: `res-dot ${DOT[r.status] ?? ''}` }),
          el(
            'div',
            { class: 'home-res-text' },
            el('span', { class: 'home-res-room' }, r.room),
            el('span', { class: 'home-res-meta' }, `${r.date} · ${r.time}`),
          ),
        ),
      )
    : [el('div', { class: 'home-res-empty' }, 'Sem reservas.')];

  const sidebar = el(
    'div',
    { class: 'home-sidebar' },
    el('div', { class: 'home-sidebar-title' }, 'Suas reservas'),
    el('div', { class: 'home-res-list' }, ...resItems),
  );

  // ── CALENDÁRIO ──
  const daysHeader = el(
    'div',
    { class: 'cal-days-header' },
    el('div', { class: 'cal-day-label' }),
    ...weekDates.map((d, i) => {
      const today = d.toDateString() === new Date().toDateString();
      return el(
        'div',
        { class: `cal-day-label${today ? ' cal-today' : ''}` },
        el('span', { class: 'cal-day-name' }, DAYS[i]),
        el(
          'span',
          { class: `cal-day-num${today ? ' cal-today-num' : ''}` },
          d.getDate(),
        ),
      );
    }),
  );

  const timeCol = el(
    'div',
    { class: 'time-col' },
    ...HOURS.map((h) => el('div', { class: 'time-slot' }, h)),
  );

  const dayCols = DAYS.map((_, dayIdx) =>
    el(
      'div',
      { class: 'day-col' },
      ...HOURS.map((_, hourIdx) => {
        const ev = events.find(
          (e) => e.day === dayIdx + 1 && e.hour === hourIdx,
        );
        const cell = el('div', { class: 'cal-cell' });
        if (ev) {
          const isContinuation = events.some(
            (e) => e.id === ev.id && e.hour === hourIdx - 1,
          );

          cell.appendChild(
            el(
              'div',
              {
                class: `event event-${ev.color}`,
                style: isContinuation
                  ? { borderTop: 'none', paddingTop: '0' }
                  : {},
              },
              ...(!isContinuation
                ? [
                    el('span', { class: 'event-label' }, ev.label),
                    ...(ev.sub
                      ? [el('span', { class: 'event-sub' }, ev.sub)]
                      : []),
                  ]
                : []),
            ),
          );
        }
        return cell;
      }),
    ),
  );

  const calGrid = el(
    'div',
    { class: 'cal-grid' },
    daysHeader,
    el('div', { class: 'cal-body' }, timeCol, ...dayCols),
  );

  // ── MOUNT ──
  const body = el(
    'div',
    { class: 'home-body' },
    el(
      'div',
      { class: 'home-left' },
      userStrip,
      el('div', { class: 'home-cal-panel' }, calGrid),
    ),
    sidebar,
  );

  const frag = document.createDocumentFragment();
  frag.appendChild(topbar);
  frag.appendChild(el('div', { class: 'content home-content' }, body));
  return frag;
}

function rebuildCalendar(page) {
  render(page, buildFragment(page));
}

// ── Modal: Reserva rápida ─────────────────────────────────────

function openQuickModal(recorrente, page) {
  const rooms = getRooms();

  const roomSelect = el(
    'select',
    { class: 'form-input' },
    ...rooms.map((r) => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = r.name;
      return o;
    }),
  );
  const dateInput = el('input', { type: 'date', class: 'form-input' });
  const timeSelect = el(
    'select',
    { class: 'form-input' },
    ...[
      '07:00–08:00',
      '08:00–10:00',
      '10:00–12:00',
      '14:00–16:00',
      '16:00–18:00',
    ].map((t) => {
      const o = document.createElement('option');
      o.textContent = t;
      return o;
    }),
  );
  const purposeInput = el('textarea', {
    class: 'form-input',
    rows: '2',
    style: 'resize:none',
  });
  const recurSelect = recorrente
    ? el(
        'select',
        { class: 'form-input' },
        ...['Semanal', 'Quinzenal', 'Mensal'].map((t) => {
          const o = document.createElement('option');
          o.textContent = t;
          return o;
        }),
      )
    : null;

  createModal({
    id: 'modal-quick',
    title: recorrente ? 'Reserva Recorrente' : 'Reserva Pontual',
    body: el(
      'div',
      {},
      formField('Sala', roomSelect),
      el(
        'div',
        { class: 'form-row' },
        formField('Data', dateInput),
        formField('Horário', timeSelect),
      ),
      formField('Finalidade', purposeInput),
      ...(recorrente ? [formField('Recorrência', recurSelect)] : []),
    ),
    actions: [
      { label: 'Cancelar', onClick: () => closeModal('modal-quick') },
      {
        label: 'Enviar solicitação',
        primary: true,
        onClick: () => {
          const room = rooms.find((r) => r.id === roomSelect.value);
          const purpose = purposeInput.value.trim();
          const date = dateInput.value;
          if (!date || !purpose) {
            toastMsg('Preencha data e finalidade.', 'error');
            return;
          }
          const [y, m, d] = date.split('-');
          saveReservations([
            ...getReservations(),
            {
              id: genId('res'),
              room: room.name,
              date: `${d}/${m}`,
              time: timeSelect.value,
              purpose,
              requester: 'Diego Pessoa',
              status: 'pending',
            },
          ]);
          closeModal('modal-quick');
          toastMsg('Solicitação enviada!', 'success');
          if (window.updateSidebarBadges) window.updateSidebarBadges();
          rebuildCalendar(page);
        },
      },
    ],
  });
  openModal('modal-quick');
}

// ── Modal: Cancelar ───────────────────────────────────────────

function openCancelModal(page) {
  const mine = getReservations().filter(
    (r) => r.requester === 'Diego Pessoa' && r.status !== 'rejected',
  );
  if (!mine.length) {
    toastMsg('Sem reservas ativas para cancelar.', 'error');
    return;
  }

  const select = el(
    'select',
    { class: 'form-input' },
    ...mine.map((r) => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = `${r.room} · ${r.date} · ${r.time}`;
      return o;
    }),
  );

  createModal({
    id: 'modal-cancel',
    title: 'Cancelar Reserva',
    body: formField('Selecione a reserva', select),
    actions: [
      { label: 'Voltar', onClick: () => closeModal('modal-cancel') },
      {
        label: 'Confirmar cancelamento',
        primary: false,
        onClick: () => {
          saveReservations(
            getReservations().filter((r) => r.id !== select.value),
          );
          closeModal('modal-cancel');
          toastMsg('Reserva cancelada.', 'success');
          if (window.updateSidebarBadges) window.updateSidebarBadges();
          rebuildCalendar(page);
        },
      },
    ],
  });
  openModal('modal-cancel');
}

// ── Helpers ───────────────────────────────────────────────────

function formField(label, input) {
  return el(
    'div',
    { class: 'form-field' },
    el('label', { class: 'form-label' }, label),
    input,
  );
}

function toastMsg(msg, type) {
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
