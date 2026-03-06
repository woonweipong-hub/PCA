# BYOM Adapter (OpenAI-Compatible)

This adapter lets users bring their own model provider by targeting any OpenAI-compatible `chat/completions` endpoint.

Supported patterns include:

- OpenAI-compatible self-hosted gateways (vLLM, LM Studio, LocalAI)
- OpenRouter-style compatible endpoints
- Managed providers exposing OpenAI-compatible APIs

## Quick Start

```bash
node integrations/byom/adapter.js verify \
  --decision "Release readiness" \
  --context "Cross-document evidence review" \
  --endpoint "http://localhost:11434/v1" \
  --api-key "none" \
  --model-proposal "qwen2.5:7b" \
  --model-critic "llama3.1:8b" \
  --model-assess "qwen2.5:14b" \
  --policy strict
```

## Environment Variables

You can avoid passing flags every run:

- `PCA_BYOM_ENDPOINT`
- `PCA_BYOM_API_KEY`
- `PCA_MODEL_PROPOSAL`
- `PCA_MODEL_CRITIC`
- `PCA_MODEL_ASSESS`
- `PCA_POLICY`
- `PCA_TOPOLOGY`
- `PCA_MAX_CYCLES`
- `PCA_MODEL_TEMPERATURE`

## Notes

- The adapter keeps `src/pca-core.js` model-agnostic.
- Governance and HITL/HOTL routing still come from PCA core policy logic.
- For local free setup, `integrations/ollama/adapter.js` remains the fastest path.
