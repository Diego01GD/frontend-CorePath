"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResultadoDetalle from "../../../components/resultado-detalle";
import { obtenerResultado, type Resultado } from "@/lib/resultados";

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

  return <ResultadoDetalle resultado={resultado} />;
}
