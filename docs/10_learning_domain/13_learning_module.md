# Learning Module

| Version | Status | Owner           | Depends On              | Used By                   | Last Updated |
|---------|--------|-----------------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `11_program_structure.md` | `12_learning_design.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Learning Module**, yaitu unit pembelajaran yang menjadi bagian dari sebuah **Learning Program**.

Learning Module merupakan unit yang diorganisasikan oleh **Program Structure** dan diimplementasikan menggunakan **Learning Design**.

Dokumen ini hanya mendefinisikan tanggung jawab, lifecycle, dan hubungan Learning Module dengan domain lain.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business Definition Learning Module
* Responsibilities
* Core Concepts
* Module Lifecycle
* Business Rules
* Domain Relationships
* Domain Events

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Program
* Program Structure
* Learning Design
* Learning Objective
* Learning Activity
* Assessment Blueprint
* Knowledge Profile
* Recommendation
* Achievement
* Analytics
* AI Capability
* Runtime State
* Event Payload

Topik-topik tersebut didefinisikan pada dokumen masing-masing.

---

# Business Definition

Learning Module adalah unit pembelajaran (learning unit) yang merepresentasikan satu bagian pembelajaran yang dapat dipelajari dan diselesaikan oleh learner.

Learning Module menyediakan konteks bagi proses pembelajaran dan menjadi unit utama yang digunakan untuk mengelompokkan Learning Objective, Learning Activity, serta Assessment melalui Learning Design.

Learning Module tidak menentukan bagaimana pembelajaran dirancang maupun bagaimana Program diorganisasikan.

---

# Responsibilities

Learning Module bertanggung jawab untuk:

* Merepresentasikan satu unit pembelajaran.
* Menjadi bagian dari Program Structure.
* Menjadi konteks penerapan Learning Design.
* Menjadi unit navigasi pembelajaran.
* Menjadi unit progres pembelajaran.

Learning Module tidak bertanggung jawab terhadap strategi pembelajaran maupun metode evaluasi.

---

# Core Concepts

Learning Module memiliki konsep-konsep berikut.

| Concept     | Description                                  |
| ----------- | -------------------------------------------- |
| Identity    | Identitas unik Learning Module.              |
| Module Type | Kategori Learning Module.                    |
| Lifecycle   | Siklus hidup Learning Module.                |
| Metadata    | Informasi tambahan mengenai Learning Module. |

Dokumen ini tidak mendefinisikan implementasi teknis dari konsep-konsep tersebut.

---

# Module Types

Jenis Learning Module bergantung pada Program Structure yang digunakan.

Contoh:

* Lesson
* Unit
* Chapter
* Topic
* Practice
* Project

Penamaan Module Type dapat berbeda pada setiap Program Structure, tetapi seluruhnya diperlakukan sebagai Learning Module.

---

# Lifecycle

Learning Module memiliki lifecycle berikut.

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

* **Draft** → Module sedang disusun.
* **Published** → Module tersedia untuk digunakan.
* **Archived** → Module tidak lagi digunakan untuk pembelajaran baru.

Lifecycle ini menggambarkan status konten, bukan progres learner.

---

# Business Rules

Learning Module mengikuti aturan berikut.

1. Setiap Learning Module memiliki identitas unik.
2. Setiap Learning Module berada pada tepat satu Program Structure.
3. Setiap Learning Module memiliki tepat satu Learning Design.
4. Learning Module tidak mendefinisikan Learning Objective secara langsung.
5. Learning Module tidak mendefinisikan Learning Activity secara langsung.
6. Learning Module tidak mendefinisikan Assessment Blueprint secara langsung.
7. Learning Module dapat digunakan kembali pada versi Learning Program yang berbeda.

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
        │
has one
        ▼
Learning Design
        │
defines
        ├── Learning Objective
        ├── Learning Activity
        ├── Assessment Blueprint
        ├── Prerequisite Rule
        └── Completion Rule
```

Penjelasan:

* Learning Program memilih Program Structure.
* Program Structure mengorganisasikan Learning Module.
* Setiap Learning Module memiliki satu Learning Design.
* Learning Design mendefinisikan seluruh blueprint pembelajaran untuk Learning Module tersebut.

---

# Published Events

Learning Module dapat mempublikasikan event berikut.

* LearningModuleCreated
* LearningModuleUpdated
* LearningModulePublished
* LearningModuleArchived

---

# Consumed Events

Learning Module dapat mengonsumsi event berikut.

* ProgramStructureAssigned
* LearningDesignCreated
* LearningDesignUpdated

---

# References

Dokumen yang berkaitan dengan Learning Module:

* `10_learning_program.md`
* `11_program_structure.md`
* `12_learning_design.md`
* `14_learning_objective.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Learning Module**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Learning Module,
* Module Lifecycle,
* Module Type,
* Business Rule Learning Module,
* hubungan Learning Module dengan Program Structure maupun Learning Design.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.