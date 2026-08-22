"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { trackLeadSubmit, trackLeadError, trackWhatsAppClick } from "@/lib/analytics-events";
import type { SiteConfigMap } from "@/lib/types/database";

interface ContactSectionProps {
    config: SiteConfigMap;
}

const inputClass =
    "w-full rounded-lg border-2 border-black bg-gray-50 px-4 py-3 text-black " +
    "placeholder-gray-500 font-medium transition-colors duration-150 " +
    "focus:bg-white focus:border-primary";

export default function ContactSection({ config }: ContactSectionProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || "Hola! Quiero consultar por una web para mi negocio")}`;

    // Limpiar el error al escribir. Antes el mensaje se autodestruía a los
    // 3s con un setTimeout, así que quien se equivocaba no llegaba a leer
    // qué corregir (WCAG 2.2.1). Ahora persiste hasta que el usuario actúa.
    const clearError = () => {
        if (status === 'error') {
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        const formData = new FormData(e.currentTarget);
        const email = ((formData.get('email') as string) || '').trim();
        const phone = ((formData.get('phone') as string) || '').trim();

        // Al menos un canal de contacto. La API espera un único campo
        // `contact`, así que se combinan sin cambiar su contrato.
        if (!email && !phone) {
            setErrorMessage('Dejanos un email o un WhatsApp para poder responderte.');
            setStatus('error');
            return;
        }

        const businessType = (formData.get('business_type') as string) || '';
        setStatus('loading');
        setErrorMessage('');

        const body = {
            name: formData.get('name') as string,
            contact: [email, phone].filter(Boolean).join(' · ').slice(0, 200),
            business_type: businessType,
            message: formData.get('message') as string,
            _hp_email: formData.get('_hp_email') as string,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                // Sólo acá es una conversión: al 200, no al submit.
                trackLeadSubmit(businessType);
                setStatus('success');
                formRef.current?.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || 'No pudimos enviar tu mensaje. Probá de nuevo en un momento.';
                trackLeadError(msg);
                setErrorMessage(msg);
                setStatus('error');
            }
        } catch {
            const msg = 'Sin conexión. Revisá tu internet y volvé a intentar.';
            trackLeadError('network');
            setErrorMessage(msg);
            setStatus('error');
        }
    };

    return (
        <section id="contacto" aria-labelledby="contacto-heading" className="relative bg-primary px-4 py-20 md:px-10 lg:px-20 overflow-hidden">
            {/* Geometric Background Shapes */}
            <div className="geometric-shape top-10 left-10 w-32 h-32 rounded-full border-4 border-white"></div>
            <div className="geometric-shape bottom-20 right-20 w-48 h-48 rotate-45 border-4 border-white"></div>
            <div className="geometric-shape top-1/2 left-1/4 w-24 h-24 rounded border-4 border-white"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 id="contacto-heading" className="text-white text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-4 drop-shadow-md">
                        ¿Listo Para Tu <br className="hidden md:block" />Nueva Web?
                    </h2>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Contanos sobre tu negocio y te enviamos <strong className="text-white underline decoration-2 underline-offset-4">un presupuesto + mockup gratis</strong> en menos de {config.response_time || '48hs'}.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Form Card */}
                    <div className="lg:col-span-7 bg-white rounded-lg border-2 border-black p-6 md:p-10 shadow-neobrutalism relative">
                        {/* Free offer badge */}
                        <div className="absolute -top-4 left-6 bg-accent-yellow border-2 border-black px-4 py-1 font-bold text-sm shadow-neobrutalism-sm transform -rotate-2 rounded z-20">
                            🎁 PRESUPUESTO + MOCKUP GRATIS
                        </div>
                        <h3 className="text-black text-2xl font-bold mb-2 flex items-center gap-2 mt-4">
                            <span aria-hidden="true" className="material-icons text-primary">mail</span>
                            Recibí tu presupuesto sin compromiso
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">Completá el formulario y te enviamos un mockup de cómo se vería tu web + presupuesto detallado. 100% gratis.</p>
                        {status === 'success' ? (
                            /* El éxito NO se autodestruye: reemplaza al formulario
                               y dice qué pasa después. Antes desaparecía a los 3s. */
                            <div
                                role="status"
                                aria-live="polite"
                                className="border-2 border-black rounded-lg bg-secondary/15 p-6 text-center"
                            >
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-secondary shadow-elev-1">
                                    <span aria-hidden="true" className="material-icons text-black text-3xl">check</span>
                                </div>
                                <h4 className="text-black text-xl font-bold mb-2">¡Listo! Recibimos tu mensaje.</h4>
                                <p className="text-gray-700 font-medium mb-5">
                                    Te escribimos en menos de {config.response_time || '48hs'} con tu presupuesto y un
                                    mockup de cómo se vería tu web.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackWhatsAppClick('contact_section')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-whatsapp text-ink-black font-bold uppercase tracking-wider rounded-lg border-2 border-black shadow-elev-1 hover:shadow-elev-0 hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    >
                                        ¿Es urgente? Escribinos
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('idle')}
                                        className="px-6 py-3 font-bold uppercase tracking-wider text-black underline decoration-2 underline-offset-4"
                                    >
                                        Enviar otra consulta
                                    </button>
                                </div>
                            </div>
                        ) : (
                        <form className="space-y-6" onSubmit={handleSubmit} ref={formRef} noValidate>
                            {/* Honeypot anti-spam */}
                            <input
                                type="text"
                                name="_hp_email"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                            />
                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">Tu Nombre</span>
                                <input
                                    name="name"
                                    required
                                    autoComplete="name"
                                    className={inputClass}
                                    placeholder="Juan Pérez"
                                    type="text"
                                    onChange={clearError}
                                />
                            </label>

                            {/* Antes era un solo campo `type="text"` para "email o
                                teléfono": en mobile abría el teclado alfabético, sin
                                @ ni teclado numérico. Ahora cada canal tiene su tipo
                                y su autocompletado (WCAG 1.3.5). */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu Email</span>
                                    <input
                                        name="email"
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        className={inputClass}
                                        placeholder="juan@ejemplo.com"
                                        onChange={clearError}
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu WhatsApp</span>
                                    <input
                                        name="phone"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        className={inputClass}
                                        placeholder="11 1234-5678"
                                        onChange={clearError}
                                    />
                                </label>
                            </div>
                            <p className="text-gray-600 text-xs font-medium -mt-3">
                                Con uno de los dos alcanza. Te respondemos por donde prefieras.
                            </p>

                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">¿Qué tipo de negocio tenés?</span>
                                <div className="relative">
                                    <select
                                        name="business_type"
                                        required
                                        defaultValue=""
                                        onChange={clearError}
                                        className={`${inputClass} appearance-none pr-11`}
                                    >
                                        {/* Antes el default era "Otro": todo lead que no
                                            tocaba el campo se registraba como "Otro" y la
                                            segmentación quedaba inservible. */}
                                        <option value="" disabled>Elegí una opción</option>
                                        <option>Restaurante / Gastronomía</option>
                                        <option>Tienda / Comercio</option>
                                        <option>Profesional Independiente</option>
                                        <option>Salud / Clínica</option>
                                        <option>Servicios</option>
                                        <option>Otro</option>
                                    </select>
                                    {/* El select era appearance-none sin indicador: no
                                        había ninguna señal de que fuera desplegable. */}
                                    <span
                                        aria-hidden="true"
                                        className="material-icons pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
                                    >
                                        expand_more
                                    </span>
                                </div>
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">Contanos qué necesitás</span>
                                <textarea
                                    name="message"
                                    required
                                    className={`${inputClass} resize-y min-h-[7rem]`}
                                    placeholder="Ej: Necesito una web para mi peluquería con fotos de mis trabajos, precios y un botón de WhatsApp..."
                                    rows={4}
                                    onChange={clearError}
                                ></textarea>
                            </label>

                            {/* Los mensajes de estado se anuncian a lectores de
                                pantalla. Antes no había ninguna región aria-live
                                en todo el sitio (WCAG 4.1.3). */}
                            {status === 'error' && (
                                <p
                                    role="alert"
                                    className="flex items-start gap-2 border-2 border-hot-coral bg-hot-coral/10 text-black rounded-lg px-4 py-3 font-bold text-sm"
                                >
                                    <span aria-hidden="true" className="material-icons text-hot-coral text-lg shrink-0">error</span>
                                    {errorMessage}
                                </p>
                            )}

                            <button
                                className="w-full md:w-auto px-8 min-h-[52px] text-white font-bold uppercase tracking-wider rounded-lg border-2 border-black transition-all shadow-elev-1 bg-primary hover:bg-primary-dark hover:shadow-elev-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                type="submit"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Quiero Mi Presupuesto Gratis
                                        <span aria-hidden="true" className="material-icons text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                            <span role="status" aria-live="polite" className="sr-only">
                                {status === 'loading' ? 'Enviando tu mensaje' : ''}
                            </span>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-700 text-sm">check_circle</span>
                                    Sin compromiso
                                </span>
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-700 text-sm">check_circle</span>
                                    Respuesta en {config.response_time || '48hs'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-700 text-sm">check_circle</span>
                                    Mockup incluido
                                </span>
                            </div>
                        </form>
                        )}
                    </div>

                    {/* Sidebar / Info Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* WhatsApp Card */}
                        <div className="bg-ink-black rounded-lg border-2 border-white/10 p-8 shadow-neobrutalism relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-secondary/20"></div>
                            <div className="relative z-10">
                                <div className="size-12 bg-secondary rounded-lg flex items-center justify-center border-2 border-black mb-4 shadow-[2px_2px_0px_0px_#fff]">
                                    <span aria-hidden="true" className="material-icons text-black text-2xl">chat</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2">¿Preferís WhatsApp?</h3>
                                <p className="text-gray-400 mb-6 font-light">
                                    Escribinos directo y te respondemos al toque. Sin formularios, sin esperas.
                                </p>
                                <a
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-secondary text-black font-bold uppercase tracking-wider rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all"
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackWhatsAppClick('contact_section')}
                                >
                                    <span>Chatear por WhatsApp</span>
                                    <span aria-hidden="true" className="material-icons text-sm">arrow_outward</span>
                                </a>
                            </div>
                        </div>

                        {/* Social Proof Mini Card */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex -space-x-2">
                                    <Image alt="Foto de cliente satisfecho de Logika" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkYW0Flt0xW1Z3HB3NQwCqzJaGgTOWrUXGCNluYmymfDWoJiDh-UQh0Hdx9NWuTx_qiQdr2KzeaMkZ7N-QQl-4dkzIoTTSGaeaZ2tbzIGEJElJLhGWd7ydROujN0ENIj2UpffcTf9t4guY8he-CwCnCEMKa7QKx-3PXBAKeNM6IVxxsNb5-fd8qJOzrfCMg5_jfSEb9mfICiqS2r2p2IlfH-kkOZFsh6HwhgsxB1gpdvi7ThCjXF-CiziTu_MG8QUi-jcjVj54rUI" width={32} height={32} loading="lazy" />
                                    <Image alt="Testimonio de cliente de diseño web" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQAEL7ldXO17P2zxbs1YngIHQKE24NCKGj4oHGt_U2jG0qZlQJYr5_JnXBJDR2YGgjx92YrRE0A1VBRzREbR7mT3awaWFn2PLGLhFbdroVUJNp2fTW9nA2xy0EXhcPunUx9Os-ruZSBCW7eK-AEGwD9FP-TnJ6vU27MmbXLnT3QBUELyLnEkDzq5PyYCWaZaiA2RMtrwwH9Qhr4aeOIBEk5InS3zW5OPrNNoCM6Tsy1tH3DmPWRd3ajGeYXrv4ejWcHDK3jjmO13U" width={32} height={32} loading="lazy" />
                                    <Image alt="Reseña de cliente web profesional Argentina" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwUxH3A7ZLuocQWfDb9tQet8_f_6u-oQQpVWTMjdpLmOS5ImkWGQ2yJOHKDj85TOdQwFhcPYptf-mugD8IWQ-w4sNC4AtJZ9J_ffQF2JxVbGqj6YfDTGIfTt3X-3p2TRPQA6g8DHQcqy6mRejoSOGIYJXeeyvv8idqZO85dwqI2a8ODmJu4qRIbVLPKefJoPsqoWl_70pqnl3Vn55pSEj4bF0QYnlSAdTcnI_Si2joxXY0K-47AmnvN-m4KWktQo8UD4nWuZCLBgQ" width={32} height={32} loading="lazy" />
                                </div>
                                <p className="text-white text-sm font-bold">&quot;Me respondieron en 2 horas&quot;</p>
                            </div>
                            <p className="text-white/60 text-xs">— María L., clienta de Logika</p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-[#2a2a2a] rounded-lg border-2 border-white/10 p-8">
                            <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wide border-b border-white/10 pb-2">
                                Contacto Directo
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-300">
                                    <span aria-hidden="true" className="material-icons text-secondary shrink-0">location_on</span>
                                    <span>
                                        {config.location || 'Buenos Aires, Argentina'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <span aria-hidden="true" className="material-icons text-secondary shrink-0">mail</span>
                                    <span>{config.email || 'Configurar en admin'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
