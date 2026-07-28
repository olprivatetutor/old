# UI/UX Specification — Kaifa v2 MVP

| Field | Value |
| ----- | ----- |
| Version | 1.0 |
| Status | Freeze |
| Owner | Product & UI/UX |
| Depends On | `52_prd.md`, `60_srs.md`, `62_api_spec.md`, `80_feature_breakdown.md`, `99_architecture_decisions.md` |
| Used By | Product, UI/UX, Frontend, Backend, QA |
| Last Updated | 2026-07-05 |

Dokumen ini merupakan **UI/UX Specification** untuk MVP Kaifa v2. Dokumen ini menerjemahkan Functional Requirement dan SRS Requirement yang telah dibekukan menjadi perilaku layar, komponen, dan alur navigasi yang dapat diimplementasikan oleh tim Frontend dan diverifikasi oleh QA.

Dokumen ini **tidak** mendesain ulang arsitektur, **tidak** memperkenalkan business entity baru, **tidak** memperkenalkan business rule baru, dan **tidak** menyelesaikan Open Issue arsitektur. Seluruh istilah arsitektur dan nama entitas dituliskan dalam Bahasa Inggris sesuai dokumen sumber. Narasi penjelasan dituliskan dalam Bahasa Indonesia.

---

# 1. Purpose

Dokumen ini bertujuan agar:

* Setiap layar dan alur UI dapat ditelusuri ke Functional Requirement (FR), SRS Requirement, dan API yang relevan.
* Tidak ada komponen UI yang melanggar boundary Domain, Engine, atau AI Layer.
* Learner context aktif selalu tersedia dan terisolasi per Learner.
* Perilaku UI saat error, loading, dan empty state terdefinisi dengan jelas.
* Tim Frontend, Backend, dan QA memiliki referensi yang sama tentang perilaku sistem yang diharapkan.

---

# 2. MVP UX Scope

Layar berikut termasuk dalam scope MVP:

* **Landing Page** — informasi produk publik, dapat diakses tanpa login.
* **Login** — autentikasi Learner minimal untuk membangun Learner context.
* **Learner Home** — halaman utama setelah login, titik masuk ke program.
* **Program / Subject Selection** — daftar Learning Program yang tersedia.
* **Program Detail / Module List** — daftar Learning Module dalam satu Program.
* **Placement Test** — UX-011, specialized assessable Learning Activity dengan `purpose = Placement`.
* **Learning Activity** — halaman eksekusi Learning Activity.
* **AI Conversation Practice** — panel percakapan AI untuk Learning Activity type Practice.
* **Activity Completion / Assessment Result** — ringkasan hasil setelah Learning Activity selesai dan Assessment Engine menghasilkan Assessment Result.
* **Basic Progress Dashboard** — ringkasan progres belajar Learner berbasis State Machine dan Assessment Result.
* **Error / Fallback State** — layar atau state untuk kondisi error sistem, AI tidak tersedia, dan sesi berakhir.

---

# 3. Out of Scope

Hal-hal berikut **tidak termasuk** dalam MVP UI/UX dan tidak boleh diimplementasikan atau direferensikan sebagai fitur aktif:

* Public signup / registrasi mandiri Learner.
* Forgot password / reset password / email verification.
* OAuth login / Google login / SSO.
* MFA.
* Adaptive learning path / personalized recommendation (Phase 2 — Knowledge Profile Engine + Recommendation Engine).
* Knowledge Profile visualization dalam MVP UI.
* Learning Decision explanation dalam MVP UI.
* Educator dashboard dan Educator account (Phase 4).
* Parent dashboard (Phase 5).
* Enrollment workflow formal (Open Issue arsitektur).
* Payment / subscription.
* Notifikasi sistem (Phase 5).
* Achievement / sertifikat (Phase 5).
* Advanced analytics (Phase 2+).
* Learner profile editing dan advanced identity management.
* Role management dan permission UI.

---

# 4. Primary MVP User Flow

Alur utama pengguna MVP adalah sebagai berikut:

```text
Landing Page (public)
    │ Learner memilih masuk
    ▼
Login Page
    │ Login berhasil → Learner context aktif
    ▼
Learner Home
    │ Learner memilih program
    ▼
Program / Subject Selection
    │ Learner memilih Learning Program
    ▼
Program Detail / Module List
    │ Learner memilih Learning Module
    ▼
Learning Activity Page
    │ Activity type bukan Practice
    │ Learner menyelesaikan aktivitas
    ├────────────────────────────────────────┐
    │ Activity type = Practice               │
    │ dan AI Conversation Practice aktif     │
    ▼                                        ▼
AI Conversation Practice Panel       Penyelesaian Langsung
    │ Learner mengakhiri sesi AI            │
    └─────────────────────┬─────────────────┘
                          ▼
              Activity Completion / Assessment Result
                          │ Learner melihat hasil
                          ▼
              Basic Progress Dashboard
```

**Catatan alur:**

* State pembelajaran mengikuti State Machine: `Not Started → Learning → Assessing → [Phase 2: Updating Knowledge Profile → Generating Learning Decision → Ready for Next Activity] → Completed`.
* Pada MVP, setelah state `Assessing` dan Assessment Result dihasilkan, UI menyajikan hasil langsung. Transisi ke `Updating Knowledge Profile` dan `Generating Learning Decision` adalah Phase 2 dan tidak ada di MVP UI.
* Learner dapat kembali ke Learner Home / Dashboard kapan saja dari Program Detail atau setelah menyelesaikan Learning Activity.

---

# 5. Learner Context Rules

Aturan Learner context berlaku di seluruh layar MVP:

1. **Setiap layar terautentikasi harus beroperasi di bawah Learner context aktif** yang diperoleh dari sesi yang valid.
2. **Isolasi data Learner wajib ditegakkan**: Learner A tidak boleh dapat melihat, mengakses, atau memodifikasi data milik Learner B.
3. **Jika sesi tidak ada atau sudah berakhir (expired)**, sistem wajib mengarahkan pengguna ke halaman Login. Tidak ada data Learner yang ditampilkan sebelum sesi valid.
4. **Landing Page tetap publik** — satu-satunya layar yang tidak membutuhkan Learner context aktif.
5. Learner context diperoleh dari endpoint `GET /api/v1/auth/me`. Seluruh komponen yang bergantung pada identitas Learner (Learning Activity, AI Conversation Practice, Dashboard) harus menggunakan referensi Learner dari context ini.
6. Logout wajib tersedia di seluruh halaman terautentikasi dan wajib menghapus sesi aktif.

---

# 6. Screen Inventory

