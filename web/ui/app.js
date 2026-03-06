const statusEl = document.getElementById('status');
const resultView = document.getElementById('resultView');
const artifactList = document.getElementById('artifactList');

const inputDir = document.getElementById('inputDir');
const ocrDir = document.getElementById('ocrDir');
const textDir = document.getElementById('textDir');
const publicReferences = document.getElementById('publicReferences');
const datasetRegistry = document.getElementById('datasetRegistry');
const includePrefixes = document.getElementById('includePrefixes');
const excludeFiles = document.getElementById('excludeFiles');
const decision = document.getElementById('decision');
const useCaseProfile = document.getElementById('useCaseProfile');
const objective = document.getElementById('objective');
const contextText = document.getElementById('context');
const sourcesInput = document.getElementById('sourcesInput');
const expectations = document.getElementById('expectations');
const researchNeeds = document.getElementById('researchNeeds');
const constraints = document.getElementById('constraints');
const activeSearchEnabled = document.getElementById('activeSearchEnabled');
const policy = document.getElementById('policy');
const runtimeProvider = document.getElementById('runtimeProvider');
const modelProposal = document.getElementById('modelProposal');
const modelCritique = document.getElementById('modelCritique');
const modelAssess = document.getElementById('modelAssess');
const modelNotes = document.getElementById('modelNotes');
const maxFiles = document.getElementById('maxFiles');
const debateCycles = document.getElementById('debateCycles');
const passStrategy = document.getElementById('passStrategy');
const riskLevel = document.getElementById('riskLevel');
const enableZ3GeometryCheck = document.getElementById('enableZ3GeometryCheck');
const geometryRoomWidth = document.getElementById('geometryRoomWidth');
const geometryRoomHeight = document.getElementById('geometryRoomHeight');
const geometryObstacleX = document.getElementById('geometryObstacleX');
const geometryObstacleY = document.getElementById('geometryObstacleY');
const geometryRadius = document.getElementById('geometryRadius');
const minSources = document.getElementById('minSources');
const minClaims = document.getElementById('minClaims');

const btnOcr = document.getElementById('btnOcr');
const btnConvert = document.getElementById('btnConvert');
const btnFramework = document.getElementById('btnFramework');
const btnResearch = document.getElementById('btnResearch');
const btnQuality = document.getElementById('btnQuality');
const btnEvidence = document.getElementById('btnEvidence');
const btnPipeline = document.getElementById('btnPipeline');
const btnLiveDebate = document.getElementById('btnLiveDebate');
const btnPreviewCorpus = document.getElementById('btnPreviewCorpus');
const btnRefreshArtifacts = document.getElementById('btnRefreshArtifacts');

const debateState = document.getElementById('debateState');
const debateTimeline = document.getElementById('debateTimeline');
const humanCheckpoint = document.getElementById('humanCheckpoint');
const checkpointDecision = document.getElementById('checkpointDecision');
const checkpointReason = document.getElementById('checkpointReason');
const frameworkView = document.getElementById('frameworkView');
const scoringView = document.getElementById('scoringView');
const runtimeGuide = document.getElementById('runtimeGuide');
const cliSnippetsView = document.getElementById('cliSnippetsView');
const inputRegistryView = document.getElementById('inputRegistryView');
const corpusPreviewView = document.getElementById('corpusPreviewView');

