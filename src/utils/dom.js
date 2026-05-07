// src/utils/dom.js
// ─────────────────────────────────────────────────────────────
// Utilitários para manipulação do DOM (sem framework)
// Criação dinâmica de componentes via createElement / appendChild
// ─────────────────────────────────────────────────────────────

/**
 * Cria um elemento com atributos e filhos.
 * @param {string}           tag
 * @param {Object}           [attrs]
 * @param {...(Node|string)} children
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);

  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') {
      node.className = v;
    } else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(node.style, v);
    } else {
      node.setAttribute(k, v);
    }
  });

  children.forEach((child) => {
    if (child == null) return;
    node.appendChild(
      typeof child === 'string' || typeof child === 'number'
        ? document.createTextNode(child)
        : child,
    );
  });

  return node;
}

/**
 * Esvazia um elemento e injeta novo conteúdo (Node ou string).
 * @param {HTMLElement} container
 * @param {...(Node|string)} nodes
 */
export function render(container, ...nodes) {
  container.innerHTML = '';
  nodes.forEach((n) => {
    if (n == null) return;
    container.appendChild(
      typeof n === 'string' || typeof n === 'number'
        ? document.createTextNode(n)
        : n,
    );
  });
}

/**
 * Cria um <span> de badge.
 * @param {string} text
 * @param {string} cssClass
 * @returns {HTMLElement}
 */
export function badge(text, cssClass) {
  return el('span', { class: `badge ${cssClass}` }, text);
}

/**
 * Cria um botão.
 * @param {string}   text
 * @param {string}   cssClass
 * @param {Function} onClick
 * @returns {HTMLElement}
 */
export function btn(text, cssClass, onClick) {
  return el('button', { class: `btn ${cssClass}`, onClick }, text);
}

/**
 * Exibe um toast de feedback.
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
export function toast(message, type = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = el('div', { class: 'toast-container' });
    document.body.appendChild(container);
  }
  const t = el('div', { class: `toast ${type}` }, message);
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/**
 * Confirma uma ação com dialog nativo.
 * @param {string}   message
 * @param {Function} onConfirm
 */
export function confirm(message, onConfirm) {
  if (window.confirm(message)) onConfirm();
}

/**
 * Cria uma linha de tabela (<tr>) a partir de células.
 * @param {Array<Node|string>} cells
 * @returns {HTMLElement}
 */
export function tableRow(cells) {
  const tr = document.createElement('tr');
  cells.forEach((cell) => {
    const td = document.createElement('td');
    if (cell instanceof Node) td.appendChild(cell);
    else td.textContent = cell;
    tr.appendChild(td);
  });
  return tr;
}