| Screen ID | Screen Name | Feature Mapping | API Mapping | Data Used | Notes |
| --------- | ----------- | --------------- | ----------- | --------- | ----- |
| UX-001 | Public Landing Page | FB-MVP-013 / FR-012A | `GET /api/v1/public/landing-page`, `GET /api/v1/public/program-highlights` | `landing_page_config` | Public, unauthenticated. Tidak ada data Learner. |
| UX-002 | Login Page | FB-MVP-015 / FR-012C | `POST /api/v1/auth/login` | `learner_auth_account`, `auth_session` | Minimal MVP login. Tidak ada public signup. |
| UX-003 | Learner Home | FB-MVP-001, FB-MVP-015 / FR-001, FR-012C | `GET /api/v1/auth/me`, `GET /api/v1/learning-programs` | `learner`, `learning_program` | Membutuhkan Learner context aktif. |
| UX-004 | Program / Subject Selection | FB-MVP-001 / FR-001 | `GET /api/v1/learning-programs` | `learning_program` | Hanya program Published. |
| UX-005 | Program Detail / Module List | FB-MVP-002, FB-MVP-003 / FR-002, FR-003 | `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-modules` | `learning_program`, `program_structure`, `learning_module` | Hanya modul Published. |
| UX-006 | Learning Activity Page | FB-MVP-006, FB-MVP-009 / FR-006, FR-009 | `GET /api/v1/learning-activities/{activityId}`, `POST /api/v1/learning-activities/{activityId}/complete` | `learning_activity`, `content_item`, `learning_state` | Context: Learning Objective, Learning Content. Menampilkan tombol AI Practice jika activity_type = Practice. |
| UX-007 | AI Conversation Practice | FB-MVP-014 / FR-012B | `POST .../ai-conversation/start`, `POST .../messages`, `POST .../complete`, `GET /api/v1/ai-conversations/{conversationId}` | `ai_practice_conversation`, `ai_practice_message` | Hanya untuk activity_type = Practice. Bukan Assessment Result. |
| UX-008 | Activity Completion / Assessment Result | FB-MVP-008 / FR-008 | `GET /api/v1/assessment-results/{resultId}` | `assessment_result`, `activity_result` | Read-only bagi Learner. Bukan Learning Decision. |
| UX-009 | Basic Progress Dashboard | FB-MVP-012 / FR-012 | `GET /api/v1/auth/me`, `GET /api/v1/assessment-results`, `learning_state` | `learner`, `learning_state`, `assessment_result`, `activity_result` | Tidak menampilkan Knowledge Profile atau Learning Decision pada MVP. |
| UX-010 | Error / Fallback State | Cross-cutting | — | — | Sesi berakhir, AI tidak tersedia, jaringan gagal, aktivitas tidak ditemukan. |
| UX-011 | Placement Test | MVP Placement / FR-016 | Learning Activity APIs and Assessment Result API | `learning_activity`, `activity_result`, `assessment_result` | Dedicated UI for specialized Learning Activity `purpose = Placement`; not a new resource or Learning Decision. |

---

# 7. Screen-by-Screen Specification

## UX-001 — Public Landing Page

**Purpose:** Menyajikan informasi produk Kaifa kepada calon Learner atau pengunjung publik tanpa memerlukan login.

**Entry Conditions:** Tidak ada — dapat diakses oleh siapa saja tanpa autentikasi.

**Main UI Elements:**
* Header dengan nama produk dan tombol masuk/login.
* Ringkasan deskripsi produk dan nilai unggulan platform.
* Daftar ringkas program unggulan yang tersedia (`program-highlights`).
* Call-to-action menuju halaman Login.
* Footer informasi produk.

**Primary Actions:**
* Melihat informasi program → tidak ada navigasi ke detail program dalam MVP (informasi bersifat ringkasan statis).
* Klik login / masuk → menuju UX-002 (Login Page).

**Data/API Dependencies:**
* `GET /api/v1/public/landing-page` — konten informatif produk.
* `GET /api/v1/public/program-highlights` — daftar ringkas program Published.

**Empty State:** Jika konten Landing Page tidak tersedia, tampilkan pesan umum produk tanpa data dinamis.

**Error State:** Jika API gagal (`500`), tampilkan halaman statis fallback dengan informasi minimum produk.

**Out of Scope:**
* Enrollment dari Landing Page.
* Personalisasi berdasarkan data Learner.
* Analytics dari kunjungan Landing Page.
* Signup / registrasi langsung.

---

## UX-002 — Login Page

**Purpose:** Mengautentikasi Learner dan membangun Learner context aktif untuk sesi MVP.

**Entry Conditions:** Pengguna belum login, atau sesi sudah berakhir (redirect dari halaman lain).

**Main UI Elements:**
* Form login: field identifier (username atau email) dan password.
* Tombol "Masuk".
* Pesan error login jika kredensial salah.
* Tautan kembali ke Landing Page.

**Primary Actions:**
* Submit form login → `POST /api/v1/auth/login` → jika berhasil, redirect ke UX-003 (Learner Home).
* Kembali ke Landing Page.

**Data/API Dependencies:**
* `POST /api/v1/auth/login` — menerima kredensial, mengembalikan sesi aktif dan referensi Learner.
* `GET /api/v1/auth/me` — digunakan untuk memverifikasi Learner context setelah login berhasil.

**Empty State:** N/A — form login selalu ditampilkan.

**Error State:**
* Kredensial salah → tampilkan pesan "Username atau password tidak tepat."
* Server tidak tersedia → tampilkan pesan "Sistem tidak dapat dijangkau saat ini."

**Out of Scope:**
* Public signup / registrasi mandiri.
* Forgot password / reset password.
* OAuth / Google login.
* MFA.
* "Remember me" / persistent session (opsional, dapat diimplementasikan oleh tim tanpa mengubah kontrak arsitektur).

---

## UX-003 — Learner Home

**Purpose:** Halaman utama setelah login — memberikan titik masuk ke program pembelajaran dan ringkasan aktivitas terkini.

**Entry Conditions:** Learner telah login dan Learner context aktif tersedia.

**Main UI Elements:**
* Header dengan identitas Learner aktif (nama atau identifier) dan tombol Logout.
* Ringkasan progres singkat (jumlah aktivitas selesai, status terkini — opsional dalam MVP).
* Daftar atau kartu Learning Program yang tersedia (Published).
* Navigasi ke Basic Progress Dashboard.

**Primary Actions:**
* Pilih Learning Program → menuju UX-005 (Program Detail / Module List).
* Buka Dashboard → menuju UX-009.
* Logout → `POST /api/v1/auth/logout` → redirect ke UX-001 atau UX-002.

**Data/API Dependencies:**
* `GET /api/v1/auth/me` — Learner context aktif.
* `GET /api/v1/learning-programs` — daftar Learning Program Published.

