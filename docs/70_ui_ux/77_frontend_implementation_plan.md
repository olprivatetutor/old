# Frontend Implementation Plan

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | -------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------ |
| 2.0 | Freeze | Frontend Engineering | `70_ui_ux/*`, `60_engineering/*`, `80_implementation/80_feature_breakdown.md`, `99_architecture_decisions.md` | Frontend implementation, QA, MVP delivery | 2026-07-05 |

## 1. Purpose

This document translates the frozen UI/UX specifications into an implementable frontend delivery plan for the Kaifa v2 MVP. It is intended to guide frontend engineering, QA planning, and MVP delivery sequencing.

This document does not redefine:

* product scope,
* business rules,
* API contracts,
* database schema,
* event contracts,
* engine behavior,
* AI behavior.

Frontend implementation MUST preserve the frozen architecture decisions, especially AD-002 Domain Owns Business Rules, AD-003 Runtime Is Event-Driven, AD-005 Canonical Learning Pipeline, AD-006 AI Does Not Make Learning Decisions, AD-009 AI as Experience Layer, and AD-010 Documentation as Single Source of Truth.

## 2. Implementation Principles

* Frontend renders state; it does not own learning state.
* Frontend consumes API responses as the source of truth.
* Frontend MUST NOT compute Learning Decision.
* Frontend MUST NOT directly call engines.
* Frontend MUST NOT bypass Runtime events.
* Frontend MUST NOT publish canonical learning events directly unless an API contract explicitly defines that behavior.
* Frontend MUST NOT produce Assessment Result, update Knowledge Profile, or generate adaptive recommendations.
* AI Conversation UI MUST degrade gracefully if AI is unavailable.
* AI Conversation UI MUST remain an experience layer and MUST NOT become assessment or learning-decision UI.
* All screens MUST support loading, empty, error, and fallback states as defined by the UI/UX docs.
* Design System components SHOULD be reused consistently across screens.
* Authenticated screens MUST validate and preserve active Learner context.
* Learner-scoped frontend state MUST be cleared on logout, session expiry, or Learner context mismatch.

## 3. MVP Frontend Scope

The MVP frontend scope is based on `70_ui_ux_spec.md`, `71_user_flow.md`, `72_screen_inventory.md`, `73_component_spec.md`, `74_frontend_state_model.md`, `75_interaction_spec.md`, and `76_design_system.md`.

Placement Test implementation is part of MVP. Canonical implementation order: Program Detail → Placement Test → Learning Activity.

| Scope Area | MVP Treatment | Notes |
| --- | --- | --- |
| Landing / Entry | In scope. | Public Landing Page and Login CTA. |
| Login / Authentication | In scope. | MVP Basic Learner Authentication only. No signup, reset, OAuth, SSO, MFA. |
| Program / Subject Selection | In scope. | Manual selection from Published Learning Programs; Subject Card is UI representation only. |
| Program Detail / Module List | In scope. | Published Program Structure, Modules, and Activities. No adaptive sequencing. |
| Placement Test | In scope. | UX-011 is a specialized Learning Activity with `purpose = Placement`; it reuses Activity Result, Assessment Result, and Assessment Engine and adds no domain resource. |
| Learning Activity Page | In scope. | Central MVP learning experience. |
| AI Conversation Practice | In scope, limited. | Available only for Learning Activity type `Practice`; practice guidance/feedback only. |
| Activity Completion / Assessment Result | In scope. | Activity completion calls API; Assessment Result is produced by Assessment Engine and displayed read-only. |
| Basic Progress Dashboard | In scope. | Basic progress only; no Knowledge Profile, Learning Decision, adaptive recommendation, or advanced analytics. |
| Error / Fallback States | In scope. | Cross-screen loading, empty, error, fallback, session expired, unauthorized, AI unavailable states. |

Out of Scope for MVP:

* educator/admin dashboards,
* authoring tools,
* marketplace,
* social/community features,
* notifications beyond MVP if not defined,
* advanced analytics dashboards,
* manual learning path editing by learner,
* AI-generated business decisions,
* Enrollment workflow,
* public signup,
* Knowledge Profile UI,
* Learning Decision UI,
* adaptive personalized learning path.

