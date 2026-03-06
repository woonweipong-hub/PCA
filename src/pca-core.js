const VALID_MODES = new Set(['discuss', 'verify']);
const VALID_POLICIES = new Set(['fast', 'balanced', 'strict']);
const VALID_TOPOLOGIES = new Set(['single-critic', 'multi-critic', 'red-team']);
const fs = require('fs');
const path = require('path');
const SUPPORTED_SOURCE_EXTENSIONS = new Set(['.md', '.txt', '.json', '.csv']);
const WORKFLOW_DIAGRAM = [
  'flowchart TD',
  '  A[Decision + context] --> B[pca prepare or run]',
  '  B --> C[Proposer Agent]',
  '  C --> D[Critic Agent]',
  '  D --> E[Assessor Agent]',
  '  E --> F[pca assess]',
  '  F --> G[pca route]',
  '  G -->|HITL| H[Human approval required]',
  '  G -->|HOTL| I[Proceed with monitoring]',
  '  H --> J[pca persist]',
  '  I --> J[pca persist]'
].join('\n');

function assertMode(mode) {
  if (!VALID_MODES.has(mode)) {
    throw new Error("mode must be 'discuss' or 'verify'");
  }
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function normalizeRole(role) {
  const normalized = String(role || '').toLowerCase().trim();
  return normalized === 'assessor' ? 'judge' : normalized;
}

function summarizeForChat(content) {
  const text = String(content || '').replace(/\r\n/g, '\n').trim();
  if (!text) return 'No role output provided.';
  const compact = text.split('\n').map((line) => line.trim()).filter(Boolean).join(' ');
  return compact.length > 320 ? `${compact.slice(0, 317)}...` : compact;
}

function parseRiskFlags(value) {
  if (!value) return [];
  return String(value)
    .split(/[;,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseScores(value) {
  if (!value) return {};
  return String(value)
    .split(/[;,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const parts = entry.split('=');
      if (parts.length !== 2) return acc;
      const key = parts[0].trim();
      const score = Number(parts[1].trim());
      if (!key || Number.isNaN(score)) return acc;
      acc[key] = Math.max(0, Math.min(score, 5));
      return acc;
    }, {});
}

function parseDelimitedList(value) {
  if (!value) return [];
  return String(value)
    .split(/[;,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function isSupportedSourceFile(filePath) {
  const ext = path.extname(String(filePath || '')).toLowerCase();
  return SUPPORTED_SOURCE_EXTENSIONS.has(ext);
}

function scoreSourcePath(filePath) {
  const normalized = String(filePath || '').toLowerCase();
  let score = 0;
  if (normalized.includes('requirement')) score += 6;
  if (normalized.includes('brief')) score += 5;
  if (normalized.includes('scope')) score += 4;
  if (normalized.includes('spec')) score += 3;
  if (normalized.includes('risk')) score += 2;
  return score;
}

function collectFilesRecursive(dirPath) {
  const results = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && isSupportedSourceFile(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function resolveSourcePaths({ sources, maxFiles = 200, prioritizeRequirements = true }) {
  const parsedSources = Array.isArray(sources) ? sources : parseDelimitedList(sources);
  if (parsedSources.length === 0) {
    throw new Error('ingest requires --sources <path1,path2,...>');
  }

  const discovered = [];

  parsedSources.forEach((source) => {
    const absolute = path.resolve(source);
    if (!fs.existsSync(absolute)) {
      throw new Error(`source path not found: ${source}`);
    }

    const stat = fs.statSync(absolute);
    if (stat.isDirectory()) {
      discovered.push(...collectFilesRecursive(absolute));
      return;
    }

    if (stat.isFile()) {
      if (!isSupportedSourceFile(absolute)) {
        return;
      }
      discovered.push(absolute);
    }
  });

  const deduped = Array.from(new Set(discovered));
  if (deduped.length === 0) {
    throw new Error('no supported source files found (.md, .txt, .json, .csv)');
  }

  const normalizedMaxFiles = Math.max(1, Math.min(Number(maxFiles) || 200, 2000));
  const normalizedPrioritize = (prioritizeRequirements === undefined || prioritizeRequirements === null)
    ? true
    : parseBoolean(prioritizeRequirements);
  const sorted = deduped.sort((a, b) => {
    if (!normalizedPrioritize) return a.localeCompare(b);
    const scoreDiff = scoreSourcePath(b) - scoreSourcePath(a);
    if (scoreDiff !== 0) return scoreDiff;
    return a.localeCompare(b);
  });

  const selected = sorted.slice(0, normalizedMaxFiles);

  return {
    source_roots: parsedSources,
    discovered_files: sorted.length,
    selected_files: selected.length,
    skipped_files: Math.max(0, sorted.length - selected.length),
    paths: selected
  };
}

function splitIntoSentences(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function tokenizeText(text) {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'should', 'could', 'about', 'their', 'there', 'which', 'when', 'where', 'what', 'your', 'while', 'than', 'then', 'also', 'only', 'over', 'under', 'very', 'more', 'most', 'less', 'least']);
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !stopWords.has(t));
}

function hasNegationSignal(text) {
  return /\b(no|not|never|without|cannot|can't|wont|won't|decline|decrease|drop|fail|failed)\b/i.test(String(text || ''));
}

function toTextFromJson(value, parentKey = '') {
  if (value === null || value === undefined) return [];
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const prefix = parentKey ? `${parentKey}: ` : '';
    return [`${prefix}${String(value)}`];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, idx) => toTextFromJson(item, `${parentKey}[${idx}]`));
  }
  if (typeof value === 'object') {
    return Object.keys(value).flatMap((key) => {
      const nextKey = parentKey ? `${parentKey}.${key}` : key;
      return toTextFromJson(value[key], nextKey);
    });
  }
  return [];
}

function parseCsvToLines(raw) {
  function parseCsvRow(row) {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i += 1) {
      const char = row[i];
      const nextChar = row[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i += 1;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }

      if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    cells.push(current.trim());
    return cells;
  }

  const lines = String(raw || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];
  const headers = parseCsvRow(lines[0]);
  return lines.slice(1, 201).map((row, idx) => {
    const cols = parseCsvRow(row);
    const pairs = headers.map((h, i) => `${h}=${cols[i] || ''}`).join(', ');
    return `row ${idx + 1}: ${pairs}`;
  });
}

function readSourceText(sourcePath) {
  const absolutePath = path.resolve(sourcePath);
  const ext = path.extname(absolutePath).toLowerCase();
  const raw = fs.readFileSync(absolutePath, 'utf-8');

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(raw);
      return toTextFromJson(parsed).join('\n');
    } catch (_error) {
      return raw;
    }
  }

  if (ext === '.csv') {
    return parseCsvToLines(raw).join('\n');
  }

  return raw;
}

function buildDocumentDigest({ source, text, maxClaims = 8 }) {
  const sentences = splitIntoSentences(text);
  const claims = [];

  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (sentence.length < 30 || sentence.length > 320) continue;
    const tokens = tokenizeText(sentence);
    if (tokens.length < 5) continue;
    claims.push({
      claim_id: `${path.basename(source)}:${claims.length + 1}`,
      text: sentence,
      tokens,
      has_negation: hasNegationSignal(sentence)
    });
    if (claims.length >= maxClaims) break;
  }

  return {
    source,
    word_count: tokenizeText(text).length,
    claim_count: claims.length,
    claims
  };
}

function jaccardSimilarity(tokensA, tokensB) {
  const a = new Set(tokensA || []);
  const b = new Set(tokensB || []);
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function compareDocumentsForEvidence(documents) {
  const links = [];

  for (let i = 0; i < documents.length; i += 1) {
    for (let j = i + 1; j < documents.length; j += 1) {
      const left = documents[i];
      const right = documents[j];

      left.claims.forEach((leftClaim) => {
        right.claims.forEach((rightClaim) => {
          const similarity = jaccardSimilarity(leftClaim.tokens, rightClaim.tokens);
          if (similarity < 0.35) return;

          const contradiction = similarity >= 0.4 && leftClaim.has_negation !== rightClaim.has_negation;
          links.push({
            left_source: left.source,
            left_claim_id: leftClaim.claim_id,
            right_source: right.source,
            right_claim_id: rightClaim.claim_id,
            relation: contradiction ? 'contradiction' : 'support',
            similarity: Number(similarity.toFixed(3))
          });
        });
      });
    }
  }

  return links;
}

function ingestSources({ sources, maxClaimsPerDocument = 8, maxFiles = 200, prioritizeRequirements = true }) {
  const resolved = resolveSourcePaths({
    sources,
    maxFiles,
    prioritizeRequirements
  });

  const documents = resolved.paths.map((source) => {
    const text = readSourceText(source);
    return buildDocumentDigest({
      source,
      text,
      maxClaims: Math.max(1, Math.min(Number(maxClaimsPerDocument) || 8, 20))
    });
  });

  const totalClaims = documents.reduce((sum, doc) => sum + doc.claim_count, 0);
  const totalWords = documents.reduce((sum, doc) => sum + doc.word_count, 0);

  return {
    source_roots: resolved.source_roots,
    discovered_files: resolved.discovered_files,
    selected_files: resolved.selected_files,
    skipped_files: resolved.skipped_files,
    source_count: documents.length,
    total_claims: totalClaims,
    total_words: totalWords,
    documents
  };
}

function buildDataQualityCheck({
  sources,
  maxClaimsPerDocument,
  maxFiles,
  prioritizeRequirements,
  minSources = 2,
  minTotalClaims = 6,
  minAvgClaimsPerDoc = 2
}) {
  const digest = ingestSources({ sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements });

  const averageClaimsPerDocument = digest.source_count > 0
    ? Number((digest.total_claims / digest.source_count).toFixed(3))
    : 0;

  const checks = [
    {
      key: 'min_sources',
      actual: digest.source_count,
      threshold: Math.max(1, Number(minSources) || 2),
      pass: digest.source_count >= Math.max(1, Number(minSources) || 2)
    },
    {
      key: 'min_total_claims',
      actual: digest.total_claims,
      threshold: Math.max(1, Number(minTotalClaims) || 6),
      pass: digest.total_claims >= Math.max(1, Number(minTotalClaims) || 6)
    },
    {
      key: 'min_avg_claims_per_doc',
      actual: averageClaimsPerDocument,
      threshold: Math.max(0.5, Number(minAvgClaimsPerDoc) || 2),
      pass: averageClaimsPerDocument >= Math.max(0.5, Number(minAvgClaimsPerDoc) || 2)
    }
  ];

  const passed = checks.filter((item) => item.pass).length;
  const failedChecks = checks.filter((item) => !item.pass).map((item) => item.key);
  const ready = failedChecks.length === 0;

  return {
    source_roots: digest.source_roots,
    discovered_files: digest.discovered_files,
    selected_files: digest.selected_files,
    skipped_files: digest.skipped_files,
    source_count: digest.source_count,
    total_claims: digest.total_claims,
    total_words: digest.total_words,
    average_claims_per_document: averageClaimsPerDocument,
    checks,
    quality_gate: {
      ready_for_evidence_check: ready,
      passed_checks: passed,
      total_checks: checks.length,
      failed_checks: failedChecks,
      recommendation: ready
        ? 'Proceed to pca evidence-check.'
        : 'Improve source quality/coverage before pca evidence-check.'
    }
  };
}

function buildEvidenceCheck({ mode, decision, context, sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements, policy, needsHumanReview }) {
  assertMode(mode);
  const ingested = ingestSources({ sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements });
  const claimLinks = compareDocumentsForEvidence(ingested.documents);

  const contradictionCount = claimLinks.filter((l) => l.relation === 'contradiction').length;
  const supportCount = claimLinks.filter((l) => l.relation === 'support').length;
  const totalLinks = claimLinks.length;
  const corroborationRatio = totalLinks ? supportCount / totalLinks : 0;
  const contradictionRatio = totalLinks ? contradictionCount / totalLinks : 0;
  const sourceCoverage = ingested.source_count > 1 ? Math.min(1, totalLinks / Math.max(1, ingested.total_claims / 2)) : 0;

  const autoScores = mode === 'verify'
    ? {
      evidence_quality: Number((Math.max(0, Math.min(1, corroborationRatio - contradictionRatio)) * 5).toFixed(2)),
      release_safety: Number((Math.max(0, 1 - contradictionRatio) * 5).toFixed(2)),
      user_impact: Number((Math.max(0, 1 - contradictionRatio * 1.2) * 5).toFixed(2)),
      completeness: Number((Math.max(0, sourceCoverage) * 5).toFixed(2))
    }
    : {
      scope_alignment: Number((Math.max(0, sourceCoverage) * 5).toFixed(2)),
      assumption_quality: Number((Math.max(0, 1 - contradictionRatio) * 5).toFixed(2)),
      strategy_clarity: Number((Math.max(0, corroborationRatio) * 5).toFixed(2)),
      completeness: Number((Math.max(0, sourceCoverage) * 5).toFixed(2))
    };

  const riskFlags = [];
  if (ingested.source_count < 2) riskFlags.push('single-source-evidence');
  if (ingested.total_claims < 4) riskFlags.push('limited-claim-coverage');
  if (contradictionCount > 0) riskFlags.push(`cross-document-contradictions:${contradictionCount}`);
  if (sourceCoverage < 0.3) riskFlags.push('low-cross-document-linkage');

  const verdict = contradictionCount > 0
    ? 'needs-human-review'
    : (sourceCoverage >= 0.5 && corroborationRatio >= 0.55 ? 'accepted' : 'accepted-with-conditions');

  const judgement = [
    `Cross-document check completed for ${ingested.source_count} source(s).`,
    `Support links: ${supportCount}. Contradictions: ${contradictionCount}.`,
    `Coverage ratio: ${Number(sourceCoverage.toFixed(3))}.`
  ].join(' ');

  const actions = contradictionCount > 0
    ? 'Resolve contradictory claims with source owner review before execution.'
    : 'Proceed with tracked actions and monitor flagged evidence gaps.';

  const assessment = buildAssessmentResult({
    mode,
    verdict,
    judgement,
    actions,
    needsHumanReview,
    riskFlags,
    scores: autoScores,
    policy
  });

  return {
    mode,
    decision: decision || null,
    context: context || null,
    evidence: {
      ...ingested,
      links: claimLinks,
      metrics: {
        support_count: supportCount,
        contradiction_count: contradictionCount,
        corroboration_ratio: Number(corroborationRatio.toFixed(3)),
        contradiction_ratio: Number(contradictionRatio.toFixed(3)),
        source_coverage_ratio: Number(sourceCoverage.toFixed(3))
      }
    },
    assessment
  };
}

function buildProposalResult({ mode, decision, context, proposal, sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements, topology = 'single-critic', policy = 'balanced' }) {
  assertMode(mode);
  const session = buildSession({ mode, decision, context, topology, policy });
  const ingested = sources
    ? ingestSources({ sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements })
    : null;

  return {
    mode,
    role: 'proposer',
    decision: decision || null,
    context: context || null,
    prompt: session.prompts.proposal,
    proposal: proposal ? summarizeForChat(proposal) : null,
    evidence_digest: ingested
      ? {
        source_count: ingested.source_count,
        total_claims: ingested.total_claims,
        total_words: ingested.total_words
      }
      : null,
    next_step: 'Run pca critique with --proposal to challenge assumptions and identify risks.'
  };
}

function extractRiskFlagsFromText(text) {
  const normalized = String(text || '').toLowerCase();
  const candidates = [
    ['uncertain', 'uncertain-evidence'],
    ['contradiction', 'cross-document-contradiction'],
    ['risk', 'risk-mentioned'],
    ['gap', 'evidence-gap'],
    ['missing', 'missing-information'],
    ['rollback', 'rollback-risk']
  ];

  return candidates
    .filter(([needle]) => normalized.includes(needle))
    .map(([, flag]) => flag);
}

function buildCritiqueResult({ mode, decision, context, proposal, critique, sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements, topology = 'single-critic', policy = 'balanced' }) {
  assertMode(mode);
  const session = buildSession({ mode, decision, context, topology, policy });
  const ingested = sources
    ? ingestSources({ sources, maxClaimsPerDocument, maxFiles, prioritizeRequirements })
    : null;
  const critiqueSummary = critique ? summarizeForChat(critique) : null;
  const extractedRiskFlags = extractRiskFlagsFromText(critiqueSummary);

  return {
    mode,
    role: 'critic',
    decision: decision || null,
    context: context || null,
    proposal: proposal ? summarizeForChat(proposal) : null,
    prompt: buildCriticPrompt(mode, decision, proposal || null, context, topology),
    critique: critiqueSummary,
    extracted_risk_flags: extractedRiskFlags,
    evidence_digest: ingested
      ? {
        source_count: ingested.source_count,
        total_claims: ingested.total_claims,
        total_words: ingested.total_words
      }
      : null,
    next_step: 'Run pca assess with --risk-flags and --scores for final governance routing.'
  };
}

function normalizePolicy(policy) {
  const normalized = String(policy || 'balanced').toLowerCase().trim();
  if (!VALID_POLICIES.has(normalized)) {
    throw new Error("policy must be 'fast', 'balanced', or 'strict'");
  }
  return normalized;
}

function getGovernancePolicy(policy) {
  const normalized = normalizePolicy(policy);
  if (normalized === 'fast') {
    return {
      name: normalized,
      min_weighted_score_100_for_hotl: 40,
      min_coverage_ratio_for_hotl: 0.2,
      hitl_on_any_risk_flag: false,
      hitl_on_low_score: true
    };
  }
  if (normalized === 'strict') {
    return {
      name: normalized,
      min_weighted_score_100_for_hotl: 75,
      min_coverage_ratio_for_hotl: 0.5,
      hitl_on_any_risk_flag: true,
      hitl_on_low_score: true
    };
  }
  return {
    name: 'balanced',
    min_weighted_score_100_for_hotl: 60,
    min_coverage_ratio_for_hotl: 0.35,
    hitl_on_any_risk_flag: false,
    hitl_on_low_score: true
  };
}

function normalizeTopology(topology) {
  const normalized = String(topology || 'single-critic').toLowerCase().trim();
  if (!VALID_TOPOLOGIES.has(normalized)) {
    throw new Error("topology must be 'single-critic', 'multi-critic', or 'red-team'");
  }
  return normalized;
}

function getTopologyConfig(topology, maxCycles) {
  const normalized = normalizeTopology(topology);
  const cycles = Number(maxCycles) || 2;
  if (normalized === 'multi-critic') {
    return {
      name: normalized,
      critic_agents: 3,
      synthesis_required: true,
      recommended_max_cycles: 4,
      cycle_pressure: cycles < 4 ? 'high' : 'normal'
    };
  }
  if (normalized === 'red-team') {
    return {
      name: normalized,
      critic_agents: 2,
      synthesis_required: true,
      recommended_max_cycles: 5,
      cycle_pressure: cycles < 5 ? 'high' : 'normal'
    };
  }
  return {
    name: 'single-critic',
    critic_agents: 1,
    synthesis_required: false,
    recommended_max_cycles: 2,
    cycle_pressure: cycles < 2 ? 'high' : 'normal'
  };
}

function getScoringModel(mode) {
  const framework = getAssessmentFramework(mode);
  const criteria = [
    ...framework.universal_criteria.map((item) => ({
      key: item.key,
      weight: Number((item.weight * 0.4).toFixed(4))
    })),
    ...framework.criteria.map((item) => ({
      key: item.key,
      weight: Number((item.weight * 0.6).toFixed(4))
    }))
  ];
  return {
    scale: { min: 0, max: 5 },
    criteria
  };
}

function computeScoreSummary(mode, scoresInput) {
  const scoringModel = getScoringModel(mode);
  const scores = scoresInput && typeof scoresInput === 'object' ? scoresInput : parseScores(scoresInput);

  let weightedSum = 0;
  let providedWeight = 0;
  const criteria = scoringModel.criteria.map((criterion) => {
    const raw = scores[criterion.key];
    const score = typeof raw === 'number' && !Number.isNaN(raw)
      ? Math.max(scoringModel.scale.min, Math.min(raw, scoringModel.scale.max))
      : null;
    if (score !== null) {
      weightedSum += score * criterion.weight;
      providedWeight += criterion.weight;
    }
    return {
      key: criterion.key,
      weight: criterion.weight,
      score
    };
  });

  const provided = criteria.filter((c) => c.score !== null).length;
  const total = criteria.length;
  const coverage = total ? provided / total : 0;
  if (providedWeight === 0) {
    return {
      scale: scoringModel.scale,
      coverage: {
        provided,
        total,
        ratio: Number(coverage.toFixed(4))
      },
      weighted_score_5: null,
      weighted_score_100: null,
      band: 'insufficient-data',
      criteria
    };
  }

  const normalizedScore5 = weightedSum / providedWeight;
  const score100 = (normalizedScore5 / scoringModel.scale.max) * 100;
  const rounded5 = Number(normalizedScore5.toFixed(3));
  const rounded100 = Number(score100.toFixed(1));
  const band = rounded100 >= 80 ? 'high' : rounded100 >= 60 ? 'medium' : 'low';

  return {
    scale: scoringModel.scale,
    coverage: {
      provided,
      total,
      ratio: Number(coverage.toFixed(4))
    },
    weighted_score_5: rounded5,
    weighted_score_100: rounded100,
    band,
    criteria
  };
}

function shouldIncludeWorkflowDiagram(maxCycles, diagramPolicy) {
  const policy = String(diagramPolicy || 'auto').toLowerCase();
  if (!['auto', 'always', 'never'].includes(policy)) {
    throw new Error("diagram policy must be 'auto', 'always', or 'never'");
  }
  if (policy === 'always') return true;
  if (policy === 'never') return false;
  return maxCycles > 3;
}

function applyGovernancePolicy(baseControl, mode, riskFlags, scoreSummary, policyName) {
  const policy = getGovernancePolicy(policyName);
  const risks = Array.isArray(riskFlags) ? riskFlags : [];

  if (policy.hitl_on_any_risk_flag && risks.length > 0) {
    return {
      recommended_mode: 'HITL',
      reason: `Policy '${policy.name}' requires HITL when any risk flag exists.`,
      policy_applied: policy
    };
  }

  const score = scoreSummary && typeof scoreSummary.weighted_score_100 === 'number'
    ? scoreSummary.weighted_score_100
    : null;
  const coverage = scoreSummary && scoreSummary.coverage && typeof scoreSummary.coverage.ratio === 'number'
    ? scoreSummary.coverage.ratio
    : 0;

  if (policy.hitl_on_low_score && mode === 'verify') {
    if (score !== null && score < policy.min_weighted_score_100_for_hotl) {
      return {
        recommended_mode: 'HITL',
        reason: `Policy '${policy.name}' requires HITL when weighted score is below ${policy.min_weighted_score_100_for_hotl}.`,
        policy_applied: policy
      };
    }
    if (coverage < policy.min_coverage_ratio_for_hotl) {
      return {
        recommended_mode: 'HITL',
        reason: `Policy '${policy.name}' requires HITL when score coverage is below ${policy.min_coverage_ratio_for_hotl}.`,
        policy_applied: policy
      };
    }
  }

  return {
    ...baseControl,
    policy_applied: policy
  };
}

function buildAssessmentResult({ mode, verdict, judgement, actions, needsHumanReview, riskFlags, scores, policy }) {
  assertMode(mode);
  const normalizedVerdict = verdict || 'accepted-with-conditions';
  const normalizedJudgement = judgement || null;
  const normalizedActions = actions || null;
  const normalizedNeedsHumanReview = parseBoolean(needsHumanReview);
  const normalizedRiskFlags = Array.isArray(riskFlags) ? riskFlags : parseRiskFlags(riskFlags);
  const baseControl = getHumanControlRecommendation(
    mode,
    normalizedVerdict,
    normalizedNeedsHumanReview,
    normalizedRiskFlags
  );
  const scoreSummary = computeScoreSummary(mode, scores);
  const control = applyGovernancePolicy(
    baseControl,
    mode,
    normalizedRiskFlags,
    scoreSummary,
    policy
  );

  return {
    mode,
    verdict: normalizedVerdict,
    judgement: normalizedJudgement,
    actions: normalizedActions,
    risk_flags: normalizedRiskFlags,
    score_summary: scoreSummary,
    needs_human_review: normalizedNeedsHumanReview,
    human_control: control
  };
}

function formatAssessmentMarkdown(result) {
  const lines = [
    '# PCA Assessment',
    '',
    `- mode: ${result.mode}`,
    `- verdict: ${result.verdict}`,
    `- needs_human_review: ${result.needs_human_review ? 'true' : 'false'}`,
    `- human_control: ${result.human_control.recommended_mode}`,
    `- human_control_reason: ${result.human_control.reason}`,
    `- risk_flags: ${result.risk_flags.length ? result.risk_flags.join('; ') : 'none'}`,
    `- weighted_score_100: ${result.score_summary.weighted_score_100 === null ? 'n/a' : result.score_summary.weighted_score_100}`,
    `- score_band: ${result.score_summary.band}`,
    `- judgement: ${result.judgement || 'n/a'}`,
    `- actions: ${result.actions || 'n/a'}`
  ];
  return `${lines.join('\n')}\n`;
}

function getAssessmentFramework(mode) {
  assertMode(mode);

  const universal = [
    { key: 'completeness', weight: 0.2, question: 'Does it cover key aspects with no critical gaps?' },
    { key: 'practicality', weight: 0.2, question: 'Is this realistic for delivery?' },
    { key: 'soundness', weight: 0.2, question: 'Is it logically consistent?' },
    { key: 'feasibility', weight: 0.2, question: 'Is it achievable in constraints?' },
    { key: 'governance_safety', weight: 0.2, question: 'Are risk and safety constraints handled?' }
  ];

  if (mode === 'verify') {
    return {
      name: 'verification-risk-framework',
      purpose: 'Evaluate evidence quality and release risk.',
      universal_criteria: universal,
      criteria: [
        { key: 'evidence_quality', weight: 0.35, question: 'Is evidence reproducible and sufficient?' },
        { key: 'user_impact', weight: 0.3, question: 'How severe is user impact?' },
        { key: 'scope_of_failure', weight: 0.2, question: 'How broad is failure scope?' },
        { key: 'release_safety', weight: 0.15, question: 'Is release safe now?' }
      ]
    };
  }

  return {
    name: 'discussion-decision-framework',
    purpose: 'Select implementation framing before planning.',
    universal_criteria: universal,
    criteria: [
      { key: 'scope_alignment', weight: 0.35, question: 'Does this fit phase scope?' },
      { key: 'strategy_clarity', weight: 0.3, question: 'Is direction clear enough to plan?' },
      { key: 'assumption_quality', weight: 0.2, question: 'Are assumptions explicit and testable?' },
      { key: 'execution_readiness', weight: 0.15, question: 'Can the team execute without re-discovery?' }
    ]
  };
}

function getHumanControlRecommendation(mode, verdict, needsHumanReview, riskFlags) {
  assertMode(mode);
  if (needsHumanReview || verdict === 'needs-human-review') {
    return {
      recommended_mode: 'HITL',
      reason: 'High uncertainty or unresolved risk requires explicit human decision.'
    };
  }

  if (mode === 'verify' && (verdict === 'accepted-with-conditions' || riskFlags.length > 0)) {
    return {
      recommended_mode: 'HOTL',
      reason: 'Proceed with oversight while conditions and risk flags are monitored.'
    };
  }

  return {
    recommended_mode: 'HOTL',
    reason: 'No critical blockers detected.'
  };
}

function frameworkToPromptBlock(framework) {
  const criteriaLines = framework.criteria
    .map((c) => `- ${c.key} (weight ${c.weight}): ${c.question}`)
    .join('\n');
  return [
    `Assessment framework: ${framework.name}`,
    `Purpose: ${framework.purpose}`,
    'Criteria:',
    criteriaLines
  ].join('\n');
}

function buildProposalPrompt(mode, decision, context) {
  const framework = getAssessmentFramework(mode);
  const preface = mode === 'verify'
    ? 'You are the Proposer in PCA verification.'
    : 'You are the Proposer in PCA discuss mode.';
  return [
    preface,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    frameworkToPromptBlock(framework),
    'Return recommendation, assumptions, risks, and next actions.'
  ].join('\n');
}

function buildCriticPrompt(mode, decision, proposalText, context, topology) {
  const framework = getAssessmentFramework(mode);
  const topologyConfig = getTopologyConfig(topology, 2);
  const preface = mode === 'verify'
    ? 'You are the Critic in PCA verification.'
    : 'You are the Critic in PCA discuss mode.';
  const topologyInstruction = topologyConfig.synthesis_required
    ? `Topology: ${topologyConfig.name}. Produce critic notes designed for synthesis across ${topologyConfig.critic_agents} critic agents.`
    : `Topology: ${topologyConfig.name}. Provide a single critic pass.`;
  return [
    preface,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    topologyInstruction,
    frameworkToPromptBlock(framework),
    'Return strongest objections, missing evidence, and safer alternatives.'
  ].join('\n');
}

function buildAssessPrompt(mode, decision, proposalText, criticText, context, topology) {
  const framework = getAssessmentFramework(mode);
  const topologyConfig = getTopologyConfig(topology, 2);
  return [
    `You are the Assessor in PCA ${mode} mode.`,
    `Decision focus: ${decision || 'unspecified'}`,
    `Context: ${context || '(none provided)'}`,
    `Proposal: ${proposalText || '(to be supplied)'}`,
    `Critic: ${criticText || '(to be supplied)'}`,
    `Topology: ${topologyConfig.name}. Synthesize across ${topologyConfig.critic_agents} critic channel(s).`,
    frameworkToPromptBlock(framework),
    'Output: verdict, judgement, actions, risk_flags, needs_human_review.'
  ].join('\n');
}

function buildSession({ mode, decision, context, maxCycles = 2, diagramPolicy = 'auto', topology = 'single-critic', policy = 'balanced' }) {
  assertMode(mode);
  const cycles = Math.max(1, Math.min(Number(maxCycles) || 2, 5));
  const framework = getAssessmentFramework(mode);
  const includeDiagram = shouldIncludeWorkflowDiagram(cycles, diagramPolicy);
  const topologyConfig = getTopologyConfig(topology, cycles);
  const governancePolicy = getGovernancePolicy(policy);
  return {
    mode,
    decision: decision || null,
    context: context || null,
    max_cycles: cycles,
    workflow: {
      diagram_policy: String(diagramPolicy || 'auto').toLowerCase(),
      diagram_recommended: cycles > 3,
      diagram_included: includeDiagram,
      diagram_mermaid: includeDiagram ? WORKFLOW_DIAGRAM : null
    },
    orchestration: topologyConfig,
    governance_policy: governancePolicy,
    framework,
    prompts: {
      proposal: buildProposalPrompt(mode, decision, context),
      critic: buildCriticPrompt(mode, decision, null, context, topologyConfig.name),
      assess: buildAssessPrompt(mode, decision, null, null, context, topologyConfig.name)
    }
  };
}

module.exports = {
  parseBoolean,
  normalizeRole,
  summarizeForChat,
  parseRiskFlags,
  parseScores,
  parseDelimitedList,
  resolveSourcePaths,
  ingestSources,
  buildDataQualityCheck,
  buildEvidenceCheck,
  buildProposalResult,
  buildCritiqueResult,
  normalizePolicy,
  getGovernancePolicy,
  normalizeTopology,
  getTopologyConfig,
  getAssessmentFramework,
  getScoringModel,
  computeScoreSummary,
  shouldIncludeWorkflowDiagram,
  applyGovernancePolicy,
  getHumanControlRecommendation,
  buildAssessmentResult,
  formatAssessmentMarkdown,
  buildProposalPrompt,
  buildCriticPrompt,
  buildAssessPrompt,
  buildSession
};
