// Los resultados se borran a los 30 días (tarea pg_cron diaria, 03:00 UTC)
export const DIAS_RETENCION = 30;
const DIA_MS = 86_400_000;

/** Días completos que le quedan a un resultado antes de borrarse (0 = se borra hoy). */
export function diasRestantes(creadoEn: string | Date, ahora: Date = new Date()): number {
  const limite = new Date(creadoEn).getTime() + DIAS_RETENCION * DIA_MS;
  return Math.max(0, Math.ceil((limite - ahora.getTime()) / DIA_MS));
}

/** Fecha aproximada de borrado, para mostrar al usuario. */
export function fechaBorrado(creadoEn: string | Date): Date {
  return new Date(new Date(creadoEn).getTime() + DIAS_RETENCION * DIA_MS);
}