**Empty State:** Jika tidak ada Learning Program Published, tampilkan pesan "Belum ada program yang tersedia saat ini."

**Error State:** Jika sesi tidak valid → redirect ke UX-002.

**Out of Scope:**
* Adaptive learning recommendation.
* Knowledge Profile summary.
* Learning Decision explanation.

---

## UX-004 — Program / Subject Selection

**Purpose:** Menampilkan daftar Learning Program yang tersedia untuk dipilih Learner.

**Entry Conditions:** Learner context aktif; Learner mengakses dari Learner Home.

**Main UI Elements:**
* Daftar kartu Learning Program dengan nama program, Program Type, dan deskripsi singkat.
* Filter atau pencarian program berdasarkan judul (opsional MVP).
* Indikator status (hanya Published yang ditampilkan).

**Primary Actions:**
* Pilih Learning Program → menuju UX-005 (Program Detail / Module List).
* Kembali ke Learner Home.

**Data/API Dependencies:**
* `GET /api/v1/learning-programs` — filter status Published.

**Empty State:** "Tidak ada program pembelajaran yang tersedia saat ini."

**Error State:** Gagal memuat program → "Gagal memuat daftar program. Silakan coba lagi."

**Out of Scope:** Enrollment flow, pembayaran, filtering berdasarkan Knowledge Profile.

---

## UX-005 — Program Detail / Module List

**Purpose:** Menampilkan struktur Learning Program dan daftar Learning Module yang dapat diakses Learner.

**Entry Conditions:** Learner telah memilih Learning Program dari UX-004.

**Main UI Elements:**
* Nama dan deskripsi Learning Program.
* Program Type dan Program Structure type (informational).
* Daftar Learning Module dalam Program Structure dengan nama, deskripsi, dan status Published.
* Indikator progres Learner per modul (jika tersedia dari State Machine — opsional MVP).

**Primary Actions:**
* Pilih Learning Module → menampilkan daftar Learning Activity dalam modul tersebut.
* Pilih Learning Activity → menuju UX-006 (Learning Activity Page).
* Kembali ke daftar program.

**Data/API Dependencies:**
* `GET /api/v1/learning-programs/{programId}` — detail program.
* `GET /api/v1/learning-modules` — daftar modul untuk program terkait (filter Published).
* `GET /api/v1/learning-activities` — daftar aktivitas per modul (filter Published).

**Empty State:** Modul belum tersedia → "Modul untuk program ini belum tersedia."

**Error State:** Program tidak ditemukan (`404`) → redirect ke UX-004.

**Out of Scope:** Adaptive sequencing, Learning Decision–based recommendations.

---

## UX-006 — Learning Activity Page

**Purpose:** Halaman eksekusi Learning Activity. Learner mengikuti aktivitas belajar, melihat Learning Content yang relevan, dan menyelesaikan aktivitas.

**Entry Conditions:** Learner memilih Learning Activity dari UX-005; state pembelajaran berada pada `Not Started` atau `Learning`.

**Main UI Elements:**
* Nama Learning Activity dan nama Learning Objective terkait.
* Viewer untuk Learning Content yang terhubung (jika tersedia — teks, embed, atau referensi konten).
* Petunjuk atau instruksi aktivitas sesuai Activity Type.
* Tombol "Selesaikan Aktivitas" (sesuai Completion Criteria).
* Tombol "Mulai AI Practice" — ditampilkan **hanya jika** `activity_type = Practice`. Tombol ini tidak muncul untuk activity type lain.

**Primary Actions:**
* Selesaikan aktivitas → `POST /api/v1/learning-activities/{activityId}/complete` → state transisi ke `Assessing` → menuju UX-008 (Activity Completion / Assessment Result) setelah Assessment Result tersedia.
* Mulai AI Practice (jika Practice type) → membuka UX-007 (AI Conversation Practice Panel).
* Kembali ke Module List.

**Data/API Dependencies:**
* `GET /api/v1/learning-activities/{activityId}` — detail aktivitas termasuk `activity_type` dan referensi Learning Objective.
* `GET /api/v1/learning-contents` — Learning Content terkait (jika ada, Published only).
* `POST /api/v1/learning-activities/{activityId}/complete` — menyelesaikan aktivitas.

**Empty State:** Learning Content belum tersedia → tampilkan instruksi aktivitas tanpa konten; Learner masih dapat menyelesaikan aktivitas.

**Error State:**
* State tidak berada pada `Learning` (`409`) → tampilkan pesan status tidak sesuai.
* Completion Criteria belum terpenuhi (`422`) → tampilkan panduan apa yang perlu diselesaikan.

**Out of Scope:** Adaptive content selection and Knowledge Profile-based activity personalization. Placement Test is handled by UX-011 as a specialized Learning Activity.

---

## UX-007 — AI Conversation Practice

**Purpose:** Panel percakapan AI untuk Learner berlatih secara conversational dalam konteks satu Learning Objective. Hanya tersedia untuk Learning Activity type `Practice`.

**Entry Conditions:**
* Learner berada di UX-006 pada Learning Activity dengan `activity_type = Practice`.
* Learner memilih "Mulai AI Practice".
* Sesi AI Conversation Practice dimulai via `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`.

**Main UI Elements:**
* Konteks Learning Objective yang sedang dipraktikkan (ditampilkan secara jelas di atas panel percakapan).
* Referensi Learning Content yang digunakan sebagai konteks AI (jika tersedia — ditampilkan sebagai keterangan, bukan viewer penuh).
* Panel percakapan: riwayat pesan Learner dan respons AI Practice Partner.
* Field input teks untuk pesan Learner.
* Tombol kirim pesan.
* Tombol "Akhiri Sesi Praktik" untuk mengakhiri sesi AI Practice.
* Indikator bahwa ini adalah sesi practice — bukan penilaian resmi.

**Primary Actions:**
* Kirim pesan → `POST /api/v1/ai-conversations/{conversationId}/messages` → tampilkan respons AI (conversation response, feedback text, practice guidance).
* Akhiri sesi → `POST /api/v1/ai-conversations/{conversationId}/complete` → untuk Normal Practice, kembali ke UX-006; untuk Assessable Practice, submit Activity Result atau approved assessment evidence ke Assessment Engine dan tampilkan state `assessment-submitting` serta `assessment-pending` hingga Assessment Result tersedia, lalu menuju UX-008.

**Data/API Dependencies:**
* `POST /api/v1/learning-activities/{activityId}/ai-conversation/start` — memulai sesi practice.
* `POST /api/v1/ai-conversations/{conversationId}/messages` — pengiriman pesan dan penerimaan respons AI.
* `POST /api/v1/ai-conversations/{conversationId}/complete` — mengakhiri sesi.
* `GET /api/v1/ai-conversations/{conversationId}` — memuat riwayat sesi (jika dilanjutkan atau dibuka ulang).

