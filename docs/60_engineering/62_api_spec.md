# API Specification — Kaifa v2

| Version | Status | Owner                  | Depends On                                                                              | Used By                                                  | Last Updated |
| ------- | ------ | ---------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------ |
| 1.1     | Freeze | Product & Architecture | `99_architecture_decisions.md`, `52_prd.md`, `60_srs.md`, `61_api_design_principles.md` | Engineering, QA, AI Team, Integration Partner (internal) | 2026-07-11   |

Dokumen ini merupakan **API Specification** resmi untuk Kaifa v2. Dokumen ini menerjemahkan `61_api_design_principles.md` menjadi daftar API resmi yang traceable ke `52_prd.md` (Release Candidate), `60_srs.md` (Release Candidate), dan seluruh dokumen arsitektur yang telah dibekukan (Freeze).

Dokumen ini **tidak** mendesain ulang arsitektur, **tidak** memperkenalkan business entity baru, **tidak** memperkenalkan business rule baru, **tidak** memperkenalkan Architecture Decision baru, dan **tidak** memperkenalkan ownership baru. Seluruh istilah arsitektur, nama entity, nama engine, nama dokumen, dan Architecture Decision (AD) dituliskan dalam Bahasa Inggris sesuai dokumen sumber. Narasi penjelasan dituliskan dalam Bahasa Indonesia.

Dokumen ini **tidak** berisi definisi OpenAPI/Swagger. Dokumen ini hanya mendefinisikan API Specification pada level konseptual dan kontraktual.

---

# 1. Purpose

Dokumen ini menetapkan **API Specification** resmi Kaifa v2, yaitu daftar API yang boleh diekspos oleh sistem, mengikuti seluruh prinsip yang telah ditetapkan pada `61_api_design_principles.md` dan tunduk penuh pada:

- Frozen Architecture (`00_foundation/*`, `10_learning_domain/*`, `20_runtime/*`, `30_engine/*`, `40_ai/*`, `99_architecture_decisions.md`).
- `52_prd.md` (Release Candidate).
- `60_srs.md` (Release Candidate).
- `61_api_design_principles.md` (Release Candidate).

Dokumen ini bertujuan agar:

- Setiap API resmi dapat ditelusuri ke Functional Requirement (FR), SRS Requirement, dan dokumen arsitektur sumber.
- Tidak ada API yang melanggar ownership Domain, Engine, atau boundary AI.
- Tidak ada API yang dibuat untuk kapabilitas yang belum memiliki dasar arsitektur (ditempatkan sebagai Open Issue, bukan sebagai endpoint).

---

# 2. Scope

## In Scope

- Public API untuk resource pada Learning Domain, Runtime, dan Engine (read/write sesuai ownership masing-masing).
- Internal Engine API untuk Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine (service contract, bukan implementasi).
- AI Provider Gateway API untuk Conversation, Prompt, Completion, Health Check, dan Provider Status.
- Standar format request/response, error handling, pagination, filtering, sorting, searching, validation, idempotency, rate limiting, timeout, retry, dan observability yang berlaku pada seluruh API di atas.

## Out of Scope

- Redesign arsitektur.
- Business entity atau business rule baru.
- Pendefinisian OpenAPI/Swagger/skema teknis mendetail per field (skema teknis diserahkan pada tahap implementasi, tetap tunduk pada dokumen ini).
- Penyelesaian gap arsitektural (Advanced Authentication / Full Identity Platform, Enrollment, Notification, Analytics, Achievement, Educator permission formal, Manual Assessment, AI Assisted Assessment di luar batas FR-012B) — seluruhnya dicatat pada Bagian 25 (Open Issues), bukan diselesaikan pada dokumen ini. (Catatan: MVP Basic Learner Authentication (FR-012C), Placement Test (FR-016), dan bounded assessable AI Conversation Practice (FR-012B) telah dimasukkan dalam scope MVP sesuai PRD/SRS.)

---

# 3. API Architecture

Kaifa v2 mengekspos tiga kelompok API sesuai `61_api_design_principles.md`, masing-masing dengan tanggung jawab yang terpisah dan tidak boleh saling tumpang tindih.

## Public API

Public API adalah antarmuka resource-oriented yang digunakan oleh klien (aplikasi Learner, aplikasi Educator) untuk berinteraksi dengan resource pada Learning Domain, Runtime, dan Engine (read-only untuk resource yang dimiliki Engine). Public API tidak memiliki business rule sendiri; API ini hanya meneruskan request ke layer yang berwenang (Domain untuk business validation, Engine untuk evaluasi/keputusan) sesuai AD-001 dan AD-002.

## Internal Engine API

Internal Engine API adalah kontrak layanan internal yang digunakan oleh Runtime untuk memicu eksekusi Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine sesuai urutan Canonical Learning Pipeline (AD-005). Internal Engine API tidak diekspos ke klien eksternal secara langsung; API ini hanya mendeskripsikan service contract, bukan implementasi (lihat Bagian 12).

## AI Provider Gateway API

AI Provider Gateway API adalah satu-satunya jalur komunikasi ke AI Provider sesuai AD-008 (AI Provider Agnostic). Seluruh interaksi AI Personal Learning Agent dengan AI Provider wajib melalui API ini, tanpa mengekspos API spesifik provider ke layer manapun (lihat Bagian 13).

---

# 4. API Naming Convention

Seluruh penamaan API mengikuti `61_api_design_principles.md` secara ketat:

- Path menggunakan huruf kecil dan kebab-case.
- Resource dituliskan dalam bentuk jamak (plural), merepresentasikan entitas bisnis yang telah dimiliki arsitektur, tanpa memperkenalkan entitas baru.
- Path tidak menggunakan kata kerja; aksi direpresentasikan melalui HTTP Method.
- `GET` untuk membaca resource, `POST` untuk membuat resource baru atau memicu proses, `PUT`/`PATCH` untuk memperbarui resource.
- `DELETE` tidak melakukan hard delete pada resource berbasis lifecycle; `DELETE` dipetakan ke archive/deactivation sesuai lifecycle resmi masing-masing resource (mis. Archived pada Learning Program, Learning Module).
- Nested resource digunakan hanya apabila hubungan bersifat hierarkis dan konsisten dengan Core Concepts pada dokumen arsitektur sumber.

Contoh pola penamaan (mengikuti `61_api_design_principles.md`):

```text
/api/v1/learning-programs
/api/v1/learning-programs/{programId}/program-structure
/api/v1/learning-modules
/api/v1/learning-designs
/api/v1/learning-objectives
/api/v1/learning-activities
/api/v1/activity-results
/api/v1/assessment-blueprints
/api/v1/assessment-results
/api/v1/knowledge-profiles
/api/v1/learning-decisions
/api/v1/learning-contents
/api/v1/ai/conversations
```

**AI Conversation endpoint distinction:** `/api/v1/ai/conversations` represents general AI Conversation Experience for the Phase 3 AI Learning Companion. `/api/v1/ai-conversations` represents bounded MVP AI Conversation Practice sessions tied to a Learning Activity, including assessable practice behavior from FR-012B. This separation is intentional and does not introduce new AI authority or new business entities.

---

# 5. API Versioning

Kaifa v2 menggunakan **URI Versioning**, konsisten dengan `61_api_design_principles.md` Bagian 4. Seluruh API resmi diawali dengan segmen versi pada path, misalnya `/api/v1/...`. Perubahan yang bersifat breaking change terhadap kontrak API wajib menaikkan versi URI (`/api/v2/...`), tanpa mengubah kontrak versi sebelumnya secara retroaktif.

---

# 6. Authentication

## 6.1 MVP Basic Learner Authentication

MVP Basic Learner Authentication (FR-012C, SRS-FR-012C) dimasukkan dalam scope MVP dengan batasan terbatas. Tujuan satu-satunya adalah mengidentifikasi Learner aktif dan memisahkan data Learner antar sesi.

**MVP Auth API (konseptual):**

- `POST /api/v1/auth/login` — menerima kredensial Learner, mengembalikan sesi aktif dan referensi Learner.
- `POST /api/v1/auth/logout` — mengakhiri sesi Learner aktif.
- `GET /api/v1/auth/me` — mengembalikan referensi Learner yang sedang aktif untuk sesi berjalan.

**Scope dan batasan MVP Auth API:**

- Login membangun Learner context yang digunakan oleh Learning Activity execution, AI Conversation Practice, dan Basic Learner Progress Dashboard.
- Logout mengakhiri sesi; Learner context tidak lagi aktif.
- `auth/me` hanya mengembalikan referensi Learner aktif — tidak mengembalikan data learning, tidak mengembalikan Knowledge Profile, tidak mengembalikan Learning Decision.
- Auth API tidak membuat Enrollment.
- Auth API tidak memicu Canonical Learning Pipeline.
- Auth API tidak mempublikasikan official Runtime Event.
- Auth API tidak memperkenalkan Educator permission atau Role Management di luar kebutuhan minimal Learner actor.
- Tidak ada public signup dalam MVP.
- Tidak ada forgot password / reset password dalam MVP.
- Tidak ada OAuth / Google login dalam MVP.
- Tidak ada MFA, SSO, atau organization identity dalam MVP.

## 6.2 Advanced Authentication (Open Issue / Future Scope)

