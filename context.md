# Contexto del Proyecto: Landing Page "Artificial Lógika"

Este documento proporciona un contexto esencial sobre la estructura actual del proyecto, las decisiones técnicas clave y las pautas para futuras iteraciones.

## 1. Resumen del Proyecto

Este es el código fuente de la landing page para "Artificial Lógika", una consultora boutique de desarrollo de software y soluciones de IA. El objetivo de la página es presentar sus servicios, mostrar proyectos anteriores y capturar leads a través de llamadas a la acción (CTA).

## 2. Arquitectura Actual: Vite + React + TypeScript

La decisión más importante que ha dado forma a la estructura actual del proyecto fue la **adopción de Vite como herramienta de construcción (`build tool`)**. Esto se hizo para facilitar un desarrollo moderno y, crucialmente, para permitir el despliegue en plataformas estándar como Vercel.

### ¿Por qué se utiliza Vite?

*   **Entorno de Desarrollo Moderno**: Proporciona un servidor de desarrollo ultrarrápido con Hot Module Replacement (HMR).
*   **Optimización para Producción**: Vite empaqueta y optimiza el código (bundling, minification, tree-shaking) para que la aplicación sea lo más eficiente posible en producción.
*   **Ecosistema Robusto**: Es el estándar de facto para aplicaciones React modernas y es compatible con todo el ecosistema de Node.js y npm.
*   **Compatibilidad con Despliegue**: Plataformas como Vercel tienen soporte nativo para proyectos Vite, lo que hace que el despliegue sea un proceso fluido y automatizado.

## 3. Cambios Técnicos Fundamentales

### a. `package.json`: El Corazón de las Dependencias

*   Todas las dependencias del proyecto (React, Tailwind, Radix UI, etc.) se gestionan a través de este archivo. Para instalar, ejecuta `npm install` o `yarn`.
*   Contiene los scripts para interactuar con el proyecto:
    *   `npm run dev`: Inicia el servidor de desarrollo.
    *   `npm run build`: Genera la versión de producción optimizada en el directorio `/dist`.
    *   `npm run preview`: Previsualiza la build de producción localmente.

### b. Configuración de Vite y TypeScript (`vite.config.ts`, `tsconfig.json`)

*   **`vite.config.ts`**: Configura el comportamiento de Vite. La configuración más importante es el **alias de ruta**: `{'@': path.resolve(__dirname, './src')}`.
*   **`tsconfig.json`**: Configura TypeScript. También se ha definido el alias `'@/*': ['src/*']` para que TypeScript entienda las rutas de importación limpias.

### c. Rutas de Importación Limpias

*   Gracias a los alias, todas las importaciones de módulos locales utilizan una ruta limpia que parte de la raíz de `src`.
*   **Correcto**: `import { Button } from '@/components/ui/button';`
*   **Incorrecto**: `import { Button } from '../../components/ui/button.tsx';`

### d. Estructura de Archivos

*   **`index.html`**: Es el punto de entrada para Vite. Es un archivo mínimo que simplemente carga el script principal.
*   **`/src/main.tsx`**: Es el punto de entrada de la aplicación React. Renderiza el componente `App` e importa el archivo CSS principal.
*   **`/src/index.css`**: Contiene los estilos base de Tailwind y las variables de color personalizadas.
*   **`tailwind.config.ts` y `postcss.config.js`**: Centralizan toda la configuración de Tailwind CSS.

### e. Manejo de Activos (Imágenes)

*   Aunque actualmente se usan URLs de Unsplash, la configuración de Vite permite importar imágenes y otros activos locales directamente en los componentes. Si se desea, se pueden mover las imágenes al directorio `/src/assets` e importarlas en los componentes.

## 4. Guía para Futuras Iteraciones

Para mantener la consistencia y funcionalidad del proyecto, sigue estas pautas:

*   **Añadir Nuevas Dependencias**:
    1.  Usa `npm install <nombre-del-paquete>` o `yarn add <nombre-del-paquete>`.
    2.  No modifiques el `index.html` para añadir dependencias.

*   **Crear o Modificar Componentes**:
    1.  Asegúrate de que todas las importaciones utilicen el alias `@/` para referenciar archivos dentro de `/src`.
    2.  No incluyas extensiones de archivo (`.ts`, `.tsx`) en las importaciones.

*   **Estilos con Tailwind CSS**:
    1.  Usa clases de Tailwind directamente en el `className` de tus componentes.
    2.  Para modificar el tema de Tailwind, edita el archivo `tailwind.config.ts`.
    3.  Puedes usar plugins de Tailwind que requieran Node.js, como `tailwindcss-animate`, que ya está configurado.

*   **Despliegue en Vercel**:
    1.  Conecta tu repositorio de Git a Vercel.
    2.  Vercel detectará automáticamente que es un proyecto Vite. No se necesita ninguna configuración especial.
    3.  El `Build Command` será `vite build` (o `npm run build`) y el `Output Directory` será `dist`.

Siguiendo estas directrices, el proyecto mantendrá una estructura robusta, profesional y fácil de desplegar.
