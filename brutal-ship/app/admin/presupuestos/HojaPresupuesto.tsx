import type { CSSProperties } from "react";
import { formatearPesos } from "@/lib/precios";
import {
    formatearFecha,
    formatearNumero,
    sumarDias,
    tituloDe,
    type Empresa,
    type Presupuesto,
    type Totales,
} from "./modelo";

/**
 * El presupuesto como lo recibe el cliente.
 *
 * Es papel, no pantalla del admin: fondo blanco, tinta negra y los dispositivos de
 * la marca. La ficha (la etiqueta que rompe el borde) para cada bloque de datos,
 * porque un presupuesto ES un formulario que Logika completó por el cliente. Un
 * solo sello, para la garantía de la seña: es el único veredicto del documento.
 *
 * Usa container queries y no breakpoints de pantalla: la misma hoja se ve en la
 * columna angosta del editor, a ancho completo en la vista previa y en un A4.
 */

interface Props {
    presupuesto: Presupuesto;
    totales: Totales;
    numero: number | null;
    empresa: Empresa;
}

export default function HojaPresupuesto({ presupuesto: p, totales: t, numero, empresa }: Props) {
    const lineas = p.lineas.filter((l) => l.nombre.trim() || l.precio > 0);
    const mensuales = p.mensuales.filter((m) => m.nombre.trim() || m.precio > 0);
    const aporta = p.aportaCliente.filter((a) => a.trim());
    const condiciones = p.condiciones.filter((c) => c.trim());
    const hayAjustes = t.descuento > 0 || t.recargo > 0;
    const whatsapp = formatearTelefono(empresa.whatsapp);

    return (
        <article className="hoja-presupuesto @container bg-white text-ink-black border-2 border-black shadow-neobrutalism-lg">
            {/* Los cuatro colores de la marca, en el orden del isotipo. */}
            <div aria-hidden="true" className="grid h-2 grid-cols-4">
                <span className="bg-primary" />
                <span className="bg-[#4A90FF]" />
                <span className="bg-hot-coral" />
                <span className="bg-secondary" />
            </div>

            <div className="hoja-cuerpo p-6 @2xl:p-10">
                {/* ── Encabezado ── */}
                <header className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                        <MarcaLogika />
                        <p className="mt-2 text-xs font-medium text-ink-black/60">
                            Diseño y desarrollo web{empresa.ubicacion ? ` · ${empresa.ubicacion}` : ""}
                        </p>
                    </div>
                    <div className="text-left @md:text-right">
                        <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                            Presupuesto
                        </p>
                        <p className="font-display text-3xl font-bold leading-tight tabular-nums">
                            {numero ? `N° ${formatearNumero(numero)}` : "Borrador"}
                        </p>
                    </div>
                </header>

                {/* ── Para quién y cuándo ── */}
                <div className="mt-9 grid gap-5 @xl:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="ficha rounded-lg p-5 pt-6">
                        <span className="ficha-etiqueta text-ink-black">Para</span>
                        <p className="font-display text-xl font-bold leading-tight">
                            {p.cliente.nombre.trim() || <span className="text-ink-black/35">Nombre del cliente</span>}
                        </p>
                        {p.cliente.negocio.trim() && <p className="mt-0.5 font-bold">{p.cliente.negocio}</p>}
                        {(p.cliente.whatsapp.trim() || p.cliente.email.trim()) && (
                            <p className="mt-1.5 text-sm text-ink-black/70 break-words">
                                {[p.cliente.whatsapp.trim(), p.cliente.email.trim()].filter(Boolean).join(" · ")}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-5 @xl:grid-cols-1 @xl:w-44">
                        <Dato etiqueta="Fecha" valor={formatearFecha(p.fecha)} />
                        <Dato etiqueta="Válido hasta" valor={formatearFecha(sumarDias(p.fecha, p.validezDias))} />
                    </div>
                </div>

                {/* ── Título y mensaje ── */}
                <section className="mt-9">
                    <h2 className="font-display text-2xl font-bold leading-tight @2xl:text-[2rem]">{tituloDe(p)}</h2>
                    {p.mensaje.trim() && (
                        <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed text-ink-black/80 whitespace-pre-line">
                            {p.mensaje}
                        </p>
                    )}
                </section>

                {/* ── Detalle ── */}
                <section className="mt-8 overflow-hidden rounded-lg border-2 border-black">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 bg-ink-black px-5 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white @xl:grid-cols-[minmax(0,1fr)_3.5rem_6.5rem_7rem]">
                        <span>Detalle</span>
                        <span className="hidden text-center @xl:block">Cant.</span>
                        <span className="hidden text-right @xl:block">Precio</span>
                        <span className="text-right">Subtotal</span>
                    </div>

                    {lineas.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-ink-black/45">
                            Elegí un plan o sumá ítems y aparecen acá.
                        </p>
                    ) : (
                        <ul>
                            {lineas.map((l) => (
                                <li
                                    key={l.id}
                                    className="no-cortar grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-t-2 border-black/10 px-5 py-4 first:border-t-0 @xl:grid-cols-[minmax(0,1fr)_3.5rem_6.5rem_7rem]"
                                >
                                    <div className="min-w-0">
                                        <p className="font-display text-base font-bold leading-snug">{l.nombre || "Ítem"}</p>
                                        {l.detalle.trim() && <p className="mt-0.5 text-sm text-ink-black/70">{l.detalle}</p>}
                                        <p className="mt-1 text-xs font-bold text-ink-black/55 tabular-nums @xl:hidden">
                                            {l.cantidad} {l.unidad || (l.cantidad === 1 ? "unidad" : "unidades")} × {formatearPesos(l.precio)}
                                        </p>
                                    </div>
                                    <p className="hidden text-center text-sm font-bold tabular-nums @xl:block">
                                        {l.cantidad}
                                        {l.unidad && <span className="block text-[11px] font-medium leading-tight text-ink-black/55">{l.unidad}</span>}
                                    </p>
                                    <p className="hidden text-right text-sm font-bold tabular-nums @xl:block">{formatearPesos(l.precio)}</p>
                                    <p className="text-right font-display text-base font-bold tabular-nums">
                                        {formatearPesos(l.cantidad * l.precio)}
                                    </p>
                                    {/* Ocupa la fila entera: metida en la columna del nombre, al lado
                                        de cantidad y precios, cada renglón se partía en dos o tres. */}
                                    {l.incluye.filter((i) => i.trim()).length > 0 && (
                                        <ul className="col-span-full mt-3 grid gap-x-6 gap-y-1.5 @lg:grid-cols-2 @3xl:grid-cols-3">
                                            {l.incluye
                                                .filter((i) => i.trim())
                                                .map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[13px] leading-snug">
                                                        <Tilde />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* ── Total ── */}
                <section className="no-cortar mt-6 flex flex-col-reverse gap-6 @2xl:flex-row @2xl:items-center @2xl:justify-between">
                    <div className="flex-1">
                        {p.garantia.trim() && (
                            <p className="sello max-w-[23rem] bg-white text-[13px] text-primary">{p.garantia}</p>
                        )}
                    </div>
                    <dl className="w-full space-y-1.5 @2xl:w-80">
                        {hayAjustes && <Fila etiqueta="Subtotal" valor={formatearPesos(t.subtotal)} />}
                        {t.descuento > 0 && (
                            <Fila
                                etiqueta={`Descuento${p.descuento.modo === "porcentaje" ? ` ${p.descuento.valor}%` : ""}${p.descuento.motivo.trim() ? ` · ${p.descuento.motivo.trim()}` : ""}`}
                                valor={`−${formatearPesos(t.descuento)}`}
                            />
                        )}
                        {t.recargo > 0 && (
                            <Fila
                                etiqueta={`${p.recargo.etiqueta.trim() || "Recargo"} ${p.recargo.porcentaje}%`}
                                valor={formatearPesos(t.recargo)}
                            />
                        )}
                        <div className="mt-3 flex items-baseline justify-between gap-4 rounded-lg border-2 border-black bg-accent-yellow px-4 py-3 shadow-neobrutalism">
                            <dt className="font-display text-xs font-bold uppercase tracking-[0.16em]">Total</dt>
                            <dd className="font-display text-3xl font-bold tabular-nums leading-none">{formatearPesos(t.total)}</dd>
                        </div>
                        <p className="pt-1 text-right text-xs font-medium text-ink-black/60">Pago único, en pesos argentinos</p>
                    </dl>
                </section>

                {/* ── Cómo se paga y cuándo está ── */}
                {/* pt-3 y no solo margen: la etiqueta de la ficha sobresale del borde, y si la
                    página se corta justo acá tiene que quedar adentro del bloque que no se parte. */}
                <section className="no-cortar mt-6 grid gap-6 pt-3 @xl:grid-cols-2">
                    <div className="ficha rounded-lg p-5 pt-7">
                        <span className="ficha-etiqueta text-ink-black">Cómo se paga</span>
                        <div className="space-y-2.5">
                            {t.sena > 0 && t.saldo > 0 ? (
                                <>
                                    <Paso numero={1} texto={`Seña para arrancar (${p.senaPorcentaje}%)`} monto={t.sena} />
                                    <Paso numero={2} texto="Al entregar, antes de publicar" monto={t.saldo} />
                                </>
                            ) : (
                                <Paso numero={1} texto={p.senaPorcentaje >= 100 ? "Pago total para arrancar" : "Pago total al entregar"} monto={t.total} />
                            )}
                        </div>
                        {p.mediosDePago.trim() && <p className="mt-3.5 text-sm text-ink-black/70">{p.mediosDePago}</p>}
                    </div>
                    <div className="ficha rounded-lg p-5 pt-7">
                        <span className="ficha-etiqueta text-ink-black">Plazo de entrega</span>
                        <p className="font-display text-2xl font-bold leading-tight">
                            {p.plazo.trim() || <span className="text-ink-black/35">A definir</span>}
                        </p>
                        <p className="mt-1.5 text-sm text-ink-black/70">
                            En días hábiles, desde que recibimos la seña y el material.
                        </p>
                    </div>
                </section>

                {/* ── Mantenimiento opcional ── */}
                {mensuales.length > 0 && (
                    <div className="no-cortar mt-3 pt-3">
                        <section
                            className="ficha rounded-lg bg-background-light p-5 pt-7"
                            style={{ "--ficha-fondo": "#f7f6f8" } as CSSProperties}
                        >
                            <span className="ficha-etiqueta text-ink-black">Mantenimiento mensual · opcional</span>
                            <ul className="space-y-3">
                                {mensuales.map((m) => (
                                    <li key={m.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-display font-bold">{m.nombre}</p>
                                            {m.detalle.trim() && <p className="text-sm text-ink-black/70">{m.detalle}</p>}
                                        </div>
                                        <p className="font-display text-xl font-bold tabular-nums">
                                            {formatearPesos(m.precio)}
                                            <span className="text-sm font-bold text-ink-black/60">/mes</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-xs font-bold text-ink-black/60">No es obligatorio y lo cancelás cuando quieras.</p>
                        </section>
                    </div>
                )}

                {/* ── Lo que ponés vos y condiciones ── */}
                {(aporta.length > 0 || condiciones.length > 0) && (
                    <section className="mt-9 grid gap-8 @2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                        {aporta.length > 0 && (
                            <div className="no-cortar">
                                <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-black/60">
                                    Lo que ponés vos
                                </h3>
                                <ol className="mt-3 space-y-2">
                                    {aporta.map((a, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm font-bold leading-snug">
                                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-sm border-2 border-black bg-white font-display text-[11px] leading-none">
                                                {i + 1}
                                            </span>
                                            {a}
                                        </li>
                                    ))}
                                </ol>
                                <p className="mt-3 text-sm text-ink-black/70">Del resto nos encargamos nosotros.</p>
                            </div>
                        )}
                        {condiciones.length > 0 && (
                            <div>
                                <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-black/60">
                                    Condiciones
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {condiciones.map((c, i) => (
                                        <li key={i} className="no-cortar flex items-start gap-2.5 text-[13px] leading-snug text-ink-black/80">
                                            <span aria-hidden="true" className="mt-[5px] h-2 w-2 shrink-0 border-2 border-black bg-primary" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}

                {p.notas.trim() && (
                    <section className="no-cortar mt-8 rounded-lg border-2 border-dashed border-black/30 p-4">
                        <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-black/60">Notas</h3>
                        <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">{p.notas}</p>
                    </section>
                )}

                {/* ── Pie ── */}
                <footer className="no-cortar mt-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t-2 border-black pt-4 text-xs">
                    <p className="font-display text-sm font-bold">Nosotros nos encargamos de todo.</p>
                    <p className="text-ink-black/70">
                        {[whatsapp && `WhatsApp ${whatsapp}`, empresa.email, empresa.web].filter(Boolean).join("  ·  ")}
                    </p>
                </footer>
            </div>
        </article>
    );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    return (
        <div className="ficha rounded-lg px-4 pb-3 pt-4">
            <span className="ficha-etiqueta left-3! text-[11px]! text-ink-black">{etiqueta}</span>
            <p className="font-display text-base font-bold tabular-nums">{valor}</p>
        </div>
    );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 px-1 text-sm">
            <dt className="text-ink-black/70">{etiqueta}</dt>
            <dd className="font-bold tabular-nums">{valor}</dd>
        </div>
    );
}

function Paso({ numero, texto, monto }: { numero: number; texto: string; monto: number }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <p className="flex items-baseline gap-2 text-sm font-bold">
                <span className="font-display text-xs text-primary">{numero}.</span>
                {texto}
            </p>
            <p className="font-display text-lg font-bold tabular-nums">{formatearPesos(monto)}</p>
        </div>
    );
}

function Tilde() {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-px h-4 w-4 shrink-0">
            <rect x="1" y="1" width="14" height="14" rx="2" fill="#A0E8AF" stroke="#1A1A1A" strokeWidth="2" />
            <path d="M4.5 8.2 7 10.5l4.5-5" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** El isotipo de app/icon.svg, estático: el LogikaLogo animado arranca invisible y no sirve para imprimir. */
function MarcaLogika() {
    return (
        <div className="flex items-center gap-2.5">
            <svg aria-hidden="true" viewBox="12 12 72 72" className="h-10 w-10">
                <defs>
                    <clipPath id="hoja-trama">
                        <rect x="45" y="0" width="60" height="100" />
                    </clipPath>
                </defs>
                <rect x="22" y="22" width="62" height="62" rx="6" fill="#1A1A1A" />
                <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
                <rect x="14" y="14" width="22" height="62" rx="6" fill="#4A90FF" stroke="#1A1A1A" strokeWidth="4" />
                <rect x="14" y="54" width="62" height="22" rx="6" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="4" />
                <rect x="54" y="14" width="22" height="62" rx="6" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" />
                <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" clipPath="url(#hoja-trama)" />
            </svg>
            <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight">
                Logika<span className="text-hot-coral">.</span>
            </p>
        </div>
    );
}

/** 5492284638361 -> +54 9 2284 638361 */
function formatearTelefono(numero: string): string {
    const d = numero.replace(/\D/g, "");
    if (!d) return "";
    if (d.startsWith("549") && d.length === 13) return `+54 9 ${d.slice(3, 7)} ${d.slice(7)}`;
    return `+${d}`;
}
