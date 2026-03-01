# Architecture Research

**Domain:** AI agent competitive ontology arena (multi-agent evaluation + tournament system)
**Researched:** 2026-02-28
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                               Browser Runtime                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ Arena UI     │  │ Match Orchestr.  │  │ Phase Runners    │  │ Judge &   │ │
│  │ (controls)   │  │ (tournament)     │  │ Build/Attack/Int │  │ Scoring   │ │
│  └────┬─────────┘  └────┬─────────────┘  └────┬─────────────┘  └────┬──────┘ │
│       │                │                      │                       │      │
├───────┴────────────────┴──────────────────────┴───────────────────────┴──────┤
│                            Integration Layer                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────────────────┐ │
│  │ Model Adapter   │  │ Webhook Sender  │  │ Dataset/Rules Registry         │ │
│  │ (callModel)     │  │ (best-effort)   │  │ (curated datasets + constraints)│ │
│  └─────────────────┘  └─────────────────┘  └───────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│                              Session Data                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐                    │
│  │ Session Vault│  │ Event Log    │  │ Ontology Output  │                    │
│  │ (ephemeral)  │  │ (in-memory)  │  │ + Report Card    │                    │
│  └──────────────┘  └──────────────┘  └──────────────────┘                    │
└──────────────────────────────────────────────────────────────────────────────┘
External Services: Model Providers (OpenAI/Anthropic/Mistral/Ollama/custom),
Webhook Endpoint (customer system)
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Arena UI | User controls, live logs, bracket view, report cards | React/Next.js components + local state |
| Match Orchestrator | Creates tournament bracket, schedules phases, enforces timeouts | In-browser service + Web Workers |
| Phase Runners (Build/Attack/Interrogate) | Executes phase-specific prompts, collects outputs | Phase modules with strict I/O schemas |
| Judge & Scoring | Validates ontology, applies rubric + gates, computes scores/rank | Deterministic rules + LLM-as-judge where needed |
| Model Adapter (callModel) | Normalizes provider APIs into a single interface | Adapter registry (per provider) |
| Dataset/Rules Registry | Curated datasets, constraints, stress-test queries | JSON packs versioned with app |
| Webhook Sender | Best-effort delivery of payloads + report cards | Fetch with retries disabled |
| Session Vault | Stores API keys and transient state | In-memory store only |
| Event Log | Append-only events for replay/debugging | In-memory log + optional export |

## Recommended Project Structure

```
src/
├── app/                    # UI routes (arena, results, settings)
├── arena/                  # Core domain logic
│   ├── orchestrator/       # bracket + match scheduling
│   ├── phases/             # build/attack/interrogate runners
│   ├── judge/              # validators, rubrics, scoring
│   ├── adapters/           # callModel providers
│   └── datasets/           # curated datasets + constraints
├── state/                  # session vault + event log
├── integrations/           # webhook dispatch, export
└── types/                  # shared schemas
```

### Structure Rationale

