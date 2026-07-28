# Interaction Specification — Kaifa v2 MVP

| Field | Value |
| --- | --- |
| Version | 1.0 |
| Status | Freeze |
| Owner | Product & UI/UX |
| Depends On | `70_ui_ux_spec.md`, `71_user_flow.md`, `72_screen_inventory.md`, `73_component_spec.md`, `74_frontend_state_model.md`, `52_prd.md`, `60_srs.md`, `62_api_spec.md`, `80_feature_breakdown.md` |
| Used By | Product, UI/UX, Frontend, Backend, QA |
| Last Updated | 2026-07-05 |

# 1. Purpose

Dokumen ini mendefinisikan MVP UI interaction behavior untuk Kaifa v2, termasuk click behavior, form submission, route transition, disabled state, retry behavior, keyboard interaction, AI chat interaction, loading/error handling, dan QA interaction checks.

Dokumen ini tidak mendefinisikan domain business rules, backend runtime behavior, engine behavior, AI governance rules, atau official event publication. UI interactions dapat memanggil API, tetapi hasil resmi tetap dimiliki oleh backend/API, Assessment Engine, atau service terkait sesuai contract yang sudah disetujui.

# 2. Interaction Principles

* Interactions bersifat UI-level only.
* Interactions boleh memanggil APIs tetapi tidak memiliki backend outcomes.
* Interactions pada authenticated screens harus berjalan dengan active Learner context.
* Interactions harus menjaga Learner data isolation.
* Interactions harus aman saat loading, retry, dan failure.
* Interactions harus mencegah duplicate unsafe submits.
* Interactions tidak boleh mengekspos internal error details.
* Interactions tidak boleh mem-publish Official Runtime Event.
* AI Practice interactions adalah assessable MVP capability untuk Practice-only activities; STT/TTS adalah mandatory capability dan text remains available for accessibility or technical fallback.
* Activity completion interaction memicu completion API tetapi tidak membuat Assessment Result langsung di UI.
* Assessment Result interaction bersifat read-only.
* Dashboard interactions hanya navigation/read-only.
* Tidak ada interaction yang boleh memperkenalkan adaptive recommendation, Enrollment, Knowledge Profile UI, Learning Decision UI, signup, atau advanced auth. Placement Test hanya boleh direpresentasikan sebagai specialized assessable Learning Activity.

# 3. Interaction Inventory

| Interaction ID | Interaction Name | Used In Screens | Related Components | Primary Trigger | API Call? | MVP Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INT-001 | Open Landing Page | UX-001 | CMP-001, CMP-004, CMP-021 | User opens `/` | Yes | MVP | Public only. |
| INT-002 | Click Login CTA | UX-001, UX-002 | CMP-001, CMP-023 | Click Login | No | MVP | Routes to Login; no signup route. |
| INT-003 | Submit Login Form | UX-002 | CMP-003, CMP-021, CMP-022 | Submit form | Yes | MVP | Basic Learner Authentication. |
| INT-004 | Validate Active Learner Context | UX-003 to UX-011 | CMP-002, CMP-021, CMP-022 | Authenticated route load | Yes | MVP | Uses `auth/me`. |
| INT-005 | Logout | UX-003 to UX-011 | CMP-024, CMP-002 | Click Logout | Yes | MVP | Clears Learner-scoped state. |
| INT-006 | Open Learner Home | UX-003 | CMP-002, CMP-005, CMP-017 | Route to `/home` | Yes | MVP | Learner entry point. |
| INT-007 | Open Program Selection | UX-004 | CMP-005, CMP-006 | Route to `/programs` | Yes | MVP | Published programs only. |
| INT-008 | Select Program / Subject | UX-003, UX-004, UX-005 | CMP-005, CMP-006, CMP-025 | Click Program/Subject Card | No | MVP | Manual selection. |
| INT-009 | Open Program Detail | UX-005 | CMP-007, CMP-008, CMP-025 | Route to `/programs/:programId` | Yes | MVP | No adaptive sequencing. |
| INT-010 | Select Module | UX-005 | CMP-007, CMP-008 | Click Module Card/section | Maybe | MVP | Loads activities for selected context. |
| INT-011 | Select Learning Activity | UX-005, UX-006 | CMP-008, CMP-025 | Click Activity Card | Yes | MVP | Opens activity route. |
| INT-012 | Load Learning Content | UX-006 | CMP-009, CMP-010, CMP-021 | Activity route load | Yes | MVP | Published content only. |
| INT-013 | Complete Learning Activity | UX-006, UX-008 | CMP-015, CMP-021, CMP-022 | Click Complete Activity | Yes | MVP | Frontend does not create Assessment Result. |
| INT-014 | Start AI Practice | UX-006, UX-007 | CMP-011, CMP-012, CMP-014 | Click AI Practice | Yes | MVP | Practice activity only. |
| INT-015 | Send AI Practice Message | UX-007 | CMP-012, CMP-013 | Submit chat message | Yes | MVP | Practice feedback only. |
| INT-016 | End AI Practice Session | UX-007, UX-006 | CMP-012, CMP-023 | Click End/Back | Yes | MVP | Does not complete activity. |
| INT-017 | Continue Activity Without AI | UX-006, UX-007, UX-010 | CMP-014, CMP-023 | Click Continue/close fallback | No | MVP | AI fallback path. |
| INT-018 | Open Assessment Result | UX-008 | CMP-016, CMP-021, CMP-022 | Route to result | Yes | MVP | Read-only. |
| INT-019 | Open Dashboard | UX-003, UX-009 | CMP-017, CMP-018, CMP-019 | Click Dashboard | Yes | MVP | Basic progress only. |
| INT-020 | Retry Failed Request | UX-001 to UX-011 | CMP-022, CMP-023 | Click Retry | Yes | MVP | Safe retry only. |
| INT-021 | Navigate Back / Safe Navigation | UX-003 to UX-011 | CMP-023, CMP-025 | Click Back/Continue | No | MVP | No Learning Decision. |
| INT-022 | Handle Session Expired | UX-003 to UX-011 | CMP-022, CMP-023 | 401/auth invalid | Yes | MVP | Clears private state. |
| INT-023 | Handle Unauthorized Access | UX-003 to UX-011 | CMP-022, CMP-023 | 403/resource mismatch | Maybe | MVP | Safe destination. |
| INT-024 | Handle Empty State Action | UX-001 to UX-011 | CMP-020, CMP-023 | Click empty-state action | Maybe | MVP | No synthetic content. |
| INT-025 | Keyboard Navigation and Focus Handling | UX-001 to UX-011 | CMP-003, CMP-012, CMP-023, CMP-025 | Keyboard/focus event | No | MVP | Accessibility behavior. |
| INT-026 | Announce Async Error / Status | UX-001 to UX-011 | CMP-014, CMP-021, CMP-022 | Async status/error change | No | MVP | `aria-live` or equivalent. |
| INT-027 | Dismiss Fallback Banner | UX-006, UX-007, UX-010 | CMP-014, CMP-022 | Click dismiss | No | MVP | UI-only dismissal. |
| INT-028 | Placement Test Lifecycle | UX-005, UX-011, UX-008 | CMP-029, CMP-028 | Start/complete Placement-purpose activity | Yes | MVP | Assessment Engine result only. |
| INT-029 | Voice Capture and Playback | UX-007 | CMP-026, CMP-027 | Record/play/replay | Yes | MVP | Frontend voice states only. |
| INT-030 | Submit Assessable AI Practice | UX-007, UX-008 | CMP-028 | Complete assessable conversation | Yes | MVP | Submit Activity Result, wait, then UX-008. |

# 4. Interaction Detail Specifications

## INT-001 — Open Landing Page

* Purpose: Membuka public Landing Page pada route `/`.
* Used In Screens: UX-001.
* Related Components: CMP-001, CMP-004, CMP-020, CMP-021, CMP-022.
* Related State Domains: FSM-003, FSM-004, FSM-017, FSM-018, FSM-019, FSM-020.
* Trigger: User membuka `/` atau kembali ke Landing Page.
* Preconditions: Tidak ada; route publik.
* Interaction Steps: Render public header; load landing config; load program highlights; tampilkan content atau fallback aman.
* API Dependencies: `GET /api/v1/public/landing-page`, `GET /api/v1/public/program-highlights`.
* Data Dependencies: `landing_page_config`, Published program highlights.
* Loading Behavior: Tampilkan loading/skeleton untuk public content.
* Success Behavior: Landing content dan highlights tampil; Login CTA tersedia.
* Error / Fallback Behavior: Tampilkan public fallback tanpa private data.
* Disabled / Guard Conditions: Tidak ada Learner-only control.
* Security / Data Isolation Rules: Tidak membaca Learner context atau Learner-scoped data.
* Accessibility Requirements: Header, headings, links, dan CTA keyboard accessible.
* AI / Engine / Event Boundary Notes: Tidak ada Enrollment, signup, AI call, Engine call, atau Runtime Event.
* Out of Scope: Enrollment, signup, learner personalization, Runtime Events.
* QA Checklist: Bisa dibuka tanpa auth; tidak ada learner identity; public API failure aman.

