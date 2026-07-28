# MVP Execution Plan — Kaifa v2

| Version | Status | Owner | Depends On | Used By | Last Updated |
| --- | --- | --- | --- | --- | --- |
| 1.0 | Freeze | Product & Engineering Delivery | `80_feature_breakdown.md`, `81_frontend_mvp_task_breakdown.md`, `82_backend_mvp_task_breakdown.md`, `83_mvp_integration_qa_task_breakdown.md`, frozen Product / Engineering / UI/UX / Runtime / Engine / AI documentation, `99_architecture_decisions.md` | Product, Frontend Engineering, Backend Engineering, Runtime / Engine Engineering, AI Engineering, QA, MVP Delivery | 2026-07-14 |

## 1. Purpose

This document coordinates the frozen Kaifa v2 MVP task graph. It defines execution order, safe parallelism, cross-team gates, integration checkpoints, critical-path control, release evidence, and completion handoff. It does not replace the task breakdowns, restate task acceptance criteria, or redefine scope, contracts, or architecture.

## 2. Source of Truth and Document Ownership

| Concern | Canonical Owner |
| --- | --- |
| Product scope and requirements | PRD and SRS |
| Architecture decisions | `99_architecture_decisions.md` |
| API contract | `62_api_spec.md` |
| Database model | `63_database_model.md` |
| Engine contracts | `64_engine_contracts.md` |
| Event contracts | `21_event_model.md` and `65_event_contracts.md` |
| UI/UX contract | `70_ui_ux/*` |
| Feature decomposition | `80_feature_breakdown.md` |
| Frontend executable tasks | `81_frontend_mvp_task_breakdown.md` |
| Backend executable tasks | `82_backend_mvp_task_breakdown.md` |
| Integration and QA tasks | `83_mvp_integration_qa_task_breakdown.md` |
| Coordinated execution sequence | `84_mvp_execution_plan.md` |

This plan may reference owned contracts but cannot amend them. A conflict is resolved in the canonical owner or through change control before affected execution continues.

## 3. Execution Principles

* Implement contracts first and dependencies before consumers.
* Deliver small vertical integrations; QA begins with foundations and continues in every wave.
* Establish learner isolation, idempotency, correlation, trace, audit, and observability early.
* Frontend mocks are allowed only against frozen API contracts and must be replaced by real integration before wave exit.
* Keep implementation scope explicit; do not build speculative or future infrastructure.
* A failed gate stops dependent work, not unrelated lanes with satisfied gates.
* Every wave produces reproducible test evidence, not only merged code.
* Documentation/implementation drift is a release blocker.

## 4. Team / Delivery Lanes

| Lane | Responsibility | Authoritative Task Source | Allowed Outputs | Prohibited Ownership |
| --- | --- | --- | --- | --- |
| Product / Architecture Governance | Scope, contract interpretation, change decisions | PRD, SRS, architecture decisions | Gate decisions, approved clarifications | Implementation shortcuts or silent scope change |
| Backend / API | API, persistence, auth, read models | `82_backend_mvp_task_breakdown.md` | Frozen API/data implementations | Frontend behavior; new contracts |
| Runtime / Assessment Engine | State, events, Activity Result, Assessment Result | `82_backend_mvp_task_breakdown.md`, Runtime/Engine contracts | Runtime orchestration and engine integration | AI/frontend-owned results or post-MVP decisions |
| AI Provider / STT / TTS Integration | Provider gateway, speech, transcript, safety, fallback | `82_backend_mvp_task_breakdown.md`, AI contracts | Provider-agnostic adapters and evidence | Official score, result, path, or decision |
| Frontend | Frozen UX, API consumption, accessible state presentation | `81_frontend_mvp_task_breakdown.md`, `70_ui_ux/*` | Screens/components/API wrappers/tests | Business scoring, official events/results, Knowledge Profile, Learning Decision |
| Integration / QA | Contract, integration, boundary, regression evidence | `83_mvp_integration_qa_task_breakdown.md` | Evidence and defect disposition | Redefining acceptance criteria |
| Release / Operations | Environments, configuration, migration/recovery and smoke readiness | Backend/QA tasks and this plan | Release evidence and operational decision input | Undocumented infrastructure or business triggers |

## 5. Execution Gate Model

| Gate | Entry Criteria | Evidence | Owner | Blocking Conditions | Exit Decision |
| --- | --- | --- | --- | --- | --- |
| Documentation | Required sources available | Version/status and consistency review | Product / Architecture | Contradiction, missing canonical contract | Sources accepted for wave |
| Dependency | Document gate passes | Predecessor task completion record | Delivery lanes | Any required predecessor incomplete | Work may start |
| Contract | Relevant API/schema/event/engine/UI/design contract identified | Contract review and fixtures | Owning technical lane + QA | Undocumented field, state, endpoint, entity, event, or behavior | Consumers may integrate |
| Implementation | Tasks meet their own acceptance criteria | Unit/component/repository results | Implementing lane | Failed acceptance criterion | Integration candidate accepted |
| Integration | Real components and fixtures available | Integrated flow trace | Producer, consumer, QA | Mocks remain; boundary or data mismatch | Vertical slice accepted |
| QA Evidence | Required automated/manual runs complete | Reports, logs, screenshots/traces as applicable | QA | Missing, flaky, quarantined, or failed required evidence | Wave evidence accepted |
| Release | All terminal suites and operations checks complete | `QA-TASK-100` report and release checklist | Cross-role go/no-go group | Release blocker or incomplete critical evidence | GO, CONDITIONAL GO, or NO-GO |

## 6. MVP Execution Wave Summary

| Wave | Name | Primary Outcome | Backend Scope | Frontend Scope | QA / Integration Scope | Entry Gate | Exit Gate | Parallelism |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Documentation Freeze and Delivery Readiness | Common frozen baseline | Planning only | Planning only | Traceability review | Documentation | Documentation | All lanes review |
| 1 | Repository, Environment, and Test Foundation | Runnable, observable foundations without public/authenticated layouts | `BE-TASK-001`-`BE-TASK-006` | `FE-TASK-001`-`FE-TASK-006`, `FE-TASK-012`-`FE-TASK-017` | `QA-TASK-001`-`QA-TASK-006` | Dependency | QA Evidence | Backend, frontend primitives, QA |
| 2 | Schema, Fixtures, Auth, and Shared UI Foundation | Deterministic data, learner context, authenticated shell, and fallback support | `BE-TASK-007`-`BE-TASK-022` | `FE-TASK-008`, `FE-TASK-009`, `FE-TASK-011`, `FE-TASK-018`-`FE-TASK-024`, `FE-TASK-079`-`FE-TASK-086` | `QA-TASK-007`-`QA-TASK-013`, `QA-TASK-027`, `QA-TASK-036`-`QA-TASK-044` | Contract | Integration | Schema/auth first; authenticated shell follows `FE-TASK-021` |
| 3 | Public Landing and Authenticated Shell | Public entry, public layout, and safe shell navigation | `BE-TASK-023`, `BE-TASK-024` | `FE-TASK-007`, `FE-TASK-010`, `FE-TASK-025`-`FE-TASK-030` | `QA-TASK-014`, `QA-TASK-026`, `QA-TASK-045` | Contract | Integration | Header before public layout; public API/UI in parallel |
| 4 | Learning Domain and Navigation | Published learning browse flow | `BE-TASK-025`-`BE-TASK-038` | `FE-TASK-031`-`FE-TASK-053` | `QA-TASK-015`-`QA-TASK-021`, `QA-TASK-028`-`QA-TASK-030`, `QA-TASK-046`-`QA-TASK-053` | Dependency | Integration | Domain groups and UI mocks |
| 5 | Runtime and Completion | Idempotent activity completion and non-evaluative result | `BE-TASK-039`-`BE-TASK-053` | `FE-TASK-054` | `QA-TASK-054`-`QA-TASK-067` | Contract | QA Evidence | Runtime primitives then completion |
| 6 | Assessment Result and Progress | Immutable result and read-only progress UI | `BE-TASK-054`-`BE-TASK-066`, `BE-TASK-087`, `BE-TASK-088` | `FE-TASK-055`-`FE-TASK-066` | `QA-TASK-068`-`QA-TASK-076`, `QA-TASK-083`-`QA-TASK-086` | Integration | QA Evidence | Engine and progress UI/read model |
| 7 | Placement Test Specialization | Placement reuses generic assessable flow | `BE-TASK-067`-`BE-TASK-071` | `FE-TASK-101`-`FE-TASK-103`, `FE-TASK-107` | `QA-TASK-034`, `QA-TASK-077`-`QA-TASK-082` | Integration | QA Evidence | Metadata/UI preparation; shared status follows Wave 6 |
| 8 | AI Conversation Practice Text Foundation | Text practice through provider gateway | `BE-TASK-072`-`BE-TASK-075`, `BE-TASK-079`-`BE-TASK-082` | `FE-TASK-067`-`FE-TASK-073`, `FE-TASK-075`-`FE-TASK-078` | `QA-TASK-033`, `QA-TASK-087`, `QA-TASK-088`, `QA-TASK-093` | Contract | Integration | Gateway, UI, safety/fallback |
| 9 | AI Voice, Transcript, and Assessable Practice | Mandatory STT/TTS and engine-owned assessable result | `BE-TASK-076`-`BE-TASK-078`, `BE-TASK-083`-`BE-TASK-086` | `FE-TASK-074`, `FE-TASK-104`-`FE-TASK-106`, reused `FE-TASK-107`, `FE-TASK-108` | `QA-TASK-089`-`QA-TASK-092`, `QA-TASK-094`-`QA-TASK-096` | Integration | QA Evidence | Speech and assessable branches; shared status reused |
| 10 | Cross-Flow Hardening | Safe retries, replay, idempotency, observability, and frontend integration-test consolidation | `BE-TASK-089`-`BE-TASK-093` | `FE-TASK-094`, `FE-TASK-097`-`FE-TASK-099`, `FE-TASK-109`-`FE-TASK-112` | `QA-TASK-097`, `QA-TASK-098` | Integration | QA Evidence | Failure injection and branch-test consolidation |
| 11 | Accessibility, Responsive, Regression, and Release | Release decision evidence | `BE-TASK-094`-`BE-TASK-097` | `FE-TASK-087`-`FE-TASK-093`, `FE-TASK-095`, `FE-TASK-096`, `FE-TASK-100` | `QA-TASK-099`, `QA-TASK-100` | QA Evidence | Release | Verification across all lanes |

## 7. Detailed Execution Waves

### Wave 0 — Documentation Freeze and Delivery Readiness

#### Objective
Confirm the frozen sources, identifiers, boundaries, and ownership used by all lanes.

#### Entry Criteria
All Section 30 sources exist and are available to participating lanes.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Governance / all lanes | `FB-MVP-001`-`FB-MVP-016`; `FE-WS-001`-`FE-WS-016`; `BE-WS-001`-`BE-WS-012`; `QA-WS-001`-`QA-WS-016` | Agreed task graph and escalation route |

#### Permitted Parallel Work
Contract review, environment planning, and evidence-location planning may proceed together.

#### Required Integration Checkpoints
Cross-document IDs and ownership boundaries reconcile without redefining a task.

#### Required Evidence
Source inventory and contradiction log (empty or dispositioned).

#### Exit Criteria
Documentation gate passes and each lane accepts the same canonical contracts.

#### Blocking Conditions
Missing source, orphaned identifier, dependency contradiction, or non-frozen required contract.

#### Explicitly Out of Scope
Code, schema, API, event, screen, or scope changes.

### Wave 1 — Repository, Environment, and Test Foundation

#### Objective
Establish runnable frontend/backend foundations, routing structure, shared design primitives, correlation/trace primitives, and the QA harness. Public/authenticated layouts and route guards are not completed in this wave.

#### Entry Criteria
Wave 0 passes; base repositories and approved environment categories are available.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend | `BE-WS-001`; `BE-TASK-001`-`BE-TASK-006` | Service, envelopes, config, validation, observability primitives |
| Frontend | `FE-WS-001`-`FE-WS-003`; `FE-TASK-001`-`FE-TASK-006`, `FE-TASK-012`-`FE-TASK-017` | App/API/config/error foundation, routing structure, design tokens, typography/layout/base UI and shared focus/responsive primitives |
| QA | `QA-WS-001`; `QA-TASK-001`-`QA-TASK-006` | Harness, environment/base URL, shared envelope/error, correlation/trace, stub-boundary, and deterministic foundation smoke evidence |

#### Permitted Parallel Work
Frontend primitives and QA harness proceed while backend bootstrap is implemented against frozen contracts.

#### Required Integration Checkpoints
Frontend and backend test processes start under the QA harness; frontend API-client base URL resolves to the backend test environment; shared envelope/error and correlation/trace primitives are smoke-verifiable; provider/STT/TTS stub boundaries initialize without provider-specific leakage. No feature endpoint, migrated data, learner session, or screen flow is required.

#### Required Evidence
Deterministic foundation smoke report covering frontend/backend bootstrap, harness coordination, environment/base URL configuration, shared envelope/error primitives, correlation/trace retention, provider/STT/TTS stub-boundary initialization, routing structure, and design/base primitives.

#### Exit Criteria
The allocated dependency-safe foundations start and complete deterministically under the shared harness, and corrected foundation-only `QA-TASK-006` passes without claiming migration, authentication, public landing, feature API, or business-flow readiness; `FE-TASK-007`-`FE-TASK-011` remain pending for Waves 2 and 3.

#### Blocking Conditions
Non-runnable repository, missing safe configuration validation, or unusable QA harness.

#### Explicitly Out of Scope
Domain behavior and provider-specific infrastructure.

### Wave 2 — Schema, Fixtures, Auth, and Shared UI Foundation

#### Objective
Create the frozen MVP schema and deterministic fixtures, then prove session and learner isolation before completing the authenticated layout, route guards, and reusable fallback UI.

#### Entry Criteria
Wave 1 implementation gate passes; database and auth configuration are available.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend | `BE-WS-002`, `BE-WS-003`; `BE-TASK-007`-`BE-TASK-022` | Migrations, seeds, repositories, idempotency, auth/session/isolation |
| Frontend | `FE-WS-002`, `FE-WS-004`, `FE-WS-012`; `FE-TASK-008`, `FE-TASK-009`, `FE-TASK-011`, `FE-TASK-018`-`FE-TASK-024`, `FE-TASK-079`-`FE-TASK-086` | Login/context first; then authenticated layout, guards, fallback routing, and safe shared states |
| QA | `QA-WS-002`, `QA-WS-003`, `QA-WS-005`; `QA-TASK-007`-`QA-TASK-013`, `QA-TASK-027`, `QA-TASK-036`-`QA-TASK-044` | Migration, fixture, auth, negative-path and two-Learner evidence |

#### Permitted Parallel Work
Fallback components and `FE-TASK-011` may proceed from completed Wave 1 primitives. Auth UI may begin against frozen envelopes, but `FE-TASK-008` and `FE-TASK-009` complete only after auth APIs exist and `FE-TASK-021` validates active Learner context.

#### Required Integration Checkpoints
Clean migrate/seed; login/me/logout; `FE-TASK-021` active-Learner validation; then authenticated layout/route guards; expired session; Learner A/B isolation; logout clears learner state.

#### Required Evidence
Schema diff, rollback, deterministic seed, session traces, and isolation report.

#### Exit Criteria
Real auth integration and isolation suites pass; authenticated layout and guards render only after validated Learner context; no frontend mock remains in the auth slice.

#### Blocking Conditions
Schema drift, nondeterministic fixtures, cross-learner exposure, or missing idempotency foundation.

#### Explicitly Out of Scope
Signup, enrollment, advanced identity, roles, OAuth, SSO, MFA, or future tables.

### Wave 3 — Public Landing and Authenticated Application Shell

#### Objective
Complete the Public Header before the public layout, then demonstrate unauthenticated landing and shell-level safe navigation into the authenticated experience.

#### Entry Criteria
Wave 2 auth contract and public fixture dependencies pass.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend | `BE-WS-004`; `BE-TASK-023`, `BE-TASK-024` | Published public landing/highlight reads |
| Frontend | `FE-WS-002`, `FE-WS-005`; `FE-TASK-007`, `FE-TASK-010`, `FE-TASK-025`-`FE-TASK-030` | Public Header, public layout, safe navigation, and UX-001 to UX-003 transition |
| QA | `QA-TASK-014`, `QA-TASK-026`, `QA-TASK-045` | Public contract, integration, fallback evidence |

#### Permitted Parallel Work
`FE-TASK-026` may proceed with the public APIs and landing content; `FE-TASK-007` completes only after `FE-TASK-026`. `FE-TASK-010` may complete from the Wave 1 routing foundation while destinations use available frozen shell contracts.

#### Required Integration Checkpoints
Public Header precedes public layout; public APIs require no learner session; landing exposes no learner data; safe navigation and the CTA reach documented destinations/login.

#### Required Evidence
Public API contract run and landing success/loading/empty/error/fallback integration record.

#### Exit Criteria
`FE-TASK-007`, `FE-TASK-010`, and the Public Landing Slice pass with real APIs and the Wave 2 authenticated-shell handoff.

#### Blocking Conditions
Authentication required for public reads, learner data leakage, or broken login handoff.

#### Explicitly Out of Scope
Public signup or enrollment.

### Wave 4 — Learning Program, Subject, Module, and Content Navigation

#### Objective
Deliver published learning discovery and navigation to a loadable activity.