**Empty State:** Sesi baru dimulai → tampilkan sapaan atau prompt pembuka dari AI Practice Partner.

**Error State:**
* AI Provider tidak tersedia (`503` — Graceful Degradation) → tampilkan pesan fallback: "Fitur AI Practice sedang tidak tersedia. Anda dapat melanjutkan aktivitas secara mandiri." Tombol AI Practice disembunyikan atau dinonaktifkan; Learning Activity tetap dapat diselesaikan tanpa AI.
* Activity bukan type Practice (`400`) → tombol AI Practice tidak ditampilkan sama sekali di UX-006.
* Governance Violation (`403`) → tampilkan pesan bahwa permintaan tidak dapat diproses.

**AI Output Constraints — wajib ditegakkan di UI:**
* Output AI **tidak boleh** dipresentasikan sebagai Assessment Result resmi.
* Output AI **tidak boleh** dipresentasikan sebagai Learning Decision atau rekomendasi jalur belajar resmi.
* Output AI **tidak boleh** diklaim sebagai penilaian mastery atau update skor.
* Output AI **tidak boleh** memperbarui Knowledge Profile.
* Output AI **tidak boleh** menghasilkan Learning Decision.
* Output AI **tidak boleh** mempublikasikan Official Runtime Event.
* Interaksi AI hanya dicatat sebagai audit/observability/provider record sesuai kontrak AI Conversation Practice.
* Label/keterangan UI harus secara eksplisit menunjukkan konteks "Sesi Latihan" atau "AI Practice" — bukan "Penilaian" atau "Hasil Evaluasi".

**Out of Scope:**
* Full AI Learning Companion (Phase 3).
* AI Memory (Phase 3).
* AI menghasilkan Assessment Result.
* AI memperbarui Knowledge Profile.
* AI menghasilkan Learning Decision.

---

## UX-008 — Activity Completion / Assessment Result

**Purpose:** Menampilkan ringkasan penyelesaian Learning Activity dan Assessment Result yang dihasilkan oleh Assessment Engine.

**Entry Conditions:** Learner telah menyelesaikan Learning Activity (UX-006); Assessment Engine telah menghasilkan Assessment Result; state berada pada atau setelah `Assessing`.

**Main UI Elements:**
* Konfirmasi penyelesaian Learning Activity.
* Nama Learning Objective yang telah direalisasikan.
* Ringkasan Assessment Result: hasil evaluasi sesuai Assessment Blueprint yang berlaku (skor, status, catatan evaluasi jika tersedia).
* Referensi Assessment Blueprint yang digunakan (nama strategi evaluasi — Quiz, Assignment, dll.).
* Tombol "Lihat Dashboard" → menuju UX-009.
* Tombol "Lanjutkan" (kembali ke Module List atau aktivitas berikutnya jika tersedia).

**Primary Actions:**
* Lihat Dashboard → UX-009.
* Kembali ke Module List → UX-005.

**Data/API Dependencies:**
* `GET /api/v1/assessment-results/{resultId}` — Assessment Result yang relevan (read-only).

**Read-only Rule:** UI hanya menampilkan Assessment Result yang sudah dihasilkan Assessment Engine. Learner tidak dapat mengubah, mengoreksi, atau menerbitkan ulang Assessment Result dari layar ini.

**Empty State:** Jika Assessment Result belum tersedia (sedang diproses) → tampilkan indikator loading / "Hasil evaluasi sedang diproses."

**Error State:** Assessment Result tidak ditemukan (`404`) → "Hasil evaluasi tidak tersedia saat ini."

**Out of Scope:**
* Knowledge Profile update summary.
* Learning Decision dari Recommendation Engine.
* Adaptive next-step recommendation berdasarkan Assessment Result.

---

## UX-009 — Basic Progress Dashboard

**Purpose:** Menampilkan ringkasan progres belajar Learner berdasarkan data State Machine dan Assessment Result/Activity Result.

**Entry Conditions:** Learner telah login dan Learner context aktif; dapat diakses dari Learner Home atau setelah menyelesaikan Learning Activity.

**Main UI Elements:**
* Identitas Learner aktif.
* Ringkasan state pembelajaran saat ini (dari State Machine): learning state terkini.
* Daftar Learning Activity yang telah diselesaikan (riwayat Activity Result).
* Daftar Assessment Result yang telah diterima.
* Navigasi kembali ke Learner Home / daftar program.

**Primary Actions:**
* Navigasi ke Learning Program atau Module yang sedang dikerjakan.
* Logout.

**Data/API Dependencies:**
* `GET /api/v1/auth/me` — Learner context aktif.
* `GET /api/v1/assessment-results` — daftar Assessment Result milik Learner (filter by Learner).
* State pembelajaran dari `learning_state` (via API atau komponen state yang sesuai).

**Empty State:** Belum ada aktivitas yang diselesaikan → "Anda belum menyelesaikan aktivitas apapun. Mulai belajar sekarang."

**Error State:** Data tidak dapat dimuat → "Gagal memuat progres belajar Anda. Silakan coba lagi."

**Constraints — wajib ditegakkan di UI:**
* Dashboard **tidak boleh** menampilkan Knowledge Profile dalam MVP (Knowledge Profile Engine aktif di Phase 2).
* Dashboard **tidak boleh** menampilkan Learning Decision dalam MVP (Recommendation Engine aktif di Phase 2).
* Dashboard **tidak boleh** menampilkan adaptive recommendation atau personalized next step dalam MVP.

**Out of Scope:** Knowledge Profile visualization, Learning Decision explanation, adaptive analytics.

---

## UX-010 — Error / Fallback State

**Purpose:** Menangani kondisi error, unavailability, authorization failure, Learner context missing, dan sesi berakhir secara konsisten di seluruh aplikasi.

**Entry Conditions:** Terjadi kegagalan API, resource tidak tersedia, session expired, AI Provider unavailable, assessment processing failure, network failure, unauthorized access, atau Learner context tidak dapat diperoleh pada halaman terautentikasi.

**Main UI Elements:**
* Error/fallback banner untuk error inline yang masih memungkinkan Learner melanjutkan aktivitas.
* Full-page fallback untuk halaman/resource yang tidak dapat ditampilkan.
* Pesan error yang jelas dalam Bahasa Indonesia.
* Tombol coba lagi untuk error yang retryable.
* Tombol kembali ke halaman aman: Login, Learner Home, Dashboard, Program List, atau Module List sesuai konteks.

