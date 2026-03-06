/**
 * GSD Tools Tests - pcj.cjs
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { runGsdTools, createTempProject, cleanup } = require('./helpers.cjs');

describe('pcj command', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = createTempProject();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  test('pcj prepare discuss returns role prompts and models', () => {
    const result = runGsdTools('pcj prepare discuss --phase 1 --decision "scope and assumptions"', tmpDir);
    assert.ok(result.success, `Command failed: ${result.error}`);

    const output = JSON.parse(result.output);
    assert.strictEqual(output.mode, 'discuss');
    assert.strictEqual(output.phase, '1');
    assert.ok(output.models.proposal);
    assert.ok(output.models.critic);
    assert.ok(output.models.judge);
    assert.strictEqual(output.framework.name, 'discussion-decision-framework');
    assert.strictEqual(output.storage.development_dir, 'development');
    assert.strictEqual(output.storage.development_process_dir_legacy, 'development_process');
    assert.ok(output.storage.log_file.startsWith('development/PCA_'));
    assert.ok(Array.isArray(output.framework.criteria));
    assert.ok(output.framework.criteria.some(c => c.key === 'scope_alignment'));
    assert.ok(output.prompts.proposal.includes('Proposer role'));
    assert.ok(output.prompts.critic.includes('Critic role'));
    assert.ok(output.prompts.judge.includes('Assessor role'));
  });

  test('pcj prepare verify uses a different assessment framework than discuss', () => {
    const discussResult = runGsdTools('pcj prepare discuss --phase 1 --decision "framing"', tmpDir);
    const verifyResult = runGsdTools('pcj prepare verify --phase 1 --decision "release risk"', tmpDir);
    assert.ok(discussResult.success, `Discuss prepare failed: ${discussResult.error}`);
    assert.ok(verifyResult.success, `Verify prepare failed: ${verifyResult.error}`);

    const discuss = JSON.parse(discussResult.output);
    const verify = JSON.parse(verifyResult.output);
    assert.notStrictEqual(discuss.framework.name, verify.framework.name);
    assert.ok(verify.framework.criteria.some(c => c.key === 'evidence_quality'));
    assert.ok(verify.prompts.judge.includes('criteria_scores'));
  });

  test('pcj persist discuss writes to generic state when no ACI docs exist', () => {
    const result = runGsdTools('pcj persist discuss --phase 2 --decision "strategy" --verdict "accepted" --judgement "Use adapter layer first" --actions "Define adapter contract;Lock invariants"', tmpDir);
    assert.ok(result.success, `Command failed: ${result.error}`);

    const output = JSON.parse(result.output);
    assert.strictEqual(output.persisted, true);
    assert.strictEqual(output.target_path, '.planning/STATE.md');

    const statePath = path.join(tmpDir, '.planning', 'STATE.md');
    const content = fs.readFileSync(statePath, 'utf-8');
    assert.ok(content.includes('## PCA Discuss Decisions'));
    assert.ok(content.includes('framework: discussion-decision-framework'));
    assert.ok(content.includes('decision: strategy'));
    assert.ok(content.includes('verdict: accepted'));
  });

  test('pcj persist verify writes needs_human_review to verification doc when present', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.planning', 'ROADMAP.md'),
      '# Roadmap\n\n### Phase 1: Verify PCJ\n**Goal:** Test\n'
    );

    const phaseDir = path.join(tmpDir, '.planning', 'phases', '01-verify-pcj');
    fs.mkdirSync(phaseDir, { recursive: true });
    fs.writeFileSync(path.join(phaseDir, '01-VERIFICATION.md'), '# Verification\n');

    const result = runGsdTools('pcj persist verify --phase 1 --decision "release risk" --verdict "needs-human-review" --judgement "Conflicting outcomes" --actions "Escalate to maintainer" --needs-human-review true', tmpDir);
    assert.ok(result.success, `Command failed: ${result.error}`);

    const output = JSON.parse(result.output);
    assert.strictEqual(output.persisted, true);
    assert.strictEqual(output.target_path, '.planning/phases/01-verify-pcj/01-VERIFICATION.md');
    assert.strictEqual(output.framework, 'verification-risk-framework');
    assert.strictEqual(output.needs_human_review, true);
    assert.strictEqual(output.transparency.human_control.recommended_mode, 'HITL');

    const content = fs.readFileSync(path.join(phaseDir, '01-VERIFICATION.md'), 'utf-8');
    assert.ok(content.includes('## PCA Verify Assessments'));
    assert.ok(content.includes('framework: verification-risk-framework'));
    assert.ok(content.includes('needs_human_review: true'));
  });

  test('pcj save appends proposer/critic logs to development file', () => {
    const prep = runGsdTools('pcj prepare discuss --phase 1 --task "Draft framework" --decision "scope"', tmpDir);
    assert.ok(prep.success, `Prepare failed: ${prep.error}`);
    const prepOut = JSON.parse(prep.output);
    const logFile = prepOut.storage.log_file;

    const saveP = runGsdTools([
      'pcj', 'save', 'discuss',
      '--role', 'proposer',
      '--phase', '1',
      '--task', 'Draft framework',
      '--decision', 'scope',
      '--content', 'Proposer output body',
      '--log-file', logFile,
    ], tmpDir);
    assert.ok(saveP.success, `Save proposer failed: ${saveP.error}`);

    const saveC = runGsdTools([
      'pcj', 'save', 'discuss',
      '--role', 'critic',
      '--phase', '1',
      '--task', 'Draft framework',
      '--decision', 'scope',
      '--content', 'Critic output body',
      '--log-file', logFile,
    ], tmpDir);
    assert.ok(saveC.success, `Save critic failed: ${saveC.error}`);

    const absLog = path.join(tmpDir, logFile);
    assert.ok(fs.existsSync(absLog), 'PCA log file should exist');
    const content = fs.readFileSync(absLog, 'utf-8');
    assert.ok(content.includes('## PROPOSER Output'));
    assert.ok(content.includes('Proposer output body'));
    assert.ok(content.includes('## CRITIC Output'));
    assert.ok(content.includes('Critic output body'));

    const saveOutput = JSON.parse(saveC.output);
    assert.strictEqual(saveOutput.transparency.internal_reasoning_exposed, false);
    assert.ok(saveOutput.transparency.visible_summary.includes('Critic output body'));
  });

  test('pcj prepare ensures development folders are gitignored', () => {
    const result = runGsdTools('pcj prepare discuss --phase 1 --decision "scope"', tmpDir);
    assert.ok(result.success, `Prepare failed: ${result.error}`);

    const gitignorePath = path.join(tmpDir, '.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    assert.ok(gitignore.includes('development/'));
    assert.ok(gitignore.includes('development_process/'));
  });
});
