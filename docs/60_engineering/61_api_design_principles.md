# API Design Principles

| Version | Status | Owner | Depends On | Used By | Last Updated |
|---|---|---|---|---|---|
| 1.0 | Release Candidate | Product & Architecture | `99_architecture_decisions.md`, `52_prd.md`, `60_srs.md` | `62_api_spec.md`, `64_engine_contracts.md`, `65_event_contracts.md` | 2026-07-04 |

---

# 1. Purpose

Dokumen ini menetapkan **API Design Principles** sebagai standar teknis resmi untuk seluruh API pada Kaifa v2.

Dokumen ini dibuat agar setiap layanan yang mengekspos API — baik REST API, Internal Engine API, maupun AI Provider Gateway API — mengikuti prinsip desain yang konsisten, dapat diprediksi, dan dapat ditelusuri (traceable) ke dokumen arsitektur yang telah dibekukan (Freeze), `52_prd.md` yang telah disetujui, dan `60_srs.md` yang telah disetujui.

Dokumen ini menstandarkan cara API dirancang di seluruh layanan Kaifa, bukan mendefinisikan API itu sendiri. Standarisasi ini penting agar:

* setiap tim yang membangun API memiliki acuan desain yang sama,
* API tetap konsisten dengan Architecture Decision yang berlaku,
* API tidak menyimpang dari business rule yang dimiliki oleh Learning Domain,
* API tidak memperkenalkan tanggung jawab baru bagi AI Layer.

---

# 2. Scope

## In Scope

Dokumen ini membahas prinsip desain untuk:

* **REST API** — API yang digunakan untuk berinteraksi dengan resource pada Learning Domain, Runtime, dan Engine.
* **Internal Engine API** — API yang digunakan untuk komunikasi internal dengan Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine.
* **AI Provider Gateway API** — API yang digunakan untuk mengakses AI Provider melalui AI Provider Gateway.
* **Future External API** — API yang berpotensi dibuka untuk pihak eksternal pada fase pengembangan berikutnya.

## Out of Scope

Dokumen ini tidak membahas:

* **Database Design** — struktur data fisik bukan bagian dari dokumen ini.
* **Event Payload Design** — struktur payload event menjadi tanggung jawab `65_event_contracts.md`.
* **Business Rules** — seluruh business rule tetap dimiliki oleh Learning Domain sesuai AD-002.

---

# 3. Architecture Compliance

Setiap API yang dirancang mengikuti dokumen ini wajib patuh terhadap seluruh Architecture Decision yang telah dibekukan berikut. Dokumen ini tidak menafsirkan ulang (reinterpret) Architecture Decision tersebut, melainkan menjadikannya acuan wajib.

* **AD-001 — Layered Architecture.** API harus menghormati urutan layer (Foundation → Learning Domain → Runtime → Engine → AI Layer → Product) dan tidak boleh membuat API yang melompati batas layer.
* **AD-002 — Domain Owns Business Rules.** API boleh memanggil Domain Validation dan mengembalikan hasil validasinya sebagai response error, tetapi API tidak boleh memiliki atau mendefinisikan business rule sendiri.
* **AD-003 — Runtime Is Event-Driven.** API tidak menggantikan mekanisme koordinasi berbasis State Machine dan Event Model; API hanya menjadi antarmuka akses, bukan mekanisme orkestrasi antar Engine.
* **AD-004 — Assessment Blueprint and Assessment Engine Are Separate.** API terhadap Assessment Blueprint dan API terhadap Assessment Engine harus tetap terpisah sesuai pemisahan tanggung jawab tersebut.
* **AD-005 — Canonical Learning Pipeline.** Urutan akses API terhadap Activity Result, Assessment Result, Knowledge Profile, dan Learning Decision harus konsisten dengan pipeline resmi.
* **AD-006 — AI Does Not Make Learning Decisions.** API AI tidak boleh menghasilkan atau mengembalikan Learning Decision resmi.
* **AD-007 — Knowledge Profile Is Not AI Memory.** API tidak boleh mencampur akses terhadap Knowledge Profile dengan akses terhadap AI Memory.
* **AD-008 — AI Provider Agnostic.** Seluruh API yang berkomunikasi dengan AI Provider wajib melalui AI Provider Gateway.
* **AD-009 — AI as Experience Layer.** Kegagalan API AI tidak boleh menghentikan API yang melayani Canonical Learning Pipeline inti.
* **AD-010 — Documentation as Single Source of Truth.** Setiap perubahan prinsip desain API harus dilakukan pada dokumen ini, bukan diduplikasi ke dokumen lain.

