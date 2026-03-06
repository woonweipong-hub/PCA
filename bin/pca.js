#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const {
  buildAssessmentResult,
  formatAssessmentMarkdown,
  parseRiskFlags,
  parseScores,
  buildSession
} = require('../src/pca-core');

const VALID_COMMANDS = ['prepare', 'run', 'route', 'assess', 'persist'];
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
    verdict: getArg('--verdict'),
    judgement: getArg('--judgement'),
    actions: getArg('--actions'),
    needsHumanReview: getArg('--needs-human-review'),
    riskFlags: getArg('--risk-flags'),
    scores: getArg('--scores'),
    output: getArg('--output'),
    format: getArg('--format')
  };
}

function buildHelpText() {
  return [
    'PCA CLI',
    '',
    'Usage:',
    '  pca <prepare|run|route|assess|persist> <discuss|verify> [flags]',
    '  pca help',
    '',
    'Commands:',
    '  prepare  Build PCA session contract (framework + prompts).',
    '  run      Alias of prepare for workflow compatibility.',
    '  route    Compute governance recommendation (HITL/HOTL).',
    '  assess   Build PCA assessment payload.',
    '  persist  Save assessment payload to file (json or md).',
    '',
    'Common flags:',
    '  --decision <text>',
    '  --context <text>',
    '  --max-cycles <1..5>',
    '  --diagram-policy <auto|always|never> (prepare/run only)',
    '  --topology <single-critic|multi-critic|red-team> (prepare/run only)',
    '  --policy <fast|balanced|strict>',
    '  --verdict <accepted|accepted-with-conditions|needs-human-review>',
    '  --judgement <text>',
    '  --actions <text>',
    '  --needs-human-review <true|false>',
    '  --risk-flags <"flag1;flag2">',
    '  --scores <"key=0..5;key2=0..5">',
    '  --output <path> (persist only)',
    '  --format <json|md> (persist only, default json)',
    '',
    'Examples:',
    '  pca prepare discuss --decision "API strategy" --context "Migrate safely"',
    '  pca route verify --verdict "accepted-with-conditions" --risk-flags "partial coverage"',
    '  pca persist verify --verdict "needs-human-review" --output development/pca.json'
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
      fail('Usage: pca <prepare|run|route|assess|persist> <discuss|verify> [--decision text] [--context text]');
    }

    if (!parsed.mode || !VALID_MODES.includes(parsed.mode)) {
      fail("mode must be 'discuss' or 'verify'");
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
