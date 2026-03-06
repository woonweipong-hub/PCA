# Antigravity Integration

This guide shows how to use PCA effectively with Antigravity.

## What Works

- PCA CLI commands run directly in Antigravity terminal/session.
- PCA Web UI runs as a local Node service and can be opened in browser.
- Recommended pattern: Antigravity orchestrates commands, browser UI handles visual control/downloads.

PCA is designed to sit on top of runtime models/tools: Antigravity can keep executing tasks while PCA governs debate structure, evidence quality, and HITL/HOTL outcomes.

## Quick Setup

1. Install Node dependencies:
```bash
npm install
```

2. Enable PCA Slash Commands in Antigravity:
To make the `/PCA` and `/GSD` agent modes available in Antigravity's chat interface, you must copy the agent definition files into Antigravity's workflow directory. Run this command:

```bash
mkdir -p .agents/workflows
cp .github/agents/*.* .agents/workflows/
```

*Note: After running this, run the VS Code command `Developer: Reload Window` (`Ctrl+Shift+P` → `Developer: Reload Window`) or open a new chat to refresh Antigravity's cache so the slash commands appear.*

## Where PCA Appears in Antigravity

Antigravity has two separate selection mechanisms. PCA uses **slash commands**, not the mode dropdown.

| Feature | Examples | How to Access | Customizable? |
| --- | --- | --- | --- |
| **Mode Dropdown** (top of chat) | Fast, Planning | Click the mode selector at the top of the chat panel | No — these are built-in Antigravity intelligence modes that control reasoning depth |
| **Slash Commands** (chat input) | `/PCA 0 Auto Flow`, `/GSD 1 Roadmap Builder` | Type `/` in the chat input box | Yes — loaded from `.agents/workflows/` in the workspace |

PCA agents appear as slash commands because each one carries its own full system prompt, constraints, output format, and governed behavior. This is functionally equivalent to a mode switch: once you invoke a PCA slash command, the entire conversation follows that agent's governed method.

## PCA Agent Modes

After setup, the following PCA agents are available as slash commands:

| Slash Command | Role | When to Use |
| --- | --- | --- |
| `/PCA 0 Auto Flow` | Autonomous full PCA run | You want one entrypoint that frames, debates, assesses, and routes automatically |
| `/PCA 1 Orchestrator` | Problem framing and workflow selection | You want to structure the decision before running individual stages |
| `/PCA 2 Proposer` | Generate the strongest current option | You want a focused proposal without critique yet |
| `/PCA 3 Critic` | Challenge assumptions and expose risks | You have a proposal and want it stress-tested |
| `/PCA 4 Assessor` | Produce verdict after proposal and critique | You want a final judgement with actions and readiness view |
| `/PCA 5 Governor` | Governance gate and routing | You want a `HITL`/`HOTL` routing decision before execution |

### How to Use

1. Open a **new chat** in Antigravity.
2. Type **`/`** in the chat input box.
3. Select the PCA agent you want (e.g. `/PCA 0 Auto Flow`).
4. Type your decision, question, or context after it.

For a fully autonomous governed run, use `/PCA 0 Auto Flow`.

For step-by-step stage control, use `/PCA 1 Orchestrator` first, then move through `/PCA 2 Proposer` → `/PCA 3 Critic` → `/PCA 4 Assessor` → `/PCA 5 Governor` as needed.

## Pattern A: Antigravity CLI-Only Workflow

Run in Antigravity terminal/session:

```bash
npm run convert:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
node bin/pca.js evidence-check verify --decision "Interpret requirements" --context "Cross-document consistency check" --sources "data/public-pdf-text" --policy strict --max-files 200 --prioritize-requirements true
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked conditions" --actions "Assign owners and due dates" --policy strict --output outputs/antigravity-decision.json --format json
```

## Pattern B: Hybrid (Antigravity + Web UI)

1. Start UI locally:

```bash
npm run ui:start
```

2. Open browser:

- `http://localhost:4173`

3. Use Antigravity for orchestration prompts and command sequencing.
4. Use Web UI for:
- run status visibility
- live proposer/critic/assessor timeline (`Run Live Debate x3`)
- quality/evidence result review
- artifact download

## OCR and Scanned PDF Recovery

If dataset is scanned/image-heavy:

```bash
npm run ocr:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-ocr" --recursive true --language eng
npm run convert:pdf -- --input-dir "data/public-pdf-ocr" --output-dir "data/public-pdf-text" --recursive true
```

Then rerun quality/evidence checks.

## HITL/HOTL Use in Antigravity Flow

- If output recommends `HOTL`, proceed with monitored execution.
- If output recommends `HITL`, stop automation and run human review process.

Reference:

- `docs/RUNBOOK-HITL-ESCALATION.md`

## Operational Tips

- Keep confidential file exclusions explicit in conversion stage.
- Always run `quality-check` before `evidence-check` on heterogeneous corpora.
- Persist decision artifacts for audit and handoff.