---

# 4. API Style

## RESTful Resource Naming

API Kaifa menggunakan pendekatan resource-oriented. Nama resource merepresentasikan entitas bisnis yang telah didefinisikan pada dokumen arsitektur, tanpa memperkenalkan entitas baru.

## HTTP Methods

Setiap API menggunakan HTTP Method sesuai maknanya:

* `GET` untuk membaca resource.
* `POST` untuk membuat resource baru atau memicu proses.
* `PUT`/`PATCH` untuk memperbarui resource.
* `DELETE` tidak boleh melakukan hard delete terhadap resource bisnis yang memiliki lifecycle Archived, kecuali secara eksplisit diizinkan oleh dokumen arsitektur atau SRS. Untuk resource lifecycle-based, DELETE harus dipetakan ke archive/deactivation.

## Stateless APIs

Seluruh API bersifat stateless. Setiap request harus membawa seluruh informasi yang dibutuhkan untuk diproses, konsisten dengan sifat stateless yang dimiliki Assessment Engine dan Knowledge Profile Engine.

## URI Conventions

* Gunakan huruf kecil dan tanda hubung (kebab-case) pada path.
* Gunakan penamaan resource dalam bentuk jamak (plural).
* Hindari kata kerja pada path resource; gunakan HTTP Method untuk merepresentasikan aksi.

## Plural Resource Naming

Contoh penamaan resource yang konsisten dengan entitas pada arsitektur:

```text
/api/v1/learning-programs
/api/v1/learning-modules
/api/v1/learning-activities
/api/v1/assessment-results
```

Contoh di atas hanya menggambarkan pola penamaan. Dokumen ini tidak membuat daftar endpoint lengkap; daftar endpoint resmi berada pada `62_api_spec.md`.

## Versioning Strategy

Seluruh API menggunakan versi pada URI (misalnya `/api/v1/...`) sebagaimana dijelaskan lebih lanjut pada Bagian 13.

---

# 5. Resource Design Principles

## Resource-Oriented Design

API dirancang berdasarkan resource, bukan berdasarkan operasi. Resource merepresentasikan entitas yang telah dimiliki oleh Learning Domain, Runtime, atau Engine.

## Nested Resources

Hubungan kepemilikan antar entitas dapat direpresentasikan melalui nested resource apabila hubungan tersebut bersifat hierarkis dan konsisten dengan Core Concepts pada dokumen arsitektur sumber.

## Filtering

API dapat menyediakan mekanisme filtering pada level query parameter untuk mempersempit hasil resource, tanpa mengubah makna atau struktur data resource.

## Sorting

API dapat menyediakan mekanisme sorting pada query parameter tanpa memperkenalkan atribut baru di luar yang telah didefinisikan arsitektur.

## Pagination

Seluruh API yang mengembalikan koleksi resource wajib mendukung pagination untuk menjaga performa, sebagaimana dijelaskan lebih lanjut pada Bagian 14.

## Searching

API dapat menyediakan kapabilitas pencarian umum pada resource, dengan tetap membatasi pencarian pada atribut resmi resource tersebut.

Bagian ini hanya menetapkan prinsip umum. Struktur query parameter secara rinci ditetapkan pada `62_api_spec.md`.

