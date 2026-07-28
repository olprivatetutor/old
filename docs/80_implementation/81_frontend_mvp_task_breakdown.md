# Frontend MVP Task Breakdown

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | -------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------ |
| 2.2 | Freeze | Frontend Engineering | `80_implementation/80_feature_breakdown.md`, `70_ui_ux/*`, `60_engineering/*`, `99_architecture_decisions.md` | Frontend Engineering, QA, MVP Delivery | 2026-07-11 |

## 1. Purpose

This document breaks the frozen frontend implementation plan into executable MVP frontend tasks for Kaifa v2. It translates the approved UI/UX screen, component, state, interaction, design system, and implementation plan documents into practical delivery work for Frontend Engineering and QA.

This document does not redefine:

* architecture,
* product scope,
* API contracts,
* frontend state model,
* component specs,
* interaction specs,
* design system,
* engine behavior,
* AI behavior.

Frontend implementation remains a presentation/application layer only. Backend/API behavior remains the source of truth for Learner context, learning resources, Activity Result, Assessment Result, and learning state.

## 2. Task Breakdown Principles

* Tasks must be traceable to frozen UI/UX docs.
* Tasks must map to UX screen IDs, CMP component IDs, FSM state IDs, and INT interaction IDs where applicable.
* Frontend tasks are implementation tasks only.
* Backend/API behavior remains source of truth.
* No task may introduce out-of-scope MVP features.
* No task may move business rules into frontend.
* No task may create frontend-owned learning outcomes.
* Frontend must not compute Learning Decision.
* Frontend must not produce Assessment Result.
* Frontend must not update Knowledge Profile.
* Frontend must not publish Official Runtime Events.
* Frontend must not directly call Runtime, Engine, Recommendation Engine, or AI Layer outside documented APIs.
* AI tasks apply only to Learning Activities with `activity_type = Practice`. Assessable Practice submits completion data or approved assessment evidence through documented APIs. Backend/API behavior creates or persists Activity Result for Assessment Engine evaluation.
* Basic Progress Dashboard must remain basic progress only.
* Error/fallback and accessibility tasks are first-class MVP tasks.

## 3. MVP Frontend Workstreams

| Workstream ID | Workstream | Purpose | Primary References |
| ------------- | ---------- | ------- | ------------------ |
| FE-WS-001 | Frontend Foundation | Establish project structure, API wrapper boundaries, config, and safe utilities. | `77_frontend_implementation_plan.md`, `61_api_design_principles.md` |
| FE-WS-002 | Routing and App Shell | Implement public/authenticated routing, layouts, guards, and safe navigation. | `71_user_flow.md`, `72_screen_inventory.md`, `75_interaction_spec.md` |
| FE-WS-003 | Design System and Base Components | Implement tokens, primitives, visual states, and responsive primitives. | `76_design_system.md`, `73_component_spec.md` |
| FE-WS-004 | Authentication and Learner Context | Implement Login, auth/me validation, logout, and Learner state isolation. | UX-002, FSM-001, FSM-002, INT-003 to INT-005 |
| FE-WS-005 | Public Landing Page | Implement public Landing Page, public header, highlights, and static fallback. | UX-001, CMP-001, CMP-004, INT-001, INT-002 |
| FE-WS-006 | Program and Subject Selection | Implement Learner Home entry, Program Selection, Program Card, and Subject Card. | UX-003, UX-004, CMP-005, CMP-006 |
| FE-WS-007 | Program Detail and Module List | Implement Program Detail, modules, activities, and empty/error states. | UX-005, CMP-007, CMP-008 |
| FE-WS-008 | Learning Activity Experience | Implement Learning Activity Page, content, objective, completion control, and AI entry guard. | UX-006, CMP-009 to CMP-011, CMP-015 |
| FE-WS-009 | Activity Completion and Assessment Result | Implement completion API integration and read-only Assessment Result display. | UX-008, CMP-015, CMP-016 |
| FE-WS-010 | Basic Progress Dashboard | Implement basic progress summary and read-only result lists. | UX-009, CMP-017 to CMP-019 |
| FE-WS-011 | AI Conversation Practice | Implement Practice-activity AI Conversation UI, messages, Normal/Assessable completion, and fallback behavior. | UX-007, CMP-011 to CMP-014, CMP-026 to CMP-028 |
| FE-WS-012 | Error, Fallback, and Recovery | Implement loading, empty, error, fallback, unauthorized, session expired, and safe recovery states. | UX-010, CMP-020 to CMP-023 |
| FE-WS-013 | Accessibility and Responsive QA | Implement and verify keyboard, focus, screen-reader, color, touch, and responsive behavior. | `75_interaction_spec.md`, `76_design_system.md` |
| FE-WS-014 | Frontend Testing and MVP Hardening | Implement tests, mocks, flow coverage, boundary checks, and final readiness validation. | `77_frontend_implementation_plan.md`, all UI/UX docs |
| FE-WS-015 | Placement Test | Implement UX-011 as a metadata-driven specialized assessable Learning Activity. | UX-011, CMP-028, CMP-029, FSM-021, INT-028 |
| FE-WS-016 | AI Voice and Assessable Practice | Implement mandatory voice/STT/TTS, transcript/playback, localization, and assessable submission. | UX-007, CMP-026 to CMP-028, FSM-014, INT-029, INT-030 |

## 4. Task ID Convention

Task IDs use the format:

```text
FE-TASK-###
```

Rules:

* Task IDs must be stable.
* Task IDs must not be reused.
* Each task should have clear scope, references, dependencies, acceptance criteria, and out-of-scope notes.
* A task ID represents frontend implementation or QA work only.
* Task IDs do not define product scope, API contracts, database schema, or business rules.

### 4.1 Task Record Field Interpretation

For the preserved FE-TASK-001 through FE-TASK-100 compact tables:

* **Task ID** is the Task ID.
* **Task** supplies the Task Name and implementation Objective.
* **References** supplies Scope plus Related Screen IDs, Component IDs, State Domain IDs, Interaction IDs, API Dependencies, and Data Dependencies where applicable; frozen referenced documents provide the canonical detail and omitted categories mean none directly.
* **Dependencies** supplies implementation Dependencies.
* **Acceptance Criteria** supplies Acceptance Criteria.
* **Out of Scope** supplies Architecture / Boundary Notes.
* **QA / Test Requirements** are the applicable FE-WS-014 tasks, Section 7 flow coverage, Section 8 QA matrix, and the acceptance criteria of the task itself.
* **MVP Status** is Required unless a task explicitly says optional or conditional.

FE-TASK-101 onward uses expanded task records with every field stated explicitly. This preserves stable existing IDs while making all task records independently implementable and testable.

## 5. Detailed Frontend Task Breakdown

### FE-WS-001 — Frontend Foundation

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-001 | Initialize frontend application structure | `77_frontend_implementation_plan.md` section 4 | Repository setup decisions | `src/` structure or framework-equivalent boundaries exist for app, routes, components, features, services, state, styles, tests. | Framework redesign, backend changes. |
| FE-TASK-002 | Configure shared TypeScript/types boundary if applicable | `62_api_spec.md`, `74_frontend_state_model.md` | FE-TASK-001 | Shared frontend types align to documented API/UI state concepts without creating new domain entities. | New database entities, new business rules. |
| FE-TASK-003 | Create API client wrapper structure | `61_api_design_principles.md`, `62_api_spec.md` | FE-TASK-001 | API client centralizes base request, response handling, auth error mapping, and safe error normalization. | Direct Engine/Runtime/AI Layer calls. |
| FE-TASK-004 | Create frontend environment/config handling | `77_frontend_implementation_plan.md` | FE-TASK-001 | Public config, API base URL, feature flags if needed, and runtime-safe defaults are isolated. | Business rule flags, hidden MVP features. |
| FE-TASK-005 | Define global error normalization utilities | UX-010, FSM-019, INT-020 to INT-024 | FE-TASK-003 | 401, 403, 404, 5xx, network, AI unavailable, assessment failed map to safe UI categories. | Exposing stack traces, provider details, raw IDs, secrets. |

