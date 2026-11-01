# graphify-vscode-repo

A VS Code repo where [Graphify](https://github.com/safishamsi/graphify) is set up automatically for
**Claude Code, Codex and GitHub Copilot**, and the knowledge graph stays in sync with your commits.

## How it works

| When | What happens |
|---|---|
| `npm i` / `pnpm i` | `postinstall` runs `scripts/setup-graphify.mjs`: installs Graphify (uv → pipx → pip), registers it with Claude Code, Codex, Copilot CLI and VS Code Copilot Chat, enables git hooks, builds the first graph in `graphify-out/` |
| `git commit` | `.githooks/pre-commit` runs `graphify update .` and stages `graphify-out/graph.json`, `GRAPH_REPORT.md`, `graph.html` — so the refreshed graph is **part of the same commit** |
| You prompt an assistant | The installed skill/hooks/instructions (`CLAUDE.md`, `AGENTS.md`, Copilot instructions) tell it to read the graph before searching raw files. Use `/graphify query "..."` in Claude Code |

## Quick start

```bash
git init            # once
pnpm i              # or: npm i   -> installs Graphify + builds graph
git add . && git commit -m "init"   # graph is committed with it
```

Requires Node 18+ and Python 3.10+ (uv or pipx recommended: `curl -LsSf https://astral.sh/uv/install.sh | sh`).

## Commands

- `pnpm run graph` — rebuild the graph now
- `pnpm run graph:setup` — re-run full setup
- `GRAPHIFY_SKIP_HOOK=1 git commit ...` — skip graph update for one commit
- `GRAPHIFY_SKIP_SETUP=1 pnpm i` — skip setup (it is also skipped when `CI=true`)

## Notes

- Code is parsed locally (tree-sitter, no LLM). Docs/images use your assistant's model for the semantic pass.
- `graphify-out/cache/` is git-ignored; the graph files are committed.
- The graph is rebuilt before each commit, so it reflects the working tree being committed.
- A fresh clone gets the hook automatically on first `pnpm i` (sets `core.hooksPath`).
