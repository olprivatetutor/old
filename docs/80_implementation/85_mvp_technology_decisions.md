# MVP Technology Decisions — Kaifa v2

| Version | Status | Owner | Depends On | Used By | Last Updated |
| --- | --- | --- | --- | --- | --- |
| 1.0 | Freeze | Product & Engineering Delivery | `84_mvp_execution_plan.md`, frozen Product / Engineering / Runtime / Engine / AI / UI/UX documentation, `99_architecture_decisions.md` | Frontend Engineering, Backend Engineering, Runtime / Engine Engineering, AI Engineering, QA, Release / Operations | 2026-07-14 |

## 1. Purpose

This document selects the minimum implementation technologies needed to execute the frozen Kaifa v2 MVP. It is subordinate to frozen architecture and contracts, creates no product or architecture requirement, and does not replace the API, database, Runtime, Engine, event, UI/UX, task, or execution-plan documents. It must be reviewed and frozen before Wave 1 repository bootstrap begins.

## 2. Decision Authority and Precedence

Precedence is:

1. Architecture decisions.
2. Product requirements and SRS.
3. API, database, Runtime, Engine, event, and AI contracts.
4. UI/UX contracts.
5. Frozen implementation task breakdowns.
6. Frozen MVP Execution Plan.
7. This technology decision document.
8. Implementation code and configuration.

A higher-level source always wins. A conflict stops affected implementation and follows formal change control; code cannot silently redefine a contract.

## 3. Technology Selection Principles

* Favor one simple implementation path and low refactor risk.
* Develop contract-first with strict types plus runtime validation.
* Default to secure sessions, least privilege, learner isolation, and secret redaction.
* Make local setup and fixtures deterministic and CI-reproducible.
* Keep provider integrations behind replaceable adapters.
* Support WCAG 2.1 AA implementation and automated/manual accessibility evidence.
* Establish correlation, trace, audit, and structured logging early.
* Prefer built-in or native workspace/framework capabilities over extra infrastructure.
* Add no speculative Phase 2/3 platform, microservice, broker, or orchestration work.

## 4. Repository Strategy

Use one GitHub repository as a workspace-based monorepo with separate web and API applications. The repository is currently documentation-only, so no compatible implementation constrains this choice.

`apps/web` owns browser UI/application state; `apps/api` owns the HTTP boundary, application modules, Runtime, Engine integration, persistence, and provider adapters. `packages/contracts` contains implementation schemas/types derived from frozen contracts; `packages/config` contains technical shared configuration; `packages/test-utils` contains deterministic test helpers. Shared packages must not contain learning business rules or permit frontend imports from backend domain/Runtime/Engine modules.

Target outline:

```text
apps/
  web/
  api/
packages/
  contracts/
  config/
  test-utils/
tests/
  integration/
  e2e/
docs/
.github/
```

This structure improves atomic contract changes and shared tooling but increases coupling risk; import-boundary rules and application-level ownership prevent boundary collapse. Separate repositories were rejected because they add versioning and coordinated-change overhead before MVP scale requires it.

## 5. Primary Language and Runtime

Select strict TypeScript for web, API, technical contracts, migrations, and tests; Node.js 24 LTS for backend and tooling; browser JavaScript runtime for the web application; ECMAScript modules throughout. Node.js production use follows an Active or Maintenance LTS line, with the chosen major pinned in repository/CI and patch/minor updates applied through reviewed lockfile changes. As of this decision date, Node.js 24 is LTS according to the official release schedule.

Enable `strict`, `noUncheckedIndexedAccess`, exact optional-property behavior, and separate type-check commands. Pin direct dependency ranges conservatively and commit one lockfile; automated updates require CI. TypeScript reduces cross-application contract drift and lets one team/toolchain cover frontend, backend, and QA. The trade-off is Node event-loop discipline for CPU-heavy work; deterministic Assessment Engine work must remain bounded and may use controlled worker execution only if measurement requires it. Java/Kotlin was credible for backend rigor but would create a second language/toolchain without frozen requirements that justify it.

## 6. Package Manager and Workspace Tooling

Use pnpm with native workspaces and one committed `pnpm-lock.yaml`. Pin the pnpm major through the root package-manager declaration/Corepack-compatible workflow. CI performs frozen-lockfile installs. Use root scripts plus `pnpm --filter` and recursive workspace commands for build, lint, typecheck, and tests; do not add Turborepo or Nx for MVP.

Native workspaces are sufficient for two applications and three small packages. The consequence is less sophisticated remote caching/task graphs, accepted in exchange for fewer tools and configuration layers. npm workspaces are credible but pnpm provides stricter dependency isolation and efficient workspace installs.

## 7. Frontend Technology

Select React 19, Vite, React Router, and a client-rendered SPA. Static hosting serves the built web assets; the API remains separate. Frozen UX does not require SSR/RSC, so CSR minimizes runtime coupling. Public landing metadata and basic initial HTML remain configured in the Vite entry; SEO/SSR expansion requires later evidence and change review.

