# AI Personal Learning Agent

| Version | Status | Owner | Depends On | Used By | Last Updated |
|---------|--------|-------|------------|---------|--------------|
| 2.0 | Freeze | AI Layer | `40_ai_architecture.md`, `41_ai_provider_integration.md`, `42_ai_memory.md`, `22_content_model.md`, `32_recommendation_engine.md` | `44_ai_governance.md`, `52_prd.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **AI Personal Learning Agent**, yaitu komponen utama pada **AI Experience Layer** yang bertanggung jawab mengorkestrasi pengalaman belajar personal, kontekstual, dan interaktif bagi learner.

AI Personal Learning Agent berperan sebagai **Learning Experience Orchestrator**. Agent menyusun konteks dari berbagai sumber resmi Kaifa, memilih capability AI yang sesuai, memanggil AI Provider Gateway, lalu menghasilkan **AI Conversation Experience** untuk learner.

AI Personal Learning Agent tidak menjadi pemilik business rule, tidak menghasilkan Learning Decision, tidak menghitung Assessment Result, dan tidak memperbarui Knowledge Profile.

---

# Scope

## In Scope

Dokumen ini membahas:

- definisi AI Personal Learning Agent,
- tanggung jawab Agent,
- context assembly,
- capability model,
- AI Conversation Experience,
- conversation lifecycle,
- interaction flow,
- AI boundaries,
- ownership,
- future extension.

## Out of Scope

Dokumen ini tidak membahas:

- business rule pembelajaran,
- Recommendation Engine,
- Assessment Engine,
- Knowledge Profile Engine,
- AI Provider implementation,
- prompt engineering detail,
- model training,
- database schema,
- API contract,
- UI design.

Topik tersebut didefinisikan pada dokumen masing-masing.

---

# Definition

**AI Personal Learning Agent** adalah orchestrator AI yang mengubah konteks pembelajaran resmi Kaifa menjadi pengalaman percakapan yang natural, personal, dan membantu learner.

Agent menerima konteks dari:

- **Learning Decision**,
- **Knowledge Profile**,
- **Learning Content**,
- **AI Memory**,
- **Conversation Context**,
- **Learning Context**.

Agent kemudian menghasilkan **AI Conversation Experience**.

AI Conversation Experience adalah pengalaman belajar interaktif yang dihasilkan oleh AI Personal Learning Agent. Experience ini dapat berupa tutoring, coaching, explanation, reflection, speaking practice, guided practice, atau percakapan pembelajaran lainnya.

AI Conversation Experience bukan Learning Content, bukan Learning Decision, dan bukan Assessment Result.

---

# Architecture Position

AI Personal Learning Agent berada di dalam **AI Experience Layer**, di atas Engine Layer.

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
AI Experience Layer
        │
        ▼
AI Personal Learning Agent
        │
creates
        ▼
AI Conversation Experience
        │
delivered to
        ▼
Learner
```

Agent tidak boleh mengambil alih tanggung jawab Domain, Runtime, maupun Engine.

---

# Responsibilities

AI Personal Learning Agent bertanggung jawab untuk:

1. **Context Assembly**  
   Menyusun konteks yang relevan dari Learning Decision, Knowledge Profile, Learning Content, AI Memory, Conversation Context, dan Learning Context.

2. **Capability Selection**  
   Menentukan jenis capability AI yang dibutuhkan untuk menjawab kebutuhan learner.

3. **Conversation Management**  
   Mengelola alur percakapan agar tetap konsisten, natural, dan relevan dengan konteks pembelajaran.

4. **Provider Orchestration**  
   Memanggil AI Provider Gateway untuk menggunakan provider AI yang sesuai.

5. **Experience Generation**  
   Menghasilkan AI Conversation Experience yang membantu learner memahami, berlatih, merefleksikan, atau melanjutkan proses belajar.

6. **Personalization**  
   Menyesuaikan gaya komunikasi berdasarkan AI Memory dan preferensi learner.

7. **Explanation**  
   Menjelaskan Learning Decision, Assessment Result, atau Knowledge Profile dengan bahasa yang mudah dipahami learner.

Agent tidak bertanggung jawab untuk:

- menghasilkan Learning Decision,
- menghitung Assessment Result,
- memperbarui Knowledge Profile,
- mengubah Assessment Blueprint,
- mengubah Learning Content resmi,
- mengubah business rule,
- menentukan mastery.

---

