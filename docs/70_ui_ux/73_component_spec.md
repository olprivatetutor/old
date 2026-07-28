# Component Specification — Kaifa v2 MVP

| Field | Value |
| ----- | ----- |
| Version | 1.0 |
| Status | Freeze |
| Owner | Product & UI/UX |
| Depends On | `70_ui_ux_spec.md`, `71_user_flow.md`, `72_screen_inventory.md`, `52_prd.md`, `60_srs.md`, `62_api_spec.md`, `80_feature_breakdown.md` |
| Used By | Product, UI/UX, Frontend, Backend, QA |
| Last Updated | 2026-07-05 |

Dokumen ini mendefinisikan component specification untuk MVP Kaifa v2. Definisi perilaku mengikuti `70_ui_ux_spec.md`, navigasi mengikuti `71_user_flow.md`, dan screen/API/data coverage mengikuti `72_screen_inventory.md`.

---

# 1. Purpose

Dokumen ini mendefinisikan UI components MVP, tanggung jawabnya, state, screen usage, API/data dependencies, dan QA coverage. Komponen di sini adalah building block frontend untuk UX-001 sampai UX-010.

Dokumen ini tidak mendefinisikan ulang arsitektur, API, database model, event model, atau business rules. Komponen tidak memiliki otoritas Domain, Runtime, Engine, atau AI Layer di luar tampilan dan interaksi UI yang telah disetujui.

---

# 2. Component Principles

* Components adalah UI-level building blocks only.
* Components tidak boleh memiliki atau menghitung learning business rules.
* Components tidak boleh mempublikasikan Official Runtime Events.
* Components pada authenticated screens wajib beroperasi dengan active Learner context.
* Components wajib menjaga Learner data isolation.
* AI components bersifat practice-only dan tidak dapat menghasilkan official learning outcomes.
* Dashboard components adalah basic progress only.
* Components wajib mendukung loading, empty, error, dan disabled states.
* Components tidak boleh mengekspos internal errors, provider details, raw database errors, secrets, stack traces, atau internal service details.
* Components must not introduce a new Placement Test domain entity or API resource. Placement Test UI is part of MVP. Components tidak boleh memperkenalkan Enrollment atau adaptive personalized path, Knowledge Profile UI, Learning Decision UI, public signup, atau advanced authentication.

---

# 3. Component Inventory

| Component ID | Component Name | Used In Screens | Purpose | MVP Status | Notes |
| ------------ | -------------- | --------------- | ------- | ---------- | ----- |
| CMP-001 | Public Header | UX-001 | Header public dengan product name dan Login CTA. | MVP | UI component only. |
| CMP-002 | Authenticated Header | UX-003 to UX-011 | Header authenticated yang menampilkan active Learner identity dan navigation. | MVP | UI component only. |
| CMP-003 | Login Form | UX-002 | Form MVP Basic Learner Authentication. | MVP | UI component only. |
| CMP-004 | Program Highlight Card | UX-001 | Public card untuk Published program highlights. | MVP | UI component only. |
| CMP-005 | Program Card | UX-003, UX-004 | Card untuk Published Learning Program. | MVP | UI component only. |
| CMP-006 | Subject Card | UX-004 | UI representation for subject-like program choices. | MVP | UI component only. |
| CMP-007 | Module Card | UX-005 | Card untuk Learning Module. | MVP | UI component only. |
| CMP-008 | Activity Card | UX-005, UX-006 | Card/summary for Learning Activity and activity_type. | MVP | UI component only. |
| CMP-009 | Learning Content Viewer | UX-006 | Viewer untuk Published Learning Content. | MVP | UI component only. |
| CMP-010 | Learning Objective Context | UX-006, UX-007, UX-008 | Displays Learning Objective context for selected activity. | MVP | UI component only. |
| CMP-011 | AI Practice Entry Control | UX-006 | Control to start AI Practice session. | MVP limited | Practice-only AI boundary. |
| CMP-012 | AI Conversation Panel | UX-007 | Conversation panel for AI Practice. | MVP limited | Practice-only AI boundary. |
| CMP-013 | AI Message Bubble | CMP-012 in UX-007 | Displays Learner and AI messages. | MVP limited | Practice-only AI boundary. |
| CMP-014 | AI Practice Fallback Banner | UX-006, UX-007, UX-010 | Graceful fallback when AI unavailable. | MVP limited | Practice-only AI boundary. |
| CMP-015 | Activity Completion Control | UX-006 | Completes Learning Activity. | MVP | UI component only. |
| CMP-016 | Assessment Result Summary | UX-008 | Read-only summary of Assessment Result. | MVP | UI component only. |
| CMP-017 | Progress Summary Card | UX-003, UX-009 | Basic progress summary. | MVP | UI component only. |
| CMP-018 | Activity Result List | UX-009 | List of completed activities / Activity Result history. | MVP | UI component only. |
| CMP-019 | Assessment Result List | UX-009 | Read-only Assessment Result history. | MVP | UI component only. |
| CMP-020 | Empty State Block | UX-001 to UX-011 | Reusable empty-state block. | MVP | UI component only. |
| CMP-021 | Loading State Indicator | UX-001 to UX-011 | Loading/skeleton/spinner indicator. | MVP | UI component only. |
| CMP-022 | Error / Fallback Banner | UX-003 to UX-011 | Safe error and fallback messages. | MVP | UI component only. |
| CMP-023 | Safe Navigation Control | UX-003 to UX-011 | Controls safe route transitions. | MVP | UI component only. |
| CMP-024 | Logout Control | UX-003 to UX-011 | Logout action for authenticated screens. | MVP | UI component only. |
| CMP-025 | Breadcrumb / Back Navigation | UX-005, UX-006, UX-008, UX-009 | Safe breadcrumb/back navigation. | MVP | UI component only. |
| CMP-026 | Voice Control Suite | UX-007 | Microphone permission, recording, processing, retry, and text fallback. | MVP | Frontend voice states only. |
| CMP-027 | Canonical Transcript and Audio Playback | UX-007 | Canonical transcript and TTS play/replay. | MVP | RTL-aware; translation is learner support only. |
| CMP-028 | Assessable Submission Status | UX-007, UX-008, UX-011 | Submission, Assessment Pending, and Assessment Ready UI. | MVP | Official Assessment Result comes only from Assessment Engine. |
| CMP-029 | Placement Test Card/Progress/Result | UX-005, UX-011, UX-008 | Specialized Learning Activity with `purpose = Placement`. | MVP | No new Placement Test domain entity or API resource. |

