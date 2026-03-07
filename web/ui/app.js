const statusEl = document.getElementById('status');
const statusRuntime = document.getElementById('statusRuntime');
const statusDraft = document.getElementById('statusDraft');
const statusArtifacts = document.getElementById('statusArtifacts');
const resultView = document.getElementById('resultView');
const outcomeSummaryView = document.getElementById('outcomeSummaryView');
const throughputRequest = document.getElementById('throughputRequest');
const throughputRoute = document.getElementById('throughputRoute');
const throughputNextMove = document.getElementById('throughputNextMove');
const throughputShowcase = document.getElementById('throughputShowcase');
const throughputFlowStateLabel = document.getElementById('throughputFlowState');
const throughputFlow = document.getElementById('throughputFlow');
const throughputDashboardState = document.getElementById('throughputDashboardState');
const dashboardScoreValue = document.getElementById('dashboardScoreValue');
const dashboardScoreFill = document.getElementById('dashboardScoreFill');
const dashboardCoverageValue = document.getElementById('dashboardCoverageValue');
const dashboardCoverageFill = document.getElementById('dashboardCoverageFill');
const dashboardRiskValue = document.getElementById('dashboardRiskValue');
const dashboardRiskFill = document.getElementById('dashboardRiskFill');
const dashboardSourcesValue = document.getElementById('dashboardSourcesValue');
const dashboardArtifactsValue = document.getElementById('dashboardArtifactsValue');
const dashboardRuntimeValue = document.getElementById('dashboardRuntimeValue');
const throughputCycleState = document.getElementById('throughputCycleState');
const throughputCycleChart = document.getElementById('throughputCycleChart');
const stageProposeState = document.getElementById('stageProposeState');
const stageProposeSummary = document.getElementById('stageProposeSummary');
const stageProposeActivities = document.getElementById('stageProposeActivities');
const stageCritiqueState = document.getElementById('stageCritiqueState');
const stageCritiqueSummary = document.getElementById('stageCritiqueSummary');
const stageCritiqueActivities = document.getElementById('stageCritiqueActivities');
const stageAssessState = document.getElementById('stageAssessState');
const stageAssessSummary = document.getElementById('stageAssessSummary');
const stageAssessActivities = document.getElementById('stageAssessActivities');
const stageGovernorState = document.getElementById('stageGovernorState');
const stageGovernorSummary = document.getElementById('stageGovernorSummary');
const stageGovernorActivities = document.getElementById('stageGovernorActivities');
const artifactList = document.getElementById('artifactList');
const draftStatus = document.getElementById('draftStatus');
const useCaseHub = document.getElementById('useCaseHub');
const selectedUseCaseNote = document.getElementById('selectedUseCaseNote');
const quickInputBar = document.getElementById('quickInputBar');
const quickInputStatus = document.getElementById('quickInputStatus');
const composerStatusRuntime = document.getElementById('composerStatusRuntime');
const composerStatusModels = document.getElementById('composerStatusModels');
const composerStatusCycles = document.getElementById('composerStatusCycles');
const composerStatusGovernor = document.getElementById('composerStatusGovernor');
const composerChips = Array.from(document.querySelectorAll('.composer-chip'));
const missionRunState = document.getElementById('missionRunState');
const missionActiveSection = document.getElementById('missionActiveSection');
const metricUseCase = document.getElementById('metricUseCase');
const metricObjective = document.getElementById('metricObjective');
const metricRuntime = document.getElementById('metricRuntime');
const metricModels = document.getElementById('metricModels');
const metricCollaboration = document.getElementById('metricCollaboration');
const metricTopics = document.getElementById('metricTopics');
const metricSources = document.getElementById('metricSources');
const metricEvidenceDetail = document.getElementById('metricEvidenceDetail');
const metricArtifacts = document.getElementById('metricArtifacts');
const metricArtifactsDetail = document.getElementById('metricArtifactsDetail');
const metricDraft = document.getElementById('metricDraft');
const metricDraftDetail = document.getElementById('metricDraftDetail');

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
const collaborationMode = document.getElementById('collaborationMode');
const userRequests = document.getElementById('userRequests');
const openTopics = document.getElementById('openTopics');
const continuationNotes = document.getElementById('continuationNotes');
const activeSearchEnabled = document.getElementById('activeSearchEnabled');
const policy = document.getElementById('policy');
const runtimeProvider = document.getElementById('runtimeProvider');
const runtimeModeTitle = document.getElementById('runtimeModeTitle');
const runtimeModeBadge = document.getElementById('runtimeModeBadge');
const runtimeModeBody = document.getElementById('runtimeModeBody');
const runtimeModeHint = document.getElementById('runtimeModeHint');
const taskMode = document.getElementById('taskMode');
const executionMode = document.getElementById('executionMode');
const executionModeNote = document.getElementById('executionModeNote');
const byomConfig = document.getElementById('byomConfig');
const byomProviderType = document.getElementById('byomProviderType');
const byomEndpoint = document.getElementById('byomEndpoint');
const byomApiKey = document.getElementById('byomApiKey');
const byomTemperature = document.getElementById('byomTemperature');
const byomCompatibilityNote = document.getElementById('byomCompatibilityNote');
const modelPack = document.getElementById('modelPack');
const modelPackNote = document.getElementById('modelPackNote');
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
const btnSaveDraft = document.getElementById('btnSaveDraft');
const btnRestoreDraft = document.getElementById('btnRestoreDraft');
const btnClearDraft = document.getElementById('btnClearDraft');
const btnContinueSession = document.getElementById('btnContinueSession');
const btnQueueRequest = document.getElementById('btnQueueRequest');
const btnQueueTopic = document.getElementById('btnQueueTopic');
const btnRunFromBar = document.getElementById('btnRunFromBar');
const btnMissionFramework = document.getElementById('btnMissionFramework');
const btnMissionResearch = document.getElementById('btnMissionResearch');
const btnMissionEvidence = document.getElementById('btnMissionEvidence');
const btnMissionDebate = document.getElementById('btnMissionDebate');
const btnMissionPipeline = document.getElementById('btnMissionPipeline');

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
const themePreset = document.getElementById('themePreset');
const themePreviewGrid = document.getElementById('themePreviewGrid');
const themeBg = document.getElementById('themeBg');
const themeCard = document.getElementById('themeCard');
const themeCardAlpha = document.getElementById('themeCardAlpha');
const themeCardAlphaValue = document.getElementById('themeCardAlphaValue');
const themeInnerAlpha = document.getElementById('themeInnerAlpha');
const themeInnerAlphaValue = document.getElementById('themeInnerAlphaValue');
const themeInk = document.getElementById('themeInk');
const themeFontSans = document.getElementById('themeFontSans');
const themeFontMono = document.getElementById('themeFontMono');
const themeLine = document.getElementById('themeLine');
const themeAccent = document.getElementById('themeAccent');
const themeAccent2 = document.getElementById('themeAccent2');
const themeMuted = document.getElementById('themeMuted');
const themeBgStart = document.getElementById('themeBgStart');
const themeBgEnd = document.getElementById('themeBgEnd');
const themeGradientAngle = document.getElementById('themeGradientAngle');
const themeGradientAngleValue = document.getElementById('themeGradientAngleValue');

const inputDirSelect = document.getElementById('inputDirSelect');
const ocrDirSelect = document.getElementById('ocrDirSelect');
const textDirSelect = document.getElementById('textDirSelect');
const includePrefixesSelect = document.getElementById('includePrefixesSelect');
const excludeFilesSelect = document.getElementById('excludeFilesSelect');
const sourcesInputSelect = document.getElementById('sourcesInputSelect');

const CUSTOM_OPTION_VALUE = '__custom__';
const PARENT_OPTION_VALUE = '__parent__';
const UI_DRAFT_STORAGE_KEY = 'pca-ui-draft-v1';

let draftSaveTimer = null;
let artifactCount = 0;
let throughputActivitiesState = [];
let cycleSnapshotsState = [];
let processFlowState = {
  input: { status: 'idle', detail: 'Waiting for input capture.' },
  organize: { status: 'idle', detail: 'Waiting for framework planning.' },
  test: { status: 'idle', detail: 'Waiting for research synthesis.' },
  verify: { status: 'idle', detail: 'Waiting for verification.' },
  recommend: { status: 'idle', detail: 'Waiting for recommendation.' },
  route: { status: 'idle', detail: 'Waiting for route decision.' },
  implement: { status: 'idle', detail: 'Waiting for implementation posture.' }
};
let roleStageState = {
  propose: { state: 'Idle', summary: 'No proposal activity yet.', activities: [] },
  critique: { state: 'Idle', summary: 'No critique activity yet.', activities: [] },
  assess: { state: 'Idle', summary: 'No assessment activity yet.', activities: [] },
  governor: { state: 'Idle', summary: 'No governance route yet.', activities: [] }
};

const PROCESS_FLOW_STEPS = [
  { key: 'input', label: 'Input' },
  { key: 'organize', label: 'Framework' },
  { key: 'test', label: 'Research' },
  { key: 'verify', label: 'Verify' },
  { key: 'recommend', label: 'Recommend' },
  { key: 'route', label: 'Route' },
  { key: 'implement', label: 'Implement' }
];

const ROLE_STAGE_ELEMENTS = {
  propose: {
    stateEl: stageProposeState,
    summaryEl: stageProposeSummary,
    listEl: stageProposeActivities,
    empty: 'Waiting for proposal activity.'
  },
  critique: {
    stateEl: stageCritiqueState,
    summaryEl: stageCritiqueSummary,
    listEl: stageCritiqueActivities,
    empty: 'Waiting for critique activity.'
  },
  assess: {
    stateEl: stageAssessState,
    summaryEl: stageAssessSummary,
    listEl: stageAssessActivities,
    empty: 'Waiting for assessment activity.'
  },
  governor: {
    stateEl: stageGovernorState,
    summaryEl: stageGovernorSummary,
    listEl: stageGovernorActivities,
    empty: 'Waiting for verify gates and route activity.'
  }
};

