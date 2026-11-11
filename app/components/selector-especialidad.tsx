"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { Area } from "@/lib/api";

export const AREAS: { area: Area; nombre: string; color: string }[] = [
  { area: "ciberseguridad", nombre: "Ciberseguridad", color: "bg-cib" },
  { area: "desarrollo", nombre: "Desarrollo Web y Móvil", color: "bg-web" },
  { area: "ia", nombre: "Inteligencia Artificial", color: "bg-ia" },
];

type Props = {
  valor: Area;
  onCambiar: (a: Area) => void;
  aviso: boolean; // aviso de primera vez que señala este selector
  onCerrarAviso: () => void;
};

// Lista desplegable accesible (botón + listbox): flechas para moverse, Enter para elegir, Esc para cerrar
export default function SelectorEspecialidad({ valor, onCambiar, aviso, onCerrarAviso }: Props) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const entendido = useRef<HTMLButtonElement>(null);
  const actual = AREAS.find((a) => a.area === valor)!;

  const opciones = () => Array.from(lista.current?.querySelectorAll<HTMLLIElement>("[role=option]") ?? []);
  const cerrar = (enfocar = true) => {
    setAbierto(false);
    if (enfocar) boton.current?.focus();
  };

  useEffect(() => {
    if (abierto) opciones().find((o) => o.getAttribute("aria-selected") === "true")?.focus();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!boton.current?.parentElement?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  const cerrarAviso = () => {
    onCerrarAviso();
    boton.current?.focus();
  };

  useEffect(() => {
    if (aviso) entendido.current?.focus();
  }, [aviso]);

  useEffect(() => {
    if (!aviso) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onCerrarAviso();
      boton.current?.focus();
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [aviso, onCerrarAviso]);

  const teclas = (e: React.KeyboardEvent) => {
    const items = opciones();
    const i = items.indexOf(document.activeElement as HTMLLIElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (i >= 0) elegir(AREAS[i].area);
    } else if (e.key === "Escape") {
      cerrar();
    } else if (e.key === "Tab") {
      cerrar(false);
    }
  };

  const elegir = (a: Area) => {
    onCambiar(a);
    cerrar();
  };

  return (
    <div className={`relative ${aviso ? "z-50" : ""}`}>
      <button
        ref={boton}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={`Especialidad: ${actual.nombre}`}
        onClick={() => {
          if (aviso) onCerrarAviso();
          setAbierto(!abierto);
        }}
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-bordes-s bg-cards pr-3 pl-3.5 text-sm transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="text-ctext-2 max-lg:hidden">Especialidad:</span>
        <span className={`size-2.5 shrink-0 rounded-full ${actual.color}`} aria-hidden="true" />
        <span className="font-semibold">{actual.nombre}</span>
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <ul
          ref={lista}
          role="listbox"
          aria-label="Especialidad"
          onKeyDown={teclas}
          className="absolute right-0 z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-bordes-s bg-cards p-1.5 shadow-xl shadow-ctext/15 motion-safe:animate-aparecer-rapido"
        >
          {AREAS.map((o) => {
            const elegida = o.area === valor;
            return (
              <li
                key={o.area}
                role="option"
                aria-selected={elegida}
                tabIndex={-1}
                onClick={() => elegir(o.area)}
                className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl px-3 text-sm outline-none hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary ${elegida ? "bg-primary/15 font-semibold" : ""}`}
              >
                <span className={`size-2.5 shrink-0 rounded-full ${o.color}`} aria-hidden="true" />
                <span className="flex-1">{o.nombre}</span>
                {elegida && <Check size={18} className="text-primary" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}

      {/* La tarjeta del aviso es clara en ambos temas (bg-surfaces no cambia): texto y botón con colores fijos para no perder contraste */}
      {aviso && (
        <div
          role="dialog"
          aria-labelledby="aviso-especialidad-titulo"
          aria-describedby="aviso-especialidad-texto"
          className="absolute right-0 mt-4 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-surfaces text-aviso-texto shadow-xl shadow-ctext/20 motion-safe:animate-aparecer"
        >
          {/* Flecha que apunta al selector */}
          <span className="absolute -top-2 right-10 size-4 rotate-45 bg-aviso-cabecera" aria-hidden="true" />
          <div className="relative flex items-center justify-between rounded-t-2xl bg-aviso-cabecera py-1 pr-1 pl-5 text-white">
            <h2 id="aviso-especialidad-titulo" className="font-semibold">Selección de especialidad</h2>
            <button
              type="button"
              onClick={cerrarAviso}
              aria-label="Cerrar aviso"
              className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-4 px-5 pt-4 pb-5">
            <p id="aviso-especialidad-texto" className="text-sm leading-6">
              Selecciona la especialidad sobre la que tienes dudas para poder darte una mejor respuesta.
            </p>
            <button
              ref={entendido}
              type="button"
              onClick={cerrarAviso}
              className="min-h-11 cursor-pointer rounded-lg bg-aviso-boton px-5 text-sm font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aviso-boton"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
