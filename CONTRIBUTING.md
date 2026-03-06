# Contributing to PCA

Thanks for helping improve PCA.

"This project is independently developed. Any similarity to other systems reflects common industry patterns (for example proposer/critic/evaluator workflows) and does not imply code, prompt, or proprietary method reuse."

## Project Goals

- Keep `pca-core` runtime-agnostic.
- Keep CLI outputs deterministic and machine-readable.
- Keep governance explicit (`HITL`/`HOTL`).

## Development Flow

1. Create a branch.
2. Implement focused changes.
3. Add or update tests.
4. Run `npm test`.
5. Update docs when behavior changes.
6. If external concepts were referenced, update `docs/PRIOR-ART.md`.

## Release Checklist

Before cutting a release:

1. Run `npm test`.
2. Verify CLI examples in `README.md`.
3. Verify command contracts in `SCHEMA.md`.
4. Confirm integration adapters still parse and emit valid schema.
5. Document contract changes and migration notes.

## Architecture Boundaries

- `src/pca-core.js`: decision logic only, no filesystem/runtime coupling.
- `bin/pca.js`: argument parsing and JSON output.
- `integrations/*`: platform-specific mapping and examples.

## Adapter Guidelines

Adapters should:
- consume PCA JSON contracts from `SCHEMA.md`.
- map platform context into `prepare/run/route` inputs.
- avoid changing core logic.

Adapters should not:
- fork the output schema per platform.
- add business logic that belongs in `pca-core`.

## Contract Stability

Before changing output fields:
- update `SCHEMA.md`.
- preserve backwards compatibility when possible.
- include migration notes in PR description.

## Security and Privacy

- Do not commit credentials.
- Do not include confidential user data in examples.
- Keep public Q&A data anonymized.
- Track conceptual references in `docs/PRIOR-ART.md` and avoid proprietary reuse.
