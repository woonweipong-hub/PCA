const test = require('node:test');
const assert = require('node:assert');

const {
  parseBoolean,
  normalizeRole,
  parseRiskFlags,
  getAssessmentFramework,
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

test('buildSession returns prompts and bounded max cycles', () => {
  const session = buildSession({ mode: 'discuss', decision: 'scope', context: 'ctx', maxCycles: 99 });
  assert.strictEqual(session.max_cycles, 5);
  assert.ok(session.prompts.assess.includes('Assessor'));
});
