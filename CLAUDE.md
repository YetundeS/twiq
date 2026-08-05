# twiq (frontend) — Claude Code Guidelines

> **twiq** is the Next.js web client for TWIQ, an AI coaching platform. Users chat with several
> AI coach assistants through a streaming ChatGPT-style interface, browse per-coach chat history,
> manage subscriptions (Stripe), and — if admin — grant/revoke beta access.
> This client is JavaScript-only (no TypeScript) and calls the `twiq-backend` REST API.
> **Read `README.md` before planning any feature.** This file governs **how** features are implemented.

These rules are **enforced**. `MUST` rules block merges; `SHOULD` rules are strongly recommended.
When a rule here conflicts with a generic default, this file wins.

The owner is **Muftaudeen Jimoh**. When something is unclear, ambiguous, or under-specified, ask him. Do not guess on architecture, data shape, or business logic.

> **Tier-split note.** Universal coding-style + the Q-shortcut review checklists live in `~/.claude/CLAUDE.md` and `~/.claude/commands/*.md` (slash commands: `/qnew`, `/qplan`, `/qcode`, `/qcheck`, `/qcheckf`, `/qcheckt`, `/qdoc`, `/qsec`, `/qgit`). This file extends that global layer with project-specific rules. On conflict, this file wins.

---

## 0 — Project North Star

- **What this app is.** A chat client for multiple AI coaches. Each coach is its own OpenAI Assistant (backend-owned); the frontend renders streaming responses, keeps a per-coach session list in the sidebar, and preserves chat context when a session is reopened.
- **Product pillars.** (1) Coach-per-slug isolation — sessions, prompts, and files never bleed across coaches. (2) Fast, uninterrupted chat streaming. (3) Clear subscription state — the user always knows their plan, quota, and what happens when they hit a limit. (4) Admin can manage beta access without SQL.
- **Operating philosophy.** The backend is authoritative for identity, quota, and coach logic. The frontend never invents users, coaches, plans, or quotas. Never bypass a backend guard by re-implementing it client-side.
- **Owner note.** A formal `docs/` spec tree does not yet exist. Until it does, `README.md` and `../twiq-backend/BETA_USER_SYSTEM.md` are the closest thing to authoritative product docs. Ask the owner when planning anything not covered.

---

## 1 — Tech Stack (authoritative)

| Layer | Tool | Notes |
|---|---|---|
| Runtime | Node ≥ 20 | Required by Next 15. |
| Language | **JavaScript** (ESM in app code, `.js`/`.jsx`) | No TypeScript today. Type hints via JSDoc where they help. Path alias `@/*` → `src/*` (`jsconfig.json`). |
| Framework | Next.js 15 (App Router) | `src/app/` routes, layouts, and API routes. |
| UI | React 19 | Server + Client components. Prefer server components unless the tree needs interactivity. |
| Styling | Tailwind CSS 4 + shadcn/ui | shadcn primitives live in `src/components/ui/`. `prettier-plugin-tailwindcss` sorts classes. |
| Component lib (legacy) | MUI (`@mui/material`) | Mixed with shadcn today. **Do not introduce MUI in new code** — extend shadcn/Radix. Migrating existing MUI usage is out of scope unless explicitly requested. |
| State | Zustand (`src/store/`) | One store per concern. Hydration via `@codebayu/use-hydration-zustand`. |
| Data fetching | SWR | Wrap network access through `src/apiCalls/` — do not call `axios`/`fetch` directly from components. |
| HTTP | Axios | Only from inside `src/apiCalls/`. |
| Auth / DB client | `@supabase/supabase-js` | Client-side session + JWT. Auth is Supabase; the backend accepts Supabase-issued JWTs. |
| Streaming | Server-Sent Events | Chat responses stream from the backend; the client reads via `fetch` + reader in `useAssistantChat`. |
| Animation | `framer-motion` / `motion` | Prefer `motion` for new work — `framer-motion` is kept for existing components. |
| Notifications | `sonner` | The only toast library. Do not add another. |
| Testing | Vitest + Testing Library | `*.spec.{js,jsx}` colocated with source. `jsdom` environment. |
| Formatting | Prettier + `prettier-plugin-tailwindcss` | `.prettierrc` at repo root. |
| Linting | `eslint-config-next` (flat config in `eslint.config.mjs`) | Rely on Next's rules; do not silence without a comment explaining why. |
| Package mgr | npm (there is a `package-lock.json`) | Do not introduce a second lockfile. |