## INT-002 — Click Login CTA

* Purpose: Mengarahkan user dari Landing Page ke Login Page.
* Used In Screens: UX-001, UX-002.
* Related Components: CMP-001, CMP-023.
* Related State Domains: FSM-003, FSM-020.
* Trigger: User click Login CTA.
* Preconditions: None; tidak membutuhkan Learner context.
* Interaction Steps: Activate CTA; route ke `/login`; focus pindah ke Login Page heading atau identifier field.
* API Dependencies: None.
* Data Dependencies: None.
* Loading Behavior: Route transition ringan; tidak perlu blocking spinner kecuali router membutuhkan.
* Success Behavior: UX-002 tampil.
* Error / Fallback Behavior: Jika route gagal, tampilkan safe navigation fallback.
* Disabled / Guard Conditions: CTA tidak disabled kecuali navigation pending.
* Security / Data Isolation Rules: Tidak menampilkan private data.
* Accessibility Requirements: CTA memiliki accessible name yang jelas dan bisa diaktifkan dengan Enter/Space.
* AI / Engine / Event Boundary Notes: Tidak publish Official Runtime Event.
* Out of Scope: Signup route, public registration, forgot password link.
* QA Checklist: Login CTA menuju UX-002; tidak ada signup CTA.

## INT-003 — Submit Login Form

* Purpose: Mengautentikasi learner dengan MVP Basic Learner Authentication.
* Used In Screens: UX-002.
* Related Components: CMP-003, CMP-021, CMP-022.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-017, FSM-019, FSM-020.
* Trigger: Submit login form.
* Preconditions: `identifier` tidak kosong; `password` tidak kosong; tidak sedang submitting.
* Interaction Steps: Validate required fields; set `authenticating`; call login API; call `auth/me`; establish active Learner context; clear stale learner state; route ke UX-003.
* API Dependencies: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
* Data Dependencies: `learner_auth_account`, `auth_session`, `learner`.
* Loading Behavior: Submit button pending; duplicate submit disabled.
* Success Behavior: Active Learner context tersedia dan route ke `/home`.
* Error / Fallback Behavior: Tampilkan safe error untuk credential/session/network failure; focus ke field/error summary.
* Disabled / Guard Conditions: Disabled jika field kosong atau request pending.
* Security / Data Isolation Rules: Password tidak disimpan di frontend state; dua learner accounts harus terisolasi; stale Learner data dibersihkan sebelum render.
* Accessibility Requirements: Label form eksplisit; error terbaca screen reader; focus ke first invalid field.
* AI / Engine / Event Boundary Notes: Tidak ada Engine, AI, Assessment Result, atau Runtime Event.
* Out of Scope: Signup, forgot password, OAuth, SSO, MFA, role management.
* QA Checklist: Duplicate submit dicegah; dua learner dapat login; Learner A data tidak muncul setelah Learner B login.

## INT-004 — Validate Active Learner Context

* Purpose: Memastikan authenticated screen hanya render setelah active Learner context valid.
* Used In Screens: UX-003, UX-004, UX-005, UX-006, UX-007, UX-008, UX-009.
* Related Components: CMP-002, CMP-021, CMP-022, CMP-023.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-017, FSM-019.
* Trigger: Authenticated route load, app boot, retry setelah suspected auth error.
* Preconditions: Route membutuhkan authentication.
* Interaction Steps: Tahan render private content; call `auth/me`; jika valid lanjut render; jika invalid clear Learner-scoped state dan redirect Login.
* API Dependencies: `GET /api/v1/auth/me`.
* Data Dependencies: `auth_session`, `learner`.
* Loading Behavior: Show route-level loading tanpa stale private data.
* Success Behavior: Screen render dengan active Learner context.
* Error / Fallback Behavior: Missing/expired context redirect ke UX-002.
* Disabled / Guard Conditions: Private controls tidak aktif sampai context valid.
* Security / Data Isolation Rules: Jangan menampilkan cached private data saat validation pending.
* Accessibility Requirements: Blocking loading status diumumkan bila perlu.
* AI / Engine / Event Boundary Notes: Tidak publish Official Runtime Event.
* Out of Scope: Role management, org identity, educator/parent accounts.
* QA Checklist: Direct route ke private URL tanpa session redirect; cached data tidak flash.

## INT-005 — Logout

* Purpose: Mengakhiri session learner dan membersihkan state frontend.
* Used In Screens: UX-003 to UX-011.
* Related Components: CMP-002, CMP-024, CMP-021.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-005 to FSM-016, FSM-017, FSM-019.
* Trigger: Click Logout Control.
* Preconditions: Authenticated session tersedia; logout tidak pending.
* Interaction Steps: Set `logoutPending`; call logout API; clear Learner-scoped state; redirect ke UX-001 atau UX-002.
* API Dependencies: `POST /api/v1/auth/logout`.
* Data Dependencies: `auth_session`, `learner`.
* Loading Behavior: Logout control pending/disabled.
* Success Behavior: No private data visible; public/Login route tampil.
* Error / Fallback Behavior: Jika API gagal tetapi session invalid, tetap clear local private state dan arahkan aman.
* Disabled / Guard Conditions: Disabled saat logout pending.
* Security / Data Isolation Rules: Jangan tinggalkan previous Learner data visible.
* Accessibility Requirements: Logout button memiliki accessible name; status pending diumumkan bila blocking.
* AI / Engine / Event Boundary Notes: Tidak ada Runtime Event dari UI.
* Out of Scope: Account management, session list, device management.
* QA Checklist: Logout membersihkan dashboard/result/AI state; back browser tidak menampilkan data lama.

## INT-006 — Open Learner Home

* Purpose: Membuka Learner Home sebagai entry point authenticated learner.
* Used In Screens: UX-003.
* Related Components: CMP-002, CMP-005, CMP-017, CMP-020, CMP-021, CMP-022.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-005, FSM-016, FSM-017, FSM-018, FSM-019.
* Trigger: Login success, click Home, route `/home`.
* Preconditions: Active Learner context valid.
* Interaction Steps: Validate context; load learner identity; load program entry points; optionally load basic progress summary.
* API Dependencies: `GET /api/v1/auth/me`, `GET /api/v1/learning-programs`.
* Data Dependencies: `learner`, `learning_program`, optional `learning_state`, `activity_result`, `assessment_result`.
* Loading Behavior: Show home loading; avoid stale Learner data.
* Success Behavior: Learner identity, programs, and basic progress display ready.
* Error / Fallback Behavior: Session expired redirect; no program empty state; network retry.
* Disabled / Guard Conditions: Program actions unavailable until list ready.
* Security / Data Isolation Rules: Data scoped to active Learner.
* Accessibility Requirements: Focus first heading; cards keyboard accessible.
* AI / Engine / Event Boundary Notes: Tidak menampilkan Knowledge Profile atau Learning Decision.
* Out of Scope: Adaptive recommendation and Enrollment. Placement Test is handled by INT-028 as an MVP specialized Learning Activity.
* QA Checklist: Home shows active learner only; no Knowledge Profile/Learning Decision.

## INT-007 — Open Program Selection

* Purpose: Menampilkan pilihan Published Learning Programs.
* Used In Screens: UX-004.
* Related Components: CMP-005, CMP-006, CMP-020, CMP-021, CMP-022.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-005, FSM-017, FSM-018, FSM-019.
* Trigger: Route `/programs` atau click program selection navigation.
* Preconditions: Active Learner context valid.
* Interaction Steps: Validate context; fetch programs; render Program Cards/Subject Cards.
* API Dependencies: `GET /api/v1/learning-programs`.
* Data Dependencies: `learning_program`.
* Loading Behavior: Program list loading.
* Success Behavior: Published programs tampil untuk manual selection.
* Error / Fallback Behavior: No program empty state atau safe error.
* Disabled / Guard Conditions: Selection disabled saat loading/error.
* Security / Data Isolation Rules: Program visibility mengikuti active Learner context/published availability.
* Accessibility Requirements: Cards operable via keyboard and announce selection target.
* AI / Engine / Event Boundary Notes: Tidak ada adaptive recommendation atau Learning Decision.
* Out of Scope: Enrollment and adaptive path. Placement Test entry is handled by INT-028 from Program Detail.
* QA Checklist: Manual selection only; no recommendation ranking.

## INT-008 — Select Program / Subject