---

# 4. Component Detail Specifications

## CMP-001 — Public Header

* **Purpose:** Header public dengan product name dan Login CTA.
* **Used In Screens:** UX-001.
* **Visibility Rules:** Public; visible only on Landing Page.
* **Inputs / Props:** productName, loginUrl.
* **Displayed Data:** Product name, Login CTA.
* **Primary Actions:** Navigate to UX-002.
* **API Dependencies:** None.
* **Data Dependencies:** None.
* **State Variants:** default, loading not applicable, error not applicable.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** No learner data access.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No learner identity, logout, dashboard link, signup link.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-002 — Authenticated Header

* **Purpose:** Header authenticated yang menampilkan active Learner identity dan navigation.
* **Used In Screens:** UX-003 to UX-011.
* **Visibility Rules:** Visible only with active Learner context.
* **Inputs / Props:** learner, navItems, currentRoute.
* **Displayed Data:** Learner name/identifier, navigation, Logout Control.
* **Primary Actions:** Navigate, logout.
* **API Dependencies:** GET /api/v1/auth/me.
* **Data Dependencies:** learner, auth_session.
* **State Variants:** default, loading learner, error session invalid.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Must not show another Learner identity.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No role management, educator controls, parent/org identity.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-003 — Login Form

* **Purpose:** Form MVP Basic Learner Authentication.
* **Used In Screens:** UX-002.
* **Visibility Rules:** Visible on Login Page before auth.
* **Inputs / Props:** identifier, password, submitState, errorMessage.
* **Displayed Data:** Identifier field, password field, safe errors.
* **Primary Actions:** Submit login.
* **API Dependencies:** POST /api/v1/auth/login; GET /api/v1/auth/me.
* **Data Dependencies:** learner_auth_account, auth_session, learner.
* **State Variants:** default, submitting, invalid, success.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Must preserve account isolation after login.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No signup, forgot password, social login, OAuth, SSO, MFA.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-004 — Program Highlight Card

* **Purpose:** Public card untuk Published program highlights.
* **Used In Screens:** UX-001.
* **Visibility Rules:** Public Landing Page only.
* **Inputs / Props:** title, summary, programType.
* **Displayed Data:** Published program highlight summary.
* **Primary Actions:** View public info or go Login if detail requires auth.
* **API Dependencies:** GET /api/v1/public/program-highlights.
* **Data Dependencies:** landing_page_config, learning_program highlight projection.
* **State Variants:** default, loading, empty, error fallback.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** No Learner personalization.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No direct authenticated program detail without login; no Enrollment.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-005 — Program Card

* **Purpose:** Card untuk Published Learning Program.
* **Used In Screens:** UX-003, UX-004.
* **Visibility Rules:** Authenticated screens after Learner context active.
* **Inputs / Props:** programId, title, type, description, status.
* **Displayed Data:** Learning Program summary.
* **Primary Actions:** Manual select program.
* **API Dependencies:** GET /api/v1/learning-programs.
* **Data Dependencies:** learning_program.
* **State Variants:** default, loading list, empty list, disabled if unavailable.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Selection remains under active Learner context.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No adaptive recommendation, Knowledge Profile ranking, Learning Decision.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-006 — Subject Card

* **Purpose:** UI representation for subject-like program choices.
* **Used In Screens:** UX-004.
* **Visibility Rules:** Optional when subject representation is needed.
* **Inputs / Props:** label, programId, description.
* **Displayed Data:** Arabic Learning, English Learning, or similar labels.
* **Primary Actions:** Manual select represented program.
* **API Dependencies:** GET /api/v1/learning-programs.
* **Data Dependencies:** learning_program.
* **State Variants:** default, loading list, empty list.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Not a new domain entity; uses program reference.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** Must not imply adaptive personalized path.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-007 — Module Card

* **Purpose:** Card untuk Learning Module.
* **Used In Screens:** UX-005.
* **Visibility Rules:** Visible in selected Program Detail.
* **Inputs / Props:** moduleId, title, description, status, optionalProgress.
* **Displayed Data:** Module summary and optional basic status.
* **Primary Actions:** Select module/activity area.
* **API Dependencies:** GET /api/v1/learning-modules.
* **Data Dependencies:** learning_module, learning_state optional.
* **State Variants:** default, loading, no module, disabled if unavailable.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Progress indicators scoped to active Learner.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No adaptive sequencing.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-008 — Activity Card

* **Purpose:** Card/summary for Learning Activity and activity_type.
* **Used In Screens:** UX-005, UX-006.
* **Visibility Rules:** Visible for Published activities.
* **Inputs / Props:** activityId, title, activityType, completionStatus.
* **Displayed Data:** Activity name, type, completion indicator, AI Practice label only for Practice.
* **Primary Actions:** Open activity.
* **API Dependencies:** GET /api/v1/learning-activities.
* **Data Dependencies:** learning_activity, learning_state optional.
* **State Variants:** default, loading, no activity, disabled if unavailable.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Activity status scoped to active Learner.
* **AI / Engine / Event Boundary Notes:** No AI itself; can show AI availability label for Practice.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** Must not show AI Practice for non-Practice activities.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-009 — Learning Content Viewer

* **Purpose:** Viewer untuk Published Learning Content.
* **Used In Screens:** UX-006.
* **Visibility Rules:** Visible when activity content exists; fallback if empty.
* **Inputs / Props:** contentItems, contentType, title.
* **Displayed Data:** Published content text/embed/reference.
* **Primary Actions:** Read/view content.
* **API Dependencies:** GET /api/v1/learning-contents.
* **Data Dependencies:** content_item.
* **State Variants:** default, loading, empty content, render error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Content must be accessible for active activity/context.
* **AI / Engine / Event Boundary Notes:** No AI content generation; no Engine dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No dynamic AI-generated content, no Knowledge Profile personalization.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-010 — Learning Objective Context

* **Purpose:** Displays Learning Objective context for selected activity.
* **Used In Screens:** UX-006, UX-007, UX-008.
* **Visibility Rules:** Visible where objective context is required.
* **Inputs / Props:** objectiveId, title, description.
* **Displayed Data:** Learning Objective / Tujuan Pembelajaran.
* **Primary Actions:** None; context display.
* **API Dependencies:** GET /api/v1/learning-activities/{activityId}.
* **Data Dependencies:** learning_objective, learning_activity.
* **State Variants:** default, loading, missing objective error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Objective must belong to selected activity.
* **AI / Engine / Event Boundary Notes:** Context only; no Engine/Event authority.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** UI cannot modify Learning Objective.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-011 — AI Practice Entry Control

