// src/components/modal.js
// ─────────────────────────────────────────────────────────────
// Gerenciamento de modais: abertura, fechamento, criação dinâmica
// ─────────────────────────────────────────────────────────────

import { el } from '../utils/dom.js';

/**
 * Abre um modal pelo ID.
 * @param {string} id
 */
export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

/**
 * Fecha um modal pelo ID.
 * @param {string} id
 */
export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

/**
 * Cria e injeta um modal genérico no body.
 * @param {Object} opts
 * @param {string} opts.id
 * @param {string} opts.title
 * @param {Node}   opts.body
 * @param {Array<{label:string, primary?:boolean, onClick:Function}>} opts.actions
 * @returns {HTMLElement} - referência ao modal-bg
 */
export function createModal({ id, title, body, actions }) {
  // Remove se já existir
  document.getElementById(id)?.remove();

  const footer = el(
    'div',
    { class: 'modal-footer' },
    ...actions.map((a) =>
      el(
        'button',
        { class: `btn ${a.primary ? 'btn-primary' : ''}`, onClick: a.onClick },
        a.label,
      ),
    ),
  );

  const closeBtn = el(
    'button',
    { class: 'btn btn-icon', onClick: () => closeModal(id) },
    '✕',
  );

  const modal = el(
    'div',
    { class: 'modal' },
    el(
      'div',
      { class: 'modal-header' },
      el('span', { class: 'modal-title' }, title),
      closeBtn,
    ),
    body,
    footer,
  );

  const bg = el('div', { class: 'modal-bg', id });
  bg.appendChild(modal);
  document.body.appendChild(bg);

  // Fechar clicando fora
  bg.addEventListener('click', (e) => {
    if (e.target === bg) closeModal(id);
  });

  return bg;
}

/**
 * Inicializa listeners globais de modal (Escape key).
 */
export function initModalListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document
        .querySelectorAll('.modal-bg.open')
        .forEach((m) => m.classList.remove('open'));
    }
  });
}
