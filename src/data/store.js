// src/data/store.js
// ─────────────────────────────────────────────────────────────
// Camada de dados: persistência via LocalStorage usando JSON
// ESM: este módulo exporta funções puras (programação funcional)
// ─────────────────────────────────────────────────────────────

import loginsData from './logins.json';
import seedData from './seed.json';

// Prefixo usado para todas as chaves de armazenamento no LocalStorage.
// Isso permite separar o banco de dados do SIRA de outras chaves que o app
// ou o navegador possa gravar no localStorage.
const DB_PREFIX = 'sira_db';

// Constrói a chave de armazenamento a partir do e-mail do usuário e da coleção.
// Exemplo: sira_db/admin@ifpb.edu.br/rooms.json
const buildCollectionKey = (email, collection) =>
  `${DB_PREFIX}/${email}/${collection}.json`;

// Estado global atual do usuário logado. Esse valor é atualizado no login
// e usado como fallback em loadCollection/saveCollection quando o e-mail não
// é passado explicitamente.
export let CURRENT_USER = null;

// Carrega uma coleção específica do LocalStorage para um usuário.
// Se não houver usuário logado, retorna o valor do seed correspondente.
export function loadCollection(collection, email = CURRENT_USER?.email) {
  if (!collection) return [];

  // Quando não há usuário logado, retornamos o seed como fallback.
  if (!email) {
    return seedData[collection] ?? [];
  }

  // Constrói a chave com base no usuário e coleção solicitados.
  const key = buildCollectionKey(email, collection);

  // Tenta ler o JSON armazenado.
  const raw = localStorage.getItem(key);
  if (!raw) {
    // Se não existir registro para o usuário, retorna array vazio.
    return [];
  }

  try {
    // Se o JSON estiver válido, converte para um valor JS.
    return JSON.parse(raw);
  } catch {
    // Se houve erro de parse, evita crash e retorna uma coleção limpa.
    return [];
  }
}

// Persiste uma coleção no LocalStorage para um usuário.
// O retorno é o mesmo objeto enviado, o que facilita encadeamento nas chamadas.
export function saveCollection(collection, data, email = CURRENT_USER?.email) {
  if (!email || !collection) return null;

  // Garante que a chave seja sempre construída da mesma maneira.
  const key = buildCollectionKey(email, collection);

  // Serializa o payload em JSON antes de gravar.
  const payload = JSON.stringify(data);
  localStorage.setItem(key, payload);

  // Retorna os dados gravados para conveniência.
  return data;
}

export function login(email) {
  // Sempre procuramos primeiro na fonte da verdade nativa (loginsData),
  // pois o LocalStorage pode conter dados de sessão obsoletos ou inválidos.
  let users = loginsData;
  let user = users.find((u) => u.email === email);

  if (!user) {
    // Se não encontrou no seed local, usamos o cache global de usuários.
    // Isso permite suportar futuros cadastros que persistam na aplicação.
    users = getUsersGlobal();
    user = users.find((u) => u.email === email);
  }

  if (user) {
    // Se o usuário existe, define a sessão atual e grava a conta no storage.
    CURRENT_USER = user;
    localStorage.setItem('sira-auth', email);
    return true;
  }

  return false;
}

export function logout() {
  // Limpa a sessão atual em memória e remove a marcação do storage.
  CURRENT_USER = null;
  localStorage.removeItem('sira-auth');
}

export function tryRestoreSession() {
  // Tenta restaurar a sessão com base no e-mail persistido anteriormente.
  const email = localStorage.getItem('sira-auth');
  if (email) login(email);
}

// Retorna a lista de salas. Se o usuário for admin, consolida salas de todos os usuários.
// Caso contrário, retorna apenas as salas do usuário logado.
export function getRooms() {
  if (isAdmin()) {
    // Admin vê todas as salas do sistema, consolidadas de todos os usuários.
    return consolidateCollection('rooms');
  }

  // Usuário comum vê apenas suas próprias salas.
  return loadCollection('rooms');
}

