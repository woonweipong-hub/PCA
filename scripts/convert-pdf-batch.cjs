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

  const parseCsv = (value) => {
    if (!value) return [];
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return {
    inputDir: getArg('--input-dir') || '.',
    outputDir: getArg('--output-dir') || 'data/pdf-text',
    includePrefixes: parseCsv(getArg('--include-prefixes')),
    excludeFiles: parseCsv(getArg('--exclude-files')),
    recursive: parseBoolean(getArg('--recursive'), true),
    pdftotextPath: getArg('--pdftotext-path') || process.env.PDFTOTEXT_PATH || 'pdftotext',
    help: args.includes('--help') || args.includes('-h')
  };
}

function printHelp() {
  process.stdout.write(
    [
      'Batch PDF Converter for PCA',
      '',
      'Usage:',
      '  node scripts/convert-pdf-batch.cjs [flags]',
      '',
      'Flags:',
      '  --input-dir <path>          Source folder containing PDFs',
      '  --output-dir <path>         Output folder for converted .txt files',
      '  --include-prefixes <list>   Optional comma-separated filename prefixes to include',
      '  --exclude-files <list>      Comma-separated filenames to skip',
      '  --recursive <true|false>    Recursively process subfolders (default true)',
      '  --pdftotext-path <path>     Path to pdftotext executable',
      '',
      'Examples:',
      '  npm run convert:pdf -- --input-dir "C:\\\\PublicUploads\\\\pdfs" --output-dir "data\\\\uploads-text"',
      '  node scripts/convert-pdf-batch.cjs --input-dir "C:\\\\2026_Research\\\\Assets" --output-dir "data\\\\trhs-text" --include-prefixes "BCA,URA,SCDF" --exclude-files "BCA_HS_Checks_Scope.pdf"',
      ''
    ].join('\n')
  );
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

function shouldIncludeFile(fileName, includePrefixes, excludeFiles) {
  if (excludeFiles.includes(fileName)) return false;
  if (includePrefixes.length === 0) return true;
  return includePrefixes.some((prefix) => fileName.startsWith(prefix));
}

function runPdftotext(pdftotextPath, inputFile, outputFile) {
  const result = spawnSync(pdftotextPath, ['-layout', '-enc', 'UTF-8', inputFile, outputFile], {
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.trim() : 'unknown error';
    throw new Error(`pdftotext failed for ${path.basename(inputFile)}: ${stderr}`);
  }
}

function convertBatch(options, converter = runPdftotext) {
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
  const selected = pdfs.filter((fullPath) => {
    const fileName = path.basename(fullPath);
    return shouldIncludeFile(fileName, opts.includePrefixes, opts.excludeFiles);
  });

  if (selected.length === 0) {
    return {
      input_dir: opts.inputDir,
      output_dir: opts.outputDir,
      discovered_pdfs: pdfs.length,
      selected_pdfs: 0,
      converted: 0,
      skipped: pdfs.length,
      note: 'No PDFs matched include/exclude filters.'
    };
  }

  let converted = 0;
  const errors = [];

  selected.forEach((sourcePath) => {
    const relPath = path.relative(opts.inputDir, sourcePath);
    const relTxtPath = `${relPath.slice(0, -4)}.txt`;
    const outputPath = path.join(opts.outputDir, relTxtPath);
    ensureDir(path.dirname(outputPath));
    try {
      converter(opts.pdftotextPath, sourcePath, outputPath);
      converted += 1;
    } catch (error) {
      errors.push(String(error.message || error));
    }
  });

  return {
    input_dir: opts.inputDir,
    output_dir: opts.outputDir,
    pdftotext_path: opts.pdftotextPath,
    recursive: opts.recursive,
    discovered_pdfs: pdfs.length,
    selected_pdfs: selected.length,
    converted,
    failed: errors.length,
    skipped: pdfs.length - selected.length,
    excluded_files: opts.excludeFiles,
    include_prefixes: opts.includePrefixes,
    errors
  };
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printHelp();
    return;
  }

  const result = convertBatch(opts, runPdftotext);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (result.errors && result.errors.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    fail(error && error.message ? error.message : 'unexpected error');
  }
}

module.exports = {
  parseArgs,
  listPdfFiles,
  shouldIncludeFile,
  convertBatch
};
