export const siteConfig = {
  name: 'Kaifa',
  title: 'Kaifa — Belajar Bahasa Arab & Inggris dengan AI Companion',
  description:
    'Platform pembelajaran berbasis AI untuk pelajar Muslim Indonesia (Kelas VII–XII). Belajar Bahasa Arab dan Inggris lebih interaktif, terstruktur, dan bermakna.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kaifa.id').replace(/\/$/, ''),
  locale: 'id_ID',
  keywords: [
    'Kaifa',
    'belajar bahasa Arab',
    'belajar bahasa Inggris',
    'AI Companion',
    'platform pembelajaran Islami',
    'pelajar Muslim Indonesia',
    'kurikulum Kelas VII-XII',
    'aplikasi belajar bahasa',
  ],
  ogImage: '/images/landing/hero-mascot.png',
} as const;
