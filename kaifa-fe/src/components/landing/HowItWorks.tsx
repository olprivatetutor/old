'use client';

import { motion } from 'motion/react';
import { Award, Compass, Laptop } from 'lucide-react';
import { SectionHeading } from './primitives';

const steps = [
  {
    icon: Compass,
    n: '01',
    title: 'Choose Course',
    desc: 'Take a two-minute placement and Kaifa maps your baseline across the skills that matter.',
  },
  {
    icon: Laptop,
    n: '02',
    title: 'Learn Anywhere',
    desc: 'Practice on desktop, tablet, or phone — online or offline. Progress follows you everywhere.',
  },
  {
    icon: Award,
    n: '03',
    title: 'Earn Certificate',
    desc: 'Clear mastery checkpoints and receive a verified credential you can actually defend.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from curious to credentialed."
          desc="No overwhelming catalogs. No guessing what to study next. Just a path that keeps adjusting to you."
        />

        <div className="relative mt-16">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[46px] right-0 left-0 hidden h-px origin-left bg-[linear-gradient(90deg,transparent,var(--brand),var(--brand-ai),transparent)] lg:block"
          />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative text-center lg:text-left"
              >
                <div className="flex justify-center lg:justify-start">
                  <span className="relative grid h-[92px] w-[92px] place-items-center rounded-full border border-rule/70 bg-surface/80 backdrop-blur-xl">
                    <span className="grid h-[62px] w-[62px] place-items-center rounded-full bg-[image:var(--gradient-cta)] text-primary-foreground">
                      <s.icon className="h-6 w-6" />
                    </span>
                  </span>
                </div>
                <p className="mt-6 font-mono text-[11px] tracking-[0.24em] text-ink-muted">{s.n}</p>
                <h3 className="mt-2 font-display text-[22px] font-bold tracking-[-0.025em] text-ink">
                  {s.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-[14.5px] leading-[1.7] text-ink-muted lg:mx-0">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
