# Backend MVP Task Breakdown

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | ----- | ---------- | ------- | ------------ |
| 1.3 | Freeze | Backend Engineering | `20_runtime/20_state_machine.md`, `20_runtime/21_event_model.md`, `50_product/52_prd.md`, `60_engineering/60_srs.md`, `60_engineering/61_api_design_principles.md`, `60_engineering/62_api_spec.md`, `60_engineering/63_database_model.md`, `60_engineering/64_engine_contracts.md`, `60_engineering/65_event_contracts.md`, `80_implementation/80_feature_breakdown.md`, `80_implementation/81_frontend_mvp_task_breakdown.md`, `99_architecture_decisions.md` | Backend Engineering, Runtime / Engine Engineering, AI Engineering, QA, MVP Delivery | 2026-07-13 |

## 1. Purpose

This document breaks the frozen Kaifa v2 backend MVP scope into granular executable tasks. It does not redesign architecture, add entities, add columns, add endpoints, add events, add engines, or expand MVP business scope.

## 2. Scope Guardrails

* MVP tasks use sequential `BE-TASK-###` identifiers only.
* Phase 2 work uses `BE-FUTURE-P2-###`; Phase 3 work uses `BE-FUTURE-P3-###`; unresolved architecture work uses `BE-BLOCKED-###`.
* MVP Runtime stops at `AssessmentResultGenerated`; `KnowledgeProfileUpdated` and `LearningDecisionGenerated` are not required MVP Runtime tasks.
* Idempotency foundation is implemented before completion, Activity Result persistence, Assessment Engine execution, AI completion, retry, and replay work.
* Concurrency/retry/replay work is hardening after the core completion and assessment flow, not a prerequisite loop.
* Observability is split into early logging/metrics primitives and later flow-specific hardening.
* Placement Test reuses Learning Activity, Activity Result, Assessment Blueprint, Assessment Engine, and Assessment Result flows.
* AI Conversation Practice keeps text, mandatory STT/TTS, canonical transcript, Normal and Assessable completion, approved evidence, provider observability, safety, and fallback boundaries.

## 3. MVP Workstreams

| Workstream ID | Workstream | MVP Status | Primary Output |
| --- | --- | --- | --- |
| `BE-WS-001` | Platform Foundation | Required | Executable backend tasks only. |
| `BE-WS-002` | MVP Schema and Data | Required | Executable backend tasks only. |
| `BE-WS-003` | Auth and Learner Context | Required | Executable backend tasks only. |
| `BE-WS-004` | Public and Learning Domain APIs | Required | Executable backend tasks only. |
| `BE-WS-005` | Runtime Foundations | Required | Executable backend tasks only. |
| `BE-WS-006` | Activity Completion and Results | Required | Executable backend tasks only. |
| `BE-WS-007` | Assessment Engine and Results | Required | Executable backend tasks only. |
| `BE-WS-008` | Placement Test Specialization | Required | Executable backend tasks only. |
| `BE-WS-009` | AI Conversation Practice | Required | Executable backend tasks only. |
| `BE-WS-010` | Progress and Read Models | Required | Executable backend tasks only. |
| `BE-WS-011` | Observability and Hardening | Required | Executable backend tasks only. |
| `BE-WS-012` | Backend Verification | Required | Executable backend tasks only. |

Total MVP workstreams: 12.

## 4. Task ID Rules

* Executable MVP backend tasks are `BE-TASK-001` through `BE-TASK-097`.
* Every executable task depends only on earlier executable tasks or has no dependency.
* Future and blocked identifiers are not dependencies of any MVP task.
* Official event, database, API, engine, AI Practice, and feature coverage is rebuilt in the matrices below.

Reference shorthand used in the task table: `20` = `20_runtime/20_state_machine.md`; `21` = `20_runtime/21_event_model.md`; `30_assessment_engine` = `30_engine/30_assessment_engine.md`; `41` = `40_ai/41_ai_provider_integration.md`; `44` = `40_ai/44_ai_governance.md`; `52` = `50_product/52_prd.md`; `60` = `60_engineering/60_srs.md`; `61` = `60_engineering/61_api_design_principles.md`; `62` = `60_engineering/62_api_spec.md`; `63` = `60_engineering/63_database_model.md`; `64` = `60_engineering/64_engine_contracts.md`; `65` = `60_engineering/65_event_contracts.md`; `99` = `99_architecture_decisions.md`.

## 5. Executable MVP Backend Tasks

