# PCA User Guide

PCA is an Evidence-Governed Adaptive Solver for human-machine co-working in high-stakes decision workflows.

This guide explains how to operate PCA as a governed product across VS Code, Antigravity, and the Browser UI, including command behavior, adaptive depth, governance routing, and quality standards.

## General Framework vs Specific Use Cases

PCA is a general decision-quality framework. The core commands and governance model are domain-agnostic.

Specific use-case documents (for example TRHS or fire-egress) are optional implementation patterns that reuse the same PCA core:

- `prepare|run` for session framing
- `propose|critique` for structured debate
- `quality-check` for corpus readiness gating
- `ingest|evidence-check` for evidence synthesis
- `assess|route|persist` for verdict, governance, and audit artifacts

## Core Lifecycle

PCA decision lifecycle:

1. Propose: produce strongest actionable recommendation.
2. Critique: challenge assumptions, evidence, and failure modes.
3. Assess: issue final verdict and required next actions.

Verdict set:

- `accepted`
- `accepted-with-conditions`
- `needs-human-review`

## Workflow Diagram

```mermaid
flowchart TD
  A[Input: Data, requirements, objectives] --> B[Process: Organize]
  B --> C[Process: Propose]
  C --> D[Process: Critique]
  D --> E[Process: Assess]
  E --> F[Process: Verify gates]
  F --> G[Output: Recommend actions]
  G --> H[Output: Action contract]
  H --> I{Route HITL/HOTL}
  I --> J{Execution readiness}
  J -->|Ready| K[Implement]
  J -->|Blocked| C
  K --> L[Document artifacts and rationale]
  L --> M[Observe outcomes]
  M --> N[Learn and update corpus]
  N --> O{Drift or new risk}
  O -->|Yes| B
  O -->|No| P[Concrete outcome delivered]
```

Operational principle: `Input -> Process -> Output` loop throughout the run, with action contract and readiness checks before implementation.

- Input: ingest datasets, references, requirements, and objectives.
- Process: organize, propose, critique, assess, and verify with gates.
- Output: produce action contract, route via HITL/HOTL, and execute when ready.
- Learn: monitor outcomes and re-enter the cycle when needed.

Detailed role swimlane and agent topology: `docs/WORKFLOW.md`

## Roles and Agents

| Stage | Primary Role | Typical Runtime |
| --- | --- | --- |
| Input framing | Requester | Human |
| Session preparation | Orchestrator | AI agent/CI |
| Proposal generation | Proposer | AI agent |
| Critique generation | Critic | AI agent |
| Final judgement | Assessor | AI agent |
| Governance gate | Human Reviewer (when HITL) | Human |
| Artifact persistence | Orchestrator | AI agent/CI |

## Choose Your Surface

PCA uses the same governed method across three main operating surfaces. Choose the one that best matches how you want to work.

| Surface | Best For | Primary Controls | Choose This When |
| --- | --- | --- | --- |
| VS Code | Chat-first co-working, coding-adjacent decisions, agent-guided runs | CLI, custom PCA agents, local tasks | You want PCA embedded in your editor workflow and want to switch between autonomous and stage-specific modes |
| Antigravity | Orchestration-first workflows with PCA as the governance layer | PCA CLI, API, artifacts, runtime smoke checks | You already use Antigravity to drive execution and want PCA to structure evidence, critique, and routing around it |
| Browser UI | Visual control desk, live timeline review, downloadable artifacts | UI controls, live debate, adaptive depth, verify gates, optional Z3 checks | You want visible debate flow, corpus preview, human checkpoints, and a browser-first operating experience |

The method stays the same across all three surfaces: frame the work, gather evidence, run adaptive proposal and critique passes, assess readiness, and route the result under explicit human control.

Useful product distinction:

- the Browser UI is the operating platform where the work is surfaced, tracked, resumed, and reviewed
- PCA is the flexible framework that shapes the roles, loops, checkpoints, and governance needed for that work

That distinction matters because long conversations usually fail when roles blur and process disappears into chat drift. PCA gives the process shape. The platform makes that shape visible and usable.

## Traceability and Transparency

PCA is intended to improve decision transparency for both human reviewers and automated workflows.

It is especially useful when the work is shared between human and machine across:

- co-creation of options and proposals
- co-checks on evidence, contradictions, and risks
- co-tasking where action should proceed only when readiness and governance conditions are clear

What PCA records clearly:

