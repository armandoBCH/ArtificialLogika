"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteConfigMap } from "@/lib/types/database";

interface ContactSectionProps {
    config: SiteConfigMap;
}

export default function ContactSection({ config }: ContactSectionProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [contactError, setContactError] = useState('');
    const exitoRef = useRef<HTMLDivElement>(null);
    const [prefill, setPrefill] = useState<{ rubro?: string; plan?: string } | null>(null);

    // La sección "Elegí qué querés que haga" manda al formulario con el plan ya
    // decidido en el hash. Si esa elección se perdiera al llegar acá, la persona
    // tendría que repetirla. (`rubro` sigue soportado por si un link externo lo trae.)
    useEffect(() => {
        const leer = () => {
            const h = window.location.hash;
            if (!h.startsWith('#contacto?')) return;
            const q = new URLSearchParams(h.slice(h.indexOf('?') + 1));
            const rubro = q.get('rubro') ?? '';
            const plan = q.get('plan') ?? '';
            if (rubro || plan) setPrefill({ rubro: rubro || undefined, plan: plan || undefined });
        };
        leer();
        window.addEventListener('hashchange', leer);
        return () => window.removeEventListener('hashchange', leer);
    }, []);

    // Al enviar bien, el formulario se desmonta y el foco se caía a <body>: quien
    // navega por teclado quedaba al principio del documento sin saber qué pasó.
    // Mover el foco al panel de confirmación lo deja donde está la respuesta.
    useEffect(() => {
        if (status === 'success') exitoRef.current?.focus();
    }, [status]);

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || "Hola! Quiero consultar por una web para mi negocio")}`;

    // The field accepts either an email or a phone, so neither type="email" nor type="tel"
    // can validate it on its own. Name the problem and the shape we expect.
    const checkContact = (value: string) => {
        const trimmed = value.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
        const isPhone = trimmed.replace(/\D/g, '').length >= 8;
        if (isEmail || isPhone) return '';
        return 'Necesitamos un email (juan@ejemplo.com) o un teléfono con característica (11-1234-5678) para poder responderte.';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        const form = e.currentTarget;
        const formData = new FormData(form);
        const body = {
            name: formData.get('name') as string,
            contact: formData.get('contact') as string,
            business_type: formData.get('business_type') as string,
            message: formData.get('message') as string,
            _hp_email: formData.get('_hp_email') as string,
        };

        const contactProblem = checkContact(body.contact);
        if (contactProblem) {
            setContactError(contactProblem);
            setStatus('idle');
            setErrorMessage('');
            form.querySelector<HTMLInputElement>('[name="contact"]')?.focus();
            return;
        }

        setContactError('');
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setStatus('success');
                form.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMessage(data.error || 'No pudimos enviar tu mensaje. Probá de nuevo en un momento, o escribinos por WhatsApp.');
                setStatus('error');
            }
        } catch {
            setErrorMessage('No pudimos conectarnos. Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.');
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
                    <h2 id="contacto-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-white mb-4 drop-shadow-neobrutalism">
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
                        <p className="text-ink-black/70 text-sm mb-6">Completá el formulario y te enviamos un mockup de cómo se vería tu web + presupuesto detallado. 100% gratis.</p>
                        {prefill && (
                            <p className="mb-6 flex items-start gap-2 rounded border-2 border-black bg-accent-yellow px-4 py-3 text-sm font-bold shadow-neobrutalism-sm">
                                <span aria-hidden="true" className="material-icons text-base leading-5">bookmark</span>
                                {prefill.plan
                                    ? <>Ya anotamos que te interesa el <strong>{prefill.plan}</strong></>
                                    : <>Ya anotamos que tenés un/a <strong>{prefill.rubro}</strong></>}
                            </p>
                        )}
                        {status === 'success' ? (
                            /* The confirmation persists. This is the moment the visitor decided to
                               trust us; it earns a real panel and a stated next step, not a label
                               that flashes inside a button and erases itself. */
                            <div role="status" ref={exitoRef} tabIndex={-1} className="flex flex-col items-start gap-4 rounded border-2 border-black bg-secondary p-6 md:p-8 shadow-neobrutalism-sm focus:outline-none">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#00D68F]">
                                    <span aria-hidden="true" className="material-icons text-black">check</span>
                                </span>
                                <div>
                                    <h4 className="text-black text-2xl font-bold">¡Listo! Recibimos tu mensaje.</h4>
                                    <p className="mt-2 text-black/80 font-medium">
                                        Te escribimos con tu presupuesto y un mockup de tu web en menos de {config.response_time || '48hs'}. No hace falta que hagas nada más.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cta flex items-center justify-center gap-2 rounded border-2 border-black bg-[#25D366] px-6 py-3 font-bold uppercase tracking-wider text-ink-black shadow-neobrutalism-sm transition-all hover:shadow-neobrutalism"
                                    >
                                        ¿Preferís hablar ahora?
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('idle')}
                                        className="rounded border-2 border-black bg-white px-6 py-3 font-bold uppercase tracking-wider text-black shadow-neobrutalism-sm transition-all hover:shadow-neobrutalism"
                                    >
                                        Enviar otra consulta
                                    </button>
                                </div>
                            </div>
                        ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Honeypot anti-spam field — hidden from humans, bots will fill it */}
                            <input
                                type="text"
                                name="_hp_email"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu Nombre</span>
                                    <input
                                        name="name"
                                        required
                                        autoComplete="name"
                                        className="w-full rounded border-2 border-black bg-background-light px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:shadow-neobrutalism-primary transition-all duration-300 font-medium"
                                        placeholder="Juan Pérez"
                                        type="text"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu Email o Teléfono</span>
                                    {/* Accepts either, so the email keyboard is the better default:
                                        it exposes @ and . without hiding the number row. */}
                                    <input
                                        name="contact"
                                        required
                                        autoComplete="email"
                                        inputMode="email"
                                        aria-invalid={contactError ? true : undefined}
                                        aria-describedby={contactError ? "contacto-error" : undefined}
                                        onChange={() => contactError && setContactError('')}
                                        className={`w-full rounded border-2 bg-background-light px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:shadow-neobrutalism-primary transition-all duration-300 font-medium ${contactError ? 'border-red-600' : 'border-black'}`}
                                        placeholder="juan@ejemplo.com o 11-1234-5678"
                                        type="text"
                                    />
                                    {contactError && (
                                        <span id="contacto-error" className="flex items-start gap-1.5 text-sm font-bold text-red-700">
                                            <span aria-hidden="true" className="material-icons text-base leading-5">error_outline</span>
                                            {contactError}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">¿Qué tipo de negocio tenés?</span>
                                {/* appearance-none strips the native chevron, so the control stops
                                    reading as a dropdown. The inline caret restores that affordance. */}
                                <select
                                    name="business_type"
                                    className="w-full rounded border-2 border-black bg-background-light px-4 py-3 pr-11 text-black focus:bg-white focus:-translate-y-1 focus:border-primary focus:shadow-neobrutalism-primary transition-all duration-300 font-medium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231A1A1A%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.9rem_center] bg-no-repeat"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Elegí tu rubro</option>
                                    <option>Restaurante / Gastronomía</option>
                                    <option>Tienda / Comercio</option>
                                    <option>Profesional Independiente</option>
                                    <option>Salud / Clínica</option>
                                    <option>Servicios</option>
                                    <option>Otro</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">Contanos qué necesitás</span>
                                <textarea
                                    name="message"
                                    required
                                    key={prefill ? prefill.rubro : 'vacio'}
                                    defaultValue={prefill ? `Hola! Vi el ejemplo de ${prefill.rubro} y quiero mi web.` : undefined}
                                    className="w-full rounded border-2 border-black bg-background-light px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:shadow-neobrutalism-primary transition-all duration-300 font-medium resize-none"
                                    placeholder="Ej: Necesito una web para mi peluquería con fotos de mis trabajos, precios y un botón de WhatsApp..."
                                    rows={4}
                                ></textarea>
                            </label>
                            {/* Errors live here, not inside the button: a message rendered inside a
                                fixed-size button gets clipped, and it has to survive long enough to read. */}
                            {status === 'error' && errorMessage && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-3 rounded border-2 border-red-600 bg-red-50 p-4 text-red-800"
                                >
                                    <span aria-hidden="true" className="material-icons shrink-0">error_outline</span>
                                    <div className="text-sm font-medium">
                                        <p className="font-bold">No pudimos enviar tu mensaje.</p>
                                        <p className="mt-1">{errorMessage}</p>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold underline decoration-2 underline-offset-2">
                                            Escribinos por WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}
                            <button
                                className={`w-full md:w-auto md:min-w-[20rem] px-8 py-3 text-white font-bold uppercase tracking-wider rounded border-2 border-black transition-all shadow-neobrutalism-sm ${status === 'loading' ? 'bg-primary' : 'bg-primary hover:bg-primary/90 hover:shadow-neobrutalism active:scale-95'} flex items-center justify-center gap-2 overflow-hidden relative`}
                                type="submit"
                                disabled={status === 'loading'}
                                style={{ minHeight: '52px' }}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {/* `!== 'loading'` y no `=== 'idle'`: en estado de error el
                                        botón tiene que seguir mostrando su label para poder reintentar. */}
                                    {status !== 'loading' && (
                                        <motion.div
                                            key="idle"
                                            initial={{ y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex items-center gap-2"
                                        >
                                            Quiero Mi Presupuesto Gratis <span aria-hidden="true" className="material-icons text-sm">arrow_forward</span>
                                        </motion.div>
                                    )}
                                    {status === 'loading' && (
                                        <motion.div
                                            key="loading"
                                            initial={{ scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-2"
                                        >
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                            {/* Trust signals under button */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-black/70 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-600 text-sm">check_circle</span>
                                    Sin compromiso
                                </span>
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-600 text-sm">check_circle</span>
                                    Respuesta en {config.response_time || '48hs'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span aria-hidden="true" className="material-icons text-green-600 text-sm">check_circle</span>
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
                                <div className="size-12 bg-secondary rounded-lg flex items-center justify-center border-2 border-black mb-4 shadow-neobrutalism-white">
                                    <span aria-hidden="true" className="material-icons text-black text-2xl">chat</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2">¿Preferís WhatsApp?</h3>
                                <p className="text-ink-black/60 mb-6 font-light">
                                    Escribinos directo y te respondemos al toque. Sin formularios, sin esperas.
                                </p>
                                <a
                                    className="cta inline-flex items-center justify-center gap-2 w-full py-3 bg-secondary text-black font-bold uppercase tracking-wider rounded border-2 border-black shadow-neobrutalism-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neobrutalism-white transition-all"
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Chatear por WhatsApp</span>
                                    <span aria-hidden="true" className="material-icons text-sm">arrow_outward</span>
                                </a>
                            </div>
                        </div>

                        {/* What happens after you send. Replaces an invented testimonial
                            ("María L.") illustrated with generated avatars — a promise we
                            actually control beats social proof we do not have yet. */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 p-6">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Qué pasa después</h4>
                            <ol className="space-y-2 text-white/80 text-sm font-medium">
                                <li className="flex gap-2">
                                    <span aria-hidden="true" className="font-black text-white">1.</span>
                                    Leemos lo que nos contás y preparamos una propuesta.
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden="true" className="font-black text-white">2.</span>
                                    Te mandamos presupuesto y un mockup de tu web.
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden="true" className="font-black text-white">3.</span>
                                    Si te gusta, arrancamos. Si no, no pagás nada.
                                </li>
                            </ol>
                        </div>

                        {/* Info Box */}
                        <div className="bg-[#2a2a2a] rounded-lg border-2 border-white/10 p-8">
                            <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wide border-b border-white/10 pb-2">
                                Contacto Directo
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-ink-black/60">
                                    <span aria-hidden="true" className="material-icons text-secondary shrink-0">location_on</span>
                                    <span>
                                        {config.location || 'Buenos Aires, Argentina'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-ink-black/60">
                                    <span aria-hidden="true" className="material-icons text-secondary shrink-0">mail</span>
                                    <span className="min-w-0 break-all">{config.email || 'Configurar en admin'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