# Input Context

AI Personal Learning Agent menggunakan konteks berikut.

| Context | Owner | Access | Purpose |
|---------|-------|--------|---------|
| Learning Decision | Recommendation Engine | Read | Mengetahui langkah belajar berikutnya. |
| Knowledge Profile | Knowledge Profile Engine | Read | Memahami kondisi penguasaan learner. |
| Learning Content | Content Model | Read | Memberikan penjelasan berdasarkan konten resmi. |
| AI Memory | AI Memory | Read / Write | Menyimpan dan mengambil preferensi percakapan learner. |
| Conversation Context | AI Memory / Session | Read / Write | Menjaga kesinambungan percakapan. |
| Learning Context | Runtime | Read | Mengetahui konteks aktivitas atau sesi belajar saat ini. |
| Assessment Result | Assessment Engine | Read | Menjelaskan hasil evaluasi kepada learner. |

Semua business context dibaca sebagai sumber resmi dan tidak boleh dimodifikasi langsung oleh Agent.

---

# Output

Output utama AI Personal Learning Agent adalah:

| Output | Description |
|--------|-------------|
| AI Conversation Experience | Pengalaman percakapan belajar yang personal dan kontekstual. |
| Natural Response | Respons natural yang diberikan kepada learner. |
| Explanation | Penjelasan terhadap materi, Learning Decision, atau Assessment Result. |
| Guidance | Arahan belajar yang mengikuti Learning Decision. |
| Coaching | Dukungan motivasi dan strategi belajar. |
| Reflection Prompt | Pertanyaan reflektif untuk membantu learner memahami proses belajar. |
| Temporary Practice | Latihan tambahan sementara yang tidak menggantikan Learning Content resmi. |
| Memory Candidate | Kandidat informasi yang dapat disimpan sebagai AI Memory sesuai governance. |

Agent tidak menghasilkan:

- Learning Decision,
- Assessment Result,
- Knowledge Profile,
- Domain Event resmi,
- business state resmi.

---

# Capability Model

AI Personal Learning Agent memiliki beberapa capability.

## Tutor Capability

Membantu learner memahami konsep, materi, atau Learning Content.

Contoh:

- menjelaskan materi,
- memberikan analogi,
- memberikan contoh,
- menjawab pertanyaan learner.

---

## Coach Capability

Membantu learner membangun motivasi, strategi belajar, dan kebiasaan belajar.

Contoh:

- memberi dorongan,
- menyarankan cara belajar,
- membantu learner tetap fokus.

Coach Capability tidak boleh mengubah Learning Decision.

---

## Practice Partner Capability

Membantu learner berlatih secara interaktif.

Contoh:

- speaking practice,
- writing practice,
- interview simulation,
- vocabulary practice,
- role-play conversation.

Practice Partner dapat membuat latihan sementara, tetapi tidak menggantikan Assessment Blueprint atau Learning Content resmi.

---

## Explanation Capability

Menjelaskan keputusan atau hasil yang berasal dari Engine.

Contoh:

- menjelaskan mengapa learner diminta review module,
- menjelaskan Assessment Result,
- menjelaskan kelemahan berdasarkan Knowledge Profile.

Penjelasan harus tetap mengikuti data resmi dari Engine.

---

## Reflection Capability

Mendorong learner melakukan refleksi terhadap proses belajar.

Contoh:

- "Apa bagian yang paling sulit?"
- "Coba jelaskan ulang dengan kata-katamu sendiri."
- "Apa strategi yang ingin kamu coba berikutnya?"

---

## Socratic Capability

Memandu learner melalui pertanyaan bertahap agar learner menemukan pemahaman sendiri.

Capability ini cocok untuk concept learning, problem solving, dan reasoning.

---

## Feedback Support Capability

Memberikan feedback pendukung berdasarkan Assessment Result atau Activity Result yang sudah diproses oleh sistem.

Feedback ini tidak menggantikan Assessment Result resmi.

---

# AI Conversation Experience

**AI Conversation Experience** adalah pengalaman percakapan yang dihasilkan Agent untuk learner.

AI Conversation Experience dapat berupa:

