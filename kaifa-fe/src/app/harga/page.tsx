import type { Metadata } from 'next';
import { PricingPage } from '@/components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Harga — Kaifa',
  description:
    'Mulai gratis, lalu upgrade sesuai kebutuhan belajar Anda. Bandingkan paket Free, Plus, Pro, dan School / Institution di Kaifa.',
  openGraph: {
    title: 'Harga — Kaifa',
    description:
      'Belajar Lebih Terarah dengan AI Tutor Personal. Bandingkan paket Free, Plus, Pro, dan School / Institution.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Harga() {
  return <PricingPage />;
}
