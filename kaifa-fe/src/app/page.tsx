import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Kaifa — Belajar Bahasa Arab & Inggris dengan AI Companion',
  description:
    'Platform pembelajaran berbasis AI untuk pelajar Muslim Indonesia (Kelas VII–XII). Belajar Bahasa Arab dan Inggris lebih interaktif, terstruktur, dan bermakna.',
  openGraph: {
    title: 'Kaifa — Belajar Bahasa Arab & Inggris dengan AI Companion',
    description:
      'Belajar Bahasa Arab dan Bahasa Inggris lebih mudah bersama AI Companion: speaking, kosa kata, quiz interaktif, dan progress analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {
  return <LandingPage />;
}
