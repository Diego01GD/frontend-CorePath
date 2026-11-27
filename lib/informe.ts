import { lecturaPerfil, opcionCercana, resumenPerfil } from "./perfil";
import { ESPECIALIDAD_POR_NOMBRE, ESPECIALIDADES, ESPECIALIDADES_PERFIL, UMBRALES, type Resultado } from "./resultados";

export const ORDEN_RIASEC = ["R", "I", "A", "S", "E", "C"];

const nombreBonito = (n: string) => ESPECIALIDAD_POR_NOMBRE[n]?.nombre ?? n;

export const nivelCongruencia = (puntos: number) =>
  puntos >= UMBRALES.congruenciaAlta ? "alta" : puntos >= UMBRALES.congruenciaMedia ? "media" : "baja";

/** Clave de puntajes (nombre del backend) de la especialidad recomendada. */
const claveRecomendada = (r: Resultado) =>
  r.especialidad ? ESPECIALIDADES_PERFIL.find((e) => e.nombre === ESPECIALIDADES[r.especialidad!]?.nombre)?.clave ?? null : null;

/** Los dos resultados: opción cercana (resultado por interés) y lectura del perfil RIASEC. */
export function dosResultados(r: Resultado) {
  const clave = claveRecomendada(r);
  const c = clave ? opcionCercana(r.puntajes.interes, clave, UMBRALES.margenCercana) : null;
  const letras = lecturaPerfil(r.codigo_riasec, ESPECIALIDADES_PERFIL);
  return {
    cercana: c && { ...c, nombre: nombreBonito(c.clave), color: ESPECIALIDAD_POR_NOMBRE[c.clave]?.color },
    letras,
    resumen: resumenPerfil(letras, ESPECIALIDADES_PERFIL.length),
  };
}

/** Datos del informe calculados a partir del resultado: lo comparten la vista en pantalla y el PDF. */
export function datosInforme(r: Resultado) {
  const p = r.puntajes;
  const interes = Object.entries(p.interes)
    .sort(([, a], [, b]) => b - a)
    .map(([clave, valor]) => ({ clave, nombre: nombreBonito(clave), valor, color: ESPECIALIDAD_POR_NOMBRE[clave]?.color }));
  const dims = ORDEN_RIASEC.map((d) => p.dimensiones[d] ?? 0);
  const maxDim = Math.max(...dims);
  const minDim = Math.min(...dims);
  const congruencias = Object.entries(p.congruencia).map(([clave, puntos]) => ({
    nombre: nombreBonito(clave),
    codigo: ESPECIALIDAD_POR_NOMBRE[clave]?.riasec ?? "",
    puntos,
  }));
  const dos = dosResultados(r);
  const clave = claveRecomendada(r);
  const recomendada = interes.find((e) => e.clave === clave) ?? interes[0];
  const margen = recomendada.valor - (interes.find((e) => e.clave !== recomendada.clave)?.valor ?? 0);
  return {
    esp: r.especialidad ? ESPECIALIDADES[r.especialidad] : null,
    interes,
    maxDim,
    minDim,
    congruencias,
    ...dos,
    regla: reglaAplicada(recomendada.nombre, recomendada.valor, margen, r.perfil_plano, dos.cercana?.nombre ?? null, r.tipo_resultado),
  };
}

/** Explica con los números del alumno qué regla del test decidió su resultado (misma lógica v5 del backend). */
export function reglaAplicada(nombre: string, valor: number, margen: number, plano: boolean, cercana: string | null, tipo: Resultado["tipo_resultado"]) {
  if (tipo === "Sin afinidad clara") // resultados guardados antes de la v4
    return "Tus respuestas no mostraron una preferencia marcada, así que el test de esa fecha no eligió una especialidad.";
  const base = `${nombre} fue tu mayor interés (${valor.toFixed(2)} de 5), por eso es tu especialidad recomendada.`;
  if (cercana)
    return `${base} ${cercana} quedó a solo ${margen.toFixed(2)} (menos de ${UMBRALES.margenCercana}), así que se muestra como opción cercana y el resultado va con nota.`;
  if (plano)
    return `${base} Tu perfil resultó plano (tus seis dimensiones quedaron muy parejas o todas por debajo de ${UMBRALES.planoMax.toFixed(1)}), así que va con nota: compárala con las otras dos antes de decidir.`;
  if (valor < UMBRALES.interesAlto)
    return `${base} Como no llegó a ${UMBRALES.interesAlto}, va con nota: explórala antes de decidir.`;
  return `${base} Le sacó ${margen.toFixed(2)} puntos a la segunda y pasó de ${UMBRALES.interesAlto}, así que la recomendación es clara.`;
}
