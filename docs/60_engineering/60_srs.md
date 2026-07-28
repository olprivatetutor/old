# Software Requirements Specification (SRS) — Kaifa v2

---

## 1. Document Information

| Field | Value |
|---|---|
| Judul Dokumen | Software Requirements Specification (SRS) — Kaifa v2 |
| Versi | 1.0 |
| Status | Release Candidate |
| Pemilik Dokumen | Product & Engineering |
| Sumber Utama | `52_prd.md` (versi 2.0, Release Candidate) |
| Sumber Arsitektur | `00_foundation/*`, `10_learning_domain/*`, `20_runtime/*`, `30_engine/*`, `40_ai/*`, `99_architecture_decisions.md` (seluruhnya berstatus Freeze) |
| Bergantung Pada | `52_prd.md`, seluruh baseline architecture Kaifa v2 |
| Digunakan Oleh | Engineering, QA, AI Team, Content Team, Operations |
| Tanggal Penyusunan | 2026-07-06 |

Dokumen ini merupakan **implementation specification**, bukan dokumen arsitektur. Dokumen ini **tidak** mendesain ulang arsitektur, **tidak** memperkenalkan business entity baru, dan **tidak** memperkenalkan business rule baru. Seluruh istilah arsitektur, nama entity, nama engine, nama dokumen, dan Architecture Decision (AD) dituliskan dalam Bahasa Inggris sesuai dokumen sumber. Narasi penjelasan dituliskan dalam Bahasa Indonesia.

---

## 2. Purpose

Dokumen SRS ini menerjemahkan `52_prd.md` yang telah disetujui (approved) menjadi spesifikasi implementasi yang dapat langsung digunakan oleh Engineering dan QA, dengan tetap tunduk penuh pada arsitektur Kaifa v2 yang telah dibekukan (frozen).

Tujuan dokumen ini:

* Menerjemahkan setiap Functional Requirement (FR) pada `52_prd.md` menjadi spesifikasi fungsional, use case, data object, validation rule, error handling, dan permission yang implementable.
* Menjaga traceability penuh antara SRS, FR pada PRD, dan Source Architecture Document.
* Tidak mengubah makna, nomor, maupun boundary FR yang telah disetujui.
* Menempatkan seluruh gap arsitektur sebagai **SRS Open Issues**, bukan sebagai solusi baru yang diciptakan oleh dokumen ini.

---

## 3. Scope

### 3.1 In Scope

* Spesifikasi implementasi untuk FR-001 s/d FR-027 serta FR-012A dan FR-012B sebagaimana didefinisikan pada `52_prd.md`.
* Detail Use Case, State Transition, Event Catalog, Data Object, Validation Rule, Error Handling, dan Permission Matrix yang bersumber dari dokumen arsitektur frozen.
* Boundary AI Layer sesuai AD-006, AD-007, AD-008, AD-009 dan `44_ai_governance.md`.
* Non-Functional Requirements yang telah tersirat pada dokumen arsitektur.

### 3.2 Out of Scope

* Redesign arsitektur Kaifa v2.
* Pendefinisian business entity atau business rule baru.
* Database schema fisik, API contract, dan UI wireframe (disebutkan pada level konseptual seperlunya untuk kejelasan implementasi, bukan sebagai spesifikasi teknis final).
* Penyelesaian gap arsitektural (Advanced Authentication, Enrollment, Analytics, Notification, Achievement, Certificate, Educator permission formal, Manual Assessment, AI Assisted Assessment di luar batas FR-012B). Seluruh gap ini dicatat sebagai **SRS Open Issues** (lihat Bagian 18).

---

## 4. System Overview

Kaifa v2 adalah **AI-Native Adaptive Learning Platform** yang dibangun di atas enam Architecture Layer:

```text
Foundation
    │
    ▼
Learning Domain
    │
    ▼
Runtime
    │
    ▼
Engine
    │
    ▼
AI Layer
    │
    ▼
Product
```

Alur inti sistem mengikuti **Canonical Learning Pipeline** (AD-005):

```text
Learning Activity
    │ produces
    ▼
Activity Result
    │ evaluated using
    ▼
Assessment Blueprint
    │ executed by
    ▼
Assessment Engine
    │ produces
    ▼
Assessment Result
    │ updates
    ▼
Knowledge Profile
    │ drives
    ▼
Learning Decision
    │ consumed by
    ▼
AI Personal Learning Agent
```

Prinsip kepemilikan tunggal (single ownership) berlaku ketat:

* **Assessment Engine** hanya mengeksekusi Assessment Blueprint; tidak memiliki business rule evaluasi.
* **Recommendation Engine** adalah satu-satunya pemilik (sole owner) Learning Decision.
* **Knowledge Profile Engine** adalah satu-satunya pemilik (sole owner) Knowledge Profile.
* **AI Layer** adalah experience layer, bukan decision layer; AI tidak boleh menghasilkan Learning Decision, tidak boleh memperbarui Knowledge Profile, dan tidak boleh menghasilkan Assessment Result resmi. AI Conversation Practice dapat menyediakan Activity Result atau approved assessment evidence untuk Assessment Engine, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain yang didukung, tetapi official Assessment Result tetap dihasilkan oleh Assessment Engine. AI Conversation Experience bukan Learning Content.

SRS ini disusun mengikuti empat fase Roadmap sebagaimana pada PRD: **MVP (Phase 1 — Foundation Platform)**, **Phase 2 (Adaptive Learning)**, **Phase 3 (AI Learning Companion)**, dan **Phase 4 (Educator Platform)**.

---

## 5. Architecture Compliance Rules

Aturan berikut mengikat seluruh spesifikasi pada dokumen ini dan tidak dapat diinterpretasikan ulang oleh tim implementasi:

1. **Domain Owns Business Rules (AD-002).** Seluruh business rule pembelajaran hanya boleh diimplementasikan pada Learning Domain. Runtime, Engine, dan AI Layer dilarang mendefinisikan business rule baru.
2. **Runtime Is Event-Driven (AD-003).** Koordinasi antar komponen wajib melalui State Machine dan Event Model; Engine tidak boleh saling memanggil secara langsung.
3. **Assessment Blueprint and Assessment Engine Are Separate (AD-004).** Assessment Engine hanya mengeksekusi Assessment Blueprint, tidak memiliki aturan evaluasi.
4. **Canonical Learning Pipeline (AD-005)** wajib dipertahankan pada seluruh implementasi; istilah "Learning Evidence" tidak digunakan lagi dan digantikan oleh Activity Result/Assessment Result.
5. **AI Does Not Make Learning Decisions (AD-006).** Learning Decision hanya dihasilkan oleh Recommendation Engine. AI hanya mengonsumsi (read-only) Learning Decision.
6. **Knowledge Profile Is Not AI Memory (AD-007).** Knowledge Profile dan AI Memory adalah dua struktur data yang terpisah secara tegas. AI Memory tidak pernah menjadi sumber kebenaran Knowledge Profile.
7. **AI Provider Agnostic (AD-008).** Seluruh integrasi AI wajib melalui AI Provider Gateway; tidak ada komponen yang boleh terhubung langsung ke provider tertentu.
8. **AI as Experience Layer (AD-009).** AI berada di atas Engine sebagai experience layer. Kegagalan AI Provider tidak boleh menghentikan Canonical Learning Pipeline (Graceful Degradation).
9. **Documentation as Single Source of Truth (AD-010).** Setiap domain memiliki satu dokumen resmi; SRS ini tidak menggantikan dokumen arsitektur manapun, hanya menerjemahkannya menjadi spesifikasi implementasi.
10. Setiap SRS Requirement wajib memiliki traceability ke FR ID PRD, Source Architecture Document, Architecture Layer, dan Related Architecture Decision (jika ada). Requirement tanpa traceability tidak boleh diimplementasikan.
11. Requirement yang bergantung pada Open Issue arsitektur tidak boleh diberi solusi baru oleh SRS ini; requirement tersebut wajib dicatat pada Bagian 18 — SRS Open Issues.

---

## 6. Actor & Role Matrix

