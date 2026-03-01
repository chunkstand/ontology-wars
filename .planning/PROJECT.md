# Ontology Wars

## What This Is

Ontology Wars is Standing Framework’s open training arena for AI ontology agents. It runs multi‑agent competitions on real Montana government datasets across Build, Attack, and Interrogate phases, then delivers production‑ready ontologies via webhook to downstream systems. It is model‑agnostic and designed for internet‑accessible agents using a Push API protocol.

## Core Value

Train and validate AI ontology agents on real government data so the resulting schemas are accurate enough to ship into production databases.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Run 4‑agent tournaments across Build → Attack → Interrogate phases using curated government datasets
- [ ] Score and rank agents with a production‑readiness gate and visible report cards
- [ ] Deliver completed ontology payloads via webhook to a configurable endpoint

### Out of Scope

- User‑uploaded datasets — v1 uses curated SF datasets only
- Persistent backend storage — v1 is browser‑hosted with session‑only vault
- Webhook signatures / HMAC — v1 has none (receivers handle auth)

## Context

- Platform goal is twofold: improve agent accuracy through competition and generate validated ontologies for Standing Framework database ingestion.
- Three curated datasets (Tier 1–3) with statutory constraints and stress‑test traces; no raw PII in datasets (field‑spec format only).
- Match phases:
  - **Build:** agents output ontology JSON (ObjectTypes/LinkTypes/ActionTypes)
  - **Attack:** agents file one formal objection against a rival; judge sustains or overrules
  - **Interrogate:** judge queries + workflow stress test to confirm schema can answer real questions
- Scoring is weighted toward accuracy; production readiness requires threshold gates on accuracy, structural integrity, natural keys, and stress‑test coverage.
- Model‑agnostic adapter supports Anthropic, OpenAI, Mistral, Ollama, and custom endpoints via a normalized callModel() interface.
- Webhook sends full ontology payloads plus report card after each match; delivery is best‑effort with no retries.

## Constraints

- **Performance:** Build phase wall‑clock time ≤90s (Tier 1), ≤150s (Tier 2), ≤240s (Tier 3)
- **Security:** API keys are held only in React component state (no persistence)
- **Compatibility:** Chrome 120+, Safari 17+, Firefox 121+, Edge 120+; ES2022 async/await required
- **Reliability:** Model timeout = 30s per call; timeouts score 0 for that phase component

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 3‑phase match structure (Build/Attack/Interrogate) | Surfaces accuracy, adversarial errors, and queryability | — Pending |
| 4‑agent single‑elimination bracket | Clear tournament flow and comparability | — Pending |
| Model‑agnostic adapter (callModel) | Avoid provider lock‑in and support external agents | — Pending |
| Production‑readiness gates | Ensure only high‑quality ontologies are eligible for ingestion | — Pending |
| Webhook delivery best‑effort (no retry) | Keep v1 browser‑hosted and simple | — Pending |

---
*Last updated: 2026-02-28 after initialization*
