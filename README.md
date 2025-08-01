# Artificial Lógika - Landing Page

> **🚨 IMPORTANTE (2025)**: Este proyecto requiere **Node.js 22.x** debido a la deprecación de Node.js 18.x en Vercel. Ver [migración](#-migración-nodejs-22x) más abajo.

Landing page profesional para consultora boutique de software e IA, con sistema de administración completo y base de datos híbrida (Supabase + IndexedDB).

## 🚀 Características

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS v3** con diseño responsive mobile-first
- **Framer Motion** para animaciones suaves
- **Shadcn/ui** para componentes de interfaz
- **Sora** como tipografía principal

### Backend y Base de Datos
- **Base de datos híbrida**: Supabase (nube) + IndexedDB (local)
- **Fallback automático**: Si Supabase no está disponible, usa IndexedDB
- **Sincronización bidireccional** entre ambas bases de datos
- **Persistencia completa** sin pérdida de datos

### Sistema de Administración
- **Panel de administración completo** en `/admin`
- **Gestión de contenido** sin código
- **Sistema de precios** con calculadora personalizable
- **Gestión de proyectos** con drag & drop
- **Exportación/importación** de datos
- **Configuración de empresa** y redes sociales

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/artificial-logika-landing.git
cd artificial-logika-landing
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional para Supabase)
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🗄️ Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia la URL del proyecto y la clave anónima

### Paso 2: Configurar la Base de Datos
1. Ve al editor SQL de tu proyecto Supabase
2. Ejecuta el siguiente código SQL:

```sql
-- Enable RLS (Row Level Security)
alter table if exists public.content enable row level security;

-- Create content table
create table if not exists public.content (
  id text primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content_type text not null,
  content_data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create policies
create policy "Users can manage own content" on public.content
  for all using (auth.uid() = user_id or user_id is null);

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger content_updated_at
  before update on public.content
  for each row execute function public.handle_updated_at();
```

### Paso 3: Variables de Entorno
Añade las variables de entorno en tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 4: Configurar en Vercel (Producción)
1. Ve a tu proyecto en Vercel
2. Configuración > Environment Variables
3. Añade las mismas variables que en tu `.env`

## 📁 Estructura del Proyecto

```
├── components/
│   ├── admin/           # Componentes del panel de administración
│   ├── ui/              # Componentes de interfaz (Shadcn)
│   └── ...              # Componentes de la landing page
├── contexts/            # React Contexts
├── db/                  # Configuración de base de datos
├── pages/               # Páginas principales
├── styles/              # Estilos globales
└── hooks/               # Custom hooks
```

## 🎨 Personalización

### Colores del Proyecto
- **Primario**: `#40d9ac` (Verde menta)
- **Fondo**: `#0e1015` (Azul oscuro)
- **Cards**: `#1a1d24` (Gris azulado)

### Tipografía
- **Fuente principal**: Sora (Google Fonts)
- **Tamaños responsivos** optimizados para mobile

### Filosofía de Diseño
**"Logic as Aesthetics"** - Cada elemento debe sentirse deliberado, eficiente y elegante.

## 🔧 Sistema de Base de Datos

### Funcionamiento Híbrido
1. **Supabase (Principal)**: Si está configurado, se usa como base de datos principal
2. **IndexedDB (Fallback)**: Se usa automáticamente si Supabase no está disponible
3. **Sincronización**: Los datos se sincronizan automáticamente entre ambas bases

### Gestión de Datos
- **Auto-guardado**: Los cambios se guardan automáticamente
- **Backup/Restore**: Exportación e importación de datos
- **Sin pérdida de datos**: Funciona sin conexión a internet

## 🚨 Migración Node.js 22.x

**ACCIÓN REQUERIDA**: Vercel deprecó Node.js 18.x efectivo desde septiembre 2025.

### Pasos de Migración:
1. **Actualizar Node.js local** (opcional pero recomendado):
   ```bash
   nvm install 22
   nvm use 22
   ```

2. **Configurar Vercel Dashboard**:
   - Ve a tu proyecto en Vercel
   - Settings → General → Node.js Version
   - Cambiar de "18.x" a **"22.x"**
   - Guardar configuración

3. **El package.json ya está actualizado** con `"engines": { "node": "22.x" }`

4. **Redesplegar**:
   ```bash
   git commit -am "Migrate to Node.js 22.x"
   git push
   ```

❌ **Sin migración**: Los builds fallarán después del 2025-09-01  
✅ **Con migración**: Funcionamiento normal garantizado

## 🚀 Deploy

### Vercel (Recomendado)
1. **PRIMERO**: Configurar Node.js 22.x en Settings (ver migración arriba)
2. Conecta tu repositorio de GitHub a Vercel
3. Configura las variables de entorno en Vercel
4. Deploy automático con cada push

### Otras Plataformas
- **Netlify**: Compatible con configuración similar
- **Railway**: Soporte para bases de datos y hosting
- **GitHub Pages**: Solo para versión estática

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 640px, 768px, 1024px
- **Tipografía adaptativa**: Tamaños que se ajustan automáticamente
- **Navegación mobile**: Menú hamburguesa optimizado

## 🔒 Seguridad

- **Row Level Security (RLS)**: Activado en Supabase
- **Validación de datos**: Tanto en frontend como backend
- **Sanitización**: Contenido limpio y seguro
- **HTTPS**: Conexiones seguras por defecto

## 🤝 Contribución

1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes algún problema o pregunta:

1. Revisa la documentación en `/guidelines/Guidelines.md`
2. Busca en los Issues existentes
3. Crea un nuevo Issue con detalles del problema
4. Para soporte urgente: [tu-email@ejemplo.com]

## 🎯 Roadmap

- [ ] Autenticación de usuarios
- [ ] Dashboard de analytics
- [ ] Integración con CRM
- [ ] API REST para integraciones
- [ ] Sistema de notificaciones
- [ ] Multi-idioma

---

**Desarrollado con ❤️ por [Armando Beato Chang](https://github.com/armando-beato)**