"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatearPesos } from "@/lib/precios";
import { escribir } from "../presupuestos/api";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, Campo, PesosInput } from "../presupuestos/controles";
import {
    ESTADOS,
    calcularTotales,
    formatearFecha,
    formatearNumero,
    hoyISO,
    normalizar,
    normalizarWhatsApp,
    nuevoId,
    type EstadoPresupuesto,
    type PresupuestoGuardado,
} from "../presupuestos/modelo";
import {
    ESTADOS_COBRO,
    mesDeHoy,
    mismoCliente,
    nombreDe,
    nombreMes,
    resumenDe,
    sumarMeses,
    trabajoDe,
    type Cliente,
    type Contacto,
    type Costo,
    type EstadoCobro,
    type Mensual,
    type Pago,
    type Trabajo,
} from "./cuentas";
import CobroAutomatico, { LinksDePago, type LinkGuardado, type SuscripcionGuardada } from "./MercadoPago";

/**
 * Clientes: quién compró, cuánto pagó, cuánto falta y cuánto deja cada trabajo.
 *
 * Un presupuesto entra en las cuentas cuando está aceptado o tiene algún pago.
 * Los pagos, las cuotas y los costos se guardan apenas se agregan; los datos del
 * cliente, con su botón.
 */

const SQL = "supabase/clientes-2026-10-07.sql";

type Filtro = "todos" | "deben" | "pagados";
type T = Trabajo<PresupuestoGuardado>;

const contactoVacio = (): Contacto => ({ name: "", business: "", whatsapp: "", email: "" });

/** Mercado Pago: `listo` si ya están sus tablas; `conectado` si el servidor tiene el Access Token. */
export interface EstadoMp {
    listo: boolean;
    conectado: boolean;
}

interface Props {
    listo: boolean;
    clientes: Cliente[];
    presupuestos: PresupuestoGuardado[];
    suscripciones: SuscripcionGuardada[];
    links: LinkGuardado[];
    mp: EstadoMp;
}

