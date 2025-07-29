import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Search, Lightbulb, Code, Rocket } from 'lucide-react';

const processSteps = [
  {
    step: 1,
    icon: Search,
    title: "Análisis Profundo",
    description: "Estudiamos tu negocio, identificamos oportunidades y entendemos tu lógica específica. No hay soluciones genéricas, solo estrategias personalizadas.",
    duration: "1-2 semanas",
    color: "from-blue-400 to-blue-600"
  },
  {
    step: 2,
    icon: Lightbulb,
    title: "Diseño Inteligente",
    description: "Creamos prototipos y wireframes que reflejan exactamente cómo debe funcionar tu solución. Cada elemento tiene un propósito claro.",
    duration: "2-3 semanas",
    color: "from-purple-400 to-purple-600"
  },
  {
    step: 3,
    icon: Code,
    title: "Desarrollo Ágil",
    description: "Codificamos con tecnologías de vanguardia, manteniéndote informado en cada sprint. Calidad, velocidad y transparencia total.",
    duration: "4-8 semanas",
    color: "from-primary to-green-500"
  },
  {
    step: 4,
    icon: Rocket,
    title: "Lanzamiento y Optimización",
    description: "Implementamos, monitoreamos y optimizamos continuamente. Tu éxito es nuestro éxito, por eso te acompañamos después del lanzamiento.",
    duration: "Ongoing",
    color: "from-orange-400 to-red-500"
  }
];

const ProcessSteps: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding" id="proceso">
      <div className="max-w-7xl mx-auto">
        {/* Título de sección */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            Cómo transformamos tu 
            <span className="text-primary block sm:inline"> idea en realidad</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Un proceso probado que ha llevado al éxito a más de 50 empresas. Transparente, eficiente y centrado en resultados.
          </p>
        </motion.div>

        {/* Proceso paso a paso - Mobile First */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
              }}
            >
              {/* Línea conectora - Solo visible en desktop */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}

              {/* Línea conectora vertical - Solo visible en mobile */}
              {index < processSteps.length - 1 && (
                <div className="lg:hidden absolute top-full left-8 w-px h-8 bg-gradient-to-b from-primary/50 to-transparent z-0" />
              )}

              <Card className="relative p-4 sm:p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Contenido */}
                <div className="relative z-10">
                  {/* Número del paso */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-primary-foreground">
                          {step.step}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                    {step.description}
                  </p>

                  {/* Duración */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-xs sm:text-sm text-primary font-medium">
                      {step.duration}
                    </span>
                  </div>
                </div>

                {/* Elemento decorativo */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA del proceso */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/50 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              ¿Listo para comenzar tu transformación digital?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Cada gran proyecto comienza con una conversación. Hablemos sobre tu visión.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors button-focus-fix"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#contacto');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Comenzar mi proyecto
              <Rocket className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSteps;