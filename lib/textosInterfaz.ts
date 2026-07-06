import type { Idioma, Permiso, RolUsuario } from "@/datos/datosIniciales";

type Textos = {
  subtitulo: string;
  cambiarIdioma: string;
  rolActivo: string;
  clienteInicial: string;
  presentacion: string;
  nuevaLavanderia: string;
  nuevoEquipo: string;
  ingresos: string;
  egresos: string;
  rentabilidad: string;
  equipos: string;
  permisosActivos: string;
  rankingLavanderias: string;
  alertasOperativas: string;
  estadoEquipos: string;
  operativos: string;
  enMantencion: string;
  enObservacion: string;
  clientes: string;
  crearCliente: string;
  accesoTotalCliente: string;
  accesoLimitadoCliente: string;
  ciclos: string;
  recaudaciones: string;
  reportes: string;
  rentabilidadPorLavanderia: string;
  egresosOperacionales: string;
  moduloEquipos: string;
  capacidad: string;
  estado: string;
  modulosSaas: string;
  preparadoPara: string;
  roles: Record<RolUsuario, string>;
  permisos: Record<Permiso, string>;
  navegacion: Record<"inicio" | "clientes" | "lavanderias" | "finanzas" | "equipos" | "mas", string>;
};

const base: Textos = {
  subtitulo: "SaaS internacional para lavanderías autoservicio",
  cambiarIdioma: "Cambiar idioma",
  rolActivo: "Rol activo",
  clienteInicial: "Cliente inicial",
  presentacion: "Operación multitenant para cadenas de lavanderías: finanzas, equipos, recaudaciones, ciclos, mantenciones, supervisores, reportes y permisos listos para escalar.",
  nuevaLavanderia: "Nueva lavandería",
  nuevoEquipo: "Nuevo equipo",
  ingresos: "Ingresos",
  egresos: "Egresos",
  rentabilidad: "Rentabilidad",
  equipos: "Equipos",
  permisosActivos: "Permisos activos",
  rankingLavanderias: "Ranking de lavanderías",
  alertasOperativas: "Alertas operativas",
  estadoEquipos: "Estado de equipos",
  operativos: "operativos",
  enMantencion: "en mantención",
  enObservacion: "en observación",
  clientes: "Clientes",
  crearCliente: "Crear cliente",
  accesoTotalCliente: "Arquitecto: puede ver todos los clientes, lavanderías, ingresos, egresos, reportes y configuración SaaS.",
  accesoLimitadoCliente: "Vista acotada al cliente asociado al usuario activo.",
  ciclos: "Ciclos",
  recaudaciones: "Recaudaciones",
  reportes: "Reportes",
  rentabilidadPorLavanderia: "Rentabilidad por lavandería",
  egresosOperacionales: "Egresos operacionales",
  moduloEquipos: "Módulo de equipos",
  capacidad: "Capacidad",
  estado: "Estado",
  modulosSaas: "Módulos SaaS",
  preparadoPara: "Preparado para",
  roles: {
    arquitecto: "Arquitecto",
    administrador: "Administrador",
    supervisor: "Supervisor",
    usuario: "Usuario"
  },
  permisos: {
    control_total: "Control total de la aplicación",
    crear_clientes: "Crear clientes",
    crear_administradores: "Crear administradores",
    ver_todo: "Ver todos los datos",
    definir_saas: "Definir planes, módulos y permisos",
    administrar_lavanderias_propias: "Administrar lavanderías propias",
    crear_supervisores: "Crear supervisores",
    registrar_operacion: "Registrar recaudaciones, ciclos y mantenciones",
    registrar_gastos: "Ingresar gastos"
  },
  navegacion: {
    inicio: "Inicio",
    clientes: "Clientes",
    lavanderias: "Lavanderías",
    finanzas: "Finanzas",
    equipos: "Equipos",
    mas: "Más"
  }
};

export const textosInterfaz: Record<Idioma, Textos> = {
  es: base,
  en: traducir(base, {
    subtitulo: "International SaaS for self-service laundries",
    cambiarIdioma: "Change language",
    rolActivo: "Active role",
    clienteInicial: "Initial customer",
    nuevaLavanderia: "New laundry",
    nuevoEquipo: "New equipment",
    ingresos: "Revenue",
    egresos: "Expenses",
    rentabilidad: "Profitability",
    equipos: "Equipment",
    clientes: "Customers",
    navegacion: { inicio: "Home", clientes: "Customers", lavanderias: "Laundries", finanzas: "Finance", equipos: "Equipment", mas: "More" }
  }),
  fr: traducir(base, {
    subtitulo: "SaaS international pour laveries en libre-service",
    cambiarIdioma: "Changer de langue",
    clienteInicial: "Client initial",
    nuevaLavanderia: "Nouvelle laverie",
    nuevoEquipo: "Nouvel équipement",
    ingresos: "Revenus",
    egresos: "Dépenses",
    rentabilidad: "Rentabilité",
    clientes: "Clients",
    navegacion: { inicio: "Accueil", clientes: "Clients", lavanderias: "Laveries", finanzas: "Finance", equipos: "Équipement", mas: "Plus" }
  }),
  pt: traducir(base, {
    subtitulo: "SaaS internacional para lavanderias self-service",
    cambiarIdioma: "Mudar idioma",
    clienteInicial: "Cliente inicial",
    nuevaLavanderia: "Nova lavanderia",
    nuevoEquipo: "Novo equipamento",
    ingresos: "Receitas",
    egresos: "Despesas",
    rentabilidad: "Rentabilidade",
    clientes: "Clientes",
    navegacion: { inicio: "Início", clientes: "Clientes", lavanderias: "Lavanderias", finanzas: "Finanças", equipos: "Equipamentos", mas: "Mais" }
  }),
  de: traducir(base, {
    subtitulo: "Internationale SaaS für SB-Wäschereien",
    cambiarIdioma: "Sprache ändern",
    clienteInicial: "Erster Kunde",
    nuevaLavanderia: "Neue Wäscherei",
    nuevoEquipo: "Neue Maschine",
    ingresos: "Einnahmen",
    egresos: "Ausgaben",
    rentabilidad: "Rentabilität",
    clientes: "Kunden",
    navegacion: { inicio: "Start", clientes: "Kunden", lavanderias: "Wäschereien", finanzas: "Finanzen", equipos: "Maschinen", mas: "Mehr" }
  }),
  zh: traducir(base, {
    subtitulo: "面向自助洗衣店的国际 SaaS",
    cambiarIdioma: "切换语言",
    clienteInicial: "初始客户",
    nuevaLavanderia: "新洗衣店",
    nuevoEquipo: "新设备",
    ingresos: "收入",
    egresos: "支出",
    rentabilidad: "盈利能力",
    clientes: "客户",
    navegacion: { inicio: "首页", clientes: "客户", lavanderias: "洗衣店", finanzas: "财务", equipos: "设备", mas: "更多" }
  })
};

function traducir(textos: Textos, cambios: Partial<Textos>): Textos {
  return {
    ...textos,
    ...cambios,
    roles: { ...textos.roles, ...cambios.roles },
    permisos: { ...textos.permisos, ...cambios.permisos },
    navegacion: { ...textos.navegacion, ...cambios.navegacion }
  };
}
