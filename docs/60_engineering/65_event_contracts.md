# Event Contracts

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | ----- | ---------- | ------- | ------------ |
| 1.1 | Freeze | Engineering | `20_state_machine.md`, `21_event_model.md`, `60_srs.md`, `62_api_spec.md`, `63_database_model.md`, `99_architecture_decisions.md` | Runtime, Engine, Backend, QA, Observability, `64_engine_contracts.md` | 2026-07-11 |

---

# 1. Purpose

Dokumen ini mendefinisikan **Event Contracts** untuk Kaifa v2: envelope event, payload event, idempotency, retry, observability metadata, persistence alignment, dan traceability event.

Dokumen ini membuat Event Model yang telah dibekukan menjadi implementable bagi engineering tanpa mengubah arsitektur.

Klarifikasi:

* Dokumen ini tidak membuat event baru di luar `21_event_model.md`.
* Dokumen ini tidak menggantikan `21_event_model.md` sebagai source of truth untuk event classification, event ownership, naming convention, dan event flow.
* Dokumen ini tidak mendefinisikan business rule. Business rule tetap milik Learning Domain (AD-002).
* Dokumen ini tidak mendefinisikan message broker, queue, atau infrastruktur fisik.
* Dokumen ini tidak memindahkan ownership state kepada Engine. State Machine tetap dimiliki Runtime.

---

# 2. Scope

## In Scope

* Standard event envelope.
* Official event payload contract.
* Publisher and consumer expectations.
* Event ordering constraints.
* Idempotency requirements.
* Retry and failure handling.
* Observability and audit metadata.
* Event-to-state transition mapping.
* Event-to-database persistence alignment.
* API-to-event alignment.
* Engine-contract-to-event alignment.
* AI governance compliance for event usage.

## Out of Scope

* Message broker technology.
* Queue configuration.
* Physical infrastructure.
* OpenAPI/Swagger.
* Physical database schema beyond references to `63_database_model.md`.
* Business rule definition.
* Creation of new official event types outside `21_event_model.md`.
* AI provider-specific event schema.

---

# 3. Relationship with `21_event_model.md`

`21_event_model.md` remains the **single source of truth** for:

* event classification,
* event ownership,
* event naming convention,
* event flow,
* official conceptual event language.

This document is the **implementation contract** for:

* event envelope,
* payload contract,
* idempotency metadata,
* retry and failure handling expectations,
* observability metadata,
* persistence alignment,
* cross-document engineering traceability.

If a proposed event is not explicitly listed or clearly supported by `21_event_model.md`, it must not be treated as an official event. It must be placed under Candidate Events / Open Issues until Event Model architecture review approves it. `64_engine_contracts.md` is an implementation consumer of this contract and must remain aligned with it.

---

# 4. Event Contract Principles

1. **Immutable** — Event tidak dapat diubah setelah dipublikasikan.
2. **Single Official Publisher** — Setiap official event hanya memiliki satu publisher resmi.
3. **Runtime-Oriented Coordination** — Event mengoordinasikan Runtime dan Engine. Engine tidak memanggil Engine lain secara langsung.
4. **No Hidden Business Rule** — Event tidak menyimpan business rule tersembunyi.
5. **Reference by Stable ID** — Payload event mereferensikan entitas melalui stable ID.
6. **No Large Object Duplication** — Payload tidak menduplikasi domain object besar.
7. **Correlation ID and Trace ID Required** — Setiap event membawa `correlationId` dan `traceId`.
8. **Idempotency Support** — Event pemicu proses engine membawa `idempotencyKey`.
9. **Replay Tolerance** — Consumer toleran terhadap replay dan duplicate delivery.
10. **Ordering Follows State Machine** — Ordering mengikuti `20_state_machine.md` dan AD-005.
11. **Observable Failure** — Failure harus dapat dipantau.
12. **AI Layer Is Not Official Event Publisher** — AI Personal Learning Agent dan AI Provider Gateway tidak mempublikasikan official Domain Event atau Engine Event kecuali ditetapkan eksplisit oleh `21_event_model.md`.

---

# 5. Standard Event Envelope

```json
{
  "eventId": "event-uuid",
  "eventType": "AssessmentResultGenerated",
  "eventVersion": "1.0",
  "occurredAt": "2026-07-05T04:12:00Z",
  "publisher": "AssessmentEngine",
  "aggregateType": "AssessmentResult",
  "aggregateId": "assessment-result-77af",
  "correlationId": "corr-8f1e2c",
  "traceId": "trace-4471ab",
  "idempotencyKey": "assess-activityresult-9c21",
  "payload": {},
  "metadata": {}
}
```