## 4. Suggested Frontend Project Structure

The structure below is framework-agnostic. If a frontend framework is later confirmed, the same boundaries SHOULD be preserved even if folder names change.

```text
src/
  app/
  pages/
  routes/
  components/
    layout/
    navigation/
    ui/
    learning/
    assessment/
    ai/
    feedback/
  features/
    auth/
    programs/
    modules/
    activities/
    assessment/
    progress/
    ai-conversation/
  services/
    api/
    auth/
  state/
  hooks/
  types/
  utils/
  styles/
  tests/
```

| Folder | Responsibility |
| --- | --- |
| `src/app/` | Application bootstrap, global providers, app shell wiring, global error boundaries if framework supports them. |
| `src/pages/` | Page-level screen implementations for UX-001 through UX-011 when the framework uses page files. |
| `src/routes/` | Route definitions, route guards, safe navigation mapping, route-level loaders if applicable. |
| `src/components/layout/` | Headers, shell layouts, page containers, responsive layout primitives. |
| `src/components/navigation/` | Public navigation, authenticated navigation, breadcrumbs, safe navigation controls, logout placement. |
| `src/components/ui/` | Reusable presentational primitives: buttons, inputs, cards, badges, banners, loading indicators. |
| `src/components/learning/` | Learning Program, Subject, Module, Activity, Learning Content, Learning Objective components. |
| `src/components/assessment/` | Read-only Assessment Result summary/list components. |
| `src/components/ai/` | AI Practice entry, conversation panel, message bubble, AI fallback banner. |
| `src/components/feedback/` | Empty states, error/fallback banners, async status announcements. |
| `src/features/auth/` | Login, auth session UI integration, active Learner context consumption. |
| `src/features/programs/` | Program list, program detail, subject representation logic. |
| `src/features/modules/` | Module list and module selection UI behavior. |
| `src/features/activities/` | Activity page, content display, completion interaction. |
| `src/features/assessment/` | Read-only Assessment Result display flow. |
| `src/features/progress/` | Basic Progress Dashboard display. |
| `src/features/ai-conversation/` | AI Conversation Practice UI flow and transient conversation state. |
| `src/services/api/` | API client wrappers, request/response typing, error normalization. |
| `src/services/auth/` | Auth API wrappers and session validation helpers. |
| `src/state/` | Frontend presentation/application state as defined in `74_frontend_state_model.md`. |
| `src/hooks/` | Reusable view hooks for API state, focus, route guards, safe retry, responsive behavior. |
| `src/types/` | Frontend types aligned to API contracts and UI state models. |
| `src/utils/` | Pure UI utilities: formatting, safe error mapping, route helpers. No business rules. |
| `src/styles/` | Design tokens, global styles, theme variables, responsive utilities. |
| `src/tests/` | Unit, component, integration, accessibility, and flow tests. |

## 5. Screen Implementation Order

