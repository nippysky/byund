// app/page.tsx
import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhoItsFor from "@/components/landing/WhoItsFor";
import FinalCTA from "@/components/landing/FinalCTA";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/layout/Footer";
import ForDevelopers from "@/components/landing/ForDevelopers";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-24 space-y-32">
        <Hero />
        <HowItWorks />
        <WhoItsFor />
      </main>

      <ForDevelopers />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