---

## 2 — Folder Structure (authoritative)

```
twiq/
  src/
    app/                          # Next.js App Router — routes, layouts, api routes
      api/                        # Route handlers (server-only)
      auth/                       # Auth pages
      landing-page/               # Marketing pages
      platform/[slug]/            # Authed product surface (per-coach routes live under here)
      stripe/                     # Stripe redirect/checkout return pages
      layout.js                   # Root layout (theme, error boundary, global setup)
      globals.css                 # Global styles
    apiCalls/                     # ALL backend HTTP calls live here
      authAPI.js, adminAPI.js, chatMessage.js, chatSessions.js,
      sendChatMessage.js, subscribe.js
    components/
      ui/                         # shadcn/ui primitives — regenerate via shadcn CLI
      common/                     # Cross-cutting components (ErrorBoundary, etc.)
      adminComponents/            # Admin panel UI (beta user mgmt)
      appSideBar/                 # Sidebar (sessions grouped per coach)
      authComponents/             # Login / signup / verify UI
      dashboardComponent/         # Coach selector dashboard
      modelsComponent/            # Coach chat surface
      modelOverview/              # Coach detail / overview
      settingsComps/              # Account & subscription settings
      carouselComponents/         # Carousel-specific coach UI
      landingPageComponents/      # Marketing site pieces
      shapes/                     # Decorative SVG / shapes
    constants/                    # Static config (coach list, sidebar model, pricing, etc.)
    hooks/                        # Custom React hooks (chat, mobile, clipboard, TTS, upload, …)
    lib/                          # Cross-cutting utilities
      supabase.js                 # Browser Supabase client
      utils.js                    # `cn` classname helper (shadcn convention)
    store/                        # Zustand stores (auth, sidebar, models, dialogs, process)
    styles/                       # Global / component CSS
    utils/                        # Framework-agnostic helpers (error handling, image compression,
                                  # markdown→text, request dedup, pricing config)
  public/                         # Static assets
  scripts/                        # Repo scripts (bundle analyzer, etc.)
  CLAUDE.md                       # this file
  README.md
  next.config.mjs
  vitest.config.js
  eslint.config.mjs
  .prettierrc
  jsconfig.json                   # @/* path alias
```

- **O-1 (MUST)** All backend HTTP calls go through `src/apiCalls/`. Do not call `axios`/`fetch` from components or hooks directly.
- **O-2 (MUST)** All global state goes through `src/store/*`. Do not sprinkle module-level singletons in `src/utils/` or `src/lib/`.
- **O-3 (MUST)** shadcn primitives (`src/components/ui/*`) are generated — extend by composition (wrap in `src/components/…`), don't hand-edit generated files. If a primitive genuinely needs a code change, note it in the PR.
- **O-4 (MUST)** No new top-level directory inside `src/` without updating this table.
- **O-5 (SHOULD)** New feature-scoped components go under `src/components/<featureName>/`, not a flat drop into `src/components/`.

---

## 3 — Before Coding

- **BP-1 (MUST)** Read `README.md` first. If the feature touches beta users, admin flows, quotas, or Stripe state, also read `../twiq-backend/BETA_USER_SYSTEM.md` and the relevant backend controller/service.
- **BP-2 (MUST)** Ask clarifying questions when behavior isn't specified. Never silently improvise business logic (plan gating, quota display, coach behavior).
- **BP-3 (MUST)** If the feature needs a new backend endpoint or DB column, stop and coordinate with the backend before implementing on the frontend. Do not fake responses.
- **BP-4 (SHOULD)** If ≥ 2 approaches exist, list pros/cons (correctness, perf, cost, complexity, reversibility).
- **BP-5 (SHOULD)** Reuse before adding: check `src/components/`, `src/hooks/`, `src/utils/`, `src/apiCalls/` for existing pieces before creating new ones. Duplication here has been a recurring source of drift.

---

## 4 — State & Data Layer

