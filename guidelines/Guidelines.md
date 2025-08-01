# Guidelines de Armando Beato

## Filosofía de Diseño
**"Logic as Aesthetics"** - Cada elemento debe sentirse deliberado, eficiente y elegante, con claridad estructural, movimiento con propósito y minimalismo funcional.

## Colores del Proyecto
- **Primario**: #40d9ac (Verde menta - HSL: 166° 65% 55%)
- **Fondo**: #0e1015 (Azul oscuro - HSL: 210° 20% 7%) 
- **Card/Secondary**: #1a1d24 (Gris azulado - HSL: 210° 15% 13%)
- **Tipografía**: Sora (Google Fonts)

## Errores y Conclusiones del Deploy

### ⚠️ ERRORES RESUELTOS DURANTE EL DESARROLLO

#### 1. **Error de TypeScript Build (RESUELTO)**
- **Problema**: Variables no utilizadas en componentes
- **Error**: `'content' is declared but its value is never read`
- **Solución**: Eliminar variables unused en Pricing.tsx y otros componentes
- **Lección**: Siempre revisar warnings de TypeScript antes del deploy

#### 2. **Error de Tailwind CSS V4 PostCSS (RESUELTO)**
- **Problema**: `tailwindcss directly as a PostCSS plugin`
- **Error**: Tailwind V4 alpha requiere plugin separado `@tailwindcss/postcss`
- **Solución**: Downgrade a Tailwind V3 estable (`^3.4.0`)
- **Lección**: NO usar versiones alpha en producción

#### 3. **Error de Estilos CSS No Aplicados (RESUELTO)**
- **Problema**: Los estilos de Tailwind no se aplicaban, solo las animaciones
- **Causas**:
  - Configuración incorrecta de PostCSS en vite.config.ts
  - Sintaxis @theme incompatible con V3
  - Variables HSL mal definidas
- **Soluciones**:
  - Cambiar `css.postcss.plugins: []` por `css.postcss: './postcss.config.js'`
  - Usar @layer base en lugar de @theme
  - Importar Tailwind correctamente: `@import "tailwindcss/base"`

#### 4. **Error de Colores Incorrectos (RESUELTO)**
- **Problema**: Los colores se muestran invertidos (verde se ve violeta)
- **Causa**: Valores HSL incorrectos en variables CSS
- **Conversión correcta**:
  - #40d9ac → 166° 65% 55% (no 64 217 172)
  - #0e1015 → 210° 20% 7% (no 14 16 21)
- **Solución**: Corregir todas las variables HSL en globals.css

#### 5. **Problemas de Diseño Mobile (RESUELTO)**
- **Problema**: Texto muy pequeño en móvil, iconos mal alineados
- **Causa**: Tipografía base demasiado pequeña y grid inapropiado
- **Soluciones**:
  - Aumentar font-size base de 14px a 16px (15px en móvil)
  - Hero title de text-2xl a text-3xl en móvil
  - Iconos sección "autogestionable" en grid vertical en móvil
  - Mejorar spacing y alignment mobile-first

#### 6. **Error de Dependencia Radix UI Sheet (RESUELTO)**
- **Problema**: `@radix-ui/react-sheet@^0.2.3` no existe en npm registry
- **Error**: `Error npm 404 No encontrado - GET https://registry.npmjs.org/@radix-ui%2freact-sheet`
- **Causa**: Dependencia inexistente listada en package.json
- **Solución**: Eliminar `"@radix-ui/react-sheet": "^0.2.3"` del package.json
- **Nota**: El componente Sheet usa correctamente `@radix-ui/react-dialog` que sí existe
- **Lección**: Verificar que todas las dependencias existan antes del deploy

#### 7. **Error de Importaciones Motion React (RESUELTO)**
- **Problema**: `Cannot find module 'motion/react' or its corresponding type declarations`
- **Error**: Múltiples archivos (Footer, Hero, Pricing, AdminPage) fallan en build
- **Causa**: Dependencias conflictivas: `"motion": "^10.18.0"` y `"framer-motion": "^11.0.8"`
- **Solución**: 
  - Eliminar `"motion": "^10.18.0"` del package.json
  - Cambiar `import { motion } from 'motion/react'` por `import { motion } from 'framer-motion'`
  - Eliminar imports no utilizados en AdminPage.tsx y otros archivos
- **Lección**: Un solo paquete de animaciones es suficiente, usar framer-motion estable

