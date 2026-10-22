"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import EnlaceRegresar from "../../../components/enlace-regresar";
import RadarRiasec from "../../../components/radar-riasec";
import { COLOR_DIMENSION, DIMENSIONES, ESPECIALIDAD_POR_NOMBRE, ESPECIALIDADES, formatoFecha, obtenerResultado, type Resultado } from "@/lib/resultados";
import { diasRestantes, fechaBorrado } from "@/lib/retencion";

const EXPLICACION: Record<Resultado["tipo_resultado"], string> = {
  Recomendada: "Tus intereses apuntan con claridad a esta especialidad y tu perfil RIASEC coincide con ella.",
  "Recomendada con nota":
    "Es el área que más te interesa, aunque tu perfil RIASEC coincide solo en parte. Vale la pena explorarla con A.N.A antes de decidir.",
  "Sin afinidad clara":
    "Tus respuestas no muestran una preferencia marcada por una sola especialidad. Conversa con A.N.A para conocer mejor las tres.",
};

// shortcut: vista provisional del resultado; reemplazar por el diseño final de Figma cuando esté listo
export default function ResultadoPage() {
  const { id } = useParams<{ id: string }>();
  const [resultado, setResultado] = useState<Resultado | null | undefined>(undefined);

  useEffect(() => {
    // Un id inválido o ajeno devuelve error o nada (RLS): en ambos casos se muestra "no encontrado"
    obtenerResultado(id).then(setResultado, () => setResultado(null));
  }, [id]);

  if (resultado === undefined) {
    return (
      <main className="flex flex-1 items-center justify-center p-12">
        <span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando tu resultado" />
      </main>
    );
  }

  if (resultado === null) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="font-titulos text-3xl font-bold">No encontramos este resultado</h1>
        <p className="text-ctext-2">Puede que ya se haya borrado por cumplir 30 días o que el enlace no sea correcto.</p>
        <Link href="/resultados" className="btn btn-primary">Ver mis resultados</Link>
      </main>
    );
  }

  const esp = resultado.especialidad ? ESPECIALIDADES[resultado.especialidad] : null;
  const dias = diasRestantes(resultado.creado_en);
  const interes = Object.entries(resultado.puntajes.interes).sort(([, a], [, b]) => b - a);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <EnlaceRegresar href="/resultados">Mis resultados</EnlaceRegresar>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <section aria-labelledby="titulo-resultado">
          <p className="text-ctext-2">
            Test del <time dateTime={resultado.creado_en}>{formatoFecha(resultado.creado_en)}</time>
          </p>
          <h1 id="titulo-resultado" className="mt-2 font-titulos text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl" style={esp ? { color: esp.color } : undefined}>
            {esp?.nombre ?? "Sin afinidad clara"}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-ctext-2">{EXPLICACION[resultado.tipo_resultado]}</p>

          <h2 className="mt-10 font-titulos text-xl font-semibold">Tu código RIASEC</h2>
          <ol className="mt-3 flex gap-3">
            {resultado.codigo_riasec.split("").map((letra, i) => (
              <li key={letra} className="flex min-w-24 flex-col items-center rounded-2xl border border-bordes-s/40 bg-cards px-4 py-3">
                <span className="font-titulos text-3xl font-bold" style={{ color: `var(${COLOR_DIMENSION[letra]})` }}>{letra}</span>
                <span className="text-sm">{DIMENSIONES[letra]}</span>
                <span className="sr-only">, posición {i + 1}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-titulos text-xl font-semibold">Interés por especialidad</h2>
          <dl className="mt-4 flex flex-col gap-4">
            {interes.map(([nombre, valor]) => {
              const datos = ESPECIALIDAD_POR_NOMBRE[nombre];
              return (
                <div key={nombre}>
                  <div className="flex justify-between text-sm">
                    <dt className="font-semibold">{datos?.nombre ?? nombre}</dt>
                    <dd className="text-ctext-2">{valor.toFixed(1)} de 5</dd>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-pista" aria-hidden="true">
                    <div className="h-full rounded-full" style={{ width: `${((valor - 1) / 4) * 100}%`, background: datos?.color ?? "var(--primary)" }} />
                  </div>
                </div>
              );
            })}
          </dl>
        </section>

        <section aria-label="Hexágono RIASEC" className="rounded-3xl border border-bordes-s/30 bg-cards p-4 sm:p-8">
          <RadarRiasec dimensiones={resultado.puntajes.dimensiones} />
          <p className="mt-2 text-center text-sm text-ctext-2">Puntaje promedio de 1 a 5 en cada tipo de interés.</p>
        </section>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-bordes-s/30 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex items-start gap-2 text-sm leading-6">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Este resultado se borra el <strong>{formatoFecha(fechaBorrado(resultado.creado_en))}</strong>
            {" "}({dias === 0 ? "hoy" : `en ${dias} ${dias === 1 ? "día" : "días"}`}).
          </span>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/chat" className="btn btn-primary">Conversar con A.N.A</Link>
          <Link href="/test" className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-surfaces">
            Volver a hacer el test
          </Link>
        </div>
      </div>
    </main>
  );
}
