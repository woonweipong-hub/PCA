#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const {
  buildAssessmentResult,
  buildCritiqueResult,
  buildDataQualityCheck,
  buildEvidenceCheck,
  buildProposalResult,
  formatAssessmentMarkdown,
  ingestSources,
  parseRiskFlags,
  parseScores,
  buildSession
} = require('../src/pca-core');

const VALID_COMMANDS = ['prepare', 'run', 'propose', 'critique', 'route', 'assess', 'persist', 'ingest', 'quality-check', 'evidence-check'];
const VALID_MODES = ['discuss', 'verify'];

function fail(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const mode = args[1];

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return null;
    return args[idx + 1];
  };

  return {
    command,
    mode,
    help: command === 'help' || args.includes('--help') || args.includes('-h'),
    decision: getArg('--decision'),
    context: getArg('--context'),
    maxCycles: getArg('--max-cycles'),
    diagramPolicy: getArg('--diagram-policy'),
    topology: getArg('--topology'),
    policy: getArg('--policy'),
    proposal: getArg('--proposal'),
    critique: getArg('--critique'),
    verdict: getArg('--verdict'),
    judgement: getArg('--judgement'),
    actions: getArg('--actions'),
    needsHumanReview: getArg('--needs-human-review'),
    riskFlags: getArg('--risk-flags'),
    scores: getArg('--scores'),
    sources: getArg('--sources'),
    maxClaimsPerDoc: getArg('--max-claims-per-doc'),
    maxFiles: getArg('--max-files'),
    prioritizeRequirements: getArg('--prioritize-requirements'),
    minSources: getArg('--min-sources'),
    minTotalClaims: getArg('--min-total-claims'),
    minAvgClaimsPerDoc: getArg('--min-avg-claims-per-doc'),
    output: getArg('--output'),
    format: getArg('--format')
  };
}

function buildHelpText() {
  return [
    'PCA CLI',
    '',
    'Usage:',
    '  pca <prepare|run|propose|critique|route|assess|persist|ingest|quality-check|evidence-check> <discuss|verify> [flags]',
    '  pca ingest --sources <path1,path2,...> [--max-claims-per-doc 8]',
    '  pca quality-check --sources <path1,path2,...> [quality flags]',
    '  pca help',
    '',
    'Commands:',
    '  prepare  Build PCA session contract (framework + prompts).',
    '  run      Alias of prepare for workflow compatibility.',
    '  propose  Build proposer prompt and optional captured proposal.',
    '  critique Build critic prompt and optional captured critique.',
    '  route    Compute governance recommendation (HITL/HOTL).',
    '  assess   Build PCA assessment payload.',
    '  persist  Save assessment payload to file (json or md).',
    '  ingest   Build local evidence digest from source files.',
    '  quality-check Validate corpus quality before evidence-check.',
    '  evidence-check Run cross-document evidence checks + PCA assessment.',
    '',
    'Common flags:',
    '  --decision <text>',
    '  --context <text>',
    '  --max-cycles <1..5>',
    '  --diagram-policy <auto|always|never> (prepare/run only)',
    '  --topology <single-critic|multi-critic|red-team> (prepare/run only)',
    '  --policy <fast|balanced|strict>',
    '  --proposal <text> (propose/critique)',
    '  --critique <text> (critique)',
    '  --verdict <accepted|accepted-with-conditions|needs-human-review>',
    '  --judgement <text>',
    '  --actions <text>',
    '  --needs-human-review <true|false>',
    '  --risk-flags <"flag1;flag2">',
    '  --scores <"key=0..5;key2=0..5">',
    '  --sources <"path1,path2,..."> (ingest/evidence-check)',
    '    Supported source file types: .md, .txt, .json, .csv',
    '    Note: convert PDFs to .txt first (for example with pdftotext).',
    '  --max-claims-per-doc <1..20> (ingest/evidence-check)',
    '  --max-files <1..2000> (ingest/evidence-check/propose/critique)',
    '  --prioritize-requirements <true|false> (default true)',
    '  --min-sources <n> (quality-check, default 2)',
    '  --min-total-claims <n> (quality-check, default 6)',
    '  --min-avg-claims-per-doc <n> (quality-check, default 2)',
    '  --output <path> (persist only)',
    '  --format <json|md> (persist only, default json)',
    '',
    'Examples:',
    '  pca prepare discuss --decision "API strategy" --context "Migrate safely"',
    '  pca propose discuss --decision "launch plan" --sources "docs/a.md,docs/b.md"',
    '  pca critique discuss --decision "launch plan" --proposal "pilot in two regions"',
    '  pca route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage"',
    '  pca persist verify --verdict "needs-human-review" --output development/pca.json',
    '  pca ingest --sources "docs/a.md,docs/b.md"',
    '  pca quality-check --sources "docs/a.md,docs/b.md" --min-sources 2 --min-total-claims 6',
    '  pca evidence-check verify --decision "release gate" --sources "reports/r1.md,reports/r2.md"',
    '  # TRHS workflow (PDFs converted to text) example:',
    '  pca evidence-check verify --decision "TRHS interpretation" --sources "data/trhs-text" --policy strict --max-files 120 --prioritize-requirements true'
  ].join('\n') + '\n';
}