**Primary Actions:**
* Coba lagi → ulangi request terakhir jika error retryable.
* Kembali → arahkan ke halaman aman terdekat tanpa menampilkan data resource yang gagal.
* Login kembali → redirect ke UX-002 jika session expired atau Learner context missing.
* Lanjutkan tanpa AI → tetap berada di UX-006 dan menyelesaikan Learning Activity tanpa AI Practice jika AI Provider unavailable.

**Data/API Dependencies:**
* `GET /api/v1/auth/me` — memverifikasi session dan Learner context aktif pada halaman terautentikasi.
* Endpoint yang sedang diakses saat error terjadi.
* Tidak ada entity baru; state fallback bergantung pada status API dan context halaman.

**Empty State:** N/A sebagai screen khusus. Empty state spesifik ditangani pada UX-004, UX-005, UX-006, UX-008, UX-009, dan Section 13.

**Error State:**

| Kondisi | Perilaku UI |
| ------- | ----------- |
| Sesi berakhir / tidak valid | Redirect ke UX-002 (Login Page) dengan pesan "Sesi Anda telah berakhir. Silakan login kembali." |
| Learner context missing | Hapus state Learner lokal dan redirect ke UX-002 dengan pesan "Silakan login kembali untuk melanjutkan." |
| Unauthorized access | Tampilkan pesan "Anda tidak memiliki akses ke data ini." Jangan tampilkan detail resource. |
| AI Provider tidak tersedia | Tampilkan fallback banner: "Fitur AI Practice sedang tidak tersedia." Nonaktifkan tombol AI Practice; Learning Activity tetap dapat diselesaikan. |
| Halaman / resource tidak ditemukan (404) | Tampilkan halaman "Halaman tidak ditemukan" dengan tombol kembali. |
| Server error (500) | Tampilkan pesan "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi." |
| Jaringan tidak tersedia | Tampilkan banner "Tidak ada koneksi internet. Periksa jaringan Anda." |
| Assessment sedang diproses | Tampilkan indikator loading / "Hasil evaluasi sedang diproses." |
| Assessment failed | Tampilkan pesan "Hasil evaluasi tidak dapat diproses saat ini. Silakan coba lagi." |

**Out of Scope:**
* Menampilkan detail internal error, stack trace, provider details, atau database error.
* Membuat fallback business rule baru.
* Menerbitkan Official Runtime Event untuk interaksi UI fallback.
* Menggunakan AI fallback sebagai Assessment Result, Knowledge Profile update, atau Learning Decision.

---

## 7.11 UX-011 — Placement Test

Dedicated learner UI for a specialized `Learning Activity` with `purpose = Placement`; it is not a Placement Test domain entity or `/placement-tests` resource. Entry is from UX-005 when placement metadata marks the activity available/required. The screen shows purpose, available/starting/in-progress/submitting/assessment-pending/result-ready/failed/retrying UI states, then displays the read-only Assessment Engine result and a read-only placement starting point suggestion. The suggestion is not a Learning Decision, adaptive recommendation, or Recommendation Engine output.

---

# 8. AI Conversation Practice UX

Bagian ini mendefinisikan aturan perilaku UI untuk fitur AI Conversation Practice (FR-012B) secara lebih rinci.

## 8.1 Kondisi Tampil

* Panel AI Conversation Practice **hanya muncul** dari dalam UX-006 (Learning Activity Page) ketika `activity_type = Practice`.
* Jika activity type bukan Practice, tombol "Mulai AI Practice" tidak ditampilkan sama sekali — bukan hanya dinonaktifkan.
* Satu sesi AI Conversation Practice terhubung ke tepat satu Learning Objective dari Learning Activity terkait.

## 8.2 Konteks yang Ditampilkan

* Learning Objective yang sedang dipraktikkan wajib ditampilkan secara eksplisit di atas panel percakapan.
* Jika Learning Content terkait Learning Objective tersedia dan berstatus Published, referensi atau ringkasan konten dapat ditampilkan sebagai konteks. Ini bersifat opsional dan tidak mengubah konten resmi.
* Identitas sesi (nomor sesi atau nama praktik) dapat ditampilkan untuk orientasi Learner.

## 8.3 Presentasi Output AI

* Label pada panel harus menggunakan terminologi "Sesi Latihan", "AI Practice Partner", atau ekuivalen — bukan "Penilaian", "Evaluasi", atau "Skor".
* Setiap respons AI harus dapat dibedakan secara visual dari konten resmi sistem (mis. warna berbeda, label "Respons AI Practice").
* Tidak ada elemen UI yang boleh menyiratkan bahwa output AI adalah Assessment Result resmi, mastery score update, atau Learning Decision.

## 8.4 Graceful Degradation

* Jika AI Provider tidak tersedia, sistem wajib menampilkan pesan fallback yang jelas: "Fitur AI Practice sedang tidak tersedia. Anda masih dapat melanjutkan pembelajaran tanpa AI."
* Learning Activity tetap dapat diselesaikan melalui tombol "Selesaikan Aktivitas" meski AI tidak tersedia.
* Tidak ada blokade pada Canonical Learning Pipeline akibat ketidaktersediaan AI.

## 8.5 Pengakhiran Sesi

* Learner dapat mengakhiri sesi AI Practice kapan saja via tombol "Akhiri Sesi Praktik".
* Untuk Normal Practice, mengakhiri sesi mengembalikan Learner ke UX-006 dan tidak secara otomatis menyelesaikan Learning Activity; Learner menyelesaikan Learning Activity secara terpisah dari UX-006 melalui tombol "Selesaikan Aktivitas".
* Untuk Assessable Practice, Learner menyelesaikan assessable conversation dan UI mengirimkan Activity Result atau approved assessment evidence ke Assessment Engine. UI menampilkan state `assessment-submitting` dan `assessment-pending`; setelah Assessment Result tersedia, UI menuju UX-008 tanpa mengharuskan Learner kembali ke UX-006 hanya untuk memicu tindakan penyelesaian kedua yang duplikatif.
* AI feedback tetap merupakan practice guidance, bukan Assessment Result. AI tidak melakukan scoring, menghasilkan atau memiliki Assessment Result, memperbarui Knowledge Profile, maupun menghasilkan Learning Decision; hanya Assessment Engine yang menghasilkan Assessment Result resmi.

## 8.6 Pencatatan Interaksi

* Interaksi AI Conversation Practice dicatat hanya sebagai audit/observability/provider record.
* Pencatatan dapat menggunakan `ai_practice_conversation`, `ai_practice_message`, `ai_practice_provider_record`, dan `ai_practice_safety_event`.
* AI guidance does not publish an Official Runtime Event or create an official result. For assessable Practice, completing the conversation submits an Activity Result or approved evidence to the Assessment Engine; it does not update Knowledge Profile or invoke Recommendation Engine.

## 8.7 Assessable Practice and Voice Controls