#### 8. **Error de Archivos Duplicados de Entry Point (RESUELTO)**
- **Problema**: Conflictos en build por archivos duplicados en diferentes carpetas
- **Error**: Vite/Vercel se confunde con múltiples entry points (App.tsx en `/` y `/src/`)
- **Causa**: Estructura de archivos inconsistente con archivos principales en dos ubicaciones
- **Archivos problemáticos**:
  - `/App.tsx` (CORRECTO - usar este)
  - `/main.tsx` (CORRECTO - usar este)
  - `/src/App.tsx` (DUPLICADO - eliminar)
  - `/src/main.tsx` (DUPLICADO - eliminar)
- **Solución**: 
  - Mantener `/App.tsx` y `/main.tsx` en la raíz como entry points principales
  - Marcar archivos en `/src/` como eliminados con comentario identificador
  - Actualizar index.html para que apunte a `/main.tsx` (no `/src/main.tsx`)
- **Lección**: Mantener estructura de entry points consistente y evitar archivos duplicados

#### 9. **Error de Variables de Entorno import.meta.env (RESUELTO)**
- **Problema**: `⚠️ import.meta.env is not available. Using fallback for VITE_SUPABASE_URL`
- **Error**: Variables de entorno no disponibles en desarrollo local causando warnings en consola
- **Causa**: Acceso no defensivo a `import.meta.env` sin validación de disponibilidad
- **Solución**:
  - Implementar función `getImportMeta()` con manejo de errores defensivo
  - Silenciar warnings en modo normal, solo mostrar en modo debug (`VITE_DEBUG_DB=true`)
  - Fallback silencioso a IndexedDB cuando las variables no están disponibles
  - Acceso seguro a `import.meta.env` con verificación de disponibilidad
- **Configuración mejorada**:
  - Variables de entorno manejadas automáticamente por Vite
  - Desarrollo local: funciona perfectamente sin variables (IndexedDB)
  - Producción Vercel: variables aplicadas automáticamente durante build
  - Sistema híbrido robusto que nunca falla
- **Lección**: Siempre usar acceso defensivo a objetos globales como `import.meta.env`

#### 10. **Error de Vercel Function Runtimes (RESUELTO)**
- **Problema**: `Error: Function Runtimes must have a valid version, for example 'now-php@1.0.0'`
- **Error**: Vercel build falla por configuración incorrecta de funciones serverless en vercel.json
- **Causa**: 
  - Configuración `"runtime": "nodejs18.x"` incorrecta en vercel.json
  - Sintaxis de runtime incorrecta para la versión actual de Vercel
- **Solución**:
  - Usar runtime correcto: `"@vercel/node@3.0.7"` en lugar de `"nodejs18.x"`
  - Añadir dependencia `@vercel/node` al package.json como devDependency
  - Configurar CORS correctamente en el endpoint de API
- **Configuración correcta vercel.json**:
  ```json
  {
    "functions": {
      "api/check-env.ts": {
        "runtime": "@vercel/node@3.0.7"
      }
    }
  }
  ```
- **Lección**: Usar la sintaxis correcta de runtime de Vercel y dependencias apropiadas

#### 11. **Error de API Endpoint Failed to Connect (RESUELTO)**
- **Problema**: `Error: failed to connect to API endpoint`
- **Error**: La aplicación falla al intentar conectarse al endpoint de verificación de variables de entorno
- **Causa**: 
  - Endpoint `/api/check-env.ts` eliminado incorrectamente
  - La aplicación SÍ requiere el endpoint para verificar estado del servidor
  - Sistema híbrido necesita validar disponibilidad de Supabase desde el servidor
- **Solución**:
  - Restaurar endpoint `/api/check-env.ts` con sintaxis correcta de Vercel
  - Configurar CORS apropiadamente para llamadas desde frontend
  - Añadir manejo de errores robusto y logging
  - Usar tipos TypeScript correctos: `VercelRequest, VercelResponse`
- **Lección**: El sistema híbrido SÍ necesita endpoints serverless para validación completa

### 🔧 CONFIGURACIONES CRÍTICAS

#### **Variables de Entorno (Solo Vercel)**
```bash
# ✅ CONFIGURAR ÚNICAMENTE EN VERCEL
# Vercel Dashboard > Project Settings > Environment Variables

VITE_SUPABASE_URL=https://proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=jwt-token-publico

# Variables opcionales
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SYNC=true
VITE_DEBUG_DB=false
```

#### **package.json**
```json
{
  "dependencies": {
    // ✅ CORRECTAS - Estas dependencias SÍ existen
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "framer-motion": "^11.0.8",  // Para animaciones
    
    // ❌ INCORRECTAS - Estas dependencias NO existen o son duplicadas
    // "@radix-ui/react-sheet": "^0.2.3",  // ELIMINAR
    // "motion": "^10.18.0",  // ELIMINAR (duplica framer-motion)
    
    "tailwindcss": "^3.4.0"  // NO usar V4 alpha
  },
  "devDependencies": {
    "@vercel/node": "^3.0.7",  // ✅ NECESARIO para endpoints serverless
    // ... otras dependencias
  }
}
```

