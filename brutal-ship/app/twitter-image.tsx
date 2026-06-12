import { ImageResponse } from "next/og";

// Must declare runtime directly — Turbopack can't parse re-exports for route config
export const runtime = "edge";

export const alt = "Logika — Agencia de diseño y desarrollo web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Import and re-use the same OG image renderer
export { default } from "./opengraph-image";
