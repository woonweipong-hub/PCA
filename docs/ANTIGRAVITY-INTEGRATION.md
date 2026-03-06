# Antigravity Integration

This guide shows how to use PCA effectively with Antigravity.

## What Works

- PCA CLI commands run directly in Antigravity terminal/session.
- PCA Web UI runs as a local Node service and can be opened in browser.
- Recommended pattern: Antigravity orchestrates commands, browser UI handles visual control/downloads.

PCA is designed to sit on top of runtime models/tools: Antigravity can keep executing tasks while PCA governs debate structure, evidence quality, and HITL/HOTL outcomes.

## Quick Setup

```bash
npm install
```

## Pattern A: Antigravity CLI-Only Workflow

Run in Antigravity terminal/session:

```bash
npm run convert:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
node bin/pca.js evidence-check verify --decision "Interpret requirements" --context "Cross-document consistency check" --sources "data/public-pdf-text" --policy strict --max-files 200 --prioritize-requirements true
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked conditions" --actions "Assign owners and due dates" --policy strict --output outputs/antigravity-decision.json --format json
```

## Pattern B: Hybrid (Antigravity + Web UI)

1. Start UI locally:

```bash
npm run ui:start
```

2. Open browser:

- `http://localhost:4173`

3. Use Antigravity for orchestration prompts and command sequencing.
4. Use Web UI for:
- run status visibility
- live proposer/critic/assessor timeline (`Run Live Debate x3`)
- quality/evidence result review
- artifact download

## OCR and Scanned PDF Recovery

If dataset is scanned/image-heavy:

```bash
npm run ocr:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-ocr" --recursive true --language eng
npm run convert:pdf -- --input-dir "data/public-pdf-ocr" --output-dir "data/public-pdf-text" --recursive true
```

Then rerun quality/evidence checks.

## HITL/HOTL Use in Antigravity Flow

- If output recommends `HOTL`, proceed with monitored execution.
- If output recommends `HITL`, stop automation and run human review process.

Reference:

- `docs/RUNBOOK-HITL-ESCALATION.md`

## Operational Tips

- Keep confidential file exclusions explicit in conversion stage.
- Always run `quality-check` before `evidence-check` on heterogeneous corpora.
- Persist decision artifacts for audit and handoff.
