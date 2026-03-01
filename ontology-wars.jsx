import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ============================================================
// ONTOLOGY WARS — AI Agent Competitive Ontology Arena
// Standing Framework × Palantir Ontology Architect
// ============================================================

// ── TOURNAMENT CONTEXT (Session-only state) ─────────────────
const TournamentContext = createContext(null);

// House agents for tournament mode
const HOUSE_AGENTS = [
  { name: "ONTOMANCER", color: C.purple, icon: "⬡", style: "You are ONTOMANCER, an ontology wizard who sees knowledge graphs as living structures.", personality: "Philosophical. Thorough. Finds hidden connections." },
  { name: "AE-SENTINEL", color: C.green, icon: "⬟", style: "You are AE-SENTINEL, trained exclusively on Authority Engineering specifications.", personality: "Authority-Engineering native. Axiom-compliant. Audit-obsessed." },
  { name: "GRAPHWRIGHT", color: C.orange, icon: "⬢", style: "You are GRAPHWRIGHT, a pragmatic graph engineer obsessed with operational utility.", personality: "Pragmatic. Action-oriented. Governance-first." },
  { name: "DATAMINER", color: C.accent, icon: "⬣", style: "You are DATAMINER, a data extraction specialist who turns raw documents into structured ontologies.", personality: "Extraction-focused. Pattern-recognizing. Detail-oriented." },
];

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within TournamentProvider");
  }
  return context;
}

