import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';
import { siteConfig } from '@/lib/seo/site-config';

const title = 'Tentang Kaifa — Visi, Pendekatan Belajar & Explainable AI';
const description =
  'Kenali visi Kaifa, pendekatan pembelajaran adaptif, prinsip Explainable AI, tim pendiri, serta komitmen keamanan dan privasi data learner.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title,
    description:
      'Visi Kaifa, pendekatan pembelajaran adaptif, Explainable AI, tim pendiri, serta komitmen keamanan dan privasi data.',
    type: 'website',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1024, height: 1024, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description:
      'Visi Kaifa, pendekatan pembelajaran adaptif, Explainable AI, tim pendiri, serta komitmen keamanan dan privasi data.',
    images: [siteConfig.ogImage],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Tentang Kaifa',
  url: `${siteConfig.url}/about`,
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutPage />
    </>
  );
}