### FE-WS-002 — Routing and App Shell

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-006 | Define public and authenticated route structure | UX-001 to UX-011, INT-001 to INT-004, INT-028 | FE-TASK-001 | Routes or renderable screen states cover UX-001 to UX-011; UX-010 is reusable fallback state with dedicated route only if needed; UX-011 is an authenticated specialized activity view. | A `/placement-tests` API resource, signup route. |
| FE-TASK-007 | Implement public layout | CMP-001, UX-001, INT-001 | FE-TASK-012, FE-TASK-026 | Public layout renders product navigation and Login CTA without Learner data. | Dashboard link, logout, learner identity. |
| FE-TASK-008 | Implement authenticated layout | CMP-002, UX-003 to UX-011 | FE-TASK-006, FE-TASK-021 | Authenticated layout, header, and logout cover UX-003 to UX-011 and display active Learner context only after validation. | Educator/admin controls, role management. |
| FE-TASK-009 | Implement route guards using `GET /api/v1/auth/me` | INT-004, FSM-001, FSM-002 | FE-TASK-003, FE-TASK-021 | Authenticated routes block private render until Learner context is valid; expired sessions redirect to Login. | Client-only auth decisions. |
| FE-TASK-010 | Implement safe navigation and back behavior | CMP-023, CMP-025, INT-021 | FE-TASK-006 | Back/continue routes resolve to safe destinations and never use Learning Decision. | Adaptive next-step navigation. |
| FE-TASK-011 | Implement UX-010 as reusable fallback states and optional `/error` only if needed | UX-010, CMP-020 to CMP-023 | FE-TASK-005, FE-TASK-015 | Fallback states render inline or route-level; dedicated `/error` is optional and only used where useful. | Treating unauthorized as empty state. |

### FE-WS-003 — Design System and Base Components

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-012 | Implement design tokens | `76_design_system.md` sections 3-4 | FE-TASK-001 | Semantic color, typography, spacing, radius, border, shadow, layout, motion, icon, and state tokens exist. | Encoding business rules in tokens. |
| FE-TASK-013 | Implement typography and layout primitives | `76_design_system.md` sections 5-7 | FE-TASK-012 | Heading, body, helper, label, page container, grid, stack, and reading-width primitives exist. | New visual scope beyond UX-001 to UX-011. |
| FE-TASK-014 | Implement button, input, card, badge primitives | CMP visual requirements, INT guard rules | FE-TASK-012, FE-TASK-013 | Primitives support default, hover, focus, active, disabled, loading, error states. | Signup/social auth controls. |
| FE-TASK-015 | Implement loading, empty, error, and fallback primitives | CMP-020, CMP-021, CMP-022 | FE-TASK-012 | Shared primitives cover loading, empty, error, warning, pending, session expired, unauthorized. | Internal error detail display. |
| FE-TASK-016 | Implement focus and accessibility visual states | `76_design_system.md` section 17, INT-025, INT-026 | FE-TASK-014 | Focus ring, disabled state, form error focus, and async announcement styling are present. | Mouse-only interaction paths. |
| FE-TASK-017 | Implement responsive layout primitives | `76_design_system.md` section 7 | FE-TASK-013 | Mobile/tablet/desktop layout primitives keep primary actions, logout, and safe nav reachable. | Hidden blocking content. |

### FE-WS-004 — Authentication and Learner Context

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-018 | Implement Login Page UX-002 | UX-002, INT-003 | FE-TASK-006, FE-TASK-013 | Login page renders with MVP learner login only. | Public signup, forgot password, OAuth, SSO, MFA. |
| FE-TASK-019 | Implement Login Form CMP-003 | CMP-003, INT-003 | FE-TASK-014, FE-TASK-018 | Identifier/password fields, validation, safe errors, disabled/submitting states work. | Social login buttons. |
| FE-TASK-020 | Integrate login API | `POST /api/v1/auth/login`, INT-003 | FE-TASK-003, FE-TASK-019 | Successful login establishes session flow and proceeds to `auth/me`; failed login shows safe error. | Persisting password, advanced auth. |
| FE-TASK-021 | Integrate `GET /api/v1/auth/me` | FSM-002, INT-004 | FE-TASK-003 | Active Learner context is loaded and private screens render only after validation. | Client-invented Learner context. |
| FE-TASK-022 | Implement logout CMP-024 | CMP-024, INT-005 | FE-TASK-003, FE-TASK-021 | Logout calls API, clears local Learner-scoped state, and redirects to public/Login screen. | Account management. |
| FE-TASK-023 | Clear Learner-scoped frontend state on logout/session expiry/context mismatch | FSM-001, FSM-002, FSM reset rules | FE-TASK-021, FE-TASK-022 | Program, activity, result, dashboard, AI conversation state clears safely. | Keeping stale private data. |
| FE-TASK-024 | Test two Learner account isolation | QA checklist, data isolation rules | FE-TASK-018 to FE-TASK-023 | Learner A data never appears after Learner B login; unauthorized data is not shown. | Cross-learner sharing UI. |

### FE-WS-005 — Public Landing Page

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-025 | Implement UX-001 Public Landing Page | UX-001, INT-001 | FE-TASK-007, FE-TASK-012 | Public Landing Page renders product information and Login CTA. | Learner personalization, Enrollment. |
| FE-TASK-026 | Implement Public Header CMP-001 | CMP-001, `76_design_system.md` | FE-TASK-014 | Header shows product name and Login CTA only. | Learner identity, dashboard link, logout, signup. |
| FE-TASK-027 | Implement Program Highlight Card CMP-004 | CMP-004 | FE-TASK-014 | Public program highlight cards render Published highlights safely. | Authenticated program detail access without login. |
| FE-TASK-028 | Integrate `GET /api/v1/public/landing-page` | UX-001 API dependencies | FE-TASK-003, FE-TASK-025 | Landing config loads; failure falls back safely. | Learner-scoped API calls. |
| FE-TASK-029 | Integrate `GET /api/v1/public/program-highlights` | UX-001 API dependencies | FE-TASK-003, FE-TASK-027 | Published highlights load; empty/failure state is public and safe. | Private program content. |
| FE-TASK-030 | Implement static public fallback if public APIs fail | UX-001, INT-001, `77_frontend_implementation_plan.md` | FE-TASK-025, FE-TASK-028, FE-TASK-029 | Static fallback content appears without Learner data or internal error details. | Authenticated program detail access. |

### FE-WS-006 — Program and Subject Selection

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-031 | Implement UX-003 Learner Home program entry | UX-003, CMP-005, CMP-017 | FE-TASK-008, FE-TASK-021 | Learner Home displays active Learner identity and program entry points. | Knowledge Profile, Learning Decision, adaptive recommendation. |
| FE-TASK-032 | Implement UX-004 Program / Subject Selection | UX-004, INT-007 | FE-TASK-006, FE-TASK-035 | Program Selection displays Published Learning Programs. | Enrollment, adaptive selection. |
| FE-TASK-033 | Implement Program Card CMP-005 | CMP-005 | FE-TASK-014 | Program cards support manual selection and safe loading/empty/error states. | Adaptive ranking. |
| FE-TASK-034 | Implement Subject Card CMP-006 as UI representation only | CMP-006, UX-004 | FE-TASK-014 | Subject cards display subject-like program grouping without creating a new entity. | New Subject domain entity. |
| FE-TASK-035 | Integrate `GET /api/v1/learning-programs` | UX-003, UX-004 | FE-TASK-003, FE-TASK-021 | Program list loads for active Learner context. | Knowledge Profile ranking. |
| FE-TASK-036 | Implement program empty/error states | CMP-020, CMP-022 | FE-TASK-015, FE-TASK-035 | No program and program API failures show safe retry/back behavior. | Synthetic programs or recommendations. |

### FE-WS-007 — Program Detail and Module List

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-037 | Implement UX-005 Program Detail / Module List | UX-005, INT-009, INT-028 | FE-TASK-006, FE-TASK-040 to FE-TASK-043 | Program detail page displays structure, modules, activities, and Placement Test entry when a Published Learning Activity has `purpose = Placement`. | Adaptive sequencing or placement resource. |
| FE-TASK-038 | Implement Module Card CMP-007 | CMP-007 | FE-TASK-014 | Module cards show module title and optional basic completion display. | Learning Decision sequence labels. |
| FE-TASK-039 | Implement Activity Card CMP-008 | CMP-008, CMP-029 | FE-TASK-014 | Activity cards show activity type, AI Practice availability only for Practice, and route Placement-purpose activity metadata to UX-011. | AI Practice for non-Practice activities; placement entity. |
| FE-TASK-040 | Integrate `GET /api/v1/learning-programs/{programId}` | UX-005 API dependencies | FE-TASK-003, FE-TASK-021 | Program detail loads and handles unauthorized/not found safely. | Treating unauthorized as empty. |
| FE-TASK-041 | Integrate `GET /api/v1/learning-programs/{programId}/program-structure` | UX-005 API dependencies | FE-TASK-003, FE-TASK-040 | Program Structure loads and displays read-only structure. | Frontend-created structure. |
| FE-TASK-042 | Integrate `GET /api/v1/learning-modules` | UX-005 API dependencies | FE-TASK-003, FE-TASK-040 | Modules load for selected program context. | Adaptive module generation. |
| FE-TASK-043 | Integrate `GET /api/v1/learning-activities` | UX-005 API dependencies | FE-TASK-003, FE-TASK-040 | Activities load for selected module/program context. | Frontend-generated activities. |
| FE-TASK-044 | Implement module/activity empty/error states | UX-005, CMP-020, CMP-022 | FE-TASK-015, FE-TASK-042, FE-TASK-043 | No module/activity and API errors show safe recovery. | Fallback business rules. |

