# onehub-inventory

SaaS quản lý hàng cho sàn môi giới bất động sản — bản chuẩn hoá của Quỹ hàng (onehub-quy-hang)

## Quick start

Prerequisites: Node.js 24 (see .nvmrc), `make`, `git`.

```bash
git clone <this-repo-url>
cd onehub-inventory
make setup     # install dependencies
make check     # lint + typecheck + test — should be green
make dev       # run locally
```

## Everyday commands

| Command          | What it does                             |
| ---------------- | ---------------------------------------- |
| `make setup`     | Install dependencies (from the lockfile) |
| `make dev`       | Run the project locally                  |
| `make format`    | Auto-format the code                     |
| `make lint`      | Lint and check formatting                |
| `make typecheck` | Strict type checking                     |
| `make test`      | Run the tests                            |
| `make check`     | Everything CI runs — run before every PR |

## Project map

| Path        | Purpose                                                          |
| ----------- | ---------------------------------------------------------------- |
| `src/`      | Application code                                                 |
| `tests/`    | Automated tests                                                  |
| `ontology/` | Domain model: glossary, entities, relations (source of truth)    |
| `wiki/`     | Decisions, incidents and domain notes, kept up to date by agents |
| `CLAUDE.md` | Onboarding guide for AI coding agents                            |

## Stack

TypeScript on Node.js 24 — npm, ESLint, Prettier, Vitest

## Configuration

Copy `.env.example` to `.env` and fill in the values. Never commit `.env`.

## License

See [LICENSE](LICENSE).
