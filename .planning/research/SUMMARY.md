# Project Research Summary

**Project:** Ontology Wars
**Domain:** Browser-hosted AI agent competitive ontology arena
**Researched:** 2026-02-28
**Confidence:** MEDIUM

## Executive Summary

Ontology Wars is a browser-hosted competitive arena where AI agents build, attack, and interrogate ontologies on curated government datasets, with winners delivered to downstream systems via webhook. Experts build these systems by combining deterministic validation, rubric-based judging, and tournament orchestration with strict phase boundaries and model-agnostic adapters. The research supports a client-only SPA architecture with in-memory session state, strong schema validation, and phased evaluation that exposes not just accuracy but robustness and queryability.

The recommended approach is to start with dataset/rules curation plus deterministic validation and production-readiness gates, then layer on the phase runners and tournament orchestration, and finally add reporting, leaderboard UX, and webhook delivery. This sequencing aligns with dependencies (datasets → validators → phases → orchestration → UI → delivery) and reduces the risk of gaming or misleading rankings.

Key risks include benchmark contamination, over-reliance on aggregate scores, ontology anti-patterns, and attack/interrogate gaming. Mitigations require hidden evaluation tiers, question-level metrics, pitfall scanners, standardized objection templates, and explicit coverage reporting. Webhook delivery must be idempotent with audit trails to avoid silent losses.

## Key Findings

### Recommended Stack

The stack favors a React + TypeScript SPA built with Vite, using TanStack Router/React Query for routing and async state, Zustand for session-only state, and Zod/Ajv for schema validation. This aligns with the browser-only constraint (no backend persistence) and enforces strict schema contracts for ontology JSON. Avoid SSR frameworks and any persistent client storage for API keys.

**Core technologies:**
- **React 19.2.4**: UI framework for arena controls and report cards — stable default for complex SPA UI.
- **TypeScript 5.9.3**: Type safety for ontology schemas and scoring logic — reduces schema/shape bugs.
- **Vite 8.0.0-beta.16**: Front-end dev/build tooling — fastest SPA build flow; consider Vite 7.x if avoiding beta.
- **TanStack Router + React Query**: Type-safe routing and async state — fits multi-view arena flows and model-call lifecycle.
- **Zustand**: In-memory session vault — enforces no persistence for API keys.
- **Zod/Ajv**: Runtime schema validation — required for ontology output gating.

### Expected Features

The MVP must include standardized datasets, match orchestration, validation, scoring, report cards, and a leaderboard. Differentiators are the Build → Attack → Interrogate phase structure, production-readiness gates, real government datasets, model-agnostic adapters, and webhook delivery of winning ontologies. Defer BYOD datasets, persistent accounts, and real-money prizes until after validation.

**Must have (table stakes):**
- Standardized challenges + datasets — comparable evaluation signal.
- Match orchestration and phase flow — baseline competition mechanics.
- Submission validation + schema checks — prevents invalid outputs.
- Scoring + leaderboard + report cards — core ranking and feedback loop.

**Should have (competitive):**
- Build/Attack/Interrogate phase structure — differentiates on robustness and queryability.
- Production-readiness gates — ensures ontologies are deployable.
- Webhook delivery of winning payloads — closes loop to production use.

**Defer (v2+):**
- BYOD datasets and persistent accounts — governance/security complexity.
- Real-money prizes — legal and anti-cheat overhead.

### Architecture Approach

Architecture centers on a browser runtime with discrete modules: match orchestration, phase runners, judge/scoring pipeline, model adapters, dataset/rules registry, and a session-only vault. Deterministic validation precedes any LLM judging, and outputs are routed through a dedicated judge pipeline to keep scoring auditable and reproducible.

**Major components:**
1. **Match Orchestrator** — schedules tournaments and enforces phase timeouts.
2. **Phase Runners** — Build/Attack/Interrogate execution with strict I/O schemas.
3. **Judge & Scoring** — deterministic validators + rubric scoring.
4. **Model Adapter (callModel)** — normalizes provider APIs.
5. **Dataset/Rules Registry** — curated datasets, constraints, stress tests.
6. **Session Vault + Event Log** — in-memory state and replayability.
7. **Webhook Sender** — best-effort delivery with audit trail.

### Critical Pitfalls

