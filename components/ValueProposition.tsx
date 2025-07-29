import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Clock, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Target,
  User,
  DollarSign
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

const ValueProposition: React.FC = () => {
  const { content } = useEditableContent();

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Resultados más realistas
  const realResults = [
    {
      icon: Clock,
      title: "8-15 horas ahorradas",
      description: "Por semana en tareas repetitivas y manuales",
      metric: "Tiempo real recuperado",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "50-150% más conversiones",
      description: "En páginas web y formularios optimizados",
      metric: "Mejoras medibles",
      color: "from-primary to-green-500"
    },
    {
      icon: Shield,
      title: "24/7 funcionamiento",
      description: "Chatbots y automatizaciones que trabajan siempre",
      metric: "Disponibilidad total",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Problemas comunes (más realistas)
  const commonProblems = [
    { issue: "Responder emails repetitivos", time: "5-10h/semana perdidas" },
    { issue: "Generar reportes manualmente", time: "3-6h/semana perdidas" },
    { issue: "Perder leads porque no respondes rápido", time: "15-25% conversiones perdidas" },
    { issue: "Página web que no convierte visitantes", time: "60-80% visitantes perdidos" }
  ];

  const iconMap = {
    'User': User,
    'Target': Target,
    'DollarSign': DollarSign
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 mobile-padding" id="propuesta">
      <div className="max-w-7xl mx-auto">
        {/* Header más humilde */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            ¿Te suena familiar
            <span className="text-primary block sm:inline"> alguna de estas situaciones</span>?
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mobile-text-balance">
            Trabajo con pequeños y medianos negocios que quieren automatizar lo básico 
            para enfocarse en lo importante: hacer crecer su empresa.
          </p>
        </motion.div>

        {/* Resultados realistas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {realResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="relative p-6 sm:p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${result.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon y métrica */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${result.color} flex items-center justify-center`}>
                      <result.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {result.metric}
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>

                  {/* Indicador de realidad */}
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary font-medium">Resultados típicos</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Problemas comunes */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="relative p-8 sm:p-12 bg-gradient-to-br from-muted/5 to-muted/10 border-muted/20 overflow-hidden">
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Problemas típicos que resuelvo
                  </h3>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Si alguno te suena familiar, probablemente puedo ayudarte
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {commonProblems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Clock className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white mb-1">{item.issue}</div>
                      <div className="text-yellow-500 font-bold text-sm">{item.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  No prometo milagros, pero sí puedo automatizar estas tareas para que tengas más tiempo 
                  para lo que realmente importa en tu negocio.
                </p>
                
                <Button 
                  onClick={scrollToContact}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-medium rounded-xl group"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Hablemos de tu situación
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Value proposition más humilde */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {content.valueProposition.title}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {content.valueProposition.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {content.valueProposition.points.map((point, index) => {
              const IconComponent = iconMap[point.icon as keyof typeof iconMap] || Target;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-sm border-border/50 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-white mb-3">{point.title}</h4>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;