UX-007 is assessable: completion submits Activity Result or approved assessment evidence to Assessment Engine and only its result is shown in UX-008. AI feedback/practice guidance is never labeled score, mastery, Assessment Result, Learning Decision, or official recommendation. STT/TTS are mandatory capabilities; text remains available for accessibility or technical failure. Required UI states are microphone-permission-requested, permission-denied, recording, processing, transcribing, transcript-ready, awaiting-ai-response, ai-response-ready, playing-audio, playback-failed, retrying, assessment-submitting, assessment-pending, assessment-result-ready, and failed. Canonical target-language transcript is the official conversation record; Indonesian translation is support only, transliteration optional, and Arabic conversation areas use Arabic script/RTL.

---

# 9. Basic Authentication UX

Bagian ini mendefinisikan aturan perilaku UI untuk MVP Basic Learner Authentication (FR-012C).

## 9.1 Login

* Halaman Login mendukung login Learner MVP menggunakan identifier (username/email) dan password.
* Minimal dua akun Learner dapat digunakan secara terpisah.
* Form login hanya berisi field identifier dan password — tidak ada elemen lain (signup, social login, dll.).
* Setelah login berhasil, `GET /api/v1/auth/me` digunakan untuk mendapatkan referensi Learner aktif.

## 9.2 Logout

* Tombol Logout tersedia di seluruh halaman terautentikasi (header atau navigasi utama).
* Klik Logout → `POST /api/v1/auth/logout` → sesi dihapus → redirect ke Landing Page atau Login Page.

## 9.3 Session Expiry

* Jika sesi berakhir saat Learner aktif menggunakan aplikasi, sistem menampilkan notifikasi "Sesi Anda telah berakhir" dan mengarahkan ke Login Page.
* Data yang belum disimpan (mis. pesan AI Practice yang belum dikirim) dapat hilang — ini adalah perilaku yang dapat diterima pada MVP.

## 9.4 Identitas Aktif

* `GET /api/v1/auth/me` menyediakan referensi Learner aktif untuk seluruh komponen yang membutuhkan isolasi data.
* Nama atau identifier Learner aktif dapat ditampilkan di header sebagai indikator sesi.
* Isolasi data Learner wajib: setiap request terautentikasi hanya boleh mengakses data milik Learner aktif dari session context.
* Jika Learner context tidak tersedia atau tidak cocok dengan resource yang diminta, UI menampilkan unauthorized state atau redirect ke Login sesuai status API.

## 9.5 Pembatasan MVP

* **Tidak ada public signup** dalam MVP. Akun Learner dibuat melalui mekanisme di luar aplikasi (mis. seeding data untuk testing).
* **Tidak ada forgot password / reset password**.
* **Tidak ada social login** (OAuth / Google).
* **Tidak ada MFA atau SSO**.
* Tidak ada halaman profil Learner yang dapat diedit dalam MVP.

---

# 10. Dashboard UX

Bagian ini mendefinisikan aturan perilaku UI untuk Basic Progress Dashboard (FR-012).

## 10.1 Konten yang Ditampilkan (MVP)

* State pembelajaran saat ini berdasarkan State Machine (`learning_state`).
* Daftar Learning Activity yang telah diselesaikan oleh Learner.
* Daftar Assessment Result yang diterima Learner (read-only).
* Activity Result yang relevan untuk aktivitas yang telah diselesaikan.
* Tautan navigasi ke program / modul yang sedang dikerjakan.

## 10.2 Konten yang Tidak Boleh Ditampilkan (MVP)

* Knowledge Profile — Knowledge Profile Engine aktif di Phase 2. Dashboard MVP tidak boleh menampilkan tingkat penguasaan berbasis Knowledge Profile.
* Learning Decision — Recommendation Engine aktif di Phase 2. Dashboard MVP tidak boleh menampilkan "Aktivitas yang disarankan" berdasarkan Learning Decision.
* Adaptive recommendation atau personalized learning path.
* Analytics lanjutan (engagement rate, time-on-task aggregation, dll.).

## 10.3 Indikator Progres

* Indikator progres pada MVP didasarkan pada jumlah aktivitas yang diselesaikan dan Assessment Result yang diterima — bukan pada penguasaan materi (mastery) dari Knowledge Profile.
* Label seperti "Penguasaan" atau "Tingkat Pemahaman" tidak boleh digunakan pada MVP karena menyiratkan Knowledge Profile Engine aktif.

---

# 11. Navigation Model

## 11.1 Public Navigation (Landing Page)

* Landing Page memiliki navigasi minimal: nama produk, tombol "Masuk" / "Login".
* Tidak ada menu navigasi program dari Landing Page.

## 11.2 Authenticated Learner Navigation

* Setelah login, Learner memiliki akses ke:
  * Learner Home
  * Program / Subject Selection
  * Basic Progress Dashboard
  * Logout
* Navigasi breadcrumb atau back navigation tersedia di halaman Program Detail, Module, Activity, dan Dashboard untuk memudahkan orientasi.

## 11.3 Flow Back/Continue dari Activity

* Setelah menyelesaikan Learning Activity dan melihat Assessment Result (UX-008):
  * "Lanjutkan" mengarahkan kembali ke Module List (UX-005) untuk aktivitas berikutnya.
  * "Lihat Dashboard" mengarahkan ke UX-009.
* Dari AI Conversation Practice (UX-007):
  * Untuk Normal Practice, mengakhiri sesi kembali ke UX-006 (Learning Activity Page); Learner masih harus menyelesaikan Learning Activity secara eksplisit dari UX-006.
  * Untuk Assessable Practice, menyelesaikan percakapan mengirimkan Activity Result atau approved assessment evidence ke Assessment Engine. UI menampilkan state `assessment-submitting` dan `assessment-pending`, lalu menuju UX-008 setelah Assessment Engine menghasilkan Assessment Result resmi; Learner tidak perlu kembali ke UX-006 untuk tindakan penyelesaian kedua yang duplikatif.

## 11.4 Return to Dashboard

* Tombol atau tautan menuju Dashboard tersedia di:
  * UX-003 (Learner Home) — melalui navigasi utama.
  * UX-008 (Activity Completion / Assessment Result) — melalui tombol "Lihat Dashboard".

## 11.5 Logout Behavior

* Logout tersedia dari seluruh halaman terautentikasi melalui Header atau navigasi utama.
* Logout memanggil `POST /api/v1/auth/logout`, menghapus sesi aktif, dan mengarahkan ke Login Page atau Landing Page.
* Setelah logout berhasil, UI tidak boleh menampilkan data Learner yang sebelumnya aktif.

## 11.6 Session Expired Behavior

* Jika API mengembalikan status sesi tidak valid atau expired, UI menghapus state Learner lokal dan redirect ke UX-002 (Login Page).
* Redirect menyertakan pesan "Sesi Anda telah berakhir. Silakan login kembali."
* Setelah redirect, halaman terautentikasi tidak boleh tetap dapat diakses dari browser back cache tanpa verifikasi ulang `GET /api/v1/auth/me`.

---

# 12. UI Component Requirements

| Komponen | Deskripsi | Digunakan di |
| --------- | --------- | ------------ |
| **Header** | Menampilkan nama produk, identitas Learner aktif, tombol Logout. Tersedia di semua halaman terautentikasi. | UX-003 hingga UX-011 |
| **Login Form** | Form identifier dan password dengan validasi dasar, pesan error login, dan submit ke login API. Tidak menyediakan signup, reset password, atau social login. | UX-002 |
| **Program Card** | Kartu Learning Program: nama, Program Type, deskripsi singkat, tombol masuk. | UX-003, UX-004 |
| **Subject Card** | Kartu atau varian Program Card untuk menampilkan subject/program offering bila data program dipresentasikan sebagai pilihan subject. Tidak memperkenalkan entity baru di luar Learning Program. | UX-004 |
| **Module Card** | Kartu Learning Module: nama modul, indikator status, jumlah aktivitas (opsional). | UX-005 |
| **Activity Card** | Kartu Learning Activity: nama aktivitas, Activity Type, indikator penyelesaian. Menampilkan label "AI Practice tersedia" jika type = Practice. | UX-005, UX-006 |
| **Learning Content Viewer** | Menampilkan Learning Content terkait aktivitas (teks, embed, atau referensi). Konten hanya Published. | UX-006 |
| **AI Conversation Panel** | Panel percakapan: riwayat chat, input teks, respons AI dengan label konteks Practice. | UX-007 |
| **Assessment Result Summary** | Ringkasan Assessment Result: hasil evaluasi, nama Assessment Blueprint, nama Learning Objective. | UX-008 |
| **Progress Summary Card** | Kartu ringkasan progres: state terkini, jumlah aktivitas selesai, jumlah Assessment Result diterima. | UX-009 |
| **Error / Fallback Banner** | Banner inline untuk kondisi AI tidak tersedia, jaringan gagal, atau sesi berakhir. | UX-007, UX-010 |
| **Logout Control** | Tombol logout di header atau navigasi — tersedia di semua halaman terautentikasi. | UX-003 hingga UX-011 |

## 12.1 Specialized MVP Components

| Component | Used In | Purpose |
| --- | --- | --- |
| CMP-026 Voice Control Suite | UX-007 | Permission prompt, record/stop/cancel, timer/status, STT processing, voice failure and retry, text fallback. |
| CMP-027 Transcript and Audio Playback | UX-007 | Canonical transcript, AI text, TTS play/replay, RTL metadata. |
| CMP-028 Assessable Submission Status | UX-007, UX-008, UX-011 | Submit/pending/result-ready status; never AI score. |
| CMP-029 Placement Test Card/Progress/Result | UX-005, UX-011, UX-008 | Placement entry, execution progress, Assessment Engine result, read-only starting point suggestion. |

---

# 13. Loading / Empty / Error States

| State | Kondisi | Perilaku UI |
| ----- | ------- | ------------ |
| Loading content | Konten sedang dimuat dari API | Tampilkan skeleton screen atau spinner. Nonaktifkan tombol aksi utama selama loading. |
| No program available | Tidak ada Learning Program Published | "Belum ada program pembelajaran yang tersedia saat ini." |
| No module available | Tidak ada Learning Module Published dalam program | "Modul untuk program ini belum tersedia." |
| No activity available | Tidak ada Learning Activity Published dalam modul | "Aktivitas untuk modul ini belum tersedia." |
| AI unavailable | AI Provider gagal / Graceful Degradation aktif | Banner "Fitur AI Practice sedang tidak tersedia." Tombol AI Practice dinonaktifkan. Learning Activity tetap dapat diselesaikan. |
| Session expired | Sesi Learner berakhir | Redirect ke Login Page dengan pesan "Sesi Anda telah berakhir. Silakan login kembali." |
| Assessment failed | Assessment Engine gagal memproses | "Hasil evaluasi tidak dapat diproses saat ini. Silakan coba lagi." |
| Network error | Koneksi gagal | Banner "Tidak ada koneksi internet. Periksa jaringan Anda." |
| Unauthorized access | Learner mencoba mengakses resource yang tidak berada dalam Learner context aktif atau sesi tidak berwenang | Tampilkan pesan "Anda tidak memiliki akses ke data ini." lalu arahkan ke halaman aman yang relevan. Jangan tampilkan detail resource. |
| Learner context missing | `GET /api/v1/auth/me` gagal mengembalikan Learner aktif untuk halaman terautentikasi | Hapus state lokal dan redirect ke Login Page dengan pesan "Silakan login kembali untuk melanjutkan." |
| Resource not found | 404 dari API | "Halaman atau data yang diminta tidak ditemukan." dengan tombol kembali. |
| Server error | 500 dari API | "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi." |

---

# 14. Accessibility & Localization Notes

## 14.1 Bahasa

* Bahasa utama antarmuka adalah Bahasa Indonesia.
* Istilah teknis arsitektur dan nama entitas (Learning Program, Assessment Result, Knowledge Profile, AI Conversation Practice, dll.) dipertahankan dalam Bahasa Inggris sesuai dokumen sumber, tetapi dapat disertai penjelasan atau label Bahasa Indonesia yang sesuai untuk tampilan Learner.
* Contoh: "Learning Objective" dapat ditampilkan sebagai "Tujuan Pembelajaran" pada UI Learner, tetapi tetap direferensikan sebagai `Learning Objective` dalam kode dan dokumen teknis.

## 14.2 Bahasa Konten Pembelajaran

* Konten pembelajaran (Learning Content) dapat menggunakan bahasa yang sesuai dengan subject yang diajarkan — misalnya Bahasa Inggris untuk program English Learning, atau Bahasa Arab untuk program Arabic Learning.
* AI Conversation Practice mendukung percakapan dalam bahasa sesuai Learning Objective dan Learning Content yang terkait.

## 14.3 Aksesibilitas Dasar

* Struktur heading harus semantik (h1 → h2 → h3) agar screen reader dapat menavigasi dengan baik.
* Elemen interaktif (tombol, link, form input) wajib dapat diakses via keyboard (Tab, Enter, Space).
* Kontras warna teks terhadap latar belakang mengikuti WCAG 2.1 AA minimum.
* Label form wajib menggunakan elemen `<label>` yang terhubung ke input, bukan placeholder saja.
* Error messages harus dapat dibaca oleh screen reader (menggunakan `aria-live` atau ekuivalen).
* Pesan error harus jelas bagi Learner dan tidak mengekspos detail internal seperti stack trace, nama service internal, query database, provider key, atau correlation ID mentah.

