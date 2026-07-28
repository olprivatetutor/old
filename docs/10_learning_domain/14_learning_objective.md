# Learning Objective

| Version | Status | Owner           | Depends On                                   | Used By                                             | Last Updated |
|---------|--------|-----------------|----------------------------------------------|-----------------------------------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `12_learning_design.md` | `15_learning_activity.md`, `16_assessment_blueprint.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Learning Objective**, yaitu hasil belajar (learning outcome) yang diharapkan dapat dicapai oleh learner setelah menyelesaikan proses pembelajaran pada sebuah **Learning Module** melalui **Learning Design**.

Learning Objective menjadi dasar dalam merancang aktivitas belajar, metode evaluasi, serta pengukuran keberhasilan pembelajaran.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business Definition Learning Objective
* Responsibilities
* Core Concepts
* Objective Classification
* Business Rules
* Domain Relationships
* Domain Events

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Program
* Program Structure
* Learning Module
* Learning Design
* Learning Activity
* Assessment Blueprint
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

Learning Objective adalah target kompetensi yang harus dicapai learner setelah menyelesaikan proses pembelajaran.

Learning Objective mendefinisikan **apa yang harus diketahui, dipahami, atau mampu dilakukan** oleh learner, tanpa menentukan bagaimana cara mencapainya.

Implementasi Learning Objective dilakukan melalui Learning Activity, sedangkan pencapaiannya dievaluasi menggunakan Assessment Blueprint.

---

# Responsibilities

Learning Objective bertanggung jawab untuk:

* Mendefinisikan hasil belajar yang diharapkan.
* Menjadi dasar perancangan Learning Activity.
* Menjadi acuan penyusunan Assessment Blueprint.
* Menjadi acuan pengukuran keberhasilan pembelajaran.
* Menjadi dasar evaluasi pencapaian kompetensi.

Learning Objective tidak bertanggung jawab terhadap strategi pembelajaran maupun metode evaluasi.

---

# Core Concepts

Learning Objective memiliki konsep-konsep berikut.

| Concept             | Description                                        |
| ------------------- | -------------------------------------------------- |
| Objective Statement | Pernyataan hasil belajar yang diharapkan.          |
| Competency          | Kompetensi yang ingin dicapai.                     |
| Mastery Criteria    | Kriteria minimal pencapaian objective.             |
| Priority            | Tingkat prioritas objective dalam Learning Module. |
| Metadata            | Informasi tambahan mengenai objective.             |

Dokumen ini tidak mendefinisikan implementasi teknis dari konsep-konsep tersebut.

---

# Objective Classification

Learning Objective dapat diklasifikasikan berdasarkan karakteristik kompetensinya.

| Classification | Description                                   |
| -------------- | --------------------------------------------- |
| Knowledge      | Menguasai konsep atau informasi.              |
| Understanding  | Memahami makna atau hubungan antar konsep.    |
| Application    | Menerapkan pengetahuan pada situasi tertentu. |
| Analysis       | Menganalisis informasi atau permasalahan.     |
| Evaluation     | Mengevaluasi berdasarkan kriteria tertentu.   |
| Creation       | Menghasilkan solusi, ide, atau karya baru.    |

Framework klasifikasi dapat disesuaikan dengan kebutuhan Learning Program, misalnya menggunakan Bloom's Taxonomy atau framework lain.

---

# Business Rules

Learning Objective mengikuti aturan berikut.

1. Setiap Learning Objective dimiliki oleh tepat satu Learning Design.
2. Setiap Learning Objective diimplementasikan melalui satu atau lebih Learning Activity.
3. Setiap Learning Objective dapat dievaluasi menggunakan satu atau lebih Assessment Blueprint.
4. Setiap Learning Objective memiliki Mastery Criteria yang terdefinisi.
5. Learning Objective tidak mendefinisikan strategi pembelajaran.
6. Learning Objective tidak menghitung hasil pembelajaran.
7. Learning Objective bersifat independen terhadap Program Structure.

---

# Relationships

Hubungan antar domain ditunjukkan secara konseptual sebagai berikut.

```text
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

* Learning Design mendefinisikan Learning Objective.
* Learning Objective direalisasikan melalui satu atau lebih Learning Activity.
* Pencapaian Learning Objective dievaluasi menggunakan Assessment Blueprint.

---

# Published Events

Learning Objective dapat mempublikasikan event berikut.

* LearningObjectiveCreated
* LearningObjectiveUpdated
* LearningObjectiveArchived

---

# Consumed Events

Learning Objective dapat mengonsumsi event berikut.

* LearningDesignCreated
* LearningDesignUpdated

---

# References

Dokumen yang berkaitan dengan Learning Objective:

* `12_learning_design.md`
* `13_learning_module.md`
* `15_learning_activity.md`
* `16_assessment_blueprint.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Learning Objective**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Learning Objective,
* klasifikasi Learning Objective,
* Mastery Criteria sebagai konsep,
* hubungan antara Learning Objective dengan Learning Activity dan Assessment Blueprint.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.
