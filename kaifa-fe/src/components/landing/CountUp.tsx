'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame += 1;
      const p = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(value * p);
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, value]);

  return <span ref={ref}>{display.toFixed(decimals)}</span>;
}
