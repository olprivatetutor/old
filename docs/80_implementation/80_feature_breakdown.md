# Feature Breakdown — Kaifa v2

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | ----- | ---------- | ------- | ------------ |
| 1.1 | Freeze | Product & Engineering | `20_state_machine.md`, `21_event_model.md`, `52_prd.md`, `60_srs.md`, `61_api_design_principles.md`, `62_api_spec.md`, `63_database_model.md`, `64_engine_contracts.md`, `65_event_contracts.md`, `70_ui_ux_spec.md`, `71_user_flow.md`, `72_screen_inventory.md`, `73_component_spec.md`, `74_frontend_state_model.md`, `75_interaction_spec.md`, `76_design_system.md`, `77_frontend_implementation_plan.md`, `81_frontend_mvp_task_breakdown.md`, `99_architecture_decisions.md` | Product, Engineering, QA, Backend, Frontend, AI Team | 2026-07-12 |

---

# 1. Purpose

Dokumen ini memecah requirement Kaifa v2 menjadi feature engineering yang dapat digunakan untuk planning, sprint breakdown, implementation sequencing, dan QA preparation.

Dokumen ini dibuat berdasarkan frozen product, engineering, event, UI/UX, dan frontend implementation documentation Kaifa v2.

Dokumen ini **tidak**:

* mendesain ulang architecture,
* membuat business entity baru,
* membuat business rule baru,
* membuat official event baru,
* mengubah ownership Domain, Runtime, Engine, atau AI Layer,
* menyelesaikan Open Issues yang belum memiliki Architecture Decision.

---

# 2. Source Documents

Dokumen sumber utama:

* `20_runtime/20_state_machine.md`
* `20_runtime/21_event_model.md`
* `50_product/52_prd.md`
* `60_engineering/60_srs.md`
* `60_engineering/61_api_design_principles.md`
* `60_engineering/62_api_spec.md`
* `60_engineering/63_database_model.md`
* `60_engineering/64_engine_contracts.md`
* `60_engineering/65_event_contracts.md`
* `70_ui_ux/70_ui_ux_spec.md`
* `70_ui_ux/71_user_flow.md`
* `70_ui_ux/72_screen_inventory.md`
* `70_ui_ux/73_component_spec.md`
* `70_ui_ux/74_frontend_state_model.md`
* `70_ui_ux/75_interaction_spec.md`
* `70_ui_ux/76_design_system.md`
* `70_ui_ux/77_frontend_implementation_plan.md`
* `80_implementation/81_frontend_mvp_task_breakdown.md`
* `99_architecture_decisions.md`

Architecture guardrails:

* AD-001 — Layered Architecture
* AD-002 — Domain Owns Business Rules
* AD-003 — Runtime Is Event-Driven
* AD-004 — Assessment Blueprint and Assessment Engine Are Separate
* AD-005 — Canonical Learning Pipeline
* AD-006 — AI Does Not Make Learning Decisions
* AD-007 — Knowledge Profile Is Not AI Memory
* AD-008 — AI Provider Agnostic
* AD-009 — AI as Experience Layer
* AD-010 — Documentation as Single Source of Truth

---

# 3. Breakdown Rules

1. Feature ID menggunakan format `FB-MVP-xxx`, `FB-P2-xxx`, `FB-P3-xxx`, `FB-P4-xxx`, atau `FB-BLOCKED-xxx`.
2. MVP feature hanya mencakup capability Phase 1 yang sudah memiliki dasar arsitektur dan engineering contract.
3. Phase 2, Phase 3, Phase 4, dan Future Scope dicatat sebagai backlog terpisah, bukan dimasukkan ke MVP.
4. Open Issues tidak boleh diubah menjadi MVP feature.
5. Observability-only lifecycle events tidak boleh digunakan sebagai official integration contract atau business trigger.
6. Official event classification, ownership, naming, dan flow hanya ditentukan oleh `21_event_model.md`; `65_event_contracts.md` mengimplementasikan kontraknya dan dokumen lain hanya mengonsumsi mapping tersebut.
7. AI Layer tidak boleh menghasilkan Learning Decision, Knowledge Profile, atau Assessment Result.
8. Frontend hanya menggunakan documented APIs dan tidak melakukan scoring, membuat Activity Result/Assessment Result, memperbarui Knowledge Profile, menghasilkan Learning Decision, atau mempublikasikan Official Runtime Event.

---

# 4. MVP Feature Summary

| Feature ID | Feature | Source Requirement | Priority | MVP Status |
| ---------- | ------- | ------------------ | -------- | ---------- |
| FB-MVP-001 | Learning Program Management and Manual Program / Subject Selection | SRS-FR-001 | Critical | Ready |
| FB-MVP-002 | Program Structure Assignment | SRS-FR-002 | Critical | Ready |
| FB-MVP-003 | Learning Module Management | SRS-FR-003 | Critical | Ready |
| FB-MVP-004 | Learning Design Management | SRS-FR-004 | Critical | Ready |
| FB-MVP-005 | Learning Objective Management | SRS-FR-005 | High | Ready |
| FB-MVP-006 | Learning Activity Execution | SRS-FR-006 | Critical | Ready |
| FB-MVP-007 | Assessment Blueprint Management | SRS-FR-007 | Critical | Ready |
| FB-MVP-008 | Assessment Engine Execution | SRS-FR-008 | Critical | Ready |
| FB-MVP-009 | Learning Content Delivery | SRS-FR-009 | High | Ready |
| FB-MVP-010 | Runtime State Machine | SRS-FR-010 | Critical | Ready |
| FB-MVP-011 | Runtime Event Coordination | SRS-FR-011 | Critical | Ready |
| FB-MVP-012 | Basic Learner Progress Dashboard | SRS-FR-012 | High | Ready with limited scope |
| FB-MVP-013 | Public Landing Page | SRS-FR-012A | Medium | Ready |
| FB-MVP-014 | AI Conversation Practice for Learning Objective | SRS-FR-012B | Medium | Ready with limited scope |
| FB-MVP-015 | MVP Basic Learner Authentication | SRS-FR-012C | High | Ready with limited scope |
| FB-MVP-016 | Placement Test as Specialized Assessable Learning Activity | SRS-FR-016 | High | Ready |

---

# 5. MVP Feature Details

## FB-MVP-001 — Learning Program Management and Manual Program / Subject Selection

**Source Requirement:** SRS-FR-001  
**User Story:** Sebagai sistem implementasi dan Learner, saya ingin Learning Program tersedia melalui kontrak domain resmi dan dapat dipilih secara manual agar alur belajar dimulai dari Published program tanpa Enrollment atau adaptive recommendation.

