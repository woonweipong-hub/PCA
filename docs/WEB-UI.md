# PCA Web UI

PCA is an Evidence-Governed Adaptive Solver, and this Browser UI is its visual control-desk platform for governed human-machine work.
It is grounded in construction-industry workflows, where regulation, coordination, safety, interpretation, and traceability matter, but the underlying reasoning and working method can transfer to other evidence-heavy domains.
It supports adaptive debate depth, evidence checks, explicit `HITL/HOTL` routing, and optional Python package-backed symbolic checks (`z3-solver`) when formal constraints matter.

PCA Web UI provides a browser-based platform for discussion-led intake, OCR, PDF conversion, quality gating, evidence checks, live governed runs, and artifact downloads.

The current UI is intentionally output-first and low-friction. Latest result, collaboration summary, and role timeline sit near the top of the page, while setup, data, PCA roles, models, and tools remain visible in plain sections instead of being buried behind nested reveal patterns.

Its primary purpose is human-machine collaboration and co-creation with continuity. Useful products, reusable assets, and practical solutions may emerge from that work, but they should be treated as downstream outcomes of a strong collaborative method rather than the sole purpose of the platform.

It should also be understood as a continuous co-working platform. PCA sits as the framework layer around the user's task: it helps users frame the objective, define the decision, state expectations, surface research questions, tighten constraints, inspect evidence, and then iterate through propose, critique, assess, and govern loops.

This platform/framework split is intentional:

- the UI platform holds the visible state, interaction flow, resumable session context, and downloadable artifacts
- the PCA framework defines how roles, checks, and process loops should be shaped for the problem at hand

That flexibility is what helps streamline lengthy conversations. Instead of letting every topic stay as one long thread, PCA can reshape the work into clearer stages, explicit checkpoints, and documented continuation paths.

This collaboration does not need to be one-shot or perfectly linear. A PCA session can pause, be interrupted, continue later, extend into open topics, or temporarily shift to irregular supporting questions before returning to the main decision. The Browser UI should support that style of work by keeping the structure visible while still allowing flexible human-machine collaboration.

## What You Can Do

- Run OCR preprocess for scanned PDFs.
- Convert PDF folders to text corpus.
- Preview corpus content and registered references before analysis.
- Run `quality-check` before evidence checks.
- Run `evidence-check` and review structured output.
- Run live debate cycles (`propose -> critique -> assess`) with timeline updates.
- Select adaptive or fixed pass strategy with risk level (`low|medium|high`) to control debate depth.
- Optionally enable Z3 geometry checks for symbolic constraint validation in verify gates.
- See verify-gate outcomes and route recommendation (`HITL/HOTL`) in live debate events.
- Build objective-driven framework proposals from user intent, expectations, constraints, and research needs.
- Start quickly with built-in use-case profiles, including `Generic Regulatory Interpretation`, `TRHS Regulatory Interpretation`, CORENET X, accessibility, buildability, MEP/C&S, Green Mark, FM, HS, cost/spec checks, and BCA master compliance pre-check.
- Select per-role models (`proposal`, `critique`, `assess`) and runtime notes for traceable runs.
- Use the always-visible setup guide for runtime-specific setup and generated CLI snippets.
- View a workflow map in the UI showing objective -> research -> debate -> verification -> artifact flow.
- Download JSON artifacts from each run.

## Use Case Paths

The Browser UI now exposes `Use Case Paths` directly in the shared interface so users can start from a preset instead of filling every field from scratch.

Recommended starting pattern:

- choose `Custom` when you already know the exact workflow shape you want
- choose `Generic Regulatory Interpretation` when the work is primarily about reading, comparing, and routing regulations or guidance documents
- choose `TRHS Regulatory Interpretation` when the work is specifically about household shelter interpretation across BCA, URA, and SCDF material
- choose the other presets when the work is already closer to a defined review domain such as accessibility, buildability, or BCA master pre-checks

This keeps the Browser UI general-purpose. Domain presets help frame the work faster, but the main interface remains shared across all PCA use cases.

