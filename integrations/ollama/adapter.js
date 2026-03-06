#!/usr/bin/env node

const {
  buildSession,
  buildAssessmentResult,
  parseRiskFlags,
  parseScores,
  summarizeForChat
} = require('../../src/pca-core');

function fail(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const mode = args[0];

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return null;
    return args[idx + 1];
  };

  return {
    mode,
    decision: getArg('--decision'),
    context: getArg('--context'),
    modelProposal: getArg('--model-proposal') || 'qwen2.5:7b',
    modelCritic: getArg('--model-critic') || 'llama3.1:8b',
    modelAssess: getArg('--model-assess') || 'qwen2.5:14b',
    ollamaUrl: getArg('--ollama-url') || 'http://localhost:11434',
    topology: getArg('--topology') || 'single-critic',
    policy: getArg('--policy') || 'balanced',
    maxCycles: getArg('--max-cycles') || '2',
    scores: getArg('--scores'),
    riskFlags: getArg('--risk-flags'),
    needsHumanReview: getArg('--needs-human-review')
  };
}

async function callOllama(baseUrl, model, prompt) {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  });

  if (!response.ok) {
    throw new Error(`ollama request failed (${response.status})`);
  }

  const payload = await response.json();
  return String(payload.response || '').trim();
}

async function main() {
  const parsed = parseArgs(process.argv);
  if (!parsed.mode || !['discuss', 'verify'].includes(parsed.mode)) {
    fail("Usage: node integrations/ollama/adapter.js <discuss|verify> --decision <text> [options]");
  }

  const session = buildSession({
    mode: parsed.mode,
    decision: parsed.decision,
    context: parsed.context,
    topology: parsed.topology,
    policy: parsed.policy,
    maxCycles: parsed.maxCycles
  });

  let proposal;
  let critic;
  let assessor;
  try {
    proposal = await callOllama(parsed.ollamaUrl, parsed.modelProposal, session.prompts.proposal);
    critic = await callOllama(
      parsed.ollamaUrl,
      parsed.modelCritic,
      `${session.prompts.critic}\n\nProposal output:\n${proposal}`
    );
    assessor = await callOllama(
      parsed.ollamaUrl,
      parsed.modelAssess,
      `${session.prompts.assess}\n\nProposal output:\n${proposal}\n\nCritic output:\n${critic}`
    );
  } catch (error) {
    fail(`Unable to run local models. Ensure Ollama is installed and running (${parsed.ollamaUrl}). ${error.message}`);
  }

  const assessment = buildAssessmentResult({
    mode: parsed.mode,
    judgement: summarizeForChat(assessor),
    actions: 'Review role outputs and convert into tracked execution tasks.',
    needsHumanReview: parsed.needsHumanReview,
    riskFlags: parseRiskFlags(parsed.riskFlags),
    scores: parseScores(parsed.scores),
    policy: parsed.policy
  });

  process.stdout.write(`${JSON.stringify({
    platform: 'ollama',
    mode: parsed.mode,
    models: {
      proposal: parsed.modelProposal,
      critic: parsed.modelCritic,
      assess: parsed.modelAssess
    },
    session,
    role_outputs: {
      proposal,
      critic,
      assess: assessor
    },
    assessment
  }, null, 2)}\n`);
}

main();