- **D-1 (MUST)** Server state (chat messages, sessions, user profile) is fetched via SWR through `src/apiCalls/*`. UI/local state (open dialogs, sidebar toggle, dropdowns) lives in Zustand stores under `src/store/`. Do not put server-fetched data into Zustand.
- **D-2 (MUST)** One Zustand store per concern (existing pattern: `authStore`, `sidebarStore`, `useModelsStore`, dialog-scoped stores). Do not merge unrelated slices into one store.
- **D-3 (MUST)** Hydrate any Zustand store used by SSR-rendered UI with `@codebayu/use-hydration-zustand` — see existing usage — to avoid hydration mismatch flashes.
- **D-4 (MUST)** Every `apiCalls/*` function has: (a) explicit named export, (b) JSDoc `@param`/`@returns` for non-trivial shapes, (c) error surfaced through `src/utils/errorHandling.js` (never a bare `console.error` in prod paths). Use `src/utils/requestDeduplication.js` when the same call may be fired twice in quick succession.
- **D-5 (MUST)** Supabase browser client lives at `src/lib/supabase.js`. Do not construct additional Supabase clients elsewhere.
- **D-6 (MUST)** JWT / session tokens are read from Supabase's session and passed to the backend as `Authorization: Bearer <token>`. Never persist tokens outside Supabase's own storage.

---

## 5 — While Coding (JavaScript / Next.js 15)

- **C-1 (MUST)** Follow the app's domain vocabulary verbatim — `coach` (not "assistant" in UI copy, though the OpenAI term is "assistant"), `session`, `message`, `slug`, `plan`, `quota`, `beta user`, `admin`. Match backend field names exactly (`subscription_plan`, `beta_end_date`, `assistant_slug`) when passing data — do not rename in transit.
- **C-2 (MUST)** Prefer small, composable, pure functions. Do NOT extract a new function unless (a) reused, (b) the only way to unit-test, or (c) it untangles a genuinely opaque block.
- **C-3 (MUST)** Server components by default. Add `'use client'` only when the tree needs state, effects, refs, or browser APIs. Push the `'use client'` boundary as low in the tree as possible.
- **C-4 (MUST)** Never expose secrets to the client. Any env var read by client code MUST be prefixed `NEXT_PUBLIC_*`. If a value is not prefixed, it MUST NOT be read from a client component or referenced in code that ships to the browser bundle. Server-only work goes through a route handler in `src/app/api/` or a server component.
- **C-5 (MUST)** No `console.log` in shipped code paths. Use `src/utils/errorHandling.js` for errors. Console in tests / scripts is fine.
- **C-6 (MUST)** No `dangerouslyAllowSVG`-style loosening of security posture without owner sign-off. Existing usage in `next.config.mjs` is grandfathered and flagged — do not extend the pattern.
- **C-7 (SHOULD NOT)** Add new class-based components. Use function components + hooks.
- **C-8 (SHOULD NOT)** Introduce another animation, toast, or component library. Extend `motion`, `sonner`, `shadcn/ui`.
- **C-9 (SHOULD NOT)** Write "what" comments (`// increment counter`). Comment "why" only — a hidden constraint, a workaround for a specific bug, or an invariant that would surprise a reader.
- **C-10 (SHOULD)** JSDoc for non-obvious parameter shapes at module boundaries (`apiCalls/`, `hooks/`, `utils/`). Skip for local one-liners — names carry it.
- **C-11 (SHOULD)** Every list render has a stable, non-index `key` (usually a DB `id`). Index keys are only acceptable when the list is fully static.
- **C-12 (MUST)** Client-side quota checks are UX hints only. The backend enforces quota — never gate irreversible actions on the client's view of the number alone.

---

## 6 — AI / Chat Rules

The OpenAI API key is server-side only and lives in the backend. This client only consumes streaming responses.

- **AI-1 (MUST)** The frontend must never hold, read, or transmit the OpenAI API key. There is no `NEXT_PUBLIC_*` env var that should ever contain it.
- **AI-2 (MUST)** All coach chat goes through `src/apiCalls/sendChatMessage.js` → backend `POST /api/chat-message/send` (SSE). Do not add a direct OpenAI client to this repo.
- **AI-3 (MUST)** Streaming reader implementation stays in `src/hooks/useAssistantChat.js`. Other components consume that hook; they don't parse SSE frames themselves.
- **AI-4 (MUST)** Treat message content as untrusted for rendering — markdown is rendered via `react-markdown` with `rehype-raw` + `remark-gfm`; any change to that pipeline (adding a plugin, allowing new HTML tags) requires owner sign-off because it affects XSS surface.
- **AI-5 (MUST)** File uploads for chat go through the backend upload endpoint via `src/hooks/useFileUpload.js` and `src/utils/imageCompression.js`. Do not upload directly to OpenAI or Supabase Storage from the client.
- **AI-6 (SHOULD)** When adding a new coach surface, reuse `modelsComponent/` and register the coach in `src/constants/model.js` (or `sidebar.js`) rather than forking the chat UI.

