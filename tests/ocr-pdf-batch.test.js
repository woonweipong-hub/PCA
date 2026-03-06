const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  parseArgs,
  listPdfFiles,
  ocrBatch
} = require('../scripts/ocr-pdf-batch.cjs');

test('ocr parseArgs defaults are generic', () => {
  const parsed = parseArgs(['node', 'ocr-pdf-batch.cjs']);
  assert.strictEqual(parsed.inputDir, '.');
  assert.strictEqual(parsed.outputDir, 'data/pdf-ocr');
  assert.strictEqual(parsed.recursive, true);
  assert.strictEqual(parsed.language, 'eng');
  assert.strictEqual(parsed.skipText, true);
  assert.strictEqual(parsed.forceOcr, false);
});

test('ocr listPdfFiles respects recursive option', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-ocr-list-'));
  const nested = path.join(tmp, 'nested');
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'a.pdf'), 'x', 'utf8');
  fs.writeFileSync(path.join(nested, 'b.pdf'), 'x', 'utf8');

  assert.strictEqual(listPdfFiles(tmp, true).length, 2);
  assert.strictEqual(listPdfFiles(tmp, false).length, 1);
});

test('ocrBatch preserves relative paths and reports results', () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-ocr-in-'));
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-ocr-out-'));
  const nested = path.join(input, 'nested');
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(input, 'a.pdf'), 'x', 'utf8');
  fs.writeFileSync(path.join(nested, 'b.pdf'), 'x', 'utf8');

  const fakeRunner = (_bin, src, dst) => {
    fs.copyFileSync(src, dst);
  };

  const result = ocrBatch({
    inputDir: input,
    outputDir: output,
    recursive: true,
    language: 'eng',
    skipText: true,
    forceOcr: false,
    ocrmypdfPath: 'fake-ocrmypdf'
  }, fakeRunner);

  assert.strictEqual(result.discovered_pdfs, 2);
  assert.strictEqual(result.processed, 2);
  assert.strictEqual(result.failed, 0);
  assert.ok(fs.existsSync(path.join(output, 'a.pdf')));
  assert.ok(fs.existsSync(path.join(output, 'nested', 'b.pdf')));
});

test('ocrBatch returns failures when runner throws', () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-ocr-fail-in-'));
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-ocr-fail-out-'));
  fs.writeFileSync(path.join(input, 'a.pdf'), 'x', 'utf8');

  const result = ocrBatch({
    inputDir: input,
    outputDir: output,
    recursive: true,
    language: 'eng',
    skipText: true,
    forceOcr: false,
    ocrmypdfPath: 'fake-ocrmypdf'
  }, () => {
    throw new Error('mock ocr failure');
  });

  assert.strictEqual(result.discovered_pdfs, 1);
  assert.strictEqual(result.processed, 0);
  assert.strictEqual(result.failed, 1);
  assert.ok(result.errors[0].includes('mock ocr failure'));
});
