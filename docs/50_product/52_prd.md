# PRD — Kaifa v2

| Version | Status | Owner   | Depends On                 | Used By                            | Last Updated |
|---------|--------|---------|-----------------------------|-------------------------------------|--------------|
| 2.0     | Release Candidate | Product | seluruh baseline architecture, `50_user_journey.md`, `51_roadmap.md` | Engineering, QA, UI/UX, AI, DevOps | 2026-07-06   |

---

# Purpose

Dokumen ini merupakan **Product Requirement Document (PRD)** untuk Kaifa v2.

PRD ini menerjemahkan arsitektur yang telah dibekukan (frozen) — yang didefinisikan pada `00_foundation/*`, `10_learning_domain/*`, `20_runtime/*`, `30_engine/*`, `40_ai/*`, `50_user_journey.md`, `51_roadmap.md`, dan `99_architecture_decisions.md` — menjadi kumpulan Functional Requirement (FR) yang dapat ditelusuri (traceable) ke dokumen arsitektur sumber.

PRD ini **tidak** mendefinisikan ulang arsitektur, **tidak** memperkenalkan business entity baru, dan **tidak** memperkenalkan business rule baru. Setiap requirement yang tidak memiliki dasar arsitektur eksplisit ditempatkan pada bagian **Future Scope** atau **Assumptions & Open Issues**, bukan diasumsikan sebagai bagian dari arsitektur.

---

# Scope

## In Scope

* Functional Requirement yang bersumber langsung dari dokumen arsitektur frozen.
* Pemetaan requirement terhadap Roadmap Phase (`51_roadmap.md`).
* Traceability setiap requirement ke Source Architecture Document, Architecture Layer, dan Architecture Decision (jika berlaku).
* Daftar Assumptions & Open Issues yang bersifat implementation-relevant.

## Out of Scope

* Redesign arsitektur.
* Pendefinisian business entity atau business rule baru.
* Database schema, API contract, UI wireframe, dan detail teknis implementasi.
* Penyelesaian gap arsitektural (mis. Enrollment, Authentication) — gap ini dicatat sebagai Open Issues, bukan diselesaikan di dalam PRD ini.

---

# How to Read This Document

Setiap Functional Requirement (FR) disajikan dengan format berikut:

* **FR ID** — pengenal unik.
* **Requirement** — kebutuhan fungsional dalam Bahasa Indonesia.
* **Source Architecture Document** — dokumen arsitektur yang menjadi dasar (satu atau lebih).
* **Architecture Layer** — layer sesuai `00_overview.md` (Foundation / Learning Domain / Runtime / Engine / AI Layer / Product).
* **Related Architecture Decision** — AD-00X yang relevan (jika ada).

Requirement dikelompokkan berdasarkan fase pada `51_roadmap.md`:

* **MVP** — Phase 1 (Foundation Platform).
* **Phase 2** — Adaptive Learning.
* **Phase 3** — AI Learning Companion.
* **Phase 4** — Educator Platform.
* **Future** — Phase 5 (Parent Experience), Phase 6 (Enterprise & Institution), Phase 7 (AI Ecosystem), dan kapabilitas lain yang disebut Roadmap tetapi belum memiliki dasar arsitektur domain/engine/AI yang eksplisit.

---

# MVP — Phase 1: Foundation Platform

Berdasarkan `51_roadmap.md` Phase 1, MVP berfokus pada end-to-end learning flow dasar, Placement Test, dan AI Conversation Practice yang assessable, tanpa full adaptive learning berbasis Knowledge Profile Engine atau Recommendation Engine. Authoring Learning Program, Learning Module, Learning Design, Learning Objective, Learning Activity, Assessment Blueprint, dan Learning Content pada MVP dilakukan melalui backend, admin, atau system-seeded; tidak ada learner-facing authoring UI pada MVP.

### FR-001 — Definisi dan Pengelolaan Learning Program

**Requirement:** Sistem harus dapat merepresentasikan sebuah Learning Program dengan identitas unik, Program Type (Curriculum, Certification, Language, Book, Free Learning, Custom), dan lifecycle (Draft → Published → Archived). Hanya Learning Program berstatus Published yang dapat digunakan untuk enrollment baru.

**Source Architecture Document:** `10_learning_program.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002 (Domain Owns Business Rules)

---

### FR-002 — Pemilihan Program Structure

**Requirement:** Setiap Learning Program harus menggunakan tepat satu Program Structure (Curriculum Structure, CEFR Structure, Book Structure, Certification Structure, Free Learning Structure, atau Custom Structure) sebagai pola organisasi hierarkis.

**Source Architecture Document:** `11_program_structure.md`, `10_learning_program.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002

---

### FR-003 — Pengelolaan Learning Module

**Requirement:** Sistem harus dapat merepresentasikan Learning Module sebagai unit pembelajaran yang berada pada tepat satu Program Structure dan memiliki tepat satu Learning Design. Learning Module memiliki lifecycle (Draft → Published → Archived).

**Source Architecture Document:** `13_learning_module.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002

---

### FR-004 — Pengelolaan Learning Design

**Requirement:** Sistem harus dapat merepresentasikan Learning Design sebagai blueprint pedagogis yang mendefinisikan minimal satu Learning Objective, Prerequisite Rule, dan Completion Rule untuk sebuah Learning Module.

**Source Architecture Document:** `12_learning_design.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002

---

### FR-005 — Pengelolaan Learning Objective

**Requirement:** Sistem harus dapat merepresentasikan Learning Objective dengan Objective Statement, klasifikasi (Knowledge/Understanding/Application/Analysis/Evaluation/Creation), dan Mastery Criteria. Setiap Learning Objective dimiliki oleh tepat satu Learning Design dan diimplementasikan melalui satu atau lebih Learning Activity.

**Source Architecture Document:** `14_learning_objective.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002

---

### FR-006 — Pelaksanaan Learning Activity dan Activity Result

**Requirement:** Sistem harus memungkinkan learner melaksanakan Learning Activity (Reading, Watching, Listening, Discussion, Practice, Exercise, Assignment, Project, Experiment, Reflection) sesuai Completion Criteria, dan menghasilkan Activity Result sebagai keluaran langsung sebelum dievaluasi.

**Source Architecture Document:** `15_learning_activity.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002, AD-005

---

### FR-007 — Definisi Assessment Blueprint

**Requirement:** Sistem harus dapat merepresentasikan Assessment Blueprint yang mendefinisikan Assessment Strategy (Quiz, Assignment, Project, Portfolio, Observation, Speaking, Writing, Practical, Peer Review; strategi AI Assisted mengikuti batasan pada FR-023 dan Open Issues), Evaluation Criteria, dan Mastery Criteria untuk menilai Activity Result.

**Source Architecture Document:** `16_assessment_blueprint.md`
**Architecture Layer:** Learning Domain
**Related Architecture Decision:** AD-002, AD-004

---

### FR-008 — Eksekusi Evaluasi oleh Assessment Engine

**Requirement:** Sistem harus mengeksekusi Assessment Blueprint terhadap Activity Result melalui Assessment Engine (resolve blueprint → validasi Activity Result → eksekusi evaluasi → hasilkan Assessment Result → publikasikan event) secara deterministik dan stateless.

**Source Architecture Document:** `30_assessment_engine.md`
**Architecture Layer:** Engine
**Related Architecture Decision:** AD-004

---

### FR-009 — Content Delivery melalui Content Model

**Requirement:** Sistem harus menyediakan Learning Content (Article, Video, Audio, Interactive, Assessment Resource, Document, External Resource) yang reusable dan digunakan oleh Learning Activity, dengan metadata minimum (Content ID, Title, Description, Type, Language, Difficulty, Estimated Duration, Version, Status) dan lifecycle (Draft → Published → Archived).

**Source Architecture Document:** `22_content_model.md`
**Architecture Layer:** Runtime
**Related Architecture Decision:** AD-001

---

### FR-010 — State Machine Pembelajaran

**Requirement:** Sistem harus mengelola perpindahan state pembelajaran sesuai lifecycle: Not Started → Learning → Assessing → Updating Knowledge Profile → Generating Learning Decision → Ready for Next Activity → Completed, dengan transisi yang dipicu oleh event yang valid.

**Source Architecture Document:** `20_state_machine.md`
**Architecture Layer:** Runtime
**Related Architecture Decision:** AD-003

---

### FR-011 — Event-Driven Coordination

**Requirement:** Sistem harus mempublikasikan dan mengonsumsi Domain Event dan Engine Event (mis. `LearningActivityCompleted`, `ActivityResultGenerated`, `AssessmentCompleted`, `AssessmentResultGenerated`) sesuai naming convention `<Entity><Past Tense>`, dengan satu publisher per event.

