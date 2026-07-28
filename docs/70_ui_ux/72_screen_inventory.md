# Screen Inventory — Kaifa v2 MVP

| Field | Value |
| ----- | ----- |
| Version | 1.0 |
| Status | Freeze |
| Owner | Product & UI/UX |
| Depends On | `70_ui_ux_spec.md`, `71_user_flow.md`, `52_prd.md`, `60_srs.md`, `62_api_spec.md`, `80_feature_breakdown.md` |
| Used By | Product, UI/UX, Frontend, Backend, QA |
| Last Updated | 2026-07-05 |

Dokumen ini adalah inventory layar MVP Kaifa v2. Definisi screen mengikuti `70_ui_ux_spec.md`; relasi antar-flow mengikuti `71_user_flow.md`. Istilah arsitektur resmi seperti Learning Program, Learning Activity, Assessment Result, Learner context, Runtime Event, Knowledge Profile, dan Learning Decision dipertahankan dalam Bahasa Inggris.

---

# 1. Purpose

Dokumen ini menjadi canonical inventory layar MVP untuk perencanaan UI/UX, frontend routing, alignment API backend, dan QA coverage. Setiap screen diringkas dengan route, akses, dependency data/API, state, boundary, dan checklist verifikasi.

Dokumen ini tidak mendefinisikan ulang arsitektur, tidak menambah MVP scope, tidak memperkenalkan entity baru, dan tidak membuat business rule baru. Seluruh detail mengikuti dokumen UI/UX Specification, User Flow, SRS, API Spec, Database Model, Feature Breakdown, Event Contracts, dan Architecture Decisions yang sudah dibekukan.

---

# 2. Inventory Principles

* Hanya UX-001 sampai UX-010 yang termasuk MVP screens.
* Landing Page bersifat public.
* UX-002 sampai UX-009 membutuhkan active Learner context setelah login, kecuali UX-002 sebagai entry login sebelum context terbentuk.
* UX-010 adalah cross-cutting error/fallback state, bukan business flow baru.
* Learner data isolation wajib: Learner A tidak boleh melihat, mengakses, atau memodifikasi data Learner B.
* AI Conversation Practice adalah assessable MVP capability untuk Learning Activity type `Practice`, dengan STT/TTS wajib dan text fallback.
* Dashboard adalah basic progress only.
* Tidak ada screen MVP yang boleh mengekspos Knowledge Profile, Learning Decision, adaptive recommendation, Enrollment, public signup, atau advanced authentication. Placement Test ditampilkan hanya sebagai specialized assessable Learning Activity.
* UI interaction tidak mempublikasikan Official Runtime Event.
* Assessment Result hanya diproduksi oleh Assessment Engine.
* AI Practice records adalah audit/observability/provider records saja.

---

# 3. MVP Screen List

| Screen ID | Screen Name | Route / URL Pattern | Access Level | Primary Purpose | Entry From | Exit To | Feature Mapping | SRS Mapping | Status |
| --------- | ----------- | ------------------- | ------------ | --------------- | ---------- | ------- | --------------- | ----------- | ------ |
| UX-001 | Public Landing Page | `/` | Public | Menampilkan informasi produk dan program highlights. | Direct public visit | UX-002 | FB-MVP-013 | SRS-FR-012A | MVP |
| UX-002 | Login Page | `/login` | Public entry, pre-auth | Login Learner dan membangun Learner context. | UX-001, session expired, logout | UX-003 | FB-MVP-015 | SRS-FR-012C | MVP |
| UX-003 | Learner Home | `/home` | Authenticated | Titik masuk Learner ke program dan dashboard. | UX-002 | UX-004, UX-009, UX-001/UX-002 on logout | FB-MVP-001, FB-MVP-015 | SRS-FR-001, SRS-FR-012C | MVP |
| UX-004 | Program / Subject Selection | `/programs` | Authenticated | Menampilkan Published Learning Programs untuk dipilih manual. | UX-003, UX-005 back | UX-005, UX-003 | FB-MVP-001 | SRS-FR-001 | MVP |
| UX-005 | Program Detail / Module List | `/programs/:programId` | Authenticated | Menampilkan program detail, Program Structure, modules, dan activities. | UX-004, UX-008 back | UX-006, UX-004, UX-009 | FB-MVP-002, FB-MVP-003, FB-MVP-006 | SRS-FR-002, SRS-FR-003, SRS-FR-006 | MVP |
| UX-006 | Learning Activity Page | `/activities/:activityId` | Authenticated | Menjalankan Learning Activity dan menyelesaikan activity. | UX-005, UX-007 return | UX-007, UX-008, UX-005 | FB-MVP-006, FB-MVP-009 | SRS-FR-006, SRS-FR-009 | MVP |
| UX-007 | AI Conversation Practice | `/activities/:activityId/ai-practice` or modal/panel from UX-006 | Authenticated, Practice only | Practice guidance/feedback dalam konteks Learning Objective. | UX-006 | UX-006 | FB-MVP-014 | SRS-FR-012B | MVP limited |
| UX-008 | Activity Completion / Assessment Result | `/assessment-results/:resultId` | Authenticated | Menampilkan completion dan read-only Assessment Result. | UX-006 | UX-009, UX-005 | FB-MVP-008 | SRS-FR-008 | MVP |
| UX-009 | Basic Progress Dashboard | `/dashboard` | Authenticated | Menampilkan basic progress, Activity Result, dan Assessment Result. | UX-003, UX-008 | UX-003, UX-004, UX-005 | FB-MVP-012 | SRS-FR-012 | MVP limited |
| UX-010 | Error / Fallback State | Cross-cutting; optional `/error` | Context-dependent | Menangani session, authorization, empty, AI, assessment, network, 404, 500. | Any screen | Safe destination by context | Cross-cutting | SRS-FR-012B, SRS-FR-012C | MVP support |
| UX-011 | Placement Test | `/activities/:activityId/placement` | Authenticated | Specialized assessable Learning Activity driven by `purpose = Placement`; no new domain resource. | UX-005 | UX-008, UX-005 | MVP Placement | SRS-FR-016, SRS-FR-008 | MVP |