function TournamentProvider({ children }) {
  // Session-only state using useState - NO localStorage/sessionStorage
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [agents, setAgents] = useState(HOUSE_AGENTS);
  const [selectedAgentIds, setSelectedAgentIds] = useState([0, 1]);
  const [agentApiKeys, setAgentApiKeys] = useState({});
  const [agentPromptSuffixes, setAgentPromptSuffixes] = useState({});
  const [webhookUrl, setWebhookUrl] = useState("");
  const [scoringWeights, setScoringWeights] = useState({
    accuracy: 20,
    completeness: 20,
    palantirCompliance: 20,
    authorityEngineering: 15,
    actionability: 15,
    elegance: 10,
  });
  const [currentStep, setCurrentStep] = useState(0);

  const value = {
    selectedDataset,
    setSelectedDataset,
    agents,
    selectedAgentIds,
    setSelectedAgentIds,
    agentApiKeys,
    setAgentApiKeys,
    agentPromptSuffixes,
    setAgentPromptSuffixes,
    webhookUrl,
    setWebhookUrl,
    scoringWeights,
    setScoringWeights,
    currentStep,
    setCurrentStep,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// ── PALETTE ──────────────────────────────────────────────────
const C = {
  bg: "#050810",
  panel: "#0a0f1e",
  border: "#1a2540",
  accent: "#00d4ff",
  gold: "#ffd700",
  green: "#00ff88",
  red: "#ff3355",
  purple: "#a855f7",
  orange: "#ff6b35",
  dim: "#4a5568",
  text: "#e2e8f0",
  muted: "#64748b",
};

// ── CHALLENGE DATASETS ────────────────────────────────────────
const CHALLENGES = [
  {
    id: "lvl1",
    level: 1,
    name: "PERMIT ROOKIE",
    subtitle: "Montana Air Quality Permit — Basic",
    tokens: 500,
    difficulty: "INITIATE",
    timeLimit: 120,
    description: "Map the core entities in a simple air quality permit workflow.",
    dataset: `
MONTANA AIR QUALITY PERMIT WORKFLOW — EXCERPT

A Facility submits an Application to the Montana Department of Environmental Quality (DEQ).
Each Application has a permit_number (unique), submission_date, applicant_name, facility_name, 
facility_address, emission_type (one of: particulate, NOx, SOx, VOC), requested_limit_tph, and status 
(one of: submitted, under_review, approved, denied, withdrawn).

A DEQ Reviewer is assigned to each Application. The reviewer has a reviewer_id, full_name, 
email, and specialization. One reviewer can handle many applications.

When a Reviewer completes their assessment, they create a Review Record with a review_id, 
review_date, recommendation (approve/deny/request_more_info), comments, and confidence_score (0-100).

A Review Record belongs to exactly one Application.
    `.trim(),
    targetSchema: {
      objectTypes: ["Application", "Reviewer", "ReviewRecord"],
      minProperties: 8,
      minLinks: 2,
      minActions: 3,
    },
    hint: "Focus on the three core nouns: Application, Reviewer, ReviewRecord. Check cardinality carefully.",
  },
  {
    id: "lvl2",
    level: 2,
    name: "AUTHORITY MAPPER",
    subtitle: "AE Delegation Chain — Government AI Governance",
    tokens: 1200,
    difficulty: "APPRENTICE",
    timeLimit: 180,
    description: "Encode an Authority Engineering delegation structure as a Palantir ontology.",
    dataset: `
STANDING FRAMEWORK — AUTHORITY ENGINEERING GOVERNANCE MODEL

Authority Units (AUs) form a delegation hierarchy. Each AU has an au_id, display_name, 
au_type (Human | AI | Org), role_description, can_delegate (boolean), can_issue_policy (boolean),
jurisdiction_id (FK), and is_root (boolean).

Scope Boundaries define where AUs are valid. Each SB has an sb_id, jurisdiction_name, 
program_code, effective_start, effective_end, geographic_region.

Decision Points represent governance gates. Each DP has a dp_id, action_name, mode 
(HumanOnly | Mixed | AutoAllowed), risk_level (Low | Medium | High | Critical), 
resolution_status (pending | resolved | escalated | rejected), required_evidence_count.

Evidence Units are justification artifacts. Each EU has an eu_id, evidence_type, 
provenance_source, submitted_at_timestamp, submitted_by_user, confidence_score, is_sufficient.

Delegation records track authority transfers. Each Delegation has a delegation_id, 
from_au_id (FK), to_au_id (FK), scope_sb_id (FK), delegated_at_timestamp, 
delegated_by_user, purpose (ActionAuthority | PolicyIssuance | Both), effective_start, effective_end.

Audit Log captures every decision event. Each AuditEntry has an entry_id, dp_id (FK), 
resolved_by_au_id (FK), resolution (ACCEPT | REJECT | ESCALATE), resolution_timestamp, 
rationale, is_ultra_vires.
    `.trim(),
    targetSchema: {
      objectTypes: ["AuthorityUnit", "ScopeBoundary", "DecisionPoint", "EvidenceUnit", "Delegation", "AuditEntry"],
      minProperties: 20,
      minLinks: 6,
      minActions: 5,
    },
    hint: "This maps directly to Authority Engineering CMM v1.0. The delegation chain is a self-referential link on AuthorityUnit.",
  },
  {
    id: "lvl3",
    level: 3,
    name: "GRAPH WARLORD",
    subtitle: "Standing Framework Full Enterprise — Multi-Domain",
    tokens: 3000,
    difficulty: "MASTER",
    timeLimit: 300,
    description: "Build a complete enterprise knowledge graph spanning strategy, operations, and compliance.",
    dataset: `
STANDING FRAMEWORK — FULL ENTERPRISE ONTOLOGY DATASET

── STRATEGY LAYER ──
Strategic Initiatives have an initiative_id, title, option_type (A_Conservative | B_Balanced | C_Aggressive),
target_state, revenue_target_min, revenue_target_max, timeline_months, capital_required_min, 
capital_required_max, status (active | paused | completed), risk_level.

Key Results track measurable outcomes for initiatives. Each KR has a kr_id, initiative_id (FK),
metric_name, current_value, target_value, unit, due_date, owner_user, status.

── OPERATIONS LAYER ──
Engagements are client contracts. Each has an engagement_id, client_agency, state_code, 
domain (environmental | benefits | natural_resource | transportation), contract_value,
start_date, end_date, delivery_lead_user, status (prospect | loi | active | complete).

Team Members have a member_id, full_name, role (founder | delivery_lead | ontology_architect | 
bd_lead | engineer | analyst), hire_date, comp_min, comp_max, equity_pct, is_active.

Assignments link members to engagements: assignment_id, member_id (FK), engagement_id (FK),
assigned_at_timestamp, assigned_by_user, role_on_engagement, allocation_pct.

── COMPLIANCE LAYER ──
Ontology Artifacts are the IP outputs. Each has an artifact_id, engagement_id (FK),
artifact_type (object_type_spec | link_type_spec | action_type_spec | full_ontology),
version, object_type_count, property_count, link_type_count, action_type_count,
created_at_timestamp, created_by_user, is_protected, patent_filed.

Capital Tranches track fundraising. Each tranche has a tranche_id, round_name 
(bridge | pre_seed | seed | series_a), amount_min, amount_max, trigger_condition,
closed_date, lead_investor, dilution_pct.

Investors: investor_id, fund_name, focus (govtech | ai_infra | impact), check_size_min,
check_size_max, stage_preference, relationship_status (cold | warm | pitched | committed).

── AUTHORITY ENGINEERING LAYER ──
AE Models are formal governance specifications: model_id, engagement_id (FK),
model_name, version, au_count, dp_count, ou_count, eu_count, sb_count,
conformance_score (0-100), audit_ready (boolean), created_at_timestamp.

Violations are non-conformance events: violation_id, model_id (FK), axiom_violated 
(A1-A8), violation_type (ultra_vires | missing_escalation | scope_breach | evidence_gap),
detected_at_timestamp, resolved_at_timestamp, resolved_by_user, severity (low|medium|high|critical).
    `.trim(),
    targetSchema: {
      objectTypes: ["StrategicInitiative", "KeyResult", "Engagement", "TeamMember", "Assignment", "OntologyArtifact", "CapitalTranche", "Investor", "AeModel", "Violation"],
      minProperties: 40,
      minLinks: 10,
      minActions: 8,
    },
    hint: "This is the full Standing Framework enterprise graph. Every layer (Strategy, Operations, Compliance, AE) must be connected. Authority Engineering entities must map to AE-O primitives.",
  },
];

// ── JUDGE SYSTEM PROMPT ───────────────────────────────────────
const JUDGE_SYSTEM = `You are the ONTOLOGY WARS judge — a strict Palantir Ontology Architect expert who evaluates AI agent submissions for accuracy, completeness, and Palantir compliance.

You score ontology submissions across 6 dimensions (each 0-100):
1. ACCURACY — Do Object Types, Properties, and Links correctly reflect the source data?
2. COMPLETENESS — Are all entities, relationships, and properties captured?
3. PALANTIR_COMPLIANCE — id (string primary key), PascalCase objects, camelCase properties, proper Link cardinality
4. AUTHORITY_ENGINEERING — Does the schema encode AE primitives (AU, DP, OU, EU, SB) correctly where relevant?
5. ACTIONABILITY — Are Action Types meaningful, governance-critical, and properly constrained?
6. ELEGANCE — Is the schema minimal, non-redundant, and professionally crafted?

Respond ONLY with valid JSON in this exact format:
{
  "scores": {
    "accuracy": <0-100>,
    "completeness": <0-100>,
    "palantir_compliance": <0-100>,
    "authority_engineering": <0-100>,
    "actionability": <0-100>,
    "elegance": <0-100>
  },
  "total": <weighted average 0-100>,
  "verdict": "PASSED" | "FAILED" | "EXCEPTIONAL",
  "object_types_found": <number>,
  "properties_found": <number>,
  "links_found": <number>,
  "actions_found": <number>,
  "critical_errors": ["<error1>", "<error2>"],
  "commendations": ["<strength1>", "<strength2>"],
  "axiom_violations": ["<violation if AE layer>"],
  "judge_commentary": "<2-3 sentence expert evaluation>"
}`;

// ── AGENT PERSONA PROMPTS ─────────────────────────────────────
const AGENT_PERSONAS = [
  {
    name: "PALANTIR-7",
    color: C.accent,
    icon: "◈",
    style: "You are PALANTIR-7, a hyper-precise ontology engine. You output minimal, clean JSON with ZERO narrative. Pure signal.",
    personality: "Clinical. Precise. No commentary.",
  },
  {
    name: "ONTOMANCER",
    color: C.purple,
    icon: "⬡",
    style: "You are ONTOMANCER, an ontology wizard who sees knowledge graphs as living structures. You craft ontologies like spells — every property intentional, every link meaningful.",
    personality: "Philosophical. Thorough. Finds hidden connections.",
  },
  {
    name: "GRAPHWRIGHT",
    color: C.orange,
    icon: "⬢",
    style: "You are GRAPHWRIGHT, a pragmatic graph engineer obsessed with operational utility. You ask: what ACTION does this enable? What DECISION does this support?",
    personality: "Pragmatic. Action-oriented. Governance-first.",
  },
  {
    name: "AE-SENTINEL",
    color: C.green,
    icon: "⬟",
    style: "You are AE-SENTINEL, trained exclusively on Authority Engineering specifications. You encode power, delegation, and obligation as your native language.",
    personality: "Authority-Engineering native. Axiom-compliant. Audit-obsessed.",
  },
];

const AGENT_ONTOLOGY_PROMPT = (dataset, challenge) => `
${challenge.hint ? `ARCHITECT HINT: ${challenge.hint}` : ""}

SOURCE DATASET:
${dataset}

Build a complete Palantir Foundry ontology from this data. Return ONLY valid JSON with this structure:
{
  "ObjectTypes": [
    {
      "name": "PascalCaseName",
      "api_name": "PascalCaseName",
      "description": "...",
      "primary_key": "id",
      "title_key": "propertyName",
      "properties": [
        {"name": "id", "api_name": "id", "type": "string", "description": "Unique identifier", "is_primary_key": true},
        {"name": "propertyName", "api_name": "camelCaseName", "type": "string|integer|double|boolean|timestamp", "description": "..."}
      ]
    }
  ],
  "LinkTypes": [
    {
      "name": "RelationshipName",
      "api_name": "relationshipName",
      "source_object": "SourceType",
      "target_object": "TargetType",
      "source_cardinality": "ONE|MANY",
      "target_cardinality": "ONE|MANY",
      "description": "..."
    }
  ],
  "ActionTypes": [
    {
      "name": "Action Name",
      "api_name": "actionApiName",
      "target_object_types": ["ObjectType"],
      "description": "...",
      "parameters": [{"name": "param", "type": "string"}],
      "submission_criteria": "Condition that must be met"
    }
  ]
}

Rules:
- Every Object Type MUST have id (string, primary key)
- Object Type api_names: PascalCase
- Property api_names: camelCase  
- Action Types must be governance-critical operations
- Foreign keys must reference the linked Object Type's id
- Return ONLY the JSON object, no markdown, no explanation
`;

// ── HELPERS ────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callClaude(messages, system, maxTokens = 2000) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

function parseJSON(text) {
  try {
    const clean = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

function calcFinalScore(judgeResult, timeUsed, timeLimit) {
  if (!judgeResult) return 0;
  const base = judgeResult.total || 0;
  const timeBonus = Math.max(0, Math.floor((1 - timeUsed / timeLimit) * 20));
  return Math.min(100, base + timeBonus);
}

// ── PARTICLE SYSTEM ──────────────────────────────────────────
function useParticles(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      color: [C.accent, C.purple, C.green][Math.floor(Math.random() * 3)],
    }));
    let raf;
    function draw() {
      ctx.fillStyle = "rgba(5,8,16,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = C.accent + Math.floor((1 - dist / 80) * 30).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function OntologyWars() {
  const [screen, setScreen] = useState("title"); // title | lobby | arena | results | leaderboard | setup
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([0, 1]);
  const [battleState, setBattleState] = useState(null);
  const [leaderboard, setLeaderboard] = useState([
    { agent: "PALANTIR-7", challenge: "PERMIT ROOKIE", score: 94, tokens: 470, time: 48 },
    { agent: "AE-SENTINEL", challenge: "AUTHORITY MAPPER", score: 91, tokens: 1092, time: 167 },
    { agent: "ONTOMANCER", challenge: "GRAPH WARLORD", score: 88, tokens: 2640, time: 289 },
    { agent: "GRAPHWRIGHT", challenge: "PERMIT ROOKIE", score: 85, tokens: 425, time: 61 },
    { agent: "PALANTIR-7", challenge: "AUTHORITY MAPPER", score: 82, tokens: 984, time: 180 },
  ]);
  const canvasRef = useRef();
  useParticles(canvasRef, screen === "title");

  const startBattle = useCallback(async () => {
    const challenge = selectedChallenge;
    const agents = selectedAgents.map(i => AGENT_PERSONAS[i]);
    setScreen("arena");

    const initial = agents.map(a => ({
      persona: a,
      status: "thinking",
      log: [`[INIT] ${a.name} entering arena...`],
      ontology: null,
      judgeResult: null,
      finalScore: null,
      timeUsed: null,
      tokensEarned: 0,
    }));
    setBattleState({ challenge, agents: initial, phase: "generating", elapsed: 0 });

    const startTime = Date.now();
    const ticker = setInterval(() => {
      setBattleState(s => s ? { ...s, elapsed: Math.floor((Date.now() - startTime) / 1000) } : s);
    }, 500);

    // Run agents in parallel
    const results = await Promise.all(
      agents.map(async (agent, idx) => {
        const agentStart = Date.now();
        setBattleState(s => {
          const a = [...s.agents];
          a[idx] = { ...a[idx], log: [...a[idx].log, `[GEN] Building ontology from ${challenge.dataset.split("\n").length} data lines...`] };
          return { ...s, agents: a };
        });

        let ontology = null;
        try {
          const raw = await callClaude(
            [{ role: "user", content: AGENT_ONTOLOGY_PROMPT(challenge.dataset, challenge) }],
            agent.style,
            3000
          );
          ontology = parseJSON(raw);
        } catch (e) {
          ontology = null;
        }

        const timeUsed = Math.floor((Date.now() - agentStart) / 1000);
        setBattleState(s => {
          const a = [...s.agents];
          a[idx] = {
            ...a[idx],
            status: ontology ? "judging" : "failed",
            ontology,
            timeUsed,
            log: [...a[idx].log,
              ontology
                ? `[GEN] ✓ Ontology built in ${timeUsed}s — ${ontology.ObjectTypes?.length || 0} types, ${ontology.LinkTypes?.length || 0} links`
                : `[ERR] ✗ Failed to parse ontology output`
            ],
          };
          return { ...s, agents: a };
        });

        if (!ontology) return { idx, judgeResult: null, finalScore: 0, timeUsed, tokensEarned: 0 };

        // Judge evaluation
        await sleep(500);
        setBattleState(s => {
          const a = [...s.agents];
          a[idx] = { ...a[idx], log: [...a[idx].log, `[JUDGE] Submitting to evaluation tribunal...`] };
          return { ...s, agents: a };
        });

        let judgeResult = null;
        try {
          const judgeRaw = await callClaude(
            [{
              role: "user",
              content: `CHALLENGE: ${challenge.name}\nSOURCE DATA:\n${challenge.dataset}\n\nAGENT SUBMISSION:\n${JSON.stringify(ontology, null, 2)}`
            }],
            JUDGE_SYSTEM,
            1500
          );
          judgeResult = parseJSON(judgeRaw);
        } catch (e) { judgeResult = null; }

        const finalScore = calcFinalScore(judgeResult, timeUsed, challenge.timeLimit);
        const tokensEarned = judgeResult?.verdict === "EXCEPTIONAL"
          ? challenge.tokens * 2
          : judgeResult?.verdict === "PASSED"
          ? Math.floor(challenge.tokens * finalScore / 100)
          : 0;

        setBattleState(s => {
          const a = [...s.agents];
          a[idx] = {
            ...a[idx],
            status: judgeResult?.verdict === "EXCEPTIONAL" ? "exceptional" : judgeResult?.verdict === "PASSED" ? "passed" : "failed",
            judgeResult,
            finalScore,
            tokensEarned,
            log: [...a[idx].log,
              judgeResult
                ? `[JUDGE] Verdict: ${judgeResult.verdict} | Score: ${finalScore}/100 | +${tokensEarned} tokens`
                : `[JUDGE] Evaluation failed`
            ],
          };
          return { ...s, agents: a };
        });

        return { idx, judgeResult, finalScore, timeUsed, tokensEarned };
      })
    );

    clearInterval(ticker);

    // Update leaderboard
    results.forEach(r => {
      if (r.finalScore > 0) {
        setLeaderboard(prev => [
          ...prev,
          {
            agent: agents[r.idx].name,
            challenge: challenge.name,
            score: r.finalScore,
            tokens: r.tokensEarned,
            time: r.timeUsed,
          }
        ].sort((a, b) => b.score - a.score).slice(0, 20));
      }
    });

    setBattleState(s => ({ ...s, phase: "complete" }));
  }, [selectedChallenge, selectedAgents]);

  // ── SCREENS ────────────────────────────────────────────────
  return (
    <TournamentProvider>
      <div style={{
        fontFamily: "'Space Mono', 'Courier New', monospace",
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        overflow: "hidden",
        position: "relative",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: ${C.panel}; }
          ::-webkit-scrollbar-thumb { background: ${C.accent}44; border-radius: 2px; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
          @keyframes glow { 0%,100%{text-shadow:0 0 10px currentColor} 50%{text-shadow:0 0 30px currentColor,0 0 60px currentColor} }
          @keyframes slide-in { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} }
          .glow { animation: glow 2s ease-in-out infinite; }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        .slide-in { animation: slide-in 0.3s ease forwards; }
        .float { animation: float 3s ease-in-out infinite; }
        .btn {
          background: transparent;
          border: 1px solid ${C.accent};
          color: ${C.accent};
          padding: 10px 20px;
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${C.accent};
          transform: translateX(-101%);
          transition: transform 0.2s;
          z-index: 0;
        }
        .btn:hover::before { transform: translateX(0); }
        .btn:hover { color: ${C.bg}; }
        .btn span { position: relative; z-index: 1; }
        .btn-gold { border-color: ${C.gold}; color: ${C.gold}; }
        .btn-gold::before { background: ${C.gold}; }
        .btn-gold:hover { color: ${C.bg}; }
        .btn-red { border-color: ${C.red}; color: ${C.red}; }
        .btn-red::before { background: ${C.red}; }
        .btn-red:hover { color: ${C.bg}; }
        .card {
          background: ${C.panel};
          border: 1px solid ${C.border};
          padding: 16px;
          position: relative;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: ${C.accent};
        }
        .terminal {
          background: #020408;
          border: 1px solid ${C.border};
          padding: 12px;
          font-size: 10px;
          line-height: 1.6;
          max-height: 180px;
          overflow-y: auto;
          font-family: 'Share Tech Mono', monospace;
        }
        .score-bar {
          height: 4px;
          background: ${C.border};
          position: relative;
          overflow: hidden;
        }
        .score-fill {
          height: 100%;
          transition: width 1s ease;
        }
      `}</style>

      {/* Scan line effect */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)",
        pointerEvents: "none", zIndex: 1000,
      }} />

      {screen === "title" && <TitleScreen canvasRef={canvasRef} onEnter={() => setScreen("lobby")} />}
      {screen === "lobby" && (
        <LobbyScreen
          challenges={CHALLENGES}
          agents={AGENT_PERSONAS}
          selectedChallenge={selectedChallenge}
          setSelectedChallenge={setSelectedChallenge}
          selectedAgents={selectedAgents}
          setSelectedAgents={setSelectedAgents}
          onBattle={startBattle}
          onLeaderboard={() => setScreen("leaderboard")}
          onSetup={() => setScreen("setup")}
        />
      )}
      {screen === "arena" && battleState && (
        <ArenaScreen
          battleState={battleState}
          onFinish={() => setScreen("lobby")}
          onLeaderboard={() => setScreen("leaderboard")}
        />
      )}
      {screen === "leaderboard" && (
        <LeaderboardScreen
          entries={leaderboard}
          onBack={() => setScreen("lobby")}
        />
      )}
      {screen === "setup" && (
        <SetupWizard
          onComplete={() => setScreen("lobby")}
        />
      )}
    </div>
    </TournamentProvider>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP SIDEBAR COMPONENT
// ══════════════════════════════════════════════════════════════
const STEPS = [
  { id: 0, label: "Dataset", description: "Select challenge dataset" },
  { id: 1, label: "Agents", description: "Configure competing agents" },
  { id: 2, label: "Review", description: "Review configuration" },
  { id: 3, label: "Launch", description: "Initiate tournament" },
];

function StepSidebar({ currentStep, onNavigate }) {
  return (
    <div style={{
      width: 200,
      background: C.panel,
      borderRight: `1px solid ${C.border}`,
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, marginBottom: 24 }}>
        SETUP WIZARD
      </div>
      
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const canNavigate = isCompleted || currentStep === step.id - 1;
        
        return (
          <div
            key={step.id}
            onClick={() => canNavigate && onNavigate(step.id)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 0",
              cursor: canNavigate ? "pointer" : "default",
              opacity: canNavigate ? 1 : 0.4,
              transition: "all 0.2s",
            }}
          >
            {/* Step number circle */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
              background: isActive ? C.accent : isCompleted ? C.green : "transparent",
              border: `1px solid ${isActive ? C.accent : isCompleted ? C.green : C.border}`,
              color: isActive || isCompleted ? C.bg : C.muted,
            }}>
              {isCompleted ? "✓" : step.id + 1}
            </div>
            
            {/* Step label */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? C.accent : C.text,
                letterSpacing: 1,
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Connecting line */}
      <div style={{
        position: "absolute",
        left: 31,
        top: 80,
        bottom: 40,
        width: 1,
        background: C.border,
        zIndex: -1,
      }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SETUP WIZARD CONTAINER
// ══════════════════════════════════════════════════════════════
function SetupWizard({ onComplete }) {
  const {
    selectedDataset,
    setSelectedDataset,
    selectedAgentIds,
    setSelectedAgentIds,
    agentApiKeys,
    setAgentApiKeys,
    webhookUrl,
    setWebhookUrl,
    currentStep,
    setCurrentStep,
  } = useTournament();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedDataset !== null;
      case 1: return selectedAgentIds.length >= 1;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <StepSidebar currentStep={currentStep} onNavigate={setCurrentStep} />
      
      {/* Main content area */}
      <div style={{ flex: 1, padding: 32 }}>
        {/* Step content */}
        <div style={{ marginBottom: 32 }}>
          {currentStep === 0 && (
            <DatasetStep 
              selectedDataset={selectedDataset} 
              onSelect={setSelectedDataset} 
            />
          )}
          {currentStep === 1 && (
            <AgentsStep
              selectedAgentIds={selectedAgentIds}
              onToggle={(id) => {
                setSelectedAgentIds(prev => 
                  prev.includes(id) 
                    ? prev.filter(i => i !== id)
                    : prev.length < 4 ? [...prev, id] : prev
                );
              }}
              agentApiKeys={agentApiKeys}
              setAgentApiKeys={setAgentApiKeys}
            />
          )}
          {currentStep === 2 && (
            <ReviewStep
              selectedDataset={selectedDataset}
              selectedAgentIds={selectedAgentIds}
              webhookUrl={webhookUrl}
            />
          )}
          {currentStep === 3 && (
            <LaunchStep />
          )}
        </div>
        
        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="btn"
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{ opacity: currentStep === 0 ? 0.3 : 1 }}
          >
            <span>◁ BACK</span>
          </button>
          
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>
            STEP {currentStep + 1} OF 4
          </div>
          
          <button
            className="btn btn-gold"
            onClick={handleNext}
            disabled={!canProceed()}
            style={{ opacity: canProceed() ? 1 : 0.3 }}
          >
            <span>{currentStep === 3 ? "⚔ LAUNCH" : "NEXT ▷"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DATASET STEP
// ══════════════════════════════════════════════════════════════
function DatasetStep({ selectedDataset, onSelect }) {
  return (
    <div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: C.accent, letterSpacing: 3, marginBottom: 8 }}>
        SELECT DATASET
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 24 }}>
        Choose the challenge dataset for your tournament
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHALLENGES.map(c => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              background: selectedDataset?.id === c.id ? `${C.accent}11` : C.panel,
              border: `1px solid ${selectedDataset?.id === c.id ? C.accent : C.border}`,
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
            }}
          >
            {selectedDataset?.id === c.id && (
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.accent }} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: selectedDataset?.id === c.id ? C.accent : C.text }}>
                  LVL {c.level} — {c.name}
                </div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{c.subtitle}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: getDiffColor(c.difficulty) }}>{c.difficulty}</div>
                <div style={{ fontSize: 10, color: C.gold, marginTop: 4 }}>⬡ {c.tokens}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// AGENTS STEP
// ══════════════════════════════════════════════════════════════
function AgentsStep({ selectedAgentIds, onToggle, agentApiKeys, setAgentApiKeys }) {
  const { agents } = useTournament();
  
  return (
    <div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: C.accent, letterSpacing: 3, marginBottom: 8 }}>
        CONFIGURE AGENTS
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 24 }}>
        Select 1-4 agents to compete in the tournament
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {agents.map((agent, idx) => (
          <div
            key={agent.name}
            onClick={() => onToggle(idx)}
            style={{
              background: selectedAgentIds.includes(idx) ? `${agent.color}11` : C.panel,
              border: `1px solid ${selectedAgentIds.includes(idx) ? agent.color : C.border}`,
              padding: 16,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, color: agent.color, marginBottom: 8 }}>{agent.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: selectedAgentIds.includes(idx) ? agent.color : C.text }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{agent.personality}</div>
            {selectedAgentIds.includes(idx) && (
              <div style={{ fontSize: 8, color: agent.color, marginTop: 8, letterSpacing: 2 }}>● SELECTED</div>
            )}
          </div>
        ))}
      </div>
      
      {/* API Keys section */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: C.gold, marginBottom: 12 }}>AGENT API KEYS</div>
        <div style={{ fontSize: 9, color: C.muted, marginBottom: 12 }}>
          Optional: Add custom API keys per agent (defaults to global ANTHROPIC_API key)
        </div>
        
        {selectedAgentIds.map(idx => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 9, color: C.text, display: "block", marginBottom: 4 }}>
              {agents[idx].name} API Key
            </label>
            <input
              type="password"
              value={agentApiKeys[idx] || ""}
              onChange={(e) => setAgentApiKeys(prev => ({ ...prev, [idx]: e.target.value }))}
              placeholder="sk-ant-..."
              style={{
                width: "100%",
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "8px 12px",
                fontSize: 10,
                color: C.text,
                fontFamily: "inherit",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// REVIEW STEP
// ══════════════════════════════════════════════════════════════
function ReviewStep({ selectedDataset, selectedAgentIds, webhookUrl }) {
  const { agents, agentApiKeys } = useTournament();
  
  return (
    <div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: C.accent, letterSpacing: 3, marginBottom: 8 }}>
        REVIEW CONFIGURATION
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 24 }}>
        Verify your tournament settings before launch
      </div>
      
      <div style={{ display: "grid", gap: 16 }}>
        {/* Dataset summary */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, marginBottom: 12 }}>SELECTED DATASET</div>
          {selectedDataset ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{selectedDataset.name}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{selectedDataset.subtitle}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: C.dim }}>
                <span>◈ {selectedDataset.targetSchema.objectTypes.length} types</span>
                <span>⬡ {selectedDataset.tokens} tokens</span>
                <span>⏱ {selectedDataset.timeLimit}s</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 10, color: C.red }}>No dataset selected</div>
          )}
        </div>
        
        {/* Agents summary */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, marginBottom: 12 }}>DEPLOYED AGENTS</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {selectedAgentIds.map(idx => (
              <div key={idx} style={{ 
                display: "flex", alignItems: "center", gap: 8,
                background: `${agents[idx].color}11`, border: `1px solid ${agents[idx].color}33`,
                padding: "8px 12px",
              }}>
                <span style={{ color: agents[idx].color }}>{agents[idx].icon}</span>
                <span style={{ fontSize: 10, color: C.text }}>{agents[idx].name}</span>
                {agentApiKeys[idx] && <span style={{ fontSize: 8, color: C.green }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
        
        {/* Security notice */}
        <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.purple, marginBottom: 8 }}>SECURITY NOTICE</div>
          <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.6 }}>
            All configuration is stored in session state only. Data clears on page refresh.
            No API keys are persisted to localStorage or sessionStorage.
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LAUNCH STEP
// ══════════════════════════════════════════════════════════════
function LaunchStep() {
  return (
    <div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: C.accent, letterSpacing: 3, marginBottom: 8 }}>
        READY TO LAUNCH
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 24 }}>
        Your tournament is configured and ready to begin
      </div>
      
      <div style={{ 
        background: `linear-gradient(135deg, ${C.accent}11, ${C.purple}11)`,
        border: `1px solid ${C.accent}`,
        padding: 32,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚔</div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: C.text, letterSpacing: 3, marginBottom: 8 }}>
          TOURNAMENT READY
        </div>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>
          CLICK "LAUNCH" TO BEGIN THE ARENA
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TITLE SCREEN
// ══════════════════════════════════════════════════════════════
function TitleScreen({ canvasRef, onEnter }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: C.accent, marginBottom: 16, opacity: 0.7 }}>
          STANDING FRAMEWORK × PALANTIR FOUNDRY
        </div>
        <h1 style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: 900,
          color: C.text,
          textShadow: `0 0 40px ${C.accent}88, 0 0 80px ${C.accent}44`,
          letterSpacing: "0.05em",
          lineHeight: 1,
          marginBottom: 8,
        }} className="glow">
          ONTOLOGY
        </h1>
        <h1 style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: 900,
          color: C.accent,
          textShadow: `0 0 40px ${C.accent}, 0 0 80px ${C.accent}66`,
          letterSpacing: "0.05em",
          lineHeight: 1,
          marginBottom: 32,
        }}>
          WARS
        </h1>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {[
            { icon: "◈", label: "AGENT vs AGENT" },
            { icon: "⬡", label: "REAL CLAUDE API" },
            { icon: "⬢", label: "LIVE SCORING" },
            { icon: "⬟", label: "TOKEN PRIZES" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: 2, color: C.muted }}>
              <span style={{ color: C.accent }}>{icon}</span> {label}
            </div>
          ))}
        </div>

        <p style={{ color: C.muted, fontSize: 12, letterSpacing: 1, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
          Deploy AI agents to compete in ontology engineering challenges.
          Build knowledge graphs. Earn tokens. Dominate the leaderboard.
        </p>

        <button className="btn btn-gold" onClick={onEnter} style={{ fontSize: 14, padding: "14px 48px", letterSpacing: 4 }}>
          <span>ENTER ARENA</span>
        </button>

        <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center" }}>
          {AGENT_PERSONAS.map(a => (
            <div key={a.name} className="float" style={{ textAlign: "center", animationDelay: `${Math.random() * 2}s` }}>
              <div style={{ fontSize: 24, color: a.color }}>{a.icon}</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, marginTop: 4 }}>{a.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LOBBY SCREEN
// ══════════════════════════════════════════════════════════════
function LobbyScreen({ challenges, agents, selectedChallenge, setSelectedChallenge, selectedAgents, setSelectedAgents, onBattle, onLeaderboard, onSetup }) {
  const toggleAgent = (idx) => {
    setSelectedAgents(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 4 ? [...prev, idx] : prev
    );
  };

  const canStart = selectedChallenge && selectedAgents.length >= 1;

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.accent, letterSpacing: 3 }}>
            ONTOLOGY WARS
          </div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 2 }}>MISSION CONTROL</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={onSetup}><span>⚔ TOURNAMENT</span></button>
          <button className="btn" onClick={onLeaderboard}><span>◈ LEADERBOARD</span></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Challenge Selection */}
        <div>
          <SectionHeader title="SELECT CHALLENGE" subtitle="Choose your knowledge domain" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {challenges.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                selected={selectedChallenge?.id === c.id}
                onClick={() => setSelectedChallenge(c)}
              />
            ))}
          </div>
        </div>

        {/* Agent Selection + Launch */}
        <div>
          <SectionHeader title="DEPLOY AGENTS" subtitle="Select 1-4 competing agents" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {agents.map((a, idx) => (
              <AgentCard
                key={a.name}
                agent={a}
                selected={selectedAgents.includes(idx)}
                onClick={() => toggleAgent(idx)}
              />
            ))}
          </div>

          {/* Battle Preview */}
          {selectedChallenge && selectedAgents.length > 0 && (
            <div className="card slide-in" style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.gold, marginBottom: 12 }}>BATTLE BRIEFING</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 8 }}>
                <span style={{ color: C.muted }}>CHALLENGE</span>
                <span style={{ color: C.text }}>{selectedChallenge.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 8 }}>
                <span style={{ color: C.muted }}>COMBATANTS</span>
                <span style={{ color: C.text }}>{selectedAgents.map(i => agents[i].name).join(" vs ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 8 }}>
                <span style={{ color: C.muted }}>TOKEN POOL</span>
                <span style={{ color: C.gold }}>⬡ {selectedChallenge.tokens} BASE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 16 }}>
                <span style={{ color: C.muted }}>DIFFICULTY</span>
                <span style={{ color: getDiffColor(selectedChallenge.difficulty) }}>{selectedChallenge.difficulty}</span>
              </div>
              <button
                className="btn btn-gold"
                onClick={onBattle}
                disabled={!canStart}
                style={{ width: "100%", fontSize: 13, padding: "12px", letterSpacing: 3, opacity: canStart ? 1 : 0.3 }}
              >
                <span>⚔ INITIATE BATTLE</span>
              </button>
            </div>
          )}

          {/* AE Axiom reminder */}
          <div style={{ marginTop: 20, background: C.panel, border: `1px solid ${C.purple}33`, padding: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.purple, marginBottom: 8 }}>AUTHORITY ENGINEERING AXIOMS</div>
            {["A1: Authority Requirement", "A5: Evidence Sufficiency", "A7: Mandatory Escalation", "A8: Human Supremacy"].map(ax => (
              <div key={ax} style={{ fontSize: 10, color: C.muted, padding: "3px 0", borderBottom: `1px solid ${C.border}` }}>
                {ax}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, letterSpacing: 3, color: C.accent }}>{title}</div>
      <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, marginTop: 2 }}>{subtitle}</div>
      <div style={{ height: 1, background: `linear-gradient(to right, ${C.accent}, transparent)`, marginTop: 8 }} />
    </div>
  );
}

function getDiffColor(d) {
  return d === "INITIATE" ? C.green : d === "APPRENTICE" ? C.orange : C.red;
}

function ChallengeCard({ challenge, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${C.accent}11` : C.panel,
        border: `1px solid ${selected ? C.accent : C.border}`,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {selected && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.accent }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: selected ? C.accent : C.text }}>
            LVL {challenge.level} — {challenge.name}
          </div>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginTop: 2 }}>{challenge.subtitle}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: getDiffColor(challenge.difficulty), letterSpacing: 1 }}>{challenge.difficulty}</div>
          <div style={{ fontSize: 9, color: C.gold }}>⬡ {challenge.tokens}</div>
        </div>
      </div>
      <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{challenge.description}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 9, color: C.dim }}>
        <span>◈ {challenge.targetSchema.objectTypes.length} types</span>
        <span>⬡ {challenge.targetSchema.minLinks}+ links</span>
        <span>⚡ {challenge.targetSchema.minActions}+ actions</span>
        <span>⏱ {challenge.timeLimit}s</span>
      </div>
    </div>
  );
}

