# State Machine

| Version | Status | Owner    | Depends On              | Used By                   | Last Updated |
|---------|--------|----------|-------------------------|---------------------------|--------------|
| 2.0     | Freeze | Runtime  | `21_event_model.md`, `02_glossary.md` | `30_assessment_engine.md`, `31_knowledge_profile_engine.md`, `32_recommendation_engine.md` | 2026-07-04 |

---

# Purpose

Dokumen ini mendefinisikan **State Machine** yang menggambarkan perubahan state utama selama proses pembelajaran di Kaifa.

State Machine menyediakan model lifecycle pembelajaran yang digunakan oleh runtime dan engine untuk menjaga konsistensi alur eksekusi.

Dokumen ini hanya mendefinisikan **state** dan **transition**.

Event yang memicu perpindahan state didefinisikan pada `21_event_model.md`.

---

# Scope

## In Scope

Dokumen ini membahas:

* Learning Lifecycle
* Runtime States
* State Transition
* State Principles

## Out of Scope

Dokumen ini **tidak** membahas:

* Event Definition
* Event Payload
* Business Rule
* Assessment Strategy
* AI Behaviour
* Engine Implementation

---

# State Principles

Seluruh state mengikuti prinsip berikut.

## Single Active State

Pada satu waktu hanya terdapat satu state utama yang aktif untuk satu alur pembelajaran.

---

## Event Driven Transition

Perpindahan state hanya terjadi karena event yang valid.

---

## Deterministic

State yang sama dengan event yang sama menghasilkan transisi yang sama.

---

## Observable

Setiap perubahan state dapat dipantau oleh runtime.

---

# Learning Lifecycle

State utama pembelajaran adalah sebagai berikut.

```text id="stm01"
Not Started
        │
        ▼
Learning
        │
        ▼
Assessing
        │
        ▼
Updating Knowledge Profile
        │
        ▼
Generating Learning Decision
        │
        ▼
Ready for Next Activity
        │
        ├──────────────┐
        ▼              │
Completed             │
                       │
Next Activity Exists ──┘
```

---

# State Definitions

| State                        | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| Not Started                  | Learner belum memulai aktivitas pembelajaran.                          |
| Learning                     | Learner sedang menjalankan Learning Activity.                          |
| Assessing                    | Assessment Engine sedang mengevaluasi Activity Result.                 |
| Updating Knowledge Profile   | Knowledge Profile Engine sedang memperbarui Knowledge Profile.         |
| Generating Learning Decision | Recommendation Engine sedang menghasilkan Learning Decision.           |
| Ready for Next Activity      | Sistem siap menjalankan aktivitas berikutnya sesuai Learning Decision. |
| Completed                    | Program, modul, atau aktivitas telah selesai sesuai konteksnya.        |

---

# State Transition

```text id="stm02"
Not Started
        │
        ▼
Learning
        │
        ▼
Assessing
        │
        ▼
Updating Knowledge Profile
        │
        ▼
Generating Learning Decision
        │
        ▼
Ready for Next Activity
```

Apabila masih terdapat aktivitas berikutnya, sistem kembali ke state **Learning**.

Apabila seluruh aktivitas telah selesai, sistem berpindah ke **Completed**.

---

# Runtime Flow

Hubungan antara Runtime dan Engine.

```text id="stm03"
Learning
        │
        ▼
Assessment Engine
        │
        ▼
Knowledge Profile Engine
        │
        ▼
Recommendation Engine
        │
        ▼
Learning
```

Runtime mengoordinasikan perpindahan state.

Engine menjalankan proses pada setiap state yang relevan.

---

# State Ownership

| State                        | Owner                    |
| ---------------------------- | ------------------------ |
| Not Started                  | Runtime                  |
| Learning                     | Runtime                  |
| Assessing                    | Assessment Engine        |
| Updating Knowledge Profile   | Knowledge Profile Engine |
| Generating Learning Decision | Recommendation Engine    |
| Ready for Next Activity      | Runtime                  |
| Completed                    | Runtime                  |

Business rule tetap dimiliki oleh Learning Domain.

---

# State Characteristics

State Machine memiliki karakteristik berikut.

* Event Driven
* Deterministic
* Observable
* Extensible
* Stateless Engine
* Single Source of Truth

---

# Relationship with Event Model

State Machine dan Event Model memiliki hubungan berikut.

```text id="stm04"
Event
        │
triggers
        ▼
State Transition
        │
invokes
        ▼
Engine
        │
publishes
        ▼
New Event
```

Event tidak menjadi state.

State tidak menjadi event.

Keduanya memiliki tanggung jawab yang berbeda.

---

# Relationship with Learning Pipeline

State Machine mengikuti pipeline resmi Kaifa.

```text id="stm05"
Learning Activity
        │
        ▼
Activity Result
        │
        ▼
Assessment Result
        │
        ▼
Knowledge Profile
        │
        ▼
Learning Decision
```

Pipeline ini merupakan alur konseptual yang dijalankan melalui transisi state dan event runtime.

---

# References

Dokumen yang berkaitan:

* `21_event_model.md`
* `30_assessment_engine.md`
* `31_knowledge_profile_engine.md`
* `32_recommendation_engine.md`
* `02_glossary.md`

---

# Document Ownership

Dokumen ini merupakan **single source of truth** untuk lifecycle state pembelajaran di Kaifa.

Dokumen lain tidak boleh mendefinisikan ulang:

* runtime state,
* state transition,
* ownership state.

Perubahan terhadap state machine harus mempertahankan konsistensi dengan Event Model dan Canonical Learning Pipeline.
