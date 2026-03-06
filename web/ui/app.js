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
  const cards = [
    {
      title: 'Why PCA Helps FoC AI',
      body: 'PCA improves raw AI output by separating proposal, critique, assessment, and governance instead of relying on a single unstructured answer.'
    },
    {
      title: active.title,
      body: active.body
    },
    {
      title: 'FoC and BYOM Paths',
      body: 'Use Ollama for the fastest free local path, or BYOM for DeepSeek, Qwen, and other compatible models exposed through your own endpoint.'
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

  renderRuntimeModePanel();
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
});

[inputDir, textDir, sourcesInput].forEach((el) => {
  el.addEventListener('change', loadPathOptions);
  el.addEventListener('blur', loadPathOptions);
});

useCaseProfile.addEventListener('change', () => {
  applyUseCaseProfile(useCaseProfile.value);
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
