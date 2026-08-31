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
        date: "2026-08-04",
        readTime: "5 min",
        category: "Precios",
    },
    {
        slug: "5-razones-para-tener-pagina-web-profesional",
        title: "5 razones por las que tu negocio necesita una web profesional",
        excerpt:
            "Si todavía dependés solo de redes sociales, estás perdiendo clientes. Te explicamos por qué una web propia cambia todo.",
        date: "2026-08-06",
        readTime: "4 min",
        category: "Negocios",
    },
    {
        slug: "tienda-online-argentina-guia-completa",
        title: "Cómo crear tu tienda online en Argentina: guía completa",
        excerpt:
            "Todo lo que necesitás saber para vender online: plataformas, medios de pago, envíos, costos y errores comunes.",
        date: "2026-08-08",
        readTime: "7 min",
        category: "E-commerce",
    },
    {
        slug: "landing-page-que-es-y-para-que-sirve",
        title: "¿Qué es una landing page y para qué sirve?",
        excerpt:
            "Si sos emprendedor y querés empezar a recibir consultas por internet, una landing page es tu mejor aliado.",
        date: "2026-08-11",
        readTime: "4 min",
        category: "Diseño Web",
    },
    {
        slug: "cuanto-cuesta-pagina-web-peluqueria",
        title: "¿Cuánto cuesta una página web para una peluquería?",
        excerpt:
            "Desde US$149 y lista en 1 a 2 semanas. Qué tiene que tener, si hace falta turnero online, y por qué conviene publicar los precios.",
        date: "2026-08-13",
        readTime: "4 min",
        category: "Precios",
    },
    {
        slug: "que-es-un-dominio-web-cuanto-cuesta",
        title: "¿Qué es un dominio web y cuánto cuesta en Argentina?",
        excerpt:
            "El dominio se alquila por año, no se compra para siempre. Diferencia entre .com y .com.ar, y por qué tiene que estar a tu nombre.",
        date: "2026-08-15",
        readTime: "4 min",
        category: "Técnico",
    },
    {
        slug: "que-es-el-hosting-web",
        title: "¿Qué es el hosting y por qué lo necesito?",
        excerpt:
            "Si el dominio es la dirección, el hosting es la casa. Cuánto cuesta, qué pasa si dejás de pagarlo, y cómo influye en Google.",
        date: "2026-08-18",
        readTime: "4 min",
        category: "Técnico",
    },
    {
        slug: "cuanto-tarda-hacer-una-pagina-web",
        title: "¿Cuánto tarda en hacerse una página web?",
        excerpt:
            "Entre 1 y 4 semanas según el tipo de sitio. Qué parte del plazo depende de vos y qué es lo que más demora un proyecto.",
        date: "2026-08-20",
        readTime: "4 min",
        category: "Proceso",
    },
    {
        slug: "como-aparecer-en-google-con-mi-negocio",
        title: "¿Cómo hago para que mi negocio aparezca en Google?",
        excerpt:
            "Son dos cosas distintas y complementarias: la ficha de empresa, que es gratis, y el sitio web. Por dónde empezar y en qué orden.",
        date: "2026-08-22",
        readTime: "5 min",
        category: "SEO",
    },
    {
        slug: "necesito-web-si-tengo-whatsapp-business",
        title: "¿Necesito una página web si ya uso WhatsApp Business?",
        excerpt:
            "Resuelven cosas distintas. WhatsApp es donde cerrás la venta; la web es lo que hace que te escriban a WhatsApp.",
        date: "2026-08-25",
        readTime: "4 min",
        category: "Negocios",
    },
    {
        slug: "que-es-un-mockup-web",
        title: "¿Qué es un mockup y por qué pedirlo antes de pagar?",
        excerpt:
            "Es la vista previa de tu web antes de programar nada. Sirve para decidir con algo a la vista en lugar de imaginarlo.",
        date: "2026-08-26",
        readTime: "3 min",
        category: "Proceso",
    },
    {
        slug: "como-elegir-quien-me-hace-la-web",
        title: "¿Cómo elijo quién me hace la página web?",
        excerpt:
            "Cinco cosas para mirar antes que el precio, y las señales de alarma que conviene detectar antes de firmar.",
        date: "2026-08-27",
        readTime: "5 min",
        category: "Negocios",
    },
    {
        slug: "que-necesito-antes-de-encargar-mi-web",
        title: "¿Qué necesito tener listo antes de encargar mi web?",
        excerpt:
            "Cuatro cosas que aceleran el proyecto si las llevás resueltas, y una que casi siempre falta y frena todo.",
        date: "2026-08-28",
        readTime: "4 min",
        category: "Proceso",
    },
    {
        slug: "por-que-mi-web-no-aparece-en-google",
        title: "¿Por qué mi página web no aparece en Google?",
        excerpt:
            "Las cuatro causas más frecuentes, cómo comprobar cuál es la tuya en dos minutos, y qué hacer con cada una.",
        date: "2026-08-29",
        readTime: "5 min",
        category: "SEO",
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
        <main className="min-h-screen bg-background-light text-ink-black pt-24 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 inset-0 pattern-grid-lg text-black/[0.03] pointer-events-none z-0"></div>
            <div className="absolute top-40 right-[-100px] w-64 h-64 bg-mint rounded-full blur-[100px] opacity-40 z-0 pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-40 left-[-50px] w-48 h-48 bg-hot-coral rounded-full blur-[80px] opacity-20 z-0 pointer-events-none"></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar config={config} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight mb-6 text-black drop-shadow-neobrutalism-sm leading-none">
                        Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hot-coral">Blog</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink-black/80 max-w-3xl mx-auto font-medium border-x-4 border-black px-6 py-2">
                        Estrategias, consejos e ideas sin filtro para hacer crecer tu negocio en internet.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.slug}
                            className="group flex flex-col justify-between bg-white border-4 border-black rounded-xl p-8 shadow-neobrutalism-lg hover:-translate-y-2 hover:-translate-x-1 hover:shadow-neobrutalism-xl transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-6 flex-wrap">
                                    <span className="bg-primary text-white text-xs md:text-sm font-bold px-3 py-1.5 border-2 border-black shadow-neobrutalism-sm uppercase rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-sm font-medium text-ink-black/70 bg-background-light px-3 py-1.5 rounded-full border-2 border-transparent">
                                        {new Date(post.date).toLocaleDateString("es-AR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className="text-sm font-medium text-ink-black/60 flex items-center gap-1">
                                        <span aria-hidden="true" className="material-icons text-sm">schedule</span>
                                        {post.readTime}
                                    </span>
                                </div>
                                <Link href={`/blog/${post.slug}`}>
                                    <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="text-ink-black/70 mb-8 text-lg leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex w-max items-center gap-2 bg-black text-white font-bold text-sm md:text-base uppercase py-3 px-6 rounded-md hover:bg-primary transition-colors"
                            >
                                Leer artículo
                                <span aria-hidden="true" className="material-icons text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <Footer config={config} />
        </main>
    );
}
