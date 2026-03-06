# PCA JSON Contract (v0.2)

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
  "workflow": {
    "diagram_policy": "auto|always|never",
    "diagram_recommended": true,
    "diagram_included": true,
    "diagram_mermaid": "string|null"
  },
  "orchestration": {
    "name": "single-critic|multi-critic|red-team",
    "critic_agents": 1,
    "synthesis_required": false,
    "recommended_max_cycles": 2,
    "cycle_pressure": "high|normal"
  },
  "governance_policy": {
    "name": "fast|balanced|strict",
    "min_weighted_score_100_for_hotl": 60,
    "min_coverage_ratio_for_hotl": 0.35,
    "hitl_on_any_risk_flag": false,
    "hitl_on_low_score": true
  },
  "framework": {
    "name": "string",
    "purpose": "string",
    "universal_criteria": [{ "key": "string", "weight": 0.2, "question": "string" }],
    "criteria": [{ "key": "string", "weight": 0.2, "question": "string" }]
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
- `workflow`
- `orchestration`
- `governance_policy`
- `framework`
- `prompts`

## `propose` Output

```json
{
  "mode": "discuss|verify",
  "role": "proposer",
  "decision": "string|null",
  "context": "string|null",
  "prompt": "string",
  "proposal": "string|null",
  "evidence_digest": {
    "source_count": 2,
    "total_claims": 12,
    "total_words": 1480
  },
  "next_step": "string"
}
```

Required fields:
- `mode`
- `role`
- `prompt`
- `next_step`

## `critique` Output

```json
{
  "mode": "discuss|verify",
  "role": "critic",
  "decision": "string|null",
  "context": "string|null",
  "proposal": "string|null",
  "prompt": "string",
  "critique": "string|null",
  "extracted_risk_flags": ["string"],
  "evidence_digest": {
    "source_count": 2,
    "total_claims": 12,
    "total_words": 1480
  },
  "next_step": "string"
}
```

Required fields:
- `mode`
- `role`
- `prompt`
- `extracted_risk_flags`
- `next_step`

## `route` / `assess` Output

```json
{
  "mode": "discuss|verify",
  "verdict": "accepted|accepted-with-conditions|needs-human-review",
  "judgement": "string|null",
  "actions": "string|null",
  "risk_flags": ["string"],
  "score_summary": {
    "scale": { "min": 0, "max": 5 },
    "coverage": { "provided": 3, "total": 9, "ratio": 0.3333 },
    "weighted_score_5": 3.8,
    "weighted_score_100": 76.0,
    "band": "high|medium|low|insufficient-data",
    "criteria": [{ "key": "string", "weight": 0.08, "score": 4 }]
  },
  "needs_human_review": true,
  "human_control": {
    "recommended_mode": "HITL|HOTL",
    "reason": "string",
    "policy_applied": {
      "name": "fast|balanced|strict",
      "min_weighted_score_100_for_hotl": 60,
      "min_coverage_ratio_for_hotl": 0.35,
      "hitl_on_any_risk_flag": false,
      "hitl_on_low_score": true
    }
  }
}
```

Required fields:
- `mode`
- `verdict`
- `risk_flags`
- `score_summary`
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
    "score_summary": {
      "scale": { "min": 0, "max": 5 },
      "coverage": { "provided": 3, "total": 9, "ratio": 0.3333 },
      "weighted_score_5": 3.8,
      "weighted_score_100": 76.0,
      "band": "high|medium|low|insufficient-data",
      "criteria": [{ "key": "string", "weight": 0.08, "score": 4 }]
    },
    "needs_human_review": true,
    "human_control": {
      "recommended_mode": "HITL|HOTL",
      "reason": "string",
      "policy_applied": {
        "name": "fast|balanced|strict"
      }
    }
  }
}
```

Required fields:
- `persisted`
- `output_path`
- `format`
- `result`

## `ingest` Output

```json
{
  "source_roots": ["string"],
  "discovered_files": 120,
  "selected_files": 80,
  "skipped_files": 40,
  "source_count": 2,
  "total_claims": 12,
  "total_words": 1480,
  "documents": [
    {
      "source": "string",
      "word_count": 500,
      "claim_count": 6,
      "claims": [
        {
          "claim_id": "string",
          "text": "string",
          "tokens": ["string"],
          "has_negation": false
        }
      ]
    }
  ]
}
```

Required fields:
- `source_roots`
- `discovered_files`
- `selected_files`
- `skipped_files`
- `source_count`
- `total_claims`
- `total_words`
- `documents`

## `quality-check` Output

```json
{
  "source_roots": ["string"],
  "discovered_files": 120,
  "selected_files": 80,
  "skipped_files": 40,
  "source_count": 2,
  "total_claims": 12,
  "total_words": 1480,
  "average_claims_per_document": 6,
  "checks": [
    {
      "key": "min_sources|min_total_claims|min_avg_claims_per_doc",
      "actual": 2,
      "threshold": 2,
      "pass": true
    }
  ],
  "quality_gate": {
    "ready_for_evidence_check": true,
    "passed_checks": 3,
    "total_checks": 3,
    "failed_checks": ["string"],
    "recommendation": "string"
  }
}
```

Required fields:
- `source_roots`
- `discovered_files`
- `selected_files`
- `skipped_files`
- `source_count`
- `total_claims`
- `total_words`
- `average_claims_per_document`
- `checks`
- `quality_gate`

## `evidence-check` Output

```json
{
  "mode": "discuss|verify",
  "decision": "string|null",
  "context": "string|null",
  "evidence": {
    "source_roots": ["string"],
    "discovered_files": 120,
    "selected_files": 80,
    "skipped_files": 40,
    "source_count": 2,
    "total_claims": 12,
    "total_words": 1480,
    "documents": [
      {
        "source": "string",
        "word_count": 500,
        "claim_count": 6,
        "claims": [
          {
            "claim_id": "string",
            "text": "string",
            "tokens": ["string"],
            "has_negation": false
          }
        ]
      }
    ],
    "links": [
      {
        "left_source": "string",
        "left_claim_id": "string",
        "right_source": "string",
        "right_claim_id": "string",
        "relation": "support|contradiction",
        "similarity": 0.42
      }
    ],
    "metrics": {
      "support_count": 5,
      "contradiction_count": 1,
      "corroboration_ratio": 0.83,
      "contradiction_ratio": 0.17,
      "source_coverage_ratio": 0.66
    }
  },
  "assessment": {
    "mode": "discuss|verify",
    "verdict": "accepted|accepted-with-conditions|needs-human-review",
    "judgement": "string|null",
    "actions": "string|null",
    "risk_flags": ["string"],
    "score_summary": {
      "scale": { "min": 0, "max": 5 },
      "coverage": { "provided": 3, "total": 9, "ratio": 0.3333 },
      "weighted_score_5": 3.8,
      "weighted_score_100": 76.0,
      "band": "high|medium|low|insufficient-data",
      "criteria": [{ "key": "string", "weight": 0.08, "score": 4 }]
    },
    "needs_human_review": true,
    "human_control": {
      "recommended_mode": "HITL|HOTL",
      "reason": "string",
      "policy_applied": {
        "name": "fast|balanced|strict"
      }
    }
  }
}
```

Required fields:
- `mode`
- `evidence`
- `assessment`

## Error Contract

Errors are emitted on stderr and exit non-zero:

```text
Error: <message>
```

Common messages:
- `Usage: pca <prepare|run|propose|critique|route|assess|persist|ingest|quality-check|evidence-check> ...`
- `mode must be 'discuss' or 'verify'`
- `diagram policy must be 'auto', 'always', or 'never'`
- `policy must be 'fast', 'balanced', or 'strict'`
- `topology must be 'single-critic', 'multi-critic', or 'red-team'`
- `ingest requires --sources <path1,path2,...>`
- `persist requires --output <path>`
