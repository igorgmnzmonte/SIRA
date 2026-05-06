# SIRA — Sistema de Reserva de Salas e Equipamentos

Projeto da disciplina **PWEB2**.

## Stack

- **Vite** — bundler e dev server
- **JavaScript** (ES Modules) — primeira sprint
- **React** — previsto para a segunda sprint
- **Prettier** + **Husky** — formatação automática no pre-commit
- **GitHub Actions** + **GitHub Pages** — CI e deploy

## Pré-requisitos

- Node.js **20** (use [nvm](https://github.com/nvm-sh/nvm) com o `.nvmrc` do projeto: `nvm use`)
- npm

## Como rodar localmente

```bash
npm install
npm run dev
```

A aplicação estará em `http://localhost:5173`.

## Scripts disponíveis

| Script                 | O que faz                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento do Vite               |
| `npm run build`        | Gera o build de produção em `dist/`                        |
| `npm run preview`      | Serve localmente o build de produção                       |
| `npm run format`       | Formata todos os arquivos com Prettier                     |
| `npm run check-format` | Verifica se os arquivos estão formatados (usado no commit) |

## Estrutura

```
.
├── .github/workflows/   # CI (PRs) e Deploy (push em main)
├── .husky/              # Git hooks (pre-commit roda check-format)
├── public/              # Assets estáticos servidos como estão
├── src/                 # Código-fonte
│   ├── main.js
│   └── style.css
├── index.html           # Entry point do Vite
├── vite.config.js
└── package.json
```

## Deploy

O deploy é automático via GitHub Pages a cada push na branch `main`.
URL: `https://<usuario>.github.io/SIRA-Sistema-de-Reserva-Salas-e-Equipamentos/`

> Habilite **GitHub Pages → Source: GitHub Actions** nas configurações do repositório.

## Fluxo de Git

- `main` → branch protegida, recebe apenas merges via PR de `develop`
- `develop` → branch de integração
- `feature/*` → branches de desenvolvimento

## Licença

[MIT](LICENSE)