* **Purpose:** Control to start AI Practice session.
* **Used In Screens:** UX-006.
* **Visibility Rules:** Visible only when activity_type = Practice; hidden otherwise.
* **Inputs / Props:** activityId, activityType, aiAvailability.
* **Displayed Data:** Start AI Practice button/status.
* **Primary Actions:** Start AI session.
* **API Dependencies:** POST /api/v1/learning-activities/{activityId}/ai-conversation/start.
* **Data Dependencies:** learning_activity, learning_objective, ai_practice_conversation.
* **State Variants:** default, starting, hidden, disabled, fallback.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Uses active Learner context and selected Practice activity.
* **AI / Engine / Event Boundary Notes:** Starts AI Practice only; no official outcome.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No display for non-Practice; disabled/hidden when AI unavailable.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-012 — AI Conversation Panel

* **Purpose:** Conversation panel for AI Practice.
* **Used In Screens:** UX-007.
* **Visibility Rules:** Only active AI Practice session from Practice activity.
* **Inputs / Props:** conversationId, objective, contentContext, messages, inputState.
* **Displayed Data:** History, input, Learning Objective context, optional content context.
* **Primary Actions:** Send message, complete session.
* **API Dependencies:** POST /api/v1/ai-conversations/{conversationId}/messages; POST /api/v1/ai-conversations/{conversationId}/complete; GET /api/v1/ai-conversations/{conversationId}.
* **Data Dependencies:** ai_practice_conversation, ai_practice_message, ai_practice_provider_record, content_item.
* **State Variants:** default, loading history, sending, ai unavailable, completed.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Conversation scoped to active Learner/activity/objective.
* **AI / Engine / Event Boundary Notes:** AI guidance/feedback only; no Assessment Result, Knowledge Profile, Learning Decision, Official Runtime Event.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No AI scoring or AI-owned official assessment; assessable completion remains Assessment Engine-only.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-013 — AI Message Bubble

* **Purpose:** Displays Learner and AI messages.
* **Used In Screens:** CMP-012 in UX-007.
* **Visibility Rules:** Visible within AI Conversation Panel.
* **Inputs / Props:** role, messageText, timestamp, safetyState.
* **Displayed Data:** Learner message or labeled AI Practice response.
* **Primary Actions:** None or retry if failed message.
* **API Dependencies:** POST /api/v1/ai-conversations/{conversationId}/messages.
* **Data Dependencies:** ai_practice_message, ai_practice_safety_event.
* **State Variants:** learner, ai, sending, failed, safety blocked.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Messages scoped to conversation owner.
* **AI / Engine / Event Boundary Notes:** AI bubble is not official result or score.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** Must not look like Assessment Result or system-generated score.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-014 — AI Practice Fallback Banner

* **Purpose:** Graceful fallback when AI unavailable.
* **Used In Screens:** UX-006, UX-007, UX-010.
* **Visibility Rules:** Shown when AI Provider unavailable or AI request fails safely.
* **Inputs / Props:** message, retryAllowed, continueAction.
* **Displayed Data:** AI unavailable message; continue without AI guidance.
* **Primary Actions:** Continue activity without AI; optionally retry.
* **API Dependencies:** AI endpoints may return 503/failure.
* **Data Dependencies:** ai_practice_provider_record optional.
* **State Variants:** visible, dismissed, retrying, disabled.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** No impact to Learner data or outcomes.
* **AI / Engine / Event Boundary Notes:** Must not create Assessment Result, Knowledge Profile, Learning Decision, Runtime Event.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** Must not block Learning Activity completion.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-015 — Activity Completion Control

* **Purpose:** Completes Learning Activity.
* **Used In Screens:** UX-006.
* **Visibility Rules:** Visible when activity can be completed.
* **Inputs / Props:** activityId, completionState, disabledReason.
* **Displayed Data:** Complete Activity button and validation message.
* **Primary Actions:** Complete activity.
* **API Dependencies:** POST /api/v1/learning-activities/{activityId}/complete.
* **Data Dependencies:** learning_activity, learning_state, activity_result.
* **State Variants:** default, submitting, disabled, success, validation error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Writes Activity Result for active Learner only.
* **AI / Engine / Event Boundary Notes:** Backend/runtime handles official events/assessment; UI does not create Assessment Result.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No direct Assessment Result creation in UI.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-016 — Assessment Result Summary

* **Purpose:** Read-only summary of Assessment Result.
* **Used In Screens:** UX-008.
* **Visibility Rules:** Visible when Assessment Result is available.
* **Inputs / Props:** resultId, outcome, metadata, blueprintRef.
* **Displayed Data:** Assessment Result, blueprint reference, activity result context.
* **Primary Actions:** Navigate dashboard/module.
* **API Dependencies:** GET /api/v1/assessment-results/{resultId}; GET /api/v1/assessment-results.
* **Data Dependencies:** assessment_result, assessment_blueprint, activity_result.
* **State Variants:** loading, pending, ready, failed, not found.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Result must belong to active Learner; read-only.
* **AI / Engine / Event Boundary Notes:** Displays Assessment Engine output only; no AI/Event authority.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No editing, Knowledge Profile update, Learning Decision.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-017 — Progress Summary Card

* **Purpose:** Basic progress summary.
* **Used In Screens:** UX-003, UX-009.
* **Visibility Rules:** Authenticated screens with progress summary.
* **Inputs / Props:** currentState, completedActivityCount, assessmentResultCount.
* **Displayed Data:** learning_state, counts.
* **Primary Actions:** Navigate dashboard/program.
* **API Dependencies:** GET /api/v1/auth/me; GET /api/v1/assessment-results.
* **Data Dependencies:** learner, learning_state, activity_result, assessment_result.
* **State Variants:** default, loading, empty, error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Progress scoped to active Learner.
* **AI / Engine / Event Boundary Notes:** No AI dependency; reads results only.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No mastery based on Knowledge Profile, no adaptive recommendation.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-018 — Activity Result List

* **Purpose:** List of completed activities / Activity Result history.
* **Used In Screens:** UX-009.
* **Visibility Rules:** Dashboard only.
* **Inputs / Props:** activityResults, sortOrder.
* **Displayed Data:** Completed activity rows.
* **Primary Actions:** Open related activity/module if available.
* **API Dependencies:** GET /api/v1/assessment-results or dashboard projection.
* **Data Dependencies:** activity_result, learning_activity.
* **State Variants:** default, loading, empty, error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Active Learner only; no cross-learner result exposure.
* **AI / Engine / Event Boundary Notes:** No AI/Engine write authority.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No editing or advanced analytics.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-019 — Assessment Result List

