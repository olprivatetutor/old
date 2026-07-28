# Content Model

| Version | Status | Owner           | Depends On                | Used By               | Last Updated |
| ------- | ------ | --------------- | ------------------------- | --------------------- | ------------ |
| 2.0     | Freeze | Learning Domain | `15_learning_activity.md` | `40_ai_architecture.md`, `43_ai_personal_learning_agent.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan **Content Model** sebagai representasi resmi seluruh **Learning Content** yang digunakan dalam proses pembelajaran Kaifa.

Content Model menjadi **single source of truth** untuk struktur, klasifikasi, dan karakteristik Learning Content yang dapat digunakan oleh Learning Activity.

Dokumen ini **tidak** mengatur cara penyampaian (delivery), personalisasi AI, maupun percakapan AI.

---

# Scope

## In Scope

* Learning Content
* Content Type
* Content Metadata
* Content Versioning
* Content Relationship
* Content Lifecycle

## Out of Scope

* Content Delivery
* AI Content Generation
* AI Conversation
* Recommendation
* Learning Decision
* Assessment Result

Topik tersebut didefinisikan pada dokumen Runtime, Engine, dan AI.

---

# Definition

**Learning Content** adalah sumber belajar yang digunakan oleh **Learning Activity** untuk membantu learner mencapai Learning Objective.

Learning Content bersifat reusable dan independen terhadap Learning Activity tertentu.

---

# Content Hierarchy

```text
Learning Content
        │
        ├── Article
        ├── Video
        ├── Audio
        ├── Interactive
        ├── Assessment Resource
        ├── Document
        └── External Resource
```

Seluruh tipe di atas merupakan **Learning Content**.

---

# Content Types

| Type                | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| Article             | Materi berbentuk teks.                                                      |
| Video               | Materi berbentuk video.                                                     |
| Audio               | Materi berbentuk audio.                                                     |
| Interactive         | Simulasi, latihan interaktif, atau eksperimen digital.                      |
| Assessment Resource | Konten pendukung proses evaluasi.                                           |
| Document            | PDF, eBook, worksheet, slide, atau dokumen pembelajaran.                    |
| External Resource   | Referensi eksternal seperti website, repository, atau layanan pihak ketiga. |

---

# Content Metadata

Setiap Learning Content minimal memiliki metadata berikut.

| Property           | Description                 |
| ------------------ | --------------------------- |
| Content ID         | Identitas unik.             |
| Title              | Judul konten.               |
| Description        | Deskripsi singkat.          |
| Type               | Jenis Learning Content.     |
| Language           | Bahasa.                     |
| Difficulty         | Tingkat kesulitan.          |
| Estimated Duration | Estimasi waktu belajar.     |
| Version            | Versi konten.               |
| Status             | Draft, Published, Archived. |

---

# Content Lifecycle

```text
Draft
    │
    ▼
Published
    │
    ▼
Archived
```

Lifecycle hanya mengatur status Learning Content, bukan progres learner.

---

# Content Relationships

```text
Learning Module
        │
contains
        ▼
Learning Activity
        │
uses
        ▼
Learning Content
```

Learning Activity dapat menggunakan satu atau lebih Learning Content.

Learning Content dapat digunakan kembali oleh banyak Learning Activity.

---

# AI Content Interaction

AI tidak memiliki Learning Content.

AI menggunakan Learning Content sebagai konteks untuk memberikan pengalaman belajar yang lebih personal.

AI dapat:

* menjelaskan Learning Content,
* memberikan analogi,
* memberikan contoh tambahan,
* menjawab pertanyaan learner,
* membuat latihan tambahan yang bersifat sementara,
* membantu memahami materi.

AI tidak boleh:

* mengubah Learning Content,
* mengubah versi Learning Content,
* mengganti Learning Content resmi,
* menjadi sumber kebenaran Learning Content.

---

# AI Conversation Experience

AI Conversation **bukan** merupakan Learning Content.

AI Conversation adalah pengalaman interaktif yang dihasilkan oleh **AI Personal Learning Agent** berdasarkan:

* Learning Content,
* Learning Decision,
* Knowledge Profile,
* AI Memory,
* Conversation Context.

```text
Learning Content
        │
used by
        ▼
Learning Activity
        │
explained by
        ▼
AI Personal Learning Agent
        │
creates
        ▼
AI Conversation Experience
```

Dengan demikian:

* Learning Content tetap dimiliki Learning Domain.
* AI Conversation dimiliki AI Layer.

---

# Ownership

| Concept                    | Owner                      | Layer           |
| -------------------------- | -------------------------- | --------------- |
| Learning Content           | Learning Domain            | Learning Domain |
| Content Delivery           | Runtime                    | Runtime         |
| AI Conversation Experience | AI Personal Learning Agent | AI Layer        |

---

# Design Principles

Content Model mengikuti prinsip berikut.

* Reusable
* Immutable setelah Published (kecuali melalui versioning)
* Independent dari AI
* Independent dari Recommendation
* Independent dari Runtime State

---

# Relationships

```text
Learning Program
        │
        ▼
Program Structure
        │
        ▼
Learning Module
        │
        ▼
Learning Activity
        │
uses
        ▼
Learning Content

Learning Decision
        │
consumed by
        ▼
AI Personal Learning Agent
        │
uses
        ▼
Learning Content
        │
creates
        ▼
AI Conversation Experience
```

---

# References

* `15_learning_activity.md`
* `20_state_machine.md`
* `40_ai_architecture.md`
* `42_ai_personal_learning_agent.md`
* `44_ai_governance.md`
* `02_glossary.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk **Learning Content**.

Dokumen ini tidak mendefinisikan:

* AI Conversation,
* AI Memory,
* Content Delivery,
* Recommendation,
* Assessment Result.

Perubahan terhadap struktur Learning Content harus mempertahankan pemisahan antara Learning Domain, Runtime, Engine, dan AI Layer.