Advanced Authentication tetap merupakan **Open Issue** arsitektur (`60_srs.md` Bagian 18, Open Issue #1 yang diperbarui). Seluruh endpoint non-auth pada dokumen ini mengasumsikan identitas pemanggil telah tersedia dari Learner context yang dibangun oleh MVP Auth API. Mekanisme teknologi konkret (JWT, session, cookie) tidak ditentukan pada level konseptual ini dan diserahkan pada implementasi.

Kapabilitas berikut berada di luar scope MVP dan menunggu Architecture Review:

- Public signup / registrasi mandiri.
- Forgot password / reset password / email verification.
- OAuth / Google login / SSO.
- MFA.
- Educator account dan educator authentication.
- Parent account.
- Organization identity / enterprise identity.
- Role management dan permission model.
- Full account lifecycle management.

---

# 7. Authorization

Otorisasi menggunakan actor yang telah ada pada arsitektur dan SRS (`60_srs.md` Bagian 14 — Permission Matrix). Tidak ada actor baru (termasuk Admin) yang diperkenalkan pada dokumen ini.

## Actor

- **Learner** — dapat mengeksekusi Learning Activity termasuk Placement Test sebagai specialized assessable Learning Activity, melihat Assessment Result miliknya, menerima Placement starting point suggestion pada MVP, dan menggunakan AI Conversation Practice. Knowledge Profile dan Learning Decision tetap Phase 2-capable; full Learning Decision tidak boleh diinterpretasikan sebagai scope MVP.
- **Educator** — dapat melihat state pembelajaran, Knowledge Profile, dan Learning Decision milik Learner yang berada dalam kewenangannya, bersumber langsung dari State Machine, Knowledge Profile Engine, dan Recommendation Engine tanpa duplikasi atau kalkulasi baru. Mekanisme otorisasi akses Educator terhadap data Learner tertentu tetap merupakan **Open Issue** (`60_srs.md` Open Issue #6).
- **System** — merepresentasikan Runtime dan Engine (Assessment Engine, Knowledge Profile Engine, Recommendation Engine) yang berinteraksi melalui Internal Engine API untuk menjalankan Canonical Learning Pipeline. System tidak mengubah Learning Program s/d Assessment Blueprint melalui API ini kecuali melalui alur resmi Domain.

Otorisasi authoring (CRUD) terhadap Learning Program s/d Assessment Blueprint bagi Educator belum diformalkan pada dokumen arsitektur manapun dan dicatat sebagai Open Issue (lihat Bagian 25), bukan diasumsikan.

---

# 8. Standard Request Format

Seluruh request mengikuti format umum berikut, sesuai `61_api_design_principles.md` Bagian 6.

## Headers

| Header             | Wajib                                | Deskripsi                                                                              |
| ------------------ | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `Content-Type`     | Ya                                   | `application/json` untuk seluruh request body.                                         |
| `X-Correlation-Id` | Tidak (auto-generate jika tidak ada) | Identifier korelasi lintas layanan untuk satu alur bisnis.                             |
| `X-Trace-Id`       | Tidak (auto-generate jika tidak ada) | Identifier tracing untuk satu request tunggal, mendukung observability lintas layanan. |
| `Accept-Language`  | Tidak                                | Locale klien (mis. `id-ID`, `en-US`) untuk pesan yang bersifat locale-sensitive.       |

Apabila klien tidak menyertakan `X-Correlation-Id` atau `X-Trace-Id`, API Gateway atau entrypoint service wajib membuatnya sebelum request diteruskan, sesuai `61_api_design_principles.md`.

## Body

Seluruh request body menggunakan format JSON. Request tidak boleh menyertakan business rule baru pada level payload; seluruh business rule tetap dimiliki Learning Domain (AD-002).

## Idempotency

Operasi yang berpotensi dipanggil berulang (misalnya akibat retry jaringan), khususnya yang berinteraksi dengan Assessment Engine dan Knowledge Profile Engine yang bersifat deterministic, wajib dirancang idempotent (lihat Bagian 19).

---

# 9. Standard Response Format

Seluruh API menggunakan format response envelope yang konsisten, sesuai `61_api_design_principles.md` Bagian 7.

## Success Envelope (konseptual)

Response sukses menyertakan:

- `success` — indikator keberhasilan (true).
- `data` — hasil resource (object atau array).
- `metadata` — informasi tambahan seperti Correlation ID, Trace ID, dan waktu pemrosesan.
- `pagination` — disertakan hanya untuk response koleksi resource (lihat Bagian 14).

## Error Envelope (konseptual)

Response gagal menyertakan:

- `success` — indikator keberhasilan (false).
- `error` — object berisi kode error (sesuai Bagian 10), kategori error (Validation Error/Business Error/System Error/AI Provider Error), dan pesan error yang informatif namun tidak membocorkan detail implementasi internal.
- `metadata` — Correlation ID dan Trace ID untuk mendukung penelusuran.

Dokumen ini tidak mendefinisikan skema field JSON secara literal (bukan OpenAPI); struktur di atas bersifat konseptual dan mengikat pada level kontrak.

---

# 10. Error Response Standard

Seluruh API menggunakan status code berikut, konsisten dengan `61_api_design_principles.md` Bagian 8.

| Status Code | Kategori                          | Penggunaan                                                                                                 |
| ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 400         | Validation Error                  | Request tidak valid secara format atau struktur (Input Validation).                                        |
| 401         | —                                 | Identitas pemanggil tidak dapat diverifikasi (lihat Bagian 6 — Open Issue Authentication).                 |
| 403         | —                                 | Pemanggil tidak memiliki otorisasi terhadap resource yang diminta (lihat Bagian 7 — Permission Matrix).    |
| 404         | —                                 | Resource yang diminta tidak ditemukan.                                                                     |
| 409         | Business Error                    | Terjadi konflik pada state resource, misalnya transisi state yang tidak sah (lihat AD-003, State Machine). |
| 422         | Validation Error / Business Error | Request valid secara format namun gagal pada validasi bisnis yang dimiliki Learning Domain (AD-002).       |
| 429         | —                                 | Pemanggil melebihi batas rate limiting yang ditetapkan (lihat Bagian 20).                                  |
| 500         | System Error                      | Terjadi kegagalan sistem yang tidak terduga.                                                               |
| 503         | System Error / AI Provider Error  | Layanan tidak tersedia, misalnya akibat kegagalan AI Provider yang memicu Graceful Degradation (AD-009).   |

Error message tidak membocorkan detail implementasi internal, sesuai `61_api_design_principles.md` Bagian 10.

---

# 11. API Resource Specification

Bagian ini mendaftarkan seluruh resource bisnis yang telah didefinisikan arsitektur. Tidak ada resource baru yang diperkenalkan.

```
Catatan Authoring API:

Endpoint create/update/archive untuk Learning Program, Learning Module, Learning Design, Learning Objective, Learning Activity, Assessment Blueprint, dan Learning Content didefinisikan sebagai API capability sesuai domain source.

Namun actor/role yang berwenang menjalankan authoring API belum diformalkan pada arsitektur Kaifa v2.

Sampai Architecture Review menetapkan authoring role resmi, endpoint write-domain ini tidak boleh diekspos ke Learner/Educator public client dan harus dianggap sebagai restricted internal/admin-authoring capability.
```

## 11.1 Learning Program

**Purpose:** Mengelola definisi dan lifecycle Learning Program sebagai unit pembelajaran tertinggi.

**Supported Operations:**

- `GET /api/v1/learning-programs` — daftar Learning Program.
- `GET /api/v1/learning-programs/{programId}` — detail Learning Program.
- `POST /api/v1/learning-programs` — membuat Learning Program baru (status awal Draft).
- `PUT /api/v1/learning-programs/{programId}` — memperbarui Learning Program.
- `PATCH /api/v1/learning-programs/{programId}` — mempublikasikan Learning Program.
  `Body: { "status": "Published" }`
- `DELETE /api/v1/learning-programs/{programId}` — dipetakan ke archive (lifecycle Archived), bukan hard delete.

**Request Parameters:** identitas unik (path), Program Type, atribut Program Structure terkait (lihat 11.2), filter status pada operasi list (lihat Bagian 15).

**Response Object:** identitas unik, Program Type, Status (Draft/Published/Archived), referensi Program Structure.

**Validation Rules:**

- Program Type wajib salah satu dari: Curriculum, Certification, Language, Book, Free Learning, Custom.
- Status lifecycle hanya boleh Draft, Published, atau Archived.
- Learning Program berstatus selain Published ditolak untuk proses enrollment baru (Enrollment sendiri adalah Open Issue, lihat Bagian 25).
- Learning Program wajib memiliki tepat satu Program Structure sebelum dapat disimpan.

**Possible Errors:** 400 (format tidak valid), 404 (program tidak ditemukan), 409 (transisi status tidak sah), 422 (Program Type/Status tidak valid, Program Structure belum ditetapkan).

**Related FR:** FR-001, FR-002. **Related SRS:** SRS-FR-001, SRS-FR-002. **Related Architecture Document:** `10_learning_program.md`, `11_program_structure.md`. **Related AD:** AD-002.

---

## 11.2 Program Structure

**Purpose:** Menetapkan tipe struktur program yang ditautkan ke Learning Program.

**Supported Operations:**

- `GET /api/v1/learning-programs/{programId}/program-structure` — melihat Program Structure yang ditetapkan.
- `PUT /api/v1/learning-programs/{programId}/program-structure` — menetapkan/memperbarui Program Structure.

**Request Parameters:** tipe Program Structure.

**Response Object:** tipe Program Structure yang berlaku untuk Learning Program terkait.

**Validation Rules:**

- Tipe wajib salah satu dari enam tipe resmi: Curriculum, CEFR, Book, Certification, Free Learning, Custom Structure.
- Learning Program tanpa Program Structure ditolak untuk disimpan.

**Possible Errors:** 400, 404 (Learning Program tidak ditemukan), 422 (tipe tidak valid/tidak lengkap).

**Related FR:** FR-002. **Related SRS:** SRS-FR-002. **Related Architecture Document:** `11_program_structure.md`, `10_learning_program.md`. **Related AD:** AD-002.

---

## 11.3 Learning Module

**Purpose:** Mengelola unit pembelajaran di dalam satu Program Structure.

**Supported Operations:**

- `GET /api/v1/learning-modules` — daftar Learning Module.
- `GET /api/v1/learning-modules/{moduleId}` — detail Learning Module.
- `POST /api/v1/learning-modules` — membuat Learning Module baru.
- `PUT /api/v1/learning-modules/{moduleId}` — memperbarui Learning Module.
- `PATCH /api/v1/learning-modules/{moduleId}` — mempublikasikan Learning Module.
  `Body: { "status": "Published" }`
- `DELETE /api/v1/learning-modules/{moduleId}` — dipetakan ke archive.

**Request Parameters:** identitas unik, referensi Program Structure, referensi Learning Design.

**Response Object:** identitas unik, Status (Draft/Published/Archived), referensi Program Structure, referensi Learning Design.

**Validation Rules:**

- Setiap Learning Module wajib berada pada tepat satu Program Structure.
- Setiap Learning Module wajib memiliki tepat satu Learning Design terkait.
- Status lifecycle mengikuti urutan Draft → Published → Archived.

**Possible Errors:** 400, 404, 409 (urutan status tidak sah), 422 (Program Structure/Learning Design tidak lengkap).

**Related FR:** FR-003. **Related SRS:** SRS-FR-003. **Related Architecture Document:** `13_learning_module.md`. **Related AD:** AD-002.

---

## 11.4 Learning Design

**Purpose:** Mengelola desain instruksional yang diterapkan pada satu Learning Module.

**Supported Operations:**

- `GET /api/v1/learning-designs` — daftar Learning Design.
- `GET /api/v1/learning-designs/{designId}` — detail Learning Design.
- `POST /api/v1/learning-designs` — membuat Learning Design baru.
- `PUT /api/v1/learning-designs/{designId}` — memperbarui Learning Design.

**Request Parameters:** identitas unik, referensi Learning Module, daftar Learning Objective, Prerequisite Rule (opsional), Completion Rule (opsional).

**Response Object:** identitas unik, referensi Learning Module, daftar Learning Objective terkait, Prerequisite Rule, Completion Rule.

**Validation Rules:**

- Learning Design wajib diterapkan pada tepat satu Learning Module.
- Learning Design ditolak disimpan apabila tidak memiliki minimal satu Learning Objective.
- Prerequisite Rule dan Completion Rule bersifat opsional.

**Possible Errors:** 400, 404, 422 (tidak memiliki Learning Objective).

**Related FR:** FR-004. **Related SRS:** SRS-FR-004. **Related Architecture Document:** `12_learning_design.md`. **Related AD:** AD-002.

---

## 11.5 Learning Objective

**Purpose:** Mengelola tujuan pembelajaran yang terhubung ke satu Learning Design.

**Supported Operations:**

- `GET /api/v1/learning-objectives` — daftar Learning Objective.
- `GET /api/v1/learning-objectives/{objectiveId}` — detail Learning Objective.
- `POST /api/v1/learning-objectives` — membuat Learning Objective baru.
- `PUT /api/v1/learning-objectives/{objectiveId}` — memperbarui Learning Objective.
- `DELETE /api/v1/learning-objectives/{objectiveId}` — dipetakan ke archive.

**Request Parameters:** Objective Statement, klasifikasi, Mastery Criteria, referensi Learning Design.

**Response Object:** identitas unik, Objective Statement, klasifikasi (Knowledge/Understanding/Application/Analysis/Evaluation/Creation), Mastery Criteria, referensi Learning Design.

**Validation Rules:**

- Wajib memiliki Objective Statement.
- Wajib memiliki klasifikasi resmi.
- Wajib memiliki Mastery Criteria.
- Wajib terhubung ke tepat satu Learning Design.

**Possible Errors:** 400, 404, 422 (atribut wajib tidak lengkap).

**Related FR:** FR-005. **Related SRS:** SRS-FR-005. **Related Architecture Document:** `14_learning_objective.md`. **Related AD:** AD-002.

---

## 11.6 Learning Activity

**Purpose:** Mengelola dan menjalankan aktivitas belajar yang merealisasikan satu Learning Objective.

**Supported Operations:**

- `GET /api/v1/learning-activities` — daftar Learning Activity.
- `GET /api/v1/learning-activities/{activityId}` — detail Learning Activity.
- `POST /api/v1/learning-activities` — membuat Learning Activity baru.
- `PUT /api/v1/learning-activities/{activityId}` — memperbarui Learning Activity.
- `POST /api/v1/learning-activities/{activityId}/start` — Learner memulai Learning Activity, termasuk Placement Test sebagai Learning Activity dengan placement-specific metadata.
- `POST /api/v1/learning-activities/{activityId}/complete` — Learner menyelesaikan Learning Activity, menghasilkan Activity Result, dan memicu evaluasi Assessment Engine apabila Assessment Blueprint berlaku (lihat AD-003, AD-005).

**Request Parameters:** Activity Type, Participation Rule, Completion Criteria, Metadata, referensi Learning Objective, referensi Learning Content (opsional, lihat 11.10). Untuk Placement Test, metadata dapat menandai activity sebagai placement-specific/purpose = Placement tanpa membuat domain entity baru.

**Response Object:** identitas unik, Activity Type, Completion Criteria, Status penyelesaian, referensi Activity Result yang dihasilkan, dan jika activity adalah Placement Test, referensi Assessment Result / Placement starting point suggestion jika sudah dihasilkan Assessment Engine.

**Validation Rules:**

- Setiap Learning Activity wajib merealisasikan tepat satu Learning Objective.
- Learning Activity tidak boleh menghasilkan Assessment Result maupun menghitung tingkat penguasaan Learner secara langsung (kewenangan tersebut milik Assessment Engine dan Knowledge Profile Engine).
- Penyelesaian aktivitas wajib menghasilkan Activity Result yang tersimpan.
- Placement Test adalah specialized assessable Learning Activity, bukan domain entity baru. Completion Placement Test menghasilkan Activity Result dan diteruskan ke Assessment Engine melalui Assessment Blueprint yang sesuai.
- Placement starting point suggestion dapat dikembalikan melalui response completion atau Assessment Result API setelah Assessment Engine menghasilkan Assessment Result. Suggestion ini bukan Learning Decision dan tidak boleh memanggil Recommendation Engine pada MVP.

**Possible Errors:** 400, 404, 409 (state pembelajaran tidak berada pada `Learning`), 422 (Completion Criteria belum terpenuhi, Activity Result tidak valid, Assessment Blueprint hilang untuk assessable activity, attempt to invoke Recommendation Engine / Learning Decision from MVP Placement Test).

**Related FR:** FR-006, FR-007, FR-008, FR-010, FR-011, FR-016. **Related SRS:** SRS-FR-006, SRS-FR-007, SRS-FR-008, SRS-FR-010, SRS-FR-011, SRS-FR-016. **Related Architecture Document:** `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md`, `20_state_machine.md`, `21_event_model.md`, `50_user_journey.md`. **Related AD:** AD-002, AD-003, AD-004, AD-005.

---

## 11.6.1 Activity Result (read-only bagi klien)

**Purpose:** Menyediakan akses baca terhadap hasil langsung pelaksanaan Learning Activity untuk Basic Progress Dashboard dan riwayat aktivitas Learner. Activity Result adalah record Runtime yang dihasilkan dan disimpan oleh backend/API behavior saat completion; Activity Result bukan hasil evaluasi dan tidak boleh diturunkan atau direkonstruksi klien dari Assessment Result.

**Supported Operations:**

- `GET /api/v1/activity-results` — daftar Activity Result milik Learner aktif.
- `GET /api/v1/activity-results/{activityResultId}` — detail Activity Result milik Learner aktif.

Public API tidak menyediakan operasi tulis atau perubahan langsung untuk Activity Result. Pembuatan/persistensi Activity Result hanya terjadi melalui completion behavior yang telah didokumentasikan, termasuk `POST /api/v1/learning-activities/{activityId}/complete` dan bounded assessable completion `POST /api/v1/ai-conversations/{conversationId}/complete`.

**Request Parameters:** Learner diperoleh dari session context. Operasi daftar dapat difilter menggunakan atribut atau referensi yang sudah tersedia pada canonical Activity Result dan Learning Activity terkait, seperti referensi Learning Activity, source/purpose context apabila sudah direpresentasikan oleh source metadata, dan rentang waktu sesuai Bagian 15, serta mengikuti pagination Bagian 14. Bagian ini tidak mendefinisikan enum `result_type` baru atau memperkenalkan klasifikasi Activity Result baru.

**Response Object:** Activity Result identifier, referensi Learning Activity terkait, referensi Learner, informasi completion, Runtime timestamps, dan referensi evidence yang didukung bila berlaku. Response tidak berisi official score, mastery, Learning Decision, atau field Assessment Result yang direkonstruksi oleh API.

**Validation Rules:**

- Endpoint membutuhkan Learner context yang valid dan hanya mengembalikan Activity Result milik Learner aktif.
- Activity Result bersifat non-evaluative; frontend tidak boleh menghitung score, mastery, pass/fail, atau official outcome dari response.
- Activity Result tidak boleh dibuat, diubah, atau dipersist oleh klien melalui endpoint baca ini.
- Activity Result tidak boleh diturunkan dari Assessment Result; keduanya dibaca melalui resource resmi masing-masing.
- Assessment Result tetap hanya dihasilkan Assessment Engine melalui Assessment Blueprint; kontrak baca ini tidak memanggil Engine, Recommendation Engine, atau Knowledge Profile Engine.

**Possible Errors:** 400 (filter tidak valid), 401 (session/Learner context tidak valid), 403 (Activity Result bukan milik Learner aktif), 404 (Activity Result tidak ditemukan).

**Related FR:** FR-006, FR-012, FR-012B, FR-016. **Related SRS:** SRS-FR-006, SRS-FR-012, SRS-FR-012B, SRS-FR-016. **Related Architecture Document:** `15_learning_activity.md`, `30_assessment_engine.md`, `20_state_machine.md`. **Related AD:** AD-002, AD-005, AD-006, AD-009.

---

## 11.7 Assessment Blueprint

**Purpose:** Mengelola definisi strategi evaluasi yang direferensikan oleh satu atau lebih Learning Activity.

**Supported Operations:**

- `GET /api/v1/assessment-blueprints` — daftar Assessment Blueprint.
- `GET /api/v1/assessment-blueprints/{blueprintId}` — detail Assessment Blueprint.
- `POST /api/v1/assessment-blueprints` — membuat Assessment Blueprint baru.
- `PUT /api/v1/assessment-blueprints/{blueprintId}` — memperbarui Assessment Blueprint.

**Request Parameters:** Assessment Strategy, Evaluation Criteria, Assessment Method, Mastery Criteria, Metadata.

**Response Object:** identitas unik, Assessment Strategy, Evaluation Criteria, Mastery Criteria.

**Validation Rules:**

- Assessment Strategy wajib dari daftar resmi: Quiz, Assignment, Project, Portfolio, Observation, Speaking, Writing, Practical, Peer Review, AI Assisted.
- Wajib memiliki Evaluation Criteria dan Mastery Criteria.
- Satu Assessment Blueprint dapat direferensikan oleh lebih dari satu Learning Activity dengan karakteristik hasil sejenis.
- Assessment Blueprint **tidak** menghasilkan Assessment Result, **tidak** memperbarui Knowledge Profile, dan **tidak** menghasilkan Learning Decision — kewenangan tersebut sepenuhnya milik Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine (AD-004).

**Possible Errors:** 400, 404, 422 (Assessment Strategy tidak dikenal, Evaluation/Mastery Criteria tidak lengkap).

> Catatan: Strategi "AI Assisted" tetap dicantumkan sesuai dokumen sumber. Untuk FR-012B, batasnya adalah Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain sebagai input/evidence untuk Assessment Engine. AI Assisted Assessment lain di luar batas FR-012B tetap Open Issue (lihat Bagian 25).

**Related FR:** FR-007. **Related SRS:** SRS-FR-007. **Related Architecture Document:** `16_assessment_blueprint.md`. **Related AD:** AD-002, AD-004.

---

## 11.8 Assessment Result (read-only bagi klien)

**Purpose:** Menyediakan akses baca terhadap hasil evaluasi resmi yang dihasilkan Assessment Engine.

**Supported Operations:**

- `GET /api/v1/assessment-results` — daftar Assessment Result milik Learner.
- `GET /api/v1/assessment-results/{resultId}` — detail Assessment Result.

Assessment Result **hanya** dapat dibuat melalui Internal Engine API oleh Assessment Engine (lihat Bagian 12.1); Public API tidak menyediakan operasi tulis untuk resource ini.

**Request Parameters:** filter berdasarkan Learner, Learning Activity, atau rentang waktu (lihat Bagian 15). Untuk Placement Test atau assessable AI Conversation Practice, filter dapat menggunakan source Learning Activity atau Activity Result reference.

**Response Object:** identitas unik, referensi Activity Result, hasil evaluasi, referensi Assessment Blueprint yang digunakan, timestamp. Untuk Placement Test, response dapat menyertakan Placement starting point suggestion yang bukan Learning Decision. Untuk assessable AI Conversation Practice, response dapat menyertakan referensi Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain yang digunakan Assessment Engine.

**Validation Rules:**

- Public API tidak boleh menulis atau mengubah Assessment Result secara langsung.
- AI API tidak boleh membuat, memperbarui, atau memiliki official Assessment Result.
- Placement starting point suggestion pada Assessment Result bukan Learning Decision dan tidak memanggil Recommendation Engine pada MVP.
- Translation/transliteration dari AI Conversation Practice tidak boleh menjadi official assessment source.
- Assessment Result hanya dapat diakses baca oleh Learner pemilik dan Educator yang berwenang (Open Issue #6, lihat Bagian 25).

**Possible Errors:** 400, 403, 404, 422 (attempt to use translation/transliteration as official assessment source, malformed Placement starting point request).

**Related FR:** FR-008, FR-012B, FR-016. **Related SRS:** SRS-FR-008, SRS-FR-012B, SRS-FR-016. **Related Architecture Document:** `30_assessment_engine.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`. **Related AD:** AD-004, AD-005, AD-006, AD-009.

---

## 11.9 Knowledge Profile (read-only)

**Purpose:** Menyediakan akses baca terhadap representasi tingkat penguasaan Learner yang dimiliki tunggal oleh Knowledge Profile Engine.

**Supported Operations:**

- `GET /api/v1/knowledge-profiles/{learnerId}` — melihat Knowledge Profile milik Learner tertentu.

Tidak ada operasi tulis pada Public API untuk resource ini. Pembaruan Knowledge Profile hanya terjadi melalui Internal Engine API oleh Knowledge Profile Engine (lihat Bagian 12.2), bersifat incremental, bukan rebuild total.

**Request Parameters:** identitas Learner (path).

**Response Object:** representasi tingkat penguasaan Learner sesuai definisi `31_knowledge_profile_engine.md`.

**Validation Rules:**

- Knowledge Profile bukan AI Memory dan tidak boleh dicampur dengan resource AI Memory (AD-007).
- Public API tidak boleh memperbarui Knowledge Profile dalam bentuk apa pun.

**Possible Errors:** 400, 403, 404 (Knowledge Profile belum terbentuk).

**Related FR:** FR-013. **Related SRS:** SRS-FR-013. **Related Architecture Document:** `31_knowledge_profile_engine.md`. **Related AD:** AD-002, AD-007.

---

## 11.10 Learning Decision (read-only)

**Purpose:** Menyediakan akses baca terhadap keputusan pembelajaran yang dimiliki tunggal oleh Recommendation Engine.

**Supported Operations:**

- `GET /api/v1/learning-decisions/{learnerId}` — melihat Learning Decision aktif milik Learner tertentu.
- `GET /api/v1/learning-decisions/{learnerId}/history` — riwayat Learning Decision.

Tidak ada operasi tulis pada Public API untuk resource ini. Learning Decision hanya dihasilkan melalui Internal Engine API oleh Recommendation Engine (lihat Bagian 12.3).

**Request Parameters:** identitas Learner (path), filter rentang waktu untuk riwayat.

**Response Object:** jenis Learning Decision (salah satu dari 7 jenis resmi: Next Module, Review Module, Repeat Activity, Take Assessment, Continue Learning, Complete Module, Complete Program), timestamp, referensi Knowledge Profile yang mendasari.

**Validation Rules:**

- Learning Decision wajib salah satu dari 7 jenis resmi.
- Public API dan AI API tidak boleh menghasilkan atau mengubah Learning Decision (AD-006).

**Possible Errors:** 400, 403, 404 (Learning Decision belum tersedia).

**Related FR:** FR-014. **Related SRS:** SRS-FR-014. **Related Architecture Document:** `32_recommendation_engine.md`. **Related AD:** AD-006.

---

## 11.11 Learning Content

**Purpose:** Mengelola dan menyajikan konten pembelajaran yang direferensikan oleh Learning Activity dan digunakan sebagai konteks oleh AI Layer.

**Supported Operations:**

- `GET /api/v1/learning-contents` — daftar Learning Content.
- `GET /api/v1/learning-contents/{contentId}` — detail Learning Content.
- `POST /api/v1/learning-contents` — membuat Learning Content baru (status awal belum Published).
- `PUT /api/v1/learning-contents/{contentId}` — memperbarui/menerbitkan versi baru Learning Content.

**Request Parameters:** Content ID, Title, Description, Type, Language, Difficulty, Estimated Duration, Version, Status.

**Response Object:** metadata lengkap sesuai Request Parameters di atas.

**Validation Rules:**

- Hanya Learning Content berstatus Published yang dapat digunakan oleh Learning Activity.
- Satu Learning Content dapat direferensikan oleh lebih dari satu Learning Activity.
- Versi Learning Content yang lebih lama tetap tersimpan (tidak dihapus) saat versi baru diterbitkan.
- AI API tidak boleh menulis atau mengubah Learning Content resmi melalui interaksi percakapan apa pun (lihat Bagian 24).

**Possible Errors:** 400, 404, 422 (metadata minimum tidak lengkap).

**Related FR:** FR-009. **Related SRS:** SRS-FR-009. **Related Architecture Document:** `22_content_model.md`. **Related AD:** AD-001.

---

## 11.12 AI Conversation

**Purpose:** Menyediakan akses ke pengalaman percakapan dengan AI Personal Learning Agent sebagai Experience Layer (AD-009), tanpa membuat keputusan pembelajaran resmi.

**Supported Operations:**

- `POST /api/v1/ai/conversations` — memulai sesi percakapan baru.
- `POST /api/v1/ai/conversations/{conversationId}/messages` — mengirim pesan dalam sesi percakapan berjalan.
- `GET /api/v1/ai/conversations/{conversationId}` — melihat riwayat AI Conversation Experience.

**Endpoint Naming Boundary:** `/api/v1/ai/conversations` adalah endpoint family untuk general AI Conversation Experience pada Phase 3 AI Learning Companion. Endpoint family ini sengaja dipisahkan dari `/api/v1/ai-conversations` karena scope dan authority boundary berbeda: general AI Conversation Experience tidak assessable, tidak menghasilkan Activity Result, dan tidak menghasilkan Assessment Result.

**Request Parameters:** identitas Learner, isi pesan, referensi Learning Decision/Learning Content sebagai konteks (opsional, disusun otomatis oleh AI Context Hierarchy).

**Response Object:** AI Conversation Experience — bukan Learning Content, bukan Learning Decision, bukan Assessment Result.

**Validation Rules:**

- AI Context Hierarchy wajib diikuti: Learning Decision → Knowledge Profile → Learning Content → Conversation Context → AI Memory.
- Permintaan yang melanggar AI Authority Matrix ditolak atau diubah sesuai policy sebelum disampaikan ke Learner (Governance Violation, lihat `44_ai_governance.md`).
- Interaksi wajib dicatat pada log audit (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error).
- AI Conversation **tidak boleh** mengubah Learning Decision, Knowledge Profile, Assessment Result, atau Learning Content resmi (lihat Bagian 24).

**Possible Errors:** 400, 403 (Governance Violation), 422, 503 (AI Provider tidak tersedia, Graceful Degradation aktif).

**Related FR:** FR-018, FR-019, FR-023, FR-024, FR-025. **Related SRS:** SRS-FR-018, SRS-FR-019, SRS-FR-023, SRS-FR-024, SRS-FR-025. **Related Architecture Document:** `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`. **Related AD:** AD-006, AD-007, AD-008, AD-009.

---

## 11.13 AI Memory (read-only bagi klien, terpisah dari Knowledge Profile)

**Purpose:** Menyediakan akses baca terhadap AI Memory (Session/Short-Term/Long-Term/Episodic/Semantic Memory) yang digunakan untuk personalisasi percakapan, terpisah tegas dari Knowledge Profile (AD-007).

**Supported Operations:**

- `GET /api/v1/ai/memory/{learnerId}` — melihat ringkasan AI Memory milik Learner (sesuai batas privasi AI Memory Governance).
- `DELETE  /api/v1/ai/memory/{learnerId}` — menghapus ringkasan AI Memory milik Learner (sesuai batas privasi AI Memory Governance).

Tidak ada operasi tulis langsung melalui Public API; pembaruan AI Memory terjadi sebagai bagian dari proses internal AI Personal Learning Agent.
Menghapus AI Memory milik Learner sesuai AI Memory Governance. Endpoint ini tidak menghapus Knowledge Profile dan tidak memengaruhi data akademik resmi.

**Request Parameters:** identitas Learner (path).

**Response Object:** ringkasan AI Memory sesuai kategori (Session/Short-Term/Long-Term/Episodic/Semantic), tanpa mencampur data Knowledge Profile.

**Validation Rules:**

- AI Memory tidak boleh menjadi sumber kebenaran Knowledge Profile.
- AI Memory tidak boleh diekspos bersama Knowledge Profile dalam satu response yang sama (AD-007).

**Possible Errors:** 400, 403, 404 (AI Memory tidak tersedia — fallback tanpa personalisasi, lihat `60_srs.md` Bagian 13).

**Related FR:** FR-020. **Related SRS:** SRS-FR-020. **Related Architecture Document:** `42_ai_memory.md`. **Related AD:** AD-007.

---

## 11.14 Public Landing Page

**Purpose:** Menyediakan informasi produk secara publik sebagai product entry page yang dapat diakses tanpa autentikasi.

**Supported Operations:**

- `GET /api/v1/public/landing-page` — melihat konten Landing Page (informasi produk, program highlights ringkas, program offerings).
- `GET /api/v1/public/program-highlights` — daftar ringkas program unggulan yang dipublikasikan untuk ditampilkan pada Landing Page.

**Request Parameters:** tidak diperlukan (public, unauthenticated).

**Response Object:** konten informatif produk (teks, metadata program tersedia) — tidak mengandung data personal Learner.

**Validation Rules:**

- Endpoint ini **tidak** membuat Enrollment.
- Endpoint ini **tidak** memicu Canonical Learning Pipeline.
- Endpoint ini **tidak** mengekspos data Learner.
- Konten Landing Page bersifat static/config-based pada MVP; tidak ada business entity baru yang diperkenalkan.

**Possible Errors:** 500 (konten tidak tersedia).

> Catatan: Endpoint ini tidak memerlukan Authentication (endpoint public). Landing Page tidak memperkenalkan entitas domain baru.

**Related FR:** FR-012A. **Related SRS:** SRS-FR-012A. **Related Architecture Document:** `50_user_journey.md`, `51_roadmap.md`. **Related AD:** AD-002.

---

## 11.15 AI Conversation Practice

**Purpose:** Menyediakan akses ke sesi AI Conversation Practice sebagai mode dari Learning Activity type `Practice`, didukung oleh AI Practice Partner melalui AI Provider Gateway (AD-008). AI Conversation Practice mendukung text interaction, mandatory Speech-to-Text (STT) input capability and mandatory Text-to-Speech (TTS) output capability, canonical target-language transcript, Arabic script / RTL metadata, Indonesian translation toggle, optional transliteration, dan assessable completion. AI APIs tidak membuat, memperbarui, atau memiliki official Assessment Result; official scoring tetap melalui Assessment Engine.

**Supported Operations:**

- `POST /api/v1/learning-activities/{activityId}/ai-conversation/start` — memulai sesi AI Conversation Practice untuk Learning Activity type Practice yang terhubung ke satu Learning Objective.
- `POST /api/v1/ai-conversations/{conversationId}/messages` — mengirim pesan dalam sesi AI Conversation Practice yang sedang berjalan.
- `POST /api/v1/ai-conversations/{conversationId}/complete` — mengakhiri sesi AI Conversation Practice.
- `GET /api/v1/ai-conversations/{conversationId}` — melihat riwayat sesi AI Conversation Practice.

**Endpoint Naming Boundary:** `/api/v1/ai-conversations` adalah endpoint family untuk bounded MVP AI Conversation Practice yang terikat ke Learning Activity dan dapat memiliki assessable completion. Endpoint family ini sengaja dipisahkan dari `/api/v1/ai/conversations`; official Assessment Result untuk assessable AI Conversation Practice tetap hanya dihasilkan oleh Assessment Engine. Kedua endpoint family tidak boleh menghasilkan Learning Decision, memperbarui Knowledge Profile, mengubah official Learning Content, atau mempublikasikan Official Runtime Events secara langsung.

**Request Parameters:** identitas Learner (dari session context), identitas Learning Activity (path), target language, text message, audio input reference atau STT transcript, TTS request metadata, Indonesian translation toggle, optional transliteration flag, referensi Learning Content sebagai konteks (opsional, disusun otomatis).

**Response Object:** conversation turn ID, conversation response, feedback text, practice guidance, canonical target-language transcript, STT transcript metadata, audio response and audio metadata, language metadata (`target_language`, script, direction/RTL), Indonesian translation toggle result, optional transliteration, approved assessment evidence, and practice signals. Voice metadata represents recording, processing, playback, permission failure, and retry states. Response ini bukan official Assessment Result, bukan Knowledge Profile update, dan bukan Learning Decision.

**Validation Rules:**

- Endpoint `start` hanya valid untuk Learning Activity dengan `activity_type = Practice`.
- Learning Activity harus terhubung ke tepat satu Learning Objective.
- Text interaction wajib didukung. STT input dan TTS audio response adalah kapabilitas wajib MVP; setiap turn membawa `conversation_turn_id`, canonical transcript, serta voice/audio metadata bila voice digunakan.
- Voice flow harus merepresentasikan recording, processing, playback, permission failure, dan retry state. Learner dapat memilih text interaction, tetapi kegagalan voice tidak mengaktifkan Knowledge Profile Engine, Recommendation Engine, atau AI scoring.
- Canonical target-language transcript adalah official conversation record. Untuk Arabic, response metadata harus memungkinkan Arabic script display dan RTL conversation layout.
- Indonesian translation dan transliteration hanya learner support aids, tidak boleh diterima sebagai official assessment source.
- `complete` untuk assessable conversation menghasilkan/menyerahkan Activity Result atau approved assessment evidence yang didukung ke Assessment Engine; Assessment Engine menghasilkan official Assessment Result, lalu result diambil dari Assessment Result API atau direferensikan hanya setelah Assessment Engine menghasilkannya.
- AI APIs dilarang membuat, memperbarui, atau memiliki Assessment Result (AD-006, AD-004).
- AI APIs dilarang memperbarui Knowledge Profile (AD-007).
- AI APIs dilarang menghasilkan Learning Decision (AD-006).
- AI APIs dilarang membuat atau mengubah official Learning Content.
- AI Conversation Practice metadata untuk target language, Arabic script, RTL, translation, dan transliteration tidak memperkenalkan real-time voice call, voice biometrics, standalone pronunciation certification, full localization platform, dictionary engine, dialect detection, atau real-time interpretation.
- AI menggunakan Published Learning Content sebagai konteks di mana berlaku; AI tidak mengubah Learning Content resmi (AD-009).
- AI Authority Matrix (`44_ai_governance.md`) wajib ditegakkan.
- Seluruh interaksi **tidak** mempublikasikan Official Runtime Event; seluruh interaksi dicatat sebagai audit/observability record (Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error). Official Runtime Events tetap dimiliki Runtime / Learning Activity / Assessment Engine sesuai Event Contracts.
- Seluruh pemanggilan AI Provider wajib melalui AI Provider Gateway (AD-008).

**Possible Errors:** 400 (Learning Activity bukan type Practice, unsupported target language, unsupported RTL language metadata), 403 (Governance Violation, attempt by AI endpoint to create Assessment Result), 404 (conversationId tidak ditemukan), 409 (activity belum terhubung ke Learning Objective), 422 (konteks tidak valid, invalid Activity Result, missing Assessment Blueprint, attempt to use translation/transliteration as official assessment source), 503 (AI Provider unavailable, voice capability unavailable, translation unavailable, transliteration unavailable — Graceful Degradation aktif, lihat AD-009).

**Related FR:** FR-012B, FR-006, FR-007, FR-008, FR-010, FR-011. **Related SRS:** SRS-FR-012B, SRS-FR-006, SRS-FR-007, SRS-FR-008, SRS-FR-010, SRS-FR-011. **Related Architecture Document:** `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md`, `20_state_machine.md`, `21_event_model.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md`. **Related AD:** AD-002, AD-003, AD-004, AD-005, AD-006, AD-007, AD-008, AD-009.

---

## 11.16 Placement Test API Alignment

**Purpose:** Menjelaskan Placement Test sebagai specialization dari Learning Activity API, bukan domain entity baru.

**Supported Operations:**

- `GET /api/v1/learning-activities?purpose=placement` — menemukan Learning Activity yang ditandai sebagai Placement Test melalui metadata.
- `POST /api/v1/learning-activities/{activityId}/start` — memulai Placement Test sebagai Learning Activity.
- `POST /api/v1/learning-activities/{activityId}/complete` — menyelesaikan Placement Test dan menghasilkan Activity Result.
- `GET /api/v1/assessment-results/{resultId}` — mengambil official Assessment Result dan Placement starting point suggestion setelah Assessment Engine selesai.

**Validation Rules:**

- Placement Test tidak memiliki endpoint resource `/placement-tests` dan tidak memperkenalkan Placement Test domain entity.
- Completion Placement Test menghasilkan Activity Result dan diteruskan ke Assessment Engine dengan Assessment Blueprint yang sesuai.
- Placement starting point suggestion dapat muncul pada response completion atau Assessment Result response hanya sebagai suggestion.
- Placement starting point suggestion bukan Learning Decision dan tidak boleh memanggil Recommendation Engine pada MVP.

**Related FR:** FR-016, FR-006, FR-007, FR-008, FR-010, FR-011. **Related SRS:** SRS-FR-016, SRS-FR-006, SRS-FR-007, SRS-FR-008, SRS-FR-010, SRS-FR-011.

---

## 11.17 Request / Response Examples

Contoh berikut bersifat konseptual. Field teknis final tetap tunduk pada implementation schema, tetapi boundary pada contoh ini mengikat.

### Start Placement Test

```http
POST /api/v1/learning-activities/{activityId}/start
Content-Type: application/json
```

```json
{
  "activity_purpose": "Placement",
  "learner_context_source": "session"
}
```

Response dapat mengembalikan Learning Activity metadata:

```json
{
  "activity_id": "act-placement-arabic-001",
  "activity_type": "Exercise",
  "activity_purpose": "Placement",
  "is_assessable": true,
  "assessment_blueprint_id": "abp-placement-arabic-001"
}
```

### Complete Placement Test

```http
POST /api/v1/learning-activities/{activityId}/complete
Content-Type: application/json
```

```json
{
  "activity_result": {
    "completion_status": "Completed",
    "answers": ["..."],
    "submitted_at": "2026-07-06T00:00:00Z"
  }
}
```

Response returns Activity Result and may reference asynchronous assessment:

```json
{
  "activity_result_id": "ar-placement-001",
  "assessment_status": "Assessing",
  "assessment_result_id": null,
  "placement_starting_point_suggestion": null
}
```

### Retrieve Placement Assessment Result / Starting Point Suggestion

```http
GET /api/v1/assessment-results/{resultId}
```

```json
{
  "assessment_result_id": "asr-placement-001",
  "activity_result_id": "ar-placement-001",
  "assessment_blueprint_id": "abp-placement-arabic-001",
  "source_activity_purpose": "Placement",
  "placement_starting_point_suggestion": {
    "suggested_module_id": "module-arabic-a1-002",
    "reason_summary": "Based on Placement Test Assessment Result"
  },
  "is_learning_decision": false,
  "recommendation_engine_invoked": false
}
```

### Start AI Conversation Practice

```http
POST /api/v1/learning-activities/{activityId}/ai-conversation/start
Content-Type: application/json
```

```json
{
  "target_language": "ar",
  "script": "Arabic",
  "direction": "rtl",
  "translation": { "language": "id", "enabled": false },
  "transliteration": { "enabled": false },
  "voice": {
    "speech_to_text": "required",
    "text_to_speech": "required",
    "recording_state": "idle",
    "processing_state": "idle",
    "playback_state": "idle",
    "permission_state": "unknown",
    "retry_state": "not_required"
  }
}
```

### Send Text Message

```http
POST /api/v1/ai-conversations/{conversationId}/messages
Content-Type: application/json
```

```json
{
  "input_type": "text",
  "message_text": "مرحبا، أريد أن أتدرب على التعارف.",
  "target_language": "ar"
}
```

Response preserves canonical target-language transcript:

```json
{
  "conversation_turn_id": "turn-001",
  "message_id": "msg-001",
  "canonical_target_language_transcript": "مرحبا، أريد أن أتدرب على التعارف.",
  "target_language": "ar",
  "script": "Arabic",
  "direction": "rtl",
  "translation": null,
  "transliteration": null,
  "assessment_source": "canonical_target_language_transcript"
}
```

### Send Voice-Capable Input or Transcript

```http
POST /api/v1/ai-conversations/{conversationId}/messages
Content-Type: application/json
```

```json
{
  "input_type": "voice",
  "audio_input_reference": "learner-audio-001",
  "target_language": "ar",
  "voice_metadata": {
    "recording_state": "completed",
    "processing_state": "completed",
    "permission_state": "granted",
    "retry_state": "not_required",
    "tts_requested": true
  }
}
```

```json
{
  "conversation_turn_id": "turn-002",
  "canonical_target_language_transcript": "اسمي أحمد وأدرس العربية.",
  "stt_transcript": "اسمي أحمد وأدرس العربية.",
  "voice_transcript_metadata": {
    "source": "speech_to_text",
    "processing_state": "completed"
  },
  "audio_response": {
    "audio_reference": "tts-response-001",
    "available": true
  },
  "audio_metadata": { "playback_state": "ready" },
  "translation": null,
  "transliteration": null
}
```

### Toggle Indonesian Translation / Request Transliteration

```http
POST /api/v1/ai-conversations/{conversationId}/messages
Content-Type: application/json
```

```json
{
  "input_type": "text",
  "message_text": "كيف حالك؟",
  "target_language": "ar",
  "translation": { "language": "id", "enabled": true },
  "transliteration": { "enabled": true }
}
```

```json
{
  "canonical_target_language_transcript": "كيف حالك؟",
  "translation": {
    "language": "id",
    "text": "Apa kabarmu?",
    "learner_support_only": true,
    "official_assessment_source": false
  },
  "transliteration": {
    "text": "kayfa haluka?",
    "learner_support_only": true,
    "official_assessment_source": false
  }
}
```

### Complete Assessable AI Conversation Practice

```http
POST /api/v1/ai-conversations/{conversationId}/complete
Content-Type: application/json
```

```json
{
  "completion_type": "assessable_learning_activity",
  "official_assessment_sources": [
    "canonical_target_language_transcript",
    "approved_assessment_evidence",
    "supported_evidence_types": ["canonical_target_language_transcript", "completion_data", "pronunciation_related_metadata", "other_supported_activity_evidence"],
    "activity_result"
  ],
  "excluded_assessment_sources": ["translation", "transliteration"]
}
```

```json
{
  "conversation_id": "conv-001",
  "activity_result_id": "ar-ai-practice-001",
  "assessment_status": "Assessing",
  "assessment_result_id": null,
  "ai_created_assessment_result": false
}
```

### Retrieve Official Assessment Result for AI Conversation Practice

```http
GET /api/v1/assessment-results/{resultId}
```

```json
{
  "assessment_result_id": "asr-ai-practice-001",
  "activity_result_id": "ar-ai-practice-001",
  "assessment_blueprint_id": "abp-speaking-practice-001",
  "evidence_sources": [
    "canonical_target_language_transcript",
    "approved_assessment_evidence"
  ],
  "excluded_sources": ["translation", "transliteration"],
  "produced_by": "Assessment Engine",
  "produced_by_ai": false
}
```

---

# 12. Internal Engine APIs

Bagian ini mendeskripsikan **service contract**, bukan implementasi. Internal Engine API dipicu oleh Runtime sesuai State Machine dan Event Model (AD-003), bukan dipanggil langsung antar Engine.

## 12.1 Assessment Engine

**Contract:** Menerima Activity Result dan referensi Assessment Blueprint yang berlaku; untuk Placement Test dapat menerima placement-specific Activity Result; untuk assessable AI Conversation Practice dapat menerima Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain. Mengembalikan Assessment Result.
**Karakteristik:** Stateless, deterministic — input yang sama menghasilkan output yang sama.
**Tidak melakukan:** mendefinisikan business rule evaluasi baru (rule dimiliki Assessment Blueprint pada Learning Domain), memanggil Recommendation Engine untuk MVP Placement starting point suggestion, atau menerima translation/transliteration sebagai official assessment source.
**Event terkait:** `AssessmentStarted`, `AssessmentCompleted`, `AssessmentResultGenerated`.
**Related AD:** AD-004.

## 12.2 Knowledge Profile Engine

**Contract:** Menerima Assessment Result yang valid; memperbarui Knowledge Profile Learner secara incremental (bukan rebuild total).
**Karakteristik:** Stateless, deterministic, sole owner Knowledge Profile.
**Official Event:** `KnowledgeProfileUpdated`.
**Observability-only records:** `KnowledgeProfileUpdateStarted`, `KnowledgeProfileUpdateFailed` (tidak dipublikasikan sebagai official Runtime Event; dicatat sebagai logs, metrics, atau system_event_log).
Catatan:
KnowledgeProfileUpdateStarted dan KnowledgeProfileUpdateFailed bukan official Runtime Event Contract. Keduanya hanya boleh digunakan sebagai log, trace, metric, system_event_log record, atau internal diagnostics sesuai keputusan Observability-Only MVP.
**Related AD:** AD-002, AD-007.

## 12.3 Recommendation Engine

**Contract:** Menerima Learning Design, Learning Context, dan Program Context; menghasilkan tepat satu Learning Decision per siklus evaluasi.
**Karakteristik:** Sole owner Learning Decision; Learning Decision wajib salah satu dari 7 jenis resmi.
**Official Event:** `LearningDecisionGenerated`.
**Observability-only records:** `RecommendationStarted`, `RecommendationCompleted`, `RecommendationFailed` (tidak dipublikasikan sebagai official Runtime Event; dicatat sebagai logs, metrics, atau system_event_log).
Catatan:
RecommendationStarted, RecommendationCompleted, dan RecommendationFailed bukan official Runtime Event Contract. Keduanya hanya boleh digunakan sebagai log, trace, metric, system_event_log record, atau internal diagnostics sesuai keputusan Observability-Only MVP.
**Related AD:** AD-006.

> Struktur data konkret Program Context tidak didefinisikan secara formal oleh arsitektur sumber; kontrak ini mengikuti dokumen sumber apa adanya (lihat Bagian 25, Open Issue).

---

# 13. AI Provider Gateway APIs

AI Provider Gateway adalah satu-satunya jalur ke AI Provider (AD-008). API ini tidak mengekspos API spesifik provider ke layer manapun.

| API                 | Deskripsi                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Conversation**    | Mengelola siklus hidup sesi percakapan AI Personal Learning Agent dengan AI Provider yang dipilih melalui Provider Selection Strategy. |
| **Prompt**          | Mengirimkan prompt yang telah disusun berdasarkan AI Context Hierarchy ke AI Provider melalui Provider Adapter.                        |
| **Completion**      | Menerima hasil completion dari AI Provider dan meneruskannya sebagai AI Conversation Experience, tanpa memodifikasi data resmi.        |
| **Health Check**    | Memeriksa ketersediaan AI Provider Gateway dan provider yang terhubung, mendukung Fallback Strategy.                                   |
| **Provider Status** | Melaporkan status masing-masing AI Provider (tersedia/fallback/gagal) untuk kebutuhan Observability.                                   |

Seluruh API di atas tunduk pada Graceful Degradation (AD-009): kegagalan AI Provider tidak boleh menghentikan Canonical Learning Pipeline. Pada Phase 2, Learning Decision dari Recommendation Engine tetap ditampilkan tanpa AI apabila seluruh provider gagal. Pada MVP, AI Provider failure tidak boleh memicu Recommendation Engine atau membuat Learning Decision.

---

# 14. Pagination Standard

Seluruh API yang mengembalikan koleksi resource wajib mendukung pagination, sesuai `61_api_design_principles.md`. Response koleksi menyertakan metadata pagination: jumlah total data, halaman saat ini, dan ukuran halaman. Parameter request pagination bersifat query parameter standar (mis. halaman dan ukuran halaman) tanpa memperkenalkan atribut bisnis baru.

---

# 15. Filtering Standard

API dapat menyediakan filtering pada level query parameter untuk mempersempit hasil resource (mis. filter Status pada Learning Program, filter Learner pada Assessment Result), tanpa mengubah makna atau struktur data resource dan tanpa memperkenalkan atribut baru di luar yang telah didefinisikan arsitektur.

---

# 16. Sorting Standard

API dapat menyediakan sorting pada query parameter, dibatasi hanya pada atribut resmi yang telah didefinisikan pada masing-masing Data Object (Bagian 11), tanpa memperkenalkan atribut baru.

---

# 17. Searching Standard

API dapat menyediakan kapabilitas pencarian umum pada resource, dibatasi pada atribut resmi resource tersebut (mis. pencarian Learning Program berdasarkan judul), konsisten dengan `61_api_design_principles.md`.

---

# 18. Validation Rules

Validasi diterapkan berlapis sesuai layer pemiliknya, konsisten dengan `61_api_design_principles.md` Bagian 9.

## Input Validation

Dilakukan pada level API untuk memastikan format, tipe data, dan kelengkapan field request, sebelum diteruskan ke Domain.

## Domain Validation

Business rule yang telah didefinisikan pada dokumen arsitektur Learning Domain (mis. Program Type resmi, klasifikasi Learning Objective, Assessment Strategy resmi) dieksekusi oleh Domain. API tidak mendahului atau menduplikasi business rule tersebut (AD-002).

## Engine Validation

Dilakukan oleh Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine sesuai peran generik masing-masing pada Canonical Learning Pipeline (AD-005), tanpa mendefinisikan aturan evaluasi baru. API hanya meneruskan request menuju layer yang berwenang.

---

# 19. Idempotency Rules

Operasi yang berpotensi dipanggil berulang akibat retry jaringan dirancang idempotent, khususnya:

- `POST /api/v1/learning-activities/{activityId}/complete` — pemanggilan berulang dengan Activity Result yang sama tidak boleh menghasilkan lebih dari satu Assessment Result untuk siklus evaluasi yang sama.
- `POST /api/v1/ai-conversations/{conversationId}/complete` — pemanggilan berulang dengan conversation evidence yang sama tidak boleh menghasilkan lebih dari satu Activity Result / Assessment Result untuk conversation completion yang sama.
- Seluruh API yang memicu Assessment Engine dan Knowledge Profile Engine — konsisten dengan sifat deterministic dan stateless kedua Engine tersebut.

Idempotency dicapai melalui Idempotency Key atau operation identifier yang stabil. Correlation ID tetap digunakan untuk observability dan tidak boleh menjadi satu-satunya mekanisme deduplication. Idempotency key yang dikirim klien dan diverifikasi oleh entrypoint service sebelum meneruskan request ke Engine.

---

# 20. Rate Limiting

Seluruh API tunduk pada rate limiting untuk melindungi Canonical Learning Pipeline dan AI Provider Gateway dari beban berlebih. Pelanggaran batas menghasilkan status 429 (lihat Bagian 10). AI Provider Gateway secara khusus memantau Cost per Request dan Token Usage sebagai bagian dari kontrol rate limiting terhadap AI Provider (lihat `60_srs.md` Bagian 17.2).

---

# 21. Timeout Strategy

Setiap pemanggilan API terhadap Engine (Assessment Engine, Knowledge Profile Engine, Recommendation Engine) dan AI Provider Gateway dibatasi oleh timeout untuk mencegah permintaan menggantung. Kegagalan akibat timeout terhadap AI Provider Gateway memicu Fallback Strategy (AD-009); voice, translation, dan transliteration fallback tidak boleh mengubah canonical target-language transcript. Kegagalan timeout terhadap Engine inti dicatat sebagai System Error (status 500/503) dan dipantau melalui Observability (Bagian 23).

---

# 22. Retry Strategy

Retry pada level API dilakukan hanya untuk operasi yang bersifat idempotent (Bagian 19). AI Provider Gateway menerapkan retry sebagai bagian dari Fallback Strategy terhadap provider cadangan sebelum menampilkan fallback non-AI kepada Learner. Dokumen ini tidak mendefinisikan parameter teknis retry (jumlah percobaan, backoff) karena bersifat detail infrastruktur, konsisten dengan Out of Scope `21_event_model.md`.

---

# 23. Observability

## Logging

Setiap kegagalan pada Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine menghasilkan event error yang dapat dipantau monitoring.

## Metrics

AI Provider Gateway memantau Request Count, Success Rate, Error Rate, Latency, Cost per Request, Token Usage, dan Provider Availability, konsisten dengan `60_srs.md` Bagian 17.2.

## Tracing

Setiap request wajib memiliki Correlation ID dan Trace ID untuk mendukung tracing lintas layanan. (Bagian 8).

## Audit Logging

Setiap interaksi AI wajib dicatat dengan field minimum: Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, Error, konsisten dengan `60_srs.md` Bagian 17.1. Seluruh Domain Event dan Engine Event bersifat immutable setelah dipublikasikan, mendukung ketertelusuran audit end-to-end pada Canonical Learning Pipeline.

---

# 24. AI API Restrictions

Sesuai AD-006, AD-007, AD-008, AD-009 dan AI Authority Matrix (`44_ai_governance.md`), AI API pada dokumen ini **MUST NOT**:

- Menghasilkan (generate) Learning Decision.
- Memperbarui (update) Knowledge Profile.
- Menghasilkan (generate), memperbarui, atau memiliki official Assessment Result.
- Memodifikasi Learning Design.
- Memodifikasi Learning Objective.
- Memodifikasi Assessment Blueprint.
- Memodifikasi Learning Content resmi.
- Mempublikasikan Official Runtime Events secara langsung.
- Menjadikan translation/transliteration sebagai official assessment source.
- Memperkenalkan real-time voice call, voice biometrics, standalone pronunciation certification, full localization platform, dictionary engine, dialect detection, atau real-time interpretation.
- Memodifikasi Learning Program.
- Melewati (override) business rule Domain manapun.

Ownership tunggal ditegaskan kembali:

- **Hanya Recommendation Engine** yang memiliki (owns) Learning Decision.
- **Hanya Knowledge Profile Engine** yang memiliki (owns) Knowledge Profile.
- **Hanya Assessment Engine** yang memiliki (owns) Assessment Result, melalui eksekusi Assessment Blueprint.

AI API (Bagian 11.12, 11.13, 11.15, dan 13) hanya berfungsi sebagai Experience Layer yang mengonsumsi output resmi dari Engine di atas, tanpa menghasilkan atau mengubahnya. Untuk assessable AI Conversation Practice, AI API hanya menyediakan Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain; Assessment Engine tetap menghasilkan official Assessment Result.

---

# 25. Open Issues

Bagian ini hanya mencatat gap implementasi yang telah diidentifikasi pada `52_prd.md` dan `60_srs.md`. Tidak ada redesain arsitektur yang dilakukan untuk menutup gap ini.

| #   | Open Issue                                                                                                                                                                                                                                   | Dampak terhadap API Specification                                                                                                                                                                                                                                                                                                                                                     | Related AD             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | **Advanced Authentication / Full Identity Platform** belum memiliki dasar arsitektur yang lengkap. MVP Basic Learner Authentication (FR-012C) telah didefinisikan di Bagian 6.1 dengan scope terbatas.                                       | Dokumen ini mendefinisikan MVP Auth API hanya untuk Learner login/logout/session context. Advanced Authentication (public signup, OAuth, MFA, SSO, Educator auth, role management) menunggu Architecture Review.                                                                                                                                                                      | AD-010                 |
| 2   | **Enrollment** belum memiliki domain pemilik.                                                                                                                                                                                                | Tidak ada endpoint Enrollment resmi; hanya aturan "Learning Program berstatus Published dapat digunakan untuk enrollment baru" yang tercermin pada validasi Learning Program (Bagian 11.1).                                                                                                                                                                                           | AD-002, AD-010         |
| 3   | **Notification** tidak dibahas arsitektur manapun.                                                                                                                                                                                           | Tidak ada endpoint Notification pada dokumen ini.                                                                                                                                                                                                                                                                                                                                     | —                      |
| 4   | **Analytics** tidak memiliki dokumen kepemilikan formal.                                                                                                                                                                                     | Tidak ada endpoint Analytics khusus; API hanya menyediakan metadata mentah dari Engine yang sudah ada (Assessment Result, Knowledge Profile, Learning Decision).                                                                                                                                                                                                                      | AD-010                 |
| 5   | **Achievement/Certificate** tidak dimodelkan sebagai entitas.                                                                                                                                                                                | Tidak ada endpoint Achievement/Certificate pada dokumen ini.                                                                                                                                                                                                                                                                                                                          | AD-002                 |
| 6   | **Educator permission** (boundary akses formal terhadap data Learner) belum didefinisikan.                                                                                                                                                   | Endpoint pada Bagian 11.8, 11.9, dan 11.10 mencantumkan akses Educator secara prinsip, tetapi mekanisme otorisasi rincinya menunggu Architecture Review.                                                                                                                                                                                                                              | AD-002, AD-010         |
| 7   | **Manual Assessment/Peer Review** belum terhubung eksplisit ke Assessment Engine.                                                                                                                                                            | Assessment Strategy "Peer Review" tercantum pada Assessment Blueprint (Bagian 11.7), tetapi alur integrasi API-nya ke Assessment Engine belum dapat dispesifikasikan.                                                                                                                                                                                                                 | AD-004                 |
| 8   | **AI Assisted Assessment** berpotensi bersinggungan dengan AI Boundary jika diterapkan di luar batas FR-012B.                                                                                                                                | FR-012B hanya mengizinkan Activity Result atau approved assessment evidence yang didukung, termasuk canonical target-language transcript, completion data, pronunciation-related metadata, atau activity evidence lain sebagai input/evidence untuk Assessment Engine. AI Assisted Assessment lain di luar batas ini menunggu Architecture Review agar tidak melanggar AD-006/AD-009. | AD-006, AD-009         |
| 9   | **Program Context** (input Recommendation Engine) tidak didefinisikan strukturnya secara formal.                                                                                                                                             | Kontrak Internal Engine API Recommendation Engine (Bagian 12.3) mengikuti dokumen sumber apa adanya tanpa skema Program Context yang rinci.                                                                                                                                                                                                                                           | AD-002                 |
| 10  | **Class Management dan Assignment Review** (FR-027) belum terdefinisi sebagai entitas/alur resmi.                                                                                                                                            | Tidak ada endpoint Class/Assignment Review pada dokumen ini.                                                                                                                                                                                                                                                                                                                          | —                      |
| 11  | **Voice/localization extensions** seperti real-time voice call, voice biometrics, standalone pronunciation certification, full localization platform, dictionary engine, dialect detection, dan real-time interpretation berada di luar MVP. | API menyediakan mandatory STT/TTS capability metadata, canonical target-language transcript, Indonesian translation toggle, optional transliteration, dan RTL/script metadata sesuai FR-012B. Tidak ada endpoint tambahan untuk extension tersebut.                                                                                                                                   | AD-006, AD-008, AD-009 |

---

# 26. Engineering Freeze Declaration

API Specification ini dibekukan sebagai sumber kebenaran API konseptual dan kontraktual resmi untuk engineering Kaifa v2. Kontrak baca Activity Result bersifat authoritative untuk Basic Progress Dashboard dan riwayat aktivitas Learner; Activity Result tetap merupakan record Runtime dan read-only bagi klien. Assessment Result tetap dimiliki dan hanya dihasilkan oleh Assessment Engine. AI API tidak menghasilkan Assessment Result, memperbarui Knowledge Profile, menghasilkan Learning Decision, atau mempublikasikan Official Runtime Events. Placement Test tetap merupakan specialized assessable Learning Activity dan tidak memperkenalkan resource `/placement-tests`. Perubahan selanjutnya memerlukan controlled review terhadap frozen Architecture serta dokumen Product, Engineering, Database Model, Engine Contracts, dan Event Contracts yang authoritative.

---

# 27. Traceability Matrix

| API Resource                                                               | Related FR                                      | Related SRS                                                             | Architecture Document                                                                                                                                                                                                                               | Architecture Layer                         | Related AD                                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Learning Program                                                           | FR-001, FR-002                                  | SRS-FR-001, SRS-FR-002                                                  | `10_learning_program.md`, `11_program_structure.md`                                                                                                                                                                                                 | Learning Domain                            | AD-002                                                         |
| Program Structure                                                          | FR-002                                          | SRS-FR-002                                                              | `11_program_structure.md`                                                                                                                                                                                                                           | Learning Domain                            | AD-002                                                         |
| Learning Module                                                            | FR-003                                          | SRS-FR-003                                                              | `13_learning_module.md`                                                                                                                                                                                                                             | Learning Domain                            | AD-002                                                         |
| Learning Design                                                            | FR-004                                          | SRS-FR-004                                                              | `12_learning_design.md`                                                                                                                                                                                                                             | Learning Domain                            | AD-002                                                         |
| Learning Objective                                                         | FR-005                                          | SRS-FR-005                                                              | `14_learning_objective.md`                                                                                                                                                                                                                          | Learning Domain                            | AD-002                                                         |
| Learning Activity                                                          | FR-006                                          | SRS-FR-006                                                              | `15_learning_activity.md`                                                                                                                                                                                                                           | Learning Domain                            | AD-002, AD-005                                                 |
| Activity Result                                                            | FR-006, FR-012, FR-012B, FR-016                 | SRS-FR-006, SRS-FR-012, SRS-FR-012B, SRS-FR-016                         | `15_learning_activity.md`, `30_assessment_engine.md`, `20_state_machine.md`                                                                                                                                                                         | Runtime                                    | AD-002, AD-005, AD-006, AD-009                                 |
| Assessment Blueprint                                                       | FR-007                                          | SRS-FR-007                                                              | `16_assessment_blueprint.md`                                                                                                                                                                                                                        | Learning Domain                            | AD-002, AD-004                                                 |
| Assessment Result                                                          | FR-008, FR-012B, FR-016                         | SRS-FR-008, SRS-FR-012B, SRS-FR-016                                     | `30_assessment_engine.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`                                                                                                                                                                  | Engine                                     | AD-004, AD-005, AD-006, AD-009                                 |
| Learning Content                                                           | FR-009                                          | SRS-FR-009                                                              | `22_content_model.md`                                                                                                                                                                                                                               | Runtime                                    | AD-001                                                         |
| Knowledge Profile                                                          | FR-013                                          | SRS-FR-013                                                              | `31_knowledge_profile_engine.md`                                                                                                                                                                                                                    | Engine                                     | AD-002, AD-007                                                 |
| Learning Decision                                                          | FR-014                                          | SRS-FR-014                                                              | `32_recommendation_engine.md`                                                                                                                                                                                                                       | Engine                                     | AD-006                                                         |
| AI Conversation                                                            | FR-018, FR-019, FR-023, FR-024, FR-025          | SRS-FR-018, SRS-FR-019, SRS-FR-023, SRS-FR-024, SRS-FR-025              | `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`                                                                                                                                                                  | AI Layer                                   | AD-006, AD-007, AD-008, AD-009                                 |
| AI Memory                                                                  | FR-020                                          | SRS-FR-020                                                              | `42_ai_memory.md`                                                                                                                                                                                                                                   | AI Layer                                   | AD-007                                                         |
| AI Provider Gateway (Internal)                                             | FR-021, FR-022                                  | SRS-FR-021, SRS-FR-022                                                  | `41_ai_provider_integration.md`, `40_ai_architecture.md`                                                                                                                                                                                            | AI Layer                                   | AD-008, AD-009                                                 |
| Educator Monitoring (read-only, via Knowledge Profile & Learning Decision) | FR-026                                          | SRS-FR-026                                                              | `50_user_journey.md`, `20_state_machine.md`, `31_knowledge_profile_engine.md`                                                                                                                                                                       | Product, Runtime, Engine                   | AD-002                                                         |
| Public Landing Page                                                        | FR-012A                                         | SRS-FR-012A                                                             | `50_user_journey.md`, `51_roadmap.md`                                                                                                                                                                                                               | Product                                    | AD-002                                                         |
| AI Conversation Practice                                                   | FR-012B, FR-006, FR-007, FR-008, FR-010, FR-011 | SRS-FR-012B, SRS-FR-006, SRS-FR-007, SRS-FR-008, SRS-FR-010, SRS-FR-011 | `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md`, `20_state_machine.md`, `21_event_model.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md`, `40_ai_architecture.md`, `41_ai_provider_integration.md` | Learning Domain, Runtime, Engine, AI Layer | AD-002, AD-003, AD-004, AD-005, AD-006, AD-007, AD-008, AD-009 |
| Placement Test                                                             | FR-016, FR-006, FR-007, FR-008, FR-010, FR-011  | SRS-FR-016, SRS-FR-006, SRS-FR-007, SRS-FR-008, SRS-FR-010, SRS-FR-011  | `50_user_journey.md`, `15_learning_activity.md`, `16_assessment_blueprint.md`, `30_assessment_engine.md`, `20_state_machine.md`, `21_event_model.md`                                                                                                | Product, Learning Domain, Runtime, Engine  | AD-002, AD-003, AD-004, AD-005                                 |
| MVP Basic Learner Authentication (`/api/v1/auth/*`)                        | FR-012C                                         | SRS-FR-012C                                                             | `50_user_journey.md`, `51_roadmap.md`                                                                                                                                                                                                               | Product / Application Layer                | AD-002                                                         |

---

# 28. References

Dokumen yang menjadi acuan dan dasar penyusunan dokumen ini:

- `00_foundation/00_overview.md`
- `00_foundation/01_architecture_principles.md`
- `00_foundation/02_glossary.md`
- `10_learning_domain/10_learning_program.md`
- `10_learning_domain/11_program_structure.md`
- `10_learning_domain/12_learning_design.md`
- `10_learning_domain/13_learning_module.md`
- `10_learning_domain/14_learning_objective.md`
- `10_learning_domain/15_learning_activity.md`
- `10_learning_domain/16_assessment_blueprint.md`
- `20_runtime/20_state_machine.md`
- `20_runtime/21_event_model.md`
- `20_runtime/22_content_model.md`
- `30_engine/30_assessment_engine.md`
- `30_engine/31_knowledge_profile_engine.md`
- `30_engine/32_recommendation_engine.md`
- `40_ai/40_ai_architecture.md`
- `40_ai/41_ai_provider_integration.md`
- `40_ai/42_ai_memory.md`
- `40_ai/43_ai_personal_learning_agent.md`
- `40_ai/44_ai_governance.md`
- `50_product/50_user_journey.md`
- `50_product/51_roadmap.md`
- `50_product/52_prd.md`
- `60_engineering/60_srs.md`
- `60_engineering/61_api_design_principles.md`
- `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan **API Specification** resmi untuk Kaifa v2, dimiliki oleh Product & Architecture. Dokumen ini tidak menggantikan `61_api_design_principles.md` sebagai standar desain, dan tidak berwenang mengubah definisi domain, engine, atau boundary AI yang telah dibekukan.

Setiap kebutuhan endpoint baru yang memerlukan entitas atau business rule yang belum ada harus diajukan terlebih dahulu melalui Architecture Review sebelum ditambahkan ke dokumen ini. Perubahan terhadap dokumen ini harus mempertahankan traceability penuh terhadap FR ID pada `52_prd.md` dan SRS Requirement pada `60_srs.md`, serta tidak boleh mendahului keputusan arsitektur yang belum diambil.