| Task ID | Workstream | Task | Dependencies | Authoritative References | Related Feature/API/Data/Event | Ownership / Boundary | Deliverable | Test Coverage | Out of Scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `BE-TASK-001` | `BE-WS-001` | Create backend service skeleton and module boundaries | None | 61,62,64,65,99 | N/A | Backend application boundary only. | Application, API, Runtime, Engine adapter, AI adapter, persistence, and test modules exist without domain behavior. | Bootstrap smoke test. | Domain behavior; engine logic. |
| `BE-TASK-002` | `BE-WS-001` | Implement shared API envelope and error normalization | `BE-TASK-001` | 61,62 | All MVP APIs | API contract boundary. | Shared success/error envelope, pagination metadata, validation error format, correlation ID, and trace ID handling are available. | Envelope and error contract tests. | Endpoint-specific business rules. |
| `BE-TASK-003` | `BE-WS-001` | Implement request correlation, trace, and actor context primitives | `BE-TASK-002` | 61,62,65 | All authenticated APIs/events | Context propagation only; no advanced auth. | Every request can carry correlation ID, trace ID, and nullable actor context without defining advanced auth. | Context propagation tests. | JWT/cookie/SSO/MFA design. |
| `BE-TASK-004` | `BE-WS-001` | Implement configuration and secret validation | `BE-TASK-001` | 61,62,64 | Runtime, DB, Auth, AI Provider, STT/TTS config | Configuration boundary. | Runtime, database, auth, AI provider, STT, TTS, timeout, and feature boundary config are validated at startup. | Config validation and missing secret tests. | Provider-specific schema. |
| `BE-TASK-005` | `BE-WS-001` | Implement shared validation and transaction helpers | `BE-TASK-002` | 61,62,63 | All write APIs | Technical validation/transaction helper only. | Input validation and transaction helpers are available to all endpoint and Runtime tasks. | Validation helper and rollback tests. | Business criteria definition. |
| `BE-TASK-006` | `BE-WS-001` | Implement early structured logging and metrics primitives | `BE-TASK-003` | 61,62,65 | Observability foundation | Observability-only. | Structured logs and metrics can record endpoint, persistence, Runtime, event, provider, and engine metadata. | Log field and metric emission tests. | Official event semantics. |
| `BE-TASK-007` | `BE-WS-002` | Create MVP foundation and identity migrations | `BE-TASK-004` | 63 | learner, learner_auth_account, auth_session, landing_page_config, audit_log, system_event_log, idempotency_key | MVP tables only. | Migrations create MVP foundation, identity, audit, observability, and idempotency tables. | Migration and constraint tests. | Advanced identity tables. |
| `BE-TASK-008` | `BE-WS-002` | Create MVP learning domain migrations | `BE-TASK-007` | 63 | learning_program, program_structure, learning_module, learning_design, learning_objective, learning_activity, assessment_blueprint, content_item | Learning Domain persistence shape only. | Migrations create frozen MVP learning domain tables. | Migration and foreign key tests. | New domain entities/columns. |
| `BE-TASK-009` | `BE-WS-002` | Create MVP Runtime and assessment migrations | `BE-TASK-008` | 20,21,63,65 | learning_state, state_transition, runtime_event, activity_result, assessment_result | Runtime/Assessment storage only. | Migrations create Runtime state/event/result and Assessment Result tables. | Append-only/event/state constraint tests. | Knowledge Profile/Learning Decision tables. |
| `BE-TASK-010` | `BE-WS-002` | Create MVP AI Practice migrations | `BE-TASK-009` | 63,64 | ai_practice_conversation, ai_practice_message, ai_practice_assessment_evidence, ai_practice_provider_record, ai_practice_safety_event | MVP AI Practice tables only. | Migrations create MVP AI Practice tables. | AI table relationship and boundary tests. | Phase 3 AI tables/provider request-response. |
| `BE-TASK-011` | `BE-WS-002` | Implement migration runner and rollback verification | `BE-TASK-010` | 63 | All MVP tables | Schema lifecycle only. | Migrations run from clean database and rollback safely for MVP tables only. | Clean migrate, rollback, and schema diff tests. | Data model changes beyond MVP. |
| `BE-TASK-012` | `BE-WS-002` | Implement seed data loader for public and learning MVP data | `BE-TASK-011` | 52,60,62,63 | Published landing/program/content/activity/blueprint fixtures | Seed data only. | Seed loader creates Published MVP public and learning fixtures. | Seed idempotency and Published-only fixture tests. | Enrollment/Phase 2/Phase 3 seed data. |
| `BE-TASK-013` | `BE-WS-002` | Implement two-learner auth and isolation fixtures | `BE-TASK-012` | 52,60,62,63 | learner, learner_auth_account, auth_session | Learner isolation fixture boundary. | Two learner/auth/session fixtures exist for isolation tests without enrollment, role, or permission data. | Fixture isolation tests. | Roles/permissions/enrollment. |
| `BE-TASK-014` | `BE-WS-002` | Implement repository interfaces for MVP entities | `BE-TASK-011` | 63 | All MVP entities | Persistence access boundary. | Repositories exist for all MVP tables and exclude Phase 2/3/Future tables. | Repository CRUD and ownership tests. | Future table repositories. |
| `BE-TASK-015` | `BE-WS-002` | Implement base audit and security log persistence | `BE-TASK-007`, `BE-TASK-006` | 61,62,63,65 | audit_log, system_event_log | Audit/security/ops logs only. | audit_log and system_event_log writers support auth/security/operational records without official events. | Audit/system log persistence tests. | Official event publication. |
| `BE-TASK-016` | `BE-WS-002` | Implement idempotency key foundation | `BE-TASK-007`, `BE-TASK-005` | 62 §19,63,65 | idempotency_key; completion and engine-triggering operations | Idempotency foundation before lifecycle execution. | Generic idempotency reserve, complete, replay, and conflict helpers persist operation_type, reference_id, and result_reference. | Reserve/complete/replay/conflict tests. | Replay infrastructure guarantees. |
| `BE-TASK-017` | `BE-WS-003` | Implement learner credential verification boundary | `BE-TASK-013`, `BE-TASK-015` | 62 §6.1,63 | learner_auth_account | Authentication only; no learning side effects. | Credential verification reads learner_auth_account and writes only security audit records. | Valid/invalid credential tests. | Signup/OAuth/MFA/roles. |
| `BE-TASK-018` | `BE-WS-003` | Implement login endpoint POST /api/v1/auth/login | `BE-TASK-017` | 62 §6.1,63 | POST /api/v1/auth/login; auth_session | Auth session owner; no official event. | Login creates auth_session and returns active learner/session references. | Login API tests. | Canonical learning pipeline triggers. |
| `BE-TASK-019` | `BE-WS-003` | Implement logout endpoint POST /api/v1/auth/logout | `BE-TASK-018` | 62 §6.1,63,65 | POST /api/v1/auth/logout; auth_session | Auth session owner; audit only. | Logout ends the active auth_session without publishing official events. | Logout and repeated logout tests. | Official auth events. |
| `BE-TASK-020` | `BE-WS-003` | Implement session resolver and GET /api/v1/auth/me | `BE-TASK-018` | 62 §6.1,63 | GET /api/v1/auth/me; learner context | Learner context boundary. | Active sessions resolve learner context for /auth/me and downstream endpoints. | Session resolver and /me tests. | Authorization roles. |
| `BE-TASK-021` | `BE-WS-003` | Enforce learner-scoped access middleware | `BE-TASK-020`, `BE-TASK-003` | 62 §6-7,63 | All learner-owned APIs/data | Learner isolation boundary. | Authenticated endpoints reject missing/expired sessions and attach learner context. | Auth middleware tests. | Educator/admin permissions. |
| `BE-TASK-022` | `BE-WS-003` | Verify two-learner data isolation | `BE-TASK-021`, `BE-TASK-013` | 52,60,62,63 | Learner-owned Activity/Assessment/AI/Progress data | Isolation verification. | Learner-scoped reads and writes cannot cross learner boundaries. | Two-learner isolation tests. | Shared learner data behavior. |
| `BE-TASK-023` | `BE-WS-004` | Implement public landing page read API | `BE-TASK-012` | 52,62 §11.14,63 | GET /api/v1/public/landing-page; landing_page_config | Public read-only; no learner/session/event. | GET /api/v1/public/landing-page reads landing_page_config without session or events. | Public landing API tests. | Signup/enrollment behavior. |
| `BE-TASK-024` | `BE-WS-004` | Implement public program highlights API | `BE-TASK-023` | 52,62 §11.14,63 | GET /api/v1/public/program-highlights; learning_program | Public Published read-only. | GET /api/v1/public/program-highlights returns Published program highlights only. | Public highlights API tests. | Enrollment or personalized ranking. |
| `BE-TASK-025` | `BE-WS-004` | Implement learning program read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.1,63 | GET /api/v1/learning-programs; learning_program | Learning Domain read boundary. | GET /api/v1/learning-programs and /{programId} return Published learner-visible program data. | Program read API tests. | Adaptive selection. |
| `BE-TASK-026` | `BE-WS-004` | Implement learning program write and archive APIs | `BE-TASK-025`, `BE-TASK-016` | 62 §11.1,63,65 | POST/PUT/PATCH/DELETE learning-programs; LearningProgramCreated/Published | Learning Program owner; no candidate update/archive events. | Program writes persist allowed lifecycle changes and official program events where applicable. | Program write, archive, event, and idempotency tests. | Enrollment and non-official events. |
| `BE-TASK-027` | `BE-WS-004` | Implement program structure read API | `BE-TASK-026` | 62 §11.2,63 | GET program-structure; program_structure | Learning Domain read boundary. | GET /api/v1/learning-programs/{programId}/program-structure returns assigned structure. | Program structure read tests. | New structure types. |
| `BE-TASK-028` | `BE-WS-004` | Implement program structure assignment API | `BE-TASK-027`, `BE-TASK-016` | 62 §11.2,63,65 | PUT program-structure; ProgramStructureAssigned | Program Structure owner. | PUT /api/v1/learning-programs/{programId}/program-structure persists assignment and ProgramStructureAssigned when applicable. | Structure assignment and event tests. | Enrollment creation. |
| `BE-TASK-029` | `BE-WS-004` | Implement learning module read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.3,63 | GET learning-modules; learning_module | Learning Domain read boundary. | GET /api/v1/learning-modules and /{moduleId} return learner-visible modules. | Module read API tests. | Adaptive sequencing. |
| `BE-TASK-030` | `BE-WS-004` | Implement learning module write, publish, and archive APIs | `BE-TASK-029`, `BE-TASK-016` | 62 §11.3,63,65 | POST/PUT/PATCH/DELETE learning-modules; LearningModuleCreated/Published | Learning Module owner; no candidate update/archive events. | Module writes persist allowed lifecycle changes and official module events where applicable. | Module write, publish, archive, event, and idempotency tests. | Non-official module events. |
| `BE-TASK-031` | `BE-WS-004` | Implement learning design read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.4,63 | GET learning-designs; learning_design | Learning Domain read boundary. | GET /api/v1/learning-designs and /{designId} return stored designs. | Design read API tests. | Recommendation execution. |
| `BE-TASK-032` | `BE-WS-004` | Implement learning design write APIs | `BE-TASK-031` | 62 §11.4,63,65 | POST/PUT learning-designs; learning_design | Learning Design owner; audit only for candidate events. | POST and PUT learning design endpoints persist design data without official candidate events. | Design write and audit tests. | LearningDesignCreated/Updated official events. |
| `BE-TASK-033` | `BE-WS-004` | Implement learning objective read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.5,63 | GET learning-objectives; learning_objective | Learning Domain read boundary. | GET /api/v1/learning-objectives and /{objectiveId} return objectives. | Objective read API tests. | Mastery computation. |
| `BE-TASK-034` | `BE-WS-004` | Implement learning objective write and archive APIs | `BE-TASK-033`, `BE-TASK-016` | 62 §11.5,63,65 | POST/PUT/DELETE learning-objectives; LearningObjectiveCreated | Learning Objective owner; archive audit only. | Objective writes persist allowed changes and LearningObjectiveCreated where applicable. | Objective write, archive, event/audit tests. | LearningObjectiveUpdated/Archived official events. |
| `BE-TASK-035` | `BE-WS-004` | Implement learning content read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.11,63 | GET learning-contents; content_item | Published content read boundary. | GET /api/v1/learning-contents and /{contentId} return Published learner-visible content. | Content read API tests. | Content recommendation. |
| `BE-TASK-036` | `BE-WS-004` | Implement learning content write/version APIs | `BE-TASK-035` | 62 §11.11,63 | POST/PUT learning-contents; content_item | Content persistence/versioning boundary. | POST and PUT learning content endpoints persist content items and version/status changes without inventing events. | Content write/version tests. | New official content events. |
| `BE-TASK-037` | `BE-WS-004` | Implement learning activity read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.6,§11.16,63 | GET learning-activities; learning_activity | Learning Activity read; placement via metadata only. | GET /api/v1/learning-activities and /{activityId} support generic and purpose=placement queries. | Activity read and placement filter tests. | Placement resource/table. |
| `BE-TASK-038` | `BE-WS-004` | Implement learning activity write APIs | `BE-TASK-037` | 62 §11.6,63 | POST/PUT learning-activities; learning_activity | Learning Activity owner; no results. | POST and PUT learning activity endpoints persist activity metadata without assessment results. | Activity write tests. | Activity Result or scoring writes. |
| `BE-TASK-039` | `BE-WS-005` | Implement Runtime state repository and single-active-state constraint use | `BE-TASK-009`, `BE-TASK-014` | 20,63 | learning_state | Runtime owns state. | Runtime can read/write learning_state while database enforces structural single-active-state constraints. | State repository and constraint tests. | Engine-owned state transitions. |
| `BE-TASK-040` | `BE-WS-005` | Implement state transition append-only writer | `BE-TASK-039` | 20,21,63,65 | state_transition | Runtime append-only transition history. | Runtime appends state_transition records with triggering_event references where available. | Transition persistence tests. | Business rule definition in DB. |
| `BE-TASK-041` | `BE-WS-005` | Implement runtime_event immutable persistence | `BE-TASK-009`, `BE-TASK-016` | 21,63,65 | runtime_event; all official MVP events | Immutable official event storage. | Official events persist with envelope fields, publisher, idempotency key, correlation ID, and trace ID. | Event immutability and uniqueness tests. | Broker/outbox guarantees. |
| `BE-TASK-042` | `BE-WS-005` | Implement official event publisher validators | `BE-TASK-041` | 21,65 | Official Event Ownership Matrix | Event authority boundary. | Only official MVP event names and official publisher ownership are accepted for MVP event publication. | Publisher validation tests. | Candidate event promotion. |
| `BE-TASK-043` | `BE-WS-005` | Implement event handler registration and dispatch shell | `BE-TASK-042` | 21,65 | Runtime event handlers | Runtime dispatch shell; no broker assumption. | Runtime can route official events to registered handlers without broker-specific assumptions. | Dispatch registration tests. | Replay/delivery guarantee. |
| `BE-TASK-044` | `BE-WS-005` | Implement start activity endpoint POST /api/v1/learning-activities/{activityId}/start | `BE-TASK-037`, `BE-TASK-039`, `BE-TASK-021` | 20,62 §11.6,63 | POST activity start; learning_state | Runtime start flow. | Learner start creates or advances learning_state to Learning without official events. | Start endpoint and state tests. | Assessment or completion behavior. |
| `BE-TASK-045` | `BE-WS-005` | Implement Runtime event-to-state transitions for MVP flow | `BE-TASK-040`, `BE-TASK-043` | 20,21,65 | LearningActivityCompleted, ActivityResultGenerated, AssessmentResultGenerated | Runtime owns state transitions. | Runtime applies MVP state transitions and stops post-assessment without Phase 2 engines. | State transition tests. | Knowledge Profile/Recommendation states in MVP. |
| `BE-TASK-046` | `BE-WS-006` | Implement completion criteria input validation boundary | `BE-TASK-038`, `BE-TASK-045`, `BE-TASK-016` | 62 §11.6,§18,65 | POST activity complete validation | Validation only before result creation. | Completion request validation rejects invalid state, missing blueprint for assessable activity, and forbidden Phase 2 invocation. | Completion validation tests. | Activity Result persistence or event publication. |
| `BE-TASK-047` | `BE-WS-006` | Implement Runtime-owned Activity Result construction and persistence | `BE-TASK-046`, `BE-TASK-016` | 62 §11.6.1,63,65 | activity_result | Runtime owns Activity Result; non-evaluative. | Runtime creates non-evaluative activity_result for generic, placement, and AI Practice completion. | Activity Result service tests. | Score/mastery/pass/fail/Learning Decision. |
| `BE-TASK-048` | `BE-WS-006` | Publish LearningActivityCompleted event | `BE-TASK-047`, `BE-TASK-041` | 21,65 §9.1 | LearningActivityCompleted | Learning Activity official publisher; Runtime persists. | Completion persists LearningActivityCompleted with valid envelope and idempotency metadata. | Event publication tests. | AI/frontend event publication. |
| `BE-TASK-049` | `BE-WS-006` | Publish ActivityResultGenerated event | `BE-TASK-048` | 21,65 §9.2 | ActivityResultGenerated | Learning Activity official publisher; Runtime persists and routes. | Completion persists ActivityResultGenerated after activity_result is created. | Event ordering tests. | Assessment Result creation. |
| `BE-TASK-050` | `BE-WS-006` | Wire completion orchestration over implemented services | `BE-TASK-049`, `BE-TASK-043` | 20,21,62,65 | Completion flow: validation -> Activity Result -> events -> assessment trigger | Runtime orchestration wiring only after services exist. | Completion orchestration coordinates validation, idempotency, Activity Result, official events, and downstream Assessment trigger. | Orchestration integration tests. | Phase 2 engine invocation. |
| `BE-TASK-051` | `BE-WS-006` | Implement complete activity endpoint POST /api/v1/learning-activities/{activityId}/complete | `BE-TASK-050`, `BE-TASK-021` | 62 §11.6 | POST /api/v1/learning-activities/{activityId}/complete | API integration over Runtime orchestration. | Endpoint completes generic and placement activities, returns completion data, and triggers assessment when required. | Complete endpoint tests. | Direct Assessment Result writes. |
| `BE-TASK-052` | `BE-WS-006` | Implement Activity Result read APIs | `BE-TASK-047`, `BE-TASK-021` | 62 §11.6.1,63 | GET /api/v1/activity-results | Read-only Runtime-owned result exposure. | GET /api/v1/activity-results and /{activityResultId} return learner-owned Runtime results only. | Activity Result read and isolation tests. | Activity Result writes by client. |
| `BE-TASK-053` | `BE-WS-006` | Implement duplicate completion replay behavior | `BE-TASK-051`, `BE-TASK-016` | 62 §19,65 §13 | Completion idempotency | Hardens completed completion path. | Repeated completion with same idempotency basis returns stored result without duplicate Activity Result or events. | Replay and duplicate tests. | Broker replay strategy. |
| `BE-TASK-054` | `BE-WS-007` | Implement assessment blueprint read APIs | `BE-TASK-014`, `BE-TASK-021` | 62 §11.7,63,64 | GET /api/v1/assessment-blueprints | Learning Domain blueprint read. | GET /api/v1/assessment-blueprints and /{blueprintId} return blueprint definitions. | Blueprint read tests. | Evaluation execution. |
| `BE-TASK-055` | `BE-WS-007` | Implement assessment blueprint write APIs | `BE-TASK-054`, `BE-TASK-016` | 62 §11.7,63,65 | POST/PUT assessment-blueprints; AssessmentBlueprintUpdated | Assessment Blueprint owner; not result owner. | POST and PUT persist blueprints; PUT publishes AssessmentBlueprintUpdated when applicable. | Blueprint write, event, and idempotency tests. | Assessment Result writes. |
| `BE-TASK-056` | `BE-WS-007` | Resolve Assessment Engine inputs | `BE-TASK-049`, `BE-TASK-055`, `BE-TASK-016` | 62 §12.1,64 §6,65 | Activity Result, Assessment Blueprint, learner, idempotency, optional approved evidence | Runtime resolves inputs; no evaluation yet. | Runtime resolves Activity Result, Assessment Blueprint, learner, idempotency, and optional approved evidence references. | Input resolver tests. | Scoring or result persistence. |
| `BE-TASK-057` | `BE-WS-007` | Implement Runtime-mediated Assessment Engine invocation | `BE-TASK-056`, `BE-TASK-043` | 62 §12.1,64 §6,65 | Internal Assessment Engine API | Runtime invokes Assessment Engine; Engine-to-Engine calls prohibited. | Runtime-mediated invocation sends resolved input with correlation ID, trace ID, and idempotency key without depending on assessment output events. | Invocation contract tests. | Assessment Result dependency; Phase 2 engine invocation. |
| `BE-TASK-058` | `BE-WS-007` | Publish AssessmentStarted event | `BE-TASK-057`, `BE-TASK-041` | 21,65 §9.3 | AssessmentStarted | Assessment Engine official publisher; Runtime persists/routes. | Assessment invocation persists AssessmentStarted before evaluation. | AssessmentStarted event tests. | Observability-only substitute event. |
| `BE-TASK-059` | `BE-WS-007` | Execute deterministic Assessment Blueprint evaluation | `BE-TASK-058` | 30_assessment_engine,62 §12.1,64 §6 | Assessment Engine evaluation cycle | Assessment Engine evaluates Activity Result using Blueprint/domain criteria only; AI never scores. | Assessment Engine evaluates Activity Result with Assessment Blueprint, invents no business rules, excludes AI official scoring, and returns deterministic/idempotent evaluation output for Assessment Result construction. | Deterministic evaluation, blueprint criteria, AI-exclusion, and idempotency tests. | Business criteria outside Blueprint/domain; AI scoring; persistence. |
| `BE-TASK-060` | `BE-WS-007` | Persist immutable Assessment Result through sole-writer boundary | `BE-TASK-059` | 63,64 §6,65 | assessment_result | Assessment Engine sole writer; immutable/read-only afterward. | Assessment Engine writes assessment_result from evaluation output and no other component writes it. | Sole-writer, immutability, and persistence tests. | Knowledge Profile/Learning Decision writes. |
| `BE-TASK-061` | `BE-WS-007` | Publish AssessmentCompleted event | `BE-TASK-060` | 21,65 §9.4 | AssessmentCompleted | Assessment Engine official publisher; Runtime persists/routes. | Assessment success persists AssessmentCompleted after deterministic evaluation and result persistence. | AssessmentCompleted event tests. | Failure event promotion. |
| `BE-TASK-062` | `BE-WS-007` | Publish AssessmentResultGenerated event | `BE-TASK-061` | 21,65 §9.5 | AssessmentResultGenerated | Assessment Engine official publisher; Runtime consumes for MVP stop/read availability. | Assessment success persists AssessmentResultGenerated after assessment_result exists. | AssessmentResultGenerated event tests. | KnowledgeProfileUpdated/LearningDecisionGenerated in MVP. |
| `BE-TASK-063` | `BE-WS-007` | Record AssessmentFailed as observability-only | `BE-TASK-057`, `BE-TASK-015` | 64 §6,65 §10 | system_event_log; AssessmentFailed observability record | Observability-only; not official event. | Assessment failures write system_event_log/metrics/traces only and create no official failure event. | Failure observability tests. | Official AssessmentFailed Runtime Event. |
| `BE-TASK-064` | `BE-WS-007` | Implement assessment idempotency and retry behavior | `BE-TASK-062`, `BE-TASK-016` | 62 §19,64 §6,65 §13-15 | Assessment evaluation/result idempotency | Hardens completed assessment path. | One Activity Result produces at most one Assessment Result per cycle, including retries and duplicate delivery. | Assessment idempotency and retry tests. | DLQ/broker delivery guarantees. |
| `BE-TASK-065` | `BE-WS-007` | Implement Assessment Result read APIs | `BE-TASK-064`, `BE-TASK-021` | 62 §11.8,63,64 | GET /api/v1/assessment-results | Read-only Assessment Engine output exposure. | GET /api/v1/assessment-results and /{resultId} return learner-owned immutable Assessment Engine outputs. | Assessment Result read and isolation tests. | Assessment Result mutation. |
| `BE-TASK-066` | `BE-WS-007` | Verify Runtime-to-Assessment lifecycle integration | `BE-TASK-064`, `BE-TASK-050` | 20,21,62,64,65 | ActivityResultGenerated -> AssessmentStarted -> AssessmentCompleted -> AssessmentResultGenerated | Runtime coordination verification; no Phase 2 engines. | Runtime invokes Assessment Engine after ActivityResultGenerated and never calls Phase 2 engines in MVP. | Runtime-to-engine lifecycle integration tests. | Knowledge Profile or Recommendation invocation. |
| `BE-TASK-067` | `BE-WS-008` | Implement placement activity discovery | `BE-TASK-037` | 62 §11.16,63 | GET /api/v1/learning-activities?purpose=placement | Placement via Learning Activity metadata. | GET /api/v1/learning-activities?purpose=placement returns placement-tagged Learning Activities only. | Placement discovery tests. | placement_test table/resource. |
| `BE-TASK-068` | `BE-WS-008` | Implement placement start using generic activity start | `BE-TASK-044`, `BE-TASK-067` | 62 §11.16,20 | POST activity start for Placement | Reuses generic start flow. | Placement Test start reuses Learning Activity start and learning_state. | Placement start tests. | Placement-specific state machine. |
| `BE-TASK-069` | `BE-WS-008` | Implement placement completion using generic activity completion | `BE-TASK-051`, `BE-TASK-068` | 62 §11.16-11.17,65 | POST activity complete for Placement | Reuses generic completion/Activity Result. | Placement Test completion reuses generic completion and Activity Result creation. | Placement completion tests. | Placement-specific Activity Result. |
| `BE-TASK-070` | `BE-WS-008` | Implement placement assessment metadata handling | `BE-TASK-065`, `BE-TASK-069` | 62 §11.17,63,64 | Assessment Result placement starting point suggestion | Assessment Result metadata; not Learning Decision. | Assessment Result exposes placement starting point suggestion metadata without Learning Decision or Recommendation Engine invocation. | Placement assessment metadata tests. | Recommendation Engine invocation. |
| `BE-TASK-071` | `BE-WS-008` | Verify no placement_test table, endpoint family, or engine exists | `BE-TASK-070` | 63,64,65 | Placement boundary | Specialization only. | Implementation has no placement_test table, no placement-specific engine, and no separate placement result owner. | Static/schema/API boundary tests. | New Placement entity/engine/event. |
| `BE-TASK-072` | `BE-WS-009` | Implement AI Practice conversation start endpoint | `BE-TASK-037`, `BE-TASK-021`, `BE-TASK-010` | 62 §11.15,63,64 §9-MVP | POST /api/v1/learning-activities/{activityId}/ai-conversation/start; ai_practice_conversation | AI Practice session tied to Practice activity/objective. | Start endpoint creates ai_practice_conversation tied to Practice activity and objective. | AI conversation start tests. | General Phase 3 AI Conversation. |
| `BE-TASK-073` | `BE-WS-009` | Implement AI Provider Gateway request boundary for practice | `BE-TASK-004`, `BE-TASK-072` | 41_ai_provider_integration,44_ai_governance,64 §10 | AI Provider Gateway | Provider abstraction; no provider-specific columns. | Provider calls use gateway config, generic provider metadata, correlation ID, trace ID, and timeouts. | Gateway contract tests. | Provider request/response Phase 3 persistence. |
| `BE-TASK-074` | `BE-WS-009` | Persist AI Practice provider observability records | `BE-TASK-073`, `BE-TASK-010` | 63,64,65 | ai_practice_provider_record | Provider observability only; not official event/source unless transformed to approved evidence. | Each provider interaction writes ai_practice_provider_record without official Runtime Events or provider-specific columns. | Provider record tests. | Official events or assessment result writes. |
| `BE-TASK-075` | `BE-WS-009` | Implement text message endpoint for AI Practice | `BE-TASK-074` | 62 §11.15,63 | POST /api/v1/ai-conversations/{conversationId}/messages; ai_practice_message | AI Practice text path. | Message endpoint accepts text interaction and stores learner/agent messages. | Text message API tests. | Official scoring. |
| `BE-TASK-076` | `BE-WS-009` | Implement mandatory STT input processing boundary | `BE-TASK-074` | 62 §11.15,41,44 | STT metadata; ai_practice_message | STT required capability; provider-agnostic. | Voice input path records STT metadata and canonical target-language transcript references where voice is used. | STT boundary tests. | Raw audio storage requirement; official scoring. |
| `BE-TASK-077` | `BE-WS-009` | Implement canonical transcript persistence | `BE-TASK-075`, `BE-TASK-076` | 62 §11.15,63,64 | canonical target-language transcript; ai_practice_message | Official conversation record. | ai_practice_message stores canonical target-language transcript as official conversation record. | Canonical transcript tests. | Translation/transliteration as assessment source. |
| `BE-TASK-078` | `BE-WS-009` | Implement mandatory TTS output processing boundary | `BE-TASK-077` | 62 §11.15,41,44 | TTS metadata/audio reference | TTS required capability; provider-agnostic. | Agent responses produce or reference TTS audio metadata required by MVP voice capability. | TTS boundary tests. | Voice biometrics/real-time voice extension. |
| `BE-TASK-079` | `BE-WS-009` | Implement translation and transliteration support boundaries | `BE-TASK-077` | 62 §11.15,64 §6 | translation_payload, transliteration_payload | Learner support only; excluded from assessment. | Translation/transliteration metadata is learner support only and excluded from assessment evidence. | Support-boundary tests. | Official assessment source. |
| `BE-TASK-080` | `BE-WS-009` | Implement AI Practice safety event recording | `BE-TASK-074`, `BE-TASK-015` | 44_ai_governance,63,65 | ai_practice_safety_event | Safety/governance record only; no official event. | Governance violations or safety conditions write ai_practice_safety_event without official events. | Safety record tests. | AI-owned Runtime Event. |
| `BE-TASK-081` | `BE-WS-009` | Implement AI Practice graceful fallback behavior | `BE-TASK-080` | 44_ai_governance,62 §11.15,65 | Provider/STT/TTS fallback | Graceful degradation boundary. | Provider/STT/TTS failures return safe fallback behavior and do not create Learning Decision, Knowledge Profile, or Assessment Result. | Fallback tests. | Phase 2 engine invocation. |
| `BE-TASK-082` | `BE-WS-009` | Implement AI Practice conversation read API | `BE-TASK-077`, `BE-TASK-021` | 62 §11.15,63 | GET /api/v1/ai-conversations/{conversationId} | Learner-owned history read. | GET /api/v1/ai-conversations/{conversationId} returns learner-owned session history. | Conversation read and isolation tests. | Phase 3 AI history API. |
| `BE-TASK-083` | `BE-WS-009` | Implement AI Practice Normal completion | `BE-TASK-082`, `BE-TASK-050` | 62 §11.15,63,64 | POST /api/v1/ai-conversations/{conversationId}/complete Normal path | Normal completion closes practice without assessment. | Normal completion closes non-assessable practice without Activity Result scoring or Assessment Result. | Normal completion tests. | Assessable evidence/scoring. |
| `BE-TASK-084` | `BE-WS-009` | Implement AI Practice approved evidence validation and packaging | `BE-TASK-077`, `BE-TASK-079`, `BE-TASK-046` | 62 §11.15-11.17,63,64 §6 | ai_practice_assessment_evidence | Approved evidence only; separate from Normal completion. | Approved evidence package validates assessable activity metadata and stores canonical transcript/completion data while excluding translation/transliteration. | Evidence validation/package tests. | Dependence on Normal completion; official score/mastery. |
| `BE-TASK-085` | `BE-WS-009` | Implement AI Practice Assessable completion through generic Runtime flow | `BE-TASK-084`, `BE-TASK-050`, `BE-TASK-066` | 62 §11.15-11.17,64,65 | POST /api/v1/ai-conversations/{conversationId}/complete Assessable path | Reuses Runtime/Assessment flow; AI does not score. | Assessable conversation completion creates Activity Result, invokes Assessment Engine, and stops at AssessmentResultGenerated. | Assessable AI completion integration tests. | AI-owned Assessment Result or Phase 2 continuation. |
| `BE-TASK-086` | `BE-WS-009` | Verify AI Practice authority boundaries | `BE-TASK-085` | 44,62,63,64,65 | AI Practice boundary | AI writes only AI Practice records/evidence. | AI Practice writes no assessment_result, knowledge_profile, learning_decision, official runtime events, or Phase 3 AI tables. | AI authority boundary tests. | AI official learning outputs. |
| `BE-TASK-087` | `BE-WS-010` | Implement Basic Progress dashboard data assembly | `BE-TASK-052`, `BE-TASK-065` | 52 FR-012,60 SRS-FR-012,62 | Activity Result and Assessment Result read data | Read model only; no Knowledge Profile/Learning Decision. | Dashboard read model assembles Activity Result and Assessment Result data only. | Dashboard assembly tests. | Analytics engine or Knowledge Profile computation. |
| `BE-TASK-088` | `BE-WS-010` | Implement learner progress/dashboard read model | `BE-TASK-087`, `BE-TASK-021` | 52,60,62 | Basic Progress Dashboard through existing result APIs | Read-only learner-owned data. | Read-only dashboard data is assembled behind existing Activity Result and Assessment Result APIs without Knowledge Profile or Learning Decision dependency. | Progress read-model and isolation tests. | New dashboard endpoint unless API spec adds one. |
| `BE-TASK-089` | `BE-WS-011` | Add endpoint-level observability hardening | `BE-TASK-006`, `BE-TASK-088` | 61,62,65 | All MVP endpoints | Observability hardening only. | Auth, domain, Runtime, result, progress, and AI endpoints emit consistent logs, traces, and metrics. | Observability field tests. | Official event handling. |
| `BE-TASK-090` | `BE-WS-011` | Add Runtime event and state observability hardening | `BE-TASK-066`, `BE-TASK-089` | 20,21,65 | Runtime event/state metrics | Observability separate from business handling. | Runtime event handling records latency, duplicate count, state transition metadata, and failure records. | Runtime observability tests. | Business consumer substitution. |
| `BE-TASK-091` | `BE-WS-011` | Add provider observability and safety dashboards feed | `BE-TASK-081`, `BE-TASK-089` | 63,64,65 | ai_practice_provider_record, ai_practice_safety_event | Operational metrics only. | AI provider/safety records expose operational metrics without official event semantics. | Provider observability tests. | Official provider events. |
| `BE-TASK-092` | `BE-WS-011` | Implement retry-safe hardening for completion and assessment | `BE-TASK-064`, `BE-TASK-090` | 62 §19,65 | Completion/assessment retry safety | Hardening after core lifecycle. | Retries and duplicate delivery are tolerated without duplicate official results. | Retry hardening tests. | Initial lifecycle prerequisite. |
| `BE-TASK-093` | `BE-WS-011` | Implement event replay tolerance hardening | `BE-TASK-092` | 65 §14-15 | Runtime event replay tolerance | Hardening; no broker guarantee. | Replay handling safely ignores or returns existing results; it is not a prerequisite for initial completion flow. | Replay tolerance tests. | Message broker design. |
| `BE-TASK-094` | `BE-WS-012` | Build API contract test suite for all MVP endpoints | `BE-TASK-093` | 62 | All MVP endpoints | Verification. | Contract tests cover auth, public, learning domain, runtime, result, placement, AI Practice, and progress endpoint/read-model coverage. | API contract suite passes. | Phase 2/3 APIs as MVP. |
| `BE-TASK-095` | `BE-WS-012` | Build database coverage test suite for all MVP entities | `BE-TASK-094` | 63 | All MVP entities | Verification. | Every MVP table has migration, repository/implementation, and test coverage. | Database coverage suite passes. | Future tables. |
| `BE-TASK-096` | `BE-WS-012` | Build official event coverage test suite | `BE-TASK-095` | 21,65 | All official MVP events | Verification. | Every MVP official event has publisher, immutable persistence, Runtime coordination handling where applicable, observability, idempotency, and tests. | Event coverage suite passes. | AssessmentFailed as official event. |
| `BE-TASK-097` | `BE-WS-012` | Build end-to-end MVP backend flow tests | `BE-TASK-096` | 52,60,62,63,64,65 | End-to-end MVP backend flows | Verification. | E2E tests cover login, selection, content read, start, complete, assessment, placement, AI Practice, progress, observability, and isolation. | E2E suite passes. | Phase 2/3 flow activation. |