---

# 4. Screen Detail Cards

## UX-001 — Public Landing Page

* **Route / URL Pattern:** `/`
* **Access Level:** Public, no auth.
* **Purpose:** Menampilkan product information dan program highlights tanpa Learner context.
* **Entry Conditions:** User membuka root URL.
* **Main UI Elements:** Header public, deskripsi produk, program highlights, CTA Login, footer.
* **Primary Actions:** Klik Login menuju UX-002.
* **API Dependencies:** `GET /api/v1/public/landing-page`; `GET /api/v1/public/program-highlights`.
* **Data Dependencies:** `landing_page_config`; Published program highlights only.
* **State Dependencies:** Tidak ada Learner state.
* **Empty State:** Program highlights kosong tetap menampilkan informasi produk dan CTA Login.
* **Loading State:** Skeleton/spinner untuk konten public bila dynamic content dimuat.
* **Error State:** Static fallback minimum jika API public gagal.
* **Success / Exit Behavior:** User masuk ke UX-002.
* **Security / Data Isolation Rules:** Tidak mengakses data Learner; tidak membaca session-protected data.
* **AI / Engine / Event Boundary Notes:** Tidak menggunakan Engine/AI; tidak mempublikasikan Runtime Event.
* **Out of Scope:** Enrollment, Signup, Learner personalization, Runtime Events.
* **QA Checklist:** Halaman dapat dibuka tanpa auth; tidak ada data Learner; program highlights hanya Published; CTA Login bekerja; fallback public tidak bocor detail internal.

## UX-002 — Login Page

* **Route / URL Pattern:** `/login`
* **Access Level:** Public entry untuk pre-auth; setelah success membangun Learner context.
* **Purpose:** MVP Basic Learner Authentication.
* **Entry Conditions:** User belum login, logout, atau session expired.
* **Main UI Elements:** Login form identifier/password, tombol Masuk, error message, link ke Landing Page.
* **Primary Actions:** Submit login; kembali ke Landing Page.
* **API Dependencies:** `POST /api/v1/auth/login`; `GET /api/v1/auth/me`.
* **Data Dependencies:** `learner_auth_account`, `auth_session`, `learner`.
* **State Dependencies:** Session auth; Learner context aktif setelah login success.
* **Empty State:** N/A; form selalu tersedia.
* **Loading State:** Disable submit saat login request berjalan.
* **Error State:** Kredensial salah, server unavailable, Learner context missing setelah login.
* **Success / Exit Behavior:** Login success dan `auth/me` valid menuju UX-003.
* **Security / Data Isolation Rules:** Minimal dua learner account dapat login; Learner A tidak dapat mengakses data Learner B; hapus state lokal saat session invalid.
* **AI / Engine / Event Boundary Notes:** Tidak terkait Assessment Engine, Knowledge Profile Engine, Recommendation Engine, atau Official Runtime Event.
* **Out of Scope:** Public signup, password reset, OAuth, SSO, MFA, role management, educator/parent/org identity.
* **QA Checklist:** Dua account bisa login; session context benar; logout/login antar-account tidak mencampur data; tidak ada signup/reset/social login control.

## UX-003 — Learner Home

