# Phase 1: Setup & Dataset Selection - Research

**Researched:** 2026-02-28
**Domain:** Browser-based React UI for tournament setup with session-only API key handling
**Confidence:** HIGH

## Summary

Phase 1 requires building a React-based setup wizard for configuring tournament datasets and four AI agents. Key findings: (1) Use React state (useState/Context) for session-only API key storage—NEVER localStorage or sessionStorage per SEC-01. (2) Build custom wizard using step state and conditional rendering; no external library needed for this complexity level. (3) Use CSS Grid with `repeat(auto-fit, minmax(...))` for responsive card grids. (4) Native HTML `<dialog>` element for modals—well-supported since 2022. (5) React Hook Form + Zod for form validation if needed, but simple validation can use native constraints.

**Primary recommendation:** Build custom wizard with React state, CSS Grid cards, native dialog modals, and session-only memory for API keys. No external form/wizard libraries needed for 4-step flow.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Card grid layout (2-3 columns) with click-to-select dataset cards
- Card content: name, tier badge (icon + number), agency, short description
- Four house agents pre-filled: Ontomancer, AE_Sentinel, Graphwright, Dataminer (with icons and colors)
- "+" card opens modal for agent configuration
- Password-style API key input with "Show" toggle
- Stepped wizard: Dataset → Agents → Review → Launch
- Sidebar with numbered steps for navigation
- Session-only key storage (no localStorage/sessionStorage)

### Claude's Discretion
- Exact card grid column count (2 vs 3) based on responsive breakpoints
- Modal form fields and exact validation logic
- Step transition animations
- Color palette for house agents

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | Operator can view all curated datasets with name, agency, tier, and sample query | Use CSS Grid responsive card layout with tier badges |
| DATA-02 | Operator can select exactly one dataset per tournament | Single-selection card pattern with visual selected state |
| DATA-03 | Each dataset includes statutory constraint and workflow stress test trace | Dataset objects include this data; UI displays in card |
| AGENT-01 | Operator can configure four agent slots (name, icon, color, provider, model) | House agents pre-filled; modal for editing; provider/model dropdowns |
| AGENT-02 | Operator can provide API key per agent slot, stored only in session memory | React useState/Context - NO localStorage/sessionStorage |
| AGENT-03 | Operator can add an optional system prompt suffix per agent | Text field in agent modal |
| UI-01 | Title screen links to Setup, Arena, Leaderboard, and API Docs | Title screen component with navigation |
| UI-02 | Setup screen includes dataset selection, agent configuration, scoring weights, webhook URL | 4-step wizard covers this |
| SEC-01 | API keys are never persisted to localStorage/sessionStorage | Session-only via React state |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18+ | UI framework | Already in use (ontology-wars.jsx uses React hooks) |
| CSS Grid/Flexbox | - | Responsive card layout | Native CSS, no library needed |
| Native HTML `<dialog>` | - | Modal component | Well-supported since 2022, accessible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Hook Form | 7.x | Form validation | If complex validation needed beyond native |
| Zod | 3.x | Schema validation | If validating agent config structure |
| useContext | - | Session state sharing | For passing API keys between components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom wizard | react-step-builder, react-step-wizard | Extra dependency; 4-step flow simple enough |
| CSS Grid cards | react-bootstrap, Material UI Grid | Extra dependency; native CSS sufficient |
| Native dialog | react-modal, @mui/base Modal | Extra dependency; native works since 2022 |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── TitleScreen.jsx       # Landing page with navigation
│   ├── SetupWizard.jsx       # Main wizard container
│   ├── steps/
│   │   ├── DatasetStep.jsx   # Card grid selection
│   │   ├── AgentsStep.jsx    # Four agent slots + modal
│   │   ├── ReviewStep.jsx   # Tournament preview
│   │   └── LaunchStep.jsx   # Final confirmation
│   ├── ui/
│   │   ├── CardGrid.jsx      # Reusable card grid
│   │   ├── DatasetCard.jsx   # Dataset selection card
│   │   ├── AgentCard.jsx     # Agent slot card
│   │   ├── AgentModal.jsx    # Agent configuration modal
│   │   ├── StepSidebar.jsx   # Wizard step navigation
│   │   └── TierBadge.jsx     # Tier indicator (star/shield/trophy)
│   └── shared/
│       ├── PasswordInput.jsx # API key input with show toggle
│       └── IconPicker.jsx    # Agent icon selection
├── context/
│   └── TournamentContext.jsx # Session-only state (no persistence)
├── data/
│   └── datasets.js           # Curated dataset definitions
└── App.jsx                   # Main app with routing
```

### Pattern 1: Session-Only API Key Storage
**What:** Store sensitive API keys in React state only, never persist to browser storage
**When to use:** Any time storing user-provided secrets in browser-only app
**Example:**
```javascript
// Source: https://www.ignek.com/blog/secure-token-storage-react-best-practices/
const [apiKeys, setApiKeys] = useState({});

