# PCA + GSD Integration Guide

Use PCA as a decision-quality layer on top of GSD.

## Why this pairing works

- GSD drives structured execution.
- PCA enforces evidence quality, debate rigor, and governance checks.

## On-par process expectation

For each high-impact task:

1. Capture objective, expected outputs, constraints, and research needs.
2. Run `framework-proposal` to produce the PCA contract.
3. Run `research-pack` to verify data quality and synthesize contradictions/gaps.
4. Run `debate-live` to iterate proposer/critic/assessor cycles.
5. Apply verification verdict and `HITL/HOTL` routing before execution.

## API-first usage from GSD

Start PCA service:

```bash
npm run ui:start
```

Then call:

- `POST /api/framework-proposal`
- `POST /api/research-pack`
- `POST /api/debate-live`
- `POST /api/evidence-check`

## Notes on active search/research

PCA produces an `active_ai_search_plan` with suggested query tasks.
Execution of those tasks can be delegated to:

- Copilot/Codex CLI workflows
- Antigravity routines
- BYOM adapter runtimes

Feed newly collected evidence back through `sources` and rerun `research-pack`/`debate-live`.
