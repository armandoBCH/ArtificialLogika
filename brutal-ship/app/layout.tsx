import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bitter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { SITE_URL, BUSINESS, SEO_KEYWORDS } from "@/lib/seo/constants";
import ScrollProgress from "./components/ScrollProgress";
import IconFontGate from "./components/IconFontGate";
import PageTransition from "./components/PageTransition";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-5MTH0Y3GG2";

// Material Icons se cargaba con un <link> a fonts.googleapis.com inyectado por
// script, mas un <noscript> de respaldo. Eso metia en el camino critico del primer
// render un origen de terceros: resolucion DNS, handshake TLS, un CSS, y recien
// despues el woff2 desde fonts.gstatic.com. Cuatro viajes antes de ver un icono.
//
// Ahora el woff2 vive en el repo y lo sirve el mismo origen que el HTML. No se puede
// hacer subset con los iconos que usamos porque 17 vienen de la base (`feature.icon`,
// `s.icon`): el admin puede elegir cualquiera, asi que va la fuente completa.
//
// `display: "block"` y no "swap" a proposito. Estas ligaduras son texto ("check_circle")
// hasta que la fuente llega; con swap se leeria esa palabra por un instante. Con block
// el espacio queda invisible y despues aparece el glifo, que es lo que hoy resuelve
// IconFontGate a mano.
//
// Material Icons es Apache 2.0, que permite redistribuirla.
const materialIcons = localFont({
  src: "./fonts/material-icons.woff2",
  variable: "--font-material-icons",
  display: "block",
  weight: "400",
  style: "normal",
});

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

  // Verificacion de Google Search Console.
  //
  // Se lee de una variable de entorno en vez de estar escrita aca, para que el
  // codigo se pegue una sola vez desde el panel de Vercel sin tocar el repo ni
  // esperar un deploy manual. Si la variable no esta, no se emite la etiqueta:
  // una meta vacia es peor que ninguna, porque Google la lee como intento
  // fallido de verificacion.
  //
  // Vercel > Settings > Environment Variables:
  //   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = <el codigo que da Search Console>
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="scroll-smooth scroll-pt-28">
      <head>
        {/* Ya no hay preconnect a fonts.googleapis / fonts.gstatic: las tres fuentes
            (Space Grotesk, Bitter, Material Icons) las sirve este mismo origen. */}
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${bitter.variable} ${materialIcons.variable} font-body bg-background-light text-black overflow-x-hidden`}
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
