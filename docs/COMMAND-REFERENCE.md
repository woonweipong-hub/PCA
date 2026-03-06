# PCA Command Reference

This document is the canonical command guide for the PCA CLI.

## Scope and Standards

Each command section follows the same quality standard:

- explicit purpose
- exact syntax
- required and optional flags
- output contract mapping
- common failure modes
- automation guidance

Contract details are defined in `SCHEMA.md`.

## Global Usage

```bash
pca <command> <mode> [flags]
```

Valid commands:

- `prepare`
- `run`
- `propose`
- `critique`
- `route`
- `assess`
- `persist`
- `ingest`
- `evidence-check`
- `help`

Valid modes:

- `discuss`
- `verify`

Global notes:

- Unknown commands fail with non-zero exit.
- Invalid mode fails with `mode must be 'discuss' or 'verify'`.
- Errors are written to stderr as `Error: <message>`.

## `prepare`

Purpose:

Build a PCA session package with mode-specific framework and role prompts.

Syntax:

```bash
pca prepare <discuss|verify> [--decision <text>] [--context <text>] [--max-cycles <1..5>] [--diagram-policy <auto|always|never>] [--topology <single-critic|multi-critic|red-team>] [--policy <fast|balanced|strict>]
```

Flags:

- `--decision`: decision focus text.
- `--context`: additional environment or constraints.
- `--max-cycles`: desired loop count; bounded to `1..5`.
- `--diagram-policy`: workflow diagram inclusion policy.
	- `auto` (default): include diagram when `max_cycles > 3`.
	- `always`: always include workflow diagram.
	- `never`: never include workflow diagram.
- `--topology`: critic-agent topology.
	- `single-critic` (default): one critic pass.
	- `multi-critic`: parallel critic channels with synthesis.
	- `red-team`: adversarial review pattern with heavier challenge.
- `--policy`: governance policy profile.
	- `fast`: lower escalation threshold.
	- `balanced` (default): moderate escalation threshold.
	- `strict`: aggressive HITL escalation for risk/low confidence.

Output contract:

- Emits JSON matching `prepare` contract in `SCHEMA.md`.
- Includes `framework` and `prompts` for propose/critique/assess.

Example:

```bash
pca prepare discuss --decision "service boundary" --context "latency spikes" --max-cycles 3
```

Failure modes:

- missing/invalid mode
- unknown command

Automation guidance:

- Treat output as immutable session input for orchestration.
- Do not parse prompt text heuristically; consume fields by key.

## `run`

Purpose:

Compatibility alias of `prepare` for workflow pipelines that expect a run verb.

Syntax:

```bash
pca run <discuss|verify> [--decision <text>] [--context <text>] [--max-cycles <1..5>] [--diagram-policy <auto|always|never>] [--topology <single-critic|multi-critic|red-team>] [--policy <fast|balanced|strict>]
```

Output contract:

- Same shape and semantics as `prepare`.

Example:

```bash
pca run verify --decision "release gate" --context "uat intermittent failures"
```

Automation guidance:

- Prefer `prepare` for new scripts.
- Keep `run` for compatibility while migrating existing pipelines.

## `propose`

Purpose:

Build proposer role payload with prompt and optional captured proposal text.

Syntax:

```bash
pca propose <discuss|verify> [--decision <text>] [--context <text>] [--proposal <text>] [--sources <path1,path2,...>] [--max-claims-per-doc <1..20>] [--topology <single-critic|multi-critic|red-team>] [--policy <fast|balanced|strict>]
```

Output contract:

- Role payload for `proposer` with prompt, optional proposal summary, and optional evidence digest.

Example:

```bash
pca propose discuss --decision "launch approach" --sources "reports/a.md,reports/b.md"
```

## `critique`

Purpose:

Build critic role payload with prompt, optional critique text, and extracted risk flags.

Syntax:

```bash
pca critique <discuss|verify> [--decision <text>] [--context <text>] [--proposal <text>] [--critique <text>] [--sources <path1,path2,...>] [--max-claims-per-doc <1..20>] [--topology <single-critic|multi-critic|red-team>] [--policy <fast|balanced|strict>]
```

Output contract:

- Role payload for `critic` with prompt, critique summary, extracted risk flags, and optional evidence digest.

Example:

```bash
pca critique discuss --decision "launch approach" --proposal "pilot in two regions" --critique "Risk exists due to uncertain demand baseline"
```

## `route`

Purpose:

Map verdict and risk state into governance recommendation (`HITL` or `HOTL`).

Syntax:

```bash
pca route <discuss|verify> [--verdict <value>] [--needs-human-review <bool>] [--risk-flags <text>] [--scores <text>] [--policy <fast|balanced|strict>] [--judgement <text>] [--actions <text>]
```

