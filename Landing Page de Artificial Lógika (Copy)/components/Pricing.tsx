import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { 
  Check, 
  Crown, 
  ArrowRight, 
  Shield,
  Star,
  Calendar,
  Calculator,
  X,
  Globe,
  MessageSquare,
  Settings,
  Server,
  HeadphonesIcon
} from 'lucide-react';

const Pricing: React.FC = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const customServices = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Página optimizada para conversiones',
      uniquePrice: '150.000',
      monthlyPrice: '36.000',
      maintenancePrice: '30.000',
      monthlyDetails: 'Vercel hosting',
      icon: Globe
    },
    {
      id: 'website',
      name: 'Sitio Web Completo',
      description: 'Sitio web profesional con múltiples páginas',
      uniquePrice: '300.000',
      monthlyPrice: '36.000',
      maintenancePrice: '30.000',
      monthlyDetails: 'Vercel hosting',
      icon: Globe
    },
    {
      id: 'ecommerce',
      name: 'Tienda Online',
      description: 'Ecommerce completo con pagos',
      uniquePrice: '400.000',
      monthlyPrice: '66.000',
      maintenancePrice: '80.000',
      monthlyDetails: 'Vercel + Supabase',
      icon: Globe
    },
    {
      id: 'chatbot',
      name: 'Chatbot IA',
      description: 'Asistente virtual inteligente',
      uniquePrice: '150.000',
      monthlyPrice: '99.000',
      maintenancePrice: '40.000',
      monthlyDetails: 'Vercel + Supabase + Gemini API',
      icon: MessageSquare
    },
    {
      id: 'automation',
      name: 'Automatización',
      description: 'Procesos automatizados personalizados',
      uniquePrice: 'Consultar',
      monthlyPrice: 'Consultar',
      maintenancePrice: 'Consultar',
      monthlyDetails: 'Según tipo de automatización',
      icon: Settings
    },
    {
      id: 'integration',
      name: 'Integraciones',
      description: 'Conectar herramientas existentes',
      uniquePrice: 'Consultar',
      monthlyPrice: 'Consultar',
      maintenancePrice: 'Consultar',
      monthlyDetails: 'Según tipo de integración',
      icon: Settings
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateEstimate = () => {
    const selectedItems = customServices.filter(service => 
      selectedServices.includes(service.id)
    );
    
    if (selectedItems.length === 0) return { unique: '0', monthly: '0' };
    
    let uniqueTotal = 0;
    let monthlyTotal = 0;
    
    selectedItems.forEach(item => {
      if (item.uniquePrice !== 'Consultar') {
        uniqueTotal += parseInt(item.uniquePrice.replace('.', ''));
      }
      if (item.monthlyPrice !== 'Consultar') {
        monthlyTotal += parseInt(item.monthlyPrice.replace('.', ''));
      }
    });
    
    return {
      unique: uniqueTotal > 0 ? uniqueTotal.toLocaleString('es-AR') : 'Consultar',
      monthly: monthlyTotal > 0 ? monthlyTotal.toLocaleString('es-AR') : 'Consultar'
    };
  };

  // Planes de valor actualizados con precios reales
  const valuePlans = [
    {
      name: "Consulta & Análisis",
      subtitle: "Empezamos aquí",
      timeframe: "60 minutos de análisis",
      description: "Conversación gratuita para entender tu situación y diseñar la mejor solución",
      outcomes: [
        "Análisis de tu situación actual",
        "Identificación de oportunidades",
        "Propuesta personalizada",
        "Presupuesto detallado en ARS",
        "Sin compromisos",
        "Consejos útiles aunque no trabajemos juntos"
      ],
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      popular: false,
      cta: "Agendar conversación",
      value: "Gratuita",
      badge: "Sin compromiso",
      action: () => scrollToContact()
    },
    {
      name: "Proyecto Personalizado", 
      subtitle: "El favorito de mis clientes",
      timeframe: "1-4 semanas según complejidad",
      description: "Desde landing pages hasta ecommerce completos, con hosting y mantenimiento incluido",
      outcomes: [
        "Desarrollo completo de tu proyecto",
        "Hosting en infraestructura moderna",
        "Capacitación para gestionar contenido",
        "1-3 meses de ajustes incluidos",
        "Documentación completa",
        "Integración con tus herramientas",
        "Optimización post-lanzamiento",
        "Soporte durante implementación"
      ],
      icon: Crown,
      color: "from-primary to-green-500",
      popular: true,
      cta: "Personalizar mi proyecto",
      value: "$150.000 - $400.000",
      badge: "Más elegido",
      action: () => setShowCustomizer(true)
    },
    {
      name: "Mantenimiento Continuo",
      subtitle: "Tranquilidad total",
      timeframe: "Duración mínima 3 meses",
      description: "Plan mensual para mantener tu plataforma actualizada, segura y funcionando 24/7",
      outcomes: [
        "Soporte técnico por WhatsApp/email",
        "Actualizaciones técnicas automáticas",
        "Backups diarios/semanales",
        "Monitoreo 24/7 y alertas",
        "Revisión mensual de seguridad",
        "Hasta 1 hora de cambios menores",
        "Reportes mensuales opcionales",
        "Sin compromisos a largo plazo"
      ],
      icon: Shield,
      color: "from-purple-500 to-pink-500", 
      popular: false,
      cta: "Ver planes de mantenimiento",
      value: "$20.000 - $80.000/mes",
      badge: "Tranquilidad",
      action: () => scrollToContact()
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding" id="precios">
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
            Precios transparentes
            <span className="text-primary block sm:inline"> en pesos argentinos</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Costos claros desde el primer día. Incluye desarrollo, hosting, capacitación y soporte. 
            <span className="block mt-2 text-primary font-medium">
              Sin sorpresas, sin letra pequeña.
            </span>
          </p>
        </motion.div>

        {/* Value-first plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {valuePlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="relative"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              whileHover={{ y: -10 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <Card className={`relative p-6 sm:p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden ${
                plan.popular ? 'border-primary/50 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20' : 'bg-card'
              }`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <plan.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-4">
                      {plan.subtitle}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-lg sm:text-xl font-bold text-primary mb-1">
                        {plan.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plan.timeframe}
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Incluye:
                    </h4>
                    <ul className="space-y-3">
                      {plan.outcomes.map((outcome, outcomeIndex) => (
                        <motion.li
                          key={outcomeIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: outcomeIndex * 0.05 + index * 0.2 }}
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {outcome}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={plan.action}
                    className={`w-full py-3 sm:py-4 font-medium rounded-lg transition-all duration-300 group/btn ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>

                  {/* Trust indicator */}
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 text-primary" />
                      <span>Garantía de funcionamiento</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border/50 p-8 sm:p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  icon: Server,
                  title: "Hosting moderno incluido",
                  description: "Vercel + Supabase para máxima velocidad y confiabilidad"
                },
                {
                  icon: Calculator,
                  title: "Presupuesto detallado", 
                  description: "Desglose completo de costos únicos, mensualidades y mantenimiento"
                },
                {
                  icon: HeadphonesIcon,
                  title: "Soporte en español",
                  description: "WhatsApp directo conmigo, horario laboral argentino"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.9 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                ¿Querés saber el costo exacto de tu proyecto?
              </h3>
              <p className="text-muted-foreground mb-6">
                Cada proyecto es único. Hablemos 60 minutos y te doy un presupuesto 
                detallado con todos los costos en pesos argentinos.
              </p>
              
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-medium rounded-xl group"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Conversación gratuita de 60 minutos
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                💰 Te doy presupuesto exacto en la primera llamada
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Project Customizer Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Calculadora de Presupuesto
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomizer(false)}
                  className="text-muted-foreground hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground mb-6">
                Seleccioná los servicios que necesitás y te muestro los costos reales:
              </p>

              <div className="space-y-4 mb-6">
                {customServices.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedServices.includes(service.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                        />
                      </div>
                      <service.icon className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="mb-2">
                          <h4 className="font-medium text-white">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-card border border-border rounded p-2">
                            <div className="text-muted-foreground">Desarrollo</div>
                            <div className="font-medium text-primary">
                              ${service.uniquePrice}
                            </div>
                          </div>
                          <div className="bg-card border border-border rounded p-2">
                            <div className="text-muted-foreground">Hosting/mes</div>
                            <div className="font-medium text-white">
                              ${service.monthlyPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {service.monthlyDetails}
                            </div>
                          </div>
                          <div className="bg-card border border-border rounded p-2">
                            <div className="text-muted-foreground">Mantenimiento/mes</div>
                            <div className="font-medium text-white">
                              ${service.maintenancePrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-white mb-4">Resumen de costos:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Desarrollo total</div>
                      <div className="text-xl font-bold text-primary">
                        ${calculateEstimate().unique}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Hosting mensual</div>
                      <div className="text-xl font-bold text-white">
                        ${calculateEstimate().monthly}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Mantenimiento opcional</div>
                      <div className="text-lg font-medium text-white">
                        Desde $20.000/mes
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Precios incluyen desarrollo completo, capacitación y 1-3 meses de ajustes
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomizer(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setShowCustomizer(false);
                    scrollToContact();
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={selectedServices.length === 0}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Solicitar presupuesto oficial
                  </span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pricing;
