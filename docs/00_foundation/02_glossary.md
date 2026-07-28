# Glossary

| Version | Status | Owner      | Depends On     | Used By       | Last Updated |
|---------|--------|------------|----------------|---------------|--------------|
| 2.0     | Freeze | Foundation | `00_overview.md` | Semua dokumen | 2026-07-04   |

---

# Purpose

Dokumen ini merupakan **Canonical Business Vocabulary** untuk Kaifa.

Glossary mendefinisikan seluruh istilah bisnis, runtime, engine, dan AI yang digunakan di dalam arsitektur Kaifa.

Seluruh dokumen lain harus menggunakan istilah yang didefinisikan di sini secara konsisten.

---

# Foundation

| Term         | Layer      | Owner      | Used By         | Definition                                                                                  |
| ------------ | ---------- | ---------- | --------------- | ------------------------------------------------------------------------------------------- |
| Architecture | Foundation | Foundation | Semua Layer     | Struktur konseptual sistem Kaifa.                                                           |
| Domain       | Foundation | Foundation | Runtime, Engine | Area yang mendefinisikan business rule.                                                     |
| Runtime      | Foundation | Foundation | Engine          | Lingkungan tempat proses pembelajaran berjalan.                                             |
| Engine       | Foundation | Foundation | AI Layer        | Komponen yang mengeksekusi business rule secara runtime.                                    |
| AI Layer     | Foundation | Foundation | Application     | Lapisan yang memberikan pengalaman belajar berbasis AI tanpa menjadi pemilik business rule. |

---

# Learning Domain

| Term                 | Layer           | Owner                | Used By            | Definition                                                                       |
| -------------------- | --------------- | -------------------- | ------------------ | -------------------------------------------------------------------------------- |
| Learning Program     | Learning Domain | Learning Program     | Program Structure  | Definisi sebuah program pembelajaran.                                            |
| Program Structure    | Learning Domain | Program Structure    | Learning Module    | Struktur hierarki sebuah program.                                                |
| Learning Module      | Learning Domain | Learning Module      | Learning Design    | Unit pembelajaran yang berisi sekumpulan tujuan dan aktivitas belajar.           |
| Learning Design      | Learning Domain | Learning Design      | Learning Objective | Rancangan pedagogis untuk mencapai tujuan pembelajaran.                          |
| Learning Objective   | Learning Domain | Learning Objective   | Learning Activity  | Hasil belajar yang ingin dicapai learner.                                        |
| Learning Activity    | Learning Domain | Learning Activity    | Assessment Engine  | Aktivitas pembelajaran yang dilakukan learner untuk mencapai Learning Objective. |
| Activity Result      | Learning Domain | Learning Activity    | Assessment Engine  | Output resmi Learning Activity sebelum evaluasi Assessment Engine; dapat memuat assessment evidence, conversation evidence, practice completion data, atau evidence spesifik aktivitas lain yang didefinisikan Learning Activity. Bukan Assessment Result atau Learning Decision. |
| Assessment Blueprint | Learning Domain | Assessment Blueprint | Assessment Engine  | Spesifikasi evaluasi yang mendefinisikan cara menilai Activity Result.           |

---

# Runtime

| Term             | Layer   | Owner         | Used By           | Definition                                                  |
| ---------------- | ------- | ------------- | ----------------- | ----------------------------------------------------------- |
| State Machine    | Runtime | Runtime       | Semua Engine      | Model transisi state selama proses pembelajaran.            |
| Event Model      | Runtime | Runtime       | Semua Engine      | Kontrak komunikasi berbasis event antar komponen.           |
| Learning Content | Runtime | Content Model | Learning Activity | Sumber belajar yang digunakan dalam aktivitas pembelajaran. |

---

# Engine

| Term                     | Layer  | Owner                    | Used By                         | Definition                                                                   |
| ------------------------ | ------ | ------------------------ | ------------------------------- | ---------------------------------------------------------------------------- |
| Assessment Engine        | Engine | Assessment Engine        | Knowledge Profile Engine        | Engine yang mengevaluasi Activity Result menggunakan Assessment Blueprint.   |
| Assessment Result        | Engine | Assessment Engine        | Knowledge Profile Engine        | Hasil evaluasi yang dihasilkan Assessment Engine.                            |
| Knowledge Profile        | Engine | Knowledge Profile Engine | Recommendation Engine, AI Layer | Representasi tingkat penguasaan learner terhadap pengetahuan dan kompetensi. |
| Knowledge Profile Engine | Engine | Knowledge Profile Engine | Recommendation Engine           | Engine yang memperbarui Knowledge Profile berdasarkan Assessment Result.     |
| Recommendation Engine    | Engine | Recommendation Engine    | AI Layer, Application           | Engine yang menghasilkan keputusan pembelajaran.                             |
| Learning Decision        | Engine | Recommendation Engine    | AI Layer, Application           | Keputusan pembelajaran yang menentukan langkah belajar berikutnya.           |

---

# AI Layer

