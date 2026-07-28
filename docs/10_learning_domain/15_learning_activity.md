# Learning Activity

| Version | Status | Owner           | Depends On               | Used By                                                         | Last Updated |
|---------|--------|-----------------|--------------------------|-----------------------------------------------------------------|--------------|
| 2.0     | Freeze | Learning Domain | `14_learning_objective.md`, `22_content_model.md` | `20_state_machine.md`, `30_assessment_engine.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Learning Activity**, yaitu aktivitas pembelajaran yang dilakukan oleh learner untuk mencapai sebuah **Learning Objective**.

Learning Activity merupakan implementasi operasional dari Learning Objective dan menyediakan pengalaman belajar yang menghasilkan **Activity Result** sebagai keluaran langsung dari aktivitas tersebut.

Dokumen ini hanya mendefinisikan aktivitas pembelajaran dan tidak membahas evaluasi maupun hasil penilaian.

---

# Scope

## In Scope

Dokumen ini membahas:

* Business Definition Learning Activity
* Responsibilities
* Core Concepts
* Activity Classification
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
* Assessment Blueprint
* Assessment Result
* Knowledge Profile
* Recommendation
* Analytics
* AI Capability
* Runtime State
* Event Payload

Seluruh topik tersebut didefinisikan pada dokumen masing-masing.

---

# Business Definition

Learning Activity adalah aktivitas yang dilakukan oleh learner untuk mencapai Learning Objective.

Learning Activity menggambarkan pengalaman belajar yang dijalani learner melalui berbagai bentuk interaksi dengan sumber belajar, latihan, diskusi, simulasi, praktik, maupun tugas.

Hasil langsung dari pelaksanaan Learning Activity adalah **Activity Result**, yang kemudian menjadi masukan bagi proses evaluasi.

Learning Activity tidak menentukan bagaimana hasil tersebut dinilai.

---

# Responsibilities

Learning Activity bertanggung jawab untuk:

* Merealisasikan Learning Objective.
* Menyediakan pengalaman belajar bagi learner.
* Menghasilkan Activity Result.
* Menjadi input bagi Assessment Engine melalui proses evaluasi.

Learning Activity tidak bertanggung jawab terhadap:

* penentuan Learning Objective,
* evaluasi hasil belajar,
* pembentukan Knowledge Profile,
* Recommendation,
* Analytics.

---

# Core Concepts

Learning Activity memiliki konsep-konsep berikut.

| Concept             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| Activity Type       | Jenis aktivitas pembelajaran.                                 |
| Activity Result     | Hasil langsung dari pelaksanaan aktivitas sebelum dievaluasi. |
| Participation Rule  | Aturan partisipasi learner dalam aktivitas.                   |
| Completion Criteria | Kriteria penyelesaian aktivitas.                              |
| Metadata            | Informasi tambahan mengenai aktivitas.                        |

Dokumen ini tidak mendefinisikan implementasi teknis dari konsep-konsep tersebut.

---

# Activity Classification

Learning Activity dapat diklasifikasikan berdasarkan bentuk aktivitasnya.

| Activity Type | Description                                   |
| ------------- | --------------------------------------------- |
| Reading       | Membaca materi pembelajaran.                  |
| Watching      | Menonton video pembelajaran.                  |
| Listening     | Mendengarkan materi audio.                    |
| Discussion    | Berdiskusi dengan educator atau learner lain. |
| Practice      | Melakukan latihan keterampilan.               |
| Exercise      | Mengerjakan latihan atau soal.                |
| Assignment    | Menyelesaikan tugas.                          |
| Project       | Menyelesaikan proyek pembelajaran.            |
| Experiment    | Melakukan eksperimen atau simulasi.           |
| Reflection    | Merefleksikan hasil belajar.                  |

Jenis aktivitas dapat diperluas sesuai kebutuhan Learning Program.

---

# Business Rules

Learning Activity mengikuti aturan berikut.

1. Setiap Learning Activity merealisasikan tepat satu Learning Objective.
2. Satu Learning Objective dapat memiliki satu atau lebih Learning Activity.
3. Setiap Learning Activity menghasilkan Activity Result.
4. Activity Result menjadi input bagi Assessment Engine.
5. Learning Activity memiliki Completion Criteria yang jelas.
6. Learning Activity tidak menghasilkan Assessment Result.
7. Learning Activity tidak menghitung tingkat penguasaan learner.

---

# Relationships

Hubungan antar domain ditunjukkan secara konseptual sebagai berikut.

```text
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
evaluated by
        ▼
AssessmentEngine
        │
produces
        ▼
AssessmentResult
```

Penjelasan:

* Learning Objective diwujudkan melalui Learning Activity.
* Learning Activity menghasilkan Activity Result.
* Assessment Engine mengevaluasi Activity Result menggunakan Assessment Blueprint.
* Assessment Engine menghasilkan Assessment Result.

---

# Published Events

Learning Activity dapat mempublikasikan event berikut.

* LearningActivityCreated
* LearningActivityUpdated
* LearningActivityCompleted
* ActivityResultGenerated

---

# Consumed Events

Learning Activity dapat mengonsumsi event berikut.

* LearningObjectiveCreated
* LearningObjectiveUpdated

---

# References

Dokumen yang berkaitan:

* `12_learning_design.md`
* `14_learning_objective.md`
* `16_assessment_blueprint.md`
* `20_state_machine.md`
* `21_event_model.md`
* `30_assessment_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk domain **Learning Activity**.

Dokumen lain tidak boleh mendefinisikan ulang:

* definisi Learning Activity,
* klasifikasi Learning Activity,
* konsep Activity Result,
* hubungan antara Learning Activity dan Assessment Engine.

Assessment Result merupakan tanggung jawab Assessment Engine dan didefinisikan pada spesifikasi engine terkait.

Perubahan terhadap domain ini harus dilakukan melalui architecture review.