- **arena/**: Keeps tournament logic, phases, and scoring tightly coupled to avoid cross-layer leakage.
- **adapters/**: isolates provider-specific APIs; mirrors eval frameworks that separate tasks from model backends.
- **state/**: enforces session-only policy by centralizing ephemeral storage.

## Architectural Patterns

### Pattern 1: Task/Phase Registry (modular evaluation)

**What:** Register phases (Build/Attack/Interrogate) as pluggable tasks with a shared I/O schema.
**When to use:** Always; enables consistent execution, logging, and scoring across phases.
**Trade-offs:** Slight upfront boilerplate; pays off in testability and new phase additions.

**Example:**
```ts
export const phases = {
  build: { run: runBuildPhase, schema: BuildSchema },
  attack: { run: runAttackPhase, schema: AttackSchema },
  interrogate: { run: runInterrogatePhase, schema: InterrogateSchema },
};
```

### Pattern 2: Normalized Model Adapter (callModel)

**What:** Single interface for provider calls; mirrors eval frameworks that separate tasks from model backends.
**When to use:** Always; required for model-agnostic tournaments.
**Trade-offs:** Adapter maintenance when providers change APIs.

**Example:**
```ts
export interface CallModel {
  (req: { provider: string; prompt: string; timeoutMs: number }): Promise<ModelResult>;
}
```

### Pattern 3: Judge + Rubric Pipeline (deterministic first, LLM second)

**What:** Validate ontology structure and constraints deterministically, then apply rubric or LLM-as-judge for qualitative checks.
**When to use:** Always; prevents hallucinated correctness from pure LLM judging.
**Trade-offs:** Requires explicit rubric authoring per dataset tier.

**Example:**
```ts
const verdict = validateSchema(output)
  ? scoreRubric(output, rubric)
  : fail("Structural integrity");
```

## Data Flow

### Request Flow

```
[User starts match]
    ↓
[Orchestrator] → [Phase Runner] → [Model Adapter] → [Provider API]
    ↓                 ↓                 ↓
[Judge/Score] ← [Normalize Output] ← [Model Result]
    ↓
[Report Card + Ontology] → [Webhook Sender]
```

### State Management

```
[Session Vault] ← API keys / settings (ephemeral)
     ↓ (read-only)
[Orchestrator + Phases] → [Event Log] → [UI views]
```

### Key Data Flows

1. **Build Phase:** dataset → build prompt → ontology JSON → structural validator → score.
2. **Attack Phase:** rival ontology + rules → objection → judge verdict → score delta.
3. **Interrogate Phase:** query pack → agent responses → coverage/accuracy scoring → report card.
4. **Webhook Delivery:** final ontology + report card → POST to endpoint (best-effort).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Browser-only runtime is sufficient; focus on timeouts and local UX. |
| 1k-100k users | Introduce optional hosted relay for queueing/monitoring (still stateless). |
| 100k+ users | Move orchestration to backend, add persistent storage + retries. |

### Scaling Priorities

1. **First bottleneck:** provider rate limits and latency → add request queue + adaptive timeouts.
2. **Second bottleneck:** judge cost/consistency → cache deterministic checks, sample LLM judging.

## Anti-Patterns

### Anti-Pattern 1: Entangling scoring with orchestration

**What people do:** Score inside the phase runner and mutate global state.
**Why it's wrong:** Makes scoring nondeterministic and hard to audit.
**Do this instead:** Emit outputs → score in a dedicated judge pipeline.

### Anti-Pattern 2: Persisting API keys or outputs by default

**What people do:** Store keys/results in local storage or backend.
**Why it's wrong:** Violates session-only vault and increases risk surface.
**Do this instead:** Keep all sensitive data in-memory; export only on explicit user action.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Model Providers | Adapter pattern via callModel | Normalize response/usage, enforce timeouts. |
| Webhook Endpoint | POST payload at match end | Best-effort, no retries per v1 constraint. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Orchestrator ↔ Phase Runners | Direct function calls | Keep pure I/O for replayability. |
| Phase Runners ↔ Judge | Event-based (output artifacts) | Enables deterministic scoring. |
| UI ↔ Arena Core | Typed state selectors | Avoid UI mutation of core state. |

## Suggested Build Order (Dependencies)

1. **Dataset/Rules Registry** → everything depends on curated datasets + constraints.
2. **Model Adapter (callModel)** → required to execute phases with any provider.
3. **Phase Runners** → Build first, then Attack, then Interrogate.
4. **Judge & Scoring** → needs phase outputs + rubric definitions.
5. **Match Orchestrator** → coordinates phases and scoring.
6. **UI + Event Log** → visualization and control surfaces.
7. **Webhook Sender** → depends on finalized report card + ontology payload.

## Sources

- OpenAI Evals (task registry + completion function protocol): https://github.com/openai/evals
- LM Evaluation Harness (model backends + task modularity): https://github.com/EleutherAI/lm-evaluation-harness
- DR-Arena (closed-loop examiner + adaptive evolvement): https://arxiv.org/html/2601.10504v1
- CATArena (tournament format + scoring matrix): https://arxiv.org/html/2510.26852v1
- Arena-Hard pipeline (pairwise judging + Bradley-Terry scoring): https://lmarena.ai/blog/arena-hard/

---
*Architecture research for: AI agent competitive ontology arena*
*Researched: 2026-02-28*
