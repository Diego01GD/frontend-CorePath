"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock3, ListChecks, Save } from "lucide-react";
import { api, ApiError, type TestItems } from "@/lib/api";
import { DIAS_RETENCION } from "@/lib/retencion";
import { createClient } from "@/lib/supabase/client";

const ESCALA = [
  { valor: 1, etiqueta: "Nada" },
  { valor: 2, etiqueta: "Poco" },
  { valor: 3, etiqueta: "Algo" },
  { valor: 4, etiqueta: "Bastante" },
  { valor: 5, etiqueta: "Mucho" },
];

type Progreso = { indice: number; respuestas: Record<string, number> };

// Progreso por usuario y versión en este navegador ("Puedes pausar"). El navegador no es fuente de verdad: el backend valida todo.
const claveProgreso = (usuario: string, version: string) =>
  `corepath:test:${usuario}:${version}`;

function leerProgreso(clave: string): Progreso | null {
  try {
    const p = JSON.parse(localStorage.getItem(clave) ?? "null");
    return p && typeof p.indice === "number" && typeof p.respuestas === "object"
      ? p
      : null;
  } catch {
    return null;
  }
}

function guardarProgreso(clave: string, progreso: Progreso | null) {
  try {
    if (progreso) localStorage.setItem(clave, JSON.stringify(progreso));
    else localStorage.removeItem(clave);
  } catch {
    // Modo privado o almacenamiento bloqueado: el test sigue funcionando, solo no se puede pausar
  }
}

