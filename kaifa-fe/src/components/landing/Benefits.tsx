import { Briefcase, CalendarClock, Clock4, MousePointerClick, Users, Wallet } from 'lucide-react';
import { Eyebrow, Glow, Reveal, Stagger, StaggerItem } from './primitives';

const benefits = [
  { icon: Clock4, title: 'Learn Anytime', desc: 'Sessions as short as 10 minutes, designed to fit real life.' },
  { icon: Users, title: 'Expert Mentors', desc: 'Practitioners who ship, teaching what they actually do.' },
  { icon: CalendarClock, title: 'Flexible Schedule', desc: 'Your path adapts when life gets busy — no lost progress.' },
  { icon: MousePointerClick, title: 'Interactive Content', desc: 'Hands-on tasks, quizzes, and projects in every module.' },
  { icon: Wallet, title: 'Affordable', desc: 'One plan, full library. No per-course surprises.' },
  { icon: Briefcase, title: 'Career Ready Skills', desc: 'Outcomes mapped to real job requirements and portfolios.' },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <Glow className="top-1/2 left-[10%] h-[380px] w-[380px] bg-brand-violet/18" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] border border-rule/70 bg-surface/60 backdrop-blur-xl">
            <div
              aria-hidden
              className="absolute inset-0 bg-[image:var(--gradient-mesh)] opacity-90"
            />
            <svg viewBox="0 0 400 400" className="relative h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--brand-ai)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {[150, 118, 86, 54].map((r, i) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="url(#bGrad)"
                  strokeOpacity={0.18 + i * 0.12}
                  strokeWidth="1.5"
                />
              ))}
              <circle cx="200" cy="200" r="34" fill="url(#bGrad)" />
              {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const rr = i % 2 === 0 ? 118 : 150;
                return (
                  <circle
                    key={deg}
                    cx={Math.round(200 + rr * Math.cos(rad))}
                    cy={Math.round(200 + rr * Math.sin(rad))}
                    r={i % 2 === 0 ? 11 : 7}
                    fill="url(#bGrad)"
                    fillOpacity={0.75}
                  />
                );
              })}
              <rect
                x="152"
                y="152"
                width="96"
                height="96"
                rx="28"
                fill="none"
                stroke="url(#bGrad)"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Benefits</Eyebrow>
            <h2 className="mt-5 text-balance font-display text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[46px]">
              Built for people who are serious about getting better.
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <div className="group flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-rule/70 bg-surface/70 text-primary transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-secondary/30 group-hover:text-secondary">
                    <b.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-display text-[16px] font-bold tracking-[-0.02em] text-ink">
                      {b.title}
                    </p>
                    <p className="mt-1 text-[14px] leading-[1.65] text-ink-muted">{b.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
