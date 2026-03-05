/**
 * PCJ — Proposal/Critic/Judge helper utilities
 */

const fs = require('fs');
const path = require('path');
const { findPhaseInternal, resolveModelInternal, output, error } = require('./core.cjs');

const DEV_PROCESS_DIR = 'development_process';

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function timestampId() {
  const iso = new Date().toISOString();
  return iso.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function ensureDevelopmentProcessDir(cwd) {
  const fullDir = path.join(cwd, DEV_PROCESS_DIR);
  fs.mkdirSync(fullDir, { recursive: true });
  return DEV_PROCESS_DIR;
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
  return `${DEV_PROCESS_DIR}/PCJ_${timestampId()}.txt`;
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
    ? 'You are the Proposal role in a PCJ loop for verification. Propose the strongest plausible interpretation of the current results.'
    : 'You are the Proposal role in a PCJ loop for discuss-phase framing. Propose a concrete recommendation.';

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
    ? 'You are the Critic role in a PCJ verification loop. Stress-test the proposal against evidence quality and risk.'
    : 'You are the Critic role in a PCJ discuss loop. Challenge assumptions and identify blind spots.';

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
    `You are the Judge role in a PCJ ${mode} loop.`,
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
    error('pcj prepare requires mode: discuss|verify');
  }

  ensureDevelopmentProcessDir(cwd);
  const gitignore = ensureGitignoreEntry(cwd, `${DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const decision = options.decision || null;
  const context = options.context || null;
  const task = options.task || decision || 'unspecified task';
  const logFile = resolveLogFile(options);
  const framework = getAssessmentFramework(mode);

  appendLogBlock(cwd, logFile, '# PCJ Session', [
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
      development_process_dir: DEV_PROCESS_DIR,
      log_file: logFile,
      gitignore_entry: `${DEV_PROCESS_DIR}/`,
      gitignore_updated: gitignore.updated,
      internal_only: true,
    },
    models: {
      proposal: resolveModelInternal(cwd, 'gsd-pcj-proposal'),
      critic: resolveModelInternal(cwd, 'gsd-pcj-critic'),
      judge: resolveModelInternal(cwd, 'gsd-pcj-judge'),
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
    error('pcj save requires mode: discuss|verify');
  }

  const role = (options.role || '').toLowerCase();
  if (!['proposer', 'critic', 'judge'].includes(role)) {
    error('pcj save requires --role proposer|critic|judge');
  }

  ensureDevelopmentProcessDir(cwd);
  const gitignore = ensureGitignoreEntry(cwd, `${DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const task = options.task || options.decision || 'unspecified task';
  const decision = options.decision || 'unspecified';
  const content = options.content || '';
  const framework = getAssessmentFramework(mode);
  const logFile = resolveLogFile(options);

  appendLogBlock(cwd, logFile, `## ${role.toUpperCase()} Output`, [
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
    role,
    phase,
    task,
    decision,
    framework: framework.name,
    log_file: logFile,
    gitignore_updated: gitignore.updated,
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
    error('pcj persist requires mode: discuss|verify');
  }

  ensureDevelopmentProcessDir(cwd);
  const gitignore = ensureGitignoreEntry(cwd, `${DEV_PROCESS_DIR}/`);

  const phase = options.phase || null;
  const task = options.task || options.decision || 'unspecified task';
  const decision = options.decision || 'unspecified';
  const verdict = options.verdict || 'accepted-with-conditions';
  const judgement = options.judgement || '';
  const actions = options.actions || '';
  const riskFlags = options.risk_flags || '';
  const needsHumanReview = parseBoolean(options.needs_human_review);
  const framework = getAssessmentFramework(mode);
  const logFile = resolveLogFile(options);

  const targetPath = options.target || (mode === 'verify' ? pickVerifyTarget(cwd, phase) : pickDiscussTarget(cwd));
  ensureParentDir(cwd, targetPath);

  const fullPath = path.join(cwd, targetPath);
  const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : '# Session State\n';
  const timestamp = new Date().toISOString();

  const heading = mode === 'verify' ? 'PCJ Verify Judgements' : 'PCJ Discuss Decisions';
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

  appendLogBlock(cwd, logFile, '## JUDGE Final', [
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
    'summary_recommendation: Curated judgement written to project/state docs; raw PCJ trail remains internal in development_process/.',
  ]);

  output({
    persisted: true,
    mode,
    target_path: targetPath,
    phase,
    decision,
    framework: framework.name,
    log_file: logFile,
    gitignore_updated: gitignore.updated,
    verdict,
    needs_human_review: mode === 'verify' ? needsHumanReview : undefined,
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
