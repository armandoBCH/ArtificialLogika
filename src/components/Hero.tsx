import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
import { PlexusBackground } from "@/components/PlexusBackground";

const heroBackground = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop";

export const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <PlexusBackground />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-1" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/60 border border-primary/20 rounded-lg backdrop-blur-sm shadow-lg animate-pulse-glow">
            <Brain className="w-8 h-8 text-foreground" />
            <span className="text-2xl font-bold text-foreground">Artificial Lógika</span>
          </div>
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