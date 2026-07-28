'use client';

import { Award, BookOpen, Star, Users } from 'lucide-react';
import { Stagger, StaggerItem } from './primitives';

const stats = [
  { icon: Users, value: '50K+', label: 'Pelajar Aktif' },
  { icon: BookOpen, value: '1M+', label: 'Lesson Selesai' },
  { icon: Award, value: '20K+', label: 'Pencapaian Diraih' },
  { icon: Star, value: '4.8/5', label: 'Rating Pengguna' },
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
                <span className="font-display text-ink block text-[22px] font-extrabold tracking-[-0.03em]">
                  {s.value}
                </span>
                <span className="text-ink-muted block text-[13px]">{s.label}</span>
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
