# Product Roadmap

| Version | Status | Owner           | Depends On              | Used By                   | Last Updated |
|---------|--------|-----------------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | Product         | `50_user_journey.md`, seluruh baseline architecture      | `52_prd.md` | 2026-07-04   |

---

# Purpose

Dokumen ini mendefinisikan roadmap pengembangan Kaifa berdasarkan arsitektur yang telah dibekukan.

Roadmap bertujuan untuk:

* Menentukan urutan implementasi yang memiliki risiko paling rendah.
* Memberikan prioritas berdasarkan nilai bisnis.
* Menjadi acuan penyusunan Product Requirement Document (PRD).
* Menjadi dasar perencanaan engineering dan delivery.

Roadmap ini merupakan roadmap produk, bukan roadmap teknis.

---

# Product Vision

Kaifa adalah AI-Native Learning Platform yang menyediakan pengalaman belajar yang personal, adaptif, dan dapat diterapkan pada berbagai jenis program pembelajaran, seperti:

* Kurikulum Nasional
* TOEFL Preparation
* IELTS Preparation
* Bahasa Arab
* Program Sertifikasi
* Program Kustom

---

# Roadmap Principles

Seluruh roadmap mengikuti prinsip berikut:

* Business Value First
* Stable Architecture
* Incremental Delivery
* AI as Enhancement
* Backward Compatibility
* Measurable Outcomes

---

# Phase 1 — Foundation Platform (MVP)

## Objective

Menyediakan platform pembelajaran yang dapat digunakan end-to-end.

### Capability

* Landing Page
* Authentication
* User Profile
* Program Discovery
* MVP Basic Learner Authentication
* Learning Program
* Program Structure
* Learning Module
* Learning Activity
* Content Delivery
* Assessment
* Dashboard Dasar
* Placement Test
* AI Conversation Practice yang assessable
* Voice, Speech-to-Text (STT), dan Text-to-Speech (TTS)

> Catatan: Formal Enrollment tetap merupakan Open Issue sampai memiliki domain owner dan business rule yang didukung arsitektur. MVP tidak mengasumsikan implementasi Enrollment formal.

### Deliverables

* Learner dapat mengikuti program pembelajaran.
* Informasi progres learner yang diperlukan untuk learner experience dan reporting MVP dapat dicatat.
* Assessment berjalan.
* Placement Test dan AI Conversation Practice yang assessable berjalan melalui Assessment Engine.
* Kapabilitas voice, STT, dan TTS tersedia untuk AI Conversation Practice.
* Assessment Result dapat disajikan kepada learner. Pencatatan progres dasar MVP bukan implementasi Knowledge Profile Engine, tidak memelihara competency mastery modeling, dan tidak menghasilkan adaptive Learning Decision. Full Knowledge Profile computation, mastery modeling, dan Recommendation Engine tetap berada pada Phase 2.

### Success Criteria

* End-to-end learning flow berjalan.
* Satu program pembelajaran dapat diselesaikan.

---

# Phase 2 — Adaptive Learning

## Objective

Mengaktifkan personalisasi pembelajaran berbasis engine.

### Capability

* Knowledge Profile Engine
* Recommendation Engine
* Learning Decision
* Adaptive Learning Flow
* Progress Analytics

### Deliverables

* Rekomendasi belajar otomatis.
* Jalur belajar mulai adaptif.

### Success Criteria

* Learning Decision dihasilkan secara konsisten.
* Personalisasi berjalan tanpa AI.

---

# Phase 3 — AI Learning Companion

## Objective

Menghadirkan pengalaman belajar berbasis AI.

### Capability

* AI Personal Learning Agent
* AI Memory
* Multi AI Provider
* AI Explanation
* AI Tutor
* AI Conversation
* AI Feedback

### Deliverables

* Tutor AI personal.
* Penjelasan materi.
* Penjelasan hasil assessment.
* Motivasi belajar.

### Success Criteria

* AI mengikuti Learning Decision.
* AI tidak mengambil business decision.

---

# Phase 4 — Educator Platform

## Objective

Menyediakan kemampuan untuk educator.

### Capability