| Actor | Deskripsi | Sumber | Status |
|---|---|---|---|
| Learner | Aktor sentral yang menjalankan Canonical Learning Pipeline (Learning Activity, Assessment, menerima Learning Decision, berinteraksi dengan AI Personal Learning Agent). | `50_user_journey.md`, `52_prd.md` | Didefinisikan sebagai persona; identitas/Authentication belum diatur arsitektur (lihat Open Issue #2). |
| Educator | Aktor yang memantau progres Learner (FR-026) dan melakukan Class Management/Assignment Review (FR-027). | `50_user_journey.md`, `02_glossary.md` | Disebut sebagai persona; belum menjadi entitas/domain formal (lihat Open Issue #6). |
| AI Personal Learning Agent | Orchestrator AI yang menyusun AI Context dan menghasilkan AI Conversation Experience. Bukan aktor manusia, melainkan komponen AI Layer yang berinteraksi dengan Learner. | `43_ai_personal_learning_agent.md` | Frozen. |
| Assessment Engine | Komponen Engine yang mengeksekusi Assessment Blueprint. | `30_assessment_engine.md` | Frozen. |
| Knowledge Profile Engine | Komponen Engine yang membangun dan memperbarui Knowledge Profile. Sole owner Knowledge Profile. | `31_knowledge_profile_engine.md` | Frozen. |
| Recommendation Engine | Komponen Engine yang menghasilkan Learning Decision. Sole owner Learning Decision. | `32_recommendation_engine.md` | Frozen. |
| Analytics (consumer) | Konsumen metadata dari Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine. | `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` | Disebut sebagai consumer; belum ada dokumen kepemilikan (lihat Open Issue #3). |
| Operations | Memantau Observability, menjaga Availability sistem inti, menangani eskalasi Failure Handling Engine dan AI Provider. | `52_prd.md` Bagian 6 | Working responsibility, bukan entitas domain baru. |

> Catatan: Matriks ini hanya mendeskripsikan tanggung jawab kerja (working responsibility). Tidak ada ownership bisnis baru yang diciptakan di luar Document Ownership yang telah ditetapkan pada setiap dokumen arsitektur.
> Catatan MVP: Learner actor berlaku lintas seluruh roadmap Kaifa. Pada MVP, Learner menerima Placement starting point suggestion dan Assessment Result. Full Learning Decision tetap Phase 2 dan tidak boleh diinterpretasikan sebagai scope MVP.

---

## 7. Functional Specification by FR

Format setiap entri: **SRS-FR-xxx**, **Requirement (Bahasa Indonesia)**, **Source PRD FR ID**, **Source Architecture Document**, **Architecture Layer**, **Related Architecture Decision**.

### Phase 1 — MVP (Foundation Platform)

**SRS-FR-001 — Definisi dan Pengelolaan Learning Program**
Sistem harus menyediakan kemampuan create/read/update untuk Learning Program dengan identitas unik, Program Type (Curriculum, Certification, Language, Book, Free Learning, Custom), dan lifecycle status (Draft → Published → Archived). Hanya Learning Program berstatus Published yang boleh digunakan untuk proses enrollment baru.
Source PRD FR ID: FR-001 · Source Architecture Document: `10_learning_program.md` · Architecture Layer: Learning Domain · Related AD: AD-002

**SRS-FR-002 — Penetapan Program Structure**
Sistem harus memvalidasi bahwa setiap Learning Program memiliki tepat satu Program Structure dari enam tipe resmi (Curriculum, CEFR, Book, Certification, Free Learning, Custom Structure). Penyimpanan Learning Program tanpa Program Structure harus ditolak.
Source PRD FR ID: FR-002 · Source Architecture Document: `11_program_structure.md`, `10_learning_program.md` · Architecture Layer: Learning Domain · Related AD: AD-002

**SRS-FR-003 — Pengelolaan Learning Module**
Sistem harus menyediakan create/read/update untuk Learning Module yang tervalidasi berada pada tepat satu Program Structure dan memiliki tepat satu Learning Design terkait, dengan lifecycle Draft → Published → Archived.
Source PRD FR ID: FR-003 · Source Architecture Document: `13_learning_module.md` · Architecture Layer: Learning Domain · Related AD: AD-002

**SRS-FR-004 — Pengelolaan Learning Design**
Sistem harus menyediakan create/read/update untuk Learning Design sebagai blueprint pedagogis yang wajib memiliki minimal satu Learning Objective, serta atribut opsional Prerequisite Rule dan Completion Rule.
Source PRD FR ID: FR-004 · Source Architecture Document: `12_learning_design.md` · Architecture Layer: Learning Domain · Related AD: AD-002

**SRS-FR-005 — Pengelolaan Learning Objective**
Sistem harus menyediakan create/read/update untuk Learning Objective dengan Objective Statement, klasifikasi (Knowledge/Understanding/Application/Analysis/Evaluation/Creation), dan Mastery Criteria, terhubung ke tepat satu Learning Design.
Source PRD FR ID: FR-005 · Source Architecture Document: `14_learning_objective.md` · Architecture Layer: Learning Domain · Related AD: AD-002

**SRS-FR-006 — Pelaksanaan Learning Activity dan Activity Result**
Sistem harus memungkinkan Learner menjalankan Learning Activity (Reading, Watching, Listening, Discussion, Practice, Exercise, Assignment, Project, Experiment, Reflection) sesuai Completion Criteria, dan mencatat Activity Result sebagai keluaran langsung sebelum dievaluasi.
Source PRD FR ID: FR-006 · Source Architecture Document: `15_learning_activity.md` · Architecture Layer: Learning Domain · Related AD: AD-002, AD-005

**SRS-FR-007 — Definisi Assessment Blueprint**
Sistem harus menyediakan create/read/update untuk Assessment Blueprint yang mendefinisikan Assessment Strategy (Quiz, Assignment, Project, Portfolio, Observation, Speaking, Writing, Practical, Peer Review, AI Assisted — dengan batasan pada SRS-FR-023 dan Open Issue #8), Evaluation Criteria, dan Mastery Criteria.
Source PRD FR ID: FR-007 · Source Architecture Document: `16_assessment_blueprint.md` · Architecture Layer: Learning Domain · Related AD: AD-002, AD-004

**SRS-FR-008 — Eksekusi Evaluasi oleh Assessment Engine**
Sistem harus mengeksekusi Processing Flow Assessment Engine (resolve Assessment Blueprint → validate Activity Result → execute assessment → generate Assessment Result → publish event) secara stateless dan deterministik. Assessment Engine tidak boleh mendefinisikan aturan evaluasi baru.
Source PRD FR ID: FR-008 · Source Architecture Document: `30_assessment_engine.md` · Architecture Layer: Engine · Related AD: AD-004

**SRS-FR-009 — Content Delivery melalui Content Model**
Sistem harus menyediakan Learning Content (Article, Video, Audio, Interactive, Assessment Resource, Document, External Resource) dengan metadata minimum (Content ID, Title, Description, Type, Language, Difficulty, Estimated Duration, Version, Status) dan lifecycle Draft → Published → Archived. Hanya Learning Content berstatus Published yang dapat digunakan Learning Activity.
Source PRD FR ID: FR-009 · Source Architecture Document: `22_content_model.md` · Architecture Layer: Runtime · Related AD: AD-001

**SRS-FR-010 — State Machine Pembelajaran**
Sistem harus mempertahankan canonical full State Machine: Not Started → Learning → Assessing → Updating Knowledge Profile → Generating Learning Decision → Ready for Next Activity → Completed, dengan transisi hanya dipicu oleh event valid (Event-Driven Transition), bersifat Single Active State dan Deterministic. State `Updating Knowledge Profile` dan `Generating Learning Decision` adalah Phase 2 states. Pada MVP, setelah `AssessmentResultGenerated`, Assessment Result tersedia bagi application/UI dan Runtime dapat menuju state resmi `Completed` bila applicable; availability tersebut bukan State Machine state. MVP tidak memasuki kedua state Phase 2 tersebut, tidak menghitung Knowledge Profile, dan tidak menghasilkan adaptive Learning Decision. Placement starting point suggestion bukan Learning Decision, dan basic learner progress tracking bukan Knowledge Profile computation.
Source PRD FR ID: FR-010 · Source Architecture Document: `20_state_machine.md` · Architecture Layer: Runtime · Related AD: AD-003

**SRS-FR-011 — Event-Driven Coordination**
Sistem harus mempublikasikan Domain Event dan Engine Event sesuai naming convention `<Entity><Past Tense>`, dengan tepat satu publisher resmi per event, dan event bersifat immutable setelah dipublikasikan.
Source PRD FR ID: FR-011 · Source Architecture Document: `21_event_model.md` · Architecture Layer: Runtime · Related AD: AD-003

**SRS-FR-012 — Dashboard Progres Dasar**
Sistem harus menampilkan Activity Result, Assessment Result, dan informasi progres dasar kepada Learner berdasarkan State Machine untuk learner experience dan reporting MVP. Pencatatan atau penyajian ini bukan Knowledge Profile Engine, tidak memelihara competency mastery modeling, dan tidak menghasilkan adaptive Learning Decision; Knowledge Profile Engine dan Recommendation Engine tetap Phase 2.
Source PRD FR ID: FR-012 · Source Architecture Document: `20_state_machine.md`, `15_learning_activity.md`, `30_assessment_engine.md` · Architecture Layer: Runtime, Learning Domain, Engine · Related AD: AD-003

**SRS-FR-012A — Public Landing Page**
Sistem harus menyediakan Public Landing Page yang dapat diakses tanpa autentikasi, bersifat informatif sebagai product entry page, tanpa membuat Enrollment, tanpa memicu Canonical Learning Pipeline, dan tanpa mengekspos data Learner.
Source PRD FR ID: FR-012A · Source Architecture Document: `50_user_journey.md`, `51_roadmap.md` · Architecture Layer: Product · Related AD: AD-002

**SRS-FR-012B — AI Conversation Practice for Learning Objective**
Sistem harus memungkinkan Learner menjalankan AI Conversation Practice sebagai mode dari Learning Activity type `Practice` yang ditautkan ke satu Learning Objective, didukung oleh AI Practice Partner menggunakan Published Learning Content sebagai konteks di mana berlaku. MVP AI Conversation Practice harus mendukung text interaction serta kapabilitas voice wajib: Speech-to-Text (STT) untuk input suara dan Text-to-Speech (TTS) untuk output suara. Canonical target-language transcript adalah official conversation record. Untuk percakapan Arabic, conversation text harus ditampilkan dalam Arabic script dan area percakapan harus mendukung RTL layout di mana berlaku. Learner dapat menyalakan Indonesian translation untuk pesan AI dan Learner, serta melihat optional transliteration jika dibutuhkan. Translation dan transliteration adalah learner support aids saja, bukan official assessment source.

AI Conversation Practice dapat diselesaikan sebagai assessable Learning Activity. Official Assessment Result hanya boleh dihasilkan oleh Assessment Engine menggunakan Assessment Blueprint dan Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain. AI tidak boleh membuat, memodifikasi, atau memiliki Assessment Result; tidak boleh memperbarui Knowledge Profile; tidak boleh menghasilkan Learning Decision; tidak boleh membuat atau mengubah official Learning Content; dan tidak boleh mempublikasikan Official Runtime Event secara langsung. AI Conversation Practice adalah MVP-limited AI capability, bukan Full AI Learning Companion (Full AI Learning Companion tetap Phase 3, SRS-FR-018 s/d SRS-FR-025). Seluruh interaksi dicatat sebagai audit/observability record, bukan official Runtime Event.
Source PRD FR ID: FR-012B · Source Architecture Document: `15_learning_activity.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md` · Architecture Layer: Learning Domain, AI Layer · Related AD: AD-002, AD-006, AD-007, AD-008, AD-009

**SRS-FR-016 — Placement Test**
Sistem harus mendukung Placement Test pada MVP sebagai specialized assessable Learning Activity, bukan entitas domain baru. Placement Test harus menghasilkan Activity Result, dievaluasi melalui Assessment Blueprint dan Assessment Engine, dan menghasilkan official Assessment Result melalui Assessment Engine. Placement result dapat menentukan atau menyarankan Learner starting point pada MVP. Starting point suggestion bukan Learning Decision, tidak boleh disebut sebagai Learning Decision, dan tidak boleh memanggil Recommendation Engine pada MVP. Full adaptive Learning Decision dan Recommendation Engine tetap Phase 2.
Source PRD FR ID: FR-016 · Source Architecture Document: `50_user_journey.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md` · Architecture Layer: Product, Learning Domain, Engine · Related AD: AD-005

**SRS-FR-012C — MVP Basic Learner Authentication**
Sistem harus menyediakan MVP Basic Learner Authentication agar minimal dua Learner dapat login dan menggunakan learning flow MVP dengan data Learner yang terpisah. Sistem harus mendukung login, logout, dan identifikasi Learner aktif. Learner context aktif harus dapat digunakan oleh: Learning Activity execution, AI Conversation Practice, dan Basic Learner Progress Dashboard. MVP Basic Learner Authentication tidak mendefinisikan Enrollment, tidak mendefinisikan advanced identity architecture, tidak memicu Canonical Learning Pipeline, tidak mempublikasikan official Runtime Event, tidak memperkenalkan Educator permission, dan tidak memperkenalkan Role Management di luar kebutuhan minimal Learner actor. Advanced Authentication (public signup, OAuth/SSO/MFA, Educator account, role management, enterprise identity) tetap merupakan Open Issue / Future Scope.
Source PRD FR ID: FR-012C · Source Architecture Document: `50_user_journey.md`, `51_roadmap.md` · Architecture Layer: Product / Application Layer · Related AD: AD-002

### Phase 2 — Adaptive Learning

**SRS-FR-013 — Pembentukan dan Pembaruan Knowledge Profile**
Sistem harus menjalankan Processing Flow Knowledge Profile Engine (load profile → validate Assessment Result → update → persist → publish event) secara incremental dan deterministic. Knowledge Profile Engine adalah satu-satunya pemilik (sole owner) Knowledge Profile.
Source PRD FR ID: FR-013 · Source Architecture Document: `31_knowledge_profile_engine.md` · Architecture Layer: Engine · Related AD: AD-002, AD-007

**SRS-FR-014 — Penghasilan Learning Decision oleh Recommendation Engine**
Sistem harus menghasilkan tepat satu Learning Decision per siklus evaluasi (salah satu dari: Next Module, Review Module, Repeat Activity, Take Assessment, Continue Learning, Complete Module, Complete Program) berdasarkan Knowledge Profile, Learning Design, Learning Context, dan Program Context, secara deterministik dan explainable. Recommendation Engine adalah satu-satunya pemilik (sole owner) Learning Decision.
Source PRD FR ID: FR-014 · Source Architecture Document: `32_recommendation_engine.md` · Architecture Layer: Engine · Related AD: AD-006

**SRS-FR-015 — Alur Pembelajaran Adaptif End-to-End**
Sistem harus mengeksekusi seluruh tahap Canonical Learning Pipeline (Learning Activity → Activity Result → Assessment Blueprint → Assessment Engine → Assessment Result → Knowledge Profile → Learning Decision) tanpa intervensi manual dan tanpa keterlibatan AI Layer pada Phase 2.
Source PRD FR ID: FR-015 · Source Architecture Document: `00_overview.md`, `02_glossary.md`, `99_architecture_decisions.md` · Architecture Layer: Learning Domain, Runtime, Engine · Related AD: AD-005

**SRS-FR-017 — Progress Analytics Dasar**
Sistem harus menyediakan Profile Metadata, Evaluation Metadata, dan Recommendation Metadata untuk dikonsumsi pihak Analytics tanpa memodifikasi Knowledge Profile, Assessment Result, atau Learning Decision resmi.
Source PRD FR ID: FR-017 · Source Architecture Document: `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` · Architecture Layer: Engine · Related AD: AD-004
> Catatan: kepemilikan formal Analytics adalah Open Issue (lihat Bagian 18, Open Issue #3).

### Phase 3 — AI Learning Companion

Seluruh SRS-FR pada bagian ini wajib tunduk pada AD-006, AD-007, AD-008, AD-009 dan `44_ai_governance.md` (lihat Bagian 16 — AI Requirements & Boundaries).

**SRS-FR-018 — AI Personal Learning Agent sebagai Orchestrator**
Sistem harus menyediakan AI Personal Learning Agent yang menyusun AI Context dari Learning Decision, Knowledge Profile, Learning Content, AI Memory, Conversation Context, dan Learning Context, kemudian menghasilkan AI Conversation Experience. Agent tidak boleh menghasilkan Learning Decision, Assessment Result, atau Knowledge Profile baru dalam bentuk apa pun.
Source PRD FR ID: FR-018 · Source Architecture Document: `43_ai_personal_learning_agent.md`, `40_ai_architecture.md` · Architecture Layer: AI Layer · Related AD: AD-009, AD-006

**SRS-FR-019 — AI Menjelaskan Learning Decision (Bukan Membuat Keputusan)**
AI Personal Learning Agent harus menjelaskan Learning Decision resmi yang sedang berlaku dalam bahasa natural tanpa mengubah isinya. Respons AI yang bertentangan dengan Learning Decision aktif wajib ditolak atau ditandai oleh AI Governance sebelum disampaikan ke Learner.
Source PRD FR ID: FR-019 · Source Architecture Document: `43_ai_personal_learning_agent.md`, `40_ai_architecture.md`, `44_ai_governance.md` · Architecture Layer: AI Layer · Related AD: AD-006

**SRS-FR-020 — AI Memory Terpisah dari Knowledge Profile**
Sistem harus menyimpan Session/Short-Term/Long-Term/Episodic/Semantic Memory pada struktur data AI Memory yang secara tegas terpisah dari Knowledge Profile. Retrieval AI Memory tidak boleh menimpa atau mengubah nilai Knowledge Profile. Learner dapat melihat dan menghapus AI Memory miliknya sesuai kebijakan governance.
Source PRD FR ID: FR-020 · Source Architecture Document: `42_ai_memory.md` · Architecture Layer: AI Layer · Related AD: AD-007

**SRS-FR-021 — Integrasi AI Provider melalui AI Provider Gateway**
Seluruh pemanggilan AI Provider wajib melalui AI Provider Gateway (Provider Adapter, Provider Selection Strategy, Fallback Strategy). Tidak boleh ada modul yang memanggil AI Provider secara langsung.
Source PRD FR ID: FR-021 · Source Architecture Document: `41_ai_provider_integration.md` · Architecture Layer: AI Layer · Related AD: AD-008

**SRS-FR-022 — Graceful Degradation saat AI Tidak Tersedia**
Apabila AI Provider gagal/tidak tersedia, Learning Decision tetap dapat diakses dan proses inti (Learning Activity, Assessment, Knowledge Profile Update) tetap berjalan tanpa AI, dengan indikasi fallback non-AI yang jelas kepada Learner.
Source PRD FR ID: FR-022 · Source Architecture Document: `40_ai_architecture.md`, `41_ai_provider_integration.md` · Architecture Layer: AI Layer · Related AD: AD-009

**SRS-FR-023 — AI Governance sebagai Kontrol Wajib**
Setiap permintaan capability AI wajib diperiksa terhadap AI Authority Matrix sebelum dieksekusi. Permintaan yang melanggar boundary (mis. mengubah Assessment Result atau Knowledge Profile) wajib ditolak. Setiap interaksi AI wajib dicatat pada log audit minimum (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error).
Source PRD FR ID: FR-023 · Source Architecture Document: `44_ai_governance.md` · Architecture Layer: AI Layer · Related AD: AD-006, AD-007, AD-008, AD-009

**SRS-FR-024 — Kapabilitas AI: Tutor, Coach, Practice Partner, Explanation, Reflection, Socratic, Feedback Support**
AI Personal Learning Agent harus mendukung kapabilitas Tutor, Coach, Practice Partner, Explanation, Reflection, Socratic, dan Feedback Support tanpa mengubah Learning Decision, Assessment Result, Knowledge Profile, atau Learning Content resmi.
Source PRD FR ID: FR-024 · Source Architecture Document: `43_ai_personal_learning_agent.md` · Architecture Layer: AI Layer · Related AD: AD-006, AD-009

**SRS-FR-025 — AI Menggunakan Learning Content sebagai Konteks (Bukan Sumber Kebenaran)**
AI dapat mengutip dan menjelaskan Learning Content berstatus Published untuk memberi contoh dan latihan sementara, tetapi tidak boleh menulis atau mengubah Learning Content resmi melalui interaksi percakapan apa pun.
Source PRD FR ID: FR-025 · Source Architecture Document: `22_content_model.md`, `40_ai_architecture.md` · Architecture Layer: AI Layer, Runtime · Related AD: AD-009

### Phase 4 — Educator Platform

**SRS-FR-026 — Learner Monitoring oleh Educator**
Sistem harus memungkinkan Educator melihat state pembelajaran, Knowledge Profile, dan Learning Decision milik Learner yang berada dalam kewenangannya, bersumber langsung dari State Machine, Knowledge Profile Engine, dan Recommendation Engine tanpa duplikasi atau kalkulasi baru.
Source PRD FR ID: FR-026 · Source Architecture Document: `50_user_journey.md`, `20_state_machine.md`, `31_knowledge_profile_engine.md` · Architecture Layer: Product, Runtime, Engine · Related AD: AD-002
> Catatan: mekanisme otorisasi akses Educator adalah Open Issue (lihat Bagian 18, Open Issue #6).

**SRS-FR-027 — Class Management dan Assignment Review**
Sistem harus mendukung pengelolaan kelas dan peninjauan tugas oleh Educator sedemikian rupa sehingga review tugas tidak menghasilkan Assessment Result baru di luar jalur resmi Assessment Engine.
Source PRD FR ID: FR-027 · Source Architecture Document: `51_roadmap.md` · Architecture Layer: Product · Related AD: —
> Catatan: Class, Assignment Review, dan Manual Assessment belum terdefinisi sebagai entitas/alur resmi. Ditempatkan sebagai Open Issue (lihat Bagian 18, Open Issue #7).

---

## 8. Detailed Use Cases

### UC-01 — Learner Menyelesaikan Learning Activity dan Menerima Assessment Result
**Trace:** SRS-FR-006, SRS-FR-008, SRS-FR-010, SRS-FR-011 (FR-006, FR-008, FR-010, FR-011)

* **Actor:** Learner
* **Precondition:** State pembelajaran berada pada `Learning`; Learning Activity dan Assessment Blueprint terkait berstatus valid.
* **Main Flow:**
  1. Learner memulai Learning Activity sesuai Completion Criteria.
  2. Learner menyelesaikan Learning Activity; sistem mencatat Activity Result.
  3. Event `LearningActivityCompleted` dipublikasikan, diikuti `ActivityResultGenerated`.
  4. State bertransisi ke `Assessing`.
  5. Assessment Engine me-resolve Assessment Blueprint yang berlaku, memvalidasi Activity Result, mengeksekusi evaluasi, dan menghasilkan Assessment Result.
  6. Event `AssessmentCompleted` dan `AssessmentResultGenerated` dipublikasikan.
* **Postcondition:** Assessment Result tersimpan; state siap bertransisi ke `Updating Knowledge Profile` (lihat UC-02, Phase 2).
* **Alternate Flow:** Activity Result tidak valid → Assessment Engine menolak input secara graceful (lihat Bagian 13 — Error Handling Matrix).

### UC-02 — Pembaruan Knowledge Profile dan Penghasilan Learning Decision
**Trace:** SRS-FR-013, SRS-FR-014, SRS-FR-015 (FR-013, FR-014, FR-015)

* **Actor:** Sistem (Knowledge Profile Engine, Recommendation Engine)
* **Precondition:** Assessment Result valid telah dipublikasikan (event `AssessmentResultGenerated`).
* **Main Flow:**
  1. State bertransisi ke `Updating Knowledge Profile`.
  2. Knowledge Profile Engine memuat Knowledge Profile Learner, memvalidasi Assessment Result, memperbarui profil secara incremental, dan mempersist perubahan.
  3. Event `KnowledgeProfileUpdated` dipublikasikan.
  4. State bertransisi ke `Generating Learning Decision`.
  5. Recommendation Engine memuat Learning Design, menganalisis Learning Context dan Program Context, lalu menghasilkan tepat satu Learning Decision.
  6. Event `LearningDecisionGenerated` dipublikasikan.
* **Postcondition:** State bertransisi ke `Ready for Next Activity`; jika masih ada aktivitas berikutnya, sistem kembali ke `Learning`, jika tidak, ke `Completed`.
* **Alternate Flow:** Assessment Result tidak valid, Knowledge Profile tidak ditemukan, atau Learning Design tidak ditemukan → event kegagalan dipublikasikan (lihat Bagian 13).

### UC-03 — Placement Test
**Trace:** SRS-FR-016 (FR-016)

* **Actor:** Learner
* **Precondition:** Learner menjalankan Placement Test sebagai specialized assessable Learning Activity awal pada MVP.
* **Main Flow:**
  1. Sistem menjalankan Placement Test sebagai Learning Activity, bukan entitas domain baru.
  2. Penyelesaian Placement Test menghasilkan Activity Result.
  3. Assessment Engine mengevaluasi Activity Result menggunakan Assessment Blueprint yang sesuai.
  4. Assessment Engine menghasilkan official Assessment Result.
  5. Sistem menentukan atau menyarankan Learner starting point berdasarkan Assessment Result.
* **Postcondition:** Placement Test Assessment Result tersimpan; Learner starting point suggestion tersedia untuk MVP. Suggestion ini bukan Learning Decision dan tidak memanggil Recommendation Engine. Knowledge Profile update dan Learning Decision tetap mengikuti Phase 2 capability.

### UC-04 — Percakapan dengan AI Personal Learning Agent
**Trace:** SRS-FR-018, SRS-FR-019, SRS-FR-023, SRS-FR-024, SRS-FR-025 (FR-018, FR-019, FR-023, FR-024, FR-025)

* **Actor:** Learner, AI Personal Learning Agent
* **Precondition:** Learning Decision aktif tersedia dari Recommendation Engine.
* **Main Flow:**
  1. Learner memulai percakapan dengan AI Personal Learning Agent.
  2. Agent menyusun AI Context berdasarkan AI Context Hierarchy: Learning Decision → Knowledge Profile → Learning Content → Conversation Context → AI Memory.
  3. Agent memeriksa permintaan terhadap AI Authority Matrix (`44_ai_governance.md`).
  4. Agent memanggil AI Provider melalui AI Provider Gateway (lihat UC-05).
  5. Agent menghasilkan AI Conversation Experience yang menjelaskan Learning Decision dan/atau Learning Content, tanpa mengubah data resmi.
  6. Interaksi dicatat pada log audit (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error).
* **Postcondition:** AI Conversation Experience disampaikan ke Learner; tidak ada perubahan pada Learning Decision, Knowledge Profile, Assessment Result, atau Learning Content resmi.
* **Alternate Flow:** Permintaan melanggar AI Authority Matrix → Agent menolak atau menandai respons sebelum disampaikan (Governance Violation, lihat Bagian 13).

### UC-05 — Graceful Degradation saat AI Provider Gagal
**Trace:** SRS-FR-021, SRS-FR-022 (FR-021, FR-022)

* **Actor:** AI Provider Gateway, Sistem
* **Precondition:** AI Personal Learning Agent mencoba memanggil AI Provider melalui AI Provider Gateway.
* **Main Flow:**
  1. AI Provider Gateway mendeteksi kegagalan provider utama.
  2. Fallback Strategy diaktifkan; Gateway mencoba provider cadangan.
  3. Jika seluruh provider gagal, sistem menampilkan indikasi fallback non-AI yang jelas kepada Learner.
  4. Learning Decision dari Recommendation Engine tetap ditampilkan; Learning Activity, Assessment, dan Knowledge Profile Update tetap berjalan tanpa AI.
* **Postcondition:** Canonical Learning Pipeline tidak terhenti meskipun AI tidak tersedia.

### UC-06 — Educator Memantau Progres Learner
**Trace:** SRS-FR-026 (FR-026) — bergantung pada Open Issue #6

* **Actor:** Educator
* **Precondition:** Educator memiliki kewenangan atas Learner tertentu (mekanisme otorisasi: **Open Issue**).
* **Main Flow:**
  1. Educator mengakses data Learner.
  2. Sistem menyajikan state pembelajaran (State Machine), Knowledge Profile (Knowledge Profile Engine), dan Learning Decision (Recommendation Engine) tanpa duplikasi atau kalkulasi baru.
* **Postcondition:** Educator memperoleh gambaran progres Learner berbasis data resmi.
* **Catatan:** Detail mekanisme otorisasi akses tidak dapat dispesifikasikan lebih lanjut sampai Architecture Review menyelesaikan Open Issue #6.

### UC-07 — Learner Menjalankan AI Conversation Practice
**Trace:** SRS-FR-012B (FR-012B)

* **Actor:** Learner, AI Practice Partner
* **Precondition:** Learning Activity type `Practice` tersedia dan terhubung ke satu Learning Objective; Learning Content terkait berstatus Published (opsional, sebagai konteks AI).
* **Main Flow:**
  1. Learner memulai AI Conversation Practice pada Learning Activity type Practice.
  2. Sistem menyiapkan conversation context: referensi Learning Objective, referensi Learning Content yang berlaku (opsional), target language, dan identitas Learner.
  3. AI Practice Partner (melalui AI Provider Gateway) menyusun prompt berdasarkan context tersebut.
  4. Learner dan AI Practice Partner dapat berinteraksi menggunakan text atau kapabilitas voice wajib STT/TTS. UI/flow voice mendokumentasikan recording state, processing state, playback state, permission failure state, dan retry state; kegagalan pada state tersebut tidak menghasilkan Assessment Result, Knowledge Profile update, atau Learning Decision.
  5. Sistem menyimpan canonical target-language transcript sebagai official conversation record. Untuk Arabic, conversation text ditampilkan dalam Arabic script dan conversation area mendukung RTL layout di mana berlaku.
  6. Learner dapat menyalakan Indonesian translation dan optional transliteration sebagai support aids; keduanya tidak menjadi official assessment source.
  7. AI Practice Partner menghasilkan conversation response, feedback text, practice guidance, dan evidence candidates yang dapat membentuk Activity Result atau approved assessment evidence. Evidence dapat mencakup canonical transcript, completion data, pronunciation-related metadata, atau activity evidence lain yang didukung.
  8. Setiap interaksi dicatat sebagai audit/observability record.
  9. Learner mengakhiri sesi; sesi disimpan sebagai AI Practice Conversation/message record sesuai model implementasi.
  10. Jika conversation adalah assessable Learning Activity, Activity Result atau approved assessment evidence yang didukung dikirim oleh Runtime ke Assessment Engine bersama Assessment Blueprint.
  11. Assessment Engine menghasilkan official Assessment Result menggunakan Assessment Blueprint.
* **Postcondition:** Sesi percakapan tersimpan; official Assessment Result hanya ada jika Assessment Engine mengeksekusi Assessment Blueprint untuk assessable conversation. AI tidak menghasilkan Assessment Result, tidak memperbarui Knowledge Profile, tidak menghasilkan Learning Decision, dan tidak mempublikasikan Official Runtime Event baru.
* **Alternate Flow:** AI Provider gagal → Graceful Degradation (AD-009); Learner diinformasikan bahwa AI tidak tersedia; Learning Activity tetap dapat dilanjutkan melalui jalur non-AI. Jika permission voice ditolak, recording/processing/playback gagal, atau retry diperlukan, sistem menampilkan state yang sesuai dan memungkinkan retry; kapabilitas STT/TTS tetap wajib tersedia pada MVP.
* **AI Boundary yang berlaku:** AI Authority Matrix (`44_ai_governance.md`) tetap wajib — AI tidak boleh membuat, memodifikasi, atau memiliki Assessment Result; tidak boleh memperbarui Knowledge Profile; tidak boleh menghasilkan Learning Decision; tidak boleh membuat/mengubah official Learning Content; dan translation/transliteration tidak boleh menjadi source of official assessment.

---

## 9. State Transition Table

**Source Architecture Document:** `20_state_machine.md` · **Architecture Layer:** Runtime · **Related AD:** AD-003 · **Trace:** SRS-FR-010 (FR-010)

| # | State Asal | Event Pemicu | State Tujuan | Owner State Tujuan |
|---|---|---|---|---|
| 1 | Not Started | Learner memulai Learning Activity | Learning | Runtime |
| 2 | Learning | `LearningActivityCompleted` → `ActivityResultGenerated` | Assessing | Assessment Engine |
| 3 | Assessing | `AssessmentCompleted` → `AssessmentResultGenerated` | Updating Knowledge Profile | Knowledge Profile Engine |
| 4 | Updating Knowledge Profile | `KnowledgeProfileUpdated` | Generating Learning Decision | Recommendation Engine |
| 5 | Generating Learning Decision | `LearningDecisionGenerated` | Ready for Next Activity | Runtime |
| 6 | Ready for Next Activity | Masih terdapat aktivitas berikutnya | Learning | Runtime |
| 7 | Ready for Next Activity | Seluruh aktivitas telah selesai | Completed | Runtime |

Prinsip yang wajib dipenuhi implementasi: **Single Active State**, **Event Driven Transition**, **Deterministic** (state + event yang sama menghasilkan transisi yang sama), dan **Observable**.

> Catatan MVP: Tabel ini merefleksikan canonical full State Machine. Setelah `AssessmentResultGenerated`, Assessment Result tersedia bagi application/UI untuk learner experience dan reporting; availability tersebut bukan State Machine state, dan Runtime dapat menuju state resmi `Completed` bila applicable. MVP tidak memasuki `Updating Knowledge Profile` atau `Generating Learning Decision`. Knowledge Profile Engine dan Recommendation Engine tetap Phase 2. Placement starting point suggestion bukan Learning Decision, dan basic learner progress tracking bukan Knowledge Profile computation.

---

## 10. Event Catalog

**Source Architecture Document:** `21_event_model.md` · **Architecture Layer:** Runtime · **Related AD:** AD-003 · **Trace:** SRS-FR-011 (FR-011)

Naming convention: `<Entity><Past Tense>`. Setiap event memiliki tepat satu publisher resmi dan bersifat immutable.

### Domain Events

| Event | Publisher | Trace FR |
|---|---|---|
| LearningProgramCreated | Learning Program | FR-001 |
| LearningProgramUpdated | Learning Program | FR-001 |
| LearningProgramPublished | Learning Program | FR-001 |
| LearningProgramArchived | Learning Program | FR-001 |
| ProgramStructureAssigned | Program Structure | FR-002 |
| LearningModuleCreated / Updated / Published / Archived | Learning Module | FR-003 |
| LearningDesignCreated / Updated | Learning Design | FR-004 |
| LearningObjectiveCreated / Updated / Archived | Learning Objective | FR-005 |
| LearningActivityCompleted | Learning Activity | FR-006 |
| ActivityResultGenerated | Learning Activity | FR-006 |
| AssessmentBlueprintCreated / Updated | Assessment Blueprint | FR-007 |
| AssessmentStrategyUpdated | Assessment Blueprint | FR-007 |

### Engine Events

| Event | Publisher | Trace FR |
|---|---|---|
| AssessmentStarted | Assessment Engine | FR-008 |
| AssessmentCompleted | Assessment Engine | FR-008 |
| AssessmentResultGenerated | Assessment Engine | FR-008 |
| KnowledgeProfileUpdateStarted | Knowledge Profile Engine | FR-013 |
| KnowledgeProfileUpdated | Knowledge Profile Engine | FR-013 |
| KnowledgeProfileUpdateFailed | Knowledge Profile Engine | FR-013 |
| RecommendationStarted | Recommendation Engine | FR-014 |
| LearningDecisionGenerated | Recommendation Engine | FR-014 |
| RecommendationCompleted | Recommendation Engine | FR-014 |
| RecommendationFailed | Recommendation Engine | FR-014 |

> Catatan: Dokumen ini tidak mendefinisikan payload teknis, message broker, retry policy, maupun delivery guarantee — sebagaimana ditegaskan sebagai Out of Scope pada `21_event_model.md`.

---

## 11. Data Object Specification

Data object berikut disusun berdasarkan Core Concepts pada dokumen arsitektur sumber. SRS ini tidak memperkenalkan atribut atau entity baru di luar yang telah didefinisikan.

| Data Object | Atribut Kunci (sesuai sumber) | Source Architecture Document | Trace FR |
|---|---|---|---|
| Learning Program | Identitas unik, Program Type, Status (Draft/Published/Archived) | `10_learning_program.md` | FR-001 |
| Program Structure | Tipe (Curriculum/CEFR/Book/Certification/Free Learning/Custom Structure) | `11_program_structure.md` | FR-002 |
| Learning Module | Identitas unik, Program Structure (1), Learning Design (1), Status | `13_learning_module.md` | FR-003 |
| Learning Design | Learning Objective (≥1), Prerequisite Rule (opsional), Completion Rule (opsional) | `12_learning_design.md` | FR-004 |
| Learning Objective | Objective Statement, Klasifikasi (Knowledge/Understanding/Application/Analysis/Evaluation/Creation), Mastery Criteria | `14_learning_objective.md` | FR-005 |
| Learning Activity | Activity Type, Participation Rule, Completion Criteria, Metadata | `15_learning_activity.md` | FR-006 |
| Activity Result | Hasil langsung pelaksanaan Learning Activity (sebelum evaluasi) | `15_learning_activity.md` | FR-006 |
| Assessment Blueprint | Assessment Strategy, Evaluation Criteria, Assessment Method, Mastery Criteria, Metadata | `16_assessment_blueprint.md` | FR-007 |
| Assessment Result | Hasil evaluasi Assessment Engine | `30_assessment_engine.md` | FR-008 |
| Learning Content | Content ID, Title, Description, Type, Language, Difficulty, Estimated Duration, Version, Status | `22_content_model.md` | FR-009 |
| Knowledge Profile | Representasi tingkat penguasaan Learner (dimiliki tunggal oleh Knowledge Profile Engine) | `31_knowledge_profile_engine.md` | FR-013 |
| Learning Decision | Salah satu dari 7 jenis: Next Module, Review Module, Repeat Activity, Take Assessment, Continue Learning, Complete Module, Complete Program (dimiliki tunggal oleh Recommendation Engine) | `32_recommendation_engine.md` | FR-014 |
| AI Memory | Session/Short-Term/Long-Term/Episodic/Semantic Memory; terpisah dari Knowledge Profile | `42_ai_memory.md` | FR-020 |
| AI Conversation Experience | Bukan Learning Content, bukan Learning Decision, bukan Assessment Result | `02_glossary.md`, `44_ai_governance.md`,`43_ai_personal_learning_agent.md` | FR-018 |
| AI Practice Conversation | Sesi AI Conversation Practice yang ditautkan ke Learning Activity type Practice dan satu Learning Objective; dapat menyediakan Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain untuk Assessment Engine, tetapi bukan Assessment Result dan bukan Knowledge Profile | `15_learning_activity.md`, `43_ai_personal_learning_agent.md` | FR-012B |

---

## 12. Validation Rules

| # | Rule | Trace FR | Source |
|---|---|---|---|
| 1 | Program Type wajib salah satu dari: Curriculum, Certification, Language, Book, Free Learning, Custom. | FR-001 | `10_learning_program.md` |
| 2 | Status lifecycle Learning Program hanya boleh Draft, Published, atau Archived. | FR-001 | `10_learning_program.md` |
| 3 | Learning Program berstatus selain Published wajib ditolak untuk enrollment baru. | FR-001 | `10_learning_program.md` |
| 4 | Learning Program wajib memiliki tepat satu Program Structure dari enam tipe resmi. | FR-002 | `11_program_structure.md` |
| 5 | Learning Module wajib berada pada tepat satu Program Structure dan memiliki tepat satu Learning Design. | FR-003 | `13_learning_module.md` |
| 6 | Learning Design wajib memiliki minimal satu Learning Objective; jika tidak, penyimpanan ditolak. | FR-004 | `12_learning_design.md` |
| 7 | Learning Objective wajib memiliki Objective Statement, klasifikasi, Mastery Criteria, dan tepat satu Learning Design. | FR-005 | `14_learning_objective.md` |
| 8 | Setiap Learning Activity wajib merealisasikan tepat satu Learning Objective. | FR-006 | `15_learning_activity.md` |
| 9 | Learning Activity tidak boleh menghasilkan Assessment Result maupun menghitung tingkat penguasaan Learner. | FR-006 | `15_learning_activity.md` |
| 10 | Assessment Blueprint wajib memiliki Assessment Strategy dari daftar resmi, Evaluation Criteria, dan Mastery Criteria. | FR-007 | `16_assessment_blueprint.md` |
| 11 | Assessment Blueprint tidak menghasilkan Assessment Result, tidak memperbarui Knowledge Profile, dan tidak menghasilkan Recommendation. | FR-007 | `16_assessment_blueprint.md` |
| 12 | Hanya Learning Content berstatus Published yang boleh digunakan Learning Activity. | FR-009 | `22_content_model.md` |
| 13 | Versi Learning Content lama tetap tersimpan (tidak dihapus) saat versi baru diterbitkan. | FR-009 | `22_content_model.md` |
| 14 | Transisi state hanya sah apabila dipicu oleh event valid sesuai Event Model. | FR-010 | `20_state_machine.md` |
| 15 | Hanya satu state utama aktif pada satu waktu untuk satu alur pembelajaran. | FR-010 | `20_state_machine.md` |
| 16 | Setiap event wajib mengikuti format `<Entity><Past Tense>` dan hanya memiliki satu publisher resmi. | FR-011 | `21_event_model.md` |
| 17 | Event yang telah dipublikasikan bersifat immutable. | FR-011 | `21_event_model.md` |
| 18 | Pembaruan Knowledge Profile wajib incremental, bukan rebuild total. | FR-013 | `31_knowledge_profile_engine.md` |
| 19 | Recommendation Engine wajib menghasilkan tepat satu Learning Decision per siklus evaluasi. | FR-014 | `32_recommendation_engine.md` |
| 20 | Learning Decision wajib salah satu dari 7 jenis resmi. | FR-014 | `32_recommendation_engine.md` |
| 21 | Input identik pada Assessment Engine dan Recommendation Engine wajib menghasilkan output yang konsisten (deterministic). | FR-008, FR-014 | `30_assessment_engine.md`, `32_recommendation_engine.md` |
| 22 | AI Memory wajib tersimpan terpisah dari Knowledge Profile; retrieval AI Memory tidak boleh mengubah nilai Knowledge Profile. | FR-020 | `42_ai_memory.md` |
| 23 | Seluruh pemanggilan AI Provider wajib melalui AI Provider Gateway; akses langsung ke provider ditolak. | FR-021 | `41_ai_provider_integration.md` |
| 24 | Setiap permintaan capability AI wajib diperiksa terhadap AI Authority Matrix sebelum dieksekusi. | FR-023 | `44_ai_governance.md` |
| 25 | AI tidak boleh menulis atau mengubah Learning Content resmi melalui interaksi percakapan apa pun. | FR-025 | `22_content_model.md`, `40_ai_architecture.md` |
| 26 | Public Landing Page tidak boleh membuat Enrollment, tidak boleh memicu Canonical Learning Pipeline, dan tidak boleh mengekspos data Learner. | FR-012A | `50_user_journey.md`, `51_roadmap.md` |
| 27 | AI Conversation Practice dapat menjadi assessable Learning Activity, tetapi AI tidak boleh membuat, memodifikasi, atau memiliki official Assessment Result; official result hanya dihasilkan Assessment Engine. | FR-012B | `44_ai_governance.md`, `43_ai_personal_learning_agent.md`, `30_assessment_engine.md` |
| 28 | AI Conversation Practice tidak boleh memperbarui Knowledge Profile, menghasilkan Learning Decision, membuat/mengubah official Learning Content, atau mempublikasikan Official Runtime Event baru; seluruh interaksi dicatat sebagai audit/observability record saja. | FR-012B | `21_event_model.md`, `44_ai_governance.md` |
| 29 | Canonical target-language transcript adalah official conversation record untuk assessable AI Conversation Practice; Indonesian translation dan transliteration hanya learner support aids dan tidak boleh menjadi source of official assessment. | FR-012B | `44_ai_governance.md`, `52_prd.md` |
| 30 | Placement Test adalah specialized assessable Learning Activity, bukan entitas domain baru; Placement starting point suggestion bukan Learning Decision dan tidak boleh memanggil Recommendation Engine pada MVP. | FR-016 | `50_user_journey.md`, `15_learning_activity.md`, `30_assessment_engine.md`, `52_prd.md` |

---

## 13. Error Handling Matrix

| # | Kondisi Kegagalan | Komponen | Perilaku yang Diharapkan | Trace FR | Source |
|---|---|---|---|---|---|
| 1 | Activity Result tidak valid | Assessment Engine | Input ditolak secara graceful; tidak menghasilkan Assessment Result. | FR-008 | `30_assessment_engine.md` |
| 2 | Assessment Blueprint tidak dapat di-resolve | Assessment Engine | Proses evaluasi dihentikan; event kegagalan dipantau monitoring. | FR-008 | `30_assessment_engine.md` |
| 3 | Assessment Result tidak valid | Knowledge Profile Engine | Pembaruan Knowledge Profile dibatalkan; event kegagalan dipublikasikan. | FR-013 | `31_knowledge_profile_engine.md` |
| 4 | Knowledge Profile tidak ditemukan | Knowledge Profile Engine / Recommendation Engine | Proses dihentikan; event kegagalan dipantau monitoring. | FR-013, FR-014 | `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` |
| 5 | Gagal menyimpan/mempersist perubahan | Knowledge Profile Engine | Event kegagalan dipublikasikan; state tidak bertransisi. | FR-013 | `31_knowledge_profile_engine.md` |
| 6 | Learning Design tidak ditemukan | Recommendation Engine | Proses dihentikan; event kegagalan dipantau monitoring. | FR-014 | `32_recommendation_engine.md` |
| 7 | Learning Context tidak valid | Recommendation Engine | Learning Decision tidak dihasilkan; event kegagalan dipublikasikan. | FR-014 | `32_recommendation_engine.md` |
| 8 | Tidak ada Learning Decision yang dapat dihasilkan | Recommendation Engine | Event `RecommendationFailed` dipublikasikan. | FR-014 | `32_recommendation_engine.md` |
| 9 | Gagal mempublikasikan event | Assessment Engine / Knowledge Profile Engine / Recommendation Engine | Kegagalan dicatat dan dapat dipantau sistem monitoring. | FR-008, FR-013, FR-014 | Dokumen Engine masing-masing |
| 10 | AI Provider tidak tersedia | AI Provider Gateway | Fallback Strategy diaktifkan; jika seluruh provider gagal, tampilkan respons aman/fallback non-AI. Learning Decision tetap ditampilkan tanpa AI. | FR-021, FR-022 | `40_ai_architecture.md`, `41_ai_provider_integration.md` |
| 11 | Learning Decision tidak tersedia saat AI Agent berjalan | AI Personal Learning Agent | Agent tidak boleh membuat keputusan sendiri; menunggu sistem menyelesaikan rekomendasi. | FR-018, FR-019 | `43_ai_personal_learning_agent.md` |
| 12 | Knowledge Profile tidak tersedia saat AI Agent berjalan | AI Personal Learning Agent | Agent memberikan respons umum tanpa mengklaim kondisi Learner. | FR-018 | `43_ai_personal_learning_agent.md` |
| 13 | Learning Content tidak tersedia saat AI Agent berjalan | AI Personal Learning Agent | Agent menghindari menjawab seolah-olah content tersedia. | FR-025 | `43_ai_personal_learning_agent.md` |
| 14 | AI Memory tidak tersedia | AI Personal Learning Agent | Percakapan dilanjutkan tanpa personalisasi berbasis memory. | FR-020 | `43_ai_personal_learning_agent.md` |
| 15 | Governance Violation (permintaan melanggar AI Authority Matrix) | AI Governance | Respons ditolak atau diubah sesuai policy sebelum disampaikan ke Learner. | FR-023 | `44_ai_governance.md` |
| 16 | AI Provider tidak tersedia saat AI Conversation Practice berjalan | AI Provider Gateway | Graceful Degradation (AD-009) diaktifkan; Learner diinformasikan bahwa AI tidak tersedia; Learning Activity tetap dapat dilanjutkan tanpa AI. | FR-012B | `40_ai_architecture.md`, `41_ai_provider_integration.md` |
| 17 | Voice permission/recording/processing/playback failure | AI Provider Gateway / UI | State kegagalan ditampilkan dan retry tersedia; STT/TTS tetap kapabilitas wajib MVP. Kegagalan tidak menghasilkan Assessment Result, Knowledge Profile update, atau Learning Decision. | FR-012B | `41_ai_provider_integration.md`, `52_prd.md` |
| 18 | Translation/transliteration gagal atau tidak tersedia | AI Conversation Practice | Conversation tetap berjalan dengan canonical target-language transcript; translation/transliteration tidak digunakan sebagai source of official assessment. | FR-012B | `44_ai_governance.md`, `52_prd.md` |

---

## 14. Permission Matrix

Permission Matrix ini hanya mencantumkan hak akses yang secara eksplisit dinyatakan pada dokumen arsitektur/PRD. Hak akses yang belum diformalkan dicatat sebagai Open Issue, bukan diasumsikan.

| Actor / Component | Learning Program–Learning Objective (CRUD) | Learning Activity (Execute) | Assessment Result (View) | Knowledge Profile (View) | Knowledge Profile (Modify) | Learning Decision (View) | Learning Decision (Generate) | AI Conversation (Use) |
|---|---|---|---|---|---|---|---|---|
| Learner | — (Open Issue: Authoring role belum diatur / belum didefinisikan arsitektur.) | ✅ | ✅ (milik sendiri) | ✅ (milik sendiri) | ❌ | ✅ (milik sendiri) | ❌ | ✅ |
| Educator | — | — | ✅ (Learner dalam kewenangannya — mekanisme Open Issue) | ✅ (read-only, Open Issue mekanisme otorisasi) | ❌ | ✅ (read-only) | ❌ | — (di luar scope FR yang ada) |
| Assessment Engine | ❌ | — | ✅ (generate) | ❌ | ❌ | ❌ | ❌ | — |
| Knowledge Profile Engine | ❌ | — | ✅ (consume) | ✅ (sole owner — generate & modify) | ✅ (sole owner) | ❌ | ❌ | — |
| Recommendation Engine | ❌ | — | ❌ | ✅ (read-only, consume) | ❌ | ✅ (sole owner — generate) | ✅ (sole owner) | — |
| AI Personal Learning Agent | ❌ | ❌ | ❌ (tidak boleh generate resmi) | ✅ (read-only, "melalui business layer" — mekanisme Open Issue) | ❌ (dilarang tegas) | ✅ (read-only, consume) | ❌ (dilarang tegas) | ✅ (generate AI Conversation Experience) |

Legenda: ✅ diizinkan sesuai dokumen sumber · ❌ dilarang tegas oleh arsitektur (AD-006, AD-007, AD-009, `44_ai_governance.md`) · — tidak dibahas/di luar scope dokumen sumber.

---

## 15. Non-Functional Requirements

Seluruh NFR berikut bersumber langsung dari dokumen arsitektur frozen; tidak ada NFR baru yang diperkenalkan.

| Kategori | Requirement | Source | Related AD |
|---|---|---|---|
| Performance | Assessment Engine dan Recommendation Engine wajib deterministik untuk input yang sama (Deterministic Evaluation/Deterministic Decision). AI Provider Gateway wajib memantau Latency. | `30_assessment_engine.md`, `32_recommendation_engine.md`, `41_ai_provider_integration.md` | — |
| Availability | Apabila AI Provider gagal, proses inti (Learning Activity, Assessment Engine, Knowledge Profile Engine) tetap berjalan (Graceful Degradation). | `40_ai_architecture.md`, `41_ai_provider_integration.md` | AD-009 |
| Reliability | Assessment Engine dan Knowledge Profile Engine bersifat stateless dan deterministic; setiap kegagalan menghasilkan event error yang dapat dipantau. | `30_assessment_engine.md`, `31_knowledge_profile_engine.md` | AD-004 |
| Scalability | Arsitektur event-driven memungkinkan penambahan consumer tanpa mengubah publisher. AI Layer mendukung Multi Provider. | `21_event_model.md`, `41_ai_provider_integration.md` | AD-003, AD-008 |
| Security | AI Provider wajib memenuhi Authentication, Authorization, Encryption, Rate Limiting, Monitoring, Logging. Prompt Injection wajib dicegah dan Sensitive Data disanitasi. | `44_ai_governance.md`, `41_ai_provider_integration.md` | — |
| Privacy | AI hanya menggunakan data yang diizinkan (Privacy by Design). Conversation History tidak digunakan di luar kebutuhan pembelajaran tanpa persetujuan. AI Memory mengikuti Data Minimization dan Expiration Policy. | `44_ai_governance.md`, `42_ai_memory.md` | AD-007 |
| Auditability | Seluruh interaksi AI wajib tercatat minimal: Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error. | `44_ai_governance.md` | AD-006 |
| Observability | AI Provider Gateway wajib menyediakan metrik Request Count, Success Rate, Error Rate, Latency, Cost per Request, Token Usage, Provider Availability. AI Personal Learning Agent wajib mendukung observability conversation request, context retrieval, provider call, response latency, error rate, fallback usage, memory update, governance decision. | `41_ai_provider_integration.md`, `43_ai_personal_learning_agent.md` | — |
| Accessibility | Cross-cutting capability, dikembangkan bertahap di seluruh fase Roadmap. | `51_roadmap.md` | — |
| Localization | Learning Content memiliki atribut Language; Localization adalah cross-cutting capability. | `22_content_model.md`, `51_roadmap.md` | — |
| Maintainability | Arsitektur mengikuti prinsip Modular, Extensible ("open for extension, closed for modification"), Layered Architecture. | `01_architecture_principles.md`, `00_overview.md` | AD-001 |

---

## 16. AI Requirements & Boundaries

Seluruh requirement AI pada SRS ini wajib patuh terhadap AD-006, AD-007, AD-008, dan AD-009 serta AI Authority Matrix pada `44_ai_governance.md`.

### 16.1 Batasan Tegas (Hard Boundaries)

* **AI tidak boleh menghasilkan Learning Decision.** Learning Decision hanya dihasilkan oleh Recommendation Engine (AD-006). AI hanya mengonsumsi (read-only) Learning Decision yang sudah dihasilkan.
* **AI tidak boleh memperbarui Knowledge Profile.** Knowledge Profile Is Not AI Memory (AD-007). Knowledge Profile Engine adalah satu-satunya pemilik Knowledge Profile.
* **AI tidak boleh menghasilkan official Assessment Result.** Assessment Result hanya dihasilkan oleh Assessment Engine melalui eksekusi Assessment Blueprint (AD-004). Untuk assessable AI Conversation Practice, AI hanya dapat menyediakan Activity Result atau approved assessment evidence yang didukung sebagai input/evidence; Assessment Engine tetap satu-satunya produsen official Assessment Result.
* **AI Conversation Experience bukan Learning Content.** AI Conversation Experience adalah output percakapan interaktif yang secara eksplisit didefinisikan berbeda dari Learning Content, Learning Decision, dan Assessment Result (`02_glossary.md`).
* **Assessment Engine mengeksekusi Assessment Blueprint** — bukan AI. AI tidak menggantikan peran eksekusi Assessment Engine.
* **Recommendation Engine adalah satu-satunya pemilik (sole owner) Learning Decision.**
* **Knowledge Profile Engine adalah satu-satunya pemilik (sole owner) Knowledge Profile.**

### 16.2 AI Authority Matrix (sumber: `44_ai_governance.md`)

| Capability | Allowed |
|---|---|
| Explain Learning Content | ✅ |
| Answer Questions | ✅ |
| Generate Examples | ✅ |
| Generate Analogies | ✅ |
| Guided Practice | ✅ |
| Socratic Dialogue | ✅ |
| Motivation | ✅ |
| Reflection | ✅ |
| Coaching | ✅ |
| Summarization | ✅ |
| Generate Learning Decision | ❌ |
| Modify Knowledge Profile | ❌ |
| Modify Assessment Result | ❌ |
| Modify Learning Content | ❌ |
| Modify Learning Program | ❌ |
| Override Business Rule | ❌ |

### 16.3 AI Context Hierarchy (urutan prioritas saat konflik)

1. Learning Decision (prioritas tertinggi)
2. Knowledge Profile (referensi learner state)
3. Learning Content (sumber materi resmi)
4. Conversation Context (menjaga alur dialog)
5. AI Memory (personalisasi)

### 16.4 Kapabilitas AI yang Didukung

Tutor, Coach, Practice Partner, Explanation, Reflection, Socratic, Feedback Support (SRS-FR-024/FR-024) — seluruhnya tanpa mengubah Learning Decision, Assessment Result, Knowledge Profile, atau Learning Content resmi. Pada MVP AI Conversation Practice, Practice Partner mendukung text interaction, mandatory STT/TTS capability, target-language transcript, Indonesian translation toggle, dan optional transliteration sebagai learner support, dengan canonical target-language transcript tetap menjadi official conversation record.

### 16.5 Ketergantungan Arsitektur AI

* AD-006 — AI Does Not Make Learning Decisions
* AD-007 — Knowledge Profile Is Not AI Memory
* AD-008 — AI Provider Agnostic (seluruh integrasi melalui AI Provider Gateway)
* AD-009 — AI as Experience Layer (Graceful Degradation saat AI gagal)

### 16.6 Risk Matrix (sumber: `44_ai_governance.md`)

| Risk | Mitigation |
|---|---|
| Hallucination | Business Context |
| Wrong Recommendation | Recommendation Engine |
| Wrong Assessment | Assessment Engine |
| Privacy Leakage | AI Memory Governance |
| Prompt Injection | Prompt Validation |
| Provider Failure | Fallback Strategy |
| Vendor Lock-in | AI Provider Gateway |

---

## 17. Observability & Audit Requirements

**Trace:** SRS-FR-011, SRS-FR-017, SRS-FR-023 (FR-011, FR-017, FR-023) · **Source:** `21_event_model.md`, `44_ai_governance.md`, `41_ai_provider_integration.md`, `43_ai_personal_learning_agent.md`

### 17.1 Audit Log Minimum untuk Interaksi AI

Setiap interaksi AI wajib dicatat dengan field minimum berikut:

* Timestamp
* Provider
* Prompt Version
* Model
* Context Source
* Response ID
* Token Usage
* Error

### 17.2 Metrik Observability AI Provider Gateway

Request Count, Success Rate, Error Rate, Latency, Cost per Request, Token Usage, Provider Availability.

### 17.3 Metrik Observability AI Personal Learning Agent

Conversation request, context retrieval, provider call, response latency, error rate, fallback usage, memory update, governance decision, user feedback. Observability tidak boleh mengekspos data sensitif secara tidak perlu.

### 17.4 Observability Runtime & Engine

Setiap perubahan state (State Machine) harus dapat dipantau (Observable). Setiap kegagalan pada Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine wajib menghasilkan event error yang dapat dipantau monitoring (Operations, sesuai Bagian 6).

### 17.5 Immutability Event untuk Kebutuhan Audit

Seluruh event yang dipublikasikan (Domain Event dan Engine Event) bersifat immutable setelah dipublikasikan, mendukung ketertelusuran (traceability) audit end-to-end pada Canonical Learning Pipeline.

---

## 18. Assumptions & Open Issues

Sesuai Requirement 9, seluruh requirement yang tidak dapat dispesifikasikan karena arsitektur memiliki Open Issue dicatat di bagian ini, bukan diselesaikan dengan solusi baru.

| # | Open Issue | Dampak pada SRS | Related AD |
|---|---|---|---|
| 1 | **Advanced Authentication / Full Identity Platform** belum memiliki dasar arsitektur yang lengkap. MVP Basic Learner Authentication (SRS-FR-012C) diperbolehkan dengan scope terbatas: hanya login/logout/session minimal untuk dua Learner tanpa public signup, OAuth/SSO/MFA, Educator account, role management, atau enterprise identity. | SRS tidak dapat menuliskan spesifikasi Advanced Authentication. Seluruh Use Case pada dokumen ini mengasumsikan identitas actor telah tersedia; Advanced Authentication menunggu Architecture Review. | AD-010 |
| 2 | **Enrollment** belum memiliki domain pemilik. | SRS tidak dapat menuliskan alur enrollment secara lengkap; hanya aturan "Learning Program berstatus Published dapat digunakan untuk enrollment baru" yang dapat dispesifikasikan (SRS-FR-001). | AD-002, AD-010 |
| 3 | **Analytics** tidak memiliki dokumen kepemilikan formal. | SRS-FR-017 dibatasi pada penyediaan metadata mentah (Profile/Evaluation/Recommendation Metadata) dari Engine; struktur/sistem Analytics tidak dispesifikasikan. | AD-010 |
| 4 | **Notification** tidak dibahas arsitektur manapun. | Tidak ada SRS Requirement yang dapat disusun; kapabilitas ini tetap berada di Future Scope PRD. | — |
| 5 | **Achievement/Certificate** tidak dimodelkan sebagai entitas. | Tidak ada SRS Requirement yang dapat disusun; kapabilitas Completion pada User Journey tidak menghasilkan sertifikat/achievement resmi. | AD-002 |
| 6 | **Educator permissions** (boundary akses formal) belum didefinisikan. | SRS-FR-026 (Use Case UC-06) tidak dapat menspesifikasikan mekanisme otorisasi akses Educator terhadap data Learner secara rinci. | AD-002, AD-010 |
| 7 | **Manual Assessment / Peer Review** belum terhubung eksplisit ke Assessment Engine. | SRS-FR-027 tidak dapat menjelaskan alur data integrasi Manual Assessment/Peer Review ke Processing Flow Assessment Engine. | AD-004 |
| 8 | **AI Assisted Assessment** (strategi "AI Assisted" pada Assessment Blueprint) berpotensi bersinggungan dengan AI Boundary (AD-006/AD-009) jika diterapkan di luar batas FR-012B. | SRS-FR-012B hanya mengizinkan Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain sebagai input/evidence untuk Assessment Engine. AI Assisted Assessment lain di luar batas ini tidak dispesifikasikan sampai peran AI diklarifikasi melalui Architecture Review. | AD-006, AD-009 |
| 9 | **Program Context** (input Recommendation Engine) tidak didefinisikan strukturnya secara formal. | SRS-FR-014 mengikuti dokumen sumber apa adanya; struktur data konkret Program Context tidak dispesifikasikan pada dokumen ini. | AD-002 |
| 10 | **Learning Context** digunakan luas tanpa definisi struktural tunggal. | SRS Requirement yang bergantung pada Learning Context (SRS-FR-014, SRS-FR-015, SRS-FR-018) mengikuti definisi umum Glossary; struktur data rinci tidak dispesifikasikan. | AD-010 |
| 11 | Mekanisme akses AI Layer terhadap Knowledge Profile "melalui business layer" belum dijelaskan kontraknya. | SRS-FR-018, SRS-FR-020, SRS-FR-023 mengasumsikan akses read-only tanpa mendefinisikan kontrak API/akses konkret. | AD-007, AD-009 |
| 12 | Knowledge Profile pada MVP (Phase 1) vs Phase 2 tidak selaras (deliverable Roadmap MVP menyebut "Knowledge Profile terbentuk" sebelum Knowledge Profile Engine resmi aktif di Phase 2). | SRS-FR-012 (Dashboard MVP) dibatasi tanpa menampilkan Knowledge Profile; Knowledge Profile penuh baru aktif pada SRS-FR-013 (Phase 2). | AD-002 |

---

## 19. Traceability Matrix

| SRS Requirement | Source PRD FR ID | Source Architecture Document | Architecture Layer | Related AD |
|---|---|---|---|---|
| SRS-FR-001 | FR-001 | `10_learning_program.md` | Learning Domain | AD-002 |
| SRS-FR-002 | FR-002 | `11_program_structure.md`, `10_learning_program.md` | Learning Domain | AD-002 |
| SRS-FR-003 | FR-003 | `13_learning_module.md` | Learning Domain | AD-002 |
| SRS-FR-004 | FR-004 | `12_learning_design.md` | Learning Domain | AD-002 |
| SRS-FR-005 | FR-005 | `14_learning_objective.md` | Learning Domain | AD-002 |
| SRS-FR-006 | FR-006 | `15_learning_activity.md` | Learning Domain | AD-002, AD-005 |
| SRS-FR-007 | FR-007 | `16_assessment_blueprint.md` | Learning Domain | AD-002, AD-004 |
| SRS-FR-008 | FR-008 | `30_assessment_engine.md` | Engine | AD-004 |
| SRS-FR-009 | FR-009 | `22_content_model.md` | Runtime | AD-001 |
| SRS-FR-010 | FR-010 | `20_state_machine.md` | Runtime | AD-003 |
| SRS-FR-011 | FR-011 | `21_event_model.md` | Runtime | AD-003 |
| SRS-FR-012 | FR-012 | `20_state_machine.md`, `15_learning_activity.md`, `30_assessment_engine.md` | Runtime, Learning Domain, Engine | AD-003 |
| SRS-FR-013 | FR-013 | `31_knowledge_profile_engine.md` | Engine | AD-002, AD-007 |
| SRS-FR-014 | FR-014 | `32_recommendation_engine.md` | Engine | AD-006 |
| SRS-FR-015 | FR-015 | `00_overview.md`, `02_glossary.md`, `99_architecture_decisions.md` | Learning Domain, Runtime, Engine | AD-005 |
| SRS-FR-016 | FR-016 | `50_user_journey.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md` | Product, Learning Domain, Engine | AD-005 |
| SRS-FR-017 | FR-017 | `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` | Engine | AD-004 |
| SRS-FR-018 | FR-018 | `43_ai_personal_learning_agent.md`, `40_ai_architecture.md` | AI Layer | AD-009, AD-006 |
| SRS-FR-019 | FR-019 | `43_ai_personal_learning_agent.md`, `40_ai_architecture.md`, `44_ai_governance.md` | AI Layer | AD-006 |
| SRS-FR-020 | FR-020 | `42_ai_memory.md` | AI Layer | AD-007 |
| SRS-FR-021 | FR-021 | `41_ai_provider_integration.md` | AI Layer | AD-008 |
| SRS-FR-022 | FR-022 | `40_ai_architecture.md`, `41_ai_provider_integration.md` | AI Layer | AD-009 |
| SRS-FR-023 | FR-023 | `44_ai_governance.md` | AI Layer | AD-006, AD-007, AD-008, AD-009 |
| SRS-FR-024 | FR-024 | `43_ai_personal_learning_agent.md` | AI Layer | AD-006, AD-009 |
| SRS-FR-025 | FR-025 | `22_content_model.md`, `40_ai_architecture.md` | AI Layer, Runtime | AD-009 |
| SRS-FR-026 | FR-026 | `50_user_journey.md`, `20_state_machine.md`, `31_knowledge_profile_engine.md` | Product, Runtime, Engine | AD-002 |
| SRS-FR-027 | FR-027 | `51_roadmap.md` | Product | — |
| SRS-FR-012A | FR-012A | `50_user_journey.md`, `51_roadmap.md` | Product | AD-002 |
| SRS-FR-012B | FR-012B | `15_learning_activity.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md` | Learning Domain, AI Layer | AD-002, AD-006, AD-007, AD-008, AD-009 |
| SRS-FR-012C | FR-012C | `50_user_journey.md`, `51_roadmap.md` | Product / Application Layer | AD-002 |

---

## 20. Out of Scope

Sesuai batasan pada `52_prd.md` dan instruksi penyusunan SRS ini, hal-hal berikut secara eksplisit berada di luar cakupan dokumen ini:

* Redesign arsitektur Kaifa v2 dalam bentuk apa pun.
* Pendefinisian business entity atau business rule baru di luar yang telah ada pada dokumen arsitektur frozen.
* Perubahan FR ID atau makna FR yang telah disetujui pada `52_prd.md`.
* Database schema fisik, API contract teknis, dan UI wireframe.
* Penyelesaian gap arsitektural: Advanced Authentication / Full Identity Platform, Enrollment, Analytics, Notification, Achievement, Certificate, Educator permission formal, Manual Assessment, dan AI Assisted Assessment di luar batas FR-012B — seluruhnya tercatat sebagai SRS Open Issues (Bagian 18), bukan diselesaikan pada dokumen ini. (Catatan: MVP Basic Learner Authentication (SRS-FR-012C), Placement Test (SRS-FR-016), dan bounded assessable AI Conversation Practice (SRS-FR-012B) telah dimasukkan dalam scope MVP sesuai PRD.)
* Kapabilitas Future Scope PRD: Parent Dashboard/Progress Monitoring/Notification/Achievement Tracking (Phase 5), Multi Organization/Multi School/Tenant Management/Role Management/Audit Log/SSO/API Integration/Reporting/Compliance (Phase 6), AI Plugin/AI Workflow/AI Coach ekstensi/AI Content Assistant/AI Evaluation Assistant/AI Insights/Model Routing/Offline AI Support (Phase 7), serta Voice Tutor/AI Coach dedicated/Speaking Practice/Interview Simulator/Debate Partner/Avatar Tutor — seluruhnya belum memiliki dasar arsitektur domain/engine/AI eksplisit dan tidak dijadikan SRS Requirement.
* Implementasi teknis message broker, retry policy, dan delivery guarantee pada Event Model (tetap menjadi layer infrastruktur, di luar scope arsitektur maupun SRS).

---

*Dokumen ini merupakan implementation specification yang diturunkan dari `52_prd.md` dan seluruh dokumentasi arsitektur Kaifa v2 yang telah dibekukan (Freeze). Perubahan terhadap dokumen ini harus mempertahankan traceability penuh terhadap FR ID pada PRD dan tidak boleh mendahului keputusan arsitektur yang belum diambil melalui Architecture Review.*