const handleKeyChange = (agentId, key) => {
  setApiKeys(prev => ({ ...prev, [agentId]: key }));
};

// Keys exist only in memory - cleared on page refresh/close
// NEVER: localStorage.setItem('apiKey', key)
// NEVER: sessionStorage.setItem('apiKey', key)
```

### Pattern 2: Multi-Step Wizard with State
**What:** Conditional rendering based on step index, state shared via context
**When to use:** Setup flows, configuration wizards
**Example:**
```javascript
// Source: https://claritydev.net/blog/build-a-multistep-form-with-react-hook-form
const [currentStep, setCurrentStep] = useState(0);
const [formData, setFormData] = useState({});

const steps = [
  { id: 'dataset', component: <DatasetStep /> },
  { id: 'agents', component: <AgentsStep /> },
  { id: 'review', component: <ReviewStep /> },
  { id: 'launch', component: <LaunchStep /> },
];

return (
  <div className="wizard">
    <StepSidebar currentStep={currentStep} onNavigate={setCurrentStep} />
    {steps[currentStep].component}
  </div>
);
```

### Pattern 3: Single-Selection Card Grid
**What:** Click anywhere on card to select, visual feedback on selection
**When to use:** Dataset/tier selection UI
**Example:**
```javascript
// Source: Responsive Grid patterns from research
const [selectedId, setSelectedId] = useState(null);

return (
  <div className="card-grid">
    {datasets.map(dataset => (
      <div
        key={dataset.id}
        className={`dataset-card ${selectedId === dataset.id ? 'selected' : ''}`}
        onClick={() => setSelectedId(dataset.id)}
      >
        {/* card content */}
      </div>
    ))}
  </div>
);
```

### Pattern 4: Native HTML Dialog for Modals
**What:** Use `<dialog>` element with showModal()/close()
**When to use:** Agent configuration modal
**Example:**
```javascript
// Source: https://medium.com/@michael-fares/easily-create-modals-in-2025-with-the-native-html-dialog-element
const dialogRef = useRef(null);

const openModal = () => dialogRef.current?.showModal();
const closeModal = () => dialogRef.current?.close();

return (
  <dialog ref={dialogRef} onClose={handleClose}>
    <form method="dialog">
      {/* modal content */}
      <button onClick={closeModal}>Close</button>
    </form>
  </dialog>
);
```

### Anti-Patterns to Avoid
- **localStorage/sessionStorage for API keys:** Violates SEC-01. Use React state only.
- **External wizard library for simple flows:** Adds unnecessary dependency weight.
- **Portal-only modals:** Native `<dialog>` with portal is fine but not required for simple cases.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|------------|-----|
| Responsive grid | Custom JS breakpoints | CSS Grid `auto-fit` | Native CSS handles this elegantly |
| Modal overlay | Custom backdrop + focus trap | Native `<dialog>` | Built-in accessibility, focus management |
| Form validation | Custom validation logic | Native HTML5 constraints | Works out of the box for simple cases |

**Key insight:** For a 4-step wizard in a browser-only app, custom React state management is simpler than integrating external wizard libraries. CSS Grid with auto-fit handles responsive card layouts without framework dependencies.

## Common Pitfalls

### Pitfall 1: Persisting API Keys to Browser Storage
**What goes wrong:** Keys survive page refresh, potential XSS theft
**Why it happens:** Developer convenience, not understanding security implications
**How to avoid:** Use only React state (useState/useContext). Add lint rule to prevent localStorage usage.
**Warning signs:** Code contains `localStorage.setItem` or `sessionStorage.setItem` for sensitive data

### Pitfall 2: Wizard State Loss on Step Navigation
**What goes wrong:** User navigates back, loses entered data
**Why it happens:** Each step manages its own isolated state
**How to avoid:** Lift state to parent component or use Context. Validate on "next" but don't reset.
**Warning signs:** Entering data, clicking back, data is gone

### Pitfall 3: Card Grid Not Responsive
**What goes wrong:** Cards too wide on mobile, too narrow on desktop
**Why it happens:** Fixed column counts
**How to avoid:** Use CSS Grid `repeat(auto-fit, minmax(300px, 1fr))` for fluid columns
**Warning signs:** Horizontal scroll on mobile, excessive whitespace on desktop

### Pitfall 4: Modal Focus Not Trapped
**What goes wrong:** Tab key escapes modal, user interacts with background
**Why it happens:** Custom modal implementation without focus management
**How to avoid:** Use native `<dialog>` which handles this automatically
**Warning signs:** Custom overlay div with onClick backdrop handler

## Code Examples

### Responsive Card Grid (CSS)
```css
/* Source: Responsive Grid patterns from research */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.dataset-card {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.dataset-card:hover {
  transform: translateY(-2px);
}

.dataset-card.selected {
  border-color: var(--accent-color);
}
```

### Password Input with Show Toggle
```javascript
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="password-input-wrapper">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};
```

### Agent Modal with Provider/Model Selection
```javascript
const AgentModal = ({ agent, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  
  return (
    <dialog open={isOpen} onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(); }}>
        <select name="provider" defaultValue={agent.provider}>
          <option value="anthropic">Anthropic</option>
          <option value="openai">OpenAI</option>
          <option value="google">Google</option>
        </select>
        
        <select name="model" defaultValue={agent.model}>
          {/* Models filtered by provider */}
        </select>
        
        <PasswordInput 
          value={agent.apiKey} 
          onChange={key => onSave({ ...agent, apiKey: key })} 
        />
        
        <textarea 
          name="promptSuffix" 
          defaultValue={agent.promptSuffix}
          placeholder="Optional system prompt suffix..."
        />
        
        <button type="submit">Save</button>
      </form>
    </dialog>
  );
};
```

### Tournament Context (Session-Only)
```javascript
// Source: Best practices for session-only storage
import { createContext, useContext, useState } from 'react';

