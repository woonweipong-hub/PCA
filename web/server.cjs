#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { spawn } = require('child_process');

const HOST = process.env.PCA_UI_HOST || '127.0.0.1';
const PORT = Number(process.env.PCA_UI_PORT || 4173);

const WEB_ROOT = path.resolve(__dirname, 'ui');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.join(PROJECT_ROOT, 'outputs', 'ui');
const DATA_ROOT = path.join(PROJECT_ROOT, 'data');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'outputs');
const EXTRA_ALLOWED_HOSTS = String(process.env.PCA_UI_ALLOWED_HOSTS || '')
  .split(/[;,]/)
  .map((value) => String(value || '').trim().toLowerCase())
  .filter(Boolean);
const EXTRA_ALLOWED_ORIGINS = String(process.env.PCA_UI_ALLOWED_ORIGINS || '')
  .split(/[;,]/)
  .map((value) => String(value || '').trim())
  .filter(Boolean);
const EXTRA_ALLOWED_ROOTS = String(process.env.PCA_UI_ALLOWED_ROOTS || '')
  .split(path.delimiter)
  .map((value) => String(value || '').trim())
  .filter(Boolean)
  .map((value) => (path.isAbsolute(value)
    ? path.normalize(value)
    : path.normalize(path.resolve(PROJECT_ROOT, value))));
const ALLOWED_ROOTS = Array.from(new Set([
  DATA_ROOT,
  OUTPUT_ROOT,
  ARTIFACT_DIR,
  ...EXTRA_ALLOWED_ROOTS
])).filter((value) => {
  try {
    return fs.existsSync(value) && fs.statSync(value).isDirectory();
  } catch (_error) {
    return false;
  }
});
const ALLOWED_HOSTS = Array.from(new Set([
  '127.0.0.1',
  'localhost',
  '::1',
  String(HOST || '').trim().toLowerCase()
    .replace(/^\[(.*)\]$/, '$1'),
  ...EXTRA_ALLOWED_HOSTS
].filter(Boolean)));
const ALLOWED_ORIGINS = Array.from(new Set([
  ...ALLOWED_HOSTS.map((hostValue) => `http://${hostValue.includes(':') ? `[${hostValue}]` : hostValue}:${PORT}`),
  ...EXTRA_ALLOWED_ORIGINS
]));

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

function normalizeForComparison(targetPath) {
  return path.resolve(targetPath).replace(/[\\/]+$/, '').toLowerCase();
}

function isWithinRoot(targetPath, rootPath) {
  const normalizedTarget = normalizeForComparison(targetPath);
  const normalizedRoot = normalizeForComparison(rootPath);
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}${path.sep}`);
}

function isAllowedPath(targetPath) {
  return ALLOWED_ROOTS.some((rootPath) => isWithinRoot(targetPath, rootPath));
}

function ensureAllowedPath(targetPath, label = 'path') {
  if (!isAllowedPath(targetPath)) {
    throw new Error(`${label} is outside allowed roots`);
  }
  return targetPath;
}

function ensureAllowedExistingDirectory(targetPath, label = 'directory') {
  const normalized = ensureAllowedPath(path.normalize(targetPath), label);
  if (!fs.existsSync(normalized) || !fs.statSync(normalized).isDirectory()) {
    throw new Error(`${label} does not exist or is not a directory`);
  }
  return normalized;
}

function ensureAllowedExistingFileOrDirectory(targetPath, label = 'path') {
  const normalized = ensureAllowedPath(path.normalize(targetPath), label);
  if (!fs.existsSync(normalized)) {
    throw new Error(`${label} does not exist`);
  }
  return normalized;
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseRequestHostname(req) {
  const rawHost = String(req.headers.host || '').trim();
  if (!rawHost) return '';
  try {
    return new URL(`http://${rawHost}`).hostname.toLowerCase().replace(/^\[(.*)\]$/, '$1');
  } catch (_error) {
    return '';
  }
}

function assertAllowedHostHeader(req) {
  const hostname = parseRequestHostname(req);
  if (!hostname || !ALLOWED_HOSTS.includes(hostname)) {
    throw createHttpError(403, 'host header is not allowed');
  }
}

function assertAllowedOrigin(req) {
  const origin = String(req.headers.origin || '').trim();
  if (!origin) return;
  if (!ALLOWED_ORIGINS.includes(origin)) {
    throw createHttpError(403, 'origin is not allowed');
  }
}

function assertJsonPost(req) {
  if (req.method !== 'POST') return;
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    throw createHttpError(415, 'content-type must be application/json');
  }
}

function resolveDirectoryInput(targetPath, fallbackPath, label) {
  const candidate = String(targetPath || '').trim();
  const resolved = candidate
    ? (path.isAbsolute(candidate)
      ? path.normalize(candidate)
      : path.normalize(path.resolve(PROJECT_ROOT, candidate)))
    : path.normalize(path.resolve(PROJECT_ROOT, fallbackPath));
  return ensureAllowedExistingDirectory(resolved, label);
}

function normalizeAllowedSourceInput(value) {
  if (value === undefined || value === null || String(value).trim() === '') return '';
  return parseSourceList(value)
    .map((entry) => toUiPath(resolveSourcePath(entry)))
    .join(',');
}

function normalizeSafeHttpUrl(value, label) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (_error) {
    throw createHttpError(400, `${label} must be a valid http or https URL`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createHttpError(400, `${label} must use http or https`);
  }
  if (parsed.username || parsed.password) {
    throw createHttpError(400, `${label} must not include embedded credentials`);
  }
  return parsed.toString().replace(/\/$/, '');
}

function sanitizeRequestBody(body) {
  const sanitized = body && typeof body === 'object' ? { ...body } : {};
  if (Object.prototype.hasOwnProperty.call(sanitized, 'sources')) {
    sanitized.sources = normalizeAllowedSourceInput(sanitized.sources);
  }
  if (Object.prototype.hasOwnProperty.call(sanitized, 'inputDir')) {
    sanitized.inputDir = toUiPath(resolveDirectoryInput(sanitized.inputDir, 'data', 'input directory'));
  }
  if (Object.prototype.hasOwnProperty.call(sanitized, 'textDir')) {
    sanitized.textDir = toUiPath(resolveDirectoryInput(sanitized.textDir, 'data/public-pdf-text', 'text directory'));
  }
  if (Object.prototype.hasOwnProperty.call(sanitized, 'ocrDir')) {
    sanitized.ocrDir = toUiPath(resolveDirectoryInput(sanitized.ocrDir, 'data/public-pdf-ocr', 'OCR directory'));
  }
  if (Object.prototype.hasOwnProperty.call(sanitized, 'outputDir')) {
    const outputFallback = sanitized.ocrDir || 'data/public-pdf-text';
    sanitized.outputDir = toUiPath(resolveDirectoryInput(sanitized.outputDir, outputFallback, 'output directory'));
  }
  if (Object.prototype.hasOwnProperty.call(sanitized, 'byomEndpoint')) {
    sanitized.byomEndpoint = normalizeSafeHttpUrl(sanitized.byomEndpoint, 'BYOM endpoint');
  }
  delete sanitized.pdftotextPath;
  delete sanitized.ocrmypdfPath;
  return sanitized;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(text)
  });
  res.end(text);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error('request body too large'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (_error) {
        reject(new Error('invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function runNodeCommand(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: PROJECT_ROOT,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    child.on('error', reject);
  });
}

function runPythonScript(args, stdinText = '') {
  return new Promise((resolve) => {
    const candidates = [
      { cmd: process.env.PCA_PYTHON || 'python', prefix: [] },
      { cmd: 'py', prefix: ['-3'] }
    ];

    function tryCandidate(index) {
      if (index >= candidates.length) {
        resolve({ code: 127, stdout: '', stderr: 'No Python runtime found for Z3 check.' });
        return;
      }

      const candidate = candidates[index];
      const child = spawn(candidate.cmd, [...candidate.prefix, ...args], {
        cwd: PROJECT_ROOT,
        windowsHide: true
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', () => {
        tryCandidate(index + 1);
      });

      child.on('close', (code) => {
        if (code === 9009 || (code !== 0 && /not recognized|not found/i.test(stderr))) {
          tryCandidate(index + 1);
          return;
        }
        resolve({ code, stdout, stderr });
      });

      if (stdinText) {
        child.stdin.write(stdinText);
      }
      child.stdin.end();
    }

    tryCandidate(0);
  });
}

function maybeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
}

