import Image from "next/image";

export type EstadoANA = "reposo" | "escuchando" | "pensando" | "hablando" | "error";

export const TEXTO_ESTADO: Record<EstadoANA, string> = {
  reposo: "Lista para ayudarte",
  escuchando: "Escuchando…",
  pensando: "Pensando…",
  hablando: "Respondiendo…",
  error: "No pude responder",
};

const MOVIMIENTO: Record<EstadoANA, string> = {
  reposo: "",
  escuchando: "motion-safe:animate-ana-escucha",
  pensando: "motion-safe:animate-ana-piensa",
  hablando: "motion-safe:animate-ana-asiente",
  error: "",
};

// shortcut: imagen fija con un movimiento CSS por estado mientras llega el .riv; al tenerlo, cambiar el <Image>
// por @rive-app/react-canvas (src="/animaciones/ana.riv") y mapear `estado` a las entradas de su máquina de estados.
// El contenedor conserva el tamaño para que el cambio no mueva el diseño. Con Rive, `pausado` detiene la reproducción.
// pausado: WCAG 2.2.2, el movimiento de "pensando" dura más de 5 s y debe poder detenerse
export default function AvatarAna({ estado, pausado = false, className = "" }: { estado: EstadoANA; pausado?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/Lobo_Tec_SF.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 280px, 168px"
        priority
        className={`origin-bottom object-contain ${pausado ? "" : MOVIMIENTO[estado]}`}
      />
    </div>
  );
}
