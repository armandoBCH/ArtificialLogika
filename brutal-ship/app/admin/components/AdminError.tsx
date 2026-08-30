/**
 * Los paneles pedían al hook `create`/`update`/`remove`, recibían `true` o `false`,
 * y con `false` no hacían nada: el formulario quedaba abierto, sin mensaje. Un
 * guardado que falla por red, por permisos o por validación se veía igual que uno
 * que nunca se intentó, y la única forma de enterarse era abrir la consola.
 *
 * `role="alert"` para que un lector de pantalla lo anuncie apenas aparece, que es
 * cuando importa.
 */
export default function AdminError({ mensaje }: { mensaje: string | null }) {
    if (!mensaje) return null;

    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-sm border-2 border-hot-coral bg-hot-coral/10 p-4"
        >
            <span aria-hidden="true" className="material-icons text-hot-coral">
                error_outline
            </span>
            <div>
                <p className="text-sm font-black uppercase tracking-wider text-hot-coral">
                    No se pudo guardar
                </p>
                <p className="mt-1 text-sm font-medium text-white/80">{mensaje}</p>
            </div>
        </div>
    );
}
