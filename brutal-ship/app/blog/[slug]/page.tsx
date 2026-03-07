import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE, buildBreadcrumbs } from "@/lib/seo/constants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getSiteConfig } from "@/lib/data/config";
import { BLOG_POSTS } from "../page";
import { getArticleContent } from "./articles";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: `${post.title} | ${BUSINESS.name}`,
            description: post.excerpt,
            url: `${SITE_URL}/blog/${slug}`,
            type: "article",
            publishedTime: post.date,
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
        },
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
    const content = getArticleContent(slug);
    if (!content) notFound();

    const breadcrumbSchema = buildBreadcrumbs([
        { name: "Inicio", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: post.title },
    ]);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
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
        image: DEFAULT_OG_IMAGE,
    };

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-ink-black dark:text-white pt-24 relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Navbar config={config} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">
                {/* Decoración de fondo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] pattern-grid-lg text-black/[0.03] dark:text-white/[0.03] pointer-events-none -z-10"></div>

                {/* Breadcrumb nav */}
                <nav className="text-sm font-bold text-gray-500 mb-12 flex items-center gap-3 uppercase tracking-wider justify-center">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span className="text-primary">/</span>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <span className="text-primary">/</span>
                    <span className="text-gray-400 truncate max-w-[150px] md:max-w-[300px]">{post.title}</span>
                </nav>

                <header className="mb-16 text-center border-b-4 border-black/10 dark:border-white/10 pb-16">
                    <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
                        <span className="bg-primary text-white text-sm font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0_#000] uppercase rounded-lg transform -rotate-2">
                            {post.category}
                        </span>
                        <time className="text-base font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border-2 border-transparent" dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </time>
                        <span className="text-base font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-lg">
                            <span className="material-icons text-lg">schedule</span>
                            {post.readTime}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-8 uppercase drop-shadow-sm text-black dark:text-white">
                        {post.title}
                    </h1>
                    <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed border-x-4 border-primary px-6 py-2">
                        {post.excerpt}
                    </p>
                </header>

                {/* Article Body Neobrutalista */}
                <div
                    className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none mx-auto
                    prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:mt-16
                    prose-h2:text-4xl prose-h2:md:text-5xl prose-h2:border-b-4 prose-h2:border-primary prose-h2:pb-2 prose-h2:inline-flex prose-h2:mb-8
                    prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:text-hot-coral prose-h3:mt-12
                    prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed prose-p:text-xl md:prose-p:text-2xl
                    prose-a:text-hot-coral prose-a:font-bold prose-a:underline prose-a:decoration-4 prose-a:underline-offset-4 hover:prose-a:bg-hot-coral hover:prose-a:text-white transition-all
                    prose-strong:bg-accent-yellow/40 prose-strong:px-1 prose-strong:text-black dark:prose-strong:text-white
                    prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-10 prose-li:mb-4
                    before:prose-li:content-['→'] before:prose-li:absolute before:prose-li:left-0 before:prose-li:text-primary before:prose-li:font-black before:prose-li:text-2xl
                    prose-blockquote:border-l-8 prose-blockquote:border-black prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-zinc-800 prose-blockquote:p-8 md:prose-blockquote:p-12 prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-2xl md:prose-blockquote:text-3xl prose-blockquote:shadow-[12px_12px_0_#e11d48] prose-blockquote:rounded-lg prose-blockquote:my-16"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* CTA Neobrutalista */}
                <div className="mt-24 md:mt-32 bg-primary/10 border-4 border-black dark:border-white/20 rounded-2xl p-8 md:p-12 text-center shadow-[12px_12px_0_#000] relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-hot-coral rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight leading-none text-black dark:text-white">¿Necesitás tu web<br /> <span className="text-primary">profesional?</span></h2>
                        <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
                            Contactanos y en menos de 48hs te enviamos un presupuesto + mockup gratis. Sin letra chica.
                        </p>
                        <a
                            href="/#contacto"
                            className="inline-flex max-w-full items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black font-black text-lg md:text-xl uppercase py-5 px-10 rounded-xl border-4 border-transparent hover:border-primary hover:bg-transparent hover:text-primary dark:hover:bg-transparent dark:hover:text-primary dark:hover:border-primary transition-all duration-300 transform hover:-translate-y-1 shadow-[6px_6px_0_#e11d48] hover:shadow-[12px_12px_0_#e11d48]"
                        >
                            Pedir Presupuesto Gratis
                            <span className="material-icons text-xl">rocket_launch</span>
                        </a>
                    </div>
                </div>

                {/* Back to blog */}
                <div className="mt-16 md:mt-24 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 font-bold text-lg md:text-xl uppercase tracking-wider hover:text-primary dark:hover:text-primary hover:gap-5 transition-all"
                    >
                        <span className="material-icons border-2 border-current rounded-full p-1">arrow_back</span>
                        Volver al blog
                    </Link>
                </div>
            </article>

            <Footer config={config} />
        </main>
    );
}