---

# 6. Request Principles

## JSON Request Format

Seluruh request body menggunakan format JSON.

## Validation

Setiap request wajib melalui Input Validation sebelum diteruskan ke Domain, sebagaimana dijelaskan pada Bagian 9.

## Idempotency

Operasi yang berpotensi dipanggil berulang (misalnya akibat retry jaringan) harus dirancang agar bersifat idempotent, khususnya pada API yang berinteraksi dengan Assessment Engine dan Knowledge Profile Engine yang bersifat deterministic.

## Correlation ID

Setiap request harus memiliki Correlation ID dan Trace ID untuk mendukung observability dan tracing lintas layanan.

## Trace ID

Jika client tidak menyertakan Correlation ID atau Trace ID, API Gateway atau entrypoint service wajib membuatnya sebelum request diproses lebih lanjut.

## Request Metadata

Request dapat menyertakan metadata tambahan (misalnya locale atau client information) selama tidak mengandung business rule baru.

Dokumen ini tidak mendefinisikan skema payload secara rinci; skema payload menjadi tanggung jawab `62_api_spec.md`.

---

# 7. Response Principles

Seluruh API menggunakan format response envelope yang konsisten.

## Success Response

Response sukses menyertakan:

* status keberhasilan,
* data hasil resource,
* metadata bila diperlukan.

## Error Response

Response error menyertakan:

* status kegagalan,
* kode error sesuai Bagian 10,
* pesan error yang informatif namun tidak membocorkan detail teknis sensitif.

## Metadata

Metadata response dapat mencakup informasi seperti Correlation ID, Trace ID, dan waktu pemrosesan.

## Pagination Metadata

Response koleksi resource menyertakan metadata pagination seperti jumlah total data, halaman saat ini, dan ukuran halaman.

Bagian ini hanya menetapkan format umum; struktur field secara rinci ditetapkan pada `62_api_spec.md`.

---

# 8. HTTP Status Code Guidelines

| Status Code | Penggunaan |
|---|---|
| 200 | Request berhasil diproses dan mengembalikan data. |
| 201 | Resource baru berhasil dibuat. |
| 202 | Request diterima dan sedang diproses secara asynchronous, misalnya proses yang melibatkan Engine berbasis event. |
| 204 | Request berhasil diproses tanpa konten yang dikembalikan. |
| 400 | Request tidak valid secara format atau struktur. |
| 401 | Identitas pemanggil tidak dapat diverifikasi. |
| 403 | Pemanggil tidak memiliki otorisasi terhadap resource yang diminta. |
| 404 | Resource yang diminta tidak ditemukan. |
| 409 | Terjadi konflik pada state resource, misalnya transisi state yang tidak sah. |
| 422 | Request valid secara format namun gagal pada validasi bisnis. |
| 429 | Pemanggil melebihi batas rate limiting yang ditetapkan. |
| 500 | Terjadi kegagalan sistem yang tidak terduga. |
| 503 | Layanan sedang tidak tersedia, misalnya akibat kegagalan AI Provider yang memicu Graceful Degradation. |

---

# 9. Validation Principles

API menerapkan validasi berlapis sesuai layer pemiliknya.

## Input Validation

Dilakukan pada level API untuk memastikan format, tipe data, dan kelengkapan field request.

## Business Validation

Business Validation adalah milik Learning Domain sesuai AD-002. API tidak boleh menduplikasi atau mendahului business rule yang dimiliki Domain.

## Domain Validation

Domain Validation mencakup aturan yang telah didefinisikan pada dokumen arsitektur Learning Domain (misalnya aturan pada Learning Program, Learning Objective, dan Assessment Blueprint).

## Engine Validation

Engine Validation dilakukan oleh Assessment Engine, Knowledge Profile Engine, dan Recommendation Engine sesuai peran generik masing-masing pada Canonical Learning Pipeline, tanpa mendefinisikan aturan evaluasi baru.

