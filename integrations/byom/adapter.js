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
    endpoint: getArg('--endpoint') || process.env.PCA_BYOM_ENDPOINT || 'http://localhost:11434/v1',
    apiKey: getArg('--api-key') || process.env.PCA_BYOM_API_KEY || 'none',
    modelProposal: getArg('--model-proposal') || process.env.PCA_MODEL_PROPOSAL || 'qwen2.5:7b',
    modelCritic: getArg('--model-critic') || process.env.PCA_MODEL_CRITIC || 'llama3.1:8b',
    modelAssess: getArg('--model-assess') || process.env.PCA_MODEL_ASSESS || 'qwen2.5:14b',
    topology: getArg('--topology') || process.env.PCA_TOPOLOGY || 'single-critic',
    policy: getArg('--policy') || process.env.PCA_POLICY || 'balanced',
    maxCycles: getArg('--max-cycles') || process.env.PCA_MAX_CYCLES || '2',
    temperature: Number(getArg('--temperature') || process.env.PCA_MODEL_TEMPERATURE || '0.2'),
    scores: getArg('--scores'),
    riskFlags: getArg('--risk-flags'),
    needsHumanReview: getArg('--needs-human-review')
  };
}

function ensureMode(mode) {
  if (!mode || !['discuss', 'verify'].includes(mode)) {
    fail('Usage: node integrations/byom/adapter.js <discuss|verify> --decision <text> [options]');
  }
}

function normalizeEndpoint(endpoint) {
  const trimmed = String(endpoint || '').trim();
  if (!trimmed) {
    fail('BYOM endpoint is required. Use --endpoint or PCA_BYOM_ENDPOINT.');
  }
  return trimmed.replace(/\/$/, '');
}

async function callOpenAICompatible({ endpoint, apiKey, model, prompt, temperature }) {
  const response = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`provider request failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const payload = await response.json();
  const text = payload
    && payload.choices
    && payload.choices[0]
    && payload.choices[0].message
    && payload.choices[0].message.content
    ? payload.choices[0].message.content
    : '';

  return String(text || '').trim();
}

async function main() {
  const parsed = parseArgs(process.argv);
  ensureMode(parsed.mode);
  if (!parsed.decision) {
    fail('--decision is required');
  }

  const endpoint = normalizeEndpoint(parsed.endpoint);
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
    proposal = await callOpenAICompatible({
      endpoint,
      apiKey: parsed.apiKey,
      model: parsed.modelProposal,
      prompt: session.prompts.proposal,
      temperature: parsed.temperature
    });

    critic = await callOpenAICompatible({
      endpoint,
      apiKey: parsed.apiKey,
      model: parsed.modelCritic,
      prompt: `${session.prompts.critic}\n\nProposal output:\n${proposal}`,
      temperature: parsed.temperature
    });

    assessor = await callOpenAICompatible({
      endpoint,
      apiKey: parsed.apiKey,
      model: parsed.modelAssess,
      prompt: `${session.prompts.assess}\n\nProposal output:\n${proposal}\n\nCritic output:\n${critic}`,
      temperature: parsed.temperature
    });
  } catch (error) {
    fail(`Unable to run BYOM adapter against ${endpoint}. ${error.message}`);
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
    platform: 'byom-openai-compatible',
    endpoint,
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