* Routing: React Router route definitions and lazy route modules for UX-001 through UX-011; guards wait for server-authoritative Learner context.
* Server state: TanStack Query with query keys including active Learner context; clear/cancel all learner-scoped caches on logout, expiry, or mismatch.
* Client state: component state plus focused Context/reducer state machines for auth, navigation, activity, AI, voice, and assessment display; no global Redux store.
* Forms: React Hook Form with transport-compatible runtime schema validation; backend remains authoritative.
* Styling: CSS Modules and canonical CSS custom properties generated/maintained from Design System tokens; no utility framework requirement.
* Icons: no external icon library is required for Wave 1. Use frozen design assets and the minimum locally owned SVG functional icons explicitly required by frozen UI/UX contracts, wrapped by a small accessible internal component. Decorative icons use `aria-hidden`; meaningful icons receive an accessible name through surrounding text or explicit labeling. No icon package becomes a design source of truth. A later library requires change control, demonstrated frozen-component need, consistent stroke/size, and verified licensing.
* Localization: i18next/react-i18next for Indonesian support text and target-language UI resources; explicit `lang`/`dir` and CSS logical properties for Arabic/RTL; canonical transcript and optional transliteration remain distinct fields.
* Audio: secure-context MediaDevices/MediaRecorder for capture, standard HTML audio/Web Audio capabilities for playback as needed, permission/error detection, and text fallback. Feature-detect formats; never treat browser audio as assessment authority.
* Accessibility: semantic HTML, focus management, ARIA live regions, Testing Library role queries, Playwright plus axe, and required manual WCAG 2.1 AA checks.

React has strong component/test support and React’s official guidance recognizes Vite as a supported build path; the trade-off is explicit assembly of routing/data/form libraries. Next.js was rejected because SSR/full-stack conventions duplicate the separate API boundary and add server-rendering complexity not required by frozen UX.

Frontend code only invokes documented APIs and presents API-visible state. It never computes official scores, creates Activity Result/Assessment Result, publishes Official Runtime Events, infers Learning Decision, or owns server business state.

Static hosting must support history-routing fallback for documented SPA routes. Rewrites apply only to frontend application routes: `/api/*` is never rewritten to the SPA, and missing static assets return normal `404` responses. Cache immutable hashed assets separately from the HTML entry document so direct navigation and refresh work on documented learner routes. This is hosting behavior, not a new product route or API contract.

## 8. Backend Technology

Select Fastify 5 on Node.js as a modular monolith using the native Node HTTP server. Organize modules by frozen ownership: auth, public, learning domain, Runtime, Assessment Engine adapter/module, AI Practice/provider gateway, persistence, observability, and technical platform.

Use Fastify plugins/encapsulation for module composition, constructor/factory injection at module boundaries rather than a separate DI container, JSON Schema route validation/response serialization, one normalized error handler, and `/api/v1` route prefixes. Fastify request hooks establish correlation ID, trace ID, actor/session context, security headers, and audit metadata. Background work stays in-process and explicitly awaited or transactionally coordinated for MVP; no untracked fire-and-forget work.

Idempotency uses the frozen `idempotency_key` repository and transaction boundaries before side effects. OpenAPI is generated from reviewed technical route schemas and diffed against contract snapshots, but Markdown API contracts remain authoritative. Fastify supports schema validation, serialization, hooks, logging, and TypeScript with a small runtime footprint. The trade-off is less prescriptive structure than NestJS, mitigated by module templates and import-boundary tests. NestJS was rejected for MVP because its decorator/DI/module layer adds framework ceremony without requiring microservices.

No microservices, broker, streaming platform, service mesh, or Kubernetes is selected.

## 9. API Contract Implementation

`docs/60_engineering/62_api_spec.md` remains canonical. Implementation creates reviewed TypeBox/JSON Schema request, parameter, header, response, and error-envelope schemas under `packages/contracts`, with Fastify/Ajv runtime validation and response serialization. Generated TypeScript types and an OpenAPI artifact are implementation derivatives, not new business contracts.

The web client uses generated or schema-inferred types behind centralized API wrappers. Response schemas reject/strip undocumented output according to an explicit route policy; contract tests compare methods, paths, auth, status, envelopes, pagination, idempotency, correlation/trace fields, and schema snapshots. Mocks and fixtures are generated from or validated against the same technical schemas. Backend owns technical schemas and contract tests jointly with QA; frontend owns wrapper consumption tests.

Technical schema review must demonstrate equivalence to the conceptual frozen contract before use. Schema changes cannot create endpoints or fields without higher-source approval. The consequence is an implementation schema-maintenance step because the frozen API intentionally is not literal OpenAPI; this is preferable to hand-maintained duplicate DTO interfaces.

## 10. Database and Persistence

Select PostgreSQL, with its exact major tracked as an open decision blocking Wave 2 entry and the first migration implementation. The selected major must be currently supported, available consistently in local/CI/staging/production and the managed service, compatible with any frozen extension requirement, support backup/PITR, and avoid behavior divergence across environments. Use the `pg` driver, Kysely as the typed SQL/query layer, and Kysely Migrator with reviewed SQL-capable migrations. PostgreSQL is relational and transactional, supports constraints, UUIDs, timestamps, and limited JSONB metadata without forcing provider schemas into core tables.

The frozen database document exclusively owns entity, column, relationship, and structural-constraint meaning. Migrations are forward-only in production by default, with tested rollback only where safe; otherwise use a documented forward fix. Transactions encompass Runtime state, result, idempotency, and official-event side effects as required by frozen ordering. Use database-generated or application-generated UUIDs consistently with the frozen identifier format; store timestamps as UTC timezone-aware values and serialize ISO 8601.

Enforce Activity Result uniqueness, Assessment Result append-only/immutability, event/idempotency uniqueness, and learner foreign-key ownership through frozen constraints plus repository tests. JSONB is allowed only for fields already modeled as flexible metadata; frequently queried canonical data remains relational. Local/CI use disposable PostgreSQL containers and deterministic migrations/seeds; production uses a managed or operationally supported PostgreSQL service.

