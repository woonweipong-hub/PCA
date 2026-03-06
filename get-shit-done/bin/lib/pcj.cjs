/**
 * PCA — Propose/Critique/Assess helper utilities
 */

const fs = require('fs');
const path = require('path');
const { findPhaseInternal, resolveModelInternal, output, error } = require('./core.cjs');

const DEV_LOG_DIR = 'development';
const LEGACY_DEV_PROCESS_DIR = 'development_process';

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function timestampId() {
  const iso = new Date().toISOString();
  return iso.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function ensureDevelopmentDirs(cwd) {
  fs.mkdirSync(path.join(cwd, DEV_LOG_DIR), { recursive: true });
  fs.mkdirSync(path.join(cwd, LEGACY_DEV_PROCESS_DIR), { recursive: true });
  return {
    primary: DEV_LOG_DIR,
    legacy: LEGACY_DEV_PROCESS_DIR,
  };
}

function ensureGitignoreEntry(cwd, entry) {
  const gitignorePath = path.join(cwd, '.gitignore');
  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
  }

  const lines = content.split(/\r?\n/).map(l => l.trim());
  const hasEntry = lines.includes(entry) || lines.includes(entry.replace(/\/$/, ''));
  if (hasEntry) return { ensured: true, updated: false, path: '.gitignore' };

  const suffix = content.length === 0 || content.endsWith('\n') ? '' : '\n';
  const updated = `${content}${suffix}${entry}\n`;
  fs.writeFileSync(gitignorePath, updated, 'utf-8');
  return { ensured: true, updated: true, path: '.gitignore' };
}

function resolveLogFile(options) {
  if (options.log_file) return options.log_file;
  return `${DEV_LOG_DIR}/PCA_${timestampId()}.txt`;
}

function summarizeForChat(content) {
  const text = String(content || '').replace(/\r\n/g, '\n').trim();
  if (!text) return 'No role output provided.';
  const compact = text.split('\n').map(line => line.trim()).filter(Boolean).join(' ');
  return compact.length > 320 ? `${compact.slice(0, 317)}...` : compact;
}

function parseRiskFlags(value) {
  if (!value) return [];
  return String(value)
    .split(/[;,\n]/)
    .map(v => v.trim())
    .filter(Boolean);
}

function getHumanControlRecommendation(mode, verdict, needsHumanReview, riskFlags) {
  if (needsHumanReview || verdict === 'needs-human-review') {
    return {
      recommended_mode: 'HITL',
      reason: 'High uncertainty or unresolved risk requires explicit human decision.',
    };
  }

  if (mode === 'verify' && (verdict === 'accepted-with-conditions' || riskFlags.length > 0)) {
    return {
      recommended_mode: 'HOTL',
      reason: 'Proceed with human oversight while conditions/risks are monitored.',
    };
  }

  return {
    recommended_mode: 'HOTL',
    reason: 'No critical blockers detected; lightweight oversight is sufficient.',
  };
}