| Experience Type | Description |
|-----------------|-------------|
| Tutor Conversation | Percakapan untuk memahami materi. |
| Coaching Conversation | Percakapan motivasi dan strategi belajar. |
| Reflection Conversation | Percakapan reflektif setelah aktivitas atau assessment. |
| Speaking Practice | Latihan berbicara interaktif. |
| Writing Support | Bantuan memahami dan memperbaiki tulisan. |
| Interview Practice | Simulasi wawancara atau speaking test. |
| Socratic Dialogue | Dialog berbasis pertanyaan bertahap. |
| Guided Practice | Latihan bertahap sesuai Learning Decision. |
| Explanation Session | Penjelasan hasil Assessment atau rekomendasi belajar. |

AI Conversation Experience bukan:

- Learning Content,
- Learning Activity,
- Assessment Result,
- Learning Decision,
- Knowledge Profile.

---

# Context Assembly

Sebelum menghasilkan respons, Agent menyusun **AI Context**.

```text
User Message
        │
        ▼
Retrieve Conversation Context
        │
        ▼
Retrieve AI Memory
        │
        ▼
Retrieve Learning Decision
        │
        ▼
Retrieve Knowledge Profile
        │
        ▼
Retrieve Learning Content
        │
        ▼
Compose AI Context
        │
        ▼
Generate AI Conversation Experience
```

Context Assembly harus mengikuti prinsip:

- hanya mengambil data yang relevan,
- menghormati data minimization,
- tidak mengubah business data,
- tidak mencampur AI Memory dengan Knowledge Profile,
- tidak menggunakan istilah atau konsep di luar Glossary.

---

# Experience Flow

```text
Learner
        │
asks / responds
        ▼
AI Personal Learning Agent
        │
retrieves
        ├── Learning Decision
        ├── Knowledge Profile
        ├── Learning Content
        ├── AI Memory
        ├── Conversation Context
        └── Learning Context
        │
composes
        ▼
AI Context
        │
calls
        ▼
AI Provider Gateway
        │
routes to
        ▼
AI Provider
        │
returns
        ▼
AI Response
        │
processed by
        ▼
AI Personal Learning Agent
        │
creates
        ▼
AI Conversation Experience
        │
delivers
        ▼
Learner
```

---

# Conversation Lifecycle

```text
Conversation Started
        │
        ▼
Context Retrieved
        │
        ▼
AI Context Composed
        │
        ▼
Provider Invoked
        │
        ▼
Response Generated
        │
        ▼
Governance Applied
        │
        ▼
Response Delivered
        │
        ▼
Memory Candidate Evaluated
        │
        ▼
Conversation Continued / Ended
```

Lifecycle ini hanya berlaku pada percakapan AI. Lifecycle ini tidak mengubah state pembelajaran resmi yang didefinisikan dalam State Machine.

---

# Boundaries

## Agent May

AI Personal Learning Agent boleh:

- membaca Learning Decision,
- membaca Knowledge Profile,
- membaca Learning Content,
- membaca Assessment Result,
- membaca dan menulis AI Memory sesuai governance,
- membaca dan menulis Conversation Context,
- menghasilkan AI Conversation Experience,
- menjelaskan keputusan atau hasil dari Engine,
- memberikan latihan sementara,
- melakukan coaching dan reflection.

## Agent Must Not

AI Personal Learning Agent tidak boleh:

- menghasilkan Learning Decision,
- mengubah Learning Decision,
- menghitung Assessment Result,
- mengubah Assessment Result,
- memperbarui Knowledge Profile,
- mengubah Learning Content resmi,
- mengganti Assessment Blueprint,
- menentukan mastery,
- mengubah business rule,
- menjadi source of truth untuk data akademik.

---

# Relationship with Learning Content

AI Personal Learning Agent dapat menggunakan Learning Content sebagai konteks.

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

AI Conversation Experience bukan Learning Content.

AI dapat membantu menjelaskan Learning Content, tetapi tidak dapat mengubah Learning Content resmi.

---

# Relationship with Learning Decision

Learning Decision dihasilkan oleh Recommendation Engine.

AI Personal Learning Agent hanya mengonsumsi Learning Decision dan menyajikannya kepada learner dalam bentuk percakapan yang natural.

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
AI Conversation Experience
```

---

# Relationship with Knowledge Profile

Knowledge Profile adalah business data yang dimiliki oleh Knowledge Profile Engine.

Agent dapat membaca Knowledge Profile untuk personalisasi, tetapi tidak boleh mengubahnya.

```text
Knowledge Profile Engine
        │
updates
        ▼
Knowledge Profile
        │
read by
        ▼
