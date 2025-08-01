import React, { useState, Suspense, lazy } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '../contexts/RouterContext';
import { useEditableContent } from '../contexts/EditableContentContext';
import ConnectionStatus from '../components/ConnectionStatus';

// Lazy load admin components
const DashboardTab = lazy(() => import('../components/admin/DashboardTab'));
const CompanyTab = lazy(() => import('../components/admin/CompanyTab'));
const HeroTab = lazy(() => import('../components/admin/HeroTab'));
const ServicesTab = lazy(() => import('../components/admin/ServicesTab'));
const PricingTab = lazy(() => import('../components/admin/PricingTab'));
const ProjectsTab = lazy(() => import('../components/admin/ProjectsTab'));
const TursoConfig = lazy(() => import('../components/admin/TursoConfig'));

// Import constants
import { adminTabs } from '../components/admin/constants';

// Loading component
const TabLoading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Cargando...</p>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const { navigateTo } = useRouter();
  const { content, loading, error, isOnline } = useEditableContent();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Determinar estado de la base de datos basado en error y conectividad
  const getDbStatus = () => {
    if (!isOnline) return { provider: 'offline', color: 'text-red-400' };
    if (error && error.includes('404')) return { provider: 'local', color: 'text-yellow-400' };
    if (error) return { provider: 'error', color: 'text-red-400' };
    return { provider: 'turso', color: 'text-green-400' };
  };

  const dbStatus = getDbStatus();

  if (loading) {
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
                  {content.company?.name || 'Artificial Lógika'} • {error ? 'Usando contenido local' : 'Conectado a Turso'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Database status indicator */}
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Estado:</span>
                <span className={`font-medium ${dbStatus.color}`}>
                  {dbStatus.provider === 'turso' ? 'Conectado' :
                   dbStatus.provider === 'local' ? 'Local' :
                   dbStatus.provider === 'offline' ? 'Sin conexión' : 'Error'}
                </span>
              </div>
              
              {/* Connection status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  error ? (error.includes('404') ? 'bg-yellow-400' : 'bg-red-400') : 'bg-green-400'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {error ? 'Modo local' : 'Sincronizado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Connection Status */}
        <div className="mb-6">
          <ConnectionStatus />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-card/50 p-2">
            {adminTabs.map((tab) => (
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

          {/* Tab Contents with Lazy Loading */}
          <Suspense fallback={<TabLoading />}>
            <TabsContent value="dashboard">
              <DashboardTab setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="company">
              <CompanyTab />
            </TabsContent>

            <TabsContent value="hero">
              <HeroTab />
            </TabsContent>

            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingTab />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsTab />
            </TabsContent>

            <TabsContent value="database">
              <TursoConfig />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Configuración General</h3>
                <p className="text-muted-foreground">
                  Configuración general del sistema (próximamente).
                </p>
              </Card>
            </TabsContent>
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;