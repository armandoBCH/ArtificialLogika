# CARPETA /db/ - MIGRACIÓN A API-ONLY

Esta carpeta ha sido **parcialmente eliminada** como parte de la migración a arquitectura API-only.

## 🗑️ ARCHIVOS ELIMINADOS (Sistema Híbrido)
- `hybridManager.ts` ❌ Eliminado
- `indexedDB.ts` ❌ Eliminado  
- `localStorage.ts` ❌ Eliminado
- `operations.ts` ❌ Eliminado
- `types.ts` ❌ Eliminado

## ✅ ARCHIVOS CONSERVADOS (Referencia y utilidad)
- `config.ts` ✅ Configuración de Supabase
- `supabase.ts` ✅ Cliente de Supabase
- `schema.ts` ✅ Esquemas TypeScript
- `supabase-schema.sql` ✅ SQL para crear tablas

## 🆕 NUEVA ARQUITECTURA
**Ya no usamos:**
- IndexedDB
- localStorage  
- Sistema híbrido
- Sincronización compleja

**Ahora usamos únicamente:**
- Supabase como base de datos única
- Endpoints API en `/api/content.ts` y `/api/content-by-type.ts`
- Fetch directo desde el frontend vía `EditableContentContext.tsx`

## 📁 ARCHIVOS ÚTILES CONSERVADOS

### `config.ts`
Configuración centralizada de Supabase con validación de variables de entorno.

### `supabase.ts` 
Cliente de Supabase para usar en casos especiales (aunque los endpoints API son preferidos).

### `schema.ts`
Definiciones TypeScript para la estructura de datos de Supabase.

### `supabase-schema.sql`
Script SQL completo para crear las tablas necesarias en Supabase.

## 🚀 CÓMO USAR LA NUEVA ARQUITECTURA

1. **Variables de entorno**: Configurar en Vercel Dashboard
2. **Crear tablas**: Ejecutar `supabase-schema.sql` en Supabase
3. **Frontend**: Usar `EditableContentContext` para todas las operaciones
4. **API**: Los endpoints manejan toda la comunicación con Supabase

Esta arquitectura es **más simple, confiable y mantenible** que el sistema híbrido anterior.