* Purpose: Memilih Program Card atau Subject Card dan masuk ke Program Detail.
* Used In Screens: UX-003, UX-004, UX-005.
* Related Components: CMP-005, CMP-006, CMP-023, CMP-025.
* Related State Domains: FSM-003, FSM-005, FSM-006, FSM-007, FSM-008, FSM-009, FSM-010, FSM-011, FSM-013, FSM-014.
* Trigger: Click/keyboard activate Program Card atau Subject Card.
* Preconditions: Active Learner context valid; program id tersedia; navigation tidak pending.
* Interaction Steps: Clear downstream selected module/activity/content/completion/AI state; route ke `/programs/:programId`.
* API Dependencies: None directly; detail route loads data via INT-009.
* Data Dependencies: `learning_program` id from card.
* Loading Behavior: Navigation pending state if needed.
* Success Behavior: UX-005 opens for selected program.
* Error / Fallback Behavior: If route validation fails, show safe error and return to Program Selection.
* Disabled / Guard Conditions: Disabled jika program unavailable atau route pending.
* Security / Data Isolation Rules: Must not route to inaccessible program.
* Accessibility Requirements: Subject Card is clearly labeled as UI representation.
* AI / Engine / Event Boundary Notes: Tidak memakai Learning Decision-based next step.
* Out of Scope: Subject as new domain entity, adaptive personalized path.
* QA Checklist: Program switch resets old activity/AI state; subject card does not imply new entity.

## INT-009 — Open Program Detail

* Purpose: Menampilkan detail program, structure, modules, dan activities.
* Used In Screens: UX-005.
* Related Components: CMP-007, CMP-008, CMP-020, CMP-021, CMP-022, CMP-025.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-006, FSM-007, FSM-008, FSM-017, FSM-018, FSM-019.
* Trigger: Route `/programs/:programId`.
* Preconditions: Active Learner context valid; `programId` tersedia.
* Interaction Steps: Validate context; load program detail; load structure; load modules; load activities.
* API Dependencies: `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-programs/{programId}/program-structure`, `GET /api/v1/learning-modules`, `GET /api/v1/learning-activities`.
* Data Dependencies: `learning_program`, `program_structure`, `learning_module`, `learning_activity`.
* Loading Behavior: Program/module/activity loading indicators.
* Success Behavior: Program detail and lists ready.
* Error / Fallback Behavior: Not found, unauthorized, no module, no activity, network/server error.
* Disabled / Guard Conditions: Module/activity actions unavailable until data ready.
* Security / Data Isolation Rules: Unauthorized program is not shown as empty.
* Accessibility Requirements: Module/activity lists have semantic structure.
* AI / Engine / Event Boundary Notes: No adaptive sequencing.
* Out of Scope: Learning Decision-based recommendation.
* QA Checklist: No adaptive labels; not found/unauthorized safe.

## INT-010 — Select Module

* Purpose: Memilih module section/card untuk melihat activities terkait.
* Used In Screens: UX-005.
* Related Components: CMP-007, CMP-008.
* Related State Domains: FSM-006, FSM-007, FSM-008, FSM-017, FSM-018, FSM-019, FSM-020.
* Trigger: Click/keyboard activate Module Card/section.
* Preconditions: Program valid; module tersedia; action tidak pending.
* Interaction Steps: Set selected module display state; load/filter activities for selected module/program.
* API Dependencies: `GET /api/v1/learning-activities` if activities are loaded on selection.
* Data Dependencies: `learning_module`, `learning_activity`.
* Loading Behavior: Activity list loading/refreshing if needed.
* Success Behavior: Activities for selected module visible.
* Error / Fallback Behavior: No activity empty state or safe error.
* Disabled / Guard Conditions: Disabled jika module unavailable atau activities loading requires guard.
* Security / Data Isolation Rules: Module must belong to selected accessible program.
* Accessibility Requirements: Selection state announced and not color-only.
* AI / Engine / Event Boundary Notes: No adaptive sequencing.
* Out of Scope: New module route requirement, adaptive path.
* QA Checklist: Activity list updates safely; no Learning Decision text.

## INT-011 — Select Learning Activity

* Purpose: Membuka Learning Activity Page untuk selected activity.
* Used In Screens: UX-005, UX-006.
* Related Components: CMP-008, CMP-023, CMP-025.
* Related State Domains: FSM-003, FSM-008, FSM-009, FSM-010, FSM-011, FSM-012, FSM-013, FSM-014.
* Trigger: Click Activity Card.
* Preconditions: Active Learner context valid; activity id tersedia dan accessible.
* Interaction Steps: Clear previous activity-specific state; route to `/activities/:activityId`; load selected activity, objective, and content.
* API Dependencies: `GET /api/v1/learning-activities/{activityId}`.
* Data Dependencies: `learning_activity`, `learning_objective`, `content_item`.
* Loading Behavior: Activity route loading.
* Success Behavior: UX-006 ready; AI label/control only if `activity_type = Practice`.
* Error / Fallback Behavior: Activity not found/unauthorized/network error.
* Disabled / Guard Conditions: Disabled if activity unavailable or navigation pending.
* Security / Data Isolation Rules: Activity must belong to accessible context.
* Accessibility Requirements: Activity card has clear target label.
* AI / Engine / Event Boundary Notes: No frontend business state transition.
* Out of Scope: Adaptive activity selection. Placement uses explicit `purpose = Placement` metadata, not an adaptive gate.
* QA Checklist: Activity switch clears old AI messages/content; non-Practice hides AI control.

## INT-012 — Load Learning Content

* Purpose: Memuat dan menampilkan Published Learning Content untuk activity.
* Used In Screens: UX-006.
* Related Components: CMP-009, CMP-010, CMP-020, CMP-021, CMP-022.
* Related State Domains: FSM-009, FSM-010, FSM-011, FSM-017, FSM-018, FSM-019.
* Trigger: Activity route loaded or content retry.
* Preconditions: Selected activity valid.
* Interaction Steps: Fetch content; render content viewer; show objective context; handle empty content.
* API Dependencies: `GET /api/v1/learning-contents`.
* Data Dependencies: `content_item`, `learning_objective`, `learning_activity`.
* Loading Behavior: Content viewer loading state.
* Success Behavior: Published content visible.
* Error / Fallback Behavior: Empty content instruction fallback; network/server retry.
* Disabled / Guard Conditions: Content actions unavailable while loading if they depend on loaded data.
* Security / Data Isolation Rules: Content must be Published and accessible through selected activity.
* Accessibility Requirements: Content structure uses headings/lists where appropriate.
* AI / Engine / Event Boundary Notes: Tidak generate content dynamically dengan AI; tidak personalize via Knowledge Profile.
* Out of Scope: AI-generated content, Knowledge Profile personalization.
* QA Checklist: Empty content fallback safe; no generated content claim.

## INT-013 — Complete Learning Activity

* Purpose: Menyelesaikan Learning Activity secara eksplisit.
* Used In Screens: UX-006, UX-008.
* Related Components: CMP-015, CMP-016, CMP-021, CMP-022, CMP-023.
* Related State Domains: FSM-001, FSM-002, FSM-009, FSM-012, FSM-015, FSM-017, FSM-019.
* Trigger: Click Complete Activity.
* Preconditions: Active Learner context; selected activity valid; tidak sedang submitting; completion action allowed by backend/API.
* Interaction Steps: Set submitting; call completion API; on success receive Activity Result/result reference as API behavior; route to UX-008 or show Assessment Result pending/loading state.
* API Dependencies: `POST /api/v1/learning-activities/{activityId}/complete`.
* Data Dependencies: `learning_activity`, `learning_state`, `activity_result`, later `assessment_result`.
* Loading Behavior: Button pending; duplicate submit disabled.
* Success Behavior: Activity Result created by backend/API behavior; Assessment Result display flow starts when available.
* Error / Fallback Behavior: Safe validation/network/server error with retry/back behavior.
* Disabled / Guard Conditions: Disabled while submitting, invalid activity, invalid context, or blocked by API state.
* Security / Data Isolation Rules: Completion scoped to active Learner and selected activity.
* Accessibility Requirements: Pending and error state announced; button label remains clear.
* AI / Engine / Event Boundary Notes: UI does not create Assessment Result, update Knowledge Profile, generate Learning Decision, or publish Official Runtime Event.
* Out of Scope: AI-required completion, manual scoring, frontend assessment.
* QA Checklist: Double-submit prevented; AI Practice not required; no frontend result creation.

## INT-014 — Start AI Practice

* Purpose: Memulai AI Conversation Practice dari Practice activity.
* Used In Screens: UX-006, UX-007.
* Related Components: CMP-011, CMP-012, CMP-014, CMP-021, CMP-022.
* Related State Domains: FSM-009, FSM-010, FSM-011, FSM-013, FSM-014, FSM-017, FSM-019, FSM-020.
* Trigger: Click AI Practice Entry Control.
* Preconditions: `activity_type = Practice`; active Learner context; Learning Objective available; AI not already starting/unavailable.
* Interaction Steps: Set AI availability `starting`; call start API; open UX-007 as route/modal/panel; load conversation context.
* API Dependencies: `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`.
* Data Dependencies: `learning_activity`, `learning_objective`, `content_item`, `ai_practice_conversation`.
* Loading Behavior: Entry control pending.
* Success Behavior: AI Conversation Practice opens.
* Error / Fallback Behavior: AI fallback banner; allow activity completion without AI.
* Disabled / Guard Conditions: Hidden for non-Practice; disabled/unavailable if provider not available or starting.
* Security / Data Isolation Rules: Conversation belongs to active Learner/activity/objective.
* Accessibility Requirements: Entry control accessible; fallback announced.
* AI / Engine / Event Boundary Notes: AI Practice feedback is not assessment; when submitted as assessable Practice, Assessment Engine alone produces the official Assessment Result.
* Out of Scope: AI official scoring, AI-generated Assessment Result.
* QA Checklist: Hidden for non-Practice; failure does not block completion.

