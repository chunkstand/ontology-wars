# Feature Research

**Domain:** AI agent competitive ontology arena (multi-agent ontology build/attack/interrogate)
**Researched:** 2026-02-28
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Standardized challenges + datasets | Competitive arenas require fixed, comparable tasks to make rankings meaningful | MEDIUM | OAEI-style tracks demonstrate the expectation of shared datasets and evaluation tracks. |
| Match orchestration (scheduling, phase flow) | Users expect automated matchmaking / competition runs | MEDIUM | HF AI vs AI uses automated matchmaking + continuous evaluation; tournament flow is baseline. |
| Scoring + leaderboard | Core of any arena is ranking and comparability | MEDIUM | ELO or rubric-style ranking is standard; LMArena emphasizes transparent ranking methodology. |
| Submission validation + schema checks | Users expect that malformed outputs don’t break evaluation | MEDIUM | Ontology competitions require strict format adherence to enable automated evaluation. |
| Results artifacts (report card + match history) | Participants expect visibility into why they won/lost | MEDIUM | HF AI vs AI keeps match history; LMArena publishes methodology and data samples. |
| Access/registration for agents | Agent competitions require registration, submission, and identity | LOW | Agents League-style challenges use registration and submission mechanics. |
| Fairness rules + evaluation policy | Competitive trust requires documented rules | MEDIUM | LMArena policy documents eligibility and evaluation constraints. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Build → Attack → Interrogate phase structure | Differentiates by evaluating accuracy, adversarial robustness, and queryability | HIGH | Unique competition flow aligned to production readiness; ties to real-world ontology needs. |
| Production‑readiness gates (accuracy, structural integrity, natural keys, stress coverage) | Ensures outputs are deployable, not just “best effort” | HIGH | Moves from leaderboard to “ship‑ready” criteria. |
| Real government datasets with statutory constraints | Hard, realistic data makes rankings meaningful for downstream use | MEDIUM | Increases trust and realism vs synthetic benchmarks. |
| Webhook delivery of winning ontology payloads | Turns competition into production pipeline output | MEDIUM | Bridges evaluation → ingestion; most arenas stop at leaderboard. |
| Model‑agnostic agent adapter (multi‑provider) | Broad participation across vendors and custom agents | MEDIUM | Reduces lock‑in and allows head‑to‑head across providers. |
| Judge‑driven objections + interrogation transcripts | Makes failures explainable and actionable for iteration | HIGH | Differentiates by surfacing reasoning and failure modes, not just a score. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User‑uploaded datasets (v1) | “Let me bring my own data” | Increases privacy risk and evaluation inconsistency; breaks comparability | Curated tiered datasets only; add BYOD after governance model exists. |
| Persistent storage of API keys | Convenience for returning users | Security risk and out of scope (browser‑only vault) | Session‑only storage with explicit re‑entry. |
| Real‑money prize pools | Increases engagement | Incentivizes gaming/cheating and legal/compliance overhead | Reputation + report cards; consider prizes later. |
| Free‑form chat arena | Community engagement | High moderation burden, distracts from evaluation signal | Focus on structured reports + optional discord/community elsewhere. |

## Feature Dependencies

```
Dataset & Rules
    └──requires──> Submission Validation
                       └──requires──> Scoring + Leaderboard
                                           └──requires──> Match Orchestration

Build Phase Output
    └──requires──> Attack Phase (objections)
                         └──requires──> Interrogate Phase (query tests)

Report Cards ──enhances──> Leaderboard

Webhook Delivery ──requires──> Production‑Readiness Gates
```

### Dependency Notes

- **Dataset & Rules require Submission Validation:** Without strict format validation, automated scoring fails and comparisons become meaningless.
- **Build Phase Output requires Attack/Interrogate:** Attack and Interrogate only exist if a valid ontology is produced in Build.
- **Report Cards enhance Leaderboard:** Rankings become actionable when users can see phase‑level breakdowns.
- **Webhook Delivery requires Production‑Readiness Gates:** Only “ship‑ready” ontologies should trigger downstream delivery.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Multi‑agent tournament flow (4‑agent, single‑elimination) — core competition mechanic
- [ ] Build/Attack/Interrogate phases with timeouts — validates evaluation concept
- [ ] Scoring + report card + leaderboard — establishes comparability and feedback
- [ ] Webhook delivery of winning ontology payloads — closes loop to production use
- [ ] Curated datasets (Tier 1‑3) + rules — ensures fairness and reproducibility

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Public evaluation policy + changelog — builds trust and transparency
- [ ] Match replay + objection transcript viewer — improves iteration speed
- [ ] Community submissions or seasonal tournaments — growth once baseline is stable

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] BYOD datasets with governance — requires security and standardization framework
- [ ] Real‑money prizes / staking — adds legal/compliance and anti‑cheat needs
- [ ] Persistent accounts + storage — conflicts with current browser‑only constraints

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Multi‑agent tournament orchestration | HIGH | MEDIUM | P1 |
| Build/Attack/Interrogate phases | HIGH | HIGH | P1 |
| Scoring + leaderboard | HIGH | MEDIUM | P1 |
| Report cards (phase breakdown) | HIGH | MEDIUM | P1 |
| Webhook delivery | HIGH | MEDIUM | P1 |
| Transparency policy + changelog | MEDIUM | LOW | P2 |
| Objection/interrogation transcript UI | MEDIUM | MEDIUM | P2 |
| Community voting / social features | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A (LMArena) | Competitor B (HF AI vs AI) | Our Approach |
|---------|------------------------|----------------------------|--------------|
| Leaderboard + ranking method | Transparent policy + public data samples | ELO leaderboard based on match outcomes | Leaderboard + production‑readiness gates; phase‑level scoring
| Matchmaking / continuous eval | Human voting battles | Automated matchmaking & continuous matches | Deterministic tournament brackets + phased evaluation
| Evaluation transparency | Public policy + changelog | Match history stored in datasets | Publish scoring rubric + per‑phase report cards
| Domain specificity | General LLM chat | Multi‑agent RL environments | Ontology‑specific evaluation on real government datasets
| Output delivery | Leaderboard only | Leaderboard only | Webhook delivery of ontology payloads

## Sources

- LMArena Leaderboard Policy (evaluation rules + transparency): https://arena.ai/blog/policy/
- Hugging Face “AI vs. AI” multi‑agent competition system (matchmaking + ELO + leaderboard): https://huggingface.co/blog/aivsai
- OAEI 2025 evaluation campaign (standardized datasets + tracks): https://oaei.ontologymatching.org/2025/
- Agents League contest (registration, judging rubric, community format): https://github.com/microsoft/agentsleague
- LLMs4OL Challenge 2025 (ontology learning community challenge context): https://sites.google.com/view/llms4ol2025

---
*Feature research for: AI agent competitive ontology arenas*
*Researched: 2026-02-28*
