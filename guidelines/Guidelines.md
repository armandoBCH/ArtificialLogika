# 🚀 Guidelines de Desarrollo - Artificial Lógika

## 📋 **RESUMEN DEL PROYECTO**

Landing page moderna con panel de administración completo, migrada a Turso para mejor rendimiento y simplicidad.

### **Stack Actual:**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Framer Motion
- **UI**: Shadcn/ui components
- **Database**: Turso (SQLite en la nube)
- **Hosting**: Vercel Serverless Functions
- **State**: React Context API

## 🎯 **ESTRUCTURA DE ARCHIVOS**

### **Archivos Principales (NO TOCAR):**
```
App.tsx              # Componente principal
main.tsx             # Entry point
vite.config.ts       # Configuración Vite
package.json          # Dependencias y scripts
```

### **Directorios Organizados:**
```
/components/          # Componentes React
  /admin/            # Panel de administración
  /ui/               # Componentes base (Shadcn)
  /figma/            # Componentes específicos
/contexts/           # React Context API
/db/                 # Configuración Turso
/api/                # Endpoints Vercel
/lib/                # Utilidades
/public/             # Assets estáticos
```

## 🚨 **REGLAS CRÍTICAS**

### **1. NO crear archivos .env locales**
- ❌ NO crear `.env`, `.env.local`, `.env.example`
- ✅ Usar SOLO variables de Vercel Dashboard
- ✅ Variables requeridas: `VITE_TURSO_DATABASE_URL`, `VITE_TURSO_AUTH_TOKEN`

### **2. NO duplicar entry points**
- ❌ NO crear múltiples `App.tsx` o `main.tsx`
- ✅ Solo UN `App.tsx` en la raíz
- ✅ Solo UN `main.tsx` en la raíz

### **3. NO usar Next.js**
- ❌ NO instalar `next` o `@next/*`
- ✅ Usar SOLO Vite para frontend
- ✅ Endpoints usan sintaxis Next.js pero NO es Next.js

## 🔧 **PROCESO DE DESARROLLO**

### **1. Desarrollo Local:**
```bash
npm install          # Instalar dependencias
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run lint         # Verificar código
```

### **2. Deploy:**
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
# Vercel deploy automático
```

### **3. Verificación:**
- ✅ `npm run build` exitoso
- ✅ `tsc --noEmit` sin errores
- ✅ Variables configuradas en Vercel
- ✅ Admin panel funciona en `/admin`

## 📊 **ARQUITECTURA ACTUAL**

### **Migración Completada: Supabase → Turso**

**✅ CAMBIOS REALIZADOS:**
- Dependencias: `@supabase/supabase-js` → `@libsql/client`
- Variables: `VITE_SUPABASE_*` → `VITE_TURSO_*`
- Endpoints: Actualizados para Turso
- Componentes: `SupabaseConfig` → `TursoConfig`

**✅ VENTAJAS DE TURSO:**
- ⚡ Mejor rendimiento
- 🔧 Configuración más simple
- 💰 Plan gratuito más generoso
- 🌍 Mejor distribución global

## 🎨 **GUIDELINES DE DISEÑO**

### **Colores:**
```css
--primary: #40d9ac    /* Verde menta */
--background: #0e1015 /* Azul oscuro */
--card: #1a1d24      /* Gris azulado */
```

### **Tipografía:**
- **Principal**: Sora (Google Fonts)
- **Responsive**: Tamaños adaptativos
- **Mobile-first**: Diseño optimizado para móviles

### **Componentes:**
- Usar Shadcn/ui como base
- Mantener consistencia visual
- Animaciones con Framer Motion
- Accesibilidad incluida

## 🚀 **CONFIGURACIÓN EN VERCEL**

### **Variables Requeridas:**
```bash
VITE_TURSO_DATABASE_URL=libsql://artificial-logika.turso.io
VITE_TURSO_AUTH_TOKEN=tu-token-de-turso
```

### **Configuración:**
1. Vercel Dashboard → Project Settings
2. Environment Variables → Add New
3. Seleccionar: Production, Preview, Development
4. Redeploy automático

## 🔍 **ENDPOINTS API**

### **Disponibles:**
- `GET /api/content` - Obtener todo
- `POST /api/content` - Crear
- `PUT /api/content` - Actualizar
- `DELETE /api/content` - Eliminar
- `GET /api/status` - Verificar Turso

### **Uso en Frontend:**
```typescript
const updateContent = async (type: string, data: any) => {
  const response = await fetch('/api/content-by-type?' + new URLSearchParams({ type }), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_data: data })
  });
  return response.json();
};
```

## 🆘 **TROUBLESHOOTING**

### **Build Fails:**
- Verificar TypeScript errors: `tsc --noEmit`
- Verificar dependencias: `npm install`
- Verificar estructura de archivos

### **Admin Panel No Carga:**
- Verificar variables en Vercel
- Verificar endpoint `/api/status`
- Verificar conexión a Turso

### **Variables No Detectadas:**
- Verificar nombres exactos en Vercel
- Verificar que estén en todas las environments
- Hacer redeploy después de configurar

## 📝 **COMMIT MESSAGES**

### **Formato:**
```bash
git commit -m "Type: Descripción breve"

# Ejemplos:
git commit -m "Fix: Corregir error de TypeScript"
git commit -m "Feat: Agregar nueva sección"
git commit -m "Update: Migrar a Turso"
git commit -m "Style: Mejorar diseño responsive"
```

### **Tipos:**
- `Fix`: Corrección de bugs
- `Feat`: Nueva funcionalidad
- `Update`: Actualización de dependencias
- `Style`: Cambios de diseño
- `Refactor`: Mejoras de código
- `Docs`: Documentación

## ✅ **CHECKLIST FINAL**

Antes de hacer commit:
- [ ] `npm run build` exitoso
- [ ] `tsc --noEmit` sin errores
- [ ] Admin panel funciona
- [ ] Variables configuradas en Vercel
- [ ] Código limpio y comentado
- [ ] Commit message descriptivo

---

**Última actualización**: Agosto 2024
**Estado**: ✅ Migración a Turso completada