1. **Benchmark contamination & evaluation leakage** — keep hidden evaluation tiers, rotate sets, audit for leakage.
2. **Aggregate-only scoring** — add question-level metrics and robustness checks.
3. **Ontology anti-patterns in outputs** — gate with ODP-aware checks and pitfall scanners.
4. **Attack phase gaming** — require evidence-based objections and standardized templates.
5. **Interrogate coverage gaps** — enforce coverage reporting across schema components.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Evaluation Foundation
**Rationale:** Datasets, validation rules, and scoring gates are dependencies for everything else and mitigate the highest-risk pitfalls early.
**Delivers:** Dataset/rules registry, schema validators (Zod/Ajv), production-readiness gates, scoring rubric, time-budget enforcement.
**Addresses:** Standardized datasets, submission validation, fairness rules, baseline scoring.
**Avoids:** Benchmark contamination, aggregate-only scoring, ontology anti-patterns, time-budget violations.

### Phase 2: Arena Engine
**Rationale:** Phase runners and orchestration build on the evaluation harness and define the core competitive experience.
**Delivers:** Model adapter (callModel), Build/Attack/Interrogate runners, tournament orchestrator, deterministic judge pipeline.
**Addresses:** Multi-agent tournament flow, phase structure, model-agnostic participation.
**Avoids:** Attack phase gaming and interrogate coverage gaps by design.

### Phase 3: Experience + Delivery
**Rationale:** Reporting, leaderboard UX, and webhook delivery depend on stable scoring and orchestration outputs.
**Delivers:** Report cards, leaderboard, match history, webhook delivery with audit trail and manual retry/download.
**Addresses:** Results artifacts, webhook delivery of winning payloads.
**Avoids:** Silent webhook drops, opaque scoring, UX mistrust.

### Phase Ordering Rationale

- Dataset/rules and validators are hard dependencies for phase execution and scoring integrity.
- Architecture patterns separate phase execution from judging; building the judge pipeline early reduces gaming.
- Delivery and UX are most valuable once scoring is trustworthy and reproducible.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Evaluation leakage controls and rubric design for ontology quality (complex, domain-specific).
- **Phase 2:** Attack/Interrogate judging mechanics and objection templates (high risk of gaming).
- **Phase 3:** Webhook reliability patterns in browser-only environments (idempotency + auditability).

Phases with standard patterns (skip research-phase):
- **Phase 1:** SPA stack selection and in-memory state management (well-established tooling).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core technologies verified from official releases; Vite 8 is beta. |
| Features | MEDIUM | Draws on similar arenas; some domain-specific assumptions. |
| Architecture | MEDIUM | Based on established evaluation frameworks, adapted to browser-only constraint. |
| Pitfalls | MEDIUM | Supported by research papers and ontology practice, but mitigation details require validation. |

**Overall confidence:** MEDIUM

### Gaps to Address

- **Rubric specificity for ontology quality:** Validate scoring thresholds with domain experts during Phase 1.
- **Dataset contamination controls:** Define operational leak checks and rotation cadence.
- **Webhook reliability:** Design idempotent payload IDs and UX audit trails in a browser-only setting.
- **Provider rate limits:** Confirm callModel timeout/backoff behavior across target providers.

## Sources

### Primary (HIGH confidence)
- https://github.com/facebook/react/releases — React 19.2.4
- https://github.com/microsoft/TypeScript/releases — TypeScript 5.9.3
- https://github.com/TanStack/router/releases — TanStack Router 1.163.5
- https://github.com/TanStack/query/releases — TanStack React Query 5.90.21
- https://github.com/pmndrs/zustand/releases — Zustand 5.0.11
- https://github.com/colinhacks/zod/releases — Zod 4.3.6
- https://github.com/ajv-validator/ajv/releases — Ajv 8.18.0

### Secondary (MEDIUM confidence)
- https://github.com/vitejs/vite/tags — Vite 8.0.0-beta.16 (pre-release)
- https://arena.ai/blog/policy/ — LMArena evaluation policy
- https://huggingface.co/blog/aivsai — HF AI vs AI competition format
- https://oaei.ontologymatching.org/2025/ — OAEI datasets/track expectations
- https://arxiv.org/html/2503.16402v1 — Benchmark contamination risks
- https://oa.upm.es/id/eprint/10195/contents — OOPS! ontology pitfall scanner
- /Users/chunkstand/ontology-wars/.planning/PROJECT.md — Project constraints and phases

### Tertiary (LOW confidence)
- https://arxiv.org/html/2601.10504v1 — DR-Arena (tournament + evaluation patterns)
- https://arxiv.org/html/2510.26852v1 — CATArena scoring and format

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
