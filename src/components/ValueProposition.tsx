import { CheckCircle } from "lucide-react";

export const ValueProposition = () => {
  const values = [
    {
      title: "Lógica + Innovación",
      description: "No aplicamos tecnología por moda. Cada línea de código y cada algoritmo tiene un propósito claro: resolver un problema real de tu negocio de la forma más eficiente y escalable posible."
    },
    {
      title: "Soluciones a Medida, no Plantillas",
      description: "Escuchamos tus necesidades para construir una solución única. Tu negocio es diferente, tu software también debería serlo. Olvídate de las soluciones genéricas que no se adaptan a ti."
    },
    {
      title: "Transparencia Radical",
      description: "Comunicación directa, sin intermediarios ni jerga incomprensible. Entenderás cada paso del proceso y tendrás control total sobre el proyecto. Somos tu equipo técnico de confianza."
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Más que un proveedor,{" "}
              <span className="text-primary">un socio estratégico.</span>
            </h2>
            
            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visual element */}
          <div className="relative">
            <div className="w-full h-96 bg-gradient-dark rounded-3xl p-8 shadow-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Analizando requirements...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <span className="text-sm text-muted-foreground">Diseñando arquitectura...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <span className="text-sm text-muted-foreground">Implementando solución...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-400 font-semibold">✓ Solución entregada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
