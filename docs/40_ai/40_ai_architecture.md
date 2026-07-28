# AI Architecture

| Version | Status | Owner | Depends On | Used By | Last Updated |
|---------|--------|-------|------------|---------|--------------|
| 2.0 | Freeze | AI Layer | `32_recommendation_engine.md`, `22_content_model.md` | `41_ai_provider_integration.md`, `42_ai_memory.md`, `43_ai_personal_learning_agent.md`, `44_ai_governance.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **AI Architecture** pada Kaifa v2.

AI Architecture menjelaskan posisi, tanggung jawab, boundary, dan prinsip integrasi Artificial Intelligence di dalam sistem Kaifa.

AI Layer dirancang sebagai **experience layer** yang membantu learner, educator, dan pengguna lain berinteraksi dengan sistem secara lebih natural, personal, dan kontekstual.

AI Layer tidak menjadi pemilik business rule, tidak menghasilkan Learning Decision, dan tidak mengubah domain state secara langsung.

---

# Scope

## In Scope

Dokumen ini membahas:

- AI Layer responsibility
- AI capability boundary
- AI interaction model
- AI Conversation Experience
- Relationship dengan Domain, Runtime, Engine, dan Content Model
- AI dependency rules
- AI non-goals

## Out of Scope

Dokumen ini **tidak** membahas:

- AI Provider implementation
- AI Memory detail
- Personal Learning Agent detail
- AI Governance detail
- Prompt engineering
- Model training
- Fine-tuning
- Database schema
- API contract

Topik-topik tersebut didefinisikan pada dokumen masing-masing.

---

# AI Architecture Principle

Kaifa menggunakan prinsip:

> **AI as Experience Layer, not Decision Layer.**

Artinya AI bertugas meningkatkan pengalaman pengguna, tetapi keputusan pembelajaran tetap dihasilkan oleh Engine.

```text
Learning Domain
        │
        ▼
Runtime
        │
        ▼
Engine
        │
produces
        ▼
Learning Decision
        │
consumed by
        ▼
AI Layer
        │
communicates with
        ▼
Learner
```

---

# AI Layer Responsibilities

AI Layer bertanggung jawab untuk:

- Menjelaskan Learning Decision kepada learner.
- Membantu learner memahami Learning Content.
- Menjawab pertanyaan berdasarkan konteks pembelajaran.
- Memberikan contoh, analogi, dan penjelasan tambahan.
- Menyesuaikan gaya komunikasi berdasarkan AI Memory.
- Menyediakan AI Conversation Experience.
- Membantu educator atau administrator melalui AI-assisted workflows yang tidak mengubah business rule.

AI Layer tidak bertanggung jawab untuk:

- menghasilkan Learning Decision,
- menghitung Assessment Result,
- memperbarui Knowledge Profile,
- mengubah Learning Program,
- mengubah Learning Design,
- mengubah Assessment Blueprint,
- mengubah Learning Content resmi.

---

# Core AI Components

AI Layer terdiri dari komponen utama berikut.

| Component | Responsibility |
|-----------|----------------|
| AI Provider Integration | Abstraction layer untuk mengakses berbagai AI Provider. |
| AI Memory | Menyimpan konteks percakapan dan preferensi learner. |
| AI Personal Learning Agent | Mengorkestrasi konteks dan menghasilkan interaksi natural. |
| AI Governance | Mengatur boundary, keamanan, privacy, auditability, dan risk control. |

---

# AI Provider Integration

AI Provider Integration menyediakan abstraction layer agar Kaifa tidak bergantung pada satu vendor AI tertentu.

Seluruh akses ke provider AI dilakukan melalui **AI Provider Gateway**.

Dokumen detail: `41_ai_provider_integration.md`.

---

# AI Memory

AI Memory menyimpan konteks percakapan dan preferensi pengguna yang relevan untuk personalisasi.

AI Memory berbeda dari Knowledge Profile.

```text
Knowledge Profile = business data
AI Memory         = conversational context
```

Dokumen detail: `42_ai_memory.md`.

---

# AI Personal Learning Agent

AI Personal Learning Agent adalah orchestrator utama pengalaman AI.

Agent membaca:

- Learning Decision,
- Knowledge Profile,
- AI Memory,
- Conversation Context,
- Learning Content.

Agent kemudian menghasilkan respons natural untuk learner.

Agent tidak membuat Learning Decision sendiri.

Dokumen detail: `43_ai_personal_learning_agent.md`.

---

# AI Governance

AI Governance mengatur batas operasional AI, termasuk:

- privacy,
- safety,
- auditability,
- explainability,
- hallucination mitigation,
- prompt injection risk,
- provider risk.

Dokumen detail: `44_ai_governance.md`.

---

# AI Conversation Experience

**AI Conversation Experience** adalah pengalaman percakapan interaktif yang dihasilkan oleh AI Personal Learning Agent.

AI Conversation Experience bukan Learning Content.

AI Conversation Experience menggunakan konteks dari:

- Learning Content,
- Learning Decision,
- Knowledge Profile,
- AI Memory,
- Conversation Context.

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

AI Conversation Experience bersifat dinamis, personal, dan kontekstual.

AI Conversation Experience tidak menggantikan Learning Content resmi.

---

# AI and Learning Content

AI dapat menggunakan Learning Content sebagai konteks.

AI dapat:

- menjelaskan Learning Content,
- memberikan contoh tambahan,
- membuat analogi,
- menjawab pertanyaan learner,
- membantu learner memahami materi,
- membuat latihan sementara untuk mendukung pemahaman.

AI tidak boleh:

- mengubah Learning Content resmi,
- mengganti versi Learning Content,
- menjadi sumber kebenaran Learning Content,
- menghapus atau menerbitkan Learning Content.

Learning Content tetap didefinisikan pada `22_content_model.md`.

---

# AI and Learning Decision

Learning Decision dihasilkan oleh Recommendation Engine.

AI hanya mengonsumsi Learning Decision dan menyajikannya kepada learner dalam bentuk komunikasi natural.

```text
Recommendation Engine
        │