**Source Architecture Document:** `21_event_model.md`
**Architecture Layer:** Runtime
**Related Architecture Decision:** AD-003

---

### FR-012 — Dashboard Progres Dasar

**Requirement:** Sistem harus menampilkan Activity Result, Assessment Result, dan informasi progres dasar kepada learner berdasarkan state pembelajaran (State Machine) untuk learner experience dan reporting MVP. Pencatatan dan penyajian ini bukan implementasi Knowledge Profile Engine, tidak memelihara competency mastery modeling, dan tidak menghasilkan adaptive Learning Decision.

**Source Architecture Document:** `20_state_machine.md`, `15_learning_activity.md`, `30_assessment_engine.md`
**Architecture Layer:** Runtime, Learning Domain, Engine
**Related Architecture Decision:** AD-003

> Catatan: "Dashboard Dasar" disebut sebagai capability MVP pada `51_roadmap.md`, namun detail tampilan/metrik dashboard tidak didefinisikan oleh dokumen arsitektur manapun. FR ini dibatasi pada penyajian data yang telah tersedia dari State Machine dan Assessment Engine untuk learner experience dan reporting MVP, bukan Knowledge Profile Engine atau Recommendation Engine.

---

### FR-012A — Public Landing Page

**Requirement:** Sistem harus menyediakan Public Landing Page sebagai product entry page yang dapat diakses secara publik tanpa autentikasi. Landing Page hanya bersifat informatif dan tidak membuat Enrollment, tidak memicu Canonical Learning Pipeline, dan tidak mengekspos data Learner.

**Source Architecture Document:** `50_user_journey.md`, `51_roadmap.md`
**Architecture Layer:** Product
**Related Architecture Decision:** AD-002

> Catatan: Public Landing Page adalah entry point produk, bukan entitas domain baru. Landing Page tidak membuat Enrollment (Enrollment adalah Open Issue). Landing Page tidak memperkenalkan Authentication/Identity requirement baru pada MVP.

---

### FR-012B — AI Conversation Practice for Learning Objective

**Requirement:** Sistem harus memungkinkan Learner melaksanakan AI Conversation Practice sebagai mode dari Learning Activity type `Practice` yang ditautkan ke satu Learning Objective, didukung oleh AI Practice Partner menggunakan Published Learning Content sebagai konteks di mana berlaku. MVP AI Conversation Practice harus mendukung interaksi teks serta kapabilitas voice wajib berupa Speech-to-Text (STT) untuk input suara dan Text-to-Speech (TTS) untuk output suara. Transcript text dalam target language tetap menjadi canonical conversation record. AI Conversation Practice juga mendukung target-language transcript. Untuk percakapan Arabic, conversation text ditampilkan dalam Arabic script dan UI harus mendukung RTL layout di bagian percakapan yang relevan.

AI Conversation Practice dapat menjadi Learning Activity yang assessable. AI Conversation Practice menghasilkan Activity Result atau approved assessment evidence untuk evaluasi Assessment Engine menggunakan Assessment Blueprint. Evidence dapat mencakup canonical target-language transcript, completion data, pronunciation-related metadata, voice transcript, AI-generated practice signals, atau activity evidence lain yang didukung. Learner dapat menyalakan Indonesian translation untuk pesan AI dan learner, serta melihat transliteration opsional jika dibutuhkan. Translation dan transliteration hanya learner support aids, bukan official assessment sources. Official Assessment Result tetap hanya boleh diproduksi oleh Assessment Engine menggunakan Assessment Blueprint dan Activity Result atau approved assessment evidence yang didukung. AI tidak boleh melakukan scoring resmi atau langsung membuat, memodifikasi, atau memiliki Assessment Result; tidak boleh memperbarui Knowledge Profile; tidak boleh menghasilkan Learning Decision; tidak boleh membuat atau mengubah official Learning Content; dan tidak boleh mempublikasikan Official Runtime Events secara langsung. Translation support juga tidak boleh membuat Learning Decision, memperbarui Knowledge Profile, mengubah Learning Content, atau mempublikasikan Official Runtime Events.

**Source Architecture Document:** `15_learning_activity.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md`
**Architecture Layer:** Learning Domain, AI Layer
**Related Architecture Decision:** AD-002, AD-006, AD-007, AD-008, AD-009

> Catatan: AI Conversation Practice adalah MVP-limited AI capability, bukan Full AI Learning Companion. Full AI Learning Companion tetap berada pada Phase 3 (FR-018 s/d FR-025). AI Conversation Practice tidak memerlukan Knowledge Profile Engine atau Recommendation Engine aktif (keduanya Phase 2). STT dan TTS adalah kapabilitas wajib MVP, sementara learner dapat memilih menggunakan text atau voice dalam suatu percakapan. AI hanya menghasilkan conversation response, feedback text, practice guidance, canonical target-language transcript, learner-support translation/transliteration, dan practice signals sebagai evidence; official scoring tetap dijalankan oleh Assessment Engine. Translation dan transliteration tidak menjadi sumber penilaian resmi dan tidak memperkenalkan full localization platform, dictionary engine, dialect detection, atau real-time interpretation ke MVP.

---

### FR-016 — Placement Test

**Requirement:** Sistem harus mendukung pelaksanaan Placement Test sebagai specialized assessable Learning Activity yang dievaluasi melalui Assessment Blueprint dan Assessment Engine untuk menentukan atau menyarankan titik awal pembelajaran Learner pada MVP, sesuai tahap Placement pada User Journey.

**Source Architecture Document:** `50_user_journey.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md`
**Architecture Layer:** Product, Learning Domain, Engine
**Related Architecture Decision:** AD-005

> Catatan: Placement Test bukan entitas domain baru. Placement Test diimplementasikan sebagai instansiasi khusus dari Learning Activity yang sudah ada, menggunakan Assessment Blueprint, Assessment Engine, Activity Result, dan Assessment Result yang sudah ada. Placement Test dapat menentukan atau menyarankan learner starting point pada MVP. Starting point suggestion ini bukan Learning Decision, tidak boleh disebut sebagai Learning Decision, dan tidak boleh memanggil Recommendation Engine pada MVP. Full adaptive Learning Decision dan Recommendation Engine tetap Phase 2 kecuali dipromosikan secara eksplisit di dokumen lain.

---

### FR-012C — MVP Basic Learner Authentication

**Requirement:** Sistem harus menyediakan MVP Basic Learner Authentication yang memungkinkan minimal dua Learner login, menggunakan learning flow MVP, dan memiliki data Learner yang terpisah satu sama lain.

**Source Architecture Document:** `50_user_journey.md`, `51_roadmap.md`
**Architecture Layer:** Product / Application Layer
**Related Architecture Decision:** AD-002

MVP Basic Learner Authentication harus:
* mendukung minimal dua akun Learner,
* mengidentifikasi Learner aktif dan membangun Learner context,
* mendukung login, logout, dan identifikasi Learner aktif (`GET /api/v1/auth/me` atau ekuivalen),
* memastikan data Learner (Learning Activity, AI Conversation Practice, Dashboard) terisolasi per Learner aktif.

MVP Basic Learner Authentication **tidak boleh**:
* mendefinisikan business rule pembelajaran,
* membuat Enrollment,
* memicu Canonical Learning Pipeline,
* mempublikasikan official Runtime Event,
* memperkenalkan Educator permission model,
* memperkenalkan Role Management di luar kebutuhan minimal Learner actor.

> Catatan: MVP Basic Learner Authentication hanya mencakup kapabilitas login/logout/session minimal untuk dua Learner. Advanced Authentication (public signup, forgot password, OAuth/Google login, MFA, SSO, organization identity, parent account, Educator account, role management, enterprise identity, full account lifecycle) tetap merupakan Open Issue / Future Scope dan tidak termasuk MVP.

---

# Phase 2 — Adaptive Learning

Berdasarkan `51_roadmap.md` Phase 2, kapabilitas berfokus pada personalisasi berbasis engine tanpa AI.

### FR-013 — Pembentukan dan Pembaruan Knowledge Profile

**Requirement:** Sistem harus memperbarui Knowledge Profile learner melalui Knowledge Profile Engine berdasarkan Assessment Result, secara incremental dan deterministic (load profile → validasi Assessment Result → update → persist → publish event).

**Source Architecture Document:** `31_knowledge_profile_engine.md`
**Architecture Layer:** Engine
**Related Architecture Decision:** AD-002, AD-007

---

### FR-014 — Penghasilan Learning Decision oleh Recommendation Engine

**Requirement:** Sistem harus menghasilkan Learning Decision (Next Module, Review Module, Repeat Activity, Take Assessment, Continue Learning, Complete Module, Complete Program) melalui Recommendation Engine berdasarkan Knowledge Profile, Learning Design, dan Learning Context, secara deterministik dan dapat dijelaskan (explainable).

