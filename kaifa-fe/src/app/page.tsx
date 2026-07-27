import { Plus_Jakarta_Sans } from 'next/font/google';
import { LandingPage } from '@/components/landing/LandingPage';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-landing-sans',
  subsets: ['latin'],
});

export default function HomePage() {
  return (
    <div className={plusJakartaSans.variable}>
      <LandingPage />
    </div>
  );
}
