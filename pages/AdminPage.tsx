import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useEditableContent } from '../contexts/EditableContentContext';
import { useRouter } from '../contexts/RouterContext';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Settings, 
  Home, 
  Briefcase, 
  Users, 
  DollarSign,
  HelpCircle,
  Building
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { content, updateContent, resetToDefault } = useEditableContent();
  const { navigateTo } = useRouter();
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar todo el contenido por defecto? Esta acción no se puede deshacer.')) {
      resetToDefault();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header de Admin */}
      <div className="border-b border-border bg-card">
        <div className="mobile-padding py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('landing')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a la Landing
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestiona el contenido de tu landing page</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mobile-padding py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Testimonios</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Precios</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Otros</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Información de la Empresa */}
          <TabsContent value="company">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Información de la Empresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de la empresa</label>
                    <Input
                      value={content.company.name}
                      onChange={(e) => updateContent('company', { ...content.company, name: e.target.value })}
                      placeholder="Artificial Lógika"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <Input
                      value={content.company.tagline}
                      onChange={(e) => updateContent('company', { ...content.company, tagline: e.target.value })}
                      placeholder="Software + IA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={content.company.email}
                      onChange={(e) => updateContent('company', { ...content.company, email: e.target.value })}
                      placeholder="info@artificiallogika.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <Input
                      value={content.company.phone}
                      onChange={(e) => updateContent('company', { ...content.company, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección</label>
                    <Input
                      value={content.company.address}
                      onChange={(e) => updateContent('company', { ...content.company, address: e.target.value })}
                      placeholder="Madrid, España"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <Input
                      value={content.company.socialMedia.linkedin}
                      onChange={(e) => updateContent('company', { 
                        ...content.company, 
                        socialMedia: { ...content.company.socialMedia, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <Input
                      value={content.company.socialMedia.twitter}
                      onChange={(e) => updateContent('company', { 
                        ...content.company, 
                        socialMedia: { ...content.company.socialMedia, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <Input
                      value={content.company.socialMedia.instagram}
                      onChange={(e) => updateContent('company', { 
                        ...content.company, 
                        socialMedia: { ...content.company.socialMedia, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Hero Section */}
          <TabsContent value="hero">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Sección Hero</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título principal</label>
                    <Input
                      value={content.hero.title}
                      onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })}
                      placeholder="Transformamos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo final</label>
                    <Input
                      value={content.hero.subtitle}
                      onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })}
                      placeholder="en ventaja competitiva"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    value={content.hero.description}
                    onChange={(e) => updateContent('hero', { ...content.hero, description: e.target.value })}
                    placeholder="Descripción de la empresa..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Textos dinámicos (uno por línea)</label>
                  <Textarea
                    value={content.hero.dynamicTexts.join('\n')}
                    onChange={(e) => updateContent('hero', { 
                      ...content.hero, 
                      dynamicTexts: e.target.value.split('\n').filter(text => text.trim()) 
                    })}
                    placeholder="tu lógica de negocio&#10;procesos automáticos&#10;soluciones inteligentes"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Corto</label>
                    <Input
                      value={content.hero.ctaText}
                      onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })}
                      placeholder="Consulta Gratuita"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Largo</label>
                    <Input
                      value={content.hero.ctaTextLong}
                      onChange={(e) => updateContent('hero', { ...content.hero, ctaTextLong: e.target.value })}
                      placeholder="Agendar una Consulta Gratuita"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de confianza</label>
                    <Input
                      value={content.hero.trustText}
                      onChange={(e) => updateContent('hero', { ...content.hero, trustText: e.target.value })}
                      placeholder="+50 empresas confían en nosotros"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Estadísticas</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.hero.stats.map((stat, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <Input
                            value={stat.number}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[index] = { ...stat, number: e.target.value };
                              updateContent('hero', { ...content.hero, stats: newStats });
                            }}
                            placeholder="100%"
                            className="text-center"
                          />
                          <Input
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[index] = { ...stat, label: e.target.value };
                              updateContent('hero', { ...content.hero, stats: newStats });
                            }}
                            placeholder="Proyectos entregados"
                          />
                          <Input
                            value={stat.sublabel}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[index] = { ...stat, sublabel: e.target.value };
                              updateContent('hero', { ...content.hero, stats: newStats });
                            }}
                            placeholder="a tiempo"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Servicios */}
          <TabsContent value="services">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Servicios</h2>
              <div className="space-y-6">
                {content.services.map((service, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Título del servicio</label>
                          <Input
                            value={service.title}
                            onChange={(e) => {
                              const newServices = [...content.services];
                              newServices[index] = { ...service, title: e.target.value };
                              updateContent('services', newServices);
                            }}
                            placeholder="Desarrollo Web & Apps"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Icono</label>
                          <Input
                            value={service.icon}
                            onChange={(e) => {
                              const newServices = [...content.services];
                              newServices[index] = { ...service, icon: e.target.value };
                              updateContent('services', newServices);
                            }}
                            placeholder="Code"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Descripción</label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...content.services];
                            newServices[index] = { ...service, description: e.target.value };
                            updateContent('services', newServices);
                          }}
                          placeholder="Descripción del servicio..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Características (una por línea)</label>
                        <Textarea
                          value={service.features.join('\n')}
                          onChange={(e) => {
                            const newServices = [...content.services];
                            newServices[index] = { 
                              ...service, 
                              features: e.target.value.split('\n').filter(f => f.trim()) 
                            };
                            updateContent('services', newServices);
                          }}
                          placeholder="React & TypeScript&#10;Arquitectura escalable&#10;UI/UX optimizada"
                          rows={4}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Testimonios */}
          <TabsContent value="testimonials">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Testimonios</h2>
              <div className="space-y-6">
                {content.testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre</label>
                          <Input
                            value={testimonial.name}
                            onChange={(e) => {
                              const newTestimonials = [...content.testimonials];
                              newTestimonials[index] = { ...testimonial, name: e.target.value };
                              updateContent('testimonials', newTestimonials);
                            }}
                            placeholder="Carlos Mendoza"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Cargo</label>
                          <Input
                            value={testimonial.role}
                            onChange={(e) => {
                              const newTestimonials = [...content.testimonials];
                              newTestimonials[index] = { ...testimonial, role: e.target.value };
                              updateContent('testimonials', newTestimonials);
                            }}
                            placeholder="CEO"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Empresa</label>
                          <Input
                            value={testimonial.company}
                            onChange={(e) => {
                              const newTestimonials = [...content.testimonials];
                              newTestimonials[index] = { ...testimonial, company: e.target.value };
                              updateContent('testimonials', newTestimonials);
                            }}
                            placeholder="TechStart Solutions"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Testimonio</label>
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => {
                            const newTestimonials = [...content.testimonials];
                            newTestimonials[index] = { ...testimonial, content: e.target.value };
                            updateContent('testimonials', newTestimonials);
                          }}
                          placeholder="Testimonio del cliente..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => {
                              const newTestimonials = [...content.testimonials];
                              newTestimonials[index] = { ...testimonial, rating: parseInt(e.target.value) };
                              updateContent('testimonials', newTestimonials);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">URL de imagen</label>
                          <Input
                            value={testimonial.image}
                            onChange={(e) => {
                              const newTestimonials = [...content.testimonials];
                              newTestimonials[index] = { ...testimonial, image: e.target.value };
                              updateContent('testimonials', newTestimonials);
                            }}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Precios */}
          <TabsContent value="pricing">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Planes de Precios</h2>
              <div className="space-y-6">
                {content.pricing.map((plan, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre del plan</label>
                          <Input
                            value={plan.name}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, name: e.target.value };
                              updateContent('pricing', newPricing);
                            }}
                            placeholder="Profesional"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Subtítulo</label>
                          <Input
                            value={plan.subtitle}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, subtitle: e.target.value };
                              updateContent('pricing', newPricing);
                            }}
                            placeholder="La opción más elegida"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Precio</label>
                          <Input
                            value={plan.price}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, price: e.target.value };
                              updateContent('pricing', newPricing);
                            }}
                            placeholder="2,800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Período</label>
                          <Input
                            value={plan.period}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, period: e.target.value };
                              updateContent('pricing', newPricing);
                            }}
                            placeholder="mes"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Descripción</label>
                        <Textarea
                          value={plan.description}
                          onChange={(e) => {
                            const newPricing = [...content.pricing];
                            newPricing[index] = { ...plan, description: e.target.value };
                            updateContent('pricing', newPricing);
                          }}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Características (una por línea)</label>
                        <Textarea
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const newPricing = [...content.pricing];
                            newPricing[index] = { 
                              ...plan, 
                              features: e.target.value.split('\n').filter(f => f.trim()) 
                            };
                            updateContent('pricing', newPricing);
                          }}
                          rows={5}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Texto del botón</label>
                          <Input
                            value={plan.cta}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, cta: e.target.value };
                              updateContent('pricing', newPricing);
                            }}
                            placeholder="Elegir Profesional"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            checked={plan.popular}
                            onChange={(e) => {
                              const newPricing = [...content.pricing];
                              newPricing[index] = { ...plan, popular: e.target.checked };
                              updateContent('pricing', newPricing);
                            }}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Plan popular</label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: FAQ */}
          <TabsContent value="faq">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
              <div className="space-y-6">
                {content.faq.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Pregunta</label>
                          <Textarea
                            value={item.question}
                            onChange={(e) => {
                              const newFaq = [...content.faq];
                              newFaq[index] = { ...item, question: e.target.value };
                              updateContent('faq', newFaq);
                            }}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Categoría</label>
                          <Input
                            value={item.category}
                            onChange={(e) => {
                              const newFaq = [...content.faq];
                              newFaq[index] = { ...item, category: e.target.value };
                              updateContent('faq', newFaq);
                            }}
                            placeholder="Tiempo"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Respuesta</label>
                        <Textarea
                          value={item.answer}
                          onChange={(e) => {
                            const newFaq = [...content.faq];
                            newFaq[index] = { ...item, answer: e.target.value };
                            updateContent('faq', newFaq);
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Otros */}
          <TabsContent value="other">
            <div className="space-y-6">
              {/* Propuesta de Valor */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Propuesta de Valor</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Título</label>
                      <Input
                        value={content.valueProposition.title}
                        onChange={(e) => updateContent('valueProposition', { 
                          ...content.valueProposition, 
                          title: e.target.value 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtítulo</label>
                      <Input
                        value={content.valueProposition.subtitle}
                        onChange={(e) => updateContent('valueProposition', { 
                          ...content.valueProposition, 
                          subtitle: e.target.value 
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-4">Puntos de valor</label>
                    {content.valueProposition.points.map((point, index) => (
                      <Card key={index} className="p-4 mb-4">
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={point.title}
                              onChange={(e) => {
                                const newPoints = [...content.valueProposition.points];
                                newPoints[index] = { ...point, title: e.target.value };
                                updateContent('valueProposition', { 
                                  ...content.valueProposition, 
                                  points: newPoints 
                                });
                              }}
                              placeholder="Título del punto"
                            />
                            <Input
                              value={point.icon}
                              onChange={(e) => {
                                const newPoints = [...content.valueProposition.points];
                                newPoints[index] = { ...point, icon: e.target.value };
                                updateContent('valueProposition', { 
                                  ...content.valueProposition, 
                                  points: newPoints 
                                });
                              }}
                              placeholder="Icono (ej: Lightbulb)"
                            />
                          </div>
                          <Textarea
                            value={point.description}
                            onChange={(e) => {
                              const newPoints = [...content.valueProposition.points];
                              newPoints[index] = { ...point, description: e.target.value };
                              updateContent('valueProposition', { 
                                ...content.valueProposition, 
                                points: newPoints 
                              });
                            }}
                            placeholder="Descripción del punto"
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Pasos del Proceso */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Pasos del Proceso</h2>
                <div className="space-y-4">
                  {content.processSteps.map((step, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Número del paso</label>
                            <Input
                              type="number"
                              value={step.step}
                              onChange={(e) => {
                                const newSteps = [...content.processSteps];
                                newSteps[index] = { ...step, step: parseInt(e.target.value) };
                                updateContent('processSteps', newSteps);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Título</label>
                            <Input
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...content.processSteps];
                                newSteps[index] = { ...step, title: e.target.value };
                                updateContent('processSteps', newSteps);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Duración</label>
                            <Input
                              value={step.duration}
                              onChange={(e) => {
                                const newSteps = [...content.processSteps];
                                newSteps[index] = { ...step, duration: e.target.value };
                                updateContent('processSteps', newSteps);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Descripción</label>
                          <Textarea
                            value={step.description}
                            onChange={(e) => {
                              const newSteps = [...content.processSteps];
                              newSteps[index] = { ...step, description: e.target.value };
                              updateContent('processSteps', newSteps);
                            }}
                            rows={3}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;