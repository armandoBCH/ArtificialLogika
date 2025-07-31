// Este archivo es obsoleto - funcionalidad migrada a indexedDB.ts
// Mantenido solo para referencia durante la transición

export const DEPRECATED_NOTICE = `
Este archivo ha sido reemplazado por el sistema IndexedDB.
Todas las operaciones ahora se manejan en:
- /db/indexedDB.ts - Operaciones principales
- /db/config.ts - Configuración central
- /contexts/EditableContentContext.tsx - Integración con React

La migración desde localStorage a IndexedDB es automática.
`;

console.warn('⚠️ DEPRECATED: db/operations.ts ha sido reemplazado por el sistema IndexedDB');