# Copilot Integration (VS Code Surface)

Use PCA as the governed decision layer on top of Copilot-driven workflows in VS Code.

## Recommended Setup

1. Keep Copilot as the model runtime in VS Code.
2. Use PCA CLI, PCA agents, or PCA Web UI to structure debate and governance.
3. Watch continuous debate in PCA Web UI (`Run Live Debate x3`).

## CLI Control Flow

```bash
node bin/pca.js prepare discuss --decision "..." --context "..."
node bin/pca.js propose discuss --decision "..." --context "..."
node bin/pca.js critique discuss --decision "..." --context "..." --proposal "..."
node bin/pca.js evidence-check verify --decision "..." --context "..." --sources "data/public-pdf-text" --policy strict
```

## Live Debate View

Start UI:

```bash
npm run ui:start
```

Open `http://localhost:4173`, then run `Run Live Debate x3` to view cycle-by-cycle proposer/critic/assessor output and final human checkpoint.

## Notes

- Treat PCA JSON outputs as source of truth for governance decisions.
- Keep adapter logic thin and stateless.
- Prefer structured JSON exchange over fragile prompt text parsing.

## Runtime Verification (Copilot First)

Run an end-to-end smoke check against live API + SSE behavior:

```bash
npm run smoke:copilot
```

This validates:

- `/api/debate-live` emits final verify-gate and route recommendation payloads.
- `/api/run-pipeline` completes `Input -> Process -> Output` with governance output.