export default function TestPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [test, setTest] = useState<TestItems | null>(null);
  const [clave, setClave] = useState("");
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarError = useCallback(
    (e: unknown, mensaje: string) => {
      if (e instanceof ApiError && e.status === 401)
        return router.push("/login");
      // 503 trae un texto genérico del backend; aquí se muestra uno que explica qué hacer
      setError(e instanceof ApiError && e.status !== 503 ? e.message : mensaje);
    },
    [router],
  );

  // Solo obtiene datos (sin setState) para poder usarla en el efecto y en "Reintentar"
  const obtener = useCallback(async () => {
    const [items, { data }] = await Promise.all([
      api.itemsTest(),
      createClient().auth.getSession(),
    ]);
    const k = claveProgreso(
      data.session?.user.id ?? "anonimo",
      items.id_version,
    );
    const guardado = leerProgreso(k);
    const codigos = new Set(items.items.map((i) => i.codigo));
    // Descarta respuestas de ítems que ya no existen en la versión actual
    const validas = Object.fromEntries(
      Object.entries(guardado?.respuestas ?? {}).filter(([c]) =>
        codigos.has(c),
      ),
    );
    return {
      items,
      k,
      validas,
      indice: Math.min(guardado?.indice ?? 0, items.items.length - 1),
    };
  }, []);

  const cargar = useCallback(
    () =>
      obtener().then(
        ({ items, k, validas, indice }) => {
          setClave(k);
          setRespuestas(validas);
          setIndice(indice);
          setTest(items);
        },
        (e) =>
          manejarError(
            e,
            "El test no está disponible en este momento. Intenta de nuevo en unos minutos.",
          ),
      ),
    [obtener, manejarError],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (clave) guardarProgreso(clave, { indice, respuestas });
  }, [clave, indice, respuestas]);

  if (!test) {
    return (
      <main
        className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center"
        aria-live="polite"
      >
        {error ? (
          <>
            <p className="max-w-md text-ctext-2">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError("");
                cargar();
              }}
              className="btn btn-primary"
            >
              Reintentar
            </button>
          </>
        ) : (
          <span
            className="loading loading-spinner loading-lg text-primary"
            aria-label="Cargando el test"
          />
        )}
      </main>
    );
  }

  const total = test.items.length;
  const item = test.items[indice];
  const seleccion = respuestas[item.codigo];
  const contestadas = Object.keys(respuestas).length;
  const porcentaje = Math.round((contestadas / total) * 100);
  const esUltima = indice === total - 1;

  const enviar = async () => {
    setEnviando(true);
    setError("");
    try {
      const r = await api.enviarTest(test.id_version, respuestas);
      guardarProgreso(clave, null);
      // Se queda en "Enviando…" mientras navega al resultado guardado
      router.push(`/resultados/${r.id_resultado}`);
    } catch (e) {
      setEnviando(false);
      manejarError(
        e,
        "No se pudo enviar tu test. Tus respuestas siguen guardadas; intenta de nuevo.",
      );
    }
  };

  const siguiente = () => {
    if (!esUltima) return setIndice(indice + 1);
    // Si dejó alguna sin contestar (p. ej. al volver atrás), lo lleva a la primera pendiente
    const pendiente = test.items.findIndex(
      (i) => respuestas[i.codigo] === undefined,
    );
    if (pendiente >= 0) setIndice(pendiente);
    else enviar();
  };

  const etiquetaSiguiente = enviando
    ? "Enviando…"
    : esUltima
      ? "Ver resultado"
      : "Siguiente";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-center gap-16 px-4 pb-7 pt-6 lg:items-center lg:px-20 lg:pb-15 lg:pt-10">
      <AvisoInicio
        total={total}
        contestadas={contestadas}
        onReiniciar={() => {
          setRespuestas({});
          setIndice(0);
        }}
      />
      <div className="hidden w-90 shrink-0 justify-center lg:flex">
        <figure className="flex lg:w-full w-5/6 items-center justify-center">
          <Image
            src="/images/Lobo_Tec_SF.png"
            width={300}
            height={300}
            alt="Agente Pedagogico A.N.A"
          />
        </figure>
      </div>

      <div className="flex w-full max-w-165 flex-col gap-5 lg:gap-6">
        {/* Progreso (+ A.N.A pequeña en móvil) */}
        <div className="flex items-center gap-4">
          <div className="flex flex-1 flex-col gap-2.5 lg:gap-2">
            <div className="flex items-center justify-between text-sm lg:font-light">
              <span>
                Pregunta {indice + 1}/{total}
              </span>
              <span className="text-ctext-2">{porcentaje}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-lg bg-pista lg:h-5 lg:rounded-xl"
              role="progressbar"
              aria-label="Avance del test"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={porcentaje}
            >
              <div
                className="h-full rounded-lg bg-primary transition-[width] duration-300 lg:rounded-xl"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
          <Image
            src="/images/Lobo_Tec_SF.png"
            alt=""
            width={48}
            height={72}
            className="h-18 w-12 lg:hidden"
          />
        </div>

        {/* Reactivo: lo único que cambia entre preguntas */}
        <section className="rounded-2xl border border-bordes-s/40 bg-panel p-5 lg:border-bordes-s lg:p-7">
          <motion.div
            key={item.codigo}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-3">
              <h1
                id="pregunta"
                className="font-titulos text-2xl leading-7.5 font-semibold lg:text-[29px] lg:leading-normal"
              >
                {item.texto}
              </h1>
              <p id="instruccion" className="text-sm text-ctext-2 lg:text-base">
                Selecciona la opción que mejor refleje tu interés.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="pregunta"
              aria-describedby="instruccion"
              className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            >
              {ESCALA.map(({ valor, etiqueta }) => {
                const activa = seleccion === valor;
                return (
                  <label
                    key={valor}
                    className={`flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary sm:h-24 sm:flex-1 sm:flex-col sm:justify-center sm:gap-2 sm:px-4 ${
                      activa
                        ? "border-primary bg-primary/15"
                        : "border-bordes-s bg-cards hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name={item.codigo}
                      value={valor}
                      checked={activa}
                      onChange={() =>
                        setRespuestas({ ...respuestas, [item.codigo]: valor })
                      }
                      className="sr-only"
                    />
                    <span
                      className="relative size-5 shrink-0 sm:hidden"
                      aria-hidden="true"
                    >
                      <Image
                        src="/images/test/opcion.svg"
                        width={20}
                        height={20}
                        alt=""
                      />
                      {activa && (
                        <span className="absolute inset-1.25 rounded-full bg-primary" />
                      )}
                    </span>
                    <span className="flex-1 font-semibold sm:flex-none">
                      {etiqueta}
                    </span>
                    {/* En móvil el número va en pastilla: la pregunta de control pide "marca el número 2" */}
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold sm:size-auto sm:rounded-none sm:bg-transparent sm:font-light sm:text-ctext-2 ${
                        activa ? "bg-primary text-cards" : "bg-primary/10 text-ctext"
                      }`}
                    >
                      {valor}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        </section>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        {/* Navegación: botones en móvil, enlaces de texto en escritorio */}
        <div className="flex gap-3 lg:justify-between">
          <button
            type="button"
            onClick={() => setIndice(indice - 1)}
            disabled={indice === 0}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-cards font-semibold text-primary transition-colors enabled:cursor-pointer enabled:hover:bg-primary/10 disabled:opacity-40 lg:-ml-4 lg:flex-none lg:rounded-full lg:border-0 lg:bg-transparent lg:pl-2 lg:pr-5"
          >
            <Image
              src="/images/test/chevron-izquierda.svg"
              width={18}
              height={18}
              alt=""
              className="lg:hidden"
            />
            <span className="hidden size-7.5 items-center justify-center lg:flex">
              <Image
                src="/images/test/flecha-anterior.svg"
                width={15}
                height={15}
                alt=""
                className="-scale-x-100"
              />
            </span>
            Anterior
          </button>
          <button
            type="button"
            onClick={siguiente}
            disabled={seleccion === undefined || enviando}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-cards transition-colors enabled:cursor-pointer enabled:hover:bg-primary-h disabled:opacity-40 lg:-mr-4 lg:flex-none lg:rounded-full lg:bg-transparent lg:pl-5 lg:pr-2 lg:text-primary lg:enabled:hover:bg-primary/10"
          >
            {etiquetaSiguiente}
            <Image
              src="/images/test/chevron-derecha.svg"
              width={18}
              height={18}
              alt=""
              className="lg:hidden"
            />
            <span className="hidden size-7.5 items-center justify-center lg:flex">
              <Image
                src="/images/test/flecha-siguiente.svg"
                width={15}
                height={15}
                alt=""
              />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}

// Aviso antes de empezar (o al retomar). Se cierra con el botón, con Esc o al tocar fuera: en todos los casos sigue el test.
function AvisoInicio({
  total,
  contestadas,
  onReiniciar,
}: {
  total: number;
  contestadas: number;
  onReiniciar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const retomando = contestadas > 0;

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
    // Next conserva la página oculta al navegar (cacheComponents): se cierra para reabrirlo limpio al volver
    return () => d?.close();
  }, []);

  return (
    <dialog ref={dialogo} className="modal modal-bottom sm:modal-middle" aria-labelledby="aviso-titulo">
      <div className="modal-box max-w-lg bg-cards p-6 text-ctext sm:p-8">
        <h2 id="aviso-titulo" className="font-titulos text-3xl font-bold">
          {retomando ? "Tienes un test a medias" : "Antes de empezar"}
        </h2>
        {retomando && (
          <p className="mt-2 text-ctext-2">
            Llevas {contestadas} de {total} respuestas. Puedes seguir donde te quedaste.
          </p>
        )}

        <ul className="mt-6 flex flex-col gap-4 leading-6">
          <li className="flex gap-3">
            <ListChecks size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Son {total} preguntas, unos 10 minutos. No hay respuestas correctas: elige qué tanto te gustaría hacer cada actividad.
            </span>
          </li>
          <li className="flex gap-3">
            <Save size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Tu avance se guarda solo en este navegador. Con <strong>Guardar y salir</strong> puedes continuar después, aquí mismo y con tu cuenta.
            </span>
          </li>
          <li className="flex gap-3">
            <Clock3 size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Tu resultado se guarda {DIAS_RETENCION} días y después se borra automáticamente. Lo encuentras en{" "}
              <strong>Mis resultados</strong>, desde el ícono de tu cuenta.
            </span>
          </li>
        </ul>

        <p className="mt-5 text-sm text-ctext-2">
          Consulta cómo usamos tus respuestas en el{" "}
          <Link href="/politica-privacidad" className="font-semibold text-primary underline">
            Aviso de privacidad
          </Link>
          .
        </p>

        <form method="dialog" className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {retomando ? (
            <button type="submit" onClick={onReiniciar} className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-surfaces">
              Empezar de nuevo
            </button>
          ) : (
            <Link href="/comenzar" className="btn btn-ghost">
              Ahora no
            </Link>
          )}
          <button type="submit" className="btn btn-primary" autoFocus>
            {retomando ? "Continuar" : "Comenzar el test"}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Cerrar</button>
      </form>
    </dialog>
  );
}
