import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { ChevronDown, MessageCircle, Clock, Shield, Zap } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const openWhatsApp = () => {
    const phoneNumber = "+542284638361";
    const message = "¡Hola! Tengo una pregunta específica sobre tus servicios que no encontré en la página. ¿Podrías ayudarme?";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const faqs = [
    {
      question: "¿Qué diferencia hay entre el desarrollo y el mantenimiento?",
      answer: "El desarrollo es el costo único para crear tu proyecto desde cero (landing, ecommerce, etc.). El mantenimiento es opcional y cubre hosting, actualizaciones, soporte técnico y hasta 1 hora mensual de cambios menores. Puedes elegir solo desarrollo y gestionar el hosting por tu cuenta, o contratar el mantenimiento para tranquilidad total."
    },
    {
      question: "¿Realmente puedo gestionar el contenido sin saber programar?",
      answer: "Absolutamente. Desarrollo con sistemas autogestionables: panel de administración intuitivo, capacitación incluida, y documentación paso a paso. Cambias textos, imágenes, precios y productos sin tocar código. Si necesitas algo más complejo, ahí estoy para ayudarte."
    },
    {
      question: "¿Por qué Vercel + Turso en lugar de WordPress?",
      answer: "Velocidad y confiabilidad. WordPress puede ser lento y requiere mantenimiento constante. Vercel garantiza velocidad de carga de 1-2 segundos y Turso es una base de datos moderna y escalable. Es tecnología de 2025, no de 2005."
    },
    {
      question: "¿Incluye diseño o solo programación?",
      answer: "Incluye todo: análisis de tu negocio, diseño UI/UX, desarrollo completo, capacitación y soporte. No necesitas contratar diseñador aparte. Trabajo directo contigo para entender tu visión y la ejecuto completamente."
    },
    {
      question: "¿Qué pasa si no estoy satisfecho con el resultado?",
      answer: "Incluyo 1-3 meses de ajustes según el proyecto. Trabajamos juntos hasta que estés 100% conforme. Mi reputación depende de tu satisfacción, así que me aseguro de que el resultado final supere tus expectativas."
    },
    {
      question: "¿Puedes integrar con mis herramientas actuales?",
      answer: "Sí. Integro con Mercado Pago, Stripe, WhatsApp Business, Google Analytics, Facebook Pixel, Mailchimp, HubSpot, y muchas más. Si usas algo específico, conversamos para ver la mejor forma de conectarlo."
    },
    {
      question: "¿Trabajas con empresas grandes o solo PyMEs?",
      answer: "Me enfoco en PyMEs, emprendedores y profesionales que valoran la atención personalizada. Trabajo directo contigo, no con intermediarios. Si eres una empresa grande, puedo recomendarte agencias especializadas en proyectos de mayor escala."
    },
    {
      question: "¿Cuánto tiempo demora un proyecto típico?",
      answer: "Landing page: 1-2 semanas. Sitio web completo: 2-3 semanas. Ecommerce: 3-4 semanas. Chatbot IA: 1-2 semanas. Los tiempos incluyen diseño, desarrollo, pruebas y capacitación. Siempre prefiero calidad sobre velocidad."
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            Preguntas que me hacen
            <span className="text-primary block sm:inline"> todos los días</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Respuestas honestas a las dudas más comunes sobre desarrollo web, 
            <span className="block mt-2">
              precios, tiempos y qué esperar trabajando conmigo.
            </span>
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12 sm:mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <button
                  className="w-full p-6 sm:p-8 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      className="flex-shrink-0"
                      animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="w-full h-px bg-border/30 mb-4" />
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: Clock,
              title: "Respuesta rápida",
              description: "Contestación en menos de 24 horas, horario laboral argentino"
            },
            {
              icon: Shield,
              title: "Sin presión comercial",
              description: "Conversación honesta sobre si puedo ayudarte o no"
            },
            {
              icon: Zap,
              title: "Propuesta clara",
              description: "Cronograma, precio exacto y qué esperar desde el día 1"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA final */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
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
              onClick={openWhatsApp}
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