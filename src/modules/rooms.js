// Placeholder
export function renderRooms() {
  return document.createElement('div');
}

import { getRooms, saveRoom, deleteRoom, generateId } from '../data/store.js';
import { el, render, btn, toast } from '../utils/dom.js';

export function initRooms(container) {
  let editandoId = null;

  function renderView() {
    const salas = getRooms() || [];

    const header = el(
      'header',
      { style: 'margin-bottom: 2rem;' },
      el('h2', { style: 'margin-bottom: 0.5rem;' }, 'Gerenciamento de Salas'),
      el(
        'p',
        { style: 'color: #666;' },
        'Adicione, edite ou remova as salas de reunião do sistema.',
      ),
    );

    const form = el(
      'form',
      {
        style:
          'background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #dee2e6; margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;',
        onsubmit: handleSubmit,
      },
      el('input', {
        type: 'text',
        id: 'sala-nome',
        placeholder: 'Nome da Sala',
        required: true,
        style: 'flex: 1; padding: 0.5rem;',
      }),
      el('input', {
        type: 'number',
        id: 'sala-capacidade',
        placeholder: 'Capacidade',
        required: true,
        min: '1',
        style: 'width: 150px; padding: 0.5rem;',
      }),
      el(
        'button',
        {
          type: 'submit',
          className: 'btn-primary',
          style: 'padding: 0.5rem 1.5rem;',
        },
        editandoId ? 'Atualizar Sala' : 'Nova Sala',
      ),
      editandoId ? btn('Cancelar', 'btn-secondary', cancelarEdicao) : '',
    );

    const lista = el(
      'div',
      {
        style:
          'display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));',
      },
      ...salas.map((sala) =>
        el(
          'div',
          {
            style:
              'border: 1px solid #dee2e6; padding: 1rem; border-radius: 8px; background: white;',
          },
          el('h3', { style: 'margin-top: 0;' }, sala.name),
          el(
            'p',
            { style: 'color: #555;' },
            `Capacidade: ${sala.capacity} pessoas`,
          ),
          el(
            'div',
            { style: 'display: flex; gap: 0.5rem; margin-top: 1rem;' },
            btn('Editar', 'btn-secondary', () => iniciarEdicao(sala), {
              style: 'flex: 1;',
            }),
            btn('Excluir', 'btn-danger', () => remover(sala.id), {
              style: 'flex: 1;',
            }),
          ),
        ),
      ),
    );

    render(container, header, form, lista);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nome = document.getElementById('sala-nome').value;
    const capacidade = document.getElementById('sala-capacidade').value;

    saveRoom({
      id: editandoId || generateId(),
      name: nome,
      capacity: parseInt(capacidade, 10),
      status: 'available',
    });

    toast(editandoId ? 'Sala atualizada!' : 'Sala criada!', 'success');
    editandoId = null;
    renderView();
  }

  function iniciarEdicao(sala) {
    editandoId = sala.id;
    renderView();
    setTimeout(() => {
      document.getElementById('sala-nome').value = sala.name;
      document.getElementById('sala-capacidade').value = sala.capacity;
    }, 0);
  }

  function cancelarEdicao(e) {
    e.preventDefault();
    editandoId = null;
    renderView();
  }

  function remover(id) {
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      deleteRoom(id);
      toast('Sala removida.', 'info');
      renderView();
    }
  }

  renderView();
}