function saveArtifact(prefix, payload) {
  const stamp = new Date().toISOString().replace(/[.:]/g, '-');
  const fileName = `${stamp}-${prefix}.json`;
  const filePath = path.join(ARTIFACT_DIR, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return {
    file_name: fileName,
    download_url: `/api/download?file=${encodeURIComponent(fileName)}`
  };
}

function toBool(value, fallback = true) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase().trim();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return fallback;
}

function pushFlag(args, name, value) {
  if (value === undefined || value === null || value === '') return;
  args.push(name, String(value));
}

function normalizeRuntimeProvider(value) {
  const normalized = String(value || 'unknown').trim().toLowerCase();
  return normalized || 'unknown';
}

function normalizeModelSelection(value) {
  const input = value && typeof value === 'object' ? value : {};
  return {
    proposal: String(input.proposal || '').trim() || null,
    critique: String(input.critique || '').trim() || null,
    assess: String(input.assess || '').trim() || null,
    notes: String(input.notes || '').trim() || null
  };
}

function supportsDirectRuntimeInvocation(runtimeProvider) {
  return runtimeProvider === 'ollama' || runtimeProvider === 'byom';
}

function buildRuntimeAdapterArgs(body, modeOverride, extra = {}) {
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  if (!supportsDirectRuntimeInvocation(runtimeProvider)) {
    return null;
  }

  const modelSelection = normalizeModelSelection(body.modelSelection);
  const mode = modeOverride || body.mode || 'verify';
  const decision = extra.decision || body.decision || 'PCA browser runtime assist';
  const context = extra.context || body.context || 'PCA browser runtime context';
  const policy = extra.policy || body.policy || 'balanced';
  const topology = extra.topology || body.topology || 'single-critic';
  const maxCycles = extra.maxCycles || body.maxCycles || body.cycles || 1;
  const riskFlags = Array.isArray(extra.riskFlags)
    ? extra.riskFlags.filter(Boolean).join(';')
    : (extra.riskFlags || body.riskFlags || '');

  const args = runtimeProvider === 'ollama'
    ? ['integrations/ollama/adapter.js', mode]
    : ['integrations/byom/adapter.js', mode];

  pushFlag(args, '--decision', decision);
  pushFlag(args, '--context', context);
  pushFlag(args, '--model-proposal', modelSelection.proposal || 'qwen2.5:7b');
  pushFlag(args, '--model-critic', modelSelection.critique || 'llama3.1:8b');
  pushFlag(args, '--model-assess', modelSelection.assess || 'qwen2.5:14b');
  pushFlag(args, '--policy', policy);
  pushFlag(args, '--topology', topology);
  pushFlag(args, '--max-cycles', maxCycles);
  pushFlag(args, '--risk-flags', riskFlags);

  if (runtimeProvider === 'byom') {
    pushFlag(args, '--endpoint', body.byomEndpoint || process.env.PCA_BYOM_ENDPOINT || 'http://localhost:11434/v1');
    pushFlag(args, '--api-key', body.byomApiKey || process.env.PCA_BYOM_API_KEY || 'none');
    pushFlag(args, '--temperature', body.byomTemperature || process.env.PCA_MODEL_TEMPERATURE || 0.2);
  }

  return args;
}

async function maybeRunRuntimeAdapter(body, modeOverride, extra = {}) {
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  if (!supportsDirectRuntimeInvocation(runtimeProvider)) {
    return {
      requested: false,
      executed: false,
      runtime_provider: runtimeProvider
    };
  }

  const args = buildRuntimeAdapterArgs(body, modeOverride, extra);
  if (!args) {
    return {
      requested: false,
      executed: false,
      runtime_provider: runtimeProvider
    };
  }

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson((result.stdout || '').trim());
  if (result.code !== 0 || !parsed) {
    return {
      requested: true,
      executed: false,
      runtime_provider: runtimeProvider,
      error: (result.stderr || 'runtime adapter invocation failed').trim() || 'runtime adapter invocation failed'
    };
  }

  return {
    requested: true,
    executed: true,
    runtime_provider: runtimeProvider,
    result: parsed
  };
}

function normalizeRiskLevel(value) {
  const normalized = String(value || 'medium').trim().toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
    return normalized;
  }
  return 'medium';
}

function normalizePassStrategy(value) {
  const normalized = String(value || 'adaptive').trim().toLowerCase();
  if (normalized === 'fixed' || normalized === 'adaptive') {
    return normalized;
  }
  return 'adaptive';
}

function getVerifyThresholds(policy) {
  const normalizedPolicy = String(policy || 'balanced').trim().toLowerCase();
  if (normalizedPolicy === 'fast') {
    return {
      min_weighted_score_100: 75,
      min_coverage_ratio: 0.7,
      max_unresolved_critical_risks: 0
    };
  }
  if (normalizedPolicy === 'strict') {
    return {
      min_weighted_score_100: 85,
      min_coverage_ratio: 0.9,
      max_unresolved_critical_risks: 0
    };
  }
  return {
    min_weighted_score_100: 80,
    min_coverage_ratio: 0.8,
    max_unresolved_critical_risks: 0
  };
}

function resolveDebateCyclePlan({ requestedCycles, policy, riskLevel, passStrategy }) {
  const boundedRequested = Math.max(1, Math.min(Number(requestedCycles) || 3, 5));
  const normalizedPolicy = String(policy || 'balanced').trim().toLowerCase();
  const normalizedRisk = normalizeRiskLevel(riskLevel);
  const normalizedStrategy = normalizePassStrategy(passStrategy);

  if (normalizedStrategy === 'fixed') {
    return {
      strategy: 'fixed',
      risk_level: normalizedRisk,
      policy: normalizedPolicy,
      requested_cycles: boundedRequested,
      selected_cycles: boundedRequested,
      reason: 'Fixed strategy selected by user.'
    };
  }

  let selected = normalizedRisk === 'low' ? 1 : normalizedRisk === 'high' ? 3 : 2;
  if (normalizedPolicy === 'strict') {
    selected = Math.max(selected, 3);
  } else if (normalizedPolicy === 'fast') {
    selected = Math.min(selected, 2);
  }

  selected = Math.max(1, Math.min(selected, 5));
  return {
    strategy: 'adaptive',
    risk_level: normalizedRisk,
    policy: normalizedPolicy,
    requested_cycles: boundedRequested,
    selected_cycles: selected,
    reason: 'Adaptive strategy selected cycles from policy + risk profile.'
  };
}

function isCriticalRiskFlag(flag) {
  return /critical|blocker|life[- ]safety|high-risk/.test(String(flag || '').toLowerCase());
}

function evaluateVerifyGates(assessment, policy, symbolicCheck) {
  const thresholds = getVerifyThresholds(policy);
  const scoreSummary = assessment && assessment.score_summary ? assessment.score_summary : null;
  const weightedScore = scoreSummary ? scoreSummary.weighted_score_100 : null;
  const coverageRatio = scoreSummary && scoreSummary.coverage ? scoreSummary.coverage.ratio : null;
  const riskFlags = assessment && Array.isArray(assessment.risk_flags) ? assessment.risk_flags : [];
  const unresolvedCriticalRisks = riskFlags.filter(isCriticalRiskFlag).length;

  const checks = {
    score_passed: typeof weightedScore === 'number' && weightedScore >= thresholds.min_weighted_score_100,
    coverage_passed: typeof coverageRatio === 'number' && coverageRatio >= thresholds.min_coverage_ratio,
    risk_passed: unresolvedCriticalRisks <= thresholds.max_unresolved_critical_risks,
    symbolic_passed: symbolicCheck ? Boolean(symbolicCheck.passed) : true
  };

  return {
    policy: String(policy || 'balanced').trim().toLowerCase(),
    thresholds,
    observed: {
      weighted_score_100: weightedScore,
      coverage_ratio: coverageRatio,
      unresolved_critical_risks: unresolvedCriticalRisks,
      symbolic_check: symbolicCheck || {
        enabled: false,
        passed: true,
        status: 'not_requested'
      }
    },
    checks,
    all_passed: checks.score_passed && checks.coverage_passed && checks.risk_passed && checks.symbolic_passed
  };
}

