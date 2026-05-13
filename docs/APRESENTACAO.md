# Roteiro de apresentação — SIRA

Guia prático para a apresentação do produto + Q&A técnico (duração-alvo: **15–20 min de demo + 5–10 min de perguntas**).

> **Audiência**: professor avaliador e colegas das disciplinas **PWEB2** e **Engenharia de Requisitos de Software**.
> **Tom**: apresentar o produto **primeiro**, justificar tecnologia **depois**. Evitar mergulhar em código antes de mostrar o que o sistema faz.

---

## 0. Antes de começar (checklist 5 min antes da apresentação)

- [ ] App carregando em <https://gabemarques-intetsu.github.io/SIRA/> (com HTTPS, abrir uma vez para "aquecer" o GitHub Pages).
- [ ] Repo aberto em <https://github.com/GabeMarques-Intetsu/SIRA> em outra aba (lateral para mostrar PRs/release).
- [ ] LocalStorage **limpo** no navegador da demo (DevTools → Application → Clear storage) — começa do zero.
- [ ] Resolução do monitor confortável para projeção: **1366×768 mínimo**, fonte do navegador em 90–100%.
- [ ] DevTools fechado durante a demo do produto; aberto **só** na hora do Q&A técnico.
- [ ] PDF [`SIRA-Avaliacao-Criterios-Tecnicos.pdf`](reports/sprint-1/SIRA-Avaliacao-Criterios-Tecnicos.pdf) aberto em PDF reader para usar como referência se a banca pedir.
- [ ] Tema do SO **claro** no início (para mostrar o toggle dark mode depois com impacto visual).
- [ ] Áudio mudo, notificações silenciadas no SO.

---

## 1. Abertura (1 min)

> _"Boa tarde. Somos a equipe do **SIRA — Sistema de Reserva de Salas e Equipamentos**, projeto integrado das disciplinas de Programação para Web 2 e Engenharia de Requisitos. O SIRA resolve uma dor concreta levantada em entrevista com os coordenadores Diego Pessoa e Paulo Ditarso: **falta de sincronização entre SUAP e HIFPB na reserva de salas**, que hoje gera conflito, retrabalho e e-mails atravessados. Vou mostrar a aplicação rodando em produção, e depois a gente abre para perguntas técnicas."_

**Slide mental:**

- **Nome**: SIRA · Sistema de Reserva de Salas e Equipamentos
- **Stack** (mostre a stack na sidebar ou na primeira tela): Vite 8 + Vanilla JS (ESM) + LocalStorage particionado por usuário
- **URL pública**: <https://gabemarques-intetsu.github.io/SIRA/>
- **Versão**: v1.0.x publicada (link da release)
- **Time**: 5 pessoas, 25 user stories, 24 features sob 13 épicos.

---

## 2. Tour pelo produto (8–10 min)

> Sempre **narre o que você está fazendo** enquanto clica. Não fique mudo. Use a fórmula **"como [perfil], faço [ação] para [valor]"**.

### 2.1. Cadastro auto-serviço (US-04) · 1 min

1. Mostre a tela de **Login** com tema claro.
2. Clique em **"Solicitar cadastro"**.
3. Preencha: nome = `Demo Professor`, e-mail = `demo@ifpb.edu.br`, perfil = Professor.
4. Clique em **Enviar solicitação**.
5. Confirme o alerta e volte ao login.

> _"O cadastro fica numa fila pendente até o admin aprovar. Vamos voltar nele daqui a pouco."_

### 2.2. Login como administrador (US-03/US-05/US-08/US-09) · 1 min

1. E-mail: `admin@ifpb.edu.br`. Aperte **Enter** (use o keydown).
2. **Pause na Sidebar** — mostre que ela tem **3 seções** (Visão Geral, Reservas, Administração) e que **badges numéricos** aparecem ao lado de "Aprovações" e "Notificações".
3. Clique no **toggle dark mode** no rodapé da sidebar. Mostre que a tela inteira inverte.
4. Aperte **F5**. Mostre que o tema escuro **persiste** (US-09 + T-09.3).
5. _(opcional)_ Mostre o **drawer mobile**: aperte F12 → toggle device toolbar → escolha iPhone 12. A sidebar vira drawer, e há um botão hambúrguer na topbar (US-08).

