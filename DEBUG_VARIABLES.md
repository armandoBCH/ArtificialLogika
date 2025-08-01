# 🔍 Debugging de Variables de Entorno

## 🚨 PROBLEMA ACTUAL
Las variables de entorno están configuradas en Vercel pero no se detectan en la aplicación.

## 📋 PASOS PARA DIAGNOSTICAR

### 1. Verificar Variables en Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `artificial-logika`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Verificar Configuración

**IMPORTANTE**: Asegúrate de que las variables estén configuradas para:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### 3. Probar Endpoints de Debugging

Después del deploy (espera 2-3 minutos), prueba estos endpoints:

```bash
# Endpoint de prueba detallado
curl https://artificial-logika.vercel.app/api/test-env

# Endpoint de estado
curl https://artificial-logika.vercel.app/api/status
```

### 4. Verificar Logs en Vercel

1. Ve a **Functions** en Vercel Dashboard
2. Selecciona `/api/test-env`
3. Revisa los logs para ver qué variables están disponibles

## 🔧 POSIBLES SOLUCIONES

### Opción A: Variables sin prefijo VITE_
Si las variables con `VITE_` no funcionan, prueba sin el prefijo:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Opción B: Redeploy Manual
1. Ve a **Deployments** en Vercel
2. Haz clic en **Redeploy** en el último deployment
3. Espera a que termine el deploy

### Opción C: Verificar Valores
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Tu proyecto → **Settings** → **API**
3. Copia exactamente los valores

## 📊 INTERPRETACIÓN DE RESULTADOS

### Si `/api/test-env` muestra:
- **"exists: true"** → Variables detectadas ✅
- **"exists: false"** → Variables no detectadas ❌

### Si hay variables pero no funcionan:
- Verificar que los valores sean correctos
- Verificar que no haya espacios extra
- Verificar que la URL incluya `https://`

## 🆘 SI NADA FUNCIONA

1. **Crear variables nuevas** con nombres diferentes
2. **Contactar soporte de Vercel** si el problema persiste
3. **Usar modo demo** mientras se resuelve

---

**Última actualización**: 1 de Agosto, 2024
**Estado**: 🔍 En proceso de debugging 