import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
import { PlexusBackground } from "@/components/PlexusBackground";

export const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <PlexusBackground />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-1" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
          <span className="text-3xl md:text-4xl font-bold text-foreground animate-text-glow">Artificial Lógika</span>
        </div>
        
        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Creamos la{" "}
          <span className="text-primary animate-text-glow">lógica digital</span>
          <br />
          de tu negocio.
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Diseñamos soluciones web e integramos inteligencia artificial para automatizar tus procesos, 
          potenciar tus ventas y liberar tu tiempo.{" "}
          <span className="text-primary font-semibold">Códigos que piensan. Soluciones que funcionan.</span>
        </p>
        
        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl" 
          className="group"
          onClick={() => window.open('https://calendly.com/artificial-logika', '_blank')}
        >
          Agendar una Consulta Gratuita
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};