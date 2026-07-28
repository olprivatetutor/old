# Kaifa v2 Architecture Overview

| Version | Status | Owner      | Depends On | Used By       | Last Updated |
|---------|--------|------------|------------|---------------|--------------|
| 2.0     | Freeze | Foundation | -          | Semua dokumen | 2026-07-04   |

---

# Purpose

Dokumen ini merupakan gambaran menyeluruh (high-level architecture) dari Kaifa v2.

Architecture Overview menjelaskan visi arsitektur, struktur layer, batas tanggung jawab (boundary), serta alur utama sistem pembelajaran.

Seluruh detail implementasi didefinisikan pada dokumen lain.

---

# Vision

Kaifa adalah **AI-Native Adaptive Learning Platform** yang mendukung berbagai jenis program pembelajaran, seperti:

* Kurikulum Nasional
* TOEFL Preparation
* IELTS Preparation
* Bahasa Arab
* Program Sertifikasi
* Program Kustom

Platform ini memisahkan secara tegas antara:

* business rule,
* runtime,
* engine,
* AI,
* product.

Dengan demikian AI menjadi lapisan pengalaman (experience layer), bukan pusat logika bisnis.

---

# Architecture Principles

Kaifa dibangun berdasarkan prinsip berikut.

* Domain-Driven Design (DDD)
* Layered Architecture
* Event-Driven Runtime
* Engine-Based Processing
* AI as Experience Layer
* Provider Agnostic AI
* Explainable Decision
* Loose Coupling
* Single Source of Truth

---

# Architecture Layers

```text id="ov01"
Foundation
        │
        ▼
Learning Domain
        │
        ▼
Runtime
        │
        ▼
Engine
        │
        ▼
AI Layer
        │
        ▼
Product
```

Setiap layer memiliki tanggung jawab yang berbeda dan tidak saling mengambil alih peran layer lain.

---

# Layer Responsibilities

| Layer           | Responsibility                                                   |
| --------------- | ---------------------------------------------------------------- |
| Foundation      | Mendefinisikan prinsip, istilah, dan fondasi arsitektur.         |
| Learning Domain | Mendefinisikan business rule pembelajaran.                       |
| Runtime         | Mendefinisikan state, event, dan content saat sistem berjalan.   |
| Engine          | Mengeksekusi business rule secara deterministik.                 |
| AI Layer        | Memberikan pengalaman belajar yang personal dan natural.         |
| Product         | Menerjemahkan arsitektur menjadi roadmap dan requirement produk. |

---

# Learning Domain

Learning Domain terdiri dari:

```text id="ov02"
Learning Program
        │
Program Structure
        │
Learning Module
        │
Learning Design
        │
Learning Objective
        │
Learning Activity
        │
Assessment Blueprint
```

Learning Domain merupakan pemilik seluruh business rule pembelajaran.

---

# Runtime

Runtime menyediakan lingkungan eksekusi pembelajaran.

Komponen utama:

* State Machine
* Event Model
* Learning Content Model

Runtime tidak memiliki business rule.

---

# Engine

Engine bertanggung jawab menjalankan business rule yang telah didefinisikan oleh domain.

Engine terdiri dari:

```text id="ov03"
Assessment Engine

Knowledge Profile Engine

Recommendation Engine
```

Engine menghasilkan output yang deterministik dan dapat diaudit.

---

# AI Layer

AI Layer bertanggung jawab memberikan pengalaman belajar yang personal.

Komponen AI:

```text id="ov04"
AI Architecture

AI Provider Integration

AI Memory

AI Personal Learning Agent

AI Governance
```

AI tidak menjadi pemilik business rule maupun pengambilan keputusan pembelajaran.

---

# Canonical Learning Pipeline

Pipeline resmi Kaifa adalah sebagai berikut.

```text id="ov05"
Learning Activity
        │
produces
        ▼
Activity Result
        │
evaluated using
        ▼
Assessment Blueprint
        │
executed by
        ▼
Assessment Engine
        │
produces
        ▼
Assessment Result
        │
updates
        ▼
Knowledge Profile
        │
drives
        ▼
Learning Decision
        │
consumed by
        ▼
AI Personal Learning Agent
        │
communicates with
        ▼
Learner
```

Pipeline ini menjadi acuan seluruh dokumentasi Kaifa.

---

# Layer Dependency

```text id="ov06"
Foundation
        │
        ▼
Learning Domain
        │
        ▼
Runtime
        │
        ▼
Engine
        │
        ▼
AI Layer
        │
        ▼
Product
```

Dependency hanya berjalan satu arah.

Tidak diperbolehkan adanya circular dependency antar layer.

---

# AI Boundary

AI hanya memiliki hak untuk:

* membaca Learning Decision,
* membaca Knowledge Profile,
* membaca AI Memory,
* membaca Conversation Context,
* menghasilkan respons natural.

AI tidak boleh:

* mengubah Learning Program,
* mengubah Learning Design,
* mengubah Assessment Result,
* mengubah Knowledge Profile,
* menghasilkan Learning Decision sendiri.

Seluruh keputusan pembelajaran tetap berada pada Domain dan Engine.

---

# Architecture Characteristics

Arsitektur Kaifa memiliki karakteristik berikut.

* Modular
* Scalable
* Event-Driven
* Explainable
* Provider Agnostic
* Deterministic
* Extensible
* Enterprise Ready

---

# Documentation Structure

```text id="ov07"
00_foundation/

10_learning_domain/

20_runtime/

30_engine/

40_ai/

50_product/
```

Setiap folder memiliki satu tanggung jawab utama dan menjadi **single source of truth** untuk layer tersebut.

---

# References

Dokumen ini menjadi pintu masuk seluruh dokumentasi Kaifa.

Referensi utama:

* `01_architecture_principles.md`
* `02_glossary.md`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`
* `50_product/*`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk gambaran arsitektur Kaifa.

Dokumen ini tidak mendefinisikan detail implementasi.

Seluruh perubahan terhadap struktur layer, boundary, atau pipeline resmi harus melalui Architecture Review sebelum diterapkan.
