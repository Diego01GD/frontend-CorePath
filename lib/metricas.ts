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
