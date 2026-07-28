import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal, SectionHeading } from '@/components/landing/primitives';

const faqs = [
  {
    q: 'Apakah saya bisa mencoba AI Conversation secara gratis?',
    a: 'Ya. Paket Free sudah termasuk AI text conversation dan 10 menit AI voice conversation setiap bulan.',
  },
  {
    q: 'Apakah AI Conversation tersedia dalam bentuk suara dan teks?',
    a: 'Ya. Learner dapat berbicara menggunakan suara, melihat hasil transcript, menerima respons teks, dan mendengar respons suara dari AI Tutor.',
  },
  {
    q: 'Apakah paket Free membutuhkan kartu kredit?',
    a: 'Tidak. Anda dapat membuat akun dan mulai menggunakan paket Free tanpa kartu kredit.',
  },
  {
    q: 'Apa perbedaan Plus dan Pro?',
    a: 'Plus dirancang untuk pembelajaran rutin dengan AI Tutor dan kuota voice yang cukup untuk penggunaan mingguan. Pro dirancang untuk learner intensif yang membutuhkan lebih banyak AI Conversation, feedback lebih mendalam, priority processing, dan fitur realtime voice setelah tersedia.',
  },
  {
    q: 'Apakah kuota AI voice diakumulasikan?',
    a: 'Tidak. Kuota diperbarui setiap periode billing dan tidak dibawa ke periode berikutnya.',
  },
  {
    q: 'Apa yang terjadi ketika kuota voice habis?',
    a: 'Anda tetap dapat mengakses modul pembelajaran, assessment, progress dashboard, dan fitur non-voice. Anda juga dapat membeli Voice Add-On.',
  },
  {
    q: 'Apakah hasil assessment ditentukan oleh AI?',
    a: 'Tidak. Assessment Result resmi ditentukan oleh sistem assessment Kaifa. AI Tutor membantu memberikan penjelasan dan feedback, tetapi tidak mengubah hasil resmi atau jalur belajar secara langsung.',
  },
  {
    q: 'Apakah saya dapat membatalkan langganan?',
    a: 'Ya. Langganan dapat dibatalkan kapan saja. Akses berbayar tetap tersedia sampai akhir periode billing aktif.',
  },
  {
    q: 'Apakah ada paket untuk sekolah dan lembaga pendidikan?',
    a: 'Ya. Kaifa menyediakan paket khusus untuk sekolah, kursus, komunitas, lembaga pendidikan, dan perusahaan berdasarkan jumlah learner serta kebutuhan fitur.',
  },
];

export function PricingFaq() {
  return (
    <section id="faq" className="relative px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan Umum" />

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
