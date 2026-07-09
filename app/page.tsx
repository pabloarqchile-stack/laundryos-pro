"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BadgeDollarSign, Building2, ChevronDown, CircleDollarSign, Cog, Download, Factory, Globe2, Landmark, LayoutDashboard, Pencil, Plus, Save, ShieldCheck, UsersRound, Wrench, X } from "lucide-react";
import { BarraNavegacionMovil } from "@/components/BarraNavegacionMovil";
import { TarjetaKpi } from "@/components/TarjetaKpi";
import { BarraProgreso } from "@/components/BarraProgreso";
import { datosIniciales, idiomasDisponibles, permisosPorRol, type Idioma, type RolUsuario } from "@/datos/datosIniciales";
import { textosInterfaz } from "@/lib/textosInterfaz";

type SeccionActiva = "inicio" | "clientes" | "lavanderias" | "finanzas" | "equipos" | "mas";
type Lavanderia = typeof datosIniciales.lavanderias[number];
type Equipo = typeof datosIniciales.equipos[number];
type AccionOperativa = "lavanderia" | "editar_lavanderia" | "equipo" | "ingreso" | "gasto" | null;

type MovimientoFinanciero = {
  id: string;
  lavanderiaId: string;
  tipo: "ingreso" | "egreso";
  categoria: string;
  monto: number;
  fecha: string;
  observacion: string;
};

const clavePersistencia = "laundryos-pro-piloto-v1";
const rutaBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

const iconosRol: Record<RolUsuario, React.ReactNode> = {
  arquitecto: <ShieldCheck size={16} />,
  administrador: <Landmark size={16} />,
  supervisor: <Wrench size={16} />,
  usuario: <UsersRound size={16} />
};

