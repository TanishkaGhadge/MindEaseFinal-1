import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AboutSection } from "@/components/landing/AboutSection";
import { Disclaimer } from "@/components/landing/Disclaimer";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen suede-hero">
      <Navbar />
      <Hero />
      <Features />
      <AboutSection />
      <Disclaimer />
      <Footer />
    </main>
  );
};

export default Index;