## 6. Future and Blocked Work

| ID | Handling |
| --- | --- |
| `BE-FUTURE-P2-001` | Knowledge Profile read API GET /api/v1/knowledge-profiles/{learnerId}; Phase 2, not an MVP dependency. |
| `BE-FUTURE-P2-002` | Knowledge Profile Engine invocation after AssessmentResultGenerated; Phase 2 continuation only. |
| `BE-FUTURE-P2-003` | KnowledgeProfileUpdated official event publisher/consumer implementation; Phase 2 only. |
| `BE-FUTURE-P2-004` | Learning Decision active/history APIs GET /api/v1/learning-decisions/{learnerId} and /history; Phase 2 only. |
| `BE-FUTURE-P2-005` | Recommendation Engine invocation after KnowledgeProfileUpdated and LearningDecisionGenerated publication; Phase 2 only. |
| `BE-FUTURE-P3-001` | General AI Conversation Experience /api/v1/ai/conversations endpoint family; Phase 3 only. |
| `BE-FUTURE-P3-002` | AI Memory GET /api/v1/ai/memory/{learnerId} and memory lifecycle; Phase 3 only. |
| `BE-FUTURE-P3-003` | ai_provider_request and ai_provider_response persistence; Phase 3 provider audit only. |
| `BE-FUTURE-P3-004` | Full AI Learning Companion context snapshots and AI memory integration; Phase 3 only. |
| `BE-BLOCKED-001` | Advanced Authentication / Full Identity Platform, public signup, OAuth, MFA, SSO, roles, permissions, and organization identity. |
| `BE-BLOCKED-002` | Enrollment lifecycle and enrollment table; blocked pending architecture owner. |
| `BE-BLOCKED-003` | Educator/Admin authorization and formal educator entity. |
| `BE-BLOCKED-004` | Event broker, outbox_event physical split, replay delivery guarantee, and retention policy decisions. |
| `BE-BLOCKED-005` | Learning Context as a standalone table/entity. |
| `BE-BLOCKED-006` | Candidate events such as LearningProgramUpdated, LearningDesignCreated, and AssessmentBlueprintCreated pending Event Model review. |