API hanya meneruskan request menuju layer yang berwenang; API tidak menggantikan validasi milik Domain atau Engine.

---

# 10. Error Handling Principles

## Error Code Convention

Setiap error memiliki kode yang konsisten dan dapat ditelusuri ke kategori error-nya (Validation Error, Business Error, System Error, atau AI Provider Error).

## Error Message Convention

Pesan error bersifat jelas, konsisten, dan tidak membocorkan detail implementasi internal.

## Validation Error

Merepresentasikan kegagalan Input Validation, biasanya dipetakan ke status 400 atau 422.

## Business Error

Merepresentasikan pelanggaran business rule yang dimiliki Learning Domain, biasanya dipetakan ke status 409 atau 422.

## System Error

Merepresentasikan kegagalan teknis di luar kendali pemanggil, dipetakan ke status 500 atau 503.

## AI Provider Error

Merepresentasikan kegagalan pada AI Provider Gateway atau AI Provider. Error ini tidak boleh menghentikan Canonical Learning Pipeline inti, sesuai prinsip Graceful Degradation pada AD-009.

Bagian ini hanya menetapkan aturan umum; format error secara rinci ditetapkan pada `62_api_spec.md`.

---

# 11. Authentication Principles

Authentication merupakan Open Issue arsitektur yang belum diatur oleh dokumen manapun pada Kaifa v2 (lihat `60_srs.md`, Bagian 18).

Dokumen ini hanya menetapkan bahwa:

* setiap API wajib mampu mengidentifikasi pemanggil sebelum memproses request,
* mekanisme identifikasi tersebut berada di luar cakupan dokumen ini.

Dokumen ini tidak memilih teknologi Authentication tertentu, dan tidak mendefinisikan OAuth, JWT, Session, atau mekanisme sejenis. Keputusan tersebut menunggu Architecture Review terhadap Open Issue Authentication.

---

# 12. Authorization Principles

API menerapkan prinsip Role-Based Authorization dengan mengacu pada aktor yang telah ada, yaitu **Learner**, **Educator**, dan komponen sistem seperti **Assessment Engine**, **Knowledge Profile Engine**, dan **Recommendation Engine**, sesuai Actor & Role Matrix pada `60_srs.md`.

Prinsip umum:

* API hanya mengizinkan akses sesuai kewenangan aktor terhadap resource, mengikuti batasan yang telah ditetapkan (misalnya Learner hanya dapat mengakses Knowledge Profile miliknya sendiri).
* API tidak boleh mengizinkan aktor mengubah data yang bukan menjadi kepemilikannya (misalnya Learner tidak dapat mengubah Knowledge Profile, karena Knowledge Profile Engine merupakan sole owner).
* Mekanisme otorisasi Educator terhadap data Learner yang berada di luar kewenangannya masih menjadi Open Issue arsitektur dan tidak diselesaikan oleh dokumen ini.

Dokumen ini tidak memperkenalkan peran (role) baru di luar yang telah disebutkan pada dokumen arsitektur, PRD, dan SRS.

---

# 13. API Versioning

## URI Versioning

Versi API dinyatakan pada URI, misalnya `/api/v1/...`. Pendekatan ini dipilih agar perubahan versi terlihat eksplisit bagi konsumen API.

## Backward Compatibility

Perubahan pada versi API yang sama tidak boleh menghapus atau mengubah makna field yang sudah digunakan konsumen. Perubahan yang bersifat breaking wajib dirilis pada versi baru.

## Deprecation Policy

Versi API yang akan dihentikan wajib diumumkan terlebih dahulu dengan masa transisi yang jelas sebelum dinonaktifkan sepenuhnya.

---

# 14. Performance Principles

## Pagination

Seluruh endpoint yang mengembalikan koleksi data wajib menerapkan pagination untuk menghindari beban response yang berlebihan.