function truncateText(value, maxLength = 92) {
  const text = String(value || '').trim();
  if (!text) return 'n/a';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function sentenceCase(value) {
  const text = String(value || '').trim();
  if (!text) return 'Idle';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderProcessFlow() {
  if (!throughputFlow) return;
  throughputFlow.innerHTML = '';
  PROCESS_FLOW_STEPS.forEach((step) => {
    const state = processFlowState[step.key] || { status: 'idle', detail: '' };
    const node = document.createElement('article');
    node.className = `flow-step ${state.status || 'idle'}`;
    const label = document.createElement('span');
    label.className = 'flow-step-label';
    label.textContent = step.label;
    const status = document.createElement('span');
    status.className = 'flow-step-state';
    status.textContent = sentenceCase(state.status || 'idle');
    node.title = state.detail || step.label;
    node.appendChild(label);
    node.appendChild(status);
    throughputFlow.appendChild(node);
  });
}

function setProcessFlowStep(stepKey, status, detail) {
  if (!processFlowState[stepKey]) return;
  processFlowState[stepKey] = {
    status: status || processFlowState[stepKey].status,
    detail: detail || processFlowState[stepKey].detail
  };
  renderProcessFlow();
}

function updateFlowFromPipelineStage(stage, status, detail) {
  const map = {
    input: 'input',
    'process.organize': 'organize',
    'process.test': 'test',
    'process.verify': 'verify',
    'output.recommend': 'recommend',
    'output.route': 'route',
    'output.implement': 'implement'
  };
  const key = map[stage];
  if (!key) return;
  setProcessFlowStep(key, status, detail);
  if (throughputFlowStateLabel) {
    throughputFlowStateLabel.textContent = `${sentenceCase(key)} ${status}`;
  }
}

function setProcessFlowFromDebateEvent(type, data = {}) {
  if (type === 'start') {
    setProcessFlowStep('input', 'running', 'Preparing debate input and live context.');
  }
  if (type === 'framework') {
    setProcessFlowStep('input', 'completed', 'Input and context captured for the live run.');
    setProcessFlowStep('organize', 'completed', 'Framework and governance policy loaded.');
  }
  if (type === 'dataset-selection') {
    setProcessFlowStep('test', 'completed', `Dataset selected with ${data.source_count || 0} sources.`);
  }
  if (type === 'step' && data.stage === 'assess') {
    setProcessFlowStep('verify', data.verify_gates && data.verify_gates.all_passed ? 'completed' : 'running', 'Assessment and verify gate state updated.');
    setProcessFlowStep('recommend', 'completed', `Verdict: ${data.verdict || 'unknown'}.`);
  }
  if (type === 'final') {
    const route = data.route_recommendation || {};
    const gatesPassed = data.verify_gates && data.verify_gates.all_passed;
    setProcessFlowStep('verify', gatesPassed ? 'completed' : 'blocked', gatesPassed ? 'Verify gates passed.' : 'Verify gates remain open.');
    setProcessFlowStep('recommend', 'completed', 'Final recommendation assembled.');
    setProcessFlowStep('route', route.recommended_mode === 'HOTL' ? 'completed' : 'blocked', route.reason || 'Route updated.');
    setProcessFlowStep('implement', data.human_checkpoint && data.human_checkpoint.required ? 'pending' : 'ready', data.human_checkpoint ? data.human_checkpoint.reason : 'Implementation posture updated.');
    if (throughputFlowStateLabel) {
      throughputFlowStateLabel.textContent = route.recommended_mode || 'completed';
    }
  }
}

function renderCycleChart() {
  if (!throughputCycleChart) return;
  throughputCycleChart.innerHTML = '';
  if (!cycleSnapshotsState.length) {
    const empty = document.createElement('div');
    empty.className = 'cycle-chart-empty';
    empty.textContent = 'Cycle scores and coverage will render here during live runs.';
    throughputCycleChart.appendChild(empty);
    return;
  }
  cycleSnapshotsState.forEach((snapshot, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cycle-bar';
    const stack = document.createElement('div');
    stack.className = 'cycle-bar-stack';
    const scoreBar = document.createElement('span');
    scoreBar.className = 'cycle-bar-score';
    scoreBar.style.height = `${Math.max(6, Math.min(Number(snapshot.score) || 0, 100))}%`;
    const coverageBar = document.createElement('span');
    coverageBar.className = 'cycle-bar-coverage';
    coverageBar.style.height = `${Math.max(6, Math.min(Number(snapshot.coverage) || 0, 100))}%`;
    stack.appendChild(scoreBar);
    stack.appendChild(coverageBar);
    const label = document.createElement('div');
    label.className = 'cycle-bar-label';
    label.textContent = snapshot.label || `C${index + 1}`;
    wrapper.appendChild(stack);
    wrapper.appendChild(label);
    throughputCycleChart.appendChild(wrapper);
  });
}

function setCycleSnapshots(snapshots, stateLabel = 'live') {
  cycleSnapshotsState = Array.isArray(snapshots) ? snapshots : [];
  if (throughputCycleState) {
    throughputCycleState.textContent = stateLabel;
  }
  renderCycleChart();
}

function resetVisualDashboards() {
  processFlowState = {
    input: { status: 'queued', detail: 'Waiting for input capture.' },
    organize: { status: 'idle', detail: 'Waiting for framework planning.' },
    test: { status: 'idle', detail: 'Waiting for research synthesis.' },
    verify: { status: 'idle', detail: 'Waiting for verification.' },
    recommend: { status: 'idle', detail: 'Waiting for recommendation.' },
    route: { status: 'idle', detail: 'Waiting for route decision.' },
    implement: { status: 'idle', detail: 'Waiting for implementation posture.' }
  };
  renderProcessFlow();
  if (throughputFlowStateLabel) {
    throughputFlowStateLabel.textContent = 'run queued';
  }
  if (throughputDashboardState) {
    throughputDashboardState.textContent = 'live metrics';
  }
  if (dashboardScoreValue) dashboardScoreValue.textContent = '0 / 100';
  if (dashboardScoreFill) dashboardScoreFill.style.width = '0%';
  if (dashboardCoverageValue) dashboardCoverageValue.textContent = '0%';
  if (dashboardCoverageFill) dashboardCoverageFill.style.width = '0%';
  if (dashboardRiskValue) dashboardRiskValue.textContent = '0 flags';
  if (dashboardRiskFill) dashboardRiskFill.style.width = '0%';
  if (dashboardSourcesValue) dashboardSourcesValue.textContent = '0';
  if (dashboardArtifactsValue) dashboardArtifactsValue.textContent = String(artifactCount);
  if (dashboardRuntimeValue) dashboardRuntimeValue.textContent = runtimeProvider.value;
  setCycleSnapshots([], 'awaiting signal');
}

function updateVisualDashboards(payload) {
  const { envelope, route, verifyGates, scoreSummary } = extractRunEnvelope(payload);
  const riskFlags = Array.isArray(envelope.risk_flags)
    ? envelope.risk_flags
    : (envelope.final_assessment && Array.isArray(envelope.final_assessment.risk_flags)
      ? envelope.final_assessment.risk_flags
      : (payload && payload.output && payload.output.recommend && payload.output.recommend.assessment && Array.isArray(payload.output.recommend.assessment.risk_flags)
        ? payload.output.recommend.assessment.risk_flags
        : []));
  const evidenceSourceCount = envelope.dataset_selection && envelope.dataset_selection.source_count
    ? envelope.dataset_selection.source_count
    : (payload && payload.process && payload.process.verify && payload.process.verify.evidence
      ? payload.process.verify.evidence.source_count || 0
      : (envelope.evidence && envelope.evidence.source_count ? envelope.evidence.source_count : 0));
  const weightedScore = scoreSummary && scoreSummary.weighted_score_100 !== undefined && scoreSummary.weighted_score_100 !== null
    ? Number(scoreSummary.weighted_score_100)
    : 0;
  const coveragePercent = scoreSummary && scoreSummary.coverage && scoreSummary.coverage.ratio !== undefined
    ? Math.round(Number(scoreSummary.coverage.ratio) * 100)
    : (payload && payload.scoring && payload.scoring.final_coverage_ratio !== undefined && payload.scoring.final_coverage_ratio !== null
      ? Math.round(Number(payload.scoring.final_coverage_ratio) * 100)
      : 0);
  const riskPercent = Math.min(riskFlags.length * 20, 100);

  if (dashboardScoreValue) dashboardScoreValue.textContent = `${Math.round(weightedScore)} / 100`;
  if (dashboardScoreFill) dashboardScoreFill.style.width = `${Math.max(0, Math.min(weightedScore, 100))}%`;
  if (dashboardCoverageValue) dashboardCoverageValue.textContent = `${coveragePercent}%`;
  if (dashboardCoverageFill) dashboardCoverageFill.style.width = `${Math.max(0, Math.min(coveragePercent, 100))}%`;
  if (dashboardRiskValue) dashboardRiskValue.textContent = `${riskFlags.length} flag${riskFlags.length === 1 ? '' : 's'}`;
  if (dashboardRiskFill) dashboardRiskFill.style.width = `${riskPercent}%`;
  if (dashboardSourcesValue) dashboardSourcesValue.textContent = String(evidenceSourceCount || 0);
  if (dashboardArtifactsValue) dashboardArtifactsValue.textContent = String(artifactCount);
  if (dashboardRuntimeValue) dashboardRuntimeValue.textContent = `${runtimeProvider.value}`;
  if (throughputDashboardState) {
    throughputDashboardState.textContent = route && route.recommended_mode ? route.recommended_mode : (verifyGates && verifyGates.all_passed ? 'gates passed' : 'awaiting route');
  }

  const snapshots = payload && payload.scoring && Array.isArray(payload.scoring.cycle_snapshots)
    ? payload.scoring.cycle_snapshots.map((item, index) => ({
      label: `C${item.cycle || index + 1}`,
      score: item.weighted_score_100 || 0,
      coverage: item.coverage_ratio ? Math.round(item.coverage_ratio * 100) : 0
    }))
    : [{
      label: 'C1',
      score: weightedScore,
      coverage: coveragePercent
    }];
  setCycleSnapshots(snapshots, snapshots.length > 1 ? 'cycle scores' : 'final score');
}

function extractRunEnvelope(payload) {
  const envelope = payload && payload.result ? payload.result : (payload || {});
  const collaboration = envelope.input_registry && envelope.input_registry.collaboration_context
    ? envelope.input_registry.collaboration_context
    : (payload && payload.input && payload.input.data ? payload.input.data.collaboration_context : null);
  const route = envelope.route_recommendation || (payload && payload.output ? payload.output.route : null);
  const verifyGates = envelope.verify_gates || (payload && payload.output && payload.output.recommend
    ? payload.output.recommend.verify_gates
    : null);
  const checkpoint = envelope.human_checkpoint || null;
  const implementation = payload && payload.output ? payload.output.implement : null;
  const processQuality = envelope.process_quality || null;
  const researchSynthesis = envelope.research_synthesis || null;
  const activeSearchPlan = envelope.active_ai_search_plan || null;
  const scoreSummary = envelope.final_assessment && envelope.final_assessment.score_summary
    ? envelope.final_assessment.score_summary
    : (payload && payload.output && payload.output.recommend && payload.output.recommend.assessment
      ? payload.output.recommend.assessment.score_summary
      : null);
  return {
    envelope,
    collaboration,
    route,
    verifyGates,
    checkpoint,
    implementation,
    processQuality,
    researchSynthesis,
    activeSearchPlan,
    scoreSummary
  };
}

function renderRoleStageCards() {
  Object.entries(ROLE_STAGE_ELEMENTS).forEach(([key, elements]) => {
    const snapshot = roleStageState[key];
    if (!snapshot || !elements) return;
    elements.stateEl.textContent = snapshot.state;
    elements.summaryEl.textContent = snapshot.summary;
    elements.listEl.innerHTML = '';
    if (!snapshot.activities.length) {
      const item = document.createElement('li');
      item.className = 'stage-empty';
      item.textContent = elements.empty;
      elements.listEl.appendChild(item);
      return;
    }
    snapshot.activities.forEach((activity) => {
      const item = document.createElement('li');
      item.textContent = activity;
      elements.listEl.appendChild(item);
    });
  });
  renderComposerStatusStrip();
}

function renderComposerStatusStrip() {
  if (composerStatusRuntime) {
    composerStatusRuntime.textContent = `Runtime: ${runtimeProvider.value} / ${modelPack.value}`;
  }
  if (composerStatusModels) {
    composerStatusModels.textContent = `Models: ${truncateText(modelProposal.value, 18)} / ${truncateText(modelCritique.value, 18)} / ${truncateText(modelAssess.value, 18)}`;
  }
  if (composerStatusCycles) {
    composerStatusCycles.textContent = `Cycles: ${Math.max(1, Math.min(Number(debateCycles.value || 3), 5))} ${passStrategy.value || 'adaptive'} / ${policy.value}`;
  }
  if (composerStatusGovernor) {
    const governorSnapshot = roleStageState.governor || { state: 'Idle', summary: 'No governance route yet.' };
    composerStatusGovernor.textContent = `Governor: ${governorSnapshot.state} - ${truncateText(governorSnapshot.summary, 62)}`;
  }
}

function setRoleStageActivity(stage, state, summary, activity) {
  const snapshot = roleStageState[stage];
  if (!snapshot) return;
  if (state) snapshot.state = state;
  if (summary) snapshot.summary = truncateText(summary, 220);
  if (activity) {
    snapshot.activities.unshift(truncateText(activity, 150));
    snapshot.activities = snapshot.activities.slice(0, 5);
  }
  renderRoleStageCards();
}

function resetRoleStageCards() {
  roleStageState = {
    propose: { state: 'Queued', summary: 'Proposal path is waiting for new activity.', activities: [] },
    critique: { state: 'Queued', summary: 'Critique path is waiting for proposal output.', activities: [] },
    assess: { state: 'Queued', summary: 'Assessment path is waiting for proposal and critique output.', activities: [] },
    governor: { state: 'Queued', summary: 'Governance path is waiting for verify gates and route output.', activities: [] }
  };
  renderRoleStageCards();
}

function renderThroughputShowcase() {
  if (!throughputShowcase) return;
  throughputShowcase.innerHTML = '';
  if (!throughputActivitiesState.length) {
    const item = document.createElement('li');
    item.className = 'throughput-empty';
    item.textContent = 'No activities yet.';
    throughputShowcase.appendChild(item);
    return;
  }

  throughputActivitiesState.forEach((entry) => {
    const item = document.createElement('li');
    item.className = `throughput-activity-item ${entry.tone || 'neutral'}`;
    const title = document.createElement('div');
    title.className = 'throughput-activity-title';
    title.textContent = entry.title;
    const details = document.createElement('div');
    details.className = 'throughput-activity-details';
    details.textContent = entry.details;
    item.appendChild(title);
    item.appendChild(details);
    throughputShowcase.appendChild(item);
  });
}

function appendThroughputActivity(title, details, tone = 'neutral') {
  throughputActivitiesState.unshift({
    title: truncateText(title, 84),
    details: truncateText(details, 180),
    tone
  });
  throughputActivitiesState = throughputActivitiesState.slice(0, 12);
  renderThroughputShowcase();
}

function resetThroughputShowcase() {
  throughputActivitiesState = [];
  if (throughputRequest) {
    throughputRequest.textContent = truncateText(userRequests.value || decision.value || 'No active request yet.', 96);
  }
  if (throughputRoute) {
    throughputRoute.textContent = 'Route pending';
  }
  if (throughputNextMove) {
    throughputNextMove.textContent = 'Await next governed action.';
  }
  renderThroughputShowcase();
  resetVisualDashboards();
}

function buildDecisionRecordSummary(label, payload) {
  if (payload && payload.error) {
    return `${label}\n\nStatus: blocked\nIssue: ${payload.error}`;
  }

  const {
    envelope,
    collaboration,
    route,
    verifyGates,
    checkpoint,
    implementation,
    processQuality,
    scoreSummary
  } = extractRunEnvelope(payload);

  const recommendation = firstNonEmpty(
    checkpoint ? checkpoint.decision : null,
    implementation ? implementation.note : null,
    route ? route.reason : null,
    processQuality ? processQuality.recommendation : null,
    envelope.decision,
    'No recommendation captured yet.'
  );

  const nextMove = firstNonEmpty(
    implementation ? implementation.next_step : null,
    implementation ? implementation.note : null,
    route ? route.reason : null,
    checkpoint ? checkpoint.reason : null,
    'Review the latest governed output and continue the next cycle.'
  );

  const lines = [
    label,
    '',
    `Recommendation: ${recommendation}`,
    `Request in focus: ${firstNonEmpty(collaboration ? collaboration.user_requests : null, envelope.objective, envelope.decision, 'No request summary captured.')}`,
    `Route: ${route ? `${route.recommended_mode || 'n/a'} - ${route.reason || 'reason pending'}` : 'pending'}`,
    `Next move: ${nextMove}`
  ];

  if (scoreSummary && scoreSummary.weighted_score_100 !== undefined && scoreSummary.weighted_score_100 !== null) {
    lines.push(`Score: ${scoreSummary.weighted_score_100}/100`);
  }

  if (verifyGates) {
    lines.push(`Verify gates: ${verifyGates.all_passed ? 'all passed' : 'conditions remain open'}`);
  }

  return lines.join('\n');
}

function updateThroughputSummary(payload) {
  const { envelope, collaboration, route, implementation, processQuality, researchSynthesis, activeSearchPlan } = extractRunEnvelope(payload);
  const nextMove = firstNonEmpty(
    implementation ? implementation.note : null,
    processQuality ? processQuality.recommendation : null,
    route ? route.reason : null,
    researchSynthesis && Array.isArray(researchSynthesis.targeted_research_tasks) ? researchSynthesis.targeted_research_tasks[0] : null,
    activeSearchPlan && Array.isArray(activeSearchPlan.suggested_queries) ? activeSearchPlan.suggested_queries[0] : null,
    'Await next governed action.'
  );

  if (throughputRequest) {
    throughputRequest.textContent = truncateText(
      firstNonEmpty(collaboration ? collaboration.user_requests : null, envelope.objective, envelope.decision, userRequests.value, 'No active request yet.'),
      110
    );
  }
  if (throughputRoute) {
    throughputRoute.textContent = truncateText(route ? `${route.recommended_mode || 'route pending'}${route.reason ? ` - ${route.reason}` : ''}` : 'Route pending', 110);
  }
  if (throughputNextMove) {
    throughputNextMove.textContent = truncateText(nextMove, 110);
  }
}

function syncStageCardsFromPayload(payload) {
  const { envelope, route, verifyGates, checkpoint, implementation, processQuality, researchSynthesis, scoreSummary } = extractRunEnvelope(payload);
  setRoleStageActivity(
    'propose',
    'Ready',
    firstNonEmpty(envelope.objective, envelope.decision, 'Proposal target captured for this run.'),
    firstNonEmpty(checkpoint ? checkpoint.decision : null, envelope.decision, 'Proposal state updated.')
  );

  const critiqueSignal = firstNonEmpty(
    processQuality ? processQuality.recommendation : null,
    researchSynthesis && Array.isArray(researchSynthesis.targeted_research_tasks) ? researchSynthesis.targeted_research_tasks[0] : null,
    openTopics.value,
    'Critique cues captured from the current run.'
  );
  setRoleStageActivity('critique', 'Ready', critiqueSignal, critiqueSignal);

  const assessSignal = firstNonEmpty(
    route ? route.reason : null,
    implementation ? implementation.note : null,
    checkpoint ? checkpoint.reason : null,
    'Assessment is waiting for a final route.'
  );
  const assessStatus = verifyGates ? (verifyGates.all_passed ? 'Passed' : 'Review') : (route ? 'Routed' : 'Ready');
  const assessActivity = scoreSummary && scoreSummary.weighted_score_100 !== undefined && scoreSummary.weighted_score_100 !== null
    ? `Score ${scoreSummary.weighted_score_100}/100${route && route.recommended_mode ? `, route ${route.recommended_mode}` : ''}`
    : assessSignal;
  setRoleStageActivity('assess', assessStatus, assessSignal, assessActivity);

  const governanceSignal = firstNonEmpty(
    route ? route.reason : null,
    checkpoint ? checkpoint.reason : null,
    verifyGates ? `Verify gates ${verifyGates.all_passed ? 'passed' : 'need review'}.` : null,
    'Governance is waiting for verify gates and route output.'
  );
  const governanceState = route && route.recommended_mode
    ? route.recommended_mode
    : (verifyGates ? (verifyGates.all_passed ? 'Ready' : 'Review') : 'Queued');
  const governanceActivity = route && route.recommended_mode
    ? `Route ${route.recommended_mode}${checkpoint && checkpoint.required ? ' with human checkpoint' : ''}`
    : governanceSignal;
  setRoleStageActivity('governor', governanceState, governanceSignal, governanceActivity);
}

function formatCollaborationLabel(value) {
  return String(value || 'new-request')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function updateMissionControl() {
  const selectedKey = useCaseProfile.value;
  const selectedMeta = USE_CASE_CARD_META[selectedKey];
  const references = parseLineList(publicReferences.value);
  const datasets = parseLineList(datasetRegistry.value);
  const topics = parseLineList(openTopics.value);

  if (metricUseCase) {
    metricUseCase.textContent = selectedMeta ? selectedMeta.title : 'Custom';
  }
  if (metricObjective) {
    metricObjective.textContent = truncateText(objective.value || 'Select or shape the current decision path.');
  }
  if (metricRuntime) {
    metricRuntime.textContent = `${runtimeProvider.value} / ${taskMode.value} / ${executionMode.value}`;
  }
  if (metricModels) {
    metricModels.textContent = `proposal ${truncateText(modelProposal.value, 20)}, critique ${truncateText(modelCritique.value, 20)}, assess ${truncateText(modelAssess.value, 20)}`;
  }
  if (metricCollaboration) {
    metricCollaboration.textContent = formatCollaborationLabel(collaborationMode.value);
  }
  if (metricTopics) {
    metricTopics.textContent = `${topics.length} open topic${topics.length === 1 ? '' : 's'} tracked.`;
  }
  if (metricSources) {
    metricSources.textContent = truncateText(sourcesInput.value || textDir.value, 48);
  }
  if (metricEvidenceDetail) {
    metricEvidenceDetail.textContent = `${references.length} reference${references.length === 1 ? '' : 's'}, ${datasets.length} registered dataset${datasets.length === 1 ? '' : 's'}.`;
  }
  if (metricArtifacts) {
    metricArtifacts.textContent = `${artifactCount} available`;
  }
  if (metricArtifactsDetail) {
    metricArtifactsDetail.textContent = artifactCount > 0
      ? 'Decision records and outputs are ready to inspect or download.'
      : 'Refresh after a run to keep the record visible.';
  }
  if (statusRuntime) {
    statusRuntime.textContent = `${runtimeProvider.value} / ${policy.value}`;
  }
  if (statusArtifacts) {
    statusArtifacts.textContent = `${artifactCount} artifact${artifactCount === 1 ? '' : 's'}`;
  }
  if (dashboardArtifactsValue) {
    dashboardArtifactsValue.textContent = String(artifactCount);
  }
  if (dashboardRuntimeValue) {
    dashboardRuntimeValue.textContent = runtimeProvider.value;
  }
}

function updateActiveSection(sectionId) {
  const links = document.querySelectorAll('.segment-nav-link');
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href === `#${sectionId}`);
    if (href === `#${sectionId}` && missionActiveSection) {
      missionActiveSection.textContent = link.textContent.trim();
    }
  });
}