**Acceptance Criteria**

* Sistem dapat membuat Learning Program dengan stable ID.
* Sistem mendukung Program Type resmi: Curriculum, Certification, Language, Book, Free Learning, Custom.
* Sistem mendukung lifecycle Draft → Published → Archived.
* Learning Program yang Archived tidak digunakan sebagai program aktif baru.
* Sistem tidak membuat Enrollment flow penuh pada MVP.
* Learner yang terautentikasi dapat melihat dan memilih Published Learning Program secara manual pada UX-003/UX-004.
* Subject Card hanya representasi UI untuk grouping program dan tidak membuat Subject domain entity baru.
* Tidak ada Educator/Admin product UI, Knowledge Profile ranking, atau adaptive selection pada MVP.

**API Mapping**

* Learning Program resource API dari `62_api_spec.md` §11.1.
* `GET /api/v1/learning-programs` untuk manual Program / Subject Selection.
* Write-domain endpoints adalah restricted internal/admin-authoring capability dan tidak diekspos ke Learner/Educator public client sampai authoring role diformalkan.

**Database Mapping**

* `learning_program`
* audit/event metadata where applicable

**Engine Mapping**

* N/A — Learning Program adalah Learning Domain entity.

**Event Mapping**

* `LearningProgramCreated`
* `LearningProgramPublished`

**UI / Frontend Mapping**

* UX-003, UX-004; CMP-005, CMP-006.
* FE-WS-006; FE-TASK-031 sampai FE-TASK-036.

**Dependencies**

* `10_learning_program.md`
* `11_program_structure.md`
* `60_srs.md`
* `62_api_spec.md`
* `63_database_model.md`

**Out of Scope**

* Enrollment lifecycle.
* Multi-tenant organization.
* Role/permission engine.

---

## FB-MVP-002 — Program Structure Assignment

**Source Requirement:** SRS-FR-002  
**User Story:** Sebagai sistem implementasi, saya ingin menetapkan Program Structure pada Learning Program agar struktur belajar valid sejak awal tanpa mengasumsikan Educator/Admin UI.

**Acceptance Criteria**

* Setiap Learning Program memiliki tepat satu Program Structure.
* Sistem memvalidasi tipe struktur resmi: Curriculum, CEFR, Book, Certification, Free Learning, Custom Structure.
* Learning Program tanpa Program Structure tidak dapat dipublikasikan.
* Program Structure tidak mendefinisikan business rule baru di luar dokumen domain.

**API Mapping**

* Program Structure resource API dari `62_api_spec.md` §11.2.
* `PUT` adalah restricted internal/admin-authoring capability; `GET` mengikuti supported operation pada frozen API Specification.
* Learning Program publish validation.

**Database Mapping**

* `program_structure`
* relation to `learning_program`

**Engine Mapping**

* N/A.

**Event Mapping**

* `ProgramStructureAssigned`

**Dependencies**

* `11_program_structure.md`
* `10_learning_program.md`

**Out of Scope**

* Dynamic structure generation by AI.
* Multi-program composition.

---

## FB-MVP-003 — Learning Module Management

**Source Requirement:** SRS-FR-003  
**User Story:** Sebagai sistem implementasi, saya ingin membuat dan mengelola Learning Module agar konten pembelajaran dapat diorganisasi dalam Program Structure tanpa mengasumsikan Educator/Admin UI.

**Acceptance Criteria**

* Sistem dapat membuat, membaca, memperbarui, dan mengarsipkan Learning Module.
* Setiap Learning Module berada pada tepat satu Program Structure.
* Setiap Learning Module memiliki tepat satu Learning Design terkait.
* Lifecycle mengikuti Draft → Published → Archived.

**API Mapping**

* Learning Module resource API dari `62_api_spec.md` §11.3; write-domain endpoints adalah restricted internal/admin-authoring capability.

**Database Mapping**

* `learning_module`
* relationship to `program_structure`
* relationship to `learning_design`

**Engine Mapping**

* N/A.

**Event Mapping**

* `LearningModuleCreated`
* `LearningModulePublished`

**Dependencies**

* `13_learning_module.md`
* `12_learning_design.md`
* `11_program_structure.md`

**Out of Scope**

* AI-generated modules.
* Marketplace/package distribution.

---

## FB-MVP-004 — Learning Design Management

**Source Requirement:** SRS-FR-004  
**User Story:** Sebagai sistem implementasi, saya ingin menyimpan Learning Design agar module memiliki blueprint pedagogis yang jelas tanpa mengasumsikan authoring UI.

**Acceptance Criteria**

* Sistem dapat membuat, membaca, dan memperbarui Learning Design.
* Learning Design wajib memiliki minimal satu Learning Objective.
* Prerequisite Rule dan Completion Rule hanya mengikuti definisi domain yang tersedia.
* Learning Design tidak menghasilkan runtime state secara langsung.

**API Mapping**

* Learning Design resource API dari `62_api_spec.md` §11.4; write-domain endpoints adalah restricted internal/admin-authoring capability.

**Database Mapping**

* `learning_design`
* relationship to `learning_module`
* relationship to `learning_objective`

**Engine Mapping**

* Recommendation Engine reads Learning Design pada Phase 2, bukan MVP.

**Event Mapping**

* Tidak ada official MVP event khusus selain domain lifecycle jika didukung Event Model.

**Dependencies**

* `12_learning_design.md`
* `14_learning_objective.md`

**Out of Scope**

* AI modification of Learning Design.
* Adaptive decision logic inside Learning Design API.

---

## FB-MVP-005 — Learning Objective Management

**Source Requirement:** SRS-FR-005  
**User Story:** Sebagai sistem implementasi, saya ingin menyimpan Learning Objective agar setiap design memiliki target pembelajaran dan mastery criteria tanpa mengasumsikan authoring UI.

**Acceptance Criteria**

* Sistem dapat membuat, membaca, dan memperbarui Learning Objective.
* Learning Objective memiliki Objective Statement.
* Klasifikasi objective mengikuti daftar resmi: Knowledge, Understanding, Application, Analysis, Evaluation, Creation.
* Learning Objective terhubung ke tepat satu Learning Design.

**API Mapping**

* Learning Objective resource API dari `62_api_spec.md` §11.5; write-domain endpoints adalah restricted internal/admin-authoring capability.

**Database Mapping**

* `learning_objective`
* relationship to `learning_design`

**Engine Mapping**

* Assessment Engine menggunakan objective secara tidak langsung melalui Assessment Blueprint.

**Event Mapping**

* `LearningObjectiveCreated`

**Dependencies**

* `14_learning_objective.md`
* `12_learning_design.md`

**Out of Scope**

