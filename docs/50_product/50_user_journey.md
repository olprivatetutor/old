# User Journey

| Version | Status | Owner           | Depends On              | Used By                   | Last Updated |
|---------|--------|-----------------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | Product         | seluruh baseline architecture  | `51_roadmap.md`, `52_prd.md`  | 2026-07-04   |


---

# Purpose

Dokumen ini mendefinisikan **User Journey** Kaifa, yaitu alur pengalaman pengguna dari pertama kali menggunakan aplikasi hingga menyelesaikan program pembelajaran.

Dokumen ini menjadi jembatan antara arsitektur sistem dan Product Requirement Document (PRD), sehingga setiap fitur yang dibangun memiliki konteks pengalaman pengguna yang jelas.

---

# Scope

## In Scope

Dokumen ini membahas:

* User Persona
* End-to-End User Journey
* Journey per Peran
* Key User Flows
* AI Touchpoints
* Success Criteria

## Out of Scope

Dokumen ini **tidak** membahas:

* Detail implementasi teknis
* API
* Database
* Engine implementation
* AI Provider implementation
* UI Design
* Wireframe

---

# User Personas

Kaifa mendukung beberapa persona utama.

| Persona       | Tujuan                                                           |
| ------------- | ---------------------------------------------------------------- |
| Guest         | Mengenal platform dan mencoba fitur publik.                      |
| Learner       | Mengikuti program pembelajaran secara personal.                  |
| Educator      | Mengelola proses pembelajaran dan memantau perkembangan learner. |
| Parent        | Memantau perkembangan belajar anak (jika relevan).               |
| Administrator | Mengelola sistem dan konfigurasi platform.                       |

Dokumen ini berfokus pada perjalanan **Learner**.

---

# End-to-End Learner Journey

```text
Discover Kaifa
        │
        ▼
Sign Up / Login
        │
        ▼
Choose Learning Program
        │
        ▼
Placement Test (opsional)
        │
        ▼
Enrollment
        │
        ▼
Receive Learning Recommendation
        │
        ▼
Start Learning
        │
        ▼
Complete Learning Activities
        │
        ▼
Assessment
        │
        ▼
Knowledge Profile Updated
        │
        ▼
Receive Learning Decision
        │
        ▼
Continue Learning
        │
        ▼
Complete Module
        │
        ▼
Complete Program
        │
        ▼
Achievement / Certificate
```

---

# Journey Stages

## 1. Discover

### Goal

Learner mengenal Kaifa dan program yang tersedia.

### Expected Outcome

Learner memahami nilai yang ditawarkan dan tertarik untuk memulai.

---

## 2. Authentication

### Goal

Learner membuat akun atau masuk ke sistem.

### Expected Outcome

Learner memiliki identitas yang dapat digunakan untuk melacak progres belajar.

---

## 3. Program Selection

### Goal

Learner memilih program yang sesuai.

Contoh:

* Kurikulum Nasional
* TOEFL Preparation
* IELTS Preparation
* Bahasa Arab
* Program Kustom

---

## 4. Placement

### Goal

Menentukan titik awal pembelajaran apabila diperlukan.

Placement Test bersifat opsional dan bergantung pada konfigurasi program.

---

## 5. Enrollment

### Goal

Learner resmi mengikuti program yang dipilih.

Expected Outcome:

* akses ke modul,
* learning context terbentuk,
* rekomendasi awal tersedia.

---

## 6. Learning

### Goal

Learner mengikuti Learning Activity sesuai Learning Decision.

Selama proses ini learner dapat:

* membaca materi,
* menonton video,
* mendengarkan audio,
* mengerjakan latihan,
* berdiskusi,
* menyelesaikan proyek.

---

## 7. Assessment

Activity Result dievaluasi menggunakan Assessment Blueprint oleh Assessment Engine.

Output:

* Assessment Result.

---

## 8. Knowledge Update

Knowledge Profile Engine memperbarui Knowledge Profile berdasarkan Assessment Result.

---

## 9. Recommendation

Recommendation Engine menghasilkan Learning Decision.

Contoh:

* lanjut ke modul berikutnya,
* review modul,
* ulangi aktivitas,
* lakukan assessment tambahan.

---

## 10. AI Learning Companion

AI Personal Learning Agent:

* menjelaskan Learning Decision,
* menjawab pertanyaan learner,
* memberikan motivasi,
* membantu memahami materi,
* menyesuaikan gaya komunikasi berdasarkan AI Memory.

AI tidak mengubah Learning Decision.

---

## 11. Completion

Learner menyelesaikan:

* Module,
* Program,
* atau Target Pembelajaran.

Apabila memenuhi ketentuan program, learner dapat memperoleh achievement atau sertifikat.

---

# AI Touchpoints

AI hadir pada beberapa titik perjalanan pengguna.

| Journey Stage       | AI Role                                                     |
| ------------------- | ----------------------------------------------------------- |
| Program Selection   | Menjelaskan program yang tersedia.                          |
| Placement           | Memberikan panduan selama proses placement.                 |
| Learning            | Menjadi tutor personal dan menjawab pertanyaan.             |
| Assessment Feedback | Menjelaskan hasil evaluasi.                                 |
| Recommendation      | Menjelaskan alasan Learning Decision.                       |
| Completion          | Memberikan ringkasan dan motivasi untuk langkah berikutnya. |

AI tidak mengambil keputusan akademik.

---

# Success Criteria

Journey dianggap berhasil apabila learner dapat:

* menemukan program yang sesuai,
* memahami tujuan pembelajaran,
* menyelesaikan aktivitas belajar,
* memperoleh umpan balik yang jelas,
* menerima rekomendasi yang relevan,
* menyelesaikan program dengan pengalaman belajar yang konsisten.

---

# Relationship with Architecture

Hubungan antara perjalanan pengguna dan arsitektur.

```text
User Journey
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
User Experience
```

User Journey tidak mengubah business rule maupun arsitektur.

---

# Relationship with PRD

Dokumen ini menjadi acuan utama untuk:

* Feature List
* User Stories
* Functional Requirements
* Non-Functional Requirements
* Acceptance Criteria
* MVP Scope

Setiap fitur pada PRD harus dapat ditelusuri ke satu atau lebih tahapan pada User Journey.

---

# References

Dokumen yang berkaitan:

* `00_foundation/00_overview.md`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk **User Journey** Kaifa.

Perubahan terhadap dokumen ini harus mempertahankan konsistensi dengan arsitektur yang telah dibekukan. Setiap perubahan pada alur pengguna yang berdampak pada domain atau engine harus melalui product review dan architecture review.
