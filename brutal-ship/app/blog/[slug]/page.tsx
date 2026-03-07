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
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-ink-black dark:text-white pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Navbar config={config} />

            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                {/* Breadcrumb nav */}
                <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
                    <Link href="/" className="hover:text-primary">Inicio</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-primary">Blog</Link>
                    <span>/</span>
                    <span className="text-gray-400 truncate max-w-[200px]">{post.title}</span>
                </nav>

                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 uppercase rounded">
                            {post.category}
                        </span>
                        <time className="text-sm text-gray-500" dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </time>
                        <span className="text-sm text-gray-400">· {post.readTime}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                        {post.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                    </p>
                </header>

                {/* Article Body */}
                <div
                    className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* CTA */}
                <div className="mt-16 bg-primary text-white border-2 border-black rounded-lg p-8 text-center shadow-[6px_6px_0_#000]">
                    <h2 className="text-2xl font-bold mb-3">¿Necesitás tu web profesional?</h2>
                    <p className="text-white/90 mb-6">Contactanos y en menos de 48hs te enviamos un presupuesto + mockup gratis.</p>
                    <a
                        href="/#contacto"
                        className="inline-block bg-white text-black font-bold py-3 px-8 rounded border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        Pedir Presupuesto Gratis
                    </a>
                </div>

                {/* Back to blog */}
                <div className="mt-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                    >
                        <span className="material-icons text-sm">arrow_back</span>
                        Volver al blog
                    </Link>
                </div>
            </article>

            <Footer config={config} />
        </main>
    );
}