* AI-generated objectives.
* Objective recommendation engine.

---

## FB-MVP-006 — Learning Activity Execution

**Source Requirement:** SRS-FR-006  
**User Story:** Sebagai Learner, saya ingin menjalankan Learning Activity agar aktivitas belajar menghasilkan Activity Result yang dapat dievaluasi.

**Acceptance Criteria**

* Learner dapat menjalankan Learning Activity resmi.
* Activity type mengikuti daftar resmi: Reading, Watching, Listening, Discussion, Practice, Exercise, Assignment, Project, Experiment, Reflection.
* Official Learning Activity completion behavior menghasilkan Activity Result yang dipersist dan dimiliki Runtime.
* Activity Result menjadi input untuk Assessment Engine.
* Completion mengikuti Completion Criteria dari domain, bukan rule baru di API.
* Activity Result tetap non-evaluative dan tidak berisi official score, mastery, pass/fail, atau Learning Decision.
* Frontend hanya memanggil completion API; frontend tidak membuat Activity Result atau mempublikasikan Official Runtime Event.

**API Mapping**

* `POST /api/v1/learning-activities/{activityId}/complete`
* Activity Result read API where applicable.

**Database Mapping**

* `learning_activity`
* `activity_result`
* `learning_state`
* `runtime_event`

**Engine Mapping**

* Assessment Engine consumes Activity Result.

**Event Mapping**

* `LearningActivityCompleted`
* `ActivityResultGenerated`

**Dependencies**

* `15_learning_activity.md`
* `20_state_machine.md`
* `21_event_model.md`
* `30_assessment_engine.md`

**Out of Scope**

* Offline activity sync.
* AI-generated activity completion.

---

## FB-MVP-007 — Assessment Blueprint Management

**Source Requirement:** SRS-FR-007  
**User Story:** Sebagai sistem implementasi, saya ingin menyimpan Assessment Blueprint agar Assessment Engine dapat mengevaluasi Activity Result secara konsisten tanpa mengasumsikan authoring UI.

**Acceptance Criteria**

* Sistem dapat membuat, membaca, dan memperbarui Assessment Blueprint.
* Blueprint berisi Assessment Strategy, Evaluation Criteria, dan Mastery Criteria.
* Assessment Engine hanya mengeksekusi Blueprint, bukan mendefinisikan kriteria baru.
* Peer Review dan AI Assisted tetap dibatasi oleh Open Issues dan tidak menjadi flow resmi MVP di luar blueprint metadata.

**API Mapping**

* Assessment Blueprint resource API dari `62_api_spec.md` §11.7; write-domain endpoints adalah restricted internal/admin-authoring capability.

**Database Mapping**

* `assessment_blueprint`

**Engine Mapping**

* Assessment Engine reads Assessment Blueprint.

**Event Mapping**

* `AssessmentBlueprintUpdated`

**Dependencies**

* `16_assessment_blueprint.md`
* `30_assessment_engine.md`

**Out of Scope**

* Manual Assessment workflow.
* AI Assisted Assessment execution.

---

## FB-MVP-008 — Assessment Engine Execution

**Source Requirement:** SRS-FR-008  
**User Story:** Sebagai sistem, saya ingin Assessment Engine mengevaluasi Activity Result berdasarkan Assessment Blueprint agar menghasilkan Assessment Result resmi.

**Acceptance Criteria**

* Runtime memicu Assessment Engine melalui Internal Engine API.
* Assessment Engine memuat Assessment Blueprint.
* Assessment Engine memvalidasi Activity Result.
* Assessment Engine menghasilkan Assessment Result.
* Assessment Engine tidak mendefinisikan business rule baru.
* Assessment Engine adalah sole producer/owner Assessment Result; hasil dipersist immutable dan hanya disajikan read-only kepada client.
* Assessment execution bersifat stateless, deterministic, dan idempotent untuk evaluation cycle yang sama.
* Assessment Engine tidak memiliki/menulis Activity Result, tidak memperbarui Knowledge Profile, dan tidak menghasilkan Learning Decision.
* Frontend/API tidak melakukan scoring atau membuat/mengubah Assessment Result.

**API Mapping**

* Internal Assessment Engine API.
* Read-only Assessment Result API.

**Database Mapping**

* `activity_result`
* `assessment_blueprint`
* `assessment_result`
* `runtime_event`
* `state_transition`

**Engine Mapping**

* Assessment Engine.

**Event Mapping**

* Consumes: `ActivityResultGenerated`, `AssessmentBlueprintUpdated`
* Publishes official: `AssessmentStarted`, `AssessmentCompleted`, `AssessmentResultGenerated`
* Observability-only signal: `AssessmentFailed` (opsional pada `system_event_log`; bukan Official Runtime Event atau business trigger)

**Dependencies**

* `30_assessment_engine.md`
* `16_assessment_blueprint.md`
* `62_api_spec.md`
* `64_engine_contracts.md`
* `65_event_contracts.md`

**Out of Scope**

* AI scoring.
* Manual scoring as official Assessment Result producer.

---

## FB-MVP-009 — Learning Content Delivery

**Source Requirement:** SRS-FR-009  
**User Story:** Sebagai Learner, saya ingin mengakses Learning Content berstatus Published agar dapat belajar melalui content resmi.

**Acceptance Criteria**

* Sistem dapat menyimpan Learning Content dengan metadata minimum.
* Content Type mengikuti daftar resmi: Article, Video, Audio, Interactive, Assessment Resource, Document, External Resource.
* Lifecycle content mengikuti Draft → Published → Archived.
* Hanya Published content yang dapat digunakan dalam Learning Activity.
* AI tidak boleh menulis atau mengubah Learning Content resmi.

**API Mapping**

* Learning Content resource API dari `62_api_spec.md` §11.10; write-domain endpoints adalah restricted internal/admin-authoring capability.

**Database Mapping**

* `content_item`
* relationship to `learning_activity` where applicable

**Engine Mapping**

* N/A untuk MVP.

**Event Mapping**

* Tidak ada official pipeline event khusus untuk content delivery.

**Dependencies**

* `22_content_model.md`
* `15_learning_activity.md`

**Out of Scope**

* AI Content Assistant.
* Content recommendation engine.

---

## FB-MVP-010 — Runtime State Machine

**Source Requirement:** SRS-FR-010  
**User Story:** Sebagai sistem, saya ingin mengelola state pembelajaran secara deterministic agar setiap Learner hanya memiliki state aktif yang valid.

**Acceptance Criteria**

