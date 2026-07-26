import { LandingCta } from '@/features/landing/components/landing-cta';
import { LandingFeatures } from '@/features/landing/components/landing-features';
import { LandingFooter } from '@/features/landing/components/landing-footer';
import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingHowItWorks } from '@/features/landing/components/landing-how-it-works';
import { LandingLanguages } from '@/features/landing/components/landing-languages';
import { LandingNavbar } from '@/features/landing/components/landing-navbar';
import { LandingQuote } from '@/features/landing/components/landing-quote';

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] text-[#2f2518]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative">
        <LandingNavbar />
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingLanguages />
        <LandingQuote />
        <LandingCta />
        <LandingFooter />
      </div>
    </main>
  );
}
