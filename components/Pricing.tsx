import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
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
  HeadphonesIcon,
  Info,
  Zap,
  Cloud,
  Code,
  Wrench,
  Database,
  Layout,
  CheckCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

const Pricing: React.FC = () => {
  const { content } = useEditableContent();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const openWhatsApp = (message?: string) => {
    const phoneNumber = content.company.phone.replace('+', '');
    const defaultMessage = "¡Hola! Me interesa conocer más sobre tus precios y servicios. ¿Podrías darme información personalizada?";
    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleExpanded = (serviceId: string) => {
    setExpandedService(prev => prev === serviceId ? null : serviceId);
  };

  const calculateEstimate = () => {
    const selectedItems = content.pricing.customServices.filter(service => 
      selectedServices.includes(service.id)
    );
    
    if (selectedItems.length === 0) return { 
      development: '0', 
      infrastructure: '0', 
      maintenance: '0',
      hasInfrastructure: false,
      hasSupabase: false
    };
    
    let developmentTotal = 0;
    let infrastructureTotal = 0;
    let maintenanceTotal = 0;
    let hasInfrastructureService = false;
    let hasSupabaseService = false;
    
    selectedItems.forEach(item => {
      if (item.developmentPrice !== 'Consultar') {
        developmentTotal += parseInt(item.developmentPrice.replace(/\./g, ''));
      }
      if (item.infrastructurePrice !== 'Consultar' && item.infrastructurePrice !== '0') {
        infrastructureTotal += parseInt(item.infrastructurePrice.replace(/\./g, ''));
        hasInfrastructureService = true;
        if (item.databaseType === 'supabase') {
          hasSupabaseService = true;
        }
      }
      if (item.maintenancePrice !== 'Consultar') {
        maintenanceTotal += parseInt(item.maintenancePrice.replace(/\./g, ''));
      }
    });
    
    return {
      development: developmentTotal > 0 ? developmentTotal.toLocaleString('es-AR') : 'Consultar',
      infrastructure: infrastructureTotal > 0 ? infrastructureTotal.toLocaleString('es-AR') : '0',
      maintenance: maintenanceTotal > 0 ? maintenanceTotal.toLocaleString('es-AR') : 'Consultar',
      hasInfrastructure: hasInfrastructureService,
      hasSupabase: hasSupabaseService
    };
  };

  const getDatabaseBadge = (databaseType: string) => {
    const { badges } = content.pricing.settings;
    switch (databaseType) {
      case 'sqlite':
        return (
          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
            <Database className="w-3 h-3 mr-1" />
            {badges.sqliteText}
          </Badge>
        );
      case 'supabase':
        return (
          <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Database className="w-3 h-3 mr-1" />
            {badges.supabaseText}
          </Badge>
        );
      case 'none':
        return (
          <Badge variant="secondary" className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/20">
            <Cloud className="w-3 h-3 mr-1" />
            {badges.noDatabaseText}
          </Badge>
        );
      default:
        return null;
    }
  };

  const iconMap = {
    'Calendar': Calendar,
    'Crown': Crown,
    'Shield': Shield,
    'Globe': Globe,
    'MessageSquare': MessageSquare,
    'Settings': Settings,
    'Zap': Zap,
    'Server': Server,
    'Calculator': Calculator,
    'HeadphonesIcon': HeadphonesIcon
  };

  const { settings } = content.pricing;

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
            {settings.headerTitle}
            <span className="text-primary block sm:inline"> {settings.headerSubtitle}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            {settings.headerDescription}
            <span className="block mt-2 text-primary font-medium">
              {settings.headerHighlight}
            </span>
          </p>
          
          {/* Exchange rate indicator */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Dólar de referencia: ${settings.exchangeRate} ARS
            </span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
        </motion.div>

        {/* Value-first plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {content.pricing.plans.map((plan, index) => {
            const IconComponent = iconMap[plan.icon as keyof typeof iconMap] || Calendar;
            
            return (
              <motion.div
                key={plan.id}
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
                          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                      onClick={() => {
                        if (plan.name === "Proyecto Personalizado") {
                          setShowCustomizer(true);
                        } else {
                          const message = plan.name === "Consulta & Análisis" 
                            ? "¡Hola! Me gustaría agendar una consulta gratuita de 60 minutos para analizar mi situación y recibir una propuesta personalizada."
                            : "¡Hola! Me interesa conocer más sobre los planes de mantenimiento continuo para mantener mi plataforma funcionando 24/7.";
                          openWhatsApp(message);
                        }
                      }}
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
            );
          })}
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
              {settings.benefits.map((benefit, index) => {
                const BenefitIcon = iconMap[benefit.icon as keyof typeof iconMap] || Server;
                
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.9 }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BenefitIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                {settings.bottomSectionTitle}
              </h3>
              <p className="text-muted-foreground mb-6">
                {settings.bottomSectionDescription}
              </p>
              
              <Button
                onClick={() => openWhatsApp("¡Hola! Quiero saber el costo exacto de mi proyecto. ¿Podemos tener una conversación gratuita de 60 minutos?")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-medium rounded-xl group"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {settings.bottomSectionCTA}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                {settings.bottomSectionNote}
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
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Calculadora de Presupuesto
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary">
                      Dólar: ${settings.exchangeRate} ARS
                    </span>
                  </div>
                </div>
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
                Seleccioná los servicios que necesitás y te muestro los costos reales desglosados con todas las secciones incluidas:
              </p>

              <div className="space-y-6 mb-6">
                {content.pricing.customServices.map((service) => {
                  const ServiceIcon = iconMap[service.icon as keyof typeof iconMap] || Settings;
                  const isExpanded = expandedService === service.id;
                  
                  return (
                    <div
                      key={service.id}
                      className={`border rounded-xl p-6 transition-all ${
                        selectedServices.includes(service.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="pt-1">
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onChange={() => toggleService(service.id)}
                          />
                        </div>
                        <ServiceIcon className="w-6 h-6 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="mb-4">
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                onClick={() => toggleExpanded(service.id)}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                              >
                                <h4 className="font-semibold text-white text-lg">{service.name}</h4>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <Layout className="w-4 h-4" />
                                </Button>
                              </button>
                              <div className="flex gap-2">
                                {service.isStatic && (
                                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                                    <Cloud className="w-3 h-3 mr-1" />
                                    {settings.badges.hostingFreeText}
                                  </Badge>
                                )}
                                {getDatabaseBadge(service.databaseType)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {service.description}
                            </p>
                          </div>

                          {/* Pricing breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Code className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-200">Desarrollo</span>
                              </div>
                              <div className="text-lg font-bold text-blue-100">
                                ${service.developmentPrice}
                              </div>
                              <div className="text-xs text-blue-300">Pago único</div>
                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Server className="w-4 h-4 text-purple-400" />
                                <span className="text-sm font-medium text-purple-200">Infraestructura</span>
                              </div>
                              <div className="text-lg font-bold text-purple-100">
                                ${service.infrastructurePrice === '0' ? 'Gratis' : service.infrastructurePrice}/mes
                              </div>
                              <div className="text-xs text-purple-300">
                                {service.isStatic ? 'Hosting estático' : service.databaseType === 'supabase' ? 'APIs + BD' : 'APIs + SQLite'}
                              </div>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Wrench className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium text-green-200">Mantenimiento</span>
                              </div>
                              <div className="text-lg font-bold text-green-100">
                                ${service.maintenancePrice}/mes
                              </div>
                              <div className="text-xs text-green-300">Soporte técnico</div>
                            </div>
                          </div>

                          {/* Expandable sections and features */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4 space-y-4"
                              >
                                {/* Sections included */}
                                <div>
                                  <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-primary" />
                                    Secciones incluidas:
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {service.sections.map((section, index) => (
                                      <div key={index} className="flex items-start gap-2 bg-muted/20 rounded-lg p-2">
                                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-muted-foreground">{section}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Technical features */}
                                <div>
                                  <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-primary" />
                                    Características técnicas:
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {service.features.map((feature, index) => (
                                      <div key={index} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-xs text-muted-foreground">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Infrastructure details */}
                          {service.infrastructureDetails.length > 0 && (
                            <div className="bg-muted/30 rounded-lg p-3">
                              <h6 className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                Infraestructura incluida:
                              </h6>
                              <ul className="space-y-1">
                                {service.infrastructureDetails.map((detail, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">
                                    • {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Resumen de tu proyecto:
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-blue-200">Desarrollo Total</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-100">
                        ${calculateEstimate().development}
                      </div>
                      <div className="text-xs text-blue-300 mt-1">Pago único</div>
                    </div>
                    
                    <div className="text-center bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Server className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-purple-200">Infraestructura</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-100">
                        ${calculateEstimate().infrastructure === '0' ? 'Gratis' : calculateEstimate().infrastructure}
                        {calculateEstimate().infrastructure !== '0' && '/mes'}
                      </div>
                      <div className="text-xs text-purple-300 mt-1">
                        {calculateEstimate().hasSupabase ? 'Incluye Supabase Pro' : 
                         calculateEstimate().hasInfrastructure ? 'APIs + SQLite' : 'Solo hosting estático'}
                      </div>
                    </div>
                    
                    <div className="text-center bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Wrench className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium text-green-200">Mantenimiento</span>
                      </div>
                      <div className="text-2xl font-bold text-green-100">
                        ${calculateEstimate().maintenance}/mes
                      </div>
                      <div className="text-xs text-green-300 mt-1">Soporte técnico</div>
                    </div>
                  </div>
                  
                  {calculateEstimate().infrastructure === '0' && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Cloud className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-200 font-medium">🎉 Infraestructura gratuita</p>
                          <p className="text-xs text-green-300 mt-1">
                            Tus servicios seleccionados usan hosting estático (Cloudflare) que es completamente gratuito.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {calculateEstimate().hasSupabase && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-200 font-medium">💎 Base de datos profesional incluida</p>
                          <p className="text-xs text-blue-300 mt-1">
                            Supabase Pro incluye PostgreSQL escalable, autenticación, y APIs automáticas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground text-center">
                    💡 Precios incluyen desarrollo completo, capacitación, documentación y 1-3 meses de ajustes
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
                    const selectedItems = content.pricing.customServices.filter(service => selectedServices.includes(service.id));
                    const serviceNames = selectedItems.map(item => item.name).join(', ');
                    const estimate = calculateEstimate();
                    const message = `¡Hola! Me interesa solicitar un presupuesto oficial para: ${serviceNames}

📊 Según la calculadora (USD $${settings.exchangeRate}):
💻 Desarrollo: $${estimate.development} (pago único)
🌐 Infraestructura: $${estimate.infrastructure === '0' ? 'Gratis (hosting estático)' : estimate.infrastructure + '/mes'}
🔧 Mantenimiento: $${estimate.maintenance}/mes

¿Podemos hablar para confirmar los detalles y coordinar el proyecto?`;
                    openWhatsApp(message);
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