## 7. Dependency Map

| Task Range | Dependency Rule |
| --- | --- |
| `BE-TASK-001`-`BE-TASK-006` | Platform foundations have no domain dependencies. |
| `BE-TASK-007`-`BE-TASK-016` | Schema, seed, repositories, audit, and idempotency depend on platform foundations only. |
| `BE-TASK-017`-`BE-TASK-022` | Auth depends on identity schema, audit, and learner fixtures. |
| `BE-TASK-023`-`BE-TASK-038` | Public and learning domain APIs depend on repositories, auth context where required, and idempotency for writes. |
| `BE-TASK-039`-`BE-TASK-045` | Runtime foundations depend on Runtime schema, event persistence, and idempotency. |
| `BE-TASK-046`-`BE-TASK-053` | Activity completion is ordered as validation -> Activity Result -> LearningActivityCompleted -> ActivityResultGenerated -> orchestration wiring -> endpoint -> replay. |
| `BE-TASK-054`-`BE-TASK-066` | Assessment is ordered as input resolution -> Runtime invocation -> AssessmentStarted -> deterministic evaluation -> Assessment Result -> AssessmentCompleted -> AssessmentResultGenerated -> failure observability -> idempotency/retry -> read APIs -> lifecycle integration verification. |
| `BE-TASK-067`-`BE-TASK-071` | Placement depends on generic activity and assessment flows only. |
| `BE-TASK-072`-`BE-TASK-086` | AI Practice depends on activity, AI Practice schema, provider gateway, generic completion, and generic Runtime/Assessment flows; approved evidence is independent of Normal completion. |
| `BE-TASK-087`-`BE-TASK-088` | Progress depends on Activity Result and Assessment Result reads. |
| `BE-TASK-089`-`BE-TASK-093` | Hardening depends on completed endpoint/runtime/AI paths. |
| `BE-TASK-094`-`BE-TASK-097` | Verification depends on completed implementation and hardening tasks. |

