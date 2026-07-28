'use client';

import { BarChart3, BookOpen, Bot, ClipboardList, Mic } from 'lucide-react';
import { SectionHeading, Stagger, StaggerItem } from './primitives';

const features = [
  {
    icon: Bot,
    title: 'AI Companion',
    desc: 'Teman belajar AI yang siap membantu, menjawab, dan mendampingi kapan saja.',
    tone: 'bg-[color-mix(in_oklab,var(--brand)_12%,var(--surface))] text-primary',
  },
  {
    icon: Mic,
    title: 'Percakapan',
    desc: 'Latihan berbicara dengan situasi nyata dan umpan balik instan dari AI.',
    tone: 'bg-[color-mix(in_oklab,var(--secondary)_12%,var(--surface))] text-secondary',
  },
  {
    icon: BookOpen,
    title: 'Kosa Kata & Tata Bahasa',
    desc: 'Materi terstruktur sesuai tingkat sekolah, dilengkapi contoh dan latihan.',
    tone: 'bg-[color-mix(in_oklab,var(--accent)_20%,var(--surface))] text-accent-foreground',
  },
  {
    icon: ClipboardList,
    title: 'Quiz Interaktif',
    desc: 'Uji pemahamanmu dengan quiz seru dan penjelasan yang mudah dipahami.',
    tone: 'bg-[color-mix(in_oklab,var(--secondary)_12%,var(--surface))] text-secondary',
  },
  {
    icon: BarChart3,
    title: 'Progress & Analitik',
    desc: 'Pantau perkembangan belajar dan raih pencapaian terbaik setiap hari.',
    tone: 'bg-[color-mix(in_oklab,var(--brand)_12%,var(--surface))] text-primary',
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Belajar Lengkap dengan Pendamping AI"
          desc="Semua yang kamu butuhkan untuk menguasai bahasa dengan lebih percaya diri."
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <article className="border-rule/70 bg-surface/70 hover:border-secondary/30 flex h-full flex-col items-center rounded-3xl border p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-35px_rgba(98,79,140,0.45)]">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${f.tone}`}>
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-ink mt-5 text-[15.5px] font-bold tracking-[-0.02em]">
                  {f.title}
                </h3>
                <p className="text-ink-muted mt-2.5 text-[13.5px] leading-[1.7]">{f.desc}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