#### Entry Criteria
Wave 2 learner context passes; Wave 3 shell is integrated; Published fixtures exist.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend | `BE-WS-004`; `BE-TASK-025`-`BE-TASK-038` | Frozen learning-domain APIs |
| Frontend | `FE-WS-006`-`FE-WS-008`; `FE-TASK-031`-`FE-TASK-053` | UX-003 to UX-006 browse/navigation flow |
| QA | `QA-WS-003`, `QA-WS-004`, `QA-WS-006`; `QA-TASK-015`-`QA-TASK-021`, `QA-TASK-028`-`QA-TASK-030`, `QA-TASK-046`-`QA-TASK-053` | Contract, integration, negative-path evidence |

#### Permitted Parallel Work
Program, structure/module, content/objective, and activity API groups may proceed independently after repositories/auth; frontend screens may use matching contract fixtures.

#### Required Integration Checkpoints
Manual program selection, program detail/module list, content/objective rendering, and activity navigation use real APIs.

#### Required Evidence
API contract reports plus Program/Subject and Program Detail/Module/Activity slice demonstrations.

#### Exit Criteria
Learner reaches UX-006 using Published data with empty/error/isolation paths passing.

#### Blocking Conditions
Undocumented fields, adaptive selection, non-Published leakage, or unresolved domain contract failure.

#### Explicitly Out of Scope
Authoring UI, enrollment, recommendation, mastery, or adaptive sequencing.

### Wave 5 — Learning Activity Runtime and Completion

#### Objective
Complete an activity through Runtime and persist one non-evaluative Activity Result with correct state/event order.

#### Entry Criteria
Wave 4 activity reads pass; idempotency and Runtime schema are verified.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Runtime / Backend | `BE-WS-005`, `BE-WS-006`; `BE-TASK-039`-`BE-TASK-053` | Runtime state/events, completion, Activity Result, replay safety |
| Frontend | `FE-WS-009`; `FE-TASK-054` | Explicit guarded completion |
| QA | `QA-WS-007`, `QA-WS-008`; `QA-TASK-054`-`QA-TASK-067` | State, event order, ownership, duplicate prevention evidence |

#### Permitted Parallel Work
State/event repositories and frontend completion states proceed in parallel; completion orchestration waits for publisher validation and idempotency.

#### Required Integration Checkpoints
Start, complete, retry, duplicate submit, Activity Result read, and event/state trace.

#### Required Evidence
Database/event diff proving one Activity Result and one authorized official event sequence.

#### Exit Criteria
Learning Activity Completion Slice passes and Runtime owns all side effects.

#### Blocking Conditions
Duplicate result/event, frontend-created result/event, evaluative Activity Result, or invalid transition.

#### Explicitly Out of Scope
Frontend scoring and Assessment Result creation.

### Wave 6 — Assessment Engine, Assessment Result, and Progress

#### Objective
Produce an immutable backend-owned Assessment Result and expose read-only result/progress views.

#### Entry Criteria
Wave 5 canonical completion and Activity Result evidence pass.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Runtime / Engine / Backend | `BE-WS-007`, `BE-WS-010`; `BE-TASK-054`-`BE-TASK-066`, `BE-TASK-087`, `BE-TASK-088` | Blueprint, engine execution, immutable result, progress reads |
| Frontend | `FE-WS-009`, `FE-WS-010`; `FE-TASK-055`-`FE-TASK-066` | UX-008 and UX-009 read-only views |
| QA | `QA-WS-009`, `QA-WS-011`; `QA-TASK-068`-`QA-TASK-076`, `QA-TASK-083`-`QA-TASK-086` | Engine/result/progress ownership and isolation evidence |

#### Permitted Parallel Work
Read-only result UI uses contract fixtures while engine execution is built; progress aggregation begins after result repositories stabilize.

#### Required Integration Checkpoints
Runtime-mediated assessment, pending/ready/failed presentation, immutable result reads, basic progress aggregation.

#### Required Evidence
Engine determinism, event trace, immutability, AssessmentFailed observability, and dashboard isolation reports.

#### Exit Criteria
Assessment Result and Basic Progress Dashboard slices pass with real data.

#### Blocking Conditions
Non-engine result writer, mutable result, frontend outcome calculation, or Knowledge Profile/Learning Decision dependency.

#### Explicitly Out of Scope
Mastery UI, adaptive recommendation, advanced analytics, Knowledge Profile, and Learning Decision.

### Wave 7 — Placement Test Specialization

#### Objective
Prove Placement is metadata-driven reuse of the generic assessable activity flow.

#### Entry Criteria
Waves 5 and 6 pass; Placement fixtures use frozen generic entities.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend / Runtime / Engine | `BE-WS-008`; `BE-TASK-067`-`BE-TASK-071` | `purpose = Placement` discovery/start/completion reuse |
| Frontend | `FE-WS-015`, `FE-WS-016`; `FE-TASK-101`-`FE-TASK-103`, `FE-TASK-107` | UX-011 and shared CMP-028 submission states using CMP-029, then UX-008 |
| QA | `QA-WS-010`; `QA-TASK-034`, `QA-TASK-077`-`QA-TASK-082` | Placement boundary and E2E evidence |

#### Permitted Parallel Work
Placement metadata discovery and UX-011 states proceed once generic contracts are frozen.

#### Required Integration Checkpoints
Discovery, start, progress, submit, pending/ready/failure/retry, and read-only result.

#### Required Evidence
Schema/API/event diff proving no placement-specific resource, table, engine, result owner, or event.

#### Exit Criteria
Placement Test Slice and `QA-TASK-077`-`QA-TASK-082` pass exclusively through generic activity/assessment contracts. Frontend mock-based integration-test hardening in `FE-TASK-111` remains for Wave 10 and is not required to prove this real integrated flow.

#### Blocking Conditions
Placement-specific architecture or Learning Decision/adaptive path behavior.

#### Explicitly Out of Scope
Placement Engine, placement entity/API family, Knowledge Profile, or adaptive starting path.

### Wave 8 — AI Conversation Practice Text Foundation

#### Objective
Deliver provider-gateway text conversation with safe fallback and no official outcome ownership.

#### Entry Criteria
Wave 4 learning activity context passes; provider configuration/stub satisfies the frozen abstraction.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| AI / Backend | `BE-WS-009`; `BE-TASK-072`-`BE-TASK-075`, `BE-TASK-079`-`BE-TASK-082` | Conversation start/text/read, gateway, safety, fallback |
| Frontend | `FE-WS-011`; `FE-TASK-067`-`FE-TASK-073`, `FE-TASK-075`-`FE-TASK-078` | UX-007 text conversation and unavailable/safe states |
| QA | `QA-WS-004`, `QA-WS-012`; `QA-TASK-033`, `QA-TASK-087`, `QA-TASK-088`, `QA-TASK-093` | Text/provider/failure/authority evidence |

#### Permitted Parallel Work
Gateway/stub, conversation UI, and safety/fallback tests proceed against frozen message contracts.

#### Required Integration Checkpoints
Start, send, canonical history read, provider failure, safety handling, and text fallback.

#### Required Evidence
Provider gateway trace with secrets suppressed and AI authority-boundary assertions.

#### Exit Criteria
AI Conversation Practice Text Slice passes with real adapter or approved integration stub.

#### Blocking Conditions
Direct provider call from UI, provider schema leakage, unsafe failure, or AI-owned official output.

#### Explicitly Out of Scope
AI score, Assessment Result, Learning Decision, path control, or direct official event publication.

### Wave 9 — AI Voice, STT/TTS, Transcript, and Assessable Practice

#### Objective
Complete mandatory voice/transcript/playback and assessable evidence through Runtime and Assessment Engine.

#### Entry Criteria
Wave 8 text/fallback passes; Waves 5 and 6 assessment path passes.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| AI / Backend / Engine | `BE-WS-009`; `BE-TASK-076`-`BE-TASK-078`, `BE-TASK-083`-`BE-TASK-086` | STT, canonical transcript, TTS, Normal/Assessable completion/evidence |
| Frontend | `FE-WS-011`, `FE-WS-016`; `FE-TASK-074`, `FE-TASK-104`-`FE-TASK-106`, reused `FE-TASK-107`, `FE-TASK-108` | Voice controls, transcript, playback, and assessable states using the completed shared status component |
| QA | `QA-WS-012`; `QA-TASK-089`-`QA-TASK-092`, `QA-TASK-094`-`QA-TASK-096` | Voice, transcript, TTS, completion, evidence, event evidence |

#### Permitted Parallel Work
STT and TTS adapters, accessible voice UI, and evidence fixtures proceed in parallel; assessable completion reuses completed `FE-TASK-107` and waits for canonical transcript and engine integration.

#### Required Integration Checkpoints
Permission/recording, STT failure/text fallback, canonical transcript, TTS/playback/replay, Normal return, Assessable result.

#### Required Evidence
Provider/STT/TTS traces, transcript identity proof, failure videos/logs, and engine-owned result/event trace.

#### Exit Criteria
AI Voice, Normal Practice, and Assessable AI Practice slices pass through `QA-TASK-089`-`QA-TASK-096`. Frontend integration-test consolidation in `FE-TASK-112` remains for Wave 10.

