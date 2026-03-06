# GSD Overlay Integration

This integration installs PCA as a quality overlay within GSD-style execution workflows.

## Goal

Keep GSD for planning/execution, and use PCA for:

- research quality gating
- structured propose/critique/assess loops
- verification and governance (`HITL`/`HOTL`)

## Install Patterns

### 1) Side-by-side workspace

Run PCA in parallel with your GSD repo and call PCA APIs/CLI from GSD steps.

### 2) Add as package dependency

If your GSD project uses npm tooling:

```bash
npm install <pca-repo-url>
```

Then invoke:

```bash
npx pca prepare discuss --decision "..." --context "..."
```

### 3) HTTP overlay mode (recommended)

Start PCA web server:

```bash
npm run ui:start
```

Use endpoints from GSD automation:

- `POST /api/framework-proposal`
- `POST /api/research-pack`
- `POST /api/debate-live`
- `POST /api/evidence-check`

## GSD-Quality Flow Mapping

1. Objective + expectations + constraints input
2. `framework-proposal` (build contract)
3. `research-pack` (quality/evidence synthesis)
4. `debate-live` (iterative propose/critique/assess)
5. verification + governance checkpoint

## Runtime Compatibility

PCA overlay supports runtime tagging for:

- `copilot`
- `antigravity`
- `byom`
- `ollama`
- `other`

This keeps audit artifacts consistent across mixed model runtimes.