const USE_CASE_PROFILES = {
  corenetx: {
    objective: 'Reduce back-and-forth and manual BIM submission checks in CORENET X workflows.',
    decision: 'Select minimal design edits to resolve BIM rule non-compliances',
    context: 'Check encoded BCA/IFC-SG rules, compare edit variants, and return only rule-compliant options.',
    expectations: 'Maximise issue-resolution coverage\nMinimise layout disruption\nKeep options officer/QP actionable',
    researchNeeds: 'Typical submission non-compliances\nBCA/IFC-SG machine-readable rule extraction\nEdit impact heuristics',
    constraints: 'Only encoded rules are enforceable\nPreserve key design intent\nTrace every suggestion to rule evidence',
    policy: 'strict'
  },
  accessibility: {
    objective: 'Ensure consistent BCA-compliant accessible routes and facilities directly in BIM.',
    decision: 'Choose route/layout options that satisfy accessibility constraints',
    context: 'Generate and compare candidate routes and local tweaks for continuity, detour, and user-friendliness.',
    expectations: 'Continuous accessible route\nNo unresolved dimensional breaches\nMinimal detour impact',
    researchNeeds: 'Accessibility code dimensional requirements\nRoute continuity constraints\nToilet/door/ramp compliance patterns',
    constraints: 'No steps on accessible routes\nRespect minimum clear widths/slopes\nMaintain functional usability',
    policy: 'strict'
  },
  buildability: {
    objective: 'Improve Buildability/Constructability score while remaining code-compliant.',
    decision: 'Pick grid/component alternatives with best productivity-quality tradeoff',
    context: 'Compare structural/system options for repetition, fewer types, and simpler junctions.',
    expectations: 'Higher buildability score\nControlled cost/complexity\nNo compliance regression',
    researchNeeds: 'Buildability scoring logic\nStructural/regulatory hard constraints\nComponent standardization patterns',
    constraints: 'Do not break structural rules\nKeep regulatory compliance\nQuantify tradeoffs transparently',
    policy: 'balanced'
  },
  mepcs: {
    objective: 'Move from clash detection to clash-free engineering-sound proposals.',
    decision: 'Select rerouting/resizing options that eliminate clashes with engineering integrity',
    context: 'Evaluate options for pressure loss, headroom, constructability, and visual/space impact.',
    expectations: 'Zero critical clashes\nEngineering constraints satisfied\nConstructable layouts',
    researchNeeds: 'Geometric clearances\nMEP engineering constraints\nStructural separation/coordination rules',
    constraints: 'No unresolved hard clashes\nRespect clearance/slope/span limits\nMaintain maintainability access',
    policy: 'strict'
  },
  greenmark: {
    objective: 'Support Green Mark-aligned envelope/layout improvements with minimal redesign.',
    decision: 'Choose facade/zoning tweaks with best compliance-performance uplift',
    context: 'Compare window/shading/zoning variants against daylight and opening-ratio proxies.',
    expectations: 'Improved GM proxies\nLow redesign disruption\nCode-compliant outcome',
    researchNeeds: 'GM rule translation to checkable metrics\nDaylight/openings proxy formulas\nThermal/solar simplifications',
    constraints: 'Preserve architectural intent\nAvoid major redesign\nMeet baseline code compliance',
    policy: 'balanced'
  },
  maintainability: {
    objective: 'Ensure maintainable plant rooms and service access from day one.',
    decision: 'Select equipment/route layouts that satisfy FM clearances and replacement access',
    context: 'Compare arrangements for operational practicality, safety, and future replacement paths.',
    expectations: 'Clear safe access\nFeasible replacement paths\nLower lifecycle disruption risk',
    researchNeeds: 'FM clearance dimensions\nSafety zone requirements\nReplacement path constraints',
    constraints: 'No blocked replacement path\nMaintain safety clearance\nMinimise operational conflict',
    policy: 'strict'
  },
  hschecks: {
    objective: 'Ensure submitted designs comply with health and safety requirements in drawings/BIM.',
    decision: 'Prioritise and confirm true HS non-compliances before reporting',
    context: 'Compare proposed HS features against modelled content to identify high-risk gaps.',
    expectations: 'High-risk gaps surfaced early\nLow false positives\nTraceable requirement mapping',
    researchNeeds: 'HS requirement extraction\n2D/3D feature manifestation rules\nRisk prioritisation criteria',
    constraints: 'Only raise verified non-compliances\nPrioritise fall/edge/confined-space risks\nPreserve review traceability',
    policy: 'strict'
  },
  costverify: {
    objective: 'Improve reliability of cost submissions across specs, quantities, and tender pricing.',
    decision: 'Determine which discrepancies are material and well-grounded',
    context: 'Align spec clauses, BIM quantities, and tender lines to flag omissions, duplicates, and anomalies.',
    expectations: 'Lower discrepancy risk\nTransparent quantity logic\nActionable package-level findings',
    researchNeeds: 'Measurement rules\nSpec-to-quantity mapping\nAbnormal-rate detection patterns',
    constraints: 'Respect measurement method\nAvoid unsupported anomaly claims\nPrioritise high-value packages',
    policy: 'balanced'
  },
  specdraw: {
    objective: 'Ensure specification requirements are consistently reflected in drawings/BIM.',
    decision: 'Confirm true spec-drawing mismatches before surfacing non-conformance',
    context: 'Map spec clauses to types/tags/parameters and classify critical vs minor inconsistencies.',
    expectations: 'Fewer critical mismatches\nClear clause-to-element traceability\nReduced documentation drift',
    researchNeeds: 'Spec-to-tag mapping model\nAcceptable equivalents catalogue\nCriticality classification logic',
    constraints: 'Preserve design intent context\nDo not over-flag acceptable equivalents\nRequire rule-based confirmation',
    policy: 'strict'
  },
  bca_master: {
    objective: 'Run a consolidated BCA master compliance pre-check before formal submission.',
    decision: 'Select correction options that clear highest-priority BCA non-compliances first',
    context: 'Unify key BCA checks (fire safety, egress, accessibility, buildability, structural/service coordination) into one evidence-governed pre-check.',
    expectations: 'High BCA compliance coverage\nPrioritised issue backlog\nSubmission-ready audit traceability',
    researchNeeds: 'BCA requirement extraction by domain\nCross-domain rule conflicts and precedence\nSubmission evidence packaging requirements',
    constraints: 'No unresolved critical life-safety issues\nOnly raise rule-verified findings\nPreserve traceability for officer/QP review',
    policy: 'strict'
  }
};

