const VALID_MODES = new Set(['discuss', 'verify']);
const VALID_POLICIES = new Set(['fast', 'balanced', 'strict']);
const VALID_TOPOLOGIES = new Set(['single-critic', 'multi-critic', 'red-team']);
const WORKFLOW_DIAGRAM = [
  'flowchart TD',
  '  A[Decision + context] --> B[pca prepare or run]',
  '  B --> C[Proposer Agent]',
  '  C --> D[Critic Agent]',
  '  D --> E[Assessor Agent]',
  '  E --> F[pca assess]',
  '  F --> G[pca route]',
  '  G -->|HITL| H[Human approval required]',
  '  G -->|HOTL| I[Proceed with monitoring]',
  '  H --> J[pca persist]',
  '  I --> J[pca persist]'
].join('\n');

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

function parseScores(value) {
  if (!value) return {};
  return String(value)
    .split(/[;,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const parts = entry.split('=');
      if (parts.length !== 2) return acc;
      const key = parts[0].trim();
      const score = Number(parts[1].trim());
      if (!key || Number.isNaN(score)) return acc;
      acc[key] = Math.max(0, Math.min(score, 5));
      return acc;
    }, {});
}

function normalizePolicy(policy) {
  const normalized = String(policy || 'balanced').toLowerCase().trim();
  if (!VALID_POLICIES.has(normalized)) {
    throw new Error("policy must be 'fast', 'balanced', or 'strict'");
  }
  return normalized;
}

function getGovernancePolicy(policy) {
  const normalized = normalizePolicy(policy);
  if (normalized === 'fast') {
    return {
      name: normalized,
      min_weighted_score_100_for_hotl: 40,
      min_coverage_ratio_for_hotl: 0.2,
      hitl_on_any_risk_flag: false,
      hitl_on_low_score: true
    };
  }
  if (normalized === 'strict') {
    return {
      name: normalized,
      min_weighted_score_100_for_hotl: 75,
      min_coverage_ratio_for_hotl: 0.5,
      hitl_on_any_risk_flag: true,
      hitl_on_low_score: true
    };
  }
  return {
    name: 'balanced',
    min_weighted_score_100_for_hotl: 60,
    min_coverage_ratio_for_hotl: 0.35,
    hitl_on_any_risk_flag: false,
    hitl_on_low_score: true
  };
}

function normalizeTopology(topology) {
  const normalized = String(topology || 'single-critic').toLowerCase().trim();
  if (!VALID_TOPOLOGIES.has(normalized)) {
    throw new Error("topology must be 'single-critic', 'multi-critic', or 'red-team'");
  }
  return normalized;
}

function getTopologyConfig(topology, maxCycles) {
  const normalized = normalizeTopology(topology);
  const cycles = Number(maxCycles) || 2;
  if (normalized === 'multi-critic') {
    return {
      name: normalized,
      critic_agents: 3,
      synthesis_required: true,
      recommended_max_cycles: 4,
      cycle_pressure: cycles < 4 ? 'high' : 'normal'
    };
  }
  if (normalized === 'red-team') {
    return {
      name: normalized,
      critic_agents: 2,
      synthesis_required: true,
      recommended_max_cycles: 5,
      cycle_pressure: cycles < 5 ? 'high' : 'normal'
    };
  }
  return {
    name: 'single-critic',
    critic_agents: 1,
    synthesis_required: false,
    recommended_max_cycles: 2,
    cycle_pressure: cycles < 2 ? 'high' : 'normal'
  };
}

function getScoringModel(mode) {
  const framework = getAssessmentFramework(mode);
  const criteria = [
    ...framework.universal_criteria.map((item) => ({
      key: item.key,
      weight: Number((item.weight * 0.4).toFixed(4))
    })),
    ...framework.criteria.map((item) => ({
      key: item.key,
      weight: Number((item.weight * 0.6).toFixed(4))
    }))
  ];
  return {
    scale: { min: 0, max: 5 },
    criteria
  };
}

