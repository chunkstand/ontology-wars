# Pitfalls Research

**Domain:** Competitive AI-ontology agent arena (multi-agent Build/Attack/Interrogate with production-readiness gates)
**Researched:** 2026-02-28
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Benchmark contamination & evaluation leakage

**What goes wrong:**
Agents memorize or indirectly access evaluation data (or seeds/prompts), inflating scores and producing ontologies that look “production-ready” but fail on truly novel data.

**Why it happens:**
Competitive setups reuse static datasets and judge prompts. LLMs are trained on web-crawled data and can be contaminated by benchmark content, which undermines evaluation reliability.

**How to avoid:**
- Treat datasets, judge prompts, and evaluation queries as secrets; rotate and refresh evaluation items per tournament.
- Split datasets into public training vs hidden evaluation tiers with leak checks.
- Audit for contamination and detect suspiciously high agreement patterns.

**Warning signs:**
- Sudden accuracy spikes across all tiers without corresponding schema quality improvements.
- Agents repeatedly “anticipate” exact evaluation queries or constraints.

**Phase to address:**
Phase 1 (Dataset curation + evaluation harness)

---

### Pitfall 2: Scoring based on aggregate accuracy only

**What goes wrong:**
Leaderboards reward aggregate accuracy while ignoring question‑level fidelity and contamination resistance; rankings become misleading and encourage gaming rather than robust ontologies.

**Why it happens:**
Aggregate metrics are easy to compute; question‑level evaluation and contamination checks are more complex, so teams skip them.

**How to avoid:**
- Track question‑level outcomes; require fidelity/consistency checks across Build/Attack/Interrogate.
- Add robustness metrics (e.g., resistance to dataset perturbations) before declaring “production‑ready.”

**Warning signs:**
- High overall scores but frequent failures on specific, repeated query patterns.
- Scores remain high even after dataset perturbations or rewording.

**Phase to address:**
Phase 1 (Evaluation framework + scoring rubric)

---

### Pitfall 3: Ontology design anti‑patterns baked into agent outputs

**What goes wrong:**
Ontologies include modeling pitfalls (e.g., incorrect reuse of design patterns, inconsistent hierarchy, missing constraints), making them brittle for downstream ingestion and queryability.

**Why it happens:**
LLM agents lack disciplined ontology modeling guidance; developers do not apply design pattern checks or automated pitfall scanners.

**How to avoid:**
- Use ODP‑aware validation rules and an ontology pitfall scanner (e.g., OOPS) as a gate.
- Enforce explicit constraints: domain/range, key fields, and structural integrity checks before scoring.

**Warning signs:**
- Ontologies pass JSON validation but fail structural integrity checks or break basic queries.
- High object type count without clear inheritance or relationship semantics.

**Phase to address:**
Phase 1 (Ontology validation rules + production‑readiness gates)

---

### Pitfall 4: Attack phase incentivizes “gaming” over quality fixes

**What goes wrong:**
Agents exploit loopholes in objection format or judging, driving score swings without improving ontology quality; attacks become meta‑gaming rather than constructive validation.

**Why it happens:**
Objection rules are underspecified and judge prompts reward argumentative style instead of schema correctness.

**How to avoid:**
- Require objections to reference concrete schema violations with reproducible evidence.
- Use standardized objection templates and counter‑example queries.
- Add judge cross‑checks: “Does this change alter ontology correctness or query coverage?”

**Warning signs:**
- High attack success rate with no measurable improvement in Interrogate outcomes.
- Objections frequently cite ambiguous wording rather than schema defects.

**Phase to address:**
Phase 2 (Attack/Interrogate mechanics)

---

### Pitfall 5: Stress‑test coverage gaps in Interrogate phase

**What goes wrong:**
Interrogate queries don’t represent real downstream workflows, so “passing” ontologies fail in production (e.g., missing natural keys or workflow‑critical links).

**Why it happens:**
Stress tests are too small, too static, or not aligned to the downstream data‑ingestion requirements.

**How to avoid:**
- Align stress tests with real workflow questions and statutory constraints.
- Require coverage reports: which ObjectTypes/LinkTypes were exercised.

**Warning signs:**
- High interrogate scores but repeated downstream ingestion failures.
- Many entity types never touched by interrogate queries.

**Phase to address:**
Phase 2 (Interrogate phase + workflow tests)

---

### Pitfall 6: Best‑effort webhook delivery hides failures

**What goes wrong:**
Ontology payloads and report cards are silently dropped or duplicated; downstream systems ingest incomplete or stale ontologies.

**Why it happens:**
v1 is browser‑hosted with no retries or signatures, and webhook delivery is best‑effort only.

**How to avoid:**
- Make deliveries idempotent (request IDs), log delivery status, and expose a retry button.
- Provide a “download payload” fallback for manual recovery.