### FE-WS-008 — Learning Activity Experience

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-045 | Implement UX-006 Learning Activity Page | UX-006, INT-011, INT-012 | FE-TASK-006, FE-TASK-049, FE-TASK-050 | Activity Page prioritizes objective, content, and completion action; Placement-purpose activities use UX-011. | Adaptive content. |
| FE-TASK-046 | Implement Learning Content Viewer CMP-009 | CMP-009 | FE-TASK-014 | Published Learning Content displays with loading, empty, error states. | AI-generated content. |
| FE-TASK-047 | Implement Learning Objective Context CMP-010 | CMP-010 | FE-TASK-014 | Learning Objective context displays for activity and AI Practice. | UI editing of objective. |
| FE-TASK-048 | Implement Activity Completion Control CMP-015 | CMP-015, INT-013 | FE-TASK-014 | Complete Activity control supports idle, submitting, disabled, completed, failed visual states. | Direct Assessment Result creation. |
| FE-TASK-049 | Integrate `GET /api/v1/learning-activities/{activityId}` | UX-006 API dependencies | FE-TASK-003, FE-TASK-021 | Selected activity loads and is verified against accessible context. | Client-side activity authorization. |
| FE-TASK-050 | Integrate Learning Content API | `GET /api/v1/learning-contents`, UX-006 | FE-TASK-003, FE-TASK-049 | Published Learning Content loads through the documented endpoint with safe loading, empty, and error handling. | Inventing endpoint contracts or content. |
| FE-TASK-051 | Show AI Practice Entry CMP-011 only when `activity_type = Practice` | CMP-011, FSM-013, INT-014 | FE-TASK-039, FE-TASK-049 | AI Practice entry is hidden for non-Practice and visible/available only for Practice when allowed. | AI entry on non-Practice. |
| FE-TASK-052 | Prevent completion duplicate submit | INT-013, FSM-012 | FE-TASK-048 | Completion button disables/pends during submit and prevents duplicate unsafe submit. | Duplicate Activity Result creation. |
| FE-TASK-053 | Implement invalid activity/session/resource fallback states | UX-010, INT-022, INT-023 | FE-TASK-015, FE-TASK-049 | Invalid activity, expired session, unauthorized, not found display safe fallback. | Revealing resource ownership. |

### FE-WS-009 — Activity Completion and Assessment Result

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-054 | Integrate `POST /api/v1/learning-activities/{activityId}/complete` | INT-013, FSM-012 | FE-TASK-003, FE-TASK-048, FE-TASK-052 | Completion call succeeds/fails safely; Activity Result comes from backend/API behavior. | Frontend-created Assessment Result. |
| FE-TASK-055 | Implement UX-008 Activity Completion / Assessment Result | UX-008, INT-018 | FE-TASK-054, FE-TASK-056 | Result page handles pending, ready, failed, not found states. | Knowledge Profile update display, Learning Decision. |
| FE-TASK-056 | Implement Assessment Result Summary CMP-016 | CMP-016 | FE-TASK-014 | Assessment Result summary is read-only and visually non-editable. | Edit, re-score, manual correction. |
| FE-TASK-057 | Integrate `GET /api/v1/assessment-results/{resultId}` | UX-008 API dependencies | FE-TASK-003, FE-TASK-055 | Result detail loads for active Learner and displays read-only. | Accessing another Learner result. |
| FE-TASK-058 | Implement assessment pending/failed/not-found fallback states | FSM-015, UX-010 | FE-TASK-015, FE-TASK-057 | Pending/failed/not-found states provide safe retry/back/dashboard actions. | UI-generated result fallback. |
| FE-TASK-059 | Ensure Assessment Result is read-only and not editable/rescorable | UX-008, CMP-016, INT-018 | FE-TASK-056 | No edit, re-score, manual correction, or result mutation control appears. | Frontend scoring. |

### FE-WS-010 — Basic Progress Dashboard

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-060 | Implement UX-009 Basic Progress Dashboard | UX-009, INT-019 | FE-TASK-006, FE-TASK-061 to FE-TASK-064 | Dashboard displays basic progress only for active Learner. | Advanced analytics. |
| FE-TASK-061 | Implement Progress Summary Card CMP-017 | CMP-017 | FE-TASK-014 | Summary card displays current state/counts without mastery claims. | Knowledge Profile mastery. |
| FE-TASK-062 | Implement Activity Result List CMP-018 | CMP-018 | FE-TASK-014 | Activity Result list is read-only and scoped to active Learner. | Editing Activity Result. |
| FE-TASK-063 | Implement Assessment Result List CMP-019 | CMP-019 | FE-TASK-014 | Assessment Result list is read-only and scoped to active Learner. | Learning Decision next step. |
| FE-TASK-064 | Integrate `GET /api/v1/assessment-results` | UX-009 API dependencies | FE-TASK-003, FE-TASK-021 | Result list loads for Dashboard and Assessment list views. | Undocumented progress API assumptions. |
| FE-TASK-065 | Use only documented progress/result APIs | `62_api_spec.md`, `77_frontend_implementation_plan.md` | FE-TASK-064 | Dashboard uses documented APIs; unclear dedicated progress endpoint remains open issue. | Inventing progress endpoint. |
| FE-TASK-066 | Ensure dashboard excludes Knowledge Profile, Learning Decision, adaptive recommendation, and advanced analytics | UX-009, CMP-017 to CMP-019 | FE-TASK-060 | Dashboard has no Knowledge Profile, Learning Decision, adaptive recommendation, mastery, or advanced analytics UI. | Recommendation UI. |

### FE-WS-011 — AI Conversation Practice

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-067 | Implement UX-007 AI Conversation Practice | UX-007, INT-014 to INT-017, INT-029, INT-030 | FE-TASK-045, FE-TASK-068 to FE-TASK-075 | AI Practice opens only from Practice activity; supports Normal and Assessable Practice without presenting AI guidance as an official result. | AI-produced scoring or Assessment Result. |
| FE-TASK-068 | Implement AI Practice Entry Control CMP-011 | CMP-011 | FE-TASK-014, FE-TASK-051 | Entry control is hidden, available, starting, unavailable, or disabled according to Practice eligibility. | Non-Practice AI entry. |
| FE-TASK-069 | Implement AI Conversation Panel CMP-012 | CMP-012, CMP-026 to CMP-028 | FE-TASK-014, FE-TASK-047 | Panel displays objective context, history, text fallback, voice controls, transcript/playback, and the correct Normal or Assessable completion control. | AI scoring UI. |
| FE-TASK-070 | Implement AI Message Bubble CMP-013 | CMP-013 | FE-TASK-014, FE-TASK-069 | Learner and AI Practice messages are visually and accessibly distinguished. | Score/result styling. |
| FE-TASK-071 | Implement AI Practice Fallback Banner CMP-014 | CMP-014 | FE-TASK-015 | Fallback says Learner can continue activity without AI. | Blocking activity completion because AI is unavailable. |
| FE-TASK-072 | Integrate AI conversation start endpoint | `POST /api/v1/learning-activities/{activityId}/ai-conversation/start` | FE-TASK-003, FE-TASK-068 | Start creates/opens AI Practice conversation for active Learner/activity/objective. | Starting AI for non-Practice. |
| FE-TASK-073 | Integrate AI conversation message endpoint | `POST /api/v1/ai-conversations/{conversationId}/messages` | FE-TASK-003, FE-TASK-069, FE-TASK-070 | Messages send with duplicate-submit guard and safe fallback. | AI-generated official recommendation. |
| FE-TASK-074 | Integrate AI conversation complete endpoint | `POST /api/v1/ai-conversations/{conversationId}/complete`, INT-016, INT-030 | FE-TASK-003, FE-TASK-069 | Normal Practice ends and returns to UX-006 for separate completion; Assessable Practice completion submits completion data or approved assessment evidence through the documented API, waits for backend/API behavior to create or persist Activity Result and for Assessment Engine evaluation, then navigates to UX-008 when the official Assessment Result is available. | AI producing or owning Assessment Result. |
| FE-TASK-075 | Integrate AI conversation history/detail endpoint | `GET /api/v1/ai-conversations/{conversationId}` | FE-TASK-003, FE-TASK-069 | Conversation history loads for valid active Learner conversation. | Showing another Learner conversation. |
| FE-TASK-076 | Implement provider unavailable fallback | UX-007, CMP-014, FSM-014 | FE-TASK-071 | Provider unavailable shows safe fallback and allows returning to activity. | Provider/internal details. |
| FE-TASK-077 | Implement governance blocked fallback | UX-007, FSM-014 | FE-TASK-071 | Governance blocked state shows safe guidance without provider detail. | Circumventing governance. |
| FE-TASK-078 | Ensure AI authority remains practice guidance only | AD-006, AD-009, UX-007 | FE-TASK-067 to FE-TASK-077 | AI output never appears as score, Assessment Result, mastery, Learning Decision, or official recommendation; assessable evidence is evaluated only by Assessment Engine. | AI-generated business decisions or Official Runtime Events. |