function computeScoreSummary(mode, scoresInput) {
  const scoringModel = getScoringModel(mode);
  const scores = scoresInput && typeof scoresInput === 'object' ? scoresInput : parseScores(scoresInput);

  let weightedSum = 0;
  let providedWeight = 0;
  const criteria = scoringModel.criteria.map((criterion) => {
    const raw = scores[criterion.key];
    const score = typeof raw === 'number' && !Number.isNaN(raw)
      ? Math.max(scoringModel.scale.min, Math.min(raw, scoringModel.scale.max))
      : null;
    if (score !== null) {
      weightedSum += score * criterion.weight;
      providedWeight += criterion.weight;
    }
    return {
      key: criterion.key,
      weight: criterion.weight,
      score
    };
  });

  const provided = criteria.filter((c) => c.score !== null).length;
  const total = criteria.length;
  const coverage = total ? provided / total : 0;
  if (providedWeight === 0) {
    return {
      scale: scoringModel.scale,
      coverage: {
        provided,
        total,
        ratio: Number(coverage.toFixed(4))
      },
      weighted_score_5: null,
      weighted_score_100: null,
      band: 'insufficient-data',
      criteria
    };
  }

  const normalizedScore5 = weightedSum / providedWeight;
  const score100 = (normalizedScore5 / scoringModel.scale.max) * 100;
  const rounded5 = Number(normalizedScore5.toFixed(3));
  const rounded100 = Number(score100.toFixed(1));
  const band = rounded100 >= 80 ? 'high' : rounded100 >= 60 ? 'medium' : 'low';

  return {
    scale: scoringModel.scale,
    coverage: {
      provided,
      total,
      ratio: Number(coverage.toFixed(4))
    },
    weighted_score_5: rounded5,
    weighted_score_100: rounded100,
    band,
    criteria
  };
}

function shouldIncludeWorkflowDiagram(maxCycles, diagramPolicy) {
  const policy = String(diagramPolicy || 'auto').toLowerCase();
  if (!['auto', 'always', 'never'].includes(policy)) {
    throw new Error("diagram policy must be 'auto', 'always', or 'never'");
  }
  if (policy === 'always') return true;
  if (policy === 'never') return false;
  return maxCycles > 3;
}

function applyGovernancePolicy(baseControl, mode, riskFlags, scoreSummary, policyName) {
  const policy = getGovernancePolicy(policyName);
  const risks = Array.isArray(riskFlags) ? riskFlags : [];

  if (policy.hitl_on_any_risk_flag && risks.length > 0) {
    return {
      recommended_mode: 'HITL',
      reason: `Policy '${policy.name}' requires HITL when any risk flag exists.`,
      policy_applied: policy
    };
  }

  const score = scoreSummary && typeof scoreSummary.weighted_score_100 === 'number'
    ? scoreSummary.weighted_score_100
    : null;
  const coverage = scoreSummary && scoreSummary.coverage && typeof scoreSummary.coverage.ratio === 'number'
    ? scoreSummary.coverage.ratio
    : 0;

  if (policy.hitl_on_low_score && mode === 'verify') {
    if (score !== null && score < policy.min_weighted_score_100_for_hotl) {
      return {
        recommended_mode: 'HITL',
        reason: `Policy '${policy.name}' requires HITL when weighted score is below ${policy.min_weighted_score_100_for_hotl}.`,
        policy_applied: policy
      };
    }
    if (coverage < policy.min_coverage_ratio_for_hotl) {
      return {
        recommended_mode: 'HITL',
        reason: `Policy '${policy.name}' requires HITL when score coverage is below ${policy.min_coverage_ratio_for_hotl}.`,
        policy_applied: policy
      };
    }
  }

  return {
    ...baseControl,
    policy_applied: policy
  };
}

