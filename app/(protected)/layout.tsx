import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, MoveLeft } from "lucide-react";
import Logotipo from "../components/logo";
import { correoPermitido } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Segunda barrera tras el proxy: verifica la sesión en el servidor antes de mostrar la página
async function RequiereSesion({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!correoPermitido(data?.claims?.email)) redirect("/login");
  return children;
}

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="w-full bg-cards p-4">
        <div className="m-auto flex max-w-7xl items-center justify-between gap-4">
          <Logotipo />
          <nav className="flex items-center gap-5" aria-label="Sesión">
            <Link href="/" className="flex items-center gap-1.5 font-bold text-primary hover:text-primary-h">
              <MoveLeft aria-hidden="true" />
              Inicio
            </Link>
            <form action="/auth/salir" method="post">
              <button type="submit" className="flex items-center gap-1.5 text-sm text-ctext/70 hover:text-primary">
                <LogOut size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sr-only sm:hidden">Cerrar sesión</span>
              </button>
            </form>
          </nav>
        </div>
      </header>
      {/* Con cacheComponents, leer la sesión debe ir dentro de Suspense; el encabezado sale en el shell estático */}
      <Suspense fallback={<div className="flex flex-1 items-center justify-center p-12"><span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando" /></div>}>
        <RequiereSesion>{children}</RequiereSesion>
      </Suspense>
    </>
  );
}
