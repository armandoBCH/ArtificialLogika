import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getPortfolioProjects } from "@/lib/data/portfolio";

// Force dynamic rendering — sitemap needs runtime Supabase access
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/portafolio`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    // Dynamic portfolio project pages
    let projectPages: MetadataRoute.Sitemap = [];
    try {
        const projects = await getPortfolioProjects();
        projectPages = projects.map((project) => ({
            url: `${SITE_URL}/portafolio/${project.id}`,
            lastModified: new Date(project.updated_at),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }));
    } catch {
        // Silently fail — sitemap will still have static pages
    }

    return [...staticPages, ...projectPages];
}
