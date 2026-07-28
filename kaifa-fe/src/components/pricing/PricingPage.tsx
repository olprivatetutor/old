import { Nav } from '@/components/landing/Nav';
import { Footer } from '@/components/landing/Footer';
import { PricingHero } from './PricingHero';
import { PricingPlans } from './PricingPlans';
import { PricingInstitution } from './PricingInstitution';
import { PricingComparison } from './PricingComparison';
import { PricingAddOn } from './PricingAddOn';
import { PricingFaq } from './PricingFaq';
import { PricingCta } from './PricingCta';

export function PricingPage() {
  return (
    <div className="bg-background font-sans text-ink relative min-h-screen scroll-smooth antialiased">
      <Nav />
      <main>
        <PricingHero />
        <PricingPlans />
        <PricingInstitution />
        <PricingComparison />
        <PricingAddOn />
        <PricingFaq />
        <PricingCta />
      </main>
      <Footer />
    </div>
  );
}
