"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

/**
 * Píxel de Meta: mide los avisos de Facebook e Instagram y arma el público de
 * remarketing. Sin NEXT_PUBLIC_META_PIXEL_ID no carga nada, así que se prende
 * cargando el número en Vercel > Settings > Environment Variables y redeployando.
 *
 * - PageView: lo manda el snippet; las navegaciones internas las cuenta solo
 *   fbevents.js, que escucha history.pushState.
 * - Contact: cualquier link a WhatsApp, con un solo listener en vez de tocar
 *   cada botón. El widget abre WhatsApp con window.open y lo manda él.
 * - Lead: el formulario, al enviarse bien (ContactSection).
 *
 * lazyOnload como Google Analytics, para no pesar en la carga. El admin no se mide.
 */
const ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
const PIXEL_ID = /^\d{6,20}$/.test(ID) ? ID : null;

export default function MetaPixel() {
    const enAdmin = usePathname()?.startsWith("/admin") ?? false;
    const activo = PIXEL_ID !== null && !enAdmin;

    useEffect(() => {
        if (!activo) return;
        const alTocar = (e: MouseEvent) => {
            const link = (e.target as Element | null)?.closest?.(
                'a[href*="wa.me/"], a[href*="api.whatsapp.com/"], a[href*="whatsapp.com/send"]'
            );
            if (link) window.fbq?.("track", "Contact");
        };
        document.addEventListener("click", alTocar, true);
        return () => document.removeEventListener("click", alTocar, true);
    }, [activo]);

    if (!activo) return null;
    return (
        <Script id="meta-pixel" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
    );
}