function AgentCard({ agent, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${agent.color}11` : C.panel,
        border: `1px solid ${selected ? agent.color : C.border}`,
        padding: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 28, color: agent.color, marginBottom: 8 }}>{agent.icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: selected ? agent.color : C.text }}>{agent.name}</div>
      <div style={{ fontSize: 9, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>{agent.personality}</div>
      {selected && <div style={{ fontSize: 8, color: agent.color, marginTop: 8, letterSpacing: 2 }}>● DEPLOYED</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ARENA SCREEN
// ══════════════════════════════════════════════════════════════
function ArenaScreen({ battleState, onFinish, onLeaderboard }) {
  const { challenge, agents, phase, elapsed } = battleState;
  const complete = phase === "complete";

  const winner = complete
    ? agents.reduce((best, a) => (a.finalScore || 0) > (best.finalScore || 0) ? a : best, agents[0])
    : null;

  return (
    <div style={{ minHeight: "100vh", padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Arena Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 16,
      }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: C.accent, letterSpacing: 3 }}>
            ⚔ BATTLE ARENA
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{challenge.name} — {challenge.subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>ELAPSED</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.text }}>{elapsed}s</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>LIMIT</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.text }}>{challenge.timeLimit}s</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>POOL</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.gold }}>⬡{challenge.tokens}</div>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {complete && winner && (
        <div className="slide-in" style={{
          background: `linear-gradient(90deg, ${winner.persona.color}22, transparent)`,
          border: `1px solid ${winner.persona.color}`,
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{ fontSize: 32, color: winner.persona.color }}>{winner.persona.icon}</div>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: winner.persona.color }}>
              {winner.judgeResult?.verdict === "EXCEPTIONAL" ? "🏆 EXCEPTIONAL PERFORMANCE —" : "🥇 BATTLE WINNER —"} {winner.persona.name}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              Final Score: {winner.finalScore}/100 | Tokens Earned: ⬡{winner.tokensEarned}
            </div>
            {winner.judgeResult?.judge_commentary && (
              <div style={{ fontSize: 10, color: C.text, marginTop: 6, fontStyle: "italic" }}>
                "{winner.judgeResult.judge_commentary}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agent Panels */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${agents.length}, 1fr)`,
        gap: 16,
        marginBottom: 24,
      }}>
        {agents.map((agent, idx) => (
          <AgentPanel key={idx} agent={agent} isWinner={complete && winner?.persona.name === agent.persona.name} />
        ))}
      </div>

      {/* Data Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, marginBottom: 12 }}>SOURCE DATA PREVIEW</div>
          <div style={{
            fontSize: 9, color: C.muted, lineHeight: 1.6, maxHeight: 200, overflow: "hidden",
            fontFamily: "'Share Tech Mono', monospace",
          }}>
            {challenge.dataset.substring(0, 400)}...
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, marginBottom: 12 }}>TARGET SCHEMA REQUIREMENTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {challenge.targetSchema.objectTypes.map(ot => (
              <div key={ot} style={{
                fontSize: 9, padding: "4px 8px",
                background: `${C.accent}11`, border: `1px solid ${C.accent}33`,
                color: C.accent, letterSpacing: 1,
              }}>
                ◈ {ot}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <span style={{ fontSize: 10, color: C.muted }}>Min props: <strong style={{ color: C.text }}>{challenge.targetSchema.minProperties}</strong></span>
            <span style={{ fontSize: 10, color: C.muted }}>Min links: <strong style={{ color: C.text }}>{challenge.targetSchema.minLinks}</strong></span>
            <span style={{ fontSize: 10, color: C.muted }}>Min actions: <strong style={{ color: C.text }}>{challenge.targetSchema.minActions}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {complete && (
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={onFinish}><span>◁ NEW BATTLE</span></button>
          <button className="btn btn-gold" onClick={onLeaderboard}><span>◈ LEADERBOARD</span></button>
        </div>
      )}
    </div>
  );
}

function AgentPanel({ agent, isWinner }) {
  const { persona, status, log, ontology, judgeResult, finalScore, tokensEarned } = agent;
  const statusColors = {
    thinking: C.accent,
    judging: C.purple,
    passed: C.green,
    exceptional: C.gold,
    failed: C.red,
  };
  const statusColor = statusColors[status] || C.muted;

  return (
    <div style={{
      background: C.panel,
      border: `1px solid ${isWinner ? persona.color : C.border}`,
      padding: 16,
      position: "relative",
      transition: "border-color 0.5s",
    }}>
      {isWinner && (
        <div style={{
          position: "absolute", top: -1, left: 0, right: 0,
          height: 2, background: `linear-gradient(to right, transparent, ${persona.color}, transparent)`,
        }} />
      )}

      {/* Agent Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: persona.color }}>{persona.icon}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: persona.color }}>{persona.name}</div>
            <div style={{ fontSize: 9, color: C.muted }}>{persona.personality}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 9, letterSpacing: 2, color: statusColor,
            ...(status === "thinking" || status === "judging" ? { animation: "pulse 1s infinite" } : {}),
          }}>
            {status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Score Display */}
      {finalScore !== null && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>FINAL SCORE</span>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: statusColor }}>{finalScore}</span>
          </div>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${finalScore}%`, background: statusColor }} />
          </div>
          {tokensEarned > 0 && (
            <div style={{ textAlign: "right", fontSize: 10, color: C.gold, marginTop: 4 }}>+⬡{tokensEarned}</div>
          )}
        </div>
      )}

      {/* Dimension Scores */}
      {judgeResult?.scores && (
        <div style={{ marginBottom: 12 }}>
          {Object.entries(judgeResult.scores).map(([key, val]) => (
            <div key={key} style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 8, color: C.muted, letterSpacing: 1 }}>{key.replace(/_/g, " ").toUpperCase()}</span>
                <span style={{ fontSize: 8, color: val >= 80 ? C.green : val >= 60 ? C.orange : C.red }}>{val}</span>
              </div>
              <div className="score-bar" style={{ height: 2 }}>
                <div className="score-fill" style={{
                  width: `${val}%`,
                  background: val >= 80 ? C.green : val >= 60 ? C.orange : C.red,
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ontology Stats */}
      {ontology && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 12,
        }}>
          {[
            { label: "TYPES", val: ontology.ObjectTypes?.length || 0, color: C.accent },
            { label: "LINKS", val: ontology.LinkTypes?.length || 0, color: C.purple },
            { label: "ACTIONS", val: ontology.ActionTypes?.length || 0, color: C.orange },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "center", background: `${color}11`, border: `1px solid ${color}22`, padding: "6px 4px" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color }}>{val}</div>
              <div style={{ fontSize: 8, color: C.muted, letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Judge Commentary */}
      {judgeResult?.judge_commentary && (
        <div style={{
          fontSize: 9, color: C.muted, fontStyle: "italic",
          borderLeft: `2px solid ${statusColor}`, paddingLeft: 8, marginBottom: 12, lineHeight: 1.5,
        }}>
          {judgeResult.judge_commentary}
        </div>
      )}

      {/* Critical Errors */}
      {judgeResult?.critical_errors?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {judgeResult.critical_errors.map((e, i) => (
            <div key={i} style={{ fontSize: 8, color: C.red, padding: "2px 0" }}>✗ {e}</div>
          ))}
        </div>
      )}

      {/* Commendations */}
      {judgeResult?.commendations?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {judgeResult.commendations.slice(0, 2).map((c, i) => (
            <div key={i} style={{ fontSize: 8, color: C.green, padding: "2px 0" }}>✓ {c}</div>
          ))}
        </div>
      )}

      {/* Terminal Log */}
      <div className="terminal">
        {log.map((line, i) => (
          <div key={i} style={{
            color: line.includes("[ERR]") ? C.red : line.includes("[JUDGE]") ? C.purple : line.includes("[GEN]") ? C.green : C.muted,
          }}>
            {line}
          </div>
        ))}
        {(status === "thinking" || status === "judging") && (
          <div style={{ color: C.accent, animation: "blink 1s infinite" }}>▊</div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LEADERBOARD SCREEN
// ══════════════════════════════════════════════════════════════
function LeaderboardScreen({ entries, onBack }) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ minHeight: "100vh", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.gold, letterSpacing: 3 }}>
            ◈ HALL OF DOMINANCE
          </div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 2 }}>TOP ONTOLOGY ARCHITECTS</div>
        </div>
        <button className="btn" onClick={onBack}><span>◁ BACK</span></button>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[1, 0, 2].map((rank, col) => {
            const e = entries[rank];
            if (!e) return <div key={col} />;
            const agentColor = AGENT_PERSONAS.find(a => a.name === e.agent)?.color || C.accent;
            const heights = ["120px", "160px", "80px"];
            return (
              <div key={col} style={{
                background: `${agentColor}11`,
                border: `1px solid ${agentColor}44`,
                padding: 16,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: heights[col],
              }}>
                <div style={{ fontSize: 24 }}>{medals[rank] || ""}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: agentColor, marginTop: 8 }}>
                  {AGENT_PERSONAS.find(a => a.name === e.agent)?.icon} {e.agent}
                </div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{e.challenge}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, color: C.text, marginTop: 8 }}>{e.score}</div>
                <div style={{ fontSize: 10, color: C.gold }}>⬡ {e.tokens}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 1fr 80px 80px 80px",
          padding: "10px 16px",
          borderBottom: `1px solid ${C.border}`,
          fontSize: 9, letterSpacing: 2, color: C.muted,
        }}>
          <span>#</span>
          <span>AGENT</span>
          <span>CHALLENGE</span>
          <span>SCORE</span>
          <span>TOKENS</span>
          <span>TIME</span>
        </div>
        {entries.map((e, i) => {
          const agentColor = AGENT_PERSONAS.find(a => a.name === e.agent)?.color || C.accent;
          const icon = AGENT_PERSONAS.find(a => a.name === e.agent)?.icon || "◈";
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 1fr 80px 80px 80px",
              padding: "12px 16px",
              borderBottom: `1px solid ${C.border}`,
              alignItems: "center",
              background: i < 3 ? `${agentColor}08` : "transparent",
            }}>
              <span style={{ fontSize: 11, color: C.muted }}>{medals[i] || i + 1}</span>
              <span style={{ fontSize: 11, color: agentColor }}>{icon} {e.agent}</span>
              <span style={{ fontSize: 10, color: C.muted }}>{e.challenge}</span>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: e.score >= 90 ? C.green : e.score >= 70 ? C.text : C.orange }}>
                {e.score}
              </span>
              <span style={{ fontSize: 11, color: C.gold }}>⬡{e.tokens}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{e.time}s</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "SCORING DIMENSIONS", items: ["Accuracy", "Completeness", "Palantir Compliance", "Authority Engineering", "Actionability", "Elegance"] },
          { label: "TOKEN MULTIPLIERS", items: ["EXCEPTIONAL verdict: 2x tokens", "PASSED verdict: score% tokens", "Speed bonus: up to +20 pts", "FAILED: 0 tokens"] },
          { label: "AE AXIOM SCORING", items: ["A1 Authority Requirement", "A2 Delegation Closure", "A5 Evidence Sufficiency", "A7 Mandatory Escalation", "A8 Human Supremacy"] },
        ].map(({ label, items }) => (
          <div key={label} style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: C.accent, marginBottom: 8 }}>{label}</div>
            {items.map(item => (
              <div key={item} style={{ fontSize: 9, color: C.muted, padding: "2px 0" }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
