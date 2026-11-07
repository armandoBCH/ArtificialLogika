import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, BUSINESS, buildBreadcrumbs, vistaPrevia, jsonLd } from "@/lib/seo/constants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getSiteConfig } from "@/lib/data/config";
import { BLOG_POSTS } from "../page";
import { getArticulo } from "./articles";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

// Mismo criterio que el indice del blog: estatica, con la configuracion del
// panel al dia.
export const revalidate = 3600;

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return { robots: { index: false, follow: true } };

    return {
        title: post.title,
        description: post.excerpt,
        ...vistaPrevia({
            titulo: `${post.title} | ${BUSINESS.name}`,
            descripcion: post.excerpt,
            ruta: `/blog/${slug}`,
            articulo: { publicado: post.date, modificado: post.updated ?? post.date, seccion: post.category },
        }),
        alternates: {
            canonical: `${SITE_URL}/blog/${slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) notFound();

    const config = await getSiteConfig();
    const articulo = getArticulo(slug);
    if (!articulo) notFound();

    // Tres notas para seguir leyendo: primero las de la misma categoria y, si
    // no alcanzan, las que siguen en la lista (dando la vuelta), asi los enlaces
    // se reparten entre todas las notas. Sin estos enlaces cada nota era un
    // callejon sin salida y Google no llegaba a las demas.
    const i = BLOG_POSTS.indexOf(post);
    const otras = [...BLOG_POSTS.slice(i + 1), ...BLOG_POSTS.slice(0, i)];
    const relacionados = [
        ...otras.filter((p) => p.category === post.category),
        ...otras.filter((p) => p.category !== post.category),
    ].slice(0, 3);

    const breadcrumbSchema = buildBreadcrumbs([
        { name: "Inicio", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: post.title },
    ]);

    // El FAQPage sale del mismo array que se pinta abajo. Google exige que el
    // marcado coincida con lo visible, y tener dos fuentes separadas es la forma
    // mas comun de romper esa regla sin enterarse.
    const faqSchema = articulo.preguntas.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}/blog/${slug}#faq`,
        mainEntity: articulo.preguntas.map((p) => ({
            "@type": "Question",
            name: p.pregunta,
            acceptedAnswer: { "@type": "Answer", text: p.respuesta },
        })),
    } : null;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: {
            "@type": "Organization",
            name: BUSINESS.legalName,
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: BUSINESS.legalName,
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icon.svg`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${slug}`,
        },
        // La tapa propia de la nota (./opengraph-image.tsx), no la de la home.
        image: `${SITE_URL}/blog/${slug}/opengraph-image`,
    };

    return (
        <main className="min-h-screen bg-background-light text-ink-black pt-24 relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(articleSchema)}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={jsonLd(faqSchema)}
                />
            )}
            <Navbar config={config} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">
                {/* Migas con 44px de alto para el dedo: antes medían 20. */}
                <nav aria-label="Ruta" className="etiqueta text-sm text-ink-black/70 mb-8 flex items-center gap-2 justify-center">
                    <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">Inicio</Link>
                    <span aria-hidden="true" className="text-primary">/</span>
                    <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">Blog</Link>
                    <span aria-hidden="true" className="text-primary">/</span>
                    <span aria-current="page" className="text-ink-black/70 truncate max-w-[150px] md:max-w-[300px]">{post.title}</span>
                </nav>

                <header className="mb-16 text-center border-b-4 border-black/10 pb-16">
                    <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
                        <span className="etiqueta text-sm bg-primary text-white px-4 py-2 border-2 border-black shadow-neobrutalism rounded-lg -rotate-2">
                            {post.category}
                        </span>
                        <time className="text-base font-bold text-ink-black/80 bg-background-light px-4 py-2 rounded-lg border-2 border-transparent" dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </time>
                        <span className="text-base font-bold text-ink-black/70 flex items-center gap-1 bg-white border-2 border-black/20 px-4 py-2 rounded-lg">
                            <span aria-hidden="true" className="material-icons text-lg">schedule</span>
                            {post.readTime}
                        </span>
                    </div>
                    {/* El título de una nota es una pregunta larga: en mayúsculas y a 96px se
                        leía letra por letra. Va en minúscula, que es como se lee rápido. */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.05] mb-8 text-ink-black">
                        {post.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-ink-black/80 font-medium max-w-3xl mx-auto leading-relaxed border-x-4 border-primary px-6 py-2">
                        {post.excerpt}
                    </p>
                </header>

                {/* La respuesta directa, antes del desarrollo.
                    Sirve a las dos puntas: quien entra desde una busqueda tiene el
                    dato sin leer 600 palabras, y un motor de respuestas encuentra
                    un fragmento citable sin tener que resumir la nota entera. */}
                <aside
                    aria-label="Respuesta corta"
                    className="mt-12 mb-12 max-w-3xl mx-auto border-4 border-black bg-accent-yellow rounded-xl p-6 md:p-8 shadow-neobrutalism"
                >
                    <p className="etiqueta text-ink-black/75">
                        En corto
                    </p>
                    <p className="mt-3 text-lg md:text-xl font-bold leading-snug text-ink-black">
                        {articulo.respuestaCorta}
                    </p>
                </aside>

                {/* Cuerpo de la nota. La tipografía (18px en celular, 20px en computadora,
                    subtítulos, enlaces, viñetas) está en globals.css bajo `article .prose`:
                    el plugin de Tailwind que leía las clases `prose-*` nunca estuvo instalado.
                    Mismo ancho que "En corto" y las preguntas: ~70 caracteres por renglón. */}
                <div
                    className="prose max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: articulo.contenido }}
                />

                {/* Estas preguntas son las mismas que alimentan el schema FAQPage.
                    Una sola fuente, asi el marcado nunca se despega de lo visible. */}
                {articulo.preguntas.length > 0 && (
                    <section
                        aria-labelledby="preguntas-nota"
                        className="mt-24 max-w-3xl mx-auto"
                    >
                        <h2
                            id="preguntas-nota"
                            className="text-3xl md:text-4xl font-bold uppercase tracking-[-0.02em] border-b-4 border-primary pb-2 inline-flex mb-8"
                        >
                            Preguntas frecuentes
                        </h2>
                        <dl className="space-y-6">
                            {articulo.preguntas.map((p) => (
                                <div
                                    key={p.pregunta}
                                    className="border-2 border-black bg-white rounded-xl p-6 shadow-neobrutalism-sm"
                                >
                                    <dt className="text-xl md:text-2xl font-bold leading-snug text-ink-black">
                                        {p.pregunta}
                                    </dt>
                                    <dd className="mt-3 text-lg md:text-xl font-medium leading-relaxed text-ink-black/80">
                                        {p.respuesta}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}

                {relacionados.length > 0 && (
                    <section aria-labelledby="notas-relacionadas" className="mt-24">
                        <h2
                            id="notas-relacionadas"
                            className="text-3xl md:text-4xl font-bold uppercase tracking-[-0.02em] border-b-4 border-primary pb-2 inline-flex mb-8"
                        >
                            Artículos relacionados
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relacionados.map((r) => (
                                <Link
                                    key={r.slug}
                                    href={`/blog/${r.slug}`}
                                    className="group flex flex-col bg-white border-2 border-black rounded-xl p-6 shadow-neobrutalism hover:-translate-y-0.5 hover:shadow-neobrutalism-lg transition-all duration-200"
                                >
                                    <span className="etiqueta self-start bg-primary text-white px-3 py-1.5 border-2 border-black rounded-full mb-4">
                                        {r.category}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {r.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* El cierre de cada nota: el mismo CTA y la misma promesa que la home. */}
                <div className="mt-24 md:mt-32 bg-white border-2 border-black rounded-xl p-8 md:p-12 text-center shadow-neobrutalism-lg">
                    <h2 className="titular-seccion text-4xl md:text-5xl mb-4 text-ink-black">¿Necesitás tu web<br /> <span className="text-primary">profesional?</span></h2>
                    <p className="text-xl md:text-2xl font-medium text-ink-black mb-8 max-w-2xl mx-auto">
                        Contactanos y en menos de 48hs te enviamos un presupuesto y un diseño previo de tu web, gratis. Sin letra chica.
                    </p>
                    <Link
                        href="/#contacto"
                        className="boton boton-primario max-w-full text-lg md:text-xl px-8 py-4"
                    >
                        Quiero mi web
                        <span aria-hidden="true" className="material-icons text-xl">arrow_forward</span>
                    </Link>
                </div>

                {/* Back to blog */}
                <div className="mt-16 md:mt-24 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex min-h-11 items-center gap-3 text-ink-black/75 font-bold text-lg md:text-xl uppercase tracking-wider hover:text-primary hover:gap-5 transition-all"
                    >
                        <span aria-hidden="true" className="material-icons border-2 border-current rounded-full p-1">arrow_back</span>
                        Volver al blog
                    </Link>
                </div>
            </article>

            <Footer config={config} />
        </main>
    );
}
