# Estación 6 — Oportunidades de SEO programático

Evaluación de solo lectura (Supabase consultado con `SELECT`, sin cambios de esquema ni datos). Base: `auditoria.md` (estación 1) y `competencia.md` (estación 1b), más una consulta directa a Supabase (proyecto `advwhuowosnbrbihhenf`) para esta estación.

**Regla aplicada:** una página programática solo se justifica si tiene contenido real propio (2-3 proyectos reales o más, o datos únicos). Si no, es thin content y no se implementa.

---

## Datos reales relevados

### `portfolio_projects` — 7 filas totales, 7 activas

| proyecto | `category` | `is_sample` |
|---|---|---|
| RAGO AUTOMOTORES | Concesionaria | no (real) |
| Expresión Honesta | EDITORIAL | no (real) |
| Boda Carlos y Jenlys | Evento | no (real) |
| Tabaqueria Amaranta | TABAQUERIA | no (real) |
| Barbería Legacy | Barbería | sí (demo) |
| Vanguard Legal Group | Abogados | sí (demo) |
| Heladería Gelato | Heladería | sí (demo) |

**7 proyectos, 7 categorías distintas, cero solapamiento.** Ningún rubro tiene más de 1 proyecto (ni contando demos). No existe un campo de ciudad/ubicación en `portfolio_projects` ni en ninguna otra tabla consumida por el sitio público.

`applied_services` (columna `text[]`) se agrupa en la práctica en solo 2 valores usados por el sitio: "Landing Page" y "E-commerce / Plataforma" — y esos 2 servicios ya están explicados en profundidad, con los mismos proyectos como evidencia, en `/portafolio` (filtrable) y en la home (`PricingSection`, `WhoDoesWhatSection`). No hay un tercer eje de agrupación con volumen propio.

### `services` y `pricing_plans` — 3 filas cada una

Ya renderizadas íntegras en la home (`WhoDoesWhatSection`, `PricingSection`) y en `/llms.txt`. 3 ítems no da para páginas "en masa" — son 3 páginas como máximo, y ya están cubiertas por secciones existentes de la home.

### `quote_catalog` — 12 filas

Es el catálogo del presupuestador interno (`app/admin/presupuestos/**`), **no público**: no lo consume ninguna página indexable. Irrelevante para SEO programático sin importar cuántas categorías tenga.

### Blog — 14 posts, hardcodeados en `app/blog/page.tsx`, no en Supabase

Ya cubre patrones tipo "cuánto cuesta una página web" (general y de peluquería), "landing page qué es", SEO, proceso, etc. Es contenido editorial 1:1, no una plantilla programática, y no es parte de esta estación (queda para estación 5, guía/blog).

---

## Oportunidades evaluadas

### 1. Páginas por rubro de cliente (`/portafolio/rubro/[rubro]`)

- **Datos que la soportarían:** 7 proyectos en 7 categorías distintas. Para que una página de rubro no sea thin content hace falta el piso de 2-3 proyectos reales por rubro — hoy el máximo es 1.
- **Gap frente a la competencia:** ninguno de los 5 competidores relevados en `competencia.md` (VOX, tomasweb, Nexonube, SAC Fly, Disew) tiene páginas por rubro de cliente tampoco — no se está cediendo terreno a nadie por no tenerlas.
- **Riesgo:** thin content garantizado (1 proyecto por página) + canibalización directa con `/portafolio` (que ya filtra por categoría en el cliente) y con `/portafolio/[id]` de ese mismo proyecto — la página de rubro sería casi un duplicado del detalle de un único proyecto.
- **Recomendación: NO IMPLEMENTAR.** Revisar cuando existan ≥2-3 proyectos reales (`is_sample = false`) en un mismo rubro — hoy ninguno lo cumple.

### 2. Páginas por servicio (`/servicios/[servicio]`)

- **Datos que la soportarían:** solo 2 servicios reales con evidencia (Landing Page, E-commerce), ambos ya explicados con detalle propio (features, precios, proyectos de ejemplo) en la home y en `/portafolio`.
- **Gap frente a la competencia:** tomasweb, Nexonube y Disew publican precios por plan igual que Logika, pero en páginas de precios propias, no en páginas de servicio separadas por rubro de cliente. No hay una keyword de volumen tipo "landing page para [rubro]" con suficiente data propia para responderla con casos reales.
- **Riesgo:** 2 páginas no es "programático" (no hay generación en masa) y el contenido duplicaría casi palabra por palabra lo que ya dice la home — canibalización de la keyword principal ("diseño web argentina", "landing page") contra la propia home, que es la página que hoy mejor puede rankear para eso.
- **Recomendación: NO IMPLEMENTAR** como rutas nuevas. Si se quiere capturar la intención de precio por servicio, el vehículo correcto ya existe: reforzar contenido en la home/`/portafolio` o un post de blog (estación 5), no una plantilla programática.

### 3. Páginas por ciudad (`/[ciudad]` o `/portafolio/ciudad/[ciudad]`)

- **Datos que la soportarían:** ninguno. No hay campo de ciudad/ubicación en `portfolio_projects` ni en `site_config`, `testimonials` ni ninguna otra tabla. Logika no tiene presencia física diferenciada por ciudad (servicio remoto, Argentina).
- **Gap frente a la competencia:** VOX se posiciona en "agencia web buenos aires" pero es una keyword geográfica genérica, no per-ciudad en masa; ningún competidor relevado hace páginas por ciudad tampoco.
- **Riesgo:** inventar ciudades o asignar proyectos a ciudades sin dato real violaría la regla de no inventar datos. Sin campo de ciudad no hay forma de generar esto sin fabricar contenido.
- **Recomendación: NO IMPLEMENTAR.** Solo tendría sentido si en el futuro se carga una ciudad real por proyecto/cliente en Supabase y se junta masa crítica por ciudad (mismo piso de 2-3 reales).

---

## Conclusión

Con 7 proyectos de portafolio (4 reales) repartidos en 7 categorías sin solapamiento, 2 servicios reales y ningún campo de ciudad, **no hay ningún eje con masa de datos suficiente para SEO programático hoy**. Las tres oportunidades evaluadas quedan en **NO IMPLEMENTAR**, sin scaffolding de código (regla de la tarea: si no hay data suficiente, no se escribe código).

**Qué haría falta para reabrir esto (MÁS ADELANTE):**
- Rubro: que 2-3+ proyectos reales (`is_sample = false`) compartan `category`. Hoy: 0 de 7.
- Servicio: un tercer servicio real con proyectos propios que lo respalden, o que Landing/E-commerce acumulen suficientes proyectos reales cada uno como para justificar una página propia además de la home (hoy la home ya los cubre).
- Ciudad: agregar un campo de ciudad/localidad real a `portfolio_projects` (o a una tabla de clientes) y acumular 2-3+ proyectos reales por ciudad.

No se generó ningún archivo de código en esta estación.
