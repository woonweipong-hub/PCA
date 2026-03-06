# PCA Model Routing Guide

This guide explains how PCA can run across multiple AI models, including free/open local options.

## Can People Just Install and Use?

Yes.

Fastest free/open route:

1. Install Ollama.
2. Pull open models.
3. Run `integrations/ollama/adapter.js`.

No paid API is required for this path.

## Routing Modes

### 1) Single-Model

Use one model for all roles.

Best for:
- low setup overhead
- lightweight experimentation

### 2) Split-Role (Recommended)

Assign different models per role:

- Proposal: creative model
- Critic: conservative/challenger model
- Assess: stable reasoning model

Best for:
- stronger debate quality
- clearer role separation

### 3) Hybrid Cost-Aware

Default to local free/open models, then escalate only when policy or risk triggers require it.

Best for:
- cost control
- preserving strong quality gates

## Suggested Free/Open Baselines

- Proposal: `qwen2.5:7b`
- Critic: `llama3.1:8b`
- Assess: `qwen2.5:14b`

Tune by hardware limits and response quality.

## Policy-Driven Escalation

Use PCA profiles:

- `fast`: lower threshold, less escalation
- `balanced`: default threshold
- `strict`: strongest escalation posture

When running `strict`, escalate to human review if:

- score coverage is low
- weighted score is weak
- unresolved risk flags remain

## Example Config Shape

```json
{
  "runtime": "ollama",
  "policy": "balanced",
  "topology": "multi-critic",
  "models": {
    "proposal": "qwen2.5:7b",
    "critic": "llama3.1:8b",
    "assess": "qwen2.5:14b"
  },
  "fallback": {
    "enabled": true,
    "on": ["strict-policy", "low-score"],
    "provider": "premium"
  }
}
```

## Integration Principles

- Keep `src/pca-core.js` model-agnostic.
- Keep adapters thin and replaceable.
- Exchange structured JSON, not fragile prompt text parsing.
- Persist final assessments for auditability.