#### Blocking Conditions
Missing mandatory STT/TTS, noncanonical transcript, no text fallback, duplicate evidence/result, or AI-owned official score/result.

#### Explicitly Out of Scope
Provider-specific architecture and AI-owned learning decisions.

### Wave 10 — Cross-Flow Hardening, Retry, Replay, Idempotency, and Observability

#### Objective
Prove cross-flow recovery and observability without changing business semantics.

#### Entry Criteria
All critical vertical slices have integrated candidates and fault injection is available.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend / Runtime / AI | `BE-WS-011`; `BE-TASK-089`-`BE-TASK-093` | Endpoint/Runtime/provider observability and retry/replay hardening |
| Frontend | `FE-WS-014`-`FE-WS-016`; `FE-TASK-094`, `FE-TASK-097`-`FE-TASK-099`, `FE-TASK-109`-`FE-TASK-112` | Utility/mock/isolation/session/security hardening plus Placement and AI integration-test consolidation |
| QA | `QA-WS-013`, `QA-WS-014`; `QA-TASK-097`, `QA-TASK-098` | Failure-injection and observability/security evidence |

#### Permitted Parallel Work
`FE-TASK-097` and `FE-TASK-098` complete before dependent `FE-TASK-111` and `FE-TASK-112`; fault injection can run per completed slice, and failures stop only the affected dependency branch.

#### Required Integration Checkpoints
Duplicate requests/events, stale/conflicting idempotency, retries, rollback, provider failures, correlation/trace/audit/security records.

#### Required Evidence
Database/event before-after diff, trace continuity, audit/security report, and no-secret/no-learner-leak checks.

#### Exit Criteria
`QA-TASK-097` and `QA-TASK-098` pass without semantic drift, and `FE-TASK-111`/`FE-TASK-112` consolidate the already proven Placement and AI branches after their mock/fallback prerequisites.

#### Blocking Conditions
Duplicate result/event, infinite retry, secret/internal exposure, observability used as a business trigger, or isolation failure.

#### Explicitly Out of Scope
Broker guarantees, new retention policy, or new business events.

### Wave 11 — Accessibility, Responsive, Regression, and Release Readiness

#### Objective
Consolidate backend/frontend verification and objective release evidence.

#### Entry Criteria
Waves 1-10 exit; terminal suites and release-candidate environment are available.

#### Included Existing Tasks
| Lane | Existing Workstreams / Tasks | Expected Output |
| --- | --- | --- |
| Backend | `BE-WS-012`; `BE-TASK-094`-`BE-TASK-097` | API, DB, event, backend E2E verification |
| Frontend | `FE-WS-013`, `FE-WS-014`; `FE-TASK-087`-`FE-TASK-093`, `FE-TASK-095`, `FE-TASK-096`, `FE-TASK-100` | Component/flow/accessibility/responsive/readiness evidence |
| QA / Release | `QA-WS-015`, `QA-WS-016`; `QA-TASK-099`, `QA-TASK-100` | Final regression and go/no-go package |

#### Permitted Parallel Work
Backend verification, frontend accessibility/responsive verification, and operations readiness run concurrently before final regression.

#### Required Integration Checkpoints
All vertical slices defined in Section 11 (12 total), migrations, rollback/recovery, responsive/accessibility, security, AI fallbacks, and release smoke.

#### Required Evidence
All Section 18 categories and the complete `QA-TASK-100` release report.

#### Exit Criteria
Release gate produces GO; all task acceptance criteria and handoffs are complete.

#### Blocking Conditions
Any Section 19 release blocker, missing terminal evidence, documentation drift, or incomplete critical slice.

#### Explicitly Out of Scope
Waiving architecture boundaries or pulling future/blocked work into MVP.

## 8. Parallel Execution Matrix

| Wave | Product / Governance | Backend | Runtime / Engine | AI Integration | Frontend | QA | Release / Ops |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Active | Supporting | Supporting | Supporting | Supporting | Verification | Supporting |
| 1 | Supporting | Active | Supporting | Supporting | Active | Active | Active |
| 2 | Supporting | Active | Supporting | Supporting | Active | Active | Supporting |
| 3 | Supporting | Active | Not required | Not required | Active | Active | Supporting |
| 4 | Supporting | Active | Supporting | Not required | Active | Active | Supporting |
| 5 | Supporting | Active | Active | Not required | Active | Active | Supporting |
| 6 | Supporting | Active | Active | Not required | Active | Active | Supporting |
| 7 | Verification | Active | Active | Not required | Active | Active | Supporting |
| 8 | Verification | Active | Supporting | Active | Active | Active | Supporting |
| 9 | Verification | Active | Active | Active | Active | Active | Supporting |
| 10 | Supporting | Active | Active | Active | Active | Active | Active |
| 11 | Verification | Verification | Verification | Verification | Verification | Active | Active |

## 9. Dependency and Handoff Matrix

| Producer | Deliverable / Contract | Consumer | Required Before | Evidence |
| --- | --- | --- | --- | --- |
| Design System (`76_design_system.md`) | Theme tokens and asset rules | Frontend | Component implementation starts | Token/asset review |
| Backend foundation | Envelopes, correlation, config | Frontend, QA | API integration | Contract smoke |
| Schema/migrations | Frozen tables and constraints | Repositories, QA fixtures | Domain implementation | Clean migrate/schema diff |
| Seed loader | Published and two-Learner fixtures | Frontend, QA | Integrated slices | Deterministic seed run |
| Auth/session API | Login/logout/me and learner context | Route guards, isolation QA | Private screens | Auth/isolation report |
| Public APIs | Landing configuration/highlights | UX-001 | Public slice exit | API/UI trace |
| Learning APIs | Program/structure/module/content/activity reads | UX-003-UX-006 | Navigation slice exit | Contract + E2E |
| Runtime completion | Activity completion and Activity Result | Assessment Engine, frontend | Assessment execution | Event/DB trace |
| Assessment Engine/API | Immutable Assessment Result | UX-008 | Result slice exit | Engine/result evidence |
| Progress read model | Basic read-only progress | UX-009 | Dashboard exit | Isolation/aggregation evidence |
| AI provider gateway | Provider-agnostic conversation operations | UX-007, QA | AI text exit | Gateway trace |
| STT | Canonical transcript | Transcript UI, evidence flow | Voice/assessable exit | Transcript identity test |
| TTS | Playback output | Playback UI | Voice exit | Playback/replay test |
| AI evidence submission | Approved evidence | Runtime/Assessment Engine | Assessable AI exit | Ownership/event trace |
| Observability primitives | Correlation/trace/audit/provider metadata | QA | Hardening/release | Trace and security report |
| QA | Release evidence | Go/no-go participants | Release decision | `QA-TASK-100` report |

## 10. Critical Path

The MVP critical path is a shared trunk with two required branches that merge into one release tail; it is not a single linear task range.

### Shared Trunk

Platform foundation (`BE-TASK-001`-`BE-TASK-006`) enables schema, deterministic fixtures, repositories, and idempotency (`BE-TASK-007`-`BE-TASK-016`), followed by authentication and Learner isolation (`BE-TASK-017`-`BE-TASK-022`). The trunk then covers the learning-domain read path, corresponding frontend browse/activity integration, Runtime completion, one non-evaluative Activity Result, Assessment Engine execution, one immutable Assessment Result, and QA integration evidence through `BE-TASK-025`-`BE-TASK-066`, the applicable `FE-TASK-018`-`FE-TASK-066`, and `QA-TASK-013`-`QA-TASK-076`.

### Required Placement Branch

After the generic activity/assessment trunk passes, Placement requires `BE-TASK-067`-`BE-TASK-071`, `FE-TASK-101`-`FE-TASK-103`, shared `FE-TASK-107`, and `QA-TASK-077`-`QA-TASK-082`. This branch is required MVP work, not optional side work.

### Required AI Branch

After the learning-activity and assessment trunk is available, AI Practice requires text conversation, provider gateway, safety/fallback, mandatory voice, STT, canonical transcript, TTS/playback, Normal Practice completion, Assessable Practice evidence, and Assessment Engine integration through `BE-TASK-072`-`BE-TASK-086`, `FE-TASK-067`-`FE-TASK-078`, `FE-TASK-104`-`FE-TASK-108`, and `QA-TASK-087`-`QA-TASK-096`. This branch is also required MVP work.

### Merge and Release Tail

Each required branch must pass its own implementation and QA gate before joining the release tail. The merged tail covers cross-flow retry/replay/idempotency/observability, frontend hardening and integration-test consolidation including `FE-TASK-111` and `FE-TASK-112`, accessibility/responsive verification, terminal regression, `QA-TASK-097`-`QA-TASK-100`, and the GO decision. Release cannot proceed while either Placement or AI is incomplete.

