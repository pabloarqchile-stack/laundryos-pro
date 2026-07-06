# LaundryOS Pro

Piloto PWA para administración de lavanderías de autoservicio.

## Operación incluida

- Dashboard móvil con KPI, ranking, alertas y estado de equipos.
- Creación de lavanderías.
- Creación de equipos.
- Registro de recaudaciones e ingresos.
- Registro de gastos.
- Persistencia automática en el dispositivo usando `localStorage`.
- Descarga de respaldo JSON desde la sección `Más`.
- Preparado para GitHub Pages y futura conexión Supabase.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy-github-pages.yml` compila la app como sitio estático y la publica en GitHub Pages cuando se sube a `main`.

Después de subir el repositorio:

1. En GitHub, abrir `Settings`.
2. Ir a `Pages`.
3. En `Build and deployment`, seleccionar `GitHub Actions`.
4. Ejecutar o esperar el workflow `Deploy LaundryOS Pro`.

La URL quedará con el formato:

```text
https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/
```
