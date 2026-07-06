import type { ReactNode } from "react";

type TonoKpi = "oceano" | "menta" | "coral" | "ambar";

const clasesTono: Record<TonoKpi, string> = {
  oceano: "from-blue-600 to-sky-500 text-white",
  menta: "from-cyan-500 to-blue-500 text-white",
  coral: "from-blue-800 to-blue-600 text-white",
  ambar: "from-sky-400 to-blue-500 text-white"
};

export function TarjetaKpi({ etiqueta, valor, icono, tono }: { etiqueta: string; valor: string; icono: ReactNode; tono: TonoKpi }) {
  return (
    <article className="min-h-32 overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-suave">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br shadow-lg ${clasesTono[tono]}`}>{icono}</div>
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.08em] text-blue-400">{etiqueta}</p>
      <p className="mt-1 truncate text-[16px] font-black tracking-normal text-tinta min-[430px]:text-lg">{valor}</p>
    </article>
  );
}
