# Kaifa Architecture Principles

| Version | Status | Owner      | Depends On     | Used By       | Last Updated |
|---------|--------|------------|----------------|---------------|--------------|
| 2.0     | Freeze | Foundation | `00_overview.md` | Semua dokumen | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan prinsip-prinsip dasar (Architecture Principles) yang menjadi pedoman dalam perancangan, pengembangan, dan evolusi arsitektur Kaifa.

Seluruh domain model, engine, AI layer, PRD, maupun implementasi teknis harus mengikuti prinsip-prinsip yang didefinisikan pada dokumen ini.

Dokumen ini **tidak** mendefinisikan business rule maupun domain model. Dokumen ini hanya mendefinisikan aturan arsitektur.

---

# Scope

## In Scope

* Architecture principles
* Dependency rules
* Documentation principles
* Domain boundaries
* Engine boundaries
* AI boundaries
* Naming conventions
* Documentation ownership
* Architecture governance

## Out of Scope

* Business rules
* Learning Program
* Program Structure
* Learning Design
* State definitions
* Event definitions
* AI implementation
* Database design
* API design

---

# Goals

Arsitektur Kaifa dirancang untuk mencapai tujuan berikut:

* Modular dan mudah dikembangkan.
* Mudah dipahami oleh Product, Engineer, dan AI Agent.
* Mendukung berbagai jenis Learning Program tanpa perubahan fundamental.
* Memiliki batas tanggung jawab (boundary) yang jelas.
* Meminimalkan coupling antar domain.
* Memudahkan evolusi fitur tanpa merusak fondasi sistem.
* Menjadi dasar yang stabil untuk PRD dan implementasi.

---

# Principle 1 — Domain-Driven Design

Kaifa menggunakan pendekatan **Domain-Driven Design (DDD)**.

Business capability dimodelkan sebagai domain yang memiliki:

* tanggung jawab yang jelas,
* boundary yang jelas,
* ownership yang jelas.

Setiap domain bertanggung jawab atas business rule miliknya sendiri.

---

# Principle 2 — Single Responsibility

Setiap dokumen, domain, engine, maupun AI capability hanya memiliki **satu tanggung jawab utama**.

Jika sebuah dokumen mulai membahas lebih dari satu domain, maka dokumen tersebut perlu dipecah.

---

# Principle 3 — Single Source of Truth

Setiap konsep bisnis hanya memiliki satu sumber definisi.

Contoh:

| Concept                 | Owner                           |
| ----------------------- | ------------------------------- |
| Architecture            | `00_overview.md`                |
| Architecture Principles | `01_architecture_principles.md` |
| Glossary                | `02_glossary.md`                |
| Learning Program        | `learning_program.md`           |
| Program Structure       | `program_structure.md`          |
| Learning Design         | `learning_design.md`            |
| State                   | `state_machine.md`              |
| Event                   | `event_model.md`                |

Dokumen lain hanya boleh mereferensikan konsep tersebut.

---

# Principle 4 — One Question per Document

Setiap dokumen harus menjawab satu pertanyaan utama.

Contoh:

| Document          | Primary Question                         |
| ----------------- | ---------------------------------------- |
| Learning Program  | Apa itu Learning Program?                |
| Program Structure | Bagaimana Program disusun?               |
| Learning Design   | Bagaimana proses pembelajaran dirancang? |

Dokumen tidak boleh menjawab pertanyaan milik domain lain.

---

# Principle 5 — Clear Ownership

Setiap konsep memiliki satu owner.

Contoh:

* Learning Program memiliki owner `learning_program.md`.
* Learning Module memiliki owner `learning_module.md`.
* Assessment Blueprint memiliki owner `assessment_blueprint.md`.

Business rule hanya boleh didefinisikan oleh owner tersebut.

---

# Principle 6 — Layered Architecture

Kaifa menggunakan layered architecture.

```text
Presentation Layer
        │
Application Layer
        │
Learning Domain
        │
Learning Engine Layer
        │
AI Capability Layer
        │
Infrastructure Layer
```

Setiap layer hanya mengetahui layer yang menjadi tanggung jawabnya.

---

# Principle 7 — Top-down Dependency