const RUNTIME_GUIDE_TEXT = {
  copilot: {
    title: 'VS Code Copilot (Paid)',
    body: 'Use Copilot for generation, PCA for governance/evidence/debate tracking. Model fields in this UI document your selected role strategy.'
  },
  antigravity: {
    title: 'Google Antigravity',
    body: 'Use Antigravity orchestration with PCA API/CLI gates. Keep workflow decisions auditable with framework/research/debate artifacts.'
  },
  ollama: {
    title: 'Ollama (FoC)',
    body: 'Run locally with open models. Use PCA UI/CLI for evidence and policy control while model calls run in your local environment.'
  },
  byom: {
    title: 'BYOM (OpenAI-Compatible)',
    body: 'Bring your own hosted or local endpoint and assign role-specific models. PCA tracks governance independent of provider.'
  },
  other: {
    title: 'Other Runtime',
    body: 'Use PCA as the governance shell and record runtime/model metadata for audit and reproducibility.'
  }
};

function buildCliSnippets() {
  const runtime = runtimeProvider.value;
  const sources = sourcesInput.value || textDir.value;
  const decisionText = decision.value || 'Interpret requirements';
  const contextValue = contextText.value || 'Cross-document review';
  const policyValue = policy.value || 'strict';
  const cycleCount = Math.max(1, Math.min(Number(debateCycles.value || 3), 5));
  const passStrategyValue = passStrategy.value || 'adaptive';
  const riskLevelValue = riskLevel.value || 'medium';
  const obstacleX = String(geometryObstacleX.value || '80,120').split(',').map((x) => Number(x.trim()));
  const obstacleY = String(geometryObstacleY.value || '60,90').split(',').map((y) => Number(y.trim()));

  const lines = [
    '# 1) Convert PDFs (optional if sources already prepared)',
    `npm run convert:pdf -- --input-dir "${inputDir.value}" --output-dir "${textDir.value}" --recursive true${includePrefixes.value ? ` --include-prefixes "${includePrefixes.value}"` : ''}${excludeFiles.value ? ` --exclude-files "${excludeFiles.value}"` : ''}`,
    '',
    '# 2) Framework proposal',
    `curl -X POST http://localhost:4173/api/framework-proposal -H "Content-Type: application/json" -d '{"runtimeProvider":"${runtime}","modelSelection":{"proposal":"${modelProposal.value}","critique":"${modelCritique.value}","assess":"${modelAssess.value}","notes":"${modelNotes.value}"},"mode":"discuss","decision":"${decisionText}","context":"${contextValue}","sources":"${sources}","policy":"${policyValue}"}'`,
    '',
    '# 3) Research pack',
    `curl -X POST http://localhost:4173/api/research-pack -H "Content-Type: application/json" -d '{"runtimeProvider":"${runtime}","modelSelection":{"proposal":"${modelProposal.value}","critique":"${modelCritique.value}","assess":"${modelAssess.value}"},"mode":"verify","decision":"${decisionText}","context":"${contextValue}","sources":"${sources}","policy":"${policyValue}"}'`,
    '',
    '# 4) Live debate',
    `curl -X POST http://localhost:4173/api/debate-live -H "Content-Type: application/json" -d '{"runtimeProvider":"${runtime}","modelSelection":{"proposal":"${modelProposal.value}","critique":"${modelCritique.value}","assess":"${modelAssess.value}"},"mode":"verify","decision":"${decisionText}","context":"${contextValue}","sources":"${sources}","policy":"${policyValue}","cycles":${cycleCount},"passStrategy":"${passStrategyValue}","riskLevel":"${riskLevelValue}","enableZ3GeometryCheck":${Boolean(enableZ3GeometryCheck.checked)},"geometryRoomWidth":${Number(geometryRoomWidth.value || 200)},"geometryRoomHeight":${Number(geometryRoomHeight.value || 150)},"geometryObstacleXMin":${Number.isFinite(obstacleX[0]) ? obstacleX[0] : 80},"geometryObstacleXMax":${Number.isFinite(obstacleX[1]) ? obstacleX[1] : 120},"geometryObstacleYMin":${Number.isFinite(obstacleY[0]) ? obstacleY[0] : 60},"geometryObstacleYMax":${Number.isFinite(obstacleY[1]) ? obstacleY[1] : 90},"geometryRadius":${Number(geometryRadius.value || 30)}}'`
  ];

  if (runtime === 'ollama') {
    lines.push('');
    lines.push('# Optional direct Ollama adapter run');
    lines.push(`node integrations/ollama/adapter.js verify --decision "${decisionText}" --context "${contextValue}" --model-proposal "${modelProposal.value}" --model-critic "${modelCritique.value}" --model-assess "${modelAssess.value}"`);
  }

  if (runtime === 'byom') {
    lines.push('');
    lines.push('# Optional direct BYOM adapter run');
    lines.push(`npm run adapter:byom -- verify --decision "${decisionText}" --context "${contextValue}" --model-proposal "${modelProposal.value}" --model-critic "${modelCritique.value}" --model-assess "${modelAssess.value}"`);
  }

  return lines.join('\n');
}

