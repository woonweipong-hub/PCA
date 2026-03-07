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

## Normalized Use-Case Contract

### TRHS Interpretation Register (TIR)

This use case should persist a `TRHS Interpretation Register (TIR)` as the governed interpretation layer.

The TIR is not authority text. It is PCA's auditable interpretation layer built on top of public sources.

Field grouping is explicit:

- Identity fields: `issue_id`, `phase`, `topic`, `authority_scope`
- Evidence-derived fields: `source_refs`, `extraction_confidence`
- Judgement-derived fields: `interpreted_position`, `conditions_or_assumptions`, `hitl_required`

Recommended TIR schema for Phase 1 adoption:

| Field | Type | Meaning | Derivation |
| --- | --- | --- | --- |
| `issue_id` | string | Stable identifier for one TRHS interpretation issue | identity |
| `phase` | enum | `measurement`, `spatial-setback`, or `components-me` | identity |
| `topic` | string | Normalized issue topic | identity |
| `authority_scope` | string[] | Authorities materially relevant to the issue | identity |
| `source_refs` | object[] | Source file, clause/snippet, and short evidence note | evidence-derived |
| `extraction_confidence` | enum | `high`, `medium`, or `low` based on extraction quality | evidence-derived |
| `interpreted_position` | enum | `aligned`, `aligned-with-conditions`, `conflicted`, or `unclear` | judgement-derived |
| `conditions_or_assumptions` | string | Context or missing project inputs that control applicability | judgement-derived |
| `hitl_required` | boolean | Whether this issue requires human confirmation before action | judgement-derived |

Minimal JSON shape:

```json
{
  "issue_id": "TIR-TRHS-001",
  "phase": "measurement",
  "topic": "Bottom-most HS floor slab thickness",
  "authority_scope": ["BCA"],
  "source_refs": [
    {
      "file": "data/trhs-text/BCA_TRHS_requirements.txt",
      "clause": "2.3.2(c)",
      "note": "Bottom-most HS without NS below - 200mm"
    }
  ],
  "extraction_confidence": "medium",
  "interpreted_position": "aligned-with-conditions",
  "conditions_or_assumptions": "Project slab schedule and section details are required to verify the 200mm minimum.",
  "hitl_required": true
}
```

### Worked TRHS Example: TIR Mini-Catalog

The worked example below uses a small issue catalog to make interpretation measurable before changing the PCA flow.

Important boundary:

- This is an interpretation artifact, not an authority-issued checklist.
- Several rows below are derived from change-log style text, not the full illustrated operative clauses.
- `aligned-with-conditions` means the public corpus supports the interpretation, but project geometry, drawings, or full clause figures are still needed before execution.

