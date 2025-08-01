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
  Check 
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
}

const ProjectsTab: React.FC = () => {
  const { content, updateContent } = useEditableContent();
  const [editingProject, setEditingProject] = useState<string | null>(null);

  // Ensure featuredProjects is always an array
  const featuredProjects: Project[] = Array.isArray(content.featuredProjects) 
    ? content.featuredProjects 
    : [];

  const handleAddNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "Nuevo Proyecto",
      description: "Descripción del nuevo proyecto",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["React", "TypeScript"],
      category: "Web"
    };
    const updatedProjects = [...featuredProjects, newProject];
    updateContent('featuredProjects', updatedProjects);
  };

  const removeProject = (projectId: string) => {
    const updatedProjects = featuredProjects.filter((p: Project) => p.id !== projectId);
    updateContent('featuredProjects', updatedProjects);
  };

  const updateProject = (projectId: string, field: string, value: any) => {
    const updatedProjects = featuredProjects.map((p: Project) => 
      p.id === projectId ? { ...p, [field]: value } : p
    );
    updateContent('featuredProjects', updatedProjects);
  };

  const addTechnologyToProject = (projectId: string) => {
    const project = featuredProjects.find((p: Project) => p.id === projectId);
    if (project) {
      const updatedTechnologies = [...project.technologies, "Nueva Tecnología"];
      updateProject(projectId, 'technologies', updatedTechnologies);
    }
  };

  const removeTechnologyFromProject = (projectId: string, techIndex: number) => {
    const project = featuredProjects.find((p: Project) => p.id === projectId);
    if (project) {
      const updatedTechnologies = project.technologies.filter((_: string, i: number) => i !== techIndex);
      updateProject(projectId, 'technologies', updatedTechnologies);
    }
  };

  const updateProjectTechnology = (projectId: string, techIndex: number, value: string) => {
    const project = featuredProjects.find((p: Project) => p.id === projectId);
    if (project) {
      const updatedTechnologies = [...project.technologies];
      updatedTechnologies[techIndex] = value;
      updateProject(projectId, 'technologies', updatedTechnologies);
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
          {featuredProjects.map((project: Project) => (
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
                    onClick={() => removeProject(project.id)}
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
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Categoría</Label>
                      <Input
                        type="text"
                        value={project.category}
                        onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                        className="mt-2"
                        placeholder="E-commerce, Landing, SaaS, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Descripción</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">URL de Imagen</Label>
                    <Input
                      type="text"
                      value={project.image}
                      onChange={(e) => updateProject(project.id, 'image', e.target.value)}
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
                      {project.technologies.map((tech: string, techIndex: number) => (
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
          
          {featuredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay proyectos destacados configurados</p>
              <Button onClick={handleAddNewProject} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Proyecto
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProjectsTab;