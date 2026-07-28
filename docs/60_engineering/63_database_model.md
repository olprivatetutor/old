# Database Model — Kaifa v2

| Version | Status | Owner | Depends On | Used By | Last Updated |
| ------- | ------ | ----- | ---------- | ------- | ------------ |
| 1.1 | Freeze | Engineering | `60_srs.md`, `61_api_design_principles.md`, `60_engineering/62_api_spec.md`, `99_architecture_decisions.md` | Backend, API, Runtime, Engine, AI Layer | 2026-07-11 |

---

## 1. Purpose

Dokumen ini mendefinisikan **logical database model** untuk Kaifa v2.

Database model ini menyediakan struktur persistensi yang dibutuhkan untuk mendukung:

* domain state (Learning Domain),
* runtime state (State Machine, Event Model),
* engine output (Assessment Result, Knowledge Profile, Learning Decision),
* audit record,
* data terkait AI Layer.

Dokumen ini **tidak**:

* memiliki business rule apa pun (business rule tetap dimiliki Learning Domain sesuai AD-002),
* menentukan progres atau keputusan pembelajaran (Database tidak menentukan progres atau keputusan pembelajaran. Learning Decision hanya dihasilkan oleh Recommendation Engine, sedangkan Assessment Engine dan Knowledge Profile Engine hanya menghasilkan output sesuai tanggung jawab masing-masing.),
* menggantikan dokumen Domain (`10_learning_domain/*`), Runtime (`20_runtime/*`), Engine (`30_engine/*`), maupun AI (`40_ai/*`).

Database bersifat **implementation layer** yang menyimpan hasil dan state resmi yang dihasilkan oleh layer-layer di atasnya, bukan sumber kebenaran business rule.

---

## 2. Database Modeling Principles

1. **Architecture-First Data Model** — struktur tabel mengikuti Logical Entity Group pada arsitektur yang telah dibekukan (Freeze), bukan sebaliknya.
2. **Domain Owns Business Meaning** — kolom pada tabel Learning Domain hanya menyimpan atribut yang telah didefinisikan pada dokumen domain sumber (AD-002).
3. **Runtime Events Are Persisted for Auditability** — seluruh Domain Event dan Engine Event dipersist sebagai catatan immutable (AD-003, `21_event_model.md`).
4. **Engine Outputs Are Stored as Results, Not as Rules** — tabel Engine (mis. `assessment_result`, `knowledge_profile`) menyimpan hasil eksekusi, bukan definisi strategi/kriteria evaluasi.
5. **AI Memory Is Separate from Knowledge Profile** — kedua struktur data secara tegas dipisahkan pada level skema (AD-007).
6. **Soft Deletion Where Appropriate** — entitas Learning Domain dengan lifecycle Draft/Published/Archived menggunakan status Archived, bukan hard delete, konsisten dengan `62_api_spec.md` (`DELETE` dipetakan ke archive).
7. **Auditability by Default** — setiap perubahan pada entitas Engine dan Domain dapat ditelusuri melalui event dan/atau audit log.
8. **Stable Identifiers** — seluruh entitas memiliki identitas unik yang stabil dan direferensikan oleh entitas lain melalui ID, bukan melalui duplikasi data.
9. **No Direct Coupling to AI Provider Schemas** — struktur tabel AI Provider tidak dirancang mengikuti skema vendor tertentu (AD-008).
10. **Schema Should Support Future Provider Changes** — field spesifik provider disimpan pada kolom metadata/JSON generik, bukan sebagai kolom terstruktur permanen.
11. **No New Business Entity** — tabel yang tidak memiliki dasar dokumen arsitektur eksplisit ditempatkan sebagai *Future/Optional* dan dicatat pada Open Issues, tidak diperlakukan sebagai bagian dari MVP.

---

## 3. Logical Entity Groups

### A. Foundation / Identity / Ownership

