import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getPortfolioProjects, rutaProyecto } from "@/lib/data/portfolio";
import { BLOG_POSTS } from "./blog/page";

// Mismo ISR que el resto del sitio: antes era force-dynamic y cada visita de un
// crawler pegaba contra Supabase.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Filtra is_active en el query y nunca tira: si Supabase falla devuelve los
    // de muestra, que son los mismos que sirve /portafolio/[id] en ese caso.
    const projects = await getPortfolioProjects();

    // lastModified solo donde hay una fecha real. `new Date()` en cada request le
    // decia a Google que todo cambiaba siempre, y deja de creerle al campo.
    const masReciente = (fechas: string[]) =>
        fechas.length ? new Date(fechas.reduce((a, b) => (a > b ? a : b))) : undefined;
    const ultimoProyecto = masReciente(projects.map((p) => p.updated_at).filter(Boolean));
    const ultimoPost = masReciente(BLOG_POSTS.map((p) => p.date));

    return [
        { url: SITE_URL, lastModified: ultimoProyecto, changeFrequency: "weekly", priority: 1.0 },
        { url: `${SITE_URL}/portafolio`, lastModified: ultimoProyecto, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/blog`, lastModified: ultimoPost, changeFrequency: "weekly", priority: 0.7 },
        { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
        ...BLOG_POSTS.map((post) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...projects.map((project) => ({
            url: `${SITE_URL}${rutaProyecto(project)}`,
            lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ];
}
