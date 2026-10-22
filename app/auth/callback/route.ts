import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { correoPermitido } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Destino de Microsoft (vía Supabase) y del enlace por correo. Crea la sesión y redirige.
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
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const { error: fallo } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("sin código") };
  if (fallo) return error("enlace");

  const { data } = await supabase.auth.getClaims();
  if (!correoPermitido(data?.claims?.email)) {
    await supabase.auth.signOut();
    return error("dominio");
  }
  return NextResponse.redirect(destino("/comenzar"));
}
