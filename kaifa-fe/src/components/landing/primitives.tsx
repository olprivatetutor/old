'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-rule/70 bg-surface/70 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-ink-muted uppercase backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: 'center' | 'left';
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'mx-auto max-w-2xl items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.06}>
        <h2 className="font-display text-balance text-[34px] leading-[1.08] font-bold tracking-[-0.03em] text-ink sm:text-[44px] lg:text-[52px]">
          {title}
        </h2>
      </Reveal>
      {desc ? (
        <Reveal delay={0.12}>
          <p className="max-w-xl text-pretty text-[16px] leading-[1.7] text-ink-muted sm:text-[17px]">
            {desc}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string | undefined;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-rule/70 bg-surface/70 backdrop-blur-xl transition-all duration-500',
        'shadow-[0_1px_2px_rgba(31,41,55,0.04),0_18px_50px_-30px_rgba(31,41,55,0.35)]',
        hover &&
          'hover:-translate-y-1.5 hover:border-secondary/30 hover:shadow-[0_1px_2px_rgba(31,41,55,0.04),0_34px_70px_-34px_rgba(98,79,140,0.45)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Glow({ className }: { className?: string | undefined }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full blur-[110px]', className)}
    />
  );
}

export function CtaButton({
  children,
  variant = 'primary',
  href = '#',
  className,
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  href?: string;
  className?: string | undefined;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease }}
      className={cn(
        'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300',
        variant === 'primary'
          ? 'bg-[image:var(--gradient-cta)] text-primary-foreground shadow-[0_12px_34px_-14px_rgba(39,64,41,0.75)]'
          : 'border border-rule/80 bg-surface/70 text-ink backdrop-blur-xl hover:border-secondary/40 hover:text-secondary',
        className,
      )}
    >
      {variant === 'primary' ? (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-[900ms] group-hover:translate-x-full"
        />
      ) : null}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </motion.a>
  );
}
