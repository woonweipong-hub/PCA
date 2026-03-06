# Gemini Antigravity Integration (Orchestration Surface)

Use PCA as the governed decision layer above Antigravity execution and orchestration.

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
- Apply PCA on ambiguous, high-impact, or multi-source decisions.
- Escalate with `HITL` for unresolved high-risk states.

## Runtime Verification (After Copilot)

Once Copilot smoke passes, run Antigravity smoke:

```bash
npm run smoke:antigravity
```

For full sequential validation in one command:

```bash
npm run smoke:runtimes
```
