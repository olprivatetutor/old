import { Check } from 'lucide-react';
import { CtaButton, Reveal, SectionHeading, Stagger, StaggerItem } from '@/components/landing/primitives';

const institutionFeatures = [
  'Semua fitur pembelajaran learner',
  'Bulk learner onboarding',
  'Manajemen learner',
  'Manajemen kelas dan kelompok',
  'Program dan subject assignment',
  'Placement Test untuk learner',
  'Learning progress monitoring',
  'Assessment monitoring',
  'Institutional dashboard',
  'Educator dashboard',
  'Learner progress report',
  'Class progress report',
  'Activity completion report',
  'AI Conversation usage report',
  'Export laporan',
  'Role-based access control',
  'Admin, educator, dan learner roles',
  'Centralized billing',
  'Usage quota management',
  'Custom learner allocation',
  'Custom AI voice quota',
  'Institution branding',
  'Priority support',
  'Assisted onboarding',
  'Training untuk administrator dan educator',
  'Data retention configuration',
  'Security dan privacy configuration',
  'SLA sesuai paket',
  'Integration support',
  'SSO dan API integration pada paket tertentu',
];

interface Tier {
  name: string;
  prefix?: string;
  price: string;
  period?: string;
  note: string;
  features: string[];
  cta?: { label: string; href: string };
}

const tiers: Tier[] = [
  {
    name: 'School Starter',
    prefix: 'Mulai dari:',
    price: 'Rp49.000',
    period: '/ learner / bulan',
    note: 'Untuk 25–99 learner.',
    features: [
      'Learner access',
      'Basic educator dashboard',
      'Class management',
      'Progress reporting',
      'Standard AI quota',
      'Email support',
    ],
  },
  {
    name: 'School Growth',
    prefix: 'Mulai dari:',
    price: 'Rp39.000',
    period: '/ learner / bulan',
    note: 'Untuk 100–499 learner.',
    features: [
      'Semua fitur School Starter',
      'Advanced reporting',
      'Multiple educator accounts',
      'Bulk account management',
      'Higher AI quota options',
      'Priority support',
      'Assisted onboarding',
    ],
  },
  {
    name: 'Institution Enterprise',
    price: 'Hubungi Kami',
    note: 'Untuk 500 learner atau lebih.',
    features: [
      'Custom pricing',
      'Custom AI usage allocation',
      'Dedicated onboarding',
      'Advanced administration',
      'Custom reporting',
      'SSO integration',
      'API integration',
      'Security review',
      'Data retention agreement',
      'Priority SLA',
      'Dedicated support channel',
      'Custom learning program options',
    ],
    cta: { label: 'Hubungi Tim Kaifa', href: '#institusi' },
  },
];

export function PricingInstitution() {
  return (
    <section id="institusi" className="relative px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Untuk Institusi"
          title="School / Institution"
          desc="Solusi pembelajaran terstruktur untuk sekolah, lembaga pendidikan, kursus, komunitas, dan perusahaan."
        />

        <Reveal delay={0.1}>
          <div className="border-rule/70 bg-surface/70 mt-10 rounded-3xl border p-7 backdrop-blur-xl sm:p-9">
            <p className="text-ink-muted max-w-2xl text-[14.5px] leading-[1.75]">
              Harga ditentukan berdasarkan jumlah learner, kebutuhan fitur, penggunaan AI, serta
              tingkat dukungan yang dibutuhkan.
            </p>
            <p className="text-ink mt-6 text-[12px] font-semibold tracking-[0.1em] uppercase">
              Yang institusi dapatkan
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {institutionFeatures.map((f) => (
                <li key={f} className="text-ink-muted flex items-start gap-2.5 text-[13.5px] leading-[1.6]">
                  <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-8">
          <Reveal>
            <p className="text-ink-muted text-[12px] font-semibold tracking-[0.1em] uppercase">
              Estimasi Harga
            </p>
          </Reveal>
          <Stagger className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <StaggerItem key={tier.name} className="h-full">
                <article className="border-rule/70 bg-surface/70 flex h-full flex-col rounded-3xl border p-7 backdrop-blur-xl">
                  <h3 className="font-display text-ink text-[17px] font-bold tracking-[-0.02em]">
                    {tier.name}
                  </h3>
                  {tier.prefix ? <p className="text-ink-muted mt-3 text-[12px]">{tier.prefix}</p> : null}
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-ink text-[24px] font-extrabold tracking-[-0.03em]">
                      {tier.price}
                    </span>
                    {tier.period ? (
                      <span className="text-ink-muted text-[13px] font-medium">{tier.period}</span>
                    ) : null}
                  </div>
                  <p className="text-ink-muted mt-1.5 text-[13px]">{tier.note}</p>

                  <div className="border-rule/70 mt-5 border-t pt-5">
                    <p className="text-ink text-[11.5px] font-semibold tracking-[0.1em] uppercase">
                      Termasuk
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {tier.features.map((f) => (
                        <li key={f} className="text-ink-muted flex items-start gap-2.5 text-[13.5px] leading-[1.6]">
                          <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.cta ? (
                    <CtaButton href={tier.cta.href} variant="ghost" className="mt-6 w-full">
                      {tier.cta.label}
                    </CtaButton>
                  ) : null}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
