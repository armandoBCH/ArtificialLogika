import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { SITE_URL, BUSINESS, SEO_KEYWORDS, DEFAULT_OG_IMAGE } from "@/lib/seo/constants";
import ScrollProgress from "./components/ScrollProgress";
import PageTransition from "./components/PageTransition";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Core
  title: {
    default: `${BUSINESS.name} — ${BUSINESS.slogan}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  keywords: SEO_KEYWORDS,
  authors: [{ name: BUSINESS.legalName, url: SITE_URL }],
  creator: BUSINESS.legalName,
  publisher: BUSINESS.legalName,
  category: "technology",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: BUSINESS.locale,
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — ${BUSINESS.slogan}`,
    description: BUSINESS.shortDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — Agencia de diseño y desarrollo web`,
        type: "image/png",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — ${BUSINESS.slogan}`,
    description: BUSINESS.shortDescription,
    images: [DEFAULT_OG_IMAGE],
  },

  // Canonical & Alternates
  alternates: {
    canonical: SITE_URL,
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  // Verification placeholders (uncomment when you have them)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="scroll-smooth scroll-pt-20">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* Material Icons — loaded async via script (non-render-blocking) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var fonts=[
                  "https://fonts.googleapis.com/icon?family=Material+Icons",
                  "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
                  "https://fonts.googleapis.com/icon?family=Material+Icons+Round",
                  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                ];
                fonts.forEach(function(href){
                  var l=document.createElement("link");
                  l.rel="stylesheet";l.href=href;l.crossOrigin="anonymous";
                  document.head.appendChild(l);
                });
              })();
            `,
          }}
        />
        {/* Fallback for no-JS */}
        <noscript>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body
        className={`${spaceGrotesk.variable} font-display bg-background-light dark:bg-background-dark text-black dark:text-white overflow-x-hidden`}
      >
        <ScrollProgress />
        <PageTransition>
          {children}
        </PageTransition>

      </body>
    </html>
  );
}
