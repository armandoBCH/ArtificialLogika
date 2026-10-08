"use client";

import dynamic from "next/dynamic";

/**
 * Sin render en el servidor, como el presupuestador: las cuentas usan la fecha de
 * hoy ("este mes", la fecha de cada pago) y el servidor está en UTC. De 21 a 24 hs
 * de Argentina ya es otro día allá, y la hidratación no coincidiría.
 */
const Clientes = dynamic(() => import("./Clientes"), {
    ssr: false,
    loading: () => <div className="py-24 text-center text-gray-400">Cargando clientes…</div>,
});

export default Clientes;
