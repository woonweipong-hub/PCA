const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function runCli(args) {
  return spawnSync(process.execPath, ['bin/pca.js', ...args], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8'
  });
}

test('assess returns a valid assessment payload', () => {
  const result = runCli([
    'assess',
    'verify',
    '--verdict',
    'needs-human-review',
    '--risk-flags',
    'uncertain evidence'
  ]);

  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.mode, 'verify');
  assert.strictEqual(output.verdict, 'needs-human-review');
  assert.strictEqual(output.human_control.recommended_mode, 'HITL');
  assert.ok(Object.prototype.hasOwnProperty.call(output, 'score_summary'));
});

test('prepare auto-includes workflow diagram when max cycles exceed 3', () => {
  const result = runCli(['prepare', 'discuss', '--max-cycles', '4']);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.workflow.diagram_recommended, true);
  assert.strictEqual(output.workflow.diagram_included, true);
});

test('prepare allows opting out of diagram when cycles exceed 3', () => {
  const result = runCli(['prepare', 'discuss', '--max-cycles', '4', '--diagram-policy', 'never']);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.workflow.diagram_included, false);
  assert.strictEqual(output.workflow.diagram_mermaid, null);
});

test('prepare supports topology and governance policy options', () => {
  const result = runCli([
    'prepare',
    'verify',
    '--topology',
    'multi-critic',
    '--policy',
    'strict',
    '--max-cycles',
    '4'
  ]);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.orchestration.name, 'multi-critic');
  assert.strictEqual(output.governance_policy.name, 'strict');
});

test('propose command returns proposer payload', () => {
  const result = runCli([
    'propose',
    'discuss',
    '--decision',
    'launch topic',
    '--context',
    'q4'
  ]);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.role, 'proposer');
  assert.ok(output.prompt.includes('Proposer'));
});

test('critique command returns critic payload', () => {
  const result = runCli([
    'critique',
    'discuss',
    '--decision',
    'launch topic',
    '--proposal',
    'pilot in two regions',
    '--critique',
    'Risk exists due to uncertain evidence.'
  ]);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.role, 'critic');
  assert.ok(Array.isArray(output.extracted_risk_flags));
});

test('assess accepts criterion scores and returns score summary', () => {
  const result = runCli([
    'assess',
    'verify',
    '--scores',
    'evidence_quality=4;user_impact=3;completeness=5'
  ]);

  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.score_summary.weighted_score_100 !== null, true);
  assert.ok(['high', 'medium', 'low'].includes(output.score_summary.band));
});

test('strict policy can escalate assess result to HITL', () => {
  const result = runCli([
    'assess',
    'verify',
    '--verdict',
    'accepted',
    '--scores',
    'evidence_quality=2;release_safety=2',
    '--policy',
    'strict'
  ]);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.human_control.recommended_mode, 'HITL');
});

test('persist writes markdown output', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-cli-'));
  const outputPath = path.join(tmpDir, 'assessment.md');

  const result = runCli([
    'persist',
    'verify',
    '--verdict',
    'accepted-with-conditions',
    '--risk-flags',
    'partial coverage',
    '--output',
    outputPath,
    '--format',
    'md'
  ]);

  assert.strictEqual(result.status, 0, result.stderr);
  const receipt = JSON.parse(result.stdout);
  assert.strictEqual(receipt.persisted, true);
  assert.strictEqual(receipt.output_path, outputPath);

  const saved = fs.readFileSync(outputPath, 'utf8');
  assert.ok(saved.includes('# PCA Assessment'));
  assert.ok(saved.includes('accepted-with-conditions'));
});

test('persist requires output path', () => {
  const result = runCli(['persist', 'discuss']);
  assert.notStrictEqual(result.status, 0);
  assert.ok(result.stderr.includes('persist requires --output <path>'));
});

test('help command prints command reference', () => {
  const result = runCli(['help']);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('PCA CLI'));
  assert.ok(result.stdout.includes('prepare'));
  assert.ok(result.stdout.includes('persist'));
});

test('--help flag prints command reference', () => {
  const result = runCli(['--help']);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('Usage:'));
  assert.ok(result.stdout.includes('Examples:'));
});

test('invalid policy returns readable error', () => {
  const result = runCli(['prepare', 'discuss', '--policy', 'extreme']);
  assert.notStrictEqual(result.status, 0);
  assert.ok(result.stderr.includes("policy must be 'fast', 'balanced', or 'strict'"));
});

test('ingest command summarizes local source files', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-cli-ingest-'));
  const sourceA = path.join(tmpDir, 'source-a.md');
  const sourceB = path.join(tmpDir, 'source-b.md');
  fs.writeFileSync(sourceA, 'Customer retention improved and defects decreased in Q4. The process became more stable.', 'utf8');
  fs.writeFileSync(sourceB, 'Q4 showed improved retention and fewer defects. Team process quality improved.', 'utf8');

  const result = runCli(['ingest', '--sources', `${sourceA},${sourceB}`]);
  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.source_count, 2);
  assert.strictEqual(output.total_claims > 0, true);
});

test('evidence-check command returns evidence metrics with assessment', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-cli-evidence-'));
  const sourceA = path.join(tmpDir, 'source-a.md');
  const sourceB = path.join(tmpDir, 'source-b.md');
  fs.writeFileSync(sourceA, 'This release is safe and does not require rollback. Evidence quality is high.', 'utf8');
  fs.writeFileSync(sourceB, 'This release is not safe and requires rollback. Evidence quality is uncertain.', 'utf8');

  const result = runCli([
    'evidence-check',
    'verify',
    '--decision',
    'release gate',
    '--sources',
    `${sourceA},${sourceB}`,
    '--policy',
    'strict'
  ]);

  assert.strictEqual(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.strictEqual(output.mode, 'verify');
  assert.ok(Object.prototype.hasOwnProperty.call(output, 'evidence'));
  assert.ok(Object.prototype.hasOwnProperty.call(output, 'assessment'));
});
