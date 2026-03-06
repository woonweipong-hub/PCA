const statusEl = document.getElementById('status');
const resultView = document.getElementById('resultView');
const artifactList = document.getElementById('artifactList');

const inputDir = document.getElementById('inputDir');
const ocrDir = document.getElementById('ocrDir');
const textDir = document.getElementById('textDir');
const decision = document.getElementById('decision');
const objective = document.getElementById('objective');
const contextText = document.getElementById('context');
const expectations = document.getElementById('expectations');
const researchNeeds = document.getElementById('researchNeeds');
const constraints = document.getElementById('constraints');
const activeSearchEnabled = document.getElementById('activeSearchEnabled');
const policy = document.getElementById('policy');
const runtimeProvider = document.getElementById('runtimeProvider');
const maxFiles = document.getElementById('maxFiles');
const debateCycles = document.getElementById('debateCycles');
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
const btnRefreshArtifacts = document.getElementById('btnRefreshArtifacts');

const debateState = document.getElementById('debateState');
const debateTimeline = document.getElementById('debateTimeline');
const humanCheckpoint = document.getElementById('humanCheckpoint');
const checkpointDecision = document.getElementById('checkpointDecision');
const checkpointReason = document.getElementById('checkpointReason');
const frameworkView = document.getElementById('frameworkView');
const scoringView = document.getElementById('scoringView');

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
  return {
    sources: textDir.value,
    runtimeProvider: runtimeProvider.value,
    objective: objective.value,
    expectations: expectations.value,
    researchNeeds: researchNeeds.value,
    constraints: constraints.value,
    activeSearchEnabled: Boolean(activeSearchEnabled.checked),
    maxFiles: Number(maxFiles.value || 200),
    minSources: Number(minSources.value || 2),
    minTotalClaims: Number(minClaims.value || 6)
  };
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
        data_inputs: data.result.data_inputs || null
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
      inputDir: inputDir.value,
      outputDir: textDir.value,
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
  try {
    setBusy('Pipeline: convert -> quality -> evidence ...');
    const convertData = await callApi('/api/convert-pdf', {
      runtimeProvider: runtimeProvider.value,
      inputDir: inputDir.value,
      outputDir: textDir.value,
      recursive: true
    });

    const qualityData = await callApi('/api/quality-check', {
      ...commonPayload(),
      minAvgClaimsPerDoc: 2,
      prioritizeRequirements: true
    });

    if (!qualityData.result.quality_gate.ready_for_evidence_check) {
      showResult('Pipeline Stopped (Quality Gate Failed)', {
        convert: convertData,
        quality: qualityData
      });
      await refreshArtifacts();
      clearBusy('Pipeline stopped at quality gate');
      return;
    }

    const evidenceData = await callApi('/api/evidence-check', {
      ...commonPayload(),
      decision: decision.value,
      context: contextText.value,
      policy: policy.value,
      prioritizeRequirements: true,
      mode: 'verify'
    });

    showResult('Pipeline Completed', {
      convert: convertData,
      quality: qualityData,
      evidence: evidenceData
    });
    await refreshArtifacts();
    clearBusy('Pipeline complete');
  } catch (error) {
    showResult('Pipeline Error', { error: error.message });
    clearBusy('Pipeline failed');
  }
});

btnLiveDebate.addEventListener('click', runLiveDebate);

btnRefreshArtifacts.addEventListener('click', refreshArtifacts);

refreshArtifacts().catch((error) => {
  showResult('Artifact Load Error', { error: error.message });
});
