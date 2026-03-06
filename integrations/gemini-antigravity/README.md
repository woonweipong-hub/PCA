# Gemini Antigravity Integration (Template)

This integration maps Antigravity/Gemini workflows into PCA commands.

## Suggested Pattern

```bash
node bin/pca.js prepare discuss --decision "scope framing" --context "phase constraints"
node bin/pca.js route verify --verdict "needs-human-review" --needs-human-review true
```

## Runtime Guidance

- Keep prompts concise and evidence-based.
- Apply PCA only for ambiguous/high-impact decisions.
- Escalate with `HITL` for unresolved high-risk states.
