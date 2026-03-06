# PCA JSON Contract (v0.1)

This document defines stable JSON shapes emitted by the PCA CLI.

## Compatibility Policy

- Minor releases may add optional fields.
- Existing required fields will not be removed without a major release.
- Adapters should ignore unknown fields.

## `prepare` / `run` Output

```json
{
  "mode": "discuss|verify",
  "decision": "string|null",
  "context": "string|null",
  "max_cycles": 1,
  "framework": {
    "name": "string",
    "purpose": "string",
    "universal_criteria": [
      {
        "key": "string",
        "weight": 0.2,
        "question": "string"
      }
    ],
    "criteria": [
      {
        "key": "string",
        "weight": 0.2,
        "question": "string"
      }
    ]
  },
  "prompts": {
    "proposal": "string",
    "critic": "string",
    "assess": "string"
  }
}
```

Required fields:
- `mode`
- `max_cycles`
- `framework`
- `prompts`

## `route` / `assess` Output

```json
{
  "mode": "discuss|verify",
  "verdict": "accepted|accepted-with-conditions|needs-human-review",
  "judgement": "string|null",
  "actions": "string|null",
  "risk_flags": ["string"],
  "needs_human_review": true,
  "human_control": {
    "recommended_mode": "HITL|HOTL",
    "reason": "string"
  }
}
```

Required fields:
- `mode`
- `verdict`
- `risk_flags`
- `needs_human_review`
- `human_control`

## `persist` Output

```json
{
  "persisted": true,
  "output_path": "string",
  "format": "json|md",
  "result": {
    "mode": "discuss|verify",
    "verdict": "accepted|accepted-with-conditions|needs-human-review",
    "judgement": "string|null",
    "actions": "string|null",
    "risk_flags": ["string"],
    "needs_human_review": true,
    "human_control": {
      "recommended_mode": "HITL|HOTL",
      "reason": "string"
    }
  }
}
```

Required fields:
- `persisted`
- `output_path`
- `format`
- `result`

## Error Contract

Errors are emitted on stderr and exit non-zero:

```text
Error: <message>
```

Common messages:
- `Usage: pca <prepare|run|route|assess|persist> <discuss|verify> ...`
- `mode must be 'discuss' or 'verify'`
- `persist requires --output <path>`
