import { notFound } from "next/navigation";
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getSiteConfig } from "@/lib/data/config";
import { SITE_URL, BUSINESS } from "@/lib/seo/constants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyMobileCTA from "@/app/components/StickyMobileCTA";
import WhatsAppChatWidget from "@/app/components/WhatsAppChatWidget";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 3600;

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

    return (
        <main className="min-h-screen bg-white dark:bg-background-dark text-ink-black dark:text-white font-sans selection:bg-primary selection:text-white pt-20" suppressHydrationWarning>
            <Navbar config={config} />

            {/* Hero Section */}
            <section className="border-b-4 border-black dark:border-white bg-[#F2FA5A] relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Image Block (Order 1 in mobile, Order 2 in Desktop) */}
                    <div className="w-full md:w-1/2 mt-4 md:mt-0 order-1 md:order-2">
                        <div className="bg-white p-2 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transform hover:rotate-1 transition-transform duration-300">
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
                            <span className="px-3 py-1 bg-black text-white font-black uppercase tracking-widest text-[10px] md:text-xs border-2 border-transparent">
                                {project.category}
                            </span>
                            {project.is_sample && (
                                <span className="px-3 py-1 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] md:text-xs border-2 border-black shadow-[2px_2px_0px_#000] rotate-2">
                                    Proyecto de Muestra
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black uppercase leading-[1.1] tracking-tighter mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                            {project.title}
                        </h1>
                        <p className="text-base md:text-lg text-black/80 font-medium mb-6">
                            {project.description}
                        </p>

                        {/* CTA Buttons in Hero */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
                            {project.external_url && (
                                <a
                                    href={project.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-black text-white px-6 py-3 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-white hover:text-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                >
                                    <span className="material-icons text-base">language</span>
                                    Visitar Sitio Web
                                    <span className="material-icons text-sm">open_in_new</span>
                                </a>
                            )}
                            <a
                                href="/#contacto"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-black px-6 py-3 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                <span className="material-icons text-base">chat</span>
                                Quiero Algo Así
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services & Features Section */}
            {(hasServices || hasFeatures) && (
                <section className="bg-white dark:bg-gray-900 bg-dot-pattern relative border-b-4 border-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8 items-start">

                        {/* Left: Applied Services (main service cards) */}
                        {hasServices && (
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                    <span className="material-icons text-[#9b51e0] text-2xl md:text-3xl">verified</span>
                                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-white uppercase tracking-tight m-0 leading-none">
                                        Servicios Aplicados
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-3 md:gap-4">
                                    {project.applied_services.map((svc, idx) => (
                                        <div key={idx} className="bg-[#9b51e0] border-4 border-black p-3 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 md:gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shrink-0">
                                                <span className="material-icons text-[#9b51e0] text-xl md:text-2xl">
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
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                        <span className="material-icons text-black dark:text-white text-xl md:text-2xl">auto_awesome</span>
                                        <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase tracking-tight m-0 leading-none">
                                            Qué Incluye
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.applied_features.map((feat, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 md:gap-2 bg-black text-white px-3 py-1.5 md:px-4 md:py-2 font-bold text-xs md:text-sm border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all">
                                                <span className="material-icons text-[#F2FA5A] text-xs md:text-sm">check_circle</span>
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.stats && project.stats.length > 0 && (
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase tracking-tight mb-3 md:mb-4">Resultados del Proyecto</h3>
                                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                                        {project.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-black text-white p-3 md:p-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all group flex flex-col justify-center items-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                                <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-1 group-hover:scale-105 transition-transform">
                                                    {stat.value}
                                                </p>
                                                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-widest">
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
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                        ¿Dudás si tu negocio necesita <span className="text-[#F2FA5A]">una web</span>?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 font-medium mb-8 max-w-2xl mx-auto">
                        Tus clientes ya te están buscando en internet. Sacate todas las dudas hoy mismo hablando con nosotros y llevate un demo visual.
                    </p>
                    <a
                        href="/#contacto"
                        className="inline-block bg-[#F2FA5A] text-black px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-300"
                    >
                        Solicitá tu Presupuesto
                    </a>
                </div>
            </section>

            <Footer config={config} />
            <StickyMobileCTA config={config} />
            <WhatsAppChatWidget config={config} />
        </main>
    );
}
