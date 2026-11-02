import Image from "next/image";
import { Download, Sparkles } from "lucide-react";
import EnlaceRegresar from "./enlace-regresar";
import RadarRiasec from "./radar-riasec";
import type { InformeIA } from "@/lib/api";
import { COLOR_DIMENSION, DESCRIPCION_DIMENSION, DIMENSIONES, EXPLICACION, formatoFecha, nivel, UMBRALES, type Resultado } from "@/lib/resultados";
import { datosInforme, nivelCongruencia, ORDEN_RIASEC as ORDEN } from "@/lib/informe";
import { fechaBorrado } from "@/lib/retencion";

type Props = {
  resultado: Resultado;
  correo: string;
  ia: InformeIA | null;
  errorIa: string;
  generando: boolean;
  onDescargar: () => void;
  onReintentar: () => void;
};

/** Informe completo en pantalla (el PDF descargable es lib/informe-pdf.tsx, con los mismos datos). */
export default function InformeVista({ resultado, correo, ia, errorIa, generando, onDescargar, onReintentar }: Props) {
  const esperandoIa = !ia && !errorIa;
  const p = resultado.puntajes;
  const { esp, interes, maxDim, minDim, congruencias, regla } = datosInforme(resultado);

  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl flex-1 px-5 py-6 print:max-w-none print:p-0 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <EnlaceRegresar href={`/resultados/${resultado.id_resultado}`}>Tu resultado</EnlaceRegresar>
        <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
          <button type="button" onClick={onDescargar} disabled={generando || esperandoIa} className="btn btn-primary w-full sm:w-auto">
            {generando ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
            {generando ? "Generando PDF…" : "Descargar PDF"}
          </button>
          {esperandoIa && <span className="text-xs text-ctext-2">Disponible cuando A.N.A termine su comentario.</span>}
        </div>
      </div>

      {/* La "hoja": en pantalla parece papel; al imprimir ocupa la página completa */}
      <article className="informe min-w-0 rounded-3xl border border-bordes-s/30 bg-cards p-5 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none sm:p-12">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-bordes-s/30 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/images/Logo_Tec.svg" width={52} height={57} alt="" />
            <div>
              <p className="font-titulos text-xl font-bold sm:text-2xl">Informe del test vocacional</p>
              <p className="text-sm text-ctext-2">CorePath, Instituto Tecnológico de Mérida</p>
            </div>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-ctext-2">Estudiante</dt>
            <dd className="min-w-0 font-semibold break-all">{correo}</dd>
            <dt className="text-ctext-2">Fecha del test</dt>
            <dd>{formatoFecha(resultado.creado_en)}</dd>
            <dt className="text-ctext-2">Disponible hasta</dt>
            <dd>{formatoFecha(fechaBorrado(resultado.creado_en))}</dd>
          </dl>
        </header>

        <section className="mt-8 break-inside-avoid" aria-labelledby="h-resultado">
          <h2 id="h-resultado" className="text-sm font-semibold text-ctext-2">Tu resultado</h2>
          <p className="mt-1 font-titulos text-4xl leading-tight font-bold" style={esp ? { color: esp.color } : undefined}>
            {esp?.nombre ?? "Sin afinidad clara"}
          </p>
          <p className="mt-1 font-semibold">{resultado.tipo_resultado}</p>
          <p className="mt-3 max-w-2xl leading-7 text-ctext-2">{EXPLICACION[resultado.tipo_resultado]}</p>
        </section>

        <section className="mt-10" aria-labelledby="h-como">
          <h2 id="h-como" className="font-titulos text-2xl font-semibold">Cómo se llegó a esta recomendación</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ctext-2">
            El test combina tres mediciones. Estos son tus números en cada una y la regla que decidió tu resultado.
          </p>

          <ol className="mt-6 flex flex-col gap-8">
            <li className="break-inside-avoid">
              <h3 className="font-semibold">1. Interés directo por especialidad</h3>
              <p className="mt-1 text-sm leading-6 text-ctext-2">
                Promedio de tus respuestas a las actividades de cada especialidad (de 1 a 5). Se recomienda la de mayor interés si llega a {UMBRALES.interesAlto}.
              </p>
              <dl className="mt-3 flex flex-col gap-3">
                {interes.map(({ clave, nombre, valor, color }) => (
                  <div key={clave}>
                    <div className="flex flex-wrap justify-between gap-x-3 text-sm">
                      <dt className="font-semibold">{nombre}</dt>
                      <dd>{valor.toFixed(2)} de 5, interés {nivel(valor)}</dd>
                    </div>
                    <div className="relative mt-1 h-2.5 rounded-full bg-pista" aria-hidden="true">
                      <div className="h-full rounded-full" style={{ width: `${((valor - 1) / 4) * 100}%`, background: color }} />
                      {/* marca del mínimo para recomendar */}
                      <span className="absolute -top-1 h-4.5 w-0.5 bg-ctext" style={{ left: `${((UMBRALES.interesAlto - 1) / 4) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-ctext-2">La línea vertical marca el mínimo de {UMBRALES.interesAlto}.</p>
            </li>

            <li className="break-inside-avoid">
              <h3 className="font-semibold">2. Tu perfil RIASEC</h3>
              <p className="mt-1 text-sm leading-6 text-ctext-2">
                Tu código <strong className="text-ctext">{resultado.codigo_riasec}</strong> son tus tres dimensiones más altas.
                Un perfil es plano si la más alta queda por debajo de {UMBRALES.planoMax.toFixed(1)} o si entre la más alta y la más baja hay menos de {UMBRALES.planoRango} puntos.
              </p>
              <p className="mt-2 text-sm">
                Tu dimensión más alta: <strong>{maxDim.toFixed(2)}</strong>. Diferencia entre la más alta y la más baja: <strong>{(maxDim - minDim).toFixed(2)}</strong>.
                {" "}Perfil plano: <strong>{resultado.perfil_plano ? "sí" : "no"}</strong>.
              </p>
            </li>

            <li className="break-inside-avoid">
              <h3 className="font-semibold">3. Congruencia con cada especialidad</h3>
              <p className="mt-1 text-sm leading-6 text-ctext-2">
                Compara tu código, letra por letra, con el código RIASEC de cada especialidad en el hexágono de Holland. 18 puntos es coincidencia total;
                {" "}{UMBRALES.congruenciaAlta} o más es alta y {UMBRALES.congruenciaMedia} o más es media.
              </p>
              <div className="min-w-0 overflow-x-auto"><table className="mt-3 w-full text-left text-xs sm:text-sm">
                <thead className="text-ctext-2">
                  <tr className="border-b border-bordes-s/30">
                    <th className="py-2 font-semibold">Especialidad</th>
                    <th className="py-2 font-semibold">Su código</th>
                    <th className="py-2 font-semibold">Tu código</th>
                    <th className="py-2 text-right font-semibold">Congruencia</th>
                  </tr>
                </thead>
                <tbody>
                  {congruencias.map(({ nombre, codigo, puntos }) => (
                    <tr key={nombre} className="border-b border-bordes-s/20">
                      <td className="py-2 font-semibold">{nombre}</td>
                      <td className="py-2 tracking-widest">{codigo}</td>
                      <td className="py-2 tracking-widest">{resultado.codigo_riasec}</td>
                      <td className="py-2 text-right">
                        {puntos} de 18 ({nivelCongruencia(puntos)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </li>
          </ol>

          <div className="mt-8 break-inside-avoid rounded-2xl bg-primary/10 p-5 print:border print:border-bordes-s/40">
            <p className="text-sm font-semibold">La regla que decidió tu resultado</p>
            <p className="mt-1 leading-7">
              {regla}
            </p>
          </div>
        </section>

        <section className="mt-10 break-before-page" aria-labelledby="h-dim">
          <h2 id="h-dim" className="font-titulos text-2xl font-semibold">Tus seis dimensiones</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-start print:grid-cols-[16rem_1fr]">
            <div className="mx-auto w-full max-w-xs min-w-0">
              <RadarRiasec dimensiones={p.dimensiones} />
            </div>
            <div className="min-w-0 overflow-x-auto"><table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-ctext-2">
                <tr className="border-b border-bordes-s/30">
                  <th className="py-2 font-semibold">Dimensión</th>
                  <th className="py-2 text-right font-semibold">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {ORDEN.map((d) => (
                  <tr key={d} className="border-b border-bordes-s/20 align-top">
                    <td className="py-2.5 pr-4">
                      <span className="font-semibold" style={{ color: `var(${COLOR_DIMENSION[d]})` }}>
                        {DIMENSIONES[d]} ({d})
                      </span>
                      <span className="block text-ctext-2">{DESCRIPCION_DIMENSION[d]}</span>
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <strong>{(p.dimensiones[d] ?? 0).toFixed(2)}</strong>
                      <span className="block text-ctext-2">{nivel(p.dimensiones[d] ?? 0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
          </div>
        </section>

        <section className="mt-10 break-inside-avoid" aria-labelledby="h-ana" aria-live="polite">
          <h2 id="h-ana" className="flex items-center gap-2 font-titulos text-2xl font-semibold">
            <Sparkles size={22} className="text-accent" aria-hidden="true" />
            Comentario de A.N.A
          </h2>
          <p className="mt-1 text-xs text-ctext-2">
            Generado con inteligencia artificial a partir de tus puntajes y de marcos de competencias del área. Es una orientación, no una decisión:
            coméntalo con tu tutor o tu coordinación de carrera.
          </p>

          {!ia && !errorIa && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-bordes-s/50 p-5 text-ctext-2">
              <span className="loading loading-dots loading-md text-accent" aria-hidden="true" />
              A.N.A está preparando tu comentario. La primera vez puede tardar hasta un minuto.
            </div>
          )}

          {errorIa && (
            <div className="mt-4 rounded-2xl border border-dashed border-bordes-s/50 p-5 print:hidden">
              <p className="text-ctext-2">{errorIa} El resto del informe es válido; puedes descargarlo ahora o intentar de nuevo más tarde.</p>
              <button type="button" onClick={onReintentar} className="btn btn-sm btn-outline mt-3 border-primary text-primary">
                Intentar de nuevo
              </button>
            </div>
          )}

          {ia && (
            <div className="mt-4">
              <p className="leading-7">{ia.resumen}</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3 print:grid-cols-3">
                {([
                  ["Tus fortalezas", ia.fortalezas],
                  ["Para explorar", ia.a_explorar],
                  ["Siguientes pasos", ia.siguientes_pasos],
                ] as const).map(([titulo, items]) => (
                  <div key={titulo}>
                    <h3 className="font-semibold">{titulo}</h3>
                    <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                      {items.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-bordes-s/30 pt-4 text-xs leading-5 text-ctext-2">
          Informe generado por CorePath, asistente vocacional del Instituto Tecnológico de Mérida (TecNM). Basado en el modelo RIASEC de John L. Holland.
          Tus resultados se borran automáticamente el {formatoFecha(fechaBorrado(resultado.creado_en))}; esta descarga es tu copia.
        </footer>
      </article>
    </main>
  );
}
