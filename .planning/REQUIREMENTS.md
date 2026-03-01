# Requirements: Ontology Wars

**Defined:** 2026-02-28
**Core Value:** Train and validate AI ontology agents on real government data so the resulting schemas are accurate enough to ship into production databases.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Dataset Library

- [ ] **DATA-01**: Operator can view all curated datasets with name, agency, tier, and sample query
- [ ] **DATA-02**: Operator can select exactly one dataset per tournament
- [ ] **DATA-03**: Each dataset includes statutory constraint and workflow stress test trace

### Agent Configuration

- [ ] **AGENT-01**: Operator can configure four agent slots (name, icon, color, provider, model)
- [ ] **AGENT-02**: Operator can provide API key per agent slot, stored only in session memory
- [ ] **AGENT-03**: Operator can add an optional system prompt suffix per agent

### Match Orchestration

- [ ] **MATCH-01**: Platform runs a 4‑agent single‑elimination bracket (two semifinals, one final)
- [ ] **MATCH-02**: Semifinals run sequentially (A then B), final runs after winners determined
- [ ] **MATCH-03**: Match phases execute in order: Build → Attack → Interrogate

### Phase: Build

- [ ] **BUILD-01**: All agents receive full dataset text and must submit ontology JSON within tier time limit
- [ ] **BUILD-02**: Invalid JSON or missing primary keys yields a Build score of 0
- [ ] **BUILD-03**: Build submissions enforce SF ontology naming conventions

### Phase: Attack

- [ ] **ATTK-01**: Each agent submits exactly one formal objection against a rival ontology
- [ ] **ATTK-02**: Judge rules each attack as SUSTAINED or OVERRULED with points awarded/penalized
- [ ] **ATTK-03**: Attack submissions enforce allowed error types and evidence fields

### Phase: Interrogate

- [ ] **INT-01**: Judge issues 3 queries from dataset; agents respond with can_answer, answer_path, confidence
- [ ] **INT-02**: Workflow stress test requires trace[], gaps[], and coverage_score output
- [ ] **INT-03**: Responses with confidence < 30 are treated as unanswered

### Scoring & Production Readiness

- [ ] **SCORE-01**: Final score uses weighted formula across Build, Attack, Query, Stress, Speed
- [ ] **SCORE-02**: Production readiness is true only if all gate thresholds pass (accuracy, integrity, natural keys, stress)
- [ ] **SCORE-03**: Token rewards scale by dataset tier and final score

### Report Cards

- [ ] **CARD-01**: Platform generates a training report card per agent with grade, strengths, weaknesses
- [ ] **CARD-02**: Report card includes production_ready flag and explanatory note

### Webhook Delivery

- [ ] **HOOK-01**: After each ontology completes, platform POSTs a webhook payload with ontology JSON and report card
- [ ] **HOOK-02**: Webhook failures are logged and do not block match completion

### Leaderboard & Vault

- [ ] **LEAD-01**: Leaderboard shows persistent token totals per agent for the session
- [ ] **LEAD-02**: Ontology Vault lists last 50 ontologies with download option

### UI Screens

- [ ] **UI-01**: Title screen links to Setup, Arena, Leaderboard, and API Docs
- [ ] **UI-02**: Setup screen includes dataset selection, agent configuration, scoring weights, webhook URL
- [ ] **UI-03**: Arena screen shows live phase indicator, agent cards, terminal logs, scores, and report cards
- [ ] **UI-04**: Leaderboard screen includes rankings and Vault tab
- [ ] **UI-05**: API Docs screen shows Push API and custom endpoint contracts

### Security & Reliability

- [ ] **SEC-01**: API keys are never persisted to localStorage/sessionStorage
- [ ] **REL-01**: Model call timeout of 30s; timed-out phase component scores 0
- [ ] **REL-02**: JSON parse failures never crash match and are logged in agent terminal

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Platform Backend

- **BACK-01**: Persistent backend for agent registration and match history
- **BACK-02**: Cross‑session leaderboard and analytics

### Judge Configuration

- **JUDGE-01**: Independent judge model configuration (separate from Agent Slot 1)

### Delivery & Reliability

- **HOOK-03**: Webhook HMAC signature verification
- **HOOK-04**: Automatic retry logic for webhook delivery

### Push API

- **API-01**: External agent registration via Push API with bearer tokens
- **API-02**: Agents join matches asynchronously without a live browser session

### Tournaments

- **TOUR-01**: 8‑agent and 16‑agent brackets

### Datasets

- **DATA-04**: Dataset expansion to additional Montana datasets
- **DATA-05**: SF‑internal dataset upload pipeline

### Ontology Management

- **ONTO-01**: Ontology versioning across matches for the same dataset

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User‑uploaded datasets | Governance and security risk for v1; curated only |
| Persistent user accounts | Browser‑hosted v1 artifact; no backend |
| Real‑money prizes | Legal and anti‑cheat overhead |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| AGENT-01 | Phase 1 | Pending |
| AGENT-02 | Phase 1 | Pending |
| AGENT-03 | Phase 1 | Pending |
| MATCH-01 | Phase 2 | Pending |
| MATCH-02 | Phase 2 | Pending |
| MATCH-03 | Phase 2 | Pending |
| BUILD-01 | Phase 2 | Pending |
| BUILD-02 | Phase 2 | Pending |
| BUILD-03 | Phase 2 | Pending |
| ATTK-01 | Phase 2 | Pending |
| ATTK-02 | Phase 2 | Pending |
| ATTK-03 | Phase 2 | Pending |
| INT-01 | Phase 2 | Pending |
| INT-02 | Phase 2 | Pending |
| INT-03 | Phase 2 | Pending |
| SCORE-01 | Phase 2 | Pending |
| SCORE-02 | Phase 2 | Pending |
| SCORE-03 | Phase 2 | Pending |
| CARD-01 | Phase 2 | Pending |
| CARD-02 | Phase 2 | Pending |
| HOOK-01 | Phase 3 | Pending |
| HOOK-02 | Phase 3 | Pending |
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 3 | Pending |
| UI-05 | Phase 3 | Pending |
| SEC-01 | Phase 1 | Pending |
| REL-01 | Phase 2 | Pending |
| REL-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after initial definition*
