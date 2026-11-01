#!/usr/bin/env node
/**
 * Graphify bootstrap. Runs automatically on `npm i` / `pnpm i` (postinstall).
 *
 *  1. Installs Graphify (PyPI package "graphifyy") via uv -> pipx -> pip
 *  2. Registers it with Claude Code, Codex and GitHub Copilot (CLI + VS Code chat)
 *  3. Points git at .githooks/ so the pre-commit hook refreshes + stages the graph
 *  4. Builds the initial graph (graphify-out/)
 *
 * Never fails the install: every step is best-effort and prints a warning instead.
 *
 * Flags:  --graph-only   only rebuild the graph
 * Env:    GRAPHIFY_SKIP_SETUP=1  skip everything (also skipped when CI=true)
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';

const root = process.cwd();
const isWin = process.platform === 'win32';
const graphOnly = process.argv.includes('--graph-only');

const log = (m) => console.log(`[graphify] ${m}`);
const warn = (m) => console.warn(`[graphify] ⚠ ${m}`);

if (process.env.GRAPHIFY_SKIP_SETUP === '1' || process.env.CI === 'true') {
  log('skipped (CI or GRAPHIFY_SKIP_SETUP=1)');
  process.exit(0);
}

// uv / pipx put executables in ~/.local/bin, which is often missing from PATH
const extraPaths = [join(homedir(), '.local', 'bin'), join(homedir(), '.cargo', 'bin')];
const env = { ...process.env, PATH: [...extraPaths, process.env.PATH ?? ''].join(delimiter) };

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: root, env, stdio: opts.quiet ? 'pipe' : 'inherit', shell: isWin });
  return r.status === 0;
}
const has = (cmd, args = ['--version']) => run(cmd, args, { quiet: true });

function ensureGraphify() {
  if (has('graphify', ['--help'])) return true;
  log('installing graphify (PyPI package: graphifyy)...');
  const attempts = [
    ['uv', ['tool', 'install', 'graphifyy']],
    ['pipx', ['install', 'graphifyy']],
    ['pip', ['install', '--user', '--break-system-packages', 'graphifyy']],
    ['pip3', ['install', '--user', '--break-system-packages', 'graphifyy']],
    ['python', ['-m', 'pip', 'install', '--user', 'graphifyy']],
  ];
  for (const [cmd, args] of attempts) {
    if (has(cmd) && run(cmd, args) && has('graphify', ['--help'])) return true;
  }
  return false;
}

function registerAssistants() {
  // Project-scoped installs write into this repo (.claude/, AGENTS.md, .codex/, .github/ ...)
  // so every teammate / assistant gets the same setup. Fall back to user-level if unsupported.
  const targets = [
    ['Claude Code', ['claude', 'install']],
    ['Codex', ['codex', 'install']],
    ['GitHub Copilot CLI', ['copilot', 'install']],
    ['VS Code Copilot Chat', ['vscode', 'install']],
  ];
  for (const [name, args] of targets) {
    log(`registering with ${name}...`);
    if (run('graphify', [...args, '--project']) || run('graphify', args)) continue;
    warn(`could not register ${name} (run: graphify ${args.join(' ')})`);
  }
}

function setupGitHooks() {
  if (!existsSync(join(root, '.git'))) {
    warn('not a git repo yet — run `git init` then `pnpm i` again to enable the commit hook');
    return;
  }
  if (run('git', ['config', 'core.hooksPath', '.githooks'], { quiet: true })) {
    log('git hooks enabled (core.hooksPath = .githooks)');
  } else {
    warn('failed to set core.hooksPath');
  }
}

function buildGraph() {
  log('building graph (graphify update .)...');
  if (!run('graphify', ['update', '.'])) warn('graph build failed — try `graphify update .` manually');
}

if (!graphOnly) {
  if (!ensureGraphify()) {
    warn('could not install graphify automatically. Install Python 3.10+ and uv, then: uv tool install graphifyy');
    process.exit(0);
  }
  registerAssistants();
  setupGitHooks();
} else if (!has('graphify', ['--help'])) {
  warn('graphify not installed — run `pnpm run graph:setup`');
  process.exit(0);
}

buildGraph();
log('done. Open your assistant and type: /graphify query "how does this repo work?"');
