// Este archivo es obsoleto - funcionalidad migrada a indexedDB.ts
// Mantenido solo para referencia durante la transición

export const DEPRECATED_NOTICE = `
Este archivo ha sido reemplazado por el sistema IndexedDB.
Las operaciones de localStorage ahora solo se usan para:
- Migración automática de datos existentes
- Backup de seguridad durante la transición

Nueva implementación en:
- /db/indexedDB.ts - Sistema principal
- /db/config.ts - Configuración
`;

console.warn('⚠️ DEPRECATED: db/localStorage.ts ha sido reemplazado por IndexedDB');