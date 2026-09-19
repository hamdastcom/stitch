import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { HeroBackground } from "./_components/HeroBackground";
import { Steps } from "./_components/Steps";
import { Features } from "./_components/Features";
import { Characters, Pricing } from "./_components/Characters";
import { Testimonials } from "./_components/Testimonials";
import { Faq } from "./_components/Faq";
import { CtaFooter } from "./_components/CtaFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="relative">
          <HeroBackground />
          <Hero />
          <Steps />
        </div>
        <Features />
        <Characters />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <CtaFooter />
    </>
  );
}