AI Personal Learning Agent
```

---

# Relationship with AI Memory

AI Memory menyimpan konteks percakapan dan preferensi learner.

AI Memory bukan Knowledge Profile.

```text
AI Memory
        │
provides
        ▼
Personalization Context
        │
used by
        ▼
AI Personal Learning Agent
```

Agent dapat mengusulkan Memory Candidate, tetapi penyimpanan memori harus mengikuti AI Governance.

---

# Relationship with AI Provider Gateway

Agent tidak memanggil provider secara langsung.

Semua pemanggilan AI dilakukan melalui AI Provider Gateway.

```text
AI Personal Learning Agent
        │
calls
        ▼
AI Provider Gateway
        │
routes to
        ▼
AI Provider
```

Gateway bertanggung jawab terhadap routing, fallback, observability, dan provider abstraction.

---

# Ownership

| Concept | Owner | Layer |
|---------|-------|-------|
| AI Personal Learning Agent | AI Layer | AI Experience Layer |
| AI Conversation Experience | AI Personal Learning Agent | AI Experience Layer |
| AI Memory | AI Memory | AI Experience Layer |
| Learning Decision | Recommendation Engine | Engine |
| Knowledge Profile | Knowledge Profile Engine | Engine |
| Assessment Result | Assessment Engine | Engine |
| Learning Content | Content Model | Runtime / Learning Domain |
| AI Provider Gateway | AI Provider Integration | AI Experience Layer |
| Conversation Context | AI Memory / Agent | AI Experience Layer |

---

# Governance Requirements

Agent harus mengikuti AI Governance.

Governance berlaku pada:

- data access,
- context selection,
- prompt composition,
- provider invocation,
- response filtering,
- memory update,
- audit logging.

AI Personal Learning Agent tidak boleh mengabaikan governance policy.

---

# Failure Handling

Agent harus menangani kondisi berikut.

| Failure | Expected Behaviour |
|---------|-------------------|
| AI Provider unavailable | Gunakan fallback provider atau tampilkan respons aman. |
| Learning Decision unavailable | Jangan membuat keputusan sendiri; minta sistem menyelesaikan rekomendasi. |
| Knowledge Profile unavailable | Berikan respons umum tanpa mengklaim kondisi learner. |
| Learning Content unavailable | Hindari menjawab seolah-olah content tersedia. |
| AI Memory unavailable | Lanjutkan percakapan tanpa personalisasi berbasis memory. |
| Governance violation | Tolak atau ubah respons sesuai policy. |

---

# Observability

AI Personal Learning Agent harus mendukung observability untuk:

- conversation request,
- context retrieval,
- provider call,
- response latency,
- error rate,
- fallback usage,
- memory update,
- governance decision,
- user feedback.

Observability tidak boleh mengekspos data sensitif secara tidak perlu.

---

# Future Extension

AI Personal Learning Agent dapat diperluas menjadi berbagai experience tanpa mengubah arsitektur inti.

```text
AI Personal Learning Agent
        │
        ├── Text Tutor
        ├── Voice Tutor
        ├── Avatar Tutor
        ├── Speaking Partner
        ├── Writing Coach
        ├── Interview Simulator
        ├── Debate Partner
        ├── Reflection Coach
        └── Learning Mentor
```

Extension tersebut tetap harus:

- mengonsumsi Learning Decision,
- membaca Knowledge Profile secara read-only,
- mengikuti AI Governance,
- menggunakan AI Provider Gateway,
- tidak mengambil alih business rule.

---

# References

- `22_content_model.md`
- `32_recommendation_engine.md`
- `40_ai_architecture.md`
- `41_ai_provider_integration.md`
- `42_ai_memory.md`
- `44_ai_governance.md`
- `02_glossary.md`
- `99_architecture_decisions.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk **AI Personal Learning Agent**.

Dokumen lain tidak boleh mendefinisikan ulang:

- tanggung jawab AI Personal Learning Agent,
- AI Conversation Experience,
- context assembly,
- conversation lifecycle,
- boundaries Agent,
- relationship antara Agent, Learning Decision, Knowledge Profile, Learning Content, dan AI Memory.

Perubahan terhadap dokumen ini harus menjaga prinsip:

- AI tidak menghasilkan Learning Decision,
- AI tidak memperbarui Knowledge Profile,
- AI tidak menghasilkan Assessment Result,
- AI Conversation Experience bukan Learning Content,
- Agent berfungsi sebagai Learning Experience Orchestrator.
