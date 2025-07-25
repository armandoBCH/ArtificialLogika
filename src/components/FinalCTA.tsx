import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          ¿Listo para aplicar una nueva{" "}
          <span className="text-primary animate-text-glow">lógica</span>
          <br />
          a tu negocio?
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Conversemos sobre tus ideas. La primera consulta no tiene costo y te llevarás 
          un plan de acción claro, incluso si decides no trabajar con nosotros.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button 
            variant="cta" 
            size="xl" 
            className="group"
            onClick={() => window.open('https://calendly.com/artificial-logika', '_blank')}
          >
            Hablemos de tu Proyecto
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <div className="text-muted-foreground">
            o
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="group"
            onClick={() => window.open('mailto:contacto@artificiallogika.com.ar', '_blank')}
          >
            <Mail className="w-5 h-5" />
            contacto@artificiallogika.com.ar
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Respuesta en menos de 24 horas • Consulta inicial gratuita
        </p>
      </div>
    </section>
  );
};
