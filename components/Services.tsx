import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Globe, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

const Services: React.FC = () => {
  const { content, loading, error } = useEditableContent();

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const iconMap = {
    'Globe': Globe,
    'MessageSquare': MessageSquare,
    'Zap': Zap,
    'Target': TrendingUp,
    'Building': Users,
    'Code': Globe,
    'ShoppingCart': ShoppingCart
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding" id="servicios">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            Soluciones que 
            <span className="text-primary block sm:inline"> realmente funcionan</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Desarrollo soluciones digitales desde cero, completamente autogestionables, que automatizan procesos 
            y potencian el crecimiento de tu negocio.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {loading ? (
            // Loading state
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="relative p-6 sm:p-8 h-full border-border animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-xl sm:rounded-2xl"></div>
                  <div className="text-right">
                    <div className="w-16 h-4 bg-muted rounded mb-1"></div>
                    <div className="w-12 h-5 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="w-3/4 h-6 bg-muted rounded mb-3"></div>
                <div className="w-full h-4 bg-muted rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-muted rounded mb-6"></div>
                <div className="space-y-2">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="w-full h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </Card>
            ))
          ) : (content.services || []).length === 0 ? (
            // No services state
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {error ? 'Error cargando servicios. Usando contenido por defecto.' : 'No hay servicios configurados.'}
              </p>
            </div>
          ) : (
            // Services loaded
            (content.services || []).map((service: any, index: number) => {
            const IconComponent = iconMap[service?.icon as keyof typeof iconMap] || Globe;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="relative p-6 sm:p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon y valor */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">{service?.benefitTitle || "Beneficio típico"}</div>
                        <div className="text-sm font-bold text-primary">
                          {service?.benefitValue || service?.roi || "Consultar"}
                        </div>
                      </div>
                    </div>

                    {/* Title y Description */}
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {service?.title || "Servicio"}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                      {service?.description || "Descripción del servicio"}
                    </p>

                    {/* Business Value highlight */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Qué consigues</span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {service?.whatYouGet || service?.businessValue || "Genera valor para tu negocio"}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Incluye:
                      </h4>
                      <ul className="space-y-2">
                        {(service?.features || []).slice(0, 4).map((feature: any, featureIndex: number) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: featureIndex * 0.1 + index * 0.2 }}
                          >
                            <div className="flex-shrink-0 w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                              <CheckCircle className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                        {(service?.features || []).length > 4 && (
                          <li className="text-xs text-primary font-medium ml-7">
                            +{(service?.features || []).length - 4} características más
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={scrollToContact}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>{service?.cta || "Quiero esto"}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
        </div>

        {/* Specialties section with ecommerce highlight */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="inline-block bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto shadow-lg backdrop-blur-sm group">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Soluciones 100% Autogestionables
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Todas las soluciones incluyen panel de administración intuitivo para que puedas gestionar todo sin depender de nadie.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-md mx-auto">
                <motion.div 
                  className="flex sm:flex-col items-center gap-3 sm:gap-2"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-300 flex-shrink-0">
                    <span className="text-xl sm:text-2xl">⚡</span>
                  </div>
                  <div className="text-sm sm:text-sm font-medium text-white text-left sm:text-center leading-tight">Fácil gestión</div>
                </motion.div>
                <motion.div 
                  className="flex sm:flex-col items-center gap-3 sm:gap-2"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-300 flex-shrink-0">
                    <span className="text-xl sm:text-2xl">🔧</span>
                  </div>
                  <div className="text-sm sm:text-sm font-medium text-white text-left sm:text-center leading-tight">Sin dependencias</div>
                </motion.div>
                <motion.div 
                  className="flex sm:flex-col items-center gap-3 sm:gap-2"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-300 flex-shrink-0">
                    <span className="text-xl sm:text-2xl">🎯</span>
                  </div>
                  <div className="text-sm sm:text-sm font-medium text-white text-left sm:text-center leading-tight">Control total</div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;