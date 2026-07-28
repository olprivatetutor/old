import { Reveal, SectionHeading, Stagger, StaggerItem } from '@/components/landing/primitives';

const addOns = [
  { label: 'Tambahan 30 menit', price: 'Rp25.000' },
  { label: 'Tambahan 90 menit', price: 'Rp65.000' },
  { label: 'Tambahan 180 menit', price: 'Rp119.000' },
];

export function PricingAddOn() {
  return (
    <section id="tambahan" className="relative px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Voice Add-On"
          title="Butuh Lebih Banyak Waktu Bicara dengan AI Tutor?"
        />

        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {addOns.map((a) => (
            <StaggerItem key={a.label}>
              <div className="border-rule/70 bg-surface/70 flex h-full flex-col items-center gap-2 rounded-3xl border p-7 text-center backdrop-blur-xl">
                <p className="text-ink-muted text-[13.5px] font-medium">{a.label}</p>
                <p className="font-display text-ink text-[26px] font-extrabold tracking-[-0.03em]">
                  {a.price}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="text-ink-muted mx-auto mt-8 max-w-2xl text-center text-[13.5px] leading-[1.7]">
            Kuota tambahan berlaku sampai akhir periode billing dan tidak diakumulasikan ke periode
            berikutnya.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