function setupSectionObserver() {
  const targets = document.querySelectorAll('.section-anchor-target');
  if (!targets.length || typeof IntersectionObserver === 'undefined') {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      updateActiveSection(visible[0].target.id);
    }
  }, {
    rootMargin: '-20% 0px -55% 0px',
    threshold: [0.2, 0.45, 0.7]
  });

  targets.forEach((target) => observer.observe(target));
}

const USE_CASE_PROFILES = {
  regulatory: {
    objective: 'Produce a defensible interpretation of public regulatory requirements before downstream action.',
    decision: 'Interpret regulatory requirements with explicit applicability, contradiction checks, and governance routing',
    context: 'Cross-document review for public regulations, codes, circulars, and approved guidance where applicability, conflict, and evidence sufficiency matter.',
    expectations: 'Clause-backed interpretation path\nApplicability boundaries made explicit\nContradictions and evidence gaps surfaced early\nClear HITL or HOTL route recommendation',
    researchNeeds: 'Latest public regulatory updates\nContradictory or overlapping clauses across sources\nFigure-dependent or context-dependent clauses\nMissing project inputs required before action',
    constraints: 'Use public or approved datasets only\nDo not overstate certainty when applicability is unresolved\nEscalate conflicts and ambiguous clauses\nPreserve traceability from source to conclusion',
    policy: 'strict',
    collaborationMode: 'new-request',
    userRequests: 'Interpret the governing requirements, keep unresolved questions visible, and route ambiguous issues to human review before action.',
    openTopics: 'Applicability boundaries\nContradiction review\nEvidence gaps\nProject inputs still required',
    continuationNotes: 'Continue from the latest evidence-backed interpretation, keep corrections explicit, and preserve a reusable reasoning trail for later review.',
    activeSearchEnabled: true,
    maxFiles: 120,
    debateCycles: 3,
    passStrategy: 'adaptive',
    riskLevel: 'high',
    runtimeProvider: 'ollama',
    taskMode: 'read-review',
    executionMode: 'advisory',
    modelPack: 'qwen-local',
    modelProposal: 'qwen2.5:7b',
    modelCritique: 'qwen2.5:14b',
    modelAssess: 'deepseek-r1:8b',
    modelNotes: 'Regulatory interpretation posture: prioritize clause reading, conflict surfacing, and governed escalation over speed.'
  },
  trhs: {
    objective: 'Produce a defensible TRHS interpretation across BCA, URA, and SCDF sources before project action.',
    decision: 'Interpret TRHS regulatory requirements for household shelter compliance and escalation routing',
    context: 'Cross-authority review for landed and residential household shelter issues, with emphasis on clause applicability, contradiction checks, and project-specific conditions.',
    expectations: 'Clause-backed interpretation register entries\nConditions and assumptions listed explicitly\nContradictions and evidence gaps surfaced before action\nClear HITL or HOTL route recommendation',
    researchNeeds: 'Latest public BCA, URA, and SCDF TRHS-related clauses\nContradictory or overlapping requirements across authorities\nFigure-dependent or geometry-dependent clauses needing human review\nProject inputs needed before any compliance claim',
    constraints: 'Use public regulatory sources only\nDo not treat extracted text as final authority without applicability checks\nEscalate unclear, conflicted, or figure-dependent clauses\nPreserve clause-to-decision traceability',
    policy: 'strict',
    sources: 'data/trhs-text',
    includePrefixes: 'BCA,URA,SCDF',
    excludeFiles: 'BCA_HS_Checks_Scope.pdf',
    publicReferences: 'BCA TRHS requirements\nBCA approved document\nBCA understanding approved document\nSCDF Fire Code 2023\nURA Circular DC25-05\nURA landed housing summaries',
    datasetRegistry: 'data/trhs-text\nTRHS Interpretation Register (TIR)',
    collaborationMode: 'new-request',
    userRequests: 'Interpret TRHS requirements, keep unresolved regulatory questions visible, and route ambiguous issues to human review before action.',
    openTopics: 'Applicability boundaries by development type\nCross-authority contradictions or silent gaps\nFigure-dependent clauses requiring manual confirmation\nProject geometry or detail inputs still missing',
    continuationNotes: 'Continue from the latest evidence-backed TRHS interpretation, keep unresolved assumptions visible, and convert stable findings into TIR entries instead of losing them in chat drift.',
    activeSearchEnabled: true,
    maxFiles: 120,
    debateCycles: 3,
    passStrategy: 'adaptive',
    riskLevel: 'high',
    runtimeProvider: 'ollama',
    taskMode: 'read-review',
    executionMode: 'advisory',
    modelPack: 'qwen-local',
    modelProposal: 'qwen2.5:7b',
    modelCritique: 'qwen2.5:14b',
    modelAssess: 'deepseek-r1:8b',
    modelNotes: 'TRHS interpretation posture: prioritize careful clause reading, contradiction surfacing, and governed escalation over speed.'
  },
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

const USE_CASE_CARD_META = {
  regulatory: {
    title: 'Generic Regulatory Interpretation',
    outcome: 'Use PCA to parse, compare, and route regulation-heavy decisions through explicit stages.'
  },
  trhs: {
    title: 'TRHS Regulatory Interpretation',
    outcome: 'Turn public authority text into a governed interpretation path with explicit conditions and escalation.'
  },
  corenetx: {
    title: 'Automated Pre-Submission',
    outcome: 'Reduce rework and clear submission blockers earlier.'
  },
  accessibility: {
    title: 'Accessible Routes and Facilities',
    outcome: 'Shape route options that stay compliant and usable.'
  },
  buildability: {
    title: 'Buildability and Constructability',
    outcome: 'Choose more buildable options without compliance regressions.'
  },
  mepcs: {
    title: 'MEP and C&S Clash-Aware Design',
    outcome: 'Resolve clashes through feasible coordination choices.'
  },
  greenmark: {
    title: 'Envelope and Systems Optimization',
    outcome: 'Improve performance with lower redesign disruption.'
  },
  maintainability: {
    title: 'Maintainability and FM Access',
    outcome: 'Surface maintainability blockers before late-stage discovery.'
  },
  hschecks: {
    title: 'HS Requirements vs Drawings',
    outcome: 'Prioritize true safety issues with traceable review.'
  },
  costverify: {
    title: 'Cost Verification',
    outcome: 'Turn discrepancy review into actionable package-level findings.'
  },
  specdraw: {
    title: 'Specification vs Drawing Consistency',
    outcome: 'Reduce false positives and clarify true coordination issues.'
  },
  bca_master: {
    title: 'BCA Master Compliance Pre-Check',
    outcome: 'Get one readiness view across multiple compliance domains.'
  }
};

const RUNTIME_GUIDE_TEXT = {
  copilot: {
    title: 'Copilot Runtime',
    badge: 'paid runtime',
    body: 'Copilot can drive generation, while PCA improves quality through role separation, critique, assessment, and governance.',
    hint: 'Use this when you want stronger thinking quality and a more disciplined, auditable reasoning path.'
  },
  antigravity: {
    title: 'Antigravity Runtime',
    badge: 'orchestration runtime',
    body: 'Antigravity can orchestrate tasks, while PCA sharpens the output with framework design, evidence checks, debate structure, and routing.',
    hint: 'Use this when Antigravity is the outer execution surface and PCA is the governed decision layer.'
  },
  ollama: {
    title: 'Ollama Local Models',
    badge: 'foc local',
    body: 'This is the main free and open path: run local models such as Qwen or DeepSeek variants, then let PCA improve raw model output with proposal, critique, assessment, and governance.',
    hint: 'Best for FoC-first teams. The current browser UI prepares and documents the run; direct local model execution uses the Ollama adapter.'
  },
  byom: {
    title: 'Your Own Models and Endpoints',
    badge: 'byom compatible',
    body: 'Use your own OpenAI-compatible endpoint for local or hosted models. This fits DeepSeek, Qwen, local gateways, and any compatible provider endpoint for PCA reasoning workflows.',
    hint: 'Claude, Gemini, and Grok usually need an OpenAI-compatible gateway or proxy unless a native PCA adapter is added.'
  },
  other: {
    title: 'Other Runtime',
    badge: 'runtime metadata',
    body: 'Use PCA as the governance shell and record which runtime or provider was used for reproducibility and auditability.',
    hint: 'Use this when the provider is outside the built-in runtime paths.'
  }
};

const BYOM_PROVIDER_NOTES = {
  generic: 'Use this when the provider exposes an OpenAI-compatible chat/completions API. Works for many self-hosted and managed gateways.',
  openai: 'Use this for providers that directly expose an OpenAI-compatible API. PCA BYOM calls chat/completions and can split proposal, critique, and assess models.',
  openrouter: 'Use this when routing multiple models through an OpenRouter-style compatible endpoint.',
  'anthropic-gateway': 'Claude is not directly supported by the current BYOM adapter unless it is exposed through an OpenAI-compatible gateway or proxy.',
  'gemini-gateway': 'Gemini is not directly supported by the current BYOM adapter unless it is exposed through an OpenAI-compatible gateway or proxy.',
  'xai-gateway': 'Grok is not directly supported by the current BYOM adapter unless it is exposed through an OpenAI-compatible gateway or proxy.',
  deepseek: 'DeepSeek is a strong fit when you run it locally or through a DeepSeek or gateway endpoint that is OpenAI-compatible.',
  qwen: 'Qwen is a strong FoC fit for either local Ollama use or a compatible BYOM endpoint.',
  dola: 'DoLa is not a first-class provider path here; use it only if you already expose it through an OpenAI-compatible endpoint or gateway.',
  'local-gateway': 'Use this for vLLM, LM Studio, LocalAI, LiteLLM, or similar local gateways exposing an OpenAI-compatible interface.'
};

const MODEL_PACKS = {
  'foc-balanced': {
    proposal: 'qwen2.5:7b',
    critique: 'llama3.1:8b',
    assess: 'qwen2.5:14b',
    notes: 'Balanced FoC pack for governed discussion, comparison, critique, planning, and analysis.',
    packNote: 'Best general FoC pack for PCA-style thinking tasks. Strong default for analysis, discussions, comparisons, structured debate, and implementation guidance.'
  },
  'analysis-debate': {
    proposal: 'qwen2.5:14b',
    critique: 'llama3.1:8b',
    assess: 'qwen2.5:14b',
    notes: 'Optimized for deeper analysis, argument comparison, insight generation, and PCA debate loops.',
    packNote: 'Use this when you want better synthesis, tradeoff review, and debate quality over speed.'
  },
  'planning-insight': {
    proposal: 'qwen2.5:7b',
    critique: 'qwen2.5:14b',
    assess: 'qwen2.5:14b',
    notes: 'Optimized for planning, roadmap thinking, structured task decomposition, and development guidance.',
    packNote: 'Use this for agentic planning, development discussion, requirement breakdowns, and next-step design.'
  },
  'coding-design': {
    proposal: 'qwen2.5-coder:7b',
    critique: 'llama3.1:8b',
    assess: 'qwen2.5:14b',
    notes: 'Optimized for coding discussion, design review, implementation planning, and code critique.',
    packNote: 'Use this when the main task is coding, software design, refactoring, development, or code review.'
  },
  'qwen-local': {
    proposal: 'qwen2.5:7b',
    critique: 'qwen2.5:14b',
    assess: 'qwen2.5:14b',
    notes: 'Qwen-only FoC pack for teams standardizing on one local free/open family for discussion, planning, coding guidance, and development tasks.',
    packNote: 'Good when you want a single-family FoC stack with lower operational complexity across thinking and development workflows.'
  },
  'deepseek-local': {
    proposal: 'deepseek-r1:8b',
    critique: 'llama3.1:8b',
    assess: 'deepseek-r1:14b',
    notes: 'DeepSeek-oriented FoC pack for reasoning-heavy analysis and discussion. Verify local availability in Ollama or your BYOM gateway before use.',
    packNote: 'Good for reasoning-heavy discussions and analysis if your local environment or gateway supports DeepSeek models.'
  },
  manual: {
    proposal: '',
    critique: '',
    assess: '',
    notes: '',
    packNote: 'Manual mode leaves model fields untouched so you can supply your own compatible models or provider-specific names.'
  }
};

const TASK_MODE_CONFIG = {
  analysis: {
    note: 'Use this for analysis, insight generation, interpretation, and structured reasoning over datasets and documents.',
    suggestedPack: 'foc-balanced'
  },
  debate: {
    note: 'Use this for comparisons, competing options, challenge rounds, contradictions, and PCA-style debate loops.',
    suggestedPack: 'analysis-debate'
  },
  planning: {
    note: 'Use this for task decomposition, roadmap thinking, phase design, and agentic planning workflows.',
    suggestedPack: 'planning-insight'
  },
  'dataset-access': {
    note: 'Use this for locating datasets, checking inputs, reviewing accessible files, preparing corpus structure, and framing what data should be used.',
    suggestedPack: 'planning-insight'
  },
  'read-review': {
    note: 'Use this for reading, reviewing, summarizing, comparing, and extracting meaning from documents, code, or datasets.',
    suggestedPack: 'analysis-debate'
  },
  'write-output': {
    note: 'Use this for writing drafts, reports, summaries, structured outputs, issue registers, and governed response artifacts.',
    suggestedPack: 'foc-balanced'
  },
  'transform-output': {
    note: 'Use this for converting outputs into JSON, tables, checklists, bundles, registers, or downstream-ready packaging.',
    suggestedPack: 'planning-insight'
  },
  coding: {
    note: 'Use this for code review, design critique, technical comparison, architecture discussion, and implementation planning.',
    suggestedPack: 'coding-design'
  },
  development: {
    note: 'Use this for development discussion, solution shaping, refactoring direction, and governed build/refine workflows.',
    suggestedPack: 'coding-design'
  },
  programming: {
    note: 'Use this for programming tasks that involve reading, writing, modifying, and refining code or automation logic.',
    suggestedPack: 'coding-design'
  },
  build: {
    note: 'Use this for build-oriented tasks where PCA should maintain quality gates while moving toward concrete implementation outputs.',
    suggestedPack: 'coding-design'
  },
  refine: {
    note: 'Use this for iteration, improvement, cleanup, gap-fixing, and focused refinement of outputs or code.',
    suggestedPack: 'coding-design'
  }
};

const EXECUTION_MODE_CONFIG = {
  'reasoning-only': 'Reasoning-focused mode: emphasize framing, evidence, critique, assessment, and recommendations.',
  advisory: 'Advisory mode: produce governed next steps, suggested outputs, and implementation-ready guidance without forcing direct changes.',
  'execution-ready': 'Execution-ready mode: produce reasoning plus concrete build, write, transform, or programming outputs where the selected workflow supports it.'
};

const THEME_PRESETS = {
  operational: {
    bg: '#f3efe6',
    card: '#fffdfa',
    cardAlpha: 82,
    innerAlpha: 62,
    ink: '#17201c',
    fontSans: 'space-grotesk',
    fontMono: 'ibm-plex-mono',
    line: '#d9cebb',
    accent: '#0b6e69',
    accent2: '#c65d1a',
    muted: '#56605c',
    bgStart: '#f3efe6',
    bgEnd: '#eef3ec',
    bgAngle: 150
  },
  'evidence-lab': {
    bg: '#edf3f6',
    card: '#fcfeff',
    cardAlpha: 76,
    innerAlpha: 54,
    ink: '#10202b',
    fontSans: 'manrope',
    fontMono: 'ibm-plex-mono',
    line: '#c9d8df',
    accent: '#165d86',
    accent2: '#d97706',
    muted: '#566975',
    bgStart: '#edf3f6',
    bgEnd: '#f5f9fb',
    bgAngle: 145
  },
  'field-manual': {
    bg: '#f1eadf',
    card: '#fffaf2',
    cardAlpha: 84,
    innerAlpha: 66,
    ink: '#231f1a',
    fontSans: 'sora',
    fontMono: 'jetbrains-mono',
    line: '#d5c8b4',
    accent: '#355e3b',
    accent2: '#d66a1f',
    muted: '#6d675f',
    bgStart: '#f1eadf',
    bgEnd: '#f8f1e5',
    bgAngle: 155
  }
};

const FONT_STACKS = {
  'space-grotesk': "'Space Grotesk', sans-serif",
  manrope: "'Manrope', sans-serif",
  sora: "'Sora', sans-serif",
  outfit: "'Outfit', sans-serif",
  'plus-jakarta-sans': "'Plus Jakarta Sans', sans-serif",
  'bricolage-grotesque': "'Bricolage Grotesque', sans-serif",
  'ibm-plex-sans': "'IBM Plex Sans', sans-serif",
  fraunces: "'Fraunces', serif",
  'source-serif-4': "'Source Serif 4', serif",
  'dm-serif-display': "'DM Serif Display', serif",
  'ibm-plex-mono': "'IBM Plex Mono', monospace",
  'jetbrains-mono': "'JetBrains Mono', monospace",
  'fira-mono': "'Fira Mono', monospace",
  'space-grotesk-mono': "'Space Grotesk', monospace"
};

function applyTheme(themeName) {
  const selected = themeName || 'operational';
  document.documentElement.dataset.theme = selected;
  if (themePreset) {
    themePreset.value = selected;
  }
  if (themePreviewGrid) {
    themePreviewGrid.querySelectorAll('.theme-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.themeOption === selected);
    });
  }
  syncThemeControlsFromPreset(selected);
}

function setThemeVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function setThemeFontVariables(fontSansKey, fontMonoKey) {
  setThemeVariable('--font-sans', FONT_STACKS[fontSansKey] || FONT_STACKS['space-grotesk']);
  setThemeVariable('--font-mono', FONT_STACKS[fontMonoKey] || FONT_STACKS['ibm-plex-mono']);
}

function hexToRgb(hex) {
  const normalized = String(hex || '').replace('#', '').trim();
  if (normalized.length !== 6) return null;
  const num = Number.parseInt(normalized, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function buildRgba(hex, alphaPercent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const alpha = Math.max(0, Math.min(Number(alphaPercent) || 100, 100)) / 100;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function syncThemeControlsFromPreset(themeName) {
  const preset = THEME_PRESETS[themeName];
  if (!preset) return;

  themeBg.value = preset.bg;
  themeCard.value = preset.card;
  themeCardAlpha.value = preset.cardAlpha;
  themeCardAlphaValue.textContent = `${preset.cardAlpha}%`;
  themeInnerAlpha.value = preset.innerAlpha;
  themeInnerAlphaValue.textContent = `${preset.innerAlpha}%`;
  themeInk.value = preset.ink;
  themeFontSans.value = preset.fontSans;
  themeFontMono.value = preset.fontMono;
  themeLine.value = preset.line;
  themeAccent.value = preset.accent;
  themeAccent2.value = preset.accent2;
  themeMuted.value = preset.muted;
  themeBgStart.value = preset.bgStart;
  themeBgEnd.value = preset.bgEnd;
  themeGradientAngle.value = preset.bgAngle;
  themeGradientAngleValue.textContent = `${preset.bgAngle}deg`;

  setThemeVariable('--bg', preset.bg);
  setThemeVariable('--card', preset.card);
  setThemeVariable('--card-surface', buildRgba(preset.card, preset.cardAlpha));
  setThemeVariable('--inner-surface', buildRgba(preset.card, preset.innerAlpha));
  setThemeVariable('--inner-surface-strong', buildRgba(preset.card, Math.min(preset.innerAlpha + 12, 100)));
  setThemeVariable('--ink', preset.ink);
  setThemeFontVariables(preset.fontSans, preset.fontMono);
  setThemeVariable('--line', preset.line);
  setThemeVariable('--accent', preset.accent);
  setThemeVariable('--accent-2', preset.accent2);
  setThemeVariable('--muted', preset.muted);
  setThemeVariable('--bg-start', preset.bgStart);
  setThemeVariable('--bg-end', preset.bgEnd);
  setThemeVariable('--bg-angle', `${preset.bgAngle}deg`);
}

function applyThemeControlOverrides() {
  setThemeVariable('--bg', themeBg.value);
  setThemeVariable('--card', themeCard.value);
  setThemeVariable('--card-surface', buildRgba(themeCard.value, themeCardAlpha.value));
  setThemeVariable('--inner-surface', buildRgba(themeCard.value, themeInnerAlpha.value));
  setThemeVariable('--inner-surface-strong', buildRgba(themeCard.value, Math.min(Number(themeInnerAlpha.value || 0) + 12, 100)));
  setThemeVariable('--ink', themeInk.value);
  setThemeFontVariables(themeFontSans.value, themeFontMono.value);
  setThemeVariable('--line', themeLine.value);
  setThemeVariable('--accent', themeAccent.value);
  setThemeVariable('--accent-2', themeAccent2.value);
  setThemeVariable('--muted', themeMuted.value);
  setThemeVariable('--bg-start', themeBgStart.value);
  setThemeVariable('--bg-end', themeBgEnd.value);
  setThemeVariable('--bg-angle', `${themeGradientAngle.value}deg`);
  themeCardAlphaValue.textContent = `${themeCardAlpha.value}%`;
  themeInnerAlphaValue.textContent = `${themeInnerAlpha.value}%`;
  themeGradientAngleValue.textContent = `${themeGradientAngle.value}deg`;
}

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
  const byomEndpointValue = byomEndpoint ? byomEndpoint.value : 'http://localhost:11434/v1';
  const byomApiKeyValue = byomApiKey ? byomApiKey.value : 'none';
  const byomTemperatureValue = byomTemperature ? Number(byomTemperature.value || 0.2) : 0.2;

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
    lines.unshift(`ollama pull ${modelProposal.value}`, `ollama pull ${modelCritique.value}`, `ollama pull ${modelAssess.value}`, '', '# FoC local runtime (recommended)', `node integrations/ollama/adapter.js verify --decision "${decisionText}" --context "${contextValue}" --model-proposal "${modelProposal.value}" --model-critic "${modelCritique.value}" --model-assess "${modelAssess.value}"`, '');
  }

  if (runtime === 'byom') {
    lines.unshift('# BYOM runtime (your own models)', `npm run adapter:byom -- verify --decision "${decisionText}" --context "${contextValue}" --endpoint "${byomEndpointValue}" --api-key "${byomApiKeyValue}" --model-proposal "${modelProposal.value}" --model-critic "${modelCritique.value}" --model-assess "${modelAssess.value}" --temperature ${byomTemperatureValue} --policy ${policyValue}`, '');
  }

  return lines.join('\n');
}

function applyModelPack(packKey) {
  const pack = MODEL_PACKS[packKey];
  if (!pack) return;

  modelPackNote.textContent = pack.packNote;
  if (packKey === 'manual') return;

  modelProposal.value = pack.proposal;
  modelCritique.value = pack.critique;
  modelAssess.value = pack.assess;
  modelNotes.value = pack.notes;
}

function maybeApplySuggestedModelPack() {
  const config = TASK_MODE_CONFIG[taskMode.value];
  if (!config) return;
  if (modelPack.value === 'manual') return;
  if (config.suggestedPack && modelPack.value !== config.suggestedPack) {
    modelPack.value = config.suggestedPack;
  }
  applyModelPack(modelPack.value);
}

function renderTaskExecutionMode() {
  const taskConfig = TASK_MODE_CONFIG[taskMode.value] || TASK_MODE_CONFIG.analysis;
  const executionNote = EXECUTION_MODE_CONFIG[executionMode.value] || EXECUTION_MODE_CONFIG['reasoning-only'];
  executionModeNote.textContent = `${taskConfig.note} ${executionNote}`;
}

function renderRuntimeModePanel() {
  const runtime = runtimeProvider.value;
  const active = RUNTIME_GUIDE_TEXT[runtime] || RUNTIME_GUIDE_TEXT.other;

  runtimeModeTitle.textContent = active.title;
  runtimeModeBadge.textContent = active.badge;
  runtimeModeBody.textContent = active.body;
  runtimeModeHint.textContent = active.hint;

  if (runtime === 'byom') {
    byomConfig.classList.remove('hidden');
    byomCompatibilityNote.textContent = BYOM_PROVIDER_NOTES[byomProviderType.value] || BYOM_PROVIDER_NOTES.generic;
  } else {
    byomConfig.classList.add('hidden');
  }
}

function renderRuntimeGuide() {
  const runtime = runtimeProvider.value;
  const active = RUNTIME_GUIDE_TEXT[runtime] || RUNTIME_GUIDE_TEXT.other;
  const cycles = Math.max(1, Math.min(Number(debateCycles.value || 3), 5));
  const strategy = passStrategy.value || 'adaptive';
  const cards = [
    {
      title: 'Why PCA Helps FoC AI',
      body: 'PCA improves raw AI output by separating proposal, critique, assessment, and governance instead of relying on a single unstructured answer.'
    },
    {
      title: 'Copilot-Like UX, Stronger Framework',
      body: `The browser stays fast and assistant-like, but each run can execute ${cycles} governed cycle${cycles === 1 ? '' : 's'} with a ${strategy} pass strategy so evidence gaps and route changes stay visible.`
    },
    {
      title: active.title,
      body: active.body
    },
    {
      title: 'FoC and BYOM Paths',
      body: 'Use Ollama for the fastest free local path, or BYOM for DeepSeek, Qwen, Llama, Gemma, Phi, and other compatible models exposed through your own endpoint or local gateway.'
    },
    {
      title: 'Recommended Free Model Families',
      body: 'Strong FoC starting points are Qwen, DeepSeek, Llama, Gemma, Phi, Mistral, and coder-oriented Qwen/Codellama variants, as long as they are available locally or through a compatible gateway.'
    },
    {
      title: 'Task Coverage',
      body: 'The browser UI supports analysis, debate, planning, dataset access, reading, writing, output transformation, coding, programming, build, and refinement workflows through PCA governance.'
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

  renderComposerStatusStrip();
  renderRuntimeModePanel();
  cliSnippetsView.textContent = buildCliSnippets();
}

function updateSelectedUseCaseNote() {
  if (!selectedUseCaseNote) return;
  if (!useCaseProfile.value || useCaseProfile.value === 'custom') {
    selectedUseCaseNote.textContent = 'Choose a use case path to start fast, or continue an earlier session.';
    return;
  }
  const meta = USE_CASE_CARD_META[useCaseProfile.value];
  selectedUseCaseNote.textContent = meta
    ? `Current path: ${meta.title}. ${meta.outcome}`
    : 'Current path selected.';
}

function renderUseCaseHub() {
  if (!useCaseHub) return;
  useCaseHub.innerHTML = '';

  Object.entries(USE_CASE_CARD_META).forEach(([key, meta]) => {
    const card = document.createElement('article');
    card.className = `use-case-card${useCaseProfile.value === key ? ' active' : ''}`;
    card.tabIndex = 0;

    const title = document.createElement('h3');
    title.textContent = meta.title;

    const body = document.createElement('p');
    body.textContent = meta.outcome;

    const foot = document.createElement('div');
    foot.className = 'use-case-meta';
    foot.textContent = `Policy: ${(USE_CASE_PROFILES[key] && USE_CASE_PROFILES[key].policy) || 'balanced'}`;

    const activate = () => {
      useCaseProfile.value = key;
      applyUseCaseProfile(key);
      renderUseCaseHub();
      updateSelectedUseCaseNote();
      renderInputRegistry();
      scheduleDraftSave();
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(foot);
    useCaseHub.appendChild(card);
  });
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
  if (profile.sources) {
    sourcesInput.value = profile.sources;
  }
  if (profile.includePrefixes !== undefined) {
    includePrefixes.value = profile.includePrefixes;
  }
  if (profile.excludeFiles !== undefined) {
    excludeFiles.value = profile.excludeFiles;
  }
  if (profile.publicReferences) {
    publicReferences.value = profile.publicReferences;
  }
  if (profile.datasetRegistry) {
    datasetRegistry.value = profile.datasetRegistry;
  }
  if (profile.collaborationMode) {
    collaborationMode.value = profile.collaborationMode;
  }
  if (profile.userRequests) {
    userRequests.value = profile.userRequests;
  }
  if (profile.openTopics) {
    openTopics.value = profile.openTopics;
  }
  if (profile.continuationNotes) {
    continuationNotes.value = profile.continuationNotes;
  }
  if (profile.activeSearchEnabled !== undefined) {
    activeSearchEnabled.checked = Boolean(profile.activeSearchEnabled);
  }
  if (profile.maxFiles !== undefined) {
    maxFiles.value = profile.maxFiles;
  }
  if (profile.debateCycles !== undefined) {
    debateCycles.value = profile.debateCycles;
  }
  if (profile.passStrategy) {
    passStrategy.value = profile.passStrategy;
  }
  if (profile.riskLevel) {
    riskLevel.value = profile.riskLevel;
  }
  if (profile.runtimeProvider) {
    runtimeProvider.value = profile.runtimeProvider;
  }
  if (profile.taskMode) {
    taskMode.value = profile.taskMode;
  }
  if (profile.executionMode) {
    executionMode.value = profile.executionMode;
  }
  if (profile.modelPack) {
    modelPack.value = profile.modelPack;
  }
  if (profile.modelProposal) {
    modelProposal.value = profile.modelProposal;
  }
  if (profile.modelCritique) {
    modelCritique.value = profile.modelCritique;
  }
  if (profile.modelAssess) {
    modelAssess.value = profile.modelAssess;
  }
  if (profile.modelNotes) {
    modelNotes.value = profile.modelNotes;
  }
  renderRuntimeGuide();
  updateSelectedUseCaseNote();
  renderInputRegistry();
  updateMissionControl();
}

function setBusy(message) {
  statusEl.textContent = message;
  if (missionRunState) {
    missionRunState.textContent = 'Running';
  }
  [btnOcr, btnConvert, btnFramework, btnResearch, btnQuality, btnEvidence, btnPipeline, btnLiveDebate, btnMissionFramework, btnMissionResearch, btnMissionEvidence, btnMissionDebate, btnMissionPipeline].forEach((btn) => {
    btn.disabled = true;
  });
}

function clearBusy(message = 'Idle') {
  statusEl.textContent = message;
  if (missionRunState) {
    missionRunState.textContent = message === 'Idle' ? 'Idle' : 'Ready';
  }
  [btnOcr, btnConvert, btnFramework, btnResearch, btnQuality, btnEvidence, btnPipeline, btnLiveDebate, btnMissionFramework, btnMissionResearch, btnMissionEvidence, btnMissionDebate, btnMissionPipeline].forEach((btn) => {
    btn.disabled = false;
  });
  updateMissionControl();
}

function safeGetDraft() {
  try {
    const raw = window.localStorage.getItem(UI_DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function safeSetDraft(payload) {
  try {
    window.localStorage.setItem(UI_DRAFT_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (_error) {
    return false;
  }
}

function safeRemoveDraft() {
  try {
    window.localStorage.removeItem(UI_DRAFT_STORAGE_KEY);
    return true;
  } catch (_error) {
    return false;
  }
}

function formatDraftTimestamp(value) {
  if (!value) return 'unknown time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown time';
  return date.toLocaleString();
}

function setDraftStatus(message) {
  if (draftStatus) {
    draftStatus.textContent = message;
  }
  if (metricDraft) {
    metricDraft.textContent = truncateText(message, 24);
  }
  if (metricDraftDetail) {
    metricDraftDetail.textContent = message;
  }
  if (statusDraft) {
    statusDraft.textContent = truncateText(message, 28);
  }
}

function setQuickInputStatus(message) {
  if (quickInputStatus) {
    quickInputStatus.textContent = message;
  }
}

function collectDraftState() {
  return {
    savedAt: new Date().toISOString(),
    useCaseProfile: useCaseProfile.value,
    objective: objective.value,
    decision: decision.value,
    context: contextText.value,
    sourcesInput: sourcesInput.value,
    expectations: expectations.value,
    researchNeeds: researchNeeds.value,
    constraints: constraints.value,
    collaborationMode: collaborationMode.value,
    userRequests: userRequests.value,
    openTopics: openTopics.value,
    continuationNotes: continuationNotes.value,
    activeSearchEnabled: Boolean(activeSearchEnabled.checked),
    policy: policy.value,
    runtimeProvider: runtimeProvider.value,
    taskMode: taskMode.value,
    executionMode: executionMode.value,
    byomProviderType: byomProviderType.value,
    byomEndpoint: byomEndpoint.value,
    byomApiKey: byomApiKey.value,
    byomTemperature: byomTemperature.value,
    modelPack: modelPack.value,
    modelProposal: modelProposal.value,
    modelCritique: modelCritique.value,
    modelAssess: modelAssess.value,
    modelNotes: modelNotes.value,
    maxFiles: maxFiles.value,
    debateCycles: debateCycles.value,
    passStrategy: passStrategy.value,
    riskLevel: riskLevel.value,
    enableZ3GeometryCheck: Boolean(enableZ3GeometryCheck.checked),
    geometryRoomWidth: geometryRoomWidth.value,
    geometryRoomHeight: geometryRoomHeight.value,
    geometryObstacleX: geometryObstacleX.value,
    geometryObstacleY: geometryObstacleY.value,
    geometryRadius: geometryRadius.value,
    minSources: minSources.value,
    minClaims: minClaims.value,
    inputDir: inputDir.value,
    ocrDir: ocrDir.value,
    textDir: textDir.value,
    publicReferences: publicReferences.value,
    datasetRegistry: datasetRegistry.value,
    includePrefixes: includePrefixes.value,
    excludeFiles: excludeFiles.value,
    themePreset: themePreset.value
  };
}

function applyDraftState(draft) {
  if (!draft || typeof draft !== 'object') return;

  useCaseProfile.value = draft.useCaseProfile || useCaseProfile.value;
  objective.value = draft.objective || objective.value;
  decision.value = draft.decision || decision.value;
  contextText.value = draft.context || contextText.value;
  sourcesInput.value = draft.sourcesInput || sourcesInput.value;
  expectations.value = draft.expectations || expectations.value;
  researchNeeds.value = draft.researchNeeds || researchNeeds.value;
  constraints.value = draft.constraints || constraints.value;
  collaborationMode.value = draft.collaborationMode || collaborationMode.value;
  userRequests.value = draft.userRequests || userRequests.value;
  openTopics.value = draft.openTopics || openTopics.value;
  continuationNotes.value = draft.continuationNotes || continuationNotes.value;
  activeSearchEnabled.checked = Boolean(draft.activeSearchEnabled);
  policy.value = draft.policy || policy.value;
  runtimeProvider.value = draft.runtimeProvider || runtimeProvider.value;
  taskMode.value = draft.taskMode || taskMode.value;
  executionMode.value = draft.executionMode || executionMode.value;
  byomProviderType.value = draft.byomProviderType || byomProviderType.value;
  byomEndpoint.value = draft.byomEndpoint || byomEndpoint.value;
  byomApiKey.value = draft.byomApiKey || byomApiKey.value;
  byomTemperature.value = draft.byomTemperature || byomTemperature.value;
  modelPack.value = draft.modelPack || modelPack.value;
  modelProposal.value = draft.modelProposal || modelProposal.value;
  modelCritique.value = draft.modelCritique || modelCritique.value;
  modelAssess.value = draft.modelAssess || modelAssess.value;
  modelNotes.value = draft.modelNotes || modelNotes.value;
  maxFiles.value = draft.maxFiles || maxFiles.value;
  debateCycles.value = draft.debateCycles || debateCycles.value;
  passStrategy.value = draft.passStrategy || passStrategy.value;
  riskLevel.value = draft.riskLevel || riskLevel.value;
  enableZ3GeometryCheck.checked = Boolean(draft.enableZ3GeometryCheck);
  geometryRoomWidth.value = draft.geometryRoomWidth || geometryRoomWidth.value;
  geometryRoomHeight.value = draft.geometryRoomHeight || geometryRoomHeight.value;
  geometryObstacleX.value = draft.geometryObstacleX || geometryObstacleX.value;
  geometryObstacleY.value = draft.geometryObstacleY || geometryObstacleY.value;
  geometryRadius.value = draft.geometryRadius || geometryRadius.value;
  minSources.value = draft.minSources || minSources.value;
  minClaims.value = draft.minClaims || minClaims.value;
  inputDir.value = draft.inputDir || inputDir.value;
  ocrDir.value = draft.ocrDir || ocrDir.value;
  textDir.value = draft.textDir || textDir.value;
  publicReferences.value = draft.publicReferences || publicReferences.value;
  datasetRegistry.value = draft.datasetRegistry || datasetRegistry.value;
  includePrefixes.value = draft.includePrefixes || includePrefixes.value;
  excludeFiles.value = draft.excludeFiles || excludeFiles.value;

  if (draft.themePreset) {
    applyTheme(draft.themePreset);
  }

  renderTaskExecutionMode();
  renderRuntimeGuide();
  renderInputRegistry();
  loadPathOptions();
  setDraftStatus(`Session restored from ${formatDraftTimestamp(draft.savedAt)}.`);
}

function persistDraft(reason = 'autosaved') {
  const saved = safeSetDraft(collectDraftState());
  setDraftStatus(saved ? `Session ${reason} at ${formatDraftTimestamp(new Date().toISOString())}.` : 'Session save unavailable in this browser.');
}

function scheduleDraftSave() {
  if (draftSaveTimer) {
    window.clearTimeout(draftSaveTimer);
  }
  draftSaveTimer = window.setTimeout(() => {
    persistDraft('autosaved');
  }, 350);
}

function restoreSavedDraft() {
  const draft = safeGetDraft();
  if (!draft) {
    setDraftStatus('No saved session found in this browser.');
    return;
  }
  applyDraftState(draft);
}

function clearSavedDraft() {
  const removed = safeRemoveDraft();
  setDraftStatus(removed ? 'Saved session cleared for this browser.' : 'Session clear unavailable in this browser.');
}

function consumeQuickInput() {
  if (!quickInputBar) return '';
  const value = quickInputBar.value.trim();
  if (!value) {
    setQuickInputStatus('Type a new instruction or follow-up first.');
    return '';
  }
  return value;
}

function appendTextBlock(targetEl, text) {
  if (!targetEl || !text) return;
  const current = targetEl.value.trim();
  targetEl.value = current ? `${current}\n${text}` : text;
}

function clearQuickInput(message) {
  if (quickInputBar) {
    quickInputBar.value = '';
  }
  setQuickInputStatus(message);
  renderInputRegistry();
  scheduleDraftSave();
}

async function submitQuickInputToPipeline() {
  const value = consumeQuickInput();
  if (!value) return;
  appendTextBlock(userRequests, value);
  appendTextBlock(continuationNotes, `Continue from quick input: ${value}`);
  clearQuickInput('Sent into the live request. Running the full pipeline now.');
  await btnPipeline.click();
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function listOrEmpty(values) {
  return Array.isArray(values) ? values.filter(Boolean) : [];
}

function buildOutcomeSummary(label, payload) {
  if (payload && payload.error) {
    return `${label}\n\nStatus: blocked\nIssue: ${payload.error}`;
  }

  const envelope = payload && payload.result ? payload.result : (payload || {});
  const collaboration = envelope.input_registry && envelope.input_registry.collaboration_context
    ? envelope.input_registry.collaboration_context
    : (payload && payload.input && payload.input.data ? payload.input.data.collaboration_context : null);
  const route = envelope.route_recommendation || (payload && payload.output ? payload.output.route : null);
  const verifyGates = envelope.verify_gates || (payload && payload.output && payload.output.recommend
    ? payload.output.recommend.verify_gates
    : null);
  const checkpoint = envelope.human_checkpoint || null;
  const implementation = payload && payload.output ? payload.output.implement : null;
  const processQuality = envelope.process_quality || null;
  const researchSynthesis = envelope.research_synthesis || null;
  const activeSearchPlan = envelope.active_ai_search_plan || null;
  const scoreSummary = firstNonEmpty(
    envelope.final_assessment && envelope.final_assessment.score_summary
      ? `score ${envelope.final_assessment.score_summary.weighted_score_100}/100, coverage ${Math.round((envelope.final_assessment.score_summary.coverage ? envelope.final_assessment.score_summary.coverage.ratio : 0) * 100)}%`
      : null,
    payload && payload.output && payload.output.recommend && payload.output.recommend.assessment && payload.output.recommend.assessment.score_summary
      ? `score ${payload.output.recommend.assessment.score_summary.weighted_score_100}/100, coverage ${Math.round((payload.output.recommend.assessment.score_summary.coverage ? payload.output.recommend.assessment.score_summary.coverage.ratio : 0) * 100)}%`
      : null
  );
  const targetedTasks = listOrEmpty(researchSynthesis ? researchSynthesis.targeted_research_tasks : []);
  const searchQueries = listOrEmpty(activeSearchPlan ? activeSearchPlan.suggested_queries : []);
  const openTopicsList = listOrEmpty(collaboration ? collaboration.open_topics : []);

  const lines = [];
  lines.push(label);
  lines.push('');
  lines.push(`Collaboration mode: ${firstNonEmpty(collaboration ? collaboration.mode : null, 'new-request')}`);
  lines.push(`Current request: ${firstNonEmpty(collaboration ? collaboration.user_requests : null, envelope.objective, envelope.decision, 'No request summary captured.')}`);
  lines.push(`Continuity note: ${firstNonEmpty(collaboration ? collaboration.continuation_notes : null, processQuality ? processQuality.recommendation : null, 'Continue by growing the strongest evidence-backed line of work.')}`);
  lines.push('');
  lines.push(`Throughput posture: ${route ? `${route.recommended_mode || 'n/a'} route` : 'route pending'}${implementation && implementation.status ? `, ${implementation.status}` : ''}`);
  lines.push(`Practical status: ${firstNonEmpty(route ? route.reason : null, checkpoint ? checkpoint.reason : null, implementation ? implementation.note : null, 'Await next governed action.')}`);
  if (scoreSummary) {
    lines.push(`Evidence quality: ${scoreSummary}`);
  }
  if (verifyGates) {
    lines.push(`Verify gates: ${verifyGates.all_passed ? 'all passed' : 'conditions remain open'}`);
  }
  lines.push('');
  lines.push('Open topics:');
  if (openTopicsList.length === 0) {
    lines.push('- none recorded');
  } else {
    openTopicsList.slice(0, 5).forEach((item) => lines.push(`- ${item}`));
  }
  lines.push('');
  lines.push('Best next moves:');
  if (targetedTasks.length > 0) {
    targetedTasks.slice(0, 4).forEach((item) => lines.push(`- ${item}`));
  } else if (searchQueries.length > 0) {
    searchQueries.slice(0, 3).forEach((item) => lines.push(`- ${item}`));
  } else if (checkpoint && checkpoint.decision) {
    lines.push(`- ${checkpoint.decision}`);
  } else if (implementation && implementation.note) {
    lines.push(`- ${implementation.note}`);
  } else {
    lines.push('- Review the current result, refine or correct the request explicitly, and run the next governed cycle.');
  }

  return lines.join('\n');
}

function showResult(label, payload) {
  updateThroughputSummary(payload);
  updateVisualDashboards(payload);
  outcomeSummaryView.textContent = buildOutcomeSummary(label, payload);
  resultView.textContent = buildDecisionRecordSummary(label, payload);
  syncStageCardsFromPayload(payload);
  appendThroughputActivity(label, firstNonEmpty(buildDecisionRecordSummary(label, payload).split('\n').slice(2, 4).join(' '), 'Run output updated.'), payload && payload.error ? 'warn' : 'ok');
  focusOutputSurface();
}

function focusOutputSurface() {
  const outputCards = [resultView.closest('.card'), outcomeSummaryView.closest('.card')].filter(Boolean);
  outputCards.forEach((card) => {
    card.classList.remove('fresh-output');
    void card.offsetWidth;
    card.classList.add('fresh-output');
  });

  resultView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  window.setTimeout(() => {
    outputCards.forEach((card) => card.classList.remove('fresh-output'));
  }, 1600);
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
  artifactCount = Array.isArray(data.artifacts) ? data.artifacts.length : 0;

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

  updateMissionControl();
}

function commonPayload() {
  const obstacleX = String(geometryObstacleX.value || '80,120').split(',').map((x) => Number(x.trim()));
  const obstacleY = String(geometryObstacleY.value || '60,90').split(',').map((y) => Number(y.trim()));
  return {
    sources: sourcesInput.value || textDir.value,
    publicReferences: publicReferences.value,
    datasetRegistry: datasetRegistry.value,
    runtimeProvider: runtimeProvider.value,
    taskMode: taskMode.value,
    executionMode: executionMode.value,
    byomProviderType: byomProviderType.value,
    byomEndpoint: byomEndpoint.value,
    byomApiKey: byomApiKey.value,
    byomTemperature: Number(byomTemperature.value || 0.2),
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
    collaborationMode: collaborationMode.value,
    userRequests: userRequests.value,
    openTopics: openTopics.value,
    continuationNotes: continuationNotes.value,
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

function populateSelectOptions(target, values, currentValue, customLabel = 'Custom...') {
  if (!target) return;
  target.innerHTML = '';
  const seen = new Set();
  const normalizedCurrent = String(currentValue || '').trim();
  const parentFolder = getParentFolder(normalizedCurrent);

  if (parentFolder && parentFolder !== normalizedCurrent) {
    const parentOption = document.createElement('option');
    parentOption.value = PARENT_OPTION_VALUE;
    parentOption.textContent = `.. Parent Folder (${parentFolder})`;
    target.appendChild(parentOption);
  }

  if (normalizedCurrent) {
    const currentOption = document.createElement('option');
    currentOption.value = normalizedCurrent;
    currentOption.textContent = normalizedCurrent;
    currentOption.selected = true;
    target.appendChild(currentOption);
    seen.add(normalizedCurrent);
  }

  (Array.isArray(values) ? values : []).forEach((value) => {
    if (!value || seen.has(value)) return;
    seen.add(value);
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    target.appendChild(option);
  });

  const customOption = document.createElement('option');
  customOption.value = CUSTOM_OPTION_VALUE;
  customOption.textContent = customLabel;
  target.appendChild(customOption);

  if (normalizedCurrent && seen.has(normalizedCurrent)) {
    target.value = normalizedCurrent;
  } else {
    target.value = CUSTOM_OPTION_VALUE;
  }
}

function syncPickerSelection(selectEl, inputEl) {
  if (!selectEl || !inputEl) return;
  const useCustom = selectEl.value === CUSTOM_OPTION_VALUE;
  inputEl.classList.toggle('hidden', !useCustom);
  if (!useCustom) {
    inputEl.value = selectEl.value;
  }
}

function isFolderPicker(selectEl) {
  return selectEl === inputDirSelect
    || selectEl === ocrDirSelect
    || selectEl === textDirSelect
    || selectEl === sourcesInputSelect;
}

async function loadPathOptions() {
  try {
    const params = new URLSearchParams({
      inputDir: inputDir.value || '',
      ocrDir: ocrDir.value || '',
      textDir: textDir.value || '',
      sources: sourcesInput.value || ''
    });
    const res = await fetch(`/api/path-options?${params.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    populateSelectOptions(inputDirSelect, data.inputDirs, inputDir.value, 'Custom input folder...');
    populateSelectOptions(ocrDirSelect, data.outputDirs, ocrDir.value, 'Custom OCR output folder...');
    populateSelectOptions(textDirSelect, data.outputDirs, textDir.value, 'Custom text output folder...');
    populateSelectOptions(sourcesInputSelect, data.sourcePaths, sourcesInput.value, 'Custom source path(s)...');
    populateSelectOptions(excludeFilesSelect, data.excludeFiles, excludeFiles.value, 'Custom exclude file(s)...');
    populateSelectOptions(includePrefixesSelect, data.includePrefixes, includePrefixes.value, 'Custom prefix list...');

    syncPickerSelection(inputDirSelect, inputDir);
    syncPickerSelection(ocrDirSelect, ocrDir);
    syncPickerSelection(textDirSelect, textDir);
    syncPickerSelection(sourcesInputSelect, sourcesInput);
    syncPickerSelection(excludeFilesSelect, excludeFiles);
    syncPickerSelection(includePrefixesSelect, includePrefixes);
  } catch (_error) {
    // Keep manual entry working even if suggestions fail to load.
  }
}

function normalizeFolderPath(value) {
  return String(value || '').trim().replace(/[\/]+$/, '');
}

function getParentFolder(value) {
  const normalized = normalizeFolderPath(value);
  if (!normalized) return '';

  const windowsRootMatch = normalized.match(/^[A-Za-z]:$/);
  if (windowsRootMatch) {
    return normalized;
  }

  if (/^[A-Za-z]:\\/.test(normalized)) {
    const withoutLast = normalized.replace(/\\[^\\]+$/, '');
    return withoutLast || normalized;
  }

  if (normalized.includes('/')) {
    const withoutLast = normalized.replace(/\/[^/]+$/, '');
    return withoutLast || normalized;
  }

  return normalized;
}

function navigatePickerUp(selectEl, inputEl) {
  const currentValue = inputEl.value || (selectEl ? selectEl.value : '');
  const parent = getParentFolder(currentValue);
  if (!parent || parent === currentValue) return;
  inputEl.value = parent;
  if (selectEl) {
    selectEl.value = CUSTOM_OPTION_VALUE;
    syncPickerSelection(selectEl, inputEl);
  }
  loadPathOptions();
  renderRuntimeGuide();
  renderInputRegistry();
}

function renderInputRegistry() {
  inputRegistryView.textContent = JSON.stringify({
    public_references: parseLineList(publicReferences.value),
    user_datasets: parseLineList(datasetRegistry.value),
    sources_used: sourcesInput.value || textDir.value,
    collaboration_context: {
      mode: collaborationMode.value,
      user_requests: userRequests.value.trim() || null,
      open_topics: parseLineList(openTopics.value),
      continuation_notes: continuationNotes.value.trim() || null
    },
    runtime_provider: runtimeProvider.value,
    model_selection: {
      proposal: modelProposal.value,
      critique: modelCritique.value,
      assess: modelAssess.value
    }
  }, null, 2);
  updateMissionControl();
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
        selected_profile: useCaseProfile.value || 'custom',
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
  resetRoleStageCards();
  resetThroughputShowcase();
  appendThroughputActivity('Run Queued', 'A new governed cycle has started and stage activity will appear below.', 'neutral');
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
  appendThroughputActivity(eventLabel, details, tone);
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
    setCycleSnapshots([{ label: `C${step.cycle}`, score: 10 + (step.cycle * 10), coverage: 12 + (step.cycle * 8) }], `cycle ${step.cycle}`);
    setRoleStageActivity('propose', `Cycle ${step.cycle}`, step.proposal || 'Proposal prepared.', `Cycle ${step.cycle}: ${step.proposal || 'Proposal prepared.'}`);
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
    setRoleStageActivity('critique', `Cycle ${step.cycle}`, `${step.critique || 'Critique completed.'}${risks}`, `Cycle ${step.cycle}: ${step.critique || 'Critique completed.'}`);
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

    setRoleStageActivity('assess', `Cycle ${step.cycle}`, `Verdict: ${step.verdict || 'unknown'}. Human control: ${control}.`, `Cycle ${step.cycle}: ${scoreText}, ${coverageText}, ${deltaText}.`);
    const verifyState = step.verify_gates ? (step.verify_gates.all_passed ? 'Ready' : 'Review') : 'Assessing';
    const verifyActivity = step.verify_gates
      ? `Cycle ${step.cycle}: verify gates ${step.verify_gates.all_passed ? 'passed' : 'need review'}.`
      : `Cycle ${step.cycle}: governance waiting for verify gates.`;
    setRoleStageActivity('governor', verifyState, `Human control: ${control}.`, verifyActivity);
    setCycleSnapshots([{ label: `C${step.cycle}`, score: step.scoring && step.scoring.weighted_score_100 ? step.scoring.weighted_score_100 : 0, coverage: step.scoring && step.scoring.coverage_ratio ? Math.round(step.scoring.coverage_ratio * 100) : 0 }], `cycle ${step.cycle}`);
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
          setProcessFlowFromDebateEvent('start', data);
          appendDebateEvent('Debate Started', data.message || 'Live debate has started.', 'neutral');
          return;
        }

        if (evt === 'cycle-start') {
          appendDebateEvent(`Cycle ${data.cycle}/${data.total_cycles}`, data.message || 'Cycle started.', 'neutral');
          return;
        }

        if (evt === 'framework') {
          setProcessFlowFromDebateEvent('framework', data);
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
          setProcessFlowFromDebateEvent('dataset-selection', data);
          appendDebateEvent(
            'Dataset Selection',
            `Using ${data.source_count} source files (selected ${data.selected_files}/${data.discovered_files}). Preview: ${(data.source_preview || []).join(', ') || 'n/a'}`,
            'neutral'
          );
          return;
        }

        if (evt === 'step') {
          setProcessFlowFromDebateEvent('step', data);
          renderStepEvent(data);
          return;
        }

        if (evt === 'artifact') {
          appendDebateEvent('Artifact Saved', data.file_name || 'Live debate artifact saved.', 'neutral');
          return;
        }

        if (evt === 'final') {
          setProcessFlowFromDebateEvent('final', data);
          finalPayload = data;
          outcomeSummaryView.textContent = buildOutcomeSummary('Live Debate Completed', data);
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
            setRoleStageActivity(
              'governor',
              data.route_recommendation.recommended_mode || 'Routed',
              data.route_recommendation.reason || 'Governance route generated.',
              `Final route: ${data.route_recommendation.recommended_mode || 'n/a'}`
            );
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
    corpusPreviewView.textContent = `Source preview failed: ${error.message}`;
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
          updateFlowFromPipelineStage(data.stage, data.status, data.detail);
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
          outcomeSummaryView.textContent = buildOutcomeSummary('Pipeline Completed', data);
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
            setRoleStageActivity(
              'governor',
              route.recommended_mode || 'Routed',
              route.reason || 'Governance route generated.',
              `Pipeline route: ${route.recommended_mode || 'n/a'}`
            );
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

loadPathOptions();

[
  [inputDirSelect, inputDir],
  [ocrDirSelect, ocrDir],
  [textDirSelect, textDir],
  [sourcesInputSelect, sourcesInput],
  [excludeFilesSelect, excludeFiles],
  [includePrefixesSelect, includePrefixes]
].forEach(([selectEl, inputEl]) => {
  selectEl.addEventListener('change', () => {
    if (isFolderPicker(selectEl) && selectEl.value === PARENT_OPTION_VALUE) {
      navigatePickerUp(selectEl, inputEl);
      return;
    }

    syncPickerSelection(selectEl, inputEl);
    renderRuntimeGuide();
    renderInputRegistry();
    if (
      selectEl === inputDirSelect ||
      selectEl === ocrDirSelect ||
      selectEl === textDirSelect ||
      selectEl === sourcesInputSelect
    ) {
      loadPathOptions();
    }
  });
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
  byomProviderType,
  byomEndpoint,
  byomApiKey,
  byomTemperature,
  sourcesInput,
  inputDir,
  ocrDir,
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
  el.addEventListener('input', scheduleDraftSave);
  el.addEventListener('change', scheduleDraftSave);
});

[inputDir, textDir, sourcesInput].forEach((el) => {
  el.addEventListener('change', loadPathOptions);
  el.addEventListener('blur', loadPathOptions);
  el.addEventListener('blur', scheduleDraftSave);
});

btnSaveDraft.addEventListener('click', () => {
  persistDraft('saved');
});

btnRestoreDraft.addEventListener('click', () => {
  restoreSavedDraft();
});

btnClearDraft.addEventListener('click', () => {
  clearSavedDraft();
});

if (btnContinueSession) {
  btnContinueSession.addEventListener('click', () => {
    restoreSavedDraft();
  });
}

if (quickInputBar) {
  quickInputBar.addEventListener('input', () => {
    const value = quickInputBar.value.trim();
    setQuickInputStatus(value ? 'Press Enter to send. Use Alt+Enter for a new line.' : 'Enter sends immediately into the live request. Alt+Enter adds a line break.');
  });

  quickInputBar.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || event.isComposing) {
      return;
    }
    if (event.altKey) {
      return;
    }
    event.preventDefault();
    await submitQuickInputToPipeline();
  });
}

if (composerChips.length > 0 && quickInputBar) {
  composerChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt || '';
      if (!prompt) return;
      quickInputBar.value = prompt;
      quickInputBar.focus();
      quickInputBar.setSelectionRange(quickInputBar.value.length, quickInputBar.value.length);
      setQuickInputStatus('Starter prompt loaded. Press Enter to send or edit it first.');
    });
  });
}

if (btnQueueRequest) {
  btnQueueRequest.addEventListener('click', () => {
    const value = consumeQuickInput();
    if (!value) return;
    appendTextBlock(userRequests, value);
    clearQuickInput('Added to User Requests and saved into the active session.');
  });
}

if (btnQueueTopic) {
  btnQueueTopic.addEventListener('click', () => {
    const value = consumeQuickInput();
    if (!value) return;
    appendTextBlock(openTopics, value);
    clearQuickInput('Added to Open Topics and saved into the active session.');
  });
}

if (btnRunFromBar) {
  btnRunFromBar.addEventListener('click', async () => {
    await submitQuickInputToPipeline();
  });
}

if (btnMissionFramework) {
  btnMissionFramework.addEventListener('click', () => btnFramework.click());
}

if (btnMissionResearch) {
  btnMissionResearch.addEventListener('click', () => btnResearch.click());
}

if (btnMissionEvidence) {
  btnMissionEvidence.addEventListener('click', () => btnEvidence.click());
}

if (btnMissionDebate) {
  btnMissionDebate.addEventListener('click', () => btnLiveDebate.click());
}

if (btnMissionPipeline) {
  btnMissionPipeline.addEventListener('click', () => btnPipeline.click());
}

useCaseProfile.addEventListener('change', () => {
  applyUseCaseProfile(useCaseProfile.value);
  renderUseCaseHub();
  updateSelectedUseCaseNote();
});

modelPack.addEventListener('change', () => {
  applyModelPack(modelPack.value);
  renderRuntimeGuide();
  renderInputRegistry();
});

themePreset.addEventListener('change', () => {
  applyTheme(themePreset.value);
});

themePreviewGrid.querySelectorAll('.theme-card').forEach((card) => {
  card.addEventListener('click', () => {
    applyTheme(card.dataset.themeOption);
  });
});

[
  themeBg,
  themeCard,
  themeCardAlpha,
  themeInnerAlpha,
  themeInk,
  themeFontSans,
  themeFontMono,
  themeLine,
  themeAccent,
  themeAccent2,
  themeMuted,
  themeBgStart,
  themeBgEnd,
  themeGradientAngle
].forEach((control) => {
  control.addEventListener('input', applyThemeControlOverrides);
  control.addEventListener('change', applyThemeControlOverrides);
});

taskMode.addEventListener('change', () => {
  maybeApplySuggestedModelPack();
  renderTaskExecutionMode();
  renderRuntimeGuide();
  renderInputRegistry();
});

executionMode.addEventListener('change', () => {
  renderTaskExecutionMode();
  renderRuntimeGuide();
  renderInputRegistry();
});

applyModelPack(modelPack.value);
renderTaskExecutionMode();
applyTheme(themePreset.value);

renderRuntimeGuide();
renderInputRegistry();
renderUseCaseHub();
updateSelectedUseCaseNote();
updateMissionControl();
updateActiveSection('top-output');
setupSectionObserver();
renderRoleStageCards();
resetThroughputShowcase();
renderProcessFlow();

const savedDraft = safeGetDraft();
if (savedDraft) {
  setDraftStatus(`Saved session available from ${formatDraftTimestamp(savedDraft.savedAt)}.`);
} else {
  setDraftStatus('Session persistence ready. Inputs, discussion trail, and visible outputs autosave in this browser.');
}

window.addEventListener('beforeunload', () => {
  persistDraft('saved before exit');
});
