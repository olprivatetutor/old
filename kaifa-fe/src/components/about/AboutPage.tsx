import {
  Compass,
  Eye,
  GraduationCap,
  Lightbulb,
  Lock,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Nav } from '@/components/landing/Nav';
import { Footer } from '@/components/landing/Footer';
import {
  CtaButton,
  Eyebrow,
  GlassCard,
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
} from '@/components/landing/primitives';

const approach = [
  {
    icon: Compass,
    title: 'Placement yang Adaptif',
    desc: 'Setiap learner memulai dari titik yang tepat lewat assessment singkat, bukan dari materi yang disamaratakan.',
  },
  {
    icon: RouteIcon,
    title: 'Learning Path Personal',
    desc: 'Materi, latihan, dan tingkat kesulitan menyesuaikan progres harian — cukup menantang, tidak membuat menyerah.',
  },
  {
    icon: Sparkles,
    title: 'Latihan Bermakna',
    desc: 'Konteks percakapan nyata untuk Bahasa Arab dan Bahasa Inggris, lengkap dengan feedback instan yang membangun.',
  },
  {
    icon: GraduationCap,
    title: 'Selaras Kurikulum Sekolah',
    desc: 'Terstruktur mengikuti jenjang Kelas VII–XII sehingga belajar mandiri tetap nyambung dengan kelas.',
  },
];

const xai = [
  {
    icon: Eye,
    title: 'Transparan',
    desc: 'Setiap rekomendasi materi disertai alasan: skill apa yang lemah, dan bukti jawaban mana yang mendasarinya.',
  },
  {
    icon: Lightbulb,
    title: 'Bisa Dipahami',
    desc: 'Penjelasan AI ditulis dalam bahasa yang mudah dimengerti learner dan guru, bukan skor mentah tanpa konteks.',
  },
  {
    icon: UserCheck,
    title: 'Human-in-the-loop',
    desc: 'Guru tetap memegang keputusan akhir. AI memberi usulan, pendidik yang memvalidasi dan menyesuaikan.',
  },
];

const team = [
  {
    name: 'Hamdi Mulya',
    role: 'Co-founder',
    desc: 'Memimpin arah produk dan pengembangan pengalaman belajar Kaifa.',
  },
  {
    name: 'Asroel',
    role: 'Co-founder',
    desc: 'Fokus pada kualitas pedagogi, kurikulum, dan kemitraan institusi pendidikan.',
  },
];

