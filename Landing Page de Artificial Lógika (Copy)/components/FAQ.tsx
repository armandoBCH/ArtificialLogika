import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { ChevronDown, MessageCircle, Clock, Shield, Zap } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: "¿Cuánto tiempo toma desarrollar un proyecto típico?",
    answer: "Depende del alcance, pero la mayoría de proyectos web toman entre 4-8 semanas. Proyectos con IA pueden extenderse a 8-12 semanas. Te damos un cronograma detallado después del análisis inicial.",
    icon: Clock,
    category: "Tiempo"
  },
  {
    id: 2,
    question: "¿Qué tecnologías utilizan para el desarrollo?",
    answer: "Usamos React, TypeScript, Node.js, Python para IA, y tecnologías cloud como AWS. Siempre elegimos la mejor herramienta para cada proyecto, no nos casamos con una sola tecnología.",
    icon: Zap,
    category: "Tecnología"
  },
  {
    id: 3,
    question: "¿Ofrecen soporte y mantenimiento después del lanzamiento?",
    answer: "Sí, incluimos 3 meses de soporte gratuito post-lanzamiento. Después ofrecemos planes de mantenimiento mensuales que incluyen actualizaciones, backups y monitoreo 24/7.",
    icon: Shield,
    category: "Soporte"
  },
  {
    id: 4,
    question: "¿Cómo funciona el proceso de facturación?",
    answer: "Trabajamos con pagos en milestones: 30% al inicio, 40% en desarrollo, 30% al finalizar. Para proyectos grandes, podemos ajustar el esquema de pagos según tus necesidades de flujo de caja.",
    icon: MessageCircle,
    category: "Facturación"
  },
  {
    id: 5,
    question: "¿Pueden trabajar con mi equipo interno?",
    answer: "Absolutamente. Nos integramos perfectamente con equipos internos, ya sea como consultores, desarrolladores adicionales o líderes técnicos. Adaptamos nuestra metodología a tu forma de trabajar.",
    icon: MessageCircle,
    category: "Colaboración"
  },
  {
    id: 6,
    question: "¿Qué diferencia a Artificial Lógika de otras consultoras?",
    answer: "Nos especializamos en entender la lógica única de cada negocio. No vendemos soluciones genéricas, sino que creamos código que refleja exactamente cómo funciona tu empresa. Además, combinamos desarrollo tradicional con IA de manera práctica.",
    icon: Zap,
    category: "Diferenciación"
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* Título de sección */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            Preguntas que nos hacen 
            <span className="text-primary block sm:inline"> constantemente</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Resolvemos tus dudas más comunes sobre nuestros servicios, procesos y metodología de trabajo.
          </p>
        </motion.div>

        {/* Lista de preguntas */}
        <div className="space-y-3 sm:space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 sm:p-6 text-left focus:outline-none button-focus-fix"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mobile-text-balance">
                          {item.question}
                        </h3>
                        <span className="text-xs sm:text-sm text-primary font-medium mt-1 block sm:hidden">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="hidden sm:inline text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <motion.div
                        animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="ml-11 sm:ml-14">
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA del FAQ */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm p-6 sm:p-8 border border-border/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                ¿Tienes otra pregunta?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              No encontraste la respuesta que buscabas. Conversemos directamente sobre tu proyecto específico.
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
              Hacer mi pregunta
              <MessageCircle className="w-4 h-4" />
            </motion.button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
