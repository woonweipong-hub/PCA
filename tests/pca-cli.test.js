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
