# Event Model

| Version | Status | Owner   | Depends On              | Used By                | Last Updated |
|---------|--------|---------|-------------------------|------------------------|--------------|
| 2.0     | Freeze | Runtime | `20_state_machine.md`, `02_glossary.md`| `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md`  | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Event Model**, yaitu kontrak komunikasi berbasis event yang digunakan oleh seluruh domain, runtime, engine, dan AI Layer di Kaifa.

Event Model menyediakan bahasa bersama (shared event language) sehingga setiap komponen dapat berkomunikasi secara longgar (loosely coupled) tanpa saling bergantung secara langsung.

Dokumen ini mendefinisikan event secara konseptual, bukan implementasi message broker.

---

# Scope

## In Scope

Dokumen ini membahas:

* Event Classification
* Event Naming
* Event Ownership
* Event Flow
* Event Lifecycle
* Event Principles

## Out of Scope

Dokumen ini **tidak** membahas:

* Event Bus
* Kafka
* RabbitMQ
* Redis
* NATS
* Message Queue
* Retry Policy
* Delivery Guarantee
* Payload Schema

Implementasi teknis komunikasi event berada di layer infrastruktur.

---

# Event Principles

Seluruh event pada Kaifa mengikuti prinsip berikut.

## Immutable

Event tidak dapat diubah setelah dipublikasikan.

---

## Past Tense

Nama event menggunakan bentuk lampau.

Contoh:

* LearningModuleCreated
* AssessmentCompleted
* KnowledgeProfileUpdated

---

## Business Meaning

Event harus merepresentasikan kejadian bisnis atau runtime yang nyata.

---

## Loose Coupling

Publisher tidak mengetahui consumer.

---

## Event Ownership

Satu event hanya memiliki satu publisher.

---

# Event Classification

Event dibagi menjadi dua kelompok utama.

---

## Domain Events

Domain Event dipublikasikan oleh domain ketika terjadi perubahan bisnis.

Contoh:

| Event                      | Publisher            |
| -------------------------- | -------------------- |
| LearningProgramCreated     | Learning Program     |
| LearningProgramPublished   | Learning Program     |
| ProgramStructureAssigned   | Program Structure    |
| LearningModuleCreated      | Learning Module      |
| LearningObjectiveCreated   | Learning Objective   |
| LearningActivityCompleted  | Learning Activity    |
| AssessmentBlueprintUpdated | Assessment Blueprint |

---

## Engine Events

Engine Event dipublikasikan oleh runtime engine.

Contoh:

| Event                     | Publisher                |
| ------------------------- | ------------------------ |
| AssessmentStarted         | Assessment Engine        |
| AssessmentCompleted       | Assessment Engine        |
| AssessmentResultGenerated | Assessment Engine        |
| KnowledgeProfileUpdated   | Knowledge Profile Engine |
| LearningDecisionGenerated | Recommendation Engine    |

---

# Runtime Flow

Alur event utama sistem.

```text id="9ksfcu"
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
        │
        ▼
KnowledgeProfileUpdated
        │
        ▼
LearningDecisionGenerated
```

Setiap event hanya dipublikasikan sekali oleh owner-nya.

---

# Event Ownership

| Event Group                 | Owner                    |
| --------------------------- | ------------------------ |
| Learning Program Events     | Learning Program         |
| Program Structure Events    | Program Structure        |
| Learning Module Events      | Learning Module          |
| Learning Design Events      | Learning Design          |
| Learning Objective Events   | Learning Objective       |
| Learning Activity Events    | Learning Activity        |
| Assessment Blueprint Events | Assessment Blueprint     |
| Assessment Events           | Assessment Engine        |
| Knowledge Profile Events    | Knowledge Profile Engine |
| Recommendation Events       | Recommendation Engine    |

Ownership tidak boleh berpindah antar domain maupun engine.

---

# Event Lifecycle

```text id="kkjlwm"
Business Action
        │
        ▼
Domain Event
        │
        ▼
Runtime Processing
        │
        ▼
Engine Event
        │
        ▼
Consumer Processing
```

Domain Event dan Engine Event memiliki lifecycle yang berbeda tetapi menggunakan prinsip yang sama.

---

# Event Consumers

Secara konseptual hubungan publisher dan consumer.

```text id="ljlwm5"
LearningActivity
        │
publishes
        ▼
ActivityResultGenerated
        │
consumed by
        ▼
AssessmentEngine
        │
publishes
        ▼
AssessmentResultGenerated
        │
consumed by
        ▼
KnowledgeProfileEngine
        │
publishes
        ▼
KnowledgeProfileUpdated
        │
consumed by
        ▼
RecommendationEngine
        │
publishes
        ▼
LearningDecisionGenerated
        │
consumed by
        ▼
Application
        │
AI Layer
        │
Analytics
```

Consumer dapat bertambah tanpa mengubah publisher.

---

# Naming Convention

Seluruh event mengikuti pola berikut.

```text id="dyglb7"
<Entity><Past Tense>
```

Contoh:

* LearningProgramCreated
* LearningModulePublished
* LearningActivityCompleted
* ActivityResultGenerated
* AssessmentCompleted
* AssessmentResultGenerated
* KnowledgeProfileUpdated
* LearningDecisionGenerated

---

# References

Dokumen yang berkaitan:

* `20_state_machine.md`
* `30_assessment_engine.md`
* `31_knowledge_profile_engine.md`
* `32_recommendation_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk seluruh event pada Kaifa.

Dokumen lain tidak boleh mendefinisikan ulang:

* klasifikasi event,
* ownership event,
* naming convention,
* event flow.

Perubahan terhadap event harus menjaga kompatibilitas antar domain, runtime, engine, dan AI Layer.