* **Purpose:** Read-only Assessment Result history.
* **Used In Screens:** UX-009.
* **Visibility Rules:** Dashboard only.
* **Inputs / Props:** assessmentResults.
* **Displayed Data:** Assessment Result rows.
* **Primary Actions:** Open result summary.
* **API Dependencies:** GET /api/v1/assessment-results.
* **Data Dependencies:** assessment_result, activity_result.
* **State Variants:** default, loading, empty, error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Active Learner only; read-only.
* **AI / Engine / Event Boundary Notes:** Displays Assessment Engine output only.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No Learning Decision or adaptive next step.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-020 — Empty State Block

* **Purpose:** Reusable empty-state block.
* **Used In Screens:** UX-001 to UX-011.
* **Visibility Rules:** Shown when list/content/result is empty.
* **Inputs / Props:** stateType, title, message, safeAction.
* **Displayed Data:** No program/module/activity/result/completed activity copy.
* **Primary Actions:** Safe navigation or retry.
* **API Dependencies:** None directly.
* **Data Dependencies:** None directly.
* **State Variants:** default, contextual empty, action available.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Must not expose hidden/unauthorized data as empty.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No fallback business rules or synthetic content.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-021 — Loading State Indicator

* **Purpose:** Loading/skeleton/spinner indicator.
* **Used In Screens:** UX-001 to UX-011.
* **Visibility Rules:** Shown during async load/action.
* **Inputs / Props:** label, size, blocking, targetRegion.
* **Displayed Data:** Loading copy/progress state.
* **Primary Actions:** None.
* **API Dependencies:** None directly.
* **Data Dependencies:** None directly.
* **State Variants:** inline, full-page, button loading.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Avoid stale Learner data after session invalidation.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No indefinite hidden failure; no stale data display.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-022 — Error / Fallback Banner

* **Purpose:** Safe error and fallback messages.
* **Used In Screens:** UX-003 to UX-011.
* **Visibility Rules:** Shown for session, auth, network, server, assessment, AI failures.
* **Inputs / Props:** errorType, message, safeAction, retryAllowed.
* **Displayed Data:** Clear safe error copy.
* **Primary Actions:** Retry, safe navigation, login.
* **API Dependencies:** Relevant failing endpoint.
* **Data Dependencies:** auth_session, requested record context.
* **State Variants:** info, warning, error, retrying, dismissed.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** No stack trace, provider details, raw IDs, secrets.
* **AI / Engine / Event Boundary Notes:** No Runtime Event; no fallback business rule.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No internal service names/database query exposure.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-023 — Safe Navigation Control

* **Purpose:** Controls safe route transitions.
* **Used In Screens:** UX-003 to UX-011.
* **Visibility Rules:** Normal and error navigation.
* **Inputs / Props:** destination, label, currentContext.
* **Displayed Data:** Back/continue/dashboard/login/home links.
* **Primary Actions:** Navigate to safe destination.
* **API Dependencies:** None directly.
* **Data Dependencies:** None directly.
* **State Variants:** default, disabled, hidden.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Must not route to unauthorized resource.
* **AI / Engine / Event Boundary Notes:** Must not rely on Learning Decision.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No adaptive next step suggestions.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-024 — Logout Control

* **Purpose:** Logout action for authenticated screens.
* **Used In Screens:** UX-003 to UX-011.
* **Visibility Rules:** Visible only with active session.
* **Inputs / Props:** sessionState, redirectTarget.
* **Displayed Data:** Logout button/menu item.
* **Primary Actions:** Logout.
* **API Dependencies:** POST /api/v1/auth/logout.
* **Data Dependencies:** auth_session.
* **State Variants:** default, submitting, success, error.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Clear local state; no previous Learner data remains visible.
* **AI / Engine / Event Boundary Notes:** No AI/Engine/Event dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** No role switching/account management.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

## CMP-025 — Breadcrumb / Back Navigation

* **Purpose:** Safe breadcrumb/back navigation.
* **Used In Screens:** UX-005, UX-006, UX-008, UX-009.
* **Visibility Rules:** Shown where screen hierarchy exists.
* **Inputs / Props:** crumbs, fallbackRoute, currentResource.
* **Displayed Data:** Program, module, activity/result navigation labels.
* **Primary Actions:** Back/continue.
* **API Dependencies:** None directly.
* **Data Dependencies:** learning_program, learning_module, learning_activity refs.
* **State Variants:** default, disabled if unsafe, hidden.
* **Error Handling:** Gunakan pesan aman, retry/safe navigation bila relevan, dan jangan tampilkan detail internal.
* **Security / Data Isolation Rules:** Must validate destination access under active Learner context.
* **AI / Engine / Event Boundary Notes:** No Learning Decision dependency.
* **Accessibility Notes:** Harus keyboard-accessible, memiliki label/role yang jelas, focus state, dan error yang dapat dibaca screen reader bila interaktif.
* **Out of Scope:** Must not suggest adaptive next step.
* **QA Checklist:** Verifikasi visibility, data/context benar, state loading/empty/error/disabled, tidak ada scope MVP yang dilanggar, dan tidak ada kebocoran data Learner.

---

## CMP-026 — Voice Control Suite

* **Purpose:** Capture voice with permission, recording, processing, retry, and accessible text fallback.
* **Used In Screens:** UX-007.
* **State Variants:** permission-requested, permission-denied, recording, processing, retry.
* **Boundary:** Frontend states only; never Runtime states and never an AI score.
* **QA Checklist:** Permission, cancel, failure, retry, keyboard, and screen-reader behavior.

## CMP-027 — Canonical Transcript and Audio Playback

* **Purpose:** Present transcript-ready content and TTS play/replay.
* **Used In Screens:** UX-007.
* **State Variants:** transcript-ready, playing, replay, playback-failed, retry.
* **Boundary:** Canonical target-language transcript is authoritative; translation is support only.
* **QA Checklist:** Transcript, RTL, playback, replay, and fallback text.

## CMP-028 — Assessable Submission Status

* **Purpose:** Present submitting, Assessment Pending, Assessment Ready, failure, and retry.
* **Used In Screens:** UX-007, UX-008, UX-011.
* **Boundary:** Submits Activity Result or approved evidence; only Assessment Engine produces Assessment Result.
* **QA Checklist:** Duplicate submission prevention, pending polling/retry, and read-only result.