## INT-015 — Send AI Practice Message

* Purpose: Mengirim learner message dan menampilkan AI Practice response.
* Used In Screens: UX-007.
* Related Components: CMP-012, CMP-013, CMP-014, CMP-021, CMP-022.
* Related State Domains: FSM-014, FSM-017, FSM-019, FSM-020.
* Trigger: Submit AI message form.
* Preconditions: AI conversation active; message tidak kosong; tidak sedang sending; active Learner owns conversation.
* Interaction Steps: Validate input; set sending; call message API; append Learner message and AI Practice response; clear input.
* API Dependencies: `POST /api/v1/ai-conversations/{conversationId}/messages`.
* Data Dependencies: `ai_practice_conversation`, `ai_practice_message`, `ai_practice_provider_record`, `ai_practice_safety_event`.
* Loading Behavior: Send button pending; duplicate send disabled.
* Success Behavior: Learner message and AI response tampil dengan role labels.
* Error / Fallback Behavior: Safe error, governance blocked, or provider unavailable fallback.
* Disabled / Guard Conditions: Disabled when message empty, sending, conversation closed, provider unavailable, or context invalid.
* Security / Data Isolation Rules: Conversation id must match active Learner/activity/objective.
* Accessibility Requirements: Message input labeled; new messages announced; AI response role distinguished.
* AI / Engine / Event Boundary Notes: AI response must not appear as score, Assessment Result, mastery, Learning Decision, or official recommendation.
* Out of Scope: Official AI scoring, AI Memory, assessment creation.
* QA Checklist: AI response labeled as AI Practice response; no official outcome language.

## INT-016 — End AI Practice Session

* Purpose: Mengakhiri AI Practice session dan kembali ke activity.
* Used In Screens: UX-007, UX-006.
* Related Components: CMP-012, CMP-023, CMP-025.
* Related State Domains: FSM-003, FSM-013, FSM-014, FSM-020.
* Trigger: Click End Session, Back, or close panel/modal.
* Preconditions: AI conversation active or recoverable; active Learner context valid.
* Interaction Steps: Call complete API if session exists; close route/modal/panel; return focus to AI entry or activity heading.
* API Dependencies: `POST /api/v1/ai-conversations/{conversationId}/complete`.
* Data Dependencies: `ai_practice_conversation`, `ai_practice_message`.
* Loading Behavior: End action pending if API call required.
* Success Behavior: Learner returns to UX-006; activity remains incomplete until explicit completion.
* Error / Fallback Behavior: Safe fallback; allow return to activity if session cannot complete but no private data is exposed.
* Disabled / Guard Conditions: Disabled while end request pending.
* Security / Data Isolation Rules: Only active learner conversation can be completed.
* Accessibility Requirements: Return focus to trigger after panel/modal close.
* AI / Engine / Event Boundary Notes: Does not complete Learning Activity or create official learning outcome.
* Out of Scope: Assessment Result generation, Knowledge Profile update.
* QA Checklist: Ending AI does not mark activity complete.

## INT-017 — Continue Activity Without AI

* Purpose: Memberi jalur aman saat AI provider unavailable atau AI Practice tidak dapat digunakan.
* Used In Screens: UX-006, UX-007, UX-010.
* Related Components: CMP-014, CMP-023, CMP-022.
* Related State Domains: FSM-013, FSM-014, FSM-019, FSM-020.
* Trigger: Click Continue without AI, close AI fallback, or navigate back to activity.
* Preconditions: AI unavailable/fallback state active.
* Interaction Steps: Dismiss/acknowledge AI fallback; keep or return learner to UX-006; preserve activity completion control.
* API Dependencies: None.
* Data Dependencies: AI fallback status only.
* Loading Behavior: None unless navigation pending.
* Success Behavior: Learner continues activity without AI.
* Error / Fallback Behavior: If navigation fails, safe fallback to Learning Activity or Program Detail.
* Disabled / Guard Conditions: Not available for blocking auth/unauthorized errors.
* Security / Data Isolation Rules: No provider/internal detail exposed.
* Accessibility Requirements: Fallback action has clear label and announcement.
* AI / Engine / Event Boundary Notes: Does not create Assessment Result, Knowledge Profile, Learning Decision, or Runtime Event.
* Out of Scope: Replacing AI with generated scoring or recommendations.
* QA Checklist: AI fallback does not block activity completion.

## INT-018 — Open Assessment Result

* Purpose: Menampilkan Assessment Result secara read-only.
* Used In Screens: UX-008.
* Related Components: CMP-016, CMP-021, CMP-022, CMP-023, CMP-025.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-015, FSM-017, FSM-019, FSM-020.
* Trigger: Completion success route or direct result route.
* Preconditions: Active Learner context valid; result id/reference valid or list query available.
* Interaction Steps: Fetch result; render pending/loading/ready/failed/not found state; expose navigation to Dashboard/Module List.
* API Dependencies: `GET /api/v1/assessment-results/{resultId}`, `GET /api/v1/assessment-results` if needed.
* Data Dependencies: `activity_result`, `assessment_result`, `assessment_blueprint`, `learning_state`.
* Loading Behavior: Result loading/pending state.
* Success Behavior: Read-only Assessment Result visible.
* Error / Fallback Behavior: Safe pending, failed, not found, unauthorized, or retry/back behavior.
* Disabled / Guard Conditions: Edit/rescore controls unavailable because read-only.
* Security / Data Isolation Rules: Result scoped to active Learner.
* Accessibility Requirements: Result summary uses semantic structure; status announced.
* AI / Engine / Event Boundary Notes: Assessment Result produced only by Assessment Engine; no Knowledge Profile update, Learning Decision, or adaptive next-step recommendation displayed.
* Out of Scope: Edit, manual correction, re-score.
* QA Checklist: No edit controls; no Knowledge Profile/Learning Decision.

## INT-019 — Open Dashboard

* Purpose: Membuka Basic Progress Dashboard.
* Used In Screens: UX-003, UX-009.
* Related Components: CMP-002, CMP-017, CMP-018, CMP-019, CMP-021, CMP-022.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-015, FSM-016, FSM-017, FSM-018, FSM-019.
* Trigger: Click Dashboard or route `/dashboard`.
* Preconditions: Active Learner context valid.
* Interaction Steps: Validate context; load result/progress display data; render summary and read-only lists.
* API Dependencies: `GET /api/v1/auth/me`, `GET /api/v1/assessment-results`.
* Data Dependencies: `learner`, `learning_state`, `activity_result`, `assessment_result`.
* Loading Behavior: Dashboard loading state.
* Success Behavior: Basic progress visible.
* Error / Fallback Behavior: Empty completed activity/result, network/server retry, session expired redirect.
* Disabled / Guard Conditions: Result links disabled if unauthorized or unavailable.
* Security / Data Isolation Rules: All dashboard data scoped to active Learner.
* Accessibility Requirements: Summary cards and lists are keyboard/screen-reader friendly.
* AI / Engine / Event Boundary Notes: No Knowledge Profile, Learning Decision, adaptive recommendation, or mastery based on Knowledge Profile.
* Out of Scope: Advanced analytics, educator dashboard, certificates.
* QA Checklist: Dashboard read-only; no hidden adaptive recommendation.

## INT-020 — Retry Failed Request

* Purpose: Mengulang request yang gagal secara eksplisit dan aman.
* Used In Screens: UX-001 to UX-011.
* Related Components: CMP-014, CMP-022, CMP-023.
* Related State Domains: FSM-017, FSM-019, plus target request state domain.
* Trigger: Click Retry.
* Preconditions: Failed request known; retry safe; no duplicate pending request.
* Interaction Steps: Clear current safe error category for target request; revalidate auth if needed; rerun failed request; render success/error.
* API Dependencies: Same as failed request; `GET /api/v1/auth/me` for auth-sensitive retry.
* Data Dependencies: Same as failed request.
* Loading Behavior: Retry button pending; target component loading.
* Success Behavior: Target state ready.
* Error / Fallback Behavior: Safe error remains or updates; no internal detail shown.
* Disabled / Guard Conditions: Disabled if unsafe, pending, or completion retry could duplicate Activity Result without idempotency.
* Security / Data Isolation Rules: Auth-sensitive retry must revalidate Learner context.
* Accessibility Requirements: Retry status announced.
* AI / Engine / Event Boundary Notes: Retry does not publish Runtime Event and does not create fallback outcome.
* Out of Scope: Automatic repeated retry loops, synthetic fallback data.
* QA Checklist: Completion retry guarded; auth retry clears stale data if invalid.