| Field | Required | Description |
| ----- | -------- | ----------- |
| `eventId` | Yes | Unique event identifier. Maps to `runtime_event.event_id`. |
| `eventType` | Yes | Official event name following `<Entity><PastTense>`. |
| `eventVersion` | Yes | Event payload contract version. |
| `occurredAt` | Yes | Timestamp when event occurred. |
| `publisher` | Yes | Official publisher according to `21_event_model.md`. |
| `aggregateType` | Yes | Entity type that the event belongs to. |
| `aggregateId` | Yes | Stable identifier of aggregate. |
| `correlationId` | Yes | Business-flow correlation identifier. |
| `traceId` | Yes | Request-level trace identifier. |
| `idempotencyKey` | Conditional | Required for retryable or engine-triggering events. |
| `payload` | Yes | Event-specific payload using stable references. |
| `metadata` | Optional | Non-business metadata such as `processingTimeMs`, `engineVersion`, or `actorSource`. |

`actorId` / `actorSource` may be included in `metadata` when available and may remain nullable as an implementation consideration. MVP Basic Learner Authentication is already defined by frozen `62_api_spec.md` and `63_database_model.md`; actor context comes from resolved Runtime/application context. This document does not define JWT, cookie, session technology, OAuth, MFA, SSO, role, or permission. Advanced Authentication and Educator authorization remain Open Issues.

`causationId` is not required because it is not currently defined by `21_event_model.md`, `62_api_spec.md`, or `63_database_model.md`.

---

# 6. Event Versioning

* `eventVersion` is required on every official event.
* Adding optional payload fields is non-breaking if consumers can safely ignore them.
* Removing a required field, renaming a required field, or changing the meaning of an existing field requires a new `eventVersion`.
* Consumers should ignore unknown optional fields where safe.
* Event version changes must not change event ownership, event flow, or business meaning defined by `21_event_model.md`.

---

# 7. Official Event Ownership Matrix

| Event | Publisher | Consumers | Layer | Status |
| ----- | --------- | --------- | ----- | ------ |
| `LearningProgramCreated` | Learning Program | Runtime / Observability | Learning Domain | Official |
| `LearningProgramPublished` | Learning Program | Runtime / Observability | Learning Domain | Official |
| `ProgramStructureAssigned` | Program Structure | Runtime / Observability | Learning Domain | Official |
| `LearningModuleCreated` | Learning Module | Runtime / Observability | Learning Domain | Official |
| `LearningModulePublished` | Learning Module | Runtime / Observability | Learning Domain | Official |
| `LearningObjectiveCreated` | Learning Objective | Runtime / Observability | Learning Domain | Official |
| `LearningActivityCompleted` | Learning Activity | Runtime | Learning Domain | Official |
| `ActivityResultGenerated` | Learning Activity | Assessment Engine / Runtime | Runtime | Official Runtime Flow; Runtime owns Activity Result persistence and orchestration |
| `AssessmentBlueprintUpdated` | Assessment Blueprint | Assessment Engine / Runtime | Learning Domain | Official |
| `AssessmentStarted` | Assessment Engine | Runtime / Observability | Engine | Official |
| `AssessmentCompleted` | Assessment Engine | Runtime / Observability | Engine | Official |
| `AssessmentResultGenerated` | Assessment Engine | Knowledge Profile Engine (Phase 2) / Runtime | Engine | Official |
| `KnowledgeProfileUpdated` | Knowledge Profile Engine | Recommendation Engine / AI Layer read-only / Runtime | Engine | Official (Phase 2) |
| `LearningDecisionGenerated` | Recommendation Engine | Application / AI Layer read-only / Runtime | Engine | Official (Phase 2) |

`ActivityResultGenerated` retains Learning Activity as its single official publisher per `21_event_model.md`. The event belongs to the Learning Activity / Runtime completion flow: Activity Result is a Runtime-owned, non-evaluative record produced through official Learning Activity completion behavior and persisted/orchestrated by Runtime. Frontend, API clients, Assessment Engine, and AI Layer do not own or write Activity Result. It contains no official score, mastery, pass/fail, or Learning Decision.

---

# 8. Candidate Events / Open Issue Events

The following events are structurally plausible but are **not official events** unless `21_event_model.md` is updated through Architecture Review.

| Candidate Event | Reason Not Official Yet | Handling |
| --------------- | ----------------------- | -------- |
| `LearningProgramUpdated` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `LearningProgramArchived` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `LearningModuleUpdated` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `LearningModuleArchived` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `LearningDesignCreated` | Event group exists, but event is not explicitly listed. | Candidate event pending review. |
| `LearningDesignUpdated` | Event group exists, but event is not explicitly listed. | Candidate event pending review. |
| `LearningObjectiveUpdated` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `LearningObjectiveArchived` | Not explicitly listed in `21_event_model.md`. | Audit log or Event Model review. |
| `AssessmentBlueprintCreated` | Not explicitly listed in `21_event_model.md`. | Candidate event pending review. |
| `AssessmentStrategyUpdated` | Too specific; strategy is part of Assessment Blueprint. | Do not use; use `AssessmentBlueprintUpdated` if applicable. |

Candidate events must not appear in official payload contracts, ownership matrices, sequence/integration flows, or act as official integration contracts. Promotion requires Architecture Review and an update to `21_event_model.md`.

