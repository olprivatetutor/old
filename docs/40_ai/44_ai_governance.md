# AI Governance

| Version | Status | Owner | Depends On | Used By | Last Updated |
|---------|--------|-------|------------|---------|--------------|
| 2.0 | Freeze | AI Layer | `40_ai_architecture.md`, `41_ai_provider_integration.md`, `42_ai_memory.md`, `43_ai_personal_learning_agent.md` | `52_prd.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **AI Governance Framework** sebagai kebijakan resmi penggunaan Artificial Intelligence pada Kaifa.

AI Governance memastikan bahwa seluruh kemampuan AI tetap:

- aman,
- dapat dijelaskan,
- dapat diaudit,
- konsisten dengan business rule,
- tidak mengambil alih keputusan bisnis.

Dokumen ini menjadi **single source of truth** mengenai batas kewenangan AI.

---

# Scope

## In Scope

- AI Decision Boundary
- AI Conversation Governance
- AI Provider Governance
- AI Memory Governance
- Prompt Governance
- Privacy
- Security
- Explainability
- Auditability
- Risk Management

## Out of Scope

- Learning Rule
- Assessment Logic
- Recommendation Algorithm
- Knowledge Profile Calculation
- Runtime State

Topik tersebut dimiliki oleh Learning Domain, Runtime, dan Engine.

---

# Governance Principles

Seluruh implementasi AI harus mengikuti prinsip berikut.

## Human-Centered AI

AI membantu learner.

AI tidak menggantikan educator.

---

## Business Rule Separation

Business Rule tetap dimiliki Learning Domain.

AI tidak boleh membuat Business Rule baru.

---

## Deterministic Learning

Learning Decision tetap dihasilkan Recommendation Engine.

AI hanya mengonsumsi keputusan tersebut.

---

## Explainability

Seluruh respons AI harus dapat dijelaskan berdasarkan business context.

AI tidak boleh menghasilkan keputusan yang tidak memiliki dasar.

---

## Transparency

Learner harus mengetahui bahwa respons berasal dari AI.

---

## Accountability

Seluruh penggunaan AI harus dapat diaudit.

---

## Privacy by Design

AI hanya menggunakan data yang diperlukan.

---

## Provider Agnostic

AI Governance berlaku untuk seluruh AI Provider.

---

# AI Authority Matrix

| Capability | Allowed |
|------------|---------|
| Explain Learning Content | ✅ |
| Answer Questions | ✅ |
| Generate Examples | ✅ |
| Generate Analogies | ✅ |
| Guided Practice | ✅ |
| Socratic Dialogue | ✅ |
| Motivation | ✅ |
| Reflection | ✅ |
| Coaching | ✅ |
| Summarization | ✅ |
| Generate Learning Decision | ❌ |
| Modify Knowledge Profile | ❌ |
| Modify Assessment Result | ❌ |
| Modify Learning Content | ❌ |
| Modify Learning Program | ❌ |
| Override Business Rule | ❌ |

---

# AI Conversation Governance

AI Conversation Experience merupakan output resmi AI Layer.

AI Conversation harus selalu berdasarkan:

- Learning Decision
- Knowledge Profile
- Learning Content
- AI Memory
- Conversation Context

AI Conversation tidak boleh bertentangan dengan Learning Decision.

---

# AI Context Hierarchy

Urutan prioritas context adalah sebagai berikut.

```text
Learning Decision
        │
Knowledge Profile
        │
Learning Content
        │
Conversation Context
        │
