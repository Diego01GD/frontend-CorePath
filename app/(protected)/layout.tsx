import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Logotipo from "../components/logo";
import AccionesSesion from "../components/acciones-sesion";
import { correoPermitido } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Segunda barrera tras el proxy: verifica la sesión en el servidor antes de mostrar la página
async function RequiereSesion({ children }: { children: React.ReactNode }) {
  // Solo en tiempo de petición: getClaims compara la caducidad del token con Date.now()
  await connection();
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
          {/* usePathname es dato de la petición en rutas dinámicas (/resultados/[id]) */}
          <Suspense fallback={<span className="size-11" aria-hidden="true" />}>
            <AccionesSesion />
          </Suspense>
        </div>
      </header>
      {/* Con cacheComponents, leer la sesión debe ir dentro de Suspense; el encabezado sale en el shell estático */}
      <Suspense fallback={<div className="flex flex-1 items-center justify-center p-12"><span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando" /></div>}>
        <RequiereSesion>{children}</RequiereSesion>
      </Suspense>
    </>
  );
}
