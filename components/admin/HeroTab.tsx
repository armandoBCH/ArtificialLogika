import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

const HeroTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();

  const handleSave = async (section: keyof typeof content, data: any) => {
    try {
      await updateContent(section, data);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const addDynamicText = () => {
    const updatedTexts = [...content.hero.dynamicTexts, "nuevo texto"];
    handleSave('hero', { ...content.hero, dynamicTexts: updatedTexts });
  };

  const removeDynamicText = (index: number) => {
    const updatedTexts = content.hero.dynamicTexts.filter((_: any, i: number) => i !== index);
    handleSave('hero', { ...content.hero, dynamicTexts: updatedTexts });
  };

  const updateDynamicText = (index: number, value: string) => {
    const updatedTexts = [...content.hero.dynamicTexts];
    updatedTexts[index] = value;
    handleSave('hero', { ...content.hero, dynamicTexts: updatedTexts });
  };

  const addStat = () => {
    const newStat = {
      number: "100%",
      label: "Nueva Métrica",
      sublabel: "Descripción"
    };
    const updatedStats = [...content.hero.stats, newStat];
    handleSave('hero', { ...content.hero, stats: updatedStats });
  };

  const removeStat = (index: number) => {
    const updatedStats = content.hero.stats.filter((_: any, i: number) => i !== index);
    handleSave('hero', { ...content.hero, stats: updatedStats });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const updatedStats = [...content.hero.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    handleSave('hero', { ...content.hero, stats: updatedStats });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sección Hero Principal</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-title" className="text-white">Título Principal</Label>
              <Input
                id="hero-title"
                type="text"
                value={content.hero.title}
                onChange={(e) => handleSave('hero', {...content.hero, title: e.target.value})}
                className="mt-2"
                placeholder="Transformamos"
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
                placeholder="en ventaja competitiva"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="hero-description" className="text-white">Descripción</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => handleSave('hero', {...content.hero, description: e.target.value})}
              rows={3}
              className="mt-2"
              placeholder="Descripción que aparece debajo del título principal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-cta-text" className="text-white">Texto del Botón (Corto)</Label>
              <Input
                id="hero-cta-text"
                type="text"
                value={content.hero.ctaText}
                onChange={(e) => handleSave('hero', {...content.hero, ctaText: e.target.value})}
                className="mt-2"
                placeholder="Conversemos"
              />
            </div>
            <div>
              <Label htmlFor="hero-cta-text-long" className="text-white">Texto del Botón (Largo)</Label>
              <Input
                id="hero-cta-text-long"
                type="text"
                value={content.hero.ctaTextLong}
                onChange={(e) => handleSave('hero', {...content.hero, ctaTextLong: e.target.value})}
                className="mt-2"
                placeholder="Conversemos sobre tu proyecto"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hero-trust-text" className="text-white">Texto de Confianza</Label>
            <Input
              id="hero-trust-text"
              type="text"
              value={content.hero.trustText}
              onChange={(e) => handleSave('hero', {...content.hero, trustText: e.target.value})}
              className="mt-2"
              placeholder="Más de 15 proyectos exitosos entregados"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Textos Dinámicos (Efecto de Escritura)</h3>
          <Button onClick={addDynamicText} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Texto
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Estos textos aparecen con efecto de escritura después de "Transformamos"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.hero.dynamicTexts.map((text, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={text}
                onChange={(e) => updateDynamicText(index, e.target.value)}
                className="flex-1"
                placeholder="páginas web, e-commerce, etc."
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDynamicText(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Estadísticas del Hero</h3>
          <Button onClick={addStat} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Estadística
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Métricas que aparecen debajo del hero principal
        </p>
        
        <div className="space-y-4">
          {content.hero.stats.map((stat, index) => (
            <div key={index} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Estadística {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-white text-xs">Número</Label>
                  <Input
                    type="text"
                    value={stat.number}
                    onChange={(e) => updateStat(index, 'number', e.target.value)}
                    className="mt-1"
                    placeholder="100%"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Etiqueta</Label>
                  <Input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="mt-1"
                    placeholder="Autogestionable"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Subetiqueta</Label>
                  <Input
                    type="text"
                    value={stat.sublabel}
                    onChange={(e) => updateStat(index, 'sublabel', e.target.value)}
                    className="mt-1"
                    placeholder="Sin dependencias"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HeroTab;