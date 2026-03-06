# PCA

PCA (Propose-Critique-Assess) is an Evidence-Governed Adaptive Solver.

It applies structured debate, quality checks, and explicit governance (`HITL`/`HOTL`) to improve decision quality before execution.

"This project is independently developed. Any similarity to other systems reflects common industry patterns (for example proposer/critic/evaluator workflows) and does not imply code, prompt, or proprietary method reuse."

```text
██████╗   ██████╗    █████╗
██╔══██╗ ██╔════╝   ██╔══██╗
██████╔╝ ██║        ███████║
██╔═══╝  ██║        ██╔══██║
██║      ╚██████╗   ██║  ██║
╚═╝       ╚═════╝   ╚═╝  ╚═╝
```

## About The Author

I am a trained building architect and a public servant, not a professional coder. I use AI to work smarter and build practical tools for the building and construction industry. My current work focuses on automating compliance checks, improving design workflows, and exploring multi-agent AI patterns that help practitioners deliver safer, higher-quality buildings with less manual effort.

LinkedIn: `https://www.linkedin.com/in/woonwei/`

## Why PCA

- Independent workflow: use PCA in any project or stack.
- Quality-first: force assumptions and risks into the open.
- Traceable outputs: verdict + actions + risk flags.
- Governance-ready: clear routing to `HITL` or `HOTL`.

## Problem Statement

Human-machine collaboration often breaks down in two predictable ways:

- humans do not always know what they do not know, especially in ambiguous or high-stakes problems
- machines can generate fast answers, but they do not automatically understand what the human actually needs, what must be challenged, or when a decision should be escalated

In normal one-pass long conversations, these weaknesses compound over time. Important assumptions stay hidden, weak proposals go unchallenged, contradictions are missed, and the conversation often drifts toward whichever answer sounds plausible first.

PCA is designed to solve that failure mode. It turns a long, fragile, one-pass interaction into a governed decision loop that can expose assumptions, challenge weak logic, check evidence, and produce an actionable outcome with explicit human control.

## What PCA Can Do

PCA can be used as a general-purpose human-machine decision system for any domain where quality, traceability, and governance matter.

- Frame a problem clearly using objective, context, expectations, constraints, and policy.
- Generate structured multi-step reasoning instead of relying on a single-pass answer.
- Run `Propose -> Critique -> Assess` loops to test options before action.
- Ingest local documents and datasets and build an evidence digest from them.
- Run quality gates before deeper evidence analysis.
- Detect support, contradiction, coverage, and confidence patterns across multiple sources.
- Apply governance checks before moving from reasoning into action.
- Route outputs explicitly to `HOTL` or `HITL` depending on risk and readiness.
- Add optional symbolic validation with Z3 for hard constraints and feasibility checks.
- Produce audit-friendly artifacts for handoff, review, and repeatable execution.
- Work across Copilot, Antigravity, local terminal workflows, BYOM, Ollama, and browser-based UI/API usage.
- Expose PCA-native agent modes in VS Code for orchestrator, proposer, critic, assessor, and governor workflows.

## Human-Machine Co-Working Method

PCA is built around the idea that human and machine should not behave as substitutes for one another. They should compensate for each other's blind spots.

- The human provides intent, judgement context, priorities, and accountability.
- The machine provides structure, memory, iteration, critique pressure, and evidence synthesis.
- PCA provides the operating method that keeps both sides aligned.

Instead of depending on one long conversation to carry everything, PCA breaks work into a repeatable loop:

1. `Propose`: generate the strongest current option.
2. `Critique`: challenge assumptions, gaps, risks, and contradictions.
3. `Assess`: decide what holds, what fails, and what needs human review.

That loop improves normal AI-assisted work in four important ways:

- it reduces premature convergence on the first plausible answer
- it makes hidden assumptions visible earlier
- it creates explicit decision points instead of conversational drift
- it produces outputs that are easier to review, reuse, and automate

## Traceability and Transparency