function appendLogBlock(cwd, relPath, title, lines) {
  const fullPath = path.join(cwd, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : '';
  const suffix = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
  const body = [
    `${title}`,
    ...lines,
    '',
  ].join('\n');
  fs.writeFileSync(fullPath, `${existing}${suffix}${body}`, 'utf-8');
}

function getAssessmentFramework(mode) {
  const universalCriteria = [
    { key: 'completeness', weight: 0.20, question: 'Does it cover key aspects with no critical gaps?' },
    { key: 'practicality', weight: 0.20, question: 'Can typical teams use this effectively in real conditions?' },
    { key: 'correctness_soundness', weight: 0.20, question: 'Is it logically consistent with known facts/rules?' },
    { key: 'feasibility', weight: 0.20, question: 'Is it achievable with realistic time/resources/skills?' },
    { key: 'governance_safety', weight: 0.20, question: 'Does it manage risk, constraints, and safety obligations?' },
  ];

  if (mode === 'verify') {
    return {
      name: 'verification-risk-framework',
      purpose: 'Evaluate observed outcomes, evidence quality, and release risk.',
      universal_criteria: universalCriteria,
      criteria: [
        { key: 'evidence_quality', weight: 0.35, question: 'Is evidence concrete, reproducible, and sufficient?' },
        { key: 'user_impact', weight: 0.30, question: 'How severe is real user impact if issue exists?' },
        { key: 'scope_of_failure', weight: 0.20, question: 'Is failure localized or systemic across critical paths?' },
        { key: 'release_safety', weight: 0.15, question: 'Is shipping safe without further human review?' },
      ],
      decision_policy: [
        'If evidence_quality < 3, default to accepted-with-conditions or needs-human-review.',
        'If release_safety <= 2 or blocker uncertainty remains, set verdict to needs-human-review.',
        'Only use accepted when evidence is strong and residual risk is low.',
      ],
      output_fields: ['verdict', 'judgement', 'actions', 'needs_human_review', 'risk_flags'],
    };
  }

  return {
    name: 'discussion-decision-framework',
    purpose: 'Select the best implementation framing for planning.',
    universal_criteria: universalCriteria,
    criteria: [
      { key: 'scope_alignment', weight: 0.35, question: 'Does option stay inside current phase boundary?' },
      { key: 'strategy_clarity', weight: 0.30, question: 'Is direction clear enough for planning tasks?' },
      { key: 'assumption_quality', weight: 0.20, question: 'Are assumptions explicit, testable, and realistic?' },
      { key: 'execution_readiness', weight: 0.15, question: 'Can planner execute without re-asking user?' },
    ],
    decision_policy: [
      'Reject options that introduce net-new capability outside roadmap phase.',
      'Prefer strategies with explicit assumptions and low ambiguity for planner handoff.',
      'Use accepted-with-conditions when assumptions are reasonable but need explicit guardrails.',
    ],
    output_fields: ['verdict', 'judgement', 'actions', 'planning_guardrails'],
  };
}

function frameworkToPromptBlock(framework) {
  const universal = framework.universal_criteria
    .map(c => `- ${c.key} (weight ${c.weight}): ${c.question}`)
    .join('\n');
  const criteria = framework.criteria
    .map(c => `- ${c.key} (weight ${c.weight}): ${c.question}`)
    .join('\n');
  const policy = framework.decision_policy.map(p => `- ${p}`).join('\n');
  return [
    `Assessment framework: ${framework.name}`,
    `Purpose: ${framework.purpose}`,
    'Universal criteria (always apply):',
    universal,
    'Mode-specific criteria:',
    'Criteria:',
    criteria,
    'Decision policy:',
    policy,
  ].join('\n');
}

function buildProposalPrompt(mode, decision, context) {
  const framework = getAssessmentFramework(mode);
  const base = mode === 'verify'
    ? 'You are the Proposer role in a PCA loop for verification. Propose the strongest plausible interpretation of the current results.'
    : 'You are the Proposer role in a PCA loop for discuss-phase framing. Propose a concrete recommendation.';

  return [
    base,
    'Focus on clear tradeoffs, assumptions, and implementation implications.',
    `Decision focus: ${decision || 'unspecified'}`,
    context ? `Context: ${context}` : 'Context: (none provided)',
    frameworkToPromptBlock(framework),
    'Return concise bullets with: recommendation, assumptions, risks, and next actions.',
    'Include quick criterion-level confidence notes (1-5) against this framework.',
  ].join('\n');
}

function buildCriticPrompt(mode, decision, proposalText, context) {
  const framework = getAssessmentFramework(mode);
  const base = mode === 'verify'
    ? 'You are the Critic role in a PCA verification loop. Stress-test the proposal against evidence quality and risk.'
    : 'You are the Critic role in a PCA discuss loop. Challenge assumptions and identify blind spots.';

  return [
    base,
    `Decision focus: ${decision || 'unspecified'}`,
    context ? `Context: ${context}` : 'Context: (none provided)',
    proposalText ? `Proposal draft:\n${proposalText}` : 'Proposal draft: (to be supplied)',
    frameworkToPromptBlock(framework),
    'Return concise bullets: strongest objections, missing evidence, failure modes, safer alternatives.',
    'Call out weakest criteria and explain why.',
  ].join('\n');
}

function buildJudgePrompt(mode, decision, proposalText, criticText, context) {
  const framework = getAssessmentFramework(mode);
  const outcomeLine = mode === 'verify'
    ? 'Decide if this is accepted, accepted-with-conditions, or needs-human-review.'
    : 'Decide a final direction for the team to use in planning.';

  return [
    `You are the Assessor role in a PCA ${mode} loop.`,
    outcomeLine,
    `Decision focus: ${decision || 'unspecified'}`,
    context ? `Context: ${context}` : 'Context: (none provided)',
    proposalText ? `Proposal:\n${proposalText}` : 'Proposal: (to be supplied)',
    criticText ? `Critic:\n${criticText}` : 'Critic: (to be supplied)',
    frameworkToPromptBlock(framework),
    'Output strict format:',
    '- verdict: <accepted|accepted-with-conditions|needs-human-review>',
    '- criteria_scores: <object with 1-5 score per criterion key>',
    '- judgement: <1-3 concise sentences>',
    '- actions: <3-5 concrete next actions>',
    mode === 'verify'
      ? '- needs_human_review: <true|false>'
      : '- planning_guardrails: <2-4 bullets that planner must respect>',
    mode === 'verify'
      ? '- risk_flags: <list of unresolved risks or empty list>'
      : '- risk_flags: <list of unresolved ambiguity or empty list>',
  ].join('\n');
}

function cmdPcjPrepare(cwd, mode, options, raw) {
  if (!mode || !['discuss', 'verify'].includes(mode)) {
    error('pca/pcj prepare requires mode: discuss|verify');
  }

  const dirs = ensureDevelopmentDirs(cwd);
  const gitignorePrimary = ensureGitignoreEntry(cwd, `${DEV_LOG_DIR}/`);
  const gitignoreLegacy = ensureGitignoreEntry(cwd, `${LEGACY_DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const decision = options.decision || null;
  const context = options.context || null;
  const task = options.task || decision || 'unspecified task';
  const logFile = resolveLogFile(options);
  const framework = getAssessmentFramework(mode);

  appendLogBlock(cwd, logFile, '# PCA Session', [
    `timestamp: ${new Date().toISOString()}`,
    `mode: ${mode}`,
    `phase: ${phase || '?'}`,
    `task: ${task}`,
    `decision: ${decision || 'unspecified'}`,
    `framework: ${framework.name}`,
    `context: ${context || '(none provided)'}`,
    'notes: internal development log only; do not commit/share',
  ]);

  const result = {
    mode,
    phase,
    task,
    decision,
    framework,
    storage: {
      development_dir: dirs.primary,
      development_process_dir_legacy: dirs.legacy,
      log_file: logFile,
      gitignore_entries: [`${DEV_LOG_DIR}/`, `${LEGACY_DEV_PROCESS_DIR}/`],
      gitignore_updated: gitignorePrimary.updated || gitignoreLegacy.updated,
      internal_only: true,
    },
    models: {
      proposal: resolveModelInternal(cwd, 'pca-proposal'),
      critic: resolveModelInternal(cwd, 'pca-critic'),
      judge: resolveModelInternal(cwd, 'pca-assess'),
    },
    prompts: {
      proposal: buildProposalPrompt(mode, decision, context),
      critic: buildCriticPrompt(mode, decision, null, context),
      judge: buildJudgePrompt(mode, decision, null, null, context),
    },
  };

  output(result, raw);
}

function cmdPcjSave(cwd, mode, options, raw) {
  if (!mode || !['discuss', 'verify'].includes(mode)) {
    error('pca/pcj save requires mode: discuss|verify');
  }

  const role = (options.role || '').toLowerCase();
  if (!['proposer', 'critic', 'judge', 'assessor'].includes(role)) {
    error('pca/pcj save requires --role proposer|critic|assessor|judge');
  }

  ensureDevelopmentDirs(cwd);
  const gitignorePrimary = ensureGitignoreEntry(cwd, `${DEV_LOG_DIR}/`);
  const gitignoreLegacy = ensureGitignoreEntry(cwd, `${LEGACY_DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const task = options.task || options.decision || 'unspecified task';
  const decision = options.decision || 'unspecified';
  const content = options.content || '';
  const framework = getAssessmentFramework(mode);
  const logFile = resolveLogFile(options);
  const chatSummary = summarizeForChat(content);

  const normalizedRole = role === 'assessor' ? 'judge' : role;
  appendLogBlock(cwd, logFile, `## ${normalizedRole.toUpperCase()} Output`, [
    `timestamp: ${new Date().toISOString()}`,
    `mode: ${mode}`,
    `phase: ${phase || '?'}`,
    `task: ${task}`,
    `decision: ${decision}`,
    `framework: ${framework.name}`,
    'content:',
    content || '(empty)',
  ]);

  output({
    saved: true,
    mode,
    role: normalizedRole,
    phase,
    task,
    decision,
    framework: framework.name,
    log_file: logFile,
    gitignore_updated: gitignorePrimary.updated || gitignoreLegacy.updated,
    transparency: {
      visible_summary: chatSummary,
      role: normalizedRole,
      internal_reasoning_exposed: false,
    },
  }, raw, logFile);
}

function pickDiscussTarget(cwd) {
  const candidates = [
    '.planning/ACI-STATE.md',
    '.planning/STATE.md',
    '.planning/ACI-PROJECT.md',
    '.planning/PROJECT.md',
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(cwd, candidate))) {
      return candidate;
    }
  }

  return '.planning/STATE.md';
}

function findVerificationDoc(cwd, phase) {
  if (!phase) return null;
  const phaseInfo = findPhaseInternal(cwd, phase);
  if (!phaseInfo?.directory) return null;
  const dir = path.join(cwd, phaseInfo.directory);

  try {
    const files = fs.readdirSync(dir);
    const verificationFile = files.find(f => f.endsWith('-VERIFICATION.md') || f === 'VERIFICATION.md');
    if (verificationFile) {
      return path.posix.join(phaseInfo.directory, verificationFile);
    }
  } catch {}

  return null;
}

function pickVerifyTarget(cwd, phase) {
  return findVerificationDoc(cwd, phase) || pickDiscussTarget(cwd);
}

function ensureParentDir(cwd, relPath) {
  const fullPath = path.join(cwd, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
}

function appendPcjEntry(content, heading, entry) {
  const headingPattern = new RegExp(`(^##\\s+${heading}\\s*$[\\s\\S]*?)(?=^##\\s+|$)`, 'm');
  if (headingPattern.test(content)) {
    return content.replace(headingPattern, (match) => `${match.trimEnd()}\n\n${entry}\n`);
  }

  const suffix = content.endsWith('\n') ? '' : '\n';
  return `${content}${suffix}\n## ${heading}\n\n${entry}\n`;
}

function cmdPcjPersist(cwd, mode, options, raw) {
  if (!mode || !['discuss', 'verify'].includes(mode)) {
    error('pca/pcj persist requires mode: discuss|verify');
  }

  ensureDevelopmentDirs(cwd);
  const gitignorePrimary = ensureGitignoreEntry(cwd, `${DEV_LOG_DIR}/`);
  const gitignoreLegacy = ensureGitignoreEntry(cwd, `${LEGACY_DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const task = options.task || options.decision || 'unspecified task';
  const decision = options.decision || 'unspecified';
  const verdict = options.verdict || 'accepted-with-conditions';
  const judgement = options.judgement || '';
  const actions = options.actions || '';
  const riskFlags = options.risk_flags || '';
  const riskFlagsList = parseRiskFlags(riskFlags);
  const needsHumanReview = parseBoolean(options.needs_human_review);
  const control = getHumanControlRecommendation(mode, verdict, needsHumanReview, riskFlagsList);
  const framework = getAssessmentFramework(mode);
  const logFile = resolveLogFile(options);
  const judgementSummary = summarizeForChat(judgement);

  const targetPath = options.target || (mode === 'verify' ? pickVerifyTarget(cwd, phase) : pickDiscussTarget(cwd));
  ensureParentDir(cwd, targetPath);

  const fullPath = path.join(cwd, targetPath);
  const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : '# Session State\n';
  const timestamp = new Date().toISOString();

  const heading = mode === 'verify' ? 'PCA Verify Assessments' : 'PCA Discuss Decisions';
  const entryLines = [
    `- ${timestamp} | phase: ${phase || '?'} | decision: ${decision}`,
    `  - framework: ${framework.name}`,
    `  - verdict: ${verdict}`,
    `  - judgement: ${judgement || 'n/a'}`,
    `  - actions: ${actions || 'n/a'}`,
  ];

  if (mode === 'verify') {
    entryLines.push(`  - needs_human_review: ${needsHumanReview ? 'true' : 'false'}`);
  }

  const updated = appendPcjEntry(existing, heading, entryLines.join('\n'));
  fs.writeFileSync(fullPath, updated, 'utf-8');

  appendLogBlock(cwd, logFile, '## ASSESS Final', [
    `timestamp: ${timestamp}`,
    `mode: ${mode}`,
    `phase: ${phase || '?'}`,
    `task: ${task}`,
    `decision: ${decision}`,
    `framework: ${framework.name}`,
    `verdict: ${verdict}`,
    `needs_human_review: ${needsHumanReview ? 'true' : 'false'}`,
    `judgement: ${judgement || 'n/a'}`,
    `actions: ${actions || 'n/a'}`,
    `risk_flags: ${riskFlags || '[]'}`,
    `human_control: ${control.recommended_mode}`,
    `human_control_reason: ${control.reason}`,
    'summary_recommendation: Curated assessment written to project/state docs; raw PCA trail remains internal in development/ (legacy compatibility with development_process/).',
  ]);

  output({
    persisted: true,
    mode,
    target_path: targetPath,
    phase,
    decision,
    framework: framework.name,
    log_file: logFile,
    gitignore_updated: gitignorePrimary.updated || gitignoreLegacy.updated,
    verdict,
    needs_human_review: mode === 'verify' ? needsHumanReview : undefined,
    transparency: {
      visible_summary: judgementSummary,
      internal_reasoning_exposed: false,
      human_control: control,
    },
  }, raw, targetPath);
}

module.exports = {
  buildProposalPrompt,
  buildCriticPrompt,
  buildJudgePrompt,
  cmdPcjPrepare,
  cmdPcjSave,
  cmdPcjPersist,
};
