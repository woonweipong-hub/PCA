#!/usr/bin/env python3
"""Z3 geometric constraint solver for PCA adaptive verification demos.

Reads a JSON payload from stdin and returns a JSON result to stdout.
Payload schema:
{
  "room": {"x_min": 0, "x_max": 200, "y_min": 0, "y_max": 150},
  "obstacle": {"x_min": 80, "x_max": 120, "y_min": 60, "y_max": 90},
  "radius": 30
}
"""

import json
import sys

try:
    from z3 import Or, Reals, Solver, sat
except Exception as exc:  # pragma: no cover
    sys.stdout.write(json.dumps({
        "ok": False,
        "error": "z3_unavailable",
        "message": str(exc)
    }))
    sys.exit(2)


def _read_payload():
    raw = sys.stdin.read().strip()
    if not raw:
        return {
            "room": {"x_min": 0, "x_max": 200, "y_min": 0, "y_max": 150},
            "obstacle": {"x_min": 80, "x_max": 120, "y_min": 60, "y_max": 90},
            "radius": 30,
        }
    return json.loads(raw)


def _to_float(model_value):
    text = str(model_value)
    if text.endswith("?"):
        text = text[:-1]
    if "/" in text:
        num, den = text.split("/", 1)
        return float(num) / float(den)
    return float(text)


def solve_circle_placement(payload):
    room = payload.get("room", {})
    obstacle = payload.get("obstacle", {})
    radius = float(payload.get("radius", 30))

    solver = Solver()
    x, y = Reals("x y")

    room_x_min = float(room.get("x_min", 0)) + radius
    room_x_max = float(room.get("x_max", 200)) - radius
    room_y_min = float(room.get("y_min", 0)) + radius
    room_y_max = float(room.get("y_max", 150)) - radius

    # Circle center must stay inside room after accounting for radius.
    solver.add(room_x_min <= x, x <= room_x_max)
    solver.add(room_y_min <= y, y <= room_y_max)

    # Rectangle obstacle expanded by radius so center must be outside expanded bounds.
    obs_x_min = float(obstacle.get("x_min", 80)) - radius
    obs_x_max = float(obstacle.get("x_max", 120)) + radius
    obs_y_min = float(obstacle.get("y_min", 60)) - radius
    obs_y_max = float(obstacle.get("y_max", 90)) + radius

    cond_left = x <= obs_x_min
    cond_right = x >= obs_x_max
    cond_below = y <= obs_y_min
    cond_above = y >= obs_y_max
    solver.add(Or(cond_left, cond_right, cond_below, cond_above))

    if solver.check() == sat:
        model = solver.model()
        return {
            "ok": True,
            "status": "sat",
            "center": {
                "x": _to_float(model[x]),
                "y": _to_float(model[y]),
            },
            "radius": radius,
            "room": room,
            "obstacle": obstacle,
        }

    return {
        "ok": True,
        "status": "unsat",
        "radius": radius,
        "room": room,
        "obstacle": obstacle,
    }


def main():
    try:
        payload = _read_payload()
        result = solve_circle_placement(payload)
        sys.stdout.write(json.dumps(result))
    except Exception as exc:  # pragma: no cover
        sys.stdout.write(json.dumps({
            "ok": False,
            "error": "solver_runtime_error",
            "message": str(exc)
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
