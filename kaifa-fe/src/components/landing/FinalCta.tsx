import { ArrowRight } from 'lucide-react';
import { CtaButton, Glow, Reveal } from './primitives';

export function FinalCta() {
  return (
    <section id="cta" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-mesh)] opacity-80"
      />
      <Glow className="top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-brand-violet/25" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-balance font-display text-[40px] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[58px] lg:text-[66px]">
            Start Learning Today.
            <span className="block bg-[linear-gradient(115deg,var(--brand),var(--brand-ai)_60%,var(--brand-blue))] bg-clip-text text-transparent">
              Build Tomorrow.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-ink-muted">
            Join over 100,000 learners building durable skills with a platform that adapts to
            them — not the other way around.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton href="/login" className="h-13 px-7 text-[16px]">
              Create Free Account{' '}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </CtaButton>
            <CtaButton href="#product" variant="ghost" className="h-13 px-7 text-[16px]">
              Explore the product
            </CtaButton>
          </div>
          <p className="mt-5 text-[13px] text-ink-muted">
            No credit card required · Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}
