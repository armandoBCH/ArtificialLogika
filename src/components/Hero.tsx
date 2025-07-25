import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 animate-pulse-glow">
          <Brain className="w-12 h-12 text-primary mr-3" />
          <h2 className="text-2xl font-bold">Artificial Lógika</h2>
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
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 text-primary/30 animate-float">
          <div className="w-3 h-3 bg-current rounded-full" />
        </div>
        <div className="absolute top-40 right-16 text-primary/20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-2 bg-current rounded-full" />
        </div>
        <div className="absolute bottom-32 left-20 text-primary/25 animate-float" style={{ animationDelay: '3s' }}>
          <div className="w-4 h-4 bg-current rounded-full" />
        </div>
      </div>
    </section>
  );
};
