# Copilot Integration (Template)

This integration maps Copilot prompts/workflows into PCA commands.

## Suggested Pattern

1. Build PCA session:

```bash
node bin/pca.js prepare discuss --decision "..." --context "..."
```

2. Run Propose/Critique/Assess in your Copilot orchestration.

3. Route governance from verdict:

```bash
node bin/pca.js route verify --verdict "accepted-with-conditions" --risk-flags "..."
```

## Notes

- Treat PCA outputs as the source of truth.
- Keep adapter logic thin and stateless.
- Prefer JSON exchange, not fragile text parsing.