| `issue_id` | `phase` | `topic` | `authority_scope` | `source_refs` | `extraction_confidence` | `interpreted_position` | `conditions_or_assumptions` | `hitl_required` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TIR-TRHS-001` | `measurement` | Bottom-most HS floor slab thickness | `BCA` | `BCA_TRHS_requirements.txt 2.3.2(c)` | `medium` | `aligned-with-conditions` | Apply when bottom-most HS has no NS below; project slab schedule and section are required to verify `200mm`. | `true` |
| `TIR-TRHS-002` | `measurement` | Bottom-most NS floor slab in contact with soil | `BCA`, `URA`, `SCDF` | `BCA_TRHS_requirements.txt 2.3.2(d)`; `URA_Resi_Summary_Terrace.txt Earthworks/Basements`; `SCDF_firecode-2023.txt 1.4.15 Basement storey` | `medium` | `aligned-with-conditions` | Treat as a geometry-and-ground-condition check; requires basement/ground relationship from sections and platform levels. | `true` |
| `TIR-TRHS-003` | `spatial-setback` | RC protection above HS where non-reinforced roof is used in landed house | `BCA`, `URA` | `BCA_TRHS_requirements.txt 2.4.1(d)`; `URA_Resi_Summary_Terrace.txt Setbacks/Envelope Control`; `URA_Circular_dc25-05.txt Clarification of landed house guidelines` | `low` | `aligned-with-conditions` | Applies only to landed-house context and setback evaluation; full roof build-up, setback geometry, and one-storey-above condition must be confirmed. | `true` |
| `TIR-TRHS-004` | `spatial-setback` | Non-reinforced lift core within setback distance of HS wall | `BCA`, `URA` | `BCA_TRHS_requirements.txt 2.4.1(e)`; `URA_Resi_Summary_Terrace.txt Setbacks/Building Appendages` | `low` | `aligned-with-conditions` | Requires project-specific confirmation of lift-core material, roof type, and exact setback relationship to HS wall without door. | `true` |
| `TIR-TRHS-005` | `spatial-setback` | RC lift core abutting HS wall requires additional common-wall thickness | `BCA`, `URA` | `BCA_TRHS_requirements.txt 2.4.7(a)`; `URA_Resi_Summary_Terrace.txt Setbacks` | `medium` | `aligned-with-conditions` | Additional `50mm` thickness is interpreted as a deterministic wall-detail requirement, but abutment must be verified from plans and sections. | `true` |
| `TIR-TRHS-006` | `spatial-setback` | Staircase located within setback distance of HS wall in non-landed development | `BCA` | `BCA_TRHS_requirements.txt 2.4.9` | `low` | `unclear` | Change-log text confirms allowance exists, but figure-driven design limits and non-landed applicability boundaries are not fully captured in the extracted text. | `true` |
| `TIR-TRHS-007` | `components-me` | Ventilation sleeves must not be located in toilets or bathrooms | `BCA`, `SCDF` | `BCA_TRHS_requirements.txt 4.2(b)`; `SCDF_firecode-2023.txt Chapter 7 Mechanical Ventilation & Smoke Control Systems` | `medium` | `aligned-with-conditions` | Interpretation is stable at issue level, but detailed layout, sleeve position, and any interacting fire or ventilation constraints still need project review. | `true` |
| `TIR-TRHS-008` | `components-me` | HS door frame stiffener must not be cut or modified for installation ease | `BCA` | `BCA_TRHS_requirements.txt 6.3(d)` | `medium` | `aligned` | Operates as a direct prohibition for installation practice; project inspection and method statement review are still required. | `true` |

### Worked Metrics for the Mini-Catalog

Use simple, explicit formulas for the first measurable version of the TIR.

- `multi_source_support_ratio = issues with 2 or more source references / total issues`
- `conflicted_issue_ratio = issues with interpreted_position = conflicted / total issues`
- `extraction_uncertainty_ratio = issues with extraction_confidence = low / total issues`

For the eight-row mini-catalog above:

- `multi_source_support_ratio = 5 / 8 = 0.625`
- `conflicted_issue_ratio = 0 / 8 = 0.00`
- `extraction_uncertainty_ratio = 3 / 8 = 0.375`

Interpretation of the ratios:

- Multi-source support is reasonably strong for a starter catalog because landed-house setback and ventilation issues can be cross-anchored to URA and SCDF material.
- Zero conflicts in this mini-catalog does not mean the issue set is execution-ready; it mainly means the sampled public corpus did not surface direct contradiction on these rows.
- Extraction uncertainty remains material because several TRHS rows depend on abbreviated change-log text or figures not fully captured by PDF-to-text conversion.

### Phase Roadmap for Measurable Outputs

#### Phase 1 - Measurement

Scope:

- HS width, length, area, and volume
- HS clear height
- HS wall thickness
- HS floor slab and top-most slab thickness
- Cover key clauses in `Cl. 2.2.x` and `Cl. 2.3.x`

Targets:

- Automatically extract measurements from plans, sections, tables, annotations, and dimensions.
- Run deterministic clause checks with pass/fail results.
- Flag missing or insufficient information instead of implying compliance.

Recommended additional TIR fields for this phase:

- `required_value`
- `actual_value`
- `unit`
- `check_result`
- `missing_information`

#### Phase 2 - Spatial & Setback

Scope:

- Setback distance envelope
- Air-well adjacency limits
- HS in basement conditions
- HS-lift shaft common wall
- Standard shielding wall offsets
- Simplified trellis distance checks
- Cover key clauses in `Cl. 2.4.x`

Targets:

- Automatically identify applicable setback requirements based on context such as landed housing, basement/above-ground condition, and materials.
- Provide clause-based reasoning explaining why a condition passes, fails, or remains unclear.

Recommended additional TIR fields for this phase:

- `applicability_context`
- `governing_geometry_inputs`
- `pass_condition`
- `fail_condition`
- `reasoning_note`

#### Phase 3 - HS Components and M&E Items

Scope:

- Blast door opening and nib details
- Electrical outlets and height requirements
- Conduit sealing provisions
- Ventilation sleeve clearances inside and outside the HS
- False ceiling access panels
- HS wall recess for door handle
- Cover key clauses in `Cl. 2.5`, `Cl. 2.7`, `Cl. 3.6`, `Cl. 4.2`, `Cl. 4.3`, and `Cl. 2.13`

Targets:

- Automatically detect and check key HS components and service elements.
- Generate an itemized report.
- Flag unclear items for manual review instead of forcing a definitive outcome.

Recommended additional TIR fields for this phase:

- `component_type`
- `detection_status`
- `item_check_result`
- `review_note`

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
- TIR mini-catalog or full register with stable `issue_id` values.
- Evidence-check output with source traceability.
- Explicit split between evidence-derived fields and judgement-derived fields.
- Measurable ratios with written formulas.
- Explicit governance mode and rationale.
- Action list with named owners and due dates.

## Suggested Team Operating Model

1. Technical team runs conversion + evidence-check weekly on updated circulars/codes.
2. QP/architect/fire consultant reviews only flagged gaps and governance rationale.
3. Re-run after revisions until verdict is `accepted` or acceptable conditional acceptance.

## Browser UI Use-Case Path

The PCA Browser UI should treat TRHS as a first-class interpretation path, not just a generic compliance prompt.

Important UI/product boundary:

- TRHS should exist as one reusable use-case preset among the other Browser UI use cases
- it should not require a TRHS-only hardwired output card in the shared top-level interface
- any deeper TRHS-specific rendering should be approached later as an optional extensible pattern that other regulatory use cases can also reuse

Recommended Browser UI preset behavior:

- set `Sources To Use` to `data/trhs-text`
- use `strict` policy
- set `passStrategy` to `adaptive`
- use `high` risk level
- keep collaboration prompts focused on unresolved clauses, applicability boundaries, and evidence gaps
- preserve output as a governed interpretation record, not as a raw answer

Expected user flow in the Browser UI:

1. Convert or refresh the TRHS public corpus into `data/trhs-text`.
2. Preview sources and inspect the evidence register.
3. Run `Framework Proposal` to shape the interpretation contract.
4. Run `Research Pack` to surface contradiction risks and targeted follow-up tasks.
5. Run `Evidence Check` or `Full Pipeline` to produce a governed interpretation outcome.
6. Convert stable findings into TIR entries and route unclear items to human review.

What the Browser UI should make explicit for TRHS work:

- which authority sources were used
- what clauses appear to support the interpretation
- what project conditions still control applicability
- whether the issue is aligned, aligned-with-conditions, conflicted, or unclear
- whether the issue can proceed or must escalate to `HITL`

## Generic Regulatory Interpretation Pattern

TRHS should be developed as one domain instance of a broader regulatory interpretation pattern.

That generic pattern should support:

- clause and source parsing from public regulatory documents
- applicability framing against a project or decision context
- contradiction checks across multiple authorities or documents
- explicit interpretation proposal and critique passes
- governed assessment and route recommendation
- persistence of reusable interpretation artifacts

This keeps the Browser UI extensible for future domains beyond TRHS, such as fire code interpretation, accessibility interpretation, circular-update review, or specification-to-requirement parsing.

## GSD-Style Step Split for Regulatory Parsing

It is reasonable to borrow the spirit of GSD's step split, but adapted for regulatory interpretation rather than software delivery.

Recommended staged split:

1. Source Map
  Identify governing documents, versions, authority scope, exclusions, and corpus boundaries.
2. Corpus Preparation
  Convert PDFs, OCR where needed, normalize text, and register source folders.
3. Clause Parsing
  Segment clauses, extract candidate requirement units, and preserve traceability.
4. Applicability Framing
  Determine which clauses are actually relevant to the user's context, project type, and scenario.
5. Evidence Research
  Find support, contradictions, updates, and unresolved gaps across the corpus.
6. Interpretation Proposal
  Produce the strongest current reading with explicit assumptions and conditions.
7. Critique and Conflict Surfacing
  Challenge the proposal, surface edge cases, and separate stable interpretations from ambiguous ones.
8. Assessment and Governance
  Judge readiness, assign `aligned`, `aligned-with-conditions`, `conflicted`, or `unclear` posture, and route to `HITL/HOTL`.
9. Artifact Persistence
  Save interpretation records, open issues, and next actions for later reuse and review.

In PCA terms, these stages map naturally onto existing roles:

- Orchestrator: stages 1 to 5
- Proposer: stage 6
- Critic: stage 7
- Assessor and Governor: stage 8
- Orchestrator plus human reviewer: stage 9

## Relationship to the Earlier TRHS UI Reference

The earlier implementation at `C:\2026_Research\01_JsonL_Conversion` is a useful upstream reference, but it solves a different layer of the problem.

Use that earlier package primarily for:

- clause segmentation
- canonical JSONL conversion
- Step 1 audit and trace generation
- static requirements browsing

Use PCA for the next interpretation layer:

- cross-document evidence synthesis
- contradiction review across BCA, URA, and SCDF
- governed propose, critique, assess loops
- `HITL/HOTL` routing
- decision artifact persistence

In short:

- `01_JsonL_Conversion` turns authority text into machine-readable clause records
- PCA turns those records and the source corpus into a governed interpretation and action path