Flags:

- `--verdict`: `accepted|accepted-with-conditions|needs-human-review`.
- `--needs-human-review`: boolean override (`true|false|1|0|yes|no`).
- `--risk-flags`: delimited text (`;`, `,`, or newline).
- `--scores`: criterion scoring input in `key=0..5` format.
	- delimiters: `;`, `,`, or newline
	- example: `completeness=4;practicality=3.5;evidence_quality=4`
- `--policy`: governance profile applied after baseline routing.
- `--judgement`: optional narrative judgement.
- `--actions`: optional next actions.

Output contract:

- Emits assessment JSON contract from `SCHEMA.md`.
- `human_control.recommended_mode` is the routing signal.

Example:

```bash
pca route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage;rollback not tested"
```

Failure modes:

- invalid mode
- malformed command usage

Automation guidance:

- Gate deployment steps on `human_control.recommended_mode`.
- Preserve `risk_flags` for audit logs.

## `assess`

Purpose:

Create full PCA assessment payload for decisions and downstream persistence.

Syntax:

```bash
pca assess <discuss|verify> [--verdict <value>] [--judgement <text>] [--actions <text>] [--needs-human-review <bool>] [--risk-flags <text>] [--scores <text>] [--policy <fast|balanced|strict>]
```

Output contract:

- Same contract shape as `route` in `SCHEMA.md`.
- Defaults `verdict` to `accepted-with-conditions` if omitted.
- Adds `score_summary` for weighted scoring, coverage, and quality band.

Example:

```bash
pca assess verify --verdict accepted --judgement "evidence reproducible" --actions "monitor 24h"
pca assess verify --scores "evidence_quality=4;user_impact=3;completeness=5"
```

Automation guidance:

- Use this as final machine-readable quality artifact.
- Persist this output before execution in high-impact workflows.

## `persist`

Purpose:

Persist assessment output to disk as JSON or Markdown.

Syntax:

```bash
pca persist <discuss|verify> --output <path> [--format <json|md>] [--verdict <value>] [--judgement <text>] [--actions <text>] [--needs-human-review <bool>] [--risk-flags <text>] [--scores <text>] [--policy <fast|balanced|strict>]
```

Required flags:

- `--output`: destination path; parent directory is created automatically.

Optional flags:

- `--format`: `json` (default) or `md`.

Output contract:

- Emits persist receipt JSON (`persisted`, `output_path`, `format`, `result`).
- Writes file to `--output`.

Examples:

```bash
pca persist verify --verdict needs-human-review --risk-flags "uncertain evidence" --output development/pca-assessment.json --format json
pca persist discuss --verdict accepted-with-conditions --output development/pca-assessment.md --format md
```

Failure modes:

- missing `--output`
- invalid `--format`

Automation guidance:

- Store artifacts in CI workspace for traceability.
- Prefer JSON for machine pipelines and Markdown for human review packs.

## `ingest`

Purpose:

Build local evidence digest from dataset/doc sources (`.md`, `.txt`, `.json`, `.csv`).

Syntax:

```bash
pca ingest --sources <path1,path2,...> [--max-claims-per-doc <1..20>]
```

Output contract:

- Returns source-level claim digest for local cross-document checks.

Example:

```bash
pca ingest --sources "reports/a.md,reports/b.md" --max-claims-per-doc 10
```

## `evidence-check`

Purpose:

Run cross-document claim linkage and contradiction checks, then produce PCA assessment.

Syntax:

```bash
pca evidence-check <discuss|verify> --sources <path1,path2,...> [--decision <text>] [--context <text>] [--policy <fast|balanced|strict>] [--max-claims-per-doc <1..20>] [--needs-human-review <true|false>]
```

Output contract:

- Returns:
	- `evidence.documents[]`
	- `evidence.links[]` (`support` or `contradiction`)
	- `evidence.metrics`
	- `assessment` with governance routing

Example:

```bash
pca evidence-check verify --decision "release gate" --sources "reports/r1.md,reports/r2.md" --policy strict
```

## `help`

Purpose:

Show concise command usage in terminal.

Syntax:

```bash
pca help
pca --help
pca -h
```

Output contract:

- Plain text usage and examples.

Automation guidance:

- Intended for human operators, not machine parsing.

## Recommended Quality Gates for Every Command Integration

- Validate command exit code.
- Parse JSON for `prepare/run/propose/critique/route/assess/persist/ingest/evidence-check`.
- Route `HITL` decisions to explicit human approval.
- Record command inputs/outputs in run logs.
- Pin schema assumptions to `SCHEMA.md` and tolerate optional field additions.
