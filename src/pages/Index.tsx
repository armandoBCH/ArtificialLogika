import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ValueProposition } from "@/components/ValueProposition";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Hero />
      <Services />
      <ValueProposition />
      <Projects />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
