import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

const ProjectsTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const handleAddNewProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "Nuevo Proyecto",
      description: "Descripción del nuevo proyecto",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["React", "TypeScript"],
      category: "Web"
    };
    const updatedProjects = [...(content.featuredProjects || []), newProject];
    updateContent('featuredProjects', updatedProjects);
  };

  const addTechnologyToProject = (projectId: string) => {
    const project = content.featuredProjects.find((p: any) => p.id === projectId);
    if (project) {
      const updatedTechnologies = [...project.technologies, "Nueva Tecnología"];
      const updatedProjects = content.featuredProjects.map((p: any) => 
        p.id === projectId ? { ...p, technologies: updatedTechnologies } : p
      );
      updateContent('featuredProjects', updatedProjects);
    }
  };

  const removeTechnologyFromProject = (projectId: string, techIndex: number) => {
    const project = content.featuredProjects.find((p: any) => p.id === projectId);
    if (project) {
      const updatedTechnologies = project.technologies.filter((_: any, i: number) => i !== techIndex);
      const updatedProjects = content.featuredProjects.map((p: any) => 
        p.id === projectId ? { ...p, technologies: updatedTechnologies } : p
      );
      updateContent('featuredProjects', updatedProjects);
    }
  };

  const updateProjectTechnology = (projectId: string, techIndex: number, value: string) => {
    const project = content.featuredProjects.find((p: any) => p.id === projectId);
    if (project) {
      const updatedTechnologies = [...project.technologies];
      updatedTechnologies[techIndex] = value;
      const updatedProjects = content.featuredProjects.map((p: any) => 
        p.id === projectId ? { ...p, technologies: updatedTechnologies } : p
      );
      updateContent('featuredProjects', updatedProjects);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Gestión de Proyectos Destacados</h3>
          <Button onClick={handleAddNewProject} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proyecto
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Gestiona los proyectos que aparecen en la sección "Proyectos Destacados" del portfolio.
        </p>
        
        <div className="space-y-6">
          {(content.featuredProjects || []).map((project: any, index: number) => (
            <div key={project.id} className="border border-border/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-md font-medium text-white">{project.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-white"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    disabled={index === content.featuredProjects.length - 1}
                    className="text-muted-foreground hover:text-white"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={editingProject === project.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                    className={editingProject === project.id ? "bg-primary" : ""}
                  >
                    {editingProject === project.id ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updatedProjects = content.featuredProjects.filter((p: any) => p.id !== project.id);
                      updateContent('featuredProjects', updatedProjects);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingProject === project.id && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Título del Proyecto</Label>
                      <Input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const updatedProjects = content.featuredProjects.map((p: any) => 
                            p.id === project.id ? { ...p, title: e.target.value } : p
                          );
                          updateContent('featuredProjects', updatedProjects);
                        }}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Categoría</Label>
                      <Input
                        type="text"
                        value={project.category}
                        onChange={(e) => {
                          const updatedProjects = content.featuredProjects.map((p: any) => 
                            p.id === project.id ? { ...p, category: e.target.value } : p
                          );
                          updateContent('featuredProjects', updatedProjects);
                        }}
                        className="mt-2"
                        placeholder="E-commerce, Landing, SaaS, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Descripción</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => {
                        const updatedProjects = content.featuredProjects.map((p: any) => 
                          p.id === project.id ? { ...p, description: e.target.value } : p
                        );
                        updateContent('featuredProjects', updatedProjects);
                      }}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">URL de Imagen</Label>
                    <Input
                      type="text"
                      value={project.image}
                      onChange={(e) => {
                        const updatedProjects = content.featuredProjects.map((p: any) => 
                          p.id === project.id ? { ...p, image: e.target.value } : p
                        );
                        updateContent('featuredProjects', updatedProjects);
                      }}
                      className="mt-2"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recomendado: Usar imágenes de Unsplash con dimensiones 600x400 y fit=crop
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white">Tecnologías Utilizadas</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnologyToProject(project.id)}
                        className="text-primary border-primary/20"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {project.technologies.map((tech: any, techIndex: number) => (
                        <div key={techIndex} className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={tech}
                            onChange={(e) => updateProjectTechnology(project.id, techIndex, e.target.value)}
                            className="flex-1 text-sm"
                            placeholder="React, Node.js, etc."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTechnologyFromProject(project.id, techIndex)}
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
    </div>
  );
};

export default ProjectsTab;