## Compression

Response API dapat dikompresi untuk mengurangi ukuran payload pada jaringan.

## Caching

API dapat menerapkan caching pada resource yang bersifat stabil, misalnya Learning Content berstatus Published, selama tidak melanggar prinsip data terkini pada resource yang bersifat dinamis seperti Knowledge Profile.

## Timeout

Setiap pemanggilan API, khususnya terhadap AI Provider Gateway, wajib memiliki batas waktu (timeout) yang jelas agar tidak menghambat Canonical Learning Pipeline.

## Retry

Mekanisme retry dapat diterapkan pada kegagalan yang bersifat sementara, dengan tetap menjaga idempotency sesuai Bagian 6.

## Rate Limiting

API menerapkan rate limiting untuk mencegah penyalahgunaan, khususnya pada AI Provider Gateway API sesuai kebutuhan Observability pada `41_ai_provider_integration.md`.

---

# 15. Observability

Prinsip Observability pada dokumen ini mengacu langsung pada Non-Functional Requirements yang telah ditetapkan pada `60_srs.md`.

## Logging

Setiap API wajib menghasilkan log yang memadai untuk mendukung penelusuran kegagalan dan audit.

## Metrics

API, khususnya AI Provider Gateway API, wajib memantau metrik seperti Request Count, Success Rate, Error Rate, Latency, dan Provider Availability.

## Tracing

Setiap request API wajib dapat ditelusuri lintas layer menggunakan Trace ID.

## Correlation ID

Correlation ID digunakan untuk menghubungkan satu alur bisnis yang melibatkan beberapa pemanggilan API dan event.

## Audit Logging

Interaksi dengan AI wajib dicatat dengan field minimum Timestamp, Provider, Prompt Version, Model, Context Source, Response ID, Token Usage, dan Error, sebagaimana ditetapkan pada `60_srs.md`.

Setiap perubahan state pada State Machine dan kegagalan pada Assessment Engine, Knowledge Profile Engine, serta Recommendation Engine wajib menghasilkan catatan yang dapat dipantau.

---

# 16. Security Principles

## HTTPS

Seluruh komunikasi API wajib menggunakan HTTPS.

## Encryption in Transit

Data yang dikirim melalui API wajib terenkripsi selama dalam perjalanan (in transit).

## Sensitive Data

Data sensitif tidak boleh diekspos secara tidak perlu pada response maupun log, konsisten dengan prinsip Privacy by Design pada `60_srs.md`.

## Input Sanitization

Seluruh input API wajib disanitasi untuk mencegah serangan seperti injection, termasuk Prompt Injection pada API yang berinteraksi dengan AI Provider Gateway.

## Output Encoding

Output API wajib dikodekan dengan benar untuk mencegah eksekusi konten berbahaya pada sisi konsumen.

## API Abuse Protection

API menerapkan mekanisme perlindungan terhadap penyalahgunaan, seperti rate limiting dan monitoring, tanpa menetapkan teknologi implementasi tertentu.

Dokumen ini tidak menentukan teknologi keamanan spesifik; pemilihan teknologi berada di luar cakupan dokumen ini.

---

# 17. AI API Principles

Prinsip berikut wajib dipatuhi oleh seluruh API yang berkomunikasi dengan AI, mengacu langsung pada AD-006, AD-007, AD-008, dan AD-009.

* AI hanya dapat diakses melalui **AI Provider Gateway**; tidak ada API yang boleh terhubung langsung ke AI Provider tertentu (AD-008).
* AI API tidak pernah mengembalikan **Learning Decision** resmi; Learning Decision hanya dihasilkan oleh Recommendation Engine (AD-006).
* AI API tidak pernah memperbarui **Knowledge Profile**; Knowledge Profile hanya diperbarui oleh Knowledge Profile Engine (AD-007).
* AI API tidak pernah menghasilkan **Assessment Result** resmi; Assessment Result hanya dihasilkan oleh Assessment Engine melalui Canonical Learning Pipeline.
* Kegagalan AI API tidak boleh menghentikan API yang melayani Canonical Learning Pipeline inti, sesuai prinsip Graceful Degradation pada AI as Experience Layer (AD-009).