function buildAssessmentResult({ mode, verdict, judgement, actions, needsHumanReview, riskFlags, scores, policy }) {
  assertMode(mode);
  const normalizedVerdict = verdict || 'accepted-with-conditions';
  const normalizedJudgement = judgement || null;
  const normalizedActions = actions || null;
  const normalizedNeedsHumanReview = parseBoolean(needsHumanReview);
  const normalizedRiskFlags = Array.isArray(riskFlags) ? riskFlags : parseRiskFlags(riskFlags);
  const baseControl = getHumanControlRecommendation(
    mode,
    normalizedVerdict,
    normalizedNeedsHumanReview,
    normalizedRiskFlags
  );
  const scoreSummary = computeScoreSummary(mode, scores);
  const control = applyGovernancePolicy(
    baseControl,
    mode,
    normalizedRiskFlags,
    scoreSummary,
    policy
  );

  return {
    mode,
    verdict: normalizedVerdict,
    judgement: normalizedJudgement,
    actions: normalizedActions,
    risk_flags: normalizedRiskFlags,
    score_summary: scoreSummary,
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
    `- weighted_score_100: ${result.score_summary.weighted_score_100 === null ? 'n/a' : result.score_summary.weighted_score_100}`,
    `- score_band: ${result.score_summary.band}`,
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

function buildCriticPrompt(mode, decision, proposalText, context, topology) {
  const framework = getAssessmentFramework(mode);
  const topologyConfig = getTopologyConfig(topology, 2);
  const preface = mode === 'verify'
    ? 'You are the Critic in PCA verification.'
    : 'You are the Critic in PCA discuss mode.';
  const topologyInstruction = topologyConfig.synthesis_required
    ? `Topology: ${topologyConfig.name}. Produce critic notes designed for synthesis across ${topologyConfig.critic_agents} critic agents.`
    : `Topology: ${topologyConfig.name}. Provide a single critic pass.`;
  return [
    preface,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    topologyInstruction,
    frameworkToPromptBlock(framework),
    'Return strongest objections, missing evidence, and safer alternatives.'
  ].join('\n');
}

function buildAssessPrompt(mode, decision, proposalText, criticText, context, topology) {
  const framework = getAssessmentFramework(mode);
  const topologyConfig = getTopologyConfig(topology, 2);
  return [
    `You are the Assessor in PCA ${mode} mode.`,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    `Critic: ${criticText || '(to be supplied)'}`,
    `Topology: ${topologyConfig.name}. Synthesize across ${topologyConfig.critic_agents} critic channel(s).`,
    frameworkToPromptBlock(framework),
    'Output: verdict, judgement, actions, risk_flags, needs_human_review.'
  ].join('\n');
}

function buildSession({ mode, decision, context, maxCycles = 2, diagramPolicy = 'auto', topology = 'single-critic', policy = 'balanced' }) {
  assertMode(mode);
  const cycles = Math.max(1, Math.min(Number(maxCycles) || 2, 5));
  const framework = getAssessmentFramework(mode);
  const includeDiagram = shouldIncludeWorkflowDiagram(cycles, diagramPolicy);
  const topologyConfig = getTopologyConfig(topology, cycles);
  const governancePolicy = getGovernancePolicy(policy);
  return {
    mode,
    decision: decision || null,
    context: context || null,
    max_cycles: cycles,
    workflow: {
      diagram_policy: String(diagramPolicy || 'auto').toLowerCase(),
      diagram_recommended: cycles > 3,
      diagram_included: includeDiagram,
      diagram_mermaid: includeDiagram ? WORKFLOW_DIAGRAM : null
    },
    orchestration: topologyConfig,
    governance_policy: governancePolicy,
    framework,
    prompts: {
      proposal: buildProposalPrompt(mode, decision, context),
      critic: buildCriticPrompt(mode, decision, null, context, topologyConfig.name),
      assess: buildAssessPrompt(mode, decision, null, null, context, topologyConfig.name)
    }
  };
}

module.exports = {
  parseBoolean,
  normalizeRole,
  summarizeForChat,
  parseRiskFlags,
  parseScores,
  normalizePolicy,
  getGovernancePolicy,
  normalizeTopology,
  getTopologyConfig,
  getAssessmentFramework,
  getScoringModel,
  computeScoreSummary,
  shouldIncludeWorkflowDiagram,
  applyGovernancePolicy,
  getHumanControlRecommendation,
  buildAssessmentResult,
  formatAssessmentMarkdown,
  buildProposalPrompt,
  buildCriticPrompt,
  buildAssessPrompt,
  buildSession
};
