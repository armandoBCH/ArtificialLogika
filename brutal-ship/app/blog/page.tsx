import type { Metadata } from "next";
import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE, buildBreadcrumbs } from "@/lib/seo/constants";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getSiteConfig } from "@/lib/data/config";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Artículos sobre diseño web, tiendas online y presencia digital para negocios argentinos. Consejos prácticos para mejorar tu web.",
    openGraph: {
        title: `Blog | ${BUSINESS.name}`,
        description:
            "Artículos sobre diseño web, tiendas online y presencia digital para negocios argentinos.",
        url: `${SITE_URL}/blog`,
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    alternates: {
        canonical: `${SITE_URL}/blog`,
    },
};

// Blog post data — these are the actual articles
const BLOG_POSTS = [
    {
        slug: "cuanto-cuesta-una-pagina-web-en-argentina",
        title: "¿Cuánto cuesta una página web en Argentina en 2026?",
        excerpt:
            "Precios reales, qué incluye cada plan, y cómo elegir la mejor opción para tu negocio sin pagar de más.",
        date: "2026-02-15",
        readTime: "5 min",
        category: "Precios",
    },
    {
        slug: "5-razones-para-tener-pagina-web-profesional",
        title: "5 razones por las que tu negocio necesita una web profesional",
        excerpt:
            "Si todavía dependés solo de redes sociales, estás perdiendo clientes. Te explicamos por qué una web propia cambia todo.",
        date: "2026-02-20",
        readTime: "4 min",
        category: "Negocios",
    },
    {
        slug: "tienda-online-argentina-guia-completa",
        title: "Cómo crear tu tienda online en Argentina: guía completa",
        excerpt:
            "Todo lo que necesitás saber para vender online: plataformas, medios de pago, envíos, costos y errores comunes.",
        date: "2026-03-01",
        readTime: "7 min",
        category: "E-commerce",
    },
    {
        slug: "landing-page-que-es-y-para-que-sirve",
        title: "¿Qué es una landing page y para qué sirve?",
        excerpt:
            "Si sos emprendedor y querés empezar a recibir consultas por internet, una landing page es tu mejor aliado.",
        date: "2026-03-05",
        readTime: "4 min",
        category: "Diseño Web",
    },
];

export { BLOG_POSTS };

export default async function BlogPage() {
    const config = await getSiteConfig();

    const breadcrumbSchema = buildBreadcrumbs([
        { name: "Inicio", url: SITE_URL },
        { name: "Blog" },
    ]);

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-ink-black dark:text-white pt-24 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 inset-0 pattern-grid-lg text-black/[0.03] dark:text-white/[0.03] pointer-events-none z-0"></div>
            <div className="absolute top-40 right-[-100px] w-64 h-64 bg-mint rounded-full blur-[100px] opacity-40 z-0 pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-40 left-[-50px] w-48 h-48 bg-hot-coral rounded-full blur-[80px] opacity-20 z-0 pointer-events-none"></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar config={config} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight mb-6 text-black dark:text-white drop-shadow-sm leading-none">
                        Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hot-coral">Blog</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium border-x-4 border-black px-6 py-2">
                        Estrategias, consejos e ideas sin filtro para hacer crecer tu negocio en internet.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.slug}
                            className="group flex flex-col justify-between bg-white dark:bg-zinc-900 border-4 border-black rounded-xl p-8 shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[12px_12px_0_#E93D82] transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-6 flex-wrap">
                                    <span className="bg-primary text-white text-xs md:text-sm font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000] uppercase rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border-2 border-transparent">
                                        {new Date(post.date).toLocaleDateString("es-AR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                                        <span className="material-icons text-sm">schedule</span>
                                        {post.readTime}
                                    </span>
                                </div>
                                <Link href={`/blog/${post.slug}`}>
                                    <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex w-max items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm md:text-base uppercase py-3 px-6 rounded-md hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors"
                            >
                                Leer artículo
                                <span className="material-icons text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <Footer config={config} />
        </main>
    );
}