## 8.1 MVP Observability-Only Decision

Engine lifecycle and failure signals remain **observability-only signals**, separate from Candidate Events.

The following signals are not part of the official Runtime Event Contract:

* `AssessmentFailed`
* `KnowledgeProfileUpdateStarted`
* `KnowledgeProfileUpdateFailed`
* `RecommendationStarted`
* `RecommendationCompleted`
* `RecommendationFailed`

These signals may be represented as logs, traces, metrics, audit records, `system_event_log` records, or internal engine diagnostics.

They must not be used as:

* cross-layer business triggers,
* official integration contracts,
* required inputs for downstream engines,
* canonical learning pipeline transitions.

For MVP, the official post-assessment runtime flow stops at `AssessmentResultGenerated`. `KnowledgeProfileUpdated` and `LearningDecisionGenerated` remain Phase 2 official events only.

Failure and lifecycle observability must not change Runtime state ownership, Engine ownership, or the Canonical Learning Pipeline.

If retry orchestration, failure recovery workflow, or audit-grade lifecycle tracking requires an official event in a future phase, it must be promoted through Architecture Review and reflected in `21_event_model.md` before becoming an official Runtime Event Contract.

---

# 9. Official Event Payload Contracts

All JSON blocks in this section are illustrative, non-normative event-specific payload examples. Each is carried inside the Standard Event Envelope from Section 5, including `correlationId`, `traceId`, and `idempotencyKey` where retryable or engine-triggering. Payloads use stable references and do not define literal OpenAPI schemas or new business meaning.

## 9.1 `LearningActivityCompleted`

Required payload:

```json
{
  "learnerRef": "learner-<id>",
  "learningActivityRef": "learning-activity-<id>",
  "learningStateRef": "learning-state-<id>",
  "completedAt": "2026-07-05T04:00:00Z"
}
```

Related: SRS-FR-006, SRS-FR-010, SRS-FR-011; API `POST /api/v1/learning-activities/{activityId}/complete`; DB `learning_activity`, `learning_state`, `runtime_event`; AD-003, AD-005.

## 9.2 `ActivityResultGenerated`

Required payload:

```json
{
  "activityResultRef": "activity-result-<id>",
  "learnerRef": "learner-<id>",
  "learningActivityRef": "learning-activity-<id>",
  "generatedAt": "2026-07-05T04:00:02Z"
}
```

Related: SRS-FR-006, SRS-FR-008, SRS-FR-015; DB `activity_result`, `runtime_event`; Assessment Engine input; AD-005.

The referenced Activity Result is persisted by Runtime and remains non-evaluative. Placement and AI Conversation Practice context comes from the related Learning Activity metadata or approved evidence references, not from a new Activity Result classification.

## 9.3 `AssessmentStarted`

Required payload:

```json
{
  "activityResultRef": "activity-result-<id>",
  "learnerRef": "learner-<id>",
  "assessmentBlueprintRef": "assessment-blueprint-<id>",
  "startedAt": "2026-07-05T04:10:00Z"
}
```

Related: SRS-FR-008; Engine Contract §6; AD-004.

## 9.4 `AssessmentCompleted`

Required payload:

```json
{
  "activityResultRef": "activity-result-<id>",
  "learnerRef": "learner-<id>",
  "outcome": "PASSED",
  "completedAt": "2026-07-05T04:11:00Z"
}
```

Related: SRS-FR-008; Engine Contract §6; AD-004.

## 9.5 `AssessmentResultGenerated`

Required payload:

```json
{
  "assessmentResultRef": "assessment-result-<id>",
  "activityResultRef": "activity-result-<id>",
  "assessmentBlueprintRef": "assessment-blueprint-<id>",
  "learnerRef": "learner-<id>",
  "generatedAt": "2026-07-05T04:12:00Z"
}
```

Related: SRS-FR-008, SRS-FR-013; DB `assessment_result`, `runtime_event`; Engine Contract §6; AD-004, AD-005.

## 9.6 `AssessmentBlueprintUpdated`

Required payload:

```json
{
  "assessmentBlueprintRef": "assessment-blueprint-<id>",
  "version": "2",
  "updatedAt": "2026-07-05T04:05:00Z"
}
```

This event does not modify previously generated Assessment Result.

## 9.7 `KnowledgeProfileUpdated`

Required payload:

```json
{
  "knowledgeProfileRef": "knowledge-profile-<id>",
  "learnerRef": "learner-<id>",
  "assessmentResultRef": "assessment-result-<id>",
  "updateType": "incremental",
  "updatedAt": "2026-07-05T04:14:00Z"
}
```

Related: SRS-FR-013, SRS-FR-014, SRS-FR-018; DB `knowledge_profile`, `runtime_event`; Engine Contract §7; AD-007, AD-005.

AI Layer may consume this event as read-only context but must not publish or modify it.

## 9.8 `LearningDecisionGenerated`

Required payload:

