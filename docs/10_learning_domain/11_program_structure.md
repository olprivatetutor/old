# Program Structure

| Version | Status | Owner           | Depends On             | Used By                   | Last Updated |
|---------|--------|-----------------|------------------------|---------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `10_learning_program.md` | `13_learning_module.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Program Structure**, yaitu cara sebuah **Learning Program** diorganisasikan secara hierarkis.

Program Structure menyediakan kerangka (structural pattern) yang digunakan untuk menyusun isi sebuah Learning Program tanpa mendefinisikan bagaimana proses pembelajaran berlangsung.

Dokumen ini hanya membahas struktur program, bukan desain pembelajaran.

---

# Scope

## In Scope

Dokumen ini membahas:

* Definisi Program Structure
* Structural Pattern
* Program Structure Type
* Business Rules
* Relationship dengan Learning Program
* Relationship dengan Learning Module

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Design
* Learning Objective
* Learning Activity
* Assessment Blueprint
* Recommendation
* Knowledge Profile
* AI Capability
* Runtime State
* Event Payload

Topik-topik tersebut didefinisikan pada dokumen masing-masing.

---

# Business Definition

Program Structure adalah pola organisasi (organizational structure) yang digunakan untuk menyusun sebuah Learning Program.

Program Structure menentukan bagaimana isi program dibagi menjadi unit-unit yang lebih kecil sehingga mudah dipahami, dikelola, dan dikembangkan.

Program Structure tidak mendefinisikan metode pembelajaran maupun metode evaluasi.

---

# Responsibilities

Program Structure bertanggung jawab untuk:

* Menentukan pola organisasi sebuah Learning Program.
* Menentukan hierarki struktur program.
* Menjadi dasar navigasi program.
* Menjadi dasar pengelompokan Learning Module.

Program Structure tidak bertanggung jawab terhadap bagaimana learner belajar ataupun bagaimana pembelajaran dievaluasi.

---

# Core Concepts

Program Structure memiliki konsep-konsep berikut.

| Concept              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| Structure Type       | Jenis struktur yang digunakan oleh Learning Program. |
| Structural Pattern   | Pola hierarki yang digunakan untuk menyusun program. |
| Structural Node      | Unit organisasi dalam struktur program.              |
| Navigation Hierarchy | Hubungan antar node di dalam struktur.               |

Dokumen ini tidak mendefinisikan implementasi teknis dari konsep-konsep tersebut.

---

# Program Structure Types

Kaifa mendukung berbagai jenis struktur program.

## Curriculum Structure

Digunakan untuk program yang mengikuti kurikulum formal.

Contoh hierarki:

```text
Curriculum
    ↓
Subject
    ↓
Grade
    ↓
Semester
    ↓
Chapter
```

---

## CEFR Structure

Digunakan untuk program berbasis CEFR.

Contoh:

```text
CEFR Level
    ↓
Unit
```

---

## Book Structure

Digunakan untuk program yang mengikuti buku pembelajaran.

Contoh:

```text
Book
    ↓
Volume
    ↓
Chapter
```

---

## Certification Structure

Digunakan untuk program persiapan sertifikasi.

Contoh:

```text
Certification
    ↓
Domain
    ↓
Topic
```

---

## Free Learning Structure

Digunakan untuk program belajar bebas.

Contoh:

```text
Collection
    ↓
Topic
```

---

## Custom Structure

Digunakan apabila organisasi program mengikuti kebutuhan khusus yang tidak termasuk pada struktur standar.

---

# Structural Pattern

Setiap Learning Program memilih tepat satu Program Structure.

Contoh:

| Learning Program           | Program Structure       |
| -------------------------- | ----------------------- |
| English Grade VII          | Curriculum Structure    |
| TOEFL Preparation          | Certification Structure |
| CEFR A2 English            | CEFR Structure          |
| Al-'Arabiyyah Baina Yadaik | Book Structure          |
| Free Speaking Challenge    | Free Learning Structure |

Program Structure menentukan pola organisasi program, tetapi tidak menentukan isi pembelajaran.

---

# Business Rules

Program Structure mengikuti aturan berikut.

1. Setiap Learning Program menggunakan tepat satu Program Structure.
2. Satu Program Structure dapat digunakan oleh banyak Learning Program.
3. Program Structure hanya mendefinisikan organisasi program.
4. Program Structure tidak mendefinisikan Learning Design.
5. Program Structure tidak mendefinisikan metode pembelajaran.
6. Program Structure tidak mendefinisikan metode assessment.

---

# Relationships

Hubungan antar domain ditunjukkan secara konseptual sebagai berikut.

```text
Learning Program
        │
   chooses
        ▼
Program Structure
        │
 organizes
        ▼
Learning Module
```

Penjelasan:

* Learning Program memilih satu Program Structure.
* Program Structure mengorganisasikan kumpulan Learning Module.
* Detail mengenai Learning Module didefinisikan pada `13_learning_module.md`.

---

# Published Events

Program Structure dapat mempublikasikan event berikut.

* ProgramStructureCreated
* ProgramStructureUpdated
* ProgramStructureAssigned

---

# Consumed Events

Program Structure dapat mengonsumsi event berikut.

* LearningProgramCreated
* LearningProgramUpdated

Event hanya digunakan untuk menjaga konsistensi hubungan antar domain.

---

# References

Dokumen yang berkaitan dengan Program Structure:

* `10_learning_program.md`
* `12_learning_design.md`
* `13_learning_module.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Program Structure**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Program Structure,
* jenis Program Structure,
* structural pattern,
* business rule Program Structure.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.