Critical gates are clean migration/seed, Learner isolation, Runtime event/result idempotency, engine-owned immutable result, real frontend integration, each required branch gate, terminal regression, and release evidence. Choke points are completion-to-engine handoff, canonical event order, result immutability/read availability, provider/STT/TTS fallback, and shared fixtures. Mitigation uses early contract fixtures, trace propagation, deterministic seeds, fault injection, and vertical integration without changing frozen contracts. Public landing, design primitives, the QA harness, provider stubs, accessibility foundations, and observability primitives may proceed in parallel where their own dependency gates pass.

## 11. Vertical Slice Strategy

| Slice | Backend / Runtime Tasks | Frontend Tasks | QA Tasks | Demonstrable Outcome |
| --- | --- | --- | --- | --- |
| Public Landing | `BE-TASK-023`, `BE-TASK-024` | `FE-TASK-007`, `FE-TASK-010`, `FE-TASK-025`-`FE-TASK-030` | `QA-TASK-014`, `QA-TASK-026`, `QA-TASK-045` | UX-001 loads/falls back and reaches login |
| Login and Learner Context | `BE-TASK-017`-`BE-TASK-022` | `FE-TASK-008`, `FE-TASK-009`, `FE-TASK-018`-`FE-TASK-024`, later hardening `FE-TASK-109` | `QA-TASK-013`, `QA-TASK-027`, `QA-TASK-036`-`QA-TASK-044` | Session gates private UI and isolates two learners |
| Program / Subject Selection | `BE-TASK-025`, `BE-TASK-026` | `FE-TASK-031`-`FE-TASK-036` | `QA-TASK-015`, `QA-TASK-028`, `QA-TASK-046` | Learner manually selects a Published program |
| Program Detail / Module / Activity Navigation | `BE-TASK-027`-`BE-TASK-038` | `FE-TASK-037`-`FE-TASK-053` | `QA-TASK-016`-`QA-TASK-021`, `QA-TASK-029`, `QA-TASK-030`, `QA-TASK-047`-`QA-TASK-053` | Learner navigates to content/activity |
| Learning Activity Completion | `BE-TASK-039`-`BE-TASK-053` | `FE-TASK-054` | `QA-TASK-054`-`QA-TASK-067` | One completion creates one non-evaluative Activity Result |
| Assessment Result | `BE-TASK-054`-`BE-TASK-066` | `FE-TASK-055`-`FE-TASK-059` | `QA-TASK-068`-`QA-TASK-076` | Engine produces immutable read-only result |
| Basic Progress Dashboard | `BE-TASK-052`, `BE-TASK-065`, `BE-TASK-087`, `BE-TASK-088` | `FE-TASK-060`-`FE-TASK-066` | `QA-TASK-032`, `QA-TASK-083`-`QA-TASK-086` | Learner views isolated basic progress |
| Placement Test | `BE-TASK-067`-`BE-TASK-071` | Wave 7: `FE-TASK-101`-`FE-TASK-103`, `FE-TASK-107`; Wave 10 test hardening: `FE-TASK-111` | `QA-TASK-034`, `QA-TASK-077`-`QA-TASK-082` | UX-011 reuses generic assessment flow |
| AI Conversation Practice Text | `BE-TASK-072`-`BE-TASK-075`, `BE-TASK-079`-`BE-TASK-082` | `FE-TASK-067`-`FE-TASK-073`, `FE-TASK-075`-`FE-TASK-078` | `QA-TASK-033`, `QA-TASK-087`, `QA-TASK-088`, `QA-TASK-093` | Safe text practice with fallback |
| AI Voice / STT / TTS | `BE-TASK-076`-`BE-TASK-078` | Wave 9: `FE-TASK-104`-`FE-TASK-106`; Wave 10 test hardening: `FE-TASK-112` | `QA-TASK-089`-`QA-TASK-092` | Voice becomes canonical transcript and replayable audio |
| Assessable AI Practice | `BE-TASK-083`-`BE-TASK-086` | Wave 9: `FE-TASK-074`, reused `FE-TASK-107`, `FE-TASK-108`; Wave 10 test hardening: `FE-TASK-112` | `QA-TASK-094`-`QA-TASK-096` | Evidence reaches engine-owned result flow |
| Error / Recovery / Accessibility | `BE-TASK-089`-`BE-TASK-097` | `FE-TASK-079`-`FE-TASK-100`, `FE-TASK-109`, `FE-TASK-110` | `QA-TASK-097`-`QA-TASK-100` | All core flows recover accessibly and release evidence passes |

## 12. Environment and Configuration Plan

| Environment | Purpose / Data | Secrets and Provider Behavior | Migration / Seed | Logging / Release Restriction |
| --- | --- | --- | --- | --- |
| Local development | Developer work; synthetic data only | Local safe config; approved stubs allowed | Clean migrate; deterministic development fixtures | Structured local traces; never treated as release evidence alone |
| Automated test | Repeatable isolated tests | Test-only secrets; deterministic provider/STT/TTS stubs | Fresh/isolated migrate and reset | Captured machine-readable results; no production data |
| Integration | Cross-lane real integration | Managed non-production config; real sandbox or approved integration stubs | Versioned migrations and two-Learner/feature fixtures | Correlated traces; mocks cannot satisfy wave exit |
| Release candidate / staging | Production-like release verification | Release-like secret categories and approved provider sandbox/config | Release migration rehearsal; controlled seed only | Full monitoring and smoke; release gate required |
| Production | MVP operation | Production secrets through approved mechanism; configured provider adapters | Forward versioned migrations; no destructive reset or test seeds | Monitoring/audit enabled; only GO authorizes release |

Provider, hosting, CI, database, auth, and monitoring vendor selection remains an implementation configuration decision unless a frozen source already selects it.

## 13. Database Migration and Seed Execution Order

| Order | Tasks | Output / Verification |
| --- | --- | --- |
| 1 | `BE-TASK-007` | Foundation/identity/audit/idempotency tables |
| 2 | `BE-TASK-008` | Learning-domain tables |
| 3 | `BE-TASK-009` | Runtime, Activity Result, Assessment Result tables |
| 4 | `BE-TASK-010` | AI Practice tables |
| 5 | `BE-TASK-011` | Clean migration and safe rollback |
| 6 | `BE-TASK-012`, `BE-TASK-013` | Deterministic Published and two-Learner fixtures |
| 7 | `QA-TASK-007`-`QA-TASK-012` | Migration, constraint, seed/reset evidence |

Placement and AI Practice fixtures must reuse the frozen generic/AI schemas. No future tables may be created. Schema drift blocks dependent waves. Production destructive reset is prohibited; when rollback is unsafe, use the approved forward-fix process.

## 14. API and Contract Integration Strategy

`62_api_spec.md` is authoritative. Frontend wrappers remain centralized; contract fixtures/mocks must reproduce documented envelopes, auth, errors, pagination, idempotency, correlation, and trace metadata. Real backend integration is mandatory before the integration gate. Undocumented fields cannot become dependencies, and frontend cannot derive official learning outcomes.

| API Group | Frozen Endpoint Surface | Backend Tasks | Consumer / Contract Evidence |
| --- | --- | --- | --- |
| Public | `GET /api/v1/public/landing-page`; `GET /api/v1/public/program-highlights` | `BE-TASK-023`, `BE-TASK-024` | `FE-TASK-028`, `FE-TASK-029`; `QA-TASK-014`, `QA-TASK-026` |
| Authentication | `POST /api/v1/auth/login`; `POST /api/v1/auth/logout`; `GET /api/v1/auth/me` | `BE-TASK-018`-`BE-TASK-020` | `FE-TASK-020`-`FE-TASK-022`; `QA-TASK-013`, `QA-TASK-036`-`QA-TASK-040` |
| Learning domain | Frozen `/api/v1/learning-programs`, program-structure, learning-modules, learning-designs, learning-objectives, learning-contents, and learning-activities operations | `BE-TASK-025`-`BE-TASK-038` | `FE-TASK-031`-`FE-TASK-053`; `QA-TASK-015`-`QA-TASK-021`, `QA-TASK-028`-`QA-TASK-030` |
| Completion / Activity Result | Frozen activity start/complete and Activity Result reads | `BE-TASK-044`, `BE-TASK-046`-`BE-TASK-053` | `FE-TASK-048`, `FE-TASK-052`, `FE-TASK-054`; `QA-TASK-054`-`QA-TASK-067` |
| Assessment Result | Frozen Assessment Blueprint and Assessment Result operations | `BE-TASK-054`-`BE-TASK-066` | `FE-TASK-055`-`FE-TASK-059`; `QA-TASK-068`-`QA-TASK-076` |
| Progress | Frozen Activity Result/Assessment Result reads and progress read model | `BE-TASK-052`, `BE-TASK-065`, `BE-TASK-087`, `BE-TASK-088` | `FE-TASK-060`-`FE-TASK-066`; `QA-TASK-083`-`QA-TASK-086` |
| Placement | Generic learning-activity query/start/complete and Assessment Result reads | `BE-TASK-067`-`BE-TASK-071` | Wave 7: `FE-TASK-101`-`FE-TASK-103`, `FE-TASK-107`; Wave 10: `FE-TASK-111`; `QA-TASK-077`-`QA-TASK-082` |
| AI Practice | `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`; `POST /api/v1/ai-conversations/{conversationId}/messages`; `GET /api/v1/ai-conversations/{conversationId}`; `POST /api/v1/ai-conversations/{conversationId}/complete` | `BE-TASK-072`-`BE-TASK-086` | Wave 8-9: `FE-TASK-067`-`FE-TASK-078`, `FE-TASK-104`-`FE-TASK-108`; Wave 10: `FE-TASK-112`; `QA-TASK-087`-`QA-TASK-096` |