#### **vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ],
  "functions": {
    "api/check-env.ts": {
      "runtime": "@vercel/node@3.0.7"
    }
  }
}
```

#### **Estructura de Entry Points Correcta**
```
/ (raíz del proyecto)
├── App.tsx          ✅ PRINCIPAL - Entry point de React
├── main.tsx         ✅ PRINCIPAL - Entry point de Vite
├── index.html       ✅ Apunta a /main.tsx
└── src/
    ├── App.tsx      ❌ DUPLICADO - Eliminar o marcar como eliminado
    └── main.tsx     ❌ DUPLICADO - Eliminar o marcar como eliminado
```

#### **index.html Configuración Correcta**
```html
<script type="module" src="/main.tsx"></script>
<!-- NO /src/main.tsx -->
```

#### **Importaciones Motion Correctas**
```tsx
// ✅ CORRECTO
import { motion } from 'framer-motion';

// ❌ INCORRECTO
import { motion } from 'motion/react';
```

#### **components/ui/sheet.tsx**
```tsx
// ✅ CORRECTO - Sheet usa dialog internamente
import * as SheetPrimitive from "@radix-ui/react-dialog";
```

#### **postcss.config.js** 
```js
plugins: {
  tailwindcss: {},  // NO '@tailwindcss/postcss'
  autoprefixer: {},
}
```

#### **vite.config.ts**
```ts
css: {
  postcss: './postcss.config.js',  // NO plugins: []
}
// Variables de entorno manejadas automáticamente por Vite
// Las variables de Vercel están disponibles durante build time
```

#### **globals.css**
```css
@import "tailwindcss/base";     // NO @import "tailwindcss"
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

### 📁 ARCHIVOS PROBLEMÁTICOS Y SOLUCIONES

#### **Archivos Duplicados (RESUELTO)**
- `/src/App.tsx` → Marcado como `// ARCHIVO COMPLETAMENTE ELIMINADO - NO USAR`
- `/src/main.tsx` → Marcado como `// ARCHIVO COMPLETAMENTE ELIMINADO - NO USAR`
- **IMPORTANTE**: No eliminar físicamente para evitar confusión, solo marcar como eliminados

#### **Archivos Principales (CORRECTOS)**
- `/App.tsx` → Entry point principal de React
- `/main.tsx` → Entry point principal de Vite
- `/index.html` → Configurado correctamente para apuntar a `/main.tsx`

### 🚀 PROCESO DE DEPLOY CORRECTO
1. **Configurar variables en Vercel**: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
2. **Verificar estructura de archivos**: No debe haber duplicados de entry points
3. **Verificar dependencias**: Revisar que todas las dependencias existan en npm y no haya duplicados
4. **Verificar imports**: Comprobar que todos los imports sean correctos (framer-motion, no motion/react)
5. **Verificar TypeScript**: `tsc --noEmit` para eliminar variables no utilizadas
6. **NO crear archivo .env local**: Solo usar variables de Vercel por seguridad
7. **Build local**: `npm run build` (sin variables, funciona con IndexedDB)
8. **Deploy Vercel**: Variables de entorno se aplican automáticamente

### 📚 LECCIONES APRENDIDAS
- **Tailwind V3** es la versión de producción estable
- **Variables HSL** deben convertirse correctamente desde hex
- **PostCSS** debe configurarse explícitamente en Vite
- **Archivos duplicados** en diferentes carpetas causan conflictos de build
- **Entry points únicos**: Solo debe haber un App.tsx y un main.tsx principales
- **Dependencias Radix UI**: No todas las combinaciones existen, verificar en npm
- **Sheet component**: Usa `@radix-ui/react-dialog`, no `@radix-ui/react-sheet`
- **Motion/Animaciones**: Usar solo `framer-motion`, eliminar paquetes duplicados como `motion`
- **Imports no utilizados**: TypeScript strict mode requiere eliminar variables y imports no utilizados
- **Vercel** necesita configuración específica en vercel.json
- **Sintaxis correcta de Vercel**: Usar `@vercel/node@3.0.7` no `nodejs18.x` para funciones serverless
- **Endpoints API necesarios**: El sistema híbrido SÍ requiere endpoints para verificación completa

## Guidelines Técnicas