Dependency hanya boleh mengalir dari atas ke bawah.

```text
Overview
        │
Learning Program
        │
Program Structure
        │
Learning Design
        │
Learning Module
        │
Learning Objective
        │
Learning Activity
        │
Assessment Blueprint
```

Circular dependency tidak diperbolehkan.

---

# Principle 8 — Domain Before Engine

Engine tidak boleh memiliki business rule.

Business rule berada pada Domain.

Engine hanya menjalankan proses berdasarkan rule yang sudah didefinisikan.

Contoh:

* Assessment Engine mengevaluasi assessment.
* Recommendation Engine menghasilkan rekomendasi.
* Knowledge Profile Engine menghitung mastery.

Engine bukan pemilik domain.

---

# Principle 9 — AI is a Supporting Capability

Artificial Intelligence merupakan capability pendukung.

AI dapat:

* menjelaskan materi,
* memberikan coaching,
* menghasilkan konten,
* memberikan feedback,
* membantu personalisasi.

AI tidak boleh:

* mengubah domain state secara langsung,
* menentukan business rule,
* mengubah mastery tanpa evidence,
* mengubah learning path tanpa melalui engine.

---

# Principle 10 — Event-Driven Collaboration

Komunikasi antar domain dan engine dilakukan menggunakan Domain Event apabila memungkinkan.

Keuntungan:

* loose coupling,
* observability,
* extensibility,
* scalability.

Event didefinisikan pada `event_model.md`.

---

# Principle 11 — State Centralization

Seluruh state sistem didefinisikan pada `state_machine.md`.

Dokumen lain tidak boleh mendefinisikan ulang state.

---

# Principle 12 — Terminology Centralization

Seluruh istilah bisnis didefinisikan pada `02_glossary.md`.

Dokumen lain hanya menggunakan istilah tersebut.

---

# Principle 13 — Documentation First

Architecture menjadi fondasi bagi seluruh artefak berikutnya.

Urutan pengembangan adalah:

```text
Architecture
        │
PRD
        │
Domain Model
        │
Database
        │
API Contract
        │
Backend
        │
Frontend
        │
AI Prompt
        │
Testing
```

Perubahan pada Architecture harus dilakukan sebelum perubahan pada artefak turunannya.

---

# Principle 14 — Backward Compatibility

Perubahan terhadap domain model harus mempertimbangkan kompatibilitas dengan versi sebelumnya.

Breaking changes harus dilakukan melalui versioning yang jelas.

---

# Principle 15 — Extensibility

Penambahan Learning Program, AI Provider, Assessment Strategy, maupun Recommendation Strategy harus dapat dilakukan tanpa mengubah fondasi arsitektur.

Arsitektur harus bersifat **open for extension, closed for modification**.

---

# Architecture Review Checklist

Sebelum sebuah dokumen dinyatakan selesai, lakukan pemeriksaan berikut.

* Apakah purpose sudah jelas?
* Apakah scope sudah jelas?
* Apakah memiliki satu tanggung jawab?
* Apakah ada overlap dengan dokumen lain?
* Apakah memiliki owner yang jelas?
* Apakah dependency hanya satu arah?
* Apakah tidak menimbulkan circular dependency?
* Apakah menggunakan terminology dari Glossary?
* Apakah menggunakan State dari State Machine?
* Apakah menggunakan Event dari Event Model?

Jika seluruh pertanyaan di atas terjawab **Ya**, maka dokumen dianggap memenuhi standar arsitektur Kaifa.

---

# Architecture Freeze Criteria

Arsitektur dapat dinyatakan **Freeze** apabila memenuhi seluruh kondisi berikut:

* Tidak ada overlap antar dokumen.
* Tidak ada circular dependency.
* Semua domain memiliki boundary yang jelas.
* Semua engine memiliki responsibility yang jelas.
* Semua AI capability memiliki boundary yang jelas.
* Seluruh terminology telah dibakukan.
* State Machine telah final.
* Event Model telah final.
* Seluruh dokumen foundation telah disetujui.

Setelah status **Freeze** dicapai, perubahan terhadap arsitektur hanya boleh dilakukan melalui proses architecture review.