STT, TTS, canonical transcript, playback, and evidence behavior remain inside the frozen AI Practice contracts; this plan does not invent separate endpoints.

## 15. Runtime, Event, and Assessment Execution Rules

Runtime alone orchestrates state and persists non-evaluative Activity Result. Official publishers/consumers follow `21_event_model.md` and `65_event_contracts.md`; idempotency precedes engine-triggering operations. Assessment Engine alone produces immutable Assessment Result. `AssessmentFailed` is observability-only. MVP stops at `AssessmentResultGenerated`; retry/replay cannot duplicate official results/events. Frontend observes API-visible state only.

| Flow | Trigger | Runtime / Event Expectation | Result Owner | Required QA Evidence |
| --- | --- | --- | --- | --- |
| Activity start | Frozen start API | Valid Runtime transition; no frontend event publication | Runtime state owner | `QA-TASK-054`, `QA-TASK-055` |
| Activity completion | Frozen complete API | `LearningActivityCompleted` in canonical order | Runtime | `QA-TASK-056`-`QA-TASK-061` |
| Activity Result generation | Valid completion | One `ActivityResultGenerated`; non-evaluative immutable record | Runtime | `QA-TASK-062`-`QA-TASK-067` |
| Assessment execution | Runtime-mediated eligible input | `AssessmentStarted`, then engine execution | Assessment Engine | `QA-TASK-068`-`QA-TASK-071` |
| Assessment Result generation | Successful evaluation | `AssessmentCompleted`, then `AssessmentResultGenerated` | Assessment Engine | `QA-TASK-072`-`QA-TASK-076` |
| Assessment failure | Failed evaluation | `AssessmentFailed` record is observability-only | No result produced by failure record | `QA-TASK-074`, `QA-TASK-075`, `QA-TASK-098` |
| Placement completion | Generic completion with `purpose = Placement` | Same activity/assessment sequence | Runtime / Assessment Engine | `QA-TASK-077`-`QA-TASK-082` |
| Assessable AI completion | Approved evidence submission | Runtime-mediated generic assessment sequence | Assessment Engine | `QA-TASK-094`-`QA-TASK-096` |

## 16. AI Conversation Practice Execution Strategy

| Increment | Existing Tasks | Entry Dependency | Fallback / Evidence | Exit Gate |
| --- | --- | --- | --- | --- |
| Provider gateway/stub | `BE-TASK-073`, `BE-TASK-074`; `QA-TASK-088` | Wave 1 config/trace | Provider-agnostic stub/sandbox; trace without secrets | Contract |
| Text conversation | `BE-TASK-072`, `BE-TASK-075`; `FE-TASK-067`-`FE-TASK-073`; `QA-TASK-087` | Learning activity context | Text history/message evidence | Integration |
| Safety and fallback | `BE-TASK-080`, `BE-TASK-081`; `FE-TASK-075`-`FE-TASK-078`; `QA-TASK-093` | Gateway/text | Safe learner error and usable text path | QA Evidence |
| Voice recording | `FE-TASK-104`; `QA-TASK-089` | Accessible UX-007 | Permission/error fallback to text | QA Evidence |
| STT/canonical transcript | `BE-TASK-076`, `BE-TASK-077`; `FE-TASK-105`; `QA-TASK-090` | Voice/provider | Transcript identity and edit/display contract | QA Evidence |
| TTS/playback/replay | `BE-TASK-078`; `FE-TASK-106`; `QA-TASK-091`, `QA-TASK-092` | Canonical message/transcript | Text remains available on failure | QA Evidence |
| Normal completion | `BE-TASK-083`; `FE-TASK-074`; `QA-TASK-094` | Text/voice paths | Return to activity; no official score | Integration |
| Assessable evidence | `BE-TASK-084`; reused `FE-TASK-107`; `QA-TASK-095` | Wave 7 shared status plus canonical transcript/evidence | Approved evidence only | Contract |
| Engine integration | `BE-TASK-085`, `BE-TASK-086`; `FE-TASK-108`; `QA-TASK-096` | Wave 6 engine | Engine-owned result/event trace | QA Evidence |
| Integration-test consolidation | `FE-TASK-097`, `FE-TASK-098`, `FE-TASK-112` | Wave 9 implementation and QA branch passed | Voice, fallback, Normal, and Assessable frontend integration tests | Implementation |
| Observability/retry | `BE-TASK-090`-`BE-TASK-093`; `FE-TASK-110`; `QA-TASK-097`, `QA-TASK-098` | Integrated AI slices | Bounded retry, no duplicates/secrets | QA Evidence |

STT/TTS are mandatory where frozen, with canonical transcript and text fallback. AI remains provider-agnostic and experience-layer only; it cannot own official score, Assessment Result, Learning Decision, or learning path.

## 17. Placement Test Execution Strategy

Placement is a specialized assessable Learning Activity selected by metadata `purpose = Placement`. `BE-TASK-067`-`BE-TASK-071` reuse Learning Activity, Activity Result, Assessment Blueprint, Assessment Engine, and Assessment Result. In Wave 7, `FE-TASK-101`-`FE-TASK-103` and shared `FE-TASK-107` implement UX-011 with CMP-028 and CMP-029 and hand off to read-only UX-008/CMP-016; `QA-TASK-034` and `QA-TASK-077`-`QA-TASK-082` prove the real integrated reuse. In Wave 10, `FE-TASK-111` adds mock-based frontend integration-test hardening after `FE-TASK-097`; it does not gate the Wave 7 real-flow proof. No placement-specific resource family, entity, table, engine, result owner, official event, Learning Decision, or adaptive path is permitted.

## 18. Testing and Evidence Strategy

| Evidence ID / Category | Produced By | Related Task IDs | Stored Artifact | Required Gate |
| --- | --- | --- | --- | --- |
| Foundation integration smoke | Frontend/backend/QA | `QA-TASK-001`-`QA-TASK-006` | Deterministic foundation smoke report | QA Evidence |
| Unit/component | Frontend/backend lanes | `FE-TASK-094`, `FE-TASK-095`; task-level backend tests | Test report | Implementation |
| API contract | Backend/QA | `BE-TASK-094`; `QA-TASK-013`-`QA-TASK-025` | Contract report | Contract |
| Repository/database | Backend/QA | `BE-TASK-095`; `QA-TASK-007`-`QA-TASK-012` | DB/schema report | Dependency |
| Migration/rollback | Backend/QA/Ops | `BE-TASK-011`; `QA-TASK-007`-`QA-TASK-012` | Migration log/schema diff | Dependency/Release |
| Runtime/event | Runtime/QA | `BE-TASK-096`; `QA-TASK-054`-`QA-TASK-061` | Ordered event/state trace | Integration |
| Engine/result | Engine/QA | `QA-TASK-068`-`QA-TASK-076` | Determinism/immutability report | Integration |
| Integrated E2E | All delivery lanes | `FE-TASK-096`, `FE-TASK-111`, `FE-TASK-112`; `BE-TASK-097`; `QA-TASK-026`-`QA-TASK-100` | E2E results and traces | QA Evidence |
| Accessibility/responsive | Frontend/QA | `FE-TASK-087`-`FE-TASK-093`; `QA-TASK-099` | Audit and screenshots/video | Release |
| Security/isolation | Backend/frontend/QA | `BE-TASK-022`; `FE-TASK-099`; `QA-TASK-036`-`QA-TASK-044`, `QA-TASK-098` | Isolation/security report | Release |
| Idempotency/retry/replay | Backend/QA | `BE-TASK-016`, `BE-TASK-092`, `BE-TASK-093`; `QA-TASK-097` | Fault-injection/event/DB diff | Release |
| Provider/STT/TTS | AI/QA | `BE-TASK-072`-`BE-TASK-086`; `QA-TASK-087`-`QA-TASK-096` | Stub/sandbox logs and media evidence | QA Evidence |
| Regression/release smoke | QA/Ops | `QA-TASK-100` | Final report/checklist | Release |

## 19. Quality and Release Severity Rules

* **Critical:** always blocks release.
* **High:** blocks release unless formally accepted through change control and acceptance/architecture remain intact.
* **Medium:** non-blocking only when frozen acceptance criteria and critical flows remain satisfied.
* **Low:** editorial/polish issue with no contract or flow impact.

