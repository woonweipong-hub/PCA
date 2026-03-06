# PCA Architecture

PCA is intentionally standalone and adapter-ready.

## Core Principles

- Independent from any single outer workflow tool.
- Deterministic contracts for Propose/Critique/Assess outputs.
- Explicit governance guidance through HITL/HOTL routing.

## Layers

1. `pca-core` (`src/pca-core.js`)
- Runtime-agnostic decision logic.
- Framework definitions for `discuss` and `verify`.
- Prompt builders and control routing.

2. CLI (`bin/pca.js`)
- Thin command layer for standalone usage.
- Serializes outputs as JSON for toolchain integration.

3. Optional adapters (future)
- GSD adapter, custom CI adapter, product-specific adapters.
- Should map external state into `pca-core` contracts without changing core.

## Output Contract

- `verdict`: `accepted|accepted-with-conditions|needs-human-review`
- `judgement`: concise summary
- `actions`: concrete next steps
- `risk_flags`: unresolved concerns
- `human_control`: `HITL|HOTL` recommendation and rationale
