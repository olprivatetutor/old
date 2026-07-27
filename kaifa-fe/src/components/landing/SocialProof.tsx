import { CountUp } from './CountUp';
import { Reveal, Stagger, StaggerItem } from './primitives';

const partners = [
  'Northgate University',
  'Cendekia Institute',
  'Orbit Labs',
  'Helvetia College',
  'Nusantara Tech',
  'Meridian Academy',
];

const stats = [
  { value: 100, suffix: 'K+', label: 'Active Learners' },
  { value: 500, suffix: '+', label: 'Courses' },
  { value: 98, suffix: '%', label: 'Completion Satisfaction' },
  { value: 4.9, suffix: '★', label: 'Average Rating', decimals: 1 },
];

export function SocialProof() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-[11.5px] font-semibold tracking-[0.22em] text-ink-muted uppercase">
            Trusted by universities, teams, and independent learners
          </p>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <StaggerItem key={p}>
              <div className="flex items-center justify-center gap-2 opacity-55 transition-opacity duration-300 hover:opacity-100">
                <span className="h-5 w-5 rounded-md bg-[image:var(--gradient-cta)]" />
                <span className="font-display text-[12.5px] font-bold tracking-[-0.02em] text-ink">
                  {p}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-rule/70 bg-rule/70 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="h-full bg-surface/70 px-6 py-8 text-center backdrop-blur-xl">
                <p className="font-display text-[34px] font-extrabold tracking-[-0.04em] text-ink sm:text-[42px]">
                  <CountUp value={s.value} decimals={s.decimals ?? 0} />
                  <span className="bg-[linear-gradient(115deg,var(--brand),var(--brand-ai))] bg-clip-text text-transparent">
                    {s.suffix}
                  </span>
                </p>
                <p className="mt-2 text-[13px] font-medium text-ink-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