**Source Architecture Document:** `32_recommendation_engine.md`
**Architecture Layer:** Engine
**Related Architecture Decision:** AD-006

---

### FR-015 — Alur Pembelajaran Adaptif End-to-End

**Requirement:** Sistem harus menjalankan alur adaptif penuh sesuai Canonical Learning Pipeline: Learning Activity → Activity Result → (dievaluasi menggunakan) Assessment Blueprint → (dieksekusi oleh) Assessment Engine → Assessment Result → (memperbarui) Knowledge Profile → (mendorong) Learning Decision, tanpa keterlibatan AI Layer.

**Source Architecture Document:** `00_overview.md`, `02_glossary.md`, `99_architecture_decisions.md`
**Architecture Layer:** Learning Domain, Runtime, Engine
**Related Architecture Decision:** AD-005

---

### FR-017 — Progress Analytics Dasar

**Requirement:** Sistem harus menyediakan data perkembangan learner (Profile Metadata dari Knowledge Profile Engine, Evaluation Metadata dari Assessment Engine, Recommendation Metadata dari Recommendation Engine) sebagai konsumsi Analytics.

**Source Architecture Document:** `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md`
**Architecture Layer:** Engine
**Related Architecture Decision:** AD-004

> Catatan: "Analytics" disebut sebagai consumer di ketiga dokumen Engine, namun tidak memiliki dokumen kepemilikan sendiri. Lihat Assumptions & Open Issues.

---

# Phase 3 — AI Learning Companion

Berdasarkan `51_roadmap.md` Phase 3. Seluruh FR pada bagian ini **wajib tunduk pada AD-006, AD-007, AD-008, dan AD-009**.

### FR-018 — AI Personal Learning Agent sebagai Orchestrator

**Requirement:** Sistem harus menyediakan AI Personal Learning Agent yang menyusun AI Context dari Learning Decision, Knowledge Profile, Learning Content, AI Memory, Conversation Context, dan Learning Context, kemudian menghasilkan AI Conversation Experience bagi learner.

**Source Architecture Document:** `43_ai_personal_learning_agent.md`, `40_ai_architecture.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-009 (AI as Experience Layer), AD-006

---

### FR-019 — AI Menjelaskan Learning Decision (Bukan Membuat Keputusan)

**Requirement:** AI Personal Learning Agent harus menjelaskan Learning Decision yang dihasilkan Recommendation Engine kepada learner dalam bahasa natural. AI tidak boleh membuat, mengubah, atau mengabaikan Learning Decision.

**Source Architecture Document:** `43_ai_personal_learning_agent.md`, `40_ai_architecture.md`, `44_ai_governance.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-006

---

### FR-020 — AI Memory Terpisah dari Knowledge Profile

**Requirement:** Sistem harus menyimpan konteks percakapan dan preferensi learner (Session/Short-Term/Long-Term/Episodic/Semantic Memory) melalui AI Memory, yang secara tegas terpisah dari Knowledge Profile sebagai business data. AI Memory tidak boleh menjadi sumber kebenaran Knowledge Profile.

**Source Architecture Document:** `42_ai_memory.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-007

---

### FR-021 — Integrasi AI Provider melalui AI Provider Gateway

**Requirement:** Seluruh pemanggilan AI Provider harus dilakukan melalui AI Provider Gateway yang menyediakan Provider Adapter, Provider Selection Strategy, dan Fallback Strategy. Tidak ada komponen yang boleh terhubung langsung ke provider tertentu.

**Source Architecture Document:** `41_ai_provider_integration.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-008

---

### FR-022 — Graceful Degradation saat AI Tidak Tersedia

**Requirement:** Apabila AI Provider gagal atau tidak tersedia, sistem harus tetap menjalankan proses pembelajaran inti menggunakan Learning Decision dari Recommendation Engine tanpa AI (fallback non-AI).

**Source Architecture Document:** `40_ai_architecture.md`, `41_ai_provider_integration.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-009

---

### FR-023 — AI Governance sebagai Kontrol Wajib

**Requirement:** Seluruh interaksi AI Personal Learning Agent harus mengikuti AI Authority Matrix pada AI Governance (mis. Explain Learning Content = Allowed; Generate Learning Decision = Not Allowed; Modify Knowledge Profile = Not Allowed) dan harus dapat diaudit (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error).

**Source Architecture Document:** `44_ai_governance.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-006, AD-007, AD-008, AD-009

---

### FR-024 — Kapabilitas AI: Tutor, Coach, Practice Partner, Explanation, Reflection, Socratic, Feedback Support

**Requirement:** AI Personal Learning Agent harus mendukung kapabilitas Tutor, Coach, Practice Partner, Explanation, Reflection, Socratic, dan Feedback Support sebagaimana didefinisikan, tanpa mengubah Learning Decision, Assessment Result, Knowledge Profile, atau Learning Content resmi.

**Source Architecture Document:** `43_ai_personal_learning_agent.md`
**Architecture Layer:** AI Layer
**Related Architecture Decision:** AD-006, AD-009

---

### FR-025 — AI Menggunakan Learning Content sebagai Konteks (Bukan Sumber Kebenaran)

**Requirement:** AI dapat menggunakan Learning Content untuk menjelaskan, memberi contoh, dan membuat latihan sementara, tetapi tidak boleh mengubah, mengganti, atau menjadi sumber kebenaran Learning Content resmi.

**Source Architecture Document:** `22_content_model.md`, `40_ai_architecture.md`
**Architecture Layer:** AI Layer, Runtime
**Related Architecture Decision:** AD-009

---

# Phase 4 — Educator Platform

Berdasarkan `51_roadmap.md` Phase 4.

### FR-026 — Learner Monitoring oleh Educator

**Requirement:** Sistem harus memungkinkan Educator memantau progres learner berdasarkan data yang telah tersedia dari State Machine, Knowledge Profile, dan Learning Decision.

**Source Architecture Document:** `50_user_journey.md`, `20_state_machine.md`, `31_knowledge_profile_engine.md`
**Architecture Layer:** Product, Runtime, Engine
**Related Architecture Decision:** AD-002

> Catatan: "Educator" belum didefinisikan sebagai domain/entitas resmi pada dokumen arsitektur manapun (hanya disebut di Glossary konteks "Educator" tanpa entri formal dan di User Journey sebagai persona). Lihat Assumptions & Open Issues.

---

### FR-027 — Class Management dan Assignment Review

**Requirement:** Sistem harus mendukung pengelolaan kelas dan peninjauan tugas oleh Educator sebagai turunan dari kapabilitas Roadmap Phase 4.

**Source Architecture Document:** `51_roadmap.md`
**Architecture Layer:** Product
**Related Architecture Decision:** —

> Catatan: Roadmap menyebut kapabilitas ini, tetapi tidak ada dokumen Learning Domain/Runtime/Engine yang mendefinisikan Class, Assignment Review, atau Manual Assessment sebagai entitas/alur resmi. Ditempatkan sebagai Open Issue karena berpotensi memerlukan business rule baru yang saat ini tidak dimiliki arsitektur manapun.

---

# Future Scope

Kapabilitas berikut disebut pada `51_roadmap.md` (Phase 5, 6, 7) atau pada dokumen lain, tetapi **tidak memiliki dasar arsitektur domain/engine/AI yang eksplisit** pada saat PRD ini disusun. Kapabilitas ini tidak dijadikan Functional Requirement agar tidak memperkenalkan business entity/rule baru secara implisit.

| Capability | Disebut Pada | Layer yang Belum Mendefinisikan |
|---|---|---|
| Parent Dashboard, Progress Monitoring untuk Parent, Notification, Achievement Tracking, Learning Summary | `51_roadmap.md` Phase 5, `50_user_journey.md` | Tidak ada domain/engine yang memiliki entitas Notification atau Achievement |
| Multi Organization, Multi School, Tenant Management, Role Management, Audit Log, SSO, API Integration, Reporting, Compliance | `51_roadmap.md` Phase 6 | Tidak dibahas di Foundation/Learning Domain/Runtime/Engine/AI Layer manapun |
| AI Plugin, AI Workflow, AI Coach (ekstensi), AI Content Assistant, AI Evaluation Assistant, AI Insights, Model Routing, Offline AI Support | `51_roadmap.md` Phase 7 | Disebut sebagai arah ekstensi pada `43_ai_personal_learning_agent.md` dan `44_ai_governance.md` ("Future Extension"), namun belum memiliki spesifikasi boundary/governance rinci |
| Voice Tutor, AI Coach (dedicated), Speaking Practice (dedicated product), Interview Simulator, Debate Partner, Avatar Tutor | `44_ai_governance.md`, `43_ai_personal_learning_agent.md` ("Future Extension") | Disebut eksplisit sebagai extension yang harus tetap mengikuti AD-006/007/008/009, tapi belum ada dokumen detail |