export default function PlataformaLaundryOS() {
  const [idioma, definirIdioma] = useState<Idioma>("es");
  const [rol, definirRol] = useState<RolUsuario>("arquitecto");
  const [seccion, definirSeccion] = useState<SeccionActiva>("inicio");
  const [lavanderias, definirLavanderias] = useState<Lavanderia[]>(datosIniciales.lavanderias);
  const [equiposGuardados, definirEquiposGuardados] = useState<Equipo[]>(datosIniciales.equipos);
  const [movimientos, definirMovimientos] = useState<MovimientoFinanciero[]>([]);
  const [datosListos, definirDatosListos] = useState(false);
  const [accionOperativa, definirAccionOperativa] = useState<AccionOperativa>(null);
  const [lavanderiaEnEdicion, definirLavanderiaEnEdicion] = useState<Lavanderia | null>(null);
  const t = textosInterfaz[idioma];

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${rutaBase}/service-worker.js`).catch(() => undefined);
    }

    const datosGuardados = window.localStorage.getItem(clavePersistencia);
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados) as {
          lavanderias?: Lavanderia[];
          equipos?: Equipo[];
          movimientos?: MovimientoFinanciero[];
        };
        if (datos.lavanderias?.length) definirLavanderias(datos.lavanderias);
        if (datos.equipos?.length) definirEquiposGuardados(datos.equipos);
        if (datos.movimientos) definirMovimientos(datos.movimientos);
      } catch {
        window.localStorage.removeItem(clavePersistencia);
      }
    }
    definirDatosListos(true);
  }, []);

  useEffect(() => {
    if (!datosListos) return;
    window.localStorage.setItem(clavePersistencia, JSON.stringify({ lavanderias, equipos: equiposGuardados, movimientos }));
  }, [datosListos, lavanderias, equiposGuardados, movimientos]);

  const clienteInicial = datosIniciales.clientes[0];
  const lavanderiasOperativas = useMemo(() => {
    return lavanderias.map((lavanderia) => {
      const movimientosLavanderia = movimientos.filter((movimiento) => movimiento.lavanderiaId === lavanderia.id);
      const ingresosExtra = movimientosLavanderia.filter((movimiento) => movimiento.tipo === "ingreso").reduce((suma, movimiento) => suma + movimiento.monto, 0);
      const egresosExtra = movimientosLavanderia.filter((movimiento) => movimiento.tipo === "egreso").reduce((suma, movimiento) => suma + movimiento.monto, 0);
      return {
        ...lavanderia,
        ingresosMensuales: lavanderia.ingresosMensuales + ingresosExtra,
        egresosMensuales: lavanderia.egresosMensuales + egresosExtra,
        rentabilidad: lavanderia.ingresosMensuales + ingresosExtra - lavanderia.egresosMensuales - egresosExtra,
        recaudaciones: [
          ...lavanderia.recaudaciones,
          ...movimientosLavanderia.filter((movimiento) => movimiento.tipo === "ingreso").map((movimiento) => ({ fecha: movimiento.fecha, monto: movimiento.monto }))
        ]
      };
    });
  }, [lavanderias, movimientos]);

  const lavanderiasVisibles = useMemo(() => {
    if (rol === "arquitecto") return lavanderiasOperativas;
    return lavanderiasOperativas.filter((lavanderia) => lavanderia.clienteId === clienteInicial.id);
  }, [rol, clienteInicial.id, lavanderiasOperativas]);

  const ingresos = lavanderiasVisibles.reduce((suma, item) => suma + item.ingresosMensuales, 0);
  const egresos = lavanderiasVisibles.reduce((suma, item) => suma + item.egresosMensuales, 0);
  const equipos = equiposGuardados.filter((equipo) => lavanderiasVisibles.some((lavanderia) => lavanderia.id === equipo.lavanderiaId));
  const equiposOperativos = equipos.filter((equipo) => equipo.estado === "Operativo").length;
  const rentabilidad = ingresos - egresos;

  function crearLavanderia(datos: FormData) {
    const nombre = String(datos.get("nombre") || "").trim();
    const direccion = String(datos.get("direccion") || "").trim();
    if (!nombre || !direccion) return;
    const nuevaLavanderia: Lavanderia = {
      id: `lav-${Date.now()}`,
      clienteId: clienteInicial.id,
      nombre,
      direccion,
      ingresosMensuales: Number(datos.get("ingresos")) || 0,
      egresosMensuales: Number(datos.get("egresos")) || 0,
      rentabilidad: (Number(datos.get("ingresos")) || 0) - (Number(datos.get("egresos")) || 0),
      ciclosMensuales: Number(datos.get("ciclos")) || 0,
      recaudaciones: [],
      cuentas: ["Agua", "Electricidad", "Gas", "Internet"],
      mantenciones: [],
      reportes: ["Rentabilidad", "Ciclos", "Recaudación", "Consumos"]
    };
    definirLavanderias((actuales) => [nuevaLavanderia, ...actuales]);
    definirSeccion("lavanderias");
    definirAccionOperativa(null);
  }

  function abrirEdicionLavanderia(lavanderiaId: string) {
    const lavanderia = lavanderias.find((item) => item.id === lavanderiaId);
    if (!lavanderia || (rol !== "administrador" && rol !== "arquitecto")) return;
    definirLavanderiaEnEdicion(lavanderia);
    definirAccionOperativa("editar_lavanderia");
  }

  function editarLavanderia(datos: FormData) {
    if (!lavanderiaEnEdicion || (rol !== "administrador" && rol !== "arquitecto")) return;
    const nombre = String(datos.get("nombre") || "").trim();
    const direccion = String(datos.get("direccion") || "").trim();
    if (!nombre || !direccion) return;

    definirLavanderias((actuales) =>
      actuales.map((lavanderia) => {
        if (lavanderia.id !== lavanderiaEnEdicion.id) return lavanderia;
        const ingresosMensuales = Number(datos.get("ingresos")) || 0;
        const egresosMensuales = Number(datos.get("egresos")) || 0;
        return {
          ...lavanderia,
          nombre,
          direccion,
          ingresosMensuales,
          egresosMensuales,
          rentabilidad: ingresosMensuales - egresosMensuales,
          ciclosMensuales: Number(datos.get("ciclos")) || 0
        };
      })
    );
    definirLavanderiaEnEdicion(null);
    definirAccionOperativa(null);
  }

  function crearEquipo(datos: FormData) {
    const tipo = String(datos.get("tipo") || "Lavadora").trim();
    const marca = String(datos.get("marca") || "").trim();
    const modelo = String(datos.get("modelo") || "").trim();
    if (!marca || !modelo) return;
    const nuevoEquipo: Equipo = {
      id: `eq-${Date.now()}`,
      lavanderiaId: String(datos.get("lavanderiaId") || lavanderiasVisibles[0]?.id),
      tipo,
      marca,
      modelo,
      numeroSerie: String(datos.get("numeroSerie") || `SN-${Date.now()}`),
      capacidad: String(datos.get("capacidad") || "18 kg"),
      estado: "Operativo",
      fechaCompra: String(datos.get("fechaCompra") || new Date().toISOString().slice(0, 10)),
      valorInversion: Number(datos.get("valorInversion")) || 0,
      rentabilidadMensual: Number(datos.get("rentabilidadMensual")) || 0,
      historialMantenciones: ["Equipo creado desde piloto móvil"]
    };
    definirEquiposGuardados((actuales) => [nuevoEquipo, ...actuales]);
    definirSeccion("equipos");
    definirAccionOperativa(null);
  }

  function crearMovimiento(datos: FormData, tipo: "ingreso" | "egreso") {
    const monto = Number(datos.get("monto")) || 0;
    if (monto <= 0) return;
    const nuevoMovimiento: MovimientoFinanciero = {
      id: `mov-${Date.now()}`,
      lavanderiaId: String(datos.get("lavanderiaId") || lavanderiasVisibles[0]?.id),
      tipo,
      categoria: String(datos.get("categoria") || (tipo === "ingreso" ? "Recaudación" : "Gasto operativo")),
      monto,
      fecha: String(datos.get("fecha") || new Date().toISOString().slice(0, 10)),
      observacion: String(datos.get("observacion") || "")
    };
    definirMovimientos((actuales) => [nuevoMovimiento, ...actuales]);
    definirSeccion("finanzas");
    definirAccionOperativa(null);
  }

  function descargarRespaldo() {
    const contenido = JSON.stringify({ cliente: clienteInicial, lavanderias, equipos: equiposGuardados, movimientos }, null, 2);
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([contenido], { type: "application/json" }));
    enlace.download = `laundryos-pro-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  return (
    <main className="area-segura-inferior mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-3 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 -mx-4 border-b border-white/10 bg-blue-950/70 px-4 py-3 text-white backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-base font-black text-azul shadow-app">LO</span>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black tracking-normal text-white sm:text-xl">LaundryOS Pro</h1>
                <p className="hidden truncate text-xs font-semibold text-blue-100 min-[430px]:block">{t.subtitulo}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur" title={t.cambiarIdioma}>
              <Globe2 size={20} aria-hidden />
              <span className="sr-only">{t.cambiarIdioma}</span>
              <select
                aria-label={t.cambiarIdioma}
                className="absolute inset-0 cursor-pointer opacity-0"
                value={idioma}
                onChange={(evento) => definirIdioma(evento.target.value as Idioma)}
              >
                {idiomasDisponibles.map((opcion) => (
                  <option key={opcion.codigo} value={opcion.codigo}>
                    🌍 {opcion.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-0 text-sm font-bold text-white shadow-sm backdrop-blur sm:w-auto sm:px-3" title={t.rolActivo}>
              {iconosRol[rol]}
              <span className="sr-only sm:not-sr-only">{t.roles[rol]}</span>
              <select className="absolute inset-0 cursor-pointer bg-blue-950/80 opacity-0 outline-none sm:static sm:inset-auto sm:min-w-0 sm:flex-1 sm:cursor-default sm:opacity-100" value={rol} onChange={(evento) => definirRol(evento.target.value as RolUsuario)} aria-label={t.rolActivo}>
                {Object.keys(permisosPorRol).map((clave) => (
                  <option key={clave} value={clave}>
                    {t.roles[clave as RolUsuario]}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="hidden sm:block" />
            </label>
          </div>
        </div>
      </header>

      <section className="grid gap-4 py-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="panel-azul overflow-hidden rounded-[30px] p-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.08em] text-sky-100">{t.clienteInicial}</p>
              <h2 className="mt-1 text-4xl font-black tracking-normal text-white">{clienteInicial.nombre}</h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-blue-50">{t.presentacion}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => definirAccionOperativa("lavanderia")} className="boton-app inline-flex items-center justify-center gap-2 bg-white px-3 text-sm font-black text-azul">
                <Plus size={18} />
                {t.nuevaLavanderia}
              </button>
              <button onClick={() => definirAccionOperativa("equipo")} className="boton-app inline-flex items-center justify-center gap-2 border border-white/20 bg-white/12 px-3 text-sm font-black text-white backdrop-blur">
                <Factory size={18} />
                {t.nuevoEquipo}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-blue-50">
            <button onClick={() => definirAccionOperativa("ingreso")} className="rounded-full bg-white/15 px-3 py-2 backdrop-blur">+ Recaudación</button>
            <button onClick={() => definirAccionOperativa("gasto")} className="rounded-full bg-white/15 px-3 py-2 backdrop-blur">+ Gasto</button>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 backdrop-blur"><Save size={14} /> Guardado automático</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <TarjetaKpi etiqueta={t.ingresos} valor={formatoMoneda(ingresos, clienteInicial.moneda)} tono="oceano" icono={<CircleDollarSign />} />
            <TarjetaKpi etiqueta={t.egresos} valor={formatoMoneda(egresos, clienteInicial.moneda)} tono="coral" icono={<BadgeDollarSign />} />
            <TarjetaKpi etiqueta={t.rentabilidad} valor={formatoMoneda(rentabilidad, clienteInicial.moneda)} tono="menta" icono={<Activity />} />
            <TarjetaKpi etiqueta={t.equipos} valor={`${equiposOperativos}/${equipos.length}`} tono="ambar" icono={<Cog />} />
          </div>
        </div>

        <aside className="superficie-app rounded-[30px] p-5">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-blue-500">{t.permisosActivos}</p>
          <h3 className="mt-2 text-2xl font-black">{t.roles[rol]}</h3>
          <div className="mt-4 grid gap-2">
            {permisosPorRol[rol].map((permiso) => (
              <div key={permiso} className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">
                <ShieldCheck size={15} className="text-oceano" />
                {t.permisos[permiso]}
              </div>
            ))}
          </div>
        </aside>
      </section>

      {seccion === "inicio" && <VistaInicio t={t} lavanderias={lavanderiasVisibles} moneda={clienteInicial.moneda} equipos={equipos} />}
      {seccion === "clientes" && <VistaClientes t={t} rol={rol} />}
      {seccion === "lavanderias" && (
        <VistaLavanderias
          t={t}
          lavanderias={lavanderiasVisibles}
          moneda={clienteInicial.moneda}
          puedeEditar={rol === "administrador" || rol === "arquitecto"}
          alEditar={abrirEdicionLavanderia}
          alNuevoEquipo={() => definirAccionOperativa("equipo")}
        />
      )}
      {seccion === "finanzas" && <VistaFinanzas t={t} lavanderias={lavanderiasVisibles} moneda={clienteInicial.moneda} movimientos={movimientos} alIngreso={() => definirAccionOperativa("ingreso")} alGasto={() => definirAccionOperativa("gasto")} />}
      {seccion === "equipos" && <VistaEquipos t={t} equipos={equipos} moneda={clienteInicial.moneda} alNuevoEquipo={() => definirAccionOperativa("equipo")} />}
      {seccion === "mas" && <VistaMas t={t} alDescargar={descargarRespaldo} />}

      <BarraNavegacionMovil seccionActiva={seccion} alCambiar={definirSeccion} textos={t.navegacion} />
      <ModalOperativo
        accion={accionOperativa}
        lavanderias={lavanderiasVisibles}
        lavanderiaEnEdicion={lavanderiaEnEdicion}
        alCerrar={() => {
          definirAccionOperativa(null);
          definirLavanderiaEnEdicion(null);
        }}
        alCrearLavanderia={crearLavanderia}
        alEditarLavanderia={editarLavanderia}
        alCrearEquipo={crearEquipo}
        alCrearIngreso={(datos) => crearMovimiento(datos, "ingreso")}
        alCrearGasto={(datos) => crearMovimiento(datos, "egreso")}
      />
    </main>
  );
}

function VistaInicio({ t, lavanderias, moneda, equipos }: { t: typeof textosInterfaz.es; lavanderias: typeof datosIniciales.lavanderias; moneda: string; equipos: typeof datosIniciales.equipos }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.75fr_0.25fr]">
      <div className="superficie-app rounded-[30px] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-tinta">{t.rankingLavanderias}</h2>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-oceano"><LayoutDashboard size={20} /></span>
        </div>
        <div className="grid gap-3">
          {lavanderias
            .slice()
            .sort((a, b) => b.ingresosMensuales - a.ingresosMensuales)
            .map((lavanderia, indice) => (
              <div key={lavanderia.id} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-tinta">{indice + 1}. {lavanderia.nombre}</p>
                    <p className="truncate text-xs font-semibold text-blue-400">{lavanderia.direccion}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-oceano">{formatoMoneda(lavanderia.ingresosMensuales, moneda)}</span>
                </div>
                <BarraProgreso valor={lavanderia.rentabilidad / Math.max(lavanderia.ingresosMensuales, 1)} />
              </div>
            ))}
        </div>
      </div>

      <div className="grid gap-4">
        <PanelLista titulo={t.alertasOperativas} items={datosIniciales.alertas} />
        <PanelLista titulo={t.estadoEquipos} items={[`${equipos.filter((e) => e.estado === "Operativo").length} ${t.operativos}`, `${equipos.filter((e) => e.estado === "Mantención").length} ${t.enMantencion}`, `${equipos.filter((e) => e.estado === "Observación").length} ${t.enObservacion}`]} />
      </div>
    </section>
  );
}

function VistaClientes({ t, rol }: { t: typeof textosInterfaz.es; rol: RolUsuario }) {
  const puedeVerTodos = rol === "arquitecto";
  return (
    <section className="superficie-app rounded-[30px] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-tinta">{t.clientes}</h2>
        {puedeVerTodos && <button className="boton-app inline-flex items-center gap-2 bg-oceano px-3 text-sm font-black text-white"><Plus size={16} />{t.crearCliente}</button>}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {datosIniciales.clientes.map((cliente) => (
          <article key={cliente.id} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4">
            <p className="font-black text-tinta">{cliente.nombre}</p>
            <p className="mt-1 text-sm font-semibold text-blue-500">{cliente.pais} · {cliente.moneda} · {cliente.plan}</p>
            <p className="mt-3 text-sm text-blue-900/70">{puedeVerTodos ? t.accesoTotalCliente : t.accesoLimitadoCliente}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VistaLavanderias({
  t,
  lavanderias,
  moneda,
  puedeEditar,
  alEditar,
  alNuevoEquipo
}: {
  t: typeof textosInterfaz.es;
  lavanderias: Lavanderia[];
  moneda: string;
  puedeEditar: boolean;
  alEditar: (lavanderiaId: string) => void;
  alNuevoEquipo: () => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lavanderias.map((lavanderia) => (
        <article key={lavanderia.id} className="superficie-app rounded-[28px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-tinta">{lavanderia.nombre}</h2>
              <p className="mt-1 text-sm font-semibold text-blue-500">{lavanderia.direccion}</p>
            </div>
            {puedeEditar ? (
              <button
                type="button"
                onClick={() => alEditar(lavanderia.id)}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-oceano transition hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-oceano"
                title="Editar lavandería"
                aria-label={`Editar ${lavanderia.nombre}`}
              >
                <Building2 />
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-oceano text-white shadow-sm">
                  <Pencil size={11} />
                </span>
              </button>
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-oceano"><Building2 /></span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <MiniDato etiqueta={t.ingresos} valor={formatoMoneda(lavanderia.ingresosMensuales, moneda)} />
            <MiniDato etiqueta={t.egresos} valor={formatoMoneda(lavanderia.egresosMensuales, moneda)} />
            <MiniDato etiqueta={t.ciclos} valor={String(lavanderia.ciclosMensuales)} />
            <MiniDato etiqueta={t.recaudaciones} valor={String(lavanderia.recaudaciones.length)} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={alNuevoEquipo} className="boton-app flex-1 bg-oceano px-3 py-2 text-sm font-black text-white">{t.nuevoEquipo}</button>
            <button className="boton-app flex-1 border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-black text-azul">{t.reportes}</button>
          </div>
        </article>
      ))}
    </section>
  );
}

function VistaFinanzas({ t, lavanderias, moneda, movimientos, alIngreso, alGasto }: { t: typeof textosInterfaz.es; lavanderias: Lavanderia[]; moneda: string; movimientos: MovimientoFinanciero[]; alIngreso: () => void; alGasto: () => void }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <div className="superficie-app rounded-[30px] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-tinta">{t.rentabilidadPorLavanderia}</h2>
          <div className="flex gap-2">
            <button onClick={alIngreso} className="boton-app bg-oceano px-3 text-sm font-black text-white">Ingreso</button>
            <button onClick={alGasto} className="boton-app bg-blue-100 px-3 text-sm font-black text-azul">Gasto</button>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {lavanderias.map((lavanderia) => (
            <div key={lavanderia.id} className="rounded-2xl border border-blue-100 bg-white p-4">
              <div className="flex justify-between gap-3 text-sm font-black">
                <span>{lavanderia.nombre}</span>
                <span className="text-oceano">{formatoMoneda(lavanderia.rentabilidad, moneda)}</span>
              </div>
              <BarraProgreso valor={lavanderia.rentabilidad / Math.max(lavanderia.ingresosMensuales, 1)} />
            </div>
          ))}
        </div>
      </div>
      <PanelLista titulo="Últimos movimientos" items={(movimientos.length ? movimientos : datosIniciales.categoriasEgreso.map((item) => ({ tipo: "egreso", categoria: item.nombre, monto: item.monto, fecha: "Base" }))).slice(0, 8).map((item) => `${"fecha" in item ? item.fecha : "Base"} · ${item.categoria}: ${formatoMoneda(item.monto, moneda)}`)} />
    </section>
  );
}

function VistaEquipos({ t, equipos, moneda, alNuevoEquipo }: { t: typeof textosInterfaz.es; equipos: Equipo[]; moneda: string; alNuevoEquipo: () => void }) {
  return (
    <section className="superficie-app rounded-[30px] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-tinta">{t.moduloEquipos}</h2>
        <button onClick={alNuevoEquipo} className="boton-app inline-flex items-center gap-2 bg-oceano px-3 text-sm font-black text-white"><Plus size={16} />{t.nuevoEquipo}</button>
      </div>
      <div className="mt-4 grid gap-3">
        {equipos.map((equipo) => (
          <article key={equipo.id} className="grid gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <div>
              <p className="font-black text-tinta">{equipo.tipo} · {equipo.marca}</p>
              <p className="text-sm font-semibold text-blue-500">{equipo.modelo} · SN {equipo.numeroSerie}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <MiniDato etiqueta={t.capacidad} valor={equipo.capacidad} />
              <MiniDato etiqueta={t.estado} valor={equipo.estado} />
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold uppercase text-blue-400">{t.rentabilidad}</p>
              <p className="font-black text-oceano">{formatoMoneda(equipo.rentabilidadMensual, moneda)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VistaMas({ t, alDescargar }: { t: typeof textosInterfaz.es; alDescargar: () => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <section className="superficie-app rounded-[30px] p-5 md:col-span-2">
        <h2 className="text-lg font-black text-tinta">Datos y respaldo</h2>
        <p className="mt-2 text-sm font-semibold text-blue-900/70">El piloto guarda automáticamente los cambios en este dispositivo. Descarga un respaldo JSON cuando quieras mover o auditar la información.</p>
        <button onClick={alDescargar} className="boton-app mt-4 inline-flex items-center gap-2 bg-oceano px-4 text-sm font-black text-white"><Download size={16} /> Descargar respaldo</button>
      </section>
      <PanelLista titulo={t.modulosSaas} items={datosIniciales.modulosSaas} />
      <PanelLista titulo={t.preparadoPara} items={datosIniciales.preparadoPara} />
    </section>
  );
}

function ModalOperativo({
  accion,
  lavanderias,
  lavanderiaEnEdicion,
  alCerrar,
  alCrearLavanderia,
  alEditarLavanderia,
  alCrearEquipo,
  alCrearIngreso,
  alCrearGasto
}: {
  accion: AccionOperativa;
  lavanderias: Lavanderia[];
  lavanderiaEnEdicion: Lavanderia | null;
  alCerrar: () => void;
  alCrearLavanderia: (datos: FormData) => void;
  alEditarLavanderia: (datos: FormData) => void;
  alCrearEquipo: (datos: FormData) => void;
  alCrearIngreso: (datos: FormData) => void;
  alCrearGasto: (datos: FormData) => void;
}) {
  if (!accion) return null;
  const titulo = {
    lavanderia: "Crear lavandería",
    editar_lavanderia: "Editar lavandería",
    equipo: "Crear equipo",
    ingreso: "Registrar recaudación",
    gasto: "Registrar gasto"
  }[accion];

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    if (accion === "lavanderia") alCrearLavanderia(datos);
    if (accion === "editar_lavanderia") alEditarLavanderia(datos);
    if (accion === "equipo") alCrearEquipo(datos);
    if (accion === "ingreso") alCrearIngreso(datos);
    if (accion === "gasto") alCrearGasto(datos);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-blue-950/55 p-3 backdrop-blur-sm sm:place-items-center">
      <form onSubmit={enviar} className="w-full max-w-lg rounded-[30px] border border-blue-100 bg-white p-5 shadow-app">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-tinta">{titulo}</h2>
          <button type="button" onClick={alCerrar} className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-azul"><X size={18} /></button>
        </div>

        <div className="mt-5 grid gap-3">
          {(accion === "lavanderia" || accion === "editar_lavanderia") && (
            <>
              <Campo nombre="nombre" etiqueta="Nombre" valorInicial={lavanderiaEnEdicion?.nombre} requerido />
              <Campo nombre="direccion" etiqueta="Dirección" valorInicial={lavanderiaEnEdicion?.direccion} requerido />
              <div className="grid grid-cols-3 gap-2">
                <Campo nombre="ingresos" etiqueta="Ingresos base" tipo="number" valorInicial={lavanderiaEnEdicion?.ingresosMensuales} />
                <Campo nombre="egresos" etiqueta="Egresos base" tipo="number" valorInicial={lavanderiaEnEdicion?.egresosMensuales} />
                <Campo nombre="ciclos" etiqueta="Ciclos" tipo="number" valorInicial={lavanderiaEnEdicion?.ciclosMensuales} />
              </div>
            </>
          )}

          {accion === "equipo" && (
            <>
              <SelectorLavanderia lavanderias={lavanderias} />
              <div className="grid grid-cols-2 gap-2">
                <Campo nombre="tipo" etiqueta="Tipo" valorInicial="Lavadora" />
                <Campo nombre="marca" etiqueta="Marca" requerido />
              </div>
              <Campo nombre="modelo" etiqueta="Modelo" requerido />
              <div className="grid grid-cols-2 gap-2">
                <Campo nombre="numeroSerie" etiqueta="N° serie" />
                <Campo nombre="capacidad" etiqueta="Capacidad" valorInicial="18 kg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Campo nombre="valorInversion" etiqueta="Inversión" tipo="number" />
                <Campo nombre="rentabilidadMensual" etiqueta="Rentabilidad" tipo="number" />
              </div>
            </>
          )}

          {(accion === "ingreso" || accion === "gasto") && (
            <>
              <SelectorLavanderia lavanderias={lavanderias} />
              <div className="grid grid-cols-2 gap-2">
                <Campo nombre="monto" etiqueta="Monto" tipo="number" requerido />
                <Campo nombre="fecha" etiqueta="Fecha" tipo="date" valorInicial={new Date().toISOString().slice(0, 10)} />
              </div>
              <Campo nombre="categoria" etiqueta="Categoría" valorInicial={accion === "ingreso" ? "Recaudación" : "Gasto operativo"} />
              <Campo nombre="observacion" etiqueta="Observación" />
            </>
          )}
        </div>

        <button className="boton-app mt-5 w-full bg-oceano px-4 text-sm font-black text-white">Guardar</button>
      </form>
    </div>
  );
}

function Campo({ nombre, etiqueta, tipo = "text", requerido = false, valorInicial = "" }: { nombre: string; etiqueta: string; tipo?: string; requerido?: boolean; valorInicial?: string | number }) {
  return (
    <label className="grid gap-1 text-sm font-black text-blue-900">
      {etiqueta}
      <input name={nombre} type={tipo} required={requerido} defaultValue={valorInicial} className="h-12 rounded-2xl border border-blue-100 bg-blue-50 px-3 font-bold text-tinta outline-none focus:border-oceano focus:bg-white" />
    </label>
  );
}

function SelectorLavanderia({ lavanderias }: { lavanderias: Lavanderia[] }) {
  return (
    <label className="grid gap-1 text-sm font-black text-blue-900">
      Lavandería
      <select name="lavanderiaId" className="h-12 rounded-2xl border border-blue-100 bg-blue-50 px-3 font-bold text-tinta outline-none focus:border-oceano focus:bg-white">
        {lavanderias.map((lavanderia) => (
          <option key={lavanderia.id} value={lavanderia.id}>{lavanderia.nombre}</option>
        ))}
      </select>
    </label>
  );
}

function PanelLista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <section className="superficie-app rounded-[30px] p-5">
      <h2 className="text-lg font-black text-tinta">{titulo}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-3 text-sm font-bold text-blue-900">{item}</div>
        ))}
      </div>
    </section>
  );
}

function MiniDato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white px-3 py-2">
      <p className="text-xs font-bold uppercase text-blue-400">{etiqueta}</p>
      <p className="truncate font-black text-tinta">{valor}</p>
    </div>
  );
}

function formatoMoneda(valor: number, moneda: string) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0
  }).format(valor);
}
