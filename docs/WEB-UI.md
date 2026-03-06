# PCA Web UI

PCA is an Evidence-Governed Adaptive Solver, and this Browser UI is its visual control-desk platform for governed human-machine work.
It is grounded in construction-industry workflows, where regulation, coordination, safety, interpretation, and traceability matter, but the underlying reasoning and working method can transfer to other evidence-heavy domains.
It supports adaptive debate depth, evidence checks, explicit `HITL/HOTL` routing, and optional Python package-backed symbolic checks (`z3-solver`) when formal constraints matter.

PCA Web UI provides a browser-based platform for discussion-led intake, OCR, PDF conversion, quality gating, evidence checks, live governed runs, and artifact downloads.

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
- Start quickly with built-in use-case profiles (CORENET X, accessibility, buildability, MEP/C&S, Green Mark, FM, HS, cost/spec checks, and BCA master compliance pre-check).
- Select per-role models (`proposal`, `critique`, `assess`) and runtime notes for traceable runs.
- Use the built-in Guide and Install panel for runtime-specific setup and generated CLI snippets.
- View a workflow map in the UI showing objective -> research -> debate -> verification -> artifact flow.
- Download JSON artifacts from each run.

## Traceability in the UI

The UI is designed to make PCA runs inspectable and reviewable.

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

## Start Locally

```bash
npm install
npm run ui:start
```

Open:

- `http://localhost:4173`

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
