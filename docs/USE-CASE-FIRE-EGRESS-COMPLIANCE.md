# Use Case: Fire Egress Compliance Decision Gate

This is a high-impact PCA use case for building practitioners: use local project documents to verify life-safety compliance risk before design freeze.

## Why This Use Case Matters

- Reduces late-stage redesign risk.
- Forces explicit review of code vs design contradictions.
- Produces auditable recommendations with governance (`HOTL`/`HITL`).

## Scenario

Project team needs a go/no-go decision for schematic design freeze.

Inputs (local files):

- Regulatory/code extract
- Design report
- Risk register

PCA should:

1. Ingest and normalize source documents.
2. Check cross-document support vs contradiction.
3. Assess risk posture with strict governance.
4. Produce actionable follow-up items.

## Sample Dataset

Use bundled files in:

- `examples/use-cases/fire-egress-compliance/code-extract.md`
- `examples/use-cases/fire-egress-compliance/design-report.md`
- `examples/use-cases/fire-egress-compliance/risk-register.csv`

## Step-by-Step Commands

### 1) Ingest local evidence

```bash
node bin/pca.js ingest --sources "examples/use-cases/fire-egress-compliance/code-extract.md,examples/use-cases/fire-egress-compliance/design-report.md,examples/use-cases/fire-egress-compliance/risk-register.csv"
```

### 2) Cross-document evidence check (strict policy)

```bash
node bin/pca.js evidence-check verify --decision "Can we proceed to design freeze for Block B egress package?" --context "Life-safety compliance gate before authority submission" --sources "examples/use-cases/fire-egress-compliance/code-extract.md,examples/use-cases/fire-egress-compliance/design-report.md,examples/use-cases/fire-egress-compliance/risk-register.csv" --policy strict
```

### 3) Build Propose/Critique artifacts for discussion

```bash
node bin/pca.js propose verify --decision "Design freeze readiness" --context "Fire egress compliance" --sources "examples/use-cases/fire-egress-compliance/code-extract.md,examples/use-cases/fire-egress-compliance/design-report.md"

node bin/pca.js critique verify --decision "Design freeze readiness" --proposal "Proceed with conditional freeze and mandatory corrective package" --critique "Freeze is risky if non-compliant egress geometry is unresolved" --sources "examples/use-cases/fire-egress-compliance/code-extract.md,examples/use-cases/fire-egress-compliance/design-report.md" --policy strict
```

### 4) Final assessment and persistence

```bash
node bin/pca.js assess verify --verdict needs-human-review --judgement "Cross-document contradictions indicate unresolved life-safety risk" --actions "1) widen east stair to >=1.5m; 2) reduce max travel path to <=30m; 3) remove >6m dead-end corridor; 4) add smoke-stop lobby at east core" --risk-flags "cross-document-contradictions;life-safety-critical" --policy strict

node bin/pca.js persist verify --verdict needs-human-review --judgement "HITL required before freeze" --actions "Issue corrective design instruction and reconvene with fire engineer" --risk-flags "life-safety-critical" --policy strict --output development/fire-egress-decision.json --format json
```

## Expected Outcome Pattern

- Evidence-check should surface contradictions between code requirements and design state.
- Strict policy should route to `HITL` when risk remains unresolved.
- Output should include concrete actions and owner-facing follow-ups.

## Suggested Actionable Follow-Ups

1. Assign each action to named discipline owner and target date.
2. Re-run `evidence-check` after revised drawings/specs are issued.
3. Require `accepted` or `accepted-with-conditions` (no critical flags) before submission.

## KPI Suggestions

Track these to prove practical value:

- Time-to-detect compliance contradiction (hours/days earlier).
- Number of late-stage redesign items avoided.
- Percentage of design freeze decisions with explicit evidence trace.
- Reduction in authority review comments tied to life-safety non-compliance.
