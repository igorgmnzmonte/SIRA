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
  const COLOR_MAP = { approved: "green", pending: "amber", rejected: "pink" };
  return reservations.flatMap((r) => {
    const [dd, mm] = (r.date ?? "").split("/").map(Number);
    const dayIdx = weekDates.findIndex(
      (d) => d.getDate() === dd && d.getMonth() + 1 === mm,
    );
    if (dayIdx === -1) return [];
    const match = (r.time ?? "").match(/(\d{1,2})[h:]/);
    if (!match) return [];
    const startHour = parseInt(match[1]);
    const hourIdx = HOURS.findIndex((h) => parseInt(h) === startHour);
    if (hourIdx === -1) return [];
    
    // LINHA CORRIGIDA AQUI ABAIXO:
    const endMatch = (r.time ?? "").match(/[-–](\d{1,2})[h:]/);
    
    const endHour = endMatch ? parseInt(endMatch[1]) : startHour + 1;
    const blocks = Math.max(1, endHour - startHour);
    return Array.from({ length: blocks }, (_, b) => ({
      day: dayIdx + 1,
      hour: hourIdx + b,
      label: r.room,
      sub: r.purpose,
      color: COLOR_MAP[r.status] ?? "blue",
      id: r.id,
    }));
  });
}