const TournamentContext = createContext(null);

export const TournamentProvider = ({ children }) => {
  // Session-only state - NEVER persisted
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [agents, setAgents] = useState([
    { id: 1, name: 'Ontomancer', icon: '⬡', color: '#a855f7' },
    { id: 2, name: 'AE_Sentinel', icon: '⬟', color: '#00ff88' },
    { id: 3, name: 'Graphwright', icon: '⬢', color: '#ff6b35' },
    { id: 4, name: 'Dataminer', icon: '◉', color: '#00d4ff' },
  ]);
  // API keys stored ONLY in memory - cleared on refresh
  const [agentApiKeys, setAgentApiKeys] = useState({});
  const [agentPromptSuffixes, setAgentPromptSuffixes] = useState({});
  
  return (
    <TournamentContext.Provider value={{
      selectedDataset, setSelectedDataset,
      agents, setAgents,
      agentApiKeys, setAgentApiKeys,
      agentPromptSuffixes, setAgentPromptSuffixes,
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Portal-based modals | Native `<dialog>` element | 2022+ | Simpler code, built-in accessibility |
| Redux for wizard state | React useState/Context | 2020+ | Less boilerplate for simple flows |
| localStorage for tokens | In-memory React state | Now standard | Security best practice |
| Fixed column grids | CSS auto-fit | CSS Grid (2017+) | Truly responsive without JS |

**Deprecated/outdated:**
- react-wizard: Over-engineered for 4-step flows
- localStorage for sensitive data: Security risk
- jQuery-style modal libraries: Native dialog suffices

## Open Questions

1. **Where are curated datasets stored?**
   - What we know: CONTEXT shows they exist with tier/agency/sample query
   - What's unclear: Static JS array? Fetched? How many?
   - Recommendation: Start with static array in `datasets.js`, expand to fetch later

2. **What providers/models are supported?**
   - What we know: AGENT-01 mentions provider/model config
   - What's unclear: Just Anthropic? OpenAI? Others?
   - Recommendation: Support Anthropic (current code), OpenAI, Google; structure for easy extension

3. **How to validate API keys?**
   - What we know: Real-time validation on blur, test connection on button click
   - What's unclear: Exact validation logic per provider
   - Recommendation: Simple format check on blur; connection test via lightweight API call

## Sources

### Primary (HIGH confidence)
- https://www.ignek.com/blog/secure-token-storage-react-best-practices/ - Session-only token storage best practices
- https://claritydev.net/blog/build-a-multistep-form-with-react-hook-form - React wizard patterns
- https://medium.com/@michael-fares/easily-create-modals-in-2025-with-the-native-html-dialog-element - Native dialog element
- https://stackoverflow.com/questions/70293669/responsive-card-grid-in-react - CSS Grid responsive patterns

### Secondary (MEDIUM confidence)
- https://www.ignek.com/blog/secure-token-storage-react-best-practices/ - Verified with multiple sources
- https://cybersierra.co/blog/secure-api-keys-react-2/ - API key security in React

### Tertiary (LOW confidence)
- Various tutorial sites for card grid implementations - verified against CSS spec

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing React codebase, standard patterns verified
- Architecture: HIGH - Session-only storage confirmed by multiple security sources
- Pitfalls: HIGH - Common mistakes well-documented

**Research date:** 2026-02-28
**Valid until:** 30 days (stable domain - React patterns well-established)
