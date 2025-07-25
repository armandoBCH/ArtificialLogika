import { Rocket, Brain, Settings } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Rocket,
      title: "Desarrollo Web de Vanguardia",
      description: "Creamos sitios y plataformas ultrarrápidas, seguras y con un diseño impecable en Next.js. Desde landings que convierten hasta e-commerce que venden, tu presencia online será inolvidable."
    },
    {
      icon: Brain,
      title: "Inteligencia Artificial que Trabaja para Ti",
      description: "Integramos agentes conversacionales (chatbots), copilotos y asistentes que entienden tu negocio. Entrenados con tus datos para responder, recomendar y gestionar como un experto de tu equipo."
    },
    {
      icon: Settings,
      title: "Automatización Inteligente de Procesos",
      description: "Identificamos tareas repetitivas y las transformamos en flujos de trabajo automáticos. Desde generar reportes hasta conectar tus apps, te devolvemos las horas que pierdes en trabajo manual."
    }
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Soluciones a la medida de tu{" "}
            <span className="text-primary">lógica</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border border-border/50"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
