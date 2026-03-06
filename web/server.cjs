#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { spawn } = require('child_process');

const HOST = process.env.PCA_UI_HOST || '0.0.0.0';
const PORT = Number(process.env.PCA_UI_PORT || 4173);

const WEB_ROOT = path.resolve(__dirname, 'ui');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.join(PROJECT_ROOT, 'outputs', 'ui');

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

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
    file_path: filePath,
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

  const proposal = {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
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
    }
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
  const result = {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
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
  pushFlag(args, '--input-dir', body.inputDir || '.');
  pushFlag(args, '--output-dir', body.outputDir || 'data/public-pdf-text');
  pushFlag(args, '--recursive', toBool(body.recursive, true));
  pushFlag(args, '--include-prefixes', body.includePrefixes || '');
  pushFlag(args, '--exclude-files', body.excludeFiles || '');
  pushFlag(args, '--pdftotext-path', body.pdftotextPath || process.env.PDFTOTEXT_PATH || '');

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'convert-pdf failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const artifact = saveArtifact('convert-pdf', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    result: parsed
  });
  return { runtime_provider: runtimeProvider, model_selection: modelSelection, result: parsed, artifact };
}

async function handleOcrPdf(body) {
  const args = ['scripts/ocr-pdf-batch.cjs'];
  pushFlag(args, '--input-dir', body.inputDir || '.');
  pushFlag(args, '--output-dir', body.outputDir || 'data/public-pdf-ocr');
  pushFlag(args, '--recursive', toBool(body.recursive, true));
  pushFlag(args, '--language', body.language || 'eng');
  pushFlag(args, '--skip-text', toBool(body.skipText, true));
  pushFlag(args, '--force-ocr', toBool(body.forceOcr, false));
  pushFlag(args, '--ocrmypdf-path', body.ocrmypdfPath || process.env.OCRMYPDF_PATH || '');

  const result = await runNodeCommand(args);
  const parsed = maybeParseJson(result.stdout.trim());
  if (result.code !== 0 || !parsed) {
    throw new Error(result.stderr.trim() || 'ocr-pdf failed');
  }
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);
  const artifact = saveArtifact('ocr-pdf', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    result: parsed
  });
  return { runtime_provider: runtimeProvider, model_selection: modelSelection, result: parsed, artifact };
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
  const artifact = saveArtifact('quality-check', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    result: parsed
  });
  return { runtime_provider: runtimeProvider, model_selection: modelSelection, result: parsed, artifact };
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
  const artifact = saveArtifact('evidence-check', {
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    result: parsed
  });
  return { runtime_provider: runtimeProvider, model_selection: modelSelection, result: parsed, artifact };
}

async function handleDebateLive(req, res, body) {
  const cycles = Math.max(1, Math.min(Number(body.cycles) || 3, 5));
  const mode = body.mode || 'verify';
  const runtimeProvider = normalizeRuntimeProvider(body.runtimeProvider);
  const modelSelection = normalizeModelSelection(body.modelSelection);

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
    steps: []
  };

  sendSseEvent(res, 'start', {
    message: 'Live debate started.',
    runtime_provider: runtimeProvider,
    model_selection: modelSelection,
    mode,
    cycles,
    policy: trace.policy
  });

  let previousAssessment = null;
  let previousRiskFlags = [];
  let previousScore100 = null;
  let datasetSelection = null;

  try {
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
        proposal: summarizeStepText(proposeParsed.proposal, proposalText),
        evidence_digest: proposeParsed.evidence_digest
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
        critique: summarizeStepText(critiqueParsed.critique, critiqueText),
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
        }
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
    const checkpointRequired = !finalAssessment
      || finalAssessment.needs_human_review
      || (finalAssessment.human_control && finalAssessment.human_control.recommended_mode === 'HITL');

    const finalPayload = {
      cycles_completed: cycles,
      model_selection: modelSelection,
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
      human_checkpoint: {
        required: checkpointRequired,
        decision: checkpointRequired ? 'Further discussion needed' : 'Proceed with recommendations',
        reason: finalAssessment && finalAssessment.human_control
          ? finalAssessment.human_control.reason
          : 'No final assessment available.'
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

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      sendJson(res, 200, { ok: true, service: 'pca-web-ui' });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/artifacts') {
      sendJson(res, 200, { artifacts: listArtifacts() });
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
      const body = await parseBody(req);
      const output = await handleConvertPdf(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/ocr-pdf') {
      const body = await parseBody(req);
      const output = await handleOcrPdf(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/quality-check') {
      const body = await parseBody(req);
      const output = await handleQualityCheck(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/evidence-check') {
      const body = await parseBody(req);
      const output = await handleEvidenceCheck(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/framework-proposal') {
      const body = await parseBody(req);
      const output = await handleFrameworkProposal(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/research-pack') {
      const body = await parseBody(req);
      const output = await handleResearchPack(body);
      sendJson(res, 200, output);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/debate-live') {
      const body = await parseBody(req);
      await handleDebateLive(req, res, body);
      return;
    }

    if (req.method === 'GET') {
      serveStatic(req, res, pathname);
      return;
    }

    sendText(res, 404, 'Not Found');
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error && error.message ? error.message : 'unexpected error'
    });
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`PCA Web UI running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}\n`);
});
