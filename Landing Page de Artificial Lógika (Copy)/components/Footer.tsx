import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from './ui/separator';
import { Github, Linkedin, Mail, MapPin, Settings } from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';
import { useRouter } from '../contexts/RouterContext';

const Footer: React.FC = () => {
  const { content } = useEditableContent();
  const { navigateTo } = useRouter();

  return (
    <footer className="relative py-16 px-6 bg-card/20 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {content.company.name.split(' ')[0]} <span className="text-primary">{content.company.name.split(' ')[1]}</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Consultora boutique de software e IA. Fusionamos ingeniería lógica con inteligencia 
                artificial para crear soluciones que realmente transforman negocios.
              </p>
            </div>
            
            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{content.company.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{content.company.address}</span>
              </div>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2">
              {content.services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#servicios" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Empresa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2">
              {[
                { name: "Sobre Nosotros", href: "#propuesta" },
                { name: "Proyectos", href: "#proyectos" },
                { name: "Testimonios", href: "#testimonios" },
                { name: "Contacto", href: "#contacto" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              
              {/* Link de administración */}
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <Settings className="w-3 h-3 group-hover:rotate-45 transition-transform duration-300" />
                  Administración
                </button>
              </li>
            </ul>
          </motion.div>
        </div>

        <Separator className="mb-8 bg-border/50" />

        {/* Información de copyright y redes sociales */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>
              © 2025 {content.company.name}. Todos los derechos reservados.
            </p>
          </motion.div>

          {/* Redes sociales */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: content.company.socialMedia.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${content.company.email}`, label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Elemento decorativo final */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-1 h-1 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-primary/70 rounded-full" />
            <div className="w-1 h-1 bg-primary rounded-full" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
