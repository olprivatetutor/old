import {
  Brain,
  Cloud,
  Code2,
  Database,
  Languages,
  LayoutDashboard,
  Lock,
  Megaphone,
  PenTool,
  TrendingUp,
} from 'lucide-react';
import { SectionHeading, Stagger, StaggerItem } from './primitives';

const categories = [
  { icon: Code2, name: 'Programming', count: '128 courses' },
  { icon: LayoutDashboard, name: 'UI UX', count: '64 courses' },
  { icon: TrendingUp, name: 'Business', count: '52 courses' },
  { icon: PenTool, name: 'Design', count: '71 courses' },
  { icon: Languages, name: 'Language', count: '46 courses' },
  { icon: Megaphone, name: 'Marketing', count: '38 courses' },
  { icon: Brain, name: 'AI', count: '44 courses' },
  { icon: Cloud, name: 'Cloud', count: '33 courses' },
  { icon: Lock, name: 'Cyber Security', count: '29 courses' },
  { icon: Database, name: 'Data Science', count: '57 courses' },
];

export function Categories() {
  return (
    <section id="categories" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Categories"
          title="Ten disciplines. One consistent standard of craft."
          desc="Every category is built by practitioners and held to the same structure: practice-first lessons, mastery checkpoints, and a verified outcome."
        />

        <Stagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <StaggerItem key={c.name}>
              <a
                href="/login"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-rule/70 bg-surface/70 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-secondary/30 hover:shadow-[0_30px_60px_-35px_rgba(98,79,140,0.5)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(124,155,224,0.35),transparent_65%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-subtle/70 text-primary transition-colors duration-500 group-hover:text-secondary">
                  <c.icon className="h-4.5 w-4.5" />
                </span>
                <span className="relative mt-8 block">
                  <span className="block font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-[12.5px] text-ink-muted">{c.count}</span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
