import { createClient } from "./supabase/client";

// Cliente del backend FastAPI (navegador). Adjunta el token de Supabase en cada petición.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  // Las vistas capturan ApiError con status 401 y redirigen con useRouter().push("/login")
  if (!token) throw new ApiError(401, "Inicia sesión para continuar.");

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Evita la página de advertencia de ngrok (plan gratuito) en las respuestas de la API
        "ngrok-skip-browser-warning": "1",
        ...init.headers,
      },
    });
  } catch {
    // fetch solo lanza si no hubo respuesta: backend o túnel apagados, sin internet o bloqueo por CORS/CSP
    throw new ApiError(0, "No se pudo conectar con el servidor. Verifica que el backend esté encendido e intenta de nuevo.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // FastAPI manda `detail` como texto (errores propios) o lista (validación 422)
    const detail = typeof body?.detail === "string" ? body.detail : "No se pudo completar la solicitud.";
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export type Area = "ciberseguridad" | "desarrollo" | "ia";
export type Mensaje = { role: "user" | "assistant"; content: string };

export type TestItems = { id_version: string; items: { codigo: string; texto: string }[] };

export type ResultadoTest = {
  id_resultado: string;
  id_version: string;
  codigo: string;
  dimensiones: Record<string, number>;
  interes: Record<string, number>;
  congruencia: Record<string, number>;
  mejor_por_congruencia: string;
  nivel_congruencia: "Alta" | "Media" | "Baja";
  mejor_por_interes: string;
  perfil_plano: boolean;
  tipo_resultado: "Recomendada" | "Recomendada con nota" | "Sin afinidad clara";
  especialidad: string | null;
  area: Area | null;
  empate: string;
  atencion_ok: boolean | null;
};

export type RespuestaChat = {
  datos: string;
  recomendacion: string;
  area: Area;
  estado_avatar: "talking" | "error";
  timestamp: string;
};

export const api = {
  itemsTest: (version?: string) =>
    apiFetch<TestItems>(`/api/test/items${version ? `?version=${encodeURIComponent(version)}` : ""}`),

  enviarTest: (id_version: string, respuestas: Record<string, number>) =>
    apiFetch<ResultadoTest>("/api/test", { method: "POST", body: JSON.stringify({ id_version, respuestas }) }),

  // El backend acepta máximo 20 mensajes de historial y 1000 caracteres por pregunta
  chat: (mensaje: string, area: Area, historial: Mensaje[] = []) =>
    apiFetch<RespuestaChat>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ mensaje, area, historial: historial.slice(-20) }),
    }),
};