function writePersistedOutput(outputPath, format, payload) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  if (format === 'md') {
    fs.writeFileSync(outputPath, formatAssessmentMarkdown(payload), 'utf-8');
    return;
  }
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
}

function run() {
  try {
    const parsed = parseArgs(process.argv);

    if (parsed.help) {
      process.stdout.write(buildHelpText());
      return;
    }

    if (!parsed.command || !VALID_COMMANDS.includes(parsed.command)) {
      fail('Usage: pca <prepare|run|propose|critique|route|assess|persist|ingest|quality-check|evidence-check> <discuss|verify> [--decision text] [--context text]');
    }

    if (parsed.command === 'ingest') {
      const digest = ingestSources({
        sources: parsed.sources,
        maxClaimsPerDocument: parsed.maxClaimsPerDoc,
        maxFiles: parsed.maxFiles,
        prioritizeRequirements: parsed.prioritizeRequirements
      });
      process.stdout.write(`${JSON.stringify(digest, null, 2)}\n`);
      return;
    }

    if (parsed.command === 'quality-check') {
      const report = buildDataQualityCheck({
        sources: parsed.sources,
        maxClaimsPerDocument: parsed.maxClaimsPerDoc,
        maxFiles: parsed.maxFiles,
        prioritizeRequirements: parsed.prioritizeRequirements,
        minSources: parsed.minSources,
        minTotalClaims: parsed.minTotalClaims,
        minAvgClaimsPerDoc: parsed.minAvgClaimsPerDoc
      });
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      return;
    }

    if (!parsed.mode || !VALID_MODES.includes(parsed.mode)) {
      fail("mode must be 'discuss' or 'verify'");
    }

    if (parsed.command === 'evidence-check') {
      const result = buildEvidenceCheck({
        mode: parsed.mode,
        decision: parsed.decision,
        context: parsed.context,
        sources: parsed.sources,
        maxClaimsPerDocument: parsed.maxClaimsPerDoc,
        maxFiles: parsed.maxFiles,
        prioritizeRequirements: parsed.prioritizeRequirements,
        policy: parsed.policy,
        needsHumanReview: parsed.needsHumanReview
      });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }

    if (parsed.command === 'propose') {
      const result = buildProposalResult({
        mode: parsed.mode,
        decision: parsed.decision,
        context: parsed.context,
        proposal: parsed.proposal,
        sources: parsed.sources,
        maxClaimsPerDocument: parsed.maxClaimsPerDoc,
        maxFiles: parsed.maxFiles,
        prioritizeRequirements: parsed.prioritizeRequirements,
        topology: parsed.topology,
        policy: parsed.policy
      });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }

    if (parsed.command === 'critique') {
      const result = buildCritiqueResult({
        mode: parsed.mode,
        decision: parsed.decision,
        context: parsed.context,
        proposal: parsed.proposal,
        critique: parsed.critique,
        sources: parsed.sources,
        maxClaimsPerDocument: parsed.maxClaimsPerDoc,
        maxFiles: parsed.maxFiles,
        prioritizeRequirements: parsed.prioritizeRequirements,
        topology: parsed.topology,
        policy: parsed.policy
      });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }

    if (parsed.command === 'prepare' || parsed.command === 'run') {
      const session = buildSession({
        mode: parsed.mode,
        decision: parsed.decision,
        context: parsed.context,
        maxCycles: parsed.maxCycles,
        diagramPolicy: parsed.diagramPolicy,
        topology: parsed.topology,
        policy: parsed.policy
      });
      process.stdout.write(`${JSON.stringify(session, null, 2)}\n`);
      return;
    }

    const assessment = buildAssessmentResult({
      mode: parsed.mode,
      verdict: parsed.verdict,
      judgement: parsed.judgement,
      actions: parsed.actions,
      needsHumanReview: parsed.needsHumanReview,
      riskFlags: parseRiskFlags(parsed.riskFlags),
      scores: parseScores(parsed.scores),
      policy: parsed.policy
    });

    if (parsed.command === 'persist') {
      const outputPath = parsed.output;
      if (!outputPath) {
        fail('persist requires --output <path>');
      }
      const format = (parsed.format || 'json').toLowerCase();
      if (!['json', 'md'].includes(format)) {
        fail("persist --format must be 'json' or 'md'");
      }
      writePersistedOutput(outputPath, format, assessment);
      process.stdout.write(`${JSON.stringify({
        persisted: true,
        output_path: outputPath,
        format,
        result: assessment
      }, null, 2)}\n`);
      return;
    }

    process.stdout.write(`${JSON.stringify(assessment, null, 2)}\n`);
  } catch (error) {
    fail(error && error.message ? error.message : 'unexpected error');
  }
}

run();