**Warning signs:**
- Downstream systems show mismatched match IDs or missing report cards.
- No delivery audit trail in the UI.

**Phase to address:**
Phase 3 (Delivery + integration)

---

### Pitfall 7: Time‑budget violations degrade match integrity

**What goes wrong:**
Agents exceed per‑phase timeouts; timeouts get scored as zeros, making brackets misleading and non‑reproducible.

**Why it happens:**
Multi‑agent orchestration and judge‑as‑LLM calls stack up; timing constraints are not enforced early.

**How to avoid:**
- Enforce per‑agent and per‑phase time budgets with early cutoffs and partial scoring.
- Reduce judge calls via caching and deterministic rule checks where possible.

**Warning signs:**
- Frequent timeouts in Tier 2–3 runs.
- Large variance in run times across identical seeds.

**Phase to address:**
Phase 1 (Runtime governance + performance budget)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode judge prompts/weights in UI | Faster iteration | Hidden evaluation drift; irreproducible results | Only in internal prototypes |
| Skip ontology pitfall scanning | Lower compute cost | Schema defects shipped to downstream | Never |
| No ontology versioning | Simple storage | Impossible diffs, regressions undetected | Only if v1 is throwaway |
| Single “golden” stress test | Easy to maintain | Agents overfit; low robustness | MVP only, with clear plan to expand |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Webhook delivery | Assume delivery is reliable without retries | Make idempotent with request IDs + allow manual re‑send |
| Model provider APIs | Ignore per‑provider rate limits/timeouts | Normalize callModel() with explicit timeout/backoff policies |
| Downstream DB ingestion | Assume ontology JSON is ingestion‑ready | Validate against production‑readiness gates before delivery |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Per‑agent LLM judge calls for every step | UI stalls, timeouts | Cache judgments; add rule‑based checks | Tier 2–3 tournaments |
| Large ontology validation on main thread | Browser freezes | Offload to worker; incremental validation | ~50+ entities/links |
| Unbounded tournament logs | Memory bloat in session vault | Summarize and paginate logs | Multi‑match sessions |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing API keys outside React state | Key leakage/persistence | Keep keys in memory only; never localStorage/sessionStorage |
| Prompt injection via dataset fields | Agent leaks keys or manipulates scoring | Sanitize dataset inputs; isolate system prompts |
| Unsigned webhooks to untrusted endpoints | Replay or spoofed payloads | Add optional HMAC in v2 or include signed checksum |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Opaque scoring without evidence | Users distrust rankings | Show per‑criterion breakdown + sample failures |
| No provenance for objections | Attack phase feels arbitrary | Link objections to specific schema diffs & queries |
| No reproducibility controls | Matches can’t be compared | Seeded runs and exportable configs |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Build phase output:** JSON validates but missing natural keys — verify key coverage and uniqueness checks.
- [ ] **Attack phase:** Objection recorded but no schema diff — verify the objection changes are applied and tested.
- [ ] **Interrogate:** Passes a few queries but lacks workflow coverage — verify coverage report across entity/link types.
- [ ] **Webhook delivery:** Success toast shown but no audit trail — verify delivery receipts and payload IDs.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Benchmark contamination | HIGH | Rotate evaluation sets, invalidate affected matches, re‑run with clean splits |
| Ontology anti‑patterns | MEDIUM | Run pitfall scanner, refactor classes/relations, re‑score gates |
| Attack phase gaming | MEDIUM | Tighten objection rules, re‑judge with new rubric |
| Webhook drops | LOW | Re‑send from audit log or provide manual download/upload |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Benchmark contamination | Phase 1 | Leak checks + rotated evaluation set results |
| Aggregate‑only scoring | Phase 1 | Question‑level metrics reported |
| Ontology anti‑patterns | Phase 1 | Pitfall scanner gate passes |
| Attack phase gaming | Phase 2 | Objections tied to reproducible schema failures |
| Stress‑test gaps | Phase 2 | Coverage report across schema components |
| Webhook best‑effort losses | Phase 3 | Delivery receipts + idempotent payload IDs |
| Time‑budget violations | Phase 1 | Timeouts < threshold per tier |

## Sources

- https://arxiv.org/html/2503.16402v1 (Benchmark data contamination undermines evaluation reliability; 2024)
- https://link.springer.com/chapter/10.1007/978-3-642-14264-2_10 (Common pitfalls & anti‑patterns in ontology development)
- https://oa.upm.es/id/eprint/10195/contents (OOPS! Ontology Pitfalls Scanner)
- /Users/chunkstand/ontology-wars/.planning/PROJECT.md (Project constraints & phase structure)

---
*Pitfalls research for: Competitive AI‑ontology agent arena*
*Researched: 2026-02-28*