---

# Assumptions & Open Issues

Bagian ini hanya memuat gap yang **berdampak langsung pada implementasi** (bukan isu format/metadata dokumentasi).

1. **Enrollment belum memiliki domain pemilik.**
   `10_learning_program.md` menyebut aturan "hanya Learning Program berstatus Published yang dapat digunakan untuk enrollment baru", dan `50_user_journey.md` menyebut Enrollment sebagai tahap perjalanan pengguna. Namun, tidak ada dokumen arsitektur yang mendefinisikan Enrollment sebagai entitas, lifecycle, atau business rule. Formal Enrollment tetap Open Issue dan tidak diasumsikan didukung oleh MVP. **Dampak:** FR terkait Enrollment tidak dapat disusun dengan traceability penuh sampai domain ini didefinisikan melalui architecture review.

2. **Authentication dan User Profile.**
   MVP Basic Learner Authentication (FR-012C) kini dimasukkan dalam scope MVP dengan batasan: hanya login/logout/session minimal untuk dua Learner, tanpa public signup, tanpa Advanced Authentication. **Advanced Authentication** (public signup, OAuth/SSO/MFA, Educator account, role management, enterprise identity, full account lifecycle) tetap merupakan **Open Issue / Future Scope** dan belum memiliki dasar arsitektur yang lengkap. **Dampak:** FR-012C disusun dengan cakupan minimal agar tidak memperkenalkan entitas identitas baru di luar kebutuhan MVP.

3. **Analytics tidak memiliki dokumen kepemilikan.**
   "Analytics" disebut berulang sebagai consumer pada `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md`, dan sebagai capability pada Roadmap Cross-Cutting Capabilities, tetapi tidak ada domain/dokumen yang mendefinisikan struktur atau kepemilikan Analytics. **Dampak:** FR-017 (Progress Analytics Dasar) dibatasi hanya pada metadata yang sudah dihasilkan Engine, tanpa mendefinisikan sistem Analytics baru.

4. **Notification tidak dibahas di arsitektur manapun.**
   Disebut di `51_roadmap.md` Phase 5 tanpa jejak arsitektural. **Dampak:** tidak ada FR yang dapat disusun; ditempatkan di Future Scope.

5. **Achievement/Certificate tidak dimodelkan sebagai entitas.**
   Disebut di `50_user_journey.md` (tahap Completion) dan `51_roadmap.md` Phase 5, tetapi secara eksplisit di-exclude dari scope seluruh dokumen Learning Domain. **Dampak:** tidak ada FR yang dapat disusun; ditempatkan di Future Scope.

6. **Educator sebagai entitas/domain belum didefinisikan secara formal.**
   "Educator" muncul di `02_glossary.md` (tabel Educator, tanpa entri resmi di tabel istilah utama), `50_user_journey.md` (persona), dan `51_roadmap.md` Phase 4, tetapi tidak ada dokumen Learning Domain yang mendefinisikan tanggung jawab, boundary, atau data yang dapat diakses Educator secara formal (mis. hak akses terhadap Knowledge Profile atau Manual Assessment). **Dampak:** FR-026 dan FR-027 disusun dengan cakupan terbatas pada data yang sudah tersedia dari dokumen lain, dan FR-027 ditandai sebagai Open Issue karena Manual Assessment berpotensi memerlukan business rule baru.

7. **Manual Assessment / Peer Review belum terhubung eksplisit ke Assessment Engine.**
   `16_assessment_blueprint.md` mencantumkan strategi Peer Review dan `51_roadmap.md` mencantumkan Manual Assessment (Phase 4), tetapi `30_assessment_engine.md` tidak menjelaskan bagaimana input non-otomatis (penilaian manual/peer) masuk ke Processing Flow Assessment Engine. **Dampak:** FR-027 tidak dapat menjelaskan alur data secara rinci sampai hal ini diklarifikasi melalui architecture review.

8. **Strategi Assessment "AI Assisted" berpotensi bersinggungan dengan AI Boundary.**
   `16_assessment_blueprint.md` mencantumkan "AI Assisted" sebagai Assessment Strategy, sementara `40_ai_architecture.md` dan `44_ai_governance.md` menyatakan AI tidak boleh menghasilkan Assessment Result resmi maupun menentukan mastery. **Dampak:** FR-007 dan FR-012B mengizinkan AI transcript/practice signals sebagai evidence, tetapi official scoring wajib tetap melalui Assessment Blueprint dan Assessment Engine agar tidak melanggar AD-006/AD-009.

9. **Program Context (input Recommendation Engine) tidak didefinisikan strukturnya.**
   `32_recommendation_engine.md` mencantumkan Program Context sebagai Engine Input dengan Source "Learning Program", tetapi `10_learning_program.md` tidak mendefinisikan konsep ini. **Dampak:** FR-014 mengikuti dokumen sumber apa adanya; struktur konkret Program Context perlu diklarifikasi sebelum implementasi.

10. **Learning Context digunakan luas tanpa definisi formal tunggal.**
    Konsep ini dipakai oleh State Machine, ketiga Engine, dan AI Layer sebagai input, dengan deskripsi umum hanya tersedia di `02_glossary.md` ("Learning Context" bukan business rule/entity independen). **Dampak:** FR yang bergantung pada Learning Context (FR-014, FR-015, FR-018) mengikuti definisi umum Glossary; detail struktur data perlu diklarifikasi saat implementasi.

11. **Akses AI Layer terhadap Knowledge Profile "melalui Business Layer" belum dijelaskan mekanismenya.**
    `42_ai_memory.md` menyatakan Knowledge Profile diakses AI "melalui business layer", tetapi tidak ada dokumen yang mendefinisikan lapisan/kontrak akses tersebut. **Dampak:** FR-018, FR-020, FR-023 bergantung pada mekanisme ini; kontrak akses perlu didefinisikan pada tingkat implementasi/API design (di luar scope PRD dan arsitektur saat ini).

12. **Full Knowledge Profile Engine berada di Phase 2.**
    MVP tidak menyelesaikan full Knowledge Profile Engine. Dashboard MVP dibatasi pada data State Machine dan Assessment Result saja, tanpa Knowledge Profile, hingga Knowledge Profile Engine aktif pada Phase 2.

---

# Traceability Summary

| Phase | Jumlah FR | Source Layer Utama |
|---|---|---|
| MVP (Phase 1) | FR-001 s/d FR-012, FR-012A, FR-012B, FR-012C, FR-016 | Learning Domain, Runtime, Product, AI Layer (terbatas), Engine |
| Phase 2 (Adaptive Learning) | FR-013 s/d FR-015, FR-017 | Engine |
| Phase 3 (AI Learning Companion) | FR-018 s/d FR-025 | AI Layer |
| Phase 4 (Educator Platform) | FR-026 s/d FR-027 | Product (sebagian Open Issue) |
| Future | Tidak ada FR — lihat Future Scope | Belum terdefinisi |

---

# Relationship with Architecture

PRD ini tunduk penuh pada:

* `00_foundation/00_overview.md` — Architecture Layer dan Canonical Learning Pipeline.
* `00_foundation/01_architecture_principles.md` — prinsip Single Source of Truth, Clear Ownership, Top-down Dependency.
* `00_foundation/02_glossary.md` — seluruh istilah yang digunakan pada PRD ini mengikuti definisi resmi Glossary; tidak ada istilah baru yang diperkenalkan.
* `99_architecture_decisions.md` — FR-012B dan seluruh FR pada Phase 3 (AI Learning Companion) tunduk pada AD-006, AD-007, AD-008, AD-009.

Setiap fitur pada PRD ini dapat ditelusuri ke satu atau lebih tahapan pada `50_user_journey.md` dan memiliki fase Roadmap yang jelas sesuai `51_roadmap.md`.

---

# Document Ownership

Dokumen ini merupakan **Product Requirement Document** untuk Kaifa v2, dimiliki oleh Product.

Dokumen ini tidak menggantikan dokumentasi arsitektur dan tidak berwenang mengubah definisi domain, engine, atau boundary AI yang telah dibekukan.

Setiap Functional Requirement baru yang memerlukan entitas atau business rule yang belum ada harus diajukan terlebih dahulu melalui Architecture Review sebelum ditambahkan ke PRD ini.

Perubahan terhadap PRD ini harus mempertimbangkan konsistensi dengan seluruh baseline architecture dan tidak boleh mendahului keputusan arsitektur yang belum diambil.

---

# 1. Requirement Priority

Priority Matrix berikut disusun konsisten dengan urutan fase pada `51_roadmap.md`. Prioritas tidak mengubah makna, isi, maupun nomor FR yang telah disetujui.