```json
{
  "learningDecisionRef": "learning-decision-<id>",
  "learnerRef": "learner-<id>",
  "knowledgeProfileRef": "knowledge-profile-<id>",
  "decisionType": "Next Module",
  "generatedAt": "2026-07-05T04:15:00Z"
}
```

Allowed `decisionType` values:

* Next Module
* Review Module
* Repeat Activity
* Take Assessment
* Continue Learning
* Complete Module
* Complete Program

Related: SRS-FR-014, SRS-FR-018, SRS-FR-019; DB `learning_decision`, `runtime_event`; Engine Contract §8; AD-006, AD-005.

AI may explain this Learning Decision but must not generate, modify, override, or republish it.

---

# 10. Failure Record Payload Contract

Failure records aligned with `64_engine_contracts.md` are observability-only signals because they are not official events in `21_event_model.md`. They may be persisted in `system_event_log` or represented in audit logs, metrics, traces, monitoring, and internal diagnostics. They are not official integration contracts, cross-layer business triggers, required downstream inputs, or canonical pipeline transitions.

The JSON blocks below are illustrative, non-normative observability payload examples, not official event envelope contracts.

## 10.1 `AssessmentFailed`

```json
{
  "activityResultRef": "activity-result-<id>",
  "learnerRef": "learner-<id>",
  "errorCode": "ASSESSMENT_ENGINE_TIMEOUT",
  "errorCategory": "System Error",
  "failedAt": "2026-07-05T04:12:00Z",
  "retryable": true
}
```

## 10.2 `KnowledgeProfileUpdateFailed`

```json
{
  "assessmentResultRef": "assessment-result-<id>",
  "learnerRef": "learner-<id>",
  "errorCode": "KPE_DEPENDENCY_UNAVAILABLE",
  "errorCategory": "Dependency Error",
  "failedAt": "2026-07-05T04:14:00Z",
  "retryable": true
}
```

## 10.3 `RecommendationFailed`

```json
{
  "knowledgeProfileRef": "knowledge-profile-<id>",
  "learnerRef": "learner-<id>",
  "errorCode": "REC_LEARNING_CONTEXT_INVALID",
  "errorCategory": "Validation Error",
  "failedAt": "2026-07-05T04:15:00Z",
  "retryable": false
}
```

---

# 11. Event-to-State Transition Mapping

State Machine is owned by **Runtime**. Engine events may trigger transitions, but Engine does not own state.

| # | Current State | Event Trigger | Next State | State Owner | Event Produced By |
| - | ------------- | ------------- | ---------- | ----------- | ----------------- |
| 1 | Not Started | Learner starts Learning Activity | Learning | Runtime | Runtime / Learning Activity |
| 2 | Learning | `LearningActivityCompleted` → `ActivityResultGenerated` | Assessing | Runtime | Learning Activity |
| 3 | Assessing | `AssessmentCompleted` → `AssessmentResultGenerated` | Updating Knowledge Profile (Phase 2 continuation) | Runtime | Assessment Engine |
| 4 | Updating Knowledge Profile | `KnowledgeProfileUpdated` | Generating Learning Decision (Phase 2) | Runtime | Knowledge Profile Engine |
| 5 | Generating Learning Decision | `LearningDecisionGenerated` | Ready for Next Activity (Phase 2) | Runtime | Recommendation Engine |
| 6 | Ready for Next Activity | Next activity exists | Learning | Runtime | Runtime |
| 7 | Ready for Next Activity | Program/module complete | Completed | Runtime | Runtime |

This table maps the full Phase 2-capable event flow to existing state transitions. Runtime consumes official events and alone applies transitions; Engine events do not mutate state directly. For MVP Placement Test and assessable AI Conversation Practice, the official flow stops at `AssessmentResultGenerated`, without invoking Knowledge Profile Engine or Recommendation Engine and without emitting `KnowledgeProfileUpdated` or `LearningDecisionGenerated`. Failure observability signals do not change state directly.

---

# 12. Canonical Learning Pipeline Event Flow

```text
LearningActivityCompleted
        ↓
ActivityResultGenerated
        ↓
AssessmentStarted
        ↓
AssessmentCompleted
        ↓
AssessmentResultGenerated
        ↓ Phase 2 continuation only
KnowledgeProfileUpdated
        ↓
LearningDecisionGenerated
```

Rules:

* MVP Phase 1 assessable completion is `LearningActivityCompleted` → `ActivityResultGenerated` → `AssessmentStarted` → `AssessmentCompleted` → `AssessmentResultGenerated`.
* MVP Placement Test and assessable AI Conversation Practice stop at `AssessmentResultGenerated`; Phase 2 engines are not invoked.
* Phase 2 adaptive learning may continue `AssessmentResultGenerated` → `KnowledgeProfileUpdated` → `LearningDecisionGenerated`.
* Assessment Result is generated only by Assessment Engine.
* Knowledge Profile is updated only by Knowledge Profile Engine.
* Learning Decision is generated only by Recommendation Engine.
* AI may consume `LearningDecisionGenerated` but must not publish it.
* Runtime mediates downstream Engine invocation; Engine-to-Engine direct invocation is prohibited.

