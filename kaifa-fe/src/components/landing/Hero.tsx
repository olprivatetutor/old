'use client';

import { motion } from 'motion/react';
import { ArrowRight, Award, BarChart3, Play, Radio, Sparkles, Star } from 'lucide-react';
import { PhoneMockup } from './mockups';
import { CtaButton, Glow, Reveal } from './primitives';

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, delay, repeat: Infinity, ease: 'easeInOut' as const },
});

function FloatingCard({
  icon: Icon,
  label,
  sub,
  className,
  delay,
}: {
  icon: typeof Award;
  label: string;
  sub: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay: 0.5 + delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        {...float(delay)}
        className="flex items-center gap-2.5 rounded-2xl border border-rule/70 bg-surface/75 px-3.5 py-2.5 shadow-[0_20px_45px_-25px_rgba(31,41,55,0.55)] backdrop-blur-2xl"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-cta)] text-primary-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-[12.5px] font-semibold text-ink">{label}</p>
          <p className="text-[10.5px] text-ink-muted">{sub}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 lg:pt-36 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-mesh)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--rule)_1px,transparent_1px),linear-gradient(to_bottom,var(--rule)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]"
      />
      <Glow className="top-[-8%] left-[-10%] h-[420px] w-[420px] bg-brand-blue/25" />
      <Glow className="top-[6%] right-[-8%] h-[460px] w-[460px] bg-brand-violet/25" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-rule/70 bg-surface/70 py-1.5 pr-4 pl-1.5 text-[12.5px] font-medium text-ink-muted backdrop-blur-xl">
              <span className="inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-cta)] px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                <Sparkles className="h-3 w-3" /> New
              </span>
              Trusted by thousands of learners
            </span>
          </Reveal>

          <h1 className="mt-7 text-balance font-display text-[42px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[58px] lg:text-[66px]">
            {['Learn Smarter.', 'Grow Faster.'].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Build Your Future with{' '}
              <span className="bg-[linear-gradient(115deg,var(--brand)_0%,var(--brand-ai)_55%,var(--brand-blue)_100%)] bg-clip-text text-transparent">
                Kaifa
              </span>
              .
            </motion.span>
          </h1>

          <Reveal delay={0.22}>
            <p className="mt-6 max-w-xl text-pretty text-[16.5px] leading-[1.75] text-ink-muted sm:text-[18px]">
              Kaifa helps students, professionals, and lifelong learners access high-quality
              education anytime, anywhere with an intuitive learning experience.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton href="/login">
                Get Started{' '}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </CtaButton>
              <CtaButton href="#product" variant="ghost">
                <Play className="h-3.5 w-3.5 fill-current" /> Watch Demo
              </CtaButton>
            </div>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <span className="flex -space-x-2">
                  {[
                    'from-primary to-secondary',
                    'from-secondary to-brand-blue',
                    'from-brand-blue to-primary',
                  ].map((g) => (
                    <span
                      key={g}
                      className={`h-7 w-7 rounded-full border-2 border-surface bg-gradient-to-br ${g}`}
                    />
                  ))}
                </span>
                100K+ active learners
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9 average rating
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto flex w-full max-w-md justify-center lg:max-w-none">
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 m-auto h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(164,143,216,0.45),transparent_65%)] blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PhoneMockup />
            </motion.div>
          </motion.div>

          <FloatingCard
            icon={Sparkles}
            label="AI Learning"
            sub="Adaptive by design"
            className="-left-2 top-10 sm:left-0 lg:-left-10"
            delay={0}
          />
          <FloatingCard
            icon={Award}
            label="Certificates"
            sub="Verified & shareable"
            className="-right-2 top-28 sm:right-0 lg:-right-6"
            delay={0.6}
          />
          <FloatingCard
            icon={BarChart3}
            label="Progress"
            sub="+38% this month"
            className="bottom-24 -left-3 sm:left-0 lg:-left-12"
            delay={1.2}
          />
          <FloatingCard
            icon={Radio}
            label="Live Classes"
            sub="Every week"
            className="-bottom-2 right-0 lg:-right-4"
            delay={1.8}
          />
        </div>
      </div>
    </section>
  );
}