| Term                       | Layer | Owner                   | Used By                    | Definition                                                                                                         |
| -------------------------- | ----- | ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| AI Provider Gateway        | AI    | AI Provider Integration | AI Personal Learning Agent | Abstraction layer yang menghubungkan Kaifa dengan penyedia AI.                                                     |
| AI Provider                | AI    | AI Provider Integration | AI Provider Gateway        | Penyedia layanan AI yang menyediakan capability tertentu.                                                          |
| AI Memory                  | AI    | AI Memory               | AI Personal Learning Agent | Memori percakapan dan preferensi learner yang digunakan untuk personalisasi.                                       |
| AI Personal Learning Agent | AI    | AI Layer                | Learner                    | Orchestrator yang menyusun konteks dan menghasilkan interaksi natural berdasarkan Learning Decision dan AI Memory. |
| AI Governance              | AI    | AI Governance           | Seluruh AI Layer           | Prinsip, kebijakan, dan batas operasional penggunaan AI.                                                           |
| Conversation Context       | AI    | AI Memory               | AI Personal Learning Agent | Konteks percakapan aktif yang digunakan untuk menghasilkan respons AI.                                             |

--- 

## Learning Context

| Term                 | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Learning Context** | Kumpulan informasi kontekstual mengenai kondisi pembelajaran saat ini yang digunakan oleh Runtime, Engine, dan AI Layer untuk memberikan pengalaman belajar yang relevan. Learning Context dapat mencakup Learning Program, Learning Module, Learning Activity, Session State, Progress, Learning Decision, dan informasi lain yang relevan terhadap proses belajar. Learning Context bukan business rule dan bukan business entity independen. |

---

## Educator

| Term         | Definition                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Educator** | Pengguna yang bertanggung jawab merancang, mengelola, mengevaluasi, atau memfasilitasi proses pembelajaran. Educator dapat berupa guru, dosen, mentor, trainer, coach, atau peran lain yang memiliki tanggung jawab terhadap learner. |

---
## AI Conversation Experience

| Term                           | Definition                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Conversation Experience** | Pengalaman pembelajaran interaktif yang dihasilkan oleh AI Personal Learning Agent berdasarkan Learning Decision, Knowledge Profile, Learning Content, AI Memory, dan Conversation Context. AI Conversation Experience bukan Learning Content, bukan Learning Decision, dan bukan Assessment Result. |

---

## MVP Terms

| Term | Definition |
| --- | --- |
| **Placement Test** | Specialized assessable Learning Activity untuk menentukan atau menyarankan titik awal pembelajaran learner. |
| **AI Conversation Practice** | Mode Learning Activity type Practice dengan AI Practice Partner yang mendukung percakapan teks dan voice serta dapat bersifat assessable. |
| **Assessable AI Practice** | AI Conversation Practice yang menghasilkan Activity Result atau approved assessment evidence untuk evaluasi Assessment Engine menggunakan Assessment Blueprint. Evidence dapat mencakup canonical transcript, completion data, pronunciation-related metadata, atau activity evidence lain yang didukung. AI tidak melakukan scoring atau menghasilkan Assessment Result. |
| **Speech-to-Text (STT)** | Kapabilitas wajib MVP untuk mengonversi input suara learner menjadi Conversation Transcript tekstual. |
| **Text-to-Speech (TTS)** | Kapabilitas wajib MVP untuk membacakan respons AI sebagai suara. |
| **Conversation Transcript** | Rekaman tekstual kanonis percakapan, terutama dalam target language, yang menjadi catatan resmi dan dapat digunakan sebagai evidence evaluasi. |
| **Learner Context** | Konteks Learner aktif dari sesi terautentikasi yang mengidentifikasi Learner dan membatasi akses data pembelajarannya; bukan pemilik Enrollment. |
| **MVP Basic Learner Authentication** | Login, logout, dan session minimal untuk sedikitnya dua Learner serta Learner Context terisolasi; tidak mencakup public signup, advanced authentication, role management, atau Enrollment. |
| **Program Context** | Informasi yang mendeskripsikan Learning Program yang aktif dan diperlukan oleh Learning Runtime serta, apabila tersedia, Recommendation Engine. Struktur rinci tetap Open Issue sampai Architecture Review. |

---

# Canonical Learning Pipeline

Pipeline resmi Kaifa adalah sebagai berikut.

```text id="gls01"
Learning Activity
        │
produces
        ▼
Activity Result
        │
evaluated using
        ▼
Assessment Blueprint
        │
executed by
        ▼
Assessment Engine
        │
produces
        ▼
Assessment Result
        │
updates
        ▼
Knowledge Profile
        │
drives
        ▼
Learning Decision
        │
consumed by
        ▼
AI Personal Learning Agent
```

Seluruh dokumen arsitektur harus konsisten dengan pipeline ini.

---

# Naming Conventions

Seluruh istilah mengikuti aturan berikut.

* Gunakan **PascalCase** untuk nama konsep utama.
* Gunakan istilah yang didefinisikan pada glossary ini.
* Hindari sinonim yang memiliki makna sama.
* Setiap istilah memiliki satu owner dan satu definisi resmi.

Istilah berikut **tidak digunakan lagi**:

* ❌ Learning Evidence

Istilah tersebut digantikan oleh:

* ✅ Activity Result
* ✅ Assessment Result

---

# References

Glossary digunakan oleh seluruh dokumentasi Kaifa:

* `00_foundation/*`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`
* `50_product/*`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk seluruh istilah resmi Kaifa.

Setiap istilah baru yang diperkenalkan pada arsitektur harus terlebih dahulu ditambahkan ke glossary ini.

Perubahan terhadap definisi istilah harus melalui architecture review agar seluruh dokumentasi tetap konsisten.