* Sistem mendukung state resmi: Not Started, Learning, Assessing, Updating Knowledge Profile, Generating Learning Decision, Ready for Next Activity, Completed.
* Transisi state hanya diterapkan Runtime berdasarkan official event yang valid.
* Runtime tetap pemilik State Machine, orchestration, dan state transitions.
* Engine tidak memiliki atau mengubah state secara langsung.
* State transition tercatat untuk auditability.

**API Mapping**

* Internal Runtime coordination.
* Read API untuk progress/dashboard dasar.

**Database Mapping**

* `learning_state`
* `state_transition`
* `runtime_event`

**Engine Mapping**

* Runtime triggers Assessment Engine in MVP.
* Knowledge Profile Engine dan Recommendation Engine masuk Phase 2.

**Event Mapping**

* `LearningActivityCompleted`
* `ActivityResultGenerated`
* `AssessmentStarted`
* `AssessmentCompleted`
* `AssessmentResultGenerated`

**Dependencies**

* `20_state_machine.md`
* `21_event_model.md`
* `65_event_contracts.md`

**Out of Scope**

* Custom state machine per tenant.
* AI-driven state transition.

---

## FB-MVP-011 — Runtime Event Coordination

**Source Requirement:** SRS-FR-011  
**User Story:** Sebagai sistem, saya ingin menggunakan event resmi untuk koordinasi runtime agar pipeline dapat ditelusuri dan tidak ada engine-to-engine direct call.

**Acceptance Criteria**

* Event mengikuti naming convention `<Entity><PastTense>`.
* Setiap official event memiliki single official publisher.
* Event immutable setelah dipublikasikan.
* Event membawa correlation ID dan trace ID.
* Candidate lifecycle events tidak digunakan sebagai official contract.
* Observability-only records tidak menjadi business trigger.
* `21_event_model.md` adalah sole authority untuk official event classification, ownership, naming, dan flow.
* Runtime memediasi engine invocation; tidak ada direct Engine-to-Engine call.
* Frontend tidak mempublikasikan Official Runtime Event.

**API Mapping**

* Event emitted from public/internal API workflows.
* Event payload contract from `65_event_contracts.md`.

**Database Mapping**

* `runtime_event`
* `state_transition`
* `system_event_log`

**Engine Mapping**

* Assessment Engine official events in MVP.
* KPE/Recommendation official events in Phase 2.

**Event Mapping**

* Official MVP Phase 1 flow: `LearningActivityCompleted` → `ActivityResultGenerated` → `AssessmentStarted` → `AssessmentCompleted` → `AssessmentResultGenerated`.
* Observability-only lifecycle events excluded from official integration contract.

**Dependencies**

* `21_event_model.md`
* `64_engine_contracts.md`
* `65_event_contracts.md`

**Out of Scope**

* Physical broker selection.
* Event replay guarantee.
* Causation ID unless approved by Architecture Review.

---

## FB-MVP-012 — Basic Learner Progress Dashboard

**Source Requirement:** SRS-FR-012  
**User Story:** Sebagai Learner, saya ingin melihat progres dasar agar mengetahui posisi saya dalam proses belajar MVP.

**Acceptance Criteria**

* Dashboard menampilkan state pembelajaran dari State Machine.
* Dashboard menampilkan Activity Result dan Assessment Result yang relevan.
* Dashboard tidak menampilkan Knowledge Profile pada MVP.
* Dashboard tidak menghasilkan Learning Decision.
* Dashboard tidak membuat analytics entity baru.
* Activity Result dan Assessment Result ditampilkan read-only untuk Learner aktif melalui official APIs.
* Dashboard/frontend tidak menghitung score, mastery, Knowledge Profile, atau adaptive recommendation.

**API Mapping**

* Read-only progress/dashboard API based on Runtime and Engine outputs.

**Database Mapping**

* `learning_state`
* `state_transition`
* `activity_result`
* `assessment_result`

**Engine Mapping**

* Reads Assessment Result.
* Does not trigger Engine execution.

**Event Mapping**

* None produced by read-only dashboard.

**Dependencies**

* `20_state_machine.md`
* `15_learning_activity.md`
* `30_assessment_engine.md`
* `62_api_spec.md`

**Out of Scope**

* Knowledge Profile visualization.
* Learning Decision explanation.
* Advanced analytics.

---

## FB-MVP-013 — Public Landing Page

**Source Requirement:** SRS-FR-012A  
**User Story:** Sebagai calon Learner atau pengunjung publik, saya ingin melihat informasi produk Kaifa pada Landing Page agar dapat memahami program yang tersedia tanpa harus login terlebih dahulu.

**Acceptance Criteria**

* Landing Page dapat diakses tanpa autentikasi.
* Landing Page hanya menyajikan informasi produk (ringkasan program, deskripsi layanan).
* Landing Page tidak membuat Enrollment.
* Landing Page tidak memicu Canonical Learning Pipeline.
* Landing Page tidak mengekspos data personal Learner.
* Konten Landing Page bersumber dari `landing_page_config` (static/config); tidak ada business entity baru.

**API Mapping**

* `GET /api/v1/public/landing-page`
* `GET /api/v1/public/program-highlights`

**Database Mapping**

* `landing_page_config` (static/config)

**AI/Engine Mapping**

* N/A — Landing Page tidak melibatkan AI Layer atau Engine.

**Event Mapping**

* Tidak ada Official Runtime Event yang dipublikasikan atau dikonsumsi oleh Landing Page.

**Dependencies**

* `50_user_journey.md`
* `51_roadmap.md`
* `62_api_spec.md`
* `63_database_model.md`

**Out of Scope**

* Enrollment flow dari Landing Page.
* Public signup dari Landing Page; Login CTA ke MVP Basic Learner Authentication tetap tersedia.
* Personalisasi Landing Page berbasis data Learner.
* Analytics event dari Landing Page visit.

---

## FB-MVP-014 — AI Conversation Practice for Learning Objective

**Source Requirement:** SRS-FR-012B  
**User Story:** Sebagai Learner, saya ingin melakukan latihan percakapan dengan AI Practice Partner untuk Learning Objective tertentu agar dapat memperdalam pemahaman secara interaktif melalui Learning Activity type Practice.

**Acceptance Criteria**

