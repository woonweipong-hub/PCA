const VALID_MODES = new Set(['discuss', 'verify']);

function assertMode(mode) {
  if (!VALID_MODES.has(mode)) {
    throw new Error("mode must be 'discuss' or 'verify'");
  }
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function normalizeRole(role) {
  const normalized = String(role || '').toLowerCase().trim();
  return normalized === 'assessor' ? 'judge' : normalized;
}

function summarizeForChat(content) {
  const text = String(content || '').replace(/\r\n/g, '\n').trim();
  if (!text) return 'No role output provided.';
  const compact = text.split('\n').map((line) => line.trim()).filter(Boolean).join(' ');
  return compact.length > 320 ? `${compact.slice(0, 317)}...` : compact;
}

function parseRiskFlags(value) {
  if (!value) return [];
  return String(value)
    .split(/[;,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function buildAssessmentResult({ mode, verdict, judgement, actions, needsHumanReview, riskFlags }) {
  assertMode(mode);
  const normalizedVerdict = verdict || 'accepted-with-conditions';
  const normalizedJudgement = judgement || null;
  const normalizedActions = actions || null;
  const normalizedNeedsHumanReview = parseBoolean(needsHumanReview);
  const normalizedRiskFlags = Array.isArray(riskFlags) ? riskFlags : parseRiskFlags(riskFlags);
  const control = getHumanControlRecommendation(
    mode,
    normalizedVerdict,
    normalizedNeedsHumanReview,
    normalizedRiskFlags
  );

  return {
    mode,
    verdict: normalizedVerdict,
    judgement: normalizedJudgement,
    actions: normalizedActions,
    risk_flags: normalizedRiskFlags,
    needs_human_review: normalizedNeedsHumanReview,
    human_control: control
  };
}

function formatAssessmentMarkdown(result) {
  const lines = [
    '# PCA Assessment',
    '',
    `- mode: ${result.mode}`,
    `- verdict: ${result.verdict}`,
    `- needs_human_review: ${result.needs_human_review ? 'true' : 'false'}`,
    `- human_control: ${result.human_control.recommended_mode}`,
    `- human_control_reason: ${result.human_control.reason}`,
    `- risk_flags: ${result.risk_flags.length ? result.risk_flags.join('; ') : 'none'}`,
    `- judgement: ${result.judgement || 'n/a'}`,
    `- actions: ${result.actions || 'n/a'}`
  ];
  return `${lines.join('\n')}\n`;
}

function getAssessmentFramework(mode) {
  assertMode(mode);

  const universal = [
    { key: 'completeness', weight: 0.2, question: 'Does it cover key aspects with no critical gaps?' },
    { key: 'practicality', weight: 0.2, question: 'Is this realistic for delivery?' },
    { key: 'soundness', weight: 0.2, question: 'Is it logically consistent?' },
    { key: 'feasibility', weight: 0.2, question: 'Is it achievable in constraints?' },
    { key: 'governance_safety', weight: 0.2, question: 'Are risk and safety constraints handled?' }
  ];

  if (mode === 'verify') {
    return {
      name: 'verification-risk-framework',
      purpose: 'Evaluate evidence quality and release risk.',
      universal_criteria: universal,
      criteria: [
        { key: 'evidence_quality', weight: 0.35, question: 'Is evidence reproducible and sufficient?' },
        { key: 'user_impact', weight: 0.3, question: 'How severe is user impact?' },
        { key: 'scope_of_failure', weight: 0.2, question: 'How broad is failure scope?' },
        { key: 'release_safety', weight: 0.15, question: 'Is release safe now?' }
      ]
    };
  }

  return {
    name: 'discussion-decision-framework',
    purpose: 'Select implementation framing before planning.',
    universal_criteria: universal,
    criteria: [
      { key: 'scope_alignment', weight: 0.35, question: 'Does this fit phase scope?' },
      { key: 'strategy_clarity', weight: 0.3, question: 'Is direction clear enough to plan?' },
      { key: 'assumption_quality', weight: 0.2, question: 'Are assumptions explicit and testable?' },
      { key: 'execution_readiness', weight: 0.15, question: 'Can the team execute without re-discovery?' }
    ]
  };
}

function getHumanControlRecommendation(mode, verdict, needsHumanReview, riskFlags) {
  assertMode(mode);
  if (needsHumanReview || verdict === 'needs-human-review') {
    return {
      recommended_mode: 'HITL',
      reason: 'High uncertainty or unresolved risk requires explicit human decision.'
    };
  }

  if (mode === 'verify' && (verdict === 'accepted-with-conditions' || riskFlags.length > 0)) {
    return {
      recommended_mode: 'HOTL',
      reason: 'Proceed with oversight while conditions and risk flags are monitored.'
    };
  }

  return {
    recommended_mode: 'HOTL',
    reason: 'No critical blockers detected.'
  };
}

function frameworkToPromptBlock(framework) {
  const criteriaLines = framework.criteria
    .map((c) => `- ${c.key} (weight ${c.weight}): ${c.question}`)
    .join('\n');
  return [
    `Assessment framework: ${framework.name}`,
    `Purpose: ${framework.purpose}`,
    'Criteria:',
    criteriaLines
  ].join('\n');
}

function buildProposalPrompt(mode, decision, context) {
  const framework = getAssessmentFramework(mode);
  const preface = mode === 'verify'
    ? 'You are the Proposer in PCA verification.'
    : 'You are the Proposer in PCA discuss mode.';
  return [
    preface,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    frameworkToPromptBlock(framework),
    'Return recommendation, assumptions, risks, and next actions.'
  ].join('\n');
}

function buildCriticPrompt(mode, decision, proposalText, context) {
  const framework = getAssessmentFramework(mode);
  const preface = mode === 'verify'
    ? 'You are the Critic in PCA verification.'
    : 'You are the Critic in PCA discuss mode.';
  return [
    preface,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    frameworkToPromptBlock(framework),
    'Return strongest objections, missing evidence, and safer alternatives.'
  ].join('\n');
}

function buildAssessPrompt(mode, decision, proposalText, criticText, context) {
  const framework = getAssessmentFramework(mode);
  return [
    `You are the Assessor in PCA ${mode} mode.`,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    `Critic: ${criticText || '(to be supplied)'}`,
    frameworkToPromptBlock(framework),
    'Output: verdict, judgement, actions, risk_flags, needs_human_review.'
  ].join('\n');
}

function buildSession({ mode, decision, context, maxCycles = 2 }) {
  assertMode(mode);
  const cycles = Math.max(1, Math.min(Number(maxCycles) || 2, 5));
  const framework = getAssessmentFramework(mode);
  return {
    mode,
    decision: decision || null,
    context: context || null,
    max_cycles: cycles,
    framework,
    prompts: {
      proposal: buildProposalPrompt(mode, decision, context),
      critic: buildCriticPrompt(mode, decision, null, context),
      assess: buildAssessPrompt(mode, decision, null, null, context)
    }
  };
}

module.exports = {
  parseBoolean,
  normalizeRole,
  summarizeForChat,
  parseRiskFlags,
  getAssessmentFramework,
  getHumanControlRecommendation,
  buildAssessmentResult,
  formatAssessmentMarkdown,
  buildProposalPrompt,
  buildCriticPrompt,
  buildAssessPrompt,
  buildSession
};