| Step | Goal | Inputs from Docs | Main Components | API Dependencies | Completion Criteria |
| --- | --- | --- | --- | --- | --- |
| 1. App shell and routing foundation | Establish route structure, public/authenticated layout, and safe navigation. | `71_user_flow.md`, `72_screen_inventory.md`, `74_frontend_state_model.md`, `75_interaction_spec.md` | CMP-001, CMP-002, CMP-023, CMP-025 | `GET /api/v1/auth/me` for guarded routes | Routes or renderable screen states for UX-001 to UX-011 are defined; UX-010 fallback/error states are implemented as reusable states and dedicated routes only where needed; authenticated route guard prevents stale private render. |
| 2. Design system tokens and base components | Implement reusable visual primitives. | `76_design_system.md`, `73_component_spec.md` | CMP-020, CMP-021, CMP-022 plus base buttons/inputs/cards | None directly | Tokens, typography, spacing, focus, loading, empty, error primitives available. |
| 3. Authentication screens | Implement Login and session validation. | UX-002, INT-003, FSM-001, FSM-002 | CMP-003, CMP-024 | `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout` | Login works for at least two Learner accounts; logout clears state; no signup/reset/social auth UI. |
| 4. Program / subject selection | Implement Learner Home and Program Selection entry points. | UX-003, UX-004, CMP-005, CMP-006 | CMP-005, CMP-006, CMP-017 | `GET /api/v1/learning-programs` | Published programs render; manual selection only; empty/error states implemented. |
| 5. Program detail / module list | Implement Program Detail, Program Structure, Module List, Activity Cards. | UX-005, INT-009, FSM-006 to FSM-008 | CMP-007, CMP-008 | `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-programs/{programId}/program-structure`, `GET /api/v1/learning-modules`, `GET /api/v1/learning-activities` | Program detail renders; module/activity empty/error states work; no adaptive sequencing. |
| 6. Placement Test | Implement UX-011 after Program Detail and before the general Learning Activity page. | UX-011, FSM-021, INT-028 | CMP-029, CMP-028 | Learning Activity completion and Assessment Result APIs | Placement Test works as `purpose = Placement`; pending/ready/retry verified; no new resource. |
| 7. Learning activity page | Implement selected Activity, Objective, Content, and AI Practice entry guard. | UX-006, CMP-009 to CMP-011, FSM-009 to FSM-013 | CMP-009, CMP-010, CMP-011, CMP-015 | `GET /api/v1/learning-activities/{activityId}`, `GET /api/v1/learning-contents` | Activity page renders objective/content; AI entry hidden for non-Practice; completion action present. |
| 8. Activity completion / assessment result | Implement completion submit and read-only Assessment Result display. | UX-008, INT-013, INT-018, FSM-012, FSM-015 | CMP-015, CMP-016 | `POST /api/v1/learning-activities/{activityId}/complete`, `GET /api/v1/assessment-results/{resultId}`, `GET /api/v1/assessment-results` | Duplicate submit prevented; Activity Result comes from backend/API behavior; Assessment Result read-only. |
| 9. Basic progress dashboard | Implement basic progress display and read-only lists. | UX-009, CMP-017 to CMP-019, FSM-016 | CMP-017, CMP-018, CMP-019 | `GET /api/v1/auth/me`, `GET /api/v1/assessment-results` | Basic progress displays; no Knowledge Profile, Learning Decision, adaptive recommendation, or advanced analytics. |
| 10. AI conversation practice | Implement assessable Practice-only AI conversation with mandatory STT/TTS capability and text fallback. | UX-007, INT-014 to INT-017, FSM-013, FSM-014 | CMP-011, CMP-012, CMP-013, CMP-014 | AI Conversation endpoints from `62_api_spec.md` / UI docs | AI Practice starts for Practice only; messages labeled practice; provider unavailable fallback works. |
| 11. Error / fallback states | Wire cross-screen safe error, empty, retry, unauthorized, session expired states. | UX-010, FSM-017 to FSM-019, INT-020 to INT-024 | CMP-020, CMP-021, CMP-022, CMP-023 | All affected screen APIs | No internal details shown; safe destinations work; unauthorized is not shown as empty. |
| 12. Cross-screen QA and accessibility pass | Verify MVP flows, responsive behavior, and accessibility baseline. | `75_interaction_spec.md`, `76_design_system.md` | All CMP-001 to CMP-029 | API mocks and integrated environment | Critical flows pass; keyboard/focus/contrast/error states verified. |

## 6. Component Implementation Plan