AI Memory
```

Apabila terjadi konflik:

1. Learning Decision memiliki prioritas tertinggi.
2. Knowledge Profile menjadi referensi learner state.
3. Learning Content menjadi sumber materi resmi.
4. Conversation Context mempertahankan alur dialog.
5. AI Memory digunakan untuk personalisasi.

---

# Prompt Governance

Prompt digunakan untuk:

- komunikasi,
- gaya bahasa,
- personalisasi.

Prompt tidak boleh digunakan untuk:

- mengubah Business Rule,
- mengubah Learning Decision,
- mengubah Assessment Result.

---

# AI Provider Governance

Seluruh provider harus diakses melalui AI Provider Gateway.

Provider tidak boleh diakses secara langsung oleh Application.

Tujuan:

- Provider Agnostic
- Vendor Independence
- Centralized Security
- Centralized Monitoring

---

# AI Memory Governance

AI Memory hanya menyimpan:

- Conversation History
- Preference
- Interaction Pattern
- Session Context

AI Memory bukan sumber kebenaran Knowledge Profile.

Knowledge Profile tetap dimiliki Engine.

---

# AI Conversation Experience Governance

AI Conversation Experience harus:

- relevan terhadap Learning Objective,
- sesuai Learning Decision,
- sesuai Learning Content,
- sesuai Knowledge Profile,
- adaptif terhadap learner.

AI Conversation Experience bukan Learning Content.

AI Conversation Experience bukan Business Object.

---

# Safety & Security

Seluruh AI Provider harus memenuhi:

- Authentication
- Authorization
- Encryption
- Rate Limiting
- Monitoring
- Logging

Prompt Injection harus dicegah.

Sensitive Data harus disanitasi sebelum dikirim ke AI Provider.

---

# Privacy

AI hanya boleh menggunakan data yang telah diizinkan.

Data pribadi learner harus mengikuti kebijakan privasi platform.

Conversation History tidak boleh digunakan di luar kebutuhan pembelajaran tanpa persetujuan.

---

# Explainability

AI harus mampu menjelaskan alasan responsnya berdasarkan:

- Learning Content
- Learning Decision
- Knowledge Profile

AI tidak boleh memberikan jawaban yang bertentangan dengan Business Context.

---

# Auditability

Seluruh interaksi AI harus dapat ditelusuri.

Minimal mencatat:

- Timestamp
- Provider
- Prompt Version
- Model
- Context Source
- Response ID
- Token Usage
- Error

---

# Failure Handling

Apabila AI Provider gagal:

```text
AI Provider Failure
        │
        ▼
Fallback
        │
        ▼
Learning Decision tetap digunakan
        │
        ▼
Learning tetap berjalan
```

Kegagalan AI tidak boleh menghentikan proses pembelajaran.

---

# Risk Matrix

| Risk | Mitigation |
|------|------------|
| Hallucination | Business Context |
| Wrong Recommendation | Recommendation Engine |
| Wrong Assessment | Assessment Engine |
| Privacy Leakage | AI Memory Governance |
| Prompt Injection | Prompt Validation |
| Provider Failure | Fallback Strategy |
| Vendor Lock-in | AI Provider Gateway |

---

# Relationship with Architecture Decisions

AI Governance mengimplementasikan keputusan berikut.

- AD-006 — AI Does Not Make Learning Decisions
- AD-007 — Knowledge Profile Is Not AI Memory
- AD-008 — AI Provider Agnostic
- AD-009 — AI as Experience Layer

---

# Governance Flow

```text
Learning Decision
        │
Knowledge Profile
        │
Learning Content
        │
Conversation Context
        │
AI Memory
        │
        ▼
AI Personal Learning Agent
        │
Governed by
        ▼
AI Governance
        │
creates
        ▼
AI Conversation Experience
        │
        ▼
Learner
```

---

# Future Extension

Framework ini mendukung pengembangan:

- Voice Tutor
- AI Coach
- AI Mentor
- Speaking Practice
- Interview Simulator
- Debate Partner
- Avatar Tutor

tanpa mengubah Governance Principles.

---

# References

- `40_ai_architecture.md`
- `41_ai_provider_integration.md`
- `42_ai_memory.md`
- `43_ai_personal_learning_agent.md`
- `22_content_model.md`
- `02_glossary.md`
- `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk seluruh kebijakan AI pada Kaifa.

Seluruh implementasi AI wajib mematuhi prinsip-prinsip pada dokumen ini.

Perubahan terhadap AI Governance harus tetap menjaga:

- Business Rule Separation
- AI as Experience Layer
- Provider Agnostic
- Explainability
- Auditability
- Privacy by Design
- Canonical Learning Pipeline