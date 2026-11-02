"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3, Download } from "lucide-react";
import { ESPECIALIDADES, formatoFecha, listarResultados, type Resultado } from "@/lib/resultados";
import { DIAS_RETENCION, diasRestantes } from "@/lib/retencion";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const [error, setError] = useState(false);

  const [descargando, setDescargando] = useState<string | null>(null);

  useEffect(() => {
    listarResultados().then(setResultados, () => setError(true));
  }, []);

  // Mismo informe que la vista: plantilla PDF llenada con este resultado (el comentario de A.N.A se pide o reutiliza)
  const descargar = async (r: Resultado) => {
    setDescargando(r.id_resultado);
    try {
      const [{ descargarInforme }, ia, { data }] = await Promise.all([
        import("@/lib/informe-pdf"),
        api.informe(r.id_resultado).catch(() => null), // si A.N.A no está disponible, el PDF sale sin su comentario
        createClient().auth.getSession(),
      ]);
      await descargarInforme(r, ia, data.session?.user.email ?? "");
    } finally {
      setDescargando(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-titulos text-4xl font-bold sm:text-5xl">Mis resultados</h1>
        <Link href="/test" className="btn btn-primary">Hacer el test</Link>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm leading-6">
        <Clock3 size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        Cada resultado se guarda {DIAS_RETENCION} días desde que terminas el test y después se borra automáticamente.
        Si quieres conservarlo, toma una captura o anótalo antes de esa fecha.
      </p>

      <div className="mt-8" aria-live="polite">
        {error && (
          <p className="text-ctext-2">No se pudieron cargar tus resultados. Revisa tu conexión y recarga la página.</p>
        )}

        {!error && resultados === null && (
          <span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando tus resultados" />
        )}

        {resultados?.length === 0 && (
          <div className="rounded-3xl border border-dashed border-bordes-s/50 px-6 py-12 text-center">
            <p className="font-titulos text-2xl font-semibold">Aún no tienes resultados</p>
            <p className="mx-auto mt-2 max-w-sm text-ctext-2">
              Contesta el test vocacional y aquí verás tu perfil de intereses y la especialidad que mejor va contigo.
            </p>
          </div>
        )}

        {!!resultados?.length && (
          <ul className="flex flex-col gap-4">
            {resultados.map((r) => {
              const dias = diasRestantes(r.creado_en);
              const esp = r.especialidad ? ESPECIALIDADES[r.especialidad] : null;
              return (
                <li key={r.id_resultado}>
                  {/* Toda la tarjeta abre el resultado (enlace del título estirado); "Descargar informe" va encima, sin anidar enlaces */}
                  <article className="group relative rounded-2xl border border-bordes-s/40 bg-cards p-5 transition-colors hover:border-primary has-[a:focus-visible]:border-primary sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className="font-titulos text-2xl font-semibold group-hover:text-primary">
                        <Link href={`/resultados/${r.id_resultado}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                          {esp?.nombre ?? "Sin afinidad clara"}
                        </Link>
                      </h2>
                      <time dateTime={r.creado_en} className="text-sm text-ctext-2">{formatoFecha(r.creado_en)}</time>
                    </div>
                    <p className="mt-1 text-sm text-ctext-2">
                      Perfil RIASEC <strong className="font-semibold text-ctext">{r.codigo_riasec}</strong>
                      {r.tipo_resultado !== "Sin afinidad clara" && <>, {r.tipo_resultado.toLowerCase()}</>}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-pista"
                        role="meter"
                        aria-label="Tiempo restante antes del borrado"
                        aria-valuemin={0}
                        aria-valuemax={DIAS_RETENCION}
                        aria-valuenow={dias}
                      >
                        <div
                          className={`h-full rounded-full ${dias <= 5 ? "bg-error" : "bg-primary"}`}
                          style={{ width: `${(dias / DIAS_RETENCION) * 100}%` }}
                        />
                      </div>
                      <span className={`shrink-0 text-sm font-semibold ${dias <= 5 ? "text-error" : ""}`}>
                        {dias === 0 ? "Se borra hoy" : `Se borra en ${dias} ${dias === 1 ? "día" : "días"}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => descargar(r)}
                      disabled={descargando !== null}
                      aria-label={`Descargar informe del test del ${formatoFecha(r.creado_en)}`}
                      className="relative z-10 mt-4 -mx-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-primary transition-colors enabled:cursor-pointer enabled:hover:bg-primary/10 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {descargando === r.id_resultado ? (
                        <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                      ) : (
                        <Download size={16} aria-hidden="true" />
                      )}
                      {descargando === r.id_resultado ? "Preparando…" : "Descargar informe"}
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