Kysely preserves SQL visibility and exact schema control; the consequence is more explicit repository/mapping code. Prisma was rejected because its generated schema/migration abstraction can create friction when matching a pre-frozen physical model and custom constraints exactly. SQLite was rejected because it would not faithfully exercise production PostgreSQL behavior.

## 11. Authentication and Session Implementation

Implement opaque server-side sessions backed by frozen `auth_session`; transport only a random session identifier in a Secure, HttpOnly, SameSite=Lax cookie. The API resolves active Learner context on every protected request. Hash credentials with Argon2id using reviewed current parameters and a unique salt; never store plaintext or reversible credentials.

Use HTTPS outside local development, narrow cookie path/domain, explicit expiration and rotation after login, server-side logout invalidation, and cache clearing in the web app. CSRF protection uses a high-entropy synchronizer token bound to the authenticated `auth_session`. The server supplies it as technical implementation metadata through the existing login/session bootstrap response path, subordinate to the frozen contract and without adding a product endpoint. The frontend holds it only in browser memory or another explicitly non-persistent location and sends it in a dedicated header on unsafe methods. The API validates the token, `Origin`, and configured allowed host/origin; logout and session rotation invalidate or rotate it. It is not business data or an Official Runtime Event field and is never exposed to cross-site origins. `GET`, `HEAD`, and `OPTIONS` remain non-mutating and require no CSRF token. CORS permits credentials only from configured web origins. Test sessions use deterministic learner fixtures but random session identifiers and the same resolver path.

This implements frozen login/logout/me only. It adds no signup, reset, OAuth, SSO, MFA, role, educator identity, or Enrollment. Server sessions align with the frozen `auth_session` entity and immediate logout; the trade-off is a database lookup/cache consideration per request. Stateless JWT was rejected because revocation/logout and authoritative session state would be more complex for this MVP.

## 12. Runtime, Engine, and Event Implementation Boundaries

Runtime orchestration lives in `apps/api/src/runtime`; Assessment Engine implementation lives in `apps/api/src/assessment-engine` behind an application interface; official publication lives in the Runtime/event module and validates the frozen ownership matrix. These are internal modules, not separate services. Runtime must not invoke the Assessment Engine directly. Runtime persists the appropriate Official Runtime Event under the frozen event model, and only that event's consumer/handler may call the internal Assessment Engine application interface. The interface is never a shortcut from Runtime orchestration.

Every engine-triggering operation reserves idempotency before side effects. Runtime transaction boundaries cover its state transition, non-evaluative Activity Result, and durable official-event persistence or transactionally consistent dispatch record as already supported by the frozen model. Consumer transaction boundaries cover Engine execution and immutable result/event writes according to frozen ordering. This does not create a public event, business entity, or broker architecture. Retry/replay of the consumer must not duplicate Assessment Result or Official Runtime Events. Repository interfaces prohibit frontend/shared-package writes. Assessment Result has one engine-owned writer and immutable repository API. Audit logs, system logs, traces, provider records, and `AssessmentFailed` observability records remain separate from official Runtime Events and cannot trigger business transitions.

The MVP uses in-process dispatch only as the transport after durable, transactionally consistent event persistence. It neither removes nor bypasses the event boundary. Event ownership, ordering, idempotency, and traceability remain governed by the frozen Runtime/Event contracts. No external message broker is required. The trade-off is single-process dispatch scale, acceptable for MVP and replay-tested through frozen tasks. MVP ends at `AssessmentResultGenerated`; Knowledge Profile and Learning Decision modules are not created.

## 13. AI, STT, and TTS Integration

Implement provider-independent ports plus adapters inside `apps/api/src/ai-provider-gateway`. Separate interfaces cover text generation, STT, and TTS; adapters normalize requests/responses into frozen Kaifa shapes. Configuration selects enabled adapters and capability order without exposing provider fields publicly. Unit/local tests use deterministic stubs; integration uses approved sandboxes.

Apply validated inputs/outputs, per-operation timeouts, bounded retry only for retry-safe failures, idempotency keys, provider fallback where configured, circuit-state metrics without business triggers, secret redaction, and safe learner fallback. Store canonical target-language transcript and only frozen audio references/metadata. Raw audio persistence is not selected by default; canonical transcript remains durable learner evidence where frozen, and text fallback remains required. Before Wave 9, the raw-audio lifecycle/privacy decision must define direct transit versus temporary storage, maximum retention, deletion ownership/evidence, provider retention, regional processing, encryption, privacy notice, test media, and evidence boundaries. Raw audio is excluded from ordinary logs/traces and AI Memory, and no provider-specific domain table may be created.

The architecture decision is concrete; provider vendors remain open because credentials, regional availability, Arabic/target-language quality, privacy terms, retention, pricing, and sandbox evidence are unavailable. AI text provider must be selected before Wave 8; STT/TTS providers before Wave 9. These do not block Wave 1 because deterministic adapters/stubs satisfy foundation initialization. Mandatory STT/TTS and required text fallback remain unchanged. AI owns no official score, result, event, path, or decision.

A single-vendor direct integration was rejected because it violates provider agnosticism. A broker-based asynchronous media pipeline was rejected as unnecessary infrastructure for documented request/response flows.

## 14. Validation and Schema Tooling

Use TypeBox schemas compiled/checked with Ajv for environment variables, API input/output, internal application commands at module boundaries, provider responses, STT/TTS responses, and fixture files. Environment parsing may convert strings only through explicit reviewed transforms and must fail startup on missing/invalid required values.

