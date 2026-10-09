"use client";

import { useState } from "react";
import type { FilaSuscripcion } from "@/lib/mercadopago";
import { formatearPesos } from "@/lib/precios";
import { escribir } from "../presupuestos/api";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, Campo, PesosInput } from "../presupuestos/controles";
import { formatearFecha, hoyISO, normalizarWhatsApp } from "../presupuestos/modelo";
import { nombreMes, type CargoMp, type CobroMp, type Mensual } from "./cuentas";

/**
 * Mercado Pago en Clientes.
 *
 * - CobroAutomatico: el mantenimiento mensual. Se genera un link con el mail de la
 *   cuenta del cliente, se lo manda una vez y, cuando carga la tarjeta, Mercado
 *   Pago cobra solo: cada cobro llega por aviso y aparece como cuota del mes.
 * - LinksDePago: los links para pagar una vez la seña, el saldo o lo que se elija.
 *   Se generan desde "Registrar un pago" y el pago aparece solo en los del proyecto.
 *
 * En los dos casos un pago se registra cuando Mercado Pago lo confirma, nunca
 * porque el cliente vuelva a la web.
 */

export type SuscripcionGuardada = FilaSuscripcion & { created_at: string };

/** Como se guarda en mp_links. */
export interface LinkGuardado {
    id: string;
    quote_id: string;
    concept: string;
    amount: number;
    link: string;
    /** open | paid | void */
    status: string;
    expires_at: string | null;
    created_at: string;
}

const ESTADOS: Record<string, { texto: string; clase: string }> = {
    pending: { texto: "Esperando que cargue la tarjeta", clase: "text-accent-yellow" },
    authorized: { texto: "✓ Se cobra solo", clase: "text-secondary" },
    paused: { texto: "En pausa en Mercado Pago", clase: "text-accent-yellow" },
};

interface Contacto {
    nombre: string;
    whatsapp: string;
    email: string;
}

interface Props {
    suscripcion: SuscripcionGuardada | null;
    cobrosMp: CobroMp[];
    m: Mensual;
    mes: string;
    quoteId: string;
    contacto: Contacto;
    conectado: boolean;
    onSuscripcion: (s: SuscripcionGuardada) => void;
    onCobros: (cobros: CobroMp[]) => void;
    avisar: (texto: string) => void;
    fallar: (texto: string) => void;
}

/** Sin número, wa.me abre WhatsApp para elegir el contacto. */
const enlaceWhatsApp = (whatsapp: string, texto: string) => `https://wa.me/${normalizarWhatsApp(whatsapp)}?text=${encodeURIComponent(texto)}`;
const hola = (c: Contacto) => `Hola${c.nombre.trim() ? ` ${c.nombre.trim().split(/\s+/)[0]}` : ""}!`;
const fechaArgentina = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

/** Si debe este mes (o antes), que cobre apenas cargue la tarjeta; si ya pagó, desde el mes que le toca, el mismo día. */
function primerCobro(m: Mensual, mes: string): string {
    const hoy = hoyISO();
    if (m.proximo <= mes) return hoy;
    // El 29, el 30 y el 31 no existen todos los meses.
    return `${m.proximo}-${String(Math.min(Number(hoy.slice(8, 10)), 28)).padStart(2, "0")}`;
}

