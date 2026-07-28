import { SectionHeading, Reveal } from '@/components/landing/primitives';

const rows: [string, string, string, string, string][] = [
  ['Harga bulanan', 'Rp0', 'Rp129.000', 'Rp229.000', 'Custom'],
  ['Placement Test', '1 kali', 'Penuh', 'Penuh', 'Penuh'],
  ['Learning module', 'Terbatas', 'Penuh', 'Penuh', 'Penuh'],
  ['Vocabulary dan grammar', 'Dasar', 'Penuh', 'Penuh', 'Penuh'],
  ['Reading dan listening', 'Dasar', 'Penuh', 'Penuh', 'Penuh'],
  ['Assessment', 'Basic', 'Penuh', 'Penuh', 'Penuh'],
  ['AI text conversation', '30 turns', 'Fair-use', 'Higher fair-use', 'Custom quota'],
  ['AI voice conversation', '10 menit', '90 menit', '240 menit', 'Custom quota'],
  ['Realtime conversation', 'Tidak', 'Belum', 'Setelah tersedia', 'Opsional'],
  ['Transcript', 'Ya', 'Ya', 'Ya', 'Ya'],
  ['Translation', 'Terbatas', 'Penuh', 'Penuh', 'Penuh'],
  ['Transliteration', 'Terbatas', 'Penuh', 'Penuh', 'Penuh'],
  ['Personalized feedback', 'Terbatas', 'Ya', 'Advanced', 'Ya'],
  ['Pronunciation feedback', 'Basic', 'Standard', 'Advanced', 'Sesuai paket'],
  ['Progress dashboard', 'Basic', 'Penuh', 'Advanced', 'Institutional'],
  ['Learning history', '7 hari', 'Penuh', 'Penuh', 'Penuh'],
  ['Export report', 'Tidak', 'Learning summary', 'Advanced report', 'Institutional report'],
  ['Educator dashboard', 'Tidak', 'Tidak', 'Tidak', 'Ya'],
  ['Class management', 'Tidak', 'Tidak', 'Tidak', 'Ya'],
  ['Bulk learner management', 'Tidak', 'Tidak', 'Tidak', 'Ya'],
  ['SSO dan API', 'Tidak', 'Tidak', 'Tidak', 'Paket Enterprise'],
  ['Support', 'Community', 'Email', 'Priority', 'Priority / Dedicated'],
];

export function PricingComparison() {
  return (
    <section id="perbandingan" className="relative px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Perbandingan Paket" />

        <Reveal delay={0.1}>
          <div className="border-rule/70 bg-surface/70 mt-10 overflow-x-auto rounded-3xl border backdrop-blur-xl">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-rule/70 border-b">
                  <th className="text-ink px-5 py-4 font-semibold">Fitur</th>
                  <th className="text-ink px-5 py-4 font-semibold">Free</th>
                  <th className="text-secondary px-5 py-4 font-semibold">Plus</th>
                  <th className="text-ink px-5 py-4 font-semibold">Pro</th>
                  <th className="text-ink px-5 py-4 font-semibold">School / Institution</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([feature, free, plus, pro, school], i) => (
                  <tr key={feature} className={i % 2 === 1 ? 'bg-subtle/40' : undefined}>
                    <td className="text-ink px-5 py-3.5 font-medium">{feature}</td>
                    <td className="text-ink-muted px-5 py-3.5">{free}</td>
                    <td className="text-ink-muted px-5 py-3.5">{plus}</td>
                    <td className="text-ink-muted px-5 py-3.5">{pro}</td>
                    <td className="text-ink-muted px-5 py-3.5">{school}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
