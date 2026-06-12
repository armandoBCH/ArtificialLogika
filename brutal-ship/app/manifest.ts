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
                src: "/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
        ],
    };
}
