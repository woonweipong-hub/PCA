# Gemini Antigravity Integration (Overlay Pattern)

Use PCA as a policy and debate layer above Antigravity execution.

## Suggested Pattern

```bash
node bin/pca.js prepare discuss --decision "scope framing" --context "phase constraints"
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6
node bin/pca.js evidence-check verify --decision "scope framing" --context "phase constraints" --sources "data/public-pdf-text" --policy strict
```

## Continuous Debate Visibility

1. Start PCA Web UI: `npm run ui:start`
2. Open `http://localhost:4173`
3. Click `Run Live Debate x3`
4. Review timeline + final human checkpoint before Antigravity proceeds

## Runtime Guidance

- Keep prompts concise and evidence-based.
- Apply PCA on ambiguous or high-impact decisions.
- Escalate with `HITL` for unresolved high-risk states.
