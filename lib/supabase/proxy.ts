import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { correoPermitido, RUTAS_PROTEGIDAS } from "../auth";

// Patrón oficial de @supabase/ssr: refresca el token en cada petición y lo devuelve en cookies
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // No poner código entre createServerClient y getClaims (recomendación de Supabase)
  const { data } = await supabase.auth.getClaims();
  const conSesion = correoPermitido(data?.claims?.email);
  const { pathname } = request.nextUrl;

  const redirigir = (ruta: string) => {
    const url = request.nextUrl.clone();
    url.pathname = ruta;
    url.search = "";
    const r = NextResponse.redirect(url);
    // Conserva las cookies refrescadas al redirigir
    response.cookies.getAll().forEach((c) => r.cookies.set(c));
    return r;
  };

  if (!conSesion && RUTAS_PROTEGIDAS.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return redirigir("/login");
  }
  if (conSesion && pathname === "/login") {
    return redirigir("/comenzar");
  }
  return response;
}
