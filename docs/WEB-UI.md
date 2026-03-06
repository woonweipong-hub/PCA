# PCA Web UI

PCA Web UI provides a browser-based control desk for OCR, PDF conversion, quality gating, evidence checks, and artifact downloads.

## What You Can Do

- Run OCR preprocess for scanned PDFs.
- Convert PDF folders to text corpus.
- Run `quality-check` before evidence checks.
- Run `evidence-check` and review structured output.
- Run live debate cycles (`propose -> critique -> assess`) with timeline updates.
- Build objective-driven framework proposals from user intent, expectations, constraints, and research needs.
- Download JSON artifacts from each run.

## Start Locally

```bash
npm install
npm run ui:start
```

Open:

- `http://localhost:4173`

Environment overrides:

- `PCA_UI_HOST` (default `0.0.0.0`)
- `PCA_UI_PORT` (default `4173`)

## API Endpoints

- `POST /api/ocr-pdf`
- `POST /api/convert-pdf`
- `POST /api/quality-check`
- `POST /api/evidence-check`
- `POST /api/framework-proposal`
- `POST /api/research-pack`
- `POST /api/debate-live` (SSE stream for live timeline)
- `GET /api/artifacts`
- `GET /api/download?file=<artifact>`
- `GET /api/health`

## Live Debate View

Use `Run Live Debate x3` in the UI to stream three debate cycles in real time:

- Cycle start event
- Proposer step output
- Critic step output + extracted risk flags
- Assessor step verdict + governance signal
- Final human checkpoint recommendation (`Proceed with recommendations` or `Further discussion needed`)

Live debate now also captures and displays:

- PCA framework snapshot (criteria, topology, governance policy)
- Per-cycle scoring telemetry (weighted score, coverage ratio, score band)
- Score deltas across cycles to show whether debate quality is improving

Each run saves a `live-debate` artifact in `outputs/ui/`.

Use the `Runtime Provider` selector to tag runs as `copilot`, `antigravity`, `byom`, `ollama`, or `other` for traceability across mixed operating setups.

## Framework Proposal View

Use `Propose Framework` to generate a structured PCA contract for the current request:

- Request contract: objective, expectations, constraints, research needs
- Framework package: criteria, topology, governance policy
- Execution + verification plan mapped to PCA commands
- Active AI search plan (query/task suggestions) for Copilot/Codex CLI, Antigravity, or BYOM runtime execution

## Research Pack View

Use `Run Research Pack` to build deeper research quality outputs before long debate loops:

- quality gate snapshot for corpus readiness
- evidence synthesis with top support and contradiction links
- targeted research tasks for unresolved risk flags
- process quality recommendation for next cycle

## Artifact Storage

Run outputs are stored in:

- `outputs/ui/*.json`

Each run returns a `download_url` so users can retrieve artifacts directly.

## Online Deployment (Basic)

You can deploy this service to any Node-compatible host (for example Render, Railway, Azure Web App, Fly.io).

Recommended settings:

- Start command: `npm run ui:start`
- Node version: 18+
- Persistent storage mount for `outputs/` (recommended)

Important notes for online usage:

- The server executes local filesystem/CLI operations; hosted environments must allow process execution and folder access.
- Use authentication/reverse proxy before exposing publicly.
- Restrict accessible folders in production by deployment policy.

## Security Guidance

- Do not expose this UI directly to the open internet without auth.
- Keep confidential exclusion lists in workflow policy.
- Store artifacts in controlled storage with retention policy.
