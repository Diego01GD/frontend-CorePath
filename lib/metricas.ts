import { createClient } from "./supabase/client";

// Métricas anónimas de las pruebas con alumnos (NEXT_PUBLIC_METRICAS=true). Sin usuario ni texto: solo tiempos y estados.
const ACTIVAS = process.env.NEXT_PUBLIC_METRICAS === "true";
let sesion = "";

// Código aleatorio por pestaña: agrupa los eventos de una visita sin identificar a nadie
function idSesion(): string {
  if (sesion) return sesion;
  try {
    sesion = sessionStorage.getItem("corepath:prueba") ?? "";
    if (!sesion) sessionStorage.setItem("corepath:prueba", (sesion = crypto.randomUUID()));
  } catch {
    sesion ||= crypto.randomUUID();
  }
  return sesion;
}

export const cabeceraSesion = (): Record<string, string> => (ACTIVAS ? { "X-Sesion-Prueba": idSesion() } : {});

// Nunca espera ni lanza: una métrica que falla no debe afectar al alumno
export function medir(tipo: "peticion" | "web_vital", datos: Record<string, string | number>) {
  if (!ACTIVAS) return;
  createClient()
    .from("metricas")
    .insert({ origen: "frontend", tipo, sesion: idSesion(), datos })
    .then(undefined, () => {});
}

// US-03: evaluación temporal de las vistas al terminar el test (solo con NEXT_PUBLIC_METRICAS=true).
// Se marca al enviar el test y se pide una sola vez, en la página del resultado recién creado.
const CLAVE_EVALUAR = "corepath:evaluar";

export function pedirEvaluacion(idResultado: string) {
  if (!ACTIVAS) return;
  try {
    sessionStorage.setItem(CLAVE_EVALUAR, idResultado);
  } catch {}
}

export function evaluacionPendiente(idResultado: string): boolean {
  try {
    return ACTIVAS && sessionStorage.getItem(CLAVE_EVALUAR) === idResultado;
  } catch {
    return false;
  }
}

export function descartarEvaluacion() {
  try {
    sessionStorage.removeItem(CLAVE_EVALUAR);
  } catch {}
}

export type Evaluacion = { inicio_sesion: number | null; test: number | null; resultado: number | null; recomendaciones: string | null };

// Sin usuario: solo el código de la pestaña, para cruzarla con las métricas de esa visita
export async function enviarEvaluacion(datos: Evaluacion) {
  const { error } = await createClient().from("evaluaciones").insert({ sesion: idSesion(), ...datos });
  if (error) throw error;
}
