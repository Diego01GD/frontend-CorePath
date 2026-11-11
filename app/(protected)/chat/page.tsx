"use client";

import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowUp, Pause, Play, RotateCcw } from "lucide-react";
import AvatarAna, { TEXTO_ESTADO, type EstadoANA } from "../../components/avatar-ana";
import EnlaceRegresar from "../../components/enlace-regresar";
import SelectorEspecialidad, { AREAS } from "../../components/selector-especialidad";
import { api, ApiError, type Area, type Mensaje } from "@/lib/api";
import { ESPECIALIDADES, listarResultados } from "@/lib/resultados";
import { bloquesIA, partesNegritas } from "@/lib/texto-ia";

type Entrada =
  | { id: number; rol: "alumno"; texto: string }
  | { id: number; rol: "ana"; datos: string; recomendacion: string }
  | { id: number; rol: "error"; texto: string; pregunta: string };

const LIMITE = 500;
const CLAVE_AVISO = "corepath:chat:aviso-especialidad";
const CLAVE_PAUSA = "corepath:chat:animacion-pausada"; // preferencia visual: se recuerda entre visitas

function TextoIA({ texto }: { texto: string }) {
  const negritas = (s: string) => partesNegritas(s).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>));
  return bloquesIA(texto).map((b, i) =>
    b.tipo === "lista" ? (
      <ul key={i} className="list-disc space-y-1 pl-5">
        {b.items.map((x, j) => <li key={j}>{negritas(x)}</li>)}
      </ul>
    ) : (
      <p key={i}>{negritas(b.texto)}</p>
    ),
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [area, setArea] = useState<Area>("ciberseguridad");
  const [aviso, setAviso] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [borrador, setBorrador] = useState("");
  const [esperando, setEsperando] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const [ultimo, setUltimo] = useState<"hablando" | "error" | null>(null);
  const final = useRef<HTMLDivElement>(null);
  const ultimoId = useRef(0);
  const nuevoId = () => ++ultimoId.current;

  const nombreArea = AREAS.find((a) => a.area === area)!.nombre;
  const vacio = entradas.length === 0;
  const estado: EstadoANA = esperando ? "pensando" : ultimo ?? (enfocado && borrador ? "escuchando" : "reposo");

  useEffect(() => {
    // La especialidad arranca en la del último resultado del test; si no hay, Ciberseguridad
    listarResultados()
      .then((rs) => {
        const codigo = rs.find((r) => r.especialidad)?.especialidad;
        if (codigo && ESPECIALIDADES[codigo]) setArea(ESPECIALIDADES[codigo].area);
      })
      .catch(() => {});
    try {
      // Después del montaje: en el servidor no hay localStorage y el HTML inicial debe coincidir
      if (!localStorage.getItem(CLAVE_AVISO)) queueMicrotask(() => setAviso(true));
      if (localStorage.getItem(CLAVE_PAUSA)) queueMicrotask(() => setPausado(true));
    } catch {}
  }, []);

  const cambiarPausa = () => {
    setPausado(!pausado);
    try {
      if (pausado) localStorage.removeItem(CLAVE_PAUSA);
      else localStorage.setItem(CLAVE_PAUSA, "1");
    } catch {}
  };

  useEffect(() => {
    if (ultimo !== "hablando") return;
    const t = setTimeout(() => setUltimo(null), 2700); // lo que dura la animación de "hablando"
    return () => clearTimeout(t);
  }, [ultimo]);

  useEffect(() => {
    if (vacio) return;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    // Respuesta nueva de A.N.A: mostrar su inicio para leerla de arriba abajo; en lo demás, ir al final
    const ultimaRespuesta = !esperando && entradas.at(-1)?.rol !== "alumno";
    if (ultimaRespuesta) final.current?.previousElementSibling?.lastElementChild?.scrollIntoView({ behavior, block: "start" });
    else final.current?.scrollIntoView({ behavior, block: "end" });
  }, [entradas, esperando, vacio]);

  const cerrarAviso = () => {
    setAviso(false);
    try {
      localStorage.setItem(CLAVE_AVISO, "1");
    } catch {}
  };

  const preguntar = async (pregunta: string, previas: Entrada[]) => {
    const historial: Mensaje[] = previas.flatMap((e): Mensaje[] =>
      e.rol === "alumno"
        ? [{ role: "user", content: e.texto }]
        : e.rol === "ana"
          ? [{ role: "assistant", content: `${e.datos}\n\n${e.recomendacion}` }]
          : [],
    );
    setEntradas([...previas, { id: nuevoId(), rol: "alumno", texto: pregunta }]);
    setEsperando(true);
    setUltimo(null);
    try {
      const r = await api.chat(pregunta, area, historial);
      // El backend responde 200 con estado_avatar "error" cuando Ollama no está disponible
      if (r.estado_avatar === "error") throw new ApiError(503, "");
      setEntradas((xs) => [...xs, { id: nuevoId(), rol: "ana", datos: r.datos, recomendacion: r.recomendacion }]);
      setUltimo("hablando");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return router.push("/login");
      const texto =
        e instanceof ApiError && e.status === 0
          ? "No pude responder: el servidor de A.N.A está apagado."
          : e instanceof ApiError && e.status === 429
            ? "Enviaste muchas preguntas seguidas. Espera un minuto e inténtalo de nuevo."
            : "No pude responder en este momento.";
      setEntradas((xs) => [...xs, { id: nuevoId(), rol: "error", texto, pregunta }]);
      setUltimo("error");
    } finally {
      setEsperando(false);
    }
  };

  const enviar = (e?: FormEvent) => {
    e?.preventDefault();
    const pregunta = borrador.trim();
    if (!pregunta || esperando || pregunta.length > LIMITE) return;
    setBorrador("");
    preguntar(pregunta, entradas);
  };

  const reintentar = (id: number, pregunta: string) => {
    // Se quita el error y la pregunta que lo causó; se vuelve a enviar con el mismo historial
    const i = entradas.findIndex((x) => x.id === id);
    preguntar(pregunta, entradas.slice(0, Math.max(0, i - 1)));
  };

  const sugerencias = [
    `¿Qué materias son clave en ${nombreArea}?`,
    "¿Qué herramientas debo aprender?",
    "¿Dónde puedo trabajar al egresar?",
  ];

  // h-0 + grow: el main ocupa justo el alto que deja el encabezado (con flex-1, su base 0% se resuelve al contenido
  // porque el body solo tiene min-h-full, y la página volvía a desplazarse)
  return (
    <main className="mx-auto flex h-0 min-h-0 w-full max-w-264 grow flex-col overflow-hidden px-4 lg:grid lg:grid-cols-[minmax(0,45rem)_18.75rem] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10 lg:px-6">
      {aviso && <div className="fixed inset-0 z-40 bg-black/50 motion-safe:animate-aparecer" aria-hidden="true" onClick={cerrarAviso} />}

      {/* La página no se desplaza: encabezado, barra y A.N.A quedan fijos y solo se desplazan los mensajes.
          Escritorio (lg:contents): la barra ocupa el ancho y A.N.A va en la columna derecha.
          Con el aviso abierto, la barra sube sobre el fondo oscurecido (z-50 > z-40) */}
      <div className={`relative ${aviso ? "z-50" : "z-30"} pb-2 lg:contents`}>
        <div className={`relative ${aviso ? "z-50" : "z-20"} flex items-center justify-between gap-2 py-3 lg:col-span-2 lg:py-6`}>
          <EnlaceRegresar href="/comenzar" volver>
            <span className="max-lg:sr-only">Regresar</span>
          </EnlaceRegresar>
          <SelectorEspecialidad valor={area} onCambiar={setArea} aviso={aviso} onCerrarAviso={cerrarAviso} />
        </div>

        <div
          className={`flex items-center lg:col-start-2 lg:row-start-2 lg:flex-col lg:gap-4 lg:self-start lg:pt-10 ${
            enfocado && !vacio ? "gap-3 max-lg:flex-row" : "flex-col gap-2"
          }`}
        >
          <AvatarAna
            estado={estado}
            pausado={pausado}
            className={`shrink-0 transition-[width,height] duration-300 lg:size-70 ${
              vacio ? "size-42 bajo:size-28" : enfocado ? "size-14" : "size-32 bajo:size-20"
            }`}
          />
          <p className="font-titulos text-2xl font-bold max-lg:hidden">A.N.A</p>
          <div className="flex items-center gap-1">
            <div className={`flex ${enfocado && !vacio ? "flex-col" : ""}`}>
              {enfocado && !vacio && <p className="font-bold lg:hidden">A.N.A</p>}
              <p
                role="status"
                className={`flex items-center gap-2 text-etiqueta lg:sr-only ${
                  enfocado && !vacio ? "text-ctext-2" : "rounded-full border border-bordes-s px-3.5 py-1.5 font-semibold"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${enfocado && !vacio ? "hidden" : estado === "error" ? "bg-error" : estado === "reposo" ? "bg-success" : "bg-primary"}`}
                />
                {TEXTO_ESTADO[estado]}
              </p>
            </div>
            {/* Con "reducir movimiento" del sistema no hay animación que pausar */}
            <button
              type="button"
              onClick={cambiarPausa}
              aria-pressed={pausado}
              aria-label="Pausar animación de A.N.A"
              title={pausado ? "Reanudar animación" : "Pausar animación"}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ctext-2 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hidden"
            >
              {pausado ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <section aria-label="Conversación con A.N.A" className="flex min-h-0 flex-1 flex-col lg:col-start-1 lg:row-start-2">
        <div className="-mx-4 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4">
        {vacio ? (
          <div className="flex flex-1 flex-col pt-2 text-center lg:justify-center lg:pb-16 lg:text-left">
            <h1 className="font-titulos text-3xl leading-tight font-bold lg:text-titulo-chat">¿En qué puedo ayudarte hoy?</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ctext-2 lg:mx-0 lg:mt-3 lg:text-base">
              Pregúntame sobre materias, herramientas o campo laboral de {nombreArea}.
            </p>
            <ul className="mt-auto flex flex-col gap-2 pt-6 lg:mt-6 lg:flex-row lg:flex-wrap lg:pt-0" aria-label="Preguntas sugeridas">
              {sugerencias.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => preguntar(s, entradas)}
                    className="min-h-11 w-full cursor-pointer rounded-full border border-bordes-s bg-cards px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:w-auto"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol role="log" aria-live="polite" aria-label="Mensajes" className="flex flex-1 flex-col justify-end gap-5 py-4 lg:gap-6">
            {entradas.map((e) => (
              <li key={e.id} className={`scroll-mt-4 motion-safe:animate-aparecer ${e.rol === "alumno" ? "flex justify-end" : ""}`}>
                {e.rol === "alumno" ? (
                  <p className="max-w-[85%] rounded-burbuja rounded-br-sm bg-primary/15 px-4 py-3 leading-6 whitespace-pre-wrap lg:max-w-[75%]">
                    <span className="sr-only">Tú: </span>
                    {e.texto}
                  </p>
                ) : (
                  <div className="max-w-full lg:max-w-155">
                    <p className="mb-1 text-etiqueta font-semibold text-ctext-2">A.N.A</p>
                    {e.rol === "ana" ? (
                      <div className="space-y-4 rounded-burbuja rounded-tl-sm bg-cards px-4 py-3 leading-6">
                        <div className="space-y-2">
                          <h2 className="text-sm font-semibold text-ctext-2">Según nuestros datos</h2>
                          <TextoIA texto={e.datos} />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-sm font-semibold text-ctext-2">Consejo de A.N.A</h2>
                          <TextoIA texto={e.recomendacion} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-burbuja rounded-tl-sm border border-error bg-cards px-4 py-3">
                        <p className="flex gap-2 text-sm leading-6">
                          <AlertCircle size={20} className="shrink-0 text-error" aria-hidden="true" />
                          {e.texto}
                        </p>
                        <button
                          type="button"
                          onClick={() => reintentar(e.id, e.pregunta)}
                          disabled={esperando}
                          className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <RotateCcw size={16} aria-hidden="true" />
                          Reintentar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
            {esperando && (
              <li className="motion-safe:animate-aparecer">
                <p className="mb-1 text-etiqueta font-semibold text-ctext-2">A.N.A</p>
                <p className="inline-flex items-center gap-1.5 rounded-burbuja rounded-tl-sm bg-cards px-4 py-3.5 text-sm text-ctext-2">
                  {["", "[animation-delay:150ms]", "[animation-delay:300ms]"].map((retraso) => (
                    <span key={retraso} aria-hidden="true" className={`size-2 rounded-full bg-ctext-2 ${pausado ? "" : "motion-safe:animate-punto"} ${retraso}`} />
                  ))}
                  <span className="ml-1">A.N.A está escribiendo…</span>
                </p>
              </li>
            )}
          </ol>
        )}
        <div ref={final} />
        </div>

        <form onSubmit={enviar} className="pt-2 pb-4">
          <div className="flex items-end gap-3 rounded-3xl border border-bordes-s bg-cards py-1.5 pr-1.5 pl-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
            <label htmlFor="pregunta" className="sr-only">Pregunta para A.N.A</label>
            <textarea
              id="pregunta"
              rows={1}
              value={borrador}
              maxLength={LIMITE}
              onChange={(e) => setBorrador(e.target.value)}
              onFocus={() => setEnfocado(true)}
              onBlur={() => setEnfocado(false)}
              onKeyDown={(e) => {
                // Enter envía; Shift+Enter hace salto de línea. No enviar mientras se compone un acento o carácter (IME)
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) enviar(e);
              }}
              placeholder="Escribe tu pregunta para A.N.A"
              aria-describedby="aviso-ia"
              className="field-sizing-content max-h-40 w-full min-w-0 min-h-11 flex-1 resize-none bg-transparent py-2.5 leading-6 outline-none placeholder:text-ctext-2"
            />
            <button
              type="submit"
              aria-label="Enviar pregunta"
              disabled={!borrador.trim() || esperando}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-primary text-surfaces transition-[opacity,background-color] hover:bg-primary-h focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={20} aria-hidden="true" />
            </button>
          </div>
          <p id="aviso-ia" className="mt-2 flex justify-between gap-4 text-etiqueta text-ctext-2 lg:text-sm">
            <span className="flex-1 text-center lg:text-left">A.N.A es una IA y puede cometer errores.<span className="max-lg:hidden"> Verifica la información importante.</span></span>
            {borrador.length > LIMITE - 100 && <span aria-live="polite">{borrador.length}/{LIMITE}</span>}
          </p>
        </form>
      </section>
    </main>
  );
}
