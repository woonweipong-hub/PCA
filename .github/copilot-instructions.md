# PCA Workspace Guidelines

## Project Purpose
PCA is an evidence-governed adaptive solver for human-machine co-working. Prefer workflows that improve framing, critique, evidence checks, governance routing, and auditability.

## Core Workflow
Use PCA when work benefits from:
- explicit problem framing
- structured proposal and critique
- evidence synthesis from local sources
- `HITL/HOTL` routing
- persisted decision artifacts

## Primary Components
- Core logic: `src/pca-core.js`
- CLI: `bin/pca.js`
- UI/API: `web/server.cjs`, `web/ui/`
- Main docs: `README.md`, `docs/USER-GUIDE.md`, `docs/VS-CODE-CLI-CHEATSHEET.md`

## Build and Test
- Install: `npm install`
- Test: `npm test`
- UI: `npm run ui:start`
- Runtime validation: `npm run smoke:runtimes`

## Conventions
- Prefer PCA-native framing over free-form long conversational drift.
- Preserve traceability: objective, evidence, critique, assessment, gates, routing, artifact.
- For documentation about reasoning transparency, describe structured decision records or structured reasoning trail, not unrestricted hidden chain-of-thought.
- Keep changes minimal and aligned with the existing PCA terminology and workflow.