- the original objective and context
- the relevant evidence sources and dataset register
- proposal outputs
- critique outputs and risk flags
- assessment verdict and action requirements
- verify-gate results
- `HITL/HOTL` route recommendation
- persisted artifacts for audit, handoff, or replay

Important distinction:

- PCA is not built around exposing unrestricted hidden chain-of-thought.
- PCA is built around structured decision records and a structured reasoning trail that are practical, reviewable, and operationally useful.

This matters for human-machine co-working because it lets a human see how the work progressed across stages without depending on one long fragile conversation thread.

## The Pattern Can Be The Product

PCA should not be understood only as a command set, browser UI, or prompt wrapper. It can also be understood as a productized working pattern for human-machine collaboration.

What becomes productized is the way the work happens:

- the user frames intent, objective, and constraints explicitly
- the machine helps structure options, critique, and evidence synthesis
- the process stays visible through timelines, checkpoints, and artifacts
- interruption does not mean losing the work because the session state and structured reasoning trail can be documented and resumed
- the outcome is not just an answer, but a better collaborative process that produces more practical and feasible throughput

This matters because many teams do not only need a model response. They need a reliable co-working method they can reuse, review, govern, and improve over time.

## Installation

### VS Code Quick Start

If you are installing PCA to use inside VS Code, start with this sequence:

1. Open the PCA project folder in VS Code.
2. Open the integrated terminal.
3. Install dependencies:

```bash
npm install
```

1. Confirm the CLI is working:

```bash
node bin/pca.js help
```

1. Start the local PCA UI and API service:

```bash
npm run ui:start
```

1. Open:

- `http://localhost:4173`

1. Run your first PCA workflow, for example:

```bash
node bin/pca.js prepare discuss --decision "API strategy" --context "Migrate safely"
node bin/pca.js quality-check --sources "data/public-pdf-text"
```

1. If you want a quick VS Code trial without typing long commands, use the built-in tasks in `.vscode/tasks.json`:

- `PCA: Start UI Server`
- `PCA: Copilot Framework Proposal`
- `PCA: Copilot Research Pack`
- `PCA: Copilot Live Debate (1 cycle smoke)`

1. If you want to validate the runtime path end-to-end, run:

```bash
npm run smoke:copilot
```

For more step-by-step usage patterns, see `docs/VS-CODE-CLI-CHEATSHEET.md`.

### PCA Agent Modes in VS Code

This workspace now includes PCA-native custom agents in `.github/agents/` so PCA can appear as a first-class workflow in the VS Code agent picker.

Available agent modes:

- `PCA 0 Auto Flow`
- `PCA 1 Orchestrator`
- `PCA 2 Proposer`
- `PCA 3 Critic`
- `PCA 4 Assessor`
- `PCA 5 Governor`

Use these when you want PCA to feel like a selectable working method rather than only a CLI or browser tool.

Recommended usage:

- `PCA 0 Auto Flow` when you want one governed autonomous run that selects depth and can include optional Z3-style hard-constraint verification
- `PCA 1 Orchestrator` for framing, sequencing, requirements, dataset scope, and overall PCA flow
- `PCA 2 Proposer` for the best current option after framing is clear
- `PCA 3 Critic` for challenge, contradiction, evidence gaps, and risk surfacing
- `PCA 4 Assessor` for verdict and action requirements after debate
- `PCA 5 Governor` for `HITL/HOTL`, verify gates, and readiness routing

Default sequence:

1. `PCA 0 Auto Flow` when you want the full flow handled through one entrypoint
2. `PCA 1 Orchestrator`
3. `PCA 2 Proposer`
4. `PCA 3 Critic`
5. `PCA 4 Assessor`
6. `PCA 5 Governor`

Role note:

- `PCA 0 Auto Flow` is the automation entrypoint. It is for users who do not want to choose each stage manually.
- The visible VS Code picker exposes five top-level PCA stages.
- Within a stage, the agent may still perform multiple sub-roles internally. For example, `PCA 1 Orchestrator` can break work into framing, requirements clarification, dataset scoping, evidence-check planning, and route planning before handing off to later stages.
- If needed later, more specialized PCA stage agents can be added without changing the top-level sequence.

Automation note:

- If the problem includes hard constraints, geometry, configuration validity, or satisfiability checks, state that clearly in the `PCA 0 Auto Flow` prompt so the run treats formal verification as part of the governed decision.
- In the browser UI and API, the equivalent automation controls are `passStrategy: adaptive`, `riskLevel`, and `enableZ3GeometryCheck`.