| FR | Requirement (Ringkas) | Phase | Priority |
|---|---|---|---|
| FR-001 | Definisi dan Pengelolaan Learning Program | MVP | Critical |
| FR-002 | Pemilihan Program Structure | MVP | Critical |
| FR-003 | Pengelolaan Learning Module | MVP | Critical |
| FR-004 | Pengelolaan Learning Design | MVP | Critical |
| FR-005 | Pengelolaan Learning Objective | MVP | Critical |
| FR-006 | Pelaksanaan Learning Activity dan Activity Result | MVP | Critical |
| FR-007 | Definisi Assessment Blueprint | MVP | Critical |
| FR-008 | Eksekusi Evaluasi oleh Assessment Engine | MVP | Critical |
| FR-009 | Content Delivery melalui Content Model | MVP | High |
| FR-010 | State Machine Pembelajaran | MVP | Critical |
| FR-011 | Event-Driven Coordination | MVP | High |
| FR-012 | Dashboard Progres Dasar | MVP | Medium |
| FR-012A | Public Landing Page | MVP | Medium |
| FR-012B | AI Conversation Practice text, voice-capable, and assessable | MVP | High |
| FR-012C | MVP Basic Learner Authentication | MVP | High |
| FR-013 | Pembentukan dan Pembaruan Knowledge Profile | Phase 2 | High |
| FR-014 | Penghasilan Learning Decision oleh Recommendation Engine | Phase 2 | High |
| FR-015 | Alur Pembelajaran Adaptif End-to-End | Phase 2 | High |
| FR-016 | Placement Test | MVP | High |
| FR-017 | Progress Analytics Dasar | Phase 2 | Medium |
| FR-018 | AI Personal Learning Agent sebagai Orchestrator | Phase 3 | High |
| FR-019 | AI Menjelaskan Learning Decision | Phase 3 | High |
| FR-020 | AI Memory Terpisah dari Knowledge Profile | Phase 3 | Medium |
| FR-021 | Integrasi AI Provider melalui AI Provider Gateway | Phase 3 | High |
| FR-022 | Graceful Degradation saat AI Tidak Tersedia | Phase 3 | High |
| FR-023 | AI Governance sebagai Kontrol Wajib | Phase 3 | High |
| FR-024 | Kapabilitas AI: Tutor, Coach, Practice Partner, dll. | Phase 3 | Medium |
| FR-025 | AI Menggunakan Learning Content sebagai Konteks | Phase 3 | Medium |
| FR-026 | Learner Monitoring oleh Educator | Phase 4 | Medium |
| FR-027 | Class Management dan Assignment Review | Phase 4 | Low |

Catatan prioritas:

* **Critical** — FR yang tanpa itu Canonical Learning Pipeline pada fase terkait tidak dapat berjalan end-to-end (mis. Learning Program s/d Assessment Engine pada MVP).
* **High** — FR yang mendukung fungsi inti fase terkait tetapi memiliki dependensi tidak langsung (mis. Content Delivery, Event Coordination, Placement Test, dan boundary AI untuk MVP/Phase 3).
* **Medium** — FR pendukung yang meningkatkan pengalaman tetapi bukan penghambat alur inti (mis. Dashboard, Analytics dasar).
* **Low** — FR yang bergantung pada Open Issue yang belum terselesaikan di tingkat arsitektur (FR-027).

---

# 2. Acceptance Criteria

Acceptance Criteria berikut bersifat testable dan implementation-oriented, mengikuti proses/flow yang sudah didefinisikan pada dokumen arsitektur sumber masing-masing FR. Acceptance Criteria ini tidak memperkenalkan business rule baru maupun mendefinisikan ulang arsitektur.

**FR-001 Acceptance Criteria**
- Learning Program berhasil dibuat dengan identitas unik.
- Program Type wajib bernilai salah satu dari: Curriculum, Certification, Language, Book, Free Learning, Custom.
- Status lifecycle hanya dapat bernilai Draft, Published, atau Archived.
- Learning Program berstatus selain Published ditolak untuk proses enrollment baru.
- Event `LearningProgramCreated`, `LearningProgramUpdated`, `LearningProgramPublished`, atau `LearningProgramArchived` dipublikasikan sesuai perubahan status yang terjadi.

**FR-002 Acceptance Criteria**
- Learning Program hanya dapat ditautkan ke tepat satu Program Structure.
- Program Structure yang dipilih harus salah satu dari enam tipe resmi (Curriculum, CEFR, Book, Certification, Free Learning, Custom Structure).
- Penyimpanan Learning Program tanpa Program Structure ditolak sistem.
- Event `ProgramStructureAssigned` dipublikasikan setelah penetapan berhasil.

**FR-003 Acceptance Criteria**
- Learning Module berhasil dibuat dengan identitas unik.
- Setiap Learning Module tervalidasi berada pada tepat satu Program Structure.
- Setiap Learning Module tervalidasi memiliki tepat satu Learning Design terkait.
- Status lifecycle module mengikuti urutan Draft → Published → Archived.
- Event `LearningModuleCreated`, `LearningModuleUpdated`, `LearningModulePublished`, atau `LearningModuleArchived` dipublikasikan sesuai perubahan.

**FR-004 Acceptance Criteria**
- Learning Design tervalidasi diterapkan pada tepat satu Learning Module.
- Learning Design ditolak disimpan apabila tidak memiliki minimal satu Learning Objective.
- Prerequisite Rule dan Completion Rule dapat disimpan sebagai atribut opsional.
- Event `LearningDesignCreated` atau `LearningDesignUpdated` dipublikasikan sesuai perubahan.

**FR-005 Acceptance Criteria**
- Setiap Learning Objective tervalidasi memiliki Objective Statement.
- Setiap Learning Objective tervalidasi memiliki klasifikasi (Knowledge/Understanding/Application/Analysis/Evaluation/Creation).
- Setiap Learning Objective tervalidasi memiliki Mastery Criteria.
- Setiap Learning Objective tervalidasi terhubung ke tepat satu Learning Design.
- Event `LearningObjectiveCreated`, `LearningObjectiveUpdated`, atau `LearningObjectiveArchived` dipublikasikan sesuai perubahan.

**FR-006 Acceptance Criteria**
- Learner dapat memulai dan menyelesaikan Learning Activity sesuai Completion Criteria yang ditetapkan.
- Setiap Learning Activity tervalidasi merealisasikan tepat satu Learning Objective.
- Penyelesaian aktivitas menghasilkan Activity Result yang tersimpan.
- Event `LearningActivityCompleted` diikuti `ActivityResultGenerated` dipublikasikan secara berurutan.

**FR-007 Acceptance Criteria**
- Assessment Blueprint tervalidasi memiliki Assessment Strategy dari daftar resmi (Quiz, Assignment, Project, Portfolio, Observation, Speaking, Writing, Practical, Peer Review, AI Assisted).
- Assessment Blueprint tervalidasi memiliki Evaluation Criteria dan Mastery Criteria.
- Satu Assessment Blueprint dapat direferensikan oleh lebih dari satu Learning Activity dengan karakteristik hasil sejenis.
- Event `AssessmentBlueprintCreated` atau `AssessmentBlueprintUpdated` dipublikasikan sesuai perubahan.

**FR-008 Acceptance Criteria**
- Assessment Blueprint is resolved successfully.
- Activity Result is validated.
- Assessment Result is produced.
- `AssessmentCompleted` event is published.
- Invalid input is rejected gracefully.

**FR-009 Acceptance Criteria**
- Learning Content dapat dibuat dengan seluruh metadata minimum (Content ID, Title, Description, Type, Language, Difficulty, Estimated Duration, Version, Status).
- Hanya Learning Content berstatus Published yang dapat digunakan oleh Learning Activity.
- Satu Learning Content dapat direferensikan oleh lebih dari satu Learning Activity.
- Versi Learning Content yang lebih lama tetap tersimpan (tidak dihapus) saat versi baru diterbitkan.

**FR-010 Acceptance Criteria**
- Transisi state hanya terjadi apabila dipicu oleh event valid sesuai Event Model.
- Hanya satu state utama yang aktif pada satu waktu untuk satu alur pembelajaran.
- Urutan transisi mengikuti: Not Started → Learning → Assessing → Updating Knowledge Profile → Generating Learning Decision → Ready for Next Activity → Completed.
- Sistem kembali ke state Learning apabila masih terdapat aktivitas berikutnya, atau berpindah ke Completed apabila seluruh aktivitas selesai.

**FR-011 Acceptance Criteria**
- Setiap event yang dipublikasikan mengikuti format penamaan `<Entity><Past Tense>`.
- Setiap event tervalidasi hanya memiliki satu publisher resmi sesuai Event Ownership.
- Event yang telah dipublikasikan tidak dapat diubah (immutable).
- Penambahan consumer baru tidak mengubah publisher event yang sudah ada.