### FE-WS-012 — Error, Fallback, and Recovery

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-079 | Implement Empty State Block CMP-020 | CMP-020, FSM-018 | FE-TASK-015 | Empty state supports no program, module, activity, content, result, completed activity. | Synthetic content/path. |
| FE-TASK-080 | Implement Loading State Indicator CMP-021 | CMP-021, FSM-017 | FE-TASK-015 | Loading state supports blocking and non-blocking request states without stale private data. | Fake progress. |
| FE-TASK-081 | Implement Error / Fallback Banner CMP-022 | CMP-022, FSM-019 | FE-TASK-015 | Banner shows safe message, retry/safe action, and no internal detail. | Stack traces, provider details, raw IDs. |
| FE-TASK-082 | Implement Safe Navigation Control CMP-023 | CMP-023, INT-021 | FE-TASK-010, FE-TASK-014 | Safe nav routes to Login, Home, Program Selection, Module List, Activity, Dashboard as allowed. | Unauthorized destinations. |
| FE-TASK-083 | Implement fallback handling for 401, 403, 404, 5xx, network failure | UX-010, INT-022, INT-023 | FE-TASK-005, FE-TASK-081, FE-TASK-082 | Common API failures map to correct UI recovery behavior. | Treating all errors as retryable. |
| FE-TASK-084 | Implement session expired recovery | INT-022, FSM-001 | FE-TASK-009, FE-TASK-023, FE-TASK-083 | 401/session expired clears Learner-scoped state and redirects Login. | Keeping private UI visible. |
| FE-TASK-085 | Ensure unauthorized is not treated as empty state | INT-023, FSM-019 | FE-TASK-083 | 403/resource mismatch shows unauthorized fallback and safe destination. | Revealing resource existence. |
| FE-TASK-086 | Ensure internal errors/provider details are never exposed | CMP-022, CMP-014 | FE-TASK-005, FE-TASK-081 | Errors display safe copy only; provider/database/service details are hidden. | Debug UI in MVP. |

### FE-WS-013 — Accessibility and Responsive QA

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-087 | Implement keyboard navigation coverage | INT-025, `76_design_system.md` | FE-TASK-014, FE-TASK-017 | Tab/Shift+Tab and Enter/Space work across MVP controls. | Mouse-only flows. |
| FE-TASK-088 | Implement semantic headings and visible form labels | `76_design_system.md`, CMP-003 | FE-TASK-013, FE-TASK-019 | Pages have semantic headings; login fields have visible labels. | Placeholder-only labels. |
| FE-TASK-089 | Implement focus management for route changes and AI panel/modal | INT-025, FSM-020 | FE-TASK-006, FE-TASK-069 | Focus moves to page heading, invalid field, and returns after AI panel/modal close. | Hidden focus traps. |
| FE-TASK-090 | Implement `aria-live` or equivalent for async errors/status | INT-026, FSM-020 | FE-TASK-015, FE-TASK-081 | Loading/error/session/AI/assessment status announcements are available. | Announcing internal details. |
| FE-TASK-091 | Implement non-color-only status indicators | `76_design_system.md` section 17 | FE-TASK-012, FE-TASK-015 | Statuses include text/icon support, not color only. | Color-only warnings/errors. |
| FE-TASK-092 | Verify mobile-first responsive layout | `76_design_system.md` section 7 | FE-TASK-017, screen tasks | UX-001 to UX-011 remain usable on mobile/tablet/desktop. | Hiding blocking content. |
| FE-TASK-093 | Verify touch targets and primary actions on mobile | `76_design_system.md` | FE-TASK-092 | Login, complete, retry, safe nav, AI controls, logout are reachable and tappable. | Desktop-only MVP. |

### FE-WS-014 — Frontend Testing and MVP Hardening

| Task ID | Task | References | Dependencies | Acceptance Criteria | Out of Scope |
| ------- | ---- | ---------- | ------------ | ------------------- | ------------ |
| FE-TASK-094 | Add unit tests for safe utilities and state transitions | FSM-001 to FSM-021, INT guards | FE-TASK-005, FE-TASK-023 | Auth, safe nav, error mapping, AI availability, Placement lifecycle, and reset rules have unit coverage. | Testing backend internals. |
| FE-TASK-095 | Add component tests for CMP-001 to CMP-029 | `73_component_spec.md` | Component tasks | Component states, visibility rules, accessibility behavior, and boundary notes are covered for CMP-001 through CMP-029. | Components outside frozen catalog. |
| FE-TASK-096 | Add integration tests for critical learner flow | `71_user_flow.md`, section 7 below | Screen/API tasks | Critical MVP user flows, including Placement and both Practice completion modes, pass with API mocks. | Backend implementation tests. |
| FE-TASK-097 | Add API mock coverage for success and failure states | `62_api_spec.md`, UX-010 | FE-TASK-003, FE-TASK-083 | Success, empty, 401, 403, 404, 5xx, network, AI unavailable, assessment failed are mocked. | Changing API contracts. |
| FE-TASK-098 | Add AI unavailable/governance blocked tests | UX-007, CMP-014 | FE-TASK-076, FE-TASK-077 | AI fallback does not block activity completion and shows safe copy. | AI official scoring tests. |
| FE-TASK-099 | Add Learner A/B isolation tests | FSM-002, data isolation rules | FE-TASK-024, FE-TASK-083 | Login/logout/switch scenarios do not leak private Learner data. | Shared Learner dashboard. |
| FE-TASK-100 | Add final MVP frontend readiness checklist execution | `77_frontend_implementation_plan.md` section 15 | FE-TASK-094 to FE-TASK-099, FE-TASK-111, FE-TASK-112 | Final checklist confirms all MVP routes/states, CMP-001 to CMP-029, documented APIs, accessibility, Placement, AI voice/assessable flows, isolation, and no architecture violations. | Expanding MVP scope. |

### FE-WS-015 — Placement Test

#### FE-TASK-101 — Implement authenticated UX-011 route and Placement entry

* **Objective:** Provide the MVP Placement Test entry and route.
* **Scope:** Detect a Published Learning Activity with `purpose = Placement` in UX-005, render its available state through CMP-029, and open guarded UX-011.
* **Related Screen IDs:** UX-005, UX-011.
* **Related Component IDs:** CMP-002, CMP-008, CMP-024, CMP-025, CMP-029.
* **Related State Domain IDs:** FSM-001, FSM-002, FSM-003, FSM-008, FSM-021.
* **Related Interaction IDs:** INT-004, INT-005, INT-009, INT-021, INT-028.
* **API Dependencies:** `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-programs/{programId}/program-structure`, and `GET /api/v1/learning-activities?purpose=placement`.
* **Data Dependencies:** `learner`, `learning_program`, `learning_activity` metadata.
* **Architecture / Boundary Notes:** Placement is a specialized Learning Activity, not a new entity or `/placement-tests` resource; UX-011 requires active Learner context, authenticated header, logout, isolation, and expiry handling.
* **Acceptance Criteria:** Eligible Placement entry opens UX-011; unavailable/unauthorized resources show safe states; no stale Learner data renders.
* **Dependencies:** FE-TASK-008, FE-TASK-009, FE-TASK-037, FE-TASK-039.
* **QA / Test Requirements:** Route-guard, metadata visibility, logout, expired-session, unauthorized, responsive, and keyboard tests.
* **MVP Status:** Required.

#### FE-TASK-102 — Implement Placement Test lifecycle and CMP-029

