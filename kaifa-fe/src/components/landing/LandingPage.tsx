import { Nav } from './Nav';
import { Hero } from './Hero';
import { Features } from './Features';
import { LanguageDuo } from './LanguageDuo';
import { StatsBar } from './StatsBar';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="bg-background font-sans text-ink relative min-h-screen scroll-smooth antialiased">
      <Nav />
      <main>
        <Hero />
        <Features />
        <LanguageDuo />
        <StatsBar />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
