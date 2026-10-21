import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Todo excepto archivos estáticos e imágenes, para no bloquear CSS/JS ni gastar una llamada por recurso
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