---

## 7 — Security & Privacy

Threat model for this client: **stolen session tokens, XSS via user-generated or LLM-generated content, secrets accidentally shipped in the bundle, admin bypass**.

- **S-1 (MUST)** Secrets live in `.env.local` (dev) or the deployment env (prod). Never in the JS bundle, never in git. Only `NEXT_PUBLIC_*` vars are safe to read from client code.
- **S-2 (MUST)** New env var? Add it to `.env.example` (with a placeholder, never a real value) in the same commit.
- **S-3 (MUST)** Every backend call attaches the current Supabase JWT. If a route handler in `src/app/api/` proxies to the backend, forward the incoming user's token — do not use a service key from the frontend host.
- **S-4 (MUST)** Admin routes/UI (`src/app/platform/[slug]/admin`, `src/components/adminComponents/*`) MUST verify the user's admin status against the backend response, not against a client-only check. The client-side gate (e.g. `NEXT_PUBLIC_ADMIN_EMAILS`) is a UX hint; the backend is authoritative.
- **S-5 (MUST)** Never log full email addresses, JWTs, or full chat content to the console in production paths. Hash the local part of emails if logging is unavoidable.
- **S-6 (MUST)** Do not add `dangerouslySetInnerHTML` outside the vetted markdown renderer path. If you must, owner sign-off required.
- **S-7 (MUST)** Every third-party dependency added to `package.json` needs a one-line rationale in the PR description. Prefer no new dependency to a marginal one.
- **S-8 (SHOULD)** `npm audit --production` reviewed before shipping — no known criticals/highs.

---

## 8 — Testing

- **T-1 (MUST)** Colocate unit tests as `*.spec.{js,jsx}` next to source (existing pattern: `useCopyToClipboard.spec.js`, `useLongPress.spec.js`, `useTextToSpeech.spec.js`, `markdownToText.spec.js`). Vitest picks them up automatically.
- **T-2 (MUST)** Hooks tested with `@testing-library/react`'s `renderHook`. Components tested via `render` + user-event style queries. Do not reach into internal state.
- **T-3 (MUST)** Mock only at the true external boundary (network via `axios`/`fetch`, Supabase client, browser APIs). Do not mock your own module's internals.
- **T-4 (MUST)** Test descriptions and their final `expect` must line up exactly. "returns the compressed image" → the last assertion checks the returned compressed image.
- **T-5 (MUST)** Prefer strong assertions (`toEqual(x)`) over weak ones (`toBeTruthy`, `toBeGreaterThan(0)`).
- **T-6 (MUST)** Do NOT re-test what the framework or a well-typed API already guarantees.
- **T-7 (SHOULD)** Cover: happy path, realistic input, unexpected input, boundary. Skip trivial getter/setter tests.
- **T-8 (MUST)** Snapshot tests are banned unless the snapshot is ≤ 10 lines and asserts a specific invariant.
- **T-9 (SHOULD)** Property-based tests via `fast-check` for pure transformations (markdown→text, request dedup key derivation, pricing calc).
- **T-10 (SHOULD)** E2E is out of scope in this repo today. If added later, prefer Playwright and gate behind an `e2e` script; do not tangle it into `npm test`.

---

## 9 — Tooling Gates

Run locally before pushing.

- **G-1 (MUST)** `npx prettier --check .` passes. (The `.prettierrc` + tailwind plugin controls class ordering.)
- **G-2 (MUST)** `npm run lint` passes (Next.js flat ESLint config).
- **G-3 (MUST)** `npm test` passes (Vitest, non-watch).
- **G-4 (SHOULD)** `npm run build` succeeds locally for any change that touches routes, layouts, `next.config.mjs`, or dependencies.
- **G-5 (SHOULD)** For non-trivial UI, load the change in `npm run dev` and confirm the happy path in a browser before claiming done. Type-checkers and unit tests don't verify UX.
- **G-6 (SHOULD)** For bundle-affecting changes, `npm run bundle-report` and note any regression in the PR.

> **Gap flagged.** There is no TypeScript check because the project is JS. There is no CI pipeline scripted in this repo yet — treat the gates above as author-enforced until CI lands.

---

## 10 — Git

