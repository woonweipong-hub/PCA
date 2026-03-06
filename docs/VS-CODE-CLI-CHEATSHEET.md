# PCA VS Code CLI Cheat Sheet

This is the shortest practical guide to using PCA inside VS Code.

PCA can be used in three ways:

- Copilot-assisted workflow in the VS Code terminal
- Antigravity-assisted workflow in its terminal/session
- Pure local terminal workflow without any external runtime orchestration

## Core Idea

PCA is not just a chat prompt. In VS Code it works as:

- a CLI: `node bin/pca.js ...`
- a local web service/UI: `npm run ui:start`
- a governance layer around decision quality, evidence checks, and `HITL/HOTL` routing

## Quick Start

```bash
npm install
```

Run help:

```bash
node bin/pca.js help
```

Start the local UI/API service:

```bash
npm run ui:start
```

Open:

- `http://localhost:4173`

## Workflow 1: Copilot in VS Code

Use this when Copilot is your main coding/runtime environment and PCA is your reasoning and governance shell.

### Terminal-first flow

```bash
node bin/pca.js prepare discuss --decision "TRHS interpretation strategy" --context "Use public dataset evidence"
node bin/pca.js propose discuss --decision "TRHS interpretation strategy" --sources "data/public-pdf-text"
node bin/pca.js critique discuss --decision "TRHS interpretation strategy" --proposal "Use a phased interpretation and evidence map"
node bin/pca.js assess discuss --verdict "accepted-with-conditions" --judgement "Proceed with explicit caveats" --actions "Add contradiction log and escalation points" --policy strict
node bin/pca.js route discuss --verdict "accepted-with-conditions" --policy strict
```

### Evidence-backed verification flow

```bash
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
node bin/pca.js evidence-check verify --decision "TRHS interpretation" --context "Cross-document consistency review" --sources "data/public-pdf-text" --policy strict --max-files 120 --prioritize-requirements true
```

### Save final output

```bash
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked conditions" --actions "Assign owner, due date, rollback trigger" --policy strict --output outputs/copilot-decision.json --format json
```

### Existing VS Code tasks

This workspace already exposes:

- `PCA: Start UI Server`
- `PCA: Copilot Framework Proposal`
- `PCA: Copilot Research Pack`
- `PCA: Copilot Live Debate (1 cycle smoke)`

These are defined in `.vscode/tasks.json` and can be run from the VS Code task runner.

### Runtime validation

```bash
npm run smoke:copilot
```

This validates:

- `/api/debate-live`
- `/api/run-pipeline`
- final verify gates and route recommendation payloads

## Workflow 2: Antigravity

Use this when Antigravity handles orchestration/execution and PCA governs decision quality.

### CLI-only pattern

```bash
npm run convert:pdf -- --input-dir "C:\path\to\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
node bin/pca.js evidence-check verify --decision "Interpret requirements" --context "Cross-document consistency check" --sources "data/public-pdf-text" --policy strict --max-files 200 --prioritize-requirements true
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked conditions" --actions "Assign owners and due dates" --policy strict --output outputs/antigravity-decision.json --format json
```

### Hybrid pattern

1. Run `npm run ui:start`
2. Open `http://localhost:4173`
3. Let Antigravity drive the task sequence
4. Use PCA Web UI for debate visibility, artifact downloads, and governance review

### Runtime validation

```bash
npm run smoke:antigravity
```

## Workflow 3: Pure Local Terminal

Use this when you want PCA alone, without Copilot or Antigravity orchestration.

### Minimal decision loop

```bash
node bin/pca.js prepare discuss --decision "Should we split the service" --context "Latency spikes at peak"
node bin/pca.js propose discuss --decision "Should we split the service"
node bin/pca.js critique discuss --decision "Should we split the service" --proposal "Split reads and writes"
node bin/pca.js assess discuss --verdict "needs-human-review" --judgement "Architecture impact is too broad for automatic acceptance" --actions "Review failure modes and rollback path" --policy strict
node bin/pca.js route discuss --verdict "needs-human-review" --policy strict
```

### Evidence loop from local files

```bash
node bin/pca.js ingest --sources "docs/a.md,docs/b.md"
node bin/pca.js quality-check --sources "docs/a.md,docs/b.md"
node bin/pca.js evidence-check verify --decision "Release gate" --context "UAT contradiction review" --sources "docs/a.md,docs/b.md" --policy strict
```

## Full Runtime Smoke

Run both in order:

```bash
npm run smoke:runtimes
```

Order:

1. Copilot
2. Antigravity

## When To Use What

- Use CLI when you want structured, scriptable, inspectable outputs.
- Use Web UI when you want live debate timeline, artifacts, and pipeline visibility.
- Use Copilot or Antigravity as outer runtimes only when you want external orchestration or execution help.

## Most Useful Commands

```bash
node bin/pca.js help
node bin/pca.js prepare discuss --decision "..." --context "..."
node bin/pca.js quality-check --sources "data/public-pdf-text"
node bin/pca.js evidence-check verify --decision "..." --context "..." --sources "data/public-pdf-text" --policy strict
npm run ui:start
npm run smoke:copilot
npm run smoke:antigravity
npm run smoke:runtimes
```

## Related Docs

- `docs/COMMAND-REFERENCE.md`
- `docs/USER-GUIDE.md`
- `docs/ANTIGRAVITY-INTEGRATION.md`
- `integrations/copilot/README.md`
- `integrations/gemini-antigravity/README.md`