## Traceability in the UI

The UI is designed to make PCA runs inspectable and reviewable.

- Latest result and collaboration summary are placed first so users can react immediately.
- Input evidence register shows references and datasets used for the run.
- Corpus preview lets users inspect source content before analysis.
- Live debate view exposes stage-by-stage proposer, critic, assessor, and governance events.
- Verify-gate output and route recommendation show why the run is ready, blocked, or escalated.
- Downloadable artifacts preserve the structured decision trail for later review.

This supports transparency in a practical sense: users can inspect what the system used, what it concluded, and where human review is still required.

That makes the UI suitable for human-machine co-working workflows where teams want visible co-creation, co-checks, and co-tasking rather than a single opaque conversational result.

The intended user experience is flexible and continuous rather than one-shot. Users should expect to update the request as PCA reveals contradictions, missing evidence, stronger framing, or better next actions. In that sense, the Browser UI plays a role similar to Copilot-assisted PCA work in chat, but with explicit fields, visible workflow stages, and persistent artifacts.

Important collaboration principle: ideas should grow along the way, not appear to change arbitrarily. If a course correction is needed, the correction should be explicit, documented, and connected to the earlier reasoning trail.

The intended model is continuous conversation and continuous co-work:

- users can stop and resume without treating the earlier work as wasted
- users can extend an open topic with more evidence or sharper instructions
- users can interrupt the main thread to explore a side issue, then return
- users can keep refining both the output and the process as PCA surfaces better framing

The goal is better human-machine collaboration, better thinking, and better outputs, not merely completion of a single isolated run.

In that sense, the working pattern itself can be treated as the product. The Browser UI is not only a front end for commands. It is a visible co-working surface for capturing intent, documenting evidence use, recording stage-by-stage progress, pausing safely, resuming later, and keeping the structured reasoning trail available for human review and continuation.

Current request-shaping inputs in the UI already support most of that co-working pattern:

- `Objective`
- `Decision`
- `Context`
- `Sources To Use`
- `Expectations`
- `Research Needs`
- `Constraints`
- `Public References`
- `User Dataset Register`

Together these fields act as the user's working request contract, not just static configuration.

## Simple First Run in the Browser

For a new user, the easiest way to understand PCA in the browser is this:

1. Start the Browser UI locally.
2. Open `Use Case Paths`.
3. Pick `Generic Regulatory Interpretation` if you are working from codes, circulars, guidance, or regulatory PDFs.
4. Set `Sources To Use` to the folder you want PCA to read.
5. Fill in `Objective`, `Decision`, `Context`, and `Constraints`.
6. Run `Preview Sources` first to confirm the corpus is the one you expect.
7. Run `Research Pack` or `Evidence Check` to surface support, contradictions, and open gaps.
8. Run `Full Pipeline` when you want PCA to drive framing, critique, assessment, and route recommendation together.
9. Read the top output area first, then refine the request and continue if needed.

This is the simplest mental model:

- `Use Case Paths` helps the user start from the right framing
- the input area tells PCA what decision is being made
- the evidence area shows what PCA is grounding the work on
- the live thread and throughput area show how the recommendation was shaped
- the output area shows what to do next and whether human review is still required

## Start Locally

## Simple Browser Start

If you just want to download PCA and use it through the Browser UI, follow this simple path:

1. Download the PCA repository ZIP or release package to your computer.
2. Extract it to a normal local folder.
3. Install Node.js 18 or later.
4. On Windows, open the PCA folder and run `start-browser-ui.cmd`.
5. If you do not use the launcher, open a terminal in the PCA folder and run `npm install` once.
6. Start the Browser UI with `npm run ui:start`.
7. Open `http://localhost:4173` in Edge or Chrome.
8. Choose a use case path such as `Generic Regulatory Interpretation` or `TRHS Regulatory Interpretation`.
9. Add your source folder, objective, decision, and constraints.
10. Run `Preview Sources`, `Research Pack`, `Evidence Check`, or `Full Pipeline` depending on how much structure you need.