* **Objective:** Implement the complete presentation lifecycle for UX-011.
* **Scope:** Render `available`, `starting`, `in-progress`, `submitting`, `assessment-pending`, `assessment-ready`, `failed`, and `retrying`, including progress display and safe return.
* **Related Screen IDs:** UX-011.
* **Related Component IDs:** CMP-015, CMP-020 to CMP-025, CMP-028, CMP-029.
* **Related State Domain IDs:** FSM-003, FSM-012, FSM-017 to FSM-021.
* **Related Interaction IDs:** INT-020 to INT-026, INT-028.
* **API Dependencies:** `POST /api/v1/learning-activities/{activityId}/start`, `POST /api/v1/learning-activities/{activityId}/complete`, and `GET /api/v1/assessment-results/{resultId}`.
* **Data Dependencies:** `learning_activity`, `activity_result`, `assessment_result`.
* **Architecture / Boundary Notes:** These are frontend states, never Runtime states; do not introduce `Result Available`.
* **Acceptance Criteria:** Progress, guarded submission, pending, ready, failure, retry, and safe navigation render consistently without duplicate completion.
* **Dependencies:** FE-TASK-015, FE-TASK-048, FE-TASK-101.
* **QA / Test Requirements:** Component-state, duplicate-submit, network/server failure, safe-retry, accessibility, and responsive tests.
* **MVP Status:** Required.

#### FE-TASK-103 — Integrate Placement assessment result and starting point display

* **Objective:** Connect Placement completion to official result display.
* **Scope:** Submit completion through existing activity APIs, wait for Assessment Engine, navigate to UX-008, and display any starting point suggestion read-only.
* **Related Screen IDs:** UX-011, UX-008, UX-009.
* **Related Component IDs:** CMP-016, CMP-019, CMP-028, CMP-029.
* **Related State Domain IDs:** FSM-015, FSM-016, FSM-021.
* **Related Interaction IDs:** INT-018, INT-019, INT-028.
* **API Dependencies:** `POST /api/v1/learning-activities/{activityId}/complete`, `GET /api/v1/assessment-results/{resultId}`, and `GET /api/v1/assessment-results`.
* **Data Dependencies:** `activity_result`, `assessment_result`.
* **Architecture / Boundary Notes:** Assessment Engine alone produces Assessment Result. A starting point suggestion is read-only and is not adaptive recommendation, Learning Decision, mastery, or Knowledge Profile output.
* **Acceptance Criteria:** Ready result routes to UX-008; applicable Placement result can appear in basic history; frontend computes no official outcome.
* **Dependencies:** FE-TASK-055 to FE-TASK-059, FE-TASK-102.
* **QA / Test Requirements:** Pending-to-ready, not-found, failed, ownership, read-only, and dashboard-boundary tests.
* **MVP Status:** Required.

### FE-WS-016 — AI Voice and Assessable Practice

#### FE-TASK-104 — Implement mandatory Voice Control Suite CMP-026

* **Objective:** Provide mandatory MVP voice capture for AI Conversation Practice.
* **Scope:** Microphone permission request/granted/denied; start/stop/cancel recording; timer/status; and explicit `microphone-permission-requested`, `permission-denied`, `recording`, `processing`, `transcribing`, `transcript-ready`, and `retrying` states, including STT failure/retry and accessible text fallback.
* **Related Screen IDs:** UX-007, UX-010.
* **Related Component IDs:** CMP-012, CMP-014, CMP-021 to CMP-023, CMP-026.
* **Related State Domain IDs:** FSM-014, FSM-017, FSM-019, FSM-020.
* **Related Interaction IDs:** INT-020, INT-025, INT-026, INT-029.
* **API Dependencies:** `POST /api/v1/ai-conversations/{conversationId}/messages` using documented audio input reference, STT transcript, and voice metadata fields.
* **Data Dependencies:** `ai_practice_conversation`, voice capture, `ai_practice_provider_record`.
* **Architecture / Boundary Notes:** Voice statuses are presentation/application state, not Runtime state; text remains available for accessibility and technical fallback.
* **Acceptance Criteria:** All required voice states and controls work; permission denial, recording failure, audio submission/upload failure, network interruption, and STT failure are recoverable; failed voice transport never blocks text input.
* **Dependencies:** FE-TASK-067, FE-TASK-069, FE-TASK-071.
* **QA / Test Requirements:** Permission, timer, cancel, STT failure/retry, keyboard, screen-reader status, touch-target, and responsive tests.
* **MVP Status:** Required.

#### FE-TASK-105 — Implement canonical transcript and TTS playback CMP-027

* **Objective:** Present the official conversation record and mandatory audio response playback.
* **Scope:** Canonical target-language transcript, AI response text, TTS play/replay, playback failure, and explicit `awaiting-ai-response`, `ai-response-ready`, `playing-audio`, `playback-failed`, and `retrying` states.
* **Related Screen IDs:** UX-007.
* **Related Component IDs:** CMP-013, CMP-021, CMP-022, CMP-027.
* **Related State Domain IDs:** FSM-014, FSM-017, FSM-019, FSM-020.
* **Related Interaction IDs:** INT-015, INT-020, INT-026, INT-029.
* **API Dependencies:** `POST /api/v1/ai-conversations/{conversationId}/messages` and `GET /api/v1/ai-conversations/{conversationId}` using documented transcript, audio response, audio metadata, translation, transliteration, script, and direction fields.
* **Data Dependencies:** `ai_practice_message`, canonical transcript, audio response.
* **Architecture / Boundary Notes:** Transcript is conversation evidence, not an Assessment Result; AI response is practice guidance only.
* **Acceptance Criteria:** Transcript-ready, awaiting-AI-response, AI-response-ready, playing-audio, playback-failed, and retrying states render; replay is available when audio exists.
* **Dependencies:** FE-TASK-070, FE-TASK-073, FE-TASK-075, FE-TASK-104.
* **QA / Test Requirements:** History loading, ordering, playback/replay/failure, announcement, and ownership tests.
* **MVP Status:** Required.

#### FE-TASK-106 — Implement AI language support, RTL, and text accessibility

* **Objective:** Make multilingual conversation content usable and accessible.
* **Scope:** Indonesian translation toggle, optional transliteration when supplied, Arabic-script/RTL rendering, visible text fallback, labels, focus, and announcements.
* **Related Screen IDs:** UX-007.
* **Related Component IDs:** CMP-012, CMP-013, CMP-026, CMP-027.
* **Related State Domain IDs:** FSM-014, FSM-020.
* **Related Interaction IDs:** INT-025, INT-026, INT-029.
* **API Dependencies:** Existing conversation response fields only.
* **Data Dependencies:** Canonical target-language transcript, optional Indonesian translation, optional transliteration, direction metadata.
* **Architecture / Boundary Notes:** Indonesian translation is support content; canonical target-language transcript remains the official conversation record.
* **Acceptance Criteria:** Toggle preserves canonical text, absent transliteration degrades safely, and Arabic content uses correct script/direction without reversing controls.
* **Dependencies:** FE-TASK-016, FE-TASK-105.
* **QA / Test Requirements:** Keyboard, screen-reader, bidi/RTL, translation-toggle, missing-optional-field, and responsive tests.
* **MVP Status:** Required.

#### FE-TASK-107 — Implement Assessable Submission Status CMP-028

* **Objective:** Provide shared frontend submission, pending, ready, and failure states for completion data or approved assessment evidence in UX-007 and UX-011.
* **Scope:** Invoke documented APIs with completion data or approved assessment evidence and manage `ready`, `assessment-submitting`, `assessment-pending`, `assessment-result-ready`, and `assessment-failed`; disable duplicate submit and navigate to UX-008 only after result availability.
* **Related Screen IDs:** UX-007, UX-008, UX-011.
* **Related Component IDs:** CMP-016, CMP-021 to CMP-023, CMP-028.
* **Related State Domain IDs:** FSM-014, FSM-015, FSM-017, FSM-019, FSM-021.
* **Related Interaction IDs:** INT-018, INT-020, INT-021, INT-026, INT-028, INT-030.
* **API Dependencies:** `POST /api/v1/ai-conversations/{conversationId}/complete`, `POST /api/v1/learning-activities/{activityId}/complete`, and `GET /api/v1/assessment-results/{resultId}`.
* **Data Dependencies:** `activity_result`, approved assessment evidence, `assessment_result`.
* **Architecture / Boundary Notes:** Backend/API behavior creates or persists Activity Result. Assessment Engine is the sole producer of official Assessment Result; frontend manages UI/application state, API invocation, navigation, and read-only display only, and result availability is a UI/application condition, not a new Runtime state.
* **Acceptance Criteria:** Submission/pending/ready/failure are explicit, retry is guarded, result is read-only, and no frontend scoring occurs.
* **Dependencies:** FE-TASK-015, FE-TASK-055 to FE-TASK-059.
* **QA / Test Requirements:** Duplicate submit, pending refresh, ready navigation, failure/retry, isolation, accessibility, and stale-data tests.
* **MVP Status:** Required.

