# Architecture Decisions

| Version | Status | Owner                  | Depends On                 | Used By                            | Last Updated |
| ------- | ------ | ---------------------- | -------------------------- | ---------------------------------- | ------------ |
| 2.0     | Freeze | Product & Architecture | Seluruh dokumentasi Kaifa  | Seluruh dokumentasi Kaifa  | 2026-07-04   |

---

# Purpose

Dokumen ini mencatat keputusan-keputusan arsitektur utama (Architecture Decisions) yang membentuk Kaifa v2.

Setiap keputusan menjelaskan:

* konteks,
* keputusan yang diambil,
* alasan,
* konsekuensi.

Dokumen ini tidak mendefinisikan ulang arsitektur, tetapi menjelaskan alasan di balik desain yang telah dibekukan.

---

# AD-001 — Layered Architecture

## Context

Kaifa merupakan platform pembelajaran yang akan terus berkembang dengan fitur, engine, dan AI baru.

## Decision

Arsitektur dibagi menjadi enam layer:

```text
Foundation
↓
Learning Domain
↓
Runtime
↓
Engine
↓
AI Layer
↓
Product
```

## Rationale

* Memisahkan tanggung jawab setiap layer.
* Mengurangi coupling.
* Mempermudah pengembangan dan pengujian.

## Consequences

Perubahan pada satu layer tidak boleh memaksa perubahan besar pada layer lain.

---

# AD-002 — Domain Owns Business Rules

## Context

Business rule tidak boleh tersebar di banyak komponen.

## Decision

Seluruh business rule pembelajaran dimiliki oleh Learning Domain.

## Rationale

* Konsistensi aturan.
* Single source of truth.
* Mudah diuji.

## Consequences

Runtime, Engine, dan AI tidak boleh mendefinisikan business rule baru.

---

# AD-003 — Runtime Is Event-Driven

## Context

Pembelajaran terdiri dari rangkaian proses yang saling bergantung.

## Decision

Runtime menggunakan State Machine dan Event Model sebagai mekanisme koordinasi.

## Rationale

* Loose coupling.
* Mudah diobservasi.
* Mudah diperluas.

## Consequences

Engine dipicu oleh event, bukan saling memanggil secara langsung.

---

# AD-004 — Assessment Blueprint and Assessment Engine Are Separate

## Context

Aturan evaluasi dan proses evaluasi memiliki tanggung jawab yang berbeda.

## Decision

Assessment Blueprint menjadi domain yang mendefinisikan aturan evaluasi.

Assessment Engine hanya mengeksekusi blueprint tersebut.

## Rationale

* Business rule tetap berada di Domain.
* Engine tetap generik.
* Mendukung berbagai strategi evaluasi.

## Consequences

Perubahan strategi evaluasi tidak memerlukan perubahan pada Assessment Engine.

---

# AD-005 — Canonical Learning Pipeline

## Context

Seluruh komponen membutuhkan alur pembelajaran yang konsisten.

## Decision

Pipeline resmi Kaifa adalah:

```text
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
```

## Rationale

* Menghilangkan ambiguitas.
* Menjelaskan ownership setiap output.
* Menjadi acuan seluruh dokumentasi.

## Consequences

Istilah lama seperti **Learning Evidence** tidak lagi digunakan.

---

# AD-006 — AI Does Not Make Learning Decisions

## Context

AI semakin mampu memberikan rekomendasi, tetapi keputusan pembelajaran harus tetap konsisten dan dapat diaudit.

## Decision

Learning Decision hanya dihasilkan oleh Recommendation Engine.

AI hanya mengonsumsi Learning Decision.

## Rationale

* Deterministic.
* Explainable.
* Mudah diaudit.
* Menghindari ketergantungan pada model AI tertentu.

## Consequences

AI tidak boleh mengubah jalur belajar maupun business rule.

---

# AD-007 — Knowledge Profile Is Not AI Memory

## Context

Data akademik dan memori percakapan memiliki karakteristik yang berbeda.

## Decision

Knowledge Profile dan AI Memory dipisahkan.

## Rationale

* Memisahkan business data dari conversational context.
* Mempermudah governance.
* Mengurangi risiko penyalahgunaan data.

## Consequences

AI Memory hanya digunakan untuk personalisasi percakapan.

Knowledge Profile tetap menjadi sumber kebenaran kemampuan learner.

---

# AD-008 — AI Provider Agnostic

## Context

Teknologi AI berkembang sangat cepat.

## Decision

Seluruh integrasi AI dilakukan melalui AI Provider Gateway.

## Rationale

* Menghindari vendor lock-in.
* Mempermudah pergantian provider.
* Mendukung multi-provider.

## Consequences

AI Layer tidak terhubung langsung ke provider tertentu.

---

# AD-009 — AI as Experience Layer

## Context

AI berperan meningkatkan pengalaman belajar.

## Decision

AI ditempatkan sebagai experience layer di atas Engine.

## Rationale

* Business tetap deterministik.
* AI dapat berkembang tanpa mengubah fondasi.

## Consequences

Apabila AI tidak tersedia, proses pembelajaran inti tetap berjalan.

---

# AD-010 — Documentation as Single Source of Truth

## Context

Dokumentasi menjadi acuan lintas tim.

## Decision

Setiap domain memiliki satu dokumen utama yang menjadi referensi resmi.

## Rationale

* Menghindari duplikasi.
* Mempermudah pemeliharaan.
* Menjaga konsistensi.

## Consequences

Perubahan definisi harus dilakukan pada dokumen pemilik, bukan disalin ke dokumen lain.

---

# Decision Principles

Seluruh keputusan arsitektur baru harus memenuhi prinsip berikut:

* Tidak melanggar Layer Dependency.
* Tidak menciptakan Circular Dependency.
* Tidak memindahkan Business Rule ke Runtime, Engine, atau AI.
* Menjaga Canonical Learning Pipeline.
* Menjaga konsistensi dengan Glossary.
* Menjaga kompatibilitas terhadap dokumentasi yang telah dibekukan.

---

# When to Create a New Architecture Decision

Tambahkan keputusan baru apabila:

* memperkenalkan layer baru,
* mengubah dependency antar layer,
* mengubah ownership suatu domain,
* mengubah pipeline resmi,
* mengubah prinsip AI,
* mengubah strategi integrasi utama.

Perubahan kecil pada implementasi tidak memerlukan Architecture Decision baru.

---

# References

Dokumen ini melengkapi seluruh dokumentasi arsitektur:

* `00_foundation/00_overview.md`
* `01_architecture_principles.md`
* `02_glossary.md`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`
* `50_product/*`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk keputusan arsitektur Kaifa.

Dokumen ini tidak menggantikan dokumentasi arsitektur, tetapi menjelaskan alasan di balik keputusan yang telah diambil.

Setiap keputusan baru harus memiliki konteks, keputusan, alasan, dan konsekuensi yang jelas agar evolusi arsitektur tetap terarah dan dapat dipahami oleh seluruh tim.