What to expect:

- PCA runs locally on your machine through the browser
- the top area shows the latest recommendation and route
- the middle sections show use cases, evidence, live debate flow, and artifacts
- you can pause, edit the request, and continue without losing the session

## Direct Download and Use Requirements

If the goal is: download PCA, open the Browser UI quickly, and use it directly on a local machine, the requirements should be stated explicitly.

Direct-download use means:

- the user can download the repository zip or a packaged release to a local folder
- the user can install the minimum local runtime once
- the user can start the Browser UI locally and open it in a normal browser
- the user does not need VS Code, Copilot chat, Antigravity, or a hosted deployment just to use the Browser UI

Non-negotiable requirement:

- the Browser UI is not a static HTML file that can be opened directly with double-click on `index.html`
- it depends on the local Node server because the UI calls local API endpoints for OCR, conversion, evidence checks, debate streaming, pipeline runs, artifact download, and local filesystem restrictions

Minimum local requirements for direct Browser UI use:

- Node.js 18 or later
- npm (normally included with Node.js)
- a modern browser such as Edge or Chrome
- local write access to the downloaded PCA folder so artifacts can be stored in `outputs/`

Runtime requirements for Ollama-backed direct use:

- Ollama installed locally
- Ollama running locally
- at least one pulled local model for each active role

Recommended direct-use model set:

- `qwen2.5:7b` for propose
- `llama3.1:8b` or `qwen2.5:14b` for critique
- `qwen2.5:14b` or a local DeepSeek model for assess

Example Ollama preparation:

```bash
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b
ollama pull deepseek-r1:8b
```

Optional direct-use requirements:

- Python plus `z3-solver` if the user wants symbolic verify-gate checks
- extra local dataset folders added through `PCA_UI_ALLOWED_ROOTS` if the user wants to browse outside `data/` and `outputs/`

Direct-download quick start should therefore be treated as this sequence:

1. Download PCA to a local folder.
2. Install Node.js.
3. On Windows, run `start-browser-ui.cmd` in the PCA folder if you want a direct local launch path.
4. Otherwise run `npm install` once in the PCA folder.
5. If using Ollama, install Ollama and pull the local models you want.
6. Start the Browser UI with `npm run ui:start`.
7. Open `http://localhost:4173`.

Direct-download acceptance requirement for the Browser UI:

- a user with only the downloaded PCA folder, Node.js, npm, and optional Ollama should be able to start the Browser UI locally and use the core governed workflow without needing any other PCA operating surface
- on Windows, `start-browser-ui.cmd` should serve as the simplest direct-launch path for that local experience

```bash
npm install
npm run ui:start
```

Open:

- `http://localhost:4173`

If you want this to feel like a direct-download product rather than a developer setup, package or release notes should always include these four items together:

- required Node version
- whether Ollama is optional or expected
- required local models for the default UI preset
- exact startup command: `npm install` then `npm run ui:start`

Windows convenience launcher:

- `start-browser-ui.cmd` checks for Node/npm, installs dependencies if `node_modules/` is missing, opens the browser, and starts the local UI server

Environment overrides:

- `PCA_UI_HOST` (default `127.0.0.1`)
- `PCA_UI_PORT` (default `4173`)
- `PCA_UI_ALLOWED_ROOTS` (optional extra allowed local roots, separated by `;` on Windows and `:` on Unix-like systems)
- `PCA_UI_ALLOWED_HOSTS` (optional extra hostnames allowed in the `Host` header)
- `PCA_UI_ALLOWED_ORIGINS` (optional extra browser origins allowed for API calls)

Default allowed roots are intentionally narrow:

- `data/`
- `outputs/`

This means the folder browser, source preview, OCR, and PDF conversion endpoints only operate inside those approved roots unless the user explicitly extends them with `PCA_UI_ALLOWED_ROOTS`.

The UI also enforces local browser protections by default:

- only approved `Host` headers are accepted
- browser `Origin` headers must match an approved local origin unless explicitly extended
- POST API calls must use `application/json`

