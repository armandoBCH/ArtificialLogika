# Project Context: Artificial Lógika Landing Page

## 1. Core Objective

This project is a high-quality, modern landing page for a freelance software and AI consultancy named "Artificial Lógika". The primary goal is to showcase services, build trust, and generate leads through a "free consultation" call-to-action.

## 2. Technology Stack

- **Framework**: React 18+ with TypeScript.
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS v4, configured via `@tailwindcss/vite`.
- **UI Components**: The project uses a structure heavily inspired by `shadcn/ui`, with individual, self-contained components in `components/ui`.
- **State Management**:
    - **Editable Content**: A custom `EditableContentContext` (`contexts/EditableContentContext.tsx`) manages all text, data, and configurations for the site. This allows for dynamic content that can be modified from an admin panel and is persisted to `localStorage`. **This is a critical feature.**
    - **Routing**: A simple, custom client-side router is implemented using `RouterContext` (`contexts/RouterContext.tsx`) to switch between the main landing page and an admin panel.
- **Animations**: `framer-motion` is used for all UI animations and transitions.
- **Deployment**: The target platform is Vercel.

## 3. Design System & Styling Guidelines

- **Font**: The primary font is **Sora**, imported from Google Fonts in `index.css`.
- **Theming**: A native dark theme is implemented using CSS Custom Properties (variables) in `index.css`. There is no light theme toggle; the site is dark by default.
- **Layout**: The layout is **mobile-first** and fully responsive. Use flexbox and grid for layouts.
- **Styling Approach**: All styling is done through Tailwind CSS utility classes. The `tailwind.config.ts` file extends the default theme with custom colors, radii, etc., all linked to the CSS variables in `index.css`.

## 4. Key Architectural Patterns & Features

- **Component-Driven**: The UI is broken down into modular components for each section of the landing page (e.g., `Hero.tsx`, `Services.tsx`, `FAQ.tsx`).
- **Centralized Content Management**: **All text and data displayed on the site should come from the `useEditableContent()` hook.** Avoid hardcoding strings directly in components. The default content is defined in `EditableContentContext.tsx`.
- **Admin Panel**: A simple admin interface exists at the `/admin` route (`pages/AdminPage.tsx`). This page allows for editing the content provided by `EditableContentContext`.
- **Conversion Tracking**: A custom hook, `useConversionTracking`, is implemented to send analytics events. This should be used for key user interactions.

## 5. Project History & Key Decisions

This section documents the initial request and the key technical challenges encountered and solved during the setup for Vercel deployment.

### 5.1. Initial Request

The project began with the following request:
> "te voy a subir un proyecto (artificial logika), adaptalo para deployearlo en vercel. el proyecto usa un stack tecnológico moderno y eficiente: React + TypeScript como base, Tailwind CSS v4 para estilos, Shadcn/ui para componentes, Context API para estado, y un sistema de routing personalizado. Todo construido con Vite, usando la fuente Sora de Google Fonts, y un design system basado en CSS Custom Properties con tema oscuro nativo."

The initial state of the project relied on an `<script type="importmap">` in `index.html` to load all dependencies from a CDN, which is not a suitable approach for a production build process with Vite and Vercel.

### 5.2. Deployment Challenges & Solutions

Several build errors occurred during the initial Vercel deployment attempts. The following solutions were implemented:

1.  **Problem: `importmap` Conflict with Vite/NPM.**
    - **Error**: Vercel builds were failing because the `importmap` script in `index.html` conflicted with Vite's module bundling system, which relies on `package.json`.
    - **Solution**: The entire `<script type="importmap">...</script>` block was **permanently removed** from `index.html`. All dependencies were migrated to `package.json` to be managed by `npm` (or `pnpm`/`yarn`), which is the standard practice for Vite projects.

2.  **Problem: Module Not Found Errors (Versioned Imports).**
    - **Error**: The TypeScript compiler threw "Cannot find module 'package-name@x.y.z'" errors. This was because component files contained hardcoded versions in their import paths (e.g., `import { ... } from 'lucide-react@0.487.0'`), a remnant of the `importmap` approach.
    - **Solution**: All version specifiers were removed from the import statements in all `.tsx` files (e.g., changed to `import { ... } from 'lucide-react'`).

3.  **Problem: Tailwind CSS v4 Configuration.**
    - **Error**: The build failed with `[@tailwindcss/vite:generate:build] Cannot apply unknown utility class 'sm:px-6'`.
    - **Root Cause**: Unlike previous versions, **Tailwind CSS v4 does not include default screen breakpoints** (`sm`, `md`, `lg`, etc.) out of the box. They must be defined explicitly.
    - **Solution**: The standard screen breakpoints were added to the `theme.screens` object in `tailwind.config.ts`. This ensured that responsive utility classes like `sm:` and `lg:` were recognized by the Tailwind compiler.

## 6. Instructions for Future Iterations

- **Maintain Consistency**: Adhere strictly to the existing technology stack and architectural patterns.
- **Prioritize the Context**: When making changes to text or data, modify the `defaultContent` object within `EditableContentContext.tsx` rather than hardcoding values in components.
- **Use `cn` Utility**: For combining class names, always use the `cn` utility from `components/ui/utils.ts`.
- **Check UI Components**: Before creating a new UI element, check if a suitable component already exists in the `components/ui` directory.
- **Ensure Responsiveness**: All new components or layout changes must be fully responsive and tested on mobile, tablet, and desktop views.
- **No `importmap`**: Do not reintroduce the `importmap` script. All dependencies must be managed through `package.json`.