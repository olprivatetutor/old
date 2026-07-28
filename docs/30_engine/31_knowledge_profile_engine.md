# Knowledge Profile Engine

| Version | Status | Owner           | Depends On              | Used By                   | Last Updated |
|---------|--------|-----------------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | Knowledge Profile Engine | `30_assessment_engine.md`, `21_event_model.md` | `32_recommendation_engine.md`, `43_ai_personal_learning_agent.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Knowledge Profile Engine**, yaitu komponen runtime yang bertanggung jawab untuk membangun dan memperbarui **Knowledge Profile** berdasarkan hasil evaluasi pembelajaran (**Assessment Result**).

Knowledge Profile Engine menerjemahkan hasil evaluasi menjadi representasi tingkat penguasaan learner terhadap kompetensi dan pengetahuan yang dipelajari.

Engine ini mengimplementasikan aturan pembaruan profil tanpa menjadi pemilik business rule pembelajaran.

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
* Assessment Engine
* Recommendation
* AI Capability
* Business Rule
* State Definition
* Event Definition

Seluruh konsep tersebut didefinisikan pada dokumen masing-masing.

---

# Engine Responsibilities

Knowledge Profile Engine bertanggung jawab untuk:

* Menerima Assessment Result.
* Memuat Knowledge Profile learner.
* Menghitung perubahan tingkat penguasaan berdasarkan hasil evaluasi.
* Memperbarui Knowledge Profile.
* Mempublikasikan perubahan Knowledge Profile.
* Menyediakan Knowledge Profile terbaru bagi engine lain.

Knowledge Profile Engine tidak menentukan strategi evaluasi maupun rekomendasi pembelajaran.

---

# Engine Inputs

Knowledge Profile Engine menerima input berikut.

| Input             | Source             |
| ----------------- | ------------------ |
| Assessment Result | Assessment Engine  |
| Knowledge Profile | Runtime Repository |
| Learning Context  | Runtime            |

Input telah divalidasi oleh layer sebelumnya.

---

# Engine Outputs

Knowledge Profile Engine menghasilkan:

| Output                    | Consumer              |
| ------------------------- | --------------------- |
| Updated Knowledge Profile | Recommendation Engine |
| Knowledge Profile Event   | Event Model           |
| Profile Metadata          | Analytics             |

Engine tidak mengubah domain secara langsung.

---

# Processing Flow

Proses utama Knowledge Profile Engine adalah sebagai berikut.

```text
Assessment Result
        │
        ▼
Load Knowledge Profile
        │
        ▼
Validate Assessment Result
        │
        ▼
Update Knowledge Profile
        │
        ▼
Persist Knowledge Profile
        │
        ▼
Publish Event
```

Seluruh proses berlangsung pada runtime.

---

# Knowledge Profile

Knowledge Profile merupakan representasi tingkat penguasaan learner terhadap pengetahuan dan kompetensi yang telah dipelajari.

Knowledge Profile menjadi sumber utama bagi proses personalisasi pembelajaran dan rekomendasi belajar.

Knowledge Profile bukan bagian dari Learning Design maupun Assessment Blueprint.

---

# Integration Points

Knowledge Profile Engine berinteraksi dengan komponen berikut.

| Component             | Purpose                                |
| --------------------- | -------------------------------------- |
| Assessment Engine     | Menerima Assessment Result.            |
| Event Model           | Mempublikasikan perubahan profil.      |
| Recommendation Engine | Menyediakan Knowledge Profile terbaru. |
| Analytics             | Menyediakan data perkembangan learner. |

Knowledge Profile Engine tidak berinteraksi langsung dengan AI.

---

# Runtime Behaviour

Knowledge Profile Engine berjalan berdasarkan event runtime.

Contoh alur:

```text
AssessmentCompleted
        │
        ▼
AssessmentResultGenerated
        │
        ▼
KnowledgeProfileEngine
        │
        ▼
KnowledgeProfileUpdated
```

Urutan event mengikuti `21_event_model.md`.

---

# Failure Handling

Knowledge Profile Engine harus menangani kondisi berikut.

* Assessment Result tidak valid.
* Knowledge Profile tidak ditemukan.
* Gagal memperbarui Knowledge Profile.
* Gagal menyimpan perubahan.
* Gagal mempublikasikan event.

Setiap kegagalan menghasilkan event error yang dapat dipantau oleh sistem monitoring.

---

# Design Principles

Knowledge Profile Engine mengikuti prinsip berikut.

## Stateless Processing

Engine tidak menyimpan state bisnis di dalam proses eksekusi.

---

## Incremental Update

Knowledge Profile diperbarui berdasarkan perubahan terbaru tanpa membangun ulang seluruh profil.

---

## Deterministic Processing

Assessment Result yang sama harus menghasilkan perubahan Knowledge Profile yang konsisten.

---

## Event-Driven Execution

Seluruh proses dipicu oleh event runtime.

---

## Domain Separation

Engine hanya mengimplementasikan pembaruan profil dan tidak mendefinisikan business rule pembelajaran.

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
```

Knowledge Profile Engine tidak memiliki Assessment Result maupun Knowledge Profile.

---

# Published Events

Knowledge Profile Engine dapat mempublikasikan event berikut.

* KnowledgeProfileUpdateStarted
* KnowledgeProfileUpdated
* KnowledgeProfileUpdateFailed

---

# Consumed Events

Knowledge Profile Engine dapat mengonsumsi event berikut.

* AssessmentCompleted
* AssessmentResultGenerated

---

# References

Dokumen yang berkaitan:

* `30_assessment_engine.md`
* `21_event_model.md`
* `20_state_machine.md`
* `32_recommendation_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk spesifikasi **Knowledge Profile Engine**.

Dokumen lain tidak boleh mendefinisikan ulang:

* tanggung jawab Knowledge Profile Engine,
* processing flow,
* integration point,
* runtime behaviour.

Business rule mengenai pembentukan maupun interpretasi Knowledge Profile tetap dimiliki oleh domain yang relevan dan bukan oleh engine.

Perubahan terhadap engine harus mempertahankan kontrak dengan domain model serta event model.