* Class Management
* Learner Monitoring
* Manual Assessment
* Feedback
* Assignment Review
* Learning Analytics
* Intervention Support

### Deliverables

* Educator dapat memantau learner.
* Feedback manual tersedia.

---

# Phase 5 — Parent Experience

## Objective

Memberikan visibilitas kepada orang tua.

### Capability

* Parent Dashboard
* Progress Monitoring
* Notification
* Achievement Tracking
* Learning Summary

---

# Phase 6 — Enterprise & Institution

## Objective

Mendukung kebutuhan organisasi.

### Capability

* Multi Organization
* Multi School
* Tenant Management
* Role Management
* Audit Log
* SSO
* API Integration
* Reporting
* Compliance

---

# Phase 7 — AI Ecosystem

## Objective

Mengembangkan AI sebagai platform yang dapat diperluas.

### Capability

* AI Plugin
* AI Workflow
* AI Coach
* AI Content Assistant
* AI Evaluation Assistant
* AI Insights
* Model Routing
* Offline AI Support

---

# Cross-Cutting Capabilities

Capability berikut dikembangkan secara bertahap di seluruh fase.

* Security
* Privacy
* Observability
* Monitoring
* Analytics
* Localization
* Accessibility
* Performance
* Cost Optimization
* Disaster Recovery

---

# Release Strategy

## MVP

Fokus pada:

* Foundation Platform
* Placement Test
* AI Conversation Practice yang assessable dengan Voice/STT/TTS

Target:

Membuktikan bahwa Kaifa mampu menjalankan pembelajaran end-to-end dengan assessment, Placement Test, dan AI Conversation Practice yang assessable. Full adaptive learning tetap Phase 2.

---

## General Availability (GA)

Fokus pada:

* AI Learning Companion
* Educator Platform

Target:

Menyediakan pengalaman belajar yang siap digunakan secara luas.

---

## Enterprise

Fokus pada:

* Multi Organization
* Integrasi Enterprise
* Governance
* Advanced Analytics

Target:

Mendukung institusi pendidikan, pelatihan, dan organisasi berskala besar.

---

# Dependencies

```text
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
Adaptive Learning
        │
        ▼
AI Learning Companion
        │
        ▼
Educator Platform
        │
        ▼
Enterprise Platform
```

Tidak ada fase yang boleh melompati dependensi arsitektur.

---

# Success Metrics

Keberhasilan roadmap diukur melalui:

## Product

* Program Completion Rate
* Learning Retention
* Active Learners
* Time to Complete Program
* Learner Satisfaction

## AI

* AI Adoption Rate
* AI Helpfulness Score
* Recommendation Acceptance Rate
* AI Response Quality

## Business

* Enrollment Growth
* Organization Adoption
* Revenue Growth
* Customer Retention

---

# Risks

Risiko utama yang harus dikelola:

| Risk                 | Mitigation                                       |
| -------------------- | ------------------------------------------------ |
| Perubahan kurikulum  | Program Structure yang fleksibel                 |
| Vendor AI berubah    | AI Provider Gateway                              |
| Pertumbuhan pengguna | Arsitektur event-driven dan modular              |
| Biaya AI meningkat   | Model routing, caching, dan optimasi token       |
| Evolusi fitur        | Menjaga boundary Domain, Runtime, Engine, dan AI |

---

# Relationship with PRD

Roadmap menjadi dasar penyusunan PRD.

Setiap fitur dalam PRD harus:

* Berasal dari User Journey.
* Memiliki fase roadmap.
* Memiliki prioritas implementasi.
* Dapat ditelusuri ke capability yang didefinisikan pada roadmap.

---

# References

* `50_user_journey.md`
* `00_foundation/*`
* `10_learning_domain/*`
* `20_runtime/*`
* `30_engine/*`
* `40_ai/*`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk roadmap pengembangan produk Kaifa.

Perubahan roadmap harus mempertimbangkan:

* konsistensi dengan arsitektur,
* prioritas bisnis,
* kapasitas engineering,
* nilai bagi pengguna.

Roadmap tidak boleh mengubah arsitektur yang telah dibekukan tanpa melalui architecture review.