export default function Clientes({
    listo,
    clientes: clientesIniciales,
    presupuestos: presupuestosIniciales,
    suscripciones: suscripcionesIniciales,
    links: linksIniciales,
    mp,
}: Props) {
    const [clientes, setClientes] = useState(clientesIniciales);
    const [presupuestos, setPresupuestos] = useState(presupuestosIniciales);
    const [suscripciones, setSuscripciones] = useState(suscripcionesIniciales);
    const [links, setLinks] = useState(linksIniciales);
    const [mes] = useState(mesDeHoy);
    const [abierto, setAbierto] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState<Filtro>("todos");
    const [nuevo, setNuevo] = useState<Contacto | null>(null);
    const [ocupado, setOcupado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const temporizador = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(temporizador.current), []);

    function avisar(texto: string) {
        setAviso(texto);
        window.clearTimeout(temporizador.current);
        temporizador.current = window.setTimeout(() => setAviso(null), 2600);
    }

    const fallo = (e: unknown, texto: string) => setError(e instanceof Error ? e.message : texto);

    /* ── Escrituras ──────────────────────────────────────── */

    async function actualizar(q: PresupuestoGuardado, cambios: Partial<PresupuestoGuardado>, ok: string) {
        setOcupado(q.id);
        setError(null);
        try {
            const fila = await escribir<PresupuestoGuardado>("quotes", "PUT", { id: q.id, ...cambios });
            // La fila de quotes no trae los cobros de Mercado Pago: se conservan los que ya estaban.
            setPresupuestos((lista) =>
                lista.map((x) => (x.id === q.id ? { ...fila, total: Number(fila.total), mp_payments: x.mp_payments, mp_charges: x.mp_charges } : x))
            );
            avisar(ok);
        } catch (e) {
            fallo(e, "No se pudo guardar el cambio");
        } finally {
            setOcupado(null);
        }
    }

    /** Cobrar algo es aceptar el presupuesto: si no lo estaba, se marca en el mismo paso. */
    function agregarPago(t: T, pago: Omit<Pago, "id">) {
        const pagos = [...t.todos, { ...pago, id: nuevoId() }].sort((a, b) => a.fecha.localeCompare(b.fecha));
        const aceptar = t.q.status !== "aceptado";
        const que = pago.mes ? `Cuota de ${nombreMes(pago.mes)} registrada` : `Pago de ${formatearPesos(pago.monto)} registrado`;
        void actualizar(t.q, aceptar ? { payments: pagos, status: "aceptado" } : { payments: pagos }, `${que}${aceptar ? " · presupuesto aceptado" : ""}`);
    }

    function quitarPago(t: T, pago: Pago) {
        const que = pago.mes ? `la cuota de ${nombreMes(pago.mes)}` : `el pago de ${formatearPesos(pago.monto)}${pago.fecha ? ` del ${formatearFecha(pago.fecha)}` : ""}`;
        if (!confirm(`¿Borrar ${que}?`)) return;
        void actualizar(t.q, { payments: t.todos.filter((p) => p.id !== pago.id) }, pago.mes ? "Cuota borrada" : "Pago borrado");
    }

    async function crearCliente(datos: Contacto) {
        const existente = clientes.find((c) => mismoCliente(c, datos));
        if (existente) {
            setNuevo(null);
            setAbierto(existente.id);
            avisar(`Ya estaba en la lista como ${nombreDe(existente)}`);
            return;
        }
        setOcupado("nuevo");
        setError(null);
        try {
            const creado = await escribir<Cliente>("clients", "POST", datos);
            setClientes((lista) => [...lista, creado]);
            setNuevo(null);
            setAbierto(creado.id);
            avisar("Cliente creado");
        } catch (e) {
            fallo(e, "No se pudo crear el cliente");
        } finally {
            setOcupado(null);
        }
    }

    async function guardarCliente(c: Cliente, datos: Contacto & { notes: string }) {
        setOcupado(c.id);
        setError(null);
        try {
            const fila = await escribir<Cliente>("clients", "PUT", { id: c.id, ...datos });
            setClientes((lista) => lista.map((x) => (x.id === c.id ? fila : x)));
            avisar("Datos guardados");
        } catch (e) {
            fallo(e, "No se pudieron guardar los datos");
        } finally {
            setOcupado(null);
        }
    }

    async function borrarCliente(c: Cliente) {
        if (!confirm(`¿Borrar a ${nombreDe(c)}? Sus presupuestos no se borran: quedan sin cliente.`)) return;
        setError(null);
        try {
            await escribir("clients", "DELETE", { id: c.id });
            setClientes((lista) => lista.filter((x) => x.id !== c.id));
            // La base ya les puso client_id en null (ON DELETE SET NULL).
            setPresupuestos((lista) => lista.map((q) => (q.client_id === c.id ? { ...q, client_id: null } : q)));
            avisar("Cliente borrado");
        } catch (e) {
            fallo(e, "No se pudo borrar el cliente");
        }
    }

    /* ── Derivados ───────────────────────────────────────── */

    const trabajos = presupuestos.map((q) => trabajoDe(q, calcularTotales(normalizar(q.data)), mes));
    const general = resumenDe(trabajos, mes);
    const ids = new Set(clientes.map((c) => c.id));
    const sueltos = trabajos.filter((t) => !t.q.client_id || !ids.has(t.q.client_id));
    const texto = busqueda.trim().toLowerCase();
    const filas = clientes
        .map((c) => {
            const suyos = trabajos.filter((t) => t.q.client_id === c.id);
            return { c, suyos, s: resumenDe(suyos, mes) };
        })
        .filter(({ c }) => !texto || `${c.name} ${c.business} ${c.whatsapp} ${c.email}`.toLowerCase().includes(texto))
        .filter(({ s }) => filtro === "todos" || (filtro === "deben" ? s.falta > 0 : s.trabajos > 0 && s.falta === 0))
        .sort((a, b) => b.s.falta - a.s.falta || nombreDe(a.c).localeCompare(nombreDe(b.c), "es"));

    /** La que está en curso; si no hay, la última (para decir que se canceló). */
    const suscripcionDe = (quoteId: string) => {
        const suyas = suscripciones.filter((s) => s.quote_id === quoteId).sort((a, b) => b.created_at.localeCompare(a.created_at));
        return suyas.find((s) => s.status !== "cancelled") ?? suyas[0] ?? null;
    };

    /** Para los mensajes de WhatsApp: la ficha del cliente y, si no tiene, lo que dice el presupuesto. */
    const contactoDe = (q: PresupuestoGuardado) => {
        const c = clientes.find((x) => x.id === q.client_id);
        const d = q.data?.cliente;
        return { nombre: c?.name || d?.nombre || "", whatsapp: c?.whatsapp || d?.whatsapp || "", email: c?.email || d?.email || "" };
    };

    const cobroAutomatico = (t: T) => {
        const s = suscripcionDe(t.q.id);
        if (!mp.listo || !t.mensual || !(t.activo || (s && s.status !== "cancelled"))) return null;
        return (
            <CobroAutomatico
                suscripcion={s}
                cobrosMp={t.cobrosMp}
                m={t.mensual}
                mes={mes}
                quoteId={t.q.id}
                contacto={contactoDe(t.q)}
                conectado={mp.conectado}
                onSuscripcion={(nueva) => setSuscripciones((lista) => [nueva, ...lista.filter((x) => x.id !== nueva.id)])}
                onCobros={(cobros) => setPresupuestos((lista) => lista.map((x) => (x.id === t.q.id ? { ...x, mp_payments: cobros } : x)))}
                avisar={avisar}
                fallar={(texto) => setError(texto)}
            />
        );
    };

    /** Un link de Mercado Pago para pagar una vez, por el monto y con el concepto del formulario de pago. */
    async function cobrarMp(t: T, d: { monto: number; nota: string }) {
        setOcupado(t.q.id);
        setError(null);
        try {
            const r = await escribir<{ link: LinkGuardado }>("mercadopago", "POST", { accion: "cobrar", quoteId: t.q.id, monto: d.monto, concepto: d.nota });
            setLinks((lista) => [r.link, ...lista]);
            avisar("Link listo: mandáselo por WhatsApp");
        } catch (e) {
            fallo(e, "No se pudo generar el link");
        } finally {
            setOcupado(null);
        }
    }

    const cobraConMp = mp.listo && mp.conectado;

    const linksMp = (t: T) =>
        cobraConMp ? (
            <LinksDePago
                links={links.filter((l) => l.quote_id === t.q.id)}
                cargosMp={t.cargosMp}
                contacto={contactoDe(t.q)}
                onLink={(l) => setLinks((lista) => lista.map((x) => (x.id === l.id ? l : x)))}
                onPagos={(pagos) => setPresupuestos((lista) => lista.map((x) => (x.id === t.q.id ? { ...x, mp_charges: pagos } : x)))}
                avisar={avisar}
                fallar={(texto) => setError(texto)}
            />
        ) : null;

    const tarjeta = (t: T) => (
        <TarjetaTrabajo
            key={t.q.id}
            t={t}
            mes={mes}
            clientes={clientes}
            automatico={cobroAutomatico(t)}
            linksMp={linksMp(t)}
            onCobrarMp={cobraConMp ? (d) => cobrarMp(t, d) : undefined}
            ocupado={ocupado === t.q.id}
            onEstado={(status) => actualizar(t.q, { status }, `N° ${formatearNumero(t.q.number)} marcado como ${status}`)}
            onCliente={(client_id) => actualizar(t.q, { client_id }, client_id ? "Presupuesto asignado" : "Presupuesto sin cliente")}
            onPago={(pago) => agregarPago(t, pago)}
            onQuitarPago={(pago) => quitarPago(t, pago)}
            onCostos={(costs, ok) => actualizar(t.q, { costs }, ok)}
            onMensual={(monthly_active) => actualizar(t.q, { monthly_active }, monthly_active ? "Mantenimiento contratado" : "Mantenimiento dado de baja")}
        />
    );

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-body text-3xl font-black text-white">👥 Clientes</h1>
                    <p className="mt-1 text-gray-400">Quién te compró, cuánto te pagó y cuánto falta cobrar.</p>
                </div>
                {listo && (
                    <button type="button" onClick={() => setNuevo((v) => (v ? null : contactoVacio()))} aria-expanded={nuevo !== null} className={BOTON_PRIMARIO}>
                        <span aria-hidden="true" className="material-icons text-lg">person_add</span>
                        Nuevo cliente
                    </button>
                )}
            </div>

            {!listo && (
                <div role="note" className="flex items-start gap-3 rounded-sm border-2 border-accent-yellow/60 bg-accent-yellow/10 p-4">
                    <span aria-hidden="true" className="material-icons text-accent-yellow">construction</span>
                    <div className="text-sm">
                        <p className="font-bold text-accent-yellow">Falta un paso en la base de datos</p>
                        <p className="mt-1 text-white/80">
                            Corré <code className="rounded-sm bg-black/40 px-1.5 py-0.5 text-white">{SQL}</code> en Supabase → SQL Editor. Crea la
                            tabla de clientes y convierte en clientes a quienes ya tienen presupuestos guardados.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-sm border-2 border-hot-coral bg-hot-coral/10 p-4">
                    <span aria-hidden="true" className="material-icons text-hot-coral">error_outline</span>
                    <p className="flex-1 text-sm font-medium text-white/90">{error}</p>
                    <button type="button" onClick={() => setError(null)} aria-label="Cerrar aviso" className="text-white/50 hover:text-white">
                        <span aria-hidden="true" className="material-icons text-lg">close</span>
                    </button>
                </div>
            )}

            {listo && (
                <>
                    {nuevo && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                void crearCliente(nuevo);
                            }}
                            aria-label="Nuevo cliente"
                            className="rounded-sm border-2 border-white/10 bg-[#1e1530] p-4 sm:p-5"
                        >
                            <FormContacto datos={nuevo} onCambio={setNuevo} autoFocus />
                            <div className="mt-4 flex gap-2">
                                <button type="submit" disabled={ocupado === "nuevo" || (!nuevo.name.trim() && !nuevo.business.trim())} className={BOTON_PRIMARIO}>
                                    Crear cliente
                                </button>
                                <button type="button" onClick={() => setNuevo(null)} className={BOTON_SECUNDARIO}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <Cifra
                            etiqueta="Falta cobrar"
                            valor={formatearPesos(general.falta)}
                            clase={general.falta > 0 ? "text-accent-yellow" : "text-white"}
                            detalle={[
                                `De ${general.trabajos} ${general.trabajos === 1 ? "trabajo" : "trabajos"}`,
                                general.cuotasAtrasadas > 0 ? `Incluye ${general.cuotasAtrasadas} ${general.cuotasAtrasadas === 1 ? "cuota atrasada" : "cuotas atrasadas"}` : "",
                            ]}
                        />
                        <Cifra etiqueta="Cobrado" valor={formatearPesos(general.cobrado)} detalle={[`Este mes: ${formatearPesos(general.entroEsteMes)}`]} />
                        <Cifra etiqueta="Ganancia" valor={formatearPesos(general.ganancia)} clase="text-secondary" detalle={[`Ya en mano: ${formatearPesos(general.gananciaCobrada)}`]} />
                        <Cifra
                            etiqueta="Por mes"
                            valor={formatearPesos(general.porMes)}
                            sufijo="/mes"
                            detalle={
                                general.conMensual === 0
                                    ? ["Sin cuotas registradas todavía"]
                                    : [
                                          general.gananciaPorMes !== general.porMes ? `Te quedan ${formatearPesos(general.gananciaPorMes)}/mes` : "",
                                          `Este mes cobraste ${general.pagaronEsteMes} de ${general.conMensual} ${general.conMensual === 1 ? "cuota" : "cuotas"}`,
                                      ]
                            }
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="search"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre, negocio, WhatsApp o email"
                            aria-label="Buscar clientes"
                            className="admin-input w-full py-1.5! text-sm sm:w-80"
                        />
                        <div role="radiogroup" aria-label="Filtrar clientes" className="flex rounded-sm border-2 border-white/15 p-0.5">
                            {(
                                [
                                    ["todos", "Todos"],
                                    ["deben", "Deben"],
                                    ["pagados", "Pagados"],
                                ] as const
                            ).map(([valor, etiqueta]) => (
                                <button
                                    key={valor}
                                    type="button"
                                    role="radio"
                                    aria-checked={filtro === valor}
                                    onClick={() => setFiltro(valor)}
                                    className={`rounded-sm px-3 py-1 text-xs font-bold ${filtro === valor ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    {etiqueta}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            {filas.length} de {clientes.length}
                        </span>
                    </div>

                    {filas.length === 0 ? (
                        <p className="rounded-sm border-2 border-dashed border-white/15 px-4 py-10 text-center text-sm text-gray-400">
                            {clientes.length === 0
                                ? "Todavía no hay clientes. Se crean solos al guardar un presupuesto, o con “Nuevo cliente”."
                                : "Ninguno coincide con la búsqueda o el filtro."}
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {filas.map(({ c, suyos, s }) => {
                                const estaAbierto = abierto === c.id;
                                return (
                                    <li key={c.id} className={`rounded-sm border-2 bg-[#1e1530] ${estaAbierto ? "border-primary/60" : "border-white/10"}`}>
                                        <button
                                            type="button"
                                            aria-expanded={estaAbierto}
                                            onClick={() => setAbierto(estaAbierto ? null : c.id)}
                                            className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.03] sm:flex sm:gap-x-6 sm:px-5"
                                        >
                                            <div className="min-w-0 sm:flex-1">
                                                <p className="truncate font-bold text-white">{c.name.trim() || c.business.trim() || "Sin nombre"}</p>
                                                <p className="truncate text-xs text-gray-400">
                                                    {[c.name.trim() && c.business.trim(), `${suyos.length} ${suyos.length === 1 ? "presupuesto" : "presupuestos"}`]
                                                        .filter(Boolean)
                                                        .join(" · ")}
                                                </p>
                                            </div>
                                            <span aria-hidden="true" className={`material-icons text-gray-400 transition-transform sm:order-last ${estaAbierto ? "rotate-180" : ""}`}>
                                                expand_more
                                            </span>
                                            <span className="col-span-2 flex flex-wrap items-center gap-x-6 gap-y-2">
                                                <span className="flex flex-wrap gap-1.5">
                                                    <EtiquetaCobro estado={s.estado} />
                                                    {s.cuotasAtrasadas > 0 && (
                                                        <span className="rounded-sm border border-hot-coral/40 bg-hot-coral/15 px-2 py-0.5 text-xs font-bold text-hot-coral">
                                                            Debe {s.cuotasAtrasadas} {s.cuotasAtrasadas === 1 ? "cuota" : "cuotas"}
                                                        </span>
                                                    )}
                                                </span>
                                                <Monto etiqueta="Falta cobrar" valor={s.falta} />
                                                <Monto etiqueta="Ganancia" valor={s.ganancia} />
                                            </span>
                                        </button>

                                        {estaAbierto && (
                                            <div className="space-y-5 border-t-2 border-white/10 p-4 sm:p-5">
                                                <DatosCliente
                                                    key={c.updated_at}
                                                    cliente={c}
                                                    ocupado={ocupado === c.id}
                                                    onGuardar={(datos) => guardarCliente(c, datos)}
                                                    onBorrar={() => borrarCliente(c)}
                                                />
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h3 className="font-display text-base font-bold text-white">Presupuestos</h3>
                                                        <Link
                                                            href={`/admin/presupuestos?cliente=${c.id}`}
                                                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] hover:text-white"
                                                        >
                                                            <span aria-hidden="true" className="material-icons text-base">add</span>
                                                            Presupuesto nuevo
                                                        </Link>
                                                    </div>
                                                    {suyos.length === 0 ? (
                                                        <p className="text-sm text-gray-400">Todavía no tiene presupuestos.</p>
                                                    ) : (
                                                        suyos.map(tarjeta)
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {sueltos.length > 0 && (
                        <details className="group rounded-sm border-2 border-white/10 bg-[#1e1530]">
                            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-4 py-4 font-bold text-white sm:px-5">
                                <span aria-hidden="true" className="material-icons text-gray-400 transition-transform group-open:rotate-90">chevron_right</span>
                                Presupuestos sin cliente
                                <span className="rounded-sm bg-white/10 px-1.5 text-xs tabular-nums">{sueltos.length}</span>
                                <span className="text-xs font-normal text-gray-400">Guardados sin nombre ni negocio. Asignalos para seguir su cobro.</span>
                            </summary>
                            <div className="space-y-3 border-t-2 border-white/10 p-4 sm:p-5">{sueltos.map(tarjeta)}</div>
                        </details>
                    )}
                </>
            )}

            <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-50">
                {aviso && <p className="rounded-sm border-2 border-black bg-accent-yellow px-4 py-2.5 text-sm font-bold text-ink-black shadow-neobrutalism">{aviso}</p>}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Piezas
   ───────────────────────────────────────────────────────────── */

function TarjetaTrabajo({
    t,
    mes,
    clientes,
    automatico,
    linksMp,
    onCobrarMp,
    ocupado,
    onEstado,
    onCliente,
    onPago,
    onQuitarPago,
    onCostos,
    onMensual,
}: {
    t: T;
    mes: string;
    clientes: Cliente[];
    /** El bloque de cobro automático con Mercado Pago, ya armado; null si no corresponde. */
    automatico: React.ReactNode;
    /** Los links de pago de Mercado Pago sin usar, ya armados. */
    linksMp: React.ReactNode;
    /** Solo si Mercado Pago está conectado. */
    onCobrarMp?: (d: { monto: number; nota: string }) => void;
    ocupado: boolean;
    onEstado: (estado: EstadoPresupuesto) => void;
    onCliente: (clienteId: string | null) => void;
    onPago: (pago: Omit<Pago, "id">) => void;
    onQuitarPago: (pago: Pago) => void;
    onCostos: (costos: Costo[], ok: string) => void;
    onMensual: (activo: boolean) => void;
}) {
    const { q, cobro, pagos, costos, mensual } = t;
    const claseEstado = ESTADOS.find((e) => e.valor === q.status)?.clase ?? "";
    const porcentaje = cobro.total > 0 ? Math.min((cobro.cobrado / cobro.total) * 100, 100) : 100;

    // Lo primero que se sugiere cobrar es lo que falta de la seña; si ya la pagó, todo lo que falta.
    const atajos: Atajo[] = [];
    if (cobro.faltaSena > 0) atajos.push({ etiqueta: `Seña · faltan ${formatearPesos(cobro.faltaSena)}`, monto: cobro.faltaSena });
    if (cobro.falta > cobro.faltaSena) atajos.push({ etiqueta: `Todo lo que falta · ${formatearPesos(cobro.falta)}`, monto: cobro.falta });
    // La nota dice a qué fue el pago según el monto, así no queda "Saldo" un pago que completa la seña.
    const notaPara = (m: number) =>
        cobro.falta === 0
            ? ""
            : m >= cobro.falta
              ? cobro.cobrado === 0
                  ? "Pago total"
                  : "Saldo"
              : m <= cobro.faltaSena
                ? "Seña"
                : cobro.faltaSena > 0
                  ? "Seña y parte del saldo"
                  : "Parte del saldo";

    return (
        <article aria-label={`Presupuesto ${formatearNumero(q.number)}`} className={`rounded-sm border-2 border-white/10 bg-white/[0.03] ${ocupado ? "opacity-60" : ""}`}>
            <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-white/5 px-4 py-3">
                <span className="font-display font-bold text-white tabular-nums">N° {formatearNumero(q.number)}</span>
                <span className="min-w-0 flex-1 basis-40 truncate text-sm text-gray-300">{q.title}</span>
                <select
                    value={q.status}
                    disabled={ocupado}
                    aria-label={`Estado del presupuesto ${formatearNumero(q.number)}`}
                    onChange={(e) => onEstado(e.target.value as EstadoPresupuesto)}
                    className={`rounded-sm border px-2 py-1 text-xs font-bold [color-scheme:dark] ${claseEstado}`}
                >
                    {ESTADOS.map((e) => (
                        <option key={e.valor} value={e.valor} className="bg-[#1e1530] text-white">
                            {e.etiqueta}
                        </option>
                    ))}
                </select>
                <span className="font-bold text-white tabular-nums">{formatearPesos(cobro.total)}</span>
                <Link href={`/admin/presupuestos?abrir=${q.id}`} className="rounded-sm bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20">
                    Abrir
                </Link>
            </header>

            <div className="space-y-5 p-4">
                {t.cuenta ? (
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <EtiquetaCobro estado={cobro.estado} />
                            <span className="text-sm text-gray-400">
                                Cobrado <strong className="text-white tabular-nums">{formatearPesos(cobro.cobrado)}</strong> de {formatearPesos(cobro.total)}
                            </span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label="Cuánto se cobró"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(porcentaje)}
                            className="h-2 overflow-hidden rounded-sm bg-white/10"
                        >
                            <div className="h-full bg-secondary" style={{ width: `${porcentaje}%` }} />
                        </div>
                        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Dato
                                etiqueta="Seña"
                                valor={formatearPesos(cobro.sena)}
                                detalle={
                                    cobro.sena === 0
                                        ? "Sin seña"
                                        : cobro.faltaSena === 0
                                          ? "✓ Cobrada"
                                          : cobro.cobrado > 0
                                            ? `Pagó ${formatearPesos(cobro.cobrado)} · faltan ${formatearPesos(cobro.faltaSena)}`
                                            : `Faltan ${formatearPesos(cobro.faltaSena)}`
                                }
                            />
                            <Dato etiqueta="Falta cobrar" valor={formatearPesos(cobro.falta)} clase={cobro.falta > 0 ? "text-accent-yellow" : "text-white"} />
                            <Dato etiqueta="Costos" valor={formatearPesos(cobro.costos)} />
                            <Dato etiqueta="Ganancia" valor={formatearPesos(cobro.ganancia)} clase="text-secondary" detalle={`Ya en mano: ${formatearPesos(cobro.gananciaCobrada)}`} />
                        </dl>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Todavía no está aceptado, así que no suma a las cuentas. Registrá la seña o marcalo como aceptado.</p>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                    <section aria-label="Pagos del proyecto" className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pagos del proyecto</h4>
                        {pagos.length === 0 ? (
                            <p className="text-sm text-gray-500">Todavía no hay pagos.</p>
                        ) : (
                            <ul className="divide-y divide-white/5 rounded-sm border border-white/10">
                                {pagos.map((p) => (
                                    <Renglon
                                        key={p.id}
                                        monto={p.monto}
                                        etiqueta={`Borrar el pago de ${formatearPesos(p.monto)}`}
                                        disabled={ocupado}
                                        // Los que cobró Mercado Pago no se borran: pasaron de verdad.
                                        onQuitar={p.mp ? undefined : () => onQuitarPago(p)}
                                    >
                                        <span className="shrink-0 tabular-nums text-gray-400">{p.fecha ? formatearFecha(p.fecha) : "Sin fecha"}</span>
                                        {p.mp && <span className="shrink-0 rounded-sm bg-[#00b1ea]/15 px-1.5 text-[11px] font-bold text-[#7fd8f5]">Mercado Pago</span>}
                                        {p.nota && <span className="truncate text-white">{p.nota}</span>}
                                    </Renglon>
                                ))}
                            </ul>
                        )}
                        {linksMp}
                        <FormPago
                            // Se rearma con cada pago: la sugerencia pasa a ser lo que falta ahora.
                            key={cobro.cobrado}
                            titulo="Registrar un pago"
                            boton="Registrar pago"
                            sugerido={{ monto: atajos[0]?.monto ?? 0 }}
                            atajos={atajos.length > 1 ? atajos : []}
                            notaPara={notaPara}
                            ayuda={
                                onCobrarMp
                                    ? "Si ya te pagó (transferencia, efectivo), registralo. Para cobrarle, elegí el monto y mandale un link de Mercado Pago."
                                    : cobro.falta > 0
                                      ? "¿Te pagó una parte? Cambiá el monto."
                                      : undefined
                            }
                            disabled={ocupado}
                            onAgregar={onPago}
                            onCobrarMp={onCobrarMp}
                        />
                    </section>

                    <section aria-label="Costos" className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Costos</h4>
                        {costos.length === 0 ? (
                            <p className="text-sm text-gray-500">Sin costos cargados: la ganancia es el total.</p>
                        ) : (
                            <ul className="divide-y divide-white/5 rounded-sm border border-white/10">
                                {costos.map((c) => (
                                    <Renglon
                                        key={c.id}
                                        monto={c.monto}
                                        sufijo={c.mensual ? "/mes" : undefined}
                                        etiqueta={`Borrar el costo ${c.concepto}`}
                                        disabled={ocupado}
                                        onQuitar={() => onCostos(costos.filter((x) => x.id !== c.id), "Costo borrado")}
                                    >
                                        <span className="truncate text-white">{c.concepto || "Sin concepto"}</span>
                                    </Renglon>
                                ))}
                            </ul>
                        )}
                        <FormCosto
                            disabled={ocupado}
                            onAgregar={(costo) =>
                                onCostos([...costos, { ...costo, id: nuevoId() }], `Costo de ${formatearPesos(costo.monto)}${costo.mensual ? " por mes" : ""} agregado`)
                            }
                        />
                    </section>
                </div>

                {mensual && (
                    <SeccionMensual
                        m={mensual}
                        mes={mes}
                        activo={t.activo}
                        costosMes={t.costosMes}
                        automatico={automatico}
                        ocupado={ocupado}
                        onPago={onPago}
                        onQuitarPago={onQuitarPago}
                        onMensual={onMensual}
                    />
                )}

                <div className="flex justify-end border-t-2 border-white/5 pt-4">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-400">
                        Cliente
                        <select
                            value={q.client_id ?? ""}
                            disabled={ocupado}
                            onChange={(e) => onCliente(e.target.value || null)}
                            className="admin-input max-w-[14rem] py-1! text-xs [color-scheme:dark]"
                        >
                            <option value="">Sin cliente</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {nombreDe(c)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </article>
    );
}

/** El mantenimiento mensual de un trabajo: qué meses pagó, cuál debe y el formulario de la cuota. */
function SeccionMensual({
    m,
    mes,
    activo,
    costosMes,
    automatico,
    ocupado,
    onPago,
    onQuitarPago,
    onMensual,
}: {
    m: Mensual;
    mes: string;
    activo: boolean;
    costosMes: number;
    automatico: React.ReactNode;
    ocupado: boolean;
    onPago: (pago: Omit<Pago, "id">) => void;
    onQuitarPago: (pago: Pago) => void;
    onMensual: (activo: boolean) => void;
}) {
    const pagados = new Set(m.cuotas.map((c) => c.mes));
    // Del más nuevo al más viejo: dos meses adelante por si paga por adelantado, un año atrás o lo que deba.
    const hasta = [sumarMeses(mes, 2), m.proximo].sort().at(-1)!;
    const desde = [sumarMeses(mes, -12), m.proximo, ...m.deben].sort()[0];
    const meses: { valor: string; etiqueta: string }[] = [];
    for (let x = hasta; x >= desde; x = sumarMeses(x, -1)) {
        meses.push({ valor: x, etiqueta: `${nombreMes(x)}${pagados.has(x) ? " · ya pagada" : x === mes ? " · este mes" : ""}` });
    }
    const debe = m.deben.length === 1 ? nombreMes(m.deben[0]) : `${m.deben.length} cuotas: ${m.deben.map(nombreMes).join(", ")}`;

    return (
        <section aria-label="Mantenimiento mensual" className="space-y-2 border-t-2 border-white/5 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Mantenimiento mensual · <span className="text-white tabular-nums">{formatearPesos(m.cuota)}/mes</span>
                </h4>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={activo} disabled={ocupado} onChange={(e) => onMensual(e.target.checked)} className="h-4 w-4 accent-primary" />
                    Lo tiene contratado
                </label>
            </div>

            {activo &&
                (m.empezo ? (
                    <p className="text-sm text-gray-300">
                        <span className="capitalize">{nombreMes(mes)}</span>:{" "}
                        {m.pagoEsteMes ? <strong className="text-secondary">✓ pagado</strong> : <strong className="text-accent-yellow">sin pagar</strong>}
                        {m.deben.length > 0 && <strong className="text-hot-coral"> · Debe {debe}</strong>}
                    </p>
                ) : (
                    <p className="text-sm text-gray-400">Todavía no registraste cuotas. Cargá la primera cuando te la pague: desde ese mes se espera una por mes.</p>
                ))}

            {costosMes > 0 && (
                <p className="text-xs text-gray-400">
                    Costos por mes {formatearPesos(costosMes)} · te quedan <strong className="text-secondary tabular-nums">{formatearPesos(m.cuota - costosMes)}/mes</strong>
                </p>
            )}

            {automatico}

            {m.cuotas.length > 0 && (
                // ponytail: muestra todas las cuotas; con años de historia conviene plegar las viejas.
                <ul className="divide-y divide-white/5 rounded-sm border border-white/10">
                    {m.cuotas.map((c) => (
                        <Renglon
                            key={c.id}
                            monto={c.monto}
                            etiqueta={`Borrar la cuota de ${nombreMes(c.mes)}`}
                            disabled={ocupado}
                            // Las que cobró Mercado Pago no se borran: pasaron de verdad.
                            onQuitar={c.mp ? undefined : () => onQuitarPago(c)}
                        >
                            <span className="shrink-0 text-white capitalize">{nombreMes(c.mes)}</span>
                            {c.mp && <span className="shrink-0 rounded-sm bg-[#00b1ea]/15 px-1.5 text-[11px] font-bold text-[#7fd8f5]">Mercado Pago</span>}
                            {c.fecha && <span className="truncate text-gray-400">pagada el {formatearFecha(c.fecha)}</span>}
                        </Renglon>
                    ))}
                </ul>
            )}

            {activo && (
                <FormPago
                    key={`${m.proximo}-${m.cuotas.length}`}
                    titulo={automatico ? "Registrar una cuota a mano" : "Registrar una cuota"}
                    boton="Registrar cuota"
                    sugerido={{ monto: m.cuota, mes: m.proximo }}
                    meses={meses}
                    disabled={ocupado}
                    onAgregar={onPago}
                />
            )}
        </section>
    );
}

type Atajo = { etiqueta: string; monto: number };

/** Registrar un pago del proyecto o, con `meses`, una cuota del mensual. Arranca con lo sugerido; se cambia lo que haga falta. */
function FormPago({
    titulo,
    boton,
    sugerido,
    atajos = [],
    notaPara,
    meses,
    ayuda,
    disabled,
    onAgregar,
    onCobrarMp,
}: {
    titulo: string;
    boton: string;
    sugerido: { monto: number; mes?: string };
    atajos?: Atajo[];
    /** La nota que corresponde a un monto. Deja de seguir al monto apenas se escribe una a mano. */
    notaPara?: (monto: number) => string;
    meses?: { valor: string; etiqueta: string }[];
    ayuda?: string;
    disabled: boolean;
    onAgregar: (pago: Omit<Pago, "id">) => void;
    /** Si viene, también se puede mandar un link de Mercado Pago por el monto y con la nota como concepto. */
    onCobrarMp?: (d: { monto: number; nota: string }) => void;
}) {
    const [fecha, setFecha] = useState(hoyISO);
    const [monto, setMonto] = useState(sugerido.monto);
    const [nota, setNota] = useState(() => notaPara?.(sugerido.monto) ?? "");
    const [notaPropia, setNotaPropia] = useState(false);
    const [mes, setMes] = useState(sugerido.mes ?? "");

    function cambiarMonto(m: number) {
        setMonto(m);
        if (notaPara && !notaPropia) setNota(notaPara(m));
    }

    return (
        <form
            aria-label={titulo}
            onSubmit={(e) => {
                e.preventDefault();
                onAgregar({ fecha, monto, nota: nota.trim(), mes });
            }}
            className="space-y-2 rounded-sm border border-white/10 bg-black/20 p-3"
        >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{titulo}</p>
            {atajos.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {atajos.map((a) => (
                        <button
                            key={a.etiqueta}
                            type="button"
                            aria-pressed={monto === a.monto}
                            onClick={() => cambiarMonto(a.monto)}
                            className={`rounded-sm border px-2 py-1 text-xs font-bold transition-colors ${
                                monto === a.monto ? "border-primary bg-primary text-white" : "border-white/15 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white"
                            }`}
                        >
                            {a.etiqueta}
                        </button>
                    ))}
                </div>
            )}
            {/* En el celular, un campo debajo del otro y a lo ancho. */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {meses && (
                    <select aria-label="Mes que paga" value={mes} onChange={(e) => setMes(e.target.value)} className="admin-input w-full py-1.5! text-sm [color-scheme:dark] sm:w-auto">
                        {meses.map((x) => (
                            <option key={x.valor} value={x.valor}>
                                {x.etiqueta}
                            </option>
                        ))}
                    </select>
                )}
                <PesosInput etiqueta="Monto del pago" valor={monto} onChange={cambiarMonto} className="w-full sm:w-36" />
                <input
                    type="date"
                    aria-label="Fecha en que te pagó"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value || hoyISO())}
                    className="admin-input w-full py-1.5! text-sm [color-scheme:dark] sm:w-36"
                />
                {!meses && (
                    <input
                        aria-label="Nota del pago"
                        placeholder="Nota (opcional)"
                        value={nota}
                        onChange={(e) => {
                            setNota(e.target.value);
                            setNotaPropia(true);
                        }}
                        className="admin-input w-full py-1.5! text-sm sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-28"
                    />
                )}
                <button type="submit" disabled={disabled || monto <= 0 || (!!meses && !mes)} className={BOTON_PRIMARIO}>
                    {boton}
                </button>
                {onCobrarMp && (
                    <button
                        type="button"
                        disabled={disabled || monto <= 0}
                        onClick={() => onCobrarMp({ monto, nota: nota.trim() || "Pago" })}
                        className="inline-flex items-center justify-center gap-1.5 rounded-sm border-2 border-black bg-[#00b1ea] px-3.5 py-2 text-sm font-bold text-ink-black shadow-neobrutalism-sm transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        <span aria-hidden="true" className="material-icons text-lg">link</span>
                        Cobrar con Mercado Pago
                    </button>
                )}
            </div>
            {ayuda && <p className="text-xs text-gray-500">{ayuda}</p>}
        </form>
    );
}

function FormCosto({ disabled, onAgregar }: { disabled: boolean; onAgregar: (costo: Omit<Costo, "id">) => void }) {
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto] = useState(0);
    const [mensual, setMensual] = useState(false);

    return (
        <form
            aria-label="Agregar un costo"
            onSubmit={(e) => {
                e.preventDefault();
                onAgregar({ concepto: concepto.trim(), monto, mensual });
                setConcepto("");
                setMonto(0);
                setMensual(false);
            }}
            className="flex flex-wrap items-center gap-2"
        >
            <input
                aria-label="Concepto del costo"
                placeholder="Freelancer, dominio, hosting…"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="admin-input min-w-0 flex-1 basis-40 py-1.5! text-sm"
            />
            <PesosInput etiqueta="Monto del costo" valor={monto} onChange={setMonto} sufijo={mensual ? "/mes" : undefined} className="w-36" />
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-300">
                <input type="checkbox" checked={mensual} onChange={(e) => setMensual(e.target.checked)} className="h-4 w-4 accent-primary" />
                Todos los meses
            </label>
            <button type="submit" disabled={disabled || monto <= 0} className={BOTON_SECUNDARIO}>
                Agregar
            </button>
        </form>
    );
}

function DatosCliente({
    cliente,
    ocupado,
    onGuardar,
    onBorrar,
}: {
    cliente: Cliente;
    ocupado: boolean;
    onGuardar: (datos: Contacto & { notes: string }) => void;
    onBorrar: () => void;
}) {
    const inicial = { name: cliente.name, business: cliente.business, whatsapp: cliente.whatsapp, email: cliente.email, notes: cliente.notes };
    const [datos, setDatos] = useState(inicial);
    const cambiado = JSON.stringify(datos) !== JSON.stringify(inicial);
    const wa = normalizarWhatsApp(datos.whatsapp);

    return (
        <form
            aria-label="Datos del cliente"
            onSubmit={(e) => {
                e.preventDefault();
                onGuardar(datos);
            }}
            className="space-y-3"
        >
            <FormContacto datos={datos} onCambio={(c) => setDatos({ ...datos, ...c })} />
            <Campo etiqueta="Notas">
                <textarea
                    className="admin-input w-full resize-y text-sm"
                    rows={2}
                    value={datos.notes}
                    placeholder="Lo que conviene recordar de este cliente"
                    onChange={(e) => setDatos({ ...datos, notes: e.target.value })}
                />
            </Campo>
            <div className="flex flex-wrap items-center gap-2">
                <button type="submit" disabled={!cambiado || ocupado} className={BOTON_PRIMARIO}>
                    Guardar datos
                </button>
                {wa && (
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={BOTON_SECUNDARIO}>
                        <span aria-hidden="true" className="material-icons text-lg">chat</span>
                        WhatsApp
                    </a>
                )}
                <button type="button" onClick={onBorrar} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-hot-coral">
                    <span aria-hidden="true" className="material-icons text-base">delete_outline</span>
                    Borrar cliente
                </button>
            </div>
        </form>
    );
}

function FormContacto({ datos, onCambio, autoFocus }: { datos: Contacto; onCambio: (datos: Contacto) => void; autoFocus?: boolean }) {
    const set = (cambios: Partial<Contacto>) => onCambio({ ...datos, ...cambios });
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="Nombre">
                <input autoFocus={autoFocus} className="admin-input w-full" value={datos.name} placeholder="Juana Pérez" onChange={(e) => set({ name: e.target.value })} />
            </Campo>
            <Campo etiqueta="Negocio o rubro">
                <input className="admin-input w-full" value={datos.business} placeholder="Panadería La Espiga" onChange={(e) => set({ business: e.target.value })} />
            </Campo>
            <Campo etiqueta="WhatsApp">
                <input className="admin-input w-full" inputMode="tel" value={datos.whatsapp} placeholder="11 2345-6789" onChange={(e) => set({ whatsapp: e.target.value })} />
            </Campo>
            <Campo etiqueta="Email">
                <input className="admin-input w-full" type="email" value={datos.email} placeholder="juana@gmail.com" onChange={(e) => set({ email: e.target.value })} />
            </Campo>
        </div>
    );
}

function Renglon({
    monto,
    sufijo,
    etiqueta,
    disabled,
    onQuitar,
    children,
}: {
    monto: number;
    sufijo?: string;
    etiqueta: string;
    disabled: boolean;
    /** Sin esto, el renglón no se puede borrar. */
    onQuitar?: () => void;
    children: React.ReactNode;
}) {
    return (
        <li className="flex items-center gap-3 px-3 py-1.5 text-sm">
            {/* Si no entra en una línea (en el celular), baja a la segunda en vez de taparse con el monto. */}
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5">{children}</span>
            <span className="font-bold text-white tabular-nums">
                {formatearPesos(monto)}
                {sufijo && <span className="text-xs font-medium text-gray-400">{sufijo}</span>}
            </span>
            {onQuitar ? (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onQuitar}
                    aria-label={etiqueta}
                    title={etiqueta}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-sm text-gray-500 hover:bg-hot-coral/15 hover:text-hot-coral disabled:opacity-30"
                >
                    <span aria-hidden="true" className="material-icons text-base">close</span>
                </button>
            ) : (
                <span aria-hidden="true" className="h-7 w-7 shrink-0" />
            )}
        </li>
    );
}

function EtiquetaCobro({ estado }: { estado: EstadoCobro | null }) {
    if (!estado) return <span className="rounded-sm border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-bold text-gray-300">Sin trabajos aceptados</span>;
    const { etiqueta, clase } = ESTADOS_COBRO[estado];
    return <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${clase}`}>{etiqueta}</span>;
}

function Monto({ etiqueta, valor }: { etiqueta: string; valor: number }) {
    return (
        <span className="sm:w-28 sm:text-right">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">{etiqueta}</span>
            <span className="font-bold text-white tabular-nums">{formatearPesos(valor)}</span>
        </span>
    );
}

function Cifra({ etiqueta, valor, sufijo, detalle = [], clase = "text-white" }: { etiqueta: string; valor: string; sufijo?: string; detalle?: string[]; clase?: string }) {
    return (
        <div className="min-w-0 rounded-sm border-2 border-white/10 bg-[#1e1530] p-3 sm:p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{etiqueta}</p>
            <p className={`mt-1 font-display text-xl font-bold tabular-nums sm:text-2xl ${clase}`}>
                {valor}
                {sufijo && <span className="text-sm font-medium text-gray-400">{sufijo}</span>}
            </p>
            {detalle.filter(Boolean).map((d) => (
                <p key={d} className="mt-0.5 text-xs text-gray-500">
                    {d}
                </p>
            ))}
        </div>
    );
}

function Dato({ etiqueta, valor, detalle, clase = "text-white" }: { etiqueta: string; valor: string; detalle?: string; clase?: string }) {
    return (
        <div className="min-w-0 rounded-sm border border-white/10 bg-black/20 px-3 py-2">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{etiqueta}</dt>
            <dd className={`font-display text-lg font-bold tabular-nums ${clase}`}>{valor}</dd>
            {detalle && <dd className="text-xs text-gray-400">{detalle}</dd>}
        </div>
    );
}