PCA is designed to make decision work inspectable without depending on opaque one-pass conversations.

- It records structured decision artifacts rather than leaving important logic scattered across chat history.
- It preserves the chain of decision development through proposal, critique, assessment, evidence checks, gates, and final routing.
- It makes it easier for a human reviewer to understand what was proposed, what was challenged, what evidence was used, and why a decision was accepted, conditioned, or escalated.
- It supports human-machine teamwork by making the handoff points explicit instead of implicit.

This makes PCA suitable for human-machine:

- co-creation: shaping options together instead of accepting the first generated answer
- co-checks: reviewing claims, contradictions, risk flags, and gate outcomes together
- co-tasking: moving from reasoning into action with explicit ownership, readiness, and escalation logic

In PCA, transparency does not mean dumping unrestricted hidden reasoning. It means producing a usable, reviewable structured reasoning trail:

- objective and context
- evidence and corpus coverage
- proposal summary
- critique summary
- assessment verdict
- verify-gate status
- route recommendation
- persisted artifact for review, audit, or execution handoff

## How PCA Supports Existing Copilot Work

PCA is not intended to replace Copilot. It makes Copilot-assisted work more reliable.

- Copilot remains strong at fast drafting, coding, searching, and implementation assistance.
- PCA adds structure around framing, critique, evidence checking, governance, and action readiness.
- Copilot helps move quickly; PCA helps make sure the work is actually pointed in the right direction and safe to proceed.

In practice, this means PCA can streamline normal Copilot use by converting a long free-form chat into a more deliberate flow:

- frame the decision
- gather evidence
- run proposal and critique passes
- assess readiness and risk
- route to `HOTL` or `HITL`
- persist the result for action and review

This is especially useful for work that is ambiguous, multi-document, high-impact, or easy to get wrong with a single conversational pass.

## Robustness Acknowledgement

PCA now includes optional Python symbolic verification support via `z3-solver` (`requirements-z3.txt`).
This strengthens robustness by pairing qualitative reasoning (`Propose -> Critique -> Assess`) with formal feasibility checks (`sat/unsat`) inside verify gates and routing decisions.

## Intent and Outcomes

PCA is designed to convert ambiguous multi-source decisions into structured, auditable outputs.

Intent:

- Build evidence from local sources in a repeatable way.
- Expose support and contradiction signals across documents.
- Produce explicit governance routing instead of implicit judgement.
- Preserve decision traceability for human review and automation.

Primary outputs:

- Evidence digest (`ingest`): source coverage, extracted claims, and corpus metrics.
- Evidence assessment (`evidence-check`): cross-document links (`support`/`contradiction`) plus evidence metrics.
- Governance decision (`route`/`assess`): verdict, risk flags, score summary, and `HITL`/`HOTL` recommendation.
- Persisted artifact (`persist`): stable JSON/Markdown record for audit trails and handoff.

Expected outcomes:

- Faster interpretation of large datasets.
- More consistent decision quality across runs and operators.
- Clear escalation criteria when confidence, coverage, or risk posture is insufficient.
- Better downstream execution safety via explicit human control gates.
- Better traceability across the full human-machine decision loop.

Contract details for all outputs are defined in `SCHEMA.md`.

Prior art and acknowledgement log: `docs/PRIOR-ART.md`.

## Workflow Diagram

```mermaid
flowchart TD
  A[Input Data Requirements Objectives] --> B[Organize]
  B --> C[Propose]
  C --> D[Critique]
  D --> E[Assess]

  Q[Qualitative Rubrics] -.-> C
  Q -.-> D
  Q -.-> E

  S[Symbolic Checks Z3] --> V{Verify Gates Passed}
  E --> V

  X[Adaptive Depth by Risk] -.-> C

  V -- No --> C
  V -- Yes --> G[Recommend]
  G --> AC[Action Contract]
  AC --> R{Route HITL HOTL}
  R -- HITL --> H[Human Approval]
  R -- HOTL --> M[Monitored Progression]

  H --> ER{Execution Readiness}
  M --> ER
  ER -- Ready --> I[Implement]
  ER -- Blocked --> C

  I --> D1[Document Evidence]
  D1 --> O[Observe Outcomes]
  O --> L[Learn Update Corpus]
  L --> N{Drift or New Risk}
  N -- Yes --> B
  N -- No --> Z[Outcome Delivered]
```

