# Graph Report - graphify-vscode-repo  (2026-11-01)

## Corpus Check
- 14 files · ~1,688 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 46 nodes · 50 edges · 10 communities (4 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- setup-graphify.mjs
- run
- graphify-vscode-repo
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- copilot-instructions.md

## God Nodes (most connected - your core abstractions)
1. `run()` - 6 edges
2. `scripts` - 5 edges
3. `log()` - 5 edges
4. `graphify-vscode-repo` - 5 edges
5. `warn()` - 4 edges
6. `ensureGraphify()` - 4 edges
7. `registerAssistants()` - 4 edges
8. `setupGitHooks()` - 4 edges
9. `buildGraph()` - 4 edges
10. `has()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 6 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.18
Nodes (10): description, name, private, scripts, graph, graph:setup, postinstall, start (+2 more)

### Community 1 - "setup-graphify.mjs"
Cohesion: 0.22
Nodes (4): env, extraPaths, graphOnly, root

### Community 2 - "run"
Cohesion: 0.46
Nodes (8): buildGraph(), ensureGraphify(), has(), log(), registerAssistants(), run(), setupGitHooks(), warn()

### Community 3 - "graphify-vscode-repo"
Cohesion: 0.33
Nodes (5): Commands, graphify-vscode-repo, How it works, Notes, Quick start

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `run()` connect `run` to `setup-graphify.mjs`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._