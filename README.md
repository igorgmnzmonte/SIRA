# SIRA — Sistema de Reserva de Salas e Equipamentos

Aplicação web para gerenciar reservas de salas e equipamentos, desenvolvida
como projeto integrado das disciplinas:

- **PWEB2 — Programação para Web 2** (implementação da aplicação)
- **Engenharia de Requisitos de Software** (levantamento, especificação e
  validação dos requisitos)

> Status: em desenvolvimento ativo. A primeira sprint é em **JavaScript puro
> (ES Modules)** servido pelo Vite; a segunda sprint migra a camada de
> apresentação para **React**.

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
│       ├── ci.yml          # Valida formatação e build em PRs e push em develop
│       └── deploy.yml      # Publica no GitHub Pages quando uma release é publicada
├── .husky/
│   └── pre-commit          # Dispara `npx lint-staged` antes de cada commit
├── public/                 # Assets estáticos copiados como estão para a raiz do build
├── src/                    # Código-fonte da aplicação
│   ├── main.js             # Entry point JS — monta o markup em #app e importa o CSS
│   └── style.css           # Estilos globais
├── .nvmrc                  # Versão do Node (24 LTS)
├── .prettierrc             # Regras do Prettier (semi, single quote, trailing comma)
├── .prettierignore         # Arquivos ignorados pelo Prettier
├── eslint.config.js        # ESLint flat config + integração com Prettier
├── index.html              # Entry point HTML do Vite (carrega /src/main.js como módulo)
├── vite.config.js          # Configuração do Vite (define o `base` para o GitHub Pages)
├── package.json
└── package-lock.json
```

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

- URL pública: `https://<usuario>.github.io/SIRA-Sistema-de-Reserva-Salas-e-Equipamentos/`
- O `vite.config.js` já define `base: '/SIRA-Sistema-de-Reserva-Salas-e-Equipamentos/'`
  para que os assets sejam resolvidos corretamente dentro do subpath do
  GitHub Pages.

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

## 👤 Autor

**Gabriel Marques** — [@GabeMarques-Intetsu](https://github.com/GabeMarques-Intetsu)

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
