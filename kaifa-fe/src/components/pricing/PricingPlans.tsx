import { SectionHeading, Stagger } from '@/components/landing/primitives';
import { PlanCard, type Plan } from './PlanCard';

const plans: Plan[] = [
  {
    name: 'Free',
    price: 'Rp0',
    priceNote: 'Gratis selamanya',
    desc: 'Cocok untuk mencoba pengalaman belajar Kaifa dan mengenal AI Conversation.',
    features: [
      '1 akun learner',
      '1 kali Placement Test',
      'Akses ke modul pembelajaran awal',
      'Vocabulary dan grammar dasar',
      'Reading dan listening dasar',
      '30 AI text conversation turns per bulan',
      '10 menit AI voice conversation per bulan',
      'Maksimal 3 sesi voice conversation per bulan',
      'Transcript percakapan',
      'Terjemahan Bahasa Indonesia terbatas',
      'Transliteration terbatas',
      'Basic assessment',
      'Progress dashboard dasar',
      'Riwayat belajar 7 hari',
      'Standard AI model',
      'Standard voice',
      'Community support',
    ],
    sections: [
      {
        title: 'Batasan',
        tone: 'muted',
        items: [
          'AI voice menggunakan sistem turn-based',
          'Tidak termasuk realtime conversation',
          'Kuota tidak diakumulasi ke bulan berikutnya',
          'Beberapa program dan modul hanya tersedia sebagai preview',
        ],
      },
    ],
    cta: { label: 'Mulai Gratis', href: '/login' },
  },
  {
    name: 'Plus',
    badge: 'Paling Populer',
    price: 'Rp129.000',
    period: '/ bulan',
    altPrice: { price: 'Rp1.290.000', period: '/ tahun', note: 'Hemat setara 2 bulan.' },
    desc: 'Paket terbaik untuk learner yang ingin belajar rutin dengan AI Tutor personal.',
    features: [
      'Semua fitur Free',
      'Placement Test penuh',
      'Akses penuh ke program yang termasuk dalam paket',
      'Akses penuh ke learning module dan learning activity',
      'Vocabulary, grammar, reading, dan listening lengkap',
      'Assessment dan Assessment Result',
      'AI text conversation dengan fair-use',
      '90 menit AI voice conversation per bulan',
      'Lebih banyak sesi conversation',
      'Personalized AI Tutor feedback',
      'Penjelasan kesalahan vocabulary dan grammar',
      'Rekomendasi latihan berdasarkan kebutuhan learner',
      'Transcript lengkap',
      'Terjemahan Bahasa Indonesia',
      'Transliteration',
      'Conversation scenario lengkap',
      'Progress dashboard lengkap',
      'Learning history penuh',
      'Personalized practice',
      'Advanced progress insight',
      'Learning summary',
      'Akses dari maksimal 2 perangkat',
      'Standard priority processing',
      'Email support',
    ],
    sections: [
      {
        title: 'AI Conversation meliputi',
        items: [
          'Percakapan berdasarkan topik pembelajaran',
          'Simulasi percakapan sehari-hari',
          'Koreksi grammar',
          'Koreksi pilihan kata',
          'Feedback setelah percakapan',
          'Transcript learner dan AI',
          'Terjemahan percakapan',
          'Audio response dari AI Tutor',
        ],
      },
    ],
    cta: { label: 'Pilih Plus', href: '/login' },
    highlighted: true,
  },
  {
    name: 'Pro',
    price: 'Rp229.000',
    period: '/ bulan',
    altPrice: { price: 'Rp2.290.000', period: '/ tahun', note: 'Hemat setara 2 bulan.' },
    desc: 'Untuk learner intensif yang membutuhkan lebih banyak latihan conversation dan feedback lebih mendalam.',
    features: [
      'Semua fitur Plus',
      '240 menit AI voice conversation per bulan',
      'Advanced AI Tutor reasoning',
      'Advanced conversation feedback',
      'Advanced pronunciation feedback',
      'Extended conversation scenarios',
      'Role-play conversation',
      'Interview practice',
      'Presentation practice',
      'Academic conversation practice',
      'Professional conversation practice',
      'Premium voice pada scenario tertentu',
      'Realtime AI Conversation setelah fitur tersedia',
      'Higher AI text fair-use limit',
      'Detailed mistake analysis',
      'Personalized improvement plan',
      'Advanced progress report',
      'Download dan export learning report',
      'Priority AI processing',
      'Akses dari maksimal 3 perangkat',
      'Priority support',
    ],
    sections: [
      {
        title: 'Cocok untuk',
        items: [
          'Learner yang belajar secara intensif',
          'Persiapan wawancara',
          'Persiapan presentasi',
          'Latihan speaking rutin',
          'Peningkatan kemampuan komunikasi profesional',
          'Learner yang membutuhkan lebih banyak AI Conversation',
        ],
      },
    ],
    cta: { label: 'Pilih Pro', href: '/login' },
  },
];

export function PricingPlans() {
  return (
    <section id="paket" className="relative px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Pilih Paket yang Sesuai"
          desc="Semua paket berbayar bisa dicoba tanpa risiko — batalkan kapan saja."
        />

        <Stagger className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
