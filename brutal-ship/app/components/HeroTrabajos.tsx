import type { PortfolioProject } from "@/lib/types/database";
import { esMuestra, isRealStat, rutaProyecto } from "@/lib/data/portfolio";
import { categoriasDe } from "./ProjectCard";
import HeroRotador, { type CasoHero } from "./HeroRotador";

/**
 * El hero muestra trabajo real en vez de una web inventada: la pregunta "¿son reales?"
 * se contesta en la primera pantalla y no en la cuarta.
 *
 * Desde el 2026-11-12 los casos van pasando (HeroRotador), no se queda solo en el primero.
 * Acá se arma la lista en el servidor y al navegador viaja solo lo que se muestra.
 * Las métricas salen de la base y solo si son reales (isRealStat).
 */
const MAXIMO = 6;

export default function HeroTrabajos({ projects }: { projects: PortfolioProject[] }) {
    const casos: CasoHero[] = projects
        .filter((p) => !esMuestra(p) && (p.image_url || p.image_url_wide))
        .slice(0, MAXIMO)
        .map((p) => ({
            id: p.id,
            ruta: rutaProyecto(p),
            titulo: p.title,
            imagen: p.image_url || p.image_url_wide,
            rubro: categoriasDe(p)[0],
            stats: (p.stats ?? []).filter(isRealStat).slice(0, 2).map((s) => ({ value: s.value, label: s.label })),
        }));

    // ponytail: sin clientes reales con captura (pasa si Supabase falla y entran los datos de
    // respaldo, que son muestras) no se muestra nada y en escritorio la mitad derecha queda
    // vacía hasta la próxima regeneración (60 s). Si eso molesta, sumar un respaldo propio.
    if (casos.length === 0) return null;

    return <HeroRotador casos={casos} />;
}
