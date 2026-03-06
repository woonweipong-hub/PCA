#!/usr/bin/env node

const { buildSession, buildAssessmentResult, parseRiskFlags } = require('../../src/pca-core');

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
    verdict: getArg('--verdict'),
    judgement: getArg('--judgement'),
    actions: getArg('--actions'),
    needsHumanReview: getArg('--needs-human-review'),
    riskFlags: getArg('--risk-flags')
  };
}

function main() {
  const parsed = parseArgs(process.argv);
  if (!parsed.command || ['prepare', 'assess'].indexOf(parsed.command) === -1) {
    fail('Usage: node integrations/gemini-antigravity/adapter.js <prepare|assess> <discuss|verify> ...');
  }
  if (!parsed.mode || ['discuss', 'verify'].indexOf(parsed.mode) === -1) {
    fail("mode must be 'discuss' or 'verify'");
  }

  if (parsed.command === 'prepare') {
    const session = buildSession({
      mode: parsed.mode,
      decision: parsed.decision,
      context: parsed.context
    });
    process.stdout.write(`${JSON.stringify({ platform: 'gemini-antigravity', kind: 'prepare', pca: session }, null, 2)}\n`);
    return;
  }

  const result = buildAssessmentResult({
    mode: parsed.mode,
    verdict: parsed.verdict,
    judgement: parsed.judgement,
    actions: parsed.actions,
    needsHumanReview: parsed.needsHumanReview,
    riskFlags: parseRiskFlags(parsed.riskFlags)
  });
  process.stdout.write(`${JSON.stringify({ platform: 'gemini-antigravity', kind: 'assess', pca: result }, null, 2)}\n`);
}

main();