* Learner dapat memulai sesi AI Conversation Practice pada Learning Activity type Practice yang terhubung ke satu Learning Objective.
* Learner dapat menggunakan text interaction atau learner voice; Speech-to-Text input dan Text-to-Speech output adalah mandatory MVP capabilities.
* Voice flow mendukung permission, recording, processing, canonical target-language transcript, playback/replay, retry, dan text fallback states.
* AI Practice Partner menghasilkan AI text response dan spoken response melalui TTS, feedback text, serta practice guidance.
* AI menggunakan Published Learning Content sebagai konteks di mana berlaku.
* Normal Practice dan Assessable Practice memiliki completion path terpisah.
* Pada Assessable Practice, documented completion API membuat backend/Runtime menghasilkan dan mempersist Activity Result serta dapat mengemas approved assessment evidence berisi canonical target-language transcript dan supported evidence untuk Assessment Engine bersama Assessment Blueprint.
* Approved evidence bukan Assessment Result dan tidak berisi official score atau mastery; translation/transliteration hanya learner support dan bukan official assessment source.
* AI tidak menghasilkan atau menulis Assessment Result; official scoring hanya milik Assessment Engine.
* AI tidak memperbarui Knowledge Profile.
* AI tidak menghasilkan Learning Decision.
* Sesi percakapan disimpan pada `ai_practice_conversation` dan `ai_practice_message`.
* Setiap pemanggilan AI Provider Gateway dicatat pada `ai_practice_provider_record`.
* Governance violation dicatat pada `ai_practice_safety_event`.
* Tidak ada Official Runtime Event baru yang dipublikasikan.
* Kegagalan AI Provider mengaktifkan Graceful Degradation (AD-009); Learning Activity tetap dapat dilanjutkan tanpa AI.
* AI Authority Matrix (`44_ai_governance.md`) wajib ditegakkan.

**API Mapping**

* `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`
* `POST /api/v1/ai-conversations/{conversationId}/messages`
* `POST /api/v1/ai-conversations/{conversationId}/complete`
* `GET /api/v1/ai-conversations/{conversationId}`

**Database Mapping**

* `ai_practice_conversation` (ditautkan ke `learning_activity`, `learning_objective`, `learner`)
* `ai_practice_message`
* `ai_practice_provider_record` (audit/observability)
* `ai_practice_safety_event` (governance)
* `ai_practice_assessment_evidence` (approved evidence package untuk Assessable Practice)

**AI/Engine Mapping**

* AI Personal Learning Agent (MVP-limited contract, `64_engine_contracts.md` §9-MVP).
* AI Provider Gateway — seluruh pemanggilan AI Provider melalui Gateway (AD-008).
* Assessment Engine dilibatkan hanya untuk Assessable Practice melalui Runtime-mediated official completion flow dan tetap sole producer/owner Assessment Result.
* Knowledge Profile Engine: **tidak dilibatkan** — AI tidak memperbarui Knowledge Profile.
* Recommendation Engine: **tidak dilibatkan** — AI tidak menghasilkan Learning Decision.

**Event Mapping**

* AI Layer dan frontend tidak mempublikasikan Official Runtime Event; provider/conversation interactions tetap audit/observability records.
* Pada assessable completion, Learning Activity adalah official publisher `ActivityResultGenerated`; Runtime memiliki Activity Result persistence/orchestration dan memicu Assessment Engine.
* Official MVP flow dapat berakhir pada `AssessmentResultGenerated`; tidak ada `KnowledgeProfileUpdated` atau `LearningDecisionGenerated` untuk MVP AI Practice.
* `AssessmentFailed` tetap observability-only, bukan official integration contract.

**UI / Frontend Mapping**

* UX-007, UX-008, UX-010; CMP-011 sampai CMP-014 dan CMP-026 sampai CMP-028.
* FE-WS-011, FE-WS-016; FE-TASK-067 sampai FE-TASK-078 dan FE-TASK-104 sampai FE-TASK-108, FE-TASK-112.
* Frontend hanya mengirim documented messages/completion/evidence references; tidak membuat Activity Result, melakukan scoring, atau membuat Assessment Result.

**Dependencies**

* `15_learning_activity.md`
* `14_learning_objective.md`
* `22_content_model.md`
* `43_ai_personal_learning_agent.md`
* `44_ai_governance.md`
* `40_ai_architecture.md`
* `41_ai_provider_integration.md`
* `62_api_spec.md`
* `63_database_model.md`
* `64_engine_contracts.md`
* `65_event_contracts.md`

**Out of Scope**

* Full AI Learning Companion (Phase 3, FB-P3-001 s/d FB-P3-008).
* AI generating Assessment Result (dilarang AD-006).
* AI updating Knowledge Profile (dilarang AD-007).
* AI generating Learning Decision (dilarang AD-006).
* AI Memory (Phase 3, FB-P3-003).
* Offline AI support.
* AI Content Assistant (Phase 7 Future Scope).
* Real-time voice call, voice biometrics, dan standalone pronunciation certification; limited pronunciation feedback tetap practice support only.

---

## FB-MVP-015 — MVP Basic Learner Authentication

**Source Requirement:** SRS-FR-012C  
**User Story:** Sebagai Learner, saya ingin dapat login ke Kaifa agar data belajar saya terpisah dari Learner lain dan saya dapat menggunakan seluruh fitur learning flow MVP.

**Acceptance Criteria**

* Minimal dua Learner dapat login ke sistem dengan akun terpisah.
* Login berhasil membangun Learner context aktif.
* Data Learner (Learning Activity, AI Conversation Practice, Dashboard) terisolasi per Learner aktif — Learner A tidak dapat melihat data Learner B.
* Logout berhasil mengakhiri sesi Learner.
* `GET /api/v1/auth/me` mengembalikan referensi Learner aktif untuk sesi berjalan.
* Learning Activity execution menggunakan Learner context aktif dari sesi berjalan.
* AI Conversation Practice menggunakan Learner context aktif dari sesi berjalan.
* Basic Learner Progress Dashboard menampilkan data milik Learner aktif.
* Tidak ada public signup dalam MVP.
* Login tidak membuat Enrollment.
* Login tidak memicu Canonical Learning Pipeline.
* Login tidak mempublikasikan official Runtime Event.

**API Mapping**

* `POST /api/v1/auth/login` — login Learner, membangun sesi dan Learner context.
* `POST /api/v1/auth/logout` — logout Learner, mengakhiri sesi.
* `GET /api/v1/auth/me` — mengembalikan referensi Learner aktif.

**Database Mapping**

* `learner_auth_account` (MVP Basic Auth — kredensial Learner)
* `auth_session` (MVP Basic Auth — sesi aktif Learner)
* `learner` (stable reference, tidak berubah)

**AI/Engine Mapping**

* N/A — Authentication tidak melibatkan AI Layer atau Engine.
* Authentication tidak memiliki hubungan ke Assessment Engine, Knowledge Profile Engine, atau Recommendation Engine.

**Event Mapping**

* Tidak ada Official Runtime Event yang dipublikasikan atau dikonsumsi oleh Authentication.
* Login/logout/session activity dicatat sebagai security/audit log (`audit_log`, `system_event_log`) bukan sebagai official Runtime Event.