#### FE-TASK-108 — Implement distinct Normal and Assessable Practice completion

* **Objective:** Enforce the two canonical completion flows.
* **Scope:** Normal: end session, return UX-006, separately complete activity. Assessable: complete conversation, submit completion data or approved assessment evidence through documented APIs, wait for backend/API behavior to create or persist Activity Result and for Assessment Engine evaluation, then navigate to UX-008 when the official Assessment Result is available.
* **Related Screen IDs:** UX-006, UX-007, UX-008.
* **Related Component IDs:** CMP-012, CMP-015, CMP-023, CMP-028.
* **Related State Domain IDs:** FSM-009, FSM-012, FSM-014, FSM-015.
* **Related Interaction IDs:** INT-013, INT-016, INT-018, INT-030.
* **API Dependencies:** `POST /api/v1/ai-conversations/{conversationId}/complete`, `POST /api/v1/learning-activities/{activityId}/complete`, and `GET /api/v1/assessment-results/{resultId}`.
* **Data Dependencies:** `ai_practice_conversation`, `activity_result`, approved assessment evidence, `assessment_result`.
* **Architecture / Boundary Notes:** AI never scores, creates/owns Assessment Result, updates Knowledge Profile, creates Learning Decision, or publishes Official Runtime Events.
* **Acceptance Criteria:** Normal flow requires separate UX-006 completion; Assessable flow has no duplicate second completion and reaches UX-008 only after Assessment Engine result.
* **Dependencies:** FE-TASK-054, FE-TASK-074, FE-TASK-107.
* **QA / Test Requirements:** End-to-end tests for both branches, duplicate prevention, pending/failed recovery, and authority-label assertions.
* **MVP Status:** Required.

#### FE-TASK-109 — Implement complete authentication and Learner-context frontend states

* **Objective:** Make authenticated state transitions explicit across UX-003 through UX-011.
* **Scope:** Auth `unknown`, `unauthenticated`, `authenticating`, `authenticated`, `expired`, `logout pending`; Learner context `loading`, `available`, `invalid`, `clearing`.
* **Related Screen IDs:** UX-002 to UX-011.
* **Related Component IDs:** CMP-002, CMP-003, CMP-021 to CMP-024.
* **Related State Domain IDs:** FSM-001, FSM-002, FSM-003, FSM-017, FSM-019.
* **Related Interaction IDs:** INT-003 to INT-005, INT-022, INT-023, INT-026.
* **API Dependencies:** `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`.
* **Data Dependencies:** `auth_session`, `learner`, all Learner-scoped frontend caches.
* **Architecture / Boundary Notes:** Backend session is authoritative; private UI remains hidden while unknown/loading/clearing.
* **Acceptance Criteria:** No stale-data flash occurs; logout/expiry/context mismatch clears all scoped state before public render.
* **Dependencies:** FE-TASK-009, FE-TASK-018 to FE-TASK-024.
* **QA / Test Requirements:** Cold boot, refresh, expiry, logout pending/failure, account switch, Learner A/B isolation, and UX-011 guard tests.
* **MVP Status:** Required.

#### FE-TASK-110 — Implement canonical general frontend status model

* **Objective:** Standardize general async and recovery states across every MVP screen.
* **Scope:** `loading`, `empty`, `error`, `unauthorized`, `not found`, `session expired`, `network unavailable`, and `retrying`.
* **Related Screen IDs:** UX-001 to UX-011.
* **Related Component IDs:** CMP-020 to CMP-023.
* **Related State Domain IDs:** FSM-003, FSM-017, FSM-018, FSM-019, FSM-020.
* **Related Interaction IDs:** INT-020 to INT-026.
* **API Dependencies:** All screen APIs through the normalized API client.
* **Data Dependencies:** Request/error metadata only; no new domain data.
* **Architecture / Boundary Notes:** Statuses are presentation/application state, not Runtime state or fallback business rules.
* **Acceptance Criteria:** Each screen has appropriate loading/empty/error recovery; unauthorized is never empty; retry does not duplicate side effects.
* **Dependencies:** FE-TASK-005, FE-TASK-015, FE-TASK-079 to FE-TASK-086.
* **QA / Test Requirements:** Per-screen 401/403/404/5xx/network/empty/retry matrices plus screen-reader announcements.
* **MVP Status:** Required.

#### FE-TASK-111 — Add Placement flow integration tests

* **Objective:** Verify Placement Test end to end.
* **Scope:** Entry, lifecycle, progress, submission, pending, ready, failed, retry, safe return, UX-008 navigation, and read-only starting point suggestion.
* **Related Screen IDs:** UX-005, UX-008, UX-009, UX-011.
* **Related Component IDs:** CMP-008, CMP-016, CMP-019, CMP-028, CMP-029.
* **Related State Domain IDs:** FSM-015, FSM-016, FSM-021.
* **Related Interaction IDs:** INT-018 to INT-021, INT-028.
* **API Dependencies:** Mocks for `GET /api/v1/learning-activities?purpose=placement`, `POST /api/v1/learning-activities/{activityId}/start`, `POST /api/v1/learning-activities/{activityId}/complete`, and `GET /api/v1/assessment-results/{resultId}`.
* **Data Dependencies:** Placement-purpose `learning_activity`, `activity_result`, `assessment_result`.
* **Architecture / Boundary Notes:** Assert no placement entity/resource, Learning Decision, Recommendation Engine output, mastery, or Knowledge Profile output.
* **Acceptance Criteria:** All Placement success/failure branches pass and official result remains Assessment Engine-owned.
* **Dependencies:** FE-TASK-101 to FE-TASK-103, FE-TASK-097.
* **QA / Test Requirements:** Integration, responsive, accessibility, isolation, and boundary assertions.
* **MVP Status:** Required.

#### FE-TASK-112 — Add AI voice and Practice completion integration tests

* **Objective:** Verify mandatory voice and both Practice completion modes.
* **Scope:** Voice/STT/TTS success and failures, text fallback, history/message pending, localization/RTL, AI unavailable, Normal completion, and Assessable completion.
* **Related Screen IDs:** UX-006, UX-007, UX-008, UX-010.
* **Related Component IDs:** CMP-011 to CMP-014, CMP-026 to CMP-028.
* **Related State Domain IDs:** FSM-012 to FSM-015, FSM-017, FSM-019, FSM-020.
* **Related Interaction IDs:** INT-014 to INT-018, INT-020, INT-025 to INT-027, INT-029, INT-030.
* **API Dependencies:** Mocks for `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`, `POST /api/v1/ai-conversations/{conversationId}/messages`, `GET /api/v1/ai-conversations/{conversationId}`, `POST /api/v1/ai-conversations/{conversationId}/complete`, and `GET /api/v1/assessment-results/{resultId}`.
* **Data Dependencies:** Conversation records, transcript/audio, Activity Result/evidence, Assessment Result.
* **Architecture / Boundary Notes:** Assert AI never produces official score/result, Knowledge Profile update, Learning Decision, or Official Runtime Event.
* **Acceptance Criteria:** Mandatory voice and fallback branches pass; Normal returns UX-006; Assessable reaches UX-008 after pending/ready.
* **Dependencies:** FE-TASK-104 to FE-TASK-108, FE-TASK-097, FE-TASK-098.
* **QA / Test Requirements:** Unit, component, integration, accessibility, responsive, isolation, and failure-injection tests.
* **MVP Status:** Required.

## 6. Dependency Order

Implementation SHOULD follow this dependency sequence:

1. FE-WS-001 Frontend Foundation.
2. FE-WS-003 Design System and Base Components.
3. FE-WS-002 Routing and App Shell.
4. FE-WS-004 Authentication and Learner Context.
5. FE-WS-005 Public Landing Page.
6. FE-WS-006 Program and Subject Selection.
7. FE-WS-007 Program Detail and Module List.
8. FE-WS-008 Learning Activity Experience.
9. FE-WS-009 Activity Completion and Assessment Result.
10. FE-WS-010 Basic Progress Dashboard.
11. FE-WS-011 AI Conversation Practice.
12. FE-WS-012 Error, Fallback, and Recovery.
13. FE-WS-013 Accessibility and Responsive QA.
14. FE-WS-015 Placement Test, after Program Detail and before final integration hardening.
15. FE-WS-016 AI Voice and Assessable Practice, alongside AI Conversation Practice and before final hardening.
16. FE-WS-014 Frontend Testing and MVP Hardening, after Placement and AI voice/assessable flow tests.

