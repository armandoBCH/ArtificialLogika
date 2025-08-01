import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: "Plataforma E-commerce B2B",
    client: "Distribuidor Industrial",
    description: "Automatizamos el proceso de pedidos y cotizaciones para un distribuidor industrial, integrando IA para recomendaciones personalizadas de productos.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    metrics: [
      { icon: TrendingUp, label: "Aumento en ventas", value: "+340%" },
      { icon: Clock, label: "Tiempo de cotización", value: "-85%" },
      { icon: Users, label: "Satisfacción cliente", value: "98%" }
    ],
    technologies: ["React", "Node.js", "IA Predictiva", "API Integration"],
    category: "E-commerce + IA"
  },
  {
    title: "Sistema de Gestión Veterinaria",
    client: "Red de Clínicas Veterinarias",
    description: "Desarrollamos un sistema integral que automatiza desde el agendamiento hasta el seguimiento post-consulta, con recordatorios inteligentes de vacunación.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    metrics: [
      { icon: TrendingUp, label: "Eficiencia operativa", value: "+250%" },
      { icon: Clock, label: "Tiempo por consulta", value: "-60%" },
      { icon: Users, label: "Retención clientes", value: "+180%" }
    ],
    technologies: ["Vue.js", "Python", "Automatización", "SMS/Email API"],
    category: "Gestión + Automatización"
  }
];

const FeaturedProjects: React.FC = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextProject = () => {
    setDirection(1);
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const project = projects[currentProject];

  return (
    <section className="relative py-24 px-6 overflow-hidden" id="proyectos">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Nuestro código
            <span className="text-primary"> en acción</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Casos reales de transformación digital que demuestran el poder de unir lógica con innovación.
          </p>
        </motion.div>

        {/* Carrusel */}
        <div className="relative">
          {/* Controles de navegación */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevProject}
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Indicadores */}
            <div className="flex gap-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentProject ? 1 : -1);
                    setCurrentProject(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProject 
                      ? 'bg-primary scale-125' 
                      : 'bg-primary/30 hover:bg-primary/60'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextProject}
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Contenido del proyecto */}
          <div className="relative h-[600px] md:h-[500px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentProject}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                className="absolute inset-0"
              >
                <Card className="h-full bg-card border-border overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Imagen */}
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Badge de categoría */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-primary mb-4">
                          {project.client}
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                          {project.description}
                        </p>

                        {/* Métricas */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                          {project.metrics.map((metric, index) => (
                            <motion.div
                              key={index}
                              className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <metric.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                              <div className="text-lg font-bold text-white mb-1">
                                {metric.value}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {metric.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Tecnologías */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <Button 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                        >
                          Ver Caso Completo
                          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;