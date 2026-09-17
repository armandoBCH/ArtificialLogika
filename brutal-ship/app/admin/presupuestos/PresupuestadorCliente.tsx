"use client";

import dynamic from "next/dynamic";

/**
 * Sin render en el servidor a propósito: el presupuesto en curso se recupera de
 * localStorage al montar. Renderizado en el servidor, la primera pintura sería un
 * presupuesto en blanco y al hidratar saltaría al que estabas armando.
 */
const Presupuestador = dynamic(() => import("./Presupuestador"), {
    ssr: false,
    loading: () => <div className="py-24 text-center text-gray-400">Cargando presupuestador…</div>,
});

export default Presupuestador;