### 2.3. Calendário semanal (US-13) · 1 min

1. Clique em **Calendário**.
2. Mostre a grade **7 dias × 12 horas** (07:00 às 18:00).
3. Aponte para a navegação **semana anterior / próxima**.

> _"Esta é a home do professor: vê de relance onde tem conflito visual."_

### 2.4. Nova Reserva — fluxo principal (US-14/15) · 2 min

1. Clique em **Nova Reserva**.
2. Preencha data, horário inicial/final, escolha **"Sim"** em recorrência → mostre que os 7 botões de dia da semana aparecem.
3. Clique em **Seg** e **Qua** (toggle visual com cor de destaque).
4. Tipo: `Sala`. Finalidade: `Aula Magna`.
5. Clique em **Buscar Salas**.
6. Mostre as opções retornadas (já filtradas por anti-conflito de horário).
7. Clique numa sala → abre modal com detalhes.
8. Clique em **Reservar** → toast de sucesso → redireciona para "Minhas Reservas".

> _"Repare: a busca exclui as salas que já têm reserva no intervalo solicitado. É o filtro de overlap, feito com `Array.filter` puro."_

### 2.5. Minhas Reservas (US-16/17/18) · 1 min

1. A reserva recém-criada aparece com status **Pendente**.
2. Mostre as **filter chips** (Todas / Pendentes / Aprovadas / Recusadas).
3. Digite algo na **busca textual** — a lista filtra em tempo real (input listener).
4. Clique em **Editar** numa reserva → modal de edição (horário + finalidade).
5. Clique em **Cancelar** → confirmação → reserva some imutavelmente da lista.
6. Clique em **Exportar CSV** → arquivo `.csv` baixa.

### 2.6. Aprovações (US-19/20) — visão admin · 1 min

1. Volte para **Aprovações** na sidebar. O badge mostra `1` pendente.
2. Mostre o **card** da solicitação (sala, finalidade, solicitante, data/hora).
3. Clique em **✓ Aprovar**.
4. Toast de sucesso, card desaparece, badge zera.

> _"O solicitante recebe uma notificação automaticamente — vou logar como ele em seguida pra mostrar."_

### 2.7. Gestão de Salas e Usuários (US-21/22/23) · 1 min

1. **Salas e Espaços**: mostre o grid de cards, filter chips por status, e o card "Adicionar sala" no fim do grid.
2. Clique em **Adicionar sala** → modal com nome, tipo, capacidade, bloco e checkboxes de recursos. Cancele.
3. **Usuários**: mostre a tabela. Clique em **Solicitações de Cadastro**. O cadastro feito no passo 2.1 aparece. Clique em **Aprovar**.

### 2.8. Notificações e Dashboard (US-12/24) · 1 min

1. **Notificações**: mostre a lista cronológica e o botão **Marcar todas como lidas**.
2. **Dashboard**: aponte para os **4 KPIs em tempo real** (total de salas, disponíveis, pendentes, ocupação%).
3. _Frase técnica_: "Essa porcentagem de ocupação vem de um `Array.reduce` no `fp.js` — função pura, testável."

### 2.9. Volta como professor (fechamento de loop) · 30 s

1. Sair (botão Sair no rodapé da sidebar).
2. Logar como o cadastro recém-aprovado (`demo@ifpb.edu.br`).
3. Mostre que a sidebar agora só tem **Reservas / Calendário / Nova Reserva** — o middleware de role esconde as áreas de admin.
4. Vá em **Notificações**: a aprovação que o admin fez aparece como notificação. Loop completo.

---

## 3. Como entregamos (3 min)

Não fale de código ainda — fale de **processo**.

### 3.1. Stack e decisão arquitetural

