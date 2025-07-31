import React from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useEditableContent } from '../../contexts/EditableContentContext';

const CompanyTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();

  const handleSave = async (section: keyof typeof content, data: any) => {
    try {
      await updateContent(section, data);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div className="space-y-6">
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
              <Label htmlFor="company-tagline" className="text-white">Tagline</Label>
              <Input
                id="company-tagline"
                type="text"
                value={content.company.tagline}
                onChange={(e) => handleSave('company', {...content.company, tagline: e.target.value})}
                className="mt-2"
                placeholder="Desarrollo web y soluciones de IA"
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
                placeholder="+542284638361"
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
                placeholder="Ciudad, Provincia, País"
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
                placeholder="Desarrollador & Consultor en IA"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Redes Sociales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="social-linkedin" className="text-white">LinkedIn</Label>
            <Input
              id="social-linkedin"
              type="url"
              value={content.company.socialMedia.linkedin}
              onChange={(e) => handleSave('company', {
                ...content.company,
                socialMedia: { ...content.company.socialMedia, linkedin: e.target.value }
              })}
              className="mt-2"
              placeholder="https://linkedin.com/in/tu-perfil"
            />
          </div>
          <div>
            <Label htmlFor="social-twitter" className="text-white">Twitter/X</Label>
            <Input
              id="social-twitter"
              type="url"
              value={content.company.socialMedia.twitter}
              onChange={(e) => handleSave('company', {
                ...content.company,
                socialMedia: { ...content.company.socialMedia, twitter: e.target.value }
              })}
              className="mt-2"
              placeholder="https://twitter.com/tu-usuario"
            />
          </div>
          <div>
            <Label htmlFor="social-github" className="text-white">GitHub</Label>
            <Input
              id="social-github"
              type="url"
              value={content.company.socialMedia.github}
              onChange={(e) => handleSave('company', {
                ...content.company,
                socialMedia: { ...content.company.socialMedia, github: e.target.value }
              })}
              className="mt-2"
              placeholder="https://github.com/tu-usuario"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyTab;