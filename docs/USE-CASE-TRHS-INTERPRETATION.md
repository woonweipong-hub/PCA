# Use Case: TRHS Interpretation Workflow (URA, BCA, SCDF)

This use case demonstrates an end-to-end PCA flow for interpreting household shelter requirements across multiple authorities using local files.

Positioning: this is a specific domain implementation of PCA. The same workflow structure can be reused for other regulatory or technical decision domains.

## Objective

Build a repeatable interpretation gate for TRHS-related decisions:

1. Convert public regulator PDFs to local text.
2. Ingest and normalize evidence with PCA.
3. Run strict cross-document checks.
4. Produce a governed output (`HITL`/`HOTL`) with actionable next steps.

## Problem Statement

Teams working on landed housing and household shelter reviews often face:

- Large, mixed-format regulatory sources (mostly PDF).
- Manual and inconsistent cross-agency interpretation.
- High effort in extraction before actual judgement.
- Weak traceability from clause to decision.
- Late discovery of review/escalation needs.

PCA addresses this by converting interpretation into a structured, auditable, policy-driven workflow that remains reusable beyond TRHS.

## Data Scope and Confidentiality

- Source folder: `C:\2026_Research\Assets`
- Public files: URA/BCA/SCDF documents
- Excluded confidential file: `BCA_HS_Checks_Scope.pdf`

## Step-by-Step Demonstration

### 1) Convert PDFs to text for ingestion

PCA ingest currently supports `.md`, `.txt`, `.json`, `.csv`.

Recommended one-command conversion:

```bash
npm run convert:trhs
```

Equivalent manual command:

```powershell
New-Item -ItemType Directory -Force -Path "data\trhs-text" | Out-Null
Get-ChildItem -Path "C:\2026_Research\Assets" -File |
  Where-Object { $_.Extension -ieq ".pdf" -and $_.Name -match '^(BCA|URA|SCDF)_' -and $_.Name -ne 'BCA_HS_Checks_Scope.pdf' } |
  ForEach-Object {
    $out = Join-Path "data\trhs-text" ($_.BaseName + ".txt")
    & "C:\poppler\Library\bin\pdftotext.exe" -layout -enc UTF-8 $_.FullName $out
  }
```

### 2) Build evidence digest

```bash
node bin/pca.js ingest --sources "data/trhs-text" --max-files 120 --prioritize-requirements true > outputs/trhs-ingest.json
```

### 3) Run strict evidence-check

```bash
node bin/pca.js evidence-check verify --decision "TRHS interpretation for household shelter compliance (URA/BCA/SCDF)" --context "Cross-agency technical requirements, constraints, and contradiction checks" --sources "data/trhs-text" --max-files 120 --prioritize-requirements true --policy strict > outputs/trhs-evidence-check.json
```

### 4) Persist implementation decision artifact

```bash
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked clarifications and authority validation" --actions "1) confirm TRHS slab/setback conditions; 2) validate SCDF fire resistance and external access implications; 3) confirm URA lodgment applicability with QP" --policy strict --output outputs/trhs-decision.json --format json
```

## Demonstration Result Pattern

From a recent run on the same workflow:

- `source_count`: 12
- `total_claims`: 84
- `support_count`: 17
- `contradiction_count`: 0
- `verdict`: `accepted-with-conditions`
- governance recommendation: `HITL` under strict policy (coverage threshold not fully met)

Interpretation:

- The corpus shows supportive overlap across selected URA/BCA/SCDF extracts.
- No direct contradiction was detected in the extracted claim set.
- Strict policy still recommends human-in-the-loop approval before final execution.

## What Good Looks Like

A strong TRHS interpretation package should include:

- Decision statement and context.
- Evidence-check output with source traceability.
- Explicit governance mode and rationale.
- Action list with named owners and due dates.

## Suggested Team Operating Model

1. Technical team runs conversion + evidence-check weekly on updated circulars/codes.
2. QP/architect/fire consultant reviews only flagged gaps and governance rationale.
3. Re-run after revisions until verdict is `accepted` or acceptable conditional acceptance.
