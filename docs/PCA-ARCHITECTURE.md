# PCA Architecture

PCA is intentionally standalone and adapter-ready.

"This project is independently developed. Any similarity to other systems reflects common industry patterns (for example proposer/critic/evaluator workflows) and does not imply code, prompt, or proprietary method reuse."

## Core Principles

- Independent from any single outer workflow tool.
- Deterministic contracts for Propose/Critique/Assess outputs.
- Explicit governance guidance through HITL/HOTL routing.

## Historical Reference Patterns (2024)

PCA is informed by publicly discussed patterns from 2024-era agent systems:

- generate -> critique -> revise loops
- proposer/checker style role separation
- evaluator/judge style final routing

These references are conceptual only. PCA implementation, contracts, and orchestration are original to this repository.

## IP and Attribution Guardrails

To avoid IP concerns, contributors should follow these rules:

- Do not copy proprietary prompts, hidden system instructions, private datasets, or closed-source code from external tools.
- Do not claim compatibility through brand names unless integration is documented and technically implemented.
- Keep all adapters contract-based (`SCHEMA.md`) and implementation-original.
- Use only public documentation and public APIs for external integrations.
- Record inspiration as high-level patterns, not verbatim text or unique proprietary artifacts.
- Preserve attribution language as "inspired by" instead of implying direct reuse.

Reference log for prior-art acknowledgement and independent-implementation notes: `docs/PRIOR-ART.md`.

## Layers

1. `pca-core` (`src/pca-core.js`)
- Runtime-agnostic decision logic.
- Framework definitions for `discuss` and `verify`.
- Prompt builders and control routing.

2. CLI (`bin/pca.js`)
- Thin command layer for standalone usage.
- Serializes outputs as JSON for toolchain integration.

3. Optional adapters (future)
- External executor adapter (for example GSD), custom CI adapter, product-specific adapters.
- Should map external state into `pca-core` contracts without changing core.

## Output Contract

- `verdict`: `accepted|accepted-with-conditions|needs-human-review`
- `judgement`: concise summary
- `actions`: concrete next steps
- `risk_flags`: unresolved concerns
- `human_control`: `HITL|HOTL` recommendation and rationale