---

# 13. Idempotency Requirements

| Event / Process | Idempotency Key Basis | Guarantee |
| --------------- | --------------------- | --------- |
| `LearningActivityCompleted` | learner + activity + learning cycle | Duplicate completion does not create duplicate Activity Result. |
| `ActivityResultGenerated` | `activityResultRef` | Duplicate event does not create duplicate Assessment Result. |
| `AssessmentResultGenerated` | `activityResultRef` or `assessmentResultRef` | One Activity Result produces at most one Assessment Result per cycle. |
| `KnowledgeProfileUpdated` | `assessmentResultRef` | One Assessment Result updates Knowledge Profile at most once per cycle. |
| `LearningDecisionGenerated` | `knowledgeProfileRef` + evaluation cycle | Exactly one Learning Decision per evaluation cycle. |
| Failure record | operation + reference ID + error code | Duplicate retries do not create duplicate official results. |

`correlationId` is not a substitute for `idempotencyKey`.

---

# 14. Event Ordering Rules

* Events should be processed according to State Machine order.
* Consumers must tolerate replay and duplicate delivery.
* Consumers must reject, defer, or safely ignore events whose prerequisite data does not exist.
* `AssessmentResultGenerated` must not be processed before its `ActivityResultGenerated` exists.
* `KnowledgeProfileUpdated` must not be processed before its `AssessmentResultGenerated` exists.
* `LearningDecisionGenerated` must not be created before valid `KnowledgeProfileUpdated` exists.
* Event ordering does not give Engine ownership of Runtime state.
* Runtime mediates downstream Engine invocation and applies state transitions after consuming official events; Engine does not call another Engine directly.
* Out-of-order handling must not invent new business rules or alter event meaning.

---

# 15. Retry and Failure Handling

* Retry only applies to idempotent operations.
* Retry is allowed for transient System Error, Dependency Error, and Timeout.
* Retry is not allowed for validation failures or domain/business precondition failures.
* Retry count, backoff strategy, and DLQ behavior are infrastructure details and out of scope.
* Failed processing must be observable through `system_event_log`, audit log, traces, metrics, monitoring, or internal diagnostics without becoming an official Runtime Event.
* Event replay is an implementation concern and must not alter business meaning.

| Engine | Failure Record | Expected Behaviour |
| ------ | -------------- | ------------------ |
| Assessment Engine | `AssessmentFailed` / `system_event_log` | Assessment Result is not persisted; pipeline remains at `Assessing`. |
| Knowledge Profile Engine | `KnowledgeProfileUpdateFailed` / `system_event_log` | Knowledge Profile is not modified; pipeline remains at `Updating Knowledge Profile`. |
| Recommendation Engine | `RecommendationFailed` / `system_event_log` | Learning Decision is not created; pipeline remains at `Generating Learning Decision`. |

Only Runtime applies state transitions. Failure signals describe operational state and are not business integration mechanisms; retry count/backoff remain implementation details and DLQ remains an infrastructure detail.

---

# 16. Event-to-Database Persistence Alignment

| Envelope Field | `runtime_event` Column |
| -------------- | ---------------------- |
| `eventId` | `event_id` |
| `eventType` | `event_type` |
| `aggregateType` | `aggregate_type` |
| `aggregateId` | `aggregate_id` |
| `payload` | `payload` |
| `occurredAt` | `occurred_at` |
| `correlationId` | `correlation_id` |
| `traceId` | `trace_id` |
| `idempotencyKey` | `idempotency_key` |

Additional alignment:

* `state_transition.triggering_event` references `runtime_event.event_id`.
* Official events are persisted in `runtime_event` and are immutable and append-only after publication.
* Engine failure observability signals may be persisted in `system_event_log`; this table is not a business integration mechanism.
* Audit-relevant actions may be persisted in `audit_log`, but audit records are not automatically Official Runtime Events.
* MVP AI Provider Gateway calls are stored in `ai_practice_provider_record`; Phase 3 provider calls may use `ai_provider_request` and `ai_provider_response`. These are not Official Runtime Events.
* MVP AI safety/governance records are stored in `ai_practice_safety_event`; Phase 3 may use `ai_safety_event` and/or audit logs. These are not Official Runtime Events or engine-owned outputs.
* Database persistence implements storage and does not own event business meaning. This contract defines neither physical broker nor physical database implementation.

---

# 17. API-to-Event Alignment

