"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeControl from "./theme-control";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);
  const linkClass = (href: string) =>
    `transition-colors hover:text-primary ${
      pathname === href
        ? "font-bold text-primary underline decoration-2 underline-offset-8"
        : ""
    }`;

  return (
    <nav aria-label="Navegación principal" className="relative">
      <button
        type="button"
        aria-controls="main-menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className={`h-0.5 w-7 rounded bg-primary transition-transform duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 rounded bg-primary transition-opacity duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 rounded bg-primary transition-transform duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      <ul
        id="main-menu"
        className={`absolute right-0 top-12 z-10 flex min-w-56 origin-top flex-col gap-5 rounded-xl bg-cards p-5 shadow-lg transition-all duration-300 md:static md:min-w-0 md:flex-row md:items-center md:gap-5 md:bg-transparent md:p-0 md:shadow-none md:opacity-100 md:translate-y-0 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0 md:pointer-events-auto md:visible"
        }`}
      >
        <li><Link className={linkClass("/")} href="/" onClick={closeMenu}>Inicio</Link></li>
        <li><Link className={linkClass("/nosotros")} href="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
        <li><Link className={linkClass("/preguntas-frecuentes")} href="/preguntas-frecuentes" onClick={closeMenu}>Preguntas Frecuentes</Link></li>
        <li><ThemeControl /></li>
      </ul>
    </nav>
  );
}

export default Menu;