* **Route / URL Pattern:** `/home`
* **Access Level:** Authenticated.
* **Purpose:** Titik masuk Learner ke program dan dashboard.
* **Entry Conditions:** `GET /api/v1/auth/me` valid.
* **Main UI Elements:** Header authenticated, Learner identity, program entry cards, Dashboard navigation, Logout.
* **Primary Actions:** Pilih program; buka Dashboard; Logout.
* **API Dependencies:** `GET /api/v1/auth/me`; `GET /api/v1/learning-programs`; `POST /api/v1/auth/logout` for logout.
* **Data Dependencies:** `learner`, `learning_program`.
* **State Dependencies:** Active Learner context.
* **Empty State:** Tidak ada Published Learning Program.
* **Loading State:** Loading Learner context dan daftar program.
* **Error State:** Session invalid redirect ke UX-002; program load gagal menampilkan retry.
* **Success / Exit Behavior:** Program entry menuju UX-004/UX-005; Dashboard menuju UX-009; logout menuju UX-001/UX-002.
* **Security / Data Isolation Rules:** Data program dan progress yang ditampilkan harus berada dalam Learner context aktif.
* **AI / Engine / Event Boundary Notes:** Tidak menampilkan Knowledge Profile, Learning Decision, atau adaptive recommendation; tidak publish Runtime Event.
* **Out of Scope:** Knowledge Profile summary, Learning Decision explanation, adaptive recommendation.
* **QA Checklist:** Auth required; Learner identity sesuai session; no Knowledge Profile/Learning Decision; logout clears session.

## UX-004 — Program / Subject Selection

* **Route / URL Pattern:** `/programs`
* **Access Level:** Authenticated.
* **Purpose:** Menampilkan Published Learning Programs untuk dipilih manual oleh Learner.
* **Entry Conditions:** Learner context aktif dari UX-003 atau navigation.
* **Main UI Elements:** Program Card, Subject Card sebagai UI representation, optional search/filter MVP, back navigation.
* **Primary Actions:** Pilih program; kembali ke Learner Home.
* **API Dependencies:** `GET /api/v1/learning-programs`.
* **Data Dependencies:** `learning_program`.
* **State Dependencies:** Active Learner context; no adaptive state dependency.
* **Empty State:** Tidak ada program pembelajaran tersedia.
* **Loading State:** Loading daftar program.
* **Error State:** Gagal memuat program; session expired redirect.
* **Success / Exit Behavior:** Pilihan manual menuju UX-005.
* **Security / Data Isolation Rules:** Subject card bukan entity baru; tidak mengakses data Learner lain.
* **AI / Engine / Event Boundary Notes:** Tidak menggunakan AI/Engine; tidak publish Runtime Event.
* **Out of Scope:** Enrollment, Payment, filtering berdasarkan Knowledge Profile, adaptive recommendation.
* **QA Checklist:** Hanya Published programs; Learner A dapat memilih Arabic Learning dan Learner B dapat memilih English Learning; multi-learner/multi-program support bukan adaptive path.

## UX-005 — Program Detail / Module List

* **Route / URL Pattern:** `/programs/:programId`
* **Access Level:** Authenticated.
* **Purpose:** Menampilkan Program Detail, Program Structure, Published Learning Modules, dan available Learning Activities.
* **Entry Conditions:** Learner memilih program dari UX-004.
* **Main UI Elements:** Program title/description, Program Type, Program Structure, Module Cards, Activity Cards, back navigation.
* **Primary Actions:** Pilih module; pilih activity; kembali ke program list.
* **API Dependencies:** `GET /api/v1/learning-programs/{programId}`; `GET /api/v1/learning-programs/{programId}/program-structure`; `GET /api/v1/learning-modules`; `GET /api/v1/learning-activities`.
* **Data Dependencies:** `learning_program`, `program_structure`, `learning_module`, `learning_activity`.
* **State Dependencies:** Active Learner context; optional read of basic learning_state for status indicators.
* **Empty State:** No module available atau no activity available.
* **Loading State:** Loading program detail/module/activity lists.
* **Error State:** Program not found redirect ke UX-004; unauthorized/session expired redirect.
* **Success / Exit Behavior:** Activity selection menuju UX-006.
* **Security / Data Isolation Rules:** Tampilkan resource Published yang valid; jangan tampilkan data Learner lain pada status/progress.
* **AI / Engine / Event Boundary Notes:** Tidak menggunakan AI; tidak menghasilkan Learning Decision; tidak publish Runtime Event.
* **Out of Scope:** Adaptive sequencing, Learning Decision-based recommendation, Enrollment workflow.
* **QA Checklist:** Detail program benar; Program Structure muncul; modules/activities Published only; no adaptive ordering claim.

## UX-006 — Learning Activity Page

