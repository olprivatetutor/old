# Assessment Blueprint

| Version | Status | Owner           | Depends On              | Used By                                        | Last Updated |
|---------|--------|-----------------|-------------------------|------------------------------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `14_learning_objective.md`, `15_learning_activity.md` | `30_assessment_engine.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Assessment Blueprint**, yaitu spesifikasi evaluasi yang digunakan untuk menilai **Activity Result** yang dihasilkan dari pelaksanaan **Learning Activity**.

Assessment Blueprint mendefinisikan aturan, strategi, dan kriteria evaluasi yang menjadi acuan bagi Assessment Engine untuk menghasilkan Assessment Result secara konsisten.

Dokumen ini hanya mendefinisikan blueprint evaluasi dan tidak membahas pelaksanaan maupun hasil evaluasi.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business Definition Assessment Blueprint
* Responsibilities
* Core Concepts
* Assessment Principles
* Assessment Strategies
* Business Rules
* Domain Relationships
* Domain Events

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Program
* Program Structure
* Learning Module
* Learning Design
* Learning Objective
* Learning Activity
* Activity Result
* Assessment Result
* Knowledge Profile
* Recommendation
* AI Capability
* Runtime State
* Event Payload

Seluruh topik tersebut dijelaskan pada dokumen masing-masing.

---

# Business Definition

Assessment Blueprint adalah spesifikasi evaluasi yang mendefinisikan bagaimana **Activity Result** dinilai untuk mengukur pencapaian Learning Objective.

Assessment Blueprint menjadi kontrak evaluasi yang digunakan oleh Assessment Engine pada saat runtime.

Assessment Blueprint tidak berisi hasil penilaian maupun implementasi teknis evaluasi.

---

# Responsibilities

Assessment Blueprint bertanggung jawab untuk:

* Mendefinisikan strategi evaluasi.
* Mendefinisikan kriteria evaluasi.
* Mendefinisikan metode penilaian.
* Mendefinisikan Mastery Criteria.
* Menjadi acuan Assessment Engine.

Assessment Blueprint tidak bertanggung jawab terhadap pelaksanaan evaluasi maupun pembentukan Assessment Result.

---

# Core Concepts

Assessment Blueprint memiliki konsep-konsep berikut.

| Concept             | Description                                    |
| ------------------- | ---------------------------------------------- |
| Assessment Strategy | Strategi evaluasi.                             |
| Evaluation Criteria | Kriteria penilaian Activity Result.            |
| Assessment Method   | Metode evaluasi yang digunakan.                |
| Mastery Criteria    | Standar minimal pencapaian Learning Objective. |
| Metadata            | Informasi tambahan mengenai blueprint.         |

Dokumen ini tidak mendefinisikan implementasi teknis.

---

# Assessment Principles

Assessment Blueprint mengikuti prinsip-prinsip berikut.

## Objective-Based Assessment

Evaluasi harus mengukur pencapaian Learning Objective.

---

## Activity-Based Assessment

Evaluasi dilakukan terhadap Activity Result yang dihasilkan learner.

---

## Consistent Assessment

Blueprint harus menghasilkan evaluasi yang konsisten terhadap kondisi yang sama.

---

## Transparent Assessment

Kriteria evaluasi harus dapat dipahami.

---

## Extensible Assessment

Blueprint harus dapat mendukung berbagai strategi evaluasi tanpa mengubah fondasi arsitektur.

---

# Assessment Strategies

Assessment Blueprint dapat menggunakan berbagai strategi.

| Strategy    | Description                                             |
| ----------- | ------------------------------------------------------- |
| Quiz        | Evaluasi berbasis soal.                                 |
| Assignment  | Evaluasi berbasis tugas.                                |
| Project     | Evaluasi berbasis proyek.                               |
| Portfolio   | Evaluasi berbasis kumpulan karya.                       |
| Observation | Evaluasi melalui observasi.                             |
| Speaking    | Evaluasi kemampuan berbicara.                           |
| Writing     | Evaluasi kemampuan menulis.                             |
| Practical   | Evaluasi praktik langsung.                              |
| AI Assisted | Evaluasi dengan bantuan AI sebagai evaluator pendukung. |
| Peer Review | Evaluasi oleh sesama learner.                           |

Strategi dapat diperluas tanpa mengubah domain.

---

# Business Rules

Assessment Blueprint mengikuti aturan berikut.

1. Setiap Assessment Blueprint mengevaluasi Activity Result.
2. Setiap Assessment Blueprint mengukur pencapaian Learning Objective.
3. Assessment Blueprint dapat digunakan oleh satu atau lebih Learning Activity yang menghasilkan Activity Result dengan karakteristik yang sama.
4. Assessment Blueprint mendefinisikan Mastery Criteria.
5. Assessment Blueprint tidak menghasilkan Assessment Result.
6. Assessment Blueprint tidak memperbarui Knowledge Profile.
7. Assessment Blueprint tidak menghasilkan Recommendation.

---

# Relationships

Hubungan antar domain dan engine ditunjukkan secara konseptual sebagai berikut.

```text id="2a7ns2"
LearningDesign
        │
defines
        ▼
LearningObjective
        │
implemented by
        ▼
LearningActivity
        │
produces
        ▼
ActivityResult
        │
evaluated using
        ▼
AssessmentBlueprint
        │
executed by
        ▼
AssessmentEngine
        │
produces
        ▼
AssessmentResult
```

Penjelasan:

* Learning Activity menghasilkan Activity Result.
* Assessment Blueprint mendefinisikan cara mengevaluasi Activity Result.
* Assessment Engine mengeksekusi Assessment Blueprint.
* Assessment Engine menghasilkan Assessment Result.

---

# Published Events

Assessment Blueprint dapat mempublikasikan event berikut.

* AssessmentBlueprintCreated
* AssessmentBlueprintUpdated
* AssessmentStrategyUpdated

---

# Consumed Events

Assessment Blueprint dapat mengonsumsi event berikut.

* LearningObjectiveCreated
* LearningObjectiveUpdated
* LearningActivityCreated

---

# References

Dokumen yang berkaitan:

* `15_learning_activity.md`
* `30_assessment_engine.md`
* `21_event_model.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Assessment Blueprint**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Assessment Blueprint,
* Assessment Strategy,
* Evaluation Criteria,
* Mastery Criteria sebagai spesifikasi evaluasi,
* hubungan antara Assessment Blueprint, Activity Result, dan Assessment Engine.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.