Operational rule: move forward only when qualitative assessment, symbolic feasibility, and execution readiness are all satisfied; otherwise loop back through `Propose -> Critique -> Assess` with updated evidence and constraints.

### Lifecycle (PCA Native ASCII)

```text
  ┌──────────────────────────────────────────────────────────┐
  │                     PCA DECISION RUN                     │
  │ Intake + Corpus + Objectives + Constraints + Policy      │
  │ + Risk Profile                                           │
  └─────────────────────────────┬────────────────────────────┘
                                │
                ┌───────────────▼────────────────┐
                │ ADAPTIVE DEPTH PLANNER         │
                │ 1 pass / 2 passes / 3 passes   │
                └───────────────┬────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │ PASS LOOP                                                │
  │ Organize -> Propose -> Critique -> Assess                │
  │ Update confidence, coverage, risk, assumptions           │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │ GOVERNANCE GATE                                          │
  │ Evidence checks + policy thresholds + optional Z3        │
  └─────────────────────────────┬────────────────────────────┘
                   gate fail <--┘
                                │
                                │
                            gate pass
  ┌─────────────────────────────▼────────────────────────────┐
  │ ACTION PACKAGE                                           │
  │ Recommendation + contract + owner + due + rollback       │
  └─────────────────────────────┬────────────────────────────┘
                                │
                ┌───────────────▼────────────────┐
                │ ROUTING + READINESS CHECK      │
                │ HITL / HOTL + implementation   │
                └───────────────┬────────────────┘
                     blocked <--┘
                                │
                                │
                              ready
  ┌─────────────────────────────▼────────────────────────────┐
  │ EXECUTE -> OBSERVE -> CAPTURE -> LEARN -> RE-INGEST      │
  └──────────────────────────────────────────────────────────┘
```

### Execution Orchestration (PCA Native ASCII)

```text
  ┌──────────────────────────────────────────────────────────┐
  │              PCA PARALLEL ORCHESTRATION VIEW             │
  ├──────────────────────────────────────────────────────────┤
  │                                                          │
  │ STREAM A            STREAM B            STREAM C         │
  │ evidence            reasoning           action           │
  │ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
  │ │ Collect Docs │    │ Propose      │    │ Draft Action │ │
  │ │ Normalize Ref│    │ Critique     │    │ Contract     │ │
  │ └──────┬───────┘    │ Assess       │    └──────┬───────┘ │
  │        │            └──────┬───────┘           │         │
  │        │                   │                   │         │
  │        └───────────────────┬───────────────────┘         │
  │                            │                             │
  │                   ┌────────▼─────────┐                   │
  │                   │ Governance Merge │                   │
  │                   │ evidence policy  │                   │
  │                   │ and Z3 checks    │                   │
  │                   └────────┬─────────┘                   │
  │                            │                             │
  │                 fail loop  │  pass route readiness       │
  │                 ┌──────────▼───────────┐                 │
  │                 │ Execute and Monitor  │                 │
  │                 │ Feed next cycle      │                 │
  │                 └──────────────────────┘                 │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

## Role and Agent Showcase

| Role | Typical Owner | Responsibility |
|---|---|---|
| Requester | Human | Provides decision and context |
| Orchestrator | AI agent or automation | Runs CLI commands and coordinates flow |
| Proposer | AI agent | Produces recommendation and assumptions |
| Critic | AI agent | Challenges recommendation and exposes risk |
| Assessor | AI agent | Produces verdict and required actions |
| Human Reviewer | Human | Final authority for HITL escalations |

Detailed workflow, swimlanes, and agent topology: `docs/WORKFLOW.md`

## Installation

If you are using PCA in VS Code, start with the `VS Code Quick Start` section in `docs/USER-GUIDE.md`.

The same User Guide also includes `Antigravity Quick Start`, `Browser UI Quick Start`, and `Which Mode To Choose` for different user needs.

Workspace-level PCA custom agents are also available under `.github/agents/` for the VS Code agent picker.

### Local dev usage

```bash
npm install
node bin/pca.js prepare discuss --decision "API strategy" --context "Migrate safely"
```

### Optional global CLI usage

```bash
npm install -g .
pca prepare discuss --decision "Architecture framing" --context "Phase 1 migration"
```

## Web UI

PCA includes a local-first web UI for running OCR, conversion, quality checks, evidence checks, and downloading run artifacts.

```bash
npm run ui:start
```

Open `http://localhost:4173`.

