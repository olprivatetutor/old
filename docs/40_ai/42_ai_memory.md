# AI Memory

| Version | Status | Owner           | Depends On              | Used By                   | Last Updated |
|---------|--------|-----------------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | AI Layer| `40_ai_architecture.md` | `43_ai_personal_learning_agent.md`, `44_ai_governance.md` | 2026-07-04   |


---

# Purpose

Dokumen ini mendefinisikan **AI Memory**, yaitu komponen AI Layer yang bertanggung jawab mengelola memori percakapan dan preferensi learner untuk meningkatkan kualitas interaksi AI.

AI Memory menyimpan konteks percakapan yang relevan agar AI dapat memberikan respons yang lebih personal, konsisten, dan kontekstual.

AI Memory bukan sumber kebenaran (source of truth) untuk data bisnis pembelajaran.

---

# Scope

## In Scope

Dokumen ini membahas:

* AI Memory Architecture
* Memory Types
* Memory Lifecycle
* Memory Retrieval
* Memory Update
* Memory Governance
* Security Principles

## Out of Scope

Dokumen ini **tidak** membahas:

* Knowledge Profile
* Learning Program
* Recommendation Engine
* Assessment Engine
* AI Provider
* Prompt Engineering
* Fine-Tuning

Topik-topik tersebut dijelaskan pada dokumen masing-masing.

---

# Architecture Principles

AI Memory mengikuti prinsip berikut.

## Business Separation

AI Memory tidak menjadi pemilik data bisnis.

---

## Context Persistence

AI Memory mempertahankan konteks percakapan yang relevan.

---

## Selective Retention

Tidak semua percakapan disimpan sebagai memori.

---

## Explainable Memory

Memori yang digunakan AI harus dapat ditelusuri sumbernya.

---

## Provider Agnostic

AI Memory tidak bergantung pada provider AI tertentu.

---

# Memory Categories

AI Memory terdiri dari beberapa kategori.

| Memory Type       | Description                                          |
| ----------------- | ---------------------------------------------------- |
| Session Memory    | Konteks percakapan selama satu sesi.                 |
| Short-Term Memory | Informasi penting yang bertahan untuk beberapa sesi. |
| Long-Term Memory  | Preferensi dan kebiasaan learner yang stabil.        |
| Episodic Memory   | Riwayat interaksi atau pengalaman belajar tertentu.  |
| Semantic Memory   | Fakta non-bisnis yang relevan untuk personalisasi.   |

Business data seperti Knowledge Profile tidak termasuk dalam kategori AI Memory.

---

# Memory Sources

AI Memory dapat memperoleh informasi dari:

* Percakapan dengan learner.
* Preferensi yang diberikan secara eksplisit.
* Interaksi dengan AI.
* Metadata penggunaan aplikasi.

AI Memory tidak boleh mengambil keputusan bisnis berdasarkan memorinya sendiri.

---

# Memory Lifecycle

```text id="1rq3kp"
Conversation
        │
        ▼
Memory Candidate
        │
        ▼
Memory Evaluation
        │
        ▼
Store Memory
        │
        ▼
Retrieve Memory
        │
        ▼
Expire or Archive
```

Tidak semua Conversation menjadi Memory.

---

# Memory Retrieval

Sebelum AI menghasilkan respons:

1. Ambil Session Memory.
2. Ambil Short-Term Memory yang relevan.
3. Ambil Long-Term Memory yang relevan.
4. Ambil Knowledge Profile melalui business layer (bukan dari AI Memory).
5. Bangun konteks AI.

---

# Memory Update

AI Memory diperbarui apabila:

* learner memberikan preferensi baru,
* terjadi perubahan kebiasaan yang konsisten,
* terdapat informasi penting yang layak dipertahankan.

AI tidak boleh menyimpan informasi tanpa memenuhi kebijakan governance.

---

# Security Principles

AI Memory mengikuti prinsip berikut.

## User Control

Learner dapat melihat, menghapus, atau mengelola memori yang diizinkan oleh kebijakan produk.

---

## Data Minimization

Hanya informasi yang diperlukan yang disimpan.

---

## Privacy by Design

Informasi sensitif diperlakukan sesuai kebijakan privasi.

---

## Expiration Policy

Memori memiliki masa berlaku sesuai kategori.

---

# Relationships

Hubungan dengan layer lain.

```text id="0zjlwm"
Knowledge Profile
        │
Business Layer
        ▼

AI Layer
        │
        ├── AI Memory
        ├── Personal Learning Agent
        └── AI Provider Gateway
```

Knowledge Profile tetap berada pada business layer.

AI Memory hanya menyediakan konteks percakapan.

---

# Integration Flow

```text id="m0by6k"
Learner
        │
Conversation
        ▼
AI Layer
        │
Retrieve Memory
        ▼
AI Memory
        │
Retrieve Business Context
        ▼
Knowledge Profile
        │
Compose Context
        ▼
LLM
```

AI Memory tidak menghasilkan Learning Decision.

---

# References

Dokumen yang berkaitan:

* `40_ai_architecture.md`
* `43_ai_personal_learning_agent.md`
* `44_ai_governance.md`
* `41_ai_provider_integration.md`
* `31_knowledge_profile_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk arsitektur **AI Memory**.

Dokumen lain tidak boleh mendefinisikan ulang:

* kategori AI Memory,
* lifecycle AI Memory,
* retrieval flow,
* hubungan AI Memory dengan Knowledge Profile.

Perubahan terhadap dokumen ini harus menjaga pemisahan antara AI Memory dan business data.
