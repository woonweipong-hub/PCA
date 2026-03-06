# External Executor Integration Guide (GSD Example)

Use PCA as the decision-quality front layer, with an external execution backend (for example, GSD).

## Why this pattern works

- External executors drive structured execution.
- PCA enforces evidence quality, debate rigor, and governance checks.

## On-par process expectation

For each high-impact task:

1. Capture objective, expected outputs, constraints, and research needs.
2. Run `framework-proposal` to produce the PCA contract.
3. Run `research-pack` to verify data quality and synthesize contradictions/gaps.
4. Run `debate-live` to iterate proposer/critic/assessor cycles.
5. Apply verification verdict and `HITL/HOTL` routing before execution.
6. Monitor execution outcomes and feed new evidence back into PCA.

## Human-style operating loop

Treat every high-impact run as:

- See: collect and observe requirements, datasets, and public references.
- Think: run PCA framework + debate + assessment cycles.
- React/Do: route and execute through the selected backend with governance.
- See again: monitor outcomes, then re-enter PCA when signals change.

## API-first usage from an external executor

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