function renderRuntimeGuide() {
  const runtime = runtimeProvider.value;
  const active = RUNTIME_GUIDE_TEXT[runtime] || RUNTIME_GUIDE_TEXT.other;
  const cards = [
    {
      title: 'What Is This?',
      body: 'PCA is an evidence-governed decision workflow: framework proposal, research pack, debate loop, and HITL/HOTL checkpoint.'
    },
    {
      title: active.title,
      body: active.body
    },
    {
      title: 'FoC and Paid Paths',
      body: 'Paid users can choose premium runtime/model labels; FoC users can run Ollama presets or BYOM endpoints with the same governance UX.'
    }
  ];

  runtimeGuide.innerHTML = '';
  cards.forEach((card) => {
    const el = document.createElement('article');
    el.className = 'guide-item';
    const h = document.createElement('h4');
    h.textContent = card.title;
    const p = document.createElement('p');
    p.textContent = card.body;
    el.appendChild(h);
    el.appendChild(p);
    runtimeGuide.appendChild(el);
  });

  cliSnippetsView.textContent = buildCliSnippets();
}

function applyUseCaseProfile(profileKey) {
  if (!profileKey || profileKey === 'custom') return;
  const profile = USE_CASE_PROFILES[profileKey];
  if (!profile) return;

  objective.value = profile.objective;
  decision.value = profile.decision;
  contextText.value = profile.context;
  expectations.value = profile.expectations;
  researchNeeds.value = profile.researchNeeds;
  constraints.value = profile.constraints;
  policy.value = profile.policy;
  renderRuntimeGuide();
}

function setBusy(message) {
  statusEl.textContent = message;
  [btnOcr, btnConvert, btnFramework, btnResearch, btnQuality, btnEvidence, btnPipeline, btnLiveDebate].forEach((btn) => {
    btn.disabled = true;
  });
}

function clearBusy(message = 'Idle') {
  statusEl.textContent = message;
  [btnOcr, btnConvert, btnFramework, btnResearch, btnQuality, btnEvidence, btnPipeline, btnLiveDebate].forEach((btn) => {
    btn.disabled = false;
  });
}

function showResult(label, payload) {
  resultView.textContent = `${label}\n\n${JSON.stringify(payload, null, 2)}`;
}

function summarizeCorpusPreview(payload) {
  const lines = [];
  lines.push(`Source Input: ${payload.source_input || 'n/a'}`);
  lines.push(`Files Previewed: ${payload.file_count || 0}`);
  lines.push('');

  const refs = Array.isArray(payload.references) ? payload.references : [];
  const datasets = Array.isArray(payload.dataset_register) ? payload.dataset_register : [];
  lines.push(`References (${refs.length}):`);
  if (refs.length === 0) lines.push('- none');
  refs.forEach((ref) => lines.push(`- ${ref}`));
  lines.push('');

  lines.push(`Dataset Register (${datasets.length}):`);
  if (datasets.length === 0) lines.push('- none');
  datasets.forEach((item) => lines.push(`- ${item}`));
  lines.push('');

  const files = Array.isArray(payload.files) ? payload.files : [];
  files.forEach((file, idx) => {
    lines.push(`File ${idx + 1}: ${file.path}`);
    lines.push(`Size: ${file.size_bytes === null || file.size_bytes === undefined ? 'n/a' : `${file.size_bytes} bytes`}`);
    lines.push('Preview:');
    lines.push(file.preview_text || '[No preview]');
    lines.push('');
  });

  return lines.join('\n').trim();
}

async function callApi(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function refreshArtifacts() {
  const res = await fetch('/api/artifacts');
  const data = await res.json();
  artifactList.innerHTML = '';

  (data.artifacts || []).forEach((item) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const link = document.createElement('a');
    name.textContent = item.file_name;
    link.href = item.download_url;
    link.textContent = 'Download';
    li.appendChild(name);
    li.appendChild(link);
    artifactList.appendChild(li);
  });

  if (!data.artifacts || data.artifacts.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No artifacts yet.';
    artifactList.appendChild(li);
  }
}

function commonPayload() {
  const obstacleX = String(geometryObstacleX.value || '80,120').split(',').map((x) => Number(x.trim()));
  const obstacleY = String(geometryObstacleY.value || '60,90').split(',').map((y) => Number(y.trim()));
  return {
    sources: sourcesInput.value || textDir.value,
    publicReferences: publicReferences.value,
    datasetRegistry: datasetRegistry.value,
    runtimeProvider: runtimeProvider.value,
    modelSelection: {
      proposal: modelProposal.value,
      critique: modelCritique.value,
      assess: modelAssess.value,
      notes: modelNotes.value
    },
    objective: objective.value,
    expectations: expectations.value,
    researchNeeds: researchNeeds.value,
    constraints: constraints.value,
    activeSearchEnabled: Boolean(activeSearchEnabled.checked),
    passStrategy: passStrategy.value,
    riskLevel: riskLevel.value,
    enableZ3GeometryCheck: Boolean(enableZ3GeometryCheck.checked),
    geometryRoomWidth: Number(geometryRoomWidth.value || 200),
    geometryRoomHeight: Number(geometryRoomHeight.value || 150),
    geometryObstacleXMin: Number.isFinite(obstacleX[0]) ? obstacleX[0] : 80,
    geometryObstacleXMax: Number.isFinite(obstacleX[1]) ? obstacleX[1] : 120,
    geometryObstacleYMin: Number.isFinite(obstacleY[0]) ? obstacleY[0] : 60,
    geometryObstacleYMax: Number.isFinite(obstacleY[1]) ? obstacleY[1] : 90,
    geometryRadius: Number(geometryRadius.value || 30),
    maxFiles: Number(maxFiles.value || 200),
    minSources: Number(minSources.value || 2),
    minTotalClaims: Number(minClaims.value || 6)
  };
}

