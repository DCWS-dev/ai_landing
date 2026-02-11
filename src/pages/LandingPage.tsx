import { Navbar } from '../components/shared/Navbar';
import { ScrollProgress } from '../components/shared/ScrollProgress';
import { FloatingCTA } from '../components/shared/FloatingCTA';
import { Hero } from '../components/landing/Hero';
import { Problems } from '../components/landing/Problems';
import { Audience } from '../components/landing/Audience';
import { Format } from '../components/landing/Format';
import { Program } from '../components/landing/Program';
import { Benefits } from '../components/landing/Benefits';
import { Speaker } from '../components/landing/Speaker';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { FAQ } from '../components/landing/FAQ';
import { Upsell } from '../components/landing/Upsell';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Problems />
      <Audience />
      <Format />
      <Benefits />
      <Program />
      <Testimonials />
      <Speaker />
      <Pricing />
      <FAQ />
      <Upsell />
      <Footer />
      <FloatingCTA />
    </>
  );
}
