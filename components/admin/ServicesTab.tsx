import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Star } from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

// Tipos para los servicios
interface ServiceFeature {
  [key: string]: any;
}

interface Service {
  id?: string;
  title: string;
  description: string;
  features: string[];
  price?: string;
  originalPrice?: string;
  popular?: boolean;
  roi: string;
  businessValue: string;
  icon: string;
}

const ServicesTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();

  // Obtener servicios como array tipado
  const services = (content.services as Service[]) || [];

  const handleSave = async (section: keyof typeof content, data: Service[]) => {
    try {
      await updateContent(section, data);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const addNewService = () => {
    const newService: Service = {
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
    
    const updatedServices = [...services, newService];
    handleSave('services', updatedServices);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_: Service, i: number) => i !== index);
    handleSave('services', updatedServices);
  };

  const updateService = (index: number, field: string, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    handleSave('services', updatedServices);
  };

  const addFeatureToService = (serviceIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].features.push("Nueva característica");
    handleSave('services', updatedServices);
  };

  const removeFeatureFromService = (serviceIndex: number, featureIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].features = updatedServices[serviceIndex].features.filter((_: string, i: number) => i !== featureIndex);
    handleSave('services', updatedServices);
  };

  const updateServiceFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].features[featureIndex] = value;
    handleSave('services', updatedServices);
  };

  return (
    <div className="space-y-6">
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
          {services.map((service: Service, index: number) => (
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
                  {service.features.map((feature: string, featureIndex: number) => (
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
    </div>
  );
};

export default ServicesTab;