**Dependencies**

* `50_user_journey.md`
* `51_roadmap.md`
* `62_api_spec.md` (Section 6.1 — MVP Auth API)
* `63_database_model.md` (`learner_auth_account`, `auth_session`)
* `65_event_contracts.md` (Section 19.3 — No Official Runtime Events)

**Out of Scope**

* Public signup / registrasi mandiri.
* Forgot password / reset password / email verification.
* OAuth / Google login.
* MFA.
* SSO.
* Educator account dan Educator authentication.
* Parent account.
* Organization identity / enterprise identity.
* Role management dan permission model.
* Full account lifecycle management.
* Advanced Authentication (Advanced Authentication tetap Open Issue / Future Scope).

---

## FB-MVP-016 — Placement Test as Specialized Assessable Learning Activity

**Source Requirement:** SRS-FR-016
**User Story:** Sebagai Learner, saya ingin menyelesaikan Placement Test agar Assessment Engine dapat menghasilkan Placement Assessment Result dan starting-point suggestion tanpa membuat Learning Decision.

**Acceptance Criteria**

* Placement Test adalah `learning_activity` specialized assessable dengan metadata atau `purpose = Placement`, bukan engine, domain entity, tabel `placement_test`, atau API resource baru.
* Learner memilih dan menyelesaikan Placement activity melalui existing Learning Activity start/completion behavior.
* Runtime memiliki dan mempersist Activity Result yang sama seperti activity lain; frontend tidak membuatnya.
* Assessment Engine mengevaluasi Activity Result dengan Assessment Blueprint dan menjadi sole producer/owner Placement Assessment Result.
* Placement starting-point suggestion adalah metadata dalam/terkait Assessment Result, bukan Learning Decision.
* Recommendation Engine dan Knowledge Profile Engine tidak dipanggil pada MVP Placement flow; tidak ada `KnowledgeProfileUpdated` atau `LearningDecisionGenerated`.
* Assessment Result disajikan read-only; frontend tidak melakukan scoring atau menghitung suggestion.

**API Mapping**

* `GET /api/v1/learning-activities?purpose=placement`
* `POST /api/v1/learning-activities/{activityId}/start`
* `POST /api/v1/learning-activities/{activityId}/complete`
* `GET /api/v1/assessment-results/{resultId}`

**Database Mapping**

* Existing `learning_activity`, `activity_result`, `assessment_blueprint`, `assessment_result`, `learning_state`, dan `runtime_event`; tidak ada `placement_test`.

**Engine / Event Mapping**

* Runtime-mediated Assessment Engine flow only.
* Existing official MVP flow: `LearningActivityCompleted` → `ActivityResultGenerated` → `AssessmentStarted` → `AssessmentCompleted` → `AssessmentResultGenerated`.
* `AssessmentFailed` tetap observability-only.

**UI / Frontend Mapping**

* UX-011, UX-008; CMP-028, CMP-029.
* FE-WS-015; FE-TASK-101 sampai FE-TASK-103, FE-TASK-107, FE-TASK-111.

**Out of Scope**

* Placement Test Engine/resource/entity/table.
* Adaptive recommendation, Knowledge Profile update, atau Learning Decision pada MVP Placement flow.

---

# 6. Phase 2 Backlog — Adaptive Learning

Phase 2 features are not MVP unless explicitly promoted later.

| Feature ID | Feature | Source Requirement | Status | Notes |
| ---------- | ------- | ------------------ | ------ | ----- |
| FB-P2-001 | Knowledge Profile Update | SRS-FR-013 | Ready for Phase 2 | Requires Knowledge Profile Engine active. |
| FB-P2-002 | Learning Decision Generation | SRS-FR-014 | Ready for Phase 2 | Recommendation Engine sole owner. |
| FB-P2-003 | Adaptive Learning Pipeline End-to-End | SRS-FR-015 | Ready for Phase 2 | Extends MVP pipeline through Knowledge Profile and Learning Decision. |
| FB-P2-005 | Basic Progress Analytics Metadata | SRS-FR-017 | Conditional | Analytics ownership remains Open Issue. |

Phase 2 ownership tetap frozen: Knowledge Profile Engine adalah sole writer/owner Knowledge Profile dan melakukan incremental update dari valid Assessment Result; Recommendation Engine adalah sole producer/owner Learning Decision dan menghasilkan tepat satu official decision per applicable cycle. Frontend, API, database, AI Layer, dan engine lain tidak menggantikan kedua owner tersebut. Phase 2 capability tidak diaktifkan oleh MVP Placement Test atau MVP AI Conversation Practice.

## Phase 2 Event Guardrails

Official Phase 2 flow:

```text
AssessmentResultGenerated
        ↓
KnowledgeProfileUpdated
        ↓
LearningDecisionGenerated
```

Observability-only events remain non-official:

* `KnowledgeProfileUpdateStarted`
* `KnowledgeProfileUpdateFailed`
* `RecommendationStarted`
* `RecommendationCompleted`
* `RecommendationFailed`

These must not be used as official integration contracts or business triggers.

---

# 7. Phase 3 Backlog — AI Learning Companion

| Feature ID | Feature | Source Requirement | Status | Notes |
| ---------- | ------- | ------------------ | ------ | ----- |
| FB-P3-001 | AI Personal Learning Agent Orchestration | SRS-FR-018 | Phase 3 | AI produces conversation experience only. |
| FB-P3-002 | AI Explanation of Learning Decision | SRS-FR-019 | Phase 3 | AI explains official Learning Decision, does not create it. |
| FB-P3-003 | AI Memory | SRS-FR-020 | Phase 3 | Separate from Knowledge Profile. |
| FB-P3-004 | Full AI Provider Gateway Capability | SRS-FR-021 | Phase 3 | Phase 3 expansion only; MVP-limited Gateway use and `ai_practice_provider_record` are covered by FB-MVP-014. |
| FB-P3-005 | AI Graceful Degradation | SRS-FR-022 | Phase 3 | Core learning pipeline must continue without AI. |
| FB-P3-006 | AI Governance Enforcement | SRS-FR-023 | Phase 3 | Authority Matrix required. |
| FB-P3-007 | AI Tutor/Coach/Practice Capabilities | SRS-FR-024 | Phase 3 | Must not modify official learning outputs. |
| FB-P3-008 | AI Uses Learning Content as Context | SRS-FR-025 | Phase 3 | AI cannot write official Learning Content. |

---

# 8. Phase 4 Backlog — Educator Platform