* **Route / URL Pattern:** `/activities/:activityId`
* **Access Level:** Authenticated.
* **Purpose:** Menjalankan Learning Activity, menampilkan Learning Objective dan Published Learning Content, serta menyelesaikan activity.
* **Entry Conditions:** Learner memilih activity dari UX-005; Learner context aktif; state valid untuk belajar.
* **Main UI Elements:** Activity title/type, Learning Objective, Learning Content Viewer, instructions, Complete Activity button, AI Practice entry only for `activity_type = Practice`.
* **Primary Actions:** Complete Activity; start AI Practice if Practice; back to Module List.
* **API Dependencies:** `GET /api/v1/learning-activities/{activityId}`; `GET /api/v1/learning-contents`; `POST /api/v1/learning-activities/{activityId}/complete`.
* **Data Dependencies:** `learning_activity`, `learning_objective`, `content_item`, `learning_state`, `activity_result`.
* **State Dependencies:** State Machine state such as `Not Started`, `Learning`, `Assessing`; no new transition introduced by UI.
* **Empty State:** Learning Content kosong tetap menampilkan instructions jika activity valid.
* **Loading State:** Loading activity detail/content; disable completion during request.
* **Error State:** Invalid state, completion criteria not met, resource not found, session expired.
* **Success / Exit Behavior:** Completion creates Activity Result and leads to UX-008 once Assessment Result is available.
* **Security / Data Isolation Rules:** Completion uses active Learner context; Learner cannot complete activity for another Learner.
* **AI / Engine / Event Boundary Notes:** Activity completion triggers existing backend/runtime behavior; UI does not publish Runtime Event; AI entry appears only for Practice.
* **Out of Scope:** Adaptive content selection and Knowledge Profile personalization. Placement Test is UX-011.
* **QA Checklist:** Content loads; completion works; AI button hidden for non-Practice; Activity Result is created via completion flow.

## UX-007 — AI Conversation Practice

* **Route / URL Pattern:** `/activities/:activityId/ai-practice` or modal/panel from UX-006.
* **Access Level:** Authenticated, only from Practice activity.
* **Purpose:** Memberikan practice guidance/feedback untuk satu Learning Objective.
* **Entry Conditions:** Learner berada di UX-006; `activity_type = Practice`; Learner memilih Start AI Practice.
* **Main UI Elements:** Learning Objective context, optional Published Learning Content context, conversation history, message input, send button, end session button, practice-only label.
* **Primary Actions:** Start session; send message; complete AI session; return to UX-006.
* **API Dependencies:** `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`; `POST /api/v1/ai-conversations/{conversationId}/messages`; `POST /api/v1/ai-conversations/{conversationId}/complete`; `GET /api/v1/ai-conversations/{conversationId}`.
* **Data Dependencies:** `ai_practice_conversation`, `ai_practice_message`, `ai_practice_provider_record`, `ai_practice_safety_event`, `learning_activity`, `learning_objective`, `content_item`.
* **State Dependencies:** Parent Learning Activity must be type `Practice`; active Learner context.
* **Empty State:** New conversation prompt/greeting.
* **Loading State:** Message send/AI response pending indicator.
* **Error State:** AI unavailable graceful fallback; governance violation; non-Practice request rejected.
* **Success / Exit Behavior:** End session returns to UX-006; Learner must still complete Learning Activity explicitly.
* **Security / Data Isolation Rules:** Conversation belongs to active Learner/activity/objective only.
* **AI / Engine / Event Boundary Notes:** AI output is practice guidance/feedback only; AI must not generate Assessment Result, update Knowledge Profile, generate Learning Decision, or publish Official Runtime Event; records are audit/observability/provider records only.
* **Out of Scope:** Full AI Learning Companion, AI Memory, AI scoring, official assessment, adaptive recommendation.
* **QA Checklist:** Available only for Practice; displays objective context; fallback works; no Assessment Result/Knowledge Profile/Learning Decision mutation or UI claim.

## UX-008 — Activity Completion / Assessment Result

* **Route / URL Pattern:** `/assessment-results/:resultId`
* **Access Level:** Authenticated.
* **Purpose:** Menampilkan Activity Completion dan read-only Assessment Result.
* **Entry Conditions:** Activity completed; Activity Result exists; Assessment Engine has produced or is producing Assessment Result.
* **Main UI Elements:** Completion confirmation, Learning Objective, Assessment Result summary, Assessment Blueprint reference, Dashboard button, Module List button.
* **Primary Actions:** View Dashboard; return to Module List.
* **API Dependencies:** `GET /api/v1/assessment-results/{resultId}`; `GET /api/v1/assessment-results` if needed.
* **Data Dependencies:** `activity_result`, `assessment_result`, `assessment_blueprint`, `learning_state`.
* **State Dependencies:** Assessment processing/result state; active Learner context.
* **Empty State:** Assessment Result pending shows processing state.
* **Loading State:** Loading Assessment Result.
* **Error State:** Assessment failed; result not found; unauthorized/session expired.
* **Success / Exit Behavior:** Read-only result displayed; exit to UX-009 or UX-005.
* **Security / Data Isolation Rules:** Result must belong to active Learner; Learner cannot modify Assessment Result.
* **AI / Engine / Event Boundary Notes:** Assessment Result produced only by Assessment Engine; UI does not publish Runtime Event.
* **Out of Scope:** Knowledge Profile update display, Learning Decision display, adaptive next-step recommendation.
* **QA Checklist:** Result read-only; no edit controls; no Knowledge Profile/Learning Decision/adaptive recommendation; result belongs to active Learner.

