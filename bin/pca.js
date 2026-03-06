#!/usr/bin/env node

const {
  buildAssessmentResult,
  formatAssessmentMarkdown,
  parseRiskFlags,
  buildSession
} = require('../src/pca-core');
const fs = require('fs');
const path = require('path');

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
    decision: getArg('--decision'),
    context: getArg('--context'),
    maxCycles: getArg('--max-cycles'),
    verdict: getArg('--verdict'),
    judgement: getArg('--judgement'),
    actions: getArg('--actions'),
    needsHumanReview: getArg('--needs-human-review'),
    riskFlags: getArg('--risk-flags'),
    output: getArg('--output'),
    format: getArg('--format')
  };
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
  const parsed = parseArgs(process.argv);

  if (!parsed.command || ['prepare', 'run', 'route', 'assess', 'persist'].indexOf(parsed.command) === -1) {
    fail('Usage: pca <prepare|run|route|assess|persist> <discuss|verify> [--decision text] [--context text]');
  }

  if (!parsed.mode || ['discuss', 'verify'].indexOf(parsed.mode) === -1) {
    fail("mode must be 'discuss' or 'verify'");
  }

  if (parsed.command === 'prepare' || parsed.command === 'run') {
    const session = buildSession({
      mode: parsed.mode,
      decision: parsed.decision,
      context: parsed.context,
      maxCycles: parsed.maxCycles
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
    riskFlags: parseRiskFlags(parsed.riskFlags)
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
}

run();
