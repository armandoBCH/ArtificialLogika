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
    cobroDe,
    costosDe,
    mismoCliente,
    nombreDe,
    pagosDe,
    peorEstado,
    type Cliente,
    type Cobro,
    type Contacto,
    type Costo,
    type EstadoCobro,
    type Pago,
} from "./cuentas";

/**
 * Clientes: quién compró, cuánto pagó, cuánto falta y cuánto deja cada trabajo.
 *
 * Un presupuesto entra en las cuentas cuando está aceptado o tiene algún pago.
 * Los pagos y los costos se guardan apenas se agregan; los datos del cliente,
 * con su botón.
 */

const SQL = "supabase/clientes-2026-10-07.sql";

type Filtro = "todos" | "deben" | "pagados";

interface Trabajo {
    q: PresupuestoGuardado;
    pagos: Pago[];
    costos: Costo[];
    cobro: Cobro;
    /** Lo que suman sus servicios mensuales, contratados o no. */
    mensual: number;
    /** Aceptado o con algún pago: entra en las cuentas. */
    cuenta: boolean;
}

function trabajoDe(q: PresupuestoGuardado): Trabajo {
    const t = calcularTotales(normalizar(q.data));
    const pagos = pagosDe(q.payments);
    const costos = costosDe(q.costs);
    return {
        q,
        pagos,
        costos,
        cobro: cobroDe(t.total, t.sena, pagos, costos),
        mensual: t.mensual,
        cuenta: q.status === "aceptado" || pagos.length > 0,
    };
}

function sumar(trabajos: Trabajo[]) {
    const cuentan = trabajos.filter((t) => t.cuenta);
    const s = (f: (t: Trabajo) => number) => cuentan.reduce((a, t) => a + f(t), 0);
    const mensuales = cuentan.filter((t) => t.mensual > 0 && t.q.monthly_active !== false);
    const mes = hoyISO().slice(0, 7);
    return {
        trabajos: cuentan.length,
        cobrado: s((t) => t.cobro.cobrado),
        cobradoMes: s((t) => t.pagos.filter((p) => p.fecha.startsWith(mes)).reduce((a, p) => a + p.monto, 0)),
        falta: s((t) => t.cobro.falta),
        ganancia: s((t) => t.cobro.ganancia),
        gananciaCobrada: s((t) => t.cobro.gananciaCobrada),
        mensual: mensuales.reduce((a, t) => a + t.mensual, 0),
        // Clientes, no trabajos: uno con dos presupuestos aceptados sigue siendo uno.
        conMensual: new Set(mensuales.map((t) => t.q.client_id ?? t.q.id)).size,
        estado: peorEstado(cuentan.map((t) => t.cobro.estado)),
    };
}

const contactoVacio = (): Contacto => ({ name: "", business: "", whatsapp: "", email: "" });

interface Props {
    listo: boolean;
    clientes: Cliente[];
    presupuestos: PresupuestoGuardado[];
}

