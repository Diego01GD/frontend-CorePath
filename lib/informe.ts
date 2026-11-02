import { ESPECIALIDAD_POR_NOMBRE, ESPECIALIDADES, UMBRALES, type Resultado } from "./resultados";

export const ORDEN_RIASEC = ["R", "I", "A", "S", "E", "C"];

const nombreBonito = (n: string) => ESPECIALIDAD_POR_NOMBRE[n]?.nombre ?? n;

export const nivelCongruencia = (puntos: number) =>
  puntos >= UMBRALES.congruenciaAlta ? "alta" : puntos >= UMBRALES.congruenciaMedia ? "media" : "baja";

/** Datos del informe calculados a partir del resultado: lo comparten la vista en pantalla y el PDF. */
export function datosInforme(r: Resultado) {
  const p = r.puntajes;
  const interes = Object.entries(p.interes)
    .sort(([, a], [, b]) => b - a)
    .map(([clave, valor]) => ({ clave, nombre: nombreBonito(clave), valor, color: ESPECIALIDAD_POR_NOMBRE[clave]?.color }));
  const dims = ORDEN_RIASEC.map((d) => p.dimensiones[d] ?? 0);
  const maxDim = Math.max(...dims);
  const minDim = Math.min(...dims);
  const congMejor = p.congruencia[interes[0].clave] ?? 0;
  const congruencias = Object.entries(p.congruencia).map(([clave, puntos]) => ({
    nombre: nombreBonito(clave),
    codigo: ESPECIALIDAD_POR_NOMBRE[clave]?.riasec ?? "",
    puntos,
  }));
  return {
    esp: r.especialidad ? ESPECIALIDADES[r.especialidad] : null,
    interes,
    maxDim,
    minDim,
    congruencias,
    regla: reglaAplicada(interes[0].nombre, interes[0].valor, congMejor, r.perfil_plano),
  };
}

/** Explica con los números del alumno qué regla del test decidió su resultado (misma lógica v3 del backend). */
export function reglaAplicada(nombre: string, valor: number, congMejor: number, plano: boolean) {
  if (plano)
    return `Tu perfil resultó plano (tus seis dimensiones quedaron muy parejas o todas por debajo de ${UMBRALES.planoMax.toFixed(1)}), así que el test no puede distinguir con seguridad una especialidad.`;
  if (valor < UMBRALES.interesAlto)
    return `Tu mayor interés fue ${nombre} con ${valor.toFixed(2)}, pero no alcanzó el mínimo de ${UMBRALES.interesAlto} para recomendarla con confianza.`;
  if (congMejor >= UMBRALES.congruenciaMedia)
    return `${nombre} fue tu mayor interés (${valor.toFixed(2)} de 5) y tu perfil RIASEC coincide con ella (${congMejor} de 18 puntos, mínimo ${UMBRALES.congruenciaMedia}). Por eso se recomienda.`;
  return `${nombre} fue tu mayor interés (${valor.toFixed(2)} de 5), pero tu perfil RIASEC coincide poco con ella (${congMejor} de 18, menos de ${UMBRALES.congruenciaMedia}). Se recomienda con una nota: explórala antes de decidir.`;
}