| Component Group | Component Examples | Responsibility | Reuse Rules | State Considerations |
| --- | --- | --- | --- | --- |
| Layout components | CMP-001 Public Header, CMP-002 Authenticated Header, page containers | Provide consistent shell, responsive layout, and active Learner context placement. | MUST be reused for UX-001 to UX-009 layouts. | Must not show Learner identity on public screens; clear on logout/session expiry. |
| Navigation components | CMP-023 Safe Navigation Control, CMP-024 Logout Control, CMP-025 Breadcrumb / Back Navigation | Provide safe route transitions and logout. | SHOULD centralize safe destination mapping. | Must not route to unauthorized resources or use Learning Decision. |
| Form components | CMP-003 Login Form | Capture MVP login credentials and safe validation. | MUST NOT include signup/reset/social auth controls. | Duplicate submit disabled; safe auth errors only. |
| Learning components | CMP-004 to CMP-010, CMP-015 | Display programs, subjects, modules, activities, content, objectives, and completion. | SHOULD use shared card/list/content primitives. | Program/activity switches reset downstream state; no adaptive sequencing. |
| Assessment components | CMP-016, CMP-019 | Display Assessment Result read-only. | MUST use read-only visual treatment. | Result state comes from API; UI does not edit, rescore, or create result. |
| AI conversation components | CMP-011 to CMP-014 | Provide Practice-only AI conversation and fallback UI. | MUST share AI Practice labels and fallback pattern. | Hidden for non-Practice; conversation state separate from Assessment Result. |
| Feedback and status components | CMP-020, CMP-021, CMP-022 | Present loading, empty, error, warning, pending, success, and fallback states. | MUST be reused across screens for consistent recovery. | Must not leak internal details or stale private data. |
| Error and fallback components | CMP-022, CMP-023, CMP-014 | Handle unauthorized, session expired, AI unavailable, assessment failed, network/server errors. | MUST support safe recovery actions. | Blocking errors cannot be dismissed without safe navigation. |

## 7. Frontend State Implementation Plan

Frontend state MUST follow `74_frontend_state_model.md` and remain presentation/application state only.

| State Category | Implementation Guidance | Boundary Rule |
| --- | --- | --- |
| Route state | Track current route, params, previous safe route, and safe destination. | Must not use Learning Decision to suggest next step. |
| Session/auth state | Represent unknown, unauthenticated, authenticating, authenticated, expired, logoutPending. | Backend auth/session API is source of truth. |
| Server state | Store API-derived display data for programs, modules, activities, content, results, progress, AI conversation records. | Server state must come from APIs and be revalidated when sensitive. |
| UI state | Track loading, empty, error, fallback, disabled, banner, panel/modal states. | UI state must not encode business rules. |
| Form state | Track login inputs, validation, submit pending state, and safe errors. | Password must not be persisted beyond submit handling. |
| Optimistic state if applicable | Avoid optimistic updates for completion/result flows unless API contract defines idempotency and response semantics. | Do not invent Activity Result, Assessment Result, progress, or learning_state locally. |
| Transient AI conversation UI state | Track draft message, sending state, provider unavailable, governance blocked, active/completed conversation display. | AI state is practice-only and must not merge with Assessment Result state. |

Additional rules:

* Learning progress state MUST NOT be invented locally.
* Frontend MAY cache display state but MUST revalidate against backend when auth, learner context, route params, or sensitive resources change.
* Frontend MUST handle stale or failed state safely.
* Learner-scoped state MUST be keyed by active Learner context and cleared on logout/session expiry/context mismatch.

## 8. API Integration Plan

The API integration layer should follow `62_api_spec.md` and `61_api_design_principles.md`. Endpoint names below use the approved UI/UX/API documentation where available. If implementation discovers naming mismatch, align with `62_api_spec.md` rather than changing UI behavior.

