# PCA User Guide

A detailed reference for workflows, troubleshooting, and configuration. For quick-start setup, see the [README](../README.md).

---

## Table of Contents

- [Fork Notice (IP and Attribution)](#fork-notice-ip-and-attribution)
- [Workflow Diagrams](#workflow-diagrams)
- [Command Reference](#command-reference)
- [Integration (Copilot + Antigravity)](#integration-copilot--antigravity)
- [Copilot Chat Usage (No Context Switching)](#copilot-chat-usage-no-context-switching)
- [PCA Extension](#pca-extension)
- [Cost-Aware Quality Policy](#cost-aware-quality-policy)
- [Configuration Reference](#configuration-reference)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Recovery Quick Reference](#recovery-quick-reference)

---

## Fork Notice (IP and Attribution)

As of 2026-03-05, this repository is a fork-based extension of the upstream GSD project.

- Upstream GSD concepts, naming, and baseline workflow remain attributed to their original authors/project.
- This add-on work in PCA is an independent contribution developed out of curiosity and original ideas, using VS Code Copilot with GPT-5.3-Codex.
- No separate direct approval request was made for this add-on; the fork and extension are made under the rights granted by the MIT license.
- Under MIT, others may fork, modify, redistribute, and rebrand this work, provided the original copyright and license notice are retained.
- This fork adds the PCA quality layer focused on structured Discuss/Verify improvements (Propose -> Critique -> Assess, HITL/HOTL routing, and transparent decision records).
- Preserve upstream license terms and attribution when redistributing or modifying this fork.
- If publishing externally, avoid implying official endorsement/partnership unless explicitly granted.

---

## Workflow Diagrams

### Full Project Lifecycle

```
  ┌───────────────────────────────────────────────────────────────┐
  │                        NEW PROJECT                            │
  │ /gsd:new-project  ->  Questions -> Research -> Req -> Roadmap │
  └──────────────────────────────┬────────────────────────────────┘
                                 │
                   ┌─────────────▼─────────────┐
                   │       FOR EACH PHASE      │
                   └─────────────┬─────────────┘
                                 │
          ┌──────────────────────▼──────────────────────┐
          │ /gsd:discuss-phase [N] [--pca optional]     │
          │ Capture implementation decisions            │
          └───────────────┬─────────────────────────────┘
                          │
          if --pca or config(pcj.enabled + pcj.discuss)
                          │
        ┌─────────────────▼────────────────────┐
        │ INTERNAL PCA (Discuss) [LOCAL ONLY]  │
        │ Proposer -> Critic -> Judge          │
        │ writes development/PCA_*.txt         │
        └─────────────────┬────────────────────┘
                          │
          ┌───────────────▼──────────────────────────────┐
          │ /gsd:plan-phase [N]                          │
          └───────────────┬──────────────────────────────┘
                          │
          ┌───────────────▼──────────────────────────────┐
          │ /gsd:execute-phase [N]                       │
          └───────────────┬──────────────────────────────┘
                          │
          ┌───────────────▼──────────────────────────────┐
          │ /gsd:verify-work [N] [--pca optional]        │
          │ UAT + diagnosis                              │
          └───────────────┬──────────────────────────────┘
                          │
          if --pca or config(pcj.enabled + pcj.verify)
                          │
        ┌─────────────────▼────────────────────┐
        │ INTERNAL PCA (Verify) [LOCAL ONLY]   │
        │ Proposer -> Critic -> Judge          │
        │ writes development/PCA_*.txt         │
        └─────────────────┬────────────────────┘
                          │
          Curated outputs only -> .planning/* (no raw PCA logs)
                          │
                    Next phase? ── Yes ──┐
                          │ No            │
  ┌───────────────────────▼───────────────▼──────────────────────┐
  │ /gsd:audit-milestone -> /gsd:complete-milestone -> next vX   │
  └──────────────────────────────────────────────────────────────┘
```

This lifecycle is domain-agnostic and designed for global use by individuals and teams across different industries.

### Planning Agent Coordination

```
  /gsd:plan-phase N
         │
         ├── Phase Researcher (x4 parallel)
         │     ├── Stack researcher
         │     ├── Features researcher
         │     ├── Architecture researcher
         │     └── Pitfalls researcher
         │           │
         │     ┌──────▼──────┐
         │     │ RESEARCH.md │
         │     └──────┬──────┘
         │            │
         │     ┌──────▼──────┐
         │     │   Planner   │  <- Reads PROJECT.md, REQUIREMENTS.md,
         │     │             │     CONTEXT.md, RESEARCH.md
         │     └──────┬──────┘
         │            │
         │     ┌──────▼───────────┐     ┌────────┐
         │     │   Plan Checker   │────>│ PASS?  │
         │     └──────────────────┘     └───┬────┘
         │                                  │
         │                             Yes  │  No
         │                              │   │   │
         │                              │   └───┘  (loop, up to 3x)
         │                              │
         │                        ┌─────▼──────┐
         │                        │ PLAN files │
         │                        └────────────┘
         └── Done
```

### Validation Architecture (Nyquist Layer)

During plan-phase research, GSD now maps automated test coverage to each phase
requirement before any code is written. This ensures that when Claude's executor
commits a task, a feedback mechanism already exists to verify it within seconds.

The researcher detects your existing test infrastructure, maps each requirement to
a specific test command, and identifies any test scaffolding that must be created
before implementation begins (Wave 0 tasks).

The plan-checker enforces this as an 8th verification dimension: plans where tasks
lack automated verify commands will not be approved.

**Output:** `{phase}-VALIDATION.md` -- the feedback contract for the phase.

**Disable:** Set `workflow.nyquist_validation: false` in `/gsd:settings` for
rapid prototyping phases where test infrastructure isn't the focus.

### Retroactive Validation (`/gsd:validate-phase`)

For phases executed before Nyquist validation existed, or for existing codebases
with only traditional test suites, retroactively audit and fill coverage gaps:

```
  /gsd:validate-phase N
         |
         +-- Detect state (VALIDATION.md exists? SUMMARY.md exists?)
         |
         +-- Discover: scan implementation, map requirements to tests
         |
         +-- Analyze gaps: which requirements lack automated verification?
         |
         +-- Present gap plan for approval
         |
         +-- Spawn auditor: generate tests, run, debug (max 3 attempts)
         |
         +-- Update VALIDATION.md
               |
               +-- COMPLIANT -> all requirements have automated checks
               +-- PARTIAL -> some gaps escalated to manual-only
```

The auditor never modifies implementation code — only test files and
VALIDATION.md. If a test reveals an implementation bug, it's flagged as an
escalation for you to address.

**When to use:** After executing phases that were planned before Nyquist was
enabled, or after `/gsd:audit-milestone` surfaces Nyquist compliance gaps.

### Execution Wave Coordination

```
  /gsd:execute-phase N
         │
         ├── Analyze plan dependencies
         │
         ├── Wave 1 (independent plans):
         │     ├── Executor A (fresh 200K context) -> commit
         │     └── Executor B (fresh 200K context) -> commit
         │
         ├── Wave 2 (depends on Wave 1):
         │     └── Executor C (fresh 200K context) -> commit
         │
         └── Verifier
               └── Check codebase against phase goals
                     │
                     ├── PASS -> VERIFICATION.md (success)
                     └── FAIL -> Issues logged for /gsd:verify-work
```

### Brownfield Workflow (Existing Codebase)

```
  /gsd:map-codebase
         │
         ├── Stack Mapper     -> codebase/STACK.md
         ├── Arch Mapper      -> codebase/ARCHITECTURE.md
         ├── Convention Mapper -> codebase/CONVENTIONS.md
         └── Concern Mapper   -> codebase/CONCERNS.md
                │
        ┌───────▼──────────┐
        │ /gsd:new-project │  <- Questions focus on what you're ADDING
        └──────────────────┘
```

---

## Command Reference

### Core Workflow

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/gsd:new-project` | Full project init: questions, research, requirements, roadmap | Start of a new project |
| `/gsd:new-project --auto @idea.md` | Automated init from document | Have a PRD or idea doc ready |
| `/gsd:discuss-phase [N] [--pca]` | Capture implementation decisions (optional Propose→Critique→Assess) | Before planning, to shape how it gets built |
| `/gsd:plan-phase [N]` | Research + plan + verify | Before executing a phase |
| `/gsd:execute-phase <N>` | Execute all plans in parallel waves | After planning is complete |
| `/gsd:verify-work [N] [--pca]` | Manual UAT with auto-diagnosis (optional Propose→Critique→Assess) | After execution completes |
| `/gsd:audit-milestone` | Verify milestone met its definition of done | Before completing milestone |
| `/gsd:complete-milestone` | Archive milestone, tag release | All phases verified |
| `/gsd:new-milestone [name]` | Start next version cycle | After completing a milestone |

### Navigation

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/gsd:progress` | Show status and next steps | Anytime -- "where am I?" |
| `/gsd:resume-work` | Restore full context from last session | Starting a new session |
| `/gsd:pause-work` | Save context handoff | Stopping mid-phase |
| `/gsd:help` | Show all commands | Quick reference |
| `/gsd:update` | Update GSD with changelog preview | Check for new versions |
| `/gsd:join-discord` | Open Discord community invite | Questions or community |

### Phase Management

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/gsd:add-phase` | Append new phase to roadmap | Scope grows after initial planning |
| `/gsd:insert-phase [N]` | Insert urgent work (decimal numbering) | Urgent fix mid-milestone |
| `/gsd:remove-phase [N]` | Remove future phase and renumber | Descoping a feature |
| `/gsd:list-phase-assumptions [N]` | Preview Claude's intended approach | Before planning, to validate direction |
| `/gsd:plan-milestone-gaps` | Create phases for audit gaps | After audit finds missing items |
| `/gsd:research-phase [N]` | Deep ecosystem research only | Complex or unfamiliar domain |

### Brownfield & Utilities

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/gsd:map-codebase` | Analyze existing codebase | Before `/gsd:new-project` on existing code |
| `/gsd:quick` | Ad-hoc task with GSD guarantees | Bug fixes, small features, config changes |
| `/gsd:debug [desc]` | Systematic debugging with persistent state | When something breaks |
| `/gsd:add-todo [desc]` | Capture an idea for later | Think of something during a session |
| `/gsd:check-todos` | List pending todos | Review captured ideas |
| `/gsd:settings` | Configure workflow toggles and model profile | Change model, toggle agents |
| `/gsd:set-profile <profile>` | Quick profile switch | Change cost/quality tradeoff |
| `/gsd:reapply-patches` | Restore local modifications after update | After `/gsd:update` if you had local edits |

---

## Integration (Copilot + Antigravity)

PCA can be used in both VS Code Copilot chat and Google Antigravity (Gemini CLI), with slightly different invocation modes.

### VS Code Copilot Chat

- Native `/gsd:*` or `$gsd-*` triggers are usually not directly executable in Copilot chat.
- Use assistant-orchestrated prompts to run the same workflow without leaving chat.

Example prompts:

- "Initialize this repo with GSD flow, then discuss phase 1 with PCA."
- "Plan phase 1 in budget mode and keep plans atomic."
- "Verify phase 1 with PCA and use HITL if verdict is needs-human-review."

### Google Antigravity (Gemini CLI)

Install from this fork:

```bash
node bin/install.js --gemini --global
```

Use native runtime commands:

```text
/gsd:new-project
/gsd:discuss-phase 1 --pca
/gsd:plan-phase 1
/gsd:execute-phase 1
/gsd:verify-work 1 --pca
```

### Cross-runtime consistency

- Discuss and Verify use the same PCA framework logic across runtimes.
- Transparent role summaries and HITL/HOTL guidance are preserved.
- Internal logs remain local in `development/PCA_*.txt`; curated outcomes persist into `.planning/*`.

### Where to run

- Open your actual application/project folder in VS Code before running GSD workflow.
- Use an empty folder only for a brand-new project.
- Keep this repository for framework development unless your goal is to modify GSD itself.

### Why use GSD if Copilot already executes code?

Copilot can execute tasks directly; GSD adds workflow discipline and quality controls around that capability:

- Persistent project memory in `.planning/*` for continuity and handoff.
- Structured decision quality checks in Discuss/Verify (Propose -> Critique -> Assess).
- Explicit safety routing via `HITL/HOTL` guidance.
- Phase-scoped planning that reduces rework and drift.
- Cost controls via profile selection and conditional PCA usage.

In short: Copilot is the execution engine; GSD is the reliability layer.

---

## Copilot Chat Usage (No Context Switching)

If you want to stay in GitHub Copilot chat, use GSD as an orchestration pattern through natural-language requests to the assistant.

- Native slash/skill triggers (`/gsd:*`, `$gsd-*`) are runtime-specific and are not directly executable in this chat.
- In Copilot chat, ask the assistant to run the equivalent GSD workflow steps.

Recommended starter prompts in Copilot chat:

- "Initialize this repo using GSD flow (map codebase first if needed)."
- "Run discuss for phase 1 with PCA, then summarize decisions in state docs."
- "Plan phase 1, keep it budget-oriented, max 2-3 tasks per plan file."
- "Execute phase 1 and then verify phase 1 with PCA only if risks are high."

This keeps your development in one conversation while preserving the GSD workflow discipline.

---

## PCA Extension

PCA is an optional inner loop used only in Discuss and Verify:

- Proposal: generates a concrete recommendation for a key decision.
- Critic: stress-tests assumptions, risks, and missing evidence.
- Judge: produces a final actionable judgement.

Scope in this fork:

- Used in Discuss for framing decisions (scope, strategy, assumptions).
- Used in Verify for high-stakes interpretation checks.
- Not enabled by default in Plan/Execute.

Improvement notes compared with base GSD:

- Base GSD already has strong discuss and verify phases; this fork adds an optional internal adversarial review layer.
- PCA's intent is quality uplift, not workflow replacement: better assumptions in Discuss, better risk interpretation in Verify.
- The output path is split: internal raw reasoning stays local, curated judgement is written back into project/verification state.

Assessment frameworks are intentionally different:

- Discuss (`discussion-decision-framework`): scope alignment, strategy clarity, assumption soundness, reversibility, execution readiness.
- Verify (`verification-risk-framework`): evidence quality, user impact, reproducibility, scope of failure, release safety.

Structured assessment matrix:

| Mode | Framework | Key Evaluation Focus | Primary Outcome |
|------|-----------|----------------------|-----------------|
| Discuss | `discussion-decision-framework` | Scope fit, strategy clarity, assumption quality, planner readiness | Better planning inputs |
| Verify | `verification-risk-framework` | Evidence quality, user impact, failure scope, release safety | Better release judgement |

HITL/HOTL routing guidance:

| Condition | Suggested Mode | Interpretation |
|-----------|----------------|----------------|
| `needs-human-review` or unresolved high-risk flags | `HITL` | Pause for explicit human approval |
| `accepted-with-conditions` with bounded risk | `HOTL` | Continue with monitored oversight |
| `accepted` with low residual risk | `HOTL` | Continue normal flow |

Persistence behavior:

- Discuss verdicts are written to ACI-aware or generic project/state docs.
- Verify verdicts are written to verification/state docs, including `needs_human_review`.
- Raw Propose/Critique/Assess logs are written to `development/PCA_*.txt` for internal development only.
- `development/` is auto-added to `.gitignore` so internal reasoning logs are not committed.
- Legacy compatibility: existing `development_process/PCJ_*.txt` paths are still supported.

Recorded process and outputs:

- Chat-visible summaries: concise Propose/Critique/Assess summaries for user transparency.
- Control output: final Assess verdict plus suggested `HITL`/`HOTL` mode.
- Internal trace: timestamped `development/PCA_*.txt` records for audits and handoffs.
- Curated state: project-facing decisions persisted into `.planning/*` docs.

VS Code trigger examples:

```bash
/gsd:discuss-phase 3 --pca
/gsd:verify-work 3 --pca
```

Programmatic helper commands used by workflows:

```bash
node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca prepare discuss --phase 3 --decision "scope, strategy, assumptions"
node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca save discuss --role proposer --phase 3 --task "Task T" --decision "scope, strategy, assumptions" --content "..." --log-file "development/PCA_20260305T090000Z.txt"
node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca save discuss --role critic --phase 3 --task "Task T" --decision "scope, strategy, assumptions" --content "..." --log-file "development/PCA_20260305T090000Z.txt"
node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca persist discuss --phase 3 --decision "scope, strategy, assumptions" --verdict "accepted-with-conditions" --judgement "..." --actions "..."

node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca prepare verify --phase 3 --decision "verification interpretation and release risk"
node ~/.claude/get-shit-done/bin/gsd-tools.cjs pca persist verify --phase 3 --decision "verification interpretation and release risk" --verdict "needs-human-review" --judgement "..." --actions "..." --needs-human-review true
```

---

## Cost-Aware Quality Policy

Use this policy to keep token costs low while improving quality where it matters most.

Default operating mode:

- Keep normal flow: Discuss (optional) -> Plan -> Execute -> Verify.
- Use lower-cost profile by default (`budget` or `balanced`).
- Keep PCA off unless risk is meaningful.

Escalation policy (automatable):

- Step 1 (default): no PCA.
- Step 2 (if decision is ambiguous/high-impact): enable PCA for Discuss or Verify only.
- Step 3 (if verify fails once): escalate model profile for Critic/Judge roles.
- Step 4 (if verify fails twice): require human review decision before release.

Suggested model role split for PCA:

- Proposal: fastest/cheapest capable model.
- Critic: stronger reasoning model.
- Judge: strongest available model for final verdict.

Token and cost impact (typical ranges):

| Mode | Relative Token Use | Typical Use Case |
|------|--------------------|------------------|
| No PCA | 1.0x | Routine implementation/verification |
| PCA in Discuss only | 1.2x-1.6x | Architecture or scope decisions |
| PCA in Verify only | 1.2x-1.8x | Release-risk interpretation |
| PCA in Discuss + Verify | 1.5x-2.5x | High-stakes phases |

Practical cost controls:

- Keep prompts scoped to one phase and one decision domain at a time.
- Ask for concise outputs and explicit action lists.
- Cap refinement loops (for example, max 2) before human review.
- Return to default low-cost profile after high-risk checkpoints complete.

---

## Configuration Reference

GSD stores project settings in `.planning/config.json`. Configure during `/gsd:new-project` or update later with `/gsd:settings`.

### Full config.json Schema

```json
{
  "mode": "interactive",
  "granularity": "standard",
  "model_profile": "balanced",
  "planning": {
    "commit_docs": true,
    "search_gitignored": false
  },
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true,
    "nyquist_validation": true
  },
  "pcj": {
    "enabled": false,
    "discuss": false,
    "verify": false
  },
  "git": {
    "branching_strategy": "none",
    "phase_branch_template": "gsd/phase-{phase}-{slug}",
    "milestone_branch_template": "gsd/{milestone}-{slug}"
  }
}
```

### Core Settings

| Setting | Options | Default | What it Controls |
|---------|---------|---------|------------------|
| `mode` | `interactive`, `yolo` | `interactive` | `yolo` auto-approves decisions; `interactive` confirms at each step |
| `granularity` | `coarse`, `standard`, `fine` | `standard` | Phase granularity: how finely scope is sliced (3-5, 5-8, or 8-12 phases) |
| `model_profile` | `quality`, `balanced`, `budget` | `balanced` | Model tier for each agent (see table below) |

### Planning Settings

| Setting | Options | Default | What it Controls |
|---------|---------|---------|------------------|
| `planning.commit_docs` | `true`, `false` | `true` | Whether `.planning/` files are committed to git |
| `planning.search_gitignored` | `true`, `false` | `false` | Add `--no-ignore` to broad searches to include `.planning/` |

> **Note:** If `.planning/` is in `.gitignore`, `commit_docs` is automatically `false` regardless of the config value.

### Workflow Toggles

| Setting | Options | Default | What it Controls |
|---------|---------|---------|------------------|
| `workflow.research` | `true`, `false` | `true` | Domain investigation before planning |
| `workflow.plan_check` | `true`, `false` | `true` | Plan verification loop (up to 3 iterations) |
| `workflow.verifier` | `true`, `false` | `true` | Post-execution verification against phase goals |
| `workflow.nyquist_validation` | `true`, `false` | `true` | Validation architecture research during plan-phase; 8th plan-check dimension |

Disable these to speed up phases in familiar domains or when conserving tokens.

### PCA Toggles

| Setting | Options | Default | What it Controls |
|---------|---------|---------|------------------|
| `pcj.enabled` | `true`, `false` | `false` | Master toggle for PCA availability |
| `pcj.discuss` | `true`, `false` | `false` | Allow PCA loop in `/gsd:discuss-phase` |
| `pcj.verify` | `true`, `false` | `false` | Allow PCA loop in `/gsd:verify-work` |

### Git Branching

| Setting | Options | Default | What it Controls |
|---------|---------|---------|------------------|
| `git.branching_strategy` | `none`, `phase`, `milestone` | `none` | When and how branches are created |
| `git.phase_branch_template` | Template string | `gsd/phase-{phase}-{slug}` | Branch name for phase strategy |
| `git.milestone_branch_template` | Template string | `gsd/{milestone}-{slug}` | Branch name for milestone strategy |

**Branching strategies explained:**

| Strategy | Creates Branch | Scope | Best For |
|----------|---------------|-------|----------|
| `none` | Never | N/A | Solo development, simple projects |
| `phase` | At each `execute-phase` | One phase per branch | Code review per phase, granular rollback |
| `milestone` | At first `execute-phase` | All phases share one branch | Release branches, PR per version |

**Template variables:** `{phase}` = zero-padded number (e.g., "03"), `{slug}` = lowercase hyphenated name, `{milestone}` = version (e.g., "v1.0").

### Model Profiles (Per-Agent Breakdown)

| Agent | `quality` | `balanced` | `budget` |
|-------|-----------|------------|----------|
| gsd-planner | Opus | Opus | Sonnet |
| gsd-roadmapper | Opus | Sonnet | Sonnet |
| gsd-executor | Opus | Sonnet | Sonnet |
| gsd-phase-researcher | Opus | Sonnet | Haiku |
| gsd-project-researcher | Opus | Sonnet | Haiku |
| gsd-research-synthesizer | Sonnet | Sonnet | Haiku |
| gsd-debugger | Opus | Sonnet | Sonnet |
| gsd-codebase-mapper | Sonnet | Haiku | Haiku |
| gsd-verifier | Sonnet | Sonnet | Haiku |
| gsd-plan-checker | Sonnet | Sonnet | Haiku |
| gsd-integration-checker | Sonnet | Sonnet | Haiku |
| pca-proposal | Opus | Sonnet | Haiku |
| pca-critic | Sonnet | Sonnet | Haiku |
| pca-assess | Opus | Sonnet | Haiku |

**Profile philosophy:**
- **quality** -- Opus for all decision-making agents, Sonnet for read-only verification. Use when quota is available and the work is critical.
- **balanced** -- Opus only for planning (where architecture decisions happen), Sonnet for everything else. The default for good reason.
- **budget** -- Sonnet for anything that writes code, Haiku for research and verification. Use for high-volume work or less critical phases.

---

## Usage Examples

### New Project (Full Cycle)

```bash
claude --dangerously-skip-permissions
/gsd:new-project            # Answer questions, configure, approve roadmap
/clear
/gsd:discuss-phase 1        # Lock in your preferences
/gsd:plan-phase 1           # Research + plan + verify
/gsd:execute-phase 1        # Parallel execution
/gsd:verify-work 1          # Manual UAT
/clear
/gsd:discuss-phase 2        # Repeat for each phase
...
/gsd:audit-milestone        # Check everything shipped
/gsd:complete-milestone     # Archive, tag, done
```

### New Project from Existing Document

```bash
/gsd:new-project --auto @prd.md   # Auto-runs research/requirements/roadmap from your doc
/clear
/gsd:discuss-phase 1               # Normal flow from here
```

### Existing Codebase

```bash
/gsd:map-codebase           # Analyze what exists (parallel agents)
/gsd:new-project            # Questions focus on what you're ADDING
# (normal phase workflow from here)
```

### Quick Bug Fix

```bash
/gsd:quick
> "Fix the login button not responding on mobile Safari"
```

### Resuming After a Break

```bash
/gsd:progress               # See where you left off and what's next
# or
/gsd:resume-work            # Full context restoration from last session
```

### Preparing for Release

```bash
/gsd:audit-milestone        # Check requirements coverage, detect stubs
/gsd:plan-milestone-gaps    # If audit found gaps, create phases to close them
/gsd:complete-milestone     # Archive, tag, done
```

### Speed vs Quality Presets

| Scenario | Mode | Granularity | Profile | Research | Plan Check | Verifier |
|----------|------|-------|---------|----------|------------|----------|
| Prototyping | `yolo` | `coarse` | `budget` | off | off | off |
| Normal dev | `interactive` | `standard` | `balanced` | on | on | on |
| Production | `interactive` | `fine` | `quality` | on | on | on |

### Mid-Milestone Scope Changes

```bash
/gsd:add-phase              # Append a new phase to the roadmap
# or
/gsd:insert-phase 3         # Insert urgent work between phases 3 and 4
# or
/gsd:remove-phase 7         # Descope phase 7 and renumber
```

---

## Troubleshooting

### "Project already initialized"

You ran `/gsd:new-project` but `.planning/PROJECT.md` already exists. This is a safety check. If you want to start over, delete the `.planning/` directory first.

### Context Degradation During Long Sessions

Clear your context window between major commands: `/clear` in Claude Code. GSD is designed around fresh contexts -- every subagent gets a clean 200K window. If quality is dropping in the main session, clear and use `/gsd:resume-work` or `/gsd:progress` to restore state.

### Plans Seem Wrong or Misaligned

Run `/gsd:discuss-phase [N]` before planning. Most plan quality issues come from Claude making assumptions that `CONTEXT.md` would have prevented. You can also run `/gsd:list-phase-assumptions [N]` to see what Claude intends to do before committing to a plan.

### Execution Fails or Produces Stubs

Check that the plan was not too ambitious. Plans should have 2-3 tasks maximum. If tasks are too large, they exceed what a single context window can produce reliably. Re-plan with smaller scope.

### Lost Track of Where You Are

Run `/gsd:progress`. It reads all state files and tells you exactly where you are and what to do next.

### Need to Change Something After Execution

Do not re-run `/gsd:execute-phase`. Use `/gsd:quick` for targeted fixes, or `/gsd:verify-work` to systematically identify and fix issues through UAT.

### Model Costs Too High

Switch to budget profile: `/gsd:set-profile budget`. Disable research and plan-check agents via `/gsd:settings` if the domain is familiar to you (or to Claude).

### Working on a Sensitive/Private Project

Set `commit_docs: false` during `/gsd:new-project` or via `/gsd:settings`. Add `.planning/` to your `.gitignore`. Planning artifacts stay local and never touch git.

### GSD Update Overwrote My Local Changes

Since v1.17, the installer backs up locally modified files to `gsd-local-patches/`. Run `/gsd:reapply-patches` to merge your changes back.

### Subagent Appears to Fail but Work Was Done

A known workaround exists for a Claude Code classification bug. GSD's orchestrators (execute-phase, quick) spot-check actual output before reporting failure. If you see a failure message but commits were made, check `git log` -- the work may have succeeded.

---

## Recovery Quick Reference

| Problem | Solution |
|---------|----------|
| Lost context / new session | `/gsd:resume-work` or `/gsd:progress` |
| Phase went wrong | `git revert` the phase commits, then re-plan |
| Need to change scope | `/gsd:add-phase`, `/gsd:insert-phase`, or `/gsd:remove-phase` |
| Milestone audit found gaps | `/gsd:plan-milestone-gaps` |
| Something broke | `/gsd:debug "description"` |
| Quick targeted fix | `/gsd:quick` |
| Plan doesn't match your vision | `/gsd:discuss-phase [N]` then re-plan |
| Costs running high | `/gsd:set-profile budget` and `/gsd:settings` to toggle agents off |
| Update broke local changes | `/gsd:reapply-patches` |

---

## Project File Structure

For reference, here is what GSD creates in your project:

```
.planning/
  PROJECT.md              # Project vision and context (always loaded)
  REQUIREMENTS.md         # Scoped v1/v2 requirements with IDs
  ROADMAP.md              # Phase breakdown with status tracking
  STATE.md                # Decisions, blockers, session memory
  config.json             # Workflow configuration
  MILESTONES.md           # Completed milestone archive
  research/               # Domain research from /gsd:new-project
  todos/
    pending/              # Captured ideas awaiting work
    done/                 # Completed todos
  debug/                  # Active debug sessions
    resolved/             # Archived debug sessions
  codebase/               # Brownfield codebase mapping (from /gsd:map-codebase)
  phases/
    XX-phase-name/
      XX-YY-PLAN.md       # Atomic execution plans
      XX-YY-SUMMARY.md    # Execution outcomes and decisions
      CONTEXT.md          # Your implementation preferences
      RESEARCH.md         # Ecosystem research findings
      VERIFICATION.md     # Post-execution verification results
```