Architecture-boundary failures always block release: cross-learner leakage; frontend scoring/result/event ownership; duplicate Activity Result, Assessment Result, or Official Runtime Event; Assessment Result mutation; unauthorized exposure; secret/provider-internal leakage; AI gateway bypass; Placement-specific architecture; Knowledge Profile/Learning Decision in MVP Runtime; inaccessible core completion; missing mandatory voice/text fallback; or migration failure.

## 20. Definition of Ready by Wave

| Wave | Definition of Ready |
| --- | --- |
| 0 | All canonical sources exist and ownership is understood. |
| 1 | Repositories and safe base environment/config are available; only dependency-safe foundation and primitive tasks are admitted. |
| 2 | Wave 1 foundations pass; schema/auth/UI contracts and test database exist; authenticated shell waits for `FE-TASK-021`. |
| 3 | Wave 2 authenticated shell passes; public fixtures/contracts exist; Public Header can precede public layout. |
| 4 | Learner context and Published learning fixtures pass. |
| 5 | Activity contracts, Runtime schema, events, and idempotency are ready. |
| 6 | Canonical completion and Activity Result pass. |
| 7 | Generic assessment flow, `FE-TASK-055`-`FE-TASK-059`, and Placement metadata fixtures pass so shared `FE-TASK-107` may execute. |
| 8 | Learning activity context and provider abstraction/stub are ready. |
| 9 | Text/fallback and generic engine flow pass; speech configs exist; completed `FE-TASK-107` is available for reuse. |
| 10 | Placement and AI implementation/QA branches are integrated; `FE-TASK-097` and `FE-TASK-098` can precede dependent `FE-TASK-111`/`FE-TASK-112`; fault injection is available. |
| 11 | All predecessor evidence and release-candidate environment are ready. |

Every row additionally requires available source contracts, completed predecessors, required configuration/fixtures/stubs, no applicable blocker, and producer/consumer agreement on the canonical contract.

## 21. Definition of Done by Wave

| Wave | Definition of Done |
| --- | --- |
| 0 | Documentation gate and contradiction review pass. |
| 1 | Only `FE-TASK-001`-`FE-TASK-006` and `FE-TASK-012`-`FE-TASK-017` frontend foundations complete; deterministic bootstrap/harness/config/envelope/trace/stub-boundary evidence exists; and foundation-only `QA-TASK-001`-`QA-TASK-006` pass. |
| 2 | Clean schema/fixtures, auth/isolation, `FE-TASK-021`, authenticated layout/guards, and fallback support pass in dependency order. |
| 3 | `FE-TASK-026` precedes `FE-TASK-007`; public layout, safe navigation, Public Landing Slice, and authenticated-shell handoff pass. |
| 4 | Learning browse/navigation slices pass with real APIs. |
| 5 | One idempotent completion/result/event sequence is proven. |
| 6 | Engine-owned result and isolated progress slices pass. |
| 7 | Placement implementation with shared `FE-TASK-107`, generic-reuse E2E, and `QA-TASK-077`-`QA-TASK-082` boundary proof pass; `FE-TASK-111` remains Wave 10 hardening. |
| 8 | AI text/safety/fallback integration passes. |
| 9 | Voice/transcript/TTS/Normal/Assessable implementation and `QA-TASK-089`-`QA-TASK-096` pass using reused `FE-TASK-107`; `FE-TASK-112` remains Wave 10 hardening. |
| 10 | Retry/replay/observability/security suites pass, and `FE-TASK-111`/`FE-TASK-112` complete after `FE-TASK-097`/`FE-TASK-098` as required. |
| 11 | Accessibility/responsive, regression, operations, and GO pass. |

Done always includes task acceptance criteria, automated/manual evidence, no unresolved critical boundary violation, passed integration checkpoints, accurate documentation references, and consumer handoff.

## 22. MVP Release Readiness Checklist

### Documentation
- [ ] Frozen implementation sources remain unchanged and aligned.
- [ ] Execution mappings and identifiers are verified; no drift remains.

### Frontend
- [ ] UX-001 through UX-011 and CMP-001 through CMP-029 coverage is verified.
- [ ] Frozen design tokens/assets, responsive behavior, and accessibility pass.
- [ ] Frontend owns no official learning outcome, event, or decision.

### Backend
- [ ] Clean migration, safe rollback/forward-fix plan, deterministic seeds, and two-Learner fixtures pass.
- [ ] Required APIs, Runtime, non-evaluative Activity Result, engine-owned immutable Assessment Result, progress, Placement reuse, and AI Practice pass.
- [ ] Idempotency, retry/replay, audit, security, and observability pass.

### Integration and QA
- [ ] Foundation-only `QA-TASK-001`-`QA-TASK-006` bootstrap/harness/config/envelope/trace/stub-boundary evidence is complete without substituting for later feature-flow evidence.
- [ ] `QA-TASK-001`-`QA-TASK-100` graph and all contract/E2E/failure/regression evidence complete, including both required Placement and AI branches.
- [ ] No required evidence is skipped, quarantined, flaky without disposition, or mock-only.

### Security and Privacy
- [ ] Learner isolation/session/safe errors pass; no secrets or provider internals leak.
- [ ] Required audit/security records exist without becoming business triggers.

### AI
- [ ] Gateway, STT/TTS, canonical transcript, fallback, safety, and approved evidence pass.
- [ ] AI owns no official score, result, decision, path, or event.

### Operations
- [ ] Environment/configuration, migration/recovery, monitoring, and release smoke are verified.
- [ ] Rollback or safe forward-fix procedure and post-recovery checks are ready.

## 23. Go / No-Go Decision Model

### GO
All required gates pass, `QA-TASK-100` passes, release evidence is complete, and no unresolved release blocker exists.

### CONDITIONAL GO
Only explicitly documented non-critical issues may qualify when they do not violate frozen acceptance criteria, architecture, learner isolation, official result correctness, or required accessibility, and have an owner and immediate follow-up.

### NO-GO
Any critical defect, architecture violation, isolation or migration failure, result/event duplication, mandatory AI voice/text fallback failure, or incomplete critical E2E flow requires NO-GO.

Participants are Product/Architecture Governance, Frontend, Backend, Runtime/Assessment Engine, AI Integration, QA, and Release/Operations roles. QA presents evidence; contract owners confirm boundaries; the release role records the decision.

## 24. Rollback and Recovery Readiness

Release evidence must cover application rollback, safe migration rollback, forward-fix when data rollback is unsafe, and configuration disablement only where already supported. Provider/STT/TTS failures use frozen fallback behavior and safe learner-facing errors. Recovery must retain correlation/trace/audit evidence and be followed by migration health, auth, critical-slice, isolation, event/result uniqueness, and smoke verification. This plan does not select deployment infrastructure.

## 25. Change Control

* Frozen sources cannot change silently during implementation.
* Sequencing may change only when task scope, IDs, and dependencies remain unchanged and traceability is revalidated.
* Architecture or scope changes require formal review and, where applicable, a new Architecture Decision.
* Task ID reuse/renumbering is prohibited; new MVP dependencies require review.
* Future or blocked work cannot enter MVP informally.
* A discovered contradiction stops the affected lane and is escalated to canonical owners; unrelated lanes may continue through valid gates.
* Implementation shortcuts cannot become undocumented contracts.

## 26. Open Implementation Decisions

These choices are allowed only where not already selected by a frozen source.

| Decision | Allowed Scope | Must Not Change | Needed Before |
| --- | --- | --- | --- |
| Frontend framework configuration/module layout | Build and repository organization | UX/CMP/API/design contracts | Wave 1 exit |
| Backend framework/module layout | Internal code organization | API/data/Runtime/Engine boundaries | Wave 1 exit |
| CI provider and repository orchestration | Test/build automation | Required evidence/gates | Wave 1 exit |
| Deployment platform | Runtime hosting configuration | Architecture/contracts | Wave 11 readiness |
| Database vendor/configuration | Supported implementation configuration | Frozen schema/model/constraints | Wave 2 entry |
| Session transport implementation | Frozen auth contract implementation | Auth/session/learner boundaries | Wave 2 integration |
| Concrete AI/STT/TTS providers | Adapter configuration | Provider gateway/contracts/fallback | Wave 8 entry |
| Monitoring vendor | Storage/display of approved telemetry | Event/observability separation and secrecy | Wave 10 entry |

## 27. Execution Risks and Mitigations

