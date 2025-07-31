# 🎨 Logo Artificial Lógika - Bordes Gruesos

## Filosofía de Diseño
**"Logic as Aesthetics"** - El logo presenta bordes exteriores más gruesos que aportan mayor impacto visual y presencia, manteniendo la estructura lógica y minimalista de la identidad de marca.

### Concepto Visual
- **Marco robusto**: Bordes de 3-6px según el tamaño para mayor presencia
- **Núcleo sólido**: Cuadrado interno que representa la lógica pura
- **Equilibrio**: Proporción perfecta entre estructura y contenido
- **Elegancia**: Sofisticación a través de la simplicidad geométrica

## 📁 Archivos Disponibles

### Formatos Vectoriales (SVG)
- `logo.svg` - Logo estándar 44x44px con bordes gruesos
- `logo-large.svg` - Versión premium 120x120px con efectos
- `logo-white.svg` - Versión para fondos oscuros
- `logo-minimal.svg` - Solo contorno grueso sin relleno
- `favicon.svg` - Favicon optimizado 32x32px

### Especificaciones Técnicas
**Colores:**
- Primario: `#40d9ac` (Verde menta)
- Fondo sugerido: `rgba(64, 217, 172, 0.08)`
- Borde: 4px (estándar), hasta 12px (versión large)

**Efectos:**
- Sombra difusa (filter: drop-shadow)
- Brillo interno sutil
- Animaciones de hover y pulse
- Gradientes radiales en versión premium

## 🛠️ Implementación

### En React (Componente)
```jsx
import Logo from './components/Logo';

// Diferentes configuraciones
<Logo size="md" variant="default" animated={true} />
<Logo size="lg" variant="minimal" animated={false} />
<Logo size="xl" variant="white" />
<Logo size="sm" variant="solid" />
```

### Como archivo estático
```html
<!-- Estándar -->
<img src="/logo.svg" alt="Artificial Lógika" width="44" height="44" />

<!-- Grande con efectos -->
<img src="/logo-large.svg" alt="Artificial Lógika" width="120" height="120" />
```

### En CSS
```css
.logo-artificial-logika {
  background-image: url('/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 44px;
  height: 44px;
}
```

## 📐 Sistema de Tamaños

| Tamaño | Dimensiones | Borde | Uso Recomendado |
|---------|-------------|-------|-----------------|
| XS | 20x20px | 2px | Iconos pequeños |
| SM | 28x28px | 2px | Botones, badges |
| MD | 44x44px | 4px | Headers, navegación |
| LG | 64x64px | 5px | Logos principales |
| XL | 80x80px | 6px | Presentaciones |

## 🎯 Variantes de Estilo

### Default
- Fondo: Transparente con tinte verde muy sutil
- Borde: Verde primario semi-transparente
- Núcleo: Verde sólido
- **Uso**: Fondos claros, headers web

### Minimal
- Fondo: Completamente transparente
- Borde: Verde primario sólido
- Núcleo: Verde sólido
- **Uso**: Cuando se necesita máximo contraste

### White
- Fondo: Blanco semi-transparente
- Borde: Blanco semi-opaco
- Núcleo: Blanco sólido
- **Uso**: Fondos oscuros, modo nocturno

### Solid
- Fondo: Verde primario sólido
- Borde: Verde primario
- Núcleo: Fondo oscuro (inversión)
- **Uso**: Elementos destacados, call-to-action

### Dark
- Fondo: Gris oscuro
- Borde: Gris medio
- Núcleo: Gris claro
- **Uso**: Fondos blancos, documentos impresos

## ✅ Mejores Prácticas

### Espaciado
- **Mínimo**: 8px de espacio libre alrededor
- **Recomendado**: 12-16px para mayor respiro visual
- **Nunca**: Recortar o superponer elementos importantes

### Proporciones
- **Mantener**: Siempre relación 1:1 (cuadrado)
- **Tamaño mínimo**: 16x16px (legibilidad)
- **Escalado**: Usar siempre valores enteros para bordes nítidos

### Contexto de Uso
**✅ Apropiado para:**
- Headers y navegación principal
- Avatares y perfiles corporativos
- Papelería y material impreso
- Favicon y app icons
- Presentaciones corporativas
- Redes sociales (LinkedIn, Twitter)

**❌ Evitar en:**
- Tamaños menores a 16px
- Fondos que no contrasten
- Deformación de proporciones
- Uso junto a otros logos sin separación
- Aplicaciones con mucho detalle visual

## 🔄 Acceso y Descarga

### Desde el Admin Panel
1. Visita `/admin` en tu sitio web
2. Click en la pestaña **"Logo"**
3. Previsualiza todas las variantes
4. Descarga el formato deseado (SVG/PNG)
5. Copia el código React si es necesario

### Generación Automática
El sistema genera dinámicamente:
- **SVG**: Cualquier tamaño con bordes proporcionales
- **PNG**: 64px, 128px, 256px con transparencia
- **Código**: Snippet de React listo para usar

## 📱 Casos de Uso Específicos

### Web/Digital
- **Favicon**: 32x32px, bordes 3px
- **Header móvil**: 36x36px, bordes 3px  
- **Header desktop**: 44x44px, bordes 4px
- **Redes sociales**: 128x128px, bordes 8px

### Impreso
- **Tarjetas de visita**: Usar SVG, mínimo 1cm
- **Papelería**: SVG escalado, considerar grosor de línea
- **Merchandising**: PNG alta resolución (256px+)

### Aplicaciones
- **App icon**: PNG 256x256px
- **Splash screen**: SVG responsive
- **Push notifications**: PNG 64x64px

---

**Creado para Artificial Lógika**  
*Versión con bordes gruesos - "Logic as Aesthetics"*  
Actualizado: Enero 2025