## CMP-029 — Placement Test Card/Progress/Result

* **Purpose:** Present Placement Test entry, progress, and result for `purpose = Placement`.
* **Used In Screens:** UX-005, UX-011, UX-008.
* **Boundary:** Reuses Learning Activity, Activity Result, Assessment Result, and Assessment Engine; no new resource.
* **QA Checklist:** Placement metadata, route, result ownership, failure, and retry.

# 5. Component-to-Screen Matrix

| Component ID | UX-001 | UX-002 | UX-003 | UX-004 | UX-005 | UX-006 | UX-007 | UX-008 | UX-009 | UX-010 | Notes |
| ------------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ----- |
| CMP-001 | Used | — | — | — | — | — | — | — | — | — | Public Header |
| CMP-002 | — | — | Used | Used | Used | Used | Used | Used | Used | — | Authenticated Header |
| CMP-003 | — | Used | — | — | — | — | — | — | — | — | Login Form |
| CMP-004 | Used | — | — | — | — | — | — | — | — | — | Program Highlight Card |
| CMP-005 | — | — | Used | Used | — | — | — | — | — | — | Program Card |
| CMP-006 | — | — | — | Used | — | — | — | — | — | — | Subject Card |
| CMP-007 | — | — | — | — | Used | — | — | — | — | — | Module Card |
| CMP-008 | — | — | — | — | Used | Used | — | — | — | — | Activity Card |
| CMP-009 | — | — | — | — | — | Used | — | — | — | — | Learning Content Viewer |
| CMP-010 | — | — | — | — | — | Used | Used | Used | — | — | Learning Objective Context |
| CMP-011 | — | — | — | — | — | Used | — | — | — | — | AI Practice Entry Control |
| CMP-012 | — | — | — | — | — | — | Used | — | — | — | AI Conversation Panel |
| CMP-013 | — | — | — | — | — | — | Used | — | — | — | AI Message Bubble |
| CMP-014 | — | — | — | — | — | Used | Used | — | — | Used | AI Practice Fallback Banner |
| CMP-015 | — | — | — | — | — | Used | — | — | — | — | Activity Completion Control |
| CMP-016 | — | — | — | — | — | — | — | Used | — | — | Assessment Result Summary |
| CMP-017 | — | — | Used | — | — | — | — | — | Used | — | Progress Summary Card |
| CMP-018 | — | — | — | — | — | — | — | — | Used | — | Activity Result List |
| CMP-019 | — | — | — | — | — | — | — | — | Used | — | Assessment Result List |
| CMP-020 | Used | Used | Used | Used | Used | Used | Used | Used | Used | Used | Empty State Block |
| CMP-021 | Used | Used | Used | Used | Used | Used | Used | Used | Used | Used | Loading State Indicator |
| CMP-022 | — | — | Used | Used | Used | Used | Used | Used | Used | Used | Error / Fallback Banner |
| CMP-023 | — | — | Used | Used | Used | Used | Used | Used | Used | Used | Safe Navigation Control |
| CMP-024 | — | — | Used | Used | Used | Used | Used | Used | Used | — | Logout Control |
| CMP-025 | — | — | — | — | Used | Used | — | Used | Used | — | Breadcrumb / Back Navigation |
| CMP-026 | — | — | — | — | — | — | Used | — | — | — | Voice Control Suite |
| CMP-027 | — | — | — | — | — | — | Used | — | — | — | Canonical Transcript and Audio Playback |
| CMP-028 | — | — | — | — | — | — | Used | Used | — | — | Assessable Submission Status |
| CMP-029 | — | — | — | — | Used | — | — | Used | — | — | Used in UX-011 |

---

# 6. Component-to-API Matrix

| Component ID | API Endpoint | Method | Purpose | Required Context | Error Handling |
| ------------ | ------------ | ------ | ------- | ---------------- | -------------- |
| CMP-003 | `/api/v1/auth/login` | POST | Submit login | Credentials | Safe login error |
| CMP-003 | `/api/v1/auth/me` | GET | Verify Learner context | Auth session | Redirect if missing |
| CMP-004 | `/api/v1/public/program-highlights` | GET | Load public highlights | Public | Empty allowed |
| CMP-005 | `/api/v1/learning-programs` | GET | Load Published programs | Learner context | Retry/empty |
| CMP-006 | `/api/v1/learning-programs` | GET | Load program subject representation | Learner context | Retry/empty |
| CMP-007 | `/api/v1/learning-modules` | GET | Load modules | Learner context | No module state |
| CMP-008 | `/api/v1/learning-activities` | GET | Load activities | Learner context | No activity state |
| CMP-009 | `/api/v1/learning-contents` | GET | Load Published content | Learner context | Content empty allowed |
| CMP-010 | `/api/v1/learning-activities/{activityId}` | GET | Load linked objective | Learner context | 404/safe back |
| CMP-011 | `/api/v1/learning-activities/{activityId}/ai-conversation/start` | POST | Start AI Practice | Learner context + Practice | AI fallback/non-Practice rejection |
| CMP-012 | `/api/v1/ai-conversations/{conversationId}` | GET | Load history | Conversation owner | 404/unauthorized |
| CMP-012 | `/api/v1/ai-conversations/{conversationId}/messages` | POST | Send message | Conversation owner | AI/governance fallback |
| CMP-012 | `/api/v1/ai-conversations/{conversationId}/complete` | POST | End session | Conversation owner | Return to UX-006 |
| CMP-013 | `/api/v1/ai-conversations/{conversationId}/messages` | POST | Render sent/received message | Conversation owner | Message failure/safety state |
| CMP-014 | `AI Practice endpoints` | Any | Show AI unavailable fallback | Learner context | Continue without AI |
| CMP-015 | `/api/v1/learning-activities/{activityId}/complete` | POST | Complete activity | Learner context | 409/422 safe message |
| CMP-016 | `/api/v1/assessment-results/{resultId}` | GET | Load read-only result | Result owner | Pending/not found/failed |
| CMP-016 | `/api/v1/assessment-results` | GET | Load result list if needed | Learner context | Filtered by Learner |
| CMP-017 | `/api/v1/auth/me` | GET | Verify Learner | Auth session | Redirect if invalid |
| CMP-017 | `/api/v1/assessment-results` | GET | Load counts/results | Learner context | Empty/error |
| CMP-018 | `/api/v1/assessment-results` | GET | Load related result history/projection | Learner context | Empty/error |
| CMP-019 | `/api/v1/assessment-results` | GET | Load Assessment Result history | Learner context | Empty/error |
| CMP-024 | `/api/v1/auth/logout` | POST | End session | Auth session | Clear local state |
| CMP-026 | AI conversation voice endpoints | POST/GET | Record, transcribe, and play audio | Conversation owner | Permission/voice retry and text fallback |
| CMP-027 | AI conversation transcript/audio endpoints | GET | Load transcript and playback | Conversation owner | Transcript/playback retry |
| CMP-028 | Learning Activity completion and Assessment Result APIs | POST/GET | Submit assessable result and read status | Learner/activity owner | Pending/failed/retry |
| CMP-029 | Learning Activity and Assessment Result APIs | GET/POST | Run Placement-purpose activity and read result | Learner/activity owner | Safe retry; no placement resource |
| Other display/navigation components | None directly | — | Use data supplied by parent screen | Parent screen context | Parent handles fallback |

