import { Nav } from './Nav';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { ProductShowcase } from './ProductShowcase';
import { Benefits } from './Benefits';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { Categories } from './Categories';
import { MobileApp } from './MobileApp';
import { Faq } from './Faq';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="landing-theme relative min-h-screen scroll-smooth bg-background font-display text-ink antialiased">
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <ProductShowcase />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <Categories />
        <MobileApp />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
