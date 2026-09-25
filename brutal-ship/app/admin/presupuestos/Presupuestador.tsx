"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cuotaMensual, formatearPesos } from "@/lib/precios";
import type { PricingPlan } from "@/lib/types/database";
import { escribir } from "./api";
import Catalogo from "./Catalogo";
import { ANCHO_HOJA_PX, descargarImagen, descargarPdf, nombreDeArchivo } from "./exportar";
import { Atajos, Campo, Cantidad, ListaEditable, NumeroInput, PesosInput, Seccion } from "./controles";
import HojaPresupuesto from "./HojaPresupuesto";
import {
    APORTA_CLIENTE_POR_DEFECTO,
    CONDICIONES_POR_DEFECTO,
    ESTADOS,
    refMantenimiento,
    PLAZOS_SUGERIDOS,
    calcularTotales,
    formatearNumero,
    hoyISO,
    lineaDeMantenimiento,
    lineaDePlan,
    lineaLibre,
    lineaMensualDeCatalogo,
    lineaMensualLibre,
    normalizar,
    normalizarWhatsApp,
    nuevoId,
    plazoDePlan,
    precioDePlan,
    presupuestoNuevo,
    sugerenciasDePlan,
    textoWhatsApp,
    tituloDe,
    type Empresa,
    type EstadoPresupuesto,
    type ItemCatalogo,
    type Lead,
    type Linea,
    type LineaMensual,
    type Presupuesto,
    type PresupuestoGuardado,
} from "./modelo";

/**
 * Presupuestador: armar, ajustar y mandar un presupuesto en un par de minutos.
 *
 * El recorrido va en el orden en que se piensa una venta (quién, qué plan, qué
 * extras, cuánto, cómo se paga) y la hoja de la derecha se actualiza con cada
 * tecla. Los datos de partida salen de lo que ya está cargado en el panel —
 * planes, cuotas de mantenimiento, catálogo, consultas— pero todo lo que llega
 * al presupuesto es una copia editable: cambiar un precio acá no toca el sitio.
 *
 * El trabajo en curso se guarda solo en este navegador a cada cambio, así que
 * recargar la página no pierde nada aunque no se haya guardado en la base.
 */

const CLAVE_EN_CURSO = "logika:presupuesto-en-curso";
const SQL_TABLAS = "supabase/presupuestos-y-pesos-2026-09-16.sql";
const SQL_MENSUALES = "supabase/servicios-mensuales-2026-09-22.sql";

const BOTON_PRIMARIO =
    "inline-flex items-center justify-center gap-1.5 rounded-sm border-2 border-black bg-primary px-4 py-2 text-sm font-bold text-white shadow-neobrutalism-sm transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:pointer-events-none disabled:opacity-50";
const BOTON_SECUNDARIO =
    "inline-flex items-center justify-center gap-1.5 rounded-sm border-2 border-white/15 bg-white/5 px-3.5 py-2 text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50";

interface Props {
    planes: PricingPlan[];
    leads: Lead[];
    catalogo: ItemCatalogo[];
    guardados: PresupuestoGuardado[];
    empresa: Empresa;
    baseLista: boolean;
    faltaColumnaIncluye: boolean;
}

interface EnCurso {
    doc: Presupuesto;
    estado: EstadoPresupuesto;
    id: string | null;
    numero: number | null;
    /** Firma de lo último que se guardó en la base. Si no coincide, hay cambios sin guardar. */
    firmaGuardada: string;
}

const firmaDe = (doc: Presupuesto, estado: EstadoPresupuesto) => JSON.stringify({ doc, estado });

function enBlanco(): EnCurso {
    const doc = presupuestoNuevo();
    return { doc, estado: "borrador", id: null, numero: null, firmaGuardada: firmaDe(doc, "borrador") };
}

function leerEnCurso(): EnCurso | null {
    try {
        const crudo = localStorage.getItem(CLAVE_EN_CURSO);
        if (!crudo) return null;
        const x = JSON.parse(crudo) as Partial<EnCurso>;
        return {
            doc: normalizar(x.doc),
            estado: ESTADOS.some((e) => e.valor === x.estado) ? (x.estado as EstadoPresupuesto) : "borrador",
            id: typeof x.id === "string" ? x.id : null,
            numero: typeof x.numero === "number" ? x.numero : null,
            firmaGuardada: typeof x.firmaGuardada === "string" ? x.firmaGuardada : "",
        };
    } catch {
        return null;
    }
}