> **Catatan penting:** MVP Basic Learner Authentication (FR-012C) kini dimasukkan dalam scope MVP dengan batasan terbatas: hanya `learner_auth_account` dan `auth_session` untuk minimal dua Learner. Advanced Authentication, User Profile, Enrollment, Organization, Role, dan Permission formal **tidak memiliki dokumen arsitektur pemilik** (lihat `60_srs.md` Bagian 18, Open Issue #1 yang diperbarui, #2, #6) dan tetap *Future/Optional*.

| Entity | MVP Status | Catatan |
|---|---|---|
| `learner` | MVP (minimal) | Menyimpan identitas stabil (stable reference) yang digunakan seluruh pipeline sebagai "Learner reference". Tidak menyimpan kredensial — kredensial disimpan di `learner_auth_account`. |
| `learner_auth_account` | MVP (minimal) | Menyimpan kredensial login minimal untuk Learner. Ditautkan ke `learner`. Hanya berisi field minimum untuk MVP login/session. Tidak menyimpan data learning, tidak menyimpan Enrollment. |
| `auth_session` | MVP (minimal) | Menyimpan sesi aktif Learner. Ditautkan ke `learner_auth_account` dan `learner`. Berakhir saat logout. |
| `educator` | Future / Optional | Educator disebut sebagai actor pada Glossary dan User Journey, namun belum memiliki entitas domain resmi (`52_prd.md` FR-026 note). |
| `organization` | Future / Optional | Tidak dibahas pada dokumen arsitektur manapun; disebut hanya pada Roadmap Phase 6 (Future Scope). |
| `user_account` | Future / Optional | Full user account untuk Advanced Authentication — belum diatur arsitektur (Advanced Authentication tetap Open Issue). |
| `role` | Future / Optional | Role Management disebut hanya pada Roadmap Phase 6. |
| `permission` | Future / Optional | Educator permission formal adalah Open Issue #6. |
| `enrollment` | Future / Optional | Enrollment belum memiliki domain pemilik (Open Issue #2); hanya aturan "Learning Program berstatus Published dapat digunakan untuk enrollment baru" yang dapat dipersist sebagai validasi, bukan sebagai entitas Enrollment penuh. |

### A1. Product / Landing Page (MVP)

| Entity | MVP Status | Catatan |
|---|---|---|
| `landing_page_config` | MVP (static/config) | Menyimpan konten Landing Page sebagai static configuration. Tidak menyimpan data Learner, tidak menyimpan Enrollment, tidak memiliki business rule domain. |

### B. Learning Domain (MVP — Freeze)

| Entity | MVP Status |
|---|---|
| `learning_program` | MVP |
| `program_structure` | MVP |
| `learning_module` | MVP |
| `learning_design` | MVP |
| `learning_objective` | MVP |
| `learning_activity` | MVP |
| `assessment_blueprint` | MVP |
| `content_item` (Learning Content) | MVP |
| `learning_context` | Future / Optional — disebut luas tetapi tanpa struktur data tunggal resmi (Open Issue #10) |

### C. Runtime (MVP)

| Entity | MVP Status |
|---|---|
| `learning_state` (representasi State Machine per Learner/Learning Context) | MVP |
| `state_transition` | MVP |
| `runtime_event` | MVP |
| `activity_result` | MVP |

### D. Engine

| Entity | MVP Status |
|---|---|
| `assessment_result` | MVP (Assessment Engine aktif sejak Phase 1) |
| `knowledge_profile` | Phase 2 (Knowledge Profile Engine aktif Phase 2) |
| `knowledge_profile_snapshot` | Phase 2 / Optional — untuk kebutuhan audit historis, bukan bagian dari Processing Flow inti |
| `learning_decision` | Phase 2 (Recommendation Engine aktif Phase 2) |

### E1. AI Layer — MVP (AI Conversation Practice)

| Entity | MVP Status | Catatan |
|---|---|---|
| `ai_practice_conversation` | MVP | Sesi AI Conversation Practice; ditautkan ke `learning_activity` (type Practice) dan `learning_objective`. Terpisah dari `knowledge_profile` dan `ai_memory` (Phase 3). |
| `ai_practice_message` | MVP | Pesan individual dalam satu sesi AI Conversation Practice, termasuk canonical target-language transcript, STT/TTS metadata untuk kapabilitas voice wajib, translation, dan transliteration sebagai learner support. |
| `ai_practice_assessment_evidence` | MVP | Approved evidence package untuk assessable AI Conversation Practice. Dikonsumsi Assessment Engine bersama `activity_result`/`assessment_blueprint`; bukan Assessment Result dan tidak berisi official score/mastery. |
| `ai_practice_provider_record` | MVP | Audit/observability record pemanggilan AI Provider Gateway per interaksi; terpisah dari business pipeline (bukan Official Runtime Event). |
| `ai_practice_safety_event` | MVP | Mencatat governance violation atau kondisi risiko (AI Authority Matrix) pada sesi AI Conversation Practice. |

### E. AI Layer (Phase 3)

| Entity | MVP Status |
|---|---|
| `ai_conversation` | Phase 3 |
| `ai_message` | Phase 3 |
| `ai_memory` | Phase 3 |
| `ai_context_snapshot` | Phase 3 / Optional — mendukung Explainability, tidak wajib pada Processing Flow inti |
| `ai_provider_request` | Phase 3 |
| `ai_provider_response` | Phase 3 |
| `ai_safety_event` | Phase 3 (governance violation logging) |

### F. Audit / Observability

| Entity | MVP Status |
|---|---|
| `audit_log` | MVP (minimal — perluasan penuh untuk AI pada Phase 3) |
| `system_event_log` | MVP (mencatat *Failed events* seperti `AssessmentFailed`, `KnowledgeProfileUpdateFailed`, `RecommendationFailed`) |
| `idempotency_key` | MVP |
| `outbox_event` | Future / Optional — pola implementasi (event outbox) untuk menjamin publikasi event yang konsisten; belum eksplisit diwajibkan oleh dokumen arsitektur manapun, dicatat pada Open Issues |

---

## 4. Entity Definitions

### 4.A Foundation / Identity

#### `learner`
* **Purpose:** Menyimpan identitas stabil Learner yang direferensikan oleh seluruh entitas Runtime, Engine, dan AI Layer.
* **Layer Owner:** Foundation (Product / Application Layer untuk auth).
* **Key Fields:** `learner_id` (stable identifier), `created_at`.
* **Relationships:** direferensikan oleh `learning_state`, `activity_result`, `assessment_result`, `knowledge_profile`, `learning_decision`, `ai_conversation`, `ai_memory`; ditautkan ke `learner_auth_account` (1-to-1 untuk MVP).
* **Notes / Constraints:** Tabel ini **tidak** menyimpan kredensial atau mekanisme login — kredensial disimpan di `learner_auth_account`. Field profil tambahan tidak boleh ditambahkan sebelum Architecture Review menyelesaikan Advanced Authentication.
* **MVP Status:** MVP (minimal, hanya sebagai stable reference).

#### `learner_auth_account`
* **Purpose:** Menyimpan kredensial login minimal untuk MVP Basic Learner Authentication. Tabel ini adalah satu-satunya pemilik data autentikasi Learner pada MVP.
* **Layer Owner:** Product / Application Layer (Authentication — MVP scope terbatas).
* **Key Fields:** `auth_account_id`, `learner_id` (FK ke `learner`), `username` atau `email` (identifier login), `password_hash`, `created_at`, `updated_at`.
* **Relationships:** 1-to-1 dengan `learner`; direferensikan oleh `auth_session`.
* **Notes / Constraints:** Tabel ini **tidak** menyimpan data learning, tidak menyimpan Enrollment, tidak menyimpan role atau permission. Tidak ada hubungan ke Learning Domain, Runtime, Engine, atau AI Layer. Advanced identity fields (OAuth token, MFA secret, password reset token, organization_id) **tidak ada** pada tabel ini — seluruhnya adalah Future / Optional.
* **MVP Status:** MVP (minimal, hanya untuk login/logout Learner).

#### `auth_session`
* **Purpose:** Menyimpan sesi aktif Learner setelah login berhasil. Berakhir saat logout atau expiry.
* **Layer Owner:** Product / Application Layer (Authentication — MVP scope terbatas).
* **Key Fields:** `session_id`, `auth_account_id` (FK ke `learner_auth_account`), `learner_id` (FK ke `learner`, denormalisasi untuk efisiensi lookup Learner context), `created_at`, `expires_at`, `ended_at` (nullable — diisi saat logout).
* **Relationships:** terkait ke `learner_auth_account` dan `learner`.
* **Notes / Constraints:** Tabel ini hanya menyimpan sesi aktif. Tidak memiliki business rule pembelajaran. Tidak menyimpan data Learning Activity, Assessment Result, Knowledge Profile, Learning Decision, atau AI Conversation. Session data tidak dikonsumsi oleh Engine atau AI Layer.
* **MVP Status:** MVP (minimal, hanya untuk session management Learner).

#### `educator`, `organization`, `user_account`, `role`, `permission`, `enrollment`
* **Purpose:** Placeholder struktural untuk kapabilitas yang disebut pada Roadmap/PRD tetapi belum memiliki dokumen arsitektur pemilik.
* **Layer Owner:** Tidak ada (Open Issue).
* **MVP Status:** Future / Optional — tidak dirancang secara rinci pada dokumen ini agar tidak memperkenalkan business entity baru (lihat Bagian 15, Open Issues).

---

### 4.B Learning Domain

#### `learning_program`
* **Purpose:** Menyimpan definisi dan lifecycle Learning Program.
* **Layer Owner:** Learning Domain (`10_learning_program.md`).
* **Key Fields:** `program_id`, `program_type` (Curriculum / Certification / Language / Book / Free Learning / Custom), `status` (Draft / Published / Archived), `version`.
* **Relationships:** satu `learning_program` → satu `program_structure`.
* **Notes / Constraints:** Status selain `Published` tidak boleh digunakan untuk enrollment baru (validasi persistensi, bukan business rule baru — mengikuti `10_learning_program.md`). Perubahan besar dilakukan melalui versioning, bukan overwrite.
* **MVP Status:** MVP.

#### `program_structure`
* **Purpose:** Menetapkan tipe struktur program yang ditautkan ke `learning_program`.
* **Layer Owner:** Learning Domain (`11_program_structure.md`).
* **Key Fields:** `program_structure_id`, `program_id` (FK), `structure_type` (Curriculum / CEFR / Book / Certification / Free Learning / Custom Structure).
* **Relationships:** satu `program_structure` → banyak `learning_module`.
* **Notes / Constraints:** `learning_program` tanpa `program_structure` tidak valid untuk disimpan sebagai Published.
* **MVP Status:** MVP.

#### `learning_module`
* **Purpose:** Menyimpan unit pembelajaran di dalam satu Program Structure.
* **Layer Owner:** Learning Domain (`13_learning_module.md`).
* **Key Fields:** `module_id`, `program_structure_id` (FK), `learning_design_id` (FK, 1:1), `module_type`, `status` (Draft / Published / Archived).
* **Relationships:** tepat satu `program_structure`; tepat satu `learning_design`.
* **Notes / Constraints:** Module dapat digunakan kembali pada versi `learning_program` berbeda (reference, bukan duplikasi data).
* **MVP Status:** MVP.

#### `learning_design`
* **Purpose:** Menyimpan blueprint pedagogis satu `learning_module`.
* **Layer Owner:** Learning Domain (`12_learning_design.md`).
* **Key Fields:** `learning_design_id`, `module_id` (FK), `prerequisite_rule` (opsional), `completion_rule` (opsional).
* **Relationships:** satu `learning_design` → banyak `learning_objective`.
* **Notes / Constraints:** Wajib memiliki minimal satu `learning_objective`; penyimpanan tanpa objective ditolak.
* **MVP Status:** MVP.

#### `learning_objective`
* **Purpose:** Menyimpan target kompetensi yang harus dicapai learner.
* **Layer Owner:** Learning Domain (`14_learning_objective.md`).
* **Key Fields:** `objective_id`, `learning_design_id` (FK), `objective_statement`, `classification` (Knowledge / Understanding / Application / Analysis / Evaluation / Creation), `mastery_criteria`, `priority`.
* **Relationships:** direalisasikan oleh satu atau lebih `learning_activity`; dievaluasi oleh satu atau lebih `assessment_blueprint`.
* **MVP Status:** MVP.

#### `learning_activity`
* **Purpose:** Menyimpan aktivitas pembelajaran yang direalisasikan learner untuk mencapai satu `learning_objective`.
* **Layer Owner:** Learning Domain (`15_learning_activity.md`).
* **Key Fields:** `activity_id`, `objective_id` (FK), `activity_type`, `participation_rule`, `completion_criteria`, `metadata`.
* **Relationships:** menghasilkan `activity_result`; dievaluasi menggunakan `assessment_blueprint`.
* **Notes / Constraints:** `learning_activity` tidak boleh menyimpan hasil evaluasi maupun tingkat penguasaan learner (tetap milik Assessment Engine/Knowledge Profile Engine). Placement Test direpresentasikan sebagai `learning_activity` dengan placement-specific metadata atau `purpose = Placement`; tidak ada tabel `placement_test`. Completion Placement Test menghasilkan `activity_result`, lalu Assessment Engine menghasilkan `assessment_result` menggunakan `assessment_blueprint`. Placement starting point suggestion dapat disimpan pada `assessment_result.outcome_payload` atau `assessment_result.evaluation_metadata`; suggestion ini bukan `learning_decision` dan tidak boleh mereferensikan invocation Recommendation Engine pada MVP.
* **MVP Status:** MVP.

#### `assessment_blueprint`
* **Purpose:** Menyimpan spesifikasi evaluasi untuk menilai `activity_result`.
* **Layer Owner:** Learning Domain (`16_assessment_blueprint.md`).
* **Key Fields:** `blueprint_id`, `objective_id` (FK), `assessment_strategy` (Quiz / Assignment / Project / Portfolio / Observation / Speaking / Writing / Practical / AI Assisted / Peer Review), `evaluation_criteria`, `assessment_method`, `mastery_criteria`, `metadata`.
* **Relationships:** dieksekusi oleh Assessment Engine untuk menghasilkan `assessment_result`.
* **Notes / Constraints:** `assessment_blueprint` **tidak menyimpan** hasil evaluasi, tidak memperbarui `knowledge_profile`, dan tidak menghasilkan `learning_decision` (AD-004).
* **MVP Status:** MVP.

#### `content_item`
* **Purpose:** Menyimpan Learning Content yang digunakan `learning_activity`.
* **Layer Owner:** Runtime — Content Model (`22_content_model.md`), as the official architecture owner for Learning Content persistence. This entity stores content resources, not runtime execution state.
* **Key Fields:** `content_id`, `title`, `description`, `content_type` (Article / Video / Audio / Interactive / Assessment Resource / Document / External Resource), `language`, `difficulty`, `estimated_duration`, `version`, `status` (Draft / Published / Archived).
* **Relationships:** digunakan oleh satu atau lebih `learning_activity`.
* **Notes / Constraints:** Hanya `content_item` berstatus Published yang dapat digunakan `learning_activity`; versi lama tetap tersimpan (tidak dihapus) saat versi baru diterbitkan.
* **MVP Status:** MVP.

#### `learning_context`
* **Purpose:** Placeholder struktural untuk konteks pembelajaran (Learning Program, Learning Module, Session State, Progress, Learning Decision, dll.) yang digunakan Runtime/Engine/AI Layer.
* **Layer Owner:** Tidak ada pemilik struktural resmi (Open Issue #10).
* **Notes / Constraints:** Karena tidak ada struktur data tunggal resmi, tabel ini tidak dirancang secara rinci; implementasi disarankan menggunakan referensi ke entitas terkait (`learning_program`, `learning_module`, `learning_state`) daripada duplikasi data.
* **MVP Status:** Future / Optional.

---

### 4.C Runtime

#### `learning_state`
* **Purpose:** Menyimpan state aktif Runtime (State Machine) untuk satu Learner pada satu alur pembelajaran.
* **Layer Owner:** Runtime (`20_state_machine.md`).
* **Key Fields:** `state_id`, `learner_id` (FK), `activity_id` (FK, nullable sesuai konteks), `current_state` (Not Started / Learning / Assessing / Updating Knowledge Profile / Generating Learning Decision / Ready for Next Activity / Completed), `updated_at`.
* **Relationships:** satu state aktif per alur pembelajaran (Single Active State).
* **Notes / Constraints:** Database dapat menegakkan constraint "satu state aktif per alur", tetapi **tidak** menentukan aturan bisnis kapan transisi diperbolehkan (aturan tersebut milik Runtime/Event Model).
* **MVP Status:** MVP.

#### `state_transition`
* **Purpose:** Mencatat riwayat perpindahan state untuk kebutuhan audit dan observability.
* **Layer Owner:** Runtime (`20_state_machine.md`, `21_event_model.md`).
* **Key Fields:** `transition_id`, `state_id` (FK), `from_state`, `to_state`, `triggering_event`, `transition_reason` (opsional), `occurred_at`, `actor_source` (Learner / System / Engine).
* **Relationships:** satu `learning_state` → banyak `state_transition` (append-only).
* **Notes / Constraints:** Transisi hanya sah bila dipicu oleh event valid; database dapat memvalidasi keberadaan `triggering_event`, tetapi tidak mendefinisikan validitas bisnis event tersebut.
* **MVP Status:** MVP.

#### `runtime_event`
* **Purpose:** Event store untuk seluruh Domain Event dan Engine Event.
* **Layer Owner:** Runtime (`21_event_model.md`).
* **Key Fields:** lihat Bagian 7 (Event Persistence Model).
* **Relationships:** direferensikan oleh `state_transition`, `audit_log`, dan proses replay/observability.
* **Notes / Constraints:** Immutable setelah dipublikasikan.
* **MVP Status:** MVP.

#### `activity_result`
* **Purpose:** Menyimpan hasil langsung pelaksanaan `learning_activity` sebelum dievaluasi.
* **Layer Owner:** Runtime. Record ini dihasilkan sebagai bagian dari behavior penyelesaian Learning Activity dan dipersist oleh Runtime.
* **Key Fields:** `activity_result_id`, `activity_id` (FK), `learner_id` (FK), `result_payload`, `evidence_reference` (nullable), `generated_at`.
* **Relationships:** dievaluasi menggunakan `assessment_blueprint` → menghasilkan `assessment_result`; dapat mereferensikan `ai_practice_assessment_evidence` untuk assessable AI Conversation Practice.
* **Notes / Constraints:** Konteks completion dibedakan secara konseptual melalui referensi `learning_activity` terkait, source/purpose metadata yang sudah ada pada Learning Activity, supported evidence references, dan completion context yang telah direpresentasikan canonical source data; Database Model tidak mendefinisikan enum klasifikasi Activity Result baru. `result_payload`, `evidence_reference`, dan `generated_at` adalah logical persistence field names untuk pilihan implementasi skema dan tidak menciptakan business meaning baru. Interpretasi bisnis tetap dimiliki frozen source documents; source/purpose meaning harus berasal dari metadata Learning Activity yang sudah ada atau canonical references. `activity_result` tetap non-evaluative dan bukan `assessment_result`: tidak berisi official score, mastery, pass/fail, atau `learning_decision`.
* **MVP Status:** MVP.

---

### 4.D Engine

#### `assessment_result`
* **Purpose:** Menyimpan hasil evaluasi yang dihasilkan Assessment Engine.
* **Layer Owner:** Engine — Assessment Engine (`30_assessment_engine.md`).
* **Key Fields:** `assessment_result_id`, `activity_result_id` (FK), `blueprint_id` (FK), `learner_id` (FK), `outcome_payload`, `evaluation_metadata`, `generated_at`.
* **Relationships:** menjadi input `knowledge_profile` (Phase 2). Untuk Placement Test dan assessable AI Conversation Practice, dapat menyimpan referensi evidence source metadata pada `evaluation_metadata`.
* **Notes / Constraints:** Immutable setelah dihasilkan (`64_engine_contracts.md`); satu siklus evaluasi hanya menghasilkan satu `assessment_result` (idempotency by `activity_result_id`). Tabel ini hanya ditulis oleh Assessment Engine; AI tidak menulis tabel ini. Mendukung Placement Test Assessment Result dan assessable AI Conversation Practice Assessment Result. Placement starting point suggestion dapat disimpan pada `outcome_payload` atau `evaluation_metadata`, tetapi bukan Learning Decision. Translation/transliteration tidak boleh menjadi official assessment source.
* **MVP Status:** MVP.

#### `knowledge_profile`
* **Purpose:** Representasi tingkat penguasaan learner terhadap pengetahuan dan kompetensi.
* **Layer Owner:** Engine — Knowledge Profile Engine (sole owner, `31_knowledge_profile_engine.md`, AD-007).
* **Key Fields:** `knowledge_profile_id`, `learner_id` (FK, unik), `profile_state` (representasi penguasaan, incremental), `last_assessment_result_id` (FK, basis pembaruan terakhir), `updated_at`.
* **Relationships:** dikonsumsi oleh `learning_decision` (Recommendation Engine) dan dibaca (read-only) oleh AI Layer.
* **Notes / Constraints:** Pembaruan wajib **incremental**, bukan rebuild total. Hanya Knowledge Profile Engine yang menulis tabel ini (AD-002, AD-007). AI Layer tidak boleh menulis ke tabel ini.
* **MVP Status:** Phase 2.

#### `knowledge_profile_snapshot`
* **Purpose:** Menyimpan salinan historis `knowledge_profile` pada titik waktu tertentu untuk kebutuhan audit/replay.
* **Layer Owner:** Engine — Knowledge Profile Engine.
* **Key Fields:** `snapshot_id`, `knowledge_profile_id` (FK), `profile_state_snapshot`, `snapshot_at`, `triggering_event_id` (FK ke `runtime_event`).
* **Notes / Constraints:** Bersifat opsional; tidak disebutkan sebagai wajib pada Processing Flow manapun. Ditujukan untuk mendukung Auditability (Bagian 11) dan Event Replay (Open Issues).
* **MVP Status:** Phase 2 / Optional.

#### `learning_decision`
* **Purpose:** Menyimpan keputusan pembelajaran yang dihasilkan Recommendation Engine.
* **Layer Owner:** Engine — Recommendation Engine (sole owner, `32_recommendation_engine.md`, AD-006).
* **Key Fields:** `learning_decision_id`, `learner_id` (FK), `knowledge_profile_id` (FK, basis keputusan), `decision_type` (Next Module / Review Module / Repeat Activity / Take Assessment / Continue Learning / Complete Module / Complete Program), `recommendation_metadata`, `generated_at`.
* **Relationships:** dikonsumsi oleh Application dan AI Personal Learning Agent (read-only).
* **Notes / Constraints:** Tepat satu `learning_decision` dihasilkan per siklus evaluasi (idempotency by `knowledge_profile_id` + siklus). AI Layer **tidak boleh** membuat atau mengubah baris pada tabel ini (AD-006).
* **MVP Status:** Phase 2.

---

### 4.A1 Product / Landing Page

#### `landing_page_config`
* **Purpose:** Menyimpan konten Landing Page (teks, metadata program) sebagai static configuration untuk MVP.
* **Layer Owner:** Product.
* **Key Fields:** `config_id`, `config_key`, `config_value`, `updated_at`.
* **Notes / Constraints:** Tidak menyimpan data personal Learner. Tidak membuat Enrollment. Tidak memiliki business rule domain. Konten bersifat static/config-based pada MVP; perubahan melalui deployment, bukan business logic.
* **MVP Status:** MVP (static/config).

---

### 4.E1 AI Layer — MVP (AI Conversation Practice)

#### `ai_practice_conversation`
* **Purpose:** Menyimpan sesi AI Conversation Practice yang ditautkan ke Learning Activity type Practice dan satu Learning Objective.
* **Layer Owner:** AI Layer (MVP-limited, sesuai `43_ai_personal_learning_agent.md` Practice Partner capability).
* **Key Fields:** `practice_conversation_id`, `learner_id` (FK), `activity_id` (FK — harus bertipe Practice), `objective_id` (FK — satu Learning Objective), `target_language`, `script`, `direction` (LTR / RTL), `started_at`, `ended_at` (nullable), `status` (Active / Completed / Abandoned).
* **Relationships:** satu `ai_practice_conversation` → banyak `ai_practice_message`; satu `ai_practice_conversation` → banyak `ai_practice_provider_record`; satu `ai_practice_conversation` → nol atau satu `ai_practice_assessment_evidence` untuk assessable completion.
* **Notes / Constraints:** Tabel ini terikat pada `learning_activity` type Practice dan satu Learning Objective. Mendukung target language metadata; untuk Arabic, `script` dan `direction` mendukung Arabic script dan RTL metadata. Tabel ini **tidak** menggantikan `ai_conversation` (Phase 3), bukan Assessment Result, bukan Knowledge Profile, dan bukan Learning Decision. Untuk assessable practice, conversation dapat direferensikan tidak langsung melalui `activity_result` / approved assessment evidence yang digunakan Assessment Engine. AI tidak menulis ke `assessment_result`, `knowledge_profile`, atau `learning_decision`.
* **MVP Status:** MVP.

#### `ai_practice_message`
* **Purpose:** Menyimpan pesan individual dalam satu sesi AI Conversation Practice.
* **Layer Owner:** AI Layer.
* **Key Fields:** `message_id`, `practice_conversation_id` (FK), `sender` (Learner / AIPartner), `content`, `canonical_target_language_transcript`, `target_language`, `script`, `direction`, `input_type` (text / learner_audio / voice_transcript), `audio_input_reference` (nullable), `voice_transcript_metadata` (JSON, nullable; recording/processing/permission/retry state), `tts_metadata` (JSON, nullable; audio/playback metadata), `audio_output_reference` (nullable), `translation_payload` (JSON, nullable), `transliteration_payload` (JSON, nullable), `learner_support_metadata` (JSON, nullable), `created_at`.
* **Notes / Constraints:** Bukan Learning Content, bukan Assessment Result, bukan Learning Decision. `content`/display message tidak selalu menjadi official assessment source; canonical target-language transcript adalah official conversation record. `translation_payload` mendukung Indonesian translation toggle, sedangkan `transliteration_payload` mendukung optional transliteration. Translation/transliteration hanya learner support dan tidak boleh digunakan sebagai official assessment source. Raw audio storage tidak wajib pada MVP. MVP dapat menyimpan provider/object-storage reference atau metadata reference untuk audio input/output dan transcript, bukan raw audio. Audio reference dan transcript bukan Assessment Result; canonical target-language transcript tetap official conversation record.
* **MVP Status:** MVP.

#### `ai_practice_assessment_evidence`
* **Purpose:** Menyimpan approved evidence package untuk assessable AI Conversation Practice sebelum dikonsumsi Assessment Engine.
* **Layer Owner:** AI Layer / Runtime boundary untuk evidence packaging; official scoring tetap milik Assessment Engine.
* **Key Fields:** `evidence_id`, `practice_conversation_id` (FK), `activity_result_id` (FK, nullable sampai completion), `selected_message_ids` (JSON array atau relation table implementasi), `evidence_payload` (JSON), `approved_at`, `created_at`.
* **Relationships:** mereferensikan `ai_practice_conversation`, selected `ai_practice_message`, dan opsional `activity_result`; dikonsumsi Assessment Engine bersama `activity_result` dan `assessment_blueprint`.
* **Notes / Constraints:** Bukan Assessment Result dan tidak mengandung official score/mastery. Translation/transliteration dikecualikan dari official assessment source; evidence dapat memuat canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain yang didukung. Tabel ini tidak menulis `assessment_result`, `knowledge_profile`, atau `learning_decision`.
* **MVP Status:** MVP.

#### `ai_practice_provider_record`
* **Purpose:** Menyimpan audit/observability record setiap pemanggilan AI Provider Gateway selama sesi AI Conversation Practice.
* **Layer Owner:** AI Layer — AI Provider Integration (AD-008).
* **Key Fields:** `record_id`, `practice_conversation_id` (FK), `message_id` (FK, nullable), `provider_name`, `model_name`, `prompt_version`, `request_metadata` (JSON generik), `response_metadata` (JSON generik), `token_usage`, `latency_ms`, `error_code` (nullable), `created_at`.
* **Notes / Constraints:** Field spesifik provider hanya disimpan pada `request_metadata`/`response_metadata` (JSON generik), tidak sebagai kolom terstruktur permanen (Prinsip 9 & 10). Audit/observability only: bukan Official Runtime Event dan bukan official assessment source kecuali data yang relevan ditransformasikan menjadi `ai_practice_assessment_evidence` yang approved.
* **MVP Status:** MVP.

#### `ai_practice_safety_event`
* **Purpose:** Mencatat pelanggaran AI Authority Matrix atau kondisi risiko pada sesi AI Conversation Practice.
* **Layer Owner:** AI Layer — AI Governance (`44_ai_governance.md`).
* **Key Fields:** `safety_event_id`, `practice_conversation_id` (FK, nullable), `event_category`, `detail_metadata`, `occurred_at`.
* **MVP Status:** MVP.

---

### 4.E AI Layer

#### `ai_conversation`
* **Purpose:** Menyimpan sesi percakapan antara Learner dan AI Personal Learning Agent.
* **Layer Owner:** AI Layer (`43_ai_personal_learning_agent.md`).
* **Key Fields:** `conversation_id`, `learner_id` (FK), `learning_decision_ref` (FK, nullable), `started_at`, `ended_at`.
* **Relationships:** satu `ai_conversation` → banyak `ai_message`.
* **MVP Status:** Phase 3.

#### `ai_message`
* **Purpose:** Menyimpan pesan individual dalam satu `ai_conversation` (AI Conversation Experience).
* **Layer Owner:** AI Layer.
* **Key Fields:** `message_id`, `conversation_id` (FK), `sender` (Learner / Agent), `content`, `used_context_refs` (referensi Learning Decision/Knowledge Profile/Content yang digunakan), `created_at`.
* **Notes / Constraints:** AI Conversation Experience bukan Learning Content, bukan Learning Decision, bukan Assessment Result — tabel ini tidak boleh diperlakukan sebagai sumber kebenaran salah satu dari ketiganya.
* **MVP Status:** Phase 3.

#### `ai_memory`
* **Purpose:** Menyimpan konteks percakapan dan preferensi learner untuk personalisasi.
* **Layer Owner:** AI Layer — AI Memory (sole owner, `42_ai_memory.md`, AD-007).
* **Key Fields:** `memory_id`, `learner_id` (FK), `memory_type` (Session / Short-Term / Long-Term / Episodic / Semantic), `memory_content`, `source_conversation_id` (FK, opsional), `created_at`, `expires_at` (opsional).
* **Relationships:** dikonsumsi oleh `ai_conversation`/Agent; **tidak** direferensikan oleh `knowledge_profile`.
* **Notes / Constraints:** Secara tegas terpisah dari `knowledge_profile` pada level skema (tabel berbeda, tidak ada foreign key langsung yang menyiratkan hierarki). Learner dapat melihat dan menghapus miliknya sendiri sesuai kebijakan governance.
* **MVP Status:** Phase 3.

#### `ai_context_snapshot`
* **Purpose:** Menyimpan salinan AI Context Hierarchy (Learning Decision → Knowledge Profile → Learning Content → Conversation Context → AI Memory) yang digunakan pada satu interaksi, untuk kebutuhan Explainability.
* **Layer Owner:** AI Layer.
* **Key Fields:** `snapshot_id`, `message_id` (FK), `context_hierarchy_payload`, `created_at`.
* **Notes / Constraints:** Opsional; mendukung Auditability tetapi tidak wajib pada Processing Flow resmi manapun.
* **MVP Status:** Phase 3 / Optional.

#### `ai_provider_request` / `ai_provider_response`
* **Purpose:** Menyimpan request/response provider-agnostic untuk setiap pemanggilan AI Provider Gateway.
* **Layer Owner:** AI Layer — AI Provider Integration (`41_ai_provider_integration.md`, AD-008).
* **Key Fields (request):** `request_id`, `message_id` (FK), `provider_name`, `model_name`, `request_metadata` (JSON), `prompt_version`, `created_at`.
* **Key Fields (response):** `response_id`, `request_id` (FK), `response_metadata` (JSON), `token_usage`, `latency_ms`, `safety_status`, `error_code` (nullable), `created_at`.
* **Notes / Constraints:** Field spesifik provider hanya boleh disimpan pada `request_metadata`/`response_metadata` (JSON generik), tidak sebagai kolom terstruktur permanen (Prinsip 9 & 10, Bagian 2).
* **MVP Status:** Phase 3.

#### `ai_safety_event`
* **Purpose:** Mencatat pelanggaran AI Authority Matrix atau kondisi risiko lain (mis. Governance Violation, Prompt Injection terdeteksi).
* **Layer Owner:** AI Layer — AI Governance (`44_ai_governance.md`).
* **Key Fields:** `safety_event_id`, `message_id` (FK, nullable), `event_category`, `detail_metadata`, `occurred_at`.
* **MVP Status:** Phase 3.

---

### 4.F Audit / Observability

#### `audit_log`
* **Purpose:** Mencatat perubahan penting pada resource yang memerlukan ketertelusuran.
* **Layer Owner:** Cross-cutting (dikonsumsi seluruh layer, tidak dimiliki satu domain).
* **Key Fields:** `audit_id`, `entity_type`, `entity_id`, `action`, `actor_id` (nullable — Authentication adalah Open Issue), `occurred_at`, `correlation_id`, `related_event_id` (FK ke `runtime_event`, opsional).
* **MVP Status:** MVP (minimal); diperluas Phase 3 untuk audit interaksi AI (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error — `44_ai_governance.md`).

#### `system_event_log`
* **Purpose:** Mencatat event kegagalan operasional (mis. `AssessmentFailed`, `KnowledgeProfileUpdateFailed`, `RecommendationFailed`) untuk kebutuhan monitoring.
* **Layer Owner:** Cross-cutting / Operations.
* **Key Fields:** `log_id`, `event_type`, `error_code`, `retryable` (boolean), `correlation_id`, `occurred_at`.
* **MVP Status:** MVP.

#### `idempotency_key`
* **Purpose:** Mencegah eksekusi ganda pada operasi yang berpotensi dipanggil berulang (retry jaringan, replay event).
* **Layer Owner:** Cross-cutting (`61_api_design_principles.md` Bagian "Idempotency", `62_api_spec.md` Bagian 19).
* **Key Fields:** `idempotency_key` (unik), `operation_type`, `reference_id` (mis. `activity_result_id` untuk Assessment Engine, `knowledge_profile_id`+siklus untuk Recommendation Engine), `result_reference`, `created_at`.
* **MVP Status:** MVP.

#### `outbox_event`
* **Purpose:** Pola implementasi (transactional outbox) untuk menjamin publikasi event yang konsisten dengan perubahan data.
* **Layer Owner:** Infrastruktur (bukan bagian dari Event Model konseptual — `21_event_model.md` menyatakan implementasi message broker Out of Scope).
* **Notes / Constraints:** Belum diwajibkan secara eksplisit oleh dokumen arsitektur manapun; dicatat sebagai Open Issue apakah `runtime_event` dan `outbox_event` merupakan tabel fisik yang sama atau terpisah.
* **MVP Status:** Future / Optional.

---

## 5. Relationship Model

Model relasi utama mengikuti Canonical Learning Pipeline (AD-005) secara ketat. Pipeline penuh tetap mencakup Phase 2 Knowledge Profile dan Learning Decision, tetapi MVP hanya mengaktifkan bagian yang dibutuhkan untuk Learning Activity, Activity Result, Assessment Engine, dan Assessment Result.

```text
learning_activity
        │ produces
        ▼
activity_result
        │ evaluated using
        ▼
assessment_blueprint  (domain-owned — mendefinisikan aturan, tidak mengeksekusi)
        │ executed by
        ▼
Assessment Engine
        │ produces
        ▼
assessment_result  (engine output)
        │ updates in Phase 2
        ▼
knowledge_profile  (Phase 2 — sole owner: Knowledge Profile Engine)
        │ drives in Phase 2
        ▼
learning_decision  (Phase 2 — dihasilkan oleh Recommendation Engine)
        │ consumed by Phase 3 AI read-only
        ▼
AI Layer (ai_conversation / ai_message)
```

MVP Placement Test path:

```text
learning_activity (purpose = Placement)
        │ completion produces
        ▼
activity_result
        │ evaluated by Assessment Engine using assessment_blueprint
        ▼
assessment_result
        │ may include
        ▼
Placement starting point suggestion (not learning_decision; no Recommendation Engine invocation in MVP)
```

MVP assessable AI Conversation Practice path:

```text
ai_practice_conversation / ai_practice_message
        │ selected canonical transcript/evidence
        ▼
ai_practice_assessment_evidence
        │ referenced by completion
        ▼
activity_result
        │ evaluated by Assessment Engine using assessment_blueprint
        ▼
assessment_result
```

Penjelasan kepemilikan:

* `activity_result` adalah Runtime record yang dipersist oleh Runtime sebagai bagian dari behavior penyelesaian `learning_activity`; `learning_activity` tetap dimiliki Learning Domain.
* `assessment_blueprint` adalah domain-owned — hanya mendefinisikan spesifikasi evaluasi, tidak pernah menyimpan hasil evaluasi.
* `assessment_result` adalah engine output — hanya ditulis oleh Assessment Engine. AI Layer dan tabel AI Practice tidak menulis tabel ini.
* Placement starting point suggestion bukan `learning_decision` dan tidak boleh mereferensikan invocation Recommendation Engine pada MVP.
* `ai_practice_assessment_evidence` adalah approved evidence package, bukan Assessment Result, dan tidak berisi official score/mastery. Translation/transliteration tidak boleh menjadi official assessment source.
* `knowledge_profile` adalah academic capability state Phase 2 — hanya ditulis oleh Knowledge Profile Engine (sole owner, AD-007).
* `learning_decision` adalah Phase 2 — dihasilkan oleh Recommendation Engine (sole owner, AD-006); tidak ada tabel lain yang boleh menulis baris pada `learning_decision`.
* AI Layer (`ai_practice_*` pada MVP dan `ai_conversation`/`ai_message`/`ai_memory` pada Phase 3) tidak memiliki hak tulis pada `assessment_result`, `knowledge_profile`, atau `learning_decision`.

---

## 6. Event Persistence Model

Seluruh Domain Event dan Engine Event dipersist pada `runtime_event` dengan struktur berikut:

| Field | Description |
|---|---|
| `event_id` | Identitas unik event. |
| `event_type` | Nama event mengikuti konvensi `<Entity><Past Tense>` (mis. `LearningActivityCompleted`, `AssessmentResultGenerated`). |
| `aggregate_type` | Tipe entitas yang menjadi subjek event (mis. `LearningActivity`, `AssessmentResult`). |
| `aggregate_id` | ID entitas yang menjadi subjek event. |
| `actor_id` | Sumber pemicu (Learner / System / Engine) — nullable sampai Authentication diselesaikan. |
| `payload` | Data event, mereferensikan entitas domain melalui stable ID, bukan menyalin business rule. |
| `occurred_at` | Waktu event terjadi. |
| `correlation_id` | ID korelasi lintas layanan untuk satu alur bisnis (`61_api_design_principles.md`). |
| `trace_id` | ID tracing untuk satu request tunggal. |
| `idempotency_key` | Referensi ke `idempotency_key` untuk mencegah publikasi/duplikasi ganda. |

Penjelasan:

* Event digunakan untuk observability, audit, dan koordinasi antar Runtime/Engine — **bukan** untuk menyimpan business rule tersembunyi.
* Payload event hanya boleh mereferensikan entitas domain melalui stable ID (mis. `learning_decision_ref`, `assessment_result_ref`), sesuai contoh pada `64_engine_contracts.md`.
* Satu event hanya memiliki satu publisher resmi (Event Ownership, `21_event_model.md`); constraint ini didukung secara struktural melalui kolom `event_type` + tabel Event Ownership referensi, bukan divalidasi ulang oleh business logic baru di database.
* Event bersifat **immutable** setelah dipublikasikan (tidak ada operasi `UPDATE` pada `runtime_event`, hanya `INSERT`).

> **Catatan:** Dokumen sumber (`21_event_model.md`, `62_api_spec.md`) hanya menyebut Correlation ID dan Trace ID sebagai field wajib observability. Field `causation_id` **tidak** disebutkan pada dokumen manapun sehingga tidak dimasukkan sebagai field wajib; dicatat pada Open Issues bila dibutuhkan di masa depan.

---

## 7. State Persistence Model

`learning_state` menyimpan state aktif, sedangkan `state_transition` menyimpan riwayat perpindahan:

| Field | Table | Description |
|---|---|---|
| Current State | `learning_state.current_state` | State aktif saat ini (Single Active State). |
| Previous State | `state_transition.from_state` | State sebelum transisi. |
| Transition Reason | `state_transition.transition_reason` | Opsional, penjelasan kontekstual transisi. |
| Triggering Event | `state_transition.triggering_event` | Referensi ke `runtime_event.event_id`. |
| Timestamp | `state_transition.occurred_at` | Waktu transisi terjadi. |
| Actor/System Source | `state_transition.actor_source` | Learner / System / Engine yang memicu. |

Klarifikasi:

* **Database menyimpan state**; Runtime yang memiliki logika transisi (Event Driven Transition, Deterministic, Observable — `20_state_machine.md`).
* Database constraint (mis. hanya satu `learning_state` aktif per Learner/alur) dapat mencegah persistensi yang tidak valid secara struktural, tetapi **tidak boleh** mendefinisikan aturan bisnis kapan sebuah transisi diperbolehkan — aturan tersebut tetap dimiliki Runtime dan Event Model.

---

## 8. Knowledge Profile vs AI Memory Separation

| Aspek | Knowledge Profile | AI Memory |
|---|---|---|
| Sifat | Academic capability state (business data). | Conversational & personalization context. |
| Diperbarui oleh | Knowledge Profile Engine (sole owner). | AI Layer (melalui Memory Lifecycle: Candidate → Evaluation → Store). |
| Digunakan oleh | Recommendation Engine (untuk `learning_decision`), dibaca read-only oleh AI Layer. | Hanya AI Personal Learning Agent, untuk personalisasi. |
| Sumber kebenaran learner capability | Ya. | Tidak — AI Memory bukan sumber kebenaran Knowledge Profile (AD-007). |
| Boleh mengubah Learning Decision? | N/A (Knowledge Profile adalah input, bukan output keputusan). | Tidak — AI tidak boleh membuat/mengubah `learning_decision` (AD-006). |
| Governance | AD-002, AD-007. | AD-007, `44_ai_governance.md` (AI Memory Governance). |

Pada level skema, tidak ada foreign key yang membuat `ai_memory` menjadi prasyarat atau turunan `knowledge_profile`, dan sebaliknya. Kedua tabel independen secara struktural untuk menjamin AI Memory tidak dapat menimpa Knowledge Profile.

---

## 9. AI Provider Data Model

`ai_provider_request` dan `ai_provider_response` dirancang provider-agnostic:

| Field | Description |
|---|---|
| `provider_name` | Nama provider AI yang dipanggil (melalui AI Provider Gateway). |
| `model_name` | Nama model yang digunakan. |
| `request_metadata` | Metadata request, termasuk field spesifik provider (disimpan sebagai JSON generik). |
| `response_metadata` | Metadata response, termasuk field spesifik provider (JSON generik). |
| `token_usage` | Jumlah token yang digunakan. |
| `latency_ms` | Latensi pemrosesan. |
| `safety_status` | Status keamanan/governance response. |
| `error_code` | Kode error bila terjadi kegagalan provider. |

Klarifikasi:

* Tabel **tidak** dirancang mengikuti skema vendor tertentu — seluruh field khas provider (mis. struktur function-calling tertentu) disimpan dalam `request_metadata`/`response_metadata`.
* Core application logic (Assessment Engine, Knowledge Profile Engine, Recommendation Engine, dan pipeline lainnya) **tidak boleh** bergantung pada struktur `response_metadata` provider tertentu.
* Seluruh pemanggilan provider wajib melalui AI Provider Gateway (AD-008); tidak ada modul yang menulis langsung ke `ai_provider_request`/`response` di luar Gateway.

---

## 10. Auditability and Compliance

Hal-hal berikut harus dapat ditelusuri melalui kombinasi `runtime_event`, `audit_log`, `system_event_log`, dan tabel Engine terkait:

| Yang harus ditelusuri | Sumber Data |
|---|---|
| Siapa yang memicu perubahan | `runtime_event.actor_id`, `state_transition.actor_source`, `audit_log.actor_id` |
| Apa yang berubah | `audit_log.entity_type` + `entity_id`, `runtime_event.payload` |
| Kapan berubah | `occurred_at` pada seluruh tabel event/audit |
| Event apa penyebabnya | `state_transition.triggering_event`, `audit_log.related_event_id` |
| Engine mana yang menghasilkan result | `assessment_result` (Assessment Engine), `knowledge_profile` (Knowledge Profile Engine) |
| Rekomendasi mana yang menghasilkan Learning Decision | `learning_decision.knowledge_profile_id`, `learning_decision.recommendation_metadata` |
| Interaksi AI (audit minimum) | `ai_practice_provider_record`, `ai_provider_request/response`, `audit_log` — mencatat Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error (`44_ai_governance.md`, `60_srs.md` Bagian 17.1). Provider/audit records bukan Official Runtime Event dan bukan official assessment source kecuali ditransformasikan menjadi approved evidence. |

Event Replay Considerations dibahas pada Bagian 15 (Open Issues) karena mekanisme replay teknis (message broker, delivery guarantee) berada di luar cakupan dokumen arsitektur (`21_event_model.md`).

---

## 11. Data Ownership Matrix

| Data Area | Owning Layer | Writable By | Readable By | Notes |
| --------- | ------------ | ----------- | ----------- | ----- |
| Learning Domain data (`learning_program` s.d. `assessment_blueprint`, `content_item`) | Learning Domain | Domain authoring capability (actor authoring belum diformalkan — Open Issue, `62_api_spec.md` §11) | Semua layer (read) | Business rule tetap dimiliki dokumen domain, bukan tabel. |
| Runtime state (`learning_state`) | Runtime | Runtime | Semua layer (read) | Database menegakkan struktur, bukan aturan transisi. |
| Runtime events (`runtime_event`, `state_transition`) | Runtime | Publisher resmi per event (Event Ownership, `21_event_model.md`) | Semua layer (read), Observability | Immutable, append-only. |
| Activity Result | Runtime | Runtime melalui official Learning Activity completion behavior | Assessment Engine, Learner (read, miliknya sendiri, melalui official API) | Non-evaluative dan read-only bagi klien melalui official API. |
| Assessment Result | Engine — Assessment Engine | Assessment Engine (sole writer) | Knowledge Profile Engine, Learner (read, miliknya sendiri) | Immutable. |
| Knowledge Profile | Engine — Knowledge Profile Engine | Knowledge Profile Engine (sole writer) | Recommendation Engine, AI Layer (read-only), Learner (read, miliknya sendiri) | AD-007. |
| Learning Decision | Engine — Recommendation Engine | Recommendation Engine (sole writer) | Application, AI Layer (read-only), Learner (read, miliknya sendiri) | AD-006. |
| AI Conversation | AI Layer | AI Personal Learning Agent | Learner (miliknya sendiri) | Bukan Learning Content. |
| AI Memory | AI Layer | AI Memory (governed lifecycle) | AI Personal Learning Agent, Learner (lihat/hapus miliknya sendiri) | Tidak boleh menimpa Knowledge Profile (AD-007). |
| AI Practice Conversation / Message | AI Layer (MVP-limited) | AI Practice Partner (melalui AI Provider Gateway) | Learner (miliknya sendiri), Assessment Engine melalui approved evidence | Ditautkan ke Learning Activity (Practice) dan Learning Objective; canonical target-language transcript adalah official conversation record; bukan Assessment Result, bukan Knowledge Profile. |
| AI Practice Assessment Evidence | AI Layer / Runtime boundary | Evidence packaging process | Assessment Engine, Operations (audit) | Approved evidence package untuk assessable AI Conversation Practice; bukan Assessment Result dan tidak berisi official score/mastery. Translation/transliteration dikecualikan dari official assessment source. |
| AI Practice Provider Record | AI Layer (MVP-limited) | AI Provider Gateway (sole writer) | Operations, Engineering (audit) | Audit/observability record, bukan Official Runtime Event dan bukan official assessment source kecuali ditransformasikan menjadi approved evidence. |
| Landing Page Config | Product | Deployment/Config management | Public (unauthenticated read) | Static config; tidak ada data Learner, tidak ada Enrollment. |
| Auth Account (`learner_auth_account`) | Product / Application Layer (MVP Basic Auth) | Auth service (sole writer) | Auth service (read for login verification) | Menyimpan kredensial Learner. Tidak memiliki business rule pembelajaran. Tidak dapat diakses oleh Learning Domain, Engine, atau AI Layer. |
| Auth Session (`auth_session`) | Product / Application Layer (MVP Basic Auth) | Auth service (sole writer) | Auth service, semua API (read untuk verifikasi session aktif) | Digunakan untuk menentukan Learner context aktif. Berakhir saat logout. |
| Audit Log | Cross-cutting | Sistem (event-driven write) | Operations, Engineering, (Educator — Open Issue #6) | Tidak dapat diubah setelah ditulis. |

---

## 12. MVP Database Scope

### MVP Required Tables (Phase 1 — Foundation Platform)

* `learner` (minimal, stable identity reference)
* `learner_auth_account` (MVP Basic Learner Authentication, FR-012C)
* `auth_session` (MVP Basic Learner Authentication, FR-012C)
* `learning_program`
* `program_structure`
* `learning_module`
* `learning_design`
* `learning_objective`
* `learning_activity`
* `assessment_blueprint`
* `content_item`
* `activity_result`
* `assessment_result`
* `learning_state`
* `state_transition`
* `runtime_event`
* `system_event_log`
* `audit_log` (minimal)
* `idempotency_key`
* `landing_page_config` (static/config, FR-012A)
* `ai_practice_conversation` (AI Conversation Practice, FR-012B)
* `ai_practice_message` (AI Conversation Practice, FR-012B)
* `ai_practice_assessment_evidence` (approved evidence for assessable AI Conversation Practice, FR-012B)
* `ai_practice_provider_record` (audit/observability, FR-012B)
* `ai_practice_safety_event` (governance, FR-012B)

### Phase 2 Tables (Adaptive Learning)

* `knowledge_profile`
* `knowledge_profile_snapshot` (opsional)
* `learning_decision`

### Phase 3 Tables (AI Learning Companion)

* `ai_conversation`
* `ai_message`
* `ai_memory`
* `ai_context_snapshot` (opsional)
* `ai_provider_request`
* `ai_provider_response`
* `ai_safety_event`
* `audit_log` (perluasan penuh untuk audit interaksi AI)

### Future Tables (Belum Memiliki Dasar Arsitektur — Open Issue)

* `educator`
* `organization`
* `user_account` (Advanced Authentication / Full Identity Platform — Open Issue; MVP menggunakan `learner_auth_account` yang lebih terbatas)
* `role`
* `permission`
* `enrollment`
* `learning_context` (sebagai entitas terstruktur tersendiri)
* `outbox_event`

> Advanced auth structures (OAuth identity, SSO identity, MFA config, password reset token, parent account, organization membership) tidak memiliki dasar arsitektur dan ditandai Future / Optional sampai Advanced Authentication diselesaikan melalui Architecture Review.

---

## 13. Non-Goals

Dokumen ini **tidak**:

* mendefinisikan API contract (lihat `61_api_design_principles.md`, `62_api_spec.md`);
* mendefinisikan business rule baru (business rule tetap milik `10_learning_domain/*`, `30_engine/*`, `40_ai/*`);
* mendefinisikan UI behavior;
* mendefinisikan AI prompt behavior;
* menggantikan SRS (`60_srs.md`);
* mendefinisikan physical database tuning secara rinci (indexing strategy, partitioning, storage engine spesifik) — hal ini merupakan keputusan implementasi lanjutan di luar cakupan dokumen arsitektur.

---

## 14. Open Issues

| # | Open Issue | Catatan |
|---|---|---|
| 1 | Advanced Authentication / Full Identity Platform. | MVP Basic Learner Authentication (FR-012C) telah dimasukkan scope MVP dengan `learner_auth_account` + `auth_session`. Advanced Authentication (OAuth, SSO, MFA, Educator account, role management) tetap Open Issue; tabel `user_account`/`role`/`permission` tidak dirancang rinci sampai diselesaikan melalui Architecture Review. |
| 2 | Batas multi-tenant/Organization. | Belum dibahas arsitektur manapun; hanya disebut sebagai Future Scope Phase 6. |
| 3 | Detail lifecycle Enrollment. | Enrollment belum memiliki domain pemilik (Open Issue #2); hanya validasi status `Published` yang dapat dipersist. |
| 4 | Kebijakan retensi data (data retention policy) untuk seluruh entitas, khususnya `activity_result` dan `runtime_event` dalam skala besar. | Belum ditetapkan pada dokumen arsitektur manapun. |
| 5 | Kebijakan retensi dan penghapusan AI Memory. | `42_ai_memory.md` menyebut Memory Lifecycle (Expire/Archive) secara konseptual, namun parameter retensi konkret tidak didefinisikan. |
| 6 | Strategi event replay (message broker, delivery guarantee). | Eksplisit Out of Scope pada `21_event_model.md`; berdampak pada desain fisik `runtime_event`/`outbox_event`. |
| 7 | Apakah event store (`runtime_event`) dan audit log (`audit_log`) merupakan tabel fisik terpisah atau digabung. | Tidak ditentukan oleh dokumen arsitektur; keputusan implementasi lanjutan. |
| 8 | Mekanisme otorisasi akses Educator terhadap data Learner. | Open Issue #6 pada `60_srs.md`; berdampak pada desain `permission`/`role` di masa depan. |
| 9 | Struktur konkret "Program Context" sebagai input Recommendation Engine. | Open Issue #9 pada `60_srs.md`; berdampak pada field `recommendation_metadata` di `learning_decision`. |
| 10 | Struktur data tunggal untuk "Learning Context". | Open Issue #10 pada `60_srs.md`; `learning_context` belum dirancang sebagai tabel formal. |
| 11 | Kontrak akses AI Layer terhadap Knowledge Profile ("melalui business layer"). | Open Issue #11 pada `60_srs.md`; berdampak pada bagaimana AI Layer membaca `knowledge_profile` (langsung vs melalui API perantara). |
| 12 | Field `causation_id` pada event store. | Tidak disebutkan pada dokumen sumber manapun; hanya `correlation_id`/`trace_id` yang sourced. Ditambahkan hanya bila dibutuhkan melalui Architecture Review. |
| 13 | Raw audio retention/storage policy untuk AI Conversation Practice. | MVP mewajibkan STT/TTS capability, tetapi tidak mewajibkan raw audio storage; audio reference atau transcript metadata dapat disimpan. Retensi raw audio memerlukan kebijakan terpisah sebelum diperkenalkan. |

---

## 15. Architecture Compliance Checklist

* [x] Tidak ada business rule yang dipindahkan ke database — seluruh validasi struktural pada dokumen ini bersifat integritas data, bukan aturan pembelajaran.
* [x] Tidak ada Learning Decision yang dihasilkan oleh AI — `learning_decision` hanya ditulis oleh Recommendation Engine.
* [x] Knowledge Profile dan AI Memory dipisahkan secara tegas pada level skema (tidak ada foreign key hierarkis antar keduanya).
* [x] Runtime tetap event-driven — seluruh state didukung oleh `runtime_event` dan `state_transition`.
* [x] Canonical Learning Pipeline dipertahankan (Bagian 5).
* [x] Database model mendukung, bukan mendefinisikan ulang, arsitektur — seluruh entitas mengikuti dokumen sumber yang telah Freeze.
* [x] Data spesifik AI Provider tidak bocor ke skema inti — hanya disimpan pada `request_metadata`/`response_metadata` (JSON generik).
* [x] Tidak ada circular dependency — arah relasi mengikuti Canonical Learning Pipeline (`learning_activity` → ... → `learning_decision`), Foundation → Domain → Runtime → Engine → AI Layer.
* [x] Tidak ada tabel `placement_test`; Placement Test dimodelkan melalui `learning_activity` metadata / `purpose = Placement`.
* [x] Canonical target-language transcript dipersist terpisah dari learner support translation/transliteration pada `ai_practice_message`.
* [x] Translation/transliteration bukan official assessment source.
* [x] `ai_practice_assessment_evidence` bukan Assessment Result dan tidak berisi official score/mastery.
* [x] AI Practice tidak menulis `assessment_result`, `knowledge_profile`, atau `learning_decision`.

---

## 15.1 Engineering Freeze Declaration

Database Model ini dibekukan sebagai official logical persistence source of truth untuk engineering Kaifa v2. Database menyimpan state dan output, tetapi tidak memiliki business rule. `activity_result` tetap merupakan record non-evaluative milik Runtime yang dihasilkan melalui official Learning Activity completion behavior; `assessment_result`, `knowledge_profile`, dan `learning_decision` masing-masing tetap dimiliki dan hanya ditulis oleh Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine. AI Layer tidak menulis ketiga engine-owned output tersebut. Placement Test tetap direpresentasikan melalui metadata `learning_activity` tanpa tabel `placement_test`, dan evidence AI Conversation Practice tetap terpisah dari official scoring. Perubahan berikutnya memerlukan controlled review terhadap frozen architecture, API Specification, Engine Contracts, Event Contracts, PRD, dan SRS.

---

## 16. References

* `00_foundation/00_overview.md`
* `00_foundation/01_architecture_principles.md`
* `00_foundation/02_glossary.md`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`
* `50_product/52_prd.md`
* `60_engineering/60_srs.md`
* `60_engineering/61_api_design_principles.md`
* `60_engineering/62_api_spec.md`
* `99_architecture_decisions.md`