| Frontend Area | API Dependency | Purpose | Failure Handling |
| ------------- | -------------- | ------- | ---------------- |
| Public landing page | `GET /api/v1/public/landing-page`, `GET /api/v1/public/program-highlights` | Display public product information and Published program highlights before login. | Static fallback content if unavailable; no Learner data; no authenticated program detail access. |
| Authentication | `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout` | Login, active Learner context, logout. | Safe auth error; clear Learner-scoped state on expired/invalid context. |
| Program list | `GET /api/v1/learning-programs` | Learner Home and Program Selection. | No program empty state; retry; session validation if auth-sensitive. |
| Subject/program detail | `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-programs/{programId}/program-structure` | Program Detail and Program Structure. | Not found/unauthorized fallback; do not treat unauthorized as empty. |
| Module list | `GET /api/v1/learning-modules` | Display Published Learning Modules. | No module empty state; retry/back to Program Selection. |
| Placement Test | Learning Activity completion and Assessment Result APIs. | Implement UX-011 as `purpose = Placement`. | Pending/ready/retry; no new Placement Test resource. |
| Activity submission | `GET /api/v1/learning-activities`, `GET /api/v1/learning-activities/{activityId}`, `POST /api/v1/learning-activities/{activityId}/complete` | Activity lists, selected activity, explicit completion. | Prevent duplicate submit; safe retry only if idempotent/allowed. |
| Assessment result | `GET /api/v1/assessment-results/{resultId}`, `GET /api/v1/assessment-results` | Read-only Assessment Result display and dashboard lists. | Pending/failed/not found safe states; no UI-created result. |
| Progress dashboard | `GET /api/v1/auth/me`, `GET /api/v1/assessment-results`; additional progress endpoint requires alignment with API Spec if needed. | Basic progress display. | Empty/error states; no Knowledge Profile/Learning Decision/adaptive recommendation. |
| AI conversation | `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`, `GET /api/v1/ai-conversations/{conversationId}`, `POST /api/v1/ai-conversations/{conversationId}/messages`, `POST /api/v1/ai-conversations/{conversationId}/complete` | Practice-only AI Conversation UI. | Provider unavailable/governance blocked fallback; continue activity without AI. |
| Runtime/event status if applicable | Requires alignment with API Spec. | Display resulting state if exposed by backend API. | Frontend must not create canonical learning events directly. |

## 9. Event and Runtime Alignment

Frontend interaction with the event-driven Runtime MUST follow `65_event_contracts.md` and AD-003 Runtime Is Event-Driven.

* Frontend triggers user actions through API calls.
* Backend/API/Runtime emits, records, or processes canonical events according to server-side contracts.
* Frontend displays resulting state returned by APIs.
* Frontend MUST NOT create canonical learning events directly unless an API explicitly defines that UI-triggered request and server-side behavior.
* Frontend MUST avoid duplicate submissions for login, completion, AI messages, and retryable actions.
* Frontend SHOULD support idempotent retry where the API contract supports it.
* If a request may create Activity Result or other side effects, retry MUST be explicit and guarded.
* Frontend MUST NOT call Runtime, Engine, Recommendation Engine, or AI Layer directly outside documented APIs.

## 10. AI Conversation Implementation Plan

Normal Practice: End Session → Learning Activity. Assessable Practice: Complete Conversation → submit Activity Result → Assessment Engine → Assessment Result → UX-008.


AI Conversation Practice follows AD-006 AI Does Not Make Learning Decisions and AD-009 AI as Experience Layer.

Clarifications:

* AI Conversation is an experience layer.
* AI does not determine learning path.
* AI uses approved Learning Objective and Published Learning Content context where available.
* AI failure MUST NOT block core Learning Activity completion unless an existing API contract explicitly requires blocking behavior.
* UI MUST show fallback messaging when AI is unavailable.
* Conversation content SHOULD respect safety, privacy, and governance constraints.

| Area | Implementation Guidance |
| --- | --- |
| UI states | Hidden for non-Practice; available, starting, active, loadingHistory, sendingMessage, governanceBlocked, providerUnavailable, completed, failed for Practice. |
| Input handling | Disable send when message is empty, sending, session closed, provider unavailable, or context invalid. |
| Streaming vs non-streaming behavior | If streaming is not defined in API Spec, implement non-streaming request/response. Streaming support is an Open Issue unless explicitly documented. |
| Error handling | Show safe error, governance blocked state, or provider unavailable fallback. Do not expose provider internals. |
| Session reset / continuation | Normal Practice End Session returns to Learning Activity without completion; Assessable Practice Complete Conversation submits Activity Result and proceeds through Assessment Engine to UX-008. Continuation rules beyond existing conversation APIs require API Spec alignment. |
| Boundaries | AI output is practice guidance/feedback only. It MUST NOT appear as score, Assessment Result, mastery, Learning Decision, or official recommendation. |
| Prohibited behavior | AI UI MUST NOT create Assessment Result, update Knowledge Profile, generate Learning Decision, publish Official Runtime Event, or replace Activity completion. |

## 11. Accessibility and Responsive Implementation

