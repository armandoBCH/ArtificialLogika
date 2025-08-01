import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Settings, Edit3, Check } from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

const PricingTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Funciones helper para manejar el contenido de pricing
  const updatePricingContent = (field: string, value: any) => {
    const updatedPricing = {
      ...content.pricing,
      [field]: value
    };
    updateContent('pricing', updatedPricing);
  };

  const updatePricingSettings = (updates: any) => {
    const updatedSettings = {
      ...content.pricing?.settings,
      ...updates
    };
    updatePricingContent('settings', updatedSettings);
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
              <Label className="text-white">Título Principal</Label>
              <Input
                type="text"
                value={content.pricing?.settings?.headerTitle || 'Planes de Desarrollo'}
                onChange={(e) => updatePricingSettings({ headerTitle: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Subtítulo</Label>
              <Input
                type="text"
                value={content.pricing?.settings?.headerSubtitle || 'Soluciones a medida'}
                onChange={(e) => updatePricingSettings({ headerSubtitle: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Descripción</Label>
              <Textarea
                value={content.pricing?.settings?.headerDescription || 'Precios transparentes para cada tipo de proyecto'}
                onChange={(e) => updatePricingSettings({ headerDescription: e.target.value })}
                className="mt-2"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-white">Texto Destacado</Label>
              <Input
                type="text"
                value={content.pricing?.settings?.headerHighlight || 'Sin costos ocultos'}
                onChange={(e) => updatePricingSettings({ headerHighlight: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Planes Principales Simplificados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Planes Principales</h3>
          <Button
            variant={editingSection === 'plans' ? "default" : "outline"}
            size="sm"
            onClick={() => setEditingSection(editingSection === 'plans' ? null : 'plans')}
            className={editingSection === 'plans' ? "bg-primary" : ""}
          >
            {editingSection === 'plans' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Estos son los 3 planes que aparecen como tarjetas principales en la sección de precios.
        </p>
        
        {editingSection === 'plans' && (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Configuración de Planes</Label>
              <Textarea
                value={JSON.stringify(content.pricing?.plans || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsedPlans = JSON.parse(e.target.value);
                    updatePricingContent('plans', parsedPlans);
                  } catch (error) {
                    console.error('Error parsing plans JSON:', error);
                  }
                }}
                className="mt-2 font-mono text-sm"
                rows={10}
                placeholder="JSON de configuración de planes..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Edita la configuración de planes en formato JSON. Se requiere conexión válida a Supabase.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Servicios de la Calculadora Simplificados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Servicios de la Calculadora</h3>
          <Button
            variant={editingSection === 'services' ? "default" : "outline"}
            size="sm"
            onClick={() => setEditingSection(editingSection === 'services' ? null : 'services')}
            className={editingSection === 'services' ? "bg-primary" : ""}
          >
            {editingSection === 'services' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Estos servicios aparecen en la calculadora cuando se hace clic en "Personalizar mi proyecto".
        </p>
        
        {editingSection === 'services' && (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Configuración de Servicios Personalizados</Label>
              <Textarea
                value={JSON.stringify(content.pricing?.customServices || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsedServices = JSON.parse(e.target.value);
                    updatePricingContent('customServices', parsedServices);
                  } catch (error) {
                    console.error('Error parsing services JSON:', error);
                  }
                }}
                className="mt-2 font-mono text-sm"
                rows={10}
                placeholder="JSON de configuración de servicios personalizados..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Edita la configuración de servicios en formato JSON. Se requiere conexión válida a Supabase.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Configuración Bottom Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sección Final de Precios</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-white">Título de la Sección Final</Label>
            <Input
              type="text"
              value={content.pricing?.settings?.bottomSectionTitle || '¿Necesitas algo diferente?'}
              onChange={(e) => updatePricingSettings({ bottomSectionTitle: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-white">Descripción de la Sección Final</Label>
            <Textarea
              value={content.pricing?.settings?.bottomSectionDescription || 'Hablemos sobre tu proyecto específico'}
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
                value={content.pricing?.settings?.bottomSectionCTA || 'Consultar Proyecto'}
                onChange={(e) => updatePricingSettings({ bottomSectionCTA: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Nota Final</Label>
              <Input
                type="text"
                value={content.pricing?.settings?.bottomSectionNote || 'Respuesta en 24hs'}
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