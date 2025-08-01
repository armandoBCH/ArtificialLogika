# 🔧 Configuración de Variables de Entorno en Vercel

## 🚨 PROBLEMA ACTUAL
Las variables de entorno no están siendo detectadas correctamente por la aplicación en Vercel.

## 📋 PASOS PARA SOLUCIONAR

### 1. Verificar Variables en Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `artificial-logika`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas estas variables:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configurar Variables Correctamente

#### Opción A: Variables con prefijo VITE_ (Recomendado)
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

#### Opción B: Variables sin prefijo (Alternativo)
```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

### 3. Verificar Configuración

1. **Environment**: Selecciona `Production`, `Preview`, y `Development`
2. **Scope**: Debe estar en `Production` y `Preview`
3. **Value**: Copia exactamente desde Supabase

### 4. Obtener Valores Correctos de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Redeploy del Proyecto

Después de configurar las variables:

1. Ve a **Deployments** en Vercel
2. Haz clic en **Redeploy** en el último deployment
3. O haz un push a GitHub para trigger automático

### 6. Verificar Funcionamiento

1. Ve a tu dominio: `https://artificial-logika.vercel.app`
2. Ve al panel de administración: `/admin`
3. Verifica que las variables aparezcan como "✅ Configuradas"

## 🔍 DEBUGGING

### Verificar Variables en Vercel
```bash
# Ejecutar el script de verificación
node vercel-env-check.js
```

### Logs de Vercel
1. Ve a **Functions** en Vercel Dashboard
2. Selecciona `/api/check-env`
3. Revisa los logs para ver qué variables están disponibles

### Probar Endpoint Directamente
```bash
curl https://artificial-logika.vercel.app/api/check-env
```

## ⚠️ PROBLEMAS COMUNES

### 1. Variables no detectadas
- **Causa**: Variables configuradas solo en Development
- **Solución**: Configurar en Production y Preview

### 2. Valores incorrectos
- **Causa**: Copiar valores incorrectos de Supabase
- **Solución**: Verificar en Settings → API de Supabase

### 3. Redeploy necesario
- **Causa**: Variables configuradas pero no aplicadas
- **Solución**: Hacer redeploy manual

## ✅ VERIFICACIÓN FINAL

Después de configurar todo:

1. **Panel Admin**: `/admin` debe mostrar "✅ Configuradas"
2. **Estado**: Debe cambiar de "Error" a "OK"
3. **Funcionalidad**: Debe poder editar contenido

## 🆘 SI SIGUE FALLANDO

1. **Verificar Supabase**: Que la tabla `content` exista
2. **Revisar logs**: En Vercel Functions
3. **Contactar soporte**: Si el problema persiste

---

**Última actualización**: $(date)
**Estado**: Variables configuradas pero no detectadas 