Fallback/error primitives SHOULD be created early in FE-WS-003 and expanded throughout implementation. UX-010 is primarily a reusable error/fallback state family and should only become a dedicated route where the implementation genuinely needs one.

## 7. Critical MVP User Flow Coverage

| Flow | Related UX Screens | Related INT IDs | Related FSM IDs | Related Task IDs |
| --- | --- | --- | --- | --- |
| Public Landing Page -> Login | UX-001, UX-002 | INT-001, INT-002 | FSM-003, FSM-004, FSM-017, FSM-019, FSM-020 | FE-TASK-006, FE-TASK-007, FE-TASK-025 to FE-TASK-030, FE-TASK-018 |
| Login -> Learner Home | UX-002, UX-003 | INT-003, INT-004, INT-006 | FSM-001, FSM-002, FSM-003, FSM-005, FSM-016 | FE-TASK-018 to FE-TASK-024, FE-TASK-031 |
| Learner Home -> Program / Subject Selection | UX-003, UX-004 | INT-006, INT-007 | FSM-002, FSM-003, FSM-005, FSM-017, FSM-018 | FE-TASK-031 to FE-TASK-036 |
| Program Selection -> Program Detail / Module List | UX-004, UX-005 | INT-008, INT-009 | FSM-003, FSM-005 to FSM-008, FSM-017, FSM-019 | FE-TASK-032 to FE-TASK-044 |
| Program Detail -> Learning Activity | UX-005, UX-006 | INT-010, INT-011, INT-012 | FSM-006 to FSM-011, FSM-013, FSM-017, FSM-018 | FE-TASK-037 to FE-TASK-053 |
| Learning Activity -> Completion -> Assessment Result | UX-006, UX-008 | INT-013, INT-018 | FSM-009, FSM-011, FSM-012, FSM-015, FSM-017, FSM-019 | FE-TASK-048, FE-TASK-052, FE-TASK-054 to FE-TASK-059 |
| Assessment Result -> Basic Progress Dashboard | UX-008, UX-009 | INT-018, INT-019, INT-021 | FSM-003, FSM-015, FSM-016, FSM-017, FSM-019 | FE-TASK-055 to FE-TASK-066, FE-TASK-082 |
| Learning Activity -> AI Conversation Practice -> Return to Learning Activity | UX-006, UX-007 | INT-014, INT-015, INT-016, INT-017 | FSM-009 to FSM-014, FSM-017, FSM-019, FSM-020 | FE-TASK-051, FE-TASK-067 to FE-TASK-078 |
| Program Detail -> Placement Test -> Assessment Result | UX-005, UX-011, UX-008 | INT-028, INT-018, INT-020, INT-021 | FSM-003, FSM-008, FSM-015, FSM-017 to FSM-021 | FE-TASK-037, FE-TASK-039, FE-TASK-101 to FE-TASK-103, FE-TASK-107, FE-TASK-111 |
| AI Voice Capture -> Transcript -> TTS Playback | UX-007 | INT-015, INT-020, INT-025, INT-026, INT-029 | FSM-014, FSM-017, FSM-019, FSM-020 | FE-TASK-104 to FE-TASK-106, FE-TASK-112 |
| Assessable Practice -> Assessment Pending -> Assessment Result | UX-007, UX-008 | INT-030, INT-018 | FSM-014, FSM-015, FSM-017, FSM-019 | FE-TASK-074, FE-TASK-107, FE-TASK-108, FE-TASK-112 |
| Failed API -> Error/Fallback -> Retry or Safe Navigation | UX-010 and inline fallback states | INT-020, INT-021, INT-023, INT-024, INT-026, INT-027 | FSM-017, FSM-018, FSM-019, FSM-020 | FE-TASK-005, FE-TASK-079 to FE-TASK-086, FE-TASK-090 |
| Expired Session -> Login Recovery | UX-002, UX-010 | INT-004, INT-022 | FSM-001, FSM-002, FSM-003, FSM-019 | FE-TASK-009, FE-TASK-021 to FE-TASK-024, FE-TASK-084 |
| Logout -> Clear Learner State -> Public/Login Screen | UX-001, UX-002, UX-003 to UX-011 | INT-005, INT-021 | FSM-001, FSM-002, FSM-003, FSM reset rules | FE-TASK-022, FE-TASK-023, FE-TASK-024, FE-TASK-082, FE-TASK-109 |

## 8. QA Acceptance Matrix

| Area | Must Verify | Related Tasks |
| ---- | ----------- | ------------- |
| MVP scope boundaries | Placement Test is included only as a specialized Learning Activity; no signup, OAuth, SSO, MFA, Enrollment, Educator/admin dashboard, Knowledge Profile UI, Learning Decision UI, adaptive path, advanced analytics, notifications, or achievements. | FE-TASK-006, FE-TASK-018, FE-TASK-066, FE-TASK-078, FE-TASK-100 to FE-TASK-103 |
| Learner context and data isolation | Active Learner context gates private screens; Learner A data never appears for Learner B. | FE-TASK-009, FE-TASK-021 to FE-TASK-024, FE-TASK-099 |
| Public landing behavior | Landing works without auth, uses public APIs, and falls back statically without Learner data. | FE-TASK-025 to FE-TASK-030 |
| Authentication | Login, auth/me, logout, expired session recovery, duplicate submit prevention. | FE-TASK-018 to FE-TASK-024, FE-TASK-084 |
| Program/manual selection | Published programs render; Program/Subject choice is manual only. | FE-TASK-031 to FE-TASK-036 |
| Program detail/module/activity display | Program detail, structure, modules, activities, empty/error states render safely. | FE-TASK-037 to FE-TASK-044 |
| Learning activity completion | Learning Activity loads content/objective; completion is explicit and duplicate submit guarded. | FE-TASK-045 to FE-TASK-054 |
| Assessment result read-only | Assessment Result is displayed read-only; no edit/re-score/manual correction. | FE-TASK-055 to FE-TASK-059 |
| Dashboard basic progress only | Dashboard excludes Knowledge Profile, Learning Decision, adaptive recommendation, mastery, advanced analytics. | FE-TASK-060 to FE-TASK-066 |
| AI Practice authority boundary | AI appears only for Practice and output is guidance only; Normal and Assessable completion are distinct; Assessment Engine alone produces official results. | FE-TASK-051, FE-TASK-067 to FE-TASK-078, FE-TASK-104 to FE-TASK-108, FE-TASK-112 |
| Placement Test | UX-011 covers Placement-purpose activity entry, progress, submission, pending/ready/failure/retry, and read-only suggestion without a new resource. | FE-TASK-101 to FE-TASK-103, FE-TASK-107, FE-TASK-111 |
| Voice/STT/TTS | Mandatory capture, canonical transcript, playback/replay, failures, text fallback, localization, and RTL behavior work accessibly. | FE-TASK-104 to FE-TASK-106, FE-TASK-112 |
| Error/fallback states | Loading, empty, error, unauthorized, session expired, provider unavailable, assessment failed are safe. | FE-TASK-079 to FE-TASK-086 |
| Accessibility | Keyboard, focus, visible labels, announcements, non-color status indicators pass baseline. | FE-TASK-087 to FE-TASK-091 |
| Responsive behavior | Mobile/tablet/desktop layouts keep primary actions, safe nav, and logout reachable. | FE-TASK-017, FE-TASK-092, FE-TASK-093 |
| No architecture boundary violations | Frontend does not own learning state, compute Learning Decision, produce Assessment Result, update Knowledge Profile, publish Official Runtime Events, or directly call Runtime/Engine/Recommendation Engine/AI Layer outside documented APIs. | FE-TASK-003, FE-TASK-054, FE-TASK-059, FE-TASK-066, FE-TASK-078, FE-TASK-100 |

## 9. Out-of-Scope Guardrails

No task in this document may implement:

* Public signup.
* Forgot password / reset password.
* OAuth / Google login / SSO.
* MFA.
* Educator/admin dashboard.
* Parent dashboard.
* Enrollment workflow.
* Payment/subscription.
* Notifications.
* Achievements/certificates.
* Knowledge Profile UI.
* Learning Decision UI.
* Adaptive/personalized learning path.
* Advanced analytics.
* AI-generated business decisions.
* Frontend-created Runtime Events.
* Frontend-created Assessment Result.
* Frontend-updated Knowledge Profile.
* A Placement Test domain entity or `/placement-tests` API resource.
* Placement starting point described as adaptive recommendation, Learning Decision, mastery, or Knowledge Profile output.
* AI-produced official score, Assessment Result, Learning Decision, Knowledge Profile update, or Official Runtime Event.

