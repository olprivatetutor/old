'use client';

import { motion } from 'motion/react';
import { Award, BarChart3, BookOpen, Check, Flame, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function Ring({ value, label }: { value: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[68px] w-[68px]">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--rule)" strokeWidth="6" />
          <motion.circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="100%" stopColor="var(--brand-ai)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[13px] font-bold text-ink">
          {value}%
        </span>
      </div>
      <span className="text-[10px] font-medium tracking-[0.12em] text-ink-muted uppercase">
        {label}
      </span>
    </div>
  );
}

export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative w-[280px] rounded-[2.75rem] border border-rule/80 bg-surface p-2.5 shadow-[0_50px_110px_-45px_rgba(31,41,55,0.65)] sm:w-[310px]',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[2.25rem] bg-[image:var(--gradient-soft)] px-4 pt-4 pb-5">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-ink/15" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Good morning</p>
            <p className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
              Your learning
            </p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-cta)] text-[12px] font-bold text-primary-foreground">
            K
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-rule/70 bg-surface/90 p-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-ink">
                Product Design Systems
              </p>
              <p className="text-[10.5px] text-ink-muted">Module 4 of 9 · 22 min left</p>
            </div>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--gradient-cta)] text-primary-foreground">
              <Play className="h-3 w-3 fill-current" />
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-subtle">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '68%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-[image:var(--gradient-cta)]"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Ring value={82} label="Weekly" />
          <Ring value={94} label="Quiz" />
          <Ring value={61} label="Skills" />
        </div>

        <div className="mt-3 rounded-2xl border border-rule/70 bg-surface/90 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              Analytics
            </p>
            <BarChart3 className="h-3.5 w-3.5 text-ink-muted" />
          </div>
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {[38, 62, 45, 80, 55, 92, 70].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={cn('flex-1 rounded-t-md', i === 5 ? 'bg-secondary' : 'bg-primary/25')}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-rule/70 bg-surface/90 p-3">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-secondary/12 text-secondary">
            <Award className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-ink">Certificate unlocked</p>
            <p className="text-[10.5px] text-ink-muted">Data Foundations · verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopMockup({ className }: { className?: string }) {
  const rows = [
    { name: 'Applied Machine Learning', p: 76, tag: 'AI' },
    { name: 'Interface Design Craft', p: 54, tag: 'Design' },
    { name: 'Cloud Architecture', p: 38, tag: 'Cloud' },
  ];
  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-rule/70 bg-surface shadow-[0_40px_90px_-45px_rgba(31,41,55,0.5)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-rule/70 bg-subtle/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <div className="ml-3 h-5 flex-1 rounded-md bg-surface/80" />
      </div>
      <div className="grid grid-cols-[132px_1fr] sm:grid-cols-[168px_1fr]">
        <aside className="hidden border-r border-rule/70 bg-subtle/40 p-4 sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-cta)] text-[11px] font-bold text-primary-foreground">
              K
            </span>
            <span className="font-display text-[13px] font-bold text-ink">Kaifa</span>
          </div>
          <nav className="mt-5 space-y-1.5">
            {['Overview', 'My courses', 'Analytics', 'Certificates', 'Community'].map((n, i) => (
              <div
                key={n}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-[11.5px] font-medium',
                  i === 0 ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted',
                )}
              >
                {n}
              </div>
            ))}
          </nav>
        </aside>
        <div className="p-4 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.16em] text-ink-muted uppercase">
                Learning overview
              </p>
              <p className="mt-1 font-display text-[19px] font-bold tracking-[-0.02em] text-ink sm:text-[22px]">
                This week in focus
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary sm:inline-flex">
              <Flame className="h-3.5 w-3.5" /> 14-day streak
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { k: 'Hours', v: '12.4' },
              { k: 'Mastery', v: '88%' },
              { k: 'Lessons', v: '37' },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-rule/70 bg-subtle/40 p-3">
                <p className="text-[10px] tracking-[0.14em] text-ink-muted uppercase">{s.k}</p>
                <p className="mt-1 font-display text-[18px] font-bold text-ink">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-rule/70 p-4">
            <div className="flex h-24 items-end gap-2">
              {[30, 48, 40, 66, 52, 88, 74, 60, 95, 70, 58, 82].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('flex-1 rounded-t-md', i % 4 === 2 ? 'bg-secondary/70' : 'bg-primary/20')}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {rows.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 rounded-2xl border border-rule/70 px-3.5 py-3"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-secondary/10 text-secondary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{r.name}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-subtle">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.p}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-[image:var(--gradient-cta)]"
                    />
                  </div>
                </div>
                <span className="hidden rounded-full bg-subtle px-2.5 py-1 text-[10.5px] font-semibold text-ink-muted sm:inline">
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineMockup({ className }: { className?: string }) {
  const items = [
    { t: 'Placement complete', d: 'Baseline mapped across 6 skills', done: true },
    { t: 'Adaptive path generated', d: '34 lessons sequenced for you', done: true },
    { t: 'Mastery checkpoint', d: 'Cloud Networking · 92%', done: true },
    { t: 'Capstone project', d: 'Unlocks in 3 lessons', done: false },
  ];
  return (
    <div
      className={cn(
        'rounded-3xl border border-rule/70 bg-surface/80 p-6 shadow-[0_30px_80px_-45px_rgba(31,41,55,0.5)] backdrop-blur-xl',
        className,
      )}
    >
      <p className="text-[10.5px] font-semibold tracking-[0.16em] text-ink-muted uppercase">
        Learning timeline
      </p>
      <ol className="mt-5 space-y-5">
        {items.map((it, i) => (
          <li key={it.t} className="relative flex gap-4">
            {i < items.length - 1 ? (
              <span className="absolute top-8 left-[13px] h-[calc(100%+4px)] w-px bg-rule" />
            ) : null}
            <span
              className={cn(
                'relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border',
                it.done
                  ? 'border-transparent bg-[image:var(--gradient-cta)] text-primary-foreground'
                  : 'border-dashed border-rule bg-surface text-ink-muted',
              )}
            >
              {it.done ? <Check className="h-3.5 w-3.5" /> : <span className="text-[11px]">4</span>}
            </span>
            <div>
              <p className="text-[14px] font-semibold text-ink">{it.t}</p>
              <p className="text-[13px] text-ink-muted">{it.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
