'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Bot, GraduationCap, Play, ScrollText, ShieldCheck, Sparkles } from 'lucide-react';
import { CtaButton, Glow, Reveal } from './primitives';

const chips = [
  { title: 'اللغة العربية', sub: 'Bahasa Arab', className: 'left-0 top-6 sm:left-2', tone: 'text-primary', delay: 0.1 },
  { title: 'English', sub: 'Language', className: '-left-2 top-32 sm:left-0', tone: 'text-secondary', delay: 0.25 },
];

const trust = [
  { icon: GraduationCap, label: 'Untuk Kelas VII–XII' },
  { icon: ScrollText, label: 'Sesuai Kurikulum' },
  { icon: ShieldCheck, label: 'Aman & Terpercaya' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 lg:pt-32 lg:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-mesh)]" />
      <Glow className="bg-brand-blue/25 top-[-8%] left-[-10%] h-[420px] w-[420px]" />
      <Glow className="bg-brand-violet/25 top-[4%] right-[-8%] h-[460px] w-[460px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <Reveal>
            <span className="border-rule/70 bg-surface/70 text-ink-muted inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-2 text-[12.5px] font-medium backdrop-blur-xl">
              <span className="bg-accent/25 text-accent-foreground grid h-6 w-6 place-items-center rounded-full">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              AI Companion untuk Pelajar Muslim
            </span>
          </Reveal>

          <h1 className="font-display text-ink mt-6 text-balance text-[38px] leading-[1.06] font-extrabold tracking-[-0.045em] sm:text-[52px] lg:text-[58px]">
            <motion.span
              initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-primary block"
            >
              Belajar <span dir="rtl">العربية</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              &amp; Bahasa Inggris Lebih Mudah,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              <span className="text-secondary">Interaktif</span> <span className="text-accent">dan Bermakna</span>
            </motion.span>
          </h1>

          <Reveal delay={0.22}>
            <p className="text-ink-muted mt-6 max-w-xl text-pretty text-[16.5px] leading-[1.75]">
              Kaifa adalah platform pembelajaran pendamping berbasis AI untuk pelajar Muslim Indonesia
              (Kelas VII–XII) agar belajar bahasa lebih efektif dan sesuai nilai-nilai Islam.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton href="/login">
                Mulai Belajar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </CtaButton>
              <CtaButton href="#how" variant="ghost">
                <Play className="h-3.5 w-3.5 fill-current" /> Lihat Cara Kerja
              </CtaButton>
            </div>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="text-ink-muted mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-medium">
              {trust.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-2">
                  <t.icon className="text-primary h-4 w-4" />
                  {t.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto flex w-full max-w-md justify-center lg:max-w-none">
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.72, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 m-auto h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(39,64,41,0.22),transparent_65%)] blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-[86%] max-w-[440px] drop-shadow-[0_40px_60px_rgba(31,41,55,0.18)]"
          >
            <Image
              src="/images/landing/hero-mascot.png"
              alt="Ilustrasi pelajar Kaifa dengan toga hijau membaca buku"
              width={1024}
              height={1024}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          {chips.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.4 + c.delay, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute z-20 ${c.className}`}
            >
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 6, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
                className="border-rule/70 bg-surface/80 rounded-2xl border px-4 py-2.5 text-center shadow-[0_20px_45px_-25px_rgba(31,41,55,0.5)] backdrop-blur-2xl"
              >
                <p className={`font-display text-[15px] font-bold ${c.tone}`}>{c.title}</p>
                <p className="text-ink-muted text-[11px]">{c.sub}</p>
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 left-0 z-20 sm:left-2"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              className="border-rule/70 bg-surface/80 flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 shadow-[0_20px_45px_-25px_rgba(31,41,55,0.5)] backdrop-blur-2xl"
            >
              <span className="bg-accent/25 text-accent-foreground grid h-8 w-8 place-items-center rounded-xl">
                <Bot className="h-4 w-4" />
              </span>
              <p className="text-ink text-[12.5px] font-semibold">AI Companion</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
