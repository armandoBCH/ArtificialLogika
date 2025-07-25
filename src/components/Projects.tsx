import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Clock } from "lucide-react";

const ecommerceImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop";
const crmImage = "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop";

export const Projects = () => {
  const projects = [
    {
      title: "E-commerce Inteligente para \"Marca X\"",
      challenge: "Aumentar la conversión y reducir consultas de soporte.",
      solution: "Desarrollamos un e-commerce en Next.js con un chatbot de IA entrenado en su catálogo, resolviendo el 85% de las dudas pre-venta y guiando al usuario.",
      results: [
        { icon: TrendingUp, text: "+40% en ventas" },
        { icon: Clock, text: "-70% en tickets de soporte" }
      ],
      image: ecommerceImage,
      tech: ["Next.js", "IA Conversacional", "Analytics"]
    },
    {
      title: "Automatización de CRM para \"Consultora Y\"",
      challenge: "Eliminar la carga manual de datos entre sistemas.",
      solution: "Creamos un bot que conecta su formulario web, Google Sheets y CRM, generando reportes diarios automáticamente.",
      results: [
        { icon: Clock, text: "Ahorro de 15 horas semanales" },
        { icon: TrendingUp, text: "100% automatización" }
      ],
      image: crmImage,
      tech: ["Automatización", "API Integration", "Reportes"]
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestro código en{" "}
            <span className="text-primary">acción</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Resultados, no promesas
          </p>
        </div>
        
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-card group-hover:shadow-glow transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {project.title}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Reto:</h4>
                    <p className="text-muted-foreground">{project.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Solución:</h4>
                    <p className="text-muted-foreground">{project.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">Resultado:</h4>
                    <div className="flex flex-wrap gap-4">
                      {project.results.map((result, resultIndex) => (
                        <div 
                          key={resultIndex}
                          className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border"
                        >
                          <result.icon className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-green-400">
                            {result.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="group">
                  Ver caso completo
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