export default function Clientes({ listo, clientes: clientesIniciales, presupuestos: presupuestosIniciales }: Props) {
    const [clientes, setClientes] = useState(clientesIniciales);
    const [presupuestos, setPresupuestos] = useState(presupuestosIniciales);
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
            setPresupuestos((lista) => lista.map((x) => (x.id === q.id ? { ...fila, total: Number(fila.total) } : x)));
            avisar(ok);
        } catch (e) {
            fallo(e, "No se pudo guardar el cambio");
        } finally {
            setOcupado(null);
        }
    }

    /** Cobrar algo es aceptar el presupuesto: si no lo estaba, se marca en el mismo paso. */
    function agregarPago(t: Trabajo, pago: Omit<Pago, "id">) {
        const pagos = [...t.pagos, { ...pago, id: nuevoId() }].sort((a, b) => a.fecha.localeCompare(b.fecha));
        const aceptar = t.q.status !== "aceptado";
        void actualizar(
            t.q,
            aceptar ? { payments: pagos, status: "aceptado" } : { payments: pagos },
            `Pago de ${formatearPesos(pago.monto)} registrado${aceptar ? " · presupuesto aceptado" : ""}`
        );
    }

    function quitarPago(t: Trabajo, pago: Pago) {
        if (!confirm(`¿Borrar el pago de ${formatearPesos(pago.monto)}${pago.fecha ? ` del ${formatearFecha(pago.fecha)}` : ""}?`)) return;
        void actualizar(t.q, { payments: t.pagos.filter((p) => p.id !== pago.id) }, "Pago borrado");
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

    const trabajos = presupuestos.map(trabajoDe);
    const general = sumar(trabajos);
    const ids = new Set(clientes.map((c) => c.id));
    const sueltos = trabajos.filter((t) => !t.q.client_id || !ids.has(t.q.client_id));
    const texto = busqueda.trim().toLowerCase();
    const filas = clientes
        .map((c) => {
            const suyos = trabajos.filter((t) => t.q.client_id === c.id);
            return { c, suyos, s: sumar(suyos) };
        })
        .filter(({ c }) => !texto || `${c.name} ${c.business} ${c.whatsapp} ${c.email}`.toLowerCase().includes(texto))
        .filter(({ s }) => filtro === "todos" || (filtro === "deben" ? s.falta > 0 : s.trabajos > 0 && s.falta === 0))
        .sort((a, b) => b.s.falta - a.s.falta || nombreDe(a.c).localeCompare(nombreDe(b.c), "es"));

    const tarjeta = (t: Trabajo) => (
        <TarjetaTrabajo
            key={t.q.id}
            t={t}
            clientes={clientes}
            ocupado={ocupado === t.q.id}
            onEstado={(status) => actualizar(t.q, { status }, `N° ${formatearNumero(t.q.number)} marcado como ${status}`)}
            onCliente={(client_id) => actualizar(t.q, { client_id }, client_id ? "Presupuesto asignado" : "Presupuesto sin cliente")}
            onPago={(pago) => agregarPago(t, pago)}
            onQuitarPago={(pago) => quitarPago(t, pago)}
            onCostos={(costs, ok) => actualizar(t.q, { costs }, ok)}
            onMensual={(monthly_active) => actualizar(t.q, { monthly_active }, monthly_active ? "Mensual contratado" : "Mensual sin contratar")}
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
                            className="rounded-sm border-2 border-white/10 bg-[#1e1530] p-5"
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

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Cifra etiqueta="Falta cobrar" valor={formatearPesos(general.falta)} clase={general.falta > 0 ? "text-accent-yellow" : "text-white"} detalle={`De ${general.trabajos} ${general.trabajos === 1 ? "trabajo" : "trabajos"}`} />
                        <Cifra etiqueta="Cobrado" valor={formatearPesos(general.cobrado)} detalle={`Este mes: ${formatearPesos(general.cobradoMes)}`} />
                        <Cifra etiqueta="Ganancia" valor={formatearPesos(general.ganancia)} clase="text-secondary" detalle={`Ya en mano: ${formatearPesos(general.gananciaCobrada)}`} />
                        <Cifra
                            etiqueta="Por mes"
                            valor={`${formatearPesos(general.mensual)}/mes`}
                            detalle={`${general.conMensual} ${general.conMensual === 1 ? "cliente" : "clientes"} con servicios mensuales`}
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
                                            className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                                        >
                                            <div className="min-w-0 flex-1 basis-56">
                                                <p className="truncate font-bold text-white">{c.name.trim() || c.business.trim() || "Sin nombre"}</p>
                                                <p className="truncate text-xs text-gray-400">
                                                    {[c.name.trim() && c.business.trim(), `${suyos.length} ${suyos.length === 1 ? "presupuesto" : "presupuestos"}`]
                                                        .filter(Boolean)
                                                        .join(" · ")}
                                                </p>
                                            </div>
                                            <span className="flex items-center gap-x-6">
                                                <EtiquetaCobro estado={s.estado} />
                                                <Monto etiqueta="Falta cobrar" valor={s.falta} />
                                                <Monto etiqueta="Ganancia" valor={s.ganancia} />
                                                <span aria-hidden="true" className={`material-icons text-gray-400 transition-transform ${estaAbierto ? "rotate-180" : ""}`}>
                                                    expand_more
                                                </span>
                                            </span>
                                        </button>

                                        {estaAbierto && (
                                            <div className="space-y-5 border-t-2 border-white/10 p-5">
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
                            <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-bold text-white">
                                <span aria-hidden="true" className="material-icons text-gray-400 transition-transform group-open:rotate-90">chevron_right</span>
                                Presupuestos sin cliente
                                <span className="rounded-sm bg-white/10 px-1.5 text-xs tabular-nums">{sueltos.length}</span>
                                <span className="text-xs font-normal text-gray-400">Guardados sin nombre ni negocio. Asignalos para seguir su cobro.</span>
                            </summary>
                            <div className="space-y-3 border-t-2 border-white/10 p-5">{sueltos.map(tarjeta)}</div>
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
    clientes,
    ocupado,
    onEstado,
    onCliente,
    onPago,
    onQuitarPago,
    onCostos,
    onMensual,
}: {
    t: Trabajo;
    clientes: Cliente[];
    ocupado: boolean;
    onEstado: (estado: EstadoPresupuesto) => void;
    onCliente: (clienteId: string | null) => void;
    onPago: (pago: Omit<Pago, "id">) => void;
    onQuitarPago: (pago: Pago) => void;
    onCostos: (costos: Costo[], ok: string) => void;
    onMensual: (activo: boolean) => void;
}) {
    const { q, cobro, pagos, costos } = t;
    const claseEstado = ESTADOS.find((e) => e.valor === q.status)?.clase ?? "";
    const porcentaje = cobro.total > 0 ? Math.min((cobro.cobrado / cobro.total) * 100, 100) : 100;

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
                        <dl className="grid gap-3 sm:grid-cols-4">
                            <Dato etiqueta="Seña" valor={formatearPesos(cobro.sena)} detalle={cobro.sena === 0 ? "Sin seña" : cobro.faltaSena === 0 ? "✓ Cobrada" : `Faltan ${formatearPesos(cobro.faltaSena)}`} />
                            <Dato etiqueta="Falta cobrar" valor={formatearPesos(cobro.falta)} clase={cobro.falta > 0 ? "text-accent-yellow" : "text-white"} />
                            <Dato etiqueta="Costos" valor={formatearPesos(cobro.costos)} />
                            <Dato etiqueta="Ganancia" valor={formatearPesos(cobro.ganancia)} clase="text-secondary" detalle={`Ya en mano: ${formatearPesos(cobro.gananciaCobrada)}`} />
                        </dl>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Todavía no está aceptado, así que no suma a las cuentas. Registrá la seña o marcalo como aceptado.</p>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                    <section aria-label="Pagos" className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pagos</h4>
                        {pagos.length === 0 ? (
                            <p className="text-sm text-gray-500">Todavía no hay pagos.</p>
                        ) : (
                            <ul className="divide-y divide-white/5 rounded-sm border border-white/10">
                                {pagos.map((p) => (
                                    <Renglon key={p.id} monto={p.monto} etiqueta={`Borrar el pago de ${formatearPesos(p.monto)}`} disabled={ocupado} onQuitar={() => onQuitarPago(p)}>
                                        <span className="tabular-nums text-gray-400">{p.fecha ? formatearFecha(p.fecha) : "Sin fecha"}</span>
                                        {p.nota && <span className="truncate text-white">{p.nota}</span>}
                                    </Renglon>
                                ))}
                            </ul>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {cobro.faltaSena > 0 && (
                                <button type="button" disabled={ocupado} onClick={() => onPago({ fecha: hoyISO(), monto: cobro.faltaSena, nota: "Seña" })} className={BOTON_SECUNDARIO}>
                                    <span aria-hidden="true" className="material-icons text-lg">payments</span>
                                    Cobré la seña · {formatearPesos(cobro.faltaSena)}
                                </button>
                            )}
                            {cobro.falta > 0 && cobro.falta !== cobro.faltaSena && (
                                <button
                                    type="button"
                                    disabled={ocupado}
                                    onClick={() => onPago({ fecha: hoyISO(), monto: cobro.falta, nota: cobro.cobrado === 0 ? "Pago total" : "Saldo" })}
                                    className={BOTON_SECUNDARIO}
                                >
                                    <span aria-hidden="true" className="material-icons text-lg">done_all</span>
                                    Cobré todo lo que falta · {formatearPesos(cobro.falta)}
                                </button>
                            )}
                        </div>
                        <FormPago disabled={ocupado} onAgregar={onPago} />
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
                                        etiqueta={`Borrar el costo ${c.concepto}`}
                                        disabled={ocupado}
                                        onQuitar={() => onCostos(costos.filter((x) => x.id !== c.id), "Costo borrado")}
                                    >
                                        <span className="truncate text-white">{c.concepto || "Sin concepto"}</span>
                                    </Renglon>
                                ))}
                            </ul>
                        )}
                        <FormCosto disabled={ocupado} onAgregar={(costo) => onCostos([...costos, { ...costo, id: nuevoId() }], `Costo de ${formatearPesos(costo.monto)} agregado`)} />
                    </section>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-white/5 pt-4">
                    {t.mensual > 0 && (
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={q.monthly_active !== false}
                                disabled={ocupado}
                                onChange={(e) => onMensual(e.target.checked)}
                                className="h-4 w-4 accent-primary"
                            />
                            Contrató los servicios mensuales ({formatearPesos(t.mensual)}/mes)
                        </label>
                    )}
                    <label className="ml-auto inline-flex items-center gap-2 text-xs text-gray-400">
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