- **GH-1 (MUST)** Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `sec:` (security-related).
- **GH-2 (SHOULD NOT)** Refer to Claude / Anthropic / "AI" / generated-by tooling in commit messages or PR descriptions. Write commits as a human engineer would.
- **GH-3 (MUST)** A commit that touches auth, admin gating, Stripe UI flows, env, or the markdown/HTML render pipeline carries a `sec:` prefix and gets a second pair of eyes before merge.
- **GH-4 (MUST)** Never commit `.env`, `.env.local`, Supabase service keys, Stripe secret keys, or any value resembling a secret. Stage files individually — never `git add -A` blindly.
- **GH-5 (MUST)** New env vars added here must also be added to the deployment environment before the PR is marked ready. List the exact steps in the PR description.
- **GH-6 (MUST)** If a change here requires a coordinated backend change (new endpoint, new response field), reference the backend PR/commit in the description. Do not merge a frontend PR that assumes an unmerged backend change.

---

## 11 — Roadmap / Build Order

> **No formal phase plan exists yet.** Ship features against the current README + owner intent. When a roadmap doc appears, this section will point to it.

---

## 12 — Writing Functions Checklist

Moved to the `/qcheckf` slash command (`~/.claude/commands/qcheckf.md`). Invoke via `/qcheckf` after writing/editing a major function. The slash command applies the universal function-review checklist; this file's project-specific rules (`§5` domain vocab, `§4` state/data layer, `§7` security) layer on top.

Section number preserved so cross-references in this file remain stable.

---

## 13 — Writing Tests Checklist

Moved to the `/qcheckt` slash command (`~/.claude/commands/qcheckt.md`). Invoke via `/qcheckt` after writing/editing a major test. Combined with `§8` (colocated `*.spec.{js,jsx}`, no snapshots > 10 lines, `fast-check` for pure logic).

Section number preserved so cross-references in this file remain stable.

---

## 14 — Shortcuts

Invoke via slash commands in `~/.claude/commands/`:

| Command | Purpose | Project-specific layer |
|---|---|---|
| `/qnew` | Load CLAUDE.md + cited docs before starting | This file + `README.md`. For beta/admin/quota/Stripe features, also `../twiq-backend/BETA_USER_SYSTEM.md` and the relevant backend controller. |
| `/qplan` | Produce plan with file changes + tradeoffs | Honor `§3 BP-1` (read the README + relevant backend files), `§3 BP-3` (coordinate on any new backend contract). List which existing pieces in `apiCalls/`, `hooks/`, `store/`, `components/` are reused. |
| `/qcode` | Implement under TDD + run tooling gates | Gates per `§9` (prettier, lint, vitest). Colocate specs per `§8 T-1`. |
| `/qcheck` | Skeptical review of major changes | Combines `/qcheckf` + `/qcheckt` + `§5` While Coding + `§6` AI/Chat + `§7` Security. |
| `/qcheckf` | Function-only review | Per `§5` C-1 domain vocab, `§4` state/data layer boundary. |
| `/qcheckt` | Test-only review | Per `§8` — no snapshots, boundary mocks only, strong assertions. |
| `/qdoc` | Verify docs match code | Update `README.md` if new env var / new route / new coach registration flow. |
| `/qsec` | Security review with severity grading | Apply `§7` Security & Privacy — pay particular attention to secret leakage into the bundle, admin gating, and the markdown render pipeline. |
| `/qgit` | Commit + push | `sec:` prefix per `§10 GH-3` if touching auth/admin/Stripe/env/markdown-render. |

---

## 15 — Files You Must Keep In Mind

When any of these change, call it out explicitly in the PR description.

- `README.md` — the closest thing to a product spec today
- `../twiq-backend/BETA_USER_SYSTEM.md` — cross-repo contract for beta/admin flows
- `next.config.mjs` — image domains, CSP hints, bundle optimizations, dangerouslyAllowSVG posture
- `src/lib/supabase.js` — single source of truth for the browser Supabase client
- `src/apiCalls/*` — the entire backend contract surface as seen by this client
- `src/constants/model.js`, `src/constants/sidebar.js` — canonical coach registry
- `src/utils/pricingConfig.js` — subscription/plan display config (must mirror backend)
- `.env.example` — env template (no real values, ever)
- `CLAUDE.md` — this file

---

## 16 — When in doubt

Ask the owner. Do not guess on: which coach is available on which plan, how quota is calculated, what admin can/can't do, what a Stripe webhook does downstream, or how a new field on a backend response should render. The backend is authoritative for all of these — read its code or ask, do not invent.

> When formal `docs/` land (vision, architecture, data model, roadmap), this section will be updated to point there first.