> _"Por restrição da disciplina, usamos Vite com template vanilla. Estendemos essa restrição também para bibliotecas: **zero dependências de runtime**. O bundle final tem **12 KB de JS gzipped**. Não tem React, não tem Lodash, não tem date-fns. O DOM é construído com um helper `el()` que reimplementa `createElement` de forma declarativa."_

| Camada       | Tecnologia                            |
| ------------ | ------------------------------------- |
| Build        | Vite ^8.0.10                          |
| Linguagem    | JavaScript (ESM)                      |
| Persistência | LocalStorage particionado por usuário |
| Roteamento   | History API (sem biblioteca)          |
| CI/CD        | GitHub Actions → GitHub Pages         |

### 3.2. Workflow de time

> _"5 pessoas, 1 branch develop, releases tageadas (v1.0.0, v1.0.1, v1.0.2). Cada US virou um conjunto de PRs com escopo atômico, revisão cruzada e CI rodando `check-format` + `build` em cada push. Tudo merged via PR — `main` é protegida e só recebe via develop."_

- **PRs mergeados na sprint 1**: mais de 50.
- **Conventional Commits** em português.
- **Hooks de Husky** rodando ESLint + Prettier no pre-commit (lint-staged).

### 3.3. Engenharia de Requisitos

> _"Do lado de Engenharia de Requisitos, partimos das entrevistas com Diego e Paulo, derivamos **13 épicos**, decompusemos em **24 features** e **25 user stories** com critérios de aceitação. O documento de planejamento está em [`docs/reports/sprint-1/SIRA-Consolidado-Epics-Features-Membros.pdf`](reports/sprint-1/SIRA-Consolidado-Epics-Features-Membros.pdf)."_

---

## 4. Tour rápido pelo repositório (1 min)

Abra a aba do GitHub:

