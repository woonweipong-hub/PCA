# Release Checklist

Use this checklist before publishing PCA updates.

## Code and Tests

- [ ] `npm test` passes.
- [ ] New commands have CLI + core tests.
- [ ] Backward compatibility for existing command outputs is preserved.

## Documentation Consistency

- [ ] README examples match current command behavior.
- [ ] USER-GUIDE and COMMAND-REFERENCE are aligned.
- [ ] SCHEMA.md reflects any output contract changes.
- [ ] Docs smoke tests pass.

## Operational Assurance

- [ ] PDF conversion path verified (`convert:pdf`).
- [ ] OCR fallback path verified (`ocr:pdf`) where relevant.
- [ ] Quality gate (`quality-check`) validated on representative dataset.
- [ ] HITL/HOTL escalation behavior verified.

## Governance and Auditability

- [ ] Persisted outputs include verdict, actions, and rationale.
- [ ] Risk flags and escalation reasons are traceable.
- [ ] Any policy threshold changes are documented.