**FR-012 Acceptance Criteria**
- Dashboard menampilkan state pembelajaran learner saat ini sesuai State Machine.
- Dashboard menampilkan daftar Activity Result dan Assessment Result yang telah dihasilkan learner.
- Dashboard pada MVP tidak menampilkan atau membentuk Knowledge Profile, tidak memelihara competency mastery modeling, dan tidak menghasilkan adaptive Learning Decision; Knowledge Profile Engine dan Recommendation Engine baru aktif pada Phase 2.

**FR-012A Acceptance Criteria**
- Public Landing Page dapat diakses tanpa autentikasi.
- Landing Page hanya menyajikan informasi produk dan tidak membuat Enrollment.
- Landing Page tidak memicu Canonical Learning Pipeline.
- Landing Page tidak mengekspos data personal Learner.
- Landing Page tidak memperkenalkan entitas atau business rule domain baru.

**FR-012B Acceptance Criteria**
- Learner dapat memulai AI Conversation Practice untuk Learning Activity type Practice yang terhubung ke satu Learning Objective.
- Learner dapat berinteraksi menggunakan text.
- Kapabilitas voice, Speech-to-Text (STT), dan Text-to-Speech (TTS) tersedia dan wajib didukung pada MVP.
- Speech input melalui STT dikonversi menjadi canonical target-language transcript text.
- AI response dapat dirender sebagai text dan dibacakan melalui TTS.
- Target-language transcript ditampilkan untuk conversation messages.
- Percakapan Arabic menampilkan Arabic script dan mendukung RTL layout pada area percakapan yang relevan.
- Learner dapat menyalakan Indonesian translation untuk pesan AI dan learner.
- Optional transliteration dapat ditampilkan jika dibutuhkan.
- Canonical target-language transcript digunakan sebagai official conversation record.
- Translation dan transliteration ditandai sebagai learner support only dan bukan source of official assessment.
- AI Practice Partner menghasilkan conversation response, feedback text, practice guidance, serta Activity Result atau approved assessment evidence. Evidence dapat mencakup canonical target-language transcript, completion data, pronunciation-related metadata, dan activity evidence lain yang didukung untuk evaluasi Assessment Engine menggunakan Assessment Blueprint.
- Conversation dapat diselesaikan sebagai assessable Learning Activity.
- Official Assessment Result diproduksi oleh Assessment Engine menggunakan Assessment Blueprint dan Activity Result atau approved assessment evidence yang didukung, bukan oleh AI atau translation/transliteration.
- AI tidak membuat, memodifikasi, atau memiliki Assessment Result.
- AI tidak memperbarui Knowledge Profile atau menghasilkan Learning Decision.
- AI tidak membuat atau mengubah official Learning Content.
- Translation support tidak membuat Learning Decision, memperbarui Knowledge Profile, mengubah Learning Content, atau mempublikasikan Official Runtime Events.
- AI Conversation Practice tidak mempublikasikan Official Runtime Events secara langsung.
- AI menggunakan Published Learning Content sebagai konteks di mana berlaku.
- Seluruh interaksi AI Conversation Practice dicatat sebagai audit/observability record.
- Learner dapat memilih berinteraksi dengan text atau menggunakan kapabilitas voice yang tersedia.
- Kegagalan AI Provider ditangani sesuai Graceful Degradation (AD-009); Learning Activity tetap dapat dilanjutkan tanpa AI.

**FR-012C Acceptance Criteria**
- Minimal dua Learner dapat login ke sistem dengan akun terpisah.
- Login berhasil membangun Learner context aktif.
- Data Learner (Learning Activity, AI Conversation Practice, Dashboard) terisolasi per Learner aktif.
- Logout berhasil mengakhiri sesi Learner.
- `GET /api/v1/auth/me` atau ekuivalen mengembalikan referensi Learner yang sedang aktif.
- Learning Activity menggunakan Learner context aktif dari sesi yang berjalan.
- AI Conversation Practice menggunakan Learner context aktif dari sesi yang berjalan.
- Dashboard menampilkan data milik Learner aktif.
- Tidak ada public signup dalam MVP.
- Login tidak membuat Enrollment.
- Login tidak memicu Canonical Learning Pipeline.
- Login tidak mempublikasikan official Runtime Event.

**FR-013 Acceptance Criteria**
- Assessment Result yang valid memicu proses pembaruan Knowledge Profile.
- Pembaruan Knowledge Profile bersifat incremental, tidak membangun ulang seluruh profil.
- Event `KnowledgeProfileUpdated` dipublikasikan setelah pembaruan berhasil disimpan.
- Kegagalan pembaruan menghasilkan event kegagalan yang dapat dipantau monitoring.

**FR-014 Acceptance Criteria**
- Recommendation Engine menghasilkan tepat satu Learning Decision per siklus evaluasi.
- Learning Decision yang dihasilkan merupakan salah satu dari tujuh jenis resmi (Next Module, Review Module, Repeat Activity, Take Assessment, Continue Learning, Complete Module, Complete Program).
- Input yang identik menghasilkan Learning Decision yang konsisten (deterministic).
- Event `LearningDecisionGenerated` dipublikasikan setelah keputusan dihasilkan.

**FR-015 Acceptance Criteria**
- Seluruh tahapan Canonical Learning Pipeline (Learning Activity → Activity Result → Assessment Blueprint → Assessment Engine → Assessment Result → Knowledge Profile → Learning Decision) dapat dieksekusi tanpa intervensi manual.
- Tidak ada pemanggilan AI Layer yang terjadi dalam pipeline pada Phase 2.
- Setiap tahap pipeline menghasilkan event sesuai `21_event_model.md`.

**FR-016 Acceptance Criteria**
- Learner dapat memulai Placement Test pada MVP.
- Placement Test direpresentasikan sebagai specialized assessable Learning Activity.
- Placement Test completion menghasilkan Activity Result.
- Placement Test result dievaluasi melalui Assessment Blueprint dan Assessment Engine.
- Assessment Engine menghasilkan Assessment Result resmi untuk Placement Test.
- Placement result dapat menentukan atau menyarankan learner starting point.
- Placement starting point suggestion bukan Learning Decision dan tidak memanggil Recommendation Engine pada MVP.
- Tidak ada Placement Test domain entity baru yang diperkenalkan.
- Placement Test tidak mengaktifkan full adaptive Learning Decision atau Recommendation Engine pada MVP.

**FR-017 Acceptance Criteria**
- Profile Metadata, Evaluation Metadata, dan Recommendation Metadata tersedia untuk dikonsumsi pihak Analytics.
- Konsumsi metadata tidak memodifikasi Knowledge Profile, Assessment Result, atau Learning Decision resmi.

**FR-018 Acceptance Criteria**
- Agent berhasil menyusun AI Context dari seluruh sumber resmi (Learning Decision, Knowledge Profile, Learning Content, AI Memory, Conversation Context, Learning Context).
- Agent menghasilkan AI Conversation Experience sebagai output percakapan.
- Agent tidak menghasilkan Learning Decision, Assessment Result, atau Knowledge Profile baru dalam bentuk apa pun.

**FR-019 Acceptance Criteria**
- Respons AI mereferensikan Learning Decision resmi yang sedang berlaku tanpa mengubah isinya.
- Respons AI yang bertentangan dengan Learning Decision aktif ditolak atau ditandai oleh AI Governance sebelum disampaikan ke learner.

**FR-020 Acceptance Criteria**
- AI Memory disimpan pada struktur data yang terpisah dari Knowledge Profile.
- Proses retrieval AI Memory tidak menimpa atau mengubah nilai Knowledge Profile.
- Learner dapat melihat dan menghapus AI Memory miliknya sesuai kebijakan governance yang berlaku.

**FR-021 Acceptance Criteria**
- Seluruh permintaan ke AI Provider melewati satu titik akses resmi (AI Provider Gateway).
- Fallback provider aktif secara otomatis ketika provider utama gagal, sesuai Fallback Strategy.
- Tidak ditemukan modul aplikasi yang memanggil AI Provider secara langsung tanpa melalui Gateway.

**FR-022 Acceptance Criteria**
- Ketika AI Provider tidak tersedia, Learning Decision tetap dapat diakses dan ditampilkan kepada learner.
- Proses inti (Learning Activity, Assessment, Knowledge Profile Update) tetap berjalan tanpa keterlibatan AI.
- Sistem menampilkan indikasi fallback non-AI yang jelas kepada learner.

**FR-023 Acceptance Criteria**
- Setiap permintaan capability AI diperiksa terhadap AI Authority Matrix sebelum dieksekusi.
- Permintaan yang melanggar boundary (mis. mencoba mengubah Assessment Result atau Knowledge Profile) ditolak sistem.
- Log audit minimum (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error) tercatat untuk setiap interaksi AI.