function buildRouteRecommendation(assessment, verifyGates) {
  if (!assessment) {
    return {
      recommended_mode: 'HITL',
      reason: 'No assessment available.'
    };
  }

  if (!verifyGates || !verifyGates.all_passed) {
    return {
      recommended_mode: 'HITL',
      reason: 'Verify gates did not pass. Human checkpoint required.'
    };
  }

  const recommended = assessment.human_control && assessment.human_control.recommended_mode
    ? assessment.human_control.recommended_mode
    : 'HOTL';
  return {
    recommended_mode: recommended,
    reason: assessment.human_control && assessment.human_control.reason
      ? assessment.human_control.reason
      : 'Verify gates passed. Proceed with monitored execution.'
  };
}

function buildZ3GeometryPayload(body) {
  const radius = Number(body.geometryRadius);
  const roomXMax = Number(body.geometryRoomWidth);
  const roomYMax = Number(body.geometryRoomHeight);
  return {
    room: {
      x_min: 0,
      x_max: Number.isFinite(roomXMax) && roomXMax > 0 ? roomXMax : 200,
      y_min: 0,
      y_max: Number.isFinite(roomYMax) && roomYMax > 0 ? roomYMax : 150
    },
    obstacle: {
      x_min: Number.isFinite(Number(body.geometryObstacleXMin)) ? Number(body.geometryObstacleXMin) : 80,
      x_max: Number.isFinite(Number(body.geometryObstacleXMax)) ? Number(body.geometryObstacleXMax) : 120,
      y_min: Number.isFinite(Number(body.geometryObstacleYMin)) ? Number(body.geometryObstacleYMin) : 60,
      y_max: Number.isFinite(Number(body.geometryObstacleYMax)) ? Number(body.geometryObstacleYMax) : 90
    },
    radius: Number.isFinite(radius) && radius > 0 ? radius : 30
  };
}

async function runZ3GeometryCheck(body) {
  const enabled = toBool(body.enableZ3GeometryCheck, false);
  if (!enabled) {
    return {
      enabled: false,
      passed: true,
      status: 'not_requested'
    };
  }

  const payload = buildZ3GeometryPayload(body);
  const run = await runPythonScript(['integrations/z3/geometry_solver.py'], JSON.stringify(payload));
  const parsed = maybeParseJson((run.stdout || '').trim());

  if (run.code !== 0 || !parsed || parsed.ok === false) {
    return {
      enabled: true,
      passed: false,
      status: 'error',
      error: parsed && parsed.message ? parsed.message : (run.stderr || 'Z3 solver invocation failed.')
    };
  }

  return {
    enabled: true,
    passed: parsed.status === 'sat',
    status: parsed.status,
    center: parsed.center || null,
    payload
  };
}