---

# 7. Component-to-Data Matrix

| Component ID | Data Entity / Record | Read / Write | Data Purpose | Isolation Rule |
| ------------ | -------------------- | ------------ | ------------ | -------------- |
| CMP-001 | None directly | None | Presentational/navigation behavior | No Learner data access. |
| CMP-002 | `learner`, `auth_session` | Read | Learner identity and session-aware navigation display | Must not show another Learner identity. |
| CMP-003 | `learner_auth_account`, `auth_session`, `learner` | Read/Write | Read credential account and Learner reference; create auth session through login API behavior | Must preserve account isolation after login. |
| CMP-004 | `landing_page_config`, `learning_program` highlight projection | Read | Public Published program highlight summary | No Learner personalization. |
| CMP-005 | `learning_program` | Read | Learning Program summary for manual selection | Selection remains under active Learner context. |
| CMP-006 | `learning_program` | Read | Subject-style UI label mapped to Learning Program | Not a new domain entity; uses program reference. |
| CMP-007 | `learning_module`, optional `learning_state` | Read | Module summary and optional basic completion status | Progress indicators scoped to active Learner. |
| CMP-008 | `learning_activity`, optional `learning_state` | Read | Activity name, type, completion indicator, AI Practice label only for Practice | Activity status scoped to active Learner. |
| CMP-009 | `content_item` | Read | Published Learning Content display | Content must be accessible for active activity/context. |
| CMP-010 | `learning_objective`, `learning_activity` | Read | Learning Objective / Tujuan Pembelajaran context | Objective must belong to selected activity. |
| CMP-011 | `learning_activity`, `learning_objective`, `ai_practice_conversation` | Read/Write | Read Practice activity/objective context; create/start AI Practice conversation through start API | Uses active Learner context and selected Practice activity. |
| CMP-012 | `ai_practice_conversation`, `ai_practice_message`, `ai_practice_provider_record`, `content_item` | Read/Write | Read conversation/content context; write conversation messages and provider records through AI Practice API behavior | Conversation scoped to active Learner/activity/objective. |
| CMP-013 | `ai_practice_message`, `ai_practice_safety_event` | Read/Write | Read/write message display state and message records through conversation API behavior | Messages scoped to conversation owner. |
| CMP-014 | `ai_practice_provider_record` fallback status | Read | Show AI provider failure/fallback status only | No business write; no impact to Learner outcomes. |
| CMP-015 | `learning_activity`, `learning_state`, `activity_result` | Read/Write | Read activity/state; write Activity Result through completion API/backend behavior | Writes Activity Result for active Learner only. |
| CMP-016 | `assessment_result`, `assessment_blueprint`, `activity_result` | Read | Read-only Assessment Result summary and evaluation reference | Result must belong to active Learner; read-only. |
| CMP-017 | `learner`, `learning_state`, `activity_result`, `assessment_result` | Read | Basic progress counts and current state | Progress scoped to active Learner; dashboard remains read-only. |
| CMP-018 | `activity_result`, `learning_activity` | Read | Completed activity / Activity Result history | Active Learner only; no cross-learner result exposure. |
| CMP-019 | `assessment_result`, `activity_result` | Read | Read-only Assessment Result history | Active Learner only; read-only. |
| CMP-020 | None directly | None | Presentational empty-state copy and safe action | Parent screen enforces context. |
| CMP-021 | None directly | None | Loading/skeleton/spinner display | Must not show stale Learner data after session invalidation. |
| CMP-022 | `auth_session`, requested record context | Read | Determine safe error/fallback message and recovery action | No stack trace, provider details, raw IDs, secrets, or unauthorized data. |
| CMP-023 | None directly | None | Safe route action supplied by parent screen | Must not route to unauthorized resource. |
| CMP-024 | `auth_session` | Write | End/update/delete active auth session through logout API behavior | Clear local state; no previous Learner data remains visible. |
| CMP-025 | `learning_program`, `learning_module`, `learning_activity` refs | Read | Breadcrumb/back labels and safe route context | Must validate destination access under active Learner context. |
| CMP-026 | `ai_practice_conversation`, voice capture | Read/Write | Voice recording and processing UI | Active conversation owner only. |
| CMP-027 | canonical transcript, audio response | Read | Transcript and playback UI | Active conversation owner only. |
| CMP-028 | `activity_result`, `assessment_result` | Write/Read | Assessable submission and result status | Active Learner only; result read-only. |
| CMP-029 | `learning_activity`, `activity_result`, `assessment_result` | Read/Write | Placement-purpose activity lifecycle | Active Learner only; no placement entity. |

---

# 8. Component State Matrix