const privacy = [
  {
    icon: ShieldCheck,
    title: 'Data Minimal',
    desc: 'Kami hanya mengumpulkan data yang benar-benar dibutuhkan untuk mendukung proses belajar.',
  },
  {
    icon: Lock,
    title: 'Terenkripsi',
    desc: 'Data akun dan progres belajar disimpan dengan enkripsi serta akses yang dibatasi per peran.',
  },
  {
    icon: UserCheck,
    title: 'Milik Learner',
    desc: 'Data belajar tidak diperjualbelikan. Learner dan sekolah dapat meminta ekspor atau penghapusan data.',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AboutPage() {
  return (
    <div className="bg-background font-sans text-ink relative min-h-screen antialiased">
      <Nav />
      <main>
        <section id="top" className="relative px-4 pt-32 pb-12 sm:px-6 sm:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>Tentang Kaifa</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-ink mt-6 text-[38px] leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-[52px]">
                Pendamping belajar bahasa untuk generasi pelajar Indonesia
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-ink-muted mx-auto mt-5 max-w-2xl text-[16px] leading-[1.75] text-pretty sm:text-[17px]">
                Kaifa menggabungkan pedagogi bahasa dan adaptive AI agar setiap learner
                bisa belajar <span dir="rtl">العربية</span> dan Bahasa Inggris dengan cara
                yang sesuai kemampuannya — terstruktur, transparan, dan bermakna.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="visi" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Visi"
              title="Setiap pelajar berhak punya pendamping belajar sendiri"
              desc="Kami percaya kualitas pendampingan belajar tidak boleh bergantung pada lokasi, biaya, atau jumlah guru di kelas."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {[
                {
                  t: 'Akses yang setara',
                  d: 'Pendampingan bahasa berkualitas tersedia untuk pelajar di kota besar maupun daerah.',
                },
                {
                  t: 'Belajar yang manusiawi',
                  d: 'Teknologi mendukung guru dan learner, bukan menggantikan relasi belajar di kelas.',
                },
                {
                  t: 'Bermakna secara nilai',
                  d: 'Konteks materi relevan dengan keseharian pelajar Muslim Indonesia.',
                },
              ].map((v, i) => (
                <Reveal key={v.t} delay={i * 0.07}>
                  <GlassCard className="h-full p-7">
                    <p className="font-mono text-ink-muted text-[12px]">0{i + 1}</p>
                    <h3 className="font-display text-ink mt-3 text-[20px] font-bold tracking-[-0.02em]">
                      {v.t}
                    </h3>
                    <p className="text-ink-muted mt-2.5 text-[15px] leading-[1.7]">{v.d}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="pendekatan" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Pendekatan Pembelajaran"
              title="Adaptif, terstruktur, dan berbasis latihan nyata"
              desc="Alur belajar Kaifa dirancang bersama pendidik agar tetap selaras dengan kurikulum sekolah."
            />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
              {approach.map((a) => (
                <StaggerItem key={a.title}>
                  <article className="border-rule/70 bg-surface/70 hover:border-secondary/30 flex h-full gap-4 rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5">
                    <span className="bg-[color-mix(in_oklab,var(--brand)_12%,var(--surface))] text-primary grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                      <a.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-ink text-[19px] font-bold tracking-[-0.02em]">
                        {a.title}
                      </h3>
                      <p className="text-ink-muted mt-2 text-[15px] leading-[1.7]">{a.desc}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="explainable-ai" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Explainable AI"
              title="AI yang bisa menjelaskan alasannya"
              desc="Learner dan guru selalu tahu mengapa sebuah materi direkomendasikan — tidak ada black box."
            />
            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              {xai.map((x) => (
                <StaggerItem key={x.title}>
                  <GlassCard className="h-full p-7">
                    <span className="bg-[color-mix(in_oklab,var(--secondary)_12%,var(--surface))] text-secondary grid h-12 w-12 place-items-center rounded-2xl">
                      <x.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-ink mt-4 text-[19px] font-bold tracking-[-0.02em]">
                      {x.title}
                    </h3>
                    <p className="text-ink-muted mt-2 text-[15px] leading-[1.7]">{x.desc}</p>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="tim" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Tim & Institusi"
              title="Dibangun oleh praktisi pendidikan dan teknologi"
              desc="Tim inti Kaifa memadukan pengalaman pengajaran bahasa dengan pengembangan produk digital."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.07}>
                  <GlassCard className="flex h-full items-start gap-5 p-7">
                    <span className="font-display text-primary-foreground grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-cta)] text-[16px] font-bold">
                      {initials(m.name)}
                    </span>
                    <div>
                      <h3 className="font-display text-ink text-[20px] font-bold tracking-[-0.02em]">
                        {m.name}
                      </h3>
                      <p className="text-secondary mt-0.5 text-[13px] font-semibold tracking-[0.14em] uppercase">
                        {m.role}
                      </p>
                      <p className="text-ink-muted mt-2.5 text-[15px] leading-[1.7]">{m.desc}</p>
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="keamanan" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Keamanan & Privasi"
              title="Data belajar diperlakukan sebagai amanah"
              desc="Kaifa dirancang dengan prinsip privacy by design untuk melindungi learner di bawah umur."
            />
            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              {privacy.map((p) => (
                <StaggerItem key={p.title}>
                  <GlassCard className="h-full p-7">
                    <span className="bg-[color-mix(in_oklab,var(--accent)_20%,var(--surface))] text-accent-foreground grid h-12 w-12 place-items-center rounded-2xl">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-ink mt-4 text-[19px] font-bold tracking-[-0.02em]">
                      {p.title}
                    </h3>
                    <p className="text-ink-muted mt-2 text-[15px] leading-[1.7]">{p.desc}</p>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="text-ink-muted mx-auto mt-8 max-w-2xl text-center text-[14px] leading-[1.7]">
                Halaman ini dikelola oleh tim Kaifa untuk menjawab pertanyaan umum seputar
                keamanan dan privasi, dan bukan merupakan sertifikasi pihak ketiga.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="px-4 pt-6 pb-24 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="font-display text-ink text-[30px] leading-[1.1] font-bold tracking-[-0.03em] text-balance sm:text-[38px]">
                Ingin tahu lebih jauh tentang Kaifa?
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <CtaButton href="/">Kembali ke Beranda</CtaButton>
                <CtaButton href="/#faq" variant="ghost">
                  Lihat FAQ
                </CtaButton>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
