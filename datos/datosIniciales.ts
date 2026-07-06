export type Idioma = "es" | "en" | "fr" | "pt" | "de" | "zh";
export type RolUsuario = "arquitecto" | "administrador" | "supervisor" | "usuario";
export type Permiso =
  | "control_total"
  | "crear_clientes"
  | "crear_administradores"
  | "ver_todo"
  | "definir_saas"
  | "administrar_lavanderias_propias"
  | "crear_supervisores"
  | "registrar_operacion"
  | "registrar_gastos";

export const idiomasDisponibles: { codigo: Idioma; nombre: string }[] = [
  { codigo: "es", nombre: "Español" },
  { codigo: "en", nombre: "English" },
  { codigo: "fr", nombre: "Français" },
  { codigo: "pt", nombre: "Português" },
  { codigo: "de", nombre: "Deutsch" },
  { codigo: "zh", nombre: "中文普通话" }
];

export const permisosPorRol: Record<RolUsuario, Permiso[]> = {
  arquitecto: ["control_total", "crear_clientes", "crear_administradores", "ver_todo", "definir_saas"],
  administrador: ["administrar_lavanderias_propias", "crear_supervisores", "registrar_operacion", "registrar_gastos"],
  supervisor: ["registrar_operacion", "registrar_gastos"],
  usuario: ["registrar_gastos"]
};

export const datosIniciales = {
  clientes: [
    {
      id: "cliente-pp-ltda",
      nombre: "P&P Ltda",
      pais: "Chile",
      moneda: "CLP",
      idioma: "es",
      plan: "Enterprise Multisucursal"
    }
  ],
  lavanderias: [
    crearLavanderia("lav-001", "P&P Centro", "Av. Libertador Bernardo O'Higgins 1120, Santiago", 18850000, 7190000, 11660),
    crearLavanderia("lav-002", "P&P Providencia", "Av. Providencia 2210, Providencia", 21400000, 8150000, 13240),
    crearLavanderia("lav-003", "P&P Ñuñoa", "Irarrázaval 3560, Ñuñoa", 17350000, 6820000, 10480),
    crearLavanderia("lav-004", "P&P Las Condes", "Apoquindo 5100, Las Condes", 24650000, 9300000, 15120),
    crearLavanderia("lav-005", "P&P Maipú", "Av. Pajaritos 3020, Maipú", 15890000, 6040000, 9720),
    crearLavanderia("lav-006", "P&P La Florida", "Vicuña Mackenna 7210, La Florida", 18120000, 6940000, 11080),
    crearLavanderia("lav-007", "P&P Viña del Mar", "Av. Valparaíso 680, Viña del Mar", 19680000, 7420000, 12110)
  ],
  equipos: [
    crearEquipo("eq-001", "lav-001", "Lavadora", "Speed Queen", "SCN040", "SQ-CL-0401", "18 kg", "Operativo", 4200000, 1280000),
    crearEquipo("eq-002", "lav-001", "Secadora", "Huebsch", "HT075", "HB-CL-0752", "34 kg", "Operativo", 5100000, 1460000),
    crearEquipo("eq-003", "lav-002", "Lavadora", "Maytag", "MHN33", "MY-PV-3304", "14 kg", "Operativo", 3900000, 1190000),
    crearEquipo("eq-004", "lav-002", "Secadora", "Speed Queen", "ST075", "SQ-PV-0756", "34 kg", "Mantención", 5200000, 920000),
    crearEquipo("eq-005", "lav-003", "Lavadora", "Electrolux", "WH6-20", "EL-NN-2061", "20 kg", "Operativo", 6100000, 1340000),
    crearEquipo("eq-006", "lav-004", "Lavadora", "Dexter", "T-600", "DX-LC-6002", "27 kg", "Operativo", 6800000, 1740000),
    crearEquipo("eq-007", "lav-004", "Secadora", "Dexter", "T-80", "DX-LC-8008", "36 kg", "Operativo", 7200000, 1880000),
    crearEquipo("eq-008", "lav-005", "Lavadora", "Speed Queen", "SCN030", "SQ-MP-0309", "13 kg", "Observación", 3500000, 780000),
    crearEquipo("eq-009", "lav-006", "Secadora", "Huebsch", "HT055", "HB-LF-0552", "25 kg", "Operativo", 4400000, 1120000),
    crearEquipo("eq-010", "lav-007", "Lavadora", "Electrolux", "WH6-14", "EL-VM-1407", "14 kg", "Operativo", 4700000, 1210000)
  ],
  categoriasEgreso: [
    { nombre: "Cuentas básicas", monto: 9850000 },
    { nombre: "Arriendos", monto: 16200000 },
    { nombre: "Repuestos", monto: 2380000 },
    { nombre: "Mantenciones", monto: 3120000 },
    { nombre: "Comisiones", monto: 1850000 },
    { nombre: "Gastos administrativos", monto: 4270000 }
  ],
  alertas: [
    "P&P Providencia: secadora ST075 con mantención abierta",
    "P&P Maipú: lavadora SCN030 requiere revisión de vibración",
    "P&P Las Condes: rendimiento 12% sobre meta mensual"
  ],
  modulosSaas: [
    "Planes, módulos y permisos por tenant",
    "Arquitectura multicliente con aislamiento de datos",
    "Usuarios por rol: Arquitecto, Administrador, Supervisor y Usuario",
    "Reportes ejecutivos, operacionales y financieros"
  ],
  preparadoPara: [
    "Múltiples países, monedas e idiomas",
    "Supabase Auth, PostgreSQL y Row Level Security",
    "Instalación PWA en iPhone y Android",
    "Expansión internacional por franquicias o cadenas"
  ]
};

function crearLavanderia(id: string, nombre: string, direccion: string, ingresosMensuales: number, egresosMensuales: number, ciclosMensuales: number) {
  return {
    id,
    clienteId: "cliente-pp-ltda",
    nombre,
    direccion,
    ingresosMensuales,
    egresosMensuales,
    rentabilidad: ingresosMensuales - egresosMensuales,
    ciclosMensuales,
    recaudaciones: [
      { fecha: "2026-07-01", monto: Math.round(ingresosMensuales * 0.25) },
      { fecha: "2026-07-04", monto: Math.round(ingresosMensuales * 0.19) }
    ],
    cuentas: ["Agua", "Electricidad", "Gas", "Internet"],
    mantenciones: ["Preventiva mensual", "Limpieza de ductos"],
    reportes: ["Rentabilidad", "Ciclos", "Recaudación", "Consumos"]
  };
}

function crearEquipo(id: string, lavanderiaId: string, tipo: string, marca: string, modelo: string, numeroSerie: string, capacidad: string, estado: "Operativo" | "Mantención" | "Observación", valorInversion: number, rentabilidadMensual: number) {
  return {
    id,
    lavanderiaId,
    tipo,
    marca,
    modelo,
    numeroSerie,
    capacidad,
    estado,
    fechaCompra: "2024-03-15",
    valorInversion,
    rentabilidadMensual,
    historialMantenciones: ["Instalación validada", "Mantención preventiva trimestral"]
  };
}
