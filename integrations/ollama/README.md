# Ollama Integration (Free/Open Local Models)

This adapter lets PCA run on local OSS models via Ollama, without paid API keys.

## Prerequisites

1. Install Ollama: https://ollama.com/download
2. Start Ollama service.
3. Pull at least one model:

```bash
ollama pull qwen2.5:7b
ollama pull llama3.1:8b
ollama pull qwen2.5:14b
```

## Run PCA With Local Models

```bash
node integrations/ollama/adapter.js discuss \
  --decision "Should we split the service?" \
  --context "Latency spikes and ownership confusion" \
  --model-proposal qwen2.5:7b \
  --model-critic llama3.1:8b \
  --model-assess qwen2.5:14b
```

Power controls:

```bash
node integrations/ollama/adapter.js verify \
  --decision "Release gate" \
  --policy strict \
  --topology multi-critic \
  --max-cycles 4 \
  --scores "evidence_quality=4;release_safety=3.5" \
  --risk-flags "partial coverage"
```

## Flags

- `--decision <text>`: decision focus.
- `--context <text>`: optional context.
- `--model-proposal <name>`: model for proposal role.
- `--model-critic <name>`: model for critic role.
- `--model-assess <name>`: model for assessor role.
- `--ollama-url <url>`: default `http://localhost:11434`.
- `--policy <fast|balanced|strict>`: governance profile.
- `--topology <single-critic|multi-critic|red-team>`: critic orchestration shape.
- `--max-cycles <1..5>`: workflow cycle budget.
- `--scores <k=v;...>`: optional weighted criterion input.
- `--risk-flags <text>`: optional risk list.
- `--needs-human-review <true|false>`: explicit governance override.

## Notes

- This template is intentionally simple and stateless.
- It returns a full PCA JSON payload including role outputs and assessment.
- For production use, add retry logic, timeouts, and output validation.
