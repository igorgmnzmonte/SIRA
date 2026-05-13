# SIRA — Sistema de Reserva de Salas e Equipamentos

Aplicação web para gerenciar reservas de salas e equipamentos, desenvolvida
como projeto integrado das disciplinas:

- **PWEB2 — Programação para Web 2** (implementação da aplicação)
- **Engenharia de Requisitos de Software** (levantamento, especificação e
  validação dos requisitos)

> Status: **sprint 1 concluída — 25 / 25 user stories entregues**.
> A primeira sprint é em **JavaScript puro (ES Modules)** servido pelo Vite;
> a segunda sprint migra a camada de apresentação para **React**.

---

## 📦 Stack

| Camada               | Ferramenta                                                                                             | Versão               |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------------------- |
| Bundler / dev server | [Vite](https://vitejs.dev/)                                                                            | `^8.0.10`            |
| Linguagem (sprint 1) | JavaScript (ES Modules)                                                                                | ES Latest            |
| UI (sprint 2)        | React                                                                                                  | _previsto_           |
| Lint                 | [ESLint](https://eslint.org/) (flat config)                                                            | `^9.39.4`            |
| Formatação           | [Prettier](https://prettier.io/)                                                                       | `^3.8.3`             |
| Git hooks            | [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | `^9.1.7` / `^15.5.2` |
| CI / Deploy          | GitHub Actions + GitHub Pages                                                                          | —                    |

---

## ✅ Pré-requisitos

- **Node.js 24 LTS** — fixado em [`.nvmrc`](.nvmrc). O Vite 8 e o Rolldown
  exigem `^20.19.0 || >=22.12.0`; o projeto adota a LTS atual (24.x) para
  ficar dentro do range suportado e evitar avisos de `EBADENGINE`.
- **npm 11+** (já vem bundled com o Node 24).
- Recomendado: [`nvm`](https://github.com/nvm-sh/nvm) para alternar versões.

```bash
nvm install        # instala a versão do .nvmrc
nvm use            # ativa a versão correta
```

---

## 🚀 Como rodar localmente

```bash
# 1. Instale as dependências (cria node_modules/ e configura o Husky)
npm install

# 2. Suba o dev server com HMR
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

> O script `prepare` do `package.json` roda `husky` automaticamente após o
> `npm install`, registrando os hooks de pre-commit.

---

## 🛠️ Scripts disponíveis

| Script                 | O que faz                                                               |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento do Vite com HMR                    |
| `npm run build`        | Gera o build de produção em `dist/`                                     |
| `npm run preview`      | Serve localmente o build de produção (útil para testar antes do deploy) |
| `npm run lint`         | Roda o ESLint em `src/` aplicando correções automáticas (`--fix`)       |
| `npm run lint:check`   | Roda o ESLint sem corrigir (modo verificação para CI)                   |
| `npm run format`       | Formata todos os arquivos com Prettier                                  |
| `npm run check-format` | Verifica se os arquivos estão formatados (usado pelo CI)                |
| `npm run pre-commit`   | Pipeline manual: `lint` + `format`                                      |
| `npm run prepare`      | Instala os hooks do Husky (executado pelo npm após o `install`)         |

---

## 📁 Estrutura do projeto

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml             # Valida formatação e build em PRs e push em develop
│       └── deploy.yml         # Publica no GitHub Pages quando uma release é publicada
├── .husky/
│   └── pre-commit             # Dispara `npx lint-staged` antes de cada commit
├── docs/
│   ├── reports/sprint-1/      # Relatórios consolidados da sprint (épicos, features, sequência ótima)
│   └── team-tasks/sprint-1/   # PDFs individuais das tarefas de cada membro do time
├── public/
│   ├── icons/                 # Ícones SVG usados pela aplicação
│   └── screenshots/           # Capturas de tela do produto (`Preview-temp.png` etc.)
├── src/                       # Código-fonte da aplicação
│   ├── components/
│   │   ├── modal.js           # API de modais (createModal/openModal/closeModal) + listener global Esc
│   │   └── sidebar.js         # Sidebar contextual com badges, userPill, logout e toggle de tema
│   ├── data/
│   │   ├── logins.json        # Seed do usuário admin
│   │   ├── seed.json          # Seeds vazios para rooms / reservations / notifications / approvals
│   │   └── store.js           # Camada de dados: AUTH + persistência por usuário + aprovações cross-user
│   ├── modules/
│   │   ├── calendar.js        # Grade semanal 7d × 12h com eventos por status (US-13)
│   │   └── novaReserva.js     # Formulário de busca de salas + criação de reserva com anti-conflito (US-14/15)
│   ├── utils/
│   │   ├── dom.js             # Factories: el, render, btn, badge, tableRow, toast, confirm
│   │   └── fp.js              # Helpers funcionais: filterByText, computeStats (reduce), initials, statusBadge, etc.
│   ├── auth.css               # Estilos das telas de login e cadastro
│   ├── home.css               # Estilos da home, sidebar e calendário (grid responsivo)
│   ├── main.js                # Entry point — bootstrap, autenticação inline, roteador e drawer mobile
│   └── style.css              # Estilos globais com CSS Variables e suporte a dark mode
├── .nvmrc                     # Versão do Node (24 LTS)
├── .prettierrc                # Regras do Prettier (semi, single quote, trailing comma)
├── .prettierignore            # Arquivos ignorados pelo Prettier
├── eslint.config.js           # ESLint flat config + integração com Prettier
├── index.html                 # Entry point HTML do Vite (carrega /src/main.js como módulo)
├── vite.config.js             # Configuração do Vite (base condicional via env GITHUB_PAGES)
├── package.json
└── package-lock.json
```

> **Notas de domínio:**
>
> - `src/components/` contém os blocos visuais reutilizáveis (sidebar, modal).
> - `src/modules/` contém uma página por arquivo — cada `renderX` é registrado em
>   `PAGE_RENDERERS` no `main.js` e roteado por URL via `pushState` + `popstate`.
> - `src/data/store.js` é a única fonte de verdade para LocalStorage, com
>   particionamento por e-mail (`sira_db/<email>/<colecao>.json`) e consolidação
>   automática quando o usuário logado é admin.

---

## 🔄 Pipeline de qualidade

O fluxo de qualidade local + CI funciona assim:

1. **Antes do commit (local):** o hook `pre-commit` do Husky chama
   `npx lint-staged`, que roda ESLint + Prettier **apenas nos arquivos
   alterados** — segundo a configuração `lint-staged` do `package.json`:
   - `src/**/*.js` → `eslint --fix` + `prettier --write`
   - `src/**/*.{css,html,json}` → `prettier --write`
   - `*.{js,json,md,yml}` (raiz) → `prettier --write`
2. **No CI (PRs e push em `develop`):** o workflow [`ci.yml`](.github/workflows/ci.yml)
   roda `npm ci`, `npm run check-format` e `npm run build`.
3. **Em release:** o workflow [`deploy.yml`](.github/workflows/deploy.yml)
   buildeia e publica em **GitHub Pages**.

---

## 🚢 Deploy

O deploy é **manual via GitHub Releases**: ao publicar uma release, o
workflow `deploy.yml` roda o build e publica a pasta `dist/` no GitHub
Pages.

- URL pública: <https://gabemarques-intetsu.github.io/SIRA/>
- O `vite.config.js` aplica o `base` apenas quando `GITHUB_PAGES=true`
  (variável injetada pelo step _Build_ do `deploy.yml`). Em
  desenvolvimento e `npm run preview` locais, a `base` é `/` — sem
  subpath, sem precisar lembrar de URL especial.

> **Pré-condição:** habilite **GitHub Pages → Source: GitHub Actions** nas
> configurações do repositório.

Para disparar um deploy fora de release (ex.: hotfix manual), use
**Actions → Deploy → Run workflow** (`workflow_dispatch`).

---

## 🌳 Fluxo de Git

Modelo simplificado, com proteções na `main`:

| Branch      | Papel                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| `main`      | Branch protegida. Recebe **apenas** merges via PR de `develop`. Origem das releases. |
| `develop`   | Branch de integração contínua. CI roda em todo push.                                 |
| `feature/*` | Branches de desenvolvimento. Saem de `develop` e voltam via PR para `develop`.       |

**Convenção de commits:** mensagens curtas em português, com prefixos
estilo Conventional Commits — `feat`, `fix`, `chore`, `ci`, `docs`,
`refactor`, `test`.

---

## 🗺️ Roadmap da entrega

O backlog do SIRA foi quebrado em **25 user stories** distribuídas em
**13 épicos** e divididas entre os 5 membros do time. A sequência de
implementação está descrita em [`docs/reports/sprint-1/sequencia_us.pdf`](docs/reports/sprint-1/sequencia_us.pdf)
(quem desbloqueia quem). O detalhamento individual de cada membro está
em [`docs/team-tasks/sprint-1/`](docs/team-tasks/sprint-1/).

### Bloco 1 — Fundação, Autenticação e Tema · _Gabriel Marques_

| US    | Descrição                                | Status      | PR                                                                                                                                                                                                      |
| ----- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-01 | Configurar projeto base com Vite         | ✅ Mergeada | [#125](https://github.com/GabeMarques-Intetsu/SIRA/pull/125)                                                                                                                                            |
| US-02 | Criar utilitários funcionais e estilos   | ✅ Mergeada | [#126](https://github.com/GabeMarques-Intetsu/SIRA/pull/126)                                                                                                                                            |
| US-03 | Permitir login pelo e-mail institucional | ✅ Mergeada | [#127](https://github.com/GabeMarques-Intetsu/SIRA/pull/127)                                                                                                                                            |
| US-04 | Permitir solicitação de cadastro         | ✅ Mergeada | [#128](https://github.com/GabeMarques-Intetsu/SIRA/pull/128)                                                                                                                                            |
| US-05 | Permitir logout do sistema               | ✅ Mergeada | [#127](https://github.com/GabeMarques-Intetsu/SIRA/pull/127) (T-05.2 — `logout()` em `store.js`) · [#134](https://github.com/GabeMarques-Intetsu/SIRA/pull/134) (T-05.1 — botão "Sair" no `userPill`)   |
| US-09 | Alternar tema claro/escuro               | ✅ Mergeada | [#134](https://github.com/GabeMarques-Intetsu/SIRA/pull/134) (T-09.1/T-09.2 — toggle + persistência) · [#154](https://github.com/GabeMarques-Intetsu/SIRA/pull/154) (T-09.3 — restauração no bootstrap) |

**Conclusão:** 6 / 6 user stories concluídas.

### Bloco 2 — Shell, Navegação, Mobile, Modais e Calendário · _Ian Lucas_

| US    | Descrição                                          | Status      | PR                                                           |
| ----- | -------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| US-06 | Sidebar contextual com badges e filtro por role    | ✅ Mergeada | [#134](https://github.com/GabeMarques-Intetsu/SIRA/pull/134) |
| US-07 | Roteamento por URL com `pushState` + `popstate`    | ✅ Mergeada | [#144](https://github.com/GabeMarques-Intetsu/SIRA/pull/144) |
| US-08 | Drawer mobile com hambúrguer e tabelas responsivas | ✅ Mergeada | [#145](https://github.com/GabeMarques-Intetsu/SIRA/pull/145) |
| US-13 | Calendário semanal 7d × 12h com eventos por status | ✅ Mergeada | [#147](https://github.com/GabeMarques-Intetsu/SIRA/pull/147) |
| US-25 | Sistema centralizado de modais (create/open/close) | ✅ Mergeada | [#149](https://github.com/GabeMarques-Intetsu/SIRA/pull/149) |

**Conclusão:** 5 / 5 user stories concluídas.

### Bloco 3 — Persistência, Dashboard e Notificações · _Igor Gimenez_

| US    | Descrição                                                | Status      | PR                                                           |
| ----- | -------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| US-10 | LocalStorage isolado por usuário (`sira_db/<email>/...`) | ✅ Mergeada | [#143](https://github.com/GabeMarques-Intetsu/SIRA/pull/143) |
| US-11 | Sincronização aprovação → reserva → notificação          | ✅ Mergeada | [#143](https://github.com/GabeMarques-Intetsu/SIRA/pull/143) |
| US-12 | Dashboard administrativo com KPIs em tempo real          | ✅ Mergeada | [#161](https://github.com/GabeMarques-Intetsu/SIRA/pull/161) |
| US-24 | Caixa de notificações com marcação como lidas            | ✅ Mergeada | [#162](https://github.com/GabeMarques-Intetsu/SIRA/pull/162) |

**Conclusão:** 4 / 4 user stories concluídas.

### Bloco 4 — Nova Reserva e CRUD de Reservas · _José Henrique_

| US    | Descrição                                             | Status      | PR                                                           |
| ----- | ----------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| US-14 | Busca de salas com filtros e anti-conflito de horário | ✅ Mergeada | [#152](https://github.com/GabeMarques-Intetsu/SIRA/pull/152) |
| US-15 | Detalhes da sala + reserva 1-clique com aprovação     | ✅ Mergeada | [#152](https://github.com/GabeMarques-Intetsu/SIRA/pull/152) |
| US-16 | Listar minhas reservas com filtros e busca textual    | ✅ Mergeada | [#159](https://github.com/GabeMarques-Intetsu/SIRA/pull/159) |
| US-17 | Ver, editar e cancelar reservas pendentes             | ✅ Mergeada | [#159](https://github.com/GabeMarques-Intetsu/SIRA/pull/159) |
| US-18 | Exportar reservas em CSV                              | ✅ Mergeada | [#159](https://github.com/GabeMarques-Intetsu/SIRA/pull/159) |

**Conclusão:** 5 / 5 user stories concluídas.

### Bloco 5 — Administração (Aprovações, Salas e Usuários) · _Pedro Sales_

| US    | Descrição                                           | Status      | PR                                                           |
| ----- | --------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| US-19 | Fila consolidada de aprovações pendentes            | ✅ Mergeada | [#163](https://github.com/GabeMarques-Intetsu/SIRA/pull/163) |
| US-20 | Aprovar / recusar reservas com notificação ao autor | ✅ Mergeada | [#163](https://github.com/GabeMarques-Intetsu/SIRA/pull/163) |
| US-21 | CRUD de salas com filtros, recursos e status        | ✅ Mergeada | [#164](https://github.com/GabeMarques-Intetsu/SIRA/pull/164) |
| US-22 | CRUD de usuários com perfis professor/admin         | ✅ Mergeada | [#170](https://github.com/GabeMarques-Intetsu/SIRA/pull/170) |
| US-23 | Aprovar/recusar solicitações de cadastro pendentes  | ✅ Mergeada | [#166](https://github.com/GabeMarques-Intetsu/SIRA/pull/166) |

**Conclusão:** 5 / 5 user stories concluídas.

### Resumo geral

| Bloco                       | Responsável     | Concluído | Total  |
| --------------------------- | --------------- | --------- | ------ |
| Fundação + Auth + Tema      | Gabriel Marques | 6         | 6      |
| Shell + Modais + Calendário | Ian Lucas       | 5         | 5      |
| Persistência + Dashboard    | Igor Gimenez    | 4         | 4      |
| Reservas (Nova + CRUD)      | José Henrique   | 5         | 5      |
| Administração               | Pedro Sales     | 5         | 5      |
| **Total**                   | —               | **25**    | **25** |

**O que funciona em produção (release `v1.0.x`):**

- Login institucional + cadastro de professor + sessão persistente em `F5`
- Sidebar contextual com badges dinâmicos, filtragem por role, logout e
  toggle de modo escuro com persistência (sobrevive a refresh)
- Roteamento por URL com `pushState`, `popstate` e middleware de segurança
  por perfil
- Drawer mobile com hambúrguer dinâmico e tabelas convertidas em cards
- Calendário semanal 7d × 12h com eventos coloridos por status
- Sistema de modais centralizado com fechamento via Escape
- Persistência por usuário no LocalStorage com consolidação para admin
- **Nova reserva** com busca anti-conflito e fluxo de aprovação em 1º nível
- **CRUD completo de reservas pessoais** (listar, filtrar, ver, editar,
  cancelar, exportar CSV)
- **Dashboard administrativo** com KPIs em tempo real (reduce de salas
  e reservas)
- **Caixa de notificações** com marcação individual e em massa
- **Fila de aprovações** com decisão (aprovar/recusar) em 1 clique e
  notificação automática ao solicitante
- **CRUD de salas** com filtros por status (livre / ocupada / manutenção)
  e seleção de recursos por checkbox
- **CRUD de usuários** com perfis professor/admin, busca e remoção
- **Revisão de solicitações de cadastro** pendentes com aprovar/recusar

---

## 👥 Equipe

| Membro              | GitHub                                                         | Bloco                                         |
| ------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| **Gabriel Marques** | [@GabeMarques-Intetsu](https://github.com/GabeMarques-Intetsu) | Fundação + Autenticação + Tema                |
| **Ian Lucas**       | [@IanGds](https://github.com/IanGds)                           | Shell + Navegação + Modais + Calendário       |
| **Igor Gimenez**    | [@igorgmnzmonte](https://github.com/igorgmnzmonte)             | Persistência + Dashboard + Notificações       |
| **José Henrique**   | [@jhenriquecs](https://github.com/jhenriquecs)                 | Reservas (Nova Reserva + CRUD + CSV)          |
| **Pedro Sales**     | [@pedro-sls](https://github.com/pedro-sls)                     | Administração (Aprovações + Salas + Usuários) |

Projeto acadêmico desenvolvido no IFPB para as disciplinas de
**Programação para Web 2** e **Engenharia de Requisitos de Software**.
