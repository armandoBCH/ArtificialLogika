import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Crown,
  ArrowUp,
  ArrowDown,
  DollarSign
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';
import { getBadgeColorClass } from './helpers';

const PricingTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();
  
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);

  // Funciones para pricing plans
  const addOutcomeToPlan = (planId: string) => {
    const plan = content.pricing.plans.find((p: any) => p.id === planId);
    if (plan) {
      const updatedOutcomes = [...plan.outcomes, "Nuevo beneficio"];
      const updatedPlans = content.pricing.plans.map((p: any) => 
        p.id === planId ? { ...p, outcomes: updatedOutcomes } : p
      );
      updateContent('pricing', { ...content.pricing, plans: updatedPlans });
    }
  };

  const removeOutcomeFromPlan = (planId: string, outcomeIndex: number) => {
    const plan = content.pricing.plans.find((p: any) => p.id === planId);
    if (plan) {
      const updatedOutcomes = plan.outcomes.filter((_: any, i: number) => i !== outcomeIndex);
      const updatedPlans = content.pricing.plans.map((p: any) => 
        p.id === planId ? { ...p, outcomes: updatedOutcomes } : p
      );
      updateContent('pricing', { ...content.pricing, plans: updatedPlans });
    }
  };

  const updatePlanOutcome = (planId: string, outcomeIndex: number, value: string) => {
    const plan = content.pricing.plans.find((p: any) => p.id === planId);
    if (plan) {
      const updatedOutcomes = [...plan.outcomes];
      updatedOutcomes[outcomeIndex] = value;
      const updatedPlans = content.pricing.plans.map((p: any) => 
        p.id === planId ? { ...p, outcomes: updatedOutcomes } : p
      );
      updateContent('pricing', { ...content.pricing, plans: updatedPlans });
    }
  };

  // Funciones para custom services
  const addSectionToService = (serviceId: string) => {
    const service = content.pricing.customServices.find((s: any) => s.id === serviceId);
    if (service) {
      const updatedSections = [...service.sections, "Nueva sección"];
      const updatedServices = content.pricing.customServices.map((s: any) => 
        s.id === serviceId ? { ...s, sections: updatedSections } : s
      );
      updateContent('pricing', { ...content.pricing, customServices: updatedServices });
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

  // Funciones para custom badges
  const addCustomBadge = (serviceId: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service) {
      const newBadge = {
        id: Date.now().toString(),
        text: "Nuevo Badge",
        color: 'primary' as const
      };
      const updatedBadges = [...(service.customBadges || []), newBadge];
      updateCustomService(serviceId, { customBadges: updatedBadges });
    }
  };

  const removeCustomBadge = (serviceId: string, badgeId: string) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service && service.customBadges) {
      const updatedBadges = service.customBadges.filter(badge => badge.id !== badgeId);
      updateCustomService(serviceId, { customBadges: updatedBadges });
    }
  };

  const updateCustomBadge = (serviceId: string, badgeId: string, field: string, value: any) => {
    const service = content.pricing.customServices.find(s => s.id === serviceId);
    if (service && service.customBadges) {
      const updatedBadges = service.customBadges.map(badge =>
        badge.id === badgeId ? { ...badge, [field]: value } : badge
      );
      updateCustomService(serviceId, { customBadges: updatedBadges });
    }
  };

  const handleAddNewCustomService = () => {
    const newService = {
      name: "Nuevo Servicio",
      description: "Descripción del nuevo servicio",
      sections: ["Sección 1", "Sección 2"],
      features: ["Característica 1", "Característica 2"],
      developmentPrice: "100.000",
      infrastructurePrice: "0",
      maintenancePrice: "20.000",
      infrastructureDetails: ["Detalle de infraestructura"],
      databaseType: 'none' as const,
      isStatic: true,
      isDynamic: false,
      icon: "Globe",
      customBadges: []
    };
    addCustomService(newService);
  };

  return (
    <div className="space-y-6">
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
                  value={content.pricing?.settings?.exchangeRate || '1200'}
                  onChange={(e) => {
                    const updatedPricing = { 
                      ...content.pricing, 
                      settings: { ...content.pricing.settings, exchangeRate: e.target.value }
                    };
                    updateContent('pricing', updatedPricing);
                  }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <div>
            <Label className="text-white">Badge Dinámico</Label>
            <Input
              type="text"
              value={content.pricing.settings.badges.dynamicText}
              onChange={(e) => updatePricingSettings({ 
                badges: { ...content.pricing.settings.badges, dynamicText: e.target.value }
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
          {(content.pricing?.plans || []).map((plan: any) => (
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Servicios de la Calculadora</h3>
          <Button onClick={handleAddNewCustomService} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Servicio
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Estos servicios aparecen en la calculadora cuando se hace clic en "Personalizar mi proyecto".
        </p>
        
        <div className="space-y-6">
          {content.pricing.customServices.map((service, index) => (
            <div key={service.id} className="border border-border/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h4 className="text-md font-medium text-white">{service.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {service.isStatic && (
                        <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                          Estático
                        </Badge>
                      )}
                      {service.isDynamic && (
                        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {content.pricing.settings.badges.dynamicText}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {service.databaseType === 'none' ? 'Sin BD' : 
                         service.databaseType === 'sqlite' ? 'SQLite' : 'Supabase'}
                      </Badge>
                      {service.customBadges?.map((badge) => (
                        <Badge 
                          key={badge.id} 
                          variant="secondary" 
                          className={`text-xs ${getBadgeColorClass(badge.color)}`}
                        >
                          {badge.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => reorderCustomServices(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-white"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => reorderCustomServices(index, Math.min(content.pricing.customServices.length - 1, index + 1))}
                    disabled={index === content.pricing.customServices.length - 1}
                    className="text-muted-foreground hover:text-white"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={editingService === service.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingService(editingService === service.id ? null : service.id)}
                    className={editingService === service.id ? "bg-primary" : ""}
                  >
                    {editingService === service.id ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomService(service.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={service.isStatic}
                        onCheckedChange={(checked) => updateCustomService(service.id, { isStatic: checked })}
                      />
                      <Label className="text-white">Es un sitio estático (hosting gratuito)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={service.isDynamic || false}
                        onCheckedChange={(checked) => updateCustomService(service.id, { isDynamic: checked })}
                      />
                      <Label className="text-white">Es dinámico (requiere backend)</Label>
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

                  {/* Custom Badges Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white">Badges Personalizados</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCustomBadge(service.id)}
                        className="text-primary border-primary/20"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Badge
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {service.customBadges?.map((badge) => (
                        <div key={badge.id} className="flex items-center gap-2 p-2 border border-border/50 rounded">
                          <Input
                            type="text"
                            value={badge.text}
                            onChange={(e) => updateCustomBadge(service.id, badge.id, 'text', e.target.value)}
                            placeholder="Texto del badge"
                            className="flex-1 text-sm"
                          />
                          <Select
                            value={badge.color}
                            onValueChange={(value) => updateCustomBadge(service.id, badge.id, 'color', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Azul</SelectItem>
                              <SelectItem value="green">Verde</SelectItem>
                              <SelectItem value="purple">Morado</SelectItem>
                              <SelectItem value="yellow">Amarillo</SelectItem>
                              <SelectItem value="red">Rojo</SelectItem>
                              <SelectItem value="gray">Gris</SelectItem>
                              <SelectItem value="primary">Primario</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomBadge(service.id, badge.id)}
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
    </div>
  );
};

export default PricingTab;