| Risk | Impact | Early Signal | Mitigation | Gate |
| --- | --- | --- | --- | --- |
| Frontend/backend drift | Broken integration | Fixture/API mismatch | Contract tests and centralized wrappers | Contract |
| Dependency misunderstanding | Rework/blockage | Task starts before predecessor | Dependency review per wave | Dependency |
| Migration/schema drift | Data/release failure | Schema diff | Clean migration and drift check | Dependency/Release |
| Duplicate event/result | Incorrect official state | Duplicate key/event trace | Early idempotency and fault injection | Integration/Release |
| Learner isolation failure | Security breach | Cross-fixture visibility | Two-Learner tests from Wave 2 | Release |
| Late integration | Choke-point pileup | Mocks survive wave exit | Vertical slices and real-API exit gate | Integration |
| Provider/STT/TTS instability | AI flow failure | Timeout/error rate | Gateway, bounded retry, frozen fallback | QA Evidence |
| AI fallback gap | Core AI unusable | No usable text path | Failure-first tests | QA Evidence |
| Late accessibility defects | Inaccessible core flow | Keyboard/focus failures | Accessible primitives and continuous smoke | Release |
| Nondeterministic fixtures | Flaky evidence | Seed variance | Versioned deterministic reset | QA Evidence |
| Late observability | Unprovable failures | Missing correlation/trace | Wave 1 primitives, Wave 10 hardening | Release |
| Critical-path bottleneck | Delayed assessment flow | Completion/engine handoff queue | Contract fixtures and early integrated trace | Integration |
| Future-scope leakage | Architecture/scope violation | New dependency/entity/UI | Scope review and change control | Documentation/Release |

## 28. Traceability Summary

| MVP Feature | Execution Wave(s) | Frontend Workstream / Tasks | Backend Workstream / Tasks | QA Workstream / Tasks | Release Evidence |
| --- | --- | --- | --- | --- | --- |
| `FB-MVP-001` | 4 | `FE-WS-006`; `FE-TASK-031`-`FE-TASK-036` | `BE-WS-004`; `BE-TASK-025`, `BE-TASK-026` | `QA-TASK-015`, `QA-TASK-028`, `QA-TASK-046`, `QA-TASK-100` | Manual Published program selection |
| `FB-MVP-002` | 4 | `FE-WS-007`; `FE-TASK-037`, `FE-TASK-041` | `BE-WS-004`; `BE-TASK-027`, `BE-TASK-028` | `QA-TASK-016`, `QA-TASK-029`, `QA-TASK-047`, `QA-TASK-100` | Structure assignment/read contract |
| `FB-MVP-003` | 4 | `FE-WS-007`; `FE-TASK-037`-`FE-TASK-044` | `BE-WS-004`; `BE-TASK-029`, `BE-TASK-030` | `QA-TASK-017`, `QA-TASK-029`, `QA-TASK-048`, `QA-TASK-100` | Module browse/contract evidence |
| `FB-MVP-004` | 4 | No MVP authoring UI; shared API integration only | `BE-WS-004`; `BE-TASK-031`, `BE-TASK-032` | `QA-TASK-018`, `QA-TASK-049`, `QA-TASK-100` | Design API evidence |
| `FB-MVP-005` | 4 | `FE-WS-008`; CMP-010 presentation through `FE-TASK-045`-`FE-TASK-053` | `BE-WS-004`; `BE-TASK-033`, `BE-TASK-034` | `QA-TASK-019`, `QA-TASK-050`, `QA-TASK-100` | Objective API/presentation evidence |
| `FB-MVP-006` | 4-5 | `FE-WS-008`, `FE-WS-009`; `FE-TASK-045`-`FE-TASK-054` | `BE-WS-004`-`BE-WS-006`; `BE-TASK-037`, `BE-TASK-038`, `BE-TASK-044`, `BE-TASK-046`-`BE-TASK-053` | `QA-TASK-021`, `QA-TASK-030`, `QA-TASK-054`-`QA-TASK-067`, `QA-TASK-100` | Activity completion/result E2E |
| `FB-MVP-007` | 6 | No MVP authoring UI | `BE-WS-007`; `BE-TASK-054`, `BE-TASK-055` | `QA-TASK-023`, `QA-TASK-068`, `QA-TASK-100` | Blueprint contract evidence |
| `FB-MVP-008` | 6 | `FE-WS-009`; `FE-TASK-055`-`FE-TASK-059` | `BE-WS-007`; `BE-TASK-056`-`BE-TASK-066` | `QA-TASK-068`-`QA-TASK-076`, `QA-TASK-100` | Engine-owned immutable result |
| `FB-MVP-009` | 4 | `FE-WS-008`; `FE-TASK-046`, `FE-TASK-050` | `BE-WS-004`; `BE-TASK-035`, `BE-TASK-036` | `QA-TASK-020`, `QA-TASK-030`, `QA-TASK-051`, `QA-TASK-100` | Published content delivery |
| `FB-MVP-010` | 5 | Frontend FSM mappings in `FE-TASK-045`-`FE-TASK-054` | `BE-WS-005`; `BE-TASK-039`, `BE-TASK-040`, `BE-TASK-044`, `BE-TASK-045` | `QA-TASK-054`, `QA-TASK-061`, `QA-TASK-100` | State transition trace |
| `FB-MVP-011` | 5, 9-10 | Frontend API observation only | `BE-WS-005`, `BE-WS-006`, `BE-WS-007`; `BE-TASK-041`-`BE-TASK-043`, `BE-TASK-048`, `BE-TASK-049`, `BE-TASK-058`, `BE-TASK-061`, `BE-TASK-062`, `BE-TASK-096` | `QA-TASK-057`-`QA-TASK-061`, `QA-TASK-096`-`QA-TASK-100` | Event authority/order/uniqueness trace |
| `FB-MVP-012` | 6 | `FE-WS-010`; `FE-TASK-060`-`FE-TASK-066` | `BE-WS-010`; `BE-TASK-052`, `BE-TASK-065`, `BE-TASK-087`, `BE-TASK-088` | `QA-TASK-032`, `QA-TASK-083`-`QA-TASK-086`, `QA-TASK-100` | Isolated read-only progress |
| `FB-MVP-013` | 3 | `FE-WS-005`; `FE-TASK-025`-`FE-TASK-030` | `BE-WS-004`; `BE-TASK-023`, `BE-TASK-024` | `QA-TASK-014`, `QA-TASK-026`, `QA-TASK-045`, `QA-TASK-100` | Public landing E2E |
| `FB-MVP-014` | 8-10 | Waves 8-9: `FE-WS-011`, `FE-WS-016`; `FE-TASK-067`-`FE-TASK-078`, `FE-TASK-104`-`FE-TASK-108`; Wave 10: `FE-TASK-112` | `BE-WS-009`; `BE-TASK-072`-`BE-TASK-086` | `QA-WS-012`; `QA-TASK-087`-`QA-TASK-096`, `QA-TASK-100` | Text/voice/assessable/fallback evidence |
| `FB-MVP-015` | 2-3 | `FE-WS-004`; `FE-TASK-018`-`FE-TASK-024` | `BE-WS-003`; `BE-TASK-017`-`BE-TASK-022` | `QA-WS-005`; `QA-TASK-013`, `QA-TASK-027`, `QA-TASK-036`-`QA-TASK-044`, `QA-TASK-100` | Auth/session/isolation evidence |
| `FB-MVP-016` | 7, 10 | Wave 7: `FE-WS-015`, `FE-WS-016`; `FE-TASK-101`-`FE-TASK-103`, `FE-TASK-107`; Wave 10: `FE-TASK-111` | `BE-WS-008`; `BE-TASK-067`-`BE-TASK-071` | `QA-WS-010`; `QA-TASK-034`, `QA-TASK-077`-`QA-TASK-082`, `QA-TASK-100` | Generic-flow Placement E2E |

## 29. Final Completion Criteria

Kaifa v2 MVP execution is complete only when all required `FE-TASK-001`-`FE-TASK-112`, `BE-TASK-001`-`BE-TASK-097`, and `QA-TASK-001`-`QA-TASK-100` executable tasks are complete; all release-blocking evidence and all Section 11 vertical slices pass, including both required Placement and AI branches; documentation and implementation remain aligned; no architecture boundary is violated; no future or blocked capability is required for operation; and the release decision is GO.

## 30. References

* `docs/80_implementation/80_feature_breakdown.md`
* `docs/80_implementation/81_frontend_mvp_task_breakdown.md`
* `docs/80_implementation/82_backend_mvp_task_breakdown.md`
* `docs/80_implementation/83_mvp_integration_qa_task_breakdown.md`
* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/70_ui_ux/72_screen_inventory.md`
* `docs/70_ui_ux/73_component_spec.md`
* `docs/70_ui_ux/74_frontend_state_model.md`
* `docs/70_ui_ux/75_interaction_spec.md`
* `docs/70_ui_ux/76_design_system.md`
* `docs/70_ui_ux/77_frontend_implementation_plan.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/61_api_design_principles.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/64_engine_contracts.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/20_runtime/20_state_machine.md`
* `docs/20_runtime/21_event_model.md`
* `docs/30_engine/30_assessment_engine.md`
* `docs/40_ai/41_ai_provider_integration.md`
* `docs/40_ai/44_ai_governance.md`
* `docs/99_architecture_decisions.md`