| Feature ID | Feature | Source Requirement | Status | Notes |
| ---------- | ------- | ------------------ | ------ | ----- |
| FB-P4-001 | Learner Monitoring by Educator | SRS-FR-026 | Blocked/Conditional | Educator permission formalization required. |
| FB-P4-002 | Class Management and Assignment Review | SRS-FR-027 | Blocked | Class and Assignment Review not yet formal domain entities. |

---

# 9. Blocked / Open Issue Backlog

These items must not be implemented as MVP features until Architecture Review resolves ownership, boundary, and model decisions.

| Blocked ID | Capability | Reason Blocked | Required Before Implementation |
| ---------- | ---------- | -------------- | ------------------------------ |
| FB-BLOCKED-001 | Advanced Authentication / Full Identity Platform | MVP Basic Learner Authentication (FB-MVP-015) is included; advanced identity capabilities (public signup, OAuth, MFA, SSO, Educator auth, role management, enterprise identity) remain unresolved. | Advanced Authentication / Identity Platform architecture decision. |
| FB-BLOCKED-002 | Enrollment Lifecycle | Enrollment has no domain owner. | Enrollment domain model and ownership. |
| FB-BLOCKED-003 | Notification | No architecture model. | Notification architecture. |
| FB-BLOCKED-004 | Achievement / Certificate | Not modeled as entity. | Domain model and lifecycle. |
| FB-BLOCKED-005 | Analytics Product | Analytics has no formal ownership. | Analytics ownership and data contract. |
| FB-BLOCKED-006 | Educator Permission | Permission boundary unresolved. | Authorization model. |
| FB-BLOCKED-007 | Manual Assessment / Peer Review Execution | Not connected to official Assessment Engine flow. | Assessment workflow architecture review. |
| FB-BLOCKED-008 | AI Assisted Assessment | Risk of violating AI boundary. | AI governance and assessment ownership review. |
| FB-BLOCKED-009 | Program Context Schema | Structure not formally defined. | Recommendation input contract update. |
| FB-BLOCKED-010 | Learning Context Table | Not formalized as standalone entity. | Runtime/Domain modeling decision. |
| FB-BLOCKED-011 | Event Broker / Replay / Delivery Guarantee | Infrastructure detail out of scope. | Implementation architecture decision. |
| FB-BLOCKED-012 | Causation ID | Not in source docs. | Architecture Review if needed. |

---

# 10. Suggested Implementation Sequence

## Sprint Group 0 — Basic Access
1. FB-MVP-015 — MVP Basic Learner Authentication
2. FB-MVP-013 — Public Landing Page

## Sprint Group 1 — Domain Foundation

1. FB-MVP-001 — Learning Program Management
2. FB-MVP-002 — Program Structure Assignment
3. FB-MVP-003 — Learning Module Management
4. FB-MVP-004 — Learning Design Management
5. FB-MVP-005 — Learning Objective Management

## Sprint Group 2 — Content and Activity

1. FB-MVP-009 — Learning Content Delivery
2. FB-MVP-006 — Learning Activity Execution
3. Runtime-owned Activity Result persistence and official completion flow

## Sprint Group 3 — Assessment, Runtime, and Placement Integration

1. FB-MVP-007 — Assessment Blueprint Management
2. FB-MVP-010 — Runtime State Machine
3. FB-MVP-011 — Runtime Event Coordination
4. FB-MVP-008 — Assessment Engine integration through Runtime-mediated flow
5. FB-MVP-016 — Placement Test specialization after generic Activity/Result/Assessment foundations

Internal Assessment Engine development may proceed in parallel, tetapi end-to-end integration mengikuti Runtime coordination dan official completion flow.

## Sprint Group 4 — MVP Read Experience

1. FB-MVP-012 — Basic Learner Progress Dashboard
2. QA traceability checks
3. Observability and audit verification

## Sprint Group 5 — MVP AI Practice
1. FB-MVP-014 — AI Conversation Practice for Learning Objective
2. Mandatory voice/STT/TTS, Normal/Assessable completion, approved evidence, and provider fallback hardening
   
---

# 11. QA Planning Matrix

| Feature Group | QA Focus |
| ------------- | -------- |
| Domain Foundation | lifecycle validation, required relations, archived behavior |
| Content and Activity | published-only content, activity completion, Activity Result generation |
| Assessment | blueprint execution, deterministic Assessment Result, failure handling |
| Runtime | valid state transition, immutable events, idempotency, duplicate handling |
| Dashboard | read-only behavior, no Knowledge Profile in MVP, no Learning Decision generation |
| Observability | correlation ID, trace ID, failure records, no lifecycle event as official trigger |
| Landing Page | public access, no auth, no enrollment, no learner data, no runtime event |
| AI Conversation Practice | Practice-only, Normal/Assessable paths, mandatory voice/STT/TTS plus text fallback, approved evidence, MVP Gateway/provider persistence, Assessment Engine-only scoring, no AI-owned official outputs/events |
| Placement Test | Metadata-driven specialized assessable Learning Activity, Runtime-owned Activity Result, read-only Placement Assessment Result/suggestion, no Recommendation Engine |
| Basic Authentication | two learner accounts, login/logout, Learner context isolation, no Enrollment creation, no official Runtime Event, no public signup |
---

# 12. MVP Traceability Summary

