"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import InformeVista from "../../../../components/informe-vista";
import { api, ApiError, type InformeIA } from "@/lib/api";
import { obtenerResultado, type Resultado } from "@/lib/resultados";
import { createClient } from "@/lib/supabase/client";

export default function InformePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [resultado, setResultado] = useState<Resultado | null | undefined>(undefined);
  const [correo, setCorreo] = useState("");
  const [ia, setIa] = useState<InformeIA | null>(null);
  const [errorIa, setErrorIa] = useState("");

  const pedirComentario = useCallback(
    () =>
      api.informe(id).then(setIa, (e) => {
        if (e instanceof ApiError && e.status === 401) return router.push("/login");
        setErrorIa(
          e instanceof ApiError && e.status === 0
            ? "El servidor de A.N.A está apagado en este momento."
            : "El comentario de A.N.A no está disponible en este momento.",
        );
      }),
    [id, router],
  );

  useEffect(() => {
    obtenerResultado(id).then((r) => {
      setResultado(r);
      // Si el comentario ya está guardado no se llama al backend: funciona aunque el modelo esté apagado
      if (r?.informe_ia) setIa(r.informe_ia);
      else if (r) pedirComentario();
    }, () => setResultado(null));
    createClient().auth.getSession().then(({ data }) => setCorreo(data.session?.user.email ?? ""));
  }, [id, pedirComentario]);

  const [generando, setGenerando] = useState(false);
  const descargar = async () => {
    if (!resultado) return;
    setGenerando(true);
    try {
      // Se carga al usarse: la librería de PDF no pesa en la carga de la página
      const { descargarInforme } = await import("@/lib/informe-pdf");
      await descargarInforme(resultado, ia, correo);
    } finally {
      setGenerando(false);
    }
  };

  if (resultado === undefined) {
    return (
      <main className="flex flex-1 items-center justify-center p-12">
        <span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando tu informe" />
      </main>
    );
  }
  if (resultado === null) {
    return (
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="font-titulos text-3xl font-bold">No encontramos este resultado</h1>
        <p className="text-ctext-2">Puede que ya se haya borrado por cumplir 30 días o que el enlace no sea correcto.</p>
      </main>
    );
  }

  return (
    <InformeVista
      resultado={resultado}
      correo={correo}
      ia={ia}
      errorIa={errorIa}
      generando={generando}
      onDescargar={descargar}
      onReintentar={() => {
        setErrorIa("");
        pedirComentario();
      }}
    />
  );
}