Only technical shapes, identifiers, envelopes, and shared enums from frozen contracts may be shared. Authorization, completion criteria, Runtime transitions, scoring, evidence eligibility, and all learning decisions remain backend/domain/Engine code. Provider payloads validate in adapters before normalization; raw provider schemas never enter shared public contracts. The consequence is schema discipline and explicit conversion code, preferred over unchecked type assertions.

## 15. Testing Technology

Use:

* Vitest for frontend and backend unit tests, deterministic Engine tests, schema tests, and coverage.
* React Testing Library plus user-event and jsdom for frontend component/state/accessibility semantics.
* Fastify `inject` for API/module integration without a network listener where appropriate.
* Disposable PostgreSQL databases/containers for migrations, repositories, constraints, transactions, and two-Learner isolation.
* Schema/OpenAPI snapshots plus request/response tests for contract verification.
* Playwright across Chromium, Firefox, and WebKit for browser E2E, responsive screenshots/traces, permissions, audio mocks, and release smoke.
* axe integration plus manual keyboard/screen-reader/WCAG 2.1 AA checks; automation is not claimed as complete accessibility proof.
* Deterministic AI/STT/TTS fake adapters and separate sandbox-tagged integration suites.
* V8 coverage with thresholds applied to risk-critical modules, not a misleading global percentage alone.

This maps frontend coverage to `FE-TASK-094` through `FE-TASK-100`, backend verification to `BE-TASK-094` through `BE-TASK-097`, and QA orchestration to `QA-TASK-001` through `QA-TASK-100`.

Corrected `QA-TASK-006` starts web/API processes under the harness and verifies base URL/configuration, shared envelope/error loadability, correlation/trace retention, and provider/STT/TTS stub initialization only. It requires no public landing, login, migrated data, feature API, Runtime, or Assessment Engine flow. The trade-off is multiple test layers and some duplicated setup; shared test utilities and tags keep ownership explicit. Jest/Cypress was credible, but Vitest shares Vite transforms and Playwright provides one cross-browser E2E/trace stack.

Before Wave 9, Frontend Engineering and QA must approve a browser/audio matrix covering current supported Chromium, Firefox, and WebKit/Safari versions; desktop/mobile scope; secure-context microphone access; `MediaRecorder` capability and MIME types; playback compatibility; unsupported-recording behavior; mandatory text fallback; accessibility; and Playwright/manual-device coverage. Implementations feature-detect capabilities and never assume one recording codec works everywhere.

## 16. Code Quality and Static Analysis

Use Prettier for formatting; ESLint flat config with typescript-eslint typed rules, React/React Hooks/accessibility plugins; `tsc --noEmit` for strict type checking; dependency-cruiser or ESLint restricted-import rules for application/package boundaries; and CI checks for unused exports/dependencies after bootstrap stabilization.

Use GitHub secret scanning where available, Gitleaks in CI for repository-independent scanning, pnpm audit plus an automated dependency update service, and container/image scanning before release. Pre-commit hooks run formatting/linting/type checks only on affected files; full unit, integration, database, and E2E suites run in CI, not as mandatory local commit hooks. Tool configuration adds maintenance and occasional false positives; reviewed suppressions must be narrow and documented.

## 17. Environment and Configuration

Implement exactly five categories from the Execution Plan:

| Environment | Implementation Approach |
| --- | --- |
| Local | Native Node web/API plus disposable PostgreSQL and deterministic provider stubs; synthetic data only. |
| Automated test | Isolated processes/database, fixed test configuration, stub adapters, fresh migrations/reset. |
| Integration | Deployed or coordinated web/API, non-production PostgreSQL, real sandbox or approved stubs, correlated traces. |
| Release candidate / staging | Production-like builds/config/secrets, migration rehearsal, approved provider sandbox, full evidence. |
| Production | Immutable builds, managed secrets, supported PostgreSQL, configured adapters, monitoring and GO-only release. |

Commit `.env.example` with names and safe descriptions only. Validate environment on startup. Categories include API origin/base URL, database URL, session/CSRF secrets, allowed origins, log/trace settings, and AI/STT/TTS adapter credentials/timeouts. Only explicitly public, non-secret values receive the frontend build prefix; secrets remain API-side. Test values are deterministic but never accepted in production. No secret is committed or logged. Raw-audio configuration must implement the approved Wave 9 transit/retention/deletion/privacy policy; test media is synthetic and isolated.

## 18. Local Development and Container Strategy

Run web and API natively with pinned Node/pnpm for fast feedback. Use Docker Compose only to coordinate PostgreSQL and optional provider stub services locally; allow an opt-in full-stack container profile for parity. Use isolated databases/schemas per test worker or suite and deterministic reset commands.

Add separate production-oriented multi-stage Dockerfiles for web artifact serving and API only when deployment work begins; do not create them in this documentation task. Expected commands later include locked install, dev, build, lint, typecheck, unit, foundation-smoke, integration, and E2E. This keeps local setup simple while testing the real database. A containers-only developer workflow was rejected because it slows frontend/backend iteration without improving MVP boundaries; Kubernetes is not required.

## 19. CI Strategy

Select GitHub Actions because the repository is hosted on GitHub and no CI exists. Do not create workflows in this task.

Fast pull-request checks: frozen-lockfile install, format check, lint, typecheck, unit/component/backend tests, technical contract snapshots, build, secret scan, dependency audit, and corrected foundation smoke. Database checks use a PostgreSQL service container for clean migrate/rollback/seed/repository tests.

Slower protected-branch or explicit integration checks: real-process integration, Playwright cross-browser critical slices, accessibility automation, two-Learner isolation, Runtime/Engine/event/idempotency suites, and provider sandbox tests when credentials are available. Release-candidate checks run full regression, migration rehearsal, container/image scan, staging smoke, and evidence publication.

