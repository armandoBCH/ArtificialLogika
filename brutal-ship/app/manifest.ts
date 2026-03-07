import type { MetadataRoute } from "next";
import { SITE_URL, BUSINESS } from "@/lib/seo/constants";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${BUSINESS.name} — ${BUSINESS.slogan}`,
        short_name: BUSINESS.name,
        description: BUSINESS.shortDescription,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#8523E1",
        orientation: "portrait-primary",
        categories: ["business", "web", "design"],
        lang: "es-AR",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: "/og-image.png",
                sizes: "1200x630",
                type: "image/png",
            },
        ],
    };
}