```bash
npm install
```

Optional global executable:

```bash
npm install -g .
```

Web UI (local-first, downloadable artifacts, online deployment guidance): `docs/WEB-UI.md`

VS Code CLI quick guide (Copilot, Antigravity, pure terminal): `docs/VS-CODE-CLI-CHEATSHEET.md`

For live visibility, use the Web UI `Run Live Debate x3` action to stream proposer/critic/assessor events and a final human checkpoint.

VS Code quick trial with Copilot runtime tags is available via tasks in `.vscode/tasks.json`:

- `PCA: Start UI Server`
- `PCA: Copilot Framework Proposal`
- `PCA: Copilot Research Pack`
- `PCA: Copilot Live Debate (1 cycle smoke)`

Antigravity integration (CLI-only and hybrid UI workflows): `docs/ANTIGRAVITY-INTEGRATION.md`

### Antigravity Quick Start

Use this mode when Antigravity is your orchestration/runtime layer and PCA is your decision-quality and governance layer.

1. Install dependencies:

```bash
npm install
```

1. Prepare a text corpus if your sources are PDFs:

```bash
npm run convert:pdf -- --input-dir "C:\path\to\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
```

1. Run PCA quality and evidence checks:

```bash
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
node bin/pca.js evidence-check verify --decision "Interpret requirements" --context "Cross-document consistency check" --sources "data/public-pdf-text" --policy strict --max-files 200 --prioritize-requirements true
```

1. Persist the result for action handoff:

```bash
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked conditions" --actions "Assign owners and due dates" --policy strict --output outputs/antigravity-decision.json --format json
```

1. If you want to validate the runtime path end-to-end:

```bash
npm run smoke:antigravity
```

For hybrid use, start the PCA UI with `npm run ui:start` and use the browser for live visibility while Antigravity drives the steps.

### Browser UI Quick Start

Use this mode when you want a browser-based control desk for evidence review, live debate, governance checks, and artifact downloads.

1. Install dependencies:

```bash
npm install
```

1. Start the local PCA UI and API service:

```bash
npm run ui:start
```

1. Open:

- `http://localhost:4173`

### How Browser UI Captures a Request

The Browser UI is not just a folder picker. It is the platform surface for capturing a governed request contract so PCA can interpret the user's ask with traceable intent, evidence scope, and quality expectations.

The key operating idea is that PCA acts as an outer-layer role and action guide for co-thinking, not only as a form-driven executor. The UI should help users think, refine, and co-create continuously in the same way Copilot-assisted PCA work does in chat: clarify the objective, sharpen the decision, expose gaps, tighten constraints, and then run evidence-backed proposal, critique, and assessment loops.

That collaboration model should be continuous rather than brittle. A PCA conversation may pause, end for the moment, branch into a side topic, resume later, or return to an unresolved issue after new evidence appears. The important point is not that one run stays open forever. The important point is that PCA keeps supporting human-machine co-work across interruptions, extensions, irregular subjects, and unfinished threads without losing the role structure or the quality controls.

In practice, the current UI collects most of the right decision-quality inputs up front:

- `Objective`: what outcome the user wants PCA to produce.
- `Decision`: the judgement, interpretation, or choice PCA is being asked to make.
- `Context`: the operating situation, scope, and background needed to interpret the request correctly.
- `Sources To Use`: the local folder path or selected source set PCA should treat as evidence input.
- `Expectations`: what a good answer should contain, usually one requirement per line.
- `Research Needs`: the specific follow-up questions, contradictions, updates, or edge cases PCA should actively investigate.
- `Constraints`: limits on what PCA may use or recommend, such as public-data-only rules or escalation requirements.
- `Public References`: externally named references the user wants considered as part of the record.
- `User Dataset Register`: the user-declared dataset list that documents what source collections were intentionally provided.

Taken together, these fields already capture most user requests in a structured way. The user's request is usually not one separate sentence in PCA. It is the combination of objective, decision, context, expectations, research needs, constraints, and chosen sources.

This is why the UI should be read as a guided co-working surface:

- `Objective` helps the user state the desired outcome.
- `Decision` helps the user name the exact judgement to make.
- `Context` helps the user explain the situation and refine scope as they learn.
- `Expectations` helps the user define what a useful answer must include.
- `Research Needs` helps the user ask for deeper checks, contradiction-finding, and updates.
- `Constraints` helps the user set operational boundaries and escalation rules.