## 8. API Coverage Matrix

| API Area | MVP Endpoints / Actions | Executable Task Coverage |
| --- | --- | --- |
| Auth | POST /api/v1/auth/login; POST /api/v1/auth/logout; GET /api/v1/auth/me | `BE-TASK-018`, `BE-TASK-019`, `BE-TASK-020`, `BE-TASK-021`, `BE-TASK-022` |
| Public | GET /api/v1/public/landing-page; GET /api/v1/public/program-highlights | `BE-TASK-023`, `BE-TASK-024` |
| Learning Program | GET/POST /api/v1/learning-programs; GET/PUT/PATCH/DELETE /api/v1/learning-programs/{programId} | `BE-TASK-025`, `BE-TASK-026` |
| Program Structure | GET/PUT /api/v1/learning-programs/{programId}/program-structure | `BE-TASK-027`, `BE-TASK-028` |
| Learning Module | GET/POST /api/v1/learning-modules; GET/PUT/PATCH/DELETE /api/v1/learning-modules/{moduleId} | `BE-TASK-029`, `BE-TASK-030` |
| Learning Design | GET/POST /api/v1/learning-designs; GET/PUT /api/v1/learning-designs/{designId} | `BE-TASK-031`, `BE-TASK-032` |
| Learning Objective | GET/POST /api/v1/learning-objectives; GET/PUT/DELETE /api/v1/learning-objectives/{objectiveId} | `BE-TASK-033`, `BE-TASK-034` |
| Learning Activity | GET/POST /api/v1/learning-activities; GET/PUT /api/v1/learning-activities/{activityId}; POST /start; POST /complete | `BE-TASK-037`, `BE-TASK-038`, `BE-TASK-044`, `BE-TASK-051`, `BE-TASK-053` |
| Activity Result | GET /api/v1/activity-results; GET /api/v1/activity-results/{activityResultId} | `BE-TASK-052` |
| Assessment Blueprint | GET/POST /api/v1/assessment-blueprints; GET/PUT /api/v1/assessment-blueprints/{blueprintId} | `BE-TASK-054`, `BE-TASK-055` |
| Assessment Result | GET /api/v1/assessment-results; GET /api/v1/assessment-results/{resultId} | `BE-TASK-065` |
| Learning Content | GET/POST /api/v1/learning-contents; GET/PUT /api/v1/learning-contents/{contentId} | `BE-TASK-035`, `BE-TASK-036` |
| MVP AI Practice | POST /api/v1/learning-activities/{activityId}/ai-conversation/start; POST /api/v1/ai-conversations/{conversationId}/messages; POST /complete; GET /api/v1/ai-conversations/{conversationId} | `BE-TASK-072`, `BE-TASK-075`, `BE-TASK-076`, `BE-TASK-078`, `BE-TASK-082`, `BE-TASK-083`, `BE-TASK-085` |
| Placement Test | GET /api/v1/learning-activities?purpose=placement; POST /start; POST /complete; GET /api/v1/assessment-results/{resultId} | `BE-TASK-067`, `BE-TASK-068`, `BE-TASK-069`, `BE-TASK-070` |
| Progress Dashboard | Read-only learner progress/dashboard data consumed through Activity Result and Assessment Result APIs | `BE-TASK-052`, `BE-TASK-065`, `BE-TASK-087`, `BE-TASK-088` |