**FR-024 Acceptance Criteria**
- Setiap kapabilitas AI yang diaktifkan (Tutor/Coach/Practice Partner/Explanation/Reflection/Socratic/Feedback Support) menghasilkan output sesuai kategori yang diminta.
- Tidak ada kapabilitas AI yang menghasilkan perubahan pada Learning Content, Assessment Result, atau Knowledge Profile resmi.

**FR-025 Acceptance Criteria**
- AI dapat mengutip dan menjelaskan Learning Content yang berstatus Published.
- AI tidak dapat menulis atau mengubah Learning Content resmi melalui interaksi percakapan apa pun.

**FR-026 Acceptance Criteria**
- Educator dapat melihat state pembelajaran, Knowledge Profile, dan Learning Decision milik learner yang berada dalam kewenangannya.
- Data yang ditampilkan bersumber langsung dari State Machine, Knowledge Profile Engine, dan Recommendation Engine tanpa duplikasi atau kalkulasi baru.
- Mekanisme otorisasi akses Educator terhadap data learner tetap tercatat sebagai Open Issue (lihat Assumptions & Open Issues) sampai diklarifikasi melalui architecture review.

**FR-027 Acceptance Criteria**
- Review tugas oleh Educator tidak menghasilkan Assessment Result baru di luar jalur resmi Assessment Engine.
- Setiap perubahan yang berkaitan dengan Manual Assessment/Peer Review dicatat sebagai Open Issue sampai alur integrasinya dengan Assessment Engine diklarifikasi melalui architecture review.

---

# 3. Non-Functional Requirements

Non-Functional Requirement (NFR) berikut hanya mencakup hal-hal yang **sudah tersirat** dalam dokumen arsitektur frozen. Tidak ada NFR yang diperkenalkan di luar cakupan arsitektur.

### Performance

Recommendation Engine dan Assessment Engine harus menghasilkan output secara deterministik untuk input yang sama, sesuai prinsip Deterministic Decision/Deterministic Evaluation. AI Provider Gateway harus memantau Latency sebagai bagian dari Observability.
*Source: `30_assessment_engine.md`, `32_recommendation_engine.md`, `41_ai_provider_integration.md`*

### Availability

Apabila AI Provider gagal, proses pembelajaran inti (Learning Activity, Assessment Engine, Knowledge Profile Engine) harus tetap berjalan (Graceful Degradation). AI failure tidak boleh menghentikan Canonical Learning Pipeline.
*Source: `40_ai_architecture.md`, `41_ai_provider_integration.md` — Related AD: AD-009*

### Reliability

Assessment Engine dan Knowledge Profile Engine bersifat stateless dan deterministic; input yang sama harus menghasilkan output yang konsisten. Setiap kegagalan menghasilkan event error yang dapat dipantau.
*Source: `30_assessment_engine.md`, `31_knowledge_profile_engine.md` — Related AD: AD-004*

### Scalability

Arsitektur bersifat event-driven sehingga consumer dapat bertambah tanpa mengubah publisher. AI Layer mendukung Multi Provider agar dapat diskalakan tanpa bergantung pada satu vendor.
*Source: `21_event_model.md`, `41_ai_provider_integration.md` — Related AD: AD-003, AD-008*

### Security

AI Provider harus memenuhi Authentication, Authorization, Encryption, Rate Limiting, Monitoring, dan Logging. Prompt Injection harus dicegah dan Sensitive Data harus disanitasi sebelum dikirim ke AI Provider.
*Source: `44_ai_governance.md`, `41_ai_provider_integration.md`*

### Privacy

AI hanya menggunakan data yang telah diizinkan (Privacy by Design). Conversation History tidak boleh digunakan di luar kebutuhan pembelajaran tanpa persetujuan. AI Memory mengikuti Data Minimization dan Expiration Policy.
*Source: `44_ai_governance.md`, `42_ai_memory.md` — Related AD: AD-007*

### Auditability

Seluruh interaksi AI harus dapat ditelusuri, minimal mencatat Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, dan Error.
*Source: `44_ai_governance.md` — Related AD: AD-006*

### Observability

AI Provider Gateway harus menyediakan metrik Request Count, Success Rate, Error Rate, Latency, Cost per Request, Token Usage, dan Provider Availability. AI Personal Learning Agent harus mendukung observability untuk conversation request, context retrieval, provider call, response latency, error rate, fallback usage, memory update, dan governance decision.
*Source: `41_ai_provider_integration.md`, `43_ai_personal_learning_agent.md`*

### Accessibility

Accessibility disebutkan sebagai Cross-Cutting Capability yang dikembangkan secara bertahap di seluruh fase Roadmap.
*Source: `51_roadmap.md`*

### Localization

Learning Content memiliki atribut Language, dan Localization disebutkan sebagai Cross-Cutting Capability pada Roadmap.
*Source: `22_content_model.md`, `51_roadmap.md`*

### Maintainability

Arsitektur mengikuti prinsip Modular, Extensible ("open for extension, closed for modification"), dan Layered Architecture sehingga perubahan pada satu layer tidak memaksa perubahan besar pada layer lain.
*Source: `01_architecture_principles.md`, `00_overview.md` — Related AD: AD-001*

---

# 4. MVP Success Metrics

KPI berikut merupakan metrik produk (product metrics) dan tidak mendefinisikan ulang arsitektur. KPI ini diselaraskan dengan Success Metrics pada `51_roadmap.md`.

| KPI | Deskripsi | Terkait Fase |
|---|---|---|
| Learning Completion Rate | Persentase learner yang menyelesaikan Learning Activity/Module/Program yang dimulai. | MVP |
| Assessment Completion Rate | Persentase Activity Result yang berhasil dievaluasi menjadi Assessment Result melalui Assessment Engine. | MVP |
| Active Learners | Jumlah learner yang aktif menjalankan Learning Activity dalam periode tertentu. | MVP |
| Learning Session Duration | Rata-rata durasi sesi belajar learner pada state Learning. | MVP |
| System Availability | Persentase waktu sistem inti (non-AI) tersedia sesuai prinsip Graceful Degradation. | MVP |
| Recommendation Acceptance Rate | Persentase Learning Decision yang diikuti learner sesuai arahan Recommendation Engine. | Phase 2 (dibangun basisnya sejak MVP) |
| AI Conversation Usage | Frekuensi penggunaan AI Conversation Practice text dan voice-capable oleh learner. | MVP |

> Catatan: Recommendation Acceptance Rate baru dapat diukur penuh setelah Phase 2 aktif. AI Conversation Usage mulai menjadi metrik MVP untuk AI Conversation Practice terbatas, sedangkan metrik Full AI Learning Companion tetap mengikuti Phase 3.

---

# 5. Product Risks & Mitigation

Tabel risiko berikut menggunakan Open Issues yang telah teridentifikasi pada bagian Assumptions & Open Issues dan menambahkan batasan eksplisit untuk AI Assisted assessment, voice-capable MVP interaction, serta translation/transliteration support.

