import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

const testimonials = [
  {
    quote: "Artificial Lógika no solo entendió nuestra visión, la mejoró. Su enfoque lógico y sistemático transformó completamente nuestra operación. Ahora procesamos 5 veces más pedidos con la mitad del esfuerzo.",
    author: "Carlos Mendoza",
    position: "CEO",
    company: "TechDistrib Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    quote: "La automatización que implementaron nos devolvió literalmente días de trabajo cada semana. Su transparencia y comunicación constante hicieron que el proceso fuera sorprendentemente fluido.",
    author: "María González",
    position: "Directora de Operaciones",
    company: "VetCare Network",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b566?w=100&h=100&fit=crop&crop=face",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-card/10 to-background" id="testimonios">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Confían en nuestra
            <span className="text-primary"> lógica</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nuestros clientes no solo ven resultados, los viven cada día.
          </p>
        </motion.div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="relative p-8 h-full bg-card border-border hover:border-primary/30 transition-all duration-500 group overflow-hidden">
                {/* Elemento decorativo de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                
                {/* Icono de comillas */}
                <motion.div
                  className="relative z-10 mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                </motion.div>

                {/* Rating */}
                <div className="relative z-10 flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + i * 0.1 + 0.5 }}
                    >
                      <Star className="w-5 h-5 fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="relative z-10 text-muted-foreground text-lg leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author info */}
                <div className="relative z-10 flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    {/* Usar AvatarFallback directamente para evitar problemas con imágenes de Unsplash */}
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.position} • {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Borde animado */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/0 rounded-lg"
                  whileHover={{ borderColor: "rgba(64, 217, 172, 0.3)" }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Elemento decorativo */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;