Use concurrency cancellation for superseded PR runs, dependency caching keyed by lockfile, immutable action references, least-privilege workflow permissions, and retained reports/traces. GitHub documents PostgreSQL service containers; the trade-off is GitHub-specific workflow syntax, while commands remain portable local scripts.

## 20. Deployment and Hosting Direction

Deploy the web as immutable static assets through an HTTPS CDN/static host and the API as one long-running container/process for the modular monolith. Use separate staging and production projects/accounts/networks and a managed PostgreSQL service with backups, point-in-time recovery capability, TLS, and restricted connectivity.

The static host/CDN must provide history-routing fallback for documented frontend routes while excluding `/api/*` and missing static assets from SPA rewrites. Hashed immutable assets receive long-lived caching; the HTML entry document receives revalidation-appropriate caching. Direct navigation and refresh on documented learner routes must work. These are hosting rules, not new product routes or endpoints.

Run migrations as an explicit release job once per release before application promotion; Release/Operations owns execution with Backend approval. Use safe rollback only when migration/data semantics allow it, otherwise forward-fix. Inject provider/session/database secrets through the platform secret manager. Internal process/container readiness checks may exist at the hosting boundary but must not become or be documented as new public product API endpoints.

The concrete hosting vendor is open until before Wave 11 staging readiness and does not block Wave 1. Required capabilities are static HTTPS hosting, container/process API hosting, managed PostgreSQL, secrets, logs, rollback/redeploy, separate environments, and regional/privacy suitability. Serverless functions were rejected as the default because transaction-heavy Runtime flow, media/provider timeouts, and predictable process lifecycle fit a long-running API better; the selected container direction remains portable.

## 21. Observability and Security Tooling

Use Fastify/Pino structured JSON logs with serializers and redaction; OpenTelemetry API/SDK for vendor-neutral correlation/trace propagation and optional OTLP export; an error-reporting adapter; frozen audit/system/provider record repositories; and metrics for request, database, Runtime, Engine, provider, STT/TTS, retry, and fallback behavior.

Generate/validate correlation and trace IDs at ingress and propagate them through repositories, official-event envelopes where frozen, provider calls, and responses. Redact credentials, cookies, authorization data, prompts/transcripts/audio references unless explicitly approved, learner PII, and all raw-audio content. Apply TLS, secure headers, request/body limits, rate limits at auth/provider-sensitive boundaries, synchronizer-CSRF token and origin/CORS protections, and dependency/secret scanning. Raw audio must never enter normal logs or traces; any approved temporary storage follows the Wave 9 encryption, retention, deletion, and evidence policy.

Concrete telemetry/error vendor selection is open before Wave 10; local/CI use console/test exporters. Logs, traces, audit records, provider records, metrics, and `AssessmentFailed` remain non-official observability and cannot trigger business behavior. OpenTelemetry adds setup overhead but avoids early vendor lock-in; a proprietary SDK embedded across domain modules was rejected.

## 22. Selected Technology Stack Summary

| Decision ID | Area | Selected Technology / Approach | Status | Required By | Rationale |
| --- | --- | --- | --- | --- | --- |
| `TECH-DEC-001` | Repository strategy | One GitHub repository; pnpm workspace monorepo; separate web/API | Proposed | Wave 1 | Atomic contract/tooling changes without merging ownership |
| `TECH-DEC-002` | Primary language/runtime | Strict TypeScript, ESM, Node.js 24 LTS, browsers | Proposed | Wave 1 | One typed toolchain; Node LTS production support |
| `TECH-DEC-003` | Package manager/workspaces | pnpm native workspaces; committed frozen lockfile | Proposed | Wave 1 | Strict, efficient workspace installs without extra orchestrator |
| `TECH-DEC-004` | Frontend framework | React 19 + Vite + React Router, client SPA | Proposed | Wave 1 | Component/routing ecosystem with separate API and static build |
| `TECH-DEC-005` | Frontend state/data strategy | TanStack Query plus local Context/reducers | Proposed | Wave 2 | Server state remains authoritative; learner cache can clear safely |
| `TECH-DEC-006` | Styling/design tokens | CSS Modules + canonical CSS custom properties; frozen/local SVG icons with accessible wrapper | Proposed | Wave 1 | Implements frozen tokens and icons without an external icon-package design dependency |
| `TECH-DEC-007` | Backend framework | Fastify 5 modular monolith | Proposed | Wave 1 | Schema hooks, logging, TypeScript, low infrastructure overhead |
| `TECH-DEC-008` | API schema/validation strategy | TypeBox/JSON Schema + Ajv + derived OpenAPI/types | Proposed | Wave 1 | Runtime validation and one reviewed technical schema source |
| `TECH-DEC-009` | Database | PostgreSQL; exact major open before Wave 2 | Open — Blocking Before Wave 2 | Wave 2 | Database is selected; consistent supported major must precede migrations |
| `TECH-DEC-010` | ORM/query and migrations | Kysely + pg + Kysely Migrator/reviewed SQL | Proposed | Wave 2 | Exact frozen-schema control with typed queries |
| `TECH-DEC-011` | Authentication/session | Opaque server session, Secure/HttpOnly cookie, Argon2id, synchronizer CSRF token, Origin validation | Proposed | Wave 2 | Matches frozen auth_session with concrete cookie-request protection |
| `TECH-DEC-012` | Testing stack | Vitest, Testing Library, Fastify inject, PostgreSQL, Playwright, axe/manual | Proposed | Wave 1 | Covers foundation through cross-browser release evidence |
| `TECH-DEC-013` | Local development/container strategy | Native apps; Compose PostgreSQL/stubs; later Dockerfiles | Proposed | Wave 1 | Fast iteration with repeatable real database |
| `TECH-DEC-014` | CI | GitHub Actions; fast PR and gated integration/release workflows | Proposed | Wave 1 | Native repository integration and service containers |
| `TECH-DEC-015` | Deployment direction | Static SPA with history fallback + separate API routing; long-running API container; managed PostgreSQL | Open — Non-Blocking | Before Wave 11 | Portable direction with deep links and `/api/*` protected from SPA rewrites; vendor remains open |
| `TECH-DEC-016` | Observability | Pino JSON + OpenTelemetry + adapters | Proposed | Wave 1/Wave 10 | Early trace/log foundation without vendor lock-in |
| `TECH-DEC-017` | AI provider gateway | Provider-independent ports/adapters and deterministic stubs | Confirmed by Frozen Source | Wave 1/Wave 8 | AD-008 requires provider abstraction |
| `TECH-DEC-018` | STT provider/adapter | Provider-neutral STT adapter; vendor open | Open — Blocking Before Wave 9 | Wave 9 | Mandatory capability; quality/privacy evidence required |
| `TECH-DEC-019` | TTS provider/adapter | Provider-neutral TTS adapter; vendor open | Open — Blocking Before Wave 9 | Wave 9 | Mandatory capability; voice/language evidence required |
| `TECH-DEC-020` | Code quality/security tooling | Prettier, ESLint/typescript-eslint, boundaries, Gitleaks, audit/scanning | Proposed | Wave 1 | Fast local feedback plus enforceable CI safeguards |