export default function CobroAutomatico(p: Props) {
    const [ocupado, setOcupado] = useState(false);
    const s = p.suscripcion && p.suscripcion.status !== "cancelled" ? p.suscripcion : null;

    // El último aviso fue un rechazo y ese mes no se cobró por otro lado.
    const ultimo = [...p.cobrosMp].sort((a, b) => b.paid_on.localeCompare(a.paid_on))[0];
    const rechazado = ultimo?.status === "rejected" && !p.cobrosMp.some((c) => c.month === ultimo.month && c.status === "approved") ? ultimo : null;

    async function pedir(cuerpo: Record<string, unknown>, ok: string) {
        setOcupado(true);
        try {
            const r = await escribir<{ suscripcion?: SuscripcionGuardada | null; cobros?: CobroMp[] }>("mercadopago", "POST", cuerpo);
            if (r.suscripcion) p.onSuscripcion(r.suscripcion);
            if (r.cobros) p.onCobros(r.cobros);
            p.avisar(ok);
        } catch (e) {
            p.fallar(e instanceof Error ? e.message : "No se pudo hablar con Mercado Pago");
        } finally {
            setOcupado(false);
        }
    }

    function cancelar(id: string) {
        if (!confirm(`¿Cancelar el cobro automático? Mercado Pago deja de cobrarle${p.contacto.nombre.trim() ? ` a ${p.contacto.nombre.trim()}` : ""}.`)) return;
        void pedir({ accion: "cancelar", id }, "Cobro automático cancelado");
    }

    if (!p.conectado) {
        return (
            <p className="rounded-sm border border-dashed border-white/15 px-3 py-2 text-xs text-gray-400">
                Para que se cobre solo con Mercado Pago, falta conectarlo. Los pasos están en tus tareas (TUS-TAREAS.md).
            </p>
        );
    }

    return (
        <div className={`space-y-3 rounded-sm border border-white/10 bg-black/20 p-3 ${ocupado ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Cobro automático · Mercado Pago</p>
                {s && <span className={`text-xs font-bold ${ESTADOS[s.status]?.clase ?? "text-gray-300"}`}>{ESTADOS[s.status]?.texto ?? s.status}</span>}
            </div>

            {rechazado && (
                <div className="space-y-2 rounded-sm border border-hot-coral/40 bg-hot-coral/10 p-3">
                    <p className="text-sm font-bold text-hot-coral">
                        Mercado Pago no pudo cobrar {nombreMes(rechazado.month)} (intento del {formatearFecha(rechazado.paid_on)}).
                    </p>
                    <p className="text-xs text-white/70">Lo reintenta hasta 4 veces en 10 días. Si se rechazan 3 cuotas, Mercado Pago da de baja la suscripción.</p>
                    <a
                        href={enlaceWhatsApp(
                            p.contacto.whatsapp,
                            `${hola(p.contacto)} Mercado Pago no pudo cobrar el mantenimiento de ${nombreMes(rechazado.month)} con tu tarjeta. ¿Podés revisarla, o elegir otra desde Mercado Pago? Lo vuelve a intentar en los próximos días. ¡Gracias!`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={BOTON_SECUNDARIO}
                    >
                        <span aria-hidden="true" className="material-icons text-lg">chat</span>
                        Avisarle por WhatsApp
                    </a>
                </div>
            )}

            {!s ? (
                <FormLink
                    key={`${p.m.proximo}-${p.m.cuota}`}
                    m={p.m}
                    mes={p.mes}
                    email={p.contacto.email}
                    cancelada={p.suscripcion?.status === "cancelled"}
                    ocupado={ocupado}
                    onCrear={(d) => pedir({ accion: "crear", quoteId: p.quoteId, ...d }, "Link listo. Mandáselo por WhatsApp.")}
                />
            ) : s.status === "pending" ? (
                <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                        Link para <strong className="text-white">{s.payer_email}</strong> · {formatearPesos(s.amount)} por mes. Que entre con esa cuenta de Mercado Pago.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={enlaceWhatsApp(
                                p.contacto.whatsapp,
                                `${hola(p.contacto)} Para que el mantenimiento de tu web se pague solo todos los meses, entrá a este link con tu cuenta de Mercado Pago (${s.payer_email}) y elegí tu tarjeta:\n${s.link}\n\nSon ${formatearPesos(s.amount)} por mes y lo podés cancelar cuando quieras desde Mercado Pago.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={BOTON_PRIMARIO}
                        >
                            <span aria-hidden="true" className="material-icons text-lg">chat</span>
                            Mandar por WhatsApp
                        </a>
                        <button
                            type="button"
                            className={BOTON_SECUNDARIO}
                            onClick={() =>
                                navigator.clipboard.writeText(s.link).then(
                                    () => p.avisar("Link copiado"),
                                    () => p.fallar("No se pudo copiar el link. Probá de nuevo.")
                                )
                            }
                        >
                            <span aria-hidden="true" className="material-icons text-lg">content_copy</span>
                            Copiar link
                        </button>
                        <button type="button" disabled={ocupado} onClick={() => pedir({ accion: "revisar", id: s.id }, "Revisado en Mercado Pago")} className={BOTON_SECUNDARIO}>
                            ¿Ya la cargó? Revisar
                        </button>
                    </div>
                    <button type="button" disabled={ocupado} onClick={() => cancelar(s.id)} className="text-xs font-bold text-gray-500 hover:text-hot-coral">
                        Cancelar el link (por ejemplo, si el mail estaba mal)
                    </button>
                </div>
            ) : (
                <Activa
                    key={s.amount}
                    s={s}
                    ocupado={ocupado}
                    onMonto={(monto) => {
                        if (confirm(`¿Cobrarle ${formatearPesos(monto)} por mes desde el próximo cobro?`)) void pedir({ accion: "monto", id: s.id, monto }, "Monto actualizado en Mercado Pago");
                    }}
                    onRevisar={() => pedir({ accion: "revisar", id: s.id }, "Revisado en Mercado Pago")}
                    onCancelar={() => cancelar(s.id)}
                />
            )}
        </div>
    );
}

