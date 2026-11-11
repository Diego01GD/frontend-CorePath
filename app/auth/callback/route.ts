import { NextResponse, type NextRequest } from "next/server";
import { correoPermitido } from "@/lib/auth";
import { COOKIE_CONSENTIMIENTO, VERSION_AVISOS } from "@/lib/consentimiento";
import { createClient } from "@/lib/supabase/server";

// Destino del inicio de sesión con Microsoft (vía Supabase). Crea la sesión y redirige.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const destino = (ruta: string) => {
    const url = request.nextUrl.clone();
    url.pathname = ruta;
    url.search = ""; // nunca dejar el código ni el token en la URL final
    return url;
  };
  const error = (motivo: string) => {
    const url = destino("/login/error");
    url.searchParams.set("motivo", motivo);
    return NextResponse.redirect(url);
  };

  // Supabase/Microsoft devuelven ?error=...&error_code=...&error_description=... cuando algo falla antes de llegar aquí
  const err = searchParams.get("error");
  if (err) {
    const codigo = searchParams.get("error_code") ?? "";
    const detalle = searchParams.get("error_description") ?? "";
    if (/otp_expired|flow_state/i.test(codigo) || /expired|invalid/i.test(detalle)) return error("enlace");
    if (/institucional|signup|hook/i.test(`${codigo} ${detalle}`)) return error("dominio");
    return error("cancelado");
  }

  const supabase = await createClient();
  const code = searchParams.get("code");
  const { error: fallo } = code ? await supabase.auth.exchangeCodeForSession(code) : { error: new Error("sin código") };
  if (fallo) return error("enlace");

  const { data } = await supabase.auth.getClaims();
  if (!correoPermitido(data?.claims?.email)) {
    await supabase.auth.signOut();
    return error("dominio");
  }

  // Sin aceptación registrada de la versión vigente no hay sesión: se acepta en /login, en este mismo navegador
  const aceptoAhora = request.cookies.get(COOKIE_CONSENTIMIENTO)?.value === VERSION_AVISOS;
  const { error: sinRegistro } = aceptoAhora
    ? await supabase.rpc("registrar_consentimiento", { p_version: VERSION_AVISOS })
    : await supabase.from("consentimientos").select("id_usuario").eq("version_avisos", VERSION_AVISOS).single();
  if (sinRegistro) {
    await supabase.auth.signOut();
    return error("consentimiento");
  }

  const respuesta = NextResponse.redirect(destino("/comenzar"));
  respuesta.cookies.delete(COOKIE_CONSENTIMIENTO);
  return respuesta;
}