Each proposed selection carries the consequences and trade-offs described in Sections 4-21; none is approved or frozen by this Draft.

## 23. Repository Target Structure

```text
# Wave 1
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.base.json
eslint.config.mjs
.prettierrc.json
.env.example
apps/
  web/
    src/app/
    src/components/
    src/styles/
  api/
    src/platform/
    src/modules/
packages/
  contracts/
  config/
  test-utils/
tests/
  integration/foundation/
docs/
.github/
  workflows/                 # created during Wave 1 CI task, not by this document

# Later waves, created only when their tasks start
apps/api/src/modules/auth/
apps/api/src/modules/learning/
apps/api/src/runtime/
apps/api/src/assessment-engine/
apps/api/src/ai-provider-gateway/
tests/integration/domain/
tests/e2e/
infra/                       # only approved portable deployment configuration

# Must not be created for MVP without approved change
apps/knowledge-profile-engine/
apps/recommendation-engine/
apps/placement-engine/
services/event-broker/
k8s/
```

The tree is a target, not an instruction to create files in this task. Wave timing follows `84_mvp_execution_plan.md` and the task breakdowns.

## 24. Wave 1 Technology Readiness Mapping

| Wave 1 Scope | Required Decisions | Required Configuration | Ready to Start Condition |
| --- | --- | --- | --- |
| `BE-TASK-001` through `BE-TASK-006` | Repository, TypeScript/Node, pnpm, Fastify, schemas, logging/trace, quality | Node/pnpm pins; API/test base config; redaction; correlation/trace; stub adapter config | Modular API bootstrap, envelope/error schemas, config validation, and Pino/OpenTelemetry foundation are specified |
| `FE-TASK-001` through `FE-TASK-006` | Repository, TypeScript, React/Vite/Router, API schema/client, testing | Web/API base URL; public-safe env; routing and error-client config | Web bootstrap, route structure, API wrapper, configuration, and normalized errors can initialize without feature routes |
| `FE-TASK-012` through `FE-TASK-017` | CSS Modules/tokens, component primitives, RTL/accessibility, testing | Frozen token source; fonts/assets; local SVG icon wrapper | Token, typography/layout, base components, fallback, focus, and responsive foundations have implementation conventions without an external icon library |
| `QA-TASK-001` through `QA-TASK-006` | pnpm scripts, Vitest, Fastify process/inject harness, Playwright process coordination, deterministic stubs | Test ports/base URL; trace IDs; safe test env; AI/STT/TTS stubs; no database required | Both processes start; harness/config/envelope/error/trace/stub boundaries pass deterministic foundation smoke only |

Public landing, authentication, migrated data, feature APIs, Runtime, and Assessment Engine are not Wave 1 readiness requirements.

Wave 1 has no external technology blocker: foundation bootstrap and route skeleton use frozen/local assets and documented session conventions. The exact PostgreSQL major is needed for Wave 2 migrations; real provider selection begins at Wave 8/9; browser-audio and raw-audio lifecycle decisions are needed for Wave 9.

## 25. Open Implementation Decisions

### Wave 1 Blockers

None. All technology choices needed to begin Wave 1 are proposed concretely and await document review/freeze rather than missing external information.

### Later-Wave and Non-Blocking Decisions

