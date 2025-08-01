# Configuración de Base de Datos Supabase

## 🚨 Errores Críticos Corregidos

### **1. Variables de Entorno**
**Problema:** Las APIs usaban `VITE_` variables en serverless functions
**Solución:** Ahora usan `SUPABASE_URL` y `SUPABASE_ANON_KEY` para APIs

### **2. Esquema de Base de Datos**
**Problema:** No había esquema definido para Supabase
**Solución:** Creado `supabase-schema.sql` con tabla y políticas

## 📋 Pasos de Configuración

### **1. Configurar Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la URL y la anon key

### **2. Ejecutar Esquema SQL**
1. Ve a SQL Editor en Supabase
2. Ejecuta el contenido de `db/supabase-schema.sql`
3. Verifica que la tabla `content` se creó

### **3. Configurar Variables de Entorno**

#### **Para Desarrollo Local (.env):**
```bash
# Frontend (Vite)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Backend (APIs)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

#### **Para Producción (Vercel):**
Configurar en Vercel Dashboard > Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### **4. Verificar Configuración**
1. Ejecuta `npm run dev`
2. Ve a `http://localhost:5173/admin`
3. Verifica que la conexión a Supabase funciona

## 🔧 Estructura de la Base de Datos

### **Tabla `content`:**
```sql
CREATE TABLE public.content (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  content_type text NOT NULL,
  content_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **Tipos de Contenido:**
- `hero` - Sección principal
- `company` - Información de la empresa
- `services` - Servicios ofrecidos
- `pricing` - Precios y planes
- `projects` - Proyectos destacados
- `testimonials` - Testimonios
- `faq` - Preguntas frecuentes

## 🛡️ Seguridad

### **Row Level Security (RLS):**
- Lectura pública permitida
- Escritura solo para usuarios autenticados
- Políticas configuradas automáticamente

### **Variables de Entorno:**
- ✅ Clave anónima (segura para frontend)
- ❌ Service role key (solo para admin)

## 🚀 Testing

### **Verificar APIs:**
```bash
# Verificar configuración
curl http://localhost:5173/api/check-env

# Obtener contenido
curl http://localhost:5173/api/content

# Obtener contenido por tipo
curl http://localhost:5173/api/content-by-type?type=hero
```

### **Errores Comunes:**
1. **"Supabase configuration missing"** → Variables no configuradas
2. **"Table does not exist"** → No se ejecutó el esquema SQL
3. **"Permission denied"** → RLS bloqueando operaciones

## 📝 Notas Importantes

- **Siempre usar la clave anónima** en el frontend
- **No subir .env a Git** (ya está en .gitignore)
- **Las APIs funcionan en desarrollo y producción**
- **El contenido por defecto se usa si no hay conexión**