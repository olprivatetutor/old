# AI Provider Integration

| Version | Status | Owner           | Depends On            | Used By                                         | Last Updated |
|---------|--------|-----------------|-----------------------|-------------------------------------------------|--------------|
| 2.0     | Freeze | AI Layer        | `40_ai_architecture.md` | `43_ai_personal_learning_agent.md`, `44_ai_governance.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan arsitektur integrasi antara Kaifa dan penyedia layanan Artificial Intelligence (AI Provider).

AI Provider Integration menyediakan abstraction layer sehingga seluruh komponen AI pada Kaifa dapat menggunakan berbagai model AI tanpa bergantung pada implementasi atau vendor tertentu.

Dokumen ini tidak mendefinisikan business rule pembelajaran maupun logika pengambilan keputusan.

---

# Scope

## In Scope

Dokumen ini membahas:

* AI Provider Architecture
* Provider Abstraction
* AI Capability Mapping
* Provider Selection
* Fallback Strategy
* Security Principles
* Cost Optimization
* Observability

## Out of Scope

Dokumen ini **tidak** membahas:

* Learning Program
* Recommendation Engine
* Assessment Engine
* Knowledge Profile
* AI Memory
* Personal Learning Agent
* AI Governance
* Prompt Engineering
* Fine-Tuning Model

Seluruh topik tersebut dijelaskan pada dokumen masing-masing.

---

# Architecture Principles

AI Provider Integration mengikuti prinsip berikut.

## Provider Agnostic

Seluruh komponen AI berinteraksi melalui abstraction layer.

Tidak ada komponen yang terhubung langsung ke provider tertentu.

---

## Capability Driven

Pemilihan provider dilakukan berdasarkan capability yang dibutuhkan, bukan nama vendor.

---

## Replaceable

Provider dapat diganti tanpa mengubah business logic maupun engine.

---

## Multi Provider

Sistem dapat menggunakan lebih dari satu provider secara bersamaan.

---

## Graceful Degradation

Apabila provider tidak tersedia, sistem tetap dapat menjalankan fungsi utama yang tidak bergantung pada AI.

---

# High-Level Architecture

```text
Application
        │
        ▼
AI Layer
        │
        ▼
AI Provider Gateway
        │
        ├── Provider Adapter A
        ├── Provider Adapter B
        ├── Provider Adapter C
        └── Local AI Runtime
```

AI Layer hanya mengetahui AI Provider Gateway.

Gateway bertanggung jawab memilih provider yang sesuai.

---

# AI Provider Gateway

AI Provider Gateway merupakan abstraction layer antara Kaifa dan penyedia AI.

Gateway bertanggung jawab untuk:

* memilih provider,
* melakukan routing request,
* normalisasi request,
* normalisasi response,
* retry,
* fallback,
* observability.

Gateway tidak memiliki business rule pembelajaran.

---

# AI Capability

Capability AI dikelompokkan berdasarkan fungsi.

| Capability               | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| Chat Completion          | Percakapan natural dengan learner.                    |
| Reasoning                | Penalaran untuk membantu penjelasan.                  |
| Text Generation          | Membuat penjelasan, ringkasan, atau materi pendukung. |
| Translation              | Menerjemahkan konten pembelajaran.                    |
| Speech to Text           | Mengubah suara menjadi teks.                          |
| Text to Speech           | Mengubah teks menjadi suara.                          |
| Pronunciation Assessment | Mengevaluasi pengucapan learner.                      |
| OCR                      | Mengekstrak teks dari gambar atau dokumen.            |
| Vision Understanding     | Memahami gambar atau ilustrasi pembelajaran.          |
| Embedding                | Representasi semantik untuk pencarian dan memori.     |
| Content Moderation       | Pemeriksaan keamanan konten.                          |

Capability dapat bertambah tanpa mengubah arsitektur.

---

# Provider Selection Strategy

Gateway memilih provider berdasarkan:

* capability yang dibutuhkan,
* kualitas model,
* latency,
* biaya,
* availability,
* kebijakan organisasi.

Pemilihan provider tidak boleh memengaruhi business rule pembelajaran.

---

# Provider Adapter

Setiap AI Provider memiliki adapter tersendiri.

Tanggung jawab adapter:

* mengubah request internal menjadi format provider,
* mengubah response provider menjadi format internal,
* menangani autentikasi,
* menangani error provider.

Adapter tidak memiliki business logic.

---

# Fallback Strategy

Apabila provider utama gagal:

1. Gunakan provider cadangan apabila capability tersedia.
2. Jika tidak tersedia, berikan respons yang aman kepada aplikasi.
3. Fungsi pembelajaran utama tetap berjalan menggunakan engine non-AI.

---

# Security Principles

Integrasi AI mengikuti prinsip berikut.

## Data Minimization

Hanya data yang diperlukan yang dikirim ke provider.

---

## Privacy by Design

Informasi sensitif tidak dikirim tanpa kebijakan yang sesuai.

---

## Auditability

Seluruh interaksi AI dapat diaudit.

---

## Provider Isolation

Kegagalan satu provider tidak memengaruhi provider lain.

---

# Cost Optimization

Gateway dapat menerapkan strategi berikut.

* Model routing.
* Caching.
* Token optimization.
* Prompt compression.
* Batch processing.
* Response reuse.

Strategi optimasi tidak boleh mengubah makna business rule.

---

# Observability

Gateway harus menyediakan metrik berikut.

* Request Count
* Success Rate
* Error Rate
* Latency
* Cost per Request
* Token Usage
* Provider Availability

---

# Relationships

Hubungan antar layer.

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
uses
        ▼
AI Provider Gateway
        │
routes to
        ▼
AI Providers
```

Business rule tetap berada pada Domain dan Engine.

AI Provider hanya menyediakan kemampuan AI.

---

# Supported Provider Categories

Arsitektur mendukung berbagai kategori provider, misalnya:

* Large Language Model (LLM)
* Speech AI
* Vision AI
* Embedding Service
* Moderation Service
* Local/Open-Weight Model

Dokumen ini tidak mengikat pada vendor tertentu.

---

# References

Dokumen yang berkaitan:

* `40_ai_architecture.md`
* `42_ai_memory.md`
* `43_ai_personal_learning_agent.md`
* `44_ai_governance.md`
* `32_recommendation_engine.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk arsitektur integrasi AI Provider.

Dokumen lain tidak boleh mendefinisikan ulang:

* AI Provider Gateway,
* Provider Adapter,
* Provider Selection Strategy,
* Fallback Strategy,
* Capability Mapping.

Perubahan terhadap dokumen ini harus menjaga independensi antara AI Layer dan business layer.
