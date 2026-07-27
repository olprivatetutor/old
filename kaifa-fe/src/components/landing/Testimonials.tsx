import { Quote, Star } from 'lucide-react';
import { GlassCard, SectionHeading, Stagger, StaggerItem } from './primitives';

const testimonials = [
  {
    initials: 'AR',
    name: 'Adnan R.',
    role: 'Software Engineer',
    gradient: 'from-primary to-secondary',
    quote:
      'The adaptive path is the real thing. It kept pushing me exactly one step past comfortable, and I finally finished a course instead of abandoning it at 30%.',
  },
  {
    initials: 'LM',
    name: 'Laila M.',
    role: 'Curriculum Lead',
    gradient: 'from-secondary to-brand-blue',
    quote:
      'We rolled Kaifa out to three cohorts. The analytics gave our mentors something they never had before: an honest picture of where understanding breaks down.',
  },
  {
    initials: 'TS',
    name: 'Tomas S.',
    role: 'Product Designer',
    gradient: 'from-brand-blue to-primary',
    quote:
      'It feels like a tool, not a course marketplace. Fast, quiet, beautifully built — I actually look forward to opening it in the morning.',
  },
];

export function Testimonials() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Learners stay because the product respects their time."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <GlassCard className="flex h-full flex-col p-7">
                <Quote className="h-6 w-6 text-secondary/40" />
                <p className="mt-4 flex-1 text-[15px] leading-[1.75] text-ink">
                  &quot;{t.quote}&quot;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-rule/70 pt-5">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-[13px] font-bold text-primary-foreground`}
                    aria-hidden
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                    <p className="text-[12.5px] text-ink-muted">{t.role}</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                  </span>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
