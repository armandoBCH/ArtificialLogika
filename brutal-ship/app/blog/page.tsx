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
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-ink-black dark:text-white pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar config={config} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
                    Blog
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 border-l-4 border-primary pl-4">
                    Consejos prácticos sobre diseño web, tiendas online y presencia
                    digital para tu negocio.
                </p>

                <div className="space-y-8">
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.slug}
                            className="group bg-white dark:bg-zinc-900 border-2 border-black rounded-lg p-6 md:p-8 shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 uppercase rounded">
                                    {post.category}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(post.date).toLocaleDateString("es-AR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="text-sm text-gray-400">· {post.readTime}</span>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {post.excerpt}
                            </p>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center gap-1 text-primary font-bold text-sm uppercase hover:gap-3 transition-all"
                            >
                                Leer artículo
                                <span className="material-icons text-sm">arrow_forward</span>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <Footer config={config} />
        </main>
    );
}