Example on Windows:

```powershell
$env:PCA_UI_ALLOWED_ROOTS='C:\Users\<user>\Documents\PCA-Inputs;C:\Shared\Approved-Datasets'
npm run ui:start
```

If you intentionally deploy behind a reverse proxy or alternate local hostname, extend the host and origin allowlists explicitly:

```powershell
$env:PCA_UI_ALLOWED_HOSTS='pca.local'
$env:PCA_UI_ALLOWED_ORIGINS='https://pca.local'
npm run ui:start
```

## API Endpoints

- `POST /api/ocr-pdf`
- `POST /api/convert-pdf`
- `POST /api/corpus-preview`
- `POST /api/quality-check`
- `POST /api/evidence-check`
- `POST /api/framework-proposal`
- `POST /api/research-pack`
- `POST /api/debate-live` (SSE stream for live timeline)
- `POST /api/run-pipeline` (SSE stream for unified Input -> Process -> Output run)
- `GET /api/artifacts`
- `GET /api/download?file=<artifact>`
- `GET /api/health`

Optional symbolic dependency setup:

```bash
pip install -r requirements-z3.txt
```

## Live Debate View

Use `Run Live Debate x3` in the UI to stream three debate cycles in real time:

- Cycle start event
- Proposer step output
- Critic step output + extracted risk flags
- Assessor step verdict + governance signal
- Final human checkpoint recommendation (`Proceed with recommendations` or `Further discussion needed`)

Live debate now also captures and displays:

- PCA framework snapshot (criteria, topology, governance policy)
- Per-cycle scoring telemetry (weighted score, coverage ratio, score band)
- Score deltas across cycles to show whether debate quality is improving

Each run saves a `live-debate` artifact in `outputs/ui/`.

Use the `Runtime Provider` selector to tag runs as `copilot`, `antigravity`, `byom`, `ollama`, or `other` for traceability across mixed operating setups.

Model labels are recorded for each run. For Copilot runtime, labels document selected strategy and governance context; direct backend model execution can be done via BYOM/Ollama adapters.

## Framework Proposal View

Use `Propose Framework` to generate a structured PCA contract for the current request:

- Request contract: objective, expectations, constraints, research needs
- Framework package: criteria, topology, governance policy
- Execution + verification plan mapped to PCA commands
- Active AI search plan (query/task suggestions) for Copilot/Codex CLI, Antigravity, or BYOM runtime execution

## Research Pack View

Use `Run Research Pack` to build deeper research quality outputs before long debate loops:

- quality gate snapshot for corpus readiness
- evidence synthesis with top support and contradiction links
- targeted research tasks for unresolved risk flags
- process quality recommendation for next cycle

## Artifact Storage

Run outputs are stored in:

- `outputs/ui/*.json`

Each run returns a `download_url` so users can retrieve artifacts directly.

## Online Deployment (Basic)

You can deploy this service to any Node-compatible host (for example Render, Railway, Azure Web App, Fly.io).

Recommended settings:

- Start command: `npm run ui:start`
- Node version: 18+
- Persistent storage mount for `outputs/` (recommended)

Important notes for online usage:

- The server executes local filesystem/CLI operations; hosted environments must allow process execution and folder access.
- Use authentication/reverse proxy before exposing publicly.
- Restrict accessible folders in production by deployment policy and `PCA_UI_ALLOWED_ROOTS`.

## Security Guidance

- The UI now defaults to localhost-only binding. Keep it that way for normal single-user use.
- Do not expose this UI directly to the open internet without auth.
- Do not add broad filesystem roots such as an entire drive letter to `PCA_UI_ALLOWED_ROOTS`.
- Do not loosen `PCA_UI_ALLOWED_HOSTS` or `PCA_UI_ALLOWED_ORIGINS` unless you are intentionally fronting PCA with a controlled host or reverse proxy.
- Keep confidential exclusion lists in workflow policy.
- Store artifacts in controlled storage with retention policy.
