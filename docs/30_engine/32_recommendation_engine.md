# Recommendation Engine

| Version | Status | Owner                 | Depends On                     | Used By                          | Last Updated |
|---------|--------|-----------------------|--------------------------------|----------------------------------|--------------|
| 2.0     | Freeze | Recommendation Engine | `31_knowledge_profile_engine.md`, `12_learning_design.md` | `40_ai_architecture.md`, `43_ai_personal_learning_agent.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Recommendation Engine**, yaitu komponen runtime yang bertanggung jawab menghasilkan **Learning Decision** berdasarkan kondisi pembelajaran learner.

Recommendation Engine menganalisis **Knowledge Profile**, **Learning Design**, dan konteks pembelajaran untuk menentukan tindakan belajar berikutnya yang paling sesuai.

Engine ini mengimplementasikan logika pengambilan keputusan pembelajaran tanpa menjadi pemilik business rule domain.

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

* Learning Program
* Learning Design
* Assessment Blueprint
* Knowledge Profile Domain
* AI Capability
* Business Rule
* State Definition
* Event Definition

Seluruh konsep tersebut didefinisikan pada dokumen masing-masing.

---

# Engine Responsibilities

Recommendation Engine bertanggung jawab untuk:

* Menganalisis Knowledge Profile learner.
* Mempertimbangkan Learning Design yang berlaku.
* Mempertimbangkan konteks pembelajaran saat ini.
* Menghasilkan Learning Decision.
* Mempublikasikan hasil keputusan.
* Menyediakan keputusan bagi aplikasi maupun AI Layer.

Recommendation Engine tidak bertanggung jawab terhadap proses evaluasi maupun pembentukan Knowledge Profile.

---

# Engine Inputs

Recommendation Engine menerima input berikut.

| Input             | Source                   |
| ----------------- | ------------------------ |
| Knowledge Profile | Knowledge Profile Engine |
| Learning Design   | Learning Domain          |
| Learning Context  | Runtime                  |
| Program Context   | Learning Program         |

Input telah divalidasi oleh layer sebelumnya.

---

# Engine Outputs

Recommendation Engine menghasilkan:

| Output                  | Consumer    |
| ----------------------- | ----------- |
| Learning Decision       | Application |
| Learning Decision       | AI Layer    |
| Recommendation Event    | Event Model |
| Recommendation Metadata | Analytics   |

Engine tidak mengubah domain secara langsung.

---

# Learning Decision

Learning Decision merupakan hasil keputusan pembelajaran yang dihasilkan Recommendation Engine.

Contoh Learning Decision:

| Decision          | Description                         |
| ----------------- | ----------------------------------- |
| Next Module       | Lanjut ke module berikutnya.        |
| Review Module     | Mengulang module sebelumnya.        |
| Repeat Activity   | Mengulang aktivitas tertentu.       |
| Take Assessment   | Mengikuti assessment.               |
| Continue Learning | Melanjutkan proses belajar.         |
| Complete Module   | Menyelesaikan module.               |
| Complete Program  | Menyelesaikan program pembelajaran. |

Aplikasi maupun AI Layer dapat menyajikan Learning Decision dengan cara yang berbeda tanpa mengubah keputusan yang dihasilkan engine.

---

# Processing Flow

Proses utama Recommendation Engine adalah sebagai berikut.

```text
Knowledge Profile
        │
        ▼
Load Learning Design
        │
        ▼
Analyze Learning Context
        │
        ▼
Generate Learning Decision
        │
        ▼
Publish Event
```

Seluruh proses berlangsung pada runtime.

---

# Integration Points

Recommendation Engine berinteraksi dengan komponen berikut.

| Component                | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| Knowledge Profile Engine | Menerima Knowledge Profile terbaru.               |
| Learning Design          | Membaca blueprint pembelajaran.                   |
| Event Model              | Mempublikasikan Learning Decision.                |
| Analytics                | Menyediakan data keputusan pembelajaran.          |
| AI Layer                 | Mengirim Learning Decision untuk dipersonalisasi. |

Recommendation Engine tidak berinteraksi langsung dengan Assessment Engine.

---

# Runtime Behaviour

Recommendation Engine berjalan berdasarkan event runtime.

Contoh alur:

```text
KnowledgeProfileUpdated
        │
        ▼
RecommendationEngine
        │
        ▼
LearningDecisionGenerated
```

Urutan event mengikuti `21_event_model.md`.

---

# Failure Handling

Recommendation Engine harus menangani kondisi berikut.

* Knowledge Profile tidak tersedia.
* Learning Design tidak ditemukan.
* Learning Context tidak valid.
* Tidak ada Learning Decision yang dapat dihasilkan.
* Gagal mempublikasikan event.

Setiap kegagalan menghasilkan event error yang dapat dipantau oleh sistem monitoring.

---

# Design Principles

Recommendation Engine mengikuti prinsip berikut.

## Deterministic Decision

Input yang sama harus menghasilkan Learning Decision yang konsisten.

---

## Explainable Decision

Setiap Learning Decision harus dapat dijelaskan kepada learner maupun educator.

---

## Context-Aware Processing

Keputusan mempertimbangkan konteks pembelajaran saat ini.

---

## Event-Driven Execution

Eksekusi dipicu oleh event runtime.

---

## Domain Separation

Engine mengimplementasikan pengambilan keputusan tanpa menjadi pemilik business rule domain.

---

# Relationships

Hubungan dengan domain dan engine lain.

```text
AssessmentEngine
        │
produces
        ▼
AssessmentResult
        │
consumed by
        ▼
KnowledgeProfileEngine
        │
updates
        ▼
KnowledgeProfile
        │
consumed by
        ▼
RecommendationEngine
        │
produces
        ▼
LearningDecision
        │
consumed by
        ├── Application
        ├── AI Layer
        └── Analytics
```

Recommendation Engine tidak memiliki Knowledge Profile maupun Learning Design.

---

# Published Events

Recommendation Engine dapat mempublikasikan event berikut.

* RecommendationStarted
* LearningDecisionGenerated
* RecommendationCompleted
* RecommendationFailed

---

# Consumed Events

Recommendation Engine dapat mengonsumsi event berikut.

* KnowledgeProfileUpdated
* LearningContextChanged

---

# References

Dokumen yang berkaitan:

* `12_learning_design.md`
* `30_assessment_engine.md`
* `31_knowledge_profile_engine.md`
* `20_state_machine.md`
* `21_event_model.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk spesifikasi **Recommendation Engine**.

Dokumen lain tidak boleh mendefinisikan ulang:

* tanggung jawab Recommendation Engine,
* processing flow,
* integration point,
* runtime behaviour,
* konsep Learning Decision sebagai output engine.

Business rule mengenai strategi pembelajaran tetap dimiliki oleh domain, sedangkan Recommendation Engine hanya mengeksekusinya pada saat runtime.

Perubahan terhadap engine harus mempertahankan kontrak dengan domain model serta event model.
