// src/utils/fp.js
// ─────────────────────────────────────────────────────────────
// Utilitários de Programação Funcional
// Uso explícito de map, filter, reduce e funções puras
// ─────────────────────────────────────────────────────────────

/**
 * Filtra uma lista por um campo de texto (case-insensitive).
 * Uso de Array.filter() + Array.some()
 * @param {Array}    list
 * @param {string}   query
 * @param {string[]} fields  - campos do objeto a verificar
 * @returns {Array}
 */
export const filterByText = (list, query, fields) => {
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter((item) =>
    fields.some((f) =>
      String(item[f] ?? '')
        .toLowerCase()
        .includes(q),
    ),
  );
};

/**
 * Filtra reservas por status.
 * @param {Array}  reservations
 * @param {string} status  - 'all' | 'pending' | 'approved' | 'rejected'
 * @returns {Array}
 */
export const filterByStatus = (reservations, status) =>
  status === 'all'
    ? reservations
    : reservations.filter((r) => r.status === status);

/**
 * Filtra salas por status.
 * @param {Array}  rooms
 * @param {string} status  - 'all' | 'free' | 'busy' | 'maintenance'
 * @returns {Array}
 */
export const filterRoomsByStatus = (rooms, status) =>
  status === 'all' ? rooms : rooms.filter((r) => r.status === status);

/**
 * Computa estatísticas do dashboard via Array.reduce().
 * @param {Array} rooms
 * @param {Array} reservations
 * @param {Array} approvals
 * @returns {Object}
 */
export const computeStats = (rooms, reservations, approvals) => {
  const roomStats = rooms.reduce(
    (acc, r) => {
      acc.total++;
      if (r.status === 'free') acc.free++;
      if (r.status === 'busy') acc.busy++;
      return acc;
    },
    { total: 0, free: 0, busy: 0 },
  );

  const pending = reservations.filter((r) => r.status === 'pending').length;
  const approved = reservations.filter((r) => r.status === 'approved').length;
  const occupancyPct = roomStats.total
    ? Math.round((roomStats.busy / roomStats.total) * 100)
    : 0;

  return {
    ...roomStats,
    pending,
    approved,
    occupancyPct,
    awaitingApproval: approvals.length,
  };
};

/**
 * Transforma papel interno em rótulo legível.
 * @param {string} role
 * @returns {string}
 */
export const roleLabel = (role) =>
  ({
    professor: 'Professor',
    admin: 'Administrador',
  })[role] ?? role;

/**
 * Extrai iniciais de um nome.
 * @param {string} name
 * @returns {string}
 */
export const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/**
 * Mapeia status para classe CSS de badge.
 * @param {string} status
 * @returns {string}
 */
export const statusBadge = (status) =>
  ({
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  })[status] ?? '';

/**
 * Mapeia status de sala para classe e rótulo.
 * @param {string} status
 * @returns {{ dotClass: string, label: string, labelColor: string }}
 */
export const roomStatusInfo = (status) =>
  ({
    free: { dotClass: 'dot-free', label: 'Disponível', labelColor: '#3B6D11' },
    busy: { dotClass: 'dot-busy', label: 'Ocupada', labelColor: '#791F1F' },
    maintenance: {
      dotClass: 'dot-reserved',
      label: 'Manutenção',
      labelColor: '#633806',
    },
    reserved: {
      dotClass: 'dot-reserved',
      label: 'Reservada',
      labelColor: '#633806',
    },
  })[status] ?? { dotClass: 'dot-free', label: status, labelColor: 'inherit' };
