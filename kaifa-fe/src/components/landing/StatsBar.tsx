'use client';

import { Award, BookOpen, Star, Users } from 'lucide-react';
import { CountUp, Stagger, StaggerItem } from './primitives';

const stats = [
  { icon: Users, value: 8, decimals: 0, suffix: '', label: 'Pelajar Aktif' },
  { icon: BookOpen, value: 16, decimals: 0, suffix: '', label: 'Lesson Selesai' },
  { icon: Award, value: 2, decimals: 0, suffix: '', label: 'Pencapaian Diraih' },
  { icon: Star, value: 4.7, decimals: 1, suffix: '/5', label: 'Rating Pengguna' },
];

export function StatsBar() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <Stagger className="border-rule/70 bg-surface/70 mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-3xl border p-6 backdrop-blur-xl sm:p-8 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="flex items-center gap-3.5">
              <span className="bg-subtle text-primary grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                <s.icon className="h-5 w-5" />
              </span>
              <span>
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  className="font-display text-ink block text-[22px] font-extrabold tracking-[-0.03em]"
                />
                <span className="text-ink-muted block text-[13px]">{s.label}</span>
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
