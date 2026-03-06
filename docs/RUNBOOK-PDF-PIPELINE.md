# Runbook: PDF Parsing Pipeline

## Purpose

Operate the end-to-end PDF to evidence workflow safely and consistently.

## Preconditions

- Public/approved source PDFs only.
- Confidential exclusion list prepared.
- `pdftotext` available (or provide explicit path).

## Standard Procedure

1. Convert PDFs to text corpus.

```bash
npm run convert:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
```

2. Run corpus quality gate.

```bash
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
```

3. If quality gate passes, run evidence check.

```bash
node bin/pca.js evidence-check verify --decision "Interpret requirements" --context "Cross-document consistency check" --sources "data/public-pdf-text" --max-files 200 --prioritize-requirements true --policy strict
```

4. Persist decision artifact.

```bash
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked clarifications" --actions "Assign owners and due dates" --policy strict --output outputs/decision.json --format json
```

## Stop Conditions

- `quality_gate.ready_for_evidence_check = false`
- conversion failures > 0
- source path or schema contract errors

## Escalation

- If data quality fails: route to data owner for source correction.
- If governance mode is `HITL`: follow `docs/RUNBOOK-HITL-ESCALATION.md`.