---

# 15. Traceability Matrix

| Screen ID | Feature Breakdown ID | SRS ID | API Endpoint | Database Entity / Record | Notes |
| --------- | -------------------- | ------ | ------------ | ------------------------ | ----- |
| UX-001 | FB-MVP-013 | SRS-FR-012A | `GET /api/v1/public/landing-page`, `GET /api/v1/public/program-highlights` | `landing_page_config` | Public, unauthenticated; no Learner data. |
| UX-002 | FB-MVP-015 | SRS-FR-012C | `POST /api/v1/auth/login`, `GET /api/v1/auth/me` | `learner_auth_account`, `auth_session`, `learner` | MVP learner login only; no signup/reset/social login. |
| UX-003 | FB-MVP-001, FB-MVP-015 | SRS-FR-001, SRS-FR-012C | `GET /api/v1/auth/me`, `GET /api/v1/learning-programs` | `learner`, `learning_program` | Authenticated home; requires active Learner context. |
| UX-004 | FB-MVP-001 | SRS-FR-001 | `GET /api/v1/learning-programs` | `learning_program` | Shows Published programs only. |
| UX-005 | FB-MVP-002, FB-MVP-003, FB-MVP-006 | SRS-FR-002, SRS-FR-003, SRS-FR-006 | `GET /api/v1/learning-programs/{programId}`, `GET /api/v1/learning-programs/{programId}/program-structure`, `GET /api/v1/learning-modules`, `GET /api/v1/learning-activities` | `learning_program`, `program_structure`, `learning_module`, `learning_activity` | Module/activity list only; no adaptive sequencing. |
| UX-006 | FB-MVP-006, FB-MVP-009 | SRS-FR-006, SRS-FR-009 | `GET /api/v1/learning-activities/{activityId}`, `POST /api/v1/learning-activities/{activityId}/complete` | `learning_activity`, `content_item`, `learning_state`, `activity_result` | Completion creates Activity Result for Assessment Engine. |
| UX-007 | FB-MVP-014 | SRS-FR-012B | `POST /api/v1/learning-activities/{activityId}/ai-conversation/start`, `POST /api/v1/ai-conversations/{conversationId}/messages`, `POST /api/v1/ai-conversations/{conversationId}/complete`, `GET /api/v1/ai-conversations/{conversationId}` | `ai_practice_conversation`, `ai_practice_message`, `ai_practice_provider_record`, `ai_practice_safety_event` | AI provides practice guidance only. For assessable Practice, completion may submit Activity Result or approved assessment evidence. Assessment Engine alone produces the official Assessment Result. AI does not update Knowledge Profile, generate Learning Decision, or publish Official Runtime Events. |
| UX-008 | FB-MVP-008 | SRS-FR-008 | `GET /api/v1/assessment-results/{resultId}` | `assessment_result`, `activity_result` | Assessment Result is read-only and produced only by Assessment Engine. |
| UX-009 | FB-MVP-012 | SRS-FR-012 | `GET /api/v1/auth/me`, `GET /api/v1/assessment-results` | `learner`, `learning_state`, `activity_result`, `assessment_result` | Basic progress only; no Knowledge Profile, Learning Decision, or adaptive recommendation. |
| UX-010 | Cross-cutting | SRS-FR-012B, SRS-FR-012C | `GET /api/v1/auth/me`, relevant failing endpoint | `auth_session`, relevant requested record | Handles session expiry, AI fallback, authorization, missing context, network, and server errors. |
| UX-011 | MVP Placement / FR-016 | SRS-FR-016, SRS-FR-008 | Existing Learning Activity completion APIs and Assessment Result API | `learning_activity`, `activity_result`, `assessment_result` | Placement Test is a specialized assessable Learning Activity with `purpose = Placement`. It is not a new domain entity or `/placement-tests` API resource. Assessment Result is produced only by Assessment Engine. The displayed starting point suggestion is read-only and is not a Learning Decision or adaptive recommendation. |

---

# 16. Open Issues

Item-item berikut berada di luar scope MVP UI atau masih bergantung pada Open Issue arsitektur.

| # | Open Issue | Dampak pada UI/UX | Status |
| - | ---------- | ------------------ | ------ |
| 2 | **Adaptive Learning Path** | Tidak ada UI untuk personalized sequence atau adaptive next-step. | Phase 2 |
| 3 | **Knowledge Profile Visualization** | Dashboard MVP tidak menampilkan Knowledge Profile summary atau mastery level per objective. | Phase 2 |
| 4 | **Learning Decision Explanation** | Tidak ada UI untuk AI explanation of Learning Decision. | Phase 3 |
| 5 | **Public Signup** | Tidak ada halaman registrasi mandiri. Akun Learner dibuat di luar aplikasi untuk MVP. | Open Issue |
| 6 | **Advanced Authentication** | Tidak ada UI untuk forgot password, OAuth, MFA, SSO, email verification. | Open Issue / Future |
| 7 | **Educator Experience** | Tidak ada halaman Educator, akses data Learner oleh Educator, atau Class Management. | Phase 4 |
| 8 | **Enrollment Workflow** | Tidak ada UI untuk proses enrollment resmi. | Open Issue |
| 9 | **Advanced Analytics** | Tidak ada halaman analytics lanjutan atau reporting untuk Learner. | Phase 2+ |
| 10 | **Notifications** | Tidak ada notification center atau push notification. | Phase 5 |
| 11 | **Achievements / Certificates** | Tidak ada UI untuk achievement atau sertifikat penyelesaian program. | Phase 5 |

---

# 17. References

* `docs/50_product/52_prd.md` — Functional Requirements (FR-001 s/d FR-012, FR-012A, FR-012B, FR-012C).
* `docs/60_engineering/60_srs.md` — SRS Requirements, Use Cases (UC-01, UC-05, UC-07), State Transition Table.
* `docs/60_engineering/62_api_spec.md` — API Resource Specification (Section 6, 11.1–11.15), Authentication (Section 6.1–6.2).
* `docs/60_engineering/63_database_model.md` — Entity Groups, MVP Required Tables.
* `docs/60_engineering/64_engine_contracts.md` — Engine Contract boundaries, Section 9-MVP (AI Conversation Practice).
* `docs/60_engineering/65_event_contracts.md` — Section 19.1–19.3 (No Official Runtime Events for Landing Page, AI Practice, Auth).
* `docs/80_implementation/80_feature_breakdown.md` — MVP Feature Summary, FB-MVP-001 through FB-MVP-015.
* `docs/99_architecture_decisions.md` — AD-002 through AD-009.