function parseLineList(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderInputRegistry() {
  inputRegistryView.textContent = JSON.stringify({
    public_references: parseLineList(publicReferences.value),
    user_datasets: parseLineList(datasetRegistry.value),
    sources_used: sourcesInput.value || textDir.value,
    runtime_provider: runtimeProvider.value,
    model_selection: {
      proposal: modelProposal.value,
      critique: modelCritique.value,
      assess: modelAssess.value
    }
  }, null, 2);
}

btnFramework.addEventListener('click', async () => {
  try {
    setBusy('Building objective-driven framework proposal...');
    const data = await callApi('/api/framework-proposal', {
      ...commonPayload(),
      decision: decision.value,
      context: contextText.value,
      policy: policy.value,
      mode: 'discuss',
      maxCycles: Math.max(1, Math.min(Number(debateCycles.value || 3), 5)),
      prioritizeRequirements: true,
      minAvgClaimsPerDoc: 2
    });

    if (data.result && data.result.framework) {
      frameworkView.textContent = JSON.stringify(data.result.framework, null, 2);
    }
    if (data.result && data.result.verification_plan) {
      scoringView.textContent = JSON.stringify({
        verification_plan: data.result.verification_plan,
        active_ai_search_plan: data.result.active_ai_search_plan || null,
        data_inputs: data.result.data_inputs || null,
        selected_sources_hint: commonPayload().sources
      }, null, 2);
    }

    showResult('Framework Proposal Completed', data);
    await refreshArtifacts();
    clearBusy('Framework proposal complete');
  } catch (error) {
    showResult('Framework Proposal Error', { error: error.message });
    clearBusy('Framework proposal failed');
  }
});

btnResearch.addEventListener('click', async () => {
  try {
    setBusy('Running research pack (quality + evidence + synthesis)...');
    const data = await callApi('/api/research-pack', {
      ...commonPayload(),
      decision: decision.value,
      context: contextText.value,
      policy: policy.value,
      mode: 'verify',
      prioritizeRequirements: true,
      minAvgClaimsPerDoc: 2
    });

    if (data.result && data.result.research_synthesis) {
      scoringView.textContent = JSON.stringify(data.result.research_synthesis, null, 2);
    }

    if (data.result && data.result.evidence_check && data.result.evidence_check.evidence) {
      appendDebateEvent(
        'Dataset Selection',
        `Research used ${data.result.evidence_check.evidence.source_count} sources from: ${commonPayload().sources}`,
        'neutral'
      );
    }

    appendDebateEvent(
      'Research Pack Completed',
      data.result && data.result.process_quality
        ? data.result.process_quality.recommendation
        : 'Research synthesis completed.',
      'ok'
    );

    showResult('Research Pack Completed', data);
    await refreshArtifacts();
    clearBusy('Research pack complete');
  } catch (error) {
    showResult('Research Pack Error', { error: error.message });
    clearBusy('Research pack failed');
  }
});

function resetDebateTimeline() {
  debateTimeline.innerHTML = '';
  const li = document.createElement('li');
  li.className = 'timeline-empty';
  li.textContent = 'Starting live debate...';
  debateTimeline.appendChild(li);
  debateState.textContent = 'Running';
  humanCheckpoint.classList.add('hidden');
  checkpointDecision.textContent = '';
  checkpointReason.textContent = '';
  frameworkView.textContent = 'Framework loading...';
  scoringView.textContent = 'Scoring pending cycle assessments...';
}

function appendDebateEvent(eventLabel, details, tone = 'neutral') {
  if (debateTimeline.querySelector('.timeline-empty')) {
    debateTimeline.innerHTML = '';
  }
  const li = document.createElement('li');
  li.className = `timeline-item ${tone}`;

  const title = document.createElement('div');
  title.className = 'timeline-title';
  title.textContent = eventLabel;

  const text = document.createElement('div');
  text.className = 'timeline-details';
  text.textContent = details;

  li.appendChild(title);
  li.appendChild(text);
  debateTimeline.appendChild(li);
  debateTimeline.scrollTop = debateTimeline.scrollHeight;
}

function parseSseChunk(raw) {
  const lines = raw.split('\n').map((line) => line.trimEnd());
  let event = 'message';
  const dataLines = [];
  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  let data = {};
  const merged = dataLines.join('\n');
  if (merged) {
    try {
      data = JSON.parse(merged);
    } catch (_error) {
      data = { message: merged };
    }
  }
  return { event, data };
}

function renderStepEvent(step) {
  if (step.stage === 'propose') {
    appendDebateEvent(
      `Cycle ${step.cycle} - Propose`,
      step.proposal || 'Proposal prepared.',
      'propose'
    );
    return;
  }

  if (step.stage === 'critique') {
    const risks = Array.isArray(step.extracted_risk_flags) && step.extracted_risk_flags.length > 0
      ? ` Risks: ${step.extracted_risk_flags.join(', ')}.`
      : ' Risks: none extracted.';
    appendDebateEvent(
      `Cycle ${step.cycle} - Critique`,
      `${step.critique || 'Critique completed.'}${risks}`,
      'critique'
    );
    return;
  }

  if (step.stage === 'assess') {
    const control = step.human_control && step.human_control.recommended_mode
      ? step.human_control.recommended_mode
      : 'unknown';
    const score = step.scoring || {};
    const scoreText = score.weighted_score_100 === null || score.weighted_score_100 === undefined
      ? 'score n/a'
      : `score ${score.weighted_score_100}/100`;
    const coverageText = score.coverage_ratio === null || score.coverage_ratio === undefined
      ? 'coverage n/a'
      : `coverage ${Math.round(score.coverage_ratio * 100)}% (${score.coverage_provided}/${score.coverage_total})`;
    const deltaText = score.delta_weighted_score_100 === null || score.delta_weighted_score_100 === undefined
      ? 'delta n/a'
      : `delta ${score.delta_weighted_score_100 > 0 ? '+' : ''}${score.delta_weighted_score_100}`;

    appendDebateEvent(
      `Cycle ${step.cycle} - Assess`,
      `Verdict: ${step.verdict || 'unknown'}. Human control: ${control}. ${scoreText}, ${coverageText}, ${deltaText}.`,
      'assess'
    );

    if (step.verify_gates) {
      appendDebateEvent(
        `Cycle ${step.cycle} - Verify Gates`,
        `Score ${step.verify_gates.checks && step.verify_gates.checks.score_passed ? 'pass' : 'fail'}, Coverage ${step.verify_gates.checks && step.verify_gates.checks.coverage_passed ? 'pass' : 'fail'}, Risk ${step.verify_gates.checks && step.verify_gates.checks.risk_passed ? 'pass' : 'fail'}.`,
        step.verify_gates.all_passed ? 'ok' : 'warn'
      );
    }

    scoringView.textContent = JSON.stringify({
      latest_cycle: step.cycle,
      scoring: step.scoring || null,
      score_summary: step.score_summary || null
    }, null, 2);
  }
}

async function runLiveDebate() {
  setBusy('Running live debate (3 cycles)...');
  resetDebateTimeline();

  try {
    const res = await fetch('/api/debate-live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...commonPayload(),
        decision: decision.value,
        context: contextText.value,
        policy: policy.value,
        prioritizeRequirements: true,
        mode: 'verify',
        cycles: Math.max(1, Math.min(Number(debateCycles.value || 3), 5))
      })
    });

    if (!res.ok) {
      const errPayload = await res.json();
      throw new Error(errPayload.error || 'Live debate request failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalPayload = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      chunks.forEach((chunk) => {
        const parsed = parseSseChunk(chunk);
        const evt = parsed.event;
        const data = parsed.data;

        if (evt === 'start') {
          appendDebateEvent('Debate Started', data.message || 'Live debate has started.', 'neutral');
          return;
        }

        if (evt === 'cycle-start') {
          appendDebateEvent(`Cycle ${data.cycle}/${data.total_cycles}`, data.message || 'Cycle started.', 'neutral');
          return;
        }

        if (evt === 'framework') {
          frameworkView.textContent = JSON.stringify(data, null, 2);
          appendDebateEvent('Framework Loaded', 'Assessment framework, topology, and governance policy loaded.', 'neutral');
          return;
        }

        if (evt === 'model-selection') {
          appendDebateEvent(
            'Model Selection',
            `Proposal: ${data.proposal || 'n/a'}, Critique: ${data.critique || 'n/a'}, Assess: ${data.assess || 'n/a'}`,
            'neutral'
          );
          return;
        }

        if (evt === 'z3-geometry') {
          if (data.enabled) {
            appendDebateEvent(
              'Z3 Geometry Check',
              `Status: ${data.status}. ${data.center ? `Center=(${data.center.x}, ${data.center.y})` : (data.error || 'No feasible placement found.')}`,
              data.passed ? 'ok' : 'warn'
            );
          }
          return;
        }

        if (evt === 'adaptive-plan') {
          appendDebateEvent(
            'Adaptive Plan',
            `Strategy: ${data.strategy || 'n/a'}, risk: ${data.risk_level || 'n/a'}, selected cycles: ${data.selected_cycles || 'n/a'} (${data.reason || 'no reason'}).`,
            'neutral'
          );
          return;
        }

        if (evt === 'dataset-selection') {
          appendDebateEvent(
            'Dataset Selection',
            `Using ${data.source_count} source files (selected ${data.selected_files}/${data.discovered_files}). Preview: ${(data.source_preview || []).join(', ') || 'n/a'}`,
            'neutral'
          );
          return;
        }

        if (evt === 'step') {
          renderStepEvent(data);
          return;
        }

        if (evt === 'artifact') {
          appendDebateEvent('Artifact Saved', data.file_name || 'Live debate artifact saved.', 'neutral');
          return;
        }

        if (evt === 'final') {
          finalPayload = data;
          const checkpoint = data.human_checkpoint || {};
          humanCheckpoint.classList.remove('hidden');
          checkpointDecision.textContent = checkpoint.decision || 'Decision unavailable';
          checkpointReason.textContent = checkpoint.reason || 'No reason provided.';
          if (data.framework) {
            frameworkView.textContent = JSON.stringify(data.framework, null, 2);
          }
          if (data.scoring) {
            scoringView.textContent = JSON.stringify(data.scoring, null, 2);
          }
          if (data.verify_gates) {
            appendDebateEvent(
              'Final Verify Gates',
              `All passed: ${Boolean(data.verify_gates.all_passed)}. Thresholds score>=${data.verify_gates.thresholds ? data.verify_gates.thresholds.min_weighted_score_100 : 'n/a'}, coverage>=${data.verify_gates.thresholds ? data.verify_gates.thresholds.min_coverage_ratio : 'n/a'}.`,
              data.verify_gates.all_passed ? 'ok' : 'warn'
            );
          }
          if (data.route_recommendation) {
            appendDebateEvent(
              'Route Recommendation',
              `${data.route_recommendation.recommended_mode || 'n/a'} - ${data.route_recommendation.reason || 'No reason provided.'}`,
              data.route_recommendation.recommended_mode === 'HOTL' ? 'ok' : 'warn'
            );
          }
          if (data.model_selection) {
            appendDebateEvent(
              'Models Used',
              `Proposal ${data.model_selection.proposal || 'n/a'} | Critique ${data.model_selection.critique || 'n/a'} | Assess ${data.model_selection.assess || 'n/a'}`,
              'neutral'
            );
          }
          if (data.dataset_selection) {
            appendDebateEvent(
              'Dataset Used',
              `Selected ${data.dataset_selection.selected_files}/${data.dataset_selection.discovered_files} files. Input: ${data.dataset_selection.input_sources || 'n/a'}`,
              'neutral'
            );
          }
          appendDebateEvent('Final Recommendation', checkpoint.decision || 'Recommendation ready.', checkpoint.required ? 'warn' : 'ok');
          debateState.textContent = 'Completed';
          return;
        }

        if (evt === 'error') {
          appendDebateEvent('Debate Error', data.error || 'Unexpected error', 'warn');
          debateState.textContent = 'Failed';
          return;
        }

        if (evt === 'done') {
          appendDebateEvent('Debate Finished', data.message || 'Live debate finished.', 'ok');
        }
      });
    }

    showResult('Live Debate Completed', finalPayload || { message: 'No final payload returned' });
    await refreshArtifacts();
    clearBusy('Live debate complete');
  } catch (error) {
    debateState.textContent = 'Failed';
    appendDebateEvent('Debate Error', error.message, 'warn');
    showResult('Live Debate Error', { error: error.message });
    clearBusy('Live debate failed');
  }
}

