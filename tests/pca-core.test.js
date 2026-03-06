const test = require('node:test');
const assert = require('node:assert');

const {
  parseBoolean,
  normalizeRole,
  parseRiskFlags,
  parseScores,
  getGovernancePolicy,
  getTopologyConfig,
  getAssessmentFramework,
  computeScoreSummary,
  buildAssessmentResult,
  getHumanControlRecommendation,
  buildSession
} = require('../src/pca-core');

test('parseBoolean handles common values', () => {
  assert.strictEqual(parseBoolean('true'), true);
  assert.strictEqual(parseBoolean('yes'), true);
  assert.strictEqual(parseBoolean('false'), false);
});

test('normalizeRole maps assessor to judge', () => {
  assert.strictEqual(normalizeRole('assessor'), 'judge');
  assert.strictEqual(normalizeRole('critic'), 'critic');
});

test('frameworks are mode-specific', () => {
  const discuss = getAssessmentFramework('discuss');
  const verify = getAssessmentFramework('verify');
  assert.strictEqual(discuss.name, 'discussion-decision-framework');
  assert.strictEqual(verify.name, 'verification-risk-framework');
});

test('risk flags and control routing work', () => {
  const flags = parseRiskFlags('gap a;gap b');
  assert.strictEqual(flags.length, 2);

  const control = getHumanControlRecommendation('verify', 'needs-human-review', false, flags);
  assert.strictEqual(control.recommended_mode, 'HITL');
});

test('parseScores and scoring summary compute weighted score', () => {
  const scores = parseScores('scope_alignment=4;strategy_clarity=3;completeness=5');
  const summary = computeScoreSummary('discuss', scores);
  assert.strictEqual(summary.coverage.provided > 0, true);
  assert.strictEqual(summary.weighted_score_100 !== null, true);
  assert.ok(['high', 'medium', 'low'].includes(summary.band));
});

test('strict policy escalates low verify score to HITL', () => {
  const result = buildAssessmentResult({
    mode: 'verify',
    verdict: 'accepted',
    scores: parseScores('evidence_quality=2;user_impact=2;release_safety=2'),
    policy: 'strict'
  });
  assert.strictEqual(result.human_control.recommended_mode, 'HITL');
  assert.ok(result.human_control.reason.includes("Policy 'strict'"));
});

test('policy and topology profiles expose expected defaults', () => {
  const fast = getGovernancePolicy('fast');
  const strict = getGovernancePolicy('strict');
  assert.strictEqual(fast.min_weighted_score_100_for_hotl < strict.min_weighted_score_100_for_hotl, true);

  const topology = getTopologyConfig('multi-critic', 2);
  assert.strictEqual(topology.critic_agents, 3);
  assert.strictEqual(topology.synthesis_required, true);
});

test('buildSession returns prompts and bounded max cycles', () => {
  const session = buildSession({ mode: 'discuss', decision: 'scope', context: 'ctx', maxCycles: 99 });
  assert.strictEqual(session.max_cycles, 5);
  assert.ok(session.prompts.assess.includes('Assessor'));
});

test('buildSession workflow diagram is auto-included when cycles exceed 3 and can be disabled', () => {
  const autoSession = buildSession({ mode: 'verify', maxCycles: 4 });
  assert.strictEqual(autoSession.workflow.diagram_included, true);
  assert.strictEqual(autoSession.workflow.diagram_recommended, true);
  assert.ok(autoSession.workflow.diagram_mermaid.includes('flowchart TD'));

  const neverSession = buildSession({ mode: 'verify', maxCycles: 4, diagramPolicy: 'never' });
  assert.strictEqual(neverSession.workflow.diagram_included, false);
  assert.strictEqual(neverSession.workflow.diagram_mermaid, null);

  const topoSession = buildSession({ mode: 'discuss', topology: 'red-team', policy: 'strict', maxCycles: 5 });
  assert.strictEqual(topoSession.orchestration.name, 'red-team');
  assert.strictEqual(topoSession.governance_policy.name, 'strict');
});