## INT-021 — Navigate Back / Safe Navigation

* Purpose: Mengarahkan learner ke safe destination dari normal atau fallback states.
* Used In Screens: UX-003 to UX-011.
* Related Components: CMP-023, CMP-025.
* Related State Domains: FSM-003, FSM-019, FSM-020.
* Trigger: Click Back, Continue, Home, Program List, Module List, Activity, Dashboard.
* Preconditions: Destination valid atau safe fallback tersedia.
* Interaction Steps: Resolve safe destination; validate auth/resource if needed; navigate; set focus after route load.
* API Dependencies: None directly; destination route may load APIs.
* Data Dependencies: Route params and active Learner context.
* Loading Behavior: Route pending state if needed.
* Success Behavior: Safe destination opened.
* Error / Fallback Behavior: If unauthorized, route to Home/Login as appropriate.
* Disabled / Guard Conditions: Disabled if destination unauthorized, unknown, or pending.
* Security / Data Isolation Rules: Must not route to unauthorized resource.
* Accessibility Requirements: Link/button names indicate destination.
* AI / Engine / Event Boundary Notes: Must not suggest adaptive next step or use Learning Decision.
* Out of Scope: Personalized next-best-action navigation.
* QA Checklist: Back from result can go Dashboard/Module List; unauthorized destination blocked.

## INT-022 — Handle Session Expired

* Purpose: Menangani expired session secara aman.
* Used In Screens: UX-003 to UX-011.
* Related Components: CMP-022, CMP-023, CMP-024.
* Related State Domains: FSM-001, FSM-002, FSM-003, FSM-005 to FSM-016, FSM-019.
* Trigger: 401, `auth/me` invalid, expired session response.
* Preconditions: Authenticated route atau private request.
* Interaction Steps: Stop private render; clear Learner-scoped state; show session expired message if appropriate; redirect UX-002.
* API Dependencies: `GET /api/v1/auth/me` for validation.
* Data Dependencies: `auth_session`, `learner`.
* Loading Behavior: No private loading with stale data.
* Success Behavior: Login Page ready.
* Error / Fallback Behavior: If redirect fails, show safe blocking fallback without private data.
* Disabled / Guard Conditions: Blocking; dismiss is not allowed without navigation.
* Security / Data Isolation Rules: Cached private data must not remain visible.
* Accessibility Requirements: Session expired status announced.
* AI / Engine / Event Boundary Notes: No Official Runtime Event from UI.
* Out of Scope: Silent refresh, remember-me, advanced auth.
* QA Checklist: Private data cleared on expired session.

## INT-023 — Handle Unauthorized Access

* Purpose: Menangani resource unauthorized tanpa membocorkan data.
* Used In Screens: UX-003 to UX-011.
* Related Components: CMP-022, CMP-023.
* Related State Domains: FSM-003, FSM-019, FSM-020.
* Trigger: 403, resource mismatch, route/resource belongs to another Learner.
* Preconditions: Active or attempted authenticated request.
* Interaction Steps: Stop rendering requested resource; show safe unauthorized message; offer safe destination.
* API Dependencies: Failed resource API or `GET /api/v1/auth/me` if context revalidation needed.
* Data Dependencies: Active Learner context only.
* Loading Behavior: None after error resolved to fallback.
* Success Behavior: Learner navigates to safe destination.
* Error / Fallback Behavior: Continue showing safe fallback until navigation.
* Disabled / Guard Conditions: Do not allow continue into unauthorized resource.
* Security / Data Isolation Rules: Must not reveal existence/details of resource owned by another Learner; unauthorized is not empty state.
* Accessibility Requirements: Error message announced and action focusable.
* AI / Engine / Event Boundary Notes: No Runtime Event or business fallback.
* Out of Scope: Access request workflow, role escalation.
* QA Checklist: Learner A cannot infer Learner B result/activity details.

## INT-024 — Handle Empty State Action

* Purpose: Memberikan action aman untuk empty states.
* Used In Screens: UX-001 to UX-011.
* Related Components: CMP-020, CMP-023.
* Related State Domains: FSM-018, FSM-003, FSM-020.
* Trigger: Click retry/back/home/program list/module list action from empty state.
* Preconditions: Empty state berasal dari successful empty response, bukan unauthorized.
* Interaction Steps: Show clear empty message; provide allowed action; navigate or retry based on context.
* API Dependencies: Depends on retry target if selected.
* Data Dependencies: Empty collection/category.
* Loading Behavior: Retry action may show loading.
* Success Behavior: Data appears after retry or user reaches safe destination.
* Error / Fallback Behavior: Safe error banner if retry fails.
* Disabled / Guard Conditions: Actions disabled if route target unavailable or retry pending.
* Security / Data Isolation Rules: Do not convert unauthorized/mismatched resource to empty state.
* Accessibility Requirements: Empty message and action are announced in reading order.
* AI / Engine / Event Boundary Notes: No generated content, fallback learning path, fake recommendation, Enrollment, or generated activity.
* Out of Scope: Synthetic data generation.
* QA Checklist: Empty no program/module/activity/content/result states have safe actions only.

## INT-025 — Keyboard Navigation and Focus Handling

* Purpose: Memastikan semua interaction dapat digunakan dengan keyboard dan focus behavior jelas.
* Used In Screens: UX-001 to UX-011.
* Related Components: CMP-001 to CMP-025.
* Related State Domains: FSM-020, FSM-003, FSM-019.
* Trigger: Tab, Shift+Tab, Enter, Space, route changes, form errors, modal/panel open/close.
* Preconditions: UI rendered.
* Interaction Steps: Allow sequential focus; activate controls with Enter/Space; focus heading after route load; focus invalid field after validation; trap focus in AI modal/panel if used; restore focus on close.
* API Dependencies: None.
* Data Dependencies: None.
* Loading Behavior: Focus should not move unexpectedly during non-blocking loading.
* Success Behavior: Keyboard user can complete MVP flows.
* Error / Fallback Behavior: Focus moves to error summary or safe action when blocking.
* Disabled / Guard Conditions: Disabled controls programmatically exposed.
* Security / Data Isolation Rules: Focus state must not store sensitive Learner data.
* Accessibility Requirements: Tab/Shift+Tab, Enter/Space, focus trap/restore, visible focus.
* AI / Engine / Event Boundary Notes: No business outcomes.
* Out of Scope: Custom keyboard shortcuts beyond standard activation.
* QA Checklist: Keyboard completes login, selection, activity, AI Practice, result, dashboard, fallback flows.

## INT-026 — Announce Async Error / Status

* Purpose: Mengumumkan loading, error, fallback, dan status async untuk screen reader.
* Used In Screens: UX-001 to UX-011.
* Related Components: CMP-014, CMP-021, CMP-022.
* Related State Domains: FSM-017, FSM-019, FSM-020.
* Trigger: Loading state, error state, AI unavailable, assessment pending/failed, session expired.
* Preconditions: Async state berubah dan perlu diumumkan.
* Interaction Steps: Update `aria-live` or equivalent region with safe message; avoid duplicate noisy announcements.
* API Dependencies: None directly.
* Data Dependencies: Safe status/error category.
* Loading Behavior: Blocking operations announce loading when appropriate.
* Success Behavior: User receives status without internal details.
* Error / Fallback Behavior: Error announcement uses safe message.
* Disabled / Guard Conditions: Do not announce raw provider/service/database details.
* Security / Data Isolation Rules: Announcements must not include secrets, raw IDs, or another Learner data.
* Accessibility Requirements: Screen-reader friendly and not color-only.
* AI / Engine / Event Boundary Notes: No Runtime Event or business state change.
* Out of Scope: Analytics tracking of announcements.
* QA Checklist: Session expired, AI unavailable, assessment pending/failed, and network errors are announced safely.

## INT-027 — Dismiss Fallback Banner

* Purpose: Menutup non-blocking fallback banner di UI.
* Used In Screens: UX-006, UX-007, UX-010.
* Related Components: CMP-014, CMP-022.
* Related State Domains: FSM-019, FSM-020, and related target state.
* Trigger: Click dismiss/close on fallback banner.
* Preconditions: Banner is non-blocking and dismissible.
* Interaction Steps: Hide banner display state; keep underlying unresolved required state intact if still needed.
* API Dependencies: None.
* Data Dependencies: Error/fallback category only.
* Loading Behavior: None.
* Success Behavior: Banner hidden; main safe UI remains usable.
* Error / Fallback Behavior: Blocking errors remain visible and require navigation/retry.
* Disabled / Guard Conditions: Session expired and unauthorized blocking errors cannot be dismissed without safe navigation.
* Security / Data Isolation Rules: Dismiss action does not clear data isolation checks.
* Accessibility Requirements: Close button accessible; focus returns logically.
* AI / Engine / Event Boundary Notes: Does not publish Runtime Event or clear official backend state.
* Out of Scope: Marking backend incident resolved, provider retry automation.
* QA Checklist: AI fallback can dismiss/continue; blocking auth errors not silently hidden.

