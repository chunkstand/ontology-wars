# Phase 1: Setup & Dataset Selection - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure datasets and four agents in a safe, session-only setup flow. This phase delivers the Title screen, Setup screen (wizard), and all dataset/agent configuration UI. Launch button transitions to Arena. No match execution in this phase.

</domain>

<decisions>
## Implementation Decisions

### Dataset Selection Display
- Card grid layout (2-3 columns)
- Card content: name, tier badge (icon + number), agency, short description
- Tier badge: Icon + number (star, shield, trophy)
- Selection: Click anywhere on card to select (single selection)

### Agent Slot Defaults & Editing
- Four house agents pre-filled: Ontomancer, AE_Sentinel, Graphwright, Dataminer (with icons and colors)
- Extra slots: "+" card that opens a modal with provider/model selection
- Click existing agent card → opens same modal to configure
- House agents show name, icon, and color only (no provider badge until configured)

### API Key Handling UX
- Password-style input with "Show" toggle
- Real-time validation on blur (check format, test connection on button click)
- Lock icon next to field + "Keys stored in session only" banner
- Inline error message + red border + "Save" disabled on validation failure

### Setup Flow & Launch Readiness
- Stepped wizard: Dataset → Agents → Review → Launch
- Sidebar with numbered steps for navigation
- Launch enabled when: Dataset selected + any 2+ agents configured (keys optional for house agents)
- Review step shows: Preview of tournament bracket with agent names

### Claude's Discretion
- Exact card grid column count (2 vs 3) based on responsive breakpoints
- Modal form fields and exact validation logic
- Step transition animations
- Color palette for house agents (user said icons + colors but not specific colors)

</decisions>

<specifics>
## Specific Ideas

- "Four house agents with names (Ontomancer, AE_Sentinel, Graphwright, Dataminer)"
- Icons + tier badges (star, shield, trophy) for dataset tiers
- Click-to-select dataset cards
- Session-only key storage is a hard requirement (no localStorage/sessionStorage)

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-setup-dataset-selection*
*Context gathered: 2026-02-28*
