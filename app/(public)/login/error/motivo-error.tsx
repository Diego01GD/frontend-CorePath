"use client";

import { useSearchParams } from "next/navigation";

// Textos fijos por motivo: nunca se muestra texto que venga en la URL (evita contenido inyectado)
const MENSAJES: Record<string, string> = {
  dominio:
    "La cuenta utilizada no pertenece al dominio institucional autorizado para CorePath. Cierra sesión en Microsoft e inténtalo de nuevo con tu cuenta del Tec.",
  enlace:
    "El inicio de sesión expiró o se completó en otro navegador. Vuelve a intentarlo desde la página de inicio de sesión.",
  cancelado: "Se canceló el inicio de sesión. Puedes intentarlo de nuevo cuando quieras.",
  consentimiento:
    "Para usar CorePath debes aceptar el Aviso de privacidad y la Política de uso. Márcalos en la página de inicio de sesión y vuelve a entrar con Microsoft.",
};

export default function MotivoError() {
  const motivo = useSearchParams().get("motivo") ?? "dominio";
  return <>{MENSAJES[motivo] ?? MENSAJES.dominio}</>;
}