## UX-009 — Basic Progress Dashboard

* **Route / URL Pattern:** `/dashboard`
* **Access Level:** Authenticated.
* **Purpose:** Menampilkan basic progress only.
* **Entry Conditions:** Active Learner context; opened from UX-003 or UX-008.
* **Main UI Elements:** Learner identity, current learning state, completed activities, Activity Result list/summary, Assessment Result list/summary, navigation.
* **Primary Actions:** Return Home; open program/module; logout.
* **API Dependencies:** `GET /api/v1/auth/me`; `GET /api/v1/assessment-results`.
* **Data Dependencies:** `learner`, `learning_state`, `activity_result`, `assessment_result`.
* **State Dependencies:** Basic read of `learning_state`; no Recommendation Engine dependency.
* **Empty State:** Belum ada aktivitas selesai.
* **Loading State:** Loading Learner context/progress.
* **Error State:** Dashboard data failed; session expired; unauthorized.
* **Success / Exit Behavior:** Learner navigates back to Home/Program/Module or logs out.
* **Security / Data Isolation Rules:** All progress data scoped to active Learner.
* **AI / Engine / Event Boundary Notes:** No AI dependency; no Official Runtime Event from UI.
* **Out of Scope:** Knowledge Profile, Learning Decision, adaptive recommendation, mastery based on Knowledge Profile, advanced analytics.
* **QA Checklist:** Shows current state/completed activities/results; hides Knowledge Profile/Learning Decision/adaptive recommendation/mastery claim.

## UX-010 — Error / Fallback State

* **Route / URL Pattern:** Cross-cutting state; optional `/error`.
* **Access Level:** Context-dependent.
* **Purpose:** Menangani session expired, Learner context missing, unauthorized access, empty states, AI unavailable, assessment failed, network error, resource not found, dan server error.
* **Entry Conditions:** Any failure condition from UX-001 through UX-011.
* **Main UI Elements:** Error/fallback banner or full-page fallback, safe message, retry button, safe navigation.
* **Primary Actions:** Retry; return to safe destination; login again; continue without AI when applicable.
* **API Dependencies:** `GET /api/v1/auth/me` for auth/context checks; relevant failing endpoint.
* **Data Dependencies:** `auth_session`, current requested record, safe fallback state.
* **State Dependencies:** Error class and current screen context.
* **Empty State:** No program, no module, no activity handled as safe empty states.
* **Loading State:** N/A except retry/loading indicator.
* **Error State:** Session expired, Learner context missing, unauthorized, AI unavailable, assessment failed, network, 404, 500.
* **Success / Exit Behavior:** Recovery to Login, Learner Home, Program List, Module List, Activity Page, or current screen after retry.
* **Security / Data Isolation Rules:** No data leakage; do not expose another Learner resource; clear local state when context invalid.
* **AI / Engine / Event Boundary Notes:** Must not create fallback business rules; must not publish Runtime Events for UI fallback interactions.
* **Out of Scope:** Stack trace, provider detail, database query, raw internal ID, secrets, synthetic Assessment Result, Knowledge Profile, or Learning Decision.
* **QA Checklist:** Safe redirects; no internal details; no data leakage; AI fallback keeps activity available; assessment failed does not show partial official result.

---


## UX-011 — Placement Test

* **Purpose:** Present the MVP Placement Test as a specialized assessable Learning Activity with `purpose = Placement`.
* **Entry Conditions:** Authenticated Learner enters from UX-005 when placement metadata is available or required.
* **Main UI Elements:** CMP-029 placement card/progress/result and CMP-028 submission status.
* **States:** Available, starting, in-progress, Assessment Pending, Assessment Ready, failed, Retry. These are frontend states, never Runtime states.
* **APIs and Data:** Reuses Learning Activity completion and Assessment Result APIs; `learning_activity`, `activity_result`, `assessment_result`.
* **Boundary:** Reuses Assessment Engine and introduces no Placement Test entity or API resource.
* **Exit:** UX-008 after Assessment Result is ready, or UX-005 on safe return.

# 5. Route and Access Matrix