# 5. Interaction-to-Screen Matrix

| Interaction ID | UX-001 | UX-002 | UX-003 | UX-004 | UX-005 | UX-006 | UX-007 | UX-008 | UX-009 | UX-010 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INT-001 | Used |  |  |  |  |  |  |  |  |  | Public Landing load. |
| INT-002 | Used | Used |  |  |  |  |  |  |  |  | Public route to Login. |
| INT-003 |  | Used |  |  |  |  |  |  |  |  | Login submit. |
| INT-004 |  |  | Used | Used | Used | Used | Used | Used | Used | Used | Authenticated route guard. |
| INT-005 |  |  | Used | Used | Used | Used | Used | Used | Used |  | Logout from authenticated screens. |
| INT-006 |  |  | Used |  |  |  |  |  |  |  | Learner Home load. |
| INT-007 |  |  |  | Used |  |  |  |  |  |  | Program Selection load. |
| INT-008 |  |  | Used | Used | Used |  |  |  |  |  | Program/subject select. |
| INT-009 |  |  |  |  | Used |  |  |  |  |  | Program Detail load. |
| INT-010 |  |  |  |  | Used |  |  |  |  |  | Module select. |
| INT-011 |  |  |  |  | Used | Used |  |  |  |  | Activity select/open. |
| INT-012 |  |  |  |  |  | Used |  |  |  |  | Content load. |
| INT-013 |  |  |  |  |  | Used |  | Used |  |  | Completion to result flow. |
| INT-014 |  |  |  |  |  | Used | Used |  |  |  | Practice only. |
| INT-015 |  |  |  |  |  |  | Used |  |  |  | AI message send. |
| INT-016 |  |  |  |  |  | Used | Used |  |  |  | End AI session. |
| INT-017 |  |  |  |  |  | Used | Used |  |  | Used | AI fallback continuation. |
| INT-018 |  |  |  |  |  |  |  | Used |  |  | Read-only result. |
| INT-019 |  |  | Used |  |  |  |  |  | Used |  | Dashboard load. |
| INT-020 | Used | Used | Used | Used | Used | Used | Used | Used | Used | Used | Safe retry. |
| INT-021 |  |  | Used | Used | Used | Used | Used | Used | Used | Used | Safe navigation. |
| INT-022 |  |  | Used | Used | Used | Used | Used | Used | Used | Used | Session expired. |
| INT-023 |  |  | Used | Used | Used | Used | Used | Used | Used | Used | Unauthorized access. |
| INT-024 | Used |  | Used | Used | Used | Used |  | Used | Used | Used | Empty state action. |
| INT-025 | Used | Used | Used | Used | Used | Used | Used | Used | Used | Used | Keyboard/focus. |
| INT-026 | Used | Used | Used | Used | Used | Used | Used | Used | Used | Used | Async announcements. |
| INT-027 |  |  |  |  |  | Used | Used |  |  | Used | Non-blocking fallback dismissal. |

# 6. Interaction-to-Component Matrix

| Interaction ID | Related Components | Primary State Domains | Notes |
| --- | --- | --- | --- |
| INT-001 | CMP-001, CMP-004, CMP-020, CMP-021 | FSM-003, FSM-004, FSM-017, FSM-018 | Public content only. |
| INT-002 | CMP-001, CMP-023 | FSM-003, FSM-020 | No API. |
| INT-003 | CMP-003, CMP-021, CMP-022 | FSM-001, FSM-002, FSM-017, FSM-019 | Prevent duplicate submit. |
| INT-004 | CMP-002, CMP-021, CMP-022 | FSM-001, FSM-002, FSM-017, FSM-019 | Block private render while pending. |
| INT-005 | CMP-024, CMP-002 | FSM-001, FSM-002, FSM-003 | Clear Learner-scoped state. |
| INT-006 | CMP-002, CMP-005, CMP-017 | FSM-002, FSM-005, FSM-016 | No Knowledge Profile. |
| INT-007 | CMP-005, CMP-006 | FSM-005 | Published programs only. |
| INT-008 | CMP-005, CMP-006, CMP-025 | FSM-003, FSM-006 to FSM-014 | Reset downstream state. |
| INT-009 | CMP-007, CMP-008, CMP-025 | FSM-006, FSM-007, FSM-008 | Program detail and lists. |
| INT-010 | CMP-007, CMP-008 | FSM-007, FSM-008 | No adaptive sequencing. |
| INT-011 | CMP-008, CMP-025 | FSM-009 to FSM-014 | AI only for Practice. |
| INT-012 | CMP-009, CMP-010 | FSM-010, FSM-011 | Published content. |
| INT-013 | CMP-015, CMP-016 | FSM-012, FSM-015 | UI does not create result. |
| INT-014 | CMP-011, CMP-012, CMP-014 | FSM-013, FSM-014 | Practice-only. |
| INT-015 | CMP-012, CMP-013 | FSM-014 | AI response labeling required. |
| INT-016 | CMP-012, CMP-023, CMP-025 | FSM-003, FSM-014 | Does not complete activity. |
| INT-017 | CMP-014, CMP-023 | FSM-013, FSM-019 | Continue without AI. |
| INT-018 | CMP-016, CMP-023, CMP-025 | FSM-015 | Read-only. |
| INT-019 | CMP-017, CMP-018, CMP-019 | FSM-015, FSM-016 | Basic progress only. |
| INT-020 | CMP-014, CMP-022, CMP-023 | FSM-017, FSM-019 | Safe retry. |
| INT-021 | CMP-023, CMP-025 | FSM-003, FSM-020 | Safe navigation. |
| INT-022 | CMP-022, CMP-023 | FSM-001, FSM-002, FSM-019 | Session expired. |
| INT-023 | CMP-022, CMP-023 | FSM-003, FSM-019 | Unauthorized is not empty. |
| INT-024 | CMP-020, CMP-023 | FSM-018, FSM-003 | Empty action only. |
| INT-025 | CMP-001 to CMP-025 | FSM-020 | Keyboard/focus. |
| INT-026 | CMP-014, CMP-021, CMP-022 | FSM-017, FSM-019, FSM-020 | Async announcements. |
| INT-027 | CMP-014, CMP-022 | FSM-019, FSM-020 | Non-blocking dismissal. |

# 7. Interaction-to-API Matrix

| Interaction ID | API Endpoint | Method | Trigger Condition | Success Behavior | Failure Behavior |
| --- | --- | --- | --- | --- | --- |
| INT-001 | `/api/v1/public/landing-page` | GET | Landing route load | Landing config displayed. | Public fallback. |
| INT-001 | `/api/v1/public/program-highlights` | GET | Landing route load | Highlights displayed. | Empty/fallback highlights. |
| INT-002 | None | None | Login CTA click | Route to Login. | Safe navigation fallback. |
| INT-003 | `/api/v1/auth/login` | POST | Login submit | Session created by auth API behavior. | Safe login error. |
| INT-003 | `/api/v1/auth/me` | GET | Login success | Active Learner context established. | Clear and show login error. |
| INT-004 | `/api/v1/auth/me` | GET | Authenticated route load | Allow screen render. | Clear state and redirect Login. |
| INT-005 | `/api/v1/auth/logout` | POST | Logout click | Clear state and redirect. | Clear local state if session invalid. |
| INT-006 | `/api/v1/auth/me` | GET | Home load | Learner identity displayed. | Redirect Login if invalid. |
| INT-006 | `/api/v1/learning-programs` | GET | Home load | Entry points displayed. | Empty/error state. |
| INT-007 | `/api/v1/learning-programs` | GET | Program Selection load | Programs displayed. | Empty/error state. |
| INT-008 | None | None | Program/subject select | Route to Program Detail. | Safe navigation fallback. |
| INT-009 | `/api/v1/learning-programs/{programId}` | GET | Program Detail load | Program detail displayed. | Not found/unauthorized/error. |
| INT-009 | `/api/v1/learning-programs/{programId}/program-structure` | GET | Program Detail load | Structure displayed. | Safe error. |
| INT-009 | `/api/v1/learning-modules` | GET | Program Detail load | Modules displayed. | No module/error. |
| INT-009 | `/api/v1/learning-activities` | GET | Program Detail load | Activities displayed. | No activity/error. |
| INT-010 | `/api/v1/learning-activities` | GET | Module selection if lazy loaded | Activities displayed. | Empty/error. |
| INT-011 | `/api/v1/learning-activities/{activityId}` | GET | Activity route load | Activity displayed. | Not found/unauthorized/error. |
| INT-012 | `/api/v1/learning-contents` | GET | Activity load | Content displayed. | Empty/fallback/error. |
| INT-013 | `/api/v1/learning-activities/{activityId}/complete` | POST | Complete click | Activity Result backend/API behavior; result flow starts. | Safe retry/back. |
| INT-014 | `/api/v1/learning-activities/{activityId}/ai-conversation/start` | POST | AI Practice click | Conversation starts. | AI fallback. |
| INT-015 | `/api/v1/ai-conversations/{conversationId}/messages` | POST | Message submit | Message and AI response displayed. | Safe error/governance/provider fallback. |
| INT-016 | `/api/v1/ai-conversations/{conversationId}/complete` | POST | End AI session | Return to activity. | Safe return/fallback. |
| INT-017 | None | None | Continue without AI | Activity remains usable. | Safe navigation fallback. |
| INT-018 | `/api/v1/assessment-results/{resultId}` | GET | Result route load | Result displayed read-only. | Pending/failed/not found. |
| INT-018 | `/api/v1/assessment-results` | GET | Result list fallback if needed | Result list displayed/read. | Safe error. |
| INT-019 | `/api/v1/auth/me` | GET | Dashboard load | Learner context valid. | Redirect Login. |
| INT-019 | `/api/v1/assessment-results` | GET | Dashboard load | Basic result/progress displayed. | Empty/error. |
| INT-020 | Failed endpoint | Original method | Retry click | Target state ready. | Safe error remains. |
| INT-021 | None | None | Safe nav click | Safe route opened. | Fallback destination. |
| INT-022 | `/api/v1/auth/me` | GET | Auth suspected invalid | Valid or expired state known. | Clear and redirect Login. |
| INT-023 | Failed resource endpoint | Original method | Unauthorized response | Safe fallback shown. | Safe fallback remains. |
| INT-024 | Optional failed/list endpoint | GET | Empty retry action | Data loaded if available. | Empty/error remains. |
| INT-025 | None | None | Keyboard/focus event | Control activated/focus managed. | Focus safe target. |
| INT-026 | None | None | Async status change | Status announced. | Safe message only. |
| INT-027 | None | None | Dismiss click | Banner hidden if non-blocking. | Blocking banner remains. |

# 8. Interaction Guard Matrix

| Interaction ID | Guard / Disabled Condition | Reason | User Feedback | Recovery Action |
| --- | --- | --- | --- | --- |
| INT-003 | Identifier/password missing or submitting. | Prevent invalid/duplicate login. | Field error or pending button. | Fill fields or wait. |
| INT-004 | Auth validation pending. | Prevent stale private render. | Loading state. | Wait or redirect if expired. |
| INT-005 | Logout pending. | Prevent duplicate logout. | Pending logout state. | Wait for redirect. |
| INT-008 | Program unavailable or navigation pending. | Prevent invalid route. | Disabled card/action. | Retry list or choose available program. |
| INT-010 | Module unavailable or activity load pending. | Prevent invalid selection. | Disabled selection/loading. | Wait or retry. |
| INT-011 | Activity unavailable or navigation pending. | Prevent invalid activity route. | Disabled activity card. | Retry module/activity list. |
| INT-013 | Submitting, invalid activity, invalid context, or API does not allow completion. | Prevent duplicate/invalid Activity Result creation. | Pending button or safe validation error. | Wait, retry if safe, or navigate back. |
| INT-014 | Non-Practice activity, AI unavailable, starting, or context invalid. | AI Practice is Practice-only. | Hidden/disabled entry or fallback banner. | Continue activity without AI. |
| INT-015 | Empty message, sending, session closed, provider unavailable, or context invalid. | Prevent duplicate/invalid AI messages. | Disabled send or safe error. | Enter message, wait, retry, or return to activity. |
| INT-016 | End session request pending. | Prevent duplicate close request. | Pending state. | Wait or safe return if recoverable. |
| INT-018 | Assessment edit unavailable. | Assessment Result is read-only. | No edit controls. | Navigate Dashboard/Module List. |
| INT-020 | Retry unsafe, already pending, or completion retry not idempotent. | Avoid duplicate side effects. | Retry disabled or explanatory safe message. | Back, refresh, or wait. |
| INT-021 | Destination unauthorized/unknown/pending. | Prevent unauthorized route. | Disabled safe navigation or fallback. | Choose safe route. |
| INT-027 | Error is blocking session expired/unauthorized. | Blocking security errors require navigation. | Banner not dismissible. | Login or safe destination. |

# 9. Loading, Retry, and Duplicate Submit Rules

* Loading state harus terlihat untuk blocking async operations.
* Buttons harus menunjukkan pending state jika action sedang berlangsung.
* Duplicate login submit harus dicegah.
* Duplicate activity completion harus dicegah.
* Duplicate AI message submit harus dicegah saat sending.
* Retry harus eksplisit.
* Retry completion harus aman dan tidak boleh membuat duplicate Activity Result kecuali backend/API idempotent.
* Auth-sensitive retry harus revalidate `GET /api/v1/auth/me`.
* Loading pada authenticated screens tidak boleh menampilkan stale Learner data saat context belum valid.
* Retry tidak boleh membuat fallback business rules atau synthetic content.

# 10. Error and Fallback Interaction Rules

| Error / Fallback Case | Trigger | UI Interaction | Safe Recovery | Data Safety Rule |
| --- | --- | --- | --- | --- |
| Session expired | 401, auth/me invalid | Blocking message and redirect. | Login. | Clear Learner-scoped state. |
| Learner context missing | Missing active Learner on private route | Stop private render. | Login. | Do not show cached private data. |
| Unauthorized access | 403/resource mismatch | Safe unauthorized message. | Home, Program Selection, Dashboard. | Do not reveal resource existence. |
| No program | Empty program list | Empty state action. | Retry or Home. | Do not create program/Enrollment. |
| No module | Empty module list | Empty state action. | Program Selection or Program Detail. | Do not create sequencing fallback. |
| No activity | Empty activity list | Empty state action. | Module List or Program Detail. | Do not create generated activity. |
| No content | Empty content | Instruction fallback. | Continue activity if allowed, retry/back. | Do not generate AI content. |
| AI unavailable | Provider/API failure | AI fallback banner. | Continue activity without AI. | No result/profile/decision created. |
| Governance blocked | AI safety block | Safe message in AI panel. | Revise message or return to activity. | No provider detail exposed. |
| Assessment pending | Result not ready | Pending read-only status. | Wait, retry, Dashboard. | UI does not generate result. |
| Assessment failed | Result failure | Safe failed status. | Retry/back/Dashboard. | UI does not rescore. |
| Network error | Timeout/offline | Retry banner. | Retry or safe navigation. | Revalidate auth if sensitive. |
| Server error | 5xx | Safe error banner. | Retry/back/Home. | No stack trace/query/raw IDs. |
| Resource not found | 404 | Not found fallback. | Program Selection, Module List, Dashboard. | Do not leak other learner resource details. |

# 11. AI Practice Interaction Rules

* AI Practice entry muncul hanya untuk Practice activity.
* AI Practice bersifat optional.
* AI Practice dapat berupa route, modal, atau panel, tetapi behavior harus sama.
* AI Practice messages adalah conversational practice.
* AI response harus diberi label sebagai AI Practice response.
* AI response tidak boleh tampil sebagai official system score, Assessment Result, mastery, Learning Decision, atau recommendation.
* AI provider unavailable harus degrade gracefully.
* For Normal Practice, End Session returns to the Learning Activity and does not complete it. For Assessable Practice, Complete Conversation submits the Activity Result to Assessment Engine and proceeds to UX-008 when Assessment Result is ready.
* Normal Practice requires explicit Learning Activity completion; Assessable Practice uses explicit Complete Conversation submission.
* AI interaction records adalah audit/observability/provider records only.
* Tidak ada Official Runtime Event dari UI.

# 12. Activity Completion Interaction Rules

* Normal Practice: End Session → return to Learning Activity.
* Assessable Practice: Complete Conversation → submit Activity Result → Assessment Engine → Assessment Result → UX-008.

* Complete Activity harus explicit.
* AI Practice tidak wajib untuk menyelesaikan activity.
* Completion memanggil backend/API.
* Activity Result dibuat oleh backend/API behavior.
* Frontend tidak menghasilkan Assessment Result.
* Assessment Result ditampilkan hanya setelah backend/Assessment Engine result tersedia.
* Completion harus mencegah duplicate submit.
* Completion failure harus menampilkan safe retry/back behavior.

# 13. Assessment Result Interaction Rules

* Assessment Result bersifat read-only.
* Learner dapat navigate ke Dashboard atau Module List.
* Tidak ada edit, manual correction, re-score, Knowledge Profile update display, Learning Decision display, atau adaptive next-step recommendation.
* Pending/failed/not found states harus aman.
* Assessment Result yang ditampilkan harus scoped ke active Learner.

# 14. Dashboard Interaction Rules

* Dashboard memuat active Learner context dan result/progress data.
* Dashboard interactions adalah navigation/read-only.
* Dashboard tidak boleh mengekspos Knowledge Profile, Learning Decision, adaptive recommendation, atau mastery berbasis Knowledge Profile.
* Dashboard tidak boleh mengizinkan result editing.
* Dashboard empty/error states harus menggunakan safe recovery actions.