| Risk | Impact | Mitigation | Related Architecture Decision |
|---|---|---|---|
| Enrollment belum memiliki domain pemilik | MVP tidak dapat mengimplementasikan alur enrollment secara lengkap dan traceable | Ajukan Enrollment sebagai domain baru melalui Architecture Review sebelum implementasi MVP dimulai | AD-002, AD-010 |
| Advanced Authentication belum memiliki dasar arsitektur lengkap | Kapabilitas lanjutan (public signup, OAuth, MFA, SSO, Educator account, role management) tidak dapat diimplementasikan tanpa mendefinisikan entitas baru | MVP menggunakan Basic Learner Authentication terbatas (FR-012C); Advanced Authentication tetap Open Issue dan diselesaikan melalui Architecture Review di fase selanjutnya | AD-010 |
| Analytics tidak memiliki dokumen kepemilikan | Data metadata dari Engine berisiko diinterpretasikan tidak konsisten oleh tim berbeda | Batasi implementasi Analytics pada metadata yang sudah ada dari Engine; ajukan kepemilikan resmi Analytics melalui Architecture Review | AD-010 |
| Notification tidak dibahas di arsitektur manapun | Kapabilitas Notification pada Roadmap Phase 5 tidak dapat diimplementasikan tanpa risiko memperkenalkan entitas baru | Tunda implementasi hingga domain Notification didefinisikan melalui Architecture Review | AD-002 |
| Achievement/Certificate tidak dimodelkan sebagai entitas | Kapabilitas Completion pada User Journey tidak dapat menghasilkan sertifikat/achievement resmi | Tunda implementasi hingga entitas Achievement didefinisikan melalui Architecture Review | AD-002 |
| Educator sebagai entitas/domain belum didefinisikan secara formal | Batasan akses dan tanggung jawab Educator terhadap data learner tidak jelas | Definisikan boundary akses Educator melalui Architecture Review sebelum Phase 4 diimplementasikan | AD-002, AD-010 |
| Manual Assessment/Peer Review belum terhubung eksplisit ke Assessment Engine | Hasil penilaian manual/peer berisiko tidak konsisten dengan Assessment Result resmi | Klarifikasi alur integrasi Manual Assessment ke Assessment Engine melalui Architecture Review sebelum Phase 4 | AD-004 |
| Strategi Assessment "AI Assisted" berpotensi bersinggungan dengan AI Boundary | Implementasi berisiko melanggar AD-006/AD-009 apabila AI dianggap menghasilkan Assessment Result | Route official scoring melalui Assessment Blueprint dan Assessment Engine; AI hanya boleh menyediakan transcript, voice transcript, dan practice signals sebagai evidence, serta tidak memiliki official result generation | AD-006, AD-009 |
| Voice-capable AI Practice berisiko disalahartikan sebagai voice product penuh | MVP dapat melebar menjadi real-time voice call, voice biometrics, atau standalone pronunciation certification | Batasi voice capability pada optional speech-to-text input, optional text-to-speech output, dan canonical transcript text; real-time voice call, voice biometrics, dan standalone pronunciation certification tetap out of scope sampai didefinisikan eksplisit | AD-006, AD-008, AD-009 |
| Translation/transliteration berisiko disalahartikan sebagai sumber assessment | Assessment dapat menjadi tidak konsisten jika Indonesian translation atau transliteration dipakai sebagai source resmi | Hanya Activity Result atau approved assessment evidence yang didukung—termasuk canonical transcript, completion data, pronunciation-related metadata, atau activity evidence lain—yang boleh digunakan untuk evaluasi Assessment Engine; translation dan transliteration hanya learner support aids | AD-006, AD-009 |
| Program Context (input Recommendation Engine) tidak didefinisikan strukturnya | Implementasi Recommendation Engine berisiko inkonsisten karena struktur input tidak jelas | Klarifikasi struktur Program Context melalui Architecture Review sebelum Phase 2 diimplementasikan | AD-002 |
| Learning Context digunakan luas tanpa definisi formal tunggal | Risiko interpretasi berbeda antar komponen yang mengonsumsi Learning Context | Rujuk definisi umum pada `02_glossary.md`; ajukan detail struktur melalui Architecture Review bila diperlukan | AD-010 |
| Akses AI Layer terhadap Knowledge Profile "melalui Business Layer" belum dijelaskan mekanismenya | AI Personal Learning Agent berisiko mengakses Knowledge Profile secara tidak konsisten atau tidak aman | Definisikan kontrak akses read-only AI terhadap Knowledge Profile melalui Architecture Review/API design | AD-007, AD-009 |
| Full Knowledge Profile Engine belum termasuk MVP | Dashboard atau alur MVP berisiko mengasumsikan Knowledge Profile Engine sudah aktif | Batasi Dashboard MVP tanpa Knowledge Profile; aktifkan penuh pada Phase 2 sesuai FR-013 | AD-002 |

---

# 6. Stakeholder & Ownership

Matriks berikut hanya mendeskripsikan tanggung jawab kerja (working responsibility) masing-masing pihak dalam mengimplementasikan PRD ini. Matriks ini **tidak** membuat ownership bisnis baru di luar Document Ownership yang telah ditetapkan pada setiap dokumen arsitektur.

| Stakeholder | Tanggung Jawab |
|---|---|
| Product | Memelihara PRD, memastikan traceability FR terhadap arsitektur frozen, memprioritaskan requirement sesuai Roadmap, mengelola Open Issues melalui Architecture Review. |
| Engineering | Mengimplementasikan FR sesuai Source Architecture Document tanpa menyimpang dari boundary layer (Learning Domain, Runtime, Engine, AI Layer), memastikan Event Model dan State Machine diimplementasikan sesuai kontrak. |
| QA | Memvalidasi Acceptance Criteria setiap FR, memastikan event yang dipublikasikan sesuai naming convention dan ownership, menguji skenario Failure Handling pada setiap Engine dan AI Layer. |
| Content Team | Menyediakan dan mengelola Learning Content sesuai Content Model (metadata, tipe, lifecycle), memastikan Learning Content yang digunakan Learning Activity berstatus Published. |
| AI Team | Mengimplementasikan AI Personal Learning Agent, AI Provider Integration, AI Memory, dan AI Governance sesuai boundary AD-006, AD-007, AD-008, AD-009; memastikan AI Authority Matrix dipatuhi. |
| Educator | Menggunakan kapabilitas Learner Monitoring dan Assignment Review (Phase 4) sesuai batasan akses yang berlaku; memberikan masukan terhadap kebutuhan Manual Assessment yang masih berstatus Open Issue. |
| Operations | Memantau Observability (Request Count, Success Rate, Error Rate, Latency, Provider Availability), menjaga Availability sistem inti, serta menangani eskalasi kegagalan Engine dan AI Provider sesuai Failure Handling. |

---

# 7. Traceability Summary (Final)

Tabel ringkasan akhir berikut melengkapi (bukan menggantikan) bagian *Traceability Summary* sebelumnya, dengan menambahkan kolom Priority per FR.

| FR | Architecture Layer | Source Document | Related AD | Priority |
|---|---|---|---|---|
| FR-001 | Learning Domain | `10_learning_program.md` | AD-002 | Critical |
| FR-002 | Learning Domain | `11_program_structure.md`, `10_learning_program.md` | AD-002 | Critical |
| FR-003 | Learning Domain | `13_learning_module.md` | AD-002 | Critical |
| FR-004 | Learning Domain | `12_learning_design.md` | AD-002 | Critical |
| FR-005 | Learning Domain | `14_learning_objective.md` | AD-002 | Critical |
| FR-006 | Learning Domain | `15_learning_activity.md` | AD-002, AD-005 | Critical |
| FR-007 | Learning Domain | `16_assessment_blueprint.md` | AD-002, AD-004 | Critical |
| FR-008 | Engine | `30_assessment_engine.md` | AD-004 | Critical |
| FR-009 | Runtime | `22_content_model.md` | AD-001 | High |
| FR-010 | Runtime | `20_state_machine.md` | AD-003 | Critical |
| FR-011 | Runtime | `21_event_model.md` | AD-003 | High |
| FR-012 | Runtime, Learning Domain, Engine | `20_state_machine.md`, `15_learning_activity.md`, `30_assessment_engine.md` | AD-003 | Medium |
| FR-012A | Product | `50_user_journey.md`, `51_roadmap.md` | AD-002 | Medium |
| FR-012B | Learning Domain, AI Layer | `15_learning_activity.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md` | AD-002, AD-006, AD-007, AD-008, AD-009 | High |
| FR-012C | Product / Application Layer | `50_user_journey.md`, `51_roadmap.md` | AD-002 | High |
| FR-013 | Engine | `31_knowledge_profile_engine.md` | AD-002, AD-007 | High |
| FR-014 | Engine | `32_recommendation_engine.md` | AD-006 | High |
| FR-015 | Learning Domain, Runtime, Engine | `00_overview.md`, `02_glossary.md`, `99_architecture_decisions.md` | AD-005 | High |
| FR-016 | Product, Learning Domain, Engine | `50_user_journey.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md` | AD-005 | High |
| FR-017 | Engine | `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` | AD-004 | Medium |
| FR-018 | AI Layer | `43_ai_personal_learning_agent.md`, `40_ai_architecture.md` | AD-009, AD-006 | High |
| FR-019 | AI Layer | `43_ai_personal_learning_agent.md`, `40_ai_architecture.md`, `44_ai_governance.md` | AD-006 | High |
| FR-020 | AI Layer | `42_ai_memory.md` | AD-007 | Medium |
| FR-021 | AI Layer | `41_ai_provider_integration.md` | AD-008 | High |
| FR-022 | AI Layer | `40_ai_architecture.md`, `41_ai_provider_integration.md` | AD-009 | High |
| FR-023 | AI Layer | `44_ai_governance.md` | AD-006, AD-007, AD-008, AD-009 | High |
| FR-024 | AI Layer | `43_ai_personal_learning_agent.md` | AD-006, AD-009 | Medium |
| FR-025 | AI Layer, Runtime | `22_content_model.md`, `40_ai_architecture.md` | AD-009 | Medium |
| FR-026 | Product, Runtime, Engine | `50_user_journey.md`, `20_state_machine.md`, `31_knowledge_profile_engine.md` | AD-002 | Medium |
| FR-027 | Product | `51_roadmap.md` | — | Low |
