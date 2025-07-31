import React from 'react';
import Logo, { LogoSVG } from './Logo';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Copy } from 'lucide-react';

const LogoShowcase: React.FC = () => {
  const downloadSVG = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSVG = (size: number, primaryColor: string, backgroundColor: string, strokeWidth: number = 4) => {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${strokeWidth/2}" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/> 
      </feMerge>
    </filter>
  </defs>
  <rect x="${strokeWidth/2}" y="${strokeWidth/2}" width="${size - strokeWidth}" height="${size - strokeWidth}" rx="${size * 0.18}" fill="${backgroundColor}" stroke="${primaryColor}" stroke-width="${strokeWidth}" filter="url(#glow)"/>
  <rect x="${size * 0.34}" y="${size * 0.34}" width="${size * 0.32}" height="${size * 0.32}" rx="${size * 0.023}" fill="${primaryColor}"/>
</svg>`;
  };

  const generatePNG = async (svgContent: string, size: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      
      // Fondo transparente para PNG
      ctx!.clearRect(0, 0, size, size);

      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
    });
  };

  const downloadPNG = async (size: number, filename: string, variant: 'default' | 'white' = 'default') => {
    const colors = variant === 'white' 
      ? { primary: '#ffffff', background: 'rgba(255, 255, 255, 0.05)' }
      : { primary: '#40d9ac', background: 'rgba(64, 217, 172, 0.08)' };
      
    const svgContent = generateSVG(size, colors.primary, colors.background, Math.max(4, size/11));
    const pngDataUrl = await generatePNG(svgContent, size);
    
    const a = document.createElement('a');
    a.href = pngDataUrl;
    a.download = filename;
    a.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 p-8 bg-card rounded-xl border border-border">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Logo Artificial Lógika</h2>
        <p className="text-muted-foreground">
          Bordes gruesos estilizados - "Logic as Aesthetics"
        </p>
      </div>

      {/* Variantes del logo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="text-center space-y-2">
          <div className="bg-background p-4 rounded-lg border border-border">
            <Logo variant="default" size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Por defecto</p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-background p-4 rounded-lg border border-border">
            <Logo variant="minimal" size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Minimal</p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-gray-900 p-4 rounded-lg">
            <Logo variant="white" size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Blanco</p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-white p-4 rounded-lg">
            <Logo variant="dark" size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Oscuro</p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg">
            <Logo variant="solid" size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Sólido</p>
        </div>
      </div>

      {/* Diferentes tamaños */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Tamaños disponibles</h3>
        <div className="flex items-end justify-center gap-8">
          <div className="text-center space-y-2">
            <Logo size="xs" />
            <p className="text-xs text-muted-foreground">XS</p>
          </div>
          <div className="text-center space-y-2">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground">SM</p>
          </div>
          <div className="text-center space-y-2">
            <Logo size="md" />
            <p className="text-xs text-muted-foreground">MD</p>
          </div>
          <div className="text-center space-y-2">
            <Logo size="lg" />
            <p className="text-xs text-muted-foreground">LG</p>
          </div>
          <div className="text-center space-y-2">
            <Logo size="xl" />
            <p className="text-xs text-muted-foreground">XL</p>
          </div>
        </div>
      </div>

      {/* Características del diseño */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold text-white mb-4">Características del diseño</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-primary mb-2">Filosofía:</h4>
            <ul className="space-y-1">
              <li>• "Logic as Aesthetics"</li>
              <li>• Bordes gruesos para impacto visual</li>
              <li>• Estructura geométrica deliberada</li>
              <li>• Minimalismo funcional</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Técnico:</h4>
            <ul className="space-y-1">
              <li>• Formato SVG escalable</li>
              <li>• Color primario: #40d9ac</li>
              <li>• Bordes adaptativos (3-6px)</li>
              <li>• Efectos de brillo y animación</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Botones de descarga */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Descargar archivos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SVG Downloads */}
          <Card className="p-4">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Formato SVG (vectorial)
            </h4>
            <div className="space-y-2">
              <Button
                onClick={() => downloadSVG(generateSVG(44, '#40d9ac', 'rgba(64, 217, 172, 0.08)', 4), 'artificial-logika-logo.svg')}
                className="w-full text-sm bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                variant="outline"
              >
                Logo estándar (44px)
              </Button>
              <Button
                onClick={() => downloadSVG(generateSVG(120, '#40d9ac', 'rgba(64, 217, 172, 0.08)', 12), 'artificial-logika-logo-large.svg')}
                className="w-full text-sm bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                variant="outline"
              >
                Logo grande (120px)
              </Button>
              <Button
                onClick={() => downloadSVG(generateSVG(44, '#ffffff', 'rgba(255, 255, 255, 0.05)', 4), 'artificial-logika-logo-white.svg')}
                className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
                variant="outline"
              >
                Logo blanco
              </Button>
            </div>
          </Card>

          {/* PNG Downloads */}
          <Card className="p-4">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-secondary" />
              Formato PNG (bitmap)
            </h4>
            <div className="space-y-2">
              <Button
                onClick={() => downloadPNG(64, 'artificial-logika-logo-64.png')}
                className="w-full text-sm bg-secondary/20 hover:bg-secondary/30 text-white border border-secondary/30"
                variant="outline"
              >
                PNG 64x64px
              </Button>
              <Button
                onClick={() => downloadPNG(128, 'artificial-logika-logo-128.png')}
                className="w-full text-sm bg-secondary/20 hover:bg-secondary/30 text-white border border-secondary/30"
                variant="outline"
              >
                PNG 128x128px
              </Button>
              <Button
                onClick={() => downloadPNG(256, 'artificial-logika-logo-256.png')}
                className="w-full text-sm bg-secondary/20 hover:bg-secondary/30 text-white border border-secondary/30"
                variant="outline"
              >
                PNG 256x256px
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Código React para copiar */}
      <Card className="p-4 bg-card border border-border">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Copy className="w-4 h-4 text-accent" />
          Usar en React
        </h4>
        <div className="bg-background rounded-lg p-3 font-mono text-sm text-muted-foreground">
          <div className="space-y-1">
            <div>{'import Logo from "./components/Logo";'}</div>
            <div className="text-primary mt-2">{'// Diferentes tamaños y variantes'}</div>
            <div>{'<Logo size="md" variant="default" animated={true} />'}</div>
            <div>{'<Logo size="lg" variant="minimal" />'}</div>
            <div>{'<Logo size="xl" variant="white" />'}</div>
          </div>
        </div>
        <Button
          onClick={() => copyToClipboard('import Logo from "./components/Logo";\n\n<Logo size="md" variant="default" animated={true} />')}
          className="mt-3 text-xs"
          variant="outline"
          size="sm"
        >
          Copiar código
        </Button>
      </Card>

      {/* Guía de uso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
        <div>
          <h4 className="font-medium text-white mb-3">✅ Usos recomendados:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Headers y navegación web</li>
            <li>• Favicon y app icons</li>
            <li>• Documentos y presentaciones</li>
            <li>• Redes sociales (avatar/perfil)</li>
            <li>• Papelería y merchandise</li>
            <li>• Firmas de email</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-white mb-3">❌ Evitar:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• No deformar las proporciones</li>
            <li>• No cambiar los colores del núcleo</li>
            <li>• No usar sin espacio suficiente (min 8px)</li>
            <li>• No agregar efectos de sombra pesados</li>
            <li>• No usar en tamaños menores a 16px</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;