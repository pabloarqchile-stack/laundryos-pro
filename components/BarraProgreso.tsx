export function BarraProgreso({ valor }: { valor: number }) {
  const porcentaje = Math.max(6, Math.min(100, Math.round(valor * 100)));

  return (
    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100" aria-label={`${porcentaje}%`}>
      <div className="h-full rounded-full bg-gradient-to-r from-blue-700 via-oceano to-cielo" style={{ width: `${porcentaje}%` }} />
    </div>
  );
}