# 15. Accessibility Interaction Requirements

* Semua interactive elements harus keyboard accessible.
* Buttons/links harus memiliki accessible names yang jelas.
* Form errors harus memindahkan focus ke first invalid field atau error summary yang sesuai.
* Error/fallback banners harus diumumkan melalui `aria-live` atau equivalent.
* AI messages harus membedakan Learner vs AI role.
* Modal/panel AI Practice harus memiliki focus management jika diimplementasikan demikian.
* Disabled state harus programmatically exposed.
* Loading state harus mengumumkan status saat blocking.
* Interaction status tidak boleh bergantung pada warna saja.

# 16. Interaction Data Isolation Rules

* Setiap authenticated interaction menggunakan active Learner context.
* Learner-scoped state harus dibersihkan saat logout, session expired, atau context mismatch.
* Cached Learner A data tidak boleh tampil setelah Learner B login.
* AI conversation harus milik active Learner, activity, dan objective.
* Assessment Result harus milik active Learner.
* Unauthorized resources tidak boleh ditampilkan sebagai empty state.
* Safe navigation tidak boleh route ke unauthorized resource.

# 17. AI / Engine / Event Boundary Matrix

| Interaction ID | Can Trigger API Call? | Can Produce Official Runtime Event? | Can Produce Assessment Result? | Can Update Knowledge Profile? | Can Generate Learning Decision? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| INT-001 | Yes | No | No | No | No | Public content APIs only. |
| INT-002 | No | No | No | No | No | Route transition only. |
| INT-003 | Yes | No | No | No | No | Auth APIs only. |
| INT-004 | Yes | No | No | No | No | Auth/me validation. |
| INT-005 | Yes | No | No | No | No | Logout API and local cleanup. |
| INT-006 | Yes | No | No | No | No | Reads home data only. |
| INT-007 | Yes | No | No | No | No | Reads Published programs. |
| INT-008 | No | No | No | No | No | Manual navigation only. |
| INT-009 | Yes | No | No | No | No | Reads program/module/activity data. |
| INT-010 | Maybe | No | No | No | No | May read activities; no sequencing decision. |
| INT-011 | Yes | No | No | No | No | Reads selected activity. |
| INT-012 | Yes | No | No | No | No | Reads Published content. |
| INT-013 | Yes | No | No | No | No | Triggers completion API; does not itself publish event or produce Assessment Result. |
| INT-014 | Yes | No | No | No | No | Starts assessable AI Practice; AI itself produces no official outcome. |
| INT-015 | Yes | No | No | No | No | Sends AI Practice message; practice feedback only. |
| INT-016 | Yes | No | No | No | No | Ends Normal Practice and returns to activity; assessable completion is INT-030. |
| INT-017 | No | No | No | No | No | UI fallback continuation. |
| INT-018 | Yes | No | No | No | No | Displays read-only Assessment Engine output. |
| INT-019 | Yes | No | No | No | No | Reads dashboard progress/result data. |
| INT-020 | Yes | No | No | No | No | Retries safe API call only. |
| INT-021 | No | No | No | No | No | Safe navigation only. |
| INT-022 | Yes | No | No | No | No | Auth validation/cleanup. |
| INT-023 | Maybe | No | No | No | No | Handles failed resource request safely. |
| INT-024 | Maybe | No | No | No | No | Empty-state navigation/retry only. |
| INT-025 | No | No | No | No | No | Accessibility interaction only. |
| INT-026 | No | No | No | No | No | Announcement only. |
| INT-027 | No | No | No | No | No | Dismisses non-blocking UI banner only. |

# 18. QA Interaction Checklist

| Interaction ID | QA Focus | Critical Checks | Out-of-Scope Checks |
| --- | --- | --- | --- |
| INT-001 | Public landing | No auth required; no Learner data. | No Enrollment/signup. |
| INT-002 | Login CTA | Routes to Login; no signup route. | No public registration. |
| INT-003 | Login submit | Duplicate submit prevention; no signup/reset/social auth; two learner accounts. | No OAuth/SSO/MFA. |
| INT-004 | Learner context | Private render waits for `auth/me`; invalid redirects. | No role management. |
| INT-005 | Logout | Clears state; no stale data after back navigation. | No account/session management. |
| INT-006 | Learner Home | Learner A/B data isolation; no Knowledge Profile/Learning Decision. | No adaptive recommendation. |
| INT-007 | Program Selection | Published programs only; manual selection. | No Enrollment or adaptive recommendation; Placement entry is available from Program Detail. |
| INT-008 | Program/Subject select | Downstream state reset; subject is UI representation. | No new subject entity. |
| INT-009 | Program Detail | Modules/activities load; no adaptive sequencing. | No Learning Decision next step. |
| INT-010 | Module select | Activities update safely; keyboard selection. | No adaptive path. |
| INT-011 | Activity select | Activity state reset; AI only for Practice. | No adaptive placement gating. |
| INT-012 | Content load | Published content; empty fallback; no AI-generated content. | No Knowledge Profile personalization. |
| INT-013 | Completion | Duplicate submit prevention; backend/API creates Activity Result; UI no Assessment Result creation. | No Knowledge Profile/Learning Decision/Runtime Event. |
| INT-014 | Start AI Practice | Hidden for non-Practice; provider fallback safe. | AI does not score; assessable completion uses Assessment Engine. |
| INT-015 | AI message | Response not official result/score/mastery; role labels. | No AI scoring/AI Memory. |
| INT-016 | End Normal Practice | Returns to Learning Activity without completion; focus restored safely. | Assessable Practice uses INT-030 and Assessment Engine. |
| INT-017 | Continue without AI | AI fallback does not block completion. | No fallback assessment. |
| INT-018 | Assessment Result | Read-only; pending/failed/not found safe. | No edit/rescore/adaptive next step. |
| INT-019 | Dashboard | No Knowledge Profile/Learning Decision/adaptive recommendation. | No advanced analytics. |
| INT-020 | Retry | Safe retry; completion retry guarded. | No automatic duplicate side effects. |
| INT-021 | Safe navigation | No unauthorized route; no Learning Decision suggestion. | No personalized next-best-action. |
| INT-022 | Session expired | Clears private state and redirects Login. | No silent refresh requirement. |
| INT-023 | Unauthorized | No resource existence leakage; not empty state. | No access request flow. |
| INT-024 | Empty action | Safe action only; no synthetic content/path. | No generated activity. |
| INT-025 | Keyboard/focus | Tab/Shift+Tab, Enter/Space, focus trap/restore. | No custom shortcut requirement. |
| INT-026 | Async announcement | Errors/status announced without internal details. | No analytics event. |
| INT-027 | Dismiss banner | Non-blocking only; blocking auth errors remain. | No backend incident resolution. |

# 19. Out of Scope Interactions

| Interaction | Reason | Future / Phase / Open Issue Status |
| --- | --- | --- |
| Signup interaction | Public signup tidak termasuk MVP. | Open Issue: Public Signup |
| Forgot password interaction | Password reset tidak termasuk MVP auth. | Open Issue: Advanced Authentication |
| OAuth/SSO/MFA interaction | Advanced authentication tidak termasuk MVP. | Open Issue: Advanced Authentication |
| Enrollment interaction | Enrollment tidak termasuk MVP. | Open Issue: Enrollment Workflow |
| Full adaptive Learning Path interaction | Tidak masuk MVP UI. | Phase 2 |
| Adaptive recommendation interaction | Adaptive personalized learning path tidak masuk MVP UI. | Open Issue: Adaptive Learning Path |
| Knowledge Profile interaction | Knowledge Profile tidak ditampilkan di MVP UI. | Open Issue: Knowledge Profile Visualization |
| Learning Decision explanation interaction | Learning Decision tidak ditampilkan di MVP UI. | Open Issue: Learning Decision Explanation |
| Educator dashboard interaction | Educator experience tidak termasuk MVP. | Open Issue: Educator Experience |
| Parent dashboard interaction | Parent experience tidak termasuk MVP. | Open Issue: Parent Experience |
| Payment interaction | Payment/subscription tidak termasuk MVP. | Future scope |
| Notification interaction | Notifications tidak termasuk MVP. | Open Issue: Notifications |
| Achievement/certificate interaction | Achievements/certificates tidak termasuk MVP. | Open Issue: Achievements / Certificates |
| Advanced analytics interaction | Advanced analytics tidak termasuk MVP. | Future scope |
| AI Memory interaction | AI Practice MVP tidak memiliki AI Memory interaction resmi. | Future scope / governance review |
| AI official scoring interaction | AI Practice tidak menghasilkan official assessment score. | Out of scope for MVP |

# 20. References

* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/70_ui_ux/72_screen_inventory.md`
* `docs/70_ui_ux/73_component_spec.md`
* `docs/70_ui_ux/74_frontend_state_model.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/80_implementation/80_feature_breakdown.md`
* `docs/99_architecture_decisions.md`
