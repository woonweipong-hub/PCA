#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const args = argv.slice(2);
  const getArg = (flag) => {
    const i = args.indexOf(flag);
    if (i === -1 || i + 1 >= args.length) return null;
    return args[i + 1];
  };

  const parseBoolean = (value, defaultValue) => {
    if (value === null || value === undefined) return defaultValue;
    const normalized = String(value).trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
    return defaultValue;
  };

  return {
    inputDir: getArg('--input-dir') || '.',
    outputDir: getArg('--output-dir') || 'data/pdf-ocr',
    recursive: parseBoolean(getArg('--recursive'), true),
    language: getArg('--language') || 'eng',
    skipText: parseBoolean(getArg('--skip-text'), true),
    forceOcr: parseBoolean(getArg('--force-ocr'), false),
    ocrmypdfPath: getArg('--ocrmypdf-path') || process.env.OCRMYPDF_PATH || 'ocrmypdf',
    help: args.includes('--help') || args.includes('-h')
  };
}

function printHelp() {
  process.stdout.write([
    'Batch OCR Preprocessor for PCA',
    '',
    'Usage:',
    '  node scripts/ocr-pdf-batch.cjs [flags]',
    '',
    'Flags:',
    '  --input-dir <path>          Source folder containing PDFs',
    '  --output-dir <path>         Output folder for OCR-enhanced PDFs',
    '  --recursive <true|false>    Recursively process subfolders (default true)',
    '  --language <lang>           OCR language code (default eng)',
    '  --skip-text <true|false>    Keep text PDFs unchanged and OCR image PDFs (default true)',
    '  --force-ocr <true|false>    Force OCR on all PDFs (default false)',
    '  --ocrmypdf-path <path>      Path to ocrmypdf executable',
    '',
    'Examples:',
    '  npm run ocr:pdf -- --input-dir "C:\\PublicUploads\\pdfs" --output-dir "data\\public-pdf-ocr"',
    '  node scripts/ocr-pdf-batch.cjs --input-dir "C:\\2026_Research\\Assets" --output-dir "data\\assets-ocr" --language eng',
    ''
  ].join('\n'));
}

function fail(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listPdfFiles(dirPath, recursive) {
  const results = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (recursive) walk(fullPath);
        return;
      }
      if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.pdf') {
        results.push(fullPath);
      }
    });
  }

  walk(dirPath);
  return results;
}

function runOcr(ocrmypdfPath, inputFile, outputFile, options) {
  const args = ['--output-type', 'pdf', '--language', options.language];
  if (options.forceOcr) {
    args.push('--force-ocr');
  } else if (options.skipText) {
    args.push('--skip-text');
  }
  args.push(inputFile, outputFile);

  const result = spawnSync(ocrmypdfPath, args, { encoding: 'utf8' });

  if (result.error && result.error.code === 'ENOENT') {
    throw new Error(`ocrmypdf executable not found: ${ocrmypdfPath}`);
  }

  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.trim() : 'unknown error';
    throw new Error(`ocrmypdf failed for ${path.basename(inputFile)}: ${stderr}`);
  }
}

function ocrBatch(options, runner = runOcr) {
  const opts = {
    ...options,
    inputDir: path.resolve(options.inputDir),
    outputDir: path.resolve(options.outputDir)
  };

  if (!fs.existsSync(opts.inputDir)) {
    throw new Error(`input directory not found: ${opts.inputDir}`);
  }

  ensureDir(opts.outputDir);

  const pdfs = listPdfFiles(opts.inputDir, opts.recursive);
  if (pdfs.length === 0) {
    return {
      input_dir: opts.inputDir,
      output_dir: opts.outputDir,
      discovered_pdfs: 0,
      processed: 0,
      failed: 0,
      note: 'No PDF files found.'
    };
  }

  let processed = 0;
  const errors = [];

  pdfs.forEach((sourcePath) => {
    const relPath = path.relative(opts.inputDir, sourcePath);
    const targetPath = path.join(opts.outputDir, relPath);
    ensureDir(path.dirname(targetPath));
    try {
      runner(opts.ocrmypdfPath, sourcePath, targetPath, opts);
      processed += 1;
    } catch (error) {
      errors.push(String(error.message || error));
    }
  });

  return {
    input_dir: opts.inputDir,
    output_dir: opts.outputDir,
    ocrmypdf_path: opts.ocrmypdfPath,
    recursive: opts.recursive,
    language: opts.language,
    skip_text: opts.skipText,
    force_ocr: opts.forceOcr,
    discovered_pdfs: pdfs.length,
    processed,
    failed: errors.length,
    errors
  };
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printHelp();
    return;
  }

  const result = ocrBatch(opts, runOcr);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (result.failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    const message = error && error.message ? error.message : 'unexpected error';
    if (message.includes('ocrmypdf executable not found')) {
      fail(`${message}. Install OCRmyPDF or provide --ocrmypdf-path.`);
    }
    fail(message);
  }
}

module.exports = {
  parseArgs,
  listPdfFiles,
  ocrBatch
};
