# Learning Design

| Version | Status | Owner           | Depends On              | Used By                                | Last Updated |
|---------|--------|-----------------|-------------------------|----------------------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `13_learning_module.md` | `14_learning_objective.md`, `15_learning_activity.md`, `16_assessment_blueprint.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **Learning Design**, yaitu blueprint pedagogi yang menjelaskan bagaimana sebuah **Learning Module** dirancang agar learner dapat mencapai tujuan pembelajaran secara efektif, terukur, dan konsisten.

Learning Design menjadi acuan dalam mendefinisikan tujuan pembelajaran, strategi belajar, aktivitas belajar, metode evaluasi, serta aturan pembelajaran yang diterapkan pada sebuah Learning Module.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business Definition Learning Design
* Responsibilities
* Core Concepts
* Learning Principles
* Learning Rules
* Domain Relationships
* Domain Events

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Program
* Program Structure
* Learning Module
* Knowledge Profile
* Recommendation
* Achievement
* Analytics
* AI Capability
* Runtime State
* Event Payload

Seluruh topik tersebut didefinisikan pada dokumen masing-masing.

---

# Business Definition

Learning Design adalah blueprint pembelajaran (learning blueprint) yang mendefinisikan bagaimana sebuah Learning Module disampaikan kepada learner.

Blueprint ini menjelaskan:

* tujuan pembelajaran,
* strategi pembelajaran,
* aturan pembelajaran,
* bagaimana learner mencapai tujuan pembelajaran,
* bagaimana pencapaian tersebut dievaluasi.

Learning Design tidak menentukan struktur program maupun hasil pembelajaran.

---

# Responsibilities

Learning Design bertanggung jawab untuk:

* Mendefinisikan Learning Objective.
* Menentukan strategi pembelajaran.
* Mendefinisikan Learning Principle.
* Mendefinisikan Prerequisite Rule.
* Mendefinisikan Completion Rule.
* Menjadi blueprint pembelajaran bagi Learning Module.

Learning Design **tidak bertanggung jawab** terhadap:

* struktur program,
* navigasi program,
* Knowledge Profile,
* Recommendation,
* Achievement,
* Analytics.

---

# Core Concepts

Learning Design memiliki konsep-konsep utama berikut.

| Concept            | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| Learning Objective | Target kompetensi yang harus dicapai learner.                         |
| Learning Principle | Prinsip pedagogi yang digunakan selama proses belajar.                |
| Prerequisite Rule  | Aturan yang harus dipenuhi sebelum learner melanjutkan pembelajaran.  |
| Completion Rule    | Aturan yang menentukan kapan sebuah Learning Module dianggap selesai. |

Learning Activity dan Assessment Blueprint merupakan implementasi dari Learning Objective dan dijelaskan pada dokumen masing-masing.

---

# Learning Principles

Learning Design mengikuti prinsip-prinsip berikut.

## Objective-Driven Learning

Seluruh proses pembelajaran harus memiliki Learning Objective yang jelas.

---

## Active Learning

Learner didorong untuk aktif berpartisipasi dalam proses belajar.

---

## Measurable Learning

Setiap tujuan pembelajaran harus dapat diukur melalui aktivitas dan evaluasi yang sesuai.

---

## Progressive Learning

Pembelajaran berlangsung secara bertahap sesuai prerequisite yang telah ditentukan.

---

## Adaptive Learning

Blueprint pembelajaran dapat dimanfaatkan oleh engine untuk menghasilkan pengalaman belajar yang adaptif tanpa mengubah desain pembelajaran itu sendiri.

---

# Learning Rules

Learning Design mengikuti aturan berikut.

1. Setiap Learning Design diterapkan pada tepat satu Learning Module.
2. Setiap Learning Design memiliki minimal satu Learning Objective.
3. Setiap Learning Objective diimplementasikan melalui satu atau lebih Learning Activity.
4. Setiap Learning Activity dapat dievaluasi menggunakan Assessment Blueprint.
5. Learning Design dapat memiliki Prerequisite Rule.
6. Learning Design dapat memiliki Completion Rule.
7. Learning Design tidak menentukan struktur program.
8. Learning Design tidak menghitung hasil pembelajaran.
9. Learning Design tidak menghasilkan Recommendation.

---

# Relationships

Hubungan antar domain ditunjukkan secara konseptual sebagai berikut.

```text
Learning Module
        │
has one
        ▼
Learning Design
        │
defines
        ▼
Learning Objective
        │
implemented by
        ▼
Learning Activity
        │
evaluated by
        ▼
Assessment Blueprint
```

Penjelasan:

* Learning Module menggunakan satu Learning Design.
* Learning Design mendefinisikan Learning Objective.
* Learning Objective direalisasikan melalui Learning Activity.
* Learning Activity dievaluasi menggunakan Assessment Blueprint.

---

# Published Events

Learning Design dapat mempublikasikan event berikut.

* LearningDesignCreated
* LearningDesignUpdated
* LearningObjectiveDefined
* LearningRuleUpdated

---

# Consumed Events

Learning Design dapat mengonsumsi event berikut.

* LearningModuleCreated
* LearningModuleUpdated

---

# References

Dokumen yang berkaitan dengan Learning Design:

* `10_learning_program.md`
* `11_program_structure.md`
* `13_learning_module.md`
* `14_learning_objective.md`
* `15_learning_activity.md`
* `16_assessment_blueprint.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Learning Design**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Learning Design,
* Learning Principle,
* Prerequisite Rule,
* Completion Rule,
* hubungan antara Learning Design dan Learning Objective.

Learning Activity dan Assessment Blueprint didefinisikan pada dokumen domain masing-masing.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.
