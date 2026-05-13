import { getPendingUsers, resolveUserRegistration } from '../data/store.js';
import { el, render, btn, toast } from '../utils/dom.js';

export function initAprovarCadastros(container) {
  function renderView() {
    // Busca os usuários pendentes de aprovação no store
    const pendentes = getPendingUsers() || [];

    const header = el(
      'header',
      { style: 'margin-bottom: 2rem;' },
      el('h2', { style: 'margin-bottom: 0.5rem;' }, 'Aprovação de Cadastros'),
      el(
        'p',
        { style: 'color: #666;' },
        `Há ${pendentes.length} novo(s) usuário(s) aguardando liberação de acesso.`,
      ),
    );

    // T-23.1 e T-23.2: Renderizar lista de usuários pendentes
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
              'border: 1px solid #dee2e6; padding: 1.5rem; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);',
          },
          el(
            'h3',
            { style: 'margin-top: 0; color: #333;' },
            usuario.name || 'Sem Nome',
          ),
          el(
            'div',
            { style: 'margin-bottom: 1.5rem; color: #555;' },
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Email: '),
              usuario.email,
            ),
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Cargo/Setor: '),
              usuario.role || 'N/A',
            ),
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Data da Solicitação: '),
              usuario.requestDate || 'N/A',
            ),
          ),

          // T-23.3: Botões de Aprovar e Recusar
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

    // Renderização condicional se não houver pendentes
    if (pendentes.length === 0) {
      render(
        container,
        header,
        el(
          'div',
          {
            style:
              'padding: 3rem; text-align: center; color: #888; background: #f8f9fa; border-radius: 8px;',
          },
          el('h3', {}, 'Nenhum cadastro pendente! 🚀'),
          el('p', {}, 'Todos os usuários foram verificados.'),
        ),
      );
    } else {
      render(container, header, listaCards);
    }
  }

  function resolver(usuario, novoStatus) {
    const acaoTexto = novoStatus === 'approved' ? 'APROVAR' : 'RECUSAR';

    if (
      confirm(
        `Tem certeza que deseja ${acaoTexto} o cadastro de ${usuario.email}?`,
      )
    ) {
      const payload = { ...usuario, status: novoStatus };

      // T-23.3 e T-23.4: Atualiza o status do usuário no store
      resolveUserRegistration(payload);

      // Feedback visual
      toast(
        `Cadastro ${novoStatus === 'approved' ? 'aprovado' : 'recusado'} com sucesso!`,
        novoStatus === 'approved' ? 'success' : 'info',
      );

      // Recarrega a view
      renderView();
    }
  }

  renderView();
}