| Feature ID | Product / SRS | API / Database / Engine / Event | UI / Frontend |
| ---------- | ------------- | ------------------------------- | ------------- |
| FB-MVP-001 | FR-001 / SRS-FR-001 | Learning Program APIs; `learning_program`; Domain events from `21_event_model.md` | UX-003/UX-004; FE-TASK-031–036 |
| FB-MVP-002 | FR-002 / SRS-FR-002 | Program Structure API; `program_structure`; `ProgramStructureAssigned` | UX-005; FE-TASK-037, 041 |
| FB-MVP-003 | FR-003 / SRS-FR-003 | Learning Module API; `learning_module`; module events | UX-005; FE-TASK-037–044 |
| FB-MVP-004 | FR-004 / SRS-FR-004 | Learning Design API; `learning_design`; authoring actor remains Open Issue | Backend contract; no Educator/Admin MVP UI |
| FB-MVP-005 | FR-005 / SRS-FR-005 | Learning Objective API; `learning_objective`; `LearningObjectiveCreated` | Objective context CMP-010; no authoring MVP UI |
| FB-MVP-006 | FR-006 / SRS-FR-006 | Activity APIs; Runtime-owned `activity_result`; official completion flow | UX-006; FE-TASK-045–054 |
| FB-MVP-007 | FR-007 / SRS-FR-007 | Assessment Blueprint API; `assessment_blueprint`; `AssessmentBlueprintUpdated` | Backend contract; no authoring MVP UI |
| FB-MVP-008 | FR-008 / SRS-FR-008 | Internal Assessment API; immutable `assessment_result`; Assessment Engine official events | UX-008; FE-TASK-055–059 |
| FB-MVP-009 | FR-009 / SRS-FR-009 | Learning Content API; `content_item` | UX-006/CMP-009; FE-TASK-046, 050 |
| FB-MVP-010 | FR-010 / SRS-FR-010 | Runtime State Machine; `learning_state`, `state_transition` | FSM mappings in `74_frontend_state_model.md` / FE tasks |
| FB-MVP-011 | FR-011 / SRS-FR-011 | `21_event_model.md` authority; `65_event_contracts.md`; `runtime_event` | Frontend consumes API state only and publishes no official event |
| FB-MVP-012 | FR-012 / SRS-FR-012 | Read-only Activity/Assessment Result APIs; basic progress records | UX-009; FE-TASK-060–066 |
| FB-MVP-013 | FR-012A / SRS-FR-012A | Public Landing APIs; `landing_page_config`; no official event | UX-001; FE-TASK-025–030 |
| FB-MVP-014 | FR-012B / SRS-FR-012B | AI Conversation APIs; `ai_practice_*`; Runtime/Assessment flow for Assessable Practice | UX-007/UX-008; FE-TASK-067–078, 104–108, 112 |
| FB-MVP-015 | FR-012C / SRS-FR-012C | Auth APIs; `learner_auth_account`, `auth_session`; no official event | UX-002; FE-TASK-018–024 |
| FB-MVP-016 | FR-016 / SRS-FR-016 | Existing Activity/Assessment APIs and records; no placement resource/event | UX-011/UX-008; FE-TASK-101–103, 107, 111 |

---

# 13. Architecture and Freeze-Readiness Checklist

| # | Item | Status |
| - | ---- | ------ |
| 1 | Feature breakdown uses existing SRS requirements only. | PASS |
| 2 | No new business entity introduced. | PASS |
| 3 | No new business rule introduced. | PASS |
| 4 | MVP is limited to Phase 1 features. | PASS |
| 5 | Phase 2, Phase 3, Phase 4 are separated from MVP. | PASS |
| 6 | Open Issues are not converted into MVP features. | PASS |
| 7 | `21_event_model.md` remains the sole authority for official event classification, ownership, naming, and flow; implementation mappings align through `65_event_contracts.md`. | PASS |
| 8 | Observability-only lifecycle events are not official event contracts. | PASS |
| 9 | AI does not generate Learning Decision, Knowledge Profile, or Assessment Result. | PASS |
| 10 | Database mappings use entities from `63_database_model.md`. | PASS |
| 11 | Engine mappings follow `64_engine_contracts.md`. | PASS |
| 12 | No circular dependency introduced. | PASS |
| 13 | FB-MVP-013 (Landing Page) does not introduce Enrollment, Authentication, or new domain entities. | PASS |
| 14 | FB-MVP-014 AI Layer does not generate Assessment Result, Knowledge Profile update, or Learning Decision; Assessable Practice uses Assessment Engine for official scoring. | PASS |
| 15 | FB-MVP-014 introduces no AI/frontend-owned Official Runtime Event; official completion events remain owned by documented publishers. | PASS |
| 16 | Full AI Learning Companion remains Phase 3 (FB-P3-001 s/d FB-P3-008); FB-MVP-014 is MVP-limited only. | PASS |
| 17 | Mandatory STT/TTS, learner text interaction, voice failure/text fallback, Normal/Assessable Practice, and approved evidence are covered. | PASS |
| 18 | MVP provider observability uses `ai_practice_provider_record`; Phase 3 provider request/response records are not required by MVP. | PASS |
| 19 | FB-MVP-016 models Placement Test without a new engine, entity, table, API resource, or official event. | PASS |
| 20 | Activity Result is Runtime-owned/non-evaluative; Assessment Result, Knowledge Profile, and Learning Decision retain their sole Engine owners. | PASS |
| 21 | Frontend performs no scoring or official output creation/update and publishes no Official Runtime Event. | PASS |
| 22 | Knowledge Profile and Learning Decision remain Phase 2; MVP Placement and AI Practice stop at `AssessmentResultGenerated`. | PASS |
| 23 | Every FB-MVP ID is mapped to authoritative product/SRS and implementation documentation in Section 12. | PASS |
| 24 | Suggested implementation sequence establishes generic Learning Activity and Runtime-owned Activity Result foundations before Assessment integration and Placement specialization. | PASS |

---

# Feature Breakdown Freeze Declaration

Dokumen ini dibekukan sebagai official MVP Feature Breakdown untuk Kaifa v2. Seluruh MVP feature tetap diturunkan dari frozen Product, Engineering, Event, UI/UX, dan Frontend documents tanpa mengubah architecture atau scope. Runtime tetap memiliki Activity Result persistence, orchestration, dan state transitions; Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine masing-masing tetap sole owner Assessment Result, Knowledge Profile, dan Learning Decision. Frontend hanya menggunakan documented APIs dan tidak menghasilkan official learning outputs atau Official Runtime Events. Placement Test tetap specialized assessable Learning Activity; MVP AI Conversation Practice mempertahankan mandatory STT/TTS, text interaction, Normal/Assessable paths, approved evidence boundary, dan MVP provider observability. Future changes require controlled review against authoritative frozen documents.

---

# 14. References

* `20_runtime/20_state_machine.md`
* `20_runtime/21_event_model.md`
* `50_product/52_prd.md`
* `60_engineering/60_srs.md`
* `60_engineering/61_api_design_principles.md`
* `60_engineering/62_api_spec.md`
* `60_engineering/63_database_model.md`
* `60_engineering/64_engine_contracts.md`
* `60_engineering/65_event_contracts.md`
* `70_ui_ux/70_ui_ux_spec.md`
* `70_ui_ux/71_user_flow.md`
* `70_ui_ux/72_screen_inventory.md`
* `70_ui_ux/73_component_spec.md`
* `70_ui_ux/74_frontend_state_model.md`
* `70_ui_ux/75_interaction_spec.md`
* `70_ui_ux/76_design_system.md`
* `70_ui_ux/77_frontend_implementation_plan.md`
* `80_implementation/81_frontend_mvp_task_breakdown.md`
* `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan engineering planning artifact yang diturunkan dari SRS, API Specification, Database Model, Engine Contracts, dan Event Contracts.

Perubahan terhadap dokumen ini tidak boleh mendahului perubahan pada source documents. Jika ada feature baru, entity baru, official event baru, atau ownership baru yang diperlukan, perubahan tersebut harus melalui Architecture Review terlebih dahulu.
