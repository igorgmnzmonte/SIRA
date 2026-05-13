// Placeholder
export function renderUsers() {
  return document.createElement('div');
}

import { getPendingUsers, resolveUserRegistration } from '../data/store.js';
import { el, render, btn, toast } from '../utils/dom.js';

// EXPORT 1: Tela de Aprovar Novos Cadastros (US-23)
export function initApproveUsers(container) {
  function renderView() {
    const pendentes = getPendingUsers() || [];

    const header = el(
      'header',
      { style: 'margin-bottom: 2rem;' },
      el('h2', { style: 'margin-bottom: 0.5rem;' }, 'Aprovação de Cadastros'),
      el(
        'p',
        { style: 'color: #666;' },
        `${pendentes.length} usuário(s) aguardando liberação.`,
      ),
    );

    const listaCards = el(
      'div',
      {
        style:
          'display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));',
      },
      ...pendentes.map((usuario) => {
        return el(
          'div',
          {
            style:
              'border: 1px solid #dee2e6; padding: 1.5rem; border-radius: 8px; background: white;',
          },
          el('h3', { style: 'margin-top: 0;' }, usuario.name || 'Sem Nome'),
          el(
            'div',
            { style: 'margin-bottom: 1.5rem; color: #555;' },
            el(
              'p',
              { margin: '0.25rem 0' },
              el('strong', {}, 'Email: '),
              usuario.email,
            ),
          ),
          el(
            'div',
            { style: 'display: flex; gap: 0.5rem;' },
            btn('Aprovar', 'btn-primary', () => resolver(usuario, 'approved'), {
              style: 'flex: 1;',
            }),
            btn('Recusar', 'btn-danger', () => resolver(usuario, 'rejected'), {
              style: 'flex: 1;',
            }),
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
          el('h3', {}, 'Nenhum cadastro pendente!'),
        ),
      );
    } else {
      render(container, header, listaCards);
    }
  }

  function resolver(usuario, novoStatus) {
    if (
      confirm(
        `Deseja ${novoStatus === 'approved' ? 'aprovar' : 'recusar'} ${usuario.email}?`,
      )
    ) {
      resolveUserRegistration({ ...usuario, status: novoStatus });
      toast('Cadastro atualizado!', 'success');
      renderView();
    }
  }

  renderView();
}

// EXPORT 2: Se precisar do CRUD de Usuários (US-22), coloque a lógica aqui.
export function initUsers(container) {
  render(container, el('h2', {}, 'Gerenciamento de Usuários (CRUD)'));
  // O seu código original de CRUD de usuários da US-22 entra nesta função
}
