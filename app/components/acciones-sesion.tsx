"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EnlaceRegresar from "./enlace-regresar";
import MenuUsuario from "./menu-usuario";

// Acciones del encabezado protegido; en /test el diseño solo muestra "Guardar y salir"
export default function AccionesSesion() {
  const pathname = usePathname();

  if (pathname === "/test") {
    // El progreso se guarda en cada respuesta, así que "guardar" solo es salir
    return (
      <Link href="/comenzar" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-h lg:text-base">
        <Image src="/images/test/guardar.svg" width={20} height={20} alt="" className="hidden lg:block" />
        Guardar y salir
      </Link>
    );
  }

  return (
    <nav className="flex items-center gap-5" aria-label="Sesión">
      <EnlaceRegresar href="/">Inicio</EnlaceRegresar>
      <MenuUsuario />
    </nav>
  );
}