Non-MVP API families are mapped only to future identifiers: `GET /api/v1/knowledge-profiles/{learnerId}` -> `BE-FUTURE-P2-001`; `GET /api/v1/learning-decisions/{learnerId}` and `/history` -> `BE-FUTURE-P2-004`; `/api/v1/ai/conversations` -> `BE-FUTURE-P3-001`; `/api/v1/ai/memory/{learnerId}` -> `BE-FUTURE-P3-002`.

## 9. Database Coverage Matrix

| MVP Entity | Migration | Implementation | Test Coverage |
| --- | --- | --- | --- |
| `learner` | `BE-TASK-007` | `BE-TASK-013`, `BE-TASK-020`, `BE-TASK-021` | `BE-TASK-022`, `BE-TASK-095` |
| `learner_auth_account` | `BE-TASK-007` | `BE-TASK-017`, `BE-TASK-018` | `BE-TASK-017`, `BE-TASK-018`, `BE-TASK-095` |
| `auth_session` | `BE-TASK-007` | `BE-TASK-018`, `BE-TASK-019`, `BE-TASK-020` | `BE-TASK-018`, `BE-TASK-019`, `BE-TASK-020`, `BE-TASK-095` |
| `landing_page_config` | `BE-TASK-007` | `BE-TASK-012`, `BE-TASK-023` | `BE-TASK-023`, `BE-TASK-095` |
| `learning_program` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-025`, `BE-TASK-026` | `BE-TASK-025`, `BE-TASK-026`, `BE-TASK-095` |
| `program_structure` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-027`, `BE-TASK-028` | `BE-TASK-027`, `BE-TASK-028`, `BE-TASK-095` |
| `learning_module` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-029`, `BE-TASK-030` | `BE-TASK-029`, `BE-TASK-030`, `BE-TASK-095` |
| `learning_design` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-031`, `BE-TASK-032` | `BE-TASK-031`, `BE-TASK-032`, `BE-TASK-095` |
| `learning_objective` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-033`, `BE-TASK-034` | `BE-TASK-033`, `BE-TASK-034`, `BE-TASK-095` |
| `learning_activity` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-037`, `BE-TASK-038`, `BE-TASK-044`, `BE-TASK-051`, `BE-TASK-067`, `BE-TASK-072` | `BE-TASK-037`, `BE-TASK-051`, `BE-TASK-067`, `BE-TASK-071`, `BE-TASK-095` |
| `assessment_blueprint` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-054`, `BE-TASK-055`, `BE-TASK-056`, `BE-TASK-059` | `BE-TASK-054`, `BE-TASK-055`, `BE-TASK-059`, `BE-TASK-095` |
| `content_item` | `BE-TASK-008` | `BE-TASK-012`, `BE-TASK-035`, `BE-TASK-036` | `BE-TASK-035`, `BE-TASK-036`, `BE-TASK-095` |
| `learning_state` | `BE-TASK-009` | `BE-TASK-039`, `BE-TASK-044`, `BE-TASK-045` | `BE-TASK-039`, `BE-TASK-044`, `BE-TASK-045`, `BE-TASK-095` |
| `state_transition` | `BE-TASK-009` | `BE-TASK-040`, `BE-TASK-045` | `BE-TASK-040`, `BE-TASK-045`, `BE-TASK-095` |
| `runtime_event` | `BE-TASK-009` | `BE-TASK-041`, `BE-TASK-042`, `BE-TASK-048`, `BE-TASK-049`, `BE-TASK-058`, `BE-TASK-061`, `BE-TASK-062` | `BE-TASK-041`, `BE-TASK-096` |
| `activity_result` | `BE-TASK-009` | `BE-TASK-047`, `BE-TASK-052`, `BE-TASK-056`, `BE-TASK-069`, `BE-TASK-085` | `BE-TASK-047`, `BE-TASK-052`, `BE-TASK-095` |
| `assessment_result` | `BE-TASK-009` | `BE-TASK-060`, `BE-TASK-065`, `BE-TASK-070`, `BE-TASK-085` | `BE-TASK-060`, `BE-TASK-065`, `BE-TASK-095` |
| `audit_log` | `BE-TASK-007` | `BE-TASK-015`, `BE-TASK-017`, `BE-TASK-032`, `BE-TASK-036` | `BE-TASK-015`, `BE-TASK-095` |
| `system_event_log` | `BE-TASK-007` | `BE-TASK-015`, `BE-TASK-063`, `BE-TASK-080` | `BE-TASK-015`, `BE-TASK-063`, `BE-TASK-095` |
| `idempotency_key` | `BE-TASK-007` | `BE-TASK-016`, `BE-TASK-053`, `BE-TASK-064`, `BE-TASK-092` | `BE-TASK-016`, `BE-TASK-053`, `BE-TASK-064`, `BE-TASK-095` |
| `ai_practice_conversation` | `BE-TASK-010` | `BE-TASK-072`, `BE-TASK-082`, `BE-TASK-083`, `BE-TASK-085` | `BE-TASK-072`, `BE-TASK-082`, `BE-TASK-095` |
| `ai_practice_message` | `BE-TASK-010` | `BE-TASK-075`, `BE-TASK-076`, `BE-TASK-077`, `BE-TASK-078`, `BE-TASK-079` | `BE-TASK-075`, `BE-TASK-077`, `BE-TASK-095` |
| `ai_practice_assessment_evidence` | `BE-TASK-010` | `BE-TASK-084`, `BE-TASK-085` | `BE-TASK-084`, `BE-TASK-085`, `BE-TASK-095` |
| `ai_practice_provider_record` | `BE-TASK-010` | `BE-TASK-074`, `BE-TASK-091` | `BE-TASK-074`, `BE-TASK-091`, `BE-TASK-095` |
| `ai_practice_safety_event` | `BE-TASK-010` | `BE-TASK-080`, `BE-TASK-091` | `BE-TASK-080`, `BE-TASK-091`, `BE-TASK-095` |

Phase 2 tables `knowledge_profile`, `knowledge_profile_snapshot`, and `learning_decision` are `BE-FUTURE-P2-001` through `BE-FUTURE-P2-005`. Phase 3 tables `ai_conversation`, `ai_message`, `ai_memory`, `ai_context_snapshot`, `ai_provider_request`, `ai_provider_response`, and `ai_safety_event` are `BE-FUTURE-P3-001` through `BE-FUTURE-P3-004`. Future/open tables `educator`, `organization`, `user_account`, `role`, `permission`, `enrollment`, `learning_context`, and `outbox_event` are `BE-BLOCKED-001` through `BE-BLOCKED-006`.

## 10. Official Event Coverage Matrix

| Official MVP Event | Official Publisher | Immutable Persistence | Runtime-Mediated Invocation / Coordination | Dispatch / Lifecycle Verification | Observability | Idempotency | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `LearningProgramCreated` | Learning Program via `BE-TASK-026` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-026` | `BE-TASK-026`, `BE-TASK-096` |
| `LearningProgramPublished` | Learning Program via `BE-TASK-026` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-026` | `BE-TASK-026`, `BE-TASK-096` |
| `ProgramStructureAssigned` | Program Structure via `BE-TASK-028` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-028` | `BE-TASK-028`, `BE-TASK-096` |
| `LearningModuleCreated` | Learning Module via `BE-TASK-030` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-030` | `BE-TASK-030`, `BE-TASK-096` |
| `LearningModulePublished` | Learning Module via `BE-TASK-030` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-030` | `BE-TASK-030`, `BE-TASK-096` |
| `LearningObjectiveCreated` | Learning Objective via `BE-TASK-034` | `BE-TASK-041` | `BE-TASK-043` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-034` | `BE-TASK-034`, `BE-TASK-096` |
| `AssessmentBlueprintUpdated` | Assessment Blueprint via `BE-TASK-055` | `BE-TASK-041` | `BE-TASK-056` | `BE-TASK-043` | `BE-TASK-089` | `BE-TASK-016`, `BE-TASK-055` | `BE-TASK-055`, `BE-TASK-096` |
| `LearningActivityCompleted` | Learning Activity via `BE-TASK-048` | `BE-TASK-041` | `BE-TASK-045`, `BE-TASK-050` | `BE-TASK-043`, `BE-TASK-096` | `BE-TASK-090` | `BE-TASK-016`, `BE-TASK-053` | `BE-TASK-048`, `BE-TASK-096` |
| `ActivityResultGenerated` | Learning Activity via `BE-TASK-049` | `BE-TASK-041` | `BE-TASK-050`, `BE-TASK-057` | `BE-TASK-043`, `BE-TASK-066`, `BE-TASK-096` | `BE-TASK-090` | `BE-TASK-016`, `BE-TASK-053` | `BE-TASK-049`, `BE-TASK-096` |
| `AssessmentStarted` | Assessment Engine via `BE-TASK-058` | `BE-TASK-041` | Runtime-mediated invocation via `BE-TASK-057` | Dispatch via `BE-TASK-043`; lifecycle verification via `BE-TASK-066` | `BE-TASK-090` | `BE-TASK-016`, `BE-TASK-064` | `BE-TASK-058`, `BE-TASK-096` |
| `AssessmentCompleted` | Assessment Engine via `BE-TASK-061` | `BE-TASK-041` | Runtime dispatch/persistence; no separate MVP state transition. | Dispatch via `BE-TASK-043`; lifecycle verification via `BE-TASK-066` | `BE-TASK-090` | `BE-TASK-016`, `BE-TASK-064` | `BE-TASK-061`, `BE-TASK-096` |
| `AssessmentResultGenerated` | Assessment Engine via `BE-TASK-062` | `BE-TASK-041` | `BE-TASK-045`, `BE-TASK-066` | `BE-TASK-043`, `BE-TASK-066`, `BE-TASK-096` | `BE-TASK-090` | `BE-TASK-016`, `BE-TASK-064` | `BE-TASK-062`, `BE-TASK-096` |

`AssessmentStarted` and `AssessmentCompleted` are official Assessment Engine events, not observability-only events; Runtime-mediated invocation, immutable persistence, dispatch/coordination, lifecycle verification, and observability are tracked separately. `AssessmentCompleted` has no separate MVP state transition beyond Runtime dispatch/persistence and lifecycle verification. `AssessmentFailed` remains observability-only and is implemented as `system_event_log`/metrics/traces in `BE-TASK-063`; it is not promoted to an official Runtime Event, is not a business trigger, and creates no Assessment Result. `KnowledgeProfileUpdated` and `LearningDecisionGenerated` remain official Phase 2 events mapped to `BE-FUTURE-P2-003` and `BE-FUTURE-P2-005`, not MVP dependencies.

## 11. Engine Matrix

| Engine / Component | MVP Role | Consumes | Produces / Writes | Task Coverage |
| --- | --- | --- | --- | --- |
| Assessment Engine | Active MVP engine, Runtime-mediated only. | `ActivityResultGenerated`, `AssessmentBlueprintUpdated`, Activity Result, Assessment Blueprint, optional approved AI Practice evidence. | Deterministic evaluation output, immutable `assessment_result`, `AssessmentStarted`, `AssessmentCompleted`, `AssessmentResultGenerated`, observability-only `AssessmentFailed`. | `BE-TASK-056`-`BE-TASK-066`, `BE-TASK-096`, `BE-TASK-097` |
| Knowledge Profile Engine | Phase 2 only. | `AssessmentResultGenerated` in Phase 2. | `knowledge_profile`, `KnowledgeProfileUpdated`. | `BE-FUTURE-P2-002`, `BE-FUTURE-P2-003` |
| Recommendation Engine | Phase 2 only. | `KnowledgeProfileUpdated` in Phase 2. | `learning_decision`, `LearningDecisionGenerated`. | `BE-FUTURE-P2-004`, `BE-FUTURE-P2-005` |
| AI Personal Learning Agent / AI Practice | MVP-limited practice partner only. | Learner message, canonical transcript, activity/objective context, provider response. | `ai_practice_conversation`, `ai_practice_message`, `ai_practice_assessment_evidence`, safety/provider records; no official events or official scoring. | `BE-TASK-072`-`BE-TASK-086` |
| AI Provider Gateway | MVP provider abstraction for AI Practice, STT, and TTS. | Provider request metadata and bounded practice context. | `ai_practice_provider_record`; no official events and no Phase 3 provider request/response tables. | `BE-TASK-073`, `BE-TASK-074`, `BE-TASK-076`, `BE-TASK-078`, `BE-TASK-091` |

## 12. AI Practice Matrix

| Required AI Practice Capability | Task Coverage | Boundary |
| --- | --- | --- |
| Text interaction | `BE-TASK-075` | Required MVP message path. |
| Mandatory STT input | `BE-TASK-076` | Voice input records STT metadata and canonical transcript when voice is used. |
| Canonical target-language transcript | `BE-TASK-077` | Official conversation record; translation/transliteration excluded from assessment. |
| Mandatory TTS output | `BE-TASK-078` | Agent response must support TTS metadata/audio reference. |
| Translation/transliteration support | `BE-TASK-079` | Learner support only; never official assessment source. |
| Provider observability | `BE-TASK-074`, `BE-TASK-091` | Provider records are observability-only and provider-agnostic. |
| Safety records | `BE-TASK-080` | Safety events are AI Practice records, not official Runtime Events. |
| Fallback boundaries | `BE-TASK-081` | Provider/STT/TTS failure does not create Learning Decision or invoke Phase 2 engines. |
| Normal completion | `BE-TASK-083` | Closes non-assessable practice without Assessment Result. |
| Approved evidence | `BE-TASK-084` | Depends on canonical transcript, translation exclusion, assessable metadata validation, and completion validation; does not depend on Normal completion. |
| Assessable completion | `BE-TASK-085` | Packages approved evidence and reuses generic Runtime/Assessment flow. |
| Authority verification | `BE-TASK-086` | AI writes no assessment_result, knowledge_profile, learning_decision, official events, or Phase 3 tables. |

## 13. Feature-to-Backend Task Traceability Matrix

| Feature ID | Frozen MVP Feature | Backend Task Coverage | Coverage Note |
| --- | --- | --- | --- |
| `FB-MVP-001` | Learning Program Management and Manual Program / Subject Selection | `BE-TASK-025`, `BE-TASK-026` | Backend covers program APIs/events; frontend presentation does not add enrollment/adaptive selection. |
| `FB-MVP-002` | Program Structure Assignment | `BE-TASK-027`, `BE-TASK-028` | Backend covers structure read/assignment and official assignment event. |
| `FB-MVP-003` | Learning Module Management | `BE-TASK-029`, `BE-TASK-030` | Backend covers module APIs/events; no adaptive sequencing dependency. |
| `FB-MVP-004` | Learning Design Management | `BE-TASK-031`, `BE-TASK-032` | Backend covers design APIs; candidate design events remain out of MVP. |
| `FB-MVP-005` | Learning Objective Management | `BE-TASK-033`, `BE-TASK-034` | Backend covers objective APIs and LearningObjectiveCreated. |
| `FB-MVP-006` | Learning Activity Execution | `BE-TASK-037`, `BE-TASK-038`, `BE-TASK-044`, `BE-TASK-046`, `BE-TASK-047`, `BE-TASK-048`, `BE-TASK-049`, `BE-TASK-050`, `BE-TASK-051`, `BE-TASK-052`, `BE-TASK-053` | Backend covers activity read/write, start, completion, Activity Result, events, and replay. |
| `FB-MVP-007` | Assessment Blueprint Management | `BE-TASK-054`, `BE-TASK-055` | Backend covers blueprint APIs and AssessmentBlueprintUpdated. |
| `FB-MVP-008` | Assessment Engine Execution | `BE-TASK-056`, `BE-TASK-057`, `BE-TASK-058`, `BE-TASK-059`, `BE-TASK-060`, `BE-TASK-061`, `BE-TASK-062`, `BE-TASK-063`, `BE-TASK-064`, `BE-TASK-065`, `BE-TASK-066` | Backend covers Runtime-mediated invocation, deterministic evaluation, result persistence, events, failure observability, idempotency, and read APIs. |
| `FB-MVP-009` | Learning Content Delivery | `BE-TASK-035`, `BE-TASK-036` | Backend covers content read/write/versioning; presentation does not create extra backend behavior. |
| `FB-MVP-010` | Runtime State Machine | `BE-TASK-039`, `BE-TASK-040`, `BE-TASK-044`, `BE-TASK-045` | Backend covers state, transitions, and start/completion state flow. |
| `FB-MVP-011` | Runtime Event Coordination | `BE-TASK-041`, `BE-TASK-042`, `BE-TASK-043`, `BE-TASK-048`, `BE-TASK-049`, `BE-TASK-058`, `BE-TASK-061`, `BE-TASK-062`, `BE-TASK-096` | Backend covers official event persistence, authority validation, dispatch, publication, and event tests. |
| `FB-MVP-012` | Basic Learner Progress Dashboard | `BE-TASK-052`, `BE-TASK-065`, `BE-TASK-087`, `BE-TASK-088` | Backend uses existing Activity/Assessment Result reads; no Knowledge Profile or Learning Decision dependency. |
| `FB-MVP-013` | Public Landing Page | `BE-TASK-023`, `BE-TASK-024` | Backend covers public read APIs; no signup/enrollment behavior. |
| `FB-MVP-014` | AI Conversation Practice for Learning Objective | `BE-TASK-072`, `BE-TASK-073`, `BE-TASK-074`, `BE-TASK-075`, `BE-TASK-076`, `BE-TASK-077`, `BE-TASK-078`, `BE-TASK-079`, `BE-TASK-080`, `BE-TASK-081`, `BE-TASK-082`, `BE-TASK-083`, `BE-TASK-084`, `BE-TASK-085`, `BE-TASK-086` | Backend covers text, STT, TTS, canonical transcript, provider records, safety, fallback, Normal and Assessable completion, approved evidence, and authority boundaries. |
| `FB-MVP-015` | MVP Basic Learner Authentication | `BE-TASK-017`, `BE-TASK-018`, `BE-TASK-019`, `BE-TASK-020`, `BE-TASK-021`, `BE-TASK-022` | Backend covers login/logout/me/session context and learner isolation; no advanced identity. |
| `FB-MVP-016` | Placement Test as Specialized Assessable Learning Activity | `BE-TASK-067`, `BE-TASK-068`, `BE-TASK-069`, `BE-TASK-070`, `BE-TASK-071` | Backend reuses Activity and Assessment flows; no placement table/resource/engine/event. |

Feature coverage result: every `FB-MVP-001` through `FB-MVP-016` has backend coverage. Frontend-only presentation does not create unnecessary backend behavior. Phase 2/3 features appear only as future identifiers and are not MVP task dependencies.

## 14. Implementation Sequence

1. Complete `BE-TASK-001`-`BE-TASK-016` to establish platform, MVP schema, audit, and idempotency.
2. Complete `BE-TASK-017`-`BE-TASK-038` for auth, public APIs, and learning domain APIs.
3. Complete `BE-TASK-039`-`BE-TASK-045` for Runtime state, event persistence, dispatch, start flow, and state transitions.
4. Complete `BE-TASK-046`-`BE-TASK-053` for activity completion in semantic order: validation, Activity Result, events, orchestration wiring, endpoint, read APIs, replay.
5. Complete `BE-TASK-054`-`BE-TASK-066` for Assessment Blueprint, Runtime-mediated Assessment Engine invocation, AssessmentStarted, deterministic evaluation, immutable Assessment Result, AssessmentCompleted, AssessmentResultGenerated, failure observability, idempotency/retry, read APIs, and lifecycle verification.
6. Complete `BE-TASK-067`-`BE-TASK-071` for Placement Test by reusing generic Activity and Assessment flows.
7. Complete `BE-TASK-072`-`BE-TASK-086` for MVP AI Conversation Practice and authority boundaries, with Normal and Assessable completion kept separate.
8. Complete `BE-TASK-087`-`BE-TASK-093` for progress reads and hardening.
9. Complete `BE-TASK-094`-`BE-TASK-097` for API, database, event, and end-to-end verification.

## 15. Definition of Done

* All MVP endpoints in the API Coverage Matrix have contract tests and learner-isolation coverage where authenticated; Basic Progress Dashboard uses the existing Activity Result and Assessment Result read APIs.
* All MVP database entities have migration, implementation, and test coverage.
* All official MVP events have single official publisher, immutable persistence, Runtime coordination handling where applicable, separate observability, idempotency, and tests.
* Activity completion lifecycle is implemented in the order validation -> Runtime-owned Activity Result -> LearningActivityCompleted -> ActivityResultGenerated -> orchestration wiring -> endpoint -> replay.
* Assessment lifecycle is implemented as input resolution -> Runtime-mediated invocation -> `AssessmentStarted`, then a success branch (`deterministic evaluation` -> immutable Assessment Result -> `AssessmentCompleted` -> `AssessmentResultGenerated`) or a failure branch (`AssessmentFailed` observability record only, no official Runtime Event, no business trigger, no Assessment Result).
* Idempotency prevents duplicate Activity Result and Assessment Result creation for repeated completion or assessment retries.
* Runtime mediates Assessment Engine invocation and does not invoke Knowledge Profile Engine or Recommendation Engine in MVP.
* Placement Test has no separate table, endpoint family, engine, or result owner.
* AI Practice supports text, STT, TTS, canonical transcript, Normal/Assessable completion, approved evidence, provider observability, safety, and fallback boundaries.
* AI Practice approved evidence does not depend on Normal completion; Normal and Assessable completion are separate paths.
* Observability-only records remain logs, metrics, traces, audit records, system_event_log, or AI Practice provider/safety records and are not official events.
* Future and blocked work is not referenced as an MVP dependency.

## 16. Compliance Checklist

* PASS — No architecture, entity, column, endpoint, event, engine ownership, business rule, or MVP scope is invented.
* PASS — Executable MVP task IDs are sequential from `BE-TASK-001` through `BE-TASK-097`.
* PASS — No executable MVP task depends on a future or blocked identifier.
* PASS — Dependency graph is acyclic by construction because every dependency points to an earlier task.
* PASS — Semantic completion lifecycle order is explicitly validation -> Activity Result -> events -> orchestration -> endpoint -> replay.
* PASS — Semantic assessment lifecycle is explicitly branched after `AssessmentStarted`: success continues through deterministic evaluation, Assessment Result, `AssessmentCompleted`, and `AssessmentResultGenerated`; failure records `AssessmentFailed` through approved observability mechanisms only.
* PASS — Deterministic Assessment Blueprint evaluation is an explicit task and is not hidden in persistence.
* PASS — Phase 2 Knowledge Profile and Learning Decision work is isolated under `BE-FUTURE-P2-###`.
* PASS — Phase 3 general AI Conversation, AI Memory, and provider request/response persistence are isolated under `BE-FUTURE-P3-###`.
* PASS — Open architecture issues are isolated under `BE-BLOCKED-###`.
* PASS — Idempotency foundation appears before completion, Activity Result persistence, assessment, and AI completion tasks.
* PASS — Concurrency/retry/replay appears as later hardening.
* PASS — Observability is split between early primitives and later flow-specific hardening.
* PASS — Migrations and seed data are restricted to MVP entities and capabilities.
* PASS — Official MVP event coverage distinguishes publisher, persistence, Runtime coordination handling, observability, idempotency, and tests.
* PASS — AI Practice authority boundaries and separate Normal/Assessable completion dependencies are explicitly verified.
* PASS — Every `FB-MVP-001` through `FB-MVP-016` maps to executable backend tasks.