---

# 18. API Design Checklist

Checklist berikut digunakan untuk memverifikasi kepatuhan desain API terhadap dokumen ini sebelum API didefinisikan secara rinci pada `62_api_spec.md`.

* [ ] RESTful naming digunakan secara konsisten.
* [ ] API bersifat stateless.
* [ ] API dapat ditelusuri (traceable) ke `60_srs.md`.
* [ ] API dapat ditelusuri (traceable) ke `52_prd.md`.
* [ ] API patuh terhadap seluruh Architecture Decision terkait.
* [ ] API menggunakan format error standar.
* [ ] API menggunakan strategi versioning yang ditetapkan.
* [ ] API memastikan setiap request memiliki Correlation ID dan Trace ID.
* [ ] API mendukung audit logging sesuai kebutuhan Observability.
* [ ] API AI tidak menghasilkan Learning Decision resmi.
* [ ] API AI tidak memperbarui Knowledge Profile.
* [ ] API AI tidak menghasilkan Assessment Result resmi.
* [ ] API AI hanya mengakses provider melalui AI Provider Gateway.

---

# 19. Relationship with Other Documents

Dokumen ini merupakan standar desain API dan memiliki hubungan sebagai berikut dengan dokumen lain:

* **`52_prd.md`** — menjadi sumber Functional Requirement yang harus tetap dapat ditelusuri oleh setiap API.
* **`60_srs.md`** — menjadi sumber spesifikasi implementasi, Non-Functional Requirement, Actor & Role Matrix, serta Event Catalog yang menjadi acuan prinsip desain pada dokumen ini.
* **`62_api_spec.md`** — mendefinisikan endpoint API secara konkret, termasuk path, method, dan skema payload, dengan mengikuti seluruh prinsip pada dokumen ini.
* **`64_engine_contracts.md`** — mendefinisikan kontrak teknis antara API dan Engine (Assessment Engine, Knowledge Profile Engine, Recommendation Engine).
* **`65_event_contracts.md`** — mendefinisikan kontrak payload event yang dipublikasikan maupun dikonsumsi, terpisah dari desain API request/response.

Dokumen ini hanya menetapkan prinsip desain API. Definisi endpoint API secara lengkap adalah tanggung jawab `62_api_spec.md`, bukan dokumen ini.

---

# 20. References

Dokumen ini disusun berdasarkan dokumentasi Kaifa v2 yang telah ada, yaitu:

* `99_architecture_decisions.md`
* `00_overview.md`
* `02_glossary.md`
* `52_prd.md`
* `60_srs.md`
* `21_event_model.md`
* `20_state_machine.md`
* `30_assessment_engine.md`
* `31_knowledge_profile_engine.md`
* `32_recommendation_engine.md`
* `40_ai_architecture.md`
* `41_ai_provider_integration.md`
* `44_ai_governance.md`

---

# Document Ownership

Dokumen ini merupakan **standar API resmi** Kaifa v2, bukan dokumen arsitektur.

Dokumen ini tidak mendefinisikan endpoint, tidak berbentuk spesifikasi OpenAPI, dan tidak mendefinisikan ulang business logic, ownership, maupun tanggung jawab AI yang telah ditetapkan oleh dokumen arsitektur, `52_prd.md`, dan `60_srs.md`.

Seluruh desain API pada Kaifa v2 wajib tetap dapat ditelusuri ke `60_srs.md` yang telah disetujui dan ke dokumen arsitektur yang telah dibekukan. Perubahan terhadap prinsip pada dokumen ini harus melalui architecture review agar konsistensi desain API tetap terjaga.
