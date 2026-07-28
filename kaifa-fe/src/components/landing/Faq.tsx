'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal, SectionHeading } from './primitives';

const faqs = [
  {
    q: 'Apa bedanya Kaifa dengan marketplace kursus?',
    a: 'Marketplace menjual video. Kaifa membangun adaptive path: setiap jawaban memperbarui model pemahamanmu, dan pelajaran berikutnya dipilihkan untukmu. Kamu menyelesaikan lebih banyak, dan mengingat lebih banyak.',
  },
  {
    q: 'Apakah saya harus berkomitmen pada jadwal tetap?',
    a: 'Tidak. Sesi bisa sesingkat sepuluh menit. Jika kamu absen dua minggu, engine menyesuaikan ulang jalurmu alih-alih menghukummu.',
  },
  {
    q: 'Apakah sertifikatnya diakui?',
    a: 'Sertifikat diterbitkan hanya setelah mastery checkpoint, dapat diverifikasi secara independen melalui link publik, dan menyertakan skill breakdown sehingga pemberi kerja bisa melihat apa yang sebenarnya kamu tunjukkan.',
  },
  {
    q: 'Bisakah saya belajar offline?',
    a: 'Ya. Unduh modul apa pun di ponsel atau tablet. Progress disimpan secara lokal dan disinkronkan otomatis saat kamu kembali online.',
  },
  {
    q: 'Apakah Kaifa cocok untuk institusi dan tim?',
    a: 'Institusi mendapatkan manajemen cohort, dashboard mentor, dan analytics yang bisa diekspor tentang mastery dan engagement — dengan pengalaman learner yang sama di bawahnya.',
  },
  {
    q: 'Apakah ada paket gratis?',
    a: 'Kamu bisa mulai gratis, menyelesaikan placement, dan mengerjakan modul pengantar di setiap kategori sebelum memutuskan paket.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan, dijawab dengan lugas." />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-rule/70 bg-surface/70 data-[state=open]:border-secondary/25 overflow-hidden rounded-2xl border px-5 backdrop-blur-xl transition-colors duration-300 last:border-b"
              >
                <AccordionTrigger className="font-display text-ink py-5 text-left text-[16px] font-semibold tracking-[-0.02em] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ink-muted pb-5 text-[14.5px] leading-[1.75]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
