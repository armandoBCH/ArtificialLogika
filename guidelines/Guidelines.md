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

### 🔧 CONFIGURACIONES CRÍTICAS

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
1. **Verificar estructura de archivos**: No debe haber duplicados de entry points
2. **Verificar dependencias**: Revisar que todas las dependencias existan en npm y no haya duplicados
3. **Verificar imports**: Comprobar que todos los imports sean correctos (framer-motion, no motion/react)
4. **Verificar TypeScript**: `tsc --noEmit` para eliminar variables no utilizadas
5. **Build local**: `npm run build` 
6. **Preview**: `npm run preview`
7. **Deploy Vercel**: Solo después de verificar localmente

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
- [ ] **Verificar estructura de archivos**: Solo un App.tsx y main.tsx en la raíz
- [ ] **Verificar que no hay dependencias inexistentes** en package.json
- [ ] **Verificar que no hay dependencias duplicadas** (motion vs framer-motion)
- [ ] **Confirmar archivos duplicados marcados** como eliminados en `/src/`
- [ ] **Verificar imports correctos** (framer-motion, no motion/react)
- [ ] **Eliminar variables e imports no utilizados**
- [ ] **Verificar override de estilos** en componentes base según guidelines
- [ ] **Build local exitoso**: `npm run build`
- [ ] **Preview funcional**: `npm run preview`
- [ ] **Commit y push a GitHub**
- [ ] **Deploy automático en Vercel**

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