## 10. Implementation Open Issues

The following implementation open issues are carried forward from `77_frontend_implementation_plan.md`. They do not block this task breakdown.

* Exact frontend framework if not already defined.
* Authentication token/session storage and refresh handling details if not fully specified.
* AI conversation streaming support if not explicitly defined in API Spec; non-streaming remains the implementation default.
* Final responsive breakpoints if not defined by Design System implementation.
* Whether a dedicated progress endpoint exists beyond `GET /api/v1/assessment-results`.
* Idempotency semantics for retrying `POST /api/v1/learning-activities/{activityId}/complete`.

## 11. Final Frontend Readiness Checklist

* [x] All FE-TASK IDs are unique.
* [x] All tasks map to frozen docs.
* [x] UX-001 to UX-011 are covered.
* [x] CMP-001 to CMP-029 are covered.
* [x] FSM-001 to FSM-021 are covered where applicable.
* [x] INT-001 to INT-030 are covered where applicable.
* [x] Public Landing Page APIs are included.
* [x] Auth and Learner context isolation tasks are included.
* [x] Normal and Assessable Practice completion paths are distinct and covered.
* [x] Mandatory voice, STT, TTS, text fallback, localization, and RTL are covered.
* [x] Placement Test is covered as a specialized Learning Activity without a new entity/API resource.
* [x] Assessment Result read-only behavior is covered.
* [x] Basic Progress Dashboard remains basic only.
* [x] Error/fallback states are covered.
* [x] Accessibility and responsive QA are covered.
* [x] No out-of-scope MVP feature is introduced.
* [x] No frontend-owned learning decision is introduced.
* [x] No architecture boundary is weakened.

## 12. Coverage Matrices

### 12.1 Screen-to-Task Coverage

| Screen | Primary Task Coverage |
| --- | --- |
| UX-001 | FE-TASK-007, FE-TASK-025 to FE-TASK-030, FE-TASK-110 |
| UX-002 | FE-TASK-018 to FE-TASK-023, FE-TASK-109, FE-TASK-110 |
| UX-003 | FE-TASK-008, FE-TASK-009, FE-TASK-021 to FE-TASK-024, FE-TASK-031, FE-TASK-109 |
| UX-004 | FE-TASK-008, FE-TASK-009, FE-TASK-032 to FE-TASK-036, FE-TASK-109 |
| UX-005 | FE-TASK-008, FE-TASK-009, FE-TASK-037 to FE-TASK-044, FE-TASK-101 |
| UX-006 | FE-TASK-045 to FE-TASK-054, FE-TASK-108, FE-TASK-110 |
| UX-007 | FE-TASK-067 to FE-TASK-078, FE-TASK-104 to FE-TASK-108, FE-TASK-112 |
| UX-008 | FE-TASK-055 to FE-TASK-059, FE-TASK-103, FE-TASK-107, FE-TASK-108 |
| UX-009 | FE-TASK-060 to FE-TASK-066, FE-TASK-103, FE-TASK-109 |
| UX-010 | FE-TASK-005, FE-TASK-011, FE-TASK-079 to FE-TASK-086, FE-TASK-104, FE-TASK-110 |
| UX-011 | FE-TASK-006, FE-TASK-008, FE-TASK-009, FE-TASK-101 to FE-TASK-103, FE-TASK-107, FE-TASK-109 to FE-TASK-111 |

### 12.2 Component-to-Task Coverage

| Component | Primary Task Coverage |
| --- | --- |
| CMP-001 | FE-TASK-007, FE-TASK-026, FE-TASK-095 |
| CMP-002 | FE-TASK-008, FE-TASK-009, FE-TASK-021, FE-TASK-101, FE-TASK-109 |
| CMP-003 | FE-TASK-019, FE-TASK-020, FE-TASK-095, FE-TASK-109 |
| CMP-004 | FE-TASK-027, FE-TASK-029, FE-TASK-095 |
| CMP-005 | FE-TASK-031, FE-TASK-033, FE-TASK-035, FE-TASK-095 |
| CMP-006 | FE-TASK-032, FE-TASK-034, FE-TASK-095 |
| CMP-007 | FE-TASK-037, FE-TASK-038, FE-TASK-042, FE-TASK-095 |
| CMP-008 | FE-TASK-037, FE-TASK-039, FE-TASK-043, FE-TASK-101 |
| CMP-009 | FE-TASK-045, FE-TASK-046, FE-TASK-050, FE-TASK-095 |
| CMP-010 | FE-TASK-045, FE-TASK-047, FE-TASK-095 |
| CMP-011 | FE-TASK-051, FE-TASK-068, FE-TASK-112 |
| CMP-012 | FE-TASK-067, FE-TASK-069, FE-TASK-104, FE-TASK-106, FE-TASK-108 |
| CMP-013 | FE-TASK-070, FE-TASK-105, FE-TASK-106, FE-TASK-112 |
| CMP-014 | FE-TASK-071, FE-TASK-076, FE-TASK-077, FE-TASK-104, FE-TASK-112 |
| CMP-015 | FE-TASK-048, FE-TASK-052, FE-TASK-054, FE-TASK-102, FE-TASK-108 |
| CMP-016 | FE-TASK-055 to FE-TASK-059, FE-TASK-103, FE-TASK-107 |
| CMP-017 | FE-TASK-031, FE-TASK-060, FE-TASK-061, FE-TASK-066 |
| CMP-018 | FE-TASK-060, FE-TASK-062, FE-TASK-066 |
| CMP-019 | FE-TASK-060, FE-TASK-063 to FE-TASK-066, FE-TASK-103 |
| CMP-020 | FE-TASK-015, FE-TASK-079, FE-TASK-102, FE-TASK-110 |
| CMP-021 | FE-TASK-015, FE-TASK-080, FE-TASK-102, FE-TASK-104, FE-TASK-105, FE-TASK-107, FE-TASK-109 |
| CMP-022 | FE-TASK-015, FE-TASK-081, FE-TASK-102, FE-TASK-104, FE-TASK-105, FE-TASK-107, FE-TASK-109, FE-TASK-110 |
| CMP-023 | FE-TASK-010, FE-TASK-082, FE-TASK-102, FE-TASK-104, FE-TASK-107 to FE-TASK-110 |
| CMP-024 | FE-TASK-022, FE-TASK-101, FE-TASK-109 |
| CMP-025 | FE-TASK-010, FE-TASK-101, FE-TASK-102 |
| CMP-026 | FE-TASK-069, FE-TASK-104, FE-TASK-106, FE-TASK-112 |
| CMP-027 | FE-TASK-069, FE-TASK-105, FE-TASK-106, FE-TASK-112 |
| CMP-028 | FE-TASK-102, FE-TASK-103, FE-TASK-107, FE-TASK-108, FE-TASK-111, FE-TASK-112 |
| CMP-029 | FE-TASK-039, FE-TASK-101 to FE-TASK-103, FE-TASK-111 |

### 12.3 State and Interaction Coverage

* FSM-001 through FSM-021 are covered by FE-TASK-002, FE-TASK-009, FE-TASK-021 to FE-TASK-024, FE-TASK-031 to FE-TASK-086, and FE-TASK-101 to FE-TASK-112 as mapped in task references and flow tables. In particular, FSM-007 is covered by FE-TASK-037, FE-TASK-038, FE-TASK-042, and FE-TASK-044; FSM-010 is covered by FE-TASK-045, FE-TASK-046, FE-TASK-050, and FE-TASK-053.
* INT-001 through INT-030 are covered by FE-TASK-006 to FE-TASK-112 as mapped in task references and Section 7.
* Frontend statuses are presentation/application state only. No task defines `Result Available` or any other new Runtime state.

## 13. Freeze Declaration

This document is frozen as the source of truth for frontend MVP implementation. Its tasks are traceable to the frozen Product, Engineering, and UI/UX documents, and all frontend responsibilities remain limited to the presentation/application layer. Future changes require controlled review against the frozen architecture and source documents. FE-TASK IDs must remain stable after freeze.

## 14. References

* `docs/99_architecture_decisions.md`
* `docs/50_product/51_roadmap.md`
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
* `docs/70_ui_ux/77_frontend_implementation_plan.md`
