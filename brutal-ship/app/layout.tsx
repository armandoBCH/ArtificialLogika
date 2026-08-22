import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { SITE_URL, BUSINESS, SEO_KEYWORDS } from "@/lib/seo/constants";
import ScrollProgress from "./components/ScrollProgress";
import PageTransition from "./components/PageTransition";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-5MTH0Y3GG2";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  // Un solo tema. Antes se declaraba un color oscuro para navegadores en
  // modo oscuro, asi que la barra del navegador se ponia oscura mientras
  // la pagina seguia clara.
  themeColor: "#ffffff",
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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — ${BUSINESS.slogan}`,
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — ${BUSINESS.slogan}`,
    description: BUSINESS.shortDescription,
    images: ["/og-image.png"],
  },

  // Canonical & Alternates
  alternates: {
    canonical: SITE_URL,
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* UNA sola familia de íconos. Antes se inyectaban tres por JS
            (Icons + Outlined + Round): tres descargas para un mismo
            sistema, y como llegaban tarde se alcanzaba a ver el texto
            literal de la ligadura ("arrow_forward"). Cargada como
            stylesheet normal, Material Icons usa font-display:block y
            oculta el texto durante la carga. */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        {/* Detecta si la fuente de iconos cargo DE VERDAD.
            document.fonts.check() no sirve acá: devuelve true igual, porque
            el fallback del sistema puede dibujar el texto. Lo que distingue
            un icono de su texto crudo es el ancho: con la fuente cargada,
            "arrow_forward" es UN glifo angosto; sin ella son 13 caracteres. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document;function fits(){var s=d.createElement("span");s.className="material-icons";s.textContent="arrow_forward";s.style.cssText="position:absolute;left:-9999px;top:0;font-size:24px;visibility:hidden;white-space:nowrap";(d.body||d.documentElement).appendChild(s);var w=s.offsetWidth;s.parentNode.removeChild(s);return w>0&&w<60}function go(){if(!fits())return false;d.documentElement.classList.add("icons-ready");return true}function start(){if(go())return;if(d.fonts&&d.fonts.ready){d.fonts.ready.then(go).catch(function(){})}var n=0,iv=setInterval(function(){if(go()||++n>20)clearInterval(iv)},250)}if(d.readyState==="loading"){d.addEventListener("DOMContentLoaded",start)}else{start()}})();`,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-display bg-background-light dark:bg-background-dark text-black dark:text-white overflow-x-hidden`}
      >
        {/* WCAG 2.4.1 Bypass Blocks: la home tiene 13 secciones y 6 links
            de nav antes del contenido. */}
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <ScrollProgress />
        <PageTransition>
          {children}
        </PageTransition>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