| Component ID | Default State | Loading State | Empty State | Error State | Disabled State | Success State |
| ------------ | ------------- | ------------- | ----------- | ----------- | -------------- | ------------- |
| CMP-001 | Product name and Login CTA visible | N/A | N/A | Public header still renders if content API fails | Login CTA disabled only if route unavailable | Login CTA routes to UX-002 |
| CMP-002 | Learner identity, nav, logout visible | Resolving active Learner context | N/A | Session invalid or Learner context missing | Nav/logout disabled while session check runs | Active Learner header rendered |
| CMP-003 | Identifier/password fields ready | Submit in progress; fields may be locked | N/A | Invalid credentials, server unavailable, or `auth/me` missing | Submit disabled for empty/invalid fields or pending request | Login success; active Learner context established; route to UX-003 |
| CMP-004 | Public program highlight displayed | Highlight data loading | No highlights available | Public highlight load failed | CTA disabled only if target unavailable | Highlight rendered or safe Login CTA shown |
| CMP-005 | Published Learning Program card displayed | Program list loading | No program available | Program list failed | Selection disabled if program unavailable | Manual program selection opens UX-005 |
| CMP-006 | Subject-style program card displayed | Program/subject representation loading | No subject/program option available | Program load failed | Selection disabled if linked program unavailable | Manual subject/program choice opens UX-005 |
| CMP-007 | Module summary displayed | Module list loading | No module available | Module load failed | Selection disabled if module unavailable | Module section/activities displayed |
| CMP-008 | Activity summary and activity_type displayed | Activity list/detail loading | No activity available | Activity load failed | Open action disabled if unavailable | Activity opens UX-006; AI label appears only for Practice |
| CMP-009 | Published content rendered | Content loading | Content unavailable; instruction fallback shown | Content render/load failed | Viewer controls disabled if content unavailable | Content visible or safe instruction fallback displayed |
| CMP-010 | Learning Objective context visible | Objective/activity context loading | Objective context unavailable | Objective/activity load failed | N/A | Objective shown for selected Learning Activity |
| CMP-011 | Start AI Practice visible for Practice activity | AI Practice session starting | Hidden for non-Practice activity | AI unavailable or start request failed | Hidden for non-Practice; disabled when AI unavailable or request pending | AI Practice session created and UX-007 opens |
| CMP-012 | Conversation history and input visible | Loading history or waiting for AI response | New conversation with no messages yet | AI unavailable, governance failure, message send failure | Input/send disabled while sending, completed, or unavailable | Message response displayed or session completed back to UX-006 |
| CMP-013 | Learner/AI message bubble rendered | Message sending or response pending | N/A | Message failed or safety/governance notice shown | Retry disabled when conversation closed/unavailable | Message appears in conversation history |
| CMP-014 | Banner hidden until AI fallback needed | Optional retry/check in progress | N/A | AI unavailable fallback visible | Retry disabled if unavailable; activity continuation remains enabled | Learner continues activity without AI or retry succeeds |
| CMP-015 | Complete Activity button ready | Completion request pending | N/A | Completion criteria unmet, invalid state, or completion failed | Disabled while pending or criteria unmet | Activity completed; Activity Result created by backend; UX-008 flow begins |
| CMP-016 | Read-only Assessment Result summary visible | Assessment Result loading/processing | Result pending/not yet available | Assessment failed or result not found | Edit controls never available; navigation may disable while loading | Assessment Result displayed read-only; Learner can go Dashboard/Module List |
| CMP-017 | Basic progress counts/current state visible | Progress summary loading | No completed activities/results | Progress load failed | Navigation disabled while loading if target unknown | Basic progress summary displayed without Knowledge Profile/Learning Decision |
| CMP-018 | Activity Result rows visible | Activity history loading | No completed activities | Activity history load failed | Row actions disabled if target unavailable | Completed activity history displayed |
| CMP-019 | Assessment Result rows visible | Assessment history loading | No Assessment Result available | Assessment history load failed | Row actions disabled if target unavailable | Read-only Assessment Result history displayed |
| CMP-020 | Contextual empty message visible | N/A | Empty state active for no program/module/activity/result | N/A unless safe action fails | Safe action disabled if route unavailable | Safe action routes to allowed destination |
| CMP-021 | Hidden when not loading | Spinner/skeleton/progress visible | N/A | Replaced by error component on failure | N/A | Loading indicator removed when data/action resolves |
| CMP-022 | Hidden when no error | Retry/action pending if selected | N/A | Safe error/fallback message visible | Retry/action disabled when unsafe or pending | Error dismissed, retried, or safe navigation executed |
| CMP-023 | Safe navigation action visible | Route transition pending | N/A | Destination unavailable or unauthorized | Disabled if destination unsafe/unknown | Navigates to Login, Home, Program, Module, Activity, or Dashboard as allowed |
| CMP-024 | Logout control visible | Logout request pending | N/A | Logout failed with safe retry message | Disabled while logout request pending | Session ended; local UI state cleared; route to UX-001/UX-002 |
| CMP-025 | Breadcrumb/back path visible | Parent context loading | Breadcrumb hidden if path unavailable | Destination missing/unauthorized | Disabled if destination unsafe/unknown | Navigates back/continues to allowed non-adaptive destination |
| CMP-026 | Voice controls ready | Voice Recording or Voice Processing | N/A | Permission/voice failure | Disabled while processing | Transcript Ready or Retry |
| CMP-027 | Transcript Ready | Playback loading | No transcript | Playback failed | Disabled without audio | Replay available |
| CMP-028 | Submission ready | Submitting or Assessment Pending | N/A | Assessment failed | Duplicate submit disabled | Assessment Ready |
| CMP-029 | Placement available | Starting or in progress | Placement unavailable | Failed | Disabled while submitting | Assessment Ready or Retry |

---

# 9. AI / Engine / Event Boundary Matrix

| Component ID | AI Dependency | Engine Dependency | Can Produce Official Runtime Event? | Can Produce Assessment Result? | Can Update Knowledge Profile? | Can Generate Learning Decision? | Notes |
| ------------ | ------------- | ----------------- | ----------------------------------- | ------------------------------ | ----------------------------- | ------------------------------- | ----- |
| CMP-001 | None | None | No | No | No | No | UI component only. |
| CMP-002 | None | None | No | No | No | No | UI component only. |
| CMP-003 | None | None | No | No | No | No | UI component only. |
| CMP-004 | None | None | No | No | No | No | UI component only. |
| CMP-005 | None | None | No | No | No | No | UI component only. |
| CMP-006 | None | None | No | No | No | No | UI component only. |
| CMP-007 | None | None | No | No | No | No | UI component only. |
| CMP-008 | None | None | No | No | No | No | UI component only. |
| CMP-009 | None | None | No | No | No | No | UI component only. |
| CMP-010 | None | None | No | No | No | No | UI component only. |
| CMP-011 | AI Practice only | None | No | No | No | No | AI guidance/feedback only; audit/observability/provider records. |
| CMP-012 | AI Practice only | None | No | No | No | No | AI guidance/feedback only; audit/observability/provider records. |
| CMP-013 | AI Practice only | None | No | No | No | No | AI guidance/feedback only; audit/observability/provider records. |
| CMP-014 | AI Practice only | None | No | No | No | No | AI guidance/feedback only; audit/observability/provider records. |
| CMP-015 | None | Downstream after backend completion | No | No | No | No | UI component only. |
| CMP-016 | None | Displays Assessment Engine output only | No | No | No | No | Read-only display of Assessment Result. |
| CMP-017 | None | None | No | No | No | No | UI component only. |
| CMP-018 | None | None | No | No | No | No | UI component only. |
| CMP-019 | None | None | No | No | No | No | UI component only. |
| CMP-020 | None | None | No | No | No | No | UI component only. |
| CMP-021 | None | None | No | No | No | No | UI component only. |
| CMP-022 | None | None | No | No | No | No | UI component only. |
| CMP-023 | None | None | No | No | No | No | UI component only. |
| CMP-024 | None | None | No | No | No | No | UI component only. |
| CMP-025 | None | None | No | No | No | No | UI component only. |
| CMP-026 | Voice transport only | None | No | No | No | No | Frontend Voice Recording/Processing only; never Runtime state. |
| CMP-027 | STT/TTS transport only | None | No | No | No | No | Transcript Ready, Replay, and Retry only. |
| CMP-028 | None | Assessment Engine boundary | No | No | No | No | Submits evidence; Engine alone produces Assessment Result. |
| CMP-029 | None | Assessment Engine result only | No | No | No | No | Placement is a specialized Learning Activity, not a resource. |

