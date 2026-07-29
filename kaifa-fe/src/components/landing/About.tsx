import Image from 'next/image';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal, SectionHeading, Stagger, StaggerItem } from './primitives';

const values = [
  {
    icon: Sparkles,
    title: 'Dibangun untuk Pelajar Muslim',
    desc: 'Materi dan pendekatan belajar dirancang selaras dengan nilai-nilai Islam untuk pelajar Kelas VII–XII.',
  },
  {
    icon: ShieldCheck,
    title: 'Aman & Terpercaya',
    desc: 'Konten dikurasi, terstruktur sesuai kurikulum, dan diawasi agar setiap pelajaran tetap relevan dan tepercaya.',
  },
  {
    icon: HeartHandshake,
    title: 'Pendamping, Bukan Pengganti',
    desc: 'AI Companion melengkapi peran guru dan orang tua, membantu belajar mandiri tanpa menggantikan bimbingan mereka.',
  },
];

export function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <Image
                src="/images/landing/hero-mascot.png"
                alt="Ilustrasi maskot Kaifa"
                loading="lazy"
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="mx-auto h-auto w-[70%] drop-shadow-[0_30px_50px_rgba(31,41,55,0.15)] lg:w-[80%]"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Tentang Kaifa"
              title="Teman Belajar AI untuk Pelajar Muslim Indonesia"
              desc="Kaifa hadir untuk membantu pelajar Muslim Indonesia (Kelas VII–XII) belajar Bahasa Arab dan Bahasa Inggris secara lebih efektif, terstruktur, dan sesuai nilai-nilai Islam — dengan AI Companion yang selalu siap mendampingi."
            />

            <Stagger className="mt-8 flex flex-col gap-4">
              {values.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="border-rule/70 bg-surface/70 flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-xl">
                    <span className="bg-subtle text-primary grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                      <v.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="font-display text-ink block text-[15px] font-bold tracking-[-0.02em]">
                        {v.title}
                      </span>
                      <span className="text-ink-muted mt-1.5 block text-[13.5px] leading-[1.7]">
                        {v.desc}
                      </span>
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