btnOcr.addEventListener('click', async () => {
  try {
    setBusy('Running OCR preprocess...');
    const data = await callApi('/api/ocr-pdf', {
      runtimeProvider: runtimeProvider.value,
      publicReferences: publicReferences.value,
      datasetRegistry: datasetRegistry.value,
      inputDir: inputDir.value,
      outputDir: ocrDir.value,
      recursive: true,
      language: 'eng',
      skipText: true
    });
    showResult('OCR Completed', data);
    await refreshArtifacts();
    clearBusy('OCR complete');
  } catch (error) {
    showResult('OCR Error', { error: error.message });
    clearBusy('OCR failed');
  }
});

btnConvert.addEventListener('click', async () => {
  try {
    setBusy('Converting PDF to text...');
    const data = await callApi('/api/convert-pdf', {
      runtimeProvider: runtimeProvider.value,
      publicReferences: publicReferences.value,
      datasetRegistry: datasetRegistry.value,
      inputDir: inputDir.value,
      outputDir: textDir.value,
      includePrefixes: includePrefixes.value,
      excludeFiles: excludeFiles.value,
      recursive: true
    });
    showResult('Conversion Completed', data);
    await refreshArtifacts();
    clearBusy('Conversion complete');
  } catch (error) {
    showResult('Conversion Error', { error: error.message });
    clearBusy('Conversion failed');
  }
});

