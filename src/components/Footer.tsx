import { Brain, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Artificial Lógika</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-8">
            <a 
              href="#servicios" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Servicios
            </a>
            <a 
              href="#proyectos" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Proyectos
            </a>
            <a 
              href="#contacto" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </nav>
          
          {/* Social */}
          <div className="flex items-center gap-4">
            <a 
              href="https://linkedin.com/company/artificial-logika" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors group"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Artificial Lógika. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
