import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  MessageCircle, 
  Mail, 
  Calendar, 
  ArrowRight, 
  Clock,
  Star,
  Shield,
  TrendingUp,
  Users,
  Coffee
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';
import { useConversionTracking } from '../hooks/useConversionTracking';

const FinalCTA: React.FC = () => {
  const { content } = useEditableContent();
  const { trackCTAClick, trackCallBooking, trackSectionView } = useConversionTracking();

  // Track section view when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSectionView('final_cta');
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector('#contacto');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [trackSectionView]);

  const handlePrimaryClick = () => {
    trackCTAClick('final_cta', 'Conversación gratuita');
    trackCallBooking();
  };

  const handleEmailClick = () => {
    trackCTAClick('final_cta', 'Email Contact');
  };

  // Safe access to founder info with fallbacks
  const founderName = content?.company?.founderName || 'Alex';
  const founderTitle = content?.company?.founderTitle || 'Developer & Fundador';
  const founderTitleShort = founderTitle.split('•')[0]?.trim() || founderTitle;

  return (
    <section className="relative py-24 px-6 overflow-hidden" id="contacto">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header más humilde */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            ¿Hablamos de tu 
            <span className="text-primary"> situación específica</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong className="text-white">Conversación honesta de 30-60 minutos.</strong> Te cuento si puedo ayudarte 
            y cómo. Si no encajamos, te digo por qué y te sugiero alternativas.
            <span className="block mt-2 text-primary">
              Sin presión comercial. Solo una charla entre profesionales.
            </span>
          </p>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="relative p-8 md:p-12 bg-gradient-to-br from-card via-card to-primary/5 border-border hover:border-primary/30 transition-all duration-500 overflow-hidden group">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full transform -translate-x-16 translate-y-16 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
              {/* Header personal */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
                  <Coffee className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {founderName} • {founderTitleShort}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-muted/20 border border-border/50 rounded-full px-4 py-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">
                    Disponible para nuevos proyectos
                  </span>
                </div>
              </div>

              {/* Qué incluye la conversación */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: MessageCircle,
                    title: "Conversación honesta",
                    description: "Te digo si puedo ayudarte o no. Si no es mi área, te recomiendo a alguien mejor.",
                    social: "Sin sales pitch"
                  },
                  {
                    icon: TrendingUp,
                    title: "Análisis gratuito",
                    description: "Revisamos tu situación y identificamos 2-3 oportunidades de mejora.",
                    social: "Ideas útiles gratis"
                  },
                  {
                    icon: Shield,
                    title: "Propuesta clara",
                    description: "Si encajamos, te doy cronograma, precio exacto y qué esperar.",
                    social: "Sin sorpresas"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {benefit.description}
                    </p>
                    <div className="text-xs text-primary font-medium">
                      {benefit.social}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Realidad sobre el negocio */}
              <motion.div
                className="bg-muted/5 border border-muted/20 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <Coffee className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      🤝 Mi approach realista:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="text-muted-foreground">
                        • <span className="text-white font-medium">Trabajo directo</span> contigo (no team gigante)
                      </div>
                      <div className="text-muted-foreground">
                        • <span className="text-white font-medium">Enfoque personalizado</span> en cada proyecto
                      </div>
                      <div className="text-muted-foreground">
                        • <span className="text-white font-medium">Precios honestos</span> sin letra pequeña
                      </div>
                      <div className="text-muted-foreground">
                        • <span className="text-white font-medium">Resultados realistas</span>, no milagros
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    onClick={handlePrimaryClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-xl group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Agendar conversación gratuita
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    
                    {/* Efecto de brillo */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="text-muted-foreground text-sm"
                >
                  o escribeme directamente:
                </motion.div>

                <motion.a
                  href={`mailto:${content?.company?.email || 'info@artificiallogika.com'}?subject=Consulta sobre automatización&body=Hola, me interesa saber si puedes ayudarme con mi negocio.`}
                  onClick={handleEmailClick}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <Mail className="w-4 h-4" />
                  {content?.company?.email || 'info@artificiallogika.com'}
                </motion.a>
              </div>

              {/* Testimonial realista */}
              <motion.div
                className="text-center border-t border-border/50 pt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
              >
                <div className="mb-4">
                  <div className="flex justify-center items-center gap-2 text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-white font-medium mb-2">
                    "Alex fue super directo. Me dijo que mi idea no necesitaba automatización compleja, 
                    solo un par de ajustes simples. Me ahorró dinero y tiempo."
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">
                    - María G., Consultora
                  </cite>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-primary" />
                    <span>Conversación sin presión</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>Respuesta en 24h típicamente</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-primary" />
                    <span>Approach humano</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;