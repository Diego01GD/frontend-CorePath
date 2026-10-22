import { createClient } from "./supabase/client";
import type { Area } from "./api";

// Lectura directa de Supabase: la política RLS "ver mis resultados" solo devuelve los del usuario de la sesión
export type Resultado = {
  id_resultado: string;
  creado_en: string;
  codigo_riasec: string;
  especialidad: string | null; // código: CIB | WEB | IA (null = sin afinidad clara)
  tipo_resultado: "Recomendada" | "Recomendada con nota" | "Sin afinidad clara";
  nivel_congruencia: "Alta" | "Media" | "Baja";
  perfil_plano: boolean;
  puntajes: {
    dimensiones: Record<string, number>;
    interes: Record<string, number>;
    congruencia: Record<string, number>;
  };
};

const COLUMNAS = "id_resultado, creado_en, codigo_riasec, especialidad, tipo_resultado, nivel_congruencia, perfil_plano, puntajes";

// El catálogo de especialidades no es legible para el navegador; estos datos son fijos y públicos
export const ESPECIALIDADES: Record<string, { nombre: string; area: Area; color: string }> = {
  CIB: { nombre: "Ciberseguridad", area: "ciberseguridad", color: "var(--cib)" },
  WEB: { nombre: "Desarrollo Web y Móvil", area: "desarrollo", color: "var(--web)" },
  IA: { nombre: "Inteligencia Artificial", area: "ia", color: "var(--ia)" },
};

// Las llaves de puntajes.interes son los nombres del catálogo del backend
export const ESPECIALIDAD_POR_NOMBRE: Record<string, (typeof ESPECIALIDADES)[string]> = {
  Ciberseguridad: ESPECIALIDADES.CIB,
  "Desarrollo Web/Móvil": ESPECIALIDADES.WEB,
  "Inteligencia Artificial": ESPECIALIDADES.IA,
};

export const DIMENSIONES: Record<string, string> = {
  R: "Realista",
  I: "Investigador",
  A: "Artístico",
  S: "Social",
  E: "Emprendedor",
  C: "Convencional",
};

// Color de cada dimensión: tokens de globals.css (cambian con el tema)
export const COLOR_DIMENSION: Record<string, string> = {
  R: "--dim-r",
  I: "--dim-i",
  A: "--dim-a",
  S: "--dim-s",
  E: "--dim-e",
  C: "--dim-c",
};

export async function listarResultados(): Promise<Resultado[]> {
  const { data, error } = await createClient()
    .from("resultados")
    .select(COLUMNAS)
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data as Resultado[];
}

export async function obtenerResultado(id: string): Promise<Resultado | null> {
  const { data, error } = await createClient().from("resultados").select(COLUMNAS).eq("id_resultado", id).maybeSingle();
  if (error) throw error;
  return data as Resultado | null;
}

export const formatoFecha = (iso: string | Date) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
