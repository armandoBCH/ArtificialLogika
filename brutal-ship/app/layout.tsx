"use client";

import { Space_Grotesk } from "next/font/google";
import WhatsAppChatWidget from "./components/WhatsAppChatWidget";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { scrollYProgress } = useScroll();

  return (
    <html lang="es" className="scroll-smooth scroll-pt-20">
      <head>
        <title>Artificial Logika — Tu Web Profesional, Sin Complicaciones</title>
        <meta name="description" content="Diseñamos y creamos la página web que tu negocio necesita. Nosotros nos encargamos de todo — vos solo disfrutá el resultado." />
        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        {/* Material Icons Outlined */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        {/* Material Icons Round */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-display bg-background-light dark:bg-background-dark text-black dark:text-white overflow-x-hidden`}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
          style={{ scaleX: scrollYProgress }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {/* Interactive Desktop WhatsApp Widget */}
        <WhatsAppChatWidget />
      </body>
    </html>
  );
}
