const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const scriptPath = path.resolve(__dirname, '..', 'integrations', 'z3', 'geometry_solver.py');

function probePythonWithZ3() {
  const candidates = [
    { cmd: process.env.PCA_Z3_PYTHON || 'python', prefix: [] },
    { cmd: 'py', prefix: ['-3'] }
  ];

  for (const candidate of candidates) {
    const probe = spawnSync(candidate.cmd, [...candidate.prefix, '-c', 'import z3; print("ok")'], {
      encoding: 'utf8'
    });

    if (probe.status === 0 && String(probe.stdout || '').toLowerCase().includes('ok')) {
      return {
        available: true,
        cmd: candidate.cmd,
        prefix: candidate.prefix
      };
    }
  }

  return { available: false, cmd: null, prefix: [] };
}

const pythonProbe = probePythonWithZ3();
const skipReason = 'Python with z3-solver is not available. Install via: pip install -r requirements-z3.txt';

function runGeometrySolver(payload) {
  const run = spawnSync(
    pythonProbe.cmd,
    [...pythonProbe.prefix, scriptPath],
    {
      input: JSON.stringify(payload),
      encoding: 'utf8'
    }
  );

  assert.strictEqual(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.strictEqual(parsed.ok, true, JSON.stringify(parsed));
  return parsed;
}

test('z3 geometry solver finds accessible placement when constraints are satisfiable', {
  skip: !pythonProbe.available ? skipReason : false
}, () => {
  const result = runGeometrySolver({
    room: { x_min: 0, x_max: 200, y_min: 0, y_max: 150 },
    obstacle: { x_min: 80, x_max: 120, y_min: 60, y_max: 90 },
    radius: 30
  });

  assert.strictEqual(result.status, 'sat');
  assert.strictEqual(typeof result.center.x, 'number');
  assert.strictEqual(typeof result.center.y, 'number');
});

test('z3 geometry solver reports unsat when room is over-constrained', {
  skip: !pythonProbe.available ? skipReason : false
}, () => {
  const result = runGeometrySolver({
    room: { x_min: 0, x_max: 100, y_min: 0, y_max: 80 },
    obstacle: { x_min: 20, x_max: 80, y_min: 10, y_max: 70 },
    radius: 30
  });

  assert.strictEqual(result.status, 'unsat');
});