function FormLink({
    m,
    mes,
    email: emailInicial,
    cancelada,
    ocupado,
    onCrear,
}: {
    m: Mensual;
    mes: string;
    email: string;
    cancelada: boolean;
    ocupado: boolean;
    onCrear: (d: { email: string; monto: number; inicio: string }) => void;
}) {
    const hoy = hoyISO();
    const [email, setEmail] = useState(emailInicial);
    const [monto, setMonto] = useState(m.cuota);
    const [inicio, setInicio] = useState(() => primerCobro(m, mes));

    return (
        <form
            aria-label="Generar link de cobro automático"
            onSubmit={(e) => {
                e.preventDefault();
                onCrear({ email: email.trim(), monto, inicio });
            }}
            className="space-y-2"
        >
            <p className="text-sm text-gray-300">
                Generá un link y mandáselo una vez: entra con su cuenta de Mercado Pago, elige la tarjeta y desde ahí se cobra solo todos los meses.
                {cancelada && " El anterior quedó cancelado."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
                <Campo etiqueta="Mail de su Mercado Pago" className="sm:min-w-0 sm:flex-1 sm:basis-56">
                    <input
                        type="email"
                        required
                        className="admin-input w-full py-1.5! text-sm"
                        value={email}
                        placeholder="El mail con el que entra a Mercado Pago"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Campo>
                <Campo etiqueta="Por mes" className="sm:w-36">
                    <PesosInput etiqueta="Monto por mes" valor={monto} onChange={setMonto} />
                </Campo>
                <Campo etiqueta="Primer cobro" className="sm:w-40">
                    <input
                        type="date"
                        min={hoy}
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value || hoy)}
                        className="admin-input w-full py-1.5! text-sm [color-scheme:dark]"
                    />
                </Campo>
                <button type="submit" disabled={ocupado || monto <= 0 || !email.trim()} className={BOTON_PRIMARIO}>
                    Generar link
                </button>
            </div>
            <p className="text-xs text-gray-500">
                {inicio <= hoy ? "Se cobra apenas carga la tarjeta, y después todos los meses ese día." : `Se cobra el ${formatearFecha(inicio)}, y después todos los meses ese día.`} El
                mail tiene que ser el de su cuenta de Mercado Pago: si no coincide, no lo deja pagar.
            </p>
        </form>
    );
}

