"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";

// Enlace "← Regresar" del sitio: al pasar el cursor aparece una pastilla suave y la flecha se adelanta hacia atrás.
// Con `volver` regresa a la página anterior (p. ej. inicio o login); `href` queda para cuando se abrió directo.
export default function EnlaceRegresar({ href, volver, children }: { href: string; volver?: boolean; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(e) => {
        // shortcut: history.length no distingue si lo anterior es de otro sitio; usar un registro propio si llega a importar
        if (volver && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className="group -mx-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 hover:text-primary-h focus-visible:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/15"
    >
      <MoveLeft
        size={20}
        aria-hidden="true"
        className="transition-transform duration-200 ease-out group-hover:-translate-x-1 group-focus-visible:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
      {children}
    </Link>
  );
}