// Retorna a lista de reservas. Se o usuário for admin, consolida reservas de todos os usuários.
// Caso contrário, retorna apenas as reservas do usuário logado.
export function getReservations() {
  if (isAdmin()) {
    // Admin vê todas as reservas do sistema, consolidadas de todos os usuários.
    return consolidateCollection('reservations');
  }

  // Usuário comum vê apenas suas próprias reservas.
  return loadCollection('reservations');
}

// Retorna a lista de notificações. Se o usuário for admin, consolida notificações de todos os usuários.
// Caso contrário, retorna apenas as notificações do usuário logado.
export function getNotifications() {
  if (isAdmin()) {
    // Admin vê todas as notificações do sistema, consolidadas de todos os usuários.
    return consolidateCollection('notifications');
  }

  // Usuário comum vê apenas suas próprias notificações.
  return loadCollection('notifications');
}

// Retorna a lista de aprovações. Se o usuário for admin, consolida aprovações de todos os usuários.
// Caso contrário, retorna apenas as aprovações do usuário logado.
export function getApprovals() {
  if (isAdmin()) {
    // Admin vê todas as aprovações do sistema, consolidadas de todos os usuários.
    return consolidateCollection('approvals');
  }

  // Usuário comum vê apenas suas próprias aprovações.
  return loadCollection('approvals');
}

// Verifica se o usuário atual é administrador.
// O admin é identificado pelo e-mail 'admin@ifpb.edu.br'.
function isAdmin() {
  return CURRENT_USER?.email === 'admin@ifpb.edu.br';
}

// Consolida uma coleção específica de todos os usuários do sistema.
// Usado apenas para o admin, que precisa ver dados agregados.
function consolidateCollection(collection) {
  const allUsers = getUsersGlobal();
  const consolidated = [];

  // Para cada usuário registrado, carrega a coleção e adiciona ao resultado consolidado.
  for (const user of allUsers) {
    const userData = loadCollection(collection, user.email);
    consolidated.push(...userData);
  }

  return consolidated;
}

