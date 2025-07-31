import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft, 
  Settings, 
  Home, 
  Globe, 
  ShoppingBag,
  Database,
  User,
  Palette,
  DollarSign,
  Plus,
  Trash2,
  Star,
  Crown,
  Edit3,
  Check
} from 'lucide-react';
import { useRouter } from '../contexts/RouterContext';
import { useEditableContent } from '../contexts/EditableContentContext';
import DatabaseManager from '../components/DatabaseManager';

const AdminPage: React.FC = () => {
  const { navigateTo } = useRouter();
  const { 
    content, 
    updateContent, 
    updatePricingSettings,
    updatePricingPlan,
    updateCustomService,
    isLoading, 
    lastSaved, 
    saveStatus 
  } = useEditableContent();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);

  const handleSave = async (section: keyof typeof content, data: any) => {
    try {
      await updateContent(section, data);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  // Funciones para servicios principales
  const addNewService = () => {
    const newService = {
      title: "Nuevo Servicio",
      description: "Descripción del servicio",
      features: ["Característica 1", "Característica 2", "Característica 3"],
      price: "$100.000",
      originalPrice: "$120.000",
      popular: false,
      roi: "Beneficio típico",
      businessValue: "Qué consigues con este servicio",
      icon: "Globe"
    };
    
    const updatedServices = [...content.services, newService];
    handleSave('services', updatedServices);
  };

  const removeService = (index: number) => {
    const updatedServices = content.services.filter((_, i) => i !== index);
    handleSave('services', updatedServices);
  };

  const updateService = (index: number, field: string, value: any) => {
    const updatedServices = [...content.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    handleSave('services', updatedServices);
  };

  const addFeatureToService = (serviceIndex: number) => {
    const updatedServices = [...content.services];
    updatedServices[serviceIndex].features.push("Nueva característica");
    handleSave('services', updatedServices);
  };

  const removeFeatureFromService = (serviceIndex: number, featureIndex: number) => {
    const updatedServices = [...content.services];
    updatedServices[serviceIndex].features = updatedServices[serviceIndex].features.filter((_, i) => i !== featureIndex);
    handleSave('services', updatedServices);
  };

  const updateServiceFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updatedServices = [...content.services];
    updatedServices[serviceIndex].features[featureIndex] = value;
    handleSave('services', updatedServices);
  };

  // Funciones para pricing plans
  const addOutcomeToPlan = (planId: string) => {
    const plan = content.pricing.plans.find(p => p.id === planId);
    if (plan) {
      const updatedOutcomes = [...plan.outcomes, "Nuevo beneficio"];
      updatePricingPlan(planId, { outcomes: updatedOutcomes });
    }
  };

  const removeOutcomeFromPlan = (planId: string, outcomeIndex: number) => {
    const plan = content.pricing.plans.find(p => p.id === planId);
    if (plan) {
      const updatedOutcomes = plan.outcomes.filter((_, i) => i !== outcomeIndex);
      updatePricingPlan(planId, { outcomes: updatedOutcomes });
    }
  };

  const updatePlanOutcome = (planId: string, outcomeIndex: number, value: string) => {
    const plan = content.pricing.plans.find(p => p.id === planId);
    if (plan) {
      const updatedOutcomes = [...plan.outcomes];
      updatedOutcomes[outcomeIndex] = value;
      updatePricingPlan(planId, { outcomes: updatedOutcomes });
    }
  };

  // Funciones para custom services
  const addSectionToService = (serviceId: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedSections = [...service.sections, "Nueva sección"];
      updateCustomService(serviceId, { sections: updatedSections });
    }
  };

  const removeSectionFromService = (serviceId: string, sectionIndex: number) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedSections = service.sections.filter((_, i) => i !== sectionIndex);
      updateCustomService(serviceId, { sections: updatedSections });
    }
  };

  const updateServiceSection = (serviceId: string, sectionIndex: number, value: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedSections = [...service.sections];
      updatedSections[sectionIndex] = value;
      updateCustomService(serviceId, { sections: updatedSections });
    }
  };

  const addFeatureToCustomService = (serviceId: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedFeatures = [...service.features, "Nueva característica"];
      updateCustomService(serviceId, { features: updatedFeatures });
    }
  };

  const removeFeatureFromCustomService = (serviceId: string, featureIndex: number) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedFeatures = service.features.filter((_, i) => i !== featureIndex);
      updateCustomService(serviceId, { features: updatedFeatures });
    }
  };

  const updateCustomServiceFeature = (serviceId: string, featureIndex: number, value: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedFeatures = [...service.features];
      updatedFeatures[featureIndex] = value;
      updateCustomService(serviceId, { features: updatedFeatures });
    }
  };

  const addInfrastructureDetail = (serviceId: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedDetails = [...service.infrastructureDetails, "Nuevo detalle"];
      updateCustomService(serviceId, { infrastructureDetails: updatedDetails });
    }
  };

  const removeInfrastructureDetail = (serviceId: string, detailIndex: number) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedDetails = service.infrastructureDetails.filter((_, i) => i !== detailIndex);
      updateCustomService(serviceId, { infrastructureDetails: updatedDetails });
    }
  };

  const updateInfrastructureDetail = (serviceId: string, detailIndex: number, value: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const updatedDetails = [...service.infrastructureDetails];
      updatedDetails[detailIndex] = value;
      updateCustomService(serviceId, { infrastructureDetails: updatedDetails });
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'company', label: 'Empresa', icon: User },
    { id: 'hero', label: 'Hero', icon: Globe },
    { id: 'services', label: 'Servicios', icon: ShoppingBag },
    { id: 'pricing', label: 'Precios', icon: DollarSign },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'design', label: 'Diseño', icon: Palette },
  ];

  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return { color: 'bg-yellow-500', text: 'Guardando...' };
      case 'saved':
        return { color: 'bg-green-500', text: 'Guardado' };
      case 'error':
        return { color: 'bg-red-500', text: 'Error' };
      default:
        return { color: 'bg-green-500', text: 'Sincronizado' };
    }
  };

  const statusIndicator = getSaveStatusIndicator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('landing')}
                className="text-muted-foreground hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al sitio
              </Button>
              <div className="h-6 w-px bg-border/50" />
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">
                  {content.company.name} • {lastSaved ? `Guardado: ${lastSaved.toLocaleTimeString()}` : 'No guardado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusIndicator.color}`} />
              <span className="text-sm text-muted-foreground">
                {statusIndicator.text}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-2 bg-card/50 p-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Sitio Web</h3>
                    <p className="text-sm text-muted-foreground">Estado general</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Secciones</span>
                    <span className="text-white">6 activas</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Servicios</span>
                    <span className="text-white">{content.services.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Testimonios</span>
                    <span className="text-white">{content.testimonials.length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Base de Datos</h3>
                    <p className="text-sm text-muted-foreground">IndexedDB embebida</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="text-green-400">Conectada</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="text-white">Local</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Auto-save</span>
                    <span className="text-green-400">Activo</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Precios</h3>
                    <p className="text-sm text-muted-foreground">Completamente editables</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Planes principales</span>
                    <span className="text-white">{content.pricing.plans.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Servicios calculadora</span>
                    <span className="text-white">{content.pricing.customServices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dólar referencia</span>
                    <span className="text-white">${content.pricing.settings.exchangeRate}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button
                  onClick={() => setActiveTab('hero')}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Globe className="w-6 h-6" />
                  <span>Editar Hero</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('services')}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>Servicios</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('pricing')}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <DollarSign className="w-6 h-6" />
                  <span>Precios</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('database')}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Database className="w-6 h-6" />
                  <span>Base de Datos</span>
                </Button>
                <Button
                  onClick={() => navigateTo('landing')}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>Ver Sitio</span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Company Section */}
          <TabsContent value="company" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información de la Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name" className="text-white">Nombre</Label>
                    <Input
                      id="company-name"
                      type="text"
                      value={content.company.name}
                      onChange={(e) => handleSave('company', {...content.company, name: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-email" className="text-white">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={content.company.email}
                      onChange={(e) => handleSave('company', {...content.company, email: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-phone" className="text-white">Teléfono</Label>
                    <Input
                      id="company-phone"
                      type="text"
                      value={content.company.phone}
                      onChange={(e) => handleSave('company', {...content.company, phone: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-address" className="text-white">Dirección</Label>
                    <Input
                      id="company-address"
                      type="text"
                      value={content.company.address}
                      onChange={(e) => handleSave('company', {...content.company, address: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="founder-name" className="text-white">Fundador</Label>
                    <Input
                      id="founder-name"
                      type="text"
                      value={content.company.founderName}
                      onChange={(e) => handleSave('company', {...content.company, founderName: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="founder-title" className="text-white">Título del Fundador</Label>
                    <Input
                      id="founder-title"
                      type="text"
                      value={content.company.founderTitle}
                      onChange={(e) => handleSave('company', {...content.company, founderTitle: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sección Hero</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-title" className="text-white">Título Principal</Label>
                  <Input
                    id="hero-title"
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => handleSave('hero', {...content.hero, title: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle" className="text-white">Subtítulo</Label>
                  <Input
                    id="hero-subtitle"
                    type="text"
                    value={content.hero.subtitle}
                    onChange={(e) => handleSave('hero', {...content.hero, subtitle: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-description" className="text-white">Descripción</Label>
                  <Textarea
                    id="hero-description"
                    value={content.hero.description}
                    onChange={(e) => handleSave('hero', {...content.hero, description: e.target.value})}
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Gestión de Servicios</h3>
                <Button onClick={addNewService} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Servicio
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Gestiona los 3 servicios principales que se muestran en la sección de servicios.
              </p>
              
              <div className="space-y-6">
                {content.services.map((service, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-white">Servicio {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        {service.popular && (
                          <Badge className="bg-primary/20 text-primary border-primary/20">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-white">Título</Label>
                        <Input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(index, 'title', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-white">ROI/Beneficio</Label>
                        <Input
                          type="text"
                          value={service.roi}
                          onChange={(e) => updateService(index, 'roi', e.target.value)}
                          className="mt-2"
                          placeholder="Ej: Ahorra 20+ horas/semana"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-white">Precio</Label>
                        <Input
                          type="text"
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          className="mt-2"
                          placeholder="$297.000"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Precio Original (Opcional)</Label>
                        <Input
                          type="text"
                          value={service.originalPrice || ''}
                          onChange={(e) => updateService(index, 'originalPrice', e.target.value)}
                          className="mt-2"
                          placeholder="$350.000"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label className="text-white">Descripción</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div className="mb-4">
                      <Label className="text-white">Valor de Negocio</Label>
                      <Input
                        type="text"
                        value={service.businessValue}
                        onChange={(e) => updateService(index, 'businessValue', e.target.value)}
                        className="mt-2"
                        placeholder="Qué consigue el cliente con este servicio"
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-white">Características</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFeatureToService(index)}
                          className="text-primary border-primary/20"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={feature}
                              onChange={(e) => updateServiceFeature(index, featureIndex, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeatureFromService(index, featureIndex)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={service.popular}
                        onCheckedChange={(checked) => updateService(index, 'popular', checked)}
                      />
                      <Label className="text-white">Marcar como popular</Label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* PRICING SECTION - COMPLETAMENTE NUEVA */}
          <TabsContent value="pricing" className="space-y-6">
            {/* Configuración General de Precios */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Configuración General de Precios</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuración global de la sección de precios
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Tipo de Cambio (ARS por USD)</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <Input
                        type="text"
                        value={content.pricing.settings.exchangeRate}
                        onChange={(e) => updatePricingSettings({ exchangeRate: e.target.value })}
                        placeholder="1.300"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Título Principal</Label>
                    <Input
                      type="text"
                      value={content.pricing.settings.headerTitle}
                      onChange={(e) => updatePricingSettings({ headerTitle: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Subtítulo</Label>
                    <Input
                      type="text"
                      value={content.pricing.settings.headerSubtitle}
                      onChange={(e) => updatePricingSettings({ headerSubtitle: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Descripción</Label>
                    <Textarea
                      value={content.pricing.settings.headerDescription}
                      onChange={(e) => updatePricingSettings({ headerDescription: e.target.value })}
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Texto Destacado</Label>
                    <Input
                      type="text"
                      value={content.pricing.settings.headerHighlight}
                      onChange={(e) => updatePricingSettings({ headerHighlight: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <h4 className="text-md font-semibold text-white mb-4">Configuración de Badges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-white">Badge SQLite</Label>
                  <Input
                    type="text"
                    value={content.pricing.settings.badges.sqliteText}
                    onChange={(e) => updatePricingSettings({ 
                      badges: { ...content.pricing.settings.badges, sqliteText: e.target.value }
                    })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white">Badge Supabase</Label>
                  <Input
                    type="text"
                    value={content.pricing.settings.badges.supabaseText}
                    onChange={(e) => updatePricingSettings({ 
                      badges: { ...content.pricing.settings.badges, supabaseText: e.target.value }
                    })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white">Badge Sin BD</Label>
                  <Input
                    type="text"
                    value={content.pricing.settings.badges.noDatabaseText}
                    onChange={(e) => updatePricingSettings({ 
                      badges: { ...content.pricing.settings.badges, noDatabaseText: e.target.value }
                    })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white">Badge Hosting Gratis</Label>
                  <Input
                    type="text"
                    value={content.pricing.settings.badges.hostingFreeText}
                    onChange={(e) => updatePricingSettings({ 
                      badges: { ...content.pricing.settings.badges, hostingFreeText: e.target.value }
                    })}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Planes Principales */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Planes Principales (3 Tarjetas)</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Estos son los 3 planes que aparecen como tarjetas principales en la sección de precios.
              </p>
              
              <div className="space-y-6">
                {content.pricing.plans.map((plan) => (
                  <div key={plan.id} className="border border-border/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-md font-medium text-white">{plan.name}</h4>
                        {plan.popular && (
                          <Badge className="bg-primary/20 text-primary border-primary/20">
                            <Crown className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant={editingPlan === plan.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingPlan(editingPlan === plan.id ? null : plan.id)}
                        className={editingPlan === plan.id ? "bg-primary" : ""}
                      >
                        {editingPlan === plan.id ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {editingPlan === plan.id && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Nombre del Plan</Label>
                            <Input
                              type="text"
                              value={plan.name}
                              onChange={(e) => updatePricingPlan(plan.id, { name: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Subtítulo</Label>
                            <Input
                              type="text"
                              value={plan.subtitle}
                              onChange={(e) => updatePricingPlan(plan.id, { subtitle: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Precio/Valor</Label>
                            <Input
                              type="text"
                              value={plan.value}
                              onChange={(e) => updatePricingPlan(plan.id, { value: e.target.value })}
                              className="mt-2"
                              placeholder="$100.000 - $300.000"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Timeframe</Label>
                            <Input
                              type="text"
                              value={plan.timeframe}
                              onChange={(e) => updatePricingPlan(plan.id, { timeframe: e.target.value })}
                              className="mt-2"
                              placeholder="1-4 semanas según complejidad"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Texto del Botón (CTA)</Label>
                            <Input
                              type="text"
                              value={plan.cta}
                              onChange={(e) => updatePricingPlan(plan.id, { cta: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Badge</Label>
                            <Input
                              type="text"
                              value={plan.badge}
                              onChange={(e) => updatePricingPlan(plan.id, { badge: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-white">Descripción</Label>
                          <Textarea
                            value={plan.description}
                            onChange={(e) => updatePricingPlan(plan.id, { description: e.target.value })}
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-white">¿Qué Incluye? (Outcomes)</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addOutcomeToPlan(plan.id)}
                              className="text-primary border-primary/20"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {plan.outcomes.map((outcome, outcomeIndex) => (
                              <div key={outcomeIndex} className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={outcome}
                                  onChange={(e) => updatePlanOutcome(plan.id, outcomeIndex, e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOutcomeFromPlan(plan.id, outcomeIndex)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={plan.popular}
                            onCheckedChange={(checked) => updatePricingPlan(plan.id, { popular: checked })}
                          />
                          <Label className="text-white">Marcar como plan popular</Label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Servicios de la Calculadora */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Servicios de la Calculadora</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Estos servicios aparecen en la calculadora cuando se hace clic en "Personalizar mi proyecto".
              </p>
              
              <div className="space-y-6">
                {content.pricing.customServices.map((service) => (
                  <div key={service.id} className="border border-border/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-md font-medium text-white">{service.name}</h4>
                        <div className="flex gap-1">
                          {service.isStatic && (
                            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                              Estático
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {service.databaseType === 'none' ? 'Sin BD' : 
                             service.databaseType === 'sqlite' ? 'SQLite' : 'Supabase'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant={editingService === service.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingService(editingService === service.id ? null : service.id)}
                        className={editingService === service.id ? "bg-primary" : ""}
                      >
                        {editingService === service.id ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {editingService === service.id && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Nombre del Servicio</Label>
                            <Input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateCustomService(service.id, { name: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Tipo de Base de Datos</Label>
                            <Select
                              value={service.databaseType}
                              onValueChange={(value: 'none' | 'sqlite' | 'supabase') => 
                                updateCustomService(service.id, { databaseType: value })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sin Base de Datos</SelectItem>
                                <SelectItem value="sqlite">SQLite (Gratis)</SelectItem>
                                <SelectItem value="supabase">Supabase Pro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-white">Descripción</Label>
                          <Textarea
                            value={service.description}
                            onChange={(e) => updateCustomService(service.id, { description: e.target.value })}
                            className="mt-2"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-white">Precio de Desarrollo (ARS)</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">$</span>
                              <Input
                                type="text"
                                value={service.developmentPrice}
                                onChange={(e) => updateCustomService(service.id, { developmentPrice: e.target.value })}
                                placeholder="100.000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Precio Infraestructura/mes (ARS)</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">$</span>
                              <Input
                                type="text"
                                value={service.infrastructurePrice}
                                onChange={(e) => updateCustomService(service.id, { infrastructurePrice: e.target.value })}
                                placeholder="0"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Precio Mantenimiento/mes (ARS)</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">$</span>
                              <Input
                                type="text"
                                value={service.maintenancePrice}
                                onChange={(e) => updateCustomService(service.id, { maintenancePrice: e.target.value })}
                                placeholder="20.000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-white">Secciones Incluidas</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addSectionToService(service.id)}
                              className="text-primary border-primary/20"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.sections.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={section}
                                  onChange={(e) => updateServiceSection(service.id, sectionIndex, e.target.value)}
                                  className="flex-1 text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSectionFromService(service.id, sectionIndex)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-white">Características Técnicas</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addFeatureToCustomService(service.id)}
                              className="text-primary border-primary/20"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => updateCustomServiceFeature(service.id, featureIndex, e.target.value)}
                                  className="flex-1 text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFeatureFromCustomService(service.id, featureIndex)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-white">Detalles de Infraestructura</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addInfrastructureDetail(service.id)}
                              className="text-primary border-primary/20"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {service.infrastructureDetails.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={detail}
                                  onChange={(e) => updateInfrastructureDetail(service.id, detailIndex, e.target.value)}
                                  className="flex-1 text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInfrastructureDetail(service.id, detailIndex)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={service.isStatic}
                            onCheckedChange={(checked) => updateCustomService(service.id, { isStatic: checked })}
                          />
                          <Label className="text-white">Es un sitio estático (hosting gratuito)</Label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Configuración Bottom Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sección Final de Precios</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Título de la Sección Final</Label>
                  <Input
                    type="text"
                    value={content.pricing.settings.bottomSectionTitle}
                    onChange={(e) => updatePricingSettings({ bottomSectionTitle: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white">Descripción de la Sección Final</Label>
                  <Textarea
                    value={content.pricing.settings.bottomSectionDescription}
                    onChange={(e) => updatePricingSettings({ bottomSectionDescription: e.target.value })}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Texto del Botón CTA</Label>
                    <Input
                      type="text"
                      value={content.pricing.settings.bottomSectionCTA}
                      onChange={(e) => updatePricingSettings({ bottomSectionCTA: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Nota Final</Label>
                    <Input
                      type="text"
                      value={content.pricing.settings.bottomSectionNote}
                      onChange={(e) => updatePricingSettings({ bottomSectionNote: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Database Section */}
          <TabsContent value="database" className="space-y-6">
            <DatabaseManager />
          </TabsContent>

          {/* Design Section */}
          <TabsContent value="design" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Configuración de Diseño</h3>
              <p className="text-muted-foreground mb-6">
                Las configuraciones de diseño y colores se encuentran en el archivo <code className="bg-muted/20 px-2 py-1 rounded">styles/globals.css</code>
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Colores Actuales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="text-sm text-muted-foreground">Primary: #40d9ac</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-background rounded border border-border"></div>
                      <span className="text-sm text-muted-foreground">Background: #0e1015</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-card rounded"></div>
                      <span className="text-sm text-muted-foreground">Card: #1a1d24</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-foreground rounded"></div>
                      <span className="text-sm text-muted-foreground">Text: #ffffff</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;