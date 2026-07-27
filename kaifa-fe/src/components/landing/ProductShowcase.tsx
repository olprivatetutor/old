import { Check } from 'lucide-react';
import { DesktopMockup, PhoneMockup, TimelineMockup } from './mockups';
import { Eyebrow, Glow, Reveal } from './primitives';

function Row({
  eyebrow,
  title,
  desc,
  points,
  visual,
  flip,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal className={flip ? 'lg:order-2' : undefined}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-5 text-balance font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[38px]">
          {title}
        </h3>
        <p className="mt-4 max-w-lg text-[16px] leading-[1.75] text-ink-muted">{desc}</p>
        <ul className="mt-7 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3 w-3" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className={flip ? 'lg:order-1' : undefined}>
        {visual}
      </Reveal>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section id="product" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <Glow className="top-1/3 left-[-12%] h-[420px] w-[420px] bg-brand-blue/20" />
      <Glow className="top-2/3 right-[-14%] h-[420px] w-[420px] bg-brand-violet/20" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-28">
        <Row
          eyebrow="Desktop dashboard"
          title="One command center for everything you're learning."
          desc="Courses, mastery, streaks, and analytics in a single calm surface — designed with the density of a professional tool and the clarity of a consumer app."
          points={[
            'Live mastery scoring across every skill',
            'Weekly focus recommendations from the adaptive engine',
            'Keyboard-first navigation and instant search',
          ]}
          visual={<DesktopMockup />}
        />

        <Row
          flip
          eyebrow="Mobile & tablet"
          title="Your learning, perfectly shaped to every screen."
          desc="The same engine, re-composed for touch. Pick up a lesson on the train, finish a quiz on a tablet, and everything syncs before you close the app."
          points={[
            'Offline downloads with automatic sync',
            'Session reminders tuned to your rhythm',
            'Certificates stored and shareable from your pocket',
          ]}
          visual={
            <div className="flex items-center justify-center gap-6">
              <div className="hidden w-[240px] rounded-[2rem] border border-rule/70 bg-surface p-3 shadow-[0_40px_90px_-50px_rgba(31,41,55,0.6)] sm:block">
                <div className="rounded-[1.5rem] bg-[image:var(--gradient-soft)] p-4">
                  <p className="text-[10.5px] font-semibold tracking-[0.16em] text-ink-muted uppercase">
                    Tablet
                  </p>
                  <p className="mt-1 font-display text-[16px] font-bold text-ink">Achievements</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl border border-rule/70 ${
                          i < 5 ? 'bg-[image:var(--gradient-cta)]' : 'bg-surface/70'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-[11.5px] text-ink-muted">5 of 9 badges earned</p>
                </div>
              </div>
              <PhoneMockup className="w-[248px] sm:w-[268px]" />
            </div>
          }
        />

        <Row
          eyebrow="Analytics & timeline"
          title="See exactly how understanding compounds."
          desc="Every attempt feeds a transparent model of what you know. No vanity metrics — just the signal you need to decide what to study next."
          points={[
            'Retention curves per concept, not per course',
            'Checkpoint history you can audit at any time',
            'Exportable reports for mentors and institutions',
          ]}
          visual={<TimelineMockup />}
        />
      </div>
    </section>
  );
}