| API / Action | Event Produced | Publisher | Notes |
| ------------ | -------------- | --------- | ----- |
| `POST /api/v1/learning-activities/{activityId}/complete` | `LearningActivityCompleted` | Learning Activity | Public API triggers domain action; Runtime coordinates next step. |
| `POST /api/v1/learning-activities/{activityId}/complete` | `ActivityResultGenerated` | Learning Activity | Activity Result becomes Assessment Engine input. |
| Internal Assessment Engine API | Official: `AssessmentStarted`, `AssessmentCompleted`, `AssessmentResultGenerated`; observability-only: `AssessmentFailed` | Assessment Engine | Triggered by Runtime, not public client; failure signal is not a downstream trigger. |
| Internal Knowledge Profile Engine API | `KnowledgeProfileUpdated`; failure recorded as observability-only record | Knowledge Profile Engine | Triggered by Runtime after Assessment Result. |
| Internal Recommendation Engine API | `LearningDecisionGenerated`; failure recorded as observability-only record | Recommendation Engine | Triggered by Runtime after Knowledge Profile update. |
| Read-only Assessment Result API | None | N/A | Does not publish event. |
| Read-only Knowledge Profile API | None | N/A | Does not publish event. |
| Read-only Learning Decision API | None | N/A | Does not publish event. |
| AI Conversation API | None official | N/A | AI interaction is audit/observability, not official Domain/Engine Event. |

---

# 18. Engine Contract Alignment

| Engine / Component | Consumes Events | Publishes Events / Records | Related Contract |
| ------------------ | --------------- | -------------------------- | ---------------- |
| Assessment Engine | `ActivityResultGenerated`, `AssessmentBlueprintUpdated` | Official: `AssessmentStarted`, `AssessmentCompleted`, `AssessmentResultGenerated`; Observability-only: `AssessmentFailed` | `64_engine_contracts.md` §6 |
| Knowledge Profile Engine | `AssessmentResultGenerated` (Phase 2) | Official: `KnowledgeProfileUpdated`; Observability-only: `KnowledgeProfileUpdateStarted`, `KnowledgeProfileUpdateFailed` | `64_engine_contracts.md` §7 |
| Recommendation Engine | `KnowledgeProfileUpdated` (Phase 2) | Official: `LearningDecisionGenerated`; Observability-only: `RecommendationStarted`, `RecommendationCompleted`, `RecommendationFailed` | `64_engine_contracts.md` §8 |
| AI Personal Learning Agent | `LearningDecisionGenerated`, `KnowledgeProfileUpdated` as read-only context | No official Domain/Engine Event; audit log only | `64_engine_contracts.md` §9 |
| AI Provider Gateway | None | No official Domain/Engine Event; provider status/metrics only | `64_engine_contracts.md` §10 |

---

# 19. AI Governance Compliance

* AI does not publish `LearningDecisionGenerated`.
* AI does not publish `KnowledgeProfileUpdated`.
* AI does not publish `AssessmentResultGenerated`.
* AI Memory updates are not Knowledge Profile updates.
* AI Conversation Experience is not Learning Content, Learning Decision, or Assessment Result.
* AI Provider Gateway status and provider responses are observability/provider records, not official learning events.
* AI Provider Gateway abstraction is preserved; no provider-specific event schema is introduced.

## 19.1 Landing Page — No Official Runtime Events

Public Landing Page (FR-012A) does not introduce any official Runtime Event. Landing Page activity is a read-only, public product entry page. No Domain Event, no Engine Event, and no State Machine transition is associated with Landing Page access. No `LearningProgramCreated` or similar events are published as a result of Landing Page rendering.

## 19.2 AI Conversation Practice — No AI-Owned Official Runtime Events

AI Conversation Practice (FR-012B) is a Learning Activity type Practice and introduces no AI-owned official Runtime Event. AI interactions are recorded as **audit/observability/provider records**. Canonical target-language transcript is the official conversation record; approved evidence may be packaged separately. AI does not publish `ActivityResultGenerated` directly: when assessable practice is completed, Learning Activity publishes the existing official event through the Runtime completion flow, Runtime persists/orchestrates Activity Result, and Runtime triggers Assessment Engine, which alone owns official scoring and publishes `AssessmentStarted`, `AssessmentCompleted`, and `AssessmentResultGenerated`.

* `ai_practice_provider_record` — provider-level audit record per AI Provider Gateway call.
* `ai_practice_safety_event` — governance violation record.
* `audit_log` — cross-cutting audit record.

These AI-owned records must not be used as official integration contracts, cross-layer business triggers, canonical learning pipeline transitions, or required inputs for downstream engines. The existing official Activity Result and Assessment events remain governed by the Official Event Ownership Matrix.

Approved evidence is consumed by Assessment Engine with Activity Result and Assessment Blueprint; it is not Assessment Result and contains no official score or mastery. Translation and transliteration are learner support only and are excluded from official assessment sources. AI does not write Assessment Result, Knowledge Profile, or Learning Decision.

The **Observability-Only lifecycle event decision** (Section 8.1) remains unchanged. AI Conversation Practice does not alter, extend, or override that decision.

AI does not directly publish `AssessmentStarted` or `AssessmentResultGenerated`, and an MVP assessable conversation does not trigger `KnowledgeProfileUpdated` or `LearningDecisionGenerated`. Its completion follows the existing canonical MVP path: `ActivityResultGenerated` → Assessment Engine → `AssessmentResultGenerated`; it neither bypasses Assessment Engine nor activates Phase 2 engines.