Frontend MUST implement the accessibility and responsive guidance from `76_design_system.md` and `75_interaction_spec.md`.

* Keyboard navigation: all interactive elements reachable via keyboard; Enter/Space activation where appropriate.
* Semantic headings: one H1 per page and logical H2/H3 structure.
* Form labels: visible labels for login fields; no placeholder-only labels.
* Focus states: visible focus ring; focus first invalid field after validation; restore focus after AI modal/panel close if used.
* Readable contrast: follow WCAG 2.1 AA for text and meaningful UI controls.
* Mobile-first layout: primary actions, Logout, and safe navigation remain reachable.
* Responsive breakpoints: final values are an Open Issue if not defined by implementation framework/design token setup.
* Loading and error announcements: blocking loading, async errors, AI unavailable, session expired, and assessment pending/failed should use `aria-live` or equivalent.
* Non-color-only status indicators: pair status colors with text/icons.
* Disabled states: visually and programmatically disabled.

## 12. Testing Plan

| Test Type | Scope | Examples |
| --- | --- | --- |
| Unit tests | Pure UI utilities, safe error mapping, route helpers, state reducers/selectors if used. | Auth state transitions, safe destination resolution, AI availability guard. |
| Component tests | CMP-001 to CMP-025 behavior and visual states. | Login disabled state, AI entry hidden for non-Practice, Assessment Result read-only. |
| Integration tests | Screen flows with mocked APIs. | Login to Learner Home, Program Selection to Activity Page, completion to result. |
| API contract mocks | Mock documented API responses and failure cases. | 401, 403, 404, 5xx, empty lists, AI unavailable, assessment pending. |
| Accessibility checks | Keyboard, focus, labels, contrast, announcements. | Login form focus error, AI modal focus trap, error `aria-live`. |
| Responsive layout checks | Mobile/tablet/desktop screen layouts. | Activity completion reachable on mobile, Logout accessible, dashboard lists readable. |
| Error/fallback state checks | UX-010 and inline fallback coverage. | Session expired, unauthorized, network error, AI unavailable, assessment failed. |
| Critical user flow tests | End-to-end MVP flows. | See below. |

Critical user flows:

* login -> select program -> select subject/program representation -> learning activity -> assessment result -> progress dashboard.
* learning activity -> AI conversation practice -> return to activity.
* failed API response -> fallback state -> retry.
* expired session -> login recovery.

Placement Test is an MVP UI flow only through UX-011, driven by Learning Activity metadata; it must not add a `/placement-tests` resource, adaptive recommendation, or Recommendation Engine invocation.

## 13. MVP Delivery Milestones

| Milestone | Scope | Dependencies | Exit Criteria |
| --- | --- | --- | --- |
| M1: Frontend foundation and design system | App shell, routing, design tokens, base UI primitives, loading/empty/error primitives. | `72_screen_inventory.md`, `76_design_system.md` | Routes scaffolded; Public Landing Page renders product information and program highlights with safe static fallback; no Learner data is fetched or displayed on public screens; design tokens and base components tested. |
| M2: Auth and program discovery | Login, auth/me validation, logout, Learner Home, Program Selection. | Auth and program APIs. | Two learner accounts work; state clears on logout; programs display with empty/error states. |
| M3: Learning flow screens | Program Detail, Module List, Activity Cards, Learning Activity Page, content/objective display. | Program/module/activity/content APIs. | Activity page usable; AI entry hidden for non-Practice; no adaptive sequencing. |
| M4: Assessment and progress flow | Completion submit, read-only Assessment Result, Basic Progress Dashboard. | Completion and assessment result APIs. | Duplicate submit guarded; result read-only; dashboard basic progress only. |
| M5: AI conversation experience | Practice-only AI Conversation, message send, end session, fallback states. | AI Conversation APIs and governance responses. | AI fallback does not block completion; AI output never appears official. |
| M6: QA, accessibility, and MVP hardening | Full regression, accessibility pass, responsive pass, error/fallback coverage. | Integrated API mocks/environment. | Critical flows pass; no architecture boundary violations; MVP ready for delivery review. |

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| API contract ambiguity | Frontend may implement incorrect endpoint assumptions. | Keep unclear endpoints marked “Requires alignment with API Spec”; do not invent contracts. |
| Over-implementing business logic in frontend | Violates AD-002 and may create inconsistent learning state. | Restrict frontend to API-derived display state; review completion/result/progress logic carefully. |
| Inconsistent component usage | Fragmented UX and duplicated state behavior. | Build shared CMP-based primitives before screen-specific work. |
| Incomplete fallback states | Learner may be blocked or see unsafe errors. | Implement UX-010 and fallback components early; test each API failure class. |
| AI unavailability | Practice support may fail or block activity if mishandled. | AI fallback MUST allow continuing the Learning Activity without AI. |
| Stale progress state | Learner may see old or wrong data. | Revalidate active Learner context; refetch dashboard/result state after completion and on route entry. |
| Accessibility gaps | MVP may be unusable for keyboard/screen-reader users. | Include accessibility checks in every milestone and final QA pass. |
| Duplicate submissions | May create duplicate side effects. | Disable/pending states and safe retry guards for login, completion, AI messages. |
| Learner data leakage | Severe privacy and isolation issue. | Clear Learner-scoped state on logout/session expiry/context mismatch; test Learner A/B isolation. |
| Placement Test boundary | UI may imply adaptive recommendation. | Implement UX-011 only as specialized Learning Activity metadata; use Assessment Engine result and read-only starting point suggestion. |

