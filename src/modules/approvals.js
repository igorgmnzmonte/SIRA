// Placeholder
export function renderApprovals() {
  return document.createElement('div');
}

import { getApprovals, resolveApproval } from '../data/store.js';
import { el, render, btn, toast } from '../utils/dom.js';

export function initApprovals(container) {
  function renderView() {
    const pendentes = (getApprovals() || []).filter(
      (a) => a.status === 'pending',
    );

    const header = el(
      'header',
      { style: 'margin-bottom: 2rem;' },
      el('h2', { style: 'margin-bottom: 0.5rem;' }, 'Aprovações Pendentes'),
      el(
        'p',
        { style: 'color: #666;' },
        `Você tem ${pendentes.length} solicitação(ões) aguardando.`,
      ),
    );

    const listaCards = el(
      'div',
      {
        style:
          'display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));',
      },
      ...pendentes.map((aprovacao) => {
        return el(
          'div',
          {
            style:
              'border: 1px solid #dee2e6; padding: 1.5rem; border-radius: 8px; background: white;',
          },
          el(
            'h3',
            { style: 'margin-top: 0;' },
            `Reserva: ${aprovacao.roomName || 'Sala não especificada'}`,
          ),
          el(
            'div',
            { style: 'margin-bottom: 1.5rem; color: #555;' },
            el(
              'p',
              { margin: '0.25rem 0' },
              el('strong', {}, 'Solicitante: '),
              aprovacao.userEmail,
            ),
            el(
              'p',
              { margin: '0.25rem 0' },
              el('strong', {}, 'Data: '),
              aprovacao.date,
            ),
            el(
              'p',
              { margin: '0.25rem 0' },
              el('strong', {}, 'Horário: '),
              aprovacao.time,
            ),
          ),
          el(
            'div',
            { style: 'display: flex; gap: 0.5rem;' },
            btn(
              'Aprovar',
              'btn-primary',
              () => resolver(aprovacao, 'approved'),
              { style: 'flex: 1;' },
            ),
            btn(
              'Recusar',
              'btn-danger',
              () => resolver(aprovacao, 'rejected'),
              { style: 'flex: 1;' },
            ),
          ),
        );
      }),
    );

    if (pendentes.length === 0) {
      render(
        container,
        header,
        el(
          'div',
          { style: 'padding: 3rem; text-align: center; color: #888;' },
          el('h3', {}, 'Tudo limpo! 🎉'),
        ),
      );
    } else {
      render(container, header, listaCards);
    }
  }

  function resolver(aprovacao, novoStatus) {
    if (confirm(`Confirmar ação para ${aprovacao.userEmail}?`)) {
      resolveApproval({ ...aprovacao, status: novoStatus });
      toast(`Solicitação resolvida!`, 'success');
      renderView();
    }
  }

  renderView();
}