function FormPago({ disabled, onAgregar }: { disabled: boolean; onAgregar: (pago: Omit<Pago, "id">) => void }) {
    const [fecha, setFecha] = useState(hoyISO);
    const [monto, setMonto] = useState(0);
    const [nota, setNota] = useState("");

    return (
        <form
            aria-label="Registrar otro pago"
            onSubmit={(e) => {
                e.preventDefault();
                onAgregar({ fecha, monto, nota: nota.trim() });
                setMonto(0);
                setNota("");
            }}
            className="flex flex-wrap items-center gap-2"
        >
            <input type="date" aria-label="Fecha del pago" value={fecha} onChange={(e) => setFecha(e.target.value || hoyISO())} className="admin-input w-36 py-1.5! text-sm [color-scheme:dark]" />
            <PesosInput etiqueta="Monto del pago" valor={monto} onChange={setMonto} className="w-32" />
            <input aria-label="Nota del pago" placeholder="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} className="admin-input min-w-0 flex-1 basis-28 py-1.5! text-sm" />
            <button type="submit" disabled={disabled || monto <= 0} className={BOTON_SECUNDARIO}>
                Agregar
            </button>
        </form>
    );
}

function FormCosto({ disabled, onAgregar }: { disabled: boolean; onAgregar: (costo: Omit<Costo, "id">) => void }) {
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto] = useState(0);

    return (
        <form
            aria-label="Agregar un costo"
            onSubmit={(e) => {
                e.preventDefault();
                onAgregar({ concepto: concepto.trim(), monto });
                setConcepto("");
                setMonto(0);
            }}
            className="flex flex-wrap items-center gap-2"
        >
            <input
                aria-label="Concepto del costo"
                placeholder="Freelancer, dominio, plugin…"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="admin-input min-w-0 flex-1 basis-40 py-1.5! text-sm"
            />
            <PesosInput etiqueta="Monto del costo" valor={monto} onChange={setMonto} className="w-32" />
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
    etiqueta,
    disabled,
    onQuitar,
    children,
}: {
    monto: number;
    etiqueta: string;
    disabled: boolean;
    onQuitar: () => void;
    children: React.ReactNode;
}) {
    return (
        <li className="flex items-center gap-3 px-3 py-1.5 text-sm">
            <span className="flex min-w-0 flex-1 items-center gap-3">{children}</span>
            <span className="font-bold text-white tabular-nums">{formatearPesos(monto)}</span>
            <button
                type="button"
                disabled={disabled}
                onClick={onQuitar}
                aria-label={etiqueta}
                title={etiqueta}
                className="grid h-7 w-7 place-items-center rounded-sm text-gray-500 hover:bg-hot-coral/15 hover:text-hot-coral disabled:opacity-30"
            >
                <span aria-hidden="true" className="material-icons text-base">close</span>
            </button>
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
        <span className="w-28 text-right">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">{etiqueta}</span>
            <span className="font-bold text-white tabular-nums">{formatearPesos(valor)}</span>
        </span>
    );
}

function Cifra({ etiqueta, valor, detalle, clase = "text-white" }: { etiqueta: string; valor: string; detalle?: string; clase?: string }) {
    return (
        <div className="rounded-sm border-2 border-white/10 bg-[#1e1530] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{etiqueta}</p>
            <p className={`mt-1 font-display text-2xl font-bold tabular-nums ${clase}`}>{valor}</p>
            {detalle && <p className="mt-0.5 text-xs text-gray-500">{detalle}</p>}
        </div>
    );
}

function Dato({ etiqueta, valor, detalle, clase = "text-white" }: { etiqueta: string; valor: string; detalle?: string; clase?: string }) {
    return (
        <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-2">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{etiqueta}</dt>
            <dd className={`font-display text-lg font-bold tabular-nums ${clase}`}>{valor}</dd>
            {detalle && <dd className="text-xs text-gray-400">{detalle}</dd>}
        </div>
    );
}
