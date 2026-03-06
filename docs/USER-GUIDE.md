# PCA User Guide

This guide defines PCA operational use, command behavior, governance routing, and quality standards.

## Core Lifecycle

PCA decision lifecycle:

1. Propose: produce strongest actionable recommendation.
2. Critique: challenge assumptions, evidence, and failure modes.
3. Assess: issue final verdict and required next actions.

Verdict set:

- `accepted`
- `accepted-with-conditions`
- `needs-human-review`

## Workflow Diagram

```text
Decision + context
	  |
	  v
  Propose
	  |
	  v
  Critique
	  |
	  v
  Assess
	  |
	  +--> accepted
	  +--> accepted-with-conditions
	  +--> needs-human-review -> HITL

If risk is bounded and monitored -> HOTL
```

## Installation

```bash
npm install
```

Optional global executable:

```bash
npm install -g .
```

## Commands

### `prepare`

Builds a PCA session package with framework + prompts.

```bash
node bin/pca.js prepare discuss --decision "Should we split the service?" --context "Latency spikes at peak"
```

### `run`

Current standalone alias for `prepare`.

```bash
node bin/pca.js run verify --decision "Release readiness" --context "UAT shows intermittent errors"
```

### `route`

Maps verdict/risk to governance control (`HITL` or `HOTL`).

```bash
node bin/pca.js route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage"
```

### `assess`

Builds the full PCA assessment payload from verdict + risk context.

```bash
node bin/pca.js assess verify --verdict "accepted" --judgement "Evidence is reproducible"
```

### `persist`

Writes assessment output to disk in JSON or Markdown format.

```bash
node bin/pca.js persist verify --verdict "needs-human-review" --risk-flags "uncertain evidence" --output development/pca-assessment.json --format json
```

## Governance Model

- `HITL` (Human In The Loop): explicit human approval required.
- `HOTL` (Human On The Loop): progression allowed with monitoring.

Default escalation cues:

- `needs-human-review` verdict.
- unresolved high-risk flags.
- conflicting evidence in verify mode.

## Quality Standards (GSD-Inspired)

PCA adopts these standards:

- Deterministic machine-readable outputs (JSON-first CLI behavior).
- Clear command contracts and error messages.
- Mode-specific frameworks for discuss vs verify.
- Explicit governance routing, never implicit risk acceptance.
- Test coverage for core logic and edge cases.

## Practical Usage Guidance

Use PCA when:

- decision impact is high
- assumptions are uncertain
- evidence is incomplete or conflicting

Skip PCA when:

- tasks are low-risk and mechanical
- decision is already constrained and obvious

## Troubleshooting

- If you see `mode must be 'discuss' or 'verify'`, fix the second positional arg.
- If routing looks too strict, revisit `--verdict`, `--risk-flags`, and `--needs-human-review` values.
- If integrating with other tools, use JSON output as the stable contract.

## Contact and Q&A

- Submit a query: https://forms.gle/Qdk6xzGDchnk9h2u7
- Browse past Q&A: https://docs.google.com/spreadsheets/d/1AbtKfvaiZCV3Fq6FoAEopUGhehiDHHaapCwKvlKnKNU/edit?usp=sharing

Do not submit confidential data.
