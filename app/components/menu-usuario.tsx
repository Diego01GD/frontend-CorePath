"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Con sesión: ícono de usuario con "Mis resultados" y "Cerrar sesión". Sin sesión: el botón "Ingresar" de siempre.
export default function MenuUsuario() {
  const [correo, setCorreo] = useState<string | null | undefined>(undefined); // undefined = aún no se sabe
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    // getSession solo lee la cookie local: sirve para decidir qué mostrar, no para autorizar (eso lo hacen proxy y backend)
    supabase.auth.getSession().then(({ data }) => setCorreo(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, sesion) => setCorreo(sesion?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const cerrarFuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const cerrarEsc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", cerrarFuera);
    document.addEventListener("keydown", cerrarEsc);
    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEsc);
    };
  }, [abierto]);

  if (!correo) {
    return (
      <Link
        href="/login"
        // invisible mientras se lee la sesión, para no mostrar "Ingresar" un instante a quien ya entró
        className={`rounded-2xl border border-primary px-5 py-3 font-bold text-primary hover:bg-primary hover:text-surfaces ${correo === undefined ? "invisible" : ""}`}
      >
        Ingresar
      </Link>
    );
  }

  const borrarProgresoLocal = () => {
    // En una computadora compartida, el siguiente alumno no debe ver respuestas a medias de otro
    try {
      Object.keys(localStorage).filter((k) => k.startsWith("corepath:test:")).forEach((k) => localStorage.removeItem(k));
    } catch {}
  };

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="menu-usuario"
        aria-label="Menú de tu cuenta"
        className="flex size-11 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-surfaces aria-expanded:bg-primary aria-expanded:text-surfaces"
      >
        <UserRound size={22} aria-hidden="true" />
      </button>

      {abierto && (
        <div
          id="menu-usuario"
          className="absolute right-0 top-13 z-20 w-64 rounded-2xl border border-bordes-s/30 bg-cards p-2 shadow-lg"
        >
          <p className="truncate px-3 pb-2 pt-1 text-sm text-ctext-2" title={correo}>
            {correo}
          </p>
          <Link
            href="/resultados"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold hover:bg-primary/10 hover:text-primary"
          >
            <ClipboardList size={18} aria-hidden="true" />
            Mis resultados
          </Link>
          <form action="/auth/salir" method="post" onSubmit={borrarProgresoLocal}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold hover:bg-primary/10 hover:text-primary"
            >
              <LogOut size={18} aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