## 19.3 MVP Basic Learner Authentication — No Official Runtime Events

MVP Basic Learner Authentication (FR-012C) is already defined by frozen `62_api_spec.md` and `63_database_model.md` and does not introduce any official Runtime Event. Login, logout, and session activity are **audit/security log records only** and must not be used as:

* official integration contracts,
* learning business triggers,
* Canonical Learning Pipeline transitions,
* downstream Engine inputs.

Events such as `LearnerLoggedIn`, `UserLoggedOut`, or `SessionCreated` are **not** official Runtime Events and must not be introduced as such. They may be recorded as security audit logs or observability records in `audit_log` or `system_event_log` for operational monitoring purposes only.

Authentication activity does not affect the Official Event Ownership Matrix (Section 7). The Observability-Only lifecycle event decision (Section 8.1) is unchanged. No State Machine transition is associated with login or logout.

Event Contracts consume actor identity from resolved Runtime/application context and do not define JWT, cookie, session technology, OAuth, MFA, SSO, role, or permission. Nullable actor metadata remains an implementation consideration; Advanced Authentication and Educator authorization remain Open Issues.

## 19.4 Placement Test Boundary

Placement Test remains a specialized assessable Learning Activity, not a new engine, domain entity, or `placement_test` table. Completion produces the same Runtime-owned Activity Result and existing official completion/assessment events. Assessment Engine alone produces the Placement Assessment Result, which may include placement starting-point suggestion metadata; the suggestion is not Learning Decision. MVP Placement does not invoke Recommendation Engine or emit `LearningDecisionGenerated`.

---

# 20. Security and Privacy

* Event payloads must not expose sensitive data unnecessarily.
* Event payloads should use stable reference IDs instead of copying personal data.
* Event payloads must not contain hidden business rules.
* AI prompts, raw provider responses, and provider-specific payloads must not be stored as official Runtime Events.
* MVP AI Conversation Practice provider call metadata and observability records are stored in `ai_practice_provider_record`; Phase 3 provider request/response records may use `ai_provider_request` and `ai_provider_response`. Provider-specific fields remain inside provider-agnostic metadata or JSON fields and do not leak into the core event contract. These records are neither Official Runtime Events nor business integration contracts, and are not official assessment sources unless relevant data is transformed into an approved evidence package through the existing frozen flow.
* AI Memory data must remain separate from Knowledge Profile data.
* Logs, event payloads, and observability records must follow data minimization principles.

---

# 21. Observability Requirements

Each official event must support:

* `eventId`
* `eventType`
* `eventVersion`
* `publisher`
* `occurredAt`
* `correlationId`
* `traceId`
* `idempotencyKey` where required
* `aggregateType`
* `aggregateId`

Engine-related observability should also support processing latency, retry count, timeout count, duplicate event count, failure rate, error code, and retryable flag.

---

# 22. Cross-Document Traceability Matrix

| Event | Related SRS | Related API | Related DB Entity | Related Engine Contract | Related AD |
| ----- | ----------- | ----------- | ----------------- | ----------------------- | ---------- |
| `LearningActivityCompleted` | SRS-FR-006, SRS-FR-010, SRS-FR-011 | Activity complete API | `learning_activity`, `runtime_event`, `state_transition` | N/A | AD-003, AD-005 |
| `ActivityResultGenerated` | SRS-FR-006, SRS-FR-008, SRS-FR-015 | Activity complete API | `activity_result`, `runtime_event` | Assessment Engine input | AD-005 |
| `AssessmentStarted` | SRS-FR-008 | Internal Assessment Engine API | `runtime_event` | `64_engine_contracts.md` §6 | AD-004 |
| `AssessmentCompleted` | SRS-FR-008 | Internal Assessment Engine API | `runtime_event` | `64_engine_contracts.md` §6 | AD-004 |
| `AssessmentResultGenerated` | SRS-FR-008, SRS-FR-013 | Internal Assessment Engine API; Assessment Result read API | `assessment_result`, `runtime_event` | `64_engine_contracts.md` §6 | AD-004, AD-005 |
| `KnowledgeProfileUpdated` | SRS-FR-013, SRS-FR-014, SRS-FR-018 | Internal KPE API; Knowledge Profile read API | `knowledge_profile`, `runtime_event` | `64_engine_contracts.md` §7 | AD-007, AD-005 |
| `LearningDecisionGenerated` | SRS-FR-014, SRS-FR-018, SRS-FR-019 | Internal Recommendation API; Learning Decision read API | `learning_decision`, `runtime_event` | `64_engine_contracts.md` §8 | AD-006, AD-005 |
| `AssessmentBlueprintUpdated` | SRS-FR-007, SRS-FR-008 | Assessment Blueprint API | `assessment_blueprint`, `runtime_event` | Assessment Engine consumed event | AD-002, AD-004 |

---

# 23. Open Issues

