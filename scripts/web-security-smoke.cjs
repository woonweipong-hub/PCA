#!/usr/bin/env node
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HOST = process.env.PCA_UI_HOST || '127.0.0.1';
const PORT = Number(process.env.PCA_WEB_SECURITY_SMOKE_PORT || 4184);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function request(method, pathname, { headers = {}, payload } = {}) {
  return new Promise((resolve, reject) => {
    const body = payload === undefined ? '' : JSON.stringify(payload);
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        method,
        path: pathname,
        headers: payload === undefined
          ? headers
          : {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            ...headers
          },
        timeout: 120000
      },
      (res) => {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let parsed = raw;
          if ((res.headers['content-type'] || '').includes('application/json')) {
            try {
              parsed = raw ? JSON.parse(raw) : null;
            } catch (error) {
              reject(new Error(`failed to parse JSON from ${pathname}: ${error.message}`));
              return;
            }
          }
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error(`request timeout for ${pathname}`));
    });
    req.on('error', reject);

    if (payload !== undefined) {
      req.write(body);
    }
    req.end();
  });
}

function requestRaw(method, pathname, { headers = {}, body = '' } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        method,
        path: pathname,
        headers: body
          ? {
            'Content-Length': Buffer.byteLength(body),
            ...headers
          }
          : headers,
        timeout: 120000
      },
      (res) => {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let parsed = raw;
          if ((res.headers['content-type'] || '').includes('application/json')) {
            try {
              parsed = raw ? JSON.parse(raw) : null;
            } catch (error) {
              reject(new Error(`failed to parse JSON from ${pathname}: ${error.message}`));
              return;
            }
          }
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error(`request timeout for ${pathname}`));
    });
    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function isHealthy() {
  try {
    const response = await request('GET', '/api/health');
    return response.statusCode === 200 && response.body && response.body.ok === true;
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

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isHealthy()) {
      return { child, startedByScript: true };
    }
    if (child.exitCode !== null) {
      throw new Error(`web security smoke server exited early. ${stderr || ''}`.trim());
    }
    await sleep(500);
  }

  child.kill('SIGTERM');
  throw new Error('timed out waiting for web security smoke server');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const { child, startedByScript } = await ensureServer();

  try {
    const health = await request('GET', '/api/health');
    assert(health.statusCode === 200 && health.body && health.body.ok === true, 'health check failed');

    const pathOptions = await request('GET', '/api/path-options?inputDir=data&ocrDir=data%2Fpublic-pdf-ocr&textDir=data%2Fpublic-pdf-text&sources=data%2Fpublic-pdf-text');
    assert(pathOptions.statusCode === 200, 'path options request failed');
    assert(Array.isArray(pathOptions.body.allowedRoots) && pathOptions.body.allowedRoots.includes('data'), 'allowed roots missing data');
    assert(!pathOptions.body.allowedRoots.includes('C:\\'), 'unexpected broad root exposed');

    const approvedEvidence = await request('POST', '/api/evidence-check', {
      payload: {
        runtimeProvider: 'copilot',
        mode: 'verify',
        decision: 'web security smoke',
        context: 'approved-source request',
        sources: 'data/public-pdf-text',
        policy: 'strict',
        maxFiles: 2,
        minSources: 1,
        minTotalClaims: 1,
        prioritizeRequirements: true
      }
    });
    assert(approvedEvidence.statusCode === 200, 'approved evidence-check failed');

    const badOrigin = await request('POST', '/api/evidence-check', {
      headers: { Origin: 'http://evil.example' },
      payload: {
        mode: 'verify',
        decision: 'bad origin',
        sources: 'data/public-pdf-text'
      }
    });
    assert(badOrigin.statusCode === 403, 'bad origin was not rejected');

    const badHost = await request('POST', '/api/evidence-check', {
      headers: { Host: 'evil.example' },
      payload: {
        mode: 'verify',
        decision: 'bad host',
        sources: 'data/public-pdf-text'
      }
    });
    assert(badHost.statusCode === 403, 'bad host header was not rejected');

    const badContentType = await requestRaw('POST', '/api/evidence-check', {
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ mode: 'verify', decision: 'bad content type', sources: 'data/public-pdf-text' })
    });
    assert(badContentType.statusCode === 415, 'non-JSON POST was not rejected');

    const outsideSources = await request('POST', '/api/evidence-check', {
      payload: {
        mode: 'verify',
        decision: 'outside root',
        sources: 'C:\\Windows'
      }
    });
    assert(outsideSources.statusCode === 403, 'outside-root source path was not rejected');

    process.stdout.write('[ok] web security smoke passed\n');
    process.stdout.write('- health endpoint allowed\n');
    process.stdout.write('- allowlisted path options constrained\n');
    process.stdout.write('- approved evidence-check allowed\n');
    process.stdout.write('- origin protection enforced\n');
    process.stdout.write('- host-header protection enforced\n');
    process.stdout.write('- JSON-only POST protection enforced\n');
    process.stdout.write('- source allowlist enforcement active\n');
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