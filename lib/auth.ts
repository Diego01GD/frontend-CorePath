// Dominios institucionales permitidos. Es una comprobación de UX: la barrera real está en el hook de Supabase y en el backend
const DOMINIOS = (process.env.NEXT_PUBLIC_DOMINIOS_CORREO ?? "merida.tecnm.mx")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export function correoPermitido(email: unknown): boolean {
  return typeof email === "string" && DOMINIOS.includes(email.toLowerCase().split("@").pop() ?? "");
}

export const DOMINIO_PRINCIPAL = DOMINIOS[0];

export const RUTAS_PROTEGIDAS = ["/comenzar", "/test", "/chat", "/resultados"];