btnPreviewCorpus.addEventListener('click', async () => {
  try {
    setBusy('Loading corpus preview...');
    const data = await callApi('/api/corpus-preview', {
      sources: sourcesInput.value || textDir.value,
      textDir: textDir.value,
      inputDir: inputDir.value,
      publicReferences: publicReferences.value,
      datasetRegistry: datasetRegistry.value,
      maxFiles: 8,
      maxChars: 1200
    });

    corpusPreviewView.textContent = summarizeCorpusPreview(data);
    showResult('Corpus Preview Loaded', data);
    clearBusy('Corpus preview loaded');
  } catch (error) {
    corpusPreviewView.textContent = `Corpus preview failed: ${error.message}`;
    showResult('Corpus Preview Error', { error: error.message });
    clearBusy('Corpus preview failed');
  }
});

btnQuality.addEventListener('click', async () => {
  try {
    setBusy('Running quality check...');
    const data = await callApi('/api/quality-check', {
      ...commonPayload(),
      minAvgClaimsPerDoc: 2,
      prioritizeRequirements: true
    });
    showResult('Quality Check Completed', data);
    await refreshArtifacts();
    clearBusy('Quality check complete');
  } catch (error) {
    showResult('Quality Check Error', { error: error.message });
    clearBusy('Quality check failed');
  }
});

