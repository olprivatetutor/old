# Assessment Engine

| Version | Status | Owner             | Depends On               | Used By                   | Last Updated |
|---------|--------|-------------------|--------------------------|---------------------------|--------------|
| 2.0     | Freeze | Assessment Engine | `16_assessment_blueprint.md`, `21_event_model.md`, `20_state_machine.md` | `31_knowledge_profile_engine.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **Assessment Engine**, yaitu komponen runtime yang bertanggung jawab mengeksekusi **Assessment Blueprint** terhadap **Activity Result** untuk menghasilkan **Assessment Result**.

Assessment Engine merupakan implementation layer yang menjalankan aturan evaluasi yang telah didefinisikan oleh domain, tanpa menjadi pemilik business rule tersebut.

---

# Scope

## In Scope

Dokumen ini membahas:

* Engine Responsibilities
* Engine Inputs
* Engine Outputs
* Processing Flow
* Integration Points
* Runtime Behaviour
* Failure Handling

## Out of Scope

Dokumen ini **tidak** membahas:

* Assessment Blueprint
* Learning Objective
* Learning Activity
* Activity Result
* Knowledge Profile
* Recommendation
* AI Capability
* Business Rule
* State Definition
* Event Definition

Seluruh konsep tersebut didefinisikan pada dokumen masing-masing.

---

# Engine Responsibilities

Assessment Engine bertanggung jawab untuk:

* Menerima Activity Result.
* Menyelesaikan (resolve) Assessment Blueprint yang berlaku.
* Memvalidasi Activity Result.
* Menjalankan proses evaluasi.
* Menghasilkan Assessment Result.
* Mempublikasikan event runtime.
* Menyediakan Assessment Result bagi engine lain.

Assessment Engine tidak menentukan aturan evaluasi maupun target pembelajaran.

---

# Engine Inputs

Assessment Engine menerima input berikut.

| Input                | Source            |
| -------------------- | ----------------- |
| Activity Result      | Learning Activity |
| Assessment Blueprint | Learning Design   |
| Runtime Context      | Runtime           |

Seluruh input telah divalidasi sebelum diproses.

---

# Engine Outputs

Assessment Engine menghasilkan:

| Output              | Consumer                 |
| ------------------- | ------------------------ |
| Assessment Result   | Knowledge Profile Engine |
| Assessment Event    | Event Model              |
| Evaluation Metadata | Analytics                |

Assessment Engine tidak mengubah domain secara langsung.

---

# Processing Flow

Proses utama Assessment Engine adalah sebagai berikut.

```text
Activity Result
        │
        ▼
Resolve Assessment Blueprint
        │
        ▼
Validate Activity Result
        │
        ▼
Execute Assessment
        │
        ▼
Generate Assessment Result
        │
        ▼
Publish Event
```

Assessment Blueprint tetap menjadi pemilik business rule.

Assessment Engine hanya mengeksekusi blueprint tersebut.

---

# Assessment Result

Assessment Result merupakan hasil evaluasi yang dihasilkan Assessment Engine berdasarkan Activity Result dan Assessment Blueprint.

Assessment Result menjadi input utama bagi Knowledge Profile Engine.

Assessment Result bukan bagian dari Assessment Blueprint maupun Learning Activity.

---

# Integration Points

Assessment Engine berinteraksi dengan komponen berikut.

| Component                | Purpose                           |
| ------------------------ | --------------------------------- |
| Learning Activity        | Menerima Activity Result.         |
| Assessment Blueprint     | Menyediakan aturan evaluasi.      |
| Event Model              | Mempublikasikan Assessment Event. |
| Knowledge Profile Engine | Mengirim Assessment Result.       |
| Analytics                | Menyediakan metadata evaluasi.    |

Assessment Engine tidak berinteraksi langsung dengan Recommendation Engine maupun AI Layer.

---

# Runtime Behaviour

Assessment Engine berjalan berdasarkan event runtime.

Contoh alur:

```text
LearningActivityCompleted
        │
        ▼
ActivityResultGenerated
        │
        ▼
AssessmentStarted
        │
        ▼
AssessmentCompleted
        │
        ▼
AssessmentResultGenerated
```

Urutan event mengikuti `21_event_model.md`.

---

# Failure Handling

Assessment Engine harus menangani kondisi berikut.

* Activity Result tidak valid.
* Assessment Blueprint tidak ditemukan.
* Assessment Strategy tidak didukung.
* Gagal menghasilkan Assessment Result.
* Gagal mempublikasikan event.

Setiap kegagalan menghasilkan event runtime yang dapat dipantau oleh sistem monitoring.

---

# Design Principles

Assessment Engine mengikuti prinsip-prinsip berikut.

## Stateless Processing

Engine tidak menyimpan state bisnis.

---

## Deterministic Evaluation

Input yang sama menghasilkan Assessment Result yang konsisten.

---

## Blueprint Execution

Assessment Engine hanya mengeksekusi Assessment Blueprint.

---

## Event-Driven Processing

Eksekusi dipicu oleh event runtime.

---

## Domain Separation

Engine tidak memiliki maupun mendefinisikan business rule.

---

# Relationships

Hubungan dengan domain dan engine lain.

```text
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
        │
consumed by
        ▼
KnowledgeProfileEngine
```

Assessment Engine hanya menjadi pelaksana evaluasi.

---

# Published Events

Assessment Engine dapat mempublikasikan event berikut.

* AssessmentStarted
* AssessmentCompleted
* AssessmentResultGenerated
* AssessmentFailed

---

# Consumed Events

Assessment Engine dapat mengonsumsi event berikut.

* ActivityResultGenerated
* AssessmentBlueprintUpdated

---

# References

Dokumen yang berkaitan:

* `16_assessment_blueprint.md`
* `21_event_model.md`
* `20_state_machine.md`
* `31_knowledge_profile_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk spesifikasi **Assessment Engine**.

Dokumen lain tidak boleh mendefinisikan ulang:

* tanggung jawab Assessment Engine,
* processing flow,
* runtime behaviour,
* integration point,
* hubungan antara Activity Result, Assessment Blueprint, dan Assessment Result.

Business rule tetap dimiliki oleh Assessment Blueprint, sedangkan Assessment Engine hanya mengeksekusinya pada saat runtime.

Perubahan terhadap engine harus mempertahankan kontrak dengan domain dan event model.