1. **README.md** com tabela de US por bloco/membro (100% verde).
2. **Releases**: mostre v1.0.0, v1.0.1, v1.0.2.
3. **Actions**: mostre o workflow `Deploy` verde, automaticamente disparado pelo release.
4. **PRs (Closed)**: filtre por algum PR de feature (ex: #134 sidebar, #143 persistência, #152 nova reserva) — destaque que cada PR tem descrição, test plan e está vinculado à US correspondente.

---

## 5. Q&A técnico (5–10 min)

Mantenha o PDF `SIRA-Avaliacao-Criterios-Tecnicos.pdf` aberto — ele tem trechos de código prontos para cada tópico. Abaixo, as perguntas mais prováveis e roteiros de resposta curtas.

### 5.1. "Onde vocês usam map / filter / reduce?"

- **Reduce**: `src/utils/fp.js` linha 55, função `computeStats` que agrega salas em `{total, free, busy}` para o Dashboard.
- **Filter**: `filterByText`, `filterByStatus`, `filterRoomsByStatus` (mesma fp.js), além de `rooms.filter((r) => r.type === type)` em `novaReserva.js` para anti-conflito.
- **Map**: a grade do calendário é construída com **map encadeado** em `calendar.js` (`DAYS.map(d => HOURS.map(h => ...))`). Quase toda renderização de lista é `array.map(item => el(...))`.

### 5.2. "Por que ESM e não CommonJS?"

- Padrão da spec ES2015+ e suportado nativamente por navegadores modernos sem transpilação.
- O Vite consome ESM nativamente; o tree-shaking dele depende de exports nomeados estáticos (que é o que usamos — zero `default exports`).
- Permite separação clara entre 5 camadas: `entry` (main.js), `components`, `modules` (uma página por arquivo), `data` (store), `utils`.
- `package.json` declara `"type": "module"` — não dá pra cair em CommonJS por engano.

### 5.3. "Como funcionam os dados? LocalStorage não some?"

- A chave canônica é `sira_db/<email>/<colecao>.json` — **particiona por usuário** logado.
- Reservas de A não vazam para B. Funções únicas de I/O: `loadCollection` / `saveCollection` em `store.js`.
- Quando admin loga, getters como `getReservations` chamam `consolidateCollection`, que percorre todos os usuários e concatena os arrays com spread.
- Sobre persistência: o LocalStorage do navegador é **suficiente para o escopo acadêmico**. Para produção real, esta camada seria substituída por uma API REST mantendo a mesma interface — `loadCollection` e `saveCollection` ficariam isoladas em um único arquivo. Não há mistura de I/O no resto do código.

### 5.4. "Como vocês fazem componentes sem framework?"

- Função `el(tag, attrs, ...children)` em `src/utils/dom.js`. É praticamente um `React.createElement` minimalista. Aceita props como `class`, `style: { color: 'red' }`, `onClick: () => ...`, e filhos variádicos (string vira `TextNode`).
- Os componentes (sidebar, modal) e os módulos de página (`dashboard.js`, `calendar.js`, etc.) compõem chamadas a `el()` para montar a árvore antes de inserir no DOM.
- Pra atualizar uma lista (ex: depois de adicionar uma sala), chamamos uma função `refresh<X>()` que faz `render(container, ...newChildren)` — `render` apenas zera `container.innerHTML` e re-`appendChild`. Sem virtual DOM, sem diff: o re-render é O(n) sobre a lista atual, e n é pequeno (dezenas).

### 5.5. "Como os eventos são tratados?"

Mais de 44 listeners no projeto. Quatro padrões:

1. **Via prop `onClick` em `el()`**: maioria dos botões. O `el()` detecta `on<Event>` e chama `addEventListener`.
2. **Via `addEventListener` direto**: para `input` (busca textual em tempo real) e `change` (radios de recorrência).
3. **Global**: `popstate` em `window` (botões voltar/avançar do navegador → roteador) e listener de `Escape` em `document` (fecha qualquer modal aberto — `initModalListeners` em `modal.js`).
4. **MutationObserver**: `main.js` observa a `topbar` da página atual e injeta o botão hambúrguer assim que ela é renderizada — necessário porque cada `navigate()` recria a topbar.

### 5.6. "Como vocês configuraram o Vite?"

- O `vite.config.js` tem **5 linhas úteis**: só configura `base` condicional para que o build funcione no GitHub Pages (`/SIRA/` em prod, `/` em dev).
- Em desenvolvimento, `npm run dev` sobe HMR em `localhost:5173`. Build em produção: `vite build` gera `dist/` com hash em filenames para cache busting.
- O CI roda `npm run check-format` e `npm run build` em todo PR. O `deploy.yml` faz a mesma build com `GITHUB_PAGES=true` quando um GitHub Release é publicado.

### 5.7. "Vocês usaram alguma biblioteca?"

- **Nenhuma de runtime.** `dependencies: {}` no `package.json`. Mostre o arquivo se pedirem.
- **`devDependencies`** (que **não vão para o bundle**): Vite (build), ESLint + Prettier (qualidade), Husky + lint-staged (hooks de commit).
- Justificativa: a disciplina pediu vanilla; estendemos para "vanilla profundo" para exercitar os primitivos.

### 5.8. "Como vocês trabalharam em time?"

- 5 pessoas, 5 blocos de responsabilidade independentes mapeados no PDF de sequência. Cada bloco saiu para PR atômico contra `develop`.
- Caminho crítico: Igor (persistência) → Ian (shell + modais) → Gabriel (logout + dark mode) → Ian (calendário) → José (reservas) → Pedro (admin) → Igor (dashboard + notif).
- CI bloqueia merges com check-format ou build falhando. Quem quebra, conserta.

### 5.9. "Como vocês fariam para colocar isso em produção real?"

Resposta franca, com plano:

1. Substituir `store.js` por chamadas `fetch` a uma API REST (Node/Express, FastAPI ou similar). A interface `loadCollection/saveCollection` já está abstraída.
2. Trocar o LocalStorage por um banco (Postgres ou Mongo).
3. Substituir o login simples por OAuth/SAML integrado com SUAP.
4. Adicionar testes automatizados (Vitest), monitoramento (Sentry), e migrar UI para React/Next na sprint 2 (já planejado).
5. Container Docker e deploy num PaaS (Render, Railway, Fly.io) em vez de GitHub Pages.

### 5.10. "Qual foi o maior obstáculo técnico?"

- A camada de persistência cross-user: como o admin vê reservas de todos os professores sem violar isolamento por chave? Solução: getters detectam `isAdmin()` e fazem `consolidateCollection` somando os arrays.
- O modal centralizado: queríamos um único listener global para Escape (em vez de N listeners por modal). Solução: `initModalListeners` registra **um** listener em `document` e usa event delegation por `data-modal-id`.
- O roteamento sem framework: precisava casar URLs com renderizadores e ainda interceptar `popstate`. Solução: `PAGE_RENDERERS` como dispatcher dict + `navigate()` que faz `pushState` + render + atualização da sidebar ativa.

---

## 6. Encerramento (30 s)

> _"O código está aberto no GitHub, a release v1.0.x está deployada, e a documentação técnica (consolidado de épicos/features, sequência ótima, e o documento de avaliação dos 7 critérios da PWEB2) está toda em `docs/reports/sprint-1/`. Obrigado, fiquem à vontade para perguntar."_

Aponte para os 3 links na tela:

- **App**: <https://gabemarques-intetsu.github.io/SIRA/>
- **Repo**: <https://github.com/GabeMarques-Intetsu/SIRA>
- **Release**: <https://github.com/GabeMarques-Intetsu/SIRA/releases>

---

## Apêndice — perguntas-armadilha (preparação extra)

> Coisas que **só** caem se a banca for muito técnica.

### "Por que o sidebar.js usa dynamic import para o logout?"

Resposta sincera: para evitar **ciclo de import**. `sidebar.js` é importado por `main.js`, que importa `store.js`, que (indiretamente) precisa do estado da sidebar. O `import('../data/store.js')` dentro do `onClick` quebra o ciclo no momento da chamada.

### "O store.js tem warning de import dinâmico + estático. É bug?"

Não — é warning informativo do Rollup. O dynamic import na sidebar é proposital (ver acima). O bundle final é o mesmo do estático.

### "Como vocês garantem que duas pessoas não reservem a mesma sala ao mesmo tempo?"

Na busca, `searchRooms` filtra salas que tenham overlap no intervalo solicitado. Na hora de salvar, `performReservation` **re-checa** o overlap antes do `saveCollection`. Como tudo é síncrono num único cliente (sem concorrência real), isso é suficiente para o LocalStorage. Em produção real com API, seria um índice único `(roomId, dateStart-dateEnd)` no banco.

### "E se eu apagar o LocalStorage no meio da demo?"

A app cai de volta para o seed (`src/data/seed.json` para rooms/reservations/notifications/approvals) e o seed do admin (`logins.json`). Login com `admin@ifpb.edu.br` continua funcionando.

### "Por que `let` em vez de `const` em alguns lugares?"

`CURRENT_USER` em `store.js` é `let` porque muda quando o usuário loga/desloga. Os filter states locais nos módulos (`activeFilter`, `searchQuery`) também são `let` porque mudam. Todo o resto é `const`.

### "Vocês têm testes automatizados?"

**Não nesta sprint** — gate só com `check-format` + `build`. A próxima sprint inclui Vitest, começando pelos helpers puros de `fp.js` (que são triviais de testar). Falar isso aberto é melhor que inventar uma justificativa.

---

## Apêndice — onde estão os arquivos citados

| Documento                                         | Caminho                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| Backlog consolidado (épicos / features / membros) | `docs/reports/sprint-1/SIRA-Consolidado-Epics-Features-Membros.pdf` |
| Sequência de implementação                        | `docs/reports/sprint-1/sequencia_us.pdf`                            |
| Resposta aos 7 critérios PWEB2                    | `docs/reports/sprint-1/SIRA-Avaliacao-Criterios-Tecnicos.pdf`       |
| Tarefas individuais por membro                    | `docs/team-tasks/sprint-1/SIRA-tarefas-0X-<nome>.pdf`               |
| Este roteiro                                      | `docs/APRESENTACAO.md`                                              |