| Decision | Status | Owner | Needed Before | Options / Criteria | Blocking Impact |
| --- | --- | --- | --- | --- | --- |
| Exact PostgreSQL major version | Open — Blocking Before Wave 2 | Backend Engineering + Release / Operations | Wave 2 entry / first migration implementation | Currently supported stable major; identical local/CI/staging/production availability; managed-service and frozen-extension compatibility; backup/PITR; no environment behavior divergence | Blocks Wave 2 migrations; does not block Wave 1 foundation smoke |
| Concrete AI text provider/model | Open — Blocking Before Wave 8 | AI Engineering + Product/Security | Wave 8 contract gate | Approved providers meeting target-language quality, safety, privacy/retention, regional availability, latency, cost, sandbox, fallback, and gateway compatibility | Blocks Wave 8 real-provider integration; not Wave 1/stub work |
| Concrete STT provider | Open — Blocking Before Wave 9 | AI Engineering + Product/Security | Wave 9 entry | Arabic/target-language accuracy, timestamps/transcript metadata, privacy/retention, latency, cost, sandbox, adapter compatibility | Blocks Wave 9 STT integration; not earlier text/stub work |
| Concrete TTS provider/voice | Open — Blocking Before Wave 9 | AI Engineering + Product/Security | Wave 9 entry | Target-language voices, pronunciation quality, audio format/browser support, privacy, latency, cost, sandbox | Blocks Wave 9 TTS integration; not earlier text/stub work |
| Supported browser and audio-format matrix | Open — Blocking Before Wave 9 | Frontend Engineering + QA | Wave 9 entry | Current supported Chromium, Firefox, and WebKit/Safari; desktop/mobile; secure-context microphone; `MediaRecorder`/MIME support; playback; unsupported-recording and text fallback; accessibility; Playwright/manual devices | Blocks Wave 9 voice implementation/evidence; not Wave 1 |
| Raw-audio transit, temporary storage, retention, deletion, and privacy policy | Open — Blocking Before Wave 9 | AI Engineering + Product/Security/Privacy | Wave 9 entry | Direct stream vs temporary storage; maximum retention; deletion owner/evidence; provider retention and region; transit/at-rest encryption; privacy notice; synthetic sandbox media; evidence boundaries; no logs/traces, AI Memory, or provider-specific tables | Blocks Wave 9 real-audio processing; not text/stub work |
| Hosting and managed PostgreSQL vendor | Open — Non-Blocking | Release / Operations + Engineering | Before Wave 11 staging readiness | Static web, long-running API container, managed PostgreSQL/PITR, secrets, region/privacy, logs, rollback, cost | Non-blocking through implementation; blocks staging/release |
| Telemetry/error-reporting backend | Open — Blocking Before Wave 10 | Release / Operations + Security | Wave 10 entry | OTLP support, redaction/privacy, retention, alerts, cost, staging/production separation | Console/test exporters suffice earlier; blocks final observability integration |

## 26. Rejected Alternatives

| Area | Rejected Alternative | Reason Not Selected for MVP |
| --- | --- | --- |
| Repository | Separate web/API repositories | Contract/version coordination overhead without scale evidence |
| Workspace | Nx or Turborepo | Native pnpm commands cover the small workspace; extra cache/task layer is premature |
| Language | Java/Kotlin backend plus TypeScript web | Second toolchain and DTO generation path increase Wave 1 cost |
| Frontend | Next.js full-stack/SSR | Separate API and frozen UX do not require SSR/RSC complexity |
| Frontend state | Redux as default global store | Server state/query cache plus focused reducers cover frozen states with less indirection |
| Styling | Tailwind as required system | CSS Modules/custom properties map frozen semantic tokens without framework-specific source-of-truth duplication |
| Icons | Mandatory external icon package in Wave 1 | Frozen/local assets are sufficient; a package would add an unnecessary design dependency |
| Backend | NestJS | Decorator/DI ceremony exceeds modular-monolith MVP need |
| Architecture | Microservices/message broker/Kubernetes | No frozen requirement; increases operations and transactional complexity |
| Runtime/Engine | Direct Runtime-to-Engine invocation | AD-003 requires Assessment Engine execution through the Official Runtime Event consumer boundary |
| Persistence | Prisma | Less direct control over pre-frozen schema/custom SQL constraints and migrations |
| Database | SQLite for local/tests | Behavior would diverge from PostgreSQL constraints/transactions |
| Auth | Stateless JWT-only sessions | Revocation/logout and frozen auth_session authority become harder |
| E2E | Cypress plus separate browser tools | Playwright provides cross-browser projects, traces, permissions, and screenshots in one stack |
| AI integration | Direct single-provider SDK in domain modules | Violates provider gateway and replacement boundary |
| AI/audio | Persist all raw learner audio by default | No frozen requirement; adds privacy, retention, security, and cost exposure |
| Local development | Containers for every edit loop | Slower web/API iteration without architectural benefit |
| API hosting | Functions-only/serverless default | Runtime transactions and provider/media timeouts fit a stable process better |

## 27. Risks and Mitigations

