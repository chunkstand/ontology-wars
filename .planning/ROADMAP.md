# Roadmap: Ontology Wars

## Overview

Deliver a browser-hosted arena where operators configure datasets and agents, run a full Build→Attack→Interrogate tournament with trustworthy scoring, then review results and deliver winning ontologies via webhook and session artifacts.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Setup & Dataset Selection** - Operator can configure datasets and agents in a safe, session-only setup flow.
- [ ] **Phase 2: Arena Execution & Scoring** - Full tournament runs through Build/Attack/Interrogate with reliable scoring and live arena view.
- [ ] **Phase 3: Delivery & Session Results** - Results are delivered via webhook and summarized in leaderboard/vault with API docs.

## Phase Details

### Phase 1: Setup & Dataset Selection
**Goal**: Operators can prepare a tournament by choosing a curated dataset and configuring four agents without persisting secrets.
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, AGENT-01, AGENT-02, AGENT-03, UI-01, UI-02, SEC-01
**Success Criteria** (what must be TRUE):
  1. Operator can browse curated datasets with tier, agency, and a sample query, and select exactly one for a tournament.
  2. Operator can configure four agent slots (identity, provider/model) and add per-agent API keys and optional prompt suffixes.
  3. Title and Setup screens are reachable and API keys are not persisted beyond the current session.
**Plans**: 4 plans
- [ ] 01-01-PLAN.md — Setup Wizard & Session Context
- [ ] 01-02-PLAN.md — Dataset Selection UI
- [ ] 01-03-PLAN.md — Agent Configuration UI
- [ ] 01-04-PLAN.md — Review & Launch Flow

### Phase 2: Arena Execution & Scoring
**Goal**: Operators can run a full 4-agent tournament through Build/Attack/Interrogate with reliable scoring and report cards.
**Depends on**: Phase 1
**Requirements**: MATCH-01, MATCH-02, MATCH-03, BUILD-01, BUILD-02, BUILD-03, ATTK-01, ATTK-02, ATTK-03, INT-01, INT-02, INT-03, SCORE-01, SCORE-02, SCORE-03, CARD-01, CARD-02, REL-01, REL-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Operator can start a tournament and see it run semifinals then finals with Build→Attack→Interrogate phases in order.
  2. Arena view shows live phase indicator, agent cards, terminal logs, and updated scores/report cards as phases complete.
  3. Invalid JSON, low-confidence responses, or timeouts are scored as zero and logged without crashing the match.
  4. Each agent receives a report card with grade, strengths/weaknesses, and production-readiness status derived from weighted scoring.
**Plans**: TBD

### Phase 3: Delivery & Session Results
**Goal**: Operators can review session outcomes, retrieve ontologies, and deliver payloads to downstream systems.
**Depends on**: Phase 2
**Requirements**: HOOK-01, HOOK-02, LEAD-01, LEAD-02, UI-04, UI-05
**Success Criteria** (what must be TRUE):
  1. After each ontology completes, a webhook POST is attempted with ontology JSON and report card, and failures are logged without blocking completion.
  2. Leaderboard shows session token totals and the Ontology Vault lists the last 50 ontologies with download access.
  3. Leaderboard and API Docs screens are reachable from the UI navigation and describe Push API/custom endpoint contracts.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Setup & Dataset Selection | 0/4 | Not started | - |
| 2. Arena Execution & Scoring | 0/TBD | Not started | - |
| 3. Delivery & Session Results | 0/TBD | Not started | - |