| # | Open Issue | Impact |
| - | ---------- | ------ |
| 1 | Exact event broker/message transport. | Infrastructure detail. |
| 2 | Event replay strategy and delivery guarantee. | Impacts physical event handling. |
| 3 | Whether `runtime_event` and `outbox_event` are separate physical tables. | Implementation decision. |
| 4 | Whether `causationId` should be introduced. | Requires Architecture Review. |
| 5 | Exact Learning Context structure. | Impacts Recommendation Engine and AI context. |
| 6 | Exact Program Context structure. | Impacts Recommendation metadata. |
| 7 | Any future promotion of an AI audit/provider record to an official event. | Requires Architecture Review and an update to `21_event_model.md`; current records remain observability-only. |
| 8 | Event retention policy. | Impacts storage and compliance. |
| 9 | Candidate events not explicitly listed in `21_event_model.md`. | Must be approved before official use. |
| 10 | Concrete MVP authentication technology and Advanced Authentication. | Event Contracts consume resolved actor context and do not define authentication technology. |
| 11 | Educator authorization boundary. | Actor authorization details remain outside Event Contracts. |

---

# 24. Architecture Compliance Checklist

| # | Item | Status |
| - | ---- | ------ |
| 1 | No new business rule introduced. | PASS |
| 2 | No new business entity introduced. | PASS |
| 3 | Official event classification, ownership, naming, and flow are determined only by `21_event_model.md`; Event Contracts implement that architecture, while Engine Contracts consume and align with Event Contracts without independently authorizing or promoting official events. | PASS |
| 4 | Candidate events are separated from official events. | PASS |
| 5 | Event ownership follows `21_event_model.md`. | PASS |
| 6 | Runtime remains owner of State Machine. | PASS |
| 7 | Engine does not own state transitions. | PASS |
| 8 | Canonical Learning Pipeline is preserved. | PASS |
| 9 | AI does not generate Learning Decision. | PASS |
| 10 | AI Memory remains separate from Knowledge Profile. | PASS |
| 11 | AI Provider Gateway remains provider-agnostic. | PASS |
| 12 | Idempotency and observability are defined. | PASS |
| 13 | No circular dependency introduced. | PASS |
| 14 | Landing Page does not introduce official Runtime Events. | PASS |
| 15 | AI Conversation Practice introduces no AI-owned Official Runtime Event; AI-owned interactions remain audit/observability records. | PASS |
| 16 | Observability-Only lifecycle event decision (Section 8.1) remains unchanged. | PASS |
| 17 | `AssessmentFailed` and Knowledge Profile/Recommendation lifecycle signals are observability-only and not business triggers. | PASS |
| 18 | MVP Phase 1 stops at `AssessmentResultGenerated`; Phase 2 continuation is separately identified. | PASS |
| 19 | Activity Result persistence is Runtime-owned and non-evaluative. | PASS |

---

# Engineering Freeze Declaration

Dokumen ini dibekukan sebagai official implementation event contract untuk Kaifa v2; `21_event_model.md` tetap menjadi architecture source of truth. Official events bersifat immutable dan memiliki satu official publisher. Runtime memiliki orchestration dan state transitions; Activity Result tetap Runtime-owned dan non-evaluative. Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine masing-masing tetap sole owner Assessment Result, Knowledge Profile, dan Learning Decision. AI Layer tidak mempublikasikan Official Runtime Events atau engine-owned outputs, sedangkan observability-only signals bukan official integration contracts maupun business triggers. MVP Placement Test dan MVP AI Conversation Practice berhenti pada `AssessmentResultGenerated`; Phase 2 dapat berlanjut melalui `KnowledgeProfileUpdated` dan `LearningDecisionGenerated`. Perubahan berikutnya memerlukan controlled review terhadap frozen architecture, State Machine, Event Model, API Specification, Database Model, Engine Contracts, PRD, dan SRS.

---

# 25. References

* `00_foundation/00_overview.md`
* `00_foundation/01_architecture_principles.md`
* `00_foundation/02_glossary.md`
* `10_learning_domain/*`
* `20_runtime/20_state_machine.md`
* `20_runtime/21_event_model.md`
* `20_runtime/22_content_model.md`
* `30_engine/30_assessment_engine.md`
* `30_engine/31_knowledge_profile_engine.md`
* `30_engine/32_recommendation_engine.md`
* `40_ai/*`
* `50_product/52_prd.md`
* `60_engineering/60_srs.md`
* `60_engineering/61_api_design_principles.md`
* `60_engineering/62_api_spec.md`
* `60_engineering/63_database_model.md`
* `60_engineering/64_engine_contracts.md`
* `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan **implementation contract** untuk event payload, event envelope, idempotency, retry, observability metadata, persistence alignment, dan cross-document traceability event pada Kaifa v2.

Dokumen ini tidak menggantikan `21_event_model.md` sebagai single source of truth untuk event classification, event ownership, naming convention, dan event flow.

Perubahan terhadap Event Contracts harus mempertahankan konsistensi dengan Event Model, State Machine, Database Model, Engine Contracts, dan seluruh Architecture Decision yang telah dibekukan.
