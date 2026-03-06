const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function getSection(md, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`##\\s+${escaped}([\\s\\S]*?)(?=\\n##\\s+|$)`);
  const match = md.match(re);
  return match ? match[1] : '';
}

test('README and USER-GUIDE use conversion-first examples for PDF datasets', () => {
  const readme = read('README.md');
  const guide = read('docs/USER-GUIDE.md');

  assert.ok(readme.includes('npm run convert:pdf -- --input-dir'));
  assert.ok(readme.includes('--sources "data/public-pdf-text"'));
  assert.ok(guide.includes('npm run convert:pdf -- --input-dir'));
  assert.ok(guide.includes('--sources "data/public-pdf-text"'));

  assert.strictEqual(readme.includes('--sources "C:\\2026_Research\\Assets"'), false);
  assert.strictEqual(guide.includes('--sources "C:\\2026_Research\\Assets" --max-files'), false);
});

test('COMMAND-REFERENCE has failure modes and automation guidance for key sections', () => {
  const commandRef = read('docs/COMMAND-REFERENCE.md');

  const propose = getSection(commandRef, '`propose`');
  const critique = getSection(commandRef, '`critique`');
  const evidenceCheck = getSection(commandRef, '`evidence-check`');

  assert.ok(propose.includes('Failure modes:'));
  assert.ok(propose.includes('Automation guidance:'));

  assert.ok(critique.includes('Failure modes:'));
  assert.ok(critique.includes('Automation guidance:'));

  assert.ok(evidenceCheck.includes('Failure modes:'));
  assert.ok(evidenceCheck.includes('Automation guidance:'));
});

test('package scripts expose conversion and OCR entry points', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts['convert:pdf']);
  assert.ok(pkg.scripts['ocr:pdf']);
  assert.ok(pkg.scripts['convert:trhs']);
});

test('README and USER-GUIDE mention quality-check gate', () => {
  const readme = read('README.md');
  const guide = read('docs/USER-GUIDE.md');

  assert.ok(readme.includes('pca quality-check'));
  assert.ok(guide.includes('### `quality-check`'));
});

test('runbook and release checklist docs are linked from README', () => {
  const readme = read('README.md');
  assert.ok(readme.includes('docs/RUNBOOK-PDF-PIPELINE.md'));
  assert.ok(readme.includes('docs/RUNBOOK-OCR-FAILURES.md'));
  assert.ok(readme.includes('docs/RUNBOOK-HITL-ESCALATION.md'));
  assert.ok(readme.includes('docs/RELEASE-CHECKLIST.md'));
});