Assessment Result Summary hanya menampilkan Assessment Result yang diproduksi Assessment Engine. AI components hanya menampilkan practice guidance/feedback dan mencatat audit/observability/provider records sesuai kontrak MVP AI Conversation Practice.

---

# 10. Accessibility Requirements

* Gunakan semantic heading structure sesuai hierarki screen.
* Semua interactive components wajib mendukung keyboard navigation.
* Focus states harus terlihat untuk tombol, link, input, dan control navigasi.
* Form fields wajib memiliki label eksplisit; placeholder tidak cukup sebagai label.
* Error messages harus dapat dibaca screen reader.
* Gunakan `aria-live` atau mekanisme setara untuk async errors, AI unavailable, assessment failed, dan session expired.
* AI messages harus dapat dibedakan berdasarkan role dengan accessible label, misalnya Learner message dan AI Practice response.
* Loading states harus mengumumkan progress bila blocking atau berlangsung lama.
* Color contrast mengikuti WCAG 2.1 AA.
* Jangan hanya mengandalkan warna untuk menyampaikan status, error, disabled state, atau completion state.

---

# 11. Localization Requirements

* UI copy mendukung Bahasa Indonesia terlebih dahulu.
* Official technical terms dapat tetap menggunakan English bila dibutuhkan untuk konsistensi arsitektur.
* Label Learner-facing dapat menerjemahkan istilah:
  * Learning Objective → Tujuan Pembelajaran.
  * Learning Activity → Aktivitas Belajar.
  * Assessment Result → Hasil Evaluasi.
  * AI Conversation Practice → Latihan Percakapan AI.
* AI Conversation Practice mendukung subject language context seperti English atau Arabic jika Learning Content tersedia.
* Error messages harus jelas, ramah, dan tidak mengekspos detail internal.

---

# 12. QA Checklist

| Component ID | QA Focus | Critical Checks | Out-of-Scope Checks |
| ------------ | -------- | --------------- | ------------------- |
| CMP-001 | Public Header | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-002 | Authenticated Header | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-003 | Login Form | No signup/reset/social login; two learner accounts; safe errors. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-004 | Program Highlight Card | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-005 | Program Card | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-006 | Subject Card | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-007 | Module Card | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-008 | Activity Card | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-009 | Learning Content Viewer | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-010 | Learning Objective Context | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-011 | AI Practice Entry Control | Hidden for non-Practice; starts Practice session only. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-012 | AI Conversation Panel | AI cannot create official outcomes; fallback works. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-013 | AI Message Bubble | AI response labeled and not score/result-like. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-014 | AI Practice Fallback Banner | Does not block activity completion or create outcomes. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-015 | Activity Completion Control | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-016 | Assessment Result Summary | Read-only Assessment Result produced by Assessment Engine. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-017 | Progress Summary Card | No Knowledge Profile/Learning Decision/adaptive recommendation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-018 | Activity Result List | Data isolation across learner accounts. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-019 | Assessment Result List | Read-only, no Learning Decision/adaptive next step. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-020 | Empty State Block | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-021 | Loading State Indicator | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-022 | Error / Fallback Banner | No internal details leaked. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-023 | Safe Navigation Control | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-024 | Logout Control | Clears local data after logout. | No new MVP feature, no unauthorized data, no UI Runtime Event. |
| CMP-025 | Breadcrumb / Back Navigation | Visibility, state variants, accessibility, and data isolation. | No new MVP feature, no unauthorized data, no UI Runtime Event. |

---

# 13. Out of Scope Components

| Component | Reason | Future / Phase / Open Issue Status |
| --------- | ------ | ---------------------------------- |
| Signup Form | Public signup is outside MVP. | Open Issue / Future |
| Forgot Password Form | Password reset is outside MVP auth. | Advanced Authentication Open Issue |
| OAuth / Social Login Button | OAuth/social login/SSO are outside MVP. | Advanced Authentication Open Issue |
| MFA Challenge | MFA is outside MVP. | Advanced Authentication Open Issue |
| Role / Permission Selector | Role management is outside MVP. | Advanced Authentication Open Issue |
| Enrollment Form | Enrollment workflow is not introduced. | Open Issue |
| Full adaptive placement/recommendation widget | Adaptive recommendation is not MVP. | Phase 2 |
| Adaptive Recommendation Card | Adaptive path is not MVP. | Phase 2 |
| Knowledge Profile Widget | Knowledge Profile UI is excluded. | Phase 2 |
| Learning Decision Explanation Panel | Learning Decision explanation is excluded. | Phase 3 / Future |
| Educator Dashboard Widget | Educator experience outside MVP. | Phase 4 |
| Parent Dashboard Widget | Parent experience outside MVP. | Future |
| Payment Component | Payment/subscription outside MVP. | Future |
| Notification Center Component | Notifications outside MVP. | Phase 5 / Future |
| Achievement / Certificate Component | Achievements/certificates outside MVP. | Phase 5 / Future |
| Advanced Analytics Chart | Advanced analytics outside MVP component scope. | Phase 2+ / Open Issue |

---

# 14. References

* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/70_ui_ux/72_screen_inventory.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/80_implementation/80_feature_breakdown.md`
* `docs/99_architecture_decisions.md`