| Route / Pattern | Screen ID | Public / Authenticated | Requires Learner Context | Redirect if Unauthenticated | Notes |
| --------------- | --------- | ---------------------- | ------------------------ | --------------------------- | ----- |
| `/` | UX-001 | Public | No | N/A | No Learner data. |
| `/login` | UX-002 | Public entry | No before login; validates after login | N/A | Builds Learner context after success. |
| `/home` | UX-003 | Authenticated | Yes | `/login` | Main authenticated entry. |
| `/programs` | UX-004 | Authenticated | Yes | `/login` | Manual program/subject selection. |
| `/programs/:programId` | UX-005 | Authenticated | Yes | `/login` | Program detail and module/activity list. |
| `/activities/:activityId` | UX-006 | Authenticated | Yes | `/login` | Learning Activity execution. |
| `/activities/:activityId/ai-practice` | UX-007 | Authenticated | Yes | `/login` | Only when `activity_type = Practice`; may be modal/panel. |
| `/assessment-results/:resultId` | UX-008 | Authenticated | Yes | `/login` | Read-only result for active Learner. |
| `/dashboard` | UX-009 | Authenticated | Yes | `/login` | Basic progress only. |
| Optional `/error` or inline state | UX-010 | Context-dependent | Context-dependent | `/login` when auth invalid | Cross-cutting safe fallback. |

---

# 6. API Coverage Matrix

| Screen ID | API Endpoint | Method | Purpose | Required Context | Error Handling Notes |
| --------- | ------------ | ------ | ------- | ---------------- | -------------------- |
| UX-001 | `/api/v1/public/landing-page` | GET | Load Landing Page content. | Public | Static fallback on failure. |
| UX-001 | `/api/v1/public/program-highlights` | GET | Load Published program highlights. | Public | Empty highlights allowed. |
| UX-002 | `/api/v1/auth/login` | POST | Create auth session. | Credentials | Show safe login error. |
| UX-002 | `/api/v1/auth/me` | GET | Verify active Learner context. | Auth session | Redirect to login if missing. |
| UX-003 | `/api/v1/auth/me` | GET | Load Learner context. | Auth session | Redirect to login if invalid. |
| UX-003 | `/api/v1/learning-programs` | GET | Load Published programs. | Learner context | Show retry/empty state. |
| UX-004 | `/api/v1/learning-programs` | GET | Load Published programs. | Learner context | Show no program or retry. |
| UX-005 | `/api/v1/learning-programs/{programId}` | GET | Load program detail. | Learner context | 404 returns to UX-004. |
| UX-005 | `/api/v1/learning-programs/{programId}/program-structure` | GET | Load Program Structure. | Learner context | Show unavailable state safely. |
| UX-005 | `/api/v1/learning-modules` | GET | Load Published modules. | Learner context | No module empty state. |
| UX-005 | `/api/v1/learning-activities` | GET | Load Published activities. | Learner context | No activity empty state. |
| UX-006 | `/api/v1/learning-activities/{activityId}` | GET | Load activity detail. | Learner context | 404/safe back. |
| UX-006 | `/api/v1/learning-contents` | GET | Load related Published content. | Learner context | Content empty allowed. |
| UX-006 | `/api/v1/learning-activities/{activityId}/complete` | POST | Complete activity and create Activity Result. | Learner context | 409/422 shown safely. |
| UX-007 | `/api/v1/learning-activities/{activityId}/ai-conversation/start` | POST | Start AI Practice. | Learner context, Practice activity | 503 graceful fallback; 400/422 if not Practice. |
| UX-007 | `/api/v1/ai-conversations/{conversationId}/messages` | POST | Send message and receive AI practice feedback. | Learner context, conversation owner | Governance/AI failure shown safely. |
| UX-007 | `/api/v1/ai-conversations/{conversationId}/complete` | POST | End AI Practice session. | Learner context, conversation owner | Return to UX-006 safely. |
| UX-007 | `/api/v1/ai-conversations/{conversationId}` | GET | Load conversation history. | Learner context, conversation owner | 404/unauthorized safe fallback. |
| UX-008 | `/api/v1/assessment-results/{resultId}` | GET | Load read-only Assessment Result. | Learner context, result owner | Pending/not found/failed states. |
| UX-008 | `/api/v1/assessment-results` | GET | Load relevant result if needed. | Learner context | Filtered by active Learner. |
| UX-009 | `/api/v1/auth/me` | GET | Verify Learner context. | Auth session | Redirect to login if invalid. |
| UX-009 | `/api/v1/assessment-results` | GET | Load Learner Assessment Results. | Learner context | Dashboard retry/empty state. |
| UX-010 | Relevant failing endpoint | Any | Determine fallback behavior. | Context-dependent | Safe message; no internal details. |

---

# 7. Data Dependency Matrix