Web UI guide (local + online deployment): `docs/WEB-UI.md`

Antigravity integration guide (CLI-only and hybrid UI workflows): `docs/ANTIGRAVITY-INTEGRATION.md`

## Command Reference

| Command | Purpose | Output |
|---|---|---|
| `pca prepare <discuss|verify>` | Build PCA session contract (framework + prompts) | JSON session object |
| `pca run <discuss|verify>` | Current alias of `prepare` for standalone MVP | JSON session object |
| `pca propose <discuss|verify>` | Build proposer payload and prompt | JSON proposer object |
| `pca critique <discuss|verify>` | Build critic payload, prompt, and extracted risks | JSON critic object |
| `pca route <discuss|verify>` | Compute governance routing from verdict/risk | JSON with `human_control` |
| `pca assess <discuss|verify>` | Build final PCA assessment payload | JSON assessment object |
| `pca persist <discuss|verify>` | Save assessment output to disk | JSON receipt + saved file |
| `pca ingest` | Ingest local sources into claim digest | JSON evidence digest |
| `pca quality-check` | Validate corpus quality before evidence-check | JSON quality gate report |
| `pca evidence-check <discuss|verify>` | Cross-document support/contradiction checks + assessment | JSON evidence + assessment |
| `pca help` | Show CLI usage and examples | Plain text reference |

Detailed per-command reference: `docs/COMMAND-REFERENCE.md`

VS Code terminal and runtime quick guide: `docs/VS-CODE-CLI-CHEATSHEET.md`

TRHS PDF workflow (URA/BCA/SCDF, including confidential-file exclusion): `docs/USER-GUIDE.md#trhs-workflow-ura-bca-scdf`

Framework positioning note: PCA is domain-agnostic. TRHS, fire-egress, and agentic pipeline documents are optional use-case implementations on top of the same core framework.

## Example Commands

```bash
# Discuss framing
node bin/pca.js prepare discuss --decision "service boundary" --context "latency and ownership"

# Verify risk routing
node bin/pca.js route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage"

# Role payloads for Propose and Critique
node bin/pca.js propose discuss --decision "service boundary" --sources "reports/a.md,reports/b.md"
node bin/pca.js critique discuss --decision "service boundary" --proposal "split by domain" --critique "Risk due to missing ownership model"

# Build final assessment payload
node bin/pca.js assess verify --verdict "accepted" --judgement "Evidence is reproducible"

# Persist assessment to markdown
node bin/pca.js persist verify --verdict "needs-human-review" --risk-flags "uncertain evidence" --output development/pca-assessment.md --format md

# Force human decision
node bin/pca.js route verify --verdict "needs-human-review" --needs-human-review true

# Ingest local documents/datasets (local server path)
node bin/pca.js ingest --sources "reports/a.md,reports/b.json,reports/c.csv"

# Batch convert any PDF folder to text for ingestion
npm run convert:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-text" --recursive true

# Optional OCR pre-step for scanned/image-only PDFs
npm run ocr:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-ocr" --recursive true --language eng
npm run convert:pdf -- --input-dir "data/public-pdf-ocr" --output-dir "data/public-pdf-text" --recursive true

# Batch convert URA/BCA/SCDF PDFs to text (excludes confidential correspondence by default)
npm run convert:trhs

# Quality gate before running evidence checks
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6

# Cross-document evidence check with strict governance
node bin/pca.js evidence-check verify --decision "release gate" --sources "reports/a.md,reports/b.md" --policy strict

# Interpret converted large asset folder (requirements-prioritized)
node bin/pca.js evidence-check verify --decision "Interpret asset requirements" --sources "data/public-pdf-text" --max-files 120 --prioritize-requirements true --policy strict
```