In other words, PCA is the outer framework layer that helps the user think through the work while also structuring the downstream run. The UI is the platform where that framework becomes visible, resumable, and operational.

Important collaboration principle: ideas should grow with traceability, not drift silently. When correction is necessary, PCA should make that correction explicit and documented so the current position can still be understood as a continuation of the work rather than an unexplained reset.

This structure matters because it keeps the run measurable and reviewable:

- intent is explicit
- evidence scope is explicit
- quality criteria are explicit
- dataset provenance is explicit
- later artifacts can show what PCA was actually asked to do

Use this pattern when preparing requests in the Browser UI:

1. Put the desired outcome in `Objective`.
2. Put the actual judgement or interpretation task in `Decision`.
3. Put scenario details and boundaries in `Context`.
4. Point PCA at the approved evidence set in `Sources To Use`.
5. Put output-quality requirements in `Expectations`.
6. Put open questions and contradiction checks in `Research Needs`.
7. Put operating limits and escalation rules in `Constraints`.

If the user has a more specific instruction, preference, concern, or objection, the best current place to express it is in `Context`, `Expectations`, or `Constraints`, depending on whether it changes situation, output quality, or allowed behavior.

Operationally, this means users can work with the Browser UI in a continuous loop:

1. frame the request
2. review sources and evidence scope
3. run proposal or research outputs
4. refine the request based on what PCA surfaced
5. run critique, assessment, or full pipeline again

That loop is the intended PCA behavior: flexible co-creation with explicit roles, visible actions, and governed outputs.

In practical use, that loop can also be interrupted and resumed:

1. stop after an initial framing or evidence pass
2. return later with new documents, new questions, or a changed objective
3. extend the same topic with a deeper critique or a different decision angle
4. branch briefly into an irregular side issue, then come back to the main question
5. continue until the outcome and the process quality are both strong enough

PCA is therefore not only a workflow runner. It is a collaboration layer for sustained human-machine thinking, co-creation, and process improvement.

### Local Data Access in Browser UI

The Browser UI is local-first.

Simple explanation:

- The PCA web server runs on your own machine.
- The browser UI reads local folders through that local server.
- By default, it only allows approved local roots under `data/` and `outputs/`.
- This keeps normal browser-based use flexible without allowing unrestricted browsing across the whole machine.

For most users, the intended flow is:

1. Put source files into a local dataset folder.
2. Start PCA locally with `npm run ui:start`.
3. Open the Browser UI at `http://localhost:4173`.
4. Choose the approved local folder in `Data Source Setup`.
5. Preview sources, run conversion/OCR if needed, then run PCA workflows.

If you need an additional local dataset folder outside `data/` or `outputs/`, add it explicitly before starting the UI.

Windows example:

```powershell
$env:PCA_UI_ALLOWED_ROOTS='C:\Users\<user>\Documents\PCA-Inputs;C:\Shared\Approved-Datasets'
npm run ui:start
```

Keep this narrow. Add only specific approved dataset folders, not an entire drive.

### Online Dataset Access

PCA should treat online datasets as controlled imports, not as unrestricted cloud-drive browsing.

Simple explanation:

- The safest pattern is to bring the dataset into a local approved folder first.
- PCA then works on that local staged copy.
- This keeps the Browser UI flexible for different users and regions without giving PCA broad access to an entire online drive account.

Recommended flow:

1. User receives a specific shared dataset link or approved online folder.
2. User syncs or downloads that dataset into a local approved folder.
3. PCA Browser UI reads the local copy through `Data Source Setup`.
4. PCA runs conversion, preview, evidence checks, and artifacts against the local staged dataset.

For future online connectors, the preferred model is still narrow access:

- allow a specific file or dataset folder given by the user
- import only that dataset root
- stage it locally before PCA processing
- avoid free roaming across the user's whole Google Drive, OneDrive, or other cloud storage

This keeps PCA usable for global users across different storage providers while preserving least-privilege access.

1. Typical browser-first flow:

- preview corpus and references
- run framework proposal
- run research pack
- run live debate or full pipeline
- inspect verify gates and route recommendation
- download artifacts

Use this mode when the user needs stronger visibility, traceability, and human review support during the run.

### Which Mode To Choose