## 17. Internal Consistency Verification

| Check | Result |
| --- | --- |
| Every referenced executable task ID exists | PASS |
| No duplicate executable task ID exists | PASS |
| Task numbering is sequential | PASS |
| No MVP task depends on future or blocked work | PASS |
| No direct or transitive circular dependency exists | PASS |
| Completion lifecycle order is semantically correct | PASS |
| Assessment lifecycle success/failure branch semantics are correct | PASS |
| Every MVP endpoint maps to at least one executable task | PASS |
| Every MVP database entity maps to migration, implementation, and test coverage | PASS |
| Every official MVP event maps to publisher, persistence, Runtime coordination handling, observability, idempotency, and tests | PASS |
| Every `FB-MVP-001` through `FB-MVP-016` maps to executable backend tasks | PASS |
| Placement Test reuses generic Activity and Assessment flows | PASS |
| AI Practice coverage includes text, STT, TTS, canonical transcript, completion modes, approved evidence, provider observability, safety, and fallback | PASS |

## 18. Backend MVP Task Breakdown Freeze Declaration

This Backend MVP Task Breakdown is frozen as the implementation task source for the Kaifa v2 backend MVP. The task graph is dependency-safe and acyclic. All MVP APIs, database entities, official events, engines, and `FB-MVP-001` through `FB-MVP-016` features are traceable to executable backend tasks. Runtime, Learning Activity, Assessment Engine, AI Layer, and frontend ownership boundaries remain frozen. Future and blocked work is excluded from MVP executable tasks. Future changes require controlled review against the authoritative frozen documents listed in this document header.

## 19. Review Notes

This document is Freeze and ready for implementation use.
