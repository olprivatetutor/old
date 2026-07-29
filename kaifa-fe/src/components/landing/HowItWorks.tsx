import { BarChart3, ClipboardList, MessagesSquare, Trophy } from 'lucide-react';
import { SectionHeading, Stagger, StaggerItem } from './primitives';

const steps = [
  {
    icon: ClipboardList,
    n: 1,
    title: 'Pilih Materi',
    desc: 'Pilih topik atau lesson sesuai kebutuhanmu.',
  },
  {
    icon: MessagesSquare,
    n: 2,
    title: 'Belajar & Latihan',
    desc: 'Belajar materi dan latihan interaktif bersama AI.',
  },
  {
    icon: BarChart3,
    n: 3,
    title: 'Pantau Progress',
    desc: 'Lihat perkembanganmu setiap hari.',
  },
  {
    icon: Trophy,
    n: 4,
    title: 'Raih Pencapaian',
    desc: 'Kumpulkan poin, badge, dan jadi versi terbaik dirimu!',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Belajar di Kaifa, Semudah Ini!" />

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <StaggerItem key={s.title}>
              <div className="border-rule/70 bg-surface/70 flex h-full items-start gap-4 rounded-3xl border p-6 backdrop-blur-xl">
                <span className="bg-subtle text-primary relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                  <s.icon className="h-5 w-5" />
                  <span className="text-primary-foreground absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-[image:var(--gradient-cta)] text-[11px] font-bold">
                    {s.n}
                  </span>
                </span>
                <span>
                  <span className="font-display text-ink block text-[15.5px] font-bold tracking-[-0.02em]">
                    {s.title}
                  </span>
                  <span className="text-ink-muted mt-1.5 block text-[13.5px] leading-[1.7]">{s.desc}</span>
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
