/**
 * Cuentas de los clientes: cuánto se cobró de cada trabajo, cuánto falta, cuánto
 * queda de ganancia y cómo viene el mantenimiento mensual. Sin imports a
 * propósito: así `cuentas.check.mjs` lo prueba con Node pelado.
 */

export interface Cliente {
    id: string;
    name: string;
    business: string;
    whatsapp: string;
    email: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export type Contacto = Pick<Cliente, "name" | "business" | "whatsapp" | "email">;

export const nombreDe = (c: Contacto) => [c.name.trim(), c.business.trim()].filter(Boolean).join(" · ") || "Sin nombre";

export interface Pago {
    id: string;
    /** YYYY-MM-DD: el día que entró la plata. */
    fecha: string;
    monto: number;
    nota: string;
    /** YYYY-MM si es una cuota del mantenimiento mensual; vacío si es del proyecto (seña o saldo). */
    mes: string;
}

export interface Costo {
    id: string;
    concepto: string;
    monto: number;
    /** Se paga todos los meses, como el hosting: se resta de lo que entra por mes, no del proyecto. */
    mensual: boolean;
}

export type EstadoCobro = "debe-sena" | "sena-incompleta" | "falta-saldo" | "pagado";

export const ESTADOS_COBRO: Record<EstadoCobro, { etiqueta: string; clase: string }> = {
    "debe-sena": { etiqueta: "Debe la seña", clase: "bg-hot-coral/15 text-hot-coral border-hot-coral/40" },
    "sena-incompleta": { etiqueta: "Seña incompleta", clase: "bg-hot-coral/10 text-hot-coral border-hot-coral/30 border-dashed" },
    "falta-saldo": { etiqueta: "Falta el saldo", clase: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/50" },
    pagado: { etiqueta: "Pagado", clase: "bg-secondary/15 text-secondary border-secondary/40" },
};

export interface Cobro {
    total: number;
    sena: number;
    cobrado: number;
    falta: number;
    /** Lo que falta para completar la seña. */
    faltaSena: number;
    costos: number;
    /** Total menos costos: lo que deja el trabajo cuando se cobre todo. */
    ganancia: number;
    /** Cobrado menos costos: lo que ya quedó en mano. */
    gananciaCobrada: number;
    estado: EstadoCobro;
}

const monto = (x: unknown) => Math.max(Math.round(Number(x) || 0), 0);
const suma = (lista: { monto: number }[]) => lista.reduce((s, x) => s + monto(x.monto), 0);

/** Solo el proyecto: las cuotas del mensual y los costos de todos los meses van en `mensualDe`. */
export function cobroDe(total: number, sena: number, pagos: Pago[], costos: Costo[]): Cobro {
    const cobrado = suma(pagos.filter((p) => !p.mes));
    const gastos = suma(costos.filter((c) => !c.mensual));
    const falta = Math.max(total - cobrado, 0);
    return {
        total,
        sena,
        cobrado,
        falta,
        faltaSena: Math.max(sena - cobrado, 0),
        costos: gastos,
        ganancia: total - gastos,
        gananciaCobrada: cobrado - gastos,
        estado: falta === 0 ? "pagado" : cobrado >= sena ? "falta-saldo" : cobrado > 0 ? "sena-incompleta" : "debe-sena",
    };
}

/** El peor estado de varios trabajos: el que hay que mirar primero. */
export function peorEstado(estados: EstadoCobro[]): EstadoCobro | null {
    for (const e of ["debe-sena", "sena-incompleta", "falta-saldo", "pagado"] as const) if (estados.includes(e)) return e;
    return null;
}

/* ─────────────────────────────────────────────────────────────
   Mantenimiento mensual
   Las cuotas se esperan desde la primera que se registra: antes de eso el
   proyecto puede estar en desarrollo o en el mes de soporte incluido, y no
   debe nada. Los meses van como texto YYYY-MM.
   ───────────────────────────────────────────────────────────── */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function sumarMeses(mes: string, n: number): string {
    const [a, m] = mes.split("-").map(Number);
    const t = a * 12 + m - 1 + n;
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

/** "2026-10" -> "octubre 2026" */
export function nombreMes(mes: string): string {
    const [a, m] = mes.split("-").map(Number);
    return MESES[m - 1] ? `${MESES[m - 1]} ${a}` : mes;
}

/** El mes de hoy en Argentina, corra donde corra: el servidor está en UTC. */
export const mesDeHoy = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit" }).format(new Date());

export interface Mensual {
    /** Lo que se espera por mes: lo último que pagó (las cuotas se actualizan seguido) o, sin cuotas, lo del presupuesto. */
    cuota: number;
    /** De la más nueva a la más vieja. */
    cuotas: Pago[];
    /** Hay alguna cuota de este mes o de antes. */
    empezo: boolean;
    pagoEsteMes: boolean;
    /** Meses anteriores a este, desde la primera cuota, que no se pagaron. Vacío si lo dio de baja. */
    deben: string[];
    /** El mes que conviene cobrar ahora: el más viejo que debe, este si falta, o el siguiente. */
    proximo: string;
}

export function mensualDe(pagos: Pago[], delPresupuesto: number, activo: boolean, mes: string): Mensual {
    const cuotas = pagos.filter((p) => p.mes).sort((a, b) => b.mes.localeCompare(a.mes));
    const pagados = new Set(cuotas.map((c) => c.mes));
    const primera = cuotas.at(-1)?.mes;
    const empezo = !!primera && primera <= mes;
    const deben: string[] = [];
    if (activo && primera) for (let m = primera; m < mes; m = sumarMeses(m, 1)) if (!pagados.has(m)) deben.push(m);
    let proximo = deben[0] ?? mes;
    while (pagados.has(proximo)) proximo = sumarMeses(proximo, 1);
    return { cuota: cuotas[0]?.monto || delPresupuesto, cuotas, empezo, pagoEsteMes: pagados.has(mes), deben, proximo };
}

/* ─────────────────────────────────────────────────────────────
   Cada presupuesto guardado como trabajo, y el resumen de varios
   ───────────────────────────────────────────────────────────── */

/** Lo que hace falta de un presupuesto guardado para sus cuentas. */
export interface FilaCobro {
    id: string;
    status: string;
    client_id?: string | null;
    payments?: unknown;
    costs?: unknown;
    monthly_active?: boolean;
}

export interface Trabajo<Q extends FilaCobro = FilaCobro> {
    q: Q;
    /** Todos, como se guardan: los del proyecto y las cuotas. */
    todos: Pago[];
    /** Solo los del proyecto: la seña y el saldo. */
    pagos: Pago[];
    costos: Costo[];
    /** Lo que suman los costos de todos los meses. */
    costosMes: number;
    cobro: Cobro;
    /** Null si el presupuesto no tiene servicios mensuales ni cuotas cargadas. */
    mensual: Mensual | null;
    /** Sigue contratado el mantenimiento. */
    activo: boolean;
    /** Aceptado o con algún pago: entra en las cuentas. */
    cuenta: boolean;
}

/** `totales` sale de calcularTotales: va por parámetro para que este archivo no importe nada. */
export function trabajoDe<Q extends FilaCobro>(q: Q, totales: { total: number; sena: number; mensual: number }, mes: string): Trabajo<Q> {
    const todos = pagosDe(q.payments);
    const costos = costosDe(q.costs);
    const activo = q.monthly_active !== false;
    return {
        q,
        todos,
        pagos: todos.filter((p) => !p.mes),
        costos,
        costosMes: suma(costos.filter((c) => c.mensual)),
        cobro: cobroDe(totales.total, totales.sena, todos, costos),
        mensual: totales.mensual > 0 || todos.some((p) => p.mes) ? mensualDe(todos, totales.mensual, activo, mes) : null,
        activo,
        cuenta: q.status === "aceptado" || todos.length > 0,
    };
}

export interface Resumen {
    trabajos: number;
    /** El saldo de los proyectos más las cuotas atrasadas. */
    falta: number;
    cuotasAtrasadas: number;
    /** Todo lo que entró: proyectos y cuotas. */
    cobrado: number;
    entroEsteMes: number;
    /** De los proyectos: total menos costos de una vez. */
    ganancia: number;
    gananciaCobrada: number;
    /** Lo que suman las cuotas de los mensuales en marcha. */
    porMes: number;
    /** `porMes` menos los costos de todos los meses. */
    gananciaPorMes: number;
    /** Mensuales en marcha: contratados y con alguna cuota. */
    conMensual: number;
    pagaronEsteMes: number;
    estado: EstadoCobro | null;
}

export function resumenDe(trabajos: Trabajo[], mes: string): Resumen {
    const cuentan = trabajos.filter((t) => t.cuenta);
    const s = (f: (t: Trabajo) => number) => cuentan.reduce((a, t) => a + f(t), 0);
    const enMarcha = cuentan.filter((t) => t.activo && t.mensual?.empezo);
    const atrasadas = (t: Trabajo) => t.mensual?.deben.length ?? 0;
    const porMes = enMarcha.reduce((a, t) => a + t.mensual!.cuota, 0);
    return {
        trabajos: cuentan.length,
        falta: s((t) => t.cobro.falta + atrasadas(t) * (t.mensual?.cuota ?? 0)),
        cuotasAtrasadas: s(atrasadas),
        cobrado: s((t) => suma(t.todos)),
        entroEsteMes: s((t) => suma(t.todos.filter((p) => p.fecha.startsWith(mes)))),
        ganancia: s((t) => t.cobro.ganancia),
        gananciaCobrada: s((t) => t.cobro.gananciaCobrada),
        porMes,
        gananciaPorMes: porMes - s((t) => t.costosMes),
        conMensual: enMarcha.length,
        pagaronEsteMes: enMarcha.filter((t) => t.mensual!.pagoEsteMes).length,
        estado: peorEstado(cuentan.map((t) => t.cobro.estado)),
    };
}

/* ─────────────────────────────────────────────────────────────
   Lo que llega de la base. Las columnas son JSON: un renglón roto no tiene que
   romper la página entera.
   ───────────────────────────────────────────────────────────── */

const texto = (x: unknown) => (typeof x === "string" ? x : "");
const objetos = (x: unknown) =>
    (Array.isArray(x) ? x : []).filter((o): o is Record<string, unknown> => !!o && typeof o === "object");
const MES_VALIDO = /^20\d\d-(0[1-9]|1[0-2])$/;

export function pagosDe(x: unknown): Pago[] {
    return objetos(x).map((o, i) => ({
        id: texto(o.id) || `pago-${i}`,
        fecha: texto(o.fecha),
        monto: monto(o.monto),
        nota: texto(o.nota),
        mes: MES_VALIDO.test(texto(o.mes)) ? texto(o.mes) : "",
    }));
}

export function costosDe(x: unknown): Costo[] {
    return objetos(x).map((o, i) => ({ id: texto(o.id) || `costo-${i}`, concepto: texto(o.concepto), monto: monto(o.monto), mensual: o.mensual === true }));
}

/* ─────────────────────────────────────────────────────────────
   Reconocer a un cliente que ya existe
   La misma regla que usa supabase/clientes-2026-10-07.sql para los presupuestos
   viejos: WhatsApp (últimos 10 dígitos, así "11 2345-6789" y "+54 9 11 2345 6789"
   son el mismo), email, o nombre y negocio.
   ───────────────────────────────────────────────────────────── */

const digitos = (s: string) => {
    const d = s.replace(/\D/g, "");
    return d.length >= 8 ? d.slice(-10) : "";
};
const limpio = (s: string) => s.trim().toLowerCase();

export function mismoCliente(a: Contacto, b: Contacto): boolean {
    const wa = digitos(a.whatsapp);
    if (wa && wa === digitos(b.whatsapp)) return true;
    const email = limpio(a.email);
    if (email && email === limpio(b.email)) return true;
    const nombre = `${limpio(a.name)}|${limpio(a.business)}`;
    return nombre !== "|" && nombre === `${limpio(b.name)}|${limpio(b.business)}`;
}
