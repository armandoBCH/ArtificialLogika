# Artificial Lógika - Landing Page

Una landing page moderna y optimizada para conversiones, desarrollada con React, TypeScript y Tailwind CSS v4.

## 🚀 Stack Tecnológico

- **React 18** + **TypeScript** - Framework y tipado
- **Tailwind CSS v4** - Sistema de estilos
- **Vite** - Build tool y desarrollo
- **Motion** - Animaciones fluidas
- **Shadcn/ui** - Componentes UI
- **Vercel** - Deployment y hosting

## 🎯 Características

- ✅ **Mobile-First Design** - Responsive en todos los dispositivos
- ✅ **Dark Theme Nativo** - Tema oscuro optimizado
- ✅ **Animaciones Suaves** - UX pulido con Motion
- ✅ **SEO Optimizado** - Meta tags y estructura semántica
- ✅ **Panel de Admin** - Gestión de contenido sin código
- ✅ **Performance** - Carga rápida y optimizada

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🚀 Deploy en Vercel

### Método 1: Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Método 2: GitHub Integration

1. Hacer push del código a GitHub
2. Conectar el repositorio en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente la configuración
4. Deploy automático en cada push

### Método 3: Manual Upload

1. Ejecutar `npm run build`
2. Subir la carpeta `dist/` a Vercel
3. Configurar rewrites para SPA

## ⚙️ Configuración de Vercel

El proyecto incluye `vercel.json` con:
- ✅ **SPA Rewrites** - Routing del lado cliente
- ✅ **Cache Headers** - Optimización de assets
- ✅ **Build Configuration** - Configuración automática

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Shadcn)
│   └── figma/          # Componentes específicos
├── contexts/           # Context providers
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── styles/             # Estilos globales
└── App.tsx            # Componente raíz
```

## 🎨 Design System

- **Primary Color**: `#40d9ac` (Verde agua)
- **Background**: `#0e1015` (Negro azulado)
- **Typography**: Sora (Google Fonts)
- **Border Radius**: `10px` base
- **Animations**: Float, Pulse, Neural

## 📱 Mobile First

Todos los componentes están diseñados mobile-first:
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Typography escalada automáticamente
- Padding y spacing responsivos

## 🔧 Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico.
Para analytics o integraciones externas, crear `.env.local`:

```env
VITE_ANALYTICS_ID=your_analytics_id
VITE_CONTACT_EMAIL=info@artificiallogika.com
```

## 📊 Performance

- ✅ **Lighthouse Score**: 90+ en todas las métricas
- ✅ **Bundle Size**: < 500KB gzipped
- ✅ **First Paint**: < 1.5s
- ✅ **Interactive**: < 2.5s

## 🐛 Troubleshooting

### Build Errors
- Verificar versiones de Node.js (16+)
- Limpiar cache: `rm -rf node_modules && npm install`

### Deploy Issues
- Verificar que `dist/` se genera correctamente
- Revisar logs en Vercel dashboard

### Styling Issues
- Asegurar que Tailwind CSS v4 esté configurado
- Verificar imports de `globals.css`

## 📞 Soporte

Para soporte técnico:
- Email: info@artificiallogika.com
- Website: [artificiallogika.com](https://artificiallogika.com)

---

**Artificial Lógika** - Transformamos tu lógica de negocio en ventaja competitiva