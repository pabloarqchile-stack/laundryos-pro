import { Banknote, Building2, Factory, Home, MoreHorizontal, UsersRound } from "lucide-react";

type SeccionActiva = "inicio" | "clientes" | "lavanderias" | "finanzas" | "equipos" | "mas";

const iconos = {
  inicio: Home,
  clientes: UsersRound,
  lavanderias: Building2,
  finanzas: Banknote,
  equipos: Factory,
  mas: MoreHorizontal
};

const secciones: SeccionActiva[] = ["inicio", "clientes", "lavanderias", "finanzas", "equipos", "mas"];

export function BarraNavegacionMovil({
  seccionActiva,
  alCambiar,
  textos
}: {
  seccionActiva: SeccionActiva;
  alCambiar: (seccion: SeccionActiva) => void;
  textos: Record<SeccionActiva, string>;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 lg:left-1/2 lg:max-w-3xl lg:-translate-x-1/2">
      <div className="grid grid-cols-6 gap-1 rounded-[28px] border border-blue-100 bg-white/95 p-2 shadow-[0_-18px_50px_rgba(8,33,63,0.18)] backdrop-blur-xl">
        {secciones.map((seccion) => {
          const Icono = iconos[seccion];
          const activo = seccion === seccionActiva;
          return (
            <button
              key={seccion}
              type="button"
              onClick={() => alCambiar(seccion)}
              className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-black transition ${activo ? "bg-gradient-to-br from-blue-700 to-sky-500 text-white shadow-lg shadow-blue-500/25" : "text-blue-400 hover:bg-blue-50"}`}
              aria-current={activo ? "page" : undefined}
            >
              <Icono size={20} />
              <span className="max-w-full truncate px-1">{textos[seccion]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
