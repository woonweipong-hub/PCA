# GSD Numbered Sequence

This workspace adds a numbered alias layer so the GSD picker is easier to understand without changing the external GSD install.

## Main Sequence

1. `GSD 0 Auto Flow`
2. `GSD 1 Roadmap Builder`
3. `GSD 2 Phase Research`
4. `GSD 3 Plan Builder`
5. `GSD 4 Plan Review`
6. `GSD 5 Phase Executor`
7. `GSD 6 Integration Check`
8. `GSD 7 Final Verify`
9. `GSD 8 Debug Recovery`
10. `GSD 9 Codebase Mapper`
11. `GSD 10 Project Research`
12. `GSD 11 Research Synthesizer`
13. `GSD 12 Nyquist Auditor`

## Mapping to Common GSD Names

| Numbered alias | Common GSD name |
| --- | --- |
| `GSD 0 Auto Flow` | automated orchestration |
| `GSD 1 Roadmap Builder` | `gsd-roadmapper` |
| `GSD 2 Phase Research` | `gsd-phase-researcher` |
| `GSD 3 Plan Builder` | `gsd-planner` |
| `GSD 4 Plan Review` | `gsd-plan-checker` |
| `GSD 5 Phase Executor` | `gsd-executor` |
| `GSD 6 Integration Check` | `gsd-integration-checker` |
| `GSD 7 Final Verify` | `gsd-verifier` |
| `GSD 8 Debug Recovery` | `gsd-debugger` |
| `GSD 9 Codebase Mapper` | `gsd-codebase-mapper` |
| `GSD 10 Project Research` | `gsd-project-researcher` |
| `GSD 11 Research Synthesizer` | `gsd-research-synthesizer` |
| `GSD 12 Nyquist Auditor` | `gsd-nyquist-auditor` |

## Where PCA Fits

Use PCA as the preliminary framing layer when the task is ambiguous, evidence-heavy, or governance-sensitive.

Recommended `GSD 0` pattern:

1. `PCA 0 Auto Flow` or PCA API `framework-proposal`
2. Optional PCA evidence and debate pass
3. `GSD 1 Roadmap Builder`
4. `GSD 2 Phase Research` if uncertainty remains
5. `GSD 3 Plan Builder`
6. `GSD 4 Plan Review`
7. `GSD 5 Phase Executor`
8. `GSD 6 Integration Check`
9. `GSD 7 Final Verify`
10. `GSD 8 Debug Recovery` only if the prior stage fails

## Specialist Use

These roles are part of the full alias set, but they are usually used as supporting stages rather than every time in the core path.

- `GSD 9 Codebase Mapper`: use before `GSD 1` when the repo is unfamiliar.
- `GSD 10 Project Research`: use for broader project-level research.
- `GSD 11 Research Synthesizer`: use when multiple research outputs need consolidation.
- `GSD 12 Nyquist Auditor`: use as an extra test and verification audit layer.

## Practical Use

For small or familiar tasks:

1. `GSD 1 Roadmap Builder`
2. `GSD 3 Plan Builder`
3. `GSD 4 Plan Review`
4. `GSD 5 Phase Executor`
5. `GSD 7 Final Verify`

For regulatory or evidence-sensitive tasks:

1. `GSD 0 Auto Flow`
2. Let PCA frame the problem first
3. Continue through the numbered GSD stages
