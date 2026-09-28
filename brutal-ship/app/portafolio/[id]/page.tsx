import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getSiteConfig } from "@/lib/data/config";
import { SITE_URL, BUSINESS, buildBreadcrumbs, vistaPrevia, jsonLd } from "@/lib/seo/constants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyMobileCTA from "@/app/components/StickyMobileCTA";
import WhatsAppChatWidget from "@/app/components/WhatsAppChatWidget";
import ProjectCard, { categoriasDe } from "@/app/components/ProjectCard";
import { esMuestra, isRealStat } from "@/lib/data/portfolio";
import GaleriaProyecto from "./GaleriaProyecto";

// Lo que reduce el riesgo de pedir: las mismas condiciones que la home.
const GARANTIAS = [
    ["draw", "Diseño previo sin cargo", "Ves cómo va a quedar tu web antes de pagar."],
    ["schedule", "De 1 a 4 semanas", "Según el plan, hasta dejarla online."],
    ["undo", "Seña reintegrable", "Hasta que apruebes el primer diseño."],
] as const;

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
    const projects = await getPortfolioProjects();
    return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const resolvedParams = await params;
    const projects = await getPortfolioProjects();
    const project = projects.find((p) => p.id === resolvedParams.id);

    if (!project) {
        return {
            title: "Proyecto no encontrado",
            robots: { index: false, follow: true },
        };
    }

    const projectUrl = `${SITE_URL}/portafolio/${project.id}`;

    // La imagen ya no es la captura cruda: era un WebP 4:3 declarado como
    // 1200x630, y LinkedIn no lo toma. La arma ./opengraph-image.tsx.
    return {
        title: `${project.title} - Portafolio`,
        description: project.description,
        ...vistaPrevia({
            titulo: `${project.title} | ${BUSINESS.name}`,
            descripcion: project.description,
            ruta: `/portafolio/${project.id}`,
            articulo: {
                publicado: project.created_at || undefined,
                modificado: project.updated_at || undefined,
                seccion: "Portafolio",
            },
        }),
        alternates: {
            canonical: projectUrl,
        },
    };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const resolvedParams = await params;
    const [projects, config] = await Promise.all([
        getPortfolioProjects(),
        getSiteConfig(),
    ]);

    const project = projects.find((p) => p.id === resolvedParams.id);

    if (!project) {
        notFound();
    }

    const servicios = project.applied_services ?? [];
    const incluye = project.applied_features ?? [];
    const stats = (project.stats ?? []).filter(isRealStat);
    const muestra = esMuestra(project);
    const categorias = categoriasDe(project);
    const descripcionLarga = project.description_long && project.description_long !== project.description
        ? project.description_long
        : null;

    // Primero la 4:3 de detalle; la panorámica solo si es otra imagen.
    const imagenes = [
        project.image_url ? { src: project.image_url, formato: "4:3" as const } : null,
        project.image_url_wide && project.image_url_wide !== project.image_url
            ? { src: project.image_url_wide, formato: "16:9" as const }
            : null,
    ].filter((x): x is { src: string; formato: "4:3" | "16:9" } => x !== null);

    // Otros proyectos: el mismo criterio de la home, trabajo real primero.
    const otros = projects
        .filter((p) => p.id !== project.id && p.is_active)
        .sort((a, b) => Number(esMuestra(a)) - Number(esMuestra(b)))
        .slice(0, 3);

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(`Hola! Vi el proyecto "${project.title}" en su web y quiero algo así para mi negocio.`)}`;

    // Breadcrumb + CreativeWork JSON-LD
    const breadcrumbSchema = buildBreadcrumbs([
        { name: "Inicio", url: SITE_URL },
        { name: "Portafolio", url: `${SITE_URL}/portafolio` },
        { name: project.title },
    ]);

    const creativeWorkSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        image: project.image_url,
        url: `${SITE_URL}/portafolio/${project.id}`,
        creator: {
            "@type": "Organization",
            name: BUSINESS.legalName,
        },
        ...(project.created_at && { datePublished: project.created_at }),
        ...(project.updated_at && { dateModified: project.updated_at }),
        keywords: project.tags?.join(", ") || project.category,
    };

    /*
     * La página de un caso, armada como la de un producto en MercadoLibre:
     *   · a la izquierda la galería, que es la prueba;
     *   · a la derecha un panel fijo con lo que se decide: qué es, qué logró, cuánto cuesta
     *     pedir algo así (nada: diseño previo sin cargo) y cómo pedirlo;
     *   · abajo, el detalle para quien quiere comparar, y "otros proyectos" para seguir mirando.
     * En celular el orden es galería → panel → detalle, y la barra fija de abajo mantiene el
     * CTA a mano. Antes era un hero amarillo con el texto largo entero arriba del botón, y un
     * bloque negro de cierre que repetía el CTA.
     */
    return (
        <main className="min-h-screen bg-white text-ink-black pt-[72px] sm:pt-20 md:pt-28">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(creativeWorkSchema)}
            />
            <Navbar config={config} />

            <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <nav aria-label="Ruta" className="flex flex-wrap items-center text-sm font-bold text-ink-black/60">
                    <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">Inicio</Link>
                    <span aria-hidden="true" className="mx-2">/</span>
                    <Link href="/portafolio" className="inline-flex min-h-11 items-center hover:text-primary">Portafolio</Link>
                    <span aria-hidden="true" className="mx-2">/</span>
                    <span aria-current="page" className="truncate text-ink-black">{project.title}</span>
                </nav>

                <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <GaleriaProyecto imagenes={imagenes} alt={project.image_alt || project.title} titulo={project.title} />
                    </div>

                    {/* El panel de decisión */}
                    <aside className="lg:col-span-5 lg:row-span-2">
                        <div className="rounded-xl border-2 border-black bg-white p-5 shadow-neobrutalism md:p-6 lg:sticky lg:top-32">
                            <div className="flex flex-wrap items-center gap-2">
                                {categorias.map((c) => (
                                    <span key={c} className="rounded-full bg-ink-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white">
                                        {c}
                                    </span>
                                ))}
                                {muestra && (
                                    <span className="sello bg-accent-yellow text-ink-black text-[11px] shadow-neobrutalism-sm">Proyecto de muestra</span>
                                )}
                            </div>
                            <h1 className="mt-3 text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl">
                                {project.title}
                            </h1>
                            <p className="mt-3 text-base font-medium leading-relaxed text-ink-black/80 md:text-lg">
                                {project.description}
                            </p>

                            {/* Flex y no grilla fija: con una sola métrica ocupa todo el ancho; con tres,
                                la tercera toma la fila entera en vez de dejar medio hueco. */}
                            {stats.length > 0 && (
                                <dl className="mt-5 flex flex-wrap gap-3">
                                    {stats.map((s, i) => (
                                        <div key={i} className="flex min-w-[calc(50%-6px)] flex-1 flex-col-reverse items-center rounded-lg border-2 border-black bg-accent-yellow px-3 py-3 text-center">
                                            <dt className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-black/80">{s.label}</dt>
                                            <dd className="text-3xl font-black leading-none tabular-nums">{s.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}

                            <div className="mt-6 flex flex-col gap-3">
                                <Link
                                    href="/#contacto"
                                    className="cta inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-black bg-primary px-5 font-bold uppercase tracking-wide text-white shadow-neobrutalism-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                >
                                    Quiero una web así
                                    <span aria-hidden="true" className="material-icons text-lg">arrow_forward</span>
                                </Link>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-black bg-white px-5 font-bold uppercase tracking-wide text-ink-black transition-colors hover:bg-[#25D366]"
                                >
                                    <span aria-hidden="true" className="material-icons text-lg">chat</span>
                                    Consultar por WhatsApp
                                </a>
                                {project.external_url && (
                                    <a
                                        href={project.external_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-bold text-ink-black underline decoration-2 underline-offset-4 hover:text-primary"
                                    >
                                        Visitar el sitio publicado
                                        <span aria-hidden="true" className="material-icons text-base">open_in_new</span>
                                    </a>
                                )}
                            </div>

                            {/* Lo que en MercadoLibre es el envío y la devolución: lo que reduce el
                                riesgo de pedir. Son las mismas condiciones de la home. */}
                            <ul className="mt-6 space-y-3 border-t-2 border-dashed border-black/15 pt-5 text-sm">
                                {GARANTIAS.map(([icono, titulo, texto]) => (
                                    <li key={titulo} className="flex items-start gap-3">
                                        <span aria-hidden="true" className="material-icons shrink-0 text-xl text-primary">{icono}</span>
                                        <span>
                                            <span className="block font-bold text-ink-black">{titulo}</span>
                                            <span className="block text-ink-black/70">{texto}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* El detalle, para quien quiere comparar */}
                    {(descripcionLarga || incluye.length > 0 || servicios.length > 0) && (
                        <div className="space-y-8 lg:col-span-7">
                            {descripcionLarga && (
                                <section aria-labelledby="sobre">
                                    <h2 id="sobre" className="text-2xl font-bold uppercase tracking-tight md:text-3xl">Sobre el proyecto</h2>
                                    <p className="medida-comoda mt-3 text-base font-medium leading-relaxed text-ink-black/80 md:text-lg">{descripcionLarga}</p>
                                </section>
                            )}

                            {incluye.length > 0 && (
                                <section aria-labelledby="incluye">
                                    <h2 id="incluye" className="flex items-baseline gap-3 text-2xl font-bold uppercase tracking-tight md:text-3xl">
                                        Qué incluye
                                        <span className="text-sm font-black tabular-nums text-ink-black/50">{incluye.length}</span>
                                    </h2>
                                    <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 rounded-xl border-2 border-black bg-background-light p-5 sm:grid-cols-2">
                                        {incluye.map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-sm font-bold leading-snug md:text-base">
                                                <span aria-hidden="true" className="material-icons mt-px shrink-0 text-base text-primary">check_circle</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {servicios.length > 0 && (
                                <section aria-labelledby="servicios-aplicados">
                                    <h2 id="servicios-aplicados" className="text-2xl font-bold uppercase tracking-tight md:text-3xl">Servicios aplicados</h2>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {servicios.map((s) => (
                                            <li key={s} className="rounded-lg border-2 border-black bg-white px-3 py-1.5 text-sm font-bold shadow-neobrutalism-sm">{s}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    )}
                </div>

                {otros.length > 0 && (
                    <section aria-labelledby="otros" className="mt-16 border-t-4 border-black pt-10 md:mt-20">
                        <div className="flex items-end justify-between gap-4">
                            <h2 id="otros" className="text-3xl font-bold uppercase tracking-tight md:text-4xl">Otros proyectos</h2>
                            <Link href="/portafolio" className="inline-flex min-h-11 shrink-0 items-center font-bold text-ink-black underline decoration-2 underline-offset-4 hover:text-primary">
                                Ver todos
                            </Link>
                        </div>
                        <ul className="mt-6 grid grid-cols-1 gap-4 md:gap-6">
                            {otros.map((p) => (
                                <li key={p.id}>
                                    <ProjectCard project={p} variante="catalogo" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <Footer config={config} />
            <StickyMobileCTA config={config} />
            <WhatsAppChatWidget config={config} />
        </main>
    );
}
