# Arquitectura del Proyecto

## 🏗️ Stack Tecnológico

### Frontend (Vite + React)
- **Build Tool**: Vite (NO Next.js)
- **Framework**: React 18 con TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: Custom router context (no React Router)
- **State**: React Context API

### Backend (Vercel Serverless Functions)
- **API Endpoints**: Sintaxis Next.js corriendo en Vercel
- **Runtime**: Node.js 22.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Sin autenticación (contenido público)

### Deploy (Vercel)
- **Frontend**: Vite build → static files
- **Backend**: Serverless functions en `/api/`
- **Variables**: Configuradas en Vercel Dashboard

## 🤔 ¿Por qué Vite + Endpoints Next.js?

**¿No hay conflicto?** ❌ **NO hay conflicto**

- **Vite** maneja el frontend (React app)
- **Vercel Serverless Functions** manejan el backend (API endpoints)
- Ambos conviven perfectamente en el mismo repositorio

### Estructura del Proyecto:
```
/
├── App.tsx              # Frontend (Vite)
├── main.tsx             # Entry point (Vite)
├── vite.config.ts       # Configuración Vite
├── package.json         # Scripts de Vite
├── /api/                # Backend (Vercel Functions)
│   ├── content.ts       # Endpoint con sintaxis Next.js
│   └── *.ts             # Más endpoints
└── /components/         # Frontend (React)
```

## 🚀 Cómo Funciona en Vercel

1. **Build del Frontend**:
   ```bash
   npm run build  # Vite build → /dist/
   ```

2. **Deploy Automático**:
   - Vercel detecta `vite.config.ts` → build frontend con Vite
   - Vercel detecta `/api/` → crea serverless functions
   - Variables de entorno se inyectan automáticamente

3. **Runtime**:
   - Frontend: Static files servidos por Vercel CDN
   - Backend: Serverless functions con Node.js 22.x

## 📡 API Architecture

### Endpoints Disponibles:
- `GET /api/content` → Obtener todo el contenido
- `POST /api/content` → Crear contenido
- `PUT /api/content` → Actualizar contenido
- `DELETE /api/content` → Eliminar contenido
- `GET /api/content-by-type?type=hero` → Contenido por tipo
- `POST /api/content-by-type?type=hero` → Upsert por tipo

### Ejemplo de Uso:
```typescript
// Frontend (React)
const updateContent = async (type: string, data: any) => {
  const response = await fetch('/api/content-by-type?' + new URLSearchParams({ type }), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_data: data })
  });
  return response.json();
};
```

## 🔧 Configuración Vercel

### vercel.json:
```json
{
  "buildCommand": "npm run build",    // Vite build
  "outputDirectory": "dist",          // Vite output
  "framework": "vite",                // Framework detection
  "functions": {
    "api/**": {
      "runtime": "nodejs22.x"         // Serverless functions
    }
  }
}
```

### Variables de Entorno:
```bash
# Configurar en Vercel Dashboard > Environment Variables
VITE_SUPABASE_URL=https://proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

## ✅ Ventajas de Esta Arquitectura

1. **Simplicidad**: Frontend y backend en un solo repo
2. **Escalabilidad**: Serverless functions se escalan automáticamente  
3. **Performance**: Frontend estático + CDN de Vercel
4. **Mantenimiento**: Un solo deploy, una sola configuración
5. **Cost-effective**: Solo pagas por las function calls

## 🚨 Consideraciones Importantes

- **No es Next.js**: Aunque los endpoints usan sintaxis Next.js
- **No hay SSR**: Es una SPA (Single Page Application)
- **API-only**: Sin fallbacks locales (requiere internet)
- **Supabase obligatorio**: Sin Supabase no funciona

Esta arquitectura es **estándar, probada y recomendada** para aplicaciones como landing pages con CMS.