# Runbook: HITL Escalation

## Purpose

Define required actions when PCA recommends `HITL`.

## Trigger

Any output where:

- `human_control.recommended_mode = "HITL"`, or
- `verdict = "needs-human-review"`

## Procedure

1. Freeze automated progression for the current decision.
2. Review evidence summary:
- contradictions
- low coverage
- risk flags
3. Assign human reviewer (QP/domain lead).
4. Record decision and rationale in persisted artifact.

Example persistence update:

```bash
node bin/pca.js persist verify --verdict "needs-human-review" --judgement "Manual review required due to low evidence coverage" --actions "1) request source clarification; 2) rerun quality-check; 3) rerun evidence-check" --risk-flags "low-cross-document-linkage" --policy strict --output outputs/hitl-escalation.json --format json
```

## Exit Criteria

- Reviewer signs off to proceed (HOTL) with conditions, or
- Additional data collected and rerun yields acceptable risk posture.