## 15. Implementation Readiness Checklist

* [ ] Routes or renderable screen states are defined for UX-001 through UX-011, with UX-010 implemented as reusable fallback/error states and dedicated fallback routes only where needed.
* [ ] UX-011 placement UI route is driven by Learning Activity metadata; no `/placement-tests` resource route.
* [ ] Components mapped to CMP-001 through CMP-029.
* [ ] API dependencies mapped and unresolved endpoints marked for alignment.
* [ ] Frontend state boundaries clear and aligned with FSM-001 through FSM-021.
* [ ] All MVP screens implemented.
* [ ] Loading, empty, error, and fallback states implemented.
* [ ] Design system tokens and base components reused consistently.
* [ ] Accessibility baseline passed.
* [ ] Critical flows tested.
* [ ] AI fallback tested.
* [ ] Learner A/B data isolation tested.
* [ ] Assessment Result is read-only.
* [ ] Dashboard excludes Knowledge Profile, Learning Decision, adaptive recommendation, and advanced analytics.
* [ ] No frontend-owned learning decisions.
* [ ] No direct Engine, Runtime, Recommendation Engine, or AI Layer calls outside documented APIs.
* [ ] No architecture violations against AD-002, AD-003, AD-005, AD-006, AD-009, or AD-010.

Component mapping: UX-007 uses CMP-026, CMP-027, CMP-028; UX-011 uses CMP-029 and CMP-028.

## 16. Open Issues

Only implementation gaps requiring confirmation are listed here:

* Exact frontend framework if not already defined.
* Exact API endpoint naming where `62_api_spec.md` differs from UI/UX shorthand.
* Authentication token/session storage and refresh handling details if not fully specified.
* AI conversation streaming support if not explicitly defined in API Spec.
* Final responsive breakpoints if not defined by Design System implementation.
* Whether a dedicated progress endpoint exists beyond `GET /api/v1/assessment-results`; if not, dashboard should use documented APIs only.
* Idempotency semantics for retrying `POST /api/v1/learning-activities/{activityId}/complete`.

Do not create open issues for already-settled architecture decisions.

## 17. References

* `docs/00_foundation/00_overview.md`
* `docs/00_foundation/01_architecture_principles.md`
* `docs/00_foundation/02_glossary.md`
* `docs/99_architecture_decisions.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/61_api_design_principles.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/64_engine_contracts.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/80_implementation/80_feature_breakdown.md`
* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/70_ui_ux/72_screen_inventory.md`
* `docs/70_ui_ux/73_component_spec.md`
* `docs/70_ui_ux/74_frontend_state_model.md`
* `docs/70_ui_ux/75_interaction_spec.md`
* `docs/70_ui_ux/76_design_system.md`
