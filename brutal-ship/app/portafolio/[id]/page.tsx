import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getSiteConfig } from "@/lib/data/config";
import { SITE_URL, BUSINESS, buildBreadcrumbs } from "@/lib/seo/constants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyMobileCTA from "@/app/components/StickyMobileCTA";
import WhatsAppChatWidget from "@/app/components/WhatsAppChatWidget";

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
        };
    }

    const projectUrl = `${SITE_URL}/portafolio/${project.id}`;

    return {
        title: `${project.title} - Portafolio`,
        description: project.description,
        openGraph: {
            title: `${project.title} | ${BUSINESS.name}`,
            description: project.description,
            url: projectUrl,
            type: "article",
            images: project.image_url
                ? [
                    {
                        url: project.image_url,
                        width: 1200,
                        height: 630,
                        alt: project.image_alt || project.title,
                    },
                ]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${project.title} | ${BUSINESS.name}`,
            description: project.description,
            images: project.image_url ? [project.image_url] : undefined,
        },
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

    const hasServices = project.applied_services && project.applied_services.length > 0;
    const hasFeatures = project.applied_features && project.applied_features.length > 0;

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
        dateModified: project.updated_at,
        keywords: project.tags?.join(", ") || project.category,
    };

    return (
        <main className="min-h-screen bg-white text-ink-black pt-20" suppressHydrationWarning>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
            />
            <Navbar config={config} />

            {/* Hero Section */}
            <section className="border-b-4 border-black bg-accent-yellow relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Image Block (Order 1 in mobile, Order 2 in Desktop) */}
                    <div className="w-full md:w-1/2 mt-4 md:mt-0 order-1 md:order-2">
                        <div className="bg-white p-2 border-4 border-black shadow-neobrutalism-lg transform hover:rotate-1 transition-transform duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={project.image_url}
                                alt={project.image_alt || project.title}
                                className="w-full aspect-[4/3] object-cover border-2 border-black"
                            />
                        </div>
                    </div>
                    {/* Text Block (Order 2 in mobile, Order 1 in Desktop) */}
                    <div className="w-full md:w-1/2 flex flex-col items-start pr-0 md:pr-8 order-2 md:order-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(project.categories && project.categories.length > 0
                                ? project.categories
                                : project.category ? [project.category] : []
                            ).map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-black text-white font-black uppercase tracking-widest text-[10px] md:text-xs">
                                    {cat}
                                </span>
                            ))}
                            {/* Estaba en bg-red-500, un rojo que no existe en la paleta, con
                                rotacion propia. Es el mismo mensaje que la home marca con el
                                sello, asi que usa el sello. */}
                            {project.is_sample && (
                                <span className="sello bg-hot-coral text-white text-[10px] md:text-xs shadow-neobrutalism-sm">
                                    Proyecto de Muestra
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black uppercase leading-[1.1] tracking-tighter mb-4 drop-shadow-neobrutalism-sm">
                            {project.title}
                        </h1>
                        <p className="text-base md:text-lg text-black/80 font-medium mb-6">
                            {project.description_long || project.description}
                        </p>

                        {/* CTA Buttons in Hero */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
                            {project.external_url && (
                                <a
                                    href={project.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-black text-white px-6 py-3 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-4 border-black shadow-neobrutalism hover:bg-white hover:text-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                >
                                    <span aria-hidden="true" className="material-icons text-base">language</span>
                                    Visitar el sitio
                                    <span aria-hidden="true" className="material-icons text-sm">open_in_new</span>
                                </a>
                            )}
                            <Link
                                href="/#contacto"
                                className="cta inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-black px-6 py-3 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-4 border-black shadow-neobrutalism hover:bg-black hover:text-white transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                <span aria-hidden="true" className="material-icons text-base">chat</span>
                                Quiero mi web
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services & Features Section */}
            {(hasServices || hasFeatures) && (
                <section className="bg-white bg-dot-pattern relative border-b-4 border-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8 items-start">

                        {/* Left: Applied Services (main service cards) */}
                        {hasServices && (
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                    <span aria-hidden="true" className="material-icons text-primary text-2xl md:text-3xl">verified</span>
                                    <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight m-0 leading-none">
                                        Servicios Aplicados
                                    </h2>
                                </div>
                                <div className="flex flex-col gap-3 md:gap-4">
                                    {project.applied_services.map((svc, idx) => (
                                        <div key={idx} className="bg-primary border-4 border-black p-3 md:p-5 shadow-neobrutalism flex items-center gap-3 md:gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shrink-0">
                                                <span aria-hidden="true" className="material-icons text-primary text-xl md:text-2xl">
                                                    {svc.includes("One-Page") ? "web" : svc.includes("Landing") ? "track_changes" : "layers"}
                                                </span>
                                            </div>
                                            <span className="text-white font-black uppercase text-sm md:text-lg tracking-wide">
                                                {svc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Right: Applied Features (sub-services chips) + Stats */}
                        <div className={`w-full ${hasServices ? 'lg:w-1/2' : ''} flex flex-col gap-6`}>
                            {hasFeatures && (
                                <div>
                                    {/* Antes cada item era un chip negro con borde y hover invertido.
                                        Con 7 a 10 features de unos 27 caracteres, ninguno entraba de a
                                        dos por fila en un telefono: el flex-wrap degeneraba en una pila
                                        de barras negras de 424px, media pantalla de lista vertical.

                                        El chip estaba haciendo trabajo decorativo, no informativo:
                                        ninguna feature suelta merece su propia caja. Como lista de
                                        verificacion en dos columnas ocupa la mitad y se lee de un
                                        vistazo, que es lo que alguien quiere de un "que incluye".

                                        El bloque entero va sobre una superficie para leerse como una
                                        unidad, en lugar de como 10 objetos sueltos. */}
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                        <span aria-hidden="true" className="material-icons text-black text-xl md:text-2xl">auto_awesome</span>
                                        <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight m-0 leading-none">
                                            Qué Incluye
                                        </h2>
                                        <span className="ml-auto text-xs font-black tabular-nums text-ink-black/70">
                                            {project.applied_features.length}
                                        </span>
                                    </div>
                                    {/* Una columna en telefono, dos desde sm. A 375px las dos columnas dejan
                                        146px por celda y 8 de 10 etiquetas envolvian a dos lineas: mas
                                        corto en total, pero ilegible de un vistazo. En una columna cada
                                        item entra en un renglon. */}
                                    <ul className="grid grid-cols-1 gap-x-5 gap-y-2 rounded-xl border-2 border-black bg-white p-4 shadow-neobrutalism-sm sm:grid-cols-2 md:gap-y-2.5 md:p-5">
                                        {project.applied_features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span aria-hidden="true" className="material-icons shrink-0 text-primary text-base leading-tight mt-px">
                                                    check
                                                </span>
                                                <span className="text-xs md:text-sm font-bold leading-snug text-ink-black">
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.stats && project.stats.length > 0 && (
                                <div>
                                    <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-3 md:mb-4">Resultados del Proyecto</h2>
                                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                                        {project.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-black text-white p-3 md:p-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all group flex flex-col justify-center items-center text-center shadow-neobrutalism">
                                                <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-1 group-hover:scale-105 transition-transform">
                                                    {stat.value}
                                                </p>
                                                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white/70 group-hover:text-ink-black/70 uppercase tracking-widest">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>
            )}

            {/* Bottom Commercial CTA */}
            <section className="bg-black py-16 border-t-8 border-black relative overflow-hidden">
                {/* Habia un circulo de 600px con blur de 100px. En un sistema construido
                    sobre bordes duros y sombras sin difuminar, un degradado gaussiano es de
                    otro idioma. Lo reemplaza un aro de trazo, que si pertenece. */}
                <div aria-hidden="true" className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-4 border-white/10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                        ¿Dudás si tu negocio necesita <span className="text-accent-yellow">una web</span>?
                    </h2>
                    <p className="text-lg md:text-xl text-white/75 font-medium mb-8 max-w-2xl mx-auto">
                        Tus clientes ya te están buscando en internet. Sacate todas las dudas hoy mismo hablando con nosotros y llevate un demo visual.
                    </p>
                    <Link
                        href="/#contacto"
                        className="cta inline-block bg-accent-yellow text-black px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black shadow-neobrutalism-white hover:bg-white hover:shadow-neobrutalism-white hover:-translate-y-1 transition-all duration-300"
                    >
                        Quiero mi web
                    </Link>
                </div>
            </section>

            <Footer config={config} />
            <StickyMobileCTA config={config} />
            <WhatsAppChatWidget config={config} />
        </main>
    );
}