function Activa({
    s,
    ocupado,
    onMonto,
    onRevisar,
    onCancelar,
}: {
    s: SuscripcionGuardada;
    ocupado: boolean;
    onMonto: (monto: number) => void;
    onRevisar: () => void;
    onCancelar: () => void;
}) {
    const [nuevo, setNuevo] = useState(s.amount);

    return (
        <div className="space-y-2">
            <p className="text-sm text-gray-300">
                <strong className="text-white tabular-nums">{formatearPesos(s.amount)}</strong> por mes a {s.payer_email}
                {s.status === "authorized" && s.next_payment_date ? ` · próximo cobro el ${fechaArgentina(s.next_payment_date)}` : ""}.
            </p>
            <form
                aria-label="Actualizar el monto"
                onSubmit={(e) => {
                    e.preventDefault();
                    onMonto(nuevo);
                }}
                className="flex flex-wrap items-center gap-2"
            >
                <PesosInput etiqueta="Nuevo monto por mes" valor={nuevo} onChange={setNuevo} className="w-36" />
                <button type="submit" disabled={ocupado || nuevo <= 0 || nuevo === s.amount} className={BOTON_SECUNDARIO}>
                    Actualizar monto
                </button>
                <button type="button" disabled={ocupado} onClick={onRevisar} className={BOTON_SECUNDARIO}>
                    Revisar en Mercado Pago
                </button>
            </form>
            <button type="button" disabled={ocupado} onClick={onCancelar} className="text-xs font-bold text-gray-500 hover:text-hot-coral">
                Cancelar cobro automático
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Links para pagar una vez
   ───────────────────────────────────────────────────────────── */

/** El estado del link según el último intento de pago que avisó Mercado Pago. */
function estadoDeLink(intentos: CargoMp[]): { texto: string; clase: string } {
    const ultimo = [...intentos].sort((a, b) => b.paid_on.localeCompare(a.paid_on))[0];
    if (!ultimo) return { texto: "Esperando el pago", clase: "text-accent-yellow" };
    if (ultimo.status === "rejected") return { texto: "Le rechazaron el último intento: puede probar de nuevo con el mismo link", clase: "text-hot-coral" };
    if (ultimo.status === "approved") return { texto: "✓ Pagado", clase: "text-secondary" };
    return { texto: "Pago en proceso: Mercado Pago todavía no lo aprobó", clase: "text-accent-yellow" };
}

/** Los links sin usar de un trabajo, con lo necesario para mandarlos, revisarlos o anularlos. */
export function LinksDePago({
    links,
    cargosMp,
    contacto,
    onLink,
    onPagos,
    avisar,
    fallar,
}: {
    links: LinkGuardado[];
    cargosMp: CargoMp[];
    contacto: Contacto;
    onLink: (link: LinkGuardado) => void;
    onPagos: (pagos: CargoMp[]) => void;
    avisar: (texto: string) => void;
    fallar: (texto: string) => void;
}) {
    const [ocupado, setOcupado] = useState<string | null>(null);
    const abiertos = links.filter((l) => l.status === "open");
    if (abiertos.length === 0) return null;

    async function pedir(l: LinkGuardado, accion: "anular" | "revisarLink", ok: string) {
        setOcupado(l.id);
        try {
            const r = await escribir<{ link?: LinkGuardado; pagosMp?: CargoMp[] }>("mercadopago", "POST", { accion, id: l.id });
            if (r.pagosMp) onPagos(r.pagosMp);
            if (r.link) onLink(r.link);
            avisar(ok);
        } catch (e) {
            fallar(e instanceof Error ? e.message : "No se pudo hablar con Mercado Pago");
        } finally {
            setOcupado(null);
        }
    }

    return (
        <ul aria-label="Links de pago de Mercado Pago" className="space-y-2">
            {abiertos.map((l) => {
                const estado = estadoDeLink(cargosMp.filter((c) => c.link_id === l.id));
                const mensaje = `${hola(contacto)} Te paso el link para pagar con Mercado Pago: ${l.concept} de tu web, ${formatearPesos(l.amount)}.\n${l.link}\n\nPodés pagar con tarjeta o con tu cuenta de Mercado Pago. ¡Gracias!`;
                return (
                    <li key={l.id} className={`space-y-2 rounded-sm border border-[#00b1ea]/30 bg-[#00b1ea]/5 p-3 ${ocupado === l.id ? "opacity-60" : ""}`}>
                        <div>
                            <p className="text-sm text-white">
                                <strong className="tabular-nums">{formatearPesos(l.amount)}</strong> · {l.concept}
                                <span className="text-xs text-gray-400"> · link de Mercado Pago{l.expires_at ? `, vence el ${fechaArgentina(l.expires_at)}` : ""}</span>
                            </p>
                            <p className={`text-xs font-bold ${estado.clase}`}>{estado.texto}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a href={enlaceWhatsApp(contacto.whatsapp, mensaje)} target="_blank" rel="noopener noreferrer" className={BOTON_PRIMARIO}>
                                <span aria-hidden="true" className="material-icons text-lg">chat</span>
                                Mandar por WhatsApp
                            </a>
                            <button
                                type="button"
                                className={BOTON_SECUNDARIO}
                                onClick={() =>
                                    navigator.clipboard.writeText(l.link).then(
                                        () => avisar("Link copiado"),
                                        () => fallar("No se pudo copiar el link. Probá de nuevo.")
                                    )
                                }
                            >
                                <span aria-hidden="true" className="material-icons text-lg">content_copy</span>
                                Copiar link
                            </button>
                            <button type="button" disabled={ocupado === l.id} onClick={() => pedir(l, "revisarLink", "Revisado en Mercado Pago")} className={BOTON_SECUNDARIO}>
                                ¿Ya pagó? Revisar
                            </button>
                        </div>
                        <button
                            type="button"
                            disabled={ocupado === l.id}
                            onClick={() => {
                                if (confirm(`¿Anular el link de ${formatearPesos(l.amount)}? Ya no se va a poder pagar.`)) void pedir(l, "anular", "Link anulado");
                            }}
                            className="text-xs font-bold text-gray-500 hover:text-hot-coral"
                        >
                            Anular el link
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
