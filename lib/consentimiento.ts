// Versión vigente del Aviso de privacidad y la Política de uso. Cambiarla obliga a todos a aceptarlas de nuevo.
export const VERSION_AVISOS = "2026-11";
export const COOKIE_CONSENTIMIENTO = "corepath_consentimiento";
const CLAVE_LOCAL = "corepath:consentimiento";

// El login la llama justo antes de ir a Microsoft; /auth/callback la registra en Supabase.
// Lax: el navegador la envía al volver de Microsoft (navegación GET de nivel superior).
export function marcarConsentimiento() {
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENTIMIENTO}=${VERSION_AVISOS}; Path=/; Max-Age=3600; SameSite=Lax${seguro}`;
  try {
    localStorage.setItem(CLAVE_LOCAL, VERSION_AVISOS);
  } catch {}
}

// Solo para no volver a pedir las casillas en este navegador; el registro válido es el de Supabase.
export function consentimientoPrevio(): boolean {
  try {
    return localStorage.getItem(CLAVE_LOCAL) === VERSION_AVISOS;
  } catch {
    return false;
  }
}
