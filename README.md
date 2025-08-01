# 🚀 Artificial Lógika - Landing Page

**Landing page moderna y dinámica para consultora de software e IA**

## ✨ **Características**

- **🎨 Diseño moderno** - UI/UX profesional con animaciones suaves
- **📱 Mobile-first** - Responsive design optimizado
- **⚡ Rendimiento** - Carga ultra rápida con Vite + React
- **🔄 Contenido dinámico** - Edición en tiempo real desde admin panel
- **🌐 Turso Database** - Base de datos SQLite escalable en la nube
- **🚀 Vercel Deploy** - Hosting edge con CDN global

## 🛠️ **Stack Tecnológico**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Framer Motion
- **UI Components**: Shadcn/ui
- **Database**: Turso (SQLite en la nube)
- **Hosting**: Vercel Serverless Functions
- **State Management**: React Context API

## 🚀 **Instalación Rápida**

```bash
# Clonar repositorio
git clone https://github.com/armandoBCH/ArtificialLogika.git
cd ArtificialLogika

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Turso

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 **Configuración de Turso**

### **1. Crear base de datos Turso:**
```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Crear base de datos
turso db create artificial-logika

# Obtener URL y token
turso db show artificial-logika
turso db tokens create artificial-logika
```

### **2. Configurar variables de entorno:**
```bash
# .env.local
VITE_TURSO_DATABASE_URL=libsql://artificial-logika.turso.io
VITE_TURSO_AUTH_TOKEN=tu-token-de-turso
```

### **3. Ejecutar esquema SQL:**
```bash
turso db shell artificial-logika
# Copia y pega el contenido de db/turso-schema.sql
```

## 📁 **Estructura del Proyecto**

```
├── /components          # Componentes React
│   ├── /admin          # Panel de administración
│   ├── /ui             # Componentes UI base
│   └── /figma          # Componentes específicos
├── /contexts           # React Context API
├── /db                 # Configuración de base de datos
├── /api                # Endpoints de Vercel
├── /lib                # Utilidades y helpers
└── /public             # Assets estáticos
```

## 🎯 **Funcionalidades Principales**

### **Admin Panel**
- Edición en tiempo real del contenido
- Gestión de secciones (Hero, Services, Company)
- Sincronización automática con Turso
- Fallback a IndexedDB local

### **Contenido Dinámico**
- Hero section con animaciones
- Servicios con pricing dinámico
- Testimonios y casos de éxito
- Información de contacto editable

### **Performance**
- Lazy loading de componentes
- Optimización de imágenes
- Code splitting automático
- Cache inteligente

## 🌐 **Deployment**

### **Vercel (Recomendado)**
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### **Variables de Entorno en Vercel:**
```bash
VITE_TURSO_DATABASE_URL=libsql://artificial-logika.turso.io
VITE_TURSO_AUTH_TOKEN=tu-token-de-turso
```

## 🔍 **Endpoints API**

- `GET /api/content` - Obtener todo el contenido
- `POST /api/content` - Crear nuevo contenido
- `PUT /api/content` - Actualizar contenido
- `DELETE /api/content` - Eliminar contenido
- `GET /api/status` - Verificar estado de Turso

## 📊 **Migración a Turso**

**✅ Completada**: Migración completa de Supabase a Turso para mejor rendimiento y simplicidad.

### **Ventajas de Turso:**
- ⚡ **Mejor rendimiento** - Más rápido que Supabase
- 🔧 **Más simple** - Menos configuración
- 💰 **Más económico** - Mejor plan gratuito
- 🌍 **Mejor distribución** - Edge locations globales
- 📱 **SQLite nativo** - Compatibilidad total

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 **Contacto**

- **Desarrollador**: Armando Beato
- **Email**: contacto@artificiallogika.com
- **LinkedIn**: [armando-beato](https://linkedin.com/in/armando-beato)
- **GitHub**: [artificial-logika](https://github.com/artificial-logika)

---

**Desarrollado con ❤️ por Artificial Lógika**