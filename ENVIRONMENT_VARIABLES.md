# 🔧 Variables de Entorno en Vercel - Configuración Correcta

## 📋 **REGLAS FUNDAMENTALES**

### **1. API Routes (Servidor) - `process.env`**
Los archivos en `/api/` se ejecutan en el servidor de Vercel y usan `process.env`:

```typescript
// ✅ CORRECTO para API routes
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
```

**Archivos que usan esto:**
- `api/status.ts`
- `api/check-env.ts`
- `api/content.ts`
- `api/content-by-type.ts`

### **2. Cliente (React) - `import.meta.env`**
Los componentes React se ejecutan en el navegador y usan `import.meta.env`:

```typescript
// ✅ CORRECTO para componentes React
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**Archivos que usan esto:**
- `db/config.ts`
- Todos los componentes en `/components/`
- Contextos en `/contexts/`

## 🎯 **CONFIGURACIÓN EN VERCEL**

### **Variables Necesarias:**
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Configuración en Vercel Dashboard:**
1. Ve a **Settings** → **Environment Variables**
2. Agrega las variables con prefijo `VITE_`
3. Selecciona **Production**, **Preview**, y **Development**
4. Haz redeploy después de configurar

## 🔍 **VERIFICACIÓN**

### **1. Verificar API (Servidor)**
```bash
curl https://artificial-logika.vercel.app/api/status
```

### **2. Verificar Cliente (Navegador)**
- Ve a `/admin` en tu sitio
- Revisa la consola del navegador
- Debe mostrar las variables como "✅ Configuradas"

## ⚠️ **PROBLEMAS COMUNES**

### **Error: Variables no detectadas**
- **Causa**: Variables configuradas solo en Development
- **Solución**: Configurar en Production y Preview

### **Error: Acceso incorrecto**
- **Causa**: Usar `process.env` en componentes React
- **Solución**: Usar `import.meta.env` en el cliente

### **Error: Variables vacías**
- **Causa**: Valores incorrectos en Vercel
- **Solución**: Verificar en Supabase Dashboard

## ✅ **ESTADO ACTUAL**

- **✅ API Routes**: Usan `process.env` correctamente
- **✅ Cliente**: Usa `import.meta.env` correctamente
- **✅ Configuración**: Consistente en todo el proyecto

---

**Última actualización**: 1 de Agosto, 2024
**Estado**: ✅ Configuración corregida según estándares de Vercel 