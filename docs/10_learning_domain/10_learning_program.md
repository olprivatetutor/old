# Learning Program

| Version | Status | Owner           | Depends On     | Used By                   | Last Updated |
|---------|--------|-----------------|----------------|---------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `00_overview.md`, `02_glossary.md` | `11_program_structure.md`, `50_user_journey.md`, `52_prd.md`| 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Learning Program** sebagai domain utama (core business domain) dalam arsitektur Kaifa.

Learning Program merupakan titik masuk (entry point) seluruh proses pembelajaran dan merepresentasikan sebuah **produk pembelajaran (Learning Product)** yang dapat diikuti oleh learner.

Dokumen ini hanya mendefinisikan tanggung jawab, batasan (boundary), lifecycle, dan business rule yang berkaitan dengan Learning Program.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business definition Learning Program
* Responsibilities
* Program lifecycle
* Program types
* Business rules
* Domain relationships
* Domain events

## Out of Scope

Dokumen ini **tidak** membahas:

* Program Structure
* Learning Design
* Learning Module
* Learning Objective
* Learning Activity
* Assessment Blueprint
* Knowledge Profile
* Recommendation
* AI Capability
* State Machine
* Event payload

Topik-topik tersebut didefinisikan pada dokumen masing-masing.

---

# Business Definition

Learning Program adalah **produk pembelajaran (Learning Product)** yang disediakan oleh Kaifa untuk mencapai tujuan pembelajaran tertentu.

Sebuah Learning Program menjadi konteks utama bagi learner untuk mengikuti proses belajar dan menjadi boundary bisnis yang menaungi struktur program, desain pembelajaran, serta proses belajar yang berkaitan dengan program tersebut.

Contoh Learning Program:

* English Grade VII
* Arabic Grade IX
* TOEFL Preparation
* IELTS Academic
* CEFR A2 English
* Al-'Arabiyyah Baina Yadaik Jilid 1
* Nahwu Dasar
* Free Speaking Challenge

---

# Responsibilities

Learning Program bertanggung jawab untuk:

* Merepresentasikan sebuah produk pembelajaran.
* Menentukan identitas dan karakteristik program.
* Menentukan jenis (Program Type) program.
* Menjadi entry point bagi proses pembelajaran.
* Menjadi boundary bagi seluruh komponen yang berkaitan dengan program.

Learning Program **tidak** bertanggung jawab terhadap bagaimana pembelajaran dirancang atau bagaimana learner belajar.

---

# Core Concepts

Learning Program memiliki konsep-konsep utama berikut.

| Concept         | Description                                 |
| --------------- | ------------------------------------------- |
| Identity        | Identitas unik sebuah Learning Program.     |
| Program Type    | Kategori program pembelajaran.              |
| Version         | Versi program.                              |
| Lifecycle       | Siklus hidup program.                       |
| Visibility      | Tingkat ketersediaan program bagi pengguna. |
| Target Audience | Sasaran peserta program.                    |
| Metadata        | Informasi tambahan mengenai program.        |

Dokumen ini tidak mendefinisikan struktur data maupun implementasi teknis dari konsep-konsep tersebut.

---

# Program Types

Kaifa mendukung berbagai jenis Learning Program.

| Program Type  | Description                                       |
| ------------- | ------------------------------------------------- |
| Curriculum    | Program berdasarkan kurikulum formal.             |
| Certification | Program persiapan sertifikasi.                    |
| Language      | Program pembelajaran bahasa.                      |
| Book          | Program yang mengikuti struktur buku.             |
| Free Learning | Program belajar bebas.                            |
| Custom        | Program yang dirancang sesuai kebutuhan tertentu. |

Jenis program dapat bertambah tanpa mengubah fondasi arsitektur.

---

# Lifecycle

Learning Program memiliki lifecycle berikut.

```text
Draft
    │
    ▼
Published
    │
    ▼
Archived
```

Penjelasan:

* **Draft** → Program sedang disusun atau direvisi.
* **Published** → Program dapat digunakan oleh learner.
* **Archived** → Program tidak lagi digunakan untuk enrollment baru.

Lifecycle ini hanya berlaku untuk Learning Program, bukan untuk proses belajar learner.

---

# Business Rules

Learning Program mengikuti aturan bisnis berikut.

1. Setiap Learning Program memiliki identitas yang unik.
2. Setiap Learning Program memiliki tepat satu Program Type.
3. Setiap Learning Program memiliki satu lifecycle.
4. Hanya Learning Program berstatus **Published** yang dapat digunakan untuk enrollment baru.
5. Perubahan besar terhadap Learning Program dilakukan melalui versioning.
6. Learning Program tidak mendefinisikan struktur program maupun desain pembelajaran.

---

# Relationships

Hubungan antar domain ditunjukkan secara konseptual sebagai berikut.

```text
Learning Program
        │
        ├── uses
        ▼
Program Structure

Program Structure
        │
        ├── defines
        ▼
Learning Design
```

Learning Program hanya mengetahui bahwa sebuah Program menggunakan Program Structure.

Detail mengenai Program Structure didefinisikan pada `11_program_structure.md`.

---

# Published Events

Learning Program dapat mempublikasikan event berikut.

* LearningProgramCreated
* LearningProgramUpdated
* LearningProgramPublished
* LearningProgramArchived
* LearningProgramVersionCreated

---

# Consumed Events

Learning Program pada umumnya tidak mengonsumsi event dari domain lain.

Perubahan terhadap Learning Program dilakukan melalui proses administrasi atau manajemen program.

---

# References

Dokumen yang berkaitan dengan Learning Program:

* `00_overview.md`
* `01_architecture_principles.md`
* `02_glossary.md`
* `11_program_structure.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Learning Program**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Learning Program,
* Program Type,
* lifecycle Learning Program,
* business rule Learning Program.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.
