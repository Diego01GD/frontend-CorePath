"use client";

import { useEffect, useRef, useState } from "react";
import { descartarEvaluacion, enviarEvaluacion, evaluacionPendiente, type Evaluacion } from "@/lib/metricas";

// US-03 (temporal, solo durante las pruebas): califica las vistas que usó y deja recomendaciones.
// Es opcional y anónima; no bloquea el resultado. Se abre unos segundos después para que primero vea su resultado.
const VISTAS = [
  { clave: "inicio_sesion", nombre: "Inicio de sesión" },
  { clave: "test", nombre: "Test" },
  { clave: "resultado", nombre: "Pantalla de resultado" },
] as const;
const MAX_TEXTO = 1000;
const ESPERA_MS = 3000;

type Calificaciones = Record<(typeof VISTAS)[number]["clave"], number | null>;

export default function EvaluacionVistas({ idResultado }: { idResultado: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [calif, setCalif] = useState<Calificaciones>({ inicio_sesion: null, test: null, resultado: null });
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"editando" | "enviando" | "error" | "gracias">("editando");

  useEffect(() => {
    if (!evaluacionPendiente(idResultado)) return;
    const d = dialogo.current;
    const t = setTimeout(() => d && !d.open && d.showModal(), ESPERA_MS);
    // Cualquier forma de cerrar (botón, Esc, fondo) cuenta como respondida u omitida: no se vuelve a pedir
    const alCerrar = () => descartarEvaluacion();
    d?.addEventListener("close", alCerrar);
    return () => {
      clearTimeout(t);
      d?.removeEventListener("close", alCerrar);
      d?.close();
    };
  }, [idResultado]);

  const recomendaciones = texto.trim();
  const hayAlgo = Object.values(calif).some((v) => v !== null) || recomendaciones !== "";

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hayAlgo || estado === "enviando") return;
    setEstado("enviando");
    try {
      await enviarEvaluacion({ ...calif, recomendaciones: recomendaciones || null } satisfies Evaluacion);
      setEstado("gracias");
      descartarEvaluacion();
    } catch {
      setEstado("error");
    }
  };

  return (
    <dialog ref={dialogo} className="modal modal-bottom sm:modal-middle" aria-labelledby="evaluacion-titulo">
      <div className="modal-box max-w-xl bg-cards p-6 text-ctext sm:p-8">
        {estado === "gracias" ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
            <h2 id="evaluacion-titulo" className="font-titulos text-3xl font-bold">¡Gracias!</h2>
            <p className="text-ctext-2">Tu opinión nos ayuda a mejorar CorePath.</p>
            <form method="dialog">
              <button type="submit" className="btn btn-primary" autoFocus>Ver mi resultado</button>
            </form>
          </div>
        ) : (
          <form onSubmit={enviar}>
            <h2 id="evaluacion-titulo" className="font-titulos text-3xl font-bold">¿Cómo te fue con estas pantallas?</h2>
            <p className="mt-2 text-ctext-2">Es opcional y anónimo. Califica de 1 (muy mal) a 5 (muy bien) lo que usaste.</p>

            <div className="mt-6 flex flex-col gap-5">
              {VISTAS.map(({ clave, nombre }) => (
                <fieldset key={clave}>
                  <legend className="mb-2 font-semibold">{nombre}</legend>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((v) => {
                      const activa = calif[clave] === v;
                      return (
                        <label
                          key={v}
                          className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary ${
                            activa ? "border-primary bg-primary text-cards" : "border-bordes-s bg-cards hover:border-primary"
                          }`}
                        >
                          <input
                            type="radio"
                            name={clave}
                            value={v}
                            checked={activa}
                            onChange={() => setCalif({ ...calif, [clave]: v })}
                            className="sr-only"
                          />
                          {v}
                          <span className="sr-only">{v === 1 ? " (muy mal)" : v === 5 ? " (muy bien)" : ""}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <label className="mt-6 flex flex-col gap-2">
              <span className="font-semibold">¿Qué cambiarías o mejorarías?</span>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={MAX_TEXTO}
                rows={3}
                aria-describedby="evaluacion-contador"
                className="textarea w-full border-bordes-s bg-cards text-ctext"
                placeholder="Opcional. No escribas tu nombre ni datos personales."
              />
              <span id="evaluacion-contador" className="self-end text-xs text-ctext-2">
                {texto.length}/{MAX_TEXTO}
              </span>
            </label>

            {estado === "error" && (
              <p role="alert" className="mt-2 text-sm text-error">No se pudo enviar. Revisa tu conexión e intenta de nuevo.</p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => dialogo.current?.close()}>
                Ahora no
              </button>
              <button type="submit" className="btn btn-primary" disabled={!hayAlgo || estado === "enviando"}>
                {estado === "enviando" ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Cerrar</button>
      </form>
    </dialog>
  );
}
