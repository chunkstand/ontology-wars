# Stack Research

**Domain:** AI agent competitive ontology arena (browser‑hosted, no backend persistence)
**Researched:** 2026-02-28
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI framework for the arena, match views, and report cards | React is the stable default for complex SPA UI and component ecosystems. **Confidence: HIGH** (GitHub release). |
| TypeScript | 5.9.3 | Type safety for ontology schemas, agent protocols, and scoring logic | Reduces schema/shape bugs and enables strict contracts for ontology JSON. **Confidence: HIGH** (GitHub release). |
| Vite | 8.0.0-beta.16 | Front‑end dev server and production build | Fast HMR and simple static build for a browser‑only app. **Confidence: MEDIUM** (pre‑release in GitHub tags; use stable if avoiding beta). |
| Tailwind CSS | 4.2.1 | UI styling system | Rapid UI iteration and consistent design tokens without heavy component libraries. **Confidence: HIGH** (GitHub release). |
| TanStack Router | 1.163.5 | SPA routing for brackets, phases, and reports | Type‑safe routing fits multi‑view arena flows. **Confidence: HIGH** (GitHub release). |
| TanStack React Query | 5.90.21 | Async state for model calls, retries, and caching | Standardizes network state and enables explicit timeout/abort handling per phase. **Confidence: HIGH** (GitHub release). |
| Zustand | 5.0.11 | Local in‑memory state (session‑only vault) | Minimal, predictable state container that avoids persistence by default. **Confidence: HIGH** (GitHub release). |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.3.6 | Runtime validation for ontology JSON and match outputs | Use for validating agent outputs before scoring and webhook delivery. **Confidence: HIGH** (GitHub release). |
| Ajv | 8.18.0 | JSON Schema validation engine | Use when enforcing strict JSON Schema constraints (natural keys, structural integrity). **Confidence: HIGH** (GitHub release). |
| @tanstack/router-vite-plugin | 1.163.5 | Route generation & tooling | Use if you want file‑based routing and route‑type generation. **Confidence: HIGH** (GitHub release). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Static analysis for TypeScript/React | Enforce “no persistence” constraints (ban localStorage for API keys). |
| Prettier | Consistent formatting | Keep schema definitions and prompts readable and diff‑friendly. |

## Installation

```bash
# Core
npm install react react-dom
npm install -D typescript vite

# Supporting
npm install @tanstack/react-router @tanstack/router-vite-plugin @tanstack/react-query zustand zod ajv
npm install -D tailwindcss

# Dev dependencies
npm install -D eslint prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite (client‑only) | Next.js / Remix | Choose if you add a backend for key protection, webhook retries, or server‑side scoring. |
| TanStack Router | React Router | Choose if your team already standardizes on React Router or wants the data router API. |
| Zustand | Redux Toolkit | Choose if you require strict action logging or very large team conventions. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| SSR/full‑stack frameworks (Next.js App Router, Remix) | Violates “browser‑hosted only” v1 constraint and encourages server persistence | Vite + React SPA with client‑side calls |
| Persistent client storage for API keys (localStorage/IndexedDB) | Explicitly forbidden; keys must stay in React state only | In‑memory session state (Zustand) |
| Firebase/Supabase for v1 | Adds backend persistence and auth complexity that’s out‑of‑scope | Static hosting + webhook delivery only |

## Stack Patterns by Variant

**If you must avoid pre‑release tooling:**
- Use the latest stable Vite 7.x (verify current version before launch)
- Because Vite 8 is beta as of late Feb 2026

**If you add server‑side judging or key protection:**
- Use Next.js or Remix + serverless functions
- Because provider SDKs and secrets should move off the client

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react@19.2.4 | react-dom@19.2.4 | Keep React and React DOM on the same version line. |
| @tanstack/react-router@1.163.5 | @tanstack/router-vite-plugin@1.163.5 | Match major/minor versions for codegen tooling. |

## Sources

- https://github.com/facebook/react/releases — React 19.2.4 (HIGH)
- https://github.com/microsoft/TypeScript/releases — TypeScript 5.9.3 (HIGH)
- https://github.com/vitejs/vite/tags — Vite 8.0.0-beta.16 (MEDIUM; pre‑release)
- https://github.com/tailwindlabs/tailwindcss/releases — Tailwind CSS 4.2.1 (HIGH)
- https://github.com/TanStack/router/releases — TanStack Router 1.163.5 (HIGH)
- https://github.com/TanStack/query/releases — TanStack React Query 5.90.21 (HIGH)
- https://github.com/pmndrs/zustand/releases — Zustand 5.0.11 (HIGH)
- https://github.com/colinhacks/zod/releases — Zod 4.3.6 (HIGH)
- https://github.com/ajv-validator/ajv/releases — Ajv 8.18.0 (HIGH)

---
*Stack research for: AI agent competitive ontology arena*
*Researched: 2026-02-28*