function createRunId(prefix = 'run') {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${stamp}-${random}`;
}

function sendSseEvent(res, eventName, payload) {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function summarizeStepText(value, fallback) {
  const text = String(value || '').trim();
  if (!text) return fallback;
  return text.length > 300 ? `${text.slice(0, 297)}...` : text;
}

function buildCycleProposal({ cycle, decision, context, previousAssessment }) {
  const decisionText = decision || 'decision focus';
  const contextText = context || 'available evidence';
  const carry = previousAssessment && previousAssessment.verdict
    ? ` Prior cycle verdict: ${previousAssessment.verdict}.`
    : '';
  return `Cycle ${cycle} proposal: prioritize ${decisionText} with evidence-backed controls based on ${contextText}.${carry}`;
}

function buildCycleCritique({ cycle, proposalText, previousRiskFlags }) {
  const riskHint = Array.isArray(previousRiskFlags) && previousRiskFlags.length > 0
    ? ` Prior risks: ${previousRiskFlags.join(', ')}.`
    : '';
  return `Cycle ${cycle} critique: test assumptions, identify risk and evidence gaps, and challenge unsupported claims in: ${proposalText}.${riskHint}`;
}

function parseLinesToList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (value === undefined || value === null) return [];
  return String(value)
    .split(/\r?\n|[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSourceList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (value === undefined || value === null) return [];
  return String(value)
    .split(/\r?\n|[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveSourcePath(rawPath) {
  const trimmed = String(rawPath || '').trim();
  if (!trimmed) return null;
  const resolved = path.isAbsolute(trimmed)
    ? path.normalize(trimmed)
    : path.normalize(path.resolve(PROJECT_ROOT, trimmed));
  return ensureAllowedExistingFileOrDirectory(resolved, 'source path');
}

function collectCorpusFiles(sourceInput, maxFiles = 12) {
  const allowedExt = new Set(['.txt', '.md', '.markdown', '.json', '.csv', '.log']);
  const queue = parseSourceList(sourceInput).map(resolveSourcePath).filter(Boolean);
  const files = [];
  const visitedDirs = new Set();

  while (queue.length > 0 && files.length < maxFiles) {
    const current = queue.shift();
    if (!current || !fs.existsSync(current)) continue;

    const stat = fs.statSync(current);
    if (stat.isFile()) {
      const ext = path.extname(current).toLowerCase();
      if (allowedExt.has(ext)) {
        files.push(current);
      }
      continue;
    }

    if (!stat.isDirectory()) continue;
    if (visitedDirs.has(current)) continue;
    visitedDirs.add(current);

    const children = fs.readdirSync(current)
      .map((name) => path.join(current, name))
      .sort((a, b) => a.localeCompare(b));

    children.forEach((child) => {
      if (files.length + queue.length >= maxFiles * 10) return;
      queue.push(child);
    });
  }

  return files.slice(0, maxFiles);
}

function buildCorpusPreviewItem(filePath, maxChars = 1200) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const trimmed = raw.trim();
    const preview = trimmed.length > maxChars
      ? `${trimmed.slice(0, maxChars)}...`
      : trimmed;
    return {
      path: filePath,
      size_bytes: Buffer.byteLength(raw, 'utf8'),
      preview_text: preview || '[Empty file]'
    };
  } catch (error) {
    return {
      path: filePath,
      size_bytes: null,
      preview_text: '[Unable to read file content]',
      error: error && error.message ? error.message : 'read_failed'
    };
  }
}

async function handleCorpusPreview(body) {
  const maxFiles = Math.max(1, Math.min(Number(body.maxFiles) || 8, 20));
  const maxChars = Math.max(200, Math.min(Number(body.maxChars) || 1200, 5000));
  const sourceInput = body.sources || body.textDir || body.inputDir || '';
  const files = collectCorpusFiles(sourceInput, maxFiles);
  const previews = files.map((filePath) => buildCorpusPreviewItem(filePath, maxChars));

  return {
    source_input: sourceInput,
    file_count: previews.length,
    files: previews,
    references: parseLinesToList(body.publicReferences),
    dataset_register: parseLinesToList(body.datasetRegistry)
  };
}

function buildInputRegistry(body) {
  return {
    public_references: parseLinesToList(body.publicReferences),
    user_datasets: parseLinesToList(body.datasetRegistry),
    sources: body.sources || null
  };
}

function buildSearchQueries({ decision, context, researchNeeds }) {
  const seeds = [decision, context, ...(researchNeeds || [])]
    .map((v) => String(v || '').trim())
    .filter(Boolean);
  return seeds.slice(0, 5).map((seed) => `Find authoritative evidence for: ${seed}`);
}

function summarizeEvidenceForResearch(evidenceResult) {
  const evidence = evidenceResult && evidenceResult.evidence ? evidenceResult.evidence : null;
  const assessment = evidenceResult && evidenceResult.assessment ? evidenceResult.assessment : null;
  const links = evidence && Array.isArray(evidence.links) ? evidence.links : [];
  const supportLinks = links
    .filter((item) => item.relation === 'support')
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  const contradictionLinks = links
    .filter((item) => item.relation === 'contradiction')
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

  const metrics = evidence && evidence.metrics ? evidence.metrics : {};
  const researchGaps = [];
  if ((metrics.source_coverage_ratio || 0) < 0.5) {
    researchGaps.push('Increase source coverage by adding more cross-referenced documents.');
  }
  if ((metrics.contradiction_count || 0) > 0) {
    researchGaps.push('Resolve contradictory claims with source-owner review and citations.');
  }
  if ((metrics.support_count || 0) < 3) {
    researchGaps.push('Collect stronger supporting evidence links before decision finalization.');
  }

  const riskFlags = assessment && Array.isArray(assessment.risk_flags) ? assessment.risk_flags : [];
  const targetedTasks = [
    ...contradictionLinks.slice(0, 3).map((item) => `Investigate contradiction between ${item.left_claim_id} and ${item.right_claim_id}`),
    ...riskFlags.slice(0, 3).map((flag) => `Find additional evidence to address risk flag: ${flag}`)
  ];

  return {
    evidence_metrics: metrics,
    top_support_links: supportLinks.slice(0, 8),
    top_contradictions: contradictionLinks.slice(0, 8),
    research_gaps: researchGaps,
    targeted_research_tasks: targetedTasks,
    assessment_quality: assessment
      ? {
        verdict: assessment.verdict,
        weighted_score_100: assessment.score_summary ? assessment.score_summary.weighted_score_100 : null,
        coverage_ratio: assessment.score_summary && assessment.score_summary.coverage
          ? assessment.score_summary.coverage.ratio
          : null,
        score_band: assessment.score_summary ? assessment.score_summary.band : null,
        human_control: assessment.human_control || null
      }
      : null
  };
}

async function handleFrameworkProposal(body) {
  const mode = body.mode || 'discuss';
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const decision = body.decision || 'Unspecified decision';
  const context = body.context || 'No context provided';
  const objective = body.objective || decision;
  const expectations = parseLinesToList(body.expectations);
  const constraints = parseLinesToList(body.constraints);
  const researchNeeds = parseLinesToList(body.researchNeeds);
  const activeSearchEnabled = toBool(body.activeSearchEnabled, false);
  const inputRegistry = buildInputRegistry(body);

  const prepareArgs = ['bin/pca.js', 'prepare', mode];
  pushFlag(prepareArgs, '--decision', decision);
  pushFlag(prepareArgs, '--context', context);
  pushFlag(prepareArgs, '--policy', body.policy || 'balanced');
  pushFlag(prepareArgs, '--topology', body.topology || 'single-critic');
  pushFlag(prepareArgs, '--max-cycles', body.maxCycles || 3);

  const prepareResult = await runNodeCommand(prepareArgs);
  const prepareParsed = maybeParseJson(prepareResult.stdout.trim());
  if (prepareResult.code !== 0 || !prepareParsed) {
    throw new Error(prepareResult.stderr.trim() || 'framework proposal failed during prepare');
  }

  let qualitySnapshot = null;
  if (body.sources) {
    const qualityArgs = ['bin/pca.js', 'quality-check'];
    pushFlag(qualityArgs, '--sources', body.sources);
    pushFlag(qualityArgs, '--max-files', body.maxFiles || 200);
    pushFlag(qualityArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
    pushFlag(qualityArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));
    pushFlag(qualityArgs, '--min-sources', body.minSources || 2);
    pushFlag(qualityArgs, '--min-total-claims', body.minTotalClaims || 6);
    pushFlag(qualityArgs, '--min-avg-claims-per-doc', body.minAvgClaimsPerDoc || 2);

    const qualityResult = await runNodeCommand(qualityArgs);
    const qualityParsed = maybeParseJson(qualityResult.stdout.trim());
    if (qualityResult.code === 0 && qualityParsed) {
      qualitySnapshot = qualityParsed;
    }
  }

  const runtimeAssist = await maybeRunRuntimeAdapter(body, 'discuss', {
    decision,
    context,
    policy: body.policy || 'balanced',
    topology: body.topology || 'single-critic',
    maxCycles: 1
  });

  const proposal = {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    mode,
    request_contract: {
      objective,
      decision,
      context,
      expectations,
      constraints,
      research_needs: researchNeeds,
      active_search_enabled: activeSearchEnabled
    },
    framework: {
      assessment_framework: prepareParsed.framework || null,
      orchestration: prepareParsed.orchestration || null,
      governance_policy: prepareParsed.governance_policy || null
    },
    data_inputs: {
      sources: body.sources || null,
      quality_snapshot: qualitySnapshot
    },
    execution_plan: [
      {
        step: 'prepare-session',
        command: `node bin/pca.js prepare ${mode} --decision "${decision}" --context "${context}"`
      },
      {
        step: 'propose-critique-loop',
        command: `node bin/pca.js propose ${mode} --decision "${decision}" ; node bin/pca.js critique ${mode} --decision "${decision}" --proposal "<proposal>"`
      },
      {
        step: 'assessment-and-routing',
        command: `node bin/pca.js evidence-check verify --decision "${decision}" --sources "${body.sources || '<sources>'}" --policy "${body.policy || 'balanced'}"`
      }
    ],
    verification_plan: {
      expected_outputs: [
        'quality_gate readiness',
        'cross-document support/contradiction metrics',
        'weighted score + coverage ratio',
        'HITL/HOTL governance recommendation'
      ],
      acceptance_checks: [
        'coverage ratio meets policy threshold',
        'weighted score is policy-compliant',
        'critical contradictions are resolved or escalated'
      ]
    },
    discussion_improvements: {
      loop_guidance: [
        'Require proposer to state what changed from previous cycle',
        'Require critic to map objections to framework criteria',
        'Track score delta and stop when improvements plateau'
      ]
    },
    active_ai_search_plan: {
      enabled: activeSearchEnabled,
      capability_note: activeSearchEnabled
        ? 'PCA defines search tasks; execution can be done by Copilot/Codex CLI, Antigravity, or BYOM adapters.'
        : 'Active search disabled for this run.',
      suggested_queries: activeSearchEnabled
        ? buildSearchQueries({ decision, context, researchNeeds })
        : []
      },
      runtime_assist: runtimeAssist
  };

  const artifact = saveArtifact('framework-proposal', proposal);
  return {
    result: proposal,
    artifact
  };
}

async function handleResearchPack(body) {
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);
  const mode = body.mode || 'verify';
  const qualityArgs = ['bin/pca.js', 'quality-check'];
  pushFlag(qualityArgs, '--sources', body.sources);
  pushFlag(qualityArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
  pushFlag(qualityArgs, '--max-files', body.maxFiles || 200);
  pushFlag(qualityArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));
  pushFlag(qualityArgs, '--min-sources', body.minSources || 2);
  pushFlag(qualityArgs, '--min-total-claims', body.minTotalClaims || 6);
  pushFlag(qualityArgs, '--min-avg-claims-per-doc', body.minAvgClaimsPerDoc || 2);

  const qualityResult = await runNodeCommand(qualityArgs);
  const qualityParsed = maybeParseJson(qualityResult.stdout.trim());
  if (qualityResult.code !== 0 || !qualityParsed) {
    throw new Error(qualityResult.stderr.trim() || 'research-pack failed at quality-check');
  }

  const evidenceArgs = ['bin/pca.js', 'evidence-check', mode];
  pushFlag(evidenceArgs, '--decision', body.decision || 'Research pack decision');
  pushFlag(evidenceArgs, '--context', body.context || 'Research pack context');
  pushFlag(evidenceArgs, '--sources', body.sources);
  pushFlag(evidenceArgs, '--policy', body.policy || 'strict');
  pushFlag(evidenceArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
  pushFlag(evidenceArgs, '--max-files', body.maxFiles || 200);
  pushFlag(evidenceArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));

  const evidenceResult = await runNodeCommand(evidenceArgs);
  const evidenceParsed = maybeParseJson(evidenceResult.stdout.trim());
  if (evidenceResult.code !== 0 || !evidenceParsed) {
    throw new Error(evidenceResult.stderr.trim() || 'research-pack failed at evidence-check');
  }

  const synthesis = summarizeEvidenceForResearch(evidenceParsed);
  const runtimeAssist = await maybeRunRuntimeAdapter(body, mode, {
    decision: body.decision || 'Research pack decision',
    context: body.context || 'Research pack context',
    policy: body.policy || 'strict',
    topology: body.topology || 'single-critic',
    maxCycles: 1,
    riskFlags: evidenceParsed.assessment && Array.isArray(evidenceParsed.assessment.risk_flags)
      ? evidenceParsed.assessment.risk_flags
      : []
  });
  const result = {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    mode,
    objective: body.objective || body.decision || null,
    decision: body.decision || null,
    context: body.context || null,
    quality_check: qualityParsed,
    evidence_check: {
      mode: evidenceParsed.mode,
      decision: evidenceParsed.decision,
      context: evidenceParsed.context,
      evidence: {
        source_count: evidenceParsed.evidence ? evidenceParsed.evidence.source_count : 0,
        total_claims: evidenceParsed.evidence ? evidenceParsed.evidence.total_claims : 0,
        metrics: evidenceParsed.evidence ? evidenceParsed.evidence.metrics : null
      },
      assessment: evidenceParsed.assessment || null
    },
    runtime_assist: runtimeAssist,
    research_synthesis: synthesis,
    active_ai_search_plan: {
      enabled: toBool(body.activeSearchEnabled, false),
      suggested_queries: toBool(body.activeSearchEnabled, false)
        ? buildSearchQueries({
          decision: body.decision,
          context: body.context,
          researchNeeds: parseLinesToList(body.researchNeeds)
        })
        : [],
      execution_note: 'Execute queries with Copilot/Codex CLI, Antigravity, or BYOM adapter; feed results back via sources for next cycle.'
    },
    process_quality: {
      stages: ['research', 'proposal', 'critique', 'assessment', 'verification'],
      recommendation: qualityParsed.quality_gate && qualityParsed.quality_gate.ready_for_evidence_check
        ? 'Ready for deeper debate loops with evidence-backed refinement.'
        : 'Increase corpus quality before deeper debate loops.'
    }
  };

  const artifact = saveArtifact('research-pack', result);
  return { result, artifact };
}

function toFixedNumber(value, digits = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return Number(value.toFixed(digits));
}

async function handleConvertPdf(body) {
  const args = ['scripts/convert-pdf-batch.cjs'];
  const inputDir = resolveDirectoryInput(body.inputDir, 'data', 'input directory');
  const outputDir = resolveDirectoryInput(body.outputDir, 'data/public-pdf-text', 'output directory');
  pushFlag(args, '--input-dir', inputDir);
  pushFlag(args, '--output-dir', outputDir);
  pushFlag(args, '--recursive', toBool(body.recursive, true));
  pushFlag(args, '--include-prefixes', body.includePrefixes || '');
  pushFlag(args, '--exclude-files', body.excludeFiles || '');
  pushFlag(args, '--pdftotext-path', process.env.PDFTOTEXT_PATH || '');

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'convert-pdf failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);
  const artifact = saveArtifact('convert-pdf', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed
  });
  return {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed,
    artifact
  };
}

async function handleOcrPdf(body) {
  const args = ['scripts/ocr-pdf-batch.cjs'];
  const inputDir = resolveDirectoryInput(body.inputDir, 'data', 'input directory');
  const outputDir = resolveDirectoryInput(body.outputDir, 'data/public-pdf-ocr', 'output directory');
  pushFlag(args, '--input-dir', inputDir);
  pushFlag(args, '--output-dir', outputDir);
  pushFlag(args, '--recursive', toBool(body.recursive, true));
  pushFlag(args, '--language', body.language || 'eng');
  pushFlag(args, '--skip-text', toBool(body.skipText, true));
  pushFlag(args, '--force-ocr', toBool(body.forceOcr, false));
  pushFlag(args, '--ocrmypdf-path', process.env.OCRMYPDF_PATH || '');

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'ocr-pdf failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);
  const artifact = saveArtifact('ocr-pdf', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed
  });
  return {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed,
    artifact
  };
}

async function handleQualityCheck(body) {
  const args = ['bin/pca.js', 'quality-check'];
  pushFlag(args, '--sources', body.sources);
  pushFlag(args, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
  pushFlag(args, '--max-files', body.maxFiles || 200);
  pushFlag(args, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));
  pushFlag(args, '--min-sources', body.minSources || 2);
  pushFlag(args, '--min-total-claims', body.minTotalClaims || 6);
  pushFlag(args, '--min-avg-claims-per-doc', body.minAvgClaimsPerDoc || 2);

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'quality-check failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);
  const artifact = saveArtifact('quality-check', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed
  });
  return {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    result: parsed,
    artifact
  };
}

async function handleEvidenceCheck(body) {
  const args = ['bin/pca.js', 'evidence-check', body.mode || 'verify'];
  pushFlag(args, '--decision', body.decision || 'Evidence check');
  pushFlag(args, '--context', body.context || 'Web UI initiated evidence check');
  pushFlag(args, '--sources', body.sources);
  pushFlag(args, '--policy', body.policy || 'strict');
  pushFlag(args, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
  pushFlag(args, '--max-files', body.maxFiles || 200);
  pushFlag(args, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'evidence-check failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);
  const z3Geometry = await runZ3GeometryCheck(body);
  const verifyGates = evaluateVerifyGates(parsed.assessment || null, body.policy || 'strict', z3Geometry);
  const routeRecommendation = buildRouteRecommendation(parsed.assessment || null, verifyGates);
  const runtimeAssist = await maybeRunRuntimeAdapter(body, body.mode || 'verify', {
    decision: body.decision || 'Evidence check',
    context: body.context || 'Web UI initiated evidence check',
    policy: body.policy || 'strict',
    topology: body.topology || 'single-critic',
    maxCycles: 1,
    riskFlags: parsed.assessment && Array.isArray(parsed.assessment.risk_flags)
      ? parsed.assessment.risk_flags
      : []
  });
  const artifact = saveArtifact('evidence-check', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    z3_geometry: z3Geometry,
    runtime_assist: runtimeAssist,
    verify_gates: verifyGates,
    route_recommendation: routeRecommendation,
    result: parsed
  });
  return {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    z3_geometry: z3Geometry,
    runtime_assist: runtimeAssist,
    verify_gates: verifyGates,
    route_recommendation: routeRecommendation,
    result: parsed,
    artifact
  };
}

async function handleDebateLive(req, res, body) {
  const cyclePlan = resolveDebateCyclePlan({
    requestedCycles: body.cycles,
    policy: body.policy || 'strict',
    riskLevel: body.riskLevel,
    passStrategy: body.passStrategy
  });
  const cycles = cyclePlan.selected_cycles;
  const mode = body.mode || 'verify';
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const inputRegistry = buildInputRegistry(body);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  const trace = {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    cycle_plan: cyclePlan,
    mode,
    cycles,
    decision: body.decision || null,
    context: body.context || null,
    policy: body.policy || 'strict',
    started_at: new Date().toISOString(),
    framework: null,
    scoring: {
      cycle_snapshots: []
    },
    z3_geometry: null,
    steps: []
  };

  sendSseEvent(res, 'start', {
    message: 'Live debate started.',
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    input_registry: inputRegistry,
    cycle_plan: cyclePlan,
    mode,
    cycles,
    policy: trace.policy
  });

  let previousAssessment = null;
  let previousRiskFlags = [];
  let previousScore100 = null;
  let datasetSelection = null;

  try {
    const z3Geometry = await runZ3GeometryCheck(body);
    trace.z3_geometry = z3Geometry;
    sendSseEvent(res, 'z3-geometry', z3Geometry);

    sendSseEvent(res, 'adaptive-plan', cyclePlan);
    sendSseEvent(res, 'model-selection', modelSelection);

    const prepareArgs = ['bin/pca.js', 'prepare', mode];
    pushFlag(prepareArgs, '--decision', body.decision || 'Live debate decision');
    pushFlag(prepareArgs, '--context', body.context || 'Live debate context');
    pushFlag(prepareArgs, '--max-cycles', cycles);
    pushFlag(prepareArgs, '--policy', body.policy || 'strict');
    pushFlag(prepareArgs, '--topology', body.topology || 'single-critic');

    const prepareResult = await runNodeCommand(prepareArgs);
    const prepareParsed = maybeParseJson(prepareResult.stdout.trim());
    if (prepareResult.code !== 0 || !prepareParsed) {
      throw new Error(prepareResult.stderr.trim() || 'prepare failed before live debate start');
    }

    trace.framework = {
      framework: prepareParsed.framework || null,
      orchestration: prepareParsed.orchestration || null,
      governance_policy: prepareParsed.governance_policy || null
    };

    sendSseEvent(res, 'framework', trace.framework);

    for (let cycle = 1; cycle <= cycles; cycle += 1) {
      if (closed) return;

      sendSseEvent(res, 'cycle-start', {
        cycle,
        total_cycles: cycles,
        message: `Cycle ${cycle} started`
      });

      const proposalText = buildCycleProposal({
        cycle,
        decision: body.decision,
        context: body.context,
        previousAssessment
      });

      const runtimeAssist = await maybeRunRuntimeAdapter(body, mode, {
        decision: body.decision || 'Live debate decision',
        context: `Cycle ${cycle}. ${body.context || 'Live debate context'}`,
        policy: body.policy || 'strict',
        topology: body.topology || 'single-critic',
        maxCycles: 1,
        riskFlags: previousRiskFlags
      });

      if (runtimeAssist.requested) {
        sendSseEvent(res, 'runtime-assist', {
          cycle,
          runtime_provider: runtimeAssist.runtime_provider,
          executed: runtimeAssist.executed,
          error: runtimeAssist.error || null,
          models: runtimeAssist.executed && runtimeAssist.result ? runtimeAssist.result.models || null : null
        });
      }

      const proposeArgs = ['bin/pca.js', 'propose', mode];
      pushFlag(proposeArgs, '--decision', body.decision || 'Live debate decision');
      pushFlag(proposeArgs, '--context', body.context || 'Live debate context');
      pushFlag(proposeArgs, '--proposal', proposalText);
      pushFlag(proposeArgs, '--sources', body.sources);
      pushFlag(proposeArgs, '--policy', body.policy || 'strict');
      pushFlag(proposeArgs, '--max-files', body.maxFiles || 200);
      pushFlag(proposeArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
      pushFlag(proposeArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));

      const proposeResult = await runNodeCommand(proposeArgs);
      const proposeParsed = maybeParseJson(proposeResult.stdout.trim());
      if (proposeResult.code !== 0 || !proposeParsed) {
        throw new Error(proposeResult.stderr.trim() || `propose failed on cycle ${cycle}`);
      }

      const proposeEvent = {
        cycle,
        stage: 'propose',
        role: proposeParsed.role,
        proposal: summarizeStepText(
          runtimeAssist.executed && runtimeAssist.result && runtimeAssist.result.role_outputs
            ? runtimeAssist.result.role_outputs.proposal
            : proposeParsed.proposal,
          proposalText
        ),
        evidence_digest: proposeParsed.evidence_digest,
        runtime_assist: runtimeAssist.requested
          ? {
            executed: runtimeAssist.executed,
            error: runtimeAssist.error || null
          }
          : null
      };
      trace.steps.push(proposeEvent);
      sendSseEvent(res, 'step', proposeEvent);

      const critiqueText = buildCycleCritique({
        cycle,
        proposalText,
        previousRiskFlags
      });

      const critiqueArgs = ['bin/pca.js', 'critique', mode];
      pushFlag(critiqueArgs, '--decision', body.decision || 'Live debate decision');
      pushFlag(critiqueArgs, '--context', body.context || 'Live debate context');
      pushFlag(critiqueArgs, '--proposal', proposalText);
      pushFlag(critiqueArgs, '--critique', critiqueText);
      pushFlag(critiqueArgs, '--sources', body.sources);
      pushFlag(critiqueArgs, '--policy', body.policy || 'strict');
      pushFlag(critiqueArgs, '--max-files', body.maxFiles || 200);
      pushFlag(critiqueArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
      pushFlag(critiqueArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));

      const critiqueResult = await runNodeCommand(critiqueArgs);
      const critiqueParsed = maybeParseJson(critiqueResult.stdout.trim());
      if (critiqueResult.code !== 0 || !critiqueParsed) {
        throw new Error(critiqueResult.stderr.trim() || `critique failed on cycle ${cycle}`);
      }

      const critiqueEvent = {
        cycle,
        stage: 'critique',
        role: critiqueParsed.role,
        critique: summarizeStepText(
          runtimeAssist.executed && runtimeAssist.result && runtimeAssist.result.role_outputs
            ? runtimeAssist.result.role_outputs.critic
            : critiqueParsed.critique,
          critiqueText
        ),
        extracted_risk_flags: critiqueParsed.extracted_risk_flags || []
      };
      trace.steps.push(critiqueEvent);
      sendSseEvent(res, 'step', critiqueEvent);

      const evidenceArgs = ['bin/pca.js', 'evidence-check', mode];
      pushFlag(evidenceArgs, '--decision', body.decision || 'Live debate decision');
      pushFlag(evidenceArgs, '--context', body.context || 'Live debate context');
      pushFlag(evidenceArgs, '--sources', body.sources);
      pushFlag(evidenceArgs, '--policy', body.policy || 'strict');
      pushFlag(evidenceArgs, '--max-files', body.maxFiles || 200);
      pushFlag(evidenceArgs, '--max-claims-per-doc', body.maxClaimsPerDoc || 8);
      pushFlag(evidenceArgs, '--prioritize-requirements', toBool(body.prioritizeRequirements, true));

      const evidenceResult = await runNodeCommand(evidenceArgs);
      const evidenceParsed = maybeParseJson(evidenceResult.stdout.trim());
      if (evidenceResult.code !== 0 || !evidenceParsed) {
        throw new Error(evidenceResult.stderr.trim() || `evidence-check failed on cycle ${cycle}`);
      }

      if (!datasetSelection) {
        const documents = evidenceParsed.evidence && Array.isArray(evidenceParsed.evidence.documents)
          ? evidenceParsed.evidence.documents
          : [];
        const sourcePaths = Array.from(new Set(documents.map((doc) => doc.source).filter(Boolean)));
        datasetSelection = {
          input_sources: body.sources || null,
          discovered_files: evidenceParsed.evidence ? evidenceParsed.evidence.discovered_files : sourcePaths.length,
          selected_files: evidenceParsed.evidence ? evidenceParsed.evidence.selected_files : sourcePaths.length,
          source_count: evidenceParsed.evidence ? evidenceParsed.evidence.source_count : sourcePaths.length,
          source_preview: sourcePaths.slice(0, 20)
        };
        trace.dataset_selection = datasetSelection;
        sendSseEvent(res, 'dataset-selection', datasetSelection);
      }

      previousAssessment = evidenceParsed.assessment || null;
      previousRiskFlags = previousAssessment && Array.isArray(previousAssessment.risk_flags)
        ? previousAssessment.risk_flags
        : [];

      const assessEvent = {
        cycle,
        stage: 'assess',
        verdict: previousAssessment ? previousAssessment.verdict : 'unknown',
        needs_human_review: previousAssessment ? Boolean(previousAssessment.needs_human_review) : true,
        human_control: previousAssessment ? previousAssessment.human_control : null,
        risk_flags: previousRiskFlags,
        score_summary: previousAssessment ? previousAssessment.score_summary : null,
        scoring: {
          weighted_score_100: previousAssessment && previousAssessment.score_summary
            ? previousAssessment.score_summary.weighted_score_100
            : null,
          weighted_score_5: previousAssessment && previousAssessment.score_summary
            ? previousAssessment.score_summary.weighted_score_5
            : null,
          coverage_ratio: previousAssessment
            && previousAssessment.score_summary
            && previousAssessment.score_summary.coverage
              ? previousAssessment.score_summary.coverage.ratio
              : null,
          coverage_provided: previousAssessment
            && previousAssessment.score_summary
            && previousAssessment.score_summary.coverage
              ? previousAssessment.score_summary.coverage.provided
              : 0,
          coverage_total: previousAssessment
            && previousAssessment.score_summary
            && previousAssessment.score_summary.coverage
              ? previousAssessment.score_summary.coverage.total
              : 0,
          band: previousAssessment && previousAssessment.score_summary
            ? previousAssessment.score_summary.band
            : 'insufficient-data',
          delta_weighted_score_100: null
        },
        verify_gates: evaluateVerifyGates(previousAssessment, body.policy || 'strict', z3Geometry),
        runtime_assist: runtimeAssist.executed && runtimeAssist.result
          ? {
            models: runtimeAssist.result.models || null,
            assessment: runtimeAssist.result.assessment || null,
            assess_summary: summarizeStepText(
              runtimeAssist.result.role_outputs ? runtimeAssist.result.role_outputs.assess : '',
              null
            )
          }
          : (runtimeAssist.requested
            ? {
              error: runtimeAssist.error || 'runtime assist unavailable'
            }
            : null)
      };

      if (typeof assessEvent.scoring.weighted_score_100 === 'number') {
        if (typeof previousScore100 === 'number') {
          assessEvent.scoring.delta_weighted_score_100 = toFixedNumber(
            assessEvent.scoring.weighted_score_100 - previousScore100,
            2
          );
        }
        previousScore100 = assessEvent.scoring.weighted_score_100;
      }

      trace.scoring.cycle_snapshots.push({
        cycle,
        weighted_score_100: assessEvent.scoring.weighted_score_100,
        weighted_score_5: assessEvent.scoring.weighted_score_5,
        coverage_ratio: assessEvent.scoring.coverage_ratio,
        coverage_provided: assessEvent.scoring.coverage_provided,
        coverage_total: assessEvent.scoring.coverage_total,
        band: assessEvent.scoring.band,
        delta_weighted_score_100: assessEvent.scoring.delta_weighted_score_100
      });

      trace.steps.push(assessEvent);
      sendSseEvent(res, 'step', assessEvent);
    }

    trace.completed_at = new Date().toISOString();
    const finalAssessment = previousAssessment || null;
    const finalVerifyGates = evaluateVerifyGates(finalAssessment, body.policy || 'strict', trace.z3_geometry);
    const finalRouteRecommendation = buildRouteRecommendation(finalAssessment, finalVerifyGates);
    const checkpointRequired = !finalAssessment
      || !finalVerifyGates.all_passed
      || finalAssessment.needs_human_review
      || (finalAssessment.human_control && finalAssessment.human_control.recommended_mode === 'HITL');

    const finalPayload = {
      cycles_completed: cycles,
      model_selection: modelSelection,
      input_registry: inputRegistry,
      cycle_plan: cyclePlan,
      framework: trace.framework,
      dataset_selection: datasetSelection,
      scoring: {
        cycle_snapshots: trace.scoring.cycle_snapshots,
        final_weighted_score_100: finalAssessment
          && finalAssessment.score_summary
          ? finalAssessment.score_summary.weighted_score_100
          : null,
        final_coverage_ratio: finalAssessment
          && finalAssessment.score_summary
          && finalAssessment.score_summary.coverage
            ? finalAssessment.score_summary.coverage.ratio
            : null,
        final_band: finalAssessment
          && finalAssessment.score_summary
          ? finalAssessment.score_summary.band
          : 'insufficient-data'
      },
      final_assessment: finalAssessment,
      z3_geometry: trace.z3_geometry,
      verify_gates: finalVerifyGates,
      route_recommendation: finalRouteRecommendation,
      runtime_assist: trace.steps
        .map((step) => step.runtime_assist)
        .filter(Boolean),
      human_checkpoint: {
        required: checkpointRequired,
        decision: checkpointRequired
          ? 'Further discussion needed'
          : 'Proceed with recommendations',
        reason: finalRouteRecommendation.reason
      }
    };

    const artifact = saveArtifact('live-debate', {
      ...trace,
      final: finalPayload
    });

    sendSseEvent(res, 'artifact', artifact);
    sendSseEvent(res, 'final', finalPayload);
    sendSseEvent(res, 'done', { message: 'Live debate finished.' });
    res.end();
  } catch (error) {
    sendSseEvent(res, 'error', {
      error: error && error.message ? error.message : 'live debate failed'
    });
    res.end();
  }
}

async function handleRunPipeline(req, res, body) {
  const runId = createRunId('pipeline');
  const policy = body.policy || 'strict';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  const startedAt = new Date().toISOString();
  const timeline = [];

  function emitStage(stage, status, detail) {
    const payload = {
      run_id: runId,
      stage,
      status,
      detail,
      at: new Date().toISOString()
    };
    timeline.push(payload);
    sendSseEvent(res, 'stage', payload);
  }

  try {
    sendSseEvent(res, 'start', {
      run_id: runId,
      message: 'Pipeline run started.',
      model_selection: normalizeModelSelection(body.modelSelection),
      runtime_provider: normalizeRuntimeProvider(body.runtimeProvider)
    });

    if (closed) return;
    emitStage('input', 'running', 'Capturing data, requirements, and objectives.');
    const inputRegistry = buildInputRegistry(body);
    const inputStage = {
      data: {
        sources: body.sources || null,
        public_references: inputRegistry.public_references,
        user_datasets: inputRegistry.user_datasets
      },
      requirements: parseLinesToList(body.expectations),
      objectives: {
        objective: body.objective || null,
        decision: body.decision || null,
        context: body.context || null,
        constraints: parseLinesToList(body.constraints)
      }
    };
    emitStage('input', 'completed', 'Input stage captured.');

    if (closed) return;
    emitStage('process.organize', 'running', 'Building framework proposal.');
    const framework = await handleFrameworkProposal(body);
    emitStage('process.organize', 'completed', 'Framework proposal completed.');

    if (closed) return;
    emitStage('process.test', 'running', 'Running research pack and critique synthesis.');
    const research = await handleResearchPack(body);
    emitStage('process.test', 'completed', 'Research pack completed.');

    if (closed) return;
    emitStage('process.verify', 'running', 'Running evidence check and verify gates.');
    const evidence = await handleEvidenceCheck(body);
    emitStage('process.verify', 'completed', 'Evidence verification completed.');

    const assessment = evidence && evidence.result ? evidence.result.assessment || null : null;
    const verifyGates = evidence ? evidence.verify_gates : evaluateVerifyGates(assessment, policy);
    const routeRecommendation = evidence
      ? evidence.route_recommendation
      : buildRouteRecommendation(assessment, verifyGates);

    if (closed) return;
    emitStage('output.recommend', 'completed', 'Recommendation generated from verified assessment.');

    const checkpointRequired = !verifyGates.all_passed || routeRecommendation.recommended_mode === 'HITL';
    emitStage(
      'output.route',
      checkpointRequired ? 'blocked' : 'completed',
      checkpointRequired
        ? `Route ${routeRecommendation.recommended_mode}: human checkpoint required.`
        : `Route ${routeRecommendation.recommended_mode}: proceed with monitored implementation.`
    );

    const implementation = checkpointRequired
      ? {
        status: 'pending-human-checkpoint',
        note: 'Implementation is gated until HITL approval is complete.'
      }
      : {
        status: 'ready-for-implementation',
        note: 'Proceed with controlled implementation under HOTL monitoring.'
      };

    emitStage('output.implement', checkpointRequired ? 'pending' : 'ready', implementation.note);

    const finalPayload = {
      run_id: runId,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      input: inputStage,
      process: {
        organize: framework.result,
        test: research.result,
        verify: evidence.result
      },
      output: {
        recommend: {
          assessment,
          verify_gates: verifyGates
        },
        route: routeRecommendation,
        implement: implementation,
        document: {
          generated: true,
          timeline_steps: timeline.length
        }
      }
    };

    const artifact = saveArtifact('run-pipeline', finalPayload);
    sendSseEvent(res, 'artifact', artifact);
    sendSseEvent(res, 'final', {
      ...finalPayload,
      artifact
    });
    sendSseEvent(res, 'done', {
      run_id: runId,
      message: 'Pipeline run finished.'
    });
    res.end();
  } catch (error) {
    sendSseEvent(res, 'error', {
      run_id: runId,
      error: error && error.message ? error.message : 'pipeline run failed'
    });
    res.end();
  }
}

function listArtifacts() {
  return fs.readdirSync(ARTIFACT_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .reverse()
    .map((name) => ({
      file_name: name,
      download_url: `/api/download?file=${encodeURIComponent(name)}`
    }));
}

function toUiPath(targetPath) {
  const relative = path.relative(PROJECT_ROOT, targetPath);
  if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
    return relative.split(path.sep).join('/');
  }
  return targetPath;
}

function normalizeExistingDir(targetPath) {
  if (!targetPath) return null;
  const raw = String(targetPath).trim();
  if (!raw) return null;

  const candidate = path.isAbsolute(raw)
    ? path.normalize(raw)
    : path.normalize(path.join(PROJECT_ROOT, raw));
  try {
    if (isAllowedPath(candidate) && fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  } catch (_error) {
    return null;
  }
  return null;
}

function addDirectoryOption(targetSet, dirPath) {
  const existing = normalizeExistingDir(dirPath);
  if (existing) {
    targetSet.add(toUiPath(existing));
  }
}

function addChildDirectories(targetSet, rootPath, maxItems = 24) {
  const existing = normalizeExistingDir(rootPath);
  if (!existing) return;
  try {
    fs.readdirSync(existing, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .slice(0, maxItems)
      .forEach((entry) => {
        targetSet.add(toUiPath(path.join(existing, entry.name)));
      });
  } catch (_error) {
    // Ignore unreadable directories.
  }
}

function addFilesFromDirectory(targetSet, rootPath, allowedExtensions, maxItems = 40) {
  const existing = normalizeExistingDir(rootPath);
  if (!existing) return;
  try {
    fs.readdirSync(existing, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .filter((entry) => {
        if (!allowedExtensions || allowedExtensions.length === 0) return true;
        return allowedExtensions.includes(path.extname(entry.name).toLowerCase());
      })
      .slice(0, maxItems)
      .forEach((entry) => {
        targetSet.add(entry.name);
      });
  } catch (_error) {
    // Ignore unreadable directories.
  }
}

function buildPathOptions(query) {
  const inputDir = query.inputDir || '';
  const ocrDir = query.ocrDir || '';
  const textDir = query.textDir || '';
  const sources = query.sources || '';

  const inputDirs = new Set();
  const outputDirs = new Set();
  const sourcePaths = new Set();
  const excludeFiles = new Set();

  const directorySeeds = ALLOWED_ROOTS;

  directorySeeds.forEach((seed) => {
    addDirectoryOption(inputDirs, seed);
    addDirectoryOption(outputDirs, seed);
    addDirectoryOption(sourcePaths, seed);
    addChildDirectories(inputDirs, seed, 60);
    addChildDirectories(outputDirs, seed, 60);
    addChildDirectories(sourcePaths, seed, 60);
  });

  [inputDir, ocrDir, textDir].forEach((value) => {
    const resolved = normalizeExistingDir(value);
    if (!resolved) return;
    addDirectoryOption(inputDirs, resolved);
    addDirectoryOption(outputDirs, resolved);
    addDirectoryOption(sourcePaths, resolved);
    addChildDirectories(inputDirs, resolved, 80);
    addChildDirectories(outputDirs, resolved, 80);
    addChildDirectories(sourcePaths, resolved, 80);
    addFilesFromDirectory(excludeFiles, resolved, ['.pdf', '.txt', '.json', '.pptx']);
  });

  sources.split(',').map((item) => item.trim()).filter(Boolean).forEach((value) => {
    const resolved = normalizeExistingDir(value);
    if (!resolved) return;
    addDirectoryOption(sourcePaths, resolved);
    addChildDirectories(sourcePaths, resolved, 80);
    addFilesFromDirectory(excludeFiles, resolved, ['.pdf', '.txt', '.json']);
  });

  addFilesFromDirectory(excludeFiles, path.join(PROJECT_ROOT, 'data', 'public-pdf-text'), ['.txt', '.json']);

  return {
    inputDirs: Array.from(inputDirs).sort(),
    outputDirs: Array.from(outputDirs).sort(),
    sourcePaths: Array.from(sourcePaths).sort(),
    excludeFiles: Array.from(excludeFiles).sort(),
    includePrefixes: ['BCA', 'URA', 'SCDF', 'NEA', 'NParks', 'GovTech'],
    allowedRoots: ALLOWED_ROOTS.map((rootPath) => toUiPath(rootPath))
  };
}

function serveStatic(req, res, pathname) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(WEB_ROOT, safePath);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(WEB_ROOT)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  if (!fs.existsSync(normalized) || fs.statSync(normalized).isDirectory()) {
    sendText(res, 404, 'Not Found');
    return;
  }

  const ext = path.extname(normalized).toLowerCase();
  const mime = ext === '.html'
    ? 'text/html; charset=utf-8'
    : ext === '.css'
      ? 'text/css; charset=utf-8'
      : ext === '.js'
        ? 'application/javascript; charset=utf-8'
        : 'application/octet-stream';

  const content = fs.readFileSync(normalized);
  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': content.length
  });
  res.end(content);
}

function checkExistingServerHealth(host, port) {
  return new Promise((resolve) => {
    const request = http.get(
      {
        host: host === '0.0.0.0' ? '127.0.0.1' : host,
        port,
        path: '/api/health',
        timeout: 1500
      },
      (response) => {
        let raw = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          const parsed = maybeParseJson(raw.trim());
          resolve(Boolean(parsed && parsed.ok));
        });
      }
    );

    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });

    request.on('error', () => {
      resolve(false);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  try {
    assertAllowedHostHeader(req);
    assertAllowedOrigin(req);
    assertJsonPost(req);

    if (req.method === 'GET' && pathname === '/api/health') {
      sendJson(res, 200, { ok: true, service: 'pca-web-ui' });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/artifacts') {
      sendJson(res, 200, { artifacts: listArtifacts() });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/path-options') {
      sendJson(res, 200, buildPathOptions({
        inputDir: reqUrl.searchParams.get('inputDir') || '',
        ocrDir: reqUrl.searchParams.get('ocrDir') || '',
        textDir: reqUrl.searchParams.get('textDir') || '',
        sources: reqUrl.searchParams.get('sources') || ''
      }));
      return;
    }

    if (req.method === 'GET' && pathname === '/api/download') {
      const file = reqUrl.searchParams.get('file') || '';
      const filePath = path.join(ARTIFACT_DIR, file);
      const normalized = path.normalize(filePath);
      if (!normalized.startsWith(ARTIFACT_DIR) || !fs.existsSync(normalized)) {
        sendText(res, 404, 'Artifact not found');
        return;
      }
      const content = fs.readFileSync(normalized);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${path.basename(normalized)}"`,
        'Content-Length': content.length
      });
      res.end(content);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/convert-pdf') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleConvertPdf(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/ocr-pdf') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleOcrPdf(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/quality-check') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleQualityCheck(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/evidence-check') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleEvidenceCheck(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/framework-proposal') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleFrameworkProposal(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/corpus-preview') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleCorpusPreview(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/research-pack') {
      const body = sanitizeRequestBody(await parseBody(req));
      const output = await handleResearchPack(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/debate-live') {
      const body = sanitizeRequestBody(await parseBody(req));
      await handleDebateLive(req, res, body);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/run-pipeline') {
      const body = sanitizeRequestBody(await parseBody(req));
      await handleRunPipeline(req, res, body);
      return;
    }

    if (req.method === 'GET') {
      serveStatic(req, res, pathname);
      return;
    }

    sendText(res, 404, 'Not Found');
  } catch (error) {
    sendJson(res, error && error.statusCode ? error.statusCode : 500, {
      ok: false,
      error: error && error.message ? error.message : 'unexpected error'
    });
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`PCA Web UI running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}\n`);
});

server.on('error', async (error) => {
  if (error && error.code === 'EADDRINUSE') {
    const healthy = await checkExistingServerHealth(HOST, PORT);
    if (healthy) {
      process.stdout.write(`PCA Web UI already running at http://localhost:${PORT}\n`);
      process.exit(0);
      return;
    }
    process.stderr.write(`Port ${PORT} is in use and the existing process did not respond as PCA Web UI.\n`);
    process.exit(1);
    return;
  }

  process.stderr.write(`${error && error.message ? error.message : 'server error'}\n`);
  process.exit(1);
});