| Risk | Impact | Mitigation | Related Decision |
| --- | --- | --- | --- |
| Monorepo coupling | Ownership erosion | Package exports, restricted imports, architecture tests | Repository strategy |
| Framework lock-in | Costly replacement | Keep domain/Runtime logic framework-independent behind ports | Frontend/backend frameworks |
| Contract drift | Incorrect client/API behavior | Reviewed schemas, generated types, snapshots, real contract tests | API schemas |
| ORM/schema drift | Frozen model violation | SQL-visible migrations, schema diff, repository/constraint tests | Kysely/PostgreSQL |
| Migration failure | Release/data risk | Clean migrate, rollback rehearsal, forward-fix plan, backups | PostgreSQL/migrations |
| Session weakness | Account or learner exposure | Opaque entropy, secure cookie, synchronizer CSRF/Origin checks, expiry, isolation tests | Authentication |
| Direct Runtime-to-Engine call | AD-003/event-boundary violation and duplicate results | Restricted imports, event-consumer interface tests, idempotent consumer/replay tests | Runtime/Engine boundary |
| CSRF implementation drift | Cross-site state mutation | Synchronizer-token/session binding tests, Origin/CORS tests, rotation/logout invalidation | Authentication/session decision |
| PostgreSQL-major drift | Migration or behavior mismatch | Select before Wave 2 and pin one major across every environment | Database open decision |
| Provider instability | AI/voice unavailable | Ports, bounded retry, stubs/sandbox, fallback, timeout | AI/STT/TTS adapters |
| Unsupported browser recording codec | Voice flow failure | Wave 9 browser/audio matrix, capability detection, multi-browser/manual evidence, text fallback | Browser/audio open decision |
| Raw-audio retention/privacy leakage | Learner privacy/security violation | Wave 9 lifecycle policy, minimum retention, verified deletion, encryption, logging exclusion | Raw-audio open decision |
| Test flakiness | Untrusted gates | Deterministic data/stubs, isolated DBs, traces, no blind retries | Testing stack |
| CI duration | Slow feedback | Fast PR tier, caching, sharding/tagged slower suites | GitHub Actions |
| Hosting portability | Vendor migration cost | Static artifacts, standard container, PostgreSQL, OTLP | Deployment/observability |
| SPA deep-link misconfiguration | Refresh failures or API interception | Route-rewrite tests exclude `/api/*` and assets; cache-policy verification | Deployment decision |
| Premature infrastructure | Delayed MVP | Explicit exclusions and change control | Repository/backend/deployment |

## 28. Architecture Compliance Checklist

| Check | Result |
| --- | --- |
| No new product capability is introduced. | PASS |
| No new entity, column, table, or relationship is introduced. | PASS |
| No new product API endpoint is introduced. | PASS |
| No new Official Runtime Event is introduced. | PASS |
| No new engine is introduced. | PASS |
| Runtime orchestration ownership is preserved. | PASS |
| Runtime ownership of non-evaluative Activity Result is preserved. | PASS |
| Assessment Engine sole ownership of immutable Assessment Result is preserved. | PASS |
| Assessment Engine is triggered only by the appropriate Official Runtime Event consumer. | PASS |
| Runtime cannot invoke Assessment Engine directly. | PASS |
| In-process dispatch is transport only and preserves the frozen event boundary. | PASS |
| Placement uses generic Learning Activity and Assessment flow. | PASS |
| AI remains experience-layer and non-authoritative. | PASS |
| Knowledge Profile and Learning Decision remain outside MVP. | PASS |
| Frontend cannot create official output, score, event, or decision. | PASS |
| Provider abstraction is implemented and direct provider coupling prohibited. | PASS |
| Mandatory STT/TTS and required text fallback are supported. | PASS |
| Server-authoritative Learner isolation is supported. | PASS |
| Deterministic migration and fixtures are supported. | PASS |
| Corrected foundation-only `QA-TASK-006` is supported without later-wave flows. | PASS |
| Synchronizer CSRF token and Origin validation are concretely selected. | PASS |
| Wave 1 requires no external icon-library decision. | PASS |
| Exact PostgreSQL major selection is tracked before Wave 2. | PASS |
| Browser/audio support matrix is tracked before Wave 9. | PASS |
| Raw-audio lifecycle/privacy is tracked before Wave 9. | PASS |
| SPA history fallback explicitly excludes `/api/*`. | PASS |

No unresolved choice prevents architecture-compliance review or Wave 1. PostgreSQL-major, provider, browser/audio, raw-audio, hosting, and telemetry choices are explicitly gated later-wave implementation decisions.

## 29. Decision Readiness Assessment

READY FOR MVP TECHNOLOGY FREEZE-CANDIDATE REVIEW

## 30. References

Repository sources used:

* `docs/00_foundation/01_architecture_principles.md`
* `docs/00_foundation/02_glossary.md`
* `docs/20_runtime/20_state_machine.md`
* `docs/20_runtime/21_event_model.md`
* `docs/30_engine/30_assessment_engine.md`
* `docs/40_ai/41_ai_provider_integration.md`
* `docs/40_ai/44_ai_governance.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/61_api_design_principles.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/64_engine_contracts.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/70_ui_ux/72_screen_inventory.md`
* `docs/70_ui_ux/73_component_spec.md`
* `docs/70_ui_ux/74_frontend_state_model.md`
* `docs/70_ui_ux/75_interaction_spec.md`
* `docs/70_ui_ux/76_design_system.md`
* `docs/70_ui_ux/77_frontend_implementation_plan.md`
* `docs/80_implementation/80_feature_breakdown.md`
* `docs/80_implementation/81_frontend_mvp_task_breakdown.md`
* `docs/80_implementation/82_backend_mvp_task_breakdown.md`
* `docs/80_implementation/83_mvp_integration_qa_task_breakdown.md`
* `docs/80_implementation/84_mvp_execution_plan.md`
* `docs/99_architecture_decisions.md`

Official technology documentation used for compatibility validation:

* [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
* [pnpm workspaces](https://pnpm.io/workspaces)
* [React build-tool guidance](https://react.dev/learn/build-a-react-app-from-scratch)
* [Fastify reference](https://fastify.dev/docs/latest/Reference/)
* [Fastify validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
* [React Router documentation](https://reactrouter.com/start/data/installation)
* [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
* [PostgreSQL current documentation](https://www.postgresql.org/docs/current/index.html)
* [Kysely documentation](https://kysely.dev/docs/intro)
* [Vitest guide](https://vitest.dev/guide/)
* [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
* [GitHub Actions service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services)
* [typescript-eslint getting started](https://typescript-eslint.io/getting-started/)
