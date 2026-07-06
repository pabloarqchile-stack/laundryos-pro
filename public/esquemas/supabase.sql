create type rol_usuario as enum ('arquitecto', 'administrador', 'supervisor', 'usuario');
create type estado_equipo as enum ('operativo', 'mantencion', 'observacion', 'fuera_servicio');

create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  pais text not null,
  moneda char(3) not null,
  idioma char(2) not null default 'es',
  plan text not null,
  creado_en timestamptz not null default now()
);

create table usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  cliente_id uuid references clientes(id),
  rol rol_usuario not null default 'usuario',
  nombre text not null,
  email text not null unique,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table lavanderias (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nombre text not null,
  direccion text not null,
  pais text not null,
  moneda char(3) not null,
  activa boolean not null default true,
  creado_en timestamptz not null default now()
);

create table equipos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  lavanderia_id uuid not null references lavanderias(id) on delete cascade,
  tipo text not null,
  marca text not null,
  modelo text not null,
  numero_serie text not null unique,
  capacidad text not null,
  estado estado_equipo not null default 'operativo',
  fecha_compra date,
  valor_inversion numeric(14, 2) not null default 0,
  creado_en timestamptz not null default now()
);

create table movimientos_financieros (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  lavanderia_id uuid references lavanderias(id) on delete set null,
  creado_por uuid references usuarios(id),
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  categoria text not null,
  monto numeric(14, 2) not null,
  moneda char(3) not null,
  fecha date not null,
  observacion text
);

create table ciclos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  lavanderia_id uuid not null references lavanderias(id) on delete cascade,
  equipo_id uuid references equipos(id) on delete set null,
  cantidad integer not null,
  fecha date not null,
  observacion text
);

create table mantenciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  lavanderia_id uuid not null references lavanderias(id) on delete cascade,
  equipo_id uuid references equipos(id) on delete set null,
  tipo text not null,
  costo numeric(14, 2) not null default 0,
  fecha date not null,
  observacion text
);

alter table clientes enable row level security;
alter table usuarios enable row level security;
alter table lavanderias enable row level security;
alter table equipos enable row level security;
alter table movimientos_financieros enable row level security;
alter table ciclos enable row level security;
alter table mantenciones enable row level security;

create or replace function usuario_actual_es_arquitecto()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from usuarios
    where id = auth.uid()
    and rol = 'arquitecto'
    and activo = true
  );
$$;

create or replace function cliente_usuario_actual()
returns uuid
language sql
stable
security definer
as $$
  select cliente_id from usuarios where id = auth.uid() and activo = true;
$$;

create policy clientes_lectura on clientes
for select using (usuario_actual_es_arquitecto() or id = cliente_usuario_actual());

create policy usuarios_lectura on usuarios
for select using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual() or id = auth.uid());

create policy lavanderias_tenant on lavanderias
for all using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual())
with check (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual());

create policy equipos_tenant on equipos
for all using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual())
with check (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual());

create policy finanzas_tenant on movimientos_financieros
for all using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual())
with check (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual());

create policy ciclos_tenant on ciclos
for all using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual())
with check (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual());

create policy mantenciones_tenant on mantenciones
for all using (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual())
with check (usuario_actual_es_arquitecto() or cliente_id = cliente_usuario_actual());
