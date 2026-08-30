import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bitter } from "next/font/google";
import Script from "next/script";
import { SITE_URL, BUSINESS, SEO_KEYWORDS } from "@/lib/seo/constants";
import ScrollProgress from "./components/ScrollProgress";
import IconFontGate from "./components/IconFontGate";
import PageTransition from "./components/PageTransition";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-5MTH0Y3GG2";

// Space Grotesk es la voz de la marca: display, titulares, botones y etiquetas.
// Su grotesca geométrica con detalles raros (la g, la a de doble piso) es lo que
// sostiene el neobrutalismo suave sin volverse rígida.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Bitter para el cuerpo. También de Huerta Tipográfica (fundición argentina), pero
// slab en vez de serif de libro — y esa diferencia es la que importa acá.
//
// Alegreya, que estaba antes, es una serif de literatura: trazo fino, pensada para
// papel. Al lado de bordes negros de 2 y 4px y sombras duras se veía endeble; el
// cuerpo no aguantaba el peso del sistema que lo rodea.
//
// Bitter resuelve exactamente eso:
//   · Las serifas rectangulares riman con los bordes gruesos en vez de competir.
//     Un slab ES estructural, igual que el neobrutalismo.
//   · Se diseñó para leer en pantalla a tamaños chicos, no para papel.
//   · Trazo parejo y robusto: sostiene la mirada en /terminos, /privacidad, el blog
//     y las respuestas del FAQ sin desaparecer contra el negro.
//
// Sigue siendo argentina, que era el punto: una agencia de acá, hablándole a negocios
// de acá, con tipografía de acá.
const bitter = Bitter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
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
    <html lang="es-AR" className="scroll-smooth scroll-pt-28">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* Material Icons — 3 lightweight fonts loaded async (non-render-blocking) */}
        {/* Removed Material Symbols Outlined (1076KB) — replaced with Material Icons Outlined */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var fonts=[
                  "https://fonts.googleapis.com/icon?family=Material+Icons"
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
        </noscript>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${bitter.variable} font-body bg-background-light text-black overflow-x-hidden`}
      >
        {/* Las animaciones de entrada de framer-motion emiten `opacity:0` inline en el
            SSR. Con JS, se revelan al hidratar. Sin JS, el visitante veía rectángulos
            vacíos — incluido el CTA primario del navbar. Esto los deja visibles.
            El H1 ya no depende de esto: se anima por CSS. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#contenido"
          className="cta sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-yellow focus:text-black focus:border-2 focus:border-black focus:px-5 focus:py-3 focus:font-bold focus:uppercase focus:tracking-wider focus:rounded focus:shadow-neobrutalism"
        >
          Saltar al contenido
        </a>
        <IconFontGate />
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
