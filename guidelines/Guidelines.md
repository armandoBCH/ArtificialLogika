# Guidelines de Artificial Lógika

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

### 🔧 CONFIGURACIONES CRÍTICAS

#### **package.json**
```json
"tailwindcss": "^3.4.0"  // NO usar V4 alpha
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

### 📁 ARCHIVOS PROBLEMÁTICOS
- `/src/App.tsx` y `/src/main.tsx` → Duplicados que causan conflictos
- Marcar como eliminados para evitar problemas de build

### 🚀 PROCESO DE DEPLOY CORRECTO
1. **Verificar TypeScript**: `tsc --noEmit`
2. **Build local**: `npm run build` 
3. **Preview**: `npm run preview`
4. **Deploy Vercel**: Solo después de verificar localmente

### 📚 LECCIONES APRENDIDAS
- **Tailwind V3** es la versión de producción estable
- **Variables HSL** deben convertirse correctamente desde hex
- **PostCSS** debe configurarse explícitamente en Vite
- **Archivos duplicados** en diferentes carpetas causan conflictos
- **Vercel** necesita configuración específica en vercel.json

## Guidelines Técnicas

### Color System
- Usar variables HSL correctas en formato: `hue saturation% lightness%`
- Nunca usar valores RGB en variables HSL
- Verificar conversión hex→HSL con herramientas online

### Mobile First
- Base: 14px font-size
- Responsive breakpoints: 640px, 768px, 1024px
- Padding: `mobile-padding` utility class

### Animaciones Personalizadas
- `animate-float`: Flotación suave para elementos
- `animate-pulse-glow`: Brillo pulsante para CTAs
- `animate-neural-pulse`: Efecto neural para backgrounds

### Componentes UI
- Usar shadcn/ui components from `/components/ui`
- Personalizar con classes de Tailwind cuando sea necesario
- Mantener consistencia visual en toda la aplicación

### Content Management
- Todo el contenido editable a través de EditableContentContext
- Sistema de administración en `/admin` route
- Persistencia en localStorage hasta implementar Supabase

### SEO Optimización
- **Meta tags completos**: Title, description, keywords, robots
- **Open Graph**: Facebook, LinkedIn con imágenes optimizadas
- **Twitter Cards**: Summary large image format
- **Structured Data**: Organization, ProfessionalService, WebSite schemas
- **Performance**: Preconnect, DNS prefetch, PWA manifest
- **Sitemap y robots.txt**: Para indexación correcta
- **Canonical URLs**: Evitar contenido duplicado
- **Language tags**: es-ES correcto para audiencia argentina