export default function Presupuestador({
    planes,
    leads,
    catalogo: catalogoInicial,
    guardados: guardadosIniciales,
    empresa,
    baseLista,
    faltaColumnaIncluye,
}: Props) {
    const [enCurso, setEnCurso] = useState<EnCurso>(() => leerEnCurso() ?? enBlanco());
    const [catalogo, setCatalogo] = useState(catalogoInicial);
    const [guardados, setGuardados] = useState(guardadosIniciales);
    const [vista, setVista] = useState<"editar" | "previa">("editar");
    const [verGuardados, setVerGuardados] = useState(false);
    const [catalogoAbierto, setCatalogoAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const [menuDescarga, setMenuDescarga] = useState(false);
    const [descargando, setDescargando] = useState<"pdf" | "imagen" | null>(null);
    const temporizador = useRef<number | undefined>(undefined);
    const menu = useRef<HTMLDivElement>(null);
    const hojaParaDescargar = useRef<HTMLElement>(null);

    const { doc, estado, id, numero } = enCurso;
    const totales = calcularTotales(doc);
    const sucio = firmaDe(doc, estado) !== enCurso.firmaGuardada;
    const planesEnDolares = planes.some((p) => p.currency === "USD");

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_EN_CURSO, JSON.stringify(enCurso));
        } catch {
            // Sin almacenamiento (modo privado, cuota llena): el editor sigue andando igual.
        }
    }, [enCurso]);

    const atajoDeTeclado = useEffectEvent((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            void guardar();
        }
    });

    useEffect(() => {
        const alPresionar = (e: KeyboardEvent) => atajoDeTeclado(e);
        window.addEventListener("keydown", alPresionar);
        return () => {
            window.removeEventListener("keydown", alPresionar);
            window.clearTimeout(temporizador.current);
        };
    }, []);

    useEffect(() => {
        if (!menuDescarga) return;
        const alTocarAfuera = (e: PointerEvent) => {
            if (!menu.current?.contains(e.target as Node)) setMenuDescarga(false);
        };
        const alEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuDescarga(false);
        };
        document.addEventListener("pointerdown", alTocarAfuera);
        document.addEventListener("keydown", alEscape);
        return () => {
            document.removeEventListener("pointerdown", alTocarAfuera);
            document.removeEventListener("keydown", alEscape);
        };
    }, [menuDescarga]);

    /* ── Edición ─────────────────────────────────────────── */

    const editar = (cambio: (d: Presupuesto) => Presupuesto) => setEnCurso((e) => ({ ...e, doc: cambio(e.doc) }));
    const setCampo = <K extends keyof Presupuesto>(campo: K, valor: Presupuesto[K]) => editar((d) => ({ ...d, [campo]: valor }));
    const setCliente = (cambios: Partial<Presupuesto["cliente"]>) => editar((d) => ({ ...d, cliente: { ...d.cliente, ...cambios } }));
    const setLinea = (lineaId: string, cambios: Partial<Linea>) =>
        editar((d) => ({ ...d, lineas: d.lineas.map((l) => (l.id === lineaId ? { ...l, ...cambios } : l)) }));
    const setMensual = (mensualId: string, cambios: Partial<LineaMensual>) =>
        editar((d) => ({ ...d, mensuales: d.mensuales.map((m) => (m.id === mensualId ? { ...m, ...cambios } : m)) }));

    function avisar(texto: string) {
        setAviso(texto);
        window.clearTimeout(temporizador.current);
        temporizador.current = window.setTimeout(() => setAviso(null), 2600);
    }

    function elegirPlan(plan: PricingPlan) {
        editar((d) => {
            const yaEstaba = d.lineas.some((l) => l.tipo === "plan" && l.refId === plan.id);
            const sinPlan = d.lineas.filter((l) => l.tipo !== "plan");
            const sinMantenimiento = d.mensuales.filter((m) => !m.refId?.startsWith("mantenimiento:"));
            if (yaEstaba) return { ...d, lineas: sinPlan, mensuales: sinMantenimiento };

            const mantenimiento = lineaDeMantenimiento(plan);
            // El plazo sigue al plan mientras nadie lo haya escrito a mano.
            const plazoAutomatico = !d.plazo.trim() || PLAZOS_SUGERIDOS.includes(d.plazo.trim());
            return {
                ...d,
                lineas: [lineaDePlan(plan), ...sinPlan],
                mensuales: mantenimiento ? [mantenimiento, ...sinMantenimiento] : sinMantenimiento,
                plazo: plazoAutomatico ? plazoDePlan(plan.name) : d.plazo,
            };
        });
    }

    function alternarExtra(item: ItemCatalogo) {
        editar((d) => {
            if (item.is_recurring) {
                const esta = d.mensuales.some((m) => m.refId === item.id);
                return {
                    ...d,
                    mensuales: esta
                        ? d.mensuales.filter((m) => m.refId !== item.id)
                        : [...d.mensuales, lineaMensualDeCatalogo(item)],
                };
            }
            const esta = d.lineas.some((l) => l.refId === item.id);
            return {
                ...d,
                lineas: esta
                    ? d.lineas.filter((l) => l.refId !== item.id)
                    : [
                        ...d.lineas,
                        { id: nuevoId(), tipo: "extra", refId: item.id, nombre: item.name, detalle: item.description, incluye: [], cantidad: 1, unidad: item.unit, precio: Number(item.price) },
                    ],
            };
        });
    }

    function alternarMantenimiento(plan: PricingPlan) {
        const ref = refMantenimiento(plan);
        const linea = lineaDeMantenimiento(plan);
        editar((d) =>
            d.mensuales.some((m) => m.refId === ref)
                ? { ...d, mensuales: d.mensuales.filter((m) => m.refId !== ref) }
                : { ...d, mensuales: linea ? [...d.mensuales, linea] : d.mensuales }
        );
    }

    function agregarLineaLibre() {
        const linea = lineaLibre();
        editar((d) => ({ ...d, lineas: [...d.lineas, linea] }));
        requestAnimationFrame(() => document.getElementById(`linea-${linea.id}`)?.focus());
    }

    function agregarMensualLibre() {
        const linea = lineaMensualLibre();
        editar((d) => ({ ...d, mensuales: [...d.mensuales, linea] }));
        requestAnimationFrame(() => document.getElementById(`mensual-${linea.id}`)?.focus());
    }

    function moverLinea(indice: number, direccion: -1 | 1) {
        editar((d) => {
            const destino = indice + direccion;
            if (destino < 0 || destino >= d.lineas.length) return d;
            const lineas = [...d.lineas];
            [lineas[indice], lineas[destino]] = [lineas[destino], lineas[indice]];
            return { ...d, lineas };
        });
    }

    function traerLead(leadId: string) {
        const lead = leads.find((l) => l.id === leadId);
        if (!lead) return;
        const contacto = (lead.contact ?? "").trim();
        const esEmail = contacto.includes("@");
        const negocio = lead.business_type && lead.business_type !== "No especificado" ? lead.business_type : "";
        editar((d) => ({
            ...d,
            cliente: {
                nombre: lead.name || d.cliente.nombre,
                negocio: negocio || d.cliente.negocio,
                whatsapp: !esEmail && contacto ? contacto : d.cliente.whatsapp,
                email: esEmail ? contacto : d.cliente.email,
            },
        }));
        avisar(`Datos de ${lead.name || "la consulta"} cargados`);
    }

    /* ── Base de datos ───────────────────────────────────── */

    async function guardar(opciones: { estado?: EstadoPresupuesto; silencioso?: boolean } = {}) {
        if (!baseLista) {
            setError(`Para guardar falta crear la tabla de presupuestos: corré ${SQL_TABLAS} en el SQL Editor de Supabase.`);
            return null;
        }
        const estadoFinal = opciones.estado ?? estado;
        const cuerpo = {
            client_name: doc.cliente.nombre.trim() || doc.cliente.negocio.trim(),
            title: tituloDe(doc),
            status: estadoFinal,
            total: totales.total,
            data: doc,
        };
        setGuardando(true);
        setError(null);
        try {
            const fila = await escribir<PresupuestoGuardado>("quotes", id ? "PUT" : "POST", id ? { id, ...cuerpo } : cuerpo);
            const guardado = { ...fila, total: Number(fila.total) };
            setEnCurso((e) => ({ ...e, estado: estadoFinal, id: guardado.id, numero: guardado.number, firmaGuardada: firmaDe(doc, estadoFinal) }));
            setGuardados((lista) => [guardado, ...lista.filter((g) => g.id !== guardado.id)]);
            if (!opciones.silencioso) avisar(`Guardado · N° ${formatearNumero(guardado.number)}`);
            return guardado;
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo guardar el presupuesto");
            return null;
        } finally {
            setGuardando(false);
        }
    }

    function nuevo() {
        if (sucio && !confirm("Hay cambios sin guardar. ¿Empezar un presupuesto nuevo igual?")) return;
        setEnCurso(enBlanco());
        setError(null);
        setVista("editar");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function abrir(g: PresupuestoGuardado) {
        if (g.id !== id && sucio && !confirm("Hay cambios sin guardar en el presupuesto abierto. ¿Abrir este igual?")) return;
        const docGuardado = normalizar(g.data);
        setEnCurso({ doc: docGuardado, estado: g.status, id: g.id, numero: g.number, firmaGuardada: firmaDe(docGuardado, g.status) });
        setVerGuardados(false);
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function duplicar() {
        setEnCurso((e) => ({ doc: { ...e.doc, fecha: hoyISO() }, estado: "borrador", id: null, numero: null, firmaGuardada: "" }));
        avisar("Copia lista. Guardala para darle número.");
    }

    async function borrarGuardado(g: PresupuestoGuardado) {
        if (!confirm(`¿Borrar el presupuesto N° ${formatearNumero(g.number)}${g.client_name ? ` de ${g.client_name}` : ""}? No se puede deshacer.`)) return;
        try {
            await escribir("quotes", "DELETE", { id: g.id });
            setGuardados((lista) => lista.filter((x) => x.id !== g.id));
            if (g.id === id) setEnCurso((e) => ({ ...e, id: null, numero: null, firmaGuardada: "" }));
            avisar("Presupuesto borrado");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo borrar");
        }
    }

    async function cambiarEstadoGuardado(g: PresupuestoGuardado, nuevoEstado: EstadoPresupuesto) {
        try {
            const fila = await escribir<PresupuestoGuardado>("quotes", "PUT", { id: g.id, status: nuevoEstado });
            setGuardados((lista) => lista.map((x) => (x.id === g.id ? { ...fila, total: Number(fila.total) } : x)));
            if (g.id === id) {
                setEnCurso((e) => {
                    const limpio = firmaDe(e.doc, e.estado) === e.firmaGuardada;
                    return { ...e, estado: nuevoEstado, firmaGuardada: limpio ? firmaDe(e.doc, nuevoEstado) : e.firmaGuardada };
                });
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo cambiar el estado");
        }
    }

    /* ── Salidas ─────────────────────────────────────────── */

    /** Un archivo sin número no se puede referenciar después: se guarda antes de sacarlo. */
    async function numerar(): Promise<number | null | false> {
        if (!baseLista || (!sucio && id)) return numero;
        const guardado = await guardar({ silencioso: true });
        return guardado ? guardado.number : false;
    }

    async function descargar(formato: "pdf" | "imagen") {
        setMenuDescarga(false);
        const numeroFinal = await numerar();
        if (numeroFinal === false) return;

        // No se fotografía la vista previa, que cambia de ancho según la pantalla:
        // se monta una copia fuera de la vista con el ancho útil de un A4.
        setDescargando(formato);
        setError(null);
        try {
            let hoja = hojaParaDescargar.current;
            for (let i = 0; i < 60 && !hoja; i++) {
                await new Promise((listo) => requestAnimationFrame(listo));
                hoja = hojaParaDescargar.current;
            }
            if (!hoja) throw new Error("la hoja no llegó a prepararse");

            const nombre = nombreDeArchivo([
                "Presupuesto",
                formatearNumero(numeroFinal),
                doc.cliente.negocio.trim() || doc.cliente.nombre.trim(),
                "Logika",
            ]);
            if (formato === "pdf") {
                await descargarPdf(hoja, nombre, [`Presupuesto ${formatearNumero(numeroFinal)}`.trim(), tituloDe(doc)].join(" · "));
                avisar("PDF descargado");
            } else {
                await descargarImagen(hoja, nombre);
                avisar("Imagen descargada");
            }
        } catch (e) {
            setError(`No se pudo descargar${e instanceof Error ? `: ${e.message}` : ""}. Probá de nuevo.`);
        } finally {
            setDescargando(null);
        }
    }

    async function imprimir() {
        setMenuDescarga(false);
        const numeroFinal = await numerar();
        if (numeroFinal === false) return;
        const tituloAnterior = document.title;
        // El título de la pestaña es el nombre que el navegador le propone al PDF.
        document.title = ["Presupuesto", formatearNumero(numeroFinal), doc.cliente.negocio.trim() || doc.cliente.nombre.trim(), "Logika"]
            .filter(Boolean)
            .join(" - ");
        const restaurar = () => {
            document.title = tituloAnterior;
            window.removeEventListener("afterprint", restaurar);
        };
        window.addEventListener("afterprint", restaurar);
        // Dos cuadros: que el número recién asignado llegue a la hoja antes de imprimir.
        requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    }

    async function enviarWhatsApp() {
        // La ventana se abre YA, dentro del clic: si se abriera después de guardar,
        // el navegador la trataría como popup no pedido y la bloquearía.
        const ventana = window.open("about:blank", "_blank");
        if (ventana) ventana.opener = null;

        let numeroFinal = numero;
        if (baseLista) {
            const guardado = await guardar({ estado: estado === "borrador" ? "enviado" : estado, silencioso: true });
            if (guardado) {
                numeroFinal = guardado.number;
                avisar(`N° ${formatearNumero(guardado.number)} guardado y marcado como ${guardado.status}`);
            }
        }
        const url = `https://wa.me/${normalizarWhatsApp(doc.cliente.whatsapp)}?text=${encodeURIComponent(textoWhatsApp(doc, totales, numeroFinal, empresa))}`;
        if (ventana) ventana.location.href = url;
        else window.open(url, "_blank", "noopener,noreferrer");
    }

    async function copiarTexto() {
        try {
            await navigator.clipboard.writeText(textoWhatsApp(doc, totales, numero, empresa));
            avisar("Texto copiado. Pegalo en WhatsApp o en un mail.");
        } catch {
            setError("No se pudo copiar al portapapeles. Probá de nuevo.");
        }
    }

    /* ── Derivados para la vista ─────────────────────────── */

    const catalogoVisible = catalogo.filter((i) => i.is_active);
    // Los mensuales no viven con los extras: se cobran distinto y van en su sección.
    const extras = catalogoVisible.filter((i) => !i.is_recurring);
    const serviciosMensuales = catalogoVisible.filter((i) => i.is_recurring);
    const categorias = Array.from(new Set(extras.map((i) => i.category || "Extras")));
    const planesConCuota = planes.filter((p) => cuotaMensual(p));
    const planElegido = doc.lineas.find((l) => l.tipo === "plan");
    const filtrados = guardados.filter((g) =>
        `${formatearNumero(g.number)} ${g.client_name} ${g.title}`.toLowerCase().includes(busqueda.trim().toLowerCase())
    );

    return (
        <div className="space-y-5">
            {/* ── Encabezado ── */}
            <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
                <div>
                    <h1 className="font-body text-3xl font-black text-white">🧾 Presupuestos</h1>
                    <p className="mt-1 text-gray-400">Elegí el plan, sumá extras, ajustá los precios y mandalo. Todo se puede editar.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setVerGuardados((v) => !v)} aria-expanded={verGuardados} className={BOTON_SECUNDARIO}>
                        <span aria-hidden="true" className="material-icons text-lg">folder_open</span>
                        Guardados
                        <span className="rounded-sm bg-white/10 px-1.5 text-xs tabular-nums">{guardados.length}</span>
                    </button>
                    <button type="button" onClick={() => setCatalogoAbierto(true)} className={BOTON_SECUNDARIO}>
                        <span aria-hidden="true" className="material-icons text-lg">inventory_2</span>
                        Catálogo
                    </button>
                    <button type="button" onClick={nuevo} className={BOTON_PRIMARIO}>
                        <span aria-hidden="true" className="material-icons text-lg">add</span>
                        Nuevo
                    </button>
                </div>
            </div>

            {(!baseLista || planesEnDolares || faltaColumnaIncluye) && (
                <div role="note" className="flex items-start gap-3 rounded-sm border-2 border-accent-yellow/60 bg-accent-yellow/10 p-4 print:hidden">
                    <span aria-hidden="true" className="material-icons text-accent-yellow">construction</span>
                    <div className="text-sm">
                        <p className="font-bold text-accent-yellow">Falta un paso en la base de datos</p>
                        <p className="mt-1 text-white/80">
                            Corré{" "}
                            <code className="rounded-sm bg-black/40 px-1.5 py-0.5 text-white">
                                {baseLista ? SQL_MENSUALES : SQL_TABLAS}
                            </code>{" "}
                            en Supabase → SQL Editor.
                            {!baseLista && " Hasta entonces podés armar, descargar y mandar presupuestos, pero no guardarlos ni editar el catálogo."}
                            {planesEnDolares && " Los planes siguen en dólares en la base: acá se muestran convertidos a pesos."}
                            {baseLista && faltaColumnaIncluye && " Falta la columna de renglones del catálogo: los servicios mensuales funcionan, pero su \"qué incluye\" no se guarda."}
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-sm border-2 border-hot-coral bg-hot-coral/10 p-4 print:hidden">
                    <span aria-hidden="true" className="material-icons text-hot-coral">error_outline</span>
                    <p className="flex-1 text-sm font-medium text-white/90">{error}</p>
                    <button type="button" onClick={() => setError(null)} aria-label="Cerrar aviso" className="text-white/50 hover:text-white">
                        <span aria-hidden="true" className="material-icons text-lg">close</span>
                    </button>
                </div>
            )}

            {/* ── Guardados ── */}
            {verGuardados && (
                <section aria-label="Presupuestos guardados" className="rounded-sm border-2 border-white/10 bg-[#1e1530] print:hidden">
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-white/10 px-5 py-3">
                        <h2 className="font-display text-base font-bold text-white">Presupuestos guardados</h2>
                        <input
                            type="search"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por cliente, título o número"
                            aria-label="Buscar presupuestos"
                            className="admin-input w-full py-1.5! text-sm sm:w-72"
                        />
                    </header>
                    {!baseLista ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">Todavía no se pueden guardar presupuestos: falta correr el SQL.</p>
                    ) : filtrados.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">
                            {guardados.length === 0 ? "Todavía no guardaste ninguno. El primero va a ser el N° 0001." : "Ninguno coincide con la búsqueda."}
                        </p>
                    ) : (
                        <ul className="max-h-[26rem] divide-y-2 divide-white/5 overflow-y-auto">
                            {filtrados.map((g) => {
                                const claseEstado = ESTADOS.find((e) => e.valor === g.status)?.clase ?? "";
                                return (
                                    <li
                                        key={g.id}
                                        className={`grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-3 lg:grid-cols-[4.5rem_minmax(0,1fr)_8rem_8rem_4.5rem_auto] ${g.id === id ? "bg-primary/10" : ""}`}
                                    >
                                        <span className="font-display font-bold text-white tabular-nums">{formatearNumero(g.number)}</span>
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-white">{g.client_name || "Sin nombre"}</p>
                                            <p className="truncate text-xs text-gray-400">{g.title}</p>
                                        </div>
                                        <span className="text-right font-bold text-white tabular-nums lg:order-none">{formatearPesos(g.total)}</span>
                                        <select
                                            value={g.status}
                                            aria-label={`Estado del presupuesto ${formatearNumero(g.number)}`}
                                            onChange={(e) => cambiarEstadoGuardado(g, e.target.value as EstadoPresupuesto)}
                                            className={`col-start-2 rounded-sm border px-2 py-1 text-xs font-bold [color-scheme:dark] lg:col-start-auto ${claseEstado}`}
                                        >
                                            {ESTADOS.map((e) => (
                                                <option key={e.valor} value={e.valor} className="bg-[#1e1530] text-white">
                                                    {e.etiqueta}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="hidden text-xs text-gray-500 lg:block">
                                            {new Date(g.updated_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                                        </span>
                                        <div className="flex items-center justify-end gap-1">
                                            <button type="button" onClick={() => abrir(g)} className="rounded-sm bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20">
                                                {g.id === id ? "Abierto" : "Abrir"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => borrarGuardado(g)}
                                                aria-label={`Borrar presupuesto ${formatearNumero(g.number)}`}
                                                className="grid h-8 w-8 place-items-center rounded-sm text-gray-500 hover:bg-hot-coral/15 hover:text-hot-coral"
                                            >
                                                <span aria-hidden="true" className="material-icons text-lg">delete_outline</span>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            )}

            {/* ── Barra de acciones ── */}
            <div className="sticky top-0 z-30 -mx-8 border-y-2 border-white/10 bg-[#191121]/95 px-8 py-3 backdrop-blur print:hidden">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <div className="mr-auto flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-display text-lg font-bold text-white tabular-nums">
                            {numero ? `N° ${formatearNumero(numero)}` : "Sin número"}
                        </span>
                        <select
                            value={estado}
                            aria-label="Estado del presupuesto"
                            onChange={(e) => setEnCurso((x) => ({ ...x, estado: e.target.value as EstadoPresupuesto }))}
                            className={`rounded-sm border px-2 py-1 text-xs font-bold [color-scheme:dark] ${ESTADOS.find((e) => e.valor === estado)?.clase ?? ""}`}
                        >
                            {ESTADOS.map((e) => (
                                <option key={e.valor} value={e.valor} className="bg-[#1e1530] text-white">
                                    {e.etiqueta}
                                </option>
                            ))}
                        </select>
                        <span className="text-xs font-bold" aria-live="polite">
                            {guardando ? (
                                <span className="text-gray-400">Guardando…</span>
                            ) : sucio ? (
                                <span className="text-accent-yellow">● Sin guardar</span>
                            ) : id ? (
                                <span className="text-secondary">✓ Guardado</span>
                            ) : null}
                        </span>
                        <span className="text-sm text-gray-400">
                            Total <strong className="font-display text-base text-white tabular-nums">{formatearPesos(totales.total)}</strong>
                        </span>
                    </div>

                    <div role="tablist" aria-label="Vista" className="flex rounded-sm border-2 border-white/15 p-0.5 xl:hidden">
                        {(["editar", "previa"] as const).map((v) => (
                            <button
                                key={v}
                                type="button"
                                role="tab"
                                aria-selected={vista === v}
                                onClick={() => setVista(v)}
                                className={`rounded-sm px-3 py-1.5 text-xs font-bold ${vista === v ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`}
                            >
                                {v === "editar" ? "Editar" : "Vista previa"}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => guardar()} disabled={guardando} className={BOTON_PRIMARIO} title="Guardar (Ctrl+S)">
                            <span aria-hidden="true" className="material-icons text-lg">save</span>
                            Guardar
                        </button>
                        <div ref={menu} className="relative">
                            <button
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={menuDescarga}
                                onClick={() => setMenuDescarga((v) => !v)}
                                disabled={guardando || descargando !== null}
                                className={BOTON_SECUNDARIO}
                            >
                                <span aria-hidden="true" className={`material-icons text-lg ${descargando ? "animate-spin" : ""}`}>
                                    {descargando ? "progress_activity" : "download"}
                                </span>
                                {descargando === "pdf" ? "Armando PDF…" : descargando === "imagen" ? "Armando imagen…" : "Descargar"}
                                {!descargando && <span aria-hidden="true" className="material-icons -mr-1 text-lg">expand_more</span>}
                            </button>
                            {menuDescarga && (
                                <div
                                    role="menu"
                                    aria-label="Descargar presupuesto"
                                    className="absolute right-0 top-full z-40 mt-2 w-72 rounded-sm border-2 border-black bg-[#1e1530] p-1.5 shadow-neobrutalism-primary"
                                >
                                    <OpcionDescarga autoFocus icono="picture_as_pdf" titulo="PDF" detalle="Hoja A4, para mandar o imprimir" onClick={() => descargar("pdf")} />
                                    <OpcionDescarga icono="image" titulo="Imagen" detalle="PNG, cómodo para mandar por WhatsApp" onClick={() => descargar("imagen")} />
                                    <div className="mx-2 my-1 border-t border-white/10" />
                                    <OpcionDescarga icono="print" titulo="Imprimir" detalle="Abre el diálogo de impresión" onClick={imprimir} />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={enviarWhatsApp}
                            disabled={guardando}
                            className="inline-flex items-center justify-center gap-1.5 rounded-sm border-2 border-black bg-secondary px-3.5 py-2 text-sm font-bold text-ink-black shadow-neobrutalism-sm transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:pointer-events-none disabled:opacity-50"
                            title={doc.cliente.whatsapp.trim() ? `Mandar a ${doc.cliente.whatsapp}` : "Abrir WhatsApp y elegir el contacto"}
                        >
                            <IconoWhatsApp />
                            WhatsApp
                        </button>
                        <button type="button" onClick={copiarTexto} className={BOTON_SECUNDARIO} aria-label="Copiar como texto" title="Copiar como texto">
                            <span aria-hidden="true" className="material-icons text-lg">content_copy</span>
                        </button>
                        <button type="button" onClick={duplicar} className={BOTON_SECUNDARIO} aria-label="Duplicar presupuesto" title="Duplicar (arranca uno nuevo con esta base)">
                            <span aria-hidden="true" className="material-icons text-lg">control_point_duplicate</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] xl:items-start print:mb-0 print:block">
                {/* ══════════════ Editor ══════════════ */}
                <div className={`${vista === "editar" ? "" : "hidden"} space-y-5 xl:block print:hidden`}>
                    <Seccion
                        numero={1}
                        titulo="Cliente"
                        descripcion="Para quién es"
                        accion={
                            leads.length > 0 && (
                                <select
                                    value=""
                                    onChange={(e) => traerLead(e.target.value)}
                                    aria-label="Traer datos de una consulta recibida"
                                    className="admin-input max-w-[15rem] py-1.5! text-xs [color-scheme:dark]"
                                >
                                    <option value="">Traer de una consulta…</option>
                                    {leads.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.name || "Sin nombre"}
                                            {l.business_type && l.business_type !== "No especificado" ? ` · ${l.business_type}` : ""}
                                        </option>
                                    ))}
                                </select>
                            )
                        }
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Campo etiqueta="Nombre">
                                <input className="admin-input w-full" value={doc.cliente.nombre} placeholder="Juana Pérez" onChange={(e) => setCliente({ nombre: e.target.value })} />
                            </Campo>
                            <Campo etiqueta="Negocio o rubro">
                                <input className="admin-input w-full" value={doc.cliente.negocio} placeholder="Panadería La Espiga" onChange={(e) => setCliente({ negocio: e.target.value })} />
                            </Campo>
                            <Campo etiqueta="WhatsApp">
                                <input className="admin-input w-full" inputMode="tel" value={doc.cliente.whatsapp} placeholder="11 2345-6789" onChange={(e) => setCliente({ whatsapp: e.target.value })} />
                            </Campo>
                            <Campo etiqueta="Email">
                                <input className="admin-input w-full" type="email" value={doc.cliente.email} placeholder="juana@gmail.com" onChange={(e) => setCliente({ email: e.target.value })} />
                            </Campo>
                            <Campo etiqueta="Título del presupuesto" className="sm:col-span-2">
                                <input className="admin-input w-full" value={doc.titulo} placeholder={tituloDe({ ...doc, titulo: "" })} onChange={(e) => setCampo("titulo", e.target.value)} />
                            </Campo>
                        </div>
                    </Seccion>

                    <Seccion numero={2} titulo="Plan base" descripcion="Tocá uno para sumarlo; tocalo de nuevo para sacarlo">
                        {planes.length === 0 ? (
                            <p className="text-sm text-gray-400">No hay planes activos. Cargalos en Precios.</p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-3">
                                {planes.map((plan) => {
                                    const activo = planElegido?.refId === plan.id;
                                    const cuota = cuotaMensual(plan);
                                    return (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            aria-pressed={activo}
                                            onClick={() => elegirPlan(plan)}
                                            className={`relative flex flex-col items-start rounded-sm border-2 p-4 text-left transition-all ${activo
                                                ? "border-black bg-primary text-white shadow-neobrutalism"
                                                : "border-white/15 bg-white/5 text-white hover:border-primary/70 hover:bg-white/10"
                                                }`}
                                        >
                                            {plan.is_featured && plan.featured_label && (
                                                <span className="absolute -top-2.5 left-3 rounded-sm border-2 border-black bg-accent-yellow px-1.5 text-[10px] font-black uppercase tracking-wider text-ink-black">
                                                    {plan.featured_label}
                                                </span>
                                            )}
                                            <span aria-hidden="true" className={`material-icons absolute right-3 top-3 text-lg ${activo ? "text-white" : "text-white/20"}`}>
                                                {activo ? "check_circle" : "radio_button_unchecked"}
                                            </span>
                                            <span className="pr-6 font-display text-base font-bold leading-tight">{plan.name}</span>
                                            <span className={`mt-0.5 text-xs leading-snug ${activo ? "text-white/80" : "text-gray-400"}`}>{plan.subtitle}</span>
                                            <span className="mt-3 font-display text-xl font-bold tabular-nums">{formatearPesos(precioDePlan(plan))}</span>
                                            {cuota && (
                                                <span className={`text-[11px] ${activo ? "text-white/75" : "text-gray-500"}`}>
                                                    + {formatearPesos(cuota)}/mes opcional
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </Seccion>

                    <Seccion
                        numero={3}
                        titulo="Extras"
                        descripcion="Del catálogo, con un clic"
                        accion={
                            <button type="button" onClick={() => setCatalogoAbierto(true)} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] hover:text-white">
                                <span aria-hidden="true" className="material-icons text-base">edit</span>
                                Editar catálogo
                            </button>
                        }
                    >
                        {extras.length === 0 ? (
                            <p className="text-sm text-gray-400">No hay extras cargados. Sumalos desde “Editar catálogo”.</p>
                        ) : (
                            <div className="space-y-4">
                                {categorias.map((categoria) => (
                                    <div key={categoria}>
                                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">{categoria}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {extras
                                                .filter((i) => (i.category || "Extras") === categoria)
                                                .map((item) => (
                                                    <ChipAgregar
                                                        key={item.id}
                                                        activo={doc.lineas.some((l) => l.refId === item.id)}
                                                        nombre={item.name}
                                                        precio={`${formatearPesos(item.price)}${item.unit ? ` ${item.unit}` : ""}`}
                                                        detalle={item.description}
                                                        onClick={() => alternarExtra(item)}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Seccion>

                    <Seccion
                        numero={4}
                        titulo="Detalle y precios"
                        descripcion="Cambiá nombres, cantidades y montos de cada ítem"
                        accion={
                            <button type="button" onClick={agregarLineaLibre} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] hover:text-white">
                                <span aria-hidden="true" className="material-icons text-base">add</span>
                                Ítem libre
                            </button>
                        }
                    >
                        {doc.lineas.length === 0 ? (
                            <div className="rounded-sm border-2 border-dashed border-white/15 px-4 py-8 text-center">
                                <p className="text-sm text-gray-400">Elegí un plan o un extra, o sumá un ítem a mano.</p>
                                <button type="button" onClick={agregarLineaLibre} className={`${BOTON_SECUNDARIO} mt-3`}>
                                    <span aria-hidden="true" className="material-icons text-lg">add</span>
                                    Agregar ítem
                                </button>
                            </div>
                        ) : (
                            <ol className="space-y-3">
                                {doc.lineas.map((linea, i) => (
                                    <EditorLinea
                                        key={linea.id}
                                        linea={linea}
                                        posicion={i}
                                        total={doc.lineas.length}
                                        sugerencias={linea.tipo === "plan" ? sugerenciasDePlan(linea.nombre, planes) : []}
                                        onCambio={(cambios) => setLinea(linea.id, cambios)}
                                        onMover={(dir) => moverLinea(i, dir)}
                                        onQuitar={() => editar((d) => ({ ...d, lineas: d.lineas.filter((l) => l.id !== linea.id) }))}
                                    />
                                ))}
                            </ol>
                        )}
                    </Seccion>

                    <Seccion
                        numero={5}
                        titulo="Servicios mensuales"
                        descripcion="Opcional. Van aparte del total del proyecto"
                        accion={
                            <button type="button" onClick={() => setCatalogoAbierto(true)} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] hover:text-white">
                                <span aria-hidden="true" className="material-icons text-base">edit</span>
                                Editar catálogo
                            </button>
                        }
                    >
                        <div className="space-y-4">
                            {planesConCuota.length > 0 && (
                                <div>
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Mantenimiento del plan</p>
                                    <div className="flex flex-wrap gap-2">
                                        {planesConCuota.map((plan) => (
                                            <ChipAgregar
                                                key={plan.id}
                                                activo={doc.mensuales.some((m) => m.refId === refMantenimiento(plan))}
                                                nombre={plan.name}
                                                precio={`${formatearPesos(cuotaMensual(plan)!)}/mes`}
                                                detalle="La cuota que publica el sitio para este plan"
                                                onClick={() => alternarMantenimiento(plan)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {serviciosMensuales.length > 0 && (
                                <div>
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Del catálogo</p>
                                    <div className="flex flex-wrap gap-2">
                                        {serviciosMensuales.map((item) => (
                                            <ChipAgregar
                                                key={item.id}
                                                activo={doc.mensuales.some((m) => m.refId === item.id)}
                                                nombre={item.name}
                                                precio={`${formatearPesos(item.price)}/mes`}
                                                detalle={item.description}
                                                onClick={() => alternarExtra(item)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {planesConCuota.length === 0 && serviciosMensuales.length === 0 && (
                                <p className="text-sm text-gray-400">
                                    No hay servicios mensuales cargados. Agregalos desde “Editar catálogo”, o sumá uno a mano acá abajo.
                                </p>
                            )}
                        </div>

                        {doc.mensuales.length > 0 && (
                            <ul className="mt-4 space-y-3">
                                {doc.mensuales.map((m) => (
                                    <EditorMensual
                                        key={m.id}
                                        mensual={m}
                                        onCambio={(cambios) => setMensual(m.id, cambios)}
                                        onQuitar={() => editar((d) => ({ ...d, mensuales: d.mensuales.filter((x) => x.id !== m.id) }))}
                                    />
                                ))}
                            </ul>
                        )}

                        <button
                            type="button"
                            onClick={agregarMensualLibre}
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-sm border-2 border-dashed border-white/15 py-2.5 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] transition-colors hover:border-white/40 hover:text-white"
                        >
                            <span aria-hidden="true" className="material-icons text-base">add</span>
                            Servicio mensual a mano
                        </button>
                    </Seccion>

                    <Seccion numero={6} titulo="Descuento y forma de pago">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Descuento</span>
                                <div className="flex gap-2">
                                    <div role="radiogroup" aria-label="Tipo de descuento" className="flex shrink-0 rounded-sm border-2 border-white/15 p-0.5">
                                        {(["porcentaje", "monto"] as const).map((modo) => (
                                            <button
                                                key={modo}
                                                type="button"
                                                role="radio"
                                                aria-checked={doc.descuento.modo === modo}
                                                aria-label={modo === "porcentaje" ? "Porcentaje" : "Monto fijo"}
                                                onClick={() => setCampo("descuento", { ...doc.descuento, modo, valor: 0 })}
                                                className={`w-9 rounded-sm text-sm font-bold ${doc.descuento.modo === modo ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`}
                                            >
                                                {modo === "porcentaje" ? "%" : "$"}
                                            </button>
                                        ))}
                                    </div>
                                    {doc.descuento.modo === "porcentaje" ? (
                                        <NumeroInput className="flex-1" etiqueta="Porcentaje de descuento" sufijo="%" max={100} valor={doc.descuento.valor} onChange={(valor) => setCampo("descuento", { ...doc.descuento, valor })} />
                                    ) : (
                                        <PesosInput className="flex-1" etiqueta="Monto de descuento" valor={doc.descuento.valor} onChange={(valor) => setCampo("descuento", { ...doc.descuento, valor })} />
                                    )}
                                </div>
                                <input
                                    className="admin-input w-full py-1.5! text-sm"
                                    aria-label="Motivo del descuento"
                                    placeholder="Motivo (opcional): pago contado, referido…"
                                    value={doc.descuento.motivo}
                                    onChange={(e) => setCampo("descuento", { ...doc.descuento, motivo: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Recargo o impuesto</span>
                                <div className="flex gap-2">
                                    <input
                                        className="admin-input w-24 shrink-0"
                                        aria-label="Nombre del recargo"
                                        placeholder="IVA"
                                        value={doc.recargo.etiqueta}
                                        onChange={(e) => setCampo("recargo", { ...doc.recargo, etiqueta: e.target.value })}
                                    />
                                    <NumeroInput className="flex-1" etiqueta="Porcentaje de recargo" sufijo="%" max={100} valor={doc.recargo.porcentaje} onChange={(porcentaje) => setCampo("recargo", { ...doc.recargo, porcentaje })} />
                                </div>
                                <Atajos
                                    opciones={[0, 10.5, 21]}
                                    actual={doc.recargo.porcentaje}
                                    formato={(v) => (v === 0 ? "Sin recargo" : `${String(v).replace(".", ",")}%`)}
                                    onElegir={(porcentaje) => setCampo("recargo", { ...doc.recargo, porcentaje })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Campo etiqueta="Seña para arrancar">
                                    <NumeroInput etiqueta="Porcentaje de seña" sufijo="%" max={100} valor={doc.senaPorcentaje} onChange={(n) => setCampo("senaPorcentaje", n)} />
                                </Campo>
                                <Atajos opciones={[30, 50, 100]} actual={doc.senaPorcentaje} formato={(v) => `${v}%`} onElegir={(n) => setCampo("senaPorcentaje", n)} />
                            </div>

                            <Campo etiqueta="Medios de pago">
                                <textarea className="admin-input w-full resize-y text-sm" rows={2} value={doc.mediosDePago} onChange={(e) => setCampo("mediosDePago", e.target.value)} />
                            </Campo>
                        </div>

                        <dl className="mt-5 space-y-1.5 rounded-sm border-2 border-white/10 bg-black/20 p-4 text-sm">
                            <FilaResumen etiqueta="Subtotal" valor={formatearPesos(totales.subtotal)} />
                            {totales.descuento > 0 && <FilaResumen etiqueta="Descuento" valor={`−${formatearPesos(totales.descuento)}`} />}
                            {totales.recargo > 0 && <FilaResumen etiqueta={doc.recargo.etiqueta || "Recargo"} valor={`+${formatearPesos(totales.recargo)}`} />}
                            <div className="flex items-baseline justify-between gap-4 border-t-2 border-white/10 pt-2">
                                <dt className="font-bold uppercase tracking-wider text-white">Total</dt>
                                <dd className="font-display text-2xl font-bold text-accent-yellow tabular-nums">{formatearPesos(totales.total)}</dd>
                            </div>
                            {totales.sena > 0 && totales.saldo > 0 && (
                                <>
                                    <FilaResumen etiqueta={`Seña ${doc.senaPorcentaje}%`} valor={formatearPesos(totales.sena)} />
                                    <FilaResumen etiqueta="Al entregar" valor={formatearPesos(totales.saldo)} />
                                </>
                            )}
                            {totales.mensual > 0 && <FilaResumen etiqueta="Mensual opcional" valor={`${formatearPesos(totales.mensual)}/mes`} />}
                        </dl>
                    </Seccion>

                    <Seccion numero={7} titulo="Plazos y condiciones">
                        <div className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Campo etiqueta="Fecha">
                                    <input type="date" className="admin-input w-full [color-scheme:dark]" value={doc.fecha} onChange={(e) => setCampo("fecha", e.target.value || hoyISO())} />
                                </Campo>
                                <div className="space-y-2">
                                    <Campo etiqueta="Validez">
                                        <NumeroInput etiqueta="Días de validez" sufijo="días" max={365} valor={doc.validezDias} onChange={(n) => setCampo("validezDias", Math.round(n))} />
                                    </Campo>
                                    <Atajos opciones={[7, 15, 30]} actual={doc.validezDias} formato={(v) => `${v} días`} onElegir={(n) => setCampo("validezDias", n)} />
                                </div>
                                <div className="space-y-2">
                                    <Campo etiqueta="Plazo de entrega">
                                        <input className="admin-input w-full" value={doc.plazo} placeholder="2 a 4 semanas" onChange={(e) => setCampo("plazo", e.target.value)} />
                                    </Campo>
                                    <Atajos opciones={PLAZOS_SUGERIDOS} actual={doc.plazo} onElegir={(v) => setCampo("plazo", v)} />
                                </div>
                            </div>

                            <Campo etiqueta="Mensaje de presentación">
                                <textarea className="admin-input w-full resize-y text-sm" rows={3} value={doc.mensaje} onChange={(e) => setCampo("mensaje", e.target.value)} />
                            </Campo>

                            <Campo etiqueta="Garantía (va como sello; vacío para ocultarlo)">
                                <input className="admin-input w-full" value={doc.garantia} onChange={(e) => setCampo("garantia", e.target.value)} />
                            </Campo>

                            <div className="grid gap-5 lg:grid-cols-2">
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Lo que pone el cliente</span>
                                        <BotonRestaurar onClick={() => setCampo("aportaCliente", [...APORTA_CLIENTE_POR_DEFECTO])} />
                                    </div>
                                    <ListaEditable items={doc.aportaCliente} onChange={(v) => setCampo("aportaCliente", v)} placeholder="Algo que aporta el cliente" agregar="Agregar" />
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Condiciones</span>
                                        <BotonRestaurar onClick={() => setCampo("condiciones", [...CONDICIONES_POR_DEFECTO])} />
                                    </div>
                                    <ListaEditable items={doc.condiciones} onChange={(v) => setCampo("condiciones", v)} placeholder="Condición" agregar="Agregar condición" />
                                </div>
                            </div>

                            <Campo etiqueta="Notas (opcional)">
                                <textarea className="admin-input w-full resize-y text-sm" rows={2} value={doc.notas} placeholder="Algo puntual de este proyecto" onChange={(e) => setCampo("notas", e.target.value)} />
                            </Campo>
                        </div>
                    </Seccion>
                </div>

                {/* ══════════════ Vista previa ══════════════ */}
                <div className={`${vista === "previa" ? "" : "hidden"} xl:sticky xl:top-[5.5rem] xl:block xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pb-3 xl:pr-3 print:static print:block print:max-h-none print:overflow-visible print:p-0`}>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 print:hidden">Vista previa · así lo recibe el cliente</p>
                    <HojaPresupuesto presupuesto={doc} totales={totales} numero={numero} empresa={empresa} />
                </div>
            </div>

            {descargando && (
                <div aria-hidden="true" inert className="pointer-events-none fixed -left-[10000px] top-0 print:hidden" style={{ width: ANCHO_HOJA_PX }}>
                    <HojaPresupuesto ref={hojaParaDescargar} papel presupuesto={doc} totales={totales} numero={numero} empresa={empresa} />
                </div>
            )}

            <Catalogo abierto={catalogoAbierto} onCerrar={() => setCatalogoAbierto(false)} items={catalogo} onCambio={setCatalogo} baseLista={baseLista} />

            <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-50 print:hidden">
                {aviso && (
                    <p className="rounded-sm border-2 border-black bg-accent-yellow px-4 py-2.5 text-sm font-bold text-ink-black shadow-neobrutalism">{aviso}</p>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Piezas
   ───────────────────────────────────────────────────────────── */

const ETIQUETA_TIPO: Record<Linea["tipo"], { texto: string; clase: string }> = {
    plan: { texto: "Plan", clase: "border-primary/60 bg-primary/20 text-[#d4b5f7]" },
    extra: { texto: "Extra", clase: "border-accent-yellow/50 bg-accent-yellow/10 text-accent-yellow" },
    libre: { texto: "Libre", clase: "border-white/20 bg-white/5 text-gray-300" },
};

function EditorLinea({
    linea: l,
    posicion,
    total,
    sugerencias,
    onCambio,
    onMover,
    onQuitar,
}: {
    linea: Linea;
    posicion: number;
    total: number;
    sugerencias: string[];
    onCambio: (cambios: Partial<Linea>) => void;
    onMover: (direccion: -1 | 1) => void;
    onQuitar: () => void;
}) {
    const tipo = ETIQUETA_TIPO[l.tipo];
    const incluidos = new Set(l.incluye.map((i) => i.trim().toLowerCase()));
    const faltantes = sugerencias.filter((s) => !incluidos.has(s.toLowerCase()));
    const cantidadIncluye = l.incluye.filter((i) => i.trim()).length;

    return (
        <li className="rounded-sm border-2 border-white/10 bg-white/[0.03]">
            <div className="flex gap-3 p-3">
                <div className="grid min-w-0 flex-1 gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${tipo.clase}`}>{tipo.texto}</span>
                        <input
                            id={`linea-${l.id}`}
                            className="admin-input w-full py-2! font-bold"
                            aria-label="Nombre del ítem"
                            placeholder="Nombre del ítem"
                            value={l.nombre}
                            onChange={(e) => onCambio({ nombre: e.target.value })}
                        />
                    </div>
                    <input
                        className="admin-input w-full py-1.5! text-sm"
                        aria-label="Descripción del ítem"
                        placeholder="Descripción corta (opcional)"
                        value={l.detalle}
                        onChange={(e) => onCambio({ detalle: e.target.value })}
                    />
                </div>
                <div className="flex shrink-0 flex-col">
                    <BotonIcono icono="keyboard_arrow_up" etiqueta="Subir ítem" disabled={posicion === 0} onClick={() => onMover(-1)} />
                    <BotonIcono icono="keyboard_arrow_down" etiqueta="Bajar ítem" disabled={posicion === total - 1} onClick={() => onMover(1)} />
                    <BotonIcono icono="delete_outline" etiqueta="Quitar ítem" peligro onClick={onQuitar} />
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-3 border-t-2 border-white/5 px-3 py-3">
                <div className="space-y-1">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Cantidad</span>
                    <Cantidad etiqueta={`Cantidad de ${l.nombre || "ítem"}`} valor={l.cantidad} onChange={(cantidad) => onCambio({ cantidad })} />
                </div>
                <Campo etiqueta="Unidad" className="w-28">
                    <input className="admin-input w-full text-sm" placeholder="opcional" value={l.unidad} onChange={(e) => onCambio({ unidad: e.target.value })} />
                </Campo>
                <div className="w-40 space-y-1">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Precio unitario</span>
                    <PesosInput etiqueta={`Precio de ${l.nombre || "ítem"}`} valor={l.precio} onChange={(precio) => onCambio({ precio })} />
                </div>
                <div className="ml-auto text-right">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Subtotal</span>
                    <span className="font-display text-xl font-bold text-white tabular-nums">{formatearPesos(l.cantidad * l.precio)}</span>
                </div>
            </div>

            <details className="group border-t-2 border-white/5">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">
                    <span aria-hidden="true" className="material-icons text-base transition-transform group-open:rotate-90">chevron_right</span>
                    Qué incluye{cantidadIncluye > 0 ? ` (${cantidadIncluye})` : ""}
                </summary>
                <div className="space-y-3 px-3 pb-3">
                    <ListaEditable items={l.incluye} onChange={(incluye) => onCambio({ incluye })} placeholder="Algo que incluye" agregar="Agregar renglón" />
                    {faltantes.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Sumar de la ficha del servicio</p>
                            <div className="flex flex-wrap gap-1.5">
                                {faltantes.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => onCambio({ incluye: [...l.incluye.filter((i) => i.trim()), s] })}
                                        className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-xs font-medium text-gray-300 hover:border-primary hover:text-white"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </details>
        </li>
    );
}

/** Un servicio mensual dentro del presupuesto: nombre, precio y sus renglones. */
function EditorMensual({
    mensual: m,
    onCambio,
    onQuitar,
}: {
    mensual: LineaMensual;
    onCambio: (cambios: Partial<LineaMensual>) => void;
    onQuitar: () => void;
}) {
    const cantidadIncluye = m.incluye.filter((i) => i.trim()).length;

    return (
        <li className="rounded-sm border-2 border-white/10 bg-white/[0.03]">
            <div className="grid gap-2 p-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-start">
                <div className="grid gap-2">
                    <input
                        id={`mensual-${m.id}`}
                        className="admin-input w-full py-2! font-bold"
                        aria-label="Nombre del servicio mensual"
                        placeholder="Nombre del servicio mensual"
                        value={m.nombre}
                        onChange={(e) => onCambio({ nombre: e.target.value })}
                    />
                    <input
                        className="admin-input w-full py-1.5! text-sm"
                        aria-label="Descripción del servicio mensual"
                        placeholder="Descripción corta (opcional)"
                        value={m.detalle}
                        onChange={(e) => onCambio({ detalle: e.target.value })}
                    />
                </div>
                <PesosInput etiqueta={`Precio por mes de ${m.nombre || "el servicio"}`} valor={m.precio} sufijo="/mes" onChange={(precio) => onCambio({ precio })} />
                <BotonIcono icono="delete_outline" etiqueta="Quitar servicio mensual" peligro onClick={onQuitar} />
            </div>
            <details className="group border-t-2 border-white/5">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">
                    <span aria-hidden="true" className="material-icons text-base transition-transform group-open:rotate-90">chevron_right</span>
                    Qué incluye{cantidadIncluye > 0 ? ` (${cantidadIncluye})` : ""}
                </summary>
                <div className="px-3 pb-3">
                    <ListaEditable
                        items={m.incluye}
                        onChange={(incluye) => onCambio({ incluye })}
                        placeholder="Algo que incluye la cuota"
                        agregar="Agregar renglón"
                    />
                </div>
            </details>
        </li>
    );
}

/** El botón de sumar del catálogo: mismo gesto para extras, planes y mensuales. */
function ChipAgregar({
    activo,
    nombre,
    precio,
    detalle,
    onClick,
}: {
    activo: boolean;
    nombre: string;
    precio: string;
    detalle?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={activo}
            onClick={onClick}
            title={detalle}
            className={`inline-flex items-center gap-2 rounded-sm border-2 px-3 py-2 text-left text-sm font-bold transition-all ${activo
                ? "border-black bg-accent-yellow text-ink-black shadow-neobrutalism-sm"
                : "border-white/15 bg-white/5 text-white hover:border-white/40"
                }`}
        >
            <span aria-hidden="true" className="material-icons text-base">{activo ? "check" : "add"}</span>
            {nombre}
            <span className={`font-medium tabular-nums ${activo ? "text-ink-black/70" : "text-gray-400"}`}>{precio}</span>
        </button>
    );
}

function BotonIcono({ icono, etiqueta, onClick, disabled, peligro }: { icono: string; etiqueta: string; onClick: () => void; disabled?: boolean; peligro?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={etiqueta}
            title={etiqueta}
            className={`grid h-9 w-9 place-items-center rounded-sm text-gray-400 transition-colors disabled:pointer-events-none disabled:opacity-25 ${peligro ? "hover:bg-hot-coral/15 hover:text-hot-coral" : "hover:bg-white/10 hover:text-white"}`}
        >
            <span aria-hidden="true" className="material-icons text-xl">{icono}</span>
        </button>
    );
}

function OpcionDescarga({
    icono,
    titulo,
    detalle,
    onClick,
    autoFocus,
}: {
    icono: string;
    titulo: string;
    detalle: string;
    onClick: () => void;
    autoFocus?: boolean;
}) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            autoFocus={autoFocus}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-white/10 focus-visible:bg-white/10"
        >
            <span aria-hidden="true" className="material-icons text-xl text-[#c9a3f5]">{icono}</span>
            <span>
                <span className="block text-sm font-bold text-white">{titulo}</span>
                <span className="block text-xs text-gray-400">{detalle}</span>
            </span>
        </button>
    );
}

function BotonRestaurar({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="text-[11px] font-bold text-gray-500 underline-offset-2 hover:text-white hover:underline">
            Restaurar los de Logika
        </button>
    );
}

function FilaResumen({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="text-gray-400">{etiqueta}</dt>
            <dd className="font-bold text-white tabular-nums">{valor}</dd>
        </div>
    );
}

function IconoWhatsApp() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    );
}
