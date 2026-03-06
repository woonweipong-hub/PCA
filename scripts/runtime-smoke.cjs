#!/usr/bin/env node
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HOST = process.env.PCA_UI_HOST || '127.0.0.1';
const PORT = Number(process.env.PCA_SMOKE_PORT || process.env.PCA_UI_PORT || 4183);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestJson(method, pathname, payload) {
  return new Promise((resolve, reject) => {
    const body = payload ? JSON.stringify(payload) : '';
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        method,
        path: pathname,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(body)
            }
          : undefined,
        timeout: 120000
      },
      (res) => {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = raw ? JSON.parse(raw) : null;
          } catch (error) {
            reject(new Error(`Failed to parse JSON from ${pathname}: ${error.message}`));
            return;
          }

          if (res.statusCode >= 400) {
            const message = parsed && parsed.error ? parsed.error : `${res.statusCode} ${res.statusMessage}`;
            reject(new Error(`${pathname} failed: ${message}`));
            return;
          }

          resolve(parsed);
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error(`Request timeout for ${pathname}`));
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function requestSse(pathname, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload || {});
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        method: 'POST',
        path: pathname,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 180000
      },
      (res) => {
        if (res.statusCode >= 400) {
          let errRaw = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            errRaw += chunk;
          });
          res.on('end', () => {
            reject(new Error(`${pathname} failed: ${errRaw || `${res.statusCode} ${res.statusMessage}`}`));
          });
          return;
        }

        let buffer = '';
        const events = [];

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          buffer += chunk;
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const lines = part.split(/\r?\n/);
            let eventName = 'message';
            const dataLines = [];
            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5).trim());
              }
            }

            let data = null;
            const joined = dataLines.join('\n');
            if (joined) {
              try {
                data = JSON.parse(joined);
              } catch {
                data = joined;
              }
            }

            events.push({ event: eventName, data });
          }
        });

        res.on('end', () => {
          resolve(events);
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error(`SSE timeout for ${pathname}`));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

async function isHealthy() {
  try {
    const health = await requestJson('GET', '/api/health');
    return Boolean(health && health.ok);
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await isHealthy()) {
    return { child: null, startedByScript: false };
  }

  const child = spawn('node', ['web/server.cjs'], {
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      PCA_UI_HOST: HOST,
      PCA_UI_PORT: String(PORT)
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  for (let i = 0; i < 30; i += 1) {
    if (await isHealthy()) {
      return { child, startedByScript: true };
    }

    if (child.exitCode !== null) {
      throw new Error(`UI server exited before health check passed. ${stderr || ''}`.trim());
    }

    await sleep(500);
  }

  child.kill('SIGTERM');
  throw new Error('Timed out waiting for UI server health check.');
}

function basePayload(runtimeProvider) {
  return {
    runtimeProvider,
    modelSelection: {
      proposal: 'gpt-5.3-codex',
      critique: 'gpt-5.3-codex',
      assess: 'gpt-5.3-codex',
      notes: `runtime-smoke:${runtimeProvider}`
    },
    mode: 'verify',
    decision: 'Interpret regulatory requirements for compliance readiness',
    context: 'Runtime smoke validation',
    objective: 'Confirm end-to-end runtime behavior is healthy and governed',
    sources: 'data/public-pdf-text',
    policy: 'strict',
    cycles: 1,
    passStrategy: 'adaptive',
    riskLevel: 'low',
    publicReferences: 'BCA Act\nSCDF Fire Code',
    datasetRegistry: 'data/public-pdf-text',
    maxFiles: 20,
    minSources: 2,
    minTotalClaims: 4,
    prioritizeRequirements: true
  };
}

function assertDebateEvents(runtime, events) {
  const finalEvent = events.find((evt) => evt.event === 'final');
  if (!finalEvent || !finalEvent.data) {
    throw new Error(`${runtime}: missing final event from /api/debate-live`);
  }

  const payload = finalEvent.data;
  if (!payload.verify_gates || typeof payload.verify_gates.all_passed !== 'boolean') {
    throw new Error(`${runtime}: final payload missing verify_gates`);
  }
  if (!payload.route_recommendation || !payload.route_recommendation.recommended_mode) {
    throw new Error(`${runtime}: final payload missing route_recommendation`);
  }
}

function assertPipelineEvents(runtime, events) {
  const finalEvent = events.find((evt) => evt.event === 'final');
  if (!finalEvent || !finalEvent.data) {
    throw new Error(`${runtime}: missing final event from /api/run-pipeline`);
  }

  const payload = finalEvent.data;
  const route = payload.output && payload.output.route ? payload.output.route : null;
  const verify = payload.output && payload.output.recommend ? payload.output.recommend.verify_gates : null;

  if (!route || !route.recommended_mode) {
    throw new Error(`${runtime}: pipeline output missing route recommendation`);
  }
  if (!verify || typeof verify.all_passed !== 'boolean') {
    throw new Error(`${runtime}: pipeline output missing verify gate summary`);
  }
}

async function runRuntimeSmoke(runtimeProvider) {
  const payload = basePayload(runtimeProvider);

  const debateEvents = await requestSse('/api/debate-live', payload);
  assertDebateEvents(runtimeProvider, debateEvents);

  const pipelineEvents = await requestSse('/api/run-pipeline', payload);
  assertPipelineEvents(runtimeProvider, pipelineEvents);

  return {
    runtime: runtimeProvider,
    debate_events: debateEvents.length,
    pipeline_events: pipelineEvents.length
  };
}

async function main() {
  const requested = process.argv.slice(2);
  const runtimes = requested.length > 0 ? requested : ['copilot', 'antigravity'];

  // Keep explicit order: Copilot first, then Antigravity.
  const ordered = ['copilot', 'antigravity'].filter((r) => runtimes.includes(r));
  const extras = runtimes.filter((r) => !ordered.includes(r));
  const finalOrder = [...ordered, ...extras];

  const { child, startedByScript } = await ensureServer();
  const results = [];

  try {
    for (const runtime of finalOrder) {
      const result = await runRuntimeSmoke(runtime);
      results.push(result);
      process.stdout.write(`[ok] ${runtime} runtime smoke passed (debate events=${result.debate_events}, pipeline events=${result.pipeline_events})\n`);
    }

    process.stdout.write('\nRuntime smoke summary:\n');
    results.forEach((result) => {
      process.stdout.write(`- ${result.runtime}: debate=${result.debate_events}, pipeline=${result.pipeline_events}\n`);
    });
  } finally {
    if (startedByScript && child && child.exitCode === null) {
      child.kill('SIGTERM');
    }
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