btnEvidence.addEventListener('click', async () => {
  try {
    setBusy('Running evidence check...');
    const data = await callApi('/api/evidence-check', {
      ...commonPayload(),
      decision: decision.value,
      context: contextText.value,
      policy: policy.value,
      prioritizeRequirements: true,
      mode: 'verify'
    });
    showResult('Evidence Check Completed', data);
    await refreshArtifacts();
    clearBusy('Evidence check complete');
  } catch (error) {
    showResult('Evidence Check Error', { error: error.message });
    clearBusy('Evidence check failed');
  }
});

btnPipeline.addEventListener('click', async () => {
  setBusy('Pipeline: Input -> Process -> Output ...');
  resetDebateTimeline();

  try {
    const res = await fetch('/api/run-pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...commonPayload(),
        decision: decision.value,
        context: contextText.value,
        policy: policy.value,
        mode: 'verify',
        cycles: Math.max(1, Math.min(Number(debateCycles.value || 3), 5)),
        prioritizeRequirements: true,
        minAvgClaimsPerDoc: 2
      })
    });

    if (!res.ok) {
      const errPayload = await res.json();
      throw new Error(errPayload.error || 'Pipeline request failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalPayload = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      chunks.forEach((chunk) => {
        const parsed = parseSseChunk(chunk);
        const evt = parsed.event;
        const data = parsed.data;

        if (evt === 'start') {
          appendDebateEvent('Pipeline Started', `Run ID: ${data.run_id || 'n/a'}`, 'neutral');
          return;
        }

        if (evt === 'stage') {
          const tone = data.status === 'blocked' ? 'warn' : (data.status === 'completed' || data.status === 'ready' ? 'ok' : 'neutral');
          appendDebateEvent(
            `Stage ${data.stage}`,
            `${data.status}: ${data.detail || 'No details.'}`,
            tone
          );
          return;
        }

        if (evt === 'artifact') {
          appendDebateEvent('Pipeline Artifact Saved', data.file_name || 'Artifact saved.', 'ok');
          return;
        }

        if (evt === 'final') {
          finalPayload = data;
          if (data.output && data.output.recommend && data.output.recommend.verify_gates) {
            scoringView.textContent = JSON.stringify(data.output.recommend.verify_gates, null, 2);
          }
          if (data.process && data.process.organize && data.process.organize.framework) {
            frameworkView.textContent = JSON.stringify(data.process.organize.framework, null, 2);
          }
          if (data.output && data.output.route) {
            const route = data.output.route;
            humanCheckpoint.classList.remove('hidden');
            checkpointDecision.textContent = `Route: ${route.recommended_mode || 'n/a'}`;
            checkpointReason.textContent = route.reason || 'No route reason provided.';
          }
          return;
        }

        if (evt === 'error') {
          appendDebateEvent('Pipeline Error', data.error || 'Unexpected pipeline error', 'warn');
          debateState.textContent = 'Failed';
          return;
        }

        if (evt === 'done') {
          appendDebateEvent('Pipeline Finished', data.message || 'Pipeline run finished.', 'ok');
          debateState.textContent = 'Completed';
        }
      });
    }

    showResult('Pipeline Completed', finalPayload || { message: 'No final payload returned' });
    await refreshArtifacts();
    clearBusy('Pipeline complete');
  } catch (error) {
    debateState.textContent = 'Failed';
    appendDebateEvent('Pipeline Error', error.message, 'warn');
    showResult('Pipeline Error', { error: error.message });
    clearBusy('Pipeline failed');
  }
});

btnLiveDebate.addEventListener('click', runLiveDebate);

btnRefreshArtifacts.addEventListener('click', refreshArtifacts);

refreshArtifacts().catch((error) => {
  showResult('Artifact Load Error', { error: error.message });
});

[
  useCaseProfile,
  runtimeProvider,
  publicReferences,
  datasetRegistry,
  modelProposal,
  modelCritique,
  modelAssess,
  modelNotes,
  sourcesInput,
  inputDir,
  textDir,
  includePrefixes,
  excludeFiles,
  decision,
  contextText,
  policy,
  debateCycles,
  passStrategy,
  riskLevel,
  enableZ3GeometryCheck,
  geometryRoomWidth,
  geometryRoomHeight,
  geometryObstacleX,
  geometryObstacleY,
  geometryRadius
].forEach((el) => {
  el.addEventListener('input', renderRuntimeGuide);
  el.addEventListener('change', renderRuntimeGuide);
  el.addEventListener('input', renderInputRegistry);
  el.addEventListener('change', renderInputRegistry);
});

useCaseProfile.addEventListener('change', () => {
  applyUseCaseProfile(useCaseProfile.value);
});

renderRuntimeGuide();
renderInputRegistry();
