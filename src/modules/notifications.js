// src/modules/notifications.js
// ─────────────────────────────────────────────────────────────
// Módulo: Notificações do Usuário
// Exibição e gerenciamento de alertas e interações
// ─────────────────────────────────────────────────────────────

import {
  getNotifications,
  saveNotification,
  saveCollection,
} from '../data/store.js';
import { el } from '../utils/dom.js';

/**
 * Renderiza a tela de notificações do usuário.
 * @returns {HTMLElement}
 */
export function renderNotifications() {
  // Passo 1: Resgatar notificações
  let notifications = getNotifications();

  // Passo 2: Verificar se está vazia
  if (notifications.length === 0) {
    return el(
      'div',
      { class: 'notifications-container' },
      el('h2', {}, 'Notificações'),
      el(
        'p',
        { style: { textAlign: 'center', color: 'var(--text-tertiary)' } },
        'Você não tem notificações',
      ),
    );
  }

  // Ordenar por data (mais novas no topo)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // Passo 2: Renderizar a lista com .map()
  const notificationItems = sortedNotifications.map((notification) =>
    createNotificationItem(notification),
  );

  return el(
    'div',
    { class: 'notifications-container' },
    el('h2', {}, 'Notificações'),
    el('div', { class: 'notif-list' }, ...notificationItems),
  );
}

/**
 * Cria um elemento de notificação individual.
 * @param {Object} notification
 * @returns {HTMLElement}
 */
function createNotificationItem(notification) {
  const notificationDiv = el(
    'div',
    { class: 'notif-item' },
    el('div', { class: `notif-dot${notification.read ? ' read' : ''}` }),
    el(
      'div',
      { style: { flex: 1 } },
      el(
        'div',
        { class: 'notif-text' },
        notification.message || 'Sem mensagem',
      ),
      el('div', { class: 'notif-time' }, formatDate(notification.createdAt)),
    ),
  );

  // Adicionar listener para "Marcar como lida"
  notificationDiv.addEventListener('click', () => {
    handleMarkAsRead(notification.id);
  });

  return notificationDiv;
}

/**
 * Formata a data para exibição amigável.
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  if (!dateString) return 'Data desconhecida';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR');
}

/**
 * Marca uma notificação como lida.
 * Passo 3: Ação de "Marcar como lida" com imutabilidade
 * Passo 4: Persistir e atualizar
 * @param {string} notificationId
 */
function handleMarkAsRead(notificationId) {
  // Pegar o array de notificações atual
  let notifications = getNotifications();

  // Usar .map() para criar novo array com imutabilidade
  const updatedNotifications = notifications.map(
    (notif) =>
      notif.id === notificationId
        ? { ...notif, read: true } // Retornar cópia com read = true
        : notif, // Retornar como está
  );

  // Persistir com saveCollection
  saveCollection('notifications', updatedNotifications);

  // Re-renderizar a tela de notificações
  const container = document.querySelector('.notifications-container');
  if (container) {
    const updated = renderNotifications();
    container.replaceWith(updated);
  }
}
