import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      text: "El chatbot que nos entregó Artificial Lógika es simplemente brillante. Entiende a nuestros clientes y nos liberó una cantidad de tiempo impresionante. El proceso fue claro y profesional de principio a fin.",
      author: "CEO, Empresa de Servicios",
      rating: 5
    },
    {
      text: "Transformaron completamente nuestro flujo de trabajo. Lo que antes nos tomaba horas ahora se hace automáticamente. La atención personalizada y la calidad técnica superaron nuestras expectativas.",
      author: "Director de Operaciones, Consultora",
      rating: 5
    },
    {
      text: "No solo nos entregaron una solución técnica, sino que nos educaron en el proceso. Ahora entendemos cómo la IA puede potenciar nuestro negocio a largo plazo.",
      author: "Fundador, Startup Tech",
      rating: 5
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            La voz de nuestros{" "}
            <span className="text-primary">clientes</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border border-border/50 relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4 mt-4">
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial text */}
              <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