Note: for charts/images/scanned PDFs, see `docs/USER-GUIDE.md#handling-tables-graphs-images-and-scanned-pdfs`.

## Quality Standards

PCA follows a quality-first discipline pattern:

- Explicit contracts for every command input/output.
- Deterministic JSON responses for automation.
- Mode-specific frameworks (`discuss`, `verify`) instead of generic scoring.
- Governance-first escalation (`HITL`/`HOTL`) rather than implicit risk handling.
- Test-backed behavior for core decision logic.

## Architecture

- Core logic: `src/pca-core.js`
- CLI: `bin/pca.js`
- Tests: `tests/pca-core.test.js`
- Design doc: `docs/PCA-ARCHITECTURE.md`
- Workflow and role model: `docs/WORKFLOW.md`
- JSON contract: `SCHEMA.md`
- Integration templates: `integrations/`
- Contributing/redevelopment guide: `CONTRIBUTING.md`

## Integrations

PCA is adapter-ready. Start with templates in:

- `integrations/copilot/`
- `integrations/gemini-antigravity/`
- `integrations/ollama/` (free/open local models)
- `integrations/byom/` (OpenAI-compatible bring-your-own-model setup)
- `integrations/gsd/` (external executor integration example)
- `integrations/z3/` (optional symbolic constraint solver checks)

All integrations should consume the stable contract in `SCHEMA.md`.

Model routing guide (single-model, split-role, hybrid): `docs/MODEL-ROUTING.md`

Optional symbolic verification (Python + Z3):

```bash
pip install -r requirements-z3.txt
npm test
```

When Z3 is available, `tests/z3-geometry.test.js` validates a geometric constraint satisfaction scenario and can support adaptive solver verification experiments.

External executor integration guide (GSD example): `docs/GSD-INTEGRATION.md`

Use-case library (optional examples built on PCA core):

- Building compliance decision gate: `docs/USE-CASE-FIRE-EGRESS-COMPLIANCE.md`
- TRHS interpretation workflow: `docs/USE-CASE-TRHS-INTERPRETATION.md`
- Agentic TRHS pipeline: `docs/USE-CASE-AGENTIC-TRHS-PIPELINE.md`
- Hybrid quantitative + qualitative guide: `docs/USE-CASES-PCA-Z3.md`

Operational runbooks and release assurance:

- PDF parsing pipeline runbook: `docs/RUNBOOK-PDF-PIPELINE.md`
- OCR failure runbook: `docs/RUNBOOK-OCR-FAILURES.md`
- HITL escalation runbook: `docs/RUNBOOK-HITL-ESCALATION.md`
- Release quality checklist: `docs/RELEASE-CHECKLIST.md`

## Public Redevelopment

Anyone can fork and redevelop PCA under MIT.

Recommended fork pattern:

1. Keep `src/pca-core.js` contract-compatible.
2. Build custom adapters under `integrations/`.
3. Keep schema updates explicit in `SCHEMA.md`.

## Attribution

PCA is an independently developed quality-first decision engine.

## Contact and Q&A

- Submit a query: https://forms.gle/Qdk6xzGDchnk9h2u7
- Browse past Q&A: https://docs.google.com/spreadsheets/d/1AbtKfvaiZCV3Fq6FoAEopUGhehiDHHaapCwKvlKnKNU/edit?usp=sharing

Do not submit confidential data.