| Screen ID | Database Entity / Record | Read / Write | Purpose | Data Isolation Rule |
| --------- | ------------------------ | ------------ | ------- | ------------------- |
| UX-001 | `landing_page_config` | Read | Public product content. | No Learner data. |
| UX-001 | `learning_program` highlights | Read | Public Published highlights. | Published/public projection only. |
| UX-002 | `learner_auth_account` | Read | Credential verification. | Auth service only; no cross-learner exposure. |
| UX-002 | `auth_session` | Write/Read | Session creation and validation. | Session maps to one active Learner. |
| UX-002 | `learner` | Read | Active Learner reference. | Return active session Learner only. |
| UX-003 | `learner` | Read | Display active identity. | Active Learner only. |
| UX-003, UX-004 | `learning_program` | Read | Program entry points. | Published programs; no other Learner data. |
| UX-005 | `learning_program` | Read | Program detail. | Valid Published/accessible program only. |
| UX-005 | `program_structure` | Read | Program structure display. | Referenced by selected program. |
| UX-005 | `learning_module` | Read | Module list. | Published modules in selected program structure. |
| UX-005, UX-006 | `learning_activity` | Read | Activity list/detail. | Published/accessible activities only. |
| UX-006, UX-007 | `learning_objective` | Read | Objective context. | Objective linked to selected activity. |
| UX-006, UX-007 | `content_item` | Read | Published Learning Content. | Published content linked to activity/objective. |
| UX-006, UX-009 | `learning_state` | Read | Current state/status. | Active Learner context only. |
| UX-006 | `activity_result` | Write | Created by completion flow. | Written for active Learner/activity only. |
| UX-007 | `ai_practice_conversation` | Write/Read | AI Practice session. | Active Learner/activity/objective only. |
| UX-007 | `ai_practice_message` | Write/Read | Conversation messages. | Conversation owner only. |
| UX-007 | `ai_practice_provider_record` | Write | Provider observability. | Audit/observability only; no business outcome. |
| UX-007 | `ai_practice_safety_event` | Write | Governance/safety record. | Audit/observability only. |
| UX-008, UX-009 | `activity_result` | Read | Source/result history. | Active Learner only. |
| UX-008, UX-009 | `assessment_result` | Read | Official Assessment Result display. | Active Learner only; read-only. |
| UX-008 | `assessment_blueprint` | Read | Evaluation reference. | Reference only. |
| UX-010 | `auth_session`, requested record | Read | Safe fallback decision. | Never expose unauthorized record data. |

---

# 8. State and Boundary Matrix

| Screen ID | Learning State / Runtime Dependency | Engine Dependency | AI Dependency | Official Runtime Event Published by UI? | Notes |
| --------- | ----------------------------------- | ----------------- | ------------- | --------------------------------------- | ----- |
| UX-001 | None | None | None | No | Public screen; no Learner context. |
| UX-002 | Auth session only | None | None | No | Authentication does not publish Official Runtime Event. |
| UX-003 | Optional basic progress read | None | None | No | No Knowledge Profile or Learning Decision. |
| UX-004 | None beyond active Learner context | None | None | No | Manual program choice only. |
| UX-005 | Optional basic `learning_state` indicators | None | None | No | No adaptive sequencing. |
| UX-006 | Reads/uses activity state; completion enters existing backend/runtime behavior | Assessment Engine downstream after Activity Result | AI entry only if Practice | No | UI does not define new State Machine transition. |
| UX-007 | Parent activity must be `Practice` | None; Assessment Engine not involved | AI Practice Provider/Gateway | No | AI records are observability/provider records only. |
| UX-008 | Reads result/assessment state | Assessment Result belongs to Assessment Engine | None | No | Read-only Assessment Result. |
| UX-009 | Reads `learning_state` and result history | Reads Assessment Result only | None | No | Basic progress only. |
| UX-010 | Depends on current screen/error | None directly | AI fallback when applicable | No | Must not create fallback business rules. |

---

# 9. Empty / Loading / Error Coverage

| Screen ID | Loading State | Empty State | Error State | Safe Recovery Action |
| --------- | ------------- | ----------- | ----------- | -------------------- |
| UX-001 | Loading public content/highlights. | No highlights available. | Public API failure. | Static fallback; Login still available if possible. |
| UX-002 | Login submit pending. | N/A. | Invalid credentials, server unavailable, context missing. | Retry login or return to Landing Page. |
| UX-003 | Loading Learner/programs. | No Published programs. | Session invalid, program load failure. | Redirect to Login or retry. |
| UX-004 | Loading program list. | No program available. | Program list load failure. | Retry or return Home. |
| UX-005 | Loading program/modules/activities. | No module or no activity. | Program not found, unauthorized. | Return to Program Selection or Login. |
| UX-006 | Loading activity/content/completion. | Content unavailable. | Invalid state, completion criteria not met, 404. | Retry, continue with instructions, or return Module List. |
| UX-007 | Starting session/sending message/loading history. | New conversation prompt. | AI unavailable, governance violation, non-Practice request. | Continue activity without AI; return UX-006. |
| UX-008 | Loading Assessment Result. | Result pending. | Assessment failed, result not found. | Retry, return UX-005/UX-006, or open Dashboard if safe. |
| UX-009 | Loading dashboard data. | No completed activities/results. | Data load failure, session expired. | Retry or Login. |
| UX-010 | Retry pending if applicable. | No program/module/activity states. | Session, auth, AI, assessment, network, 404, 500. | Safe destination by context. |