// Gera um ID único para entidades do sistema.
// Combina timestamp atual com um sufixo aleatório para evitar colisões.
export function generateId() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomSuffix}`;
}

// Alias para compatibilidade
export const genId = generateId;

// Salva uma reserva. Se o usuário for admin, propaga a gravação para o usuário proprietário da reserva.
// Caso contrário, salva na coleção do usuário logado.
export function saveReservation(reservation) {
  if (isAdmin() && reservation.userEmail) {
    // Admin está salvando uma reserva de outro usuário; propaga para a coleção do proprietário.
    const userReservations = loadCollection(
      'reservations',
      reservation.userEmail,
    );
    const existingIndex = userReservations.findIndex(
      (r) => r.id === reservation.id,
    );

    if (existingIndex >= 0) {
      // Atualiza reserva existente.
      userReservations[existingIndex] = reservation;
    } else {
      // Adiciona nova reserva.
      userReservations.push(reservation);
    }

    return saveCollection(
      'reservations',
      userReservations,
      reservation.userEmail,
    );
  }

  // Usuário comum ou admin salvando sua própria reserva.
  const userReservations = loadCollection('reservations');
  const existingIndex = userReservations.findIndex(
    (r) => r.id === reservation.id,
  );

  if (existingIndex >= 0) {
    userReservations[existingIndex] = reservation;
  } else {
    userReservations.push(reservation);
  }

  return saveCollection('reservations', userReservations);
}

// Alias para compatibilidade
export const saveReservations = saveReservation;

// Salva uma aprovação. Se o usuário for admin, propaga a gravação para o usuário proprietário da aprovação.
// Caso contrário, salva na coleção do usuário logado.
export function saveApproval(approval) {
  const approvalOwnerEmail = approval.userEmail || CURRENT_USER?.email;
  if (!approvalOwnerEmail) return null;

  // Se o admin salva a approval de outro usuário, grava no local correto.
  const userApprovals = loadCollection('approvals', approvalOwnerEmail);
  const existingIndex = userApprovals.findIndex((a) => a.id === approval.id);

  if (existingIndex >= 0) {
    userApprovals[existingIndex] = approval;
  } else {
    userApprovals.push(approval);
  }

  const savedApproval = saveCollection(
    'approvals',
    userApprovals,
    approvalOwnerEmail,
  );

  if (isAdmin() && approval.status && approval.userEmail) {
    updateReservationStatusForApproval(approval);
    upsertApprovalNotification(approval);
  }

  return savedApproval;
}

// Alias para compatibilidade
export const saveApprovals = saveApproval;

// Atualiza o status da reserva do solicitante vinculada à aprovação.
function updateReservationStatusForApproval(approval) {
  if (!approval?.reservationId || !approval?.userEmail) return null;

  const userReservations = loadCollection('reservations', approval.userEmail);
  const targetReservation = userReservations.find(
    (reservation) => reservation.id === approval.reservationId,
  );

  if (!targetReservation) return null;

  targetReservation.status = approval.status;
  return saveCollection('reservations', userReservations, approval.userEmail);
}

// Cria ou atualiza uma notificação do solicitante relacionada à aprovação.
function upsertApprovalNotification(approval) {
  if (!approval?.userEmail) return null;

  const notifications = loadCollection('notifications', approval.userEmail);
  const existingIndex = notifications.findIndex(
    (notification) =>
      notification.approvalId === approval.id ||
      notification.reservationId === approval.reservationId,
  );

  const message =
    approval.status === 'approved'
      ? 'Sua reserva foi aprovada pelo admin.'
      : 'Sua solicitação de reserva foi recusada pelo admin.';

  const notification = {
    id: existingIndex >= 0 ? notifications[existingIndex].id : generateId(),
    approvalId: approval.id,
    reservationId: approval.reservationId,
    type: 'approval',
    status: approval.status,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  if (existingIndex >= 0) {
    notifications[existingIndex] = notification;
  } else {
    notifications.push(notification);
  }

  return saveCollection('notifications', notifications, approval.userEmail);
}

// Resolve uma aprovação como admin e propaga as mudanças para reserva e notificação do solicitante.
export function resolveApproval(approval) {
  if (!isAdmin() || !approval?.userEmail || !approval?.id) return null;

  return saveApproval(approval);
}

// Salva uma sala. Salas são compartilhadas/global, então admin ou usuário salva na própria coleção.
// (Nota: salas podem ser globais, mas isoladas por usuário para customização pessoal.)
export function saveRoom(room) {
  const userRooms = loadCollection('rooms');
  const existingIndex = userRooms.findIndex((r) => r.id === room.id);

  if (existingIndex >= 0) {
    userRooms[existingIndex] = room;
  } else {
    userRooms.push(room);
  }

  return saveCollection('rooms', userRooms);
}

// Alias para compatibilidade
export const saveRooms = saveRoom;

// Salva uma notificação. Notificações são pessoais, então sempre na coleção do usuário logado.
// Admin não propaga notificações para outros usuários.
export function saveNotification(notification) {
  const userNotifications = loadCollection('notifications');
  const existingIndex = userNotifications.findIndex(
    (n) => n.id === notification.id,
  );

  if (existingIndex >= 0) {
    userNotifications[existingIndex] = notification;
  } else {
    userNotifications.push(notification);
  }

  return saveCollection('notifications', userNotifications);
}

// Global para seeds iniciais sem login.
// Utilizado como fallback quando o app precisa da lista de usuários e não
// existe um usuário autenticado ou a chave foi perdida.
export const getUsersGlobal = () => {
  const raw = localStorage.getItem('sira:users');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Se a chave existir e estiver corrompida, ignoramos e reconstruímos abaixo.
    }
  }

  // Inicializa o LocalStorage com o seed de login padrão.
  localStorage.setItem('sira:users', JSON.stringify(loginsData));
  return loginsData;
};