### Color System
- Usar variables HSL correctas en formato: `hue saturation% lightness%`
- Nunca usar valores RGB en variables HSL
- Verificar conversión hex→HSL con herramientas online

### Mobile First
- Base: 16px font-size (15px móvil, 14px móviles muy pequeños)
- Responsive breakpoints: 640px, 768px, 1024px
- Padding: `mobile-padding` utility class

### Componentes UI y Styling Override
- Usar shadcn/ui components from `/components/ui`
- **IMPORTANTE**: Algunos componentes base tienen estilos por defecto (gap, typography)
- **Siempre sobrescribir explícitamente** los estilos según estas guidelines
- Ejemplo de override correcto:
  ```tsx
  <Button className="text-base font-medium p-4 gap-2">  // Override explícito
    Texto del botón
  </Button>
  ```
- Personalizar con classes de Tailwind cuando sea necesario
- Mantener consistencia visual en toda la aplicación
- **IMPORTANTE**: Verificar que las dependencias Radix UI existan antes de usar

### Typography Override Guidelines
- **NO usar clases de Tailwind** para font-size, font-weight, o line-height en componentes principales
- El sistema de tipografía está definido en `globals.css` para HTML elements (h1, h2, h3, h4, p)
- **Solo override** cuando el usuario específicamente pida cambios tipográficos
- Usar `mobile-text-balance` para mejor legibilidad en móviles

### Animaciones Personalizadas
- `animate-float`: Flotación suave para elementos
- `animate-pulse-glow`: Brillo pulsante para CTAs
- `animate-neural-pulse`: Efecto neural para backgrounds
- **Solo usar framer-motion**: `import { motion } from 'framer-motion'`

### Content Management
- Todo el contenido editable a través de EditableContentContext
- Sistema de administración en `/admin` route
- Persistencia en IndexedDB con auto-save

### SEO Optimización
- **Meta tags completos**: Title, description, keywords, robots
- **Open Graph**: Facebook, LinkedIn con imágenes optimizadas
- **Twitter Cards**: Summary large image format
- **Structured Data**: Organization, ProfessionalService, WebSite schemas
- **Performance**: Preconnect, DNS prefetch, PWA manifest
- **Sitemap y robots.txt**: Para indexación correcta
- **Canonical URLs**: Evitar contenido duplicado
- **Language tags**: es-ES correcto para audiencia argentina

### Dependencias Críticas
#### ✅ Dependencias que SÍ existen:
- `@radix-ui/react-dialog`
- `@radix-ui/react-tabs`
- `@radix-ui/react-select`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-checkbox`
- `framer-motion` (para animaciones)

#### ❌ Dependencias que NO existen o son problemáticas:
- `@radix-ui/react-sheet` (usar `@radix-ui/react-dialog`)
- `motion` (usar `framer-motion`)

### Deploy Checklist Final
- [ ] **Configurar variables de entorno en Vercel**: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
- [ ] **NO crear archivo .env local**: Solo usar variables de Vercel por seguridad
- [ ] **Verificar estructura de archivos**: Solo un App.tsx y main.tsx en la raíz
- [ ] **Verificar que no hay dependencias inexistentes** en package.json
- [ ] **Verificar que no hay dependencias duplicadas** (motion vs framer-motion)
- [ ] **Confirmar archivos duplicados marcados** como eliminados en `/src/`
- [ ] **Verificar imports correctos** (framer-motion, no motion/react)
- [ ] **Eliminar variables e imports no utilizados**
- [ ] **Verificar override de estilos** en componentes base según guidelines
- [ ] **Configurar vercel.json con functions**: Usar runtime `@vercel/node@3.0.7` para API
- [ ] **Añadir @vercel/node a devDependencies**: Necesario para tipos TypeScript
- [ ] **Verificar endpoint /api funcional**: Necesario para verificación de variables de entorno
- [ ] **Build local exitoso**: `npm run build` (funciona con IndexedDB sin variables)
- [ ] **Commit y push a GitHub**
- [ ] **Deploy automático en Vercel** (variables se aplican automáticamente)

## Estructura de Proyecto Recomendada

```
/ (raíz)
├── App.tsx                    # Entry point principal React
├── main.tsx                   # Entry point principal Vite  
├── index.html                 # Configurado para /main.tsx
├── components/                # Componentes React
├── contexts/                  # React Contexts
├── pages/                     # Páginas principales
├── styles/globals.css         # Estilos globales Tailwind V3
├── guidelines/Guidelines.md   # Este archivo
└── src/ (NO USAR)            # Archivos duplicados marcados como eliminados
```

**IMPORTANTE**: Mantener esta estructura para evitar conflictos de build en Vercel/Vite.