# Prior Art and Acknowledgement Log

This document tracks public references reviewed during PCA development.

Use this log to:

- acknowledge conceptual prior art transparently
- document independent implementation boundaries
- reduce IP risk by recording what was and was not reused

## Independent Development Statement

"This project is independently developed. Any similarity to other systems reflects common industry patterns (for example proposer/critic/evaluator workflows) and does not imply code, prompt, or proprietary method reuse."

## How to Use This Log

For each reference, capture:

- what concept was studied
- what was not reused (code/prompts/private data)
- how PCA differs in implementation

## Prior Art Table

| Reference | Type | Public URL | Concept Taken | Not Reused | PCA Differentiation |
|---|---|---|---|---|---|
| Self-Refine: Iterative Refinement with Self-Feedback (2023) | Paper | https://arxiv.org/abs/2303.17651 | Generate -> feedback -> revise loop as a general reasoning pattern | No text, code, or prompt templates copied | PCA uses explicit governance routing (`HITL`/`HOTL`) and schema-bound outputs |
| Reflexion (2023) | Paper | https://arxiv.org/abs/2303.11366 | Agent improvement with critique/reflection loops | No benchmark code/prompts reused | PCA uses CLI-first contracts and evidence-check metrics for operations |
| Multiagent Debate (2023) | Paper | https://arxiv.org/abs/2305.14325 | Multi-role argument/counter-argument for stronger reasoning | No debate prompts or implementation details copied | PCA includes policy-aware escalation and auditable artifacts |
| Critic-style review patterns (public 2024 era) | Public product/blog category | https://openai.com/index/introducing-criticgpt/ | Reviewer/critic role as a quality filter | No product internals, hidden prompts, or proprietary methods reused | PCA critic is contract-driven and integrated with evidence and governance checks |
| Constitutional AI (2022) | Paper | https://arxiv.org/abs/2212.08073 | Rule-based critique/evaluation framing | No constitutional prompt sets copied | PCA uses explicit project-defined policies (`fast`/`balanced`/`strict`) |
| GSD workflow discipline (project-level reference context) | Workflow reference | Internal/project context | Objective -> execution -> verification quality discipline | No proprietary implementation artifacts reused | PCA is standalone and adapter-ready with independent code/contracts |

## Review Checklist (Per New Feature)

1. Add public references used for conceptual research.
2. Record what was not reused.
3. Document implementation differences in PCA.
4. Link feature PR/commit to this file.
5. Confirm `SCHEMA.md` and tests reflect independent behavior.

## Contribution Rule

Do not import proprietary prompts, hidden instructions, private datasets, or closed-source code from external systems.