---

# 10. QA Coverage Checklist

| Screen ID | QA Focus | Critical Checks | Out-of-Scope Checks |
| --------- | -------- | --------------- | ------------------- |
| UX-001 | Public Landing Page | No auth required; no Learner data; public APIs load/fallback. | No signup, Enrollment, personalization, Runtime Event. |
| UX-002 | Login | Two learner accounts; isolation; session creation; `auth/me`; logout cleanup. | No signup/reset/social login/OAuth/SSO/MFA/role UI. |
| UX-003 | Learner Home | Auth required; active Learner shown; programs visible; logout works. | No Knowledge Profile, Learning Decision, adaptive recommendation. |
| UX-004 | Program Selection | Published programs only; manual choice; subject card is UI only. | No adaptive path, Enrollment, Knowledge Profile filtering. |
| UX-005 | Module/List | Program detail, Program Structure, Published modules/activities. | No adaptive sequencing or Learning Decision-based recommendation. |
| UX-006 | Learning Activity | Objective/content shown; completion works; AI button only for Practice. | No adaptive content or Knowledge Profile personalization. |
| UX-007 | AI Practice | Assessable Practice access; guidance/feedback, voice/text fallback, and submission state. | AI does not produce Assessment Result, Knowledge Profile update, Learning Decision, or Official Runtime Event. |
| UX-008 | Assessment Result | Read-only; produced by Assessment Engine; belongs to active Learner. | No edit, no Knowledge Profile update display, no Learning Decision, no adaptive next step. |
| UX-009 | Dashboard | Current state, completed activities, Activity Result, Assessment Result. | No Knowledge Profile/Learning Decision/adaptive recommendation/mastery claim. |
| UX-010 | Error/Fallback | No data leakage; safe redirects; no internal error details. | No fallback business rules or Runtime Events for UI fallback. |

---

# 11. Out of Scope Screens

| Screen | Reason | Future / Phase / Open Issue Status |
| ------ | ------ | ---------------------------------- |
| Signup Page | Public signup is outside MVP Basic Learner Authentication. | Open Issue / Future. |
| Forgot Password Page | Password reset is not part of MVP auth. | Advanced Authentication Open Issue. |
| OAuth / Social Login Page | OAuth, social login, SSO, MFA are not MVP. | Advanced Authentication Open Issue. |
| Full adaptive Placement/Recommendation Page | Adaptive recommendation is not MVP. | Phase 2. |
| Adaptive Recommendation Page | Adaptive personalized learning path is not MVP. | Phase 2. |
| Knowledge Profile Dashboard | Knowledge Profile visualization is excluded from MVP UI. | Phase 2. |
| Learning Decision Explanation Page | Learning Decision UI/explanation is excluded from MVP. | Phase 3 / Future. |
| Enrollment Page | Enrollment workflow is not introduced in MVP UI. | Open Issue. |
| Educator Dashboard | Educator experience is outside MVP. | Phase 4. |
| Parent Dashboard | Parent experience is outside MVP. | Phase 5 / Future. |
| Payment / Subscription Page | Payment/subscription is outside MVP. | Future. |
| Notification Center | Notifications are outside MVP. | Phase 5 / Future. |
| Achievement / Certificate Page | Achievements/certificates are outside MVP. | Phase 5 / Future. |
| Advanced Analytics Page | Advanced analytics is outside MVP screen scope. | Phase 2+ / Open Issue. |

---

# 12. Open Issues

* Advanced Authentication.
* Public Signup.
* Enrollment Workflow.
* Adaptive Learning Path.
* Knowledge Profile Visualization.
* Learning Decision Explanation.
* Educator Experience.
* Parent Experience.
* Notifications.
* Achievements / Certificates.
* Advanced Analytics.

# 13. References

* `docs/70_ui_ux/70_ui_ux_spec.md`
* `docs/70_ui_ux/71_user_flow.md`
* `docs/50_product/52_prd.md`
* `docs/60_engineering/60_srs.md`
* `docs/60_engineering/62_api_spec.md`
* `docs/60_engineering/63_database_model.md`
* `docs/60_engineering/65_event_contracts.md`
* `docs/80_implementation/80_feature_breakdown.md`
* `docs/99_architecture_decisions.md`
