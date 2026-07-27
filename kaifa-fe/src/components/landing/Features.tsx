import {
  BookOpenCheck,
  CloudDownload,
  LineChart,
  MessagesSquare,
  Moon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { GlassCard, SectionHeading, Stagger, StaggerItem } from './primitives';

const features = [
  {
    icon: BookOpenCheck,
    title: 'Interactive Learning',
    desc: 'Lessons built around practice, not passive video. Every concept ends in a task you actually do.',
  },
  {
    icon: Sparkles,
    title: 'AI Personalized Learning',
    desc: 'An adaptive engine re-sequences your path after every answer, so difficulty always fits you.',
  },
  {
    icon: ShieldCheck,
    title: 'Certification',
    desc: 'Verified, shareable credentials backed by real mastery checkpoints — not attendance.',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    desc: 'Real-time analytics on mastery, pace, and retention across every skill you are building.',
  },
  {
    icon: CloudDownload,
    title: 'Offline Learning',
    desc: 'Download modules, keep learning without a connection, and sync progress automatically.',
  },
  {
    icon: MessagesSquare,
    title: 'Community Discussion',
    desc: 'Threaded discussions, mentor answers, and peer study rooms attached to every lesson.',
  },
  {
    icon: Moon,
    title: 'Dark Mode Support',
    desc: 'A carefully tuned dark theme for late-night sessions, with the same clarity and contrast.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Kaifa"
          title={
            <>
              Everything a modern learner needs,{' '}
              <span className="text-ink-muted">nothing they don&apos;t.</span>
            </>
          }
          desc="Kaifa is engineered like a product team builds software: opinionated, fast, and obsessed with the details that make learning stick."
        />

        <Stagger className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <StaggerItem key={f.title} className={i === 0 ? 'lg:col-span-2' : undefined}>
              <GlassCard className="h-full p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(164,143,216,0.28),transparent_65%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl border border-rule/70 bg-subtle/60 text-primary transition-colors duration-500 group-hover:border-secondary/30 group-hover:text-secondary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
                  {f.title}
                </h3>
                <p className="relative mt-2.5 max-w-md text-[14.5px] leading-[1.7] text-ink-muted">
                  {f.desc}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
