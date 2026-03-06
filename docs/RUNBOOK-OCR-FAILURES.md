# Runbook: OCR Failures

## Purpose

Recover safely when scanned/image-only PDFs fail extraction quality.

## Symptoms

- Very low `total_claims` after conversion.
- `quality-check` fails on claim thresholds.
- Conversion/OCR command returns non-zero.

## Recovery Procedure

1. Run OCR preprocessing.

```bash
npm run ocr:pdf -- --input-dir "C:\\path\\to\\public-pdfs" --output-dir "data/public-pdf-ocr" --recursive true --language eng
```

2. Convert OCR output PDFs to text.

```bash
npm run convert:pdf -- --input-dir "data/public-pdf-ocr" --output-dir "data/public-pdf-text" --recursive true
```

3. Re-run quality gate.

```bash
node bin/pca.js quality-check --sources "data/public-pdf-text" --min-sources 2 --min-total-claims 6 --min-avg-claims-per-doc 2
```

4. If still failing, perform manual intervention:
- add analyst summary notes in `.md` for charts/images
- export critical tables to `.csv`
- rerun quality gate

## Frequent Causes

- `ocrmypdf` not installed or not in PATH
- wrong OCR language code
- image quality too poor for OCR

## Mitigation

- Use `--ocrmypdf-path` or set `OCRMYPDF_PATH`.
- Tune `--language`.
- Keep evidence trail of manual supplements (`.md`, `.csv`).
