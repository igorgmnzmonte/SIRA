import { getApprovals, resolveApproval } from '../data/store.js';
import { el, render, btn, toast } from '../utils/dom.js';

export function initAprovacoes(container) {
  function renderView() {
    // Busca todas as aprovações e filtra apenas as que estão pendentes
    const todasAprovacoes = getApprovals() || [];
    const pendentes = todasAprovacoes.filter((a) => a.status === 'pending');

    const header = el(
      'header',
      { style: 'margin-bottom: 2rem;' },
      el('h2', { style: 'margin-bottom: 0.5rem;' }, 'Aprovações Pendentes'),
      el(
        'p',
        { style: 'color: #666;' },
        `Você tem ${pendentes.length} solicitação(ões) aguardando resposta.`,
      ),
    );

    // T-19.1: Renderizar cards de aprovação
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
              'border: 1px solid #dee2e6; padding: 1.5rem; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);',
          },
          el(
            'h3',
            { style: 'margin-top: 0; color: #333;' },
            `Reserva: ${aprovacao.roomName || 'Sala não especificada'}`,
          ),
          el(
            'div',
            { style: 'margin-bottom: 1.5rem; color: #555;' },
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Solicitante: '),
              aprovacao.userEmail,
            ),
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Data: '),
              aprovacao.date || 'N/A',
            ),
            el(
              'p',
              { style: 'margin: 0.25rem 0;' },
              el('strong', {}, 'Horário: '),
              aprovacao.time || 'N/A',
            ),
          ),

          // T-20.1: Resolução cruzada (Botões de ação)
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

    // Renderização condicional: Tela vazia ou grid de cards
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
          el('h3', {}, 'Tudo limpo! 🎉'),
          el('p', {}, 'Nenhuma aprovação pendente no momento.'),
        ),
      );
    } else {
      render(container, header, listaCards);
    }
  }

  function resolver(aprovacao, novoStatus) {
    const acaoTexto = novoStatus === 'approved' ? 'APROVAR' : 'RECUSAR';

    if (
      confirm(
        `Tem certeza que deseja ${acaoTexto} esta solicitação de ${aprovacao.userEmail}?`,
      )
    ) {
      // Cria um novo objeto com o status atualizado
      const payload = { ...aprovacao, status: novoStatus };

      // T-20.1: Chama a função do store que atualiza a reserva e notifica o usuário
      resolveApproval(payload);

      // T-20.3: Confirmação com toast
      toast(
        `Solicitação ${novoStatus === 'approved' ? 'aprovada' : 'recusada'} com sucesso!`,
        novoStatus === 'approved' ? 'success' : 'info',
      );

      // Recarrega a tela para o card sumir da lista de pendentes
      renderView();
    }
  }

  renderView();
}
