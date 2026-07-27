'use client';

import { motion } from 'motion/react';
import { Apple, CloudOff, Play, RefreshCw, Smartphone } from 'lucide-react';
import { PhoneMockup } from './mockups';
import { Reveal } from './primitives';

const highlights = [
  { icon: Smartphone, title: 'Learn anywhere', desc: 'A full learning environment that fits in one hand.' },
  { icon: CloudOff, title: 'Offline mode', desc: 'Download modules and keep going without a connection.' },
  { icon: RefreshCw, title: 'Sync progress', desc: 'Every answer syncs the moment you are back online.' },
];

export function MobileApp() {
  return (
    <section className="relative px-4 py-10 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[image:var(--gradient-cta)] px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(60%_60%_at_15%_10%,rgba(124,155,224,0.55),transparent_60%),radial-gradient(55%_55%_at_85%_85%,rgba(164,143,216,0.5),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px]"
        />

        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3.5 py-1.5 text-[11.5px] font-semibold tracking-[0.16em] text-primary-foreground/80 uppercase">
                Mobile app
              </span>
              <h2 className="mt-6 text-balance font-display text-[34px] font-extrabold leading-[1.06] tracking-[-0.035em] text-primary-foreground sm:text-[48px]">
                Your classroom, quietly living in your pocket.
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-[1.75] text-primary-foreground/70">
                Built native-feeling and fast, so a spare ten minutes turns into real progress
                instead of another abandoned tab.
              </p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {highlights.map((h, i) => (
                <Reveal key={h.title} delay={0.08 * i}>
                  <div className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-xl">
                      <h.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="font-display text-[16px] font-bold text-primary-foreground">
                        {h.title}
                      </p>
                      <p className="mt-0.5 text-[14px] text-primary-foreground/65">{h.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: Apple, top: 'Download on the', bottom: 'App Store' },
                  { icon: Play, top: 'Get it on', bottom: 'Google Play' },
                ].map((s) => (
                  <a
                    key={s.bottom}
                    href="/login"
                    className="inline-flex items-center gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-3 text-primary-foreground backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground/20"
                  >
                    <s.icon className="h-5 w-5" />
                    <span className="leading-tight">
                      <span className="block text-[10.5px] opacity-70">{s.top}</span>
                      <span className="block text-[14px] font-semibold">{s.bottom}</span>
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative flex justify-center">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PhoneMockup className="rotate-[-3deg]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
