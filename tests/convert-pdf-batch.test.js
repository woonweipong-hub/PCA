const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  parseArgs,
  listPdfFiles,
  shouldIncludeFile,
  convertBatch
} = require('../scripts/convert-pdf-batch.cjs');

test('parseArgs defaults to generic non-TRHS values', () => {
  const parsed = parseArgs(['node', 'convert-pdf-batch.cjs']);
  assert.strictEqual(parsed.inputDir, '.');
  assert.strictEqual(parsed.outputDir, 'data/pdf-text');
  assert.deepStrictEqual(parsed.includePrefixes, []);
  assert.deepStrictEqual(parsed.excludeFiles, []);
  assert.strictEqual(parsed.recursive, true);
});

test('listPdfFiles scans recursively when enabled', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-pdf-list-'));
  const nested = path.join(tmp, 'nested');
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'a.pdf'), 'x', 'utf8');
  fs.writeFileSync(path.join(nested, 'b.pdf'), 'x', 'utf8');
  fs.writeFileSync(path.join(nested, 'c.txt'), 'x', 'utf8');

  const recursive = listPdfFiles(tmp, true);
  const nonRecursive = listPdfFiles(tmp, false);

  assert.strictEqual(recursive.length, 2);
  assert.strictEqual(nonRecursive.length, 1);
});

test('shouldIncludeFile supports optional prefix filter and exclusion', () => {
  assert.strictEqual(shouldIncludeFile('doc.pdf', [], []), true);
  assert.strictEqual(shouldIncludeFile('BCA_doc.pdf', ['BCA'], []), true);
  assert.strictEqual(shouldIncludeFile('URA_doc.pdf', ['BCA'], []), false);
  assert.strictEqual(shouldIncludeFile('BCA_doc.pdf', ['BCA'], ['BCA_doc.pdf']), false);
});

test('convertBatch preserves relative paths and reports counts', () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-pdf-in-'));
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-pdf-out-'));
  const nested = path.join(input, 'agency', 'set1');
  fs.mkdirSync(nested, { recursive: true });

  const keepA = path.join(input, 'A.pdf');
  const keepB = path.join(nested, 'B.pdf');
  const skip = path.join(input, 'skip.pdf');
  fs.writeFileSync(keepA, 'alpha', 'utf8');
  fs.writeFileSync(keepB, 'bravo', 'utf8');
  fs.writeFileSync(skip, 'skip', 'utf8');

  const calls = [];
  const fakeConverter = (_bin, src, dst) => {
    calls.push([src, dst]);
    fs.writeFileSync(dst, `converted:${path.basename(src)}`, 'utf8');
  };

  const result = convertBatch({
    inputDir: input,
    outputDir: output,
    includePrefixes: [],
    excludeFiles: ['skip.pdf'],
    recursive: true,
    pdftotextPath: 'fake-pdftotext'
  }, fakeConverter);

  assert.strictEqual(result.discovered_pdfs, 3);
  assert.strictEqual(result.selected_pdfs, 2);
  assert.strictEqual(result.converted, 2);
  assert.strictEqual(result.failed, 0);
  assert.strictEqual(result.skipped, 1);
  assert.strictEqual(calls.length, 2);

  assert.ok(fs.existsSync(path.join(output, 'A.txt')));
  assert.ok(fs.existsSync(path.join(output, 'agency', 'set1', 'B.txt')));
});

test('convertBatch returns failure details when converter throws', () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-pdf-fail-in-'));
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'pca-pdf-fail-out-'));
  fs.writeFileSync(path.join(input, 'A.pdf'), 'alpha', 'utf8');

  const result = convertBatch({
    inputDir: input,
    outputDir: output,
    includePrefixes: [],
    excludeFiles: [],
    recursive: true,
    pdftotextPath: 'fake-pdftotext'
  }, () => {
    throw new Error('mock conversion failed');
  });

  assert.strictEqual(result.discovered_pdfs, 1);
  assert.strictEqual(result.selected_pdfs, 1);
  assert.strictEqual(result.converted, 0);
  assert.strictEqual(result.failed, 1);
  assert.strictEqual(result.errors.length, 1);
  assert.ok(result.errors[0].includes('mock conversion failed'));
});