produces
        ▼
Learning Decision
        │
consumed by
        ▼
AI Personal Learning Agent
        │
explains
        ▼
Learner
```

AI tidak boleh membuat, mengganti, atau mengabaikan Learning Decision.

---

# AI and Knowledge Profile

Knowledge Profile adalah business data yang diperbarui oleh Knowledge Profile Engine.

AI dapat membaca Knowledge Profile melalui business layer untuk memahami kondisi learner.

AI tidak boleh memperbarui Knowledge Profile secara langsung.

---

# AI Capability Categories

AI Layer dapat mendukung capability berikut.

| Capability | Description |
|------------|-------------|
| Explanation | Menjelaskan materi, hasil assessment, atau Learning Decision. |
| Tutoring | Membantu learner memahami konsep. |
| Coaching | Memberikan motivasi dan arahan belajar. |
| Conversation | Menyediakan percakapan interaktif berbasis konteks. |
| Feedback Support | Membantu menjelaskan feedback pembelajaran. |
| Content Assistance | Membantu membuat contoh atau latihan sementara. |
| Translation Support | Membantu pemahaman lintas bahasa. |
| Accessibility Support | Membantu learner dengan kebutuhan aksesibilitas. |

Capability tersebut tidak boleh mengambil alih business rule.

---

# AI Boundary

AI boleh:

- membaca Learning Decision,
- membaca Knowledge Profile,
- membaca AI Memory,
- membaca Conversation Context,
- membaca Learning Content,
- menghasilkan natural response,
- menghasilkan AI Conversation Experience.

AI tidak boleh:

- membuat Learning Decision,
- menghitung Assessment Result,
- memperbarui Knowledge Profile,
- mengubah Learning Content resmi,
- mengubah Assessment Blueprint,
- mengubah Learning Design,
- mengubah domain state secara langsung.

---

# Failure Behaviour

Apabila AI Layer gagal atau AI Provider tidak tersedia:

- Learning Decision tetap tersedia dari Recommendation Engine.
- Learning Activity tetap dapat berjalan.
- Assessment Engine tetap dapat menghasilkan Assessment Result.
- Knowledge Profile tetap dapat diperbarui.
- Sistem menampilkan fallback non-AI kepada learner.

AI failure tidak boleh menghentikan core learning pipeline.

---

# Relationships

```text
Learning Domain
        │
        ▼
Runtime
        │
        ▼
Engine
        │
produces
        ▼
Learning Decision
        │
consumed by
        ▼
AI Layer
        │
        ├── AI Provider Integration
        ├── AI Memory
        ├── AI Personal Learning Agent
        └── AI Governance
        │
        ▼
Learner
```

---

# References

- `22_content_model.md`
- `32_recommendation_engine.md`
- `41_ai_provider_integration.md`
- `42_ai_memory.md`
- `43_ai_personal_learning_agent.md`
- `44_ai_governance.md`
- `02_glossary.md`
- `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk gambaran arsitektur AI Layer Kaifa.

Dokumen ini tidak mendefinisikan ulang:

- AI Provider Gateway,
- AI Memory lifecycle,
- AI Personal Learning Agent flow,
- AI Governance policy,
- Learning Content,
- Learning Decision.

Perubahan pada AI Architecture harus menjaga prinsip bahwa AI merupakan **experience layer**, bukan business rule layer.