- Use VS Code when you want PCA embedded in your normal editor workflow through CLI, tasks, and custom PCA agents.
- Use Antigravity when you want an external orchestration/runtime layer and PCA to govern evidence quality, critique, and routing.
- Use Browser UI when you want a visual control desk, live timeline, source preview, verify-gate visibility, and downloadable artifacts.
- Use the hybrid pattern when you want Copilot or Antigravity to drive execution while PCA UI provides transparency and governance visibility.

### Free/Open Local Model Path

PCA can run without paid APIs using local OSS models via Ollama:

1. Install Ollama: [ollama.com/download](https://ollama.com/download)
1. Pull models, for example: `qwen2.5:7b`, `llama3.1:8b`, `qwen2.5:14b`
1. Run adapter: `node integrations/ollama/adapter.js discuss --decision "..." --context "..."`

Model selection strategy and routing patterns: `docs/MODEL-ROUTING.md`

## Commands

Full command specification (syntax, flags, outputs, failure modes): `docs/COMMAND-REFERENCE.md`

### `prepare`

Builds a PCA session package with framework + prompts.

```bash
node bin/pca.js prepare discuss --decision "Should we split the service?" --context "Latency spikes at peak"
```

### `run`

Current standalone alias for `prepare`.

```bash
node bin/pca.js run verify --decision "Release readiness" --context "UAT shows intermittent errors"
```

### `propose`

Builds proposer role payload and prompt, optionally with local evidence digest.

```bash
node bin/pca.js propose discuss --decision "Should we split the service?" --sources "reports/a.md,reports/b.md"
```

### `critique`

Builds critic role payload and extracts risk flags from critique text.

```bash
node bin/pca.js critique discuss --decision "Should we split the service?" --proposal "Split by domain" --critique "Risk due to unclear ownership and missing rollback details"
```

### `route`

Maps verdict/risk to governance control (`HITL` or `HOTL`).

```bash
node bin/pca.js route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage"
```

### `assess`

Builds the full PCA assessment payload from verdict + risk context.

```bash
node bin/pca.js assess verify --verdict "accepted" --judgement "Evidence is reproducible"
```

### `persist`

Writes assessment output to disk in JSON or Markdown format.

```bash
node bin/pca.js persist verify --verdict "needs-human-review" --risk-flags "uncertain evidence" --output development/pca-assessment.json --format json
```

### `help`

Prints concise CLI usage in terminal.

```bash
node bin/pca.js help
```

### `ingest`

Build local claim digest from files (`.md`, `.txt`, `.json`, `.csv`) without sending data off-server.

```bash
node bin/pca.js ingest --sources "reports/a.md,reports/b.csv"
```

### `quality-check`

Validate source quality before cross-document evidence checks.

```bash
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
```

### `evidence-check`

Run cross-document checks (support vs contradiction) and generate PCA assessment.

```bash
node bin/pca.js evidence-check verify --decision "release gate" --sources "reports/a.md,reports/b.md" --policy strict
```

For extensive datasets where the directory already contains supported files (`.md`, `.txt`, `.json`, `.csv`), pass the directory directly and cap file selection:

```bash
node bin/pca.js evidence-check verify --decision "Interpret requirements from normalized asset library" --context "Cross-check requirements consistency and contradictions" --sources "data/public-pdf-text" --max-files 120 --prioritize-requirements true --policy strict
```

## Specific Use Case: TRHS Workflow (URA, BCA, SCDF)

Use this flow when your regulatory source library is mostly PDF files.

Important:

- PCA ingest currently supports `.md`, `.txt`, `.json`, `.csv` directly.
- Convert PDF files to `.txt` first, then run PCA on the converted folder.
- Exclude confidential correspondence files from conversion and ingestion.

General batch conversion (any public-user PDF folder):

```bash
npm run convert:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-text" --recursive true
```

### Step 1: Convert public regulator PDFs to text

Example for your local dataset in `C:\2026_Research\Assets`:

One command (recommended):

```bash
npm run convert:trhs
```

Equivalent manual command:

```powershell
New-Item -ItemType Directory -Force -Path "data\trhs-text" | Out-Null
Get-ChildItem -Path "C:\2026_Research\Assets" -File |
  Where-Object { $_.Extension -ieq ".pdf" -and $_.Name -match '^(BCA|URA|SCDF)_' -and $_.Name -ne 'BCA_HS_Checks_Scope.pdf' } |
  ForEach-Object {
    $out = Join-Path "data\trhs-text" ($_.BaseName + ".txt")
    & "C:\poppler\Library\bin\pdftotext.exe" -layout -enc UTF-8 $_.FullName $out
  }
```

### Step 2: Build evidence digest

```bash
node bin/pca.js ingest --sources "data/trhs-text" --max-files 120 --prioritize-requirements true
```

### Step 3: Run strict cross-agency evidence-check

```bash
node bin/pca.js evidence-check verify --decision "TRHS interpretation for household shelter compliance (URA/BCA/SCDF)" --context "Cross-agency technical requirements, constraints, and contradiction checks" --sources "data/trhs-text" --max-files 120 --prioritize-requirements true --policy strict
```

### Step 4: Persist final decision artifact

```bash
node bin/pca.js persist verify --verdict "accepted-with-conditions" --judgement "Proceed with tracked clarifications and authority validation" --actions "1) confirm TRHS slab/setback conditions; 2) validate SCDF fire resistance and access implications; 3) confirm URA lodgment applicability with QP" --policy strict --output outputs/trhs-decision.json --format json
```

### Expected outcome pattern

- Structured evidence links across BCA/SCDF/URA sources.
- Explicit governance routing (`HITL`/`HOTL`) from policy and evidence quality.
- Reusable JSON output for review meetings and project records.

### Handling tables, graphs, images, and scanned PDFs

- Tables: `pdftotext -layout` preserves rough structure, but complex merged cells may degrade. For critical tables, export table data to CSV and ingest both `.txt` and `.csv`.
- Graphs/charts: chart visuals are not converted into reliable numeric text. Add a short analyst summary `.md` describing key values/thresholds and ingest that alongside converted text.
- Embedded images/diagrams: pure image content is not captured by `pdftotext`. Add manual captions/notes in `.md` for decision-relevant details.
- Scanned PDFs (image-only): run OCR first, then convert OCR output to text for PCA ingestion.
- Optional built-in OCR preprocessor command:

```bash
npm run ocr:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-ocr" --recursive true --language eng
npm run convert:pdf -- --input-dir "data/public-pdf-ocr" --output-dir "data/public-pdf-text" --recursive true
```

- If OCRmyPDF is not in PATH, set `--ocrmypdf-path` or env `OCRMYPDF_PATH`.
- Quality gate recommendation: sample 5 to 10 converted files and verify key clauses survived conversion before full evidence-check.

## Governance Model

- `HITL` (Human In The Loop): explicit human approval required.
- `HOTL` (Human On The Loop): progression allowed with monitoring.

Default escalation cues:

- `needs-human-review` verdict.
- unresolved high-risk flags.
- conflicting evidence in verify mode.

## Quality Standards

PCA adopts these standards:

- Deterministic machine-readable outputs (JSON-first CLI behavior).
- Clear command contracts and error messages.
- Mode-specific frameworks for discuss vs verify.
- Explicit governance routing, never implicit risk acceptance.
- Test coverage for core logic and edge cases.

## Practical Usage Guidance

Use PCA when:

- decision impact is high
- assumptions are uncertain
- evidence is incomplete or conflicting

Skip PCA when:

- tasks are low-risk and mechanical
- decision is already constrained and obvious

Practical end-to-end example (building compliance): `docs/USE-CASE-FIRE-EGRESS-COMPLIANCE.md`

Specific TRHS interpretation example: `docs/USE-CASE-TRHS-INTERPRETATION.md`

Optional agentic orchestration example (TRHS pipeline): `docs/USE-CASE-AGENTIC-TRHS-PIPELINE.md`

Operational runbooks and release assurance:

- `docs/RUNBOOK-PDF-PIPELINE.md`
- `docs/RUNBOOK-OCR-FAILURES.md`
- `docs/RUNBOOK-HITL-ESCALATION.md`
- `docs/RELEASE-CHECKLIST.md`

## Troubleshooting

- If you see `mode must be 'discuss' or 'verify'`, fix the second positional arg.
- If routing looks too strict, revisit `--verdict`, `--risk-flags`, and `--needs-human-review` values.
- If integrating with other tools, use JSON output as the stable contract.

## Contact and Q&A

- Submit a query: [Google Form](https://forms.gle/Qdk6xzGDchnk9h2u7)
- Browse past Q&A: [Google Sheet](https://docs.google.com/spreadsheets/d/1AbtKfvaiZCV3Fq6FoAEopUGhehiDHHaapCwKvlKnKNU/edit?usp=sharing)

Do not submit confidential data.
